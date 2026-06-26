/**
 * ============================================================================
 * RENDERERS INDEX MODULE
 * ============================================================================
 * 
 * PURPOSE:
 * Central rendering engine for the Health & Sanitation Management System.
 * Generates all HTML views using functional composition with reusable
 * UI components from dom.js and mock data from data.js.
 * 
 * ARCHITECTURE:
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │                        VIEW_RENDERERS (Export)                       │
 * │  Route name → render function (called by router on navigation)      │
 * ├─────────────────────────────────────────────────────────────────────┤
 * │  ADMIN MODULES               │  USER MODULES                        │
 * │  • dashboard                 │  • profile                           │
 * │  • users                     │  • book-appointment                  │
 * │  • logs (paginated+live)    │  • request-permit                     │
 * │  • analytics (ApexCharts)   │  • my-immunization                    │
 * │  • reports                   │  • request-wastewater                 │
 * │  • compliance                │  • track-requests                    │
 * │  • settings                  │                                       │
 * │  • health-center (FullCal)  │                                       │
 * │  • sanitation                │                                       │
 * │  • immunization              │                                       │
 * │  • wastewater                │                                       │
 * │  • surveillance              │                                       │
 * └─────────────────────────────────────────────────────────────────────┘
 * 
 * DEPENDENCIES:
 *   state.js        → Global app state (role, current view)
 *   data.js         → Mock data (DATA.kpis, DATA.logs, DATA.users, etc.)
 *   utils/search.js → getSearchValue(), getSelectValue()
 *   utils/dom.js    → UI helpers (card, badge, tableWrap, icon, etc.)
 *   reports.js      → renderReports() for reports module
 *   compliance.js   → renderCompliance() for compliance module
 * 
 * CONVENTIONS:
 *   - All render functions return HTML strings (not DOM nodes)
 *   - Filter values are read from DOM inputs on each render call
 *   - Interactive elements use data-action / data-id for event delegation
 *   - Search inputs have naming convention: {module}-search
 *   - Filter selects have naming convention: {type}-filter
 * 
 * ============================================================================
 * EXPORTED FUNCTIONS
 * ============================================================================
 */

// ─── CORE VIEW RENDERERS (exported via VIEW_RENDERERS) ────────────────────

/**
 * renderDashboard()
 * - Builds KPI cards from DATA.kpis using buildFromConfig()
 * - Renders system status cards (uptime, active sessions, approvals)
 * - Shows recent activity log (last 4 entries)
 * - Displays role-based quick actions (admin gets extra options)
 * - Includes recent updates feed from DATA.recentUpdates
 */

/**
 * renderUsers(filter)
 * - Searches/filters DATA.users by name, email, or role
 * - Renders user table with edit/delete action buttons
 * - Filter parameter comes from #user-search input
 */

/**
 * renderLogs(filter) - PAGINATED WITH ADVANCED FEATURES
 * - Client-side pagination (10 items/page) via logPagination state
 * - Multi-filter support: severity, module, user, date range
 * - Live log feed with configurable interval (toggle checkbox)
 * - Statistics dashboard: today's logs, errors/warnings, active users
 * - CSV export functionality
 * - Filter chips UI for quick filtering
 */

/**
 * renderAnalytics() - CHARTS DASHBOARD
 * - Date range filter buttons (7d, 30d, 90d, 1y) + custom date picker
 * - Static KPI cards (appointments, permits, inspections, cases)
 * - Trend chart (service requests over time)
 * - Disease surveillance chart (dengue, influenza, etc.)
 * - Heatmap (weekly activity by day/hour)
 * - Donut chart (service distribution)
 * - Staff performance bar chart
 * - Live activity feed
 */

/**
 * renderSettings()
 * - General settings form (system name, municipality, email)
 * - Notification preferences (email alerts, SMS, daily reports)
 * - Data management (audit log retention, session timeout, timezone)
 * - Security settings (password length, login attempts, 2FA toggle)
 * - Danger zone (reset data, clear logs, factory reset)
 */

/**
 * renderHealthCenter(filter) - FULLCALENDAR INTEGRATION
 * - Doctor availability cards with status dots
 * - Appointment calendar (FullCalendar initialized in initHealthCenterCalendar)
 * - Appointment queue table with triage badges and approve/reject actions
 * - Patient records table with blood type, condition, last visit
 * - Consultation history timeline for patient P-101
 */

/**
 * renderSanitation(filter)
 * - Permit workflow stepper (submitted → review → inspection → approved)
 * - Application review table with approve/reject/schedule actions
 * - Scheduled inspections table
 * - Inspector assignment cards
 * - Document upload status checklist
 * - Inspection checklist with checkbox items
 */

/**
 * renderImmunization()
 * - Vaccine reminders with urgency badges
 * - Child record cards with vaccination progress bars
 * - Vaccination schedule timeline (BCG through booster)
 * - Growth tracking chart placeholder
 * - Nutrition risk indicators
 */

/**
 * renderWastewater(filter)
 * - Priority-sorted service request queue (Critical → Low)
 * - Before/After inspection comparison cards
 * - Technician assignment cards
 * - Maintenance schedule mini calendar
 * - Status timeline for request tracking
 * - Inspection checklist with submit button
 */

/**
 * renderSurveillance(filter, severityFilter)
 * - Outbreak alert banner (conditional display)
 * - Alert cards by severity (red/yellow/green)
 * - Disease trend cards (rising/declining/stable)
 * - Case reports table with barangay breakdown
 * - Case density heatmap placeholder
 * - Incident timeline feed
 */

/**
 * renderProfile()
 * - User profile card with avatar, contact details
 * - Edit profile action button
 * - Summary statistics (appointments, active requests, completed)
 */

/**
 * renderBookAppointment()
 * - Service type selector dropdown
 * - Date/time picker form
 * - Reason for visit textarea
 * - Submit booking button
 */

/**
 * renderRequestPermit()
 * - Business name input
 * - Permit type selector
 * - Address field
 * - Document upload dropzone
 * - Submit application button
 */

/**
 * renderMyImmunization()
 * - Vaccination status banner (up to date / needs attention)
 * - Immunization record table (vaccine, date, provider, status)
 */

/**
 * renderRequestWastewater()
 * - Service type selector (septic cleaning, installation, etc.)
 * - Property address input
 * - Preferred schedule date picker
 * - Additional notes textarea
 * - Submit request button
 */

/**
 * renderTrackRequests()
 * - Request status cards with progress bars
 * - Request timeline visualization
 * - Color-coded by status (pending/approved/completed/rejected)
 */

// ─── LOGS MODULE STATE & HELPERS ──────────────────────────────────────────

/**
 * logPagination {Object}
 * - currentPage: Current page number (starts at 1)
 * - perPage: Items per page (10)
 * - totalPages: Calculated total pages
 * - totalFiltered: Total items matching current filters
 */

/**
 * getTodayLogCount()
 * - Returns count of log entries with today's date
 * - Falls back to 6 if no entries found (demo data)
 */

/**
 * getErrorWarningCount()
 * - Counts logs with level 'error' or 'warning'
 * - Used for error statistics dashboard card
 */

