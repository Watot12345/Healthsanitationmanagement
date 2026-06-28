// Compliance & Violation ----- ADMIN PANEL

import { card, icon, renderList, badge, filterData, searchInput } from '../utils/dom.js';
import { openModal } from '../utils/modal.js';

// ─── Data ────────────────────────────────────────────────────────────────────

let COMPLIANCE_DATA = [];

export async function loadComplianceData() {
    try {
        const response = await fetch('api/admin/getViolations.php');
        if (response.ok) {
            const result = await response.json();
            COMPLIANCE_DATA = (result.data || result).map(v => ({
                ...v,
                dueDate: v.due_date,
                repeatOffender: v.repeat_offender == 1
            }));
        }
    } catch (e) {}
}

// ─── Summary ────────────────────────────────────────────────────────────────
function getSummary() {
  if (!COMPLIANCE_DATA.length) {
    return { total: 0, repeat: 0, critical: 0, avgScore: 0 };
  }
  const total = COMPLIANCE_DATA.length;
  const repeat = COMPLIANCE_DATA.filter(v => v.repeatOffender).length;
  const critical = COMPLIANCE_DATA.filter(v => v.risk === 'Critical').length;
  const avgScore = Math.round(COMPLIANCE_DATA.reduce((sum, v) => sum + (v.score || 0), 0) / total);
  return { total, repeat, critical, avgScore };
}

// ─── Components ─────────────────────────────────────────────────────────────

const SummaryCard = s => card(`
  <div class="p-4 text-center">
    <p class="text-xs text-slate-500 uppercase tracking-wider">${s.label}</p>
    <p class="text-2xl font-bold mt-1 ${s.color}">${s.value}</p>
  </div>
`);

const ViolationRow = v => `
  <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
    <td class="px-4 py-3 text-sm font-medium">${v.household}</td>
    <td class="px-4 py-3 text-sm text-slate-500">${v.barangay}</td>
    <td class="px-4 py-3 text-sm">${v.violation}</td>
    <td class="px-4 py-3 text-sm">${badge(v.risk)}</td>
    <td class="px-4 py-3 text-sm">${badge(v.status)}</td>
    <td class="px-4 py-3 text-sm text-slate-500">${v.dueDate}</td>
    <td class="px-4 py-3 text-sm">
      ${v.repeatOffender ? '<span class="text-xs text-red-600 font-medium">⚠ Repeat</span>' : '<span class="text-xs text-slate-400">—</span>'}
    </td>
    <td class="px-4 py-3 text-sm">
      <div class="flex gap-1">
        <button data-action="view-violation" data-id="${v.id}" class="px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">View</button>
        <button data-action="resolve-violation" data-id="${v.id}" class="px-2 py-1 text-xs rounded bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400">Resolve</button>
        <button data-action="escalate-violation" data-id="${v.id}" class="px-2 py-1 text-xs rounded bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400">Escalate</button>
      </div>
    </td>
  </tr>
`;

// ─── Detail Modal ────────────────────────────────────────────────────────────

export function showViolationDetail(id) {
  const v = COMPLIANCE_DATA.find(item => item.id == id);
  if (!v) return;

  openModal(
    `Violation #${v.id} — ${v.household}`,
    `
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <div><p class="text-xs text-slate-500">Household/Business</p><p class="font-medium">${v.household}</p></div>
          <div><p class="text-xs text-slate-500">Barangay</p><p class="font-medium">${v.barangay}</p></div>
          <div><p class="text-xs text-slate-500">Address</p><p class="font-medium">${v.address}</p></div>
          <div><p class="text-xs text-slate-500">Due Date</p><p class="font-medium">${v.dueDate}</p></div>
          <div><p class="text-xs text-slate-500">Risk Level</p>${badge(v.risk)}</div>
          <div><p class="text-xs text-slate-500">Status</p>${badge(v.status)}</div>
          <div><p class="text-xs text-slate-500">Compliance Score</p><p class="font-medium">${v.score}%</p></div>
          <div><p class="text-xs text-slate-500">Compliance Score</p><p class="font-medium">${v.score || 0}%</p></div>
          <div><p class="text-xs text-slate-500">Type</p><p class="font-medium">${v.type}</p></div>
        </div>
        <div>
          <p class="text-xs text-slate-500 mb-1">Description</p>
          <p class="text-sm">${v.violation}</p>
        </div>
        <div>
          <p class="text-xs text-slate-500 mb-1">Repeat Offender</p>
          ${v.repeatOffender 
            ? '<span class="text-red-600 font-medium">⚠ Yes — Prior violations on record. Recommend escalated enforcement.</span>' 
            : '<span class="text-slate-500">No — First time offense</span>'}
        </div>
        ${v.repeatOffender ? `
        <div class="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p class="text-sm font-medium text-red-700 dark:text-red-400">⚠ Repeat Offender Alert</p>
          <p class="text-xs text-red-600 dark:text-red-300 mt-1">This household/business has multiple violations on record.</p>
        </div>` : ''}
      </div>
    `,
    `<button data-action="close-modal" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">Close</button>
     <button data-action="resolve-violation" data-id="${v.id}" class="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700">Resolve</button>
     <button data-action="escalate-violation" data-id="${v.id}" class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">Escalate</button>`
  );
}

