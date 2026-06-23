import { state } from '../state.js';
import { DATA } from '../data.js';
import { getSearchValue, getSelectValue } from '../utils/search.js';
import { 
    badge, icon, card, cardHeader, emptyState, emptyStateIllustrated,
    skeletonCards, btnPrimary, btnSecondary, btnDanger, btnSuccess,
    searchInput, tableWrap, priorityBadge, doctorStatusDot, workflowStepper,
    growthChartPlaceholder, heatmapPlaceholder, miniCalendar
} from '../utils/dom.js';

// ─── View Renderers: Admin ───────────────────────────────────────────────────
function renderDashboard() {
  const k = DATA.kpis;
  const ss = DATA.systemStatus;
  const kpis = [
    { label: 'Total Users', value: k.totalUsers.toLocaleString(), color: 'bg-blue-500', icon: 'users' },
    { label: 'Active Staff', value: k.activeStaff, color: 'bg-green-500', icon: 'heart' },
    { label: 'Pending Requests', value: k.pendingRequests, color: 'bg-yellow-500', icon: 'clipboard' },
    { label: 'System Alerts', value: k.systemAlerts, color: 'bg-red-500', icon: 'alert' },
  ];
  const kpiCards = kpis.map(kpi => card(`
    <div class="ui-card-body flex items-start justify-between">
      <div><p class="text-sm text-slate-500 dark:text-slate-400">${kpi.label}</p><p class="text-3xl font-bold mt-1">${kpi.value}</p></div>
      <div class="p-3 rounded-xl ${kpi.color} text-white opacity-90">${icon(kpi.icon)}</div>
    </div>
  `)).join('');

  const statusCards = [
    { label: 'System Uptime', value: ss.uptime, icon: '✓', color: 'text-green-600' },
    { label: 'Active Sessions', value: ss.activeSessions, icon: '👤', color: 'text-blue-600' },
    { label: 'Pending Approvals', value: ss.pendingApprovals, icon: '⏳', color: 'text-yellow-600' },
  ].map(s => card(`<div class="ui-card-body flex items-center gap-4"><span class="text-2xl">${s.icon}</span><div><p class="text-xs text-slate-500 uppercase tracking-wider">${s.label}</p><p class="text-xl font-bold ${s.color}">${s.value}</p></div></div>`)).join('');

  const recentLogs = DATA.logs.slice(0, 4).map(l => `
    <div class="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700 last:border-0">
      <div><p class="text-sm font-medium">${l.action}</p><p class="text-xs text-slate-500">${l.user} · ${l.timestamp}</p></div>
      ${badge(l.level)}
    </div>
  `).join('');

  const updatesFeed = DATA.recentUpdates.map(u => `
    <div class="flex items-start gap-3 py-3 border-b border-slate-100 dark:border-slate-700 last:border-0">
      <div class="mt-0.5">${badge(u.type)}</div>
      <div class="flex-1 min-w-0"><p class="text-sm font-medium truncate">${u.title}</p><p class="text-xs text-slate-500">${u.module} · ${u.time}</p></div>
    </div>
  `).join('');

  const quickActions = state.role === 'admin' ? [
    { label: 'Add User', action: 'add-user', primary: true },
    { label: 'New Inspection', action: 'schedule-inspection', primary: false },
    { label: 'Add Patient', action: 'add-patient', primary: false },
    { label: 'Report Case', action: 'report-case', primary: false },
  ] : [
    { label: 'New Appointment', action: 'new-appointment', primary: true },
    { label: 'New Inspection', action: 'schedule-inspection', primary: false },
    { label: 'Add Patient', action: 'add-patient', primary: false },
    { label: 'Report Case', action: 'report-case', primary: false },
  ];

  return `<div class="space-y-6">
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">${kpiCards}</div>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">${statusCards}</div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      ${card(`<div class="ui-card-body"><h3 class="ui-section-title">Recent Activity</h3>${recentLogs || emptyState('No recent activity')}</div>`)}
      ${card(`<div class="ui-card-body"><h3 class="ui-section-title">Quick Actions</h3>
        <div class="grid grid-cols-2 gap-3">
          ${quickActions.map(a => a.primary ? btnPrimary(a.label, a.action, 'w-full justify-center') : btnSecondary(a.label, a.action, 'w-full justify-center')).join('')}
        </div></div>`)}
    </div>
    ${card(`<div class="ui-card-body"><h3 class="ui-section-title">Recent Updates Feed</h3>${updatesFeed}</div>`)}
    ${card(`<div class="ui-card-body">
      <div class="flex items-center justify-between mb-4"><h3 class="ui-section-title mb-0">System Alerts</h3>${badge('High')}</div>
      <div class="space-y-3">
        <div class="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          ${icon('alert', 'h-5 w-5 text-red-500 shrink-0 mt-0.5')}
          <div><p class="text-sm font-medium text-red-800 dark:text-red-300">Influenza outbreak detected in 3 barangays</p><p class="text-xs text-red-600 dark:text-red-400 mt-1">Requires immediate staff mobilization</p></div>
        </div>
        <div class="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
          ${icon('alert', 'h-5 w-5 text-yellow-500 shrink-0 mt-0.5')}
          <div><p class="text-sm font-medium text-yellow-800 dark:text-yellow-300">87 pending requests awaiting review</p><p class="text-xs text-yellow-600 dark:text-yellow-400 mt-1">Average wait time: 2.3 days</p></div>
        </div>
      </div>
    </div>`)}
  </div>`;
}

function renderUsers(filter = '') {
  const q = filter.toLowerCase();
  const filtered = DATA.users.filter(u =>
    !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q)
  );
  const rows = filtered.map(u => `<tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
    <td class="px-4 py-3 text-sm font-medium">${u.name}</td>
    <td class="px-4 py-3 text-sm text-slate-500">${u.email}</td>
    <td class="px-4 py-3 text-sm">${badge(u.role)}</td>
    <td class="px-4 py-3 text-sm">${badge(u.status)}</td>
    <td class="px-4 py-3 text-sm text-slate-500">${u.joined}</td>
    <td class="px-4 py-3 text-sm">
      <div class="flex gap-1">
        <button data-action="edit-user" data-id="${u.id}" class="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors" title="Edit">${icon('cog', 'h-4 w-4')}</button>
        <button data-action="delete-user" data-id="${u.id}" class="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors" title="Delete">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/></svg>
        </button>
      </div>
    </td>
  </tr>`).join('');

  return `<div class="space-y-4">
    <div class="flex flex-col sm:flex-row gap-3 justify-between">
      ${searchInput('user-search', 'Search users...')}
      ${btnPrimary('+ Add User', 'add-user')}
    </div>
    ${tableWrap(`<table class="w-full text-left"><thead class="bg-slate-50 dark:bg-slate-700/50"><tr>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Name</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Email</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Role</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Status</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Joined</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Actions</th>
    </tr></thead><tbody class="divide-y divide-slate-200 dark:divide-slate-700">${rows || `<tr><td colspan="6">${emptyState('No users found')}</td></tr>`}</tbody></table>`)}
  </div>`;
}

