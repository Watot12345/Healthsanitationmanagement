/**
 * Health & Sanitation Management System
 * Static frontend - role-based UI with fake data
 */

// ─── State ───────────────────────────────────────────────────────────────────
const state = {
  role: 'admin',
  view: 'dashboard',
  darkMode: localStorage.getItem('hsms-dark') === 'true',
  sidebarOpen: false,
  searchFilters: {},
};

// ─── Fake Data ───────────────────────────────────────────────────────────────
const DATA = {
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
    { id: 'APT-001', patient: 'Pedro Garcia', service: 'General Checkup', date: '2026-06-23', time: '09:00 AM', status: 'Pending' },
    { id: 'APT-002', patient: 'Rosa Mendoza', service: 'Dental Consultation', date: '2026-06-23', time: '10:30 AM', status: 'Approved' },
    { id: 'APT-003', patient: 'Carlos Lim', service: 'Laboratory Test', date: '2026-06-24', time: '08:00 AM', status: 'Completed' },
    { id: 'APT-004', patient: 'Elena Torres', service: 'Prenatal Care', date: '2026-06-24', time: '02:00 PM', status: 'Pending' },
    { id: 'APT-005', patient: 'Miguel Santos', service: 'Vaccination', date: '2026-06-25', time: '11:00 AM', status: 'Approved' },
  ],
  patients: [
    { id: 'P-101', name: 'Pedro Garcia', age: 34, bloodType: 'O+', lastVisit: '2026-05-15', condition: 'Hypertension' },
    { id: 'P-102', name: 'Rosa Mendoza', age: 28, bloodType: 'A+', lastVisit: '2026-06-01', condition: 'Healthy' },
    { id: 'P-103', name: 'Carlos Lim', age: 45, bloodType: 'B+', lastVisit: '2026-06-10', condition: 'Diabetes Type 2' },
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
    { id: 'CH-001', name: 'Sofia Garcia', age: '2 yrs', mother: 'Rosa Mendoza', vaccines: 75, nextDue: 'MMR Booster' },
    { id: 'CH-002', name: 'Luis Mendoza', age: '1 yr', mother: 'Rosa Mendoza', vaccines: 50, nextDue: 'Hepatitis B' },
    { id: 'CH-003', name: 'Emma Lim', age: '3 yrs', mother: 'Carlos Lim', vaccines: 90, nextDue: 'Annual Checkup' },
    { id: 'CH-004', name: 'Noah Torres', age: '6 mo', mother: 'Elena Torres', vaccines: 30, nextDue: 'DPT 2nd Dose' },
  ],
  wastewater: [
    { id: 'WW-201', requester: 'Pedro Garcia', address: '123 Rizal St.', type: 'Septic Tank Cleaning', date: '2026-06-20', status: 'Pending' },
    { id: 'WW-202', requester: 'ABC Hotel', address: '456 Mabini Ave.', type: 'Wastewater Inspection', date: '2026-06-21', status: 'In Progress' },
    { id: 'WW-203', requester: 'Carlos Lim', address: '789 Bonifacio Rd.', type: 'Septic Installation', date: '2026-06-22', status: 'Completed' },
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
};

// ─── Navigation Config ───────────────────────────────────────────────────────
const NAV = {
  admin: [
    { id: 'dashboard', label: 'System Overview', icon: 'chart' },
    { id: 'users', label: 'User Management', icon: 'users' },
    { id: 'logs', label: 'System Logs', icon: 'document' },
    { id: 'analytics', label: 'Analytics', icon: 'analytics' },
    { id: 'settings', label: 'Settings', icon: 'cog' },
  ],
  staff: [
    { id: 'health-center', label: 'Health Center', icon: 'heart' },
    { id: 'sanitation', label: 'Sanitation Permits', icon: 'clipboard' },
    { id: 'immunization', label: 'Immunization', icon: 'shield' },
    { id: 'wastewater', label: 'Wastewater Services', icon: 'water' },
    { id: 'surveillance', label: 'Health Surveillance', icon: 'alert' },
  ],
  user: [
    { id: 'profile', label: 'My Health Profile', icon: 'user' },
    { id: 'book-appointment', label: 'Book Appointment', icon: 'calendar' },
    { id: 'request-permit', label: 'Sanitation Permit', icon: 'clipboard' },
    { id: 'my-immunization', label: 'Immunization Records', icon: 'shield' },
    { id: 'request-wastewater', label: 'Wastewater Service', icon: 'water' },
    { id: 'track-requests', label: 'Track Requests', icon: 'timeline' },
  ],
};

const ROLE_META = {
  admin: { label: 'Admin Panel', userName: 'Maria Santos', userRole: 'Administrator' },
  staff: { label: 'Staff Panel', userName: 'Juan Dela Cruz', userRole: 'Health Officer' },
  user: { label: 'End User Portal', userName: 'Pedro Garcia', userRole: 'Citizen' },
};

const VIEW_META = {
  dashboard: { title: 'System Overview', subtitle: 'Dashboard analytics and system health' },
  users: { title: 'User Management', subtitle: 'Manage system users and role assignments' },
  logs: { title: 'System Logs', subtitle: 'Audit trail and activity records' },
  analytics: { title: 'Analytics', subtitle: 'Reports and activity summaries' },
  settings: { title: 'Settings', subtitle: 'System configuration and preferences' },
  'health-center': { title: 'Health Center Services', subtitle: 'Appointments and patient records' },
  sanitation: { title: 'Sanitation Permits', subtitle: 'Application review and inspections' },
  immunization: { title: 'Immunization Tracker', subtitle: 'Child vaccination records' },
  wastewater: { title: 'Wastewater Services', subtitle: 'Service requests and inspections' },
  surveillance: { title: 'Health Surveillance', subtitle: 'Case reporting and outbreak alerts' },
  profile: { title: 'My Health Profile', subtitle: 'Your personal health information' },
  'book-appointment': { title: 'Book Appointment', subtitle: 'Schedule a health center visit' },
  'request-permit': { title: 'Request Sanitation Permit', subtitle: 'Apply for a sanitation permit' },
  'my-immunization': { title: 'Immunization Records', subtitle: 'Your vaccination history' },
  'request-wastewater': { title: 'Request Wastewater Service', subtitle: 'Septic and wastewater services' },
  'track-requests': { title: 'Track Requests', subtitle: 'Monitor your submitted requests' },
};

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const ICONS = {
  chart: '<path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"/>',
  users: '<path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"/>',
  document: '<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/>',
  analytics: '<path stroke-linecap="round" stroke-linejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"/>',
  cog: '<path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.753-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>',
  heart: '<path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"/>',
  clipboard: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"/>',
  shield: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"/>',
  water: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 3c4.97 0 9 3.582 9 8 0 1.657-.436 3.209-1.193 4.548-.348.597-.742 1.153-1.173 1.664A8.997 8.997 0 0 1 12 21a8.997 8.997 0 0 1-5.634-1.788 11.96 11.96 0 0 1-1.173-1.664C4.436 14.209 4 12.657 4 11c0-4.418 4.03-8 9-8Z"/>',
  alert: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"/>',
  user: '<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/>',
  calendar: '<path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"/>',
  timeline: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>',
};

