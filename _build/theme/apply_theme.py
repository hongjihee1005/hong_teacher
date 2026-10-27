#!/usr/bin/env python3
"""메뉴 페이지(첫 화면·학년·과목·학기 목록)에 공통 디자인을 입힙니다.

    python3 _build/theme/apply_theme.py            # 모든 메뉴 페이지
    python3 _build/theme/apply_theme.py a.html b.html

여러 번 실행해도 안전합니다(표시 사이를 새 내용으로 바꿉니다).
theme.css / theme.js 를 고친 뒤 다시 실행하면 전체에 반영됩니다.
"""
import pathlib, posixpath, re, sys, os

ROOT = pathlib.Path(__file__).resolve().parents[2]
HERE = pathlib.Path(__file__).resolve().parent
FONT = '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.css">'
HOME_SVG = ('<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
            '<path d="M3.5 10.5 12 3.8l8.5 6.7"/><path d="M5.5 9.2V20h13V9.2"/><path d="M10 20v-5.5h4V20"/></svg>')
SEP_SVG = ('<svg class="c-sep" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">'
           '<path d="m9 6 6 6-6 6"/></svg>')

def is_menu(f, s):
    if 'http-equiv="refresh"' in s: return False
    rel = f.relative_to(ROOT).as_posix()
    if rel.startswith('_') or '/_' in rel: return False
    return rel == 'index.html' or 'class="crumb"' in s

def subj(rel):
    """과목 색은 학년 안의 과목 폴더에만(project/math/ 같은 수학게임 모음에는 붙이지 않음)"""
    m = re.match(r'grade\d/(korean|math|social|science)/', rel)
    return m.group(1) if m else ''

def clean(label):
    label = re.sub(r'<[^>]+>', '', label).strip()
    return re.sub(r'^[^\w가-힣]+', '', label).strip() or label

def crumb(m, rel):
    links = re.findall(r'<a[^>]*href="([^"]+)"[^>]*>(.*?)</a>', m.group(1), re.S)
    root_rel = os.path.relpath('index.html', os.path.dirname(rel) or '.').replace('\\', '/')
    out = []
    for href, lab in links:
        if href == root_rel or '초등교사 홍지희' in lab:
            out.append(f'<a class="c-link c-home" href="{href}">{HOME_SVG}<span>홈</span></a>')
        else:
            lab = clean(lab); lab = RENAME.get(lab, lab)
            if href.endswith('special/index.html'): href = href[:-len('special/index.html')] + 'project/index.html'
            out.append(f'<a class="c-link" href="{href}">{lab}</a>')
    mm = re.match(r'grade\d/\w+/sem(\d)(?:-(\w+))?/index\.html$', rel.replace('\\', '/'))
    if mm and out:
        suf = {'hong': ' · 홍지희 버전', 'soop': ' · 홍지희 버전', 'inquiry': ' · 탐구 버전'}.get(mm.group(2) or '', '')
        out.append(f'<span class="c-link c-cur" aria-current="page">{mm.group(1)}학기{suf}</span>')
    return '<nav class="crumb" aria-label="현재 위치">' + SEP_SVG.join(out) + '</nav>'

CHEV = ('<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">'
        '<path d="m6 9 6 6 6-6"/></svg>')
CARD = re.compile(r'<a class="card room([^"]*)"([^>]*)>(.*?)</a>', re.S)
WRAP = re.compile(r'<div class="rw" data-hj="1">(<a class="card room.*?</a>)<button class="r-tg".*?</button><div class="r-sub".*?</div></div>', re.S)

def text(h):
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', h)).strip()

def children(target):
    """누르면 펼쳐질 하위 메뉴: 대상 페이지의 방 카드, 없으면 종류 탭."""
    if not target.exists(): return []
    t = WRAP.sub(lambda m: m.group(1), target.read_text(encoding='utf-8'))
    out = []
    for m in CARD.finditer(t):
        attrs, body = m.group(2), m.group(3)
        href = re.search(r'href="([^"]+)"', attrs)
        if not href: continue
        nm = re.search(r'<span class="nm">(.*?)</span>', body, re.S)
        ico = re.search(r'<span class="ico">(.*?)</span>', body, re.S)
        acc = re.search(r'--acc:\s*(#[0-9A-Fa-f]{3,8})', attrs)
        out.append(dict(href=href.group(1), label=clean(nm.group(1)) if nm else '', ico=text(ico.group(1)) if ico else '',
                        wait='wait' in m.group(1), acc=acc.group(1) if acc else ''))
    if not out:
        for m in re.finditer(r'<a class="tab"[^>]*href="(#[\w-]+)"[^>]*>(.*?)</a>', t, re.S):
            lab = re.sub(r'<span class="cnt">.*?</span>', '', m.group(2))
            out.append(dict(href=m.group(1), label=clean(lab), ico=re.match(r'^\W*', text(lab)).group(0).strip(), wait=False, acc=''))
    return out

