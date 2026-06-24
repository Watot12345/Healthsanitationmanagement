import { card, icon, renderList, badge, filterData, searchInput, btnPrimary, tableWrap, emptyState, btnSecondary } from '../../utils/dom.js';
import { openModal } from '../../utils/modal.js';
import { DATA } from '../../data.js';

// ─── View ────────────────────────────────────────────────────────────────────
const patientDocs = [
  { id: 1, name: 'CBC Lab Result', type: 'Lab Result', date: '2026-05-15' },
  { id: 2, name: 'Chest X-Ray', type: 'Imaging', date: '2026-05-15' },
  { id: 3, name: 'Doctor Prescription', type: 'Prescription', date: '2026-06-01' },
];
export function renderPatients(filter = '') {
  const filtered = filterData(DATA.patients, filter, ['name', 'condition', 'id']);

  return `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row gap-3 justify-between">
        ${searchInput('patient-search', 'Search by name, condition, ID...')}
        ${btnPrimary('+ Register Patient', 'register-patient')}
      </div>

      ${card(`
        <div class="ui-card-body">
          <h3 class="ui-section-title mb-4">Patient Records</h3>
          ${tableWrap(`
            <table class="w-full text-left">
              <thead class="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">ID</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Name</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Age</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Blood</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Triage</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Last Visit</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Condition</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                ${filtered.length ? renderList(filtered, p => `
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td class="px-4 py-3 text-sm font-mono">${p.id}</td>
                    <td class="px-4 py-3 text-sm font-medium">${p.name}</td>
                    <td class="px-4 py-3 text-sm">${p.age}</td>
                    <td class="px-4 py-3 text-sm">${p.bloodType}</td>
                    <td class="px-4 py-3 text-sm">${badge(p.triage)}</td>
                    <td class="px-4 py-3 text-sm text-slate-500">${p.lastVisit}</td>
                    <td class="px-4 py-3 text-sm">${p.condition}</td>
                    <td class="px-4 py-3 text-sm">
                      <div class="flex gap-1">
                        <button data-action="view-patient-detail" data-id="${p.id}" class="px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">View</button>
                        <button data-action="edit-patient" data-id="${p.id}" class="px-2 py-1 text-xs rounded bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400">Edit</button>
                      </div>
                    </td>
                  </tr>
                `) : `<tr><td colspan="8">${emptyState('No patients found')}</td></tr>`}
              </tbody>
            </table>
          `)}
        </div>
      `)}
    </div>
  `;
}

// ─── Detail Modal ────────────────────────────────────────────────────────────
export function showPatientDetail(id) {
  const p = DATA.patients.find(item => item.id === id);
  if (!p) return;

  const history = DATA.consultationHistory || [];

  const typeIcon = {
    'Lab Result': 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    'Imaging': 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    'Prescription': 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  };

  openModal(
    `${p.name} — ${p.id}`,
    `
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <div><p class="text-xs text-slate-500">Full Name</p><p class="font-medium">${p.name}</p></div>
          <div><p class="text-xs text-slate-500">Age</p><p class="font-medium">${p.age}</p></div>
          <div><p class="text-xs text-slate-500">Blood Type</p><p class="font-medium">${p.bloodType}</p></div>
          <div><p class="text-xs text-slate-500">Triage</p>${badge(p.triage)}</div>
          <div><p class="text-xs text-slate-500">Last Visit</p><p class="font-medium">${p.lastVisit}</p></div>
          <div><p class="text-xs text-slate-500">Condition</p><p class="font-medium">${p.condition}</p></div>
        </div>

        <div>
          <p class="text-xs text-slate-500 uppercase tracking-wider mb-2 font-semibold">Medical History</p>
          ${history.length ? history.map(c => `
            <div class="flex gap-3 py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
              <div class="text-xs text-slate-400 whitespace-nowrap pt-0.5">${c.date}</div>
              <div>
                <p class="text-sm font-medium">${c.diagnosis}</p>
                <p class="text-xs text-slate-500">${c.doctor}</p>
                <p class="text-xs text-slate-400 mt-0.5">${c.notes}</p>
              </div>
            </div>
          `).join('') : '<p class="text-sm text-slate-500">No consultation history on file.</p>'}
        </div>

        <div>
          <p class="text-xs text-slate-500 uppercase tracking-wider mb-2 font-semibold">Documents</p>
          <div class="space-y-2">
            ${patientDocs.map(d => `
              <div class="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                <div class="flex items-center gap-3">
                  <div class="flex h-8 w-8 items-center justify-center rounded-lg ${typeIcon[d.type] || 'bg-slate-100 text-slate-600'}">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium">${d.name}</p>
                    <p class="text-xs text-slate-500">${d.type} · ${d.date}</p>
                  </div>
                </div>
                <button data-action="view-document" data-id="${d.id}" class="px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600">View</button>
              </div>
            `).join('')}
          </div>
          <div class="mt-3 border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl p-4 text-center hover:border-gov-400 transition-colors cursor-pointer" data-action="upload-document">
            <svg class="h-6 w-6 mx-auto text-slate-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
            <p class="text-sm text-slate-500">Attach lab result or note</p>
            <p class="text-xs text-slate-400 mt-0.5">PDF, JPG, PNG up to 10MB</p>
          </div>
        </div>
      </div>
    `,
    `<button data-action="close-modal" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">Close</button>
     ${btnPrimary('Edit Patient', 'edit-patient')}`
  );
}

// ─── Register Modal ──────────────────────────────────────────────────────────

export function showRegisterPatient() {
  openModal(
    'Register New Patient',
    `
      <form class="space-y-4" onsubmit="return false">
        <div><label class="block text-sm font-medium mb-1">Full Name</label><input type="text" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none"></div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="block text-sm font-medium mb-1">Age</label><input type="number" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none"></div>
          <div><label class="block text-sm font-medium mb-1">Blood Type</label>
            <select class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none">
              <option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
            </select></div>
        </div>
        <div><label class="block text-sm font-medium mb-1">Address</label><input type="text" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none"></div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="block text-sm font-medium mb-1">Contact Number</label><input type="text" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none"></div>
          <div><label class="block text-sm font-medium mb-1">Emergency Contact</label><input type="text" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none"></div>
        </div>
        <div><label class="block text-sm font-medium mb-1">Existing Conditions</label><textarea rows="2" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none resize-none"></textarea></div>
        <div><label class="block text-sm font-medium mb-1">Triage Level</label>
          <select class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none">
            <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
          </select></div>
      </form>
    `,
    `<button data-action="close-modal" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">Cancel</button>
     <button data-action="confirm-register-patient" class="px-4 py-2 rounded-lg bg-gov-600 text-white hover:bg-gov-700">Register Patient</button>`
  );
}