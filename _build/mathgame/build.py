#!/usr/bin/env python3
"""프로젝트 › 수학게임 학년 페이지 만들기 (2026-10-07)

    python3 _build/mathgame/build.py          # project/mathgame/g1.html ~ g6.html. 먼저 node check.js로 점검합니다.
    python3 _build/mathgame/build.py check    # 점검만

문제는 공통 › 기초연산의 생성기 _build/arith/skills.js를 그대로 씁니다(98단계). 게임에서는 씨앗을 Math.random()으로 줘서 할 때마다 새 숫자가 나옵니다.
학년별 단원 묶음: units.json (단계 id는 skills.js의 S, 98단계가 한 번씩 꼭 들어가야 함 — check.js가 확인)
보기(정답 + 오답) 만들기: choices.js, 화면: page.html + page.css + app.js. 아래쪽 '만든 사람'·홈 단추 조각은 _build/origami/의 것을 같이 씁니다.
목록 project/mathgame/index.html은 메뉴 페이지(손으로 고치고 apply_theme.py).
고친 뒤 루트에서 python3 _build/theme/apply_content_theme.py (자동 보완 run_all.py에도 들어 있음). 여러 번 실행해도 안전합니다.
"""
import re, sys, json, pathlib, subprocess
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
OG = ROOT / '_build' / 'origami'
sys.dont_write_bytecode = True

GRADES = {
  1: dict(ico='🐣', acc='#D94F72', intro='10까지의 덧셈과 뺄셈부터 두 자리 수 계산까지! 단원을 고르고, 좋아하는 게임으로 계산 연습을 해 봐요.'),
  2: dict(ico='🌱', acc='#3A8F3A', intro='받아올림·받아내림이 있는 계산과 곱셈구구를 게임으로 연습해요. 곱셈구구는 단별로 골라서 할 수도 있어요.'),
  3: dict(ico='🚀', acc='#2F6FD6', intro='세 자리 수의 덧셈과 뺄셈, 곱셈, 나눗셈, 분수와 소수를 교과서 단원별로 골라 게임으로 연습해요.'),
  4: dict(ico='🌈', acc='#8150C8', intro='큰 수의 곱셈과 나눗셈, 분수와 소수의 덧셈·뺄셈을 게임으로 연습해요.'),
  5: dict(ico='⭐', acc='#C9661A', intro='혼합 계산, 약수와 배수, 약분과 통분, 분수와 소수의 곱셈을 게임으로 연습해요.'),
  6: dict(ico='🎓', acc='#1C8C7A', intro='분수의 나눗셈과 소수의 나눗셈을 게임으로 연습해요. 지난 학년 계산이 헷갈리면 다른 학년 방에도 들러 보세요.'),
}

def check():
    r = subprocess.run(['node', str(HERE / 'check.js')], capture_output=True, text=True)
    print((r.stdout + r.stderr).strip()[-3000:])
    return r.returncode == 0

def build(g, U):
    G = GRADES[g]; rd = lambda p: p.read_text(encoding='utf-8')
    gnav = ''.join(f'<a href="g{k}.html"' + (' aria-current="page"' if k == g else '') + f'>{k}학년</a>' for k in GRADES)
    data = json.dumps(dict(g=g, units=U[str(g)]), ensure_ascii=False, separators=(',', ':'))
    rep = {'G': str(g), 'ICO': G['ico'], 'INTRO': G['intro'], 'GNAV': gnav, 'DATA': data,
           'CSS': rd(HERE / 'page.css').replace('{ACC}', G['acc']), 'HEADSNIP': rd(OG / 'head_snip.html'),
           'FOOT': rd(OG / 'foot.html').replace('쉬는 시간에 친구와 함께 즐기는 종이접기 자료입니다.', '학년별 단원의 계산을 게임으로 반복 연습하는 자료입니다.'),
           'SKILLS': rd(ROOT / '_build' / 'arith' / 'skills.js'), 'CHOICES': rd(HERE / 'choices.js'), 'APP': rd(HERE / 'app.js'),
           'HOMEFRAG': rd(OG / 'home.html').replace('{HOME}', '../../index.html')}
    s = re.sub(r'\{([A-Z]+)\}', lambda m: rep.get(m.group(1), m.group(0)), rd(HERE / 'page.html'))   # 한 번에 바꿈(넣은 내용 속 {…}는 건드리지 않음)
    out = ROOT / 'project' / 'mathgame' / f'g{g}.html'
    out.parent.mkdir(parents=True, exist_ok=True)
    old = out.read_text(encoding='utf-8') if out.exists() else ''
    strip = lambda t: re.sub(r'<!--hj-c(?:theme|icons)-->.*?<!--/hj-c(?:theme|icons)-->', '', t, flags=re.S)
    if strip(old) == s: return False
    out.write_text(s, encoding='utf-8'); return True

if __name__ == '__main__':
    if not check(): sys.exit('수학게임 점검 실패')
    if sys.argv[1:] == ['check']: sys.exit(0)
    U = json.loads((HERE / 'units.json').read_text(encoding='utf-8'))
    n = sum(build(g, U) for g in GRADES)
    print(f'수학게임 {n}개 페이지 다시 만듦 (모두 {len(GRADES)}개)')
