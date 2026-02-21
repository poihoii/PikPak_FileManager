// src/ui/contextMenu.js
// 우클릭 컨텍스트 메뉴 이벤트 연결

import { UI } from './layout';

export function initContextMenu(callbacks) {
    const ctx = UI.ctx;
    if (!ctx) return;

    UI.el.querySelector('#ctx-open').onclick = () => { hideCtx(); callbacks.onOpen?.(); };
    UI.el.querySelector('#ctx-down').onclick = () => { hideCtx(); callbacks.onDown?.(); };
    UI.el.querySelector('#ctx-copy').onclick = () => { hideCtx(); callbacks.onCopy?.(); };
    UI.el.querySelector('#ctx-cut').onclick = () => { hideCtx(); callbacks.onCut?.(); };
    UI.el.querySelector('#ctx-rename').onclick = () => { hideCtx(); callbacks.onRename?.(); };
    UI.el.querySelector('#ctx-del').onclick = () => { hideCtx(); callbacks.onDel?.(); };
}

export function showCtx(x, y) {
    const ctx = UI.ctx;
    ctx.style.display = 'block';
    ctx.style.left = `${x}px`;
    ctx.style.top = `${y}px`;
}

export function hideCtx() {
    const ctx = UI.ctx;
    if (ctx) ctx.style.display = 'none';
}
