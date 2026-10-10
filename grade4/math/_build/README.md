# 4학년 수학 앱 빌드 (2026-10-10)

4-1 수학 단원 앱은 **3학년 앱과 같은 엔진**을 쓰고, 단원마다 원본 파일 두 개로 만듭니다.
3학년 앱(HTML이 원본)과 달리 **4학년은 이 폴더의 `units/*.js`가 원본**입니다. `sem1/`·`sem1-soop/`의 단원 HTML은 직접 고치지 마세요.

```
units/u2-angle.tb.js   → ../sem1/u2-angle.html        교과서 차시 버전
units/u2-angle.st.js   → ../sem1-soop/u2-angle.html   이야기 버전(홍지희 선생님 버전)
python3 build.py [u2-angle]   # 만들기(자바스크립트 문법도 점검)
python3 ../../../_build/theme/apply_content_theme.py   # 공통 덮개(루트에서)
node check.js                 # 모든 차시·계단을 열어 오류·가로 넘침 점검
```

틀은 `tpl_tb.html`(3학년 `sem1/u4-mul.html`의 엔진)·`tpl_st.html`(3학년 `sem1-soop/u5-lentime.html`의 엔진, 여러 활동 계단 `hj-multi` 포함)입니다.
3학년 엔진을 고쳐 4학년에도 넣으려면 `python3 make_templates.py` 후 `build.py`.

## 단원 원본 파일의 짜임

한 파일은 세 묶음입니다.

```js
//@@APP
const APP={title:"…", unit:"4-1 수학 2. 각도(교과서)", key:"t41-angle-v1", welcome:"… 온 것을 환영해요", intro:"…"};
//@@UNIT
/* 단원 조작 부품: function a2Xxx(body, api, opt) {...}  (앞글자는 단원마다 다르게) */
//@@LESSONS
const UNIT_STORY = { title: "…", lines: ["…", "…"], one: "한 줄 소개" };
const UNIT_KEYWORDS = ["…"];
const LESSONS = [ { id: "t1", no: 1, title: "…", soop: "개념 찾기(S)", question: "…", summary: "…", steps: [ … ], challenge: { … } }, … ];
```

- `key`: 교과서 `t41-<이름>-v1`, 이야기 `s41-<이름>-v1`(기록 저장 이름, 바꾸면 학생 기록이 새로 시작됨).
- `soop`: `개념 찾기(S)` · `개념 구축하기(O)` · `탐구 정리하기(O)` · `발표하기(P)`.
- 계단 `{ name?, inst, hints:[…], render: (b, a) => 부품(b, a, …), words?, answer?, easy? }` — `name`이 없으면 `STEP_NAMES`(만져 보기·그려 보기·말해 보기·약속하기·확인하기) 차례 이름.
- 엔진 부품: `quiz(b,a,[{q,o:[…],a:번호|[번호…],why:{"번호":"까닭"},fig}],{ok,bad})` · `blanks(b,a,["글",{o:[…],a:번호},…])` · `numbers(b,a,[{q,a:수,unit,why:{"틀린 수":"까닭"}}],{ok})`(수만 받음) · `sequence(b,a,cards,order)` · `writeStep(b,a,[{q,tag,ph,help:[두 줄],ans}])` ·
  이야기 버전만: `panes(b,a,[{t,e,ph,hint,ex:[예시 두 개]}])` · `thenWhy(render,{q,ph,help,ans})` · `ruleFirst(render,{q,ph,help,ans})` · `wonderRecall(render)` · `withOptional(render, extra, {title,inst})` · `predictCheck(b,a,{ask,o,a,then,real,unit,why})`.
- 단원 부품은 `function xxXxx(body, api, opt)` 꼴로 쓰고, 맞으면 `api.done(답 글, 칭찬)`, 틀리면 `api.fail(까닭, 답 글)`, 채점할 때마다 `api.tryOnce()`. 도움 3단계(답 따라 쓰기)를 쓰려면 `api.provide({words, answers})`.
- 교과서 버전은 '확인하기' 단추, 이야기 버전은 단추 없이 `autoRun`으로 저절로 확인합니다(3학년과 같음). **'다음 계단' 단추의 글자·자리는 바꾸지 마세요.**
