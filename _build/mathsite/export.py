#!/usr/bin/env python3
"""'초등 수학 게임' 따로 사이트(저장소 hongjihee1005/math-game)를 만듭니다.

    python3 _build/mathsite/export.py 출력폴더

- '기타' 메뉴(project/index.html)의 방 가운데 이름에 '수학'이 들어간 방을 모두 찾아(선생님 요청 2026-10-07),
  그 방 폴더(project/<폴더>/)를 하위 폴더까지 통째로 복사합니다. 새 수학 방을 기타에 만들면 저절로 들어갑니다.
- 첫 화면은 방마다 한 묶음: 묶음 제목은 방 이름(창의수학게임 → '창의 수학', 교과수학게임 → '교과수학'),
  묶음 안 카드는 그 방 메뉴(project/<폴더>/index.html)의 카드를 그대로 가져옵니다. 방 메뉴 페이지 자체는 없고 첫 화면으로 넘깁니다.
  더 깊은 하위 메뉴(방 폴더 안의 폴더 index.html)는 그대로 둡니다.
- 쉬는 시간 스도쿠(break/sudoku/)는 창의 수학 카드가 가리키므로 sudoku/로 함께 복사합니다(EXTRA).
- 링크는 원래 위치에서 가리키던 곳을 따져 새 사이트 주소로 바꿉니다. 새 사이트에 없는 곳을 가리키면 원래 자료실 주소로 두고 [알림]을 찍습니다.
- math-game 저장소의 Actions가 한 시간마다 이 스크립트를 돌려, 바뀐 것이 있으면 올립니다(원본은 늘 이 저장소). 여러 번 실행해도 같은 결과.
"""
import pathlib, posixpath, re, shutil, sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
MAIN = 'https://hongjihee1005.github.io/hong_teacher/'
NAME = '초등 수학 게임'
SITE = 'https://hongjihee1005.github.io/math-game/'
BY = '초등교사 홍지희'
TAIL = ' | ' + BY   # 브라우저 탭·검색 결과 제목 끝(화면 제목에는 넣지 않음, 선생님 요청 2026-10-07)
DESC = ('초등교사 홍지희가 만든 초등수학게임 — 마방진·칠교놀이·계산 스도쿠·하노이 탑·네모 로직·스도쿠로 생각하는 힘을 기르고, '
        '1~6학년 교과 계산을 풍선·두더지·골든벨 같은 게임으로 익혀요.')
HEAD = ('<meta name="google-site-verification" content="gkDyhzWKxyJcx07mGzqlgNcSb6hh2qFh4VKAtkQgIUE">\n'  # 구글 Search Console 소유 확인(지우지 마세요)
        f'<meta name="description" content="{DESC}">\n<meta name="author" content="{BY}">\n<link rel="canonical" href="{SITE}">\n'
        '<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite","name":"초등 수학 게임",'
        '"alternateName":["초등수학게임","초등교사 홍지희의 초등 수학 게임"],"url":"' + SITE + '","inLanguage":"ko",'
        '"description":"' + DESC + '","author":{"@type":"Person","name":"홍지희","jobTitle":"초등교사",'
        '"url":"https://www.youtube.com/@hongjihee1005"}}</script>\n')  # 검색 사이트가 읽는 사이트 이름·만든 사람
KEY = '수학'                                   # 기타 메뉴의 방 이름에 이 글자가 있으면 넣음
LABEL = {'creative': '창의 수학', 'mathgame': '교과수학'}   # 첫 화면 묶음 제목(없으면 방 이름 그대로)
EXTRA = {'break/sudoku': 'sudoku'}             # 방이 아니지만 함께 넣는 폴더(원본 → 새 사이트 폴더), 메뉴 index는 그대로 둠
REDIRECT = ('<!doctype html><html lang="ko"><head><meta charset="utf-8">'
            '<meta http-equiv="refresh" content="0; url={home}"><title>' + NAME + '</title></head>'
            '<body><p><a href="{home}">' + NAME + ' 첫 화면으로 가기</a></p></body></html>\n')
WARN = []

def rooms():
    """기타 메뉴에서 이름에 '수학'이 든 방: [(폴더, 방 이름)] — 메뉴에 놓인 차례대로."""
    s = (ROOT / 'project/index.html').read_text(encoding='utf-8')
    out = []
    for m in re.finditer(r'<a class="card room[^"]*"([^>]*)>(.*?)</a>', s, re.S):
        h = re.search(r'href="([^"]+)"', m.group(1)); n = re.search(r'<span class="nm">(.*?)</span>', m.group(2), re.S)
        if not (h and n): continue
        nm = re.sub(r'<[^>]+>', '', n.group(1)).strip()
        if KEY not in nm: continue
        mm = re.fullmatch(r'([\w-]+)/index\.html', h.group(1))
        if not mm: WARN.append(f'기타 메뉴의 수학 방 "{nm}"이 폴더가 아니어서 넣지 못했습니다({h.group(1)})'); continue
        out.append((mm.group(1), nm))
    assert out, '기타 메뉴에서 수학 방을 찾지 못했습니다'
    return out

