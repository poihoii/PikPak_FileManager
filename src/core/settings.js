
function _gmGet(key, def) {
    if (typeof GM_getValue !== 'undefined') return GM_getValue(key, def);
    return def;
}

function _gmSet(key, val) {
    if (typeof GM_setValue !== 'undefined') GM_setValue(key, val);
}

function _gmDel(key) {
    if (typeof GM_deleteValue !== 'undefined') GM_deleteValue(key);
}

export const KEYS = {
    LANG: 'pk_lang',
    EXT_PLAYER: 'pk_ext_player',
    ARIA2_URL: 'pk_aria2_url',
    ARIA2_TOKEN: 'pk_aria2_token',
    VIEW_MODE: 'pk_view_mode',
    POS_LEFT: 'pk_pos_left',
    POS_TOP: 'pk_pos_top',
    SORT_BY: 'pfm_sortBy',
    SORT_DIR: 'pfm_sortDir',
    FOLDERS_FIRST: 'pfm_foldersFirst',
    SIDEBAR_OPEN: 'pfm_sidebarOpen',
    GRID_COLS: 'pfm_gridCols',
    DUP_CONFIG: 'pfm_dupConfig',
};

const DEFAULTS = {
    [KEYS.LANG]: '',
    [KEYS.EXT_PLAYER]: 'system',
    [KEYS.ARIA2_URL]: '',
    [KEYS.ARIA2_TOKEN]: '',
    [KEYS.VIEW_MODE]: 'list',
    [KEYS.POS_LEFT]: null,
    [KEYS.POS_TOP]: null,
    [KEYS.SORT_BY]: 'name',
    [KEYS.SORT_DIR]: 1,
    [KEYS.FOLDERS_FIRST]: true,
    [KEYS.SIDEBAR_OPEN]: false,
    [KEYS.GRID_COLS]: 4,
};

export const Settings = {
    get(key) {
        return _gmGet(key, DEFAULTS[key] !== undefined ? DEFAULTS[key] : null);
    },
    set(key, value) {
        _gmSet(key, value);
    },
    reset(key) {
        _gmDel(key);
    },
    resetAll() {
        Object.values(KEYS).forEach(k => _gmDel(k));
    },
};
