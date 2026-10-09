#!/usr/bin/env python3
"""기타 › 도장 만들기 페이지 만들기 (2026-10-09)

    python3 _build/stamp/build.py          # project/stamp/index.html (자료실 판) + _build/stamp/standalone/index.html (따로 쓰는 판)

원본은 stamp.html 한 장(프롬프트·이미지 파일 도구 전체). 자료실 판에는 연락처 줄·자료 목록·홈 단추를 넣고,
따로 쓰는 판(저장소 hongjihee1005/stamp-maker의 index.html)에는 꼬리말(설명·만든 사람·이메일·유튜브)만 넣습니다.
고친 뒤 루트에서 python3 _build/theme/apply_content_theme.py (자동 보완 run_all.py에도 들어 있음).
"""
import pathlib
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
assert '종이접기' not in hong and '<!--HJ-' not in hong + alone

out = ROOT / 'project' / 'stamp' / 'index.html'
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(hong, encoding='utf-8')
(HERE / 'standalone').mkdir(exist_ok=True)
(HERE / 'standalone' / 'index.html').write_text(alone, encoding='utf-8')
print('도장 만들기: project/stamp/index.html, _build/stamp/standalone/index.html')
