import { card, icon, renderList, badge, filterData, searchInput, btnPrimary, tableWrap, emptyState, btnSecondary, btnSuccess, btnDanger } from '../../utils/dom.js';
import { openModal } from '../../utils/modal.js';
import { DATA } from '../../data.js';

// ─── Fake Data ──────────────────────────────────────────────────────────────

const APPLICATIONS = [
  { id: 'APP-001', applicant: 'ABC Restaurant', type: 'Food Establishment', address: '456 Mabini Ave., Poblacion', date: '2026-06-20', status: 'Pending', documents: 3, contactPerson: 'Juan Dela Cruz', contactNumber: '+63 912 345 6789' },
  { id: 'APP-002', applicant: 'Green Market Stall', type: 'Market Vendor', address: '789 Bonifacio Rd., San Jose', date: '2026-06-21', status: 'Processing', documents: 2, contactPerson: 'Ana Reyes', contactNumber: '+63 917 654 3210' },
  { id: 'APP-003', applicant: 'Fresh Bakes Co.', type: 'Bakery', address: '567 Mabini Ave., Poblacion', date: '2026-06-22', status: 'Pending', documents: 1, contactPerson: 'Pedro Garcia', contactNumber: '+63 918 765 4321' },
  { id: 'APP-004', applicant: 'City Gym', type: 'Recreational Facility', address: '890 Rizal St., San Jose', date: '2026-06-22', status: 'Rejected', documents: 4, contactPerson: 'Maria Santos', contactNumber: '+63 919 876 5432' },
];

// ─── View ────────────────────────────────────────────────────────────────────

export function renderSanitationApplications(filter = '') {
  const filtered = filterData(APPLICATIONS, filter, ['applicant', 'type', 'status', 'address']);

  return `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row gap-3 justify-between">
        ${searchInput('application-search', 'Search by applicant, type, status...')}
        ${btnPrimary('+ New Application', 'new-application')}
      </div>

      ${card(`
        <div class="ui-card-body">
          <h3 class="ui-section-title mb-4">Permit Applications</h3>
          ${tableWrap(`
            <table class="w-full text-left">
              <thead class="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">ID</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Applicant</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Type</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Date</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Status</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Documents</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                ${filtered.length ? renderList(filtered, a => `
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td class="px-4 py-3 text-sm font-mono">${a.id}</td>
                    <td class="px-4 py-3 text-sm font-medium">${a.applicant}</td>
                    <td class="px-4 py-3 text-sm">${a.type}</td>
                    <td class="px-4 py-3 text-sm text-slate-500">${a.date}</td>
                    <td class="px-4 py-3 text-sm">${badge(a.status)}</td>
                    <td class="px-4 py-3 text-sm text-slate-500">${a.documents} file${a.documents > 1 ? 's' : ''}</td>
                    <td class="px-4 py-3 text-sm">
                      <div class="flex gap-1">
                        <button data-action="view-application" data-id="${a.id}" class="px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">Review</button>
                      </div>
                    </td>
                  </tr>
                `) : `<tr><td colspan="7">${emptyState('No applications found')}</td></tr>`}
              </tbody>
            </table>
          `)}
        </div>
      `)}
    </div>
  `;
}

// ─── Detail Modal ────────────────────────────────────────────────────────────

export function showApplicationDetail(id) {
  const a = APPLICATIONS.find(item => item.id === id);
  if (!a) return;

  openModal(
    `Application ${a.id} — ${a.applicant}`,
    `
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <div><p class="text-xs text-slate-500">Applicant</p><p class="font-medium">${a.applicant}</p></div>
          <div><p class="text-xs text-slate-500">Type</p><p class="font-medium">${a.type}</p></div>
          <div><p class="text-xs text-slate-500">Address</p><p class="font-medium">${a.address}</p></div>
          <div><p class="text-xs text-slate-500">Date Submitted</p><p class="font-medium">${a.date}</p></div>
          <div><p class="text-xs text-slate-500">Contact Person</p><p class="font-medium">${a.contactPerson}</p></div>
          <div><p class="text-xs text-slate-500">Contact Number</p><p class="font-medium">${a.contactNumber}</p></div>
          <div><p class="text-xs text-slate-500">Status</p>${badge(a.status)}</div>
          <div><p class="text-xs text-slate-500">Documents</p><p class="font-medium">${a.documents} uploaded</p></div>
        </div>

        <div>
          <p class="text-xs text-slate-500 uppercase tracking-wider mb-2 font-semibold">Uploaded Requirements</p>
          <div class="space-y-2">
            <div class="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
              <div class="flex items-center gap-3">
                <span class="text-green-500">✓</span>
                <span class="text-sm">Business Registration</span>
              </div>
              <span class="text-xs text-green-600">Complete</span>
            </div>
            <div class="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
              <div class="flex items-center gap-3">
                <span class="text-green-500">✓</span>
                <span class="text-sm">Floor Plan</span>
              </div>
              <span class="text-xs text-green-600">Complete</span>
            </div>
            ${a.documents < 3 ? `
            <div class="flex items-center justify-between p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <div class="flex items-center gap-3">
                <span class="text-yellow-500">⚠</span>
                <span class="text-sm">Health Certificate</span>
              </div>
              <span class="text-xs text-yellow-600">Missing</span>
            </div>` : ''}
          </div>
        </div>
      </div>
    `,
    `<button data-action="close-modal" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">Close</button>
     ${a.status === 'Pending' ? btnSuccess('Approve', 'approve-application') + btnDanger('Reject', 'reject-application') : ''}
     <button data-action="request-docs" data-id="${a.id}" class="px-4 py-2 rounded-lg bg-yellow-600 text-white hover:bg-yellow-700">Request Missing Documents</button>
     <button data-action="forward-inspection" data-id="${a.id}" class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Forward to Inspection</button>`
  );
}

export function showNewApplication() {
  openModal(
    'New Sanitation Permit Application',
    `
      <form class="space-y-4" onsubmit="return false">
        <div><label class="block text-sm font-medium mb-1">Applicant Name</label><input type="text" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none"></div>
        <div><label class="block text-sm font-medium mb-1">Business Type</label>
          <select class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
            <option>Food Establishment</option><option>Market Vendor</option><option>Bakery</option><option>Recreational Facility</option><option>Water Refilling Station</option>
          </select></div>
        <div><label class="block text-sm font-medium mb-1">Address</label><input type="text" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"></div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="block text-sm font-medium mb-1">Contact Person</label><input type="text" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"></div>
          <div><label class="block text-sm font-medium mb-1">Contact Number</label><input type="text" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"></div>
        </div>
        <div><label class="block text-sm font-medium mb-1">Upload Requirements</label>
          <div class="border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl p-4 text-center">
            <p class="text-sm text-slate-500">Upload Business Registration, Floor Plan, Health Certificate</p>
            <p class="text-xs text-slate-400 mt-1">PDF, JPG, PNG up to 5MB each</p>
          </div></div>
      </form>
    `,
    `<button data-action="close-modal" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600">Cancel</button>
     <button data-action="confirm-application" class="px-4 py-2 rounded-lg bg-gov-600 text-white hover:bg-gov-700">Submit Application</button>`
  );
}