<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

require_once '../../config/database.php';

try {
    $database = new Database();
    $pdo = $database->getConnection();
    
    $query = "SELECT 
        id, CONCAT('SR-', LPAD(id, 3, '0')) AS display_id,
        requester_name AS requester, address,
        service_type AS type, priority, status, notes,
        DATE_FORMAT(scheduled_date, '%Y-%m-%d') AS scheduledDate,
        DATE_FORMAT(completed_date, '%Y-%m-%d') AS completedDate,
        DATE_FORMAT(created_at, '%Y-%m-%d') AS dateRequested
    FROM service_requests ORDER BY id DESC";
    
    $stmt = $pdo->query($query);
    $requests = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($requests as &$r) {
        $r['id'] = $r['display_id'];
        unset($r['display_id']);
    }
    
    echo json_encode(['success' => true, 'requests' => $requests]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}