# 과학 교과서 버전 4~6학년 — 진행 계획 (2026-10-24 선생님 요청)

선생님 말씀: "교과서 버전 5학년 1학기 끝나면 5학년 2학기. 끝나면 6학년 1학기, 다음에 6학년 2학기."
"한도 다 되면 다시 가능할 때 다시 시작하기." → **새 세션은 이 파일의 '다음 할 일'부터 바로 이어서 하세요**(선생님이 다른 일을 시키지 않았으면).

## 차례와 현황
| 차례 | 학기 | 상태 |
|---|---|---|
| 1 | 4학년 1학기 | ✅ 열림(앱 28개, 2026-10-24) |
| 2 | 4학년 2학기 | ✅ 2·3·4단원 18개 열림(2026-10-24, main). **1단원은 지도서 PDF 83MB라 읽지 못함 → 선생님께 10MB 이하로 나눠 올려 달라고 요청함** |
| 3 | 5학년 1학기 | 🔶 27개 만듦(u1 7·u2 6·u3 6·u4 8), 지도서 대조 검토 중 → 끝나면 `index_build.py`·apply_theme·main (과학방 카드·sem1.html 안내·run_all 등록은 해 둠) |
| 4 | 5학년 2학기 | 🔶 지도서 4개 글 뽑음(g5/s521~524), units.py·BRIEF 2학기 절 준비, 단원 작성 중 |
| 5 | 6학년 1학기 | ⏳ |
| 6 | 6학년 2학기 | ⏳ |

(학기를 마칠 때마다 이 표를 고치고 커밋하세요.)

## 한 학기 만드는 방법 (4학년과 같게)
1. **빌드 폴더**: `gradeN/science/_build_tb/`를 4학년 것에서 복사(`build.py`·`index_build.py`·`check.js`·`parts/`·`BRIEF_TB.md`, `src/`·`src2/`는 비워 둠). `build.py`는 경로에서 학년을 읽음(`grade(\d)`). 학년마다 `units.py`만 새로 씀(단원 이름·머리 색·그림 이름, 목록 이모지 `EMO_BY`). 새 그림 이름이 필요하면 `build.py`의 `ICON`에 더함(4학년 build.py에도 같이).
   `BRIEF_TB.md`의 학년·파일 이름·지도서 파일 경로를 그 학년에 맞게 고침.
2. **지도서 글 뽑기**: 드라이브의 `[과학] N-S-U_지도서.pdf` / `N_S_과학_U_지도서.pdf`를 `read_file_content`로 읽어 스크래치패드에 `sNSU.txt`로 저장(작성 에이전트가 직접 해도 됨). **글이 비어 나오는 PDF(4-1-4, 4-2-1처럼)는 선생님께 10MB 이하로 나눠 올려 달라고 요청** — 올려 주시면 `pdftotext -layout`으로 쪽마다 `[**Page N**]`을 붙여 뽑음.
   지도서 '교과서 차시 구성'(단원 앞쪽)으로 차시 묶음·파일 이름을 정함(1차시 열려라 과학·과학이 톡톡은 넣지 않음, 두 차시 묶음은 한 파일).
3. **작성**: 단원마다 작성 에이전트 1명(동시에), 안내 `BRIEF_TB.md`. 견본은 3학년 교과서 버전 앱 + 4학년 `src/`.
4. **검토**: 다른 검토 에이전트가 지도서와 대조(정답·쪽수·목표·유의점·오개념·안전·답이 먼저 보이는 곳·통계 출처).
5. **열기**: `python3 index_build.py` → 루트에서 `apply_theme.py gradeN/science/semS/index.html gradeN/science/index.html`, 과학방 카드(`gradeN/science/index.html`의 학기 카드 `wait` 풀고 `semS/index.html`로), 옛 `semS.html`은 `semS/index.html` 안내 페이지로(4학년 `grade4/science/sem2.html` 참고), 학년 카드(`gradeN/index.html`) 과학방 글.
   `_build/auto/run_all.py` BUILDS에 등록(4학년 '과학 4학년 교과서 버전' 줄을 본떠), CLAUDE.md에 한 절.
6. **점검·올리기**: `python3 _build/auto/run_all.py`(문제 0개), Playwright로 덮개 입힌 페이지 열어 오류 없음 확인 → 커밋 → `git fetch origin main` 뒤 main 합치기(충돌 나면 자동 보완이 바꾼 생성 파일은 우리 것) → `git push origin HEAD:main` → Actions '자동 보완' 성공 확인.

## 지도서 (Google 드라이브, 2026-10-24 기준)
- 5-1: `[과학] 5-1-1_지도서.pdf`(1j3fwBtUksrlZGzYleFscI000diEgvxPL) · `-2`(1ABz4mg_zM8OQ3-hLcnOLxK0rBcAfYCDC) · `-3`(1CZeXdk7EgWFOEr1Mr_6hEOiN0dp2aji6) · `-4`(1xexWwnifFR1KGFl9_o_yypfokjpg_z27)
- 5-2: `5_2_과학_1~4_지도서.pdf` (1fuFs4Sd9qXV6Hre6kHIYr7_ek_dazt-j · 1EFMfEgQ74TCfJIJBHpzrsZPQ7PXS3R-t · 1d1EircYfVPYcUkhA0dp14t1Or8YbbvSb · 1RsVOZm_hL44F3Tz6DbfekxnR_vow6bWq)
- 6-1: `[과학] 6-1-1~4_지도서.pdf` (1pkudr1C4MG576If8gShmFrte1QWLMuz8 · 15YWuuWJI-rgHgIxePMdU_V2fESi06Y8i · 1w951PFiS07lIz7hrRv254Oc7RXIHl3Qq · 1X9jWxrl6oD_jxusczxUaJPBvuhrt9yph)
- 6-2: `6_2_과학_1~4_지도서.pdf` (1rXfq73CPL8QkpjU-TrMGgx5V42NSkBaR · 11EJ641CGW1XpCLwrQrz3MXexVaMDXM09 · 1hXkJRDaRH4OpR-l0AzioK3SQ-c1Y217- · 1M_SoqMUceIw_euNa2YgQVusCyRLiK3VP)
- 4-2-1: `4_2_과학_1_지도서.pdf`(1TU6IgUvQKkEn4RdtkTCfs6fo0JrfqC3v, 83MB, 글 뽑기 안 됨 — 나눈 파일을 기다림)

## 지킬 것
- 지도서 글은 저작물이라 저장소에 넣지 않음(스크래치패드에만).
- 위키미디어를 받을 수 없는 환경이면 사진 대신 직접 그린 SVG(`_build/wmcache`에 있는 사진은 `@wm:` 로).
- 커밋 메시지에 모델 이름을 쓰지 않음.
