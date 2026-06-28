<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../config/database.php';

try {
    // Create database instance and get connection
    $database = new Database();
    $pdo = $database->getConnection();
    
    // Check if connection failed
    if ($pdo === null) {
        throw new Exception('Database connection failed: ' . $database->getLastError());
    }
    
    // Fetch all patients - using correct column names
    $query = "SELECT 
        id, 
        patient_id,
        full_name AS name,
        DATE_FORMAT(birth_date, '%Y-%m-%d') AS birth_date,
        TIMESTAMPDIFF(YEAR, birth_date, CURDATE()) AS age,
        gender,
        blood_type AS bloodType,
        weight,
        height,
        head_circumference,
        bmi,
        bmi_category AS bmiCategory,
        is_child AS isChild,
        needs_growth_tracking AS needsGrowthTracking,
        triage,
        `condition`,
        allergies,
        existing_conditions,
        address,
        contact_number,
        emergency_contact,
        emergency_phone,
        DATE_FORMAT(created_at, '%Y-%m-%d') AS created_at,
        DATE_FORMAT(updated_at, '%Y-%m-%d') AS updated_at,
        COALESCE(DATE_FORMAT(last_visit, '%Y-%m-%d'), DATE_FORMAT(created_at, '%Y-%m-%d')) AS lastVisit,
        created_by
    FROM patients 
    ORDER BY id DESC";
    
    $stmt = $pdo->query($query);
    $patients = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format values
    foreach ($patients as &$patient) {
        // Keep original patient_id if it exists, otherwise generate one
        if (empty($patient['patient_id'])) {
            $patient['patient_id'] = 'PAT-' . date('Y') . '-' . str_pad($patient['id'], 4, '0', STR_PAD_LEFT);
        }
        // Use patient_id as the display ID
        $patient['id'] = $patient['patient_id'];
        
        $patient['weight'] = $patient['weight'] ? (float)$patient['weight'] : null;
        $patient['height'] = $patient['height'] ? (float)$patient['height'] : null;
        $patient['head_circumference'] = $patient['head_circumference'] ? (float)$patient['head_circumference'] : null;
        $patient['bmi'] = $patient['bmi'] ? (float)$patient['bmi'] : null;
        $patient['age'] = $patient['age'] ? (int)$patient['age'] : null;
        $patient['isChild'] = (bool)$patient['isChild'];
        $patient['needsGrowthTracking'] = (bool)$patient['needsGrowthTracking'];
        
        // Use existing_conditions if condition is empty
        if (empty($patient['condition']) && !empty($patient['existing_conditions'])) {
            $patient['condition'] = $patient['existing_conditions'];
        }
    }
    
    echo json_encode([
        'success' => true,
        'patients' => $patients
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