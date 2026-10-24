#!/usr/bin/env python3
"""4학년 과학 교과서 버전 목록(../sem1/index.html, ../sem2/index.html — src2/가 있으면).
3학년 1학기 과학 목록을 틀로 쓰고 카드만 src/의 머리 주석(title·lesson)으로 만든다.
만든 뒤 루트에서 python3 _build/theme/apply_theme.py grade4/science/sem1/index.html"""
import html, os, re, sys

B = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, B)
from build import parse, keys, UNITS_BY, SRC as SRCDIR  # noqa: E402

TPL = os.path.join(B, '..', '..', '..', 'grade3', 'science', 'sem1', 'index.html')
EMO_BY = {1: {1: '🧲', 2: '💧', 3: '🌋', 4: '🍄'}, 2: {1: '🔬', 2: '🌿', 3: '🎈', 4: '🌍'}}
HONG = ('<p class="sub" style="margin-top:-4px">🧑‍🏫 실험·탐구 중심 수업은 '
        '<a href="../sem{s}-hong/index.html">{s}학기 · 홍지희 선생님 버전</a>에 있어요.</p>')


def main(sem=1):
    UNITS, EMO = UNITS_BY[sem], EMO_BY[sem]
    OUT = os.path.join(B, '..', 'sem%d' % sem, 'index.html')
    s = open(TPL, encoding='utf-8').read()
    s = re.sub(r'<!--hj-theme-js-->.*?<!--/hj-theme-js-->', '', s, flags=re.S)
    s = s.replace('>3학년</a>', '>4학년</a>')
    s = re.sub(r'<title>[^<]*</title>', '<title>4학년 %d학기 과학</title>' % sem, s)
    s = s.replace('aria-current="page">1학기<', 'aria-current="page">%d학기<' % sem).replace('과학방 · 1학기', '과학방 · %d학기' % sem)
    s = s.replace('3학년 1학기 과학 · 차시에 맞는 앱을 눌러 탐구해 보세요.', '4학년 %d학기 과학 · 차시에 맞는 앱을 눌러 탐구해 보세요.' % sem)
    by = {}
    for k in keys(sem):
        meta = parse(os.path.join(B, SRCDIR[sem], k + '.html'))[0]
        by.setdefault(int(meta['unit']), []).append((int(k.split('-')[1]), k, meta))
    parts = []
    for u in sorted(UNITS):
        name = UNITS[u][0]
        if u not in by:
            parts.append(f'<h2>{EMO[u]} {name}</h2>\n<p class="sub">곧 열려요.</p>')
            continue
        cards = ''.join(
            f'<a class="card sci" href="{k}.html"><span class="tag">{html.escape(m["lesson"])}차시</span>'
            f'<span class="nm">{html.escape(m["title"])}</span></a>\n'
            for _, k, m in sorted(by[u]))
        parts.append(f'<h2>{EMO[u]} {name}</h2>\n<div class="grid">\n{cards}</div>')
    a = s.index('<h2>')
    b = s.index('<footer')
    s = s[:a] + (HONG.format(s=sem) if os.path.isdir(os.path.join(B, '..', 'sem%d-hong' % sem)) else '') + '\n' + '\n'.join(parts) + '\n' + s[b:]
    open(OUT, 'w', encoding='utf-8').write(s)
    print('만듦', OUT, sum(len(v) for v in by.values()), '개')


if __name__ == '__main__':
    for sem in (1, 2):
        if keys(sem):
            main(sem)
