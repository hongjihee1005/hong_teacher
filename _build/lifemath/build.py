#!/usr/bin/env python3
"""기타 › 수학게임 › 생활 속 수학 페이지 만들기 (2026-10-07)

    python3 _build/lifemath/build.py          # project/lifemath/<활동>.html

활동 목록 build.py의 TOOLS, 공통 life.js(10문제 진행·돈 그림)·life.css, 활동 tools/<id>.js. 틀 page.html(용돈 기입장 인쇄 칸 포함, 수학 교구실 page.css·shell.js를 같이 씀).
메뉴 project/lifemath/index.html은 손으로 고치는 메뉴(apply_theme.py). 고친 뒤 루트에서 python3 _build/theme/apply_content_theme.py.
"""
import re, sys, json, pathlib
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
OG = ROOT / '_build' / 'origami'
MT = ROOT / '_build' / 'mathtools'
OUT = ROOT / 'project' / 'lifemath'
TEN = '10문제, 처음에 맞히면 점수. 한 번 틀리면 실마리가 나오고, 두 번 틀리면 풀이를 보여 줘요. 문제는 할 때마다 새로 나와요.'
TOOLS = [
 dict(id='shop', title='장보기', ico='🛒', acc='#E0861A', rec='추천 2~4학년 · 세 자리·네 자리 수의 덧셈과 뺄셈, 곱셈', desc='장바구니 물건값의 합계를 구하고, 낸 돈에서 거스름돈을 계산해요.',
      how=['물건마다 값 × 개수를 구해 더하고(모두), 낸 돈에서 빼요(거스름돈).', TEN], ideas=['교실 시장 놀이 전에 연습으로.', '광고지를 오려 우리 반 장바구니 만들기.']),
 dict(id='change', title='거스름돈', ico='🪙', acc='#B8860B', rec='추천 2~3학년 · 돈 세기, 뺄셈', desc='물건값과 낸 돈을 보고, 동전과 지폐를 눌러 거스름돈을 만들어 건네요.',
      how=['아래 돈을 눌러 쟁반에 거스름돈을 모으고 ‘건네주기’. 잘못 넣으면 ‘한 개 빼기’.', '맞히면 가장 적은 개수로 주는 방법도 알려 줘요.', TEN], ideas=['짝과 가게 주인·손님 역할 놀이.']),
 dict(id='allow', title='용돈 기입장', ico='💰', acc='#2EAA6A', rec='추천 3~5학년 · 덧셈과 뺄셈, 표 읽기, 경제 생활', desc='들어온 돈은 더하고 쓴 돈은 빼서 용돈 기입장의 남은 돈을 채워요. 빈 기입장도 인쇄할 수 있어요.',
      how=['처음 가진 돈에서 차례로 더하고 빼서 빈칸의 남은 돈을 구해요.', '🖨️ 아래 단추로 내가 쓸 빈 용돈 기입장(A4)을 인쇄해요.', TEN], ideas=['일주일 동안 용돈 기입장을 쓰고 가장 많이 쓴 곳 찾기.', '저금 목표를 세우고 몇 주가 걸릴지 계산하기.']),
 dict(id='recipe', title='요리 비율', ico='🍳', acc='#E5534B', rec='추천 5~6학년 · 곱셈·나눗셈, 비와 비율, 비례식', desc='레시피의 인분 수를 바꿀 때 재료가 얼마나 필요한지 계산해요.',
      how=['인분 수가 몇 배가 되었는지 먼저 구하고, 재료에 같은 수를 곱(또는 나눗셈)해요.', '풀이에 비례식도 함께 보여 줘요.', TEN], ideas=['실과 요리 실습 전에 우리 모둠 인원수에 맞게 재료 계산하기.']),
 dict(id='time', title='생활 시간 계산', ico='⏰', acc='#2B6FB8', rec='추천 3학년 · 시간의 덧셈과 뺄셈(시각과 시간)', desc='영화·경기·여행이 끝나는 시각과 걸린 시간을 계산해요.',
      how=['끝나는 시각은 시작 시각 + 걸린 시간, 걸린 시간은 끝난 시각 − 시작 시각.', '오후 시각은 2시처럼 써도, 14시처럼 써도 맞아요.', TEN], ideas=['우리 반 하루 시간표로 쉬는 시간이 모두 몇 분인지 계산하기.']),
]

def build(t):
    rd = lambda f: f.read_text(encoding='utf-8')
    gnav = ''.join(f'<a href="{x["id"]}.html"' + (' aria-current="page"' if x is t else '') + f'>{x["title"]}</a>' for x in TOOLS)
    extra = "\ndocument.addEventListener('DOMContentLoaded',function(){});" if False else ''
    tool = rd(HERE / 'life.js') + rd(HERE / 'tools' / f"{t['id']}.js")
    if t['id'] == 'allow':
        tool += "\n(function(){var f=window.TOOL;window.TOOL=function(h,a){f(h,a);var b=document.createElement('p');b.className='tl-row';b.innerHTML='<button type=\"button\" class=\"tl-btn\">🖨️ 빈 용돈 기입장 인쇄</button>';h.parentNode.appendChild(b);b.querySelector('button').onclick=function(){document.documentElement.classList.add('lf-printing');var off=function(){document.documentElement.classList.remove('lf-printing');window.removeEventListener('afterprint',off)};window.addEventListener('afterprint',off);setTimeout(function(){window.print()},80)}}})();"
    rep = {'TITLE': t['title'], 'DESC': t['desc'], 'ICO': t['ico'], 'REC': t['rec'], 'GNAV': gnav,
           'HOW': '<ul>' + ''.join(f'<li>{x}</li>' for x in t['how']) + '</ul>', 'IDEAS': ''.join(f'<li>{x}</li>' for x in t['ideas']),
           'DATA': json.dumps({'id': t['id']}), 'TOOL': tool, 'SHELL': rd(MT / 'shell.js'),
           'CSS': rd(MT / 'page.css').replace('{ACC}', t['acc']).replace('{TOOLCSS}', rd(HERE / 'life.css')), 'HEADSNIP': rd(OG / 'head_snip.html'),
           'FOOT': rd(OG / 'foot.html').replace('쉬는 시간에 친구와 함께 즐기는 종이접기 자료입니다.', '생활 속에서 수학을 쓰는 자료입니다.'),
           'HOMEFRAG': rd(OG / 'home.html').replace('{HOME}', '../../index.html')}
    s = re.sub(r'\{([A-Z]+)\}', lambda m: rep.get(m.group(1), m.group(0)), rd(HERE / 'page.html'))
    out = OUT / f"{t['id']}.html"; out.parent.mkdir(parents=True, exist_ok=True)
    old = out.read_text(encoding='utf-8') if out.exists() else ''
    strip = lambda x: re.sub(r'<!--hj-c(?:theme|icons)-->.*?<!--/hj-c(?:theme|icons)-->', '', x, flags=re.S)
    if strip(old) == s: return False
    out.write_text(s, encoding='utf-8'); return True

if __name__ == '__main__':
    bad = [t['id'] for t in TOOLS if not (HERE / 'tools' / f"{t['id']}.js").exists()]
    if bad: sys.exit('생활 속 수학 점검 실패: ' + ', '.join(bad))
    print('생활 속 수학 점검 통과')
    if sys.argv[1:] == ['check']: sys.exit(0)
    n = sum(build(t) for t in TOOLS)
    print(f'생활 속 수학 {n}쪽 다시 만듦 (모두 {len(TOOLS)}가지)')
