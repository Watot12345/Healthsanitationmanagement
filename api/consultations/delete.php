<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../config/database.php';

session_start();
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit();
}

// Only admin can delete
if (($_SESSION['role'] ?? '') !== 'admin') {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Admin access required']);
    exit();
}

try {
    $database = new Database();
    $pdo = $database->getConnection();
    
    $input = json_decode(file_get_contents('php://input'), true);
    $consultation_id = $input['consultation_id'] ?? '';
    
    if (empty($consultation_id)) {
        echo json_encode(['success' => false, 'message' => 'Consultation ID required']);
        exit();
    }
    
    // Extract numeric ID from CON-XXX format
    $numeric_id = preg_replace('/[^0-9]/', '', $consultation_id);
    
    // Check if consultation exists
    $stmt = $pdo->prepare("SELECT id FROM consultations WHERE id = ?");
    $stmt->execute([$numeric_id]);
    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Consultation not found']);
        exit();
    }
    
    // Delete consultation
    $stmt = $pdo->prepare("DELETE FROM consultations WHERE id = ?");
    $stmt->execute([$numeric_id]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Consultation deleted successfully'
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}