function icon(name, cls = 'h-5 w-5') {
  return `<svg class="${cls}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">${ICONS[name] || ICONS.document}</svg>`;
}

// ─── Utilities ─────────────────────────────────────────────────────────────
function badge(status) {
  const map = {
    Active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    Inactive: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    Approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    Completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    Rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    Scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    Due: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    Low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    Moderate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    High: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };
  const cls = map[status] || 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400';
  return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}">${status}</span>`;
}

function card(content, extra = '') {
  return `<div class="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow ${extra}">${content}</div>`;
}

function btnPrimary(label, action, extra = '') {
  return `<button type="button" data-action="${action}" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gov-600 text-white text-sm font-medium hover:bg-gov-700 transition-colors shadow-sm hover:shadow ${extra}">${label}</button>`;
}

function btnSecondary(label, action, extra = '') {
  return `<button type="button" data-action="${action}" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${extra}">${label}</button>`;
}

function btnDanger(label, action) {
  return `<button type="button" data-action="${action}" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">${label}</button>`;
}

function btnSuccess(label, action) {
  return `<button type="button" data-action="${action}" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">${label}</button>`;
}

function searchInput(id, placeholder = 'Search...') {
  return `<div class="relative">
    <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/></svg>
    <input type="search" id="${id}" placeholder="${placeholder}" class="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-gov-500 transition-shadow">
  </div>`;
}

function tableWrap(content) {
  return `<div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">${content}</div>`;
}

function emptyState(msg) {
  return `<div class="text-center py-12 text-slate-500 dark:text-slate-400"><p>${msg}</p></div>`;
}

