# hong_teacher — 초등교사 홍지희 수업자료 사이트

GitHub Pages로 게시되는 정적 사이트입니다. 학생이 주소를 열면 자료가 바로 실행됩니다.
첫 화면: https://hongjihee1005.github.io/hong_teacher/

**이 파일은 이 저장소에서 작업할 때의 규칙입니다.**
자료를 *어떻게 만드는지*(교육과정, 글자 크기, 앱 구성, 검증 절차)는 claude.ai 프로젝트
"3학년 수업자료 준비"의 `claude/수업자료실-제작-안내.md` 문서에 있습니다. 새 자료를 만들기 전에 그 문서를 먼저 읽으세요.

---

## 자동 보완 — 한곳(main)에 올리면 나머지는 저절로 (2026-10-04)

**어느 대화·어느 기기에서든 main에 올리면** GitHub Actions(`.github/workflows/auto-fix.yml`)가 `python3 _build/auto/run_all.py`를 돌려
사이트를 '지금 상태'로 맞추고, 바뀐 것이 있으면 `자동 보완` 커밋을 main에 올립니다(1~3분). 그래서 아래 '넣기·덮개' 스크립트를 따로 돌리지 않아도 됩니다.

- 하는 일: ① 원본(`lessons_*.py`, `_build/today` 등)이 바뀌었으면 과학 3-1·3-2·국어·교실·오늘·프로젝트 판을 다시 빌드 ② 수학 단원 앱에 `#hj-home` 조각이 없으면 다시 넣기
  ③ 수학 이야기 버전 예시·도움·답·나눗셈 그림 ④ 사회 예시·힌트 ⑤ 메뉴 디자인 → 수업 자료 덮개 ⑥ 링크 점검.
- **밖에서 빌드한 앱으로 덮어도 됩니다.** 예시·도움·답은 칸 이름표(`SIG`, 차시 번호·단계 안내·칸 이름)로 원래 칸을 찾아가므로 차시·칸이 늘거나 순서가 바뀌어도 그대로 붙습니다.
- **새로 생긴 칸**(예시·도움·답 내용이 없는 칸)과 **원본에 반영 필요**(아래 안전장치)는 `_build/auto/todo.md`에 적힙니다. 내용은 사람이(Claude가) 써야 하니, "todo.md 채워 줘"라고 하면
  해당 `ex_/help_/ans_*.py`에 쓰고 `python3 grade3/math/_ex/sigmake.py 그파일.py`로 이름표를 새로 적습니다.
- 스크립트 오류나 깨진 링크가 있으면 작업이 '실패'로 끝나 GitHub가 선생님께 메일을 보냅니다(Actions 탭에서 [문제] 줄 확인).
- 자동 커밋이 뒤따라 올라오므로, **올리기 전에는 꼭 `git fetch origin main && git rebase origin/main`** 하세요(원래 규칙과 같음).
- 손으로 한 번에 돌리기: `python3 _build/auto/run_all.py`(여러 번 실행해도 안전, 이미 맞으면 아무것도 안 바뀜).
- 과학 사진 캐시는 저장소 `_build/wmcache/`에 있습니다(어디서 빌드해도 같은 결과). 과학을 직접 빌드할 때는 `WM_CACHE=$PWD/_build/wmcache`(저장소 루트 기준)를 붙이거나 `run_all.py`로 돌리세요.
- **안전장치(2026-10-04):** 원본에서 만드는 HTML(과학 3-1·3-2 홍지희 버전, 국어 3-2, 우리 반 교실, 오늘의 교실 산책)은 올라올 때마다 원본으로 다시 빌드해 견줍니다.
  원본만 바뀌었으면 새로 만든 HTML로 바꾸고, **HTML에만 고친 내용이 있으면 HTML을 그대로 지키고** `todo.md`에 '원본에 반영 필요'로 적으며, 그 수정이 이번에 올라온 것이면 실패 메일을 보냅니다.
  그래도 처음부터 원본을 고치세요. '원본에 반영 필요'가 보이면 그 HTML의 수정을 원본(`lessons_*.py` 등)에 옮긴 뒤 `run_all.py`로 다시 만들면 사라집니다.

## 폴더 구조

**학년 → 과목 → 학기** 순서입니다.

