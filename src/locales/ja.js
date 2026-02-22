export default {
    title: "PikPak ファイルマネージャー",
    col_name: "名前", col_size: "サイズ", col_dur: "時間", col_date: "更新日",

    btn_scan: "構造平坦化", tip_scan: "サブフォルダー内の全ファイルを現在のリストに移動します。",
    btn_stop: "停止", tip_stop: "現在の作業（検索、収集など）を即座に停止します。",
    btn_dup: "重複検索", tip_dup: "現在のリストから重複した動画ファイルを検索して整理します。",

    status_ready: "準備完了 ({n} 項目)", status_scanning: "🔍 発見: {n} (全体 {s} をスキャン中...)\n📂 現在 \"{f}\" フォルダを探索中...",
    msg_no_files: "項目がありません。",
    warn_del: "選択した {n} 項目をゴミ箱に移動しますか？",

    btn_down: "ダウンロード", tip_down: "ブラウザの標準機能を使用してファイルをダウンロードします。",
    btn_aria2: "Aria2", tip_aria2: "設定されたAria2 RPCサーバーへダウンロード要求を送信します。",
    btn_idm: "IDM", tip_idm: "IDM (Internet Download Manager) 用のエクスポートファイル (.ef2) を作成します。",
    btn_ext: "外部再生", tip_ext: "PotPlayerやVLCなどの外部プレーヤーで再生します（設定が必要）。",

    loading: "読み込み中...", loading_detail: "ファイルリストを取得中...",
    loading_fetch: "🔍 発見: {n} (慎重に探索中...)", loading_dup: "重複分析中... ({p}%)",
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

    ctx_open: "開く / 再生", ctx_rename: "名前変更", ctx_copy: "コピー", ctx_cut: "切り取り", ctx_del: "削除", ctx_down: "ダウンロード", ctx_ext_play: "外部プレーヤーで開く",
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
    tip_search: "現在のリストから検索します。",
    tip_search_global: "キーワードを入力して Enter を押すと、クラウド全体から検索します。",
    btn_help: "ヘルプ", tip_help: "ショートカットと使い方を表示します。",
    modal_help_title: "ヘルプと使い方",
    help_desc: `
<div style="font-size:13px; line-height:1.6; color:var(--pk-fg);">
    <div style="margin-bottom:15px;">
        <b style="font-size:14px; color:var(--pk-pri);">🔍 強力な検索 (Search)</b><br>
        - <b>リスト抽出</b>: 文字を入力すると即座に現在のリストを絞り込みます。<br>
        - <b>全体検索</b>: キーワードを入力して <b>Enter</b> を押すと、クラウド内のすべてのファイルを検索します！
    </div>
    
    <div style="margin-bottom:15px;">
        <b style="font-size:14px; color:var(--pk-pri);">📂 構造平坦化 (Flatten)</b><br>
        - サブフォルダ内のファイルをすべて取得し、一つのリストにまとめて表示します。<br>
        - 作業終了後は「更新 (F5)」を押して元のフォルダ構造に戻してください。
    </div>

    <div style="margin-bottom:15px;">
        <b style="font-size:14px; color:var(--pk-pri);">🧹 重複整理 (Deduplication)</b><br>
        - 名前、サイズ、時間を比較して同じファイルを見つけ出します。<br>
        - サイズや日付で重複ファイルを自動選択し、一括削除して容量を節約できます。
    </div>

    <div style="margin-bottom:15px;">
        <b style="font-size:14px; color:var(--pk-pri);">🖱️ 右クリックメニュー (Context Menu)</b><br>
        - ファイルやフォルダを<b>右クリック</b>すると、クイックメニューが表示されます。<br>
        - ダウンロード、名前変更、切り取り、外部プレーヤー再生などが可能です。
    </div>
    
    <div>
        <b style="font-size:14px; color:var(--pk-pri);">⌨️ 便利なしショートカット</b>
        <table class="pk-help-table">
            <tr><td width="100"><b>F2</b></td><td>名前変更 / 一括変更</td></tr>
            <tr><td><b>F5</b></td><td>リスト更新 (表示リセット)</td></tr>
            <tr><td><b>F8</b></td><td>新規フォルダ作成</td></tr>
            <tr><td><b>Del</b></td><td>選択項目をゴミ箱に移動</td></tr>
            <tr><td><b>Ctrl+A</b></td><td>全選択</td></tr>
            <tr><td><b>Ctrl+C / X</b></td><td>コピー / 切り取り</td></tr>
            <tr><td><b>Ctrl+V</b></td><td>貼り付け</td></tr>
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
    sidebar_title: "フォルダ構造",
    sidebar_home: "マイドライブ",
    sidebar_loading: "読み込み中...",
    sidebar_empty: "サブフォルダなし",
    drag_move_count: "{n}件移動",
    drag_move_progress: "{n}件のファイルを移動中...",
    drag_move_done: "{n}件のファイルを移動しました",
    drag_move_fail: "移動失敗: {e}",
    drag_move_same: "同じフォルダには移動できません。",

    lbl_sub_size: "字幕サイズ",
    lbl_sub_lang: "翻訳言語",
    lbl_sub_load_local: "ローカル字幕を読み込む",
    lbl_sub_settings: "字幕設定",
    tip_zoom: "ズーム",
    tip_sort: "並び替え基準",
    loading_searching: "ファイルを検索中...",
    lbl_root: "ルート",
};