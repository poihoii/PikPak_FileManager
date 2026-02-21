// src/core/toast.js
// 토스트 알림 시스템입니다.

const CONTAINER_ID = 'pfm-toast-container';

function ensureContainer() {
    let c = document.getElementById(CONTAINER_ID);
    if (!c) {
        c = document.createElement('div');
        c.id = CONTAINER_ID;
        document.body.appendChild(c);
    }
    return c;
}

const ICONS = {
    info: 'ℹ',
    success: '✓',
    error: '✗',
    warning: '⚠',
};

export const Toast = {
    show(msg, type = 'info', duration = 3000) {
        const container = ensureContainer();
        const el = document.createElement('div');
        el.className = `pfm-toast pfm-toast-${type}`;
        el.innerHTML = `
            <span class="pfm-toast-icon">${ICONS[type] || ''}</span>
            <span class="pfm-toast-msg">${msg}</span>
        `;
        container.appendChild(el);
        requestAnimationFrame(() => el.classList.add('pfm-toast-visible'));
        setTimeout(() => {
            el.classList.remove('pfm-toast-visible');
            setTimeout(() => el.remove(), 300);
        }, duration);
    },

    success: (msg, dur) => Toast.show(msg, 'success', dur),
    error: (msg, dur) => Toast.show(msg, 'error', dur),
    warning: (msg, dur) => Toast.show(msg, 'warning', dur),
    info: (msg, dur) => Toast.show(msg, 'info', dur),

    // 백그라운드 작업용 — 진행률 표시
    progress(msg) {
        const container = ensureContainer();
        const el = document.createElement('div');
        el.className = 'pfm-toast pfm-toast-progress pfm-toast-visible';
        el.innerHTML = `
            <span class="pfm-toast-msg">${msg}</span>
            <div class="pfm-toast-bar"><div class="pfm-toast-fill" style="width:0%"></div></div>
            <span class="pfm-toast-pct">0%</span>
        `;
        container.appendChild(el);
        const fill = el.querySelector('.pfm-toast-fill');
        const pct = el.querySelector('.pfm-toast-pct');
        return {
            update(percent, newMsg) {
                fill.style.width = `${percent}%`;
                pct.textContent = `${Math.round(percent)}%`;
                if (newMsg) el.querySelector('.pfm-toast-msg').textContent = newMsg;
            },
            done(successMsg) {
                el.classList.add('pfm-toast-success');
                el.querySelector('.pfm-toast-msg').textContent = successMsg || '완료';
                fill.style.width = '100%';
                setTimeout(() => {
                    el.classList.remove('pfm-toast-visible');
                    setTimeout(() => el.remove(), 300);
                }, 2000);
            },
            error(errorMsg) {
                el.classList.add('pfm-toast-error');
                el.querySelector('.pfm-toast-msg').textContent = errorMsg || '오류 발생';
                setTimeout(() => el.remove(), 3000);
            },
        };
    },
};

// Toast CSS (style.js에서 병합)
export const TOAST_CSS = `
#pfm-toast-container {
    position: fixed; bottom: 24px; right: 24px;
    display: flex; flex-direction: column; gap: 8px;
    z-index: 2147483647; pointer-events: none;
}
.pfm-toast {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 16px; border-radius: 8px;
    font-size: 13px; font-family: inherit;
    background: #323232; color: #fff;
    box-shadow: 0 4px 12px rgba(0,0,0,.3);
    opacity: 0; transform: translateY(8px);
    transition: opacity .25s, transform .25s;
    pointer-events: auto; max-width: 360px;
}
.pfm-toast.pfm-toast-visible { opacity: 1; transform: translateY(0); }
.pfm-toast-success { background: #2e7d32; }
.pfm-toast-error   { background: #c62828; }
.pfm-toast-warning { background: #e65100; }
.pfm-toast-bar     { flex: 1; height: 4px; background: rgba(255,255,255,.3); border-radius: 2px; }
.pfm-toast-fill    { height: 100%; background: #fff; border-radius: 2px; transition: width .2s; }
`;
