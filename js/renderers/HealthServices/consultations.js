import { card, icon, renderList, badge, filterData, searchInput, btnPrimary, tableWrap, emptyState, btnSecondary } from '../../utils/dom.js';
import { openModal } from '../../utils/modal.js';
import { DATA } from '../../data.js';
import { getSearchValue } from '../../utils/search.js';

// ─── View ────────────────────────────────────────────────────────────────────
export function renderConsultations() {  // Remove filter parameter
  const filter = (window.state?.searchFilters?.['consultation-search']) || getSearchValue('consultation-search') || '';
  const consultations = DATA.consultations || [];
  const filtered = filterData(consultations, filter, ['patient', 'doctor', 'diagnosis']);

  return `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row gap-3 justify-between">
        ${searchInput('consultation-search', 'Search by patient, doctor, diagnosis...')}
        ${btnPrimary('+ New Consultation', 'new-consultation')}
      </div>
      ${card(`
        <div class="ui-card-body">
          <h3 class="ui-section-title mb-4">Consultation Records</h3>
          ${tableWrap(`
            <table class="w-full text-left">
              <thead class="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">ID</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Patient</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Doctor</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Date</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Diagnosis</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Follow-up</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Status</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                ${filtered.length ? renderList(filtered, c => `
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td class="px-4 py-3 text-sm font-mono">${c.id}</td>
                    <td class="px-4 py-3 text-sm font-medium">${c.patient || c.patient_name}</td>
                    <td class="px-4 py-3 text-sm">${c.doctor || c.doctor_name}</td>
                    <td class="px-4 py-3 text-sm text-slate-500">${c.date || c.consultation_date} ${c.time || ''}</td>
                    <td class="px-4 py-3 text-sm">${c.diagnosis}</td>
                    <td class="px-4 py-3 text-sm text-slate-500">${c.followUp || c.follow_up_date || 'N/A'}</td>
                    <td class="px-4 py-3 text-sm">${badge(c.status)}</td>
                    <td class="px-4 py-3 text-sm">
                      <div class="flex gap-1">
                        <button data-action="view-consultation" data-id="${c.id}" class="px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">👁️ View</button>
                        <button data-action="delete-consultation" data-id="${c.id}" class="px-2 py-1 text-xs rounded bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800">🗑️ Delete</button>
                      </div>
                    </td>
                  </tr>
                `) : `<tr><td colspan="8">${emptyState('No consultations found')}</td></tr>`}
              </tbody>
            </table>
          `)}
        </div>
      `)}
    </div>
  `;
}

// ─── Detail Modal ────────────────────────────────────────────────────────────

export function showConsultationDetail(id) {
    const consultations = DATA.consultations || [];
  const c = consultations.find(item => item.id == id);
  if (!c) return;

  openModal(
    `Consultation ${c.id} — ${c.patient || c.patient_name}`,
    `
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <div><p class="text-xs text-slate-500">Patient</p><p class="font-medium">${c.patient}</p></div>
          <div><p class="text-xs text-slate-500">Doctor</p><p class="font-medium">${c.doctor}</p></div>
          <div><p class="text-xs text-slate-500">Date</p><p class="font-medium">${c.date}</p></div>
          <div><p class="text-xs text-slate-500">Time</p><p class="font-medium">${c.time}</p></div>
          <div><p class="text-xs text-slate-500">Status</p>${badge(c.status)}</div>
          <div><p class="text-xs text-slate-500">Follow-up</p><p class="font-medium">${c.followUp}</p></div>
        </div>
        <div><p class="text-xs text-slate-500 mb-1">Diagnosis</p><p class="text-sm font-medium">${c.diagnosis}</p></div>
        <div><p class="text-xs text-slate-500 mb-1">Notes</p><p class="text-sm">${c.notes}</p></div>
        <div><p class="text-xs text-slate-500 mb-1">Prescription</p>
          <div class="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p class="text-sm font-medium text-blue-700 dark:text-blue-400">💊 ${c.prescription}</p>
          </div>
        </div>
      </div>
    `,
    `<button data-action="close-modal" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">Close</button>`
  );
}

// ─── New Consultation Modal ──────────────────────────────────────────────────
export function showNewConsultation() {
  const today = new Date().toISOString().split('T')[0];

  openModal(
    'New Consultation',
    `
      <form class="space-y-4" onsubmit="return false">
        <div>
          <label class="block text-sm font-medium mb-1">Patient <span class="text-red-500">*</span></label>
          <select id="consult-patient" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none" required>
            <option value="">Select Patient</option>
            ${DATA.patients.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">Doctor <span class="text-red-500">*</span></label>
          <input type="text" id="consult-doctor" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none" placeholder="Dr. Name" required>
        </div>
        
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium mb-1">Date</label>
            <input type="date" id="consult-date" value="${today}" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Time</label>
            <input type="time" id="consult-time" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none">
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">Diagnosis</label>
          <input type="text" id="consult-diagnosis" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none" placeholder="e.g., Hypertension">
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">Symptoms</label>
          <textarea id="consult-symptoms" rows="2" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none resize-none" placeholder="Patient symptoms..."></textarea>
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">Notes</label>
          <textarea id="consult-notes" rows="3" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none resize-none" placeholder="Doctor notes..."></textarea>
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">Prescription</label>
          <input type="text" id="consult-prescription" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none" placeholder="e.g., Paracetamol 500mg">
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">Follow-up Date</label>
          <input type="date" id="consult-followup" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none">
        </div>
      </form>
    `,
    `<button data-action="close-modal" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">Cancel</button>
     <button data-action="confirm-consultation" class="px-4 py-2 rounded-lg bg-gov-600 text-white hover:bg-gov-700">Save Consultation</button>`
  );
}