
import { ApiClient } from '../core/api';
import { AppState } from '../core/state';
import { showPrompt, showModal, showAlert, showToast } from '../ui/modal';
import { esc } from '../utils';

let _L = null;
let _refreshFn = null;

export function initRename(L, refreshFn) {
    _L = L;
    _refreshFn = refreshFn;
}

export async function renameSingle() {
    const L = _L;
    const selectedIds = AppState.get('selectedIds');
    if (selectedIds.size !== 1) return;

    const items = AppState.get('items');
    const id = [...selectedIds][0];
    const file = items.find(f => f.id === id);
    if (!file) return;

    const newName = await showPrompt(L.lbl_rename || 'New name:', file.name, L.title_rename || 'Rename');
    if (!newName || newName === file.name) return;

    try {
        await ApiClient.action(`/${id}`, { name: newName });
        showToast(L.msg_rename_ok || 'Renamed');
        if (_refreshFn) await _refreshFn();
    } catch (e) {
        showAlert(`${L.msg_rename_fail || 'Rename failed'}: ${e.message}`);
    }
}

export async function renameBulk() {
    const L = _L;
    const selectedIds = AppState.get('selectedIds');
    if (selectedIds.size < 2) return;

    const items = AppState.get('items');
    const selectedFiles = items.filter(f => selectedIds.has(f.id));

    const pattern = await showPrompt(
        L.lbl_bulk_rename || 'Pattern: {n} = number, {name} = original',
        '{name}',
        L.title_bulk_rename || 'Bulk Rename'
    );
    if (!pattern) return;

    let previewHtml = `<h3>${L.title_bulk_preview || 'Preview'}</h3><div style="max-height:300px;overflow:auto;margin:10px 0;">`;
    selectedFiles.forEach((f, i) => {
        const newName = pattern
            .replace(/{n}/g, String(i + 1).padStart(3, '0'))
            .replace(/{name}/g, f.name.replace(/\.[^.]+$/, ''))
            + (f.name.includes('.') ? '.' + f.name.split('.').pop() : '');
        previewHtml += `<div style="padding:4px 0;border-bottom:1px solid #333;">
            <span style="color:#888;">${esc(f.name)}</span> → <span style="color:#4CAF50;">${esc(newName)}</span>
        </div>`;
    });
    previewHtml += `</div>
        <div class="pk-modal-act">
            <button class="pk-btn" id="br_cancel">${L.btn_cancel || 'Cancel'}</button>
            <button class="pk-btn pri" id="br_apply">${L.btn_apply || 'Apply'}</button>
        </div>`;

    const modal = showModal(previewHtml);

    modal.querySelector('#br_cancel').onclick = () => modal.remove();
    modal.querySelector('#br_apply').onclick = async () => {
        modal.remove();
        let ok = 0, fail = 0;

        for (let i = 0; i < selectedFiles.length; i++) {
            const f = selectedFiles[i];
            const ext = f.name.includes('.') ? '.' + f.name.split('.').pop() : '';
            const newName = pattern
                .replace(/{n}/g, String(i + 1).padStart(3, '0'))
                .replace(/{name}/g, f.name.replace(/\.[^.]+$/, ''))
                + ext;

            try {
                await ApiClient.action(`/${f.id}`, { name: newName });
                ok++;
            } catch {
                fail++;
            }
        }

        showToast(`${L.msg_bulk_done || 'Done'}: ${ok}${L.msg_ok || ' ok'}, ${fail}${L.msg_fail || ' fail'}`);
        if (_refreshFn) await _refreshFn();
    };
}