```
index.html              첫 화면 (1~6학년 카드)
grade1/ … grade6/
  index.html            그 학년의 과목 카드 (국어·수학·사회·과학)
  korean/ math/ social/ science/
    index.html          그 과목의 학기 카드 (1학기·2학기)
    sem1.html           준비 중이면 안내 한 장
    sem2/               자료가 있으면 폴더
      index.html        자료 목록
      (자료 HTML들)
```

자료가 아직 없는 칸은 `sem1.html` 같은 "곧 열려요" 한 장으로 둡니다.
자료가 생기면 `sem2/` 처럼 폴더를 만들고, 과목 index의 카드 `href`를 폴더로 바꿉니다.

### 옛 주소 안내 페이지

- 3-2 과학 앱 25개·목록·교과연계 계획은 2026-10-02에 루트 `science/`에서 **`grade3/science/sem2/`로 옮겼습니다.**
  루트 `science/`의 27개 파일은 이제 새 주소로 넘기는 안내 페이지입니다(노션·학생이 옛 주소를 갖고 있음). 지우지 마세요.
- 루트의 `social/`, `math/`, `u1-*.html`, `u2-*.html`도 **옛 주소용 안내 페이지**입니다. 지우지 마세요.
- `grade3/science/sem2/linkage.html`(3-2 과학 교과연계 수업 계획, 선생님용)은 **비밀번호 잠금 페이지**입니다. 내용이 AES-GCM으로 암호화되어 파일 안에 들어 있어
  직접 고치면 안 됩니다. `_build/lock/unlock.py`로 평문을 꺼내 고친 뒤 `_build/lock/lock.py`로 다시 잠급니다(비밀번호는 저장소에 적지 않음, 평문은 올리지 않음).

### 3-2 과학 홍지희 선생님 버전 (`grade3/science/sem2-hong/`, 2026-10-02)

- 실험·탐구 중심 26차시. **HTML을 직접 고치지 마세요.** 원본은 `grade3/science/_build_hong2/lessons_uN.py`이고 `python3 build.py [sci32-uN-lM…]` → `python3 index_build.py` → 루트에서 `apply_content_theme.py`·`apply_theme.py`로 다시 만듭니다. 규칙은 `_build_hong2/README.md`, `BRIEF_WRITER.md`.
- **사고전략 칸별 예시(2026-10-03):** 쓰는 칸마다 제목 옆 `💡 예시` 단추를 누르면 그 칸의 예시 문장 2개가 팝업으로 뜹니다(차시 핵심 질문과 이어지게). 문장은 `_build_hong2/examples_uN.py`(단계 이름으로 연결), 점검은 `python3 ex_check.py N`. 고르기만 하는 단계에는 넣지 않습니다.

### 3-1 사회 홍지희 버전 프로젝트 판 (2026-10-02)

- `grade3/social/sem1-hong/u1-l11 ~ u1-l2021`(주제 2) 8쪽에 '우리 동네를 더 살기 좋은 곳으로' 프로젝트 판이 들어 있습니다. 첫 화면 카드와 진행 화면 '프로젝트 판' 단추로 열고, 차시마다 한 칸(①~⑧)을 채웁니다. 저장은 그 기기 localStorage(`hj-soc31-proj-v1`).
- 원본은 `_build/project/soc31.js`. 고친 뒤 `python3 _build/project/apply.py && python3 _build/theme/apply_content_theme.py`.

### 사고전략 칸별 예시 — 과학 3-1·사회 (2026-10-03)

- 과학 3-1 홍지희 버전도 3-2와 같은 방식입니다: 문장 `grade3/science/_build_hong/examples_uN.py`, 점검 `cd grade3/science/_build_hong && python3 ../_build_hong2/ex_check.py N`, `python3 build.py`로 다시 만듭니다(빌드가 연락처 줄·홈 단추도 넣음).
- 사회 홍지희 버전(`sem1-hong`, `sem2-hong`)은 빌드 원본이 없어서 `grade3/social/_ex/apply.py`가 HTML의 수업 데이터(`const C`)에 예시를 넣고 화면 기능(`engine_ex.js`·`ex.css`, 표시 `hj-ex`)을 붙입니다. 문장은 `grade3/social/_ex/ex_sem1_u1.py` …, 점검 `python3 apply.py check`. 여러 번 실행해도 안전합니다.
  **사회 앱 HTML을 다른 데서 만든 파일로 덮었으면 `apply.py`를 다시 돌리세요.**

