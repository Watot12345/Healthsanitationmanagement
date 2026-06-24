import { card, icon, renderList, badge, filterData, searchInput, btnPrimary, tableWrap, emptyState, btnDanger, btnSecondary } from '../../utils/dom.js';
import { openModal } from '../../utils/modal.js';

// ─── Fake Data ──────────────────────────────────────────────────────────────

const VACCINATIONS = [
  { id: 'VAC-001', child: 'Sofia Garcia', vaccine: 'BCG', dose: 'Single', dateGiven: '2024-04-01', nextDue: '—', status: 'Completed' },
  { id: 'VAC-002', child: 'Sofia Garcia', vaccine: 'DPT', dose: '2nd Dose', dateGiven: '2025-06-15', nextDue: '2026-12-15', status: 'Completed' },
  { id: 'VAC-003', child: 'Sofia Garcia', vaccine: 'MMR', dose: '1st Dose', dateGiven: '—', nextDue: '2026-07-20', status: 'Overdue' },
  { id: 'VAC-004', child: 'Luis Mendoza', vaccine: 'BCG', dose: 'Single', dateGiven: '2025-02-01', nextDue: '—', status: 'Completed' },
  { id: 'VAC-005', child: 'Luis Mendoza', vaccine: 'Hepatitis B', dose: '2nd Dose', dateGiven: '—', nextDue: '2026-07-05', status: 'Scheduled' },
  { id: 'VAC-006', child: 'Noah Torres', vaccine: 'DPT', dose: '1st Dose', dateGiven: '—', nextDue: '2026-07-01', status: 'Scheduled' },
];

const vaccineTypes = ['BCG', 'DPT', 'Polio', 'MMR', 'Hepatitis B', 'Pentavalent', 'Rotavirus', 'Pneumococcal'];

// ─── View ────────────────────────────────────────────────────────────────────

export function renderVaccinationTracking(filter = '') {
  const filtered = filterData(VACCINATIONS, filter, ['child', 'vaccine', 'status']);

  return `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row gap-3 justify-between">
        ${searchInput('vaccine-search', 'Search by child, vaccine, status...')}
        ${btnPrimary('+ Record Vaccination', 'record-vaccination')}
      </div>

      ${card(`
        <div class="ui-card-body">
          <h3 class="ui-section-title mb-4">Vaccination Tracking</h3>
          ${tableWrap(`
            <table class="w-full text-left">
              <thead class="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">ID</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Child</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Vaccine</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Dose</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Date Given</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Next Due</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Status</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                ${filtered.length ? renderList(filtered, v => `
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${v.status === 'Overdue' ? 'bg-red-50 dark:bg-red-900/10' : ''}">
                    <td class="px-4 py-3 text-sm font-mono">${v.id}</td>
                    <td class="px-4 py-3 text-sm font-medium">${v.child}</td>
                    <td class="px-4 py-3 text-sm">${v.vaccine}</td>
                    <td class="px-4 py-3 text-sm">${v.dose}</td>
                    <td class="px-4 py-3 text-sm text-slate-500">${v.dateGiven}</td>
                    <td class="px-4 py-3 text-sm text-slate-500">${v.nextDue}</td>
                    <td class="px-4 py-3 text-sm">${badge(v.status)}</td>
                    <td class="px-4 py-3 text-sm">
                      <div class="flex gap-1">
                        <button data-action="update-vaccine" data-id="${v.id}" class="px-2 py-1 text-xs rounded bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400">Update</button>
                        ${v.status === 'Overdue' ? `<button data-action="flag-vaccine" data-id="${v.id}" class="px-2 py-1 text-xs rounded bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400">⚠ Flag</button>` : ''}
                      </div>
                    </td>
                  </tr>
                `) : `<tr><td colspan="8">${emptyState('No vaccination records found')}</td></tr>`}
              </tbody>
            </table>
          `)}
        </div>
      `)}
    </div>
  `;
}

// ─── Record Vaccination Modal ────────────────────────────────────────────────

export function showRecordVaccination() {
  openModal(
    'Record Vaccination',
    `
      <form class="space-y-4" onsubmit="return false">
        <div><label class="block text-sm font-medium mb-1">Child</label>
          <select class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
            <option>Sofia Garcia</option><option>Luis Mendoza</option><option>Emma Lim</option><option>Noah Torres</option>
          </select></div>
        <div><label class="block text-sm font-medium mb-1">Vaccine Type</label>
          <select class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
            ${vaccineTypes.map(v => `<option>${v}</option>`).join('')}
          </select></div>
        <div><label class="block text-sm font-medium mb-1">Dose</label>
          <select class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
            <option>1st Dose</option><option>2nd Dose</option><option>3rd Dose</option><option>Booster</option><option>Single</option>
          </select></div>
        <div><label class="block text-sm font-medium mb-1">Date Given</label><input type="date" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"></div>
        <div><label class="block text-sm font-medium mb-1">Next Dose Due</label><input type="date" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"></div>
      </form>
    `,
    `<button data-action="close-modal" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600">Cancel</button>
     <button data-action="confirm-vaccination" class="px-4 py-2 rounded-lg bg-gov-600 text-white hover:bg-gov-700">Save Record</button>`
  );
}

// ─── Update Vaccine Modal ────────────────────────────────────────────────────

export function showUpdateVaccine(id) {
  const v = VACCINATIONS.find(item => item.id === id);
  if (!v) return;

  openModal(
    `Update — ${v.child} (${v.vaccine})`,
    `
      <form class="space-y-4" onsubmit="return false">
        <div><label class="block text-sm font-medium mb-1">Status</label>
          <select class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
            <option ${v.status === 'Scheduled' ? 'selected' : ''}>Scheduled</option>
            <option ${v.status === 'Completed' ? 'selected' : ''}>Completed</option>
            <option ${v.status === 'Overdue' ? 'selected' : ''}>Overdue</option>
          </select></div>
        <div><label class="block text-sm font-medium mb-1">Date Given</label><input type="date" value="${v.dateGiven !== '—' ? v.dateGiven : ''}" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"></div>
        <div><label class="block text-sm font-medium mb-1">Next Dose Due</label><input type="date" value="${v.nextDue !== '—' ? v.nextDue : ''}" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"></div>
      </form>
    `,
    `<button data-action="close-modal" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600">Cancel</button>
     <button data-action="confirm-update-vaccine" class="px-4 py-2 rounded-lg bg-gov-600 text-white hover:bg-gov-700">Save Changes</button>`
  );
}