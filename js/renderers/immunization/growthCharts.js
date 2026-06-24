import { card } from '../../utils/dom.js';

// ─── Fake Data ──────────────────────────────────────────────────────────────

const growthData = {
  sofia: {
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    height: [72, 74, 76, 78, 80, 82, 84],
    weight: [8.5, 9.0, 9.5, 10.2, 10.8, 11.5, 12.4],
    nutrition: ['Normal', 'Normal', 'Normal', 'Mild Underweight', 'Normal', 'Normal', 'Normal'],
  },
  luis: {
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    height: [60, 62, 64, 66, 68, 70],
    weight: [6.0, 6.5, 7.0, 7.5, 8.2, 9.1],
    nutrition: ['Normal', 'Normal', 'Normal', 'Normal', 'Normal', 'Normal'],
  },
};

// ─── View ────────────────────────────────────────────────────────────────────

export function renderGrowthCharts() {
  return `
    <div class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        ${card(`
          <div class="p-5">
            <h3 class="font-semibold mb-4">Height Over Time — Sofia Garcia</h3>
            <div id="height-chart" style="min-height: 300px;"></div>
          </div>
        `)}
        ${card(`
          <div class="p-5">
            <h3 class="font-semibold mb-4">Weight Over Time — Sofia Garcia</h3>
            <div id="weight-chart" style="min-height: 300px;"></div>
          </div>
        `)}
      </div>
      ${card(`
        <div class="p-5">
          <h3 class="font-semibold mb-4">Nutrition Status Trend — Sofia Garcia</h3>
          <div id="nutrition-chart" style="min-height: 300px;"></div>
        </div>
      `)}
    </div>
  `;
}

// ─── Initialize Charts ───────────────────────────────────────────────────────

export function initGrowthCharts() {
  const d = growthData.sofia;

  const heightEl = document.querySelector('#height-chart');
  if (heightEl) {
    new ApexCharts(heightEl, {
      series: [{ name: 'Height (cm)', data: d.height }],
      chart: { type: 'line', height: 300 },
      stroke: { curve: 'smooth', width: 3 },
      markers: { size: 5 },
      xaxis: { categories: d.months, title: { text: 'Month' } },
      yaxis: { title: { text: 'Height (cm)' }, min: 60, max: 100 },
      colors: ['#3b82f6'],
    }).render();
  }

  const weightEl = document.querySelector('#weight-chart');
  if (weightEl) {
    new ApexCharts(weightEl, {
      series: [{ name: 'Weight (kg)', data: d.weight }],
      chart: { type: 'area', height: 300 },
      stroke: { curve: 'smooth', width: 3 },
      fill: { type: 'gradient', gradient: { opacityFrom: 0.3, opacityTo: 0.05 } },
      markers: { size: 5 },
      xaxis: { categories: d.months, title: { text: 'Month' } },
      yaxis: { title: { text: 'Weight (kg)' }, min: 5, max: 15 },
      colors: ['#22c55e'],
    }).render();
  }

  const nutritionEl = document.querySelector('#nutrition-chart');
  if (nutritionEl) {
    const scores = d.nutrition.map(n => n === 'Normal' ? 100 : n === 'Mild Underweight' ? 70 : 40);
    new ApexCharts(nutritionEl, {
      series: [{ name: 'Nutrition Score', data: scores }],
      chart: { type: 'bar', height: 300 },
      plotOptions: { bar: { borderRadius: 8 } },
      xaxis: { categories: d.months, title: { text: 'Month' } },
      yaxis: { title: { text: 'Score' }, min: 0, max: 120 },
      colors: ['#eab308'],
      annotations: {
        yaxis: [
          { y: 90, borderColor: '#22c55e', label: { text: 'Normal' } },
          { y: 60, borderColor: '#ef4444', label: { text: 'Underweight' } },
        ],
      },
    }).render();
  }
}