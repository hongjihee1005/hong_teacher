#!/usr/bin/env python3
"""기타 › 수학게임 › 교실 수학 놀이 페이지 만들기 (2026-10-07)

    python3 _build/mathplay/build.py          # project/mathplay/<놀이>.html
    python3 _build/mathplay/build.py check

놀이 목록 build.py의 GAMES, 공통 cp.js(섞기·주사위·인쇄), 놀이마다 games/<id>.js(window.GAME), 모양 play.css. 그림은 그림 수학 사전의 figs.js(FIG)를 같이 씀.
메뉴 project/mathplay/index.html은 손으로 고치는 메뉴(apply_theme.py). 고친 뒤 루트에서 python3 _build/theme/apply_content_theme.py.
"""
import re, sys, json, pathlib
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
OG = ROOT / '_build' / 'origami'
MT = ROOT / '_build' / 'mathtools'
MD = ROOT / '_build' / 'mathdict'
OUT = ROOT / 'project' / 'mathplay'
GAMES = [
 dict(id='bingo', title='수학 빙고', ico='🔢', acc='#E5534B', rec='추천 1~4학년 · 덧셈·뺄셈·곱셈구구·나눗셈 · 반 전체', desc='학생마다 다르게 섞인 빙고판을 인쇄하고, 선생님은 화면에서 문제를 뽑아 불러 줘요.',
      how=['문제 종류·판 크기·판 수(학생 수)를 고르고 🖨️ 빙고판 인쇄(한 쪽에 2판, 판마다 수가 다르게 섞임).', '선생님 화면의 ‘문제 뽑기’로 문제를 불러 줘요(‘답 보이기’는 확인용). 문제 목록을 인쇄해 잘라 뽑기 상자로 써도 돼요.', '학생은 답을 계산해 판에 그 수가 있으면 ○ 표, 한 줄이 되면 “빙고!”'],
      ideas=['빙고를 외친 학생은 ○ 표 한 수의 문제를 다시 말해 확인하기.', '3×3 판으로 짧게 여러 판, 5×5 판으로 길게 한 판.']),
 dict(id='race', title='주사위 경주판', ico='🎲', acc='#E0861A', rec='추천 1~3학년 · 덧셈·뺄셈·곱셈 · 2~4명', desc='주사위 두 개의 합(차·곱)을 말하고 맞히면 앞으로 가는 경주판이에요.',
      how=['계산(합·곱·차)을 고르고 🖨️ 경주판을 인쇄해요(규칙이 판 아래에 있어요).', '준비물: 주사위 2개, 말(지우개·동전).', '주사위가 없으면 화면 주사위로 굴리고 ‘답 확인’으로 확인해요.'],
      ideas=['곱셈 경주는 곱셈구구 복습에, 차 경주는 받아내림 없는 뺄셈 연습에.']),
 dict(id='pairs', title='짝 맞추기 카드', ico='🃏', acc='#3B6FD6', rec='추천 1~5학년 · 곱셈·10 만들기·분수·시계·소수 · 2~4명', desc='카드를 뒤집어 짝을 찾는 기억력 놀이 카드를 인쇄해요.',
      how=['카드 종류와 모둠 수를 고르고 🖨️ 인쇄해요(모둠마다 한 벌, 잘라서 써요).', '곱셈구구·시계 카드는 인쇄할 때마다 다른 문제가 나와요.', '짝의 한쪽은 하늘색 카드라 섞여도 찾기 쉬워요.'],
      ideas=['처음에는 카드를 펼쳐 놓고 짝 찾기, 익숙해지면 뒤집어 기억력 놀이로.']),
 dict(id='domino', title='도미노', ico='🁫', acc='#2EAA6A', rec='추천 2~6학년 · 평면도형·입체도형·곱셈구구 · 모둠', desc='한쪽 끝은 그림(식), 다른 쪽은 이름(답)인 도미노를 이어 붙여 한 바퀴를 만들어요.',
      how=['종류(도형·입체도형·곱셈구구)와 모둠 수를 고르고 🖨️ 인쇄해요(12장이 한 바퀴로 이어지게 만들어져요).', '도미노를 잘라 나눠 갖고 그림과 이름이 맞도록 이어 붙여요.'],
      ideas=['다 이은 도미노를 사진으로 찍어 모둠끼리 견주기.', '도형 도미노 뒤에 그 도형의 특징을 한 가지씩 써 보기.']),
 dict(id='fracwar', title='분수 카드 대결', ico='🍰', acc='#C2571A', rec='추천 3~5학년 · 분수의 크기 비교 · 2명', desc='두 사람이 분수 카드를 한 장씩 뒤집어 더 큰 분수가 이기는 대결이에요.',
      how=['막대 그림을 넣을지 정하고 🖨️ 카드를 인쇄해요(모둠마다 24장).', '화면에서 ‘카드 두 장 뒤집기’로 함께 연습해 볼 수 있어요.', '크기가 같은 분수(1/2과 4/8)가 나오면 “전쟁!”'],
      ideas=['그림 없는 카드로 하면 통분·크기 비교 연습이 돼요(5학년).']),
 dict(id='bignum', title='가장 큰 수 만들기', ico='🔟', acc='#7B4FB0', rec='추천 2~4학년 · 자릿값·큰 수 · 반 전체', desc='숫자 카드를 뽑을 때마다 바로 자리를 정해 써서 가장 큰(작은) 수를 만들어요.',
      how=['자릿수와 목표(가장 큰/작은 수)를 고르고 🖨️ 놀이판을 인쇄해요(한 쪽에 5판).', '선생님 화면에서 ‘카드 뽑기’ — 0~9 카드가 한 장씩 겹치지 않게 나와요.', '칸이 다 차면 화면에 그 숫자로 만들 수 있었던 가장 큰·작은 수가 나와요.'],
      ideas=['“9가 먼저 나오면 어디에 쓸까?” 전략 이야기하기.', '다섯·여섯 자리로 큰 수 읽기 연습(4학년).']),
 dict(id='area', title='넓이 땅따먹기', ico='🟥', acc='#1C8C7A', rec='추천 3~5학년 · 곱셈·직사각형의 넓이 · 2명', desc='주사위 두 눈만큼 가로·세로 직사각형을 그려 땅을 차지하고 넓이 식을 써요.',
      how=['모눈 크기를 고르고 🖨️ 인쇄해요(모눈 한 쪽 + 규칙·기록표 한 쪽).', '준비물: 주사위 2개(또는 화면 주사위), 서로 다른 색연필 2자루.'],
      ideas=['끝난 뒤 남은 빈칸의 넓이도 세어 보기.', '3학년은 칸을 세어 곱셈 확인, 5학년은 넓이 단위(cm²)와 잇기.']),
]