// ─── Toast System ────────────────────────────────────────────────────────────
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const colors = {
    success: 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    error: 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300',
    info: 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
  };
  const icons = {
    success: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>',
    error: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"/>',
    info: '<path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"/>',
  };
  const toast = document.createElement('div');
  toast.className = `pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border-l-4 shadow-lg toast-enter ${colors[type]}`;
  toast.innerHTML = `<svg class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">${icons[type]}</svg><p class="text-sm font-medium">${message}</p>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.replace('toast-enter', 'toast-exit');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ─── Modal System ────────────────────────────────────────────────────────────
function openModal(title, body, footer = '') {
  const overlay = document.getElementById('modal-overlay');
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = body;
  document.getElementById('modal-footer').innerHTML = footer;
  overlay.classList.remove('hidden');
  overlay.classList.add('flex', 'modal-open');
  document.getElementById('modal-panel').classList.remove('scale-95', 'opacity-0');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.add('modal-closing');
  overlay.classList.remove('modal-open');
  setTimeout(() => {
    overlay.classList.add('hidden');
    overlay.classList.remove('flex', 'modal-closing');
    document.getElementById('modal-panel').classList.add('scale-95', 'opacity-0');
    document.body.style.overflow = '';
  }, 200);
}

// ─── View Renderers: Admin ───────────────────────────────────────────────────
function renderDashboard() {
  const k = DATA.kpis;
  const kpis = [
    { label: 'Total Users', value: k.totalUsers.toLocaleString(), color: 'bg-blue-500', icon: 'users' },
    { label: 'Active Staff', value: k.activeStaff, color: 'bg-green-500', icon: 'heart' },
    { label: 'Pending Requests', value: k.pendingRequests, color: 'bg-yellow-500', icon: 'clipboard' },
    { label: 'System Alerts', value: k.systemAlerts, color: 'bg-red-500', icon: 'alert' },
  ];
  const kpiCards = kpis.map(kpi => card(`
    <div class="p-5 flex items-start justify-between">
      <div>
        <p class="text-sm text-slate-500 dark:text-slate-400">${kpi.label}</p>
        <p class="text-3xl font-bold mt-1">${kpi.value}</p>
      </div>
      <div class="p-3 rounded-xl ${kpi.color} text-white opacity-90">${icon(kpi.icon)}</div>
    </div>
  `)).join('');

  const recentLogs = DATA.logs.slice(0, 4).map(l => `
    <div class="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700 last:border-0">
      <div><p class="text-sm font-medium">${l.action}</p><p class="text-xs text-slate-500">${l.user} · ${l.timestamp}</p></div>
      ${badge(l.level)}
    </div>
  `).join('');

  return `<div class="space-y-6">
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">${kpiCards}</div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      ${card(`<div class="p-5"><h3 class="font-semibold mb-4">Recent Activity</h3>${recentLogs}</div>`)}
      ${card(`<div class="p-5"><h3 class="font-semibold mb-4">Quick Actions</h3>
        <div class="grid grid-cols-2 gap-3">
          ${btnPrimary('Add User', 'add-user', 'w-full justify-center')}
          ${btnSecondary('View Logs', 'nav-logs', 'w-full justify-center')}
          ${btnSecondary('Run Report', 'run-report', 'w-full justify-center')}
          ${btnSecondary('System Backup', 'system-backup', 'w-full justify-center')}
        </div></div>`)}
    </div>
    ${card(`<div class="p-5">
      <div class="flex items-center justify-between mb-4"><h3 class="font-semibold">System Alerts</h3>${badge('High')}</div>
      <div class="space-y-3">
        <div class="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          ${icon('alert', 'h-5 w-5 text-red-500 shrink-0 mt-0.5')}
          <div><p class="text-sm font-medium text-red-800 dark:text-red-300">Influenza outbreak detected in 3 barangays</p><p class="text-xs text-red-600 dark:text-red-400 mt-1">Requires immediate staff mobilization</p></div>
        </div>
        <div class="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
          ${icon('alert', 'h-5 w-5 text-yellow-500 shrink-0 mt-0.5')}
          <div><p class="text-sm font-medium text-yellow-800 dark:text-yellow-300">87 pending requests awaiting review</p><p class="text-xs text-yellow-600 dark:text-yellow-400 mt-1">Average wait time: 2.3 days</p></div>
        </div>
      </div>
    </div>`)}
  </div>`;
}

function renderUsers(filter = '') {
  const q = filter.toLowerCase();
  const filtered = DATA.users.filter(u =>
    !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q)
  );
  const rows = filtered.map(u => `<tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
    <td class="px-4 py-3 text-sm font-medium">${u.name}</td>
    <td class="px-4 py-3 text-sm text-slate-500">${u.email}</td>
    <td class="px-4 py-3 text-sm">${badge(u.role)}</td>
    <td class="px-4 py-3 text-sm">${badge(u.status)}</td>
    <td class="px-4 py-3 text-sm text-slate-500">${u.joined}</td>
    <td class="px-4 py-3 text-sm">
      <div class="flex gap-1">
        <button data-action="edit-user" data-id="${u.id}" class="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors" title="Edit">${icon('cog', 'h-4 w-4')}</button>
        <button data-action="delete-user" data-id="${u.id}" class="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors" title="Delete">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/></svg>
        </button>
      </div>
    </td>
  </tr>`).join('');

  return `<div class="space-y-4">
    <div class="flex flex-col sm:flex-row gap-3 justify-between">
      ${searchInput('user-search', 'Search users...')}
      ${btnPrimary('+ Add User', 'add-user')}
    </div>
    ${tableWrap(`<table class="w-full text-left"><thead class="bg-slate-50 dark:bg-slate-700/50"><tr>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Name</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Email</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Role</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Status</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Joined</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Actions</th>
    </tr></thead><tbody class="divide-y divide-slate-200 dark:divide-slate-700">${rows || `<tr><td colspan="6">${emptyState('No users found')}</td></tr>`}</tbody></table>`)}
  </div>`;
}

function renderLogs(filter = '') {
  const q = filter.toLowerCase();
  const filtered = DATA.logs.filter(l =>
    !q || l.action.toLowerCase().includes(q) || l.user.toLowerCase().includes(q) || l.module.toLowerCase().includes(q)
  );
  const rows = filtered.map(l => `<tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
    <td class="px-4 py-3 text-sm text-slate-500 whitespace-nowrap">${l.timestamp}</td>
    <td class="px-4 py-3 text-sm font-medium">${l.user}</td>
    <td class="px-4 py-3 text-sm">${l.action}</td>
    <td class="px-4 py-3 text-sm text-slate-500">${l.module}</td>
    <td class="px-4 py-3 text-sm">${badge(l.level)}</td>
  </tr>`).join('');

  return `<div class="space-y-4">
    ${searchInput('log-search', 'Search logs...')}
    ${tableWrap(`<table class="w-full text-left"><thead class="bg-slate-50 dark:bg-slate-700/50"><tr>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Timestamp</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">User</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Action</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Module</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Level</th>
    </tr></thead><tbody class="divide-y divide-slate-200 dark:divide-slate-700">${rows}</tbody></table>`)}
  </div>`;
}

function renderAnalytics() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const values = [65, 78, 90, 81, 95, 88];
  const max = Math.max(...values);
  const bars = values.map((v, i) => `
    <div class="flex flex-col items-center gap-2 flex-1">
      <div class="w-full flex items-end justify-center h-40 bg-slate-50 dark:bg-slate-700/30 rounded-lg p-2">
        <div class="chart-bar w-8 sm:w-12 rounded-t-md bg-gov-500 hover:bg-gov-600 transition-colors" style="height:${(v / max) * 100}%"></div>
      </div>
      <span class="text-xs text-slate-500">${months[i]}</span>
    </div>
  `).join('');

  const summaries = [
    { title: 'Appointments', value: '342', change: '+12%', color: 'text-green-600' },
    { title: 'Permits Issued', value: '89', change: '+5%', color: 'text-green-600' },
    { title: 'Inspections', value: '156', change: '+8%', color: 'text-green-600' },
    { title: 'Cases Reported', value: '48', change: '-3%', color: 'text-red-600' },
  ].map(s => card(`<div class="p-4"><p class="text-sm text-slate-500">${s.title}</p><p class="text-2xl font-bold mt-1">${s.value}</p><p class="text-xs ${s.color} mt-1">${s.change} vs last month</p></div>`)).join('');

  return `<div class="space-y-6">
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">${summaries}</div>
    ${card(`<div class="p-5"><h3 class="font-semibold mb-6">Monthly Service Requests</h3><div class="flex gap-2 sm:gap-4">${bars}</div></div>`)}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      ${card(`<div class="p-5"><h3 class="font-semibold mb-4">Service Distribution</h3>
        <div class="space-y-3">
          ${[{l:'Health Center',p:35,c:'bg-blue-500'},{l:'Sanitation',p:25,c:'bg-green-500'},{l:'Immunization',p:20,c:'bg-yellow-500'},{l:'Wastewater',p:20,c:'bg-purple-500'}].map(i=>`
            <div><div class="flex justify-between text-sm mb-1"><span>${i.l}</span><span class="font-medium">${i.p}%</span></div>
            <div class="h-2 rounded-full bg-slate-100 dark:bg-slate-700"><div class="h-2 rounded-full ${i.c} progress-bar" style="width:${i.p}%"></div></div></div>`).join('')}
        </div></div>`)}
      ${card(`<div class="p-5"><h3 class="font-semibold mb-4">Staff Performance</h3>
        <div class="space-y-3">
          ${['Juan Dela Cruz - 94%','Ana Reyes - 91%','Carlos Tan - 88%','Elena Santos - 85%'].map(n=>`
            <div class="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50"><span class="text-sm">${n.split(' - ')[0]}</span><span class="text-sm font-semibold text-gov-600">${n.split(' - ')[1]}</span></div>`).join('')}
        </div></div>`)}
    </div>
  </div>`;
}

function renderSettings() {
  return `<div class="max-w-2xl space-y-6">
    ${card(`<div class="p-5"><h3 class="font-semibold mb-4">General Settings</h3>
      <form class="space-y-4" onsubmit="return false">
        <div><label class="block text-sm font-medium mb-1">System Name</label>
          <input type="text" value="Health & Sanitation Management System" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none"></div>
        <div><label class="block text-sm font-medium mb-1">Municipality</label>
          <input type="text" value="City of San Jose" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none"></div>
        <div><label class="block text-sm font-medium mb-1">Contact Email</label>
          <input type="email" value="health@sanjoce.gov.ph" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none"></div>
        ${btnPrimary('Save Changes', 'save-settings')}
      </form></div>`)}
    ${card(`<div class="p-5"><h3 class="font-semibold mb-4">Notification Settings</h3>
      <div class="space-y-3">
        ${['Email alerts for system errors','SMS notifications for outbreaks','Daily summary reports'].map((t,i)=>`
          <label class="flex items-center gap-3 cursor-pointer"><input type="checkbox" ${i<2?'checked':''} class="rounded border-slate-300 text-gov-600 focus:ring-gov-500"><span class="text-sm">${t}</span></label>`).join('')}
      </div></div>`)}
    ${card(`<div class="p-5"><h3 class="font-semibold mb-4 text-red-600">Danger Zone</h3>
      <p class="text-sm text-slate-500 mb-3">These actions cannot be undone.</p>
      <div class="flex gap-2">${btnDanger('Reset System Data', 'reset-system')} ${btnDanger('Clear All Logs', 'clear-logs')}</div></div>`)}
  </div>`;
}

// ─── View Renderers: Staff ───────────────────────────────────────────────────
function renderHealthCenter(filter = '') {
  const q = filter.toLowerCase();
  const appts = DATA.appointments.filter(a =>
    !q || a.patient.toLowerCase().includes(q) || a.service.toLowerCase().includes(q) || a.status.toLowerCase().includes(q)
  );
  const aptRows = appts.map(a => `<tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
    <td class="px-4 py-3 text-sm font-mono">${a.id}</td>
    <td class="px-4 py-3 text-sm font-medium">${a.patient}</td>
    <td class="px-4 py-3 text-sm">${a.service}</td>
    <td class="px-4 py-3 text-sm">${a.date}</td>
    <td class="px-4 py-3 text-sm">${a.time}</td>
    <td class="px-4 py-3 text-sm">${badge(a.status)}</td>
    <td class="px-4 py-3 text-sm"><div class="flex gap-1">${btnSuccess('Approve', 'approve-apt')} ${btnDanger('Reject', 'reject-apt')}</div></td>
  </tr>`).join('');

  const patRows = DATA.patients.map(p => `<tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
    <td class="px-4 py-3 text-sm font-mono">${p.id}</td>
    <td class="px-4 py-3 text-sm font-medium">${p.name}</td>
    <td class="px-4 py-3 text-sm">${p.age}</td>
    <td class="px-4 py-3 text-sm">${p.bloodType}</td>
    <td class="px-4 py-3 text-sm text-slate-500">${p.lastVisit}</td>
    <td class="px-4 py-3 text-sm">${p.condition}</td>
    <td class="px-4 py-3 text-sm"><button data-action="view-patient" data-id="${p.id}" class="text-gov-600 hover:underline text-sm">View</button></td>
  </tr>`).join('');

  return `<div class="space-y-6">
    ${card(`<div class="p-5"><div class="flex flex-col sm:flex-row justify-between gap-3 mb-4">
      <h3 class="font-semibold">Appointment Queue</h3>${searchInput('apt-search', 'Search appointments...')}
    </div>${tableWrap(`<table class="w-full text-left"><thead class="bg-slate-50 dark:bg-slate-700/50"><tr>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">ID</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Patient</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Service</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Date</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Time</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Status</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Actions</th>
    </tr></thead><tbody class="divide-y divide-slate-200 dark:divide-slate-700">${aptRows}</tbody></table>`)}</div>`)}
    ${card(`<div class="p-5"><h3 class="font-semibold mb-4">Patient Records</h3>${tableWrap(`<table class="w-full text-left"><thead class="bg-slate-50 dark:bg-slate-700/50"><tr>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">ID</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Name</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Age</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Blood</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Last Visit</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Condition</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500"></th>
    </tr></thead><tbody class="divide-y divide-slate-200 dark:divide-slate-700">${patRows}</tbody></table>`)}</div>`)}
  </div>`;
}

function renderSanitation(filter = '') {
  const q = filter.toLowerCase();
  const permits = DATA.permits.filter(p =>
    !q || p.applicant.toLowerCase().includes(q) || p.type.toLowerCase().includes(q) || p.status.toLowerCase().includes(q)
  );
  const rows = permits.map(p => `<tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
    <td class="px-4 py-3 text-sm font-mono">${p.id}</td>
    <td class="px-4 py-3 text-sm font-medium">${p.applicant}</td>
    <td class="px-4 py-3 text-sm">${p.type}</td>
    <td class="px-4 py-3 text-sm text-slate-500">${p.date}</td>
    <td class="px-4 py-3 text-sm">${badge(p.status)}</td>
    <td class="px-4 py-3 text-sm text-slate-500">${p.inspector}</td>
    <td class="px-4 py-3 text-sm"><div class="flex gap-1 flex-wrap">${btnSuccess('Approve', 'approve-permit')} ${btnDanger('Reject', 'reject-permit')} ${btnSecondary('Schedule', 'schedule-inspection')}</div></td>
  </tr>`).join('');

  const inspRows = DATA.inspections.map(i => `<tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
    <td class="px-4 py-3 text-sm font-mono">${i.id}</td>
    <td class="px-4 py-3 text-sm">${i.permit}</td>
    <td class="px-4 py-3 text-sm">${i.date}</td>
    <td class="px-4 py-3 text-sm">${i.time}</td>
    <td class="px-4 py-3 text-sm">${i.inspector}</td>
    <td class="px-4 py-3 text-sm">${badge(i.status)}</td>
  </tr>`).join('');

  return `<div class="space-y-6">
    <div class="flex flex-col sm:flex-row gap-3 justify-between">${searchInput('permit-search', 'Search permits...')}${btnPrimary('Schedule Inspection', 'schedule-inspection')}</div>
    ${card(`<div class="p-5"><h3 class="font-semibold mb-4">Application Review</h3>${tableWrap(`<table class="w-full text-left"><thead class="bg-slate-50 dark:bg-slate-700/50"><tr>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">ID</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Applicant</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Type</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Date</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Status</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Inspector</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Actions</th>
    </tr></thead><tbody class="divide-y divide-slate-200 dark:divide-slate-700">${rows}</tbody></table>`)}</div>`)}
    ${card(`<div class="p-5"><h3 class="font-semibold mb-4">Scheduled Inspections</h3>${tableWrap(`<table class="w-full text-left"><thead class="bg-slate-50 dark:bg-slate-700/50"><tr>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">ID</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Permit</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Date</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Time</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Inspector</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Status</th>
    </tr></thead><tbody class="divide-y divide-slate-200 dark:divide-slate-700">${inspRows}</tbody></table>`)}</div>`)}
  </div>`;
}

function renderImmunization() {
  const cards = DATA.children.map(c => card(`
    <div class="p-5">
      <div class="flex justify-between items-start mb-3">
        <div><h4 class="font-semibold">${c.name}</h4><p class="text-sm text-slate-500">${c.age} · Mother: ${c.mother}</p></div>
        ${btnSecondary('Update', 'update-child', 'text-xs px-3 py-1.5')}
      </div>
      <div class="mb-2 flex justify-between text-sm"><span>Vaccination Progress</span><span class="font-semibold">${c.vaccines}%</span></div>
      <div class="h-3 rounded-full bg-slate-100 dark:bg-slate-700 mb-3"><div class="h-3 rounded-full bg-green-500 progress-bar" style="width:${c.vaccines}%"></div></div>
      <p class="text-xs text-slate-500">Next due: <span class="font-medium text-gov-600">${c.nextDue}</span></p>
    </div>
  `)).join('');

  return `<div class="space-y-4">
    <div class="flex justify-between items-center">${btnPrimary('+ Add Child Record', 'add-child')}</div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">${cards}</div>
  </div>`;
}

function renderWastewater(filter = '') {
  const q = filter.toLowerCase();
  const items = DATA.wastewater.filter(w =>
    !q || w.requester.toLowerCase().includes(q) || w.type.toLowerCase().includes(q) || w.status.toLowerCase().includes(q)
  );
  const rows = items.map(w => `<tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
    <td class="px-4 py-3 text-sm font-mono">${w.id}</td>
    <td class="px-4 py-3 text-sm font-medium">${w.requester}</td>
    <td class="px-4 py-3 text-sm text-slate-500">${w.address}</td>
    <td class="px-4 py-3 text-sm">${w.type}</td>
    <td class="px-4 py-3 text-sm text-slate-500">${w.date}</td>
    <td class="px-4 py-3 text-sm">${badge(w.status)}</td>
    <td class="px-4 py-3 text-sm"><button data-action="view-checklist" class="text-gov-600 hover:underline text-sm">Checklist</button></td>
  </tr>`).join('');

  const timeline = ['Request Submitted', 'Assigned to Team', 'Inspection Scheduled', 'Work In Progress', 'Completed'];
  const timelineHtml = timeline.map((step, i) => `
    <div class="flex gap-4 ${i < timeline.length - 1 ? 'pb-6' : ''}">
      <div class="flex flex-col items-center">
        <div class="timeline-dot h-4 w-4 rounded-full ${i <= 2 ? 'bg-gov-600' : 'bg-slate-300 dark:bg-slate-600'}"></div>
        ${i < timeline.length - 1 ? '<div class="w-0.5 flex-1 bg-slate-200 dark:bg-slate-700 mt-1"></div>' : ''}
      </div>
      <div class="pb-2"><p class="text-sm font-medium ${i <= 2 ? '' : 'text-slate-400'}">${step}</p></div>
    </div>
  `).join('');

  return `<div class="space-y-6">
    ${searchInput('ww-search', 'Search service requests...')}
    ${card(`<div class="p-5"><h3 class="font-semibold mb-4">Service Requests</h3>${tableWrap(`<table class="w-full text-left"><thead class="bg-slate-50 dark:bg-slate-700/50"><tr>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">ID</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Requester</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Address</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Type</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Date</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Status</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500"></th>
    </tr></thead><tbody class="divide-y divide-slate-200 dark:divide-slate-700">${rows}</tbody></table>`)}</div>`)}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      ${card(`<div class="p-5"><h3 class="font-semibold mb-4">Inspection Checklist</h3>
        <div class="space-y-2">
          ${['Tank condition assessed','Drainage system checked','Overflow prevention verified','Documentation complete','Safety protocols followed'].map((item,i)=>`
            <label class="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer">
              <input type="checkbox" ${i<3?'checked':''} class="rounded text-gov-600 focus:ring-gov-500"><span class="text-sm">${item}</span></label>`).join('')}
        </div>${btnPrimary('Submit Checklist', 'submit-checklist', 'mt-4')}</div>`)}
      ${card(`<div class="p-5"><h3 class="font-semibold mb-4">Status Timeline (WW-202)</h3>${timelineHtml}</div>`)}
    </div>
  </div>`;
}

function renderSurveillance(filter = '', severityFilter = '') {
  const q = filter.toLowerCase();
  const filtered = DATA.surveillance.filter(s => {
    const matchSearch = !q || s.disease.toLowerCase().includes(q) || s.barangay.toLowerCase().includes(q);
    const matchSev = !severityFilter || s.severity === severityFilter;
    return matchSearch && matchSev;
  });

  const alertStyles = {
    red: { box: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800', icon: 'text-red-500' },
    yellow: { box: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800', icon: 'text-yellow-500' },
    green: { box: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800', icon: 'text-green-500' },
  };
  const alerts = [
    { level: 'High', msg: 'Influenza cluster detected — 28 cases across multiple barangays', color: 'red' },
    { level: 'Moderate', msg: 'Dengue cases rising in Barangay San Jose — 12 confirmed', color: 'yellow' },
    { level: 'Low', msg: 'Food poisoning incident contained — 3 cases in Poblacion', color: 'green' },
  ].map(a => `
    <div class="flex items-start gap-3 p-4 rounded-xl border ${alertStyles[a.color].box}">
      ${icon('alert', `h-5 w-5 shrink-0 mt-0.5 ${alertStyles[a.color].icon}`)}
      <div><p class="text-sm font-medium">${a.msg}</p>${badge(a.level)}</div>
    </div>
  `).join('');

  const rows = filtered.map(s => `<tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
    <td class="px-4 py-3 text-sm font-mono">${s.id}</td>
    <td class="px-4 py-3 text-sm font-medium">${s.disease}</td>
    <td class="px-4 py-3 text-sm">${s.cases}</td>
    <td class="px-4 py-3 text-sm">${s.barangay}</td>
    <td class="px-4 py-3 text-sm">${badge(s.severity)}</td>
    <td class="px-4 py-3 text-sm text-slate-500">${s.date}</td>
  </tr>`).join('');

  return `<div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">${alerts}</div>
    <div class="flex flex-col sm:flex-row gap-3">
      ${searchInput('surv-search', 'Search cases...')}
      <select id="severity-filter" class="rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none">
        <option value="">All Severity</option>
        <option value="Low">Low</option>
        <option value="Moderate">Moderate</option>
        <option value="High">High</option>
      </select>
      ${btnPrimary('Report Case', 'report-case')}
    </div>
    ${card(`<div class="p-5"><h3 class="font-semibold mb-4">Case Reports</h3>${tableWrap(`<table class="w-full text-left"><thead class="bg-slate-50 dark:bg-slate-700/50"><tr>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">ID</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Disease</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Cases</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Barangay</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Severity</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Date</th>
    </tr></thead><tbody class="divide-y divide-slate-200 dark:divide-slate-700">${rows}</tbody></table>`)}</div>`)}
  </div>`;
}

// ─── View Renderers: End User ────────────────────────────────────────────────
function renderProfile() {
  const p = DATA.userProfile;
  return `<div class="max-w-3xl space-y-6">
    ${card(`<div class="p-6">
      <div class="flex flex-col sm:flex-row items-center gap-6 mb-6">
        <div class="h-24 w-24 rounded-full bg-gov-100 dark:bg-gov-900/30 flex items-center justify-center text-gov-600 text-3xl font-bold">${p.name.charAt(0)}</div>
        <div class="text-center sm:text-left"><h3 class="text-xl font-bold">${p.name}</h3><p class="text-slate-500">${p.email}</p>${badge('Active')}</div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        ${[{l:'Phone',v:p.phone},{l:'Address',v:p.address},{l:'Birthdate',v:p.birthdate},{l:'Blood Type',v:p.bloodType},{l:'Emergency Contact',v:p.emergencyContact}].map(f=>`
          <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50"><p class="text-xs text-slate-500 uppercase tracking-wider">${f.l}</p><p class="text-sm font-medium mt-1">${f.v}</p></div>`).join('')}
      </div>
      ${btnSecondary('Edit Profile', 'edit-profile', 'mt-4')}
    </div>`)}
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      ${[{l:'Appointments',v:'3',c:'text-blue-600'},{l:'Active Requests',v:'2',c:'text-yellow-600'},{l:'Completed',v:'5',c:'text-green-600'}].map(s=>card(`
        <div class="p-4 text-center"><p class="text-2xl font-bold ${s.c}">${s.v}</p><p class="text-sm text-slate-500 mt-1">${s.l}</p></div>`)).join('')}
    </div>
  </div>`;
}

function renderBookAppointment() {
  return `<div class="max-w-xl">
    ${card(`<div class="p-6"><h3 class="font-semibold mb-4">Schedule an Appointment</h3>
      <form id="appointment-form" class="space-y-4" onsubmit="return false">
        <div><label class="block text-sm font-medium mb-1">Service Type</label>
          <select class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none">
            <option>General Checkup</option><option>Dental Consultation</option><option>Laboratory Test</option><option>Vaccination</option><option>Prenatal Care</option>
          </select></div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label class="block text-sm font-medium mb-1">Preferred Date</label>
            <input type="date" class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none"></div>
          <div><label class="block text-sm font-medium mb-1">Preferred Time</label>
            <select class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none">
              <option>08:00 AM</option><option>09:00 AM</option><option>10:00 AM</option><option>02:00 PM</option><option>03:00 PM</option>
            </select></div>
        </div>
        <div><label class="block text-sm font-medium mb-1">Reason for Visit</label>
          <textarea rows="3" placeholder="Describe your symptoms or reason..." class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none resize-none"></textarea></div>
        <button type="submit" data-action="submit-appointment" class="w-full py-3 rounded-xl bg-gov-600 text-white font-semibold text-base hover:bg-gov-700 transition-colors shadow-sm hover:shadow-md">Book Appointment</button>
      </form></div>`)}
  </div>`;
}

function renderRequestPermit() {
  return `<div class="max-w-xl">
    ${card(`<div class="p-6"><h3 class="font-semibold mb-4">Sanitation Permit Application</h3>
      <form class="space-y-4" onsubmit="return false">
        <div><label class="block text-sm font-medium mb-1">Business Name</label>
          <input type="text" placeholder="Enter business name" class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none"></div>
        <div><label class="block text-sm font-medium mb-1">Permit Type</label>
          <select class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none">
            <option>Food Establishment</option><option>Market Vendor</option><option>Bakery</option><option>Recreational Facility</option>
          </select></div>
        <div><label class="block text-sm font-medium mb-1">Business Address</label>
          <input type="text" placeholder="Full address" class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none"></div>
        <div><label class="block text-sm font-medium mb-1">Upload Documents</label>
          <div class="border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl p-6 text-center hover:border-gov-400 transition-colors cursor-pointer">
            <svg class="h-8 w-8 mx-auto text-slate-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"/></svg>
            <p class="text-sm text-slate-500">Click to upload or drag files here</p>
          </div></div>
        <button type="submit" data-action="submit-permit" class="w-full py-3 rounded-xl bg-gov-600 text-white font-semibold text-base hover:bg-gov-700 transition-colors">Submit Application</button>
      </form></div>`)}
  </div>`;
}

function renderMyImmunization() {
  const rows = DATA.userImmunization.map(r => `<tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
    <td class="px-4 py-3 text-sm font-medium">${r.vaccine}</td>
    <td class="px-4 py-3 text-sm text-slate-500">${r.date}</td>
    <td class="px-4 py-3 text-sm text-slate-500">${r.provider}</td>
    <td class="px-4 py-3 text-sm">${badge(r.status)}</td>
  </tr>`).join('');

  return `<div class="space-y-4 max-w-3xl">
    ${card(`<div class="p-5 flex items-center gap-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
      ${icon('shield', 'h-8 w-8 text-green-600')}
      <div><p class="font-semibold text-green-800 dark:text-green-300">Vaccination Status: Up to Date</p><p class="text-sm text-green-600 dark:text-green-400">3 of 4 recommended vaccines completed</p></div>
    </div>`)}
    ${tableWrap(`<table class="w-full text-left rounded-xl border border-slate-200 dark:border-slate-700"><thead class="bg-slate-50 dark:bg-slate-700/50"><tr>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Vaccine</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Date</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Provider</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Status</th>
    </tr></thead><tbody class="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-800">${rows}</tbody></table>`)}
  </div>`;
}

function renderRequestWastewater() {
  return `<div class="max-w-xl">
    ${card(`<div class="p-6"><h3 class="font-semibold mb-4">Request Wastewater / Septic Service</h3>
      <form class="space-y-4" onsubmit="return false">
        <div><label class="block text-sm font-medium mb-1">Service Type</label>
          <select class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none">
            <option>Septic Tank Cleaning</option><option>Septic Installation</option><option>Wastewater Inspection</option><option>Drainage Repair</option>
          </select></div>
        <div><label class="block text-sm font-medium mb-1">Property Address</label>
          <input type="text" value="123 Rizal St., Barangay San Jose" class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none"></div>
        <div><label class="block text-sm font-medium mb-1">Preferred Schedule</label>
          <input type="date" class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none"></div>
        <div><label class="block text-sm font-medium mb-1">Additional Notes</label>
          <textarea rows="3" placeholder="Describe the issue..." class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none resize-none"></textarea></div>
        <button type="submit" data-action="submit-wastewater" class="w-full py-3 rounded-xl bg-gov-600 text-white font-semibold text-base hover:bg-gov-700 transition-colors">Submit Request</button>
      </form></div>`)}
  </div>`;
}

function renderTrackRequests() {
  const barWidths = { Pending: 33, Approved: 66, Completed: 100, Rejected: 50 };
  const barColors = {
    Pending: 'bg-yellow-500',
    Approved: 'bg-green-500',
    Completed: 'bg-green-500',
    Rejected: 'bg-red-500',
  };
  const cards = DATA.userRequests.map(r => card(`
      <div class="p-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div><p class="text-xs font-mono text-slate-500">${r.id}</p><h4 class="font-semibold">${r.title}</h4><p class="text-sm text-slate-500">${r.type} · ${r.date}</p></div>
          ${badge(r.status)}
        </div>
        <div class="flex items-center gap-2">
          <div class="h-2 flex-1 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
            <div class="h-2 rounded-full progress-bar ${barColors[r.status] || 'bg-blue-500'}" style="width:${barWidths[r.status] || 50}%"></div>
          </div>
        </div>
      </div>
    `)).join('');

  const timeline = DATA.userRequests.map((r, i) => `
    <div class="flex gap-4 ${i < DATA.userRequests.length - 1 ? 'pb-8' : ''}">
      <div class="flex flex-col items-center">
        <div class="timeline-dot h-4 w-4 rounded-full ${r.status === 'Rejected' ? 'bg-red-500' : r.status === 'Pending' ? 'bg-yellow-500' : 'bg-green-500'}"></div>
        ${i < DATA.userRequests.length - 1 ? '<div class="w-0.5 flex-1 bg-slate-200 dark:bg-slate-700 mt-1"></div>' : ''}
      </div>
      <div><p class="text-sm font-medium">${r.title}</p><p class="text-xs text-slate-500">${r.type} · ${r.date}</p>${badge(r.status)}</div>
    </div>
  `).join('');

  return `<div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">${cards}</div>
    ${card(`<div class="p-5"><h3 class="font-semibold mb-6">Request Timeline</h3>${timeline}</div>`)}
  </div>`;
}

// ─── App Core ────────────────────────────────────────────────────────────────
const VIEW_RENDERERS = {
  dashboard: () => renderDashboard(),
  users: () => renderUsers(getSearchValue('user-search')),
  logs: () => renderLogs(getSearchValue('log-search')),
  analytics: () => renderAnalytics(),
  settings: () => renderSettings(),
  'health-center': () => renderHealthCenter(getSearchValue('apt-search')),
  sanitation: () => renderSanitation(getSearchValue('permit-search')),
  immunization: () => renderImmunization(),
  wastewater: () => renderWastewater(getSearchValue('ww-search')),
  surveillance: () => renderSurveillance(getSearchValue('surv-search'), getSelectValue('severity-filter')),
  profile: () => renderProfile(),
  'book-appointment': () => renderBookAppointment(),
  'request-permit': () => renderRequestPermit(),
  'my-immunization': () => renderMyImmunization(),
  'request-wastewater': () => renderRequestWastewater(),
  'track-requests': () => renderTrackRequests(),
};

function getSearchValue(id) {
  const el = document.getElementById(id);
  return el ? el.value : state.searchFilters[id] || '';
}

function getSelectValue(id) {
  const el = document.getElementById(id);
  return el ? el.value : '';
}

function renderSidebar() {
  const nav = NAV[state.role];
  const navEl = document.getElementById('sidebar-nav');
  navEl.innerHTML = nav.map(item => `
    <button type="button" data-nav="${item.id}" class="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${state.view === item.id ? 'active' : ''}">
      ${icon(item.icon, 'h-5 w-5 shrink-0')}
      <span>${item.label}</span>
    </button>
  `).join('');

  const meta = ROLE_META[state.role];
  document.getElementById('role-label').textContent = meta.label;
  document.getElementById('current-user-name').textContent = meta.userName;
  document.getElementById('current-user-role').textContent = meta.userRole;
}

function updateHeader() {
  const meta = VIEW_META[state.view] || { title: 'Dashboard', subtitle: '' };
  document.getElementById('page-title').textContent = meta.title;
  document.getElementById('page-subtitle').textContent = meta.subtitle;
}

function renderView() {
  const renderer = VIEW_RENDERERS[state.view];
  const main = document.getElementById('main-content');
  main.innerHTML = renderer ? renderer() : emptyState('View not found');
  main.classList.add('fade-in');
  setTimeout(() => main.classList.remove('fade-in'), 300);
  updateHeader();
  renderSidebar();
  bindSearchInputs();
  restoreSearchValues();
}

function restoreSearchValues() {
  Object.entries(state.searchFilters).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  });
}

