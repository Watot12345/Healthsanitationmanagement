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
    
    // Fetch medical records with patient name
    $query = "SELECT 
        m.id,
        CONCAT('MR-', LPAD(m.id, 3, '0')) AS display_id,
        m.patient_id,
        p.full_name AS patient,
        m.record_type AS type,
        m.title,
        DATE_FORMAT(m.record_date, '%Y-%m-%d') AS date,
        m.doctor_name AS doctor,
        m.summary,
        DATE_FORMAT(m.created_at, '%Y-%m-%d') AS created_at
    FROM medical_records m
    LEFT JOIN patients p ON m.patient_id = p.patient_id
    ORDER BY m.record_date DESC";
    
    $stmt = $pdo->query($query);
    $records = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format IDs
    foreach ($records as &$record) {
        $record['id'] = $record['display_id'];
        unset($record['display_id']);
    }
    
    echo json_encode([
        'success' => true,
        'records' => $records,
        'count' => count($records)
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}