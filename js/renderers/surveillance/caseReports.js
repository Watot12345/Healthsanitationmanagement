import { card, icon, renderList, badge, filterData, searchInput, btnPrimary, tableWrap, emptyState, btnSuccess, btnDanger, btnSecondary } from '../../utils/dom.js';
import { openModal } from '../../utils/modal.js';
import { DATA } from '../../data.js';

// ─── Fake Data ──────────────────────────────────────────────────────────────

const CASE_REPORTS = [
  { id: 'CS-001', patient: 'Pedro Garcia', age: 34, barangay: 'San Jose', disease: 'Dengue Fever', symptoms: 'Fever, headache, joint pain, rash', diagnosis: 'Dengue NS1 Positive', dateReported: '2026-06-20', status: 'Confirmed', severity: 'Moderate', reportedBy: 'Dr. Elena Santos' },
  { id: 'CS-002', patient: 'Rosa Mendoza', age: 28, barangay: 'Poblacion', disease: 'Food Poisoning', symptoms: 'Nausea, vomiting, diarrhea', diagnosis: 'Pending lab results', dateReported: '2026-06-21', status: 'Suspected', severity: 'Low', reportedBy: 'Dr. Miguel Reyes' },
  { id: 'CS-003', patient: 'Carlos Lim', age: 45, barangay: 'Riverside', disease: 'Influenza', symptoms: 'Fever, cough, body aches', diagnosis: 'Influenza A Positive', dateReported: '2026-06-22', status: 'Confirmed', severity: 'High', reportedBy: 'Dr. Ana Cruz' },
  { id: 'CS-004', patient: 'Elena Torres', age: 32, barangay: 'San Jose', disease: 'Leptospirosis', symptoms: 'Fever, muscle pain, red eyes', diagnosis: 'Awaiting test', dateReported: '2026-06-19', status: 'Suspected', severity: 'Moderate', reportedBy: 'Dr. Elena Santos' },
  { id: 'CS-005', patient: 'Miguel Santos', age: 5, barangay: 'Poblacion', disease: 'Measles', symptoms: 'Fever, rash, cough', diagnosis: 'Clinical diagnosis', dateReported: '2026-06-23', status: 'Confirmed', severity: 'High', reportedBy: 'Dr. Miguel Reyes' },
];

// ─── View ────────────────────────────────────────────────────────────────────

export function renderCaseReports(filter = '') {
  const filtered = filterData(CASE_REPORTS, filter, ['patient', 'disease', 'barangay', 'status', 'severity']);

  return `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row gap-3 justify-between">
        ${searchInput('case-search', 'Search by patient, disease, barangay...')}
        ${btnPrimary('+ Report Case', 'report-case')}
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        ${card(`<div class="p-4 text-center"><p class="text-xs text-slate-500 uppercase">Total Cases</p><p class="text-2xl font-bold">${CASE_REPORTS.length}</p></div>`)}
        ${card(`<div class="p-4 text-center"><p class="text-xs text-slate-500 uppercase">Confirmed</p><p class="text-2xl font-bold text-red-600">${CASE_REPORTS.filter(c => c.status === 'Confirmed').length}</p></div>`)}
        ${card(`<div class="p-4 text-center"><p class="text-xs text-slate-500 uppercase">Suspected</p><p class="text-2xl font-bold text-yellow-600">${CASE_REPORTS.filter(c => c.status === 'Suspected').length}</p></div>`)}
      </div>

      ${card(`
        <div class="ui-card-body">
          <h3 class="ui-section-title mb-4">Case Reports</h3>
          ${tableWrap(`
            <table class="w-full text-left">
              <thead class="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">ID</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Patient</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Disease</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Barangay</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Date</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Severity</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Status</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                ${filtered.length ? renderList(filtered, c => `
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${c.status === 'Confirmed' && c.severity === 'High' ? 'bg-red-50 dark:bg-red-900/10' : ''}">
                    <td class="px-4 py-3 text-sm font-mono">${c.id}</td>
                    <td class="px-4 py-3 text-sm font-medium">${c.patient}</td>
                    <td class="px-4 py-3 text-sm">${c.disease}</td>
                    <td class="px-4 py-3 text-sm text-slate-500">${c.barangay}</td>
                    <td class="px-4 py-3 text-sm text-slate-500">${c.dateReported}</td>
                    <td class="px-4 py-3 text-sm">${badge(c.severity)}</td>
                    <td class="px-4 py-3 text-sm">${badge(c.status)}</td>
                    <td class="px-4 py-3 text-sm">
                      <div class="flex gap-1">
                        <button data-action="view-case" data-id="${c.id}" class="px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">View</button>
                        ${c.status === 'Suspected' ? btnSuccess('Confirm', 'confirm-case') : ''}
                      </div>
                    </td>
                  </tr>
                `) : `<tr><td colspan="8">${emptyState('No cases found')}</td></tr>`}
              </tbody>
            </table>
          `)}
        </div>
      `)}
    </div>
  `;
}

