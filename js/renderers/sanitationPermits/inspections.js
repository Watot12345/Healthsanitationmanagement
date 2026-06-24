import { card, icon, renderList, badge, filterData, searchInput, btnPrimary, tableWrap, emptyState, btnSuccess, btnDanger, btnSecondary } from '../../utils/dom.js';
import { openModal } from '../../utils/modal.js';
import { DATA } from '../../data.js';

// ─── Fake Data ──────────────────────────────────────────────────────────────

const INSPECTIONS = [
  { id: 'INS-001', permit: 'APP-001', applicant: 'ABC Restaurant', date: '2026-06-25', time: '10:00 AM', inspector: 'Juan Dela Cruz', status: 'Scheduled', checklist: 3, violations: 0 },
  { id: 'INS-002', permit: 'APP-002', applicant: 'Green Market Stall', date: '2026-06-26', time: '02:00 PM', inspector: 'Ana Reyes', status: 'Completed', checklist: 5, violations: 2 },
  { id: 'INS-003', permit: 'APP-003', applicant: 'Fresh Bakes Co.', date: '2026-06-27', time: '09:00 AM', inspector: 'Unassigned', status: 'Pending', checklist: 0, violations: 0 },
];

const checklistItems = [
  'Sanitation standards met',
  'Food handling area clean',
  'Waste disposal compliant',
  'Water supply adequate',
  'Pest control verified',
];

// ─── View ────────────────────────────────────────────────────────────────────

export function renderInspections(filter = '') {
  const filtered = filterData(INSPECTIONS, filter, ['applicant', 'inspector', 'status', 'permit']);

  return `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row gap-3 justify-between">
        ${searchInput('inspection-search', 'Search by applicant, inspector, status...')}
        ${btnPrimary('+ Schedule Inspection', 'schedule-inspection')}
      </div>

      ${card(`
        <div class="ui-card-body">
          <h3 class="ui-section-title mb-4">Inspections</h3>
          ${tableWrap(`
            <table class="w-full text-left">
              <thead class="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">ID</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Permit</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Applicant</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Date</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Inspector</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Status</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Violations</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                ${filtered.length ? renderList(filtered, i => `
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td class="px-4 py-3 text-sm font-mono">${i.id}</td>
                    <td class="px-4 py-3 text-sm font-mono">${i.permit}</td>
                    <td class="px-4 py-3 text-sm font-medium">${i.applicant}</td>
                    <td class="px-4 py-3 text-sm text-slate-500">${i.date} ${i.time}</td>
                    <td class="px-4 py-3 text-sm">${i.inspector}</td>
                    <td class="px-4 py-3 text-sm">${badge(i.status)}</td>
                    <td class="px-4 py-3 text-sm">${i.violations > 0 ? `<span class="text-red-600 font-medium">${i.violations}</span>` : '<span class="text-green-600">0</span>'}</td>
                    <td class="px-4 py-3 text-sm">
                      <div class="flex gap-1">
                        <button data-action="view-inspection" data-id="${i.id}" class="px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">View</button>
                      </div>
                    </td>
                  </tr>
                `) : `<tr><td colspan="8">${emptyState('No inspections found')}</td></tr>`}
              </tbody>
            </table>
          `)}
        </div>
      `)}
    </div>
  `;
}

// ─── Detail Modal ────────────────────────────────────────────────────────────

export function showInspectionDetail(id) {
  const i = INSPECTIONS.find(item => item.id === id);
  if (!i) return;

  openModal(
    `Inspection ${i.id} — ${i.applicant}`,
    `
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <div><p class="text-xs text-slate-500">Permit</p><p class="font-medium">${i.permit}</p></div>
          <div><p class="text-xs text-slate-500">Applicant</p><p class="font-medium">${i.applicant}</p></div>
          <div><p class="text-xs text-slate-500">Date</p><p class="font-medium">${i.date}</p></div>
          <div><p class="text-xs text-slate-500">Time</p><p class="font-medium">${i.time}</p></div>
          <div><p class="text-xs text-slate-500">Inspector</p><p class="font-medium">${i.inspector}</p></div>
          <div><p class="text-xs text-slate-500">Status</p>${badge(i.status)}</div>
        </div>

        <div>
          <p class="text-xs text-slate-500 uppercase tracking-wider mb-2 font-semibold">Inspection Checklist</p>
          <div class="space-y-2">
            ${checklistItems.map((item, idx) => `
              <label class="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer">
                <input type="checkbox" ${idx < i.checklist ? 'checked' : ''} class="rounded text-gov-600 focus:ring-gov-500">
                <span class="text-sm">${item}</span>
              </label>
            `).join('')}
          </div>
        </div>

        <div>
          <p class="text-xs text-slate-500 uppercase tracking-wider mb-2 font-semibold">Notes</p>
          <textarea rows="3" placeholder="Add inspection notes..." class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm resize-none">${i.status === 'Completed' ? 'Inspection completed. Minor issues found in waste disposal.' : ''}</textarea>
        </div>

        <div>
          <p class="text-xs text-slate-500 uppercase tracking-wider mb-2 font-semibold">Photo/Document Upload</p>
          <div class="border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl p-4 text-center cursor-pointer" data-action="upload-photo">
            <svg class="h-6 w-6 mx-auto text-slate-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
            <p class="text-sm text-slate-500">Upload inspection photos</p>
          </div>
        </div>

        ${i.violations > 0 ? `
        <div>
          <p class="text-xs text-slate-500 uppercase tracking-wider mb-2 font-semibold text-red-600">Violations (${i.violations})</p>
          <div class="space-y-2">
            <div class="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p class="text-sm font-medium text-red-700 dark:text-red-400">Improper waste segregation</p>
            </div>
            <div class="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p class="text-sm font-medium text-red-700 dark:text-red-400">No covered trash bins</p>
            </div>
          </div>
        </div>` : ''}
      </div>
    `,
    `<button data-action="close-modal" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600">Close</button>
     ${btnDanger('Mark Failed', 'fail-inspection')}
     ${btnSuccess('Mark Passed', 'pass-inspection')}
     <button data-action="record-violation" class="px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700">Record Violation</button>`
  );
}