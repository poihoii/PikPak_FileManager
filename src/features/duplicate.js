
import { AppState } from '../core/state';
import { EventBus, Events } from '../core/event';
import { UI, updateStat } from '../ui/layout';
import { render } from '../ui/fileList';
import { showToast, showAlert } from '../ui/modal';
import { fmtSize } from '../utils';

let _L = null;

export function initDuplicate(L) {
    _L = L;
}

export function runDuplicate(L) {
    if (_L) L = _L;
    const items = AppState.get('items');
    if (!items.length) return;

    const nameMap = new Map();
    const sizeMap = new Map();
    const dupReasons = new Map();
    const dupGroups = new Map();

    for (const f of items) {
        if (f.kind === 'drive#folder' || f.isHeader) continue;

        const n = f.name.toLowerCase().trim();
        if (!nameMap.has(n)) nameMap.set(n, []);
        nameMap.get(n).push(f);

        if (f.size && parseInt(f.size, 10) > 0) {
            const sz = f.size.toString();
            if (!sizeMap.has(sz)) sizeMap.set(sz, []);
            sizeMap.get(sz).push(f);
        }
    }

    let groupIdx = 0;
    const allDups = new Set();

    nameMap.forEach((group, key) => {
        if (group.length < 2) return;
        const hasIdentical = group.length >= 2;
        if (hasIdentical) {
            const gid = `name_${groupIdx++}`;
            dupGroups.set(gid, group);
            group.forEach(f => {
                dupReasons.set(f.id, (dupReasons.get(f.id) || '') + `이름동일(${group.length}개) `);
                allDups.add(f.id);
            });
        }
    });

    sizeMap.forEach((group, sz) => {
        if (group.length < 2) return;
        const alreadyByName = group.every(f => allDups.has(f.id));
        if (alreadyByName) return;

        const gid = `size_${groupIdx++}`;
        dupGroups.set(gid, group);
        group.forEach(f => {
            dupReasons.set(f.id, (dupReasons.get(f.id) || '') + `크기동일(${fmtSize(sz)}) `);
            allDups.add(f.id);
        });
    });

    AppState.setState({
        dupMode: true,
        dupRunning: true,
        dupReasons,
        dupGroups,
    });

    const dupItems = [];
    const nonDupItems = [];

    dupGroups.forEach((group, gid) => {
        const label = gid.startsWith('name_') ? L.lbl_dup_name || '이름 중복' : L.lbl_dup_size || '크기 중복';
        dupItems.push({ isHeader: true, name: `${group[0].name}`, type: label, count: group.length });
        group.forEach(f => dupItems.push(f));
    });

    for (const f of items) {
        if (f.kind === 'drive#folder' || f.isHeader) continue;
        if (!allDups.has(f.id)) nonDupItems.push(f);
    }

    const display = [...dupItems, ...nonDupItems];
    AppState.setState({ display });

    UI.dupTools.style.display = 'flex';
    render();
    updateStat(L);

    if (allDups.size === 0) {
        showAlert(L.msg_no_dup || '중복 파일이 없습니다.');
    } else {
        showToast(`${allDups.size}${L.msg_dup_found || '개의 중복 파일 발견'}`);
    }
}

export function toggleSizeStrategy(L) {
    const current = AppState.get('dupSizeStrategy');
    const next = current === 'small' ? 'big' : 'small';
    AppState.setState({ dupSizeStrategy: next });
    const label = next === 'small' ? (L.cond_small || '작은 것') : (L.cond_big || '큰 것');
    UI.condSize.textContent = `(${label})`;
}

export function toggleDateStrategy(L) {
    const current = AppState.get('dupDateStrategy');
    const next = current === 'old' ? 'new' : 'old';
    AppState.setState({ dupDateStrategy: next });
    const label = next === 'old' ? (L.cond_old || '오래된 것') : (L.cond_new || '최신 것');
    UI.condDate.textContent = `(${label})`;
}

export function autoSelectDuplicates() {
    const dupGroups = AppState.get('dupGroups');
    const sizeStr = AppState.get('dupSizeStrategy');
    const dateStr = AppState.get('dupDateStrategy');
    const sel = new Set();

    dupGroups.forEach((group) => {
        if (group.length < 2) return;
        const sorted = [...group];

        if (sizeStr === 'small') {
            sorted.sort((a, b) => parseInt(a.size || 0, 10) - parseInt(b.size || 0, 10));
        } else {
            sorted.sort((a, b) => parseInt(b.size || 0, 10) - parseInt(a.size || 0, 10));
        }

        for (let i = 1; i < sorted.length; i++) {
            sel.add(sorted[i].id);
        }
    });

    AppState.setState({ selectedIds: sel });
    render();
}
