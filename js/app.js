/**
 * ============================================================================
 * MAIN APPLICATION CONTROLLER (app.js)
 * ============================================================================
 * 
 * PURPOSE:
 * The central nervous system of the Health & Sanitation Management System.
 * Initializes the application, manages navigation, coordinates between
 * modules, handles global events, and connects all components together.
 * 
 * ARCHITECTURE ROLE:
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │                           app.js (ORCHESTRATOR)                      │
 * │                                                                      │
 * │  ┌──────────────┐  ┌──────────────┐  ┌────────────────────────────┐ │
 * │  │  state.js    │  │  config.js   │  │  renderers/index.js        │ │
 * │  │  (data store)│  │  (navigation)│  │  (view generators)         │ │
 * │  └──────┬───────┘  └──────┬───────┘  └───────────┬────────────────┘ │
 * │         │                 │                      │                   │
 * │         └─────────────────┼──────────────────────┘                   │
 * │                           │                                          │
 * │                    ┌──────▼──────┐                                   │
 * │                    │  RENDER FLOW │                                   │
 * │                    └──────┬──────┘                                   │
 * │                           │                                          │
 * │  ┌──────────────┐  ┌──────▼──────┐  ┌────────────────────────────┐ │
 * │  │  actions.js  │  │  DOM (HTML) │  │  ui/sidebar.js, header.js  │ │
 * │  │  (handlers)  │◄─┤  (rendered) │──┤  notification.js           │ │
 * │  └──────────────┘  └─────────────┘  └────────────────────────────┘ │
 * │                                                                      │
 * │  ┌──────────────────────────────────────────────────────────────┐   │
 * │  │  EVENT SYSTEM (Global click, search, keyboard, dropdowns)    │   │
 * │  └──────────────────────────────────────────────────────────────┘   │
 * └─────────────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// IMPORTS BREAKDOWN
// ============================================================================

/**
 * STATE & DATA:
 *   state, updateState     → Global application state management
 *   DATA, getCalendarEvents → Mock data store + calendar helpers
 *   NAV, ROLE_META, VIEW_META → Navigation config, role definitions
 * 
 * UI UTILITIES (made global for inline usage):
 *   badge, icon, card, cardHeader, emptyState, etc.
 *   → Assigned to window.* for use in template literals and inline scripts
 * 
 * UTILITIES:
 *   showToast              → Toast notification system
 *   openModal, closeModal  → Modal dialog system
 *   getSearchValue, getSelectValue → Form input helpers
 * 
 * ACTIONS:
 *   handleAction, setCoreFunctions → Centralized event handler
 * 
 * RENDERERS:
 *   VIEW_RENDERERS         → Map of view names to render functions
 *   initHealthCenterCalendar → FullCalendar initialization
 *   initAnalyticsCharts    → ApexCharts initialization
 *   initLogFilters         → Log filtering/pagination initialization
 * 
 * UI COMPONENTS:
 *   renderSidebar          → Sidebar navigation generator
 *   updateHeader           → Header/title updater
 *   renderNotificationPanel → Notification badge updater
 */

// ============================================================================
// GLOBAL UTILITY EXPOSURE
// ============================================================================

/**
 * window.badge, window.icon, window.card, etc.
 * 
 * WHY GLOBAL?
 * These utility functions are used extensively in template literals
 * throughout the renderers. Making them global avoids having to import
 * them in every single renderer file and allows inline usage like:
 * 
 *   ${badge(log.level)} instead of importing badge everywhere
 * 
 * Also exposes window.DATA and window.state for debugging in browser console.
 */

// ============================================================================
// CALENDAR INSTANCE MANAGEMENT
// ============================================================================

/**
 * calendarInstances (Map)
 * 
 * PURPOSE:
 * Tracks all FullCalendar instances to prevent memory leaks and conflicts.
 * When a calendar is re-rendered, the old instance is destroyed before
 * creating a new one.
 * 
 * USAGE:
 *   registerCalendarInstance('appointments', calendarInstance)
 *   getCalendarInstance('appointments') → returns instance or undefined
 * 
 * Currently used by: initHealthCenterCalendar()
 */

// ============================================================================
// CORE FUNCTIONS
// ============================================================================

/**
 * renderView()
 * 
 * THE MAIN RENDERING ENGINE:
 * 1. Looks up renderer for current state.view from VIEW_RENDERERS
 * 2. Shows skeleton loading state if state.showLoading is true
 * 3. Renders view HTML into #main-content
 * 4. Adds fade-in animation
 * 5. Restores search input values from state.searchFilters
 * 6. Initializes any view-specific features (calendar, charts, filters)
 * 
 * CALLED BY:
 *   - Initial page load (initApp)
 *   - Navigation (navigateTo)
 *   - Role switching (switchRole)
 *   - Search filtering (handleSearchInput)
 *   - After data mutations (delete-user action)
 */

