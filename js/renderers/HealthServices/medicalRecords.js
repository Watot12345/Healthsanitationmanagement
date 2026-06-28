import { card, icon, renderList, badge, filterData, searchInput, btnPrimary, tableWrap, emptyState, btnSecondary } from '../../utils/dom.js';
import { openModal } from '../../utils/modal.js';
import { DATA } from '../../data.js';
import { getSearchValue } from '../../utils/search.js';


// ─── View ────────────────────────────────────────────────────────────────────

export function renderMedicalRecords() {
  const filter = (window.state?.searchFilters?.['record-search']) || getSearchValue('record-search') || '';
  const records = DATA.medicalRecords || [];
  const filtered = filterData(records, filter, ['patient', 'title', 'type', 'doctor']);

  return `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row gap-3 justify-between">
        ${searchInput('record-search', 'Search by patient, type, doctor...')}
        ${btnPrimary('+ Add Record', 'add-record')}
      </div>

      ${card(`
        <div class="ui-card-body">
          <h3 class="ui-section-title mb-4">Medical Records</h3>
          ${tableWrap(`
            <table class="w-full text-left">
              <thead class="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">ID</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Patient</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Type</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Title</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Date</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Doctor</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Summary</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                ${filtered.length ? renderList(filtered, r => `
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td class="px-4 py-3 text-sm font-mono">${r.id}</td>
                    <td class="px-4 py-3 text-sm font-medium">${r.patient || r.patient_name}</td>
                    <td class="px-4 py-3 text-sm">${badge(r.type || r.record_type)}</td>
                    <td class="px-4 py-3 text-sm">${r.title}</td>
                    <td class="px-4 py-3 text-sm text-slate-500">${r.date || r.record_date}</td>
                    <td class="px-4 py-3 text-sm text-slate-500">${r.doctor || r.doctor_name}</td>
                    <td class="px-4 py-3 text-sm text-slate-500 max-w-xs truncate">${r.summary}</td>
                    <td class="px-4 py-3 text-sm">
                      <div class="flex gap-1">
                        <button data-action="view-record" data-id="${r.id}" class="px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">👁️ View</button>
                        <button data-action="delete-record" data-id="${r.id}" class="px-2 py-1 text-xs rounded bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800">🗑️</button>
                      </div>
                    </td>
                  </tr>
                `) : `<tr><td colspan="8">${emptyState('No records found')}</td></tr>`}
              </tbody>
            </table>
          `)}
        </div>
      `)}
    </div>
  `;
}

// ─── Add Record Modal ────────────────────────────────────────────────────────

export function showAddRecord() {
  const today = new Date().toISOString().split('T')[0];

  openModal(
    'Add Medical Record',
    `
      <form class="space-y-4" onsubmit="return false">
        <div>
          <label class="block text-sm font-medium mb-1">Patient <span class="text-red-500">*</span></label>
          <select id="record-patient" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none" required>
            <option value="">Select Patient</option>
            ${DATA.patients.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">Record Type <span class="text-red-500">*</span></label>
          <select id="record-type" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none">
            <option>Lab Result</option>
            <option>Imaging</option>
            <option>Prescription</option>
            <option>Doctor Note</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">Title <span class="text-red-500">*</span></label>
          <input type="text" id="record-title" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none" placeholder="e.g., Complete Blood Count" required>
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">Date</label>
          <input type="date" id="record-date" value="${today}" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none">
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">Doctor</label>
          <input type="text" id="record-doctor" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none" placeholder="Dr. Name">
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">Summary</label>
          <textarea id="record-summary" rows="3" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none resize-none" placeholder="Medical summary..."></textarea>
        </div>
      </form>
    `,
    `<button data-action="close-modal" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">Cancel</button>
     <button data-action="confirm-add-record" class="px-4 py-2 rounded-lg bg-gov-600 text-white hover:bg-gov-700">Save Record</button>`
  );
}

// ─── Detail Modal ────────────────────────────────────────────────────────────

export function showRecordDetail(id) {
  const records = DATA.medicalRecords || [];
  const r = records.find(item => item.id == id);
  if (!r) return;

  openModal(
    `${r.title} — ${r.patient || r.patient_name}`,
    `
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <div><p class="text-xs text-slate-500">Patient</p><p class="font-medium">${r.patient || r.patient_name}</p></div>
          <div><p class="text-xs text-slate-500">Record Type</p>${badge(r.type || r.record_type)}</div>
          <div><p class="text-xs text-slate-500">Date</p><p class="font-medium">${r.date || r.record_date}</p></div>
          <div><p class="text-xs text-slate-500">Doctor</p><p class="font-medium">${r.doctor || r.doctor_name}</p></div>
        </div>

        <div>
          <p class="text-xs text-slate-500 uppercase tracking-wider mb-2 font-semibold">Medical Summary</p>
          <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
            <p class="text-sm">${r.summary || 'No summary provided'}</p>
          </div>
        </div>
      </div>
    `,
    `<button data-action="close-modal" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">Close</button>`
  );
}