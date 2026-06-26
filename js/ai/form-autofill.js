/**
 * ============================================================================
 * AI FORM AUTOFILL MODULE (ai/form-autofill.js)
 * ============================================================================
 * 
 * PURPOSE:
 * Provides AI-powered form auto-filling functionality that integrates with
 * the backend AI API to suggest form field values based on user input text.
 * 
 * FEATURES:
 * - Intelligent field suggestion for various form types
 * - Integration with backend AI API
 * - Real-time feedback for users
 * - Support for multiple form types (appointments, permits, surveillance, etc.)
 */

/**
 * Initialize AI Form Auto-fill functionality
 * Scans the DOM for auto-fill buttons and attaches event handlers
 */
export function initAiFormAutoFill() {
    const buttons = document.querySelectorAll('[data-ai-autofill]');
    if (!buttons.length) return;

    buttons.forEach((button) => {
        // Prevent duplicate initialization
        if (button.dataset.aiAutofillInitialized === 'true') return;
        button.dataset.aiAutofillInitialized = 'true';

        button.onclick = async () => {
            const type = button.dataset.aiAutofill;
            
            // Define field mappings for different form types
            const noteFieldIds = {
                appointment: ['ai-autofill-notes-appointment'],
                permit: ['ai-autofill-notes-permit'],
                surveillance: ['ai-autofill-notes-surveillance', 'ai-autofill-notes-surveillance-modal'],
                sanitation: ['ai-autofill-notes-sanitation', 'ai-autofill-notes-sanitation-modal'],
                alert: ['ai-autofill-notes-surveillance', 'ai-autofill-notes-surveillance-modal'],
                violation: ['ai-autofill-notes-sanitation', 'ai-autofill-notes-sanitation-modal'],
                'admin-user': ['ai-autofill-notes-admin-user'],
                'admin-violation': ['ai-autofill-notes-admin-violation']
            };

            const feedbackIds = {
                appointment: ['ai-autofill-feedback-appointment'],
                permit: ['ai-autofill-feedback-permit'],
                surveillance: ['ai-autofill-feedback-surveillance', 'ai-autofill-feedback-surveillance-modal'],
                sanitation: ['ai-autofill-feedback-sanitation', 'ai-autofill-feedback-sanitation-modal'],
                alert: ['ai-autofill-feedback-surveillance', 'ai-autofill-feedback-surveillance-modal'],
                violation: ['ai-autofill-feedback-sanitation', 'ai-autofill-feedback-sanitation-modal'],
                'admin-user': ['ai-autofill-feedback-admin-user'],
                'admin-violation': ['ai-autofill-feedback-admin-violation']
            };

            // Get the appropriate note and feedback elements
            const notesField = button.dataset.notesId 
                ? document.getElementById(button.dataset.notesId) 
                : (noteFieldIds[type] || []).map((id) => document.getElementById(id)).find(Boolean);
            
            const feedback = button.dataset.feedbackId 
                ? document.getElementById(button.dataset.feedbackId) 
                : (feedbackIds[type] || []).map((id) => document.getElementById(id)).find(Boolean);

            const notes = notesField?.value?.trim() || '';

            // Validate input
            if (!notes) {
                if (feedback) feedback.textContent = 'Please enter a note first.';
                return;
            }

            // Show loading state
            if (feedback) feedback.textContent = 'Loading suggestions...';

            try {
                // Call the backend AI API
                const response = await fetch('api/ai/form-autofill.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type, notes }),
                    cache: 'no-store'
                });

                const data = await response.json();
                if (!data || data.status !== 'success') {
                    throw new Error(data?.message || 'Auto-fill failed');
                }

                const suggestions = Array.isArray(data.suggestions) ? data.suggestions : [];
                const map = Object.fromEntries(suggestions.map((item) => [item.field, item.value]));

                // Apply suggestions based on form type
                await applyFormSuggestions(type, map, feedback);

            } catch (e) {
                console.error('AI Auto-fill error:', e);
                if (feedback) feedback.textContent = e.message || 'Auto-fill is unavailable right now.';
            }
        };
    });
}

/**
 * Apply AI suggestions to form fields based on form type
 * @param {string} type - The form type (appointment, permit, etc.)
 * @param {Object} map - Key-value mapping of field suggestions
 * @param {HTMLElement} feedback - Feedback element for user messages
 */
async function applyFormSuggestions(type, map, feedback) {
    switch (type) {
        case 'appointment':
            await applyAppointmentSuggestions(map, feedback);
            break;
        case 'permit':
            await applyPermitSuggestions(map, feedback);
            break;
        case 'surveillance':
        case 'alert':
            await applySurveillanceSuggestions(map, feedback);
            break;
        case 'sanitation':
        case 'violation':
            await applySanitationSuggestions(map, feedback);
            break;
        case 'admin-user':
            await applyAdminUserSuggestions(map, feedback);
            break;
        case 'admin-violation':
            await applyAdminViolationSuggestions(map, feedback);
            break;
        default:
            if (feedback) feedback.textContent = 'Form type not supported.';
    }
}

/**
 * Apply suggestions for appointment forms
 */