function bindSearchInputs() {
  // Search/filter handled via delegated input listener on main-content
}

function handleSearchInput(e) {
  const id = e.target.id;
  const searchIds = ['user-search', 'log-search', 'apt-search', 'permit-search', 'ww-search', 'surv-search'];
  if (searchIds.includes(id)) {
    state.searchFilters[id] = e.target.value;
    renderViewPreserveScroll();
  }
  if (id === 'severity-filter') {
    state.searchFilters['severity-filter'] = e.target.value;
    renderViewPreserveScroll();
  }
}

function renderViewPreserveScroll() {
  const scrollY = window.scrollY;
  const activeId = document.activeElement?.id;
  renderView();
  window.scrollTo(0, scrollY);
  if (activeId) {
    const el = document.getElementById(activeId);
    if (el) el.focus();
  }
}

function switchRole(role) {
  state.role = role;
  state.view = NAV[role][0].id;
  state.searchFilters = {};
  document.getElementById('role-switcher').value = role;
  closeSidebarMobile();
  renderView();
  showToast(`Switched to ${ROLE_META[role].label}`, 'info');
}

function navigateTo(viewId) {
  state.view = viewId;
  closeSidebarMobile();
  renderView();
}

function toggleDarkMode() {
  state.darkMode = !state.darkMode;
  document.documentElement.classList.toggle('dark', state.darkMode);
  localStorage.setItem('hsms-dark', state.darkMode);
}

