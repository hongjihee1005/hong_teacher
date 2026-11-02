# 4-1 과학 · 홍지희 선생님 버전(실험·탐구 중심) 차시 쓰기 안내 (작업자용)

한국 초등 4학년 1학기 과학 차시를 `lessons_uN.py`에 씁니다. 선생님께 질문할 수 없으니 판단해서 끝까지 해 주세요.
선생님 요청(2026-10-24): 3학년 홍지희 버전처럼 **"지도서랑 비교해서, 실험·탐구 위주로"** 4학년 1학기를 만듭니다.
틀은 3학년 2학기 홍지희 버전(`grade3/science/_build_hong2/`, 선생님 확인 완료)을 그대로 씁니다. 3학년 안내서 `grade3/science/_build_hong2/BRIEF_WRITER.md`를 먼저 끝까지 읽으세요 — 설계 원칙·견본 검토 실수·화면 기준은 그대로 지킵니다. 아래는 4학년에서 달라지는 것입니다.

## 먼저 읽을 것
1. `grade3/science/_build_hong2/BRIEF_WRITER.md`, `README.md` (설계 원칙 1~9, 실수 목록, 화면 기준)
2. **견본** `grade3/science/_build_hong2/lessons_u1.py`(특히 `sci32-u1-l2`)와 `lessons_u3.py`(측정 실험) — 구조, notes0, 단계별 note, 분 합계 40(두 차시 80)을 그대로 따릅니다.
3. 엔진: 이 폴더의 `engine_lab2.js`(design·pgrid·board·gcmp·claim, 맨 위 주석에 표 세 모양), `engine_social.js`(see/sort/cards/csq/venn/cse/iuti/task/check/talk), `engine_science.js`(pred/lab/pvr).
4. **지도서 텍스트**(Google Drive PDF에서 뽑은 글, 마크다운 모양): `/tmp/claude-0/-home-user-hong-teacher/23ed6b94-6e4b-561e-99c8-0096d7177c7b/scratchpad/g4/s41N.txt` (N = 단원). `[**Page N**]`이 PDF 쪽이고, 지도서 쪽 번호는 본문 아래 꼬리말 "NNN 수업 지도의 실제" / "N. 단원명 NNN"으로 확인합니다. 교과서 축소본 쪽(「과학」 쪽)은 축소본 안의 굵은 숫자(**14** 등)와 '교과서 4-1-1(012,014-035)' 같은 파일 이름 꼬리말로 확인합니다. **단원 앞쪽(단원 개관·차시 구성·성취기준·단원 지도상의 유의점·평가 계획)을 먼저 읽고 TOPIC·STD·UNIT_NOTES를 만드세요.**

## 4학년에서 달라지는 것
- **키·파일**: lessonKey `sci41-uN-lM`(두 차시면 `l56`처럼), 파일 `uN-lM.html`, 결과 폴더 `grade4/science/sem1/`. `TOPIC['key']`는 `sci41uN`. `sub`는 `'4학년 1학기 과학 N단원 · M차시 · 「과학」 a~b쪽 · 「실험관찰」 c~d쪽'`(두 차시는 `'5~6차시(80분)'`, 창의가 팡팡은 `· 창의가 팡팡`).
- **넣는 차시**: 3학년과 같게 2차시부터 '창의가 팡팡'까지(1차시 '열려라 과학'과 '과학이 톡톡'·'배움이 탄탄'은 넣지 않음). 지도서 '교과서 차시 구성'을 따르고, 두 차시로 묶인 것은 한 파일(80분)로.
- **`soop`**: 'S'(개념 찾기, 단원 첫 탐구) · 'O1'(개념 구축, 실험 차시) · 'O2'(탐구 정리·조사) · 'P'(발표·설계·창의가 팡팡). 3학년 파일에서 어떻게 붙였는지 참고.
- **사진 대신 그림**: 이 환경에서 위키미디어를 받을 수 없습니다. `photos`에 `{'svg': '<svg viewBox="0 0 200 140">…</svg>', 'name': '물체 이름'}`으로 **직접 그린 단순한 그림**을 넣으세요(build.py가 이미지로 넣음, 출처는 '직접 그림'). 그림은 그 물체로 알아볼 수 있게, 답(예: 붙는다/안 붙는다, 극 이름)을 그림에 쓰지 마세요. 이미 받아 둔 사진(`ls /home/user/hong_teacher/_build/wmcache`)에 알맞은 것이 있으면 `{'f': 'File:….jpg', 'name': …}`로 써도 됩니다(빌드할 때 `WM_CACHE=/home/user/hong_teacher/_build/wmcache`). 그림 파일은 lessons 파일 위쪽에 함수/상수로 모아 두세요(3학년 `rod()`·`ico()` 처럼).
- **가상 실험실 링크(`link`)는 쓰지 않습니다**(4학년 교과서 버전 앱이 없음). 여러 날 걸리는 실험은 3학년 원칙 4처럼 "오늘 준비 → ○일 뒤 관찰"로.
- 학생 화면 말투는 4학년도 '~해요'. 문장은 짧게. 4학년 수준 낱말은 지도서가 쓰는 대로(예: 극, 나침반, 증발, 끓음, 응결, 퇴적, 화강암·현무암).
- **단원 지도상의 유의점은 지도서에서 직접 찾아 UNIT_NOTES와 설계에 반영**합니다(다루지 않는 개념은 쓰지 않기, 안전 유의점은 `safe`·note에). 특히 화산·지진 단원은 지나친 두려움을 주지 않게, 실험은 가열·뜨거운 물·얼음·자석 끼임 등 안전을 꼭 넣습니다.

## 사고전략 칸별 예시 (`examples_uN.py`)
차시를 다 쓴 뒤 3학년처럼 `examples_uN.py`(`EX[lessonKey][단계 이름 t] = [[첫째 칸 2개], [둘째 칸 2개], …]`)를 만들고 `python3 ex_check.py N`으로 빠진 칸이 없는지 확인하세요. 규칙은 `grade3/science/_build_hong2/README.md` '사고전략 칸별 예시'와 같습니다(결론 전체를 미리 알려 주지 않기, 그림에 보이는 것만).

## 만들기·점검
- `cd /home/user/hong_teacher/grade4/science/_build && WM_CACHE=/home/user/hong_teacher/_build/wmcache python3 -B build.py sci41-uN-l2 …` (자기 단원 차시만. 파일은 늘 문법이 맞는 상태로 저장)
- `python3 -B check.py ../sem1/uN-….html … --shots /tmp/claude-0/-home-user-hong-teacher/23ed6b94-6e4b-561e-99c8-0096d7177c7b/scratchpad/g4/shots/uN` → JS 오류·가로넘침·스크롤 0이 될 때까지. 자료판·비교·결론 화면은 데모 자료를 localStorage에 넣고 스크린숏으로 확인(키: `soop:<lessonKey>:pg<g>`, `soop:<lessonKey>:bd<g>`). 스크린숏을 Read로 몇 장 직접 보세요(그림이 알아볼 만한지).
- **git 커밋·푸시 금지.** 공용 파일(build.py, engine_*.js, *.css, shell_*.html, check.py, wm.py, index_build.py, ex_check.py)은 고치지 마세요. 엔진에 꼭 필요한 기능이 있으면 보고서에 적으세요. 지도서 텍스트를 저장소 안에 복사하지 마세요(저작물).

## 최종 보고 (차시마다 4~5줄)
흐름(단계와 분), 아이들이 직접 정하거나 재는 것, 교과서에서 그대로 가져온 것, 지도서에서 확인하지 못한 것, 그림으로 대신한 것.
