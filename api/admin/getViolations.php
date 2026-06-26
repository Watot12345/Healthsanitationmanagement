<?php
session_start();
require_once __DIR__ . '/../../config/database.php';

header('Content-Type: application/json');

$db = new Database();
$conn = $db->getConnection();

$violations = $conn->query("SELECT * FROM violations ORDER BY created_at DESC")->fetchAll(PDO::FETCH_ASSOC);
$lastUpdate = $conn->query("SELECT MAX(updated_at) FROM violations")->fetchColumn();

echo json_encode([
    'data' => $violations ?: [],
    'last_update' => $lastUpdate ?: date('Y-m-d H:i:s')
]);