def submenus(s, f):
    s = WRAP.sub(lambda m: m.group(1), s)
    n = [0]
    def one(m):
        cls, attrs = m.group(1), m.group(2)
        if 'wait' in cls or 'nosub' in cls: return m.group(0)
        href = re.search(r'href="([^"]+)"', attrs)
        if not href or href.group(1).startswith(('http', '#')): return m.group(0)
        tgt = (f.parent / href.group(1).split('#')[0]).resolve()
        kids = children(tgt)
        if len(kids) < 2: return m.group(0)
        base = os.path.relpath(tgt.parent, f.parent).replace('\\', '/')
        n[0] += 1; sid = f'rsub{n[0]}'
        nm = re.search(r'<span class="nm">(.*?)</span>', m.group(3), re.S)
        title = clean(nm.group(1)) if nm else ''
        items = []
        for k in kids:
            h = k['href'] if k['href'].startswith('#') else (base + '/' + k['href'] if base != '.' else k['href'])
            if k['href'].startswith('#'): h = href.group(1).split('#')[0] + k['href']
            st = f' style="--acc:{k["acc"]}"' if k['acc'] else ''
            ico = f'<span class="r-ico" aria-hidden="true">{k["ico"]}</span>' if k['ico'] else ''
            if k['wait']:
                items.append(f'<span class="r-item r-wait"{st}>{ico}<span>{k["label"]}</span><small>준비 중</small></span>')
            else:
                items.append(f'<a class="r-item" href="{h}"{st}>{ico}<span>{k["label"]}</span></a>')
        btn = (f'<button class="r-tg" type="button" aria-expanded="false" aria-controls="{sid}" '
               f'aria-label="{title} 안의 메뉴 펼치기">{CHEV}</button>')
        return (f'<div class="rw" data-hj="1">{m.group(0)}{btn}<div class="r-sub" id="{sid}" hidden>'
                + ''.join(items) + '</div></div>')
    return CARD.sub(one, s)


# ───────── 학년 수업 길잡이(2026-10-27 선생님: '배열도 다시 설계'): 과목마다 교과서 1·2학기 / 홍지희 버전 1·2학기 / 더 보기를 한눈에 ─────────
# 학년 쪽(gradeN/index.html)과 첫 화면(학년 단추 → 그 학년 길잡이)에 apply()가 넣습니다. 표시 <!--hj-gdir-->.
GDIR_RE = re.compile(r'<!--hj-gdir-->.*?<!--/hj-gdir-->', re.S)
SUBJ_NM = {'korean': '국어', 'math': '수학', 'social': '사회', 'science': '과학'}
ARROW = ('<svg class="hd-arr" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" '
         'stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>')

def gdir(g, pre):
    """g학년 길잡이 HTML. pre: 이 쪽에서 gradeN/ 폴더까지의 앞 경로('' 또는 'gradeN/')."""
    gi = ROOT / f'grade{g}' / 'index.html'
    cols, more = [], []
    for c in children(gi):
        h = c['href']; key = h.split('/')[0]
        if key not in SUBJ_NM or c['wait']:
            if not c['wait']: more.append(c)
            continue
        kids = children(ROOT / f'grade{g}' / h)
        base = posixpath.dirname(h)
        tb, hong, ext = {}, {}, []
        for k in kids:
            lab = k['label']; sem = '1' if '1학기' in lab else '2' if '2학기' in lab else ''
            url = pre + posixpath.normpath(base + '/' + k['href'])
            it = dict(k, url=url)
            if sem and '홍지희' in lab: hong[sem] = it
            elif sem and lab.replace('·', '').strip().startswith(f'{sem}학기') and len(lab) <= 6: tb[sem] = it
            else: ext.append(it)
        def sems(d, name):
            if not d: return ''
            cells = []
            for n in '12':
                it = d.get(n)
                if not it: cells.append(f'<span class="hd-sem hd-none">{n}학기</span>')
                elif it['wait']: cells.append(f'<span class="hd-sem hd-wait">{n}학기<small>준비 중</small></span>')
                else: cells.append(f'<a class="hd-sem" href="{it["url"]}">{n}학기</a>')
            return f'<div class="hd-row"><span class="hd-lab">{name}</span><div class="hd-sems">{"".join(cells)}</div></div>'
        rows = sems(tb, '교과서') + sems(hong, '홍지희 선생님 버전')
        ex = ''.join(f'<a class="hd-ext" href="{e["url"]}"><span class="r-ico" aria-hidden="true">{e["ico"]}</span><span>{e["label"]}</span></a>'
                     for e in ext if not e['wait'])
        if ex: ex = f'<div class="hd-exts">{ex}</div>'
        acc = f' style="--acc:{c["acc"]}"' if c['acc'] else ''
        cols.append(f'<section class="hd-col" data-k="{key}"{acc}><a class="hd-head" href="{pre}{h}">'
                    f'<span class="r-ico" aria-hidden="true">{c["ico"]}</span><span class="hd-nm">{SUBJ_NM[key]}</span>{ARROW}</a>{rows}{ex}</section>')
    foot = ''.join(f'<a class="hd-ext hd-wide" href="{pre}{posixpath.normpath(m["href"])}"><span class="r-ico" aria-hidden="true">{m["ico"]}</span><span>{m["label"]}</span></a>' for m in more)
    return (f'<div class="hj-gdir" data-g="{g}" style="--n:{max(1, len(cols))}"><div class="hd-cols">{"".join(cols)}</div>'
            + (f'<div class="hd-foot">{foot}</div>' if foot else '') + '</div>')

