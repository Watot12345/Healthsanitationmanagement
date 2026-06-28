<?php
session_start();
require_once __DIR__ . '/../../config/database.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Access denied']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? 0;

if (!$id) {
    echo json_encode(['success' => false, 'message' => 'Invalid user ID']);
    exit;
}

$db = new Database();
$conn = $db->getConnection();

// Don't let admin delete themselves
$stmt = $conn->prepare("SELECT id FROM users WHERE id = ? AND id != ?");
$stmt->execute([$id, $_SESSION['user_id']]);

if (!$stmt->fetch()) {
    echo json_encode(['success' => false, 'message' => 'Cannot delete yourself or user not found']);
    exit;
}

$stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
$stmt->execute([$id]);

// Log activity
$stmt = $conn->prepare("INSERT INTO activity_logs (user_name, action, module, level) VALUES (?, ?, ?, ?)");
$stmt->execute([$_SESSION['userName'], "User deleted (ID: $id)", 'User Management', 'warning']);

echo json_encode(['success' => true, 'message' => 'User deleted successfully']);