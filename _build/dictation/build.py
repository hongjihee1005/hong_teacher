#!/usr/bin/env python3
"""공통 › 받아쓰기·맞춤법 급수 페이지 만들기 (2026-10-05)

    python3 _build/dictation/build.py          # common/dictation/g1.html … g6.html (먼저 자료를 점검)
    python3 _build/dictation/build.py check    # 자료 점검만

자료: data/gN.txt — '# 낱말' · '# 어절' · '# 문장' 아래 50줄씩, 한 줄에 '바른 글|맞춤법 포인트|틀리기 쉬운 꼴'.
학년마다 15급(10개씩): 1~5급 낱말, 6~10급 어절, 11~15급 문장(파일의 차례 그대로).
화면은 page.html + page.css + app.js. 아래쪽 '만든 사람'·홈 단추 조각은 _build/origami/의 것을 같이 씁니다.
목록 common/dictation/index.html은 메뉴 페이지(손으로 고치고 apply_theme.py).
고친 뒤 루트에서 python3 _build/theme/apply_content_theme.py (자동 보완 run_all.py에도 들어 있음).
"""
import re, sys, json, pathlib
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
OG = ROOT / '_build' / 'origami'
KINDS = ['낱말', '어절', '문장']
INTRO = {
    1: "모음(ㅐ·ㅔ·ㅚ·ㅟ…)과 받침, 소리 나는 대로 쓰지 않는 말, 겹받침 기초, 문장 부호를 익혀요.",
    2: "겹받침, 소리와 다르게 쓰는 말(같이·굳이…), 헷갈리는 말(낫다·낮다·낳다…), 흉내 내는 말과 기본 띄어쓰기를 익혀요.",
    3: "사이시옷(나뭇잎·햇볕…), '-이/-히', 되/돼, 안/않, 맞히다/맞추다, 높임말과 따옴표를 익혀요.",
    4: "반드시/반듯이, 가르치다/가리키다, 로서/로써, 던지/든지, 의존 명사·단위 띄어쓰기를 익혀요.",
    5: "두음 법칙, 율/률·열/렬, 일일이·번번이, -ㄹ게, 결재/결제, 보조 용언 띄어쓰기를 익혀요.",
    6: "외래어 표기, 헷갈리는 말 심화(이따가/있다가, 지그시/지긋이…), 띄어쓰기 심화와 문장 호응을 익혀요.",
}

def load(g):
    sec, out, bad = None, {k: [] for k in KINDS}, []
    for n, line in enumerate((HERE / 'data' / f'g{g}.txt').read_text(encoding='utf-8').splitlines(), 1):
        s = line.strip()
        if not s: continue
        if s.startswith('#'):
            k = s[1:].strip()
            if k in KINDS: sec = k
            continue
        if sec is None: bad.append(f'g{g}:{n} 구역 밖'); continue
        p = s.split('|')
        if len(p) != 3: bad.append(f'g{g}:{n} | 개수'); continue
        out[sec].append([x.strip() for x in p])
    return out, bad

def check(g, d):
    bad = []
    seen = set()
    for k in KINDS:
        L = d[k]
        if len(L) != 50: bad.append(f'{g}학년 {k} {len(L)}개(50개여야 함)')
        for t, p, w in L:
            if not t or not p: bad.append(f'{g}학년 {k} 빈 칸: {t}')
            if t in seen: bad.append(f'{g}학년 겹침: {t}')
            seen.add(t)
            if w and w == t: bad.append(f'{g}학년 틀린 꼴이 바른 글과 같음: {t}')
            if '  ' in t or t != t.strip(): bad.append(f'{g}학년 공백 이상: {t}')
            if k == '낱말' and ' ' in t: bad.append(f'{g}학년 낱말에 띄어쓰기: {t}')
            if k == '어절' and (' ' not in t or re.search(r'[.?!]$', t)): bad.append(f'{g}학년 어절 모양: {t}')
            if k == '문장' and not re.search(r'[.?!]$', t): bad.append(f'{g}학년 문장 부호 없음: {t}')
            if re.search(r'[A-Za-z|]', t): bad.append(f'{g}학년 이상한 글자: {t}')
            if p.count("'") % 2: bad.append(f'{g}학년 따옴표 짝: {p}')
    return bad

def build(g, d):
    rd = lambda p: p.read_text(encoding='utf-8')
    nav = ''.join(f'<a href="g{i}.html"' + (' aria-current="page"' if i == g else '') + f'>{i}학년</a>' for i in range(1, 7))
    data = json.dumps({'g': g, 'name': f'{g}학년', 'items': [d[k] for k in KINDS]}, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
    rep = {'NAME': f'{g}학년', 'INTRO': INTRO[g] + ' 낱말 50 · 어절 50 · 문장 50개를 10개씩 15급으로 나누었어요.', 'GRNAV': nav,
           'CSS': rd(HERE / 'page.css'), 'HEADSNIP': rd(OG / 'head_snip.html'),
           'FOOT': rd(OG / 'foot.html').replace('쉬는 시간에 친구와 함께 즐기는 종이접기 자료입니다.', '학년별 받아쓰기·맞춤법 급수 자료입니다.'),
           'DATA': data, 'APP': rd(HERE / 'app.js'), 'HOMEFRAG': rd(OG / 'home.html').replace('{HOME}', '../../index.html')}
    s = re.sub(r'\{([A-Z]+)\}', lambda m: rep.get(m.group(1), m.group(0)), rd(HERE / 'page.html'))
    out = ROOT / 'common' / 'dictation' / f'g{g}.html'
    out.parent.mkdir(parents=True, exist_ok=True)
    old = out.read_text(encoding='utf-8') if out.exists() else ''
    strip = lambda t: re.sub(r'<!--hj-c(?:theme|icons)-->.*?<!--/hj-c(?:theme|icons)-->', '', t, flags=re.S)
    if strip(old) == s: return False
    out.write_text(s, encoding='utf-8'); return True

if __name__ == '__main__':
    allbad, D = [], {}
    for g in range(1, 7):
        d, b = load(g); D[g] = d; allbad += b + check(g, d)
    if allbad: print('\n'.join(allbad[:60])); sys.exit('받아쓰기 자료 점검 실패')
    print('받아쓰기 자료 점검 통과 — 6개 학년 × 150개')
    if sys.argv[1:] == ['check']: sys.exit(0)
    print(f'받아쓰기 {sum(build(g, D[g]) for g in range(1, 7))}개 페이지 다시 만듦')
