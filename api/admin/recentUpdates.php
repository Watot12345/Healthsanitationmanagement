<?php
session_start();
require_once __DIR__ . '/../../config/database.php';

$db = new Database();
$conn = $db->getConnection();

// Get recent updates from activity_logs with module info
$stmt = $conn->query("
    SELECT action as title, module, created_at as time, level as type 
    FROM activity_logs 
    ORDER BY created_at DESC 
    LIMIT 5
");
$updates = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Map time to relative format
foreach ($updates as &$update) {
    $timestamp = strtotime($update['time']);
    $diff = time() - $timestamp;
    
    if ($diff < 60) $update['time'] = 'Just now';
    elseif ($diff < 3600) $update['time'] = floor($diff / 60) . ' min ago';
    elseif ($diff < 86400) $update['time'] = floor($diff / 3600) . ' hours ago';
    else $update['time'] = date('M d', $timestamp);
}

echo json_encode($updates ?: []);