function toggleSidebar() {
  state.sidebarOpen = !state.sidebarOpen;
  document.getElementById('sidebar').classList.toggle('open', state.sidebarOpen);
  document.getElementById('sidebar-backdrop').classList.toggle('hidden', !state.sidebarOpen);
}

function closeSidebarMobile() {
  state.sidebarOpen = false;
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-backdrop').classList.add('hidden');
}

// ─── Modal Forms ─────────────────────────────────────────────────────────────
function showAddUserModal() {
  openModal('Add New User', `
    <form class="space-y-4" onsubmit="return false">
      <div><label class="block text-sm font-medium mb-1">Full Name</label>
        <input type="text" placeholder="Enter full name" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none"></div>
      <div><label class="block text-sm font-medium mb-1">Email</label>
        <input type="email" placeholder="email@municipal.gov" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none"></div>
      <div><label class="block text-sm font-medium mb-1">Role</label>
        <select class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none">
          <option>Admin</option><option>Staff</option><option>User</option>
        </select></div>
    </form>`,
    `${btnSecondary('Cancel', 'close-modal')} ${btnPrimary('Add User', 'confirm-add-user')}`
  );
}

function showEditUserModal(id) {
  const user = DATA.users.find(u => u.id === id);
  if (!user) return;
  openModal('Edit User', `
    <form class="space-y-4" onsubmit="return false">
      <div><label class="block text-sm font-medium mb-1">Full Name</label>
        <input type="text" value="${user.name}" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none"></div>
      <div><label class="block text-sm font-medium mb-1">Email</label>
        <input type="email" value="${user.email}" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none"></div>
      <div><label class="block text-sm font-medium mb-1">Role</label>
        <select class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none">
          <option ${user.role==='Admin'?'selected':''}>Admin</option>
          <option ${user.role==='Staff'?'selected':''}>Staff</option>
          <option ${user.role==='User'?'selected':''}>User</option>
        </select></div>
      <div><label class="block text-sm font-medium mb-1">Status</label>
        <select class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none">
          <option ${user.status==='Active'?'selected':''}>Active</option>
          <option ${user.status==='Inactive'?'selected':''}>Inactive</option>
        </select></div>
    </form>`,
    `${btnSecondary('Cancel', 'close-modal')} ${btnPrimary('Save Changes', 'confirm-edit-user')}`
  );
}

