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
        setTimeout(() => {
            initAnalyticsCharts();
            loadInsights();
        }, 150);
    } else if (state.view === 'logs') {
        setTimeout(() => initLogFilters(), 100);
    } else if (state.view === 'compliance') {
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
    } else if (state.view === 'immunization-growth') {
        setTimeout(() => initGrowthCharts(), 150);
    } else if (state.view === 'wastewater-schedule') {
        setTimeout(() => initMaintenanceCalendar(), 150);
    } else if (state.view === 'surveillance-mapping') {
        setTimeout(() => initMappingClustering(), 150);
    }

    setTimeout(() => initAiFormAutoFill(), 80);

    if (state.view === 'compliance') {
        // Clear compliance refresh when leaving compliance view
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

async function loadActionSuggestions() {
    const target = document.getElementById('ai-insights');
    if (!target) return;

    try {
        const response = await fetch('api/ai/action-suggestions.php', { cache: 'no-store' });
        if (!response.ok) return;
        const data = await response.json();
        if (!data || data.status !== 'success' || !Array.isArray(data.suggestions)) return;

        const existing = target.querySelector('[data-ai-suggestions]');
        if (existing) existing.remove();

        const html = `
            <div data-ai-suggestions class="mt-3 pt-2 border-t border-white/10 dark:border-slate-800/20">
                <div class="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
                    <span>🤖</span> Suggested Next Actions
                </div>
                <div class="space-y-2">
                    ${data.suggestions.map((item) => `
                        <div class="p-2.5 rounded-xl border border-emerald-500/10 bg-emerald-500/5 dark:bg-emerald-500/10">
                            <div class="flex items-center justify-between gap-2 mb-1">
                                <div class="text-xs font-semibold text-slate-700 dark:text-slate-200">${item.title}</div>
                                <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${item.priority === 'High' ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' : item.priority === 'Medium' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'}">${item.priority}</span>
                            </div>
                            <div class="text-[11px] text-slate-600 dark:text-slate-300">${item.detail}</div>
                            <div class="text-[10px] text-slate-500 mt-1">Module: ${item.module}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        target.insertAdjacentHTML('beforeend', html);
    } catch (e) {
        console.warn('Unable to load AI action suggestions:', e);
    }
}

function getPriorityBadge(priority) {
    const base = 'px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider';
    if (priority === 'High') return `${base} bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400`;
    if (priority === 'Medium') return `${base} bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400`;
    return `${base} bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400`;
}

function initAiFormAutoFill() {
    const buttons = document.querySelectorAll('[data-ai-autofill]');
    if (!buttons.length) return;

    buttons.forEach((button) => {
        if (button.dataset.aiAutofillInitialized === 'true') return;
        button.dataset.aiAutofillInitialized = 'true';

        button.onclick = async () => {
            const type = button.dataset.aiAutofill;
            const noteFieldIds = {
                appointment: ['ai-autofill-notes-appointment'],
                permit: ['ai-autofill-notes-permit'],
                surveillance: ['ai-autofill-notes-surveillance', 'ai-autofill-notes-surveillance-modal'],
                sanitation: ['ai-autofill-notes-sanitation', 'ai-autofill-notes-sanitation-modal'],
                alert: ['ai-autofill-notes-surveillance', 'ai-autofill-notes-surveillance-modal'],
                violation: ['ai-autofill-notes-sanitation', 'ai-autofill-notes-sanitation-modal'],
                'admin-user': ['ai-autofill-notes-admin-user'],
                'admin-violation': ['ai-autofill-notes-admin-violation']
            };
            const feedbackIds = {
                appointment: ['ai-autofill-feedback-appointment'],
                permit: ['ai-autofill-feedback-permit'],
                surveillance: ['ai-autofill-feedback-surveillance', 'ai-autofill-feedback-surveillance-modal'],
                sanitation: ['ai-autofill-feedback-sanitation', 'ai-autofill-feedback-sanitation-modal'],
                alert: ['ai-autofill-feedback-surveillance', 'ai-autofill-feedback-surveillance-modal'],
                violation: ['ai-autofill-feedback-sanitation', 'ai-autofill-feedback-sanitation-modal'],
                'admin-user': ['ai-autofill-feedback-admin-user'],
                'admin-violation': ['ai-autofill-feedback-admin-violation']
            };
            const notesField = button.dataset.notesId ? document.getElementById(button.dataset.notesId) : (noteFieldIds[type] || []).map((id) => document.getElementById(id)).find(Boolean);
            const feedback = button.dataset.feedbackId ? document.getElementById(button.dataset.feedbackId) : (feedbackIds[type] || []).map((id) => document.getElementById(id)).find(Boolean);
            const notes = notesField?.value?.trim() || '';

            if (!notes) {
                if (feedback) feedback.textContent = 'Please enter a note first.';
                return;
            }

            if (feedback) feedback.textContent = 'Loading suggestions...';

            try {
                const response = await fetch('api/ai/form-autofill.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type, notes }),
                    cache: 'no-store'
                });

                const data = await response.json();
                if (!data || data.status !== 'success') {
                    throw new Error('Auto-fill failed');
                }

                const suggestions = Array.isArray(data.suggestions) ? data.suggestions : [];
                const map = Object.fromEntries(suggestions.map((item) => [item.field, item.value]));

                if (type === 'appointment') {
                    const serviceSelect = document.getElementById('appointment-service-type');
                    const dateInput = document.getElementById('appointment-date');
                    const timeSelect = document.getElementById('appointment-time');
                    const reasonTextarea = document.getElementById('appointment-reason');

                    if (serviceSelect && map.service_type) serviceSelect.value = map.service_type;
                    if (reasonTextarea && map.reason) reasonTextarea.value = map.reason;
                    if (dateInput) {
                        const today = new Date();
                        today.setDate(today.getDate() + 1);
                        dateInput.value = today.toISOString().split('T')[0];
                    }
                    if (timeSelect && map.priority_hint === 'High') timeSelect.value = '09:00 AM';
                    if (feedback) feedback.textContent = 'Appointment fields were suggested from your note and recent records.';
                } else if (type === 'permit') {
                    const nameInput = document.getElementById('permit-business-name');
                    const typeSelect = document.getElementById('permit-type');
                    const addressInput = document.getElementById('permit-address');

                    if (nameInput && map.business_name) nameInput.value = map.business_name;
                    if (typeSelect && map.permit_type) typeSelect.value = map.permit_type;
                    if (addressInput && map.address) addressInput.value = map.address;
                    if (feedback) feedback.textContent = 'Permit fields were suggested from your note and recent records.';
                } else if (type === 'surveillance' || type === 'alert') {
                    const diseaseInput = document.getElementById('case-disease');
                    const caseInput = document.getElementById('case-count');
                    const barangayInput = document.getElementById('case-barangay');
                    const severitySelect = document.getElementById('case-severity');

                    if (diseaseInput && map.disease) diseaseInput.value = map.disease;
                    if (caseInput && map.cases) caseInput.value = map.cases;
                    if (barangayInput && map.barangay) barangayInput.value = map.barangay;
                    if (severitySelect && map.severity) severitySelect.value = map.severity;

                    const summary = suggestions.map((item) => {
                        const value = Array.isArray(item.value) ? item.value.join(', ') : item.value;
                        return `${item.field}: ${value}`;
                    }).join(' • ');
                    if (feedback) feedback.textContent = summary || 'Surveillance suggestions are ready.';
                } else if (type === 'sanitation' || type === 'violation') {
                    const permitSelect = document.getElementById('inspection-permit-id');
                    const inspectorSelect = document.getElementById('inspection-inspector');
                    const dateInput = document.getElementById('inspection-date');
                    const timeInput = document.getElementById('inspection-time');

                    if (inspectorSelect && map.recommended_inspector) {
                        const matched = Array.from(inspectorSelect.options).some((option) => option.value === map.recommended_inspector || option.textContent === map.recommended_inspector);
                        if (matched) inspectorSelect.value = map.recommended_inspector;
                    }
                    if (dateInput) {
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        dateInput.value = tomorrow.toISOString().split('T')[0];
                    }
                    if (timeInput && map.inspection_time) timeInput.value = map.inspection_time;
                    if (permitSelect && map.permit_id) permitSelect.value = map.permit_id;

                    const summary = suggestions.map((item) => {
                        const value = Array.isArray(item.value) ? item.value.join(', ') : item.value;
                        return `${item.field}: ${value}`;
                    }).join(' • ');
                    if (feedback) feedback.textContent = summary || 'Sanitation suggestions are ready.';
                } else if (type === 'admin-user') {
                    const nameInput = document.getElementById('admin-user-name');
                    const emailInput = document.getElementById('admin-user-email');
                    const roleSelect = document.getElementById('admin-user-role');

                    if (nameInput && (map.full_name || map.name)) nameInput.value = map.full_name || map.name;
                    if (emailInput && map.email) emailInput.value = map.email;
                    if (roleSelect && (map.role || map.user_role)) roleSelect.value = map.role || map.user_role;

                    if (feedback) feedback.textContent = 'User account fields were suggested from your note.';
                } else if (type === 'admin-violation') {
                    const titleInput = document.getElementById('admin-violation-title');
                    const severitySelect = document.getElementById('admin-violation-severity');
                    const actionInput = document.getElementById('admin-violation-action');

                    if (titleInput && (map.title || map.violation_type)) titleInput.value = map.title || map.violation_type;
                    if (severitySelect && (map.severity || map.risk_level)) severitySelect.value = map.severity || map.risk_level;
                    if (actionInput && (map.action || map.suggested_action)) actionInput.value = map.action || map.suggested_action;

                    if (feedback) feedback.textContent = 'Violation handling fields were suggested from your note.';
                }
            } catch (e) {
                if (feedback) feedback.textContent = 'Auto-fill is unavailable right now.';
            }
        };
    });
}

