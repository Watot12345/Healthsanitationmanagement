import { card, icon, renderList, badge, filterData, searchInput, btnPrimary, tableWrap, emptyState, btnSuccess, btnDanger, btnSecondary } from '../../utils/dom.js';
import { openModal } from '../../utils/modal.js';
import { DATA } from '../../data.js';
import { getSearchValue } from '../../utils/search.js';

export function renderServiceRequests() {
  const filter = (window.state?.searchFilters?.['service-request-search']) || getSearchValue('service-request-search') || '';
  const requests = DATA.serviceRequests || [];
  const filtered = filterData(requests, filter, ['requester', 'address', 'type', 'status', 'notes']);
  const userRole = window.state?.role || 'employee';

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
                        <button data-action="view-service-request" data-id="${r.id}" class="px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">👁️</button>
                        ${r.status === 'Pending' && (userRole === 'admin' || userRole === 'staff') ? `
                        <button data-action="approve-service-request" data-id="${r.id}" class="px-2 py-1 text-xs rounded bg-green-50 text-green-700">✓</button>
                        <button data-action="reject-service-request" data-id="${r.id}" class="px-2 py-1 text-xs rounded bg-red-50 text-red-700">✕</button>
                        ` : ''}
                        ${r.status === 'Approved' ? `
                        <button data-action="complete-service-request" data-id="${r.id}" class="px-2 py-1 text-xs rounded bg-blue-50 text-blue-700">✅</button>
                        ` : ''}
                        ${userRole === 'admin' ? `
                        <button data-action="delete-service-request" data-id="${r.id}" class="px-2 py-1 text-xs rounded bg-red-50 text-red-700">🗑️</button>
                        ` : ''}
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

export function showServiceRequestDetail(id) {
  const requests = DATA.serviceRequests || [];
  const r = requests.find(item => item.id == id);
  if (!r) return;
  const userRole = window.state?.role || 'employee';

  openModal(
    `Request ${r.id} — ${r.requester}`,
    `
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <div><p class="text-xs text-slate-500">Requester</p><p class="font-medium">${r.requester}</p></div>
          <div><p class="text-xs text-slate-500">Status</p>${badge(r.status)}</div>
          <div><p class="text-xs text-slate-500">Address</p><p class="font-medium">${r.address || 'N/A'}</p></div>
          <div><p class="text-xs text-slate-500">Type</p><p class="font-medium">${r.type}</p></div>
          <div><p class="text-xs text-slate-500">Date Requested</p><p class="font-medium">${r.dateRequested}</p></div>
          <div><p class="text-xs text-slate-500">Priority</p>${badge(r.priority)}</div>
          ${r.scheduledDate ? `<div><p class="text-xs text-slate-500">Scheduled</p><p class="font-medium">${r.scheduledDate}</p></div>` : ''}
          ${r.completedDate ? `<div><p class="text-xs text-slate-500">Completed</p><p class="font-medium">${r.completedDate}</p></div>` : ''}
        </div>
        <div><p class="text-xs text-slate-500 mb-1">Notes</p><p class="text-sm">${r.notes || 'No notes'}</p></div>
      </div>
    `,
    `<button data-action="close-modal" class="px-4 py-2 rounded-lg border">Close</button>
     ${r.status === 'Pending' && (userRole === 'admin' || userRole === 'staff') ? btnSuccess('Approve', 'approve-service-request') + btnDanger('Reject', 'reject-service-request') : ''}`
  );
}

export function showNewServiceRequest() {
  openModal('New Service Request',
    `<form class="space-y-4" onsubmit="return false">
      <div><label class="block text-sm font-medium mb-1">Requester Name <span class="text-red-500">*</span></label><input id="sr-requester" type="text" class="w-full px-3 py-2 rounded-lg border" required></div>
      <div><label class="block text-sm font-medium mb-1">Address</label><input id="sr-address" type="text" class="w-full px-3 py-2 rounded-lg border"></div>
      <div class="grid grid-cols-2 gap-3">
        <div><label class="block text-sm font-medium mb-1">Service Type</label><select id="sr-type" class="w-full px-3 py-2 rounded-lg border"><option>Desludging</option><option>Inspection</option><option>Cleaning</option><option>Repair</option></select></div>
        <div><label class="block text-sm font-medium mb-1">Priority</label><select id="sr-priority" class="w-full px-3 py-2 rounded-lg border"><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select></div>
      </div>
      <div><label class="block text-sm font-medium mb-1">Notes</label><textarea id="sr-notes" rows="3" class="w-full px-3 py-2 rounded-lg border resize-none"></textarea></div>
    </form>`,
    `<button data-action="close-modal" class="px-4 py-2 rounded-lg border">Cancel</button>
     <button data-action="confirm-service-request" class="px-4 py-2 rounded-lg bg-gov-600 text-white">Submit</button>`);
} 