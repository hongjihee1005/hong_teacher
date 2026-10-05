#!/usr/bin/env python3
"""공통 › 속담·관용어·사자성어 페이지 만들기 (2026-10-05)

    python3 _build/words/build.py          # common/words/proverb.html · idiom.html · saja.html (먼저 자료 점검)
    python3 _build/words/build.py check    # 자료 점검만

자료(쉬운 것부터, 10줄씩 1~15급):
  data/proverb.txt  속담    `앞부분/뒷부분|뜻|예문|비슷한 속담`
  data/idiom.txt    관용어  `앞부분/뒷부분|뜻|예문|반대·비슷한 관용어`
  data/saja.txt     사자성어 `한글|한자|뜻|예문|글자 풀이(훈음·훈음·…)`
'/'는 짝 맞추기에서 앞뒤를 나누는 자리(띄어쓰기 자리). 사자성어는 두 글자씩 나눔.
사자성어 한자는 _build/hanja/data/hanja.csv(한국어문회 배정한자)에 있으면 급을 붙이고 한자 급수 페이지로 이어 줌.
화면은 page.html + page.css + app.js. 아래쪽 '만든 사람'·홈 단추 조각은 _build/origami/의 것을 같이 씁니다.
목록 common/words/index.html은 메뉴 페이지(손으로 고치고 apply_theme.py).
고친 뒤 루트에서 python3 _build/theme/apply_content_theme.py (자동 보완 run_all.py에도 들어 있음).
"""
import re, sys, csv, json, pathlib
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
OG = ROOT / '_build' / 'origami'
N = 150
AREAS = [  # (id, 파일, 이름, 아이콘, 색, 소개)
    ('proverb', 'proverb.html', '속담', '💬', '#C0503A', '옛날부터 전해 오는, 삶의 지혜가 담긴 짧은 말이에요. 150개를 쉬운 것부터 10개씩 15급으로 나누었어요.'),
    ('idiom', 'idiom.html', '관용어', '👥', '#2F74E0', '낱말 뜻을 그대로 더한 것과 다른, 새로운 뜻으로 굳어진 말이에요(예: 발이 넓다). 150개를 쉬운 것부터 10개씩 15급으로 나누었어요.'),
    ('saja', 'saja.html', '사자성어', '📚', '#1C8C7A', '한자 네 글자로 이루어진 말이에요. 글자마다 훈음과 한자 급수가 나오고, 누르면 그 급의 한자 익히기로 가요. 150개를 10개씩 15급으로 나누었어요.'),
]
CREDIT = '뜻은 국립국어원 「표준국어대사전」 뜻풀이를 어린이 말로 쉽게 다듬은 것이에요. 예문은 이 자료를 위해 새로 지었어요.'
HZ_FONT = '<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@500&family=Noto+Serif+JP:wght@500&family=Noto+Serif+TC:wght@500&display=swap" rel="stylesheet">'

def hanja_levels():
    m = {}
    with open(ROOT / '_build/hanja/data/hanja.csv', encoding='utf-8') as f:
        for r in csv.DictReader(f): m.setdefault(r['hanja'], r['level'])
    return m

def lv_file(lv):   # '7급Ⅱ' → lv7-2.html
    n = re.match(r'(\d)급', lv)
    return f"lv{n.group(1)}{'-2' if 'Ⅱ' in lv else ''}.html" if n else ''

def load(area):
    rows, bad = [], []
    for n, line in enumerate((HERE / 'data' / f'{area}.txt').read_text(encoding='utf-8').splitlines(), 1):
        s = line.strip()
        if not s or s.startswith('#'): continue
        p = [x.strip() for x in s.split('|')]
        want = 5 if area == 'saja' else 4
        if len(p) != want: bad.append(f'{area}:{n} 칸 수 {len(p)}(→{want})'); continue
        rows.append(p)
    return rows, bad

def items(area, rows, HL):
    out = []
    for p in rows:
        if area == 'saja':
            t, h, m, e, c = p
            parts = [x.strip() for x in c.split('·')]
            cs = []
            for k, ch in enumerate(h):
                lv = HL.get(ch, '')
                cs.append([ch, parts[k] if k < len(parts) else '', lv, lv_file(lv)])
            out.append({'t': t, 'h': h, 'a': t[:2], 'b': t[2:], 'm': m, 'e': e, 'c': cs})
        else:
            raw, m, e, r = p
            a, b = raw.split('/', 1)
            out.append({'t': a.strip() + ' ' + b.strip(), 'a': a.strip(), 'b': b.strip(), 'm': m, 'e': e, 'r': r})
    return out