### 국어 (`grade3/korean/sem2/`) 글쓰기 칸 '💡 도움' (2026-10-04)

- 39개 차시는 `grade3/korean/_build/`에서 만듭니다(`python3 build.py ../sem2` → 루트에서 `apply_content_theme.py`). 여러 줄을 쓰는 칸 135개에 `💡 도움`(쓰는 차례·문장 틀 2줄)이 있고, 단계 전체 교과서 예시 답안은 원래 있던 '💡 예시 보기'로 따로 봅니다.
- 도움 문장은 `_build/help_uN.py`(차시 id → 글쓰기 단계 id → 칸 이름), 빈 틀 `python3 help_skel.py N`, 점검 `python3 help_skel.py check N`.

### 수학 (`grade3/math/`)

- `sem1/`, `sem2/` — 교과서 차시 버전(공개). 단원 앱 `u단원-주제.html`(예: `u1-addsub.html`), 활동지 `sheets/*.hwpx`.
  `sem1/download/`에는 활동지·앱을 한꺼번에 받는 zip이 있습니다.
- `sem1-soop/`, `sem2-soop/` — 이야기 버전(홍지희 선생님 버전), **2026-10-02에 잠금을 없애고 공개 목록으로 바꿨습니다.**
  이제 `sem1/`·`sem2/`와 같은 구조입니다: 단원 앱 `u단원-주제.html` 6개, 활동지 `sheets/*.hwpx`,
  교사용 `3-N수학_개념계단_전체안내.md`·`Code.gs`, 목록 `index.html`.
  주소(`sem1-soop/index.html`, `sem2-soop/index.html`)는 그대로이므로 옛 링크도 열립니다.
  `d/` 폴더와 암호화, 비밀번호는 모두 없어졌습니다. 수학에 잠금 방은 더 없습니다
  (`grade3/science/sem2/linkage.html`은 여전히 잠금 페이지입니다).
- `sem1.html`은 옛 주소 → `sem1/index.html` 안내 페이지입니다. 지우지 마세요.
- **1학기 홍지희 버전(`sem1-soop/`) 앱 6개는 빌드 원본이 없습니다.** 2026-10-03 기준 이 저장소의 HTML이 유일한 원본이므로,
  **다른 데서 빌드한 파일로 덮으면 그동안의 수정이 모두 사라집니다.** 고칠 때는 HTML을 직접 고치세요.
  (2학기는 `lessons_*.js`+`engine.js`로 빌드합니다. 두 학기 엔진은 같은 구조라 같은 수정이 그대로 들어갑니다.)
- **수학 앱은 '확인하기' 단추 없이 자동으로 확인합니다**(2026-10-03). `engine.js`의 `autoRun(ready, sign, run, wait)`를 쓰고,
  기다리는 시간은 입력칸 900ms(Enter는 `blur()`) · 보기 고르기 260ms · 색칠·끌어 놓기 1200ms입니다.
  같은 답으로는 다시 세지 않아, 고쳐 쓰는 동안 '틀림'이 쌓이지 않습니다.
  **`다음 계단` 단추는 글자와 `.actions` 자리를 그대로 두세요** — 공통 덮개 `content.js`가 이 단추를 찾아
  아래 오른쪽에 놓고 옆에 `← 이전 계단`을 붙입니다. 클래스나 글자를 바꾸면 이동 단추가 사라집니다.
  '가장 큰 곱인지 확인하기'처럼 **여러 번 바꿔 보는 것이 활동 자체인 화면 3곳**은 일부러 수동 단추를 남겼습니다.
