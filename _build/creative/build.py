#!/usr/bin/env python3
"""기타 › 창의수학게임 페이지 만들기 (2026-10-07)

    python3 _build/creative/build.py          # project/creative/<게임>.html. 먼저 문제 점검(gen_*.py check)을 돌립니다.
    python3 _build/creative/build.py check    # 점검만

게임마다 쉬움·보통·도전 세 단계(학년으로 나누지 않고 추천 학년을 적음), 단계마다 문제 20개.
문제는 gen_<게임>.py가 data/<게임>.json으로 만들고(같은 씨앗이면 언제나 같은 문제), 모든 문제가 '답이 하나뿐'인지 점검합니다.
화면: 공통 틀 page.html + page.css + shell.js, 게임마다 games/<게임>.js·games/<게임>.css. 아래쪽 '만든 사람'·홈 단추 조각은 _build/origami/의 것을 같이 씁니다.
목록 project/creative/index.html은 메뉴 페이지(손으로 고치고 apply_theme.py).
고친 뒤 루트에서 python3 _build/theme/apply_content_theme.py (자동 보완 run_all.py에도 들어 있음). 여러 번 실행해도 안전합니다.
"""
import re, sys, json, pathlib, subprocess
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
OG = ROOT / '_build' / 'origami'
sys.dont_write_bytecode = True

GAMES = [
  dict(id='magic', title='마방진', ico='✳️', acc='#C2571A',
       desc='가로·세로·대각선의 합이 모두 같아지도록 빈칸에 수를 넣는 마방진 퍼즐',
       intro='가로, 세로, 대각선에 있는 수를 더하면 모두 같은 수가 되는 신기한 네모, 마방진! 남은 수 카드를 빈칸에 알맞게 넣어 마방진을 완성해 보세요.',
       how='<ul><li>아래 <b>수 카드</b>를 하나 고르고 <b>빈칸</b>을 누르면 들어가요. 빈칸을 먼저 눌러도 돼요.</li>'
           '<li>넣은 수를 다시 누르면 카드로 돌아가요.</li>'
           '<li>오른쪽·아래의 작은 수는 그 줄의 합이에요(↘·↙는 대각선). 줄이 다 차면 <b style="color:var(--ok)">초록</b>(맞음)이나 <b style="color:var(--bad)">빨강</b>(다시 생각)으로 바뀌어요.</li>'
           '<li>💡 실마리: 3×3 마방진은 가운데 수가 아주 중요해요. 가운데를 지나는 줄이 4개나 되거든요!</li></ul>',
       levels=[dict(id='easy', nm='쉬움', rec='2~3학년', de='1~9로 만드는 3×3 마방진(합 15). 몇 칸은 미리 채워져 있어요.'),
               dict(id='normal', nm='보통', rec='3~4학년', de='2~10, 홀수, 10·20…90처럼 다른 수 묶음으로 만드는 3×3 마방진.'),
               dict(id='hard', nm='도전', rec='5~6학년', de='1~16으로 만드는 4×4 마방진(합 34). 줄이 10개나 돼요!')]),
]

def check():
    ok = True
    for g in GAMES:
        r = subprocess.run([sys.executable, str(HERE / f"gen_{g['id']}.py"), 'check'], capture_output=True, text=True)
        print((r.stdout + r.stderr).strip()[-2000:]); ok = ok and r.returncode == 0
    return ok

def build(g):
    rd = lambda p: p.read_text(encoding='utf-8')
    gnav = ''.join(f'<a href="{x["id"]}.html"' + (' aria-current="page"' if x is g else '') + f'>{x["title"]}</a>' for x in GAMES)
    data = json.dumps(dict(game=g['id'], levels=g['levels'], data=json.loads(rd(HERE / 'data' / f"{g['id']}.json"))), ensure_ascii=False, separators=(',', ':'))
    css = rd(HERE / 'page.css').replace('{ACC}', g['acc']).replace('{GAMECSS}', rd(HERE / 'games' / f"{g['id']}.css"))
    rep = {'TITLE': g['title'], 'DESC': g['desc'], 'ICO': g['ico'], 'INTRO': g['intro'], 'HOW': g['how'], 'GNAV': gnav, 'DATA': data,
           'CSS': css, 'HEADSNIP': rd(OG / 'head_snip.html'),
           'FOOT': rd(OG / 'foot.html').replace('쉬는 시간에 친구와 함께 즐기는 종이접기 자료입니다.', '생각하는 힘을 기르는 창의수학게임 자료입니다.'),
           'GAME': rd(HERE / 'games' / f"{g['id']}.js"), 'SHELL': rd(HERE / 'shell.js'),
           'HOMEFRAG': rd(OG / 'home.html').replace('{HOME}', '../../index.html')}
    s = re.sub(r'\{([A-Z]+)\}', lambda m: rep.get(m.group(1), m.group(0)), rd(HERE / 'page.html'))   # 한 번에 바꿈(넣은 내용 속 {…}는 건드리지 않음)
    out = ROOT / 'project' / 'creative' / f"{g['id']}.html"
    out.parent.mkdir(parents=True, exist_ok=True)
    old = out.read_text(encoding='utf-8') if out.exists() else ''
    strip = lambda t: re.sub(r'<!--hj-c(?:theme|icons)-->.*?<!--/hj-c(?:theme|icons)-->', '', t, flags=re.S)
    if strip(old) == s: return False
    out.write_text(s, encoding='utf-8'); return True

if __name__ == '__main__':
    if not check(): sys.exit('창의수학게임 점검 실패')
    if sys.argv[1:] == ['check']: sys.exit(0)
    n = sum(build(g) for g in GAMES)
    print(f'창의수학게임 {n}개 페이지 다시 만듦 (모두 {len(GAMES)}개)')
