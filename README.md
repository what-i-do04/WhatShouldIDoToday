# OTHER SPACE — Beyond the Ordinary.

패션, 그래픽 디자인, 사진, 일러스트레이션, 디지털 아트를 온라인 전시로 경험하는 디지털 미술관의 **웹사이트 프로토타입**입니다.
(이 저장소는 이전에 「오늘 뭐 하지?」 앱이었고, v0.1.0부터 OTHER SPACE로 바뀌었어요. 이전 버전은 Git 기록에 남아 있어요.)

## 실행 방법

빌드 과정이 없는 정적 사이트예요.

- **배포 주소**: main 브랜치에 올리면 GitHub Pages(https://what-i-do04.github.io/WhatShouldIDoToday/)에 그대로 반영돼요.
- **내 컴퓨터에서 보기**: `index.html`을 브라우저로 열면 돼요. 로컬 서버로 보고 싶다면 저장소 폴더에서
  ```bash
  python3 -m http.server 8000
  ```
  을 실행하고 http://localhost:8000 을 열어요.

글꼴(Cormorant Garamond, Pretendard)은 외부에서 불러오고, 불러오지 못하면 시스템 글꼴로 대체돼요.

## 파일 구조

| 파일 | 역할 |
| --- | --- |
| `index.html` | 페이지 뼈대. 헤더, 본문, 푸터, 검색·메뉴·뷰어·확인 창 자리 |
| `css/styles.css` | 디자인 시스템(색, 글꼴, 간격)과 모든 화면 스타일 |
| `js/data.js` | **샘플 데이터 한 곳.** 회원, 작품, 전시, 댓글, 저장, 팔로우, 신고 |
| `js/art.js` | 실제 이미지가 들어오기 전까지 쓰는 임시 이미지 생성기 |
| `js/store.js` | 상태, 조회 함수, 회원 권한, 인증 어댑터 |
| `js/components.js` | 공통 컴포넌트 (Header, Footer, ArtworkCard, SaveButton 등) |
| `js/pages.js` | 페이지별 화면 |
| `js/main.js` | 주소(라우팅)와 클릭·입력 처리 |

## 두 공간: 전시와 오픈 갤러리

- **EXHIBITIONS · SOON · ARCHIVE**: 운영자가 지정한 전시 작가(전문 작가)의 작품만 걸려요. 전시 작품은 전시 안의 작품 상세에서 작품 이야기와 감상(댓글)을 따로 가져요.
- **OPEN GALLERY**: 일반 창작자가 직접 올리는 공간이에요. 전시·아카이브 작품은 오픈 갤러리에 나오지 않고, 두 공간의 작품은 서로 연결되지 않아요.
- 상단 메뉴 순서: HOME · EXHIBITIONS · SOON · ARCHIVE · OPEN GALLERY
- 진행 중인 전시는 동시에 최대 5개까지 열 수 있어요 (`js/store.js`의 `MAX_CURRENT`).

## 페이지 (주소)

| 페이지 | 주소 |
| --- | --- |
| HOME | `#/` |
| 진행 중인 전시 / 전시 상세 | `#/exhibitions`, `#/exhibitions/form-in-tension` |
| 전시 작품 상세 (작품 이야기 + 감상) | `#/exhibitions/after-light/works/x06` |
| 공개 예정 전시 (SOON) | `#/soon` |
| 오픈 갤러리 | `#/gallery` (예: `#/gallery?field=photo&theme=memory`) |
| 작품 상세 | `#/works/w04` |
| 작품 업로드 / 수정 | `#/upload`, `#/works/w09/edit` |
| 창작자 목록 / 프로필 | `#/artists`, `#/artists/u01` |
| 아카이브 | `#/archive` |
| 소개 | `#/about` |
| 로그인 / 회원가입 / 비밀번호 재설정 | `#/login`, `#/signup`, `#/reset` |
| 마이페이지 | `#/mypage/profile` · `works` · `saved` · `following` · `activity` · `settings` |
| 운영자 대시보드 | `#/admin`, `#/admin/exhibitions`, `#/admin/members`, `#/admin/works`, `#/admin/reports` |
| 검색 결과 | `#/search?q=사진` |
| 404 · 접근 권한 안내 · 빈 상태 · 오류 상태 | 없는 주소, 권한 없는 페이지, `#/gallery?q=zzzz`, `#/gallery?state=error` |

## 데모 계정

로그인 화면 아래 **데모 계정으로 둘러보기**에서 고를 수 있어요. 실제 인증이 아니고, 화면 곳곳에 DEMO 표시가 붙어요.

| 버튼 | 계정 | 확인할 수 있는 것 |
| --- | --- | --- |
| 감상 회원 | 감상하는 사람 (viewer) | 저장, 팔로우, 댓글, 창작자 전환 |
| 창작자 회원 | 윤다해 (creator) | 작품 업로드·수정·보관·삭제, 초안·보관 작품 |
| 전시 작가 | 한서진 (creator + Featured Artist) | 전시 작가 배지 표시 |
| 운영자 | OTHER SPACE 운영팀 (admin) | 전시·회원·작품·신고 관리, 배지 지정 |

## 현재 구현 범위

**동작하는 것 (이 브라우저 탭 안에서만 유지되는 데모 상태)**

- 모든 주요 페이지와 페이지 간 이동, 모바일 메뉴, 검색(작품·작가·전시)
- 오픈 갤러리 검색, 분야·주제·매체 필터(서로 다른 분류), 최신순·오래된 순 정렬
- 회원가입 시 감상 회원 / 창작자 회원 선택과 입력 검증
- 저장, 팔로우, 댓글 작성·삭제. 로그인하지 않았으면 로그인 화면으로 이동하고, 로그인 후 하려던 동작을 이어서 처리
- 작품 등록·수정, 공개·초안·보관 상태, 보관 해제, 확인 창을 거치는 삭제
- 감상 회원 → 창작자 회원 전환 (마이페이지 → Settings), 계정·저장·팔로우·댓글 유지
- 운영자: 회원 유형 변경, 전시 작가 배지 지정·해제, 작품 공개 상태 변경, 신고 처리, 전시 생성·수정
- 전시 상세의 몰입형 뷰어 (키보드 ← → Esc)
- 로딩(스켈레톤), 빈 상태, 오류 상태, 404, 접근 권한 안내 화면
- 반응형(데스크톱·태블릿·모바일), 키보드 탐색, 모션 감소 설정 대응

**아직 연결되지 않은 것 (화면에서 데모 또는 준비 중이라고 표시)**

- 실제 회원 인증 (로그인 폼은 "연결되지 않음" 안내 후 데모 계정 사용)
- 실제 파일 업로드와 저장 (업로드 이미지는 브라우저 미리보기로만 사용)
- 데이터 영구 저장 (모든 변경은 sessionStorage에만 남고, 푸터의 "데모 상태 초기화"로 되돌릴 수 있어요)
- 프로필 이미지 변경, 비밀번호 변경, 전시 대표 이미지·작품 배치 편집
- 한국어·영어 전환 (기획에서 제외, 한국어만 지원)

## 이미지 바꾸기

지금 이미지는 모두 `js/art.js`가 만드는 임시 이미지예요. 실제 이미지를 넣을 때는 `js/data.js`에서

- 작품: `imageUrl: ''` 칸에 이미지 주소를 넣으면 그 이미지가 우선 쓰여요.
- 전시·회원: `coverImage`, `profileImage`의 `{ gen: ..., seed: ... }`를 `'https://...jpg'` 같은 주소 문자열로 바꾸면 돼요.

이미지를 불러오지 못하면 레이아웃은 유지되고 "이미지를 불러오지 못했어요" 상태가 표시돼요. 실제 작가의 작품은 이용 권한을 확인한 뒤에만 넣어 주세요.

## 데이터 모델

`js/data.js`의 필드는 기획서의 모델과 같은 이름을 써요.

- **Users**: id, email, nickname, profileImage, bio, role(`viewer` / `creator` / `admin`), isFeaturedArtist, createdAt
- **Works**: id, space(`gallery` / `exhibition`), exhibitionId(전시 작품만), story(전시 작품의 작품 이야기), title, image, description, artistId, field, theme, medium, status(`draft` / `published` / `archived`), createdAt, updatedAt (+ 제작 의도 `intent`, 카드 비율 `ratio`)
- **Comments**: id, workId, authorId, content, createdAt
- **Saves**: userId, workId, createdAt
- **Follows**: followerId, followingId, createdAt
- **Exhibitions**: id, title, description, curatorStatement, theme, coverImage, startDate, endDate, status (+ 한글 제목 `subtitle`, 분위기 `mood`, 제목 서체 `type`)
- **ExhibitionWorks**: exhibitionId, workId, displayOrder
- 분야(fields), 주제(themes), 매체(media)는 각각 별도 목록이에요.

## 권한 규칙

- Viewer는 작품을 올리거나 수정할 수 없어요.
- Creator는 본인 작품만 수정·삭제·보관할 수 있어요.
- Admin만 운영자 화면에 들어갈 수 있어요.
- Featured Artist(전시 작가)는 회원 유형이 아니라 Admin이 Creator에게 지정하는 표시예요. 지정된 작가의 작품만 전시에 걸려요.
- 초안·보관 작품은 공개 목록에 나오지 않아요.
- **지금의 권한 확인은 화면에서만 이뤄져요.** 실제 기능을 연결할 때는 같은 규칙을 서버(예: Supabase Row Level Security)에서 다시 검사해야 해요.

## 실제 기능 연결 메모

- 인증: `js/store.js`의 `Auth.signIn / signUp / resetPassword`를 실제 인증 서비스 호출로 바꾸면 화면 코드는 그대로 써요.
- 데이터: `OS.Q`(조회)와 `OS.A`(동작) 함수가 화면과 데이터 사이의 경계예요. 이 함수들을 API·DB 호출로 바꾸는 방식으로 옮길 수 있어요.
