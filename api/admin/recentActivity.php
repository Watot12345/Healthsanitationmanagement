<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
session_start();
require_once __DIR__ . '/../../config/database.php';

$db = new Database();
$conn = $db->getConnection();

$recent = [];

// Activity logs
$logs = $conn->query("
    SELECT action, user_name, created_at as timestamp, level 
    FROM activity_logs 
    ORDER BY created_at DESC 
    LIMIT 4
")->fetchAll(PDO::FETCH_ASSOC);
$recent = array_merge($recent, $logs ?: []);

// Recent appointments
$appointments = $conn->query("
    SELECT CONCAT('Appointment booked - ', service) as action, 
           patient_name as user_name, 
           created_at as timestamp, 
           'info' as level
    FROM appointments 
    ORDER BY created_at DESC LIMIT 2
")->fetchAll(PDO::FETCH_ASSOC);
$recent = array_merge($recent, $appointments ?: []);

// Recent permits
$permits = $conn->query("
    SELECT CONCAT('Permit ', status, ' - ', applicant) as action,
           inspector as user_name,
           created_at as timestamp,
           CASE status WHEN 'Approved' THEN 'success' WHEN 'Rejected' THEN 'error' ELSE 'info' END as level
    FROM permits 
    ORDER BY created_at DESC LIMIT 2
")->fetchAll(PDO::FETCH_ASSOC);
$recent = array_merge($recent, $permits ?: []);

// Sort by timestamp
usort($recent, function($a, $b) {
    return strtotime($b['timestamp']) - strtotime($a['timestamp']);
});

echo json_encode(array_slice($recent, 0, 4));