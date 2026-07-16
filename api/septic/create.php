<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

require_once '../../config/database.php';

try {
    $database = new Database();
    $pdo = $database->getConnection();
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    $owner_name = $input['owner_name'] ?? '';
    $address = $input['address'] ?? '';
    $tank_type = $input['tank_type'] ?? 'Concrete Septic Tank';
    $capacity = $input['capacity'] ?? null;
    $install_date = $input['install_date'] ?? null;
    $household_size = $input['household_size'] ?? null;
    $scheduled_date = $input['scheduled_date'] ?? null;
    $service_type = $input['service_type'] ?? null;
    $technician = $input['technician'] ?? null;
    $zone = $input['zone'] ?? null;
    $priority = $input['priority'] ?? 'Medium';
    
    if (empty($owner_name)) {
        echo json_encode(['success' => false, 'message' => 'Owner name is required']);
        exit();
    }
    
    // Determine status
    $status = $scheduled_date ? 'Scheduled' : 'Active';
    
    $stmt = $pdo->prepare("
        INSERT INTO septic_maintenance (owner_name, address, tank_type, capacity, install_date, household_size, scheduled_date, service_type, technician, zone, priority, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([$owner_name, $address, $tank_type, $capacity, $install_date, $household_size, $scheduled_date, $service_type, $technician, $zone, $priority, $status]);
    
    $id = $pdo->lastInsertId();
    
    echo json_encode(['success' => true, 'message' => 'Created', 'id' => 'SEP-' . str_pad($id, 3, '0', STR_PAD_LEFT)]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}