import { card, icon, renderList, badge, filterData, searchInput, btnPrimary, tableWrap, emptyState, btnSecondary, btnDanger } from '../../utils/dom.js';
import { openModal } from '../../utils/modal.js';

// ─── Fake Data ──────────────────────────────────────────────────────────────

const MAINTENANCE_SCHEDULES = [
  { id: 'SCH-001', owner: 'Pedro Garcia', address: '123 Rizal St., San Jose', type: 'Desludging', scheduledDate: '2026-07-15', technician: 'Roberto Silva', status: 'Scheduled', zone: 'San Jose', priority: 'Medium' },
  { id: 'SCH-002', owner: 'ABC Restaurant', address: '456 Mabini Ave., Poblacion', type: 'Inspection', scheduledDate: '2026-06-28', technician: 'Jose Mendoza', status: 'Scheduled', zone: 'Poblacion', priority: 'High' },
  { id: 'SCH-003', owner: 'Carlos Lim', address: '234 Rizal St., Riverside', type: 'Desludging', scheduledDate: '2026-06-20', technician: 'Luis Torres', status: 'Overdue', zone: 'Riverside', priority: 'Critical' },
  { id: 'SCH-004', owner: 'Green Market Stall', address: '789 Bonifacio Rd., San Jose', type: 'Cleaning', scheduledDate: '2026-07-20', technician: 'Roberto Silva', status: 'Scheduled', zone: 'San Jose', priority: 'Low' },
  { id: 'SCH-005', owner: 'Fresh Bakes Co.', address: '567 Mabini Ave., Poblacion', type: 'Desludging', scheduledDate: '2026-07-01', technician: 'Jose Mendoza', status: 'Completed', zone: 'Poblacion', priority: 'Medium' },
];

// ─── View ────────────────────────────────────────────────────────────────────

export function renderMaintenanceSchedule(filter = '') {
  const filtered = filterData(MAINTENANCE_SCHEDULES, filter, ['owner', 'address', 'type', 'zone', 'status']);

  return `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row gap-3 justify-between">
        ${searchInput('schedule-search', 'Search by owner, zone, type...')}
        ${btnPrimary('+ Create Schedule', 'create-schedule')}
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          ${card(`
            <div class="p-5">
              <h3 class="font-semibold mb-4">Maintenance Calendar</h3>
              <div id="maintenance-calendar" style="min-height: 400px;"></div>
            </div>
          `)}
        </div>
        <div>
          ${card(`
            <div class="p-5">
              <h3 class="font-semibold mb-4">Service Queue</h3>
              <div class="space-y-2">
                ${filtered.filter(s => s.status !== 'Completed').sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate)).slice(0, 5).map(s => `
                  <div class="flex items-center justify-between p-2 rounded-lg ${s.status === 'Overdue' ? 'bg-red-50 dark:bg-red-900/20' : 'bg-slate-50 dark:bg-slate-700/50'}">
                    <div>
                      <p class="text-sm font-medium">${s.owner}</p>
                      <p class="text-xs text-slate-500">${s.type} · ${s.scheduledDate}</p>
                    </div>
                    ${badge(s.priority)}
                  </div>
                `).join('')}
              </div>
            </div>
          `)}
        </div>
      </div>

      ${card(`
        <div class="ui-card-body">
          <h3 class="ui-section-title mb-4">All Schedules</h3>
          ${tableWrap(`
            <table class="w-full text-left">
              <thead class="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">ID</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Owner</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Zone</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Type</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Date</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Technician</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Status</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                ${filtered.length ? renderList(filtered, s => `
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${s.status === 'Overdue' ? 'bg-red-50 dark:bg-red-900/10' : ''}">
                    <td class="px-4 py-3 text-sm font-mono">${s.id}</td>
                    <td class="px-4 py-3 text-sm font-medium">${s.owner}</td>
                    <td class="px-4 py-3 text-sm text-slate-500">${s.zone}</td>
                    <td class="px-4 py-3 text-sm">${s.type}</td>
                    <td class="px-4 py-3 text-sm text-slate-500">${s.scheduledDate}</td>
                    <td class="px-4 py-3 text-sm">${s.technician}</td>
                    <td class="px-4 py-3 text-sm">${badge(s.status)}</td>
                    <td class="px-4 py-3 text-sm">
                      <div class="flex gap-1">
                        <button data-action="reschedule-maintenance" data-id="${s.id}" class="px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">Reschedule</button>
                      </div>
                    </td>
                  </tr>
                `) : `<tr><td colspan="8">${emptyState('No schedules found')}</td></tr>`}
              </tbody>
            </table>
          `)}
        </div>
      `)}
    </div>
  `;
}