/**
 * initCalendarIfNeeded()
 * 
 * POST-RENDER INITIALIZATION DISPATCHER:
 * After each view render, checks if the current view needs special
 * initialization and calls the appropriate setup function:
 * 
 *   health-center → initHealthCenterCalendar()  (FullCalendar)
 *   analytics     → initAnalyticsCharts()        (ApexCharts)
 *   logs          → initLogFilters()             (pagination/filters)
 *   compliance    → initComplianceFilters()       (filter handlers)
 * 
 * Uses setTimeout to ensure DOM elements are available before initialization.
 */

/**
 * renderViewPreserveScroll()
 * 
 * Renders view while maintaining scroll position and focus.
 * Used during search filtering to prevent jarring UI jumps.
 * 
 * Saves: scrollY position + active element ID
 * Restores after render
 */

/**
 * navigateTo(viewId)
 * 
 * Simple navigation: updates state.view → closes mobile sidebar → renders
 * Used by sidebar navigation clicks and programmatic navigation.
 */

/**
 * switchRole(role)
 * 
 * ROLE SWITCHING:
 * 1. Updates state.role
 * 2. Sets default view for new role (first item in NAV[role])
 * 3. Clears search filters
 * 4. Enables loading state
 * 5. Updates role switcher dropdowns (desktop + mobile)
 * 6. Closes sidebar/dropdowns
 * 7. Shows toast notification
 */

/**
 * toggleDarkMode()
 * 
 * Toggles dark/light theme:
 * - Updates state.darkMode
 * - Toggles 'dark' class on <html>
 * - Persists preference to localStorage ('hsms-dark')
 */

// ============================================================================
// UI STATE MANAGEMENT
// ============================================================================

/**
 * toggleSidebar()
 * Opens/closes mobile sidebar with backdrop
 * 
 * closeSidebarMobile()
 * Force closes sidebar (used on navigation/backdrop click)
 * 
 * closeAllDropdowns()
 * Closes all open dropdowns (notification, profile, search results)
 * 
 * toggleDropdown(name)
 * Toggles specific dropdown by name:
 *   'notif'  → Notification panel
 *   'profile' → Profile menu
 */

// ============================================================================
// GLOBAL SEARCH
// ============================================================================

/**
 * performGlobalSearch(query)
 * 
 * SEARCHES ACROSS ALL DATA TYPES:
 *   - Patients (by name/ID)
 *   - Permits (by applicant/ID)
 *   - Appointments (by patient/ID)
 *   - Child Records (by name)
 *   - Wastewater Services (by requester/ID)
 * 
 * Results show:
 *   - Label (name)
 *   - Type badge (Patient, Permit, etc.)
 *   - Sub text (ID)
 *   - Navigation action (clicking navigates to relevant module)
 * 
 * Limited to 8 results max.
 */

// ============================================================================
// EVENT HANDLING
// ============================================================================

/**
 * handleSearchInput(e)
 * 
 * LIVE SEARCH FILTERING:
 * Listens for input/change events on search fields and severity filters.
 * Updates state.searchFilters[id] with current value.
 * Re-renders view while preserving scroll position.
 * 
 * Tracked search IDs:
 *   user-search, log-search, apt-search, permit-search
 *   ww-search, surv-search, severity-filter
 */

// ============================================================================
// INITIALIZATION (initApp)
// ============================================================================

/**
 * initApp()
 * 
 * APPLICATION BOOTSTRAP - Called on DOMContentLoaded:
 * 
 * 1. DEPENDENCY INJECTION:
 *    Passes core functions to actions.js to avoid circular imports
 * 
 * 2. THEME SETUP:
 *    Applies dark mode if saved in state/localStorage
 * 
 * 3. EVENT LISTENERS:
 *    ┌─────────────────────────────────────────────────────────┐
 *    │ ELEMENT                  │ EVENT      │ HANDLER         │
 *    ├─────────────────────────────────────────────────────────┤
 *    │ #role-switcher           │ change     │ switchRole      │
 *    │ #role-switcher-mobile    │ change     │ switchRole      │
 *    │ #dark-mode-toggle        │ click      │ toggleDarkMode  │
 *    │ #menu-toggle             │ click      │ toggleSidebar   │
 *    │ #sidebar-backdrop        │ click      │ closeSidebarMobile│
 *    │ #notif-toggle            │ click      │ notification    │
 *    │ #profile-toggle          │ click      │ profile dropdown│
 *    │ #global-search           │ input      │ global search   │
 *    │ #global-search           │ focus      │ show results    │
 *    │ #modal-overlay           │ click      │ close modal     │
 *    │ #main-content            │ input      │ search filter   │
 *    │ #main-content            │ change     │ search filter   │
 *    └─────────────────────────────────────────────────────────┘
 * 
 * 4. GLOBAL CLICK DELEGATION (document):
 *    - Closes dropdowns when clicking outside
 *    - Handles [data-toggle] for sidebar collapsible sections
 *    - Handles [data-nav] for navigation
 *    - Handles [data-action] for all button actions
 * 
 * 5. KEYBOARD SHORTCUTS:
 *    Escape → Close modal + close dropdowns
 *    Ctrl/Cmd + K → Focus global search
 * 
 * 6. INITIAL RENDER:
 *    Renders notification panel + initial view
 */

