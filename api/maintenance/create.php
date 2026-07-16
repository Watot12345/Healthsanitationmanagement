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
    
    $owner_name = $input['owner_name'] ?? '';
    $address = $input['address'] ?? '';
    $service_type = $input['service_type'] ?? 'Desludging';
    $scheduled_date = $input['scheduled_date'] ?? date('Y-m-d');
    $technician = $input['technician'] ?? '';
    $zone = $input['zone'] ?? '';
    $priority = $input['priority'] ?? 'Medium';
    
    if (empty($owner_name)) {
        echo json_encode(['success' => false, 'message' => 'Owner name is required']);
        exit();
    }
    
    $stmt = $pdo->prepare("
        INSERT INTO maintenance_schedules (owner_name, address, service_type, scheduled_date, technician, zone, priority)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([$owner_name, $address, $service_type, $scheduled_date, $technician, $zone, $priority]);
    
    $id = $pdo->lastInsertId();
    $display_id = 'SCH-' . str_pad($id, 3, '0', STR_PAD_LEFT);
    
    echo json_encode([
        'success' => true,
        'message' => 'Schedule created successfully',
        'schedule_id' => $display_id
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}