// ─── OPEN/CLOSE Modals ────────────────────────────────────────────────────────────
export function openModal(title, body, footer = '') {
    const overlay = document.getElementById('modal-overlay');
    if (!overlay) return;
    
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = body;
    document.getElementById('modal-footer').innerHTML = footer;
    overlay.classList.remove('hidden');
    overlay.classList.add('flex', 'modal-open');
    document.getElementById('modal-panel').classList.remove('scale-95', 'opacity-0');
    document.body.style.overflow = 'hidden';
  }
  
  export function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    if (!overlay) return;
    
    overlay.classList.add('modal-closing');
    overlay.classList.remove('modal-open');
    setTimeout(() => {
      overlay.classList.add('hidden');
      overlay.classList.remove('flex', 'modal-closing');
      document.getElementById('modal-panel').classList.add('scale-95', 'opacity-0');
      document.body.style.overflow = '';
    }, 200);
  }