// ─── Detail Modal ────────────────────────────────────────────────────────────

export function showCaseDetail(id) {
  const c = CASE_REPORTS.find(item => item.id === id);
  if (!c) return;

  openModal(
    `Case ${c.id} — ${c.patient}`,
    `
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <div><p class="text-xs text-slate-500">Patient</p><p class="font-medium">${c.patient}</p></div>
          <div><p class="text-xs text-slate-500">Age</p><p class="font-medium">${c.age}</p></div>
          <div><p class="text-xs text-slate-500">Disease</p><p class="font-medium">${c.disease}</p></div>
          <div><p class="text-xs text-slate-500">Barangay</p><p class="font-medium">${c.barangay}</p></div>
          <div><p class="text-xs text-slate-500">Date Reported</p><p class="font-medium">${c.dateReported}</p></div>
          <div><p class="text-xs text-slate-500">Reported By</p><p class="font-medium">${c.reportedBy}</p></div>
          <div><p class="text-xs text-slate-500">Severity</p>${badge(c.severity)}</div>
          <div><p class="text-xs text-slate-500">Status</p>${badge(c.status)}</div>
        </div>
        <div><p class="text-xs text-slate-500 mb-1">Symptoms</p><p class="text-sm">${c.symptoms}</p></div>
        <div><p class="text-xs text-slate-500 mb-1">Diagnosis</p><p class="text-sm">${c.diagnosis}</p></div>
        ${c.status === 'Suspected' ? `
        <div class="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
          <p class="text-sm font-medium text-yellow-700 dark:text-yellow-400">Awaiting Confirmation</p>
          <p class="text-xs text-yellow-600 dark:text-yellow-300 mt-1">Review case details and confirm or update status.</p>
        </div>` : ''}
      </div>
    `,
    `<button data-action="close-modal" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">Close</button>
     ${c.status === 'Suspected' ? btnSuccess('Confirm Case', 'confirm-case') + btnDanger('Mark Negative', 'reject-case') : ''}
     <button data-action="update-case-status" data-id="${c.id}" class="px-4 py-2 rounded-lg bg-gov-600 text-white hover:bg-gov-700">Update Status</button>`
  );
}

// ─── Report Case Modal ───────────────────────────────────────────────────────

export function showReportCaseModal() {
  openModal(
    'Report New Case',
    `
      <form class="space-y-4" onsubmit="return false">
        <div><label class="block text-sm font-medium mb-1">Patient</label>
          <select class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
            ${DATA.patients.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
          </select></div>
        <div><label class="block text-sm font-medium mb-1">Disease/Condition</label><input type="text" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" placeholder="e.g. Dengue Fever"></div>
        <div><label class="block text-sm font-medium mb-1">Symptoms</label><textarea rows="2" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm resize-none" placeholder="Describe symptoms..."></textarea></div>
        <div><label class="block text-sm font-medium mb-1">Diagnosis</label><input type="text" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" placeholder="e.g. NS1 Positive"></div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="block text-sm font-medium mb-1">Barangay</label>
            <select class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
              <option>San Jose</option><option>Poblacion</option><option>Riverside</option>
            </select></div>
          <div><label class="block text-sm font-medium mb-1">Severity</label>
            <select class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
              <option>Low</option><option>Moderate</option><option>High</option><option>Critical</option>
            </select></div>
        </div>
      </form>
    `,
    `<button data-action="close-modal" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600">Cancel</button>
     <button data-action="confirm-report-case" class="px-4 py-2 rounded-lg bg-gov-600 text-white hover:bg-gov-700">Submit Report</button>`
  );
}