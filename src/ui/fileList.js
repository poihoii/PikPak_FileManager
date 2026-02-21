// src/ui/fileList.js
// 파일 목록 렌더러 (list/grid)
import { CONF } from '../config';
import { esc, fmtSize, fmtDate, fmtDur } from '../utils';
import { AppState } from '../core/state';
import { UI } from './layout';

// 핸들러 저장소
let _h = null;
export function setHandlers(h) { _h = h; }

// Grid 계산값 캐시
let _gridCache = { items: [], cols: 1, cardW: 140, cardH: 200, gap: 10 };

export function getIcon(item) {
    if (item.kind === 'drive#folder') return CONF.typeIcons.folder;
    const name = item.name || '';
    const dot = name.lastIndexOf('.');
    if (dot === -1) return CONF.typeIcons.file;
    const ext = name.substring(dot + 1).toLowerCase();
    if ('mp4,mkv,avi,mov,wmv,flv,webm,ts,m4v,3gp'.split(',').includes(ext)) return CONF.typeIcons.video;
    if ('jpg,jpeg,png,gif,bmp,svg,webp,tiff,ico'.split(',').includes(ext)) return CONF.typeIcons.image;
    if ('mp3,wav,flac,aac,ogg,m4a,wma'.split(',').includes(ext)) return CONF.typeIcons.audio;
    if ('zip,rar,7z,tar,gz,iso,dmg,pkg'.split(',').includes(ext)) return CONF.typeIcons.archive;
    if (ext === 'pdf') return CONF.typeIcons.pdf;
    if ('doc,docx,xls,xlsx,ppt,pptx,txt,md,csv'.split(',').includes(ext)) return CONF.typeIcons.text;
    return CONF.typeIcons.file;
}

export function render() {
    const view = AppState.get('view');
    if (view === 'list') {
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

export function renderList() {
    const display = AppState.get('display');
    const sort = AppState.get('sort');
    const dir = AppState.get('dir');
    UI.in.style.height = `${display.length * CONF.rowHeight}px`;
    UI.cols.forEach(c => {
        c.querySelector('span').textContent = (c.dataset.k === sort) ? (dir === 1 ? ' ▲' : ' ▼') : '';
        c.style.color = (c.dataset.k === sort) ? 'var(--pk-pri)' : '';
    });
    requestAnimationFrame(renderVisibleList);
}

export function renderVisibleList() {
    if (AppState.get('view') !== 'list') return;
    const display = AppState.get('display');
    const sel = AppState.get('sel');
    const top = UI.vp.scrollTop, h = UI.vp.clientHeight;
    const start = Math.max(0, Math.floor(top / CONF.rowHeight) - CONF.buffer);
    const end = Math.min(display.length, Math.ceil((top + h) / CONF.rowHeight) + CONF.buffer);
    UI.in.innerHTML = '';
    for (let i = start; i < end; i++) {
        const d = display[i]; if (!d) continue;
        const row = document.createElement('div');
        row.style.position = 'absolute'; row.style.top = `${i * CONF.rowHeight}px`; row.style.width = '100%';
        if (d.isHeader) {
            row.className = 'pk-group-hd';
            row.innerHTML = `<div style="display:flex;align-items:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"><span style="margin-right:8px;">📁</span><span>${esc(d.name)}</span></div><div style="margin-left:auto;display:flex;align-items:center;"><span class="pk-tag">${d.type}</span><span class="pk-cnt">${d.count}</span></div>`;
        } else {
            const isSel = sel.has(d.id);
            row.className = `pk-row ${isSel ? 'sel' : ''}`;
            const durVal = d.params?.duration || d.medias?.[0]?.duration || d.video_media_metadata?.duration || '';
            row.innerHTML = `<div><input type="checkbox" ${isSel ? 'checked' : ''}></div><div class="pk-name" title="${esc(d.name)}">${getIcon(d)}<span>${esc(d.name)}</span></div><div>${d.kind === 'drive#folder' ? '' : fmtSize(d.size)}</div><div>${fmtDur(durVal)}</div><div style="color:#888">${fmtDate(d.modified_time)}</div>`;
            if (_h) {
                const chk = row.querySelector('input');
                row.onclick = (e) => _h.onRowClick(e, d, i, chk);
                row.ondblclick = (e) => _h.onRowDblClick(e, d);
                row.oncontextmenu = (e) => _h.onRowContext(e, d, i);
                row.onmouseenter = (e) => _h.onRowEnter(e, d);
                row.onmouseleave = () => _h.onRowLeave();
            }
        }
        UI.in.appendChild(row);
    }
}

export function renderGrid() {
    if (AppState.get('view') !== 'grid') return;
    const display = AppState.get('display');
    const gap = 10, padding = 10, cardH = 200, containerW = UI.vp.clientWidth - (padding * 2), minCardW = 140;
    const cols = Math.floor((containerW + gap) / (minCardW + gap)) || 1;
    const cardW = (containerW - (cols - 1) * gap) / cols;
    const visibleItems = display.filter(d => !d.isHeader);
    const totalRows = Math.ceil(visibleItems.length / cols);
    UI.in.style.height = `${totalRows * (cardH + gap)}px`;
    _gridCache = { items: visibleItems, cols, cardW, cardH, gap };
    requestAnimationFrame(renderVisibleGrid);
}

export function renderVisibleGrid() {
    if (AppState.get('view') !== 'grid') return;
    const { items, cols, cardW, cardH, gap } = _gridCache;
    const sel = AppState.get('sel');
    const top = UI.vp.scrollTop, h = UI.vp.clientHeight;
    const startRow = Math.max(0, Math.floor(top / (cardH + gap)) - 2);
    const endRow = Math.min(Math.ceil(items.length / cols), Math.ceil((top + h) / (cardH + gap)) + 2);
    UI.in.innerHTML = '';
    for (let r = startRow; r < endRow; r++) {
        for (let c = 0; c < cols; c++) {
            const idx = r * cols + c;
            if (idx >= items.length) break;
            const d = items[idx], isSel = sel.has(d.id);
            const card = document.createElement('div');
            card.className = `pk-card ${isSel ? 'sel' : ''}`;
            card.style.cssText = `width:${cardW}px;height:${cardH}px;left:${10 + c * (cardW + gap)}px;top:${10 + r * (cardH + gap)}px`;
            let thumb = getIcon(d);
            if (d.kind !== 'drive#folder' && d.thumbnail_link) thumb = `<img src="${d.thumbnail_link}" loading="lazy" decoding="async">`;
            card.innerHTML = `<input type="checkbox" class="pk-card-chk" ${isSel ? 'checked' : ''}><div class="pk-card-thumb">${thumb}</div><div class="pk-card-name" title="${esc(d.name)}">${esc(d.name)}</div><div class="pk-card-info"><span>${d.kind === 'drive#folder' ? '' : fmtSize(d.size)}</span><span>${d.params?.duration ? fmtDur(d.params.duration) : ''}</span></div>`;
            if (_h) {
                const chk = card.querySelector('input');
                card.onclick = (e) => _h.onCardClick(e, d, idx, chk, card);
                card.ondblclick = (e) => _h.onCardDblClick(e, d);
                card.oncontextmenu = (e) => _h.onCardContext(e, d, card);
            }
            UI.in.appendChild(card);
        }
    }
}

export function initScrollHandler() {
    UI.vp.onscroll = () => {
        if (AppState.get('view') === 'list') renderVisibleList();
        else renderGrid();
    };
}
