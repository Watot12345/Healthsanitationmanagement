<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once __DIR__ . '/../config/database.php';

$database = new Database();
$conn = $database->getConnection();

if (!$conn) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit();
}

try {
    // Total staff
    $stmt = $conn->query("SELECT COUNT(*) FROM users");
    $total_staff = $stmt->fetchColumn();
    
    // Active today (logged in today)
    $stmt = $conn->query("SELECT COUNT(*) FROM users WHERE DATE(last_login) = CURDATE()");
    $active_today = $stmt->fetchColumn();
    
    // Pending (inactive users)
    $stmt = $conn->query("SELECT COUNT(*) FROM users WHERE is_active = 0");
    $pending = $stmt->fetchColumn();
    
    echo json_encode([
        'success' => true,
        'total_staff' => $total_staff,
        'active_today' => $active_today,
        'pending' => $pending
    ]);
    
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error']);
}
?>