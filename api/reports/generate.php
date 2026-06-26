<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
session_start();
require_once __DIR__ . '/../../config/database.php';

$type = $_GET['type'] ?? '';
$db = new Database();
$conn = $db->getConnection();

header('Content-Type: text/csv');
header('Content-Disposition: attachment; filename="' . $type . '_report_' . date('Y-m-d') . '.csv"');

$output = fopen('php://output', 'w');

switch ($type) {
    case 'appointments':
        fputcsv($output, ['ID', 'Patient', 'Service', 'Date', 'Time', 'Status', 'Triage']);
        $stmt = $conn->query("SELECT * FROM appointments ORDER BY created_at DESC");
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            fputcsv($output, [$row['id'], $row['patient_name'], $row['service'], $row['appointment_date'], $row['appointment_time'], $row['status'], $row['triage']]);
        }
        break;
        
    case 'permits':
        fputcsv($output, ['ID', 'Applicant', 'Type', 'Status', 'Inspector', 'Date']);
        $stmt = $conn->query("SELECT * FROM permits ORDER BY created_at DESC");
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            fputcsv($output, [$row['id'], $row['applicant'], $row['type'], $row['status'], $row['inspector'], $row['created_at']]);
        }
        break;
        
    case 'disease':
        fputcsv($output, ['ID', 'Disease', 'Barangay', 'Cases', 'Level', 'Status', 'Date']);
        $stmt = $conn->query("SELECT * FROM alerts ORDER BY created_at DESC");
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            fputcsv($output, [$row['id'], $row['disease'], $row['barangay'], $row['cases'], $row['level'], $row['status'], $row['created_at']]);
        }
        break;
}

fclose($output);