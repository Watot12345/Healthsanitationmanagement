<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once __DIR__ . '/../config/database.php';

$database = new Database();
$conn = $database->getConnection();

if (!$conn) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

$full_name = $data['full_name'] ?? '';
$username = $data['username'] ?? '';
$email = $data['email'] ?? '';
$department = $data['department'] ?? '';
$role = $data['role'] ?? '';

if (empty($full_name) || empty($username) || empty($email) || empty($department) || empty($role)) {
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit();
}

try {
    // Check if username or email exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
    $stmt->execute([$username, $email]);
    
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => false, 'message' => 'Username or email already exists']);
        exit();
    }
    
    // Generate random password
    $temp_password = bin2hex(random_bytes(4));
    $hash = password_hash($temp_password, PASSWORD_BCRYPT);
    
    // Insert user
    $stmt = $conn->prepare("INSERT INTO users (username, email, password_hash, role, full_name, department, is_active) 
                           VALUES (?, ?, ?, ?, ?, ?, 1)");
    $stmt->execute([$username, $email, $hash, $role, $full_name, $department]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Staff created successfully',
        'temp_password' => $temp_password
    ]);
    
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>