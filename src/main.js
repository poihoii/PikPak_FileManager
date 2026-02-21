// src/main.js — openManager 핵심 로직 (모듈 사용)
import { CONF } from './config';
import { getStrings, getLang } from './languages';
import { sleep, esc, fmtSize, fmtDate, fmtDur, gmGet, gmSet } from './utils';
import { apiList, apiGet, apiAction, getHeaders } from './api';
import { AppState } from './core/state';
import { initModal, showModal, showToast, showAlert, showConfirm, showPrompt } from './ui/modal';
import { createLayout, UI, setLoading, updateLoadingText, updateStat, updateNavState } from './ui/layout';
import { render, renderList, renderGrid, getIcon, setHandlers, initScrollHandler } from './ui/fileList';
import { injectStyles } from './ui/style';
import { DEFAULT_FILTER, applyFilter, countActiveFilters, createFilterPanelHTML, readFilterFromPanel } from './features/filter';
import { initSidebar, highlightFolder, invalidateFolder } from './ui/sidebar';
import pkg from '../package.json';
const { version } = pkg;

console.log("🚀 PikPak Script: LOADED from main.js");

function syncState(S) {
    AppState.setState({
        view: S.view, display: S.display, sel: S.sel,
        sort: S.sort, dir: S.dir, loading: S.loading,
        items: S.items, path: S.path, history: S.history, forward: S.forward,
        scanning: S.scanning, dupMode: S.dupMode, dupRunning: S.dupRunning,
        dupReasons: S.dupReasons, dupGroups: S.dupGroups,
        dupSizeStrategy: S.dupSizeStrategy, dupDateStrategy: S.dupDateStrategy,
        lastSelIdx: S.lastSelIdx, search: S.search, gridZoom: S.gridZoom,
    });
}