/**
 * getActiveUsers()
 * - Returns count of unique users in log data
 * - Uses Set for deduplication
 */

/**
 * getUniqueUsers()
 * - Returns array of unique user names from logs
 * - Used to populate user filter dropdown
 */

/**
 * exportLogsToCSV()
 * - Generates CSV file from current log data
 * - Creates Blob download with formatted filename
 * - Includes timestamp, user, action, module, level columns
 */

/**
 * renderPagination()
 * - Generates pagination HTML with page numbers
 * - Shows ellipsis for large page ranges
 * - Includes first/last and prev/next buttons
 * - Shows "Page X of Y (Z total logs)" info
 */

/**
 * applyLogFilters()
 * - Reads all active filter values from DOM elements
 * - Filters DATA.logs based on severity, module, user, date range
 * - Updates pagination state
 * - Re-renders table body and pagination controls
 */

/**
 * addNewLogEntry()
 * - Simulates real-time log entry (for live feed mode)
 * - Generates random log data with timestamp
 * - Inserts new row at top of table with highlight animation
 * - Removes last row if exceeding per-page limit
 * - Highlight fades after 1 second
 */

// ─── INITIALIZATION FUNCTIONS (called after DOM render) ──────────────────

/**
 * initLogFilters()
 * - Attaches change listeners to all filter dropdowns/inputs
 * - Sets up pagination button click handlers
 * - Wires up clear filters button
 * - Initializes CSV export button
 * - Sets up live log feed toggle with interval
 * - Resets pagination to page 1 on init
 */

/**
 * initAnalyticsCharts()
 * - Initializes all ApexCharts instances:
 *   → initTrendChart()      - Service requests area chart
 *   → initDiseaseChart()    - Disease surveillance line chart
 *   → initHeatmapChart()    - Weekly activity heatmap
 *   → initDonutChart()      - Service distribution donut
 *   → initStaffChart()      - Staff performance bar chart
 */

/**
 * initHealthCenterCalendar()
 * - Initializes FullCalendar instance in #appointment-calendar
 * - Transforms DATA.appointments into FullCalendar events
 * - Color-codes by status and triage priority
 * - Configures views: month, week, day, list
 * - Adds event click and date click handlers
 * - Stores instance globally for cleanup
 */

// ─── HELPER/CONFIG FUNCTIONS ──────────────────────────────────────────────

/**
 * buildFromConfig(source, config)
 * - Generic data mapper: transforms raw data using config array
 * - Each config item has: label, getValue(source), icon, color
 * - Used for KPI_CONFIG and STATUS_CONFIG
 */

/**
 * getQuickActions()
 * - Returns array of action buttons based on user role
 * - Admin gets: Add User (primary) + base actions
 * - Regular users get: New Appointment (primary) + base actions
 * - Base actions: New Inspection, Add Patient, Report Case
 */

/**
 * getDashboardModel()
 * - Assembles complete dashboard data model
 * - Combines KPIs, status, logs, updates, and quick actions
 * - Returns object consumed by renderDashboard()
 */

// ─── STATIC CONTENT HELPERS (for analytics demo data) ────────────────────

/**
 * renderStaticKPICard(title, value, change, trend, color)
 * - Renders KPI card with trend indicator arrow
 * - Trend: 'up' (green arrow) or 'down' (red arrow)
 * - Used for analytics dashboard summary cards
 */

/**
 * renderStaticActivityFeed()
 * - Generates mock activity feed entries
 * - Color-coded by type: info, success, warning, error
 * - Shows action, user, and relative time
 */

// ─── KPI/STATUS CONFIGURATIONS ───────────────────────────────────────────

/**
 * KPI_CONFIG
 * - Defines dashboard KPI cards structure:
 *   → Total Users (blue), Active Staff (green)
 *   → Pending Requests (yellow), System Alerts (red)
 */

/**
 * STATUS_CONFIG
 * - Defines system status indicators:
 *   → System Uptime (green), Active Sessions (blue)
 *   → Pending Approvals (yellow)
 */

// ─── VIEW_RENDERERS EXPORT MAP ───────────────────────────────────────────

/**
 * VIEW_RENDERERS {Object}
 * - Maps route/view names to their render functions
 * - Used by router to dynamically call correct renderer
 * - Some renderers accept filter params from search inputs
 * - surveillance uses both search and severity filters
 * 
 * Example usage:
 *   const html = VIEW_RENDERERS['dashboard']();
 *   document.getElementById('content').innerHTML = html;
 */
import { state } from '../state.js';
import { DATA } from '../data.js';
import { getSearchValue, getSelectValue } from '../utils/search.js';
import { 
    badge, icon, card, cardHeader, emptyState, emptyStateIllustrated,
    skeletonCards, btnPrimary, btnSecondary, btnDanger, btnSuccess,
    searchInput, tableWrap, priorityBadge, doctorStatusDot, workflowStepper,
    growthChartPlaceholder, heatmapPlaceholder, miniCalendar,
    renderList, filterData
} from '../utils/dom.js';
import { renderReports } from './reports.js';
import { renderCompliance } from './compliance.js';
import { renderPatients } from './HealthServices/patients.js';
import { renderConsultations, showConsultationDetail, showNewConsultation } from './HealthServices/consultations.js';
import { renderMedicalRecords } from './HealthServices/medicalRecords.js';
import { renderSanitationApplications, showNewApplication } from './sanitationPermits/applications.js';
import { renderInspections } from './sanitationPermits/inspections.js';
import { renderPermitRecords } from './sanitationPermits/permitRecords.js';
import { renderChildRecords } from './immunization/childRecords.js';
import { renderVaccinationTracking } from './immunization/vaccinationTracking.js';
import { renderGrowthCharts, initGrowthCharts } from './immunization/growthCharts.js';
import { renderSepticRegistry } from './wastewater/septicRegistry.js';
import { renderMaintenanceSchedule, initMaintenanceCalendar } from './wastewater/maintenanceSchedule.js';
import { renderServiceRequests } from './wastewater/serviceRequests.js';
import { renderCaseReports } from './surveillance/caseReports.js';
import { renderMappingClustering, initMappingClustering } from './surveillance/mappingClustering.js';
import { renderOutbreakDetection } from './surveillance/outbreakDetection.js';


function renderStaffDashboard() {
  return `
    <div class="space-y-6">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        ${KpiCard({ label: 'My Patients Today', value: '12', color: 'bg-blue-500', icon: 'users' })}
        ${KpiCard({ label: 'Pending Tasks', value: '5', color: 'bg-yellow-500', icon: 'clipboard' })}
        ${KpiCard({ label: 'Upcoming Inspections', value: '3', color: 'bg-gov-500', icon: 'shield' })}
        ${KpiCard({ label: 'Alerts', value: '2', color: 'bg-red-500', icon: 'alert' })}
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        ${card(`
          <div class="ui-card-body">
            <h3 class="ui-section-title">Today's Schedule</h3>
            <!-- appointments/consultations assigned to this staff -->
          </div>
        `)}
        ${card(`
          <div class="ui-card-body">
            <h3 class="ui-section-title">My Tasks</h3>
            <!-- pending inspections, reports to file, follow-ups -->
          </div>
        `)}
      </div>

      ${card(`
        <div class="ui-card-body">
          <h3 class="ui-section-title">Recent Activity</h3>
          <!-- staff's own recent actions -->
        </div>
      `)}
    </div>
  `;
}


