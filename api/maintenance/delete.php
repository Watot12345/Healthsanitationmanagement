<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
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
    $schedule_id = $input['schedule_id'] ?? '';
    
    if (empty($schedule_id)) {
        echo json_encode(['success' => false, 'message' => 'Schedule ID required']);
        exit();
    }
    
    $numeric_id = preg_replace('/[^0-9]/', '', $schedule_id);
    
    $stmt = $pdo->prepare("DELETE FROM maintenance_schedules WHERE id = ?");
    $stmt->execute([$numeric_id]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Schedule deleted successfully'
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}