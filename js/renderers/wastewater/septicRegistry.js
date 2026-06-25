import { card, icon, renderList, badge, filterData, searchInput, btnPrimary, tableWrap, emptyState, btnSecondary, btnDanger } from '../../utils/dom.js';
import { openModal } from '../../utils/modal.js';

// ─── Fake Data ──────────────────────────────────────────────────────────────

const SEPTIC_REGISTRY = [
  { id: 'SEP-001', owner: 'Pedro Garcia', address: '123 Rizal St., San Jose', type: 'Concrete Septic Tank', installDate: '2018-03-15', lastDesludging: '2025-06-10', capacity: '2000 L', household: 4, status: 'Active', nextSchedule: '2026-12-10' },
  { id: 'SEP-002', owner: 'ABC Restaurant', address: '456 Mabini Ave., Poblacion', type: 'Commercial Septic System', installDate: '2015-01-20', lastDesludging: '2025-01-15', capacity: '5000 L', household: 20, status: 'Needs Service', nextSchedule: '2026-01-15' },
  { id: 'SEP-003', owner: 'Green Market Stall', address: '789 Bonifacio Rd., San Jose', type: 'Plastic Septic Tank', installDate: '2020-06-01', lastDesludging: '2025-08-20', capacity: '1500 L', household: 2, status: 'Active', nextSchedule: '2027-02-20' },
  { id: 'SEP-004', owner: 'Carlos Lim', address: '234 Rizal St., Riverside', type: 'Concrete Septic Tank', installDate: '2010-11-10', lastDesludging: '2022-03-05', capacity: '2000 L', household: 5, status: 'Critical', nextSchedule: '2025-03-05' },
  { id: 'SEP-005', owner: 'Fresh Bakes Co.', address: '567 Mabini Ave., Poblacion', type: 'Commercial Septic System', installDate: '2019-09-15', lastDesludging: '2024-12-01', capacity: '4000 L', household: 15, status: 'Active', nextSchedule: '2026-06-01' },
];

// ─── View ────────────────────────────────────────────────────────────────────

export function renderSepticRegistry(filter = '') {
  const filtered = filterData(SEPTIC_REGISTRY, filter, ['owner', 'address', 'type', 'status']);

  return `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row gap-3 justify-between">
        ${searchInput('septic-search', 'Search by owner, address, type...')}
        ${btnPrimary('+ Register Septic System', 'register-septic')}
      </div>

      ${card(`
        <div class="ui-card-body">
          <h3 class="ui-section-title mb-4">Septic Tank Registry</h3>
          ${tableWrap(`
            <table class="w-full text-left">
              <thead class="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">ID</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Owner</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Address</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Type</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Last Desludging</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Status</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                ${filtered.length ? renderList(filtered, s => `
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${s.status === 'Critical' ? 'bg-red-50 dark:bg-red-900/10' : ''}">
                    <td class="px-4 py-3 text-sm font-mono">${s.id}</td>
                    <td class="px-4 py-3 text-sm font-medium">${s.owner}</td>
                    <td class="px-4 py-3 text-sm text-slate-500">${s.address}</td>
                    <td class="px-4 py-3 text-sm">${s.type}</td>
                    <td class="px-4 py-3 text-sm text-slate-500">${s.lastDesludging}</td>
                    <td class="px-4 py-3 text-sm">${badge(s.status)}</td>
                    <td class="px-4 py-3 text-sm">
                      <div class="flex gap-1">
                        <button data-action="view-septic" data-id="${s.id}" class="px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">View</button>
                        <button data-action="edit-septic" data-id="${s.id}" class="px-2 py-1 text-xs rounded bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400">Edit</button>
                        <button data-action="schedule-septic" data-id="${s.id}" class="px-2 py-1 text-xs rounded bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400">Schedule</button>
                      </div>
                    </td>
                  </tr>
                `) : `<tr><td colspan="7">${emptyState('No records found')}</td></tr>`}
              </tbody>
            </table>
          `)}
        </div>
      `)}
    </div>
  `;
}

// ─── Detail Modal ────────────────────────────────────────────────────────────

