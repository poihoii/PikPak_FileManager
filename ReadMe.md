<p align="center">
 <img src="https://raw.githubusercontent.com/poihoii/PikPak_FileManager/refs/heads/main/img/main_screenshot.png" width=750px alt="main"></p>
<br>

# <img src="https://raw.githubusercontent.com/poihoii/PikPak_FileManager/refs/heads/main/img/logo%20(200).svg" width=33px alt="로고"> PikPak File Manager (PikPak 파일 관리자)

<br>

![Author](https://img.shields.io/badge/author-poihoii-orange)
![Version](https://img.shields.io/badge/version-1.2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

**PikPak 웹 클라이언트의 사용자 경험 향상을 위한 파일 관리 스크립트입니다.**

기존의 PikPak 웹 버전 환경를 개선하고자 Tampermonkey를 이용하여 파일 관리에 도움이 되는 여러 기능을  UserScript로 구현하였습니다.

<br>

### 🌍 지원 언어 (Languages) : [한국어](https://github.com/poihoii/PikPak_FileManager/blob/main/ReadMe.md) | [English](https://github.com/poihoii/PikPak_FileManager/blob/main/user.js/ReadMe(En).md) | [中文 (简体)](https://github.com/poihoii/PikPak_FileManager/blob/main/user.js/ReadMe(Zn).md) | [日本語](https://github.com/poihoii/PikPak_FileManager/blob/main/user.js/ReadMe(Ja).md)

<br>


<br>

## ✨ 주요 기능 (Features)

### 🖥️ 데스크탑 스타일 UI
- **리스트 뷰**: 윈도우 탐색기와 유사한 직관적인 리스트 디자인을 제공합니다.
- **다크 모드**: 시스템 테마에 맞춰 눈이 편안한 다크 모드를 자동으로 지원합니다.
- **반응형 레이아웃**: 창 크기에 따라 최적화된 화면을 제공합니다. (최소 너비 480px 지원)
- **상태 표시**: 선택한 파일 수, 로딩 상태 등을 실시간으로 확인할 수 있습니다.
<br>

### 📂 고급 파일 관리
- **구조 평면화 (Flatten)**: 하위 폴더에 숨겨진 모든 파일을 검색하여 **하나의 목록**으로 평면화합니다.
- **중복 파일 정리**: 해시(Hash), 파일명, 재생 시간 등을 비교하여 중복된 파일을 찾아냅니다.
- **스마트 정리**: 용량이나 날짜를 기준으로 삭제할 파일을 자동으로 선택해주는 도구를 포함합니다.
<br>

### ✏️ 일괄 이름 변경
- **패턴 변경**: `Video {n}` 과 같은 패턴을 사용하여 파일 이름을 한 번에 정리할 수 있습니다.
- **문자열 치환**: 수백 개의 파일 이름에서 특정 단어를 찾아 바꾸거나 삭제할 수 있습니다.
<br>

### 🚀 다운로드 및 재생
- **Aria2 연동**: 로컬 Aria2 RPC 서버로 다운로드 작업을 직접 전송합니다. (연결 테스트 및 토큰 보안 입력 지원)
- **IDM 지원**: Internet Download Manager용 내보내기 파일(`.ef2`)을 생성합니다.
- **스트리밍 재생**: **PotPlayer**, **VLC** 등 외부 플레이어로 영상을 즉시 재생합니다.
- **재생 목록**: 선택한 영상들로 `.m3u` 플레이리스트 파일을 생성합니다.
<br>

### 📌 그 밖의 단축키, 썸네일 및 프리뷰 등 편의 기능

<br>


<br>

## ⌨️ 단축키 (Hotkeys)


| 키 (Key) | 동작 (Action) | 키 (Key) | 동작 (Action) |
| :--- | :--- | :--- | :--- |
| **Alt + ←** or **Backspace** | 이전 페이지 (마우스 4번 키) | **Alt + →** | 다음 페이지 (마우스 5번 키) |
| **F5** | 목록 새로고침 | **F8** | 새 폴더 만들기 |
| **F2** | 파일명 변경 or 일괄 변경 | **Delete** | 선택 항목 휴지통으로 이동 |
| **Ctrl + A** | 전체 선택 | **Ctrl + C** or **+ X** or **+ V** | 복사 / 잘라내기 / 붙여넣기 |
| **Alt + S** | 설정 열기 | **Esc** | 선택 해제 / 팝업 닫기 |

<br>


<br>

## 📥 설치 방법 (Installation)

본 스크립트는 Tampermonkey를 기반으로 하고 있습니다.

저장소에 게시된 스크립트 코드를 직접 적용하거나 또는 [GreaslyFork](https://greasyfork.org/ko/scripts/556685-pikpak-%ED%8C%8C%EC%9D%BC-%EA%B4%80%EB%A6%AC%EC%9E%90)에서 스크립트를 다운 받아 사용하실 수 있습니다.

1. 브라우저 확장 프로그램 **[Tampermonkey](https://www.tampermonkey.net/)**를 설치합니다. (Chrome, Edge, Firefox 지원)
2. Tampermonkey 대시보드에서 `+` 버튼(새 스크립트 추가)을 클릭합니다.
3. 제공된 `user.js` 코드를 전체 복사하여 붙여넣고, `Ctrl + S`를 눌러 저장합니다.
4. [PikPak 웹사이트](https://mypikpak.com) 접속 후 우측 하단의 **플로팅 버튼**을 클릭하면 관리자가 실행됩니다.

<br>


<br>

## 🛠️ 개발 (Development)

본 스크립트는 각 기능별 **모듈화(Modularized)**하여 분리 작성된 후 하나의 스크립트로 통합 빌드 되었습니다.

```bash
# 1. 저장소 클론
git clone [https://github.com/poihoii/PikPak_FileManager.git](https://github.com/poihoii/PikPak_FileManager.git)

# 2. 의존성 설치
npm install

# 3. 개발 시 실시간 빌드 테스트
npm run dev

# 4. 최종 빌드 (배포용)
npm run build