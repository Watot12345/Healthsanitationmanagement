<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../includes/PatientManagerClass.php';
require_once __DIR__ . '/../../includes/helpers.php';

session_start();

$db = new Database();
$conn = $db->getConnection();

if (!$conn) {
    echo json_encode([
        'success' => false,
        'message' => 'DB connection failed: ' . $db->getLastError()
    ]);
    exit;
}

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

// Get POST data
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    echo json_encode(['success' => false, 'message' => 'Invalid input data']);
    exit;
}

try {
    $patientManager = new PatientManager($conn);
    $input['created_by'] = $_SESSION['user_id'] ?? null;
    $result = $patientManager->createPatient($input);
    echo json_encode($result);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>