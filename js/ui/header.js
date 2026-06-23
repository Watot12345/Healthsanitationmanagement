import { VIEW_META } from '../config.js';
import { state } from '../state.js';

export function updateHeader() {
  const meta = VIEW_META[state.view] || { title: 'Dashboard', subtitle: '' };
  document.getElementById('page-title').textContent = meta.title;
  document.getElementById('page-subtitle').textContent = meta.subtitle;
}