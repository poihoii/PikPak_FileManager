
import { TOAST_CSS } from '../core/toast';

export { CSS } from '../style';

export const EXTRA_CSS = TOAST_CSS;

let _injected = false;

export function injectStyles() {
    if (_injected) return;
    _injected = true;
    const styleEl = document.createElement('style');
    styleEl.textContent = EXTRA_CSS;
    document.head.appendChild(styleEl);
}
