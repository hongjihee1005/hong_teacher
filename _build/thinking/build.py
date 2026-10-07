#!/usr/bin/env python3
"""기타 › 수학게임 › 사고력 수학 페이지 만들기 (2026-10-07)

    python3 _build/thinking/build.py          # project/thinking/<영역>.html 7쪽. 먼저 점검합니다.
    python3 _build/thinking/build.py check    # 점검만

문제 원본은 areas.py(영역 7가지 × 쉬움·보통·도전 × 5문제), 그림은 figs.py, 빈칸 셈 풀이기는 blanks.py.
화면 틀은 창의수학게임의 page.html·page.css·shell.js를 같이 쓰고(단계 탭·문제 번호·힌트·처음부터·정답 보기·기록),
문제 화면은 think.js·think.css. 메뉴 project/thinking/index.html은 손으로 고치는 메뉴 페이지(apply_theme.py).
점검: 단계마다 5문제, 생각 열쇠 3개, 풀이 있음, chk가 있는 문제는 계산한 답 = 적어 둔 답(빈칸 셈은 답이 하나뿐인지도).
"""
import re, sys, json, pathlib
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]; CR = ROOT / '_build' / 'creative'; OG = ROOT / '_build' / 'origami'
sys.dont_write_bytecode = True; sys.path.insert(0, str(HERE))
from areas import AREAS

LV = [('easy', '쉬움', '2~3학년'), ('normal', '보통', '3~4학년'), ('hard', '도전', '5~6학년')]
DE = {'easy': '차근차근 생각하면 풀 수 있는 문제 5개.', 'normal': '조건을 하나씩 따져야 하는 문제 5개.', 'hard': '오래 생각해야 하는 도전 문제 5개.'}

def want(a):
    return a['v'] if a['t'] in ('num', 'pick') else tuple(x['v'] for x in a['f'])

def check():
    bad, n = [], 0
    for A in AREAS:
        for lv, _, _ in LV:
            qs = [q for q in A['qs'] if q['lv'] == lv]
            if len(qs) != 5: bad.append(f"{A['id']} {lv}: 문제 {len(qs)}개(5개여야 함)")
        for i, q in enumerate(A['qs'], 1):
            n += 1; tag = f"{A['id']} {i}"
            if len(q['k']) != 3: bad.append(f'{tag}: 생각 열쇠가 3개가 아님')
            if not q['s']: bad.append(f'{tag}: 풀이 없음')
            if q['a']['t'] == 'pick' and q['a']['v'] not in q['a']['o']: bad.append(f'{tag}: 정답이 보기에 없음')
            if q['chk']:
                try:
                    got = q['chk']()
                except AssertionError as e:
                    bad.append(f'{tag}: 답이 하나뿐이 아니거나 규칙이 맞지 않음 {e}'); continue
                except Exception as e:
                    bad.append(f'{tag}: 확인 코드 오류 {e!r}'); continue
                if isinstance(got, list): got = tuple(got)
                if got != want(q['a']): bad.append(f"{tag}: 계산한 답 {got} ≠ 적은 답 {want(q['a'])}")
    print('\n'.join(bad) or f'사고력 수학 점검 통과: {n}문제 (계산으로 확인 {sum(1 for A in AREAS for q in A["qs"] if q["chk"])}문제)')
    return not bad

def build(A):
    rd = lambda p: p.read_text(encoding='utf-8')
    gnav = ''.join(f'<a href="{x["id"]}.html"' + (' aria-current="page"' if x is A else '') + f'>{x["title"]}</a>' for x in AREAS)
    data = {'game': 'think-' + A['id'], 'levels': [{'id': i, 'nm': nm, 'rec': r, 'de': DE[i]} for i, nm, r in LV],
            'data': {i: [{k: q[k] for k in ('q', 'a', 'k', 's', 'fig', 'tag')} for q in A['qs'] if q['lv'] == i] for i, _, _ in LV}}
    how = ('<ul><li>문제를 읽고 답을 써서 <b>확인</b>을 눌러요(고르는 문제는 답을 누르면 돼요).</li>'
           '<li>막히면 <b>💡 힌트</b>를 누를 때마다 <b>🔑 생각 열쇠</b>가 하나씩 열려요(모두 3개). 열쇠는 답이 아니라 생각할 길을 알려 줘요.</li>'
           '<li>맞히면 <b>📝 풀이</b>가 나와요. 내 방법과 견주어 보고, 풀이에 붙은 <b>전략 이름</b>(거꾸로 풀기, 표 만들기 …)을 기억해 두세요.</li>'
           '<li>🖨️ 이 단계 5문제를 학습지로 인쇄하거나, 정답과 풀이를 인쇄할 수 있어요.</li></ul>')
    css = rd(CR / 'page.css').replace('{ACC}', A['acc']).replace('{GAMECSS}', rd(HERE / 'think.css'))
    rep = {'TITLE': A['title'], 'DESC': '사고력 수학 ' + A['title'] + ' — 쉬움·보통·도전 15문제, 생각 열쇠와 풀이', 'ICO': A['ico'], 'INTRO': A['intro'], 'HOW': how, 'GNAV': gnav,
           'DATA': json.dumps(data, ensure_ascii=False, separators=(',', ':')), 'CSS': css, 'HEADSNIP': rd(OG / 'head_snip.html'),
           'FOOT': rd(OG / 'foot.html').replace('쉬는 시간에 친구와 함께 즐기는 종이접기 자료입니다.', '한 문제를 오래 생각하며 사고력을 기르는 사고력 수학 자료입니다.'),
           'GAME': rd(HERE / 'think.js'), 'SHELL': rd(CR / 'shell.js'), 'HOMEFRAG': rd(OG / 'home.html').replace('{HOME}', '../../index.html')}
    page = rd(CR / 'page.html').replace(' · 창의수학게임 · 기타 · ', ' · 사고력 수학 · 기타 · ').replace('aria-label="다른 창의수학게임"', 'aria-label="다른 영역"')
    s = re.sub(r'\{([A-Z]+)\}', lambda m: rep.get(m.group(1), m.group(0)), page)
    out = ROOT / 'project' / 'thinking' / f"{A['id']}.html"; out.parent.mkdir(parents=True, exist_ok=True)
    old = out.read_text(encoding='utf-8') if out.exists() else ''
    strip = lambda t: re.sub(r'<!--hj-c(?:theme|icons)-->.*?<!--/hj-c(?:theme|icons)-->', '', t, flags=re.S)
    if strip(old) == s: return False
    out.write_text(s, encoding='utf-8'); return True

if __name__ == '__main__':
    if not check(): sys.exit('사고력 수학 점검 실패')
    if sys.argv[1:] == ['check']: sys.exit(0)
    n = sum(build(A) for A in AREAS)
    print(f'사고력 수학 {n}쪽 다시 만듦 (모두 {len(AREAS)}쪽)')