// ─── Initialize Calendar ─────────────────────────────────────────────────────

export function initMaintenanceCalendar() {
  const el = document.getElementById('maintenance-calendar');
  if (!el) return;

  const events = MAINTENANCE_SCHEDULES.map(s => ({
    title: `${s.type} — ${s.owner}`,
    start: s.scheduledDate,
    backgroundColor: s.status === 'Overdue' ? '#ef4444' : s.status === 'Completed' ? '#22c55e' : '#3b82f6',
    borderColor: s.status === 'Overdue' ? '#dc2626' : s.status === 'Completed' ? '#16a34a' : '#2563eb',
    extendedProps: { id: s.id, technician: s.technician, zone: s.zone, priority: s.priority },
  }));

  new FullCalendar.Calendar(el, {
    initialView: 'dayGridMonth',
    height: 'auto',
    headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,listWeek' },
    events,
    eventClick: (info) => showToast(`${info.event.title} — ${info.event.extendedProps.technician}`, 'info'),
  }).render();
}

// ─── Create Schedule Modal ───────────────────────────────────────────────────

export function showCreateSchedule() {
  openModal(
    'Create Maintenance Schedule',
    `
      <form class="space-y-4" onsubmit="return false">
        <div><label class="block text-sm font-medium mb-1">Owner/Household</label><input type="text" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"></div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="block text-sm font-medium mb-1">Service Type</label>
            <select class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
              <option>Desludging</option><option>Inspection</option><option>Cleaning</option><option>Repair</option>
            </select></div>
          <div><label class="block text-sm font-medium mb-1">Zone</label>
            <select class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
              <option>San Jose</option><option>Poblacion</option><option>Riverside</option>
            </select></div>
        </div>
        <div><label class="block text-sm font-medium mb-1">Scheduled Date</label><input type="date" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"></div>
        <div><label class="block text-sm font-medium mb-1">Assign Technician</label>
          <select class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
            <option>Roberto Silva</option><option>Jose Mendoza</option><option>Luis Torres</option>
          </select></div>
      </form>
    `,
    `<button data-action="close-modal" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600">Cancel</button>
     <button data-action="confirm-create-schedule" class="px-4 py-2 rounded-lg bg-gov-600 text-white hover:bg-gov-700">Create Schedule</button>`
  );
}

// ─── Reschedule Modal ────────────────────────────────────────────────────────

export function showReschedule(id) {
  const s = MAINTENANCE_SCHEDULES.find(item => item.id === id);
  if (!s) return;

  openModal(
    `Reschedule — ${s.owner}`,
    `
      <form class="space-y-4" onsubmit="return false">
        <p class="text-sm text-slate-500">Current: ${s.type} on ${s.scheduledDate} (${s.technician})</p>
        <div><label class="block text-sm font-medium mb-1">New Date</label><input type="date" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"></div>
        <div><label class="block text-sm font-medium mb-1">Reason</label><textarea rows="2" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm resize-none"></textarea></div>
      </form>
    `,
    `<button data-action="close-modal" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600">Cancel</button>
     <button data-action="confirm-reschedule" class="px-4 py-2 rounded-lg bg-gov-600 text-white hover:bg-gov-700">Confirm Reschedule</button>`
  );
}