<!-- FOR UI/UX DASHBOARD FOR EACH ROLE -->

<!DOCTYPE html>
<html lang="en" class="h-full">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Health & Sanitation Management System</title>
  <script src="https://cdn.tailwindcss.com"></script>
<!-- FullCalendar JS -->
<script src='https://cdn.jsdelivr.net/npm/fullcalendar@6.1.10/index.global.min.js'></script>
<script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.css">
<script src="https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.js"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            gov: {
              50: '#f0f7ff',
              100: '#e0effe',
              500: '#2563eb',
              600: '#1d4ed8',
              700: '#1e40af',
              800: '#1e3a5f',
              900: '#0f2744',
            }
          },
          fontFamily: {
            sans: ['Inter', 'system-ui', 'sans-serif'],
          }
        }
      }
    };
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body class="h-full bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-100 transition-colors duration-300">

  <!-- Mobile sidebar backdrop -->
  <div id="sidebar-backdrop" class="fixed inset-0 z-40 bg-black/50 hidden lg:hidden" aria-hidden="true"></div>

  <!-- Sidebar -->
  <aside id="sidebar" class="fixed inset-y-0 left-0 z-50 w-72 -translate-x-full lg:translate-x-0 transform bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-transform duration-300 flex flex-col shadow-xl">
    <div class="flex items-center gap-3 px-5 py-5 border-b border-slate-200 dark:border-slate-700">
      <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gov-600 text-white shadow-md">
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342"/>
        </svg>
      </div>
      <div>
        <p class="text-xs font-medium uppercase tracking-wider text-gov-600 dark:text-gov-100">Municipal Health</p>
        <h1 class="text-sm font-bold leading-tight">Health & Sanitation<br>Management System</h1>
      </div>
    </div>

    <div class="px-4 py-3 flex-1 overflow-y-auto">
      <p id="role-label" class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Admin Panel</p>
      <nav id="sidebar-nav" class="space-y-1"></nav>

      <!-- Activity log panel -->
      <div class="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
        <div class="flex items-center justify-between mb-3">
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Recent Activity</p>
          <button type="button" data-action="view-all-activity" class="text-xs text-gov-600 dark:text-gov-100 hover:underline">View all</button>
        </div>
        <div id="activity-feed" class="space-y-2 max-h-48 overflow-y-auto"></div>
      </div>
    </div>

    <div class="px-4 py-4 border-t border-slate-200 dark:border-slate-700">
      <div class="rounded-xl bg-gov-50 dark:bg-slate-700/50 p-3">
        <p class="text-xs text-slate-500 dark:text-slate-400">Logged in as</p>
        <p id="current-user-name" class="text-sm font-semibold">Maria Santos</p>
        <p id="current-user-role" class="text-xs text-gov-600 dark:text-gov-100">Administrator</p>
      </div>
    </div>
  </aside>

  <!-- Main layout -->
  <div class="lg:pl-72 min-h-full flex flex-col">

    <!-- Top header -->
    <header class="sticky top-0 z-30 bg-white/90 dark:bg-slate-800/90 backdrop-blur border-b border-slate-200 dark:border-slate-700 shadow-sm">
      <div class="flex flex-col gap-3 px-4 py-3 lg:px-6">
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0">
            <button id="menu-toggle" type="button" class="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shrink-0" aria-label="Toggle menu">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
              </svg>
            </button>
            <div class="min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <h2 id="page-title" class="text-lg font-bold truncate">System Overview</h2>
                <span id="role-badge" class="role-badge role-badge-admin">Admin</span>
              </div>
              <p id="page-subtitle" class="text-xs text-slate-500 dark:text-slate-400 hidden sm:block truncate">Dashboard analytics and system health</p>
            </div>
          </div>

          <div class="flex items-center gap-2 sm:gap-3 shrink-0">

            <button id="dark-mode-toggle" type="button" class="p-2 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all hover:shadow-md" aria-label="Toggle dark mode">
              <svg id="icon-sun" class="h-5 w-5 hidden dark:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773-1.591-1.591M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"/>
              </svg>
              <svg id="icon-moon" class="h-5 w-5 block dark:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"/>
              </svg>
            </button>

            <!-- Notification dropdown -->
            <div class="relative" id="notif-dropdown-wrap">
              <button type="button" id="notif-toggle" class="relative p-2 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all hover:shadow-md" aria-label="Notifications" aria-expanded="false">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"/>
                </svg>
                <span id="notif-dot" class="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-800"></span>
              </button>
              <div id="notif-panel" class="dropdown-panel hidden right-0 w-80 sm:w-96">
                <div class="dropdown-header">
                  <h3 class="font-semibold text-sm">Notifications</h3>
                  <button type="button" data-action="mark-all-read" class="text-xs text-gov-600 dark:text-gov-100 hover:underline">Mark all read</button>
                </div>
                <div id="notif-list" class="dropdown-body max-h-80 overflow-y-auto"></div>
                <div class="dropdown-footer">
                  <button type="button" data-action="show-notifications" class="text-sm text-gov-600 dark:text-gov-100 font-medium hover:underline w-full text-center">View all notifications</button>
                </div>
              </div>
            </div>

            <!-- User profile dropdown -->
            <div class="relative" id="profile-dropdown-wrap">
              <button type="button" id="profile-toggle" class="flex items-center gap-2 p-1.5 pr-2 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all hover:shadow-md" aria-expanded="false">
                <div id="profile-avatar" class="h-8 w-8 rounded-lg bg-gov-600 text-white flex items-center justify-center text-sm font-bold">M</div>
                <svg class="h-4 w-4 text-slate-400 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"/>
                </svg>
              </button>
              <div id="profile-panel" class="dropdown-panel hidden right-0 w-56">
                <div class="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                  <p id="profile-name" class="text-sm font-semibold">Maria Santos</p>
                  <p id="profile-email" class="text-xs text-slate-500 truncate">maria.santos@municipal.gov</p>
                </div>
                <div class="py-1">
                  <button type="button" data-action="profile-view" class="dropdown-item">View Profile</button>
                  <button type="button" data-action="profile-settings" class="dropdown-item">Settings</button>
                  <button type="button" data-action="profile-logout" class="dropdown-item text-red-600 dark:text-red-400">Logout</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Global search -->
        <div class="relative" id="global-search-wrap">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/></svg>
          <input type="search" id="global-search" placeholder="Search patients, permits, records..." class="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-sm focus:outline-none focus:ring-2 focus:ring-gov-500 focus:bg-white dark:focus:bg-slate-700 transition-all" autocomplete="off">
          <div id="global-search-results" class="dropdown-panel hidden left-0 right-0 mt-1 max-h-72 overflow-y-auto"></div>
        </div>

        <!-- Mobile role switcher -->
       <!-- <div class="sm:hidden">
          <select id="role-switcher-mobile" class="w-full appearance-none rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 pl-3 pr-8 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gov-500">
            <option value="admin">Admin Panel</option>
            <option value="staff">Staff Panel</option>
            <option value="user">End User Portal</option>
          </select>
        </div> -->
      </div>
    </header>

    <!-- Main content -->
    <main id="main-content" class="flex-1 p-4 lg:p-6 max-w-7xl w-full mx-auto">
      <!-- Views rendered by JavaScript -->
    </main>

    <!-- Footer -->
    <footer class="border-t border-slate-200 dark:border-slate-700 px-4 py-3 text-center text-xs text-slate-500 dark:text-slate-400">
      &copy; 2026 Municipal Health & Sanitation Department. All rights reserved.
    </footer>
  </div>

  <div id="modal-overlay" class="fixed inset-0 z-[60] hidden items-center justify-center p-4 bg-black/50 backdrop-blur-sm" role="dialog" aria-modal="true">
    <div id="modal-panel" class="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-200 dark:border-slate-700 transform transition-all scale-95 opacity-0">
      <div class="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
        <h3 id="modal-title" class="text-lg font-bold">Modal Title</h3>
        <button type="button" data-action="close-modal" class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" aria-label="Close">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <div id="modal-body" class="p-5"></div>
      <div id="modal-footer" class="flex justify-end gap-2 px-5 py-4 border-t border-slate-200 dark:border-slate-700"></div>
    </div>
  </div>

  <div id="toast-container" class="fixed bottom-4 right-4 z-[70] flex flex-col gap-2 max-w-sm w-full pointer-events-none"></div>

  <script type="module" src="js/app.js"></script>
</body>
</html>
