<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../config/database.php';

// Get patient_id from URL parameter
$patient_id = $_GET['patient_id'] ?? '';

if (empty($patient_id)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Patient ID is required'
    ]);
    exit();
}

try {
    $database = new Database();
    $pdo = $database->getConnection();
    
    if ($pdo === null) {
        throw new Exception('Database connection failed');
    }
    
    // Fetch documents for this patient
    $stmt = $pdo->prepare("
        SELECT 
            id,
            patient_id,
            document_name AS name,
            document_type AS type,
            file_path,
            file_category,
            file_size,
            DATE_FORMAT(upload_date, '%Y-%m-%d') AS date,
            notes,
            uploaded_by,
            created_at
        FROM patient_documents 
        WHERE patient_id = ?
        ORDER BY upload_date DESC, created_at DESC
    ");
    
    $stmt->execute([$patient_id]);
    $documents = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format the response
    foreach ($documents as &$doc) {
        $doc['id'] = (int)$doc['id'];
        $doc['file_size'] = $doc['file_size'] ? (int)$doc['file_size'] : null;
    }
    
    echo json_encode([
        'success' => true,
        'documents' => $documents,
        'count' => count($documents)
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