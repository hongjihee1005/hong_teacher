#!/usr/bin/env python3
"""수학 이야기 버전(sem1-soop·sem2-soop) 사고 전략 칸별 예시 넣기 (2026-10-03)

  python3 apply.py list sem2-soop/u1-mul.html   -> 칸 목록(차시·단계·칸 이름)을 보여 줌(예시 쓸 때 참고)
  python3 apply.py                              -> ex_*.py 의 예시를 모든 앱에 넣음(여러 번 실행해도 안전)
  그다음 저장소 루트에서 python3 _build/theme/apply_content_theme.py grade3/math/sem*-soop/u*.html

- 수학 앱은 HTML이 원본이므로(CLAUDE.md) 이 스크립트가 HTML을 직접 고칩니다.
  ① panes()가 칸 제목 옆에 '💡 예시' 단추를 그리게 고침(표시 /*hj-ex*/)
  ② panes(...) 목록의 칸마다 ex: ["…", "…"]를 넣음
- 예시 문장 원본: ex_<학기>_<파일>.py 의 EX = { 차례(0부터): [[첫 칸 2개], [둘째 칸 2개], …] }
  '차례'는 그 앱에서 panes(...)가 나오는 순서입니다. 칸 이름 목록 T로 앱과 맞는지 검사합니다.
"""
import re, sys, os, glob, json, importlib
HERE = os.path.dirname(os.path.abspath(__file__))
MATH = os.path.dirname(HERE)
sys.path.insert(0, HERE)
from sig import ctx, remap
TODO = []  # 짝이 없는 새 칸(내용이 필요함)

CSS = ('/*hj-ex*/.pane{position:relative}.pane h3 .pt{flex:1;min-width:0}'
       '.pane .exb{flex:none;font-family:inherit;font-size:.62em;padding:.15em .6em;border-radius:999px;border:2px solid currentColor;background:#fff;color:inherit;cursor:pointer;white-space:nowrap}'
       '.pane .exb[aria-expanded="true"]{color:#fff!important}.pane0 .exb[aria-expanded="true"]{background:#2B7BD6}.pane1 .exb[aria-expanded="true"]{background:#6A4FC9}.pane2 .exb[aria-expanded="true"]{background:#D9731A}.pane3 .exb[aria-expanded="true"]{background:#2F6B57}'
       '.pane .expop{display:none;position:absolute;z-index:30;left:.4em;right:.4em;background:#fff;border:3px solid;border-radius:.7em;padding:.5em 2em .5em .8em;box-shadow:0 8px 22px rgba(0,0,0,.18);word-break:keep-all;color:var(--ink,#1F2A44)}'
       '.pane .expop.on{display:block}.pane .expop .exh{margin:0 0 .15em;font-family:"Jua";font-size:.95em}'
       '.pane .expop ul{margin:0;padding-left:1.1em;line-height:1.5}.pane .expop .exf{margin:.15em 0 0;font-size:.8em;color:var(--muted,#667)}'
       '.pane .expop .exx{position:absolute;top:.2em;right:.3em;border:0;background:transparent;font-size:1.1em;cursor:pointer;color:var(--muted,#667)}'
       '.pane0 .expop{border-color:#2B7BD6}.pane0 .exh{color:#2B7BD6}.pane1 .expop{border-color:#6A4FC9}.pane1 .exh{color:#6A4FC9}'
       '.pane2 .expop{border-color:#D9731A}.pane2 .exh{color:#D9731A}.pane3 .expop{border-color:#2F6B57}.pane3 .exh{color:#2F6B57}'
       '@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .pane .expop,:root:not([data-theme="light"]) .pane .exb{background:#1E2A28;color:#EEF3F1}}'
       ':root[data-theme="dark"] .pane .expop,:root[data-theme="dark"] .pane .exb{background:#1E2A28;color:#EEF3F1}/*/hj-ex*/\n')

