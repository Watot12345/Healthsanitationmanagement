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

try {
    $database = new Database();
    $pdo = $database->getConnection();
    
    $input = json_decode(file_get_contents('php://input'), true);
    $record_id = $input['record_id'] ?? '';
    
    if (empty($record_id)) {
        echo json_encode(['success' => false, 'message' => 'Record ID required']);
        exit();
    }
    
    $numeric_id = preg_replace('/[^0-9]/', '', $record_id);
    
    // Check exists
    $stmt = $pdo->prepare("SELECT id FROM medical_records WHERE id = ?");
    $stmt->execute([$numeric_id]);
    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Record not found']);
        exit();
    }
    
    // Delete
    $stmt = $pdo->prepare("DELETE FROM medical_records WHERE id = ?");
    $stmt->execute([$numeric_id]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Medical record deleted successfully'
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}