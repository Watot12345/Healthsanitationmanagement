import { card, icon, renderList, badge, filterData, searchInput, btnPrimary, tableWrap, emptyState, btnSecondary } from '../../utils/dom.js';
import { openModal } from '../../utils/modal.js';
import { DATA } from '../../data.js';

// ─── Fake Data ──────────────────────────────────────────────────────────────

const CONSULTATIONS = [
  { id: 'CON-001', patient: 'Pedro Garcia', doctor: 'Dr. Elena Santos', date: '2026-06-22', time: '09:00 AM', diagnosis: 'Hypertension follow-up', notes: 'BP 140/90, continue medication', prescription: 'Losartan 50mg daily', followUp: '2026-07-22', status: 'Completed' },
  { id: 'CON-002', patient: 'Rosa Mendoza', doctor: 'Dr. Miguel Reyes', date: '2026-06-21', time: '10:30 AM', diagnosis: 'Annual physical', notes: 'All vitals normal', prescription: 'Multivitamins', followUp: '2027-06-21', status: 'Completed' },
  { id: 'CON-003', patient: 'Carlos Lim', doctor: 'Dr. Ana Cruz', date: '2026-06-23', time: '08:00 AM', diagnosis: 'Dental caries', notes: 'Two cavities found', prescription: 'Amoxicillin 500mg', followUp: '2026-07-01', status: 'Pending' },
];

// ─── View ────────────────────────────────────────────────────────────────────

export function renderConsultations(filter = '') {
  const filtered = filterData(CONSULTATIONS, filter, ['patient', 'doctor', 'diagnosis']);

  return `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row gap-3 justify-between">
        ${searchInput('consultation-search', 'Search by patient, doctor, diagnosis...')}
        ${btnPrimary('+ New Consultation', 'new-consultation')}
      </div>

      ${card(`
        <div class="ui-card-body">
          <h3 class="ui-section-title mb-4">Consultation Records</h3>
          ${tableWrap(`
            <table class="w-full text-left">
              <thead class="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">ID</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Patient</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Doctor</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Date</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Diagnosis</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Follow-up</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Status</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                ${filtered.length ? renderList(filtered, c => `
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td class="px-4 py-3 text-sm font-mono">${c.id}</td>
                    <td class="px-4 py-3 text-sm font-medium">${c.patient}</td>
                    <td class="px-4 py-3 text-sm">${c.doctor}</td>
                    <td class="px-4 py-3 text-sm text-slate-500">${c.date} ${c.time}</td>
                    <td class="px-4 py-3 text-sm">${c.diagnosis}</td>
                    <td class="px-4 py-3 text-sm text-slate-500">${c.followUp}</td>
                    <td class="px-4 py-3 text-sm">${badge(c.status)}</td>
                    <td class="px-4 py-3 text-sm">
                      <div class="flex gap-1">
                        <button data-action="view-consultation" data-id="${c.id}" class="px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">View</button>
                      </div>
                    </td>
                  </tr>
                `) : `<tr><td colspan="8">${emptyState('No consultations found')}</td></tr>`}
              </tbody>
            </table>
          `)}
        </div>
      `)}
    </div>
  `;
}

// ─── Detail Modal ────────────────────────────────────────────────────────────

export function showConsultationDetail(id) {
  const c = CONSULTATIONS.find(item => item.id === id);
  if (!c) return;

  openModal(
    `Consultation ${c.id} — ${c.patient}`,
    `
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <div><p class="text-xs text-slate-500">Patient</p><p class="font-medium">${c.patient}</p></div>
          <div><p class="text-xs text-slate-500">Doctor</p><p class="font-medium">${c.doctor}</p></div>
          <div><p class="text-xs text-slate-500">Date</p><p class="font-medium">${c.date}</p></div>
          <div><p class="text-xs text-slate-500">Time</p><p class="font-medium">${c.time}</p></div>
          <div><p class="text-xs text-slate-500">Status</p>${badge(c.status)}</div>
          <div><p class="text-xs text-slate-500">Follow-up</p><p class="font-medium">${c.followUp}</p></div>
        </div>
        <div><p class="text-xs text-slate-500 mb-1">Diagnosis</p><p class="text-sm font-medium">${c.diagnosis}</p></div>
        <div><p class="text-xs text-slate-500 mb-1">Notes</p><p class="text-sm">${c.notes}</p></div>
        <div><p class="text-xs text-slate-500 mb-1">Prescription</p>
          <div class="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p class="text-sm font-medium text-blue-700 dark:text-blue-400">💊 ${c.prescription}</p>
          </div>
        </div>
      </div>
    `,
    `<button data-action="close-modal" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">Close</button>`
  );
}

// ─── New Consultation Modal ──────────────────────────────────────────────────

export function showNewConsultation() {
  openModal(
    'New Consultation',
    `
      <form class="space-y-4" onsubmit="return false">
        <div><label class="block text-sm font-medium mb-1">Patient</label>
          <select class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none">
            ${DATA.patients.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
          </select></div>
        <div><label class="block text-sm font-medium mb-1">Doctor</label>
          <select class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none">
            ${DATA.doctors.map(d => `<option>${d.name}</option>`).join('')}
          </select></div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="block text-sm font-medium mb-1">Date</label><input type="date" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none"></div>
          <div><label class="block text-sm font-medium mb-1">Time</label><input type="time" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none"></div>
        </div>
        <div><label class="block text-sm font-medium mb-1">Diagnosis</label><input type="text" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none"></div>
        <div><label class="block text-sm font-medium mb-1">Notes</label><textarea rows="3" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none resize-none"></textarea></div>
        <div><label class="block text-sm font-medium mb-1">Prescription</label><input type="text" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none"></div>
        <div><label class="block text-sm font-medium mb-1">Follow-up Date</label><input type="date" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none"></div>
      </form>
    `,
    `<button data-action="close-modal" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">Cancel</button>
     <button data-action="confirm-consultation" class="px-4 py-2 rounded-lg bg-gov-600 text-white hover:bg-gov-700">Save Consultation</button>`
  );
}