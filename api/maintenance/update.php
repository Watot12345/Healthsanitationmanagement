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
    $scheduled_date = $input['scheduled_date'] ?? null;
    $technician = $input['technician'] ?? null;
    $status = $input['status'] ?? null;
    $notes = $input['notes'] ?? null;
    
    if (empty($schedule_id)) {
        echo json_encode(['success' => false, 'message' => 'Schedule ID required']);
        exit();
    }
    
    $numeric_id = preg_replace('/[^0-9]/', '', $schedule_id);
    
    $updates = [];
    $params = [];
    
    if ($scheduled_date) {
        $updates[] = 'scheduled_date = ?';
        $params[] = $scheduled_date;
    }
    if ($technician) {
        $updates[] = 'technician = ?';
        $params[] = $technician;
    }
    if ($status) {
        $updates[] = 'status = ?';
        $params[] = $status;
    }
    if ($notes) {
        $updates[] = 'notes = ?';
        $params[] = $notes;
    }
    
    if (empty($updates)) {
        echo json_encode(['success' => false, 'message' => 'No updates provided']);
        exit();
    }
    
    $params[] = $numeric_id;
    
    $sql = "UPDATE maintenance_schedules SET " . implode(', ', $updates) . " WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    
    echo json_encode([
        'success' => true,
        'message' => 'Schedule updated successfully'
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}