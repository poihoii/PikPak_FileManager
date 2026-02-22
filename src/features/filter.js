
const TYPE_MAP = {
    video: ['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'ts', 'm2ts', 'webm', 'rmvb', 'm4v'],
    image: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'tiff', 'heic'],
    subtitle: ['srt', 'ass', 'ssa', 'smi', 'vtt', 'sup'],
    archive: ['zip', 'rar', '7z', 'tar', 'gz', 'bz2'],
    audio: ['mp3', 'flac', 'aac', 'wav', 'ogg', 'm4a', 'opus'],
    document: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'md', 'csv'],
};

export const DEFAULT_FILTER = {
    types: [],         
    sizeMin: null,     
    sizeMax: null,
    dateFrom: '',      
    dateTo: '',
    nameInclude: '',
    nameExclude: '',
    useRegex: false,
};

export function countActiveFilters(filter) {
    let n = 0;
    if (filter.types.length > 0) n++;
    if (filter.sizeMin !== null || filter.sizeMax !== null) n++;
    if (filter.dateFrom || filter.dateTo) n++;
    if (filter.nameInclude || filter.nameExclude) n++;
    return n;
}

export function applyFilter(files, filter) {
    if (!filter) return files;
    return files.filter(f => {
        if (f.kind === 'drive#folder') return true;
        if (f.isHeader) return true;

        if (filter.types.length > 0) {
            const ext = (f.name || '').split('.').pop().toLowerCase();
            const matched = filter.types.some(t => TYPE_MAP[t]?.includes(ext));
            if (!matched) return false;
        }

        const size = parseInt(f.size || 0);
        if (filter.sizeMin !== null && size < filter.sizeMin) return false;
        if (filter.sizeMax !== null && size > filter.sizeMax) return false;

        if (filter.dateFrom) {
            const t = new Date(f.created_time || f.modified_time).getTime();
            if (t < new Date(filter.dateFrom).getTime()) return false;
        }
        if (filter.dateTo) {
            const t = new Date(f.created_time || f.modified_time).getTime();
            if (t > new Date(filter.dateTo).getTime() + 86400000) return false;
        }

        const name = (f.name || '').toLowerCase();
        if (filter.nameInclude) {
            if (filter.useRegex) {
                try {
                    if (!new RegExp(filter.nameInclude, 'i').test(f.name)) return false;
                } catch {  }
            } else {
                if (!name.includes(filter.nameInclude.toLowerCase())) return false;
            }
        }
        if (filter.nameExclude) {
            if (filter.useRegex) {
                try {
                    if (new RegExp(filter.nameExclude, 'i').test(f.name)) return false;
                } catch {  }
            } else {
                if (name.includes(filter.nameExclude.toLowerCase())) return false;
            }
        }

        return true;
    });
}

export function createFilterPanelHTML(L, currentFilter) {
    const f = currentFilter || DEFAULT_FILTER;
    const typeButtons = ['video', 'image', 'subtitle', 'archive', 'audio', 'document'].map(t => {
        const icons = { video: '🎬', image: '🖼️', subtitle: '💬', archive: '📦', audio: '🎵', document: '📄' };
        const active = f.types.includes(t) ? ' active' : '';
        return `<button class="pk-filter-chip${active}" data-type="${t}">${icons[t]} ${L['filter_type_' + t] || t}</button>`;
    }).join('');

    return `
    <div class="pk-filter-panel" id="pk-filter-panel">
        <div class="pk-filter-section">
            <label class="pk-filter-label">${L.filter_type || 'Type'}:</label>
            <div class="pk-filter-chips" id="pk-filter-types">${typeButtons}</div>
        </div>
        <div class="pk-filter-sep"></div>
        <div class="pk-filter-section">
            <label class="pk-filter-label">${L.filter_size || 'Size'}:</label>
            <div class="pk-filter-range">
                <input type="number" id="pk-filter-size-min" placeholder="${L.filter_size_min || 'Min'}" value="${f.sizeMin !== null ? f.sizeMin / (1024 * 1024) : ''}" min="0" step="1" title="MB">
                <span>~</span>
                <input type="number" id="pk-filter-size-max" placeholder="${L.filter_size_max || 'Max'}" value="${f.sizeMax !== null ? f.sizeMax / (1024 * 1024) : ''}" min="0" step="1" title="MB">
            </div>
        </div>
        <div class="pk-filter-sep"></div>
        <div class="pk-filter-section">
            <label class="pk-filter-label">${L.filter_date || 'Date'}:</label>
            <div class="pk-filter-range">
                <input type="date" id="pk-filter-date-from" value="${f.dateFrom || ''}">
                <span>~</span>
                <input type="date" id="pk-filter-date-to" value="${f.dateTo || ''}">
            </div>
        </div>
        <div class="pk-filter-sep"></div>
        <div class="pk-filter-section">
            <label class="pk-filter-label">${L.filter_name || 'Name'}:</label>
            <div class="pk-filter-name-row">
                <input type="text" id="pk-filter-name-inc" placeholder="${L.filter_name_include || 'Include'}" value="${f.nameInclude || ''}">
                <input type="text" id="pk-filter-name-exc" placeholder="${L.filter_name_exclude || 'Exclude'}" value="${f.nameExclude || ''}">
                <label class="pk-filter-regex-label"><input type="checkbox" id="pk-filter-regex" ${f.useRegex ? 'checked' : ''}>${L.filter_regex || 'Rx'}</label>
            </div>
        </div>
        <div class="pk-filter-actions">
            <button class="pk-btn" id="pk-filter-reset">${L.btn_filter_reset || 'Reset'}</button>
            <button class="pk-btn pri" id="pk-filter-apply">${L.btn_filter_apply || 'Apply'}</button>
        </div>
    </div>`;
}

export function readFilterFromPanel(panelEl) {
    const types = [];
    panelEl.querySelectorAll('.pk-filter-chip.active').forEach(ch => {
        types.push(ch.dataset.type);
    });

    const sizeMinVal = panelEl.querySelector('#pk-filter-size-min')?.value;
    const sizeMaxVal = panelEl.querySelector('#pk-filter-size-max')?.value;
    const sizeMin = sizeMinVal ? parseFloat(sizeMinVal) * 1024 * 1024 : null;
    const sizeMax = sizeMaxVal ? parseFloat(sizeMaxVal) * 1024 * 1024 : null;

    return {
        types,
        sizeMin,
        sizeMax,
        dateFrom: panelEl.querySelector('#pk-filter-date-from')?.value || '',
        dateTo: panelEl.querySelector('#pk-filter-date-to')?.value || '',
        nameInclude: panelEl.querySelector('#pk-filter-name-inc')?.value || '',
        nameExclude: panelEl.querySelector('#pk-filter-name-exc')?.value || '',
        useRegex: panelEl.querySelector('#pk-filter-regex')?.checked || false,
    };
}