export function showSepticDetail(id) {
  const s = SEPTIC_REGISTRY.find(item => item.id === id);
  if (!s) return;

  openModal(
    `${s.owner} — ${s.id}`,
    `
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <div><p class="text-xs text-slate-500">Owner</p><p class="font-medium">${s.owner}</p></div>
          <div><p class="text-xs text-slate-500">Status</p>${badge(s.status)}</div>
          <div><p class="text-xs text-slate-500">Address</p><p class="font-medium">${s.address}</p></div>
          <div><p class="text-xs text-slate-500">Tank Type</p><p class="font-medium">${s.type}</p></div>
          <div><p class="text-xs text-slate-500">Capacity</p><p class="font-medium">${s.capacity}</p></div>
          <div><p class="text-xs text-slate-500">Household Size</p><p class="font-medium">${s.household} persons</p></div>
          <div><p class="text-xs text-slate-500">Installation Date</p><p class="font-medium">${s.installDate}</p></div>
          <div><p class="text-xs text-slate-500">Last Desludging</p><p class="font-medium">${s.lastDesludging}</p></div>
          <div><p class="text-xs text-slate-500">Next Scheduled</p><p class="font-medium">${s.nextSchedule}</p></div>
        </div>
        ${s.status === 'Critical' ? `
        <div class="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p class="text-sm font-medium text-red-700 dark:text-red-400">⚠ Critical Status</p>
          <p class="text-xs text-red-600 dark:text-red-300 mt-1">Overdue for desludging by ${Math.floor((new Date() - new Date(s.nextSchedule)) / (1000 * 60 * 60 * 24))} days. Immediate action required.</p>
        </div>` : ''}
      </div>
    `,
    `<button data-action="close-modal" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">Close</button>
     <button data-action="edit-septic" data-id="${s.id}" class="px-4 py-2 rounded-lg bg-gov-600 text-white hover:bg-gov-700">Update Record</button>
     <button data-action="schedule-septic" data-id="${s.id}" class="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700">Schedule Maintenance</button>`
  );
}

// ─── Register Modal ──────────────────────────────────────────────────────────

export function showRegisterSeptic() {
  openModal(
    'Register Septic System',
    `
      <form class="space-y-4" onsubmit="return false">
        <div><label class="block text-sm font-medium mb-1">Owner Name</label><input type="text" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"></div>
        <div><label class="block text-sm font-medium mb-1">Address</label><input type="text" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"></div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="block text-sm font-medium mb-1">Tank Type</label>
            <select class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
              <option>Concrete Septic Tank</option><option>Plastic Septic Tank</option><option>Commercial Septic System</option>
            </select></div>
          <div><label class="block text-sm font-medium mb-1">Capacity (L)</label><input type="number" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"></div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="block text-sm font-medium mb-1">Installation Date</label><input type="date" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"></div>
          <div><label class="block text-sm font-medium mb-1">Household Size</label><input type="number" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"></div>
        </div>
      </form>
    `,
    `<button data-action="close-modal" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600">Cancel</button>
     <button data-action="confirm-register-septic" class="px-4 py-2 rounded-lg bg-gov-600 text-white hover:bg-gov-700">Register System</button>`
  );
}

// ─── Schedule Modal ──────────────────────────────────────────────────────────

export function showScheduleSeptic(id) {
  const s = SEPTIC_REGISTRY.find(item => item.id === id);
  if (!s) return;

  openModal(
    `Schedule Maintenance — ${s.owner}`,
    `
      <form class="space-y-4" onsubmit="return false">
        <div><p class="text-sm text-slate-500">Septic System: <span class="font-medium">${s.id} — ${s.type}</span></p></div>
        <div><label class="block text-sm font-medium mb-1">Service Type</label>
          <select class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
            <option>Desludging</option><option>Inspection</option><option>Repair</option><option>Cleaning</option>
          </select></div>
        <div><label class="block text-sm font-medium mb-1">Scheduled Date</label><input type="date" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"></div>
        <div><label class="block text-sm font-medium mb-1">Assigned Technician</label>
          <select class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
            <option>Roberto Silva</option><option>Jose Mendoza</option><option>Luis Torres</option>
          </select></div>
      </form>
    `,
    `<button data-action="close-modal" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600">Cancel</button>
     <button data-action="confirm-schedule-septic" class="px-4 py-2 rounded-lg bg-gov-600 text-white hover:bg-gov-700">Confirm Schedule</button>`
  );
}