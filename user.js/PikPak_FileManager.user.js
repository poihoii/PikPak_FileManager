// ==UserScript==
// @name           PikPak 파일 관리자
// @name:en        PikPak File Manager
// @name:zh-CN     PikPak 文件管理器
// @name:ja        PikPak ファイルマネージャー
// @namespace      https://github.com/poihoii/
// @version        2.0.0
// @description    PikPak 웹 드라이브를 확장해 빠른 탐색·중복 검사·파일명 일괄 변경·다운로드 기능을 제공하는 고급 파일 관리자.
// @description:en Enhances PikPak with fast navigation, duplicate scan, bulk rename, and advanced file-management tools.
// @description:zh-CN 基于 PikPak 网页 API，提供快速浏览、重复文件扫描、批量重命名和高级下载功能的文件管理器。
// @description:ja PikPak を拡張し、高速ナビゲーション・重複検出・一括リネーム・ダウンロード機能を備えた高機能ファイルマネージャーです。
// @author         poihoii
// @match          https://mypikpak.com/drive/*
// @match          https://app.mypikpak.com/*
// @match          https://drive.mypikpak.com/*
// @icon           https://raw.githubusercontent.com/poihoii/PikPak_FileManager/refs/heads/main/img/logo%20(200).svg
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
    logoUrl: "https://raw.githubusercontent.com/poihoii/PikPak_FileManager/refs/heads/main/img/logo%20(200).svg",
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
        list_view: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>`,
        grid_view: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`,
        link_copy: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
        stop: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><rect x="9" y="9" width="6" height="6"/></svg>`,
        play: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>`,
        download: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>`,
        link: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
        send: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
        help: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
        filter: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>`,
        sidebar: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>`,
        chevron_right: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`,
        chevron_down: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`
    },
    typeIcons: {
        folder: `<svg width="20" height="20" viewBox="0 0 24 24" fill="#FFC107" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>`,
        video: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF5722" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>`,
        image: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
        audio: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9C27B0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
        archive: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#795548" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>`,
        text: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#607D8B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
        pdf: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F44336" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
        file: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>`
    }
};
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

// [추가] GM 함수 안전 래퍼
function gmGet(key, def) {
    if (typeof GM_getValue !== 'undefined') return GM_getValue(key, def);
    return def;
}

function gmSet(key, val) {
    if (typeof GM_setValue !== 'undefined') GM_setValue(key, val);
}
;// ./src/locales/ko.js
/* harmony default export */ const ko = ({
    title: "PikPak File Manager",
    col_name: "파일명", col_size: "크기", col_dur: "길이", col_date: "업로드 일자",

    btn_scan: "구조 평면화", tip_scan: "하위 폴더의 모든 파일을 현재 목록으로 가져옵니다.",
    btn_stop: "중지", tip_stop: "현재 진행 중인 작업(파일 수집, 중복 검색 등)을 즉시 중단합니다.",
    btn_dup: "중복 검색", tip_dup: "현재 목록에서 중복된 동영상 파일을 검색하여 정리 도구를 엽니다.",

    status_ready: "준비됨 ({n}개 항목)", status_scanning: "수집 중... {n}개 (현재: {f})",
    msg_no_files: "표시할 항목이 없습니다.",
    warn_del: "선택한 {n}개 항목을 휴지통으로 이동하시겠습니까?",

    btn_down: "웹 다운로드", tip_down: "브라우저의 기본 다운로드 기능을 사용하여 파일을 다운로드합니다.",
    btn_aria2: "Aria2 전송", tip_aria2: "설정된 로컬 Aria2 RPC 서버로 다운로드 요청을 전송합니다.",
    btn_idm: "IDM 직접 연결", tip_idm: "IDM(Internet Download Manager)용 내보내기 파일(.ef2)을 생성합니다.",
    btn_ext: "외부 플레이어", tip_ext: "PotPlayer, VLC 등 설치된 외부 플레이어로 영상을 재생합니다 (설정 필요).",

    loading: "잠시만 기다려주세요...",
    loading_detail: "PikPak 서버에서 파일 정보를 받아오고 있어요...",
    loading_fetch: "숨겨진 파일까지 꼼꼼히 찾는 중이에요... ({n}개 발견)",
    loading_dup: "중복된 파일이 있는지 확인하고 있어요... ({p}%)",
    sel_count: "{n}개 선택됨",

    tag_hash: "Hash 일치", tag_name: "파일명 일치", tag_sim: "유사 (시간+파일명)",
    lbl_dup_tool: "삭제 대상 선택:",

    btn_toggle_size: "파일 크기", tip_toggle_size: "중복 파일 자동 선택 기준을 파일 크기로 변경합니다 (클릭하여 전환).",
    cond_small: "작은 파일", cond_large: "큰 파일",

    btn_toggle_date: "업로드 일자", tip_toggle_date: "중복 파일 자동 선택 기준을 업로드 날짜로 변경합니다 (클릭하여 전환).",
    cond_old: "이전 파일", cond_new: "최신 파일",

    btn_back: "", tip_back: "이전 폴더로 돌아갑니다 (Backspace / Alt+←)",
    btn_fwd: "", tip_fwd: "다음 폴더로 이동합니다 (Alt+→)",
    tip_refresh: "파일 목록을 새로고침하여 최신 상태로 갱신합니다 (F5)",
    btn_newfolder: "새 폴더", tip_newfolder: "현재 위치에 새로운 폴더를 생성합니다 (F8)",
    btn_del: "삭제", tip_del: "선택한 항목을 휴지통으로 이동합니다 (Del)",
    btn_deselect: "선택 취소", tip_deselect: "모든 파일의 선택 상태를 해제합니다 (Esc)",
    btn_copy: "복사", tip_copy: "선택한 항목을 클립보드에 복사합니다 (Ctrl+C)",
    btn_cut: "이동", tip_cut: "선택한 항목을 이동하기 위해 잘라냅니다 (Ctrl+X)",
    btn_paste: "붙여넣기", tip_paste: "복사하거나 잘라낸 항목을 현재 위치에 붙여넣습니다 (Ctrl+V)",
    btn_rename: "파일명 변경", tip_rename: "선택한 항목의 이름을 변경합니다 (F2)",
    btn_bulkrename: "일괄 변경", tip_bulkrename: "선택한 여러 항목의 이름을 규칙에 따라 한 번에 변경합니다 (F2)",
    btn_settings: "설정", tip_settings: "언어, 외부 플레이어, Aria2 연결 정보 등을 설정합니다 (Alt+S)",

    ctx_open: "열기 / 재생", ctx_rename: "파일명 변경", ctx_copy: "복사", ctx_cut: "잘라내기", ctx_del: "삭제", ctx_down: "다운로드",

    msg_newfolder_prompt: "새로운 폴더의 이름을 입력하세요:",
    msg_rename_prompt: "새로운 이름을 입력하세요:",
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
    msg_flatten_warn: "파일 구조 평면화는 하위 폴더의 모든 파일을 검색합니다.\n파일이 많을 경우 시간이 걸릴 수 있습니다. 계속하시겠습니까?",
    msg_dup_warn: "중복 파일 검색을 시작하시겠습니까?",
    msg_batch_m3u: "재생 목록(.m3u)이 생성되었습니다.",
    msg_batch_ef2: "IDM 내보내기(.ef2) 파일이 생성되었습니다.",
    msg_video_fail: "비디오 링크를 가져올 수 없습니다.",
    msg_aria2_check_fail: "Aria2 연결 실패!\nURL과 토큰을 확인해주세요.",
    msg_aria2_check_ok: "Aria2 연결 성공!",
    msg_aria2_sent: "{n}개 파일을 Aria2로 전송했습니다.",

    title_alert: "알림", title_confirm: "확인", title_prompt: "입력",
    btn_ok: "확인", btn_yes: "예", btn_no: "아니오",

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

    modal_settings_title: "<b>설정</b>",
    label_lang: "언어 (Language)", label_player: "외부 플레이어", label_aria2_url: "Aria2 주소", label_aria2_token: "Aria2 토큰",
    btn_save: "저장",

    placeholder_search: "파일명 검색...",
    tip_search: "현재 보고 있는 목록 내에서 파일명을 검색하여 필터링합니다.",
    btn_help: "도움말", tip_help: "단축키 및 기능 사용법을 확인합니다.",

    modal_help_title: "<b>무엇을 도와드릴까요?</b>",
    help_desc: `
<div style="font-size:13px; line-height:1.7; color:var(--pk-fg);">
    <div style="margin-bottom:15px;">
        <b style="font-size:14px; color:var(--pk-pri);">🔍 원하는 파일 찾기 (Search)</b><br>
        상단 검색창에 단어를 입력해보세요.<br>
        지금 화면에 보이는 목록에서 해당 파일을 <b>즉시 찾아 보여드립니다.</b><br>
        <span style="color:#888; font-size:12px;">※ '구조 평면화' 후 검색하면 전체 파일에서 찾을 수 있어요!</span>
    </div>
    
    <div style="margin-bottom:15px;">
        <b style="font-size:14px; color:var(--pk-pri);">📂 모든 파일 한눈에 보기 (Flatten)</b><br>
        폴더 속에 깊숙이 숨어있는 파일들을 찾기 힘드셨나요?<br>
        <b>'구조 평면화'</b> 버튼을 누르면 모든 파일을 밖으로 꺼내 보여드려요.<br>
        <span style="color:#888; font-size:12px;">※ 관리가 끝나면 '새로고침(F5)'을 눌러 원래대로 돌아가세요.</span>
    </div>

    <div style="margin-bottom:20px;">
        <b style="font-size:14px; color:var(--pk-pri);">🧹 중복 파일 정리 (Deduplication)</b><br>
        똑같은 파일이 여러 개라 용량을 차지하고 있나요?<br>
        <b>크기</b>나 <b>날짜</b>를 기준으로 중복된 파일을 쏙쏙 골라드릴게요.<br>
        자동 선택된 파일을 확인하고 <b>'삭제'</b> 버튼만 누르면 정리가 끝납니다.
    </div>
    
    <div>
        <b style="font-size:14px; color:var(--pk-pri);">⌨️ 편리한 단축키</b>
        <table class="pk-help-table">
            <tr><td width="100"><b>F2</b></td><td>이름 변경 / 일괄 변경</td></tr>
            <tr><td><b>F5</b></td><td>목록 새로고침 (초기화)</td></tr>
            <tr><td><b>F8</b></td><td>새 폴더 만들기</td></tr>
            <tr><td><b>Del</b></td><td>선택 항목 휴지통으로 이동</td></tr>
            <tr><td><b>Ctrl+A</b></td><td>전체 선택</td></tr>
            <tr><td><b>Ctrl+C/V</b></td><td>파일 복사 / 붙여넣기</td></tr>
            <tr><td><b>Alt+S</b></td><td>환경 설정</td></tr>
            <tr><td><b>Esc</b></td><td>선택 해제 / 창 닫기</td></tr>
        </table>
    </div>
</div>`,

    btn_view_list: "리스트 보기",
    btn_view_grid: "갤러리 보기",
    btn_link_copy: "주소 복사",
    tip_link_copy: "선택한 파일의 다운로드 주소를 클립보드에 복사합니다.",
    msg_link_copied: "{n}개 파일의 주소가 복사되었습니다.",

    label_folders_first: "폴더를 항상 위에 표시",

    col_created: "생성 일자",
    btn_filter: "필터",
    tip_filter: "파일 타입, 크기, 날짜 등 조건으로 필터링합니다.",
    filter_type: "파일 유형",
    filter_type_video: "영상",
    filter_type_image: "이미지",
    filter_type_subtitle: "자막",
    filter_type_archive: "압축",
    filter_type_audio: "오디오",
    filter_type_document: "문서",
    filter_size: "파일 크기",
    filter_size_min: "최소",
    filter_size_max: "최대",
    filter_date: "업로드 날짜",
    filter_date_from: "시작일",
    filter_date_to: "종료일",
    filter_name: "파일명 필터",
    filter_name_include: "포함",
    filter_name_exclude: "제외",
    filter_regex: "정규식",
    btn_filter_apply: "적용",
    btn_filter_reset: "초기화",
    filter_active: "필터 {n}개 활성",
    sort_name: "이름",
    sort_size: "크기",
    sort_duration: "길이",
    sort_modified: "수정일",
    sort_created: "생성일",
    sort_ext: "확장자",

    // TASK 4: 사이드바 + 드래그앤드롭
    btn_sidebar: "사이드바", tip_sidebar: "폴더 트리 사이드바를 열거나 닫습니다.",
    sidebar_title: "폴더",
    sidebar_home: "My Drive",
    sidebar_loading: "로드 중...",
    sidebar_empty: "하위 폴더 없음",
    drag_move_count: "{n}개 이동",
    drag_move_progress: "{n}개 파일 이동 중...",
    drag_move_done: "{n}개 파일 이동 완료",
    drag_move_fail: "이동 실패: {e}",
    drag_move_same: "같은 폴더로 이동할 수 없습니다.",
});
;// ./src/locales/en.js
/* harmony default export */ const en = ({
    title: "PikPak File Manager",
    col_name: "Name", col_size: "Size", col_dur: "Duration", col_date: "Date Modified",

    btn_scan: "Flatten", tip_scan: "Retrieves all files from subfolders into a single list.",
    btn_stop: "Stop", tip_stop: "Stops the current operation immediately.",
    btn_dup: "Find Dups", tip_dup: "Searches for duplicate video files in the current list.",

    status_ready: "Ready ({n} items)", status_scanning: "Scanning... {n} items (Cur: {f})",
    msg_no_files: "No items.",
    warn_del: "Trash {n} items?",

    btn_down: "Download", tip_down: "Downloads files using the browser's default download manager.",
    btn_aria2: "Aria2", tip_aria2: "Sends download requests to the configured Aria2 RPC server.",
    btn_idm: "IDM", tip_idm: "Generates an export file (.ef2) for Internet Download Manager.",
    btn_ext: "Play Ext", tip_ext: "Plays video using an external player like PotPlayer/VLC (Setup required).",

    loading: "Loading...", loading_detail: "Fetching...", loading_fetch: "Fetching... ({n})", loading_dup: "Analyzing... ({p}%)",
    sel_count: "{n} selected",
    tag_hash: "Hash Match", tag_name: "Name Match", tag_sim: "Similar",
    lbl_dup_tool: "Auto Select:",

    btn_toggle_size: "Size", tip_toggle_size: "Selects duplicate files to delete based on size.", cond_small: "Smallest", cond_large: "Largest",
    btn_toggle_date: "Date", tip_toggle_date: "Selects duplicate files to delete based on upload date.", cond_old: "Oldest", cond_new: "Newest",

    btn_back: "", tip_back: "Go back to the previous folder (Backspace)",
    btn_fwd: "", tip_fwd: "Go forward to the next folder",
    tip_refresh: "Refreshes the file list (F5)",
    btn_newfolder: "New Folder", tip_newfolder: "Creates a new folder in the current location (F8)",
    btn_del: "Delete", tip_del: "Moves selected items to the trash (Del)",
    btn_deselect: "Deselect", tip_deselect: "Deselects all items (Esc)",
    btn_copy: "Copy", tip_copy: "Copies selected items to the clipboard (Ctrl+C)",
    btn_cut: "Cut", tip_cut: "Cuts selected items to move them (Ctrl+X)",
    btn_paste: "Paste", tip_paste: "Pastes copied or cut items into the current location (Ctrl+V)",
    btn_rename: "Rename", tip_rename: "Renames the selected item (F2)",
    btn_bulkrename: "Bulk Rename", tip_bulkrename: "Renames multiple selected items at once (F2)",
    btn_settings: "Settings", tip_settings: "Configures settings for language, players, and Aria2 (Alt+S)",

    ctx_open: "Open", ctx_rename: "Rename", ctx_copy: "Copy", ctx_cut: "Cut", ctx_del: "Delete", ctx_down: "Download",
    msg_newfolder_prompt: "Enter name for new folder:",
    msg_rename_prompt: "Enter new name:",
    msg_no_selection: "Select items first.",
    msg_copy_done: "Copied. Paste enabled.",
    msg_cut_done: "Cut ready. Paste enabled.",
    msg_paste_empty: "Nothing to paste.",
    msg_paste_same_folder: "Same folder.",
    msg_bulkrename_done: "Renamed {n} items.",
    msg_settings_saved: "Saved.",
    msg_name_exists: "Exists: {n}",
    msg_dup_result: "Found {n} groups.",
    msg_exit_confirm: "Close File Manager?",
    msg_download_fail: "Failed to get links.",
    msg_flatten_warn: "Flatten subfolders?\nThis may take time.",
    msg_dup_warn: "Start duplicate scan?",
    msg_batch_m3u: "M3U generated.",
    msg_batch_ef2: "EF2 generated.",
    msg_video_fail: "No video link.",
    msg_aria2_check_fail: "Aria2 Connection Failed!\nCheck URL and Token.",
    msg_aria2_check_ok: "Aria2 Connected!",
    msg_aria2_sent: "Sent {n} items to Aria2.",

    title_alert: "Alert", title_confirm: "Confirm", title_prompt: "Input",
    btn_ok: "OK", btn_yes: "Yes", btn_no: "No",

    modal_rename_title: "Rename", modal_rename_multi_title: "Bulk Rename", label_pattern: "Pattern", label_replace: "Replace", label_replace_note: "(Case sensitive)",
    placeholder_find: "Find", placeholder_replace: "Replace", btn_preview: "Preview", modal_preview_title: "Confirm",
    col_old: "Old", col_new: "New", btn_confirm: "Confirm", btn_cancel: "Cancel",
    modal_settings_title: "Settings", label_lang: "Language", label_player: "Player", label_aria2_url: "Aria2 URL", label_aria2_token: "Token", btn_save: "Save",

    placeholder_search: "Search files...",
    tip_search: "Filters files in the current list.",
    btn_help: "Help", tip_help: "Shows shortcuts and usage instructions.",
    modal_help_title: "Help & Usage",
    help_desc: `
