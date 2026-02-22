<!-- markdownlint-disable MD033 MD041 -->
<div align="center">
  <img src="https://raw.githubusercontent.com/poihoii/PikPak_FileManager/refs/heads/main/img/main_screenshot.png" width="100%" alt="PikPak File Manager Main UI">
</div>

<br>

<div>
  <h1><img src="https://raw.githubusercontent.com/poihoii/PikPak_FileManager/refs/heads/main/img/logo%20(200).svg" width="36" style="vertical-align: middle;" alt="Logo"> PikPak File Manager</h1>
  <p><b>改善 PikPak 网页端浏览和管理体验的扩展脚本。</b></p>
  
  <a href="https://github.com/poihoii/PikPak_FileManager/commits/main"><img alt="Last Commit" src="https://img.shields.io/github/last-commit/poihoii/PikPak_FileManager?style=flat-square&color=orange"></a>
  <img alt="Version" src="https://img.shields.io/badge/version-2.0.0-blue?style=flat-square">
  <a href="https://github.com/poihoii/PikPak_FileManager/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-green?style=flat-square"></a>
</div>

<br>

> 旨在为主流 PikPak 网页环境的操作提供功能补充。
> 在浏览器中直接提供类似本地系统的文件管理 UI 和各项附加功能。

<br>

## 🌍 支持语言 (Languages)

<div>
  <a href="https://github.com/poihoii/PikPak_FileManager/blob/main/ReadMe.md">한국어</a> &nbsp;|&nbsp;
  <a href="https://github.com/poihoii/PikPak_FileManager/blob/main/user.js/ReadMe(En).md">English</a> &nbsp;|&nbsp;
  <b><a href="https://github.com/poihoii/PikPak_FileManager/blob/main/user.js/ReadMe(Zh).md">中文 (简体)</a></b> &nbsp;|&nbsp;
  <a href="https://github.com/poihoii/PikPak_FileManager/blob/main/user.js/ReadMe(Ja).md">日本語</a>
</div>

<br>
<hr>

## ✨ 主要功能 (Key Features)

### 🖥️ 桌面风格 UI/UX

- **树状侧边栏**：左侧提供文件夹树状结构，并支持与主列表之间的**拖放操作**进行文件移动。
- **窗口操作与视图切换**：支持分割画面和窗口大小调整，并能够在**列表模式与网格 (缩略图) 模式**之间直观切换。
- **套索多选工具**：能够像在桌面操作系统中一样，通过光标拖动框选同时选择多个文件或文件夹。

### 🎬 内置媒体播放器 (Plyr.js)

- **HTML5 视频播放器**：提供集成了快捷键控制、播放速度调整及上一个/下一个文件切换的阅读播放器。
- **字幕管理**：自动加载同名字幕文件，支持本地字幕拖入播放，播放时并支持调整字幕大小和**实时机器翻译**。<br>*(※ 注意：由于翻译 API 结构问题，目前中文字幕翻译可能无法顺畅提供。)*
- **外部联动**：支持将文件发送到 PotPlayer、VLC 等外部播放器，或将选中的视频导出为 `.m3u` 播放列表。

### 📂 数据管理与列表过滤

- **高级多条件过滤器**：组合过滤文件大小、时间、特定扩展名和正则表达式，快速定位需求文件。
- **重复内容清理**：通过比较哈希值、播放时间和文件名等，识别重复文件并协助定制清理保留策略。
- **结构展平 (Flatten)**：递归搜索下级文件夹中的所有内容，将其拉平整合到单个连续列表中。

### ✏️ 批量重命名与结果预览

- **字符串及模式替换**：支持修改正则模式（如 `Video_{n}`）或批量替换包含特定字符串的内容。
- **预览变更**：在正式确立名称变更之前，可通过文本形式查看列表中每个项目的修改预期效果。

### 🚀 扩展链接系统

- **Aria2 桥接**：利用本地 Aria2 RPC 连接立刻发送多个下载任务。
- **IDM 支持**：针对 Internet Download Manager 快速生成配置文件(`.ef2`)以用于离线数据抓取。

<br>
<hr>

## ⌨️ 快捷键 (Hotkeys)

提供常见的桌面风格快捷键系统以辅助日常管理。

| 按键 (Key) | 执行操作 (Action) | 按键 (Key) | 执行操作 (Action) |
| :--- | :--- | :--- | :--- |
| **Alt + ← (或 Backspace)** | ⬅️ 返回上一级路径 (鼠标 4 键) | **Alt + →** | ➡️ 前进下一级路径 (鼠标 5 键) |
| **F5** | 🔄 刷新当前列表内容 | **F8** | 📁 创建新文件夹 |
| **F2** | ✏️ 开启重命名窗口 | **Delete** | 🗑️ 将选中项移至回收站 |
| **Ctrl + A** | 📋 选中列表的所有项目 | **Ctrl + C / X / V** | ✂️ 复制 / 剪切 / 粘贴 |
| **Alt + S** | ⚙️ 打开侧边设置面板 | **Esc** | 🚫 取消所有选择或关闭弹窗 |

<br>
<hr>

## 📥 安装指南 (Installation)

本脚本需要配合 **Tampermonkey** 环境加载。

<div style="margin-top:10px; margin-bottom:10px;">
  <a href="https://www.tampermonkey.net/">
    <img width="240px" height="20px" src="https://img.shields.io/badge/Tampermonkey-Install_Extension-black?style=for-the-badge&logo=tampermonkey" alt="Tampermonkey">
  </a>
  &nbsp;&nbsp;
  <a href="https://update.greasyfork.org/scripts/556685/PikPak%20%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%83%9E%E3%83%8D%E3%83%BC%E3%82%B8%E3%83%A3%E3%83%BC.user.js">
    <img width="240px" height="20px" src="https://img.shields.io/badge/GreasyFork-Download_Script-red?style=for-the-badge&logo=greasyfork" alt="GreasyFork">
  </a>
</div>

1. 在受支持的浏览器中安装 **Tampermonkey** 拓展程序。
2. 通过 [GreasyFork](https://greasyfork.org/zh-CN/scripts/556685) 进行安装，或从 GitHub 的 `user.js` 文件夹复制 [PikPak_FileManager.user.js](https://github.com/poihoii/PikPak_FileManager/blob/main/user.js/PikPak_FileManager.user.js) 代码手动添加至 Tampermonkey。
3. 登录至 [PikPak 网站](https://mypikpak.com) 后，点击页面右下角生成的**齿轮悬浮小圆钮**即可启动使用。

<br>
<hr>

## 🛠️ 构建代码 (Development)

本项目采用 Webpack 构建体系，便以进行模块开发和结构维护。

```bash
# 1. 克隆代码仓库
git clone https://github.com/poihoii/PikPak_FileManager.git

# 2. 安装 Node.js 模块依赖
npm install

# 3. 开发专用的实时重载测试构建
npm run dev

# 4. 发布专用的稳定 Bundle 构建
npm run build
```
