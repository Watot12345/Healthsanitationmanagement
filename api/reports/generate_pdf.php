<?php
error_reporting(E_ALL);
error_reporting(E_ALL & ~E_DEPRECATED);
ini_set('display_errors', 1);
session_start();
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/tcpdf/tcpdf.php';

$type = $_GET['type'] ?? 'daily-patients';

$db = new Database();
$conn = $db->getConnection();

$pdf = new TCPDF('L', 'mm', 'A4', true, 'UTF-8', false);
$pdf->SetCreator('Health System');
$pdf->SetTitle('Report');
$pdf->AddPage();

$html = '<h2>Report: ' . str_replace('-', ' ', $type) . '</h2>';
$html .= '<p>Generated: ' . date('Y-m-d H:i:s') . '</p>';
$html .= '<table border="1" cellpadding="4">';

switch ($type) {
    case 'daily-patients':
        $html .= '<tr><th>Patient</th><th>Service</th><th>Date</th><th>Status</th></tr>';
        $stmt = $conn->query("SELECT * FROM appointments ORDER BY created_at DESC");
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $html .= "<tr><td>{$row['patient_name']}</td><td>{$row['service']}</td><td>{$row['appointment_date']}</td><td>{$row['status']}</td></tr>";
        }
        break;
    case 'monthly-permits':
        $html .= '<tr><th>Applicant</th><th>Type</th><th>Status</th><th>Inspector</th></tr>';
        $stmt = $conn->query("SELECT * FROM permits ORDER BY created_at DESC");
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $html .= "<tr><td>{$row['applicant']}</td><td>{$row['type']}</td><td>{$row['status']}</td><td>{$row['inspector']}</td></tr>";
        }
        break;
}

$html .= '</table>';
$pdf->writeHTML($html, true, false, true, false, '');
$pdf->Output($type . '_report.pdf', 'D');