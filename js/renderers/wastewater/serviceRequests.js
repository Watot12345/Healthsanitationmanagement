import { card, icon, renderList, badge, filterData, searchInput, btnPrimary, tableWrap, emptyState, btnSuccess, btnDanger, btnSecondary } from '../../utils/dom.js';
import { openModal } from '../../utils/modal.js';

// ─── Fake Data ──────────────────────────────────────────────────────────────

const SERVICE_REQUESTS = [
  { id: 'SR-001', requester: 'Pedro Garcia', address: '123 Rizal St., San Jose', type: 'Desludging', dateRequested: '2026-06-20', status: 'Pending', priority: 'High', notes: 'Septic tank full, backyard flooding' },
  { id: 'SR-002', requester: 'ABC Hotel', address: '456 Mabini Ave., Poblacion', type: 'Inspection', dateRequested: '2026-06-21', status: 'Approved', priority: 'Critical', notes: 'Foul odor from drainage', scheduledDate: '2026-06-28' },
  { id: 'SR-003', requester: 'Carlos Lim', address: '234 Rizal St., Riverside', type: 'Desludging', dateRequested: '2026-06-22', status: 'Completed', priority: 'Medium', notes: 'Routine maintenance', scheduledDate: '2026-06-25', completedDate: '2026-06-25' },
  { id: 'SR-004', requester: 'Fresh Bakes Co.', address: '567 Mabini Ave., Poblacion', type: 'Inspection', dateRequested: '2026-06-23', status: 'Pending', priority: 'Low', notes: 'Annual compliance check' },
];

// ─── View ────────────────────────────────────────────────────────────────────

export function renderServiceRequests(filter = '') {
  const filtered = filterData(SERVICE_REQUESTS, filter, ['requester', 'address', 'type', 'status', 'notes']);

  return `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row gap-3 justify-between">
        ${searchInput('service-request-search', 'Search by requester, type, status...')}
        ${btnPrimary('+ New Request', 'new-service-request')}
      </div>

      ${card(`
        <div class="ui-card-body">
          <h3 class="ui-section-title mb-4">Service Requests</h3>
          ${tableWrap(`
            <table class="w-full text-left">
              <thead class="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">ID</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Requester</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Type</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Date</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Priority</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Status</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                ${filtered.length ? renderList(filtered, r => `
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td class="px-4 py-3 text-sm font-mono">${r.id}</td>
                    <td class="px-4 py-3 text-sm font-medium">${r.requester}</td>
                    <td class="px-4 py-3 text-sm">${r.type}</td>
                    <td class="px-4 py-3 text-sm text-slate-500">${r.dateRequested}</td>
                    <td class="px-4 py-3 text-sm">${badge(r.priority)}</td>
                    <td class="px-4 py-3 text-sm">${badge(r.status)}</td>
                    <td class="px-4 py-3 text-sm">
                      <div class="flex gap-1">
                        <button data-action="view-service-request" data-id="${r.id}" class="px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">View</button>
                        ${r.status === 'Pending' ? btnSuccess('Approve', 'approve-service-request').replace('approve-service-request', `approve-service-request`) + btnDanger('Reject', 'reject-service-request') : ''}
                        ${r.status === 'Approved' ? '<button data-action="complete-service-request" data-id="' + r.id + '" class="px-2 py-1 text-xs rounded bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400">Complete</button>' : ''}
                      </div>
                    </td>
                  </tr>
                `) : `<tr><td colspan="7">${emptyState('No requests found')}</td></tr>`}
              </tbody>
            </table>
          `)}
        </div>
      `)}
    </div>
  `;
}

// ─── Detail Modal ────────────────────────────────────────────────────────────

export function showServiceRequestDetail(id) {
  const r = SERVICE_REQUESTS.find(item => item.id === id);
  if (!r) return;

  openModal(
    `Request ${r.id} — ${r.requester}`,
    `
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <div><p class="text-xs text-slate-500">Requester</p><p class="font-medium">${r.requester}</p></div>
          <div><p class="text-xs text-slate-500">Status</p>${badge(r.status)}</div>
          <div><p class="text-xs text-slate-500">Address</p><p class="font-medium">${r.address}</p></div>
          <div><p class="text-xs text-slate-500">Type</p><p class="font-medium">${r.type}</p></div>
          <div><p class="text-xs text-slate-500">Date Requested</p><p class="font-medium">${r.dateRequested}</p></div>
          <div><p class="text-xs text-slate-500">Priority</p>${badge(r.priority)}</div>
          ${r.scheduledDate ? `<div><p class="text-xs text-slate-500">Scheduled Date</p><p class="font-medium">${r.scheduledDate}</p></div>` : ''}
          ${r.completedDate ? `<div><p class="text-xs text-slate-500">Completed Date</p><p class="font-medium">${r.completedDate}</p></div>` : ''}
        </div>
        <div><p class="text-xs text-slate-500 mb-1">Notes</p><p class="text-sm">${r.notes}</p></div>

        ${r.status === 'Pending' ? `
        <div class="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
          <p class="text-sm font-medium text-yellow-700 dark:text-yellow-400">Awaiting Approval</p>
          <p class="text-xs text-yellow-600 dark:text-yellow-300 mt-1">Assign a schedule after approving this request.</p>
        </div>` : ''}
      </div>
    `,
    `<button data-action="close-modal" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">Close</button>
     ${r.status === 'Pending' ? btnSuccess('Approve', 'approve-service-request') + btnDanger('Reject', 'reject-service-request') : ''}
     ${r.status === 'Approved' ? '<button data-action="assign-schedule" data-id="' + r.id + '" class="px-4 py-2 rounded-lg bg-gov-600 text-white hover:bg-gov-700">Assign Schedule</button>' : ''}
     ${r.status === 'Approved' ? '<button data-action="complete-service-request" data-id="' + r.id + '" class="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700">Mark Completed</button>' : ''}`
  );
}

// ─── New Request Modal ───────────────────────────────────────────────────────

export function showNewServiceRequest() {
  openModal(
    'New Service Request',
    `
      <form class="space-y-4" onsubmit="return false">
        <div><label class="block text-sm font-medium mb-1">Requester Name</label><input type="text" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"></div>
        <div><label class="block text-sm font-medium mb-1">Address</label><input type="text" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"></div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="block text-sm font-medium mb-1">Service Type</label>
            <select class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
              <option>Desludging</option><option>Inspection</option><option>Cleaning</option><option>Repair</option>
            </select></div>
          <div><label class="block text-sm font-medium mb-1">Priority</label>
            <select class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
              <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
            </select></div>
        </div>
        <div><label class="block text-sm font-medium mb-1">Notes</label><textarea rows="3" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm resize-none" placeholder="Describe the issue..."></textarea></div>
      </form>
    `,
    `<button data-action="close-modal" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600">Cancel</button>
     <button data-action="confirm-service-request" class="px-4 py-2 rounded-lg bg-gov-600 text-white hover:bg-gov-700">Submit Request</button>`
  );
}