function buildFromConfig(source, config) {
  return config.map(c => ({
    label: c.label,
    value: c.getValue(source),
    icon: c.icon,
    color: c.color,
  }));
}
const KPI_CONFIG = [
  { label: 'Total Users', icon: 'users', color: 'bg-blue-500', getValue: k => k.totalUsers.toLocaleString() },
  { label: 'Active Staff', icon: 'heart', color: 'bg-green-500', getValue: k => k.activeStaff },
  { label: 'Pending Requests', icon: 'clipboard', color: 'bg-yellow-500', getValue: k => k.pendingRequests },
  { label: 'System Alerts', icon: 'alert', color: 'bg-red-500', getValue: k => k.systemAlerts },
];
const STATUS_CONFIG = [
  { label: 'System Uptime', icon: '✓', color: 'text-green-600', getValue: s => s.uptime },
  { label: 'Active Sessions', icon: '👤', color: 'text-blue-600', getValue: s => s.activeSessions },
  { label: 'Pending Approvals', icon: '⏳', color: 'text-yellow-600', getValue: s => s.pendingApprovals },
];
function getQuickActions() {
  const base = [
    { label: 'New Inspection', action: 'schedule-inspection', primary: false },
    { label: 'Add Patient', action: 'add-patient', primary: false },
    { label: 'Report Case', action: 'report-case', primary: false },
  ];

  return state.role === 'admin'
    ? [{ label: 'Add User', action: 'add-user', primary: true }, ...base]
    : [{ label: 'New Appointment', action: 'new-appointment', primary: true }, ...base];
}
const KpiCard = kpi => card(`
  <div class="ui-card-body flex items-start justify-between">
    <div>
      <p class="text-sm text-slate-500 dark:text-slate-400">${kpi.label}</p>
      <p class="text-3xl font-bold mt-1">${kpi.value}</p>
    </div>
    <div class="p-3 rounded-xl ${kpi.color} text-white opacity-90">
      ${icon(kpi.icon)}
    </div>
  </div>
`);

const StatusCard = s => card(`
  <div class="ui-card-body flex items-center gap-4">
    <span class="text-2xl">${s.icon}</span>
    <div>
      <p class="text-xs text-slate-500 uppercase tracking-wider">${s.label}</p>
      <p class="text-xl font-bold ${s.color}">${s.value}</p>
    </div>
  </div>
`);

const LogItem = l => `
  <div class="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700 last:border-0">
    <div>
      <p class="text-sm font-medium">${l.action}</p>
      <p class="text-xs text-slate-500">${l.user} · ${l.timestamp}</p>
    </div>
    ${badge(l.level)}
  </div>
`;

const UpdateItem = u => `
  <div class="flex items-start gap-3 py-3 border-b border-slate-100 dark:border-slate-700 last:border-0">
    <div class="mt-0.5">${badge(u.type)}</div>
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium truncate">${u.title}</p>
      <p class="text-xs text-slate-500">${u.module} · ${u.time}</p>
    </div>
  </div>
`;

const QuickActionButton = a =>
  a.primary
    ? btnPrimary(a.label, a.action, 'w-full justify-center')
    : btnSecondary(a.label, a.action, 'w-full justify-center');
function getDashboardModel() {
  const k = DATA.kpis || { totalUsers: 0, activeStaff: 0, pendingRequests: 0, systemAlerts: 0 };
  const ss = DATA.systemStatus || { uptime: '99.8%', activeSessions: 0, pendingApprovals: 0 };

  return {
    kpis: buildFromConfig(k, KPI_CONFIG),
    status: buildFromConfig(ss, STATUS_CONFIG),
    logs: DATA.logs?.slice(0, 4) || [],
    updates: DATA.recentUpdates || [],
    quickActions: getQuickActions(),
  };
}
function renderDashboard() {
  const m = getDashboardModel();

  return `
    <div class="space-y-6">

      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        ${renderList(m.kpis, KpiCard)}
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        ${renderList(m.status, StatusCard)}
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        ${card(`
          <div class="ui-card-body">
            <h3 class="ui-section-title">Recent Activity</h3>
            ${renderList(m.logs, LogItem) || emptyState('No recent activity')}
          </div>
        `)}

        ${card(`
          <div class="ui-card-body">
            <h3 class="ui-section-title">Quick Actions</h3>
            <div class="grid grid-cols-2 gap-3">
              ${renderList(m.quickActions, QuickActionButton)}
            </div>
          </div>
        `)}

      </div>

      ${card(`
        <div class="ui-card-body">
          <h3 class="ui-section-title">Recent Updates Feed</h3>
          ${renderList(m.updates, UpdateItem)}
        </div>
      `)}

    </div>
  `;
}