<div style="font-size:13px; line-height:1.6; color:var(--pk-fg);">
    <div style="margin-bottom:15px;">
        <b style="font-size:14px; color:var(--pk-pri);">🔍 Search</b><br>
        - Filters files in the current list instantly.<br>
        - Use with 'Flatten' to search the entire drive.<br>
    </div>
    
    <div style="margin-bottom:15px;">
        <b style="font-size:14px; color:var(--pk-pri);">📂 Flatten</b><br>
        - Retrieves all files from subfolders into a single list.<br>
        - Press 'Refresh (F5)' to return to normal view.<br>
    </div>

    <div style="margin-bottom:20px;">
        <b style="font-size:14px; color:var(--pk-pri);">🧹 Deduplication</b><br>
        - <b>Size</b>: Selects duplicate files based on largest/smallest size.<br>
        - <b>Date</b>: Selects based on oldest/newest upload date.<br>
    </div>
    
    <div>
        <b style="font-size:14px; color:var(--pk-pri);">⌨️ Shortcuts</b>
        <table class="pk-help-table">
            <tr><td width="100"><b>F2</b></td><td>Rename / Bulk Rename</td></tr>
            <tr><td><b>F5</b></td><td>Refresh</td></tr>
            <tr><td><b>F8</b></td><td>New Folder</td></tr>
            <tr><td><b>Del</b></td><td>Delete items</td></tr>
            <tr><td><b>Ctrl+A</b></td><td>Select All</td></tr>
            <tr><td><b>Ctrl+C/V</b></td><td>Copy / Paste</td></tr>
            <tr><td><b>Alt+S</b></td><td>Settings</td></tr>
            <tr><td><b>Esc</b></td><td>Deselect / Close</td></tr>
        </table>
    </div>
</div>`,

    btn_view_list: "List View",
    btn_view_grid: "Gallery View",
    btn_link_copy: "Copy Link",
    tip_link_copy: "Copy direct download links of selected files.",
    msg_link_copied: "Copied {n} links.",

    label_folders_first: "Always show folders on top",

    col_created: "Created",
    btn_filter: "Filter",
    tip_filter: "Filter by file type, size, date, etc.",
    filter_type: "File Type",
    filter_type_video: "Video",
    filter_type_image: "Image",
    filter_type_subtitle: "Subtitle",
    filter_type_archive: "Archive",
    filter_type_audio: "Audio",
    filter_type_document: "Document",
    filter_size: "File Size",
    filter_size_min: "Min",
    filter_size_max: "Max",
    filter_date: "Upload Date",
    filter_date_from: "From",
    filter_date_to: "To",
    filter_name: "Name Filter",
    filter_name_include: "Include",
    filter_name_exclude: "Exclude",
    filter_regex: "Regex",
    btn_filter_apply: "Apply",
    btn_filter_reset: "Reset",
    filter_active: "{n} filter(s) active",
    sort_name: "Name",
    sort_size: "Size",
    sort_duration: "Duration",
    sort_modified: "Modified",
    sort_created: "Created",
    sort_ext: "Extension",

    btn_sidebar: "Sidebar", tip_sidebar: "Toggle the folder tree sidebar.",
    sidebar_title: "Folders",
    sidebar_home: "My Drive",
    sidebar_loading: "Loading...",
    sidebar_empty: "No subfolders",
    drag_move_count: "Move {n}",
    drag_move_progress: "Moving {n} files...",
    drag_move_done: "{n} files moved",
    drag_move_fail: "Move failed: {e}",
    drag_move_same: "Cannot move to the same folder.",
});
;// ./src/locales/ja.js
/* harmony default export */ const ja = ({
    title: "PikPak ファイルマネージャー",
    col_name: "名前", col_size: "サイズ", col_dur: "時間", col_date: "更新日",

    btn_scan: "構造平坦化", tip_scan: "サブフォルダー内の全ファイルを現在のリストに移動します。",
    btn_stop: "停止", tip_stop: "現在の作業（検索、収集など）を即座に停止します。",
    btn_dup: "重複検索", tip_dup: "現在のリストから重複した動画ファイルを検索して整理します。",

    status_ready: "準備完了 ({n} 項目)", status_scanning: "収集中... {n} (現在: {f})",
    msg_no_files: "項目がありません。",
    warn_del: "選択した {n} 項目をゴミ箱に移動しますか？",

    btn_down: "ダウンロード", tip_down: "ブラウザの標準機能を使用してファイルをダウンロードします。",
    btn_aria2: "Aria2", tip_aria2: "設定されたAria2 RPCサーバーへダウンロード要求を送信します。",
    btn_idm: "IDM", tip_idm: "IDM (Internet Download Manager) 用のエクスポートファイル (.ef2) を作成します。",
    btn_ext: "外部再生", tip_ext: "PotPlayerやVLCなどの外部プレーヤーで再生します（設定が必要）。",

    loading: "読み込み中...", loading_detail: "ファイルリストを取得中...",
    loading_fetch: "ファイル取得中... ({n})", loading_dup: "重複分析中... ({p}%)",
    sel_count: "{n} 選択済み",
    tag_hash: "Hash一致", tag_name: "名前一致", tag_sim: "類似 (時間+名前)",
    lbl_dup_tool: "削除対象選択:",

    btn_toggle_size: "ファイルサイズ", tip_toggle_size: "重複ファイルの自動選択基準をサイズに変更します。", cond_small: "小さい順", cond_large: "大きい順",
    btn_toggle_date: "アップロード日", tip_toggle_date: "重複ファイルの自動選択基準を日付に変更します。", cond_old: "古い順", cond_new: "新しい順",

    btn_back: "", tip_back: "前のフォルダに戻ります (Backspace)",
    btn_fwd: "", tip_fwd: "次のフォルダに進みます",
    tip_refresh: "ファイルリストを更新します (F5)",
    btn_newfolder: "新規フォルダ", tip_newfolder: "現在の場所に新しいフォルダを作成します (F8)",
    btn_del: "削除", tip_del: "選択項目を削除します (Del)",
    btn_deselect: "選択解除", tip_deselect: "すべての選択を解除します (Esc)",
    btn_copy: "コピー", tip_copy: "選択項目をクリップボードにコピーします (Ctrl+C)",
    btn_cut: "切り取り", tip_cut: "選択項目を移動するために切り取ります (Ctrl+X)",
    btn_paste: "貼り付け", tip_paste: "ここに貼り付けます (Ctrl+V)",
    btn_rename: "名前変更", tip_rename: "選択項目の名前を変更します (F2)",
    btn_bulkrename: "一括変更", tip_bulkrename: "複数のファイル名を規則に従って一括変更します (F2)",
    btn_settings: "設定", tip_settings: "言語、外部プレーヤー、Aria2連携などを設定します (Alt+S)",

    ctx_open: "開く / 再生", ctx_rename: "名前変更", ctx_copy: "コピー", ctx_cut: "切り取り", ctx_del: "削除", ctx_down: "ダウンロード",
    msg_newfolder_prompt: "フォルダ名を入力:",
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
    msg_aria2_check_fail: "Aria2 接続失敗！\nURLとトークンを確認してください。",
    msg_aria2_check_ok: "Aria2 接続成功！",
    msg_aria2_sent: "{n} 個のファイルをAria2に送信しました。",

    title_alert: "通知", title_confirm: "確認", title_prompt: "入力",
    btn_ok: "確認", btn_yes: "はい", btn_no: "いいえ", btn_cancel: "キャンセル", btn_save: "保存", btn_preview: "プレビュー", btn_confirm: "確定",

    modal_rename_title: "名前変更", modal_rename_multi_title: "一括名前変更", label_pattern: "パターン (例: Video {n})", label_replace: "文字列置換/削除", label_replace_note: "(大文字小文字を区別)",
    placeholder_find: "検索文字列", placeholder_replace: "置換文字列 (空欄=削除)",
    modal_preview_title: "変更確認", col_old: "現在の名前", col_new: "変更後の名前",
    modal_settings_title: "設定", label_lang: "言語 (Language)", label_player: "外部プレーヤー", label_aria2_url: "Aria2 URL", label_aria2_token: "トークン",

    placeholder_search: "検索...",
    tip_search: "現在のリストからファイルを検索します。",
    btn_help: "ヘルプ", tip_help: "ショートカットと使い方を表示します。",
    modal_help_title: "ヘルプと使い方",
    help_desc: `
<div style="font-size:13px; line-height:1.6; color:var(--pk-fg);">
    <div style="margin-bottom:15px;">
        <b style="font-size:14px; color:var(--pk-pri);">🔍 検索 (Search)</b><br>
        - 現在のリストに表示されているファイルを即座にフィルタリングします。<br>
        - 「構造平坦化」機能と併用することで、ドライブ全体からファイルを検索できます。<br>
    </div>
    
    <div style="margin-bottom:15px;">
        <b style="font-size:14px; color:var(--pk-pri);">📂 構造平坦化 (Flatten)</b><br>
        - サブフォルダに含まれるすべてのファイルを検索し、一つのリストにまとめます。<br>
        - 作業が終わったら「更新 (F5)」を押して元のフォルダ構造に戻ってください。<br>
    </div>

    <div style="margin-bottom:20px;">
        <b style="font-size:14px; color:var(--pk-pri);">🧹 重複整理 (Deduplication)</b><br>
        - <b>サイズ</b>: 重複ファイルの中で、容量が最も大きい（または小さい）ファイルを残して選択します。<br>
        - <b>日付</b>: アップロード日時が最も古い（または新しい）ファイルを残して選択します。<br>
    </div>
    
    <div>
        <b style="font-size:14px; color:var(--pk-pri);">⌨️ ショートカットキー</b>
        <table class="pk-help-table">
            <tr><td width="100"><b>F2</b></td><td>名前変更 / 一括変更</td></tr>
            <tr><td><b>F5</b></td><td>リスト更新</td></tr>
            <tr><td><b>F8</b></td><td>新規フォルダ作成</td></tr>
            <tr><td><b>Del</b></td><td>選択項目を削除 (ゴミ箱)</td></tr>
            <tr><td><b>Ctrl+A</b></td><td>全選択</td></tr>
            <tr><td><b>Ctrl+C/V</b></td><td>コピー / 貼り付け</td></tr>
            <tr><td><b>Alt+S</b></td><td>設定 (Settings)</td></tr>
            <tr><td><b>Esc</b></td><td>選択解除 / 閉じる</td></tr>
        </table>
    </div>
</div>`,

    btn_view_list: "リスト表示",
    btn_view_grid: "ギャラリー表示",
    btn_link_copy: "リンクコピー",
    tip_link_copy: "選択したファイルのダウンロードリンクをコピーします。",
    msg_link_copied: "{n} 個のリンクをコピーしました。",

    label_folders_first: "フォルダを常に上に表示",

    col_created: "作成日",
    btn_filter: "フィルター",
    tip_filter: "ファイルタイプ、サイズ、日付などで絞り込みます。",
    filter_type: "ファイル種別",
    filter_type_video: "動画",
    filter_type_image: "画像",
    filter_type_subtitle: "字幕",
    filter_type_archive: "圧縮",
    filter_type_audio: "音声",
    filter_type_document: "文書",
    filter_size: "ファイルサイズ",
    filter_size_min: "最小",
    filter_size_max: "最大",
    filter_date: "アップロード日",
    filter_date_from: "開始日",
    filter_date_to: "終了日",
    filter_name: "名前フィルター",
    filter_name_include: "含む",
    filter_name_exclude: "除外",
    filter_regex: "正規表現",
    btn_filter_apply: "適用",
    btn_filter_reset: "リセット",
    filter_active: "フィルター{n}件有効",
    sort_name: "名前",
    sort_size: "サイズ",
    sort_duration: "時間",
    sort_modified: "更新日",
    sort_created: "作成日",
    sort_ext: "拡張子",

    btn_sidebar: "サイドバー", tip_sidebar: "フォルダツリーサイドバーを切り替えます。",
    sidebar_title: "フォルダ",
    sidebar_home: "マイドライブ",
    sidebar_loading: "読み込み中...",
    sidebar_empty: "サブフォルダなし",
    drag_move_count: "{n}件移動",
    drag_move_progress: "{n}件のファイルを移動中...",
    drag_move_done: "{n}件のファイルを移動しました",
    drag_move_fail: "移動失敗: {e}",
    drag_move_same: "同じフォルダには移動できません。",
});
;// ./src/locales/zh.js
/* harmony default export */ const zh = ({
    title: "PikPak 文件管理器",
    col_name: "名称", col_size: "大小", col_dur: "时长", col_date: "修改日期",

    btn_scan: "结构扁平化", tip_scan: "获取并显示子文件夹中的所有文件。",
    btn_stop: "停止", tip_stop: "立即停止当前操作。",
    btn_dup: "查找重复", tip_dup: "在当前列表中查找重复的视频文件。",

    status_ready: "就绪 ({n} 项)", status_scanning: "扫描中... {n} (当前: {f})",
    msg_no_files: "没有项目。",
    warn_del: "确定要删除选中的 {n} 项吗？",

    btn_down: "下载", tip_down: "使用浏览器的默认功能下载文件。",
    btn_aria2: "发送 Aria2", tip_aria2: "将下载请求发送到配置的 Aria2 RPC 服务器。",
    btn_idm: "IDM", tip_idm: "生成 IDM (Internet Download Manager) 导出文件 (.ef2)。",
    btn_ext: "外部播放", tip_ext: "使用 PotPlayer 或 VLC 等外部播放器播放视频（需要设置）。",

    loading: "加载中...", loading_detail: "正在获取文件列表...",
    loading_fetch: "获取中... ({n})", loading_dup: "分析重复项... ({p}%)",
    sel_count: "选中 {n} 项",
    tag_hash: "哈希匹配", tag_name: "名称匹配", tag_sim: "相似 (时长+名称)",
    lbl_dup_tool: "选择删除对象:",

    btn_toggle_size: "文件大小", tip_toggle_size: "根据文件大小自动选择重复文件。", cond_small: "保留最大", cond_large: "保留最小",
    btn_toggle_date: "上传日期", tip_toggle_date: "根据上传日期自动选择重复文件。", cond_old: "保留最新", cond_new: "保留最旧",

    btn_back: "", tip_back: "返回上一级文件夹 (Backspace)",
    btn_fwd: "", tip_fwd: "进入下一级文件夹",
    tip_refresh: "刷新文件列表 (F5)",
    btn_newfolder: "新建文件夹", tip_newfolder: "在当前位置创建一个新文件夹 (F8)",
    btn_del: "删除", tip_del: "将选中项移至回收站 (Del)",
    btn_deselect: "取消选择", tip_deselect: "取消所有选择 (Esc)",
    btn_copy: "复制", tip_copy: "将选中项复制到剪贴板 (Ctrl+C)",
    btn_cut: "剪切", tip_cut: "剪切选中项以便移动 (Ctrl+X)",
    btn_paste: "粘贴", tip_paste: "将复制或剪切的项目粘贴到此处 (Ctrl+V)",
    btn_rename: "重命名", tip_rename: "重命名选中项 (F2)",
    btn_bulkrename: "批量重命名", tip_bulkrename: "根据规则批量修改多个文件名 (F2)",
    btn_settings: "设置", tip_settings: "配置语言、外部播放器和 Aria2 连接 (Alt+S)",

    ctx_open: "打开 / 播放", ctx_rename: "重命名", ctx_copy: "复制", ctx_cut: "剪切", ctx_del: "删除", ctx_down: "下载",
    msg_newfolder_prompt: "输入新文件夹名称:",
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
    msg_aria2_check_fail: "Aria2 连接失败！\n请检查 URL 和 Token。",
    msg_aria2_check_ok: "Aria2 连接成功！",
    msg_aria2_sent: "已将 {n} 个文件发送到 Aria2。",

    title_alert: "提示", title_confirm: "确认", title_prompt: "输入",
    btn_ok: "确定", btn_yes: "是", btn_no: "否", btn_cancel: "取消", btn_save: "保存", btn_preview: "预览", btn_confirm: "确定",

    modal_rename_title: "重命名", modal_rename_multi_title: "批量重命名", label_pattern: "模式 (例: Video {n})", label_replace: "替换/删除", label_replace_note: "(区分大小写)",
    placeholder_find: "查找内容", placeholder_replace: "替换为 (留空删除)",
    modal_preview_title: "确认更改", col_old: "原名称", col_new: "新名称",
    modal_settings_title: "设置", label_lang: "语言 (Language)", label_player: "外部播放器", label_aria2_url: "Aria2 地址", label_aria2_token: "Token",

    placeholder_search: "搜索文件...",
    tip_search: "在当前列表中筛选文件。",
    btn_help: "帮助", tip_help: "显示快捷键和使用说明。",
    modal_help_title: "使用说明",
    help_desc: `
