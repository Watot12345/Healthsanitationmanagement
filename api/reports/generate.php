<?php
error_reporting(E_ALL & ~E_DEPRECATED);
ini_set('display_errors', 0);
session_start();
require_once __DIR__ . '/../../config/database.php';

$type = $_GET['type'] ?? 'daily-patients';
$db = new Database();
$conn = $db->getConnection();

header('Content-Type: text/csv');
header('Content-Disposition: attachment; filename="' . $type . '_report_' . date('Y-m-d') . '.csv"');

$output = fopen('php://output', 'w');

switch ($type) {
    case 'daily-patients':
        fputcsv($output, ['ID', 'Patient', 'Service', 'Date', 'Time', 'Status', 'Triage']);
        $stmt = $conn->query("SELECT * FROM appointments WHERE DATE(created_at) = CURDATE() ORDER BY created_at DESC");
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            fputcsv($output, [$row['id'], $row['patient_name'], $row['service'], $row['appointment_date'], $row['appointment_time'], $row['status'], $row['triage']]);
        }
        break;

    case 'weekly-consultations':
        fputcsv($output, ['ID', 'Patient', 'Service', 'Date', 'Status']);
        $stmt = $conn->query("SELECT * FROM appointments WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) ORDER BY created_at DESC");
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            fputcsv($output, [$row['id'], $row['patient_name'], $row['service'], $row['appointment_date'], $row['status']]);
        }
        break;

    case 'monthly-health':
        fputcsv($output, ['Month', 'Total Appointments', 'Completed', 'Pending']);
        for ($i = 5; $i >= 0; $i--) {
            $month = date('M Y', strtotime("-$i months"));
            $total = $conn->query("SELECT COUNT(*) FROM appointments WHERE MONTH(created_at) = MONTH(NOW() - INTERVAL $i MONTH)")->fetchColumn();
            $completed = $conn->query("SELECT COUNT(*) FROM appointments WHERE MONTH(created_at) = MONTH(NOW() - INTERVAL $i MONTH) AND status = 'Completed'")->fetchColumn();
            $pending = $conn->query("SELECT COUNT(*) FROM appointments WHERE MONTH(created_at) = MONTH(NOW() - INTERVAL $i MONTH) AND status = 'Pending'")->fetchColumn();
            fputcsv($output, [$month, $total, $completed, $pending]);
        }
        break;

    case 'monthly-permits':
        fputcsv($output, ['ID', 'Applicant', 'Type', 'Status', 'Inspector', 'Date']);
        $stmt = $conn->query("SELECT * FROM permits ORDER BY created_at DESC");
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            fputcsv($output, [$row['id'], $row['applicant'], $row['type'], $row['status'], $row['inspector'], $row['created_at']]);
        }
        break;

    case 'inspection-rate':
        fputcsv($output, ['Status', 'Count', 'Percentage']);
        $total = $conn->query("SELECT COUNT(*) FROM permits")->fetchColumn();
        foreach (['Approved', 'Pending', 'Rejected'] as $status) {
            $count = $conn->query("SELECT COUNT(*) FROM permits WHERE status = '$status'")->fetchColumn();
            $pct = $total > 0 ? round(($count / $total) * 100) : 0;
            fputcsv($output, [$status, $count, $pct . '%']);
        }
        break;

    case 'processing-time':
        fputcsv($output, ['ID', 'Applicant', 'Submitted', 'Status', 'Days Pending']);
        $stmt = $conn->query("SELECT *, DATEDIFF(NOW(), created_at) as days FROM permits WHERE status = 'Pending' ORDER BY created_at ASC");
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            fputcsv($output, [$row['id'], $row['applicant'], $row['created_at'], $row['status'], $row['days'] . ' days']);
        }
        break;

    case 'monthly-immunization':
        fputcsv($output, ['Month', 'Total Activities']);
        for ($i = 5; $i >= 0; $i--) {
            $month = date('M Y', strtotime("-$i months"));
            $count = $conn->query("SELECT COUNT(*) FROM activity_logs WHERE module = 'Immunization' AND MONTH(created_at) = MONTH(NOW() - INTERVAL $i MONTH)")->fetchColumn();
            fputcsv($output, [$month, $count]);
        }
        break;

    case 'nutrition-status':
        fputcsv($output, ['Status', 'Count']);
        fputcsv($output, ['Normal', $conn->query("SELECT COUNT(*) FROM alerts WHERE level = 'normal'")->fetchColumn()]);
        fputcsv($output, ['Warning', $conn->query("SELECT COUNT(*) FROM alerts WHERE level = 'warning'")->fetchColumn()]);
        fputcsv($output, ['Outbreak', $conn->query("SELECT COUNT(*) FROM alerts WHERE level = 'outbreak'")->fetchColumn()]);
        break;

    case 'vaccination-coverage':
        fputcsv($output, ['Category', 'Count']);
        fputcsv($output, ['Total Immunization', $conn->query("SELECT COUNT(*) FROM activity_logs WHERE module = 'Immunization'")->fetchColumn()]);
        fputcsv($output, ['Completed', $conn->query("SELECT COUNT(*) FROM activity_logs WHERE module = 'Immunization' AND level = 'success'")->fetchColumn()]);
        break;

    case 'monthly-sanitation':
        fputcsv($output, ['ID', 'Requester', 'Type', 'Status', 'Priority', 'Date']);
        $stmt = $conn->query("SELECT * FROM wastewater_requests ORDER BY created_at DESC");
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            fputcsv($output, [$row['id'], $row['requester'], $row['type'], $row['status'], $row['priority'], $row['created_at']]);
        }
        break;

    case 'serviced-ratio':
        fputcsv($output, ['Status', 'Count', 'Percentage']);
        $total = $conn->query("SELECT COUNT(*) FROM wastewater_requests")->fetchColumn();
        foreach (['Completed', 'Approved', 'In Progress', 'Pending'] as $status) {
            $count = $conn->query("SELECT COUNT(*) FROM wastewater_requests WHERE status = '$status'")->fetchColumn();
            $pct = $total > 0 ? round(($count / $total) * 100) : 0;
            fputcsv($output, [$status, $count, $pct . '%']);
        }
        break;

    case 'overdue-maintenance':
        fputcsv($output, ['ID', 'Requester', 'Type', 'Status', 'Date']);
        $stmt = $conn->query("SELECT * FROM wastewater_requests WHERE status IN ('Pending', 'In Progress') AND created_at < DATE_SUB(NOW(), INTERVAL 7 DAY) ORDER BY created_at ASC");
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            fputcsv($output, [$row['id'], $row['requester'], $row['type'], $row['status'], $row['created_at']]);
        }
        break;

    case 'compliance-rate':
        fputcsv($output, ['Metric', 'Value']);
        $total = $conn->query("SELECT COUNT(*) FROM permits")->fetchColumn();
        $approved = $conn->query("SELECT COUNT(*) FROM permits WHERE status = 'Approved'")->fetchColumn();
        fputcsv($output, ['Approved', $approved . '/' . $total . ' (' . ($total > 0 ? round(($approved/$total)*100) : 0) . '%)']);
        fputcsv($output, ['Pending', $conn->query("SELECT COUNT(*) FROM permits WHERE status = 'Pending'")->fetchColumn()]);
        fputcsv($output, ['Rejected', $conn->query("SELECT COUNT(*) FROM permits WHERE status = 'Rejected'")->fetchColumn()]);
        break;

    case 'weekly-disease':
        fputcsv($output, ['ID', 'Disease', 'Barangay', 'Cases', 'Level', 'Status']);
        $stmt = $conn->query("SELECT * FROM alerts WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) ORDER BY created_at DESC");
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            fputcsv($output, [$row['id'], $row['disease'], $row['barangay'], $row['cases'], $row['level'], $row['status']]);
        }
        break;

    case 'outbreak':
        fputcsv($output, ['ID', 'Disease', 'Barangay', 'Cases', 'Level', 'Date']);
        $stmt = $conn->query("SELECT * FROM alerts WHERE level IN ('warning', 'outbreak') ORDER BY cases DESC");
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            fputcsv($output, [$row['id'], $row['disease'], $row['barangay'], $row['cases'], $row['level'], $row['created_at']]);
        }
        break;

    case 'barangay-risk':
        fputcsv($output, ['Barangay', 'Total Cases', 'Diseases', 'Risk Level']);
        $stmt = $conn->query("SELECT barangay, SUM(cases) as total, GROUP_CONCAT(DISTINCT disease SEPARATOR ', ') as diseases, MAX(level) as risk FROM alerts GROUP BY barangay ORDER BY total DESC");
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            fputcsv($output, [$row['barangay'], $row['total'], $row['diseases'], $row['risk']]);
        }
        break;

    default:
        fputcsv($output, ['Report type not available']);
}

fclose($output);