<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['authenticated' => false]);
    exit;
}

echo json_encode([
    'authenticated' => true,
    'role' => $_SESSION['role'], // 'admin', 'staff', 'user'
    'userName' => $_SESSION['userName'],
    'email' => $_SESSION['email']
]);