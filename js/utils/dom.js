// REUSABLE UI COMPONENT FOR CONSISTENT STYLINGs

import { ICONS, icon } from './icons.js';

// ─── Utilities ─────────────────────────────────────────────────────────────
export { icon };

export function badge(status) {
  const map = {
'Escalated': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
'Resolved': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    Active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    Inactive: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    Approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    Completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    Rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    Scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    Due: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    Low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    Moderate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    High: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    Critical: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    Available: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    Busy: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    Offline: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
    Uploaded: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    Missing: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    Rising: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    Stable: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    Declining: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'On Site': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'En Route': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  };
  const cls = map[status] || 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400';
  return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}">${status}</span>`;
}

export function card(content, extra = '') {
  return `<div class="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200 ${extra}">${content}</div>`;
}

export function cardHeader(title, action = '') {
  return `<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4"><h3 class="ui-section-title mb-0">${title}</h3>${action}</div>`;
}

export function emptyState(msg) {
  return emptyStateIllustrated('No data available', msg);
}

export function emptyStateIllustrated(title, desc) {
  return `<div class="text-center py-12 px-4">
    <svg class="empty-state-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125v2.25m0 0h2.25m-2.25 0h-2.25M12 7.5V4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V7.5M12 7.5h3.375"/></svg>
    <p class="font-medium text-slate-600 dark:text-slate-300">${title}</p>
    <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">${desc}</p>
  </div>`;
}

export function skeletonBlock(w = 'w-full', h = 'h-4') {
  return `<div class="skeleton ${w} ${h}"></div>`;
}

export function skeletonCards(count = 3) {
  return Array(count).fill('').map(() => card(`<div class="ui-card-body space-y-3">${skeletonBlock()}${skeletonBlock('w-2/3')}${skeletonBlock('w-1/2', 'h-8')}</div>`)).join('');
}

export function tableHead(cols) {
  return `<thead><tr>${cols.map(c => `<th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">${c}</th>`).join('')}</tr></thead>`;
}

export function workflowStepper(steps, currentIndex) {
  return `<div class="stepper">${steps.map((step, i) => {
    const cls = i < currentIndex ? 'done' : i === currentIndex ? 'active' : '';
    return `<div class="stepper-step ${cls}"><div class="stepper-dot">${i < currentIndex ? '✓' : i + 1}</div><span class="stepper-label">${step}</span></div>`;
  }).join('')}</div>`;
}

export function miniCalendar(events = [5, 12, 18, 23, 28]) {
  const days = ['Su','Mo','Tu','We','Th','Fr','Sa'];
  const today = 22;
  let html = days.map(d => `<div class="cal-day text-xs text-slate-400 font-medium">${d}</div>`).join('');
  for (let i = 1; i <= 30; i++) {
    const cls = [events.includes(i) ? 'has-event' : '', i === today ? 'today' : ''].filter(Boolean).join(' ');
    html += `<div class="cal-day ${cls}">${i}</div>`;
  }
  return `<div class="cal-grid">${html}</div>`;
}

export function growthChartPlaceholder() {
  const heights = [40, 55, 48, 62, 58, 70, 65];
  return `<div class="flex items-end gap-2 h-32 pt-4">${heights.map((h, i) =>
    `<div class="flex-1 flex flex-col items-center gap-1"><div class="chart-bar w-full rounded-t bg-gov-400/80" style="height:${h}%"></div><span class="text-[10px] text-slate-400">M${i+1}</span></div>`
  ).join('')}</div>`;
}

export function heatmapPlaceholder() {
  const levels = ['bg-red-200 dark:bg-red-900/50','bg-yellow-200 dark:bg-yellow-900/50','bg-green-200 dark:bg-green-900/50','bg-blue-200 dark:bg-blue-900/50','bg-red-300 dark:bg-red-800/50','bg-yellow-100 dark:bg-yellow-900/30'];
  return `<div class="heatmap-grid">${Array(24).fill(0).map((_, i) => `<div class="heatmap-cell ${levels[i % levels.length]}" title="Barangay ${i+1}"></div>`).join('')}</div>`;
}

export function doctorStatusDot(status) {
  const map = { Available: 'status-dot-available', Busy: 'status-dot-busy', Offline: 'status-dot-offline' };
  return `<span class="status-dot ${map[status] || 'status-dot-offline'}"></span>`;
}

export function priorityBadge(p) {
  const colors = { Low: 'border-green-300 text-green-700 dark:border-green-700 dark:text-green-400', Medium: 'border-yellow-300 text-yellow-700 dark:border-yellow-700 dark:text-yellow-400', High: 'border-orange-300 text-orange-700 dark:border-orange-700 dark:text-orange-400', Critical: 'border-red-300 text-red-700 dark:border-red-700 dark:text-red-400' };
  return `<span class="inline-flex items-center px-2 py-0.5 rounded border text-xs font-semibold ${colors[p] || colors.Medium}">${p}</span>`;
}

export function btnPrimary(label, action, extra = '') {
  return `<button type="button" data-action="${action}" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gov-600 text-white text-sm font-medium hover:bg-gov-700 transition-colors shadow-sm hover:shadow ${extra}">${label}</button>`;
}

export function btnSecondary(label, action, extra = '') {
  return `<button type="button" data-action="${action}" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${extra}">${label}</button>`;
}

export function btnDanger(label, action) {
  return `<button type="button" data-action="${action}" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">${label}</button>`;
}

export function btnSuccess(label, action) {
  return `<button type="button" data-action="${action}" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">${label}</button>`;
}

export function searchInput(id, placeholder = 'Search...') {
  return `<div class="relative">
    <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/></svg>
    <input type="search" id="${id}" placeholder="${placeholder}" class="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-gov-500 transition-shadow">
  </div>`;
}

export function tableWrap(content) {
  return `<div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">${content}</div>`;
}
export function renderList(data, renderer) {
  return data.map(renderer).join('');
}

export function filterData(dataArray, query, fields) {
  const q = (query || '').toLowerCase().trim();
  if (!q) return dataArray;
  return dataArray.filter(item =>
    fields.some(field => {
      const value = item[field];
      return value && String(value).toLowerCase().includes(q);
    })
  );
}