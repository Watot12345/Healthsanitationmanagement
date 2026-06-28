<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../config/database.php';

try {
    $database = new Database();
    $pdo = $database->getConnection();
    
    $input = json_decode(file_get_contents('php://input'), true);
    $document_id = $input['document_id'] ?? '';
    
    if (empty($document_id)) {
        echo json_encode(['success' => false, 'message' => 'Document ID required']);
        exit();
    }
    
    // Get file path before deleting
    $stmt = $pdo->prepare("SELECT file_path FROM application_documents WHERE id = ?");
    $stmt->execute([$document_id]);
    $doc = $stmt->fetch();
    
    if (!$doc) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Document not found']);
        exit();
    }
    
    // Delete file
    $filePath = '../../' . $doc['file_path'];
    if (file_exists($filePath)) {
        unlink($filePath);
    }
    
    // Delete record
    $stmt = $pdo->prepare("DELETE FROM application_documents WHERE id = ?");
    $stmt->execute([$document_id]);
    
    echo json_encode(['success' => true, 'message' => 'Document deleted']);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}