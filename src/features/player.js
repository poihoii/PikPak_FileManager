// src/features/player.js
// 인라인 비디오 플레이어

import { ApiClient } from '../core/api';
import { AppState } from '../core/state';
import { UI } from '../ui/layout';
import { esc, fmtDur } from '../utils';

let _L = null;

export function initPlayer(L) {
    _L = L;
}

export async function playVideo(item) {
    const L = _L;
    try {
        const data = await ApiClient.getFile(item.id);
        const url = data.web_content_link;
        if (!url) return;

        UI.pop.style.display = 'flex';
        UI.pop.innerHTML = `
            <div class="pk-player-wrap">
                <div class="pk-player-hd">
                    <span class="pk-player-title">${esc(item.name)}</span>
                    <button class="pk-btn pk-player-close" onclick="this.closest('.pk-pop').style.display='none';this.closest('.pk-pop').innerHTML='';">✕</button>
                </div>
                <video controls autoplay class="pk-player-video" src="${url}"></video>
            </div>
        `;

        // ESC 키로 닫기
        const handler = (e) => {
            if (e.key === 'Escape') {
                e.stopPropagation();
                UI.pop.style.display = 'none';
                UI.pop.innerHTML = '';
                document.removeEventListener('keydown', handler, true);
            }
        };
        document.addEventListener('keydown', handler, true);

        const closeBtn = UI.pop.querySelector('.pk-player-close');
        if (closeBtn) {
            closeBtn.onclick = () => {
                UI.pop.style.display = 'none';
                UI.pop.innerHTML = '';
                document.removeEventListener('keydown', handler, true);
            };
        }
    } catch (e) {
        console.error('[PFM] Play error:', e);
    }
}
