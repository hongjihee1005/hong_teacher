#!/usr/bin/env python3
"""쉬는 시간 › 오목·바둑 페이지 만들기 (2026-10-07)

    python3 _build/board/build.py      # break/board/omok.html · baduk.html

규칙·인공지능 omok_engine.js(makeOmok)·baduk_engine.js(makeBaduk) — 화면에 넣고, 같은 글을 웹 워커로도 돌림(ENG_SRC).
화면 board.js·board.css, 틀 page.html(수학 교구실 page.css·shell.js를 같이 씀), 단계표는 아래 LEVELS.
메뉴 break/board/index.html은 손으로 고치는 메뉴(apply_theme.py). 고친 뒤 루트에서 python3 _build/theme/apply_content_theme.py.
"""
import re, sys, json, pathlib
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
OG = ROOT / '_build' / 'origami'
MT = ROOT / '_build' / 'mathtools'
OUT = ROOT / 'break' / 'board'

OMOK = [dict(name=n, info=i, t=t) for n, i, t in [
    ('새싹', '가끔 실수하는 인공지능', 30), ('떡잎', '4는 거의 꼭 막아요', 30), ('꽃봉오리', '3도 막기 시작해요', 30), ('꽃', '공격과 수비를 함께 봐요', 25), ('열매', '두 줄 공격(4·3)을 노려요', 25),
    ('나무', '이기는 연속 4를 찾아요', 25), ('숲', '내 필승 수를 미리 막아요', 20), ('산', '더 멀리 읽어요', 20), ('하늘', '아주 멀리 읽어요', 15), ('별', '가장 강한 단계', 15)]]
BADUK = [
    dict(name='따먹기 첫걸음', info='7줄 · 돌 1개 먼저 잡기', n=7, goal=1, komi=0, it=40, rnd=.35, t=30),
    dict(name='따먹기 셋', info='7줄 · 돌 3개 먼저 잡기', n=7, goal=3, komi=0, it=300, rnd=.1, t=30),
    dict(name='따먹기 다섯', info='9줄 · 돌 5개 먼저 잡기', n=9, goal=5, komi=0, it=1200, rnd=0, t=30),
    dict(name='9줄 바둑 입문', info='9줄 · 집 많은 쪽 승 · 덤 없음', n=9, goal=0, komi=0, it=400, rnd=.15, t=45),
    dict(name='9줄 바둑 초급', info='9줄 · 덤 없음', n=9, goal=0, komi=0, it=900, rnd=0, t=45),
    dict(name='9줄 바둑 중급', info='9줄 · 덤 없음', n=9, goal=0, komi=0, it=1800, rnd=0, t=45),
    dict(name='9줄 바둑 덤', info='9줄 · 백 덤 6.5', n=9, goal=0, komi=6.5, it=3000, rnd=0, t=40),
    dict(name='9줄 바둑 고급', info='9줄 · 덤 6.5', n=9, goal=0, komi=6.5, it=5000, rnd=0, t=40),
    dict(name='9줄 바둑 고수', info='9줄 · 덤 6.5', n=9, goal=0, komi=6.5, it=8000, rnd=0, t=30),
    dict(name='9줄 바둑 최강', info='9줄 · 덤 6.5 · 가장 강해요', n=9, goal=0, komi=6.5, it=12000, rnd=0, t=30)]
