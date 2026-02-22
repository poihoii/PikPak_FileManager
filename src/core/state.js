const _state = {
    path: [{ id: '', name: '🏠 Home' }],
    history: [], forward: [],
    items: [], display: [], sel: new Set(),
    sort: 'name', dir: 1,
    scanning: false, dupMode: false, dupRunning: false,
    dupReasons: new Map(), dupGroups: new Map(),
    dupSizeStrategy: 'small', dupDateStrategy: 'old',
    clipItems: [], clipType: '', clipSourceParentId: null,
    loading: false, lastSelIdx: -1, search: '',
    view: 'list', gridZoom: 140,
};
const _listeners = new Map();
export const AppState = {
    get(key) { return _state[key]; },
    getAll() { return { ..._state }; },
    getRef() { return _state; },
    setState(patch) {
        Object.assign(_state, patch);
        Object.keys(patch).forEach(key => {
            _listeners.get(key)?.forEach(fn => fn(_state[key], _state));
        });
    },
    subscribe(key, fn) {
        if (!_listeners.has(key)) _listeners.set(key, new Set());
        _listeners.get(key).add(fn);
        return () => _listeners.get(key).delete(fn);
    },
};