function renderLogs(filter = '') {
  const q = filter.toLowerCase();
  const filtered = DATA.logs.filter(l =>
    !q || l.action.toLowerCase().includes(q) || l.user.toLowerCase().includes(q) || l.module.toLowerCase().includes(q)
  );
  const rows = filtered.map(l => `<tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
    <td class="px-4 py-3 text-sm text-slate-500 whitespace-nowrap">${l.timestamp}</td>
    <td class="px-4 py-3 text-sm font-medium">${l.user}</td>
    <td class="px-4 py-3 text-sm">${l.action}</td>
    <td class="px-4 py-3 text-sm text-slate-500">${l.module}</td>
    <td class="px-4 py-3 text-sm">${badge(l.level)}</td>
  </tr>`).join('');

  return `<div class="space-y-4">
    ${searchInput('log-search', 'Search logs...')}
    ${tableWrap(`<table class="w-full text-left"><thead class="bg-slate-50 dark:bg-slate-700/50"><tr>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Timestamp</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">User</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Action</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Module</th>
      <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Level</th>
    </tr></thead><tbody class="divide-y divide-slate-200 dark:divide-slate-700">${rows}</tbody></table>`)}
  </div>`;
}

function renderAnalytics() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const values = [65, 78, 90, 81, 95, 88];
  const max = Math.max(...values);
  const bars = values.map((v, i) => `
    <div class="flex flex-col items-center gap-2 flex-1">
      <div class="w-full flex items-end justify-center h-40 bg-slate-50 dark:bg-slate-700/30 rounded-lg p-2">
        <div class="chart-bar w-8 sm:w-12 rounded-t-md bg-gov-500 hover:bg-gov-600 transition-colors" style="height:${(v / max) * 100}%"></div>
      </div>
      <span class="text-xs text-slate-500">${months[i]}</span>
    </div>
  `).join('');

  const summaries = [
    { title: 'Appointments', value: '342', change: '+12%', color: 'text-green-600' },
    { title: 'Permits Issued', value: '89', change: '+5%', color: 'text-green-600' },
    { title: 'Inspections', value: '156', change: '+8%', color: 'text-green-600' },
    { title: 'Cases Reported', value: '48', change: '-3%', color: 'text-red-600' },
  ].map(s => card(`<div class="p-4"><p class="text-sm text-slate-500">${s.title}</p><p class="text-2xl font-bold mt-1">${s.value}</p><p class="text-xs ${s.color} mt-1">${s.change} vs last month</p></div>`)).join('');

  return `<div class="space-y-6">
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">${summaries}</div>
    ${card(`<div class="p-5"><h3 class="font-semibold mb-6">Monthly Service Requests</h3><div class="flex gap-2 sm:gap-4">${bars}</div></div>`)}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      ${card(`<div class="p-5"><h3 class="font-semibold mb-4">Service Distribution</h3>
        <div class="space-y-3">
          ${[{l:'Health Center',p:35,c:'bg-blue-500'},{l:'Sanitation',p:25,c:'bg-green-500'},{l:'Immunization',p:20,c:'bg-yellow-500'},{l:'Wastewater',p:20,c:'bg-purple-500'}].map(i=>`
            <div><div class="flex justify-between text-sm mb-1"><span>${i.l}</span><span class="font-medium">${i.p}%</span></div>
            <div class="h-2 rounded-full bg-slate-100 dark:bg-slate-700"><div class="h-2 rounded-full ${i.c} progress-bar" style="width:${i.p}%"></div></div></div>`).join('')}
        </div></div>`)}
      ${card(`<div class="p-5"><h3 class="font-semibold mb-4">Staff Performance</h3>
        <div class="space-y-3">
          ${['Juan Dela Cruz - 94%','Ana Reyes - 91%','Carlos Tan - 88%','Elena Santos - 85%'].map(n=>`
            <div class="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50"><span class="text-sm">${n.split(' - ')[0]}</span><span class="text-sm font-semibold text-gov-600">${n.split(' - ')[1]}</span></div>`).join('')}
        </div></div>`)}
    </div>
  </div>`;
}

function renderSettings() {
  return `<div class="max-w-2xl space-y-6">
    ${card(`<div class="p-5"><h3 class="font-semibold mb-4">General Settings</h3>
      <form class="space-y-4" onsubmit="return false">
        <div><label class="block text-sm font-medium mb-1">System Name</label>
          <input type="text" value="Health & Sanitation Management System" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none"></div>
        <div><label class="block text-sm font-medium mb-1">Municipality</label>
          <input type="text" value="City of San Jose" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none"></div>
        <div><label class="block text-sm font-medium mb-1">Contact Email</label>
          <input type="email" value="health@sanjoce.gov.ph" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none"></div>
        ${btnPrimary('Save Changes', 'save-settings')}
      </form></div>`)}
    ${card(`<div class="p-5"><h3 class="font-semibold mb-4">Notification Settings</h3>
      <div class="space-y-3">
        ${['Email alerts for system errors','SMS notifications for outbreaks','Daily summary reports'].map((t,i)=>`
          <label class="flex items-center gap-3 cursor-pointer"><input type="checkbox" ${i<2?'checked':''} class="rounded border-slate-300 text-gov-600 focus:ring-gov-500"><span class="text-sm">${t}</span></label>`).join('')}
      </div></div>`)}
    ${card(`<div class="p-5"><h3 class="font-semibold mb-4 text-red-600">Danger Zone</h3>
      <p class="text-sm text-slate-500 mb-3">These actions cannot be undone.</p>
      <div class="flex gap-2">${btnDanger('Reset System Data', 'reset-system')} ${btnDanger('Clear All Logs', 'clear-logs')}</div></div>`)}
  </div>`;
}

