#!/usr/bin/env python3
"""주소 맨 앞 https://hongjihee1005.github.io/ (저장소 hongjihee1005/hongjihee1005.github.io) 첫 화면을 만듭니다.

    python3 _build/rootsite/build.py 출력폴더

- 네이버 서치어드바이저는 사이트를 호스트 단위(https://hongjihee1005.github.io)로만 받아서, 소유 확인 태그가 이 첫 화면에 있어야 합니다(지우지 마세요).
- 첫 화면은 '초등교사 홍지희 자료실'(hong_teacher)과 '초등 수학 게임'(math-game)으로 가는 카드 두 장입니다.
- robots.txt로 두 사이트의 사이트맵을 알려 줍니다(robots.txt는 호스트 맨 앞에만 둘 수 있음).
- 이 저장소에 같은 이름의 폴더(hong_teacher/, math-game/)를 만들면 그 사이트가 가려지니 만들지 마세요.
"""
import pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
HOST = 'https://hongjihee1005.github.io/'
NAVER = 'f2909b036dad06e0260e48b85281cadd0a734a9f'
DESC = '초등교사 홍지희의 수업 자료실과 초등 수학 게임'

def page():
    s = (ROOT / 'project/creative/index.html').read_text(encoding='utf-8')   # 메뉴 디자인이 입혀진 틀
    a = s.index('<nav class="crumb"'); b = s.index('<footer', a)
    body = ('<h1><span class="h-ico" aria-hidden="true">🍎</span>초등교사 홍지희</h1>\n'
            '<p class="sub">수업 자료와 수학 게임을 골라 열어 보세요.</p>\n'
            '<div class="grid g3 three" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr))">\n'
            '<a class="card room" style="--acc:#C9463B" href="hong_teacher/"><span class="ico">🎒</span><span class="nm">초등교사 홍지희 자료실</span>'
            '<small>학년별 국어·수학·사회·과학 수업 자료, 공통 자료, 쉬는 시간 놀이</small></a>\n'
            '<a class="card room" style="--acc:#E8663D" href="math-game/"><span class="ico">🎮</span><span class="nm">초등 수학 게임</span>'
            '<small>창의 수학(마방진·칠교놀이·계산 스도쿠·하노이 탑·네모 로직·스도쿠) · 교과수학(1~6학년)</small></a>\n'
            '</div>\n')
    s = s[:a] + body + s[b:]
    head = (f'<title>초등교사 홍지희</title>\n'
            f'<meta name="naver-site-verification" content="{NAVER}">\n'   # 네이버 소유 확인(지우지 마세요)
            f'<meta name="description" content="{DESC}">\n<link rel="canonical" href="{HOST}">\n')
    s = re.sub(r'<meta name="description"[^>]*>\n?', '', s)
    s = re.sub(r'<title>[^<]*</title>\n?', lambda m: head, s, count=1)
    s = re.sub(r'<footer class="hjfoot"><p>[^<]*</p>(<p>만든 사람)', r'<footer class="hjfoot">\1', s)
    return s

def main(out):
    out = pathlib.Path(out); out.mkdir(parents=True, exist_ok=True)
    (out / 'index.html').write_text(page(), encoding='utf-8')
    (out / '.nojekyll').write_text('', encoding='utf-8')
    (out / 'robots.txt').write_text('User-agent: *\nAllow: /\n\n'
                                    f'Sitemap: {HOST}math-game/sitemap.xml\n', encoding='utf-8')
    print(f'완료: {out}')

if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'out')
