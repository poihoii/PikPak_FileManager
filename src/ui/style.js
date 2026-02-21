// src/ui/style.js
// 모든 CSS를 한 곳에서 관리합니다.
// injectStyles()로 페이지에 주입합니다.

import { TOAST_CSS } from '../core/toast';

export { CSS } from '../style';

// 추가 CSS (토스트 등)
export const EXTRA_CSS = TOAST_CSS;

let _injected = false;

export function injectStyles() {
    if (_injected) return;
    _injected = true;
    // Toast CSS는 Toast 컨테이너 생성 시 자동 주입되므로
    // 여기서는 별도 style 태그로 주입
    const styleEl = document.createElement('style');
    styleEl.textContent = EXTRA_CSS;
    document.head.appendChild(styleEl);
}
