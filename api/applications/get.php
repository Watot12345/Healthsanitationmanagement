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
    
   $query = "SELECT 
    a.id,
    CONCAT('APP-', LPAD(a.id, 3, '0')) AS display_id,
    a.applicant_name AS applicant,
    a.business_type AS type,
    a.address,
    a.contact_person AS contactPerson,
    a.contact_number AS contactNumber,
    a.status,
    DATE_FORMAT(a.submission_date, '%Y-%m-%d') AS date,
    (SELECT COUNT(*) FROM application_documents WHERE application_id = CONCAT('APP-', LPAD(a.id, 3, '0'))) AS documents,
    DATE_FORMAT(a.created_at, '%Y-%m-%d') AS created_at
FROM applications a
ORDER BY a.id DESC";
    
    $stmt = $pdo->query($query);
    $applications = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($applications as &$app) {
        $app['id'] = $app['display_id'];
        unset($app['display_id']);
    }
    
    echo json_encode([
        'success' => true,
        'applications' => $applications,
        'count' => count($applications)
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}