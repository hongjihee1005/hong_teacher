#!/usr/bin/env python3
"""프로젝트 › 독서교육 추천도서 페이지 만들기 (2026-10-05)

    python3 _build/reading/build.py         # project/reading/g1~g6.html, s-*.html, orgs.html
    python3 _build/reading/build.py check   # 자료 점검만

자료: data/grades.json(학년별) · data/subjects.json(교과별) — 책마다 추천 기관 recs=[{org, detail, url}]
      orgs.py — 추천 기관 소개(이름은 recs의 org와 같아야 함)
같은 책이 여러 곳(학년별·교과별)에 있으면 추천 기관을 합쳐서 셉니다(어느 페이지에서나 같은 수).
차례: 추천 기관 수가 많은 책부터(같으면 교과서 수록 → 제목 가나다).
화면: page.html + page.css + app.js. 목록 project/reading/index.html은 메뉴 페이지(손으로 고치고 apply_theme.py).
고친 뒤 루트에서 python3 _build/theme/apply_content_theme.py (자동 보완 run_all.py에도 들어 있음).
"""
import re, sys, json, pathlib
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
OG = ROOT / '_build' / 'origami'
OUT = ROOT / 'project' / 'reading'
sys.path.insert(0, str(HERE))
from orgs import ORGS, ASOF

KINDS = {'그림책', '동화', '지식책', '시·동시', '옛이야기', '인물 이야기', '만화'}
SUBJ = {'국어', '수학', '사회', '과학', '도덕', '음악', '미술'}
BANDS = {'1-2', '3-4', '5-6'}
GRADES = json.loads((HERE / 'data' / 'grades.json').read_text(encoding='utf-8'))
SUBJECTS = json.loads((HERE / 'data' / 'subjects.json').read_text(encoding='utf-8'))
ORGN = {o['name']: o for o in ORGS}

PAGES = [  # (파일, 제목, 영역, 고르는 법, 설명, 앞 사이 칩)
    *[(f'g{g}.html', f'{g}학년 추천도서', '학년별', ('grade', g),
       f'{g}학년 어린이에게 여러 기관이 추천한 책이에요. 추천한 곳이 많은 책부터 놓았어요.', None) for g in range(1, 7)],
    ('s-korean.html', '국어 추천도서', '교과별', ('subj', '국어'), '국어 교과서에 실린 작품과, 읽기·쓰기·말하기 공부와 이어지는 책이에요.', None),
    ('s-math.html', '수학 추천도서', '교과별', ('subj', '수학'), '수와 셈, 도형, 규칙을 이야기로 만나는 수학 동화와 수학 지식책이에요.', None),
    ('s-social.html', '사회 추천도서', '교과별', ('subj', '사회'), '우리 고장, 지도, 경제, 민주주의, 역사, 세계 여러 나라와 이어지는 책이에요.', None),
    ('s-science.html', '과학 추천도서', '교과별', ('subj', '과학'), '생물, 우리 몸, 지구와 우주, 물질과 에너지, 환경과 이어지는 책이에요.', None),
]
# 도덕·음악·미술은 아직 출처를 확인한 책이 모자라 메뉴에 '준비 중'으로만 둠(2026-10-05). 책을 채우면 여기에 페이지를 더하세요:
#   ('s-moral.html', '도덕 추천도서', '교과별', ('subj', '도덕'), '…', None)
#   ('s-art.html', '음악·미술 추천도서', '교과별', ('subj', '음악', '미술'), '…', ['음악', '미술'])


def norm(t): return re.sub(r'[\s\W_]+', '', t)


def merged():
    """제목이 같은 책은 하나로 보고 추천 기관을 합침"""
    M = {}
    for src, L in (('g', GRADES), ('s', SUBJECTS)):
        for b in L:
            k = norm(b['title'])
            m = M.setdefault(k, {'recs': [], 'desc': '', 'awards': []})
            for r in b['recs']:
                if r['org'] not in [x['org'] for x in m['recs']]: m['recs'].append(r)
            if not m['desc'] and b.get('desc'): m['desc'] = b['desc']
            for a in b.get('awards', []):
                if a not in m['awards']: m['awards'].append(a)
    return M