<div style="font-size:13px; line-height:1.6; color:var(--pk-fg);">
    <div style="margin-bottom:15px;">
        <b style="font-size:14px; color:var(--pk-pri);">🔍 搜索 (Search)</b><br>
        - 即时筛选当前加载的文件列表。<br>
        - 配合“结构扁平化”功能使用，可实现全盘文件搜索。<br>
    </div>
    
    <div style="margin-bottom:15px;">
        <b style="font-size:14px; color:var(--pk-pri);">📂 结构扁平化 (Flatten)</b><br>
        - 递归提取所有子文件夹中的文件，并显示在一个列表中。<br>
        - 管理完成后，请按“刷新 (F5)”返回原始文件夹结构。<br>
    </div>

    <div style="margin-bottom:20px;">
        <b style="font-size:14px; color:var(--pk-pri);">🧹 重复整理 (Deduplication)</b><br>
        - <b>文件大小</b>: 在重复组中保留最大（或最小）的文件，选中其余文件。<br>
        - <b>上传日期</b>: 保留最早（或最新）上传的文件，选中其余文件。<br>
    </div>
    
    <div>
        <b style="font-size:14px; color:var(--pk-pri);">⌨️ 快捷键</b>
        <table class="pk-help-table">
            <tr><td width="100"><b>F2</b></td><td>重命名 / 批量重命名</td></tr>
            <tr><td><b>F5</b></td><td>刷新列表</td></tr>
            <tr><td><b>F8</b></td><td>新建文件夹</td></tr>
            <tr><td><b>Del</b></td><td>删除选中项 (回收站)</td></tr>
            <tr><td><b>Ctrl+A</b></td><td>全选</td></tr>
            <tr><td><b>Ctrl+C/V</b></td><td>复制 / 粘贴</td></tr>
            <tr><td><b>Alt+S</b></td><td>设置 (Settings)</td></tr>
            <tr><td><b>Esc</b></td><td>取消选择 / 关闭</td></tr>
        </table>
    </div>
</div>`,

    btn_view_list: "列表视图",
    btn_view_grid: "图库视图",
    btn_link_copy: "复制链接",
    tip_link_copy: "复制选中文件的下载链接。",
    msg_link_copied: "已复制 {n} 个链接。",

    label_folders_first: "文件夹始终置顶显示",

    col_created: "创建日期",
    btn_filter: "筛选",
    tip_filter: "按文件类型、大小、日期等条件筛选。",
    filter_type: "文件类型",
    filter_type_video: "视频",
    filter_type_image: "图片",
    filter_type_subtitle: "字幕",
    filter_type_archive: "压缩",
    filter_type_audio: "音频",
    filter_type_document: "文档",
    filter_size: "文件大小",
    filter_size_min: "最小",
    filter_size_max: "最大",
    filter_date: "上传日期",
    filter_date_from: "开始日期",
    filter_date_to: "结束日期",
    filter_name: "名称筛选",
    filter_name_include: "包含",
    filter_name_exclude: "排除",
    filter_regex: "正则表达式",
    btn_filter_apply: "应用",
    btn_filter_reset: "重置",
    filter_active: "已激活 {n} 个筛选",
    sort_name: "名称",
    sort_size: "大小",
    sort_duration: "时长",
    sort_modified: "修改日期",
    sort_created: "创建日期",
    sort_ext: "扩展名",

    btn_sidebar: "侧边栏", tip_sidebar: "切换文件夹树侧边栏。",
    sidebar_title: "文件夹",
    sidebar_home: "我的云盘",
    sidebar_loading: "加载中...",
    sidebar_empty: "无子文件夹",
    drag_move_count: "移动 {n} 项",
    drag_move_progress: "正在移动 {n} 个文件...",
    drag_move_done: "已移动 {n} 个文件",
    drag_move_fail: "移动失败: {e}",
    drag_move_same: "不能移动到同一个文件夹。",
});
;// ./src/languages.js






const T = { ko: ko, en: en, ja: ja, zh: zh };

function getLang() {
    const userLang = gmGet('pk_lang', '');
    if (userLang) return userLang;
    const navLang = navigator.language.slice(0, 2);
    return T[navLang] ? navLang : 'en';
}

function getStrings() {
    return T[getLang()] || T.en;
}
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
;// ./src/core/state.js
// src/core/state.js
// S 객체 호환 속성명을 사용하는 AppState 싱글톤
const _state = {
    path: [{ id: '', name: '🏠 Home' }],
    history: [], forward: [],
    items: [], display: [], sel: new Set(),
    sort: 'name', dir: 1,
    scanning: false, dupMode: false, dupRunning: false,
    dupReasons: new Map(), dupGroups: new Map(),
    dupSizeStrategy: 'small', dupDateStrategy: 'old',
    clipItems: [], clipType: '', clipSourceParentId: null,
    loading: false, lastSelIdx: -1, search: '',
    view: 'list', gridZoom: 140,
};
const _listeners = new Map();
const AppState = {
    get(key) { return _state[key]; },
    getAll() { return { ..._state }; },
    getRef() { return _state; },
    setState(patch) {
        Object.assign(_state, patch);
        Object.keys(patch).forEach(key => {
            _listeners.get(key)?.forEach(fn => fn(_state[key], _state));
        });
    },
    subscribe(key, fn) {
        if (!_listeners.has(key)) _listeners.set(key, new Set());
        _listeners.get(key).add(fn);
        return () => _listeners.get(key).delete(fn);
    },
};

;// ./src/ui/modal.js
// src/ui/modal.js
// 모달 다이얼로그 공통 컴포넌트입니다.
// showModal, showAlert, showConfirm, showPrompt를 제공합니다.




// 모달이 부착될 부모 요소 (.pk-win)
let _parentEl = null;
let _L = null;

function initModal(parentEl, L) {
    _parentEl = parentEl;
    _L = L;
}

function updateModalLang(L) {
    _L = L;
}

function showModal(html) {
    const m = document.createElement('div');
    m.className = 'pk-modal-ov';
    m.innerHTML = `<div class="pk-modal"><div class="pk-modal-close">${CONF.icons.close}</div>${html}</div>`;
    _parentEl.appendChild(m);
    m.querySelector('.pk-modal-close').addEventListener('click', () => m.remove());
    return m;
}

function showToast(msg, overlayEl) {
    const box = (overlayEl || _parentEl?.closest('.pk-ov'))?.querySelector('#pk-toast-box');
    if (!box) return;
    const t = document.createElement('div');
    t.className = 'pk-toast';
    t.innerHTML = `<span>✅</span><span>${esc(msg)}</span>`;
    box.appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

function showAlert(msg, title) {
    const L = _L || {};
    title = title || L.title_alert || 'Alert';
    return new Promise((resolve) => {
        const m = showModal(`
            <h3>${title}</h3>
            <div style="margin:20px 0;line-height:1.5;">${esc(msg).replace(/\n/g, '<br>')}</div>
            <div class="pk-modal-act">
                <button class="pk-btn pri" id="alert_ok">${L.btn_ok || 'OK'}</button>
            </div>
        `);
        m.querySelector('#alert_ok').onclick = () => { m.remove(); resolve(); };
        m.querySelector('.pk-modal-close').onclick = () => { m.remove(); resolve(); };
    });
}

function showConfirm(msg, title) {
    const L = _L || {};
    title = title || L.title_confirm || 'Confirm';
    return new Promise((resolve) => {
        const m = showModal(`
            <h3>${title}</h3>
            <div style="margin:20px 0;line-height:1.5;">${esc(msg).replace(/\n/g, '<br>')}</div>
            <div class="pk-modal-act">
                <button class="pk-btn" id="cfm_no">${L.btn_no || 'No'}</button>
                <button class="pk-btn pri" id="cfm_yes">${L.btn_yes || 'Yes'}</button>
            </div>
        `);
        m.querySelector('#cfm_no').onclick = () => { m.remove(); resolve(false); };
        m.querySelector('#cfm_yes').onclick = () => { m.remove(); resolve(true); };
        m.querySelector('.pk-modal-close').onclick = () => { m.remove(); resolve(false); };
    });
}

function showPrompt(msg, val, title) {
    const L = _L || {};
    val = val || '';
    title = title || L.title_prompt || 'Prompt';
    return new Promise((resolve) => {
        const m = showModal(`
            <h3>${title}</h3>
            <div style="margin-bottom:10px;">${esc(msg)}</div>
            <div class="pk-field"><input type="text" id="prm_input" value="${esc(val)}"></div>
            <div class="pk-modal-act">
                <button class="pk-btn" id="prm_cancel">${L.btn_cancel || 'Cancel'}</button>
                <button class="pk-btn pri" id="prm_ok">${L.btn_ok || 'OK'}</button>
            </div>
        `);
        const inp = m.querySelector('#prm_input');
        inp.focus();

        inp.onkeydown = (e) => {
            if (e.key === 'Enter') m.querySelector('#prm_ok').click();
            if (e.key === 'Escape') {
                e.stopPropagation();
                m.remove();
                resolve(null);
            }
        };

        m.querySelector('#prm_cancel').onclick = () => { m.remove(); resolve(null); };
        m.querySelector('#prm_ok').onclick = () => { const v = inp.value.trim(); m.remove(); resolve(v); };
        m.querySelector('.pk-modal-close').onclick = () => { m.remove(); resolve(null); };
    });
}

;// ./src/style.js
const CSS = `
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
;// ./src/ui/layout.js
// src/ui/layout.js
// 레이아웃 생성, 로딩, 상태바, 네비게이션 상태




const UI = {};
let _overlayEl = null;
function getOverlayEl() { return _overlayEl; }

function createLayout(L, lang, version) {
    const view = AppState.get('view') || 'list';
    const el = document.createElement('div'); el.className = 'pk-ov';
    let siteFont = window.getComputedStyle(document.body).fontFamily || '';
    siteFont = siteFont.replace(/,?\s*sans-serif\s*$/i, '');
    el.style.fontFamily = siteFont ? `${siteFont}, "Noto Sans", sans-serif` : '"Noto Sans", sans-serif';
    el.innerHTML = `
        <style>${CSS}</style>
        <div class="pk-win pk-lang-${lang}">
            <div class="pk-loading-ov" id="pk-loader"><div class="pk-spin-lg"></div><div class="pk-loading-txt" id="pk-load-txt">${L.loading_detail}</div><button class="pk-stop-btn" id="pk-stop-load" title="${L.tip_stop}">${CONF.icons.stop} <span>${L.btn_stop}</span></button></div>
            <div class="pk-hd"><div class="pk-tt"><img src="${CONF.logoUrl}" style="width:24px;height:24px;border-radius:4px;object-fit:contain;">${L.title}</div><div style="display:flex;gap:4px;"><div class="pk-btn" id="pk-help" style="width:32px;padding:0;justify-content:center;" title="${L.tip_help}">${CONF.icons.help}</div><div class="pk-btn" id="pk-settings" style="width:32px;padding:0;justify-content:center;" title="${L.tip_settings}">${CONF.icons.settings}</div><div class="pk-btn" id="pk-close" style="width:32px;padding:0;justify-content:center;">${CONF.icons.close}</div></div></div>
            <div class="pk-tb"><button class="pk-btn" id="pk-nav-back" title="${L.tip_back}">${CONF.icons.back}<span>${L.btn_back}</span></button><button class="pk-btn" id="pk-refresh" title="${L.tip_refresh}">${CONF.icons.refresh}</button><button class="pk-btn" id="pk-nav-fwd" title="${L.tip_fwd}">${CONF.icons.fwd}<span>${L.btn_fwd}</span></button><div class="pk-sep"></div><div class="pk-nav" id="pk-crumb"></div><div style="flex:1"></div><div class="pk-search"><input type="text" id="pk-search-input" placeholder="${L.placeholder_search}" title="${L.tip_search}" autocomplete="off"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></div><div class="pk-dup-toolbar" id="pk-dup-tools"><span class="pk-dup-lbl">${L.lbl_dup_tool}</span><button class="pk-btn-toggle" id="pk-dup-size" title="${L.tip_toggle_size}">${L.btn_toggle_size} <span id="pk-cond-size">(${L.cond_small})</span></button><button class="pk-btn-toggle" id="pk-dup-date" title="${L.tip_toggle_date}">${L.btn_toggle_date} <span id="pk-cond-date">(${L.cond_old})</span></button></div><button class="pk-btn" id="pk-dup" style="display:none" title="${L.tip_dup}">${CONF.icons.dup} <span>${L.btn_dup}</span></button><button class="pk-btn" id="pk-scan" title="${L.tip_scan}">${CONF.icons.scan} <span>${L.btn_scan}</span></button><div class="pk-sep"></div><button class="pk-btn" id="pk-filter-toggle" title="${L.tip_filter}">${CONF.icons.filter} <span>${L.btn_filter}</span></button></div>
            <div class="pk-tb" id="pk-actionbar"><div class="pk-btn" id="pk-sidebar-toggle" title="${L.tip_sidebar}">${CONF.icons.sidebar}</div><button class="pk-btn" id="pk-view-toggle" title="${view === 'list' ? L.btn_view_grid : L.btn_view_list}">${view === 'list' ? CONF.icons.grid_view : CONF.icons.list_view}</button><input type="range" id="pk-grid-zoom" min="80" max="320" value="${AppState.get('gridZoom') || 140}" style="display:${view === 'grid' ? 'inline-block' : 'none'}; width:70px; margin-left:8px; cursor:pointer;" title="Zoom"><div class="pk-sep"></div><button class="pk-btn" id="pk-newfolder" title="${L.tip_newfolder}">${CONF.icons.newfolder} <span>${L.btn_newfolder}</span></button><button class="pk-btn" id="pk-del" title="${L.tip_del}">${CONF.icons.del} <span>${L.btn_del}</span></button><button class="pk-btn" id="pk-deselect" title="${L.tip_deselect}" style="display:none">${CONF.icons.deselect} <span>${L.btn_deselect}</span></button><div class="pk-sep"></div><button class="pk-btn" id="pk-copy" title="${L.tip_copy}">${CONF.icons.copy} <span>${L.btn_copy}</span></button><button class="pk-btn" id="pk-cut" title="${L.tip_cut}">${CONF.icons.cut} <span>${L.btn_cut}</span></button><button class="pk-btn" id="pk-paste" title="${L.tip_paste}" disabled>${CONF.icons.paste} <span>${L.btn_paste}</span></button><div class="pk-sep"></div><button class="pk-btn" id="pk-rename" title="${L.tip_rename}">${CONF.icons.rename} <span>${L.btn_rename}</span></button><button class="pk-btn" id="pk-bulkrename" title="${L.tip_bulkrename}">${CONF.icons.bulkrename} <span>${L.btn_bulkrename}</span></button><div class="pk-sep"></div><button class="pk-btn" id="pk-link-copy" title="${L.tip_link_copy}">${CONF.icons.link_copy || '🔗'} <span>${L.btn_link_copy}</span></button></div>
            <div id="pk-filter-area"></div>
            <div class="pk-body">
                <div class="pk-sidebar" id="pk-sidebar"></div>
                <div class="pk-main">
                    <div class="pk-grid-hd"><div><input type="checkbox" id="pk-all"></div><div class="pk-col" data-k="name">${L.col_name} <span></span></div><div class="pk-col" data-k="size">${L.col_size} <span></span></div><div class="pk-col" data-k="duration">${L.col_dur} <span></span></div><div class="pk-col" data-k="modified_time">${L.col_date} <span></span></div></div>
                    <div class="pk-vp" id="pk-vp"><div class="pk-in" id="pk-in"></div></div>
                </div>
            </div>
            <div class="pk-ft"><div class="pk-stat" id="pk-stat">${L.status_ready.replace('{n}', 0)}</div><div class="pk-grp"><button class="pk-btn" id="pk-ext" title="${L.tip_ext}">${CONF.icons.play} <span>${L.btn_ext}</span></button><div class="pk-sep"></div><button class="pk-btn" id="pk-idm" title="${L.tip_idm}">${CONF.icons.link} <span>${L.btn_idm}</span></button><button class="pk-btn" id="pk-aria2" title="${L.tip_aria2}">${CONF.icons.send} <span>${L.btn_aria2}</span></button><button class="pk-btn" id="pk-down" title="${L.tip_down}">${CONF.icons.download} <span>${L.btn_down}</span></button></div></div>
        </div>
        <div class="pk-pop" id="pk-pop"></div>
        <div class="pk-ctx" id="pk-ctx"><div class="pk-ctx-item" id="ctx-open">📂 ${L.ctx_open}</div><div class="pk-ctx-sep"></div><div class="pk-ctx-item" id="ctx-down">💾 ${L.ctx_down}</div><div class="pk-ctx-item" id="ctx-copy">📄 ${L.ctx_copy}</div><div class="pk-ctx-item" id="ctx-cut">✂️ ${L.ctx_cut}</div><div class="pk-ctx-sep"></div><div class="pk-ctx-item" id="ctx-rename">✏️ ${L.ctx_rename}</div><div class="pk-ctx-item" id="ctx-del" style="color:#d93025">🗑️ ${L.ctx_del}</div></div>
        <div class="pk-toast-box" id="pk-toast-box"></div>
    `;
    document.body.appendChild(el);
    _overlayEl = el;
    UI.el = el; UI.win = el.querySelector('.pk-win'); UI.vp = el.querySelector('#pk-vp'); UI.in = el.querySelector('#pk-in');
    UI.loader = el.querySelector('#pk-loader'); UI.loadTxt = el.querySelector('#pk-load-txt'); UI.stopBtn = el.querySelector('#pk-stop-load');
    UI.crumb = el.querySelector('#pk-crumb'); UI.stat = el.querySelector('#pk-stat');
    UI.chkAll = el.querySelector('#pk-all'); UI.scan = el.querySelector('#pk-scan'); UI.dup = el.querySelector('#pk-dup');
    UI.dupTools = el.querySelector('#pk-dup-tools');
    UI.btnDupSize = el.querySelector('#pk-dup-size'); UI.condSize = el.querySelector('#pk-cond-size');
    UI.btnDupDate = el.querySelector('#pk-dup-date'); UI.condDate = el.querySelector('#pk-cond-date');
    UI.btnBack = el.querySelector('#pk-nav-back'); UI.btnFwd = el.querySelector('#pk-nav-fwd');
    UI.btnCopy = el.querySelector('#pk-copy'); UI.btnCut = el.querySelector('#pk-cut');
    UI.btnDel = el.querySelector('#pk-del'); UI.btnDeselect = el.querySelector('#pk-deselect');
    UI.btnRename = el.querySelector('#pk-rename'); UI.btnBulkRename = el.querySelector('#pk-bulkrename'); UI.btnPaste = el.querySelector('#pk-paste');
    UI.btnRefresh = el.querySelector('#pk-refresh'); UI.btnNewFolder = el.querySelector('#pk-newfolder');
    UI.btnSettings = el.querySelector('#pk-settings'); UI.btnClose = el.querySelector('#pk-close');
    UI.btnHelp = el.querySelector('#pk-help'); UI.btnExt = el.querySelector('#pk-ext'); UI.btnIdm = el.querySelector('#pk-idm');
    UI.btnLinkCopy = el.querySelector('#pk-link-copy'); UI.btnViewToggle = el.querySelector('#pk-view-toggle');
    UI.pop = el.querySelector('#pk-pop'); UI.ctx = el.querySelector('#pk-ctx'); UI.cols = el.querySelectorAll('.pk-col');
    UI.searchInput = el.querySelector('#pk-search-input');
    UI.filterToggle = el.querySelector('#pk-filter-toggle'); UI.filterArea = el.querySelector('#pk-filter-area');
    UI.sidebarEl = el.querySelector('#pk-sidebar'); UI.sidebarToggle = el.querySelector('#pk-sidebar-toggle');
    UI.gridZoom = el.querySelector('#pk-grid-zoom');

    // ── 윈도우 드래그 ──
    let isDragging = false, startX, startY;
    let initialLeft, initialTop;
    const hd = el.querySelector('.pk-hd');
    hd.addEventListener('mousedown', (e) => {
        if (e.target.closest('.pk-btn') || e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
        isDragging = true;
        startX = e.clientX; startY = e.clientY;
        const rect = UI.win.getBoundingClientRect();
        initialLeft = parseFloat(getComputedStyle(UI.win).left) || rect.left;
        initialTop = parseFloat(getComputedStyle(UI.win).top) || rect.top;
        document.body.style.userSelect = 'none';
        hd.style.cursor = 'grabbing';
    });
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX, dy = e.clientY - startY;
        UI.win.style.left = `${initialLeft + dx}px`;
        UI.win.style.top = `${initialTop + dy}px`;
        UI.win.style.margin = '0';
        UI.win.style.transform = 'none';
    });
    document.addEventListener('mouseup', () => {
        isDragging = false;
        document.body.style.userSelect = '';
        hd.style.cursor = 'default';
    });

    // ── 윈도우 리사이즈 (가장자리) ──
    const rsDirs = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];
    rsDirs.forEach(dir => {
        const h = document.createElement('div');
        h.className = `pk-rz pk-rz-${dir}`;
        UI.win.appendChild(h);

        h.addEventListener('mousedown', (e) => {
            let isResizing = true, rStartX = e.clientX, rStartY = e.clientY;
            const rect = UI.win.getBoundingClientRect();
            let startW = rect.width, startH = rect.height;
            let startL = parseFloat(getComputedStyle(UI.win).left) || rect.left;
            let startT = parseFloat(getComputedStyle(UI.win).top) || rect.top;
            document.body.style.cursor = `${dir}-resize`;
            document.body.style.userSelect = 'none';
            e.stopPropagation(); e.preventDefault();

            const mm = (ev) => {
                if (!isResizing) return;
                const dx = ev.clientX - rStartX, dy = ev.clientY - rStartY;
                if (dir.includes('e')) UI.win.style.width = `${startW + dx}px`;
                if (dir.includes('s')) UI.win.style.height = `${startH + dy}px`;
                if (dir.includes('w')) {
                    UI.win.style.width = `${startW - dx}px`;
                    UI.win.style.left = `${startL + dx}px`;
                }
                if (dir.includes('n')) {
                    UI.win.style.height = `${startH - dy}px`;
                    UI.win.style.top = `${startT + dy}px`;
                }
            };
            const mu = () => {
                isResizing = false;
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
                document.removeEventListener('mousemove', mm);
                document.removeEventListener('mouseup', mu);
            };
            document.addEventListener('mousemove', mm);
            document.addEventListener('mouseup', mu);
        });
    });

    return el;
}

