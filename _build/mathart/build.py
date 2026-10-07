#!/usr/bin/env python3
"""기타 › 수학게임 › 수학 미술 페이지 만들기 (2026-10-07)

    python3 _build/mathart/build.py          # project/mathart/<활동>.html

활동 목록 build.py의 TOOLS, 공통 art.js(색·굵기·되돌리기·저장·인쇄)·art.css, 활동마다 tools/<id>.js(window.TOOL). 틀은 page.html(수학 교구실 page.css·shell.js를 같이 씀).
메뉴 project/mathart/index.html은 손으로 고치는 메뉴(apply_theme.py). 고친 뒤 루트에서 python3 _build/theme/apply_content_theme.py.
"""
import re, sys, json, pathlib
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
OG = ROOT / '_build' / 'origami'
MT = ROOT / '_build' / 'mathtools'
OUT = ROOT / 'project' / 'mathart'
TOOLS = [
 dict(id='mirror', title='대칭 그림', ico='🦋', acc='#3B6FD6', rec='추천 3~6학년 · 선대칭도형(5학년), 평면도형의 이동', desc='한쪽에 그리면 대칭축에 비친 모양이 저절로 그려지는 만화경 그림이에요.',
      how=['좌우 대칭(축 1개) · 좌우·상하(축 2개) · 만화경(축 4개, 8조각) 중에서 골라요.', '색과 굵기를 고르고 끌어서 그려요. 되돌리기·처음부터·그림 저장(PNG)·인쇄.'],
      ideas=['나비·얼굴처럼 좌우 대칭인 것을 그리고 대칭축 찾기.', '만화경으로 그린 그림을 접어 보며 정말 겹치는지 이야기하기.']),
 dict(id='mandala', title='각도 만다라', ico='🌸', acc='#C2479A', rec='추천 4~6학년 · 각도(360°), 회전 대칭·점대칭', desc='원을 n조각으로 나눠 한 조각에 그리면 360° ÷ n씩 돌아가며 만다라가 그려져요.',
      how=['조각 수(2~16)를 고르면 한 조각의 각도(360° ÷ n)가 나와요.', '‘거울도 함께’를 켜면 조각 안에서 좌우로도 비쳐요.', '그림 저장·인쇄로 작품을 남겨요.'],
      ideas=['6조각과 8조각 만다라를 그리고 한 조각의 각도를 계산해 보기.', '2조각(180°)이 점대칭이 되는 까닭 이야기하기.']),
 dict(id='tile', title='무늬 만들기(테셀레이션)', ico='🧩', acc='#2B8C9E', rec='추천 4~6학년 · 평면도형의 이동(밀기·뒤집기·돌리기), 규칙', desc='타일 한 칸에 그리면 밀기·뒤집기·돌리기로 판 전체가 빈틈없이 무늬로 채워져요.',
      how=['왼쪽 작은 칸에 그려요. 가장자리에 걸쳐 그리면 반대쪽에서 이어져 무늬가 연결돼요.', '밀기·뒤집기·돌리기를 바꿔 같은 그림이 어떤 무늬가 되는지 견줘요.', '바탕색을 바꾸고 판 전체를 저장·인쇄해요.'],
      ideas=['같은 타일로 밀기·뒤집기·돌리기 세 무늬를 만들어 차이점 찾기.', '에셔(M. C. Escher)의 테셀레이션 작품 찾아보기.']),
 dict(id='string', title='실 그림·곱셈 원', ico='🧵', acc='#7B4FB0', rec='추천 3~6학년 · 각, 곱셈과 나머지, 규칙', desc='곧은 선분만 이어서 곡선을 만드는 실 그림과, 원 위의 점을 곱셈으로 이어 무늬를 만드는 곱셈 원이에요.',
      how=['<b>각 안에 실 걸기</b>: 점 수와 각도를 바꾸면 곡선 모양이 달라져요.', '<b>곱셈 원</b>: 점 수와 곱하는 수를 바꿔요. ×2는 하트 모양(카디오이드)!', '색을 바꾸고 저장·인쇄해요. 종이·실로 직접 만들어 보는 것도 좋아요.'],
      ideas=['모눈종이에 직접 점을 찍고 자로 이어 실 그림 그리기.', '곱셈 원에서 점 10개, ×2일 때 3 → 6, 7 → 4(14를 10으로 나눈 나머지)처럼 직접 이어 보기.']),
]

def build(t):
    rd = lambda f: f.read_text(encoding='utf-8')
    gnav = ''.join(f'<a href="{x["id"]}.html"' + (' aria-current="page"' if x is t else '') + f'>{x["title"]}</a>' for x in TOOLS)
    rep = {'TITLE': t['title'], 'DESC': t['desc'], 'ICO': t['ico'], 'REC': t['rec'], 'GNAV': gnav,
           'HOW': '<ul>' + ''.join(f'<li>{x}</li>' for x in t['how']) + '</ul>', 'IDEAS': ''.join(f'<li>{x}</li>' for x in t['ideas']),
           'DATA': json.dumps({'id': t['id']}), 'TOOL': rd(HERE / 'art.js') + rd(HERE / 'tools' / f"{t['id']}.js"), 'SHELL': rd(MT / 'shell.js'),
           'CSS': rd(MT / 'page.css').replace('{ACC}', t['acc']).replace('{TOOLCSS}', rd(HERE / 'art.css')), 'HEADSNIP': rd(OG / 'head_snip.html'),
           'FOOT': rd(OG / 'foot.html').replace('쉬는 시간에 친구와 함께 즐기는 종이접기 자료입니다.', '수학으로 그림을 그리는 수학 미술 자료입니다.'),
           'HOMEFRAG': rd(OG / 'home.html').replace('{HOME}', '../../index.html')}
    s = re.sub(r'\{([A-Z]+)\}', lambda m: rep.get(m.group(1), m.group(0)), rd(HERE / 'page.html'))
    out = OUT / f"{t['id']}.html"; out.parent.mkdir(parents=True, exist_ok=True)
    old = out.read_text(encoding='utf-8') if out.exists() else ''
    strip = lambda x: re.sub(r'<!--hj-c(?:theme|icons)-->.*?<!--/hj-c(?:theme|icons)-->', '', x, flags=re.S)
    if strip(old) == s: return False
    out.write_text(s, encoding='utf-8'); return True

if __name__ == '__main__':
    bad = [t['id'] for t in TOOLS if not (HERE / 'tools' / f"{t['id']}.js").exists()]
    if bad: sys.exit('수학 미술 점검 실패: ' + ', '.join(bad))
    print('수학 미술 점검 통과')
    if sys.argv[1:] == ['check']: sys.exit(0)
    n = sum(build(t) for t in TOOLS)
    print(f'수학 미술 {n}쪽 다시 만듦 (모두 {len(TOOLS)}가지)')
