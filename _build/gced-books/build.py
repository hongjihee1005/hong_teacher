#!/usr/bin/env python3
"""프로젝트 › 도서 활용 세계시민교육 페이지 만들기 (2026-10-06)

    python3 _build/gced-books/build.py         # project/gced-books/ 아래 메뉴 21쪽 + 책 목록 60쪽
    python3 _build/gced-books/build.py check   # 자료 점검만

주제: 세계시민교육(_build/gced/topics_*.py)의 20개 주제를 그대로 씀 → 주제마다 저학년(1·2) · 중학년(3·4) · 고학년(5·6)
자료: data/books.json — 책 하나 {topic:'t10', band:'low|mid|high', title, author, publisher, year, month?, orig_year?, kind,
      desc(어린이용 소개), fit(주제와 이어지는 점), ask(함께 이야기할 질문), src{detail,url}(책 정보를 확인한 곳),
      recs[{org,detail,url}](추천 근거), made[{org,detail,url}](책을 함께 만든 기관 — 추천 수에 넣지 않음), famous(널리 알려진 까닭: 상·교과서 수록 등, 없으면 '')}
원칙: 국내 초판이 2015년 이후인 책만(MIN_YEAR). 책 정보와 추천 근거는 검색으로 확인한 것만. 한 책은 한 칸에만.
만드는 것: project/gced-books/index.html(주제 메뉴) · tNN-slug/index.html(학년 묶음 메뉴) · tNN-slug/low|mid|high.html(책 목록)
          메뉴는 이 스크립트가 만들고 바로 apply_theme.py를 입힘(손으로 고치지 마세요 — 소개 글은 아래 AREA_NOTE·INTRO).
화면: page.html + page.css + app.js. 고친 뒤 루트에서 python3 _build/theme/apply_content_theme.py (자동 보완 run_all.py에도 들어 있음).
"""
import re, sys, json, pathlib
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
OG = ROOT / '_build' / 'origami'
OUT = ROOT / 'project' / 'gced-books'
sys.path.insert(0, str(ROOT / '_build' / 'gced'))
sys.path.insert(0, str(ROOT / '_build' / 'theme'))
from topics_a import T as A
from topics_b import T as B
from topics_c import T as C
TOPICS = A + B + C
BOOKS = json.loads((HERE / 'data' / 'books.json').read_text(encoding='utf-8'))
ASOF = '2026년 10월'
MIN_YEAR = 2015
KINDS = {'그림책', '동화', '지식책', '시·동시', '인물 이야기', '만화'}
BANDS = [('low', '저학년', '1·2학년', '🐣', '#E0567A'), ('mid', '중학년', '3·4학년', '🌱', '#3E9A3E'), ('high', '고학년', '5·6학년', '🌳', '#2F74E0')]
AREA_ACC = {'세계시민교육 첫걸음': '#1F7A8C', '정체성·다양성·인권': '#E0567A', '지구촌 문제와 평화': '#2F74E0',
            '지속가능발전(SDGs)': '#3E9A3E', '참여와 실천': '#D9731A'}
INTRO = ('세계시민교육 20개 주제마다 함께 읽을 책을 저학년(1·2학년) · 중학년(3·4학년) · 고학년(5·6학년)으로 나누어 모았어요. '
         '<b>국내에서 2015년 이후 처음 나온 책</b>만 골랐고, 책마다 주제와 이어지는 점, 읽고 함께 이야기할 질문, 확인한 출처를 적었어요. '
         '상을 받았거나 교과서에 실리는 등 <b>널리 알려진 책</b>은 🏅로 표시했어요.')


def tid(t): return f"t{t['no']:02d}"
def tdir(t): return f"t{t['no']:02d}-{t['slug']}"
def norm(s): return re.sub(r'[\s\W_]+', '', s)