// ============================================================================
// DATA FLOW DIAGRAM
// ============================================================================

/**
 * USER INTERACTION → VIEW UPDATE FLOW:
 * 
 * Click "Health Center" in sidebar
 *   ↓
 * [data-nav="health-center"] captured by global click handler
 *   ↓
 * navigateTo('health-center')
 *   ↓
 * state.view = 'health-center'
 *   ↓
 * renderView()
 *   ↓
 * VIEW_RENDERERS['health-center']() → generates HTML
 *   ↓
 * main-content.innerHTML = html
 *   ↓
 * updateHeader() → updates page title
 *   ↓
 * renderSidebar() → updates active state
 *   ↓
 * initCalendarIfNeeded() → initializes FullCalendar
 * 
 * 
 * USER TYPES IN SEARCH:
 * 
 * Types in #apt-search input
 *   ↓
 * handleSearchInput() fires
 *   ↓
 * state.searchFilters['apt-search'] = "Pedro"
 *   ↓
 * renderViewPreserveScroll()
 *   ↓
 * renderView() → but getSearchValue('apt-search') reads "Pedro"
 *   ↓
 * renderHealthCenter('Pedro') → filters appointments
 *   ↓
 * Calendar + table show only matching results
 * 
 * 
 * USER CLICKS ACTION BUTTON:
 * 
 * Clicks "Approve" on appointment
 *   ↓
 * [data-action="approve-apt"] captured
 *   ↓
 * handleAction('approve-apt', element)
 *   ↓
 * showToast('Appointment approved', 'success')
 */

// ============================================================================
// MODULE INTERDEPENDENCIES
// ============================================================================

/**
 * app.js IMPORTS FROM:
 *   state.js          → state, updateState
 *   data.js           → DATA, getCalendarEvents
 *   config.js         → NAV, ROLE_META, VIEW_META
 *   utils/dom.js      → All UI component factories
 *   utils/toast.js    → showToast
 *   utils/modal.js    → openModal, closeModal
 *   utils/search.js   → getSearchValue, getSelectValue
 *   actions.js        → handleAction, setCoreFunctions
 *   renderers/index.js → VIEW_RENDERERS, init functions
 *   ui/sidebar.js     → renderSidebar
 *   ui/header.js      → updateHeader
 *   ui/notification.js → renderNotificationPanel
 * 
 * app.js EXPORTS:
 *   renderView, renderViewPreserveScroll
 *   navigateTo, switchRole
 *   toggleDarkMode, toggleSidebar, closeSidebarMobile
 *   closeAllDropdowns, toggleDropdown
 *   performGlobalSearch
 *   getCalendarInstance, registerCalendarInstance
 */

/**
 * ============================================================================
 * SUMMARY
 * ============================================================================
 * 
 * app.js is the GLUE that holds the entire application together:
 * - Initializes all event listeners
 * - Manages navigation and view rendering
 * - Coordinates between state, renderers, and actions
 * - Handles global UI state (dark mode, sidebar, dropdowns)
 * - Provides global search across all modules
 * - Ensures proper initialization order for third-party libraries
 * 
 * Every user interaction flows through this file at some point,
 * making it the single source of truth for application behavior.
 */
import { state, updateState } from './state.js';
import { DATA, getCalendarEvents } from './data.js';
import { NAV, ROLE_META, VIEW_META } from './config.js';
import { 
    badge, icon, card, cardHeader, emptyState, emptyStateIllustrated,
    skeletonCards, btnPrimary, btnSecondary, btnDanger, btnSuccess,
    searchInput, tableWrap, priorityBadge, doctorStatusDot, workflowStepper,
    growthChartPlaceholder, heatmapPlaceholder
} from './utils/dom.js';
import { showToast } from './utils/toast.js';
import { openModal, closeModal } from './utils/modal.js';
import { initComplianceFilters,loadComplianceData } from './renderers/compliance.js';

import { renderSidebar } from './ui/sidebar.js';
import { updateHeader } from './ui/header.js';
import { renderNotificationPanel } from './ui/notification.js';
import { getSearchValue, getSelectValue } from './utils/search.js';
import { handleAction, setCoreFunctions } from './actions.js';
import { VIEW_RENDERERS, initHealthCenterCalendar, initAnalyticsCharts, initLogFilters } from './renderers/index.js'; // ← Add initHealthCenterCalendar import
import { initGrowthCharts } from './renderers/immunization/growthCharts.js';
import { initMaintenanceCalendar } from './renderers/wastewater/maintenanceSchedule.js';
import { initMappingClustering } from './renderers/surveillance/mappingClustering.js';