function setLoading(b, L) { AppState.setState({ loading: b }); UI.loader.style.display = b ? 'flex' : 'none'; if (b && L) UI.loadTxt.textContent = L.loading_detail; }
function updateLoadingText(txt) { if (UI.loadTxt) UI.loadTxt.innerText = txt; }
function updateStat(L) {
    const n = AppState.get('sel').size, display = AppState.get('display');
    UI.stat.textContent = n > 0 ? L.sel_count.replace('{n}', n) : L.status_ready.replace('{n}', display.length);
    const hasSel = n > 0;
    UI.btnCopy.disabled = !hasSel; UI.btnCut.disabled = !hasSel; UI.btnDel.disabled = !hasSel;
    UI.btnRename.disabled = n !== 1; UI.btnBulkRename.disabled = n < 2; UI.btnSettings.disabled = false;
    UI.btnDeselect.style.display = hasSel ? 'inline-flex' : 'none';
    if (UI.btnLinkCopy) UI.btnLinkCopy.disabled = !hasSel;
}
function updateNavState() {
    const path = AppState.get('path'), history = AppState.get('history'), forward = AppState.get('forward');
    UI.btnBack.disabled = (history.length === 0 && path.length <= 1);
    UI.btnFwd.disabled = forward.length === 0;
}

;// ./src/ui/fileList.js
// src/ui/fileList.js
// 파일 목록 렌더러 (list/grid)






// 핸들러 저장소
let _h = null;
function setHandlers(h) { _h = h; }

// Grid 계산값 캐시
let _gridCache = { items: [], cols: 1, cardW: 140, cardH: 200, gap: 10 };

function getIcon(item) {
    if (item.kind === 'drive#folder') return CONF.typeIcons.folder;
    const name = item.name || '';
    const dot = name.lastIndexOf('.');
    if (dot === -1) return CONF.typeIcons.file;
    const ext = name.substring(dot + 1).toLowerCase();
    if ('mp4,mkv,avi,mov,wmv,flv,webm,ts,m4v,3gp'.split(',').includes(ext)) return CONF.typeIcons.video;
    if ('jpg,jpeg,png,gif,bmp,svg,webp,tiff,ico'.split(',').includes(ext)) return CONF.typeIcons.image;
    if ('mp3,wav,flac,aac,ogg,m4a,wma'.split(',').includes(ext)) return CONF.typeIcons.audio;
    if ('zip,rar,7z,tar,gz,iso,dmg,pkg'.split(',').includes(ext)) return CONF.typeIcons.archive;
    if (ext === 'pdf') return CONF.typeIcons.pdf;
    if ('doc,docx,xls,xlsx,ppt,pptx,txt,md,csv'.split(',').includes(ext)) return CONF.typeIcons.text;
    return CONF.typeIcons.file;
}

function render() {
    const view = AppState.get('view');
    if (view === 'list') {
        const hd = UI.win.querySelector('.pk-grid-hd');
        if (hd) hd.classList.remove('hidden');
        UI.in.className = 'pk-in';
        renderList();
    } else {
        const hd = UI.win.querySelector('.pk-grid-hd');
        if (hd) hd.classList.add('hidden');
        UI.in.className = 'pk-grid-con';
        renderGrid();
    }
}

function renderList() {
    const display = AppState.get('display');
    const sort = AppState.get('sort');
    const dir = AppState.get('dir');
    UI.in.style.height = `${display.length * CONF.rowHeight}px`;
    UI.cols.forEach(c => {
        c.querySelector('span').textContent = (c.dataset.k === sort) ? (dir === 1 ? ' ▲' : ' ▼') : '';
        c.style.color = (c.dataset.k === sort) ? 'var(--pk-pri)' : '';
    });
    requestAnimationFrame(renderVisibleList);
}

function renderVisibleList() {
    if (AppState.get('view') !== 'list') return;
    const display = AppState.get('display');
    const sel = AppState.get('sel');
    const top = UI.vp.scrollTop, h = UI.vp.clientHeight;
    const start = Math.max(0, Math.floor(top / CONF.rowHeight) - CONF.buffer);
    const end = Math.min(display.length, Math.ceil((top + h) / CONF.rowHeight) + CONF.buffer);
    UI.in.innerHTML = '';
    for (let i = start; i < end; i++) {
        const d = display[i]; if (!d) continue;
        const row = document.createElement('div');
        row.style.position = 'absolute'; row.style.top = `${i * CONF.rowHeight}px`; row.style.width = '100%';
        if (d.isHeader) {
            row.className = 'pk-group-hd';
            row.innerHTML = `<div style="display:flex;align-items:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"><span style="margin-right:8px;">📁</span><span>${esc(d.name)}</span></div><div style="margin-left:auto;display:flex;align-items:center;"><span class="pk-tag">${d.type}</span><span class="pk-cnt">${d.count}</span></div>`;
        } else {
            const isSel = sel.has(d.id);
            row.className = `pk-row ${isSel ? 'sel' : ''}`;
            row.dataset.id = d.id;
            const durVal = d.params?.duration || d.medias?.[0]?.duration || d.video_media_metadata?.duration || '';
            row.innerHTML = `<div><input type="checkbox" ${isSel ? 'checked' : ''}></div><div class="pk-name" title="${esc(d.name)}">${getIcon(d)}<span>${esc(d.name)}</span></div><div>${d.kind === 'drive#folder' ? '' : fmtSize(d.size)}</div><div>${fmtDur(durVal)}</div><div style="color:#888">${fmtDate(d.modified_time)}</div>`;
            if (_h) {
                const chk = row.querySelector('input');
                row.onclick = (e) => _h.onRowClick(e, d, i, chk);
                row.ondblclick = (e) => _h.onRowDblClick(e, d);
                row.oncontextmenu = (e) => _h.onRowContext(e, d, i);
                row.onmouseenter = (e) => _h.onRowEnter(e, d);
                row.onmouseleave = () => _h.onRowLeave();
            }
            applyDragDrop(row, d);
        }
        UI.in.appendChild(row);
    }
}

function renderGrid() {
    if (AppState.get('view') !== 'grid') return;
    const display = AppState.get('display');
    const zoom = AppState.get('gridZoom') || 140;

    const gap = 10, padding = 10, containerW = UI.vp.clientWidth - (padding * 2);
    const cols = Math.floor((containerW + gap) / (zoom + gap)) || 1;
    const cardW = (containerW - (cols - 1) * gap) / cols;
    const thumbH = Math.floor(cardW * 0.75); // 4:3 aspect ratio
    const cardH = thumbH + 56; // 56px for padding and text

    UI.in.style.setProperty('--pk-thumb-h', `${thumbH}px`);

    const visibleItems = display.filter(d => !d.isHeader);
    const totalRows = Math.ceil(visibleItems.length / cols);
    UI.in.style.height = `${totalRows * (cardH + gap)}px`;
    _gridCache = { items: visibleItems, cols, cardW, cardH, gap };
    requestAnimationFrame(renderVisibleGrid);
}

function renderVisibleGrid() {
    if (AppState.get('view') !== 'grid') return;
    const { items, cols, cardW, cardH, gap } = _gridCache;
    const sel = AppState.get('sel');
    const top = UI.vp.scrollTop, h = UI.vp.clientHeight;
    const startRow = Math.max(0, Math.floor(top / (cardH + gap)) - 2);
    const endRow = Math.min(Math.ceil(items.length / cols), Math.ceil((top + h) / (cardH + gap)) + 2);
    UI.in.innerHTML = '';
    for (let r = startRow; r < endRow; r++) {
        for (let c = 0; c < cols; c++) {
            const idx = r * cols + c;
            if (idx >= items.length) break;
            const d = items[idx], isSel = sel.has(d.id);
            const card = document.createElement('div');
            card.className = `pk-card ${isSel ? 'sel' : ''}`;
            card.dataset.id = d.id;
            card.style.cssText = `width:${cardW}px;height:${cardH}px;left:${10 + c * (cardW + gap)}px;top:${10 + r * (cardH + gap)}px`;
            let thumb = getIcon(d);
            if (d.kind !== 'drive#folder' && d.thumbnail_link) thumb = `<img src="${d.thumbnail_link}" loading="lazy" decoding="async">`;
            card.innerHTML = `<input type="checkbox" class="pk-card-chk" ${isSel ? 'checked' : ''}><div class="pk-card-thumb">${thumb}</div><div class="pk-card-name" title="${esc(d.name)}">${esc(d.name)}</div><div class="pk-card-info"><span>${d.kind === 'drive#folder' ? '' : fmtSize(d.size)}</span><span>${d.params?.duration ? fmtDur(d.params.duration) : ''}</span></div>`;
            if (_h) {
                const chk = card.querySelector('input');
                card.onclick = (e) => _h.onCardClick(e, d, idx, chk, card);
                card.ondblclick = (e) => _h.onCardDblClick(e, d);
                card.oncontextmenu = (e) => _h.onCardContext(e, d, card);
            }
            applyDragDrop(card, d);
            UI.in.appendChild(card);
        }
    }
}

function initScrollHandler() {
    UI.vp.onscroll = () => {
        if (AppState.get('view') === 'list') renderVisibleList();
        else renderGrid();
    };
}

function applyDragDrop(el, d) {
    el.setAttribute('draggable', 'true');
    el.ondragstart = (e) => {
        const sel = AppState.get('sel');
        if (!sel.has(d.id)) {
            sel.add(d.id);
            AppState.setState({ sel: sel });
            requestAnimationFrame(() => {
                if (AppState.get('view') === 'list') renderVisibleList(); else renderVisibleGrid();
            });
        }
        const ids = [...sel];
        e.dataTransfer.setData('application/pfm-ids', JSON.stringify(ids));
        e.dataTransfer.effectAllowed = 'move';

        const L = getStrings();
        const ghost = document.createElement('div');
        ghost.className = 'pk-drag-ghost';
        ghost.textContent = L.drag_move_count ? L.drag_move_count.replace('{n}', ids.length) : `${ids.length}`;
        document.body.appendChild(ghost);
        e.dataTransfer.setDragImage(ghost, -10, -10);
        requestAnimationFrame(() => ghost.remove());
    };

    if (d.kind === 'drive#folder') {
        el.ondragover = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; el.classList.add('pk-drop-over'); };
        el.ondragleave = () => { el.classList.remove('pk-drop-over'); };
        el.ondrop = (e) => {
            e.preventDefault();
            el.classList.remove('pk-drop-over');
            const raw = e.dataTransfer.getData('application/pfm-ids');
            if (raw && _h && _h.onDrop) {
                try {
                    _h.onDrop(JSON.parse(raw), d.id);
                } catch (err) { }
            }
        };
    }
}

;// ./src/core/toast.js
// src/core/toast.js
// 토스트 알림 시스템입니다.

const CONTAINER_ID = 'pfm-toast-container';

function ensureContainer() {
    let c = document.getElementById(CONTAINER_ID);
    if (!c) {
        c = document.createElement('div');
        c.id = CONTAINER_ID;
        document.body.appendChild(c);
    }
    return c;
}

const ICONS = {
    info: 'ℹ',
    success: '✓',
    error: '✗',
    warning: '⚠',
};

