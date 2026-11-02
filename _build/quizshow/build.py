#!/usr/bin/env python3
"""기타 › 수학게임 › 수학 퀴즈쇼 페이지 만들기 (2026-10-07)

    python3 _build/quizshow/build.py          # project/quizshow/<판>.html
    python3 _build/quizshow/build.py check    # 점검만

판 자료 boards.py(분야 5 × 100~500점, 값이 있는 문제는 chk로 다시 계산), 화면 quiz.js·quiz.css, 틀 page.html(수학 교구실 page.css·shell.js를 같이 씀).
메뉴 project/quizshow/index.html은 손으로 고치는 메뉴(apply_theme.py). 고친 뒤 루트에서 python3 _build/theme/apply_content_theme.py.
"""
import re, sys, json, pathlib
from fractions import Fraction
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
OG = ROOT / '_build' / 'origami'
MT = ROOT / '_build' / 'mathtools'
OUT = ROOT / 'project' / 'quizshow'
sys.path.insert(0, str(HERE))
from boards import BOARDS

MY = dict(id='my', title='우리 반 퀴즈 만들기', ico='✏️', acc='#1C8C7A', rec='모든 학년 · 선생님이 분야와 문제를 직접 써요',
          desc='빈 판에 분야 이름과 문제·답을 직접 써서 우리 반만의 퀴즈쇼를 열어요. 쓴 문제는 이 기기에 저장돼요.',
          cats=[(f'분야 {i + 1}', [dict(q='', a='') for _ in range(5)]) for i in range(5)])
ALL = BOARDS + [MY]
HOW = ['준비 화면에서 모둠 수(2~6)와 이름, ‘틀리면 점수 빼기’·‘🎁 행운 칸’·생각할 시간을 정하고 ‘퀴즈쇼 시작’.',
       '점수판에서 분야와 점수 칸을 누르면 문제가 크게 떠요(⛶ 크게 보기로 전자칠판 가득). ‘시간 재기’ → ‘정답 보기’ → 맞힌 모둠을 누르고 ‘점수 주고 판으로’.',
       '모둠마다 화이트보드에 답을 쓰게 하면 여러 모둠이 한꺼번에 맞힐 수 있어요. 점수 칸의 −100/+100으로 따로 고치고, ‘마지막 점수 되돌리기’로 실수를 되돌려요.',
       '✏️ 문제 바꾸기로 문제와 답을 고칠 수 있어요(이 기기에 저장). 🖨️ 문제와 정답(선생님용)·모둠 답판(모둠마다 A4 한 장)을 인쇄할 수 있어요.',
       '진행 중인 점수는 이 기기에 저장돼서 페이지를 닫았다 열어도 이어져요.']
IDEAS = ['단원을 마치고 복습 시간에 모둠 대항으로.', '학생들이 ‘우리 반 퀴즈 만들기’ 판에 들어갈 문제를 직접 만들어 내기.', '행운 칸이 어디인지 모르니 끝까지 역전할 수 있어요.']

def check():
    bad = []
    for b in BOARDS:
        if len(b['cats']) != 5: bad.append(f"{b['id']}: 분야 {len(b['cats'])}개")
        for n, qs in b['cats']:
            if len(qs) != 5: bad.append(f"{b['id']} {n}: 문제 {len(qs)}개")
            for j, q in enumerate(qs):
                where = f"{b['id']} {n} {(j + 1) * 100}점"
                if not q['q'].strip() or not q['a'].strip(): bad.append(where + ': 빈 칸')
                if q['chk'] is not None:
                    got = q['chk']()
                    if isinstance(q['v'], (int, Fraction)) and not isinstance(got, str): ok = Fraction(got) == Fraction(q['v'])
                    else: ok = got == q['v']
                    if not ok: bad.append(f'{where}: 계산 {got} ≠ {q["v"]}')
                    v = q['v']; txt = (f'{v.numerator}/{v.denominator}' if isinstance(v, Fraction) and v.denominator != 1 else str(v)) if not isinstance(v, str) else v
                    if txt not in q['a'].replace(',', ''): bad.append(f'{where}: 답 글 "{q["a"]}"에 {txt} 없음')
    return bad

def build(t):
    rd = lambda f: f.read_text(encoding='utf-8')
    gnav = ''.join(f'<a href="{x["id"]}.html"' + (' aria-current="page"' if x is t else '') + f'>{x["title"]}</a>' for x in ALL)
    board = {'id': t['id'], 'title': t['title'], 'cats': [{'n': n, 'qs': [{'q': q['q'], 'a': q['a']} for q in qs]} for n, qs in t['cats']]}
    rep = {'TITLE': t['title'], 'DESC': t['desc'], 'ICO': t['ico'], 'REC': t['rec'], 'GNAV': gnav,
           'HOW': '<ul>' + ''.join(f'<li>{x}</li>' for x in HOW) + '</ul>', 'IDEAS': ''.join(f'<li>{x}</li>' for x in IDEAS),
           'DATA': json.dumps({'id': t['id'], 'board': board}, ensure_ascii=False).replace('</', '<\\/'), 'TOOL': rd(HERE / 'quiz.js'), 'SHELL': rd(MT / 'shell.js'),
           'CSS': rd(MT / 'page.css').replace('{ACC}', t['acc']).replace('{TOOLCSS}', rd(HERE / 'quiz.css')), 'HEADSNIP': rd(OG / 'head_snip.html'),
           'FOOT': rd(OG / 'foot.html').replace('쉬는 시간에 친구와 함께 즐기는 종이접기 자료입니다.', '선생님이 진행하는 모둠 대항 수학 퀴즈 자료입니다.'),
           'HOMEFRAG': rd(OG / 'home.html').replace('{HOME}', '../../index.html')}
    s = re.sub(r'\{([A-Z]+)\}', lambda m: rep.get(m.group(1), m.group(0)), rd(HERE / 'page.html'))
    out = OUT / f"{t['id']}.html"; out.parent.mkdir(parents=True, exist_ok=True)
    old = out.read_text(encoding='utf-8') if out.exists() else ''
    strip = lambda x: re.sub(r'<!--hj-c(?:theme|icons)-->.*?<!--/hj-c(?:theme|icons)-->', '', x, flags=re.S)
    if strip(old) == s: return False
    out.write_text(s, encoding='utf-8'); return True

if __name__ == '__main__':
    bad = check()
    if bad: sys.exit('수학 퀴즈쇼 점검 실패:\n' + '\n'.join(bad))
    print(f'수학 퀴즈쇼 점검 통과 (판 {len(BOARDS)}개 · 문제 {sum(len(q) for b in BOARDS for _, q in b["cats"])}개)')
    if sys.argv[1:] == ['check']: sys.exit(0)
    n = sum(build(t) for t in ALL)
    print(f'수학 퀴즈쇼 {n}쪽 다시 만듦 (모두 {len(ALL)}판)')
