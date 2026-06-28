// ─── APPLICATION CONFIGURATION ────────────────────────────────────────────────
// Navigation menus, role definitions, and page metadata
// (Static configuration only - for mock data see data.js)

// ─── Navigation Config ───────────────────────────────────────────────────────
export const NAV = {
  admin: [
    { id: 'dashboard', label: 'System Overview', icon: 'chart' },
    { id: 'users', label: 'User Management', icon: 'users' },
    { id: 'logs', label: 'System Logs', icon: 'document' },
    { id: 'analytics', label: 'Analytics', icon: 'analytics' },
    { id: 'reports', label: 'Reports', icon: 'document' },
    { id: 'compliance', label: 'Compliance & Violations', icon: 'shield' },
    { id: 'settings', label: 'Settings', icon: 'cog' },
    {
      id: 'health-center', label: 'Health Center Services', icon: 'heart', section: 'Modules', divider: true,
      children: [
        { id: 'patients', label: 'Patients Management', icon: 'users' },
        { id: 'consultations', label: 'Consultations', icon: 'calendar' },
        { id: 'medical-records', label: 'Medical Records', icon: 'document' },
      ]
    },
    {
      id: 'sanitation', label: 'Sanitation Permits', icon: 'clipboard', section: 'Modules', children: [
        { id: 'sanitation-applications', label: 'Permit Applications', icon: 'document' },
        { id: 'sanitation-inspections', label: 'Inspections', icon: 'shield' },
        { id: 'sanitation-records', label: 'Permit Records', icon: 'document' },
      ]
    },
    {
      id: 'immunization', label: 'Immunization & Nutrition', icon: 'shield', section: 'Modules', children: [
        { id: 'immunization-records', label: 'Child Records', icon: 'users' },
        { id: 'immunization-tracking', label: 'Vaccination Tracking', icon: 'shield' },
        { id: 'immunization-growth', label: 'Growth Charts', icon: 'analytics' },
      ]
    },
    {
      id: 'wastewater', label: 'Wastewater Services', icon: 'water', section: 'Modules', children: [
        { id: 'wastewater-registry', label: 'Septic Tank Registry', icon: 'document' },
        { id: 'wastewater-schedule', label: 'Maintenance & Desludging', icon: 'calendar' },
        { id: 'wastewater-requests', label: 'Service Requests', icon: 'clipboard' },
      ]
    },
    {
      id: 'surveillance', label: 'Health Surveillance', icon: 'alert', section: 'Modules', children: [
        { id: 'surveillance-cases', label: 'Case Reports', icon: 'document' },
        { id: 'surveillance-mapping', label: 'Mapping & Clustering', icon: 'analytics' },
        { id: 'surveillance-alerts', label: 'Outbreak Detection', icon: 'alert' },
      ]
    },
  ],
  staff: [
    { id: 'staff-dashboard', label: 'Staff Dashboard', icon: 'chart' },
    {
      id: 'health-center', label: 'Health Center', icon: 'heart', section: 'Health Services', divider: true,
      children: [
        { id: 'patients', label: 'Patients', icon: 'users' },
        { id: 'consultations', label: 'Consultations', icon: 'calendar' },
        { id: 'medical-records', label: 'Medical Records', icon: 'document' },
      ]
    },
    {
      id: 'immunization', label: 'Immunization', icon: 'shield', section: 'Health Services',
      children: [
        { id: 'immunization-records', label: 'Child Records', icon: 'users' },
        { id: 'immunization-tracking', label: 'Vaccination Tracking', icon: 'shield' },
        { id: 'immunization-growth', label: 'Growth Charts', icon: 'analytics' },
      ]
    },
    {
      id: 'surveillance', label: 'Surveillance', icon: 'alert', section: 'Health Services',
      children: [
        { id: 'surveillance-cases', label: 'Case Reports', icon: 'document' },
        { id: 'surveillance-mapping', label: 'Mapping', icon: 'analytics' },
        { id: 'surveillance-alerts', label: 'Outbreak Alerts', icon: 'alert' },
      ]
    },
    {
      id: 'sanitation', label: 'Sanitation', icon: 'clipboard', section: 'Environmental Health', divider: true,
      children: [
        { id: 'sanitation-applications', label: 'Applications', icon: 'document' },
        { id: 'sanitation-inspections', label: 'Inspections', icon: 'shield' },
        { id: 'sanitation-records', label: 'Permit Records', icon: 'document' },
      ]
    },
    {
      id: 'wastewater', label: 'Wastewater', icon: 'water', section: 'Environmental Health',
      children: [
        { id: 'wastewater-registry', label: 'Septic Registry', icon: 'document' },
        { id: 'wastewater-schedule', label: 'Maintenance', icon: 'calendar' },
        { id: 'wastewater-requests', label: 'Service Requests', icon: 'clipboard' },
      ]
    },
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

export const ROLE_META = {
  admin: { label: 'Admin Panel', userName: 'Maria Santos', userRole: 'Administrator', email: 'maria.santos@municipal.gov', badge: 'Admin', badgeClass: 'role-badge-admin' },
  staff: { label: 'Staff Panel', userName: 'Juan Dela Cruz', userRole: 'Health Officer', email: 'juan.delacruz@municipal.gov', badge: 'Staff', badgeClass: 'role-badge-staff' },
  user: { label: 'End User Portal', userName: 'Pedro Garcia', userRole: 'Citizen', email: 'pedro.garcia@email.com', badge: 'User', badgeClass: 'role-badge-user' },
};

export const VIEW_META = {
  dashboard: { title: 'System Overview', subtitle: 'Dashboard analytics and system health' },
  users: { title: 'User Management', subtitle: 'Manage system users and role assignments' },
  logs: { title: 'System Logs', subtitle: 'Audit trail and activity records' },
  analytics: { title: 'Analytics', subtitle: 'Reports and activity summaries' },
  reports: { title: 'Reports', subtitle: 'Generate and export system reports' },
  compliance: { title: 'Compliance & Violations', subtitle: 'Track and manage compliance across all departments' },
  settings: { title: 'Settings', subtitle: 'System configuration and preferences' },
  'staff-dashboard': { title: 'Staff Dashboard', subtitle: 'Overview of your tasks and modules' },
  'health-center': { title: 'Health Center Services', subtitle: 'Appointments and patient records' },
  patients: { title: 'Patients Management', subtitle: 'Manage patient records and information' },
  consultations: { title: 'Consultations', subtitle: 'Track and schedule consultations' },
  'medical-records': { title: 'Medical Records', subtitle: 'View and manage medical records' },
  sanitation: { title: 'Sanitation Permits', subtitle: 'Application review and inspections' },
  'sanitation-applications': { title: 'Permit Applications', subtitle: 'Review and process permit applications' },
  'sanitation-inspections': { title: 'Inspections', subtitle: 'Schedule and manage inspections' },
  'sanitation-records': { title: 'Permit Records', subtitle: 'View permit history and records' },
  immunization: { title: 'Immunization Tracker', subtitle: 'Child vaccination records' },
  'immunization-records': { title: 'Child Records', subtitle: 'Manage child immunization records' },
  'immunization-tracking': { title: 'Vaccination Tracking', subtitle: 'Track vaccination schedules' },
  'immunization-growth': { title: 'Growth Charts', subtitle: 'Monitor child growth metrics' },
  wastewater: { title: 'Wastewater Services', subtitle: 'Service requests and inspections' },
  'wastewater-registry': { title: 'Septic Tank Registry', subtitle: 'Manage septic tank records' },
  'wastewater-schedule': { title: 'Maintenance & Desludging', subtitle: 'Schedule maintenance tasks' },
  'wastewater-requests': { title: 'Service Requests', subtitle: 'Manage wastewater service requests' },
  surveillance: { title: 'Health Surveillance', subtitle: 'Case reporting and outbreak alerts' },
  'surveillance-cases': { title: 'Case Reports', subtitle: 'View and manage health case reports' },
  'surveillance-mapping': { title: 'Mapping & Clustering', subtitle: 'Geographic case analysis' },
  'surveillance-alerts': { title: 'Outbreak Detection', subtitle: 'Monitor and respond to outbreaks' },
  profile: { title: 'My Health Profile', subtitle: 'Your personal health information' },
  'book-appointment': { title: 'Book Appointment', subtitle: 'Schedule a health center visit' },
  'request-permit': { title: 'Request Sanitation Permit', subtitle: 'Apply for a sanitation permit' },
  'my-immunization': { title: 'Immunization Records', subtitle: 'Your vaccination history' },
  'request-wastewater': { title: 'Request Wastewater Service', subtitle: 'Septic and wastewater services' },
  'track-requests': { title: 'Track Requests', subtitle: 'Monitor your submitted requests' },
};