def check():
    bad = 0
    def say(*a):
        nonlocal bad; bad += 1; print(*a)
    ids = {tid(t) for t in TOPICS}; seen = {}
    for b in BOOKS:
        t = b.get('title', '?')
        for k in ('topic', 'band', 'title', 'author', 'publisher', 'year', 'kind', 'desc', 'fit', 'ask', 'src'):
            if not b.get(k): say(t, k, '비어 있음')
        if b.get('topic') not in ids: say(t, '주제 번호', b.get('topic'))
        if b.get('band') not in [x[0] for x in BANDS]: say(t, '학년 묶음', b.get('band'))
        if b.get('kind') not in KINDS: say(t, '갈래', b.get('kind'))
        if not isinstance(b.get('year'), int) or not MIN_YEAR <= b['year'] <= 2026: say(t, f'{MIN_YEAR}년 이후가 아님', b.get('year'))
        if b.get('month') and not 1 <= b['month'] <= 12: say(t, '달', b['month'])
        for r in [b.get('src') or {}] + b.get('recs', []) + b.get('made', []):
            if not re.match(r'https?://', r.get('url', '')): say(t, '출처 주소', r)
            if not r.get('detail'): say(t, '출처 설명 없음', r)
        for r in b.get('recs', []):
            if not r.get('org'): say(t, '추천 기관 이름 없음')
        if len(b.get('desc', '')) > 90: say(t, '소개가 김', len(b['desc']))
        k = norm(t)
        if k in seen: say(t, '두 칸에 있음', seen[k], b.get('topic'))
        seen[k] = b.get('topic')
    return bad


def cell(t, band):
    L = [dict(b, id=norm(b['title'])) for b in BOOKS if b['topic'] == tid(t) and b['band'] == band]
    for b in L: b.setdefault('recs', []); b.setdefault('famous', ''); b.setdefault('made', [])
    L.sort(key=lambda b: (-len(b['recs']), not b['famous'], -b['year'], -(b.get('month') or 0), b['title']))
    return L


HOW = ('<ul><li><b>국내에서 ' + str(MIN_YEAR) + '년 이후 처음 나온 책</b>만 골랐어요. 번역한 책은 원서가 나온 해도 함께 적었어요. 그 전에 나온 책을 다시 낸 책(개정판)은 넣지 않았어요.</li>'
       '<li>제목·지은이·출판사·나온 해는 서점·출판사·도서관 정보로 확인했고, 맨 아래 \'책 정보\'를 누르면 확인한 곳이 열려요.</li>'
       '<li>도서관·교육청·독서 단체 등이 추천한 것을 확인한 책은 그 기관을 함께 적고(⭐), 먼저 놓았어요.</li>'
       '<li>🏅 <b>널리 알려진 책</b>: 상을 받았거나 교과서에 실렸거나 많이 읽히는 책이에요. 이미 읽은 아이가 있을 수 있으니 수업 전에 확인해 보세요.</li>'
       '<li>학년 묶음은 책의 길이와 어려움, 주제의 무게를 보고 나누었어요. 아이마다 읽는 힘이 다르니 앞뒤 묶음도 함께 보세요.</li>'
       '<li>' + ASOF + ' 기준으로 확인했어요. 아이에게 건네기 전에 선생님·보호자가 먼저 살펴봐 주세요. \'읽었어요\' 표시는 이 기기에만 저장돼요.</li></ul>')


def fill(title, area, sub, data, prev, nxt):
    rd = lambda f: (HERE / f).read_text(encoding='utf-8')
    js = json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
    rep = {'{CSS}': rd('page.css'), '{HEADSNIP}': (OG / 'head_snip.html').read_text(encoding='utf-8'),
           '{FOOT}': (OG / 'foot.html').read_text(encoding='utf-8').replace('쉬는 시간에 친구와 함께 즐기는 종이접기 자료입니다.', '세계시민교육 주제마다 학년 묶음별로 함께 읽을 책을 모은 자료입니다.'),
           '{APP}': rd('app.js'), '{HOMEFRAG}': (OG / 'home.html').read_text(encoding='utf-8').replace('{HOME}', '../../../index.html'),
           '{PREV}': prev, '{NEXT}': nxt, '{TITLE}': title, '{AREA}': area, '{SUB}': sub,
           '{DESC}': f'{title}: 세계시민교육 주제와 이어지는 2015년 이후 출간 도서 목록'}
    s = rd('page.html')
    for k in ('{CSS}', '{HEADSNIP}', '{FOOT}', '{APP}', '{HOMEFRAG}', '{PREV}', '{NEXT}', '{TITLE}', '{AREA}', '{SUB}', '{DESC}'):
        s = s.replace(k, rep[k])
    return s.replace('{DATA}', js)


