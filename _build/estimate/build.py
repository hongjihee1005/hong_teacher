#!/usr/bin/env python3
"""기타 › 수학게임 › 어림 왕 페이지 만들기 (2026-10-07)

    python3 _build/estimate/build.py          # project/estimate/<놀이>.html

놀이 목록 build.py의 TOOLS, 공통 est.js(10판·별·결과)·est.css, 놀이마다 tools/<id>.js. 틀 page.html(수학 교구실 page.css·shell.js를 같이 씀).
메뉴 project/estimate/index.html은 손으로 고치는 메뉴(apply_theme.py). 고친 뒤 루트에서 python3 _build/theme/apply_content_theme.py.
"""
import re, sys, json, pathlib
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
OG = ROOT / '_build' / 'origami'
MT = ROOT / '_build' / 'mathtools'
OUT = ROOT / 'project' / 'estimate'
STAR = '별은 실제와의 차이로 매겨요(★★★ 아주 가까움 · ★★ 가까움 · ★ 조금 멂). 10판이 끝나면 별 개수로 ‘어림 왕’ 칭호!'
TOOLS = [
 dict(id='length', title='길이 어림', ico='📏', acc='#E5534B', rec='추천 2~4학년 · 길이 재기, 어림하기', desc='빨간 막대를 기준으로 파란 막대가 몇 개만큼인지 어림해요.',
      how=['빨간 막대 하나의 길이를 눈에 익히고, 파란 막대가 그 몇 개만큼인지 써요(0.5개 단위도 나와요).', '확인을 누르면 빨간 막대를 이어 붙여 보여 줘요.', STAR],
      ideas=['교실 물건(연필·책상)을 클립 몇 개만큼인지 어림하고 재어 보는 활동으로 잇기.']),
 dict(id='angle', title='각도 어림', ico='📐', acc='#7B4FB0', rec='추천 4학년 · 각도, 예각·둔각', desc='화면의 각이 몇 도인지 어림해 써요. 확인하면 각도기가 나타나요.',
      how=['각을 보고 몇 도인지 써요. 💡 먼저 직각(90°)보다 큰지 작은지, 45°와 견줘 보세요.', '각이 돌아가 있는 문제도 있어요.', '차이 5° 안 ★★★ · 12° 안 ★★ · 25° 안 ★'],
      ideas=['손으로 30°·60°·90°를 만들어 보는 몸 각도기 놀이와 함께.']),
 dict(id='count', title='개수 어림', ico='🔵', acc='#3B6FD6', rec='추천 1~4학년 · 수 세기, 묶어 세기, 어림하기', desc='3초 동안만 보이는 점이 모두 몇 개인지 어림해요.',
      how=['‘보기 시작’을 누르면 3초 동안 점이 보였다 사라져요.', '어림한 수를 쓰고 확인하면 점이 다시 보이고 10개마다 번호가 붙어요.', STAR],
      ideas=['병 속 콩·구슬 개수 어림 대회로 잇기(묶음 하나를 세어 몇 배인지).']),
 dict(id='time', title='시간 어림', ico='⏱️', acc='#1C8C7A', rec='추천 1~3학년 · 시간(초·분)', desc='시계를 보지 않고 5초~1분이 지났다고 느낄 때 멈춰요.',
      how=['시작을 누르고 마음속으로 세다가, 정해진 시간이 지났다고 생각될 때 멈춤.', '걸린 시간이 0.1초까지 나와요.', STAR],
      ideas=['반 전체가 눈을 감고 1분이 됐다고 생각하면 손 들기 → 실제와 견주기.']),
 dict(id='calc', title='어림셈', ico='🧮', acc='#E0861A', rec='추천 3~6학년 · 덧셈·뺄셈·곱셈·나눗셈의 어림, 어림하기(올림·버림·반올림)', desc='정확히 계산하지 않고 몇십·몇백으로 어림해 가장 가까운 답을 골라요.',
      how=['계산식을 보고 8초 안에 가장 가까운 수를 골라요.', '확인하면 정확한 답과 가장 가까운 보기, 어림하는 방법이 나와요.', '별은 고른 보기와 정확한 답의 차이로 매겨요.'],
      ideas=['장보기 영수증 합계를 먼저 어림하고 계산기로 확인하기.']),
]

def build(t):
    rd = lambda f: f.read_text(encoding='utf-8')
    gnav = ''.join(f'<a href="{x["id"]}.html"' + (' aria-current="page"' if x is t else '') + f'>{x["title"]}</a>' for x in TOOLS)
    rep = {'TITLE': t['title'], 'DESC': t['desc'], 'ICO': t['ico'], 'REC': t['rec'], 'GNAV': gnav,
           'HOW': '<ul>' + ''.join(f'<li>{x}</li>' for x in t['how']) + '</ul>', 'IDEAS': ''.join(f'<li>{x}</li>' for x in t['ideas']),
           'DATA': json.dumps({'id': t['id']}), 'TOOL': rd(HERE / 'est.js') + rd(HERE / 'tools' / f"{t['id']}.js"), 'SHELL': rd(MT / 'shell.js'),
           'CSS': rd(MT / 'page.css').replace('{ACC}', t['acc']).replace('{TOOLCSS}', rd(HERE / 'est.css')), 'HEADSNIP': rd(OG / 'head_snip.html'),
           'FOOT': rd(OG / 'foot.html').replace('쉬는 시간에 친구와 함께 즐기는 종이접기 자료입니다.', '어림하는 힘을 기르는 수학 놀이 자료입니다.'),
           'HOMEFRAG': rd(OG / 'home.html').replace('{HOME}', '../../index.html')}
    s = re.sub(r'\{([A-Z]+)\}', lambda m: rep.get(m.group(1), m.group(0)), rd(HERE / 'page.html'))
    out = OUT / f"{t['id']}.html"; out.parent.mkdir(parents=True, exist_ok=True)
    old = out.read_text(encoding='utf-8') if out.exists() else ''
    strip = lambda x: re.sub(r'<!--hj-c(?:theme|icons)-->.*?<!--/hj-c(?:theme|icons)-->', '', x, flags=re.S)
    if strip(old) == s: return False
    out.write_text(s, encoding='utf-8'); return True

if __name__ == '__main__':
    bad = [t['id'] for t in TOOLS if not (HERE / 'tools' / f"{t['id']}.js").exists()]
    if bad: sys.exit('어림 왕 점검 실패: ' + ', '.join(bad))
    print('어림 왕 점검 통과')
    if sys.argv[1:] == ['check']: sys.exit(0)
    n = sum(build(t) for t in TOOLS)
    print(f'어림 왕 {n}쪽 다시 만듦 (모두 {len(TOOLS)}가지)')
