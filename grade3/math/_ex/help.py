#!/usr/bin/env python3
"""수학 이야기 버전 글쓰기 칸 '💡 도움' 넣기 (2026-10-03)

  python3 help.py skel sem2-soop/u2-div.html > help_sem2_u2_div.py   -> 빈 틀(글쓰기 칸 목록과 차시 맥락)
  python3 help.py check help_sem2_u2_div.py                          -> 검사(HTML은 안 고침)
  python3 help.py                                                    -> help_*.py 를 모든 앱에 넣음(여러 번 실행해도 안전)
  그다음 저장소 루트에서 python3 _build/theme/apply_content_theme.py grade3/math/sem*-soop/u*.html

- 수학 앱은 HTML이 원본이라 이 스크립트가 HTML을 직접 고칩니다(사고 전략 칸의 '💡 예시'는 apply.py).
  ① helpPop() 함수와 CSS를 넣고, writeStep()의 글쓰기 칸과 inqWrite()(thenWhy·ruleFirst)에 '💡 도움' 단추를 답니다(표시 /*hj-help*/)
  ② 차시 데이터에 help: ["…", "…"]를 넣습니다.
     W: writeStep(b, a, [...]) 호출 차례마다 [칸마다 2줄 …]   (칸 = 목록 안의 { q: … })
     Y: thenWhy((b, a) => …, { q, ph }) 호출 차례마다 2줄       (고른 다음 '왜 그럴까요?' 칸)
     R: ruleFirst((b, a) => …, { q, ph }) 호출 차례마다 2줄     ('먼저 예상해요' 칸)
- 도움은 예시 답안이 아니라 '쓰는 차례·넣을 것'을 알려 줍니다.
"""
import re, sys, os, glob, json, importlib
HERE = os.path.dirname(os.path.abspath(__file__))
MATH = os.path.dirname(HERE)
sys.path.insert(0, HERE)

CSS = ('/*hj-help*/.hlpwrap{position:relative}.hlpq{display:flex;align-items:center;gap:.4em;flex-wrap:wrap}.hlpq .hlpt{flex:1;min-width:0}'
       '.hlpb{flex:none;margin-left:auto;font-family:inherit;font-size:.72em;padding:.15em .7em;border-radius:999px;border:2px solid #B4610F;background:#fff;color:#B4610F;cursor:pointer;white-space:nowrap}'
       '.hlpb[aria-expanded="true"]{background:#B4610F;color:#fff}'
       '.hlpop{display:none;position:absolute;z-index:30;left:.3em;right:.3em;background:#fff;border:3px solid #B4610F;border-radius:.7em;padding:.5em 2em .5em .8em;box-shadow:0 8px 22px rgba(0,0,0,.18);word-break:keep-all;color:var(--ink,#1F2A44);text-align:left}'
       '.hlpop.on{display:block}.hlpop .exh{margin:0 0 .15em;font-family:"Jua";font-size:.95em;color:#B4610F}'
       '.hlpop ul{margin:0;padding-left:1.1em;line-height:1.5}.hlpop .exf{margin:.15em 0 0;font-size:.8em;color:var(--muted,#667)}'
       '.hlpop .exx{position:absolute;top:.2em;right:.3em;border:0;background:transparent;font-size:1.1em;cursor:pointer;color:var(--muted,#667)}'
       '@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .hlpop,:root:not([data-theme="light"]) .hlpb:not([aria-expanded="true"]){background:#1E2A28;color:#EEF3F1}}'
       ':root[data-theme="dark"] .hlpop,:root[data-theme="dark"] .hlpb:not([aria-expanded="true"]){background:#1E2A28;color:#EEF3F1}/*/hj-help*/\n')

