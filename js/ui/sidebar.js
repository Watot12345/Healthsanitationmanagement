import { icon } from '../utils/icons.js';
import { state } from '../state.js';
import { DATA } from '../data.js';
import { NAV, ROLE_META } from '../config.js';
import { emptyStateIllustrated } from '../utils/dom.js';

const expanded = new Set();

export function toggleExpanded(id) {
  expanded.has(id) ? expanded.delete(id) : expanded.add(id);
  renderSidebar();
}

function renderActivityFeed() {
  const feed = document.getElementById('activity-feed');
  if (!feed) return;
  feed.innerHTML = DATA.logs.slice(0, 5).map(l => `
    <div class="activity-item">
      <p class="text-xs font-medium truncate">${l.action}</p>
      <p class="text-[10px] text-slate-400 mt-0.5">${l.user} · ${l.timestamp.split(' ')[1]}</p>
    </div>
  `).join('') || emptyStateIllustrated('No activity', 'Recent actions will appear here');
}

export function renderSidebar() {
const nav = NAV[state.role];
  const navEl = document.getElementById('sidebar-nav');
  if (!navEl) return;
  
  let lastSection = '';

  navEl.innerHTML = nav.map(item => {
    let prefix = '';

    if (item.divider) {
      prefix += '<div class="border-t border-slate-200 dark:border-slate-700 my-4"></div>';
    }

    if (item.section && item.section !== lastSection) {
      prefix += `<p class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 px-1">${item.section}</p>`;
      lastSection = item.section;
    }

    if (item.children) {
      const isOpen = expanded.has(item.id);
      const chevron = isOpen ? 'rotate-90' : '';

      return prefix + `
        <button type="button" data-toggle="${item.id}" class="nav-item w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
          <span class="flex items-center gap-3">
            ${icon(item.icon, 'h-5 w-5 shrink-0')}
            <span>${item.label}</span>
          </span>
          <svg class="h-4 w-4 shrink-0 transition-transform ${chevron}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/>
          </svg>
        </button>
        <div class="${isOpen ? '' : 'hidden'} ml-4 space-y-1 mt-1 mb-2">
          ${item.children.map(child => `
            <button type="button" data-nav="${child.id}" class="nav-item w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${state.view === child.id ? 'active' : ''}">
              ${icon(child.icon, 'h-4 w-4 shrink-0')}
              <span>${child.label}</span>
            </button>
          `).join('')}
        </div>
      `;
    }

    return prefix + `
      <button type="button" data-nav="${item.id}" class="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${state.view === item.id ? 'active' : ''}">
        ${icon(item.icon, 'h-5 w-5 shrink-0')}
        <span>${item.label}</span>
      </button>
    `;
  }).join('');

  const meta = ROLE_META[state.role];
  document.getElementById('role-label').textContent = meta.label;
  document.getElementById('current-user-name').textContent = meta.userName;
  document.getElementById('current-user-role').textContent = meta.userRole;
  renderActivityFeed();
}