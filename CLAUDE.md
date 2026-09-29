# hong_teacher — 초등교사 홍지희 수업자료 사이트

GitHub Pages로 게시되는 정적 사이트입니다. 학생이 주소를 열면 자료가 바로 실행됩니다.
첫 화면: https://hongjihee1005.github.io/hong_teacher/

**이 파일은 이 저장소에서 작업할 때의 규칙입니다.**
자료를 *어떻게 만드는지*(교육과정, 글자 크기, 앱 구성, 검증 절차)는 claude.ai 프로젝트
"3학년 수업자료 준비"의 `claude/수업자료실-제작-안내.md` 문서에 있습니다. 새 자료를 만들기 전에 그 문서를 먼저 읽으세요.

---

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

### 아직 정리되지 않은 곳 (2026-09-28)

- **`science/` 26개가 아직 루트에 있습니다.** 3-2 과학 앱입니다.
  구조대로라면 `grade3/science/sem2/`로 가야 합니다. 옮길 때는 아래 "주소를 바꿀 때"를 따르세요.
- 루트의 `social/`, `math/`, `u1-*.html`, `u2-*.html`은 **옛 주소용 안내 페이지**입니다. 지우지 마세요.

### 수학 (`grade3/math/`)

- `sem1/`, `sem2/` — 교과서 차시 버전(공개). 단원 앱 `u단원-주제.html`(예: `u1-addsub.html`), 활동지 `sheets/*.hwpx`.
  `sem1/download/`에는 활동지·앱을 한꺼번에 받는 zip이 있습니다.
- `sem1-soop/`, `sem2-soop/` — 이야기 버전 **잠금 방**. `d/` 안의 파일은 AES-GCM으로 암호화되어 있어
  **직접 고치면 안 됩니다.** 원본을 고친 뒤 다시 암호화해서 `d/` 전체를 바꿉니다(비밀번호는 저장소에 적지 않음).
- `sem1.html`은 옛 주소 → `sem1/index.html` 안내 페이지입니다. 지우지 마세요.

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
- 맨 아래에 `만든 사람: 초등교사 홍지희`
- 맨 아래 **`📋 자료 목록으로`** 단추 (`<a class="tolist" href="index.html">`).
  이 단추는 `file://`·`github.io`·`localhost`에서만 보이도록 스크립트로 제어합니다.
- 왼쪽 아래 **`🏠 홈`** 떠 있는 단추(`<a id="hj-home" href="../../../index.html">`, 첫 화면으로 가는 상대 경로).
  `자료 목록으로`와 같이 `file://`·`github.io`·`localhost`에서만 보이게 합니다. 기존 자료 페이지에 있는 조각을 그대로 복사해 쓰세요.
- 목록 페이지(`sem2/index.html`)에는 **🏠 / 🚀 학년 / 🗺️ 과목방** 이동 단추(`nav.crumb`)를 답니다.
- 다크 모드: `@media (prefers-color-scheme: dark)`와 `:root[data-theme="dark"]` 둘 다 정의합니다.
- 가로 스크롤이 생기면 안 됩니다. `word-break: keep-all`을 씁니다.

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
