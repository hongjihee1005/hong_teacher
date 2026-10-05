#!/usr/bin/env python3
"""공통 › 받아쓰기·맞춤법 급수 페이지 만들기 (2026-10-05)

    python3 _build/dictation/build.py          # common/dictation/g1.html … g6.html (먼저 자료를 점검)
    python3 _build/dictation/build.py check    # 자료 점검만

자료: data/gN.txt — '# 낱말' · '# 어절' · '# 문장' 아래 100줄씩, '# 문장 부호' 아래 50줄, 한 줄에 '바른 글|맞춤법 포인트|틀리기 쉬운 꼴'.
낱말은 소리가 같은 다른 말이 있으면 넷째 칸에 불러 줄 때 덧붙이는 예문(예: 닫히다|…|다치다|문이 닫히다).
학년끼리 같은 글, 숫자가 든 글은 점검에서 걸러요.
학년마다 35급(10개씩): 1~10급 낱말, 11~20급 어절, 21~30급 문장, 31~35급 문장 부호(파일의 차례 그대로).
문장 부호 급은 화면에 부호를 뺀 글(strip)을 보여 주고 부호를 넣어 다시 쓰게 함 — 틀린 꼴은 부호만 달라야 함.
화면은 page.html + page.css + app.js. 아래쪽 '만든 사람'·홈 단추 조각은 _build/origami/의 것을 같이 씁니다.
목록 common/dictation/index.html은 메뉴 페이지(손으로 고치고 apply_theme.py).
고친 뒤 루트에서 python3 _build/theme/apply_content_theme.py (자동 보완 run_all.py에도 들어 있음).
"""
import re, sys, json, pathlib
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
OG = ROOT / '_build' / 'origami'
KINDS = ['낱말', '어절', '문장', '문장 부호']
COUNT = {'낱말': 100, '어절': 100, '문장': 100, '문장 부호': 50}
PUN = re.compile(r'[.,?!"\'\u201C\u201D\u2018\u2019\u2026:·()~]')
def strip(t):
    """문장 부호를 뺀 글(문장 부호 급에서 화면에 보여 줌) — app.js의 strip과 같게"""
    return re.sub(r' +', ' ', re.sub(r'[\u2026.,?!"\'\u201C\u201D\u2018\u2019:)]', '', re.sub(r'[·~(]', ' ', t))).strip()
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
        if len(p) not in (3, 4): bad.append(f'g{g}:{n} | 개수'); continue
        if len(p) == 4 and (sec != '낱말' or not p[3].strip()): bad.append(f'g{g}:{n} 예문은 낱말에만'); continue
        it = [x.strip() for x in p]
        # 문장 부호 규정에서 둘 다 허용하는 차이(느낌표·물음표 자리의 마침표, 따옴표 안 마침표)만 있는 틀린 꼴은 고르기 문제에서 뺌
        if it[0][-1:] in '!?' and it[2] == it[0][:-1] + '.': it[2] = ''   # 물음표 자리도 같음(물음의 정도가 약하면 마침표)
        if sec == '문장 부호' and it[0].endswith('.') and it[2] == it[0][:-1] + '?': it[2] = ''   # '-요'로 끝나는 말은 물음으로도 바른 글
        if it[2] and re.sub(r'\.(?=["\'])', '', it[2]) == re.sub(r'\.(?=["\'])', '', it[0]): it[2] = ''   # 따옴표 안 마침표는 써도 되고 안 써도 됨
        out[sec].append(it)
    return out, bad

def check(g, d):
    bad = []
    seen = set()
    for k in KINDS:
        L = d[k]
        if len(L) != COUNT[k]: bad.append(f'{g}학년 {k} {len(L)}개({COUNT[k]}개여야 함)')
        for t, p, w, *ex in L:
            if not t or not p: bad.append(f'{g}학년 {k} 빈 칸: {t}')
            if t in seen: bad.append(f'{g}학년 겹침: {t}')
            seen.add(t)
            if w and w == t: bad.append(f'{g}학년 틀린 꼴이 바른 글과 같음: {t}')
            if '  ' in t or t != t.strip(): bad.append(f'{g}학년 공백 이상: {t}')
            if k == '낱말' and ' ' in t: bad.append(f'{g}학년 낱말에 띄어쓰기: {t}')
            if k == '어절' and (' ' not in t or re.search(r'[.?!]$', t)): bad.append(f'{g}학년 어절 모양: {t}')
            if k == '문장' and not re.search(r'[.?!]$', t): bad.append(f'{g}학년 문장 부호 없음: {t}')
            if k == '문장 부호':
                if not re.search(r'[.?!]["\']?$', t): bad.append(f'{g}학년 문장 부호 문장 끝: {t}')
                if w and strip(w) != strip(t): bad.append(f'{g}학년 문장 부호: 틀린 꼴이 부호 말고 글자도 다름: {t} / {w}')
                if re.search(r'[\u201C\u201D\u2018\u2019]|\.\.\.', t + w): bad.append(f'{g}학년 곧은 따옴표·줄임표(……)만 쓰기: {t}')
                if re.search(r'[^가-힣ㄱ-ㅎㅏ-ㅣ \.,?!"\'…:·()~]', t): bad.append(f'{g}학년 쓸 수 없는 부호: {t}')
            if re.search(r'[A-Za-z|]', t): bad.append(f'{g}학년 이상한 글자: {t}')
            if p.count("'") % 2: bad.append(f'{g}학년 따옴표 짝: {p}')
    return bad

def cross(D):
    """학년끼리 같은 글이 없는지"""
    seen, bad = {}, []
    for g, d in D.items():
        for k in KINDS:
            for it in d[k]:
                if it[0] in seen and seen[it[0]] != g: bad.append(f'{seen[it[0]]}학년과 {g}학년에 같은 글: {it[0]}')
                seen.setdefault(it[0], g)
                if re.search(r'\d', it[0]): bad.append(f'{g}학년 숫자가 든 글(소리로 구별 안 됨): {it[0]}')
    return bad

def build(g, d):
    rd = lambda p: p.read_text(encoding='utf-8')
    nav = ''.join(f'<a href="g{i}.html"' + (' aria-current="page"' if i == g else '') + f'>{i}학년</a>' for i in range(1, 7))
    data = json.dumps({'g': g, 'name': f'{g}학년', 'kinds': KINDS, 'items': [d[k] for k in KINDS]}, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
    rep = {'NAME': f'{g}학년', 'INTRO': INTRO[g] + ' 낱말 100 · 어절 100 · 문장 100 · 문장 부호 50개를 10개씩 35급으로 나누었어요.', 'GRNAV': nav,
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
    allbad += cross(D)
    if allbad: print('\n'.join(allbad[:60])); sys.exit('받아쓰기 자료 점검 실패')
    print(f'받아쓰기 자료 점검 통과 — 6개 학년 × {sum(COUNT.values())}개')
    if sys.argv[1:] == ['check']: sys.exit(0)
    print(f'받아쓰기 {sum(build(g, D[g]) for g in range(1, 7))}개 페이지 다시 만듦')