- **1학기 홍지희 버전 탐구 도우미(2026-10-03):** 6개 앱 엔진에 `thenWhy`(고르기 정답 뒤 '왜 그럴까요?' 한 줄)·`ruleFirst`(조작 전 내 규칙 예상 → 끝나면 '예상이 맞았나요?')·`wonderRecall`(1차시 '궁금해요' 쪽지 다시 보기)를 넣었습니다. 계단의 `render`를 감싸서 씁니다: `render: thenWhy((b, a) => blanks(...), { q, ph })`. 1차시는 보기·생각하기·궁금해하기가 1계단입니다.
- **사고 전략 칸별 예시(2026-10-03):** 이야기 버전(`sem1-soop/`, `sem2-soop/`) 12개 앱의 `panes()` 칸마다 제목 옆 `💡 예시` 단추가 있고, 누르면 예시 문장 2개가 팝업으로 뜹니다.
  문장 원본은 `grade3/math/_ex/ex_<학기>_<단원>.py`이고 `python3 grade3/math/_ex/apply.py`가 HTML의 `panes()`를 고치고 칸마다 `ex: [...]`를 넣습니다(여러 번 실행해도 안전).
  **밖에서 새로 빌드한 앱으로 덮었으면 `apply.py`를 다시 돌리세요.** 그다음 `apply_content_theme.py`.
- **글쓰기 칸 '💡 도움'(2026-10-04):** 이야기 버전 12개 앱의 글쓰기 칸(`writeStep`)과 1학기 `thenWhy`('왜 그럴까요?')·`ruleFirst`('먼저 예상해요') 칸에 도움 단추가 있습니다(쓰는 차례·문장 틀 2줄, 답은 알려 주지 않음).
  문장 원본은 `grade3/math/_ex/help_<학기>_<단원>.py`(W·Y·R 차례), 넣기는 `python3 grade3/math/_ex/help.py`(여러 번 실행해도 안전), 빈 틀은 `help.py skel`. **앱을 새로 덮었으면 `apply.py`와 `help.py`를 둘 다 다시 돌리세요.**
- **글쓰기 칸 '✅ 답'(2026-10-04):** 이야기 버전 12개 앱에서 글쓰기 칸(`writeStep`)·'왜 그럴까요?'(`thenWhy`)에 쓰고 '다 썼어요'를 누르면 모범 답이 팝업으로 뜹니다(✕·닫기·바깥·Esc로 닫고, 그 뒤 '✅ 답 다시 보기' 단추가 남음). 1학기 '먼저 예상해요'(`ruleFirst`)는 예상을 쓰자마자 답이 보이면 안 되므로 조작을 마친 뒤 '실제 규칙'으로 뜹니다. 답 원본 `grade3/math/_ex/ans_<학기>_<단원>.py`(W·Y·R 차례, 칸마다 1개), 넣기 `python3 grade3/math/_ex/ans.py`(여러 번 실행해도 안전), 빈 틀 `ans.py skel`, 점검 `ans.py check`. `help.py` 다음에 돌립니다. 앱을 새로 덮어도 main에 올리면 자동 보완이 `apply.py`·`help.py`·`ans.py`·`pics.py`를 모두 다시 돌립니다.
- **나눗셈 결과 그림(2026-10-04):** 2학기 이야기 버전 `u2-div.html`의 결과 확인 계단 5곳(60÷3, 48÷4, 70÷5, 52÷4, 53÷4) 위에 '묶음마다 십·일 모형' 그림(나머지는 '남은 것' 칸)이 보입니다. 넣기는 `python3 grade3/math/_ex/pics.py`(여러 번 실행해도 안전). (자동 보완이 다시 돌림. 계단 이름이 바뀌어 못 찾으면 `todo.md`에 적힘)
- **수학 단원 앱은 이 저장소 밖에서 빌드해 들여옵니다**(차시 내용 `lessons*.js` + 공통 틀 `head.html`·`engine.js`를 합쳐 HTML 한 장으로). 그래서 새로 빌드한 파일로 덮으면
  손으로 넣어 둔 `<a id="hj-home">` 단추가 사라집니다. 덮은 뒤에는 **그 조각을 다시 넣고** `python3 _build/theme/apply_content_theme.py`를 돌리세요.
  (덮개 스크립트가 `#hj-home`을 읽어 왼쪽 위 `[홈 · 자료 목록]` 단추로 바꾸므로, 조각이 없으면 이동 단추가 통째로 사라집니다. 2026-10-01에 실제로 한 번 지워졌습니다.)

### 우리 반 교실 (`class/`, 2026-10-01)

