<?php
session_start();
require_once __DIR__ . '/../../config/database.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? 0;
$status = $data['status'] ?? '';

if (!$id || !$status) {
    echo json_encode(['success' => false]);
    exit;
}

$db = new Database();
$conn = $db->getConnection();

$stmt = $conn->prepare("UPDATE violations SET status = ? WHERE id = ?");
$stmt->execute([$status, $id]);

echo json_encode(['success' => true, 'message' => "Violation {$status}"]);