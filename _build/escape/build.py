#!/usr/bin/env python3
"""기타 › 수학게임 › 수학 방탈출 페이지 만들기 (2026-10-07)

    python3 _build/escape/build.py          # project/escape/<방>.html (먼저 점검: 자물쇠 답을 chk로 다시 계산)
    python3 _build/escape/build.py check

방 자료 rooms.py, 화면 page.html·escape.js·escape.css(수학 교구실 page.css·shell.js를 같이 씀).
메뉴 project/escape/index.html은 손으로 고치는 메뉴(apply_theme.py). 고친 뒤 루트에서 python3 _build/theme/apply_content_theme.py.
"""
import re, sys, json, pathlib, html
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
OG = ROOT / '_build' / 'origami'
MT = ROOT / '_build' / 'mathtools'
OUT = ROOT / 'project' / 'escape'
sys.dont_write_bytecode = True
sys.path.insert(0, str(HERE))
from rooms import ROOMS

def check():
    bad = []
    for r in ROOMS:
        A = []
        for i, l in enumerate(r['locks'], 1):
            if l['chk']() != l['a']: bad.append(f"{r['id']} {i}번: 답 {l['a']} ≠ 계산 {l['chk']()}")
            if len(l['hints']) != 2: bad.append(f"{r['id']} {i}번: 힌트 2개가 아님")
            A.append(l['a'])
        f = r['final']['chk'](A)
        if not isinstance(f, int) or f <= 0: bad.append(f"{r['id']}: 마지막 문 답 {f}")
        r['final']['a'] = f
    return bad

def esc(s): return html.escape(str(s))
def fr(s): return re.sub(r'(\d+)/(\d+)', r'\1/\2', esc(s))

def sheet(r):
    s = f'<div class="ep-pg"><div class="ep-hd"><b>🔐 {esc(r["title"])}</b><span>모둠 ______ 이름 ______________</span></div><p>{esc(r["intro"])} 문제를 풀어 답 칸에 쓰고, 마지막 문의 비밀번호를 찾아요.</p>'
    for i, l in enumerate(r['locks'], 1):
        s += f'<div class="ep-l"><div class="ep-t"><p class="ep-s">🔒 {i}번 자물쇠 — {esc(l["story"])}</p><p><b>{fr(l["q"])}</b></p><div class="ep-work"></div></div><div class="ep-a">답<i></i></div></div>'
    s += f'<div class="ep-l"><div class="ep-t"><p class="ep-s">🚪 마지막 문</p><p><b>{esc(r["final"]["q"])}</b></p><div class="ep-work"></div></div><div class="ep-a">비밀번호<i></i></div></div><p style="text-align:right;font-size:9pt;color:#555">수학 방탈출 · 초등교사 홍지희</p></div>'
    s += f'<div class="ep-pg"><div class="ep-hd"><b>🔑 {esc(r["title"])} · 선생님용 정답</b><span></span></div><table class="ep-key"><tr><th>자물쇠</th><th>답</th><th>풀이</th></tr>'
    s += ''.join(f'<tr><td>{i}번</td><td><b>{l["a"]}</b></td><td>{fr(l["sol"])}</td></tr>' for i, l in enumerate(r['locks'], 1))
    s += f'<tr><td>마지막 문</td><td><b>{r["final"]["a"]}</b></td><td>{esc(r["final"]["q"])}</td></tr></table></div>'
    return s

def build(r):
    rd = lambda f: f.read_text(encoding='utf-8')
    gnav = ''.join(f'<a href="{x["id"]}.html"' + (' aria-current="page"' if x is r else '') + f'>{x["title"]}</a>' for x in ROOMS)
    data = dict(id=r['id'], title=r['title'], intro=r['intro'], locks=[{k: l[k] for k in ('story', 'q', 'a', 'hints', 'sol')} for l in r['locks']], final={k: r['final'][k] for k in ('q', 'a', 'hint', 'story')})
    rep = {'TITLE': r['title'], 'DESC': r['intro'], 'ICO': r['ico'], 'REC': r['rec'] + ' · 자물쇠 5개 + 마지막 문', 'GNAV': gnav, 'SHEET': sheet(r),
           'DATA': json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/'), 'TOOL': rd(HERE / 'escape.js'), 'SHELL': rd(MT / 'shell.js'),
           'CSS': rd(MT / 'page.css').replace('{ACC}', r['acc']).replace('{TOOLCSS}', rd(HERE / 'escape.css')), 'HEADSNIP': rd(OG / 'head_snip.html'),
           'FOOT': rd(OG / 'foot.html').replace('쉬는 시간에 친구와 함께 즐기는 종이접기 자료입니다.', '수학 문제로 자물쇠를 여는 방탈출 자료입니다.'),
           'HOMEFRAG': rd(OG / 'home.html').replace('{HOME}', '../../index.html')}
    s = re.sub(r'\{([A-Z]+)\}', lambda m: rep.get(m.group(1), m.group(0)), rd(HERE / 'page.html'))
    out = OUT / f"{r['id']}.html"; out.parent.mkdir(parents=True, exist_ok=True)
    old = out.read_text(encoding='utf-8') if out.exists() else ''
    strip = lambda x: re.sub(r'<!--hj-c(?:theme|icons)-->.*?<!--/hj-c(?:theme|icons)-->', '', x, flags=re.S)
    if strip(old) == s: return False
    out.write_text(s, encoding='utf-8'); return True

if __name__ == '__main__':
    bad = check()
    if bad: print('\n'.join(bad)); sys.exit('수학 방탈출 점검 실패')
    print('수학 방탈출 점검 통과 —', ', '.join(f"{r['title']} 비밀번호 {r['final']['a']}" for r in ROOMS))
    if sys.argv[1:] == ['check']: sys.exit(0)
    n = sum(build(r) for r in ROOMS)
    print(f'수학 방탈출 {n}쪽 다시 만듦 (모두 {len(ROOMS)}방)')