for L in BADUK: L['ms'] = 4500
PAGES = [
 dict(id='omok', title='오목', ico='⚫', acc='#2B2B2B', eng='omok_engine.js', levels=OMOK, rec='모든 학년 · 인공지능과 10단계 · 친구와 둘이',
      desc='가로·세로·대각선으로 내 돌 다섯 개를 먼저 이으면 이겨요. 인공지능과 1단계부터 차례로 겨루거나 친구와 둘이 둬요.',
      how=['🤖 인공지능과: 나는 흑(먼저), 인공지능은 백. 한 수씩 번갈아 두고, 내 차례에는 한 수 시간(30초 → 15초)이 있어요. 시간이 다 되면 그 판은 져요.',
           '이기면 다음 단계가 열려요(기록은 이 기기에만). 단계가 오를수록 인공지능이 더 잘 막고, 이기는 수를 더 멀리 읽어요.',
           '쌍삼(3·3) 금지: 한 수로 ‘열린 3’이 두 줄 생기는 자리에는 둘 수 없어요(인공지능도 같아요). 친구와 둘이 할 때는 끌 수 있어요.',
           '👫 친구와 둘이: 한 화면에서 번갈아 두고, 한 수 시간(없음·20·30·60초)과 무르기가 있어요.'],
      ideas=['쉬는 시간 오목 토너먼트 — 이긴 사람끼리 다시 대결.', '인공지능에게 진 판을 친구와 다시 둬 보며 어디서 막아야 했는지 이야기하기.']),
 dict(id='baduk', title='바둑', ico='⚪', acc='#8A5A1F', eng='baduk_engine.js', levels=BADUK, rec='모든 학년 · 따먹기 바둑 → 9줄 바둑',
      desc='1~3단계는 돌을 먼저 잡으면 이기는 따먹기 바둑, 4~10단계는 집을 더 많이 짓는 9줄 바둑이에요. 친구와 둘이 13줄 바둑도 둘 수 있어요.',
      how=['돌은 줄이 만나는 점에 둬요. 상대 돌의 숨 쉴 곳(활로)을 모두 막으면 그 돌을 잡아요.',
           '스스로 잡히는 자리, 방금 따낸 자리를 바로 다시 따내는 ‘패’는 둘 수 없어요(화면에 알려 줘요).',
           '9줄 바둑은 더 둘 곳이 없으면 ‘통과’를 눌러요. 두 사람(나와 인공지능)이 모두 통과하면 집을 세요: 판 위의 내 돌 + 내가 둘러싼 집(죽은 돌은 저절로 찾아 줘요). 덤은 나중에 두는 백에게 더하는 점수예요.',
           '🤖 인공지능과: 나는 흑, 한 수 시간이 있어요(시간이 다 되면 그 판은 져요). 이기면 다음 단계가 열려요.',
           '👫 친구와 둘이: 따먹기(7줄·9줄)·9줄·13줄 바둑, 덤과 한 수 시간을 골라요. 집을 셀 때 죽은 돌이 틀렸으면 그 돌을 눌러 바꿔요.'],
      ideas=['따먹기 바둑으로 ‘단수’(활로가 하나 남은 상태) 개념 익히기.', '9줄 바둑이 끝나면 집 세는 화면을 보며 우리 집과 상대 집을 함께 세어 보기.']),
]

def build(t):
    rd = lambda f: f.read_text(encoding='utf-8')
    gnav = ''.join(f'<a href="{x["id"]}.html"' + (' aria-current="page"' if x is t else '') + f'>{x["ico"]} {x["title"]}</a>' for x in PAGES)
    eng = rd(HERE / t['eng'])
    rep = {'TITLE': t['title'], 'DESC': t['desc'], 'ICO': t['ico'], 'REC': t['rec'], 'GNAV': gnav,
           'HOW': '<ul>' + ''.join(f'<li>{x}</li>' for x in t['how']) + '</ul>', 'IDEAS': ''.join(f'<li>{x}</li>' for x in t['ideas']),
           'DATA': json.dumps({'id': t['id'], 'game': t['id'], 'levels': t['levels']}, ensure_ascii=False).replace('</', '<\\/'),
           'ENGINE': eng, 'ENGSRC': json.dumps(eng, ensure_ascii=False).replace('</', '<\\/'),
           'TOOL': rd(HERE / 'board.js'), 'SHELL': rd(MT / 'shell.js'),
           'CSS': rd(MT / 'page.css').replace('{ACC}', t['acc']).replace('{TOOLCSS}', rd(HERE / 'board.css')), 'HEADSNIP': rd(OG / 'head_snip.html'),
           'FOOT': rd(OG / 'foot.html').replace('쉬는 시간에 친구와 함께 즐기는 종이접기 자료입니다.', '쉬는 시간에 인공지능이나 친구와 함께 즐기는 오목·바둑 자료입니다.'),
           'HOMEFRAG': rd(OG / 'home.html').replace('{HOME}', '../../index.html')}
    s = re.sub(r'\{([A-Z]+)\}', lambda m: rep.get(m.group(1), m.group(0)), rd(HERE / 'page.html'))
    out = OUT / f"{t['id']}.html"; out.parent.mkdir(parents=True, exist_ok=True)
    old = out.read_text(encoding='utf-8') if out.exists() else ''
    strip = lambda x: re.sub(r'<!--hj-c(?:theme|icons)-->.*?<!--/hj-c(?:theme|icons)-->', '', x, flags=re.S)
    if strip(old) == s: return False
    out.write_text(s, encoding='utf-8'); return True

if __name__ == '__main__':
    bad = [p['id'] for p in PAGES if len(p['levels']) != 10]
    if bad: sys.exit('오목·바둑 점검 실패: 단계 10개가 아님 ' + ', '.join(bad))
    print('오목·바둑 점검 통과')
    if sys.argv[1:] == ['check']: sys.exit(0)
    n = sum(build(t) for t in PAGES)
    print(f'오목·바둑 {n}쪽 다시 만듦 (모두 {len(PAGES)}쪽)')