export async function openManager() {
    if (document.querySelector('.pk-ov')) return;
    const L = getStrings();
    const lang = getLang();

    const S = {
        path: [{ id: '', name: '🏠 Home' }],
        history: [], forward: [],
        items: [], display: [], sel: new Set(),
        sort: 'name', dir: 1, scanning: false, dupMode: false, dupRunning: false,
        dupReasons: new Map(), dupGroups: new Map(),
        dupSizeStrategy: 'small', dupDateStrategy: 'old',
        clipItems: [], clipType: '', clipSourceParentId: null,
        loading: false, lastSelIdx: -1, search: '',
        view: gmGet('pk_view_mode', 'list'),
        gridZoom: parseInt(gmGet('pk_grid_zoom', '140'), 10),
        foldersFirst: gmGet('pk_folders_first', 'true') === 'true',
        filter: { ...DEFAULT_FILTER },
        filterActive: false
    };
    syncState(S);

    // ── 레이아웃 + 모달 초기화 ──
    const el = createLayout(L, lang, version);
    initModal(UI.win, L);
    injectStyles();

    // ── 사이드바 초기화 ──
    const sidebarOpen = gmGet('pk_sidebar_open', 'false') === 'true';
    if (sidebarOpen) {
        UI.sidebarEl.classList.add('open');
        UI.sidebarToggle.classList.add('active');
    }
    initSidebar(UI.sidebarEl, L,
        // onNavigate: 폴더 클릭 시
        (folderId, folderName) => {
            if (S.loading) return;
            S.history.push({ path: [...S.path] });
            S.forward = [];
            if (!folderId) {
                S.path = [{ id: '', name: L.sidebar_home }];
            } else {
                S.path = [{ id: '', name: L.sidebar_home }, { id: folderId, name: folderName }];
            }
            load();
        },
        // onDrop: 드래그앤드롭으로 파일 이동
        async (ids, targetFolderId) => {
            const currentFolderId = S.path[S.path.length - 1].id || '';
            if (ids.includes(targetFolderId)) {
                showToast(L.drag_move_same);
                return;
            }
            try {
                setLoad(true);
                await fetch('https://api-drive.mypikpak.com/drive/v1/files:batchMove', {
                    method: 'POST', headers: getHeaders(),
                    body: JSON.stringify({ ids: ids, to: { parent_id: targetFolderId } })
                });
                showToast(L.drag_move_done.replace('{n}', ids.length));
                invalidateFolder(targetFolderId);
                S.items = S.items.filter(i => !ids.includes(i.id));
                ids.forEach(id => S.sel.delete(id));
                refresh();
            } catch (e) {
                showAlert(L.drag_move_fail.replace('{e}', e.message));
            } finally {
                setLoad(false);
            }
        }
    );
    // 사이드바 토글 버튼
    UI.sidebarToggle.onclick = () => {
        const isOpen = UI.sidebarEl.classList.toggle('open');
        UI.sidebarToggle.classList.toggle('active', isOpen);
        gmSet('pk_sidebar_open', isOpen ? 'true' : 'false');
    };

    // ── 헬퍼 ──
    const setLoad = (b) => { S.loading = b; setLoading(b, L); };
    const updateLoadTxt = (txt) => updateLoadingText(txt);
    const _updateNavState = () => { syncState(S); updateNavState(); };
    const _updateStat = () => { syncState(S); updateStat(L); };
    const _render = () => { syncState(S); render(); };

    // ── 리스트 핸들러 등록 ──
    setHandlers({
        onRowClick(e, d, i, chk) {
            if (S.loading) return;
            if (e.target.tagName === 'INPUT') {
                if (chk.checked) S.sel.add(d.id); else S.sel.delete(d.id);
                S.lastSelIdx = i;
            } else if (e.shiftKey && S.lastSelIdx !== -1) {
                const s = Math.min(S.lastSelIdx, i), end = Math.max(S.lastSelIdx, i);
                for (let k = s; k <= end; k++) {
                    if (!S.display[k].isHeader) S.sel.add(S.display[k].id);
                }
            } else if (e.ctrlKey || e.metaKey) {
                chk.checked = !chk.checked;
                if (chk.checked) S.sel.add(d.id); else S.sel.delete(d.id);
                S.lastSelIdx = i;
            } else {
                S.sel.clear();
                S.sel.add(d.id);
                S.lastSelIdx = i;
            }
            syncState(S); renderList(); _updateStat();
        },
        onRowDblClick(e, d) {
            e.preventDefault(); if (S.loading) return;
            if (d.kind === 'drive#folder') { S.history.push({ path: [...S.path] }); S.path.push({ id: d.id, name: d.name }); S.forward = []; load(); }
            else if (d.mime_type?.startsWith('video')) playVideo(d);
        },
        onRowContext(e, d, i) {
            e.preventDefault();
            if (!S.sel.has(d.id)) { S.sel.clear(); S.sel.add(d.id); S.lastSelIdx = i; syncState(S); renderList(); _updateStat(); }
            UI.ctx.style.display = 'block';
            let x = e.clientX, y = e.clientY;
            const w = UI.ctx.offsetWidth || 150, h2 = UI.ctx.offsetHeight || 200;
            if (x + w > window.innerWidth) x = window.innerWidth - w - 10;
            if (y + h2 > window.innerHeight) y = window.innerHeight - h2 - 10;
            UI.ctx.style.left = x + 'px'; UI.ctx.style.top = y + 'px';
        },
        onRowEnter(e, d) {
            if (d.thumbnail_link && !S.loading) {
                UI.pop.innerHTML = `<img src="${d.thumbnail_link}">`; UI.pop.style.display = 'block';
                const r = UI.pop.getBoundingClientRect(); let t = e.clientY + 15;
                if (t + r.height > window.innerHeight) t = e.clientY - r.height - 10;
                UI.pop.style.top = t + 'px'; UI.pop.style.left = (e.clientX + 15) + 'px';
            }
        },
        onRowLeave() { UI.pop.style.display = 'none'; },
        onCardClick(e, d, idx, chk, card) {
            if (S.loading) return;
            if (e.target.tagName === 'INPUT') {
                if (chk.checked) S.sel.add(d.id); else S.sel.delete(d.id);
                S.lastSelIdx = idx;
            } else if (e.shiftKey && S.lastSelIdx !== -1) {
                const visibleItems = S.display.filter(v => !v.isHeader);
                const s = Math.min(S.lastSelIdx, idx), end = Math.max(S.lastSelIdx, idx);
                for (let k = s; k <= end; k++) {
                    S.sel.add(visibleItems[k].id);
                }
            } else if (e.ctrlKey || e.metaKey) {
                chk.checked = !chk.checked;
                if (chk.checked) S.sel.add(d.id); else S.sel.delete(d.id);
                S.lastSelIdx = idx;
            } else {
                S.sel.clear();
                S.sel.add(d.id);
                S.lastSelIdx = idx;
            }
            syncState(S); renderGrid(); _updateStat();
        },
        onCardDblClick(e, d) {
            e.preventDefault(); if (S.loading) return;
            if (d.kind === 'drive#folder') { S.history.push({ path: [...S.path] }); S.path.push({ id: d.id, name: d.name }); S.forward = []; load(); }
            else if (d.mime_type?.startsWith('video')) playVideo(d);
        },
        onCardContext(e, d, card) {
            e.preventDefault();
            if (!S.sel.has(d.id)) { S.sel.clear(); S.sel.add(d.id); card.classList.add('sel'); _updateStat(); }
            UI.ctx.style.display = 'block'; UI.ctx.style.left = e.clientX + 'px'; UI.ctx.style.top = e.clientY + 'px';
        },
        async onDrop(ids, targetFolderId) {
            const currentFolderId = S.path[S.path.length - 1].id || '';
            if (ids.includes(targetFolderId)) {
                showToast(L.drag_move_same);
                return;
            }
            try {
                setLoad(true);
                await fetch('https://api-drive.mypikpak.com/drive/v1/files:batchMove', {
                    method: 'POST', headers: getHeaders(),
                    body: JSON.stringify({ ids: ids, to: { parent_id: targetFolderId } })
                });
                showToast(L.drag_move_done.replace('{n}', ids.length));
                // 타겟 폴더 트리 UI 갱신 (있다면)
                invalidateFolder(targetFolderId);
                S.items = S.items.filter(i => !ids.includes(i.id));
                ids.forEach(id => S.sel.delete(id));
                refresh();
            } catch (e) {
                showAlert(L.drag_move_fail.replace('{e}', e.message));
            } finally {
                setLoad(false);
            }
        }
    });
    initScrollHandler();

    // ── 네비게이션 ──
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
        if (S.history.length > 0) { S.forward.push([...S.path]); const prev = S.history.pop(); S.path = prev.path; load(true); return; }
        if (S.path.length > 1) { S.forward.push([...S.path]); S.path = S.path.slice(0, S.path.length - 1); load(true); return; }
        if (S.path.length === 1 && S.history.length === 0) { if (await showConfirm(L.msg_exit_confirm)) { el.remove(); } }
    };
    const goForward = () => { if (S.forward.length > 0 && !S.loading) { S.history.push({ path: [...S.path] }); const next = S.forward.pop(); S.path = next; load(); } };

    // ── 로드 / 리프레시 ──
    async function load(isHistoryNav = false) {
        if (S.loading) return;
        setLoad(true);
        S.search = ''; if (UI.searchInput) UI.searchInput.value = '';
        const cur = S.path[S.path.length - 1];
        _updateNavState();
        UI.scan.style.display = 'flex'; UI.dup.style.display = 'none'; UI.dupTools.style.display = 'none';
        S.dupMode = false; S.lastSelIdx = -1;
        renderCrumb();
        // 사이드바 현재 폴더 하이라이트
        highlightFolder(cur.id || '');
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
        if (S.search) { const q = S.search.toLowerCase(); S.display = S.items.filter(i => i.name.toLowerCase().includes(q)); }
        else { S.display = [...S.items]; }
        // 필터 적용
        if (S.filterActive && countActiveFilters(S.filter) > 0) {
            S.display = applyFilter(S.display, S.filter);
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
                    if (!isDup) { const targetName = clean(target.name); if (rootName === targetName) { isDup = true; type = L.tag_name; } else if (rootDur > 0) { if (Math.abs(rootDur - parseFloat(target.params?.duration || 0)) <= 1.0 && (targetName.includes(rootName) || rootName.includes(targetName))) { isDup = true; type = L.tag_sim; } } }
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
                if (S.foldersFirst && a.kind !== b.kind) return a.kind === 'drive#folder' ? -1 : 1;
                let va, vb;
                if (S.sort === 'ext') {
                    va = (a.name || '').split('.').pop().toLowerCase();
                    vb = (b.name || '').split('.').pop().toLowerCase();
                } else if (S.sort === 'created_time') {
                    va = a.created_time || a.modified_time || '';
                    vb = b.created_time || b.modified_time || '';
                } else if (S.sort === 'size') {
                    va = parseInt(a.size || 0); vb = parseInt(b.size || 0);
                } else if (S.sort === 'duration') {
                    va = parseInt(a.params?.duration || 0); vb = parseInt(b.params?.duration || 0);
                } else {
                    va = a[S.sort]; vb = b[S.sort];
                }
                if (va > vb) return S.dir; if (va < vb) return -S.dir; return 0;
            });
        }
        const currentIds = new Set(S.display.filter(x => !x.isHeader).map(i => i.id));
        for (let id of S.sel) { if (!currentIds.has(id)) S.sel.delete(id); }
        if (S.sel.size === 0) UI.chkAll.checked = false;
        _render();
        _updateStat();
    }

    // ── getLinks / playVideo ──
    async function getLinks() { const res = []; for (const id of S.sel) { let item = S.items.find(x => x.id === id); if (item && !item.web_content_link) { try { item = await apiGet(id); } catch { } } if (item?.web_content_link) res.push(item); } return res; }
    async function playVideo(item) {
        let link = item.web_content_link; if (!link) { try { const m = await apiGet(item.id); link = m.web_content_link; } catch (e) { console.error(e); } }
        if (!link) { showAlert(L.msg_video_fail || "Cannot fetch video link."); return; }
        const d = document.createElement('div'); d.id = 'pk-player-ov'; d.tabIndex = 0;
        d.innerHTML = `<div style="position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,0.95);backdrop-filter:blur(5px);display:flex;justify-content:center;align-items:center;"><div style="width:95vw;height:95vh;max-width:1600px;background:#000;border-radius:8px;box-shadow:0 20px 60px rgba(0,0,0,0.8);display:flex;flex-direction:column;overflow:hidden;border:1px solid #333;"><div style="flex:0 0 40px;background:#1a1a1a;padding:0 20px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #333;"><span style="color:#ddd;font-weight:600;font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(item.name)}</span><button class="pk-close-btn" style="color:#aaa;background:none;border:none;font-size:24px;cursor:pointer;width:30px;height:30px;display:flex;align-items:center;justify-content:center;">×</button></div><div style="flex:1;background:#000;position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden;"><video src="${link}" controls autoplay playsinline preload="auto" style="width:100%;height:100%;object-fit:contain;outline:none;" onerror=\"this.parentElement.innerHTML='<div style=color:#f55;padding:20px;text-align:center>Video Load Failed.</div>';\"></video></div></div><style>.pk-close-btn:hover{color:#fff}</style></div>`;
        document.body.appendChild(d); d.focus(); d.onkeydown = (e) => { if (e.key === 'Escape') { d.remove(); e.stopPropagation(); } }; d.querySelector('.pk-close-btn').onclick = () => d.remove(); d.onclick = (e) => { if (e.target === d.firstElementChild) d.remove(); };
    }

    // ── 키보드 / 마우스 ──
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

    // ── 올가미(Lasso) 드래그 선택 ──
    const lassoEl = document.createElement('div');
    lassoEl.className = 'pk-lasso';
    lassoEl.style.display = 'none';
    document.body.appendChild(lassoEl);
    let lassoActive = false, lassoStartX = 0, lassoStartY = 0, lassoInitSel = new Set();
    UI.vp.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        if (e.target.closest('.pk-row') || e.target.closest('.pk-card') || e.target.closest('.pk-grid-hd')) return;
        lassoActive = true;
        lassoStartX = e.clientX; lassoStartY = e.clientY;
        lassoEl.style.left = lassoStartX + 'px';
        lassoEl.style.top = lassoStartY + 'px';
        lassoEl.style.width = '0px';
        lassoEl.style.height = '0px';
        lassoEl.style.display = 'block';
        if (!e.shiftKey && !e.ctrlKey && !e.metaKey) { S.sel.clear(); _render(); _updateStat(); }
        lassoInitSel = new Set(S.sel);
        document.body.style.userSelect = 'none';
    });
    document.addEventListener('mousemove', (e) => {
        if (!lassoActive) return;
        const cx = e.clientX, cy = e.clientY;
        const left = Math.min(lassoStartX, cx), top = Math.min(lassoStartY, cy);
        const width = Math.abs(cx - lassoStartX), height = Math.abs(cy - lassoStartY);
        lassoEl.style.left = left + 'px'; lassoEl.style.top = top + 'px';
        lassoEl.style.width = width + 'px'; lassoEl.style.height = height + 'px';

        const lr = lassoEl.getBoundingClientRect();
        const items = S.view === 'list' ? UI.in.querySelectorAll('.pk-row:not(.pk-group-hd)') : UI.in.querySelectorAll('.pk-card');
        items.forEach(el => {
            const id = el.dataset.id;
            if (!id) return;
            const r = el.getBoundingClientRect();
            const intersect = !(lr.right < r.left || lr.left > r.right || lr.bottom < r.top || lr.top > r.bottom);
            const shouldSelect = lassoInitSel.has(id) || intersect;
            if (shouldSelect) {
                if (!S.sel.has(id)) { S.sel.add(id); el.classList.add('sel'); const chk = el.querySelector('input'); if (chk) chk.checked = true; }
            } else {
                if (S.sel.has(id)) { S.sel.delete(id); el.classList.remove('sel'); const chk = el.querySelector('input'); if (chk) chk.checked = false; }
            }
        });
        _updateStat();
    });
    document.addEventListener('mouseup', () => {
        if (lassoActive) {
            lassoActive = false;
            lassoEl.style.display = 'none';
            document.body.style.userSelect = '';
        }
    });

    // ── 이벤트 연결 ──
    if (UI.searchInput) { UI.searchInput.oninput = (e) => { S.search = e.target.value.trim(); refresh(); }; UI.searchInput.onkeydown = (e) => { e.stopPropagation(); }; }
    UI.btnHelp.onclick = () => { const m = showModal(`<h3>${L.modal_help_title}</h3>${L.help_desc}<div class="pk-modal-act" style="margin-top:20px;"><button class="pk-btn pri" id="help_close" style="width:100%;justify-content:center;height:40px;">닫기</button></div>`); m.querySelector('#help_close').onclick = () => m.remove(); };
    UI.scan.onclick = async () => { if (S.scanning) { S.scanning = false; return; } if (!await showConfirm(L.msg_flatten_warn)) return; S.scanning = true; UI.stopBtn.onclick = () => { S.scanning = false; }; const root = S.path[S.path.length - 1]; let q = [{ id: root.id, name: root.name }]; let all = []; setLoad(true); try { while (q.length && S.scanning) { const curr = q.shift(); const pid = curr.id; updateLoadTxt(L.status_scanning.replace('{n}', all.length).replace('{f}', curr.name) + "\n" + L.loading_detail); const files = await apiList(pid, 500, (currentCount) => { updateLoadTxt(L.status_scanning.replace('{n}', all.length + currentCount).replace('{f}', curr.name)); }); for (const f of files) { if (f.kind === 'drive#folder') q.push({ id: f.id, name: f.name }); else all.push(f); } await sleep(20); } if (S.scanning) { S.items = all; UI.dup.style.display = 'flex'; refresh(); } } catch (e) { showAlert("Error: " + e.message); } finally { S.scanning = false; setLoad(false); _updateStat(); } };
    UI.dup.onclick = async () => { if (!S.dupMode) if (!await showConfirm(L.msg_dup_warn)) return; S.dupMode = !S.dupMode; UI.dup.style.backgroundColor = S.dupMode ? '#444' : ''; UI.dup.style.color = S.dupMode ? '#fff' : ''; UI.dup.style.borderColor = S.dupMode ? '#666' : ''; refresh(); };
    UI.btnDupSize.onclick = () => { S.dupSizeStrategy = S.dupSizeStrategy === 'small' ? 'large' : 'small'; UI.condSize.textContent = `(${S.dupSizeStrategy === 'small' ? L.cond_small : L.cond_large})`; S.sel.clear(); const itemMap = new Map(); S.display.forEach(d => { if (d.isHeader) return; const gIdx = S.dupGroups.get(d.id); if (gIdx !== undefined) { if (!itemMap.has(gIdx)) itemMap.set(gIdx, []); itemMap.get(gIdx).push(d); } }); itemMap.forEach(items => { if (items.length < 2) return; let keep = (S.dupSizeStrategy === 'small') ? items.reduce((a, b) => parseInt(a.size) > parseInt(b.size) ? a : b) : items.reduce((a, b) => parseInt(a.size) < parseInt(b.size) ? a : b); items.forEach(i => { if (i.id !== keep.id) S.sel.add(i.id); }); }); _render(); _updateStat(); };
    UI.btnDupDate.onclick = () => { S.dupDateStrategy = S.dupDateStrategy === 'old' ? 'new' : 'old'; UI.condDate.textContent = `(${S.dupDateStrategy === 'old' ? L.cond_old : L.cond_new})`; S.sel.clear(); const itemMap = new Map(); S.display.forEach(d => { if (d.isHeader) return; const gIdx = S.dupGroups.get(d.id); if (gIdx !== undefined) { if (!itemMap.has(gIdx)) itemMap.set(gIdx, []); itemMap.get(gIdx).push(d); } }); itemMap.forEach(items => { if (items.length < 2) return; let keep = (S.dupDateStrategy === 'old') ? items.reduce((a, b) => new Date(a.modified_time) > new Date(b.modified_time) ? a : b) : items.reduce((a, b) => new Date(a.modified_time) < new Date(b.modified_time) ? a : b); items.forEach(i => { if (i.id !== keep.id) S.sel.add(i.id); }); }); _render(); _updateStat(); };
    UI.cols.forEach(c => c.onclick = () => { const k = c.dataset.k; if (S.sort === k) S.dir *= -1; else { S.sort = k; S.dir = 1; } refresh(); });

    // ── 필터 패널 토글 ──
    const _updateFilterBadge = () => {
        const n = countActiveFilters(S.filter);
        const existing = UI.filterToggle.querySelector('.pk-filter-badge');
        if (existing) existing.remove();
        if (S.filterActive && n > 0) {
            const badge = document.createElement('span');
            badge.className = 'pk-filter-badge'; badge.textContent = n;
            UI.filterToggle.appendChild(badge);
        }
    };
    const _initFilterPanel = () => {
        UI.filterArea.innerHTML = createFilterPanelHTML(L, S.filter);
        const panel = UI.filterArea.querySelector('.pk-filter-panel');
        panel.classList.add('open');
        panel.querySelectorAll('.pk-filter-chip').forEach(ch => {
            ch.onclick = () => ch.classList.toggle('active');
        });
        panel.querySelector('#pk-filter-apply').onclick = () => {
            S.filter = readFilterFromPanel(panel);
            S.filterActive = countActiveFilters(S.filter) > 0;
            _updateFilterBadge();
            refresh();
        };
        panel.querySelector('#pk-filter-reset').onclick = () => {
            S.filter = { ...DEFAULT_FILTER };
            S.filterActive = false;
            _updateFilterBadge();
            _initFilterPanel();
            refresh();
        };
    };
    UI.filterToggle.onclick = () => {
        let panel = UI.filterArea.querySelector('.pk-filter-panel');
        if (panel) {
            panel.classList.toggle('open');
            return;
        }
        _initFilterPanel();
    };
    UI.chkAll.onclick = (e) => { if (e.target.checked) S.display.forEach(i => S.sel.add(i.id)); else S.sel.clear(); _render(); _updateStat(); };
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
            if (UI.gridZoom) UI.gridZoom.style.display = S.view === 'grid' ? 'inline-block' : 'none';
            _render();
        };
    }
    if (UI.gridZoom) {
        UI.gridZoom.oninput = (e) => {
            S.gridZoom = parseInt(e.target.value, 10);
            gmSet('pk_grid_zoom', S.gridZoom.toString());
            syncState(S);
            renderGrid();
        };
    }
    if (UI.btnLinkCopy) { UI.btnLinkCopy.onclick = async () => { if (S.sel.size === 0) { showToast(L.msg_no_selection || "선택된 항목이 없습니다."); return; } setLoad(true); try { const links = await getLinks(); if (!links.length) { showToast(L.msg_download_fail); return; } const text = links.map(f => f.web_content_link).join('\n'); if (typeof GM_setClipboard !== 'undefined') { GM_setClipboard(text); } else { await navigator.clipboard.writeText(text); } showToast(L.msg_link_copied.replace('{n}', links.length)); } catch (e) { console.error(e); showToast("복사 실패"); } finally { setLoad(false); } }; }
    UI.btnSettings.onclick = () => { const curLang = gmGet('pk_lang', lang); const curPlayer = gmGet('pk_ext_player', 'system'); const curAriaUrl = gmGet('pk_aria2_url', ''); const curAriaToken = gmGet('pk_aria2_token', ''); const curFoldersFirst = S.foldersFirst; const m = showModal(`<h3>${L.modal_settings_title}<div style="font-size:11px;color:#888;font-weight:normal;margin-top:4px;">PikPak File Manager v${version}</div></h3><div class="pk-field"><label>${L.label_lang}</label><select id="set_lang"><option value="ko" ${curLang === 'ko' ? 'selected' : ''}>한국어</option><option value="en" ${curLang === 'en' ? 'selected' : ''}>English</option><option value="ja" ${curLang === 'ja' ? 'selected' : ''}>日本語</option><option value="zh" ${curLang === 'zh' ? 'selected' : ''}>中文 (简体)</option></select></div><div class="pk-field"><label>${L.label_player}</label><select id="set_player"><option value="system" ${curPlayer === 'system' ? 'selected' : ''}>System Default</option><option value="potplayer" ${curPlayer === 'potplayer' ? 'selected' : ''}>PotPlayer</option><option value="vlc" ${curPlayer === 'vlc' ? 'selected' : ''}>VLC Player</option></select></div><div class="pk-field" style="flex-direction:row;align-items:center;gap:8px;"><input type="checkbox" id="set_folders_first" ${curFoldersFirst ? 'checked' : ''}><label for="set_folders_first" style="cursor:pointer;user-select:none;">${L.label_folders_first}</label></div><div class="pk-field"><label>${L.label_aria2_url}</label><input type="text" id="set_aria_url" value="${esc(curAriaUrl)}" placeholder="ws://localhost:6800/jsonrpc"></div><div class="pk-field"><label>${L.label_aria2_token}</label><input type="password" id="set_aria_token" value="${esc(curAriaToken)}" placeholder="Empty"></div><div class="pk-modal-act"><button class="pk-btn" id="set_cancel">${L.btn_cancel}</button><button class="pk-btn pri" id="set_save">${L.btn_save}</button></div><div class="pk-credit"><b>제작: 브랜뉴(poihoii)</b><br><a href="https://github.com/poihoii/PikPak_FileManager" target="_blank">https://github.com/poihoii/PikPak_FileManager</a></div>`); m.querySelector('#set_cancel').onclick = () => m.remove(); m.querySelector('#set_save').onclick = async () => { const newUrl = m.querySelector('#set_aria_url').value.trim(); const newToken = m.querySelector('#set_aria_token').value.trim(); const newFoldersFirst = m.querySelector('#set_folders_first').checked; const saveBtn = m.querySelector('#set_save'); gmSet('pk_folders_first', newFoldersFirst ? 'true' : 'false'); S.foldersFirst = newFoldersFirst; if (!newUrl && !newToken) { gmSet('pk_lang', m.querySelector('#set_lang').value); gmSet('pk_ext_player', m.querySelector('#set_player').value); gmSet('pk_aria2_url', ''); gmSet('pk_aria2_token', ''); showAlert(L.msg_settings_saved).then(() => location.reload()); return; } saveBtn.disabled = true; saveBtn.textContent = "..."; try { const payload = { jsonrpc: '2.0', method: 'aria2.getVersion', id: 'pk_test', params: [`token:${newToken}`] }; let testUrl = newUrl || "ws://localhost:6800/jsonrpc"; let fetchUrl = testUrl; if (fetchUrl.startsWith('ws')) fetchUrl = fetchUrl.replace('ws', 'http'); const res = await fetch(fetchUrl, { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } }); if (!res.ok) throw new Error('Network Error'); const data = await res.json(); if (data.error) throw new Error(data.error.message); gmSet('pk_lang', m.querySelector('#set_lang').value); gmSet('pk_ext_player', m.querySelector('#set_player').value); gmSet('pk_aria2_url', newUrl); gmSet('pk_aria2_token', newToken); await showAlert(L.msg_settings_saved); location.reload(); } catch (e) { console.error(e); showAlert(L.msg_aria2_check_fail); saveBtn.disabled = false; saveBtn.textContent = L.btn_save; } }; };

    // ── 컨텍스트 메뉴 ──
    const ctx = el.querySelector('#pk-ctx');
    ctx.querySelector('#ctx-open').onclick = () => { ctx.style.display = 'none'; const id = Array.from(S.sel)[0]; const item = S.items.find(i => i.id === id); if (item) { if (item.kind === 'drive#folder') { S.history.push({ path: [...S.path] }); S.path.push({ id: item.id, name: item.name }); S.forward = []; load(); } else if (item.mime_type?.startsWith('video')) playVideo(item); } };
    ctx.querySelector('#ctx-down').onclick = () => { ctx.style.display = 'none'; UI.win.querySelector('#pk-down').click(); };
    ctx.querySelector('#ctx-copy').onclick = () => { ctx.style.display = 'none'; UI.btnCopy.click(); };
    ctx.querySelector('#ctx-cut').onclick = () => { ctx.style.display = 'none'; UI.btnCut.click(); };
    ctx.querySelector('#ctx-rename').onclick = () => { ctx.style.display = 'none'; UI.btnRename.click(); };
    ctx.querySelector('#ctx-del').onclick = () => { ctx.style.display = 'none'; UI.btnDel.click(); };
    UI.btnClose.addEventListener('click', () => { el.remove(); document.removeEventListener('keydown', keyHandler); document.removeEventListener('mouseup', mouseHandler); });

    _updateStat();
    load();
}