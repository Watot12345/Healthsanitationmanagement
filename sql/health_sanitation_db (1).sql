-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 26, 2026 at 08:27 AM
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
  `generated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ai_insights_cache`
--

INSERT INTO `ai_insights_cache` (`id`, `insights`, `generated_at`) VALUES
(1, '{\"operational\":{\"title\":\"Sanitation Permit Status\",\"icon\":\"clipboard_check\",\"text\":\"Three sanitation permits are currently pending. Efficient processing is vital for ongoing health and safety compliance.\"},\"risk\":{\"title\":\"Influenza Prevalence\",\"icon\":\"biohazard_warning\",\"level\":\"High\",\"text\":\"Influenza is the most reported disease with 28 cases, requiring focused attention to mitigate community spread.\"},\"action\":{\"title\":\"Disease Alert Response\",\"icon\":\"medical_cross\",\"priority\":\"Urgent\",\"text\":\"With 2 active disease alerts and 28 influenza cases, prioritize public health outreach and intervention strategies.\"}}', '2026-06-26 10:52:21');

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
(1, 'admin', 'admin@123', '$2y$10$jKHpp5IpdTHG6L6Wz3iiFuzdjV5tUQFAm868tzkLx5OEv/veCF4ki', 'admin', 'System Administrator', 'IT Department', 1, '2026-06-26 12:19:19', '2026-06-22 05:38:55'),
(2, 'staff@123', 'staff@123', '$2y$10$jKHpp5IpdTHG6L6Wz3iiFuzdjV5tUQFAm868tzkLx5OEv/veCF4ki', 'staff', 'staff', 'HR', 1, '2026-06-25 21:46:43', '2026-06-25 13:14:39'),
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
(16, 1, '590a083b59e2f6485a50c1ff7e488b6ce51527da200c734afc6894906ade968f', '2026-06-26 22:19:19', '2026-06-26 04:19:19');

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
-- Indexes for table `alerts`
--
ALTER TABLE `alerts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `login_attempts`
--
ALTER TABLE `login_attempts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `user_id` (`user_id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `alerts`
--
ALTER TABLE `alerts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `login_attempts`
--
ALTER TABLE `login_attempts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

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
-- Constraints for dumped tables
--

--
-- Constraints for table `active_sessions`
--
ALTER TABLE `active_sessions`
  ADD CONSTRAINT `active_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `login_attempts`
--
ALTER TABLE `login_attempts`
  ADD CONSTRAINT `login_attempts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD CONSTRAINT `password_resets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
