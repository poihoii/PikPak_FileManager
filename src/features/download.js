
import { ApiClient, getHeaders } from '../core/api';
import { AppState } from '../core/state';
import { Settings, KEYS } from '../core/settings';
import { showAlert, showModal, showToast } from '../ui/modal';
import { UI, setLoading, updateLoadingText } from '../ui/layout';
import { sleep, esc, fmtSize } from '../utils';

let _L = null;

export function initDownload(L) {
    _L = L;
}

export async function getLinks(L) {
    L = L || _L;
    const selectedIds = AppState.get('selectedIds');
    const items = AppState.get('items');
    const selected = items.filter(f => selectedIds.has(f.id) && f.kind !== 'drive#folder');

    if (selected.length === 0) {
        showAlert(L.msg_no_file || 'No files selected');
        return [];
    }

    const links = [];
    let errCnt = 0;

    setLoading(true, L);

    for (let i = 0; i < selected.length; i++) {
        updateLoadingText(`${L.loading_links || 'Getting links'} ${i + 1}/${selected.length}`);
        try {
            const data = await ApiClient.getFile(selected[i].id);
            if (data.web_content_link) {
                links.push({
                    name: selected[i].name,
                    url: data.web_content_link,
                    size: selected[i].size,
                });
            }
        } catch {
            errCnt++;
        }
    }

    setLoading(false, L);
    return links;
}

export async function downloadDirect(L) {
    L = L || _L;
    const links = await getLinks(L);
    if (links.length === 0) return;

    for (const link of links) {
        const a = document.createElement('a');
        a.href = link.url;
        a.download = link.name;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        a.remove();
        await sleep(500);
    }
    showToast(`${links.length} ${L.msg_down_start || 'downloads started'}`);
}

export async function exportIdm(L) {
    L = L || _L;
    const links = await getLinks(L);
    if (links.length === 0) return;

    const txt = links.map(l => `<\r\n${l.url}\r\ncookie:\r\nreferer:\r\n>\r\n`).join('');
    const blob = new Blob([txt], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'PikPak_links.ef2';
    a.click();
    URL.revokeObjectURL(a.href);

    showToast(`${L.msg_idm_ok || 'IDM file exported'}: ${links.length} files`);
}

export async function sendAria2(L) {
    L = L || _L;
    const aria2Url = Settings.get(KEYS.ARIA2_URL);
    const aria2Token = Settings.get(KEYS.ARIA2_TOKEN);

    if (!aria2Url) {
        showAlert(L.msg_aria2_no_url || 'Set Aria2 URL in settings first.');
        return;
    }

    const links = await getLinks(L);
    if (links.length === 0) return;

    let ok = 0, fail = 0;
    for (const link of links) {
        try {
            const payload = {
                jsonrpc: '2.0',
                method: 'aria2.addUri',
                id: 'pfm',
                params: [
                    ...(aria2Token ? [`token:${aria2Token}`] : []),
                    [link.url],
                    { out: link.name }
                ]
            };
            const res = await fetch(aria2Url, {
                method: 'POST',
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (data.result) ok++;
            else fail++;
        } catch {
            fail++;
        }
    }

    showToast(`Aria2: ${ok} ${L.msg_ok || 'ok'}, ${fail} ${L.msg_fail || 'fail'}`);
}

export async function playExternal(L) {
    L = L || _L;
    const selectedIds = AppState.get('selectedIds');
    const items = AppState.get('items');
    const selected = items.filter(f => selectedIds.has(f.id) && f.kind !== 'drive#folder');

    if (selected.length === 0) {
        showAlert(L.msg_no_file || 'No files selected');
        return;
    }

    const file = selected[0];
    try {
        const data = await ApiClient.getFile(file.id);
        const url = data.web_content_link;
        if (!url) {
            showAlert(L.msg_no_link || 'No download link available');
            return;
        }
        const player = Settings.get(KEYS.EXT_PLAYER) || 'system';
        let scheme;
        switch (player) {
            case 'potplayer': scheme = `potplayer://${url}`; break;
            case 'vlc': scheme = `vlc://${url}`; break;
            case 'nplayer': scheme = `nplayer-${url}`; break;
            case 'infuse': scheme = `infuse://x-callback-url/play?url=${encodeURIComponent(url)}`; break;
            case 'iina': scheme = `iina://weblink?url=${encodeURIComponent(url)}`; break;
            case 'mpv': scheme = `mpv://${url}`; break;
            default: scheme = url;
        }
        window.open(scheme, '_blank');
    } catch (e) {
        showAlert(`${L.msg_ext_fail || 'Failed'}: ${e.message}`);
    }
}

export async function copyLinks(L) {
    L = L || _L;
    const links = await getLinks(L);
    if (links.length === 0) return;

    const text = links.map(l => l.url).join('\n');
    try {
        await navigator.clipboard.writeText(text);
        showToast(`${links.length} ${L.msg_link_copied || 'links copied'}`);
    } catch {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
        showToast(`${links.length} ${L.msg_link_copied || 'links copied'}`);
    }
}
