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
    
    // Get POST data
    $input = json_decode(file_get_contents('php://input'), true);
    
    $patient_id = $input['patient_id'] ?? '';
    $doctor_name = $input['doctor_name'] ?? '';
    $consultation_date = $input['consultation_date'] ?? date('Y-m-d');
    $consultation_time = $input['consultation_time'] ?? date('H:i:s');
    $diagnosis = $input['diagnosis'] ?? '';
    $symptoms = $input['symptoms'] ?? '';
    $notes = $input['notes'] ?? '';
    $prescription = $input['prescription'] ?? '';
    $follow_up_date = $input['follow_up_date'] ?? null;
    $status = $input['status'] ?? 'Pending';
    
    // Validate required fields
    if (empty($patient_id)) {
        echo json_encode(['success' => false, 'message' => 'Patient is required']);
        exit();
    }
    
    if (empty($doctor_name)) {
        echo json_encode(['success' => false, 'message' => 'Doctor name is required']);
        exit();
    }
    
    // Check if patient exists
    $stmt = $pdo->prepare("SELECT patient_id FROM patients WHERE patient_id = ?");
    $stmt->execute([$patient_id]);
    if ($stmt->rowCount() === 0) {
        echo json_encode(['success' => false, 'message' => 'Patient not found']);
        exit();
    }
    
    // Insert consultation
    $stmt = $pdo->prepare("
        INSERT INTO consultations (
            patient_id, doctor_name, consultation_date, consultation_time,
            diagnosis, symptoms, notes, prescription, follow_up_date, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([
        $patient_id,
        $doctor_name,
        $consultation_date,
        $consultation_time,
        $diagnosis,
        $symptoms,
        $notes,
        $prescription,
        $follow_up_date,
        $status
    ]);
    
    $consultation_id = $pdo->lastInsertId();
    $display_id = 'CON-' . str_pad($consultation_id, 3, '0', STR_PAD_LEFT);
    
    echo json_encode([
        'success' => true,
        'message' => 'Consultation created successfully',
        'consultation_id' => $display_id
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