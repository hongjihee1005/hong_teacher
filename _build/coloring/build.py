#!/usr/bin/env python3
"""쉬는 시간 › 컬러링 학년 페이지 만들기 (2026-10-04)

    python3 _build/coloring/build.py        # break/coloring/g1.html ~ g6.html

도안: specs.py(학년별 90개 설정 — 화면에서 칸 수 순서로 쉬움·보통·도전 30개씩) → designs.js(설정으로 그림을 그리는 생성기, 페이지 안에서 그림)
화면: page.html + page.css + app.js. 아래쪽 '만든 사람'·홈 단추 조각은 _build/origami/의 것을 같이 씁니다.
고친 뒤 루트에서 python3 _build/theme/apply_content_theme.py (자동 보완 run_all.py에도 들어 있음). 여러 번 실행해도 안전합니다.
"""
import json, re, sys, pathlib
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
OG = ROOT / '_build' / 'origami'
sys.dont_write_bytecode = True
sys.path.insert(0, str(HERE))
import specs

GRADES = {
  1: dict(ico='🐣', acc='#D94F72', sw=3, intro='큼직한 칸으로 된 쉬운 그림이에요. 좋아하는 색으로 칠해 봐요.'),
  2: dict(ico='🌱', acc='#3A8F3A', sw=2.6, intro='그림 속에 작은 무늬가 생겼어요. 칸마다 다른 색을 골라 봐요.'),
  3: dict(ico='🚀', acc='#2F6FD6', sw=1.8, intro='반복 무늬와 쉬운 만다라예요. 같은 모양끼리 같은 색으로 칠하면 멋진 무늬가 나와요.'),
  4: dict(ico='🌈', acc='#8150C8', sw=1.6, intro='무늬가 촘촘해진 도안과 만다라예요. 색 두세 가지를 번갈아 써 봐요.'),
  5: dict(ico='⭐', acc='#C9661A', sw=1.3, intro='여러 겹으로 된 만다라예요. 가운데부터 바깥으로 차근차근 칠해 봐요.'),
  6: dict(ico='🎓', acc='#1C8C7A', sw=1.1, intro='칸이 아주 많은 정교한 만다라예요. 마음을 차분히 하고 천천히 완성해 봐요.'),
}

def build(g):
    G = GRADES[g]; rd = lambda p: p.read_text(encoding='utf-8')
    data = json.dumps(dict(g=g, sw=G['sw'], s=specs.grade(g)), ensure_ascii=False, separators=(',', ':'))
    rep = {'{G}': str(g), '{ICO}': G['ico'], '{INTRO}': G['intro'], '{CSS}': rd(HERE / 'page.css').replace('{ACC}', G['acc']),
           '{HEADSNIP}': rd(OG / 'head_snip.html'), '{FOOT}': rd(OG / 'foot.html').replace('종이접기 자료', '놀이 자료'),
           '{DESIGNS}': rd(HERE / 'designs.js'), '{APP}': rd(HERE / 'app.js'), '{HOMEFRAG}': rd(OG / 'home.html').replace('{HOME}', '../../index.html')}
    s = rd(HERE / 'page.html')
    for k, v in rep.items(): s = s.replace(k, v)
    s = s.replace('{DATA}', data)
    out = ROOT / 'break' / 'coloring' / f'g{g}.html'
    out.parent.mkdir(parents=True, exist_ok=True)
    old = out.read_text(encoding='utf-8') if out.exists() else ''
    strip = lambda t: re.sub(r'<!--hj-c(?:theme|icons)-->.*?<!--/hj-c(?:theme|icons)-->', '', t, flags=re.S)
    if strip(old) == s: return False
    out.write_text(s, encoding='utf-8'); return True

if __name__ == '__main__':
    print(f'컬러링 {sum(build(g) for g in GRADES)}개 페이지 다시 만듦')
