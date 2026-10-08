#!/usr/bin/env python3
"""기타 › 수학게임 › 수학 보드게임 페이지 만들기 (2026-10-08)

    python3 _build/mathboard/build.py      # project/mathboard/product.html · fifteen.html · dots.html

판 놀이(_build/board/)의 공통 화면 play.js·board.css·play.css를 같이 쓰고, 게임마다 엔진 <게임>_engine.js(make…: init·moves·play·over·ai)와
판 그리기 <게임>_view.js(window.VIEW), 모양 mathboard.css, 틀 page.html. 메뉴 project/mathboard/index.html은 손으로 고치는 메뉴(apply_theme.py).
고친 뒤 루트에서 python3 _build/theme/apply_content_theme.py.
"""
import re, sys, json, pathlib
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
OG = ROOT / '_build' / 'origami'
MT = ROOT / '_build' / 'mathtools'
BD = ROOT / '_build' / 'board'
OUT = ROOT / 'project' / 'mathboard'

def lv(rows, opt=None, draw_from=99):
    out = []
    for i, (n, info, t) in enumerate(rows):
        L = dict(name=n, info=info, t=t)
        if opt: L['opt'] = opt(i + 1)
        if i + 1 >= draw_from: L['drawOk'] = True
        out.append(L)
    return out
PRODUCT = lv([('새싹', '아무 데나 칠해요', 30), ('떡잎', '이기는 칸은 꼭 칠해요', 30), ('꽃봉오리', '내가 이기려는 칸을 막아요', 30), ('꽃', '두 수 앞을 봐요', 25), ('열매', '세 수 앞을 봐요', 25),
              ('나무', '네 수 앞을 봐요', 25), ('숲', '다섯 수 앞을 봐요', 20), ('산', '여섯 수 앞을 봐요', 20), ('하늘', '일곱 수 앞을 봐요', 20), ('별', '가장 멀리 읽어요', 20)])
FIFTEEN = lv([('새싹', '아무 카드나 가져가요', 20), ('떡잎', '15가 되는 카드는 꼭 가져가요', 20), ('꽃봉오리', '내 15를 가끔 막아요', 20), ('꽃', '내 15를 꼭 막아요', 20), ('열매', '끝까지 따지지만 실수가 많아요', 20),
              ('나무', '실수가 줄어요', 20), ('숲', '실수가 더 줄어요', 15), ('산', '거의 실수하지 않아요', 15), ('하늘', '아주 가끔만 실수해요', 15), ('별', '실수하지 않아요', 15)], draw_from=7)
DOTS = lv([('새싹', '아무 선이나 그어요', 30), ('떡잎', '상자는 꼭 가져가요', 30), ('꽃봉오리', '세 번째 변을 가끔 피해요', 30), ('꽃', '세 번째 변을 꼭 피해요', 30), ('열매', '줄 수밖에 없으면 가장 적게 줘요', 30),
           ('나무', '4×4 판 · 가장 적게 줘요', 25), ('숲', '4×4 · 끝 12선은 끝까지 따져요', 25), ('산', '4×4 · 끝 16선', 25), ('하늘', '4×4 · 끝 20선', 20), ('별', '4×4 · 가장 강한 단계', 20)],
          opt=lambda n: {'n': 3 if n <= 5 else 4})
