# 수학 4~6학년 앱·활동지 만들기 — 진행 계획과 현황 (2026-10-10 시작)

**선생님 요청(2026-10-10):** 4학년 수학(1·2학기)을 3학년처럼 두 버전(교과서 차시 버전 + 이야기 버전)의 웹앱과 활동지(hwpx 기본형·도전형)로 만들고, 오류를 두 번 점검한다.
4학년이 끝나면 **5학년 → 6학년**을 같은 방식으로 이어서 만든다. **사용량이 다 차서 멈추면, 다음 세션이 열리자마자 이 파일을 읽고 바로 이어서 한다.** 목표: 수학 3~6학년 모두 완성.

## 지도서 위치 (구글 드라이브, 연결된 Google Drive 도구로 읽음)

- 4학년: 드라이브 폴더 **'수학 4학년'** (id `1Au9WIF_BJ_5UnksEuCW5nW-94PxL6OWa`) — 4-1 `[수학]4-1_N단원_지도서.pdf` 6개, 4-2 `4_2_수학_N_수학지도서.pdf` 6개
- 5학년: **지도서 › 5학년 › 수학** (폴더 id `1aS1iF2iBPyyX3jr4UiIWqoTfdETk5O0f`) — 5-1 `[수학 지도서]5-1_N단원.pdf` 6개, 5-2 `5_2_수학_N_수학지도서.pdf` 6개 (2026-10-10 확인)
- 6학년: **지도서 › 6학년 › 수학** (지도서 폴더 id `1n732dg8tykMT-cBlTK2qnP2jF1VS-dXA`, 6학년 폴더 id `1qs73lD3OQAx53cI0tBETzibNEKU1nIq8`) — 선생님이 올리는 중
- **드라이브 검색은 결과가 여러 쪽으로 나옵니다. `nextPageToken`이 있으면 끝까지 넘겨 보세요**(6단원을 한 번 놓친 적 있음).
- 읽기: `read_file_content`(글자). `download_file_content`는 쓰지 마세요(base64가 너무 큼).
- **4-2 3단원 지도서(`4_2_수학_3_수학지도서.pdf`, id `1LQrQ6pglcb1ZLY5E8HEgFhd6uSHwM1PG`)는 글자가 없는 스캔본**이라 읽히지 않음 → 선생님께 'Google 문서로 열기'(OCR)한 문서를 부탁드림(2026-10-10). 그 문서가 생기면 그것으로 명세를 만듭니다.

## 만드는 순서 (단원마다)

1. **명세**: 지도서를 읽어 차시·소재·문제·정답을 정리 (`BRIEF_SPEC.md`, 결과는 세션 임시 폴더 — 지도서 내용이라 저장소에 올리지 않음).
2. **교과서 버전 앱**: `BRIEF_TB.md`(1학기)·`BRIEF_TB2.md`(2학기) → `gradeN/math/_build/units/[sem2/]<slug>.tb.js`
3. **이야기 버전 앱**: `BRIEF_ST.md` → `<slug>.st.js` (교과서 버전 부품을 복사해 다시 씀, 학교 생활 이야기 하나로)
4. 빌드·점검: `python3 build.py <slug> && node check.js <slug>` (두 화면 폭 이상 없음)
5. **활동지**: `grade4/math/_build/sheets/hwpxgen.py`(3학년 활동지와 같은 양식) — 단원마다 두 버전 × 기본형·도전형, 맨 끝 교사용 정답 한 장
6. **목록 페이지**: `gradeN/math/sem1/index.html`·`sem1-soop/index.html`·`sem2/…` (3학년 목록을 본떠), 과목방 카드, 첫 화면 학년 카드 '(준비 중)' 풀기, `apply_theme.py`·`apply_content_theme.py`
7. **두 번 점검**: ① 단원마다 독립 점검(계산·정답·그림·학년 수준·학습 목표, 3학년 때와 같은 방식) → 고치기 ② 전체 다시 열어 보기·계산 답 재계산·링크 점검
8. main에 올리기(`git fetch origin main && git rebase origin/main` 후 `git push origin HEAD:main`), 자동 보완 성공 확인, 노션은 선생님이 원하면.

5·6학년은 `grade4/math/_build/`를 본떠 `grade5/math/_build/`(같은 틀 `tpl_*.html`·`build.py`·`check.js`·`hwpxgen.py` 복사, 학년 글자 '4학년' → 'N학년', key `t51-…`)로 만듭니다.

## 현황 (끝난 것에 ✓, 커밋은 작업 브랜치 `claude/gracious-gauss-9aljc9`)

### 4-1 (`grade4/math/_build/units/`)
| 단원 | slug | 교과서 | 이야기 | 활동지 | 점검 |
|---|---|---|---|---|---|
| 1 큰 수 | u1-bignum | ✓ | ✓ 우주 탐험대 큰 수 일지 | | |
| 2 각도 | u2-angle | ✓ | 진행 중(놀이터 설계단) | | |
| 3 곱셈과 나눗셈 | u3-muldiv | ✓ | 진행 중(과학 축제 준비 위원회) | | |
| 4 평면도형의 이동 | u4-move | ✓ | 진행 중(우리 반 게임 제작소) | | |
| 5 막대그래프 | u5-bargraph | ✓ | ✓ 우리 반 조사 기자단 | | |
| 6 규칙과 관계 | u6-pattern | 진행 중 | | | |

### 4-2 (`grade4/math/_build/units/sem2/`)
| 단원 | slug | 교과서 | 이야기 | 활동지 | 점검 |
|---|---|---|---|---|---|
| 1 분수의 덧셈과 뺄셈 | u1-fracadd | 진행 중 | | | |
| 2 삼각형 | u2-triangle | 진행 중 | | | |
| 3 (소수의 덧셈과 뺄셈?) | — | 지도서 OCR 필요 | | | |
| 4 사각형 | u4-quad | 진행 중 | | | |
| 5 꺾은선그래프 | u5-linegraph | 진행 중 | | | |
| 6 다각형 | u6-polygon | 진행 중 | | | |

### 남은 일 (4학년)
- 목록 페이지·README·전체 안내·Code.gs, 활동지 전부, 점검 두 번, main 올리기, CLAUDE.md에 4학년 수학 항목 쓰기.
- 알려진 고칠 거리: 5단원 교과서 빈칸 문장의 조사('막대의 폭로', '합계을' 등) — 점검 때 고치기.

### 5학년·6학년: 아직 시작 전
