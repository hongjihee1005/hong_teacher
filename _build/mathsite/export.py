#!/usr/bin/env python3
"""'초등 수학 게임' 따로 사이트(저장소 hongjihee1005/math-game)를 만듭니다.

    python3 _build/mathsite/export.py 출력폴더

이 저장소의 project/creative/(창의수학게임)·project/mathgame/(교과수학게임)을 그대로 복사하고
링크·제목만 새 사이트에 맞게 바꿉니다. 첫 화면은 '창의 수학'(게임 카드)·'교과수학'(1~6학년 카드) 두 묶음이고,
카드는 project/creative/index.html·project/mathgame/index.html에서 그대로 가져옵니다(하위 메뉴 페이지는 없고, 옛 주소는 첫 화면으로 넘김).
math-game 저장소의 Actions가 한 시간마다 이 스크립트를 돌려, 바뀐 것이 있으면 올립니다(원본은 늘 이 저장소).
여러 번 실행해도 같은 결과가 나옵니다.
"""
import pathlib, re, shutil, sys

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
DIRS = {'creative': 'project/creative', 'mathgame': 'project/mathgame', 'sudoku': 'break/sudoku'}  # 새 사이트 폴더: 원본 폴더
MENU = {'sudoku'}  # 메뉴 페이지(index.html)를 그대로 두는 폴더(나머지는 첫 화면으로 넘김)
SEP = re.compile(r'<svg class="c-sep".*?</svg><a class="c-link" href="\.\./index\.html">[^<]*</a>', re.S)
REDIRECT = ('<!doctype html><html lang="ko"><head><meta charset="utf-8">'
            '<meta http-equiv="refresh" content="0; url=../index.html"><title>' + NAME + '</title></head>'
            '<body><p><a href="../index.html">' + NAME + ' 첫 화면으로 가기</a></p></body></html>\n')

def fix_page(s):
    s = s.replace(' · 기타 · 초등교사 홍지희', ' · ' + NAME).replace(' · 쉬는 시간 · 초등교사 홍지희', ' · 창의 수학 · ' + NAME)
    s = s.replace('학년 교과수학게임 · ', '학년 · 교과수학 · ').replace('학년 교과수학게임', '학년')                        # '3학년 교과수학게임' → '3학년'
    s = s.replace('<p>쉬는 시간에 친구와 함께 즐기는 놀이 자료입니다.</p>', '').replace('학년 쉬는 시간 스도쿠', '학년 스도쿠')  # 스도쿠 꼬리말 소개 줄 빼기(선생님 요청)
    s = SEP.sub('', s)                                                 # 위치 표시줄에서 '› 쉬는 시간' 빼기
    s = s.replace('href="../../break/sudoku/', 'href="../sudoku/')    # 스도쿠도 새 사이트 안으로
    s = re.sub(r'<title>[^<]*</title>', lambda m: m.group(0).replace('창의수학게임', '창의 수학').replace('교과수학게임', '교과수학'), s, count=1)
    s = s.replace('href="../../index.html"', 'href="../index.html"')   # 홈 → 새 사이트 첫 화면
    return s

def fix_game(s):  # 목록 페이지가 없는 폴더: '자료 목록으로'도 첫 화면으로
    return fix_page(s).replace('class="tolist" href="index.html"', 'class="tolist" href="../index.html"')

def cards(rel):
    """원래 메뉴 페이지의 카드 묶음(<div class="grid …"> 안쪽)을 꺼내 첫 화면 기준 주소로 고칩니다."""
    s = (ROOT / rel).read_text(encoding='utf-8')
    a = s.index('<div class="grid'); a = s.index('>', a) + 1
    b = s.index('<footer', a); b = s.rindex('</div>', a, b)
    d = rel.split('/')[1]
    g = s[a:b].strip()
    g = re.sub(r'href="(?!https?:|mailto:|#)([^"]+)"', lambda m: f'href="{d}/{m.group(1)}"', g)
    g = g.replace(f'href="{d}/../../break/sudoku/', 'href="sudoku/').replace('쉬는 시간 › 스도쿠 방으로 가요', '학년마다 30문제')  # 스도쿠도 새 사이트 안으로
    assert g.count('class="card room') >= 6, rel + ': 카드를 찾지 못했습니다'
    return g

def home():
    s = (ROOT / 'project/creative/index.html').read_text(encoding='utf-8')   # 메뉴 디자인이 입혀진 틀
    a = s.index('<nav class="crumb"'); b = s.index('<footer', a)
    top = (f'<style>.sec-h{{margin:30px 0 12px;font-size:clamp(22px,2.4vw,28px);font-weight:800;letter-spacing:-.01em;display:flex;align-items:center;gap:10px}}'
           '.sec-h::after{content:"";flex:1;height:2px;background:var(--line)}</style>\n'
           f'<h1><span class="h-ico" aria-hidden="true">🎮</span>{NAME}</h1>\n'
           '<p class="sub">생각하는 힘을 기르는 퍼즐과, 학년별 계산을 게임으로 익히는 자료예요. 골라 열어 보세요.</p>\n'
           f'<h2 class="sec-h">창의 수학</h2>\n<div class="grid g3 three">\n{cards("project/creative/index.html")}\n</div>\n'
           f'<h2 class="sec-h">교과수학</h2>\n<div class="grid g3 three">\n{cards("project/mathgame/index.html")}\n</div>\n'
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
    for d, src in DIRS.items():
        dst = out / d
        if dst.exists(): shutil.rmtree(dst)
        dst.mkdir(parents=True)
        for f in sorted((ROOT / src).glob('*.html')):
            t = f.read_text(encoding='utf-8')
            if d in MENU: t = fix_page(t)
            elif f.name == 'index.html': t = REDIRECT  # 하위 메뉴 없음 → 옛 주소는 첫 화면으로
            else: t = fix_game(t)
            if t is not REDIRECT: t = share(t, SITE + f'{d}/{f.name}')
            (dst / f.name).write_text(t, encoding='utf-8')
    (out / 'index.html').write_text(share(home(), SITE), encoding='utf-8')
    shutil.copy2(pathlib.Path(__file__).with_name('og.png'), out / 'og.png')  # 미리보기 그림(원본 og.html을 1200×630으로 찍은 것)
    (out / '.nojekyll').write_text('', encoding='utf-8')
    # 검색 사이트에 낼 사이트맵(첫 화면으로 넘기기만 하는 안내 페이지는 뺌)
    urls = [SITE] + [SITE + f.relative_to(out).as_posix() for f in sorted(out.glob('*/*.html')) if 'http-equiv="refresh"' not in f.read_text(encoding='utf-8')]
    (out / 'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + ''.join(f'<url><loc>{u}</loc></url>\n' for u in urls) + '</urlset>\n', encoding='utf-8')
    # 남은 링크 점검(href와 "f": 둘 다)
    bad = []
    for f in out.rglob('*.html'):
        s = f.read_text(encoding='utf-8')
        refs = set(re.findall(r'href=["\']([\w\-./]+\.html)["\']', s))
        refs |= set(re.findall(r'["\']f["\']\s*:\s*["\']([\w\-./]+\.html)["\']', s))
        bad += [f'{f.relative_to(out)} → {r}' for r in refs if not (f.parent / r).resolve().exists()]
    if bad:
        print('[문제] 깨진 링크:\n  ' + '\n  '.join(sorted(bad))); sys.exit(1)
    print(f'완료: {out} (html {len(list(out.rglob("*.html")))}개)')

if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'out')
