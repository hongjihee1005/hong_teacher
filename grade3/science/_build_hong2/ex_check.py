#!/usr/bin/env python3
"""사고전략 칸별 예시 점검: python3 ex_check.py 2   (2단원)
- 예시를 넣을 단계와 칸 이름을 보여 주고, examples_uN.py가 있으면 빠진 것·칸 수·문장 수를 검사합니다."""
import sys, importlib, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
COLS = {  # 쓰는 칸(화면 순서). 고르기만 하는 단계(lab·design·board·check·talk·task·cards·sort)는 넣지 않음
    'see': ['보여요', '생각해요', '궁금해요'], 'pgrid': ['그렇게 예상한 까닭'],
    'gcmp': ['예상과 달랐던 칸, 왜 그랬을까?', '모둠마다 결과가 달랐던 칸, 왜 그랬을까?'],
    'claim': ['근거', '결론'], 'pred': ['내 예상', '그렇게 생각한 까닭'],
    'pvr': ['실제 결과', '예상과 같은 점·다른 점', '왜 그럴까?'], 'csq': ['내 생각', '근거', '친구에게 묻기'],
    'iuti': ['예전 생각', '지금 생각'], 'venn': ['A만', '같은 점', 'B만'], 'cse': ['이어지는 것', '더 찾은 것', '아직 궁금한 것']}
u = sys.argv[1]
M = importlib.import_module('lessons_u' + u)
EX = importlib.import_module('examples_u' + u).EX if os.path.exists(f'examples_u{u}.py') else None
bad = 0
for L in M.LESSONS:
    ts = [s['t'] for s in L['steps']]
    for s in L['steps']:
        if s['k'] not in COLS: continue
        cols = COLS[s['k']]
        dup = ts.count(s['t']) > 1
        if EX is None:
            print(L['lessonKey'], '|', s['t'], '|', s['k'], '|', ' / '.join(cols), '| ⚠️ 단계 이름 겹침' if dup else ''); continue
        v = EX.get(L['lessonKey'], {}).get(s['t'])
        if v is None: print('빠짐', L['lessonKey'], s['t']); bad += 1
        elif len(v) != len(cols) or any(len(c) != 2 for c in v): print('칸·문장 수', L['lessonKey'], s['t'], [len(c) for c in v], '필요', len(cols)); bad += 1
    if EX is not None:
        for t in EX.get(L['lessonKey'], {}):
            if t not in ts: print('없는 단계 이름', L['lessonKey'], t); bad += 1
if EX is not None: print('문제', bad)
