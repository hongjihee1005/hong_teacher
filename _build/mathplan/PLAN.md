# 수학 4~6학년 앱·활동지 만들기 — 진행 계획과 현황 (2026-10-10 시작)

**선생님 요청(2026-10-10):** 4학년 수학(1·2학기)을 3학년처럼 두 버전(교과서 차시 버전 + 이야기 버전)의 웹앱과 활동지(hwpx 기본형·도전형)로 만들고, 오류를 두 번 점검한다.
4학년이 끝나면 **5학년 → 6학년**을 같은 방식으로 이어서 만든다. **사용량이 다 차서 멈추면, 다음 세션이 열리자마자 이 파일을 읽고 바로 이어서 한다.** 목표: 수학 3~6학년 모두 완성.

## 선생님 운영 원칙 (2026-10-10 밤, 선생님 말씀)

- **자동으로 계속:** 4학년 → 5학년 → 6학년(1·2학기)까지 멈추지 말고 이어서. 선생님이 주무시는 동안에도 계속. 사용량이 다 차서 멈추면 다시 쓸 수 있게 되는 대로 바로 이어서.
- **학년·학기 하나가 끝날 때마다 main에 올리기**(예: 4-1 끝 → main, 4-2 끝 → main …). 올리기 전 점검 통과, 올린 뒤 자동 보완 성공 확인.
- **선생님이 꼭 확인해야 하는 문제는 건너뛰고** 아래 '선생님 확인 필요' 목록에 적은 뒤, 할 수 있는 일을 계속. 나중에 선생님과 함께 처리.

## 자동 깨우기 (2026-10-10 14:14 UTC)

- 사용량 한도로 하위 작업이 멈춰도 세션은 저절로 깨지 않으므로, 한 시간마다(매시 14분) 이 세션을 깨우는 예약 `수학 4~6학년 작업 이어 하기`(trig_01Sw7ecuqpi6ypCsawWUjqsN)를 걸었습니다. 6-2까지 끝나면 끕니다.
- 14:13 UTC에 멈췄던 9개(4-1 u2·u4 이야기, u6 교과서, 4-2 u1~u6 교과서)를 다시 맡김.

- 2026-10-10 14:40경 두 번째 한도(19:10 UTC 풀림) → 19:15 자동 깨우기로 다시 맡김: 4-1 점검 6개, 4-2 이야기 3·4단원. 4-2 활동지 1·2·5·6단원은 4-1 점검 뒤에 맡길 것(`gen_u1-fracadd.py` 중간본 있음).

## 선생님 확인 필요 (건너뛴 것)

