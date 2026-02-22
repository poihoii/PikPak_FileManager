<!-- markdownlint-disable MD033 MD041 -->
<div align="center">
  <img src="https://raw.githubusercontent.com/poihoii/PikPak_FileManager/refs/heads/main/img/main_screenshot.png" width="100%" alt="PikPak File Manager Main UI">
</div>

<br>

<div>
  <h1><img src="https://raw.githubusercontent.com/poihoii/PikPak_FileManager/refs/heads/main/img/logo%20(200).svg" width="36" style="vertical-align: middle;" alt="Logo"> PikPak File Manager</h1>
  <p><b>An extension script that improves the navigation and management environment of the PikPak web client.</b></p>
  
  <a href="https://github.com/poihoii/PikPak_FileManager/commits/main"><img alt="Last Commit" src="https://img.shields.io/github/last-commit/poihoii/PikPak_FileManager?style=flat-square&color=orange"></a>
  <img alt="Version" src="https://img.shields.io/badge/version-2.0.0-blue?style=flat-square">
  <a href="https://github.com/poihoii/PikPak_FileManager/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-green?style=flat-square"></a>
</div>

<br>

> Developed to complement the operability of the existing PikPak web environment.
> It provides a desktop file explorer-like UI and additional functionalities directly within the browser.

<br>

## 🌍 Supported Languages

<div>
  <a href="https://github.com/poihoii/PikPak_FileManager/blob/main/ReadMe.md">한국어</a> &nbsp;|&nbsp;
  <b><a href="https://github.com/poihoii/PikPak_FileManager/blob/main/user.js/ReadMe(En).md">English</a></b> &nbsp;|&nbsp;
  <a href="https://github.com/poihoii/PikPak_FileManager/blob/main/user.js/ReadMe(Zh).md">中文 (简体)</a> &nbsp;|&nbsp;
  <a href="https://github.com/poihoii/PikPak_FileManager/blob/main/user.js/ReadMe(Ja).md">日本語</a>
</div>

<br>
<hr>

## ✨ Key Features

### 🖥️ Desktop-Style UI/UX

- **Tree Structure Sidebar**: Provides a folder tree in the left sidebar and supports **drag-and-drop file movement** between the file list and the sidebar.
- **Window Controls & View Modes**: Provides screen splitting and resizing features, along with an intuitive toggle between **List and Grid (Thumbnail) views**.
- **Lasso Selection Tool**: Allows selecting multiple items at once by dragging the mouse across the screen, similar to a desktop environment.

### 🎬 Built-in Media Player (Plyr.js)

- **HTML5 Video Player**: Provides a built-in player supporting hotkey controls, playback speed adjustments, and previous/next file switching.
- **Subtitle Capabilities**: Automatically loads subtitle files with the same name and supports drag-and-drop playback for local subtitles. You can also adjust font sizes and enable **real-time automatic translation** during playback.<br>*(※ Note: Currently, Chinese subtitle translation may not be provided smoothly due to translation API structural issues.)*
- **External Integration**: Call external players like PotPlayer and VLC, or generate `.m3u` playlists for selected video items.

### 📂 Data Management & List Filters

- **Advanced Multi-condition Filters**: Filter your lists by combining file size, time, specific extensions, and regular expressions.
- **Duplicate Video Cleanup**: Identify duplicated files by comparing their hash, playback time, and filename, assisting you with prioritization for cleanup operations.
- **Structure Flattening**: Recursively search all contents within subfolders and lay them out in a single continuous list.

### ✏️ Batch Renaming & Preview

- **String & Pattern Replacement**: Supports bulk replacements of specific strings and regex-based modifications (e.g., `Video_{n}`).
- **Preview Changes**: Before finalizing, you can check exactly how each item's name will change via text-form previews.

### 🚀 Extension Links

- **Aria2 Integration**: Immediately dispatch download tasks through local Aria2 RPC communication.
- **IDM Support**: Instantly generate export files (`.ef2`) for Internet Download Manager.

<br>
<hr>

## ⌨️ Hotkeys

Basic hotkeys are supported for easier navigation and management.

| Key | Action | Key | Action |
| :--- | :--- | :--- | :--- |
| **Alt + ← (or Backspace)** | ⬅️ Go back to previous path (Mouse 4) | **Alt + →** | ➡️ Go to next path (Mouse 5) |
| **F5** | 🔄 Refresh the current list | **F8** | 📁 Create a new folder |
| **F2** | ✏️ Open rename dialog | **Delete** | 🗑️ Move selected items to trash |
| **Ctrl + A** | 📋 Select all items | **Ctrl + C / X / V** | ✂️ Copy / Cut / Paste |
| **Alt + S** | ⚙️ Open settings panel | **Esc** | 🚫 Cancel selection / Close popups |

<br>
<hr>

## 📥 Installation Guide

This script requires the **Tampermonkey** environment.

<div style="margin-top:10px; margin-bottom:10px;">
  <a href="https://www.tampermonkey.net/">
    <img width="240px" height="20px" src="https://img.shields.io/badge/Tampermonkey-Install_Extension-black?style=for-the-badge&logo=tampermonkey" alt="Tampermonkey">
  </a>
  &nbsp;&nbsp;
  <a href="https://update.greasyfork.org/scripts/556685/PikPak%20%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%83%9E%E3%83%8D%E3%83%BC%E3%82%B8%E3%83%A3%E3%83%BC.user.js">
    <img width="240px" height="20px" src="https://img.shields.io/badge/GreasyFork-Download_Script-red?style=for-the-badge&logo=greasyfork" alt="GreasyFork">
  </a>
</div>

1. Install the **Tampermonkey** extension on a supported browser.
2. Install the script via [GreasyFork](https://greasyfork.org/en/scripts/556685), or manually add it by copying the [PikPak_FileManager.user.js](https://github.com/poihoii/PikPak_FileManager/blob/main/user.js/PikPak_FileManager.user.js) code from GitHub's `user.js` folder to Tampermonkey.
3. After logging into the [PikPak Website](https://mypikpak.com), click the **floating button** at the bottom right to run it.

<br>
<hr>

## 🛠️ Development & Building

A Webpack build system is implemented for easier module expansion and maintainability.

```bash
# 1. Clone the repository
git clone https://github.com/poihoii/PikPak_FileManager.git

# 2. Install Node module dependencies
npm install

# 3. Hot-reload build for development
npm run dev

# 4. Final bundled build for deployment
npm run build
```