HELPER = '''/*hj-help*/ /* 글쓰기 칸 '💡 도움': help:["…","…"] → 질문 옆 단추, 누르면 입력칸 아래 팝업(쓰는 차례·넣을 것) */
function helpPop(lines, ta) {
  if (!lines || !lines.length) return ["", ""];
  const pop = h("div", { class: "hlpop", role: "dialog", "aria-label": "도움" },
    h("button", { class: "exx", type: "button", "aria-label": "닫기", onclick: () => helpClose() }, "✕"),
    h("p", { class: "exh" }, "이렇게 써 보면 좋아요"), h("ul", {}, ...lines.map(x => h("li", {}, x))),
    h("p", { class: "exf" }, "차례대로 생각하며 내 말로 써요."));
  const btn = h("button", { class: "hlpb", type: "button", "aria-expanded": "false", onclick: () => {
    const on = !pop.classList.contains("on"); helpClose(); if (!on) return;
    pop.style.top = (ta.offsetTop + ta.offsetHeight + 6) + "px"; pop.classList.add("on"); btn.setAttribute("aria-expanded", "true");
    pop.scrollIntoView({ block: "nearest" });
  } }, "💡 도움");
  return [btn, pop];
}
function helpClose() { document.querySelectorAll(".hlpop.on").forEach(p => { p.classList.remove("on"); const b = p.parentElement.querySelector(".hlpb"); if (b) b.setAttribute("aria-expanded", "false"); }); }
if (!window.__helpPop) { window.__helpPop = 1;
  document.addEventListener("click", e => { if (!e.target.closest(".hlpop,.hlpb")) helpClose(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") helpClose(); }); }
/*/hj-help*/
'''
REPL = [  # (옛, 새) — 1학기 앱만 inqWrite가 있음
    ('const areas = prompts.map(p => { const t = h("textarea", { placeholder: p.ph || "여기에 써요" }); body.append(h("div", { class: "jua", style: "margin-top:.6em" }, p.q), t); return t; });',
     'const areas = prompts.map(p => { const t = h("textarea", { placeholder: p.ph || "여기에 써요" }); const hp = helpPop(p.help, t); /*hj-help*/ body.append(h("div", { class: "hlpwrap" }, h("div", { class: "jua hlpq", style: "margin-top:.6em" }, h("span", { class: "hlpt" }, p.q), hp[0]), t, hp[1])); return t; });'),
    ('function inqWrite(q, ph, btnText, onOk, api) {', 'function inqWrite(q, ph, btnText, onOk, api, help) { /*hj-help*/'),
    ('return h("div", { class: "inqbox" }, h("div", { class: "jua" }, q), t, h("div", { class: "inqrow" }, btn));',
     'const hp = helpPop(help, t); /*hj-help*/ return h("div", { class: "inqbox hlpwrap" }, h("div", { class: "jua hlpq" }, h("span", { class: "hlpt" }, q), hp[0]), t, hp[1], h("div", { class: "inqrow" }, btn));'),
    ('      }, api));\n', None),  # thenWhy 안의 inqWrite 호출 끝(아래에서 함수 안에서만 바꿈)
]


def scan(s, i):
    """s[i]가 '(' 또는 '[' 다음 위치일 때, 닫는 괄호 위치와 최상위 쉼표 위치들"""
    depth = 1; commas = []; j = i; prev = '('
    while depth:
        c = s[j]
        if c in '"\'`':
            q = c; j += 1
            while s[j] != q:
                if s[j] == '\\': j += 1
                elif q == '`' and s[j] == '$' and s[j + 1] == '{':
                    k, _ = scan(s, j + 2); j = k
                j += 1
        elif c == '/' and s[j + 1] == '/':
            j = s.index('\n', j)
        elif c == '/' and s[j + 1] == '*':
            j = s.index('*/', j) + 1
        elif c == '/' and prev in '(,=:[!&|?{};+':
            j += 1
            while s[j] != '/':
                if s[j] == '\\': j += 1
                elif s[j] == '[':
                    while s[j] != ']': j += 1
                j += 1
        elif c in '([{': depth += 1
        elif c in ')]}': depth -= 1
        elif c == ',' and depth == 1: commas.append(j)
        if not c.isspace(): prev = c
        j += 1
    return j - 1, commas


def sites(s):
    """W: writeStep 목록의 칸 { q: } 객체들, Y/R: thenWhy·ruleFirst의 마지막 인자 객체 — (시작, 끝) 위치"""
    W, Y, R = [], [], []
    for m in re.finditer(r'writeStep\(b, a, \[', s):
        end, commas = scan(s, m.end())
        objs = []
        for im in re.finditer(r'\{ *q: *', s[m.end():end]):
            a = m.end() + im.start(); k, _ = scan(s, a + 1); objs.append((a, k))
        W.append(objs)
    for name, out in (('thenWhy', Y), ('ruleFirst', R)):
        for m in re.finditer(name + r'\(\(b, a\)', s):
            end, commas = scan(s, m.end() - len('(b, a)'))
            a = commas[-1] + 1
            while s[a].isspace(): a += 1
            assert s[a] == '{', (name, s[a:a + 40])
            k, _ = scan(s, a + 1); out.append((a, k))
    return W, Y, R


HRE = re.compile(r', help: \[(?:"(?:[^"\\]|\\.)*"(?:, )?)*\]')