const Toast = {
    show(msg, type = 'info', duration = 3000) {
        const container = ensureContainer();
        const el = document.createElement('div');
        el.className = `pfm-toast pfm-toast-${type}`;
        el.innerHTML = `
            <span class="pfm-toast-icon">${ICONS[type] || ''}</span>
            <span class="pfm-toast-msg">${msg}</span>
        `;
        container.appendChild(el);
        requestAnimationFrame(() => el.classList.add('pfm-toast-visible'));
        setTimeout(() => {
            el.classList.remove('pfm-toast-visible');
            setTimeout(() => el.remove(), 300);
        }, duration);
    },

    success: (msg, dur) => Toast.show(msg, 'success', dur),
    error: (msg, dur) => Toast.show(msg, 'error', dur),
    warning: (msg, dur) => Toast.show(msg, 'warning', dur),
    info: (msg, dur) => Toast.show(msg, 'info', dur),

    // 백그라운드 작업용 — 진행률 표시
    progress(msg) {
        const container = ensureContainer();
        const el = document.createElement('div');
        el.className = 'pfm-toast pfm-toast-progress pfm-toast-visible';
        el.innerHTML = `
            <span class="pfm-toast-msg">${msg}</span>
            <div class="pfm-toast-bar"><div class="pfm-toast-fill" style="width:0%"></div></div>
            <span class="pfm-toast-pct">0%</span>
        `;
        container.appendChild(el);
        const fill = el.querySelector('.pfm-toast-fill');
        const pct = el.querySelector('.pfm-toast-pct');
        return {
            update(percent, newMsg) {
                fill.style.width = `${percent}%`;
                pct.textContent = `${Math.round(percent)}%`;
                if (newMsg) el.querySelector('.pfm-toast-msg').textContent = newMsg;
            },
            done(successMsg) {
                el.classList.add('pfm-toast-success');
                el.querySelector('.pfm-toast-msg').textContent = successMsg || '완료';
                fill.style.width = '100%';
                setTimeout(() => {
                    el.classList.remove('pfm-toast-visible');
                    setTimeout(() => el.remove(), 300);
                }, 2000);
            },
            error(errorMsg) {
                el.classList.add('pfm-toast-error');
                el.querySelector('.pfm-toast-msg').textContent = errorMsg || '오류 발생';
                setTimeout(() => el.remove(), 3000);
            },
        };
    },
};

// Toast CSS (style.js에서 병합)
const TOAST_CSS = `
#pfm-toast-container {
    position: fixed; bottom: 24px; right: 24px;
    display: flex; flex-direction: column; gap: 8px;
    z-index: 2147483647; pointer-events: none;
}
.pfm-toast {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 16px; border-radius: 8px;
    font-size: 13px; font-family: inherit;
    background: #323232; color: #fff;
    box-shadow: 0 4px 12px rgba(0,0,0,.3);
    opacity: 0; transform: translateY(8px);
    transition: opacity .25s, transform .25s;
    pointer-events: auto; max-width: 360px;
}
.pfm-toast.pfm-toast-visible { opacity: 1; transform: translateY(0); }
.pfm-toast-success { background: #2e7d32; }
.pfm-toast-error   { background: #c62828; }
.pfm-toast-warning { background: #e65100; }
.pfm-toast-bar     { flex: 1; height: 4px; background: rgba(255,255,255,.3); border-radius: 2px; }
.pfm-toast-fill    { height: 100%; background: #fff; border-radius: 2px; transition: width .2s; }
`;

;// ./src/ui/style.js
// src/ui/style.js
// 모든 CSS를 한 곳에서 관리합니다.
// injectStyles()로 페이지에 주입합니다.





// 추가 CSS (토스트 등)
const EXTRA_CSS = TOAST_CSS;

let _injected = false;

function injectStyles() {
    if (_injected) return;
    _injected = true;
    // Toast CSS는 Toast 컨테이너 생성 시 자동 주입되므로
    // 여기서는 별도 style 태그로 주입
    const styleEl = document.createElement('style');
    styleEl.textContent = EXTRA_CSS;
    document.head.appendChild(styleEl);
}

;// ./src/features/filter.js
// src/features/filter.js
// 고급 필터 기능: 파일 타입, 크기, 날짜, 이름으로 필터링

// 파일 타입 → 확장자 매핑
const TYPE_MAP = {
    video: ['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'ts', 'm2ts', 'webm', 'rmvb', 'm4v'],
    image: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'tiff', 'heic'],
    subtitle: ['srt', 'ass', 'ssa', 'smi', 'vtt', 'sup'],
    archive: ['zip', 'rar', '7z', 'tar', 'gz', 'bz2'],
    audio: ['mp3', 'flac', 'aac', 'wav', 'ogg', 'm4a', 'opus'],
    document: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'md', 'csv'],
};

const DEFAULT_FILTER = {
    types: [],         // 빈 배열 = 모든 타입
    sizeMin: null,     // bytes (null = 제한 없음)
    sizeMax: null,
    dateFrom: '',      // ISO date string (yyyy-mm-dd)
    dateTo: '',
    nameInclude: '',
    nameExclude: '',
    useRegex: false,
};

/**
 * 필터 활성 개수 계산
 */
function countActiveFilters(filter) {
    let n = 0;
    if (filter.types.length > 0) n++;
    if (filter.sizeMin !== null || filter.sizeMax !== null) n++;
    if (filter.dateFrom || filter.dateTo) n++;
    if (filter.nameInclude || filter.nameExclude) n++;
    return n;
}

/**
 * 파일 배열에 필터 적용
 */
function applyFilter(files, filter) {
    if (!filter) return files;
    return files.filter(f => {
        // 폴더는 항상 통과
        if (f.kind === 'drive#folder') return true;
        // 헤더 행도 통과
        if (f.isHeader) return true;

        // 1. 타입 필터
        if (filter.types.length > 0) {
            const ext = (f.name || '').split('.').pop().toLowerCase();
            const matched = filter.types.some(t => TYPE_MAP[t]?.includes(ext));
            if (!matched) return false;
        }

        // 2. 크기 필터
        const size = parseInt(f.size || 0);
        if (filter.sizeMin !== null && size < filter.sizeMin) return false;
        if (filter.sizeMax !== null && size > filter.sizeMax) return false;

        // 3. 날짜 필터
        if (filter.dateFrom) {
            const t = new Date(f.created_time || f.modified_time).getTime();
            if (t < new Date(filter.dateFrom).getTime()) return false;
        }
        if (filter.dateTo) {
            const t = new Date(f.created_time || f.modified_time).getTime();
            if (t > new Date(filter.dateTo).getTime() + 86400000) return false;
        }

        // 4. 이름 필터
        const name = (f.name || '').toLowerCase();
        if (filter.nameInclude) {
            if (filter.useRegex) {
                try {
                    if (!new RegExp(filter.nameInclude, 'i').test(f.name)) return false;
                } catch { /* 잘못된 정규식 무시 */ }
            } else {
                if (!name.includes(filter.nameInclude.toLowerCase())) return false;
            }
        }
        if (filter.nameExclude) {
            if (filter.useRegex) {
                try {
                    if (new RegExp(filter.nameExclude, 'i').test(f.name)) return false;
                } catch { /* 잘못된 정규식 무시 */ }
            } else {
                if (name.includes(filter.nameExclude.toLowerCase())) return false;
            }
        }

        return true;
    });
}

/**
 * 필터 패널 HTML 생성
 */
function createFilterPanelHTML(L, currentFilter) {
    const f = currentFilter || DEFAULT_FILTER;
    const typeButtons = ['video', 'image', 'subtitle', 'archive', 'audio', 'document'].map(t => {
        const icons = { video: '🎬', image: '🖼️', subtitle: '💬', archive: '📦', audio: '🎵', document: '📄' };
        const active = f.types.includes(t) ? ' active' : '';
        return `<button class="pk-filter-chip${active}" data-type="${t}">${icons[t]} ${L['filter_type_' + t] || t}</button>`;
    }).join('');

    return `
    <div class="pk-filter-panel" id="pk-filter-panel">
        <div class="pk-filter-section">
            <label class="pk-filter-label">${L.filter_type || 'Type'}:</label>
            <div class="pk-filter-chips" id="pk-filter-types">${typeButtons}</div>
        </div>
        <div class="pk-filter-sep"></div>
        <div class="pk-filter-section">
            <label class="pk-filter-label">${L.filter_size || 'Size'}:</label>
            <div class="pk-filter-range">
                <input type="number" id="pk-filter-size-min" placeholder="${L.filter_size_min || 'Min'}" value="${f.sizeMin !== null ? f.sizeMin / (1024 * 1024) : ''}" min="0" step="1" title="MB">
                <span>~</span>
                <input type="number" id="pk-filter-size-max" placeholder="${L.filter_size_max || 'Max'}" value="${f.sizeMax !== null ? f.sizeMax / (1024 * 1024) : ''}" min="0" step="1" title="MB">
            </div>
        </div>
        <div class="pk-filter-sep"></div>
        <div class="pk-filter-section">
            <label class="pk-filter-label">${L.filter_date || 'Date'}:</label>
            <div class="pk-filter-range">
                <input type="date" id="pk-filter-date-from" value="${f.dateFrom || ''}">
                <span>~</span>
                <input type="date" id="pk-filter-date-to" value="${f.dateTo || ''}">
            </div>
        </div>
        <div class="pk-filter-sep"></div>
        <div class="pk-filter-section">
            <label class="pk-filter-label">${L.filter_name || 'Name'}:</label>
            <div class="pk-filter-name-row">
                <input type="text" id="pk-filter-name-inc" placeholder="${L.filter_name_include || 'Include'}" value="${f.nameInclude || ''}">
                <input type="text" id="pk-filter-name-exc" placeholder="${L.filter_name_exclude || 'Exclude'}" value="${f.nameExclude || ''}">
                <label class="pk-filter-regex-label"><input type="checkbox" id="pk-filter-regex" ${f.useRegex ? 'checked' : ''}>${L.filter_regex || 'Rx'}</label>
            </div>
        </div>
        <div class="pk-filter-actions">
            <button class="pk-btn" id="pk-filter-reset">${L.btn_filter_reset || 'Reset'}</button>
            <button class="pk-btn pri" id="pk-filter-apply">${L.btn_filter_apply || 'Apply'}</button>
        </div>
    </div>`;
}

/**
 * 필터 패널에서 현재 값 읽기
 */
function readFilterFromPanel(panelEl) {
    const types = [];
    panelEl.querySelectorAll('.pk-filter-chip.active').forEach(ch => {
        types.push(ch.dataset.type);
    });

    const sizeMinVal = panelEl.querySelector('#pk-filter-size-min')?.value;
    const sizeMaxVal = panelEl.querySelector('#pk-filter-size-max')?.value;
    const sizeMin = sizeMinVal ? parseFloat(sizeMinVal) * 1024 * 1024 : null;
    const sizeMax = sizeMaxVal ? parseFloat(sizeMaxVal) * 1024 * 1024 : null;

    return {
        types,
        sizeMin,
        sizeMax,
        dateFrom: panelEl.querySelector('#pk-filter-date-from')?.value || '',
        dateTo: panelEl.querySelector('#pk-filter-date-to')?.value || '',
        nameInclude: panelEl.querySelector('#pk-filter-name-inc')?.value || '',
        nameExclude: panelEl.querySelector('#pk-filter-name-exc')?.value || '',
        useRegex: panelEl.querySelector('#pk-filter-regex')?.checked || false,
    };
}

;// ./src/ui/sidebar.js
// src/ui/sidebar.js
// 폴더 트리 사이드바 — Lazy Loading, 드래그앤드롭 타겟



let sidebar_L = null;
let _onNavigate = null;
let _onDrop = null;
let _currentFolderId = '';

/**
 * 사이드바 초기화
 * @param {HTMLElement} container  #pk-sidebar 요소
 * @param {Object} L              로케일 문자열
 * @param {Function} onNavigate   (folderId, folderName) => void
 * @param {Function} onDrop       (fileIds, targetFolderId) => Promise<void>
 */
function initSidebar(container, L, onNavigate, onDrop) {
    sidebar_L = L;
    _onNavigate = onNavigate;
    _onDrop = onDrop;

    container.innerHTML = `
        <div class="pk-sb-header">${L.sidebar_title}</div>
        <div class="pk-sb-tree" id="pk-sb-tree">
            <ul class="pk-tree-root"></ul>
        </div>
    `;

    const rootUl = container.querySelector('.pk-tree-root');
    // 루트(My Drive) 노드 추가
    const rootNode = _createNode('', L.sidebar_home, true);
    rootUl.appendChild(rootNode);

    // 루트를 즉시 펼침
    _toggleNode(rootNode, true);
}

/**
 * 현재 폴더 ID를 업데이트하여 사이드바에서 하이라이트
 */
function highlightFolder(folderId) {
    _currentFolderId = folderId;
    const tree = document.querySelector('#pk-sb-tree');
    if (!tree) return;
    tree.querySelectorAll('.pk-tree-row').forEach(row => {
        row.classList.toggle('active', row.dataset.folderId === folderId);
    });
}

/**
 * 특정 폴더의 캐시를 날리고 필요하다면 다시 로드하게 함. (드래그앤드롭 등으로 갱신 필요 시)
 */
function invalidateFolder(folderId) {
    const tree = document.querySelector('#pk-sb-tree');
    if (!tree) return;
    const row = tree.querySelector(`.pk-tree-row[data-folder-id="${folderId}"]`);
    if (row && row.parentElement) {
        const li = row.parentElement;
        delete li.dataset.loaded;
        const childUl = li.querySelector(':scope > .pk-tree-children');
        if (childUl && !childUl.hidden) {
            _toggleNode(li, true); // 상태가 열려있으므로 다시 로드하도록 호출
        }
    }
}

// ── 내부 함수 ──

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

    // 클릭: 폴더 이동 + 토글
    row.addEventListener('click', (e) => {
        e.stopPropagation();
        if (_onNavigate) _onNavigate(folderId, name);
        _toggleNode(li);
    });

    // 화살표 클릭: 토글만 (이동 안 함)
    arrow.addEventListener('click', (e) => {
        e.stopPropagation();
        _toggleNode(li);
    });

    // 드래그앤드롭 타겟
    _addDropTarget(row, folderId);

    return li;
}

let _expandTimers = new Map();

function _addDropTarget(rowEl, folderId) {
    rowEl.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        rowEl.classList.add('pk-drop-over');

        // 0.8초 호버 시 자동 펼침
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
        // 닫기
        childUl.hidden = true;
        arrow.innerHTML = CONF.icons.chevron_right;
        li.classList.remove('expanded');
        return;
    }

    if (forceOpen && isOpen) return; // 이미 열려있음

    // 열기: 아직 로드하지 않았으면 Lazy Load
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
                emptyLi.textContent = sidebar_L.sidebar_empty;
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

;// ./package.json
const package_namespaceObject = {"rE":"2.0.0"};
;// ./src/main.js
// src/main.js — openManager 핵심 로직 (모듈 사용)












const { /* version */ "rE": version } = package_namespaceObject;

console.log("🚀 PikPak Script: LOADED from main.js");

function syncState(S) {
    AppState.setState({
        view: S.view, display: S.display, sel: S.sel,
        sort: S.sort, dir: S.dir, loading: S.loading,
        items: S.items, path: S.path, history: S.history, forward: S.forward,
        scanning: S.scanning, dupMode: S.dupMode, dupRunning: S.dupRunning,
        dupReasons: S.dupReasons, dupGroups: S.dupGroups,
        dupSizeStrategy: S.dupSizeStrategy, dupDateStrategy: S.dupDateStrategy,
        lastSelIdx: S.lastSelIdx, search: S.search, gridZoom: S.gridZoom,
    });
}

