#!/usr/bin/env python3
"""사회 홍지희 버전(sem1-hong·sem2-hong) 사고전략 칸별 예시 넣기 (2026-10-03)

사회 홍지희 버전은 빌드 원본이 저장소에 없어서(HTML이 원본) 이 스크립트가 HTML을 직접 고칩니다.
  python3 apply.py skel sem1 1 > ex_sem1_u1.py   -> 빈 틀(예시가 필요한 단계·칸, 차시 질문과 안내를 주석으로)
  python3 apply.py check                    -> ex_sem*_u*.py 검사(HTML은 안 고침)
  python3 apply.py                          -> 예시를 넣음(여러 번 실행해도 안전)
  그다음 저장소 루트에서 python3 _build/theme/apply_content_theme.py grade3/social/sem1-hong/u*.html grade3/social/sem2-hong/u*.html

- 화면 기능은 과학과 같은 grade3/science/_build_hong2/engine_ex.js·ex.css를 그대로 넣습니다(표시 hj-ex).
- 예시 원본: ex_sem1_u1.py … ex_sem2_u2.py 의 EX[lessonKey][단계 이름 t] = [[첫 칸 2개], [둘째 칸 2개], …]
  → 수업 데이터 C의 그 단계에 hints로 들어갑니다. 빈 칸(["", ""])만 있는 단계는 건너뜁니다.
"""
import re, sys, os, glob, json, importlib
HERE = os.path.dirname(os.path.abspath(__file__))
SOC = os.path.dirname(HERE)
H2 = os.path.join(SOC, '..', 'science', '_build_hong2')
sys.path.insert(0, HERE)
ROOMS = {'sem1': 'sem1-hong', 'sem2': 'sem2-hong'}
COLS = {  # 쓰는 칸(화면 순서). 고르기만 하는 단계(sort·cards·task·talk·check)는 넣지 않음
    'see': ['보여요', '생각해요', '궁금해요'], 'define': ['뜻 문장 빈칸'],
    'csq': ['내 생각', '근거', '친구에게 묻기'], 'iuti': ['예전 생각', '지금 생각'],
    'venn': ['A만', '같은 점', 'B만'], 'cse': ['이어지는 것', '더 찾은 것', '아직 궁금한 것'],
    'pred': ['내 예상', '그렇게 생각한 까닭'], 'pvr': ['실제 결과', '예상과 같은 점·다른 점', '왜 그럴까?']}
CRE = re.compile(r'const C=(\{.*?\});\n', re.S)


def loadC(s):
    return json.loads(CRE.search(s).group(1).replace('<\\/', '</'))


def dumpC(C):
    return json.dumps(C, ensure_ascii=False).replace('</', '<\\/').replace('⁣', '\\u2063')


def files(room):
    return sorted(glob.glob(os.path.join(SOC, ROOMS[room], 'u*.html')))


def skel(room, unit=None):
    print(f"# 사회 {ROOMS[room]} {unit or ''}단원 사고전략 칸별 예시. 칸마다 2개, 차시의 핵심 질문과 이어지게. (apply.py skel {room} {unit or ''} 로 만든 틀)")
    print('EX = {')
    for p in files(room):
        if unit and not os.path.basename(p).startswith(f'u{unit}-'): continue
        C = loadC(open(p, encoding='utf-8').read())
        steps = [s for s in C['steps'] if s['k'] in COLS]
        if not steps: continue
        print(f" {C['lessonKey']!r}: {{  # {C['title']}")
        for s in steps:
            cols = COLS[s['k']]
            if s['k'] == 'venn': cols = [s.get('a', 'A') + '만', '같은 점', s.get('b', 'B') + '만']
            print(f"  # [{s['k']}] {s.get('hd', '')} | 안내: {s.get('ask', '')}")
            if s.get('frame'): print(f"  #   문장 틀: {s['frame'][0]} ___ {s['frame'][1]} | 낱말: {', '.join(s.get('words', []))}")
            if s.get('f'): print(f"  #   칸 틀: {' / '.join(s['f'])}")
            if s.get('cards'): print('  #   자료: ' + ' / '.join(f"{i + 1}.{c.get('t', '')}" for i, c in enumerate(s['cards'])))
            print(f"  {s['t']!r}: [")
            for c in cols: print(f'   # {c}\n   ["", ""],')
            print('  ],')
        print(' },')
    print('}')


