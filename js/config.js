// ─── Navigation Config ───────────────────────────────────────────────────────
export const NAV = {
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