PAGES = [
 dict(id='product', title='곱셈 사목', ico='✖️', acc='#7B4FB0', make='makeProduct', levels=PRODUCT, rec='추천 2~4학년 · 곱셈구구, 약수(곱이 같은 두 수)',
      desc='아래 1~9 줄의 집게 두 개 중 하나를 옮기면, 두 수의 곱 칸을 내 색으로 칠해요. 가로·세로·대각선으로 네 칸을 먼저 이으면 이겨요.',
      how=['판에는 1~9 두 수의 곱 36가지가 작은 수부터 놓여 있어요. 아래 1~9 줄에는 집게 ㄱ(위)·ㄴ(아래)이 있어요.',
           '맨 처음 사람은 집게 ㄱ만 놓아요(칠하지 않아요). 다음 사람이 집게 ㄴ을 놓으면 두 수의 곱 칸을 칠해요.',
           '그다음부터는 차례마다 집게 하나만 다른 수로 옮기고, 두 집게의 곱 칸을 칠해요. 이미 칠한 칸이 되는 곳으로는 옮길 수 없어요. 두 집게가 같은 수에 있어도 돼요(예: 7 × 7 = 49).',
           '누르는 법: 옮길 집게(ㄱ·ㄴ)를 누르고 아래 수를 누르거나, 칠할 칸을 바로 눌러요(점선 칸 = 지금 칠할 수 있는 칸).',
           '🤖 인공지능과: 나는 파랑(먼저), 인공지능은 주황. 한 수 시간(30초 → 20초), 시간이 다 되면 그 판은 져요. 이기면 다음 단계가 열려요.',
           '👫 친구와 둘이: 한 화면에서 번갈아, 한 수 시간(없음·20·30·60초)과 무르기.'],
      ideas=['내가 칠하고 싶은 칸(예: 24)을 만들려면 집게를 어디로 옮겨야 하는지 — 24의 약수 짝(3×8, 4×6) 찾기.', '상대 집게를 옮겨 놓은 자리 때문에 상대가 칠하게 되는 칸도 생각하기 — 한 수 앞 내다보기.']),
 dict(id='fifteen', title='15 만들기', ico='🔢', acc='#2B6FB8', make='makeFifteen', levels=FIFTEEN, rec='추천 2~4학년 · 덧셈 조합(세 수의 합), 마방진',
      desc='1~9 수 카드를 번갈아 한 장씩 가져가요. 내 카드 가운데 세 장의 합이 15가 되면 이겨요. 다 끝나면 놀라운 비밀이 열려요!',
      how=['카드를 누르면 내 것이 돼요. 내 카드 가운데 아무 세 장의 합이 15이면 이겨요(네 장 이상 가져도 세 장만 맞으면 돼요).',
           '9장을 다 가져갔는데 15를 만든 사람이 없으면 비겨요.',
           '🤖 인공지능과: 나는 파랑(먼저), 인공지능은 주황. 한 수 시간(20초 → 15초). 7단계부터는 인공지능이 거의 실수하지 않아서 비기기만 해도 다음 단계가 열려요.',
           '🔮 비밀: 끝나면 카드를 마방진(가로·세로·대각선 합이 모두 15)에 놓아 보여 줘요. 세 수의 합이 15인 묶음 8가지가 마방진의 한 줄 8가지와 똑같아서, 사실은 틱택토와 같은 게임이에요.',
           '👫 친구와 둘이: 한 화면에서 번갈아, 한 수 시간(없음·15·30·60초)과 무르기.'],
      ideas=['합이 15가 되는 세 수 묶음을 모두 찾아보기(8가지).', '비밀 마방진을 보고, 왜 틱택토와 같은 게임인지 설명해 보기 — 한 판을 틱택토 판에 다시 그려 보기.']),
 dict(id='dots', title='점 잇기 상자', ico='⬜', acc='#2E9E5B', make='makeDots', levels=DOTS, rec='추천 2~6학년 · 넓이(상자 세기), 전략',
      desc='두 점 사이에 선을 하나씩 그어요. 상자의 네 번째 변을 그은 사람이 그 상자를 갖고 한 번 더 해요. 상자를 더 많이 가진 쪽이 이겨요.',
      how=['두 점 사이(점선)를 누르면 선이 그어져요. 마우스를 올리면 그을 선이 미리 보여요.',
           '내가 상자의 네 번째 변을 그으면 그 상자에 내 색이 칠해지고 한 번 더 해요. 선을 다 그으면 상자가 많은 쪽이 이겨요.',
           '세 번째 변을 그으면 상대가 그 상자를 가져가요. 끝이 다가오면 상자를 조금 내주고 더 많이 가져오는 방법도 있어요.',
           '🤖 인공지능과: 1~5단계는 상자 3×3, 6~10단계는 4×4. 나는 파랑(먼저). 한 수 시간(30초 → 20초). 이기면 다음 단계가 열려요.',
           '👫 친구와 둘이: 판 크기(3×3·4×4·5×5), 한 수 시간(없음·15·30·60초)과 무르기.'],
      ideas=['끝났을 때 상자 수의 합이 판 전체(3×3이면 9)와 같은지 확인하기.', '‘세 번째 변을 긋지 않기’ 전략을 써 본 뒤, 왜 끝에는 피할 수 없는지 이야기하기(짝수·홀수).']),
]

def build(t):
    rd = lambda f: f.read_text(encoding='utf-8')
    gnav = ''.join(f'<a href="{x["id"]}.html"' + (' aria-current="page"' if x is t else '') + f'>{x["ico"]} {x["title"]}</a>' for x in PAGES)
    eng = rd(HERE / f"{t['id']}_engine.js")
    rep = {'TITLE': t['title'], 'DESC': t['desc'], 'ICO': t['ico'], 'REC': t['rec'], 'GNAV': gnav,
           'HOW': '<ul>' + ''.join(f'<li>{x}</li>' for x in t['how']) + '</ul>', 'IDEAS': ''.join(f'<li>{x}</li>' for x in t['ideas']),
           'DATA': json.dumps({'id': t['id'], 'game': t['id'], 'levels': t['levels'], 'make': t['make']}, ensure_ascii=False).replace('</', '<\\/'),
           'ENGINE': eng, 'ENGSRC': json.dumps(eng, ensure_ascii=False).replace('</', '<\\/'),
           'TOOL': rd(HERE / f"{t['id']}_view.js") + '\n' + rd(BD / 'play.js'), 'SHELL': rd(MT / 'shell.js'),
           'CSS': rd(MT / 'page.css').replace('{ACC}', t['acc']).replace('{TOOLCSS}', rd(BD / 'board.css') + rd(BD / 'play.css') + rd(HERE / 'mathboard.css')), 'HEADSNIP': rd(OG / 'head_snip.html'),
           'FOOT': rd(OG / 'foot.html').replace('쉬는 시간에 친구와 함께 즐기는 종이접기 자료입니다.', '인공지능이나 친구와 겨루며 수학을 익히는 보드게임 자료입니다.'),
           'HOMEFRAG': rd(OG / 'home.html').replace('{HOME}', '../../index.html')}
    s = re.sub(r'\{([A-Z]+)\}', lambda m: rep.get(m.group(1), m.group(0)), rd(HERE / 'page.html'))
    out = OUT / f"{t['id']}.html"; out.parent.mkdir(parents=True, exist_ok=True)
    old = out.read_text(encoding='utf-8') if out.exists() else ''
    strip = lambda x: re.sub(r'<!--hj-c(?:theme|icons)-->.*?<!--/hj-c(?:theme|icons)-->', '', x, flags=re.S)
    if strip(old) == s: return False
    out.write_text(s, encoding='utf-8'); return True

if __name__ == '__main__':
    bad = [p['id'] for p in PAGES if len(p['levels']) != 10]
    if bad: sys.exit('수학 보드게임 점검 실패: 단계 10개가 아님 ' + ', '.join(bad))
    print('수학 보드게임 점검 통과')
    if sys.argv[1:] == ['check']: sys.exit(0)
    n = sum(build(t) for t in PAGES)
    print(f'수학 보드게임 {n}쪽 다시 만듦 (모두 {len(PAGES)}쪽)')
