const T = {
    ko: {
        title: "PikPak File Manager",
        col_name: "파일명", col_size: "크기", col_dur: "길이", col_date: "업로드 일자",
        btn_scan: "구조 평면화", tip_scan: "모든 하위 폴더의 파일을 꺼내옵니다",
        btn_stop: "중지", tip_stop: "작업 중지",
        btn_dup: "중복 검색", tip_dup: "현재 목록에서 중복된 동영상 파일을 검색합니다.",
        status_ready: "준비됨 ({n}개 항목)", status_scanning: "수집 중... {n}개 (현재: {f})",
        msg_no_files: "표시할 항목이 없습니다.",
        warn_del: "선택한 {n}개 항목을 휴지통으로 이동하시겠습니까?",
        btn_down: "웹 다운로드", tip_down: "브라우저 기본 다운로드",
        btn_aria2: "Aria2 전송", tip_aria2: "Aria2 RPC로 다운로드 요청 전송",
        btn_idm: "IDM 직접 연결", tip_idm: "IDM 내보내기 파일(.ef2) 생성",
        btn_ext: "외부 플레이어", tip_ext: "PotPlayer/VLC 등으로 재생 (설정 필요)",
        loading: "잠시만 기다려주세요...",
        loading_detail: "PikPak 서버에서 파일 정보를 받아오고 있어요...",
        loading_fetch: "숨겨진 파일까지 꼼꼼히 찾는 중이에요... ({n}개 발견)",
        loading_dup: "중복된 파일이 있는지 확인하고 있어요... ({p}%)",
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
        btn_save: "저장",

        // 검색 및 도움말
        placeholder_search: "파일명 검색...",
        tip_search: "지금 보고 계신 목록에서 파일을 바로 찾아드려요",
        btn_help: "도움말", tip_help: "사용법 및 단축키 안내",
        modal_help_title: "무엇을 도와드릴까요?",
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
</div>`
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
        modal_settings_title: "Settings", label_lang: "Language", label_player: "Player", label_aria2_url: "Aria2 URL", label_aria2_token: "Token", btn_save: "Save",

        placeholder_search: "Search files...",
        tip_search: "Search files (Filter current list)",
        btn_help: "Help", tip_help: "Shortcuts & Usage",
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
</div>`
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
        modal_settings_title: "設定", label_lang: "言語 (Language)", label_player: "外部プレーヤー", label_aria2_url: "Aria2 URL", label_aria2_token: "トークン", btn_save: "保存",

        placeholder_search: "検索...",
        tip_search: "検索 (現在のリスト内)",
        btn_help: "ヘルプ", tip_help: "ショートカットと使い方",
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
</div>`
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
        modal_settings_title: "设置", label_lang: "语言 (Language)", label_player: "外部播放器", label_aria2_url: "Aria2 地址", label_aria2_token: "Token", btn_save: "保存",

        placeholder_search: "搜索文件...",
        tip_search: "搜索 (筛选当前列表)",
        btn_help: "帮助", tip_help: "快捷键与使用说明",
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
</div>`
    }
};

export function getLang() {
    const userLang = GM_getValue('pk_lang', '');
    return userLang ? userLang : (navigator.language.startsWith('ko') ? 'ko' : 'en');
}

export function getStrings() {
    return T[getLang()] || T.en;
}