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
import { toggleChat } from './ui/aiChat.js';
import { updateHeader } from './ui/header.js';
import { renderNotificationPanel } from './ui/notification.js';
import { getSearchValue, getSelectValue } from './utils/search.js';
import { handleAction, setCoreFunctions } from './actions.js';
import { VIEW_RENDERERS, initHealthCenterCalendar, initAnalyticsCharts, initLogFilters, updateKPICards } from './renderers/index.js'; // ← Add initHealthCenterCalendar import
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
    
    insights.forEach(item => {
        console.log('Processing insight item:', item);
        const chartId = item.chart; // e.g., "service_requests", "disease_surveillance"
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
        
        if (container && item.title !== 'No significant insight') {
            container.innerHTML = renderSingleInsightCard(item);
            console.log('Rendered insight card in:', containerId);
        }
    });
}
// Add this function right BEFORE renderChartInsightCards (around line 750)

function renderAISnapshot(data) {
    const snapshot = document.getElementById('ai-snapshot');
    if (!snapshot) {
        console.log('ai-snapshot element not found');
        return;
    }
    
    // Handle the actual API structure
    const snapshotData = data.snapshot || {
        status: data.overall_risk || 'Normal',
        headline: data.overall_risk ? `${data.overall_risk} Risk Level` : 'System Status',
        summary: data.executive_summary || 'No summary available',
        priority: data.overall_risk === 'Critical' || data.overall_risk === 'High' ? 'High' : 'Medium',
        confidence: data.confidence_score || 0
    };
    
    const statusColors = {
        'Normal': 'border-l-green-500 bg-green-50 dark:bg-green-900/20',
        'Low': 'border-l-green-500 bg-green-50 dark:bg-green-900/20',
        'Moderate': 'border-l-amber-500 bg-amber-50 dark:bg-amber-900/20',
        'Attention': 'border-l-amber-500 bg-amber-50 dark:bg-amber-900/20',
        'High': 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/20',
        'Warning': 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/20',
        'Critical': 'border-l-red-500 bg-red-50 dark:bg-red-900/20'
    };
    
    snapshot.innerHTML = `
        <div class="ai-snapshot-card border-l-4 ${statusColors[snapshotData.status] || 'border-l-blue-500'} rounded-lg p-4 bg-white dark:bg-slate-800/50 shadow-sm">
            <div class="flex items-center justify-between mb-2">
                <span class="font-bold text-sm text-slate-800 dark:text-slate-200">${snapshotData.headline}</span>
                <span class="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 font-medium">${snapshotData.status}</span>
            </div>
            <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">${snapshotData.summary}</p>
            <div class="flex items-center justify-between mt-3 text-xs text-slate-500 dark:text-slate-400">
                <span class="flex items-center gap-1">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z"/></svg>
                    Priority: ${snapshotData.priority}
                </span>
                <span class="flex items-center gap-1">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                    Confidence: ${snapshotData.confidence}%
                </span>
            </div>
        </div>
    `;
    snapshot.classList.remove('hidden');
    console.log('ai-snapshot rendered and unhidden');
}
function renderSingleInsightCard(item) {
    const badgeColors = {
        'Trend': 'border-l-green-500 bg-green-50',
        'Risk': 'border-l-red-500 bg-red-50',
        'Anomaly': 'border-l-amber-500 bg-amber-50',
        'Forecast': 'border-l-blue-500 bg-blue-50',
        'Opportunity': 'border-l-emerald-500 bg-emerald-50'
    };
    return `
        <div class="ai-mini-card border-l-4 ${badgeColors[item.badge] || 'border-l-slate-500'} rounded-lg p-2.5 bg-white dark:bg-slate-800/50 text-xs">
            <div class="flex items-center justify-between mb-1">
                <span class="font-semibold">${item.title}</span>
                <span class="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100">${item.badge}</span>
            </div>
            <p class="text-slate-600 dark:text-slate-400">${item.insight}</p>
            <p class="text-blue-600 dark:text-blue-400 mt-1">→ ${item.recommendation}</p>
            <div class="mt-1.5 h-1 rounded-full bg-slate-200">
                <div class="h-1 rounded-full bg-gov-600" style="width:${item.confidence}%"></div>
            </div>
            <span class="text-[10px] text-slate-400">Confidence: ${item.confidence}%</span>
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

function refreshInsights() {
    if (insightsRefreshTimer) {
        clearTimeout(insightsRefreshTimer);
        insightsRefreshTimer = null;
    }
    loadInsights();
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
    
    // AI Chat toggle
    const chatBtn = document.getElementById('ai-chat-toggle-btn');
    if (chatBtn) chatBtn.addEventListener('click', toggleChat);
    
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
    renderView();
});
}

document.addEventListener('DOMContentLoaded', initApp);
