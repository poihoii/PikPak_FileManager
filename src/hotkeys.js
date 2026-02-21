// src/hotkeys.js
// 키보드 단축키 & 마우스 이벤트

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

    // ESC
    if (e.key === 'Escape') {
        _callbacks.onEscape?.(e);
        return;
    }

    // 모달/입력에 포커스 중이면 단축키 무시
    const active = document.activeElement;
    if (active && ['INPUT', 'TEXTAREA', 'SELECT'].includes(active.tagName)) return;

    // Delete
    if (e.key === 'Delete') {
        e.preventDefault();
        _callbacks.onDelete?.(e);
        return;
    }

    // Ctrl 조합
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

    // F2 이름 변경
    if (e.key === 'F2') {
        e.preventDefault();
        _callbacks.onRename?.(e);
        return;
    }

    // F5 새로고침
    if (e.key === 'F5') {
        e.preventDefault();
        _callbacks.onRefresh?.(e);
        return;
    }

    // Backspace 뒤로
    if (e.key === 'Backspace') {
        e.preventDefault();
        _callbacks.onBack?.(e);
        return;
    }
}

function mouseHandler(e) {
    // 컨텍스트 메뉴 영역 밖 클릭 시 닫기
    hideCtx();
}
