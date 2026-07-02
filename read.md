Main target of this Project is Optimization less loading, add skeleton loading Make it re usable

🔴 Critical — Do These First (Biggest Speed Gains)
Create a single consolidated dashboard API endpoint — Replace 10 separate fetch calls with one /api/dashboardInit.php that returns all data in one JSON response

Fix the 403 authentication errors — Make adminStats.php and systemStatus.php return empty data instead of blocking, or handle failures gracefully in JavaScript so they don't hold up the entire page

Add proper database indexes — Index columns used in WHERE, JOIN, and ORDER BY clauses (especially patient_id, created_at, status, clinic_id)

Enable OPcache in production — Add opcache.enable=1 to your php.ini to stop PHP from recompiling every file on every request

🟠 High Impact — Do This Week
Add skeleton loading screens — Show gray pulsing placeholders immediately on page load so users see something in 100ms instead of a white screen for 3 seconds

Defer non-critical widgets — Load charts, maps, calendar, and AI insights after the main stats and activity feed are already visible

Enable gzip or Brotli compression — Turn on compression in your hosting panel or via .htaccess to shrink HTML, CSS, JS, and JSON by 60-80%

Add browser caching headers — Set Cache-Control headers for static assets (images, CSS, JS) so repeat visits load almost instantly

Use Redis or file-based caching for dashboard data — Cache the consolidated dashboard response for 30 seconds so 100 users hitting the dashboard simultaneously only trigger 1 database query

🟡 Medium Impact — Do This Month
Put Cloudflare (free tier) in front of your site — Gets you a global CDN, automatic compression, browser caching, DDoS protection, and HTTP/2 for free

Compress and convert all images to WebP — Replace large PNG/JPG files with WebP versions that are 70% smaller but look identical

Lazy load images and below-the-fold content — Use loading="lazy" on images and only load map tiles when the user scrolls to them

Add timeouts to all fetch calls — Set a 5-second maximum wait on every API request so a failed endpoint never blocks the page forever

Upgrade PHP version — Move to PHP 8.1+ for automatic 20-30% performance improvement over older versions

Check hosting resource limits — Look at your hosting panel for CPU, RAM, and PHP worker limits; upgrade from shared hosting if you're hitting ceilings

🟢 Lower Impact — Polish & Refinement
Add Tailwind CSS + DaisyUI — Tiny production CSS (5-20KB), built-in skeleton components, professional design that makes the app feel faster

Minify and bundle JavaScript — Combine all your JS files into one minified file to reduce HTTP requests

Enable HTTP/2 or HTTP/3 — Comes automatically with Cloudflare; multiplexes requests so they don't block each other

Use keep-alive connections — Configure your server to reuse connections instead of opening a new one for every file

Preload critical fonts and assets — Add <link rel="preload"> for your main font and logo so they load first

Remove unused CSS and JavaScript — Delete old libraries, unused Bootstrap components, and dead code from your pages

Add a loading spinner or progress bar — A small NProgress bar at the top of the page gives instant visual feedback that something is happening

🔵 Ongoing — Monitor & Maintain
Check error logs weekly — Look for slow requests, 500 errors, and long response times to catch problems before users complain

Monitor server CPU and RAM during peak hours — Know when your server struggles so you can upgrade before it crashes

Run PageSpeed Insights and GTmetrix monthly — Get a report card on what's still slow and what to fix next

Profile slow database queries — Use EXPLAIN on your production queries to find missing indexes or full table scans

Keep PHP, database, and libraries updated — Each update includes performance improvements and security fixes

🎯 The Quick Win Combo (Do Today in 60 Minutes)
If you only have one hour, do these six things in this order:

Consolidate the dashboard endpoint (30 min) — One request instead of ten

Handle 403 errors gracefully (10 min) — Stop broken endpoints from blocking the page

Add skeleton loading screens (15 min) — Instant perceived speed improvement

Turn on gzip compression (2 min) — One checkbox in your hosting panel

Add browser caching headers (2 min) — Copy-paste into your .htaccess