// Make utilities available globally for inline usage
window.badge = badge;
window.icon = icon;
window.card = card;
window.cardHeader = cardHeader;
window.emptyState = emptyState;
window.emptyStateIllustrated = emptyStateIllustrated;
window.btnPrimary = btnPrimary;
window.btnSecondary = btnSecondary;
window.btnDanger = btnDanger;
window.btnSuccess = btnSuccess;
window.searchInput = searchInput;
window.tableWrap = tableWrap;
window.priorityBadge = priorityBadge;
window.doctorStatusDot = doctorStatusDot;
window.workflowStepper = workflowStepper;
window.growthChartPlaceholder = growthChartPlaceholder;
window.heatmapPlaceholder = heatmapPlaceholder;
window.DATA = DATA;
window.state = state;

// Calendar instances registry
const calendarInstances = new Map();

export function getCalendarInstance(id) {
    return calendarInstances.get(id);
}

export function registerCalendarInstance(id, instance) {
    if (calendarInstances.has(id)) {
        calendarInstances.get(id).destroy();
    }
    calendarInstances.set(id, instance);
}

// Render view
export function renderView() {
    const renderer = VIEW_RENDERERS[state.view];
    const main = document.getElementById('main-content');
    
    if (state.showLoading) {
        main.innerHTML = <div class="space-y-4">${skeletonCards(3)}</div>;
        state.showLoading = false;
        setTimeout(() => {
            main.innerHTML = renderer ? renderer() : emptyStateIllustrated('View not found', 'The requested page could not be loaded');
            main.classList.add('fade-in');
            setTimeout(() => main.classList.remove('fade-in'), 300);
            restoreSearchValues();
            
            // Initialize calendar after render
            initCalendarIfNeeded(); // ← Add this line
        }, 350);
    } else {
        main.innerHTML = renderer ? renderer() : emptyStateIllustrated('View not found', 'The requested page could not be loaded');
        main.classList.add('fade-in');
        setTimeout(() => main.classList.remove('fade-in'), 300);
        restoreSearchValues();
        
        // Initialize calendar after render
        initCalendarIfNeeded(); // ← Add this line
    }
    
    updateHeader();
    renderSidebar();
}

// ← Add this new function
function initCalendarIfNeeded() {
    // Initialize FullCalendar when health center view is rendered
    if (state.view === 'health-center') {
        setTimeout(() => {
            initHealthCenterCalendar();
        }, 100);
    } if (state.view === 'analytics') {
        setTimeout(() => initAnalyticsCharts(), 150);
    }
    if (state.view === 'logs') {
        setTimeout(() => initLogFilters(), 100);
    }
    if (state.view === 'compliance') {
  setTimeout(() => initComplianceFilters(), 100);
    }
    if (state.view === 'immunization-growth') {
  setTimeout(() => initGrowthCharts(), 150);
}
    if (state.view === 'wastewater-schedule') {
  setTimeout(() => initMaintenanceCalendar(), 150);
}
if (state.view === 'surveillance-mapping') {
  setTimeout(() => initMappingClustering(), 150);
}
if (state.view === 'analytics') {
    setTimeout(() => initAnalyticsCharts(), 150);
    setTimeout(() => loadInsights(), 200);
}
if (state.view === 'compliance') {
    setTimeout(() => initComplianceFilters(), 100);
    
    // Auto-refresh every 15 seconds
    window._complianceRefresh = setInterval(async () => {
        const { loadComplianceData } = await import('./renderers/compliance.js');
        await loadComplianceData();
        const main = document.getElementById('main-content');
        if (main && state.view === 'compliance') {
            const { renderCompliance } = await import('./renderers/compliance.js');
            main.innerHTML = renderCompliance();
            initComplianceFilters();
        }
    }, 15000);
} else {
    // Clear interval when leaving compliance view
    if (window._complianceRefresh) {
        clearInterval(window._complianceRefresh);
        window._complianceRefresh = null;
    }
}
}
    


function restoreSearchValues() {
    Object.entries(state.searchFilters).forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el) el.value = val;
    });
}

export function renderViewPreserveScroll() {
    const scrollY = window.scrollY;
    const activeId = document.activeElement?.id;
    renderView();
    window.scrollTo(0, scrollY);
    if (activeId) {
        const el = document.getElementById(activeId);
        if (el) el.focus();
    }
}

// Navigation
export function navigateTo(viewId) {
    state.view = viewId;
    closeSidebarMobile();
    
    if (viewId === 'compliance') {
        import('./renderers/compliance.js').then(m => {
            m.loadComplianceData().then(() => renderView());
        });
        return;
    }
    
    renderView();
}

export function switchRole(role) {
    state.role = role;
    state.view = NAV[role][0].id;
    state.searchFilters = {};
    state.showLoading = true;
    closeSidebarMobile();
    closeAllDropdowns();
    renderView();
}

