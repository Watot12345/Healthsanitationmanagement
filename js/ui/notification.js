import { DATA } from '../data.js';
import { badge } from '../utils/dom.js';

export function renderNotificationPanel() {
  const list = document.getElementById('notif-list');
  if (!list) return;
  
  list.innerHTML = DATA.notifications.map(n => `
    <div class="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 ${n.read ? 'opacity-60' : ''}">
      <div class="flex-1 min-w-0"><p class="text-sm font-medium">${n.msg}</p><p class="text-xs text-slate-500 mt-0.5">${n.time}</p></div>
      ${badge(n.type)}
    </div>
  `).join('');
  
  const unread = DATA.notifications.filter(n => !n.read).length;
  const dot = document.getElementById('notif-dot');
  if (dot) dot.classList.toggle('hidden', unread === 0);
}