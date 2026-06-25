<?php
session_start();
require_once __DIR__ . '/../../config/database.php';

header('Content-Type: application/json');

$db = new Database();
$conn = $db->getConnection();

$stmt = $conn->query("
    SELECT 
        id, 
        full_name as name, 
        email, 
        role, 
        CASE WHEN is_active = 1 THEN 'Active' ELSE 'Inactive' END as status,
        DATE_FORMAT(created_at, '%Y-%m-%d') as joined
    FROM users 
    ORDER BY created_at DESC
");
$users = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($users ?: []);