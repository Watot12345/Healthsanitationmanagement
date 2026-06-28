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
import { initComplianceFilters, loadComplianceData } from './renderers/compliance.js';

<<<<<<< HEAD
import { renderSidebar, toggleExpanded } from './ui/sidebar.js';
=======
import { renderSidebar } from './ui/sidebar.js';
>>>>>>> e734cde451377a162ff7eb7686dfa112a9f6ece8
import { toggleChat } from './ui/aiChat.js';
import { updateHeader } from './ui/header.js';
import { renderNotificationPanel } from './ui/notification.js';
import { getSearchValue, getSelectValue } from './utils/search.js';
import { handleAction, setCoreFunctions } from './actions.js';
import { VIEW_RENDERERS, initHealthCenterCalendar, initAnalyticsCharts, initLogFilters, updateKPICards } from './renderers/index.js';
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

// FIX: Removed patchSidebarChevrons() entirely.
// sidebar.js already assigns class="nav-chevron" to the trailing chevron SVG
// inside every [data-toggle] button template, so a JS patch pass is redundant.
// The old function also contained a regex with broken operator precedence that
// could accidentally tag module-icon SVGs as chevrons, hiding them when the
// sidebar collapses.

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
            initCalendarIfNeeded();
        }, 350);
    } else {
        main.innerHTML = renderer ? renderer() : emptyStateIllustrated('View not found', 'The requested page could not be loaded');
        main.classList.add('fade-in');
        setTimeout(() => main.classList.remove('fade-in'), 300);
        restoreSearchValues();
        initCalendarIfNeeded();
    }

    updateHeader();
    renderSidebar();
    // FIX: patchSidebarChevrons() calls removed from here
}

