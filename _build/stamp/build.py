#!/usr/bin/env python3
"""기타 › 도장 만들기 페이지 만들기 (2026-10-09)

    python3 _build/stamp/build.py          # project/stamp/index.html (자료실 판) + _build/stamp/standalone/index.html (따로 쓰는 판)

원본은 stamp.html 한 장(프롬프트·이미지 파일 도구 전체). 자료실 판에는 연락처 줄·자료 목록·홈 단추를 넣고,
따로 쓰는 판(저장소 hongjihee1005/stamp-maker의 index.html)에는 꼬리말(설명·만든 사람·이메일·유튜브)과 검색·공유 정보(제목 끝 ' | 초등교사 홍지희', 설명, canonical, Open Graph og.png, JSON-LD, 구글 확인 GOOGLE)를 넣고
sitemap.xml·og.png도 standalone/에 함께 둡니다(stamp-maker의 sync.yml이 이 폴더를 통째로 가져감).
고친 뒤 루트에서 python3 _build/theme/apply_content_theme.py (자동 보완 run_all.py에도 들어 있음).
"""
import pathlib, re, shutil, datetime
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
OG = ROOT / '_build' / 'origami'
rd = lambda p: p.read_text(encoding='utf-8')

SRC = rd(HERE / 'stamp.html')
for mark in ('<!--HJ-HEAD-->', '<!--HJ-FOOT-->', '<!--HJ-HOME-->'):
    assert SRC.count(mark) == 1, mark

TOLIST = ('<script>(function(){var h=location.hostname,t=document.querySelector(".tolist");'
          'if(t&&(location.protocol==="file:"||/github\\.io$/.test(h)||h==="localhost"||h==="127.0.0.1"))t.classList.add("on")})();</script>')
CREDIT_CSS = ('<style id="stamp-credit">.creditbar{display:flex;flex-direction:column;align-items:center;gap:6px;margin-top:28px}'
              '.tolist{display:none;align-items:center;gap:8px;font-weight:700;font-size:16px;text-decoration:none;color:var(--ink);'
              'border:1.5px solid var(--line);background:var(--card);border-radius:999px;padding:9px 18px}.tolist.on{display:inline-flex}</style>')

FOOT = rd(OG / 'foot.html').replace('쉬는 시간에 친구와 함께 즐기는 종이접기 자료입니다.',
                                   '도장 그림을 만들 때 쓰는 프롬프트 + 이미지 파일 제작 도구입니다.')
# 수업 자료 덮개는 보통 연락처 줄을 숨기지만, 이 도구는 보이게(선생님 요청 2026-10-09)
SHOW_CONTACT = '<style id="stamp-contact">html body:not(.mix) .creditbar .hj-contact{display:flex!important}</style>'
hong = (SRC.replace('<!--HJ-HEAD-->', rd(OG / 'head_snip.html') + CREDIT_CSS)
           .replace('<!--HJ-FOOT-->', '<div class="creditbar"><a class="tolist" href="../index.html">📋 자료 목록으로</a>' + FOOT + '</div>' + SHOW_CONTACT)
           .replace('<!--HJ-HOME-->', rd(OG / 'home.html').replace('{HOME}', '../../index.html') + TOLIST))
alone = (SRC.replace('<!--HJ-HEAD-->', rd(OG / 'head_snip.html') + CREDIT_CSS)
            .replace('<!--HJ-FOOT-->', '<div class="creditbar">' + FOOT + '</div>')
            .replace('<!--HJ-HOME-->\n', ''))
# --- 따로 쓰는 판: 검색(구글·네이버)·공유(카카오톡·밴드) 정보 (2026-10-09)
SITE = 'https://hongjihee1005.github.io/stamp-maker/'
GOOGLE = 'gkDyhzWKxyJcx07mGzqlgNcSb6hh2qFh4VKAtkQgIUE'   # 구글 Search Console 'HTML 태그' 소유 확인 값(content="…" 안쪽). 넣은 뒤에는 지우지 마세요(지우면 확인이 풀림)
TITLE = '도장 프롬프트 만들기 | 초등교사 홍지희'
DESC = ('초등교사 홍지희가 만든 도장 만들기 도구 — 이름 도장·칭찬 도장·학급 도장·확인 도장·사진으로 도장을 고르기만 하면 '
        'ChatGPT·Gemini에 넣을 프롬프트와 PNG·SVG 도장 이미지 파일을 만들어요.')
SEO = ((f'<meta name="google-site-verification" content="{GOOGLE}">\n' if GOOGLE else '')
       + f'<meta name="author" content="초등교사 홍지희">\n<link rel="canonical" href="{SITE}">\n'
       + '<meta property="og:type" content="website"><meta property="og:site_name" content="도장 프롬프트 만들기">'
       + f'<meta property="og:locale" content="ko_KR"><meta property="og:url" content="{SITE}">'
       + f'<meta property="og:title" content="{TITLE}"><meta property="og:description" content="{DESC}">'
       + f'<meta property="og:image" content="{SITE}og.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">'
       + '<meta name="twitter:card" content="summary_large_image">\n'
       + '<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebApplication","name":"도장 프롬프트 만들기",'
       + '"alternateName":["도장 만들기","도장 프롬프트","초등교사 홍지희 도장 만들기"],"url":"' + SITE + '","inLanguage":"ko",'
       + '"applicationCategory":"DesignApplication","operatingSystem":"Web","isAccessibleForFree":true,'
       + '"offers":{"@type":"Offer","price":"0","priceCurrency":"KRW"},"description":"' + DESC + '",'
       + '"author":{"@type":"Person","name":"홍지희","jobTitle":"초등교사","url":"https://www.youtube.com/@hongjihee1005"}}</script>\n')
alone = alone.replace('<title>도장 프롬프트 만들기</title>', f'<title>{TITLE}</title>\n' + SEO, 1)
alone = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{DESC}">', alone, count=1)
assert TITLE in alone and 'og:image' in alone

assert '종이접기' not in hong and '<!--HJ-' not in hong + alone

out = ROOT / 'project' / 'stamp' / 'index.html'
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(hong, encoding='utf-8')
(HERE / 'standalone').mkdir(exist_ok=True)
(HERE / 'standalone' / 'index.html').write_text(alone, encoding='utf-8')
shutil.copy2(HERE / 'og.png', HERE / 'standalone' / 'og.png')   # 공유 미리보기 그림(원본 og.html을 1200×630으로 찍은 것)
(HERE / 'standalone' / 'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n'
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    f'<url><loc>{SITE}</loc></url>\n</urlset>\n', encoding='utf-8')  # robots.txt는 주소 맨 앞(hongjihee1005.github.io)에만 둘 수 있어 여기엔 두지 않음
print('도장 만들기: project/stamp/index.html, _build/stamp/standalone/index.html')
