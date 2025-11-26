<p align="center">
 <img src="https://raw.githubusercontent.com/poihoii/PikPak_FileManager/refs/heads/dev/img/main_screenshot.png" width=750px alt="main"></p>
<br>

# <img src="https://raw.githubusercontent.com/poihoii/PikPak_FileManager/dev/img/logo%20(200).svg" width=33px alt="Logo"> PikPak File Manager (PikPak ファイルマネージャー)

<br>

![Author](https://img.shields.io/badge/author-poihoii-orange)
![Version](https://img.shields.io/badge/version-1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

**PikPak Webクライアントのユーザー体験を向上させるためのファイル管理スクリプトです。**

既存のPikPak Web版の環境を改善するため、Tampermonkeyを利用してファイル管理に役立つ様々な機能をUserScriptとして実装しました。

<br>

### 🌍 Languages : [한국어](https://raw.githubusercontent.com/poihoii/PikPak_FileManager/refs/heads/main/ReadMe.md) | [English](https://raw.githubusercontent.com/poihoii/PikPak_FileManager/refs/heads/main/user.js/ReadMe(En).md) | [中文 (简体)](https://raw.githubusercontent.com/poihoii/PikPak_FileManager/refs/heads/main/user.js/ReadMe(Zh).md) | [日本語](https://raw.githubusercontent.com/poihoii/PikPak_FileManager/refs/heads/main/user.js/ReadMe(Ja).md)

<br>


<br>

## ✨ 主な機能 (Features)

### 🖥️ デスクトップスタイル UI
- **リストビュー**: Windowsエクスプローラーに似た直感的なリストデザインを提供します。
- **ダークモード**: システムテーマに合わせて目に優しいダークモードを自動的にサポートします。
- **ステータス表示**: 選択されたファイル数、読み込み状態などをリアルタイムで確認できます。
<br>

### 📂 高度なファイル管理
- **構造の平坦化 (Flatten)**: サブフォルダに隠れているすべてのファイルを検索し、**一つのリスト**に平坦化します。
- **重複ファイルの整理**: ハッシュ (Hash)、ファイル名、再生時間などを比較して重複ファイルを検出します。
- **スマート整理**: 容量や日付を基準に削除するファイルを自動的に選択してくれるツールが含まれています。
<br>

### ✏️ 一括リネーム
- **パターン変更**: `Video {n}` のようなパターンを使用して、ファイル名を一度に整理できます。
- **文字列置換**: 数百のファイル名から特定の単語を検索して置換または削除できます。
<br>

### 🚀 ダウンロードと再生
- **Aria2 連携**: ローカルAria2 RPCサーバーへダウンロードタスクを直接送信します。
- **IDM サポート**: Internet Download Manager用のエクスポートファイル (`.ef2`) を生成します。
- **ストリーミング再生**: **PotPlayer**、**VLC** などの外部プレーヤーで動画を即座に再生します。
- **プレイリスト**: 選択した動画で `.m3u` プレイリストファイルを生成します。
<br>

### 📌 その他ショートカットキー、サムネイル、プレビューなどの便利機能

<br>


<br>

## ⌨️ ショートカットキー (Hotkeys)


| キー (Key) | 動作 (Action) | キー (Key) | 動作 (Action) |
| :--- | :--- | :--- | :--- |
| **Alt + ←** or **Backspace** | 前のページ (マウスボタン4) | **Alt + →** | 次のページ (マウスボタン5) |
| **F5** | リスト更新 | **F8** | 新規フォルダ作成 |
| **F2** | 名前変更 or 一括変更 | **Delete** | 選択項目をゴミ箱へ移動 |
| **Ctrl + A** | 全選択 | **Ctrl + C** or **+ X** or **+ V**  | コピー / 切り取り / 貼り付け |
| **Alt + S** | 設定を開く | **Esc** | 選択解除 / ポップアップを閉じる |

<br>


<br>

## 📥 インストール方法 (Installation)

本スクリプトはTampermonkeyをベースにしています。

リポジトリに公開されたスクリプトコードを直接適用するか、[GreasyFork](https://greasyfork.org/ko/scripts/556685-pikpak-%ED%8C%8C%EC%9D%BC-%EA%B4%80%EB%A6%AC%EC%9E%90)からスクリプトをダウンロードして使用できます。

1. ブラウザ拡張機能 **[Tampermonkey](https://www.tampermonkey.net/)** をインストールします。(Chrome, Edge, Firefox 対応)
2. Tampermonkeyのダッシュボードで `+` ボタン (新規スクリプト追加) をクリックします。
3. 提供された `user.js` コードをすべてコピーして貼り付け、`Ctrl + S` を押して保存します。
4. [PikPak ウェブサイト](https://mypikpak.com) にアクセスし、右下の**フローティングボタン**をクリックするとマネージャーが実行されます。

<br>


<br>

## 🛠️ 開発 (Development)

本スクリプトは各機能ごとに**モジュール化 (Modularized)** して分離作成された後、一つのスクリプトに統合ビルドされています。

```bash
# 1. リポジトリのクローン
git clone [https://github.com/poihoii/PikPak_FileManager.git](https://github.com/poihoii/PikPak_FileManager.git)

# 2. 依存関係のインストール
npm install

# 3. 開発時のリアルタイムビルドテスト
npm run dev

# 4. 最終ビルド (配布用)
npm run build
