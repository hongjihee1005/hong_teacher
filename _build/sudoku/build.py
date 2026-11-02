#!/usr/bin/env python3
"""쉬는 시간 › 스도쿠 학년 페이지 만들기 (2026-10-04)

    python3 _build/sudoku/build.py        # break/sudoku/g1.html ~ g6.html

문제 원본: puzzles.json (gen.py가 만들고 검증한 학년별 30문제 — 답이 하나뿐, 논리로만 풀림)
화면: page.html + page.css + app.js. 아래쪽 '만든 사람'·홈 단추 조각은 _build/origami/의 것을 같이 씁니다.
고친 뒤 루트에서 python3 _build/theme/apply_content_theme.py (자동 보완 run_all.py에도 들어 있음). 여러 번 실행해도 안전합니다.
"""
import json, re, sys, pathlib
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
OG = ROOT / '_build' / 'origami'
sys.dont_write_bytecode = True

GRADES = {
  1: dict(ico='🐣', acc='#D94F72', intro='4×4 작은 판으로 시작해요. 1, 2, 3, 4를 겹치지 않게 넣어 봐요.'),
  2: dict(ico='🌱', acc='#3A8F3A', intro='4×4 판인데 빈칸이 더 많아요. 가로·세로·굵은 칸을 차례로 살펴봐요.'),
  3: dict(ico='🚀', acc='#2F6FD6', intro='6×6 판에 도전! 굵은 칸은 가로 3칸, 세로 2칸이에요.'),
  4: dict(ico='🌈', acc='#8150C8', intro='6×6 판, 빈칸이 많아졌어요. 메모 기능으로 들어갈 수 있는 수를 적어 봐요.'),
  5: dict(ico='⭐', acc='#C9661A', intro='드디어 9×9 진짜 스도쿠! 처음 문제들은 힌트 수가 넉넉해요.'),
  6: dict(ico='🎓', acc='#1C8C7A', intro='9×9 판, 빈칸이 많은 도전 문제예요. 메모를 잘 쓰면 꼭 풀 수 있어요.'),
}

def build(g):
    G = GRADES[g]; d = json.loads((HERE / 'puzzles.json').read_text(encoding='utf-8'))[str(g)]
    rd = lambda p: p.read_text(encoding='utf-8')
    data = json.dumps(dict(g=g, n=d['n'], bh=d['bh'], bw=d['bw'], p=d['p'], s=d['s']), separators=(',', ':'))
    rep = {'{G}': str(g), '{N}': str(d['n']), '{ICO}': G['ico'], '{INTRO}': G['intro'], '{BOX}': f"{d['bh']}×{d['bw']}",
           '{MEMOHIDE}': 'hidden' if d['n'] == 4 else '', '{CSS}': rd(HERE / 'page.css').replace('{ACC}', G['acc']),
           '{HEADSNIP}': rd(OG / 'head_snip.html'), '{FOOT}': rd(OG / 'foot.html').replace('종이접기 자료', '놀이 자료'), '{APP}': rd(HERE / 'app.js'),
           '{HOMEFRAG}': rd(OG / 'home.html').replace('{HOME}', '../../index.html')}
    s = rd(HERE / 'page.html')
    for k, v in rep.items(): s = s.replace(k, v)
    s = s.replace('{DATA}', data)
    out = ROOT / 'break' / 'sudoku' / f'g{g}.html'
    out.parent.mkdir(parents=True, exist_ok=True)
    old = out.read_text(encoding='utf-8') if out.exists() else ''
    strip = lambda t: re.sub(r'<!--hj-c(?:theme|icons)-->.*?<!--/hj-c(?:theme|icons)-->', '', t, flags=re.S)
    if strip(old) == s: return False
    out.write_text(s, encoding='utf-8'); return True

if __name__ == '__main__':
    print(f'스도쿠 {sum(build(g) for g in GRADES)}개 페이지 다시 만듦')
