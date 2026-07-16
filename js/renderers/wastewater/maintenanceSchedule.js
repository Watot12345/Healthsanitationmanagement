import { card, icon, renderList, badge, filterData, searchInput, btnPrimary, tableWrap, emptyState, btnSecondary, btnDanger } from '../../utils/dom.js';
import { openModal } from '../../utils/modal.js';
import { DATA } from '../../data.js';
import { getSearchValue } from '../../utils/search.js';

// ─── View ────────────────────────────────────────────────────────────────────

export function renderMaintenanceSchedule() {
  const filter = (window.state?.searchFilters?.['schedule-search']) || getSearchValue('schedule-search') || '';
 const schedules = (DATA.septicMaintenance || []).filter(s => s.scheduledDate || s.nextSchedule);
  const filtered = filterData(schedules, filter, ['owner', 'address', 'type', 'zone', 'status']);

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
                ${filtered.filter(s => s.scheduledDate || s.nextSchedule).sort((a, b) => new Date(a.scheduledDate || a.nextSchedule) - new Date(b.scheduledDate || b.nextSchedule)).slice(0, 5).map(s => `
                  <div class="flex items-center justify-between p-2 rounded-lg ${s.status === 'Overdue' ? 'bg-red-50 dark:bg-red-900/20' : 'bg-slate-50 dark:bg-slate-700/50'}">
                    <div>
                      <p class="text-sm font-medium">${s.owner}</p>
                      <p class="text-xs text-slate-500">${s.serviceType || s.type || 'N/A'} · ${s.scheduledDate || s.nextSchedule || 'Not set'}</p>
                    </div>
                    ${badge(s.priority || 'Medium')}
                  </div>
                `).join('')}
                ${filtered.filter(s => s.scheduledDate || s.nextSchedule).length === 0 ? '<p class="text-sm text-slate-500 text-center py-4">No upcoming services</p>' : ''}
              </div>
            </div>
          `)}
        </div>
      </div>

      ${card(`
        <div class="ui-card-body">
          <h3 class="ui-section-title mb-4">All Records</h3>
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
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${s.status === 'Overdue' || s.status === 'Critical' ? 'bg-red-50 dark:bg-red-900/10' : ''}">
                    <td class="px-4 py-3 text-sm font-mono">${s.id}</td>
                    <td class="px-4 py-3 text-sm font-medium">${s.owner}</td>
                    <td class="px-4 py-3 text-sm text-slate-500">${s.zone || 'N/A'}</td>
                    <td class="px-4 py-3 text-sm">${s.serviceType || s.type || 'N/A'}</td>
                    <td class="px-4 py-3 text-sm text-slate-500">${s.scheduledDate || s.nextSchedule || 'Not scheduled'}</td>
                    <td class="px-4 py-3 text-sm">${s.technician || 'Unassigned'}</td>
                    <td class="px-4 py-3 text-sm">${badge(s.status || 'Active')}</td>
                    <td class="px-4 py-3 text-sm">
                      <div class="flex gap-1">
                        ${s.scheduledDate || s.nextSchedule ? `
                        <button data-action="reschedule-maintenance" data-id="${s.id}" class="px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">📅 Reschedule</button>
                        ` : ''}
                        <button data-action="delete-schedule" data-id="${s.id}" class="px-2 py-1 text-xs rounded bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800">🗑️</button>
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

// ─── Initialize Calendar ─────────────────────────────────────────────────────

export function initMaintenanceCalendar() {
  const el = document.getElementById('maintenance-calendar');
  if (!el) return;

  const schedules = DATA.septicMaintenance || [];
  
  // Only show events that have dates
  const events = schedules
    .filter(s => s.scheduledDate || s.nextSchedule)
    .map(s => ({
      title: `${s.serviceType || s.type} — ${s.owner}`,
      start: s.scheduledDate || s.nextSchedule,
      backgroundColor: s.status === 'Overdue' ? '#ef4444' : s.status === 'Completed' ? '#22c55e' : '#3b82f6',
      borderColor: s.status === 'Overdue' ? '#dc2626' : s.status === 'Completed' ? '#16a34a' : '#2563eb',
      extendedProps: { id: s.id, technician: s.technician, zone: s.zone, priority: s.priority },
    }));

  if (typeof FullCalendar !== 'undefined') {
    new FullCalendar.Calendar(el, {
      initialView: 'dayGridMonth',
      height: 'auto',
      headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,listWeek' },
      events,
      eventClick: (info) => showToast(`${info.event.title} — ${info.event.extendedProps.technician || 'Unassigned'}`, 'info'),
    }).render();
  }
}

// ─── Create Schedule Modal ───────────────────────────────────────────────────

export function showCreateSchedule() {
  const today = new Date().toISOString().split('T')[0];

  openModal(
    'Create Maintenance Schedule',
    `
      <form class="space-y-4" onsubmit="return false">
        <div>
          <label class="block text-sm font-medium mb-1">Owner/Household <span class="text-red-500">*</span></label>
          <input id="maint-owner" type="text" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" required>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Address</label>
          <input id="maint-address" type="text" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium mb-1">Service Type</label>
            <select id="maint-type" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
              <option>Desludging</option><option>Inspection</option><option>Cleaning</option><option>Repair</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Zone</label>
            <select id="maint-zone" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
              <option>San Jose</option><option>Poblacion</option><option>Riverside</option>
            </select>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium mb-1">Scheduled Date</label>
            <input id="maint-date" type="date" value="${today}" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Priority</label>
            <select id="maint-priority" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
              <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
            </select>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Assign Technician</label>
          <select id="maint-tech" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
            <option>Roberto Silva</option><option>Jose Mendoza</option><option>Luis Torres</option>
          </select>
        </div>
      </form>
    `,
    `<button data-action="close-modal" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600">Cancel</button>
     <button data-action="confirm-create-schedule" class="px-4 py-2 rounded-lg bg-gov-600 text-white hover:bg-gov-700">Create Schedule</button>`
  );
}

// ─── Reschedule Modal ────────────────────────────────────────────────────────

export function showReschedule(id) {
  const schedules = DATA.septicMaintenance || [];
  const s = schedules.find(item => item.id == id);
  if (!s) return;

  openModal(
    `Reschedule — ${s.owner}`,
    `
      <form class="space-y-4" onsubmit="return false">
        <p class="text-sm text-slate-500">Current: ${s.serviceType || s.type || 'N/A'} on ${s.scheduledDate || s.nextSchedule || 'N/A'} (${s.technician || 'Unassigned'})</p>
        <div>
          <label class="block text-sm font-medium mb-1">New Date</label>
          <input id="reschedule-date" type="date" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Reason</label>
          <textarea id="reschedule-reason" rows="2" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm resize-none"></textarea>
        </div>
      </form>
    `,
    `<button data-action="close-modal" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600">Cancel</button>
     <button data-action="confirm-reschedule" data-id="${id}" class="px-4 py-2 rounded-lg bg-gov-600 text-white hover:bg-gov-700">Confirm Reschedule</button>`
  );
}