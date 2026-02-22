
import { AppState } from './core/state';
import { EventBus, Events } from './core/event';
import { hideCtx } from './ui/contextMenu';

let _callbacks = null;

export function initHotkeys(callbacks) {
    _callbacks = callbacks;
    document.addEventListener('keydown', keyHandler);
    document.addEventListener('mouseup', mouseHandler);
}

export function removeHotkeys() {
    document.removeEventListener('keydown', keyHandler);
    document.removeEventListener('mouseup', mouseHandler);
}

function keyHandler(e) {
    if (!_callbacks) return;

    if (e.key === 'Escape') {
        _callbacks.onEscape?.(e);
        return;
    }

    const active = document.activeElement;
    if (active && ['INPUT', 'TEXTAREA', 'SELECT'].includes(active.tagName)) return;

    if (e.key === 'Delete') {
        e.preventDefault();
        _callbacks.onDelete?.(e);
        return;
    }

    if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
            case 'a':
                e.preventDefault();
                _callbacks.onSelectAll?.(e);
                break;
            case 'c':
                e.preventDefault();
                _callbacks.onCopy?.(e);
                break;
            case 'x':
                e.preventDefault();
                _callbacks.onCut?.(e);
                break;
            case 'v':
                e.preventDefault();
                _callbacks.onPaste?.(e);
                break;
            case 'f':
                e.preventDefault();
                _callbacks.onSearch?.(e);
                break;
        }
        return;
    }

    if (e.key === 'F2') {
        e.preventDefault();
        _callbacks.onRename?.(e);
        return;
    }

    if (e.key === 'F5') {
        e.preventDefault();
        _callbacks.onRefresh?.(e);
        return;
    }

    if (e.key === 'Backspace') {
        e.preventDefault();
        _callbacks.onBack?.(e);
        return;
    }
}

function mouseHandler(e) {
    hideCtx();
}
