<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

require_once '../../config/database.php';

$database = new Database();
$pdo = $database->getConnection();

if ($pdo === null) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit();
}

// Get form data
$patient_id = $_POST['patient_id'] ?? '';
$document_type = $_POST['document_type'] ?? 'Other';
$notes = $_POST['notes'] ?? '';

// Validate patient_id
if (empty($patient_id)) {
    echo json_encode(['success' => false, 'message' => 'Patient ID is required']);
    exit();
}

// Check if patient exists
$stmt = $pdo->prepare("SELECT patient_id FROM patients WHERE patient_id = ?");
$stmt->execute([$patient_id]);
if ($stmt->rowCount() === 0) {
    echo json_encode(['success' => false, 'message' => 'Patient not found']);
    exit();
}

// Check if file was uploaded
if (!isset($_FILES['document']) || $_FILES['document']['error'] !== UPLOAD_ERR_OK) {
    $errorMessages = [
        UPLOAD_ERR_INI_SIZE   => 'File exceeds server size limit',
        UPLOAD_ERR_FORM_SIZE  => 'File exceeds form size limit',
        UPLOAD_ERR_PARTIAL    => 'File was only partially uploaded',
        UPLOAD_ERR_NO_FILE    => 'Please select a file to upload',
        UPLOAD_ERR_NO_TMP_DIR => 'Server configuration error',
        UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk',
    ];
    
    $errorCode = $_FILES['document']['error'] ?? UPLOAD_ERR_NO_FILE;
    $message = $errorMessages[$errorCode] ?? 'Unknown upload error';
    
    echo json_encode(['success' => false, 'message' => $message]);
    exit();
}

$file = $_FILES['document'];

// Validate file size (10MB max)
$maxSize = 10 * 1024 * 1024;
if ($file['size'] > $maxSize) {
    echo json_encode(['success' => false, 'message' => 'File too large. Maximum size is 10MB']);
    exit();
}

// Validate file type
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

$allowedPDF = ['application/pdf'];
$allowedImages = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

// Determine file category
if (in_array($mimeType, $allowedPDF) || $ext === 'pdf') {
    $file_category = 'pdf';
    $subfolder = 'reports';
} elseif (in_array($mimeType, $allowedImages) || in_array($ext, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
    $file_category = 'image';
    $subfolder = 'images';
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid file type. Only PDF and images (JPG, PNG, GIF, WebP) are allowed']);
    exit();
}

// Create upload directory
$uploadDir = "../../uploads/patients/{$patient_id}/{$subfolder}/";
if (!file_exists($uploadDir)) {
    if (!mkdir($uploadDir, 0755, true)) {
        echo json_encode(['success' => false, 'message' => 'Failed to create upload directory']);
        exit();
    }
}

// Generate unique filename
$filename = date('Ymd_His') . '_' . substr(uniqid(), -8) . '.' . $ext;
$filepath = $uploadDir . $filename;
$dbPath = "uploads/patients/{$patient_id}/{$subfolder}/{$filename}";

// Move uploaded file
if (!move_uploaded_file($file['tmp_name'], $filepath)) {
    echo json_encode(['success' => false, 'message' => 'Failed to save file']);
    exit();
}

// Save to database
try {
    $stmt = $pdo->prepare("
        INSERT INTO patient_documents (
            patient_id, 
            document_name, 
            document_type, 
            file_path, 
            file_category, 
            file_size, 
            upload_date, 
            notes
        ) VALUES (?, ?, ?, ?, ?, ?, CURDATE(), ?)
    ");
    
    $stmt->execute([
        $patient_id,
        $file['name'],           // Original filename
        $document_type,
        $dbPath,                 // Relative path for database
        $file_category,
        $file['size'],
        $notes
    ]);
    
    $document_id = $pdo->lastInsertId();
    
    echo json_encode([
        'success' => true,
        'message' => 'Document uploaded successfully',
        'document' => [
            'id' => (int)$document_id,
            'name' => $file['name'],
            'type' => $document_type,
            'file_path' => $dbPath,
            'file_category' => $file_category,
            'file_size' => $file['size'],
            'date' => date('Y-m-d')
        ]
    ]);
    
} catch (PDOException $e) {
    // Remove uploaded file if database insert fails
    if (file_exists($filepath)) {
        unlink($filepath);
    }
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}