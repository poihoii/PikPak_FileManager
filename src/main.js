import { CONF } from './config';
import { CSS } from './style';
import { getStrings, getLang } from './languages';
import { sleep, esc, fmtSize, fmtDate, fmtDur, gmGet, gmSet } from './utils';
import { apiList, apiGet, apiAction, getHeaders } from './api';
import pkg from '../package.json';
const { version } = pkg;

console.log("🚀 PikPak Script: LOADED from main.js");

// 파일명 확장자 기반 아이콘 반환 함수
function getIcon(item) {
    if (item.kind === 'drive#folder') return CONF.typeIcons.folder;
    const name = item.name || "";
    const dotIdx = name.lastIndexOf('.');
    if (dotIdx === -1) return CONF.typeIcons.file;
    const ext = name.substring(dotIdx + 1).toLowerCase();
    if (['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'webm', 'ts', 'm4v', '3gp'].includes(ext)) return CONF.typeIcons.video;
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'tiff', 'ico'].includes(ext)) return CONF.typeIcons.image;
    if (['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma'].includes(ext)) return CONF.typeIcons.audio;
    if (['zip', 'rar', '7z', 'tar', 'gz', 'iso', 'dmg', 'pkg'].includes(ext)) return CONF.typeIcons.archive;
    if (['pdf'].includes(ext)) return CONF.typeIcons.pdf;
    if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'md', 'csv'].includes(ext)) return CONF.typeIcons.text;
    return CONF.typeIcons.file;
}

