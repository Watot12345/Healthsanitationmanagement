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
'confirm-register-patient': async (target) => {
    console.log('=== REGISTER PATIENT CLICKED ===');
    
    try {
        // Collect all form data
        const formData = {
            full_name: document.getElementById('reg-fullname')?.value || '',
            birth_date: document.getElementById('reg-dob')?.value || '',
            gender: document.getElementById('reg-gender')?.value || '',
            blood_type: document.getElementById('reg-bloodtype')?.value || '',
            weight: parseFloat(document.getElementById('reg-weight')?.value) || null,
            height: parseFloat(document.getElementById('reg-height')?.value) || null,
            head_circumference: parseFloat(document.getElementById('reg-head-circ')?.value) || null,
            triage: document.getElementById('reg-triage')?.value || 'Low',
            condition: document.getElementById('reg-conditions')?.value || 'Stable',
            address: document.getElementById('reg-address')?.value || '',
            contact_number: document.getElementById('reg-contact')?.value || '',
            emergency_contact: document.getElementById('reg-emergency')?.value || '',
            emergency_phone: document.getElementById('reg-emergency-phone')?.value || '',
            measurement_date: document.getElementById('reg-measurement-date')?.value || null
        };
        
        console.log('📤 Form Data collected:', formData);
        
        // Validate required fields
        if (!formData.full_name || !formData.birth_date) {
            console.log('❌ Validation failed: Missing required fields');
            showToast({ 
                type: 'error', 
                title: 'Validation Error', 
                message: 'Please fill in all required fields (Name and Date of Birth)' 
            });
            return;
        }
        
        // Check if child and weight/height are provided
        const age = calculateAgeFromBirthDate(formData.birth_date);
        console.log('👶 Calculated age:', age);
        if (age !== null && age <= 5) {
            if (!formData.weight || !formData.height) {
                console.log('❌ Child validation failed: Weight/height missing');
                showToast({ 
                    type: 'error', 
                    title: 'Validation Error', 
                    message: 'Weight and height are required for children under 5 years' 
                });
                return;
            }
        }
        
        console.log('✅ Validation passed, sending to API...');
        
        // Show loading state
        const confirmBtn = document.querySelector('[data-action="confirm-register-patient"]');
        if (confirmBtn) {
            confirmBtn.disabled = true;
            confirmBtn.textContent = 'Saving...';
        }
        
        // Send to API
        const apiUrl = 'api/patients/create.php';
        console.log('🌐 API URL:', apiUrl);
        console.log('📦 JSON Payload:', JSON.stringify(formData, null, 2));
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        console.log('📥 Response status:', response.status);
        console.log('📥 Response status text:', response.statusText);
        
        // Get response text first (to see if it's valid JSON)
        const responseText = await response.text();
        console.log('📄 Raw response:', responseText);
        
        let result;
        try {
            result = JSON.parse(responseText);
            console.log('✅ Parsed result:', result);
        } catch (parseError) {
            console.error('❌ Failed to parse JSON:', parseError);
            console.error('Raw response was:', responseText);
            showToast({ 
                type: 'error', 
                title: 'Server Error', 
                message: 'Invalid response from server. Check console for details.' 
            });
            closeModal();
            return;
        }
        
        // Close modal
        closeModal();
        
                if (result.success) {
            console.log('✅ Patient registered successfully!');
            
            // ✅ Reload patients from API first
            try {
                console.log('🔄 Reloading patients data from API...');
                const patientsResponse = await fetch('api/patients/get.php');
                const patientsData = await patientsResponse.json();
                
                if (patientsData.success) {
                    DATA.patients = patientsData.patients;
                    console.log(`✅ Patients reloaded: ${DATA.patients.length} records`);
                }
            } catch (error) {
                console.error('Failed to reload patients:', error);
            }
            
            showToast({ 
                type: 'success', 
                title: 'Success', 
                message: `Patient "${formData.full_name}" registered successfully` 
            });
            
            // Close modal and refresh view
            closeModal();
            if (typeof renderView === 'function') {
                console.log('🔄 Refreshing view...');
                renderView();
            }
            
        } else {
            console.log('❌ Registration failed:', result.message || result.error);
            showToast({ 
                type: 'error', 
                title: 'Registration Failed', 
                message: result.message || result.error || 'Failed to register patient' 
            });
        }
    } catch (error) {
        console.error('❌ Fatal error in registration:', error);
        console.error('Error stack:', error.stack);
        closeModal();
        showToast({ 
            type: 'error', 
            title: 'Error', 
            message: 'Network error or server issue: ' + error.message 
        });
    } finally {
        // Reset button state
        const confirmBtn = document.querySelector('[data-action="confirm-register-patient"]');
        if (confirmBtn) {
            confirmBtn.disabled = false;
            confirmBtn.textContent = 'Register Patient';
        }
    }
},
'edit-patient': () => { closeModal(); showToast('Patient updated successfully', 'success'); },
'view-document': () => showToast('Document preview (demo)', 'info'),
'upload-document': (target) => {
    const patientId = target.dataset.patientId || target.dataset.id;
    
    if (!patientId) {
        showToast({ type: 'error', title: 'Error', message: 'Patient ID not found' });
        return;
    }
    
    // Create file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.jpg,.jpeg,.png,.gif,.webp';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);
    
    fileInput.onchange = async (e) => {
        const file = e.target.files[0];
        
        // Remove the input
        document.body.removeChild(fileInput);
        
        if (!file) {
            showToast({ type: 'warning', title: 'No File', message: 'Please select a file to upload' });
            return;
        }
        
        // Validate file size (10MB)
        if (file.size > 10 * 1024 * 1024) {
            showToast({ type: 'error', title: 'Error', message: 'File too large (max 10MB)' });
            return;
        }
        
        // Ask for document type
        const docType = prompt('Select document type:', 'Lab Result');
        if (!docType) return; // User cancelled
        
        // Validate document type
        const validTypes = ['Lab Result', 'Imaging', 'Prescription', 'Other'];
        const finalType = validTypes.includes(docType) ? docType : 'Other';
        
        // Create form data
        const formData = new FormData();
        formData.append('document', file);
        formData.append('patient_id', patientId);
        formData.append('document_type', finalType);
        
        // Show loading toast
        showToast({ type: 'info', title: 'Uploading', message: `Uploading ${file.name}...` });
        
        try {
            const response = await fetch('api/patients/uploadDocument.php', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                showToast({ 
                    type: 'success', 
                    title: 'Success', 
                    message: `${file.name} uploaded successfully` 
                });
                
                // Reload documents in the modal
                if (typeof window.loadDocumentsInModal === 'function') {
                    window.loadDocumentsInModal(patientId);
                }
            } else {
                showToast({ 
                    type: 'error', 
                    title: 'Upload Failed', 
                    message: data.message || 'Failed to upload document' 
                });
            }
        } catch (error) {
            console.error('Upload error:', error);
            showToast({ 
                type: 'error', 
                title: 'Error', 
                message: 'Network error. Please try again.' 
            });
        }
    };
    
    // Trigger file selection
    fileInput.click();
},
'delete-patient': (target) => {
    const patientId = target.dataset.id;
    const patientName = target.dataset.name;
    
    // Show confirmation modal
    openModal(
        'Confirm Delete Patient',
        `
        <div class="text-center py-4">
            <div class="flex justify-center mb-4">
                <div class="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <svg class="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                </div>
            </div>
            <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Delete Patient Record</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400 mb-1">Are you sure you want to permanently delete this patient?</p>
            <p class="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">"${patientName}"</p>
            <p class="text-sm font-mono text-slate-500 mb-4">${patientId}</p>
            <div class="bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2 mb-4">
                <p class="text-xs text-red-600 dark:text-red-400">
                    ⚠️ This action cannot be undone. All patient data, documents, and records will be permanently deleted.
                </p>
            </div>
        </div>
        `,
        `<button data-action="close-modal" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">
            Cancel
        </button>
        <button data-action="confirm-delete-patient" data-id="${patientId}" class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">
            Delete Permanently
        </button>`
    );
},
'confirm-delete-patient': async (target) => {
    const patientId = target.dataset.id;
    
    try {
        const response = await fetch('api/patients/delete.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ patient_id: patientId })
        });
        
        const data = await response.json();
        closeModal();
        
        if (data.success) {
            // Reload patients from API
            try {
                const patientsResponse = await fetch('api/patients/get.php');
                const patientsData = await patientsResponse.json();
                if (patientsData.success) {
                    DATA.patients = patientsData.patients;
                }
            } catch (e) {
                console.error('Failed to reload patients:', e);
            }
            
            showToast({ 
                type: 'success', 
                title: 'Deleted', 
                message: 'Patient record deleted successfully' 
            });
            
            renderView();
        } else {
            showToast({ 
                type: 'error', 
                title: 'Error', 
                message: data.message || 'Failed to delete patient' 
            });
        }
    } catch (error) {
        closeModal();
        showToast({ 
            type: 'error', 
            title: 'Error', 
            message: 'Failed to delete patient: ' + error.message 
        });
    }
},
'view-document': (target) => {  // ✅ KEEP THIS
    const docPath = target.dataset.path;
    if (docPath) {
        window.open(docPath, '_blank');
    } else {
        showToast({ type: 'info', title: 'Demo', message: 'Document preview not available' });
    }
},
'delete-document': (target) => {
    const docId = target.dataset.id;
    const patientId = target.dataset.patientId;
    const docName = target.dataset.name || 'this document';
    
    // Show confirmation modal
    openModal(
        'Confirm Delete Document',
        `
        <div class="text-center py-4">
            <div class="flex justify-center mb-4">
                <div class="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <svg class="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                </div>
            </div>
            <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Delete Document</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400 mb-1">Are you sure you want to delete this document?</p>
            <p class="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">"${docName}"</p>
            <p class="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
                ⚠️ This action cannot be undone. The file will be permanently deleted.
            </p>
        </div>
        `,
        `<button data-action="close-modal" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">
            Cancel
        </button>
        <button data-action="confirm-delete-document" data-id="${docId}" data-patient-id="${patientId}" class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">
            Delete Permanently
        </button>`
    );
},
'confirm-delete-document': async (target) => {
    const docId = target.dataset.id;
    const patientId = target.dataset.patientId;
    
    try {
        const response = await fetch('api/patients/deleteDocument.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ document_id: docId })
        });
        
        const data = await response.json();
        closeModal();
        
        if (data.success) {
            showToast({ type: 'success', title: 'Deleted', message: 'Document deleted successfully' });
            
            // Reload documents in the modal
            if (typeof window.loadDocumentsInModal === 'function') {
                setTimeout(() => window.loadDocumentsInModal(patientId), 300);
            }
        } else {
            showToast({ type: 'error', title: 'Error', message: data.message || 'Failed to delete document' });
        }
    } catch (error) {
        closeModal();
        showToast({ type: 'error', title: 'Error', message: 'Failed to delete document' });
    }
},
'confirm-consultation': async () => {
    const patientId = document.getElementById('consult-patient')?.value || '';
    const doctor = document.getElementById('consult-doctor')?.value || '';
    const date = document.getElementById('consult-date')?.value || '';
    const time = document.getElementById('consult-time')?.value || '';
    const diagnosis = document.getElementById('consult-diagnosis')?.value || '';
    const symptoms = document.getElementById('consult-symptoms')?.value || '';
    const notes = document.getElementById('consult-notes')?.value || '';
    const prescription = document.getElementById('consult-prescription')?.value || '';
    const followUp = document.getElementById('consult-followup')?.value || null;
    
    if (!patientId || !doctor) {
        showToast({ type: 'error', title: 'Validation', message: 'Patient and Doctor are required' });
        return;
    }
    
    const formData = {
        patient_id: patientId,
        doctor_name: doctor,
        consultation_date: date,
        consultation_time: time,
        diagnosis: diagnosis,
        symptoms: symptoms,
        notes: notes,
        prescription: prescription,
        follow_up_date: followUp
    };
    
    try {
        const response = await fetch('api/consultations/create.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        closeModal();
        
        if (data.success) {
            // Reload consultations
            const consultResponse = await fetch('api/consultations/get.php');
            const consultData = await consultResponse.json();
            if (consultData.success) {
                DATA.consultations = consultData.consultations;
            }
            
            showToast({ type: 'success', title: 'Success', message: 'Consultation saved' });
            renderView();
        } else {
            showToast({ type: 'error', title: 'Error', message: data.message });
        }
    } catch (error) {
        closeModal();
        showToast({ type: 'error', title: 'Error', message: 'Failed to save consultation' });
    }
},
'delete-consultation': (target) => {
    const id = target.dataset.id;
    openModal(
        'Confirm Delete',
        `
        <div class="text-center py-4">
            <p class="text-red-500 mb-2">⚠️ Are you sure you want to delete this consultation?</p>
            <p class="text-sm text-slate-500">This action cannot be undone.</p>
        </div>
        `,
        `<button data-action="close-modal" class="px-4 py-2 rounded-lg border">Cancel</button>
         <button data-action="confirm-delete-consultation" data-id="${id}" class="px-4 py-2 rounded-lg bg-red-600 text-white">Delete</button>`
    );
},
'confirm-delete-consultation': async (target) => {
    const id = target.dataset.id;
    
    try {
        const response = await fetch('api/consultations/delete.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ consultation_id: id })
        });
        
        const data = await response.json();
        closeModal();
        
        if (data.success) {
            const consultResponse = await fetch('api/consultations/get.php');
            const consultData = await consultResponse.json();
            if (consultData.success) {
                DATA.consultations = consultData.consultations;
            }
            
            showToast({ type: 'success', title: 'Deleted', message: 'Consultation deleted' });
            renderView();
        } else {
            showToast({ type: 'error', title: 'Error', message: data.message });
        }
    } catch (error) {
        closeModal();
        showToast({ type: 'error', title: 'Error', message: 'Delete failed' });
    }
},
'view-consultation': (target) => showConsultationDetail(target.dataset.id),
'add-record': () => {import('./renderers/HealthServices/medicalRecords.js').then(m => m.showAddRecord());},
'confirm-add-record': async () => {
    const patientId = document.getElementById('record-patient')?.value || '';
    const recordType = document.getElementById('record-type')?.value || 'Lab Result';
    const title = document.getElementById('record-title')?.value || '';
    const date = document.getElementById('record-date')?.value || '';
    const doctor = document.getElementById('record-doctor')?.value || '';
    const summary = document.getElementById('record-summary')?.value || '';
    
    if (!patientId || !title) {
        showToast({ type: 'error', title: 'Validation', message: 'Patient and Title are required' });
        return;
    }
    
    const formData = {
        patient_id: patientId,
        record_type: recordType,
        title: title,
        record_date: date,
        doctor_name: doctor,
        summary: summary
    };
    
    try {
        const response = await fetch('api/medicalRecords/create.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        closeModal();
        
        if (data.success) {
            // Reload records
            const recordsResponse = await fetch('api/medicalRecords/get.php');
            const recordsData = await recordsResponse.json();
            if (recordsData.success) {
                DATA.medicalRecords = recordsData.records;
            }
            
            showToast({ type: 'success', title: 'Success', message: 'Medical record added' });
            renderView();
        } else {
            showToast({ type: 'error', title: 'Error', message: data.message });
        }
    } catch (error) {
        closeModal();
        showToast({ type: 'error', title: 'Error', message: 'Failed to save record' });
    }
},
'delete-record': (target) => {
    const id = target.dataset.id;
    
    openModal(
        'Confirm Delete',
        `
        <div class="text-center py-4">
            <div class="flex justify-center mb-4">
                <div class="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <svg class="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                </div>
            </div>
            <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Delete Medical Record</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400 mb-1">Are you sure you want to delete this record?</p>
            <p class="text-sm font-mono text-slate-500 mb-4">${id}</p>
            <p class="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
                ⚠️ This action cannot be undone.
            </p>
        </div>
        `,
        `<button data-action="close-modal" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">
            Cancel
        </button>
        <button data-action="confirm-delete-record" data-id="${id}" class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">
            Delete Permanently
        </button>`
    );
},
'confirm-delete-record': async (target) => {
    const id = target.dataset.id;
    
    try {
        const response = await fetch('api/medicalRecords/delete.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ record_id: id })
        });
        
        const data = await response.json();
        closeModal();
        
        if (data.success) {
            const recordsResponse = await fetch('api/medicalRecords/get.php');
            const recordsData = await recordsResponse.json();
            if (recordsData.success) {
                DATA.medicalRecords = recordsData.records;
            }
            
            showToast({ type: 'success', title: 'Deleted', message: 'Medical record deleted' });
            renderView();
        } else {
            showToast({ type: 'error', title: 'Error', message: data.message });
        }
    } catch (error) {
        closeModal();
        showToast({ type: 'error', title: 'Error', message: 'Delete failed' });
    }
},
'confirm-application': async () => {
    const applicant = document.getElementById('app-applicant')?.value || '';
    const type = document.getElementById('app-type')?.value || '';
    const address = document.getElementById('app-address')?.value || '';
    const contactPerson = document.getElementById('app-contact-person')?.value || '';
    const contactNumber = document.getElementById('app-contact-number')?.value || '';
    
    if (!applicant) {
        showToast({ type: 'error', title: 'Validation', message: 'Applicant name is required' });
        return;
    }
    
    const formData = {
        applicant_name: applicant,
        business_type: type,
        address: address,
        contact_person: contactPerson,
        contact_number: contactNumber
    };
    
    try {
        const response = await fetch('api/applications/create.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        closeModal();
        
        if (data.success) {
            const appResponse = await fetch('api/applications/get.php');
            const appData = await appResponse.json();
            if (appData.success) {
                DATA.applications = appData.applications;
            }
            
            showToast({ type: 'success', title: 'Success', message: 'Application submitted' });
            renderView();
        } else {
            showToast({ type: 'error', title: 'Error', message: data.message });
        }
    } catch (error) {
        closeModal();
        showToast({ type: 'error', title: 'Error', message: 'Failed to submit application' });
    }
},

'delete-application': (target) => {
    const id = target.dataset.id;
    
    openModal(
        'Confirm Delete',
        `
        <div class="text-center py-4">
            <div class="flex justify-center mb-4">
                <div class="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <svg class="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                </div>
            </div>
            <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Delete Application</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">Are you sure you want to delete this application?</p>
            <p class="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
                ⚠️ This action cannot be undone.
            </p>
        </div>
        `,
        `<button data-action="close-modal" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600">Cancel</button>
         <button data-action="confirm-delete-application" data-id="${id}" class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">Delete</button>`
    );
},

'confirm-delete-application': async (target) => {
    const id = target.dataset.id;
    
    try {
        const response = await fetch('api/applications/delete.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ application_id: id })
        });
        
        const data = await response.json();
        closeModal();
        
        if (data.success) {
            const appResponse = await fetch('api/applications/get.php');
            const appData = await appResponse.json();
            if (appData.success) {
                DATA.applications = appData.applications;
            }
            
            showToast({ type: 'success', title: 'Deleted', message: 'Application deleted' });
            renderView();
        } else {
            showToast({ type: 'error', title: 'Error', message: data.message });
        }
    } catch (error) {
        closeModal();
        showToast({ type: 'error', title: 'Error', message: 'Delete failed' });
    }
},
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
            window.open(`api/reports/generate_ai_report.php?type=${type}`, '_blank');
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
'approve-application': async () => {
    const modalTitle = document.querySelector('#modal-title')?.textContent || '';
    const appId = modalTitle.match(/APP-\d+/)?.[0] || '';
    if (!appId) return;
    
    try {
        const response = await fetch('api/applications/update.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ application_id: appId, status: 'Approved' })
        });
        const data = await response.json();
        closeModal();
        if (data.success) {
            const appResponse = await fetch('api/applications/get.php');
            const appData = await appResponse.json();
            if (appData.success) DATA.applications = appData.applications;
            showToast({ type: 'success', title: 'Approved', message: 'Application approved' });
            renderView();
        }
    } catch (error) {
        closeModal();
        showToast({ type: 'error', title: 'Error', message: 'Update failed' });
    }
},
'reject-application': async () => {
    const modalTitle = document.querySelector('#modal-title')?.textContent || '';
    const appId = modalTitle.match(/APP-\d+/)?.[0] || '';
    if (!appId) return;
    
    try {
        const response = await fetch('api/applications/update.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ application_id: appId, status: 'Rejected' })
        });
        const data = await response.json();
        closeModal();
        if (data.success) {
            const appResponse = await fetch('api/applications/get.php');
            const appData = await appResponse.json();
            if (appData.success) DATA.applications = appData.applications;
            showToast({ type: 'warning', title: 'Rejected', message: 'Application rejected' });
            renderView();
        }
    } catch (error) {
        closeModal();
        showToast({ type: 'error', title: 'Error', message: 'Update failed' });
    }
},
'request-docs': () => showToast('Missing document request sent to applicant', 'warning'),
'forward-inspection': () => { closeModal(); showToast('Application forwarded to inspection team', 'success'); },
'new-application': () => {
    import('./renderers/sanitationPermits/applications.js')
        .then(m => {
            console.log('Module loaded:', m);
            m.showNewApplication();
        })
        .catch(err => console.error('Import failed:', err));
},
'confirm-application': async () => {
    const applicant = document.getElementById('app-applicant')?.value || '';
    const type = document.getElementById('app-type')?.value || '';
    const address = document.getElementById('app-address')?.value || '';
    const contactPerson = document.getElementById('app-contact-person')?.value || '';
    const contactNumber = document.getElementById('app-contact-number')?.value || '';
    
    if (!applicant) {
        showToast({ type: 'error', title: 'Validation', message: 'Applicant name is required' });
        return;
    }
    
    const submitBtn = document.querySelector('[data-action="confirm-application"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
    }
    
    try {
        // Step 1: Create application first
        const response = await fetch('api/applications/create.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                applicant_name: applicant,
                business_type: type,
                address: address,
                contact_person: contactPerson,
                contact_number: contactNumber
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            const appId = data.application_id; // e.g., APP-005
            
            // Step 2: Upload pending files with correct ID
            const pendingFiles = window._pendingAppFiles || [];
            for (const file of pendingFiles) {
                const formData = new FormData();
                formData.append('document', file);
                formData.append('application_id', appId);
                formData.append('document_type', file.docType || 'Other');
                
                await fetch('api/applications/uploadDocument.php', {
                    method: 'POST',
                    body: formData
                });
            }
            
            // Clear pending files
            window._pendingAppFiles = [];
            
            closeModal();
            
            // Reload
            const appResponse = await fetch('api/applications/get.php');
            const appData = await appResponse.json();
            if (appData.success) DATA.applications = appData.applications;
            
            showToast({ type: 'success', title: 'Success', message: 'Application submitted with ' + pendingFiles.length + ' files' });
            renderView();
        } else {
            showToast({ type: 'error', title: 'Error', message: data.message });
        }
    } catch (error) {
        showToast({ type: 'error', title: 'Error', message: 'Failed to submit' });
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Application';
        }
    }
},
'upload-application-docs': (target) => {
    if (!window._pendingAppFiles) window._pendingAppFiles = [];
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.jpg,.jpeg,.png';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);
    
    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        document.body.removeChild(fileInput);
        
        if (!file) return;
        
        if (file.size > 5 * 1024 * 1024) {
            showToast({ type: 'error', title: 'Error', message: 'File too large (max 5MB)' });
            return;
        }
        
        const docType = prompt('Document type:', 'Business Registration');
        if (!docType) return;
        
        // Store file temporarily (don't upload yet!)
        file.docType = docType;
        window._pendingAppFiles.push(file);
        
        const container = document.getElementById('app-uploaded-files');
        if (container) {
            const fileEl = document.createElement('div');
            fileEl.className = 'flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-xs';
            fileEl.innerHTML = `
                <span class="text-yellow-700">⏳ ${file.name} (${docType}) - Will upload on submit</span>
                <span class="text-slate-400">${(file.size / 1024).toFixed(1)} KB</span>
            `;
            container.appendChild(fileEl);
        }
    };
    
    fileInput.click();
},
'delete-app-document': (target) => {
    const docId = target.dataset.id;
    const appId = target.dataset.appId;
    
    openModal(
        'Confirm Delete Document',
        `
        <div class="text-center py-4">
            <div class="flex justify-center mb-4">
                <div class="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <svg class="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                </div>
            </div>
            <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Delete Document</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">Are you sure you want to delete this document?</p>
            <p class="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
                ⚠️ This action cannot be undone.
            </p>
        </div>
        `,
        `<button data-action="close-modal" class="px-4 py-2 rounded-lg border">Cancel</button>
         <button data-action="confirm-delete-app-document" data-id="${docId}" data-app-id="${appId}" class="px-4 py-2 rounded-lg bg-red-600 text-white">Delete</button>`
    );
},
'confirm-delete-app-document': async (target) => {
    const docId = target.dataset.id;
    const appId = target.dataset.appId;
    
    try {
        const response = await fetch('api/applications/deleteDocument.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ document_id: docId })
        });
        
        const data = await response.json();
        closeModal();
        
        if (data.success) {
            showToast({ type: 'success', title: 'Deleted', message: 'Document deleted' });
            // Reload documents
            if (typeof loadApplicationDocuments === 'function') {
                setTimeout(() => loadApplicationDocuments(appId), 300);
            }
        } else {
            showToast({ type: 'error', title: 'Error', message: data.message });
        }
    } catch (error) {
        closeModal();
        showToast({ type: 'error', title: 'Error', message: 'Delete failed' });
    }
},
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

// Helper function to calculate age from birth date
function calculateAgeFromBirthDate(birthDate) {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
        age--;
    }
    return age;
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
