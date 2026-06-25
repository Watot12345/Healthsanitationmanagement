import { card, badge } from '../../utils/dom.js';

// ─── Fake Data ──────────────────────────────────────────────────────────────

const barangayCases = [
  { name: 'San Jose', lat: 14.5794, lng: 121.0359, dengue: 12, influenza: 8, total: 22, risk: 'High' },
  { name: 'Poblacion', lat: 14.5810, lng: 121.0400, dengue: 5, influenza: 15, total: 20, risk: 'High' },
  { name: 'Riverside', lat: 14.5750, lng: 121.0420, dengue: 3, influenza: 5, leptospirosis: 5, total: 13, risk: 'Moderate' },
  { name: 'San Antonio', lat: 14.5830, lng: 121.0380, dengue: 8, influenza: 3, total: 11, risk: 'Moderate' },
  { name: 'Bagong Silang', lat: 14.5770, lng: 121.0450, dengue: 2, influenza: 4, total: 6, risk: 'Low' },
  { name: 'Mabini', lat: 14.5850, lng: 121.0360, dengue: 1, influenza: 2, total: 3, risk: 'Low' },
];

// ─── View ────────────────────────────────────────────────────────────────────

export function renderMappingClustering() {
  return `
    <div class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
        ${barangayCases.map(b => card(`
          <div class="p-4">
            <p class="text-sm font-semibold">${b.name}</p>
            <p class="text-2xl font-bold mt-1">${b.total}</p>
            <p class="text-xs text-slate-500">total cases</p>
            <div class="mt-2">${badge(b.risk)}</div>
          </div>
        `)).join('')}
      </div>

      ${card(`
        <div class="p-5">
          <h3 class="font-semibold mb-4">Case Cluster Map</h3>
          <div id="cluster-map" style="height: 450px; border-radius: 12px;"></div>
        </div>
      `)}

      ${card(`
        <div class="p-5">
          <h3 class="font-semibold mb-4">Spread Tracking Over Time</h3>
          <div id="spread-chart" style="min-height: 300px;"></div>
        </div>
      `)}
    </div>
  `;
}

// ─── Initialize ──────────────────────────────────────────────────────────────

export function initMappingClustering() {
 const mapEl = document.getElementById('cluster-map');
  if (!mapEl) return;

  const map = L.map('cluster-map').setView([14.5800, 121.0400], 14);

  // MOVE BOUNDS HERE - after map is created
  const bounds = L.latLngBounds(
    [14.5740, 121.0340],
    [14.5870, 121.0470]
  );
  map.setMaxBounds(bounds);
  map.setMinZoom(13);
  map.setMaxZoom(17);
  map.fitBounds(bounds);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);

  const riskColors = { High: '#ef4444', Moderate: '#eab308', Low: '#22c55e' };

  barangayCases.forEach(b => {
    const circle = L.circle([b.lat, b.lng], {
      color: riskColors[b.risk],
      fillColor: riskColors[b.risk],
      fillOpacity: 0.4,
      radius: b.total * 30,
    }).addTo(map);

    circle.bindPopup(`
      <strong>${b.name}</strong><br>
      Total Cases: ${b.total}<br>
      Dengue: ${b.dengue}<br>
      Influenza: ${b.influenza}<br>
      Risk: ${b.risk}
    `);
  });

  // Spread chart
  const chartEl = document.getElementById('spread-chart');
  if (chartEl) {
    new ApexCharts(chartEl, {
      series: [
        { name: 'San Jose', data: [5, 8, 12, 15, 18, 22] },
        { name: 'Poblacion', data: [3, 6, 10, 14, 17, 20] },
        { name: 'Riverside', data: [1, 2, 5, 8, 10, 13] },
      ],
      chart: { type: 'line', height: 300 },
      stroke: { curve: 'smooth', width: 3 },
      xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
      yaxis: { title: { text: 'Total Cases' } },
      colors: ['#ef4444', '#eab308', '#3b82f6'],
    }).render();
  }
}