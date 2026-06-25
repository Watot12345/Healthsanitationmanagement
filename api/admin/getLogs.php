<?php
session_start();
require_once __DIR__ . '/../../config/database.php';

header('Content-Type: application/json');

$db = new Database();
$conn = $db->getConnection();

$stmt = $conn->query("
    SELECT 
        id,
        created_at as timestamp,
        user_name as user,
        action,
        module,
        level
    FROM activity_logs 
    ORDER BY created_at DESC
");
$logs = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($logs ?: []);