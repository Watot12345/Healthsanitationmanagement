import { card, icon, renderList, badge, filterData, searchInput, btnPrimary, tableWrap, emptyState, btnSecondary } from '../../utils/dom.js';
import { openModal, closeModal } from '../../utils/modal.js';
import { DATA } from '../../data.js';
import { getSearchValue } from '../../utils/search.js';



// ─── Field Validation Helpers ─────────────────────────────────────────────────
function setFieldError(id, message) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.borderColor = '#f87171';
  el.style.boxShadow = '0 0 0 2px rgba(248,113,113,0.2)';
  const prev = el.parentElement.querySelector('.field-error');
  if (prev) prev.remove();
  if (message) {
    const err = document.createElement('p');
    err.className = 'field-error';
    err.style.cssText = 'color:#dc2626;font-size:11.5px;margin-top:3px;';
    err.textContent = message;
    el.parentElement.appendChild(err);
  }
}

function clearFieldError(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.borderColor = '';
  el.style.boxShadow = '';
  const prev = el.parentElement.querySelector('.field-error');
  if (prev) prev.remove();
}

function clearAllErrors() {
  document.querySelectorAll('.field-error').forEach(e => e.remove());
  document.querySelectorAll('.gsms-toast').forEach(t => t.remove());
  ['reg-fullname','reg-dob','reg-weight','reg-height','reg-head-circ',
   'reg-contact','reg-emergency','reg-emergency-phone','reg-address',
   'reg-gender','reg-bloodtype','reg-triage'].forEach(clearFieldError);
}

