#!/usr/bin/env python3
"""메뉴 페이지(첫 화면·학년·과목·학기 목록)에 공통 디자인을 입힙니다.

    python3 _build/theme/apply_theme.py            # 모든 메뉴 페이지
    python3 _build/theme/apply_theme.py a.html b.html

여러 번 실행해도 안전합니다(표시 사이를 새 내용으로 바꿉니다).
theme.css / theme.js 를 고친 뒤 다시 실행하면 전체에 반영됩니다.
"""
import pathlib, re, sys, os

ROOT = pathlib.Path(__file__).resolve().parents[2]
HERE = pathlib.Path(__file__).resolve().parent
FONT = '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">'
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
    for k in ('korean', 'math', 'social', 'science'):
        if f'/{k}/' in '/' + rel: return k
    return ''

def clean(label):
    label = re.sub(r'<[^>]+>', '', label).strip()
    return re.sub(r'^[^\w가-힣]+', '', label).strip() or label

def crumb(m, rel):
    links = re.findall(r'<a[^>]*href="([^"]+)"[^>]*>(.*?)</a>', m.group(1), re.S)
    root_rel = os.path.relpath('index.html', os.path.dirname(rel) or '.').replace('\\', '/')
    out = []
    for href, lab in links:
        if href == root_rel or '홍지희' in lab:
            out.append(f'<a class="c-link c-home" href="{href}">{HOME_SVG}<span>홈</span></a>')
        else:
            out.append(f'<a class="c-link" href="{href}">{clean(lab)}</a>')
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
        if 'wait' in cls: return m.group(0)
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

def apply(f):
    s = f.read_text(encoding='utf-8'); o = s
    if not is_menu(f, s): return False
    rel = f.relative_to(ROOT).as_posix()
    css = (HERE / 'theme.css').read_text(encoding='utf-8')
    js = (HERE / 'theme.js').read_text(encoding='utf-8')
    head = f'<!--hj-theme-->{FONT}<style id="hj-theme">{css}</style><!--/hj-theme-->'
    s = re.sub(r'<!--hj-theme-->.*?<!--/hj-theme-->', '', s, flags=re.S)
    s = s.replace('</head>', head + '</head>', 1)
    tail = f'<!--hj-theme-js--><script>{js}</script><!--/hj-theme-js-->'
    s = re.sub(r'<!--hj-theme-js-->.*?<!--/hj-theme-js-->', '', s, flags=re.S)
    i = s.rfind('</body>'); s = s[:i] + tail + s[i:]
    s = re.sub(r'<nav class="crumb"[^>]*>(.*?)</nav>', lambda m: crumb(m, rel), s, count=1, flags=re.S)
    s = re.sub(r'<h1>([^\w\s가-힣<]+)\s*', lambda m: f'<h1><span class="h-ico" aria-hidden="true">{m.group(1)}</span>', s, count=1)
    s = submenus(s, f)
    k = subj(rel)
    if k and not re.search(r'<html[^>]*data-subj=', s):
        s = re.sub(r'<html([^>]*)>', lambda m: f'<html{m.group(1)} data-subj="{k}">', s, count=1)
    if s != o: f.write_text(s, encoding='utf-8'); return True
    return False

if __name__ == '__main__':
    files = [pathlib.Path(a).resolve() for a in sys.argv[1:]] or sorted(ROOT.rglob('*.html'))
    n = sum(apply(f) for f in files if '.git' not in f.parts)
    print(f'{n}개 페이지에 적용')
