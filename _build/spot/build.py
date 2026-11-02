#!/usr/bin/env python3
"""쉬는 시간 › 틀린 그림 찾기 학년 페이지 만들기 (2026-10-04)

    python3 _build/spot/build.py        # break/spot/g1.html ~ g6.html (+ node가 있으면 check.js로 540개 점검)

그림: spot.js(생성기 — 색칠된 사물 OBJ 50가지, 새로 생기는 작은 그림 EXTRA, 장면 THEMES 8가지, 학년·단계별 90개 specs). 페이지 안에서 두 그림을 만들어 그립니다.
화면: page.html + page.css + app.js. 아래쪽 '만든 사람'·홈 단추 조각은 _build/origami/의 것을 같이 씁니다.
고친 뒤 루트에서 python3 _build/theme/apply_content_theme.py (자동 보완 run_all.py에도 들어 있음). 여러 번 실행해도 안전합니다.
"""
import re, sys, shutil, subprocess, pathlib
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
OG = ROOT / '_build' / 'origami'

GRADES = {
  1: dict(ico='🐣', acc='#D94F72', intro='봄·여름·가을·겨울, 식물, 동물, 가전제품 그림 두 장에서 다른 곳을 찾아요. 쉬움 30 · 보통 30 · 도전 30개예요.'),
  2: dict(ico='🌱', acc='#3A8F3A', intro='색이 바뀌거나 사라진 것을 찾아봐요. 보통부터는 크기·자리도 달라져요.'),
  3: dict(ico='🚀', acc='#2F6FD6', intro='다른 곳이 조금 더 많아졌어요. 그림을 나누어 차근차근 비교해 봐요.'),
  4: dict(ico='🌈', acc='#8150C8', intro='작은 그림이 많아지고 한 부분만 없어진 곳도 있어요.'),
  5: dict(ico='⭐', acc='#C9661A', intro='방향이 반대로 바뀐 그림까지 찾아야 해요. 꼼꼼히 비교해 봐요.'),
  6: dict(ico='🎓', acc='#1C8C7A', intro='가장 많고 가장 작은 차이들이에요. 끝까지 도전해 봐요!'),
}

def build(g):
    G = GRADES[g]; rd = lambda p: p.read_text(encoding='utf-8')
    rep = {'{G}': str(g), '{ICO}': G['ico'], '{INTRO}': G['intro'], '{CSS}': rd(HERE / 'page.css').replace('{ACC}', G['acc']),
           '{HEADSNIP}': rd(OG / 'head_snip.html'), '{FOOT}': rd(OG / 'foot.html').replace('종이접기 자료', '놀이 자료'),
           '{SPOT}': rd(HERE / 'spot.js').replace('if (typeof module !== \'undefined\') module.exports = SD;', ''), '{APP}': rd(HERE / 'app.js'),
           '{HOMEFRAG}': rd(OG / 'home.html').replace('{HOME}', '../../index.html')}
    s = rd(HERE / 'page.html')
    for k, v in rep.items(): s = s.replace(k, v)
    out = ROOT / 'break' / 'spot' / f'g{g}.html'
    out.parent.mkdir(parents=True, exist_ok=True)
    old = out.read_text(encoding='utf-8') if out.exists() else ''
    strip = lambda t: re.sub(r'<!--hj-c(?:theme|icons)-->.*?<!--/hj-c(?:theme|icons)-->', '', t, flags=re.S)
    if strip(old) == s: return False
    out.write_text(s, encoding='utf-8'); return True

if __name__ == '__main__':
    if shutil.which('node'):
        r = subprocess.run(['node', str(HERE / 'check.js')], capture_output=True, text=True)
        if r.returncode: print(r.stdout[-1500:]); sys.exit('틀린 그림 점검 실패')
    print(f'틀린 그림 찾기 {sum(build(g) for g in GRADES)}개 페이지 다시 만듦')
