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

    const el = createLayout(L, lang, version);
    initModal(UI.win, L);
    injectStyles();

    const sidebarOpen = gmGet('pk_sidebar_open', 'false') === 'true';
    if (sidebarOpen) {
        UI.sidebarEl.classList.add('open');
        UI.sidebarToggle.classList.add('active');
    }
    initSidebar(UI.sidebarEl, L,
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
    UI.sidebarToggle.onclick = () => {
        const isOpen = UI.sidebarEl.classList.toggle('open');
        UI.sidebarToggle.classList.toggle('active', isOpen);
        gmSet('pk_sidebar_open', isOpen ? 'true' : 'false');
    };

    const setLoad = (b) => { S.loading = b; setLoading(b, L); };
    const updateLoadTxt = (txt) => updateLoadingText(txt);
    const _updateNavState = () => { syncState(S); updateNavState(); };
    const _updateStat = () => { syncState(S); updateStat(L); };
    const _render = () => { syncState(S); render(); };

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

    async function load(isHistoryNav = false) {
        if (S.loading) return;
        setLoad(true);
        S.search = ''; if (UI.searchInput) UI.searchInput.value = '';
        const cur = S.path[S.path.length - 1];
        _updateNavState();
        UI.scan.style.display = 'flex'; UI.dup.style.display = 'none'; UI.dupTools.style.display = 'none';
        S.dupMode = false; S.lastSelIdx = -1;
        renderCrumb();
        highlightFolder(cur.id || '');
        try {
            if (!S.scanning) {
                S.loadingNav = true;
                const stopBtn = document.getElementById('pk-stop-load');
                if (stopBtn) stopBtn.onclick = () => { S.loadingNav = false; };

                const loadingMsgs = [
                    '📂 파일 목록을 불러오고 있어요...',
                    '🔍 PikPak에서 데이터를 가져오는 중...',
                    '⚡ 번개처럼 빠르게 로딩 중!',
                    '🚀 잠시만요, 곧 완료됩니다!',
                    '📡 서버와 통신 중이에요~',
                    '☕ 커피 한 잔 하는 사이에...',
                    '🎬 콘텐츠를 준비하고 있습니다!',
                    '🏗️ 파일 구조를 분석 중...',
                    '✨ 멋진 것들을 준비하고 있어요!',
                ];
                updateLoadTxt(loadingMsgs[Math.floor(Math.random() * loadingMsgs.length)]);

                S.items = await apiList(cur.id, 1000, (cnt) => {
                    updateLoadTxt(L.loading_fetch.replace('{n}', cnt));
                }, () => S.loadingNav);

                refresh();
            }
        } catch (e) {
            if (e.message !== 'AbortError') {
                console.error(e); showAlert("Failed to load: " + e.message);
            }
        } finally {
            S.loadingNav = false;
            setLoad(false);
        }

        el.focus();
    }

    async function refresh() {
        if (S.search) { const q = S.search.toLowerCase(); S.display = S.items.filter(i => i.name.toLowerCase().includes(q)); }
        else { S.display = [...S.items]; }
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
            const activeOpt = document.querySelector(`.pk-sort-opt[data-k="${S.sort}"]`);
            const sortBtnLabel = document.querySelector('#pk-sort-b .pk-sort-label');
            const sortBtnDir = document.querySelector('#pk-sort-b .pk-sort-dir-icon');
            if (activeOpt && sortBtnLabel && sortBtnDir) {
                const label = L['sort_' + S.sort.replace('_time', '')] || L['sort_' + S.sort] || activeOpt.textContent.trim().split(/\s+/)[0];
                sortBtnLabel.textContent = label;
                sortBtnDir.textContent = S.dir === 1 ? '▲' : '▼';
            }
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

    async function getLinks() { const res = []; for (const id of S.sel) { let item = S.items.find(x => x.id === id); if (item && !item.web_content_link) { try { item = await apiGet(id); } catch { } } if (item?.web_content_link) res.push(item); } return res; }
    async function playVideo(item, extraTracksHtml = '', startAt = 0, forceLang = null) {
        let link = item.web_content_link;
        if (!link || !item.medias) {
            try { setLoad(true, L); const m = await apiGet(item.id); item = m; link = m.web_content_link; setLoad(false); }
            catch (e) { console.error(e); setLoad(false); }
        }

        let streamLink = link;
        if (item.medias && item.medias.length > 0) {
            item.medias.sort((a, b) => {
                const resA = parseInt((a.video_resolution || '').replace(/\D/g, '')) || 0;
                const resB = parseInt((b.video_resolution || '').replace(/\D/g, '')) || 0;
                return resB - resA;
            });
            const bestMedia = item.medias[0];
            if (bestMedia && bestMedia.link && bestMedia.link.url) {
                streamLink = bestMedia.link.url;
            }
        }
        if (!streamLink) { showAlert(L.msg_video_fail || "Cannot fetch video link."); return; }

        const getPlyr = () => window.Plyr || (typeof unsafeWindow !== 'undefined' ? unsafeWindow.Plyr : undefined);
        const getHls = () => window.Hls || (typeof unsafeWindow !== 'undefined' ? unsafeWindow.Hls : undefined);

        let usePlyr = true;
        if (!getPlyr()) {
            setLoad(true, L);
            const css = document.createElement('link');
            css.rel = 'stylesheet'; css.href = 'https://cdnjs.cloudflare.com/ajax/libs/plyr/3.7.8/plyr.css';
            document.head.appendChild(css);

            const js = document.createElement('script');
            js.src = 'https://cdnjs.cloudflare.com/ajax/libs/plyr/3.7.8/plyr.min.js';
            document.head.appendChild(js);

            if (streamLink.includes('.m3u8') && !getHls()) {
                const hlsJs = document.createElement('script');
                hlsJs.src = 'https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.3.5/hls.min.js';
                document.head.appendChild(hlsJs);
            }

            try {
                await new Promise((resolve, reject) => {
                    js.onload = resolve;
                    js.onerror = () => reject(new Error("CDN Load Error"));
                    setTimeout(() => reject(new Error("Timeout")), 10000);
                    const stopBtn = document.getElementById('pk-stop-load');
                    if (stopBtn) stopBtn.onclick = () => reject(new Error("User Stopped"));
                });
                setLoad(false);
                await sleep(50); 
            } catch (e) {
                setLoad(false);
                usePlyr = false;
                console.warn("Plyr load failed:", e);
                showToast("Failed to load enhanced player. Using basic player instead.");
            }
        } else {
            if (!document.getElementById('pk-plyr-style')) {
                const style = document.createElement('style');
                style.id = 'pk-plyr-style';
                if (typeof GM_getResourceText !== 'undefined') {
                    try { style.textContent = GM_getResourceText('plyrCSS'); } catch (e) { }
                }
                if (!style.textContent) style.textContent = "@import url('https://cdnjs.cloudflare.com/ajax/libs/plyr/3.7.8/plyr.css');";
                document.head.appendChild(style);
            }
        }

        const baseName = item.name.replace(/\.[^/.]+$/, "");
        const subFiles = S.items.filter(i =>
            i.name.startsWith(baseName) &&
            /\.(srt|vtt|ass)$/i.test(i.name)
        );

        let tracksHtml = extraTracksHtml;
        const supportedLangs = [
            { code: 'ko', name: 'Korean' },
            { code: 'en', name: 'English' },
            { code: 'ja', name: 'Japanese' },
            { code: 'zh-CN', name: 'Chinese (Simplified)' }
        ];
        let targetLang = forceLang || (typeof GM_getValue !== 'undefined' ? (GM_getValue('pk_sub_lang') || 'ko') : 'ko');

        const processSubFile = async (text, name, isSecondary = false) => {
            let processedText = text;
            if (name.toLowerCase().endsWith('.srt')) {
                processedText = "WEBVTT\n\n" + text.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, "$1.$2");
            }

            const translateToGoogle = async (vttText, tl) => {
                const chunks = vttText.split('\n\n');
                let translatedVtt = "WEBVTT\n\n";

                const validChunks = [];
                for (let i = 1; i < chunks.length; i++) {
                    const block = chunks[i].trim();
                    if (!block) continue;
                    const lines = block.split('\n');
                    if (lines.length >= 2) {
                        const tc = lines[0];
                        const tc2 = lines[1].includes('-->') ? lines[1] : null;
                        let contentLines = tc2 ? lines.slice(2) : lines.slice(1);
                        validChunks.push({ block, tc: tc2 ? tc + '\n' + tc2 : tc, content: contentLines.join('\n') });
                    } else {
                        validChunks.push({ block, tc: null, content: null });
                    }
                }

                const BATCH_SIZE = 50;
                const DELIM = " [[###]] ";

                for (let i = 0; i < validChunks.length; i += BATCH_SIZE) {
                    const batch = validChunks.slice(i, i + BATCH_SIZE);
                    const contentsToTranslate = batch.filter(x => x.content).map(x => x.content);

                    if (contentsToTranslate.length === 0) {
                        batch.forEach(x => translatedVtt += x.block + '\n\n');
                        continue;
                    }

                    const queryText = contentsToTranslate.join(DELIM);
                    let translatedQuery = '';

                    try {
                        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${tl}&dt=t`;
                        let responseText = '';
                        if (typeof GM_xmlhttpRequest !== 'undefined') {
                            responseText = await new Promise((resolve) => {
                                GM_xmlhttpRequest({
                                    method: "POST",
                                    url: url,
                                    data: "q=" + encodeURIComponent(queryText),
                                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                                    onload: (res) => resolve(res.responseText),
                                    onerror: () => resolve('')
                                });
                            });
                        } else {
                            const res = await fetch(url, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                                body: "q=" + encodeURIComponent(queryText)
                            });
                            responseText = await res.text();
                        }

                        if (responseText) {
                            const json = JSON.parse(responseText);
                            translatedQuery = json[0].map(x => x[0] || '').join('');
                        }
                    } catch (e) { console.error('Batch translate failed', e); }

                    let translatedContents = [];
                    if (translatedQuery) {
                        translatedContents = translatedQuery.split(/[\[［]\s*[\[［]\s*[#＃]+\s*[\]］]\s*[\]］]/).map(s => s.trim());
                    }

                    let tIdx = 0;
                    for (let j = 0; j < batch.length; j++) {
                        const item = batch[j];
                        if (item.content) {
                            let transText = item.content;
                            if (translatedContents[tIdx]) {
                                transText = translatedContents[tIdx];
                            }
                            translatedVtt += item.tc + '\n' + transText + '\n\n';
                            tIdx++;
                        } else {
                            translatedVtt += item.block + '\n\n';
                        }
                    }

                    updateLoadTxt(`Translating Subtitle... ${Math.min(i + BATCH_SIZE, validChunks.length)} / ${validChunks.length}`);
                }
                return translatedVtt;
            };

            let autoTranslatedText = '';
            if (!name.toLowerCase().includes(`.${targetLang}.`)) {
                try {
                    updateLoadTxt(`Translating Subtitle...`);
                    autoTranslatedText = await translateToGoogle(processedText, targetLang);
                } catch (e) { console.error('Translating failed', e); }
            }

            const langMatch = name.match(/\.([a-zA-Z]{2,3}(-[a-zA-Z]+)?)\.(srt|vtt|ass)$/i);
            const originalLang = langMatch ? langMatch[1].toUpperCase() : `Original`;

            const originalBlob = new Blob([processedText], { type: 'text/vtt' });
            const origUrl = URL.createObjectURL(originalBlob);
            let html = `<track kind="captions" label="${originalLang} (${name})" srclang="${originalLang.toLowerCase()}" src="${origUrl}" />\n`;

            if (autoTranslatedText) {
                const trBlob = new Blob([autoTranslatedText], { type: 'text/vtt' });
                const trUrl = URL.createObjectURL(trBlob);
                const langName = supportedLangs.find(l => l.code === targetLang)?.name || targetLang;
                html += `<track kind="captions" label="${langName} (Auto)" srclang="${targetLang}" src="${trUrl}" default />\n`;
            } else {
                html = `<track kind="captions" label="${originalLang} (${name})" srclang="${originalLang.toLowerCase()}" src="${origUrl}" default />\n`;
            }
            return html;
        };

        if (subFiles.length > 0 && !extraTracksHtml) {
            setLoad(true);
            updateLoadTxt("Loading Subtitles...");
            for (let i = 0; i < subFiles.length; i++) {
                const sub = subFiles[i];
                let subLink = sub.web_content_link;
                if (!subLink) {
                    try { const m = await apiGet(sub.id); subLink = m.web_content_link; } catch (e) { }
                }
                if (subLink) {
                    try {
                        const res = await fetch(subLink);
                        const text = await res.text();
                        tracksHtml += await processSubFile(text, sub.name);
                    } catch (e) { console.warn("Sub fetch failed", e); }
                }
            }
            setLoad(false);
        }

        let langOptionsHtml = '';
        supportedLangs.forEach(l => {
            langOptionsHtml += `<option value="${l.code}" ${l.code === targetLang ? 'selected' : ''}>-> ${l.name}</option>`;
        });

        const videoList = S.items.filter(v => v.mime_type?.startsWith('video') && v.phase === 'PHASE_TYPE_COMPLETE');
        let currentVideoIdx = videoList.findIndex(v => v.id === item.id);
        const hasPrev = currentVideoIdx > 0;
        const hasNext = currentVideoIdx < videoList.length - 1;

        let d = document.getElementById('pk-player-ov');
        const isReuse = !!d;
        if (!isReuse) {
            d = document.createElement('div');
            d.id = 'pk-player-ov'; d.tabIndex = 0;
            document.body.appendChild(d);
        }

        let playlistHTML = '';
        videoList.forEach((v, idx) => {
            const isCur = idx === currentVideoIdx;
            playlistHTML += `<div class="pk-pl-item ${isCur ? 'active' : ''}" data-idx="${idx}" style="padding:8px 12px;cursor:pointer;font-size:12px;border-bottom:1px solid #222;display:flex;align-items:center;gap:8px;color:${isCur ? 'var(--pk-pri)' : '#ccc'};background:${isCur ? 'rgba(76,194,255,0.08)' : 'transparent'};transition:background 0.15s;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"><span style="color:#555;font-size:10px;min-width:24px;">${idx + 1}</span><span style="overflow:hidden;text-overflow:ellipsis;">${esc(v.name)}</span></div>`;
        });

        if (!isReuse) {
            d.innerHTML = `<div style="position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,0.95);backdrop-filter:blur(5px);display:flex;justify-content:center;align-items:center;">
                <div style="width:95vw;height:95vh;max-width:1600px;background:#000;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,0.8);display:flex;flex-direction:column;overflow:hidden;border:1px solid #333;">
                    <div style="flex:0 0 48px;background:#111;padding:0 20px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #222; z-index: 10;">
                        <div style="color:#eee;font-weight:600;font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:flex;align-items:center;gap:12px;min-width:0;flex:1;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--pk-pri)" style="flex-shrink:0;"><path d="M8 5v14l11-7z"/></svg>
                            <span id="pk-player-title" style="overflow:hidden;text-overflow:ellipsis;">${esc(item.name)}</span>
                            <span style="font-size:11px;color:#555;flex-shrink:0;">${currentVideoIdx >= 0 ? `${currentVideoIdx + 1}/${videoList.length}` : ''}</span>
                        </div>

                        <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">
                            <div style="display:flex;align-items:center;gap:2px;background:rgba(255,255,255,0.05);border-radius:4px;padding:2px 4px;border:1px solid rgba(255,255,255,0.1);">
                                <button id="pk-player-prev" title="이전 영상" style="background:none;border:none;color:${hasPrev ? '#ccc' : '#333'};cursor:${hasPrev ? 'pointer' : 'default'};font-size:16px;padding:4px 6px;transition:all 0.2s;border-radius:3px;" ${hasPrev ? '' : 'disabled'}>⏮</button>
                                <button id="pk-player-next" title="다음 영상" style="background:none;border:none;color:${hasNext ? '#ccc' : '#333'};cursor:${hasNext ? 'pointer' : 'default'};font-size:16px;padding:4px 6px;transition:all 0.2s;border-radius:3px;" ${hasNext ? '' : 'disabled'}>⏭</button>
                                <button id="pk-player-shuffle" title="랜덤 재생" style="background:none;border:none;color:#666;cursor:pointer;font-size:14px;padding:4px 6px;transition:all 0.2s;border-radius:3px;">🎲</button>
                                <button id="pk-player-playlist" title="재생 목록" style="background:none;border:none;color:#666;cursor:pointer;font-size:14px;padding:4px 6px;transition:all 0.2s;border-radius:3px;">📃</button>
                            </div>
                            <div style="width:1px;height:20px;background:#333;"></div>
                            <button id="pk-player-sub" title="자막 설정" style="background:none;border:none;color:#888;cursor:pointer;font-size:13px;padding:4px 8px;transition:all 0.2s;border-radius:4px;border:1px solid #333;position:relative;">🔤 자막</button>
                            <div id="pk-sub-menu" style="display:none;position:absolute;top:48px;right:100px;background:#1a1a1a;border:1px solid #333;border-radius:6px;box-shadow:0 8px 24px rgba(0,0,0,0.5);z-index:999;min-width:240px;padding:6px 0;">
                                <div style="padding:8px 14px;font-size:11px;color:#666;font-weight:600;border-bottom:1px solid #222;">${L.lbl_sub_settings}</div>
                                <div style="padding:8px 14px;display:flex;align-items:center;gap:8px;cursor:pointer;color:#ccc;transition:background 0.15s;font-size:12px;" id="pk-sub-menu-lang" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2zm-2.62 7l1.62-4.33L19.12 17z"/></svg>
                                    <span>${L.lbl_sub_lang}:</span>
                                    <select id="pk-sub-lang-sel" style="background:#222;color:#eee;border:1px solid #444;border-radius:3px;font-size:11px;padding:2px 4px;outline:none;cursor:pointer;flex:1;">
                                        ${langOptionsHtml}
                                    </select>
                                </div>
                                <div style="padding:8px 14px;display:flex;align-items:center;gap:8px;color:#ccc;font-size:12px;">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12.75 12a.75.75 0 0 1-.75.75H4.5a.75.75 0 0 1 0-1.5h7.5a.75.75 0 0 1 .75.75Zm9 0a.75.75 0 0 1-.75.75h-7.5a.75.75 0 0 1 0-1.5h7.5a.75.75 0 0 1 .75.75ZM7.5 7a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 7.5 7Zm12 0a.75.75 0 0 1-.75.75H12.75a.75.75 0 0 1 0-1.5h6a.75.75 0 0 1 .75.75Zm-15 10a.75.75 0 0 1-.75.75H3.75a.75.75 0 0 1 0-1.5h.75a.75.75 0 0 1 .75.75Zm14.25 0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1 0-1.5h9a.75.75 0 0 1 .75.75Z" /></svg>
                                    <span>${L.lbl_sub_size}:</span>
                                    <input type="range" id="pk-sub-size-sel" min="12" max="48" value="${typeof GM_getValue !== 'undefined' ? GM_getValue('pk_sub_size', 20) : 20}" style="flex:1;cursor:pointer;height:2px;accent-color:var(--pk-pri);">
                                    <span id="pk-sub-size-val" style="min-width:32px;text-align:right;font-size:10px;color:#888;">${typeof GM_getValue !== 'undefined' ? GM_getValue('pk_sub_size', 20) : 20}px</span>
                                </div>
                                <label style="padding:8px 14px;display:flex;align-items:center;gap:8px;cursor:pointer;color:#ccc;transition:background 0.15s;font-size:12px;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/></svg>
                                    <span>${L.lbl_sub_load_local}</span>
                                    <input type="file" id="pk-local-sub" accept=".srt,.vtt,.ass" style="display:none;" />
                                </label>
                            </div>
                            <button id="pk-player-ext" title="외부 플레이어로 열기" style="background:none;border:none;color:#888;cursor:pointer;font-size:13px;padding:4px 8px;transition:all 0.2s;border-radius:4px;border:1px solid #333;">🖥️</button>
                            <button class="pk-close-btn" title="닫기 (Esc)" style="color:#aaa;background:none;border:none;font-size:28px;cursor:pointer;width:36px;height:36px;display:flex;align-items:center;justify-content:center;transition:color 0.2s;line-height:1;">×</button>
                        </div>
                    </div>
                    <div style="flex:1;display:flex;overflow:hidden;">
                        <div style="flex:1;background:#000;position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden;" id="pk-vid-con">
                            <video id="pk-plyr-vid" playsinline controls autoplay preload="auto" crossorigin="anonymous" style="width:100%;height:100%;">
                                ${tracksHtml}
                            </video>
                        </div>
                        <div id="pk-playlist-panel" style="width:280px;background:#0a0a0a;border-left:1px solid #222;display:none;flex-direction:column;flex-shrink:0;">
                            <div style="padding:10px 14px;border-bottom:1px solid #222;font-size:12px;font-weight:600;color:#888;display:flex;justify-content:space-between;align-items:center;">
                                <span>🎥 재생 목록 (${videoList.length})</span>
                            </div>
                            <div id="pk-playlist-list" style="flex:1;overflow-y:auto;">${playlistHTML}</div>
                        </div>
                    </div>
                </div>
                <style>
                    .pk-close-btn:hover{color:#fff}
                    #pk-player-ov .plyr { width: 100%; height: 100%; }
                    #pk-player-ov .plyr__video-wrapper { height: 100%; width: 100%; background: #000; }
                    #pk-player-ov video { max-height: 100%; width: 100%; object-fit: contain; }
                    #pk-player-ov .plyr__caption { font-size: var(--pk-sub-size, ${typeof GM_getValue !== 'undefined' ? GM_getValue('pk_sub_size', 20) : 20}px) !important; text-shadow: 0 0 4px rgba(0,0,0,1), 0 0 8px rgba(0,0,0,0.8) !important; }
                    .pk-sub-load-btn:hover { color: #fff !important; }
                    #pk-player-prev:not(:disabled):hover, #pk-player-next:not(:disabled):hover { color: #fff !important; background: rgba(255,255,255,0.1); }
                    #pk-player-shuffle:hover, #pk-player-playlist:hover, #pk-player-ext:hover { color: #fff !important; background: rgba(255,255,255,0.1); }
                    #pk-player-shuffle.active { color: var(--pk-pri) !important; background: rgba(76,194,255,0.15); }
                    #pk-player-playlist.active { color: var(--pk-pri) !important; background: rgba(76,194,255,0.15); }
                    .pk-pl-item:hover { background: rgba(255,255,255,0.06) !important; }
                    .pk-pl-item.active { font-weight: 600; }
                    #pk-playlist-panel::-webkit-scrollbar, #pk-playlist-list::-webkit-scrollbar { width: 4px; }
                    #pk-playlist-list::-webkit-scrollbar-thumb { background: #444; border-radius: 2px; }
                </style>
            </div>`;
        } else {
            d.querySelector('#pk-player-title').textContent = item.name;
            d.querySelector('#pk-player-title').nextElementSibling.textContent = currentVideoIdx >= 0 ? `${currentVideoIdx + 1}/${videoList.length}` : '';
            d.querySelector('#pk-playlist-list').innerHTML = playlistHTML;
            const pBtn = d.querySelector('#pk-player-prev');
            pBtn.disabled = !hasPrev;
            pBtn.style.color = hasPrev ? '#ccc' : '#333';
            pBtn.style.cursor = hasPrev ? 'pointer' : 'default';
            const nBtn = d.querySelector('#pk-player-next');
            nBtn.disabled = !hasNext;
            nBtn.style.color = hasNext ? '#ccc' : '#333';
            nBtn.style.cursor = hasNext ? 'pointer' : 'default';
            const vc = d.querySelector('#pk-vid-con');
            if (vc) vc.innerHTML = `<video id="pk-plyr-vid" playsinline controls autoplay preload="auto" crossorigin="anonymous" style="width:100%;height:100%;">${tracksHtml}</video>`;
        }
        d.focus();

        setTimeout(() => {
            const activeItem = d.querySelector('.pk-pl-item.active');
            if (activeItem) activeItem.scrollIntoView({ block: 'center' });
        }, 100);

        const vidEl = d.querySelector('#pk-plyr-vid');
        let player = null;

        const langSel = d.querySelector('#pk-sub-lang-sel');
        const subSizeSel = d.querySelector('#pk-sub-size-sel');
        const subSizeVal = d.querySelector('#pk-sub-size-val');
        if (subSizeSel && subSizeVal) {
            subSizeSel.oninput = (e) => {
                const val = e.target.value;
                subSizeVal.textContent = val + 'px';
                document.documentElement.style.setProperty('--pk-sub-size', val + 'px');
            };
            subSizeSel.onchange = (e) => {
                if (typeof GM_setValue !== 'undefined') GM_setValue('pk_sub_size', e.target.value);
            };
            document.documentElement.style.setProperty('--pk-sub-size', subSizeSel.value + 'px');
        }

        langSel.onchange = (e) => {
            const newLang = e.target.value;
            targetLang = newLang; 
            if (typeof GM_setValue !== 'undefined') GM_setValue('pk_sub_lang', newLang);
            showToast(`Auto Translate Target: ${e.target.options[e.target.selectedIndex].text}`);

            const curTime = player ? player.currentTime : vidEl.currentTime;

            setLoad(true);
            updateLoadTxt('Restarting Player & Subtitles...');

            setTimeout(() => {
                if (player) player.destroy();
                playVideo(item, '', curTime, newLang);
            }, 100);
        };

        const manualSubInput = d.querySelector('#pk-local-sub');
        if (manualSubInput) {
            manualSubInput.onchange = async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                try {
                    setLoad(true);
                    updateLoadTxt(`Loading Local Sub...`);
                    const text = await file.text();
                    const html = await processSubFile(text, file.name, true);

                    let existingTracksHtml = '';
                    vidEl.querySelectorAll('track').forEach(t => existingTracksHtml += t.outerHTML);

                    const curTime = player ? player.currentTime : vidEl.currentTime;
                    if (player) player.destroy();
                    playVideo(item, existingTracksHtml + '\n' + html, curTime);
                    showToast("Local Subtitle Loaded!");
                } catch (err) { }
                finally { setLoad(false); }
            };
        }

        const initPlyr = () => {
            const PlyrFn = getPlyr();
            if (usePlyr && PlyrFn) {
                player = new PlyrFn(vidEl, {
                    controls: ['play-large', 'restart', 'rewind', 'play', 'fast-forward', 'progress', 'current-time', 'duration', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'],
                    settings: ['captions', 'quality', 'speed', 'loop'],
                    autoplay: true,
                    captions: { active: true, update: true },
                    keyboard: { focused: true, global: true }
                });
                player.on('ready', () => {
                    setTimeout(() => {
                        if (player) {
                            player.captions.active = true;
                            if (targetLang) {
                                player.language = targetLang;
                            }
                        }
                    }, 500);
                });
            }
        };

        const HlsFn = getHls();
        if (streamLink.includes('.m3u8') && HlsFn && HlsFn.isSupported()) {
            const hls = new HlsFn();
            hls.loadSource(streamLink);
            hls.attachMedia(vidEl);
            hls.on(HlsFn.Events.MANIFEST_PARSED, function () {
                initPlyr();
                if (startAt > 0) setTimeout(() => { if (player) player.currentTime = startAt; else vidEl.currentTime = startAt; }, 200);
            });
        } else {
            const source = document.createElement('source');
            source.src = streamLink;
            source.type = item.mime_type || 'video/mp4';
            vidEl.appendChild(source);
            initPlyr();
            if (startAt > 0) setTimeout(() => { if (player) player.currentTime = startAt; else vidEl.currentTime = startAt; }, 100);
        }

        const closePlayer = () => {
            if (player) player.destroy();
            d.remove();
        };

        const playByIndex = (idx) => {
            if (idx < 0 || idx >= videoList.length) return;
            if (player) player.destroy();
            playVideo(videoList[idx]);
        };
        const prevBtn = d.querySelector('#pk-player-prev');
        const nextBtn = d.querySelector('#pk-player-next');
        if (prevBtn && !prevBtn.disabled) prevBtn.onclick = () => playByIndex(currentVideoIdx - 1);
        if (nextBtn && !nextBtn.disabled) nextBtn.onclick = () => playByIndex(currentVideoIdx + 1);

        d.querySelector('#pk-player-shuffle').onclick = () => {
            if (videoList.length <= 1) return;
            let rndIdx;
            do { rndIdx = Math.floor(Math.random() * videoList.length); } while (rndIdx === currentVideoIdx);
            playByIndex(rndIdx);
        };

        const plPanel = d.querySelector('#pk-playlist-panel');
        const plToggle = d.querySelector('#pk-player-playlist');
        plToggle.onclick = () => {
            const isOpen = plPanel.style.display === 'flex';
            plPanel.style.display = isOpen ? 'none' : 'flex';
            plToggle.classList.toggle('active', !isOpen);
        };
        d.querySelector('#pk-playlist-list').onclick = (e) => {
            const itemEl = e.target.closest('.pk-pl-item');
            if (!itemEl) return;
            playByIndex(parseInt(itemEl.dataset.idx));
        };

        vidEl.addEventListener('ended', () => {
            if (currentVideoIdx < videoList.length - 1) {
                playByIndex(currentVideoIdx + 1);
            }
        });

        const subBtn = d.querySelector('#pk-player-sub');
        const subMenu = d.querySelector('#pk-sub-menu');
        if (subBtn && subMenu) {
            subBtn.onclick = (e) => {
                e.stopPropagation();
                const isOpen = subMenu.style.display !== 'none';
                subMenu.style.display = isOpen ? 'none' : 'block';
                subBtn.classList.toggle('active', !isOpen);
            };
            d.onclick = (e) => {
                if (!subMenu.contains(e.target) && e.target !== subBtn) subMenu.style.display = 'none';
            };
        }

        const extBtn = d.querySelector('#pk-player-ext');
        const extPlayer = gmGet('pk_ext_player', 'potplayer');
        const extLabel = extPlayer === 'vlc' ? 'VLC' : 'PotPlayer';
        extBtn.textContent = `🖥️ ${extLabel}`;
        extBtn.onclick = () => {
            const scheme = extPlayer === 'vlc' ? 'vlc://' : 'potplayer://';
            window.open(scheme + streamLink, '_self');
        };

        d.onkeydown = (e) => { if (e.key === 'Escape') { closePlayer(); e.stopPropagation(); } };
        d.querySelector('.pk-close-btn').onclick = closePlayer;
        d.onclick = (e) => {
            if (e.target === d.firstElementChild) closePlayer();
            else if (!subMenu.contains(e.target) && e.target !== subBtn) subMenu.style.display = 'none';
        };
    }

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

    document.addEventListener('mouseenter', (e) => {
        const t = e.target.closest('[title]');
        if (!t) return;
        if (!t.closest('.pk-ov') && !t.closest('#pk-player-ov')) return;
        if (t.tagName === 'INPUT' || t.tagName === 'SELECT' || t.tagName === 'TEXTAREA') return;
        if (!t.dataset.tip) {
            t.dataset.tip = t.getAttribute('title');
            t.removeAttribute('title');
            const rect = t.getBoundingClientRect();
            if (rect.left < 100) t.classList.add('tip-r');
            else if (window.innerWidth - rect.right < 100) t.classList.add('tip-l');
            if (t.closest('#pk-player-ov')) {
                const header = t.closest('div[style*="flex:0 0 48px"]');
                if (header) t.classList.add('tip-down');
            }
        }
    }, true);

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

    if (UI.searchInput) {
        UI.searchInput.oninput = (e) => { S.search = e.target.value.trim(); refresh(); };
        UI.searchInput.onkeydown = async (e) => {
            e.stopPropagation();
            if (e.key === 'Enter') {
                e.preventDefault();
                const q = e.target.value.trim();
                if (!q) return;
                S.scanning = true;
                setLoad(true);
                UI.stopBtn.onclick = () => { S.scanning = false; setLoad(false); };
                try {
                    let searchQueue = [{ id: '', name: L.lbl_root || 'Root' }];
                    let allFiles = [];
                    let matchCount = 0;
                    const lq = q.toLowerCase();

                    updateLoadTxt(L.loading_searching || 'Searching...');

                    while (searchQueue.length && S.scanning) {
                        const curr = searchQueue.shift();
                        updateLoadTxt(L.status_scanning.replace('{n}', matchCount).replace('{s}', allFiles.length).replace('{f}', curr.name));

                        const files = await apiList(curr.id, 500, (currentCount) => {
                            updateLoadTxt(L.status_scanning.replace('{n}', matchCount).replace('{s}', allFiles.length + currentCount).replace('{f}', curr.name));
                        });

                        for (const f of files) {
                            if (f.kind === 'drive#folder') {
                                searchQueue.push({ id: f.id, name: f.name });
                            } else {
                                allFiles.push(f);
                                if ((f.name || '').toLowerCase().includes(lq)) {
                                    matchCount++;
                                }
                            }
                        }
                        await sleep(20);
                    }

                    if (S.scanning) {
                        S.items = allFiles.filter(i => (i.name || '').toLowerCase().includes(lq));
                        S.path = [{ id: '', name: `Global Search: "${q}"` }];
                        S.search = '';
                        UI.searchInput.value = '';
                        refresh();
                    }
                } catch (err) {
                    showAlert("Search error: " + err.message);
                } finally {
                    S.scanning = false;
                    setLoad(false);
                }
            }
        };
    }
    UI.btnHelp.onclick = () => {
        const m = showModal(`
            <h3 style="margin-bottom:16px;">${L.modal_help_title}</h3>
            <div style="max-height:70vh;overflow-y:auto;font-size:13px;line-height:1.7;">
                ${L.help_desc}
            </div>
            <div class="pk-modal-act" style="margin-top:20px;"><button class="pk-btn pri" id="help_close" style="width:100%;justify-content:center;height:40px;">닫기</button></div>
        `);
        m.querySelector('#help_close').onclick = () => m.remove();
    };
    UI.scan.onclick = async () => {
        if (S.scanning) { S.scanning = false; return; }
        if (!await showConfirm(L.msg_flatten_warn)) return;
        S.scanning = true;
        UI.stopBtn.onclick = () => { S.scanning = false; };
        const root = S.path[S.path.length - 1];
        let q = [{ id: root.id, name: root.name }];
        let all = [];
        setLoad(true);
        try {
            while (q.length && S.scanning) {
                const curr = q.shift();
                updateLoadTxt(L.status_scanning.replace('{n}', all.length).replace('{s}', all.length).replace('{f}', curr.name));
                const files = await apiList(curr.id, 500, (currentCount) => {
                    updateLoadTxt(L.status_scanning.replace('{n}', all.length + currentCount).replace('{s}', all.length + currentCount).replace('{f}', curr.name));
                });
                for (const f of files) {
                    if (f.kind === 'drive#folder') q.push({ id: f.id, name: f.name });
                    else all.push(f);
                }
                await sleep(20);
            }
            if (S.scanning) { S.items = all; UI.dup.style.display = 'flex'; refresh(); }
        } catch (e) { showAlert("Error: " + e.message); }
        finally { S.scanning = false; setLoad(false); _updateStat(); }
    };
    UI.dup.onclick = async () => { if (!S.dupMode) if (!await showConfirm(L.msg_dup_warn)) return; S.dupMode = !S.dupMode; UI.dup.style.backgroundColor = S.dupMode ? '#444' : ''; UI.dup.style.color = S.dupMode ? '#fff' : ''; UI.dup.style.borderColor = S.dupMode ? '#666' : ''; refresh(); };
    UI.btnDupSize.onclick = () => { S.dupSizeStrategy = S.dupSizeStrategy === 'small' ? 'large' : 'small'; UI.condSize.textContent = `(${S.dupSizeStrategy === 'small' ? L.cond_small : L.cond_large})`; S.sel.clear(); const itemMap = new Map(); S.display.forEach(d => { if (d.isHeader) return; const gIdx = S.dupGroups.get(d.id); if (gIdx !== undefined) { if (!itemMap.has(gIdx)) itemMap.set(gIdx, []); itemMap.get(gIdx).push(d); } }); itemMap.forEach(items => { if (items.length < 2) return; let keep = (S.dupSizeStrategy === 'small') ? items.reduce((a, b) => parseInt(a.size) > parseInt(b.size) ? a : b) : items.reduce((a, b) => parseInt(a.size) < parseInt(b.size) ? a : b); items.forEach(i => { if (i.id !== keep.id) S.sel.add(i.id); }); }); _render(); _updateStat(); };
    UI.btnDupDate.onclick = () => { S.dupDateStrategy = S.dupDateStrategy === 'old' ? 'new' : 'old'; UI.condDate.textContent = `(${S.dupDateStrategy === 'old' ? L.cond_old : L.cond_new})`; S.sel.clear(); const itemMap = new Map(); S.display.forEach(d => { if (d.isHeader) return; const gIdx = S.dupGroups.get(d.id); if (gIdx !== undefined) { if (!itemMap.has(gIdx)) itemMap.set(gIdx, []); itemMap.get(gIdx).push(d); } }); itemMap.forEach(items => { if (items.length < 2) return; let keep = (S.dupDateStrategy === 'old') ? items.reduce((a, b) => new Date(a.modified_time) > new Date(b.modified_time) ? a : b) : items.reduce((a, b) => new Date(a.modified_time) < new Date(b.modified_time) ? a : b); items.forEach(i => { if (i.id !== keep.id) S.sel.add(i.id); }); }); _render(); _updateStat(); };
    UI.cols.forEach(c => c.onclick = () => { const k = c.dataset.k; if (S.sort === k) S.dir *= -1; else { S.sort = k; S.dir = 1; } refresh(); });

    document.addEventListener('click', (e) => {
        const ddBtn = e.target.closest('#pk-sort-b');
        const opt = e.target.closest('.pk-sort-opt');
        const menu = document.getElementById('pk-sort-m');

        if (ddBtn && menu) {
            e.stopPropagation();
            menu.classList.toggle('open');
            menu.querySelectorAll('.pk-sort-opt').forEach(o => o.classList.remove('active'));
            menu.querySelectorAll('.pk-sort-dir').forEach(o => o.textContent = '');
            const initOpt = menu.querySelector(`.pk-sort-opt[data-k="${S.sort}"]`);
            if (initOpt) {
                initOpt.classList.add('active');
                const initDir = initOpt.querySelector('.pk-sort-dir');
                if (initDir) initDir.textContent = (S.dir === 1 ? ' ▲' : ' ▼');
            }
        } else if (opt && menu && menu.contains(opt)) {
            const k = opt.dataset.k;
            if (S.sort === k) S.dir *= -1; else { S.sort = k; S.dir = 1; }
            refresh();
            menu.classList.remove('open');
        } else if (menu && !e.target.closest('#pk-sort-dd')) {
            menu.classList.remove('open');
        }
    });

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
    UI.btnBulkRename.onclick = () => { if (S.sel.size < 2) return; const m = showModal(`<h3>${L.modal_rename_multi_title}</h3><div class="pk-field"><label><input type="radio" name="rn_mode" value="pattern" checked> ${L.label_pattern}</label><input type="text" id="rn_pattern" value="Video {n}" placeholder="Video {n}"></div><div class="pk-field" style="margin-top:10px"><label><input type="radio" name="rn_mode" value="replace"> ${L.label_replace} <span style="font-size:11px;color:#888">${L.label_replace_note}</span></label><input type="text" id="rn_find" placeholder="${L.placeholder_find}" disabled><input type="text" id="rn_rep" placeholder="${L.placeholder_replace}" disabled></div><div style="margin-top: 15px; border: 1px solid var(--pk-bd); border-radius: 4px; max-height: 200px; display: flex; flex-direction: column; overflow: hidden; background: var(--pk-bg);"><div style="padding: 6px 10px; border-bottom: 1px solid var(--pk-bd); background: var(--pk-gh); font-size: 12px; font-weight: bold; flex-shrink: 0; color: var(--pk-gh-fg);">미리보기 (Preview)</div><div id="rn_live_preview" style="padding: 6px 10px; font-size: 11px; overflow-y: auto; display: flex; flex-direction: column; gap: 4px;"></div></div><div class="pk-modal-act" style="margin-top: 15px;"><button class="pk-btn" id="rn_cancel">${L.btn_cancel}</button><button class="pk-btn pri" id="rn_confirm">${L.btn_confirm}</button></div>`); const radios = m.querySelectorAll('input[name="rn_mode"]'); const inpPattern = m.querySelector('#rn_pattern'); const inpFind = m.querySelector('#rn_find'); const inpRep = m.querySelector('#rn_rep'); const previewBox = m.querySelector('#rn_live_preview'); const btnConfirm = m.querySelector('#rn_confirm'); let currentChanges = []; const updatePreview = () => { const mode = m.querySelector('input[name="rn_mode"]:checked').value; const pattern = inpPattern.value; const findStr = inpFind.value; const repStr = inpRep.value || ''; let idx = 1; const changes = []; const existingNames = new Set(S.items.map(i => i.name)); let errorMsg = null; for (const id of S.sel) { const item = S.items.find(x => x.id === id); if (!item) continue; let base = item.name; let ext = ""; if (item.kind !== 'drive#folder' && item.name.lastIndexOf('.') > 0) { base = item.name.substring(0, item.name.lastIndexOf('.')); ext = item.name.substring(item.name.lastIndexOf('.')); } let newBase = base; if (mode === 'pattern') { if (pattern) newBase = pattern.split('{n}').join(idx++); } else { if (findStr && base.includes(findStr)) newBase = base.split(findStr).join(repStr); } const finalName = newBase + ext; if (finalName !== item.name) { if (existingNames.has(finalName)) { errorMsg = L.msg_name_exists.replace('{n}', finalName); } changes.push({ id: item.id, old: item.name, new: finalName }); existingNames.add(finalName); } } currentChanges = changes; if (errorMsg) { previewBox.innerHTML = `<div style="color: red; font-weight: bold">${esc(errorMsg)}</div>`; btnConfirm.disabled = true; } else if (changes.length === 0) { previewBox.innerHTML = `<div style="color: #888">No changes detected.</div>`; btnConfirm.disabled = true; } else { previewBox.innerHTML = changes.map(c => `<div style="display:flex; justify-content:space-between; border-bottom: 1px solid var(--pk-bd); padding-bottom: 2px;"><span style="flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; opacity:0.7;" title="${esc(c.old)}">${esc(c.old)}</span><span style="margin:0 10px;color:#888;">→</span><span style="flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; color:var(--pk-pri); font-weight:600;" title="${esc(c.new)}">${esc(c.new)}</span></div>`).join(''); btnConfirm.disabled = false; } }; const attachLiveEvent = (el) => el.addEventListener('input', updatePreview); attachLiveEvent(inpPattern); attachLiveEvent(inpFind); attachLiveEvent(inpRep); radios.forEach(r => r.onchange = () => { const isPat = r.value === 'pattern'; inpPattern.disabled = !isPat; inpFind.disabled = isPat; inpRep.disabled = isPat; updatePreview(); }); m.querySelector('#rn_cancel').onclick = () => m.remove(); btnConfirm.onclick = async () => { if (currentChanges.length === 0) return; setLoad(true); let count = 0; try { for (const c of currentChanges) { await apiAction('/' + c.id, { name: c.new }); count++; await sleep(50); } showToast(L.msg_bulkrename_done.replace('{n}', count)); load(); } catch (e) { showAlert("Rename Error: " + e.message); } finally { setLoad(false); m.remove(); } }; updatePreview(); };
    UI.btnExt.onclick = async () => { const player = gmGet('pk_ext_player', 'potplayer'); if (S.sel.size === 0) { showToast(L.msg_no_selection || '선택된 항목이 없습니다.'); return; } if (S.sel.size > 1) { const files = await getLinks(); if (!files.length) { showAlert(L.msg_download_fail); return; } let m3u = '#EXTM3U\n'; files.forEach(f => { m3u += `#EXTINF:-1,${f.name}\n${f.web_content_link}\n`; }); const blob = new Blob([m3u], { type: 'audio/x-mpegurl' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `pikpak_playlist_${Date.now()}.m3u`; a.click(); showAlert(L.msg_batch_m3u); } else { const files = await getLinks(); if (!files.length) { showAlert(L.msg_download_fail); return; } window.open((player === 'vlc' ? 'vlc://' : 'potplayer://') + files[0].web_content_link, '_self'); } };
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
    UI.btnSettings.onclick = () => { const curLang = gmGet('pk_lang', lang); const curPlayer = gmGet('pk_ext_player', 'potplayer'); const curAriaUrl = gmGet('pk_aria2_url', ''); const curAriaToken = gmGet('pk_aria2_token', ''); const curFoldersFirst = S.foldersFirst; const m = showModal(`<h3>${L.modal_settings_title}<div style="font-size:11px;color:#888;font-weight:normal;margin-top:4px;">PikPak File Manager v${version}</div></h3><div class="pk-field"><label>${L.label_lang}</label><select id="set_lang"><option value="ko" ${curLang === 'ko' ? 'selected' : ''}>한국어</option><option value="en" ${curLang === 'en' ? 'selected' : ''}>English</option><option value="ja" ${curLang === 'ja' ? 'selected' : ''}>日本語</option><option value="zh" ${curLang === 'zh' ? 'selected' : ''}>中文 (简体)</option></select></div><div class="pk-field"><label>${L.label_player}</label><select id="set_player"><option value="potplayer" ${curPlayer === 'potplayer' ? 'selected' : ''}>PotPlayer</option><option value="vlc" ${curPlayer === 'vlc' ? 'selected' : ''}>VLC Player</option></select></div><div class="pk-field" style="flex-direction:row;align-items:center;gap:8px;"><input type="checkbox" id="set_folders_first" ${curFoldersFirst ? 'checked' : ''}><label for="set_folders_first" style="cursor:pointer;user-select:none;">${L.label_folders_first}</label></div><div class="pk-field"><label>${L.label_aria2_url}</label><input type="text" id="set_aria_url" name="pk_aria2_addr" autocomplete="off" value="${esc(curAriaUrl)}" placeholder="ws://localhost:6800/jsonrpc"></div><div class="pk-field"><label>${L.label_aria2_token}</label><input type="text" id="set_aria_token" name="pk_aria2_tok" autocomplete="off" value="${esc(curAriaToken)}" placeholder="Empty"></div><div class="pk-modal-act"><button class="pk-btn" id="set_cancel">${L.btn_cancel}</button><button class="pk-btn pri" id="set_save">${L.btn_save}</button></div><div class="pk-credit"><b>제작: 브랜뉴(poihoii)</b><br><a href="https://github.com/poihoii/PikPak_FileManager" target="_blank">https://github.com/poihoii/PikPak_FileManager</a></div>`); m.querySelector('#set_cancel').onclick = () => m.remove(); m.querySelector('#set_save').onclick = async () => { const newUrl = m.querySelector('#set_aria_url').value.trim(); const newToken = m.querySelector('#set_aria_token').value.trim(); const newFoldersFirst = m.querySelector('#set_folders_first').checked; const saveBtn = m.querySelector('#set_save'); gmSet('pk_folders_first', newFoldersFirst ? 'true' : 'false'); S.foldersFirst = newFoldersFirst; if (!newUrl && !newToken) { gmSet('pk_lang', m.querySelector('#set_lang').value); gmSet('pk_ext_player', m.querySelector('#set_player').value); gmSet('pk_aria2_url', ''); gmSet('pk_aria2_token', ''); showAlert(L.msg_settings_saved).then(() => location.reload()); return; } saveBtn.disabled = true; saveBtn.textContent = "..."; try { const payload = { jsonrpc: '2.0', method: 'aria2.getVersion', id: 'pk_test', params: [`token:${newToken}`] }; let testUrl = newUrl || "ws://localhost:6800/jsonrpc"; let fetchUrl = testUrl; if (fetchUrl.startsWith('ws')) fetchUrl = fetchUrl.replace('ws', 'http'); const res = await fetch(fetchUrl, { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } }); if (!res.ok) throw new Error('Network Error'); const data = await res.json(); if (data.error) throw new Error(data.error.message); gmSet('pk_lang', m.querySelector('#set_lang').value); gmSet('pk_ext_player', m.querySelector('#set_player').value); gmSet('pk_aria2_url', newUrl); gmSet('pk_aria2_token', newToken); await showAlert(L.msg_settings_saved); location.reload(); } catch (e) { console.error(e); showAlert(L.msg_aria2_check_fail); saveBtn.disabled = false; saveBtn.textContent = L.btn_save; } }; };

    const ctx = el.querySelector('#pk-ctx');
    ctx.querySelector('#ctx-open').onclick = () => { ctx.style.display = 'none'; const id = Array.from(S.sel)[0]; const item = S.items.find(i => i.id === id); if (item) { if (item.kind === 'drive#folder') { S.history.push({ path: [...S.path] }); S.path.push({ id: item.id, name: item.name }); S.forward = []; load(); } else if (item.mime_type?.startsWith('video')) playVideo(item); } };
    ctx.querySelector('#ctx-ext-play').onclick = async () => { ctx.style.display = 'none'; const id = Array.from(S.sel)[0]; const item = S.items.find(i => i.id === id); if (!item) return; let link = item.web_content_link; if (!link) { try { const m = await apiGet(item.id); link = m.web_content_link; } catch (e) { } } if (!link) { showToast('링크를 가져올 수 없습니다.'); return; } const extPlayer = gmGet('pk_ext_player', 'system'); if (extPlayer === 'potplayer') window.open('potplayer://' + link, '_self'); else if (extPlayer === 'vlc') window.open('vlc://' + link, '_self'); else window.open('potplayer://' + link, '_self'); };
    ctx.querySelector('#ctx-down').onclick = () => { ctx.style.display = 'none'; UI.win.querySelector('#pk-down').click(); };
    ctx.querySelector('#ctx-copy').onclick = () => { ctx.style.display = 'none'; UI.btnCopy.click(); };
    ctx.querySelector('#ctx-cut').onclick = () => { ctx.style.display = 'none'; UI.btnCut.click(); };
    ctx.querySelector('#ctx-rename').onclick = () => { ctx.style.display = 'none'; UI.btnRename.click(); };
    ctx.querySelector('#ctx-del').onclick = () => { ctx.style.display = 'none'; UI.btnDel.click(); };
    UI.btnClose.addEventListener('click', () => { el.remove(); document.removeEventListener('keydown', keyHandler); document.removeEventListener('mouseup', mouseHandler); });

    _updateStat();
    load();
}