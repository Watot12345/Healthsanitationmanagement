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

// ─── KPI COUNTS ──────────────────────────────────────────────────

// Total Users
$totalUsers = (int) $conn->query("SELECT COUNT(*) FROM users")->fetchColumn();

// Active Staff (staff role only, not admin)
$activeStaff = (int) $conn->query("SELECT COUNT(*) FROM users WHERE role = 'staff' AND is_active = 1")->fetchColumn();

// Active Admins (separate count)
$activeAdmins = (int) $conn->query("SELECT COUNT(*) FROM users WHERE role = 'admin' AND is_active = 1")->fetchColumn();

// Total Active Users
$totalActiveUsers = (int) $conn->query("SELECT COUNT(*) FROM users WHERE is_active = 1")->fetchColumn();

// Pending Requests (appointments + permits + service requests)
$pendingAppointments = (int) $conn->query("SELECT COUNT(*) FROM appointments WHERE status = 'Pending'")->fetchColumn();
$pendingPermits = (int) $conn->query("SELECT COUNT(*) FROM permits WHERE status = 'Pending'")->fetchColumn();
$pendingServices = (int) $conn->query("SELECT COUNT(*) FROM service_requests WHERE status = 'Pending'")->fetchColumn();
$pendingRequests = $pendingAppointments + $pendingPermits + $pendingServices;

// System Alerts
$activeAlerts = (int) $conn->query("SELECT COUNT(*) FROM alerts WHERE status = 'Active'")->fetchColumn();

// ─── SYSTEM STATUS ────────────────────────────────────────────────

// Uptime
$uptime = $conn->query("SELECT uptime FROM system_status ORDER BY id DESC LIMIT 1")->fetchColumn() ?: '99.8%';

// Active Sessions (clean old ones first)
$conn->exec("DELETE FROM user_sessions WHERE expires_at < NOW()");
$activeSessions = (int) $conn->query("SELECT COUNT(*) FROM user_sessions WHERE expires_at > NOW()")->fetchColumn();

// Unique active users
$activeSessionUsers = (int) $conn->query("SELECT COUNT(DISTINCT user_id) FROM user_sessions WHERE expires_at > NOW()")->fetchColumn();

// Pending Approvals (all pending items)
$pendingApprovals = $pendingPermits;

echo json_encode([
    'kpis' => [
        'totalUsers' => $totalUsers,
        'activeStaff' => $activeStaff,
        'activeAdmins' => $activeAdmins,
        'totalActiveUsers' => $totalActiveUsers,
        'pendingRequests' => $pendingRequests,
        'systemAlerts' => $activeAlerts,
    ],
    'systemStatus' => [
        'uptime' => $uptime,
        'activeSessions' => $activeSessions,
        'activeSessionUsers' => $activeSessionUsers,
        'pendingApprovals' => $pendingApprovals,
    ]
]);