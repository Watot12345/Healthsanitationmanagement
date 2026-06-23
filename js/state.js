// ─── APPLICATION STATE ────────────────────────────────────────────────────────
// Central state object - controls navigation, theme, UI toggles, and filters

// ─── State ───────────────────────────────────────────────────────────────────
export const state = {
  
    role: 'admin',
    view: 'dashboard',
    darkMode: localStorage.getItem('hsms-dark') === 'true',
    sidebarOpen: false,
    searchFilters: {},
    openDropdown: null,
    globalSearchQuery: '',
    showLoading: false,
  };
  
  export function updateState(updates) {
    Object.assign(state, updates);
  }