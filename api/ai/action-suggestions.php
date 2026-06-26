<?php
session_start();
require_once __DIR__ . '/../../config/database.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Not authenticated.']);
    exit;
}

$config = require __DIR__ . '/../../config/env.php';
$apiKey = trim($config['gemini_key'] ?? '');

if ($apiKey === '' || $apiKey === 'PUT_YOUR_GEMINI_API_KEY_HERE') {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'AI action suggestions need a Gemini API key in config/env.local.php.'
    ]);
    exit;
}

function countValue(PDO $conn, string $sql): int {
    try {
        return (int) $conn->query($sql)->fetchColumn();
    } catch (Exception $e) {
        return 0;
    }
}

function parseAiJson(string $text): ?array {
    $text = trim($text);
    $text = preg_replace('/^```(?:json)?\s*/i', '', $text);
    $text = preg_replace('/```\s*$/', '', $text);

    $decoded = json_decode($text, true);
    if (is_array($decoded)) {
        return $decoded;
    }

    if (preg_match('/\{.*\}/s', $text, $match)) {
        $decoded = json_decode($match[0], true);
        if (is_array($decoded)) {
            return $decoded;
        }
    }

    return null;
}

function cleanActionSuggestions(array $decoded): array {
    $raw = $decoded['suggestions'] ?? [];
    $clean = [];
    $allowedPriorities = ['High', 'Medium', 'Low'];

    if (!is_array($raw)) {
        return [];
    }

    foreach ($raw as $item) {
        if (!is_array($item)) {
            continue;
        }

        $title = trim((string) ($item['title'] ?? ''));
        $detail = trim((string) ($item['detail'] ?? ''));
        $priority = trim((string) ($item['priority'] ?? 'Medium'));
        $module = trim((string) ($item['module'] ?? 'Operations'));

        if ($title === '' || $detail === '') {
            continue;
        }

        if (!in_array($priority, $allowedPriorities, true)) {
            $priority = 'Medium';
        }

        $clean[] = [
            'title' => substr($title, 0, 80),
            'detail' => substr($detail, 0, 180),
            'priority' => $priority,
            'module' => substr($module !== '' ? $module : 'Operations', 0, 40)
        ];
    }

    return array_slice($clean, 0, 4);
}

try {
    $db = new Database();
    $conn = $db->getConnection();

    if (!$conn) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Database connection failed.']);
        exit;
    }

    $context = [
        'pending_permits' => countValue($conn, "SELECT COUNT(*) FROM permits WHERE status = 'Pending'"),
        'unassigned_permits' => countValue($conn, "SELECT COUNT(*) FROM permits WHERE inspector = 'Unassigned'"),
        'high_or_critical_appointments' => countValue($conn, "SELECT COUNT(*) FROM appointments WHERE triage = 'High' OR triage = 'Critical'"),
        'active_alerts' => countValue($conn, "SELECT COUNT(*) FROM alerts WHERE status = 'Active'"),
        'active_alert_cases' => countValue($conn, "SELECT COALESCE(SUM(cases), 0) FROM alerts WHERE status = 'Active'"),
        'open_violations' => countValue($conn, "SELECT COUNT(*) FROM violations WHERE status = 'Open'"),
        'critical_unresolved_violations' => countValue($conn, "SELECT COUNT(*) FROM violations WHERE risk = 'Critical' AND status != 'Resolved'"),
        'pending_wastewater_requests' => countValue($conn, "SELECT COUNT(*) FROM wastewater_requests WHERE status = 'Pending'"),
        'critical_wastewater_requests' => countValue($conn, "SELECT COUNT(*) FROM wastewater_requests WHERE priority = 'Critical' AND status != 'Completed'"),
    ];

    $contextJson = json_encode($context, JSON_PRETTY_PRINT);
    $prompt = <<<PROMPT
You are an AI assistant for a municipal health and sanitation dashboard.

Use this current system data:
{$contextJson}

Generate up to 4 practical next actions for staff.

Return ONLY valid JSON:
{
  "status": "success",
  "suggestions": [
    {
      "title": "short action title",
      "detail": "one sentence explaining why this action matters using the supplied data",
      "priority": "High|Medium|Low",
      "module": "Sanitation|Health Center|Surveillance|Compliance|Wastewater|Operations"
    }
  ]
}

Rules:
1. Use only the data supplied above.
2. Do not invent numbers.
3. Do not approve, reject, diagnose, or finalize any record.
4. Focus on actions a staff member should review.
PROMPT;

    $url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' . urlencode($apiKey);
    $payload = [
        'contents' => [['parts' => [['text' => $prompt]]]],
        'generationConfig' => [
            'temperature' => 0.2,
            'maxOutputTokens' => 600,
            'responseMimeType' => 'application/json'
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
        throw new Exception('AI service unavailable');
    }

    $result = json_decode($response, true);
    $text = $result['candidates'][0]['content']['parts'][0]['text'] ?? '';
    $decoded = parseAiJson($text);

    if (!$decoded) {
        throw new Exception('AI returned invalid JSON');
    }

    echo json_encode([
        'status' => 'success',
        'source' => 'gemini',
        'suggestions' => cleanActionSuggestions($decoded)
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Unable to generate AI action suggestions.']);
}
