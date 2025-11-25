import { CONF } from './config';
import { CSS } from './style';
import { getStrings, getLang } from './languages';
import { sleep, esc, fmtSize, fmtDate, fmtDur } from './utils';
import { apiList, apiGet, apiAction, getHeaders } from './api';

console.log("🚀 PikPak Script: LOADED from main.js");

const L = getStrings();
const lang = getLang();

async function openManager() {
    if (document.querySelector('.pk-ov')) return;

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
        lastSelIdx: -1
    };

    const el = document.createElement('div'); el.className = 'pk-ov';
    el.innerHTML = `
        <style>${CSS}</style>
        <div class="pk-win">
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
                    <div class="pk-btn" id="pk-settings" style="width:32px;padding:0;justify-content:center;" title="${L.tip_settings}">${CONF.icons.settings}</div>
                    <div class="pk-btn" id="pk-close" style="width:32px;padding:0;justify-content:center;">${CONF.icons.close}</div>
                </div>
            </div>
            <div class="pk-tb">
                <div class="pk-nav" id="pk-crumb"></div>
                <div style="flex:1"></div>
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
            </div>
            <div class="pk-tb" id="pk-actionbar">
                <button class="pk-btn" id="pk-nav-back" title="${L.tip_back}">${CONF.icons.back}<span>${L.btn_back}</span></button>
                <button class="pk-btn" id="pk-refresh" title="${L.tip_refresh}">${CONF.icons.refresh}</button>
                <button class="pk-btn" id="pk-nav-fwd" title="${L.tip_fwd}">${CONF.icons.fwd}<span>${L.btn_fwd}</span></button>
                <div style="width:1px;height:20px;background:var(--pk-bd);margin:0 4px"></div>
                <button class="pk-btn" id="pk-newfolder" title="${L.tip_newfolder}">${CONF.icons.newfolder} <span>${L.btn_newfolder}</span></button>
                <button class="pk-btn" id="pk-del" title="${L.tip_del}">${CONF.icons.del} <span>${L.btn_del}</span></button>
                <button class="pk-btn" id="pk-deselect" title="${L.tip_deselect}" style="display:none">${CONF.icons.deselect} <span>${L.btn_deselect}</span></button>
                <div style="width:1px;height:20px;background:var(--pk-bd);margin:0 4px"></div>
                <button class="pk-btn" id="pk-copy" title="${L.tip_copy}">${CONF.icons.copy} <span>${L.btn_copy}</span></button>
                <button class="pk-btn" id="pk-cut" title="${L.tip_cut}">${CONF.icons.cut} <span>${L.btn_cut}</span></button>
                <button class="pk-btn" id="pk-paste" title="${L.tip_paste}" disabled>${CONF.icons.paste} <span>${L.btn_paste}</span></button>
                <div style="width:1px;height:20px;background:var(--pk-bd);margin:0 4px"></div>
                <button class="pk-btn" id="pk-rename" title="${L.tip_rename}">${CONF.icons.rename} <span>${L.btn_rename}</span></button>
                <button class="pk-btn" id="pk-bulkrename" title="${L.tip_bulkrename}">${CONF.icons.bulkrename} <span>${L.btn_bulkrename}</span></button>
            </div>
            <div class="pk-grid-hd">
                <div style="padding-left:4px"><input type="checkbox" id="pk-all"></div>
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
                    <div style="width:1px;height:20px;background:var(--pk-bd);margin:0 4px"></div>
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
        btnExt: el.querySelector('#pk-ext'), btnIdm: el.querySelector('#pk-idm'),
        pop: el.querySelector('#pk-pop'), ctx: el.querySelector('#pk-ctx'), cols: el.querySelectorAll('.pk-col')
    };

    function showModal(html) {
        const m = document.createElement('div'); m.className = 'pk-modal-ov'; m.innerHTML = `<div class="pk-modal">${html}</div>`; UI.win.appendChild(m); return m;
    }

    function setLoad(b) { S.loading = b; UI.loader.style.display = b ? 'flex' : 'none'; if (b) UI.loadTxt.textContent = L.loading_detail; }
    function updateLoadTxt(txt) { if (UI.loadTxt) UI.loadTxt.innerText = txt; }
    function updateNavState() { UI.btnBack.disabled = false; UI.btnFwd.disabled = S.forward.length === 0; }

    async function load(isHistoryNav = false) {
        if (S.loading) return;
        setLoad(true);
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
        } catch (e) { console.error(e); alert("Failed to load: " + e.message); }
        finally { setLoad(false); }
        el.focus();
    }

    async function refresh() {
        S.display = [...S.items];
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
        renderList(); updateStat(); el.focus();
    }

    function renderList() {
        UI.in.style.height = `${S.display.length * CONF.rowHeight}px`;
        UI.cols.forEach(c => { c.querySelector('span').textContent = (c.dataset.k === S.sort) ? (S.dir === 1 ? ' ▲' : ' ▼') : ''; c.style.color = (c.dataset.k === S.sort) ? 'var(--pk-pri)' : ''; });
        requestAnimationFrame(renderVisible);
    }

    function renderVisible() {
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
                row.innerHTML = `<div style="text-align:center"><input type="checkbox" ${isSel ? 'checked' : ''}></div><div class="pk-name" title="${esc(d.name)}">${d.kind === 'drive#folder' ? '📁' : '📄'} ${esc(d.name)}</div><div>${d.kind === 'drive#folder' ? '' : fmtSize(d.size)}</div><div>${fmtDur(d.params?.duration || d.medias?.[0]?.duration)}</div><div style="color:#888">${fmtDate(d.modified_time)}</div>`;
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
    UI.vp.onscroll = renderVisible;

    function renderCrumb() {
        UI.crumb.innerHTML = '';
        S.path.forEach((p, i) => {
            const s = document.createElement('span'); s.textContent = p.name; s.className = i === S.path.length - 1 ? 'act' : '';
            s.onclick = () => { if (i !== S.path.length - 1 && !S.loading) { S.history.push({ path: [...S.path] }); S.path = S.path.slice(0, i + 1); load(); } };
            UI.crumb.appendChild(s); if (i < S.path.length - 1) UI.crumb.appendChild(document.createTextNode(' › '));
        });
    }

    const goBack = () => { if (S.loading) return; if (S.history.length > 0) { const prevState = S.history.pop(); S.path = prevState.path; S.forward = []; load(true); return; } if (S.path.length > 1) { S.forward.push(S.path.pop()); load(true); return; } if (S.path.length === 1 && S.history.length === 0) { if (confirm(L.msg_exit_confirm)) { el.remove(); } } };
    const goForward = () => { if (S.forward.length > 0 && !S.loading) { S.path.push(S.forward.pop()); load(); } };

    el.tabIndex = 0; el.focus();
    const keyHandler = (e) => {
        if (!document.querySelector('.pk-ov')) return;
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
        if (e.key === 'Escape') { const player = document.getElementById('pk-player-ov'); if (player) { player.remove(); return; } const openModal = document.querySelector('.pk-modal-ov'); if (openModal) { openModal.remove(); return; } if (UI.ctx.style.display === 'block') UI.ctx.style.display = 'none'; else if (S.sel.size > 0) { S.sel.clear(); refresh(); } else if (S.path.length === 1) el.remove(); return; }
        if (e.key === 'F2') { e.preventDefault(); if (S.sel.size === 1) UI.btnRename.click(); else if (S.sel.size > 1) UI.btnBulkRename.click(); }
        if (e.key === 'F5') { e.preventDefault(); UI.btnRefresh.click(); }
        if (e.key === 'F8') { e.preventDefault(); UI.btnNewFolder.click(); }
        if (e.key === 'Delete') { UI.btnDel.click(); }
        if (e.key === 'Backspace') { if (!S.scanning) goBack(); }
        if (e.altKey && e.key === 'ArrowLeft') { e.preventDefault(); goBack(); }
        if (e.altKey && e.key === 'ArrowRight') { e.preventDefault(); goForward(); }
        if (e.ctrlKey || e.metaKey) { if (e.key === 'a' || e.key === 'A') { e.preventDefault(); UI.chkAll.click(); } if (e.key === 'c' || e.key === 'C') { e.preventDefault(); UI.btnCopy.click(); } if (e.key === 'x' || e.key === 'X') { e.preventDefault(); UI.btnCut.click(); } if (e.key === 'v' || e.key === 'V') { e.preventDefault(); UI.btnPaste.click(); } }
        if (e.altKey) { if (e.key === 's' || e.key === 'S') { e.preventDefault(); UI.btnSettings.click(); } }
    };
    document.addEventListener('keydown', keyHandler);
    const mouseHandler = (e) => { if (!document.querySelector('.pk-ov')) return; if (e.button === 3) { e.preventDefault(); e.stopPropagation(); goBack(); } if (e.button === 4) { e.preventDefault(); e.stopPropagation(); goForward(); } if (UI.ctx.style.display === 'block' && !UI.ctx.contains(e.target)) UI.ctx.style.display = 'none'; };
    document.addEventListener('mouseup', mouseHandler);

    function updateStat() {
        const n = S.sel.size; UI.stat.textContent = n > 0 ? L.sel_count.replace('{n}', n) : L.status_ready.replace('{n}', S.display.length); const hasSel = n > 0;
        UI.btnCopy.disabled = !hasSel; UI.btnCut.disabled = !hasSel; UI.btnDel.disabled = !hasSel; UI.btnRename.disabled = n !== 1; UI.btnBulkRename.disabled = n < 2; UI.btnSettings.disabled = false; UI.btnDeselect.style.display = hasSel ? 'inline-flex' : 'none';
    }

    async function getLinks() { const res = []; for (const id of S.sel) { let item = S.items.find(x => x.id === id); if (item && !item.web_content_link) { try { item = await apiGet(id); } catch { } } if (item?.web_content_link) res.push(item); } return res; }
    async function playVideo(item) {
        let link = item.web_content_link; if (!link) { try { const m = await apiGet(item.id); link = m.web_content_link; } catch (e) { console.error(e); } }
        if (!link) { alert(L.msg_video_fail || "Cannot fetch video link."); return; }
        const d = document.createElement('div'); d.id = 'pk-player-ov'; d.tabIndex = 0;
        d.innerHTML = `<div style="position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,0.95);backdrop-filter:blur(5px);display:flex;justify-content:center;align-items:center;"><div style="width:95vw;height:95vh;max-width:1600px;background:#000;border-radius:8px;box-shadow:0 20px 60px rgba(0,0,0,0.8);display:flex;flex-direction:column;overflow:hidden;border:1px solid #333;"><div style="flex:0 0 40px;background:#1a1a1a;padding:0 20px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #333;"><span style="color:#ddd;font-weight:600;font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(item.name)}</span><button class="pk-close-btn" style="color:#aaa;background:none;border:none;font-size:24px;cursor:pointer;width:30px;height:30px;display:flex;align-items:center;justify-content:center;">×</button></div><div style="flex:1;background:#000;position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden;"><video src="${link}" controls autoplay playsinline preload="auto" style="width:100%;height:100%;object-fit:contain;outline:none;" onerror="alert('Video Load Failed. Link might be restricted.');"></video></div></div><style>.pk-close-btn:hover{color:#fff}</style></div>`;
        document.body.appendChild(d); d.focus(); d.onkeydown = (e) => { if (e.key === 'Escape') { d.remove(); e.stopPropagation(); } }; d.querySelector('.pk-close-btn').onclick = () => d.remove(); d.onclick = (e) => { if (e.target === d.firstElementChild) d.remove(); };
    }

    // Handlers
    UI.scan.onclick = async () => { if (S.scanning) { S.scanning = false; return; } if (!confirm(L.msg_flatten_warn)) return; S.scanning = true; UI.stopBtn.onclick = () => { S.scanning = false; }; const root = S.path[S.path.length - 1]; let q = [{ id: root.id, name: root.name }]; let all = []; setLoad(true); try { while (q.length && S.scanning) { const curr = q.shift(); const pid = curr.id; updateLoadTxt(L.status_scanning.replace('{n}', all.length).replace('{f}', curr.name) + "\n" + L.loading_detail); const files = await apiList(pid, 500, (currentCount) => { updateLoadTxt(L.status_scanning.replace('{n}', all.length + currentCount).replace('{f}', curr.name)); }); for (const f of files) { if (f.kind === 'drive#folder') q.push({ id: f.id, name: f.name }); else all.push(f); } await sleep(20); } if (S.scanning) { S.items = all; UI.dup.style.display = 'flex'; refresh(); } } catch (e) { alert("Error: " + e.message); } finally { S.scanning = false; setLoad(false); updateStat(); } };
    UI.dup.onclick = () => { if (!S.dupMode) if (!confirm(L.msg_dup_warn)) return; S.dupMode = !S.dupMode; UI.dup.style.backgroundColor = S.dupMode ? '#444' : ''; UI.dup.style.color = S.dupMode ? '#fff' : ''; UI.dup.style.borderColor = S.dupMode ? '#666' : ''; refresh(); };
    UI.btnDupSize.onclick = () => { S.dupSizeStrategy = S.dupSizeStrategy === 'small' ? 'large' : 'small'; UI.condSize.textContent = `(${S.dupSizeStrategy === 'small' ? L.cond_small : L.cond_large})`; S.sel.clear(); const itemMap = new Map(); S.display.forEach(d => { if (d.isHeader) return; const gIdx = S.dupGroups.get(d.id); if (gIdx !== undefined) { if (!itemMap.has(gIdx)) itemMap.set(gIdx, []); itemMap.get(gIdx).push(d); } }); itemMap.forEach(items => { if (items.length < 2) return; let keep = (S.dupSizeStrategy === 'small') ? items.reduce((a, b) => parseInt(a.size) > parseInt(b.size) ? a : b) : items.reduce((a, b) => parseInt(a.size) < parseInt(b.size) ? a : b); items.forEach(i => { if (i.id !== keep.id) S.sel.add(i.id); }); }); renderList(); updateStat(); };
    UI.btnDupDate.onclick = () => { S.dupDateStrategy = S.dupDateStrategy === 'old' ? 'new' : 'old'; UI.condDate.textContent = `(${S.dupDateStrategy === 'old' ? L.cond_old : L.cond_new})`; S.sel.clear(); const itemMap = new Map(); S.display.forEach(d => { if (d.isHeader) return; const gIdx = S.dupGroups.get(d.id); if (gIdx !== undefined) { if (!itemMap.has(gIdx)) itemMap.set(gIdx, []); itemMap.get(gIdx).push(d); } }); itemMap.forEach(items => { if (items.length < 2) return; let keep = (S.dupDateStrategy === 'old') ? items.reduce((a, b) => new Date(a.modified_time) > new Date(b.modified_time) ? a : b) : items.reduce((a, b) => new Date(a.modified_time) < new Date(b.modified_time) ? a : b); items.forEach(i => { if (i.id !== keep.id) S.sel.add(i.id); }); }); renderList(); updateStat(); };
    UI.cols.forEach(c => c.onclick = () => { const k = c.dataset.k; if (S.sort === k) S.dir *= -1; else { S.sort = k; S.dir = 1; } refresh(); });
    UI.chkAll.onclick = (e) => { if (e.target.checked) S.display.forEach(i => S.sel.add(i.id)); else S.sel.clear(); renderList(); updateStat(); };
    UI.btnBack.onclick = goBack; UI.btnFwd.onclick = goForward; UI.btnRefresh.onclick = () => load();
    UI.btnNewFolder.onclick = async () => { const name = prompt(L.msg_newfolder_prompt, ''); if (!name) return; const cur = S.path[S.path.length - 1]; try { await fetch('https://api-drive.mypikpak.com/drive/v1/files', { method: 'POST', headers: getHeaders(), body: JSON.stringify({ kind: 'drive#folder', parent_id: cur.id || '', name: name }) }); load(); } catch (e) { alert('Error: ' + e.message); } };
    UI.btnCopy.onclick = () => { if (S.sel.size === 0) return; S.clipItems = Array.from(S.sel); S.clipType = 'copy'; S.clipSourceParentId = S.path[S.path.length - 1].id || ''; UI.btnPaste.disabled = false; alert(L.msg_copy_done); };
    UI.btnCut.onclick = () => { if (S.sel.size === 0) return; S.clipItems = Array.from(S.sel); S.clipType = 'move'; S.clipSourceParentId = S.path[S.path.length - 1].id || ''; UI.btnPaste.disabled = false; alert(L.msg_cut_done); };
    UI.btnPaste.onclick = async () => { if (!S.clipItems || S.clipItems.length === 0) { alert(L.msg_paste_empty); return; } setLoad(true); const dest = S.path[S.path.length - 1].id || ''; if (S.clipSourceParentId === dest) { alert(L.msg_paste_same_folder); setLoad(false); return; } const ids = S.clipItems.slice(); const endpoint = S.clipType === 'move' ? 'https://api-drive.mypikpak.com/drive/v1/files:batchMove' : 'https://api-drive.mypikpak.com/drive/v1/files:batchCopy'; try { await fetch(endpoint, { method: 'POST', headers: getHeaders(), body: JSON.stringify({ ids: ids, to: { parent_id: dest } }) }); S.clipItems = []; S.clipType = ''; UI.btnPaste.disabled = true; await sleep(500); setLoad(false); await load(); } catch (e) { alert('Paste error: ' + e.message); setLoad(false); } };
    UI.btnRename.onclick = async () => { if (S.sel.size !== 1) return; const id = Array.from(S.sel)[0]; const item = S.items.find(i => i.id === id); if (!item) return; const m = showModal(`<h3>${L.modal_rename_title}</h3><div class="pk-field"><input type="text" id="rn_new_name" value="${esc(item.name)}"></div><div class="pk-modal-act"><button class="pk-btn" id="rn_cancel">${L.btn_cancel}</button><button class="pk-btn pri" id="rn_confirm">${L.btn_confirm}</button></div>`); const inp = m.querySelector('#rn_new_name'); inp.focus(); if (item.kind !== 'drive#folder' && item.name.lastIndexOf('.') > 0) inp.setSelectionRange(0, item.name.lastIndexOf('.')); else inp.select(); const doRename = async () => { const newName = inp.value.trim(); if (!newName || newName === item.name) { m.remove(); return; } if (S.items.some(i => i.name === newName)) { alert(L.msg_name_exists.replace('{n}', newName)); return; } m.remove(); try { setLoad(true); await apiAction(`/${id}`, { name: newName }); await sleep(200); setLoad(false); load(); } catch (e) { alert("Error: " + e.message); setLoad(false); } }; m.querySelector('#rn_cancel').onclick = () => m.remove(); m.querySelector('#rn_confirm').onclick = doRename; inp.onkeydown = (e) => { if (e.key === 'Enter') doRename(); if (e.key === 'Escape') { m.remove(); e.stopPropagation(); } }; };
    UI.btnBulkRename.onclick = () => { if (S.sel.size < 2) return; const m = showModal(`<h3>${L.modal_rename_multi_title}</h3><div class="pk-field"><label><input type="radio" name="rn_mode" value="pattern" checked> ${L.label_pattern}</label><input type="text" id="rn_pattern" value="Video {n}" placeholder="Video {n}"></div><div class="pk-field" style="margin-top:10px"><label><input type="radio" name="rn_mode" value="replace"> ${L.label_replace} <span style="font-size:11px;color:#888">${L.label_replace_note}</span></label><input type="text" id="rn_find" placeholder="${L.placeholder_find}" disabled><input type="text" id="rn_rep" placeholder="${L.placeholder_replace}" disabled></div><div class="pk-modal-act"><button class="pk-btn" id="rn_cancel">${L.btn_cancel}</button><button class="pk-btn pri" id="rn_preview">${L.btn_preview}</button></div>`); const radios = m.querySelectorAll('input[name="rn_mode"]'); const inpPattern = m.querySelector('#rn_pattern'); const inpFind = m.querySelector('#rn_find'); const inpRep = m.querySelector('#rn_rep'); radios.forEach(r => r.onchange = () => { const isPat = r.value === 'pattern'; inpPattern.disabled = !isPat; inpFind.disabled = isPat; inpRep.disabled = isPat; }); m.querySelector('#rn_cancel').onclick = () => m.remove(); m.querySelector('#rn_preview').onclick = () => { const mode = m.querySelector('input[name="rn_mode"]:checked').value; const pattern = inpPattern.value; const findStr = inpFind.value; const repStr = inpRep.value || ''; let idx = 1; const changes = []; const existingNames = new Set(S.items.map(i => i.name)); for (const id of S.sel) { const item = S.items.find(x => x.id === id); if (!item) continue; let base = item.name; let ext = ""; if (item.kind !== 'drive#folder' && item.name.lastIndexOf('.') > 0) { base = item.name.substring(0, item.name.lastIndexOf('.')); ext = item.name.substring(item.name.lastIndexOf('.')); } let newBase = base; if (mode === 'pattern') { if (pattern) newBase = pattern.replace(/\{n\}/g, idx++); } else { if (findStr && base.includes(findStr)) newBase = base.split(findStr).join(repStr); } const finalName = newBase + ext; if (finalName !== item.name) { if (existingNames.has(finalName)) { alert(L.msg_name_exists.replace('{n}', finalName)); return; } changes.push({ id: item.id, old: item.name, new: finalName }); } } m.remove(); if (changes.length === 0) { alert("No changes detected."); return; } let rowsHtml = changes.map(c => `<div class="pk-prev-row"><div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(c.old)}</div><div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--pk-pri)">${esc(c.new)}</div></div>`).join(''); const p = showModal(`<h3>${L.modal_preview_title} (${changes.length})</h3><div class="pk-prev-list"><div class="pk-prev-row" style="font-weight:bold;background:#eee"><div>${L.col_old}</div><div>${L.col_new}</div></div>${rowsHtml}</div><div class="pk-modal-act"><button class="pk-btn" id="pr_cancel">${L.btn_cancel}</button><button class="pk-btn pri" id="pr_confirm">${L.btn_confirm}</button></div>`); p.querySelector('#pr_cancel').onclick = () => p.remove(); p.querySelector('#pr_confirm').onclick = async () => { setLoad(true); let count = 0; try { for (const c of changes) { await apiAction(`/${c.id}`, { name: c.new }); count++; await sleep(50); } alert(L.msg_bulkrename_done.replace('{n}', count)); load(); } catch (e) { alert("Rename Error: " + e.message); } finally { setLoad(false); p.remove(); } }; }; };
    UI.btnExt.onclick = async () => { const player = GM_getValue('pk_ext_player', 'system'); const files = await getLinks(); if (!files || files.length === 0) { alert(L.msg_download_fail); return; } if (S.sel.size > 1) { let m3u = '#EXTM3U\n'; files.forEach(f => { m3u += `#EXTINF:-1,${f.name}\n${f.web_content_link}\n`; }); const blob = new Blob([m3u], { type: 'audio/x-mpegurl' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `pikpak_playlist_${Date.now()}.m3u`; a.click(); alert(L.msg_batch_m3u); } else { const f = files[0]; if (player === 'system') window.open(f.web_content_link, '_blank'); else window.open((player === 'potplayer' ? 'potplayer://' : 'vlc://') + f.web_content_link, '_self'); } };
    UI.btnIdm.onclick = async () => { const files = await getLinks(); if (!files || files.length === 0) { alert(L.msg_download_fail); return; } if (S.sel.size > 1) { let ef2 = ''; files.forEach(f => { ef2 += `<\r\n${f.web_content_link}\r\nfilename=${f.name}\r\n>\r\n`; }); const blob = new Blob([ef2], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `pikpak_idm_${Date.now()}.ef2`; a.click(); alert(L.msg_batch_ef2); } else { window.open(files[0].web_content_link, '_blank'); } };
    UI.win.querySelector('#pk-down').onclick = async () => { const files = await getLinks(); if (!files || files.length === 0) { alert(L.msg_download_fail); return; } for (const f of files) { const a = document.createElement('a'); a.href = f.web_content_link; document.body.appendChild(a); a.click(); a.remove(); await sleep(200); } };
    UI.win.querySelector('#pk-aria2').onclick = async () => { const files = await getLinks(); if (!files.length) { alert(L.msg_download_fail); return; } const ariaUrl = GM_getValue('pk_aria2_url', 'ws://localhost:6800/jsonrpc'); const ariaToken = GM_getValue('pk_aria2_token', ''); const payload = files.map(f => ({ jsonrpc: '2.0', method: 'aria2.addUri', id: f.id, params: [`token:${ariaToken}`, [f.web_content_link], { out: f.name }] })); try { await fetch(ariaUrl, { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } }); alert(`Sent ${files.length} to Aria2`); } catch (e) { alert('Aria2 Error. Check Settings.'); } };
    UI.btnDel.onclick = async () => { if (!S.sel.size) return; if (confirm(L.warn_del.replace('{n}', S.sel.size))) { await fetch(`https://api-drive.mypikpak.com/drive/v1/files:batchTrash`, { method: 'POST', headers: getHeaders(), body: JSON.stringify({ ids: Array.from(S.sel) }) }); await sleep(500); if (!S.scanning) load(); else { S.items = S.items.filter(i => !S.sel.has(i.id)); refresh(); } } };
    UI.btnDeselect.onclick = () => { S.sel.clear(); refresh(); };
    UI.btnSettings.onclick = () => { const curLang = GM_getValue('pk_lang', lang); const curPlayer = GM_getValue('pk_ext_player', 'system'); const curAriaUrl = GM_getValue('pk_aria2_url', 'ws://localhost:6800/jsonrpc'); const curAriaToken = GM_getValue('pk_aria2_token', ''); const m = showModal(`<h3>${L.modal_settings_title}</h3><div class="pk-field"><label>${L.label_lang}</label><select id="set_lang"><option value="ko" ${curLang === 'ko' ? 'selected' : ''}>한국어</option><option value="en" ${curLang === 'en' ? 'selected' : ''}>English</option><option value="ja" ${curLang === 'ja' ? 'selected' : ''}>日本語</option><option value="zh" ${curLang === 'zh' ? 'selected' : ''}>中文 (简体)</option></select></div><div class="pk-field"><label>${L.label_player}</label><select id="set_player"><option value="system" ${curPlayer === 'system' ? 'selected' : ''}>System Default</option><option value="potplayer" ${curPlayer === 'potplayer' ? 'selected' : ''}>PotPlayer</option><option value="vlc" ${curPlayer === 'vlc' ? 'selected' : ''}>VLC Player</option></select></div><div class="pk-field"><label>${L.label_aria2_url}</label><input type="text" id="set_aria_url" value="${esc(curAriaUrl)}"></div><div class="pk-field"><label>${L.label_aria2_token}</label><input type="text" id="set_aria_token" value="${esc(curAriaToken)}"></div><div class="pk-modal-act"><button class="pk-btn" id="set_cancel">${L.btn_cancel}</button><button class="pk-btn pri" id="set_save">${L.btn_save}</button></div><div class="pk-credit"><b>제작: 브랜뉴(poihoii)</b><br><a href="https://github.com/poihoii/PikPak_FileManager" target="_blank">https://github.com/poihoii/PikPak_FileManager</a></div>`); m.querySelector('#set_cancel').onclick = () => m.remove(); m.querySelector('#set_save').onclick = () => { GM_setValue('pk_lang', m.querySelector('#set_lang').value); GM_setValue('pk_ext_player', m.querySelector('#set_player').value); GM_setValue('pk_aria2_url', m.querySelector('#set_aria_url').value); GM_setValue('pk_aria2_token', m.querySelector('#set_aria_token').value); alert(L.msg_settings_saved); location.reload(); }; };

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
    b.style.cssText = `position:fixed;bottom:20px;right:20px;width:50px;height:50px;border-radius:50%;background:#1a5eff;border:none;cursor:pointer;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,0.3);padding:0;overflow:hidden;transition:transform 0.1s;`;
    b.innerHTML = `<img src="${CONF.logoUrl}" style="width:100%;height:100%;display:block;border-radius:50%;">`;

    const savedLeft = GM_getValue('pk_pos_left', null);
    const savedTop = GM_getValue('pk_pos_top', null);
    if (savedLeft && savedTop) {
        b.style.bottom = 'auto'; b.style.right = 'auto';
        b.style.left = savedLeft; b.style.top = savedTop;
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
                GM_setValue('pk_pos_left', b.style.left);
                GM_setValue('pk_pos_top', b.style.top);
            }
        };
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    };

    document.body.appendChild(b);
    console.log("🚀 Button Created!");
}

tryInject();
window.addEventListener('load', tryInject);
const obs = new MutationObserver(() => {
    if (!document.getElementById('pk-launch')) {
        tryInject();
    }
});
obs.observe(document.body, { childList: true, subtree: true });