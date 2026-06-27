<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
session_start();
require_once __DIR__ . '/../../config/database.php';
// Only admin can access
if ($_SESSION['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['error' => 'Access denied']);
    exit;
}

$db = new Database();
$conn = $db->getConnection();

// Total Users
$totalUsers = $conn->query("SELECT COUNT(*) FROM users")->fetchColumn();

// Active Staff
$activeStaff = $conn->query("SELECT COUNT(*) FROM users WHERE role IN ('admin','staff') AND is_active = 1")->fetchColumn();

// Pending Requests (appointments + permits + service requests)
$pendingAppointments = $conn->query("SELECT COUNT(*) FROM appointments WHERE status = 'Pending'")->fetchColumn();
$pendingPermits = $conn->query("SELECT COUNT(*) FROM permits WHERE status = 'Pending'")->fetchColumn();
$pendingServices = $conn->query("SELECT COUNT(*) FROM wastewater_requests WHERE status = 'Pending'")->fetchColumn();
$pendingRequests = $pendingAppointments + $pendingPermits + $pendingServices;

// System Alerts
$activeAlerts = $conn->query("SELECT COUNT(*) FROM alerts WHERE status = 'Active'")->fetchColumn();

// System Status
$uptime = $conn->query("SELECT uptime FROM system_status ORDER BY id DESC LIMIT 1")->fetchColumn() ?: '99.8%';
$activeSessions = $conn->query("SELECT COUNT(*) FROM user_sessions WHERE expires_at > NOW()")->fetchColumn() ?: 0;
$pendingApprovals = $conn->query("SELECT COUNT(*) FROM permits WHERE status = 'Pending'")->fetchColumn();

echo json_encode([
    'kpis' => [
        'totalUsers' => (int)$totalUsers,
        'activeStaff' => (int)$activeStaff,
        'pendingRequests' => (int)$pendingRequests,
        'systemAlerts' => (int)$activeAlerts,
    ],
    'systemStatus' => [
        'uptime' => $uptime,
        'activeSessions' => (int)$activeSessions,
        'pendingApprovals' => (int)$pendingApprovals,
    ]
]);