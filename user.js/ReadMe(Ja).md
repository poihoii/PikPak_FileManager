<!-- markdownlint-disable MD033 MD041 -->
<div align="center">
  <img src="https://raw.githubusercontent.com/poihoii/PikPak_FileManager/refs/heads/main/img/main_screenshot.png" width="100%" alt="PikPak File Manager Main UI">
</div>

<br>

<div>
  <h1><img src="https://raw.githubusercontent.com/poihoii/PikPak_FileManager/refs/heads/main/img/logo%20(200).svg" width="36" style="vertical-align: middle;" alt="Logo"> PikPak File Manager</h1>
  <p><b>PikPak Web クライアントの操作と管理環境を向上させるための拡張スクリプト。</b></p>
  
  <a href="https://github.com/poihoii/PikPak_FileManager/commits/main"><img alt="Last Commit" src="https://img.shields.io/github/last-commit/poihoii/PikPak_FileManager?style=flat-square&color=orange"></a>
  <img alt="Version" src="https://img.shields.io/badge/version-2.0.0-blue?style=flat-square">
  <a href="https://github.com/poihoii/PikPak_FileManager/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-green?style=flat-square"></a>
</div>

<br>

> 既存のPikPak Web環境のナビゲーションを補完するために開発されました。
> デスクトップアプリケーションのようなUIと追加機能をブラウザ内で直接提供します。

<br>

## 🌍 サポート言語 (Languages)

<div>
  <a href="https://github.com/poihoii/PikPak_FileManager/blob/main/ReadMe.md">한국어</a> &nbsp;|&nbsp;
  <a href="https://github.com/poihoii/PikPak_FileManager/blob/main/user.js/ReadMe(En).md">English</a> &nbsp;|&nbsp;
  <a href="https://github.com/poihoii/PikPak_FileManager/blob/main/user.js/ReadMe(Zh).md">中文 (简体)</a> &nbsp;|&nbsp;
  <b><a href="https://github.com/poihoii/PikPak_FileManager/blob/main/user.js/ReadMe(Ja).md">日本語</a></b>
</div>

<br>
<hr>

## ✨ 主な機能 (Key Features)

### 🖥️ デスクトップスタイルのUI/UX

- **ツリー構造サイドバー**: フォルダツリーを左ペインに表示し、ファイルリストとの間での**ドラッグ＆ドロップによるファイル移動**をサポートします。
- **ウィンドウ操作と表示モード**: 画面分割とサイズ調整機能に加え、**リスト表示とグリッド(サムネイル)表示の切り替え**が可能です。
- **投げ縄選択ツール**: マウスをドラッグすることで、デスクトップと同じように複数のファイルやフォルダを直感的に一括選択できます。

### 🎬 組み込みメディアプレーヤー (Plyr.js)

- **HTML5 ビデオプレーヤー**: ショートカット制御、再生速度調整、前/次のファイルの切り替えに対応した内蔵プレーヤーを提供します。
- **字幕管理機能**: 同名の字幕ファイルを自動ロードするほか、ローカル字幕のドラッグ＆ドロップ再生も可能です。再生中のフォントサイズ変更や**リアルタイム自動翻訳**機能も備えています。<br>*(※ 注意：現在、翻訳 API 構造の問題により、中国語字幕の翻訳がスムーズに提供されない場合があります。)*
- **外部連携機能**: PotPlayerやVLCなどの外部プレーヤーでの再生、または選択した動画の `.m3u` プレイリストの生成出力機能を提供します。

### 📂 データ管理とリストフィルタリング

- **高度な複数条件フィルタ**: ファイルサイズ、時間、特定の拡張子、および正規表現を組み合わせてリストを絞り込みます。
- **重複動画の整理**: ハッシュ、再生時間、ファイル名などを比較して重複ファイルを選別し、消去または保存の戦略のカスタマイズをサポートします。
- **階層化の平坦化 (Flatten)**: サブフォルダ内のすべてのコンテンツを再帰的に検索し、1つの連続したリストとして表示します。

### ✏️ 一括リネームとプレビュー

- **文字列およびパターンの置換**: 特定の文字列の置換やパターン(`Video_{n}`など)を使用したリネーム機能を備えています。
- **変更内容のプレビュー**: リネームを確定する前に、各アイテムの新しい名前をテキストリストとして事前確認できる仕組みを備えています。

### 🚀 拡張連携サポート

- **Aria2 連携**: ローカルの Aria2 RPC 通信を利用して即座にダウンロードジョブを送信します。
- **IDM 対応**: Internet Download Manager用エクスポートデータ(`.ef2`)の生成と保存を提供します。

<br>
<hr>

## ⌨️ ショートカット (Hotkeys)

作業に有用となる基本的なショートカットキーをサポートしています。

| ショートカットキー (Key) | アクション (Action) | ショートカットキー (Key) | アクション (Action) |
| :--- | :--- | :--- | :--- |
| **Alt + ← (または Backspace)** | ⬅️ 前のフォルダへ戻る (マウスボタン4) | **Alt + →** | ➡️ 次のフォルダへ進む (マウスボタン5) |
| **F5** | 🔄 現在のリストを更新 | **F8** | 📁 新しいフォルダの作成 |
| **F2** | ✏️ リネームウィンドウを開く | **Delete** | 🗑️ 選択した項目をゴミ箱に移動 |
| **Ctrl + A** | 📋 リスト内のすべての項目を選択 | **Ctrl + C / X / V** | ✂️ コピー / 切り取り / 貼り付け |
| **Alt + S** | ⚙️ 設定パネルを開く | **Esc** | 🚫 選択の解除またはポップアップを閉じる |

<br>
<hr>

## 📥 インストール方法 (Installation)

このスクリプトは **Tampermonkey** 環境を必要とします。

<div style="margin-top:10px; margin-bottom:10px;">
  <a href="https://www.tampermonkey.net/">
    <img width="240px" height="20px" src="https://img.shields.io/badge/Tampermonkey-Install_Extension-black?style=for-the-badge&logo=tampermonkey" alt="Tampermonkey">
  </a>
  &nbsp;&nbsp;
  <a href="https://update.greasyfork.org/scripts/556685/PikPak%20%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%83%9E%E3%83%8D%E3%83%BC%E3%82%B8%E3%83%A3%E3%83%BC.user.js">
    <img width="240px" height="20px" src="https://img.shields.io/badge/GreasyFork-Download_Script-red?style=for-the-badge&logo=greasyfork" alt="GreasyFork">
  </a>
</div>

1. 互換性のあるブラウザに **Tampermonkey** 拡張機能をインストールします。
2. [GreasyFork](https://greasyfork.org/ja/scripts/556685) を通じてインストールするか、GitHubの `user.js` フォルダ内の [PikPak_FileManager.user.js](https://github.com/poihoii/PikPak_FileManager/blob/main/user.js/PikPak_FileManager.user.js) コードをコピーしてスクリプトを手動で追加します。
3. [PikPak Webサイト](https://mypikpak.com)にログイン後、ページ右下に表示される**フローティングボタン**をクリックして実行します。

<br>
<hr>

## 🛠️ 開発とビルド方法 (Development)

拡張機能のモジュール管理を容易にするためにWebpackのビルドシステムを採用しています。

```bash
# 1. コードのクローン
git clone https://github.com/poihoii/PikPak_FileManager.git

# 2. Node モジュール依存関係のインストール
npm install

# 3. 開発用ホットリロード ビルド
npm run dev

# 4. 配布用のバンドル コンパイル
npm run build
```
