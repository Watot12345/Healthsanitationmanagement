import { card, icon, renderList, badge, filterData, searchInput, btnPrimary, tableWrap, emptyState } from '../../utils/dom.js';
import { openModal } from '../../utils/modal.js';
import { DATA } from '../../data.js';

// ─── Fake Data ──────────────────────────────────────────────────────────────

const MEDICAL_RECORDS = [
  { id: 'MR-001', patient: 'Pedro Garcia', type: 'Lab Result', title: 'Complete Blood Count', date: '2026-05-15', doctor: 'Dr. Elena Santos', summary: 'All values within normal range. Slightly elevated cholesterol.', attachments: 1 },
  { id: 'MR-002', patient: 'Pedro Garcia', type: 'Imaging', title: 'Chest X-Ray', date: '2026-05-15', doctor: 'Dr. Elena Santos', summary: 'Lungs clear. No abnormalities detected.', attachments: 2 },
  { id: 'MR-003', patient: 'Rosa Mendoza', type: 'Lab Result', title: 'Urinalysis', date: '2026-06-01', doctor: 'Dr. Miguel Reyes', summary: 'Normal findings. No infection.', attachments: 1 },
  { id: 'MR-004', patient: 'Carlos Lim', type: 'Lab Result', title: 'Fasting Blood Sugar', date: '2026-06-10', doctor: 'Dr. Ana Cruz', summary: '126 mg/dL — borderline diabetic range.', attachments: 1 },
];

const visitHistory = [
  { date: '2026-06-22', type: 'Consultation', doctor: 'Dr. Elena Santos', reason: 'Hypertension follow-up' },
  { date: '2026-05-15', type: 'Lab Test', doctor: 'Dr. Elena Santos', reason: 'Annual blood work' },
  { date: '2026-05-15', type: 'Imaging', doctor: 'Dr. Elena Santos', reason: 'Chest X-Ray' },
  { date: '2026-03-02', type: 'Consultation', doctor: 'Dr. Miguel Reyes', reason: 'Annual physical' },
];

const typeIcon = {
  'Lab Result': 'bg-blue-100 text-blue-600',
  'Imaging': 'bg-purple-100 text-purple-600',
  'Prescription': 'bg-green-100 text-green-600',
};

// ─── View ────────────────────────────────────────────────────────────────────

export function renderMedicalRecords(filter = '') {
  const filtered = filterData(MEDICAL_RECORDS, filter, ['patient', 'title', 'type', 'doctor']);

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
                    <td class="px-4 py-3 text-sm font-medium">${r.patient}</td>
                    <td class="px-4 py-3 text-sm">${badge(r.type)}</td>
                    <td class="px-4 py-3 text-sm">${r.title}</td>
                    <td class="px-4 py-3 text-sm text-slate-500">${r.date}</td>
                    <td class="px-4 py-3 text-sm text-slate-500">${r.doctor}</td>
                    <td class="px-4 py-3 text-sm text-slate-500 max-w-xs truncate">${r.summary}</td>
                    <td class="px-4 py-3 text-sm">
                      <div class="flex gap-1">
                        <button data-action="view-record" data-id="${r.id}" class="px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">View</button>
                        <button data-action="download-record" data-id="${r.id}" class="px-2 py-1 text-xs rounded bg-gov-50 text-gov-700 hover:bg-gov-100 dark:bg-gov-900/20 dark:text-gov-400">⬇</button>
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

// ─── Detail Modal ────────────────────────────────────────────────────────────

export function showRecordDetail(id) {
  const r = MEDICAL_RECORDS.find(item => item.id === id);
  if (!r) return;

  const patientVisits = visitHistory;

  openModal(
    `${r.title} — ${r.patient}`,
    `
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <div><p class="text-xs text-slate-500">Patient</p><p class="font-medium">${r.patient}</p></div>
          <div><p class="text-xs text-slate-500">Record Type</p>${badge(r.type)}</div>
          <div><p class="text-xs text-slate-500">Date</p><p class="font-medium">${r.date}</p></div>
          <div><p class="text-xs text-slate-500">Doctor</p><p class="font-medium">${r.doctor}</p></div>
        </div>

        <div>
          <p class="text-xs text-slate-500 uppercase tracking-wider mb-2 font-semibold">Medical Summary</p>
          <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
            <p class="text-sm">${r.summary}</p>
          </div>
        </div>

        <div>
          <p class="text-xs text-slate-500 uppercase tracking-wider mb-2 font-semibold">Attachments</p>
          <div class="space-y-2">
            ${Array.from({length: r.attachments}, (_, i) => `
              <div class="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                <div class="flex items-center gap-3">
                  <div class="flex h-8 w-8 items-center justify-center rounded-lg ${typeIcon[r.type] || 'bg-slate-100 text-slate-600'}">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium">${r.title} — File ${i + 1}</p>
                    <p class="text-xs text-slate-500">${r.type} · ${r.date}</p>
                  </div>
                </div>
                <button data-action="download-record" class="px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600">Download</button>
              </div>
            `).join('')}
          </div>
        </div>

        <div>
          <p class="text-xs text-slate-500 uppercase tracking-wider mb-2 font-semibold">Visit History — ${r.patient}</p>
          <div class="relative pl-4 border-l-2 border-slate-200 dark:border-slate-700">
            ${patientVisits.map((v, i) => `
              <div class="mb-3 relative">
                <div class="absolute -left-[21px] h-3 w-3 rounded-full bg-gov-600 border-2 border-white dark:border-slate-800"></div>
                <p class="text-sm font-medium">${v.reason}</p>
                <p class="text-xs text-slate-500">${v.date} · ${v.doctor} · ${v.type}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `,
    `<button data-action="close-modal" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">Close</button>
     <button data-action="download-record" class="px-4 py-2 rounded-lg bg-gov-600 text-white hover:bg-gov-700">Download Report</button>`
  );
}