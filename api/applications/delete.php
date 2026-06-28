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

try {
    $database = new Database();
    $pdo = $database->getConnection();
    
    $input = json_decode(file_get_contents('php://input'), true);
    $application_id = $input['application_id'] ?? '';
    
    if (empty($application_id)) {
        echo json_encode(['success' => false, 'message' => 'Application ID required']);
        exit();
    }
    
    $numeric_id = preg_replace('/[^0-9]/', '', $application_id);
    
    $stmt = $pdo->prepare("SELECT id FROM applications WHERE id = ?");
    $stmt->execute([$numeric_id]);
    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Application not found']);
        exit();
    }
    
    $stmt = $pdo->prepare("DELETE FROM applications WHERE id = ?");
    $stmt->execute([$numeric_id]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Application deleted successfully'
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}