// Dark mode
export function toggleDarkMode() {
    state.darkMode = !state.darkMode;
    document.documentElement.classList.toggle('dark', state.darkMode);
    localStorage.setItem('hsms-dark', state.darkMode);
}

// Sidebar
export function toggleSidebar() {
    state.sidebarOpen = !state.sidebarOpen;
    document.getElementById('sidebar').classList.toggle('open', state.sidebarOpen);
    document.getElementById('sidebar-backdrop').classList.toggle('hidden', !state.sidebarOpen);
}

export function closeSidebarMobile() {
    state.sidebarOpen = false;
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebar-backdrop').classList.add('hidden');
}

// Dropdowns
export function closeAllDropdowns() {
    state.openDropdown = null;
    document.querySelectorAll('.dropdown-panel').forEach(p => p.classList.add('hidden'));
    document.getElementById('global-search-results')?.classList.add('hidden');
}

export function toggleDropdown(name) {
    if (state.openDropdown === name) { 
        closeAllDropdowns(); 
        return; 
    }
    closeAllDropdowns();
    state.openDropdown = name;
    const panels = { notif: 'notif-panel', profile: 'profile-panel' };
    document.getElementById(panels[name])?.classList.remove('hidden');
}

// Global search
export function performGlobalSearch(query) {
    const resultsEl = document.getElementById('global-search-results');
    if (!resultsEl) return;
    
    const q = query.toLowerCase().trim();
    if (!q) { 
        resultsEl.classList.add('hidden'); 
        return; 
    }

    const results = [];
    DATA.patients.forEach(p => { 
        if (p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)) 
            results.push({ type: 'Patient', label: p.name, sub: p.id, action: 'nav-health-center' }); 
    });
    DATA.permits.forEach(p => { 
        if (p.applicant.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)) 
            results.push({ type: 'Permit', label: p.applicant, sub: p.id, action: 'nav-sanitation' }); 
    });
    DATA.appointments.forEach(a => { 
        if (a.patient.toLowerCase().includes(q) || a.id.toLowerCase().includes(q)) 
            results.push({ type: 'Appointment', label: a.patient, sub: a.id, action: 'nav-health-center' }); 
    });
    DATA.children.forEach(c => { 
        if (c.name.toLowerCase().includes(q)) 
            results.push({ type: 'Child Record', label: c.name, sub: c.id, action: 'nav-immunization' }); 
    });
    DATA.wastewater.forEach(w => { 
        if (w.requester.toLowerCase().includes(q) || w.id.toLowerCase().includes(q)) 
            results.push({ type: 'Service', label: w.requester, sub: w.id, action: 'nav-wastewater' }); 
    });

    if (!results.length) {
        resultsEl.innerHTML = <div class="p-4 text-sm text-slate-500 text-center">No results for "${query}"</div>;
    } else {
        resultsEl.innerHTML = results.slice(0, 😎.map(r => `
            <button type="button" data-action="${r.action}" class="w-full text-left px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-0">
                <div class="flex justify-between items-center"><span class="text-sm font-medium">${r.label}</span>${badge(r.type)}</div>
                <span class="text-xs text-slate-500">${r.sub}</span>
            </button>
        `).join('');
    }
    resultsEl.classList.remove('hidden');
    state.openDropdown = 'search';
}

// Search handling
function handleSearchInput(e) {
    const id = e.target.id;
    const searchIds = ['user-search', 'log-search', 'apt-search', 'permit-search', 'ww-search', 'surv-search'];
    if (searchIds.includes(id)) {
        state.searchFilters[id] = e.target.value;
        renderViewPreserveScroll();
    }
    if (id === 'severity-filter') {
        state.searchFilters['severity-filter'] = e.target.value;
        renderViewPreserveScroll();
    }
}
async function loadDashboardData() {
    try {
        const response = await fetch('api/admin/adminStats.php');
        if (response.ok) {
            const apiData = await response.json();
            DATA.kpis = apiData.kpis;
            DATA.systemStatus = apiData.systemStatus;
        }
    } catch (e) {
        // Keep static defaults from data.js
    }
}
async function checkAuth() {
    try {
        console.log('Step 1: Fetching checkRole.php');
        const response = await fetch('api/auth/checkRole.php');
        console.log('Step 2: Response status:', response.status);
        
        if (response.status === 401) {
            console.log('Step 3: 401 - Not authenticated');
            showToast({ type: 'warning', title: 'Not Authenticated', message: 'Please log in to continue' });
            setTimeout(() => { window.location.href = 'login.php'; }, 1500);
            return;
        }
        
        const data = await response.json();
        console.log('Step 4: Data received:', data);
        
        state.role = data.role;
        console.log('Step 5: Role set to:', state.role);
        
        // Update profile
        const profileName = document.getElementById('profile-name');
        console.log('Step 6: Profile element found:', profileName);
        if (profileName) {
            profileName.textContent = data.userName;
            console.log('Step 7: Profile updated to:', data.userName);
        }
        
        document.getElementById('profile-email').textContent = data.email;
        document.getElementById('profile-avatar').textContent = data.userName.charAt(0);
    } catch (error) {
        console.error('ERROR:', error);
    }
}

