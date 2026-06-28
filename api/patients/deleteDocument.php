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

// Check if admin
if (($_SESSION['role'] ?? '') !== 'admin') {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Admin access required to delete documents']);
    exit();
}

$database = new Database();
$pdo = $database->getConnection();

$input = json_decode(file_get_contents('php://input'), true);
$document_id = $input['document_id'] ?? ($_POST['document_id'] ?? 0);

if (empty($document_id)) {
    echo json_encode(['success' => false, 'message' => 'Document ID required']);
    exit();
}

// Get document info before deleting
$stmt = $pdo->prepare("SELECT * FROM patient_documents WHERE id = ?");
$stmt->execute([$document_id]);
$document = $stmt->fetch();

if (!$document) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Document not found']);
    exit();
}

// Delete file from server
$filePath = '../../' . $document['file_path'];
if (file_exists($filePath)) {
    unlink($filePath);
}

// Delete from database
$stmt = $pdo->prepare("DELETE FROM patient_documents WHERE id = ?");
$stmt->execute([$document_id]);

echo json_encode([
    'success' => true,
    'message' => 'Document deleted successfully'
]);