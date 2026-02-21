// src/ui/layout.js
// 레이아웃 생성, 로딩, 상태바, 네비게이션 상태
import { CONF } from '../config';
import { CSS } from '../style';
import { AppState } from '../core/state';

export const UI = {};
let _overlayEl = null;
export function getOverlayEl() { return _overlayEl; }

export function createLayout(L, lang, version) {
    const view = AppState.get('view') || 'list';
    const el = document.createElement('div'); el.className = 'pk-ov';
    let siteFont = window.getComputedStyle(document.body).fontFamily || '';
    siteFont = siteFont.replace(/,?\s*sans-serif\s*$/i, '');
    el.style.fontFamily = siteFont ? `${siteFont}, "Noto Sans", sans-serif` : '"Noto Sans", sans-serif';
    el.innerHTML = `
        <style>${CSS}</style>
        <div class="pk-win pk-lang-${lang}">
            <div class="pk-loading-ov" id="pk-loader"><div class="pk-spin-lg"></div><div class="pk-loading-txt" id="pk-load-txt">${L.loading_detail}</div><button class="pk-stop-btn" id="pk-stop-load" title="${L.tip_stop}">${CONF.icons.stop} <span>${L.btn_stop}</span></button></div>
            <div class="pk-hd"><div class="pk-tt"><img src="${CONF.logoUrl}" style="width:24px;height:24px;border-radius:4px;object-fit:contain;">${L.title}</div><div style="display:flex;gap:4px;"><div class="pk-btn" id="pk-help" style="width:32px;padding:0;justify-content:center;" title="${L.tip_help}">${CONF.icons.help}</div><div class="pk-btn" id="pk-settings" style="width:32px;padding:0;justify-content:center;" title="${L.tip_settings}">${CONF.icons.settings}</div><div class="pk-btn" id="pk-close" style="width:32px;padding:0;justify-content:center;">${CONF.icons.close}</div></div></div>
            <div class="pk-tb"><button class="pk-btn" id="pk-nav-back" title="${L.tip_back}">${CONF.icons.back}<span>${L.btn_back}</span></button><button class="pk-btn" id="pk-refresh" title="${L.tip_refresh}">${CONF.icons.refresh}</button><button class="pk-btn" id="pk-nav-fwd" title="${L.tip_fwd}">${CONF.icons.fwd}<span>${L.btn_fwd}</span></button><div class="pk-sep"></div><div class="pk-nav" id="pk-crumb"></div><div style="flex:1"></div><div class="pk-search"><input type="text" id="pk-search-input" placeholder="${L.placeholder_search}" title="${L.tip_search}" autocomplete="off"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></div><div class="pk-dup-toolbar" id="pk-dup-tools"><span class="pk-dup-lbl">${L.lbl_dup_tool}</span><button class="pk-btn-toggle" id="pk-dup-size" title="${L.tip_toggle_size}">${L.btn_toggle_size} <span id="pk-cond-size">(${L.cond_small})</span></button><button class="pk-btn-toggle" id="pk-dup-date" title="${L.tip_toggle_date}">${L.btn_toggle_date} <span id="pk-cond-date">(${L.cond_old})</span></button></div><button class="pk-btn" id="pk-dup" style="display:none" title="${L.tip_dup}">${CONF.icons.dup} <span>${L.btn_dup}</span></button><button class="pk-btn" id="pk-scan" title="${L.tip_scan}">${CONF.icons.scan} <span>${L.btn_scan}</span></button><div class="pk-sep"></div><button class="pk-btn" id="pk-filter-toggle" title="${L.tip_filter}">${CONF.icons.filter} <span>${L.btn_filter}</span></button></div>
            <div class="pk-tb" id="pk-actionbar"><div class="pk-btn" id="pk-sidebar-toggle" title="${L.tip_sidebar}">${CONF.icons.sidebar}</div><button class="pk-btn" id="pk-view-toggle" title="${view === 'list' ? L.btn_view_grid : L.btn_view_list}">${view === 'list' ? CONF.icons.grid_view : CONF.icons.list_view}</button><input type="range" id="pk-grid-zoom" min="80" max="320" value="${AppState.get('gridZoom') || 140}" style="display:${view === 'grid' ? 'inline-block' : 'none'}; width:70px; margin-left:8px; cursor:pointer;" title="Zoom"><div class="pk-sep"></div><button class="pk-btn" id="pk-newfolder" title="${L.tip_newfolder}">${CONF.icons.newfolder} <span>${L.btn_newfolder}</span></button><button class="pk-btn" id="pk-del" title="${L.tip_del}">${CONF.icons.del} <span>${L.btn_del}</span></button><button class="pk-btn" id="pk-deselect" title="${L.tip_deselect}" style="display:none">${CONF.icons.deselect} <span>${L.btn_deselect}</span></button><div class="pk-sep"></div><button class="pk-btn" id="pk-copy" title="${L.tip_copy}">${CONF.icons.copy} <span>${L.btn_copy}</span></button><button class="pk-btn" id="pk-cut" title="${L.tip_cut}">${CONF.icons.cut} <span>${L.btn_cut}</span></button><button class="pk-btn" id="pk-paste" title="${L.tip_paste}" disabled>${CONF.icons.paste} <span>${L.btn_paste}</span></button><div class="pk-sep"></div><button class="pk-btn" id="pk-rename" title="${L.tip_rename}">${CONF.icons.rename} <span>${L.btn_rename}</span></button><button class="pk-btn" id="pk-bulkrename" title="${L.tip_bulkrename}">${CONF.icons.bulkrename} <span>${L.btn_bulkrename}</span></button><div class="pk-sep"></div><button class="pk-btn" id="pk-link-copy" title="${L.tip_link_copy}">${CONF.icons.link_copy || '🔗'} <span>${L.btn_link_copy}</span></button></div>
            <div id="pk-filter-area"></div>
            <div class="pk-body">
                <div class="pk-sidebar" id="pk-sidebar"></div>
                <div class="pk-main">
                    <div class="pk-grid-hd"><div><input type="checkbox" id="pk-all"></div><div class="pk-col" data-k="name">${L.col_name} <span></span></div><div class="pk-col" data-k="size">${L.col_size} <span></span></div><div class="pk-col" data-k="duration">${L.col_dur} <span></span></div><div class="pk-col" data-k="modified_time">${L.col_date} <span></span></div></div>
                    <div class="pk-vp" id="pk-vp"><div class="pk-in" id="pk-in"></div></div>
                </div>
            </div>
            <div class="pk-ft"><div class="pk-stat" id="pk-stat">${L.status_ready.replace('{n}', 0)}</div><div class="pk-grp"><button class="pk-btn" id="pk-ext" title="${L.tip_ext}">${CONF.icons.play} <span>${L.btn_ext}</span></button><div class="pk-sep"></div><button class="pk-btn" id="pk-idm" title="${L.tip_idm}">${CONF.icons.link} <span>${L.btn_idm}</span></button><button class="pk-btn" id="pk-aria2" title="${L.tip_aria2}">${CONF.icons.send} <span>${L.btn_aria2}</span></button><button class="pk-btn" id="pk-down" title="${L.tip_down}">${CONF.icons.download} <span>${L.btn_down}</span></button></div></div>
        </div>
        <div class="pk-pop" id="pk-pop"></div>
        <div class="pk-ctx" id="pk-ctx"><div class="pk-ctx-item" id="ctx-open">📂 ${L.ctx_open}</div><div class="pk-ctx-sep"></div><div class="pk-ctx-item" id="ctx-down">💾 ${L.ctx_down}</div><div class="pk-ctx-item" id="ctx-copy">📄 ${L.ctx_copy}</div><div class="pk-ctx-item" id="ctx-cut">✂️ ${L.ctx_cut}</div><div class="pk-ctx-sep"></div><div class="pk-ctx-item" id="ctx-rename">✏️ ${L.ctx_rename}</div><div class="pk-ctx-item" id="ctx-del" style="color:#d93025">🗑️ ${L.ctx_del}</div></div>
        <div class="pk-toast-box" id="pk-toast-box"></div>
    `;
    document.body.appendChild(el);
    _overlayEl = el;
    UI.el = el; UI.win = el.querySelector('.pk-win'); UI.vp = el.querySelector('#pk-vp'); UI.in = el.querySelector('#pk-in');
    UI.loader = el.querySelector('#pk-loader'); UI.loadTxt = el.querySelector('#pk-load-txt'); UI.stopBtn = el.querySelector('#pk-stop-load');
    UI.crumb = el.querySelector('#pk-crumb'); UI.stat = el.querySelector('#pk-stat');
    UI.chkAll = el.querySelector('#pk-all'); UI.scan = el.querySelector('#pk-scan'); UI.dup = el.querySelector('#pk-dup');
    UI.dupTools = el.querySelector('#pk-dup-tools');
    UI.btnDupSize = el.querySelector('#pk-dup-size'); UI.condSize = el.querySelector('#pk-cond-size');
    UI.btnDupDate = el.querySelector('#pk-dup-date'); UI.condDate = el.querySelector('#pk-cond-date');
    UI.btnBack = el.querySelector('#pk-nav-back'); UI.btnFwd = el.querySelector('#pk-nav-fwd');
    UI.btnCopy = el.querySelector('#pk-copy'); UI.btnCut = el.querySelector('#pk-cut');
    UI.btnDel = el.querySelector('#pk-del'); UI.btnDeselect = el.querySelector('#pk-deselect');
    UI.btnRename = el.querySelector('#pk-rename'); UI.btnBulkRename = el.querySelector('#pk-bulkrename'); UI.btnPaste = el.querySelector('#pk-paste');
    UI.btnRefresh = el.querySelector('#pk-refresh'); UI.btnNewFolder = el.querySelector('#pk-newfolder');
    UI.btnSettings = el.querySelector('#pk-settings'); UI.btnClose = el.querySelector('#pk-close');
    UI.btnHelp = el.querySelector('#pk-help'); UI.btnExt = el.querySelector('#pk-ext'); UI.btnIdm = el.querySelector('#pk-idm');
    UI.btnLinkCopy = el.querySelector('#pk-link-copy'); UI.btnViewToggle = el.querySelector('#pk-view-toggle');
    UI.pop = el.querySelector('#pk-pop'); UI.ctx = el.querySelector('#pk-ctx'); UI.cols = el.querySelectorAll('.pk-col');
    UI.searchInput = el.querySelector('#pk-search-input');
    UI.filterToggle = el.querySelector('#pk-filter-toggle'); UI.filterArea = el.querySelector('#pk-filter-area');
    UI.sidebarEl = el.querySelector('#pk-sidebar'); UI.sidebarToggle = el.querySelector('#pk-sidebar-toggle');
    UI.gridZoom = el.querySelector('#pk-grid-zoom');

    // ── 윈도우 드래그 ──
    let isDragging = false, startX, startY;
    let initialLeft, initialTop;
    const hd = el.querySelector('.pk-hd');
    hd.addEventListener('mousedown', (e) => {
        if (e.target.closest('.pk-btn') || e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
        isDragging = true;
        startX = e.clientX; startY = e.clientY;
        const rect = UI.win.getBoundingClientRect();
        initialLeft = parseFloat(getComputedStyle(UI.win).left) || rect.left;
        initialTop = parseFloat(getComputedStyle(UI.win).top) || rect.top;
        document.body.style.userSelect = 'none';
        hd.style.cursor = 'grabbing';
    });
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX, dy = e.clientY - startY;
        UI.win.style.left = `${initialLeft + dx}px`;
        UI.win.style.top = `${initialTop + dy}px`;
        UI.win.style.margin = '0';
        UI.win.style.transform = 'none';
    });
    document.addEventListener('mouseup', () => {
        isDragging = false;
        document.body.style.userSelect = '';
        hd.style.cursor = 'default';
    });

    // ── 윈도우 리사이즈 (가장자리) ──
    const rsDirs = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];
    rsDirs.forEach(dir => {
        const h = document.createElement('div');
        h.className = `pk-rz pk-rz-${dir}`;
        UI.win.appendChild(h);

        h.addEventListener('mousedown', (e) => {
            let isResizing = true, rStartX = e.clientX, rStartY = e.clientY;
            const rect = UI.win.getBoundingClientRect();
            let startW = rect.width, startH = rect.height;
            let startL = parseFloat(getComputedStyle(UI.win).left) || rect.left;
            let startT = parseFloat(getComputedStyle(UI.win).top) || rect.top;
            document.body.style.cursor = `${dir}-resize`;
            document.body.style.userSelect = 'none';
            e.stopPropagation(); e.preventDefault();

            const mm = (ev) => {
                if (!isResizing) return;
                const dx = ev.clientX - rStartX, dy = ev.clientY - rStartY;
                if (dir.includes('e')) UI.win.style.width = `${startW + dx}px`;
                if (dir.includes('s')) UI.win.style.height = `${startH + dy}px`;
                if (dir.includes('w')) {
                    UI.win.style.width = `${startW - dx}px`;
                    UI.win.style.left = `${startL + dx}px`;
                }
                if (dir.includes('n')) {
                    UI.win.style.height = `${startH - dy}px`;
                    UI.win.style.top = `${startT + dy}px`;
                }
            };
            const mu = () => {
                isResizing = false;
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
                document.removeEventListener('mousemove', mm);
                document.removeEventListener('mouseup', mu);
            };
            document.addEventListener('mousemove', mm);
            document.addEventListener('mouseup', mu);
        });
    });

    return el;
}