HELPER = '''/*hj-ex*/ /* 사고 전략 칸별 예시: 칸 설정의 ex:["…","…"] → 제목 옆 '💡 예시' 단추, 누르면 팝업(입력칸 아래, 입력칸은 가리지 않음) */
function paneEx(p) {
  if (!p.ex || !p.ex.length) return ["", ""];
  const pop = h("div", { class: "expop", role: "dialog", "aria-label": p.t + " 예시" },
    h("button", { class: "exx", type: "button", "aria-label": "닫기", onclick: () => paneExClose() }, "✕"),
    h("p", { class: "exh" }, "이렇게 써 볼 수 있어요"), h("ul", {}, ...p.ex.map(x => h("li", {}, x))),
    h("p", { class: "exf" }, "내가 생각한 것으로 바꿔 써요."));
  const btn = h("button", { class: "exb", type: "button", "aria-expanded": "false", onclick: () => {
    const on = !pop.classList.contains("on"); paneExClose(); if (!on) return;
    const sec = btn.closest(".pane"), row = sec.querySelector(".prow");
    pop.style.top = (row.offsetTop + row.offsetHeight + 6) + "px"; pop.classList.add("on"); btn.setAttribute("aria-expanded", "true");
    pop.scrollIntoView({ block: "nearest" });
  } }, "💡 예시");
  return [btn, pop];
}
function paneExClose() { document.querySelectorAll(".expop.on").forEach(p => { p.classList.remove("on"); const b = p.parentElement.querySelector(".exb"); if (b) b.setAttribute("aria-expanded", "false"); }); }
if (!window.__paneEx) { window.__paneEx = 1;
  document.addEventListener("click", e => { if (!e.target.closest(".expop,.exb")) paneExClose(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") paneExClose(); }); }
/*/hj-ex*/
'''
H3_OLD = 'h("h3", {}, h("span", { class: "pe" }, p.e || "•"), " " + p.t),'
H3_NEW = 'h("h3", {}, h("span", { class: "pe" }, p.e || "•"), h("span", { class: "pt" }, " " + p.t), pex[0]), /*hj-ex*/'
SEC_OLD = 'wrap.append(h("section", { class: "pane pane" + pi },'
SEC_NEW = 'const pex = paneEx(p); /*hj-ex*/\n    wrap.append(h("section", { class: "pane pane" + pi },'
ROW_OLD = 'h("div", { class: "prow" }, inp, h("button", { class: "opt", onclick: add }, "붙이기"))));'
ROW_NEW = 'h("div", { class: "prow" }, inp, h("button", { class: "opt", onclick: add }, "붙이기")), pex[1])); /*hj-ex*/'


def calls(s):
    """panes(...) 목록마다 (목록 시작, 끝, 칸들[(시작, 끝, t)])"""
    out = []
    for m in re.finditer(r'panes\(b[a-z]*, *a[a-z]*, *\[', s):
        i = m.end(); depth = 1; j = i; q = None
        while depth:
            c = s[j]
            if q:
                if c == '\\': j += 1
                elif c == q: q = None
            elif c in '"\'`': q = c
            elif c == '[': depth += 1
            elif c == ']': depth -= 1
            j += 1
        items = []
        for im in re.finditer(r'\{ *t: *"([^"]*)"', s[i:j - 1]):
            a = i + im.start(); k = a; d = 0; q = None
            while True:
                c = s[k]
                if q:
                    if c == '\\': k += 1
                    elif c == q: q = None
                elif c in '"\'`': q = c
                elif c == '{': d += 1
                elif c == '}':
                    d -= 1
                    if d == 0: break
                k += 1
            items.append((a, k, im.group(1)))
        out.append((i, j - 1, items))
    return out


def context(s, pos):
    """panes 호출 앞의 차시 제목·질문과 단계 이름·안내"""
    before = s[:pos]
    def last(pat):
        m = list(re.finditer(pat, before)); return m[-1].group(1) if m else ''
    return {'차시': last(r'no: *(\d+), *title: *"([^"]*)"') and ' '.join(list(re.finditer(r'no: *(\d+), *title: *"([^"]*)"', before))[-1].groups()),
            '질문': last(r'question: *"([^"]*)"'), '단계': last(r'name: *"([^"]*)"'), '안내': last(r'inst: *"([^"]*)"')}


EXRE = re.compile(r', ex: \[(?:"(?:[^"\\]|\\.)*"(?:, )?)*\]')


def sigs(s, cs):
    """panes 묶음마다 이름표 [차시 번호, 단계 안내, 칸 제목들]"""
    return [ctx(s, i) + [[t for _, _, t in items]] for i, _, items in cs]