// Export all renderers plus the rest from the next message
export { renderDashboard, renderUsers, renderLogs, renderAnalytics, renderSettings };
// Add these functions to js/renderers/index.js (continued from above)

function renderHealthCenter(filter = '') {
    const q = filter.toLowerCase();
    const appts = DATA.appointments.filter(a =>
      !q || a.patient.toLowerCase().includes(q) || a.service.toLowerCase().includes(q) || a.status.toLowerCase().includes(q)
    );
    const aptRows = appts.length ? appts.map(a => `<tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
      <td class="px-4 py-3 text-sm font-mono">${a.id}</td>
      <td class="px-4 py-3 text-sm font-medium">${a.patient}</td>
      <td class="px-4 py-3 text-sm">${a.service}</td>
      <td class="px-4 py-3 text-sm">${a.date}</td>
      <td class="px-4 py-3 text-sm">${a.time}</td>
      <td class="px-4 py-3 text-sm">${priorityBadge(a.triage || 'Low')}</td>
      <td class="px-4 py-3 text-sm">${badge(a.status)}</td>
      <td class="px-4 py-3 text-sm"><div class="flex gap-1">${btnSuccess('Approve', 'approve-apt')} ${btnDanger('Reject', 'reject-apt')}</div></td>
    </tr>`).join('') : `<tr><td colspan="8">${emptyState('No appointments match your search')}</td></tr>`;
  
    const patRows = DATA.patients.map(p => `<tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
      <td class="px-4 py-3 text-sm font-mono">${p.id}</td>
      <td class="px-4 py-3 text-sm font-medium">${p.name}</td>
      <td class="px-4 py-3 text-sm">${p.age}</td>
      <td class="px-4 py-3 text-sm">${p.bloodType}</td>
      <td class="px-4 py-3 text-sm">${priorityBadge(p.triage || 'Low')}</td>
      <td class="px-4 py-3 text-sm text-slate-500">${p.lastVisit}</td>
      <td class="px-4 py-3 text-sm">${p.condition}</td>
      <td class="px-4 py-3 text-sm"><button data-action="view-patient" data-id="${p.id}" class="text-gov-600 hover:underline text-sm">View</button></td>
    </tr>`).join('');
  
    const doctorCards = DATA.doctors.map(d => `
      <div class="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
        ${doctorStatusDot(d.status)}
        <div class="flex-1 min-w-0"><p class="text-sm font-medium truncate">${d.name}</p><p class="text-xs text-slate-500">${d.specialty}</p></div>
        ${badge(d.status)}
      </div>
    `).join('');
  
    const consultTimeline = DATA.consultationHistory.map((c, i) => `
      <div class="flex gap-4 ${i < DATA.consultationHistory.length - 1 ? 'pb-6' : ''}">
        <div class="flex flex-col items-center"><div class="timeline-dot h-3 w-3 rounded-full bg-gov-600"></div>${i < DATA.consultationHistory.length - 1 ? '<div class="w-0.5 flex-1 bg-slate-200 dark:bg-slate-700 mt-1"></div>' : ''}</div>
        <div><p class="text-sm font-medium">${c.diagnosis}</p><p class="text-xs text-slate-500">${c.date} · ${c.doctor}</p><p class="text-xs text-slate-400 mt-1">${c.notes}</p></div>
      </div>
    `).join('');
  
    return `<div class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        ${card(`<div class="ui-card-body"><h3 class="ui-section-title">Doctor Availability</h3><div class="space-y-2">${doctorCards}</div></div>`)}
        ${card(`<div class="ui-card-body"><h3 class="ui-section-title">Appointment Calendar</h3><div id="appointment-calendar" class="fc-container"></div></div>`, 'lg:col-span-2')}
      </div>
      ${card(`<div class="ui-card-body">${cardHeader('Appointment Queue', searchInput('apt-search', 'Search appointments...'))}
      ${tableWrap(`<table class="w-full text-left ui-table"><thead class="bg-slate-50 dark:bg-slate-700/50"><tr>
        <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">ID</th>
        <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Patient</th>
        <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Service</th>
        <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Date</th>
        <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Time</th>
        <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Triage</th>
        <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Status</th>
        <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Actions</th>
      </tr></thead><tbody class="divide-y divide-slate-200 dark:divide-slate-700">${aptRows}</tbody></table>`)}</div>`)}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        ${card(`<div class="ui-card-body"><h3 class="ui-section-title">Patient Records</h3>${tableWrap(`<table class="w-full text-left ui-table"><thead class="bg-slate-50 dark:bg-slate-700/50"><tr>
          <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">ID</th>
          <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Name</th>
          <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Age</th>
          <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Blood</th>
          <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Triage</th>
          <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Last Visit</th>
          <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Condition</th>
          <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500"></th>
        </tr></thead><tbody class="divide-y divide-slate-200 dark:divide-slate-700">${patRows}</tbody></table>`)}</div>`)}
        ${card(`<div class="ui-card-body"><h3 class="ui-section-title">Consultation History (P-101)</h3>${consultTimeline || emptyState('No consultation records')}</div>`)}
      </div>
    </div>`;
  }
  
  function renderSanitation(filter = '') {
    const q = filter.toLowerCase();
    const permits = DATA.permits.filter(p =>
      !q || p.applicant.toLowerCase().includes(q) || p.type.toLowerCase().includes(q) || p.status.toLowerCase().includes(q)
    );
    const rows = permits.length ? permits.map(p => `<tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
      <td class="px-4 py-3 text-sm font-mono">${p.id}</td>
      <td class="px-4 py-3 text-sm font-medium">${p.applicant}</td>
      <td class="px-4 py-3 text-sm">${p.type}</td>
      <td class="px-4 py-3 text-sm text-slate-500">${p.date}</td>
      <td class="px-4 py-3 text-sm">${badge(p.status)}</td>
      <td class="px-4 py-3 text-sm text-slate-500">${p.inspector}</td>
      <td class="px-4 py-3 text-sm"><div class="flex gap-1 flex-wrap">${btnSuccess('Approve', 'approve-permit')} ${btnDanger('Reject', 'reject-permit')} ${btnSecondary('Schedule', 'schedule-inspection')}</div></td>
    </tr>`).join('') : `<tr><td colspan="7">${emptyState('No permits match your search')}</td></tr>`;
  
    const inspRows = DATA.inspections.map(i => `<tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
      <td class="px-4 py-3 text-sm font-mono">${i.id}</td>
      <td class="px-4 py-3 text-sm">${i.permit}</td>
      <td class="px-4 py-3 text-sm">${i.date}</td>
      <td class="px-4 py-3 text-sm">${i.time}</td>
      <td class="px-4 py-3 text-sm">${i.inspector}</td>
      <td class="px-4 py-3 text-sm">${badge(i.status)}</td>
    </tr>`).join('');
  
    const docStatus = DATA.permitDocuments.map(d => `
      <div class="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50">
        <span class="text-sm">${d.name}</span>${badge(d.status)}
      </div>
    `).join('');
  
    const inspectorCards = [
      { name: 'Juan Dela Cruz', assigned: 3, status: 'Available' },
      { name: 'Ana Reyes', assigned: 2, status: 'Busy' },
    ].map(i => card(`<div class="ui-card-body flex items-center gap-3">
      <div class="h-10 w-10 rounded-full bg-gov-100 dark:bg-gov-900/30 flex items-center justify-center text-gov-600 font-bold text-sm">${i.name.charAt(0)}</div>
      <div class="flex-1"><p class="text-sm font-medium">${i.name}</p><p class="text-xs text-slate-500">${i.assigned} active inspections</p></div>
      ${badge(i.status)}
    </div>`)).join('');
  
    const checklistItems = ['Sanitation standards met','Food handling area clean','Waste disposal compliant','Water supply adequate','Pest control verified'];
  
    return `<div class="space-y-6">
      ${card(`<div class="ui-card-body"><h3 class="ui-section-title">Permit Workflow (SP-1042)</h3>${workflowStepper(['Submitted','Under Review','Inspection','Approved/Rejected'], 2)}</div>`)}
      <div class="flex flex-col sm:flex-row gap-3 justify-between">${searchInput('permit-search', 'Search permits...')}${btnPrimary('Schedule Inspection', 'schedule-inspection')}</div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          ${card(`<div class="ui-card-body"><h3 class="ui-section-title">Application Review</h3>${tableWrap(`<table class="w-full text-left ui-table"><thead class="bg-slate-50 dark:bg-slate-700/50"><tr>
            <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">ID</th>
            <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Applicant</th>
            <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Type</th>
            <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Date</th>
            <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Status</th>
            <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Inspector</th>
            <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Actions</th>
          </tr></thead><tbody class="divide-y divide-slate-200 dark:divide-slate-700">${rows}</tbody></table>`)}</div>`)}
          ${card(`<div class="ui-card-body"><h3 class="ui-section-title">Scheduled Inspections</h3>${tableWrap(`<table class="w-full text-left ui-table"><thead class="bg-slate-50 dark:bg-slate-700/50"><tr>
            <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">ID</th>
            <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Permit</th>
            <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Date</th>
            <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Time</th>
            <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Inspector</th>
            <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Status</th>
          </tr></thead><tbody class="divide-y divide-slate-200 dark:divide-slate-700">${inspRows}</tbody></table>`)}</div>`)}
        </div>
        <div class="space-y-6">
          ${card(`<div class="ui-card-body"><h3 class="ui-section-title">Inspector Assignment</h3><div class="space-y-3">${inspectorCards}</div></div>`)}
          ${card(`<div class="ui-card-body"><h3 class="ui-section-title">Document Upload Status</h3><div class="space-y-1">${docStatus}</div></div>`)}
          ${card(`<div class="ui-card-body"><h3 class="ui-section-title">Inspection Checklist</h3><div class="space-y-2">
            ${checklistItems.map((item,i)=>`<label class="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer"><input type="checkbox" ${i<3?'checked':''} class="rounded text-gov-600 focus:ring-gov-500"><span class="text-sm">${item}</span></label>`).join('')}
          </div></div>`)}
        </div>
      </div>
    </div>`;
  }
  
  function renderImmunization() {
    const reminders = DATA.vaccineReminders.map(r => card(`
      <div class="ui-card-body flex items-start gap-3 bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800">
        ${icon('alert', 'h-5 w-5 text-yellow-500 shrink-0 mt-0.5')}
        <div class="flex-1"><p class="text-sm font-medium">${r.child} — ${r.vaccine}</p><p class="text-xs text-slate-500">Due: ${r.dueDate}</p></div>
        ${badge(r.urgency)}
      </div>
    `)).join('');
  
    const vaccineTimeline = ['BCG (Birth)','Hep B (Birth)','DPT 1 (6 wks)','DPT 2 (10 wks)','MMR (12 mo)','Booster (18 mo)'];
    const timelineHtml = vaccineTimeline.map((v, i) => `
      <div class="flex gap-3 ${i < vaccineTimeline.length - 1 ? 'pb-4' : ''}">
        <div class="flex flex-col items-center"><div class="timeline-dot h-3 w-3 rounded-full ${i < 4 ? 'bg-green-500' : i === 4 ? 'bg-yellow-500' : 'bg-slate-300 dark:bg-slate-600'}"></div>${i < vaccineTimeline.length - 1 ? '<div class="w-0.5 flex-1 bg-slate-200 dark:bg-slate-700 mt-1"></div>' : ''}</div>
        <p class="text-sm ${i < 4 ? '' : 'text-slate-400'}">${v}</p>
      </div>
    `).join('');
  
    const cards = DATA.children.length ? DATA.children.map(c => card(`
      <div class="ui-card-body">
        <div class="flex justify-between items-start mb-3">
          <div><h4 class="font-semibold">${c.name}</h4><p class="text-sm text-slate-500">${c.age} · Mother: ${c.mother}</p></div>
          ${btnSecondary('Update', 'update-child', 'text-xs px-3 py-1.5')}
        </div>
        <div class="grid grid-cols-2 gap-2 mb-3 text-sm">
          <div><span class="text-slate-500">Weight:</span> <span class="font-medium">${c.weight}</span></div>
          <div><span class="text-slate-500">Nutrition:</span> ${badge(c.nutritionRisk)}</div>
        </div>
        <div class="mb-2 flex justify-between text-sm"><span>Vaccination Progress</span><span class="font-semibold">${c.vaccines}%</span></div>
        <div class="h-3 rounded-full bg-slate-100 dark:bg-slate-700 mb-3"><div class="h-3 rounded-full bg-green-500 progress-bar" style="width:${c.vaccines}%"></div></div>
        <p class="text-xs text-slate-500">Next due: <span class="font-medium text-gov-600">${c.nextDue}</span></p>
      </div>
    `)).join('') : emptyStateIllustrated('No child records', 'Add a child record to begin tracking');
  
    return `<div class="space-y-6">
      <div class="flex justify-between items-center">${btnPrimary('+ Add Child Record', 'add-child')}</div>
      ${reminders ? `<div class="grid grid-cols-1 md:grid-cols-2 gap-4"><h3 class="ui-section-title md:col-span-2">Vaccine Reminders</h3>${reminders}</div>` : ''}
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">${cards}</div>
        <div class="space-y-6">
          ${card(`<div class="ui-card-body"><h3 class="ui-section-title">Vaccination Schedule</h3>${timelineHtml}</div>`)}
          ${card(`<div class="ui-card-body"><h3 class="ui-section-title">Growth Tracking (Sofia Garcia)</h3><p class="text-xs text-slate-500 mb-2">Weight over 7 months</p>${growthChartPlaceholder()}</div>`)}
        </div>
      </div>
    </div>`;
  }
  
  function renderWastewater(filter = '') {
    const q = filter.toLowerCase();
    const items = DATA.wastewater.filter(w =>
      !q || w.requester.toLowerCase().includes(q) || w.type.toLowerCase().includes(q) || w.status.toLowerCase().includes(q)
    );
    const sorted = [...items].sort((a, b) => {
      const order = { Critical: 0, High: 1, Medium: 2, Low: 3 };
      return (order[a.priority] || 3) - (order[b.priority] || 3);
    });
    const rows = sorted.length ? sorted.map(w => `<tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
      <td class="px-4 py-3 text-sm">${priorityBadge(w.priority)}</td>
      <td class="px-4 py-3 text-sm font-mono">${w.id}</td>
      <td class="px-4 py-3 text-sm font-medium">${w.requester}</td>
      <td class="px-4 py-3 text-sm text-slate-500">${w.address}</td>
      <td class="px-4 py-3 text-sm">${w.type}</td>
      <td class="px-4 py-3 text-sm text-slate-500">${w.date}</td>
      <td class="px-4 py-3 text-sm">${badge(w.status)}</td>
      <td class="px-4 py-3 text-sm"><button data-action="view-checklist" class="text-gov-600 hover:underline text-sm">Checklist</button></td>
    </tr>`).join('') : `<tr><td colspan="8">${emptyState('No service requests found')}</td></tr>`;
  
    const timeline = ['Request Submitted', 'Assigned to Team', 'Inspection Scheduled', 'Work In Progress', 'Completed'];
    const timelineHtml = timeline.map((step, i) => `
      <div class="flex gap-4 ${i < timeline.length - 1 ? 'pb-6' : ''}">
        <div class="flex flex-col items-center"><div class="timeline-dot h-4 w-4 rounded-full ${i <= 2 ? 'bg-gov-600' : 'bg-slate-300 dark:bg-slate-600'}"></div>${i < timeline.length - 1 ? '<div class="w-0.5 flex-1 bg-slate-200 dark:bg-slate-700 mt-1"></div>' : ''}</div>
        <div class="pb-2"><p class="text-sm font-medium ${i <= 2 ? '' : 'text-slate-400'}">${step}</p></div>
      </div>
    `).join('');
  
    const techCards = DATA.technicians.map(t => card(`
      <div class="ui-card-body flex items-center gap-3">
        <div class="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-sm">${t.name.charAt(0)}</div>
        <div class="flex-1 min-w-0"><p class="text-sm font-medium truncate">${t.name}</p><p class="text-xs text-slate-500">${t.assignment}</p></div>
        ${badge(t.status)}
      </div>
    `)).join('');
  
    const beforeAfter = [
      { label: 'Before Inspection', status: 'Non-compliant', desc: 'Overflow detected, drainage blocked', color: 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10' },
      { label: 'After Inspection', status: 'Compliant', desc: 'Tank cleaned, drainage restored', color: 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10' },
    ].map(b => card(`<div class="ui-card-body ${b.color}"><p class="text-xs uppercase tracking-wider text-slate-500 mb-1">${b.label}</p><p class="font-semibold">${b.status}</p><p class="text-sm text-slate-500 mt-1">${b.desc}</p></div>`)).join('');
  
    return `<div class="space-y-6">
      ${searchInput('ww-search', 'Search service requests...')}
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          ${card(`<div class="ui-card-body"><h3 class="ui-section-title">Service Priority Queue</h3>${tableWrap(`<table class="w-full text-left ui-table"><thead class="bg-slate-50 dark:bg-slate-700/50"><tr>
            <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Priority</th>
            <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">ID</th>
            <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Requester</th>
            <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Address</th>
            <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Type</th>
            <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Date</th>
            <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Status</th>
            <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500"></th>
          </tr></thead><tbody class="divide-y divide-slate-200 dark:divide-slate-700">${rows}</tbody></table>`)}</div>`)}
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">${beforeAfter}</div>
        </div>
        <div class="space-y-6">
          ${card(`<div class="ui-card-body"><h3 class="ui-section-title">Technician Assignment</h3><div class="space-y-3">${techCards}</div></div>`)}
          ${card(`<div class="ui-card-body"><h3 class="ui-section-title">Maintenance Schedule</h3><p class="text-xs text-slate-500 mb-3">June 2026</p>${miniCalendar([8,15,22,28])}</div>`)}
          ${card(`<div class="ui-card-body"><h3 class="ui-section-title">Status Timeline (WW-202)</h3>${timelineHtml}</div>`)}
          ${card(`<div class="ui-card-body"><h3 class="ui-section-title">Inspection Checklist</h3>
            <div class="space-y-2">${['Tank condition assessed','Drainage system checked','Overflow prevention verified','Documentation complete','Safety protocols followed'].map((item,i)=>`
              <label class="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer"><input type="checkbox" ${i<3?'checked':''} class="rounded text-gov-600 focus:ring-gov-500"><span class="text-sm">${item}</span></label>`).join('')}
            </div>${btnPrimary('Submit Checklist', 'submit-checklist', 'mt-4')}</div>`)}
        </div>
      </div>
    </div>`;
  }
  
  function renderSurveillance(filter = '', severityFilter = '') {
    const q = filter.toLowerCase();
    const filtered = DATA.surveillance.filter(s => {
      const matchSearch = !q || s.disease.toLowerCase().includes(q) || s.barangay.toLowerCase().includes(q);
      const matchSev = !severityFilter || s.severity === severityFilter;
      return matchSearch && matchSev;
    });
  
    const outbreakBanner = `
      <div class="outbreak-banner flex items-center gap-3 p-4 rounded-xl bg-red-600 text-white mb-6">
        ${icon('alert', 'h-6 w-6 shrink-0')}
        <div class="flex-1"><p class="font-semibold">HIGH PRIORITY OUTBREAK ALERT</p><p class="text-sm text-red-100">Influenza cluster — 28 cases across multiple barangays. Immediate response required.</p></div>
        ${btnSecondary('View Details', 'report-case', 'bg-white/10 border-white/30 text-white hover:bg-white/20')}
      </div>`;
  
    const alertStyles = {
      red: { box: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800', icon: 'text-red-500' },
      yellow: { box: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800', icon: 'text-yellow-500' },
      green: { box: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800', icon: 'text-green-500' },
    };
    const alerts = [
      { level: 'High', msg: 'Influenza cluster detected — 28 cases across multiple barangays', color: 'red' },
      { level: 'Moderate', msg: 'Dengue cases rising in Barangay San Jose — 12 confirmed', color: 'yellow' },
      { level: 'Low', msg: 'Food poisoning incident contained — 3 cases in Poblacion', color: 'green' },
    ].map(a => `
      <div class="flex items-start gap-3 p-4 rounded-xl border ${alertStyles[a.color].box}">
        ${icon('alert', `h-5 w-5 shrink-0 mt-0.5 ${alertStyles[a.color].icon}`)}
        <div><p class="text-sm font-medium">${a.msg}</p>${badge(a.level)}</div>
      </div>
    `).join('');
  
    const trendCards = DATA.trends.map(t => card(`
      <div class="ui-card-body">
        <div class="flex justify-between items-start"><p class="text-sm font-medium">${t.disease}</p>${badge(t.trend)}</div>
        <p class="text-2xl font-bold mt-2">${t.cases}</p>
        <p class="text-xs ${t.trend === 'Rising' ? 'text-red-600' : t.trend === 'Declining' ? 'text-green-600' : 'text-blue-600'} mt-1">${t.change} vs last week</p>
      </div>
    `)).join('');
  
    const incidentFeed = DATA.incidents.map(inc => `
      <div class="flex gap-3 py-3 border-b border-slate-100 dark:border-slate-700 last:border-0">
        <div class="text-xs text-slate-400 whitespace-nowrap pt-0.5">${inc.time.split(' ')[1]}</div>
        <div class="flex-1"><p class="text-sm">${inc.event}</p><div class="mt-1">${badge(inc.severity)}</div></div>
      </div>
    `).join('');
  
    const rows = filtered.length ? filtered.map(s => `<tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
      <td class="px-4 py-3 text-sm font-mono">${s.id}</td>
      <td class="px-4 py-3 text-sm font-medium">${s.disease}</td>
      <td class="px-4 py-3 text-sm">${s.cases}</td>
      <td class="px-4 py-3 text-sm">${s.barangay}</td>
      <td class="px-4 py-3 text-sm">${badge(s.severity)}</td>
      <td class="px-4 py-3 text-sm text-slate-500">${s.date}</td>
    </tr>`).join('') : `<tr><td colspan="6">${emptyState('No cases match your filters')}</td></tr>`;
  
    return `<div class="space-y-6">
      ${outbreakBanner}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">${alerts}</div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">${trendCards}</div>
      <div class="flex flex-col sm:flex-row gap-3">
        ${searchInput('surv-search', 'Search cases...')}
        <select id="severity-filter" class="rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none">
          <option value="">All Severity</option>
          <option value="Low">Low</option>
          <option value="Moderate">Moderate</option>
          <option value="High">High</option>
        </select>
        ${btnPrimary('Report Case', 'report-case')}
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          ${card(`<div class="ui-card-body"><h3 class="ui-section-title">Case Reports</h3>${tableWrap(`<table class="w-full text-left ui-table"><thead class="bg-slate-50 dark:bg-slate-700/50"><tr>
            <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">ID</th>
            <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Disease</th>
            <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Cases</th>
            <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Barangay</th>
            <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Severity</th>
            <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Date</th>
          </tr></thead><tbody class="divide-y divide-slate-200 dark:divide-slate-700">${rows}</tbody></table>`)}</div>`)}
          ${card(`<div class="ui-card-body"><h3 class="ui-section-title">Case Heatmap by Barangay</h3><p class="text-xs text-slate-500 mb-3">Case density visualization (mock data)</p>${heatmapPlaceholder()}<div class="flex gap-4 mt-3 text-xs text-slate-500"><span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-red-200"></span> High</span><span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-yellow-200"></span> Moderate</span><span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-green-200"></span> Low</span></div></div>`)}
        </div>
        ${card(`<div class="ui-card-body"><h3 class="ui-section-title">Incident Timeline</h3>${incidentFeed}</div>`)}
      </div>
    </div>`;
  }
  
  // User renderers
  function renderProfile() {
    const p = DATA.userProfile;
    return `<div class="max-w-3xl space-y-6">
      ${card(`<div class="p-6">
        <div class="flex flex-col sm:flex-row items-center gap-6 mb-6">
          <div class="h-24 w-24 rounded-full bg-gov-100 dark:bg-gov-900/30 flex items-center justify-center text-gov-600 text-3xl font-bold">${p.name.charAt(0)}</div>
          <div class="text-center sm:text-left"><h3 class="text-xl font-bold">${p.name}</h3><p class="text-slate-500">${p.email}</p>${badge('Active')}</div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          ${[{l:'Phone',v:p.phone},{l:'Address',v:p.address},{l:'Birthdate',v:p.birthdate},{l:'Blood Type',v:p.bloodType},{l:'Emergency Contact',v:p.emergencyContact}].map(f=>`
            <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50"><p class="text-xs text-slate-500 uppercase tracking-wider">${f.l}</p><p class="text-sm font-medium mt-1">${f.v}</p></div>`).join('')}
        </div>
        ${btnSecondary('Edit Profile', 'edit-profile', 'mt-4')}
      </div>`)}
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        ${[{l:'Appointments',v:'3',c:'text-blue-600'},{l:'Active Requests',v:'2',c:'text-yellow-600'},{l:'Completed',v:'5',c:'text-green-600'}].map(s=>card(`
          <div class="p-4 text-center"><p class="text-2xl font-bold ${s.c}">${s.v}</p><p class="text-sm text-slate-500 mt-1">${s.l}</p></div>`)).join('')}
      </div>
    </div>`;
  }
  
  function renderBookAppointment() {
    return `<div class="max-w-xl">
      ${card(`<div class="p-6"><h3 class="font-semibold mb-4">Schedule an Appointment</h3>
        <form id="appointment-form" class="space-y-4" onsubmit="return false">
          <div><label class="block text-sm font-medium mb-1">Service Type</label>
            <select class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none">
              <option>General Checkup</option><option>Dental Consultation</option><option>Laboratory Test</option><option>Vaccination</option><option>Prenatal Care</option>
            </select></div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label class="block text-sm font-medium mb-1">Preferred Date</label>
              <input type="date" class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none"></div>
            <div><label class="block text-sm font-medium mb-1">Preferred Time</label>
              <select class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none">
                <option>08:00 AM</option><option>09:00 AM</option><option>10:00 AM</option><option>02:00 PM</option><option>03:00 PM</option>
              </select></div>
          </div>
          <div><label class="block text-sm font-medium mb-1">Reason for Visit</label>
            <textarea rows="3" placeholder="Describe your symptoms or reason..." class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none resize-none"></textarea></div>
          <button type="submit" data-action="submit-appointment" class="w-full py-3 rounded-xl bg-gov-600 text-white font-semibold text-base hover:bg-gov-700 transition-colors shadow-sm hover:shadow-md">Book Appointment</button>
        </form></div>`)}
    </div>`;
  }
  
  function renderRequestPermit() {
    return `<div class="max-w-xl">
      ${card(`<div class="p-6"><h3 class="font-semibold mb-4">Sanitation Permit Application</h3>
        <form class="space-y-4" onsubmit="return false">
          <div><label class="block text-sm font-medium mb-1">Business Name</label>
            <input type="text" placeholder="Enter business name" class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none"></div>
          <div><label class="block text-sm font-medium mb-1">Permit Type</label>
            <select class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none">
              <option>Food Establishment</option><option>Market Vendor</option><option>Bakery</option><option>Recreational Facility</option>
            </select></div>
          <div><label class="block text-sm font-medium mb-1">Business Address</label>
            <input type="text" placeholder="Full address" class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none"></div>
          <div><label class="block text-sm font-medium mb-1">Upload Documents</label>
            <div class="border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl p-6 text-center hover:border-gov-400 transition-colors cursor-pointer">
              <svg class="h-8 w-8 mx-auto text-slate-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"/></svg>
              <p class="text-sm text-slate-500">Click to upload or drag files here</p>
            </div></div>
          <button type="submit" data-action="submit-permit" class="w-full py-3 rounded-xl bg-gov-600 text-white font-semibold text-base hover:bg-gov-700 transition-colors">Submit Application</button>
        </form></div>`)}
    </div>`;
  }
  
  function renderMyImmunization() {
    const rows = DATA.userImmunization.map(r => `<tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
      <td class="px-4 py-3 text-sm font-medium">${r.vaccine}</td>
      <td class="px-4 py-3 text-sm text-slate-500">${r.date}</td>
      <td class="px-4 py-3 text-sm text-slate-500">${r.provider}</td>
      <td class="px-4 py-3 text-sm">${badge(r.status)}</td>
    </tr>`).join('');
  
    return `<div class="space-y-4 max-w-3xl">
      ${card(`<div class="p-5 flex items-center gap-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
        ${icon('shield', 'h-8 w-8 text-green-600')}
        <div><p class="font-semibold text-green-800 dark:text-green-300">Vaccination Status: Up to Date</p><p class="text-sm text-green-600 dark:text-green-400">3 of 4 recommended vaccines completed</p></div>
      </div>`)}
      ${tableWrap(`<table class="w-full text-left rounded-xl border border-slate-200 dark:border-slate-700"><thead class="bg-slate-50 dark:bg-slate-700/50"><tr>
        <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Vaccine</th>
        <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Date</th>
        <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Provider</th>
        <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Status</th>
      </tr></thead><tbody class="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-800">${rows}</tbody></table>`)}
    </div>`;
  }
  
  function renderRequestWastewater() {
    return `<div class="max-w-xl">
      ${card(`<div class="p-6"><h3 class="font-semibold mb-4">Request Wastewater / Septic Service</h3>
        <form class="space-y-4" onsubmit="return false">
          <div><label class="block text-sm font-medium mb-1">Service Type</label>
            <select class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none">
              <option>Septic Tank Cleaning</option><option>Septic Installation</option><option>Wastewater Inspection</option><option>Drainage Repair</option>
            </select></div>
          <div><label class="block text-sm font-medium mb-1">Property Address</label>
            <input type="text" value="123 Rizal St., Barangay San Jose" class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none"></div>
          <div><label class="block text-sm font-medium mb-1">Preferred Schedule</label>
            <input type="date" class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none"></div>
          <div><label class="block text-sm font-medium mb-1">Additional Notes</label>
            <textarea rows="3" placeholder="Describe the issue..." class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none resize-none"></textarea></div>
          <button type="submit" data-action="submit-wastewater" class="w-full py-3 rounded-xl bg-gov-600 text-white font-semibold text-base hover:bg-gov-700 transition-colors">Submit Request</button>
        </form></div>`)}
    </div>`;
  }
  
  function renderTrackRequests() {
    const barWidths = { Pending: 33, Approved: 66, Completed: 100, Rejected: 50 };
    const barColors = {
      Pending: 'bg-yellow-500',
      Approved: 'bg-green-500',
      Completed: 'bg-green-500',
      Rejected: 'bg-red-500',
    };
    const cards = DATA.userRequests.map(r => card(`
        <div class="p-5">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div><p class="text-xs font-mono text-slate-500">${r.id}</p><h4 class="font-semibold">${r.title}</h4><p class="text-sm text-slate-500">${r.type} · ${r.date}</p></div>
            ${badge(r.status)}
          </div>
          <div class="flex items-center gap-2">
            <div class="h-2 flex-1 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
              <div class="h-2 rounded-full progress-bar ${barColors[r.status] || 'bg-blue-500'}" style="width:${barWidths[r.status] || 50}%"></div>
            </div>
          </div>
        </div>
      `)).join('');
  
    const timeline = DATA.userRequests.map((r, i) => `
      <div class="flex gap-4 ${i < DATA.userRequests.length - 1 ? 'pb-8' : ''}">
        <div class="flex flex-col items-center">
          <div class="timeline-dot h-4 w-4 rounded-full ${r.status === 'Rejected' ? 'bg-red-500' : r.status === 'Pending' ? 'bg-yellow-500' : 'bg-green-500'}"></div>
          ${i < DATA.userRequests.length - 1 ? '<div class="w-0.5 flex-1 bg-slate-200 dark:bg-slate-700 mt-1"></div>' : ''}
        </div>
        <div><p class="text-sm font-medium">${r.title}</p><p class="text-xs text-slate-500">${r.type} · ${r.date}</p>${badge(r.status)}</div>
      </div>
    `).join('');
  
    return `<div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">${cards}</div>
      ${card(`<div class="ui-card-body"><h3 class="ui-section-title">Request Timeline</h3>${timeline}</div>`)}
    </div>`;
  }
  
  // ─── VIEW_RENDERERS Export ───────────────────────────────────────────────────
  export const VIEW_RENDERERS = {
    dashboard: () => renderDashboard(),
    users: () => renderUsers(getSearchValue('user-search')),
    logs: () => renderLogs(getSearchValue('log-search')),
    analytics: () => renderAnalytics(),
    settings: () => renderSettings(),
    'health-center': () => renderHealthCenter(getSearchValue('apt-search')),
    sanitation: () => renderSanitation(getSearchValue('permit-search')),
    immunization: () => renderImmunization(),
    wastewater: () => renderWastewater(getSearchValue('ww-search')),
    surveillance: () => renderSurveillance(getSearchValue('surv-search'), getSelectValue('severity-filter')),
    profile: () => renderProfile(),
    'book-appointment': () => renderBookAppointment(),
    'request-permit': () => renderRequestPermit(),
    'my-immunization': () => renderMyImmunization(),
    'request-wastewater': () => renderRequestWastewater(),
    'track-requests': () => renderTrackRequests(),
  };

  // Add this after the renderHealthCenter function
export function initHealthCenterCalendar() {
    const container = document.getElementById('appointment-calendar');
    if (!container) return;

    // Clear any existing content
    container.innerHTML = '';

    // Helper function to convert 12h time to 24h
    function convertTimeTo24h(timeStr) {
        if (!timeStr) return '00:00:00';
        const [time, period] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');
        hours = parseInt(hours);
        minutes = minutes || '00';
        
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        
        return `${String(hours).padStart(2, '0')}:${minutes}:00`;
    }

    // Helper function to get status colors
    function getStatusColor(status) {
        const colors = {
            'Pending': '#eab308',    // Yellow
            'Approved': '#22c55e',   // Green
            'Completed': '#3b82f6',  // Blue
            'Rejected': '#ef4444'    // Red
        };
        return colors[status] || '#6b7280';
    }

    // Helper function to get triage colors
    function getTriageColor(triage) {
        const colors = {
            'Low': '#22c55e',
            'Medium': '#eab308',
            'High': '#f97316',
            'Critical': '#ef4444'
        };
        return colors[triage] || '#6b7280';
    }

    // Transform appointments data to FullCalendar events
    const events = DATA.appointments.map(apt => ({
        id: apt.id,
        title: `${apt.patient}`,
        start: `${apt.date}T${convertTimeTo24h(apt.time)}`,
        backgroundColor: getStatusColor(apt.status),
        borderColor: getTriageColor(apt.triage),
        textColor: '#ffffff',
        extendedProps: {
            service: apt.service,
            status: apt.status,
            triage: apt.triage,
            patientId: apt.patient,
            time: apt.time
        }
    }));

    const calendar = new FullCalendar.Calendar(container, {
        initialView: 'dayGridMonth',
        height: 'auto',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        },
        buttonText: {
            today: 'Today',
            month: 'Month',
            week: 'Week',
            day: 'Day',
            list: 'List'
        },
        events: events,
        editable: false, // Set to true if you want drag & drop
        selectable: true,
        dayMaxEvents: 3, // Show max 3 events per day, rest in "+ more" popover
        navLinks: true, // Allow clicking on day/week numbers
        eventTimeFormat: {
            hour: '2-digit',
            minute: '2-digit',
            meridiem: 'short'
        },
        // Event tooltip
        eventDidMount: function(info) {
            const event = info.event;
            const props = event.extendedProps;
            
            // Add tooltip with appointment details
            const tooltip = document.createElement('div');
            tooltip.className = 'fc-tooltip';
            tooltip.innerHTML = `
                <div class="p-2">
                    <p class="font-semibold text-sm">${event.title}</p>
                    <p class="text-xs text-gray-500">${props.service}</p>
                    <p class="text-xs text-gray-500">${props.time}</p>
                    <div class="mt-1">
                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-${props.triage === 'Critical' ? 'red' : props.triage === 'High' ? 'orange' : 'yellow'}-100 text-${props.triage === 'Critical' ? 'red' : props.triage === 'High' ? 'orange' : 'yellow'}-800">${props.triage}</span>
                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-${props.status === 'Approved' ? 'green' : 'yellow'}-100 text-${props.status === 'Approved' ? 'green' : 'yellow'}-800 ml-1">${props.status}</span>
                    </div>
                </div>
            `;
            
            // Add tippy.js tooltip or simple title attribute
            info.el.title = `Patient: ${event.title}\nService: ${props.service}\nTime: ${props.time}\nTriage: ${props.triage}\nStatus: ${props.status}`;
        },
        
        // Event click handler
        eventClick: function(info) {
            const event = info.event;
            const props = event.extendedProps;
            
            // Show appointment details (you can replace with modal)
            if (typeof showToast !== 'undefined') {
                showToast(`${event.title} - ${props.service} (${props.status})`, 'info');
            }
        },
        
        // Date click handler
        dateClick: function(info) {
            if (typeof showToast !== 'undefined') {
                showToast(`Selected date: ${info.dateStr}. Click "New Appointment" to book.`, 'info');
            }
        }
    });

    calendar.render();

    // Store calendar instance for cleanup
    if (window.healthCenterCalendar) {
        window.healthCenterCalendar.destroy();
    }
    window.healthCenterCalendar = calendar;
}