export function setLoading(b, L) { AppState.setState({ loading: b }); UI.loader.style.display = b ? 'flex' : 'none'; if (b && L) UI.loadTxt.textContent = L.loading_detail; }
export function updateLoadingText(txt) { if (UI.loadTxt) UI.loadTxt.innerText = txt; }
export function updateStat(L) {
    const n = AppState.get('sel').size, display = AppState.get('display');
    UI.stat.textContent = n > 0 ? L.sel_count.replace('{n}', n) : L.status_ready.replace('{n}', display.length);
    const hasSel = n > 0;
    UI.btnCopy.disabled = !hasSel; UI.btnCut.disabled = !hasSel; UI.btnDel.disabled = !hasSel;
    UI.btnRename.disabled = n !== 1; UI.btnBulkRename.disabled = n < 2; UI.btnSettings.disabled = false;
    UI.btnDeselect.style.display = hasSel ? 'inline-flex' : 'none';
    if (UI.btnLinkCopy) UI.btnLinkCopy.disabled = !hasSel;
}
export function updateNavState() {
    const path = AppState.get('path'), history = AppState.get('history'), forward = AppState.get('forward');
    UI.btnBack.disabled = (history.length === 0 && path.length <= 1);
    UI.btnFwd.disabled = forward.length === 0;
}