- 첫 화면 맨 앞(1학년 앞) 넓은 카드 '🍎 우리 반 교실'이 가리키는 담임용 교실 바탕화면입니다. 8개 묶음 41개 메뉴.
- **`class/index.html`을 직접 고치지 마세요.** 원본은 `_build/class/`(`shell.html` 화면·CSS, `app.js` 기능, `qr.min.js` QR 라이브러리 MIT)이고 `python3 _build/class/build.py`로 다시 만듭니다.
- 자료는 그 기기 브라우저(localStorage `hj-class-v1`)에만 저장됩니다. 기기끼리 공유하려면 Firebase 등이 필요합니다(아직 없음). 날씨·미세먼지는 Open-Meteo(인증키 없음), 급식·시간표·학사 일정은 나이스 개방 포털(설정에서 학교 검색).

### 오늘의 교실 산책 (`today/`, 2026-10-01)

- 첫 화면 제목 아래 '🌟 오늘의 한 줄' 띠와 `today/index.html`(오늘의 사건·명언·명화·명곡·책)은 `_build/today/`에서 만듭니다. **두 파일을 직접 고치지 마세요.**
- 자료는 `_build/today/data.js`에 있습니다(날짜별 사건 `d:'MM-DD'`, 명언·명화·명곡·책 목록). 날마다 순서대로 바뀌고, 오늘 날짜의 사건이 없으면 가장 가까운 다음 날 사건을 보여 줍니다.
- 고친 뒤: `python3 _build/today/build.py && python3 _build/theme/apply_theme.py`
- 넣을 때는 날짜·인물·작품 정보를 꼭 확인하고, 어린이에게 알맞은 내용만 씁니다. 노래 가사·책 본문은 싣지 않습니다.

## 파일 이름

영어 소문자와 하이픈만 씁니다. `grade3/social/sem2/` 기준:

| 앞글자 | 뜻 | 예 |
|---|---|---|
| `u단원-l차시` | 차시별 수업 세트 | `u2-l1415.html` (2단원 14~15차시) |
| `t단원-주제` | 주제별 자료 모음 | `t2-transport.html` |
| `u단원-주제-data` | 자료실 | `u2-transport-data.html` |
| `a단원-이름` | 활동 자료 | `a2-bongsu.html` |
| `h단원-주제` | 개별 학습용(우표첩) | `h2-comm.html` |
| `u-이름` | 단원 공통 교사 자료 | `u-methods.html` |

## 모든 자료 페이지가 지켜야 할 것

- **HTML 파일 하나로 끝납니다.** CSS·JS·사진(base64)이 전부 안에 들어 있어야 합니다. 외부 파일을 참조하지 마세요. (글꼴 CDN만 예외)
- 맨 아래에 `만든 사람: 초등교사 홍지희`, 바로 밑에 **연락처 줄**(`<p class="hj-contact">` — ✉️ 이메일 hongjihee1005@gmail.com, ▶ 유튜브 @hongjihee1005).
  기존 페이지의 `<p class="hj-contact">`와 `<style id="hj-contact-css">` 조각을 그대로 복사해 쓰세요.
  (2026-10-03) 화면에서는 **메뉴 페이지(첫 화면~학기 목록)와 우리 반 교실에서만** 보이고, 수업 앱(첫 화면·진행 화면)에서는 `content.css`가 숨깁니다. HTML에는 그대로 넣어 두세요.
- 맨 아래 **`📋 자료 목록으로`** 단추 (`<a class="tolist" href="index.html">`).
  이 단추는 `file://`·`github.io`·`localhost`에서만 보이도록 스크립트로 제어합니다.
- 왼쪽 아래 **`🏠 홈`** 떠 있는 단추(`<a id="hj-home" href="../../../index.html">`, 첫 화면으로 가는 상대 경로).
  `자료 목록으로`와 같이 `file://`·`github.io`·`localhost`에서만 보이게 합니다. 기존 자료 페이지에 있는 조각을 그대로 복사해 쓰세요.
- 목록 페이지(`sem2/index.html`)에는 **🏠 / 🚀 학년 / 🗺️ 과목방** 이동 단추(`nav.crumb`)를 답니다.
- 다크 모드: `@media (prefers-color-scheme: dark)`와 `:root[data-theme="dark"]` 둘 다 정의합니다.
- 가로 스크롤이 생기면 안 됩니다. `word-break: keep-all`을 씁니다.

