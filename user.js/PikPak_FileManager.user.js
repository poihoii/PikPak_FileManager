// ==UserScript==
// @name           PikPak 파일 관리자
// @name:en        PikPak File Manager
// @name:zh        PikPak 文件管理器
// @name:ja        PikPak ファイルマネージャー
// @namespace      https://github.com/poihoii/
// @version        1.0
// @description    PikPak 웹 드라이브를 확장해 빠른 탐색·중복 검사·파일명 일괄 변경·다운로드 기능을 제공하는 고급 파일 관리자.
// @description:en Enhances PikPak with fast navigation, duplicate scan, bulk rename, and advanced file-management tools.
// @description:zh 基于 PikPak 网页 API，提供快速浏览、重复文件扫描、批量重命名和高级下载功能的文件管理器。
// @description:ja PikPak を拡張し、高速ナビゲーション・重複検出・一括リネーム・ダウンロード機能を備えた高機能ファイルマネージャーです。
// @author         poihoii
// @match          https://mypikpak.com/drive/*
// @match          https://app.mypikpak.com/*
// @match          https://drive.mypikpak.com/*
// @icon           https://github.com/poihoii/PikPak_FileManager/blob/4e5e4e56b1ec1c2d22680f2beef0e5d3c93c25b4/img/logo%20(200).png
// @homepage       https://github.com/poihoii/PikPak_FileManager
// @grant          GM_setClipboard
// @grant          GM_setValue
// @grant          GM_getValue
// @run-at         document-idle
// @license        MIT
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// ./src/config.js
const CONF = {
    rowHeight: 40,
    buffer: 20,
    logoUrl: "https://raw.githubusercontent.com/poihoii/PikPak_FileManager/dev/img/logo%20(200).png",
    icons: {
        refresh: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>`,
        settings: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
        close: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
        back: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`,
        fwd: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`,
        newfolder: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/><line x1="12" x2="12" y1="10" y2="16"/><line x1="9" x2="15" y1="13" y2="13"/></svg>`,
        del: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
        deselect: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="m9 9 6 6"/><path d="m15 9-6 6"/></svg>`,
        copy: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
        cut: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" x2="8.12" y1="4" y2="15.88"/><line x1="14.47" x2="20" y1="14.48" y2="20"/><line x1="8.12" x2="12" y1="8.12" y2="12"/></svg>`,
        paste: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>`,
        rename: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>`,
        bulkrename: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>`,
        scan: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/><circle cx="13" cy="13" r="2"/></svg>`,
        dup: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect x="2" y="6" width="14" height="12" rx="2" ry="2"/></svg>`,
        stop: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><rect x="9" y="9" width="6" height="6"/></svg>`,
        play: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>`,
        download: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>`,
        link: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
        send: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`
    }
};
;// ./src/style.js
const CSS = `
    :root { --pk-bg: #ffffff; --pk-fg: #1a1a1a; --pk-bd: #e5e5e5; --pk-hl: #f0f0f0; --pk-sel-bg: #e6f3ff; --pk-sel-bd: #cce8ff; --pk-pri: #0067c0; --pk-btn-hov: #e0e0e0; --pk-gh: #f5f5f5; --pk-gh-fg: #333; }
    @media (prefers-color-scheme: dark) { :root { --pk-bg: #202020; --pk-fg: #f5f5f5; --pk-bd: #333333; --pk-hl: #2d2d2d; --pk-sel-bg: #2b3a4a; --pk-sel-bd: #0067c0; --pk-pri: #4cc2ff; --pk-btn-hov: #3a3a3a; --pk-gh: #2a2a2a; --pk-gh-fg: #eee; } }
    .pk-ov { position: fixed; inset: 0; z-index: 10000; background: rgba(0,0,0,0.4); backdrop-filter: blur(5px); display: flex; align-items: center; justify-content: center; font-family: "Segoe UI Variable", "Segoe UI", sans-serif; outline: none; }
    .pk-win { width: 70vw; max-width: 1600px; min-width: 800px; height: 80vh; background: var(--pk-bg); color: var(--pk-fg); border-radius: 8px; box-shadow: 0 25px 50px rgba(0,0,0,0.25); display: flex; flex-direction: column; overflow: hidden; border: 1px solid var(--pk-bd); }
    .pk-hd { height: 48px; border-bottom: 1px solid var(--pk-bd); display: flex; align-items: center; justify-content: space-between; padding: 0 16px; background: var(--pk-bg); }
    .pk-tt { font-weight: 700; font-size: 20px; display: flex; align-items: center; gap: 10px; }
    .pk-tb { padding: 8px 16px; border-bottom: 1px solid var(--pk-bd); display: flex; gap: 8px; align-items: center; background: var(--pk-bg); height: 40px; }

    .pk-btn { height: 32px; padding: 0 12px; border-radius: 4px; border: 1px solid transparent; background: transparent; color: var(--pk-fg); cursor: pointer; font-size: 13px; display: flex; align-items: center; justify-content: center; gap: 6px; transition: background 0.1s; position: relative; font-weight: 500; white-space: nowrap; flex-shrink: 0; }
    .pk-btn:hover:not(:disabled) { background: var(--pk-btn-hov); }
    .pk-btn:disabled { opacity: 0.4; cursor: default; pointer-events: none; }
    .pk-btn.pri { color: var(--pk-pri); font-weight: 600; }
    .pk-btn svg { width: 16px; height: 16px; flex-shrink: 0; display: block; vertical-align: middle; }
    .pk-btn span { white-space: nowrap; transition: opacity 0.2s; }

    /* Responsive: Switch to Icon-only mode on narrow screens */
    @media (max-width: 1200px) {
        .pk-btn span { display: none; }
        .pk-btn { padding: 0 8px; }
        .pk-dup-lbl { display: none; }
    }

    /* Unified Duplicate Toolbar Style (Updated) */
    .pk-dup-toolbar { display:none; align-items:center; gap:4px; padding:0 8px; height:100%; margin-left:8px; overflow-x: auto; scrollbar-width: none; background: transparent; border: none; }
    .pk-dup-lbl { font-weight: 500; color: var(--pk-fg); font-size: 13px; margin-right: 6px; opacity: 0.8; white-space: nowrap; flex-shrink: 0; }
    .pk-btn-toggle { border: 1px solid var(--pk-bd); background: var(--pk-bg); color: var(--pk-fg); height: 30px; border-radius: 4px; padding: 0 10px; font-size: 12px; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; white-space: nowrap; flex-shrink: 0; }
    .pk-btn-toggle:hover { background: var(--pk-btn-hov); border-color: var(--pk-pri); }
    .pk-btn-toggle span { font-weight: 700; color: var(--pk-pri); }

    /* Navigation Bar Fix */
    .pk-nav { display: flex; align-items: center; gap: 4px; overflow: hidden; white-space: nowrap; font-size: 13px; color: #666; margin: 0 8px; max-width: 60%; }
    .pk-nav span { cursor: pointer; padding: 2px 6px; border-radius: 4px; } .pk-nav span:hover { background: var(--pk-hl); color: var(--pk-fg); }
    .pk-nav span.act { font-weight: 600; color: var(--pk-fg); cursor: default; }

    /* Group Header Style - Updated for Better Visibility and Grey Tags */
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
    .pk-modal { background: var(--pk-bg); padding: 20px; border-radius: 8px; width: 500px; max-height: 80vh; display: flex; flex-direction: column; gap: 15px; border: 1px solid var(--pk-bd); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
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
;// ./src/languages.js
const T = {
    ko: {
        title: "PikPak File Manager",
        col_name: "파일명", col_size: "크기", col_dur: "길이", col_date: "업로드 일자",
        btn_scan: "구조 평면화", tip_scan: "하위 폴더의 모든 파일을 현재 목록으로 가져옵니다. (Flatten)",
        btn_stop: "중지", tip_stop: "작업 중지",
        btn_dup: "중복 검색", tip_dup: "현재 목록에서 중복된 동영상 파일을 검색합니다.",
        status_ready: "준비됨 ({n}개 항목)", status_scanning: "수집 중... {n}개 (현재: {f})",
        msg_no_files: "표시할 항목이 없습니다.",
        warn_del: "선택한 {n}개 항목을 휴지통으로 이동하시겠습니까?",
        btn_down: "웹 다운로드", tip_down: "브라우저 기본 다운로드",
        btn_aria2: "Aria2 전송", tip_aria2: "Aria2 RPC로 다운로드 요청 전송",
        btn_idm: "IDM 직접 연결", tip_idm: "IDM 내보내기 파일(.ef2) 생성",
        btn_ext: "외부 플레이어", tip_ext: "PotPlayer/VLC 등으로 재생 (설정 필요)",
        loading: "로딩 중...",
        loading_detail: "파일 목록을 불러오는 중입니다...",
        loading_fetch: "파일 목록 불러오는 중... ({n}개)",
        loading_dup: "중복 분석 중... ({p}%)",
        sel_count: "{n}개 선택됨",
        tag_hash: "Hash 일치", tag_name: "파일명 일치", tag_sim: "유사 (시간+파일명)",
        lbl_dup_tool: "삭제 대상 선택:",
        btn_toggle_size: "파일 크기", tip_toggle_size: "삭제할 파일 선택 기준: 크기 (클릭하여 변경)",
        cond_small: "작은 파일", cond_large: "큰 파일",
        btn_toggle_date: "업로드 일자", tip_toggle_date: "삭제할 파일 선택 기준: 날짜 (클릭하여 변경)",
        cond_old: "이전 파일", cond_new: "최신 파일",
        btn_back: "", tip_back: "뒤로 가기 (Backspace)",
        btn_fwd: "", tip_fwd: "앞으로 가기",
        tip_refresh: "목록 새로고침 (F5)",
        btn_newfolder: "새 폴더", tip_newfolder: "현재 위치에 새 폴더 생성 (F8)",
        btn_del: "삭제", tip_del: "선택 항목 삭제 (Del)",
        btn_deselect: "선택 취소", tip_deselect: "모든 선택 해제 (Esc)",
        btn_copy: "복사", tip_copy: "선택 항목 복사 (Ctrl+C)",
        btn_cut: "이동", tip_cut: "선택 항목 잘라내기 (Ctrl+X)",
        btn_paste: "붙여넣기", tip_paste: "여기에 붙여넣기 (Ctrl+V)",
        btn_rename: "파일명 변경", tip_rename: "선택한 항목 파일명 변경 (F2)",
        btn_bulkrename: "일괄 변경", tip_bulkrename: "여러개의 파일명을 한번에 변경 (F2)",
        btn_settings: "설정", tip_settings: "설정 (Alt+S)",
        ctx_open: "열기 / 재생", ctx_rename: "파일명 변경", ctx_copy: "복사", ctx_cut: "잘라내기", ctx_del: "삭제", ctx_down: "다운로드",
        msg_newfolder_prompt: "폴더명 ",
        msg_rename_prompt: "새로운 폴더명을 입력하세요:",
        msg_no_selection: "먼저 항목을 선택하세요.",
        msg_copy_done: "복사되었습니다. 붙여넣기가 활성화되었습니다.",
        msg_cut_done: "이동 준비 완료. 붙여넣기가 활성화되었습니다.",
        msg_paste_empty: "붙여넣을 항목이 없습니다.",
        msg_paste_same_folder: "원본과 동일한 폴더에는 붙여넣을 수 없습니다.",
        msg_bulkrename_done: "{n}개 항목의 파일명을 변경했습니다.",
        msg_settings_saved: "설정이 저장되었습니다. 페이지를 새로고침합니다.",
        msg_name_exists: "이미 존재하는 파일명입니다: {n}",
        msg_dup_result: "{n}개의 중복 파일을 찾았습니다.",
        msg_exit_confirm: "파일 탐색기를 닫으시겠습니까?",
        msg_download_fail: "다운로드 링크를 가져올 수 없습니다.",
        msg_flatten_warn: "파일 구조 평면화는 하위 폴더의 모든 파일을 검색합니다.\n계속하시겠습니까?",
        msg_dup_warn: "중복 파일 검색을 시작하시겠습니까?",
        msg_batch_m3u: "재생 목록(.m3u)이 생성되었습니다.",
        msg_batch_ef2: "IDM 내보내기(.ef2) 파일이 생성되었습니다.",
        msg_video_fail: "비디오 링크를 가져올 수 없습니다.",
        modal_rename_title: "파일명 변경",
        modal_rename_multi_title: "파일명 일괄 변경",
        label_pattern: "패턴 변경 (예: Video {n})",
        label_replace: "문자열 치환/삭제",
        label_replace_note: "(영문 대소문자 구분하여 작성해주세요)",
        placeholder_find: "찾을 문자열",
        placeholder_replace: "바꿀 문자열 (공란=삭제)",
        btn_preview: "변경 미리보기",
        modal_preview_title: "변경 내역 확인",
        col_old: "현재 파일명", col_new: "변경 후 파일명",
        btn_confirm: "변경 확정", btn_cancel: "취소",
        modal_settings_title: "설정",
        label_lang: "언어 (Language)", label_player: "외부 플레이어", label_aria2_url: "Aria2 주소", label_aria2_token: "Aria2 토큰",
        btn_save: "저장"
    },
    en: {
        title: "PikPak File Manager",
        col_name: "Name", col_size: "Size", col_dur: "Duration", col_date: "Date Modified",
        btn_scan: "Flatten", tip_scan: "Flatten folder structure",
        btn_stop: "Stop", tip_stop: "Stop operation",
        btn_dup: "Find Dups", tip_dup: "Find duplicate video files",
        status_ready: "Ready ({n} items)", status_scanning: "Scanning... {n} items (Cur: {f})",
        msg_no_files: "No items.",
        warn_del: "Trash {n} items?",
        btn_down: "Download", tip_down: "Download with browser",
        btn_aria2: "Aria2", tip_aria2: "Send to Aria2 RPC",
        btn_idm: "IDM", tip_idm: "Export IDM (.ef2)",
        btn_ext: "Play Ext", tip_ext: "Play with PotPlayer/VLC",
        loading: "Loading...", loading_detail: "Fetching...", loading_fetch: "Fetching... ({n})", loading_dup: "Analyzing... ({p}%)",
        sel_count: "{n} selected",
        tag_hash: "Hash Match", tag_name: "Name Match", tag_sim: "Similar",
        lbl_dup_tool: "Auto Select:",
        btn_toggle_size: "Size", tip_toggle_size: "Select by Size", cond_small: "Smallest", cond_large: "Largest",
        btn_toggle_date: "Date", tip_toggle_date: "Select by Date", cond_old: "Oldest", cond_new: "Newest",
        btn_back: "", tip_back: "Back",
        btn_fwd: "", tip_fwd: "Forward",
        tip_refresh: "Refresh (F5)",
        btn_newfolder: "New Folder", tip_newfolder: "New Folder (F8)",
        btn_del: "Delete", tip_del: "Delete (Del)",
        btn_deselect: "Deselect", tip_deselect: "Clear (Esc)",
        btn_copy: "Copy", tip_copy: "Copy (Ctrl+C)",
        btn_cut: "Cut", tip_cut: "Cut (Ctrl+X)",
        btn_paste: "Paste", tip_paste: "Paste (Ctrl+V)",
        btn_rename: "Rename", tip_rename: "Rename (F2)",
        btn_bulkrename: "Bulk Rename", tip_bulkrename: "Bulk Rename (F2)",
        btn_settings: "Settings", tip_settings: "Settings (Alt+S)",
        ctx_open: "Open", ctx_rename: "Rename", ctx_copy: "Copy", ctx_cut: "Cut", ctx_del: "Delete", ctx_down: "Download",
        msg_newfolder_prompt: "Folder name", msg_rename_prompt: "New name:", msg_no_selection: "Select items first.",
        msg_copy_done: "Copied.", msg_cut_done: "Cut ready.", msg_paste_empty: "Nothing to paste.",
        msg_paste_same_folder: "Same folder.", msg_bulkrename_done: "Renamed {n} items.", msg_settings_saved: "Saved.",
        msg_name_exists: "Exists: {n}", msg_dup_result: "Found {n} groups.", msg_exit_confirm: "Close?",
        msg_download_fail: "Failed to get links.", msg_flatten_warn: "Flatten subfolders?", msg_dup_warn: "Start duplicate scan?",
        msg_batch_m3u: "M3U generated.", msg_batch_ef2: "EF2 generated.", msg_video_fail: "No video link.",
        modal_rename_title: "Rename", modal_rename_multi_title: "Bulk Rename", label_pattern: "Pattern", label_replace: "Replace", label_replace_note: "(Case sensitive)",
        placeholder_find: "Find", placeholder_replace: "Replace", btn_preview: "Preview", modal_preview_title: "Confirm",
        col_old: "Old", col_new: "New", btn_confirm: "Confirm", btn_cancel: "Cancel",
        modal_settings_title: "Settings", label_lang: "Language", label_player: "Player", label_aria2_url: "Aria2 URL", label_aria2_token: "Token", btn_save: "Save"
    },
    ja: {
        title: "PikPak ファイルマネージャー",
        col_name: "名前", col_size: "サイズ", col_dur: "時間", col_date: "更新日",
        btn_scan: "構造平坦化", tip_scan: "サブフォルダー内の全ファイルを現在のリストに移動します",
        btn_stop: "停止", tip_stop: "作業を停止",
        btn_dup: "重複検索", tip_dup: "現在のリストから重複した動画ファイルを検索します",
        status_ready: "準備完了 ({n} 項目)", status_scanning: "収集中... {n} (現在: {f})",
        msg_no_files: "項目がありません。",
        warn_del: "選択した {n} 項目をゴミ箱に移動しますか？",
        btn_down: "ダウンロード", tip_down: "ブラウザでダウンロード",
        btn_aria2: "Aria2", tip_aria2: "Aria2 RPCへダウンロード要求を送信",
        btn_idm: "IDM", tip_idm: "IDMエクスポートファイル(.ef2)を作成",
        btn_ext: "外部再生", tip_ext: "PotPlayer/VLCなどで再生 (設定が必要)",
        loading: "読み込み中...",
        loading_detail: "ファイルリストを取得中...",
        loading_fetch: "ファイル取得中... ({n})",
        loading_dup: "重複分析中... ({p}%)",
        sel_count: "{n} 選択済み",
        tag_hash: "Hash一致", tag_name: "名前一致", tag_sim: "類似 (時間+名前)",
        lbl_dup_tool: "削除対象選択:",
        btn_toggle_size: "ファイルサイズ", tip_toggle_size: "削除基準: サイズ (クリックで変更)",
        cond_small: "小さい順", cond_large: "大きい順",
        btn_toggle_date: "アップロード日", tip_toggle_date: "削除基準: 日付 (クリックで変更)",
        cond_old: "古い順", cond_new: "新しい順",
        btn_back: "", tip_back: "戻る (Backspace)",
        btn_fwd: "", tip_fwd: "進む",
        tip_refresh: "更新 (F5)",
        btn_newfolder: "新規フォルダ", tip_newfolder: "現在の場所にフォルダ作成 (F8)",
        btn_del: "削除", tip_del: "選択項目を削除 (Del)",
        btn_deselect: "選択解除", tip_deselect: "全選択解除 (Esc)",
        btn_copy: "コピー", tip_copy: "選択項目をコピー (Ctrl+C)",
        btn_cut: "切り取り", tip_cut: "選択項目を切り取り (Ctrl+X)",
        btn_paste: "貼り付け", tip_paste: "ここに貼り付け (Ctrl+V)",
        btn_rename: "名前変更", tip_rename: "選択項目の名前を変更 (F2)",
        btn_bulkrename: "一括変更", tip_bulkrename: "複数のファイル名を規則的に変更 (F2)",
        btn_settings: "設定", tip_settings: "設定 (Alt+S)",
        ctx_open: "開く / 再生", ctx_rename: "名前変更", ctx_copy: "コピー", ctx_cut: "切り取り", ctx_del: "削除", ctx_down: "ダウンロード",
        msg_newfolder_prompt: "フォルダ名",
        msg_rename_prompt: "新しい名前を入力:",
        msg_no_selection: "先に項目を選択してください。",
        msg_copy_done: "コピーしました。貼り付けが有効になりました。",
        msg_cut_done: "移動準備完了。貼り付けが有効になりました。",
        msg_paste_empty: "貼り付ける項目がありません。",
        msg_paste_same_folder: "同じフォルダには貼り付けできません。",
        msg_bulkrename_done: "{n} 個の項目の名前を変更しました。",
        msg_settings_saved: "設定を保存しました。ページを更新します。",
        msg_name_exists: "すでに存在する名前です: {n}",
        msg_dup_result: "{n} グループの重複が見つかりました。",
        msg_exit_confirm: "ファイルマネージャーを閉じますか？",
        msg_download_fail: "ダウンロードリンクを取得できませんでした。",
        msg_flatten_warn: "フォルダ構造を平坦化し、すべてのサブファイルを検索します。\n続けますか？",
        msg_dup_warn: "重複ファイルの検索を開始しますか？",
        msg_batch_m3u: "プレイリスト(.m3u)が作成されました。",
        msg_batch_ef2: "IDMエクスポート(.ef2)が作成されました。",
        msg_video_fail: "動画リンクを取得できません。",
        modal_rename_title: "名前変更", modal_rename_multi_title: "一括名前変更", label_pattern: "パターン (例: Video {n})", label_replace: "文字列置換/削除", label_replace_note: "(大文字小文字を区別)",
        placeholder_find: "検索文字列", placeholder_replace: "置換文字列 (空欄=削除)", btn_preview: "プレビュー", modal_preview_title: "変更確認",
        col_old: "現在の名前", col_new: "変更後の名前", btn_confirm: "確定", btn_cancel: "キャンセル",
        modal_settings_title: "設定", label_lang: "言語 (Language)", label_player: "外部プレーヤー", label_aria2_url: "Aria2 URL", label_aria2_token: "トークン", btn_save: "保存"
    },
    zh: {
        title: "PikPak 文件管理器",
        col_name: "名称", col_size: "大小", col_dur: "时长", col_date: "修改日期",
        btn_scan: "结构扁平化", tip_scan: "获取子文件夹中的所有文件",
        btn_stop: "停止", tip_stop: "停止操作",
        btn_dup: "查找重复", tip_dup: "在当前列表中查找重复视频",
        status_ready: "就绪 ({n} 项)", status_scanning: "扫描中... {n} (当前: {f})",
        msg_no_files: "没有项目。",
        warn_del: "确定要删除选中的 {n} 项吗？",
        btn_down: "下载", tip_down: "使用浏览器下载",
        btn_aria2: "发送 Aria2", tip_aria2: "发送到 Aria2 RPC",
        btn_idm: "IDM", tip_idm: "导出 IDM 文件 (.ef2)",
        btn_ext: "外部播放", tip_ext: "使用 PotPlayer/VLC 播放 (需设置)",
        loading: "加载中...",
        loading_detail: "正在获取文件列表...",
        loading_fetch: "获取中... ({n})",
        loading_dup: "分析重复项... ({p}%)",
        sel_count: "选中 {n} 项",
        tag_hash: "哈希匹配", tag_name: "名称匹配", tag_sim: "相似 (时长+名称)",
        lbl_dup_tool: "选择删除对象:",
        btn_toggle_size: "文件大小", tip_toggle_size: "删除标准: 大小 (点击切换)",
        cond_small: "保留最大", cond_large: "保留最小",
        btn_toggle_date: "上传日期", tip_toggle_date: "删除标准: 日期 (点击切换)",
        cond_old: "保留最新", cond_new: "保留最旧",
        btn_back: "", tip_back: "返回 (Backspace)",
        btn_fwd: "", tip_fwd: "前进",
        tip_refresh: "刷新 (F5)",
        btn_newfolder: "新建文件夹", tip_newfolder: "在当前位置创建文件夹 (F8)",
        btn_del: "删除", tip_del: "删除选中项 (Del)",
        btn_deselect: "取消选择", tip_deselect: "取消所有选择 (Esc)",
        btn_copy: "复制", tip_copy: "复制选中项 (Ctrl+C)",
        btn_cut: "剪切", tip_cut: "剪切选中项 (Ctrl+X)",
        btn_paste: "粘贴", tip_paste: "粘贴到此处 (Ctrl+V)",
        btn_rename: "重命名", tip_rename: "重命名选中项 (F2)",
        btn_bulkrename: "批量重命名", tip_bulkrename: "批量修改文件名 (F2)",
        btn_settings: "设置", tip_settings: "设置 (Alt+S)",
        ctx_open: "打开 / 播放", ctx_rename: "重命名", ctx_copy: "复制", ctx_cut: "剪切", ctx_del: "删除", ctx_down: "下载",
        msg_newfolder_prompt: "文件夹名称",
        msg_rename_prompt: "输入新名称:",
        msg_no_selection: "请先选择项目。",
        msg_copy_done: "已复制。请选择粘贴位置。",
        msg_cut_done: "已剪切。请选择粘贴位置。",
        msg_paste_empty: "没有可粘贴的项目。",
        msg_paste_same_folder: "无法粘贴到源文件夹。",
        msg_bulkrename_done: "已重命名 {n} 个项目。",
        msg_settings_saved: "设置已保存。页面将刷新。",
        msg_name_exists: "名称已存在: {n}",
        msg_dup_result: "发现 {n} 组重复项。",
        msg_exit_confirm: "确定要关闭文件管理器吗？",
        msg_download_fail: "无法获取下载链接。",
        msg_flatten_warn: "结构扁平化将搜索所有子文件夹。\n是否继续？",
        msg_dup_warn: "是否开始搜索重复文件？",
        msg_batch_m3u: "已生成播放列表 (.m3u)。",
        msg_batch_ef2: "已生成 IDM 导出文件 (.ef2)。",
        msg_video_fail: "无法获取视频链接。",
        modal_rename_title: "重命名", modal_rename_multi_title: "批量重命名", label_pattern: "模式 (例: Video {n})", label_replace: "替换/删除", label_replace_note: "(区分大小写)",
        placeholder_find: "查找内容", placeholder_replace: "替换为 (留空删除)", btn_preview: "预览", modal_preview_title: "确认更改",
        col_old: "原名称", col_new: "新名称", btn_confirm: "确定", btn_cancel: "取消",
        modal_settings_title: "设置", label_lang: "语言 (Language)", label_player: "外部播放器", label_aria2_url: "Aria2 地址", label_aria2_token: "Token", btn_save: "保存"
    }
};

function getLang() {
    const userLang = GM_getValue('pk_lang', '');
    return userLang ? userLang : (navigator.language.startsWith('ko') ? 'ko' : 'en');
}

function getStrings() {
    return T[getLang()] || T.en;
}
;// ./src/utils.js
const sleep = ms => new Promise(r => setTimeout(r, ms));

const esc = s => (s || '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));

const fmtSize = n => {
    n = parseInt(n || 0, 10); if (!n) return '';
    const u = ['B', 'KB', 'MB', 'GB', 'TB']; let i = 0;
    while (n >= 1024 && i < u.length - 1) { n /= 1024; i++; }
    return (n < 10 ? n.toFixed(2) : n.toFixed(1)) + ' ' + u[i];
};

const fmtDate = t => t ? new Date(t).toLocaleDateString() : '-';

const fmtDur = s => {
    if (!s) return ''; s = parseInt(s, 10);
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sc = s % 60;
    return (h > 0 ? h + ':' : '') + String(m).padStart(2, '0') + ':' + String(sc).padStart(2, '0');
};
;// ./src/api.js


function getHeaders() {
    let token = '', captcha = '';
    for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('credentials')) { try { const v = JSON.parse(localStorage.getItem(k)); token = v.token_type + ' ' + v.access_token; } catch { } }
        if (k && k.startsWith('captcha')) { try { const v = JSON.parse(localStorage.getItem(k)); captcha = v.captcha_token; } catch { } }
    }
    return { 'Content-Type': 'application/json', 'Authorization': token, 'x-device-id': localStorage.getItem('deviceid') || '', 'x-captcha-token': captcha };
}

async function apiList(parentId, limit = 1000, onProgress) {
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

async function apiGet(id) {
    const res = await fetch(`https://api-drive.mypikpak.com/drive/v1/files/${id}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`API Error ${res.status}`);
    return res.json();
}

async function apiAction(action, data) {
    const method = action.includes('batch') ? 'POST' : 'PATCH';
    const res = await fetch(`https://api-drive.mypikpak.com/drive/v1/files${action}`, { method: method, headers: getHeaders(), body: JSON.stringify(data) });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error_description || `API Error ${res.status}`);
    }
    return res.json();
}
;// ./src/main.js






console.log("🚀 PikPak Script: LOADED from main.js");

const L = getStrings();
const lang = getLang();

async function openManager() {
    if (document.querySelector('.pk-ov')) return;

    const S = {
        path: [{ id: '', name: '🏠 Home' }],
        history: [],
        forward: [],
        items: [], display: [], sel: new Set(),
        sort: 'name', dir: 1, scanning: false, dupMode: false, dupRunning: false,
        dupReasons: new Map(),
        dupGroups: new Map(),
        dupSizeStrategy: 'small',
        dupDateStrategy: 'old',
        clipItems: [], clipType: '',
        clipSourceParentId: null,
        loading: false,
        lastSelIdx: -1
    };

    const el = document.createElement('div'); el.className = 'pk-ov';
    el.innerHTML = `
        <style>${CSS}</style>
        <div class="pk-win">
            <div class="pk-loading-ov" id="pk-loader">
                <div class="pk-spin-lg"></div>
                <div class="pk-loading-txt" id="pk-load-txt">${L.loading_detail}</div>
                <button class="pk-stop-btn" id="pk-stop-load" title="${L.tip_stop}">${CONF.icons.stop} <span>${L.btn_stop}</span></button>
            </div>
            <div class="pk-hd">
                <div class="pk-tt">
                    <img src="${CONF.logoUrl}" style="width:24px;height:24px;border-radius:4px;object-fit:contain;">
                    ${L.title}
                </div>
                <div style="display:flex;gap:4px;">
                    <div class="pk-btn" id="pk-settings" style="width:32px;padding:0;justify-content:center;" title="${L.tip_settings}">${CONF.icons.settings}</div>
                    <div class="pk-btn" id="pk-close" style="width:32px;padding:0;justify-content:center;">${CONF.icons.close}</div>
                </div>
            </div>
            <div class="pk-tb">
                <div class="pk-nav" id="pk-crumb"></div>
                <div style="flex:1"></div>
                <div class="pk-dup-toolbar" id="pk-dup-tools">
                    <span class="pk-dup-lbl">${L.lbl_dup_tool}</span>
                    <button class="pk-btn-toggle" id="pk-dup-size" title="${L.tip_toggle_size}">
                        ${L.btn_toggle_size} <span id="pk-cond-size">(${L.cond_small})</span>
                    </button>
                    <button class="pk-btn-toggle" id="pk-dup-date" title="${L.tip_toggle_date}">
                        ${L.btn_toggle_date} <span id="pk-cond-date">(${L.cond_old})</span>
                    </button>
                </div>
                <button class="pk-btn" id="pk-dup" style="display:none" title="${L.tip_dup}">${CONF.icons.dup} <span>${L.btn_dup}</span></button>
                <button class="pk-btn" id="pk-scan" title="${L.tip_scan}">${CONF.icons.scan} <span>${L.btn_scan}</span></button>
            </div>
            <div class="pk-tb" id="pk-actionbar">
                <button class="pk-btn" id="pk-nav-back" title="${L.tip_back}">${CONF.icons.back}<span>${L.btn_back}</span></button>
                <button class="pk-btn" id="pk-refresh" title="${L.tip_refresh}">${CONF.icons.refresh}</button>
                <button class="pk-btn" id="pk-nav-fwd" title="${L.tip_fwd}">${CONF.icons.fwd}<span>${L.btn_fwd}</span></button>
                <div style="width:1px;height:20px;background:var(--pk-bd);margin:0 4px"></div>
                <button class="pk-btn" id="pk-newfolder" title="${L.tip_newfolder}">${CONF.icons.newfolder} <span>${L.btn_newfolder}</span></button>
                <button class="pk-btn" id="pk-del" title="${L.tip_del}">${CONF.icons.del} <span>${L.btn_del}</span></button>
                <button class="pk-btn" id="pk-deselect" title="${L.tip_deselect}" style="display:none">${CONF.icons.deselect} <span>${L.btn_deselect}</span></button>
                <div style="width:1px;height:20px;background:var(--pk-bd);margin:0 4px"></div>
                <button class="pk-btn" id="pk-copy" title="${L.tip_copy}">${CONF.icons.copy} <span>${L.btn_copy}</span></button>
                <button class="pk-btn" id="pk-cut" title="${L.tip_cut}">${CONF.icons.cut} <span>${L.btn_cut}</span></button>
                <button class="pk-btn" id="pk-paste" title="${L.tip_paste}" disabled>${CONF.icons.paste} <span>${L.btn_paste}</span></button>
                <div style="width:1px;height:20px;background:var(--pk-bd);margin:0 4px"></div>
                <button class="pk-btn" id="pk-rename" title="${L.tip_rename}">${CONF.icons.rename} <span>${L.btn_rename}</span></button>
                <button class="pk-btn" id="pk-bulkrename" title="${L.tip_bulkrename}">${CONF.icons.bulkrename} <span>${L.btn_bulkrename}</span></button>
            </div>
            <div class="pk-grid-hd">
                <div style="padding-left:4px"><input type="checkbox" id="pk-all"></div>
                <div class="pk-col" data-k="name">${L.col_name} <span></span></div>
                <div class="pk-col" data-k="size">${L.col_size} <span></span></div>
                <div class="pk-col" data-k="duration">${L.col_dur} <span></span></div>
                <div class="pk-col" data-k="modified_time">${L.col_date} <span></span></div>
            </div>
            <div class="pk-vp" id="pk-vp">
                <div class="pk-in" id="pk-in"></div>
            </div>
            <div class="pk-ft">
                <div class="pk-stat" id="pk-stat">${L.status_ready.replace('{n}', 0)}</div>
                <div class="pk-grp">
                    <button class="pk-btn" id="pk-ext" title="${L.tip_ext}">${CONF.icons.play} <span>${L.btn_ext}</span></button>
                    <div style="width:1px;height:20px;background:var(--pk-bd);margin:0 4px"></div>
                    <button class="pk-btn" id="pk-idm" title="${L.tip_idm}">${CONF.icons.link} <span>${L.btn_idm}</span></button>
                    <button class="pk-btn" id="pk-aria2" title="${L.tip_aria2}">${CONF.icons.send} <span>${L.btn_aria2}</span></button>
                    <button class="pk-btn" id="pk-down" title="${L.tip_down}">${CONF.icons.download} <span>${L.btn_down}</span></button>
                </div>
            </div>
        </div>
        <div class="pk-pop" id="pk-pop"></div>
        <div class="pk-ctx" id="pk-ctx">
            <div class="pk-ctx-item" id="ctx-open">📂 ${L.ctx_open}</div>
            <div class="pk-ctx-sep"></div>
            <div class="pk-ctx-item" id="ctx-down">💾 ${L.ctx_down}</div>
            <div class="pk-ctx-item" id="ctx-copy">📄 ${L.ctx_copy}</div>
            <div class="pk-ctx-item" id="ctx-cut">✂️ ${L.ctx_cut}</div>
            <div class="pk-ctx-sep"></div>
            <div class="pk-ctx-item" id="ctx-rename">✏️ ${L.ctx_rename}</div>
            <div class="pk-ctx-item" id="ctx-del" style="color:#d93025">🗑️ ${L.ctx_del}</div>
        </div>
    `;
    document.body.appendChild(el);

    const UI = {
        win: el.querySelector('.pk-win'), vp: el.querySelector('#pk-vp'), in: el.querySelector('#pk-in'),
        loader: el.querySelector('#pk-loader'), loadTxt: el.querySelector('#pk-load-txt'), stopBtn: el.querySelector('#pk-stop-load'),
        crumb: el.querySelector('#pk-crumb'), stat: el.querySelector('#pk-stat'),
        chkAll: el.querySelector('#pk-all'), scan: el.querySelector('#pk-scan'), dup: el.querySelector('#pk-dup'),
        dupTools: el.querySelector('#pk-dup-tools'),
        btnDupSize: el.querySelector('#pk-dup-size'), condSize: el.querySelector('#pk-cond-size'),
        btnDupDate: el.querySelector('#pk-dup-date'), condDate: el.querySelector('#pk-cond-date'),
        btnBack: el.querySelector('#pk-nav-back'), btnFwd: el.querySelector('#pk-nav-fwd'),
        btnCopy: el.querySelector('#pk-copy'), btnCut: el.querySelector('#pk-cut'),
        btnDel: el.querySelector('#pk-del'), btnDeselect: el.querySelector('#pk-deselect'),
        btnRename: el.querySelector('#pk-rename'), btnBulkRename: el.querySelector('#pk-bulkrename'), btnPaste: el.querySelector('#pk-paste'),
        btnRefresh: el.querySelector('#pk-refresh'), btnNewFolder: el.querySelector('#pk-newfolder'),
        btnSettings: el.querySelector('#pk-settings'), btnClose: el.querySelector('#pk-close'),
        btnExt: el.querySelector('#pk-ext'), btnIdm: el.querySelector('#pk-idm'),
        pop: el.querySelector('#pk-pop'), ctx: el.querySelector('#pk-ctx'), cols: el.querySelectorAll('.pk-col')
    };

    function showModal(html) {
        const m = document.createElement('div'); m.className = 'pk-modal-ov'; m.innerHTML = `<div class="pk-modal">${html}</div>`; UI.win.appendChild(m); return m;
    }

    function setLoad(b) { S.loading = b; UI.loader.style.display = b ? 'flex' : 'none'; if (b) UI.loadTxt.textContent = L.loading_detail; }
    function updateLoadTxt(txt) { if (UI.loadTxt) UI.loadTxt.innerText = txt; }
    function updateNavState() {
        UI.btnBack.disabled = (S.history.length === 0 && S.path.length <= 1);
        UI.btnFwd.disabled = S.forward.length === 0;
    }

    async function load(isHistoryNav = false) {
        if (S.loading) return;
        setLoad(true);
        const cur = S.path[S.path.length - 1];
        updateNavState();
        UI.scan.style.display = 'flex'; UI.dup.style.display = 'none'; UI.dupTools.style.display = 'none';
        S.dupMode = false; S.lastSelIdx = -1;
        renderCrumb();
        try {
            if (!S.scanning) {
                updateLoadTxt(L.loading_detail);
                S.items = await apiList(cur.id, 1000, (cnt) => { updateLoadTxt(L.loading_fetch.replace('{n}', cnt)); });
                refresh();
            }
        } catch (e) { console.error(e); alert("Failed to load: " + e.message); }
        finally { setLoad(false); }
        el.focus();
    }

    async function refresh() {
        S.display = [...S.items];
        S.dupReasons.clear(); S.dupGroups.clear();

        if (S.dupMode) {
            setLoad(true); S.dupRunning = true; UI.stopBtn.onclick = () => { S.dupRunning = false; };
            updateLoadTxt(L.loading_dup.replace('{p}', 0)); await sleep(50);
            const videos = S.display.filter(i => i.mime_type && i.mime_type.startsWith('video'));
            videos.sort((a, b) => a.name.length - b.name.length);
            const clean = (name) => name.replace(/\.[^/.]+$/, "").toLowerCase().trim();
            const assigned = new Set(); const groups = []; const chunkSize = 50;

            for (let i = 0; i < videos.length; i++) {
                if (!S.dupRunning) break;
                if (i % chunkSize === 0) { updateLoadTxt(L.loading_dup.replace('{p}', Math.round((i / videos.length) * 100))); await sleep(0); }
                if (assigned.has(videos[i].id)) continue;
                const root = videos[i]; const rootName = clean(root.name); const rootHash = root.gcid || root.md5_checksum || root.hash; const rootDur = parseFloat(root.params?.duration || 0);
                const group = { items: [root], type: '' }; assigned.add(root.id);

                for (let j = i + 1; j < videos.length; j++) {
                    if (assigned.has(videos[j].id)) continue;
                    const target = videos[j]; let isDup = false; let type = '';
                    const targetHash = target.gcid || target.md5_checksum || target.hash;
                    if (rootHash && targetHash && rootHash === targetHash && root.size === target.size) { isDup = true; type = L.tag_hash; }
                    if (!isDup) {
                        const targetName = clean(target.name);
                        if (rootName === targetName) { isDup = true; type = L.tag_name; }
                        else if (rootDur > 0) { if (Math.abs(rootDur - parseFloat(target.params?.duration || 0)) <= 1.0 && (targetName.includes(rootName) || rootName.includes(targetName))) { isDup = true; type = L.tag_sim; } }
                    }
                    if (isDup) { group.items.push(target); if (!group.type) group.type = type; assigned.add(target.id); S.dupReasons.set(target.id, type); }
                }
                if (group.items.length > 1) { groups.push(group.items.map(i => i.id)); if (!S.dupReasons.has(root.id)) S.dupReasons.set(root.id, group.type); }
            }
            const newDisplay = [];
            groups.forEach((ids, gIdx) => {
                ids.forEach(id => S.dupGroups.set(id, gIdx));
                const firstId = ids[0]; const firstItem = S.items.find(x => x.id === firstId);
                newDisplay.push({ id: `grp_${gIdx}`, isHeader: true, name: firstItem ? firstItem.name : `Group ${gIdx}`, count: ids.length, type: S.dupReasons.get(firstId) || "Group" });
                ids.forEach(id => { const item = S.items.find(x => x.id === id); if (item) newDisplay.push(item); });
            });
            S.display = newDisplay; S.dupRunning = false; setLoad(false); UI.dupTools.style.display = 'flex';
        } else {
            UI.dupTools.style.display = 'none';
            S.display.sort((a, b) => {
                if (a.kind !== b.kind) return a.kind === 'drive#folder' ? -1 : 1;
                let va = a[S.sort], vb = b[S.sort];
                if (S.sort === 'size') { va = parseInt(va || 0); vb = parseInt(vb || 0); }
                else if (S.sort === 'duration') { va = parseInt(a.params?.duration || 0); vb = parseInt(b.params?.duration || 0); }
                if (va > vb) return S.dir; if (va < vb) return -S.dir; return 0;
            });
        }
        const currentIds = new Set(S.display.filter(x => !x.isHeader).map(i => i.id));
        for (let id of S.sel) { if (!currentIds.has(id)) S.sel.delete(id); }
        if (S.sel.size === 0) UI.chkAll.checked = false;
        renderList(); updateStat(); el.focus();
    }

    function renderList() {
        UI.in.style.height = `${S.display.length * CONF.rowHeight}px`;
        UI.cols.forEach(c => { c.querySelector('span').textContent = (c.dataset.k === S.sort) ? (S.dir === 1 ? ' ▲' : ' ▼') : ''; c.style.color = (c.dataset.k === S.sort) ? 'var(--pk-pri)' : ''; });
        requestAnimationFrame(renderVisible);
    }

    function renderVisible() {
        const top = UI.vp.scrollTop; const h = UI.vp.clientHeight;
        const start = Math.max(0, Math.floor(top / CONF.rowHeight) - CONF.buffer);
        const end = Math.min(S.display.length, Math.ceil((top + h) / CONF.rowHeight) + CONF.buffer);
        UI.in.innerHTML = '';
        for (let i = start; i < end; i++) {
            const d = S.display[i]; if (!d) continue;
            const row = document.createElement('div'); row.style.position = 'absolute'; row.style.top = `${i * CONF.rowHeight}px`; row.style.width = '100%';
            if (d.isHeader) {
                row.className = 'pk-group-hd'; row.innerHTML = `<div style="display:flex; align-items:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;"><span style="margin-right:8px;">📁</span><span>${esc(d.name)}</span></div><div style="margin-left:auto; display:flex; align-items:center;"><span class="pk-tag">${d.type}</span><span class="pk-cnt">${d.count}</span></div>`;
            } else {
                const isSel = S.sel.has(d.id); row.className = `pk-row ${isSel ? 'sel' : ''}`;
                row.innerHTML = `<div style="text-align:center"><input type="checkbox" ${isSel ? 'checked' : ''}></div><div class="pk-name" title="${esc(d.name)}">${d.kind === 'drive#folder' ? '📁' : '📄'} ${esc(d.name)}</div><div>${d.kind === 'drive#folder' ? '' : fmtSize(d.size)}</div><div>${fmtDur(d.params?.duration || d.medias?.[0]?.duration)}</div><div style="color:#888">${fmtDate(d.modified_time)}</div>`;
                const chk = row.querySelector('input');
                row.onclick = (e) => { if (S.loading) return; if (e.shiftKey && S.lastSelIdx !== -1) { const startIdx = Math.min(S.lastSelIdx, i); const endIdx = Math.max(S.lastSelIdx, i); for (let k = startIdx; k <= endIdx; k++) { if (!S.display[k].isHeader) S.sel.add(S.display[k].id); } } else { if (e.target !== chk) chk.checked = !chk.checked; if (chk.checked) S.sel.add(d.id); else S.sel.delete(d.id); S.lastSelIdx = i; } renderList(); updateStat(); };
                row.ondblclick = (e) => { e.preventDefault(); if (S.loading) return; if (d.kind === 'drive#folder') { S.history.push({ path: [...S.path] }); S.path.push({ id: d.id, name: d.name }); S.forward = []; load(); } else if (d.mime_type?.startsWith('video')) playVideo(d); };
                row.oncontextmenu = (e) => { e.preventDefault(); if (!S.sel.has(d.id)) { S.sel.clear(); S.sel.add(d.id); S.lastSelIdx = i; renderList(); updateStat(); } UI.ctx.style.display = 'block'; let x = e.clientX; let y = e.clientY; const w = UI.ctx.offsetWidth || 150; const h = UI.ctx.offsetHeight || 200; if (x + w > window.innerWidth) x = window.innerWidth - w - 10; if (y + h > window.innerHeight) y = window.innerHeight - h - 10; UI.ctx.style.left = x + 'px'; UI.ctx.style.top = y + 'px'; };
                row.onmouseenter = (e) => { if (d.thumbnail_link && !S.loading) { UI.pop.innerHTML = `<img src="${d.thumbnail_link}">`; UI.pop.style.display = 'block'; const r = UI.pop.getBoundingClientRect(); let t = e.clientY + 15; if (t + r.height > window.innerHeight) t = e.clientY - r.height - 10; UI.pop.style.top = t + 'px'; UI.pop.style.left = (e.clientX + 15) + 'px'; } };
                row.onmouseleave = () => UI.pop.style.display = 'none';
            }
            UI.in.appendChild(row);
        }
    }
    UI.vp.onscroll = renderVisible;

    function renderCrumb() {
        UI.crumb.innerHTML = '';
        S.path.forEach((p, i) => {
            const s = document.createElement('span'); s.textContent = p.name; s.className = i === S.path.length - 1 ? 'act' : '';
            s.onclick = () => { if (i !== S.path.length - 1 && !S.loading) { S.history.push({ path: [...S.path] }); S.forward = []; S.path = S.path.slice(0, i + 1); load(); } };
            UI.crumb.appendChild(s); if (i < S.path.length - 1) UI.crumb.appendChild(document.createTextNode(' › '));
        });
    }

    const goBack = () => {
        if (S.loading) return;
        if (S.history.length > 0) { S.forward.push([...S.path]); const prevState = S.history.pop(); S.path = prevState.path; load(true); return; }
        if (S.path.length > 1) { S.forward.push([...S.path]); S.path = S.path.slice(0, S.path.length - 1); load(true); return; }
        if (S.path.length === 1 && S.history.length === 0) { if (confirm(L.msg_exit_confirm)) { el.remove(); } }
    };
    const goForward = () => { if (S.forward.length > 0 && !S.loading) { S.history.push({ path: [...S.path] }); const nextPath = S.forward.pop(); S.path = nextPath; load(); } };

    el.tabIndex = 0; el.focus();
    const keyHandler = (e) => {
        if (!document.querySelector('.pk-ov')) return;
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
        if (e.key === 'Escape') { const player = document.getElementById('pk-player-ov'); if (player) { player.remove(); return; } const openModal = document.querySelector('.pk-modal-ov'); if (openModal) { openModal.remove(); return; } if (UI.ctx.style.display === 'block') UI.ctx.style.display = 'none'; else if (S.sel.size > 0) { S.sel.clear(); refresh(); } else if (S.path.length === 1) el.remove(); return; }
        if (e.key === 'F2') { e.preventDefault(); if (S.sel.size === 1) UI.btnRename.click(); else if (S.sel.size > 1) UI.btnBulkRename.click(); }
        if (e.key === 'F5') { e.preventDefault(); UI.btnRefresh.click(); }
        if (e.key === 'F8') { e.preventDefault(); UI.btnNewFolder.click(); }
        if (e.key === 'Delete') { UI.btnDel.click(); }
        if (e.key === 'Backspace') { e.preventDefault(); if (e.shiftKey) { if (!S.scanning) goForward(); } else { if (!S.scanning) goBack(); } return; }
        if (e.altKey && e.key === 'ArrowLeft') { e.preventDefault(); goBack(); return; }
        if (e.altKey && e.key === 'ArrowRight') { e.preventDefault(); goForward(); return; }
        if (e.ctrlKey || e.metaKey) { if (e.key === 'a' || e.key === 'A') { e.preventDefault(); UI.chkAll.click(); } if (e.key === 'c' || e.key === 'C') { e.preventDefault(); UI.btnCopy.click(); } if (e.key === 'x' || e.key === 'X') { e.preventDefault(); UI.btnCut.click(); } if (e.key === 'v' || e.key === 'V') { e.preventDefault(); UI.btnPaste.click(); } }
        if (e.altKey) { if (e.key === 's' || e.key === 'S') { e.preventDefault(); UI.btnSettings.click(); } }
    };
    document.addEventListener('keydown', keyHandler);
    const mouseHandler = (e) => { if (!document.querySelector('.pk-ov')) return; if (e.button === 3) { e.preventDefault(); e.stopPropagation(); goBack(); } if (e.button === 4) { e.preventDefault(); e.stopPropagation(); goForward(); } if (UI.ctx.style.display === 'block' && !UI.ctx.contains(e.target)) UI.ctx.style.display = 'none'; };
    document.addEventListener('mouseup', mouseHandler);

    function updateStat() {
        const n = S.sel.size; UI.stat.textContent = n > 0 ? L.sel_count.replace('{n}', n) : L.status_ready.replace('{n}', S.display.length); const hasSel = n > 0;
        UI.btnCopy.disabled = !hasSel; UI.btnCut.disabled = !hasSel; UI.btnDel.disabled = !hasSel; UI.btnRename.disabled = n !== 1; UI.btnBulkRename.disabled = n < 2; UI.btnSettings.disabled = false; UI.btnDeselect.style.display = hasSel ? 'inline-flex' : 'none';
    }

    async function getLinks() { const res = []; for (const id of S.sel) { let item = S.items.find(x => x.id === id); if (item && !item.web_content_link) { try { item = await apiGet(id); } catch { } } if (item?.web_content_link) res.push(item); } return res; }
    async function playVideo(item) {
        let link = item.web_content_link; if (!link) { try { const m = await apiGet(item.id); link = m.web_content_link; } catch (e) { console.error(e); } }
        if (!link) { alert(L.msg_video_fail || "Cannot fetch video link."); return; }
        const d = document.createElement('div'); d.id = 'pk-player-ov'; d.tabIndex = 0;
        d.innerHTML = `<div style="position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,0.95);backdrop-filter:blur(5px);display:flex;justify-content:center;align-items:center;"><div style="width:95vw;height:95vh;max-width:1600px;background:#000;border-radius:8px;box-shadow:0 20px 60px rgba(0,0,0,0.8);display:flex;flex-direction:column;overflow:hidden;border:1px solid #333;"><div style="flex:0 0 40px;background:#1a1a1a;padding:0 20px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #333;"><span style="color:#ddd;font-weight:600;font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(item.name)}</span><button class="pk-close-btn" style="color:#aaa;background:none;border:none;font-size:24px;cursor:pointer;width:30px;height:30px;display:flex;align-items:center;justify-content:center;">×</button></div><div style="flex:1;background:#000;position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden;"><video src="${link}" controls autoplay playsinline preload="auto" style="width:100%;height:100%;object-fit:contain;outline:none;" onerror="alert('Video Load Failed. Link might be restricted.');"></video></div></div><style>.pk-close-btn:hover{color:#fff}</style></div>`;
        document.body.appendChild(d); d.focus(); d.onkeydown = (e) => { if (e.key === 'Escape') { d.remove(); e.stopPropagation(); } }; d.querySelector('.pk-close-btn').onclick = () => d.remove(); d.onclick = (e) => { if (e.target === d.firstElementChild) d.remove(); };
    }

    // Handlers
    UI.scan.onclick = async () => { if (S.scanning) { S.scanning = false; return; } if (!confirm(L.msg_flatten_warn)) return; S.scanning = true; UI.stopBtn.onclick = () => { S.scanning = false; }; const root = S.path[S.path.length - 1]; let q = [{ id: root.id, name: root.name }]; let all = []; setLoad(true); try { while (q.length && S.scanning) { const curr = q.shift(); const pid = curr.id; updateLoadTxt(L.status_scanning.replace('{n}', all.length).replace('{f}', curr.name) + "\n" + L.loading_detail); const files = await apiList(pid, 500, (currentCount) => { updateLoadTxt(L.status_scanning.replace('{n}', all.length + currentCount).replace('{f}', curr.name)); }); for (const f of files) { if (f.kind === 'drive#folder') q.push({ id: f.id, name: f.name }); else all.push(f); } await sleep(20); } if (S.scanning) { S.items = all; UI.dup.style.display = 'flex'; refresh(); } } catch (e) { alert("Error: " + e.message); } finally { S.scanning = false; setLoad(false); updateStat(); } };
    UI.dup.onclick = () => { if (!S.dupMode) if (!confirm(L.msg_dup_warn)) return; S.dupMode = !S.dupMode; UI.dup.style.backgroundColor = S.dupMode ? '#444' : ''; UI.dup.style.color = S.dupMode ? '#fff' : ''; UI.dup.style.borderColor = S.dupMode ? '#666' : ''; refresh(); };
    UI.btnDupSize.onclick = () => { S.dupSizeStrategy = S.dupSizeStrategy === 'small' ? 'large' : 'small'; UI.condSize.textContent = `(${S.dupSizeStrategy === 'small' ? L.cond_small : L.cond_large})`; S.sel.clear(); const itemMap = new Map(); S.display.forEach(d => { if (d.isHeader) return; const gIdx = S.dupGroups.get(d.id); if (gIdx !== undefined) { if (!itemMap.has(gIdx)) itemMap.set(gIdx, []); itemMap.get(gIdx).push(d); } }); itemMap.forEach(items => { if (items.length < 2) return; let keep = (S.dupSizeStrategy === 'small') ? items.reduce((a, b) => parseInt(a.size) > parseInt(b.size) ? a : b) : items.reduce((a, b) => parseInt(a.size) < parseInt(b.size) ? a : b); items.forEach(i => { if (i.id !== keep.id) S.sel.add(i.id); }); }); renderList(); updateStat(); };
    UI.btnDupDate.onclick = () => { S.dupDateStrategy = S.dupDateStrategy === 'old' ? 'new' : 'old'; UI.condDate.textContent = `(${S.dupDateStrategy === 'old' ? L.cond_old : L.cond_new})`; S.sel.clear(); const itemMap = new Map(); S.display.forEach(d => { if (d.isHeader) return; const gIdx = S.dupGroups.get(d.id); if (gIdx !== undefined) { if (!itemMap.has(gIdx)) itemMap.set(gIdx, []); itemMap.get(gIdx).push(d); } }); itemMap.forEach(items => { if (items.length < 2) return; let keep = (S.dupDateStrategy === 'old') ? items.reduce((a, b) => new Date(a.modified_time) > new Date(b.modified_time) ? a : b) : items.reduce((a, b) => new Date(a.modified_time) < new Date(b.modified_time) ? a : b); items.forEach(i => { if (i.id !== keep.id) S.sel.add(i.id); }); }); renderList(); updateStat(); };
    UI.cols.forEach(c => c.onclick = () => { const k = c.dataset.k; if (S.sort === k) S.dir *= -1; else { S.sort = k; S.dir = 1; } refresh(); });
    UI.chkAll.onclick = (e) => { if (e.target.checked) S.display.forEach(i => S.sel.add(i.id)); else S.sel.clear(); renderList(); updateStat(); };
    UI.btnBack.onclick = goBack; UI.btnFwd.onclick = goForward; UI.btnRefresh.onclick = () => load();
    UI.btnNewFolder.onclick = async () => { const name = prompt(L.msg_newfolder_prompt, ''); if (!name) return; const cur = S.path[S.path.length - 1]; try { await fetch('https://api-drive.mypikpak.com/drive/v1/files', { method: 'POST', headers: getHeaders(), body: JSON.stringify({ kind: 'drive#folder', parent_id: cur.id || '', name: name }) }); load(); } catch (e) { alert('Error: ' + e.message); } };
    UI.btnCopy.onclick = () => { if (S.sel.size === 0) return; S.clipItems = Array.from(S.sel); S.clipType = 'copy'; S.clipSourceParentId = S.path[S.path.length - 1].id || ''; UI.btnPaste.disabled = false; alert(L.msg_copy_done); };
    UI.btnCut.onclick = () => { if (S.sel.size === 0) return; S.clipItems = Array.from(S.sel); S.clipType = 'move'; S.clipSourceParentId = S.path[S.path.length - 1].id || ''; UI.btnPaste.disabled = false; alert(L.msg_cut_done); };
    UI.btnPaste.onclick = async () => { if (!S.clipItems || S.clipItems.length === 0) { alert(L.msg_paste_empty); return; } setLoad(true); const dest = S.path[S.path.length - 1].id || ''; if (S.clipSourceParentId === dest) { alert(L.msg_paste_same_folder); setLoad(false); return; } const ids = S.clipItems.slice(); const endpoint = S.clipType === 'move' ? 'https://api-drive.mypikpak.com/drive/v1/files:batchMove' : 'https://api-drive.mypikpak.com/drive/v1/files:batchCopy'; try { await fetch(endpoint, { method: 'POST', headers: getHeaders(), body: JSON.stringify({ ids: ids, to: { parent_id: dest } }) }); S.clipItems = []; S.clipType = ''; UI.btnPaste.disabled = true; await sleep(500); setLoad(false); await load(); } catch (e) { alert('Paste error: ' + e.message); setLoad(false); } };
    UI.btnRename.onclick = async () => { if (S.sel.size !== 1) return; const id = Array.from(S.sel)[0]; const item = S.items.find(i => i.id === id); if (!item) return; const m = showModal(`<h3>${L.modal_rename_title}</h3><div class="pk-field"><input type="text" id="rn_new_name" value="${esc(item.name)}"></div><div class="pk-modal-act"><button class="pk-btn" id="rn_cancel">${L.btn_cancel}</button><button class="pk-btn pri" id="rn_confirm">${L.btn_confirm}</button></div>`); const inp = m.querySelector('#rn_new_name'); inp.focus(); if (item.kind !== 'drive#folder' && item.name.lastIndexOf('.') > 0) inp.setSelectionRange(0, item.name.lastIndexOf('.')); else inp.select(); const doRename = async () => { const newName = inp.value.trim(); if (!newName || newName === item.name) { m.remove(); return; } if (S.items.some(i => i.name === newName)) { alert(L.msg_name_exists.replace('{n}', newName)); return; } m.remove(); try { setLoad(true); await apiAction(`/${id}`, { name: newName }); await sleep(200); setLoad(false); load(); } catch (e) { alert("Error: " + e.message); setLoad(false); } }; m.querySelector('#rn_cancel').onclick = () => m.remove(); m.querySelector('#rn_confirm').onclick = doRename; inp.onkeydown = (e) => { if (e.key === 'Enter') doRename(); if (e.key === 'Escape') { m.remove(); e.stopPropagation(); } }; };
    UI.btnBulkRename.onclick = () => { if (S.sel.size < 2) return; const m = showModal(`<h3>${L.modal_rename_multi_title}</h3><div class="pk-field"><label><input type="radio" name="rn_mode" value="pattern" checked> ${L.label_pattern}</label><input type="text" id="rn_pattern" value="Video {n}" placeholder="Video {n}"></div><div class="pk-field" style="margin-top:10px"><label><input type="radio" name="rn_mode" value="replace"> ${L.label_replace} <span style="font-size:11px;color:#888">${L.label_replace_note}</span></label><input type="text" id="rn_find" placeholder="${L.placeholder_find}" disabled><input type="text" id="rn_rep" placeholder="${L.placeholder_replace}" disabled></div><div class="pk-modal-act"><button class="pk-btn" id="rn_cancel">${L.btn_cancel}</button><button class="pk-btn pri" id="rn_preview">${L.btn_preview}</button></div>`); const radios = m.querySelectorAll('input[name="rn_mode"]'); const inpPattern = m.querySelector('#rn_pattern'); const inpFind = m.querySelector('#rn_find'); const inpRep = m.querySelector('#rn_rep'); radios.forEach(r => r.onchange = () => { const isPat = r.value === 'pattern'; inpPattern.disabled = !isPat; inpFind.disabled = isPat; inpRep.disabled = isPat; }); m.querySelector('#rn_cancel').onclick = () => m.remove(); m.querySelector('#rn_preview').onclick = () => { const mode = m.querySelector('input[name="rn_mode"]:checked').value; const pattern = inpPattern.value; const findStr = inpFind.value; const repStr = inpRep.value || ''; let idx = 1; const changes = []; const existingNames = new Set(S.items.map(i => i.name)); for (const id of S.sel) { const item = S.items.find(x => x.id === id); if (!item) continue; let base = item.name; let ext = ""; if (item.kind !== 'drive#folder' && item.name.lastIndexOf('.') > 0) { base = item.name.substring(0, item.name.lastIndexOf('.')); ext = item.name.substring(item.name.lastIndexOf('.')); } let newBase = base; if (mode === 'pattern') { if (pattern) newBase = pattern.replace(/\{n\}/g, idx++); } else { if (findStr && base.includes(findStr)) newBase = base.split(findStr).join(repStr); } const finalName = newBase + ext; if (finalName !== item.name) { if (existingNames.has(finalName)) { alert(L.msg_name_exists.replace('{n}', finalName)); return; } changes.push({ id: item.id, old: item.name, new: finalName }); } } m.remove(); if (changes.length === 0) { alert("No changes detected."); return; } let rowsHtml = changes.map(c => `<div class="pk-prev-row"><div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(c.old)}</div><div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--pk-pri)">${esc(c.new)}</div></div>`).join(''); const p = showModal(`<h3>${L.modal_preview_title} (${changes.length})</h3><div class="pk-prev-list"><div class="pk-prev-row" style="font-weight:bold;background:#eee"><div>${L.col_old}</div><div>${L.col_new}</div></div>${rowsHtml}</div><div class="pk-modal-act"><button class="pk-btn" id="pr_cancel">${L.btn_cancel}</button><button class="pk-btn pri" id="pr_confirm">${L.btn_confirm}</button></div>`); p.querySelector('#pr_cancel').onclick = () => p.remove(); p.querySelector('#pr_confirm').onclick = async () => { setLoad(true); let count = 0; try { for (const c of changes) { await apiAction(`/${c.id}`, { name: c.new }); count++; await sleep(50); } alert(L.msg_bulkrename_done.replace('{n}', count)); load(); } catch (e) { alert("Rename Error: " + e.message); } finally { setLoad(false); p.remove(); } }; }; };
    UI.btnExt.onclick = async () => { const player = GM_getValue('pk_ext_player', 'system'); const files = await getLinks(); if (!files || files.length === 0) { alert(L.msg_download_fail); return; } if (S.sel.size > 1) { let m3u = '#EXTM3U\n'; files.forEach(f => { m3u += `#EXTINF:-1,${f.name}\n${f.web_content_link}\n`; }); const blob = new Blob([m3u], { type: 'audio/x-mpegurl' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `pikpak_playlist_${Date.now()}.m3u`; a.click(); alert(L.msg_batch_m3u); } else { const f = files[0]; if (player === 'system') window.open(f.web_content_link, '_blank'); else window.open((player === 'potplayer' ? 'potplayer://' : 'vlc://') + f.web_content_link, '_self'); } };
    UI.btnIdm.onclick = async () => { const files = await getLinks(); if (!files || files.length === 0) { alert(L.msg_download_fail); return; } if (S.sel.size > 1) { let ef2 = ''; files.forEach(f => { ef2 += `<\r\n${f.web_content_link}\r\nfilename=${f.name}\r\n>\r\n`; }); const blob = new Blob([ef2], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `pikpak_idm_${Date.now()}.ef2`; a.click(); alert(L.msg_batch_ef2); } else { window.open(files[0].web_content_link, '_blank'); } };
    UI.win.querySelector('#pk-down').onclick = async () => { const files = await getLinks(); if (!files || files.length === 0) { alert(L.msg_download_fail); return; } for (const f of files) { const a = document.createElement('a'); a.href = f.web_content_link; document.body.appendChild(a); a.click(); a.remove(); await sleep(200); } };
    UI.win.querySelector('#pk-aria2').onclick = async () => { const files = await getLinks(); if (!files.length) { alert(L.msg_download_fail); return; } const ariaUrl = GM_getValue('pk_aria2_url', 'ws://localhost:6800/jsonrpc'); const ariaToken = GM_getValue('pk_aria2_token', ''); const payload = files.map(f => ({ jsonrpc: '2.0', method: 'aria2.addUri', id: f.id, params: [`token:${ariaToken}`, [f.web_content_link], { out: f.name }] })); try { await fetch(ariaUrl, { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } }); alert(`Sent ${files.length} to Aria2`); } catch (e) { alert('Aria2 Error. Check Settings.'); } };
    UI.btnDel.onclick = async () => { if (!S.sel.size) return; if (confirm(L.warn_del.replace('{n}', S.sel.size))) { await fetch(`https://api-drive.mypikpak.com/drive/v1/files:batchTrash`, { method: 'POST', headers: getHeaders(), body: JSON.stringify({ ids: Array.from(S.sel) }) }); await sleep(500); if (!S.scanning) load(); else { S.items = S.items.filter(i => !S.sel.has(i.id)); refresh(); } } };
    UI.btnDeselect.onclick = () => { S.sel.clear(); refresh(); };
    UI.btnSettings.onclick = () => { const curLang = GM_getValue('pk_lang', lang); const curPlayer = GM_getValue('pk_ext_player', 'system'); const curAriaUrl = GM_getValue('pk_aria2_url', 'ws://localhost:6800/jsonrpc'); const curAriaToken = GM_getValue('pk_aria2_token', ''); const m = showModal(`<h3>${L.modal_settings_title}</h3><div class="pk-field"><label>${L.label_lang}</label><select id="set_lang"><option value="ko" ${curLang === 'ko' ? 'selected' : ''}>한국어</option><option value="en" ${curLang === 'en' ? 'selected' : ''}>English</option><option value="ja" ${curLang === 'ja' ? 'selected' : ''}>日本語</option><option value="zh" ${curLang === 'zh' ? 'selected' : ''}>中文 (简体)</option></select></div><div class="pk-field"><label>${L.label_player}</label><select id="set_player"><option value="system" ${curPlayer === 'system' ? 'selected' : ''}>System Default</option><option value="potplayer" ${curPlayer === 'potplayer' ? 'selected' : ''}>PotPlayer</option><option value="vlc" ${curPlayer === 'vlc' ? 'selected' : ''}>VLC Player</option></select></div><div class="pk-field"><label>${L.label_aria2_url}</label><input type="text" id="set_aria_url" value="${esc(curAriaUrl)}"></div><div class="pk-field"><label>${L.label_aria2_token}</label><input type="text" id="set_aria_token" value="${esc(curAriaToken)}"></div><div class="pk-modal-act"><button class="pk-btn" id="set_cancel">${L.btn_cancel}</button><button class="pk-btn pri" id="set_save">${L.btn_save}</button></div><div class="pk-credit"><b>제작: 브랜뉴(poihoii)</b><br><a href="https://github.com/poihoii/PikPak_FileManager" target="_blank">https://github.com/poihoii/PikPak_FileManager</a></div>`); m.querySelector('#set_cancel').onclick = () => m.remove(); m.querySelector('#set_save').onclick = () => { GM_setValue('pk_lang', m.querySelector('#set_lang').value); GM_setValue('pk_ext_player', m.querySelector('#set_player').value); GM_setValue('pk_aria2_url', m.querySelector('#set_aria_url').value); GM_setValue('pk_aria2_token', m.querySelector('#set_aria_token').value); alert(L.msg_settings_saved); location.reload(); }; };

    const ctx = el.querySelector('#pk-ctx');
    ctx.querySelector('#ctx-open').onclick = () => { ctx.style.display = 'none'; const id = Array.from(S.sel)[0]; const item = S.items.find(i => i.id === id); if (item) { if (item.kind === 'drive#folder') { S.history.push({ path: [...S.path] }); S.path.push({ id: item.id, name: item.name }); S.forward = []; load(); } else if (item.mime_type?.startsWith('video')) playVideo(item); } };
    ctx.querySelector('#ctx-down').onclick = () => { ctx.style.display = 'none'; UI.win.querySelector('#pk-down').click(); };
    ctx.querySelector('#ctx-copy').onclick = () => { ctx.style.display = 'none'; UI.btnCopy.click(); };
    ctx.querySelector('#ctx-cut').onclick = () => { ctx.style.display = 'none'; UI.btnCut.click(); };
    ctx.querySelector('#ctx-rename').onclick = () => { ctx.style.display = 'none'; UI.btnRename.click(); };
    ctx.querySelector('#ctx-del').onclick = () => { ctx.style.display = 'none'; UI.btnDel.click(); };
    UI.btnClose.addEventListener('click', () => { el.remove(); document.removeEventListener('keydown', keyHandler); document.removeEventListener('mouseup', mouseHandler); });

    updateStat();
    load();
}

function tryInject() {
    console.log("🚀 PikPak Script: Attempting inject...");
    if (document.getElementById('pk-launch')) {
        console.log("🚀 PikPak Script: Already injected.");
        return;
    }
    if (!document.body) {
        console.log("🚀 PikPak Script: Body not ready, retrying...");
        setTimeout(tryInject, 500);
        return;
    }
    inject();
    console.log("🚀 PikPak Script: INJECT SUCCESS!");
}

function inject() {
    if (document.getElementById('pk-launch')) return;
    const b = document.createElement('button'); b.id = 'pk-launch';
    b.style.cssText = `position:fixed;bottom:20px;right:20px;width:50px;height:50px;border-radius:50%;background:#1a5eff;border:none;cursor:pointer;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,0.3);padding:0;overflow:hidden;transition:transform 0.1s;`;
    b.innerHTML = `<img src="${CONF.logoUrl}" style="width:100%;height:100%;display:block;border-radius:50%;">`;

    const savedLeft = GM_getValue('pk_pos_left', null);
    const savedTop = GM_getValue('pk_pos_top', null);

    if (savedLeft !== null && savedTop !== null) {
        b.style.bottom = 'auto';
        b.style.right = 'auto';
        b.style.left = savedLeft;
        b.style.top = savedTop;
    }

    let isDragging = false;
    let dragStartX, dragStartY;

    b.onmousedown = (e) => {
        isDragging = false;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        const rect = b.getBoundingClientRect();
        b.style.bottom = 'auto'; b.style.right = 'auto';
        b.style.left = rect.left + 'px'; b.style.top = rect.top + 'px';
        b.style.transition = 'none';
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        const onMove = (em) => {
            if (!isDragging && (Math.abs(em.clientX - dragStartX) > 3 || Math.abs(em.clientY - dragStartY) > 3)) {
                isDragging = true;
            }
            if (isDragging) {
                b.style.left = (em.clientX - offsetX) + 'px';
                b.style.top = (em.clientY - offsetY) + 'px';
            }
        };

        const onUp = () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
            b.style.transition = 'transform 0.1s';
            if (!isDragging) {
                openManager();
            } else {
                GM_setValue('pk_pos_left', b.style.left);
                GM_setValue('pk_pos_top', b.style.top);
            }
        };
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    };

    document.body.appendChild(b);
    console.log("🚀 Button Created!");
}

tryInject();
window.addEventListener('load', tryInject);
const obs = new MutationObserver(() => {
    if (!document.getElementById('pk-launch')) {
        tryInject();
    }
});
obs.observe(document.body, { childList: true, subtree: true });
/******/ })()
;