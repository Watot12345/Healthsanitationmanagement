<?php
session_start();
require_once __DIR__ . '/../../config/database.php';

header('Content-Type: application/json');

// Verify auth
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Not authenticated.']);
    exit;
}

// Get the question from POST
$input = json_decode(file_get_contents('php://input'), true);
$question = trim($input['question'] ?? '');

if (empty($question)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Question is required.']);
    exit;
}

$config = require __DIR__ . '/../../config/env.php';
$apiKey = trim($config['gemini_key'] ?? '');

if ($apiKey === '' || $apiKey === 'PUT_YOUR_GEMINI_API_KEY_HERE') {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'AI chat is not configured. Add your Gemini API key in config/env.local.php.'
    ]);
    exit;
}

try {
    $db = new Database();
    $conn = $db->getConnection();

    if (!$conn) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Database connection failed.']);
        exit;
    }

    // ─── GATHER CURRENT SYSTEM DATA ──────────────────────────

    // Appointments
    $totalAppts = (int) $conn->query("SELECT COUNT(*) FROM appointments")->fetchColumn();
    $pendingAppts = (int) $conn->query("SELECT COUNT(*) FROM appointments WHERE status = 'Pending'")->fetchColumn();
    $approvedAppts = (int) $conn->query("SELECT COUNT(*) FROM appointments WHERE status = 'Approved'")->fetchColumn();
    $completedAppts = (int) $conn->query("SELECT COUNT(*) FROM appointments WHERE status = 'Completed'")->fetchColumn();
    $rejectedAppts = (int) $conn->query("SELECT COUNT(*) FROM appointments WHERE status = 'Rejected'")->fetchColumn();
    $highTriage = (int) $conn->query("SELECT COUNT(*) FROM appointments WHERE triage = 'High' OR triage = 'Critical'")->fetchColumn();

    $apptServices = $conn->query("SELECT service, COUNT(*) AS cnt FROM appointments GROUP BY service ORDER BY cnt DESC")->fetchAll(PDO::FETCH_ASSOC);
    $apptServicesStr = '';
    foreach ($apptServices as $s) {
        $apptServicesStr .= "{$s['service']}: {$s['cnt']}\n";
    }

    // Permits
    $totalPermits = (int) $conn->query("SELECT COUNT(*) FROM permits")->fetchColumn();
    $pendingPermits = (int) $conn->query("SELECT COUNT(*) FROM permits WHERE status = 'Pending'")->fetchColumn();
    $approvedPermits = (int) $conn->query("SELECT COUNT(*) FROM permits WHERE status = 'Approved'")->fetchColumn();
    $rejectedPermits = (int) $conn->query("SELECT COUNT(*) FROM permits WHERE status = 'Rejected'")->fetchColumn();
    $unassignedPermits = (int) $conn->query("SELECT COUNT(*) FROM permits WHERE inspector = 'Unassigned'")->fetchColumn();

    $permitTypes = $conn->query("SELECT type, COUNT(*) AS cnt FROM permits GROUP BY type ORDER BY cnt DESC")->fetchAll(PDO::FETCH_ASSOC);
    $permitTypesStr = '';
    foreach ($permitTypes as $p) {
        $permitTypesStr .= "{$p['type']}: {$p['cnt']}\n";
    }

    // Alerts / Diseases
    $totalAlerts = (int) $conn->query("SELECT COUNT(*) FROM alerts WHERE status = 'Active'")->fetchColumn();
    $totalCases = (int) $conn->query("SELECT COALESCE(SUM(cases), 0) FROM alerts WHERE status = 'Active'")->fetchColumn();
    $diseaseData = $conn->query("SELECT disease, SUM(cases) AS total, barangay FROM alerts WHERE status = 'Active' GROUP BY disease ORDER BY total DESC")->fetchAll(PDO::FETCH_ASSOC);
    $diseaseStr = '';
    foreach ($diseaseData as $d) {
        $diseaseStr .= "{$d['disease']}: {$d['total']} cases in {$d['barangay']}\n";
    }

    $barangayData = $conn->query("SELECT barangay, COUNT(*) AS cnt, SUM(cases) AS total_cases FROM alerts WHERE status = 'Active' GROUP BY barangay ORDER BY total_cases DESC")->fetchAll(PDO::FETCH_ASSOC);
    $barangayStr = '';
    foreach ($barangayData as $b) {
        $barangayStr .= "{$b['barangay']}: {$b['cnt']} alerts, {$b['total_cases']} cases\n";
    }

    // Violations
    $totalViolations = (int) $conn->query("SELECT COUNT(*) FROM violations")->fetchColumn();
    $openViolations = (int) $conn->query("SELECT COUNT(*) FROM violations WHERE status = 'Open'")->fetchColumn();
    $criticalViolations = (int) $conn->query("SELECT COUNT(*) FROM violations WHERE risk = 'Critical' AND status != 'Resolved'")->fetchColumn();
    $repeatOffenders = (int) $conn->query("SELECT COUNT(*) FROM violations WHERE repeat_offender = 1")->fetchColumn();

    $violationTypes = $conn->query("SELECT type, COUNT(*) AS cnt FROM violations GROUP BY type ORDER BY cnt DESC")->fetchAll(PDO::FETCH_ASSOC);
    $violationTypesStr = '';
    foreach ($violationTypes as $v) {
        $violationTypesStr .= "{$v['type']}: {$v['cnt']}\n";
    }

    // Wastewater
    $totalWastewater = (int) $conn->query("SELECT COUNT(*) FROM wastewater_requests")->fetchColumn();
    $pendingWastewater = (int) $conn->query("SELECT COUNT(*) FROM wastewater_requests WHERE status = 'Pending'")->fetchColumn();
    $criticalWastewater = (int) $conn->query("SELECT COUNT(*) FROM wastewater_requests WHERE priority = 'Critical' AND status != 'Completed'")->fetchColumn();

    // Violation scores
    $avgViolationScore = (int) $conn->query("SELECT COALESCE(AVG(score), 0) FROM violations")->fetchColumn();

    // Users
    $totalUsers = (int) $conn->query("SELECT COUNT(*) FROM users")->fetchColumn();
    $activeUsers = (int) $conn->query("SELECT COUNT(*) FROM users WHERE is_active = 1")->fetchColumn();

    // Recent activity
    $recentLogs = $conn->query("SELECT action, user_name, created_at FROM activity_logs ORDER BY created_at DESC LIMIT 10")->fetchAll(PDO::FETCH_ASSOC);
    $recentLogsStr = '';
    foreach ($recentLogs as $l) {
        $recentLogsStr .= "{$l['user_name']}: {$l['action']} ({$l['created_at']})\n";
    }

    // ─── BUILD SYSTEM CONTEXT ─────────────────────────────────
    $systemContext = <<<CONTEXT
