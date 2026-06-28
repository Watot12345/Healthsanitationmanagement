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
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    $applicant_name = $input['applicant_name'] ?? '';
    $business_type = $input['business_type'] ?? 'Food Establishment';
    $address = $input['address'] ?? '';
    $contact_person = $input['contact_person'] ?? '';
    $contact_number = $input['contact_number'] ?? '';
    
    if (empty($applicant_name)) {
        echo json_encode(['success' => false, 'message' => 'Applicant name is required']);
        exit();
    }
    
    $stmt = $pdo->prepare("
        INSERT INTO applications (applicant_name, business_type, address, contact_person, contact_number)
        VALUES (?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([$applicant_name, $business_type, $address, $contact_person, $contact_number]);
    
    $app_id = $pdo->lastInsertId();
    $display_id = 'APP-' . str_pad($app_id, 3, '0', STR_PAD_LEFT);
    
    echo json_encode([
        'success' => true,
        'message' => 'Application submitted successfully',
        'application_id' => $display_id
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}