Test and deploy (1 min) — Watch your load time drop from 3s to under 1s

What "Fast" Looks Like After These Changes
Moment	Before	After
First paint (user sees something)	800ms white screen	100ms skeleton screen
Stats visible	2,500ms	400ms
Charts and maps loaded	3,500ms	800ms
Fully interactive	4,000ms	1,000ms
Repeat visit (cached)	3,000ms	300ms



Username: admin
Password: admin@123
Username: staff@123
Password: staff@123
Username: user
Password: user@123


## Local setup

1. Start Apache and MySQL in XAMPP.
2. Open phpMyAdmin and import:
   `sql/health_sanitation_db (1).sql`
3. Check `config/env.local.php`.
   - `db_host`, `db_port`, `db_name`, `db_user`, and `db_pass` must match your MySQL/XAMPP setup.
   - Put your Gemini API key in `gemini_key` if you want the AI chat and AI insights to work.

The SQL file creates the `health_sanitation_db` database, the main app tables, sample records, and the `ai_tasks` table used by the AI assistant follow-up feature.

## AI folder advice

Continue the AI folder, but keep it as assistant automation:
- Good: answer questions from current system data.
- Good: suggest form values from staff notes.
- Good: create follow-up tasks that staff can review.
- Avoid for now: letting AI approve permits, edit violations, or change medical/sanitation records automatically.

This keeps the app beginner-friendly and safer while you learn PHP, sessions, CRUD, and API calls.



/**
 * ============================================================================
 * ACTION HANDLER SYSTEM (actions.js)
 * ============================================================================
 * 
 * PURPOSE:
 * Centralized event delegation handler that processes all user interactions
 * across the application. Instead of attaching individual event listeners
 * to every button, all clicks bubble up to a single handler that routes
 * actions based on data-action attributes.
 * 
 * ARCHITECTURE:
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │                         EVENT DELEGATION FLOW                        │
 * │                                                                      │
 * │  User clicks button                                                  │
 * │  ↓                                                                    │
 * │  <button data-action="approve-apt">Approve</button>                  │
 * │  ↓                                                                    │
 * │  Event listener in app.js captures click                             │
 * │  ↓                                                                    │
 * │  handleAction('approve-apt', target) called                          │
 * │  ↓                                                                    │
 * │  Looks up 'approve-apt' in actions object                            │
 * │  ↓                                                                    │
 * │  Executes: showToast('Appointment approved', 'success')              │
 * └─────────────────────────────────────────────────────────────────────┘
 * 
 * ACTIONS CATEGORIES:
 * 
 * 1. MODAL ACTIONS (Open dialogs)
 * 2. CONFIRMATION ACTIONS (Close modal + show toast)
 * 3. NAVIGATION ACTIONS (Change views/routes)
 * 4. TOAST-ONLY ACTIONS (Show feedback message)
 * 5. STATE CHANGE ACTIONS (Switch role, mark read)
 */

// ============================================================================
// ACTIONS REFERENCE GUIDE
// ============================================================================