def write(rel, s):
    out = OUT / rel
    out.parent.mkdir(parents=True, exist_ok=True)
    old = out.read_text(encoding='utf-8') if out.exists() else ''
    strip = lambda x: re.sub(r'<!--hj-c(?:theme|icons)-->.*?<!--/hj-c(?:theme|icons)-->', '', x, flags=re.S)
    if strip(old) == s: return False
    out.write_text(s, encoding='utf-8'); return True


def menu(rel, title, body, note):
    """메뉴 페이지: 틀(menu.html)에 넣고 바로 메뉴 디자인(apply_theme)을 입힘. 바뀐 것이 없으면 그대로 둠"""
    import apply_theme
    out = OUT / rel
    out.parent.mkdir(parents=True, exist_ok=True)
    old = out.read_text(encoding='utf-8') if out.exists() else None
    s = (HERE / 'menu.html').read_text(encoding='utf-8').replace('{TITLE}', title).replace('{FOOTNOTE}', note).replace('{BODY}', body)
    out.write_text(s, encoding='utf-8'); apply_theme.apply(out)
    if old is not None and out.read_text(encoding='utf-8') == old: return False
    return True


def esc(s): return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;')


def summary(L, k=3):
    return ', '.join(b['title'] for b in L[:k]) + (' …' if len(L) > k else '')


