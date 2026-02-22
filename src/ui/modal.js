
import { CONF } from '../config';
import { esc } from '../utils';

let _parentEl = null;
let _L = null;

export function initModal(parentEl, L) {
    _parentEl = parentEl;
    _L = L;
}

export function updateModalLang(L) {
    _L = L;
}

export function showModal(html) {
    const m = document.createElement('div');
    m.className = 'pk-modal-ov';
    m.innerHTML = `<div class="pk-modal"><div class="pk-modal-close">${CONF.icons.close}</div>${html}</div>`;
    _parentEl.appendChild(m);
    m.querySelector('.pk-modal-close').addEventListener('click', () => m.remove());
    return m;
}

export function showToast(msg, overlayEl) {
    const box = (overlayEl || _parentEl?.closest('.pk-ov'))?.querySelector('#pk-toast-box');
    if (!box) return;
    const t = document.createElement('div');
    t.className = 'pk-toast';
    t.innerHTML = `<span>✅</span><span>${esc(msg)}</span>`;
    box.appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

export function showAlert(msg, title) {
    const L = _L || {};
    title = title || L.title_alert || 'Alert';
    return new Promise((resolve) => {
        const m = showModal(`
            <h3>${title}</h3>
            <div style="margin:20px 0;line-height:1.5;">${esc(msg).replace(/\n/g, '<br>')}</div>
            <div class="pk-modal-act">
                <button class="pk-btn pri" id="alert_ok">${L.btn_ok || 'OK'}</button>
            </div>
        `);
        m.querySelector('#alert_ok').onclick = () => { m.remove(); resolve(); };
        m.querySelector('.pk-modal-close').onclick = () => { m.remove(); resolve(); };
    });
}

export function showConfirm(msg, title) {
    const L = _L || {};
    title = title || L.title_confirm || 'Confirm';
    return new Promise((resolve) => {
        const m = showModal(`
            <h3>${title}</h3>
            <div style="margin:20px 0;line-height:1.5;">${esc(msg).replace(/\n/g, '<br>')}</div>
            <div class="pk-modal-act">
                <button class="pk-btn" id="cfm_no">${L.btn_no || 'No'}</button>
                <button class="pk-btn pri" id="cfm_yes">${L.btn_yes || 'Yes'}</button>
            </div>
        `);
        m.querySelector('#cfm_no').onclick = () => { m.remove(); resolve(false); };
        m.querySelector('#cfm_yes').onclick = () => { m.remove(); resolve(true); };
        m.querySelector('.pk-modal-close').onclick = () => { m.remove(); resolve(false); };
    });
}

export function showPrompt(msg, val, title) {
    const L = _L || {};
    val = val || '';
    title = title || L.title_prompt || 'Prompt';
    return new Promise((resolve) => {
        const m = showModal(`
            <h3>${title}</h3>
            <div style="margin-bottom:10px;">${esc(msg)}</div>
            <div class="pk-field"><input type="text" id="prm_input" value="${esc(val)}"></div>
            <div class="pk-modal-act">
                <button class="pk-btn" id="prm_cancel">${L.btn_cancel || 'Cancel'}</button>
                <button class="pk-btn pri" id="prm_ok">${L.btn_ok || 'OK'}</button>
            </div>
        `);
        const inp = m.querySelector('#prm_input');
        inp.focus();

        inp.onkeydown = (e) => {
            if (e.key === 'Enter') m.querySelector('#prm_ok').click();
            if (e.key === 'Escape') {
                e.stopPropagation();
                m.remove();
                resolve(null);
            }
        };

        m.querySelector('#prm_cancel').onclick = () => { m.remove(); resolve(null); };
        m.querySelector('#prm_ok').onclick = () => { const v = inp.value.trim(); m.remove(); resolve(v); };
        m.querySelector('.pk-modal-close').onclick = () => { m.remove(); resolve(null); };
    });
}