function showUpdateChildModal() {
  openModal('Update Immunization Record', `
    <form class="space-y-4" onsubmit="return false">
      <div><label class="block text-sm font-medium mb-1">Child Name</label>
        <input type="text" value="Sofia Garcia" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none"></div>
      <div><label class="block text-sm font-medium mb-1">Vaccine Administered</label>
        <select class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none">
          <option>BCG</option><option>DPT</option><option>MMR</option><option>Hepatitis B</option><option>Polio</option>
        </select></div>
      <div><label class="block text-sm font-medium mb-1">Date Administered</label>
        <input type="date" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none"></div>
      <div><label class="block text-sm font-medium mb-1">Progress (%)</label>
        <input type="range" min="0" max="100" value="75" class="w-full accent-gov-600"></div>
    </form>`,
    `${btnSecondary('Cancel', 'close-modal')} ${btnPrimary('Update Record', 'confirm-update-child')}`
  );
}

function showScheduleInspectionModal() {
  openModal('Schedule Inspection', `
    <form class="space-y-4" onsubmit="return false">
      <div><label class="block text-sm font-medium mb-1">Permit ID</label>
        <select class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none">
          ${DATA.permits.filter(p=>p.status==='Pending').map(p=>`<option>${p.id} - ${p.applicant}</option>`).join('')}
        </select></div>
      <div><label class="block text-sm font-medium mb-1">Inspector</label>
        <select class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none">
          <option>Juan Dela Cruz</option><option>Ana Reyes</option>
        </select></div>
      <div class="grid grid-cols-2 gap-4">
        <div><label class="block text-sm font-medium mb-1">Date</label>
          <input type="date" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none"></div>
        <div><label class="block text-sm font-medium mb-1">Time</label>
          <input type="time" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none"></div>
      </div>
    </form>`,
    `${btnSecondary('Cancel', 'close-modal')} ${btnPrimary('Schedule', 'confirm-schedule')}`
  );
}

