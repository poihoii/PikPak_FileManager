export default {
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
    msg_link_copied: "{n}개 파일의 주소가 복사되었습니다."
};