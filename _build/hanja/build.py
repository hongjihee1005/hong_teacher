#!/usr/bin/env python3
"""공통 › 한자 급수(한국어문회) 급수 페이지 만들기 (2026-10-04)

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
from groups import GROUPS

ACC = '#B23A3A'
STROKES = json.loads((HERE / 'data' / 'strokes.json').read_text(encoding='utf-8'))   # 획순(strokes.py가 만듦)
def fname(lid): return 'lv' + lid + '.html'

def intro(d):
    s = f"한국어문회 한자능력검정 {d['name']}: 이 급에서 새로 배우는 한자 {d['nnew']}자, 이 급까지 모두 {d['ncum']}자예요."
    s += f" 모의 시험은 {d['total']}문항 중 {d['pass_']}문항 이상 맞으면 합격 기준이에요."
    if d['wr']: s += f" 한자 쓰기 문제는 {d['wr']}까지의 한자에서 나와요."
    s += f" <span class=\"hj-grtag\">{GRADE.get(d['name'], '도전 · 6학년 이상')} <small>참고용</small></span>"
    return s

GRADE = {'8급': '추천 1~2학년', '7급Ⅱ': '추천 2~3학년', '7급': '추천 2~3학년', '6급Ⅱ': '추천 3~4학년', '6급': '추천 3~4학년',
         '5급Ⅱ': '추천 5~6학년', '5급': '추천 5~6학년'}   # 이 자료에서 정한 참고용(2026-10-29 교육자팀). 4급Ⅱ 이상은 '도전'

def order(d):
    """익히기 차례를 뜻 묶음으로(groups.py), 5급Ⅱ 이상은 부수 묶음으로. d['groups'] = [[이름, 글자 수], …]"""
    import unicodedata as u
    L = d['learn']; key = lambda c: u.normalize('NFC', c)
    gs = GROUPS.get(d['name'])
    if gs:
        pos = {key(x[0]): x for x in L}; out = []; meta = []
        for nm, chars in gs:
            got = [pos.pop(key(c)) for c in chars if key(c) in pos]
            if len(got) != len(chars): sys.exit(f"groups.py {d['name']} '{nm}': 이 급에 없는 글자나 겹친 글자")
            out += got; meta.append([nm, len(got)])
        if pos: sys.exit(f"groups.py {d['name']}: 묶음에 빠진 글자 " + ''.join(pos))
    else:
        by = {}
        for x in L: by.setdefault(x[2], []).append(x)
        big = sorted([k for k in by if len(by[k]) >= 3], key=lambda k: (-len(by[k]), list(by).index(k)))
        out, meta = [], []
        for k in big: out += by[k]; meta.append(['부수 ' + k, len(by[k])])
        rest = [x for k in by if k not in big for x in by[k]]
        if rest: out += rest; meta.append(['그 밖의 글자', len(rest)])
    d['learn'][:] = out; d['groups'] = meta

def build(i):
    d = gen.level(i); rd = lambda p: p.read_text(encoding='utf-8')
    for x in d['learn']: x.append(STROKES.get(x[0], 0))
    order(d)
    data = json.dumps(d, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
    nav = ''.join(f'<a href="{fname(L[0])}"' + (' aria-current="page"' if L[0] == d['id'] else '') + f'>{L[1]}</a>' for L in gen.LEVELS)
    rep = {'{LVNAV}': nav, '{NAME}': d['name'], '{INTRO}': intro(d), '{CSS}': rd(HERE / 'page.css').replace('{ACC}', ACC),
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