def build(g):
    rd = lambda f: f.read_text(encoding='utf-8')
    gnav = ''.join(f'<a href="{x["id"]}.html"' + (' aria-current="page"' if x is g else '') + f'>{x["title"]}</a>' for x in GAMES)
    figcss = '\n'.join(l for l in rd(MD / 'dict.css').splitlines() if l.startswith('.fd-'))
    rep = {'TITLE': g['title'], 'DESC': g['desc'], 'ICO': g['ico'], 'REC': g['rec'], 'GNAV': gnav,
           'HOW': '<ul>' + ''.join(f'<li>{x}</li>' for x in g['how']) + '</ul>', 'IDEAS': ''.join(f'<li>{x}</li>' for x in g['ideas']),
           'DATA': json.dumps({'id': g['id']}), 'TOOL': rd(MD / 'figs.js') + rd(HERE / 'cp.js') + rd(HERE / 'games' / f"{g['id']}.js") + '\nwindow.TOOL = function (host, api) { window.GAME(host, api) };', 'SHELL': rd(MT / 'shell.js'),
           'CSS': rd(MT / 'page.css').replace('{ACC}', g['acc']).replace('{TOOLCSS}', figcss + '\n' + rd(HERE / 'play.css')),
           'HEADSNIP': rd(OG / 'head_snip.html'),
           'FOOT': rd(OG / 'foot.html').replace('쉬는 시간에 친구와 함께 즐기는 종이접기 자료입니다.', '인쇄해서 교실에서 함께 하는 수학 놀이 자료입니다.'),
           'HOMEFRAG': rd(OG / 'home.html').replace('{HOME}', '../../index.html')}
    s = re.sub(r'\{([A-Z]+)\}', lambda m: rep.get(m.group(1), m.group(0)), rd(HERE / 'page.html'))
    out = OUT / f"{g['id']}.html"; out.parent.mkdir(parents=True, exist_ok=True)
    old = out.read_text(encoding='utf-8') if out.exists() else ''
    strip = lambda x: re.sub(r'<!--hj-c(?:theme|icons)-->.*?<!--/hj-c(?:theme|icons)-->', '', x, flags=re.S)
    if strip(old) == s: return False
    out.write_text(s, encoding='utf-8'); return True

def check():
    bad = []
    for g in GAMES:
        f = HERE / 'games' / f"{g['id']}.js"
        if not f.exists() or 'window.GAME = function' not in f.read_text(encoding='utf-8'): bad.append(g['id'] + ': games 파일 없음')
    return bad

if __name__ == '__main__':
    bad = check()
    if bad: print('\n'.join(bad)); sys.exit('교실 수학 놀이 점검 실패')
    print('교실 수학 놀이 점검 통과')
    if sys.argv[1:] == ['check']: sys.exit(0)
    n = sum(build(g) for g in GAMES)
    print(f'교실 수학 놀이 {n}쪽 다시 만듦 (모두 {len(GAMES)}가지)')
