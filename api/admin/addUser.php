<?php
session_start();
require_once __DIR__ . '/../../config/database.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Access denied']);
    exit;
}

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

// Insert user
$hash = password_hash($password, PASSWORD_DEFAULT);
$stmt = $conn->prepare("INSERT INTO users (full_name, email, role, password_hash, is_active, created_at) VALUES (?, ?, ?, ?, 1, NOW())");
$stmt->execute([$name, $email, $role, $hash]);

// Log activity
$stmt = $conn->prepare("INSERT INTO activity_logs (user_name, action, module, level) VALUES (?, ?, ?, ?)");
$stmt->execute([$_SESSION['userName'], "User $name added as $role", 'User Management', 'info']);

echo json_encode(['success' => true, 'message' => 'User added successfully']);