function renderLogs(filter = '') {
  const q = filter.toLowerCase();
  let filtered = DATA.logs.filter(l =>
    !q || l.action.toLowerCase().includes(q) || l.user.toLowerCase().includes(q) || l.module.toLowerCase().includes(q)
  );
  
  // Apply current filters
  const severityFilter = document.getElementById('severity-filter')?.value || '';
  const moduleFilter = document.getElementById('module-filter')?.value || '';
  const userFilter = document.getElementById('user-filter')?.value || '';
  const dateFrom = document.getElementById('date-from-filter')?.value || '';
  const dateTo = document.getElementById('date-to-filter')?.value || '';

  if (severityFilter) filtered = filtered.filter(l => l.level === severityFilter);
  if (moduleFilter) filtered = filtered.filter(l => l.module === moduleFilter);
  if (userFilter) filtered = filtered.filter(l => l.user === userFilter);
  if (dateFrom) filtered = filtered.filter(l => l.timestamp >= dateFrom);
  if (dateTo) filtered = filtered.filter(l => l.timestamp <= dateTo + ' 23:59:59');
  
  // Pagination
  logPagination.totalFiltered = filtered.length;
  logPagination.totalPages = Math.ceil(filtered.length / logPagination.perPage);
  if (logPagination.currentPage > logPagination.totalPages) {
    logPagination.currentPage = Math.max(1, logPagination.totalPages);
  }
  
  const start = (logPagination.currentPage - 1) * logPagination.perPage;
  const paginatedLogs = filtered.slice(start, start + logPagination.perPage);
  
  const rows = paginatedLogs.map(l => `<tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
    <td class="px-4 py-3 text-sm text-slate-500 whitespace-nowrap">${l.timestamp}</td>
    <td class="px-4 py-3 text-sm font-medium">${l.user}</td>
    <td class="px-4 py-3 text-sm">${l.action}</td>
    <td class="px-4 py-3 text-sm text-slate-500">${l.module}</td>
    <td class="px-4 py-3 text-sm">${badge(l.level)}</td>
  </tr>`).join('');

  return `<div class="space-y-6">
    <!-- Log Statistics Dashboard -->
    <div id="log-stats" class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      ${card(`<div class="p-4">
        <div class="flex items-center justify-between">
          <p class="text-sm text-slate-500">Total Logs Today</p>
          <svg class="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>
        </div>
        <p class="text-2xl font-bold mt-2" id="total-logs-today">${getTodayLogCount()}</p>
        <p class="text-xs text-slate-500 mt-1">+12% from yesterday</p>
      </div>`)}
      
      ${card(`<div class="p-4">
        <div class="flex items-center justify-between">
          <p class="text-sm text-slate-500">Errors & Warnings</p>
          <svg class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>
        </div>
        <p class="text-2xl font-bold mt-2 text-red-600" id="error-count">${getErrorWarningCount()}</p>
        <p class="text-xs text-red-500 mt-1">Needs attention</p>
      </div>`)}
      
      ${card(`<div class="p-4">
        <div class="flex items-center justify-between">
          <p class="text-sm text-slate-500">Active Users</p>
          <svg class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/></svg>
        </div>
        <p class="text-2xl font-bold mt-2" id="active-users">${getActiveUsers()}</p>
        <p class="text-xs text-slate-500 mt-1">Last 24 hours</p>
      </div>`)}
      
      ${card(`<div class="p-4">
        <div class="flex items-center justify-between">
          <p class="text-sm text-slate-500">Peak Hours</p>
          <svg class="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <p class="text-2xl font-bold mt-2">${getPeakHours()}</p>
        <p class="text-xs text-slate-500 mt-1">AM activity spike</p>
      </div>`)}
    </div>

    <!-- Filters & Search Bar -->
    <div class="space-y-4">
      <div class="flex flex-col sm:flex-row gap-3">
        ${searchInput('log-search', 'Search logs by keyword...')}
        <button id="export-csv-btn" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/></svg>
          Export CSV
        </button>
      </div>
      
      <!-- Filter Chips -->
      <div class="flex flex-wrap gap-2">
        <span class="text-xs text-slate-500 self-center mr-2">Filter by:</span>
        
        <select id="severity-filter" class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
          <option value="">All Severity</option>
          <option value="info">ℹ️ Info</option>
          <option value="success">✅ Success</option>
          <option value="warning">⚠️ Warning</option>
          <option value="error">🔴 Error</option>
        </select>
        
        <select id="module-filter" class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
          <option value="">All Modules</option>
          <option value="Authentication">Authentication</option>
          <option value="User Management">User Management</option>
          <option value="Patient Records">Patient Records</option>
          <option value="Health Center">Health Center</option>
          <option value="Sanitation">Sanitation</option>
          <option value="Immunization">Immunization</option>
          <option value="Wastewater">Wastewater</option>
          <option value="Surveillance">Surveillance</option>
          <option value="Security">Security</option>
          <option value="System">System</option>
        </select>
        
        <select id="user-filter" class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
          <option value="">All Users</option>
          ${getUniqueUsers().map(u => `<option value="${u}">${u}</option>`).join('')}
        </select>
        
        <input type="date" id="date-from-filter" class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" title="From date">
        <input type="date" id="date-to-filter" class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" title="To date">
        
        <button id="clear-filters-btn" class="px-3 py-1.5 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
          Clear Filters
        </button>
      </div>
    </div>

    <!-- Live Log Feed Toggle -->
    <div class="flex items-center gap-3">
      <label class="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" id="live-log-toggle" class="rounded text-gov-600 focus:ring-gov-500">
        <span class="text-sm text-slate-600 dark:text-slate-400">Live Log Feed</span>
      </label>
      <span class="text-xs text-slate-400" id="live-status">Paused</span>
    </div>

    <!-- Logs Table -->
    ${tableWrap(`<table class="w-full text-left">
      <thead class="bg-slate-50 dark:bg-slate-700/50">
        <tr>
          <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Timestamp</th>
          <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">User</th>
          <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Action</th>
          <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Module</th>
          <th class="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Level</th>
        </tr>
      </thead>
      <tbody id="logs-tbody" class="divide-y divide-slate-200 dark:divide-slate-700">
        ${rows || `<tr><td colspan="5">${emptyState('No logs found')}</td></tr>`}
      </tbody>
    </table>`)}
    
    <!-- Pagination Container -->
    <div id="pagination-container">
      ${renderPagination()}
    </div>
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
// Add this state at the top of the file (near other variables)
let logPagination = {
  currentPage: 1,
  perPage: 10,
  totalPages: 1,
  totalFiltered: 0
};

// Helper functions for log statistics
function getPeakHours() {
  const hours = DATA.logs.map(l => {
    const time = l.timestamp.split(' ')[1];
    return parseInt(time.split(':')[0]);
  });
  
  if (!hours.length) return 'No data';
  
  // Count logs per hour
  const counts = {};
  hours.forEach(h => counts[h] = (counts[h] || 0) + 1);
  
  // Find peak hour
  let peak = 0, max = 0;
  for (const [hour, count] of Object.entries(counts)) {
    if (count > max) { max = count; peak = parseInt(hour); }
  }
  
  const start = peak;
  const end = start + 2;
  const ampm = start >= 12 ? 'PM' : 'AM';
  return `${start}:00 - ${end}:00 ${ampm}`;
}
function getTodayLogCount() {
  const today = new Date().toISOString().split('T')[0];
  const count = DATA.logs.filter(l => {
    const logDate = l.timestamp.split(' ')[0];
    return logDate === today;
  }).length;
  return count || DATA.logs.length; // Fallback: show total if no today match
}

function getErrorWarningCount() {
  return DATA.logs.filter(l => l.level === 'error' || l.level === 'warning').length;
}

function getActiveUsers() {
  return [...new Set(DATA.logs.map(l => l.user))].length;
}

function getUniqueUsers() {
  return [...new Set(DATA.logs.map(l => l.user))];
}

// Export function for CSV
function exportLogsToCSV() {
  const headers = ['Timestamp', 'User', 'Action', 'Module', 'Level'];
  const rows = DATA.logs.map(l => [l.timestamp, l.user, l.action, l.module, l.level]);
  
  let csv = headers.join(',') + '\n';
  rows.forEach(row => {
    csv += row.map(cell => `"${cell}"`).join(',') + '\n';
  });
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `system-logs-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
}

// Generate pagination HTML
function renderPagination() {
  if (logPagination.totalPages <= 1) return '';
  
  const current = logPagination.currentPage;
  const total = logPagination.totalPages;
  
  let pageNumbers = '';
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - 1 && i <= current + 1)) {
      pageNumbers += `<button class="page-btn px-3 py-1.5 rounded-lg text-sm ${i === current ? 'bg-gov-600 text-white' : 'border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'}" data-page="${i}">${i}</button>`;
    } else if (i === current - 2 || i === current + 2) {
      pageNumbers += `<span class="px-1 text-slate-400">...</span>`;
    }
  }
  
  return `
    <div class="flex items-center justify-between pt-2">
      <div class="text-sm text-slate-500">
        Page ${current} of ${total} (${logPagination.totalFiltered} total logs)
      </div>
      <div class="flex gap-1">
        <button class="page-btn px-3 py-1.5 rounded-lg text-sm border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed" 
          data-page="1" ${current === 1 ? 'disabled' : ''}>««</button>
        <button class="page-btn px-3 py-1.5 rounded-lg text-sm border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed" 
          data-page="${current - 1}" ${current === 1 ? 'disabled' : ''}>«</button>
        ${pageNumbers}
        <button class="page-btn px-3 py-1.5 rounded-lg text-sm border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed" 
          data-page="${current + 1}" ${current === total ? 'disabled' : ''}>»</button>
        <button class="page-btn px-3 py-1.5 rounded-lg text-sm border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed" 
          data-page="${total}" ${current === total ? 'disabled' : ''}>»»</button>
      </div>
    </div>`;
}

