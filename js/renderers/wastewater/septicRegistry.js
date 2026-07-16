import { card, icon, renderList, badge, filterData, searchInput, btnPrimary, tableWrap, emptyState, btnSecondary, btnDanger } from '../../utils/dom.js';
import { openModal } from '../../utils/modal.js';
import { DATA } from '../../data.js';
import { getSearchValue } from '../../utils/search.js';

// ─── View ────────────────────────────────────────────────────────────────────

export function renderSepticRegistry() {
  const filter = (window.state?.searchFilters?.['septic-search']) || getSearchValue('septic-search') || '';
  const systems = DATA.septicMaintenance || []; // ✅ CHANGED
  const filtered = filterData(systems, filter, ['owner', 'address', 'type', 'status']);
  const userRole = window.state?.role || 'employee';

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
                    <td class="px-4 py-3 text-sm text-slate-500">${s.lastDesludging || 'N/A'}</td>
                    <td class="px-4 py-3 text-sm">${badge(s.status)}</td>
                    <td class="px-4 py-3 text-sm">
                      <div class="flex gap-1">
                        <button data-action="view-septic" data-id="${s.id}" class="px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">👁️ View</button>
                        <button data-action="schedule-septic" data-id="${s.id}" class="px-2 py-1 text-xs rounded bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400">📅 Schedule</button>
                        ${userRole === 'admin' ? `
                        <button data-action="delete-septic" data-id="${s.id}" class="px-2 py-1 text-xs rounded bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800">🗑️</button>
                        ` : ''}
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
  const systems = DATA.septicMaintenance || []; // ✅ CHANGED
  const s = systems.find(item => item.id == id);
  if (!s) return;
  
  const userRole = window.state?.role || 'employee';

  openModal(
    `${s.owner} — ${s.id}`,
    `
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <div><p class="text-xs text-slate-500">Owner</p><p class="font-medium">${s.owner}</p></div>
          <div><p class="text-xs text-slate-500">Status</p>${badge(s.status)}</div>
          <div><p class="text-xs text-slate-500">Address</p><p class="font-medium">${s.address}</p></div>
          <div><p class="text-xs text-slate-500">Tank Type</p><p class="font-medium">${s.type}</p></div>
          <div><p class="text-xs text-slate-500">Capacity</p><p class="font-medium">${s.capacity || 'N/A'}</p></div>
          <div><p class="text-xs text-slate-500">Household Size</p><p class="font-medium">${s.household || 0} persons</p></div>
          <div><p class="text-xs text-slate-500">Installation Date</p><p class="font-medium">${s.installDate || 'N/A'}</p></div>
          <div><p class="text-xs text-slate-500">Last Desludging</p><p class="font-medium">${s.lastDesludging || 'N/A'}</p></div>
          <div><p class="text-xs text-slate-500">Next Scheduled</p><p class="font-medium">${s.nextSchedule || 'Not scheduled'}</p></div>
        </div>
        ${s.status === 'Critical' ? `
        <div class="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p class="text-sm font-medium text-red-700 dark:text-red-400">⚠ Critical Status</p>
          <p class="text-xs text-red-600 dark:text-red-300 mt-1">Overdue for desludging. Immediate action required.</p>
        </div>` : ''}
      </div>
    `,
    `<button data-action="close-modal" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">Close</button>
     <button data-action="edit-septic" data-id="${s.id}" class="px-4 py-2 rounded-lg bg-gov-600 text-white hover:bg-gov-700">✏️ Edit</button>
     ${userRole === 'admin' ? `
     <button data-action="delete-septic" data-id="${s.id}" class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">🗑️ Delete</button>
     ` : ''}`
  );
}

// ─── Register Modal ──────────────────────────────────────────────────────────
export function showRegisterSeptic() {
  const today = new Date().toISOString().split('T')[0];

  openModal(
    'Register Septic System',
    `
      <form class="space-y-4" onsubmit="return false">
        <div>
          <label class="block text-sm font-medium mb-1">Owner Name <span class="text-red-500">*</span></label>
          <input id="septic-owner" type="text" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" required>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Address</label>
          <input id="septic-address" type="text" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium mb-1">Tank Type</label>
            <select id="septic-type" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
              <option>Concrete Septic Tank</option>
              <option>Plastic Septic Tank</option>
              <option>Commercial Septic System</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Zone</label>
            <select id="septic-zone" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
              <option>San Jose</option>
              <option>Poblacion</option>
              <option>Riverside</option>
            </select>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium mb-1">Capacity (L)</label>
            <input id="septic-capacity" type="number" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" placeholder="e.g., 2000">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Priority</label>
            <select id="septic-priority" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium mb-1">Installation Date</label>
            <input id="septic-install" type="date" value="${today}" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Household Size</label>
            <input id="septic-household" type="number" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" placeholder="Number of persons">
          </div>
        </div>
      </form>
    `,
    `<button data-action="close-modal" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600">Cancel</button>
     <button data-action="confirm-register-septic" class="px-4 py-2 rounded-lg bg-gov-600 text-white hover:bg-gov-700">Register System</button>`
  );
}

// ─── Schedule Modal ──────────────────────────────────────────────────────────

export function showScheduleSeptic(id) {
  const systems = DATA.septicMaintenance || []; // ✅ CHANGED
  const s = systems.find(item => item.id == id);
  if (!s) return;
  
  const today = new Date().toISOString().split('T')[0];

  openModal(
    `Schedule Maintenance — ${s.owner}`,
    `
      <form class="space-y-4" onsubmit="return false">
        <div><p class="text-sm text-slate-500">Septic System: <span class="font-medium">${s.id} — ${s.type}</span></p></div>
        <div>
          <label class="block text-sm font-medium mb-1">Service Type</label>
          <select id="sched-service-type" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
            <option>Desludging</option><option>Inspection</option><option>Repair</option><option>Cleaning</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Scheduled Date</label>
          <input id="sched-date" type="date" value="${today}" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Assigned Technician</label>
          <select id="sched-tech" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
            <option>Roberto Silva</option><option>Jose Mendoza</option><option>Luis Torres</option>
          </select>
        </div>
      </form>
    `,
    `<button data-action="close-modal" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600">Cancel</button>
     <button data-action="confirm-schedule-septic" data-id="${s.id}" class="px-4 py-2 rounded-lg bg-gov-600 text-white hover:bg-gov-700">Confirm Schedule</button>`
  );
}