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
    
    $stmt = $pdo->prepare("INSERT INTO service_requests (requester_name, address, service_type, priority, notes) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([
        $input['requester_name'] ?? '',
        $input['address'] ?? '',
        $input['service_type'] ?? 'Desludging',
        $input['priority'] ?? 'Medium',
        $input['notes'] ?? ''
    ]);
    
    $id = $pdo->lastInsertId();
    echo json_encode(['success' => true, 'message' => 'Request submitted', 'id' => 'SR-' . str_pad($id, 3, '0', STR_PAD_LEFT)]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}