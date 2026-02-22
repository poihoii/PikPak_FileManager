<p align="center">
 <img src="https://raw.githubusercontent.com/poihoii/PikPak_FileManager/refs/heads/main/img/main_screenshot.png" width=750px alt="main"></p>
<br>

# <img src="https://raw.githubusercontent.com/poihoii/PikPak_FileManager/refs/heads/main/img/logo%20(200).svg" width=33px alt="Logo"> PikPak File Manager (PikPak 文件管理器)

<br>

![Author](https://img.shields.io/badge/author-poihoii-orange)
![Version](https://img.shields.io/badge/version-1.2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

**旨在提升 PikPak 网页客户端用户体验的文件管理脚本。**

为了改善现有的 PikPak 网页版环境，利用 Tampermonkey 将多种有助于文件管理的功能通过 UserScript 进行了实现。

<br>

### 🌍 支持的语言 (Languages) : [한국어](https://github.com/poihoii/PikPak_FileManager/blob/main/ReadMe.md) | [English](https://github.com/poihoii/PikPak_FileManager/blob/main/user.js/ReadMe(En).md) | [中文 (简体)](https://github.com/poihoii/PikPak_FileManager/blob/main/user.js/ReadMe(Zh).md) | [日本語](https://github.com/poihoii/PikPak_FileManager/blob/main/user.js/ReadMe(Ja).md)

<br>


<br>

## ✨ 主要功能 (Features)

### 🖥️ 桌面风格 UI
- **列表视图**: 提供类似于 Windows 资源管理器的直观列表设计。
- **深色模式**: 自动支持与系统主题相匹配的深色模式，保护视力。
- **响应式布局**: 根据窗口大小优化界面显示（支持最小宽度 480px）。
- **状态显示**: 实时确认选中文件数量、加载状态等信息。
<br>

### 📂 高级文件管理
- **结构扁平化 (Flatten)**: 递归搜索隐藏在子文件夹中的所有文件，并将其扁平化为**单一列表**。
- **重复文件清理**: 通过比较哈希 (Hash)、文件名、播放时长等信息来查找重复文件。
- **智能整理**: 包含根据容量或日期自动选择要删除文件的工具。
<br>

### ✏️ 批量重命名
- **模式更改**: 使用 `Video {n}` 等模式一次性整理文件名。
- **字符串替换**: 一次性查找并替换或删除数百个文件名中的特定单词。
<br>

### 🚀 下载与播放
- **Aria2 集成**: 将下载任务直接发送到本地 Aria2 RPC 服务器。（支持连接测试及 Token 隐藏输入）
- **IDM 支持**: 生成 Internet Download Manager 专用导出文件 (`.ef2`)。
- **流媒体播放**: 使用 **PotPlayer**、**VLC** 等外部播放器即时播放视频。
- **播放列表**: 为选中的视频生成 `.m3u` 播放列表文件。
<br>

### 📌 其他快捷键、SVG 图标及自定义弹窗等便捷功能

<br>


<br>

## ⌨️ 快捷键 (Hotkeys)


| 按键 (Key) | 动作 (Action) | 按键 (Key) | 动作 (Action) |
| :--- | :--- | :--- | :--- |
| **Alt + ←** 或 **Backspace** | 上一页 (鼠标侧键 4) | **Alt + →** | 下一页 (鼠标侧键 5) |
| **F5** | 刷新列表 | **F8** | 新建文件夹 |
| **F2** | 重命名 或 批量重命名 | **Delete** | 将选中项移至回收站 |
| **Ctrl + A** | 全选 | **Ctrl + C** / **+ X** / **+ V**  | 复制 / 剪切 / 粘贴 |
| **Alt + S** | 打开设置 | **Esc** | 取消选择 / 关闭弹窗 |

<br>


<br>

## 📥 安装方法 (Installation)

本脚本基于 Tampermonkey 运行。

您可以直接应用仓库中发布的脚本代码，或者从 [GreasyFork](https://greasyfork.org/ko/scripts/556685-pikpak-%ED%8C%8C%EC%9D%BC-%EA%B4%80%EB%A6%AC%EC%9E%90) 下载脚本使用。

1. 安装 **[Tampermonkey](https://www.tampermonkey.net/)** 浏览器扩展。（支持 Chrome, Edge, Firefox）
2. 在 Tampermonkey 仪表板中点击 `+` 按钮（添加新脚本）。
3. 复制并粘贴提供的 `user.js` 全部代码，然后按 `Ctrl + S` 保存。
4. 访问 [PikPak 网站](https://mypikpak.com)，点击右下角的**悬浮按钮**即可运行管理器。

<br>


<br>

## 🛠️ 开发 (Development)

本脚本将各功能进行**模块化 (Modularized)** 分离编写后，构建为一个脚本。

```bash
# 1. 克隆仓库
git clone [https://github.com/poihoii/PikPak_FileManager.git](https://github.com/poihoii/PikPak_FileManager.git)

# 2. 安装依赖
npm install

# 3. 开发时实时构建测试
npm run dev

# 4. 最终构建 (发布用)
npm run build
