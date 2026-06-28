-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 28, 2026 at 08:32 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `health_sanitation_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `active_sessions`
--

CREATE TABLE `active_sessions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `session_token` varchar(255) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `expires_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `user_name` varchar(100) DEFAULT NULL,
  `action` varchar(255) DEFAULT NULL,
  `module` varchar(100) DEFAULT NULL,
  `level` enum('info','success','warning','error') DEFAULT 'info',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `user_id`, `user_name`, `action`, `module`, `level`, `created_at`) VALUES
(1, NULL, 'Maria Santo', 'User role updated for Carlos Lim', 'User Management', 'info', '2026-06-25 17:03:13'),
(2, NULL, 'Juan Dela Cruz', 'Permit approved #SP-1042', 'Sanitation', 'success', '2026-06-25 17:03:13'),
(3, NULL, 'System', 'Database backup completed successfully', 'System', 'success', '2026-06-25 17:03:13'),
(4, NULL, 'Ana Reyes', 'Outbreak alert triggered - Influenza cluster', 'Surveillance', 'error', '2026-06-25 17:03:13'),
(5, NULL, 'System', 'User Maria Santos logged in', 'Authentication', 'info', '2026-06-26 00:00:00'),
(6, NULL, 'Maria Santos', 'New permit application reviewed', 'Sanitation', 'info', '2026-06-26 01:15:00'),
(7, NULL, 'Juan Dela Cruz', 'Inspection completed for ABC Restaurant', 'Sanitation', 'success', '2026-06-26 02:30:00'),
(8, NULL, 'Dr. Elena Santos', 'Appointment approved for Pedro Garcia', 'Health Center', 'success', '2026-06-26 03:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `ai_insights_cache`
--

CREATE TABLE `ai_insights_cache` (
  `id` int(11) NOT NULL,
  `insights` text NOT NULL,
  `generated_at` datetime NOT NULL,
  `data_hash` varchar(32) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ai_tasks`
--

CREATE TABLE `ai_tasks` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `module` varchar(100) NOT NULL DEFAULT 'general',
  `priority` varchar(20) NOT NULL DEFAULT 'Medium',
  `status` varchar(30) NOT NULL DEFAULT 'pending',
  `created_by` varchar(100) NOT NULL DEFAULT 'System',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `alerts`
--

