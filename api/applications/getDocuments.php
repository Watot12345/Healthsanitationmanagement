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

$application_id = $_GET['application_id'] ?? '';

if (empty($application_id)) {
    echo json_encode(['success' => false, 'message' => 'Application ID required']);
    exit();
}

try {
    $database = new Database();
    $pdo = $database->getConnection();
    
    $stmt = $pdo->prepare("
        SELECT id, document_name, document_type, file_path, file_size,
               DATE_FORMAT(upload_date, '%Y-%m-%d') AS date
        FROM application_documents 
        WHERE application_id = ?
        ORDER BY upload_date DESC
    ");
    $stmt->execute([$application_id]);
    $documents = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'documents' => $documents
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}