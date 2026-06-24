import { card, icon, renderList, badge, filterData, searchInput, btnPrimary, tableWrap, emptyState, btnSecondary } from '../../utils/dom.js';
import { openModal } from '../../utils/modal.js';

// ─── Fake Data ──────────────────────────────────────────────────────────────

const CHILD_RECORDS = [
  { id: 'CH-001', name: 'Sofia Garcia', birthdate: '2024-03-15', age: '2 yrs', gender: 'Female', mother: 'Rosa Mendoza', father: 'Pedro Garcia', address: '123 Rizal St., San Jose', status: 'Active', vaccines: 75, lastVisit: '2026-06-15' },
  { id: 'CH-002', name: 'Luis Mendoza', birthdate: '2025-01-10', age: '1 yr', gender: 'Male', mother: 'Rosa Mendoza', father: 'Juan Mendoza', address: '123 Rizal St., San Jose', status: 'Active', vaccines: 50, lastVisit: '2026-06-10' },
  { id: 'CH-003', name: 'Emma Lim', birthdate: '2023-06-20', age: '3 yrs', gender: 'Female', mother: 'Carlos Lim', father: 'Carlos Lim', address: '234 Rizal St., Riverside', status: 'Active', vaccines: 90, lastVisit: '2026-05-28' },
  { id: 'CH-004', name: 'Noah Torres', birthdate: '2025-12-01', age: '6 mo', gender: 'Male', mother: 'Elena Torres', father: 'Miguel Torres', address: '567 Mabini Ave., Poblacion', status: 'Active', vaccines: 30, lastVisit: '2026-06-20' },
];

// ─── View ────────────────────────────────────────────────────────────────────

export function renderChildRecords(filter = '') {
  const filtered = filterData(CHILD_RECORDS, filter, ['name', 'mother', 'father', 'address', 'status']);

  return `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row gap-3 justify-between">
        ${searchInput('child-search', 'Search by name, parent, address...')}
        ${btnPrimary('+ Register Child', 'register-child')}
      </div>

      ${card(`
        <div class="ui-card-body">
          <h3 class="ui-section-title mb-4">Child Records</h3>
          ${tableWrap(`
            <table class="w-full text-left">
              <thead class="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">ID</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Name</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Age</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Mother</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Vaccines</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Last Visit</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Status</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                ${filtered.length ? renderList(filtered, c => `
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td class="px-4 py-3 text-sm font-mono">${c.id}</td>
                    <td class="px-4 py-3 text-sm font-medium">${c.name}</td>
                    <td class="px-4 py-3 text-sm">${c.age}</td>
                    <td class="px-4 py-3 text-sm text-slate-500">${c.mother}</td>
                    <td class="px-4 py-3 text-sm">
                      <div class="flex items-center gap-2">
                        <div class="h-2 w-16 rounded-full bg-slate-100 dark:bg-slate-700">
                          <div class="h-2 rounded-full bg-green-500" style="width:${c.vaccines}%"></div>
                        </div>
                        <span class="text-xs">${c.vaccines}%</span>
                      </div>
                    </td>
                    <td class="px-4 py-3 text-sm text-slate-500">${c.lastVisit}</td>
                    <td class="px-4 py-3 text-sm">${badge(c.status)}</td>
                    <td class="px-4 py-3 text-sm">
                      <div class="flex gap-1">
                        <button data-action="view-child" data-id="${c.id}" class="px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">View</button>
                        <button data-action="edit-child" data-id="${c.id}" class="px-2 py-1 text-xs rounded bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400">Edit</button>
                      </div>
                    </td>
                  </tr>
                `) : `<tr><td colspan="8">${emptyState('No children found')}</td></tr>`}
              </tbody>
            </table>
          `)}
        </div>
      `)}
    </div>
  `;
}

// ─── Detail Modal ────────────────────────────────────────────────────────────

export function showChildDetail(id) {
  const c = CHILD_RECORDS.find(item => item.id === id);
  if (!c) return;

  openModal(
    `${c.name} — ${c.id}`,
    `
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <div><p class="text-xs text-slate-500">Full Name</p><p class="font-medium">${c.name}</p></div>
          <div><p class="text-xs text-slate-500">Birthdate</p><p class="font-medium">${c.birthdate}</p></div>
          <div><p class="text-xs text-slate-500">Age</p><p class="font-medium">${c.age}</p></div>
          <div><p class="text-xs text-slate-500">Gender</p><p class="font-medium">${c.gender}</p></div>
          <div><p class="text-xs text-slate-500">Mother</p><p class="font-medium">${c.mother}</p></div>
          <div><p class="text-xs text-slate-500">Father</p><p class="font-medium">${c.father}</p></div>
          <div><p class="text-xs text-slate-500">Address</p><p class="font-medium">${c.address}</p></div>
          <div><p class="text-xs text-slate-500">Status</p>${badge(c.status)}</div>
        </div>

        <div>
          <p class="text-xs text-slate-500 uppercase tracking-wider mb-2 font-semibold">Vaccination Progress</p>
          <div class="flex items-center gap-3 mb-2">
            <div class="h-3 flex-1 rounded-full bg-slate-100 dark:bg-slate-700">
              <div class="h-3 rounded-full bg-green-500" style="width:${c.vaccines}%"></div>
            </div>
            <span class="text-sm font-semibold">${c.vaccines}%</span>
          </div>
          <p class="text-xs text-slate-500">Last visit: ${c.lastVisit}</p>
        </div>

        <div>
          <p class="text-xs text-slate-500 uppercase tracking-wider mb-2 font-semibold">Medical History</p>
          <div class="space-y-2">
            <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
              <p class="text-sm font-medium">BCG Vaccine</p><p class="text-xs text-slate-500">Administered: 2024-04-01</p>
            </div>
            <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
              <p class="text-sm font-medium">Hepatitis B (3 doses)</p><p class="text-xs text-slate-500">Last dose: 2025-02-10</p>
            </div>
          </div>
        </div>
      </div>
    `,
    `<button data-action="close-modal" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">Close</button>
     <button data-action="edit-child" class="px-4 py-2 rounded-lg bg-gov-600 text-white hover:bg-gov-700">Edit Profile</button>`
  );
}

// ─── Register Modal ──────────────────────────────────────────────────────────

export function showRegisterChild() {
  openModal(
    'Register New Child',
    `
      <form class="space-y-4" onsubmit="return false">
        <div><label class="block text-sm font-medium mb-1">Full Name</label><input type="text" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"></div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="block text-sm font-medium mb-1">Birthdate</label><input type="date" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"></div>
          <div><label class="block text-sm font-medium mb-1">Gender</label>
            <select class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
              <option>Male</option><option>Female</option>
            </select></div>
        </div>
        <div><label class="block text-sm font-medium mb-1">Address</label><input type="text" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"></div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="block text-sm font-medium mb-1">Mother's Name</label><input type="text" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"></div>
          <div><label class="block text-sm font-medium mb-1">Father's Name</label><input type="text" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"></div>
        </div>
      </form>
    `,
    `<button data-action="close-modal" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600">Cancel</button>
     <button data-action="confirm-register-child" class="px-4 py-2 rounded-lg bg-gov-600 text-white hover:bg-gov-700">Register Child</button>`
  );
}