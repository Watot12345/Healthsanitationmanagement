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
    $id = preg_replace('/[^0-9]/', '', $input['id'] ?? '');
    
    if (!$id) { echo json_encode(['success' => false, 'message' => 'ID required']); exit(); }
    
    $updates = []; $params = [];
    foreach (['status', 'scheduled_date', 'completed_date', 'notes'] as $f) {
        if (isset($input[$f])) { $updates[] = "$f = ?"; $params[] = $input[$f]; }
    }
    
    $params[] = $id;
    $pdo->prepare("UPDATE service_requests SET " . implode(', ', $updates) . " WHERE id = ?")->execute($params);
    
    echo json_encode(['success' => true, 'message' => 'Updated']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}