// Initialize log filters and live feed
export function initLogFilters() {
  // Reset pagination on init
  logPagination.currentPage = 1;
  
  // Filter change handlers - reset to page 1
  ['severity-filter', 'module-filter', 'user-filter', 'date-from-filter', 'date-to-filter'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', () => {
        logPagination.currentPage = 1;
        applyLogFilters();
      });
    }
  });
  
  // Pagination button handlers
  document.querySelectorAll('.page-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const page = parseInt(e.target.dataset.page);
      if (page && page >= 1 && page <= logPagination.totalPages) {
        logPagination.currentPage = page;
        applyLogFilters();
      }
    });
  });
  
  // Clear filters
  const clearBtn = document.getElementById('clear-filters-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      logPagination.currentPage = 1;
      ['severity-filter', 'module-filter', 'user-filter'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
      ['date-from-filter', 'date-to-filter'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
      applyLogFilters();
    });
  }
  
  // Export button
  const exportBtn = document.getElementById('export-csv-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', exportLogsToCSV);
  }
  
  // Live log feed
  const liveToggle = document.getElementById('live-log-toggle');
  const liveStatus = document.getElementById('live-status');
  if (liveToggle && liveStatus) {
    let liveInterval;
    liveToggle.addEventListener('change', (e) => {
      if (e.target.checked) {
        liveStatus.textContent = 'Live';
        liveStatus.classList.add('text-green-500');
        liveInterval = setInterval(() => {
          addNewLogEntry();
        }, 5000);
      } else {
        liveStatus.textContent = 'Paused';
        liveStatus.classList.remove('text-green-500');
        clearInterval(liveInterval);
      }
    });
  }
}

function applyLogFilters() {
  const severity = document.getElementById('severity-filter')?.value || '';
  const module = document.getElementById('module-filter')?.value || '';
  const user = document.getElementById('user-filter')?.value || '';
  const dateFrom = document.getElementById('date-from-filter')?.value || '';
  const dateTo = document.getElementById('date-to-filter')?.value || '';
  
  let filtered = DATA.logs;
  
  if (severity) filtered = filtered.filter(l => l.level === severity);
  if (module) filtered = filtered.filter(l => l.module === module);
  if (user) filtered = filtered.filter(l => l.user === user);
  if (dateFrom) filtered = filtered.filter(l => l.timestamp >= dateFrom);
  if (dateTo) filtered = filtered.filter(l => l.timestamp <= dateTo + ' 23:59:59');
  
  // Update pagination
  logPagination.totalFiltered = filtered.length;
  logPagination.totalPages = Math.ceil(filtered.length / logPagination.perPage);
  if (logPagination.currentPage > logPagination.totalPages) {
    logPagination.currentPage = Math.max(1, logPagination.totalPages);
  }
  
  // Get current page data
  const start = (logPagination.currentPage - 1) * logPagination.perPage;
  const paginatedLogs = filtered.slice(start, start + logPagination.perPage);
  
  // Update table body
  const tbody = document.getElementById('logs-tbody');
  if (tbody) {
    tbody.innerHTML = paginatedLogs.length ? paginatedLogs.map(l => `<tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-500 whitespace-nowrap">${l.timestamp}</td>
      <td class="px-4 py-3 text-sm font-medium">${l.user}</td>
      <td class="px-4 py-3 text-sm">${l.action}</td>
      <td class="px-4 py-3 text-sm text-slate-500">${l.module}</td>
      <td class="px-4 py-3 text-sm">${badge(l.level)}</td>
    </tr>`).join('') : `<tr><td colspan="5">${emptyState('No logs match your filters')}</td></tr>`;
  }
  
  // Update pagination controls
  const paginationContainer = document.getElementById('pagination-container');
  if (paginationContainer) {
    paginationContainer.innerHTML = renderPagination();
    // Re-bind pagination buttons
    paginationContainer.querySelectorAll('.page-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const page = parseInt(e.target.dataset.page);
        if (page && page >= 1 && page <= logPagination.totalPages) {
          logPagination.currentPage = page;
          applyLogFilters();
        }
      });
    });
  }
}

function addNewLogEntry() {
  const tbody = document.getElementById('logs-tbody');
  if (!tbody) return;
  
  const newLog = {
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    user: ['System', 'Maria Santos', 'Juan Dela Cruz'][Math.floor(Math.random() * 3)],
    action: 'Live: New activity detected',
    module: ['System', 'Security', 'Health Center'][Math.floor(Math.random() * 3)],
    level: ['info', 'warning', 'success'][Math.floor(Math.random() * 3)]
  };
  
  const row = document.createElement('tr');
  row.className = 'hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors new-log-entry';
  row.style.backgroundColor = '#fef3c7';
  row.innerHTML = `
    <td class="px-4 py-3 text-sm text-slate-500 whitespace-nowrap">${newLog.timestamp}</td>
    <td class="px-4 py-3 text-sm font-medium">${newLog.user}</td>
    <td class="px-4 py-3 text-sm">${newLog.action}</td>
    <td class="px-4 py-3 text-sm text-slate-500">${newLog.module}</td>
    <td class="px-4 py-3 text-sm">${badge(newLog.level)}</td>
  `;
  
  tbody.insertBefore(row, tbody.firstChild);
  
  // Remove last row if exceeding per page limit
  if (tbody.children.length > logPagination.perPage) {
    tbody.removeChild(tbody.lastChild);
  }
  
  setTimeout(() => {
    row.style.transition = 'background-color 1s';
    row.style.backgroundColor = '';
  }, 1000);
}