async function loadSystemStatus() {
    try {
        const response = await fetch('api/admin/systemStatus.php');
        if (response.ok) {
            const data = await response.json();
            DATA.systemStatus = data;
        }
    } catch (e) {}
}
async function loadRecentActivity() {
    try {
        const response = await fetch('api/admin/recentActivity.php');
        if (response.ok) {
            const data = await response.json();
            if (data.length > 0) {
                DATA.logs = data.map((item, i) => ({
                    id: i + 1,
                    timestamp: item.timestamp,
                    user: item.user_name,
                    action: item.action,
                    module: 'System',
                    level: item.level
                }));
            }
        }
    } catch (e) {}
}
async function loadRecentUpdates() {
    try {
        const response = await fetch('api/admin/recentUpdates.php');
        if (response.ok) {
            const data = await response.json();
            if (data.length > 0) {
                DATA.recentUpdates = data;
            }
        }
    } catch (e) {}
}
async function loadUsers() {
    try {
        const response = await fetch('api/admin/getUsers.php');
        if (response.ok) {
            const data = await response.json();
            DATA.users = data;
        }
    } catch (e) {}
}
async function loadLogs() {
    try {
        const response = await fetch('api/admin/getLogs.php');
        if (response.ok) {
            const data = await response.json();
            console.log('API logs count:', data.length); // Should say 4
            DATA.logs = data;
            console.log('DATA.logs count:', DATA.logs.length); // Should say 4
        }
    } catch (e) {}
}
let insightsLoading = false;
let insightsRefreshTimer = null;
let lastAnalyzedTime = null;
let loadingTextInterval = null;

const loadingSteps = [
    "Analyzing appointments...",
    "Reviewing disease alerts...",
    "Evaluating sanitation permits...",
    "Generating recommendations..."
];

function showLoading() {
    const target = document.getElementById('ai-insights');
    if (!target) return;

    if (loadingTextInterval) clearInterval(loadingTextInterval);

    let currentLoadingIndex = 0;
    
    target.innerHTML = `
        <div class="ai-loading-container flex flex-col items-center justify-center py-6 text-center space-y-4">
            <div class="ai-typing-indicator flex items-center justify-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-blue-600/80 dark:bg-cyan-400/80 dot-pulse-1"></span>
                <span class="w-2.5 h-2.5 rounded-full bg-blue-500/80 dark:bg-cyan-300/80 dot-pulse-2"></span>
                <span class="w-2.5 h-2.5 rounded-full bg-blue-400/80 dark:bg-cyan-200/80 dot-pulse-3"></span>
            </div>
            <div id="ai-loading-text" class="text-sm font-semibold text-slate-600 dark:text-slate-300 transition-all duration-300 transform translate-y-0 opacity-100">
                ${loadingSteps[0]}
            </div>
        </div>
    `;

    const loadingTextEl = document.getElementById('ai-loading-text');
    
    loadingTextInterval = setInterval(() => {
        const currentTextEl = document.getElementById('ai-loading-text');
        if (!currentTextEl) return;
        
        currentTextEl.classList.remove('opacity-100', 'translate-y-0');
        currentTextEl.classList.add('opacity-0', 'translate-y-[-4px]');
        
        setTimeout(() => {
            currentLoadingIndex = (currentLoadingIndex + 1) % loadingSteps.length;
            currentTextEl.textContent = loadingSteps[currentLoadingIndex];
            
            currentTextEl.classList.remove('opacity-0', 'translate-y-[-4px]');
            currentTextEl.classList.add('opacity-100', 'translate-y-0');
        }, 300);
    }, 2000);
}

function hideLoading() {
    if (loadingTextInterval) {
        clearInterval(loadingTextInterval);
        loadingTextInterval = null;
    }
}

function animateAvatar(state) {
    const container = document.getElementById('ai-avatar-container');
    if (!container) return;

    if (state === 'loading') {
        container.classList.add('ai-avatar-thinking');
    } else {
        container.classList.remove('ai-avatar-thinking');
    }
}

