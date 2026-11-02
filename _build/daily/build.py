#!/usr/bin/env python3
"""기타 › 수학게임 › 일일수학 페이지 만들기 (2026-10-07)

    python3 _build/daily/build.py     # project/daily/g1.html ~ g6.html

기초연산(_build/arith/)의 문제 생성기 skills.js(daily(학년, 날짜)), 화면 app.js(dailyPage)·page.css·page.html, 본문 daily.html을 그대로 씁니다.
메뉴 project/daily/index.html은 손으로 고치는 메뉴(apply_theme.py). 고친 뒤 루트에서 python3 _build/theme/apply_content_theme.py.
"""
import re, sys, json, pathlib, subprocess
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
AR = ROOT / '_build' / 'arith'
OG = ROOT / '_build' / 'origami'
OUT = ROOT / 'project' / 'daily'

def page(g):
    rd = lambda p: p.read_text(encoding='utf-8')
    intro = f'{g}학년 계산 10문제가 날마다 새로 나와요. 같은 날이면 우리 반 모두 같은 문제예요. 화면에서 풀고 채점하거나, 오늘·이번 주 학습지를 인쇄해요.'
    rep = {'TITLE': f'{g}학년 일일수학', 'ICO': '📅', 'INTRO': intro, 'DESC': f'초등 {g}학년 일일수학: 날마다 계산 10문제, 채점·도장 달력·학습지 인쇄', 'MAIN': rd(AR / 'daily.html'),
           'CSS': rd(AR / 'page.css').replace('{ACC}', '#D9731A'), 'HEADSNIP': rd(OG / 'head_snip.html'),
           'FOOT': rd(OG / 'foot.html').replace('쉬는 시간에 친구와 함께 즐기는 종이접기 자료입니다.', '날마다 계산 10문제를 푸는 일일수학 자료입니다.'),
           'SKILLS': rd(AR / 'skills.js'), 'PAGE': json.dumps({'daily': g}), 'APP': rd(AR / 'app.js'),
           'HOMEFRAG': rd(OG / 'home.html').replace('{HOME}', '../../index.html')}
    s = re.sub(r'\{([A-Z]+)\}', lambda m: rep.get(m.group(1), m.group(0)), rd(AR / 'page.html'))
    s = s.replace(' · 기초연산 · 공통 · 초등교사 홍지희', ' · 일일수학 · 수학게임 · 기타 · 초등교사 홍지희').replace('aria-label="기초연산 영역"', 'aria-label="학년 고르기"')
    out = OUT / f'g{g}.html'; out.parent.mkdir(parents=True, exist_ok=True)
    old = out.read_text(encoding='utf-8') if out.exists() else ''
    strip = lambda t: re.sub(r'<!--hj-c(?:theme|icons)-->.*?<!--/hj-c(?:theme|icons)-->', '', t, flags=re.S)
    if strip(old) == s: return False
    out.write_text(s, encoding='utf-8'); return True

if __name__ == '__main__':
    r = subprocess.run(['node', str(AR / 'check.js')], capture_output=True, text=True)
    if r.returncode: print((r.stdout + r.stderr)[-2000:]); sys.exit('일일수학(기초연산) 문제 점검 실패')
    n = sum(page(g) for g in range(1, 7))
    print(f'일일수학 {n}쪽 다시 만듦 (모두 6쪽)')
