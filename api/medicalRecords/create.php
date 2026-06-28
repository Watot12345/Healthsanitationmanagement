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
    
    $patient_id = $input['patient_id'] ?? '';
    $record_type = $input['record_type'] ?? 'Lab Result';
    $title = $input['title'] ?? '';
    $record_date = $input['record_date'] ?? date('Y-m-d');
    $doctor_name = $input['doctor_name'] ?? '';
    $summary = $input['summary'] ?? '';
    
    // Validate
    if (empty($patient_id) || empty($title)) {
        echo json_encode(['success' => false, 'message' => 'Patient and Title are required']);
        exit();
    }
    
    // Check patient exists
    $stmt = $pdo->prepare("SELECT patient_id FROM patients WHERE patient_id = ?");
    $stmt->execute([$patient_id]);
    if ($stmt->rowCount() === 0) {
        echo json_encode(['success' => false, 'message' => 'Patient not found']);
        exit();
    }
    
    // Insert record
    $stmt = $pdo->prepare("
        INSERT INTO medical_records (patient_id, record_type, title, record_date, doctor_name, summary)
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([
        $patient_id,
        $record_type,
        $title,
        $record_date,
        $doctor_name,
        $summary
    ]);
    
    $record_id = $pdo->lastInsertId();
    $display_id = 'MR-' . str_pad($record_id, 3, '0', STR_PAD_LEFT);
    
    echo json_encode([
        'success' => true,
        'message' => 'Medical record created successfully',
        'record_id' => $display_id
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