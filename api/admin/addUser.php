<?php
session_start();
require_once __DIR__ . '/../../config/database.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$role = trim($data['role'] ?? '');
$password = trim($data['password'] ?? '');

if (!$name || !$email || !$role || !$password) {
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

$db = new Database();
$conn = $db->getConnection();

// Check if email exists
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetch()) {
    echo json_encode(['success' => false, 'message' => 'Email already exists']);
    exit;
}

$hash = password_hash($password, PASSWORD_DEFAULT);
$username = strtolower(explode(' ', $name)[0]) . '.' . strtolower(explode(' ', $name)[1] ?? '');

$stmt = $conn->prepare("INSERT INTO users (username, full_name, email, password_hash, role, department, is_active) VALUES (?, ?, ?, ?, ?, ?, 1)");
$stmt->execute([$username, $name, $email, $hash, $role, $role . ' Department']);

// Log activity
$stmt = $conn->prepare("INSERT INTO activity_logs (user_name, action, module, level) VALUES (?, ?, ?, ?)");
$stmt->execute([$_SESSION['userName'], "User $name added as $role", 'User Management', 'info']);

echo json_encode(['success' => true, 'message' => 'User added successfully']);