function showChecklistModal() {
  openModal('Inspection Checklist', `
    <div class="space-y-2">
      ${['Site accessibility verified','Equipment inspected','Safety measures in place','Compliance documentation reviewed','Photos taken'].map((item,i)=>`
        <label class="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer">
          <input type="checkbox" ${i<2?'checked':''} class="rounded text-gov-600 focus:ring-gov-500"><span class="text-sm">${item}</span></label>`).join('')}
    </div>`,
    `${btnSecondary('Cancel', 'close-modal')} ${btnPrimary('Save Checklist', 'submit-checklist')}`
  );
}

function showReportCaseModal() {
  openModal('Report New Case', `
    <form class="space-y-4" onsubmit="return false">
      <div><label class="block text-sm font-medium mb-1">Disease / Condition</label>
        <input type="text" placeholder="e.g. Dengue Fever" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none"></div>
      <div><label class="block text-sm font-medium mb-1">Number of Cases</label>
        <input type="number" min="1" value="1" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none"></div>
      <div><label class="block text-sm font-medium mb-1">Barangay</label>
        <input type="text" placeholder="Barangay name" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none"></div>
      <div><label class="block text-sm font-medium mb-1">Severity</label>
        <select class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none">
          <option>Low</option><option>Moderate</option><option>High</option>
        </select></div>
    </form>`,
    `${btnSecondary('Cancel', 'close-modal')} ${btnPrimary('Submit Report', 'confirm-report-case')}`
  );
}

