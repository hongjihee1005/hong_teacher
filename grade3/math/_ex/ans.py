#!/usr/bin/env python3
"""수학 이야기 버전 글쓰기 칸 '✅ 답' 팝업 넣기 (2026-10-04)

  python3 ans.py skel sem2-soop/u2-div.html > ans_sem2_u2_div.py   -> 빈 틀(글쓰기 칸·도움·차시 맥락)
  python3 ans.py check                                             -> ans_*.py 검사(HTML은 안 고침)
  python3 ans.py                                                   -> ans_*.py 를 모든 앱에 넣음(여러 번 실행해도 안전)
  그다음 저장소 루트에서 python3 _build/theme/apply_content_theme.py grade3/math/sem*-soop/u*.html

- help.py(도움)를 먼저 돌린 앱에 씁니다. 학생이 '다 썼어요'를 누르면(4글자 이상 써서 통과하면) 답이 팝업으로 뜨고,
  ✕·닫기·바깥 누르기·Esc로 닫습니다. 닫은 뒤에는 '✅ 답 다시 보기' 단추가 남습니다(표시 /*hj-ans*/).
  · W: writeStep(b, a, [...]) 호출 차례마다 [칸마다 답 1개 …]  → 칸 객체에 ans: "…"
  · Y: thenWhy(…, { q, ph }) 차례마다 답 1개('왜 그럴까요?' 칸)
  · R: ruleFirst(…, { q, ph }) 차례마다 답 1개 — 예상을 쓰자마자 보이면 활동이 의미가 없으므로,
       조작을 마치고 '내 예상이 맞았나요?'가 나올 때 '실제 규칙'으로 뜹니다.
- 답 원본: ans_<학기>_<단원>.py. 빈 문자열("")인 칸은 답을 띄우지 않습니다.
"""
import re, sys, os, glob, json, importlib
HERE = os.path.dirname(os.path.abspath(__file__))
MATH = os.path.dirname(HERE)
sys.path.insert(0, HERE)
from help import scan, sites, ctx, HRE  # 같은 칸 찾기
from sig import align, wyr
TODO = []  # 짝이 없는 새 칸(내용이 필요함)

CSS = ('/*hj-ans*/.ansbg{position:fixed;inset:0;z-index:90;background:rgba(30,25,20,.38);display:flex;align-items:center;justify-content:center;padding:16px}'
       '.ansbox{position:relative;width:min(640px,100%);max-height:86vh;overflow:auto;background:#fff;border:3px solid #1F9E63;border-radius:16px;padding:16px 46px 14px 20px;box-shadow:0 14px 40px rgba(0,0,0,.25);word-break:keep-all;text-align:left;color:var(--ink,#1F2A44)}'
       '.ansbox .anh{margin:0 0 .3em;font-family:"Jua";font-size:1.15em;color:#1F7A4D}'
       '.ansbox dl{margin:0}.ansbox dt{font-family:"Jua";color:var(--muted,#667);font-size:.9em;margin-top:.4em}.ansbox dd{margin:.1em 0 0;line-height:1.55;font-size:1.05em}'
       '.ansbox .anf{margin:.6em 0 .2em;font-size:.85em;color:var(--muted,#667)}'
       '.ansbox .anx{position:absolute;top:6px;right:8px;border:0;background:transparent;font-size:1.3em;cursor:pointer;color:var(--muted,#667);padding:2px 8px}'
       '.ansbox .anok{display:block;margin:.4em 0 0 auto;font-family:"Jua";font-size:1em;padding:.35em 1.4em;border-radius:999px;border:0;background:#1F9E63;color:#fff;cursor:pointer}'
       '.ansre{font-family:inherit;font-size:.85em;margin:.5em 0 0;padding:.25em .9em;border-radius:999px;border:2px solid #1F9E63;background:#fff;color:#1F7A4D;cursor:pointer}'
       '@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .ansbox,:root:not([data-theme="light"]) .ansre{background:#1E2A28;color:#EEF3F1}}'
       ':root[data-theme="dark"] .ansbox,:root[data-theme="dark"] .ansre{background:#1E2A28;color:#EEF3F1}/*/hj-ans*/\n')