CREATE TABLE `alerts` (
  `id` int(11) NOT NULL,
  `disease` varchar(100) DEFAULT NULL,
  `barangay` varchar(100) DEFAULT NULL,
  `cases` int(11) DEFAULT 0,
  `threshold` int(11) DEFAULT 10,
  `level` enum('normal','warning','outbreak') DEFAULT 'normal',
  `status` enum('Active','Monitoring','Resolved') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `alerts`
--

INSERT INTO `alerts` (`id`, `disease`, `barangay`, `cases`, `threshold`, `level`, `status`, `created_at`) VALUES
(1, 'Dengue', 'San Jose', 12, 10, 'warning', 'Active', '2026-06-21 16:00:00'),
(2, 'Influenza', 'Multiple', 28, 15, 'outbreak', 'Active', '2026-06-19 16:00:00'),
(3, 'Food Poisoning', 'Poblacion', 3, 5, 'normal', 'Monitoring', '2026-06-20 16:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `applications`
--

CREATE TABLE `applications` (
  `id` int(11) NOT NULL,
  `applicant_name` varchar(100) NOT NULL,
  `business_type` varchar(50) NOT NULL,
  `address` text DEFAULT NULL,
  `contact_person` varchar(100) DEFAULT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  `status` enum('Pending','Approved','Rejected') DEFAULT 'Pending',
  `submission_date` date DEFAULT curdate(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `applications`
--

INSERT INTO `applications` (`id`, `applicant_name`, `business_type`, `address`, `contact_person`, `contact_number`, `status`, `submission_date`, `created_at`, `updated_at`) VALUES
(1, 'asffsafa', 'Food Establishment', 'sdfasdf', 'rgeergee', '34534', 'Pending', '2026-06-29', '2026-06-28 17:42:20', '2026-06-28 17:42:20'),
(5, 'asdffa', 'Food Establishment', 'asf', 'asfff', '1232523', 'Pending', '2026-06-29', '2026-06-28 17:57:47', '2026-06-28 17:57:47');

-- --------------------------------------------------------

--
-- Table structure for table `application_documents`
--

CREATE TABLE `application_documents` (
  `id` int(11) NOT NULL,
  `application_id` varchar(20) NOT NULL,
  `document_name` varchar(255) NOT NULL,
  `document_type` varchar(50) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `file_size` int(11) DEFAULT NULL,
  `upload_date` date DEFAULT curdate(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `application_documents`
--

INSERT INTO `application_documents` (`id`, `application_id`, `document_name`, `document_type`, `file_path`, `file_size`, `upload_date`, `created_at`) VALUES
(1, 'APP-001', 'Screenshot 2026-06-24 at 11-40-01 Health & Sanitation Management System.png', 'Business Registration', 'uploads/applications/new/20260628_195140_6a415f2c8437f.png', 221113, '2026-06-29', '2026-06-28 17:51:40'),
(2, 'new', 'Screenshot 2026-06-24 at 11-40-01 Health & Sanitation Management System.png', 'Business Registration', 'uploads/applications/new/20260628_195621_6a416045d7638.png', 221113, '2026-06-29', '2026-06-28 17:56:21'),
(3, 'APP-005', 'Screenshot 2026-06-24 at 11-40-01 Health & Sanitation Management System.png', 'Business Registration', 'uploads/applications/APP-005/20260628_195747_6a41609b7651b.png', 221113, '2026-06-29', '2026-06-28 17:57:47');

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` int(11) NOT NULL,
  `patient_id` int(11) DEFAULT NULL,
  `patient_name` varchar(100) DEFAULT NULL,
  `service` varchar(100) DEFAULT NULL,
  `appointment_date` date DEFAULT NULL,
  `appointment_time` time DEFAULT NULL,
  `status` enum('Pending','Approved','Completed','Rejected') DEFAULT 'Pending',
  `triage` enum('Low','Medium','High','Critical') DEFAULT 'Low',
  `notes` text DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `patient_id`, `patient_name`, `service`, `appointment_date`, `appointment_time`, `status`, `triage`, `notes`, `created_by`, `created_at`) VALUES
(1, NULL, 'Pedro Garcia', 'General Checkup', '2026-06-23', '09:00:00', 'Approved', 'Medium', NULL, NULL, '2026-06-20 00:00:00'),
(2, NULL, 'Rosa Mendoza', 'Dental Consultation', '2026-06-23', '10:30:00', 'Completed', 'Low', NULL, NULL, '2026-06-21 01:00:00'),
(3, NULL, 'Carlos Lim', 'Laboratory Test', '2026-06-24', '08:00:00', 'Pending', 'High', NULL, NULL, '2026-06-21 23:00:00'),
(4, NULL, 'Elena Torres', 'Prenatal Care', '2026-06-25', '14:00:00', 'Approved', 'Critical', NULL, NULL, '2026-06-23 02:00:00'),
(5, NULL, 'Miguel Santos', 'Vaccination', '2026-06-26', '11:00:00', 'Pending', 'Low', NULL, NULL, '2026-06-24 00:30:00'),
(6, NULL, 'Sofia Garcia', 'Pediatric Checkup', '2026-06-26', '13:00:00', 'Approved', 'Medium', NULL, NULL, '2026-06-25 01:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `bmi_history`
--

CREATE TABLE `bmi_history` (
  `id` int(11) NOT NULL,
  `patient_id` int(11) NOT NULL,
  `record_date` date NOT NULL,
  `weight` decimal(5,2) NOT NULL,
  `height` decimal(5,2) NOT NULL,
  `bmi` decimal(4,1) NOT NULL,
  `bmi_category` varchar(50) NOT NULL,
  `recorded_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bmi_history`
--

INSERT INTO `bmi_history` (`id`, `patient_id`, `record_date`, `weight`, `height`, `bmi`, `bmi_category`, `recorded_by`, `created_at`) VALUES
(2, 5, '2026-06-28', 12.00, 85.00, 16.6, 'Underweight', NULL, '2026-06-28 15:13:35'),
(3, 6, '2026-06-28', 12.00, 85.00, 16.6, 'Underweight', NULL, '2026-06-28 15:13:35'),
(4, 7, '2026-06-28', 65.00, 182.00, 19.6, 'Normal', NULL, '2026-06-28 15:31:46');

-- --------------------------------------------------------

--
-- Table structure for table `consultations`
--

CREATE TABLE `consultations` (
  `id` int(11) NOT NULL,
  `patient_id` varchar(20) NOT NULL,
  `doctor_name` varchar(100) NOT NULL,
  `consultation_date` date NOT NULL,
  `consultation_time` time DEFAULT NULL,
  `diagnosis` varchar(255) DEFAULT NULL,
  `symptoms` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `prescription` text DEFAULT NULL,
  `follow_up_date` date DEFAULT NULL,
  `status` enum('Pending','Completed','Cancelled') DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `consultations`
--

INSERT INTO `consultations` (`id`, `patient_id`, `doctor_name`, `consultation_date`, `consultation_time`, `diagnosis`, `symptoms`, `notes`, `prescription`, `follow_up_date`, `status`, `created_at`, `updated_at`) VALUES
(1, 'PAT-2026-0003', 'josh', '2026-06-28', '23:03:00', 'highblood', 'reddines', 'all goods', 'lozartan', '2026-07-01', 'Pending', '2026-06-28 16:48:30', '2026-06-28 16:48:30'),
(2, 'PAT-2026-0002', 'josh', '2026-06-28', '01:34:00', 'hyper', 'cold', 'noasf', 'parahugko', '2026-07-01', 'Pending', '2026-06-28 16:54:56', '2026-06-28 16:54:56');

-- --------------------------------------------------------

--
-- Table structure for table `growth_records`
--

CREATE TABLE `growth_records` (
  `id` int(11) NOT NULL,
  `patient_id` int(11) NOT NULL,
  `record_date` date NOT NULL,
  `age_months` int(11) NOT NULL COMMENT 'Age in months at time of measurement',
  `weight` decimal(5,2) DEFAULT NULL,
  `height` decimal(5,2) DEFAULT NULL,
  `head_circumference` decimal(5,2) DEFAULT NULL,
  `bmi` decimal(4,1) DEFAULT NULL,
  `bmi_percentile` int(11) DEFAULT NULL COMMENT 'BMI percentile based on WHO standards',
  `weight_percentile` int(11) DEFAULT NULL,
  `height_percentile` int(11) DEFAULT NULL,
  `nutritional_status` varchar(50) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `recorded_by` int(11) DEFAULT NULL COMMENT 'User ID who recorded',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `login_attempts`
--

CREATE TABLE `login_attempts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `attempt_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `success` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `medical_records`
--

CREATE TABLE `medical_records` (
  `id` int(11) NOT NULL,
  `patient_id` varchar(20) NOT NULL,
  `record_type` enum('Lab Result','Imaging','Prescription','Doctor Note') NOT NULL,
  `title` varchar(255) NOT NULL,
  `record_date` date NOT NULL,
  `doctor_name` varchar(100) DEFAULT NULL,
  `summary` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `medical_records`
--

INSERT INTO `medical_records` (`id`, `patient_id`, `record_type`, `title`, `record_date`, `doctor_name`, `summary`, `created_at`, `updated_at`) VALUES
(2, 'PAT-2026-0003', 'Lab Result', 'cbc', '2026-06-28', 'josh', 'all good', '2026-06-28 17:07:55', '2026-06-28 17:07:55'),
(3, 'PAT-2026-0002', 'Imaging', 'xray', '2026-06-28', 'kupal', 'all good', '2026-06-28 17:08:20', '2026-06-28 17:08:20');

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `token` varchar(100) DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  `used` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `patients`
--

CREATE TABLE `patients` (
  `id` int(11) NOT NULL,
  `patient_id` varchar(20) NOT NULL COMMENT 'Format: PAT-YYYY-XXXX',
  `full_name` varchar(100) NOT NULL,
  `birth_date` date NOT NULL,
  `age` int(11) DEFAULT NULL COMMENT 'Calculated in PHP',
  `gender` enum('Male','Female','Other','Prefer not to say') DEFAULT 'Prefer not to say',
  `blood_type` varchar(5) DEFAULT NULL COMMENT 'A+, A-, B+, B-, AB+, AB-, O+, O-',
  `weight` decimal(5,2) DEFAULT NULL COMMENT 'Weight in kilograms',
  `height` decimal(5,2) DEFAULT NULL COMMENT 'Height in centimeters',
  `head_circumference` decimal(5,2) DEFAULT NULL COMMENT 'Head circumference in cm (for children under 2)',
  `bmi` decimal(4,1) DEFAULT NULL COMMENT 'Body Mass Index',
  `bmi_category` varchar(50) DEFAULT NULL COMMENT 'Underweight, Normal, Overweight, Obese Class I, II, III',
  `is_child` tinyint(1) DEFAULT 0 COMMENT 'TRUE if patient is ≤ 5 years old',
  `needs_growth_tracking` tinyint(1) DEFAULT 0 COMMENT 'TRUE for children requiring growth monitoring',
  `triage` enum('Low','Medium','High','Critical') DEFAULT 'Low',
  `condition` varchar(255) DEFAULT 'Stable' COMMENT 'Current medical condition',
  `allergies` text DEFAULT NULL,
  `existing_conditions` text DEFAULT NULL,
  `address` text DEFAULT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  `emergency_contact` varchar(100) DEFAULT NULL,
  `emergency_phone` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `last_visit` date DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `patients`
--

INSERT INTO `patients` (`id`, `patient_id`, `full_name`, `birth_date`, `age`, `gender`, `blood_type`, `weight`, `height`, `head_circumference`, `bmi`, `bmi_category`, `is_child`, `needs_growth_tracking`, `triage`, `condition`, `allergies`, `existing_conditions`, `address`, `contact_number`, `emergency_contact`, `emergency_phone`, `created_at`, `updated_at`, `last_visit`, `created_by`) VALUES
(5, 'PAT-2026-0001', 'sdgsdg', '2005-03-14', 21, 'Male', 'A+', 12.00, 85.00, 26.00, 16.6, 'Underweight', 0, 0, 'Low', 'fever', NULL, NULL, 'ffsfs', '32442', 'sdfsdgfs', '4234', '2026-06-28 15:13:35', '2026-06-28 15:13:35', '2026-06-28', 1),
(6, 'PAT-2026-0002', 'sdgsdg', '2005-03-14', 21, 'Male', 'A+', 12.00, 85.00, 26.00, 16.6, 'Underweight', 0, 0, 'Low', 'fever', NULL, NULL, 'ffsfs', '32442', 'sdfsdgfs', '4234', '2026-06-28 15:13:35', '2026-06-28 15:13:35', '2026-06-28', 1),
(7, 'PAT-2026-0003', 'Joshua Sierra', '2005-03-14', 21, 'Male', 'O+', 65.00, 182.00, NULL, 19.6, 'Normal', 0, 0, 'Low', 'fever', NULL, NULL, 'san jose', '09368587433', 'Maricel', '09368587433', '2026-06-28 15:31:46', '2026-06-28 15:31:46', '2026-06-28', 1);

-- --------------------------------------------------------

--
-- Table structure for table `patient_documents`
--

CREATE TABLE `patient_documents` (
  `id` int(11) NOT NULL,
  `patient_id` varchar(20) NOT NULL,
  `document_name` varchar(255) NOT NULL,
  `document_type` enum('Lab Result','Imaging','Prescription','Other') NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `file_category` enum('pdf','image') NOT NULL DEFAULT 'pdf',
  `file_size` int(11) DEFAULT NULL,
  `upload_date` date NOT NULL,
  `notes` text DEFAULT NULL,
  `uploaded_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `patient_documents`
--

INSERT INTO `patient_documents` (`id`, `patient_id`, `document_name`, `document_type`, `file_path`, `file_category`, `file_size`, `upload_date`, `notes`, `uploaded_by`, `created_at`) VALUES
(1, 'PAT-2026-0003', 'Screenshot 2026-06-24 at 11-40-38 Health & Sanitation Management System.png', 'Lab Result', 'uploads/patients/PAT-2026-0003/images/20260628_180037_5251cc5a.png', 'image', 221359, '2026-06-29', '', NULL, '2026-06-28 16:00:37');

-- --------------------------------------------------------

--
-- Table structure for table `permits`
--

CREATE TABLE `permits` (
  `id` int(11) NOT NULL,
  `applicant` varchar(100) DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `status` enum('Pending','Approved','Rejected') DEFAULT 'Pending',
  `inspector` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `permits`
--

INSERT INTO `permits` (`id`, `applicant`, `type`, `status`, `inspector`, `created_at`) VALUES
(1, 'ABC Restaurant', 'Food Establishment', 'Approved', 'Juan Dela Cruz', '2026-06-09 16:00:00'),
(2, 'Green Market Stall', 'Market Vendor', 'Pending', 'Unassigned', '2026-06-14 16:00:00'),
(3, 'Fresh Bakes Co.', 'Bakery', 'Pending', 'Ana Reyes', '2026-06-17 16:00:00'),
(4, 'City Gym', 'Recreational Facility', 'Approved', 'Juan Dela Cruz', '2026-06-19 16:00:00'),
(5, 'Water Pure Station', 'Water Refilling', 'Pending', 'Unassigned', '2026-06-21 16:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

CREATE TABLE `role_permissions` (
  `id` int(11) NOT NULL,
  `role` varchar(50) DEFAULT NULL,
  `module` varchar(50) DEFAULT NULL,
  `can_view` tinyint(1) DEFAULT 0,
  `can_create` tinyint(1) DEFAULT 0,
  `can_edit` tinyint(1) DEFAULT 0,
  `can_delete` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `role_permissions`
--

INSERT INTO `role_permissions` (`id`, `role`, `module`, `can_view`, `can_create`, `can_edit`, `can_delete`) VALUES
(1, 'admin', 'health_center', 1, 1, 1, 1),
(2, 'admin', 'sanitation_permit', 1, 1, 1, 1),
(3, 'admin', 'immunization', 1, 1, 1, 1),
(4, 'admin', 'wastewater', 1, 1, 1, 1),
(5, 'admin', 'surveillance', 1, 1, 1, 1),
(6, 'health_officer', 'health_center', 1, 1, 1, 0),
(7, 'health_officer', 'immunization', 1, 1, 1, 0),
(8, 'sanitation_inspector', 'sanitation_permit', 1, 1, 1, 0),
(9, 'sanitation_inspector', 'wastewater', 1, 1, 1, 0),
(10, 'nurse', 'health_center', 1, 0, 0, 0),
(11, 'nurse', 'immunization', 1, 1, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `system_status`
--

CREATE TABLE `system_status` (
  `id` int(11) NOT NULL,
  `uptime` varchar(10) DEFAULT '99.8%',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `system_status`
--

INSERT INTO `system_status` (`id`, `uptime`, `created_at`) VALUES
(1, '99.8%', '2026-06-25 14:59:04');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','staff','user') NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `department` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `last_login` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `role`, `full_name`, `department`, `is_active`, `last_login`, `created_at`) VALUES
(1, 'admin', 'admin@123', '$2y$10$jKHpp5IpdTHG6L6Wz3iiFuzdjV5tUQFAm868tzkLx5OEv/veCF4ki', 'admin', 'System Administrator', 'IT Department', 1, '2026-06-29 00:48:51', '2026-06-22 05:38:55'),
(2, 'staff@123', 'staff@123', '$2y$10$jKHpp5IpdTHG6L6Wz3iiFuzdjV5tUQFAm868tzkLx5OEv/veCF4ki', 'staff', 'staff', 'HR', 1, '2026-06-29 00:44:28', '2026-06-25 13:14:39'),
(3, 'user', 'user@123', '$2y$10$jKHpp5IpdTHG6L6Wz3iiFuzdjV5tUQFAm868tzkLx5OEv/veCF4ki', 'user', 'user@123', 'NONE', 1, '2026-06-25 21:39:48', '2026-06-25 13:15:35'),
(4, 'dr.elena', 'elena.santos@municipal.gov', '$2y$10$jKHpp5IpdTHG6L6Wz3iiFuzdjV5tUQFAm868tzkLx5O...', 'staff', 'Dr. Elena Santos', 'Health Center', 1, NULL, '2026-06-25 19:40:10'),
(5, 'dr.miguel', 'miguel.reyes@municipal.gov', '$2y$10$jKHpp5IpdTHG6L6Wz3iiFuzdjV5tUQFAm868tzkLx5O...', 'staff', 'Dr. Miguel Reyes', 'Health Center', 1, NULL, '2026-06-25 19:40:10'),
(6, 'inspector.juan', 'juan.delacruz@municipal.gov', '$2y$10$jKHpp5IpdTHG6L6Wz3iiFuzdjV5tUQFAm868tzkLx5O...', 'staff', 'Juan Dela Cruz', 'Sanitation', 1, NULL, '2026-06-25 19:40:10');

-- --------------------------------------------------------

--
-- Table structure for table `user_sessions`
--

CREATE TABLE `user_sessions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_sessions`
--

INSERT INTO `user_sessions` (`id`, `user_id`, `token`, `expires_at`, `created_at`) VALUES
(1, 1, '18cc082725199c033872cc61ffa61cf71c842fbd10658f16dda74803a14803a2', '2026-06-26 09:12:04', '2026-06-25 15:12:04'),
(2, 1, '2b7dcfee41d56e730e98ec826516493a1d7e625ef3420b7c8512c4ecedc8bae1', '2026-06-26 09:14:14', '2026-06-25 15:14:14'),
(3, 1, '627e9b334e44635fe157b03188c3ed2abdbc59a2e02a61775456c6b5754c749b', '2026-06-26 09:18:20', '2026-06-25 15:18:20'),
(4, 1, 'b03417b61433efa188e96eeb64b1f2d0a2a0b2a5a9f1d65981064b30d7067f11', '2026-06-26 09:19:03', '2026-06-25 15:19:03'),
(5, 1, '1ebe51e3c212fa0a6924a666367a96ea482ae0cd1e0b7c49915ba37befc965c1', '2026-06-26 10:17:56', '2026-06-25 16:17:56'),
(6, 1, '8a51e8efd3acbf519eda942ba19745f71a0c43cd2410a62018a23e4654b1c9cb', '2026-06-26 11:33:52', '2026-06-25 17:33:52'),
(7, 1, '237ae96e457946b64158323295400c10a6e7f78e7e044cc0fcdcd791f4dbc15b', '2026-06-26 12:23:06', '2026-06-25 18:23:06'),
(8, 1, '761a52f4b8b5fad570a9138da42c6adbed484ca7fcf2cb967218b0cfd7b4cebd', '2026-06-26 12:29:23', '2026-06-25 18:29:23'),
(9, 1, '8c270b5d49ccae531f668876389d5930252360ff297c332f0faf7c5799f215a8', '2026-06-26 13:18:30', '2026-06-25 19:18:30'),
(10, 1, '0ce562e51cad062b30197d398a484e079704c7133805384dab7da9057baead71', '2026-06-26 15:13:04', '2026-06-25 21:13:04'),
(11, 1, '4834f255ab12da828504162d3c1853cf066e75ab61e0de7b7cbf76dd3d775bd7', '2026-06-26 15:27:20', '2026-06-25 21:27:20'),
(12, 1, 'ff7c25f514635b8cdbfbec8dfcb09a553afc6f608b89f5d48f9ff02b195346db', '2026-06-26 15:29:43', '2026-06-25 21:29:43'),
(13, 1, '5e8393af6848f7477918374b343fdd98eb5e18eaae8ed3553161b2db290401cb', '2026-06-26 15:36:53', '2026-06-25 21:36:53'),
(14, 1, 'f0eef9c61296c0376272a9c2cdef6df5ee424ffdf83fa2a04fc35e4a5198579b', '2026-06-26 20:37:26', '2026-06-26 02:37:26'),
(15, 1, 'eeda0913923a5fc4eee8280e8bbda7dba760f1c977a56e9a50c4516ae95ee5fb', '2026-06-26 20:52:08', '2026-06-26 02:52:08'),
(16, 1, '590a083b59e2f6485a50c1ff7e488b6ce51527da200c734afc6894906ade968f', '2026-06-26 22:19:19', '2026-06-26 04:19:19'),
(17, 1, 'f89b0d26d9f4566faf025e3b66e53b0eed7c28c12575795648707c5748ff8968', '2026-06-27 00:47:15', '2026-06-26 06:47:15'),
(18, 1, '39a9e1db3fc882dc5d9806b877dba825d8d763c8ce25f12f54ac44cd9e30a72f', '2026-06-27 01:12:33', '2026-06-26 07:12:33'),
(19, 1, '944bcba2344e4c993d148134ffb23283540eb572e732b38e392feb64b4978c5c', '2026-06-27 03:02:48', '2026-06-26 09:02:48'),
(20, 2, '688f0a2c8407b7381fc2ab2d3e492c5e8549ade1286a7e84f200acb58d81026d', '2026-06-27 05:43:30', '2026-06-26 11:43:30'),
(21, 1, 'ec827cb4777b37551bd1b2c8ceed501655ee860e5e9a3ec71ca84642e1fc51ac', '2026-06-27 05:56:08', '2026-06-26 11:56:08'),
(22, 1, '23e15a6f42f11f08c82fc3a69000fc0653963d88f278652e427168e19e747fa6', '2026-06-27 07:27:43', '2026-06-26 13:27:43'),
(23, 1, '1e415a0bf3a2bd196419ed7b0a1a8571b9116937295825730538b213de9f365c', '2026-06-29 08:44:31', '2026-06-28 14:44:31'),
(24, 2, '0f755dc9118f9cf2b1bb1fc548b65e7429f110fd898293c6434093dab49e49b0', '2026-06-29 10:44:28', '2026-06-28 16:44:28'),
(25, 1, '0d5a0fa866200b74020c36dddebc2c2ad8bd75e4ed3b1f089cab167c48d6ab83', '2026-06-29 10:48:51', '2026-06-28 16:48:51');

-- --------------------------------------------------------

--
-- Table structure for table `violations`
--

CREATE TABLE `violations` (
  `id` int(11) NOT NULL,
  `household` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `barangay` varchar(100) DEFAULT NULL,
  `violation` text DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `risk` enum('Low','Medium','High','Critical') DEFAULT 'Medium',
  `status` enum('Open','In Progress','Escalated','Resolved') DEFAULT 'Open',
  `due_date` date DEFAULT NULL,
  `repeat_offender` tinyint(1) DEFAULT 0,
  `score` int(11) DEFAULT 50,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `violations`
--

INSERT INTO `violations` (`id`, `household`, `address`, `barangay`, `violation`, `type`, `risk`, `status`, `due_date`, `repeat_offender`, `score`, `created_at`, `updated_at`) VALUES
(1, 'Pedro Garcia', '123 Rizal St.', 'San Jose', 'Improper waste disposal', 'Waste Disposal', 'High', 'Escalated', '2026-07-15', 1, 34, '2026-06-26 04:07:15', '2026-06-26 04:56:26'),
(2, 'ABC Restaurant', '456 Mabini Ave.', 'Poblacion', 'Food safety violation', 'Food Safety', 'Critical', 'Resolved', '2026-06-30', 1, 18, '2026-06-26 04:07:15', '2026-06-26 04:52:49'),
(3, 'Green Market Stall', '789 Bonifacio Rd.', 'San Jose', 'No sanitary permit', 'Permit', 'Medium', 'Resolved', '2026-07-20', 0, 55, '2026-06-26 04:07:15', '2026-06-26 04:52:49');

-- --------------------------------------------------------

--
-- Table structure for table `wastewater_requests`
--

CREATE TABLE `wastewater_requests` (
  `id` int(11) NOT NULL,
  `requester` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `status` enum('Pending','Approved','In Progress','Completed') DEFAULT 'Pending',
  `priority` enum('Low','Medium','High','Critical') DEFAULT 'Medium',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `wastewater_requests`
--

INSERT INTO `wastewater_requests` (`id`, `requester`, `address`, `type`, `status`, `priority`, `created_at`) VALUES
(1, 'Pedro Garcia', '123 Rizal St., San Jose', 'Septic Tank Cleaning', 'Pending', 'High', '2026-06-19 16:00:00'),
(2, 'ABC Hotel', '456 Mabini Ave., Poblacion', 'Wastewater Inspection', 'Approved', 'Critical', '2026-06-20 16:00:00'),
(3, 'Carlos Lim', '789 Bonifacio Rd., Riverside', 'Septic Installation', 'Completed', 'Medium', '2026-06-21 16:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `who_growth_standards`
--

CREATE TABLE `who_growth_standards` (
  `id` int(11) NOT NULL,
  `sex` enum('Male','Female') NOT NULL,
  `age_months` int(11) NOT NULL COMMENT 'Age in months (0-60)',
  `parameter` enum('weight','height','bmi','head_circumference') NOT NULL,
  `sd3neg` decimal(6,2) DEFAULT NULL COMMENT '-3 Standard Deviations',
  `sd2neg` decimal(6,2) DEFAULT NULL COMMENT '-2 Standard Deviations',
  `sd1neg` decimal(6,2) DEFAULT NULL COMMENT '-1 Standard Deviation',
  `median` decimal(6,2) DEFAULT NULL COMMENT 'Median (50th percentile)',
  `sd1` decimal(6,2) DEFAULT NULL COMMENT '+1 Standard Deviation',
  `sd2` decimal(6,2) DEFAULT NULL COMMENT '+2 Standard Deviations',
  `sd3` decimal(6,2) DEFAULT NULL COMMENT '+3 Standard Deviations'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `active_sessions`
--
ALTER TABLE `active_sessions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `session_token` (`session_token`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ai_insights_cache`
--
ALTER TABLE `ai_insights_cache`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ai_tasks`
--
ALTER TABLE `ai_tasks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `alerts`
--
ALTER TABLE `alerts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `applications`
--
ALTER TABLE `applications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_date` (`submission_date`);

--
-- Indexes for table `application_documents`
--
ALTER TABLE `application_documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_application` (`application_id`);

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bmi_history`
--
ALTER TABLE `bmi_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `recorded_by` (`recorded_by`),
  ADD KEY `idx_patient_bmi` (`patient_id`,`record_date`);

--
-- Indexes for table `consultations`
--
ALTER TABLE `consultations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_patient` (`patient_id`),
  ADD KEY `idx_date` (`consultation_date`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `growth_records`
--
ALTER TABLE `growth_records`
  ADD PRIMARY KEY (`id`),
  ADD KEY `recorded_by` (`recorded_by`),
  ADD KEY `idx_patient_date` (`patient_id`,`record_date`),
  ADD KEY `idx_record_date` (`record_date`);

--
-- Indexes for table `login_attempts`
--
ALTER TABLE `login_attempts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `medical_records`
--
ALTER TABLE `medical_records`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_patient` (`patient_id`),
  ADD KEY `idx_date` (`record_date`),
  ADD KEY `idx_type` (`record_type`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `patient_id` (`patient_id`),
  ADD KEY `idx_patient_id` (`patient_id`),
  ADD KEY `idx_name` (`full_name`),
  ADD KEY `idx_birth_date` (`birth_date`),
  ADD KEY `idx_is_child` (`is_child`),
  ADD KEY `idx_triage` (`triage`),
  ADD KEY `idx_last_visit` (`last_visit`);

--
-- Indexes for table `patient_documents`
--
ALTER TABLE `patient_documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_patient` (`patient_id`),
  ADD KEY `idx_category` (`file_category`),
  ADD KEY `fk_uploaded_by` (`uploaded_by`);

--
-- Indexes for table `permits`
--
ALTER TABLE `permits`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `system_status`
--
ALTER TABLE `system_status`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `violations`
--
ALTER TABLE `violations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `wastewater_requests`
--
ALTER TABLE `wastewater_requests`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `who_growth_standards`
--
ALTER TABLE `who_growth_standards`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_growth_standard` (`sex`,`age_months`,`parameter`),
  ADD KEY `idx_age_sex` (`age_months`,`sex`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `active_sessions`
--
ALTER TABLE `active_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `ai_insights_cache`
--
ALTER TABLE `ai_insights_cache`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ai_tasks`
--
ALTER TABLE `ai_tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `alerts`
--
ALTER TABLE `alerts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `applications`
--
ALTER TABLE `applications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `application_documents`
--
ALTER TABLE `application_documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `bmi_history`
--
ALTER TABLE `bmi_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `consultations`
--
ALTER TABLE `consultations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `growth_records`
--
ALTER TABLE `growth_records`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `login_attempts`
--
ALTER TABLE `login_attempts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `medical_records`
--
ALTER TABLE `medical_records`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `patients`
--
ALTER TABLE `patients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `patient_documents`
--
ALTER TABLE `patient_documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `permits`
--
ALTER TABLE `permits`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `role_permissions`
--
ALTER TABLE `role_permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `system_status`
--
ALTER TABLE `system_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `user_sessions`
--
ALTER TABLE `user_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `violations`
--
ALTER TABLE `violations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `wastewater_requests`
--
ALTER TABLE `wastewater_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `who_growth_standards`
--
ALTER TABLE `who_growth_standards`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `active_sessions`
--
ALTER TABLE `active_sessions`
  ADD CONSTRAINT `active_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `bmi_history`
--
ALTER TABLE `bmi_history`
  ADD CONSTRAINT `bmi_history_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bmi_history_ibfk_2` FOREIGN KEY (`recorded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `consultations`
--
ALTER TABLE `consultations`
  ADD CONSTRAINT `consultations_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`) ON DELETE CASCADE;

--
-- Constraints for table `growth_records`
--
ALTER TABLE `growth_records`
  ADD CONSTRAINT `growth_records_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `growth_records_ibfk_2` FOREIGN KEY (`recorded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `login_attempts`
--
ALTER TABLE `login_attempts`
  ADD CONSTRAINT `login_attempts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `medical_records`
--
ALTER TABLE `medical_records`
  ADD CONSTRAINT `medical_records_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`) ON DELETE CASCADE;

--
-- Constraints for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD CONSTRAINT `password_resets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `patient_documents`
--
ALTER TABLE `patient_documents`
  ADD CONSTRAINT `fk_patient_doc` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_uploaded_by` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
