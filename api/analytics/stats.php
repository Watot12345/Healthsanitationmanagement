<?php
session_start();
require_once __DIR__ . '/../../config/database.php';

header('Content-Type: application/json');

$db = new Database();
$conn = $db->getConnection();

// Monthly service requests (last 6 months)
$months = [];
$requests = [];
for ($i = 5; $i >= 0; $i--) {
    $months[] = date('M', strtotime("-$i months"));
    $count = $conn->query("
        SELECT 
            (SELECT COUNT(*) FROM appointments WHERE MONTH(created_at) = MONTH(NOW() - INTERVAL $i MONTH)) +
            (SELECT COUNT(*) FROM permits WHERE MONTH(created_at) = MONTH(NOW() - INTERVAL $i MONTH))
    ")->fetchColumn();
    $requests[] = (int)$count;
}

// Appointments by month
$appointments = [];
for ($i = 5; $i >= 0; $i--) {
    $count = $conn->query("SELECT COUNT(*) FROM appointments WHERE MONTH(created_at) = MONTH(NOW() - INTERVAL $i MONTH)")->fetchColumn();
    $appointments[] = (int)$count;
}

// Permits by month
$permits = [];
for ($i = 5; $i >= 0; $i--) {
    $count = $conn->query("SELECT COUNT(*) FROM permits WHERE MONTH(created_at) = MONTH(NOW() - INTERVAL $i MONTH)")->fetchColumn();
    $permits[] = (int)$count;
}

// Service distribution
$health = $conn->query("SELECT COUNT(*) FROM appointments")->fetchColumn();
$sanitation = $conn->query("SELECT COUNT(*) FROM permits")->fetchColumn();
$immunization = $conn->query("SELECT COUNT(*) FROM activity_logs WHERE module = 'Immunization'")->fetchColumn();
$wastewater = $conn->query("SELECT COUNT(*) FROM wastewater_requests")->fetchColumn();

// Disease trends
$diseases = ['Dengue', 'Influenza', 'Food Poisoning', 'Leptospirosis'];
$diseaseData = [];
foreach ($diseases as $disease) {
    $data = [];
    for ($i = 5; $i >= 0; $i--) {
        $count = $conn->prepare("SELECT COALESCE(SUM(cases), 0) FROM alerts WHERE disease = ? AND MONTH(created_at) = MONTH(NOW() - INTERVAL $i MONTH)");
        $count->execute([$disease]);
        $data[] = (int)$count->fetchColumn();
    }
    $diseaseData[] = ['name' => $disease, 'data' => $data];
}

echo json_encode([
    'months' => $months,
    'requests' => $requests,
    'appointments' => $appointments,
    'permits' => $permits,
    'distribution' => [
        'health' => (int)$health,
        'sanitation' => (int)$sanitation,
        'immunization' => (int)$immunization,
        'wastewater' => (int)$wastewater,
    ],
    'diseases' => $diseaseData,
]);

