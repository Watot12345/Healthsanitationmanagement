<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
file_put_contents('/tmp/ai-snapshot.log', date('Y-m-d H:i:s') . " - Called\n", FILE_APPEND);
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
        echo json_encode(['status' => 'success', 'insights' => json_decode($cached['insights'], true)]);
        exit;
    }

    if ($apiKey === '' || $apiKey === 'PUT_YOUR_GEMINI_API_KEY_HERE') {
        if ($cached) {
            echo json_encode(['status' => 'success', 'insights' => json_decode($cached['insights'], true)]);
            exit;
        }
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'AI insights need a Gemini API key.']);
        exit;
    }

    // ─── FETCH DATA ───────────────────────────────────────────
    $appointments = (int) $conn->query("SELECT COUNT(*) FROM appointments")->fetchColumn();
    $permitsPending = (int) $conn->query("SELECT COUNT(*) FROM permits WHERE status = 'Pending'")->fetchColumn();
    $permitsTotal = (int) $conn->query("SELECT COUNT(*) FROM permits")->fetchColumn();
    $activeCases = (int) $conn->query("SELECT COUNT(*) FROM alerts WHERE status = 'Active'")->fetchColumn();
    $alertCaseTotal = (int) $conn->query("SELECT COALESCE(SUM(cases), 0) FROM alerts WHERE status = 'Active'")->fetchColumn();
    
    $healthTotal = (int) $conn->query("SELECT COUNT(*) FROM appointments")->fetchColumn();
    $sanitationTotal = (int) $conn->query("SELECT COUNT(*) FROM permits")->fetchColumn();
    $immunizationTotal = (int) $conn->query("SELECT COUNT(*) FROM activity_logs WHERE module = 'Immunization'")->fetchColumn();
    $wastewaterTotal = (int) $conn->query("SELECT COUNT(*) FROM wastewater_requests")->fetchColumn();

    $topDisease = $conn->query("SELECT disease, SUM(cases) AS total FROM alerts WHERE status = 'Active' GROUP BY disease ORDER BY total DESC LIMIT 1")->fetch(PDO::FETCH_ASSOC);
    if (!$topDisease || empty($topDisease['disease'])) $topDisease = ['disease' => 'None', 'total' => 0];

    $apptMonthly = [];
    for ($i = 5; $i >= 0; $i--) {
        $apptMonthly[] = (int) $conn->query("SELECT COUNT(*) FROM appointments WHERE MONTH(created_at) = MONTH(NOW() - INTERVAL $i MONTH)")->fetchColumn();
    }
    $permitMonthly = [];
    for ($i = 5; $i >= 0; $i--) {
        $permitMonthly[] = (int) $conn->query("SELECT COUNT(*) FROM permits WHERE MONTH(created_at) = MONTH(NOW() - INTERVAL $i MONTH)")->fetchColumn();
    }

    $diseaseData = $conn->query("SELECT disease, SUM(cases) AS total FROM alerts WHERE status = 'Active' GROUP BY disease ORDER BY total DESC")->fetchAll(PDO::FETCH_ASSOC);
    $diseaseSummary = '';
    foreach ($diseaseData as $d) { $diseaseSummary .= "{$d['disease']}: {$d['total']} cases\n"; }

    $months = ['Jan','Feb','Mar','Apr','May','Jun'];
    $apptMonthlySummary = '';
    foreach ($apptMonthly as $i => $v) { $apptMonthlySummary .= "$months[$i]: $v\n"; }
    $permitMonthlySummary = '';
    foreach ($permitMonthly as $i => $v) { $permitMonthlySummary .= "$months[$i]: $v\n"; }

    // ─── COMPREHENSIVE PROMPT ──────────────────────────────────
  // ─── COMPACT PROMPT ────────────────────────────────────────
$prompt = <<<PROMPT
You are a municipal health decision support AI embedded in an analytics dashboard. Analyze this data and return a compact card for each chart.

CURRENT DATA:
Appointments: {$appointments} total. Monthly: {$apptMonthlySummary}
Permits: {$permitsPending} pending of {$permitsTotal}. Monthly: {$permitMonthlySummary}
Disease Alerts: {$activeCases} active, {$alertCaseTotal} total cases
Top Disease: {$topDisease['disease']} ({$topDisease['total']} cases)
Services: Health {$healthTotal} | Sanitation {$sanitationTotal} | Immunization {$immunizationTotal} | Wastewater {$wastewaterTotal}
Disease Breakdown: {$diseaseSummary}

RULES:
- Use only the data provided
- Keep every field under 20 words
- Return ONLY valid JSON, no markdown