function renderAnalytics() {
  return `<div class="space-y-6">
    <!-- Date Range Filter -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <div class="flex gap-2 flex-wrap">
        <button class="date-filter-btn px-3 py-1.5 rounded-lg text-sm font-medium bg-gov-600 text-white" data-range="7d">7 Days</button>
        <button class="date-filter-btn px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600" data-range="30d">30 Days</button>
        <button class="date-filter-btn px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600" data-range="90d">90 Days</button>
        <button class="date-filter-btn px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600" data-range="1y">1 Year</button>
      </div>
      <div class="flex gap-2 items-center text-sm">
        <input type="date" id="dateFrom" class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
        <span class="text-slate-500">to</span>
        <input type="date" id="dateTo" class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
        <button id="refresh-analytics-btn" class="px-4 py-1.5 rounded-lg bg-gov-600 text-white text-sm font-medium hover:bg-gov-700">Apply</button>
      </div>
    </div>

<<<<<<< HEAD
=======
      <!-- AI Insights Redesign -->
      <div class="ai-glass-card relative overflow-hidden p-6 rounded-2xl border border-white/20 dark:border-slate-800/30 shadow-xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl transition-all duration-300">
        <!-- Animated Mesh and Particles Background -->
        <div class="absolute inset-0 -z-10 ai-mesh-bg opacity-30 dark:opacity-20 pointer-events-none"></div>
        <div class="absolute inset-0 -z-10 ai-particles pointer-events-none">
          <div class="particle p1"></div>
          <div class="particle p2"></div>
          <div class="particle p3"></div>
        </div>

        <!-- Header -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 dark:border-slate-800/20 pb-4 mb-5">
          <div class="flex items-center gap-4">
            <!-- AI Avatar Container -->
            <div id="ai-avatar-container" class="relative flex-shrink-0 w-16 h-16 rounded-full">
              <div class="avatar-ring absolute inset-0 rounded-full"></div>
              <div class="avatar-core absolute inset-[3px] rounded-full flex items-center justify-center bg-gradient-to-tr from-blue-600 to-cyan-500 shadow-inner">
                <svg class="w-8 h-8 text-white avatar-brain-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.467 5.99 5.99 0 0 0-1.925-3.546 5.974 5.974 0 0 1-2.133-1A3.75 3.75 0 0 0 2.25 12c0 1.257.625 2.368 1.583 3.033A3.743 3.743 0 0 0 3 15.75c0 .352.049.69.141 1.013A3.75 3.75 0 0 0 7.5 19.5h.75a3.75 3.75 0 0 0 3.75-3.75v-.75Z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 0 1-.495-7.467 5.99 5.99 0 0 1 1.925-3.546 5.974 5.974 0 0 0 2.133-1A3.75 3.75 0 0 1 21.75 12c0 1.257-.625 2.368-1.583 3.033A3.743 3.743 0 0 1 21 15.75c0 .352-.049.69-.141 1.013A3.75 3.75 0 0 1 16.5 19.5h-.75a3.75 3.75 0 0 1-3.75-3.75v-.75Z" />
                </svg>
              </div>
              <div class="orbiting-dot dot1"></div>
              <div class="orbiting-dot dot2"></div>
            </div>

            <!-- Title / Subtitle & Status -->
            <div class="text-center sm:text-left">
              <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h3 class="font-bold text-lg text-slate-800 dark:text-slate-100 tracking-tight leading-none">Municipal AI Assistant</h3>
                <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  AI Online
                </span>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Powered by Gemini AI Decision Support</p>
            </div>
          </div>

          <!-- Refresh Button -->
          <button id="ai-refresh-btn" class="flex items-center justify-center w-10 h-10 rounded-xl bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-700/80 border border-slate-200/50 dark:border-slate-700/50 shadow-sm transition-all duration-200 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 focus:outline-none" title="Refresh Insights">
            <svg id="ai-refresh-icon" class="w-5 h-5 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </button>
        </div>

        <!-- Scrollable Insights Area -->
        <div id="ai-insights-scrollable" class="min-h-[160px] max-h-[380px] overflow-y-auto pr-1">
          <div id="ai-insights" class="space-y-4">
            <!-- Loading indicator or insights will be rendered here dynamically -->
            <div class="flex items-center gap-2 text-sm text-slate-500">
              <svg class="animate-spin h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              Initializing assistant...
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between mt-5 pt-3 border-t border-white/10 dark:border-slate-800/20 text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">
          <div>Last Analyzed: <span id="ai-last-analyzed">Never</span></div>
          <div id="ai-current-time">UTC</div>
        </div>
      </div>

>>>>>>> 0e6ec516f61032bb17df9534c68734e60fcf141d
    <!-- KPI Cards -->
    <div id="kpi-cards" class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      ${renderStaticKPICard('Appointments', '342', '+12%', 'up', '#3b82f6')}
      ${renderStaticKPICard('Permits Issued', '89', '+5%', 'up', '#22c55e')}
      ${renderStaticKPICard('Inspections', '156', '+8%', 'up', '#eab308')}
      ${renderStaticKPICard('Cases Reported', '48', '-3%', 'down', '#ef4444')}
    </div>
<<<<<<< HEAD
    
=======

>>>>>>> 0e6ec516f61032bb17df9534c68734e60fcf141d
    <!-- Main Trend Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      ${card(`<div class="p-5">
        <h3 class="font-semibold mb-4">Service Requests Trend</h3>
        <div id="trendChart" style="min-height: 350px;"></div>
      </div>`)}
      
      ${card(`<div class="p-5">
        <h3 class="font-semibold mb-4">Disease Surveillance</h3>
        <div id="diseaseTrendChart" style="min-height: 350px;"></div>
      </div>`)}
    </div>
    
    <!-- Heatmap & Distribution -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      ${card(`<div class="p-5 lg:col-span-2">
        <h3 class="font-semibold mb-4">Weekly Activity Heatmap</h3>
        <div id="heatmapChart" style="min-height: 350px;"></div>
      </div>`)}
      
      ${card(`<div class="p-5">
        <h3 class="font-semibold mb-4">Service Distribution</h3>
        <div id="donutChart" style="min-height: 320px;"></div>
      </div>`)}
    </div>
    
    <!-- Staff Performance -->
    ${card(`<div class="p-5">
      <h3 class="font-semibold mb-4">Staff Performance</h3>
      <div id="staffChart" style="min-height: 300px;"></div>
    </div>`)}
    
    <!-- Live Activity Feed -->
    ${card(`<div class="p-5">
      <h3 class="font-semibold mb-4">Recent Activity</h3>
      <div id="live-feed" class="space-y-2 max-h-64 overflow-y-auto">
        ${renderStaticActivityFeed()}
      </div>
    </div>`)}
  </div>`;
}

function renderStaticKPICard(title, value, change, trend, color) {
  const trendIcon = trend === 'up' 
    ? '<svg class="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"/></svg>'
    : '<svg class="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181"/></svg>';
  
  const changeColor = trend === 'up' ? 'text-green-600' : 'text-red-600';
  
  return `
    <div class="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm p-4 hover:shadow-md transition-shadow">
      <div class="flex items-center justify-between mb-3">
        <p class="text-sm text-slate-500 dark:text-slate-400">${title}</p>
        <span class="p-2 rounded-lg" style="background-color: ${color}20;">
          <svg class="h-4 w-4" style="color: ${color}" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75z"/></svg>
        </span>
      </div>
      <p class="text-2xl font-bold text-slate-900 dark:text-white">${value}</p>
      <div class="flex items-center gap-1 mt-2">
        ${trendIcon}
        <span class="text-xs font-medium ${changeColor}">${change}</span>
        <span class="text-xs text-slate-400 ml-1">vs last month</span>
      </div>
    </div>
  `;
}

