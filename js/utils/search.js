// ─── REUSABLE SEARCH FUNCTIONS ────────────────────────────────────────────────

export function getSearchValue(id) {
    const el = document.getElementById(id);
    return el ? el.value : '';
}

export function getSelectValue(id) {
    const el = document.getElementById(id);
    return el ? el.value : '';
}

/**
 * Filter data array by search query across multiple fields
 * @param {Array} data - Array of objects to search
 * @param {string} query - Search query string
 * @param {Array} fields - Array of field names to search in
 * @returns {Array} Filtered results
 */
export function filterData(data, query, fields = ['name', 'id']) {
    if (!query || !data || !data.length) return data;
    
    const q = query.toLowerCase().trim();
    if (!q) return data;
    
    return data.filter(item => {
        return fields.some(field => {
            const value = item[field];
            if (value === null || value === undefined) return false;
            return String(value).toLowerCase().includes(q);
        });
    });
}

/**
 * Generate search input HTML
 * @param {string} id - Input ID
 * @param {string} placeholder - Placeholder text
 * @returns {string} HTML string
 */
export function searchInput(id, placeholder = 'Search...') {
    return `
        <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input type="text" id="${id}" placeholder="${placeholder}" 
                   class="pl-10 pr-4 py-2 w-64 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-gov-500 focus:outline-none">
        </div>
    `;
}