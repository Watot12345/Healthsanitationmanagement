<?php
session_start();
require_once __DIR__ . '/../../config/database.php';

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['error' => 'Access denied']);
    exit;
}

$db = new Database();
$conn = $db->getConnection();

// Uptime - store as a setting or calculate from server
$uptime = '99.8%';

// Active sessions - count sessions not expired
$activeSessions = $conn->query("SELECT COUNT(*) FROM user_sessions WHERE expires_at > NOW()")->fetchColumn();

// Pending approvals - permits waiting for review
$pendingApprovals = $conn->query("SELECT COUNT(*) FROM permits WHERE status = 'Pending'")->fetchColumn();

echo json_encode([
    'uptime' => $uptime,
    'activeSessions' => (int)$activeSessions,
    'pendingApprovals' => (int)$pendingApprovals,
]);