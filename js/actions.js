/**
 * ============================================================================
 * ACTION HANDLER SYSTEM (actions.js)
 * ============================================================================
 * 
 * PURPOSE:
 * Centralized event delegation handler that processes all user interactions
 * across the application. Instead of attaching individual event listeners
 * to every button, all clicks bubble up to a single handler that routes
 * actions based on data-action attributes.
 * 
 * ARCHITECTURE:
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │                         EVENT DELEGATION FLOW                        │
 * │                                                                      │
 * │  User clicks button                                                  │
 * │  ↓                                                                    │
 * │  <button data-action="approve-apt">Approve</button>                  │
 * │  ↓                                                                    │
 * │  Event listener in app.js captures click                             │
 * │  ↓                                                                    │
 * │  handleAction('approve-apt', target) called                          │
 * │  ↓                                                                    │
 * │  Looks up 'approve-apt' in actions object                            │
 * │  ↓                                                                    │
 * │  Executes: showToast('Appointment approved', 'success')              │
 * └─────────────────────────────────────────────────────────────────────┘
 * 
 * ACTIONS CATEGORIES:
 * 
 * 1. MODAL ACTIONS (Open dialogs)
 * 2. CONFIRMATION ACTIONS (Close modal + show toast)
 * 3. NAVIGATION ACTIONS (Change views/routes)
 * 4. TOAST-ONLY ACTIONS (Show feedback message)
 * 5. STATE CHANGE ACTIONS (Switch role, mark read)
 */

// ============================================================================
// ACTIONS REFERENCE GUIDE
// ============================================================================

/**
 * ─── MODAL ACTIONS ────────────────────────────────────────────────────
 * These open modal dialogs for data entry/editing
 * 
 * 'add-user'              → Opens Add User form modal
 * 'edit-user'             → Opens Edit User form modal (pre-filled with user data)
 * 'schedule-inspection'   → Opens Schedule Inspection form modal
 * 'update-child'          → Opens Update Immunization Record modal
 * 'add-child'             → Opens same modal as update-child (for adding new)
 * 'view-checklist'        → Opens Inspection Checklist modal
 * 'report-case'           → Opens Report New Case form modal
 * 'show-notifications'    → Opens Notifications list modal
 * 
 * ─── CONFIRMATION ACTIONS ─────────────────────────────────────────────
 * These close the current modal and show a success toast
 * 
 * 'confirm-add-user'      → Close modal + "User added successfully"
 * 'confirm-edit-user'     → Close modal + "User updated successfully"
 * 'confirm-schedule'      → Close modal + "Inspection scheduled successfully"
 * 'confirm-update-child'  → Close modal + "Immunization record updated"
 * 'confirm-report-case'   → Close modal + "Case report submitted"
 * 'submit-checklist'      → Close modal + "Checklist submitted successfully"
 * 
 * ─── DIRECT TOAST ACTIONS ─────────────────────────────────────────────
 * These show immediate feedback without opening modals
 * 
 * 'delete-user'           → "User deleted successfully" + re-render view
 * 'run-report'            → "Report generated successfully" (success)
 * 'system-backup'         → "System backup initiated" (info)
 * 'save-settings'         → "Settings saved successfully" (success)
 * 'reset-system'          → "System reset is disabled in demo mode" (error)
 * 'clear-logs'            → "Log clearing requires admin confirmation" (error)
 * 'approve-apt'           → "Appointment approved" (success)
 * 'reject-apt'            → "Appointment rejected" (error)
 * 'view-patient'          → "Patient record opened" (info)
 * 'approve-permit'        → "Permit approved successfully" (success)
 * 'reject-permit'         → "Permit application rejected" (error)
 * 'add-patient'           → "Add patient form opened (demo)" (info)
 * 'edit-profile'          → "Profile editing is UI-only in demo" (info)
 * 'submit-appointment'    → "Appointment booked successfully!" (success)
 * 'submit-permit'         → "Permit application submitted!" (success)
 * 'submit-wastewater'     → "Service request submitted!" (success)
 * 
 * ─── NAVIGATION ACTIONS ───────────────────────────────────────────────
 * These change the current view/route
 * 
 * 'nav-logs'              → Navigate to logs page
 * 'nav-health-center'     → Switch to staff role + navigate to health-center
 * 'nav-sanitation'        → Switch to staff role + navigate to sanitation
 * 'nav-immunization'      → Switch to staff role + navigate to immunization
 * 'nav-wastewater'        → Switch to staff role + navigate to wastewater
 * 'new-appointment'       → User: navigate to book-appointment
 *                           Staff: switch role then show guidance toast
 * 'profile-view'          → User: navigate to profile
 *                           Admin: show info toast
 * 'profile-settings'      → Admin: navigate to settings
 *                           User: show info toast
 * 'view-all-activity'     → Admin: navigate to logs
 *                           User: show info toast
 * 
 * ─── DROPDOWN/UI ACTIONS ──────────────────────────────────────────────
 * 
 * 'close-modal'           → Close any open modal
 * 'mark-all-read'         → Mark all notifications as read + re-render panel
 * 'profile-logout'        → Show logout toast (demo mode)
 * 
 * ─── ROLE-BASED BEHAVIOR ──────────────────────────────────────────────
 * Some actions behave differently based on user role:
 * 
 * ACTION              ADMIN                   STAFF               USER
 * ─────────────────────────────────────────────────────────────────────
 * new-appointment     switch to staff         show guidance        navigate to book
 * profile-view        show toast              show toast           navigate to profile
 * profile-settings    navigate to settings    show toast           show toast
 * view-all-activity   navigate to logs        show toast           show toast
 */

