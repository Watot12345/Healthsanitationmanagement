export async function fetchDashboardData() {
    const response = await fetch('api/dashboard/adminStats.php');
    return await response.json();
}

// ─── Fake Data ───────────────────────────────────────────────────────────────
export const DATA = {
  users: [],
  logs: [],
  appointments: [],
  patients: [],
  permits: [],
  notifications: [],  // ← Add this
  kpis: null,
  systemStatus: null,
  recentUpdates: [],
  medicalRecords: [],
  applications: [],
};
  
  export function getCalendarEvents() {
    // Return dates that have events for the mini calendar
    return [5, 12, 18, 23, 28];
  }