- 5-1 4단원 약분과 통분: 지도서 PDF 글자에서 분수의 분자가 대부분 빠짐 → 풀이식·정답으로 되살리고, 끝내 모르는 분자는 정답 성질(부호 등)에 맞게 앱이 정함(목록은 단원 보고에). 교과서와 숫자가 다를 수 있음.
- 4-1 1단원 큰 수: 교과서 4차시 광고 '판매량 백만 개 돌파!'를 앱은 '1000000개'로 읽기 문제화 — 원문대로 둘지? · 이야기 7차시 2600억→3100억(받아올림 있음) 힌트 '숫자가 바뀐 자리'가 두 자리 바뀜 — 받아올림 없는 수열로 바꿀지?
- 4-1 3단원(이야기 5-1): 92÷23을 '90÷20 → 4쯤'으로 어림(90÷20=4…10). 80÷20처럼 깔끔한 예로 바꿀지?
- 4-1 4단원 평면도형의 이동: 지도서 PDF에 그림이 없어 도형 좌표·길 조각·고흐의 방 조각·이동 카드 ③⑤⑥⑧⑨⑩·원래 수 28·21·820은 앱이 정함 · 이야기 9차시 도전 거울 타일 한 칸이 뒤집기 두 번(지도서는 복잡한 이동 지양) — 괜찮은지?
- 4-1 2단원 각도(교과서): 8차시 도전 네 각(앱 80·125·70·□85, 지도서 유사 문제 50·145·80·□85, 답 같음) · 7차시 활동 1 지도서 삼각형 2개 중 앱은 1개만 잼(꼭짓점 끌기 계단이 따로 있음).
- 4-1 6단원 규칙과 관계(교과서): 1차시 암모나이트 그림은 지도서 그림이 없어 단순하게 다시 그림(나선이 한 줄로 이어지지 않음).
- 4-1 5단원 막대그래프(교과서): 8차시 소개 글 빈칸 문장을 원문 '( )이/가' 대신 '가장 많은 곳은 [ ]이고'로 바꿈. 지도서에 값 없는 그래프(일회용품 13명·분리배출 16명 등)는 정한 값.
- 4-2 1단원 분수의 덧셈과 뺄셈: 분수 부분이 1 이상인 대분수(2 8/8)는 '틀림'+안내로 셈(안내만 할지?) · 9차시 놀이 말 분수·처음 수는 앱이 정함.
- 4-2 4단원 사각형(교과서): 8차시 도전 띠 조각 표는 지도서 유사 문제대로 포함 관계 전제(정사각형도 사다리꼴 칸 ◯) — 단원 유의 사항 ⑥과 어긋나 보임 · 11차시 도전 '사다리꼴'도 통과(지도서 채점 기준).
- 4-2 6단원 다각형: 정칠각형 각이 화면에 129°로 반올림(실제 약 128.6°).
- 4-2 5단원 꺾은선그래프(교과서): ① 5~6차시 '가장 많았던 때' 지도서 2018년 ↔ 같은 쪽 예시 표로는 2022년 → 2022년으로 함 ② 9차시 '변화가 가장 큰 때' 지도서 5월 ↔ 예시 점수표로는 8월 → 8월로 함 ③ 8차시 설탕·케첩 가격 8개는 그림만 있어 추정값 ④ 10차시 얼음 조각 길 모양 미확인 ⑤ 2차시 갈치 어획량 순서(700·200·400·500·100)는 추정값

## 5·6학년 지도서 파일 (드라이브 file id)

- 5-1: 1단원 `1Ul3-pO2NkJUupZAE-hv9vzax8Ag-YjhA` · 2단원 `1M2Zpe1qjGu3MSdZqIB4MfOLpxZrMAP7B` · 3단원 `1TR5DmF5TEHa3v50s9UZhW5IgbevVKB9K` · 4단원 `1bgnEZeQ8o-_N6klDPhmmgCZkuaEx2Hv3` · 5단원 `1wAhDCNfLnrEy5h7JsK9TBey5Q4Uf0rtp` · 6단원 `12uOiqySR1C6KQgcf2Eh0b5JA2yeJlbkV`
- 5-2: 1 `16nxozizuifxzZvrMbVmcj68DGk4d0czx` · 2 `1c_ZrJKgNuN2yBvsufj18nSQsH8XxtqbU` · 3 `1JpNrVzVg6Q8i6nlaoS11oTLORc8J4Va1` · 4 `1ejfRE5Dti0UjLBFU5RowITM8Dx6qQifH` · 5 `1mLwlSOhDf9B1xqEhvMIKF_NN4G2zdCWm` · 6 `1ZJ1F9nZbvBZun8KzSYydQg-Nq_lmADLO`
- 6학년 수학 폴더 id `13H1ILWiD7MbuLE_HeC9_sn5Wlv7t3URr`
- 6-1: 1 `1TH0MfHkVhcshwOUr7S6tw7P_yyfKatUM` · 2 `1xYEoi1bqtlt9jo6pgWF-ZAWiOpjVeiBq` · 3 `1do72rYumu9j9q2byU4q17Bs1DPGysLvY` · 4 `1HlIvGyIx1U7SnoOauDdHdpyY_i0KZbLp` · 5 `1xH32HJYnArgAE1nmry3iCxIJJcw1RgK3` · 6 `1D8YxNgVh4K-Axpl02dn6yfi5oSraNiqE`
- 6-2: 1 `161q_sL264ABAVki9OIxi4I0ot-DkVGtI` · 2 `1Utop4NXrCpBvdzAUZrQNj63Qf3B6N0lD` · 3 `1_b856nKP243VTFzB2Anh8q2wBx1QeEeQ` · 4 `1dp2KUS6OKlWhfpfMCXex_nPjwpqB_tBX` · 5 `1fa425DpjUnvD8JwKgMrB-j0XpN82zq9O` · 6 `1GovLtZtX18Qvi4UpftLWkSLHAORS8CyL`
- 4학년 file id: 4-1 1 `1mYXASSMGjRFVCegJlM7VJYzF0GHhc0A0` · 2 `16mcU-0hv9cNMd4-ht6GDKbMXeX7NKHhX` · 3 `1lKQWjX01O9nhQQCiPlZ2uiQKG5OQAH-W` · 4 `1bMojzt2b2CZBbxPpLatzeYSSuLtW1Lek` · 5 `1lo1dafYlNtycPwJNTyQtH6v3oAPQfwSG` · 6 `1xrm37RhO10OvrmrtdmrgWU6xelJXGAAQ` / 4-2 1 `1NqrfxbZdaSkzgeAMcROXHP_M9jDR5cbm` · 2 `1r9p9lZ2CYyI8LquB5j6ncRCuvsa1HOme` · 3 `1LQrQ6pglcb1ZLY5E8HEgFhd6uSHwM1PG` · 4 `1qG_ljwg0EwH0qHYO9eb9fvXDfTra22m9` · 5 `1fhlAtV0SkuaStoNhlZC3tJLPnkiJ8RGi` · 6 `1orCpplrtvpMdQcUbFYEdPoaE6-zlGNrS`
- 명세(지도서 정리)는 세션 임시 폴더에만 두므로, 새 세션에서는 남은 단원의 명세를 `BRIEF_SPEC.md`로 다시 만듭니다(이미 커밋된 단원 원본 `units/*.js`가 있으면 그 단원은 명세 없이 이어서 고치면 됨).

