import { state } from './state.js';
import { DATA } from './data.js';
import { showToast } from './utils/toast.js';
import { openModal, closeModal } from './utils/modal.js';
import { btnPrimary, btnSecondary } from './utils/dom.js';
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
   'confirm-add-user': async () => {
    try {
        const name = document.querySelector('#modal-body input[type="text"]').value;
        const email = document.querySelector('#modal-body input[type="email"]').value;
        const role = document.querySelector('#modal-body select').value;
        
        const response = await fetch('api/admin/addUser.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, role, password: 'Default123!' })
        });
        
        const data = await response.json();
        closeModal();
        
        if (data.success) {
            const usersResponse = await fetch('api/admin/getUsers.php');
            const usersData = await usersResponse.json();
            DATA.users = usersData;
            await new Promise(r => setTimeout(r, 100)); // Small delay
            renderView();
        }
        
        showToast({ type: data.success ? 'success' : 'error', title: data.success ? 'Success' : 'Error', message: data.message });
    } catch (error) {
        closeModal();
        showToast({ type: 'error', title: 'Error', message: 'Failed to connect to server' });
    }
},
'delete-user': (target) => {
    const id = target.dataset.id;
    const user = DATA.users.find(u => u.id == id);
    openModal(
        'Confirm Delete',
        `
            <div class="text-center py-4">
                <svg class="h-12 w-12 mx-auto text-red-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"/></svg>
                <p class="font-semibold text-lg">Delete User</p>
                <p class="text-sm text-slate-500 mt-2">Are you sure you want to delete <b>${user?.name || 'this user'}</b>?</p>
                <p class="text-xs text-red-500 mt-2">⚠ This action cannot be undone.</p>
            </div>
        `,
        `<button data-action="close-modal" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600">Cancel</button>
         <button data-action="confirm-delete-user" data-id="${id}" class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">Delete User</button>`
    );
},
'confirm-delete-user': async (target) => {
    const id = target.dataset.id;
    const response = await fetch('api/admin/deleteUser.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    });
    const data = await response.json();
    closeModal();
    
    if (data.success) {
        // Reload users from API
        const usersResponse = await fetch('api/admin/getUsers.php');
        const usersData = await usersResponse.json();
        DATA.users = usersData;
    }
    
    showToast({ type: data.success ? 'success' : 'error', title: data.success ? 'Deleted' : 'Error', message: data.message });
    if (data.success) renderView();
},
    'edit-user': () => showEditUserModal(Number(target.dataset.id)),
    'confirm-edit-user': async () => {
    try {
        const id = window._editingUserId;
        if (!id) return;
        
        const name = document.getElementById('edit-user-name').value;
const email = document.getElementById('edit-user-email').value;
const role = document.getElementById('edit-user-role').value;
const status = document.getElementById('edit-user-status').value;
        
        const response = await fetch('api/admin/updateUser.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, name, email, role, status })
        });
        
        const data = await response.json();
        closeModal();
        window._editingUserId = null;
        
        if (data.success) {
            const usersResponse = await fetch('api/admin/getUsers.php');
            DATA.users = await usersResponse.json();
            renderView();
        }
        
        showToast({ type: data.success ? 'success' : 'error', title: data.success ? 'Updated' : 'Error', message: data.message });
    } catch (error) {
        closeModal();
        showToast({ type: 'error', title: 'Error', message: 'Failed to update user' });
    }
},
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
'download-report': (target) => {
    const type = target.dataset.type;
    const format = target.dataset.format;
    
    if (type === 'ai-executive') {
        // Show generating modal
        openModal(
            'Generating AI Report',
            `
                <div class="text-center py-6">
                    <div class="flex justify-center mb-4">
                        <svg class="animate-spin h-12 w-12 text-gov-600" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                    </div>
                    <p class="font-semibold text-lg">AI is generating your report...</p>
                    <p class="text-sm text-slate-500 mt-2">Analyzing system data and preparing executive summary</p>
                    <div class="mt-4 h-1 bg-slate-200 rounded-full overflow-hidden">
                        <div class="h-full bg-gov-600 animate-pulse rounded-full" style="width:100%"></div>
                    </div>
                </div>
            `,
            ''
        );
        
        // Download after short delay
        setTimeout(() => {
            closeModal();
            window.open(`api/reports/generate_pdf.php?type=${type}`, '_blank');
            showToast({ type: 'success', title: 'Downloaded', message: 'AI report generated successfully' });
        }, 3000);
        return;
    }
    
    // Regular reports
    const url = format === 'pdf' 
        ? `api/reports/generate_pdf.php?type=${type}`
        : `api/reports/generate.php?type=${type}&format=csv`;
    showToast({ type: 'success', title: 'Downloading', message: 'Your report is being generated...' });
    setTimeout(() => {
        window.open(url, '_blank');
        setTimeout(() => {
            showToast({ type: 'success', title: 'Downloaded', message: 'Report downloaded successfully' });
        }, 1500);
    }, 500);
},
'resolve-violation': async (target) => {
    const id = target.dataset.id;
    const response = await fetch('api/admin/updateViolations.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'Resolved' })
    });
    const data = await response.json();
    closeModal();
    showToast({ type: 'success', title: 'Resolved', message: data.message });
    renderView();
},

