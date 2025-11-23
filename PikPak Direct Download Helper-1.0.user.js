// ==UserScript==
// @name         PikPak Direct Download Helper
// @namespace    https://github.com/poihoii/PikPak_DirectDownloadHelper
// @version      1.0
// @description  PIKPAK 웹 버전에서의 직접 다운로드 환경 추가 스크립트
// @author       poihoii
// @match        https://mypikpak.com/*
// @grant        GM_setClipboard
// @run-at       document-end
// @license      MIT
// ==/UserScript==

/*
MIT License

Copyright (c) 2025 poihoii

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
*/

(function () {
  'use strict';

  /* ========= 공통 유틸 ========= */
  const sleep = (ms)=>new Promise(r=>setTimeout(r,ms));
  const esc = (s)=> (s||'').replace(/[&<>"']/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;', "'":'&#39;' }[m]));
  const fmtSize = (n)=>{
    n=parseInt(n||0,10);
    if(!n) return '0 B';
    const u=['B','KB','MB','GB','TB','PB'];
    let i=0;
    while(n>=1024 && i<u.length-1){
      n/=1024; i++;
    }
    return (n<10? n.toFixed(2): n.toFixed(1))+' '+u[i];
  };
  const fmtDate = (t)=> t ? new Date(t).toLocaleDateString() : ''; // 날짜 포맷 깔끔하게 변경
  function toast(msg){
    const el=document.createElement('div');
    Object.assign(el.style,{
      position:'fixed',left:'50%',bottom:'30px',
      transform:'translateX(-50%)',zIndex:10000,
      background:'rgba(30, 41, 59, 0.95)',color:'#fff',
      padding:'10px 20px',borderRadius:'50px',fontSize:'13px',fontWeight:'600',
      boxShadow:'0 10px 25px rgba(0,0,0,0.2)', backdropFilter:'blur(4px)',
      transition:'opacity 0.3s'
    });
    el.textContent=msg;
    document.body.appendChild(el);
    setTimeout(()=>{ el.style.opacity='0'; setTimeout(()=>el.remove(),300) }, 2000);
  }

  /* ========= PikPak API ========= */
  function apiHeaders(){
    let token='', captcha='', deviceId=localStorage.getItem('deviceid')||'';
    for(let i=0;i<localStorage.length;i++){
      const k=localStorage.key(i);
      if(!k) continue;
      if(k.startsWith('credentials')){
        try{ const v=JSON.parse(localStorage.getItem(k)); token=v.token_type+' '+v.access_token; }catch{}
      }
      if(k.startsWith('captcha')){
        try{ const v=JSON.parse(localStorage.getItem(k)); captcha=v.captcha_token; }catch{}
      }
    }
    const h={'Content-Type':'application/json'};
    if(token) h.Authorization = token;
    if(deviceId) h['x-device-id'] = deviceId;
    if(captcha) h['x-captcha-token'] = captcha;
    return h;
  }

  async function apiList(parent_id){
    const url=`https://api-drive.mypikpak.com/drive/v1/files?thumbnail_size=SIZE_MEDIUM&limit=500&parent_id=${parent_id||''}&with_audit=true&filters=%7B%22phase%22%3A%7B%22eq%22%3A%22PHASE_TYPE_COMPLETE%22%7D%2C%22trashed%22%3A%7B%22eq%22%3Afalse%7D%7D`;
    const r=await fetch(url,{headers:apiHeaders()});
    return (await r.json()).files||[];
  }

  async function apiGet(id){
    const r=await fetch(`https://api-drive.mypikpak.com/drive/v1/files/${id}?`,{headers:apiHeaders()});
    return r.json();
  }

  /* ========= UI 스타일 (디자인 리마스터) ========= */
  (function addCSS(){
    if (document.getElementById('ppk-direct-css')) return;
    const s=document.createElement('style'); s.id='ppk-direct-css';
    s.textContent = `
      :root {
        --ppk-primary: #4f46e5;
        --ppk-primary-hover: #4338ca;
        --ppk-bg: #ffffff;
        --ppk-text: #1e293b;
        --ppk-text-sub: #64748b;
        --ppk-border: #e2e8f0;
        --ppk-hover: #f1f5f9;
        --ppk-selected: #eef2ff;
        --ppk-radius: 12px;
        --ppk-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
      }

      /* 모달 컨테이너 */
      .ppk-ov{
        position:fixed;inset:0;background:rgba(15, 23, 42, 0.4);
        backdrop-filter: blur(2px); z-index:10001;
        display:flex;align-items:center;justify-content:center;
        opacity:0; animation:ppkFadeIn 0.2s forwards;
      }
      @keyframes ppkFadeIn{to{opacity:1}}

      .ppk-panel{
        width:min(900px, 92vw); max-height:85vh;
        background:var(--ppk-bg); border-radius:16px;
        box-shadow:var(--ppk-shadow); overflow:hidden;
        display:flex; flex-direction:column; font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        color:var(--ppk-text);
      }

      /* 헤더 */
      .ppk-hd{
        padding:16px 24px; border-bottom:1px solid var(--ppk-border);
        display:flex; justify-content:space-between; align-items:center;
      }
      .ppk-title{font-size:18px; font-weight:700; color:var(--ppk-text);}

      /* 툴바 (필터/정렬) - 디자인 개선 */
      .ppk-bar{
        padding:12px 24px; border-bottom:1px solid var(--ppk-border);
        display:flex; align-items:center; background:#f8fafc; gap:12px;
      }
      .ppk-label-check{
        display:flex; align-items:center; gap:8px; font-weight:600; font-size:14px; cursor:pointer;
        user-select:none; color:var(--ppk-text);
      }
      .ppk-select-group{ margin-left:auto; display:flex; gap:8px; }

      /* 커스텀 셀렉트 박스 스타일 */
      .ppk-select{
        appearance:none; -webkit-appearance:none;
        padding:8px 32px 8px 12px;
        border:1px solid #cbd5e1; border-radius:8px;
        background-color:#fff; font-size:13px; font-weight:500; color:var(--ppk-text);
        cursor:pointer; outline:none; transition:all 0.15s;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
        background-repeat:no-repeat; background-position:right 8px center; background-size:14px;
      }
      .ppk-select:hover{ border-color:var(--ppk-primary); }
      .ppk-select:focus{ border-color:var(--ppk-primary); box-shadow:0 0 0 2px rgba(99, 102, 241, 0.1); }

      /* 리스트 헤더 */
      .ppk-th{
        display:grid; grid-template-columns:40px 1fr 120px 140px;
        padding:12px 24px; background:#fff; border-bottom:1px solid var(--ppk-border);
        font-size:12px; font-weight:700; color:var(--ppk-text-sub); text-transform:uppercase; letter-spacing:0.5px;
      }

      /* 리스트 목록 */
      .ppk-list{ flex:1; overflow-y:auto; overflow-x:hidden; min-height:300px; }

      /* 커스텀 스크롤바 */
      .ppk-list::-webkit-scrollbar { width: 6px; }
      .ppk-list::-webkit-scrollbar-track { background: transparent; }
      .ppk-list::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
      .ppk-list::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

      .ppk-row{
        display:grid; grid-template-columns:40px 1fr 120px 140px;
        padding:10px 24px; border-bottom:1px solid #f1f5f9;
        align-items:center; transition:background 0.1s; cursor:pointer;
        font-size:14px; color:var(--ppk-text);
      }
      .ppk-row:hover{ background:var(--ppk-hover); }
      .ppk-row.selected{ background:var(--ppk-selected); }
      .ppk-row.selected .ppk-name{ color:var(--ppk-primary); font-weight:600; }

      .ppk-name{ display:flex; align-items:center; gap:8px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
      .ppk-icon{ font-size:16px; }
      .ppk-meta{ font-size:13px; color:var(--ppk-text-sub); }

      /* 푸터 & 브레드크럼 */
      .ppk-ft{
        padding:16px 24px; border-top:1px solid var(--ppk-border); background:#fff;
        display:flex; justify-content:space-between; align-items:center;
      }
      .ppk-info-box{ display:flex; flex-direction:column; gap:4px; max-width:60%; }

      .ppk-crumb{ font-size:13px; color:var(--ppk-text-sub); display:flex; gap:6px; align-items:center; }
      .ppk-crumb span{ cursor:pointer; transition:color 0.15s; }
      .ppk-crumb span:hover{ color:var(--ppk-primary); text-decoration:underline; }
      .ppk-crumb span.active{ color:var(--ppk-text); font-weight:600; cursor:default; text-decoration:none; }
      .ppk-crumb-sep{ color:#cbd5e1; font-size:10px; }

      .ppk-stat{ font-size:14px; font-weight:700; color:var(--ppk-primary); }

      /* 버튼 디자인 */
      .ppk-btn-group{ display:flex; gap:8px; }
      .ppk-btn{
        padding:10px 18px; border:none; border-radius:8px;
        font-size:13px; font-weight:600; cursor:pointer;
        transition:all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        display:flex; align-items:center; justify-content:center;
      }
      .ppk-btn:active{ transform:scale(0.97); }
      .ppk-btn-primary{ background:var(--ppk-primary); color:#fff; box-shadow:0 4px 6px -1px rgba(79, 70, 229, 0.2); }
      .ppk-btn-primary:hover{ background:var(--ppk-primary-hover); transform:translateY(-1px); }

      .ppk-btn-success{ background:#10b981; color:#fff; box-shadow:0 4px 6px -1px rgba(16, 185, 129, 0.2); }
      .ppk-btn-success:hover{ background:#059669; transform:translateY(-1px); }

      .ppk-btn-sub{ background:#f1f5f9; color:#475569; }
      .ppk-btn-sub:hover{ background:#e2e8f0; color:#1e293b; }

      /* 반응형 플로팅 버튼 */
      @media (min-width: 980px){ .ppk-webdl-btn { display:inline-flex !important; } .ppk-webdl-fab { display:none !important; } }
      @media (max-width: 979px){ .ppk-webdl-btn { display:none !important; } .ppk-webdl-fab { display:flex !important; } }
      .ppk-webdl-fab{
        position:fixed; right:20px; bottom:90px; z-index:10002;
        width:56px; height:56px; border-radius:50%; border:none;
        background:var(--ppk-primary); color:#fff;
        box-shadow:0 10px 25px rgba(79, 70, 229, 0.4);
        display:flex; align-items:center; justify-content:center;
        cursor:pointer; transition:transform 0.2s;
      }
      .ppk-webdl-fab:hover{ transform:scale(1.1); }
      body.ppk-modal-open .ppk-webdl-fab{ display:none !important; }

      /* 다크모드 (모달 내부만 적용) */
      @media (prefers-color-scheme: dark) {
        :root {
          --ppk-bg: #1e293b; --ppk-text: #f1f5f9; --ppk-text-sub: #94a3b8;
          --ppk-border: #334155; --ppk-hover: #334155; --ppk-selected: #312e81;
        }
        .ppk-ov{ background:rgba(0,0,0,0.6); }
        .ppk-bar, .ppk-th, .ppk-ft { background:#1e293b; } /* 배경 통일 */
        .ppk-row { border-color: #334155; }
        .ppk-select {
          background-color:#0f172a; border-color:#475569; color:#f1f5f9;
        }
        .ppk-btn-sub { background:#334155; color:#cbd5e1; }
        .ppk-btn-sub:hover { background:#475569; color:#fff; }
      }
    `;
    document.head.appendChild(s);
  })();

  /* ========= 사이드바 버튼 (Native Style) ========= */
  async function injectWebBtn(){
    if (document.querySelector('.ppk-webdl-btn')) return true;
    const box=document.querySelector("#app > div.layout > div.main > div.sidebar > div:nth-child(1)");
    if(!box) return false;
    const cloud=box.querySelector('button.el-button.el-button--primary');
    if(!cloud) return false;

    const cs=getComputedStyle(cloud);
    const btn=document.createElement('button');
    btn.type='button';
    btn.className='el-button el-button--primary ppk-webdl-btn';

    // 버튼 스타일: 100% width, 마진 제거, 높이 맞춤
    btn.style.cssText=`
      display:inline-flex; align-items:center; justify-content:center; box-sizing:border-box;
      padding:${cs.paddingTop} ${cs.paddingRight} ${cs.paddingBottom} ${cs.paddingLeft};
      line-height:${cs.lineHeight}; min-width:${cs.minWidth};
      width:${cs.width}; border-radius:${cs.borderRadius};
      margin-top:5px; margin-left:0 !important; font-weight:600 !important;
    `;
    btn.innerHTML=`
      <span style="display:inline-flex;align-items:center;gap:8px;">
        <span class="pp-icon" style="--icon-color:#fff;width:24px;height:24px;margin-right:8px;">
          <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 4v10M8.5 11.5 12 15l3.5-3.5M6 19h12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
        </span>
        <span>다이렉트 다운로드</span>
      </span>`;
    btn.addEventListener('click', openPicker, {capture:true});
    box.insertBefore(btn, cloud.nextSibling);
    return true;
  }

  function createFloatingWebBtn(){
    if (document.querySelector('.ppk-webdl-fab')) return;
    const btn = document.createElement('button');
    btn.className = 'ppk-webdl-fab';
    btn.title = '다이렉트 다운로드';
    btn.innerHTML = `<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>`;
    btn.addEventListener('click', openPicker, { capture:true });
    document.body.appendChild(btn);
  }

  /* ========= 모달 로직 ========= */
  function currentFolderId(){
    let id=location.href.split('/').pop();
    return id==='all' ? '' : id;
  }

  function openPicker(){
    if (document.querySelector('.ppk-ov')) return;
    document.body.classList.add('ppk-modal-open');

    const state = {
      stack: [{id: currentFolderId(), name: 'Home'}],
      cur: currentFolderId(),
      items: [],
      selected: new Set(),
      sortBy: 'name',
      sortDir: 'asc'
    };

    const ov=document.createElement('div'); ov.className='ppk-ov';
    ov.innerHTML=`
      <div class="ppk-panel" role="dialog">
        <div class="ppk-hd">
          <div class="ppk-title">파일 다운로드</div>
          <button class="ppk-btn ppk-btn-sub" id="ppk-test" style="padding:6px 12px;font-size:11px;">API Check</button>
        </div>
        <div class="ppk-bar">
          <label class="ppk-label-check"><input id="ppk-all" type="checkbox"> 전체 선택</label>
          <div class="ppk-select-group">
            <select id="ppk-sort" class="ppk-select">
              <option value="name">이름순</option>
              <option value="size">크기순</option>
              <option value="modified_time">날짜순</option>
            </select>
            <select id="ppk-dir" class="ppk-select">
              <option value="asc">오름차순</option>
              <option value="desc">내림차순</option>
            </select>
          </div>
        </div>
        <div class="ppk-th">
          <div>✓</div><div>이름</div><div>크기</div><div>날짜</div>
        </div>
        <div class="ppk-list" id="ppk-list"></div>
        <div class="ppk-ft">
          <div class="ppk-info-box">
             <div class="ppk-crumb" id="ppk-crumb"></div>
             <div id="ppk-stat" class="ppk-stat">항목을 선택하세요</div>
          </div>
          <div class="ppk-btn-group">
            <button class="ppk-btn ppk-btn-success" id="ppk-copy-links">링크 복사</button>
            <button class="ppk-btn ppk-btn-sub" id="ppk-cancel">취소</button>
            <button class="ppk-btn ppk-btn-primary" id="ppk-go">다운로드</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(ov);

    const elList=ov.querySelector('#ppk-list');
    const elAll=ov.querySelector('#ppk-all');
    const elStat=ov.querySelector('#ppk-stat');
    const elCrumb=ov.querySelector('#ppk-crumb');
    const elSort=ov.querySelector('#ppk-sort');
    const elDir=ov.querySelector('#ppk-dir');
    const elGo=ov.querySelector('#ppk-go');
    const elCopy=ov.querySelector('#ppk-copy-links');
    const elCancel=ov.querySelector('#ppk-cancel');
    const elTest=ov.querySelector('#ppk-test');

    // 이벤트 리스너
    elTest.onclick=async()=>{ try{ await apiList(state.cur); toast('API 연결 정상'); } catch{ toast('API 연결 실패'); } };
    elSort.onchange=()=>{ state.sortBy=elSort.value; renderList(); };
    elDir.onchange=()=>{ state.sortDir=elDir.value; renderList(); };
    elCancel.onclick=()=>{ ov.remove(); document.body.classList.remove('ppk-modal-open'); };
    ov.onclick=e=>{ if(e.target===ov) elCancel.click(); };

    // 리스트 렌더링
    function renderList(){
      elList.innerHTML='';
      // 정렬 로직
      const sb=state.sortBy, sd=state.sortDir;
      state.items.sort((a,b)=>{
        if(a.id==='..') return -1; if(b.id==='..') return 1;
        if(a.kind==='drive#folder' && b.kind!=='drive#folder') return -1;
        if(a.kind!=='drive#folder' && b.kind==='drive#folder') return 1;
        let av=a[sb], bv=b[sb];
        if(sb==='size'){ av=parseInt(av||0,10); bv=parseInt(bv||0,10); }
        if(sb==='modified_time'){ av=new Date(av||0).getTime(); bv=new Date(bv||0).getTime(); }
        if(av>bv) return sd==='asc'?1:-1; if(av<bv) return sd==='asc'?-1:1; return 0;
      });

      // 상위 폴더 버튼
      if(state.stack.length > 1 && !state.items.some(x=>x.id==='..')){
         state.items.unshift({id:'..', kind:'drive#folder', name:'..', size:0});
      }

      for(const it of state.items){
        const isFolder = it.kind==='drive#folder';
        const isParent = it.id === '..';
        const isSel = state.selected.has(it.id);

        const row=document.createElement('div');
        row.className=`ppk-row ${isSel?'selected':''}`;

        let icon = isFolder ? '📁' : '📄';
        if(isParent) icon = '🔙';

        row.innerHTML=`
          <div>${isParent ? '' : `<input type="checkbox" ${isSel?'checked':''}>`}</div>
          <div class="ppk-name">
            <span class="ppk-icon">${icon}</span> <span>${esc(it.name)}</span>
          </div>
          <div class="ppk-meta">${isParent ? '' : (isFolder ? '-' : fmtSize(it.size))}</div>
          <div class="ppk-meta">${isParent ? '' : fmtDate(it.modified_time)}</div>
        `;

        // 행 클릭 이벤트
        row.onclick = async (e) => {
          if(e.target.tagName === 'INPUT') return;
          if(isFolder){
             if(isParent){
                state.stack.pop(); state.cur = state.stack[state.stack.length-1].id;
             } else {
                state.stack.push({id:it.id, name:it.name}); state.cur = it.id;
             }
             await loadAndRender();
          } else {
             if(state.selected.has(it.id)) state.selected.delete(it.id);
             else state.selected.add(it.id);
             renderList();
          }
        };

        const chk = row.querySelector('input');
        if(chk) chk.onclick = (e) => { e.stopPropagation(); if(e.target.checked) state.selected.add(it.id); else state.selected.delete(it.id); renderList(); };
        elList.appendChild(row);
      }

      const realFiles = state.items.filter(x=>x.id!=='..');
      elAll.checked = realFiles.length>0 && realFiles.every(f=>state.selected.has(f.id));
      updateInfo();
    }

    // 하단 정보 & 브레드크럼 업데이트
    function updateInfo(){
      // Stats
      let bytes=0, files=0, folders=0;
      state.items.forEach(f=>{
        if(state.selected.has(f.id)){
           if(f.kind==='drive#folder') folders++;
           else { files++; bytes+=parseInt(f.size||0, 10); }
        }
      });
      if(files===0 && folders===0) elStat.textContent = '다운로드할 항목을 선택해주세요';
      else elStat.innerHTML = `선택: <span style="color:var(--ppk-text)">${files}개 파일</span> (${fmtSize(bytes)}) ${folders?` + 폴더 ${folders}개`:''}`;

      // Breadcrumbs
      elCrumb.innerHTML = '';
      state.stack.forEach((s, idx)=>{
         const span = document.createElement('span');
         span.textContent = s.name;
         if(idx === state.stack.length - 1) span.className = 'active';
         else {
            span.onclick = async () => {
               state.stack = state.stack.slice(0, idx+1);
               state.cur = s.id;
               await loadAndRender();
            };
         }
         elCrumb.appendChild(span);
         if(idx < state.stack.length - 1) {
             const sep = document.createElement('span');
             sep.className='ppk-crumb-sep'; sep.textContent='›';
             elCrumb.appendChild(sep);
         }
      });
    }

    async function loadAndRender(){
      elList.innerHTML = `<div style="padding:40px;text-align:center;color:var(--ppk-text-sub)">데이터를 불러오는 중...</div>`;
      state.selected.clear(); elAll.checked = false;
      try{ state.items = await apiList(state.cur); } catch(e){ state.items=[]; toast('목록 로드 실패'); }
      renderList();
    }

    elAll.onchange = ()=>{
      const realFiles = state.items.filter(x=>x.id!=='..');
      if(elAll.checked) realFiles.forEach(f=>state.selected.add(f.id)); else state.selected.clear();
      renderList();
    };

    /* === 액션 처리 === */
    async function processSelection(action){
      if(state.selected.size===0) { toast('선택된 항목이 없습니다.'); return; }

      const btn = action==='download' ? elGo : elCopy;
      const originText = btn.textContent;
      btn.disabled=true; btn.textContent='처리 중...';

      try{
        const targets = await expandSelection([...state.selected]);
        const fileTargets = targets.filter(f => f.kind !== 'drive#folder');

        if(fileTargets.length === 0) { toast('다운로드할 파일이 없습니다.'); return; }

        let links = [], ok=0, fail=0;

        for(const f of fileTargets){
           try{
             const meta = await apiGet(f.id);
             if(meta.web_content_link){
                if(action==='download'){
                   const a=document.createElement('a');
                   a.href=meta.web_content_link; a.target='_blank';
                   document.body.appendChild(a); a.click(); a.remove();
                   ok++; await sleep(150);
                } else {
                   links.push(meta.web_content_link); ok++;
                }
             } else fail++;
           } catch { fail++; }
        }

        if(action==='copy'){
           if(links.length > 0){ GM_setClipboard(links.join('\n')); toast(`${links.length}개 링크 복사 완료`); }
           else toast('복사 실패');
        } else {
           toast(`완료: ${ok}건 시작`);
           if(ok>0) elCancel.click();
        }
      } catch(e) { toast('오류: ' + e.message); }
      finally { btn.disabled=false; btn.textContent = originText; }
    }

    elGo.onclick = () => processSelection('download');
    elCopy.onclick = () => processSelection('copy');

    async function expandSelection(ids){
      const out=[]; const q=[...ids]; const cache=new Map();
      state.items.forEach(f=>cache.set(f.id, f));
      while(q.length){
        const id=q.shift(); if(id === '..') continue;
        let f = cache.get(id);
        if(!f){ try{ f=await apiGet(id); }catch{} }
        if(!f) continue;
        if(f.kind === 'drive#folder'){
           try{
             const sub = await apiList(f.id);
             sub.forEach(sf => { if(sf.kind === 'drive#folder') q.push(sf.id); else out.push(sf); });
           }catch{}
        } else out.push(f);
      }
      return out;
    }

    loadAndRender();
  }

  /* ========= 부가 기능 (ID 복사 등) ========= */
  function addRowTools(li){
    if(li.dataset._ppkEnh) return; li.dataset._ppkEnh='1';
    const id=li.id;
    const nameSpan=li.querySelector('.name span, .file-name span');
    if(!nameSpan||!id) return;
    const base=(nameSpan.innerText||'').trim().replace(/\.[^/.]+$/,'');

    const mk=(txt,fn)=>{
       const b=document.createElement('button'); b.textContent=txt;
       Object.assign(b.style,{
           border:'1px solid #e2e8f0', borderRadius:'6px', margin:'0 3px',
           cursor:'pointer', fontSize:'11px', background:'#fff', color:'#64748b', padding:'2px 6px'
       });
       b.onmouseenter=()=>b.style.borderColor='#cbd5e1';
       b.onclick=fn; return b;
    };
    const wrap=document.createElement('span'); wrap.style.marginLeft='8px';
    wrap.append(
      mk('🆔', ()=>{GM_setClipboard(id); toast('ID 복사됨');}),
      mk('🔍', ()=>{window.open(`https://www.google.com/search?q=${encodeURIComponent(base)}`,'_blank');})
    );
    nameSpan.parentNode.appendChild(wrap);
  }

  (async function boot(){
    for(let i=0;i<60;i++){ if(await injectWebBtn()) break; await sleep(300); }
    new MutationObserver(injectWebBtn).observe(document.body,{childList:true,subtree:true});
    createFloatingWebBtn();
    setInterval(()=>document.querySelectorAll('li.row').forEach(addRowTools), 1000);
  })();
})();