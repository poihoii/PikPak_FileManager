export default {
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
    msg_link_copied: "Copied {n} links."
};