/**
 * ─── MODAL ACTIONS ────────────────────────────────────────────────────
 * These open modal dialogs for data entry/editing
 * 
 * 'add-user'              → Opens Add User form modal
 * 'edit-user'             → Opens Edit User form modal (pre-filled with user data)
 * 'schedule-inspection'   → Opens Schedule Inspection form modal
 * 'update-child'          → Opens Update Immunization Record modal
 * 'add-child'             → Opens same modal as update-child (for adding new)
 * 'view-checklist'        → Opens Inspection Checklist modal
 * 'report-case'           → Opens Report New Case form modal
 * 'show-notifications'    → Opens Notifications list modal
 * 
 * ─── CONFIRMATION ACTIONS ─────────────────────────────────────────────
 * These close the current modal and show a success toast
 * 
 * 'confirm-add-user'      → Close modal + "User added successfully"
 * 'confirm-edit-user'     → Close modal + "User updated successfully"
 * 'confirm-schedule'      → Close modal + "Inspection scheduled successfully"
 * 'confirm-update-child'  → Close modal + "Immunization record updated"
 * 'confirm-report-case'   → Close modal + "Case report submitted"
 * 'submit-checklist'      → Close modal + "Checklist submitted successfully"
 * 
 * ─── DIRECT TOAST ACTIONS ─────────────────────────────────────────────
 * These show immediate feedback without opening modals
 * 
 * 'delete-user'           → "User deleted successfully" + re-render view
 * 'run-report'            → "Report generated successfully" (success)
 * 'system-backup'         → "System backup initiated" (info)
 * 'save-settings'         → "Settings saved successfully" (success)
 * 'reset-system'          → "System reset is disabled in demo mode" (error)
 * 'clear-logs'            → "Log clearing requires admin confirmation" (error)
 * 'approve-apt'           → "Appointment approved" (success)
 * 'reject-apt'            → "Appointment rejected" (error)
 * 'view-patient'          → "Patient record opened" (info)
 * 'approve-permit'        → "Permit approved successfully" (success)
 * 'reject-permit'         → "Permit application rejected" (error)
 * 'add-patient'           → "Add patient form opened (demo)" (info)
 * 'edit-profile'          → "Profile editing is UI-only in demo" (info)
 * 'submit-appointment'    → "Appointment booked successfully!" (success)
 * 'submit-permit'         → "Permit application submitted!" (success)
 * 'submit-wastewater'     → "Service request submitted!" (success)
 * 
 * ─── NAVIGATION ACTIONS ───────────────────────────────────────────────
 * These change the current view/route
 * 
 * 'nav-logs'              → Navigate to logs page
 * 'nav-health-center'     → Switch to staff role + navigate to health-center
 * 'nav-sanitation'        → Switch to staff role + navigate to sanitation
 * 'nav-immunization'      → Switch to staff role + navigate to immunization
 * 'nav-wastewater'        → Switch to staff role + navigate to wastewater
 * 'new-appointment'       → User: navigate to book-appointment
 *                           Staff: switch role then show guidance toast
 * 'profile-view'          → User: navigate to profile
 *                           Admin: show info toast
 * 'profile-settings'      → Admin: navigate to settings
 *                           User: show info toast
 * 'view-all-activity'     → Admin: navigate to logs
 *                           User: show info toast
 * 
 * ─── DROPDOWN/UI ACTIONS ──────────────────────────────────────────────
 * 
 * 'close-modal'           → Close any open modal
 * 'mark-all-read'         → Mark all notifications as read + re-render panel
 * 'profile-logout'        → Show logout toast (demo mode)
 * 
 * ─── ROLE-BASED BEHAVIOR ──────────────────────────────────────────────
 * Some actions behave differently based on user role:
 * 
 * ACTION              ADMIN                   STAFF               USER
 * ─────────────────────────────────────────────────────────────────────
 * new-appointment     switch to staff         show guidance        navigate to book
 * profile-view        show toast              show toast           navigate to profile
 * profile-settings    navigate to settings    show toast           show toast
 * view-all-activity   navigate to logs        show toast           show toast
 */

// ============================================================================
// HOW IT CONNECTS TO YOUR RENDERERS (index.js)
// ============================================================================

/**
 * Your renderers create buttons with data-action attributes:
 * 
 * FROM renderUsers():
 *   <button data-action="edit-user" data-id="USR-001">Edit</button>
 *   <button data-action="delete-user" data-id="USR-001">Delete</button>
 *   <button data-action="add-user">+ Add User</button>
 * 
 * FROM renderHealthCenter():
 *   <button data-action="approve-apt">Approve</button>
 *   <button data-action="reject-apt">Reject</button>
 *   <button data-action="view-patient" data-id="P-101">View</button>
 * 
 * FROM renderSanitation():
 *   <button data-action="approve-permit">Approve</button>
 *   <button data-action="reject-permit">Reject</button>
 *   <button data-action="schedule-inspection">Schedule</button>
 * 
 * FROM renderImmunization():
 *   <button data-action="update-child">Update</button>
 *   <button data-action="add-child">+ Add Child Record</button>
 * 
 * FROM renderWastewater():
 *   <button data-action="view-checklist">Checklist</button>
 *   <button data-action="submit-checklist">Submit Checklist</button>
 * 
 * FROM renderSurveillance():
 *   <button data-action="report-case">Report Case</button>
 * 
 * FROM renderSettings():
 *   <button data-action="save-settings">Save Changes</button>
 *   <button data-action="reset-system">Reset System Data</button>
 *   <button data-action="clear-logs">Clear All Logs</button>
 */

