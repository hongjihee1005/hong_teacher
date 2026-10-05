#!/usr/bin/env python3
"""공통 › 세계시민교육 주제 페이지 만들기 (2026-10-05)

    python3 _build/gced/build.py      # project/global/tNN-slug.html (20개 주제)

틀: 유네스코 「세계시민교육: 주제와 학습 목표」(UNESCO, Global Citizenship Education: Topics and Learning Objectives, 2015)
    — 세 학습 영역(인지 · 사회정서 · 행동)과 9개 주제. 주제마다 un=[주제 번호], dom=[영역]으로 연결해 화면에 표시.
내용: topics_a.py(01~08 세계시민·정체성·다양성·인권) · topics_b.py(09~13 지구촌 문제·평화) · topics_c.py(14~20 지속가능발전·참여와 실천)
화면: page.html + page.css + app.js (음악이론 틀을 고쳐 씀, 악보·소리 엔진 없음)
목록 project/global/index.html은 메뉴 페이지(손으로 고치고 apply_theme.py). 주제를 더하면 목록에도 카드를 더하세요.
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
DOMS = {'인지', '사회정서', '행동'}

def fname(t): return f"t{t['no']:02d}-{t['slug']}.html"

def check():
    bad = 0
    for i, t in enumerate(TOPICS):
        if t['no'] != i + 1: print('번호 차례', t['no']); bad += 1
        for k in ('learn', 'act', 'quiz', 'media', 'sheet', 'sum', 'un', 'dom'):
            if not t.get(k): print(t['no'], k, '비어 있음'); bad += 1
        if not all(1 <= n <= 9 for n in t['un']): print(t['no'], '유네스코 주제 번호'); bad += 1
        if not set(t['dom']) <= DOMS: print(t['no'], '학습 영역 이름'); bad += 1
        for q in t['quiz']:
            if not 0 <= q['a'] < len(q['o']): print(t['no'], '정답 번호', q['q']); bad += 1
        for s in t['sheet']:
            if s['k'] == 'choice' and not 0 <= s['a'] < len(s['o']): print(t['no'], '활동지 정답', s['q']); bad += 1
            if s['k'] == 'match' and len(s['l']) != len(s['r']): print(t['no'], '잇기 개수', s['q']); bad += 1
        ids = []
        for c in t['learn'] + t['act']:
            w = c.get('w') or {}
            if w.get('w') == 'think': ids.append(w['id'])
            if w.get('w') == 'sort':
                for it in w['items']:
                    if not 0 <= it[1] < len(w['cats']): print(t['no'], '나누기 정답', it[0]); bad += 1
            if w.get('w') == 'pick' and not any(o[2] for o in w['o']): print(t['no'], '고르기에 좋은 답 없음', w['q']); bad += 1
        if len(ids) != len(set(ids)): print(t['no'], '생각 칸 id 겹침'); bad += 1
    if len({t['slug'] for t in TOPICS}) != len(TOPICS): print('slug 겹침'); bad += 1
    return bad

def build(i):
    t = TOPICS[i]; rd = lambda p: p.read_text(encoding='utf-8')
    prev = f'<a href="{fname(TOPICS[i - 1])}">← {TOPICS[i - 1]["no"]}. {TOPICS[i - 1]["title"]}</a>' if i else '<a href="index.html">← 세계시민교육 목록</a>'
    nxt = f'<a href="{fname(TOPICS[i + 1])}">{TOPICS[i + 1]["no"]}. {TOPICS[i + 1]["title"]} →</a>' if i + 1 < len(TOPICS) else '<a href="index.html">세계시민교육 목록 →</a>'
    d = dict(t); d['no'] = f"{t['no']:02d}"
    data = json.dumps(d, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
    rep = {'{NO}': d['no'], '{TITLE}': t['title'], '{GOAL}': t['goal'], '{AREA}': t['area'], '{ICO}': t['ico'], '{PREV}': prev, '{NEXT}': nxt,
           '{CSS}': rd(HERE / 'page.css'), '{HEADSNIP}': rd(OG / 'head_snip.html'),
           '{FOOT}': rd(OG / 'foot.html').replace('쉬는 시간에 친구와 함께 즐기는 종이접기 자료입니다.', '유네스코 세계시민교육의 주제와 학습 목표에 맞춰 주제별로 정리한 자료입니다.'),
           '{APP}': rd(HERE / 'app.js'), '{HOMEFRAG}': rd(OG / 'home.html').replace('{HOME}', '../../index.html')}
    s = rd(HERE / 'page.html')
    for k in ('{CSS}', '{HEADSNIP}', '{FOOT}', '{APP}', '{HOMEFRAG}', '{PREV}', '{NEXT}', '{NO}', '{TITLE}', '{GOAL}', '{AREA}', '{ICO}'):
        s = s.replace(k, rep[k])
    s = s.replace('{DATA}', data)
    out = ROOT / 'project' / 'global' / fname(t)
    out.parent.mkdir(parents=True, exist_ok=True)
    old = out.read_text(encoding='utf-8') if out.exists() else ''
    strip = lambda x: re.sub(r'<!--hj-c(?:theme|icons)-->.*?<!--/hj-c(?:theme|icons)-->', '', x, flags=re.S)
    if strip(old) == s: return False
    out.write_text(s, encoding='utf-8'); return True

if __name__ == '__main__':
    if check(): sys.exit('세계시민교육 내용 점검 실패')
    if sys.argv[1:] == ['check']: print(f'세계시민교육 점검 통과 ({len(TOPICS)}개 주제)'); sys.exit()
    print(f'세계시민교육 {sum(build(i) for i in range(len(TOPICS)))}개 페이지 다시 만듦 (모두 {len(TOPICS)}개 주제)')
