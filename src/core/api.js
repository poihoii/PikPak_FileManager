// src/core/api.js
// PikPak REST API 클라이언트 단일 진입점입니다.
// 모든 API 호출은 반드시 이 모듈을 통해야 합니다.

import { sleep } from '../utils';

const BASE = 'https://api-drive.mypikpak.com';

// PikPak 인증 헤더 추출 (localStorage에서)
export function getHeaders() {
    let token = '', captcha = '';
    for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('credentials')) {
            try { const v = JSON.parse(localStorage.getItem(k)); token = v.token_type + ' ' + v.access_token; } catch { }
        }
        if (k && k.startsWith('captcha')) {
            try { const v = JSON.parse(localStorage.getItem(k)); captcha = v.captcha_token; } catch { }
        }
    }
    return {
        'Content-Type': 'application/json',
        'Authorization': token,
        'x-device-id': localStorage.getItem('deviceid') || '',
        'x-captcha-token': captcha
    };
}

// 내부 fetch 래퍼
async function request(method, path, body = null, params = {}) {
    const url = new URL(BASE + path);
    Object.entries(params).forEach(([k, v]) => {
        if (v !== null && v !== undefined && v !== '') url.searchParams.set(k, v);
    });

    const res = await fetch(url.toString(), {
        method,
        headers: getHeaders(),
        body: body ? JSON.stringify(body) : null,
    });

    if (!res.ok) {
        if (res.status === 429) {
            await sleep(2000);
            return request(method, path, body, params); // 재시도
        }
        const err = await res.json().catch(() => ({}));
        throw new ApiError(res.status, err.error_description || err.error?.message || res.statusText, err);
    }
    return res.json();
}

class ApiError extends Error {
    constructor(status, message, data) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

export { ApiError };

export const ApiClient = {
    // ── 파일 목록 ──────────────────────────────────────
    async listFiles(folderId = '', pageToken = null) {
        return request('GET', '/drive/v1/files', null, {
            parent_id: folderId,
            page_token: pageToken || '',
            thumbnail_size: 'SIZE_MEDIUM',
            limit: 1000,
            with_audit: true,
        });
    },

    // 전체 페이지 순회
    async listFilesAll(folderId = '', limit = 1000, onProgress) {
        const all = [];
        let next = null, safe = 5000;
        do {
            const url = `${BASE}/drive/v1/files?thumbnail_size=SIZE_MEDIUM&limit=${limit}&parent_id=${folderId || ''}&with_audit=true${next ? `&page_token=${next}` : ''}`;
            const res = await fetch(url, { headers: getHeaders() });
            if (!res.ok) {
                if (res.status === 429) { await sleep(2000); continue; }
                throw new Error('API Error ' + res.status);
            }
            const data = await res.json();
            if (data.files) {
                const validFiles = data.files.filter(f => !f.trashed && f.phase === 'PHASE_TYPE_COMPLETE');
                for (const f of validFiles) all.push(f);
                if (onProgress) { onProgress(all.length); await sleep(0); }
            }
            next = data.next_page_token;
            safe--;
        } while (next && safe > 0);
        return all;
    },

    // ── 파일 정보 ──────────────────────────────────────
    async getFile(id) {
        const res = await fetch(`${BASE}/drive/v1/files/${id}`, { headers: getHeaders() });
        if (!res.ok) throw new Error(`API Error ${res.status}`);
        return res.json();
    },

    // ── 파일 작업 ──────────────────────────────────────
    async action(actionPath, data) {
        const method = actionPath.includes('batch') ? 'POST' : 'PATCH';
        const res = await fetch(`${BASE}/drive/v1/files${actionPath}`, {
            method,
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error_description || `API Error ${res.status}`);
        }
        return res.json();
    },

    async batchTrash(ids) {
        return this.action(':batchTrash', { ids });
    },

    async batchMove(ids, targetFolderId) {
        return this.action(':batchMove', { ids, to: { parent_id: targetFolderId } });
    },

    async batchCopy(ids, targetFolderId) {
        return this.action(':batchCopy', { ids, to: { parent_id: targetFolderId } });
    },

    async rename(fileId, name) {
        return this.action(`/${fileId}`, { name });
    },

    async createFolder(parentId, name) {
        return request('POST', '/drive/v1/files', {
            kind: 'drive#folder',
            parent_id: parentId || '',
            name,
        });
    },

    // ── 직접 링크 ──────────────────────────────────────
    async getDownloadUrl(fileId) {
        const res = await this.getFile(fileId);
        return res.web_content_link || null;
    },
};
