export const CSS = `
    :root { --pk-bg: #ffffff; --pk-fg: #1a1a1a; --pk-bd: #e5e5e5; --pk-hl: #f0f0f0; --pk-sel-bg: #e6f3ff; --pk-sel-bd: #cce8ff; --pk-pri: #0067c0; --pk-btn-hov: #e0e0e0; --pk-gh: #f5f5f5; --pk-gh-fg: #333; --pk-sb-bg: transparent; --pk-sb-th: #ccc; --pk-sb-hov: #aaa; }
    @media (prefers-color-scheme: dark) { :root { --pk-bg: #202020; --pk-fg: #f5f5f5; --pk-bd: #333333; --pk-hl: #2d2d2d; --pk-sel-bg: #2b3a4a; --pk-sel-bd: #0067c0; --pk-pri: #4cc2ff; --pk-btn-hov: #3a3a3a; --pk-gh: #2a2a2a; --pk-gh-fg: #eee; --pk-sb-th: #555; --pk-sb-hov: #777; } }
    
    .pk-ov { position: fixed; inset: 0; z-index: 10000; background: rgba(0,0,0,0.4); backdrop-filter: blur(5px); font-family: inherit; outline: none; }
    
    .pk-win { position: absolute; top: clamp(20px, 5vh, 100px); left: clamp(20px, 7.5vw, 150px); width: clamp(400px, 85vw, 1400px); height: clamp(300px, 90vh, 1200px); background: var(--pk-bg); color: var(--pk-fg); border-radius: 8px; box-shadow: 0 25px 50px rgba(0,0,0,0.25); display: flex; flex-direction: column; overflow: hidden; border: 1px solid var(--pk-bd); user-select: none; -webkit-user-select: none; }
    .pk-win input, .pk-win select, .pk-win textarea { user-select: auto; -webkit-user-select: auto; }
    
    .pk-rz { position: absolute; z-index: 9999; }
    .pk-rz-n { top: 0; left: 8px; right: 8px; height: 6px; cursor: n-resize; }
    .pk-rz-s { bottom: 0; left: 8px; right: 8px; height: 6px; cursor: s-resize; }
    .pk-rz-e { top: 8px; bottom: 8px; right: 0; width: 6px; cursor: e-resize; }
    .pk-rz-w { top: 8px; bottom: 8px; left: 0; width: 6px; cursor: w-resize; }
    .pk-rz-ne { top: 0; right: 0; width: 14px; height: 14px; cursor: ne-resize; z-index: 10000; }
    .pk-rz-nw { top: 0; left: 0; width: 14px; height: 14px; cursor: nw-resize; z-index: 10000; }
    .pk-rz-se { bottom: 0; right: 0; width: 14px; height: 14px; cursor: se-resize; z-index: 10000; }
    .pk-rz-sw { bottom: 0; left: 0; width: 14px; height: 14px; cursor: sw-resize; z-index: 10000; }
    
    .pk-lasso { position: fixed; background: rgba(0, 103, 192, 0.2); border: 1px solid rgba(0, 103, 192, 0.6); pointer-events: none; z-index: 99999; }

    .pk-hd { height: 48px; border-bottom: 1px solid var(--pk-bd); display: flex; align-items: center; justify-content: space-between; padding: 0 16px; background: var(--pk-bg); cursor: grab; }
    .pk-hd:active { cursor: grabbing; }
    .pk-tt { font-weight: 700; font-size: 20px; display: flex; align-items: center; gap: 10px; }
    .pk-tb { padding: 8px 16px; border-bottom: 1px solid var(--pk-bd); display: flex; gap: 8px; align-items: center; background: var(--pk-bg); height: 40px; overflow-x: auto; scrollbar-width: none; }

    .pk-btn { height: 32px; padding: 0 12px; border-radius: 4px; border: 1px solid transparent; background: transparent; color: var(--pk-fg); cursor: pointer; font-size: 13px; display: flex; align-items: center; justify-content: center; gap: 6px; transition: background 0.1s; position: relative; font-weight: 500; white-space: nowrap; flex-shrink: 0; }
    .pk-btn:hover:not(:disabled) { background: var(--pk-btn-hov); }
    .pk-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .pk-btn.pri { color: var(--pk-pri); font-weight: 600; }
    .pk-btn svg { width: 16px; height: 16px; flex-shrink: 0; display: block; vertical-align: middle; }
    .pk-btn span { white-space: nowrap; transition: opacity 0.2s; }

    @media (max-width: 900px) {
        .pk-btn span, .pk-dup-lbl { display: none !important; }
        .pk-btn { padding: 0 8px; }
        .pk-search input { width: 120px; }
        .pk-search input:focus { width: 160px; }
    }
    
    @media (max-width: 1390px) { .pk-lang-ko #pk-rename span, .pk-lang-ko #pk-bulkrename span { display: none; } }
    @media (max-width: 1430px) { .pk-lang-en #pk-rename span, .pk-lang-en #pk-bulkrename span { display: none; } }
    @media (max-width: 1480px) { .pk-lang-ja #pk-rename span, .pk-lang-ja #pk-bulkrename span { display: none; } }
    @media (max-width: 1370px) { .pk-lang-zh #pk-rename span, .pk-lang-zh #pk-bulkrename span { display: none; } }

    .pk-search { position: relative; display: flex; align-items: center; margin-right: 10px; }
    .pk-search input { 
        height: 32px; padding: 0 10px 0 32px; border: 1px solid var(--pk-bd); 
        border-radius: 4px; background: var(--pk-bg); color: var(--pk-fg); 
        font-size: 13px; width: 180px; transition: width 0.2s, border-color 0.2s; 
    }
    .pk-search input:focus { width: 260px; border-color: var(--pk-pri); outline: none; }
    .pk-search svg { position: absolute; left: 10px; width: 14px; height: 14px; color: #888; pointer-events: none; }

    .pk-dup-toolbar { display:none; align-items:center; gap:4px; padding:0 8px; height:100%; margin-left:8px; overflow-x: auto; scrollbar-width: none; background: transparent; border: none; }
    .pk-dup-lbl { font-weight: 500; color: var(--pk-fg); font-size: 13px; margin-right: 6px; opacity: 0.8; white-space: nowrap; flex-shrink: 0; }
    .pk-btn-toggle { border: 1px solid var(--pk-bd); background: var(--pk-bg); color: var(--pk-fg); height: 30px; border-radius: 4px; padding: 0 10px; font-size: 12px; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; white-space: nowrap; flex-shrink: 0; }
    .pk-btn-toggle:hover { background: var(--pk-btn-hov); border-color: var(--pk-pri); }
    .pk-btn-toggle span { font-weight: 700; color: var(--pk-pri); }

    .pk-nav { display: flex; align-items: center; gap: 4px; overflow: hidden; white-space: nowrap; font-size: 13px; color: #666; margin: 0 8px; max-width: 60%; }
    .pk-nav span { cursor: pointer; padding: 2px 6px; border-radius: 4px; } .pk-nav span:hover { background: var(--pk-hl); color: var(--pk-fg); }
    .pk-nav span.act { font-weight: 600; color: var(--pk-fg); cursor: default; }

    .pk-grid-hd, .pk-row { 
        display: grid; 
        grid-template-columns: 36px 1fr 90px 80px 100px; 
        column-gap: 10px; 
        align-items: center; 
        font-size: 13px; 
        color: var(--pk-fg);
        box-sizing: border-box;
    }

    .pk-grid-hd > div:first-child, .pk-row > div:first-child {
        display: flex; align-items: center; justify-content: center;
        width: 100%; height: 100%;
    }

    .pk-grid-hd { height: 36px; border-bottom: 1px solid var(--pk-bd); font-size: 12px; color: #666; user-select: none; padding: 0 22px 0 16px; }
    .pk-col { cursor: pointer; font-weight: 600; display:flex; align-items:center; justify-content: flex-start; } 
    .pk-col:hover { color: var(--pk-fg); }

    .pk-vp::-webkit-scrollbar, .pk-modal::-webkit-scrollbar, .pk-prev-list::-webkit-scrollbar { width: 6px; }
    .pk-vp::-webkit-scrollbar-track, .pk-modal::-webkit-scrollbar-track, .pk-prev-list::-webkit-scrollbar-track { background: var(--pk-sb-bg); }
    .pk-vp::-webkit-scrollbar-thumb, .pk-modal::-webkit-scrollbar-thumb, .pk-prev-list::-webkit-scrollbar-thumb { background: var(--pk-sb-th); border-radius: 3px; }
    .pk-vp::-webkit-scrollbar-thumb:hover, .pk-modal::-webkit-scrollbar-thumb:hover, .pk-prev-list::-webkit-scrollbar-thumb:hover { background: var(--pk-sb-hov); }

    .pk-vp { flex: 1; overflow-y: overlay; position: relative; background: var(--pk-bg); }
    .pk-in { position: absolute; width: 100%; top: 0; }
    .pk-row { height: 40px; border-bottom: 1px solid transparent; cursor: default; padding: 0 16px; }
    .pk-row:hover { background: var(--pk-hl); }
    .pk-row.sel { background: var(--pk-sel-bg); border-color: transparent; }
    
    .pk-name { 
        display: flex; 
        align-items: center; 
        overflow: hidden; 
        min-width: 0; 
    } 
    .pk-name svg { 
        flex-shrink: 0; 
        margin-right: 8px; 
    } 
    .pk-name span { 
        overflow: hidden; 
        text-overflow: ellipsis; 
        white-space: nowrap; 
        flex: 1; 
    }

    .pk-group-hd { display: flex; background: var(--pk-gh); color: var(--pk-gh-fg); font-weight: bold; align-items: center; padding: 0 16px; border-bottom: 1px solid var(--pk-bd); border-top: 1px solid var(--pk-bd); margin-top: -1px; min-height: 32px; }
    .pk-group-hd .pk-tag { margin-left: auto; background: #666; color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; border: 1px solid #555; }
    .pk-group-hd .pk-cnt { margin-left: 10px; color: var(--pk-fg); font-size: 12px; opacity: 0.9; }

    .pk-loading-ov { display: none; position: absolute; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(2px); z-index: 9999; flex-direction: column; align-items: center; justify-content: center; color: #fff; text-shadow: 0 1px 3px rgba(0,0,0,0.8); }
    .pk-spin-lg { width: 50px; height: 50px; border: 4px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: pk-spin 1s linear infinite; margin-bottom: 20px; }
    .pk-loading-txt { font-size: 16px; font-weight: 500; text-align: center; max-width: 80%; line-height: 1.4; white-space: pre-wrap; }
    .pk-stop-btn { margin-top: 20px; padding: 8px 24px; background: rgba(255,0,0,0.8); color: #fff; border: 1px solid rgba(255,255,255,0.3); border-radius: 4px; font-size: 14px; font-weight: bold; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); }
    .pk-stop-btn:hover { background: rgba(255,50,50,0.9); }
    .pk-stop-btn:active { transform: scale(0.95); }

    .pk-ft { height: 48px; border-top: 1px solid var(--pk-bd); background: var(--pk-bg); display: flex; align-items: center; padding: 0 16px; justify-content: space-between; font-size: 12px; }
    .pk-stat { color: #949494; font-size: 12px; }
    .pk-grp { display: flex; gap: 8px; }
    .pk-pop { position: fixed; pointer-events: none; z-index: 10002; background: #000; border: 1px solid #333; box-shadow: 0 8px 24px rgba(0,0,0,0.4); border-radius: 6px; display: none; overflow: hidden; }
    .pk-pop img { display: block; max-width: 320px; max-height: 240px; object-fit: contain; }
    .pk-ctx { position: fixed; z-index: 10003; background: var(--pk-bg); border: 1px solid var(--pk-bd); border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); min-width: 150px; padding: 4px 0; display: none; }
    .pk-ctx-item { padding: 8px 16px; font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 8px; color: var(--pk-fg); }
    .pk-ctx-item:hover { background: var(--pk-hl); }
    .pk-ctx-sep { height: 1px; background: var(--pk-bd); margin: 4px 0; }
    .pk-modal-ov { position: absolute; inset: 0; background: rgba(0,0,0,0.5); z-index: 10001; display: flex; align-items: center; justify-content: center; }
    
    .pk-modal { position: relative; background: var(--pk-bg); padding: 25px; border-radius: 12px; width: 500px; max-height: 85vh; overflow-y: auto; display: flex; flex-direction: column; gap: 15px; border: 1px solid var(--pk-bd); box-shadow: 0 10px 40px rgba(0,0,0,0.4); }
    .pk-modal h3 { margin: 0 0 5px 0; font-size: 16px; border-bottom: 1px solid var(--pk-bd); padding-bottom: 10px; padding-right: 40px; }
    
    .pk-modal-close { position: absolute; top: 15px; right: 15px; cursor: pointer; color: #888; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 4px; transition: background 0.1s, color 0.1s; }
    .pk-modal-close:hover { background: var(--pk-hl); color: var(--pk-fg); }

    .pk-field { display: flex; flex-direction: column; gap: 5px; font-size: 13px; }
    .pk-field input, .pk-field select { padding: 6px; border: 1px solid var(--pk-bd); border-radius: 4px; background: var(--pk-bg); color: var(--pk-fg); }
    .pk-modal-act { display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px; }
    .pk-credit { font-size: 11px; color: #888; text-align: center; margin-top: 20px; border-top: 1px solid var(--pk-bd); padding-top: 10px; }
    .pk-credit a { color: #888; text-decoration: none; }
    .pk-credit a:hover { text-decoration: underline; }
    .pk-prev-list { flex: 1; overflow-y: auto; border: 1px solid var(--pk-bd); max-height: 300px; }
    .pk-prev-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 5px 10px; border-bottom: 1px solid var(--pk-bd); font-size: 12px; }
    .pk-prev-row:nth-child(odd) { background: var(--pk-hl); }

    .pk-toast-box { position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%); z-index: 20000; display: flex; flex-direction: column; gap: 10px; pointer-events: none; }
    .pk-toast { background: rgba(0,0,0,0.8); color: #fff; padding: 10px 20px; border-radius: 20px; font-size: 13px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); animation: fadein 0.2s, fadeout 0.2s 2.8s forwards; backdrop-filter: blur(4px); display: flex; align-items: center; gap: 8px; }
    @keyframes fadein { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeout { from { opacity: 1; } to { opacity: 0; } }

    .pk-grid-con { 
        padding: 10px; 
        position: relative; 
        height: 100%;
        box-sizing: border-box;
    }
    
    .pk-card { 
        position: absolute; 
        border: 1px solid transparent; border-radius: 8px; padding: 8px; cursor: pointer; 
        display: flex; flex-direction: column; align-items: center; gap: 8px; transition: background 0.1s;
        box-sizing: border-box;
    }
    .pk-card:hover { background: var(--pk-hl); }
    .pk-card.sel { background: var(--pk-sel-bg); border-color: var(--pk-sel-bd); }
    
    .pk-card-thumb { 
        width: 100%; height: var(--pk-thumb-h, 110px); 
        background: #f5f5f5; border-radius: 6px; overflow: hidden; 
        display: flex; align-items: center; justify-content: center; 
        flex-shrink: 0;
    }
    @media (prefers-color-scheme: dark) { .pk-card-thumb { background: #333; } }

    .pk-card-thumb img { width: 100%; height: 100%; object-fit: cover; }
    .pk-card-thumb svg { width: 48px; height: 48px; opacity: 0.7; }
    
    .pk-card-name { 
        font-size: 12px; text-align: center; width: 100%; 
        overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; 
        line-height: 1.3; height: 32px; word-break: break-all;
    }
    .pk-card-info { font-size: 11px; color: #888; display: flex; justify-content: space-between; width: 100%; margin-top: 4px; }
    .pk-card-chk { position: absolute; top: 10px; left: 10px; z-index: 2; transform: scale(1.1); display:none; }
    .pk-card:hover .pk-card-chk, .pk-card.sel .pk-card-chk { display:block; }
    
    .hidden { display: none !important; }

    /* 필터 패널 — 컴팩트 가로 바 */
    .pk-filter-panel {
        padding: 8px 16px; border-bottom: 1px solid var(--pk-bd);
        background: var(--pk-bg); display: none; flex-wrap: wrap; gap: 10px; align-items: center;
        animation: slideDown 0.12s ease;
    }
    .pk-filter-panel.open { display: flex; }
    @keyframes slideDown { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
    .pk-filter-section { display: flex; align-items: center; gap: 6px; }
    .pk-filter-label { font-size: 13px; font-weight: 600; color: #888; white-space: nowrap; }
    .pk-filter-chips { display: flex; flex-wrap: wrap; gap: 5px; }
    .pk-filter-chip {
        padding: 4px 10px; border-radius: 14px; border: 1px solid var(--pk-bd);
        background: transparent; color: var(--pk-fg); font-size: 13px; cursor: pointer;
        transition: all 0.15s; display: flex; align-items: center; gap: 4px; line-height: 1.4;
    }
    .pk-filter-chip:hover { border-color: var(--pk-pri); }
    .pk-filter-chip.active { background: var(--pk-pri); color: #fff; border-color: var(--pk-pri); }
    .pk-filter-sep { width: 1px; height: 24px; background: var(--pk-bd); flex-shrink: 0; }
    .pk-filter-row { display: contents; }
    .pk-filter-half { display: flex; align-items: center; gap: 6px; }
    .pk-filter-range { display: flex; align-items: center; gap: 5px; }
    .pk-filter-range input { width: 80px; height: 30px; padding: 0 8px; border: 1px solid var(--pk-bd); border-radius: 4px; background: var(--pk-bg); color: var(--pk-fg); font-size: 13px; }
    .pk-filter-range input[type="date"] { width: 130px; }
    .pk-filter-range span { color: #888; font-size: 13px; }
    .pk-filter-name-row { display: flex; gap: 6px; align-items: center; }
    .pk-filter-name-row input[type="text"] { width: 110px; height: 30px; padding: 0 8px; border: 1px solid var(--pk-bd); border-radius: 4px; background: var(--pk-bg); color: var(--pk-fg); font-size: 13px; }
    .pk-filter-regex-label { display: flex; align-items: center; gap: 4px; font-size: 13px; color: #888; white-space: nowrap; cursor: pointer; }
    .pk-filter-regex-label input { width: 15px; height: 15px; }
    .pk-filter-actions { display: flex; gap: 6px; margin-left: auto; }
    .pk-filter-actions .pk-btn { height: 30px; font-size: 13px; padding: 0 14px; }
    .pk-filter-badge { display: inline-flex; align-items: center; justify-content: center; background: var(--pk-pri); color: #fff; font-size: 10px; font-weight: 700; min-width: 16px; height: 16px; border-radius: 8px; padding: 0 4px; margin-left: 4px; }

    /* 정렬 드롭다운 */
    .pk-sort-dropdown { position: relative; display: inline-flex; }
    .pk-sort-btn { cursor: pointer; display: flex; align-items: center; gap: 4px; padding: 4px 8px; border-radius: 4px; font-size: 12px; color: var(--pk-fg); border: 1px solid var(--pk-bd); background: transparent; transition: all 0.15s; }
    .pk-sort-btn:hover { border-color: var(--pk-pri); background: var(--pk-btn-hov); }
    .pk-sort-menu { position: absolute; top: 100%; left: 0; z-index: 100; min-width: 140px; background: var(--pk-bg); border: 1px solid var(--pk-bd); border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); padding: 4px 0; display: none; }
    .pk-sort-menu.open { display: block; }
    .pk-sort-opt { padding: 6px 12px; font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 6px; color: var(--pk-fg); }
    .pk-sort-opt:hover { background: var(--pk-hl); }
    .pk-sort-opt.active { color: var(--pk-pri); font-weight: 600; }
    .pk-sort-opt .pk-sort-dir { margin-left: auto; font-size: 10px; }

    /* ── 사이드바 + 2단 레이아웃 ── */
    .pk-body { display: flex; flex: 1; overflow: hidden; }
    .pk-main { display: flex; flex-direction: column; flex: 1; min-width: 0; }
    .pk-sidebar { width: 240px; min-width: 160px; max-width: 400px; border-right: 1px solid var(--pk-bd); background: var(--pk-bg); display: none; flex-direction: column; overflow: hidden; flex-shrink: 0; }
    .pk-sidebar.open { display: flex; }
    .pk-sb-header { padding: 10px 14px; font-weight: 700; font-size: 13px; border-bottom: 1px solid var(--pk-bd); color: var(--pk-fg); user-select: none; }
    .pk-sb-tree { flex: 1; overflow-y: auto; overflow-x: hidden; padding: 4px 0; scrollbar-width: thin; }
    .pk-sb-tree::-webkit-scrollbar { width: 5px; }
    .pk-sb-tree::-webkit-scrollbar-thumb { background: var(--pk-sb-th); border-radius: 3px; }

    .pk-tree-root { list-style: none; padding: 0; margin: 0; }
    .pk-tree-node { list-style: none; }
    .pk-tree-children { list-style: none; padding-left: 16px; margin: 0; }
    .pk-tree-row { display: flex; align-items: center; gap: 4px; padding: 4px 10px; cursor: pointer; border-radius: 4px; margin: 1px 4px; font-size: 13px; color: var(--pk-fg); user-select: none; transition: background 0.1s; white-space: nowrap; }
    .pk-tree-row:hover { background: var(--pk-hl); }
    .pk-tree-row.active { background: var(--pk-sel-bg); color: var(--pk-pri); font-weight: 600; }
    .pk-tree-row.pk-drop-over { background: var(--pk-sel-bg); outline: 2px dashed var(--pk-pri); outline-offset: -2px; }
    .pk-tree-arrow { display: flex; align-items: center; justify-content: center; width: 16px; height: 16px; flex-shrink: 0; transition: transform 0.15s; }
    .pk-tree-arrow svg { width: 12px; height: 12px; }
    .pk-tree-icon { display: flex; align-items: center; flex-shrink: 0; }
    .pk-tree-icon svg { width: 16px; height: 16px; }
    .pk-tree-name { overflow: hidden; text-overflow: ellipsis; flex: 1; min-width: 0; }
    .pk-tree-empty { padding: 4px 10px 4px 26px; font-size: 12px; color: #888; font-style: italic; }
    .pk-tree-spin { display: inline-block; width: 12px; height: 12px; border: 2px solid rgba(128,128,128,0.2); border-top-color: var(--pk-pri); border-radius: 50%; animation: spin 0.6s linear infinite; }
    #pk-sidebar-toggle.active { color: var(--pk-pri); background: var(--pk-hl); }

    /* 드래그앤드롭: 파일 행 드롭 타겟 */
    .pk-row.pk-drop-over { background: var(--pk-sel-bg); outline: 2px dashed var(--pk-pri); outline-offset: -2px; }
    .pk-drag-ghost { position: fixed; top: -100px; left: -100px; background: var(--pk-pri); color: #fff; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; pointer-events: none; z-index: 99999; white-space: nowrap; }

    @media (max-width: 768px) {
        .pk-sidebar { position: absolute; left: 0; top: 0; bottom: 0; z-index: 100; box-shadow: 4px 0 12px rgba(0,0,0,0.15); }
    }
`;