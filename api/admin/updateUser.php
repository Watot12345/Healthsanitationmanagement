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
$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$role = trim($data['role'] ?? '');
$status = trim($data['status'] ?? 'Active');

if (!$id || !$name || !$email) {
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

$db = new Database();
$conn = $db->getConnection();

// Check if email exists for another user
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
$stmt->execute([$email, $id]);
if ($stmt->fetch()) {
    echo json_encode(['success' => false, 'message' => 'Email already in use']);
    exit;
}

$isActive = $status === 'Active' ? 1 : 0;
$stmt = $conn->prepare("UPDATE users SET full_name = ?, email = ?, role = ?, is_active = ? WHERE id = ?");
$stmt->execute([$name, $email, $role, $isActive, $id]);

// Log activity
$stmt = $conn->prepare("INSERT INTO activity_logs (user_name, action, module, level) VALUES (?, ?, ?, ?)");
$stmt->execute([$_SESSION['userName'], "User $name updated (ID: $id)", 'User Management', 'info']);

echo json_encode(['success' => true, 'message' => 'User updated successfully']);