## 메뉴 페이지 디자인 (2026-10-01)

첫 화면·학년·과목·학기 목록 같은 **메뉴 페이지**는 공통 디자인을 씁니다(은은한 웜 파스텔, Pretendard 글꼴, 집 모양 홈·화살표 아이콘).
원본은 `_build/theme/theme.css`, `theme.js`이고, 페이지마다 그대로 복사해 넣습니다(한 파일 원칙 유지).

```bash
python3 _build/theme/apply_theme.py            # nav.crumb가 있는 모든 메뉴 페이지에 다시 적용
python3 _build/theme/apply_theme.py 새/목록/index.html
```

- **새 메뉴 페이지를 만들었거나 메뉴 HTML을 고쳤으면 꼭 다시 실행하세요.** 여러 번 실행해도 안전합니다.
- 위치 표시줄(`nav.crumb`)은 `<a class="back" href="…">🏠 초등교사 홍지희</a>`처럼 써 두면 스크립트가 홈 아이콘·꺾쇠 모양으로 바꿉니다.
- 색은 `theme.css`의 과목별 `--acc`(국어 산호·수학 살구·사회 하늘·과학 민트)에서 자동으로 옅은 색을 만듭니다. 태그의 `style="background:#…"` 색도 스크립트가 파스텔로 바꿉니다.
- **펼침 메뉴:** 방 카드 오른쪽 위 ⌄ 단추를 누르면 그 방 안의 메뉴(하위 방 카드, 없으면 차시별·주제별 같은 탭)가 펼쳐집니다.
  스크립트가 하위 페이지를 읽어 자동으로 만들므로, **하위 페이지에 방이나 탭을 추가·변경했으면 스크립트를 다시 실행**해야 위쪽 메뉴에도 반영됩니다.
- **아이콘:** 메뉴 HTML에는 이모지를 그대로 쓰면 됩니다. `_build/theme/icons.js`가 화면에서 같은 굵기의 선 아이콘으로 바꿉니다(방·제목 타일, 탭, 태그, 본문 속 🔒💻🖨️ 등). 학년 카드는 숫자, 자료 카드 제목(`.nm`)·소제목(h2·h3)의 이모지는 지웁니다. 새 이모지를 쓰려면 `icons.js`의 `m('아이콘', '이모지')` 목록에 넣으세요(없으면 타일은 점, 본문은 지워짐).
- 디자인을 바꾸려면 `theme.css`만 고치고 스크립트를 다시 돌립니다. 페이지마다 따로 고치지 마세요.

### 수업 자료 페이지 덮개 (2026-10-01)

메뉴가 아닌 **수업 자료·앱 페이지**에는 `_build/theme/content.css` 덮개를 씌웁니다. `Jua`·`Gowun Dodum` 글꼴 이름에 Pretendard(굵게·보통)를 연결하고, `--bg`·`--paper`·`--ink`·`--soft`·`--muted`·`--line`(수학 앱은 `--night`·`--pine`)을 밝고 따뜻한 색으로 덮어씁니다. 기능 코드는 건드리지 않습니다.

```bash
python3 _build/theme/apply_content_theme.py          # 모든 자료 페이지(메뉴·옛 주소 안내·class 제외)
```

