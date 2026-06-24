import { card, icon, renderList, badge, filterData, searchInput, btnPrimary, tableWrap, emptyState, btnSecondary } from '../../utils/dom.js';
import { openModal } from '../../utils/modal.js';

// ─── Fake Data ──────────────────────────────────────────────────────────────

const PERMIT_RECORDS = [
  { id: 'PR-001', permitNo: 'SP-2026-001', applicant: 'ABC Restaurant', type: 'Food Establishment', issuedDate: '2026-01-15', expiryDate: '2027-01-15', status: 'Active', barangay: 'Poblacion' },
  { id: 'PR-002', permitNo: 'SP-2026-002', applicant: 'Green Market Stall', type: 'Market Vendor', issuedDate: '2026-02-20', expiryDate: '2027-02-20', status: 'Active', barangay: 'San Jose' },
  { id: 'PR-003', permitNo: 'SP-2026-003', applicant: 'Fresh Bakes Co.', type: 'Bakery', issuedDate: '2026-03-10', expiryDate: '2027-03-10', status: 'Expiring Soon', barangay: 'Poblacion' },
  { id: 'PR-004', permitNo: 'SP-2025-015', applicant: 'City Gym', type: 'Recreational Facility', issuedDate: '2025-06-01', expiryDate: '2026-06-01', status: 'Expired', barangay: 'San Jose' },
  { id: 'PR-005', permitNo: 'SP-2026-004', applicant: 'Water Pure Station', type: 'Water Refilling', issuedDate: '2026-04-05', expiryDate: '2027-04-05', status: 'Active', barangay: 'Riverside' },
];

// ─── View ────────────────────────────────────────────────────────────────────

export function renderPermitRecords(filter = '') {
  const filtered = filterData(PERMIT_RECORDS, filter, ['applicant', 'permitNo', 'type', 'barangay', 'status']);

  return `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row gap-3">
        ${searchInput('permit-record-search', 'Search by applicant, permit no, type...')}
        <select id="permit-status-filter" class="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Expiring Soon">Expiring Soon</option>
          <option value="Expired">Expired</option>
        </select>
      </div>

      ${card(`
        <div class="ui-card-body">
          <h3 class="ui-section-title mb-4">Issued Permits</h3>
          ${tableWrap(`
            <table class="w-full text-left">
              <thead class="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Permit No</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Applicant</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Type</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Barangay</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Issued</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Expiry</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Status</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                ${filtered.length ? renderList(filtered, p => `
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td class="px-4 py-3 text-sm font-mono font-medium">${p.permitNo}</td>
                    <td class="px-4 py-3 text-sm font-medium">${p.applicant}</td>
                    <td class="px-4 py-3 text-sm">${p.type}</td>
                    <td class="px-4 py-3 text-sm text-slate-500">${p.barangay}</td>
                    <td class="px-4 py-3 text-sm text-slate-500">${p.issuedDate}</td>
                    <td class="px-4 py-3 text-sm text-slate-500">${p.expiryDate}</td>
                    <td class="px-4 py-3 text-sm">${badge(p.status)}</td>
                    <td class="px-4 py-3 text-sm">
                      <div class="flex gap-1">
                        <button data-action="view-permit" data-id="${p.id}" class="px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">View</button>
                        <button data-action="download-permit" data-id="${p.id}" class="px-2 py-1 text-xs rounded bg-gov-50 text-gov-700 hover:bg-gov-100 dark:bg-gov-900/20 dark:text-gov-400">⬇ PDF</button>
                      </div>
                    </td>
                  </tr>
                `) : `<tr><td colspan="8">${emptyState('No permits found')}</td></tr>`}
              </tbody>
            </table>
          `)}
        </div>
      `)}
    </div>
  `;
}

// ─── Detail Modal ────────────────────────────────────────────────────────────

export function showPermitDetail(id) {
  const p = PERMIT_RECORDS.find(item => item.id === id);
  if (!p) return;

  openModal(
    `Permit ${p.permitNo} — ${p.applicant}`,
    `
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <div><p class="text-xs text-slate-500">Permit Number</p><p class="font-medium">${p.permitNo}</p></div>
          <div><p class="text-xs text-slate-500">Applicant</p><p class="font-medium">${p.applicant}</p></div>
          <div><p class="text-xs text-slate-500">Business Type</p><p class="font-medium">${p.type}</p></div>
          <div><p class="text-xs text-slate-500">Barangay</p><p class="font-medium">${p.barangay}</p></div>
          <div><p class="text-xs text-slate-500">Date Issued</p><p class="font-medium">${p.issuedDate}</p></div>
          <div><p class="text-xs text-slate-500">Expiry Date</p><p class="font-medium">${p.expiryDate}</p></div>
          <div><p class="text-xs text-slate-500">Status</p>${badge(p.status)}</div>
        </div>

        <div class="p-4 rounded-lg bg-gov-50 dark:bg-gov-900/20 border border-gov-200 dark:border-gov-800 text-center">
          <svg class="h-12 w-12 mx-auto text-gov-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <p class="text-sm font-medium text-gov-700 dark:text-gov-300">Permit Certificate Available</p>
          <p class="text-xs text-gov-500 mt-1">Click download to save as PDF</p>
        </div>
      </div>
    `,
    `<button data-action="close-modal" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">Close</button>
     <button data-action="download-permit" class="px-4 py-2 rounded-lg bg-gov-600 text-white hover:bg-gov-700">Download Certificate (PDF)</button>`
  );
}