// Initialize view-specific features after render
function initCalendarIfNeeded() {
    if (state.view === 'health-center') {
        setTimeout(() => initHealthCenterCalendar(), 100);
    } else if (state.view === 'analytics') {
        console.log('ANALYTICS VIEW - calling insights');
        setTimeout(() => {
            initAnalyticsCharts();
            console.log('Calling loadInsights now');
            loadInsights();
        }, 150);
    } else if (state.view === 'logs') {
        setTimeout(() => initLogFilters(), 100);
    } else if (state.view === 'compliance') {
        setTimeout(() => initComplianceFilters(), 100);
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
    } else if (state.view === 'immunization-growth') {
        setTimeout(() => initGrowthCharts(), 150);
    } else if (state.view === 'wastewater-schedule') {
        setTimeout(() => initMaintenanceCalendar(), 150);
    } else if (state.view === 'surveillance-mapping') {
        setTimeout(() => initMappingClustering(), 150);
    }

    if (state.view === 'compliance') {
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
    localStorage.setItem('hsms-dark', state.darkMode ? 'true' : 'false');
    const iconSun = document.getElementById('icon-sun');
    const iconMoon = document.getElementById('icon-moon');
    if (iconSun) iconSun.classList.toggle('hidden', !state.darkMode);
    if (iconMoon) iconMoon.classList.toggle('hidden', state.darkMode);
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
    } catch (e) { }
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
    } catch (e) { }
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
    } catch (e) { }
}
async function loadUsers() {
    try {
        const response = await fetch('api/admin/getUsers.php');
        if (response.ok) {
            const data = await response.json();
            DATA.users = data;
        }
    } catch (e) { }
}
async function loadLogs() {
    try {
        const response = await fetch('api/admin/getLogs.php');
        if (response.ok) {
            const data = await response.json();
            console.log('API logs count:', data.length);
            DATA.logs = data;
            console.log('DATA.logs count:', DATA.logs.length);
        }
    } catch (e) { }
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

function normalizeInsightPayload(data) {
    if (!data || typeof data !== 'object') return null;

    if (Array.isArray(data)) {
        return { insights: data };
    }

    if (data.insights && Array.isArray(data.insights)) {
        return data;
    }

    const legacyShape = data.operational || data.risk || data.action;
    if (legacyShape) {
        const cards = [];
        const sections = [
            { key: 'operational', category: 'Operational' },
            { key: 'risk', category: 'Risk' },
            { key: 'action', category: 'Action' }
        ];

        sections.forEach(({ key, category }) => {
            const item = data[key];
            if (!item) return;

            const severity = item.level || item.priority || item.severity || 'Medium';
            const trend = item.trend || (severity === 'High' || severity === 'Critical' ? 'Increasing' : 'Stable');
            const description = item.text || item.description || '';
            const reason = item.reason || 'This insight came from the analytics API.';
            const recommendation = item.recommendation || `Review ${item.title || key} promptly.`;

            cards.push({
                title: item.title || `${category} Update`,
                icon: item.icon || 'fa-lightbulb',
                category,
                severity,
                trend,
                description,
                reason,
                recommendation
            });
        });

        return { ...data, insights: cards };
    }

    return data;
}


function getPriorityBadge(priority) {
    const base = 'px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider';
    if (priority === 'High') return `${base} bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400`;
    if (priority === 'Medium') return `${base} bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400`;
    return `${base} bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400`;
}
function renderChartInsightCards(insights) {
    console.log('renderChartInsightCards called with:', insights);
    if (!Array.isArray(insights)) {
        console.log('insights is not an array');
        return;
    }
<<<<<<< HEAD

    insights.forEach(item => {
        console.log('Processing insight item:', item);
        const chartId = item.chart;
=======
    
    insights.forEach(item => {
        console.log('Processing insight item:', item);
        const chartId = item.chart; // e.g., "service_requests", "disease_surveillance"
>>>>>>> e734cde451377a162ff7eb7686dfa112a9f6ece8
        const containerMap = {
            'service_requests': 'ai-card-trendChart',
            'disease_surveillance': 'ai-card-diseaseTrendChart',
            'weekly_activity': 'ai-card-heatmapChart',
            'service_distribution': 'ai-card-donutChart',
            'staff_performance': 'ai-card-staffChart'
        };
        const containerId = containerMap[chartId];
        console.log('Looking for container:', containerId);
        const container = document.getElementById(containerId);
        console.log('Container found:', container);
<<<<<<< HEAD

=======
        
>>>>>>> e734cde451377a162ff7eb7686dfa112a9f6ece8
        if (container && item.title !== 'No significant insight') {
            container.innerHTML = renderSingleInsightCard(item);
            console.log('Rendered insight card in:', containerId);
        }
    });
}
function renderAISnapshot(data) {
    const snapshot = document.getElementById('ai-snapshot');
    if (!snapshot) return;
<<<<<<< HEAD

=======
    
    // Better data extraction with proper fallbacks
>>>>>>> e734cde451377a162ff7eb7686dfa112a9f6ece8
    const snapshotData = {
        status: data.overall_risk || data.status || 'Normal',
        headline: data.overall_risk ? `${data.overall_risk} Risk Level` : (data.headline || 'System Status'),
        summary: data.executive_summary || data.summary || 'No summary available',
        priority: data.priority || (data.overall_risk === 'Critical' || data.overall_risk === 'High' ? 'High' : 'Medium'),
        confidence: data.confidence_score || data.confidence || 0,
        lastUpdated: data.last_updated || data.lastUpdated || new Date().toLocaleString(),
        monitoringSince: data.monitoring_since || data.monitoringSince || '2 hours',
        riskTrend: data.risk_trend || data.riskTrend || 'Stable',
        topFinding: data.top_finding || data.topFinding || 'No critical findings detected',
        nextAction: data.next_action || data.nextAction || 'Continue routine monitoring'
    };
<<<<<<< HEAD

    const statusConfig = {
        'Normal': {
            dot: 'bg-emerald-400',
            border: 'border-emerald-400/30',
=======
    
    const statusConfig = {
        'Normal': { 
            dot: 'bg-emerald-400', 
            border: 'border-emerald-400/30', 
>>>>>>> e734cde451377a162ff7eb7686dfa112a9f6ece8
            bg: 'from-emerald-50/60 via-white/80 to-emerald-50/30 dark:from-emerald-950/30 dark:via-slate-900/50 dark:to-emerald-950/10',
            badge: 'bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 backdrop-blur-sm',
            glow: 'shadow-emerald-500/10',
            pulse: 'ring-emerald-400/30',
            icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
        },
<<<<<<< HEAD
        'Attention': {
            dot: 'bg-amber-400',
            border: 'border-amber-400/30',
=======
        'Attention': { 
            dot: 'bg-amber-400', 
            border: 'border-amber-400/30', 
>>>>>>> e734cde451377a162ff7eb7686dfa112a9f6ece8
            bg: 'from-amber-50/60 via-white/80 to-amber-50/30 dark:from-amber-950/30 dark:via-slate-900/50 dark:to-amber-950/10',
            badge: 'bg-amber-100/80 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 backdrop-blur-sm',
            glow: 'shadow-amber-500/10',
            pulse: 'ring-amber-400/30',
            icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>`,
        },
<<<<<<< HEAD
        'Warning': {
            dot: 'bg-orange-400',
            border: 'border-orange-400/30',
=======
        'Warning': { 
            dot: 'bg-orange-400', 
            border: 'border-orange-400/30', 
>>>>>>> e734cde451377a162ff7eb7686dfa112a9f6ece8
            bg: 'from-orange-50/60 via-white/80 to-orange-50/30 dark:from-orange-950/30 dark:via-slate-900/50 dark:to-orange-950/10',
            badge: 'bg-orange-100/80 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 backdrop-blur-sm',
            glow: 'shadow-orange-500/10',
            pulse: 'ring-orange-400/30',
            icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>`,
        },
<<<<<<< HEAD
        'Critical': {
            dot: 'bg-rose-400',
            border: 'border-rose-400/30',
=======
        'Critical': { 
            dot: 'bg-rose-400', 
            border: 'border-rose-400/30', 
>>>>>>> e734cde451377a162ff7eb7686dfa112a9f6ece8
            bg: 'from-rose-50/60 via-white/80 to-rose-50/30 dark:from-rose-950/30 dark:via-slate-900/50 dark:to-rose-950/10',
            badge: 'bg-rose-100/80 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 backdrop-blur-sm',
            glow: 'shadow-rose-500/10',
            pulse: 'ring-rose-400/30',
            icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
        }
    };
<<<<<<< HEAD

    const normalizedStatus = snapshotData.status.charAt(0).toUpperCase() + snapshotData.status.slice(1).toLowerCase();
    const config = statusConfig[normalizedStatus] || statusConfig['Normal'];
    const confidenceWidth = Math.min(100, Math.max(0, snapshotData.confidence));

=======
    
    // Normalize status for case-insensitive matching
    const normalizedStatus = snapshotData.status.charAt(0).toUpperCase() + snapshotData.status.slice(1).toLowerCase();
    const config = statusConfig[normalizedStatus] || statusConfig['Normal'];
    const confidenceWidth = Math.min(100, Math.max(0, snapshotData.confidence));
    
>>>>>>> e734cde451377a162ff7eb7686dfa112a9f6ece8
    const priorityColors = {
        'High': 'text-rose-600 dark:text-rose-400',
        'Medium': 'text-amber-600 dark:text-amber-400',
        'Low': 'text-emerald-600 dark:text-emerald-400'
    };
<<<<<<< HEAD

=======
    
>>>>>>> e734cde451377a162ff7eb7686dfa112a9f6ece8
    const trendIcons = {
        'Stable': `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14"/></svg>`,
        'Improving': `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/></svg>`,
        'Worsening': `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>`
    };
<<<<<<< HEAD

=======
    
>>>>>>> e734cde451377a162ff7eb7686dfa112a9f6ece8
    const trendColor = {
        'Stable': 'text-slate-500 dark:text-slate-400',
        'Improving': 'text-emerald-600 dark:text-emerald-400',
        'Worsening': 'text-rose-600 dark:text-rose-400'
    };

<<<<<<< HEAD
    let summaryText = snapshotData.summary;
    if (summaryText === 'No summary available' || !summaryText) {
        const statusEmoji = snapshotData.status === 'Normal' ? '✅' :
            snapshotData.status === 'Critical' ? '🚨' : 'ℹ️';
=======
    // Generate a dynamic summary if none provided
    let summaryText = snapshotData.summary;
    if (summaryText === 'No summary available' || !summaryText) {
        // Try to generate a contextual summary
        const statusEmoji = snapshotData.status === 'Normal' ? '✅' : 
                           snapshotData.status === 'Critical' ? '🚨' : 'ℹ️';
>>>>>>> e734cde451377a162ff7eb7686dfa112a9f6ece8
        summaryText = `${statusEmoji} System is ${snapshotData.status.toLowerCase()} with ${snapshotData.confidence}% confidence`;
    }

    snapshot.innerHTML = `
        <div class="ai-snapshot-card relative overflow-hidden rounded-2xl border ${config.border} bg-gradient-to-br ${config.bg} backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-500 group ${config.glow}">
<<<<<<< HEAD
            <div class="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-[0.08] blur-3xl ${config.dot.replace('bg-', 'bg-')} animate-pulse-slow"></div>
            <div class="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-[0.05] blur-2xl ${config.dot.replace('bg-', 'bg-')} animate-pulse-slower"></div>
            
=======
            <!-- Ambient glow - AI breathing effect -->
            <div class="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-[0.08] blur-3xl ${config.dot.replace('bg-', 'bg-')} animate-pulse-slow"></div>
            <div class="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-[0.05] blur-2xl ${config.dot.replace('bg-', 'bg-')} animate-pulse-slower"></div>
            
            <!-- Scanning line shimmer -->
>>>>>>> e734cde451377a162ff7eb7686dfa112a9f6ece8
            <div class="absolute inset-0 pointer-events-none overflow-hidden">
                <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div class="absolute -inset-full w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-12 translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000 ease-out"></div>
                </div>
            </div>
            
            <div class="relative p-5 md:p-6">
<<<<<<< HEAD
=======
                <!-- Header -->
>>>>>>> e734cde451377a162ff7eb7686dfa112a9f6ece8
                <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center gap-3 min-w-0">
                        <div class="flex-shrink-0 w-10 h-10 rounded-xl ${config.badge} flex items-center justify-center shadow-sm relative">
                            ${config.icon}
<<<<<<< HEAD
=======
                            <!-- Live pulse dot -->
>>>>>>> e734cde451377a162ff7eb7686dfa112a9f6ece8
                            <span class="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${config.dot} ring-2 ring-white dark:ring-slate-800 animate-ping"></span>
                            <span class="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${config.dot} ring-2 ring-white dark:ring-slate-800"></span>
                        </div>
                        <div class="min-w-0">
                            <h3 class="font-bold text-base md:text-lg text-slate-800 dark:text-slate-100 tracking-tight truncate">${snapshotData.headline}</h3>
                            <div class="flex items-center gap-2 mt-0.5">
                                <span class="w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse"></span>
                                <span class="text-xs font-medium text-slate-500 dark:text-slate-400">AI Monitoring · Live</span>
                                <span class="text-[10px] text-slate-400 dark:text-slate-500 hidden sm:inline">• ${snapshotData.monitoringSince}</span>
                            </div>
                        </div>
                    </div>
                    <span class="px-3 py-1 rounded-full text-xs font-semibold ${config.badge} shadow-sm border border-current/10 whitespace-nowrap ml-2">
                        ${snapshotData.status}
                    </span>
                </div>
                
<<<<<<< HEAD
=======
                <!-- Summary + Top Finding -->
>>>>>>> e734cde451377a162ff7eb7686dfa112a9f6ece8
                <div class="space-y-1.5 mb-4">
                    <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        ${summaryText}
                    </p>
                    <div class="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/30 rounded-lg px-3 py-2 border border-slate-200/50 dark:border-slate-700/50">
                        <span class="font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">🔍 Top finding:</span>
                        <span class="text-slate-600 dark:text-slate-400">${snapshotData.topFinding}</span>
                    </div>
                </div>
                
<<<<<<< HEAD
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
=======
                <!-- Stats grid -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
                    <!-- Priority -->
>>>>>>> e734cde451377a162ff7eb7686dfa112a9f6ece8
                    <div class="flex items-center gap-1.5">
                        <svg class="w-3.5 h-3.5 ${priorityColors[snapshotData.priority] || 'text-slate-400'}" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z"/>
                        </svg>
                        <span class="text-xs font-medium text-slate-500 dark:text-slate-400">${snapshotData.priority} Priority</span>
                    </div>
                    
<<<<<<< HEAD
=======
                    <!-- Risk Trend -->
>>>>>>> e734cde451377a162ff7eb7686dfa112a9f6ece8
                    <div class="flex items-center gap-1.5">
                        ${trendIcons[snapshotData.riskTrend] || trendIcons['Stable']}
                        <span class="text-xs font-medium ${trendColor[snapshotData.riskTrend] || 'text-slate-500'}">${snapshotData.riskTrend}</span>
                    </div>
                    
<<<<<<< HEAD
=======
                    <!-- Confidence with bar -->
>>>>>>> e734cde451377a162ff7eb7686dfa112a9f6ece8
                    <div class="col-span-2 flex items-center gap-2">
                        <div class="flex-1 h-1.5 rounded-full bg-slate-200/60 dark:bg-slate-700/60 overflow-hidden">
                            <div class="h-full rounded-full bg-gradient-to-r ${config.dot} transition-all duration-700 ease-out" style="width:${confidenceWidth}%"></div>
                        </div>
                        <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 min-w-[2.5rem] text-right">${snapshotData.confidence}%</span>
                    </div>
                </div>
                
<<<<<<< HEAD
=======
                <!-- Action row + interactions -->
>>>>>>> e734cde451377a162ff7eb7686dfa112a9f6ece8
                <div class="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-200/40 dark:border-slate-700/40">
                    <div class="flex items-center gap-2 text-xs">
                        <span class="text-slate-400 dark:text-slate-500">Next action:</span>
                        <span class="font-medium text-slate-700 dark:text-slate-300">${snapshotData.nextAction}</span>
                    </div>
                    
                    <div class="flex items-center gap-1">
<<<<<<< HEAD
=======
                        <!-- AI Timeline button -->
>>>>>>> e734cde451377a162ff7eb7686dfa112a9f6ece8
                        <button onclick="alert('AI Timeline: showing recent changes and monitoring history')" 
                                class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors" 
                                title="View AI Timeline">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </button>
                        
<<<<<<< HEAD
=======
                        <!-- Explain button -->
>>>>>>> e734cde451377a162ff7eb7686dfa112a9f6ece8
                        <button onclick="alert('Why this recommendation?\\n\\nBased on recent sanitation reports and health indicators, the AI recommends this action to maintain municipal health standards.')" 
                                class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors" 
                                title="Explain recommendation">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </button>
                        
<<<<<<< HEAD
=======
                        <!-- Refresh button -->
>>>>>>> e734cde451377a162ff7eb7686dfa112a9f6ece8
                        <button onclick="refreshInsights()" 
                                class="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors group/refresh" 
                                title="Refresh insights">
                            <svg class="w-4 h-4 group-hover/refresh:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                            </svg>
                        </button>
                    </div>
                </div>
                
<<<<<<< HEAD
=======
                <!-- Data freshness -->
>>>>>>> e734cde451377a162ff7eb7686dfa112a9f6ece8
                <div class="flex items-center gap-1.5 mt-2 text-[10px] text-slate-400 dark:text-slate-500">
                    <span>🟢</span>
                    <span>Updated ${snapshotData.lastUpdated}</span>
                    <span class="hidden sm:inline">• Monitoring since ${snapshotData.monitoringSince}</span>
                </div>
            </div>
        </div>
    `;
<<<<<<< HEAD

=======
    
>>>>>>> e734cde451377a162ff7eb7686dfa112a9f6ece8
    snapshot.classList.remove('hidden');
}

function refreshInsights() {
    if (insightsLoading) return;
<<<<<<< HEAD

    const btn = document.querySelector('.group/refresh svg');
    if (btn) btn.classList.add('animate-spin');

=======
    
    // Animate the refresh button
    const btn = document.querySelector('.group/refresh svg');
    if (btn) btn.classList.add('animate-spin');
    
    // Clear cache and reload
>>>>>>> e734cde451377a162ff7eb7686dfa112a9f6ece8
    fetch('api/analytics/ai-snapshot.php', { cache: 'no-store' })
        .then(() => {
            setTimeout(() => {
                if (btn) btn.classList.remove('animate-spin');
            }, 500);
        });
<<<<<<< HEAD

    loadInsights();
}

function renderSingleInsightCard(item) {
    const badgeConfig = {
        'Trending Up': {
            border: 'border-emerald-400/40',
            dot: 'bg-emerald-400',
=======
    
    loadInsights();
}

function renderSingleInsightCard(item) {
    const badgeConfig = {
        'Trending Up': { 
            border: 'border-emerald-400/40', 
            dot: 'bg-emerald-400', 
>>>>>>> e734cde451377a162ff7eb7686dfa112a9f6ece8
            icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>`,
            gradient: 'from-emerald-50/40 via-white/60 to-emerald-50/20 dark:from-emerald-950/20 dark:via-slate-900/40 dark:to-emerald-950/10',
            badgeClass: 'bg-emerald-100/70 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
        },
<<<<<<< HEAD
        'Trending Down': {
            border: 'border-rose-400/40',
            dot: 'bg-rose-400',
=======
        'Trending Down': { 
            border: 'border-rose-400/40', 
            dot: 'bg-rose-400', 
>>>>>>> e734cde451377a162ff7eb7686dfa112a9f6ece8
            icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17l5-5m0 0l-5-5m5 5H6"/></svg>`,
            gradient: 'from-rose-50/40 via-white/60 to-rose-50/20 dark:from-rose-950/20 dark:via-slate-900/40 dark:to-rose-950/10',
            badgeClass: 'bg-rose-100/70 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
        },
<<<<<<< HEAD
        'Stable': {
            border: 'border-blue-400/40',
            dot: 'bg-blue-400',
=======
        'Stable': { 
            border: 'border-blue-400/40', 
            dot: 'bg-blue-400', 
>>>>>>> e734cde451377a162ff7eb7686dfa112a9f6ece8
            icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14"/></svg>`,
            gradient: 'from-blue-50/40 via-white/60 to-blue-50/20 dark:from-blue-950/20 dark:via-slate-900/40 dark:to-blue-950/10',
            badgeClass: 'bg-blue-100/70 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
        },
<<<<<<< HEAD
        'Needs Attention': {
            border: 'border-amber-400/40',
            dot: 'bg-amber-400',
=======
        'Needs Attention': { 
            border: 'border-amber-400/40', 
            dot: 'bg-amber-400', 
>>>>>>> e734cde451377a162ff7eb7686dfa112a9f6ece8
            icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>`,
            gradient: 'from-amber-50/40 via-white/60 to-amber-50/20 dark:from-amber-950/20 dark:via-slate-900/40 dark:to-amber-950/10',
            badgeClass: 'bg-amber-100/70 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
        },
<<<<<<< HEAD
        'Good Performance': {
            border: 'border-emerald-400/40',
            dot: 'bg-emerald-400',
=======
        'Good Performance': { 
            border: 'border-emerald-400/40', 
            dot: 'bg-emerald-400', 
>>>>>>> e734cde451377a162ff7eb7686dfa112a9f6ece8
            icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
            gradient: 'from-emerald-50/40 via-white/60 to-emerald-50/20 dark:from-emerald-950/20 dark:via-slate-900/40 dark:to-emerald-950/10',
            badgeClass: 'bg-emerald-100/70 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
        },
<<<<<<< HEAD
        'Trend': {
            border: 'border-emerald-400/40',
            dot: 'bg-emerald-400',
=======
        'Trend': { 
            border: 'border-emerald-400/40', 
            dot: 'bg-emerald-400', 
>>>>>>> e734cde451377a162ff7eb7686dfa112a9f6ece8
            icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>`,
            gradient: 'from-emerald-50/40 via-white/60 to-emerald-50/20 dark:from-emerald-950/20 dark:via-slate-900/40 dark:to-emerald-950/10',
            badgeClass: 'bg-emerald-100/70 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
        },
<<<<<<< HEAD
        'Risk': {
            border: 'border-rose-400/40',
            dot: 'bg-rose-400',
=======
        'Risk': { 
            border: 'border-rose-400/40', 
            dot: 'bg-rose-400', 
>>>>>>> e734cde451377a162ff7eb7686dfa112a9f6ece8
            icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
            gradient: 'from-rose-50/40 via-white/60 to-rose-50/20 dark:from-rose-950/20 dark:via-slate-900/40 dark:to-rose-950/10',
            badgeClass: 'bg-rose-100/70 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
        },
<<<<<<< HEAD
        'Anomaly': {
            border: 'border-amber-400/40',
            dot: 'bg-amber-400',
=======
        'Anomaly': { 
            border: 'border-amber-400/40', 
            dot: 'bg-amber-400', 
>>>>>>> e734cde451377a162ff7eb7686dfa112a9f6ece8
            icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>`,
            gradient: 'from-amber-50/40 via-white/60 to-amber-50/20 dark:from-amber-950/20 dark:via-slate-900/40 dark:to-amber-950/10',
            badgeClass: 'bg-amber-100/70 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
        },
<<<<<<< HEAD
        'Forecast': {
            border: 'border-blue-400/40',
            dot: 'bg-blue-400',
=======
        'Forecast': { 
            border: 'border-blue-400/40', 
            dot: 'bg-blue-400', 
>>>>>>> e734cde451377a162ff7eb7686dfa112a9f6ece8
            icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`,
            gradient: 'from-blue-50/40 via-white/60 to-blue-50/20 dark:from-blue-950/20 dark:via-slate-900/40 dark:to-blue-950/10',
            badgeClass: 'bg-blue-100/70 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
        },
<<<<<<< HEAD
        'Opportunity': {
            border: 'border-emerald-400/40',
            dot: 'bg-emerald-400',
=======
        'Opportunity': { 
            border: 'border-emerald-400/40', 
            dot: 'bg-emerald-400', 
>>>>>>> e734cde451377a162ff7eb7686dfa112a9f6ece8
            icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>`,
            gradient: 'from-emerald-50/40 via-white/60 to-emerald-50/20 dark:from-emerald-950/20 dark:via-slate-900/40 dark:to-emerald-950/10',
            badgeClass: 'bg-emerald-100/70 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
        },
    };
<<<<<<< HEAD

    const config = badgeConfig[item.badge] || {
        border: 'border-slate-400/40',
        dot: 'bg-slate-400',
=======
    
    const config = badgeConfig[item.badge] || { 
        border: 'border-slate-400/40', 
        dot: 'bg-slate-400', 
>>>>>>> e734cde451377a162ff7eb7686dfa112a9f6ece8
        icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
        gradient: 'from-slate-50/40 via-white/60 to-slate-50/20 dark:from-slate-800/20 dark:via-slate-900/40 dark:to-slate-800/10',
        badgeClass: 'bg-slate-100/70 text-slate-700 dark:bg-slate-700/30 dark:text-slate-300'
    };
<<<<<<< HEAD

    const confidenceWidth = Math.min(100, Math.max(0, item.confidence || 0));

=======
    
    const confidenceWidth = Math.min(100, Math.max(0, item.confidence || 0));
    
>>>>>>> e734cde451377a162ff7eb7686dfa112a9f6ece8
    const getConfidenceColor = (value) => {
        if (value >= 80) return 'bg-emerald-400';
        if (value >= 60) return 'bg-blue-400';
        if (value >= 40) return 'bg-amber-400';
        return 'bg-rose-400';
    };
<<<<<<< HEAD

=======
    
>>>>>>> e734cde451377a162ff7eb7686dfa112a9f6ece8
    const confidenceColor = getConfidenceColor(confidenceWidth);

    return `
        <div class="ai-mini-card group relative overflow-hidden rounded-xl border ${config.border} bg-gradient-to-br ${config.gradient} backdrop-blur-sm p-4 shadow-sm hover:shadow-lg transition-all duration-400 hover:-translate-y-1 cursor-default">
<<<<<<< HEAD
            <div class="absolute -top-10 -right-10 w-24 h-24 rounded-full opacity-[0.06] blur-2xl ${config.dot.replace('bg-', 'bg-')} group-hover:opacity-[0.12] transition-opacity duration-500"></div>
            
=======
            <!-- Subtle ambient glow -->
            <div class="absolute -top-10 -right-10 w-24 h-24 rounded-full opacity-[0.06] blur-2xl ${config.dot.replace('bg-', 'bg-')} group-hover:opacity-[0.12] transition-opacity duration-500"></div>
            
            <!-- Scanning shimmer on hover -->
>>>>>>> e734cde451377a162ff7eb7686dfa112a9f6ece8
            <div class="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
                <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div class="absolute -inset-full w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/5 to-transparent -rotate-12 translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000 ease-out"></div>
                </div>
            </div>
            
            <div class="relative">
<<<<<<< HEAD
=======
                <!-- Header with icon and badge -->
>>>>>>> e734cde451377a162ff7eb7686dfa112a9f6ece8
                <div class="flex items-start justify-between mb-2.5">
                    <div class="flex items-center gap-2.5 min-w-0">
                        <div class="flex-shrink-0 w-8 h-8 rounded-lg ${config.badgeClass} flex items-center justify-center shadow-sm">
                            ${config.icon}
                        </div>
                        <span class="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">${item.title}</span>
                    </div>
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-medium ${config.badgeClass} border border-current/10 shadow-sm whitespace-nowrap ml-2">
                        ${item.badge}
                    </span>
                </div>
                
<<<<<<< HEAD
                <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2.5">${item.insight}</p>
                
=======
                <!-- Insight text -->
                <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2.5">${item.insight}</p>
                
                <!-- Recommendation with arrow -->
>>>>>>> e734cde451377a162ff7eb7686dfa112a9f6ece8
                <div class="flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-cyan-400 mb-3 group-hover:text-blue-700 dark:group-hover:text-cyan-300 transition-colors">
                    <svg class="w-3.5 h-3.5 flex-shrink-0 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                    </svg>
                    <span class="truncate">${item.recommendation}</span>
                </div>
                
<<<<<<< HEAD
=======
                <!-- Confidence bar with label -->
>>>>>>> e734cde451377a162ff7eb7686dfa112a9f6ece8
                <div class="flex items-center gap-2">
                    <div class="flex-1 h-1.5 rounded-full bg-slate-200/60 dark:bg-slate-700/60 overflow-hidden">
                        <div class="h-full rounded-full bg-gradient-to-r ${confidenceColor} transition-all duration-700 ease-out" style="width:${confidenceWidth}%"></div>
                    </div>
                    <span class="text-[10px] font-semibold text-slate-500 dark:text-slate-400 min-w-[2.2rem] text-right">${confidenceWidth}%</span>
                </div>
                
<<<<<<< HEAD
=======
                <!-- Interactive footer -->
>>>>>>> e734cde451377a162ff7eb7686dfa112a9f6ece8
                <div class="flex items-center justify-end gap-1 mt-2 pt-2 border-t border-slate-200/40 dark:border-slate-700/40">
                    <button onclick="alert('View details for: ${item.title}')" 
                            class="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors flex items-center gap-1 group/btn">
                        <span>Details</span>
                        <svg class="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                    </button>
                    <span class="w-px h-3 bg-slate-200/60 dark:bg-slate-700/60"></span>
                    <button onclick="alert('Confidence breakdown for: ${item.title}\\n\\nBased on data quality, recency, and pattern consistency.')" 
                            class="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                        Confidence breakdown
                    </button>
                </div>
            </div>
        </div>
    `;
}

function updateLastAnalyzedFooter() {
    const footerTime = document.getElementById('ai-last-analyzed');
    const currentTime = document.getElementById('ai-current-time');

    if (footerTime && lastAnalyzedTime) {
        const hours = String(lastAnalyzedTime.getHours()).padStart(2, '0');
        const minutes = String(lastAnalyzedTime.getMinutes()).padStart(2, '0');
        const seconds = String(lastAnalyzedTime.getSeconds()).padStart(2, '0');
        footerTime.textContent = `${hours}:${minutes}:${seconds}`;
    }

    if (currentTime) {
        const now = new Date();
        const dateStr = now.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
        currentTime.textContent = dateStr;
    }
}

function setupAutoRefresh() {
    if (insightsRefreshTimer) clearTimeout(insightsRefreshTimer);
    insightsRefreshTimer = setTimeout(() => loadInsights(), 300000);
}


async function reloadCurrentView() {
    await loadDashboardData();
    await loadUsers();
    await loadLogs();
    renderView();
}

async function loadInsights() {
    console.log('loadInsights STARTED');
    const target = document.getElementById('ai-insights');
    console.log('Target element:', target);
    if (!target || insightsLoading) return;
    insightsLoading = true;

    const refreshBtn = document.getElementById('ai-refresh-btn');
    const refreshIcon = document.getElementById('ai-refresh-icon');
    if (refreshBtn) refreshBtn.classList.add('ai-refresh-active');
    if (refreshIcon) refreshIcon.classList.add('rotate-infinite');
    if (refreshBtn) refreshBtn.onclick = (e) => { e.preventDefault(); refreshInsights(); };

    showLoading();
    animateAvatar('loading');

    try {
        console.log('Fetching ai-snapshot.php...');
        const response = await fetch('api/analytics/ai-snapshot.php', { cache: 'no-store' });
        console.log('Response status:', response.status);
        if (!response.ok) throw new Error(`HTTP Error ${response.status}`);

        const data = await response.json();
        console.log('Insights data received:', data);
        hideLoading();
        animateAvatar('complete');

        if (data?.status === 'success' && data.insights) {
            console.log('Rendering snapshot + chart cards');
            console.log('data.insights structure:', Object.keys(data.insights));
            console.log('data.insights.snapshot:', data.insights.snapshot);
            console.log('data.insights.insights:', data.insights.insights);
<<<<<<< HEAD

=======
            
>>>>>>> e734cde451377a162ff7eb7686dfa112a9f6ece8
            renderAISnapshot(data.insights);
            if (data.insights.insights) renderChartInsightCards(data.insights.insights);
            lastAnalyzedTime = new Date();
            updateLastAnalyzedFooter();
            if (data.insights._stats) updateKPICards(data.insights._stats);
        } else {
            console.log('No insights in response');
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
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>
                    </svg>
                    Retry Connection
                </button>
            </div>`;
        document.getElementById('ai-retry-btn')?.addEventListener('click', refreshInsights);
    } finally {
        insightsLoading = false;
        if (refreshBtn) refreshBtn.classList.remove('ai-refresh-active');
        if (refreshIcon) refreshIcon.classList.remove('rotate-infinite');
        updateLastAnalyzedFooter();
        setupAutoRefresh();
    }
}


<<<<<<< HEAD
// ============================================================
// SETTINGS MODAL
// ============================================================
function openSettingsModal() {
    const isDark = state.darkMode;
    const isCollapsed = document.getElementById('sidebar')?.dataset.collapsed === 'true';

    document.getElementById('modal-title').textContent = 'Settings';
    document.getElementById('modal-body').innerHTML = `
        <div class="space-y-0">
            <div class="settings-section">
                <p class="settings-label">Appearance</p>
                <div class="settings-toggle-row">
                    <div>
                        <p class="settings-toggle-label">Dark Mode</p>
                        <p class="settings-toggle-desc">Switch between light and dark theme</p>
                    </div>
                    <label class="toggle-switch" id="settings-dark-toggle">
                        <input type="checkbox" id="settings-dark-checkbox" ${isDark ? 'checked' : ''}>
                        <div class="toggle-track"><span class="toggle-thumb"></span></div>
                    </label>
                </div>
                <div class="settings-toggle-row">
                    <div>
                        <p class="settings-toggle-label">Compact Sidebar</p>
                        <p class="settings-toggle-desc">Collapse sidebar to icon-only mode</p>
                    </div>
                    <label class="toggle-switch" id="settings-sidebar-toggle">
                        <input type="checkbox" id="settings-sidebar-checkbox" ${isCollapsed ? 'checked' : ''}>
                        <div class="toggle-track"><span class="toggle-thumb"></span></div>
                    </label>
                </div>
            </div>

            <div class="settings-section">
                <p class="settings-label">Notifications</p>
                <div class="settings-toggle-row">
                    <div>
                        <p class="settings-toggle-label">System Alerts</p>
                        <p class="settings-toggle-desc">Show critical system notifications</p>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" checked>
                        <div class="toggle-track"><span class="toggle-thumb"></span></div>
                    </label>
                </div>
                <div class="settings-toggle-row">
                    <div>
                        <p class="settings-toggle-label">Activity Feed</p>
                        <p class="settings-toggle-desc">Show recent activity in sidebar</p>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" checked>
                        <div class="toggle-track"><span class="toggle-thumb"></span></div>
                    </label>
                </div>
            </div>

            <div class="settings-section">
                <p class="settings-label">Account</p>
                <div class="space-y-2">
                    <div class="flex items-center gap-3 p-3 rounded-xl bg-white/40 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/40 backdrop-blur-sm">
                        <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-gov-600 to-gov-800 text-white flex items-center justify-center text-sm font-bold shadow-md shrink-0" id="settings-avatar-preview">M</div>
                        <div class="min-w-0">
                            <p id="settings-profile-name" class="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">Maria Santos</p>
                            <p id="settings-profile-email" class="text-xs text-slate-500 dark:text-slate-400 truncate">maria.santos@municipal.gov</p>
                        </div>
                        <button type="button" class="ml-auto btn btn-secondary btn-sm shrink-0" onclick="alert('Edit profile — connect to your profile update endpoint.')">Edit</button>
                    </div>
                </div>
            </div>

            <div class="settings-section">
                <p class="settings-label">System</p>
                <div class="flex items-center justify-between py-2">
                    <p class="settings-toggle-label text-sm text-slate-500 dark:text-slate-400">Version</p>
                    <span class="text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md border border-slate-200/60 dark:border-slate-700/40">HSMS v2.0.0</span>
                </div>
                <div class="flex items-center justify-between py-2">
                    <p class="settings-toggle-label text-sm text-slate-500 dark:text-slate-400">Clear cache</p>
                    <button type="button" class="btn btn-ghost btn-sm" onclick="localStorage.clear(); location.reload();">Clear &amp; Reload</button>
                </div>
            </div>
        </div>
    `;
    document.getElementById('modal-footer').innerHTML = `
        <button type="button" data-action="close-modal" class="btn btn-secondary">Close</button>
    `;

    const pName = document.getElementById('profile-name')?.textContent;
    const pEmail = document.getElementById('profile-email')?.textContent;
    const pAvatar = document.getElementById('profile-avatar')?.textContent;
    if (pName) document.getElementById('settings-profile-name').textContent = pName;
    if (pEmail) document.getElementById('settings-profile-email').textContent = pEmail;
    if (pAvatar) document.getElementById('settings-avatar-preview').textContent = pAvatar;

    const darkCheckbox = document.getElementById('settings-dark-checkbox');
    if (darkCheckbox) {
        darkCheckbox.addEventListener('change', () => {
            toggleDarkMode();
        });
    }

    const sidebarCheckbox = document.getElementById('settings-sidebar-checkbox');
    if (sidebarCheckbox) {
        sidebarCheckbox.addEventListener('change', () => {
            const sidebar = document.getElementById('sidebar');
            if (!sidebar) return;
            const nowCollapsed = sidebar.dataset.collapsed === 'true';
            if (window._applySidebarCollapsed) {
                window._applySidebarCollapsed(!nowCollapsed);
            }
        });
    }

    const overlay = document.getElementById('modal-overlay');
    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
    requestAnimationFrame(() => {
        const panel = document.getElementById('modal-panel');
        if (panel) {
            panel.style.transform = 'scale(1)';
            panel.style.opacity = '1';
        }
    });
}


// Initialize app
function initApp() {
=======
// Initialize app
function initApp() {
    // Add custom animations once
>>>>>>> e734cde451377a162ff7eb7686dfa112a9f6ece8
    if (!document.getElementById('ai-animation-styles')) {
        const style = document.createElement('style');
        style.id = 'ai-animation-styles';
        style.textContent = `
            @keyframes pulse-slow {
                0%, 100% { opacity: 0.08; transform: scale(1); }
                50% { opacity: 0.15; transform: scale(1.05); }
            }
            @keyframes pulse-slower {
                0%, 100% { opacity: 0.05; transform: scale(1); }
                50% { opacity: 0.1; transform: scale(1.08); }
            }
            .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
            .animate-pulse-slower { animation: pulse-slower 6s ease-in-out infinite; }
            .ai-snapshot-card { transition: box-shadow 0.3s ease, transform 0.3s ease; }
            .ai-snapshot-card:hover { transform: translateY(-2px); }
        `;
        document.head.appendChild(style);
    }

<<<<<<< HEAD
=======
    // Set core functions for actions.js to avoid circular dependencies
>>>>>>> e734cde451377a162ff7eb7686dfa112a9f6ece8
    setCoreFunctions({
        navigateTo,
        renderView,
        renderNotificationPanel,
        closeAllDropdowns
    });

    const savedDark = localStorage.getItem('hsms-dark');
    if (savedDark === 'true') {
        state.darkMode = true;
    } else if (savedDark === 'false') {
        state.darkMode = false;
    } else {
        state.darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    document.documentElement.classList.toggle('dark', state.darkMode);
    const iconSun = document.getElementById('icon-sun');
    const iconMoon = document.getElementById('icon-moon');
    if (iconSun) iconSun.classList.toggle('hidden', !state.darkMode);
    if (iconMoon) iconMoon.classList.toggle('hidden', state.darkMode);

<<<<<<< HEAD
    document.getElementById('dark-mode-toggle').addEventListener('click', toggleDarkMode);

    const chatBtn = document.getElementById('ai-chat-toggle-btn');
    if (chatBtn) chatBtn.addEventListener('click', toggleChat);

=======
    // Dark mode toggle
    document.getElementById('dark-mode-toggle').addEventListener('click', toggleDarkMode);
    
    // AI Chat toggle
    const chatBtn = document.getElementById('ai-chat-toggle-btn');
    if (chatBtn) chatBtn.addEventListener('click', toggleChat);
    
    // Sidebar
>>>>>>> e734cde451377a162ff7eb7686dfa112a9f6ece8
    document.getElementById('menu-toggle').addEventListener('click', toggleSidebar);

    const collapseBtn = document.getElementById('sidebar-collapse-btn');
    function applySidebarCollapsed(collapsed) {
        const sidebar = document.getElementById('sidebar');
        const wrapper = document.getElementById('main-wrapper');
        if (!sidebar) return;
        sidebar.dataset.collapsed = collapsed ? 'true' : 'false';
        sidebar.classList.toggle('collapsed', collapsed);
        if (window.innerWidth >= 1024 && wrapper) {
            wrapper.style.paddingLeft = collapsed ? '4.5rem' : '18rem';
        }
        localStorage.setItem('hsms-sidebar-collapsed', collapsed ? 'true' : 'false');
    }
    window._applySidebarCollapsed = applySidebarCollapsed;

    if (collapseBtn) {
        collapseBtn.addEventListener('click', () => {
            const sidebar = document.getElementById('sidebar');
            const isCollapsed = sidebar.dataset.collapsed === 'true';
            applySidebarCollapsed(!isCollapsed);
        });
    }

    const savedCollapsed = localStorage.getItem('hsms-sidebar-collapsed');
    if (savedCollapsed === 'true') {
        applySidebarCollapsed(true);
    } else {
        const wrapper = document.getElementById('main-wrapper');
        if (wrapper && window.innerWidth >= 1024) {
            wrapper.style.paddingLeft = '18rem';
        }
    }

    window.addEventListener('resize', () => {
        const sidebar = document.getElementById('sidebar');
        const wrapper = document.getElementById('main-wrapper');
        if (!sidebar || !wrapper) return;
        if (window.innerWidth >= 1024) {
            const isCollapsed = sidebar.dataset.collapsed === 'true';
            wrapper.style.paddingLeft = isCollapsed ? '4.5rem' : '18rem';
        } else {
            wrapper.style.paddingLeft = '0';
        }
    });

    let flyout = document.getElementById('sidebar-flyout');
    if (!flyout) {
        flyout = document.createElement('div');
        flyout.id = 'sidebar-flyout';
        flyout.className = 'sidebar-flyout';
        document.body.appendChild(flyout);
    }

    let tooltip = document.getElementById('sidebar-tooltip-dynamic');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'sidebar-tooltip';
        tooltip.id = 'sidebar-tooltip-dynamic';
        document.body.appendChild(tooltip);
    }

    let flyoutHideTimer = null;

    function hideFlyout() {
        flyout.classList.remove('visible');
        flyout._sourceItem = null;
        flyout.innerHTML = '';
    }
    function hideTooltip() {
        tooltip.classList.remove('visible');
    }

    function showFlyoutForItem(triggerEl) {
        const groupId = triggerEl.dataset.toggle;
        const singleNav = triggerEl.dataset.nav;

        const navGroups = NAV[state.role] || [];

        let groupEntry = null;
        if (groupId) {
            groupEntry = navGroups.find(g => g.id === groupId || g.group === groupId);
            if (!groupEntry) {
                const btnLabel = triggerEl.querySelector('.nav-label')?.textContent?.trim()
                    || triggerEl.getAttribute('aria-label') || '';
                groupEntry = navGroups.find(g => g.label === btnLabel);
            }
        } else if (singleNav) {
            groupEntry = navGroups.find(g => {
                if (g.id === singleNav) return true;
                if (g.children) return g.children.some(c => c.id === singleNav);
                return false;
            });
            if (groupEntry && !groupEntry.children) {
                groupEntry = { label: groupEntry.label, children: [groupEntry] };
            }
        }

        let headerLabel = '';
        let linksHtml = '';

        if (groupEntry && groupEntry.children && groupEntry.children.length) {
            headerLabel = groupEntry.label || '';
            linksHtml = groupEntry.children.map(child => {
                const isActive = state.view === child.id ? ' flyout-item-active' : '';
                const iconSvg = child.icon
                    ? icon(child.icon, 'w-4 h-4 shrink-0')
                    : `<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 8 8"><circle cx="4" cy="4" r="3"/></svg>`;
                return `<button type="button" class="flyout-item${isActive}" data-nav="${child.id}">
                            <span class="flyout-item-icon">${iconSvg}</span>
                            <span>${child.label}</span>
                        </button>`;
            }).join('');

        } else if (singleNav) {
            const solo = navGroups.find(g => g.id === singleNav) || { id: singleNav, label: singleNav };
            headerLabel = solo.label || singleNav;
            const isActive = state.view === singleNav ? ' flyout-item-active' : '';
            const iconSvg = solo.icon
                ? icon(solo.icon, 'w-4 h-4 shrink-0')
                : `<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 8 8"><circle cx="4" cy="4" r="3"/></svg>`;
            linksHtml = `<button type="button" class="flyout-item${isActive}" data-nav="${singleNav}">
                            <span class="flyout-item-icon">${iconSvg}</span>
                            <span>${headerLabel}</span>
                        </button>`;

        } else {
            const sidebarNav = document.getElementById('sidebar-nav');
            let domChildLinks = [];

            if (groupId && sidebarNav) {
                let sub = sidebarNav.querySelector(
                    `#sub-${groupId}, [data-group="${groupId}"], [id*="${groupId}"]`
                );
                if (!sub) {
                    const parentEl = triggerEl.parentElement;
                    if (parentEl) sub = parentEl.querySelector('[id^="sub-"], [data-subnav], ul');
                }
                if (sub) domChildLinks = [...sub.querySelectorAll('[data-nav]')];
            }

            if (domChildLinks.length) {
                headerLabel = triggerEl.querySelector('.nav-label')?.textContent?.trim()
                    || triggerEl.getAttribute('aria-label') || groupId || '';
                linksHtml = domChildLinks.map(link => {
                    const lbl = link.querySelector('.nav-label')?.textContent?.trim()
                        || link.getAttribute('aria-label') || link.dataset.nav || '';
                    const iconEl = link.querySelector('svg, .nav-icon');
                    const iconHtml = iconEl
                        ? iconEl.outerHTML
                        : `<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 8 8"><circle cx="4" cy="4" r="3"/></svg>`;
                    const isActive = state.view === link.dataset.nav ? ' flyout-item-active' : '';
                    return `<button type="button" class="flyout-item${isActive}" data-nav="${link.dataset.nav}">
                                <span class="flyout-item-icon">${iconHtml}</span>
                                <span>${lbl}</span>
                            </button>`;
                }).join('');
            } else {
                showTooltipForItem(triggerEl);
                return;
            }
        }

        flyout.innerHTML = `
            <div class="flyout-header">${headerLabel}</div>
            <div class="flyout-body">${linksHtml}</div>`;

        const rect = triggerEl.getBoundingClientRect();
        const viewH = window.innerHeight;
        const itemCount = (groupEntry?.children?.length) || 1;
        const estH = itemCount * 40 + 52;
        const topPos = Math.min(Math.max(8, rect.top), viewH - estH - 8);

        flyout.style.top = topPos + 'px';
        flyout.style.left = '4.5rem';
        flyout._sourceItem = triggerEl;
        flyout.classList.add('visible');

        flyout.querySelectorAll('[data-nav]').forEach(btn => {
            btn.addEventListener('click', () => {
                navigateTo(btn.dataset.nav);
                hideFlyout();
            });
        });
    }

    function showTooltipForItem(el) {
        const label = el.querySelector('.nav-label')?.textContent?.trim()
            || el.getAttribute('aria-label')
            || el.dataset.nav || '';
        if (!label) return;
        const rect = el.getBoundingClientRect();
        tooltip.textContent = label;
        tooltip.style.top = (rect.top + rect.height / 2 - 14) + 'px';
        tooltip.style.left = '4.75rem';
        tooltip.classList.add('visible');
    }

    const sidebarEl = document.getElementById('sidebar');

    sidebarEl.addEventListener('mouseover', (e) => {
        if (sidebarEl.dataset.collapsed !== 'true') return;

        if (flyoutHideTimer) { clearTimeout(flyoutHideTimer); flyoutHideTimer = null; }

        const toggleItem = e.target.closest('[data-toggle]');
        if (toggleItem) {
            hideTooltip();
            if (flyout._sourceItem !== toggleItem) {
                showFlyoutForItem(toggleItem);
            }
            return;
        }

        const navItem = e.target.closest('[data-nav]');
        if (navItem) {
            hideTooltip();
            if (flyout._sourceItem !== navItem) {
                showFlyoutForItem(navItem);
            }
            return;
        }

        hideTooltip();
        flyoutHideTimer = setTimeout(hideFlyout, 140);
    });

    sidebarEl.addEventListener('mouseleave', () => {
        hideTooltip();
        flyoutHideTimer = setTimeout(hideFlyout, 200);
    });

    flyout.addEventListener('mouseenter', () => {
        if (flyoutHideTimer) { clearTimeout(flyoutHideTimer); flyoutHideTimer = null; }
    });

    flyout.addEventListener('mouseleave', () => {
        flyoutHideTimer = setTimeout(hideFlyout, 140);
    });

    document.addEventListener('click', (e) => {
        if (!sidebarEl.contains(e.target) && !flyout.contains(e.target)) {
            hideFlyout();
            hideTooltip();
        }
    }, true);
    document.getElementById('sidebar-backdrop').addEventListener('click', closeSidebarMobile);

    document.getElementById('notif-toggle').addEventListener('click', (e) => {
        e.stopPropagation();
        renderNotificationPanel();
        toggleDropdown('notif');
    });

    document.getElementById('profile-toggle').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown('profile');
    });

    const globalSearch = document.getElementById('global-search');
    globalSearch.addEventListener('input', (e) => performGlobalSearch(e.target.value));
    globalSearch.addEventListener('focus', (e) => {
        if (e.target.value) performGlobalSearch(e.target.value);
    });

    document.getElementById('modal-overlay').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeModal();
        if (e.target.closest('[data-action="close-modal"]')) closeModal();
    });

<<<<<<< HEAD
=======
    // Global click handler
>>>>>>> e734cde451377a162ff7eb7686dfa112a9f6ece8
    document.addEventListener('click', (e) => {
        const settingsBtn = e.target.closest('[data-action="profile-settings"]');
        if (settingsBtn) {
            e.preventDefault();
            closeAllDropdowns();
            openSettingsModal();
            return;
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('#notif-dropdown-wrap') &&
            !e.target.closest('#profile-dropdown-wrap') &&
            !e.target.closest('#global-search-wrap')) {
            closeAllDropdowns();
        }

        const toggleBtn = e.target.closest('[data-toggle]');
        if (toggleBtn) {
            const sidebar = document.getElementById('sidebar');
            if (sidebar && sidebar.dataset.collapsed === 'true') {
                showFlyoutForItem(toggleBtn);
                return;
            }
            toggleExpanded(toggleBtn.dataset.toggle);
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

    document.getElementById('main-content').addEventListener('input', handleSearchInput);
    document.getElementById('main-content').addEventListener('change', handleSearchInput);

<<<<<<< HEAD
    renderNotificationPanel();

=======
    // Initial render
    renderNotificationPanel();
    
>>>>>>> e734cde451377a162ff7eb7686dfa112a9f6ece8
    checkAuth().then(async () => {
        await loadDashboardData();
        await loadSystemStatus();
        await loadRecentActivity();
        await loadRecentUpdates();
        await loadUsers();
        await loadLogs();
        renderView();
    });
}

document.addEventListener('DOMContentLoaded', initApp);