async function applyAppointmentSuggestions(map, feedback) {
    const serviceSelect = document.getElementById('appointment-service-type');
    const dateInput = document.getElementById('appointment-date');
    const timeSelect = document.getElementById('appointment-time');
    const reasonTextarea = document.getElementById('appointment-reason');

    if (serviceSelect && map.service_type) serviceSelect.value = map.service_type;
    if (reasonTextarea && map.reason) reasonTextarea.value = map.reason;
    
    if (dateInput) {
        const today = new Date();
        today.setDate(today.getDate() + 1);
        dateInput.value = today.toISOString().split('T')[0];
    }
    
    if (timeSelect && map.priority_hint === 'High') timeSelect.value = '09:00 AM';
    
    if (feedback) feedback.textContent = 'Appointment fields were suggested from your note and recent records.';
}

/**
 * Apply suggestions for permit forms
 */
async function applyPermitSuggestions(map, feedback) {
    const nameInput = document.getElementById('permit-business-name');
    const typeSelect = document.getElementById('permit-type');
    const addressInput = document.getElementById('permit-address');

    if (nameInput && map.business_name) nameInput.value = map.business_name;
    if (typeSelect && map.permit_type) typeSelect.value = map.permit_type;
    if (addressInput && map.address) addressInput.value = map.address;
    
    if (feedback) feedback.textContent = 'Permit fields were suggested from your note and recent records.';
}

/**
 * Apply suggestions for surveillance forms
 */
async function applySurveillanceSuggestions(map, feedback) {
    const diseaseInput = document.getElementById('case-disease');
    const caseInput = document.getElementById('case-count');
    const barangayInput = document.getElementById('case-barangay');
    const severitySelect = document.getElementById('case-severity');

    if (diseaseInput && map.disease) diseaseInput.value = map.disease;
    if (caseInput && map.cases) caseInput.value = map.cases;
    if (barangayInput && map.barangay) barangayInput.value = map.barangay;
    if (severitySelect && map.severity) severitySelect.value = map.severity;

    const summary = Object.entries(map).map(([field, value]) => {
        const displayValue = Array.isArray(value) ? value.join(', ') : value;
        return `${field}: ${displayValue}`;
    }).join(' • ');
    
    if (feedback) feedback.textContent = summary || 'Surveillance suggestions are ready.';
}

/**
 * Apply suggestions for sanitation forms
 */
async function applySanitationSuggestions(map, feedback) {
    const permitSelect = document.getElementById('inspection-permit-id');
    const inspectorSelect = document.getElementById('inspection-inspector');
    const dateInput = document.getElementById('inspection-date');
    const timeInput = document.getElementById('inspection-time');

    if (inspectorSelect && map.recommended_inspector) {
        const matched = Array.from(inspectorSelect.options).some(
            (option) => option.value === map.recommended_inspector || option.textContent === map.recommended_inspector
        );
        if (matched) inspectorSelect.value = map.recommended_inspector;
    }
    
    if (dateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.value = tomorrow.toISOString().split('T')[0];
    }
    
    if (timeInput && map.inspection_time) timeInput.value = map.inspection_time;
    if (permitSelect && map.permit_id) permitSelect.value = map.permit_id;

    const summary = Object.entries(map).map(([field, value]) => {
        const displayValue = Array.isArray(value) ? value.join(', ') : value;
        return `${field}: ${displayValue}`;
    }).join(' • ');
    
    if (feedback) feedback.textContent = summary || 'Sanitation suggestions are ready.';
}

/**
 * Apply suggestions for admin user forms
 */
async function applyAdminUserSuggestions(map, feedback) {
    const nameInput = document.getElementById('admin-user-name');
    const emailInput = document.getElementById('admin-user-email');
    const roleSelect = document.getElementById('admin-user-role');

    if (nameInput && (map.full_name || map.name)) nameInput.value = map.full_name || map.name;
    if (emailInput && map.email) emailInput.value = map.email;
    if (roleSelect && (map.role || map.user_role)) roleSelect.value = map.role || map.user_role;

    if (feedback) feedback.textContent = 'User account fields were suggested from your note.';
}

/**
 * Apply suggestions for admin violation forms
 */
async function applyAdminViolationSuggestions(map, feedback) {
    const titleInput = document.getElementById('admin-violation-title');
    const severitySelect = document.getElementById('admin-violation-severity');
    const actionInput = document.getElementById('admin-violation-action');

    if (titleInput && (map.title || map.violation_type)) {
        titleInput.value = map.title || map.violation_type;
    }
    if (severitySelect && (map.severity || map.risk_level)) {
        severitySelect.value = map.severity || map.risk_level;
    }
    if (actionInput && (map.action || map.suggested_action)) {
        actionInput.value = map.action || map.suggested_action;
    }

    if (feedback) feedback.textContent = 'Violation handling fields were suggested from your note.';
}

/**
 * Utility function to safely set select field values
 * @param {HTMLSelectElement} select - The select element
 * @param {string} value - The value to set
 * @returns {boolean} - Whether the value was successfully set
 */
function setSelectValue(select, value) {
    if (!select || !value) return false;
    
    const option = Array.from(select.options).find(
        opt => opt.value === value || opt.textContent.trim() === value
    );
    
    if (option) {
        select.value = option.value;
        return true;
    }
    return false;
}

/**
 * Utility function to format date for input fields
 * @param {Date} date - The date to format
 * @returns {string} - Formatted date string (YYYY-MM-DD)
 */
function formatDateForInput(date) {
    return date.toISOString().split('T')[0];
}

// Export the main function
export default initAiFormAutoFill;