def patch(path, EX, T, SIG=None):
    s = open(path, encoding='utf-8').read()
    if '/*hj-ex*/' not in s:
        assert s.count(H3_OLD) == 1 and s.count(SEC_OLD) == 1 and s.count(ROW_OLD) == 1, path
        s = s.replace(H3_OLD, H3_NEW).replace(SEC_OLD, SEC_NEW).replace(ROW_OLD, ROW_NEW)
        s = s.replace('function panes(body, api, list, opts = {}) {', HELPER + 'function panes(body, api, list, opts = {}) {', 1)
        k = s.index('.phint{'); k = s.index('\n', k) + 1; s = s[:k] + CSS + s[k:]
    s = EXRE.sub('', s)
    cs = calls(s)
    if SIG is None:
        assert len(cs) == len(T), (path, '칸 묶음 수', len(cs), len(T))
        for n, (_, _, items) in enumerate(cs):
            assert [t for _, _, t in items] == T[n], (path, n, [t for _, _, t in items], T[n])
    else:  # 칸 이름표로 짝 찾기(sig.py) — 앱의 차시·칸 차례가 바뀌어도 원래 칸을 찾아감
        cur = sigs(s, cs); mp = remap(SIG, cur); EX2 = {}
        for j, g in enumerate(cur):
            if j in mp and mp[j] in EX: EX2[j] = EX[mp[j]]
            else: TODO.append(f'예시 {os.path.relpath(path, MATH)} 차시 {g[0]} | {g[1][:60]} | {" / ".join(g[2])}'[:300])
        EX = EX2
    edits = []
    for n, v in EX.items():
        if all(x == '' for c in v for x in c): continue  # 아직 안 쓴 묶음은 건너뜀
        items = cs[n][2]
        assert len(v) == len(items) and all(len(x) == 2 and all(x) for x in v), (path, n, '칸마다 예시 2개')
        for (a, k, t), ex in zip(items, v):
            k2 = k
            while s[k2 - 1] == ' ': k2 -= 1
            edits.append((k2, ', ex: ' + json.dumps(ex, ensure_ascii=False)))
    for k, txt in sorted(edits, reverse=True):
        s = s[:k] + txt + s[k:]
    open(path, 'w', encoding='utf-8').write(s)
    return sum(len(v) for v in EX.values() if any(x for c in v for x in c))


if __name__ == '__main__':
    if len(sys.argv) > 2 and sys.argv[1] == 'list':
        p = os.path.join(MATH, sys.argv[2]); s = open(p, encoding='utf-8').read()
        for n, (i, j, items) in enumerate(calls(s)):
            c = context(s, i)
            print(f'\n[{n}] 차시 {c["차시"]} | 질문: {c["질문"]}\n    단계: {c["단계"]} | 안내: {c["안내"]}')
            for a, k, t in items: print('    -', s[a:k + 1])
        sys.exit()
    if len(sys.argv) > 2 and sys.argv[1] == 'skel':  # 빈 틀: python3 apply.py skel sem2-soop/u1-mul.html > ex_sem2_u1_mul.py
        p = os.path.join(MATH, sys.argv[2]); s = open(p, encoding='utf-8').read(); cs = calls(s)
        print(f"# {sys.argv[2]} 사고 전략 칸별 예시. 칸마다 2개, 차시의 핵심 질문과 이어지게.\nFILE = {sys.argv[2]!r}")
        print('T = ' + json.dumps([[t for _, _, t in it] for _, _, it in cs], ensure_ascii=False))
        print('EX = {')
        for n, (i, j, items) in enumerate(cs):
            c = context(s, i)
            print(f' # [{n}] 차시 {c["차시"]} | 질문: {c["질문"]}\n # 단계: {c["단계"]} | 안내: {c["안내"]}')
            print(f' {n}: [')
            for a, k, t in items: print(f'  # {s[a:k + 1]}\n  ["", ""],')
            print(' ],')
        print('}'); sys.exit()
    if len(sys.argv) > 2 and sys.argv[1] == 'check':  # 예시 파일만 검사(HTML은 안 고침): python3 apply.py check ex_sem1_u1_addsub.py
        M = importlib.import_module(os.path.basename(sys.argv[2])[:-3]); bad = 0
        s = open(os.path.join(MATH, M.FILE), encoding='utf-8').read(); cs = calls(EXRE.sub('', s))
        if [[t for _, _, t in it] for _, _, it in cs] != M.T: print('칸 이름이 앱과 다름'); bad += 1
        for n, (_, _, items) in enumerate(cs):
            v = M.EX.get(n)
            if v is None or len(v) != len(items): print('묶음', n, '칸 수 다름'); bad += 1; continue
            for t, c in zip([t for _, _, t in items], v):
                if len(c) != 2 or not all(x.strip() for x in c): print('묶음', n, t, '예시 2개가 아님'); bad += 1
        print('문제', bad); sys.exit()
    tot = 0
    for mod in sorted(glob.glob(os.path.join(HERE, 'ex_*.py'))):
        M = importlib.import_module(os.path.basename(mod)[:-3])
        tot += patch(os.path.join(MATH, M.FILE), M.EX, M.T, getattr(M, 'SIG', None)); print('넣음', M.FILE)
    print('칸', tot)