async function openManager() {
    if (document.querySelector('.pk-ov')) return;
    const L = getStrings();
    const lang = getLang();

    const S = {
        path: [{ id: '', name: '🏠 Home' }],
        history: [], forward: [],
        items: [], display: [], sel: new Set(),
        sort: 'name', dir: 1, scanning: false, dupMode: false, dupRunning: false,
        dupReasons: new Map(), dupGroups: new Map(),
        dupSizeStrategy: 'small', dupDateStrategy: 'old',
        clipItems: [], clipType: '', clipSourceParentId: null,
        loading: false, lastSelIdx: -1, search: '',
        view: gmGet('pk_view_mode', 'list'),
        gridZoom: parseInt(gmGet('pk_grid_zoom', '140'), 10),
        foldersFirst: gmGet('pk_folders_first', 'true') === 'true',
        filter: { ...DEFAULT_FILTER },
        filterActive: false
    };
    syncState(S);

    // ── 레이아웃 + 모달 초기화 ──
    const el = createLayout(L, lang, version);
    initModal(UI.win, L);
    injectStyles();

    // ── 사이드바 초기화 ──
    const sidebarOpen = gmGet('pk_sidebar_open', 'false') === 'true';
    if (sidebarOpen) {
        UI.sidebarEl.classList.add('open');
        UI.sidebarToggle.classList.add('active');
    }
    initSidebar(UI.sidebarEl, L,
        // onNavigate: 폴더 클릭 시
        (folderId, folderName) => {
            if (S.loading) return;
            S.history.push({ path: [...S.path] });
            S.forward = [];
            if (!folderId) {
                S.path = [{ id: '', name: L.sidebar_home }];
            } else {
                S.path = [{ id: '', name: L.sidebar_home }, { id: folderId, name: folderName }];
            }
            load();
        },
        // onDrop: 드래그앤드롭으로 파일 이동
        async (ids, targetFolderId) => {
            const currentFolderId = S.path[S.path.length - 1].id || '';
            if (ids.includes(targetFolderId)) {
                showToast(L.drag_move_same);
                return;
            }
            try {
                setLoad(true);
                await fetch('https://api-drive.mypikpak.com/drive/v1/files:batchMove', {
                    method: 'POST', headers: getHeaders(),
                    body: JSON.stringify({ ids: ids, to: { parent_id: targetFolderId } })
                });
                showToast(L.drag_move_done.replace('{n}', ids.length));
                invalidateFolder(targetFolderId);
                S.items = S.items.filter(i => !ids.includes(i.id));
                ids.forEach(id => S.sel.delete(id));
                refresh();
            } catch (e) {
                showAlert(L.drag_move_fail.replace('{e}', e.message));
            } finally {
                setLoad(false);
            }
        }
    );
    // 사이드바 토글 버튼
    UI.sidebarToggle.onclick = () => {
        const isOpen = UI.sidebarEl.classList.toggle('open');
        UI.sidebarToggle.classList.toggle('active', isOpen);
        gmSet('pk_sidebar_open', isOpen ? 'true' : 'false');
    };

    // ── 헬퍼 ──
    const setLoad = (b) => { S.loading = b; setLoading(b, L); };
    const updateLoadTxt = (txt) => updateLoadingText(txt);
    const _updateNavState = () => { syncState(S); updateNavState(); };
    const _updateStat = () => { syncState(S); updateStat(L); };
    const _render = () => { syncState(S); render(); };

    // ── 리스트 핸들러 등록 ──
    setHandlers({
        onRowClick(e, d, i, chk) {
            if (S.loading) return;
            if (e.target.tagName === 'INPUT') {
                if (chk.checked) S.sel.add(d.id); else S.sel.delete(d.id);
                S.lastSelIdx = i;
            } else if (e.shiftKey && S.lastSelIdx !== -1) {
                const s = Math.min(S.lastSelIdx, i), end = Math.max(S.lastSelIdx, i);
                for (let k = s; k <= end; k++) {
                    if (!S.display[k].isHeader) S.sel.add(S.display[k].id);
                }
            } else if (e.ctrlKey || e.metaKey) {
                chk.checked = !chk.checked;
                if (chk.checked) S.sel.add(d.id); else S.sel.delete(d.id);
                S.lastSelIdx = i;
            } else {
                S.sel.clear();
                S.sel.add(d.id);
                S.lastSelIdx = i;
            }
            syncState(S); renderList(); _updateStat();
        },
        onRowDblClick(e, d) {
            e.preventDefault(); if (S.loading) return;
            if (d.kind === 'drive#folder') { S.history.push({ path: [...S.path] }); S.path.push({ id: d.id, name: d.name }); S.forward = []; load(); }
            else if (d.mime_type?.startsWith('video')) playVideo(d);
        },
        onRowContext(e, d, i) {
            e.preventDefault();
            if (!S.sel.has(d.id)) { S.sel.clear(); S.sel.add(d.id); S.lastSelIdx = i; syncState(S); renderList(); _updateStat(); }
            UI.ctx.style.display = 'block';
            let x = e.clientX, y = e.clientY;
            const w = UI.ctx.offsetWidth || 150, h2 = UI.ctx.offsetHeight || 200;
            if (x + w > window.innerWidth) x = window.innerWidth - w - 10;
            if (y + h2 > window.innerHeight) y = window.innerHeight - h2 - 10;
            UI.ctx.style.left = x + 'px'; UI.ctx.style.top = y + 'px';
        },
        onRowEnter(e, d) {
            if (d.thumbnail_link && !S.loading) {
                UI.pop.innerHTML = `<img src="${d.thumbnail_link}">`; UI.pop.style.display = 'block';
                const r = UI.pop.getBoundingClientRect(); let t = e.clientY + 15;
                if (t + r.height > window.innerHeight) t = e.clientY - r.height - 10;
                UI.pop.style.top = t + 'px'; UI.pop.style.left = (e.clientX + 15) + 'px';
            }
        },
        onRowLeave() { UI.pop.style.display = 'none'; },
        onCardClick(e, d, idx, chk, card) {
            if (S.loading) return;
            if (e.target.tagName === 'INPUT') {
                if (chk.checked) S.sel.add(d.id); else S.sel.delete(d.id);
                S.lastSelIdx = idx;
            } else if (e.shiftKey && S.lastSelIdx !== -1) {
                const visibleItems = S.display.filter(v => !v.isHeader);
                const s = Math.min(S.lastSelIdx, idx), end = Math.max(S.lastSelIdx, idx);
                for (let k = s; k <= end; k++) {
                    S.sel.add(visibleItems[k].id);
                }
            } else if (e.ctrlKey || e.metaKey) {
                chk.checked = !chk.checked;
                if (chk.checked) S.sel.add(d.id); else S.sel.delete(d.id);
                S.lastSelIdx = idx;
            } else {
                S.sel.clear();
                S.sel.add(d.id);
                S.lastSelIdx = idx;
            }
            syncState(S); renderGrid(); _updateStat();
        },
        onCardDblClick(e, d) {
            e.preventDefault(); if (S.loading) return;
            if (d.kind === 'drive#folder') { S.history.push({ path: [...S.path] }); S.path.push({ id: d.id, name: d.name }); S.forward = []; load(); }
            else if (d.mime_type?.startsWith('video')) playVideo(d);
        },
        onCardContext(e, d, card) {
            e.preventDefault();
            if (!S.sel.has(d.id)) { S.sel.clear(); S.sel.add(d.id); card.classList.add('sel'); _updateStat(); }
            UI.ctx.style.display = 'block'; UI.ctx.style.left = e.clientX + 'px'; UI.ctx.style.top = e.clientY + 'px';
        },
        async onDrop(ids, targetFolderId) {
            const currentFolderId = S.path[S.path.length - 1].id || '';
            if (ids.includes(targetFolderId)) {
                showToast(L.drag_move_same);
                return;
            }
            try {
                setLoad(true);
                await fetch('https://api-drive.mypikpak.com/drive/v1/files:batchMove', {
                    method: 'POST', headers: getHeaders(),
                    body: JSON.stringify({ ids: ids, to: { parent_id: targetFolderId } })
                });
                showToast(L.drag_move_done.replace('{n}', ids.length));
                // 타겟 폴더 트리 UI 갱신 (있다면)
                invalidateFolder(targetFolderId);
                S.items = S.items.filter(i => !ids.includes(i.id));
                ids.forEach(id => S.sel.delete(id));
                refresh();
            } catch (e) {
                showAlert(L.drag_move_fail.replace('{e}', e.message));
            } finally {
                setLoad(false);
            }
        }
    });
    initScrollHandler();

    // ── 네비게이션 ──
    function renderCrumb() {
        UI.crumb.innerHTML = '';
        S.path.forEach((p, i) => {
            const s = document.createElement('span'); s.textContent = p.name; s.className = i === S.path.length - 1 ? 'act' : '';
            s.onclick = () => { if (i !== S.path.length - 1 && !S.loading) { S.history.push({ path: [...S.path] }); S.forward = []; S.path = S.path.slice(0, i + 1); load(); } };
            UI.crumb.appendChild(s); if (i < S.path.length - 1) UI.crumb.appendChild(document.createTextNode(' › '));
        });
    }
    const goBack = async () => {
        if (S.loading) return;
        if (S.history.length > 0) { S.forward.push([...S.path]); const prev = S.history.pop(); S.path = prev.path; load(true); return; }
        if (S.path.length > 1) { S.forward.push([...S.path]); S.path = S.path.slice(0, S.path.length - 1); load(true); return; }
        if (S.path.length === 1 && S.history.length === 0) { if (await showConfirm(L.msg_exit_confirm)) { el.remove(); } }
    };
    const goForward = () => { if (S.forward.length > 0 && !S.loading) { S.history.push({ path: [...S.path] }); const next = S.forward.pop(); S.path = next; load(); } };

    // ── 로드 / 리프레시 ──
    async function load(isHistoryNav = false) {
        if (S.loading) return;
        setLoad(true);
        S.search = ''; if (UI.searchInput) UI.searchInput.value = '';
        const cur = S.path[S.path.length - 1];
        _updateNavState();
        UI.scan.style.display = 'flex'; UI.dup.style.display = 'none'; UI.dupTools.style.display = 'none';
        S.dupMode = false; S.lastSelIdx = -1;
        renderCrumb();
        // 사이드바 현재 폴더 하이라이트
        highlightFolder(cur.id || '');
        try {
            if (!S.scanning) {
                updateLoadTxt(L.loading_detail);
                S.items = await apiList(cur.id, 1000, (cnt) => { updateLoadTxt(L.loading_fetch.replace('{n}', cnt)); });
                refresh();
            }
        } catch (e) { console.error(e); showAlert("Failed to load: " + e.message); }
        finally { setLoad(false); }
        el.focus();
    }

    async function refresh() {
        if (S.search) { const q = S.search.toLowerCase(); S.display = S.items.filter(i => i.name.toLowerCase().includes(q)); }
        else { S.display = [...S.items]; }
        // 필터 적용
        if (S.filterActive && countActiveFilters(S.filter) > 0) {
            S.display = applyFilter(S.display, S.filter);
        }
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
                    if (!isDup) { const targetName = clean(target.name); if (rootName === targetName) { isDup = true; type = L.tag_name; } else if (rootDur > 0) { if (Math.abs(rootDur - parseFloat(target.params?.duration || 0)) <= 1.0 && (targetName.includes(rootName) || rootName.includes(targetName))) { isDup = true; type = L.tag_sim; } } }
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
                if (S.foldersFirst && a.kind !== b.kind) return a.kind === 'drive#folder' ? -1 : 1;
                let va, vb;
                if (S.sort === 'ext') {
                    va = (a.name || '').split('.').pop().toLowerCase();
                    vb = (b.name || '').split('.').pop().toLowerCase();
                } else if (S.sort === 'created_time') {
                    va = a.created_time || a.modified_time || '';
                    vb = b.created_time || b.modified_time || '';
                } else if (S.sort === 'size') {
                    va = parseInt(a.size || 0); vb = parseInt(b.size || 0);
                } else if (S.sort === 'duration') {
                    va = parseInt(a.params?.duration || 0); vb = parseInt(b.params?.duration || 0);
                } else {
                    va = a[S.sort]; vb = b[S.sort];
                }
                if (va > vb) return S.dir; if (va < vb) return -S.dir; return 0;
            });
        }
        const currentIds = new Set(S.display.filter(x => !x.isHeader).map(i => i.id));
        for (let id of S.sel) { if (!currentIds.has(id)) S.sel.delete(id); }
        if (S.sel.size === 0) UI.chkAll.checked = false;
        _render();
        _updateStat();
    }

    // ── getLinks / playVideo ──
    async function getLinks() { const res = []; for (const id of S.sel) { let item = S.items.find(x => x.id === id); if (item && !item.web_content_link) { try { item = await apiGet(id); } catch { } } if (item?.web_content_link) res.push(item); } return res; }
    async function playVideo(item) {
        let link = item.web_content_link; if (!link) { try { const m = await apiGet(item.id); link = m.web_content_link; } catch (e) { console.error(e); } }
        if (!link) { showAlert(L.msg_video_fail || "Cannot fetch video link."); return; }
        const d = document.createElement('div'); d.id = 'pk-player-ov'; d.tabIndex = 0;
        d.innerHTML = `<div style="position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,0.95);backdrop-filter:blur(5px);display:flex;justify-content:center;align-items:center;"><div style="width:95vw;height:95vh;max-width:1600px;background:#000;border-radius:8px;box-shadow:0 20px 60px rgba(0,0,0,0.8);display:flex;flex-direction:column;overflow:hidden;border:1px solid #333;"><div style="flex:0 0 40px;background:#1a1a1a;padding:0 20px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #333;"><span style="color:#ddd;font-weight:600;font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(item.name)}</span><button class="pk-close-btn" style="color:#aaa;background:none;border:none;font-size:24px;cursor:pointer;width:30px;height:30px;display:flex;align-items:center;justify-content:center;">×</button></div><div style="flex:1;background:#000;position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden;"><video src="${link}" controls autoplay playsinline preload="auto" style="width:100%;height:100%;object-fit:contain;outline:none;" onerror=\"this.parentElement.innerHTML='<div style=color:#f55;padding:20px;text-align:center>Video Load Failed.</div>';\"></video></div></div><style>.pk-close-btn:hover{color:#fff}</style></div>`;
        document.body.appendChild(d); d.focus(); d.onkeydown = (e) => { if (e.key === 'Escape') { d.remove(); e.stopPropagation(); } }; d.querySelector('.pk-close-btn').onclick = () => d.remove(); d.onclick = (e) => { if (e.target === d.firstElementChild) d.remove(); };
    }

    // ── 키보드 / 마우스 ──
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

    // ── 올가미(Lasso) 드래그 선택 ──
    const lassoEl = document.createElement('div');
    lassoEl.className = 'pk-lasso';
    lassoEl.style.display = 'none';
    document.body.appendChild(lassoEl);
    let lassoActive = false, lassoStartX = 0, lassoStartY = 0, lassoInitSel = new Set();
    UI.vp.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        if (e.target.closest('.pk-row') || e.target.closest('.pk-card') || e.target.closest('.pk-grid-hd')) return;
        lassoActive = true;
        lassoStartX = e.clientX; lassoStartY = e.clientY;
        lassoEl.style.left = lassoStartX + 'px';
        lassoEl.style.top = lassoStartY + 'px';
        lassoEl.style.width = '0px';
        lassoEl.style.height = '0px';
        lassoEl.style.display = 'block';
        if (!e.shiftKey && !e.ctrlKey && !e.metaKey) { S.sel.clear(); _render(); _updateStat(); }
        lassoInitSel = new Set(S.sel);
        document.body.style.userSelect = 'none';
    });
    document.addEventListener('mousemove', (e) => {
        if (!lassoActive) return;
        const cx = e.clientX, cy = e.clientY;
        const left = Math.min(lassoStartX, cx), top = Math.min(lassoStartY, cy);
        const width = Math.abs(cx - lassoStartX), height = Math.abs(cy - lassoStartY);
        lassoEl.style.left = left + 'px'; lassoEl.style.top = top + 'px';
        lassoEl.style.width = width + 'px'; lassoEl.style.height = height + 'px';

        const lr = lassoEl.getBoundingClientRect();
        const items = S.view === 'list' ? UI.in.querySelectorAll('.pk-row:not(.pk-group-hd)') : UI.in.querySelectorAll('.pk-card');
        items.forEach(el => {
            const id = el.dataset.id;
            if (!id) return;
            const r = el.getBoundingClientRect();
            const intersect = !(lr.right < r.left || lr.left > r.right || lr.bottom < r.top || lr.top > r.bottom);
            const shouldSelect = lassoInitSel.has(id) || intersect;
            if (shouldSelect) {
                if (!S.sel.has(id)) { S.sel.add(id); el.classList.add('sel'); const chk = el.querySelector('input'); if (chk) chk.checked = true; }
            } else {
                if (S.sel.has(id)) { S.sel.delete(id); el.classList.remove('sel'); const chk = el.querySelector('input'); if (chk) chk.checked = false; }
            }
        });
        _updateStat();
    });
    document.addEventListener('mouseup', () => {
        if (lassoActive) {
            lassoActive = false;
            lassoEl.style.display = 'none';
            document.body.style.userSelect = '';
        }
    });

    // ── 이벤트 연결 ──
    if (UI.searchInput) { UI.searchInput.oninput = (e) => { S.search = e.target.value.trim(); refresh(); }; UI.searchInput.onkeydown = (e) => { e.stopPropagation(); }; }
    UI.btnHelp.onclick = () => { const m = showModal(`<h3>${L.modal_help_title}</h3>${L.help_desc}<div class="pk-modal-act" style="margin-top:20px;"><button class="pk-btn pri" id="help_close" style="width:100%;justify-content:center;height:40px;">닫기</button></div>`); m.querySelector('#help_close').onclick = () => m.remove(); };
    UI.scan.onclick = async () => { if (S.scanning) { S.scanning = false; return; } if (!await showConfirm(L.msg_flatten_warn)) return; S.scanning = true; UI.stopBtn.onclick = () => { S.scanning = false; }; const root = S.path[S.path.length - 1]; let q = [{ id: root.id, name: root.name }]; let all = []; setLoad(true); try { while (q.length && S.scanning) { const curr = q.shift(); const pid = curr.id; updateLoadTxt(L.status_scanning.replace('{n}', all.length).replace('{f}', curr.name) + "\n" + L.loading_detail); const files = await apiList(pid, 500, (currentCount) => { updateLoadTxt(L.status_scanning.replace('{n}', all.length + currentCount).replace('{f}', curr.name)); }); for (const f of files) { if (f.kind === 'drive#folder') q.push({ id: f.id, name: f.name }); else all.push(f); } await sleep(20); } if (S.scanning) { S.items = all; UI.dup.style.display = 'flex'; refresh(); } } catch (e) { showAlert("Error: " + e.message); } finally { S.scanning = false; setLoad(false); _updateStat(); } };
    UI.dup.onclick = async () => { if (!S.dupMode) if (!await showConfirm(L.msg_dup_warn)) return; S.dupMode = !S.dupMode; UI.dup.style.backgroundColor = S.dupMode ? '#444' : ''; UI.dup.style.color = S.dupMode ? '#fff' : ''; UI.dup.style.borderColor = S.dupMode ? '#666' : ''; refresh(); };
    UI.btnDupSize.onclick = () => { S.dupSizeStrategy = S.dupSizeStrategy === 'small' ? 'large' : 'small'; UI.condSize.textContent = `(${S.dupSizeStrategy === 'small' ? L.cond_small : L.cond_large})`; S.sel.clear(); const itemMap = new Map(); S.display.forEach(d => { if (d.isHeader) return; const gIdx = S.dupGroups.get(d.id); if (gIdx !== undefined) { if (!itemMap.has(gIdx)) itemMap.set(gIdx, []); itemMap.get(gIdx).push(d); } }); itemMap.forEach(items => { if (items.length < 2) return; let keep = (S.dupSizeStrategy === 'small') ? items.reduce((a, b) => parseInt(a.size) > parseInt(b.size) ? a : b) : items.reduce((a, b) => parseInt(a.size) < parseInt(b.size) ? a : b); items.forEach(i => { if (i.id !== keep.id) S.sel.add(i.id); }); }); _render(); _updateStat(); };
    UI.btnDupDate.onclick = () => { S.dupDateStrategy = S.dupDateStrategy === 'old' ? 'new' : 'old'; UI.condDate.textContent = `(${S.dupDateStrategy === 'old' ? L.cond_old : L.cond_new})`; S.sel.clear(); const itemMap = new Map(); S.display.forEach(d => { if (d.isHeader) return; const gIdx = S.dupGroups.get(d.id); if (gIdx !== undefined) { if (!itemMap.has(gIdx)) itemMap.set(gIdx, []); itemMap.get(gIdx).push(d); } }); itemMap.forEach(items => { if (items.length < 2) return; let keep = (S.dupDateStrategy === 'old') ? items.reduce((a, b) => new Date(a.modified_time) > new Date(b.modified_time) ? a : b) : items.reduce((a, b) => new Date(a.modified_time) < new Date(b.modified_time) ? a : b); items.forEach(i => { if (i.id !== keep.id) S.sel.add(i.id); }); }); _render(); _updateStat(); };
    UI.cols.forEach(c => c.onclick = () => { const k = c.dataset.k; if (S.sort === k) S.dir *= -1; else { S.sort = k; S.dir = 1; } refresh(); });

    // ── 필터 패널 토글 ──
    const _updateFilterBadge = () => {
        const n = countActiveFilters(S.filter);
        const existing = UI.filterToggle.querySelector('.pk-filter-badge');
        if (existing) existing.remove();
        if (S.filterActive && n > 0) {
            const badge = document.createElement('span');
            badge.className = 'pk-filter-badge'; badge.textContent = n;
            UI.filterToggle.appendChild(badge);
        }
    };
    const _initFilterPanel = () => {
        UI.filterArea.innerHTML = createFilterPanelHTML(L, S.filter);
        const panel = UI.filterArea.querySelector('.pk-filter-panel');
        panel.classList.add('open');
        panel.querySelectorAll('.pk-filter-chip').forEach(ch => {
            ch.onclick = () => ch.classList.toggle('active');
        });
        panel.querySelector('#pk-filter-apply').onclick = () => {
            S.filter = readFilterFromPanel(panel);
            S.filterActive = countActiveFilters(S.filter) > 0;
            _updateFilterBadge();
            refresh();
        };
        panel.querySelector('#pk-filter-reset').onclick = () => {
            S.filter = { ...DEFAULT_FILTER };
            S.filterActive = false;
            _updateFilterBadge();
            _initFilterPanel();
            refresh();
        };
    };
    UI.filterToggle.onclick = () => {
        let panel = UI.filterArea.querySelector('.pk-filter-panel');
        if (panel) {
            panel.classList.toggle('open');
            return;
        }
        _initFilterPanel();
    };
    UI.chkAll.onclick = (e) => { if (e.target.checked) S.display.forEach(i => S.sel.add(i.id)); else S.sel.clear(); _render(); _updateStat(); };
    UI.btnBack.onclick = goBack; UI.btnFwd.onclick = goForward; UI.btnRefresh.onclick = () => load();
    UI.btnNewFolder.onclick = async () => { const name = await showPrompt(L.msg_newfolder_prompt, ''); if (!name) return; const cur = S.path[S.path.length - 1]; try { await fetch('https://api-drive.mypikpak.com/drive/v1/files', { method: 'POST', headers: getHeaders(), body: JSON.stringify({ kind: 'drive#folder', parent_id: cur.id || '', name: name }) }); load(); } catch (e) { showAlert('Error: ' + e.message); } };
    UI.btnCopy.onclick = () => { if (S.sel.size === 0) return; S.clipItems = Array.from(S.sel); S.clipType = 'copy'; S.clipSourceParentId = S.path[S.path.length - 1].id || ''; UI.btnPaste.disabled = false; showToast(L.msg_copy_done); };
    UI.btnCut.onclick = () => { if (S.sel.size === 0) return; S.clipItems = Array.from(S.sel); S.clipType = 'move'; S.clipSourceParentId = S.path[S.path.length - 1].id || ''; UI.btnPaste.disabled = false; showToast(L.msg_cut_done); };
    UI.btnPaste.onclick = async () => { if (!S.clipItems || S.clipItems.length === 0) { showAlert(L.msg_paste_empty); return; } setLoad(true); const dest = S.path[S.path.length - 1].id || ''; if (S.clipSourceParentId === dest) { showAlert(L.msg_paste_same_folder); setLoad(false); return; } const ids = S.clipItems.slice(); const endpoint = S.clipType === 'move' ? 'https://api-drive.mypikpak.com/drive/v1/files:batchMove' : 'https://api-drive.mypikpak.com/drive/v1/files:batchCopy'; try { await fetch(endpoint, { method: 'POST', headers: getHeaders(), body: JSON.stringify({ ids: ids, to: { parent_id: dest } }) }); S.clipItems = []; S.clipType = ''; UI.btnPaste.disabled = true; await sleep(500); setLoad(false); await load(); } catch (e) { showAlert('Paste error: ' + e.message); setLoad(false); } };
    UI.btnRename.onclick = async () => { if (S.sel.size !== 1) return; const id = Array.from(S.sel)[0]; const item = S.items.find(i => i.id === id); if (!item) return; const m = showModal(`<h3>${L.modal_rename_title}</h3><div class="pk-field"><input type="text" id="rn_new_name" value="${esc(item.name)}"></div><div class="pk-modal-act"><button class="pk-btn" id="rn_cancel">${L.btn_cancel}</button><button class="pk-btn pri" id="rn_confirm">${L.btn_confirm}</button></div>`); const inp = m.querySelector('#rn_new_name'); inp.focus(); if (item.kind !== 'drive#folder' && item.name.lastIndexOf('.') > 0) inp.setSelectionRange(0, item.name.lastIndexOf('.')); else inp.select(); const doRename = async () => { const newName = inp.value.trim(); if (!newName || newName === item.name) { m.remove(); return; } if (S.items.some(i => i.name === newName)) { showAlert(L.msg_name_exists.replace('{n}', newName)); return; } m.remove(); try { setLoad(true); await apiAction(`/${id}`, { name: newName }); await sleep(200); setLoad(false); load(); } catch (e) { showAlert("Error: " + e.message); setLoad(false); } }; m.querySelector('#rn_cancel').onclick = () => m.remove(); m.querySelector('#rn_confirm').onclick = doRename; inp.onkeydown = (e) => { if (e.key === 'Enter') doRename(); if (e.key === 'Escape') { m.remove(); e.stopPropagation(); } }; };
    UI.btnBulkRename.onclick = () => { if (S.sel.size < 2) return; const m = showModal(`<h3>${L.modal_rename_multi_title}</h3><div class="pk-field"><label><input type="radio" name="rn_mode" value="pattern" checked> ${L.label_pattern}</label><input type="text" id="rn_pattern" value="Video {n}" placeholder="Video {n}"></div><div class="pk-field" style="margin-top:10px"><label><input type="radio" name="rn_mode" value="replace"> ${L.label_replace} <span style="font-size:11px;color:#888">${L.label_replace_note}</span></label><input type="text" id="rn_find" placeholder="${L.placeholder_find}" disabled><input type="text" id="rn_rep" placeholder="${L.placeholder_replace}" disabled></div><div class="pk-modal-act"><button class="pk-btn" id="rn_cancel">${L.btn_cancel}</button><button class="pk-btn pri" id="rn_preview">${L.btn_preview}</button></div>`); const radios = m.querySelectorAll('input[name="rn_mode"]'); const inpPattern = m.querySelector('#rn_pattern'); const inpFind = m.querySelector('#rn_find'); const inpRep = m.querySelector('#rn_rep'); radios.forEach(r => r.onchange = () => { const isPat = r.value === 'pattern'; inpPattern.disabled = !isPat; inpFind.disabled = isPat; inpRep.disabled = isPat; }); m.querySelector('#rn_cancel').onclick = () => m.remove(); m.querySelector('#rn_preview').onclick = () => { const mode = m.querySelector('input[name="rn_mode"]:checked').value; const pattern = inpPattern.value; const findStr = inpFind.value; const repStr = inpRep.value || ''; let idx = 1; const changes = []; const existingNames = new Set(S.items.map(i => i.name)); for (const id of S.sel) { const item = S.items.find(x => x.id === id); if (!item) continue; let base = item.name; let ext = ""; if (item.kind !== 'drive#folder' && item.name.lastIndexOf('.') > 0) { base = item.name.substring(0, item.name.lastIndexOf('.')); ext = item.name.substring(item.name.lastIndexOf('.')); } let newBase = base; if (mode === 'pattern') { if (pattern) newBase = pattern.replace(/\{n\}/g, idx++); } else { if (findStr && base.includes(findStr)) newBase = base.split(findStr).join(repStr); } const finalName = newBase + ext; if (finalName !== item.name) { if (existingNames.has(finalName)) { showAlert(L.msg_name_exists.replace('{n}', finalName)); return; } changes.push({ id: item.id, old: item.name, new: finalName }); } } m.remove(); if (changes.length === 0) { showAlert("No changes detected."); return; } let rowsHtml = changes.map(c => `<div class="pk-prev-row"><div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(c.old)}</div><div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--pk-pri)">${esc(c.new)}</div></div>`).join(''); const p = showModal(`<h3>${L.modal_preview_title} (${changes.length})</h3><div class="pk-prev-list"><div class="pk-prev-row" style="font-weight:bold;background:#eee"><div>${L.col_old}</div><div>${L.col_new}</div></div>${rowsHtml}</div><div class="pk-modal-act"><button class="pk-btn" id="pr_cancel">${L.btn_cancel}</button><button class="pk-btn pri" id="pr_confirm">${L.btn_confirm}</button></div>`); p.querySelector('#pr_cancel').onclick = () => p.remove(); p.querySelector('#pr_confirm').onclick = async () => { setLoad(true); let count = 0; try { for (const c of changes) { await apiAction(`/${c.id}`, { name: c.new }); count++; await sleep(50); } showAlert(L.msg_bulkrename_done.replace('{n}', count)); load(); } catch (e) { showAlert("Rename Error: " + e.message); } finally { setLoad(false); p.remove(); } }; }; };
    UI.btnExt.onclick = async () => { const player = gmGet('pk_ext_player', 'system'); const files = await getLinks(); if (!files || files.length === 0) { showAlert(L.msg_download_fail); return; } if (S.sel.size > 1) { let m3u = '#EXTM3U\n'; files.forEach(f => { m3u += `#EXTINF:-1,${f.name}\n${f.web_content_link}\n`; }); const blob = new Blob([m3u], { type: 'audio/x-mpegurl' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `pikpak_playlist_${Date.now()}.m3u`; a.click(); showAlert(L.msg_batch_m3u); } else { const f = files[0]; if (player === 'system') window.open(f.web_content_link, '_blank'); else window.open((player === 'potplayer' ? 'potplayer://' : 'vlc://') + f.web_content_link, '_self'); } };
    UI.btnIdm.onclick = async () => { const files = await getLinks(); if (!files || files.length === 0) { showAlert(L.msg_download_fail); return; } if (S.sel.size > 1) { let ef2 = ''; files.forEach(f => { ef2 += `<\r\n${f.web_content_link}\r\nfilename=${f.name}\r\n>\r\n`; }); const blob = new Blob([ef2], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `pikpak_idm_${Date.now()}.ef2`; a.click(); showAlert(L.msg_batch_ef2); } else { window.open(files[0].web_content_link, '_blank'); } };
    UI.win.querySelector('#pk-down').onclick = async () => { const files = await getLinks(); if (!files || files.length === 0) { showAlert(L.msg_download_fail); return; } for (const f of files) { const a = document.createElement('a'); a.href = f.web_content_link; document.body.appendChild(a); a.click(); a.remove(); await sleep(200); } };
    UI.win.querySelector('#pk-aria2').onclick = async () => { const files = await getLinks(); if (!files.length) { showAlert(L.msg_download_fail); return; } const ariaUrl = gmGet('pk_aria2_url', 'ws://localhost:6800/jsonrpc'); const ariaToken = gmGet('pk_aria2_token', ''); const payload = files.map(f => ({ jsonrpc: '2.0', method: 'aria2.addUri', id: f.id, params: [`token:${ariaToken}`, [f.web_content_link], { out: f.name }] })); try { await fetch(ariaUrl, { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } }); showAlert(L.msg_aria2_sent.replace('{n}', files.length)); } catch (e) { showAlert('Aria2 Error. Check Settings.'); } };
    UI.btnDel.onclick = async () => { if (!S.sel.size) return; if (await showConfirm(L.warn_del.replace('{n}', S.sel.size))) { await fetch(`https://api-drive.mypikpak.com/drive/v1/files:batchTrash`, { method: 'POST', headers: getHeaders(), body: JSON.stringify({ ids: Array.from(S.sel) }) }); await sleep(500); if (!S.scanning) load(); else { S.items = S.items.filter(i => !S.sel.has(i.id)); refresh(); } } };
    UI.btnDeselect.onclick = () => { S.sel.clear(); refresh(); };
    if (UI.btnViewToggle) {
        UI.btnViewToggle.onclick = () => {
            S.view = S.view === 'list' ? 'grid' : 'list';
            gmSet('pk_view_mode', S.view);
            UI.btnViewToggle.innerHTML = S.view === 'list' ? CONF.icons.grid_view : CONF.icons.list_view;
            UI.btnViewToggle.title = S.view === 'list' ? L.btn_view_grid : L.btn_view_list;
            if (UI.gridZoom) UI.gridZoom.style.display = S.view === 'grid' ? 'inline-block' : 'none';
            _render();
        };
    }
    if (UI.gridZoom) {
        UI.gridZoom.oninput = (e) => {
            S.gridZoom = parseInt(e.target.value, 10);
            gmSet('pk_grid_zoom', S.gridZoom.toString());
            syncState(S);
            renderGrid();
        };
    }
    if (UI.btnLinkCopy) { UI.btnLinkCopy.onclick = async () => { if (S.sel.size === 0) { showToast(L.msg_no_selection || "선택된 항목이 없습니다."); return; } setLoad(true); try { const links = await getLinks(); if (!links.length) { showToast(L.msg_download_fail); return; } const text = links.map(f => f.web_content_link).join('\n'); if (typeof GM_setClipboard !== 'undefined') { GM_setClipboard(text); } else { await navigator.clipboard.writeText(text); } showToast(L.msg_link_copied.replace('{n}', links.length)); } catch (e) { console.error(e); showToast("복사 실패"); } finally { setLoad(false); } }; }
    UI.btnSettings.onclick = () => { const curLang = gmGet('pk_lang', lang); const curPlayer = gmGet('pk_ext_player', 'system'); const curAriaUrl = gmGet('pk_aria2_url', ''); const curAriaToken = gmGet('pk_aria2_token', ''); const curFoldersFirst = S.foldersFirst; const m = showModal(`<h3>${L.modal_settings_title}<div style="font-size:11px;color:#888;font-weight:normal;margin-top:4px;">PikPak File Manager v${version}</div></h3><div class="pk-field"><label>${L.label_lang}</label><select id="set_lang"><option value="ko" ${curLang === 'ko' ? 'selected' : ''}>한국어</option><option value="en" ${curLang === 'en' ? 'selected' : ''}>English</option><option value="ja" ${curLang === 'ja' ? 'selected' : ''}>日本語</option><option value="zh" ${curLang === 'zh' ? 'selected' : ''}>中文 (简体)</option></select></div><div class="pk-field"><label>${L.label_player}</label><select id="set_player"><option value="system" ${curPlayer === 'system' ? 'selected' : ''}>System Default</option><option value="potplayer" ${curPlayer === 'potplayer' ? 'selected' : ''}>PotPlayer</option><option value="vlc" ${curPlayer === 'vlc' ? 'selected' : ''}>VLC Player</option></select></div><div class="pk-field" style="flex-direction:row;align-items:center;gap:8px;"><input type="checkbox" id="set_folders_first" ${curFoldersFirst ? 'checked' : ''}><label for="set_folders_first" style="cursor:pointer;user-select:none;">${L.label_folders_first}</label></div><div class="pk-field"><label>${L.label_aria2_url}</label><input type="text" id="set_aria_url" value="${esc(curAriaUrl)}" placeholder="ws://localhost:6800/jsonrpc"></div><div class="pk-field"><label>${L.label_aria2_token}</label><input type="password" id="set_aria_token" value="${esc(curAriaToken)}" placeholder="Empty"></div><div class="pk-modal-act"><button class="pk-btn" id="set_cancel">${L.btn_cancel}</button><button class="pk-btn pri" id="set_save">${L.btn_save}</button></div><div class="pk-credit"><b>제작: 브랜뉴(poihoii)</b><br><a href="https://github.com/poihoii/PikPak_FileManager" target="_blank">https://github.com/poihoii/PikPak_FileManager</a></div>`); m.querySelector('#set_cancel').onclick = () => m.remove(); m.querySelector('#set_save').onclick = async () => { const newUrl = m.querySelector('#set_aria_url').value.trim(); const newToken = m.querySelector('#set_aria_token').value.trim(); const newFoldersFirst = m.querySelector('#set_folders_first').checked; const saveBtn = m.querySelector('#set_save'); gmSet('pk_folders_first', newFoldersFirst ? 'true' : 'false'); S.foldersFirst = newFoldersFirst; if (!newUrl && !newToken) { gmSet('pk_lang', m.querySelector('#set_lang').value); gmSet('pk_ext_player', m.querySelector('#set_player').value); gmSet('pk_aria2_url', ''); gmSet('pk_aria2_token', ''); showAlert(L.msg_settings_saved).then(() => location.reload()); return; } saveBtn.disabled = true; saveBtn.textContent = "..."; try { const payload = { jsonrpc: '2.0', method: 'aria2.getVersion', id: 'pk_test', params: [`token:${newToken}`] }; let testUrl = newUrl || "ws://localhost:6800/jsonrpc"; let fetchUrl = testUrl; if (fetchUrl.startsWith('ws')) fetchUrl = fetchUrl.replace('ws', 'http'); const res = await fetch(fetchUrl, { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } }); if (!res.ok) throw new Error('Network Error'); const data = await res.json(); if (data.error) throw new Error(data.error.message); gmSet('pk_lang', m.querySelector('#set_lang').value); gmSet('pk_ext_player', m.querySelector('#set_player').value); gmSet('pk_aria2_url', newUrl); gmSet('pk_aria2_token', newToken); await showAlert(L.msg_settings_saved); location.reload(); } catch (e) { console.error(e); showAlert(L.msg_aria2_check_fail); saveBtn.disabled = false; saveBtn.textContent = L.btn_save; } }; };

    // ── 컨텍스트 메뉴 ──
    const ctx = el.querySelector('#pk-ctx');
    ctx.querySelector('#ctx-open').onclick = () => { ctx.style.display = 'none'; const id = Array.from(S.sel)[0]; const item = S.items.find(i => i.id === id); if (item) { if (item.kind === 'drive#folder') { S.history.push({ path: [...S.path] }); S.path.push({ id: item.id, name: item.name }); S.forward = []; load(); } else if (item.mime_type?.startsWith('video')) playVideo(item); } };
    ctx.querySelector('#ctx-down').onclick = () => { ctx.style.display = 'none'; UI.win.querySelector('#pk-down').click(); };
    ctx.querySelector('#ctx-copy').onclick = () => { ctx.style.display = 'none'; UI.btnCopy.click(); };
    ctx.querySelector('#ctx-cut').onclick = () => { ctx.style.display = 'none'; UI.btnCut.click(); };
    ctx.querySelector('#ctx-rename').onclick = () => { ctx.style.display = 'none'; UI.btnRename.click(); };
    ctx.querySelector('#ctx-del').onclick = () => { ctx.style.display = 'none'; UI.btnDel.click(); };
    UI.btnClose.addEventListener('click', () => { el.remove(); document.removeEventListener('keydown', keyHandler); document.removeEventListener('mouseup', mouseHandler); });

    _updateStat();
    load();
}
;// ./src/index.js
// src/index.js — 진입점 + 페이지 주입 로직