// ============================================================================
// HOW IT CONNECTS TO YOUR RENDERERS (index.js)
// ============================================================================

/**
 * Your renderers create buttons with data-action attributes:
 * 
 * FROM renderUsers():
 *   <button data-action="edit-user" data-id="USR-001">Edit</button>
 *   <button data-action="delete-user" data-id="USR-001">Delete</button>
 *   <button data-action="add-user">+ Add User</button>
 * 
 * FROM renderHealthCenter():
 *   <button data-action="approve-apt">Approve</button>
 *   <button data-action="reject-apt">Reject</button>
 *   <button data-action="view-patient" data-id="P-101">View</button>
 * 
 * FROM renderSanitation():
 *   <button data-action="approve-permit">Approve</button>
 *   <button data-action="reject-permit">Reject</button>
 *   <button data-action="schedule-inspection">Schedule</button>
 * 
 * FROM renderImmunization():
 *   <button data-action="update-child">Update</button>
 *   <button data-action="add-child">+ Add Child Record</button>
 * 
 * FROM renderWastewater():
 *   <button data-action="view-checklist">Checklist</button>
 *   <button data-action="submit-checklist">Submit Checklist</button>
 * 
 * FROM renderSurveillance():
 *   <button data-action="report-case">Report Case</button>
 * 
 * FROM renderSettings():
 *   <button data-action="save-settings">Save Changes</button>
 *   <button data-action="reset-system">Reset System Data</button>
 *   <button data-action="clear-logs">Clear All Logs</button>
 */

// ============================================================================
// DEPENDENCY INJECTION PATTERN
// ============================================================================

/**
 * setCoreFunctions() uses a dependency injection pattern to avoid
 * circular imports between app.js and actions.js:
 * 
 * app.js creates the core functions → calls setCoreFunctions()
 * actions.js stores references → uses them when needed
 * 
 * This prevents:
 *   app.js → imports actions.js
 *   actions.js → imports app.js (CIRCULAR!)
 * 
 * Instead:
 *   app.js → imports actions.js + calls setCoreFunctions()
 *   actions.js → receives functions as parameters
 */

// ============================================================================
// MODAL CONTENT FUNCTIONS
// ============================================================================

