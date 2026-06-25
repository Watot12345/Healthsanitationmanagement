import { card } from '../../utils/dom.js';

// ─── Fake Data ──────────────────────────────────────────────────────────────

const growthData = {
  sofia: { name: 'Sofia Garcia', months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], height: [72, 74, 76, 78, 80, 82, 84], weight: [8.5, 9.0, 9.5, 10.2, 10.8, 11.5, 12.4], nutrition: [100, 100, 100, 70, 100, 100, 100] },
  luis: { name: 'Luis Mendoza', months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], height: [60, 62, 64, 66, 68, 70], weight: [6.0, 6.5, 7.0, 7.5, 8.2, 9.1], nutrition: [100, 100, 100, 100, 100, 100] },
  emma: { name: 'Emma Lim', months: ['Mar', 'Apr', 'May', 'Jun'], height: [88, 90, 92, 94], weight: [13.0, 13.5, 14.0, 14.8], nutrition: [100, 85, 100, 100] },
};

let currentChild = 'sofia';
let currentMetric = 'height';
let chartInstance = null;

// ─── View ────────────────────────────────────────────────────────────────────

export function renderGrowthCharts() {
  const children = Object.entries(growthData);

  return `
  <div class="space-y-6">
      <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div class="relative w-full sm:w-64">
          <input type="text" id="child-search" placeholder="Search child name..." class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
          <select id="growth-child-select" size="4" class="absolute top-full left-0 right-0 mt-1 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm z-10 hidden">
            ${children.map(([id, c]) => `<option value="${id}" ${id === currentChild ? 'selected' : ''}>${c.name}</option>`).join('')}
          </select>
        </div>
        <div class="flex gap-2">
          <button class="metric-btn px-3 py-1.5 rounded-lg text-sm font-medium ${currentMetric === 'height' ? 'bg-gov-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}" data-metric="height">Height</button>
          <button class="metric-btn px-3 py-1.5 rounded-lg text-sm font-medium ${currentMetric === 'weight' ? 'bg-gov-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}" data-metric="weight">Weight</button>
          <button class="metric-btn px-3 py-1.5 rounded-lg text-sm font-medium ${currentMetric === 'nutrition' ? 'bg-gov-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}" data-metric="nutrition">Nutrition</button>
        </div>
      </div>

      ${card(`
        <div class="p-5">
          <h3 id="chart-title" class="font-semibold mb-4"></h3>
          <div id="growth-chart" style="min-height: 350px;"></div>
        </div>
      `)}

      ${card(`
        <div class="p-5">
          <h3 class="font-semibold mb-4">Data Table — ${growthData[currentChild].name}</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead class="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th class="px-4 py-2 text-xs font-semibold uppercase text-slate-500">Month</th>
                  <th class="px-4 py-2 text-xs font-semibold uppercase text-slate-500">Height (cm)</th>
                  <th class="px-4 py-2 text-xs font-semibold uppercase text-slate-500">Weight (kg)</th>
                  <th class="px-4 py-2 text-xs font-semibold uppercase text-slate-500">Nutrition</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                ${growthData[currentChild].months.map((m, i) => `
                  <tr>
                    <td class="px-4 py-2">${m}</td>
                    <td class="px-4 py-2">${growthData[currentChild].height[i]}</td>
                    <td class="px-4 py-2">${growthData[currentChild].weight[i]}</td>
                    <td class="px-4 py-2">${growthData[currentChild].nutrition[i] >= 90 ? '✅ Normal' : growthData[currentChild].nutrition[i] >= 60 ? '⚠️ Mild' : '🔴 Underweight'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `)}
    </div>
  `;
}

// ─── Initialize Charts ───────────────────────────────────────────────────────

export function initGrowthCharts() {
  renderChart();
  const searchInput = document.getElementById('child-search');
const childSelect = document.getElementById('growth-child-select');

searchInput?.addEventListener('focus', () => childSelect.classList.remove('hidden'));
searchInput?.addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase();
  childSelect.classList.remove('hidden');
  Array.from(childSelect.options).forEach(opt => {
    opt.hidden = !opt.text.toLowerCase().includes(q);
  });
});

childSelect?.addEventListener('change', (e) => {
  currentChild = e.target.value;
  searchInput.value = growthData[currentChild].name;
  childSelect.classList.add('hidden');
  document.getElementById('chart-title').textContent = `${getLabel()} — ${growthData[currentChild].name}`;
  renderChart();
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('#child-search') && !e.target.closest('#growth-child-select')) {
    childSelect?.classList.add('hidden');
  }
});
  document.getElementById('growth-child-select')?.addEventListener('change', (e) => {
    currentChild = e.target.value;
    document.getElementById('chart-title').textContent = `${getLabel()} — ${growthData[currentChild].name}`;
    renderChart();
    updateTable();
  });

  document.querySelectorAll('.metric-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentMetric = btn.dataset.metric;
      document.querySelectorAll('.metric-btn').forEach(b => {
        b.classList.remove('bg-gov-600', 'text-white');
        b.classList.add('bg-slate-100', 'dark:bg-slate-700', 'text-slate-600', 'dark:text-slate-300');
      });
      btn.classList.add('bg-gov-600', 'text-white');
      btn.classList.remove('bg-slate-100', 'dark:bg-slate-700', 'text-slate-600', 'dark:text-slate-300');
      document.getElementById('chart-title').textContent = `${getLabel()} — ${growthData[currentChild].name}`;
      renderChart();
    });
  });
}

function renderChart() {
  const d = growthData[currentChild];
  const el = document.querySelector('#growth-chart');
  const title = document.getElementById('chart-title');
  if (!el || !title) return;

  title.textContent = `${getLabel()} — ${d.name}`;

  if (chartInstance) chartInstance.destroy();

  const configs = {
    height: {
      series: [{ name: 'Height (cm)', data: d.height }],
      chart: { type: 'line', height: 350 },
      stroke: { curve: 'smooth', width: 3 },
      markers: { size: 5 },
      xaxis: { categories: d.months },
      yaxis: { title: { text: 'Height (cm)' }, min: 50, max: 100 },
      colors: ['#3b82f6'],
    },
    weight: {
      series: [{ name: 'Weight (kg)', data: d.weight }],
      chart: { type: 'area', height: 350 },
      stroke: { curve: 'smooth', width: 3 },
      fill: { type: 'gradient', gradient: { opacityFrom: 0.3, opacityTo: 0.05 } },
      markers: { size: 5 },
      xaxis: { categories: d.months },
      yaxis: { title: { text: 'Weight (kg)' }, min: 4, max: 16 },
      colors: ['#22c55e'],
    },
    nutrition: {
      series: [{ name: 'Nutrition Score', data: d.nutrition }],
      chart: { type: 'bar', height: 350 },
      plotOptions: { bar: { borderRadius: 8 } },
      xaxis: { categories: d.months },
      yaxis: { title: { text: 'Score' }, min: 0, max: 120 },
      colors: ['#eab308'],
      annotations: {
        yaxis: [
          { y: 90, borderColor: '#22c55e', label: { text: 'Normal' } },
          { y: 60, borderColor: '#ef4444', label: { text: 'Underweight' } },
        ],
      },
    },
  };

  chartInstance = new ApexCharts(el, configs[currentMetric]);
  chartInstance.render();
}

function getLabel() {
  return currentMetric === 'height' ? 'Height Over Time' : currentMetric === 'weight' ? 'Weight Over Time' : 'Nutrition Status';
}

function updateTable() {
  // Re-render the whole view if needed, or just update the table portion
  // For simplicity, the table uses currentChild from the closure
}