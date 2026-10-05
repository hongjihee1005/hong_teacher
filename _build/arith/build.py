#!/usr/bin/env python3
"""공통 › 기초연산 페이지 만들기 (2026-10-05)

    python3 _build/arith/build.py      # common/arith/add.html … dec.html(영역 8개) + rank.html(급수 시험). 먼저 node check.js로 점검합니다.

단계와 문제 생성기는 skills.js(같은 단계·같은 번호면 언제나 같은 문제), 화면은 page.html(틀) + area.html·rank.html(본문) + page.css + app.js.
아래쪽 '만든 사람'·홈 단추 조각은 _build/origami/의 것을 같이 씁니다.
목록 common/arith/index.html은 메뉴 페이지(손으로 고치고 apply_theme.py). 영역을 더하면 목록에도 카드를 더하세요.
고친 뒤 루트에서 python3 _build/theme/apply_content_theme.py (자동 보완 run_all.py에도 들어 있음). 여러 번 실행해도 안전합니다.
"""
import re, sys, json, pathlib, subprocess
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
OG = ROOT / '_build' / 'origami'

AREAS = {   # skills.js의 AREAS와 같은 차례·색
    'add': ('add.html', '덧셈', '➕', '#E0567A', '10까지의 덧셈부터 받아올림이 여러 번 있는 네 자리 수 덧셈까지 13단계예요.'),
    'sub': ('sub.html', '뺄셈', '➖', '#2F74E0', '10까지의 뺄셈부터 받아내림이 여러 번 있는 네 자리 수 뺄셈까지 13단계예요.'),
    'mul': ('mul.html', '곱셈', '✖️', '#D9731A', '곱셈구구 2단~9단부터 (세 자리 수)×(두 자리 수)까지 15단계예요.'),
    'div': ('div.html', '나눗셈', '➗', '#3E9A3E', '곱셈구구로 몫 구하기부터 (세 자리 수)÷(두 자리 수)까지 11단계예요. 나머지는 「몫 … 나머지」로 써요.'),
    'mix': ('mix.html', '혼합 계산', '🧮', '#8A55D6', '덧셈·뺄셈·곱셈·나눗셈이 섞인 식을 계산 순서에 맞게 풀어요. ( ) 안 → 곱셈·나눗셈 → 덧셈·뺄셈, 같은 것끼리는 앞에서부터.'),
    'factor': ('factor.html', '약수와 배수', '🧩', '#1C8C7A', '약수·배수·공약수, 최대공약수와 최소공배수, 약분과 통분을 연습해요.'),
    'frac': ('frac.html', '분수', '🍕', '#C0503A', '분수의 크기 비교, 가분수와 대분수, 분수의 덧셈·뺄셈·곱셈·나눗셈 18단계예요. 분수는 자연수 칸·분자 칸·분모 칸에 나누어 써요.'),
    'dec': ('dec.html', '소수', '🔢', '#2B6FB8', '소수의 크기 비교, 분수를 소수로, 소수의 덧셈·뺄셈·곱셈·나눗셈 16단계예요.'),
}
FOOTTXT = '덧셈·뺄셈·곱셈·나눗셈·분수·소수의 기초 계산을 단계별로 연습하는 자료입니다.'

def page(fname, title, ico, acc, intro, main, pg, desc):
    rd = lambda p: p.read_text(encoding='utf-8')
    rep = {'TITLE': title, 'ICO': ico, 'INTRO': intro, 'DESC': desc, 'MAIN': main,
           'CSS': rd(HERE / 'page.css').replace('{ACC}', acc), 'HEADSNIP': rd(OG / 'head_snip.html'),
           'FOOT': rd(OG / 'foot.html').replace('쉬는 시간에 친구와 함께 즐기는 종이접기 자료입니다.', FOOTTXT),
           'SKILLS': rd(HERE / 'skills.js'), 'PAGE': json.dumps(pg, ensure_ascii=False), 'APP': rd(HERE / 'app.js'),
           'HOMEFRAG': rd(OG / 'home.html').replace('{HOME}', '../../index.html')}
    s = re.sub(r'\{([A-Z]+)\}', lambda m: rep.get(m.group(1), m.group(0)), rd(HERE / 'page.html'))   # 한 번에 바꿈(넣은 내용 속 {…}는 건드리지 않음)
    out = ROOT / 'common' / 'arith' / fname
    out.parent.mkdir(parents=True, exist_ok=True)
    old = out.read_text(encoding='utf-8') if out.exists() else ''
    strip = lambda t: re.sub(r'<!--hj-c(?:theme|icons)-->.*?<!--/hj-c(?:theme|icons)-->', '', t, flags=re.S)
    if strip(old) == s: return False
    out.write_text(s, encoding='utf-8'); return True

if __name__ == '__main__':
    r = subprocess.run(['node', str(HERE / 'check.js')], capture_output=True, text=True)
    if r.returncode: print((r.stdout + r.stderr)[-2000:]); sys.exit('기초연산 문제 점검 실패')
    print(r.stdout.strip())
    area = (HERE / 'area.html').read_text(encoding='utf-8'); rank = (HERE / 'rank.html').read_text(encoding='utf-8')
    n = 0
    for k, (f, nm, ico, acc, intro) in AREAS.items():
        n += page(f, nm, ico, acc, intro, area, {'area': k}, f'초등 기초연산 {nm}: 단계별 연습(바로 확인), 학습지 30장과 정답 인쇄')
    n += page('rank.html', '급수 시험', '🏆', '#B4610F',
              '12급(1학년 수준)부터 1급(6학년 수준)까지, 급마다 20문제 시험이 20회씩 있어요. 화면에서 풀고 채점하거나 시험지를 인쇄해서 풀어요.',
              rank, {'rank': 1}, '초등 기초연산 급수 시험: 12급~1급, 급마다 20회, 채점·시험지 인쇄')
    print(f'기초연산 {n}개 페이지 다시 만듦 (모두 {len(AREAS) + 1}개)')