function renderInsightCards(insights) {
    const target = document.getElementById('ai-insights');
    if (!target) return;

    if (!insights || Object.keys(insights).length === 0) {
        target.innerHTML = `
            <div class="flex flex-col items-center justify-center text-center p-6 bg-slate-500/5 dark:bg-slate-400/5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700/50">
                <span class="text-3xl mb-2">🔍</span>
                <p class="text-sm font-semibold text-slate-700 dark:text-slate-300">No municipal health insights available yet.</p>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">The AI will automatically analyze new operational data.</p>
            </div>
        `;
        return;
    }

    target.innerHTML = '';
    
    const cardKeys = ['operational', 'risk', 'action'];
    
    cardKeys.forEach((key, index) => {
        const item = insights[key];
        if (!item) return;

        let borderClass = 'border-l-4 border-l-blue-500 shadow-blue-500/5';
        let badgeHTML = '';
        
        if (key === 'operational') {
            borderClass = 'border-l-4 border-l-blue-500 shadow-blue-500/5';
        } else if (key === 'risk') {
            const lvl = (item.level || 'Medium').toLowerCase();
            if (lvl === 'high') {
                borderClass = 'border-l-4 border-l-rose-500 shadow-rose-500/5';
            } else if (lvl === 'medium') {
                borderClass = 'border-l-4 border-l-amber-500 shadow-amber-500/5';
            } else {
                borderClass = 'border-l-4 border-l-emerald-500 shadow-emerald-500/5';
            }
            badgeHTML = <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">${item.level} Risk</span>;
        } else if (key === 'action') {
            const prio = (item.priority || 'Medium').toLowerCase();
            if (prio === 'high') {
                borderClass = 'border-l-4 border-l-purple-500 shadow-purple-500/5';
            } else if (prio === 'medium') {
                borderClass = 'border-l-4 border-l-indigo-500 shadow-indigo-500/5';
            } else {
                borderClass = 'border-l-4 border-l-teal-500 shadow-teal-500/5';
            }
            badgeHTML = <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">${item.priority} Priority</span>;
        }

        const cardHTML = `
            <div class="ai-insight-card relative overflow-hidden p-4 rounded-xl ${borderClass} bg-white/20 dark:bg-slate-800/10 backdrop-blur-md border border-white/10 dark:border-slate-800/20 hover:bg-white/30 dark:hover:bg-slate-800/20 shadow-sm transition-all duration-300 transform opacity-0 translate-y-4 hover:-translate-y-1 hover:shadow-md cursor-default group" style="animation-delay: ${index * 150}ms; animation-fill-mode: forwards;">
                <div class="absolute top-3 right-3 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 dark:group-hover:text-cyan-400 transition-colors duration-300">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 21.5L6.5 16.5L1.5 14L6.5 11.5L9 6.5L11.5 11.5L16.5 14L11.5 16.5L9 21.5ZM19 12.5L17.75 10L15.25 8.75L17.75 7.5L19 5L20.25 7.5L22.75 8.75L20.25 10L19 12.5ZM19 22.5L18.25 21L16.75 20.25L18.25 19.5L19 18L19.75 19.5L21.25 20.25L19.75 21L19 22.5Z"/>
                    </svg>
                </div>
                
                <div class="flex items-start gap-3">
                    <span class="text-xl mt-0.5 filter drop-shadow-sm">${item.icon || 'ℹ️'}</span>
                    <div class="flex-1 min-w-0 pr-4">
                        <div class="flex items-center gap-2 flex-wrap mb-1">
                            <h4 class="font-bold text-sm text-slate-800 dark:text-slate-100 tracking-tight leading-none">${item.title}</h4>
                            ${badgeHTML}
                        </div>
                        <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">${item.text}</p>
                    </div>
                </div>
            </div>
        `;
        
        target.insertAdjacentHTML('beforeend', cardHTML);
    });
}

function updateLastAnalyzedFooter() {
    const footerTime = document.getElementById('ai-last-analyzed');
    const currentTime = document.getElementById('ai-current-time');
    
    if (footerTime && lastAnalyzedTime) {
        const hours = String(lastAnalyzedTime.getHours()).padStart(2, '0');
        const minutes = String(lastAnalyzedTime.getMinutes()).padStart(2, '0');
        const seconds = String(lastAnalyzedTime.getSeconds()).padStart(2, '0');
        footerTime.textContent = ${hours}:${minutes}:${seconds};
    }
    
    if (currentTime) {
        const now = new Date();
        const dateStr = now.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
        currentTime.textContent = dateStr;
    }
}

function setupAutoRefresh() {
    if (insightsRefreshTimer) clearTimeout(insightsRefreshTimer);
    
    // Auto refresh every 5 minutes (5 * 60 * 1000 = 300000ms)
    insightsRefreshTimer = setTimeout(() => {
        loadInsights();
    }, 300000);
}

function refreshInsights() {
    if (insightsRefreshTimer) {
        clearTimeout(insightsRefreshTimer);
        insightsRefreshTimer = null;
    }
    loadInsights();
}

