// ─── Toast System ──────────────────────────────────────────────────────────

(function() {
    const styles = `
        #toast-container {
            position: fixed;
            top: 24px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 9999;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
            pointer-events: none;
            width: 100%;
            max-width: 420px;
            padding: 0 16px;
        }
        .toast {
            pointer-events: auto;
            width: 100%;
            max-width: 420px;
            padding: 18px 20px;
            border-radius: 18px;
            background: rgba(15, 23, 42, 0.85);
            backdrop-filter: blur(28px);
            -webkit-backdrop-filter: blur(28px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4),
                        0 2px 8px rgba(0, 0, 0, 0.2),
                        inset 0 1px 0 rgba(255, 255, 255, 0.04);
            color: #f1f5f9;
            display: flex;
            align-items: flex-start;
            gap: 14px;
            position: relative;
            overflow: hidden;
            animation: toastSlideIn 0.5s cubic-bezier(0.21, 1.02, 0.73, 1) forwards;
        }
        .toast.removing { animation: toastFadeOut 0.35s ease-in forwards; }
        .toast-success { border-left: 3px solid #22c55e; }
        .toast-error { border-left: 3px solid #ef4444; }
        .toast-info { border-left: 3px solid #3b82f6; }
        .toast-warning { border-left: 3px solid #f59e0b; }
        @keyframes toastSlideIn {
            0% { opacity: 0; transform: translateY(-24px) scale(0.94); }
            60% { opacity: 1; transform: translateY(3px) scale(1.01); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes toastFadeOut {
            0% { opacity: 1; transform: translateY(0) scale(1); }
            100% { opacity: 0; transform: translateY(-12px) scale(0.96); }
        }
        .toast-icon {
            width: 38px; height: 38px; min-width: 38px; border-radius: 12px;
            display: flex; align-items: center; justify-content: center;
            font-size: 16px; font-weight: 700;
        }
        .toast-success .toast-icon { background: rgba(34,197,94,0.18); color: #22c55e; animation: iconPulse 2.5s ease-in-out infinite; }
        .toast-error .toast-icon { background: rgba(239,68,68,0.18); color: #ef4444; animation: iconPulse 2.5s ease-in-out infinite; }
        .toast-info .toast-icon { background: rgba(59,130,246,0.18); color: #3b82f6; animation: iconPulse 2.5s ease-in-out infinite; }
        .toast-warning .toast-icon { background: rgba(245,158,11,0.18); color: #f59e0b; animation: iconPulse 2.5s ease-in-out infinite; }
        @keyframes iconPulse {
            0%,100% { box-shadow: 0 0 0 0 currentColor; }
            50% { box-shadow: 0 0 0 10px transparent; }
        }
        .toast-body { flex: 1; min-width: 0; }
        .toast-title { font-size: 13px; font-weight: 600; color: #f8fafc; margin-bottom: 2px; }
        .toast-message { font-size: 13px; font-weight: 400; color: #94a3b8; line-height: 1.4; }
        .toast-progress { position: absolute; bottom: 0; left: 0; height: 3px; border-radius: 0 0 0 18px; }
        .toast-success .toast-progress { background: #22c55e; }
        .toast-error .toast-progress { background: #ef4444; }
        .toast-info .toast-progress { background: #3b82f6; }
        .toast-warning .toast-progress { background: #f59e0b; }
        .toast-close { background: none; border: none; color: rgba(255,255,255,0.3); cursor: pointer; font-size: 20px; padding: 0 2px; line-height: 1; }
        .toast-close:hover { color: rgba(255,255,255,0.7); }
        @media (max-width: 480px) {
            .toast { padding: 14px 16px; gap: 10px; }
            .toast-icon { width: 32px; height: 32px; min-width: 32px; font-size: 14px; }
            .toast-title { font-size: 12px; }
            .toast-message { font-size: 12px; }
        }
    `;

    const styleTag = document.createElement('style');
    styleTag.textContent = styles;
    document.head.appendChild(styleTag);

    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const icons = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' };

    function removeToast(toast) {
        if (toast._removing) return;
        toast._removing = true;
        clearTimeout(toast._timer);
        toast.classList.add('removing');
        setTimeout(() => { if (toast.parentNode) toast.remove(); }, 350);
    }

    function createToast({ type = 'success', title = '', message = '', duration = 3000 } = {}) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-icon">${icons[type] || icons.success}</div>
            <div class="toast-body"><div class="toast-title">${title}</div><div class="toast-message">${message}</div></div>
            <button class="toast-close">×</button>
            <div class="toast-progress"></div>
        `;
        const progress = toast.querySelector('.toast-progress');
        progress.style.width = '100%';
        requestAnimationFrame(() => { progress.style.transition = `width ${duration}ms linear`; progress.style.width = '0%'; });
        toast.querySelector('.toast-close').addEventListener('click', () => removeToast(toast));
        toast._timer = setTimeout(() => removeToast(toast), duration);
        container.appendChild(toast);
        const toasts = container.querySelectorAll('.toast');
        if (toasts.length > 5) removeToast(toasts[0]);
        return toast;
    }

    createToast.success = (message, title = 'Success') => createToast({ type: 'success', title, message });
    createToast.error = (message, title = 'Error') => createToast({ type: 'error', title, message });
    createToast.info = (message, title = 'Information') => createToast({ type: 'info', title, message });
    createToast.warning = (message, title = 'Warning') => createToast({ type: 'warning', title, message });

    window.showToast = createToast;
})();

export const showToast = window.showToast;