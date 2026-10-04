#!/usr/bin/env python3
"""쉬는 시간 › 종이접기 학년 페이지 만들기 (2026-10-04)

    python3 _build/origami/build.py        # break/origami/g1.html ~ g6.html

작품 그림·설명 원본: models_g1.py ~ models_g6.py (좌표는 geo.py 도구로 계산)
화면: page.html + page.css + svg.css + engine.js(그림) + app.js(넘겨 보기)
고친 뒤에는 루트에서 python3 _build/theme/apply_content_theme.py 를 돌려 덮개를 씌웁니다(자동 보완이 함께 돌림).
여러 번 실행해도 안전합니다(같은 원본이면 같은 결과).
"""
import os, sys, json, importlib, pathlib
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
sys.path.insert(0, str(HERE))
sys.dont_write_bytecode = True
from geo import finalize, P, V, M, U, B, L, A, FLIP, SQ

GRADES = {
  1: dict(ico='🐣', acc='#D94F72', intro='반으로 접고, 모서리를 맞추면 금방 완성! 그림을 보며 한 단계씩 따라 접어요.',
          rules=['📏 모서리와 모서리를 딱 맞춰요', '👆 손가락으로 꾹꾹 눌러 접어요', '✏️ 다 접으면 얼굴을 그려요']),
  2: dict(ico='🌱', acc='#3A8F3A', intro='비스듬히 접기와 한 장씩 접기를 배워요. 그림 속 점선을 잘 보세요.',
          rules=['📏 모서리를 딱 맞춰요', '👆 꾹꾹 눌러 접어요', '🔍 점선 = 접는 선이에요']),
  3: dict(ico='🚀', acc='#2F6FD6', intro='접었다 펴기, 뒤집기, 산 접기가 나와요. 기호를 알면 더 쉬워요.',
          rules=['🔁 접었다 펴면 선이 생겨요', '🔄 뒤집기 표시를 확인해요', '⛔ 비행기는 사람을 향해 날리지 않아요']),
  4: dict(ico='🌈', acc='#8150C8', intro='선에 딱 맞춰 접고, 가위도 써 봐요. 천천히 하면 누구나 할 수 있어요.',
          rules=['✂️ 가위는 선생님 약속대로 써요', '📏 선에 딱 맞춰 접어요', '🤝 어려우면 친구와 함께']),
  5: dict(ico='⭐', acc='#C9661A', intro='접어 모으기, 주름 접기, 입체로 세우기에 도전해요.',
          rules=['🔁 접었다 펴는 선이 많아요', '🧩 앞 단계를 정확히 해야 다음이 쉬워요', '🏆 친구와 개구리 멀리뛰기 시합!']),
  6: dict(ico='🎓', acc='#1C8C7A', intro='학 기본형(꽃잎 접기)과 안쪽 뒤집어 접기로 멋진 새를 접어요.',
          rules=['🧘 서두르지 않고 한 단계씩', '🔁 접은 선을 또렷하게 만들어요', '🐦 종이학 전에 퍼덕이는 새로 연습!']),
}

def legend():
    """접기 기호 그림 4개"""
    sq = [(50, 50), (190, 50), (190, 190), (50, 190)]
    return [
      dict(n='골짜기 접기', t='점선 쪽으로 앞으로 접어요', d=[P(sq, 'c'), V((120, 50), (120, 190)), A((60, 120), (180, 120), .35)]),
      dict(n='산 접기', t='점·선 쪽으로 뒤로 접어요', d=[P(sq, 'c'), M((120, 50), (120, 190)), B((60, 120), (180, 120), .35)]),
      dict(n='접었다 펴기', t='접어서 선을 만들고 다시 펴요', d=[P(sq, 'c'), V((120, 50), (120, 190)), U((60, 120), (180, 120), .35)]),
      dict(n='뒤집기', t='종이를 뒤집어요', d=[P(sq, 'w'), FLIP]),
    ]

def build(g):
    G = GRADES[g]
    ms = finalize(importlib.import_module(f'models_g{g}').MODELS)
    rd = lambda n: (HERE / n).read_text(encoding='utf-8')
    data = json.dumps(ms, ensure_ascii=False, separators=(',', ':'))
    leg = json.dumps(legend(), ensure_ascii=False, separators=(',', ':'))
    css = rd('page.css').replace('{ACC}', G['acc']) + rd('svg.css')
    rep = {
      '{G}': str(g), '{ICO}': G['ico'], '{INTRO}': G['intro'], '{LIST}': ', '.join(m['name'] for m in ms),
      '{RULES}': ''.join(f'<li>{r}</li>' for r in G['rules']), '{CSS}': css, '{HEADSNIP}': rd('head_snip.html'),
      '{FOOT}': rd('foot.html'), '{ENGINE}': rd('engine.js'), '{APP}': rd('app.js'), '{HOMEFRAG}': rd('home.html').replace('{HOME}', '../../index.html'),
    }
    s = rd('page.html')
    for k, v in rep.items(): s = s.replace(k, v)
    s = s.replace('{DATA}', data).replace('{LEGEND}', leg)
    out = ROOT / 'break' / 'origami' / f'g{g}.html'
    out.parent.mkdir(parents=True, exist_ok=True)
    old = out.read_text(encoding='utf-8') if out.exists() else ''
    # 덮개(apply_content_theme)가 넣은 조각은 그대로 두고 비교: 원본이 같으면 파일을 건드리지 않음
    import re
    strip = lambda t: re.sub(r'<!--hj-c(?:theme|icons)-->.*?<!--/hj-c(?:theme|icons)-->', '', t, flags=re.S)
    if strip(old) == s: return False
    out.write_text(s, encoding='utf-8'); return True

if __name__ == '__main__':
    n = sum(build(g) for g in GRADES)
    print(f'종이접기 {n}개 페이지 다시 만듦')
