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
    
    if ($pdo === null) {
        throw new Exception('Database connection failed');
    }
    
    $application_id = $_POST['application_id'] ?? '';
    $document_type = $_POST['document_type'] ?? 'Other';
    
    if (empty($application_id)) {
        echo json_encode(['success' => false, 'message' => 'Application ID required']);
        exit();
    }
    
    if (!isset($_FILES['document']) || $_FILES['document']['error'] !== UPLOAD_ERR_OK) {
        echo json_encode(['success' => false, 'message' => 'No file uploaded']);
        exit();
    }
    
    $file = $_FILES['document'];
    $maxSize = 5 * 1024 * 1024; // 5MB
    
    if ($file['size'] > $maxSize) {
        echo json_encode(['success' => false, 'message' => 'File too large (max 5MB)']);
        exit();
    }
    
    $allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    
    if (!in_array($mimeType, $allowedTypes)) {
        echo json_encode(['success' => false, 'message' => 'Invalid file type. Only PDF, JPG, PNG allowed']);
        exit();
    }
    
    // Create directory
    $uploadDir = "../../uploads/applications/{$application_id}/";
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = date('Ymd_His') . '_' . uniqid() . '.' . $ext;
    $filepath = $uploadDir . $filename;
    $dbPath = "uploads/applications/{$application_id}/{$filename}";
    
    if (!move_uploaded_file($file['tmp_name'], $filepath)) {
        echo json_encode(['success' => false, 'message' => 'Failed to save file']);
        exit();
    }
    
    // Save to database
    $stmt = $pdo->prepare("
        INSERT INTO application_documents (application_id, document_name, document_type, file_path, file_size)
        VALUES (?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([
        $application_id,
        $file['name'],
        $document_type,
        $dbPath,
        $file['size']
    ]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Document uploaded successfully',
        'document_id' => $pdo->lastInsertId()
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}