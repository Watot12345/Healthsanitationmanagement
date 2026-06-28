<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../config/database.php';

session_start();
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit();
}

// Only admin can delete
if (($_SESSION['role'] ?? '') !== 'admin') {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Admin access required']);
    exit();
}

$database = new Database();
$pdo = $database->getConnection();

$input = json_decode(file_get_contents('php://input'), true);
$patient_id = $input['patient_id'] ?? '';

if (empty($patient_id)) {
    echo json_encode(['success' => false, 'message' => 'Patient ID required']);
    exit();
}

try {
    // Check if patient exists
    $stmt = $pdo->prepare("SELECT patient_id, full_name FROM patients WHERE patient_id = ?");
    $stmt->execute([$patient_id]);
    $patient = $stmt->fetch();
    
    if (!$patient) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Patient not found']);
        exit();
    }
    
    // Delete patient (CASCADE will handle documents and related records)
    $stmt = $pdo->prepare("DELETE FROM patients WHERE patient_id = ?");
    $stmt->execute([$patient_id]);
    
    // Delete uploaded files folder
    $uploadDir = "../../uploads/patients/{$patient_id}/";
    if (is_dir($uploadDir)) {
        deleteDirectory($uploadDir);
    }
    
    echo json_encode([
        'success' => true,
        'message' => "Patient '{$patient['full_name']}' deleted successfully"
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}

// Helper function to recursively delete directory
function deleteDirectory($dir) {
    if (!is_dir($dir)) return;
    
    $files = array_diff(scandir($dir), ['.', '..']);
    foreach ($files as $file) {
        $path = "$dir/$file";
        is_dir($path) ? deleteDirectory($path) : unlink($path);
    }
    
    return rmdir($dir);
}