console.log("🚀 PikPak Script: LOADED from index.js");

function tryInject() {
    console.log("🚀 PikPak Script: Attempting inject...");
    if (document.getElementById('pk-launch')) { console.log("🚀 PikPak Script: Already injected."); return; }
    if (!document.body) { console.log("🚀 PikPak Script: Body not ready, retrying..."); setTimeout(tryInject, 500); return; }
    inject();
    console.log("🚀 PikPak Script: INJECT SUCCESS!");
}

function inject() {
    if (document.getElementById('pk-launch')) return;
    const b = document.createElement('button'); b.id = 'pk-launch';
    b.style.cssText = `position:fixed;bottom:20px;right:20px;width:50px;height:50px;border-radius:50%;background:#1a5eff;border:none;cursor:pointer;z-index:2147483647;box-shadow:0 4px 12px rgba(0,0,0,0.3);padding:0;overflow:hidden;transition:transform 0.1s;display:flex!important;align-items:center!important;justify-content:center!important;`;
    b.innerHTML = `<svg width="60%" height="60%" viewBox="0 0 238 200" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M0 0 C1.82724609 0.01353516 1.82724609 0.01353516 3.69140625 0.02734375 C4.59761719 0.03894531 5.50382812 0.05054688 6.4375 0.0625 C5.95097979 7.11704304 4.33696858 12.90149479 1.6875 19.4375 C1.35234375 20.32566406 1.0171875 21.21382812 0.671875 22.12890625 C0.3315625 22.98097656 -0.00875 23.83304688 -0.359375 24.7109375 C-0.66198242 25.47583496 -0.96458984 26.24073242 -1.27636719 27.02880859 C-3.01571023 29.77913653 -4.60880008 30.70366989 -7.5625 32.0625 C-10.93383789 32.72265625 -10.93383789 32.72265625 -14.78515625 33.125 C-15.47874237 33.20142731 -16.17232849 33.27785461 -16.88693237 33.3565979 C-18.36660067 33.51855298 -19.84685768 33.67520381 -21.3276062 33.82696533 C-25.19232303 34.22318595 -29.05286739 34.65697538 -32.9140625 35.0859375 C-33.67180466 35.16903168 -34.42954681 35.25212585 -35.21025085 35.33773804 C-40.99791882 35.97875931 -46.74864414 36.77615252 -52.5 37.6875 C-61.81496788 39.10080547 -71.19269316 40.07620454 -80.5625 41.0625 C-19.8425 41.0625 40.8775 41.0625 103.4375 41.0625 C91.8875 39.7425 80.3375 38.4225 68.4375 37.0625 C63.8175 36.4025 59.1975 35.7425 54.4375 35.0625 C49.17221542 34.42736314 43.90722683 33.79696512 38.63671875 33.20703125 C37.62996094 33.08714844 36.62320313 32.96726563 35.5859375 32.84375 C34.69052246 32.74126953 33.79510742 32.63878906 32.87255859 32.53320312 C30.35601376 32.0467485 28.59527547 31.44037784 26.4375 30.0625 C23.38532266 24.97553776 21.3341425 19.45473677 19.1875 13.9375 C18.91695801 13.25671387 18.64641602 12.57592773 18.36767578 11.87451172 C16.82394482 7.78804812 16.13851057 4.42502757 16.4375 0.0625 C33.20320897 -0.76054389 50.04132 2.04640823 66.578125 4.53515625 C70.96365446 5.13439358 75.35589707 5.627565 79.75488281 6.11669922 C97.85972043 8.13836316 97.85972043 8.13836316 106.6875 9.4375 C107.39487305 9.52700928 108.10224609 9.61651855 108.83105469 9.70874023 C113.96714941 10.51808328 116.87598017 12.31623275 120.4375 16.0625 C121.69830294 18.53927732 122.67025259 20.7202309 123.5625 23.3125 C124.02136126 24.56846882 124.48232815 25.8236702 124.9453125 27.078125 C125.27250149 28.00288179 125.27250149 28.00288179 125.60630035 28.94632053 C126.38750394 31.05750635 126.38750394 31.05750635 127.44002533 32.93062496 C131.07482517 39.83448151 131.00351579 46.31795394 130.95507812 53.99243164 C130.96050802 55.37978344 130.96763552 56.76712947 130.97631836 58.15446472 C130.99445028 61.89829685 130.98752708 65.6416848 130.97480202 69.38552403 C130.96462344 73.31622656 130.97408092 77.24689291 130.98034668 81.17759705 C130.98760817 87.77544941 130.97807403 94.37312221 130.95898438 100.97094727 C130.93720936 108.58452515 130.94427739 116.19767461 130.96629 123.81124216 C130.98447611 130.36524706 130.98698696 136.91912344 130.97653532 143.47314543 C130.97031913 147.38014362 130.96941296 151.2869408 130.98268127 155.19392586 C130.99428653 158.8672447 130.9861299 162.54001414 130.96310425 166.213274 C130.95534421 168.19404482 130.96713242 170.17486244 130.97961426 172.15560913 C130.90049754 180.52230774 129.95755225 186.09535704 124.25390625 192.5234375 C123.51011719 193.15507812 122.76632813 193.78671875 122 194.4375 C121.25878906 195.08460938 120.51757812 195.73171875 119.75390625 196.3984375 C114.7661098 199.98157627 110.22842399 200.35421576 104.22135925 200.32992554 C103.39785408 200.33445665 102.5743489 200.33898776 101.72588903 200.34365618 C98.968488 200.35630894 96.21128426 200.35467924 93.45385742 200.35302734 C91.475975 200.35901206 89.49809491 200.36581748 87.5202179 200.37338257 C82.14823484 200.39105594 76.77631549 200.39573853 71.40430617 200.39701414 C66.91878502 200.39891354 62.4332787 200.40627158 57.94776326 200.41335833 C47.36384951 200.42964512 36.77996977 200.43452703 26.19604492 200.43310547 C15.28118177 200.43190408 4.36651636 200.45300486 -6.54829675 200.4845928 C-15.92170288 200.51075235 -25.29504442 200.52147289 -34.66848677 200.52019465 C-40.26569836 200.51968491 -45.86273424 200.52537507 -51.45990944 200.54655075 C-56.725388 200.56592749 -61.99052314 200.5660613 -67.25601387 200.55151749 C-69.1861191 200.54942757 -71.11624579 200.55414114 -73.04631424 200.5662384 C-75.68641426 200.58171127 -78.32533312 200.57236959 -80.96540833 200.55697632 C-81.72466655 200.56726344 -82.48392478 200.57755057 -83.26619083 200.58814943 C-90.327556 200.49750269 -96.39704041 197.82485418 -101.375 192.75 C-102.18904297 191.95142578 -102.18904297 191.95142578 -103.01953125 191.13671875 C-108.29053612 184.05088689 -108.01804154 177.09915158 -108.0300293 168.55004883 C-108.04229625 167.18245883 -108.05575106 165.81487905 -108.07029724 164.4473114 C-108.10523797 160.74401042 -108.12059214 157.04088761 -108.13013434 153.33744264 C-108.13673436 151.01403475 -108.14708893 148.69067299 -108.15863991 146.36728477 C-108.19836069 138.23287671 -108.22038571 130.09860956 -108.22827148 121.96411133 C-108.23610728 114.43116961 -108.28516577 106.89925647 -108.35333699 99.36664182 C-108.41007964 92.86514961 -108.43519788 86.36399446 -108.43721896 79.86225718 C-108.43904166 75.9947118 -108.45309089 72.1282487 -108.50003624 68.26096535 C-108.72797687 48.29049317 -107.52961567 30.83210742 -95.5625 14.0625 C-92.23797604 10.732487 -88.44904231 10.20048941 -83.953125 9.5 C-83.20613342 9.37633057 -82.45914185 9.25266113 -81.68951416 9.12524414 C-74.04584045 7.901492 -66.3645662 7.06662299 -58.66394043 6.29776001 C-54.62860447 5.8940274 -50.59547976 5.46951727 -46.5625 5.04296875 C-45.77776306 4.96008102 -44.99302612 4.8771933 -44.18450928 4.79179382 C-36.33754684 3.9513441 -28.53467892 2.87051571 -20.734375 1.67578125 C-13.79617508 0.63078847 -7.03103815 -0.06826251 0 0 Z M-37.4375 87.4375 C-41.76814335 92.78711826 -40.78388874 98.21215336 -40.8125 104.875 C-40.833125 106.06416016 -40.85375 107.25332031 -40.875 108.47851562 C-40.88015625 109.62642578 -40.8853125 110.77433594 -40.890625 111.95703125 C-40.8999707 113.00737549 -40.90931641 114.05771973 -40.91894531 115.13989258 C-40.50704184 118.51721889 -39.58167158 120.34513508 -37.5625 123.0625 C-33.8251144 125.5540904 -31.98918417 125.52043285 -27.5625 125.0625 C-24.80920979 123.26687595 -23.03622539 122.00995078 -21.5625 119.0625 C-21.2630429 114.46407809 -21.28436362 109.85701583 -21.25 105.25 C-21.20649414 103.32317383 -21.20649414 103.32317383 -21.16210938 101.35742188 C-21.15373047 100.11927734 -21.14535156 98.88113281 -21.13671875 97.60546875 C-21.12213623 96.47133545 -21.10755371 95.33720215 -21.0925293 94.16870117 C-21.66318532 90.39703539 -22.92773916 88.76654018 -25.5625 86.0625 C-30.04892468 83.81928766 -33.65294159 84.31112566 -37.4375 87.4375 Z M45.4375 89.0625 C43.16309531 93.61130937 44.11732026 99.81887268 44.0625 104.8125 C44.02511719 106.08867188 43.98773438 107.36484375 43.94921875 108.6796875 C43.6563417 116.25277258 43.6563417 116.25277258 46.7109375 122.91015625 C50.0632924 125.55649945 51.41007501 125.90713502 55.50390625 125.58984375 C58.83921214 124.68021487 60.4149221 122.75927054 62.4375 120.0625 C64.03299443 115.26404894 63.62174204 110.1852134 63.625 105.1875 C63.64336914 103.71603516 63.64336914 103.71603516 63.66210938 102.21484375 C63.77173933 93.57358621 63.77173933 93.57358621 59.75 86.1875 C54.0132506 83.39664894 49.78182352 84.71817648 45.4375 89.0625 Z M-18.5625 155.0625 C-20.89546251 157.88967213 -20.89546251 157.88967213 -20.3125 161.125 C-19.8031756 164.161959 -19.8031756 164.161959 -17.5625 166.0625 C-15.5023267 166.81656896 -13.41368556 167.49416461 -11.3125 168.125 C-10.19359375 168.46660156 -9.0746875 168.80820313 -7.921875 169.16015625 C-1.62436639 170.85169635 4.26860909 171.24487637 10.75 171.25 C11.9555957 171.26836914 11.9555957 171.26836914 13.18554688 171.28710938 C21.14907742 171.30632948 28.31945463 169.57146397 35.875 167.125 C36.88433594 166.80660156 37.89367187 166.48820313 38.93359375 166.16015625 C41.73511224 165.200361 41.73511224 165.200361 43.4375 162.0625 C43.1133631 158.74009676 42.82973697 157.45473697 40.4375 155.0625 C35.63637087 154.61062902 31.50016124 155.74460874 26.9375 157.0625 C14.69655136 160.31686985 0.092469 160.8899845 -11.5625 155.0625 C-15.0625 154.72916667 -15.0625 154.72916667 -18.5625 155.0625 Z " fill="#FDFDFD" transform="translate(107.5625,-0.0625)"/></svg>`;
    const savedLeft = gmGet('pk_pos_left', null);
    const savedTop = gmGet('pk_pos_top', null);
    if (savedLeft !== null && savedTop !== null) { b.style.bottom = 'auto'; b.style.right = 'auto'; b.style.left = savedLeft; b.style.top = savedTop; }
    let isDragging = false, dragStartX, dragStartY;
    b.onmousedown = (e) => {
        isDragging = false; dragStartX = e.clientX; dragStartY = e.clientY;
        const rect = b.getBoundingClientRect();
        b.style.bottom = 'auto'; b.style.right = 'auto'; b.style.left = rect.left + 'px'; b.style.top = rect.top + 'px'; b.style.transition = 'none';
        const offsetX = e.clientX - rect.left, offsetY = e.clientY - rect.top;
        const onMove = (em) => { if (!isDragging && (Math.abs(em.clientX - dragStartX) > 3 || Math.abs(em.clientY - dragStartY) > 3)) isDragging = true; if (isDragging) { b.style.left = (em.clientX - offsetX) + 'px'; b.style.top = (em.clientY - offsetY) + 'px'; } };
        const onUp = () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); b.style.transition = 'transform 0.1s'; if (!isDragging) openManager(); else { gmSet('pk_pos_left', b.style.left); gmSet('pk_pos_top', b.style.top); } };
        document.addEventListener('mousemove', onMove); document.addEventListener('mouseup', onUp);
    };
    document.body.appendChild(b);
    console.log("🚀 Button Created!");
}

const startObserver = () => {
    if (!document.body) return;
    const obs = new MutationObserver(() => { if (!document.getElementById('pk-launch')) tryInject(); });
    obs.observe(document.body, { childList: true, subtree: true });
};

if (document.readyState === 'loading') { window.addEventListener('DOMContentLoaded', () => { tryInject(); startObserver(); }); }
else { tryInject(); startObserver(); }

/******/ })()
;