/**
 * showAddUserModal()
 * - Full Name, Email, Role fields
 * - Cancel + Add User buttons
 * - Used by: users page "Add User" button
 */

/**
 * showEditUserModal(id)
 * - Pre-fills form with existing user data
 * - Full Name, Email, Role, Status fields
 * - Looks up user by ID from DATA.users
 * - Used by: users page edit buttons
 */

/**
 * showUpdateChildModal()
 * - Child Name, Vaccine selector, Date, Progress slider
 * - Cancel + Update Record buttons
 * - Used by: immunization page "Update" and "Add Child" buttons
 */

/**
 * showScheduleInspectionModal()
 * - Permit ID selector (shows only Pending permits)
 * - Inspector selector, Date/Time pickers
 * - Used by: sanitation page "Schedule Inspection" button
 */

/**
 * showChecklistModal()
 * - Pre-defined inspection checklist items
 * - Some items pre-checked (demo data)
 * - Cancel + Save Checklist buttons
 * - Used by: wastewater page "Checklist" button
 */

/**
 * showReportCaseModal()
 * - Disease name, Number of cases, Barangay, Severity
 * - Cancel + Submit Report buttons
 * - Used by: surveillance page "Report Case" button
 */

/**
 * showNotificationsModal()
 * - Shows mock notifications with type badges
 * - Close button only
 * - Used by: header notification bell icon
 */

// ============================================================================
// SUMMARY TABLE: WHICH ACTIONS ARE USED WHERE
// ============================================================================

/**
 * USERS PAGE               HEALTH CENTER            SANITATION
 * ─────────────            ─────────────            ──────────
 * add-user                 approve-apt              approve-permit
 * edit-user                reject-apt               reject-permit
 * delete-user              view-patient             schedule-inspection
 * confirm-add-user                                  confirm-schedule
 * confirm-edit-user
 * 
 * IMMUNIZATION             WASTEWATER               SURVEILLANCE
 * ────────────             ──────────               ────────────
 * update-child             view-checklist           report-case
 * add-child                submit-checklist         confirm-report-case
 * confirm-update-child
 * 
 * HEADER/NAV               SETTINGS                 MODALS
 * ──────────               ────────                 ──────
 * show-notifications       save-settings            close-modal
 * mark-all-read            reset-system
 * profile-view             clear-logs
 * profile-settings         system-backup
 * profile-logout
 * nav-health-center
 * nav-sanitation
 * nav-immunization
 * nav-wastewater
 * nav-logs
 * new-appointment
 * view-all-activity
 */

import { state } from './state.js';
import { DATA } from './data.js';
import { showToast } from './utils/toast.js';
import { closeModal } from './utils/modal.js';
import { showPatientDetail, showRegisterPatient } from './renderers/HealthServices/patients.js';
import { showConsultationDetail, showNewConsultation } from './renderers/HealthServices/consultations.js';
import { showRecordDetail } from './renderers/HealthServices/medicalRecords.js';
import { showApplicationDetail, showNewApplication } from './renderers/sanitationPermits/applications.js';
import { showInspectionDetail } from './renderers/sanitationPermits/inspections.js';
import { showPermitDetail } from './renderers/sanitationPermits/permitRecords.js';
import { showChildDetail, showRegisterChild } from './renderers/immunization/childRecords.js';
import { showRecordVaccination, showUpdateVaccine } from './renderers/immunization/vaccinationTracking.js';
import { showSepticDetail, showRegisterSeptic, showScheduleSeptic } from './renderers/wastewater/septicRegistry.js';
import { showCreateSchedule, showReschedule } from './renderers/wastewater/maintenanceSchedule.js';
import { showServiceRequestDetail, showNewServiceRequest } from './renderers/wastewater/serviceRequests.js';
import { showCaseDetail as showSurvCaseDetail, showReportCaseModal as showSurvReportModal } from './renderers/surveillance/caseReports.js';
import { showManageAlert } from './renderers/surveillance/outbreakDetection.js';