ROOMS = rooms()

def newpath(o):
    """원래 저장소 경로 → 새 사이트 경로(없으면 None). 방 메뉴 페이지와 기타 메뉴·자료실 첫 화면은 새 첫 화면으로."""
    if o in ('index.html', 'project/index.html'): return 'index.html'
    for d, _ in ROOMS:
        p = f'project/{d}/'
        if o == p + 'index.html': return 'index.html'
        if o.startswith(p): return d + '/' + o[len(p):]
    for src, dst in EXTRA.items():
        if o.startswith(src + '/'): return dst + '/' + o[len(src) + 1:]
    return None

def relink(s, o, n):
    """s 안의 상대 주소(원래 위치 o 기준)를 새 사이트 위치 n 기준으로 바꿉니다."""
    od, nd = posixpath.dirname(o), posixpath.dirname(n)
    def one(path):
        res = posixpath.normpath(posixpath.join(od, path))
        if res.startswith('..'): return path
        np_ = newpath(res)
        if np_ is None:
            WARN.append(f'{n} → 새 사이트에 없는 {res} (원래 자료실 주소로 둠)')
            return MAIN + res
        return posixpath.relpath(np_, nd or '.')
    s = re.sub(r'href="([^"#?:+\'<>\s]+\.html)((?:#[^"]*)?)"', lambda m: f'href="{one(m.group(1))}{m.group(2)}"', s)
    s = re.sub(r'(http-equiv="refresh" content="\d+;\s*url=)([^"#?:]+\.html)', lambda m: m.group(1) + one(m.group(2)), s)
    return s

def crumb(s, o):
    """위치 표시줄에서 홈 말고 새 첫 화면으로 바뀌는 칸(기타, 방 메뉴, 쉬는 시간 등)을 뺍니다."""
    m = re.search(r'<nav class="crumb"[^>]*>(.*?)</nav>', s, re.S)
    if not m: return s
    sep = re.search(r'<svg class="c-sep".*?</svg>', m.group(1), re.S)
    parts = re.findall(r'<a [^>]*href="[^"]+"[^>]*>.*?</a>|<span class="c-link c-cur".*?</span>', m.group(1), re.S)
    keep = []
    for i, p in enumerate(parts):
        h = re.match(r'<a [^>]*href="([^"]+)"', p)
        if i and h:
            np_ = newpath(posixpath.normpath(posixpath.join(posixpath.dirname(o), h.group(1))))
            if np_ in (None, 'index.html'): continue
        keep.append(p)
    inner = (sep.group(0) if sep else ' › ').join(keep)
    return s[:m.start(1)] + inner + s[m.end(1):]

def fix_text(s):
    s = s.replace(' · 기타 · 초등교사 홍지희', ' · ' + NAME).replace(' · 쉬는 시간 · 초등교사 홍지희', ' · 창의 수학 · ' + NAME)
    s = s.replace('학년 교과수학게임 · ', '학년 · 교과수학 · ').replace('학년 교과수학게임', '학년')                        # '3학년 교과수학게임' → '3학년'
    s = s.replace('<p>쉬는 시간에 친구와 함께 즐기는 놀이 자료입니다.</p>', '').replace('학년 쉬는 시간 스도쿠', '학년 스도쿠')  # 스도쿠 꼬리말 소개 줄 빼기(선생님 요청)
    s = re.sub(r'<title>[^<]*</title>', lambda m: m.group(0).replace('창의수학게임', '창의 수학').replace('교과수학게임', '교과수학'), s, count=1)
    return s

def cards(d):
    """방 메뉴의 카드 묶음(<div class="grid …"> 안쪽)을 꺼내 새 첫 화면 기준 주소로 고칩니다."""
    o = f'project/{d}/index.html'
    s = (ROOT / o).read_text(encoding='utf-8')
    a = s.index('<div class="grid'); a = s.index('>', a) + 1
    b = s.index('<footer', a); b = s.rindex('</div>', a, b)
    g = relink(s[a:b].strip(), o, 'index.html').replace('쉬는 시간 › 스도쿠 방으로 가요', '학년마다 30문제')
    if 'class="card room' not in g: WARN.append(f'{o}: 카드를 찾지 못했습니다')
    return g

def home():
    s = (ROOT / 'project/creative/index.html').read_text(encoding='utf-8')   # 메뉴 디자인이 입혀진 틀
    a = s.index('<nav class="crumb"'); b = s.index('<footer', a)
    secs = ''.join(f'<h2 class="sec-h">{LABEL.get(d, nm)}</h2>\n<div class="grid g3 three">\n{cards(d)}\n</div>\n' for d, nm in ROOMS)
    top = (f'<style>.sec-h{{margin:30px 0 12px;font-size:clamp(22px,2.4vw,28px);font-weight:800;letter-spacing:-.01em;display:flex;align-items:center;gap:10px}}'
           '.sec-h::after{content:"";flex:1;height:2px;background:var(--line)}</style>\n'
           f'<h1><span class="h-ico" aria-hidden="true">🎮</span>{NAME}</h1>\n'
           '<p class="sub">생각하는 힘을 기르는 퍼즐과, 학년별 계산을 게임으로 익히는 자료예요. 골라 열어 보세요.</p>\n'
           + secs +
           '<p class="sub" style="margin-top:28px">더 많은 수업 자료는 초등교사 홍지희의 자료실에 있어요.</p>\n')
    s = s[:a] + top + s[b:]
    s = re.sub(r'<meta name="description"[^>]*>\n?', '', s)
    s = re.sub(r'<title>[^<]*</title>', lambda m: f'<title>{NAME}</title>\n' + HEAD, s, count=1)
    s = re.sub(r'<footer class="hjfoot"><p>[^<]*</p>(<p>만든 사람)', r'<footer class="hjfoot">\1', s)
    return s