// ============================================================================
// DEPENDENCY INJECTION PATTERN
// ============================================================================

/**
 * setCoreFunctions() uses a dependency injection pattern to avoid
 * circular imports between app.js and actions.js:
 * 
 * app.js creates the core functions → calls setCoreFunctions()
 * actions.js stores references → uses them when needed
 * 
 * This prevents:
 *   app.js → imports actions.js
 *   actions.js → imports app.js (CIRCULAR!)
 * 
 * Instead:
 *   app.js → imports actions.js + calls setCoreFunctions()
 *   actions.js → receives functions as parameters
 */

// ============================================================================
// MODAL CONTENT FUNCTIONS
// ============================================================================

/**
 * showAddUserModal()
 * - Full Name, Email, Role fields
 * - Cancel + Add User buttons
 * - Used by: users page "Add User" button
 */

/**
 * showEditUserModal(id)
 * - Pre-fills form with existing user data
 * - Full Name, Email, Role, Status fields
 * - Looks up user by ID from DATA.users
 * - Used by: users page edit buttons
 */

/**
 * showUpdateChildModal()
 * - Child Name, Vaccine selector, Date, Progress slider
 * - Cancel + Update Record buttons
 * - Used by: immunization page "Update" and "Add Child" buttons
 */

/**
 * showScheduleInspectionModal()
 * - Permit ID selector (shows only Pending permits)
 * - Inspector selector, Date/Time pickers
 * - Used by: sanitation page "Schedule Inspection" button
 */

/**
 * showChecklistModal()
 * - Pre-defined inspection checklist items
 * - Some items pre-checked (demo data)
 * - Cancel + Save Checklist buttons
 * - Used by: wastewater page "Checklist" button
 */

/**
 * showReportCaseModal()
 * - Disease name, Number of cases, Barangay, Severity
 * - Cancel + Submit Report buttons
 * - Used by: surveillance page "Report Case" button
 */

/**
 * showNotificationsModal()
 * - Shows mock notifications with type badges
 * - Close button only
 * - Used by: header notification bell icon
 */

// ============================================================================
// SUMMARY TABLE: WHICH ACTIONS ARE USED WHERE
// ============================================================================

/**
 * USERS PAGE               HEALTH CENTER            SANITATION
 * ─────────────            ─────────────            ──────────
 * add-user                 approve-apt              approve-permit
 * edit-user                reject-apt               reject-permit
 * delete-user              view-patient             schedule-inspection
 * confirm-add-user                                  confirm-schedule
 * confirm-edit-user
 * 
 * IMMUNIZATION             WASTEWATER               SURVEILLANCE
 * ────────────             ──────────               ────────────
 * update-child             view-checklist           report-case
 * add-child                submit-checklist         confirm-report-case
 * confirm-update-child
 * 
 * HEADER/NAV               SETTINGS                 MODALS
 * ──────────               ────────                 ──────
 * show-notifications       save-settings            close-modal
 * mark-all-read            reset-system
 * profile-view             clear-logs
 * profile-settings         system-backup
 * profile-logout
 * nav-health-center
 * nav-sanitation
 * nav-immunization
 * nav-wastewater
 * nav-logs
 * new-appointment
 * view-all-activity
 */



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


 // ─── APPLICATION CONFIGURATION ────────────────────────────────────────────────
// Navigation menus, role definitions, and page metadata
// (Static configuration only - for mock data see data.js)

// ─── APPLICATION STATE ────────────────────────────────────────────────────────
// Central state object - controls navigation, theme, UI toggles, and filters