async function loadInsights() {
    const target = document.getElementById('ai-insights');
    if (!target) return;

    if (insightsLoading) return;
    insightsLoading = true;

    const refreshBtn = document.getElementById('ai-refresh-btn');
    const refreshIcon = document.getElementById('ai-refresh-icon');
    if (refreshBtn) refreshBtn.classList.add('ai-refresh-active');
    if (refreshIcon) refreshIcon.classList.add('rotate-infinite');

    if (refreshBtn) {
        refreshBtn.onclick = (e) => {
            e.preventDefault();
            refreshInsights();
        };
    }

    showLoading();
    animateAvatar('loading');

    try {
        const response = await fetch('api/analytics/insights.php', { cache: 'no-store' });
        
        if (!response.ok) {
            throw new Error(HTTP Error ${response.status});
        }

        const data = await response.json();
        
        hideLoading();
        animateAvatar('complete');

        if (data && data.status === 'success' && data.insights) {
            renderInsightCards(data.insights);
            lastAnalyzedTime = new Date();
            updateLastAnalyzedFooter();
        } else {
            renderInsightCards(null);
        }
    } catch (e) {
        console.error('Unable to load AI insights:', e);
        hideLoading();
        animateAvatar('complete');
        
        target.innerHTML = `
            <div class="flex flex-col items-center justify-center text-center p-6 bg-rose-500/5 dark:bg-rose-500/5 rounded-xl border border-rose-300/30 dark:border-rose-700/20">
                <span class="text-3xl mb-2">⚠️</span>
                <p class="text-sm font-bold text-rose-600 dark:text-rose-400">AI Assistant Offline</p>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">Unable to generate insights.</p>
                <button id="ai-retry-btn" class="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-semibold shadow transition-colors flex items-center gap-1.5 focus:outline-none">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    Retry Connection
                </button>
            </div>
        `;
        
        const retryBtn = document.getElementById('ai-retry-btn');
        if (retryBtn) {
            retryBtn.onclick = (e) => {
                e.preventDefault();
                refreshInsights();
            };
        }
    } finally {
        insightsLoading = false;
        if (refreshBtn) refreshBtn.classList.remove('ai-refresh-active');
        if (refreshIcon) refreshIcon.classList.remove('rotate-infinite');
        updateLastAnalyzedFooter();
        setupAutoRefresh();
    }
}
// Initialize app
function initApp() {
    // Set core functions for actions.js to avoid circular dependencies
    setCoreFunctions({
        navigateTo,
        renderView,
        renderNotificationPanel,
        closeAllDropdowns
    });

    if (state.darkMode) document.documentElement.classList.add('dark');

   

    // Dark mode toggle
    document.getElementById('dark-mode-toggle').addEventListener('click', toggleDarkMode);
    
    // Sidebar
    document.getElementById('menu-toggle').addEventListener('click', toggleSidebar);
    document.getElementById('sidebar-backdrop').addEventListener('click', closeSidebarMobile);

    // Notifications
    document.getElementById('notif-toggle').addEventListener('click', (e) => {
        e.stopPropagation();
        renderNotificationPanel();
        toggleDropdown('notif');
    });
    
    // Profile dropdown
    document.getElementById('profile-toggle').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown('profile');
    });

    // Global search
    const globalSearch = document.getElementById('global-search');
    globalSearch.addEventListener('input', (e) => performGlobalSearch(e.target.value));
    globalSearch.addEventListener('focus', (e) => { 
        if (e.target.value) performGlobalSearch(e.target.value); 
    });

    // Modal close on overlay click
    document.getElementById('modal-overlay').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeModal();
        if (e.target.closest('[data-action="close-modal"]')) closeModal();
    });

        // Global click handler
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#notif-dropdown-wrap') && 
            !e.target.closest('#profile-dropdown-wrap') && 
            !e.target.closest('#global-search-wrap')) {
            closeAllDropdowns();
        }

        // Sidebar collapsible toggle
        const toggleBtn = e.target.closest('[data-toggle]');
        if (toggleBtn) {
            const id = toggleBtn.dataset.toggle;
            import('./ui/sidebar.js').then(module => {
                module.toggleExpanded(id);
            });
            return;
        }

        const navBtn = e.target.closest('[data-nav]');
        if (navBtn) { 
            navigateTo(navBtn.dataset.nav); 
            return; 
        }

        const actionEl = e.target.closest('[data-action]');
        if (actionEl) {
            e.preventDefault();
            handleAction(actionEl.dataset.action, actionEl);
        }
    });
      
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { 
            closeModal(); 
            closeAllDropdowns(); 
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('global-search')?.focus();
        }
    });

    // Search inputs
    document.getElementById('main-content').addEventListener('input', handleSearchInput);
    document.getElementById('main-content').addEventListener('change', handleSearchInput);

    // Initial render
        renderNotificationPanel();
    
   checkAuth().then(async () => {
    await loadDashboardData();
    await loadSystemStatus();
    await loadRecentActivity();
    await loadRecentUpdates();
    await loadUsers();
    await loadLogs();
    await loadInsights()
    renderView();
});
}

document.addEventListener('DOMContentLoaded', initApp);