def patch(path, M):
    s = open(path, encoding='utf-8').read()
    if '/*hj-help*/' not in s:
        for old, new in REPL[:3]:
            if old.startswith('function inqWrite') or old.startswith('return h("div", { class: "inqbox" }'):
                if old not in s: continue
            assert s.count(old) == 1, (path, old[:40]); s = s.replace(old, new)
        # thenWhy·ruleFirst가 inqWrite에 help를 넘기게
        for fn, arg in (('function thenWhy(main, why) {', 'why.help'), ('function ruleFirst(main, opts) {', 'opts.help')):
            if fn not in s: continue
            a = s.index(fn); k = s.index('inqWrite(', a); end, _ = scan(s, k + len('inqWrite('))
            if fn.startswith('function ruleFirst'):  # ruleFirst의 첫 inqWrite는 '먼저 예상해요' 칸
                k = s.index('inqWrite("✏️ 먼저 예상해요', a); end, _ = scan(s, k + len('inqWrite('))
            s = s[:end] + ', ' + arg + ' /*hj-help*/' + s[end:]
        s = s.replace('function writeStep(body, api, prompts, opts = {}) {', HELPER + 'function writeStep(body, api, prompts, opts = {}) {', 1)
        k = s.index('.phint{'); k = s.index('\n', k) + 1; s = s[:k] + CSS + s[k:]
    s = HRE.sub('', s)
    W, Y, R = sites(s)
    assert [len(x) for x in W] == [len(x) for x in M.W] and len(Y) == len(M.Y) and len(R) == len(M.R), (path, '칸 수가 앱과 다름')
    edits = []
    for objs, v in zip(W, M.W):
        for (a, k), lines in zip(objs, v):
            if all(lines): edits.append((k, lines))
    for (a, k), lines in list(zip(Y, M.Y)) + list(zip(R, M.R)):
        if all(lines): edits.append((k, lines))
    for k, lines in sorted(edits, reverse=True):
        k2 = k
        while s[k2 - 1] == ' ': k2 -= 1
        s = s[:k2] + ', help: ' + json.dumps(lines, ensure_ascii=False) + s[k2:]
    open(path, 'w', encoding='utf-8').write(s)
    return len(edits)


def ctx(s, pos):
    b = s[:pos]
    def last(p):
        m = list(re.finditer(p, b)); return m[-1].group(1) if m else ''
    t = list(re.finditer(r'no: *(\d+), *title: *"([^"]*)"', b))
    return (' '.join(t[-1].groups()) if t else ''), last(r'question: *"([^"]*)"'), last(r'inst: *"([^"]*)"')


if __name__ == '__main__':
    a = sys.argv[1:]
    if a[:1] == ['skel']:
        rel = a[1]; s = HRE.sub('', open(os.path.join(MATH, rel), encoding='utf-8').read()); W, Y, R = sites(s)
        print(f"# {rel} 글쓰기 칸 '💡 도움' — 예시 답안이 아니라 쓰는 차례·넣을 것 2줄. (help.py skel로 만든 틀)\nFILE = {rel!r}")
        for name, xs in (('W', W), ('Y', Y), ('R', R)):
            print(f'{name} = [')
            for n, x in enumerate(xs):
                objs = x if name == 'W' else [x]
                c = ctx(s, objs[0][0] if objs else 0)
                print(f'  # [{name}{n}] 차시 {c[0]} | 질문: {c[1]}\n  # 안내: {c[2][:150]}')
                for o in objs: print(f'  #   칸: {s[o[0]:o[1] + 1][:200]}')
                print('  [' + ', '.join(['["", ""]'] * len(objs)) + '],' if name == 'W' else '  ["", ""],')
            print(']')
        sys.exit()
    if a[:1] == ['check']:
        M = importlib.import_module(os.path.basename(a[1])[:-3]); s = HRE.sub('', open(os.path.join(MATH, M.FILE), encoding='utf-8').read())
        W, Y, R = sites(s); bad = 0
        if [len(x) for x in W] != [len(x) for x in M.W] or len(Y) != len(M.Y) or len(R) != len(M.R): print('칸 수가 앱과 다름'); bad += 1
        for lines in [l for v in M.W for l in v] + list(M.Y) + list(M.R):
            if len(lines) != 2 or not all(x.strip() for x in lines): bad += 1
        print('문제', bad); sys.exit()
    tot = 0
    for mod in sorted(glob.glob(os.path.join(HERE, 'help_*.py'))):
        M = importlib.import_module(os.path.basename(mod)[:-3]); tot += patch(os.path.join(MATH, M.FILE), M); print('넣음', M.FILE)
    print('도움 칸', tot)
