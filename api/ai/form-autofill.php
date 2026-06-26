<?php
session_start();
require_once __DIR__ . '/../../config/database.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Not authenticated.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$type = trim($input['type'] ?? '');
$notes = trim($input['notes'] ?? '');

if ($type === '' || $notes === '') {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Type and notes are required.']);
    exit;
}

$config = require __DIR__ . '/../../config/env.php';
$apiKey = trim($config['gemini_key'] ?? '');

if ($apiKey === '' || $apiKey === 'PUT_YOUR_GEMINI_API_KEY_HERE') {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'AI auto-fill needs a Gemini API key in config/env.local.php.'
    ]);
    exit;
}

$db = new Database();
$conn = $db->getConnection();

if (!$conn) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed.']);
    exit;
}

function fetchColumnValues(PDO $conn, string $sql): array {
    try {
        return array_values(array_filter($conn->query($sql)->fetchAll(PDO::FETCH_COLUMN)));
    } catch (Exception $e) {
        return [];
    }
}

function allowedFieldsForType(string $type): array {
    $fields = [
        'appointment' => ['service_type', 'reason', 'priority_hint'],
        'permit' => ['permit_type', 'business_name', 'address'],
        'surveillance' => ['disease', 'cases', 'barangay', 'severity', 'suggested_action'],
        'alert' => ['disease', 'cases', 'barangay', 'severity', 'suggested_action'],
        'sanitation' => ['violation_type', 'risk_level', 'recommended_inspector', 'inspection_time', 'permit_id', 'suggested_action'],
        'violation' => ['violation_type', 'risk_level', 'recommended_inspector', 'inspection_time', 'permit_id', 'suggested_action'],
        'admin-user' => ['full_name', 'email', 'role'],
        'admin-violation' => ['title', 'severity', 'action'],
    ];

    return $fields[$type] ?? [];
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

function cleanSuggestions(array $decoded, array $allowedFields): array {
    $rawSuggestions = $decoded['suggestions'] ?? [];
    $clean = [];

    if (!is_array($rawSuggestions)) {
        return [];
    }

    foreach ($rawSuggestions as $item) {
        if (!is_array($item)) {
            continue;
        }

        $field = trim((string) ($item['field'] ?? ''));
        if ($field === '' || !in_array($field, $allowedFields, true)) {
            continue;
        }

        $value = $item['value'] ?? '';
        if (is_string($value)) {
            $value = trim($value);
        }

        if ($value === '' || $value === []) {
            continue;
        }

        $clean[] = ['field' => $field, 'value' => $value];
    }

    return $clean;
}

$allowedFields = allowedFieldsForType($type);
if (empty($allowedFields)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Unsupported form type.']);
    exit;
}

$context = [
    'appointment_services' => fetchColumnValues($conn, "SELECT service FROM appointments GROUP BY service ORDER BY COUNT(*) DESC LIMIT 10"),
    'permit_types' => fetchColumnValues($conn, "SELECT type FROM permits GROUP BY type ORDER BY COUNT(*) DESC LIMIT 10"),
    'inspectors' => fetchColumnValues($conn, "SELECT inspector FROM permits WHERE inspector IS NOT NULL AND inspector <> 'Unassigned' GROUP BY inspector ORDER BY COUNT(*) DESC LIMIT 10"),
    'diseases' => fetchColumnValues($conn, "SELECT disease FROM alerts GROUP BY disease ORDER BY COUNT(*) DESC LIMIT 10"),
    'barangays' => fetchColumnValues($conn, "SELECT barangay FROM alerts GROUP BY barangay ORDER BY COUNT(*) DESC LIMIT 10"),
    'violation_types' => fetchColumnValues($conn, "SELECT type FROM violations GROUP BY type ORDER BY COUNT(*) DESC LIMIT 10"),
    'open_permit_ids' => fetchColumnValues($conn, "SELECT id FROM permits WHERE status = 'Pending' ORDER BY created_at DESC LIMIT 10"),
];

$allowedFieldsJson = json_encode($allowedFields, JSON_PRETTY_PRINT);
$contextJson = json_encode($context, JSON_PRETTY_PRINT);

$prompt = <<<PROMPT
You are helping staff fill a municipal health and sanitation system form.

Form type: {$type}
Allowed fields: {$allowedFieldsJson}
Current system options:
{$contextJson}

Staff note:
{$notes}

Return ONLY valid JSON in this format:
{
  "status": "success",
  "suggestions": [
    {"field": "allowed_field_name", "value": "suggested value"}
  ]
}

Rules:
1. Use only allowed field names.
2. Do not invent IDs. For permit_id, use only one of the open_permit_ids.
3. Prefer current system options when they fit the note.
4. Leave uncertain fields out instead of guessing.
5. Do not approve, reject, or finalize any record.
PROMPT;

try {
    $url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' . urlencode($apiKey);
    $payload = [
        'contents' => [['parts' => [['text' => $prompt]]]],
        'generationConfig' => [
            'temperature' => 0.2,
            'maxOutputTokens' => 500,
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

    $suggestions = cleanSuggestions($decoded, $allowedFields);
    echo json_encode([
        'status' => 'success',
        'source' => 'gemini',
        'suggestions' => $suggestions
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'AI auto-fill is unavailable right now.'
    ]);
}