function renderStaticActivityFeed() {
  const activities = [
    { action: 'New appointment booked', user: 'Pedro Garcia', time: '2 min ago', type: 'info' },
    { action: 'Permit SP-1042 approved', user: 'Juan Dela Cruz', time: '15 min ago', type: 'success' },
    { action: 'Inspection scheduled', user: 'Ana Reyes', time: '1 hour ago', type: 'warning' },
    { action: 'Dengue case reported', user: 'System', time: '2 hours ago', type: 'error' },
    { action: 'Vaccine record updated', user: 'Maria Santos', time: '3 hours ago', type: 'info' },
  ];
  
  const typeColors = {
    info: 'border-blue-400 bg-blue-50 dark:bg-blue-900/20',
    success: 'border-green-400 bg-green-50 dark:bg-green-900/20',
    warning: 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20',
    error: 'border-red-400 bg-red-50 dark:bg-red-900/20',
  };
  
  return activities.map(a => `
    <div class="flex items-start gap-3 p-3 rounded-lg border-l-4 ${typeColors[a.type]}">
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-slate-700 dark:text-slate-300">${a.action}</p>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">${a.user} · ${a.time}</p>
      </div>
    </div>
  `).join('');
}
<<<<<<< HEAD

// Static charts initialization
export function initAnalyticsCharts() {
  initTrendChart();
  initDiseaseChart();
  initHeatmapChart();
  initDonutChart();
  initStaffChart();
}

function initTrendChart() {
  const el = document.querySelector('#trendChart');
  if (!el) return;
  
  new ApexCharts(el, {
    series: [
      { name: 'Appointments', data: [45, 52, 38, 65, 42, 58] },
      { name: 'Permits', data: [15, 22, 18, 25, 20, 19] },
      { name: 'Inspections', data: [30, 35, 28, 40, 32, 38] }
    ],
    chart: {
      type: 'area',
      height: 350,
      toolbar: { show: true },
      animations: { enabled: true, speed: 800 }
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.3,
        opacityTo: 0.05
      }
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    },
    yaxis: {
      title: { text: 'Number of Requests' }
    },
    tooltip: { shared: true },
    legend: { position: 'top' },
=======
export async function initAnalyticsCharts() {
  try {
    const response = await fetch('api/analytics/stats.php');
    const data = await response.json();
    console.log('Analytics data:', data);
    
    updateKPICards(data);
    
    initTrendChart(data.appointments, data.permits, data.requests);
    initDiseaseChart(data.diseases);
    initDonutChart(data.distribution);
    initHeatmapChart();
    initStaffChart();
  } catch (e) {
    console.error('Analytics error:', e);
    initTrendChart();
    initDiseaseChart();
    initHeatmapChart();
    initDonutChart();
    initStaffChart();
  }
}
function updateKPICards(data) {
  const cards = document.getElementById('kpi-cards');
  if (!cards) return;
  
  const totalAppointments = data.appointments ? data.appointments.reduce((a, b) => a + b, 0) : 0;
  const totalPermits = data.permits ? data.permits.reduce((a, b) => a + b, 0) : 0;
  const totalDistribution = data.distribution ? Object.values(data.distribution).reduce((a, b) => a + b, 0) : 0;
  const totalAlerts = data.diseases ? data.diseases.reduce((sum, d) => sum + d.data.reduce((a, b) => a + b, 0), 0) : 0;

  cards.innerHTML = `
    ${renderStaticKPICard('Appointments', totalAppointments, '', 'up', '#3b82f6')}
    ${renderStaticKPICard('Permits Issued', totalPermits, '', 'up', '#22c55e')}
    ${renderStaticKPICard('Total Services', totalDistribution, '', 'up', '#eab308')}
    ${renderStaticKPICard('Active Alerts', totalAlerts, '', 'down', '#ef4444')}
  `;
}

function initTrendChart(appointments = null, permits = null, requests = null) {
  const el = document.querySelector('#trendChart');
  if (!el) return;

  const series = [
    { name: 'Appointments', data: appointments || [45, 52, 38, 65, 42, 58] },
    { name: 'Permits', data: permits || [15, 22, 18, 25, 20, 19] },
    { name: 'Requests', data: requests || [30, 35, 28, 40, 32, 38] }
  ];

  new ApexCharts(el, {
    series,
    chart: { type: 'area', height: 350 },
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
>>>>>>> 0e6ec516f61032bb17df9534c68734e60fcf141d
    colors: ['#3b82f6', '#22c55e', '#eab308']
  }).render();
}

<<<<<<< HEAD
function initDiseaseChart() {
  const el = document.querySelector('#diseaseTrendChart');
  if (!el) return;
  
  new ApexCharts(el, {
    series: [
      { name: 'Dengue', data: [5, 8, 12, 10, 15, 12] },
      { name: 'Influenza', data: [10, 15, 20, 18, 25, 28] },
      { name: 'Food Poisoning', data: [2, 3, 5, 4, 3, 3] },
      { name: 'Leptospirosis', data: [0, 1, 2, 3, 5, 4] }
    ],
    chart: { type: 'line', height: 350, animations: { enabled: true } },
    stroke: { width: [3, 3, 3, 2], curve: 'smooth' },
=======
function initDiseaseChart(diseaseData = null) {
  const el = document.querySelector('#diseaseTrendChart');
  if (!el) return;
  
  const series = diseaseData || [
    { name: 'Dengue', data: [5, 8, 12, 10, 15, 12] },
    { name: 'Influenza', data: [10, 15, 20, 18, 25, 28] },
    { name: 'Food Poisoning', data: [2, 3, 5, 4, 3, 3] },
    { name: 'Leptospirosis', data: [0, 1, 2, 3, 5, 4] }
  ];

  new ApexCharts(el, {
    series,
    chart: { type: 'line', height: 350, animations: { enabled: true } },
    stroke: { width: 3, curve: 'smooth' },
>>>>>>> 0e6ec516f61032bb17df9534c68734e60fcf141d
    markers: { size: 4 },
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
    yaxis: { title: { text: 'Number of Cases' } },
    tooltip: { shared: true },
    colors: ['#ef4444', '#eab308', '#22c55e', '#a855f7']
  }).render();
}

<<<<<<< HEAD
=======
function initDonutChart(distribution = null) {
  const el = document.querySelector('#donutChart');
  if (!el) return;

  const series = distribution 
    ? [distribution.health, distribution.sanitation, distribution.immunization, distribution.wastewater]
    : [35, 25, 20, 20];

  new ApexCharts(el, {
    series,
    labels: ['Health Center', 'Sanitation', 'Immunization', 'Wastewater'],
    chart: { type: 'donut', height: 320 },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: { show: true, label: 'Total Services' }
          }
        }
      }
    },
    legend: { position: 'bottom' },
    colors: ['#3b82f6', '#22c55e', '#eab308', '#a855f7']
  }).render();
}

>>>>>>> 0e6ec516f61032bb17df9534c68734e60fcf141d
function initHeatmapChart() {
  const el = document.querySelector('#heatmapChart');
  if (!el) return;
  
<<<<<<< HEAD
  // Generate fake heatmap data
=======
>>>>>>> 0e6ec516f61032bb17df9534c68734e60fcf141d
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const hours = ['8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM'];
  const series = days.map(day => ({
    name: day,
    data: hours.map(hour => ({
      x: hour,
      y: Math.floor(Math.random() * 30)
    }))
  }));
  
  new ApexCharts(el, {
<<<<<<< HEAD
    series: series,
=======
    series,
>>>>>>> 0e6ec516f61032bb17df9534c68734e60fcf141d
    chart: { type: 'heatmap', height: 350 },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        colorScale: {
          ranges: [
            { from: 0, to: 5, color: '#e5e7eb' },
            { from: 6, to: 10, color: '#bbf7d0' },
            { from: 11, to: 20, color: '#86efac' },
            { from: 21, to: 30, color: '#22c55e' }
          ]
        }
      }
    },
    dataLabels: { enabled: false },
    title: { text: 'Activity by Day & Hour' }
  }).render();
}