function renderInsightCards(data) {
    const target = document.getElementById('ai-insights');
    if (!target) return;

    data = normalizeInsightPayload(data);

    if (!data || Object.keys(data).length === 0 || !data.insights || !Array.isArray(data.insights) || data.insights.length === 0) {
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

    // ─── SCORE BADGES ──────────────────────────────────────────
    if (data.municipal_health_score !== undefined) {
        const riskColor = data.overall_risk === 'Critical' || data.overall_risk === 'High' ? 'rose' : 
                          data.overall_risk === 'Moderate' ? 'amber' : 'emerald';
        const riskDotColor = data.overall_risk === 'Critical' || data.overall_risk === 'High' ? 'bg-rose-500' : 
                             data.overall_risk === 'Moderate' ? 'bg-amber-500' : 'bg-emerald-500';
        
        target.insertAdjacentHTML('beforeend', `
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                <div class="ai-score-badge p-2.5 rounded-xl bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/10 dark:border-blue-500/20 text-center">
                    <div class="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Health</div>
                    <div class="text-lg font-bold text-blue-600 dark:text-blue-400">${data.municipal_health_score}</div>
                </div>
                <div class="ai-score-badge p-2.5 rounded-xl bg-violet-500/5 dark:bg-violet-500/10 border border-violet-500/10 dark:border-violet-500/20 text-center">
                    <div class="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Efficiency</div>
                    <div class="text-lg font-bold text-violet-600 dark:text-violet-400">${data.operational_efficiency_score}</div>
                </div>
                <div class="ai-score-badge p-2.5 rounded-xl bg-${riskColor}-500/5 dark:bg-${riskColor}-500/10 border border-${riskColor}-500/10 dark:border-${riskColor}-500/20 text-center">
                    <div class="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Risk</div>
                    <div class="text-lg font-bold text-${riskColor}-600 dark:text-${riskColor}-400">${data.risk_score}</div>
                </div>
                <div class="ai-score-badge p-2.5 rounded-xl bg-teal-500/5 dark:bg-teal-500/10 border border-teal-500/10 dark:border-teal-500/20 text-center">
                    <div class="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Confidence</div>
                    <div class="text-lg font-bold text-teal-600 dark:text-teal-400">${data.confidence_score}%</div>
                </div>
            </div>
            <div class="flex items-center gap-2 mb-3 px-1">
                <span class="w-2 h-2 rounded-full ${riskDotColor} animate-pulse"></span>
                <span class="text-[11px] font-semibold uppercase tracking-wider text-${riskColor}-600 dark:text-${riskColor}-400">${data.overall_risk} Risk Level</span>
            </div>
        `);
    }

    // ─── EXECUTIVE SUMMARY ─────────────────────────────────────
    if (data.executive_summary) {
        target.insertAdjacentHTML('beforeend', `
            <div class="ai-summary-card p-3 rounded-xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 dark:from-blue-500/10 dark:to-cyan-500/10 border border-blue-500/10 dark:border-cyan-500/20 mb-3">
                <div class="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400 mb-1.5">Executive Briefing</div>
                <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">${data.executive_summary}</p>
            </div>
        `);
    }

    // ─── INSIGHT CARDS (from insights array) ───────────────────
    if (data.insights && Array.isArray(data.insights) && data.insights.length > 0) {
        data.insights.forEach((item, index) => {
            if (!item) return;

            let borderClass = 'border-l-4 border-l-blue-500 shadow-blue-500/5';
            let badgeHTML = '';
            let iconHTML = '';

            if (item.category === 'Operational') {
                borderClass = 'border-l-4 border-l-blue-500 shadow-blue-500/5';
            } else if (item.category === 'Risk') {
                const lvl = (item.severity || 'Medium').toLowerCase();
                if (lvl === 'high') {
                    borderClass = 'border-l-4 border-l-rose-500 shadow-rose-500/5';
                } else if (lvl === 'medium') {
                    borderClass = 'border-l-4 border-l-amber-500 shadow-amber-500/5';
                } else {
                    borderClass = 'border-l-4 border-l-emerald-500 shadow-emerald-500/5';
                }
                badgeHTML = `<span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${lvl === 'high' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' : lvl === 'medium' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'}">${item.severity} Risk</span>`;
            } else if (item.category === 'Action') {
                borderClass = 'border-l-4 border-l-violet-500 shadow-violet-500/5';
                badgeHTML = `<span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">${item.severity}</span>`;
            }

            // Font Awesome to emoji mapping, while also preserving any emoji icon already supplied by the API
            const iconMap = {
                'fa-chart-line': '📈', 'fa-triangle-exclamation': '⚠️', 'fa-lightbulb': '💡',
                'fa-water': '💧', 'fa-virus': '🦠', 'fa-hospital': '🏥', 'fa-clock': '⏰',
                'fa-users': '👥', 'fa-shield': '🛡️', 'fa-check-circle': '✅',
                'fa-biohazard': '☣️', 'fa-bug': '🐛', 'fa-chart-simple': '📊',
                'fa-people-arrows': '↔️', 'fa-handshake': '🤝', 'fa-file': '📄',
                'fa-truck': '🚛', 'fa-syringe': '💉', 'fa-stethoscope': '🩺'
            };
            iconHTML = item.icon && typeof item.icon === 'string' && item.icon.trim()
                ? (iconMap[item.icon] || item.icon)
                : 'ℹ️';

            // Trend indicator
            const trendIcon = item.trend === 'Increasing' ? '📈' : item.trend === 'Decreasing' ? '📉' : '➡️';
            const trendColor = item.trend === 'Increasing' ? 'text-rose-500' : item.trend === 'Decreasing' ? 'text-emerald-500' : 'text-slate-500';

            const cardHTML = `
                <div class="ai-insight-card relative overflow-hidden p-3 rounded-xl ${borderClass} bg-white/20 dark:bg-slate-800/10 backdrop-blur-md border border-white/10 dark:border-slate-800/20 hover:bg-white/30 dark:hover:bg-slate-800/20 shadow-sm transition-all duration-300 transform opacity-0 translate-y-4 hover:-translate-y-1 hover:shadow-md cursor-default group" style="animation-delay: ${index * 150}ms; animation-fill-mode: forwards;">
                    <div class="flex items-start gap-3">
                        <span class="text-lg mt-0.5">${iconHTML}</span>
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center gap-2 flex-wrap mb-0.5">
                                <h4 class="font-bold text-sm text-slate-800 dark:text-slate-100 tracking-tight leading-none">${item.title}</h4>
                                ${badgeHTML}
                                <span class="text-[10px] ${trendColor} font-medium">${trendIcon} ${item.trend}</span>
                            </div>
                            <p class="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed mb-1.5">${item.description}</p>
                            <div class="flex flex-col gap-0.5 text-[10px]">
                                <div class="flex items-start gap-1.5">
                                    <span class="text-slate-400 font-medium shrink-0">Why:</span>
                                    <span class="text-slate-500 dark:text-slate-400">${item.reason}</span>
                                </div>
                                <div class="flex items-start gap-1.5">
                                    <span class="text-blue-500 dark:text-cyan-400 font-medium shrink-0">Action:</span>
                                    <span class="text-slate-500 dark:text-slate-400">${item.recommendation}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            target.insertAdjacentHTML('beforeend', cardHTML);
        });
    }

    // ─── EARLY WARNINGS ────────────────────────────────────────
    if (data.early_warnings && Array.isArray(data.early_warnings) && data.early_warnings.length > 0) {
        target.insertAdjacentHTML('beforeend', `
            <div class="mt-3 pt-2 border-t border-white/10 dark:border-slate-800/20">
                <div class="text-[10px] font-bold uppercase tracking-wider text-rose-500 mb-2 flex items-center gap-1.5">
                    <span>🚨</span> Early Warning Alerts
                </div>
                ${data.early_warnings.map((w, i) => {
                    const warnColors = {
                        'High': 'border-l-rose-500 bg-rose-500/5 dark:bg-rose-500/10',
                        'Medium': 'border-l-amber-500 bg-amber-500/5 dark:bg-amber-500/10',
                        'Low': 'border-l-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10'
                    };
                    const wColor = warnColors[w.severity] || warnColors.Medium;
                    return `
                        <div class="p-2.5 rounded-xl border-l-4 ${wColor} border border-white/10 dark:border-slate-800/20 mb-2 ai-insight-card opacity-0 translate-y-3" style="animation-delay: ${i * 100}ms; animation-fill-mode: forwards;">
                            <div class="flex items-center gap-2 mb-0.5">
                                <span class="text-[10px] font-bold uppercase tracking-wider ${w.severity === 'High' ? 'text-rose-600 dark:text-rose-400' : w.severity === 'Medium' ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}">${w.severity}</span>
                                <h5 class="text-xs font-semibold text-slate-700 dark:text-slate-200">${w.title}</h5>
                            </div>
                            <p class="text-[11px] text-slate-500 dark:text-slate-400 mb-1">${w.description}</p>
                            <p class="text-[10px] text-blue-600 dark:text-cyan-400 font-medium">→ ${w.recommended_action}</p>
                        </div>
                    `;
                }).join('')}
            </div>
        `);
    }

    // ─── RECOMMENDATIONS ───────────────────────────────────────
    if (data.recommendations && Array.isArray(data.recommendations) && data.recommendations.length > 0) {
        target.insertAdjacentHTML('beforeend', `
            <div class="mt-3 pt-2 border-t border-white/10 dark:border-slate-800/20">
                <div class="text-[10px] font-bold uppercase tracking-wider text-violet-500 mb-2 flex items-center gap-1.5">
                    <span>🎯</span> Recommended Actions
                </div>
                ${data.recommendations.map((r, i) => {
                    const recColors = {
                        'High': 'border-l-violet-500 bg-violet-500/5 dark:bg-violet-500/10',
                        'Medium': 'border-l-indigo-500 bg-indigo-500/5 dark:bg-indigo-500/10',
                        'Low': 'border-l-teal-500 bg-teal-500/5 dark:bg-teal-500/10'
                    };
                    const rColor = recColors[r.priority] || recColors.Medium;
                    return `
                        <div class="p-2.5 rounded-xl border-l-4 ${rColor} border border-white/10 dark:border-slate-800/20 mb-2 ai-insight-card opacity-0 translate-y-3" style="animation-delay: ${i * 100}ms; animation-fill-mode: forwards;">
                            <div class="flex items-center gap-2 mb-0.5">
                                <span class="text-[10px] font-bold uppercase tracking-wider ${r.priority === 'High' ? 'text-violet-600 dark:text-violet-400' : r.priority === 'Medium' ? 'text-indigo-600 dark:text-indigo-400' : 'text-teal-600 dark:text-teal-400'}">${r.priority} Priority</span>
                                <span class="text-[10px] text-slate-400">| ${r.timeframe || 'Immediate'}</span>
                            </div>
                            <p class="text-[11px] text-slate-500 dark:text-slate-400 mb-1">${r.reason}</p>
                            <p class="text-xs font-medium text-slate-700 dark:text-slate-200 mb-0.5">${r.action}</p>
                            <p class="text-[10px] text-emerald-600 dark:text-emerald-400">Expected: ${r.expected_impact}</p>
                        </div>
                    `;
                }).join('')}
            </div>
        `);
    }

    // ─── TREND ANALYSIS TABLE ──────────────────────────────────
    if (data.trend_analysis && Array.isArray(data.trend_analysis) && data.trend_analysis.length > 0) {
        target.insertAdjacentHTML('beforeend', `
            <div class="mt-3 pt-2 border-t border-white/10 dark:border-slate-800/20">
                <div class="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                    <span>📊</span> Trend Analysis
                </div>
                <div class="space-y-1.5">
                    ${data.trend_analysis.map((t, i) => {
                        const tIcon = t.trend === 'Increasing' ? '📈' : t.trend === 'Decreasing' ? '📉' : '➡️';
                        const tColor = t.trend === 'Increasing' ? 'text-rose-600' : t.trend === 'Decreasing' ? 'text-emerald-600' : 'text-slate-500';
                        return `
                            <div class="flex items-start gap-2 p-2 rounded-lg bg-white/10 dark:bg-slate-800/10 ai-insight-card opacity-0 translate-y-2" style="animation-delay: ${i * 80}ms; animation-fill-mode: forwards;">
                                <span class="text-sm shrink-0 mt-0.5">${tIcon}</span>
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center gap-2 flex-wrap">
                                        <span class="text-xs font-semibold text-slate-700 dark:text-slate-200">${t.metric}</span>
                                        <span class="text-[10px] font-medium ${tColor}">${t.trend}</span>
                                        <span class="text-[10px] text-slate-400">vs ${t.comparison}</span>
                                    </div>
                                    <p class="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">${t.reason}</p>
                                    <p class="text-[10px] text-slate-400 mt-0.5">Impact: ${t.impact}</p>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `);
    }
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
async function reloadCurrentView() {
    await loadDashboardData();
    await loadUsers();
    await loadLogs();
    renderView();
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
            throw new Error(`HTTP Error ${response.status}`);
        }

        const data = await response.json();
        
        hideLoading();
        animateAvatar('complete');

        if (data && data.status === 'success' && data.insights) {
            renderInsightCards(data.insights);
            await loadActionSuggestions();
            lastAnalyzedTime = new Date();
            updateLastAnalyzedFooter();
            
            // Sync KPI cards with the same data the AI analyzed
            if (data.insights._stats) {
                updateKPICards(data.insights._stats);
            }
        } else {
            renderInsightCards(null);
            await loadActionSuggestions();
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
