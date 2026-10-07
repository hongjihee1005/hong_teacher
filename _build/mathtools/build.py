#!/usr/bin/env python3
"""기타 › 수학게임 › 수학 교구실 페이지 만들기 (2026-10-07)

    python3 _build/mathtools/build.py          # project/mathtools/<교구>.html (먼저 점검)
    python3 _build/mathtools/build.py check    # 점검만

교구 목록은 tools.py, 공통 틀 page.html·page.css·shell.js, 교구마다 tools/<id>.js(window.TOOL(host, api))·tools/<id>.css.
메뉴 project/mathtools/index.html은 손으로 고치는 메뉴(apply_theme.py). 고친 뒤 루트에서 python3 _build/theme/apply_content_theme.py.
"""
import re, sys, json, pathlib
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
OG = ROOT / '_build' / 'origami'
OUT = ROOT / 'project' / 'mathtools'
sys.dont_write_bytecode = True
sys.path.insert(0, str(HERE))
from tools import TOOLS

def check():
    bad, ids = [], set()
    for t in TOOLS:
        if t['id'] in ids: bad.append(f"{t['id']}: 겹침")
        ids.add(t['id'])
        for k in ('title', 'ico', 'acc', 'desc', 'rec', 'how', 'ideas'):
            if not t.get(k): bad.append(f"{t['id']}: {k} 빔")
        js = HERE / 'tools' / f"{t['id']}.js"
        if not js.exists() or 'window.TOOL = function' not in js.read_text(encoding='utf-8'): bad.append(f"{t['id']}: tools/{t['id']}.js 없음")
        if not (HERE / 'tools' / f"{t['id']}.css").exists(): bad.append(f"{t['id']}: css 없음")
    return bad

def build(t):
    rd = lambda f: f.read_text(encoding='utf-8')
    gnav = ''.join(f'<a href="{x["id"]}.html"' + (' aria-current="page"' if x is t else '') + f'>{x["title"]}</a>' for x in TOOLS)
    rep = {'TITLE': t['title'], 'DESC': t['desc'], 'ICO': t['ico'], 'REC': t['rec'], 'GNAV': gnav,
           'HOW': '<ul>' + ''.join(f'<li>{x}</li>' for x in t['how']) + '</ul>', 'IDEAS': ''.join(f'<li>{x}</li>' for x in t['ideas']),
           'DATA': json.dumps({'id': t['id']}), 'TOOL': rd(HERE / 'tools' / f"{t['id']}.js"), 'SHELL': rd(HERE / 'shell.js'),
           'CSS': rd(HERE / 'page.css').replace('{ACC}', t['acc']).replace('{TOOLCSS}', rd(HERE / 'tools' / f"{t['id']}.css")),
           'HEADSNIP': rd(OG / 'head_snip.html'),
           'FOOT': rd(OG / 'foot.html').replace('쉬는 시간에 친구와 함께 즐기는 종이접기 자료입니다.', '화면에서 직접 만지며 배우는 수학 교구 자료입니다.'),
           'HOMEFRAG': rd(OG / 'home.html').replace('{HOME}', '../../index.html')}
    s = re.sub(r'\{([A-Z]+)\}', lambda m: rep.get(m.group(1), m.group(0)), rd(HERE / 'page.html'))
    out = OUT / f"{t['id']}.html"; out.parent.mkdir(parents=True, exist_ok=True)
    old = out.read_text(encoding='utf-8') if out.exists() else ''
    strip = lambda x: re.sub(r'<!--hj-c(?:theme|icons)-->.*?<!--/hj-c(?:theme|icons)-->', '', x, flags=re.S)
    if strip(old) == s: return False
    out.write_text(s, encoding='utf-8'); return True

if __name__ == '__main__':
    bad = check()
    if bad: print('\n'.join(bad)); sys.exit('수학 교구실 점검 실패')
    print('수학 교구실 점검 통과')
    if sys.argv[1:] == ['check']: sys.exit(0)
    n = sum(build(t) for t in TOOLS)
    print(f'수학 교구실 {n}쪽 다시 만듦 (모두 {len(TOOLS)}가지)')
