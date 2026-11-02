#!/usr/bin/env python3
"""기타 › 수학게임 › 코딩(거북이 코딩 수학) 페이지 만들기 (2026-10-07)

    python3 _build/coding/build.py          # project/coding/missions.html · free.html
    python3 _build/coding/build.py check    # 점검만

미션 missions.py(풀이 sol을 화면에서 그대로 실행해 목표 그림을 그림), 화면 coding.js·coding.css, 틀 page.html(수학 교구실 page.css·shell.js를 같이 씀).
메뉴 project/coding/index.html은 손으로 고치는 메뉴(apply_theme.py). 고친 뒤 루트에서 python3 _build/theme/apply_content_theme.py.
"""
import re, sys, json, math, pathlib
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
OG = ROOT / '_build' / 'origami'
MT = ROOT / '_build' / 'mathtools'
OUT = ROOT / 'project' / 'coding'
sys.path.insert(0, str(HERE))
from missions import MISSIONS

R = lambda n, *b: [['rep', n], *[list(x) for x in b], ['end']]
EXAMPLES = [
 dict(name='⭐ 별', prog=[['col', 2]] + R(5, ('fd', 150), ('rt', 144))),
 dict(name='🌸 꽃', prog=[['col', 6]] + R(12, *R(6, ('fd', 40), ('rt', 60)), ('rt', 30))),
 dict(name='🌀 소용돌이 네모', prog=[['col', 4], ['fd', 10], ['rt', 90], ['fd', 20], ['rt', 90], ['fd', 30], ['rt', 90], ['fd', 40], ['rt', 90], ['fd', 50], ['rt', 90], ['fd', 60], ['rt', 90], ['fd', 70], ['rt', 90], ['fd', 80], ['rt', 90], ['fd', 90], ['rt', 90], ['fd', 100], ['rt', 90], ['fd', 110], ['rt', 90], ['fd', 120]]),
 dict(name='☀️ 해', prog=[['col', 1]] + R(18, ('fd', 120), ('bk', 120), ('rt', 20))),
 dict(name='🔷 다각형 탑', prog=[['col', 3]] + R(3, ('fd', 60), ('rt', 120)) + R(4, ('fd', 60), ('rt', 90)) + R(5, ('fd', 60), ('rt', 72)) + R(6, ('fd', 60), ('rt', 60))),
]
PAGES = [
 dict(id='missions', title='거북이 미션', ico='🐢', acc='#2E9E5B', mode='mission', rec='추천 3~6학년 · 각도, 정다각형, 규칙과 반복(알고리즘)',
      desc='블록으로 거북이에게 명령을 내려 점선 그림을 똑같이 그려요. 미션 18개, 반복을 잘 쓰면 별 셋!',
      how=['블록을 누르면 내 프로그램에 들어가요(줄을 고르고 누르면 그 아래에 들어감). 수는 칸을 눌러 바꿔요. ▲▼로 차례를 바꾸고 ✕로 지워요.',
           '▶ 실행으로 거북이가 그리고, 점선 그림과 같으면 성공! ‘한 줄씩’은 움직임을 하나씩 보여 줘요.',
           '거북이는 처음에 위쪽을 봐요(미션에 따라 처음 방향이 다르면 적혀 있어요). ‘오른쪽으로 돌기’는 시계 방향이에요.',
           '같은 그림을 더 적은 블록으로 만들면 별이 늘어요(★★★ 기준 블록 수가 프로그램 위에 있어요). 별은 이 기기에만 저장돼요.',
           '🖨️ 미션 활동지: 미션 그림과 명령을 쓰는 줄(한 쪽 4개, 모두 5쪽) — 컴퓨터 없이 먼저 써 보고 실행해 봐요.'],
      ideas=['정다각형에서 거북이가 도는 각(360 ÷ 변의 수)과 도형의 한 각을 비교해 보기.', '짝 코딩: 한 명은 명령을 말하고 한 명은 블록을 넣기.', '별(144°)처럼 두 바퀴를 도는 도형 찾아보기.']),
 dict(id='free', title='자유 그리기', ico='🎨', acc='#2B6FB8', mode='free', rec='모든 학년 · 반복과 각으로 무늬 만들기',
      desc='블록으로 마음대로 그림을 그려요. 색을 바꾸고, 반복 안에 반복을 넣어 멋진 무늬를 만들어요.',
      how=['예시를 불러와 수를 바꿔 보면서 시작해요.', '🎨 색 블록 뒤의 선은 그 색으로 그려져요. ✋ 펜 들기로 선 없이 움직여요.', '💾 그림 저장은 PNG 파일로 내려받아요.'],
      ideas=['반복 수와 도는 각을 바꾸면 무늬가 어떻게 달라지는지 표로 정리하기.', '우리 반 무늬 전시회.']),
]