- **새 자료를 올렸으면 이 스크립트도 실행하세요.** 여러 번 실행해도 안전합니다.
- 같은 스크립트가 하는 일(2026-10-01 추가): 진짜 Jua·Gowun Dodum 구글 글꼴 `<link>`를 빼서 Pretendard로 통일 / 이모지를 `.hj-em`으로 감싸 단색 Noto Emoji(`@fontsource/noto-emoji`, jsDelivr)로 표시 / 교사 안내 창(`#tnB`)에 인쇄·PDF, 구글 문서로(복사 후 docs.new), 이메일(Gmail·메일 앱 쓰기 화면) / 마지막 단계에서 '다음'을 누르면 다음 차시·자료 목록 고르기(`<meta name="hj-next">`, 폴더 index.html의 차시 카드 순서로 계산) / 읽어 주기·녹음 듣기 재생 막대(`#hj-player`) / 왼쪽 위 이동 단추 `[홈 · 자료 목록]`(`.hj-nav`: 수업 첫 화면 위줄, 수학 앱 머리줄, 과학 앱 위 탭줄, 그 밖은 본문 맨 위) — 이때 떠 있는 `#hj-home`은 숨김(HTML에는 그대로 두세요).
- 글꼴 주소는 `cdn.jsdelivr.net/npm/pretendard@1.3.9/…`(npm 경로)입니다.
- **과목 색(2026-10-02):** `content.js`가 주소의 `/korean/ /math/ /social/ /science/`를 읽어 `<html data-hjsubj>`를 붙이고, `content.css` 맨 아래 '과목 색' 묶음이 '다음'·'수업 시작'·`button.main`, 지금 단계(`.st.now`, 과학 위 탭), 고른 것(`.on/.sel`, 활동 단위), 과학 활동 이름표(`.stage`), 학습 문제 상자를 진한 과목 색(`--hjs`: 국어 #C9463B, 수학 #B4610F, 사회 #2B6FB8, 과학 #1F8060)으로 칠합니다. 색을 바꾸려면 그 네 줄만 고치세요.
- 같은 스크립트가 `_build/theme/content.js`도 넣습니다. 단추 앞의 이모지(👩‍🏫 교사 안내, 🏠, 🔊, ⛶, 📋, 💬 등)와 ←/→ 화살표를 선 아이콘으로 바꿉니다. 진행 화면 오른쪽 위 🏠는 '⌂ 홈'(수업 첫 화면으로) 단추가 됩니다. 새 이모지 단추는 `content.js`의 `LEAD` 목록에 추가하세요.

## 링크 점검 — 꼭 하세요

`href="..."`만 검사하면 **놓칩니다.** 자료실 페이지들은 자바스크립트 설정값 안에
`"f": "파일이름.html"` 형태로 링크를 갖고 있어서, 파일 이름을 바꾸면 조용히 깨집니다.
실제로 한 번 깨진 적이 있습니다. 두 가지를 모두 검사하세요:

```python
refs  = set(re.findall(r'href=["\']([\w\-]+\.html)["\']', s))
refs |= set(re.findall(r'["\']f["\']\s*:\s*["\']([\w\-]+\.html)["\']', s))
```

그리고 Playwright로 실제 열어 `pageerror`가 없는지, 본문이 비어 있지 않은지 확인합니다.

## 주소를 바꿀 때

학생이나 노션이 옛 주소를 갖고 있을 수 있습니다. **옛 파일을 그냥 지우지 마세요.**
옛 경로에 새 주소로 넘기는 안내 페이지를 남깁니다:

```html
<meta http-equiv="refresh" content="0; url=새/주소/index.html">
```

낡은 자료를 그대로 두면 학생이 **수정 전 내용**을 볼 수 있으므로, 내용 파일은 안내 페이지로 바꿉니다.

## 올리는 방법

`.nojekyll`이 있어 Pages가 파일을 그대로 서비스합니다. 밑줄로 시작하는 폴더도 안전합니다.

```bash
git clone --depth 1 https://github.com/hongjihee1005/hong_teacher /home/claude/hong_teacher
# 작업 후
git add -A && git commit
git fetch origin main && git rebase origin/main   # ← 반드시
git push origin HEAD:main
```

**`git fetch` + `rebase`를 건너뛰지 마세요.** 선생님이 다른 대화(수학·과학 등)에서
같은 저장소에 동시에 올리는 일이 잦습니다. 실제로 작업 중 세 번 밀렸습니다.
rebase 후에는 `git show --stat HEAD`로 **내 커밋이 내 파일만 건드렸는지** 확인하세요.

게시 반영에 1~2분 걸립니다.

## 노션

교사용 정리는 노션에 있습니다: `초등교사 홍지희의 학습 자료실 > 3학년 1학기(2학기) > 과목`
(3-1 수학은 `3학년 1학기 > 수학` 아래에 교과서 차시 버전·이야기 버전 하위 페이지가 있습니다.)
자료를 추가하거나 주소를 바꾸면 노션 링크도 함께 고칩니다.