<<<<<<< HEAD
function initDonutChart() {
  const el = document.querySelector('#donutChart');
  if (!el) return;
  
  new ApexCharts(el, {
    series: [35, 25, 20, 20],
    labels: ['Health Center', 'Sanitation', 'Immunization', 'Wastewater'],
    chart: { type: 'donut', height: 320 },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: { show: true, label: 'Total Services', formatter: () => '100%' }
          }
        }
      }
    },
    legend: { position: 'bottom' },
    colors: ['#3b82f6', '#22c55e', '#eab308', '#a855f7']
  }).render();
}

=======
>>>>>>> 0e6ec516f61032bb17df9534c68734e60fcf141d
function initStaffChart() {
  const el = document.querySelector('#staffChart');
  if (!el) return;
  
  new ApexCharts(el, {
<<<<<<< HEAD
    series: [{
      name: 'Performance Score',
      data: [94, 91, 88, 85, 82, 78]
    }],
    chart: {
      type: 'bar',
      height: 300,
      animations: { enabled: true }
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        horizontal: true,
        dataLabels: { position: 'top' }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => val + '%',
      style: { fontSize: '12px', fontWeight: 'bold' }
    },
    xaxis: {
      categories: ['Juan Dela Cruz', 'Ana Reyes', 'Carlos Tan', 'Elena Santos', 'Roberto Silva', 'Jose Mendoza'],
      max: 100
    },
=======
    series: [{ name: 'Performance Score', data: [94, 91, 88, 85, 82, 78] }],
    chart: { type: 'bar', height: 300, animations: { enabled: true } },
    plotOptions: { bar: { borderRadius: 8, horizontal: true, dataLabels: { position: 'top' } } },
    dataLabels: { enabled: true, formatter: (val) => val + '%', style: { fontSize: '12px', fontWeight: 'bold' } },
    xaxis: { categories: ['Juan Dela Cruz', 'Ana Reyes', 'Carlos Tan', 'Elena Santos', 'Roberto Silva', 'Jose Mendoza'], max: 100 },
>>>>>>> 0e6ec516f61032bb17df9534c68734e60fcf141d
    colors: ['#3b82f6']
  }).render();
}

function renderSummaryCards() {
  const summaries = [
    { title: 'Appointments', value: '342', change: '+12%', color: 'text-green-600', icon: 'calendar' },
    { title: 'Permits Issued', value: '89', change: '+5%', color: 'text-green-600', icon: 'clipboard' },
    { title: 'Inspections', value: '156', change: '+8%', color: 'text-green-600', icon: 'shield' },
    { title: 'Cases Reported', value: '48', change: '-3%', color: 'text-red-600', icon: 'alert' },
  ];
  
  return summaries.map(s => card(`
    <div class="p-4">
      <div class="flex items-center justify-between">
        <p class="text-sm text-slate-500">${s.title}</p>
        ${icon(s.icon, 'h-5 w-5 text-slate-400')}
      </div>
      <p class="text-2xl font-bold mt-1">${s.value}</p>
      <p class="text-xs ${s.color} mt-1">${s.change} vs last month</p>
    </div>
  `)).join('');
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

    ${card(`<div class="p-5"><h3 class="font-semibold mb-4">Data Management</h3>
      <div class="space-y-4">
        <div><label class="block text-sm font-medium mb-1">Audit Log Retention</label>
          <select class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none">
            <option>30 days</option><option>90 days</option><option selected>1 year</option><option>Indefinite</option>
          </select></div>
        <div><label class="block text-sm font-medium mb-1">Session Timeout</label>
          <select class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none">
            <option>15 minutes</option><option selected>30 minutes</option><option>1 hour</option><option>4 hours</option>
          </select></div>
        <div><label class="block text-sm font-medium mb-1">Time Zone</label>
          <select class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none">
            <option selected>Philippine Standard Time (UTC+8)</option><option>UTC+7</option><option>UTC+9</option>
          </select></div>
        ${btnPrimary('Save Data Settings', 'save-settings')}
      </div></div>`)}

    ${card(`<div class="p-5"><h3 class="font-semibold mb-4">Security</h3>
      <div class="space-y-4">
        <div><label class="block text-sm font-medium mb-1">Password Minimum Length</label>
          <input type="number" value="8" min="6" max="32" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none"></div>
        <div><label class="block text-sm font-medium mb-1">Login Attempt Limit</label>
          <input type="number" value="5" min="1" max="10" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-gov-500 focus:outline-none"></div>
        <label class="flex items-center gap-3 cursor-pointer"><input type="checkbox" class="rounded border-slate-300 text-gov-600 focus:ring-gov-500"><span class="text-sm">Require password complexity (uppercase, number, symbol)</span></label>
        <label class="flex items-center gap-3 cursor-pointer"><input type="checkbox" class="rounded border-slate-300 text-gov-600 focus:ring-gov-500"><span class="text-sm">Enable two-factor authentication (2FA)</span></label>
        ${btnPrimary('Save Security Settings', 'save-settings')}
      </div></div>`)}

    ${card(`<div class="p-5"><h3 class="font-semibold mb-4 text-red-600">Danger Zone</h3>
      <p class="text-sm text-slate-500 mb-3">These actions cannot be undone. Type confirmation to proceed.</p>
      <div class="space-y-4">
        <div class="flex items-center gap-3">
          <input type="text" id="reset-confirm" placeholder='Type "DELETE" to confirm' class="px-3 py-2 rounded-lg border border-red-200 dark:border-red-800 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none w-48">
          ${btnDanger('Reset System Data', 'reset-system')}
        </div>
        <div class="flex gap-2">${btnDanger('Clear All Logs', 'clear-logs')} ${btnDanger('Reset to Default Settings', 'reset-settings')}</div>
      </div></div>`)}
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
     reports: () => renderReports(),
     compliance: () => renderCompliance(),
     patients: () => renderPatients(),
     consultations: () => renderConsultations(),
    settings: () => renderSettings(),
    'staff-dashboard': () => renderStaffDashboard(),
    'surveillance-alerts': () => renderOutbreakDetection(),
    'surveillance-mapping': () => renderMappingClustering(),
    'surveillance-cases': () => renderCaseReports(),
    'wastewater-requests': () => renderServiceRequests(),
    'wastewater-schedule': () => renderMaintenanceSchedule(),
    'wastewater-registry': () => renderSepticRegistry(),
    'immunization-growth': () => renderGrowthCharts(),
    'immunization-tracking': () => renderVaccinationTracking(),
    'immunization-records': () => renderChildRecords(),
    'sanitation-records': () => renderPermitRecords(),
    'sanitation-inspections': () => renderInspections(),
    'medical-records': () => renderMedicalRecords(),
    'sanitation-applications': () => renderSanitationApplications(),
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