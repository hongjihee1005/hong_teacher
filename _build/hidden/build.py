#!/usr/bin/env python3
"""쉬는 시간 › 숨은 그림 찾기 학년 페이지 만들기 (2026-10-04)

    python3 _build/hidden/build.py        # break/hidden/g1.html ~ g6.html (+ node가 있으면 check.js로 540개 점검)

그림: hidden.js(생성기 — 숨길 물건 ICONS 35가지, 장면 SCENES 6가지·꾸밈 그림 C, 학년·단계별 90개 specs). 페이지 안에서 그림을 만들어 그립니다.
화면: page.html + page.css + app.js. 아래쪽 '만든 사람'·홈 단추 조각은 _build/origami/의 것을 같이 씁니다.
고친 뒤 루트에서 python3 _build/theme/apply_content_theme.py (자동 보완 run_all.py에도 들어 있음). 여러 번 실행해도 안전합니다.
"""
import re, sys, shutil, subprocess, pathlib
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
OG = ROOT / '_build' / 'origami'

GRADES = {
  1: dict(ico='🐣', acc='#D94F72', intro='바닷속·숲·마을·하늘·꽃밭·우주 그림 속에 숨은 물건을 찾아요. 쉬움 30 · 보통 30 · 도전 30개예요.'),
  2: dict(ico='🌱', acc='#3A8F3A', intro='물건이 배경 그림과 겹쳐 숨어 있어요. 눈을 크게 뜨고 찾아봐요.'),
  3: dict(ico='🚀', acc='#2F6FD6', intro='물건이 기울어져 숨기 시작해요. 찾을 물건도 늘어났어요.'),
  4: dict(ico='🌈', acc='#8150C8', intro='작아지고 빙글 돌아간 물건들을 찾아요.'),
  5: dict(ico='⭐', acc='#C9661A', intro='무늬 사이에 꼭꼭 숨은 물건이 많아요. 차근차근 살펴봐요.'),
  6: dict(ico='🎓', acc='#1C8C7A', intro='가장 작고 가장 잘 숨은 물건들이에요. 끝까지 도전해 봐요!'),
}

def build(g):
    G = GRADES[g]; rd = lambda p: p.read_text(encoding='utf-8')
    rep = {'{G}': str(g), '{ICO}': G['ico'], '{INTRO}': G['intro'], '{CSS}': rd(HERE / 'page.css').replace('{ACC}', G['acc']),
           '{HEADSNIP}': rd(OG / 'head_snip.html'), '{FOOT}': rd(OG / 'foot.html').replace('종이접기 자료', '놀이 자료'),
           '{HIDDEN}': rd(HERE / 'hidden.js').replace('if (typeof module !== \'undefined\') module.exports = HP;', ''), '{APP}': rd(HERE / 'app.js'),
           '{HOMEFRAG}': rd(OG / 'home.html').replace('{HOME}', '../../index.html')}
    s = rd(HERE / 'page.html')
    for k, v in rep.items(): s = s.replace(k, v)
    out = ROOT / 'break' / 'hidden' / f'g{g}.html'
    out.parent.mkdir(parents=True, exist_ok=True)
    old = out.read_text(encoding='utf-8') if out.exists() else ''
    strip = lambda t: re.sub(r'<!--hj-c(?:theme|icons)-->.*?<!--/hj-c(?:theme|icons)-->', '', t, flags=re.S)
    if strip(old) == s: return False
    out.write_text(s, encoding='utf-8'); return True

if __name__ == '__main__':
    if shutil.which('node'):
        r = subprocess.run(['node', str(HERE / 'check.js')], capture_output=True, text=True)
        if r.returncode: print(r.stdout[-1500:]); sys.exit('숨은 그림 점검 실패')
    print(f'숨은 그림 찾기 {sum(build(g) for g in GRADES)}개 페이지 다시 만듦')
