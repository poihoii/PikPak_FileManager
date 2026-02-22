import { sleep } from './utils';

export function getHeaders() {
    let token = '', captcha = '';
    for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('credentials')) { try { const v = JSON.parse(localStorage.getItem(k)); token = v.token_type + ' ' + v.access_token; } catch { } }
        if (k && k.startsWith('captcha')) { try { const v = JSON.parse(localStorage.getItem(k)); captcha = v.captcha_token; } catch { } }
    }
    return { 'Content-Type': 'application/json', 'Authorization': token, 'x-device-id': localStorage.getItem('deviceid') || '', 'x-captcha-token': captcha };
}

export async function apiList(parentId, limit = 1000, onProgress) {
    let all = [], next = null, safe = 5000;
    do {
        const url = `https://api-drive.mypikpak.com/drive/v1/files?thumbnail_size=SIZE_MEDIUM&limit=${limit}&parent_id=${parentId || ''}&with_audit=true${next ? `&page_token=${next}` : ''}`;
        const res = await fetch(url, { headers: getHeaders() });
        if (!res.ok) { if (res.status === 429) { await sleep(2000); continue; } throw new Error("API Error " + res.status); }
        const data = await res.json();
        if (data.files) {
            const validFiles = data.files.filter(f => !f.trashed && f.phase === 'PHASE_TYPE_COMPLETE');
            for (const f of validFiles) all.push(f);
            if (onProgress) { onProgress(all.length); await sleep(0); }
        }
        next = data.next_page_token; safe--;
    } while (next && safe > 0);
    return all;
}

export async function apiGet(id) {
    const res = await fetch(`https://api-drive.mypikpak.com/drive/v1/files/${id}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`API Error ${res.status}`);
    return res.json();
}

export async function apiAction(action, data) {
    const method = action.includes('batch') ? 'POST' : 'PATCH';
    const res = await fetch(`https://api-drive.mypikpak.com/drive/v1/files${action}`, { method: method, headers: getHeaders(), body: JSON.stringify(data) });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error_description || `API Error ${res.status}`);
    }
    return res.json();
}