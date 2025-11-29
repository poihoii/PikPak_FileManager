export const CSS = `
    :root { --pk-bg: #ffffff; --pk-fg: #1a1a1a; --pk-bd: #e5e5e5; --pk-hl: #f0f0f0; --pk-sel-bg: #e6f3ff; --pk-sel-bd: #cce8ff; --pk-pri: #0067c0; --pk-btn-hov: #e0e0e0; --pk-gh: #f5f5f5; --pk-gh-fg: #333; }
    @media (prefers-color-scheme: dark) { :root { --pk-bg: #202020; --pk-fg: #f5f5f5; --pk-bd: #333333; --pk-hl: #2d2d2d; --pk-sel-bg: #2b3a4a; --pk-sel-bd: #0067c0; --pk-pri: #4cc2ff; --pk-btn-hov: #3a3a3a; --pk-gh: #2a2a2a; --pk-gh-fg: #eee; } }
    .pk-ov { position: fixed; inset: 0; z-index: 10000; background: rgba(0,0,0,0.4); backdrop-filter: blur(5px); display: flex; align-items: center; justify-content: center; font-family: "Segoe UI Variable", "Segoe UI", sans-serif; outline: none; }
    .pk-win { width: 70vw; max-width: 1600px; min-width: 800px; height: 80vh; background: var(--pk-bg); color: var(--pk-fg); border-radius: 8px; box-shadow: 0 25px 50px rgba(0,0,0,0.25); display: flex; flex-direction: column; overflow: hidden; border: 1px solid var(--pk-bd); }
    .pk-hd { height: 48px; border-bottom: 1px solid var(--pk-bd); display: flex; align-items: center; justify-content: space-between; padding: 0 16px; background: var(--pk-bg); }
    .pk-tt { font-weight: 700; font-size: 20px; display: flex; align-items: center; gap: 10px; }
    .pk-tb { padding: 8px 16px; border-bottom: 1px solid var(--pk-bd); display: flex; gap: 8px; align-items: center; background: var(--pk-bg); height: 40px; }

    .pk-btn { height: 32px; padding: 0 12px; border-radius: 4px; border: 1px solid transparent; background: transparent; color: var(--pk-fg); cursor: pointer; font-size: 13px; display: flex; align-items: center; justify-content: center; gap: 6px; transition: background 0.1s; position: relative; font-weight: 500; white-space: nowrap; flex-shrink: 0; }
    .pk-btn:hover:not(:disabled) { background: var(--pk-btn-hov); }
    /* pointer-events: none 제거 및 cursor 변경으로 툴팁 표시 가능하게 함 */
    .pk-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .pk-btn.pri { color: var(--pk-pri); font-weight: 600; }
    .pk-btn svg { width: 16px; height: 16px; flex-shrink: 0; display: block; vertical-align: middle; }
    .pk-btn span { white-space: nowrap; transition: opacity 0.2s; }

    /* [순차적 반응형] 그룹별로 단계적으로 아이콘 모드 전환 */
    
    /* 1단계: 가장 오른쪽 '이름 변경' 그룹 (Rename Group) */
    @media (max-width: 1390px) {
        .pk-lang-ko #pk-rename span, .pk-lang-ko #pk-bulkrename span { display: none; }
        .pk-lang-ko #pk-rename, .pk-lang-ko #pk-bulkrename { padding: 0 8px; }
    }
    @media (max-width: 1430px) {
        .pk-lang-en #pk-rename span, .pk-lang-en #pk-bulkrename span { display: none; }
        .pk-lang-en #pk-rename, .pk-lang-en #pk-bulkrename { padding: 0 8px; }
    }
    @media (max-width: 1480px) {
        .pk-lang-ja #pk-rename span, .pk-lang-ja #pk-bulkrename span { display: none; }
        .pk-lang-ja #pk-rename, .pk-lang-ja #pk-bulkrename { padding: 0 8px; }
    }
    @media (max-width: 1370px) {
        .pk-lang-zh #pk-rename span, .pk-lang-zh #pk-bulkrename span { display: none; }
        .pk-lang-zh #pk-rename, .pk-lang-zh #pk-bulkrename { padding: 0 8px; }
    }

    /* 2단계: '클립보드' 그룹 (Clipboard Group - 복사/이동/붙여넣기) */
    @media (max-width: 1270px) {
        .pk-lang-ko #pk-copy span, .pk-lang-ko #pk-cut span, .pk-lang-ko #pk-paste span { display: none; }
        .pk-lang-ko #pk-copy, .pk-lang-ko #pk-cut, .pk-lang-ko #pk-paste { padding: 0 8px; }
    }
    @media (max-width: 1310px) {
        .pk-lang-en #pk-copy span, .pk-lang-en #pk-cut span, .pk-lang-en #pk-paste span { display: none; }
        .pk-lang-en #pk-copy, .pk-lang-en #pk-cut, .pk-lang-en #pk-paste { padding: 0 8px; }
    }
    @media (max-width: 1360px) {
        .pk-lang-ja #pk-copy span, .pk-lang-ja #pk-cut span, .pk-lang-ja #pk-paste span { display: none; }
        .pk-lang-ja #pk-copy, .pk-lang-ja #pk-cut, .pk-lang-ja #pk-paste { padding: 0 8px; }
    }
    @media (max-width: 1250px) {
        .pk-lang-zh #pk-copy span, .pk-lang-zh #pk-cut span, .pk-lang-zh #pk-paste span { display: none; }
        .pk-lang-zh #pk-copy, .pk-lang-zh #pk-cut, .pk-lang-zh #pk-paste { padding: 0 8px; }
    }

    /* 3단계: '파일 관리' 그룹 (File Ops - 새폴더/삭제 등) */
    @media (max-width: 1140px) {
        .pk-lang-ko #pk-newfolder span, .pk-lang-ko #pk-del span, .pk-lang-ko #pk-deselect span { display: none; }
        .pk-lang-ko #pk-newfolder, .pk-lang-ko #pk-del, .pk-lang-ko #pk-deselect { padding: 0 8px; }
    }
    @media (max-width: 1180px) {
        .pk-lang-en #pk-newfolder span, .pk-lang-en #pk-del span, .pk-lang-en #pk-deselect span { display: none; }
        .pk-lang-en #pk-newfolder, .pk-lang-en #pk-del, .pk-lang-en #pk-deselect { padding: 0 8px; }
    }
    @media (max-width: 1230px) {
        .pk-lang-ja #pk-newfolder span, .pk-lang-ja #pk-del span, .pk-lang-ja #pk-deselect span { display: none; }
        .pk-lang-ja #pk-newfolder, .pk-lang-ja #pk-del, .pk-lang-ja #pk-deselect { padding: 0 8px; }
    }
    @media (max-width: 1120px) {
        .pk-lang-zh #pk-newfolder span, .pk-lang-zh #pk-del span, .pk-lang-zh #pk-deselect span { display: none; }
        .pk-lang-zh #pk-newfolder, .pk-lang-zh #pk-del, .pk-lang-zh #pk-deselect { padding: 0 8px; }
    }

    /* 4단계: '탐색' 그룹 (Navigation - 뒤로/앞으로) */
    @media (max-width: 1020px) {
        .pk-lang-ko #pk-nav-back span, .pk-lang-ko #pk-nav-fwd span, .pk-lang-ko .pk-dup-lbl { display: none; }
        .pk-lang-ko #pk-nav-back, .pk-lang-ko #pk-nav-fwd { padding: 0 8px; }
    }
    @media (max-width: 1060px) {
        .pk-lang-en #pk-nav-back span, .pk-lang-en #pk-nav-fwd span, .pk-lang-en .pk-dup-lbl { display: none; }
        .pk-lang-en #pk-nav-back, .pk-lang-en #pk-nav-fwd { padding: 0 8px; }
    }
    @media (max-width: 1110px) {
        .pk-lang-ja #pk-nav-back span, .pk-lang-ja #pk-nav-fwd span, .pk-lang-ja .pk-dup-lbl { display: none; }
        .pk-lang-ja #pk-nav-back, .pk-lang-ja #pk-nav-fwd { padding: 0 8px; }
    }
    @media (max-width: 1000px) {
        .pk-lang-zh #pk-nav-back span, .pk-lang-zh #pk-nav-fwd span, .pk-lang-zh .pk-dup-lbl { display: none; }
        .pk-lang-zh #pk-nav-back, .pk-lang-zh #pk-nav-fwd { padding: 0 8px; }
    }

    /* Unified Duplicate Toolbar Style */
    .pk-dup-toolbar { display:none; align-items:center; gap:4px; padding:0 8px; height:100%; margin-left:8px; overflow-x: auto; scrollbar-width: none; background: transparent; border: none; }
    .pk-dup-lbl { font-weight: 500; color: var(--pk-fg); font-size: 13px; margin-right: 6px; opacity: 0.8; white-space: nowrap; flex-shrink: 0; }
    .pk-btn-toggle { border: 1px solid var(--pk-bd); background: var(--pk-bg); color: var(--pk-fg); height: 30px; border-radius: 4px; padding: 0 10px; font-size: 12px; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; white-space: nowrap; flex-shrink: 0; }
    .pk-btn-toggle:hover { background: var(--pk-btn-hov); border-color: var(--pk-pri); }
    .pk-btn-toggle span { font-weight: 700; color: var(--pk-pri); }

    /* Search Bar Style (Left Icon) */
    .pk-search { position: relative; display: flex; align-items: center; margin-right: 10px; }
    .pk-search input { 
        height: 32px; 
        padding: 0 10px 0 32px; /* 왼쪽 여백을 늘려서 아이콘 공간 확보 */
        border: 1px solid var(--pk-bd); 
        border-radius: 4px; 
        background: var(--pk-bg); 
        color: var(--pk-fg); 
        font-size: 13px; 
        width: 180px; 
        transition: width 0.2s, border-color 0.2s; 
    }
    .pk-search input:focus { width: 260px; border-color: var(--pk-pri); outline: none; }
    
    /* 아이콘 위치를 왼쪽(left)으로 변경 */
    .pk-search svg { position: absolute; left: 10px; width: 14px; height: 14px; color: #888; pointer-events: none; }

    /* 모바일 대응 */
    @media (max-width: 1024px) { 
        .pk-search input:focus { width: 180px; } 
    }

    /* Navigation Bar Fix */
    .pk-nav { display: flex; align-items: center; gap: 4px; overflow: hidden; white-space: nowrap; font-size: 13px; color: #666; margin: 0 8px; max-width: 60%; }
    .pk-nav span { cursor: pointer; padding: 2px 6px; border-radius: 4px; } .pk-nav span:hover { background: var(--pk-hl); color: var(--pk-fg); }
    .pk-nav span.act { font-weight: 600; color: var(--pk-fg); cursor: default; }

    /* Group Header Style */
    .pk-group-hd { background: var(--pk-gh); color: var(--pk-gh-fg); font-weight: bold; display: flex; align-items: center; padding: 0 16px; border-bottom: 1px solid var(--pk-bd); border-top: 1px solid var(--pk-bd); margin-top: -1px; min-height: 32px; }
    .pk-group-hd .pk-tag { margin-left: auto; background: #666; color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; border: 1px solid #555; }
    .pk-group-hd .pk-cnt { margin-left: 10px; color: var(--pk-fg); font-size: 12px; opacity: 0.9; }

    .pk-loading-ov { position: absolute; inset: 0; background: rgba(255,255,255,0.8); z-index: 999; display: none; flex-direction: column; align-items: center; justify-content: center; color: var(--pk-fg); gap: 20px; backdrop-filter: blur(2px); }
    @media (prefers-color-scheme: dark) { .pk-loading-ov { background: rgba(0,0,0,0.8); } }
    .pk-spin-lg { width: 48px; height: 48px; border: 5px solid rgba(128,128,128,0.2); border-top-color: var(--pk-pri); border-radius: 50%; animation: spin 0.8s infinite; }
    .pk-loading-txt { font-size: 15px; font-weight: 600; text-align: center; white-space: pre-line; line-height: 1.5; }
    .pk-stop-btn { padding: 8px 20px; background: #d93025; color: white; border: none; border-radius: 20px; font-size: 14px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 10px rgba(217,48,37,0.3); transition: transform 0.1s; }
    .pk-stop-btn:hover { background: #b02a20; transform: scale(1.05); }
    .pk-stop-btn:active { transform: scale(0.95); }
    .pk-grid-hd { display: grid; grid-template-columns: 40px 1fr 90px 80px 140px; padding: 0 16px; height: 36px; align-items: center; border-bottom: 1px solid var(--pk-bd); font-size: 12px; color: #666; user-select: none; }
    .pk-col { cursor: pointer; font-weight: 600; } .pk-col:hover { color: var(--pk-fg); }
    .pk-vp { flex: 1; overflow-y: auto; position: relative; scrollbar-width: thin; background: var(--pk-bg); }
    .pk-in { position: absolute; width: 100%; top: 0; }
    .pk-row { display: grid; grid-template-columns: 40px 1fr 90px 80px 140px; height: 40px; align-items: center; padding: 0 16px; font-size: 13px; border-bottom: 1px solid transparent; cursor: default; color: var(--pk-fg); box-sizing: border-box; }
    .pk-row:hover { background: var(--pk-hl); }
    .pk-row.sel { background: var(--pk-sel-bg); border-color: transparent; }
    .pk-name { display: flex; align-items: center; gap: 8px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .pk-ft { height: 48px; border-top: 1px solid var(--pk-bd); background: var(--pk-bg); display: flex; align-items: center; padding: 0 16px; justify-content: space-between; font-size: 12px; }
    .pk-stat { color: #949494; font-size: 12px; }
    .pk-grp { display: flex; gap: 8px; }
    .pk-pop { position: fixed; pointer-events: none; z-index: 10002; background: #000; border: 1px solid #333; box-shadow: 0 8px 24px rgba(0,0,0,0.4); border-radius: 6px; display: none; overflow: hidden; }
    .pk-pop img { display: block; max-width: 320px; max-height: 240px; object-fit: contain; }
    /* Dup Visuals - Removed old row styles */
    .pk-ctx { position: fixed; z-index: 10003; background: var(--pk-bg); border: 1px solid var(--pk-bd); border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); min-width: 150px; padding: 4px 0; display: none; }
    .pk-ctx-item { padding: 8px 16px; font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 8px; color: var(--pk-fg); }
    .pk-ctx-item:hover { background: var(--pk-hl); }
    .pk-ctx-sep { height: 1px; background: var(--pk-bd); margin: 4px 0; }
    .pk-modal-ov { position: absolute; inset: 0; background: rgba(0,0,0,0.5); z-index: 10001; display: flex; align-items: center; justify-content: center; }
    /* 모달 스타일: 스크롤 추가 */
    .pk-modal { background: var(--pk-bg); padding: 25px; border-radius: 12px; width: 500px; max-height: 85vh; overflow-y: auto; display: flex; flex-direction: column; gap: 15px; border: 1px solid var(--pk-bd); box-shadow: 0 10px 40px rgba(0,0,0,0.4); }
    .pk-modal h3 { margin: 0 0 5px 0; font-size: 16px; border-bottom: 1px solid var(--pk-bd); padding-bottom: 10px; }
    .pk-field { display: flex; flex-direction: column; gap: 5px; font-size: 13px; }
    .pk-field input, .pk-field select { padding: 6px; border: 1px solid var(--pk-bd); border-radius: 4px; background: var(--pk-bg); color: var(--pk-fg); }
    .pk-modal-act { display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px; }
    .pk-credit { font-size: 12px; color: #888; text-align: center; margin-top: 20px; border-top: 1px solid var(--pk-bd); padding-top: 10px; }
    .pk-credit a { color: #888; text-decoration: none; } /* Changed to Gray */
    .pk-credit a:hover { text-decoration: underline; }
    .pk-prev-list { flex: 1; overflow-y: auto; border: 1px solid var(--pk-bd); max-height: 300px; }
    .pk-prev-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 5px 10px; border-bottom: 1px solid var(--pk-bd); font-size: 12px; }
    .pk-prev-row:nth-child(odd) { background: var(--pk-hl); }
    @media (max-width: 1024px) { .pk-win { width: 90vw; min-width: 600px; } .pk-btn { padding: 0 8px; font-size: 12px; gap: 4px; } .pk-tt { font-size: 16px; } .pk-grid-hd, .pk-row { font-size: 11px; } }
`;