HELPER = '''/*hj-ans*/ /* 글쓰기 칸 '✅ 답': 다 쓰고 나면 답 팝업. items: [[칸 이름, 답], …], after: '답 다시 보기' 단추를 붙일 곳 */
function ansShow(items, after, head) {
  items = (items || []).filter(x => x[1]);
  if (!items.length) return;
  const open = () => {
    ansClose();
    const box = h("div", { class: "ansbox", role: "dialog", "aria-modal": "true", "aria-label": "답" },
      h("button", { class: "anx", type: "button", "aria-label": "닫기", onclick: ansClose }, "✕"),
      h("p", { class: "anh" }, head || "✅ 이렇게 쓸 수 있어요"),
      h("dl", {}, ...items.flatMap(([t, v]) => (items.length > 1 || head) ? [h("dt", {}, t), h("dd", {}, v)] : [h("dd", {}, v)])),
      h("p", { class: "anf" }, "내가 쓴 글과 견주어 봐요. 말이 달라도 뜻이 같으면 잘 쓴 거예요."),
      h("button", { class: "anok", type: "button", onclick: ansClose }, "닫기"));
    const bg = h("div", { class: "ansbg", onclick: e => { if (e.target === bg) ansClose(); } }, box);
    document.body.append(bg); box.querySelector(".anok").focus();
  };
  if (after && !after.__ansre) { after.__ansre = 1; after.after(h("button", { class: "ansre", type: "button", onclick: open }, "✅ 답 다시 보기")); }
  open();
}
function ansClose() { document.querySelectorAll(".ansbg").forEach(x => x.remove()); }
if (!window.__ansShow) { window.__ansShow = 1; document.addEventListener("keydown", e => { if (e.key === "Escape") ansClose(); }); }
/*/hj-ans*/
'''
REPL = [  # (옛, 새, 꼭 있어야 하나)
    ('    api.done(prompts.map((p, i) => `${p.tag || p.q}: ${vals[i]}`).join(" | "), opts.ok || "생각을 잘 적었어요!");\n  } }, "다 썼어요")));',
     '    api.done(prompts.map((p, i) => `${p.tag || p.q}: ${vals[i]}`).join(" | "), opts.ok || "생각을 잘 적었어요!");\n'
     '    ansShow(prompts.map(p => [p.tag || p.q, p.ans]), act); /*hj-ans*/\n  } }, "다 썼어요")));', True),
    ('  body.append(h("div", { class: "actions" }, h("button", { class: "big", onclick: () => {\n    const vals = areas.map(t => t.value.trim());',
     '  const act = h("div", { class: "actions" }); /*hj-ans*/\n  body.append(act); act.append(h("button", { class: "big", onclick: () => {\n    const vals = areas.map(t => t.value.trim());', True),
    ('        api.done(first + " | 왜: " + v, firstMsg || "까닭까지 말했어요!");\n',
     '        api.done(first + " | 왜: " + v, firstMsg || "까닭까지 말했어요!");\n        ansShow([["까닭", why.ans]], btn); /*hj-ans*/\n', False),
    ('      slot.append(box);\n    } });\n    const show = () =>',
     '      slot.append(box);\n      ansShow([["실제 규칙", opts.ans]], row, "✅ 실제 규칙은 이래요"); /*hj-ans*/\n    } });\n    const show = () =>', False),
]
ARE = re.compile(r', ans: "(?:[^"\\]|\\.)*"')


def patch(path, M):
    s = open(path, encoding='utf-8').read()
    if '/*hj-ans*/' not in s:
        for old, new, need in REPL:
            if not need and old not in s: continue
            assert s.count(old) == 1, (path, old[:50]); s = s.replace(old, new)
        # writeStep 끝 괄호: 원래 'body.append(h("div", …)));' → act.append(…)); 로 바뀌었으니 괄호 하나 줄임
        k = s.index('ansShow(prompts.map'); e = s.index('"다 썼어요")));', k)
        s = s[:e] + '"다 썼어요"));' + s[e + len('"다 썼어요")));'):]
        s = s.replace('function writeStep(body, api, prompts, opts = {}) {', HELPER + 'function writeStep(body, api, prompts, opts = {}) {', 1)
        k = s.index('.phint{'); k = s.index('\n', k) + 1; s = s[:k] + CSS + s[k:]
    s = ARE.sub('', s)
    W, Y, R = sites(s)
    MW, MY, MR = align(s, W, Y, R, M, '', TODO, '답')  # 칸 이름표로 짝 찾기(sig.py)
    edits = []
    for objs, v in zip(W, MW):
        for (a, k), t in zip(objs, v):
            if t: edits.append((k, t))
    for (a, k), t in list(zip(Y, MY)) + list(zip(R, MR)):
        if t: edits.append((k, t))
    for k, t in sorted(edits, reverse=True):
        k2 = k
        while s[k2 - 1] == ' ': k2 -= 1
        s = s[:k2] + ', ans: ' + json.dumps(t, ensure_ascii=False) + s[k2:]
    open(path, 'w', encoding='utf-8').write(s)
    return len(edits)


def mods():
    return [importlib.import_module(os.path.basename(m)[:-3]) for m in sorted(glob.glob(os.path.join(HERE, 'ans_*.py')))]


if __name__ == '__main__':
    a = sys.argv[1:]
    if a[:1] == ['skel']:
        rel = a[1]; s = ARE.sub('', open(os.path.join(MATH, rel), encoding='utf-8').read()); W, Y, R = sites(s)
        print(f"# {rel} 글쓰기 칸 '✅ 답' — 다 쓴 뒤 보여 줄 모범 답 1개(3학년 말투, 1~2문장). (ans.py skel로 만든 틀)\nFILE = {rel!r}")
        for name, xs in (('W', W), ('Y', Y), ('R', R)):
            print(f'{name} = [')
            for n, x in enumerate(xs):
                objs = x if name == 'W' else [x]
                c = ctx(s, objs[0][0] if objs else 0)
                print(f'  # [{name}{n}] 차시 {c[0]} | 질문: {c[1]}\n  # 안내: {c[2][:150]}')
                for o in objs: print(f'  #   칸: {s[o[0]:o[1] + 1][:400]}')
                print('  [' + ', '.join(['""'] * len(objs)) + '],' if name == 'W' else '  "",')
            print(']')
        sys.exit()
    if a[:1] == ['check']:
        bad = 0
        for M in mods():
            s = ARE.sub('', open(os.path.join(MATH, M.FILE), encoding='utf-8').read()); W, Y, R = sites(s)
            if [len(x) for x in W] != [len(x) for x in M.W] or len(Y) != len(M.Y) or len(R) != len(M.R): print(M.FILE, '칸 수가 앱과 다름'); bad += 1
            empty = sum(1 for t in [t for v in M.W for t in v] + list(M.Y) + list(M.R) if not t.strip())
            if empty: print(M.FILE, '빈 답', empty); bad += 1
        print('문제', bad); sys.exit()
    tot = 0
    for M in mods(): tot += patch(os.path.join(MATH, M.FILE), M); print('넣음', M.FILE)
    print('답 칸', tot)
