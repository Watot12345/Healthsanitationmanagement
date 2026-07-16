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
    
    $pdo->prepare("DELETE FROM service_requests WHERE id = ?")->execute([$id]);
    echo json_encode(['success' => true, 'message' => 'Deleted']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}