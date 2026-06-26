<?php
error_reporting(E_ALL & ~E_DEPRECATED);
ini_set('display_errors', 0);
session_start();
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/tcpdf/tcpdf.php';

$type = $_GET['type'] ?? 'daily-patients';

$db = new Database();
$conn = $db->getConnection();

$pdf = new TCPDF('L', 'mm', 'A4', true, 'UTF-8', false);
$pdf->SetCreator('Health & Sanitation System');
$pdf->SetTitle(ucfirst(str_replace('-', ' ', $type)) . ' Report');
$pdf->setPrintHeader(false);
$pdf->setPrintFooter(false);
$pdf->SetMargins(10, 10, 10);
$pdf->AddPage();

$title = ucfirst(str_replace('-', ' ', $type)) . ' Report';
$html = '<h2>' . $title . '</h2>';
$html .= '<p>Generated: ' . date('Y-m-d H:i:s') . '</p>';
$html .= '<table border="1" cellpadding="4" style="width:100%; border-collapse:collapse; font-size:10px;">';

switch ($type) {
    // ─── Health Center Reports ────────────────────────────
    case 'daily-patients':
        $html .= '<tr style="background:#2563eb;color:#fff;"><th>ID</th><th>Patient</th><th>Service</th><th>Date</th><th>Time</th><th>Status</th><th>Triage</th></tr>';
        $stmt = $conn->query("SELECT * FROM appointments WHERE DATE(created_at) = CURDATE() ORDER BY created_at DESC");
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $html .= "<tr><td>{$row['id']}</td><td>{$row['patient_name']}</td><td>{$row['service']}</td><td>{$row['appointment_date']}</td><td>{$row['appointment_time']}</td><td>{$row['status']}</td><td>{$row['triage']}</td></tr>";
        }
        break;

    case 'weekly-consultations':
        $html .= '<tr style="background:#2563eb;color:#fff;"><th>ID</th><th>Patient</th><th>Service</th><th>Date</th><th>Status</th></tr>';
        $stmt = $conn->query("SELECT * FROM appointments WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) ORDER BY created_at DESC");
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $html .= "<tr><td>{$row['id']}</td><td>{$row['patient_name']}</td><td>{$row['service']}</td><td>{$row['appointment_date']}</td><td>{$row['status']}</td></tr>";
        }
        break;

    case 'monthly-health':
        $html .= '<tr style="background:#2563eb;color:#fff;"><th>Month</th><th>Total Appointments</th><th>Completed</th><th>Pending</th></tr>';
        for ($i = 5; $i >= 0; $i--) {
            $month = date('M Y', strtotime("-$i months"));
            $total = $conn->query("SELECT COUNT(*) FROM appointments WHERE MONTH(created_at) = MONTH(NOW() - INTERVAL $i MONTH)")->fetchColumn();
            $completed = $conn->query("SELECT COUNT(*) FROM appointments WHERE MONTH(created_at) = MONTH(NOW() - INTERVAL $i MONTH) AND status = 'Completed'")->fetchColumn();
            $pending = $conn->query("SELECT COUNT(*) FROM appointments WHERE MONTH(created_at) = MONTH(NOW() - INTERVAL $i MONTH) AND status = 'Pending'")->fetchColumn();
            $html .= "<tr><td>{$month}</td><td>{$total}</td><td>{$completed}</td><td>{$pending}</td></tr>";
        }
        break;

    // ─── Sanitation Reports ───────────────────────────────
    case 'monthly-permits':
        $html .= '<tr style="background:#22c55e;color:#fff;"><th>ID</th><th>Applicant</th><th>Type</th><th>Status</th><th>Inspector</th><th>Date</th></tr>';
        $stmt = $conn->query("SELECT * FROM permits ORDER BY created_at DESC");
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $html .= "<tr><td>{$row['id']}</td><td>{$row['applicant']}</td><td>{$row['type']}</td><td>{$row['status']}</td><td>{$row['inspector']}</td><td>{$row['created_at']}</td></tr>";
        }
        break;

    case 'inspection-rate':
        $html .= '<tr style="background:#22c55e;color:#fff;"><th>Status</th><th>Count</th><th>Percentage</th></tr>';
        $total = $conn->query("SELECT COUNT(*) FROM permits")->fetchColumn();
        foreach (['Approved', 'Pending', 'Rejected'] as $status) {
            $count = $conn->query("SELECT COUNT(*) FROM permits WHERE status = '$status'")->fetchColumn();
            $pct = $total > 0 ? round(($count / $total) * 100) : 0;
            $html .= "<tr><td>{$status}</td><td>{$count}</td><td>{$pct}%</td></tr>";
        }
        break;

    case 'processing-time':
        $html .= '<tr style="background:#22c55e;color:#fff;"><th>ID</th><th>Applicant</th><th>Submitted</th><th>Status</th><th>Days Pending</th></tr>';
        $stmt = $conn->query("SELECT *, DATEDIFF(NOW(), created_at) as days_pending FROM permits WHERE status = 'Pending' ORDER BY created_at ASC");
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $html .= "<tr><td>{$row['id']}</td><td>{$row['applicant']}</td><td>{$row['created_at']}</td><td>{$row['status']}</td><td>{$row['days_pending']} days</td></tr>";
        }
        break;

    // ─── Immunization Reports ─────────────────────────────
    case 'monthly-immunization':
        $html .= '<tr style="background:#eab308;color:#fff;"><th>Month</th><th>Total Activities</th></tr>';
        for ($i = 5; $i >= 0; $i--) {
            $month = date('M Y', strtotime("-$i months"));
            $count = $conn->query("SELECT COUNT(*) FROM activity_logs WHERE module = 'Immunization' AND MONTH(created_at) = MONTH(NOW() - INTERVAL $i MONTH)")->fetchColumn();
            $html .= "<tr><td>{$month}</td><td>{$count}</td></tr>";
        }
        break;

    case 'nutrition-status':
        $html .= '<tr style="background:#eab308;color:#fff;"><th>Status</th><th>Count</th></tr>';
        $html .= "<tr><td>Normal</td><td>" . $conn->query("SELECT COUNT(*) FROM alerts WHERE level = 'normal'")->fetchColumn() . "</td></tr>";
        $html .= "<tr><td>Warning</td><td>" . $conn->query("SELECT COUNT(*) FROM alerts WHERE level = 'warning'")->fetchColumn() . "</td></tr>";
        $html .= "<tr><td>Outbreak</td><td>" . $conn->query("SELECT COUNT(*) FROM alerts WHERE level = 'outbreak'")->fetchColumn() . "</td></tr>";
        break;

    case 'vaccination-coverage':
        $html .= '<tr style="background:#eab308;color:#fff;"><th>Category</th><th>Count</th></tr>';
        $html .= "<tr><td>Total Immunization Activities</td><td>" . $conn->query("SELECT COUNT(*) FROM activity_logs WHERE module = 'Immunization'")->fetchColumn() . "</td></tr>";
        $html .= "<tr><td>Completed Vaccinations</td><td>" . $conn->query("SELECT COUNT(*) FROM activity_logs WHERE module = 'Immunization' AND level = 'success'")->fetchColumn() . "</td></tr>";
        break;

    // ─── Wastewater Reports ───────────────────────────────
    case 'monthly-sanitation':
        $html .= '<tr style="background:#a855f7;color:#fff;"><th>ID</th><th>Requester</th><th>Type</th><th>Status</th><th>Priority</th><th>Date</th></tr>';
        $stmt = $conn->query("SELECT * FROM wastewater_requests ORDER BY created_at DESC");
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $html .= "<tr><td>{$row['id']}</td><td>{$row['requester']}</td><td>{$row['type']}</td><td>{$row['status']}</td><td>{$row['priority']}</td><td>{$row['created_at']}</td></tr>";
        }
        break;

    case 'serviced-ratio':
        $total = $conn->query("SELECT COUNT(*) FROM wastewater_requests")->fetchColumn();
        $html .= '<tr style="background:#a855f7;color:#fff;"><th>Status</th><th>Count</th><th>Percentage</th></tr>';
        foreach (['Completed', 'Approved', 'In Progress', 'Pending'] as $status) {
            $count = $conn->query("SELECT COUNT(*) FROM wastewater_requests WHERE status = '$status'")->fetchColumn();
            $pct = $total > 0 ? round(($count / $total) * 100) : 0;
            $html .= "<tr><td>{$status}</td><td>{$count}</td><td>{$pct}%</td></tr>";
        }
        break;

    case 'overdue-maintenance':
        $html .= '<tr style="background:#a855f7;color:#fff;"><th>ID</th><th>Requester</th><th>Type</th><th>Status</th><th>Date</th></tr>';
        $stmt = $conn->query("SELECT * FROM wastewater_requests WHERE status IN ('Pending', 'In Progress') AND created_at < DATE_SUB(NOW(), INTERVAL 7 DAY) ORDER BY created_at ASC");
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $html .= "<tr><td>{$row['id']}</td><td>{$row['requester']}</td><td>{$row['type']}</td><td>{$row['status']}</td><td>{$row['created_at']}</td></tr>";
        }
        break;

    case 'compliance-rate':
        $total = $conn->query("SELECT COUNT(*) FROM permits")->fetchColumn();
        $html .= '<tr style="background:#a855f7;color:#fff;"><th>Metric</th><th>Value</th></tr>';
        $approved = $conn->query("SELECT COUNT(*) FROM permits WHERE status = 'Approved'")->fetchColumn();
        $html .= "<tr><td>Approved Permits</td><td>{$approved}/{$total} (" . ($total > 0 ? round(($approved/$total)*100) : 0) . "%)</td></tr>";
        $html .= "<tr><td>Pending Review</td><td>" . $conn->query("SELECT COUNT(*) FROM permits WHERE status = 'Pending'")->fetchColumn() . "</td></tr>";
        $html .= "<tr><td>Rejected</td><td>" . $conn->query("SELECT COUNT(*) FROM permits WHERE status = 'Rejected'")->fetchColumn() . "</td></tr>";
        break;

    // ─── Surveillance Reports ─────────────────────────────
    case 'weekly-disease':
        $html .= '<tr style="background:#ef4444;color:#fff;"><th>ID</th><th>Disease</th><th>Barangay</th><th>Cases</th><th>Level</th><th>Status</th></tr>';
        $stmt = $conn->query("SELECT * FROM alerts WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) ORDER BY created_at DESC");
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $html .= "<tr><td>{$row['id']}</td><td>{$row['disease']}</td><td>{$row['barangay']}</td><td>{$row['cases']}</td><td>{$row['level']}</td><td>{$row['status']}</td></tr>";
        }
        break;

    case 'outbreak':
        $html .= '<tr style="background:#ef4444;color:#fff;"><th>ID</th><th>Disease</th><th>Barangay</th><th>Cases</th><th>Level</th><th>Date</th></tr>';
        $stmt = $conn->query("SELECT * FROM alerts WHERE level IN ('warning', 'outbreak') ORDER BY cases DESC");
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $html .= "<tr><td>{$row['id']}</td><td>{$row['disease']}</td><td>{$row['barangay']}</td><td>{$row['cases']}</td><td>{$row['level']}</td><td>{$row['created_at']}</td></tr>";
        }
        break;

    case 'barangay-risk':
        $html .= '<tr style="background:#ef4444;color:#fff;"><th>Barangay</th><th>Total Cases</th><th>Diseases</th><th>Risk Level</th></tr>';
        $stmt = $conn->query("SELECT barangay, SUM(cases) as total, GROUP_CONCAT(DISTINCT disease SEPARATOR ', ') as diseases, MAX(level) as risk FROM alerts GROUP BY barangay ORDER BY total DESC");
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $html .= "<tr><td>{$row['barangay']}</td><td>{$row['total']}</td><td>{$row['diseases']}</td><td>{$row['risk']}</td></tr>";
        }
        break;

    default:
        $html .= '<tr><td colspan="7">Report type not available</td></tr>';
}

$html .= '</table>';
$pdf->writeHTML($html, true, false, true, false, '');
$pdf->Output($type . '_report_' . date('Y-m-d') . '.pdf', 'D');