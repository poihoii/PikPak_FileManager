export default {
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
    msg_link_copied: "已复制 {n} 个链接。"
};