function showNotificationsModal() {
  openModal('Notifications', `
    <div class="space-y-3">
      ${[
        { msg: 'New appointment request from Pedro Garcia', time: '5 min ago', type: 'info' },
        { msg: 'Permit SP-1042 approved successfully', time: '1 hour ago', type: 'success' },
        { msg: 'Influenza outbreak alert — action required', time: '2 hours ago', type: 'error' },
        { msg: 'System backup completed', time: 'Yesterday', type: 'success' },
      ].map(n => `
        <div class="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
          <div class="flex-1"><p class="text-sm font-medium">${n.msg}</p><p class="text-xs text-slate-500 mt-1">${n.time}</p></div>
          ${badge(n.type)}
        </div>`).join('')}
    </div>`, btnSecondary('Close', 'close-modal')
  );
}

// ─── Action Handler ──────────────────────────────────────────────────────────
function handleAction(action, target) {
  const actions = {
    'close-modal': () => closeModal(),
    'add-user': () => showAddUserModal(),
    'confirm-add-user': () => { closeModal(); showToast('User added successfully', 'success'); },
    'edit-user': () => showEditUserModal(Number(target.dataset.id)),
    'confirm-edit-user': () => { closeModal(); showToast('User updated successfully', 'success'); },
    'delete-user': () => { showToast('User deleted successfully', 'success'); renderView(); },
    'nav-logs': () => navigateTo('logs'),
    'run-report': () => showToast('Report generated successfully', 'success'),
    'system-backup': () => showToast('System backup initiated', 'info'),
    'save-settings': () => showToast('Settings saved successfully', 'success'),
    'reset-system': () => showToast('System reset is disabled in demo mode', 'error'),
    'clear-logs': () => showToast('Log clearing requires admin confirmation', 'error'),
    'approve-apt': () => showToast('Appointment approved', 'success'),
    'reject-apt': () => showToast('Appointment rejected', 'error'),
    'view-patient': () => showToast('Patient record opened', 'info'),
    'approve-permit': () => showToast('Permit approved successfully', 'success'),
    'reject-permit': () => showToast('Permit application rejected', 'error'),
    'schedule-inspection': () => showScheduleInspectionModal(),
    'confirm-schedule': () => { closeModal(); showToast('Inspection scheduled successfully', 'success'); },
    'update-child': () => showUpdateChildModal(),
    'add-child': () => showUpdateChildModal(),
    'confirm-update-child': () => { closeModal(); showToast('Immunization record updated', 'success'); },
    'view-checklist': () => showChecklistModal(),
    'submit-checklist': () => { closeModal(); showToast('Checklist submitted successfully', 'success'); },
    'report-case': () => showReportCaseModal(),
    'confirm-report-case': () => { closeModal(); showToast('Case report submitted', 'success'); },
    'show-notifications': () => showNotificationsModal(),
    'edit-profile': () => showToast('Profile editing is UI-only in demo', 'info'),
    'submit-appointment': () => showToast('Appointment booked successfully!', 'success'),
    'submit-permit': () => showToast('Permit application submitted!', 'success'),
    'submit-wastewater': () => showToast('Service request submitted!', 'success'),
  };
  if (actions[action]) actions[action]();
}

// ─── Event Listeners ─────────────────────────────────────────────────────────
function initApp() {
  if (state.darkMode) document.documentElement.classList.add('dark');

  document.getElementById('role-switcher').addEventListener('change', (e) => switchRole(e.target.value));
  document.getElementById('dark-mode-toggle').addEventListener('click', toggleDarkMode);
  document.getElementById('menu-toggle').addEventListener('click', toggleSidebar);
  document.getElementById('sidebar-backdrop').addEventListener('click', closeSidebarMobile);

  document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
  });

  document.addEventListener('click', (e) => {
    const navBtn = e.target.closest('[data-nav]');
    if (navBtn) { navigateTo(navBtn.dataset.nav); return; }

    const actionEl = e.target.closest('[data-action]');
    if (actionEl) {
      e.preventDefault();
      handleAction(actionEl.dataset.action, actionEl);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  document.getElementById('main-content').addEventListener('input', handleSearchInput);
  document.getElementById('main-content').addEventListener('change', handleSearchInput);

  renderView();
}

document.addEventListener('DOMContentLoaded', initApp);
