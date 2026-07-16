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
    
    // Auto-update overdue
    $pdo->exec("UPDATE septic_maintenance SET status = 'Overdue' WHERE status IN ('Scheduled', 'Active') AND next_schedule IS NOT NULL AND next_schedule < CURDATE()");
    
    $query = "SELECT 
        id, CONCAT('SEP-', LPAD(id, 3, '0')) AS display_id,
        owner_name AS owner, address, tank_type AS type, capacity,
        DATE_FORMAT(install_date, '%Y-%m-%d') AS installDate, household_size AS household,
        DATE_FORMAT(last_desludging, '%Y-%m-%d') AS lastDesludging,
        DATE_FORMAT(next_schedule, '%Y-%m-%d') AS nextSchedule,
        DATE_FORMAT(scheduled_date, '%Y-%m-%d') AS scheduledDate,
        service_type AS serviceType, technician, zone, priority, status, notes,
        DATE_FORMAT(created_at, '%Y-%m-%d') AS created_at
    FROM septic_maintenance ORDER BY id DESC";
    
    $stmt = $pdo->query($query);
    $records = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($records as &$r) {
        $r['id'] = $r['display_id'];
        unset($r['display_id']);
        $r['capacity'] = $r['capacity'] ? $r['capacity'] . ' L' : 'N/A';
    }
    
    echo json_encode(['success' => true, 'records' => $records, 'count' => count($records)]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}