def check():
    bad = []
    for i, m in enumerate(MISSIONS):
        depth = 0
        for b in m['sol']:
            if b[0] == 'rep': depth += 1
            if b[0] == 'end': depth -= 1
            if depth < 0: bad.append(f'미션 {i+1}: 반복 짝')
        if depth: bad.append(f'미션 {i+1}: 반복 짝')
        if not m['rep'] and any(b[0] == 'rep' for b in m['sol']): bad.append(f'미션 {i+1}: 반복을 못 쓰는데 풀이에 반복')
        if not m['pen'] and any(b[0] in ('pu', 'pd') for b in m['sol']): bad.append(f'미션 {i+1}: 펜 블록을 못 쓰는데 풀이에 펜')
    return bad

def build(t):
    rd = lambda f: f.read_text(encoding='utf-8')
    gnav = ''.join(f'<a href="{x["id"]}.html"' + (' aria-current="page"' if x is t else '') + f'>{x["title"]}</a>' for x in PAGES)
    data = {'id': t['id'], 'mode': t['mode']}
    if t['mode'] == 'mission': data['missions'] = MISSIONS
    else: data['examples'] = EXAMPLES
    rep = {'TITLE': t['title'], 'DESC': t['desc'], 'ICO': t['ico'], 'REC': t['rec'], 'GNAV': gnav,
           'HOW': '<ul>' + ''.join(f'<li>{x}</li>' for x in t['how']) + '</ul>', 'IDEAS': ''.join(f'<li>{x}</li>' for x in t['ideas']),
           'EXTRA': '<p class="tl-row"><button type="button" class="tl-btn" id="ttPrint">🖨️ 미션 활동지 인쇄</button></p>' if t['mode'] == 'mission' else '',
           'DATA': json.dumps(data, ensure_ascii=False).replace('</', '<\\/'), 'TOOL': rd(HERE / 'coding.js'), 'SHELL': rd(MT / 'shell.js'),
           'CSS': rd(MT / 'page.css').replace('{ACC}', t['acc']).replace('{TOOLCSS}', rd(HERE / 'coding.css')), 'HEADSNIP': rd(OG / 'head_snip.html'),
           'FOOT': rd(OG / 'foot.html').replace('쉬는 시간에 친구와 함께 즐기는 종이접기 자료입니다.', '블록 코딩으로 수학을 탐구하는 자료입니다.'),
           'HOMEFRAG': rd(OG / 'home.html').replace('{HOME}', '../../index.html')}
    s = re.sub(r'\{([A-Z]+)\}', lambda m: rep.get(m.group(1), m.group(0)), rd(HERE / 'page.html'))
    out = OUT / f"{t['id']}.html"; out.parent.mkdir(parents=True, exist_ok=True)
    old = out.read_text(encoding='utf-8') if out.exists() else ''
    strip = lambda x: re.sub(r'<!--hj-c(?:theme|icons)-->.*?<!--/hj-c(?:theme|icons)-->', '', x, flags=re.S)
    if strip(old) == s: return False
    out.write_text(s, encoding='utf-8'); return True

if __name__ == '__main__':
    bad = check()
    if bad: sys.exit('코딩 점검 실패:\n' + '\n'.join(bad))
    print(f'코딩 점검 통과 (미션 {len(MISSIONS)}개)')
    if sys.argv[1:] == ['check']: sys.exit(0)
    n = sum(build(t) for t in PAGES)
    print(f'코딩 {n}쪽 다시 만듦 (모두 {len(PAGES)}쪽)')
