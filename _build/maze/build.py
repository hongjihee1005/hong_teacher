#!/usr/bin/env python3
"""쉬는 시간 › 미로찾기 학년 페이지 만들기 (2026-10-04)

    python3 _build/maze/build.py        # break/maze/g1.html ~ g6.html (+ node가 있으면 check.js로 540개 점검)

미로: maze.js(생성기 — 학년 설정 GR, 조건 RULES, 모양 MASKS, 학년별 300개 specs). 페이지 안에서 미로를 만들어 그립니다.
화면: page.html + page.css + app.js. 아래쪽 '만든 사람'·홈 단추 조각은 _build/origami/의 것을 같이 씁니다.
고친 뒤 루트에서 python3 _build/theme/apply_content_theme.py (자동 보완 run_all.py에도 들어 있음). 여러 번 실행해도 안전합니다.
"""
import re, sys, shutil, subprocess, pathlib
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
OG = ROOT / '_build' / 'origami'

GRADES = {
  1: dict(ico='🐣', acc='#D94F72', intro='작은 네모 미로부터 하트·별 모양 미로, 짝수·과일·동물만 따라가는 조건 미로까지 300개예요.'),
  2: dict(ico='🌱', acc='#3A8F3A', intro='조금 더 큰 미로와 뛰어 세기·덧셈 조건 미로가 기다려요.'),
  3: dict(ico='🚀', acc='#2F6FD6', intro='원형 미로와 벌집 미로, 곱셈구구 순서 미로에 도전해요.'),
  4: dict(ico='🌈', acc='#8150C8', intro='큰 수·소수·배수 조건 미로와 여러 모양의 큰 미로예요.'),
  5: dict(ico='⭐', acc='#C9661A', intro='약수·배수·크기가 같은 분수를 찾아가는 미로와 아주 큰 미로예요.'),
  6: dict(ico='🎓', acc='#1C8C7A', intro='소수(素數)·비·비율 조건 미로와 가장 복잡한 미로에 도전해요.'),
}

def build(g):
    G = GRADES[g]; rd = lambda p: p.read_text(encoding='utf-8')
    rep = {'{G}': str(g), '{ICO}': G['ico'], '{INTRO}': G['intro'], '{CSS}': rd(HERE / 'page.css').replace('{ACC}', G['acc']),
           '{HEADSNIP}': rd(OG / 'head_snip.html'), '{FOOT}': rd(OG / 'foot.html').replace('종이접기 자료', '놀이 자료'),
           '{MAZE}': rd(HERE / 'maze.js').replace('if (typeof module !== \'undefined\') module.exports = MZ;', ''), '{APP}': rd(HERE / 'app.js'),
           '{HOMEFRAG}': rd(OG / 'home.html').replace('{HOME}', '../../index.html')}
    s = rd(HERE / 'page.html')
    for k, v in rep.items(): s = s.replace(k, v)
    out = ROOT / 'break' / 'maze' / f'g{g}.html'
    out.parent.mkdir(parents=True, exist_ok=True)
    old = out.read_text(encoding='utf-8') if out.exists() else ''
    strip = lambda t: re.sub(r'<!--hj-c(?:theme|icons)-->.*?<!--/hj-c(?:theme|icons)-->', '', t, flags=re.S)
    if strip(old) == s: return False
    out.write_text(s, encoding='utf-8'); return True

if __name__ == '__main__':
    if shutil.which('node'):
        r = subprocess.run(['node', str(HERE / 'check.js')], capture_output=True, text=True)
        if r.returncode: print(r.stdout[-1500:]); sys.exit('미로 점검 실패')
    print(f'미로찾기 {sum(build(g) for g in GRADES)}개 페이지 다시 만듦')
