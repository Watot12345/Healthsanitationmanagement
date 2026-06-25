import { card, icon, badge, btnPrimary, btnDanger, btnSecondary } from '../../utils/dom.js';
import { openModal } from '../../utils/modal.js';

// ─── Fake Data ──────────────────────────────────────────────────────────────

const ALERTS = [
  { id: 'ALT-001', disease: 'Influenza', barangay: 'Multiple', cases: 28, threshold: 15, level: 'outbreak', status: 'Active', detected: '2026-06-22', lastUpdate: '2026-06-23', trend: 'Rising' },
  { id: 'ALT-002', disease: 'Dengue', barangay: 'San Jose', cases: 12, threshold: 10, level: 'warning', status: 'Active', detected: '2026-06-20', lastUpdate: '2026-06-22', trend: 'Stable' },
  { id: 'ALT-003', disease: 'Food Poisoning', barangay: 'Poblacion', cases: 3, threshold: 5, level: 'normal', status: 'Monitoring', detected: '2026-06-21', lastUpdate: '2026-06-23', trend: 'Declining' },
  { id: 'ALT-004', disease: 'Leptospirosis', barangay: 'Riverside', cases: 5, threshold: 3, level: 'warning', status: 'Active', detected: '2026-06-19', lastUpdate: '2026-06-23', trend: 'Rising' },
];

const alertLevels = {
  normal: { color: 'bg-green-500', icon: '🟢', label: 'Normal' },
  warning: { color: 'bg-yellow-500', icon: '🟡', label: 'Warning' },
  outbreak: { color: 'bg-red-500', icon: '🔴', label: 'Outbreak' },
};

// ─── View ────────────────────────────────────────────────────────────────────

export function renderOutbreakDetection() {
  return `
    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        ${card(`
          <div class="p-4 text-center">
            <p class="text-xs text-slate-500 uppercase">Active Alerts</p>
            <p class="text-3xl font-bold">${ALERTS.filter(a => a.status === 'Active').length}</p>
          </div>
        `)}
        ${card(`
          <div class="p-4 text-center">
            <p class="text-xs text-slate-500 uppercase">Outbreaks</p>
            <p class="text-3xl font-bold text-red-600">${ALERTS.filter(a => a.level === 'outbreak').length}</p>
          </div>
        `)}
        ${card(`
          <div class="p-4 text-center">
            <p class="text-xs text-slate-500 uppercase">Under Monitoring</p>
            <p class="text-3xl font-bold text-blue-600">${ALERTS.filter(a => a.status === 'Monitoring').length}</p>
          </div>
        `)}
      </div>

      ${card(`
        <div class="ui-card-body">
          <h3 class="ui-section-title mb-4">Alert Status Board</h3>
          <div class="space-y-3">
            ${ALERTS.map(a => `
              <div class="flex items-center justify-between p-4 rounded-xl border ${
                a.level === 'outbreak' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' :
                a.level === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
                'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
              }">
                <div class="flex items-center gap-4">
                  <span class="text-2xl">${alertLevels[a.level].icon}</span>
                  <div>
                    <p class="font-semibold">${a.disease} — ${a.barangay}</p>
                    <p class="text-sm text-slate-500">${a.cases} cases (threshold: ${a.threshold}) · ${a.trend}</p>
                    <p class="text-xs text-slate-400">Detected: ${a.detected} · Last update: ${a.lastUpdate}</p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  ${badge(a.level)}
                  ${badge(a.status)}
                  <button data-action="manage-alert" data-id="${a.id}" class="px-3 py-1.5 text-xs rounded-lg bg-gov-600 text-white hover:bg-gov-700">Manage</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `)}
    </div>
  `;
}

// ─── Manage Alert Modal ──────────────────────────────────────────────────────

export function showManageAlert(id) {
  const a = ALERTS.find(item => item.id === id);
  if (!a) return;

  openModal(
    `Manage Alert — ${a.disease}`,
    `
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <div><p class="text-xs text-slate-500">Disease</p><p class="font-medium">${a.disease}</p></div>
          <div><p class="text-xs text-slate-500">Barangay</p><p class="font-medium">${a.barangay}</p></div>
          <div><p class="text-xs text-slate-500">Cases</p><p class="font-medium">${a.cases}</p></div>
          <div><p class="text-xs text-slate-500">Threshold</p><p class="font-medium">${a.threshold}</p></div>
          <div><p class="text-xs text-slate-500">Current Level</p>${badge(a.level)}</div>
          <div><p class="text-xs text-slate-500">Trend</p><p class="font-medium">${a.trend}</p></div>
        </div>

        <div>
          <p class="text-xs text-slate-500 uppercase tracking-wider mb-2 font-semibold">Update Alert Level</p>
          <div class="flex gap-2">
            <button class="px-4 py-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400" data-action="set-alert-normal">🟢 Normal</button>
            <button class="px-4 py-2 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400" data-action="set-alert-warning">🟡 Warning</button>
            <button class="px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400" data-action="declare-outbreak">🔴 Outbreak</button>
          </div>
        </div>
      </div>
    `,
    `<button data-action="close-modal" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">Close</button>
     <button data-action="notify-staff" class="px-4 py-2 rounded-lg bg-gov-600 text-white hover:bg-gov-700">Notify Health Center Staff</button>`
  );
}