def check(area, rows, its):
    bad = []
    if len(rows) != N: bad.append(f'{area} {len(rows)}개({N}개여야 함)')
    seen = set()
    for p, it in zip(rows, its):
        t = it['t']
        if t in seen: bad.append(f'{area} 겹침: {t}')
        seen.add(t)
        if re.search(r'\d', '|'.join(p)): bad.append(f'{area} 숫자: {t}')
        if not re.search(r'[.?!]$', it['e']): bad.append(f'{area} 예문 끝 부호: {t}')
        if not it['m']: bad.append(f'{area} 뜻 없음: {t}')
        if area == 'saja':
            if len(t) != 4 or not re.fullmatch(r'[가-힣]{4}', t): bad.append(f'{area} 한글 네 글자 아님: {t}')
            if len(it['h']) != 4 or re.search(r'[가-힣A-Za-z]', it['h']): bad.append(f'{area} 한자 네 글자 아님: {it["h"]}')
            if len(p[4].split('·')) != 4: bad.append(f'{area} 글자 풀이 네 개 아님: {t}')
            for (ch, hm, *_), hg in zip(it['c'], t):
                if hm and not hm.endswith(hg): bad.append(f'{area} 글자 풀이 음이 한글과 다름: {t} {ch} {hm}')
            if t not in it['e']: bad.append(f'{area} 예문에 말이 없음: {t}')
        else:
            if p[0].count('/') != 1: bad.append(f'{area} "/"가 한 개가 아님: {p[0]}')
            if area == 'proverb' and t not in it['e']: bad.append(f'{area} 예문에 속담이 그대로 없음: {t}')
            if area == 'idiom' and it['a'] not in it['e']: bad.append(f'{area} 예문에 첫 낱말이 없음: {t}')
    return bad

def build(area, its):
    _, fname, name, ico, acc, intro = next(a for a in AREAS if a[0] == area)
    rd = lambda p: p.read_text(encoding='utf-8')
    nav = ''.join(f'<a href="{f}"' + (' aria-current="page"' if k == area else '') + f'>{i} {n}</a>' for k, f, n, i, *_ in AREAS)
    data = json.dumps({'area': area, 'name': name, 'items': its}, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
    rep = {'NAME': name, 'ICO': ico, 'INTRO': intro, 'NAV': nav, 'CREDIT': CREDIT + (' 한자 훈음·급수는 한국어문회 배정한자 기준이에요.' if area == 'saja' else ''),
           'FONT': HZ_FONT if area == 'saja' else '', 'CSS': rd(HERE / 'page.css').replace('{ACC}', acc), 'HEADSNIP': rd(OG / 'head_snip.html'),
           'FOOT': rd(OG / 'foot.html').replace('쉬는 시간에 친구와 함께 즐기는 종이접기 자료입니다.', '초등학생이 알아 두면 좋은 속담·관용어·사자성어 자료입니다.'),
           'DATA': data, 'APP': rd(HERE / 'app.js'), 'HOMEFRAG': rd(OG / 'home.html').replace('{HOME}', '../../index.html')}
    s = re.sub(r'\{([A-Z]+)\}', lambda m: rep.get(m.group(1), m.group(0)), rd(HERE / 'page.html'))
    out = ROOT / 'common' / 'words' / fname
    out.parent.mkdir(parents=True, exist_ok=True)
    old = out.read_text(encoding='utf-8') if out.exists() else ''
    strip = lambda t: re.sub(r'<!--hj-c(?:theme|icons)-->.*?<!--/hj-c(?:theme|icons)-->', '', t, flags=re.S)
    if strip(old) == s: return False
    out.write_text(s, encoding='utf-8'); return True

if __name__ == '__main__':
    HL, allbad, D = hanja_levels(), [], {}
    for area, *_ in AREAS:
        rows, b = load(area); its = items(area, rows, HL); D[area] = its
        allbad += b + check(area, rows, its)
    if allbad: print('\n'.join(allbad[:60])); sys.exit('속담·관용어·사자성어 자료 점검 실패')
    print(f'속담·관용어·사자성어 자료 점검 통과 — {len(AREAS)}개 영역 × {N}개')
    if sys.argv[1:] == ['check']: sys.exit(0)
    print(f'속담·관용어·사자성어 {sum(build(a, D[a]) for a, *_ in AREAS)}개 페이지 다시 만듦')