// ─── View ────────────────────────────────────────────────────────────────────

export  function renderCompliance() {
  if (!COMPLIANCE_DATA.length) {
    loadComplianceData().then(() => {
        const main = document.getElementById('main-content');
        if (main) main.innerHTML = renderCompliance();
    });
    return '<div class="text-center py-8 text-slate-500">Loading violations...</div>';
  }
  const { total, repeat, critical, avgScore } = getSummary();

  return `
    <div class="space-y-6">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        ${renderList([
          { label: 'Total Violations', value: total, color: 'text-slate-700' },
          { label: 'Repeat Offenders', value: repeat, color: 'text-red-600' },
          { label: 'Critical Cases', value: critical, color: 'text-red-600' },
          { label: 'Avg Compliance Score', value: avgScore + '%', color: avgScore > 50 ? 'text-green-600' : 'text-red-600' },
        ], SummaryCard)}
      </div>

      <div class="flex flex-col sm:flex-row gap-3">
        ${searchInput('compliance-search', 'Search household or violation...')}
        <select id="compliance-risk-filter" class="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
          <option value="">All Risks</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
        </select>
        <select id="compliance-barangay-filter" class="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
          <option value="">All Barangays</option>
          <option value="San Jose">San Jose</option>
          <option value="Poblacion">Poblacion</option>
          <option value="Riverside">Riverside</option>
        </select>
        <select id="compliance-status-filter" class="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
          <option value="">All Statuses</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Escalated">Escalated</option>
        </select>
        <button id="compliance-clear-filters" class="px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">Clear</button>
      </div>

      ${card(`
        <div class="ui-card-body">
          <h3 class="ui-section-title mb-4">Violations List</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Household/Business</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Barangay</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Violation</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Risk</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Status</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Due Date</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Repeat</th>
                  <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody id="compliance-tbody" class="divide-y divide-slate-200 dark:divide-slate-700">
                ${renderList(COMPLIANCE_DATA, ViolationRow)}
                ${COMPLIANCE_DATA.length ? renderList(COMPLIANCE_DATA, ViolationRow) : `<tr><td colspan="8" class="px-4 py-8 text-center text-slate-500">No violations found</td></tr>`}
              </tbody>
            </table>
          </div>
        </div>
      `)}
    </div>
  `;
}

export function initComplianceFilters() {
  const apply = () => {
    const search = document.getElementById('compliance-search')?.value || '';
    const risk = document.getElementById('compliance-risk-filter')?.value || '';
    const barangay = document.getElementById('compliance-barangay-filter')?.value || '';
    const status = document.getElementById('compliance-status-filter')?.value || '';

    let filtered = COMPLIANCE_DATA;
    if (search) filtered = filterData(filtered, search, ['household', 'violation', 'type']);
    if (risk) filtered = filtered.filter(v => v.risk === risk);
    if (barangay) filtered = filtered.filter(v => v.barangay === barangay);
    if (status) filtered = filtered.filter(v => v.status === status);

    const tbody = document.getElementById('compliance-tbody');
    if (tbody) {
      tbody.innerHTML = filtered.length 
        ? renderList(filtered, ViolationRow) 
        : `<tr><td colspan="8" class="px-4 py-8 text-center text-slate-500">No violations match your filters</td></tr>`;
    }
  };

  ['compliance-search', 'compliance-risk-filter', 'compliance-barangay-filter', 'compliance-status-filter'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', apply);
    document.getElementById(id)?.addEventListener('change', apply);
  });

  document.getElementById('compliance-clear-filters')?.addEventListener('click', () => {
    document.getElementById('compliance-search').value = '';
    document.getElementById('compliance-risk-filter').value = '';
    document.getElementById('compliance-barangay-filter').value = '';
    document.getElementById('compliance-status-filter').value = '';
    apply();
  });
}