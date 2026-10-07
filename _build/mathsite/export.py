#!/usr/bin/env python3
"""'초등교사 홍지희의 초등 수학 게임' 따로 사이트(저장소 hongjihee1005/math-game)를 만듭니다.

    python3 _build/mathsite/export.py 출력폴더

이 저장소의 project/creative/(창의수학게임)·project/mathgame/(교과수학게임)을 그대로 복사하고
링크·제목만 새 사이트에 맞게 바꿉니다. 첫 화면은 project/index.html(기타 메뉴)에서 두 카드만 남겨 만듭니다.
math-game 저장소의 Actions가 한 시간마다 이 스크립트를 돌려, 바뀐 것이 있으면 올립니다(원본은 늘 이 저장소).
여러 번 실행해도 같은 결과가 나옵니다.
"""
import pathlib, re, shutil, sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
MAIN = 'https://hongjihee1005.github.io/hong_teacher/'
NAME = '초등교사 홍지희의 초등 수학 게임'
DIRS = ('creative', 'mathgame')
SEP = re.compile(r'<svg class="c-sep".*?</svg><a class="c-link" href="\.\./index\.html">기타</a>', re.S)

def fix_page(s):
    s = s.replace(' · 기타 · 초등교사 홍지희', ' · ' + NAME)
    s = SEP.sub('', s)                                   # 위치 표시줄에서 '› 기타' 빼기
    s = s.replace('href="../../index.html"', 'href="../index.html"')   # 홈 → 새 사이트 첫 화면
    s = s.replace('href="../../break/', f'href="{MAIN}break/')          # 스도쿠는 원래 사이트로
    return s

def home():
    s = (ROOT / 'project/index.html').read_text(encoding='utf-8')
    rws = re.findall(r'<div class="rw" data-hj="1"><a class="card room"[^>]*href="(?:creative|mathgame)/index\.html".*?</div></div>', s, re.S)
    assert len(rws) == 2, '기타 메뉴에서 창의수학게임·교과수학게임 카드를 찾지 못했습니다'
    body = '\n'.join(r.replace('href="creative/../../break/', f'href="{MAIN}break/') for r in rws)
    a, b = s.index('<nav class="crumb"'), s.index('<div class="grid', s.index('<nav class="crumb"'))
    end = s.index('</div></div>\n</div>', b) + len('</div></div>\n</div>')
    top = (f'<h1><span class="h-ico" aria-hidden="true">🎮</span>{NAME}</h1>\n'
           '<p class="sub">생각하는 힘을 기르는 창의수학게임과, 학년별 계산을 게임으로 익히는 교과수학게임이에요. '
           '골라 열어 보세요. 오른쪽 위 ⌄ 단추를 누르면 안의 메뉴가 펼쳐져요.</p>\n'
           '<style>.grid.four.two{grid-template-columns:repeat(2,minmax(0,1fr))}'
           '@media(max-width:560px){.grid.four.two{grid-template-columns:1fr}}</style>\n'
           f'<div class="grid four two">\n{body}\n</div>\n'
           f'<p class="sub" style="margin-top:28px">더 많은 수업 자료는 <a href="{MAIN}" style="color:inherit;font-weight:700">초등교사 홍지희 자료실</a>에 있어요.</p>')
    s = s[:a] + top + s[end:]
    s = re.sub(r'<title>[^<]*</title>', f'<title>{NAME}</title>', s)
    s = re.sub(r'<p>[^<]*</p>(<p>만든 사람)', r'\1', s)   # '기타' 소개 줄이 꼬리말에 있으면 빼기
    return s

def main(out):
    out = pathlib.Path(out)
    for d in DIRS:
        dst = out / d
        if dst.exists(): shutil.rmtree(dst)
        dst.mkdir(parents=True)
        for f in sorted((ROOT / 'project' / d).glob('*.html')):
            (dst / f.name).write_text(fix_page(f.read_text(encoding='utf-8')), encoding='utf-8')
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