let navigateTo, switchRole, renderView, renderNotificationPanel, closeAllDropdowns;
export function setCoreFunctions(functions) {
  navigateTo = functions.navigateTo;
  switchRole = functions.switchRole;
  renderView = functions.renderView;
  renderNotificationPanel = functions.renderNotificationPanel;
  closeAllDropdowns = functions.closeAllDropdowns;
}

export function handleAction(action, target) {
  const actions = {
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
    'show-notifications': () => { closeAllDropdowns(); showNotificationsModal(); },
    'mark-all-read': () => { DATA.notifications.forEach(n => n.read = true); renderNotificationPanel(); showToast('All notifications marked as read', 'success'); },
    'profile-view': () => { closeAllDropdowns(); if (state.role === 'user') navigateTo('profile'); else showToast('Profile view opened', 'info'); },
    'profile-settings': () => { closeAllDropdowns(); if (state.role === 'admin') navigateTo('settings'); else showToast('Settings opened', 'info'); },
    'profile-logout': async () => {   closeAllDropdowns();try { const response = await fetch('api/auth/logout.php', { method: 'POST' });const data = await response.json();if (data.success) { window.location.href = 'index.php';}} catch (error) {showToast({ type: 'error', title: 'Error', message: 'Logout failed' });}},
    'view-all-activity': () => { if (state.role === 'admin') navigateTo('logs'); else showToast('Activity log opened', 'info'); },
    'new-appointment': () => { if (state.role === 'user') navigateTo('book-appointment'); else { switchRole('staff'); setTimeout(() => showToast('Navigate to Health Center to manage appointments', 'info'), 400); } },
    'add-patient': () => showToast('Add patient form opened (demo)', 'info'),
    'nav-health-center': () => { closeAllDropdowns(); if (state.role !== 'staff') switchRole('staff'); else navigateTo('health-center'); },
    'nav-sanitation': () => { closeAllDropdowns(); if (state.role !== 'staff') switchRole('staff'); else navigateTo('sanitation'); },
    'nav-immunization': () => { closeAllDropdowns(); if (state.role !== 'staff') switchRole('staff'); else navigateTo('immunization'); },
    'nav-wastewater': () => { closeAllDropdowns(); if (state.role !== 'staff') switchRole('staff'); else navigateTo('wastewater'); },
    'edit-profile': () => showToast('Profile editing is UI-only in demo', 'info'),
    'submit-appointment': () => showToast('Appointment booked successfully!', 'success'),
    'submit-permit': () => showToast('Permit application submitted!', 'success'),
    'submit-wastewater': () => showToast('Service request submitted!', 'success'),
    'register-patient': () => { import('./renderers/HealthServices/patients.js').then(m => m.showRegisterPatient()); },
'view-patient-detail': (target) => showPatientDetail(target.dataset.id),
'confirm-register-patient': () => { closeModal();  showToast({ type: 'success', title: 'Success', message: 'Patient registered successfully' }); },
'edit-patient': () => { closeModal(); showToast('Patient updated successfully', 'success'); },
'view-document': () => showToast('Document preview (demo)', 'info'),
'upload-document': () => showToast('Upload available in backend version', 'info'),
'new-consultation': () => showNewConsultation(),
'view-consultation': (target) => showConsultationDetail(target.dataset.id),
'confirm-consultation': () => { closeModal(); showToast('Consultation saved successfully', 'success'); },
'add-record': () => {import('./renderers/HealthServices/medicalRecords.js').then(m => m.showAddRecord());},
'confirm-add-record': () => { closeModal(); showToast({ type: 'success', title: 'Success', message: 'Medical record added' }); },
'view-record': (target) => showRecordDetail(target.dataset.id),
'download-record': () => showToast('Download started (demo)', 'success'),
'close-modal': () => closeModal(),
    'add-user': () => showAddUserModal(),
    'view-application': (target) => showApplicationDetail(target.dataset.id),
'approve-application': () => { closeModal(); showToast('Application approved', 'success'); },
'reject-application': () => { closeModal(); showToast('Application rejected', 'error'); },
'request-docs': () => showToast('Missing document request sent to applicant', 'warning'),
'forward-inspection': () => { closeModal(); showToast('Application forwarded to inspection team', 'success'); },
'new-application': () => showToast('New application form (demo)', 'info'),
'new-application': () => showNewApplication(),
'confirm-application': () => { closeModal(); showToast('Application submitted successfully', 'success'); },
'view-inspection': (target) => showInspectionDetail(target.dataset.id),
'pass-inspection': () => { closeModal(); showToast('Inspection marked as passed', 'success'); },
'fail-inspection': () => { closeModal(); showToast('Inspection marked as failed', 'error'); },
'record-violation': () => showToast('Violation recorded', 'warning'),
'upload-photo': () => showToast('Photo upload (demo)', 'info'),
'view-permit': (target) => showPermitDetail(target.dataset.id),
'download-permit': () => showToast('Certificate downloaded (demo)', 'success'),
'register-child': () => showRegisterChild(),
'view-child': (target) => showChildDetail(target.dataset.id),
'edit-child': () => { closeModal(); showToast('Child profile updated', 'success'); },
'confirm-register-child': () => { closeModal(); showToast('Child registered successfully', 'success'); },
'record-vaccination': () => showRecordVaccination(),
'update-vaccine': (target) => showUpdateVaccine(target.dataset.id),
'confirm-vaccination': () => { closeModal(); showToast('Vaccination recorded', 'success'); },
'confirm-update-vaccine': () => { closeModal(); showToast('Vaccine status updated', 'success'); },
'flag-vaccine': () => showToast('Overdue vaccine flagged for follow-up', 'warning'),
'register-septic': () => showRegisterSeptic(),
'view-septic': (target) => showSepticDetail(target.dataset.id),
'edit-septic': () => { closeModal(); showToast('Record updated', 'success'); },
'schedule-septic': (target) => showScheduleSeptic(target.dataset.id),
'confirm-register-septic': () => { closeModal(); showToast('Septic system registered', 'success'); },
'confirm-schedule-septic': () => { closeModal(); showToast('Maintenance scheduled', 'success'); },
'create-schedule': () => showCreateSchedule(),
'reschedule-maintenance': (target) => showReschedule(target.dataset.id),
'confirm-create-schedule': () => { closeModal(); showToast('Schedule created', 'success'); },
'confirm-reschedule': () => { closeModal(); showToast('Schedule updated', 'success'); },
'new-service-request': () => showNewServiceRequest(),
'view-service-request': (target) => showServiceRequestDetail(target.dataset.id),
'approve-service-request': () => { closeModal(); showToast('Request approved', 'success'); },
'reject-service-request': () => { closeModal(); showToast('Request rejected', 'error'); },
'complete-service-request': () => { closeModal(); showToast('Marked as completed', 'success'); },
'assign-schedule': () => showToast('Assign to schedule (demo)', 'info'),
'confirm-service-request': () => { closeModal(); showToast('Request submitted', 'success'); },
'report-case': () => showSurvReportModal(),
'view-case': (target) => showSurvCaseDetail(target.dataset.id),
'confirm-case': () => { closeModal(); showToast('Case confirmed', 'success'); },
'reject-case': () => { closeModal(); showToast('Case marked negative', 'error'); },
'update-case-status': () => { closeModal(); showToast('Status updated', 'success'); },
'manage-alert': (target) => showManageAlert(target.dataset.id),
'set-alert-normal': () => { closeModal(); showToast('Alert level set to Normal', 'success'); },
'set-alert-warning': () => { closeModal(); showToast('Alert escalated to Warning', 'warning'); },
'declare-outbreak': () => { closeModal(); showToast('⚠ Outbreak declared! Staff notified.', 'error'); },
'notify-staff': () => { closeModal(); showToast('Notification sent to all health center staff', 'info'); },
  };
  
 if (actions[action]) actions[action](target);
}

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