// ─── Frontend Validation ──────────────────────────────────────────────────────
function validateForm() {
  clearAllErrors();
  const errors = [];
  const fullName    = document.getElementById('reg-fullname')?.value.trim() || '';
  const dob         = document.getElementById('reg-dob')?.value || '';
  const weight      = document.getElementById('reg-weight')?.value || '';
  const height      = document.getElementById('reg-height')?.value || '';
  const headCirc    = document.getElementById('reg-head-circ')?.value || '';
  const contact     = document.getElementById('reg-contact')?.value.trim() || '';
  const emergency   = document.getElementById('reg-emergency')?.value.trim() || '';
  const emergPhone  = document.getElementById('reg-emergency-phone')?.value.trim() || '';
  const triage      = document.getElementById('reg-triage')?.value || '';

  if (!fullName) {
    setFieldError('reg-fullname', 'Full name is required.');
    errors.push('Full name is required.');
  } else if (!/^[\p{L}\s\-\.']+$/u.test(fullName)) {
    setFieldError('reg-fullname', 'Letters only — no numbers or special characters.');
    errors.push('Full name must contain letters only.');
  } else if (fullName.length > 100) {
    setFieldError('reg-fullname', 'Must not exceed 100 characters.');
    errors.push('Full name too long.');
  }

  if (!dob) {
    setFieldError('reg-dob', 'Date of birth is required.');
    errors.push('Date of birth is required.');
  } else if (new Date(dob) > new Date()) {
    setFieldError('reg-dob', 'Cannot be in the future.');
    errors.push('Birth date cannot be in the future.');
  }

  if (weight !== '') {
    if (isNaN(weight) || Number(weight) <= 0) {
      setFieldError('reg-weight', 'Enter a valid weight (numbers only).');
      errors.push('Weight must be a positive number.');
    } else if (Number(weight) > 500) {
      setFieldError('reg-weight', 'Must be 500 kg or less.');
      errors.push('Weight exceeds maximum.');
    }
  }

  if (height !== '') {
    if (isNaN(height) || Number(height) <= 0) {
      setFieldError('reg-height', 'Enter a valid height (numbers only).');
      errors.push('Height must be a positive number.');
    } else if (Number(height) > 300) {
      setFieldError('reg-height', 'Must be 300 cm or less.');
      errors.push('Height exceeds maximum.');
    }
  }

  if (headCirc !== '') {
    if (isNaN(headCirc) || Number(headCirc) <= 0) {
      setFieldError('reg-head-circ', 'Enter a valid measurement (numbers only).');
      errors.push('Head circumference must be a positive number.');
    } else if (Number(headCirc) > 100) {
      setFieldError('reg-head-circ', 'Must be 100 cm or less.');
      errors.push('Head circumference exceeds maximum.');
    }
  }

  if (dob) {
    const birth = new Date(dob);
    const now   = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
    if (age <= 5) {
      if (!weight) {
        setFieldError('reg-weight', 'Required for children (growth tracking).');
        errors.push('Weight is required for child patients.');
      }
      if (!height) {
        setFieldError('reg-height', 'Required for children (growth tracking).');
        errors.push('Height is required for child patients.');
      }
    }
  }

  if (contact && !/^[\d\+\-\(\)\s]+$/.test(contact)) {
    setFieldError('reg-contact', 'Numbers only — ( ) + - and spaces allowed.');
    errors.push('Contact number must contain numbers only.');
  } else if (contact.length > 20) {
    setFieldError('reg-contact', 'Must not exceed 20 characters.');
    errors.push('Contact number too long.');
  }

  if (emergency && !/^[\p{L}\s\-\.']+$/u.test(emergency)) {
    setFieldError('reg-emergency', 'Letters only — no numbers or special characters.');
    errors.push('Emergency contact name must contain letters only.');
  }

  if (emergPhone && !/^[\d\+\-\(\)\s]+$/.test(emergPhone)) {
    setFieldError('reg-emergency-phone', 'Numbers only — ( ) + - and spaces allowed.');
    errors.push('Emergency phone must contain numbers only.');
  }

  if (!triage) {
    setFieldError('reg-triage', 'Please select a triage level.');
    errors.push('Triage level is required.');
  }

  return errors;
}

// ─── Attach Live Validation ───────────────────────────────────────────────────
function attachLiveValidation() {
  const textFields = [
    { id: 'reg-fullname',       pattern: /^[\p{L}\s\-\.']+$/u, msg: 'Letters only — no numbers or special characters.' },
    { id: 'reg-emergency',      pattern: /^[\p{L}\s\-\.']+$/u, msg: 'Letters only — no numbers or special characters.' },
    { id: 'reg-contact',        pattern: /^[\d\+\-\(\)\s]+$/,  msg: 'Numbers only — ( ) + - and spaces allowed.' },
    { id: 'reg-emergency-phone',pattern: /^[\d\+\-\(\)\s]+$/,  msg: 'Numbers only — ( ) + - and spaces allowed.' },
  ];

  textFields.forEach(({ id, pattern, msg }) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => {
      if (!el.value.trim()) { clearFieldError(id); return; }
      if (!pattern.test(el.value.trim())) setFieldError(id, msg);
      else clearFieldError(id);
    });
  });

  const numFields = [
    { id: 'reg-weight',    max: 500,  unit: 'kg'  },
    { id: 'reg-height',    max: 300,  unit: 'cm'  },
    { id: 'reg-head-circ', max: 100,  unit: 'cm'  },
  ];

  numFields.forEach(({ id, max, unit }) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => {
      const v = parseFloat(el.value);
      if (!el.value) { clearFieldError(id); return; }
      if (isNaN(v) || v <= 0) setFieldError(id, `Enter a valid number in ${unit}.`);
      else if (v > max)       setFieldError(id, `Must be ${max} ${unit} or less.`);
      else                    clearFieldError(id);
    });
  });

  numFields.forEach(({ id }) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('keypress', (e) => {
      if (!/[\d.]/.test(e.key)) e.preventDefault();
    });
  });

  ['reg-fullname', 'reg-emergency'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('keypress', (e) => {
      if (/[0-9]/.test(e.key)) {
        e.preventDefault();
        setFieldError(id, 'Numbers are not allowed in this field.');
      }
    });
  });

  ['reg-contact', 'reg-emergency-phone'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('keypress', (e) => {
      if (!/[\d\+\-\(\)\s]/.test(e.key)) {
        e.preventDefault();
        setFieldError(id, 'Numbers only — ( ) + - and spaces allowed.');
      }
    });
  });
}

// ─── Helper Functions ─────────────────────────────────────────────────────────
function calculateBMI(weight, height) {
  if (!weight || !height || height <= 0) return null;
  const heightInMeters = height / 100;
  return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
}

