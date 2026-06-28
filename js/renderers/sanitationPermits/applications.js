
import { card, icon, renderList, badge, filterData, searchInput, btnPrimary, tableWrap, emptyState, btnSecondary, btnSuccess, btnDanger } from '../../utils/dom.js';
import { openModal } from '../../utils/modal.js';
import { DATA } from '../../data.js';
import { getSearchValue } from '../../utils/search.js';

// ─── View ────────────────────────────────────────────────────────────────────

export function renderSanitationApplications() {
  const filter = (window.state?.searchFilters?.['application-search']) || getSearchValue('application-search') || '';
  const applications = DATA.applications || [];
  const filtered = filterData(applications, filter, ['applicant', 'type', 'status', 'address']);

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
                    <td class="px-4 py-3 text-sm font-medium">${a.applicant || a.applicant_name}</td>
                    <td class="px-4 py-3 text-sm">${a.type || a.business_type}</td>
                    <td class="px-4 py-3 text-sm text-slate-500">${a.date || a.submission_date}</td>
                    <td class="px-4 py-3 text-sm">${badge(a.status)}</td>
                    <td class="px-4 py-3 text-sm text-slate-500">${a.documents || 0} file(s)</td>
                    <td class="px-4 py-3 text-sm">
                      <div class="flex gap-1">
                        <button data-action="view-application" data-id="${a.id}" class="px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">👁️ Review</button>
                        <button data-action="delete-application" data-id="${a.id}" class="px-2 py-1 text-xs rounded bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800">🗑️</button>
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
  const applications = DATA.applications || [];
  const a = applications.find(item => item.id == id);
  if (!a) return;

  openModal(
    `Application ${a.id} — ${a.applicant || a.applicant_name}`,
    `
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <div><p class="text-xs text-slate-500">Applicant</p><p class="font-medium">${a.applicant || a.applicant_name}</p></div>
          <div><p class="text-xs text-slate-500">Type</p><p class="font-medium">${a.type || a.business_type}</p></div>
          <div><p class="text-xs text-slate-500">Address</p><p class="font-medium">${a.address || ''}</p></div>
          <div><p class="text-xs text-slate-500">Date Submitted</p><p class="font-medium">${a.date || a.submission_date}</p></div>
          <div><p class="text-xs text-slate-500">Contact Person</p><p class="font-medium">${a.contactPerson || a.contact_person || 'N/A'}</p></div>
          <div><p class="text-xs text-slate-500">Contact Number</p><p class="font-medium">${a.contactNumber || a.contact_number || 'N/A'}</p></div>
          <div><p class="text-xs text-slate-500">Status</p>${badge(a.status)}</div>
          <div><p class="text-xs text-slate-500">Documents</p><p class="font-medium">${a.documents || 0} uploaded</p></div>
        </div>
        
        <div>
          <p class="text-xs text-slate-500 uppercase tracking-wider mb-2 font-semibold">📄 Uploaded Documents</p>
          <div class="space-y-2" id="app-documents-list">
            <div class="text-center py-4 text-slate-400">
              <div class="animate-pulse">Loading documents...</div>
            </div>
          </div>
        </div>
      </div>
    `,
    `<button data-action="close-modal" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">Close</button>
     ${a.status === 'Pending' ? btnSuccess('Approve', 'approve-application') + btnDanger('Reject', 'reject-application') : ''}`
  );
  
  // Load documents
  setTimeout(() => loadApplicationDocuments(a.id), 200);
}

// Load documents for the detail modal
async function loadApplicationDocuments(appId) {
    const container = document.getElementById('app-documents-list');
    if (!container) return;
    
    try {
        const response = await fetch(`api/applications/getDocuments.php?application_id=${appId}`);
        const data = await response.json();
        const userRole = window.state?.role || 'employee';
        
        if (data.success && data.documents.length > 0) {
            container.innerHTML = data.documents.map(doc => `
                <div class="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                    <div class="flex items-center gap-3">
                        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                            </svg>
                        </div>
                        <div>
                            <p class="text-sm font-medium">${doc.document_name}</p>
                            <p class="text-xs text-slate-500">${doc.document_type} · ${doc.date} · ${formatFileSize(doc.file_size)}</p>
                        </div>
                    </div>
                    <div class="flex gap-1">
                        <button data-action="view-document" data-path="${doc.file_path}" 
                                class="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 hover:bg-slate-100">
                            👁️ View
                        </button>
                        ${userRole === 'admin' ? `
                        <button data-action="delete-app-document" data-id="${doc.id}" data-app-id="${appId}"
                                class="px-3 py-1.5 text-xs font-medium rounded-lg border border-red-200 text-red-600 hover:bg-red-50">
                            🗑️
                        </button>
                        ` : ''}
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p class="text-sm text-slate-500 text-center py-4">No documents uploaded</p>';
        }
    } catch (e) {
        container.innerHTML = '<p class="text-sm text-red-500">Failed to load documents</p>';
    }
}

function formatFileSize(bytes) {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
}
// ─── New Application Modal ───────────────────────────────────────────────────
export function showNewApplication() {
  openModal(
    'New Sanitation Permit Application',
    `
      <form class="space-y-4" onsubmit="return false">
        <div>
          <label class="block text-sm font-medium mb-1">Applicant Name <span class="text-red-500">*</span></label>
          <input type="text" id="app-applicant" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none" required>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Business Type</label>
          <select id="app-type" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
            <option>Food Establishment</option>
            <option>Market Vendor</option>
            <option>Bakery</option>
            <option>Recreational Facility</option>
            <option>Water Refilling Station</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Address</label>
          <input type="text" id="app-address" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium mb-1">Contact Person</label>
            <input type="text" id="app-contact-person" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Contact Number</label>
            <input type="text" id="app-contact-number" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Upload Requirements</label>
          <div class="border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl p-4 text-center hover:border-gov-400 transition-colors cursor-pointer" data-action="upload-application-docs">
            <svg class="h-8 w-8 mx-auto text-slate-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
            </svg>
            <p class="text-sm text-slate-500">Click to upload required documents</p>
            <p class="text-xs text-slate-400 mt-1">Business Registration, Floor Plan, Health Certificate</p>
            <p class="text-xs text-slate-400">PDF, JPG, PNG up to 5MB each</p>
          </div>
          <div id="app-uploaded-files" class="mt-2 space-y-1"></div>
        </div>
      </form>
    `,
    `<button data-action="close-modal" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600">Cancel</button>
     <button data-action="confirm-application" class="px-4 py-2 rounded-lg bg-gov-600 text-white hover:bg-gov-700">Submit Application</button>`
  );
}