## 지도서 위치 (구글 드라이브, 연결된 Google Drive 도구로 읽음)

- 4학년: **지도서 › 4학년 › 수학** (폴더 id `1Au9WIF_BJ_5UnksEuCW5nW-94PxL6OWa`, 2026-10-10에 '수학 4학년'에서 옮김) — 4-1 `[수학]4-1_N단원_지도서.pdf` 6개, 4-2 `4_2_수학_N_수학지도서.pdf` 6개
- 5학년: **지도서 › 5학년 › 수학** (폴더 id `1aS1iF2iBPyyX3jr4UiIWqoTfdETk5O0f`) — 5-1 `[수학 지도서]5-1_N단원.pdf` 6개, 5-2 `5_2_수학_N_수학지도서.pdf` 6개 (2026-10-10 확인)
- 6학년: **지도서 › 6학년 › 수학** (지도서 폴더 id `1n732dg8tykMT-cBlTK2qnP2jF1VS-dXA`, 6학년 폴더 id `1qs73lD3OQAx53cI0tBETzibNEKU1nIq8`) — 선생님이 올리는 중
- **드라이브 검색은 결과가 여러 쪽으로 나옵니다. `nextPageToken`이 있으면 끝까지 넘겨 보세요**(6단원을 한 번 놓친 적 있음).
- 읽기: `read_file_content`(글자). `download_file_content`는 쓰지 마세요(base64가 너무 큼).
- 4-2 3단원 지도서(`4_2_수학_3_수학지도서.pdf`, id `1LQrQ6pglcb1ZLY5E8HEgFhd6uSHwM1PG`)는 처음엔 스캔본이라 안 읽혔고, 2026-10-10 선생님이 다시 올려 이제 읽힘(소수의 덧셈과 뺄셈).

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
| 1 큰 수 | u1-bignum | ✓ | ✓ 우주 탐험대 큰 수 일지 | ✓ | ✓ 1차 |
| 2 각도 | u2-angle | ✓ | ✓ 우리 반 놀이터 설계단 | ✓ | ✓ 1차 |
| 3 곱셈과 나눗셈 | u3-muldiv | ✓ | ✓ 과학 축제 준비 위원회 | ✓ | ✓ 1차 |
| 4 평면도형의 이동 | u4-move | ✓ | ✓ 우리 반 게임 제작소 | ✓ | ✓ 1차 |
| 5 막대그래프 | u5-bargraph | ✓ | ✓ 우리 반 조사 기자단 | ✓ | ✓ 1차 |
| 6 규칙과 관계 | u6-pattern | ✓ | ✓ 나눔 저금통 프로젝트 | ✓ | ✓ 1차 |