function getBMICategory(bmi) {
  if (!bmi) return { category: 'N/A', color: '#6c757d', emoji: '⚪' };
  if (bmi < 18.5) return { category: 'Underweight', color: '#ffc107', emoji: '⚠️' };
  if (bmi < 25)   return { category: 'Normal',      color: '#28a745', emoji: '✅' };
  if (bmi < 30)   return { category: 'Overweight',  color: '#fd7e14', emoji: '⚖️' };
  if (bmi < 35)   return { category: 'Obese Class I',  color: '#dc3545', emoji: '🔴' };
  if (bmi < 40)   return { category: 'Obese Class II', color: '#c82333', emoji: '🔴' };
  return { category: 'Obese Class III', color: '#721c24', emoji: '🚨' };
}

function isChild(age) {
  return age !== undefined && age !== null && age <= 5;
}

function formatFileSize(bytes) {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
}

// ─── Patient List ─────────────────────────────────────────────────────────────
export function renderPatients() {
  const filter = (window.state?.searchFilters?.['patient-search']) || getSearchValue('patient-search') || '';
  const filtered = filterData(DATA.patients, filter, ['name', 'condition', 'id']);
  const userRole = window.state?.role || 'employee';

  const patientsWithBMI = filtered.map(p => {
    const bmi = calculateBMI(p.weight, p.height);
    const bmiInfo = getBMICategory(bmi);
    return { ...p, bmi, bmiCategory: bmiInfo.category, bmiColor: bmiInfo.color, bmiEmoji: bmiInfo.emoji, isChild: isChild(p.age), needsGrowthTracking: isChild(p.age) };
  });

  return `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row gap-3 justify-between">
        ${searchInput('patient-search', 'Search by name, condition, ID...')}
        ${btnPrimary('+ Register Patient', 'register-patient')}
      </div>
      ${card(`
        <div class="ui-card-body">
          <h3 class="ui-section-title mb-4">Patient Records</h3>
          ${tableWrap(`
            <table class="w-full text-left">
              <thead class="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">ID</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Name</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Age</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Blood</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Weight</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Height</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">BMI</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Status</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Triage</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Last Visit</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                ${patientsWithBMI.length ? renderList(patientsWithBMI, p => `
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td class="px-4 py-3 text-sm font-mono">${p.id}</td>
                    <td class="px-4 py-3 text-sm font-medium">
                      ${p.name}
                      ${p.isChild ? ' <span class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">👶 Child</span>' : ''}
                    </td>
                    <td class="px-4 py-3 text-sm">${p.age} yrs</td>
                    <td class="px-4 py-3 text-sm">${p.bloodType || 'N/A'}</td>
                    <td class="px-4 py-3 text-sm">${p.weight ? p.weight + ' kg' : '—'}</td>
                    <td class="px-4 py-3 text-sm">${p.height ? p.height + ' cm' : '—'}</td>
                    <td class="px-4 py-3 text-sm">
                      ${p.bmi ? `<span style="color:${p.bmiColor};font-weight:600;">${p.bmi}</span>` : '—'}
                    </td>
                    <td class="px-4 py-3 text-sm">
                      ${p.bmi ? `<span style="background:${p.bmiColor}20;color:${p.bmiColor};padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600;display:inline-block;">${p.bmiEmoji} ${p.bmiCategory}</span>`
                               : '<span class="text-slate-400 text-xs">Not recorded</span>'}
                    </td>
                    <td class="px-4 py-3 text-sm">${badge(p.triage)}</td>
                    <td class="px-4 py-3 text-sm text-slate-500">${p.lastVisit}</td>
                    <td class="px-4 py-3 text-sm">
                      <div class="flex gap-1 flex-wrap">
                        <button data-action="view-patient-detail" data-id="${p.id}" 
                                class="px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">
                          👁️ View
                        </button>
                        ${userRole === 'admin' ? `
                        <button data-action="delete-patient" data-id="${p.id}" data-name="${p.name.replace(/"/g, '&quot;')}"
                                class="px-2 py-1 text-xs rounded bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800">
                          🗑️ Delete
                        </button>
                        ` : ''}
                        ${p.isChild ? `
                        <button data-action="view-growth-chart" data-id="${p.id}" 
                                class="px-2 py-1 text-xs rounded bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400">
                          📊 Growth
                        </button>
                        ` : ''}
                      </div>
                    </td>
                  </tr>
                `) : `<tr><td colspan="11">${emptyState('No patients found')}</td></tr>`}
              </tbody>
            </table>
          `)}
        </div>
      `)}
    </div>
  `;
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────
export function showPatientDetail(id) {
  const p = DATA.patients.find(item => item.id === id);
  if (!p) return;

  const history = DATA.consultationHistory || [];
  const bmi = calculateBMI(p.weight, p.height);
  const bmiInfo = getBMICategory(bmi);
  const isChildPatient = isChild(p.age);

  openModal(
    `${p.name} — ${p.id}`,
    `
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <div><p class="text-xs text-slate-500">Full Name</p><p class="font-medium">${p.name}</p></div>
          <div><p class="text-xs text-slate-500">Age</p><p class="font-medium">${p.age} years ${isChildPatient ? '👶 <span class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Child (Growth Tracking)</span>' : ''}</p></div>
          <div><p class="text-xs text-slate-500">Blood Type</p><p class="font-medium">${p.bloodType || 'N/A'}</p></div>
          <div><p class="text-xs text-slate-500">Triage</p>${badge(p.triage)}</div>
          <div><p class="text-xs text-slate-500">Last Visit</p><p class="font-medium">${p.lastVisit}</p></div>
          <div><p class="text-xs text-slate-500">Condition</p><p class="font-medium">${p.condition}</p></div>
        </div>
        <div class="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-xl">
          <p class="text-xs text-slate-500 uppercase tracking-wider mb-3 font-semibold">📏 Anthropometric Measurements</p>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div><p class="text-xs text-slate-500">Weight</p><p class="text-lg font-bold">${p.weight ? p.weight + ' kg' : '—'}</p></div>
            <div><p class="text-xs text-slate-500">Height</p><p class="text-lg font-bold">${p.height ? p.height + ' cm' : '—'}</p></div>
            <div><p class="text-xs text-slate-500">BMI</p><p class="text-lg font-bold" style="color:${bmiInfo.color}">${bmi || '—'}</p></div>
            <div><p class="text-xs text-slate-500">Status</p><p class="text-sm font-semibold" style="color:${bmiInfo.color}">${bmi ? bmiInfo.emoji + ' ' + bmiInfo.category : 'Not recorded'}</p></div>
          </div>
        </div>
        <div>
          <p class="text-xs text-slate-500 uppercase tracking-wider mb-2 font-semibold">Medical History</p>
          ${history.length ? history.map(c => `
            <div class="flex gap-3 py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
              <div class="text-xs text-slate-400 whitespace-nowrap pt-0.5">${c.date}</div>
              <div>
                <p class="text-sm font-medium">${c.diagnosis}</p>
                <p class="text-xs text-slate-500">${c.doctor}</p>
                <p class="text-xs text-slate-400 mt-0.5">${c.notes}</p>
              </div>
            </div>
          `).join('') : '<p class="text-sm text-slate-500">No consultation history on file.</p>'}
        </div>
        <div>
          <p class="text-xs text-slate-500 uppercase tracking-wider mb-2 font-semibold">Documents</p>
          <div class="space-y-2" id="patient-documents-list">
            <div class="text-center py-4 text-slate-400">
              <div class="animate-pulse">Loading documents...</div>
            </div>
          </div>
          <div class="mt-3 border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl p-4 text-center hover:border-gov-400 transition-colors cursor-pointer" data-action="upload-document" data-patient-id="${p.id}">
            <svg class="h-6 w-6 mx-auto text-slate-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
            <p class="text-sm text-slate-500">Attach lab result or note</p>
            <p class="text-xs text-slate-400 mt-0.5">PDF, JPG, PNG up to 10MB</p>
          </div>
        </div>
      </div>
    `,
    `<button data-action="close-modal" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">Close</button>
     ${btnPrimary('Edit Patient', 'edit-patient')}
     ${isChildPatient ? btnSecondary('📊 Growth Chart', 'view-growth-chart') : ''}`
  );
  
  setTimeout(() => loadDocumentsInModal(p.id), 200);
}

// ─── Load Documents ───────────────────────────────────────────────────────────
async function loadDocumentsInModal(patientId) {
    const container = document.getElementById('patient-documents-list');
    if (!container) return;
    
    try {
        const response = await fetch(`api/patients/getDocuments.php?patient_id=${patientId}`);
        const data = await response.json();
        
        if (data.success) {
            const documents = data.documents || [];
            const userRole = window.state?.role || 'employee';
            
            if (documents.length === 0) {
                container.innerHTML = '<p class="text-sm text-slate-500 text-center py-4">No documents uploaded</p>';
                return;
            }
            
            const typeIcon = {
                'Lab Result':   'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
                'Imaging':      'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
                'Prescription': 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
                'Other':        'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
            };
            
            container.innerHTML = documents.map(doc => `
                <div class="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 transition-colors">
                    <div class="flex items-center gap-3">
                        <div class="flex h-8 w-8 items-center justify-center rounded-lg ${doc.file_category === 'pdf' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : (typeIcon[doc.type] || typeIcon['Other'])}">
                            ${doc.file_category === 'pdf' ? 
                                `<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>` :
                                `<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`
                            }
                        </div>
                        <div>
                            <p class="text-sm font-medium">${doc.name}</p>
                            <p class="text-xs text-slate-500">
                                ${doc.type} · ${doc.date}
                                ${doc.file_category === 'pdf' ? ' · 📄 PDF' : ' · 🖼️ Image'}
                                ${doc.file_size ? ' · ' + formatFileSize(doc.file_size) : ''}
                            </p>
                        </div>
                    </div>
                    <div class="flex gap-1">
                        <button data-action="view-document" data-path="${doc.file_path}" 
                                class="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-600 transition-colors">
                            👁️ View
                        </button>
                        ${userRole === 'admin' ? `
                        <button data-action="delete-document" data-id="${doc.id}" data-patient-id="${patientId}" data-name="${doc.name.replace(/"/g, '&quot;')}"
                                class="px-3 py-1.5 text-xs font-medium rounded-lg border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                            🗑️ Delete
                        </button>
                        ` : ''}
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p class="text-sm text-red-500">Failed to load documents</p>';
        }
    } catch (e) {
        container.innerHTML = '<p class="text-sm text-red-500">Failed to load documents</p>';
    }
}

// ─── Register Modal ───────────────────────────────────────────────────────────
export function showRegisterPatient() {
  const today = new Date().toISOString().split('T')[0];

  openModal(
    'Register New Patient',
    `
      <form class="space-y-4" id="register-patient-form" onsubmit="return false">
        <div>
          <label class="block text-sm font-medium mb-1">Full Name <span class="text-red-500">*</span></label>
          <input type="text" id="reg-fullname" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none" placeholder="e.g., Juan dela Cruz" required>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium mb-1">Date of Birth <span class="text-red-500">*</span></label>
            <input type="date" id="reg-dob" value="${today}" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none" required>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Age</label>
            <div id="reg-age-display" class="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-600 text-sm">Calculating...</div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium mb-1">Blood Type</label>
            <select id="reg-bloodtype" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none">
              <option value="">Select</option>
              <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
              <option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Gender</label>
            <select id="reg-gender" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none">
              <option value="">Select</option>
              <option>Male</option><option>Female</option><option>Other</option>
            </select>
          </div>
        </div>
        <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
          <h4 class="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-3">📏 Anthropometric Measurements</h4>
          <div id="growth-warning" class="hidden mb-3 p-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-lg text-sm">
            ⚠️ <span id="growth-warning-text">This patient is a child (≤ 5 years). Weight and height are required for growth tracking.</span>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium mb-1">Weight (kg) <span id="weight-required" class="text-red-500 hidden">*</span></label>
              <input type="number" id="reg-weight" step="0.1" min="0.1" max="500" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none" placeholder="e.g., 12.5">
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Height (cm) <span id="height-required" class="text-red-500 hidden">*</span></label>
              <input type="number" id="reg-height" step="0.1" min="0.1" max="300" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none" placeholder="e.g., 85.0">
            </div>
          </div>
          <div class="mt-3 grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium mb-1">Head Circumference (cm)</label>
              <input type="number" id="reg-head-circ" step="0.1" min="0.1" max="100" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none" placeholder="For children under 2">
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Measurement Date</label>
              <input type="date" id="reg-measurement-date" value="${today}" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none">
            </div>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Address</label>
          <input type="text" id="reg-address" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none">
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium mb-1">Contact Number</label>
            <input type="text" id="reg-contact" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none" placeholder="e.g., 09171234567">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Emergency Contact Name</label>
            <input type="text" id="reg-emergency" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none" placeholder="e.g., Maria dela Cruz">
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Emergency Contact Phone</label>
          <input type="text" id="reg-emergency-phone" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none" placeholder="e.g., 09179876543">
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Existing Conditions</label>
          <textarea id="reg-conditions" rows="2" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none resize-none"></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Triage Level <span class="text-red-500">*</span></label>
          <select id="reg-triage" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none" required>
            <option value="">Select</option>
            <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
          </select>
        </div>
      </form>
    `,
    `<button data-action="close-modal" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">Cancel</button>
     <button data-action="confirm-register-patient" class="px-4 py-2 rounded-lg bg-gov-600 text-white hover:bg-gov-700">Register Patient</button>`
  );

  setTimeout(() => {
    const dobInput = document.getElementById('reg-dob');
    const ageDisplay = document.getElementById('reg-age-display');
    const weightInput = document.getElementById('reg-weight');
    const heightInput = document.getElementById('reg-height');
    const weightRequired = document.getElementById('weight-required');
    const heightRequired = document.getElementById('height-required');
    const growthWarning = document.getElementById('growth-warning');
    const growthWarningText = document.getElementById('growth-warning-text');

    function calcAge() {
      if (!dobInput.value) { ageDisplay.textContent = 'Please select date of birth'; return; }
      const birth = new Date(dobInput.value);
      const now = new Date();
      let age = now.getFullYear() - birth.getFullYear();
      const m = now.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
      const child = age <= 5;
      ageDisplay.textContent = `${age} years ${child ? '👶 Child' : '🧑 Adult'}`;
      weightRequired.classList.toggle('hidden', !child);
      heightRequired.classList.toggle('hidden', !child);
      growthWarning.classList.toggle('hidden', !child);
      if (child) growthWarningText.textContent = `This patient is ${age} years old. Weight and height are required for growth tracking.`;
      weightInput.required = child;
      heightInput.required = child;
    }

    dobInput.addEventListener('change', calcAge);
    if (dobInput.value) calcAge();
    attachLiveValidation();
  }, 100);
}

// ─── Growth Chart Modal ───────────────────────────────────────────────────────
export function showGrowthChart(id) {
  const p = DATA.patients.find(item => item.id === id);
  if (!p) return;

  openModal(
    `📊 Growth Chart — ${p.name}`,
    `
      <div class="space-y-4">
        <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
          <h4 class="text-sm font-semibold text-green-700 dark:text-green-400">Patient Information</h4>
          <div class="grid grid-cols-2 gap-2 mt-2 text-sm">
            <div><span class="text-slate-500">Age:</span> ${p.age} years</div>
            <div><span class="text-slate-500">Weight:</span> ${p.weight ? p.weight + ' kg' : 'N/A'}</div>
            <div><span class="text-slate-500">Height:</span> ${p.height ? p.height + ' cm' : 'N/A'}</div>
            <div><span class="text-slate-500">BMI:</span> ${p.weight && p.height ? calculateBMI(p.weight, p.height) : 'N/A'}</div>
          </div>
        </div>
        <div class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800">
          <p class="text-sm text-yellow-700 dark:text-yellow-400">
            📋 <strong>Growth tracking is active for this child.</strong><br>
            <span class="text-xs">Regular measurements should be taken monthly.</span>
          </p>
        </div>
        <div class="grid grid-cols-1 gap-4">
          <div class="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-xl text-center">
            <p class="text-sm text-slate-500">📈 Weight-for-Age Chart</p>
            <div class="h-48 flex items-center justify-center text-slate-400 text-sm">[WHO Growth Chart Placeholder]</div>
          </div>
          <div class="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-xl text-center">
            <p class="text-sm text-slate-500">📈 Height-for-Age Chart</p>
            <div class="h-48 flex items-center justify-center text-slate-400 text-sm">[WHO Growth Chart Placeholder]</div>
          </div>
        </div>
        <div>
          <h4 class="text-sm font-semibold mb-2">📝 Growth History</h4>
          <div class="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-xl text-center text-sm text-slate-400">
            No growth history recorded yet.
            <button class="block mx-auto mt-2 text-gov-600 hover:text-gov-700">+ Add Measurement</button>
          </div>
        </div>
      </div>
    `,
    `<button data-action="close-modal" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">Close</button>
     ${btnSecondary('📊 Export Growth Data', 'export-growth-data')}`
  );
}
// ─── Make available globally ──────────────────────────────────────────────────
window.loadDocumentsInModal = loadDocumentsInModal;