<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../config/database.php';

try {
    $database = new Database();
    $pdo = $database->getConnection();
    
    if ($pdo === null) {
        throw new Exception('Database connection failed');
    }
    
    // Auto-update overdue status
    $pdo->exec("UPDATE maintenance_schedules 
                SET status = 'Overdue' 
                WHERE status = 'Scheduled' 
                AND scheduled_date < CURDATE()");
    
    $query = "SELECT 
        id,
        CONCAT('SCH-', LPAD(id, 3, '0')) AS display_id,
        owner_name AS owner,
        address,
        service_type AS type,
        DATE_FORMAT(scheduled_date, '%Y-%m-%d') AS scheduledDate,
        technician,
        zone,
        priority,
        status,
        notes,
        DATE_FORMAT(created_at, '%Y-%m-%d') AS created_at
    FROM maintenance_schedules 
    ORDER BY scheduled_date DESC";
    
    $stmt = $pdo->query($query);
    $schedules = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($schedules as &$s) {
        $s['id'] = $s['display_id'];
        unset($s['display_id']);
    }
    
    echo json_encode([
        'success' => true,
        'schedules' => $schedules,
        'count' => count($schedules)
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}