def check():
    bad = 0
    def say(*a):
        nonlocal bad; bad += 1; print(*a)
    for name, L in (('학년별', GRADES), ('교과별', SUBJECTS)):
        seen = {}
        for b in L:
            t = b.get('title', '?')
            for k in ('title', 'author', 'publisher', 'kind', 'band', 'recs'):
                if not b.get(k): say(name, t, k, '비어 있음')
            if b.get('kind') not in KINDS: say(name, t, '갈래 이름', b.get('kind'))
            if b.get('band') not in BANDS: say(name, t, '학년 묶음', b.get('band'))
            g = b.get('grade')
            if name == '학년별' and (not isinstance(g, int) or not 1 <= g <= 6): say(name, t, '학년', g)
            if isinstance(g, int) and b.get('band') in BANDS and str(g) not in b['band'].split('-'): say(name, t, '학년이 묶음 밖', g, b['band'])
            if name == '교과별' and (not b.get('subjects') or not set(b['subjects']) <= SUBJ): say(name, t, '교과 이름', b.get('subjects'))
            orgs = [r.get('org') for r in b.get('recs', [])]
            if len(orgs) != len(set(orgs)): say(name, t, '추천 기관 겹침')
            for r in b.get('recs', []):
                if r.get('org') not in ORGN: say(name, t, '모르는 기관', r.get('org'))
                if not re.match(r'https?://', r.get('url', '')): say(name, t, '출처 주소', r.get('org'))
                if not r.get('detail'): say(name, t, '출처 설명 없음', r.get('org'))
            if len(b.get('desc', '')) > 90: say(name, t, '소개가 김', len(b['desc']))
            key = (norm(t), b.get('grade') if name == '학년별' else tuple(b.get('subjects', [])))
            if key in seen: say(name, t, '같은 페이지에 두 번')
            seen[key] = 1
    M = merged()
    for p in PAGES:
        n = len(pick(p, M))
        if n < 4: say(p[0], '책이 너무 적음', n)
    return bad


def kor_tb(b):
    """교과서 수록(국어)이 확인된 책 → 국어 페이지에 함께 싣고, 수록 정보를 '이어지는 공부'로"""
    for r in b['recs']:
        if r['org'] == '교과서 수록' and '국어' in r['detail']: return r['detail']
    return ''


def pick(p, M):
    how = p[3]; L = []; seen = set()
    def add(b, **over):
        k = norm(b['title'])
        if k in seen: return
        seen.add(k); L.append({**b, **over})
    if how[0] == 'grade':
        for b in GRADES:
            if b['grade'] == how[1]: add(b)
        gt = {norm(b['title']) for b in GRADES}   # 학년별 자료에 있는 책은 그 학년을 따름
        for b in SUBJECTS:
            if b.get('grade') == how[1] and norm(b['title']) not in gt: add(b, link='')
    else:
        for b in SUBJECTS:
            if set(b['subjects']) & set(how[1:]): add(b)
        if '국어' in how[1:]:
            for b in GRADES:
                if kor_tb(b): add(b, subjects=['국어'], link=kor_tb(b).replace(' 교과서', ''))
    out = []
    for b in L:
        m = M[norm(b['title'])]
        d = {k: b.get(k, '') for k in ('title', 'author', 'publisher', 'kind', 'band', 'grade', 'link')}
        d['subjects'] = b.get('subjects', [])
        d['recs'] = m['recs']; d['desc'] = b.get('desc') or m['desc']; d['awards'] = m['awards']
        d['id'] = norm(b['title'])
        out.append(d)
    tb = lambda d: any(r['org'] == '교과서 수록' for r in d['recs'])
    out.sort(key=lambda d: (-len(d['recs']), not tb(d), d['grade'] or 0, d['title']))
    return out


HOW = ('<ul><li><b>출처가 분명한 책만</b> 골랐어요. 책마다 추천한 기관과 그 목록 이름을 적었고, 기관 이름을 누르면 확인한 출처(기관 누리집·교육청·도서관·서점 소개 등)가 열려요.</li>'
       '<li><b>여러 기관이 함께 추천한 책을 먼저</b> 놓았어요. ⭐ 표시와 \'○곳 추천\'은 이 자료를 만들며 확인한 기관 수예요. 실제로는 더 많은 곳에서 추천했을 수 있어요.</li>'
       '<li>상(🏅)은 추천 기관 수에 넣지 않았어요.</li>'
       '<li>학년은 기관이 정한 학년 묶음(1·2학년, 3·4학년, 5·6학년)을 따르고, 묶음 안에서는 책의 길이와 어려움을 보고 나누었어요. 아이마다 읽는 힘이 다르니 앞뒤 학년 목록도 함께 보세요.</li>'
       '<li>추천 목록은 해마다 새로 나와요. ' + ASOF + ' 기준으로 확인했어요. 아이에게 건네기 전에 선생님·보호자가 먼저 살펴봐 주세요.</li>'
       '<li>\'읽었어요\' 표시는 이 기기에만 저장돼요.</li></ul>')


