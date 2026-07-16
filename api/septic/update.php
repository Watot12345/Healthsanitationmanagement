<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 0); // Don't display, catch in try/catch

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

require_once '../../config/database.php';

try {
    $database = new Database();
    $pdo = $database->getConnection();
    
    if ($pdo === null) {
        throw new Exception('Database connection failed: ' . $database->getLastError());
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Debug - log the input
    error_log('Update input: ' . print_r($input, true));
    
    $id = preg_replace('/[^0-9]/', '', $input['id'] ?? '');
    
    if (!$id) { 
        echo json_encode(['success' => false, 'message' => 'ID required']); 
        exit(); 
    }
    
    // Build update query safely
    $allowedFields = [
        'last_desludging', 'next_schedule', 'scheduled_date', 
        'service_type', 'technician', 'zone', 'priority', 'status', 'notes'
    ];
    
    $updates = []; 
    $params = [];
    
    foreach ($allowedFields as $field) {
        if (array_key_exists($field, $input)) {
            $updates[] = "`$field` = ?";
            $params[] = $input[$field];
        }
    }
    
    if (empty($updates)) { 
        echo json_encode(['success' => false, 'message' => 'No updates provided']); 
        exit(); 
    }
    
    $params[] = $id;
    $sql = "UPDATE septic_maintenance SET " . implode(', ', $updates) . " WHERE id = ?";
    
    error_log('SQL: ' . $sql);
    error_log('Params: ' . print_r($params, true));
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    
    $affected = $stmt->rowCount();
    
    echo json_encode([
        'success' => true, 
        'message' => 'Updated',
        'affected_rows' => $affected
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Database error: ' . $e->getMessage(),
        'code' => $e->getCode()
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}