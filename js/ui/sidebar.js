import { icon } from '../utils/icons.js';
import { state } from '../state.js';
import { DATA } from '../data.js';
import { NAV, ROLE_META } from '../config.js';
import { emptyStateIllustrated } from '../utils/dom.js';

export function renderSidebar() {
  const nav = NAV[state.role];
  const navEl = document.getElementById('sidebar-nav');
  if (!navEl) return;
  
  navEl.innerHTML = nav.map(item => `
    <button type="button" data-nav="${item.id}" class="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${state.view === item.id ? 'active' : ''}">
      ${icon(item.icon, 'h-5 w-5 shrink-0')}
      <span>${item.label}</span>
    </button>
  `).join('');

  const meta = ROLE_META[state.role];
  document.getElementById('role-label').textContent = meta.label;
  document.getElementById('current-user-name').textContent = meta.userName;
  document.getElementById('current-user-role').textContent = meta.userRole;
  renderActivityFeed();
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