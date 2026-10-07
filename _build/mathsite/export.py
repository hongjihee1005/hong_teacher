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
    s = re.sub(r'<title>[^<]*</title>', f'<title>{NAME}</title>', s)
    s = re.sub(r'<footer class="hjfoot"><p>[^<]*</p>(<p>만든 사람)', r'<footer class="hjfoot">\1', s)
    return s

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
            (dst / f.name).write_text(t, encoding='utf-8')
    (out / 'index.html').write_text(home(), encoding='utf-8')
    (out / '.nojekyll').write_text('', encoding='utf-8')
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
