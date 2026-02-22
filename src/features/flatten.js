
import { ApiClient } from '../core/api';
import { AppState } from '../core/state';
import { EventBus, Events } from '../core/event';
import { sleep } from '../utils';
import { setLoading, updateLoadingText, updateStat, UI } from '../ui/layout';
import { render } from '../ui/fileList';
import { showToast } from '../ui/modal';

let _L = null;

export function initFlatten(L) {
    _L = L;
}

export async function startFlatten(L) {
    if (_L) L = _L;
    AppState.setState({ scanning: true, dupMode: false, dupRunning: false });
    UI.dup.style.display = 'inline-flex';
    UI.dupTools.style.display = 'none';
    setLoading(true, L);

    const path = AppState.get('path');
    const folderId = path[path.length - 1].id;

    const allFiles = [];
    const queue = [{ id: folderId, name: '' }];

    while (queue.length > 0) {
        const folder = queue.shift();
        updateLoadingText(`${L.loading_scan} ${folder.name || '/'} (${allFiles.length})`);

        try {
            const files = await ApiClient.listFilesAll(folder.id, 1000, (n) => {
                updateLoadingText(`${L.loading_scan} ${folder.name || '/'} (${allFiles.length + n})`);
            });

            for (const f of files) {
                if (f.kind === 'drive#folder') {
                    queue.push({ id: f.id, name: (folder.name ? folder.name + '/' : '') + f.name });
                } else {
                    f._flatPath = folder.name;
                    allFiles.push(f);
                }
            }
        } catch (e) {
            console.error('[PFM] Scan error:', e);
        }
    }

    AppState.setState({ items: allFiles, display: [...allFiles] });
    setLoading(false, L);

    render();
    updateStat(L);
    showToast(`${L.status_ready.replace('{n}', allFiles.length)}`);
}