def page_html(i, p, data):
    rd = lambda f: (HERE / f).read_text(encoding='utf-8')
    prev = f'<a href="{PAGES[i - 1][0]}">← {PAGES[i - 1][1]}</a>' if i else '<a href="index.html">← 독서교육 목록</a>'
    nxt = f'<a href="{PAGES[i + 1][0]}">{PAGES[i + 1][1]} →</a>' if i + 1 < len(PAGES) else '<a href="orgs.html">추천 기관과 출처 →</a>'
    return fill(p[1], p[2], p[4], data, prev, nxt)


def fill(title, area, sub, data, prev, nxt):
    rd = lambda f: (HERE / f).read_text(encoding='utf-8')
    js = json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
    rep = {'{CSS}': rd('page.css'), '{HEADSNIP}': (OG / 'head_snip.html').read_text(encoding='utf-8'),
           '{FOOT}': (OG / 'foot.html').read_text(encoding='utf-8').replace('쉬는 시간에 친구와 함께 즐기는 종이접기 자료입니다.', '여러 기관이 함께 추천한 책을 학년별·교과별로 모은 독서교육 자료입니다.'),
           '{APP}': rd('app.js'), '{HOMEFRAG}': (OG / 'home.html').read_text(encoding='utf-8').replace('{HOME}', '../../index.html'),
           '{PREV}': prev, '{NEXT}': nxt, '{TITLE}': title, '{AREA}': area, '{SUB}': sub,
           '{DESC}': f'{title}: 여러 도서관·교육청·독서 단체가 함께 추천한 책 목록과 추천 기관'}
    s = rd('page.html')
    for k in ('{CSS}', '{HEADSNIP}', '{FOOT}', '{APP}', '{HOMEFRAG}', '{PREV}', '{NEXT}', '{TITLE}', '{AREA}', '{SUB}', '{DESC}'):
        s = s.replace(k, rep[k])
    return s.replace('{DATA}', js)


def write(name, s):
    out = OUT / name
    out.parent.mkdir(parents=True, exist_ok=True)
    old = out.read_text(encoding='utf-8') if out.exists() else ''
    strip = lambda x: re.sub(r'<!--hj-c(?:theme|icons)-->.*?<!--/hj-c(?:theme|icons)-->', '', x, flags=re.S)
    if strip(old) == s: return False
    out.write_text(s, encoding='utf-8'); return True


def build():
    M = merged(); n = 0; where = {}
    for i, p in enumerate(PAGES):
        books = pick(p, M)
        for b in books:
            for r in b['recs']: where.setdefault(r['org'], {}).setdefault(b['title'], p[0])
        data = {'page': 'list', 'title': p[1], 'books': books, 'how': HOW, 'asof': ASOF,
                'showGrade': p[3][0] == 'subj', 'showSubj': bool(p[5]), 'subjChips': p[5]}
        n += write(p[0], page_html(i, p, data))
    ol = []
    for o in ORGS:
        bs = sorted(where.get(o['name'], {}).items())
        if bs: ol.append({**o, 'books': [[t, f] for t, f in bs]})
    ol.sort(key=lambda o: -len(o['books']))
    how = ('<p>이 자료의 책을 추천한 기관과 그 기관이 내는 추천 목록을 소개해요. 기관마다 이 자료에 실린 책을 아래에 모았어요(누르면 그 책이 있는 목록으로 가요).</p>'
           f'<p class="rd-note">{ASOF} 기준. 기관 누리집 주소와 목록 이름은 바뀔 수 있어요. 책마다 확인한 출처 주소는 각 목록에서 기관 이름을 누르면 볼 수 있어요.</p>')
    n += write('orgs.html', fill('추천 기관과 출처', '추천 기관', '책을 추천한 도서관·교육청·독서 단체·공공기관을 한눈에 봐요.',
                                 {'page': 'orgs', 'orgList': ol, 'how': how}, f'<a href="{PAGES[-1][0]}">← {PAGES[-1][1]}</a>', '<a href="index.html">독서교육 목록 →</a>'))
    return n


if __name__ == '__main__':
    if check(): sys.exit('독서교육 자료 점검 실패')
    M = merged()
    if sys.argv[1:] == ['check']:
        print(f'독서교육 점검 통과 (학년별 {len(GRADES)}권, 교과별 {len(SUBJECTS)}권, 서로 다른 책 {len(M)}권, 두 곳 이상 추천 {sum(len(m["recs"]) >= 2 for m in M.values())}권)'); sys.exit()
    print(f'독서교육 {build()}개 페이지 다시 만듦 (모두 {len(PAGES) + 1}쪽)')
