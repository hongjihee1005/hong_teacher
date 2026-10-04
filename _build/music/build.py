#!/usr/bin/env python3
"""공통 › 음악이론 주제 페이지 만들기 (2026-10-04)

    python3 _build/music/build.py      # common/music/tNN-slug.html (22개 주제)

내용: topics_a.py(01~07 악보 읽기) · topics_b.py(08~14 빠르기·셈여림·음계·화음) · topics_c.py(15~22 국악·악기·형식)
화면: page.html + page.css + app.js, 악보·소리 엔진 engine.js, 악보 기호 glyphs.json(Noto Music, SIL OFL에서 뽑은 모양)
목록 common/music/index.html은 메뉴 페이지(손으로 고치고 apply_theme.py). 주제를 더하면 목록에도 카드를 더하세요.
고친 뒤 루트에서 python3 _build/theme/apply_content_theme.py (자동 보완 run_all.py에도 들어 있음).
"""
import re, sys, json, pathlib
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
OG = ROOT / '_build' / 'origami'
sys.path.insert(0, str(HERE))
from topics_a import T as A
from topics_b import T as B
from topics_c import T as C
TOPICS = A + B + C

def fname(t): return f"t{t['no']:02d}-{t['slug']}.html"

def check():
    bad = 0
    for i, t in enumerate(TOPICS):
        if t['no'] != i + 1: print('번호 차례', t['no']); bad += 1
        for k in ('learn', 'act', 'quiz', 'music', 'sheet', 'sum'):
            if not t.get(k): print(t['no'], k, '비어 있음'); bad += 1
        for q in t['quiz']:
            if not 0 <= q['a'] < len(q['o']): print(t['no'], '정답 번호', q['q']); bad += 1
        for s in t['sheet']:
            if s['k'] == 'choice' and not 0 <= s['a'] < len(s['o']): print(t['no'], '활동지 정답', s['q']); bad += 1
    return bad

def build(i):
    t = TOPICS[i]; rd = lambda p: p.read_text(encoding='utf-8')
    prev = f'<a href="{fname(TOPICS[i - 1])}">← {TOPICS[i - 1]["no"]}. {TOPICS[i - 1]["title"]}</a>' if i else '<a href="index.html">← 음악이론 목록</a>'
    nxt = f'<a href="{fname(TOPICS[i + 1])}">{TOPICS[i + 1]["no"]}. {TOPICS[i + 1]["title"]} →</a>' if i + 1 < len(TOPICS) else '<a href="index.html">음악이론 목록 →</a>'
    d = dict(t); d['no'] = f"{t['no']:02d}"
    data = json.dumps(d, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
    rep = {'{NO}': d['no'], '{TITLE}': t['title'], '{GOAL}': t['goal'], '{AREA}': t['area'], '{ICO}': t['ico'], '{PREV}': prev, '{NEXT}': nxt,
           '{CSS}': rd(HERE / 'page.css'), '{HEADSNIP}': rd(OG / 'head_snip.html'),
           '{FOOT}': rd(OG / 'foot.html').replace('쉬는 시간에 친구와 함께 즐기는 종이접기 자료입니다.', '초등 음악 교과서의 음악 개념을 주제별로 정리한 자료입니다.'),
           '{GLYPHS}': rd(HERE / 'glyphs.json').strip(), '{ENGINE}': rd(HERE / 'engine.js'), '{APP}': rd(HERE / 'app.js'),
           '{HOMEFRAG}': rd(OG / 'home.html').replace('{HOME}', '../../index.html')}
    s = rd(HERE / 'page.html')
    for k in ('{CSS}', '{HEADSNIP}', '{FOOT}', '{GLYPHS}', '{ENGINE}', '{APP}', '{HOMEFRAG}', '{PREV}', '{NEXT}', '{NO}', '{TITLE}', '{GOAL}', '{AREA}', '{ICO}'):
        s = s.replace(k, rep[k])
    s = s.replace('{DATA}', data)
    out = ROOT / 'common' / 'music' / fname(t)
    out.parent.mkdir(parents=True, exist_ok=True)
    old = out.read_text(encoding='utf-8') if out.exists() else ''
    strip = lambda x: re.sub(r'<!--hj-c(?:theme|icons)-->.*?<!--/hj-c(?:theme|icons)-->', '', x, flags=re.S)
    if strip(old) == s: return False
    out.write_text(s, encoding='utf-8'); return True

if __name__ == '__main__':
    if check(): sys.exit('음악이론 내용 점검 실패')
    print(f'음악이론 {sum(build(i) for i in range(len(TOPICS)))}개 페이지 다시 만듦 (모두 {len(TOPICS)}개 주제)')
