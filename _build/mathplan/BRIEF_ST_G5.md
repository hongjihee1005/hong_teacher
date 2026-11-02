# 5-1 수학 단원 앱 만들기 — 이야기 버전(홍지희 선생님 버전) (공통 지시)

You build the STORY version of ONE grade-5 unit app (Korean) for the repo /home/user/hong_teacher.
Read first: /home/user/hong_teacher/grade5/math/_build/README.md; the unit spec (path below); the finished TEXTBOOK version source of the same unit /home/user/hong_teacher/grade5/math/_build/units/<slug>.tb.js (reuse its unit widgets — copy them into your file, generalise via opt; do NOT edit the .tb.js); and as models the grade-3 story apps in /home/user/hong_teacher/grade3/math/sem1-soop/ (e.g. u1-addsub.html, u5-lentime.html — study their LESSONS: S.O.O.P. flow, panes with ex, thenWhy/ruleFirst/wonderRecall/withOptional usage, writeStep help & ans, tone), plus /home/user/hong_teacher/grade3/math/sem1-soop/README.md and 3-1수학_개념계단_전체안내.md.

WRITE ONLY: /home/user/hong_teacher/grade5/math/_build/units/<slug>.st.js. Never edit other files; never run git or apply_content_theme.
Build & check ONLY your unit: `cd /home/user/hong_teacher/grade5/math/_build && python3 build.py <slug> && node check.js <slug>` (must be 이상 없음 at both widths for both versions).

WHAT THE STORY VERSION IS
- Same concepts, achievement standards and roughly the same number of 차시 as the textbook version (may merge/split, typically 9–12), but ONE continuous story from the class's own school life (theme given below; invent named classmates; keep it realistic and kind), different numbers and situations from the textbook.
- Each lesson has `soop`: 1차시 "개념 찾기(S)", most "개념 구축하기(O)", a summary lesson "탐구 정리하기(O)" if useful, and 1–2 "발표하기(P)" lessons (project/presentation/game) near the end; last lesson recalls the 1차시 wonders with wonderRecall.
- 1차시 step 1 is `panes` 보여요/생각해요/궁금해요 (each with ex: two example sentences). Use thenWhy (q, ph, help:[2 lines: 쓰는 차례·문장 틀], ans: model answer) on concept steps, ruleFirst (q, ph, help, ans = 실제 규칙) where students predict a rule before manipulating, writeStep prompts with help (2 lines) and ans (one model answer, 3rd-grade-ish friendly sentence, factually correct). Every panes cell has ex (2 examples). These are inline fields (no separate _ex files for grade 4).
- Steps follow 만져 보기 → 그려 보기 → 말해 보기 → 약속하기 → 확인하기 (+★도전), with step names like the grade-3 story version ("만져 보기 — …").
- Auto-check: the story engine checks automatically (autoRun). Your custom widgets must use autoRun(ready, sign, run, wait) too (inputs 900ms, choices 260ms, drag/colour 1200ms) and must not fire while the student is still choosing (wait until enough input). Don't add 확인하기 buttons except where trying many times is the activity itself.
- A step may contain two activities (e.g. blanks + writeStep): the engine now requires both to be finished.
- Same CONTENT RULES as the textbook brief: exact maths (compute in code), figures match numbers, grade-5 level only, correct particles, why-keys only for real mistakes, multi-select a:[…], no near-ambiguous figures.
- APP: title = story title, unit "5-1 수학 N. <단원명>", key "s51-<name>-v1". UNIT_STORY (title, 3 lines, one), UNIT_KEYWORDS.

Final answer (Korean, concise): story summary, 차시 list (no·title·soop), what differs from the textbook version, check.js result.

EXTRA NOTES (learned while building): the shared site cover CSS hides empty <span>s — put a zero-width space (​) in empty grid cells; avoid generic class names (.top .ex .ln .rc .fb .st .an .on .sel .card) on your own elements — use your prefix (e.g. d3s-).


GRADE 5 NOTE: also study the finished, audited grade-4 sources in /home/user/hong_teacher/grade4/math/_build/units/ (and units/sem2/) as the best models of quality, widgets and the STORY-ENGINE TRAP handling (/home/user/hong_teacher/_build/mathplan/BRIEF_AUDIT.md). Grade-5 level only (2022 revised curriculum).

BUTTON WORDING: never put the word '다음' in any button label other than the engine's own '다음 계단' (the shared site cover treats any button containing '다음' as lesson navigation). Use '이어서 …' or '한 판 더'.