async function openManager() {
    if (document.querySelector('.pk-ov')) return;

    const L = getStrings();
    const lang = getLang();

    const S = {
        path: [{ id: '', name: '🏠 Home' }],
        history: [],
        forward: [],
        items: [], display: [], sel: new Set(),
        sort: 'name', dir: 1, scanning: false, dupMode: false, dupRunning: false,
        dupReasons: new Map(),
        dupGroups: new Map(),
        dupSizeStrategy: 'small',
        dupDateStrategy: 'old',
        clipItems: [], clipType: '',
        clipSourceParentId: null,
        loading: false,
        lastSelIdx: -1,
        search: '',
        view: gmGet('pk_view_mode', 'list') // 'list' or 'grid'
    };

    const el = document.createElement('div'); el.className = 'pk-ov';
    let siteFont = window.getComputedStyle(document.body).fontFamily || '';
    siteFont = siteFont.replace(/,?\s*sans-serif\s*$/i, '');
    el.style.fontFamily = siteFont ? `${siteFont}, "Noto Sans", sans-serif` : '"Noto Sans", sans-serif';

    el.innerHTML = `
        <style>${CSS}</style>
        <div class="pk-win pk-lang-${lang}">
            <div class="pk-loading-ov" id="pk-loader">
                <div class="pk-spin-lg"></div>
                <div class="pk-loading-txt" id="pk-load-txt">${L.loading_detail}</div>
                <button class="pk-stop-btn" id="pk-stop-load" title="${L.tip_stop}">${CONF.icons.stop} <span>${L.btn_stop}</span></button>
            </div>
            <div class="pk-hd">
                <div class="pk-tt">
                    <img src="${CONF.logoUrl}" style="width:24px;height:24px;border-radius:4px;object-fit:contain;">
                    ${L.title}
                </div>
                <div style="display:flex;gap:4px;">
                    <div class="pk-btn" id="pk-help" style="width:32px;padding:0;justify-content:center;" title="${L.tip_help}">${CONF.icons.help}</div>
                    <div class="pk-btn" id="pk-settings" style="width:32px;padding:0;justify-content:center;" title="${L.tip_settings}">${CONF.icons.settings}</div>
                    <div class="pk-btn" id="pk-close" style="width:32px;padding:0;justify-content:center;">${CONF.icons.close}</div>
                </div>
            </div>
            <div class="pk-tb">
                <div class="pk-nav" id="pk-crumb"></div>
                <div style="flex:1"></div>
                <div class="pk-search">
                    <input type="text" id="pk-search-input" placeholder="${L.placeholder_search}" title="${L.tip_search}" autocomplete="off">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
                <div class="pk-dup-toolbar" id="pk-dup-tools">
                    <span class="pk-dup-lbl">${L.lbl_dup_tool}</span>
                    <button class="pk-btn-toggle" id="pk-dup-size" title="${L.tip_toggle_size}">
                        ${L.btn_toggle_size} <span id="pk-cond-size">(${L.cond_small})</span>
                    </button>
                    <button class="pk-btn-toggle" id="pk-dup-date" title="${L.tip_toggle_date}">
                        ${L.btn_toggle_date} <span id="pk-cond-date">(${L.cond_old})</span>
                    </button>
                </div>
                <button class="pk-btn" id="pk-dup" style="display:none" title="${L.tip_dup}">${CONF.icons.dup} <span>${L.btn_dup}</span></button>
                <button class="pk-btn" id="pk-scan" title="${L.tip_scan}">${CONF.icons.scan} <span>${L.btn_scan}</span></button>
                <div class="pk-sep"></div>
                <button class="pk-btn" id="pk-view-toggle" title="${S.view === 'list' ? L.btn_view_grid : L.btn_view_list}">
                    ${S.view === 'list' ? CONF.icons.grid_view : CONF.icons.list_view}
                </button>
            </div>
            <div class="pk-tb" id="pk-actionbar">
                <button class="pk-btn" id="pk-nav-back" title="${L.tip_back}">${CONF.icons.back}<span>${L.btn_back}</span></button>
                <button class="pk-btn" id="pk-refresh" title="${L.tip_refresh}">${CONF.icons.refresh}</button>
                <button class="pk-btn" id="pk-nav-fwd" title="${L.tip_fwd}">${CONF.icons.fwd}<span>${L.btn_fwd}</span></button>
                <div class="pk-sep"></div>
                <button class="pk-btn" id="pk-newfolder" title="${L.tip_newfolder}">${CONF.icons.newfolder} <span>${L.btn_newfolder}</span></button>
                <button class="pk-btn" id="pk-del" title="${L.tip_del}">${CONF.icons.del} <span>${L.btn_del}</span></button>
                <button class="pk-btn" id="pk-deselect" title="${L.tip_deselect}" style="display:none">${CONF.icons.deselect} <span>${L.btn_deselect}</span></button>
                <div class="pk-sep"></div>
                <button class="pk-btn" id="pk-copy" title="${L.tip_copy}">${CONF.icons.copy} <span>${L.btn_copy}</span></button>
                <button class="pk-btn" id="pk-cut" title="${L.tip_cut}">${CONF.icons.cut} <span>${L.btn_cut}</span></button>
                <button class="pk-btn" id="pk-paste" title="${L.tip_paste}" disabled>${CONF.icons.paste} <span>${L.btn_paste}</span></button>
                <div class="pk-sep"></div>
                <button class="pk-btn" id="pk-rename" title="${L.tip_rename}">${CONF.icons.rename} <span>${L.btn_rename}</span></button>
                <button class="pk-btn" id="pk-bulkrename" title="${L.tip_bulkrename}">${CONF.icons.bulkrename} <span>${L.btn_bulkrename}</span></button>
                <div class="pk-sep"></div>
                <button class="pk-btn" id="pk-link-copy" title="${L.tip_link_copy}">${CONF.icons.link_copy || '🔗'} <span>${L.btn_link_copy}</span></button>
            </div>
            <div class="pk-grid-hd">
                <div><input type="checkbox" id="pk-all"></div>
                <div class="pk-col" data-k="name">${L.col_name} <span></span></div>
                <div class="pk-col" data-k="size">${L.col_size} <span></span></div>
                <div class="pk-col" data-k="duration">${L.col_dur} <span></span></div>
                <div class="pk-col" data-k="modified_time">${L.col_date} <span></span></div>
            </div>
            <div class="pk-vp" id="pk-vp">
                <div class="pk-in" id="pk-in"></div>
            </div>
            <div class="pk-ft">
                <div class="pk-stat" id="pk-stat">${L.status_ready.replace('{n}', 0)}</div>
                <div class="pk-grp">
                    <button class="pk-btn" id="pk-ext" title="${L.tip_ext}">${CONF.icons.play} <span>${L.btn_ext}</span></button>
                    <div class="pk-sep"></div>
                    <button class="pk-btn" id="pk-idm" title="${L.tip_idm}">${CONF.icons.link} <span>${L.btn_idm}</span></button>
                    <button class="pk-btn" id="pk-aria2" title="${L.tip_aria2}">${CONF.icons.send} <span>${L.btn_aria2}</span></button>
                    <button class="pk-btn" id="pk-down" title="${L.tip_down}">${CONF.icons.download} <span>${L.btn_down}</span></button>
                </div>
            </div>
        </div>
        <div class="pk-pop" id="pk-pop"></div>
        <div class="pk-ctx" id="pk-ctx">
            <div class="pk-ctx-item" id="ctx-open">📂 ${L.ctx_open}</div>
            <div class="pk-ctx-sep"></div>
            <div class="pk-ctx-item" id="ctx-down">💾 ${L.ctx_down}</div>
            <div class="pk-ctx-item" id="ctx-copy">📄 ${L.ctx_copy}</div>
            <div class="pk-ctx-item" id="ctx-cut">✂️ ${L.ctx_cut}</div>
            <div class="pk-ctx-sep"></div>
            <div class="pk-ctx-item" id="ctx-rename">✏️ ${L.ctx_rename}</div>
            <div class="pk-ctx-item" id="ctx-del" style="color:#d93025">🗑️ ${L.ctx_del}</div>
        </div>
        <div class="pk-toast-box" id="pk-toast-box"></div>
    `;
    document.body.appendChild(el);

    const UI = {
        win: el.querySelector('.pk-win'), vp: el.querySelector('#pk-vp'), in: el.querySelector('#pk-in'),
        loader: el.querySelector('#pk-loader'), loadTxt: el.querySelector('#pk-load-txt'), stopBtn: el.querySelector('#pk-stop-load'),
        crumb: el.querySelector('#pk-crumb'), stat: el.querySelector('#pk-stat'),
        chkAll: el.querySelector('#pk-all'), scan: el.querySelector('#pk-scan'), dup: el.querySelector('#pk-dup'),
        dupTools: el.querySelector('#pk-dup-tools'),
        btnDupSize: el.querySelector('#pk-dup-size'), condSize: el.querySelector('#pk-cond-size'),
        btnDupDate: el.querySelector('#pk-dup-date'), condDate: el.querySelector('#pk-cond-date'),
        btnBack: el.querySelector('#pk-nav-back'), btnFwd: el.querySelector('#pk-nav-fwd'),
        btnCopy: el.querySelector('#pk-copy'), btnCut: el.querySelector('#pk-cut'),
        btnDel: el.querySelector('#pk-del'), btnDeselect: el.querySelector('#pk-deselect'),
        btnRename: el.querySelector('#pk-rename'), btnBulkRename: el.querySelector('#pk-bulkrename'), btnPaste: el.querySelector('#pk-paste'),
        btnRefresh: el.querySelector('#pk-refresh'), btnNewFolder: el.querySelector('#pk-newfolder'),
        btnSettings: el.querySelector('#pk-settings'), btnClose: el.querySelector('#pk-close'),
        btnHelp: el.querySelector('#pk-help'),
        btnExt: el.querySelector('#pk-ext'), btnIdm: el.querySelector('#pk-idm'),
        btnLinkCopy: el.querySelector('#pk-link-copy'), btnViewToggle: el.querySelector('#pk-view-toggle'),
        pop: el.querySelector('#pk-pop'), ctx: el.querySelector('#pk-ctx'), cols: el.querySelectorAll('.pk-col'),
        searchInput: el.querySelector('#pk-search-input')
    };

    function showModal(html) {
        const m = document.createElement('div'); m.className = 'pk-modal-ov';
        m.innerHTML = `<div class="pk-modal"><div class="pk-modal-close">${CONF.icons.close}</div>${html}</div>`;
        UI.win.appendChild(m);
        m.querySelector('.pk-modal-close').addEventListener('click', () => m.remove());
        return m;
    }

    function showToast(msg) {
        const box = el.querySelector('#pk-toast-box');
        const t = document.createElement('div');
        t.className = 'pk-toast';
        t.innerHTML = `<span>✅</span><span>${esc(msg)}</span>`;
        box.appendChild(t);
        setTimeout(() => t.remove(), 3000);
    }

    function showAlert(msg, title = L.title_alert) {
        return new Promise((resolve) => {
            const m = showModal(`
                <h3>${title}</h3>
                <div style="margin:20px 0;line-height:1.5;">${esc(msg).replace(/\n/g, '<br>')}</div>
                <div class="pk-modal-act">
                    <button class="pk-btn pri" id="alert_ok">${L.btn_ok}</button>
                </div>
            `);
            m.querySelector('#alert_ok').onclick = () => { m.remove(); resolve(); };
            m.querySelector('.pk-modal-close').onclick = () => { m.remove(); resolve(); };
        });
    }

    function showConfirm(msg, title = L.title_confirm) {
        return new Promise((resolve) => {
            const m = showModal(`
                <h3>${title}</h3>
                <div style="margin:20px 0;line-height:1.5;">${esc(msg).replace(/\n/g, '<br>')}</div>
                <div class="pk-modal-act">
                    <button class="pk-btn" id="cfm_no">${L.btn_no}</button>
                    <button class="pk-btn pri" id="cfm_yes">${L.btn_yes}</button>
                </div>
            `);
            m.querySelector('#cfm_no').onclick = () => { m.remove(); resolve(false); };
            m.querySelector('#cfm_yes').onclick = () => { m.remove(); resolve(true); };
            m.querySelector('.pk-modal-close').onclick = () => { m.remove(); resolve(false); };
        });
    }

    function showPrompt(msg, val = '', title = L.title_prompt) {
        return new Promise((resolve) => {
            const m = showModal(`
                <h3>${title}</h3>
                <div style="margin-bottom:10px;">${esc(msg)}</div>
                <div class="pk-field"><input type="text" id="prm_input" value="${esc(val)}"></div>
                <div class="pk-modal-act">
                    <button class="pk-btn" id="prm_cancel">${L.btn_cancel}</button>
                    <button class="pk-btn pri" id="prm_ok">${L.btn_ok}</button>
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

    function setLoad(b) { S.loading = b; UI.loader.style.display = b ? 'flex' : 'none'; if (b) UI.loadTxt.textContent = L.loading_detail; }
    function updateLoadTxt(txt) { if (UI.loadTxt) UI.loadTxt.innerText = txt; }
    function updateNavState() {
        UI.btnBack.disabled = (S.history.length === 0 && S.path.length <= 1);
        UI.btnFwd.disabled = S.forward.length === 0;
    }

    async function load(isHistoryNav = false) {
        if (S.loading) return;
        setLoad(true);
        S.search = ''; if (UI.searchInput) UI.searchInput.value = '';
        const cur = S.path[S.path.length - 1];
        updateNavState();
        UI.scan.style.display = 'flex'; UI.dup.style.display = 'none'; UI.dupTools.style.display = 'none';
        S.dupMode = false; S.lastSelIdx = -1;
        renderCrumb();
        try {
            if (!S.scanning) {
                updateLoadTxt(L.loading_detail);
                S.items = await apiList(cur.id, 1000, (cnt) => { updateLoadTxt(L.loading_fetch.replace('{n}', cnt)); });
                refresh();
            }
        } catch (e) { console.error(e); showAlert("Failed to load: " + e.message); }
        finally { setLoad(false); }
        el.focus();
    }

    async function refresh() {
        if (S.search) {
            const q = S.search.toLowerCase();
            S.display = S.items.filter(i => i.name.toLowerCase().includes(q));
        } else {
            S.display = [...S.items];
        }

        S.dupReasons.clear(); S.dupGroups.clear();

        if (S.dupMode) {
            setLoad(true); S.dupRunning = true; UI.stopBtn.onclick = () => { S.dupRunning = false; };
            updateLoadTxt(L.loading_dup.replace('{p}', 0)); await sleep(50);
            const videos = S.display.filter(i => i.mime_type && i.mime_type.startsWith('video'));
            videos.sort((a, b) => a.name.length - b.name.length);
            const clean = (name) => name.replace(/\.[^/.]+$/, "").toLowerCase().trim();
            const assigned = new Set(); const groups = []; const chunkSize = 50;

            for (let i = 0; i < videos.length; i++) {
                if (!S.dupRunning) break;
                if (i % chunkSize === 0) { updateLoadTxt(L.loading_dup.replace('{p}', Math.round((i / videos.length) * 100))); await sleep(0); }
                if (assigned.has(videos[i].id)) continue;
                const root = videos[i]; const rootName = clean(root.name); const rootHash = root.gcid || root.md5_checksum || root.hash; const rootDur = parseFloat(root.params?.duration || 0);
                const group = { items: [root], type: '' }; assigned.add(root.id);

                for (let j = i + 1; j < videos.length; j++) {
                    if (assigned.has(videos[j].id)) continue;
                    const target = videos[j]; let isDup = false; let type = '';
                    const targetHash = target.gcid || target.md5_checksum || target.hash;
                    if (rootHash && targetHash && rootHash === targetHash && root.size === target.size) { isDup = true; type = L.tag_hash; }
                    if (!isDup) {
                        const targetName = clean(target.name);
                        if (rootName === targetName) { isDup = true; type = L.tag_name; }
                        else if (rootDur > 0) { if (Math.abs(rootDur - parseFloat(target.params?.duration || 0)) <= 1.0 && (targetName.includes(rootName) || rootName.includes(targetName))) { isDup = true; type = L.tag_sim; } }
                    }
                    if (isDup) { group.items.push(target); if (!group.type) group.type = type; assigned.add(target.id); S.dupReasons.set(target.id, type); }
                }
                if (group.items.length > 1) { groups.push(group.items.map(i => i.id)); if (!S.dupReasons.has(root.id)) S.dupReasons.set(root.id, group.type); }
            }
            const newDisplay = [];
            groups.forEach((ids, gIdx) => {
                ids.forEach(id => S.dupGroups.set(id, gIdx));
                const firstId = ids[0]; const firstItem = S.items.find(x => x.id === firstId);
                newDisplay.push({ id: `grp_${gIdx}`, isHeader: true, name: firstItem ? firstItem.name : `Group ${gIdx}`, count: ids.length, type: S.dupReasons.get(firstId) || "Group" });
                ids.forEach(id => { const item = S.items.find(x => x.id === id); if (item) newDisplay.push(item); });
            });
            S.display = newDisplay; S.dupRunning = false; setLoad(false); UI.dupTools.style.display = 'flex';
        } else {
            UI.dupTools.style.display = 'none';
            S.display.sort((a, b) => {
                if (a.kind !== b.kind) return a.kind === 'drive#folder' ? -1 : 1;
                let va = a[S.sort], vb = b[S.sort];
                if (S.sort === 'size') { va = parseInt(va || 0); vb = parseInt(vb || 0); }
                else if (S.sort === 'duration') { va = parseInt(a.params?.duration || 0); vb = parseInt(b.params?.duration || 0); }
                if (va > vb) return S.dir; if (va < vb) return -S.dir; return 0;
            });
        }
        const currentIds = new Set(S.display.filter(x => !x.isHeader).map(i => i.id));
        for (let id of S.sel) { if (!currentIds.has(id)) S.sel.delete(id); }
        if (S.sel.size === 0) UI.chkAll.checked = false;

        render(); // 통합 렌더 호출
        updateStat();
    }

    function render() {
        if (S.view === 'list') {
            const hd = UI.win.querySelector('.pk-grid-hd');
            if (hd) hd.classList.remove('hidden');
            UI.in.className = 'pk-in';
            renderList();
        } else {
            const hd = UI.win.querySelector('.pk-grid-hd');
            if (hd) hd.classList.add('hidden');
            UI.in.className = 'pk-grid-con';
            renderGrid();
        }
    }

    function renderList() {
        UI.in.style.height = `${S.display.length * CONF.rowHeight}px`;
        UI.cols.forEach(c => { c.querySelector('span').textContent = (c.dataset.k === S.sort) ? (S.dir === 1 ? ' ▲' : ' ▼') : ''; c.style.color = (c.dataset.k === S.sort) ? 'var(--pk-pri)' : ''; });
        requestAnimationFrame(renderVisibleList);
    }

    function renderVisibleList() {
        if (S.view !== 'list') return;
        const top = UI.vp.scrollTop; const h = UI.vp.clientHeight;
        const start = Math.max(0, Math.floor(top / CONF.rowHeight) - CONF.buffer);
        const end = Math.min(S.display.length, Math.ceil((top + h) / CONF.rowHeight) + CONF.buffer);
        UI.in.innerHTML = '';
        for (let i = start; i < end; i++) {
            const d = S.display[i]; if (!d) continue;
            const row = document.createElement('div'); row.style.position = 'absolute'; row.style.top = `${i * CONF.rowHeight}px`; row.style.width = '100%';
            if (d.isHeader) {
                row.className = 'pk-group-hd'; row.innerHTML = `<div style="display:flex; align-items:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;"><span style="margin-right:8px;">📁</span><span>${esc(d.name)}</span></div><div style="margin-left:auto; display:flex; align-items:center;"><span class="pk-tag">${d.type}</span><span class="pk-cnt">${d.count}</span></div>`;
            } else {
                const isSel = S.sel.has(d.id); row.className = `pk-row ${isSel ? 'sel' : ''}`;
                const durVal = d.params?.duration || d.medias?.[0]?.duration || d.video_media_metadata?.duration || '';

                row.innerHTML = `
                    <div><input type="checkbox" ${isSel ? 'checked' : ''}></div>
                    <div class="pk-name" title="${esc(d.name)}">
                        ${getIcon(d)}
                        <span>${esc(d.name)}</span>
                    </div>
                    <div>${d.kind === 'drive#folder' ? '' : fmtSize(d.size)}</div>
                    <div>${fmtDur(durVal)}</div>
                    <div style="color:#888">${fmtDate(d.modified_time)}</div>
                `;

                const chk = row.querySelector('input');
                row.onclick = (e) => { if (S.loading) return; if (e.shiftKey && S.lastSelIdx !== -1) { const startIdx = Math.min(S.lastSelIdx, i); const endIdx = Math.max(S.lastSelIdx, i); for (let k = startIdx; k <= endIdx; k++) { if (!S.display[k].isHeader) S.sel.add(S.display[k].id); } } else { if (e.target !== chk) chk.checked = !chk.checked; if (chk.checked) S.sel.add(d.id); else S.sel.delete(d.id); S.lastSelIdx = i; } renderList(); updateStat(); };
                row.ondblclick = (e) => { e.preventDefault(); if (S.loading) return; if (d.kind === 'drive#folder') { S.history.push({ path: [...S.path] }); S.path.push({ id: d.id, name: d.name }); S.forward = []; load(); } else if (d.mime_type?.startsWith('video')) playVideo(d); };
                row.oncontextmenu = (e) => { e.preventDefault(); if (!S.sel.has(d.id)) { S.sel.clear(); S.sel.add(d.id); S.lastSelIdx = i; renderList(); updateStat(); } UI.ctx.style.display = 'block'; let x = e.clientX; let y = e.clientY; const w = UI.ctx.offsetWidth || 150; const h = UI.ctx.offsetHeight || 200; if (x + w > window.innerWidth) x = window.innerWidth - w - 10; if (y + h > window.innerHeight) y = window.innerHeight - h - 10; UI.ctx.style.left = x + 'px'; UI.ctx.style.top = y + 'px'; };
                row.onmouseenter = (e) => { if (d.thumbnail_link && !S.loading) { UI.pop.innerHTML = `<img src="${d.thumbnail_link}">`; UI.pop.style.display = 'block'; const r = UI.pop.getBoundingClientRect(); let t = e.clientY + 15; if (t + r.height > window.innerHeight) t = e.clientY - r.height - 10; UI.pop.style.top = t + 'px'; UI.pop.style.left = (e.clientX + 15) + 'px'; } };
                row.onmouseleave = () => UI.pop.style.display = 'none';
            }
            UI.in.appendChild(row);
        }
    }
    UI.vp.onscroll = () => {
        if (S.view === 'list') renderVisibleList();
        else renderGrid();
    };

    function renderGrid() {
        if (S.view !== 'grid') return;

        const gap = 10;
        const padding = 10;
        const cardH = 200;
        const containerW = UI.vp.clientWidth - (padding * 2);
        const minCardW = 140;
        const cols = Math.floor((containerW + gap) / (minCardW + gap)) || 1;
        const cardW = (containerW - (cols - 1) * gap) / cols;

        const visibleItems = S.display.filter(d => !d.isHeader);
        const totalRows = Math.ceil(visibleItems.length / cols);
        UI.in.style.height = `${totalRows * (cardH + gap)}px`;

        requestAnimationFrame(() => renderVisibleGrid(visibleItems, cols, cardW, cardH, gap));
    }

    function renderVisibleGrid(items, cols, cardW, cardH, gap) {
        if (S.view !== 'grid') return;

        const top = UI.vp.scrollTop;
        const h = UI.vp.clientHeight;
        const startRow = Math.max(0, Math.floor(top / (cardH + gap)) - 2);
        const endRow = Math.min(Math.ceil(items.length / cols), Math.ceil((top + h) / (cardH + gap)) + 2);

        UI.in.innerHTML = '';

        for (let r = startRow; r < endRow; r++) {
            for (let c = 0; c < cols; c++) {
                const idx = r * cols + c;
                if (idx >= items.length) break;

                const d = items[idx];
                const isSel = S.sel.has(d.id);
                const card = document.createElement('div');
                card.className = `pk-card ${isSel ? 'sel' : ''}`;

                card.style.width = `${cardW}px`;
                card.style.height = `${cardH}px`;
                card.style.left = `${10 + c * (cardW + gap)}px`;
                card.style.top = `${10 + r * (cardH + gap)}px`;

                let thumbContent = getIcon(d);
                if (d.kind !== 'drive#folder' && d.thumbnail_link) {
                    thumbContent = `<img src="${d.thumbnail_link}" loading="lazy" decoding="async">`;
                }

                card.innerHTML = `
                    <input type="checkbox" class="pk-card-chk" ${isSel ? 'checked' : ''}>
                    <div class="pk-card-thumb">${thumbContent}</div>
                    <div class="pk-card-name" title="${esc(d.name)}">${esc(d.name)}</div>
                    <div class="pk-card-info">
                        <span>${d.kind === 'drive#folder' ? '' : fmtSize(d.size)}</span>
                        <span>${d.params?.duration ? fmtDur(d.params.duration) : ''}</span>
                    </div>
                `;

                const chk = card.querySelector('input');
                card.onclick = (e) => {
                    if (S.loading) return;
                    if (e.target !== chk) chk.checked = !chk.checked;
                    if (chk.checked) S.sel.add(d.id); else S.sel.delete(d.id);
                    S.lastSelIdx = idx;
                    if (chk.checked) card.classList.add('sel'); else card.classList.remove('sel');
                    updateStat();
                };
                card.ondblclick = (e) => {
                    e.preventDefault();
                    if (S.loading) return;
                    if (d.kind === 'drive#folder') { S.history.push({ path: [...S.path] }); S.path.push({ id: d.id, name: d.name }); S.forward = []; load(); }
                    else if (d.mime_type?.startsWith('video')) playVideo(d);
                };
                card.oncontextmenu = (e) => {
                    e.preventDefault();
                    if (!S.sel.has(d.id)) { S.sel.clear(); S.sel.add(d.id); card.classList.add('sel'); updateStat(); }
                    UI.ctx.style.display = 'block';
                    let x = e.clientX; let y = e.clientY;
                    UI.ctx.style.left = x + 'px'; UI.ctx.style.top = y + 'px';
                };

                UI.in.appendChild(card);
            }
        }
    }

    function renderCrumb() {
        UI.crumb.innerHTML = '';
        S.path.forEach((p, i) => {
            const s = document.createElement('span'); s.textContent = p.name; s.className = i === S.path.length - 1 ? 'act' : '';
            s.onclick = () => { if (i !== S.path.length - 1 && !S.loading) { S.history.push({ path: [...S.path] }); S.forward = []; S.path = S.path.slice(0, i + 1); load(); } };
            UI.crumb.appendChild(s); if (i < S.path.length - 1) UI.crumb.appendChild(document.createTextNode(' › '));
        });
    }

    const goBack = async () => {
        if (S.loading) return;
        if (S.history.length > 0) { S.forward.push([...S.path]); const prevState = S.history.pop(); S.path = prevState.path; load(true); return; }
        if (S.path.length > 1) { S.forward.push([...S.path]); S.path = S.path.slice(0, S.path.length - 1); load(true); return; }
        if (S.path.length === 1 && S.history.length === 0) { if (await showConfirm(L.msg_exit_confirm)) { el.remove(); } }
    };
    const goForward = () => { if (S.forward.length > 0 && !S.loading) { S.history.push({ path: [...S.path] }); const nextPath = S.forward.pop(); S.path = nextPath; load(); } };

    el.tabIndex = 0; el.focus();
    const keyHandler = (e) => {
        if (!document.querySelector('.pk-ov')) return;
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
        if (e.key === 'Escape') { const player = document.getElementById('pk-player-ov'); if (player) { player.remove(); return; } const openModal = document.querySelector('.pk-modal-ov'); if (openModal) { openModal.remove(); return; } if (UI.ctx.style.display === 'block') UI.ctx.style.display = 'none'; else if (S.sel.size > 0) { S.sel.clear(); refresh(); } else if (S.path.length === 1) el.remove(); return; }
        if (e.key === 'F2') { e.preventDefault(); if (S.sel.size === 1) UI.btnRename.click(); else if (S.sel.size > 1) UI.btnBulkRename.click(); }
        if (e.key === 'F5') { e.preventDefault(); UI.btnRefresh.click(); }
        if (e.key === 'F8') { e.preventDefault(); UI.btnNewFolder.click(); }
        if (e.key === 'Delete') { UI.btnDel.click(); }
        if (e.key === 'Backspace') { e.preventDefault(); if (e.shiftKey) { if (!S.scanning) goForward(); } else { if (!S.scanning) goBack(); } return; }
        if (e.altKey && e.key === 'ArrowLeft') { e.preventDefault(); goBack(); return; }
        if (e.altKey && e.key === 'ArrowRight') { e.preventDefault(); goForward(); return; }
        if (e.ctrlKey || e.metaKey) { if (e.key === 'a' || e.key === 'A') { e.preventDefault(); UI.chkAll.click(); } if (e.key === 'c' || e.key === 'C') { e.preventDefault(); UI.btnCopy.click(); } if (e.key === 'x' || e.key === 'X') { e.preventDefault(); UI.btnCut.click(); } if (e.key === 'v' || e.key === 'V') { e.preventDefault(); UI.btnPaste.click(); } }
        if (e.altKey) { if (e.key === 's' || e.key === 'S') { e.preventDefault(); UI.btnSettings.click(); } }
    };
    document.addEventListener('keydown', keyHandler);
    const mouseHandler = (e) => { if (!document.querySelector('.pk-ov')) return; if (e.button === 3) { e.preventDefault(); e.stopPropagation(); goBack(); } if (e.button === 4) { e.preventDefault(); e.stopPropagation(); goForward(); } if (UI.ctx.style.display === 'block' && !UI.ctx.contains(e.target)) UI.ctx.style.display = 'none'; };
    document.addEventListener('mouseup', mouseHandler);

    function updateStat() {
        const n = S.sel.size; UI.stat.textContent = n > 0 ? L.sel_count.replace('{n}', n) : L.status_ready.replace('{n}', S.display.length); const hasSel = n > 0;
        UI.btnCopy.disabled = !hasSel; UI.btnCut.disabled = !hasSel; UI.btnDel.disabled = !hasSel; UI.btnRename.disabled = n !== 1; UI.btnBulkRename.disabled = n < 2; UI.btnSettings.disabled = false; UI.btnDeselect.style.display = hasSel ? 'inline-flex' : 'none';
        if (UI.btnLinkCopy) UI.btnLinkCopy.disabled = !hasSel;
    }

    async function getLinks() { const res = []; for (const id of S.sel) { let item = S.items.find(x => x.id === id); if (item && !item.web_content_link) { try { item = await apiGet(id); } catch { } } if (item?.web_content_link) res.push(item); } return res; }
    async function playVideo(item) {
        let link = item.web_content_link; if (!link) { try { const m = await apiGet(item.id); link = m.web_content_link; } catch (e) { console.error(e); } }
        if (!link) { showAlert(L.msg_video_fail || "Cannot fetch video link."); return; }
        const d = document.createElement('div'); d.id = 'pk-player-ov'; d.tabIndex = 0;
        d.innerHTML = `<div style="position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,0.95);backdrop-filter:blur(5px);display:flex;justify-content:center;align-items:center;"><div style="width:95vw;height:95vh;max-width:1600px;background:#000;border-radius:8px;box-shadow:0 20px 60px rgba(0,0,0,0.8);display:flex;flex-direction:column;overflow:hidden;border:1px solid #333;"><div style="flex:0 0 40px;background:#1a1a1a;padding:0 20px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #333;"><span style="color:#ddd;font-weight:600;font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(item.name)}</span><button class="pk-close-btn" style="color:#aaa;background:none;border:none;font-size:24px;cursor:pointer;width:30px;height:30px;display:flex;align-items:center;justify-content:center;">×</button></div><div style="flex:1;background:#000;position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden;"><video src="${link}" controls autoplay playsinline preload="auto" style="width:100%;height:100%;object-fit:contain;outline:none;" onerror="alert('Video Load Failed. Link might be restricted.');"></video></div></div><style>.pk-close-btn:hover{color:#fff}</style></div>`;
        document.body.appendChild(d); d.focus(); d.onkeydown = (e) => { if (e.key === 'Escape') { d.remove(); e.stopPropagation(); } }; d.querySelector('.pk-close-btn').onclick = () => d.remove(); d.onclick = (e) => { if (e.target === d.firstElementChild) d.remove(); };
    }

    if (UI.searchInput) {
        UI.searchInput.oninput = (e) => { S.search = e.target.value.trim(); refresh(); };
        UI.searchInput.onkeydown = (e) => { e.stopPropagation(); };
    }

    UI.btnHelp.onclick = () => {
        const m = showModal(`
            <h3>${L.modal_help_title}</h3>
            ${L.help_desc}
            <div class="pk-modal-act" style="margin-top:20px;">
                <button class="pk-btn pri" id="help_close" style="width:100%; justify-content:center; height:40px;">닫기</button>
            </div>
        `);
        m.querySelector('#help_close').onclick = () => m.remove();
    };

    UI.scan.onclick = async () => { if (S.scanning) { S.scanning = false; return; } if (!await showConfirm(L.msg_flatten_warn)) return; S.scanning = true; UI.stopBtn.onclick = () => { S.scanning = false; }; const root = S.path[S.path.length - 1]; let q = [{ id: root.id, name: root.name }]; let all = []; setLoad(true); try { while (q.length && S.scanning) { const curr = q.shift(); const pid = curr.id; updateLoadTxt(L.status_scanning.replace('{n}', all.length).replace('{f}', curr.name) + "\n" + L.loading_detail); const files = await apiList(pid, 500, (currentCount) => { updateLoadTxt(L.status_scanning.replace('{n}', all.length + currentCount).replace('{f}', curr.name)); }); for (const f of files) { if (f.kind === 'drive#folder') q.push({ id: f.id, name: f.name }); else all.push(f); } await sleep(20); } if (S.scanning) { S.items = all; UI.dup.style.display = 'flex'; refresh(); } } catch (e) { showAlert("Error: " + e.message); } finally { S.scanning = false; setLoad(false); updateStat(); } };
    UI.dup.onclick = async () => { if (!S.dupMode) if (!await showConfirm(L.msg_dup_warn)) return; S.dupMode = !S.dupMode; UI.dup.style.backgroundColor = S.dupMode ? '#444' : ''; UI.dup.style.color = S.dupMode ? '#fff' : ''; UI.dup.style.borderColor = S.dupMode ? '#666' : ''; refresh(); };
    UI.btnDupSize.onclick = () => { S.dupSizeStrategy = S.dupSizeStrategy === 'small' ? 'large' : 'small'; UI.condSize.textContent = `(${S.dupSizeStrategy === 'small' ? L.cond_small : L.cond_large})`; S.sel.clear(); const itemMap = new Map(); S.display.forEach(d => { if (d.isHeader) return; const gIdx = S.dupGroups.get(d.id); if (gIdx !== undefined) { if (!itemMap.has(gIdx)) itemMap.set(gIdx, []); itemMap.get(gIdx).push(d); } }); itemMap.forEach(items => { if (items.length < 2) return; let keep = (S.dupSizeStrategy === 'small') ? items.reduce((a, b) => parseInt(a.size) > parseInt(b.size) ? a : b) : items.reduce((a, b) => parseInt(a.size) < parseInt(b.size) ? a : b); items.forEach(i => { if (i.id !== keep.id) S.sel.add(i.id); }); }); render(); updateStat(); };
    UI.btnDupDate.onclick = () => { S.dupDateStrategy = S.dupDateStrategy === 'old' ? 'new' : 'old'; UI.condDate.textContent = `(${S.dupDateStrategy === 'old' ? L.cond_old : L.cond_new})`; S.sel.clear(); const itemMap = new Map(); S.display.forEach(d => { if (d.isHeader) return; const gIdx = S.dupGroups.get(d.id); if (gIdx !== undefined) { if (!itemMap.has(gIdx)) itemMap.set(gIdx, []); itemMap.get(gIdx).push(d); } }); itemMap.forEach(items => { if (items.length < 2) return; let keep = (S.dupDateStrategy === 'old') ? items.reduce((a, b) => new Date(a.modified_time) > new Date(b.modified_time) ? a : b) : items.reduce((a, b) => new Date(a.modified_time) < new Date(b.modified_time) ? a : b); items.forEach(i => { if (i.id !== keep.id) S.sel.add(i.id); }); }); render(); updateStat(); };
    UI.cols.forEach(c => c.onclick = () => { const k = c.dataset.k; if (S.sort === k) S.dir *= -1; else { S.sort = k; S.dir = 1; } refresh(); });
    UI.chkAll.onclick = (e) => { if (e.target.checked) S.display.forEach(i => S.sel.add(i.id)); else S.sel.clear(); render(); updateStat(); };
    UI.btnBack.onclick = goBack; UI.btnFwd.onclick = goForward; UI.btnRefresh.onclick = () => load();
    UI.btnNewFolder.onclick = async () => { const name = await showPrompt(L.msg_newfolder_prompt, ''); if (!name) return; const cur = S.path[S.path.length - 1]; try { await fetch('https://api-drive.mypikpak.com/drive/v1/files', { method: 'POST', headers: getHeaders(), body: JSON.stringify({ kind: 'drive#folder', parent_id: cur.id || '', name: name }) }); load(); } catch (e) { showAlert('Error: ' + e.message); } };
    UI.btnCopy.onclick = () => { if (S.sel.size === 0) return; S.clipItems = Array.from(S.sel); S.clipType = 'copy'; S.clipSourceParentId = S.path[S.path.length - 1].id || ''; UI.btnPaste.disabled = false; showToast(L.msg_copy_done); };
    UI.btnCut.onclick = () => { if (S.sel.size === 0) return; S.clipItems = Array.from(S.sel); S.clipType = 'move'; S.clipSourceParentId = S.path[S.path.length - 1].id || ''; UI.btnPaste.disabled = false; showToast(L.msg_cut_done); };
    UI.btnPaste.onclick = async () => { if (!S.clipItems || S.clipItems.length === 0) { showAlert(L.msg_paste_empty); return; } setLoad(true); const dest = S.path[S.path.length - 1].id || ''; if (S.clipSourceParentId === dest) { showAlert(L.msg_paste_same_folder); setLoad(false); return; } const ids = S.clipItems.slice(); const endpoint = S.clipType === 'move' ? 'https://api-drive.mypikpak.com/drive/v1/files:batchMove' : 'https://api-drive.mypikpak.com/drive/v1/files:batchCopy'; try { await fetch(endpoint, { method: 'POST', headers: getHeaders(), body: JSON.stringify({ ids: ids, to: { parent_id: dest } }) }); S.clipItems = []; S.clipType = ''; UI.btnPaste.disabled = true; await sleep(500); setLoad(false); await load(); } catch (e) { showAlert('Paste error: ' + e.message); setLoad(false); } };
    UI.btnRename.onclick = async () => { if (S.sel.size !== 1) return; const id = Array.from(S.sel)[0]; const item = S.items.find(i => i.id === id); if (!item) return; const m = showModal(`<h3>${L.modal_rename_title}</h3><div class="pk-field"><input type="text" id="rn_new_name" value="${esc(item.name)}"></div><div class="pk-modal-act"><button class="pk-btn" id="rn_cancel">${L.btn_cancel}</button><button class="pk-btn pri" id="rn_confirm">${L.btn_confirm}</button></div>`); const inp = m.querySelector('#rn_new_name'); inp.focus(); if (item.kind !== 'drive#folder' && item.name.lastIndexOf('.') > 0) inp.setSelectionRange(0, item.name.lastIndexOf('.')); else inp.select(); const doRename = async () => { const newName = inp.value.trim(); if (!newName || newName === item.name) { m.remove(); return; } if (S.items.some(i => i.name === newName)) { showAlert(L.msg_name_exists.replace('{n}', newName)); return; } m.remove(); try { setLoad(true); await apiAction(`/${id}`, { name: newName }); await sleep(200); setLoad(false); load(); } catch (e) { showAlert("Error: " + e.message); setLoad(false); } }; m.querySelector('#rn_cancel').onclick = () => m.remove(); m.querySelector('#rn_confirm').onclick = doRename; inp.onkeydown = (e) => { if (e.key === 'Enter') doRename(); if (e.key === 'Escape') { m.remove(); e.stopPropagation(); } }; };
    UI.btnBulkRename.onclick = () => { if (S.sel.size < 2) return; const m = showModal(`<h3>${L.modal_rename_multi_title}</h3><div class="pk-field"><label><input type="radio" name="rn_mode" value="pattern" checked> ${L.label_pattern}</label><input type="text" id="rn_pattern" value="Video {n}" placeholder="Video {n}"></div><div class="pk-field" style="margin-top:10px"><label><input type="radio" name="rn_mode" value="replace"> ${L.label_replace} <span style="font-size:11px;color:#888">${L.label_replace_note}</span></label><input type="text" id="rn_find" placeholder="${L.placeholder_find}" disabled><input type="text" id="rn_rep" placeholder="${L.placeholder_replace}" disabled></div><div class="pk-modal-act"><button class="pk-btn" id="rn_cancel">${L.btn_cancel}</button><button class="pk-btn pri" id="rn_preview">${L.btn_preview}</button></div>`); const radios = m.querySelectorAll('input[name="rn_mode"]'); const inpPattern = m.querySelector('#rn_pattern'); const inpFind = m.querySelector('#rn_find'); const inpRep = m.querySelector('#rn_rep'); radios.forEach(r => r.onchange = () => { const isPat = r.value === 'pattern'; inpPattern.disabled = !isPat; inpFind.disabled = isPat; inpRep.disabled = isPat; }); m.querySelector('#rn_cancel').onclick = () => m.remove(); m.querySelector('#rn_preview').onclick = () => { const mode = m.querySelector('input[name="rn_mode"]:checked').value; const pattern = inpPattern.value; const findStr = inpFind.value; const repStr = inpRep.value || ''; let idx = 1; const changes = []; const existingNames = new Set(S.items.map(i => i.name)); for (const id of S.sel) { const item = S.items.find(x => x.id === id); if (!item) continue; let base = item.name; let ext = ""; if (item.kind !== 'drive#folder' && item.name.lastIndexOf('.') > 0) { base = item.name.substring(0, item.name.lastIndexOf('.')); ext = item.name.substring(item.name.lastIndexOf('.')); } let newBase = base; if (mode === 'pattern') { if (pattern) newBase = pattern.replace(/\{n\}/g, idx++); } else { if (findStr && base.includes(findStr)) newBase = base.split(findStr).join(repStr); } const finalName = newBase + ext; if (finalName !== item.name) { if (existingNames.has(finalName)) { showAlert(L.msg_name_exists.replace('{n}', finalName)); return; } changes.push({ id: item.id, old: item.name, new: finalName }); } } m.remove(); if (changes.length === 0) { showAlert("No changes detected."); return; } let rowsHtml = changes.map(c => `<div class="pk-prev-row"><div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(c.old)}</div><div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--pk-pri)">${esc(c.new)}</div></div>`).join(''); const p = showModal(`<h3>${L.modal_preview_title} (${changes.length})</h3><div class="pk-prev-list"><div class="pk-prev-row" style="font-weight:bold;background:#eee"><div>${L.col_old}</div><div>${L.col_new}</div></div>${rowsHtml}</div><div class="pk-modal-act"><button class="pk-btn" id="pr_cancel">${L.btn_cancel}</button><button class="pk-btn pri" id="pr_confirm">${L.btn_confirm}</button></div>`); p.querySelector('#pr_cancel').onclick = () => p.remove(); p.querySelector('#pr_confirm').onclick = async () => { setLoad(true); let count = 0; try { for (const c of changes) { await apiAction(`/${c.id}`, { name: c.new }); count++; await sleep(50); } showAlert(L.msg_bulkrename_done.replace('{n}', count)); load(); } catch (e) { showAlert("Rename Error: " + e.message); } finally { setLoad(false); p.remove(); } }; }; };
    UI.btnExt.onclick = async () => { const player = gmGet('pk_ext_player', 'system'); const files = await getLinks(); if (!files || files.length === 0) { showAlert(L.msg_download_fail); return; } if (S.sel.size > 1) { let m3u = '#EXTM3U\n'; files.forEach(f => { m3u += `#EXTINF:-1,${f.name}\n${f.web_content_link}\n`; }); const blob = new Blob([m3u], { type: 'audio/x-mpegurl' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `pikpak_playlist_${Date.now()}.m3u`; a.click(); showAlert(L.msg_batch_m3u); } else { const f = files[0]; if (player === 'system') window.open(f.web_content_link, '_blank'); else window.open((player === 'potplayer' ? 'potplayer://' : 'vlc://') + f.web_content_link, '_self'); } };
    UI.btnIdm.onclick = async () => { const files = await getLinks(); if (!files || files.length === 0) { showAlert(L.msg_download_fail); return; } if (S.sel.size > 1) { let ef2 = ''; files.forEach(f => { ef2 += `<\r\n${f.web_content_link}\r\nfilename=${f.name}\r\n>\r\n`; }); const blob = new Blob([ef2], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `pikpak_idm_${Date.now()}.ef2`; a.click(); showAlert(L.msg_batch_ef2); } else { window.open(files[0].web_content_link, '_blank'); } };
    UI.win.querySelector('#pk-down').onclick = async () => { const files = await getLinks(); if (!files || files.length === 0) { showAlert(L.msg_download_fail); return; } for (const f of files) { const a = document.createElement('a'); a.href = f.web_content_link; document.body.appendChild(a); a.click(); a.remove(); await sleep(200); } };
    UI.win.querySelector('#pk-aria2').onclick = async () => { const files = await getLinks(); if (!files.length) { showAlert(L.msg_download_fail); return; } const ariaUrl = gmGet('pk_aria2_url', 'ws://localhost:6800/jsonrpc'); const ariaToken = gmGet('pk_aria2_token', ''); const payload = files.map(f => ({ jsonrpc: '2.0', method: 'aria2.addUri', id: f.id, params: [`token:${ariaToken}`, [f.web_content_link], { out: f.name }] })); try { await fetch(ariaUrl, { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } }); showAlert(L.msg_aria2_sent.replace('{n}', files.length)); } catch (e) { showAlert('Aria2 Error. Check Settings.'); } };
    UI.btnDel.onclick = async () => { if (!S.sel.size) return; if (await showConfirm(L.warn_del.replace('{n}', S.sel.size))) { await fetch(`https://api-drive.mypikpak.com/drive/v1/files:batchTrash`, { method: 'POST', headers: getHeaders(), body: JSON.stringify({ ids: Array.from(S.sel) }) }); await sleep(500); if (!S.scanning) load(); else { S.items = S.items.filter(i => !S.sel.has(i.id)); refresh(); } } };
    UI.btnDeselect.onclick = () => { S.sel.clear(); refresh(); };

    if (UI.btnViewToggle) {
        UI.btnViewToggle.onclick = () => {
            S.view = S.view === 'list' ? 'grid' : 'list';
            gmSet('pk_view_mode', S.view);
            UI.btnViewToggle.innerHTML = S.view === 'list' ? CONF.icons.grid_view : CONF.icons.list_view;
            UI.btnViewToggle.title = S.view === 'list' ? L.btn_view_grid : L.btn_view_list;
            render();
        };
    }

    if (UI.btnLinkCopy) {
        UI.btnLinkCopy.onclick = async () => {
            if (S.sel.size === 0) { showToast(L.msg_no_selection || "선택된 항목이 없습니다."); return; }
            setLoad(true);
            try {
                const links = await getLinks();
                if (!links.length) { showToast(L.msg_download_fail); return; }

                const text = links.map(f => f.web_content_link).join('\n');

                if (typeof GM_setClipboard !== 'undefined') {
                    GM_setClipboard(text);
                } else {
                    await navigator.clipboard.writeText(text);
                }
                showToast(L.msg_link_copied.replace('{n}', links.length));
            } catch (e) {
                console.error(e);
                showToast("복사 실패");
            } finally {
                setLoad(false);
            }
        };
    }

    UI.btnSettings.onclick = () => {
        const curLang = gmGet('pk_lang', lang);
        const curPlayer = gmGet('pk_ext_player', 'system');

        const curAriaUrl = gmGet('pk_aria2_url', '');
        const curAriaToken = gmGet('pk_aria2_token', '');

        const m = showModal(`
            <h3>
                ${L.modal_settings_title}
                <div style="font-size:11px;color:#888;font-weight:normal;margin-top:4px;">PikPak File Manager v${version}</div>
            </h3>
            <div class="pk-field"><label>${L.label_lang}</label><select id="set_lang"><option value="ko" ${curLang === 'ko' ? 'selected' : ''}>한국어</option><option value="en" ${curLang === 'en' ? 'selected' : ''}>English</option><option value="ja" ${curLang === 'ja' ? 'selected' : ''}>日本語</option><option value="zh" ${curLang === 'zh' ? 'selected' : ''}>中文 (简体)</option></select></div>
            <div class="pk-field"><label>${L.label_player}</label><select id="set_player"><option value="system" ${curPlayer === 'system' ? 'selected' : ''}>System Default</option><option value="potplayer" ${curPlayer === 'potplayer' ? 'selected' : ''}>PotPlayer</option><option value="vlc" ${curPlayer === 'vlc' ? 'selected' : ''}>VLC Player</option></select></div>
            <div class="pk-field">
                <label>${L.label_aria2_url}</label>
                <input type="text" id="set_aria_url" value="${esc(curAriaUrl)}" placeholder="ws://localhost:6800/jsonrpc">
            </div>
            <div class="pk-field">
                <label>${L.label_aria2_token}</label>
                <input type="password" id="set_aria_token" value="${esc(curAriaToken)}" placeholder="Empty">
            </div>
            <div class="pk-modal-act"><button class="pk-btn" id="set_cancel">${L.btn_cancel}</button><button class="pk-btn pri" id="set_save">${L.btn_save}</button></div>
            <div class="pk-credit"><b>제작: 브랜뉴(poihoii)</b><br><a href="https://github.com/poihoii/PikPak_FileManager" target="_blank">https://github.com/poihoii/PikPak_FileManager</a></div>
        `);

        m.querySelector('#set_cancel').onclick = () => m.remove();

        m.querySelector('#set_save').onclick = async () => {
            const newUrl = m.querySelector('#set_aria_url').value.trim();
            const newToken = m.querySelector('#set_aria_token').value.trim();
            const saveBtn = m.querySelector('#set_save');

            if (!newUrl && !newToken) {
                gmSet('pk_lang', m.querySelector('#set_lang').value);
                gmSet('pk_ext_player', m.querySelector('#set_player').value);
                gmSet('pk_aria2_url', '');
                gmSet('pk_aria2_token', '');
                showAlert(L.msg_settings_saved).then(() => location.reload());
                return;
            }

            saveBtn.disabled = true;
            saveBtn.textContent = "...";

            try {
                const payload = { jsonrpc: '2.0', method: 'aria2.getVersion', id: 'pk_test', params: [`token:${newToken}`] };

                let testUrl = newUrl || "ws://localhost:6800/jsonrpc";

                let fetchUrl = testUrl;
                if (fetchUrl.startsWith('ws')) fetchUrl = fetchUrl.replace('ws', 'http');

                const res = await fetch(fetchUrl, {
                    method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' }
                });

                if (!res.ok) throw new Error('Network Error');
                const data = await res.json();
                if (data.error) throw new Error(data.error.message);

                gmSet('pk_lang', m.querySelector('#set_lang').value);
                gmSet('pk_ext_player', m.querySelector('#set_player').value);
                gmSet('pk_aria2_url', newUrl);
                gmSet('pk_aria2_token', newToken);

                await showAlert(L.msg_settings_saved);
                location.reload();

            } catch (e) {
                console.error(e);
                showAlert(L.msg_aria2_check_fail);
                saveBtn.disabled = false;
                saveBtn.textContent = L.btn_save;
            }
        };
    };

    const ctx = el.querySelector('#pk-ctx');
    ctx.querySelector('#ctx-open').onclick = () => { ctx.style.display = 'none'; const id = Array.from(S.sel)[0]; const item = S.items.find(i => i.id === id); if (item) { if (item.kind === 'drive#folder') { S.history.push({ path: [...S.path] }); S.path.push({ id: item.id, name: item.name }); S.forward = []; load(); } else if (item.mime_type?.startsWith('video')) playVideo(item); } };
    ctx.querySelector('#ctx-down').onclick = () => { ctx.style.display = 'none'; UI.win.querySelector('#pk-down').click(); };
    ctx.querySelector('#ctx-copy').onclick = () => { ctx.style.display = 'none'; UI.btnCopy.click(); };
    ctx.querySelector('#ctx-cut').onclick = () => { ctx.style.display = 'none'; UI.btnCut.click(); };
    ctx.querySelector('#ctx-rename').onclick = () => { ctx.style.display = 'none'; UI.btnRename.click(); };
    ctx.querySelector('#ctx-del').onclick = () => { ctx.style.display = 'none'; UI.btnDel.click(); };
    UI.btnClose.addEventListener('click', () => { el.remove(); document.removeEventListener('keydown', keyHandler); document.removeEventListener('mouseup', mouseHandler); });

    updateStat();
    load();
}

function tryInject() {
    console.log("🚀 PikPak Script: Attempting inject...");
    if (document.getElementById('pk-launch')) {
        console.log("🚀 PikPak Script: Already injected.");
        return;
    }

    if (!document.body) {
        console.log("🚀 PikPak Script: Body not ready, retrying...");
        setTimeout(tryInject, 500);
        return;
    }
    inject();
    console.log("🚀 PikPak Script: INJECT SUCCESS!");
}

function inject() {
    if (document.getElementById('pk-launch')) return;
    const b = document.createElement('button'); b.id = 'pk-launch';
    b.style.cssText = `position:fixed;bottom:20px;right:20px;width:50px;height:50px;border-radius:50%;background:#1a5eff;border:none;cursor:pointer;z-index:2147483647;box-shadow:0 4px 12px rgba(0,0,0,0.3);padding:0;overflow:hidden;transition:transform 0.1s;display:flex!important;align-items:center!important;justify-content:center!important;`;
    b.innerHTML = `<svg width="60%" height="60%" viewBox="0 0 238 200" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M0 0 C1.82724609 0.01353516 1.82724609 0.01353516 3.69140625 0.02734375 C4.59761719 0.03894531 5.50382812 0.05054688 6.4375 0.0625 C5.95097979 7.11704304 4.33696858 12.90149479 1.6875 19.4375 C1.35234375 20.32566406 1.0171875 21.21382812 0.671875 22.12890625 C0.3315625 22.98097656 -0.00875 23.83304688 -0.359375 24.7109375 C-0.66198242 25.47583496 -0.96458984 26.24073242 -1.27636719 27.02880859 C-3.01571023 29.77913653 -4.60880008 30.70366989 -7.5625 32.0625 C-10.93383789 32.72265625 -10.93383789 32.72265625 -14.78515625 33.125 C-15.47874237 33.20142731 -16.17232849 33.27785461 -16.88693237 33.3565979 C-18.36660067 33.51855298 -19.84685768 33.67520381 -21.3276062 33.82696533 C-25.19232303 34.22318595 -29.05286739 34.65697538 -32.9140625 35.0859375 C-33.67180466 35.16903168 -34.42954681 35.25212585 -35.21025085 35.33773804 C-40.99791882 35.97875931 -46.74864414 36.77615252 -52.5 37.6875 C-61.81496788 39.10080547 -71.19269316 40.07620454 -80.5625 41.0625 C-19.8425 41.0625 40.8775 41.0625 103.4375 41.0625 C91.8875 39.7425 80.3375 38.4225 68.4375 37.0625 C63.8175 36.4025 59.1975 35.7425 54.4375 35.0625 C49.17221542 34.42736314 43.90722683 33.79696512 38.63671875 33.20703125 C37.62996094 33.08714844 36.62320313 32.96726563 35.5859375 32.84375 C34.69052246 32.74126953 33.79510742 32.63878906 32.87255859 32.53320312 C30.35601376 32.0467485 28.59527547 31.44037784 26.4375 30.0625 C23.38532266 24.97553776 21.3341425 19.45473677 19.1875 13.9375 C18.91695801 13.25671387 18.64641602 12.57592773 18.36767578 11.87451172 C16.82394482 7.78804812 16.13851057 4.42502757 16.4375 0.0625 C33.20320897 -0.76054389 50.04132 2.04640823 66.578125 4.53515625 C70.96365446 5.13439358 75.35589707 5.627565 79.75488281 6.11669922 C97.85972043 8.13836316 97.85972043 8.13836316 106.6875 9.4375 C107.39487305 9.52700928 108.10224609 9.61651855 108.83105469 9.70874023 C113.96714941 10.51808328 116.87598017 12.31623275 120.4375 16.0625 C121.69830294 18.53927732 122.67025259 20.7202309 123.5625 23.3125 C124.02136126 24.56846882 124.48232815 25.8236702 124.9453125 27.078125 C125.27250149 28.00288179 125.27250149 28.00288179 125.60630035 28.94632053 C126.38750394 31.05750635 126.38750394 31.05750635 127.44002533 32.93062496 C131.07482517 39.83448151 131.00351579 46.31795394 130.95507812 53.99243164 C130.96050802 55.37978344 130.96763552 56.76712947 130.97631836 58.15446472 C130.99445028 61.89829685 130.98752708 65.6416848 130.97480202 69.38552403 C130.96462344 73.31622656 130.97408092 77.24689291 130.98034668 81.17759705 C130.98760817 87.77544941 130.97807403 94.37312221 130.95898438 100.97094727 C130.93720936 108.58452515 130.94427739 116.19767461 130.96629 123.81124216 C130.98447611 130.36524706 130.98698696 136.91912344 130.97653532 143.47314543 C130.97031913 147.38014362 130.96941296 151.2869408 130.98268127 155.19392586 C130.99428653 158.8672447 130.9861299 162.54001414 130.96310425 166.213274 C130.95534421 168.19404482 130.96713242 170.17486244 130.97961426 172.15560913 C130.90049754 180.52230774 129.95755225 186.09535704 124.25390625 192.5234375 C123.51011719 193.15507812 122.76632813 193.78671875 122 194.4375 C121.25878906 195.08460938 120.51757812 195.73171875 119.75390625 196.3984375 C114.7661098 199.98157627 110.22842399 200.35421576 104.22135925 200.32992554 C103.39785408 200.33445665 102.5743489 200.33898776 101.72588903 200.34365618 C98.968488 200.35630894 96.21128426 200.35467924 93.45385742 200.35302734 C91.475975 200.35901206 89.49809491 200.36581748 87.5202179 200.37338257 C82.14823484 200.39105594 76.77631549 200.39573853 71.40430617 200.39701414 C66.91878502 200.39891354 62.4332787 200.40627158 57.94776326 200.41335833 C47.36384951 200.42964512 36.77996977 200.43452703 26.19604492 200.43310547 C15.28118177 200.43190408 4.36651636 200.45300486 -6.54829675 200.4845928 C-15.92170288 200.51075235 -25.29504442 200.52147289 -34.66848677 200.52019465 C-40.26569836 200.51968491 -45.86273424 200.52537507 -51.45990944 200.54655075 C-56.725388 200.56592749 -61.99052314 200.5660613 -67.25601387 200.55151749 C-69.1861191 200.54942757 -71.11624579 200.55414114 -73.04631424 200.5662384 C-75.68641426 200.58171127 -78.32533312 200.57236959 -80.96540833 200.55697632 C-81.72466655 200.56726344 -82.48392478 200.57755057 -83.26619083 200.58814943 C-90.327556 200.49750269 -96.39704041 197.82485418 -101.375 192.75 C-102.18904297 191.95142578 -102.18904297 191.95142578 -103.01953125 191.13671875 C-108.29053612 184.05088689 -108.01804154 177.09915158 -108.0300293 168.55004883 C-108.04229625 167.18245883 -108.05575106 165.81487905 -108.07029724 164.4473114 C-108.10523797 160.74401042 -108.12059214 157.04088761 -108.13013434 153.33744264 C-108.13673436 151.01403475 -108.14708893 148.69067299 -108.15863991 146.36728477 C-108.19836069 138.23287671 -108.22038571 130.09860956 -108.22827148 121.96411133 C-108.23610728 114.43116961 -108.28516577 106.89925647 -108.35333699 99.36664182 C-108.41007964 92.86514961 -108.43519788 86.36399446 -108.43721896 79.86225718 C-108.43904166 75.9947118 -108.45309089 72.1282487 -108.50003624 68.26096535 C-108.72797687 48.29049317 -107.52961567 30.83210742 -95.5625 14.0625 C-92.23797604 10.732487 -88.44904231 10.20048941 -83.953125 9.5 C-83.20613342 9.37633057 -82.45914185 9.25266113 -81.68951416 9.12524414 C-74.04584045 7.901492 -66.3645662 7.06662299 -58.66394043 6.29776001 C-54.62860447 5.8940274 -50.59547976 5.46951727 -46.5625 5.04296875 C-45.77776306 4.96008102 -44.99302612 4.8771933 -44.18450928 4.79179382 C-36.33754684 3.9513441 -28.53467892 2.87051571 -20.734375 1.67578125 C-13.79617508 0.63078847 -7.03103815 -0.06826251 0 0 Z M-37.4375 87.4375 C-41.76814335 92.78711826 -40.78388874 98.21215336 -40.8125 104.875 C-40.833125 106.06416016 -40.85375 107.25332031 -40.875 108.47851562 C-40.88015625 109.62642578 -40.8853125 110.77433594 -40.890625 111.95703125 C-40.8999707 113.00737549 -40.90931641 114.05771973 -40.91894531 115.13989258 C-40.50704184 118.51721889 -39.58167158 120.34513508 -37.5625 123.0625 C-33.8251144 125.5540904 -31.98918417 125.52043285 -27.5625 125.0625 C-24.80920979 123.26687595 -23.03622539 122.00995078 -21.5625 119.0625 C-21.2630429 114.46407809 -21.28436362 109.85701583 -21.25 105.25 C-21.20649414 103.32317383 -21.20649414 103.32317383 -21.16210938 101.35742188 C-21.15373047 100.11927734 -21.14535156 98.88113281 -21.13671875 97.60546875 C-21.12213623 96.47133545 -21.10755371 95.33720215 -21.0925293 94.16870117 C-21.66318532 90.39703539 -22.92773916 88.76654018 -25.5625 86.0625 C-30.04892468 83.81928766 -33.65294159 84.31112566 -37.4375 87.4375 Z M45.4375 89.0625 C43.16309531 93.61130937 44.11732026 99.81887268 44.0625 104.8125 C44.02511719 106.08867188 43.98773438 107.36484375 43.94921875 108.6796875 C43.6563417 116.25277258 43.6563417 116.25277258 46.7109375 122.91015625 C50.0632924 125.55649945 51.41007501 125.90713502 55.50390625 125.58984375 C58.83921214 124.68021487 60.4149221 122.75927054 62.4375 120.0625 C64.03299443 115.26404894 63.62174204 110.1852134 63.625 105.1875 C63.64336914 103.71603516 63.64336914 103.71603516 63.66210938 102.21484375 C63.77173933 93.57358621 63.77173933 93.57358621 59.75 86.1875 C54.0132506 83.39664894 49.78182352 84.71817648 45.4375 89.0625 Z M-18.5625 155.0625 C-20.89546251 157.88967213 -20.89546251 157.88967213 -20.3125 161.125 C-19.8031756 164.161959 -19.8031756 164.161959 -17.5625 166.0625 C-15.5023267 166.81656896 -13.41368556 167.49416461 -11.3125 168.125 C-10.19359375 168.46660156 -9.0746875 168.80820313 -7.921875 169.16015625 C-1.62436639 170.85169635 4.26860909 171.24487637 10.75 171.25 C11.9555957 171.26836914 11.9555957 171.26836914 13.18554688 171.28710938 C21.14907742 171.30632948 28.31945463 169.57146397 35.875 167.125 C36.88433594 166.80660156 37.89367187 166.48820313 38.93359375 166.16015625 C41.73511224 165.200361 41.73511224 165.200361 43.4375 162.0625 C43.1133631 158.74009676 42.82973697 157.45473697 40.4375 155.0625 C35.63637087 154.61062902 31.50016124 155.74460874 26.9375 157.0625 C14.69655136 160.31686985 0.092469 160.8899845 -11.5625 155.0625 C-15.0625 154.72916667 -15.0625 154.72916667 -18.5625 155.0625 Z " fill="#FDFDFD" transform="translate(107.5625,-0.0625)"/>
</svg>`;
    const savedLeft = gmGet('pk_pos_left', null);
    const savedTop = gmGet('pk_pos_top', null);

    if (savedLeft !== null && savedTop !== null) {
        b.style.bottom = 'auto';
        b.style.right = 'auto';
        b.style.left = savedLeft;
        b.style.top = savedTop;
    }

    let isDragging = false;
    let dragStartX, dragStartY;

    b.onmousedown = (e) => {
        isDragging = false;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        const rect = b.getBoundingClientRect();
        b.style.bottom = 'auto'; b.style.right = 'auto';
        b.style.left = rect.left + 'px'; b.style.top = rect.top + 'px';
        b.style.transition = 'none';
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        const onMove = (em) => {
            if (!isDragging && (Math.abs(em.clientX - dragStartX) > 3 || Math.abs(em.clientY - dragStartY) > 3)) {
                isDragging = true;
            }
            if (isDragging) {
                b.style.left = (em.clientX - offsetX) + 'px';
                b.style.top = (em.clientY - offsetY) + 'px';
            }
        };

        const onUp = () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
            b.style.transition = 'transform 0.1s';
            if (!isDragging) {
                openManager();
            } else {
                gmSet('pk_pos_left', b.style.left);
                gmSet('pk_pos_top', b.style.top);
            }
        };
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    };

    document.body.appendChild(b);
    console.log("🚀 Button Created!");
}

const startObserver = () => {
    if (!document.body) return;
    const obs = new MutationObserver(() => {
        if (!document.getElementById('pk-launch')) {
            tryInject();
        }
    });
    obs.observe(document.body, { childList: true, subtree: true });
};

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => {
        tryInject();
        startObserver();
    });
} else {
    tryInject();
    startObserver();
}