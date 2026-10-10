# 4~6학년 수학 활동지(hwpx) 만들기 — 단원 하나, 두 버전 × 기본형·도전형 (공통 지시)

You make the printable HWPX worksheets (Korean 한글 documents) for ONE finished unit, in both versions.
Repo /home/user/hong_teacher. Grade dir = gradeN/math (N given below). Semester folder sem1|sem2 (given below).

READ FIRST
- gradeN/math/_build/sheets/hwpxgen.py docstring (API: Sheet, lesson, scene, step, picture, text, ask, choices, labeled, wordbox, fill, table, lines, page_break, answers, save; svg_to_png; `python3 hwpxgen.py check file.hwpx`).
- The two finished app sources of your unit: gradeN/math/_build/units/[sem2/]<slug>.tb.js (교과서 차시 버전) and <slug>.st.js (이야기 버전). The worksheets must follow the app lessons EXACTLY: same 차시 numbers, titles, soop, questions, story, numbers.
- Models: grade-3 worksheets grade3/math/sem1/sheets/*_활동지_기본형.hwpx / *_도전형.hwpx and grade3/math/sem1-soop/sheets/* (unzip and read Contents/section0.xml text to see their density, step structure ①만져 보기…⑤확인하기, how 기본형 vs 도전형 differ, and the 교사용 정답 page at the end).

WRITE ONLY
- A generator script gradeN/math/_build/sheets/gen_<slug>.py (run: `python3 gen_<slug>.py`) that builds 4 files:
  gradeN/math/<sem>/sheets/<U>단원_<단원명 붙여쓰기>_활동지_기본형.hwpx, ..._도전형.hwpx   (교과서 버전, unit_label "N-S 수학 U. 단원명(교과서 차시)")
  gradeN/math/<sem>-soop/sheets/<same names>   (이야기 버전, unit_label "N-S 수학 U. 단원명(이야기 버전)")
  e.g. 1단원_큰수_활동지_기본형.hwpx. Figures: make SVG in the script and svg_to_png into a temp dir (not the repo). Sheet(..., grade_label='N학년').
- Never edit other files; never run git or theme scripts.

CONTENT
- One lesson (or two pages if needed) per 차시, every 차시 of the app. 기본형: core steps with scaffolds (word box, fill-in sentences, simpler numbers). 도전형: fewer scaffolds plus the app's ★도전-level problems and a 'why' writing line. Both print well (no overflowing tables; figures ≤ 180mm wide).
- Every answer correct — compute in the script where possible. Figures must match the numbers (angles at stated degrees, grid shapes exact, graph values exact).
- End each file with s.answers("【교사용】 U. 단원명(버전) 활동지 정답 (기본형|도전형)", [one line per 차시], note="※ 이 활동지는 앱 <slug>.html과 차시 번호가 같습니다.").
- Kid-friendly 해요체, correct particles.

CHECK: `python3 hwpxgen.py check <each file>` must pass for all 4 files. Then report (Korean, concise): files made, pages/차시 per file, anything you could not match.
