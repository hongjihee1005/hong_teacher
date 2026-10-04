#!/usr/bin/env python3
"""학년 공통 › 한자 급수(한국어문회) 급수 페이지 만들기 (2026-10-04)

    python3 _build/hanja/build.py      # common/hanja/lv8.html … lv1.html (13개 급). 먼저 gen.py check로 점검합니다.

자료·시험지 만들기는 gen.py(설명 맨 위), 화면은 page.html + page.css + app.js.
아래쪽 '만든 사람'·홈 단추 조각은 _build/origami/의 것을 같이 씁니다.
고친 뒤 루트에서 python3 _build/theme/apply_content_theme.py (자동 보완 run_all.py에도 들어 있음). 여러 번 실행해도 안전합니다.
"""
import re, sys, json, pathlib
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
OG = ROOT / '_build' / 'origami'
sys.path.insert(0, str(HERE))
import gen

ACC = '#B23A3A'
def fname(lid): return 'lv' + lid + '.html'

def intro(d):
    s = f"한국어문회 한자능력검정 {d['name']}: 이 급에서 새로 배우는 한자 {d['nnew']}자, 이 급까지 모두 {d['ncum']}자예요."
    s += f" 모의 시험은 {d['total']}문항 중 {d['pass_']}문항 이상 맞으면 합격 기준이에요."
    if d['wr']: s += f" 한자 쓰기 문제는 {d['wr']}까지의 한자에서 나와요."
    return s

def build(i):
    d = gen.level(i); rd = lambda p: p.read_text(encoding='utf-8')
    data = json.dumps(d, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
    rep = {'{NAME}': d['name'], '{INTRO}': intro(d), '{CSS}': rd(HERE / 'page.css').replace('{ACC}', ACC),
           '{HEADSNIP}': rd(OG / 'head_snip.html'), '{FOOT}': rd(OG / 'foot.html').replace('쉬는 시간에 친구와 함께 즐기는 종이접기 자료입니다.', '한국어문회 한자능력검정시험 급수별 배정한자로 만든 연습 자료입니다.'),
           '{APP}': rd(HERE / 'app.js'), '{HOMEFRAG}': rd(OG / 'home.html').replace('{HOME}', '../../index.html')}
    s = rd(HERE / 'page.html')
    for k, v in rep.items(): s = s.replace(k, v)
    s = s.replace('{DATA}', data)
    out = ROOT / 'common' / 'hanja' / fname(d['id'])
    out.parent.mkdir(parents=True, exist_ok=True)
    old = out.read_text(encoding='utf-8') if out.exists() else ''
    strip = lambda t: re.sub(r'<!--hj-c(?:theme|icons)-->.*?<!--/hj-c(?:theme|icons)-->', '', t, flags=re.S)
    if strip(old) == s: return False
    out.write_text(s, encoding='utf-8'); return True

if __name__ == '__main__':
    import io, contextlib
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf): bad = gen.check()
    if bad: print(buf.getvalue()[-1500:]); sys.exit('한자 시험지 점검 실패')
    print(f'한자 급수 {sum(build(i) for i in range(len(gen.LEVELS)))}개 페이지 다시 만듦')
