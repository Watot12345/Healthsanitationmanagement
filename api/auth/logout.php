<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$headers = getallheaders();
$token = str_replace('Bearer ', '', $headers['Authorization'] ?? '');

echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
?>