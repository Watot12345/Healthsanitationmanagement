// ─── Fake Data ───────────────────────────────────────────────────────────────
export const DATA = {
    users: [
      { id: 1, name: 'Maria Santos', email: 'maria.santos@municipal.gov', role: 'Admin', status: 'Active', joined: '2023-01-15' },
      { id: 2, name: 'Juan Dela Cruz', email: 'juan.delacruz@municipal.gov', role: 'Staff', status: 'Active', joined: '2023-03-22' },
      { id: 3, name: 'Ana Reyes', email: 'ana.reyes@municipal.gov', role: 'Staff', status: 'Active', joined: '2023-06-10' },
      { id: 4, name: 'Pedro Garcia', email: 'pedro.garcia@email.com', role: 'User', status: 'Active', joined: '2024-01-05' },
      { id: 5, name: 'Rosa Mendoza', email: 'rosa.mendoza@email.com', role: 'User', status: 'Inactive', joined: '2024-02-18' },
      { id: 6, name: 'Carlos Lim', email: 'carlos.lim@email.com', role: 'User', status: 'Active', joined: '2024-03-30' },
    ],
    logs: [
      { id: 1, timestamp: '2026-06-22 09:15:32', user: 'Maria Santos', action: 'User role updated', module: 'User Management', level: 'info' },
      { id: 2, timestamp: '2026-06-22 08:45:10', user: 'Juan Dela Cruz', action: 'Permit approved #SP-1042', module: 'Sanitation', level: 'success' },
      { id: 3, timestamp: '2026-06-22 08:30:00', user: 'System', action: 'Backup completed successfully', module: 'System', level: 'success' },
      { id: 4, timestamp: '2026-06-22 07:55:22', user: 'Ana Reyes', action: 'Outbreak alert triggered', module: 'Surveillance', level: 'warning' },
      { id: 5, timestamp: '2026-06-21 16:20:45', user: 'Pedro Garcia', action: 'Appointment booked', module: 'Health Center', level: 'info' },
      { id: 6, timestamp: '2026-06-21 14:10:00', user: 'System', action: 'Failed login attempt blocked', module: 'Security', level: 'error' },
    ],
    appointments: [
      { id: 'APT-001', patient: 'Pedro Garcia', service: 'General Checkup', date: '2026-06-23', time: '09:00 AM', status: 'Pending', triage: 'Medium' },
      { id: 'APT-002', patient: 'Rosa Mendoza', service: 'Dental Consultation', date: '2026-06-23', time: '10:30 AM', status: 'Approved', triage: 'Low' },
      { id: 'APT-003', patient: 'Carlos Lim', service: 'Laboratory Test', date: '2026-06-24', time: '08:00 AM', status: 'Completed', triage: 'High' },
      { id: 'APT-004', patient: 'Elena Torres', service: 'Prenatal Care', date: '2026-06-24', time: '02:00 PM', status: 'Pending', triage: 'Critical' },
      { id: 'APT-005', patient: 'Miguel Santos', service: 'Vaccination', date: '2026-06-25', time: '11:00 AM', status: 'Approved', triage: 'Low' },
    ],
    patients: [
      { id: 'P-101', name: 'Pedro Garcia', age: 34, bloodType: 'O+', lastVisit: '2026-05-15', condition: 'Hypertension', triage: 'Medium' },
      { id: 'P-102', name: 'Rosa Mendoza', age: 28, bloodType: 'A+', lastVisit: '2026-06-01', condition: 'Healthy', triage: 'Low' },
      { id: 'P-103', name: 'Carlos Lim', age: 45, bloodType: 'B+', lastVisit: '2026-06-10', condition: 'Diabetes Type 2', triage: 'High' },
    ],
    permits: [
      { id: 'SP-1040', applicant: 'ABC Restaurant', type: 'Food Establishment', date: '2026-06-20', status: 'Pending', inspector: 'Unassigned' },
      { id: 'SP-1041', applicant: 'Green Market Stall', type: 'Market Vendor', date: '2026-06-21', status: 'Approved', inspector: 'Juan Dela Cruz' },
      { id: 'SP-1042', applicant: 'Fresh Bakes Co.', type: 'Bakery', date: '2026-06-22', status: 'Pending', inspector: 'Ana Reyes' },
      { id: 'SP-1043', applicant: 'City Gym', type: 'Recreational Facility', date: '2026-06-22', status: 'Rejected', inspector: 'Juan Dela Cruz' },
    ],
    inspections: [
      { id: 'INS-501', permit: 'SP-1042', date: '2026-06-25', time: '10:00 AM', inspector: 'Ana Reyes', status: 'Scheduled' },
      { id: 'INS-502', permit: 'SP-1040', date: '2026-06-26', time: '02:00 PM', inspector: 'Juan Dela Cruz', status: 'Scheduled' },
    ],
    children: [
      { id: 'CH-001', name: 'Sofia Garcia', age: '2 yrs', mother: 'Rosa Mendoza', vaccines: 75, nextDue: 'MMR Booster', nutritionRisk: 'Low', weight: '12.4 kg' },
      { id: 'CH-002', name: 'Luis Mendoza', age: '1 yr', mother: 'Rosa Mendoza', vaccines: 50, nextDue: 'Hepatitis B', nutritionRisk: 'Moderate', weight: '9.1 kg' },
      { id: 'CH-003', name: 'Emma Lim', age: '3 yrs', mother: 'Carlos Lim', vaccines: 90, nextDue: 'Annual Checkup', nutritionRisk: 'Low', weight: '14.8 kg' },
      { id: 'CH-004', name: 'Noah Torres', age: '6 mo', mother: 'Elena Torres', vaccines: 30, nextDue: 'DPT 2nd Dose', nutritionRisk: 'High', weight: '7.2 kg' },
    ],
    wastewater: [
      { id: 'WW-201', requester: 'Pedro Garcia', address: '123 Rizal St.', type: 'Septic Tank Cleaning', date: '2026-06-20', status: 'Pending', priority: 'High' },
      { id: 'WW-202', requester: 'ABC Hotel', address: '456 Mabini Ave.', type: 'Wastewater Inspection', date: '2026-06-21', status: 'In Progress', priority: 'Critical' },
      { id: 'WW-203', requester: 'Carlos Lim', address: '789 Bonifacio Rd.', type: 'Septic Installation', date: '2026-06-22', status: 'Completed', priority: 'Medium' },
    ],
    surveillance: [
      { id: 'CS-001', disease: 'Dengue Fever', cases: 12, barangay: 'Barangay San Jose', severity: 'Moderate', date: '2026-06-22' },
      { id: 'CS-002', disease: 'Food Poisoning', cases: 3, barangay: 'Barangay Poblacion', severity: 'Low', date: '2026-06-21' },
      { id: 'CS-003', disease: 'Influenza', cases: 28, barangay: 'Multiple', severity: 'High', date: '2026-06-20' },
      { id: 'CS-004', disease: 'Leptospirosis', cases: 5, barangay: 'Barangay Riverside', severity: 'Moderate', date: '2026-06-19' },
    ],
    userProfile: {
      name: 'Pedro Garcia',
      email: 'pedro.garcia@email.com',
      phone: '+63 912 345 6789',
      address: '123 Rizal St., Barangay San Jose',
      birthdate: '1992-03-15',
      bloodType: 'O+',
      emergencyContact: 'Maria Garcia - +63 917 654 3210',
    },
    userRequests: [
      { id: 'REQ-001', type: 'Appointment', title: 'General Checkup', date: '2026-06-20', status: 'Approved' },
      { id: 'REQ-002', type: 'Sanitation Permit', title: 'Home Food Business', date: '2026-06-18', status: 'Pending' },
      { id: 'REQ-003', type: 'Wastewater Service', title: 'Septic Tank Cleaning', date: '2026-06-15', status: 'Completed' },
      { id: 'REQ-004', type: 'Immunization', title: 'Flu Vaccine', date: '2026-06-10', status: 'Rejected' },
    ],
    userImmunization: [
      { vaccine: 'COVID-19 Booster', date: '2025-11-20', provider: 'City Health Center', status: 'Completed' },
      { vaccine: 'Influenza', date: '2025-09-05', provider: 'City Health Center', status: 'Completed' },
      { vaccine: 'Tetanus', date: '2024-06-12', provider: 'Barangay Clinic', status: 'Completed' },
      { vaccine: 'Hepatitis B', date: '—', provider: '—', status: 'Due' },
    ],
    kpis: {
      totalUsers: 1248,
      activeStaff: 42,
      pendingRequests: 87,
      systemAlerts: 5,
    },
    doctors: [
      { name: 'Dr. Elena Santos', specialty: 'General Medicine', status: 'Available' },
      { name: 'Dr. Miguel Reyes', specialty: 'Pediatrics', status: 'Busy' },
      { name: 'Dr. Ana Cruz', specialty: 'Dental', status: 'Available' },
      { name: 'Dr. Carlos Tan', specialty: 'OB-GYN', status: 'Offline' },
    ],
    notifications: [
      { id: 1, msg: 'New appointment request from Pedro Garcia', time: '5 min ago', type: 'info', read: false },
      { id: 2, msg: 'Permit SP-1042 approved successfully', time: '1 hour ago', type: 'success', read: false },
      { id: 3, msg: 'Influenza outbreak alert — action required', time: '2 hours ago', type: 'error', read: false },
      { id: 4, msg: 'System backup completed', time: 'Yesterday', type: 'success', read: true },
      { id: 5, msg: '87 pending requests awaiting review', time: 'Yesterday', type: 'warning', read: true },
    ],
    recentUpdates: [
      { title: 'New sanitation permit submitted', module: 'Sanitation', time: '10 min ago', type: 'info' },
      { title: 'Dengue case reported in Barangay San Jose', module: 'Surveillance', time: '25 min ago', type: 'warning' },
      { title: 'Septic service WW-203 completed', module: 'Wastewater', time: '1 hour ago', type: 'success' },
      { title: 'MMR booster due for Sofia Garcia', module: 'Immunization', time: '2 hours ago', type: 'info' },
      { title: 'User role updated for Carlos Lim', module: 'Admin', time: '3 hours ago', type: 'info' },
    ],
    systemStatus: { uptime: '99.8%', activeSessions: 24, pendingApprovals: 87 },
    technicians: [
      { name: 'Roberto Silva', status: 'On Site', assignment: 'WW-202' },
      { name: 'Jose Mendoza', status: 'Available', assignment: 'Unassigned' },
      { name: 'Luis Torres', status: 'En Route', assignment: 'WW-201' },
    ],
    incidents: [
      { time: '2026-06-22 09:00', event: 'Influenza cluster alert escalated to High', severity: 'High' },
      { time: '2026-06-22 07:30', event: 'Dengue screening initiated in Barangay San Jose', severity: 'Moderate' },
      { time: '2026-06-21 16:00', event: 'Food poisoning cases contained in Poblacion', severity: 'Low' },
      { time: '2026-06-21 10:00', event: 'Weekly surveillance report published', severity: 'info' },
    ],
    trends: [
      { disease: 'Influenza', trend: 'Rising', change: '+18%', cases: 28 },
      { disease: 'Dengue', trend: 'Stable', change: '+2%', cases: 12 },
      { disease: 'Food Poisoning', trend: 'Declining', change: '-40%', cases: 3 },
    ],
    permitDocuments: [
      { name: 'Business Registration', status: 'Uploaded' },
      { name: 'Floor Plan', status: 'Uploaded' },
      { name: 'Health Certificate', status: 'Pending' },
      { name: 'Waste Disposal Plan', status: 'Missing' },
    ],
    vaccineReminders: [
      { child: 'Noah Torres', vaccine: 'DPT 2nd Dose', dueDate: '2026-06-28', urgency: 'High' },
      { child: 'Luis Mendoza', vaccine: 'Hepatitis B', dueDate: '2026-07-05', urgency: 'Moderate' },
    ],
    consultationHistory: [
      { date: '2026-05-15', doctor: 'Dr. Elena Santos', diagnosis: 'Hypertension follow-up', notes: 'BP stable, continue medication' },
      { date: '2026-03-02', doctor: 'Dr. Miguel Reyes', diagnosis: 'Annual physical', notes: 'All vitals normal' },
      { date: '2025-11-20', doctor: 'Dr. Elena Santos', diagnosis: 'COVID-19 booster', notes: 'Vaccine administered' },
    ],
  };
  
  export function getCalendarEvents() {
    // Return dates that have events for the mini calendar
    return [5, 12, 18, 23, 28];
  }