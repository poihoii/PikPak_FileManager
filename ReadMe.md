<!-- markdownlint-disable MD033 MD041 -->
<div align="center">
  <img src="https://raw.githubusercontent.com/poihoii/PikPak_FileManager/refs/heads/main/img/main_screenshot.png" width="100%" alt="PikPak File Manager Main UI">
</div>

<br>

<div>
  <h1><img src="https://raw.githubusercontent.com/poihoii/PikPak_FileManager/refs/heads/main/img/logo%20(200).svg" width="36" style="vertical-align: middle;" alt="Logo"> PikPak File Manager</h1>
  <p><b>PikPak 웹 클라이언트의 탐색 및 관리 환경을 개선하는 확장 스크립트</b></p>
  
  <a href="https://github.com/poihoii/PikPak_FileManager/commits/main"><img alt="Last Commit" src="https://img.shields.io/github/last-commit/poihoii/PikPak_FileManager?style=flat-square&color=orange"></a>
  <img alt="Version" src="https://img.shields.io/badge/version-2.0.0-blue?style=flat-square">
  <a href="https://github.com/poihoii/PikPak_FileManager/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-green?style=flat-square"></a>
</div>

<br>

> PikPak 웹 환경의 조작성을 보완하기 위해 개발되었습니다.
> 데스크탑 파일 관리자와 유사한 UI와 부가 기능들을 브라우저 내에서 제공합니다.

<br>

## 🌍 지원 언어 (Languages)

<div>
  <b><a href="https://github.com/poihoii/PikPak_FileManager/blob/main/ReadMe.md">한국어</a></b> &nbsp;|&nbsp;
  <a href="https://github.com/poihoii/PikPak_FileManager/blob/main/user.js/ReadMe(En).md">English</a> &nbsp;|&nbsp;
  <a href="https://github.com/poihoii/PikPak_FileManager/blob/main/user.js/ReadMe(Zh).md">中文 (简体)</a> &nbsp;|&nbsp;
  <a href="https://github.com/poihoii/PikPak_FileManager/blob/main/user.js/ReadMe(Ja).md">日本語</a>
</div>

<br>
<hr>

## ✨ 주요 기능 (Key Features)

### 🖥️ 데스크탑 스타일 UI/UX

- **트리 구조 사이드바**: 왼쪽 사이드바에 폴더 트리를 제공하며, 파일 리스트와의 **드래그 앤 드롭 파일 이동**을 지원합니다.
- **창 조작 및 뷰 모드**: 화면 분할 및 크기 조절 기능과 함께 **리스트 단위 및 썸네일(Grid) 뷰 전환**이 가능합니다.
- **다중 선택 툴 (Lasso)**: 바탕화면처럼 마우스를 드래그하여 여러 항목을 한 번에 선택할 수 있습니다.

### 🎬 내장 미디어 플레이어 (Plyr.js 적용)

- **HTML5 비디오 플레이어**: 단축키 제어, 재생 속도 조절, 이전/다음 파일 전환 기능을 지원하는 내장 플레이어를 제공합니다.
- **자막 편의 기능**: 영상과 이름이 같은 자막 파일의 자동 로딩 및 로컬 자막 파일의 드래그 앤 드롭 재생을 지원합니다. 재생 중 폰트 크기 변경 및 **실시간 자동 번역** 기능도 사용 가능합니다.<br>*(※ 주의: 현재 번역 API 구조 문제로 인해 중국어 자막 번역은 원활하게 제공되지 않을 수 있습니다.)*
- **외부 연동**: PotPlayer, VLC 등 외부 플레이어 호출 기능 및 선택한 영상들의 `.m3u` 플레이리스트 생성 기능을 제공합니다.

### 📂 데이터 관리 및 필터 리스트

- **고급 다중 조건 필터**: 파일 크기, 시간, 특정 확장자 및 정규표현식을 조합하여 목록을 필터링할 수 있습니다.
- **중복 영상 정리**: 해시(Hash), 재생 시간, 파일명 등을 비교하여 중복 등재된 파일을 식별하고 정리 우선순위를 지정할 수 있습니다.
- **구조 평면화 (Flatten)**: 하위 폴더에 있는 모든 내용을 검색하여 하나의 목록으로 나열합니다.

