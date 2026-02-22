
const _handlers = new Map();

export const EventBus = {
    on(event, handler) {
        if (!_handlers.has(event)) _handlers.set(event, new Set());
        _handlers.get(event).add(handler);
        return () => EventBus.off(event, handler);
    },

    off(event, handler) {
        _handlers.get(event)?.delete(handler);
    },

    emit(event, payload) {
        _handlers.get(event)?.forEach(h => {
            try { h(payload); } catch (e) { console.error(`[PFM] EventBus error on '${event}':`, e); }
        });
    },
};

export const Events = {
    NAVIGATE: 'navigate',
    NAVIGATE_BACK: 'navigate:back',
    NAVIGATE_FORWARD: 'navigate:forward',
    REFRESH: 'refresh',
    LOAD: 'load',

    FILES_LOADED: 'files:loaded',
    SELECTION_CHANGE: 'selection:change',
    VIEW_MODE_CHANGE: 'view:change',

    FILE_COPY: 'file:copy',
    FILE_CUT: 'file:cut',
    FILE_PASTE: 'file:paste',
    FILE_DELETE: 'file:delete',
    FILE_RENAME: 'file:rename',
    FILE_MOVE: 'file:move',

    TOAST: 'toast',
    MODAL_OPEN: 'modal:open',
    MODAL_CLOSE: 'modal:close',

    FLATTEN_START: 'flatten:start',
    DUPLICATE_START: 'duplicate:start',
    DUPLICATE_TOGGLE: 'duplicate:toggle',
    RENAME_BATCH: 'rename:batch',
    SORT_CHANGE: 'sort:change',

    APP_OPEN: 'app:open',
    APP_CLOSE: 'app:close',
};
