#!/usr/bin/env python3
"""기타 › 수학게임 › 수학 마술 페이지 만들기 (2026-10-07)

    python3 _build/magic/build.py          # project/magic/<마술>.html (먼저 점검)
    python3 _build/magic/build.py check

마술 목록·비밀 풀이는 tricks.py, 화면 page.html + magic.css(수학 교구실 page.css·shell.js를 같이 씀), 마술마다 tricks/<id>.js(window.TRICK(host, api), 다 하면 api.done()).
메뉴 project/magic/index.html은 손으로 고치는 메뉴(apply_theme.py). 고친 뒤 루트에서 python3 _build/theme/apply_content_theme.py.
"""
import re, sys, json, pathlib, html
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
OG = ROOT / '_build' / 'origami'
MT = ROOT / '_build' / 'mathtools'
OUT = ROOT / 'project' / 'magic'
sys.dont_write_bytecode = True
sys.path.insert(0, str(HERE))
from tricks import TRICKS

def check():
    bad, ids = [], set()
    for t in TRICKS:
        if t['id'] in ids: bad.append(t['id'] + ': 겹침')
        ids.add(t['id'])
        for k in ('title', 'ico', 'acc', 'rec', 'intro', 'think', 'secret', 'friend'):
            if not t.get(k): bad.append(f"{t['id']}: {k} 빔")
        js = HERE / 'tricks' / f"{t['id']}.js"
        if not js.exists() or 'window.TRICK = function' not in js.read_text(encoding='utf-8'): bad.append(f"{t['id']}: tricks/{t['id']}.js 없음")
    # 수학 점검: 1089, 수 카드, 9의 마술, 11 곱하기
    for n in range(100, 1000):
        a, c = n // 100, n % 10
        if abs(a - c) < 2: continue
        r = int(str(n)[::-1]); d = abs(n - r); rd = int(str(d).zfill(3)[::-1])
        if d + rd != 1089: bad.append(f'1089 아님: {n}'); break
    for n in range(1, 32):
        if sum(k for k in (1, 2, 4, 8, 16) if n & k) != n: bad.append(f'카드: {n}')
    for n in range(1000, 10000):
        r = n - sum(map(int, str(n)))
        if r % 9: bad.append(f'9의 마술: {n}'); break
    for n in range(10, 100):
        a, b = divmod(n, 10)
        if a * 100 + (a + b) * 10 + b != n * 11: bad.append(f'11: {n}'); break
    return bad

def esc(s): return html.escape(s)

def sheet(t):
    s = f'<div class="mc-pg"><div class="mc-hd"><b>🎩 마술 카드 · {esc(t["title"])}</b><span>____학년 ____반 이름 __________</span></div><p>{esc(t["intro"])}</p>'
    s += '<h3>🎭 친구에게 해 보는 차례</h3><ol>' + ''.join(f'<li>{x}</li>' for x in t['friend']) + '</ol>'
    s += '<h3>🤔 비밀을 생각해 봐요</h3><ol>' + ''.join(f'<li>{x}</li>' for x in t['think']) + '</ol>'
    s += '<div class="mc-wr"><h3>✏️ 내가 찾은 비밀(까닭)을 써요</h3><div></div></div><p class="mc-ft">수학 마술 · 초등교사 홍지희</p></div>'
    if t.get('card') == 'cards':
        cs = ''.join(f'<div class="mc-card"><b>카드 {"①②③④⑤"[i]}</b><span>' + ''.join(f'<i>{n}</i>' for n in range(1, 32) if n & k) + '</span></div>' for i, k in enumerate((1, 2, 4, 8, 16)))
        s += f'<div class="mc-pg"><div class="mc-hd"><b>✂️ 생각한 수 맞히기 카드</b><span>점선을 따라 잘라 써요</span></div><div class="mc-cards">{cs}</div><p class="mc-ft">수학 마술 · 초등교사 홍지희</p></div>'
    return s

def build(t, k):
    rd = lambda f: f.read_text(encoding='utf-8')
    gnav = ''.join(f'<a href="{x["id"]}.html"' + (' aria-current="page"' if x is t else '') + f'>{x["title"]}</a>' for x in TRICKS)
    prv, nxt = TRICKS[k - 1] if k else None, TRICKS[k + 1] if k + 1 < len(TRICKS) else None
    pn = (f'<a href="{prv["id"]}.html">← {prv["title"]}</a>' if prv else '<span></span>') + (f'<a href="{nxt["id"]}.html">{nxt["title"]} →</a>' if nxt else '<a href="index.html">마술 목록 →</a>')
    rep = {'TITLE': t['title'], 'DESC': t['intro'], 'ICO': t['ico'], 'REC': t['rec'], 'GNAV': gnav, 'PN': pn,
           'THINK': ''.join(f'<li>{x}</li>' for x in t['think']), 'SECRET': ''.join(f'<p>{x}</p>' for x in t['secret']), 'FRIEND': ''.join(f'<li>{x}</li>' for x in t['friend']),
           'SHEET': sheet(t), 'TRICK': rd(HERE / 'tricks' / f"{t['id']}.js"), 'SHELL': rd(MT / 'shell.js'),
           'CSS': rd(MT / 'page.css').replace('{ACC}', t['acc']).replace('{TOOLCSS}', rd(HERE / 'magic.css')),
           'HEADSNIP': rd(OG / 'head_snip.html'),
           'FOOT': rd(OG / 'foot.html').replace('쉬는 시간에 친구와 함께 즐기는 종이접기 자료입니다.', '신기한 수 마술로 수학의 까닭을 찾는 자료입니다.'),
           'HOMEFRAG': rd(OG / 'home.html').replace('{HOME}', '../../index.html')}
    s = re.sub(r'\{([A-Z]+)\}', lambda m: rep.get(m.group(1), m.group(0)), rd(HERE / 'page.html'))
    out = OUT / f"{t['id']}.html"; out.parent.mkdir(parents=True, exist_ok=True)
    old = out.read_text(encoding='utf-8') if out.exists() else ''
    strip = lambda x: re.sub(r'<!--hj-c(?:theme|icons)-->.*?<!--/hj-c(?:theme|icons)-->', '', x, flags=re.S)
    if strip(old) == s: return False
    out.write_text(s, encoding='utf-8'); return True

if __name__ == '__main__':
    bad = check()
    if bad: print('\n'.join(bad)); sys.exit('수학 마술 점검 실패')
    print('수학 마술 점검 통과(1089·수 카드·9의 마술·11 곱하기 모든 경우 확인)')
    if sys.argv[1:] == ['check']: sys.exit(0)
    n = sum(build(t, k) for k, t in enumerate(TRICKS))
    print(f'수학 마술 {n}쪽 다시 만듦 (모두 {len(TRICKS)}가지)')
