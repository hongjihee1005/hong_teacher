# 수학 단원 앱 독립 점검(두 번 점검의 ①) — 공통 지시

You are an independent auditor of ONE grade-N math unit (both versions) in /home/user/hong_teacher. Someone else built it; assume there are mistakes.
Sources: gradeN/math/_build/units/[sem2/]<slug>.tb.js (교과서) and <slug>.st.js (이야기). Built apps: gradeN/math/<sem>/<slug>.html and <sem>-soop/<slug>.html. Read gradeN/math/_build/README.md first. Spec of the 지도서 (if given) is the reference for the textbook version.

CHECK EVERYTHING, lesson by lesson, step by step, both versions:
1. Mathematics: recompute every answer, hint, why-message, praise sentence, model answer (ans), example (ex) and 정답 page text. Any number in text must match the figure (draw/measure in code where useful).
2. Interaction: with Playwright (executablePath /opt/pw-browsers/chromium, file:// URLs, abort network) actually solve every step with the correct answer and confirm it is accepted (the '다음 계단' becomes available / done state), and try at least one typical wrong answer to see sensible feedback. Look for steps that cannot be completed, auto-check firing too early (story version), stuck states, overlapping/clipped text in figures (take screenshots at 1366 and 800 width of figure-heavy steps and LOOK at them).
3. Level and goals: grade-N 2022 curriculum level only, each lesson reaches its stated question/goal, no content from later grades.
4. Korean: particles after numbers/letters (이/가, 을/를, 은/는, 과/와, 으로/로), spelling, 해요체, kind tone.
5. Textbook version vs spec: 차시 numbers/titles/numbers match the 지도서 spec.

FIX what you find directly in the .js sources (keep fixes minimal and local), then `cd gradeN/math/_build && python3 build.py <slug> && node check.js <slug>` must be 이상 없음. If a worksheet generator gradeN/math/_build/sheets/gen_<slug>.py exists and your fix changes a number/answer that the worksheet also uses, fix the generator too and re-run it (`python3 gen_<slug>.py`, all files must pass check).
Do not edit other units, templates, or anything else; never run git or theme scripts.
Anything that truly needs the teacher's judgement (지도서 itself contradictory, can't be verified) — don't block; list it under "선생님 확인 필요".

Report in Korean, concise: list of problems found → fixed (lesson/step, before → after), things checked by actually solving, remaining "선생님 확인 필요".