def put_gdir(s, rel):
    s = GDIR_RE.sub('', s)
    m = re.fullmatch(r'grade(\d)/index\.html', rel)
    if m:
        blk = '<!--hj-gdir-->' + gdir(int(m.group(1)), '') + '<!--/hj-gdir-->'
        return s.replace('<div class="grid">', blk + '<div class="grid hj-gold">', 1).replace('<div class="grid hj-gold hj-gold">', '<div class="grid hj-gold">')
    if rel == 'index.html':
        tabs = ''.join(f'<a class="hd-tab" href="grade{g}/index.html" data-g="{g}" role="tab"><b>{g}</b>학년</a>' for g in range(1, 7))
        pan = ''.join(gdir(g, f'grade{g}/') for g in range(1, 7))
        blk = f'<!--hj-gdir--><div class="hj-ghub"><div class="hd-tabs" role="tablist" aria-label="학년 고르기">{tabs}</div>{pan}</div><!--/hj-gdir-->'
        return re.sub(r'(<div class="grid[^"]*\bsix\b[^"]*")', blk + r'\1', s, count=1)
    return s

# ───────── 사이트 틀(2026-10-27): 위 머리 막대 · 제목 띠 · 꼬리말 상표 ─────────
# 메뉴 페이지마다 같은 짜임이 되게 apply()가 넣습니다. 다른 스크립트가 메뉴 HTML을 잘라 쓸 때는
# unchrome()으로 먼저 걷어 내고(원래 짜임: main 바로 아래 crumb → h1 → p.sub), 다 만든 뒤 hero()로 제목 띠만 다시 씌웁니다.
TOP_RE = re.compile(r'<!--hj-top-->.*?<!--/hj-top-->', re.S)
FB_RE = re.compile(r'<!--hj-fb-->.*?<!--/hj-fb-->', re.S)
HERO_OFF = re.compile(r'<!--hj-hero--><div class="hj-hero"><div class="hj-hero-in">(.*?)</div></div><!--/hj-hero-->', re.S)
HERO_ON = re.compile(r'(<main[^>]*>)(\s*)((?:<nav class="crumb".*?</nav>\s*)?<h1[ >].*?</h1>'
                     r'(?:\s*(?:<!--hj-today-->.*?<!--/hj-today-->|<p class="sub">.*?</p>))?)', re.S)
# 주 메뉴(2026-10-27 선생님 요청으로 묶고 이름 지음): 학년별 수업 · 기초 학습 · 교육 프로그램 · 교실 도구 · 쉬는 시간
GRADES = [(f'{n}학년', f'grade{n}/index.html') for n in range(1, 7)]
TOOLS = [('우리 반 교실', 'class/index.html'), ('오늘의 교실 산책', 'today/index.html'), ('도장 만들기', 'project/stamp/index.html')]
GNAV = [('dd', '학년별 수업', GRADES), ('a', '기초 학습', 'common/index.html'), ('a', '교육 프로그램', 'project/index.html'),
        ('dd', '교실 도구', TOOLS), ('a', '쉬는 시간', 'break/index.html')]
# 위치 표시줄에 보이는 묶음 이름도 새 이름으로(폴더·파일 이름은 그대로). 특색교육은 교육 프로그램에 합침.
RENAME = {'공통': '기초 학습', '기타': '교육 프로그램', '특색교육': '교육 프로그램'}

def section(rel):
    """rel이 주 메뉴의 어느 묶음에 드는지"""
    if re.match(r'grade\d/', rel): return '학년별 수업'
    if rel.startswith(('class/', 'today/', 'project/stamp/')): return '교실 도구'
    if rel.startswith('common/'): return '기초 학습'
    if rel.startswith(('project/', 'special/')): return '교육 프로그램'
    if rel.startswith('break/'): return '쉬는 시간'
    return ''
DOWN = ('<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">'
        '<path d="m6 9 6 6 6-6"/></svg>')
BURGER = ('<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">'
          '<path d="M4 7h16M4 12h16M4 17h16"/></svg>')