You are a Municipal Health & Sanitation AI Assistant. You answer questions about the current state of the health and sanitation system using ONLY the data provided below. Be concise, accurate, and helpful.

CURRENT SYSTEM DATA:

APPOINTMENTS:
- Total: {$totalAppts}
- Pending: {$pendingAppts}
- Approved: {$approvedAppts}
- Completed: {$completedAppts}
- Rejected: {$rejectedAppts}
- High/Critical Triage: {$highTriage}
By Service:
{$apptServicesStr}

PERMITS:
- Total: {$totalPermits}
- Pending: {$pendingPermits}
- Approved: {$approvedPermits}
- Rejected: {$rejectedPermits}
- Unassigned Inspectors: {$unassignedPermits}
By Type:
{$permitTypesStr}

DISEASE ALERTS:
- Active Alerts: {$totalAlerts}
- Total Case Count: {$totalCases}
Disease Breakdown:
{$diseaseStr}
By Barangay:
{$barangayStr}

VIOLATIONS:
- Total: {$totalViolations}
- Open: {$openViolations}
- Critical/Unresolved: {$criticalViolations}
- Repeat Offenders: {$repeatOffenders}
- Average Compliance Score: {$avgViolationScore}/100
By Type:
{$violationTypesStr}

WASTEWATER REQUESTS:
- Total: {$totalWastewater}
- Pending: {$pendingWastewater}
- Critical Unresolved: {$criticalWastewater}

USERS:
- Total: {$totalUsers}
- Active: {$activeUsers}

RECENT ACTIVITY:
{$recentLogsStr}

RULES:
1. Answer from the data only. Never make up numbers.
2. Be conversational but professional.
3. If asked about something not in the data, say so politely.
4. Keep responses under 150 words unless asked for detail.
5. When relevant, suggest what action the user should take.
CONTEXT;

    // ─── CALL GEMINI API WITH THE QUESTION + CONTEXT ─────────
    $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" . $apiKey;
    
    $prompt = $systemContext . "\n\n---\nUser Question: " . $question . "\n\nAnswer concisely based on the data above.";

    $payload = [
        'contents' => [['parts' => [['text' => $prompt]]]],
        'generationConfig' => [
            'temperature' => 0.4,
            'maxOutputTokens' => 500
        ]
    ];

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_POSTFIELDS => json_encode($payload),
        CURLOPT_TIMEOUT => 30
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($response === false || $httpCode >= 400) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'AI service is temporarily unavailable.']);
        exit;
    }

    $result = json_decode($response, true);
    $answer = '';

    if (!empty($result['candidates'][0]['content']['parts'][0]['text'])) {
        $answer = trim($result['candidates'][0]['content']['parts'][0]['text']);
    }

    if (empty($answer)) {
        $answer = "I couldn't generate an answer from the current data. Please try rephrasing your question.";
    }

    echo json_encode([
        'status' => 'success',
        'question' => $question,
        'answer' => $answer,
        'timestamp' => date('Y-m-d H:i:s')
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'An error occurred.']);
}
