const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

const header = `// ==UserScript==
// @name           PikPak 파일 관리자
// @name:en        PikPak File Manager
// @name:zh        PikPak 文件管理器
// @name:ja        PikPak ファイルマネージャー
// @namespace      https://github.com/poihoii/
// @version        1.0
// @description    PikPak 웹 드라이브를 확장해 빠른 탐색·중복 검사·일괄 이름 변경·다운로드 기능을 제공하는 고급 파일 관리자.
// @description:en Enhances PikPak with fast navigation, duplicate scan, bulk rename, and advanced file-management tools.
// @description:zh 基于 PikPak 网页 API，提供快速浏览、重复文件扫描、批量重命名和高级下载功能的文件管理器。
// @description:ja PikPak を拡張し、高速ナビゲーション・重複検出・一括リネーム・ダウンロード機能を備えた高機能ファイルマネージャーです。
// @author         poihoii
// @match          https://mypikpak.com/drive/*
// @match          https://app.mypikpak.com/*
// @match          https://drive.mypikpak.com/*
// @icon           https://github.com/poihoii/PikPak_FileManager/blob/4e5e4e56b1ec1c2d22680f2beef0e5d3c93c25b4/img/logo%20(200).png
// @homepage       https://github.com/poihoii/PikPak_FileManager
// @grant          GM_setClipboard
// @grant          GM_setValue
// @grant          GM_getValue
// @run-at         document-idle
// @license        MIT
// ==/UserScript==
`;

module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'pikpak_manager.user.js',
        path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
        minimize: false, // Turn off compression for user script readability (true if desired)
    },
    plugins: [
        new webpack.BannerPlugin({
            banner: header,
            raw: true,
            entryOnly: true,
        }),
    ],
};