<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
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
    
    // Check if table exists, if not create it
    $pdo->exec("CREATE TABLE IF NOT EXISTS consultations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        patient_id VARCHAR(20) NOT NULL,
        doctor_name VARCHAR(100) NOT NULL,
        consultation_date DATE NOT NULL,
        consultation_time TIME,
        diagnosis VARCHAR(255),
        symptoms TEXT,
        notes TEXT,
        prescription TEXT,
        follow_up_date DATE,
        status ENUM('Pending', 'Completed', 'Cancelled') DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
        INDEX idx_patient (patient_id),
        INDEX idx_date (consultation_date)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    
    // Fetch consultations with patient name
    $query = "SELECT 
        c.id,
        CONCAT('CON-', LPAD(c.id, 3, '0')) AS display_id,
        c.patient_id,
        p.full_name AS patient,
        c.doctor_name AS doctor,
        DATE_FORMAT(c.consultation_date, '%Y-%m-%d') AS date,
        TIME_FORMAT(c.consultation_time, '%h:%i %p') AS time,
        c.diagnosis,
        c.symptoms,
        c.notes,
        c.prescription,
        DATE_FORMAT(c.follow_up_date, '%Y-%m-%d') AS followUp,
        c.status,
        DATE_FORMAT(c.created_at, '%Y-%m-%d') AS created_at
    FROM consultations c
    LEFT JOIN patients p ON c.patient_id = p.patient_id
    ORDER BY c.consultation_date DESC, c.consultation_time DESC";
    
    $stmt = $pdo->query($query);
    $consultations = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format IDs
    foreach ($consultations as &$consultation) {
        $consultation['id'] = $consultation['display_id'];
        unset($consultation['display_id']);
    }
    
    echo json_encode([
        'success' => true,
        'consultations' => $consultations,
        'count' => count($consultations)
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