'escalate-violation': async (target) => {
    const id = target.dataset.id;
    const response = await fetch('api/admin/updateViolations.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'Escalated' })
    });
    const data = await response.json();
    closeModal();
    showToast({ type: 'warning', title: 'Escalated', message: data.message });
    renderView();
},
'view-violation': (target) => {
    showViolationDetailModal(target.dataset.id);
},
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
  openModal(
    'Add New User',
    `
      <form class="space-y-4" onsubmit="return false">
        <div><label class="block text-sm font-medium mb-1">Full Name</label>
          <input id="admin-user-name" type="text" placeholder="Enter full name" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"></div>
        <div><label class="block text-sm font-medium mb-1">Email</label>
          <input id="admin-user-email" type="email" placeholder="email@municipal.gov" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"></div>
        <div><label class="block text-sm font-medium mb-1">Role</label>
          <select id="admin-user-role" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
            <option value="Admin">Admin</option><option value="Staff">Staff</option><option value="User">User</option>
          </select></div>
      </form>
    `,
    `<button data-action="close-modal" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600">Cancel</button>
     <button data-action="confirm-add-user" class="px-4 py-2 rounded-lg bg-gov-600 text-white hover:bg-gov-700">Add User</button>`
  );
}
function showEditUserModal(id) {
  window._editingUserId = id;
  const user = DATA.users.find(u => u.id == id);
  if (!user) return;
  openModal('Edit User', `
    <form class="space-y-4" onsubmit="return false">
      <div><label class="block text-sm font-medium mb-1">Full Name</label>
        <input type="text" id="edit-user-name" value="${user.name}" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none"></div>
      <div><label class="block text-sm font-medium mb-1">Email</label>
        <input type="email" id="edit-user-email" value="${user.email}" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none"></div>
      <div><label class="block text-sm font-medium mb-1">Role</label>
        <select id="edit-user-role" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none">
          <option ${(user.role||'').toLowerCase()==='admin'?'selected':''}>Admin</option>
          <option ${(user.role||'').toLowerCase()==='staff'?'selected':''}>Staff</option>
          <option ${(user.role||'').toLowerCase()==='user'?'selected':''}>User</option>
        </select></div>
      <div><label class="block text-sm font-medium mb-1">Status</label>
        <select id="edit-user-status" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none">
          <option ${user.status==='Active'?'selected':''}>Active</option>
          <option ${user.status==='Inactive'?'selected':''}>Inactive</option>
        </select></div>
    </form>`,
    `${btnSecondary('Cancel', 'close-modal')} ${btnPrimary('Save Changes', 'confirm-edit-user')}`
  );
}

function showViolationDetailModal(id) {
  const violation = DATA.violations?.find(v => String(v.id) === String(id)) || null;
  openModal('Manage Violation', `
    <form class="space-y-4" onsubmit="return false">
      <div><label class="block text-sm font-medium mb-1">Violation</label>
        <input id="admin-violation-title" type="text" value="${violation?.violation || 'Sanitation Violation'}" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"></div>
      <div><label class="block text-sm font-medium mb-1">Severity</label>
        <select id="admin-violation-severity" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
          <option value="Low">Low</option><option value="Moderate">Moderate</option><option value="High">High</option><option value="Critical">Critical</option>
        </select></div>
      <div><label class="block text-sm font-medium mb-1">Recommended Action</label>
        <textarea id="admin-violation-action" rows="2" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">Inspect facility, document findings, and assign follow-up</textarea></div>
    </form>`,
    `${btnSecondary('Cancel', 'close-modal')} ${btnPrimary('Save', 'resolve-violation')}`
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
        <select id="inspection-permit-id" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none">
          ${DATA.permits.filter(p=>p.status==='Pending').map(p=>`<option value="${p.id}">${p.id} - ${p.applicant}</option>`).join('')}
        </select></div>
      <div><label class="block text-sm font-medium mb-1">Inspector</label>
        <select id="inspection-inspector" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none">
          <option value="Juan Dela Cruz">Juan Dela Cruz</option><option value="Ana Reyes">Ana Reyes</option>
        </select></div>
      <div class="grid grid-cols-2 gap-4">
        <div><label class="block text-sm font-medium mb-1">Date</label>
          <input id="inspection-date" type="date" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none"></div>
        <div><label class="block text-sm font-medium mb-1">Time</label>
          <input id="inspection-time" type="time" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none"></div>
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
        <input id="case-disease" type="text" placeholder="e.g. Dengue Fever" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none"></div>
      <div><label class="block text-sm font-medium mb-1">Number of Cases</label>
        <input id="case-count" type="number" min="1" value="1" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none"></div>
      <div><label class="block text-sm font-medium mb-1">Barangay</label>
        <input id="case-barangay" type="text" placeholder="Barangay name" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none"></div>
      <div><label class="block text-sm font-medium mb-1">Severity</label>
        <select id="case-severity" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none">
          <option value="Low">Low</option><option value="Moderate" selected>Moderate</option><option value="High">High</option>
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
