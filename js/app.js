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
 *   `${badge(log.level)}` instead of importing badge everywhere
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
import { initComplianceFilters } from './renderers/compliance.js';

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
        main.innerHTML = `<div class="space-y-4">${skeletonCards(3)}</div>`;
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
        resultsEl.innerHTML = `<div class="p-4 text-sm text-slate-500 text-center">No results for "${query}"</div>`;
    } else {
        resultsEl.innerHTML = results.slice(0, 8).map(r => `
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
        
        renderView();
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
    
   checkAuth().then(() => {
        loadSystemStatus();
    });
}

document.addEventListener('DOMContentLoaded', initApp);