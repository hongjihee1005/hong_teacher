#!/usr/bin/env python3
"""기타 › 수학게임 › 그림 수학 사전 페이지 만들기 (2026-10-07)

    python3 _build/mathdict/build.py          # project/mathdict/num.html · shape.html · reldata.html · all.html · quiz.html
    python3 _build/mathdict/build.py check

낱말 자료 terms.py, 그림 figs.js(FIG[키]), 화면 dict.js·dict.css, 틀 page.html(수학 교구실 page.css·shell.js를 같이 씀).
메뉴 project/mathdict/index.html은 손으로 고치는 메뉴(apply_theme.py). 고친 뒤 루트에서 python3 _build/theme/apply_content_theme.py.
"""
import re, sys, json, pathlib, subprocess
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
OG = ROOT / '_build' / 'origami'
MT = ROOT / '_build' / 'mathtools'
OUT = ROOT / 'project' / 'mathdict'
sys.dont_write_bytecode = True
sys.path.insert(0, str(HERE))
from terms import TERMS
AREAS = {'num': '수와 연산', 'shape': '도형과 측정', 'rel': '변화와 관계', 'data': '자료와 가능성'}
PAGES = [
 dict(id='num', title='수와 연산', ico='🔢', area='num', mode='dict', desc='덧셈·곱셈부터 분수·소수·약수·비율까지, 수와 계산에 나오는 낱말이에요.'),
 dict(id='shape', title='도형과 측정', ico='📐', area='shape', mode='dict', desc='선분·각·삼각형·사각형부터 입체도형·넓이·부피까지, 도형과 측정에 나오는 낱말이에요.'),
 dict(id='reldata', title='규칙·자료와 가능성', ico='📊', area='rel,data', mode='dict', desc='규칙과 대응, 표와 그래프, 평균과 가능성에 나오는 낱말이에요.'),
 dict(id='all', title='모든 낱말', ico='📘', area='all', mode='dict', desc='네 영역의 낱말을 한꺼번에 찾아봐요.'),
 dict(id='quiz', title='낱말 퀴즈', ico='❓', area='all', mode='quiz', desc='뜻이나 그림을 보고 알맞은 낱말을 골라요. 10문제씩, 학년을 골라 풀어요.'),
]

def check():
    bad, seen = [], set()
    figs = (HERE / 'figs.js').read_text(encoding='utf-8')
    for t in TERMS:
        if t['w'] in seen: bad.append(f"겹침: {t['w']}")
        seen.add(t['w'])
        if t['a'] not in AREAS: bad.append(f"{t['w']}: 영역")
        if not 1 <= t['g'] <= 6: bad.append(f"{t['w']}: 학년")
        if not t['d'].rstrip().endswith(('.', ')', '…')): bad.append(f"{t['w']}: 뜻 끝")
        if t['fig'] and not re.search(r'\b' + t['fig'] + r'\s*:\s*function|F\.' + t['fig'] + r'\s*=', figs): bad.append(f"{t['w']}: 그림 {t['fig']} 없음")
    return bad

def build(p):
    rd = lambda f: f.read_text(encoding='utf-8')
    gnav = ''.join(f'<a href="{x["id"]}.html"' + (' aria-current="page"' if x is p else '') + f'>{x["title"]}</a>' for x in PAGES)
    n = len([t for t in TERMS if p['area'] == 'all' or t['a'] in p['area'].split(',')])
    data = json.dumps(dict(terms=TERMS, area=p['area'], mode=p['mode'], title=p['title'], areas=AREAS), ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
    rep = {'TITLE': p['title'], 'DESC': p['desc'], 'ICO': p['ico'], 'REC': ('낱말 ' + str(n) + '개 · ' if p['mode'] == 'dict' else '') + '학년은 교과서에서 주로 처음 배우는 때(참고용)', 'GNAV': gnav,
           'HOW': '<ul>' + ('<li>낱말 카드를 누르면 크게 보여요: 그림·뜻·예·⚠️ 헷갈리기 쉬운 점·🔗 함께 알아 두면 좋은 낱말.</li><li>위에서 낱말을 찾거나 학년을 골라요. 🖨️ 지금 보이는 낱말을 카드(한 쪽에 6장)나 목록으로 인쇄해요.</li>' if p['mode'] == 'dict' else '<li>‘뜻 보고’ 또는 ‘그림 보고’를 고르고, 몇 학년까지의 낱말로 풀지 정해요.</li><li>보기 넷 중 하나를 고르면 바로 답과 뜻이 나와요. 10문제가 끝나면 맞힌 수가 나와요.</li>') + '</ul>',
           'IDEAS': '<li>단원을 시작할 때 그 단원의 낱말 카드를 인쇄해 교실 벽에 붙이기.</li><li>‘헷갈리기 쉬워요’를 함께 읽고 왜 헷갈리는지 이야기하기(예: 이상과 초과).</li><li>모둠별로 낱말 퀴즈를 풀고 틀린 낱말을 사전에서 다시 찾아보기.</li>',
           'DATA': 'MD=' + data, 'TOOL': rd(HERE / 'figs.js') + rd(HERE / 'dict.js'), 'SHELL': rd(MT / 'shell.js'),
           'CSS': rd(MT / 'page.css').replace('{ACC}', '#3B6FD6').replace('{TOOLCSS}', rd(HERE / 'dict.css')),
           'HEADSNIP': rd(OG / 'head_snip.html'),
           'FOOT': rd(OG / 'foot.html').replace('쉬는 시간에 친구와 함께 즐기는 종이접기 자료입니다.', '그림으로 수학 낱말을 익히는 자료입니다.'),
           'HOMEFRAG': rd(OG / 'home.html').replace('{HOME}', '../../index.html')}
    s = re.sub(r'\{([A-Z]+)\}', lambda m: rep.get(m.group(1), m.group(0)), rd(HERE / 'page.html')).replace('window.TL=MD=', 'window.MD=')
    out = OUT / f"{p['id']}.html"; out.parent.mkdir(parents=True, exist_ok=True)
    old = out.read_text(encoding='utf-8') if out.exists() else ''
    strip = lambda x: re.sub(r'<!--hj-c(?:theme|icons)-->.*?<!--/hj-c(?:theme|icons)-->', '', x, flags=re.S)
    if strip(old) == s: return False
    out.write_text(s, encoding='utf-8'); return True

if __name__ == '__main__':
    bad = check()
    if bad: print('\n'.join(bad)); sys.exit('그림 수학 사전 점검 실패')
    print(f'그림 수학 사전 점검 통과 (낱말 {len(TERMS)}개)')
    if sys.argv[1:] == ['check']: sys.exit(0)
    n = sum(build(p) for p in PAGES)
    print(f'그림 수학 사전 {n}쪽 다시 만듦 (모두 {len(PAGES)}쪽)')