def ex_of(room):  # ex_sem1.py 또는 단원별 ex_sem1_u1.py … 를 합침
    fs = sorted(glob.glob(os.path.join(HERE, f'ex_{room}.py')) + glob.glob(os.path.join(HERE, f'ex_{room}_u*.py')))
    if not fs: return None
    EX = {}
    for f in fs: EX.update(importlib.import_module(os.path.basename(f)[:-3]).EX)
    return EX


def check(room, EX):
    bad = 0
    for p in files(room):
        C = loadC(open(p, encoding='utf-8').read()); D = EX.get(C['lessonKey'], {})
        ts = [s['t'] for s in C['steps']]
        for t, v in D.items():
            hit = [s for s in C['steps'] if s['t'] == t]
            if len(hit) != 1: print(C['lessonKey'], t, '단계 이름이 없거나 겹침'); bad += 1; continue
            s = hit[0]
            if s['k'] not in COLS: print(C['lessonKey'], t, '예시를 넣지 않는 단계', s['k']); bad += 1; continue
            if all(x == '' for c in v for x in c): print(C['lessonKey'], t, '아직 비어 있음'); bad += 1; continue
            if len(v) != len(COLS[s['k']]) or any(len(c) != 2 or not all(x.strip() for x in c) for c in v):
                print(C['lessonKey'], t, '칸마다 예시 2개가 아님'); bad += 1
        for s in C['steps']:
            if s['k'] in COLS and s['t'] not in D: print(C['lessonKey'], s['t'], '빠짐'); bad += 1
    return bad


def inject(p, D):
    s = open(p, encoding='utf-8').read()
    C = loadC(s)
    for st in C['steps']:
        st.pop('hints', None)
        v = D.get(st['t'])
        if v and not all(x == '' for c in v for x in c): st['hints'] = v
    m = CRE.search(s)
    s = s[:m.start(1)] + dumpC(C) + s[m.end(1):]
    # 화면 기능: 수업 데이터가 든 <script>의 끝(render 다음)에 engine_ex.js, </head> 앞에 ex.css
    js = '/*hj-ex*/' + open(os.path.join(H2, 'engine_ex.js'), encoding='utf-8').read() + '/*/hj-ex*/'
    css = '<style id="hj-ex">' + open(os.path.join(H2, 'ex.css'), encoding='utf-8').read() + '</style>'
    s = re.sub(r'/\*hj-ex\*/.*?/\*/hj-ex\*/', '', s, flags=re.S)
    s = re.sub(r'<style id="hj-ex">.*?</style>', '', s, flags=re.S)
    k = s.index('</script>', CRE.search(s).end())
    s = s[:k] + js + s[k:]
    s = s.replace('</head>', css + '</head>', 1)
    open(p, 'w', encoding='utf-8').write(s)
    return sum(1 for st in C['steps'] if st.get('hints'))


if __name__ == '__main__':
    a = sys.argv[1:]
    if a[:1] == ['skel']: skel(a[1], a[2] if len(a) > 2 else None); sys.exit()
    if a[:1] == ['check']:
        for r in ROOMS:
            EX = ex_of(r)
            if EX is not None: print(r, '문제', check(r, EX))
        sys.exit()
    n = 0
    for r in ROOMS:
        EX = ex_of(r)
        if EX is None: continue
        for p in files(r): n += inject(p, EX.get(loadC(open(p, encoding='utf-8').read())['lessonKey'], {}))
        print('넣음', ROOMS[r])
    print('예시를 넣은 단계', n)