MARK = '<span class="hj-mark" aria-hidden="true">홍</span>'

def unchrome(s):
    s = TOP_RE.sub('', s); s = FB_RE.sub('', s)
    return HERO_OFF.sub(lambda m: m.group(1), s)

def hero(s):
    if '<!--hj-hero-->' in s: return s
    return HERO_ON.sub(lambda m: m.group(1) + m.group(2) + '<!--hj-hero--><div class="hj-hero"><div class="hj-hero-in">'
                       + m.group(3) + '</div></div><!--/hj-hero-->', s, count=1)

def topbar(rel):
    d = posixpath.dirname(rel) or '.'
    r = lambda p: posixpath.relpath(p, d)
    sec = section(rel); items = []
    for i, (kind, name, tgt) in enumerate(GNAV):
        on = ' is-on' if sec == name else ''
        if kind == 'a':
            items.append(f'<a class="hj-gl{on}" href="{r(tgt)}">{name}</a>'); continue
        links = ''.join(f'<a href="{r(p)}"' + (' aria-current="true"' if rel.startswith(p.rsplit('/', 1)[0] + '/') else '') + f'>{t}</a>' for t, p in tgt)
        items.append(f'<div class="hj-dd"><button class="hj-ddb{on}" type="button" aria-expanded="false" aria-controls="hj-ddm{i}">{name}{DOWN}</button>'
                     f'<div class="hj-ddm{" hj-ddm-g" if tgt is GRADES else ""}" id="hj-ddm{i}" hidden>{links}</div></div>')
    return ('<!--hj-top--><header class="hj-top"><div class="hj-top-in">'
            f'<a class="hj-brand" href="{r("index.html")}">{MARK}<span class="hj-bt"><b>초등교사 홍지희</b><small>수업 자료실</small></span></a>'
            '<nav class="hj-gnav" id="hj-gnav" aria-label="주 메뉴">' + ''.join(items) + '</nav>'
            f'<button class="hj-mbtn" type="button" aria-expanded="false" aria-controls="hj-gnav" aria-label="메뉴 열기">{BURGER}<span>메뉴</span></button>'
            '</div></header><!--/hj-top-->')

def footbrand():
    return ('<!--hj-fb--><div class="hj-fb">' + MARK +
            '<span class="hj-bt"><b>초등교사 홍지희</b><small>수업 자료실</small></span></div><!--/hj-fb-->')

def chrome(s, rel):
    s = re.sub(r'(<body[^>]*>)', lambda m: m.group(1) + topbar(rel), s, count=1)
    s = s.replace('<footer class="hjfoot">', '<footer class="hjfoot">' + footbrand(), 1)
    return hero(s)

def apply(f):
    s = f.read_text(encoding='utf-8'); o = s
    if not is_menu(f, s): return False
    s = unchrome(s)
    rel = f.relative_to(ROOT).as_posix()
    css = (HERE / 'theme.css').read_text(encoding='utf-8')
    js = (HERE / 'icons.js').read_text(encoding='utf-8') + (HERE / 'theme.js').read_text(encoding='utf-8')
    head = f'<!--hj-theme-->{FONT}<style id="hj-theme">{css}</style><!--/hj-theme-->'
    s = re.sub(r'<!--hj-theme-->.*?<!--/hj-theme-->', '', s, flags=re.S)
    s = s.replace('</head>', head + '</head>', 1)
    tail = f'<!--hj-theme-js--><script>{js}</script><!--/hj-theme-js-->'
    s = re.sub(r'<!--hj-theme-js-->.*?<!--/hj-theme-js-->', '', s, flags=re.S)
    i = s.rfind('</body>'); s = s[:i] + tail + s[i:]
    s = re.sub(r'<nav class="crumb"[^>]*>(.*?)</nav>', lambda m: crumb(m, rel), s, count=1, flags=re.S)
    s = re.sub(r'<h1>([^\w\s가-힣<&]+)\s*', lambda m: f'<h1><span class="h-ico" aria-hidden="true">{m.group(1)}</span>', s, count=1)
    s = submenus(s, f)
    s = put_gdir(s, rel)
    k = subj(rel)
    s = re.sub(r'(<html[^>]*?) data-subj="\w+"', r'\1', s, count=1)
    if k:
        s = re.sub(r'<html([^>]*)>', lambda m: f'<html{m.group(1)} data-subj="{k}">', s, count=1)
    s = chrome(s, rel)
    if s != o: f.write_text(s, encoding='utf-8'); return True
    return False

if __name__ == '__main__':
    files = [pathlib.Path(a).resolve() for a in sys.argv[1:]] or sorted(ROOT.rglob('*.html'))
    n = sum(apply(f) for f in files if '.git' not in f.parts)
    print(f'{n}개 페이지에 적용')