RETURN THIS EXACT JSON STRUCTURE:
{
  "snapshot": {
    "status": "Normal|Attention|Warning|Critical",
    "headline": "max 6 words",
    "summary": "max 25 words",
    "priority": "Low|Medium|High",
    "confidence": 0
  },
  "insights": [
    {
      "chart": "service_requests",
      "badge": "Trend|Risk|Anomaly|Forecast|Opportunity|Stable",
      "title": "max 4 words",
      "insight": "max 18 words",
      "recommendation": "max 10 words",
      "confidence": 0
    },
    {
      "chart": "disease_surveillance",
      "badge": "Trend|Risk|Anomaly|Forecast|Opportunity|Stable",
      "title": "max 4 words",
      "insight": "max 18 words",
      "recommendation": "max 10 words",
      "confidence": 0
    },
    {
      "chart": "service_distribution",
      "badge": "Trend|Risk|Anomaly|Forecast|Opportunity|Stable",
      "title": "max 4 words",
      "insight": "max 18 words",
      "recommendation": "max 10 words",
      "confidence": 0
    }
  ]
}
PROMPT;

    // ─── CALL GEMINI ──────────────────────────────────────────
    $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
    $payload = [
        'contents' => [['parts' => [['text' => $prompt]]]],
        'generationConfig' => [
            'temperature' => 0.3,
            'maxOutputTokens' => 800,
            'responseMimeType' => 'application/json'
        ]
    ];

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'x-goog-api-key: ' . $apiKey
        ],
        CURLOPT_POSTFIELDS => json_encode($payload),
        CURLOPT_TIMEOUT => 30
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($response === false || $httpCode >= 400) {
        error_log("AI Snapshot API Error: HTTP $httpCode, cURL: $curlError, Response: " . substr($response, 0, 200));
        if ($cached) {
            echo json_encode(['status' => 'success', 'insights' => json_decode($cached['insights'], true)]);
            exit;
        }
        
        // Generate fallback insights based on actual data
        $fallbackInsights = [
            'snapshot' => [
                'status' => $activeCases > 30 ? 'Warning' : 'Normal',
                'headline' => 'System Status Overview',
                'summary' => "Monitoring $appointments appointments, $permitsTotal permits, and $activeCases disease alerts.",
                'priority' => $activeCases > 30 ? 'High' : 'Medium',
                'confidence' => 75
            ],
            'insights' => [
                [
                    'chart' => 'service_requests',
                    'badge' => 'Trend',
                    'title' => 'Service Activity',
                    'insight' => "Total of $appointments appointments recorded in the system.",
                    'recommendation' => 'Monitor service demand trends',
                    'confidence' => 80
                ],
                [
                    'chart' => 'disease_surveillance',
                    'badge' => $activeCases > 30 ? 'Risk' : 'Stable',
                    'title' => 'Disease Monitoring',
                    'insight' => "Currently tracking $activeCases active disease alerts with $alertCaseTotal total cases.",
                    'recommendation' => $activeCases > 30 ? 'Review high-priority alerts' : 'Continue routine monitoring',
                    'confidence' => 85
                ],
                [
                    'chart' => 'service_distribution',
                    'badge' => 'Stable',
                    'title' => 'Service Distribution',
                    'insight' => "Services distributed across health, sanitation, immunization, and wastewater management.",
                    'recommendation' => 'Maintain balanced resource allocation',
                    'confidence' => 90
                ]
            ],
            '_stats' => [
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
                'total_services' => $healthTotal + $sanitationTotal + $immunizationTotal + $wastewaterTotal
            ]
        ];
        
        echo json_encode(['status' => 'success', 'insights' => $fallbackInsights, 'source' => 'fallback']);
        exit;
    }

    $result = json_decode($response, true);
    $insights = null;
    $rawText = trim($result['candidates'][0]['content']['parts'][0]['text'] ?? '');

    if ($rawText) {
        $rawText = trim(str_replace(['```json', '```'], '', $rawText));
        $decoded = json_decode($rawText, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            // Check if it has the expected structure
            if (isset($decoded['insights']) && is_array($decoded['insights'])) {
                $insights = $decoded['insights'];
            } else {
                $insights = $decoded;
            }
        }
    }

    if ($insights !== null && is_array($insights)) {
        // Ensure _stats is always populated with real data
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
            'total_services' => $healthTotal + $sanitationTotal + $immunizationTotal + $wastewaterTotal
        ];

        // Store in cache
        $conn->exec("DELETE FROM ai_insights_cache");
        $stmt = $conn->prepare("INSERT INTO ai_insights_cache (insights, generated_at) VALUES (?, NOW())");
        $stmt->execute([json_encode($insights)]);

        echo json_encode(['status' => 'success', 'insights' => $insights]);
    } else {
        // Fallback to cached if available
        if ($cached) {
            echo json_encode(['status' => 'success', 'insights' => json_decode($cached['insights'], true)]);
            exit;
        }
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'AI insights are temporarily unavailable.']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'AI insights are temporarily unavailable.']);
}