### ✏️ 일괄 이름 변경 및 미리보기

- **문자열 및 패턴 치환**: 정규식 패턴 수정(`Video_{n}` 등) 및 특정 문자열의 일괄 치환을 지원합니다.
- **변경 사항 미리보기**: 이름 변경을 확정하기 전, 각 항목의 이름이 어떻게 적용될지 텍스트 폼으로 확인(Preview)할 수 있습니다.

### 🚀 연결 확장

- **Aria2 연결**: 로컬 Aria2 RPC 통신을 통해 다운로드 작업을 즉시 전송할 수 있습니다.
- **IDM 지원**: IDM(Internet Download Manager)용 내보내기 파일(`.ef2`)을 즉시 생성합니다.

<br>
<hr>

## ⌨️ 단축키 (Hotkeys)

탐색과 관리에 유용한 단축키를 기본 지원합니다.

| 단축키 (Key) | 동작 (Action) | 단축키 (Key) | 동작 (Action) |
| :--- | :--- | :--- | :--- |
| **Alt + ← (또는 Backspace)** | ⬅️ 이전 경로로 (마우스 4번) | **Alt + →** | ➡️ 다음 경로로 (마우스 5번) |
| **F5** | 🔄 현재 목록 새로고침 | **F8** | 📁 새 폴더 생성 |
| **F2** | ✏️ 이름 변경 창 호출 | **Delete** | 🗑️ 선택 항목 삭제 |
| **Ctrl + A** | 📋 목록 전체 선택 | **Ctrl + C / X / V** | ✂️ 복사 / 잘라내기 / 붙여넣기 |
| **Alt + S** | ⚙️ 환경 설정 패널 열기 | **Esc** | 🚫 다중 선택 취소 및 팝업 닫기 |

<br>
<hr>

## 📥 설치 가이드 (Installation)

본 스크립트는 **Tampermonkey** 환경을 요구합니다.

<div style="margin-top:10px; margin-bottom:10px;">
  <a href="https://www.tampermonkey.net/">
    <img width="240px" height="20px" src="https://img.shields.io/badge/Tampermonkey-Install_Extension-black?style=for-the-badge&logo=tampermonkey" alt="Tampermonkey">
  </a>
  &nbsp;&nbsp;
  <a href="https://update.greasyfork.org/scripts/556685/PikPak%20%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%83%9E%E3%83%8D%E3%83%BC%E3%82%B8%E3%83%A3%E3%83%BC.user.js">
    <img width="240px" height="20px" src="https://img.shields.io/badge/GreasyFork-Download_Script-red?style=for-the-badge&logo=greasyfork" alt="GreasyFork">
  </a>
</div>

1. 지원하는 브라우저에 **Tampermonkey** 확장 프로그램을 설치합니다.
2. [GreasyFork](https://greasyfork.org/ko/scripts/556685)를 통해 스크립트를 설치하거나, GitHub의 `user.js`  폴더 내 [PikPak_FileManager.user.js](https://github.com/poihoii/PikPak_FileManager/blob/main/user.js/PikPak_FileManager.user.js) 코드를 복사하여 Tampermonkey에 스크립트를 직접 추가합니다.
3. [PikPak 웹사이트](https://mypikpak.com) 로그인 후, 페이지 우측 하단에 활성화되는 **플로팅 버튼**을 클릭해 실행합니다.

<br>
<hr>

## 🛠️ 자체 빌드 방법 (Development)

프로젝트 구조 변경 및 모듈 확장을 위해 Webpack 빌드 시스템이 적용되어 있습니다.

```bash
# 1. 저장소 클론
git clone https://github.com/poihoii/PikPak_FileManager.git

# 2. 관련 Node 모듈 설치
npm install

# 3. 개발용 핫 리로드 빌드
npm run dev

# 4. 배포용 최종 번들 빌드
npm run build
```