**4-1 main에 올림 (2026-10-10 20:00 UTC, 커밋 138eae8, sem2 폴더는 빼고 올림 — sem2 앱이 아직 없는 index.html을 가리켜 링크 점검이 막으므로).**

### 4-2 (`grade4/math/_build/units/sem2/`)
| 단원 | slug | 교과서 | 이야기 | 활동지 | 점검 |
|---|---|---|---|---|---|
| 1 분수의 덧셈과 뺄셈 | u1-fracadd | ✓ | ✓ 우리 반 요리 교실 | ✓ | ✓ 1차 |
| 2 삼각형 | u2-triangle | ✓ | ✓ 우리 반 텐트 캠프 | | |
| 3 소수의 덧셈과 뺄셈 | u3-decimal | ✓ | ✓ 우리 반 운동회 기록원 | ✓ | |
| 4 사각형 | u4-quad | ✓ | ✓ 우리 반 학교 지도 만들기 | ✓ | ✓ 1차 |
| 5 꺾은선그래프 | u5-linegraph | ✓ | ✓ 강낭콩 관찰 연구소 | ✓ | ✓ 1차 |
| 6 다각형 | u6-polygon | ✓ | ✓ 교실 꾸미기 디자인단 | ✓ | ✓ 1차 |

### 4-1 목록 페이지 (2026-10-10 만듦)
- `grade4/math/sem1/index.html`·`sem1-soop/index.html`·README·전체안내·Code.gs는 `grade4/math/_build/gen_lists.py`가 단원 원본에서 만듦(이야기 6단원 완성 뒤 다시 돌리고 `apply_theme.py`). 수학방·학년·첫 화면 카드도 고침.
- **이야기 6단원(`sem1-soop/u6-pattern.html`)이 생기기 전에는 main에 올리지 말 것**(링크 점검 실패).

### 남은 일 (4학년)
- 목록 페이지·README·전체 안내·Code.gs, 활동지 전부, 점검 두 번, main 올리기, CLAUDE.md에 4학년 수학 항목 쓰기.
- 알려진 고칠 거리(점검 때 고치기):
  - (4-1 알려진 고칠 거리 셋은 점검에서 모두 고침)

### 4-2 점검 때 고칠 것
- ✓(고침) 4-2 2단원 삼각형(두 버전·활동지): 꼭지각 125°·105°·115° 이등변삼각형은 밑각이 27.5°·37.5°·32.5°라 앱이 28°로 반올림해 세 각 합이 181°로 보임 → 꼭지각을 짝수(예: 120°·100°·110°)로 바꾸고 `gen_u2-triangle.py`도 다시 돌릴 것.

### 엔진 공통 고칠 것 (4-2 점검이 끝난 뒤, 4-1·4-2 모두)
- ✓ 2026-10-10 `build.py`가 모든 단원에 `hj-actbar`를 넣어 고침(4-1은 다음 main 올릴 때 반영). 원래 문제: 활동 안 '확인하기'·'다 썼어요' 줄(`.work > div .actions`)과 엔진 '다음 계단' 막대(`.work > .actions`)가 둘 다 sticky bottom:0이라 800px 화면에서 겹쳐 가려짐. u4-quad 원본에 넣은 `--q4bar` 방식(막대 높이를 재어 안쪽 줄을 그 위에 쌓기)을 `build.py`에서 모든 단원에 넣고 다시 빌드·점검. 3학년 엔진에도 같은 문제가 있는지 확인.

### 5-1 (`grade5/math/_build/units/`, 지시문 `BRIEF_TB_G5.md`·`BRIEF_TB2_G5.md`·`BRIEF_ST_G5.md`, 명세 scratchpad `g5/spec_uN.md`)
| 단원 | slug | 교과서 | 이야기 | 활동지 | 점검 |
|---|---|---|---|---|---|
| 1 자연수의 혼합 계산 | u1-mixcalc | 진행 중 | | | |
| 2 약수와 배수 | u2-factor | 진행 중 | | | |
| 3 대응 관계 | u3-corresp | 진행 중 | | | |
| 4 약분과 통분 | u4-reduce | 진행 중 | | | |
| 5 (명세 중) | | | | | |
| 6 (명세 중) | | | | | |

### 6학년: 아직 시작 전