def esc(t):
    return t.replace('&', '&amp;').replace('"', '&quot;').replace('<', '&lt;')

def share(s, url):
    """탭 제목 끝에 ' | 초등교사 홍지희'를 붙이고, 카카오톡·밴드 미리보기(Open Graph) 정보를 넣습니다."""
    m = re.search(r'<title>([^<]*)</title>', s)
    title = m.group(1) if m.group(1).endswith(TAIL) else m.group(1) + TAIL
    s = s[:m.start()] + f'<title>{title}</title>' + s[m.end():]
    d = re.search(r'<meta name="description" content="([^"]*)"', s)
    desc = d.group(1) if d else DESC
    og = (f'\n<meta property="og:type" content="website"><meta property="og:site_name" content="{NAME}">'
          f'<meta property="og:locale" content="ko_KR"><meta property="og:url" content="{url}">'
          f'<meta property="og:title" content="{esc(title)}"><meta property="og:description" content="{desc}">'
          f'<meta property="og:image" content="{SITE}og.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">'
          f'<meta name="twitter:card" content="summary_large_image">')
    i = s.index('</title>') + len('</title>')
    return s[:i] + og + s[i:]

def main(out):
    out = pathlib.Path(out)
    srcs = [(f'project/{d}', d) for d, _ in ROOMS] + list(EXTRA.items())
    # 출력 폴더의 하위 폴더를 모두 지우고 새로 만듦(방이 없어지면 사라지게). 숨김 폴더(.git, .github)는 그대로.
    for p in out.iterdir() if out.exists() else []:
        if p.is_dir() and not p.name.startswith('.'): shutil.rmtree(p)
    for src, _ in srcs:
        for f in sorted((ROOT / src).rglob('*.html')):
            o = f.relative_to(ROOT).as_posix(); n = newpath(o)
            dst = out / n if n != 'index.html' else out / src.split('/')[-1] / 'index.html'
            dst.parent.mkdir(parents=True, exist_ok=True)
            if n == 'index.html':   # 방 메뉴 → 첫 화면으로 넘김(옛 주소용)
                dst.write_text(REDIRECT.format(home=posixpath.relpath('index.html', dst.parent.relative_to(out).as_posix())), encoding='utf-8')
                continue
            t = f.read_text(encoding='utf-8')
            if 'http-equiv="refresh"' in t:   # 원래 자료실의 옛 주소 안내 페이지는 주소만 고쳐 그대로
                dst.write_text(relink(t, o, n), encoding='utf-8'); continue
            t = share(fix_text(relink(crumb(t, o), o, n)), SITE + n)
            dst.write_text(t, encoding='utf-8')
    (out / 'index.html').write_text(share(home(), SITE), encoding='utf-8')
    (out / '.nojekyll').write_text('', encoding='utf-8')
    shutil.copy2(pathlib.Path(__file__).with_name('og.png'), out / 'og.png')  # 미리보기 그림(원본 og.html을 1200×630으로 찍은 것)
    # 검색 사이트에 낼 사이트맵(첫 화면으로 넘기기만 하는 안내 페이지는 뺌)
    urls = [SITE] + [SITE + f.relative_to(out).as_posix() for f in sorted(out.rglob('*.html'))
                     if f != out / 'index.html' and 'http-equiv="refresh"' not in f.read_text(encoding='utf-8')]
    (out / 'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + ''.join(f'<url><loc>{u}</loc></url>\n' for u in urls) + '</urlset>\n', encoding='utf-8')
    # 남은 링크 점검(href와 "f": 둘 다)
    bad = []
    for f in out.rglob('*.html'):
        if '.git' in f.parts: continue
        s = f.read_text(encoding='utf-8')
        refs = set(re.findall(r'href=["\']([\w\-./]+\.html)["\']', s))
        refs |= set(re.findall(r'["\']f["\']\s*:\s*["\']([\w\-./]+\.html)["\']', s))
        bad += [f'{f.relative_to(out)} → {r}' for r in refs if not (f.parent / r).resolve().exists()]
    for w in sorted(set(WARN)): print('[알림] ' + w)
    if bad:
        print('[문제] 깨진 링크:\n  ' + '\n  '.join(sorted(bad))); sys.exit(1)
    print(f'완료: {out} (수학 방 {", ".join(nm for _, nm in ROOMS)} · html {len(list(out.rglob("*.html")))}개)')

if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'out')