def build():
    n = 0; seq = [(t, bd) for t in TOPICS for bd in BANDS]
    counts = {}
    for i, (t, bd) in enumerate(seq):
        L = cell(t, bd[0]); counts[(tid(t), bd[0])] = L
    for i, (t, bd) in enumerate(seq):
        L = counts[(tid(t), bd[0])]
        def lk(j, arrow):
            tt, bb = seq[j]
            href = (f'{bb[0]}.html' if tt is t else f'../{tdir(tt)}/{bb[0]}.html')
            lab = f"{tt['no']:02d}. {tt['title']} · {bb[1]}"
            return f'<a href="{href}">← {lab}</a>' if arrow < 0 else f'<a href="{href}">{lab} →</a>'
        prev = lk(i - 1, -1) if i else '<a href="../index.html">← 도서 활용 세계시민교육</a>'
        nxt = lk(i + 1, 1) if i + 1 < len(seq) else '<a href="../index.html">도서 활용 세계시민교육 →</a>'
        bands = [{'name': f'{x[1]}({x[2]})', 'ico': x[3], 'href': f'{x[0]}.html', 'n': len(counts[(tid(t), x[0])]), 'cur': x[0] == bd[0]} for x in BANDS]
        data = {'books': L, 'how': HOW, 'asof': ASOF, 'goal': t['goal'], 'lesson': f"../../global/{tdir(t)}.html",
                'topic': f"{t['no']:02d}. {t['title']}", 'band': f'{bd[1]}({bd[2]})', 'bandKey': bd[0], 'bands': bands}
        n += write(f'{tdir(t)}/{bd[0]}.html', fill(f"{t['no']:02d}. {t['title']} · {bd[1]}", f"{t['area']} · {bd[1]}({bd[2]})",
                                                  f"{bd[2]} 어린이와 함께 읽고 이야기 나눌 책이에요.", data, prev, nxt))
    # 주제 메뉴: 학년 묶음 세 칸
    crumb = '<nav class="crumb" aria-label="현재 위치"><a class="back" href="../../../index.html">🏠 초등교사 홍지희</a><a href="../../index.html">프로젝트</a><a href="../index.html">도서 활용 세계시민교육</a></nav>'
    note = '세계시민교육 주제마다 학년 묶음별로 함께 읽을 책을 모은 자료입니다.'
    for t in TOPICS:
        cards = []
        for x in BANDS:
            L = counts[(tid(t), x[0])]
            if L:
                fm = sum(1 for b in L if b['famous'])
                cards.append(f'<a class="card room" style="--acc:{x[4]}" href="{x[0]}.html"><span class="ico">{x[3]}</span><span class="nm">{x[1]} ({x[2]})</span>'
                             f'<small>{len(L)}권' + (f' · 🏅 널리 알려진 책 {fm}권' if fm else '') + f' — {esc(summary(L))}</small></a>')
            else:
                cards.append(f'<div class="card room wait"><span class="ico">{x[3]}</span><span class="nm">{x[1]} ({x[2]})</span><small>곧 열려요 — 출처를 확인하는 중이에요</small></div>')
        body = (crumb + f"\n<h1>{t['ico']} {t['no']:02d}. {esc(t['title'])}</h1>\n"
                f"<p class=\"sub\">{esc(t['goal'])} 이 주제와 함께 읽을 책을 학년 묶음별로 골라 보세요.</p>\n"
                '<div class="grid g3 three">\n' + '\n'.join(cards) + '\n</div>\n'
                f"<p class=\"verify\">📚 이 주제의 수업 자료(배우기·생각 활동·활동지)는 <a href=\"../../global/{tdir(t)}.html\">세계시민교육 {t['no']:02d}. {esc(t['title'])}</a>에 있어요. "
                f'국내 초판이 {MIN_YEAR}년 이후인 책만 골랐고, {ASOF} 기준 검색으로 책 정보와 추천 근거를 확인했어요.</p>')
        n += menu(f'{tdir(t)}/index.html', f"{t['no']:02d}. {t['title']} · 도서 활용 세계시민교육 · 프로젝트 · 초등교사 홍지희", body, note)
    # 첫 메뉴: 영역별 20개 주제
    tot = len(BOOKS); fm = sum(1 for b in BOOKS if b.get('famous'))
    parts = []; area = None
    for t in TOPICS:
        if t['area'] != area:
            if area: parts.append('</div>')
            area = t['area']; parts.append(f"<h2>{t['ico']} {esc(area)}</h2>\n<div class=\"grid g3 three\">")
        c = [len(counts[(tid(t), x[0])]) for x in BANDS]
        parts.append(f'<a class="card room" style="--acc:{AREA_ACC.get(area, "#1F7A8C")}" href="{tdir(t)}/index.html"><span class="ico">{t["ico"]}</span>'
                     f'<span class="nm">{t["no"]:02d}. {esc(t["title"])}</span><small>저학년 {c[0]} · 중학년 {c[1]} · 고학년 {c[2]}권</small></a>')
    parts.append('</div>')
    body = ('<nav class="crumb" aria-label="현재 위치"><a class="back" href="../../index.html">🏠 초등교사 홍지희</a><a href="../index.html">프로젝트</a></nav>\n'
            '<h1>📖 도서 활용 세계시민교육</h1>\n'
            f'<p class="sub">{INTRO} 지금 {tot}권(🏅 {fm}권)이 있어요.</p>\n' + '\n'.join(parts) + '\n'
            f'<p class="verify">고르는 기준: 국내 초판 {MIN_YEAR}년 이후 · 책 정보(제목·지은이·출판사·나온 해)와 추천 근거는 서점·출판사·도서관·기관 자료를 {ASOF} 기준 검색으로 확인한 것만 적었어요. '
            '주제는 <a href="../global/index.html">세계시민교육</a>의 20개 주제(유네스코 「세계시민교육: 주제와 학습 목표」 2015)를 따랐어요. 아이에게 건네기 전에 먼저 살펴봐 주세요.</p>')
    n += menu('index.html', '도서 활용 세계시민교육 · 프로젝트 · 초등교사 홍지희', body, note)
    return n


if __name__ == '__main__':
    if check(): sys.exit('도서 활용 세계시민교육 자료 점검 실패')
    if sys.argv[1:] == ['check']:
        c = {(b['topic'], b['band']) for b in BOOKS}
        print(f'도서 활용 세계시민교육 점검 통과 (책 {len(BOOKS)}권, 🏅 {sum(1 for b in BOOKS if b.get("famous"))}권, 빈 칸 {60 - len(c)}개)'); sys.exit()
    print(f'도서 활용 세계시민교육 {build()}개 페이지 다시 만듦 (모두 {len(TOPICS) * 4 + 1}쪽)')
