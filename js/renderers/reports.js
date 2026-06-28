// Reporets for admin panel UI/UX generate report then export it

import { card, icon, renderList } from '../utils/dom.js';
// ─── Config ──────────────────────────────────────────────────────────────────

export const REPORT_CATEGORIES = [
  {
    id: 'ai',
    label: 'AI Executive Reports',
    icon: '🤖',
    reports: [
      { id: 'ai-executive', label: 'AI Executive Summary', format: 'PDF' },
    ]
  },
  {
    id: 'health',
    label: 'Health Center Reports',
    icon: 'heart',
    reports: [
      { id: 'daily-patients', label: 'Daily Patient Report', format: 'PDF / Excel' },
      { id: 'weekly-consultations', label: 'Weekly Consultation Summary', format: 'PDF / Excel' },
      { id: 'monthly-health', label: 'Monthly Health Statistics', format: 'PDF / Excel' },
    ]
  },
  {
    id: 'sanitation',
    label: 'Sanitation Reports',
    icon: 'clipboard',
    reports: [
      { id: 'monthly-permits', label: 'Monthly Permit Statistics', format: 'PDF' },
      { id: 'inspection-rate', label: 'Inspection Success Rate', format: 'PDF / Excel' },
      { id: 'processing-time', label: 'Processing Time Average', format: 'PDF / Excel' },
    ]
  },
  {
    id: 'immunization',
    label: 'Immunization Reports',
    icon: 'shield',
    reports: [
      { id: 'monthly-immunization', label: 'Monthly Immunization Report', format: 'PDF' },
      { id: 'nutrition-status', label: 'Nutrition Status Report', format: 'PDF / Excel' },
      { id: 'vaccination-coverage', label: 'Vaccination Coverage Rate', format: 'PDF / Excel' },
    ]
  },
  {
    id: 'wastewater',
    label: 'Wastewater Reports',
    icon: 'water',
    reports: [
      { id: 'monthly-sanitation', label: 'Monthly Sanitation Report', format: 'PDF' },
      { id: 'serviced-ratio', label: 'Serviced vs Unserviced Ratio', format: 'PDF / Excel' },
      { id: 'overdue-maintenance', label: 'Overdue Maintenance List', format: 'Excel' },
      { id: 'compliance-rate', label: 'Compliance Rate', format: 'PDF' },
    ]
  },
  {
    id: 'surveillance',
    label: 'Surveillance Reports',
    icon: 'alert',
    reports: [
      { id: 'weekly-disease', label: 'Weekly Disease Report', format: 'PDF' },
      { id: 'outbreak', label: 'Outbreak Reports', format: 'PDF / Excel' },
      { id: 'barangay-risk', label: 'Barangay Health Risk Report', format: 'PDF' },
    ]
  },
];

// ─── Components ──────────────────────────────────────────────────────────────
const ReportCard = r => card(`
  <div class="ui-card-body flex items-center justify-between hover:shadow-md transition-shadow">
    <div class="flex items-center gap-3">
      <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-gov-100 dark:bg-gov-900/30 text-gov-600">
        ${icon('document', 'h-5 w-5')}
      </div>
      <div>
        <p class="text-sm font-medium text-slate-700 dark:text-slate-300">${r.label}</p>
        <p class="text-xs text-slate-500">${r.format}</p>
      </div>
    </div>
    <div class="flex items-center gap-1">
      ${r.format.includes('Excel') || r.format.includes('CSV') ? 
        `<button data-action="download-report" data-type="${r.id}" data-format="csv" class="px-3 py-1.5 text-xs rounded bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400">Excel</button>` : ''}
      ${r.format.includes('PDF') ? 
        `<button data-action="download-report" data-type="${r.id}" data-format="pdf" class="px-3 py-1.5 text-xs rounded bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400">PDF</button>` : ''}
    </div>
  </div>
`);

const ReportCategory = cat => `
  <div class="space-y-3">
    <div class="flex items-center gap-2 mb-2">
      <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-gov-100 dark:bg-gov-900/30 text-gov-600">
        ${icon(cat.icon, 'h-4 w-4')}
      </span>
      <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-300">${cat.label}</h3>
    </div>
    ${renderList(cat.reports, ReportCard)}
  </div>
`;

// ─── View ────────────────────────────────────────────────────────────────────

export function renderReports() {
  return `
    <div class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        ${renderList(REPORT_CATEGORIES, ReportCategory)}
      </div>
    </div>
  `;
}