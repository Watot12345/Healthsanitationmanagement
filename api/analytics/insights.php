<?php
session_start();
require_once __DIR__ . '/../../config/database.php';

header('Content-Type: application/json');

$config = require __DIR__ . '/../../config/env.php';
$apiKey = trim($config['gemini_key'] ?? '');

try {
    $db = new Database();
    $conn = $db->getConnection();

    if (!$conn) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'AI insights are unavailable right now.']);
        exit;
    }

    // ─── CHECK CACHE ──────────────────────────────────────────
    $stmt = $conn->query("SELECT insights, generated_at FROM ai_insights_cache ORDER BY id DESC LIMIT 1");
    $cached = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($cached && strtotime($cached['generated_at']) > strtotime('-1 hour')) {
        echo json_encode([
            'status' => 'success',
            'insights' => json_decode($cached['insights'], true)
        ]);
        exit;
    }
    // ─── END CACHE CHECK ──────────────────────────────────────

    if ($apiKey === '' || $apiKey === 'PUT_YOUR_GEMINI_API_KEY_HERE') {
        if ($cached) {
            echo json_encode(['status' => 'success', 'insights' => json_decode($cached['insights'], true)]);
            exit;
        }

        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'AI insights need a Gemini API key in config/env.local.php.']);
        exit;
    }

    // ─── FETCH COMPREHENSIVE DATA ─────────────────────────────
    $appointments = (int) $conn->query("SELECT COUNT(*) FROM appointments")->fetchColumn();
    
    // Permit counts
    $permitsPending = (int) $conn->query("SELECT COUNT(*) FROM permits WHERE status = 'Pending'")->fetchColumn();
    $permitsCompleted = (int) $conn->query("SELECT COUNT(*) FROM permits WHERE status = 'Approved' OR status = 'Completed'")->fetchColumn();
    $permitsRejected = (int) $conn->query("SELECT COUNT(*) FROM permits WHERE status = 'Rejected'")->fetchColumn();
    $permitsTotal = (int) $conn->query("SELECT COUNT(*) FROM permits")->fetchColumn();
    
    // Case counts
    $activeCases = (int) $conn->query("SELECT COUNT(*) FROM alerts WHERE status = 'Active'")->fetchColumn();
    $alertCaseTotal = (int) $conn->query("SELECT COALESCE(SUM(cases), 0) FROM alerts WHERE status = 'Active'")->fetchColumn();
    
    // Disease breakdown
    $diseaseData = $conn->query("
        SELECT disease, SUM(cases) AS total, COUNT(*) AS alerts_count 
        FROM alerts 
        WHERE status = 'Active'
        GROUP BY disease 
        ORDER BY total DESC
    ")->fetchAll(PDO::FETCH_ASSOC);
    if (empty($diseaseData)) $diseaseData = [['disease' => 'None reported', 'total' => 0, 'alerts_count' => 0]];

    // Top disease
    $topDisease = $conn->query("
        SELECT disease, SUM(cases) AS total 
        FROM alerts 
        WHERE status = 'Active'
        GROUP BY disease 
        ORDER BY total DESC 
        LIMIT 1
    ")->fetch(PDO::FETCH_ASSOC);
    if (!$topDisease || empty($topDisease['disease'])) {
        $topDisease = ['disease' => 'None reported', 'total' => 0];
    }

    // Barangay statistics
    $barangayData = $conn->query("
        SELECT barangay, COUNT(*) AS total_cases, SUM(cases) AS total_reports
        FROM alerts 
        WHERE status = 'Active'
        GROUP BY barangay 
        ORDER BY total_reports DESC
    ")->fetchAll(PDO::FETCH_ASSOC);
    if (empty($barangayData)) $barangayData = [['barangay' => 'None', 'total_cases' => 0, 'total_reports' => 0]];

    // Service distribution (same as stats.php)
    $healthTotal = (int) $conn->query("SELECT COUNT(*) FROM appointments")->fetchColumn();
    $sanitationTotal = (int) $conn->query("SELECT COUNT(*) FROM permits")->fetchColumn();
    $immunizationTotal = (int) $conn->query("SELECT COUNT(*) FROM activity_logs WHERE module = 'Immunization'")->fetchColumn();
    $wastewaterTotal = (int) $conn->query("SELECT COUNT(*) FROM wastewater_requests")->fetchColumn();
    $totalServices = $healthTotal + $sanitationTotal + $immunizationTotal + $wastewaterTotal;

    // Monthly appointment counts (for trend context)
    $apptMonthly = [];
    for ($i = 5; $i >= 0; $i--) {
        $count = $conn->query("SELECT COUNT(*) FROM appointments WHERE MONTH(created_at) = MONTH(NOW() - INTERVAL $i MONTH)")->fetchColumn();
        $apptMonthly[] = (int)$count;
    }
    
    $permitMonthly = [];
    for ($i = 5; $i >= 0; $i--) {
        $count = $conn->query("SELECT COUNT(*) FROM permits WHERE MONTH(created_at) = MONTH(NOW() - INTERVAL $i MONTH)")->fetchColumn();
        $permitMonthly[] = (int)$count;
    }

    // Historical weekly data (last 8 weeks)
    $weeklyHistory = $conn->query("
        SELECT WEEK(created_at) AS week, YEAR(created_at) AS year, COUNT(*) AS total
        FROM alerts
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 8 WEEK)
        GROUP BY YEAR(created_at), WEEK(created_at)
        ORDER BY year DESC, week DESC
    ")->fetchAll(PDO::FETCH_ASSOC);
    if (empty($weeklyHistory)) $weeklyHistory = [['week' => 0, 'year' => date('Y'), 'total' => 0]];

    // Historical monthly data (last 6 months)
    $monthlyHistory = $conn->query("
        SELECT MONTH(created_at) AS month, YEAR(created_at) AS year, COUNT(*) AS total
        FROM alerts
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        GROUP BY YEAR(created_at), MONTH(created_at)
        ORDER BY year DESC, month DESC
    ")->fetchAll(PDO::FETCH_ASSOC);
    if (empty($monthlyHistory)) $monthlyHistory = [['month' => date('m'), 'year' => date('Y'), 'total' => 0]];

    // Historical yearly data
    $yearlyHistory = $conn->query("
        SELECT YEAR(created_at) AS year, COUNT(*) AS total
        FROM alerts
        GROUP BY YEAR(created_at)
        ORDER BY year DESC
    ")->fetchAll(PDO::FETCH_ASSOC);
    if (empty($yearlyHistory)) $yearlyHistory = [['year' => (int)date('Y'), 'total' => 0]];

    // Format data for prompt
    $diseaseSummary = '';
    foreach ($diseaseData as $d) {
        $diseaseSummary .= "{$d['disease']}: {$d['total']} cases ({$d['alerts_count']} alerts)\n";
    }

    $barangaySummary = '';
    foreach ($barangayData as $b) {
        $barangaySummary .= "{$b['barangay']}: {$b['total_reports']} reports\n";
    }

    $weeklySummary = '';
    foreach ($weeklyHistory as $w) {
        $weeklySummary .= "Week {$w['week']} {$w['year']}: {$w['total']} cases\n";
    }

    $monthlySummary = '';
    foreach ($monthlyHistory as $m) {
        $monthNames = ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        $monthlySummary .= "{$monthNames[(int)$m['month']]} {$m['year']}: {$m['total']} cases\n";
    }

    $yearlySummary = '';
    foreach ($yearlyHistory as $y) {
        $yearlySummary .= "{$y['year']}: {$y['total']} cases\n";
    }

    $apptMonthlySummary = '';
    $months = ['Jan','Feb','Mar','Apr','May','Jun'];
    foreach ($apptMonthly as $i => $v) {
        $apptMonthlySummary .= "$months[$i]: $v appointments\n";
    }

    $permitMonthlySummary = '';
    foreach ($permitMonthly as $i => $v) {
        $permitMonthlySummary .= "$months[$i]: $v permits\n";
    }

    // ─── BUILD PROMPT ──────────────────────────────────────────
    $prompt = <<<PROMPT
You are an AI Municipal Health Decision Support Analyst for a Health & Sanitation Management System.

Your role is NOT to summarize data.

Your role is to analyze operational trends, identify risks, detect anomalies, prioritize issues, and provide executive-level recommendations for municipal officials.

You are expected to think like a combination of:

• Municipal Health Officer
• Public Health Epidemiologist
• Operations Manager
• Data Analyst
• Executive Decision Support Advisor

====================================================
CRITICAL RULES
====================================================

1. NEVER fabricate statistics.

2. ONLY use the supplied database values.

3. Explain WHY a metric matters instead of repeating numbers.

4. Detect patterns whenever possible.

5. Compare historical data with current data.

6. Prioritize recommendations according to risk.

7. Identify possible future operational problems.

8. Keep recommendations practical and actionable.

9. Produce concise executive-level language.

10. Return VALID JSON ONLY.

====================================================
AVAILABLE DATA
====================================================

Current Statistics

Total Appointments (all time): {$appointments}

Pending Permits: {$permitsPending}
Completed Permits: {$permitsCompleted}  
Rejected Permits: {$permitsRejected}
Total Permits (all time): {$permitsTotal}

Active Disease Cases: {$activeCases}
Total Alert Cases (sum of all cases): {$alertCaseTotal}

Service Distribution:
- Health Center: {$healthTotal}
- Sanitation: {$sanitationTotal}
- Immunization: {$immunizationTotal}
- Wastewater: {$wastewaterTotal}
- Total Services: {$totalServices}

Disease Breakdown:
{$diseaseSummary}

Top Disease: {$topDisease['disease']} ({$topDisease['total']} cases)

Barangay Statistics:
{$barangaySummary}

Monthly Appointments Trend:
{$apptMonthlySummary}

Monthly Permits Trend:
{$permitMonthlySummary}

Historical Weekly Data:
{$weeklySummary}

Historical Monthly Data:
{$monthlySummary}

Historical Yearly Data:
{$yearlySummary}

====================================================
ANALYSIS REQUIREMENTS
====================================================

Automatically determine:

• Appointment trends
• Disease trends
• Permit processing efficiency
• Processing bottlenecks
• High-risk barangays
• Low-performing barangays
• Increasing disease outbreaks
• Declining disease outbreaks
• Seasonal patterns
• Unusual spikes
• Sudden decreases
• Resource demand
• Operational workload
• Inspection priorities
• Health service demand

====================================================
TREND ANALYSIS
====================================================

Compare current data against historical data where available.

Determine if each metric is:
Increasing
Stable
Decreasing

For every trend explain:
What changed
Why it matters
Potential consequences
Suggested response

====================================================
ANOMALY DETECTION
====================================================

Detect unusual situations such as:
Unexpected disease spikes
Permit processing slowdown
Appointment surges
Sudden increase in rejected permits
Inactive barangays
Rapid workload growth
Potential outbreak indicators

Explain why each anomaly is important.

====================================================
RISK ASSESSMENT
====================================================

Calculate:
Municipal Health Score (0-100)
Operational Efficiency Score (0-100)
Risk Score (0-100)
Confidence Score (0-100)

Determine:
Low Risk
Moderate Risk
High Risk
Critical Risk

Explain how the score was determined using only supplied data.

====================================================
EARLY WARNING SYSTEM
====================================================

Generate early warning alerts when appropriate.

Examples:
Increasing respiratory illnesses
Permit backlog growing rapidly
Inspection demand exceeding capacity
Health services nearing overload
Possible outbreak indicators

Each alert should contain:
Severity
Description
Reason
Recommended immediate action

====================================================
CROSS-MODULE ANALYSIS
====================================================

Analyze relationships between datasets.

Example:
If appointments increase while disease cases increase, suggest increased healthcare demand.
If disease cases increase while permits remain pending, highlight sanitation compliance risks.
If rejected permits increase alongside disease cases, identify possible public health concerns.

Correlate findings whenever supported by the data.

====================================================
RECOMMENDATIONS
====================================================

Prioritize recommendations by impact.

Each recommendation must include:
Priority
Reason
Expected Impact
Suggested Action
Timeframe

====================================================
EXECUTIVE SUMMARY
====================================================

Write a concise executive briefing suitable for municipal officials.

Include:
Overall municipal health condition
Major concerns
Positive developments
Operational readiness
Highest priority issue
Immediate next steps

====================================================
INSIGHTS
====================================================

Generate exactly THREE intelligent insight cards.

Each insight must contain:
Title
Icon (use Font Awesome icon names like fa-chart-line, fa-triangle-exclamation, fa-lightbulb, fa-water, fa-virus, fa-hospital, fa-clock, fa-users, fa-shield, fa-check-circle)
Category (Operational, Risk, or Action)
Severity (Low, Medium, High)
Trend (Increasing, Stable, Decreasing)
Description
Reason
Recommendation

Avoid repeating database values directly.
Focus on interpretation.

====================================================
OUTPUT FORMAT
====================================================

Return ONLY valid JSON.

{
  "municipal_health_score": integer 0-100,
  "operational_efficiency_score": integer 0-100,
  "risk_score": integer 0-100,
  "confidence_score": integer 0-100,
  "overall_risk": "Low | Moderate | High | Critical",
  "executive_summary": "...",
  "trend_analysis": [
    {
      "metric": "",
      "trend": "Increasing | Stable | Decreasing",
      "comparison": "Previous Month",
      "reason": "",
      "impact": "",
      "recommendation": ""
    }
  ],
  "early_warnings": [
    {
      "severity": "High | Medium | Low",
      "title": "",
      "description": "",
      "recommended_action": ""
    }
  ],
  "recommendations": [
    {
      "priority": "High | Medium | Low",
      "reason": "",
      "action": "",
      "expected_impact": "",
      "timeframe": ""
    }
  ],
  "insights": [
    {
      "title": "",
      "icon": "fa-chart-line",
      "category": "Operational",
      "severity": "Medium",
      "trend": "Increasing",
      "description": "",
      "reason": "",
      "recommendation": ""
    },
    {
      "title": "",
      "icon": "fa-triangle-exclamation",
      "category": "Risk",
      "severity": "High",
      "trend": "Increasing",
      "description": "",
      "reason": "",
      "recommendation": ""
    },
    {
      "title": "",
      "icon": "fa-lightbulb",
      "category": "Action",
      "severity": "Medium",
      "trend": "Stable",
      "description": "",
      "reason": "",
      "recommendation": ""
    }
  ]
}

Do not include markdown.
Do not include explanations.
Do not wrap the JSON in code blocks.
Return JSON only.
PROMPT;

    // ─── CALL GEMINI API ──────────────────────────────────────
    $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" . $apiKey;
    $payload = [
        'contents' => [['parts' => [['text' => $prompt]]]],
        'generationConfig' => [
            'responseMimeType' => 'application/json',
            'responseSchema' => [
                'type' => 'OBJECT',
                'properties' => [
                    'municipal_health_score' => ['type' => 'INTEGER'],
                    'operational_efficiency_score' => ['type' => 'INTEGER'],
                    'risk_score' => ['type' => 'INTEGER'],
                    'confidence_score' => ['type' => 'INTEGER'],
                    'overall_risk' => ['type' => 'STRING'],
                    'executive_summary' => ['type' => 'STRING'],
                    'trend_analysis' => [
                        'type' => 'ARRAY',
                        'items' => [
                            'type' => 'OBJECT',
                            'properties' => [
                                'metric' => ['type' => 'STRING'],
                                'trend' => ['type' => 'STRING'],
                                'comparison' => ['type' => 'STRING'],
                                'reason' => ['type' => 'STRING'],
                                'impact' => ['type' => 'STRING'],
                                'recommendation' => ['type' => 'STRING']
                            ],
                            'required' => ['metric', 'trend', 'comparison', 'reason', 'impact', 'recommendation']
                        ]
                    ],
                    'early_warnings' => [
                        'type' => 'ARRAY',
                        'items' => [
                            'type' => 'OBJECT',
                            'properties' => [
                                'severity' => ['type' => 'STRING'],
                                'title' => ['type' => 'STRING'],
                                'description' => ['type' => 'STRING'],
                                'recommended_action' => ['type' => 'STRING']
                            ],
                            'required' => ['severity', 'title', 'description', 'recommended_action']
                        ]
                    ],
                    'recommendations' => [
                        'type' => 'ARRAY',
                        'items' => [
                            'type' => 'OBJECT',
                            'properties' => [
                                'priority' => ['type' => 'STRING'],
                                'reason' => ['type' => 'STRING'],
                                'action' => ['type' => 'STRING'],
                                'expected_impact' => ['type' => 'STRING'],
                                'timeframe' => ['type' => 'STRING']
                            ],
                            'required' => ['priority', 'reason', 'action', 'expected_impact', 'timeframe']
                        ]
                    ],
                    'insights' => [
                        'type' => 'ARRAY',
                        'items' => [
                            'type' => 'OBJECT',
                            'properties' => [
                                'title' => ['type' => 'STRING'],
                                'icon' => ['type' => 'STRING'],
                                'category' => ['type' => 'STRING'],
                                'severity' => ['type' => 'STRING'],
                                'trend' => ['type' => 'STRING'],
                                'description' => ['type' => 'STRING'],
                                'reason' => ['type' => 'STRING'],
                                'recommendation' => ['type' => 'STRING']
                            ],
                            'required' => ['title', 'icon', 'category', 'severity', 'trend', 'description', 'reason', 'recommendation']
                        ]
                    ]
                ],
                'required' => [
                    'municipal_health_score', 'operational_efficiency_score', 'risk_score', 'confidence_score',
                    'overall_risk', 'executive_summary', 'trend_analysis', 'early_warnings', 'recommendations', 'insights'
                ]
            ]
        ]
    ];

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_POSTFIELDS => json_encode($payload),
        CURLOPT_TIMEOUT => 60
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($response === false || $httpCode >= 400) {
        // Return cached version if available
        if ($cached) {
            echo json_encode(['status' => 'success', 'insights' => json_decode($cached['insights'], true)]);
            exit;
        }
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'AI insights are temporarily unavailable.']);
        exit;
    }

    $result = json_decode($response, true);
    $insights = null;

    if (!empty($result['candidates'][0]['content']['parts'][0]['text'])) {
        $rawText = trim($result['candidates'][0]['content']['parts'][0]['text']);
        if (strpos($rawText, '```json') === 0) {
            $rawText = substr($rawText, 7);
            if (substr($rawText, -3) === '```') $rawText = substr($rawText, 0, -3);
        } elseif (strpos($rawText, '```') === 0) {
            $rawText = substr($rawText, 3);
            if (substr($rawText, -3) === '```') $rawText = substr($rawText, 0, -3);
        }
        $rawText = trim($rawText);
        $decodedText = json_decode($rawText, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($decodedText)) {
            $insights = $decodedText;
        }
    }

    if ($insights !== null) {
        // Attach the same aggregated stats that stats.php provides,
        // so the frontend KPI cards and the AI insights are always in sync
        $insights['_stats'] = [
            'appointments' => $apptMonthly,
            'permits' => $permitMonthly,
            'distribution' => [
                'health' => $healthTotal,
                'sanitation' => $sanitationTotal,
                'immunization' => $immunizationTotal,
                'wastewater' => $wastewaterTotal
            ],
            'disease_cases' => $alertCaseTotal,
            'active_alerts' => $activeCases,
            'total_appointments' => $appointments,
            'total_permits' => $permitsTotal,
            'total_services' => $totalServices
        ];

        // Save to cache
        $conn->exec("DELETE FROM ai_insights_cache");
        $stmt = $conn->prepare("INSERT INTO ai_insights_cache (insights, generated_at) VALUES (?, NOW())");
        $stmt->execute([json_encode($insights)]);

        echo json_encode(['status' => 'success', 'insights' => $insights]);
    } else {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'AI insights are temporarily unavailable.']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'AI insights are temporarily unavailable.']);
}
