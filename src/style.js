export const CSS = `
    :root { --pk-bg: #ffffff; --pk-fg: #1a1a1a; --pk-bd: #e5e5e5; --pk-hl: #f0f0f0; --pk-sel-bg: #e6f3ff; --pk-sel-bd: #cce8ff; --pk-pri: #0067c0; --pk-btn-hov: #e0e0e0; --pk-gh: #f5f5f5; --pk-gh-fg: #333; --pk-sb-bg: transparent; --pk-sb-th: #ccc; --pk-sb-hov: #aaa; }
    @media (prefers-color-scheme: dark) { :root { --pk-bg: #202020; --pk-fg: #f5f5f5; --pk-bd: #333333; --pk-hl: #2d2d2d; --pk-sel-bg: #2b3a4a; --pk-sel-bd: #0067c0; --pk-pri: #4cc2ff; --pk-btn-hov: #3a3a3a; --pk-gh: #2a2a2a; --pk-gh-fg: #eee; --pk-sb-th: #555; --pk-sb-hov: #777; } }
    
    .pk-ov { position: fixed; inset: 0; z-index: 10000; background: rgba(0,0,0,0.4); backdrop-filter: blur(5px); display: flex; align-items: center; justify-content: center; font-family: inherit; outline: none; }
    
    .pk-win { width: 85vw; max-width: 1400px; min-width: 400px; height: 90vh; background: var(--pk-bg); color: var(--pk-fg); border-radius: 8px; box-shadow: 0 25px 50px rgba(0,0,0,0.25); display: flex; flex-direction: column; overflow: hidden; border: 1px solid var(--pk-bd); }
    
    .pk-hd { height: 48px; border-bottom: 1px solid var(--pk-bd); display: flex; align-items: center; justify-content: space-between; padding: 0 16px; background: var(--pk-bg); }
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

    .pk-loading-ov { position: absolute; inset: 0; background: rgba(255,255,255,0.8); z-index: 999; display: none; flex-direction: column; align-items: center; justify-content: center; color: var(--pk-fg); gap: 20px; backdrop-filter: blur(2px); }
    @media (prefers-color-scheme: dark) { .pk-loading-ov { background: rgba(0,0,0,0.8); } }
    .pk-spin-lg { width: 48px; height: 48px; border: 5px solid rgba(128,128,128,0.2); border-top-color: var(--pk-pri); border-radius: 50%; animation: spin 0.8s infinite; }
    .pk-loading-txt { font-size: 15px; font-weight: 600; text-align: center; white-space: pre-line; line-height: 1.5; }
    .pk-stop-btn { padding: 8px 20px; background: #d93025; color: white; border: none; border-radius: 20px; font-size: 14px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 10px rgba(217,48,37,0.3); transition: transform 0.1s; }
    .pk-stop-btn:hover { background: #b02a20; transform: scale(1.05); }
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
        height: 200px; 
    }
    .pk-card:hover { background: var(--pk-hl); }
    .pk-card.sel { background: var(--pk-sel-bg); border-color: var(--pk-sel-bd); }
    
    .pk-card-thumb { 
        width: 100%; height: 110px; 
        background: #f5f5f5; border-radius: 6px; overflow: hidden; 
        display: flex; align-items: center; justify-content: center; 
    }
    @media (prefers-color-scheme: dark) { .pk-card-thumb { background: #333; } }

    .pk-card-thumb img { width: 100%; height: 100%; object-fit: cover; }
    .pk-card-thumb svg { width: 48px; height: 48px; opacity: 0.7; }
    
    .pk-card-name { 
        font-size: 12px; text-align: center; width: 100%; 
        overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; 
        line-height: 1.3; height: 32px; word-break: break-all;
    }
    .pk-card-info { font-size: 11px; color: #888; display: flex; justify-content: space-between; width: 100%; margin-top: auto; }
    .pk-card-chk { position: absolute; top: 10px; left: 10px; z-index: 2; transform: scale(1.1); display:none; }
    .pk-card:hover .pk-card-chk, .pk-card.sel .pk-card-chk { display:block; }
    
    .hidden { display: none !important; }
`;