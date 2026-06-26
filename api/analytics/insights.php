<?php
session_start();
require_once __DIR__ . '/../../config/database.php';

header('Content-Type: application/json');

$config = require __DIR__ . '/../../config/env.php';
$apiKey = trim($config['gemini_key']);

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

    $appointments = $conn->query("SELECT COUNT(*) FROM appointments")->fetchColumn();
    $permitsPending = $conn->query("SELECT COUNT(*) FROM permits WHERE status = 'Pending'")->fetchColumn();
    $alertsActive = $conn->query("SELECT COUNT(*) FROM alerts WHERE status = 'Active'")->fetchColumn();

    $topDisease = $conn->query("
        SELECT disease, SUM(cases) AS total
        FROM alerts
        GROUP BY disease
        ORDER BY total DESC
        LIMIT 1
    ")->fetch(PDO::FETCH_ASSOC);

    if (!$topDisease || empty($topDisease['disease'])) {
        $topDisease = ['disease' => 'None reported', 'total' => 0];
    }

    $prompt = "
You are an experienced municipal public health analyst generating executive insights for a Health & Sanitation Management Information System.

Current Statistics
- Total Appointments: $appointments
- Pending Sanitation Permits: $permitsPending
- Active Disease Alerts: $alertsActive
- Most Reported Disease: {$topDisease['disease']} ({$topDisease['total']} cases)

Instructions:
- Generate EXACTLY 3 insights.
- Maximum 25 words per insight.
- Use ONLY the statistics provided.
- Never invent numbers, trends, comparisons, or historical information.
- If a value is zero, acknowledge it appropriately instead of assuming a problem.
- Keep the language professional and suitable for municipal officials.
- Make recommendations that are practical for a local health office.
- Avoid generic phrases like 'continue monitoring', 'stay vigilant', or 'monitor the situation'.
- Return only a structured JSON object matching the requested schema.
";

    $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" . $apiKey;
    $payload = [
        'contents' => [['parts' => [['text' => $prompt]]]],
        'generationConfig' => [
            'responseMimeType' => 'application/json',
            'responseSchema' => [
                'type' => 'OBJECT',
                'properties' => [
                    'operational' => [
                        'type' => 'OBJECT',
                        'properties' => [
                            'title' => ['type' => 'STRING'],
                            'icon' => ['type' => 'STRING'],
                            'text' => ['type' => 'STRING']
                        ],
                        'required' => ['title', 'icon', 'text']
                    ],
                    'risk' => [
                        'type' => 'OBJECT',
                        'properties' => [
                            'title' => ['type' => 'STRING'],
                            'icon' => ['type' => 'STRING'],
                            'level' => ['type' => 'STRING'],
                            'text' => ['type' => 'STRING']
                        ],
                        'required' => ['title', 'icon', 'level', 'text']
                    ],
                    'action' => [
                        'type' => 'OBJECT',
                        'properties' => [
                            'title' => ['type' => 'STRING'],
                            'icon' => ['type' => 'STRING'],
                            'priority' => ['type' => 'STRING'],
                            'text' => ['type' => 'STRING']
                        ],
                        'required' => ['title', 'icon', 'priority', 'text']
                    ]
                ],
                'required' => ['operational', 'risk', 'action']
            ]
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