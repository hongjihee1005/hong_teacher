# 5-1 수학 단원 앱 만들기 — 교과서 차시 버전 (공통 지시)

You build ONE interactive lesson app (Korean, for 5th graders) for the static site repo /home/user/hong_teacher.
Read first: /home/user/hong_teacher/grade5/math/_build/README.md (file format, engine widgets, build & check commands), the unit spec (path given below), and as models the grade-3 textbook apps in /home/user/hong_teacher/grade3/math/sem1/ (e.g. u2-plane.html, u5-lentime.html, u6-fracdec.html — look at their `const LESSONS` and their unit widget section to copy style, density, tone and widget quality). The grade-3 README /home/user/hong_teacher/grade3/math/sem1/README.md describes the version.

WRITE ONLY your own source file: /home/user/hong_teacher/grade5/math/_build/units/sem2/<slug>.tb.js  (other agents work on other units in parallel; never edit templates, build.py, other units, or anything outside your file; never run git).
Build & check ONLY your unit: `cd /home/user/hong_teacher/grade5/math/_build && python3 build.py <slug> && node check.js <slug>` (check must report 이상 없음 at both widths). Do not run apply_content_theme.py.

CONTENT RULES
- Follow the 지도서 exactly: same 차시 numbers and count, same lesson titles (교과서 제목), same 소재/등장인물/상황/수, same 약속하기 definitions. Each lesson: steps following 만져 보기 → 그려 보기 → 말해 보기 → 약속하기 → 확인하기 (5 steps, names may be refined with `name` like grade 3) + a ★challenge (도전) from 교과서 '스스로'/익힘 level problems. 생각을 더하다 / 놀이를 더하다 / 공부한 내용을 확인해요 lessons follow the spec's task.
- Interactive and visual: build unit widgets (prefix given below) with SVG (use makeSvg/svgEl/txt/dragOn from the engine) so students MANIPULATE (drag, click, measure, build) rather than only pick answers — at least one real manipulation in most lessons, as in grade 3. Widgets must scale (viewBox) and never cause horizontal overflow at 800px and 1366px widths.
- Every answer must be mathematically correct; compute numbers in code where possible and double-check by hand. Figures must exactly match the numbers in the text (angles drawn at the stated degrees, grid shapes at stated cells, bar heights at stated values, etc.).
- Grade-5 appropriate (2022 revised curriculum, 5-2): do not use content from later units/grades. Kid-friendly Korean (해요체), correct particles after numbers (write a small helper for 이/가, 을/를, 은/는 when text is generated), no "10을 넘으면" type wording when '10이거나 10보다 크면' is meant.
- `why` keys in quiz are option indices; in numbers they are the wrong numeric value — only add why entries for mistakes that really produce that value.
- Multi-select quiz uses a:[i,j]. Avoid near-ambiguous figures (e.g. a shape that looks almost square but isn't).
- numbers() accepts only plain numbers. For answers like "3억 2000만", "1,000,000", text, or angle with °, write your own unit widget (text input, normalise spaces/commas) — then judge with api.done/api.fail.
- APP line: title = short story title for the unit (like grade 3: "안전 체험관 평면도형"), unit: "5-2 수학 N. <단원명>(교과서)", key "t52-<name>-v1", welcome & intro sentences.
- UNIT_STORY (title, 3 lines incl. a line "교과서 「수학 5-2」 N. <단원명>의 차시 순서 그대로 만들었어요."), UNIT_KEYWORDS (8–16 core terms).

When finished, give a concise Korean report: 차시 list (no·title·widgets used), what you could not match to the 지도서 and why, and the check.js result.

SEMESTER 2 NOTE: this is a 5-2 (2학기) unit. Your source file lives in units/sem2/ and builds to grade5/math/sem2/. Models: also look at the finished grade-5 1학기 sources in /home/user/hong_teacher/grade5/math/_build/units/*.tb.js for quality/style. Shared cover CSS hides empty <span>s — put ​ in empty cells; avoid generic class names (.top .ex .ln .rc .fb .st .an .on .sel .card) — use your prefix.


GRADE 5 NOTE: also study the finished, audited grade-4 sources in /home/user/hong_teacher/grade4/math/_build/units/ (and units/sem2/) as the best models of quality, widgets and the STORY-ENGINE TRAP handling (/home/user/hong_teacher/_build/mathplan/BRIEF_AUDIT.md). Grade-5 level only (2022 revised curriculum).

BUTTON WORDING: never put the word '다음' in any button label other than the engine's own '다음 계단' (the shared site cover treats any button containing '다음' as lesson navigation). Use '이어서 …' or '한 판 더'.
