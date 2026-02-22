import { CONF } from '../config';
import { apiList } from '../api';

let _L = null;
let _onNavigate = null;
let _onDrop = null;
let _currentFolderId = '';

export function initSidebar(container, L, onNavigate, onDrop) {
    _L = L;
    _onNavigate = onNavigate;
    _onDrop = onDrop;

    container.innerHTML = `
        <div class="pk-sb-header">${L.sidebar_title}</div>
        <div class="pk-sb-tree" id="pk-sb-tree">
            <ul class="pk-tree-root"></ul>
        </div>
    `;

    const rootUl = container.querySelector('.pk-tree-root');
    const rootNode = _createNode('', L.sidebar_home, true);
    rootUl.appendChild(rootNode);

    _toggleNode(rootNode, true);
}

export function highlightFolder(folderId) {
    _currentFolderId = folderId;
    const tree = document.querySelector('#pk-sb-tree');
    if (!tree) return;
    tree.querySelectorAll('.pk-tree-row').forEach(row => {
        row.classList.toggle('active', row.dataset.folderId === folderId);
    });
}

export function invalidateFolder(folderId) {
    const tree = document.querySelector('#pk-sb-tree');
    if (!tree) return;
    const row = tree.querySelector(`.pk-tree-row[data-folder-id="${folderId}"]`);
    if (row && row.parentElement) {
        const li = row.parentElement;
        delete li.dataset.loaded;
        const childUl = li.querySelector(':scope > .pk-tree-children');
        if (childUl && !childUl.hidden) {
            _toggleNode(li, true); 
        }
    }
}


function _createNode(folderId, name, isRoot = false) {
    const li = document.createElement('li');
    li.className = 'pk-tree-node';

    const row = document.createElement('div');
    row.className = 'pk-tree-row';
    row.dataset.folderId = folderId;
    if (folderId === _currentFolderId) row.classList.add('active');

    const arrow = document.createElement('span');
    arrow.className = 'pk-tree-arrow';
    arrow.innerHTML = CONF.icons.chevron_right;

    const icon = document.createElement('span');
    icon.className = 'pk-tree-icon';
    icon.innerHTML = isRoot ? '🏠' : CONF.typeIcons.folder;

    const label = document.createElement('span');
    label.className = 'pk-tree-name';
    label.textContent = name;

    row.appendChild(arrow);
    row.appendChild(icon);
    row.appendChild(label);
    li.appendChild(row);

    const childUl = document.createElement('ul');
    childUl.className = 'pk-tree-children';
    childUl.hidden = true;
    li.appendChild(childUl);

    row.addEventListener('click', (e) => {
        e.stopPropagation();
        if (_onNavigate) _onNavigate(folderId, name);
        _toggleNode(li);
    });

    arrow.addEventListener('click', (e) => {
        e.stopPropagation();
        _toggleNode(li);
    });

    _addDropTarget(row, folderId);

    return li;
}

let _expandTimers = new Map();

function _addDropTarget(rowEl, folderId) {
    rowEl.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        rowEl.classList.add('pk-drop-over');

        if (!_expandTimers.has(folderId)) {
            _expandTimers.set(folderId, setTimeout(() => {
                const li = rowEl.closest('.pk-tree-node');
                if (li) _toggleNode(li, true);
                _expandTimers.delete(folderId);
            }, 800));
        }
    });

    rowEl.addEventListener('dragleave', () => {
        rowEl.classList.remove('pk-drop-over');
        if (_expandTimers.has(folderId)) {
            clearTimeout(_expandTimers.get(folderId));
            _expandTimers.delete(folderId);
        }
    });

    rowEl.addEventListener('drop', async (e) => {
        e.preventDefault();
        rowEl.classList.remove('pk-drop-over');
        if (_expandTimers.has(folderId)) {
            clearTimeout(_expandTimers.get(folderId));
            _expandTimers.delete(folderId);
        }
        const raw = e.dataTransfer.getData('application/pfm-ids');
        if (!raw) return;
        try {
            const ids = JSON.parse(raw);
            if (ids.length > 0 && _onDrop) {
                await _onDrop(ids, folderId);
            }
        } catch (err) {
            console.error('[PFM] Drop error:', err);
        }
    });
}

async function _toggleNode(li, forceOpen = false) {
    const childUl = li.querySelector(':scope > .pk-tree-children');
    const arrow = li.querySelector(':scope > .pk-tree-row > .pk-tree-arrow');
    if (!childUl) return;

    const isOpen = !childUl.hidden;
    if (isOpen && !forceOpen) {
        childUl.hidden = true;
        arrow.innerHTML = CONF.icons.chevron_right;
        li.classList.remove('expanded');
        return;
    }

    if (forceOpen && isOpen) return; 

    if (!li.dataset.loaded) {
        const folderId = li.querySelector(':scope > .pk-tree-row').dataset.folderId;
        arrow.innerHTML = `<span class="pk-tree-spin"></span>`;

        try {
            const items = await apiList(folderId, 500);
            const folders = items.filter(f => f.kind === 'drive#folder');
            folders.sort((a, b) => a.name.localeCompare(b.name));

            childUl.innerHTML = '';
            if (folders.length === 0) {
                const emptyLi = document.createElement('li');
                emptyLi.className = 'pk-tree-empty';
                emptyLi.textContent = _L.sidebar_empty;
                childUl.appendChild(emptyLi);
            } else {
                folders.forEach(f => {
                    childUl.appendChild(_createNode(f.id, f.name));
                });
            }
            li.dataset.loaded = '1';
        } catch (err) {
            console.error('[PFM] Sidebar load error:', err);
            childUl.innerHTML = `<li class="pk-tree-empty" style="color:#d93025">Error</li>`;
        }
    }

    childUl.hidden = false;
    arrow.innerHTML = CONF.icons.chevron_down;
    li.classList.add('expanded');
}
