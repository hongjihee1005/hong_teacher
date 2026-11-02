# -*- coding: utf-8 -*-
"""5-2 수학 6. 평균과 가능성 활동지(교과서 차시 버전·이야기 버전 × 기본형·도전형) 만들기

    python3 gen_u6-avg.py

앱 원본 ../units/sem2/u6-avg.tb.js('마을 연합 송년 잔치', 10차시)와 u6-avg.st.js('우리 반 학급 운동회 준비', 10차시)의
차시 번호·제목·S.O.O.P.·탐구 질문·이야기·수를 그대로 따릅니다.

  - 평균·합계·모르는 자룟값·한 사람당 양은 모두 이 스크립트가 분수(Fraction)로 계산하고 assert로 확인합니다.
  - 가능성(0 · 1/2 · 1, 다섯 가지 말)은 주머니의 개수·회전판의 넓이·주사위 눈·수 카드를 세어 분수로 구한 뒤 말로 바꿉니다.
  - 막대그래프·꺾은선그래프·쌓기나무·○·종이띠·주머니·회전판·가능성 띠·주사위는 SVG로 그려 임시 폴더에서 PNG로 바꿉니다
    (저장소에는 남기지 않음).
  - 동전·주사위 실험 차시는 학생이 채우는 기록표를 주고, 교사용 정답 쪽에는 '예시'만 적습니다(정해진 답 없음).
"""
import os
import random
import shutil
import sys
import tempfile
from fractions import Fraction as F
import math

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from hwpxgen import Sheet, svg_to_png, check  # noqa: E402

ROOT = os.path.normpath(os.path.join(HERE, '..', '..'))      # grade5/math
OUT_TB = os.path.join(ROOT, 'sem2', 'sheets')
OUT_ST = os.path.join(ROOT, 'sem2-soop', 'sheets')
NAME = '6단원_평균과가능성_활동지_%s.hwpx'
FONT = "'Noto Sans KR','WenQuanYi Zen Hei',sans-serif"
NUM = '①②③④⑤⑥⑦'
SYM = '㉠㉡㉢㉣㉤㉥'
WORK = tempfile.mkdtemp(prefix='u6avg_')
_FIG = {}

GREEN, YEL, RED, BLUE, ORG = '#5DB66A', '#F2CC3B', '#E25C4B', '#4E8FD9', '#F08C2E'
WIN, LOSE = '#9C7BC7', '#BFE0F5'
INK = '#1D2A2A'
W5 = ['불가능하다', '~아닐 것 같다', '반반이다', '~일 것 같다', '확실하다']
W3 = ['불가능하다', '반반이다', '확실하다']


# ================================================================ 계산
def avg(vals):
    vs = [F(str(v)) for v in vals]
    return sum(vs) / len(vs)


def total(vals):
    return sum(F(str(v)) for v in vals)


def fmt(x):
    """Fraction → '8', '150.1', '61.5'(유한소수만)."""
    x = F(x)
    if x.denominator == 1:
        return str(x.numerator)
    d = x.denominator
    k = 0
    while (10 ** k) % d:
        k += 1
        assert k < 6, x
    return ('%.' + str(k) + 'f') % float(x)


def frac_txt(x):
    x = F(x)
    return str(x.numerator) if x.denominator == 1 else '%d/%d' % (x.numerator, x.denominator)


def cat5(p):
    """가능성(0~1) → 다섯 가지 말 번호."""
    p = F(p)
    assert 0 <= p <= 1
    if p == 0:
        return 0
    if p == 1:
        return 4
    if p == F(1, 2):
        return 2
    return 1 if p < F(1, 2) else 3


def cat3(p):
    p = F(p)
    assert p in (0, F(1, 2), 1), p
    return {F(0): 0, F(1, 2): 1, F(1): 2}[p]


def prob(good, alln):
    return F(len(good), len(alln))


def L(xs):
    return ', '.join(str(x) for x in xs)


def josa(w, pair):
    s = str(w)
    c = s[-1]
    has = rieul = False
    if c.isdigit():
        has, rieul = c in '013678', c in '178'
    else:
        code = ord(c) - 0xAC00
        if 0 <= code <= 11171:
            j = code % 28
            has, rieul = j > 0, j == 8
    M = {'이가': ('이', '가'), '을를': ('을', '를'), '은는': ('은', '는'), '과와': ('과', '와'),
         '으로': ('으로', '로'), '이에요': ('이에요', '예요')}
    a, b = M[pair]
    if pair == '으로':
        return s + (a if has and not rieul else b)
    return s + (a if has else b)


def match_spinner(spins, counts):
    """결과 표(색별 횟수)와 가장 비슷한 회전판 번호(유일한지 확인)."""
    n = sum(counts)
    d = [sum((F(c) - f * n) ** 2 for c, f in zip(counts, sp)) for sp in spins]
    best = min(d)
    assert d.count(best) == 1
    return d.index(best)


def rank_order(names, probs):
    """가능성이 높은 것부터(같은 값 없음 확인)."""
    assert len(set(probs)) == len(probs)
    return [names[i] for i in sorted(range(len(names)), key=lambda i: -probs[i])]


# ================================================================ 그림
def fig(key, svg, px=1600):
    if key not in _FIG:
        _FIG[key] = svg_to_png(svg, os.path.join(WORK, key + '.png'), px)
    return _FIG[key]


def _svg(w, h, body):
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d"><rect width="%d" height="%d" fill="#fff"/>'
            '<g font-family="%s">%s</g></svg>' % (w, h, w, h, FONT, body))


def _t(x, y, s, size=24, anchor='middle', weight='normal', fill=INK):
    return ('<text x="%s" y="%s" font-size="%s" text-anchor="%s" font-weight="%s" fill="%s" '
            'dominant-baseline="middle">%s</text>' % (x, y, size, anchor, weight, fill, s))


def _half(x, y, size=24, fill=INK):
    """세로 분수 1/2."""
    return (_t(x, y - size * .55, '1', size, fill=fill) +
            '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="2"/>' % (x - size * .4, y, x + size * .4, y, fill) +
            _t(x, y + size * .6, '2', size, fill=fill))


def svg_bars(names, vals, vmax, step, title, cat, valax, unit, draw=True, lab_every=1, unknown=None, avgline=None):
    """세로 막대그래프(draw=False면 빈 눈금만 — 학생이 그림)."""
    n = len(names)
    cw = 120 if n <= 5 else 100
    x0, top, bot = 110, 90, 430
    W = x0 + n * cw + 40
    H = bot + 80
    k = vmax // step
    unit_h = (bot - top) / k
    b = [_t(W / 2, 30, title, 28, weight='bold'), _t(x0 - 40, top - 32, '%s(%s)' % (valax, unit), 20, anchor='start')]
    for i in range(k + 1):
        y = bot - i * unit_h
        b.append('<line x1="%d" y1="%.1f" x2="%d" y2="%.1f" stroke="#B9C8D6" stroke-width="%s"/>' % (x0, y, x0 + n * cw, y, 2 if i == 0 else 1.3))
        if i % lab_every == 0:
            b.append(_t(x0 - 14, y, str(i * step), 20, anchor='end'))
    b.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="2.5"/>' % (x0, top - 10, x0, bot, INK))
    b.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="2.5"/>' % (x0, bot, x0 + n * cw, bot, INK))
    for i, (nm, v) in enumerate(zip(names, vals)):
        cx = x0 + cw * i + cw / 2
        b.append(_t(cx, bot + 30, nm, 21))
        if draw and v is not None and i != unknown:
            hgt = F(v) / step * unit_h
            b.append('<rect x="%.1f" y="%.1f" width="%d" height="%.1f" fill="#9CC3EE" stroke="%s" stroke-width="2"/>' % (
                cx - 28, bot - float(hgt), 56, float(hgt), BLUE))
        if i == unknown:
            b.append(_t(cx, bot - 25, '?', 34, weight='bold', fill=RED))
    if avgline is not None:
        y = bot - float(F(avgline) / step * unit_h)
        b.append('<line x1="%d" y1="%.1f" x2="%d" y2="%.1f" stroke="%s" stroke-width="3" stroke-dasharray="10 6"/>' % (x0, y, x0 + n * cw, y, RED))
    b.append(_t(x0 + n * cw / 2, H - 15, cat, 20))
    return _svg(W, H, ''.join(b))


def svg_linegraph(names, vals, lo, hi, gs, title, unit):
    n = len(names)
    cw = 110
    x0, top, bot = 100, 80, 380
    W, H = x0 + n * cw + 30, bot + 70
    k = (hi - lo) // gs
    uh = (bot - 30 - top) / k
    b = [_t(W / 2, 28, title, 26, weight='bold'), _t(x0 - 10, top - 30, '(%s)' % unit, 20, anchor='end')]
    for i in range(k + 1):
        y = bot - 30 - i * uh
        b.append('<line x1="%d" y1="%.1f" x2="%d" y2="%.1f" stroke="#B9C8D6" stroke-width="1.3"/>' % (x0, y, x0 + n * cw, y))
        b.append(_t(x0 - 12, y, str(lo + i * gs), 20, anchor='end'))
    b.append(_t(x0 - 12, bot, '0', 20, anchor='end'))
    b.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="2.5"/>' % (x0, top - 10, x0, bot, INK))
    b.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="2.5"/>' % (x0, bot, x0 + n * cw, bot, INK))
    b.append('<path d="M%d %d l10 -6 l-20 -6 l10 -6" fill="none" stroke="%s" stroke-width="2.5"/>' % (x0, bot - 6, INK))   # 물결선
    pts = []
    for i, (nm, v) in enumerate(zip(names, vals)):
        cx = x0 + cw * i + cw / 2
        y = bot - 30 - (v - lo) / gs * uh
        pts.append((cx, y))
        b.append(_t(cx, bot + 28, nm, 20))
    b.append('<polyline points="%s" fill="none" stroke="%s" stroke-width="3"/>' % (' '.join('%.1f,%.1f' % p for p in pts), RED))
    for p in pts:
        b.append('<circle cx="%.1f" cy="%.1f" r="6" fill="%s"/>' % (p[0], p[1], RED))
    return _svg(W, H, ''.join(b))


def svg_stack(names, vals, item, title):
    """쌓기나무(block) 또는 ○(circle)로 나타낸 자료."""
    n = len(names)
    cw = 110
    sz = 34 if item == 'block' else 32
    vmax = max(vals)
    top = 70
    bot = top + vmax * (sz + 4) + 10
    W, H = n * cw + 40, bot + 60
    b = [_t(W / 2, 28, title, 24, weight='bold')]
    b.append('<line x1="20" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="2.5"/>' % (bot, W - 20, bot, INK))
    for i, (nm, v) in enumerate(zip(names, vals)):
        cx = 20 + cw * i + cw / 2
        for j in range(v):
            y = bot - (j + 1) * (sz + 4)
            if item == 'block':
                b.append('<rect x="%.1f" y="%.1f" width="%d" height="%d" fill="#F4D08A" stroke="#9A6B1E" stroke-width="2"/>' % (cx - sz / 2, y, sz, sz))
            else:
                b.append('<circle cx="%.1f" cy="%.1f" r="%d" fill="#fff" stroke="%s" stroke-width="3"/>' % (cx, y + sz / 2, sz / 2 - 2, BLUE))
        b.append(_t(cx, bot + 30, nm, 21))
    return _svg(W, H, ''.join(b))


def svg_strips(names, vals, unit, cells):
    """종이띠: 위는 자료별 띠, 아래는 이어 붙인 띠(학생이 등분 선을 그어요)."""
    tot = sum(vals)
    L0, LW = 190, 1000
    sc = LW / tot if cells else LW / max(vals) * .55
    rows = len(names)
    H = 70 + rows * 54 + 150
    W = L0 + LW + 40
    b = [_t(30, 30, '자료별 종이띠', 22, anchor='start', weight='bold')]
    for i, (nm, v) in enumerate(zip(names, vals)):
        y = 55 + i * 54
        b.append(_t(L0 - 15, y + 20, nm, 21, anchor='end'))
        w = v * sc
        b.append('<rect x="%d" y="%d" width="%.1f" height="40" fill="#E7F0FB" stroke="%s" stroke-width="2"/>' % (L0, y, w, BLUE))
        if cells:
            for c in range(1, v):
                b.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="%s" stroke-width="1"/>' % (L0 + c * sc, y, L0 + c * sc, y + 40, BLUE))
            for c in range(v):
                b.append('<circle cx="%.1f" cy="%d" r="11" fill="none" stroke="%s" stroke-width="2.5"/>' % (L0 + (c + .5) * sc, y + 20, ORG))
        else:
            b.append(_t(L0 + w + 12, y + 20, '%s%s' % (v, unit), 20, anchor='start'))
    y = 55 + rows * 54 + 40
    b.append(_t(30, y - 22, '이어 붙인 띠', 22, anchor='start', weight='bold'))
    jw = LW if cells else LW
    jsc = jw / tot
    b.append('<rect x="%d" y="%d" width="%d" height="46" fill="#FFF6DD" stroke="%s" stroke-width="2.5"/>' % (L0, y, jw, INK))
    acc = 0
    for v in vals[:-1]:
        acc += v
        b.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="%s" stroke-width="2.5"/>' % (L0 + acc * jsc, y, L0 + acc * jsc, y + 46, INK))
    acc = 0
    for v in vals:
        b.append(_t(L0 + (acc + v / 2) * jsc, y + 23, '%s' % v, 18))
        acc += v
    b.append(_t(L0, y + 70, '0', 18))
    b.append(_t(L0 + jw, y + 70, '모두 (\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0)%s' % unit, 18, anchor='end'))
    return _svg(W, H, ''.join(b))


def _ball(x, y, r, c, k):
    out = '<circle cx="%.1f" cy="%.1f" r="%d" fill="%s" stroke="#00000055" stroke-width="2"/>' % (x, y, r, c)
    if k:
        out += _t(x, y + 1, k, r * .9, fill='#fff' if c not in (YEL, '#F3D27A', '#F2D04B', '#B8C0C6', '#E0B43A', LOSE) else INK, weight='bold')
    return out


def svg_bags(bags, kind='bag'):
    """bags: [(이름, [(색, 글, 개수), …])]. 꺼낸 것은 다시 넣어요."""
    n = len(bags)
    cw = 250
    W, H = n * cw + 20, 290
    b = []
    for i, (nm, items) in enumerate(bags):
        cx = 10 + cw * i + cw / 2
        if kind == 'box':
            b.append('<rect x="%.1f" y="45" width="200" height="180" rx="10" fill="#FBF3E4" stroke="#9A6B1E" stroke-width="3"/>' % (cx - 100))
        else:
            b.append('<path d="M%.1f 60 Q%.1f 40 %.1f 60 L%.1f 210 Q%.1f 235 %.1f 210 Z" fill="#F3EEE6" stroke="#8C7A5B" stroke-width="3"/>' % (
                cx - 70, cx, cx + 70, cx + 95, cx, cx - 95))
            b.append('<path d="M%.1f 58 Q%.1f 70 %.1f 58" fill="none" stroke="#8C7A5B" stroke-width="3"/>' % (cx - 70, cx, cx + 70))
        balls = [(c, k) for c, k, m in items for _ in range(m)]
        per = 3
        for j, (c, k) in enumerate(balls):
            r_, q = divmod(j, per)
            cnt = min(per, len(balls) - r_ * per)
            x = cx + (q - (cnt - 1) / 2) * 52
            y = 105 + r_ * 50
            b.append(_ball(x, y, 22, c, k))
        if nm:
            b.append(_t(cx, 265, nm, 26, weight='bold'))
    return _svg(W, H, ''.join(b))


def svg_spinners(spins, r=90):
    """spins: [(이름, [(분수, 색, 글), …])] — 12시 방향부터 시계 방향."""
    n = len(spins)
    cw = 2 * r + 60
    W, H = n * cw + 20, 2 * r + 90
    b = []
    for i, (nm, secs) in enumerate(spins):
        cx, cy = 10 + cw * i + cw / 2, r + 20
        assert sum(F(f) for f, _, _ in secs) == 1
        a0 = F(0)
        for f, c, t in secs:
            f = F(f)
            a1 = a0 + f
            if f == 1:
                b.append('<circle cx="%.1f" cy="%.1f" r="%d" fill="%s" stroke="%s" stroke-width="2.5"/>' % (cx, cy, r, c, INK))
            else:
                p0 = (cx + r * math.sin(2 * math.pi * a0), cy - r * math.cos(2 * math.pi * a0))
                p1 = (cx + r * math.sin(2 * math.pi * a1), cy - r * math.cos(2 * math.pi * a1))
                large = 1 if f > F(1, 2) else 0
                b.append('<path d="M%.1f %.1f L%.1f %.1f A%d %d 0 %d 1 %.1f %.1f Z" fill="%s" stroke="%s" stroke-width="2.5"/>' % (
                    cx, cy, p0[0], p0[1], r, r, large, p1[0], p1[1], c, INK))
            mid = 2 * math.pi * float(a0 + f / 2)
            rr = r * (.66 if f < 1 else 0.0)
            b.append(_t(cx + rr * math.sin(mid), cy - rr * math.cos(mid) + (r * .45 if f == 1 else 0), t, 20,
                        weight='bold', fill='#fff' if c in (RED, BLUE, GREEN, WIN) else INK))
            a0 = a1
        b.append('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="%s" stroke-width="4" stroke-linecap="round"/>' % (cx, cy + 8, cx, cy - r * .28, INK))
        b.append('<path d="M%.1f %.1f l-8 13 l16 0 Z" fill="%s"/>' % (cx, cy - r * .38, INK))
        b.append('<circle cx="%.1f" cy="%.1f" r="7" fill="%s"/>' % (cx, cy, INK))
        if nm:
            b.append(_t(cx, 2 * r + 65, nm, 26, weight='bold'))
    return _svg(W, H, ''.join(b))


def svg_paint(k):
    r = 150
    W, H = 2 * r + 60, 2 * r + 60
    cx = cy = r + 30
    b = ['<circle cx="%d" cy="%d" r="%d" fill="#fff" stroke="%s" stroke-width="3"/>' % (cx, cy, r, INK)]
    for i in range(k):
        a = 2 * math.pi * i / k
        b.append('<line x1="%d" y1="%d" x2="%.1f" y2="%.1f" stroke="%s" stroke-width="2.5"/>' % (cx, cy, cx + r * math.sin(a), cy - r * math.cos(a), INK))
    b.append('<circle cx="%d" cy="%d" r="6" fill="%s"/>' % (cx, cy, INK))
    return _svg(W, H, ''.join(b))


def svg_scale(pos=5, nums=False, qmarks=False, boxes=True):
    """가능성 띠: 왼쪽 불가능하다(0) ~ 오른쪽 확실하다(1)."""
    x0, x1, y = 90, 1110, 120
    W, H = 1200, (340 if nums else 230) if boxes else (220 if nums or qmarks else 170)
    words = W5 if pos == 5 else W3
    xs = [x0 + (x1 - x0) * i / (len(words) - 1) for i in range(len(words))]
    b = ['<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="4"/>' % (x0, y, x1, y, INK),
         '<path d="M%d %d l-18 -10 l0 20 Z" fill="%s"/>' % (x1 + 22, y, INK)]
    b.append(_t(x0 + 50, 30, '가능성이 낮아요', 18, fill='#6B7A86'))
    b.append(_t(x1 - 50, 30, '가능성이 높아요', 18, fill='#6B7A86'))
    for i, (x, w) in enumerate(zip(xs, words)):
        b.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="%s" stroke-width="4"/>' % (x, y - 14, x, y + 14, INK))
        b.append(_t(x, y - 42, w, 23, weight='bold'))
        val = {0: '0', len(words) - 1: '1'}.get(i)
        mid = (len(words) - 1) / 2 == i
        if nums:
            if val:
                b.append(_t(x, y + 48, val, 28, weight='bold', fill=RED))
            elif mid:
                b.append(_half(x, y + 48, 26, RED))
        if qmarks and (val or mid):
            b.append('<rect x="%.1f" y="%d" width="60" height="44" rx="5" fill="#fff" stroke="%s" stroke-width="2.5"/>' % (x - 30, y + 28, RED))
            b.append(_t(x, y + 51, '?', 24, fill=RED))
        if boxes:
            yy = y + (95 if nums else 30)
            b.append('<rect x="%.1f" y="%d" width="150" height="58" rx="6" fill="#fff" stroke="#8795A1" stroke-width="2" stroke-dasharray="8 5"/>' % (x - 75, yy))
    return _svg(W, H, ''.join(b))


def svg_hbars(items, title):
    """[(글, 횟수, 색)] 가로 막대."""
    W, H = 900, 60 + len(items) * 50
    b = [_t(W / 2, 25, title, 22, weight='bold')]
    for i, (t, v, c) in enumerate(items):
        y = 55 + i * 50
        b.append(_t(110, y + 16, t, 21, anchor='end'))
        b.append('<rect x="125" y="%d" width="%d" height="32" fill="%s" stroke="#00000044"/>' % (y, v * 11, c))
        b.append(_t(135 + v * 11, y + 16, '%d번' % v, 20, anchor='start'))
    return _svg(W, H, ''.join(b))


PIPS = {1: [(0, 0)], 2: [(-1, -1), (1, 1)], 3: [(-1, -1), (0, 0), (1, 1)], 4: [(-1, -1), (1, -1), (-1, 1), (1, 1)],
        5: [(-1, -1), (1, -1), (0, 0), (-1, 1), (1, 1)], 6: [(-1, -1), (1, -1), (-1, 0), (1, 0), (-1, 1), (1, 1)]}


def svg_dice():
    W, H = 6 * 110 + 20, 130
    b = []
    for v in range(1, 7):
        x = 20 + (v - 1) * 110
        b.append('<rect x="%d" y="20" width="90" height="90" rx="14" fill="#fff" stroke="%s" stroke-width="3"/>' % (x, INK))
        for dx, dy in PIPS[v]:
            b.append('<circle cx="%d" cy="%d" r="8" fill="%s"/>' % (x + 45 + dx * 24, 65 + dy * 24, RED if v == 1 else INK))
    return _svg(W, H, ''.join(b))


def svg_coin():
    W, H = 420, 180
    b = []
    for i, t in enumerate(['그림면', '숫자 면']):
        cx = 105 + i * 210
        b.append('<circle cx="%d" cy="80" r="62" fill="#E9D49A" stroke="#9A7B2E" stroke-width="4"/>' % cx)
        b.append('<circle cx="%d" cy="80" r="50" fill="none" stroke="#9A7B2E" stroke-width="2"/>' % cx)
        if i == 0:
            b.append('<path d="M%d 105 l0 -30 m0 0 q-18 -6 -14 -26 q14 4 14 26 q0 -22 14 -26 q4 20 -14 26" fill="none" stroke="#6B551E" stroke-width="4"/>' % cx)
        else:
            b.append(_t(cx, 82, '500', 34, weight='bold', fill='#6B551E'))
        b.append(_t(cx, 165, t, 22))
    return _svg(W, H, ''.join(b))


def svg_board(lines, title):
    W, H = 1000, 90 + len(lines) * 50
    b = ['<rect x="10" y="10" width="980" height="%d" rx="12" fill="#2F5D4A" stroke="#8B6A3E" stroke-width="10"/>' % (H - 20),
         _t(W / 2, 50, title, 28, weight='bold', fill='#fff')]
    for i, t in enumerate(lines):
        b.append(_t(60, 100 + i * 50, '· ' + t, 24, anchor='start', fill='#F4F1E8'))
    return _svg(W, H, ''.join(b))


# ================================================================ 공통 활동 조각
def step(s, i, label, sub=None):
    s.step('%s %s' % (NUM[i], label), sub)


def opt(*o):
    return '( ' + ' / '.join(o) + ' )'


def ch(lv, opts, width=14):
    """기본형은 고르기, 도전형은 빈칸."""
    return opt(*opts) if lv == '기본형' else '(' + ' ' * width + ')'


def qa(s, items, col=(120, 60)):
    """(질문, 답, 단위) 표. 정답 글 목록."""
    rows, ans = [], []
    for it in items:
        q, a = it[0], it[1]
        unit = it[2] if len(it) > 2 else ''
        rows.append([q, '(            )' + unit])
        ans.append(str(a) + unit)
    s.table(rows, header=False, col_mm=list(col), row_h=3402)
    return ans


def why(s, q, n=2):
    s.ask(q, blank=False)
    s.lines(n)


def thenwhy(s, lv, q, frame):
    s.ask('왜 그럴까요? ' + q, blank=False)
    if lv == '기본형':
        s.fill(frame)
    else:
        s.lines(2)


def rule_first(s, lv, q, frame):
    s.ask('먼저 예상해요 · ' + q, blank=False)
    if lv == '기본형':
        s.fill(frame)
    else:
        s.lines(1)


def write_pane(s, lv, items):
    if lv == '기본형':
        s.labeled(items)
    else:
        for k, _ in items:
            s.ask(k + ':', blank=False)
            s.lines(1)


def hdata(s, names, vals, h1, h2):
    """가로 자료 표(첫 줄 이름, 둘째 줄 값)."""
    n = len(names)
    rows = [[h1] + list(names), [h2] + [str(v) for v in vals]]
    s.table(rows, header=True, header_col=True, col_mm=[40] + [140 / n] * n, row_h=2835)


def scale_cards(s, lv, cards, pos=5, nums=False):
    """가능성 띠에 카드 놓기. cards: [(글, 가능성 분수)]. 정답 글."""
    words = W5 if pos == 5 else W3
    cats = [(cat5 if pos == 5 else cat3)(p) for _, p in cards]
    s.picture(fig('scale%d%s' % (pos, 'n' if nums else ''), svg_scale(pos, nums=nums)), width_mm=172)
    if lv == '기본형':
        s.choices([('%s %s' % (SYM[i], t), opt(*words) if pos == 3 else '( 불가능하다 / ~아닐 것 같다 /\n반반이다 / ~일 것 같다 / 확실하다 )')
                   for i, (t, _) in enumerate(cards)])
    else:
        s.text('카드의 기호를 가능성 띠 아래 알맞은 칸에 써 보세요.')
        for i, (t, _) in enumerate(cards):
            s.text('%s %s' % (SYM[i], t))
    return ', '.join('%s %s' % (SYM[i], words[c]) for i, c in enumerate(cats))


def record10(s, kind, n=10):
    """동전·주사위 기록표(학생이 채움)."""
    if kind == 'coin':
        rows = [['회'] + [str(i) for i in range(1, n + 1)], ['나온 면\n(그림 ○, 숫자 △)'] + [''] * n]
    else:
        rows = [['회'] + [str(i) for i in range(1, n + 1)], ['나온 눈'] + [''] * n, ['홀수/짝수'] + [''] * n]
    first = 40
    s.table(rows, header=True, header_col=True, col_mm=[first] + [(180 - first) / n] * n, row_h=3402)


def record_cum(s, kind):
    a, b = ('그림면(번)', '숫자 면(번)') if kind == 'coin' else ('홀수(번)', '짝수(번)')
    rows = [['던진 횟수(번)', '40', '60', '80', '100', '120'], [a] + [''] * 5, [b] + [''] * 5]
    s.table(rows, header=True, header_col=True, col_mm=[40] + [28] * 5, row_h=3402)


def example_run(seed, kind, n):
    """정답 쪽 '예시'용 실험 결과(같은 씨앗이면 언제나 같음)."""
    r = random.Random(seed)
    if kind == 'coin':
        return [r.choice('○△') for _ in range(n)]
    return [r.randint(1, 6) for _ in range(n)]


def example_cum(seed, kind):
    r = random.Random(seed)
    out, a = [], 0
    for m in range(1, 121):
        a += r.random() < .5
        if m in (40, 60, 80, 100, 120):
            out.append((m, a, m - a))
    return out


def sim10_answer(seed, kind):
    if kind == 'coin':
        e = example_run(seed, 'coin', 10)
        a = e.count('○')
        return '(예시) %s → 그림면 %d번, 숫자 면 %d번' % (' '.join(e), a, 10 - a)
    e = example_run(seed, 'dice', 10)
    odd = sum(v % 2 for v in e)
    return '(예시) %s → 홀수 %d번, 짝수 %d번' % (' '.join(map(str, e)), odd, 10 - odd)


def cum_answer(seed, kind):
    a, b = ('그림면', '숫자 면') if kind == 'coin' else ('홀수', '짝수')
    return '(예시) ' + ' / '.join('%d번: %s %d, %s %d' % (m, a, x, b, y) for m, x, y in example_cum(seed, kind))


def level_steps(vals):
    """많은 곳에서 적은 곳으로 옮기기: (어디에서, 어디로, 개수) 목록(가장 적게 옮기는 한 가지)."""
    m = avg(vals)
    assert m.denominator == 1
    m = int(m)
    give = [[i, v - m] for i, v in enumerate(vals) if v > m]
    take = [[i, m - v] for i, v in enumerate(vals) if v < m]
    moves = []
    gi = ti = 0
    while gi < len(give) and ti < len(take):
        k = min(give[gi][1], take[ti][1])
        moves.append((give[gi][0], take[ti][0], k))
        give[gi][1] -= k
        take[ti][1] -= k
        if give[gi][1] == 0:
            gi += 1
        if take[ti][1] == 0:
            ti += 1
    return m, moves


def moves_txt(names, moves, unit):
    return ', '.join('%s → %s %d%s' % (names[a], names[b], k, unit) for a, b, k in moves)


# ================================================================ 교과서 차시 버전
TB_T9 = [('눈 감고 외발 서기', '초', [41, 28, 33, 38], 35, 2), ('줄넘기 2단 뛰기', '회', [9, 20, 22, 13], 16, 3),
         ('제자리멀리뛰기', 'cm', ['148.2', '155.6', '139.8', '156.8'], '150.1', 0), ('왕복 오래달리기', '회', [66, 62, 50, 68], '61.5', 1)]
TB_NM9 = ['가은', '도윤', '지민', '현우']


def nearest(recs, m):
    d = [abs(F(str(v)) - m) for v in recs]
    best = min(d)
    assert d.count(best) == 1
    return d.index(best)


def tb1(s, lv):
    s.lesson(1, '개념 찾기(S)', '단원 도입 ― 마을 연합 송년 잔치에 가요', '우리 주변에서 평균과 가능성을 이용하는 상황에는 무엇이 있을까요?')
    s.scene(None, '오늘은 건우네 학교 학생 자치회에서 준비한 마을 연합 송년 잔치를 하는 날이에요. 행복 마을, 사랑 마을, 솔잎 마을, '
                  '가온 마을, 누리 마을의 할아버지와 할머니들이 오셨어요.')
    if lv == '기본형':
        step(s, 0, '동전 던지기', '먼저 공격하는 팀 정하기')
        s.text('축구 경기를 시작하기 전에 심판이 동전을 던져서 먼저 공격하는 팀을 정해요. 우리 팀은 그림면을 골랐어요. 동전을 6번 던져 기록해 보세요.')
        s.picture(fig('coin', svg_coin()), width_mm=70)
        record10(s, 'coin', 6)
        s.choices([('그림면과 숫자 면 중 어느 면이 나올지', opt('미리 알 수 있어요', '미리 알 수 없어요')),
                   ('그림면이 나올 가능성과 숫자 면이 나올 가능성은', opt('비슷해요', '크게 달라요'))])
        step(s, 1, '배울 내용 살펴보기', '평균일까, 가능성일까')
        items = [('우리 반 수학 성적을 대표하는 값', 0), ('주사위를 던졌을 때 눈의 수가 짝수가 나올 정도', 1),
                 ('일주일 동안 한 줄넘기 기록을 대표하는 값', 0), ('동전을 던졌을 때 숫자 면이 나올 정도', 1)]
        s.choices([(q, opt('평균', '가능성')) for q, _ in items])
        a2 = ', '.join(['평균', '가능성'][k] for _, k in items)
        step(s, 2, '배운 내용 떠올리기', '막대그래프와 꺾은선그래프')
        names, vals = ['고리 던지기', '콩 주머니', '건강 체조', '경품 뽑기'], [7, 5, 3, 9]
        hdata(s, names, vals, '활동', '학생 수(명)')
        s.text('표를 보고 막대그래프로 나타내 보세요. (세로 눈금 한 칸 = 1명)')
        s.picture(fig('tb1bar', svg_bars(names, vals, 10, 1, '해 보고 싶은 활동별 학생 수', '활동', '학생 수', '명', draw=False)), width_mm=120)
        tv = [12, 14, 17, 19, 20]
        tn = ['9시', '10시', '11시', '12시', '1시']
        s.picture(fig('tb1line', svg_linegraph(tn, tv, 10, 22, 2, '송년 잔치 날 체육관의 온도', '℃')), width_mm=110)
        rise = [tv[i + 1] - tv[i] for i in range(4)]
        big = rise.index(max(rise))
        assert rise.count(max(rise)) == 1
        spans = ['%s와 %s 사이' % (tn[i], tn[i + 1]) for i in range(4)]
        a3 = qa(s, [('11시의 체육관 온도는?', tv[2], '℃')])
        s.choices([('온도가 가장 많이 오른 때는?', opt(*spans[:2]) + '\n' + opt(*spans[2:]))])
        step(s, 3, '송년 잔치 둘러보기', '체육관의 다섯 곳')
        acts = [('고리 던지기', 0), ('콩 주머니 던지기', 0), ('건강 체조', 1), ('간식 나누기', 1), ('경품 뽑기', 1)]
        s.text('체육관에 준비된 활동이에요. 각 활동에서 알아볼 것을 골라 보세요.')
        s.choices([(t, opt('평균', '가능성')) for t, _ in acts])
        step(s, 4, '확인하기', '학습 계획 세우기')
        write_pane(s, lv, [('경험', '__________________ 을 할 때 ______________ 로 정한 적이 있어요.'),
                           ('알고 싶은 것', '________________________________ 이 알고 싶어요.')])
        ans = '1차시  ① 기록표는 학생마다 다름, 미리 알 수 없어요, 비슷해요   ② %s   ③ 막대 7·5·3·9칸, %s, %s   ④ 고리 던지기·콩 주머니 던지기 평균, 건강 체조·간식 나누기·경품 뽑기 가능성   ⑤ (자유)' % (
            a2, a3[0], spans[big])
    else:  # 도전형
        ans = htb1(s, lv)
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '세로 눈금 한 칸이 2명인 막대그래프')
        n2, v2 = ['3학년', '4학년', '5학년', '6학년'], [6, 10, 14, 12]
        hdata(s, n2, v2, '학년', '도우미 수(명)')
        s.picture(fig('tb1bar2', svg_bars(n2, v2, 16, 2, '학년별 도우미 수', '학년', '도우미 수', '명', draw=False)), width_mm=110)
        a6 = qa(s, [('5학년 14명은 눈금 몇 칸?', 14 // 2, '칸'), ('3학년 6명은 눈금 몇 칸?', 6 // 2, '칸')])
        why(s, '세로 눈금 한 칸이 2명일 때 막대의 칸 수를 어떻게 정하는지 써 보세요.', 1)
        ans += '   ⑥ 막대 3·5·7·6칸, %s ((학생 수)÷2만큼 칸을 올려요)' % ' / '.join(a6)
    return ans


def tb2(s, lv):
    s.lesson(2, '개념 구축하기(O)', '평균을 알아볼까요', '자료를 대표하는 값은 어떻게 정할 수 있을까요?')
    s.scene(None, '건우: “한 마을당 참여한 인원수를 대표하는 값은 몇 명일까?”')
    vil = ['행복 마을', '사랑 마을', '솔잎 마을', '가온 마을', '누리 마을']
    vv = [8, 9, 8, 7, 8]
    m, mv = level_steps(vv)
    assert m == 8 and mv == [(1, 3, 1)]
    if lv == '기본형':
        step(s, 0, '만져 보기', '쌓기나무로 고르게 하기')
        s.picture(fig('tb2blk', svg_stack(vil, vv, 'block', '마을별 송년 잔치에 참여한 인원수(쌓기나무 1개 = 1명)')), width_mm=130)
        s.text('많은 곳에서 적은 곳으로 쌓기나무를 옮기는 화살표를 그려 보세요.')
        s.choices([('가장 적게 옮기려면', '( 사랑 마을에서 1개를 가온 마을로 /\n가온 마을에서 1개를 사랑 마을로 /\n행복 마을에서 1개를 누리 마을로 )')])
        a1 = qa(s, [('한 마을당 참여한 인원수를 대표하는 값', m, '명')])
        step(s, 1, '그려 보기', '제기차기 기록 ○ 옮기기')
        kn, kv = ['가은', '도윤', '지민', '현우', '시아'], [4, 5, 2, 3, 1]
        m2, mv2 = level_steps(kv)
        assert m2 == 3 and mv2 == [(0, 2, 1), (1, 4, 2)]
        hdata(s, kn, kv, '이름', '기록(개)')
        s.picture(fig('tb2cir', svg_stack(kn, kv, 'circle', '학생별 제기차기 기록')), width_mm=120)
        a2 = qa(s, [('가은이의 ○를 지민이에게 몇 개 옮기면 될까요?', 1, '개'), ('도윤이의 ○를 시아에게 몇 개 옮기면 될까요?', 2, '개'),
                    ('가은이네 모둠의 제기차기 기록의 평균', m2, '개')])
        step(s, 2, '말해 보기', '대표하는 값 정하기')
        s.choices([('대표하는 값을 정하는 방법으로 가장 알맞은 것은?', '( 8명인 마을이 가장 많으니까 8명으로 정해요 /\n가장 큰 수인 9명으로 정해요 /\n마을별 인원수를 고르게 하여 정해요 )'),
                   ('마을별 참여 인원수와 같은 것을 무엇이라고 할까요?', opt('자룟값', '합계', '눈금'))])
        step(s, 3, '약속하기', '평균')
        s.fill('자룟값을 %s 그 자료를 대표하는 값으로 정할 수 있습니다. 이 값을 %s이라고 합니다.' % (
            ch(lv, ['고르게 하여', '모두 더하여', '가장 큰 수로']), ch(lv, ['평균', '합계', '자룟값'], 8)))
        step(s, 4, '확인하기', '상자 4개의 구슬 수')
        bn, bv = ['파란색', '빨간색', '노란색', '초록색'], [14, 12, 12, 10]
        m5 = avg(bv)
        assert m5 == 12
        s.picture(fig('tb2bar', svg_bars(bn, bv, 16, 1, '상자별 구슬 수', '상자', '구슬 수', '개', lab_every=2)), width_mm=110)
        s.text('평균을 예상하여 넘치는 구슬과 모자란 구슬이 같아지는 높이에 빨간 선을 그어 보세요.')
        a5 = qa(s, [('파란색 상자는 예상한 평균 12개보다 몇 개 더 많나요?', 14 - 12, '개'), ('초록색 상자는 12개보다 몇 개 더 적나요?', 12 - 10, '개'),
                    ('4상자에 들어 있는 구슬 수의 평균', fmt(m5), '개')])
        ans = '2차시  ① 사랑 마을에서 1개를 가온 마을로, %s   ② %s   ③ 마을별 인원수를 고르게 하여 정해요, 자룟값   ④ 고르게 하여, 평균   ⑤ 12에 선, %s' % (
            ' / '.join(a1), ' / '.join(a2), ' / '.join(a5))
        if lv == '기본형':
            s.text('먼저 연습해요 · 모둠 친구들의 가족 구성원 수(지원 4명, 원석 3명, 소연 5명, 준우 4명)')
            fv = [4, 3, 5, 4]
            fm, _ = level_steps(fv)
            a6 = qa(s, [('소연이의 ○ 1개를 원석이에게 옮기면 가족 구성원 수를 대표하는 값은?', fm, '명')])
            ans += ', 연습 %s' % a6[0]
    else:  # 도전형
        ans = htb2(s, lv)
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '수학익힘 — 고르게 하여 평균 구하기')
        dn, dv = ['월', '화', '수', '목', '금'], [21, 20, 19, 23, 17]
        md = avg(dv)
        assert md == 20
        s.picture(fig('tb2tmp', svg_bars(dn, dv, 25, 1, '요일별 교실 온도', '요일', '온도', '℃', lab_every=5)), width_mm=110)
        a6 = qa(s, [('20℃보다 월요일은 몇 ℃ 더 높나요?', 21 - 20, '℃'), ('20℃보다 수요일은 몇 ℃ 더 낮나요?', 20 - 19, '℃'),
                    ('20℃보다 목요일은 몇 ℃ 더 높나요?', 23 - 20, '℃'), ('20℃보다 금요일은 몇 ℃ 더 낮나요?', 20 - 17, '℃'),
                    ('교실 온도의 평균', fmt(md), '℃')])
        s.choices([('주머니 4개에 든 사탕 수를 대표하는 값은', opt('가장 큰 수', '가장 작은 수', '고르게 한 수'))])
        cv = [38, 46, 50, 42]
        mc = avg(cv)
        assert mc == 44
        hdata(s, ['미정', '유찬', '민지', '서준'], cv, '이름', '시간(분)')
        a7 = qa(s, [('하루 컴퓨터 사용 시간을 고르게 하면 한 사람당', fmt(mc), '분')])
        why(s, '컴퓨터 사용 시간을 어떻게 고르게 했는지 써 보세요.', 1)
        ans += '   ⑥ %s, 고르게 한 수, %s' % (' / '.join(a6), a7[0])
    return ans


def tb3(s, lv):
    s.lesson(3, '개념 구축하기(O)', '평균을 구해 볼까요', '평균은 어떻게 구할 수 있을까요?')
    s.scene(None, '고리 던지기를 준비하는데 바구니마다 고리 수가 달라요(빨간색 7개, 노란색 4개, 파란색 6개, 초록색 3개).')
    rn, rv = ['빨간색 바구니', '노란색 바구니', '파란색 바구니', '초록색 바구니'], [7, 4, 6, 3]
    t1, m1 = total(rv), avg(rv)
    assert (t1, m1) == (20, 5)
    if lv == '기본형':
        step(s, 0, '만져 보기', '종이띠 이어 붙이고 등분하기')
        s.picture(fig('tb3strip', svg_strips(rn, rv, '개', True)), width_mm=172)
        s.text('이어 붙인 띠를 4등분하는 선을 그어 보세요(반으로 접고 다시 반으로 접기).')
        a1 = qa(s, [('고리는 모두 7 + 4 + 6 + 3 =', fmt(t1), '개'), ('4등분한 띠 한 칸에는 20 ÷ 4 =', fmt(m1), '개'),
                    ('바구니 한 개에 들어 있는 고리 수의 평균', fmt(m1), '개')])
        step(s, 1, '말해 보기', '종이띠와 계산 잇기')
        s.fill(['종이띠를 이어 붙이는 것은 자룟값을 %s 것과 같아요.' % ch(lv, ['모두 더하는', '모두 빼는', '곱하는']),
                '이어 붙인 띠를 4등분하는 것은 %s로 나누는 것과 같아요.' % ch(lv, ['자료의 수', '가장 큰 자룟값', '고리 한 개'])])
        step(s, 2, '약속하기', '평균 구하는 식')
        s.fill(['평균은 자룟값을 모두 더한 수를 %s로 나누어서 구합니다.' % ch(lv, ['자료의 수', '가장 큰 수', '2']),
                '(평균) = %s ÷ %s' % (ch(lv, ['자룟값을 모두 더한 수', '자료의 수'], 16), ch(lv, ['자료의 수', '평균'], 10))])
        step(s, 3, '평균 구하기', '수현이의 왕복 달리기 기록')
        sv = [87, 92, 85, 90, 91]
        t4, m4 = total(sv), avg(sv)
        assert (t4, m4) == (445, 89)
        hdata(s, ['1일', '2일', '3일', '4일', '5일'], sv, '날짜', '기록(회)')
        s.picture(fig('tb3strip2', svg_strips(['1일', '2일', '3일', '4일', '5일'], sv, '회', False)), width_mm=165)
        a4 = qa(s, [('기록을 모두 더하면', fmt(t4), '회'), ('기록을 잰 날은', 5, '일'), ('평균: 445 ÷ 5 =', fmt(m4), '회')])
        step(s, 4, '확인하기', '박물관 관람객 수, 읽은 책 수')
        mv = [540, 630, 690, 470, 710, 870, 780]
        t5, m5 = total(mv), avg(mv)
        assert (t5, m5) == (4690, 670)
        hdata(s, ['월', '화', '수', '목', '금', '토', '일'], mv, '요일', '관람객 수(명)')
        bk = [4, 6, 8, 6]
        mb = avg(bk)
        assert mb == 6
        if lv == '기본형':
            s.wordbox(['모두 더하기', '자료의 수 7로 나누기', '계산기를 써도 돼요'])
        a5 = qa(s, [('(540 + 630 + 690 + 470 + 710 + 870 + 780) =', fmt(t5), '명'), ('관람객 수의 평균: 4690 ÷ 7 =', fmt(m5), '명')])
        hdata(s, ['윤호', '주아', '은찬', '가은'], bk, '이름', '책 수(권)')
        a6 = qa(s, [('윤호네 모둠이 지난달에 읽은 책 수의 평균', fmt(mb), '권')])
        ans = '3차시  ① %s   ② 모두 더하는, 자료의 수   ③ 자료의 수, 자룟값을 모두 더한 수, 자료의 수   ④ %s   ⑤ %s / %s' % (
            ' / '.join(a1), ' / '.join(a4), ' / '.join(a5), a6[0])
    else:  # 도전형
        ans = htb3(s, lv)
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '수학익힘 — 평균 구하기')
        pn, pv = ['맛나', '한입', '호호', '전설', '소풍'], [4600, 3700, 4000, 3500, 4200]
        tp, mp = total(pv), avg(pv)
        assert (tp, mp) == (20000, 4000)
        hi = [pn[i] for i, v in enumerate(pv) if v > mp]
        assert hi == ['맛나', '소풍']
        hdata(s, pn, pv, '분식집', '가격(원)')
        a7 = qa(s, [('떡볶이 1인분 가격의 합', fmt(tp), '원'), ('가격의 평균', fmt(mp), '원'), ('평균보다 비싼 분식집을 모두', L(hi))])
        rv2 = [21, 19, 24, 20]
        pv2 = [80, 76, 90, 85, 79]
        assert (total(rv2), avg(rv2), total(pv2), avg(pv2)) == (84, 21, 410, 82)
        a8 = qa(s, [('혜영이네 모둠 100 m 달리기(21초, 19초, 24초, 20초) 기록의 평균', fmt(avg(rv2)), '초'),
                    ('동준이의 맥박 수(80회, 76회, 90회, 85회, 79회)의 평균', fmt(avg(pv2)), '회')])
        why(s, '맥박 수의 평균을 410회라고 쓴 친구에게 무엇이 틀렸는지 알려 주세요.', 1)
        ans += '   ⑥ %s / %s (410은 합이라 5로 나누어야 해요)' % (' / '.join(a7), ' / '.join(a8))
    return ans


def tb4(s, lv):
    s.lesson(4, '개념 구축하기(O)', '평균을 활용해 볼까요', '평균을 이용하여 어떤 문제를 해결할 수 있을까요?')
    s.scene(None, '콩 주머니 던지기를 했어요. 건강 팀은 3명, 장수 팀은 4명이 참가했어요.')
    gv, jv = [7, 9, 8], [6, 10, 7, 5]
    mg, mj = avg(gv), avg(jv)
    assert (mg, mj, total(gv), total(jv)) == (8, 7, 24, 28)
    if lv == '기본형':
        step(s, 0, '만져 보기', '두 팀의 점수 고르게 하기')
        s.picture(fig('tb4g', svg_stack(['1번', '2번', '3번'], gv, 'block', '건강 팀 점수(쌓기나무 1개 = 1점)')), width_mm=80)
        s.picture(fig('tb4j', svg_stack(['1번', '2번', '3번', '4번'], jv, 'block', '장수 팀 점수(쌓기나무 1개 = 1점)')), width_mm=100)
        a1 = qa(s, [('건강 팀 점수의 평균: (7 + 9 + 8) ÷ 3 =', fmt(mg), '점'), ('장수 팀 점수의 평균: (6 + 10 + 7 + 5) ÷ 4 =', fmt(mj), '점')])
        s.choices([('평균이 더 높아 이겼다고 할 수 있는 팀은?', opt('건강 팀', '장수 팀'))])
        step(s, 1, '그려 보기', '물통을 들고 다니는 학생 수(평균 64명)')
        wn = ['1학년', '2학년', '3학년', '4학년', '5학년', '6학년']
        wv = [80, 76, 80, 61, None, 48]
        known = [v for v in wv if v is not None]
        tw = 64 * 6
        x5 = tw - sum(known)
        assert (tw, sum(known), x5) == (384, 345, 39) and avg(known + [x5]) == 64
        below = [wn[i] for i, v in enumerate(wv[:4] + [x5] + wv[5:]) if v < 64]
        assert below == ['4학년', '5학년', '6학년']
        hdata(s, wn, ['80', '76', '80', '61', '?', '48'], '학년', '학생 수(명)')
        s.picture(fig('tb4bar', svg_bars(wn, wv, 100, 10, '학년별 물통을 들고 다니는 학생 수', '학년', '학생 수', '명', unknown=4, avgline=64)), width_mm=130)
        s.text('빨간 점선은 평균 64명이에요. 5학년 막대를 그려 보세요.')
        a2 = qa(s, [('전체 학생 수: 64 × 6 =', tw, '명'), ('아는 학년의 합: 80 + 76 + 80 + 61 + 48 =', sum(known), '명'),
                    ('5학년: 384 − 345 =', x5, '명'), ('평균보다 학생 수가 적은 학년을 모두', L(below))])
        step(s, 2, '말해 보기', '합계와 평균')
        s.fill('장수 팀의 점수 합계가 더 크지만 두 팀의 %s 합계로 비교하면 알맞지 않아요. 인원수가 다른 두 집단은 %s으로 비교해요.' % (
            ch(lv, ['참가 인원수가 달라서', '점수가 모두 같아서']), ch(lv, ['평균', '가장 높은 점수', '합계'], 8)))
        step(s, 3, '정리하기', '모르는 자룟값 구하기')
        s.fill(['평균을 알면 (평균) %s (자료의 수)로 전체 합을 구할 수 있어요.' % ch(lv, ['×', '+', '÷'], 6),
                '전체 합에서 아는 자룟값을 모두 %s 모르는 자룟값을 구할 수 있어요.' % ch(lv, ['빼면', '더하면', '곱하면'], 8)])
        step(s, 4, '확인하기', '예린이의 운동 시간')
        yv = [9, 8, 6, 9]
        my = avg(yv)
        rv = [7, 9, 7, 8]
        tr = my * 5
        xr = tr - sum(rv)
        assert (my, tr, xr) == (8, 40, 9)
        hdata(s, ['아버지', '어머니', '누나', '윤호'], yv, '윤호네 가족', '시간(시간)')
        hdata(s, ['할머니', '아버지', '어머니', '예린', '동생'], ['7', '9', '7', '?', '8'], '예린이네 가족', '시간(시간)')
        s.text('두 가족의 일주일 운동 시간의 평균이 같아요.')
        a5 = qa(s, [('윤호네 가족의 운동 시간의 평균: (9 + 8 + 6 + 9) ÷ 4 =', fmt(my), '시간'), ('예린이네 가족의 운동 시간의 합: 8 × 5 =', fmt(tr), '시간'),
                    ('예린: 40 − (7 + 9 + 7 + 8) =', fmt(xr), '시간')])
        ans = '4차시  ① %s, 건강 팀   ② %s   ③ 참가 인원수가 달라서, 평균   ④ ×, 빼면   ⑤ %s' % (' / '.join(a1), ' / '.join(a2), ' / '.join(a5))
    else:  # 도전형
        ans = htb4(s, lv)
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '수학익힘 — 평균 활용')
        cls = ['1반', '2반', '3반', '4반', '5반']
        st_, kg = [19, 20, 15, 22, 23], [95, 80, 90, 88, 46]
        per = [F(k, n) for k, n in zip(kg, st_)]
        assert per == [5, 4, 6, 4, 2]
        s.table([['반'] + cls, ['학생 수(명)'] + [str(v) for v in st_], ['수집량(kg)'] + [str(v) for v in kg],
                 ['한 학생당(kg)'] + [''] * 5], header=True, header_col=True, col_mm=[40] + [28] * 5, row_h=3118)
        best = cls[per.index(max(per))]
        h = [89, 94, 85]
        h3 = 88 * 4 - sum(h)
        jj = [150, 147, 136, 148, 144]
        mjj = avg(jj)
        yd = mjj * 4 - (150 + 135 + 140)
        bb = [85, 72, 68, 79]
        need = 78 * 5 - sum(bb)
        assert (h3, mjj, yd, need) == (84, 145, 155, 86) and avg(h + [h3]) == 88
        a6 = qa(s, [('한 학생당 수집량이 가장 많은 반', best), ('민하의 한자 시험 3회 점수(1회 89점, 2회 94점, 4회 85점, 평균 88점)', h3, '점'),
                    ('지석이(150, 147, 136, 148, 144 cm)의 제자리멀리뛰기 기록의 평균', fmt(mjj), ' cm'),
                    ('평균이 같은 유담이(150, 135, ?, 140 cm)의 3회 기록', fmt(yd), ' cm'),
                    ('민우네 농구팀(85, 72, 68, 79점) 5회까지 평균 78점 이상이 되려면 5회에 적어도', need, '점')])
        why(s, '농구팀이 5회에 얻어야 할 점수를 어떻게 구했는지 써 보세요.', 1)
        ans += '   ⑥ 한 학생당 %s kg, %s (78 × 5 − 304)' % (L(fmt(p) for p in per), ' / '.join(a6))
    return ans


def tb5(s, lv):
    s.lesson(5, '개념 구축하기(O)', '일이 일어날 가능성을 말로 표현해 볼까요', '일이 일어날 가능성을 어떤 말로 표현할 수 있을까요?')
    s.scene(None, '할머니께서 크림붕어빵 2개와 팥붕어빵 2개가 든 통에서 붕어빵을 한 개 꺼내세요. 귤 한 상자에는 귤만 들어 있고, 준비한 우유 중에 딸기우유는 없어요.')
    if lv == '기본형':
        step(s, 0, '만져 보기', '붕어빵 통에서 꺼내기(꺼낸 것은 다시 넣어요)')
        s.picture(fig('tb5fish', svg_bags([('붕어빵 통', [('#F3D27A', '크림', 2), ('#B7793F', '팥', 2)])], 'box')), width_mm=55)
        p = [F(1), F(2, 4), F(2, 4), F(0)]   # 귤만 든 상자, 크림 2·팥 2, 딸기우유 없음
        qs = ['귤 한 상자를 열었을 때 귤이 나올 가능성은', '할머니께서 크림붕어빵을 드실 가능성은', '할머니께서 팥붕어빵을 드실 가능성은',
              '할아버지께서 딸기우유를 드실 가능성은']
        s.choices([(q, opt(*W3)) for q in qs])
        a1 = ', '.join(W3[cat3(x)] for x in p)
        step(s, 1, '그려 보기', '가능성 띠에 카드 놓기')
        cards = [('내일 하루는 25시간일 것입니다.', F(0)), ('윷놀이에서 8번 연속으로 모가 나올 것입니다.', F(1, 100)),   # 아주 작지만 0은 아님
                 ('우체국에서 뽑은 대기표의 번호는 짝수일 것입니다.', F(1, 2)), ('우리 반에는 오른손잡이가 많을 것입니다.', F(9, 10)),   # 대부분이지만 확실하지는 않음
                 ('내일 아침에 해가 동쪽에서 뜰 것입니다.', F(1))]
        a2 = scale_cards(s, lv, cards)
        step(s, 2, '말해 보기', '사탕 주머니(딸기 맛 2개, 포도 맛 6개)')
        s.picture(fig('tb5candy', svg_bags([('사탕 주머니', [('#F07A8E', '딸', 2), ('#8E5BB5', '포', 6)])])), width_mm=55)
        pd, pp = F(2, 8), F(6, 8)
        s.choices([('꺼낼 때 나올 수 있는 맛에 모두 ○', '( 딸기 맛 / 포도 맛 / 사과 맛 )'),
                   ('딸기 맛 사탕이 나올 가능성은', '( 불가능하다 / ~아닐 것 같다 /\n반반이다 / ~일 것 같다 / 확실하다 )'),
                   ('포도 맛 사탕이 나올 가능성은', '( 불가능하다 / ~아닐 것 같다 /\n반반이다 / ~일 것 같다 / 확실하다 )')])
        a3 = '딸기 맛·포도 맛, %s, %s' % (W5[cat5(pd)], W5[cat5(pp)])
        step(s, 3, '약속하기', '가능성')
        s.fill(['어떠한 상황에서 특정한 일이 일어나길 기대할 수 있는 정도를 %s이라고 합니다.' % ch(lv, ['가능성', '평균', '자룟값'], 8),
                '가능성은 불가능하다, ~아닐 것 같다, %s, ~일 것 같다, %s 등으로 표현할 수 있습니다.' % (
                    ch(lv, ['반반이다', '고르다', '평균이다'], 10), ch(lv, ['확실하다', '많다', '적다'], 10))])
        step(s, 4, '확인하기', '수학익힘 — 가능성 띠에 카드 놓기')
        dice = range(1, 7)
        cards2 = [('수요일의 다음 날은 목요일일 것입니다.', F(1)), ('내일 전학 오는 학생은 여학생일 것입니다.', F(1, 2)),
                  ('동전을 10번 던지면 10번 모두 그림면이 나올 것입니다.', F(1, 2) ** 10),
                  ('주사위 한 개를 던지면 눈의 수가 2 이상일 것입니다.', prob([v for v in dice if v >= 2], dice)),
                  ('내년 1월 달력에는 날짜가 35일까지 있을 것입니다.', F(0))]
        if lv == '기본형':
            s.choices([('%s %s' % (SYM[i], t), '( 불가능하다 / ~아닐 것 같다 /\n반반이다 / ~일 것 같다 / 확실하다 )') for i, (t, _) in enumerate(cards2)])
        else:
            s.text('카드마다 알맞은 말을 써 보세요.')
            s.table([[('%s %s' % (SYM[i], t)), '(                    )'] for i, (t, _) in enumerate(cards2)], header=False, col_mm=[125, 55], row_h=3118)
        a5 = ', '.join('%s %s' % (SYM[i], W5[cat5(x)]) for i, (_, x) in enumerate(cards2))
        ans = '5차시  ① %s   ② %s   ③ %s   ④ 가능성, 반반이다, 확실하다   ⑤ %s' % (a1, a2, a3, a5)
    else:  # 도전형
        ans = htb5(s, lv)
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '잘못 말한 친구 찾기')
        assert 4 * 3 == 12 and (14 + 3) % 12 == 5
        s.text('수정: “지금은 오후 2시니까 3시간 후에 오후 5시일 가능성은 ‘확실하다’야.”')
        s.text('정하: “계산기에 4, ×, 3, =을 차례대로 누르면 15가 나올 가능성은 ‘불가능하다’야.”')
        s.text('예지: “○× 문제의 정답이 ×일 가능성은 ‘~아닐 것 같다’야.”')
        s.ask('가능성을 잘못 말한 사람은?')
        why(s, '잘못 말한 사람의 말을 바르게 고쳐 써 보세요.', 1)
        s.ask('‘불가능하다’로 표현할 수 있는 일을 써 보세요.', blank=False)
        s.lines(1)
        s.ask('‘반반이다’로 표현할 수 있는 일을 써 보세요.', blank=False)
        s.lines(1)
        ans += '   ⑥ 예지, ○× 문제의 정답이 ×일 가능성은 ‘반반이다’예요, (예) 2월의 다음 달이 1월일 가능성 / 1~10 수 카드에서 홀수가 나올 가능성'
    return ans


def tb6(s, lv):
    s.lesson(6, '개념 구축하기(O)', '일이 일어날 가능성을 비교해 볼까요', '일이 일어날 가능성을 어떻게 비교할 수 있을까요?')
    s.scene(None, '건강 체조를 하려면 주머니에서 손수건 한 장을 꺼내야 해요(꺼낸 것은 다시 넣어요).')
    if lv == '기본형':
        step(s, 0, '만져 보기', '손수건 주머니 가·나·다')
        bags = [('가', [(RED, '빨', 4)]), ('나', [(RED, '빨', 2), (GREEN, '초', 2)]), ('다', [(GREEN, '초', 4)])]
        s.picture(fig('tb6bag', svg_bags(bags)), width_mm=130)
        pr = [F(sum(m for c, k, m in it if k == '빨'), sum(m for _, _, m in it)) for _, it in bags]
        assert pr == [1, F(1, 2), 0]
        order = rank_order(['가', '나', '다'], pr)
        s.choices([('빨간색 손수건이 나올 가능성이 확실한 주머니', opt('가', '나', '다')), ('반반인 주머니', opt('가', '나', '다')),
                   ('불가능한 주머니', opt('가', '나', '다')), ('가능성이 높은 주머니부터 차례로', opt('가, 나, 다', '다, 나, 가', '나, 가, 다'))])
        step(s, 1, '그려 보기', '회전판 다섯 개(초록색과 노란색)')
        sp = [('가', [(F(1, 2), GREEN, '초'), (F(1, 2), YEL, '노')]), ('나', [(F(1), YEL, '노')]),
              ('다', [(F(1, 4), GREEN, '초'), (F(3, 4), YEL, '노')]), ('라', [(F(3, 4), GREEN, '초'), (F(1, 4), YEL, '노')]),
              ('마', [(F(1), GREEN, '초')])]
        pg = [sum(f for f, c, _ in secs if c == GREEN) for _, secs in sp]
        nm = [n for n, _ in sp]
        s.picture(fig('tb6sp', svg_spinners(sp, 70)), width_mm=172)
        a2 = [nm[pg.index(0)], nm[pg.index(F(1, 2))], nm[pg.index(max(pg))], '라' if pg[3] > pg[2] else '다']
        if lv == '기본형':
            s.choices([('노란색에만 멈출 수 있는 회전판', opt(*nm)), ('초록색에 멈출 가능성이 반반인 회전판', opt(*nm)),
                       ('초록색에 멈출 가능성이 가장 높은 회전판', opt(*nm)), ('다와 라 중 더 높은 회전판', opt('다', '라'))])
        else:
            qa(s, [('노란색에만 멈출 수 있는 회전판', ''), ('초록색에 멈출 가능성이 반반인 회전판', ''), ('초록색에 멈출 가능성이 가장 높은 회전판', ''),
                   ('다와 라 중 더 높은 회전판', '')])
        step(s, 2, '차례 정하기', '초록색에 멈출 가능성이 높은 회전판부터')
        o3 = rank_order(nm, pg)
        assert o3 == ['마', '라', '가', '다', '나']
        s.ask('(        ) → (        ) → (        ) → (        ) → (        )', blank=False)
        step(s, 3, '말해 보기', '구슬을 100번 꺼낸 결과')
        cv = [('빨간색', 11, RED), ('초록색', 30, GREEN), ('파란색', 59, BLUE)]
        assert sum(v for _, v, _ in cv) == 100
        s.table([['색', '빨간색', '초록색', '파란색', '합계'], ['횟수(번)', '11', '30', '59', '100']], header=True, header_col=True, col_mm=[40, 35, 35, 35, 35])
        s.picture(fig('tb6hb', svg_hbars(cv, '색별 나온 구슬의 횟수')), width_mm=120)
        o4 = [t for t, v, _ in sorted(cv, key=lambda x: -x[1])]
        s.choices([('빨간색과 초록색 중 나올 가능성이 더 높은 색', opt('빨간색', '초록색')),
                   ('나올 가능성이 높은 색부터 차례로', '( 파란색, 초록색, 빨간색 /\n빨간색, 초록색, 파란색 / 초록색, 파란색, 빨간색 )'),
                   ('상자에 가장 많이 들어 있을 것 같은 색', opt('빨간색', '초록색', '파란색'))])
        step(s, 4, '확인하기', '수학익힘 — 가능성 비교하기')
        d = range(1, 7)
        pd = [prob([v for v in d if v % 2 == 0], d), prob([v for v in d if 1 <= v <= 5], d), prob([v for v in d if v % 4 == 0], d)]
        bestd = '㉠㉡㉢'[pd.index(max(pd))]
        assert bestd == '㉡'
        s.ask('주사위를 한 번 던질 때 가능성이 가장 높은 것은? ㉠ 눈의 수가 2의 배수 ㉡ 눈의 수가 1 이상 5 이하 ㉢ 눈의 수가 4의 배수')
        sp6b = [('㉠', [(F(1, 2), RED, '빨'), (F(1, 4), YEL, '노'), (F(1, 4), BLUE, '파')]),
                ('㉡', [(F(1, 4), RED, '빨'), (F(1, 4), YEL, '노'), (F(1, 2), BLUE, '파')]),
                ('㉢', [(F(1, 3), RED, '빨'), (F(1, 3), YEL, '노'), (F(1, 3), BLUE, '파')])]
        s.picture(fig('tb6sp6b', svg_spinners(sp6b, 70)), width_mm=120)
        k = match_spinner([[f for f, _, _ in secs] for _, secs in sp6b], [46, 47, 47])
        s.ask('회전판을 140회 돌렸더니 빨간색 46회, 노란색 47회, 파란색 47회 멈췄어요. 어느 회전판을 돌렸을 가능성이 가장 높을까요?')
        ans = '6차시  ① 확실 가, 반반 나, 불가능 다, 차례 %s   ② %s   ③ %s   ④ 초록색, %s, 파란색   ⑤ %s, %s' % (
            ', '.join(order), ', '.join(a2), ' → '.join(o3), ', '.join(o4), bestd, '㉠㉡㉢'[k])
    else:  # 도전형
        ans = htb6(s, lv)
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '조건에 맞게 회전판 색칠하기')
        sols = [(r, g, 6 - r - g) for r in range(1, 7) for g in range(1, 7) if r + g <= 6 and g == 2 * r and 6 - r - g > max(r, g)]
        assert sols == [(1, 2, 3)]
        s.text('조건: 화살이 노란색에 멈출 가능성이 가장 높고, 초록색에 멈출 가능성은 빨간색에 멈출 가능성의 2배예요. 빨간색·초록색·노란색으로 6칸을 색칠해 보세요.')
        s.picture(fig('paint6', svg_paint(6)), width_mm=55)
        qa(s, [('빨간색', '', '칸'), ('초록색', '', '칸'), ('노란색', '', '칸')], col=(60, 120))
        why(s, '그렇게 색칠한 까닭을 써 보세요.', 1)
        ans += '   ⑥ 빨간색 1칸, 초록색 2칸, 노란색 3칸'
    return ans


def tb7(s, lv):
    s.lesson(7, '개념 구축하기(O)', '일이 일어날 가능성을 수로 나타내어 볼까요', '일이 일어날 가능성을 어떤 수로 나타낼 수 있을까요?')
    s.scene(None, '송년 잔치를 마무리하며 경품 뽑기를 해요. 경품함마다 공을 꺼내 보아요(꺼낸 공은 다시 넣어요).')
    bags = [('가', [(ORG, '주', 1), (BLUE, '파', 1)]), ('나', [(ORG, '주', 2)]), ('다', [(BLUE, '파', 2)])]
    po = [F(sum(m for _, k, m in it if k == '주'), sum(m for _, _, m in it)) for _, it in bags]
    assert po == [F(1, 2), 1, 0]
    if lv == '기본형':
        step(s, 0, '만져 보기', '경품함 가·나·다')
        s.picture(fig('tb7bag', svg_bags(bags, 'box')), width_mm=120)
        s.choices([('경품함 %s에서 주황색 공이 나올 가능성' % n, opt(*W3)) for n, _ in bags])
        a1 = ', '.join(W3[cat3(x)] for x in po)
        step(s, 1, '그려 보기', '가능성 띠를 수로')
        s.picture(fig('scale3q', svg_scale(3, qmarks=True, boxes=False)), width_mm=165)
        s.fill(['불가능하다 → %s,   반반이다 → %s,   확실하다 → %s' % (ch(lv, ['0', '1/2', '1'], 6), ch(lv, ['0', '1/2', '1'], 6), ch(lv, ['0', '1/2', '1'], 6)),
                '주황색 공이 나올 가능성을 수로:  가 (      ),  나 (      ),  다 (      )'])
        a2 = '0, 1/2, 1 / 가 %s, 나 %s, 다 %s' % tuple(frac_txt(x) for x in po)
        step(s, 2, '말해 보기', '동전과 회전판')
        s.picture(fig('coin', svg_coin()), width_mm=60)
        sp = [('가', [(F(1), BLUE, '파')]), ('나', [(F(1, 2), RED, '빨'), (F(1, 2), BLUE, '파')]), ('다', [(F(1), RED, '빨')])]
        pr = [sum(f for f, c, _ in secs if c == RED) for _, secs in sp]
        s.picture(fig('tb7sp', svg_spinners(sp, 70)), width_mm=110)
        a3 = qa(s, [('동전을 던질 때 그림면이 나올 가능성', frac_txt(F(1, 2))), ('숫자 면이 나올 가능성', frac_txt(F(1, 2))),
                    ('화살이 빨간색에 멈출 가능성이 반반인 회전판', '나'),
                    ('빨간색에 멈출 가능성을 수로: 가, 나, 다', ', '.join(frac_txt(x) for x in pr))])
        step(s, 3, '약속하기', '가능성을 수로')
        s.fill('일이 일어날 가능성을 0부터 1까지의 수로 나타내면 ‘불가능하다’는 %s으로, ‘반반이다’는 %s로, ‘확실하다’는 %s로 나타낼 수 있습니다.' % (
            ch(lv, ['0', '1/2', '1'], 6), ch(lv, ['0', '1/2', '1'], 6), ch(lv, ['0', '1/2', '1'], 6)))
        step(s, 4, '확인하기', '주사위를 한 번 던질 때')
        s.picture(fig('dice', svg_dice()), width_mm=110)
        d = list(range(1, 7))
        ev = [v for v in d if v % 2 == 0]
        p5 = [prob(ev, d), prob([v for v in d if v == 7], d), prob([v for v in d if v <= 6], d)]
        rows = [['일', '말로', '수로'], ['짝수가 나올 가능성', '', ''], ['7이 나올 가능성', '', ''], ['6 이하로 나올 가능성', '', '']]
        s.ask('짝수인 눈을 모두 써 보세요.')
        s.table(rows, col_mm=[80, 60, 40], row_h=3118)
        a5 = '짝수 %s / %s' % (L(ev), ' / '.join('%s·%s' % (W3[cat3(x)], frac_txt(x)) for x in p5))
        ans = '7차시  ① %s   ② %s   ③ %s   ④ 0, 1/2, 1   ⑤ %s' % (a1, a2, ' / '.join(a3), a5)
    else:  # 도전형
        ans = htb7(s, lv)
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '수학익힘 — 가능성을 수로')
        cards = [1, 3, 5, 7, 9, 11]
        q = [('검은색 바둑돌 3개, 흰색 바둑돌 3개 중 흰색일 가능성', F(3, 6)), ('제비 6개 중 당첨 제비 3개, 당첨될 가능성', F(3, 6))]
        a6 = qa(s, [(t, frac_txt(x)) for t, x in q])
        s.ask('가능성이 0인 것은? ㉠ 423명 중 생일이 같은 사람이 있을 것입니다. ㉡ 1번부터 10번까지 번호표 중 한 장을 뽑으면 15번이 나올 것입니다.')
        assert 423 > 366
        s.text('수 카드 1, 3, 5, 7, 9, 11 중 한 장을 뽑아요.')
        cc = [('2의 배수일 가능성', prob([c for c in cards if c % 2 == 0], cards)),
              ('9의 약수일 가능성', prob([c for c in cards if 9 % c == 0], cards)),
              ('12보다 작은 수일 가능성', prob([c for c in cards if c < 12], cards)),
              ('홀수일 가능성', prob([c for c in cards if c % 2], cards))]
        a7 = qa(s, [(t, '') for t, _ in cc], col=(120, 60))
        why(s, '9의 약수일 가능성을 그렇게 정한 까닭을 써 보세요.', 1)
        ans += '   ⑥ %s, ㉡, %s (9의 약수 1, 3, 9는 6장 중 3장)' % (' / '.join(a6), ' / '.join('%s %s' % (t[:-5], frac_txt(x)) for t, x in cc))
    return ans


def tb8(s, lv):
    s.lesson(8, '탐구 정리하기(O)', '생각을 더하다 ― 여러 번 던져도 가능성이 같을까요', '동전이나 주사위를 여러 번 던지면 가능성은 어떻게 될까요?')
    s.scene(None, '“동전을 던져서 누가 간식을 먹을지 정하자! 그림면이 나오면 내가 먹을래.” “또 그림면이 나왔네! 왜 그림면만 나오는 거야?”')
    if lv == '기본형':
        step(s, 0, '동전의 가능성', '동전 한 개를 던질 때')
        s.fill(['그림면이 나올 가능성은 %s이고 수로 %s이에요.' % (ch(lv, W3, 10), ch(lv, ['0', '1/2', '1'], 6)),
                '숫자 면이 나올 가능성은 수로 %s이에요. 두 가능성은 %s.' % (ch(lv, ['0', '1/2', '1'], 6), ch(lv, ['같아요', '달라요'], 8))])
        step(s, 1, '동전 10번', '던지고 기록하기')
        record10(s, 'coin')
        a2 = qa(s, [('그림면이 나온 횟수', '', '번'), ('숫자 면이 나온 횟수', '', '번')])
        s.choices([('동전을 10번 던지면 그림면과 숫자 면이 꼭 5번씩 나올까요?', '( 네, 꼭 5번씩 나와요 /\n아니요, 5번씩 나오지 않을 수도 있어요 )')])
        step(s, 2, '동전 여러 번', '모둠 친구들의 결과 더하기')
        s.text('모둠 친구들의 결과를 더하듯이 동전을 120번까지 던져 기록해 보세요.')
        record_cum(s, 'coin')
        s.choices([('던진 횟수가 많아질수록 그림면과 숫자 면이 나온 횟수는', opt('비슷해져요', '점점 크게 달라져요', '늘 똑같아요'))])
        step(s, 3, '주사위의 가능성', '홀수와 짝수')
        s.picture(fig('dice', svg_dice()), width_mm=100)
        d = list(range(1, 7))
        odd = [v for v in d if v % 2]
        po = prob(odd, d)
        assert po == F(1, 2)
        s.fill('홀수인 눈 (              ),  홀수가 나올 가능성 %s,  짝수가 나올 가능성 %s → 두 가능성은 %s' % (
            ch(lv, ['0', '1/2', '1'], 6), ch(lv, ['0', '1/2', '1'], 6), ch(lv, ['같아요', '달라요'], 8)))
        record10(s, 'dice')
        qa(s, [('홀수가 나온 횟수', '', '번'), ('짝수가 나온 횟수', '', '번')])
        step(s, 4, '주사위 여러 번', '120번까지 던지기')
        record_cum(s, 'dice')
        s.choices([('던진 횟수가 많아질수록 홀수와 짝수가 나온 횟수는', opt('비슷해져요', '점점 크게 달라져요')),
                   ('같은 실험을 다시 하면 표의 수는', opt('똑같이 나와요', '조금씩 달라질 수 있어요'))])
        ans = '8차시  ① 반반이다, 1/2, 1/2, 같아요   ② %s, 아니요   ③ %s, 비슷해져요   ④ 홀수 %s, 1/2, 1/2, 같아요, %s   ⑤ %s, 비슷해져요, 조금씩 달라질 수 있어요' % (
            sim10_answer(81, 'coin'), cum_answer(82, 'coin'), L(odd), sim10_answer(83, 'dice'), cum_answer(84, 'dice'))
    else:  # 도전형
        ans = htb8(s, lv)
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '실험 결과를 보고 생각하기')
        s.choices([('동전을 던졌더니 앞, 뒤, 앞, 앞, 뒤가 나왔어요. 다음에 던지면?', '( 반드시 뒤가 나와요 / 반드시 앞이 나와요 /\n앞과 뒤가 나올 가능성은 여전히 반반이에요 )')])
        tb = [(40, 16, 24), (60, 27, 33), (80, 38, 42), (100, 49, 51), (120, 59, 61)]
        assert all(a + b == m for m, a, b in tb)
        s.table([['던진 횟수(번)'] + [str(m) for m, _, _ in tb], ['그림면(번)'] + [str(a) for _, a, _ in tb], ['숫자 면(번)'] + [str(b) for _, _, b in tb]],
                header=True, header_col=True, col_mm=[40] + [28] * 5)
        dif = [abs(F(a, m) - F(1, 2)) for m, a, _ in tb]
        assert all(dif[i] >= dif[i + 1] for i in range(4))
        s.ask('던진 횟수가 많아질수록 그림면이 나온 횟수는 던진 횟수의 ( 절반 / 2배 / 4분의 1 )에 가까워져요.', blank=False)
        why(s, '앞에서 그림면이 많이 나와도 다음에 던질 때의 가능성이 같은 까닭을 써 보세요.', 1)
        ans += '   ⑥ 여전히 반반이에요, 절반 (120번 중 59번, 절반은 60번), 동전은 앞의 결과를 기억하지 못해요'
    return ans


def tb9(s, lv):
    s.lesson(9, '탐구 정리하기(O)', '놀이를 더하다 ― 누가 더 평균에 가까울까요', '모둠 기록의 평균에 가장 가까운 친구는 누구일까요?')
    s.scene(None, '‘누가 더 평균에 가까울까요’ 놀이를 해요. (인원 4명, 준비물: 계산기, 줄넘기, 초시계, 줄자)')
    if lv == '기본형':
        step(s, 0, '놀이 방법', '차례 정하기')
        items = ['기록을 측정해요.', '평균을 구할 주제를 정해요.', '평균에 가장 가까운 사람을 찾아요.', '표에 제목, 이름, 기록을 적어요.', '다른 주제를 정하여 되풀이해요.']
        order = [1, 0, 3, 2, 4]
        s.table([['차례', '할 일']] + [['(    )', t] for t in items], col_mm=[25, 155])
        rank = {idx: k + 1 for k, idx in enumerate(order)}
        a1 = ', '.join(str(rank[i]) for i in range(5))
        step(s, 1, '평균 구하기', '가은이네 모둠의 네 가지 기록')
        rows = [['주제'] + TB_NM9 + ['평균']]
        for t, u, recs, a, nr in TB_T9:
            m = avg(recs)
            assert m == F(str(a)) and nearest(recs, m) == nr
            rows.append(['%s(%s)' % (t, u)] + [str(v) for v in recs] + ['(        )'])
        s.table(rows, col_mm=[50, 24, 24, 24, 24, 34], row_h=3402)
        if lv == '기본형':
            s.text('네 사람의 기록을 모두 더하여 4로 나눠요. 계산기를 써도 돼요.')
        a2 = ', '.join('%s %s%s' % (t, fmt(avg(r)), ' ' + u if u == 'cm' else u) for t, u, r, _, _ in TB_T9)
        step(s, 2, '가장 가까운 사람', '기록과 평균의 차이')
        s.table([['주제', '평균에 가장 가까운 사람']] + [[t, opt(*TB_NM9) if lv == '기본형' else '(            )'] for t, _, _, _, _ in TB_T9], col_mm=[70, 110])
        a3 = ', '.join('%s %s' % (t, TB_NM9[n]) for t, _, _, _, n in TB_T9)
        step(s, 3, '우리 모둠 놀이', '주제를 고르고 기록 재기')
        s.ask('주제: (                              )   단위: (        )', blank=False)
        s.table([['이름', '나', '친구 1', '친구 2', '친구 3'], ['이름 쓰기', '', '', '', ''], ['기록', '', '', '', ''], ['평균과의 차이', '', '', '', '']],
                header=True, header_col=True, col_mm=[40, 35, 35, 35, 35], row_h=3402)
        s.ask('모둠 기록의 평균: (            )   평균에 가장 가까운 친구: (            )', blank=False)
        step(s, 4, '또 다른 놀이', '비밀 숫자 찾기 연습')
        picks = [4, 9, 6, 3]
        m5 = 6
        sec = m5 * 5 - sum(picks)
        assert sec == 8 and avg(picks + [sec]) == m5
        s.text('가은 4, 도윤 9, 지민 6, 현우 3을 골랐어요. 설계자는 “5개 수의 평균은 6이야.”라고 알려 주었어요.')
        a5 = qa(s, [('5개 수의 합계: 6 × 5 =', m5 * 5), ('설계자의 비밀 숫자: 30 − (4 + 9 + 6 + 3) =', sec)])
        ans = '9차시  ① (위에서부터) %s   ② %s   ③ %s   ④ (모둠마다 다름)   ⑤ %s' % (a1, a2, a3, ' / '.join(a5))
    else:  # 도전형
        ans = htb9(s, lv)
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '설계자가 되어 보기')
        pk = [10, 7, 16, 9]
        cand = [3, 5, 8, 10, 13, 15, 18, 20]
        ok = [c for c in cand if (sum(pk) + c) % 5 == 0]
        assert ok == [3, 8, 13, 18] and avg(pk + [13]) == 11
        s.text('친구들이 10, 7, 16, 9를 골랐어요. 5개 수의 평균이 자연수가 되도록 20 이하의 비밀 숫자를 정하려고 해요.')
        s.ask('비밀 숫자가 될 수 있는 수에 모두 ○:  3   5   8   10   13   15   18   20', blank=False)
        a6 = qa(s, [('비밀 숫자를 13으로 정했을 때 5개 수의 평균', fmt(avg(pk + [13])))])
        why(s, '비밀 숫자가 될 수 있는 수를 어떻게 찾았는지 써 보세요.', 1)
        ans += '   ⑥ %s, %s (42에 더해 5로 나누어떨어지는 수)' % (L(ok), a6[0])
    return ans


def tb10(s, lv):
    s.lesson(10, '발표하기(P)', '공부한 내용을 확인해요', '평균과 가능성에 대해 공부한 내용을 잘 알고 있나요?')
    s.scene(None, '송년 잔치에서 배운 평균과 가능성을 정리해요.')
    if lv == '기본형':
        step(s, 0, '고르게 하기', '1번 · 은찬이의 회별 고리 던지기 기록')
        v1 = [3, 1, 2, 2]
        m1, mv = level_steps(v1)
        assert m1 == 2
        s.picture(fig('tb10cir', svg_stack(['1회', '2회', '3회', '4회'], v1, 'circle', '은찬이의 회별 고리 던지기 기록')), width_mm=95)
        a1 = qa(s, [('○를 옮겨 고르게 하면 고리 던지기 기록의 평균', m1, '개')])
        step(s, 1, '평균 구하기', '2번 · 도서관 이용객 수')
        v2 = [148, 150, 146, 152, 154]
        hdata(s, ['월', '화', '수', '목', '금'], v2, '요일', '이용객 수(명)')
        assert (total(v2), avg(v2)) == (750, 150)
        a2 = qa(s, [('(148 + 150 + 146 + 152 + 154) =', fmt(total(v2)), '명'), ('이용객 수의 평균: 750 ÷ 5 =', fmt(avg(v2)), '명')])
        step(s, 2, '가능성 비교', '3~4번 · 주머니와 회전판')
        bags = [('가', [(GREEN, '초', 3), (YEL, '노', 3)]), ('나', [(GREEN, '초', 6)]), ('다', [(GREEN, '초', 5), (YEL, '노', 1)]),
                ('라', [(GREEN, '초', 1), (YEL, '노', 5)]), ('마', [(YEL, '노', 6)])]
        py = [F(sum(m for _, k, m in it if k == '노'), 6) for _, it in bags]
        o3 = rank_order([n for n, _ in bags], py)
        assert o3 == ['마', '라', '가', '다', '나']
        s.picture(fig('tb10bag', svg_bags(bags)), width_mm=172)
        s.ask('3. 노란색 구슬이 나올 가능성이 높은 주머니부터:  (     ) → (     ) → (     ) → (     ) → (     )', blank=False)
        sp = [('㉠', [(F(3, 4), RED, '빨'), (F(1, 8), YEL, '노'), (F(1, 8), BLUE, '파')]),
              ('㉡', [(F(1, 3), RED, '빨'), (F(1, 3), YEL, '노'), (F(1, 3), BLUE, '파')]),
              ('㉢', [(F(1, 4), RED, '빨'), (F(1, 4), YEL, '노'), (F(1, 2), BLUE, '파')])]
        s.picture(fig('tb10sp', svg_spinners(sp, 70)), width_mm=120)
        fr = [[next(f for f, c, _ in secs if c == col) for col in (RED, YEL, BLUE)] for _, secs in sp]
        tabs = [[16, 17, 17], [13, 12, 25], [37, 7, 6]]
        mt = ['㉠㉡㉢'[match_spinner(fr, t)] for t in tabs]
        assert mt == ['㉡', '㉢', '㉠']
        s.text('4. 회전판을 50회 돌린 결과 표와 알맞은 회전판을 이어 보세요.')
        s.table([['표', '빨간색', '노란색', '파란색', '회전판']] + [['표 %s' % '①②③'[i]] + [str(v) for v in t] + ['(      )'] for i, t in enumerate(tabs)],
                col_mm=[30, 35, 35, 35, 45])
        step(s, 3, '말과 수 · 평균 활용', '5~6번')
        c8 = list(range(1, 9))
        pe, p9 = prob([v for v in c8 if v % 2 == 0], c8), prob([v for v in c8 if v >= 9], c8)
        s.text('5. 1부터 8까지의 수 카드 8장이 든 상자에서 카드 한 장을 꺼내요.')
        s.choices([('짝수일 가능성을 말로', opt(*W3)), ('9 이상일 가능성을 수로', opt('0', '1/2', '1'))])
        s.text('6. 예린: 통 8개, 통 한 개에 평균 65마리 / 윤호: 통 6개, 통 한 개에 평균 90마리')
        a4 = qa(s, [('예린이가 접은 종이학: 65 × 8 =', 65 * 8, '마리'), ('윤호가 접은 종이학: 90 × 6 =', 90 * 6, '마리'),
                    ('종이학을 더 많이 접은 사람', '윤호' if 90 * 6 > 65 * 8 else '예린')])
        step(s, 4, '확인하고 정리해요', '평균과 가능성')
        v5 = [20, 18, 25]
        assert (total(v5), avg(v5)) == (63, 21)
        s.fill('평균은 자룟값을 모두 더한 수를 %s로 나눈 값이에요.' % ch(lv, ['자료의 수', '가장 큰 자룟값'], 10))
        a5 = qa(s, [('자료 20, 18, 25의 평균: (20 + 18 + 25) ÷ 3 =', fmt(avg(v5)))])
        d = list(range(1, 7))
        cards = [('주사위 눈의 수가 0일 가능성', prob([v for v in d if v == 0], d)), ('5보다 클 가능성', prob([v for v in d if v > 5], d)),
                 ('홀수일 가능성', prob([v for v in d if v % 2], d)), ('2 이상일 가능성', prob([v for v in d if v >= 2], d)),
                 ('6 이하일 가능성', prob([v for v in d if v <= 6], d))]
        s.text('주사위 한 개를 던졌을 때 나온 눈의 수가 … 가능성을 가능성 띠에 놓아 보세요.')
        a6 = scale_cards(s, lv, cards, nums=True)
        ans = '10차시  ① %s   ② %s   ③ 3번 %s, 4번 표① %s, 표② %s, 표③ %s   ④ %s, %s, %s   ⑤ 자료의 수, %s, %s' % (
            a1[0], ' / '.join(a2), ' → '.join(o3), mt[0], mt[1], mt[2], W3[cat3(pe)], frac_txt(p9), ' / '.join(a4), a5[0], a6)
    else:  # 도전형
        ans = htb10(s, lv)
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '평균 놀이 문제와 단원 정리')
        got = [3, 7, 5]
        need = 6 * 4 - sum(got)
        assert need == 9 and need not in got and avg(got + [need]) == 6
        s.text('모둠원 3명이 1~9 수 카드 중 3, 7, 5를 뽑았어요. 한 장을 더 가져와 4장의 평균을 6으로 만들려고 해요.')
        a7 = qa(s, [('가져와야 할 카드', need)])
        why(s, '그 카드를 어떻게 찾았는지 써 보세요.', 1)
        s.ask('이 단원에서 기억에 남는 내용을 나만의 방법(글, 그림, 기호 등)으로 정리해 보세요.', blank=False)
        s.lines(3)
        ans += '   ⑥ %s (6 × 4 = 24, 24 − 15 = 9), 정리는 자유' % a7[0]
    return ans


TB = [tb1, tb2, tb3, tb4, tb5, tb6, tb7, tb8, tb9, tb10]


# ================================================================ 이야기 버전
KIDS = ['서준', '하윤', '민재', '예나']
ST_T9 = [('공 멀리 던지기', 'm', [21, 17, 24, 18], 20, 0), ('30초 줄넘기', '회', [50, 62, 47, 57], 54, 3),
         ('제자리멀리뛰기', 'cm', ['139.4', '146.8', '152.1', '141.3'], '144.9', 1), ('왕복 오래달리기', '회', [44, 58, 51, 53], '51.5', 2)]


def st1(s, lv):
    s.lesson(1, '개념 찾기(S)', '학급 운동회 준비 회의', '학급 운동회를 준비하면서 평균과 가능성이 필요한 곳은 어디일까요?')
    s.scene(None, '한별초등학교 5학년 3반이 학급 운동회를 열기로 했어요. 준비 위원장 서준, 기록 담당 하윤, 진행 담당 민재, 질문 대장 예나가 친구들과 함께 준비해요.')
    if lv == '기본형':
        step(s, 0, '만져 보기', '보기 · 생각하기 · 궁금해하기')
        s.picture(fig('stboard', svg_board(['모둠 줄넘기 기록으로 모둠 대표 기록 정하기', '청팀·백팀 공 넣기 기록 비교하기', '경품 뽑기 상자 만들기',
                                             '회전판 게임 만들기', '동전·주사위 실험 부스 열기'], '학급 운동회 준비할 일')), width_mm=140)
        write_pane(s, lv, [('보여요', '칠판에 ______________________ 이 보여요.'), ('생각해요', '____________ 하려면 ____________ 을 알아야 해요.'),
                           ('궁금해요', '______________________ 은 어떻게 정할까?')])
        step(s, 1, '그려 보기', '운동장 둘러보기')
        places = [('기록판', 0), ('팀 나누기', 0), ('이어달리기', 0), ('경품 뽑기', 1), ('회전판 게임', 1), ('실험 부스', 1)]
        s.text('운동장 여섯 곳에서 무엇을 알아봐야 할지 골라 보세요.')
        s.choices([(t, opt('평균', '가능성')) for t, _ in places])
        a2 = ', '.join('%s %s' % (t, ['평균', '가능성'][k]) for t, k in places)
        step(s, 2, '말해 보기', '평균일까, 가능성일까')
        items = [('우리 모둠 줄넘기 기록을 대표하는 값 정하기', 0), ('동전을 던져 청팀이 먼저 할 정도 알아보기', 1),
                 ('청팀과 백팀의 공 넣기 기록 비교하기', 0), ('경품 뽑기에서 당첨 카드가 나올 정도 알아보기', 1)]
        s.choices([(q, opt('평균', '가능성')) for q, _ in items])
        thenwhy(s, lv, '경품 뽑기에서 당첨 카드가 나올 정도가 가능성과 관련 있는 까닭은?',
                '경품 뽑기는 무엇이 나올지 ( 미리 알 수 있으므로 / 미리 알 수 없으므로 ), 당첨 카드가 나오길 ( 기대할 수 있는 정도 / 대표하는 값 )인 가능성과 관련 있어요.')
        a3 = ', '.join(['평균', '가능성'][k] for _, k in items)
        step(s, 3, '약속하기', '4학년 때 배운 그래프')
        bn, bv = ['이어달리기', '줄다리기', '공 넣기', '2인 3각'], [9, 6, 4, 7]
        hdata(s, bn, bv, '경기', '학생 수(명)')
        s.picture(fig('st1bar', svg_bars(bn, bv, 10, 1, '하고 싶은 경기별 학생 수', '경기', '학생 수', '명', draw=False)), width_mm=115)
        tn, tv = ['9시', '10시', '11시', '12시', '1시'], [11, 13, 16, 18, 19]
        s.picture(fig('st1line', svg_linegraph(tn, tv, 10, 20, 2, '운동회 날 운동장의 기온', '℃')), width_mm=105)
        rise = [tv[i + 1] - tv[i] for i in range(4)]
        big = rise.index(max(rise))
        assert rise.count(max(rise)) == 1 and big == 1
        spans = ['%s와 %s 사이' % (tn[i], tn[i + 1]) for i in range(4)]
        a4 = qa(s, [('11시의 운동장 기온', tv[2], '℃')])
        s.choices([('기온이 가장 많이 오른 때는?', opt(*spans[:2]) + '\n' + opt(*spans[2:]))])
        step(s, 4, '확인하기', '무엇을 배울까요')
        seq = ['일이 일어날 가능성을 수로 나타내기', '자료를 고르게 하여 평균의 뜻 알기', '일이 일어날 가능성을 말로 표현하기',
               '평균을 이용하여 문제 해결하기', '평균을 구하는 방법 알기', '일이 일어날 가능성을 비교하기']
        order = [1, 4, 3, 2, 5, 0]
        rank = {idx: k + 1 for k, idx in enumerate(order)}
        s.text('배우는 순서대로 번호를 써 보세요.')
        s.table([['차례', '배울 내용']] + [['(    )', t] for t in seq], col_mm=[25, 155])
        ans = '1차시  ① (자유)   ② %s   ③ %s, 미리 알 수 없으므로·기대할 수 있는 정도   ④ 막대 9·6·4·7칸, %s, %s   ⑤ (위에서부터) %s' % (
            a2, a3, a4[0], spans[big], ', '.join(str(rank[i]) for i in range(6)))
    else:  # 도전형
        ans = hst1(s, lv)
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '세로 눈금 한 칸이 2명인 막대그래프')
        n2, v2 = ['3학년', '4학년', '5학년', '6학년'], [8, 12, 16, 10]
        hdata(s, n2, v2, '학년', '도우미 수(명)')
        s.picture(fig('st1bar2', svg_bars(n2, v2, 18, 2, '학년별 도우미 수', '학년', '도우미 수', '명', draw=False)), width_mm=110)
        a6 = qa(s, [('5학년 16명은 눈금 몇 칸?', 16 // 2, '칸'), ('6학년 10명은 눈금 몇 칸?', 10 // 2, '칸')])
        why(s, '세로 눈금 한 칸이 2명일 때 막대의 칸 수를 어떻게 정하는지 써 보세요.', 1)
        ans += '   ⑥ 막대 4·6·8·5칸, %s' % ' / '.join(a6)
    return ans


def st2(s, lv):
    s.lesson(2, '개념 구축하기(O)', '모둠 대표 기록을 정해요 ― 평균의 뜻', '모둠마다 기록이 다를 때 대표하는 값은 어떻게 정할 수 있을까요?')
    s.scene(None, '모둠마다 운동회 응원 깃발을 만들었어요. 서준: “한 모둠이 만든 깃발 수를 대표하는 값은 몇 개라고 하면 좋을까?”')
    gn, gv = ['1모둠', '2모둠', '3모둠', '4모둠'], [6, 9, 7, 6]
    m, mv = level_steps(gv)
    assert m == 7 and mv == [(1, 0, 1), (1, 3, 1)]
    if lv == '기본형':
        step(s, 0, '만져 보기', '응원 깃발 고르게 하기')
        rule_first(s, lv, '모둠마다 다른 깃발 수를 하나의 수로 나타내려면 어떻게 하면 좋을까요?',
                   '많은 모둠의 깃발을 ( 적은 / 많은 ) 모둠으로 옮겨 모두 ( 같게 / 다르게 ) 만들면 그 수가 대표하는 수가 돼요.')
        s.picture(fig('st2blk', svg_stack(gn, gv, 'block', '모둠별로 만든 응원 깃발 수(쌓기나무 1개 = 깃발 1개)')), width_mm=110)
        a1 = qa(s, [('2모둠에서 1모둠으로 옮길 쌓기나무', 1, '개'), ('2모둠에서 4모둠으로 옮길 쌓기나무', 1, '개'), ('한 모둠이 만든 깃발 수를 대표하는 값', m, '개')])
        step(s, 1, '그려 보기', '공 넣기 연습 ○ 옮기기')
        kn, kv = ['하윤', '서준', '민재', '예나', '도현'], [3, 6, 2, 5, 4]
        m2, mv2 = level_steps(kv)
        assert m2 == 4 and total(kv) == 20
        hdata(s, kn, kv, '이름', '넣은 공(개)')
        s.picture(fig('st2cir', svg_stack(kn, kv, 'circle', '학생별 공 넣기 연습 기록')), width_mm=120)
        s.text('많이 넣은 사람의 ○를 적게 넣은 사람에게 옮기는 화살표를 그려 보세요.')
        a2 = qa(s, [('○를 고르게 하면 한 사람에', m2, '개'), ('하윤이네 모둠의 공 넣기 기록의 평균', m2, '개')])
        step(s, 2, '말해 보기', '대표하는 값 정하기')
        s.choices([('깃발 수(6개, 9개, 7개, 6개)를 대표하는 값을 정하는 방법은?', '( 6개인 모둠이 가장 많으니까 6개 /\n가장 많이 만든 9개 / 고르게 한 7개 )'),
                   ('모둠별 깃발 수처럼 자료 하나하나의 값을 무엇이라고 할까요?', opt('자룟값', '합계', '눈금'))])
        thenwhy(s, lv, '가장 많이 나온 수(6개)를 대표하는 값으로 정하면 안 되는 까닭은?',
                '6개로 정하면 ( 9개 / 6개 )를 만든 2모둠과 7개를 만든 3모둠의 깃발 수가 반영되지 않아요. 모든 모둠의 깃발 수를 ( 고르게 한 / 더한 ) 7개가 대표해요.')
        step(s, 3, '약속하기', '평균')
        s.fill('자룟값을 %s 그 자료를 대표하는 값으로 정할 수 있습니다. 이 값을 %s이라고 합니다.' % (
            ch(lv, ['고르게 하여', '모두 더하여', '가장 큰 수로']), ch(lv, ['평균', '합계', '자룟값'], 8)))
        step(s, 4, '확인하기', '반별 운동회 도우미 수')
        dn, dv = ['1반', '2반', '3반', '4반'], [11, 9, 13, 7]
        md = avg(dv)
        assert md == 10
        s.picture(fig('st2bar', svg_bars(dn, dv, 14, 1, '반별 운동회 도우미 수', '반', '도우미 수', '명', lab_every=2)), width_mm=105)
        s.text('평균을 10명쯤으로 예상하고, 넘치는 양과 모자란 양이 같아지는 높이에 빨간 선을 그어 보세요.')
        a5 = qa(s, [('1반은 10명보다 몇 명 많나요?', 11 - 10, '명'), ('2반은 10명보다 몇 명 적나요?', 10 - 9, '명'),
                    ('3반은 10명보다 몇 명 많나요?', 13 - 10, '명'), ('4반은 10명보다 몇 명 적나요?', 10 - 7, '명'), ('도우미 수의 평균', fmt(md), '명')])
        ans = '2차시  ① (예상 자유) %s   ② %s (예: %s)   ③ 고르게 한 7개, 자룟값, 9개·고르게 한   ④ 고르게 하여, 평균   ⑤ %s' % (
            ' / '.join(a1), ' / '.join(a2), moves_txt(kn, mv2, '개'), ' / '.join(a5))
        if lv == '기본형':
            ev = [5, 3, 4]
            em, _ = level_steps(ev)
            s.text('먼저 연습해요 · 반별 응원 단장 후보 수(1반 5명, 2반 3명, 3반 4명)')
            a6 = qa(s, [('1반의 ○ 1개를 2반에 옮기면 후보 수의 평균은', em, '명')])
            ans += ', 연습 %s' % a6[0]
    else:  # 도전형
        ans = hst2(s, lv)
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '아침 기온과 아침 운동 시간')
        wn, wv = ['월', '화', '수', '목', '금'], [14, 17, 15, 13, 16]
        mw = avg(wv)
        assert mw == 15
        s.picture(fig('st2tmp', svg_bars(wn, wv, 20, 1, '요일별 아침 기온', '요일', '기온', '℃', lab_every=5)), width_mm=110)
        a6 = qa(s, [('15℃보다 화요일은 몇 ℃ 더 높나요?', 17 - 15, '℃'), ('15℃보다 목요일은 몇 ℃ 더 낮나요?', 15 - 13, '℃'),
                    ('15℃보다 금요일은 몇 ℃ 더 높나요?', 16 - 15, '℃'), ('15℃보다 월요일은 몇 ℃ 더 낮나요?', 15 - 14, '℃'), ('아침 기온의 평균', fmt(mw), '℃')])
        ev = [18, 24, 20, 22]
        me, mvv = level_steps(ev)
        assert me == 21
        hdata(s, ['예나', '도현', '지아', '준우'], ev, '이름', '시간(분)')
        a7 = qa(s, [('아침 운동 시간을 고르게 하면 한 사람당', me, '분')])
        why(s, '어떻게 옮겨서 고르게 했는지 써 보세요.', 1)
        ans += '   ⑥ %s, %s (예: %s)' % (' / '.join(a6), a7[0], moves_txt(['예나', '도현', '지아', '준우'], mvv, '분'))
    return ans


def st3(s, lv):
    s.lesson(3, '개념 구축하기(O)', '콩 주머니를 나누어요 ― 평균 구하기', '평균은 어떻게 구할 수 있을까요?')
    s.scene(None, '콩 주머니 던지기에 쓸 바구니 4개에 콩 주머니가 다르게 들어 있어요. 민재: “쌓기나무 말고 다른 방법으로 고르게 할 수 없을까?”')
    rn, rv = ['빨강 바구니', '파랑 바구니', '노랑 바구니', '초록 바구니'], [8, 5, 9, 6]
    t1, m1 = total(rv), avg(rv)
    assert (t1, m1) == (28, 7)
    if lv == '기본형':
        step(s, 0, '만져 보기', '콩 주머니 띠 이어 붙이기')
        s.picture(fig('st3strip', svg_strips(rn, rv, '개', True)), width_mm=172)
        s.text('이어 붙인 띠를 4등분하는 선을 그어 보세요.')
        a1 = qa(s, [('콩 주머니는 모두 8 + 5 + 9 + 6 =', fmt(t1), '개'), ('4등분한 띠 한 칸에는 28 ÷ 4 =', fmt(m1), '개'),
                    ('바구니 한 개에 든 콩 주머니 수의 평균', fmt(m1), '개')])
        step(s, 1, '그려 보기', '서준이의 1분 줄넘기 기록 띠')
        sv = [112, 118, 109, 121, 115]
        t2, m2 = total(sv), avg(sv)
        assert (t2, m2) == (575, 115)
        hdata(s, ['1일', '2일', '3일', '4일', '5일'], sv, '날짜', '기록(회)')
        s.picture(fig('st3strip2', svg_strips(['1일', '2일', '3일', '4일', '5일'], sv, '회', False)), width_mm=165)
        a2 = qa(s, [('기록을 모두 더하면', fmt(t2), '회'), ('기록을 잰 날은', 5, '일'), ('평균: 575 ÷ 5 =', fmt(m2), '회')])
        step(s, 2, '말해 보기', '띠와 계산 잇기')
        s.fill(['종이띠를 이어 붙이는 것은 자룟값을 %s 것과 같아요.' % ch(lv, ['모두 더하는', '모두 빼는', '곱하는']),
                '이어 붙인 띠를 4등분하는 것은 %s로 나누는 것과 같아요.' % ch(lv, ['자료의 수', '가장 큰 자룟값', '콩 주머니 한 개'])])
        thenwhy(s, lv, '콩 주머니 띠를 3등분이나 5등분이 아니라 4등분한 까닭은?',
                '바구니가 ( 4 / 28 )개라서 자료의 수가 4이므로, 4등분해야 바구니 한 개에 ( 고르게 / 모두 ) 들어가는 수를 알 수 있어요.')
        step(s, 3, '약속하기', '평균 구하는 식')
        s.fill(['평균은 자룟값을 모두 더한 수를 %s로 나누어서 구합니다.' % ch(lv, ['자료의 수', '가장 큰 수', '2']),
                '(평균) = %s ÷ %s' % (ch(lv, ['자룟값을 모두 더한 수', '자료의 수'], 16), ch(lv, ['자료의 수', '평균'], 10))])
        step(s, 4, '확인하기', '줄넘기 연습 시간, 운동장을 쓴 학생 수')
        jv = [35, 42, 28, 39]
        uv = [184, 205, 198, 176, 220, 213, 190]
        assert (total(jv), avg(jv), total(uv), avg(uv)) == (144, 36, 1386, 198)
        hdata(s, KIDS, jv, '이름', '시간(분)')
        a5 = qa(s, [('우리 모둠의 줄넘기 연습 시간의 평균', fmt(avg(jv)), '분')])
        hdata(s, ['1일', '2일', '3일', '4일', '5일', '6일', '7일'], uv, '날짜', '학생 수(명)')
        if lv == '기본형':
            s.wordbox(['모두 더하기', '자료의 수 7로 나누기', '계산기를 써도 돼요'])
        a6 = qa(s, [('184 + 205 + 198 + 176 + 220 + 213 + 190 =', fmt(total(uv)), '명'), ('운동장을 쓴 학생 수의 평균: 1386 ÷ 7 =', fmt(avg(uv)), '명')])
        ans = '3차시  ① %s   ② %s   ③ 모두 더하는, 자료의 수, 4·고르게   ④ 자료의 수, 자룟값을 모두 더한 수, 자료의 수   ⑤ %s / %s' % (
            ' / '.join(a1), ' / '.join(a2), a5[0], ' / '.join(a6))
    else:  # 도전형
        ans = hst3(s, lv)
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '운동회 준비 위원회가 조사한 자료')
        pn, pv = ['가', '나', '다', '라', '마'], [9800, 10500, 9200, 11000, 9500]
        tp, mp = total(pv), avg(pv)
        hi = [pn[i] for i, v in enumerate(pv) if v > mp]
        assert (tp, mp, hi) == (50000, 10000, ['나', '라'])
        hdata(s, pn, pv, '가게', '가격(원)')
        a7 = qa(s, [('팀 티셔츠 가격의 합', fmt(tp), '원'), ('가격의 평균', fmt(mp), '원'), ('평균보다 비싼 가게를 모두', L(hi))])
        r2, p2 = [19, 22, 20, 23], [96, 104, 100, 92, 108]
        assert (total(r2), avg(r2), total(p2), avg(p2)) == (84, 21, 500, 100)
        a8 = qa(s, [('예나네 모둠 100 m 달리기(19초, 22초, 20초, 23초) 기록의 평균', fmt(avg(r2)), '초'),
                    ('서준이의 맥박 수(96회, 104회, 100회, 92회, 108회)의 평균', fmt(avg(p2)), '회')])
        why(s, '맥박 수의 평균을 500회라고 쓴 친구에게 무엇이 틀렸는지 알려 주세요.', 1)
        ans += '   ⑥ %s / %s (500은 합이라 5로 나누어야 해요)' % (' / '.join(a7), ' / '.join(a8))
    return ans


def st4(s, lv):
    s.lesson(4, '개념 구축하기(O)', '청팀과 백팀, 어느 팀이 잘했을까 ― 평균 활용', '평균을 이용하여 어떤 문제를 해결할 수 있을까요?')
    s.scene(None, '공 넣기 예선에서 청팀은 3명, 백팀은 5명이 공을 넣었어요. 민재: “백팀이 모두 더 많이 넣었으니 백팀이 이긴 거 아니야?”')
    cv, bv = [8, 6, 10], [7, 9, 5, 6, 8]
    assert (total(cv), total(bv), avg(cv), avg(bv)) == (24, 35, 8, 7)
    if lv == '기본형':
        step(s, 0, '만져 보기', '청팀과 백팀 비교하기')
        rule_first(s, lv, '사람 수가 다른 두 팀의 기록을 공정하게 비교하려면 어떻게 하면 좋을까요?',
                   '두 팀의 기록을 각각 ( 고르게 / 모두 더 ) 하여 한 사람당 넣은 공의 수를 구해 비교해요.')
        s.picture(fig('st4c', svg_stack(['1번', '2번', '3번'], cv, 'block', '청팀 공 넣기 기록(쌓기나무 1개 = 공 1개)')), width_mm=80)
        s.picture(fig('st4b', svg_stack(['1번', '2번', '3번', '4번', '5번'], bv, 'block', '백팀 공 넣기 기록(쌓기나무 1개 = 공 1개)')), width_mm=115)
        a1 = qa(s, [('넣은 공의 합계: 청팀', 24, '개'), ('넣은 공의 합계: 백팀', 35, '개'), ('청팀의 평균: (8 + 6 + 10) ÷ 3 =', 8, '개'),
                    ('백팀의 평균: (7 + 9 + 5 + 6 + 8) ÷ 5 =', 7, '개')])
        s.choices([('평균이 더 높아 더 잘했다고 할 수 있는 팀은?', opt('청팀', '백팀'))])
        step(s, 1, '그려 보기', '빠진 반의 기록(평균 25개)')
        cn = ['1반', '2반', '3반', '4반', '5반', '6반']
        vv = [30, 22, None, 28, 19, 24]
        known = [v for v in vv if v is not None]
        tt = 25 * 6
        x3 = tt - sum(known)
        allv = vv[:2] + [x3] + vv[3:]
        below = [cn[i] for i, v in enumerate(allv) if v < 25]
        assert (tt, sum(known), x3, below) == (150, 123, 27, ['2반', '5반', '6반'])
        hdata(s, cn, ['30', '22', '?', '28', '19', '24'], '반', '응원 도구 수(개)')
        s.picture(fig('st4bar', svg_bars(cn, vv, 40, 5, '반별 응원 도구 수', '반', '응원 도구 수', '개', unknown=2, avgline=25)), width_mm=125)
        s.text('빨간 점선은 평균 25개예요. 3반 막대를 그려 보세요.')
        a2 = qa(s, [('전체 응원 도구 수: 25 × 6 =', tt, '개'), ('아는 반의 합: 30 + 22 + 28 + 19 + 24 =', sum(known), '개'),
                    ('3반: 150 − 123 =', x3, '개'), ('응원 도구 수가 평균보다 적은 반을 모두', L(below))])
        step(s, 2, '말해 보기', '합계와 평균')
        s.fill('백팀의 공 넣기 합계가 더 크지만 두 팀의 %s 합계로 비교하면 알맞지 않아요. 사람 수가 다른 두 집단은 %s으로 비교해요.' % (
            ch(lv, ['참가한 사람 수가 달라서', '기록이 모두 같아서']), ch(lv, ['평균', '가장 높은 기록', '합계'], 8)))
        thenwhy(s, lv, '백팀의 합계가 더 큰데도 청팀이 더 잘했다고 할 수 있는 까닭은?',
                '두 팀은 참가한 사람 수가 달라요. 평균은 청팀이 (      )개, 백팀이 (      )개라서 ( 청팀 / 백팀 )이 더 잘했어요.')
        step(s, 3, '약속하기', '모르는 자룟값 구하기')
        s.fill(['평균을 알면 (평균) %s (자료의 수)로 전체 합을 구할 수 있어요.' % ch(lv, ['×', '+', '÷'], 6),
                '전체 합에서 아는 자룟값을 모두 %s 모르는 자룟값을 구할 수 있어요.' % ch(lv, ['빼면', '더하면', '곱하면'], 8)])
        step(s, 4, '확인하기', '평균이 같은 두 모둠')
        sv = [7, 5, 9, 7]
        ms = avg(sv)
        hv = [6, 8, 9, 4]
        th = ms * 5
        xe = th - sum(hv)
        assert (ms, th, xe) == (7, 35, 8)
        hdata(s, ['서준', '준우', '지아', '도현'], sv, '서준이네 모둠', '기록(개)')
        hdata(s, ['하윤', '민재', '예나', '수아', '태오'], ['6', '8', '?', '9', '4'], '하윤이네 모둠', '기록(개)')
        a5 = qa(s, [('서준이네 모둠 기록의 평균: (7 + 5 + 9 + 7) ÷ 4 =', fmt(ms), '개'), ('하윤이네 모둠 기록의 합: 7 × 5 =', fmt(th), '개'),
                    ('예나: 35 − (6 + 8 + 9 + 4) =', fmt(xe), '개')])
        ans = '4차시  ① (예상 자유) %s, 청팀   ② %s   ③ 참가한 사람 수가 달라서, 평균, 8·7·청팀   ④ ×, 빼면   ⑤ %s' % (
            ' / '.join(a1), ' / '.join(a2), ' / '.join(a5))
    else:  # 도전형
        ans = hst4(s, lv)
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '운동회 준비 위원회의 문제')
        cls = ['1반', '2반', '3반', '4반']
        nst, got = [20, 25, 24, 22], [120, 125, 96, 88]
        per = [F(g, n) for g, n in zip(got, nst)]
        assert per == [6, 5, 4, 4]
        s.table([['반'] + cls, ['학생 수(명)'] + [str(v) for v in nst], ['주운 쓰레기(개)'] + [str(v) for v in got], ['한 학생당(개)'] + [''] * 4],
                header=True, header_col=True, col_mm=[44] + [34] * 4, row_h=3118)
        best = cls[per.index(max(per))]
        m3 = 19 * 4 - (18 + 22 + 15)
        y5 = 21 * 5 - (21 + 17 + 19 + 23)
        assert (m3, y5) == (21, 25) and avg([18, 22, m3, 15]) == 19
        a6 = qa(s, [('한 학생당 주운 쓰레기가 가장 많은 반', best),
                    ('민재의 2단 뛰기 3회 기록(1회 18번, 2회 22번, 4회 15번, 평균 19번)', m3, '번'),
                    ('예나(21 m, 17 m, 19 m, 23 m)가 5회까지 평균 21 m 이상이 되려면 5회에 적어도', y5, ' m')])
        why(s, '예나가 5회에 던져야 할 거리를 어떻게 구했는지 써 보세요.', 1)
        ans += '   ⑥ 한 학생당 %s개, %s (21 × 5 − 80)' % (L(fmt(p) for p in per), ' / '.join(a6))
    return ans


def st5(s, lv):
    s.lesson(5, '개념 구축하기(O)', '운동회 날 일어날 일 ― 가능성을 말로 표현하기', '일이 일어날 가능성을 어떤 말로 표현할 수 있을까요?')
    s.scene(None, '민재가 운동회 간식으로 초코우유 3개와 바나나우유 3개를 상자에 넣었어요. 딸기우유는 준비하지 않았고, 옆의 물 바구니에는 물만 들어 있어요.')
    if lv == '기본형':
        step(s, 0, '만져 보기', '간식 상자에서 꺼내기(꺼낸 것은 다시 넣어요)')
        s.picture(fig('st5box', svg_bags([('간식 상자', [('#8B5A2B', '초', 3), ('#F2D04B', '바', 3)])], 'box')), width_mm=55)
        p = [F(1), F(3, 6), F(3, 6), F(0)]
        qs = ['물만 든 물 바구니에서 물이 나올 가능성은', '간식 상자에서 초코우유가 나올 가능성은', '간식 상자에서 바나나우유가 나올 가능성은',
              '간식 상자에서 딸기우유가 나올 가능성은']
        s.choices([(q, opt(*W3)) for q in qs])
        a1 = ', '.join(W3[cat3(x)] for x in p)
        step(s, 1, '그려 보기', '가능성 띠에 카드 놓기')
        n10 = list(range(1, 11))
        cards = [('운동회 날 하루는 25시간일 것입니다.', F(0)), ('주사위를 5번 던지면 5번 모두 6이 나올 것입니다.', F(1, 6) ** 5),
                 ('동전을 던져 먼저 할 팀을 정할 때 청팀이 먼저 할 것입니다.', F(1, 2)),
                 ('1부터 10까지의 번호표 중 한 장을 뽑으면 2 이상의 수가 나올 것입니다.', prob([v for v in n10 if v >= 2], n10)),
                 ('운동회가 수요일이면 하루 뒤는 목요일일 것입니다.', F(1))]
        a2 = scale_cards(s, lv, cards)
        step(s, 2, '말해 보기', '응원 막대 뽑기(파란 막대 2개, 노란 막대 6개)')
        s.picture(fig('st5bag', svg_bags([('응원 막대 주머니', [(BLUE, '파', 2), (YEL, '노', 6)])])), width_mm=55)
        pb, py = F(2, 8), F(6, 8)
        s.choices([('꺼낼 때 나올 수 있는 막대에 모두 ○', '( 파란 막대 / 노란 막대 / 빨간 막대 )'),
                   ('파란 막대가 나올 가능성은', '( 불가능하다 / ~아닐 것 같다 /\n반반이다 / ~일 것 같다 / 확실하다 )'),
                   ('노란 막대가 나올 가능성은', '( 불가능하다 / ~아닐 것 같다 /\n반반이다 / ~일 것 같다 / 확실하다 )')])
        thenwhy(s, lv, '노란 막대가 나올 가능성을 ‘~일 것 같다’라고 한 까닭은?',
                '노란 막대가 (      )개, 파란 막대가 (      )개라서 노란 막대가 더 ( 많으므로 / 적으므로 ), 노란 막대가 나올 가능성이 반반보다 높아요.')
        a3 = '파란 막대·노란 막대, %s, %s, 6·2·많으므로' % (W5[cat5(pb)], W5[cat5(py)])
        step(s, 3, '약속하기', '가능성')
        s.fill(['어떠한 상황에서 특정한 일이 일어나길 기대할 수 있는 정도를 %s이라고 합니다.' % ch(lv, ['가능성', '평균', '자룟값'], 8),
                '가능성은 불가능하다, ~아닐 것 같다, %s, ~일 것 같다, %s 등으로 표현할 수 있습니다.' % (
                    ch(lv, ['반반이다', '고르다', '평균이다'], 10), ch(lv, ['확실하다', '많다', '적다'], 10))])
        step(s, 4, '확인하기', '잘못 말한 친구 찾기')
        assert 6 * 4 == 24 and 10 + 2 == 12
        s.text('하윤: “지금은 오전 10시니까 2시간 후에 낮 12시일 가능성은 ‘확실하다’야.”')
        s.text('민재: “계산기에 6, ×, 4, =을 차례대로 누르면 20이 나올 가능성은 ‘불가능하다’야.”')
        s.text('예나: “○× 퀴즈의 정답이 ○일 가능성은 ‘확실하다’야.”')
        s.choices([('가능성을 잘못 말한 사람은?', opt('하윤', '민재', '예나')),
                   ('그 사람의 말을 바르게 고치면, ○× 퀴즈의 정답이 ○일 가능성은', opt('반반이다', '불가능하다'))])
        ans = '5차시  ① %s   ② %s   ③ %s   ④ 가능성, 반반이다, 확실하다   ⑤ 예나, 반반이다' % (a1, a2, a3)
    else:  # 도전형
        ans = hst5(s, lv)
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '가능성을 말로 표현하는 상황 찾기')
        s.ask('‘불가능하다’로 표현할 수 있는 일을 쓰고 까닭도 써 보세요.', blank=False)
        s.lines(2)
        s.ask('‘반반이다’로 표현할 수 있는 일을 쓰고 까닭도 써 보세요.', blank=False)
        s.lines(2)
        ans += '   ⑥ (예) 운동회 날 해가 서쪽에서 뜰 가능성은 불가능하다(해는 늘 동쪽에서 뜸) / 1~10 수 카드에서 홀수가 나올 가능성은 반반이다(홀수·짝수 5장씩)'
    return ans


def st6(s, lv):
    s.lesson(6, '개념 구축하기(O)', '어느 게임이 당첨되기 쉬울까 ― 가능성 비교하기', '일이 일어날 가능성을 어떻게 비교할 수 있을까요?')
    s.scene(None, '청팀이 입을 파란 조끼를 주머니에서 꺼내요(꺼낸 것은 다시 넣어요).')
    if lv == '기본형':
        step(s, 0, '만져 보기', '팀 조끼 주머니 가·나·다')
        bags = [('가', [(BLUE, '파', 4)]), ('나', [(BLUE, '파', 2), (RED, '빨', 2)]), ('다', [(RED, '빨', 4)])]
        s.picture(fig('st6bag', svg_bags(bags)), width_mm=130)
        pr = [F(sum(m for _, k, m in it if k == '파'), sum(m for _, _, m in it)) for _, it in bags]
        assert pr == [1, F(1, 2), 0]
        order = rank_order(['가', '나', '다'], pr)
        s.choices([('파란 조끼가 나올 가능성이 확실한 주머니', opt('가', '나', '다')), ('반반인 주머니', opt('가', '나', '다')),
                   ('불가능한 주머니', opt('가', '나', '다')), ('가능성이 높은 주머니부터 차례로', opt('가, 나, 다', '다, 나, 가', '나, 가, 다'))])
        step(s, 1, '그려 보기', '회전판 게임 다섯 개(보라색 = 당첨, 하늘색 = 꽝)')
        sp = [('가', [(F(3, 4), WIN, '당첨'), (F(1, 4), LOSE, '꽝')]), ('나', [(F(1), LOSE, '꽝')]), ('다', [(F(1), WIN, '당첨')]),
              ('라', [(F(1, 2), WIN, '당첨'), (F(1, 2), LOSE, '꽝')]), ('마', [(F(1, 4), WIN, '당첨'), (F(3, 4), LOSE, '꽝')])]
        pw = [sum(f for f, c, _ in secs if c == WIN) for _, secs in sp]
        nm = [n for n, _ in sp]
        s.picture(fig('st6sp', svg_spinners(sp, 70)), width_mm=172)
        a2 = [nm[pw.index(0)], nm[pw.index(F(1, 2))], nm[pw.index(max(pw))], '가' if pw[0] > pw[4] else '마']
        if lv == '기본형':
            s.choices([('꽝에만 멈출 수 있는 회전판', opt(*nm)), ('당첨에 멈출 가능성이 반반인 회전판', opt(*nm)),
                       ('당첨에 멈출 가능성이 가장 높은 회전판', opt(*nm)), ('가와 마 중 더 높은 회전판', opt('가', '마'))])
        else:
            qa(s, [('꽝에만 멈출 수 있는 회전판', ''), ('당첨에 멈출 가능성이 반반인 회전판', ''), ('당첨에 멈출 가능성이 가장 높은 회전판', ''),
                   ('가와 마 중 더 높은 회전판', '')])
        step(s, 2, '말해 보기', '당첨되기 쉬운 차례')
        o3 = rank_order(nm, pw)
        assert o3 == ['다', '가', '라', '마', '나']
        s.ask('당첨에 멈출 가능성이 높은 회전판부터: (      ) → (      ) → (      ) → (      ) → (      )', blank=False)
        thenwhy(s, lv, '회전판 가가 라보다 당첨될 가능성이 높은 까닭은?',
                '가는 당첨 부분이 전체의 반보다 ( 넓고 / 좁고 ), 라는 당첨 부분이 꼭 반이라서, 당첨 부분이 더 넓은 가의 가능성이 더 높아요.')
        step(s, 3, '약속하기', '가능성 비교하기')
        s.fill(['가능성은 ‘%s’를 기준으로 비교할 수 있어요.' % ch(lv, ['반반이다', '확실하다', '평균'], 10),
                '주머니에 들어 있는 개수가 %s, 회전판에서 색칠된 부분이 %s 그것이 나올 가능성이 높아요.' % (
                    ch(lv, ['많을수록', '적을수록'], 10), ch(lv, ['넓을수록', '좁을수록'], 10))])
        step(s, 4, '확인하기', '결과 표로 예상하기')
        cv = [('흰색', 12, '#C9CED1'), ('노란색', 57, YEL), ('초록색', 31, GREEN)]
        assert sum(v for _, v, _ in cv) == 100
        s.table([['색', '흰색', '노란색', '초록색', '합계'], ['횟수(번)', '12', '57', '31', '100']], header=True, header_col=True, col_mm=[40, 35, 35, 35, 35])
        s.picture(fig('st6hb', svg_hbars(cv, '색별 나온 공의 횟수')), width_mm=120)
        o4 = [t for t, v, _ in sorted(cv, key=lambda x: -x[1])]
        s.choices([('흰색과 초록색 중 나올 가능성이 더 높은 색', opt('흰색', '초록색')),
                   ('나올 가능성이 높은 색부터 차례로', '( 노란색, 초록색, 흰색 /\n흰색, 초록색, 노란색 / 초록색, 노란색, 흰색 )'),
                   ('상자에 가장 많이 들어 있을 것 같은 색', opt('흰색', '노란색', '초록색'))])
        d = range(1, 7)
        pd = [prob([v for v in d if v % 3 == 0], d), prob([v for v in d if v >= 2], d), prob([v for v in d if 6 % v == 0], d)]
        bestd = '㉠㉡㉢'[pd.index(max(pd))]
        assert bestd == '㉡'
        s.ask('주사위를 한 번 던질 때 가능성이 가장 높은 것은? ㉠ 눈의 수가 3의 배수 ㉡ 눈의 수가 2 이상 ㉢ 눈의 수가 6의 약수')
        ans = '6차시  ① 확실 가, 반반 나, 불가능 다, 차례 %s   ② %s   ③ %s, 넓고   ④ 반반이다, 많을수록, 넓을수록   ⑤ 초록색, %s, 노란색, %s' % (
            ', '.join(order), ', '.join(a2), ' → '.join(o3), ', '.join(o4), bestd)
    else:  # 도전형
        ans = hst6(s, lv)
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '조건에 맞게 8칸 회전판 색칠하기')
        sols = [(r, b, 8 - r - b) for r in range(1, 9) for b in range(1, 9) if r + b <= 8 and 8 - r - b == 4 and b == 3 * r]
        assert sols == [(1, 3, 4)]
        s.text('조건: 화살이 노란색에 멈출 가능성은 ‘반반이다’이고, 파란색에 멈출 가능성은 빨간색에 멈출 가능성의 3배예요.')
        s.picture(fig('paint8', svg_paint(8)), width_mm=55)
        qa(s, [('빨간색', '', '칸'), ('파란색', '', '칸'), ('노란색', '', '칸')], col=(60, 120))
        why(s, '노란색을 몇 칸 칠해야 하는지 먼저 정한 까닭을 써 보세요.', 1)
        ans += '   ⑥ 빨간색 1칸, 파란색 3칸, 노란색 4칸(반반이려면 8칸의 절반)'
    return ans


def st7(s, lv):
    s.lesson(7, '개념 구축하기(O)', '경품 뽑기 ― 가능성을 수로 나타내기', '일이 일어날 가능성을 어떤 수로 나타낼 수 있을까요?')
    s.scene(None, '운동회 마지막 순서는 경품 뽑기예요. 금색 카드가 나오면 1등 경품을 받아요(꺼낸 카드는 다시 넣어요).')
    bags = [('가', [('#E0B43A', '금', 1), ('#B8C0C6', '은', 1)]), ('나', [('#E0B43A', '금', 2)]), ('다', [('#B8C0C6', '은', 2)])]
    pg = [F(sum(m for _, k, m in it if k == '금'), sum(m for _, _, m in it)) for _, it in bags]
    assert pg == [F(1, 2), 1, 0]
    if lv == '기본형':
        step(s, 0, '만져 보기', '경품 상자 가·나·다')
        s.picture(fig('st7bag', svg_bags(bags, 'box')), width_mm=120)
        s.choices([('상자 %s에서 금색 카드가 나올 가능성' % n, opt(*W3)) for n, _ in bags])
        a1 = ', '.join(W3[cat3(x)] for x in pg)
        step(s, 1, '그려 보기', '가능성 띠를 수로')
        rule_first(s, lv, '‘불가능하다’, ‘반반이다’, ‘확실하다’를 0부터 1까지의 수로 나타낸다면?',
                   '불가능하다는 (      ), 반반이다는 (      ), 확실하다는 (      )일 것 같아요.')
        s.picture(fig('scale3q', svg_scale(3, qmarks=True, boxes=False)), width_mm=165)
        s.fill(['불가능하다 → %s,   반반이다 → %s,   확실하다 → %s' % (ch(lv, ['0', '1/2', '1'], 6), ch(lv, ['0', '1/2', '1'], 6), ch(lv, ['0', '1/2', '1'], 6)),
                '금색 카드가 나올 가능성을 수로:  가 (      ),  나 (      ),  다 (      )'])
        a2 = '0, 1/2, 1 / 가 %s, 나 %s, 다 %s' % tuple(frac_txt(x) for x in pg)
        step(s, 2, '말해 보기', '동전과 회전판')
        s.picture(fig('coin', svg_coin()), width_mm=60)
        sp = [('가', [(F(1, 2), RED, '빨'), (F(1, 2), YEL, '노')]), ('나', [(F(1), RED, '빨')]), ('다', [(F(1), YEL, '노')])]
        pr = [sum(f for f, c, _ in secs if c == RED) for _, secs in sp]
        s.picture(fig('st7sp', svg_spinners(sp, 70)), width_mm=110)
        a3 = qa(s, [('동전을 던질 때 그림면이 나올 가능성', frac_txt(F(1, 2))), ('숫자 면이 나올 가능성', frac_txt(F(1, 2))),
                    ('화살이 빨간색에 멈출 가능성이 반반인 회전판', '가'), ('빨간색에 멈출 가능성을 수로: 가, 나, 다', ', '.join(frac_txt(x) for x in pr))])
        thenwhy(s, lv, '동전을 던질 때 그림면이 나올 가능성을 1/2로 나타내는 까닭은?',
                '동전에는 그림면과 숫자 면이 하나씩 있어서 그림면이 나올 가능성과 나오지 않을 가능성이 ( 같으므로 / 다르므로 ) 1/2로 나타내요.')
        step(s, 3, '약속하기', '가능성을 수로')
        s.fill('일이 일어날 가능성을 0부터 1까지의 수로 나타내면 ‘불가능하다’는 %s으로, ‘반반이다’는 %s로, ‘확실하다’는 %s로 나타낼 수 있습니다.' % (
            ch(lv, ['0', '1/2', '1'], 6), ch(lv, ['0', '1/2', '1'], 6), ch(lv, ['0', '1/2', '1'], 6)))
        step(s, 4, '확인하기', '주사위 말과 수')
        s.picture(fig('dice', svg_dice()), width_mm=110)
        d = list(range(1, 7))
        odd = [v for v in d if v % 2]
        p5 = [prob(odd, d), prob([v for v in d if v == 0], d), prob([v for v in d if v >= 1], d)]
        s.ask('홀수인 눈을 모두 써 보세요.')
        s.table([['일', '말로', '수로'], ['홀수가 나올 가능성', '', ''], ['0이 나올 가능성', '', ''], ['1 이상이 나올 가능성', '', '']], col_mm=[80, 60, 40], row_h=3118)
        a5 = '홀수 %s / %s' % (L(odd), ' / '.join('%s·%s' % (W3[cat3(x)], frac_txt(x)) for x in p5))
        ans = '7차시  ① %s   ② (예상 자유) %s   ③ %s, 같으므로   ④ 0, 1/2, 1   ⑤ %s' % (a1, a2, ' / '.join(a3), a5)
    else:  # 도전형
        ans = hst7(s, lv)
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '경품 뽑기와 수 카드')
        a6 = qa(s, [('제비 8개 중 당첨 제비가 4개, 한 개를 뽑을 때 당첨될 가능성', frac_txt(F(4, 8)))])
        assert 400 > 366
        s.ask('가능성이 0인 것은? ㉠ 운동회에 온 400명 중 생일이 같은 사람이 있을 것입니다. ㉡ 1번부터 20번까지 번호표 중 한 장을 뽑으면 25번이 나올 것입니다.')
        cards = [2, 4, 6, 8, 10, 12]
        s.text('수 카드 2, 4, 6, 8, 10, 12 중 한 장을 뽑아요.')
        cc = [('홀수일 가능성', prob([c for c in cards if c % 2], cards)), ('4의 배수일 가능성', prob([c for c in cards if c % 4 == 0], cards)),
              ('13보다 작은 수일 가능성', prob([c for c in cards if c < 13], cards)), ('짝수일 가능성', prob([c for c in cards if c % 2 == 0], cards))]
        qa(s, [(t, '') for t, _ in cc])
        why(s, '4의 배수일 가능성을 그렇게 정한 까닭을 써 보세요.', 1)
        ans += '   ⑥ %s, ㉡, %s (4의 배수 4, 8, 12는 6장 중 3장)' % (a6[0], ' / '.join('%s %s' % (t[:-5], frac_txt(x)) for t, x in cc))
    return ans


def st8(s, lv):
    s.lesson(8, '탐구 정리하기(O)', '동전·주사위 실험 부스 ― 여러 번 던져도 가능성이 같을까요', '동전이나 주사위를 여러 번 던지면 나온 횟수는 어떻게 될까요?')
    s.scene(None, '예나: “연습할 때 그림면이 세 번이나 연속으로 나왔어. 그림면이 더 잘 나오는 거 아니야?”')
    if lv == '기본형':
        step(s, 0, '만져 보기', '동전의 가능성')
        s.fill(['그림면이 나올 가능성은 %s이고 수로 %s이에요.' % (ch(lv, W3, 10), ch(lv, ['0', '1/2', '1'], 6)),
                '숫자 면이 나올 가능성은 수로 %s이에요. 두 가능성은 %s.' % (ch(lv, ['0', '1/2', '1'], 6), ch(lv, ['같아요', '달라요'], 8))])
        step(s, 1, '그려 보기', '동전 10번 던지기')
        record10(s, 'coin')
        qa(s, [('그림면이 나온 횟수', '', '번'), ('숫자 면이 나온 횟수', '', '번')])
        s.choices([('동전을 10번 던지면 그림면과 숫자 면이 꼭 5번씩 나올까요?', '( 네, 꼭 5번씩 나와요 /\n아니요, 5번씩 나오지 않을 수도 있어요 )')])
        step(s, 2, '말해 보기', '동전 120번 던지기')
        s.text('모둠 친구들의 결과를 모으듯이 동전을 120번까지 던져 기록해 보세요.')
        record_cum(s, 'coin')
        s.choices([('던진 횟수가 많아질수록 그림면과 숫자 면이 나온 횟수는', opt('비슷해져요', '점점 크게 달라져요', '늘 똑같아요'))])
        thenwhy(s, lv, '10번 던졌을 때와 120번 던졌을 때를 견주어 알게 된 것은?',
                '적게 던지면 두 면이 나온 횟수가 크게 ( 다를 / 같을 ) 수 있지만, 많이 던질수록 ( 비슷해져서 / 달라져서 ) 가능성이 1/2로 같다는 것을 확인할 수 있어요.')
        step(s, 3, '약속하기', '주사위 홀수와 짝수')
        s.text('주사위 놀이에서 홀수가 나오면 청팀, 짝수가 나오면 백팀이 먼저 해요.')
        s.picture(fig('dice', svg_dice()), width_mm=100)
        d = list(range(1, 7))
        ev = [v for v in d if v % 2 == 0]
        assert prob(ev, d) == F(1, 2)
        s.fill('짝수인 눈 (              ),  홀수가 나올 가능성 %s,  짝수가 나올 가능성 %s → 이 방법은 두 팀에게 %s' % (
            ch(lv, ['0', '1/2', '1'], 6), ch(lv, ['0', '1/2', '1'], 6), ch(lv, ['공정해요', '공정하지 않아요'], 10)))
        record10(s, 'dice')
        qa(s, [('홀수가 나온 횟수', '', '번'), ('짝수가 나온 횟수', '', '번')])
        step(s, 4, '확인하기', '주사위 여러 번')
        record_cum(s, 'dice')
        s.choices([('던진 횟수가 많아질수록 홀수와 짝수가 나온 횟수는', opt('비슷해져요', '점점 크게 달라져요')),
                   ('같은 실험을 다시 하면 표의 수는', opt('똑같이 나와요', '조금씩 달라질 수 있어요'))])
        ans = '8차시  ① 반반이다, 1/2, 1/2, 같아요   ② %s, 아니요   ③ %s, 비슷해져요, 다를·비슷해져서   ④ 짝수 %s, 1/2, 1/2, 공정해요, %s   ⑤ %s, 비슷해져요, 조금씩 달라질 수 있어요' % (
            sim10_answer(181, 'coin'), cum_answer(182, 'coin'), L(ev), sim10_answer(183, 'dice'), cum_answer(184, 'dice'))
    else:  # 도전형
        ans = hst8(s, lv)
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '실험 부스의 이야기와 결과')
        s.choices([('민재가 동전을 던졌더니 그림면, 숫자 면, 그림면, 그림면, 그림면이 나왔어요. 다음에 던지면?',
                    '( 이번에는 반드시 숫자 면이 나와요 /\n반드시 그림면이 또 나와요 /\n두 면이 나올 가능성은 여전히 반반이에요 )')])
        tb = [(40, 18, 22), (60, 28, 32), (80, 41, 39), (100, 52, 48), (120, 62, 58)]
        assert all(a + b == m for m, a, b in tb)
        s.table([['던진 횟수(번)'] + [str(m) for m, _, _ in tb], ['그림면(번)'] + [str(a) for _, a, _ in tb], ['숫자 면(번)'] + [str(b) for _, _, b in tb]],
                header=True, header_col=True, col_mm=[40] + [28] * 5)
        dif = [abs(F(a, m) - F(1, 2)) for m, a, _ in tb]
        assert dif[-1] < dif[0]
        s.ask('던진 횟수가 많아질수록 그림면이 나온 횟수는 던진 횟수의 ( 절반 / 2배 / 4분의 1 )에 가까워져요.', blank=False)
        why(s, '앞에서 그림면이 많이 나와도 다음에 던질 때의 가능성이 같은 까닭을 써 보세요.', 1)
        ans += '   ⑥ 여전히 반반이에요, 절반 (120번 중 62번, 절반은 60번), 동전은 앞의 결과를 기억하지 못해요'
    return ans


def st9(s, lv):
    s.lesson(9, '발표하기(P)', '운동회 기록왕 놀이 ― 누가 평균에 가까울까요', '모둠 기록의 평균에 가장 가까운 친구는 누구일까요?')
    s.scene(None, '운동회 날 쉬는 시간에 ‘기록왕 놀이’를 해요. (모둠 4명, 준비물: 계산기, 공, 줄넘기, 초시계, 줄자)')
    if lv == '기본형':
        step(s, 0, '만져 보기', '놀이 방법 차례 정하기')
        items = ['기록을 재요.', '평균을 구할 주제를 정해요.', '평균에 가장 가까운 사람을 찾아요.', '표에 제목, 이름, 기록을 적어요.', '다른 주제를 정하여 되풀이해요.']
        order = [1, 0, 3, 2, 4]
        s.table([['차례', '할 일']] + [['(    )', t] for t in items], col_mm=[25, 155])
        rank = {idx: k + 1 for k, idx in enumerate(order)}
        a1 = ', '.join(str(rank[i]) for i in range(5))
        step(s, 1, '그려 보기', '서준이네 모둠의 주제별 평균')
        rows = [['주제'] + KIDS + ['평균']]
        for t, u, recs, a, nr in ST_T9:
            m = avg(recs)
            assert m == F(str(a)) and nearest(recs, m) == nr
            rows.append(['%s(%s)' % (t, u)] + [str(v) for v in recs] + ['(        )'])
        s.table(rows, col_mm=[50, 24, 24, 24, 24, 34], row_h=3402)
        if lv == '기본형':
            s.text('네 사람의 기록을 모두 더하여 4로 나눠요. 계산기를 써도 돼요.')
        a2 = ', '.join('%s %s%s' % (t, fmt(avg(r)), ' ' + u if u in ('cm', 'm') else u) for t, u, r, _, _ in ST_T9)
        step(s, 2, '말해 보기', '가장 가까운 사람')
        s.table([['주제', '평균에 가장 가까운 사람']] + [[t, opt(*KIDS) if lv == '기본형' else '(            )'] for t, _, _, _, _ in ST_T9], col_mm=[70, 110])
        a3 = ', '.join('%s %s' % (t, KIDS[n]) for t, _, _, _, n in ST_T9)
        thenwhy(s, lv, '평균에 가장 가까운 사람을 ‘모둠을 대표하는 친구’라고 할 수 있는 까닭은?',
                '평균은 모둠 기록을 ( 고르게 한 / 모두 더한 ) 값이라 모둠을 대표해요. 그래서 평균과의 차이가 가장 ( 작은 / 큰 ) 친구가 모둠을 가장 잘 대표해요.')
        step(s, 3, '약속하기', '우리 모둠 기록왕 놀이')
        s.ask('주제: (                              )   단위: (        )', blank=False)
        s.table([['이름', '나', '친구 1', '친구 2', '친구 3'], ['이름 쓰기', '', '', '', ''], ['기록', '', '', '', ''], ['평균과의 차이', '', '', '', '']],
                header=True, header_col=True, col_mm=[40, 35, 35, 35, 35], row_h=3402)
        s.ask('모둠 기록의 평균: (            )   평균에 가장 가까운 친구: (            )', blank=False)
        step(s, 4, '확인하기', '비밀 숫자 찾기 연습')
        picks = [5, 12, 7, 10]
        m5 = 9
        sec = m5 * 5 - sum(picks)
        assert sec == 11 and avg(picks + [sec]) == m5
        s.text('서준 5, 하윤 12, 예나 7, 도현 10을 골랐어요. 진행자 민재는 “5개 수의 평균은 9야.”라고 알려 주었어요.')
        a5 = qa(s, [('5개 수의 합계: 9 × 5 =', m5 * 5), ('민재의 비밀 숫자: 45 − (5 + 12 + 7 + 10) =', sec)])
        ans = '9차시  ① (위에서부터) %s   ② %s   ③ %s, 고르게 한·작은   ④ (모둠마다 다름)   ⑤ %s' % (a1, a2, a3, ' / '.join(a5))
    else:  # 도전형
        ans = hst9(s, lv)
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '내가 진행자가 되어 보기')
        pk = [11, 6, 15, 9]
        cand = [4, 5, 9, 10, 14, 15, 19, 20]
        ok = [c for c in cand if (sum(pk) + c) % 5 == 0]
        assert ok == [4, 9, 14, 19] and avg(pk + [14]) == 11
        s.text('친구들이 11, 6, 15, 9를 골랐어요. 5개 수의 평균이 자연수가 되도록 20 이하의 비밀 숫자를 정하려고 해요.')
        s.ask('비밀 숫자가 될 수 있는 수에 모두 ○:  4   5   9   10   14   15   19   20', blank=False)
        a6 = qa(s, [('비밀 숫자를 14로 정했을 때 5개 수의 평균', fmt(avg(pk + [14])))])
        why(s, '비밀 숫자가 될 수 있는 수를 어떻게 찾았는지 써 보세요.', 1)
        ans += '   ⑥ %s, %s (41에 더해 5로 나누어떨어지는 수)' % (L(ok), a6[0])
    return ans


def st10(s, lv):
    s.lesson(10, '발표하기(P)', '학급 운동회 준비 보고회', '평균과 가능성을 이용해 운동회 준비를 어떻게 했는지 발표할 수 있나요?')
    s.scene(None, '보고회 날이에요! 운동회를 준비하며 알아낸 평균과 가능성을 발표해요.')
    if lv == '기본형':
        step(s, 0, '만져 보기', '민재의 회별 공 넣기 기록 고르게 하기')
        v1 = [4, 1, 3, 4]
        m1, mv = level_steps(v1)
        assert m1 == 3 and total(v1) == 12
        s.picture(fig('st10cir', svg_stack(['1회', '2회', '3회', '4회'], v1, 'circle', '민재의 회별 공 넣기 기록')), width_mm=95)
        a1 = qa(s, [('○를 옮겨 고르게 하면 공 넣기 기록의 평균', m1, '개')])
        step(s, 1, '그려 보기', '응원 연습에 참여한 학생 수')
        v2 = [86, 92, 88, 95, 89]
        assert (total(v2), avg(v2)) == (450, 90)
        hdata(s, ['1일', '2일', '3일', '4일', '5일'], v2, '날짜', '학생 수(명)')
        a2 = qa(s, [('86 + 92 + 88 + 95 + 89 =', fmt(total(v2)), '명'), ('참여한 학생 수의 평균: 450 ÷ 5 =', fmt(avg(v2)), '명')])
        step(s, 2, '말해 보기', '경품 뽑기와 회전판 발표')
        bags = [('가', [(RED, '빨', 5), (BLUE, '파', 1)]), ('나', [(RED, '빨', 3), (BLUE, '파', 3)]), ('다', [(RED, '빨', 6)]),
                ('라', [(BLUE, '파', 6)]), ('마', [(RED, '빨', 1), (BLUE, '파', 5)])]
        prr = [F(sum(m for _, k, m in it if k == '빨'), 6) for _, it in bags]
        o3 = rank_order([n for n, _ in bags], prr)
        assert o3 == ['다', '가', '나', '마', '라']
        s.picture(fig('st10bag', svg_bags(bags)), width_mm=172)
        s.ask('빨간 공이 나올 가능성이 높은 주머니부터:  (     ) → (     ) → (     ) → (     ) → (     )', blank=False)
        sp = [('㉠', [(F(1, 3), RED, '빨'), (F(1, 3), YEL, '노'), (F(1, 3), BLUE, '파')]),
              ('㉡', [(F(1, 4), RED, '빨'), (F(1, 4), YEL, '노'), (F(1, 2), BLUE, '파')]),
              ('㉢', [(F(3, 4), RED, '빨'), (F(1, 8), YEL, '노'), (F(1, 8), BLUE, '파')])]
        s.picture(fig('st10sp', svg_spinners(sp, 70)), width_mm=120)
        fr = [[next(f for f, c, _ in secs if c == col) for col in (RED, YEL, BLUE)] for _, secs in sp]
        tabs = [[17, 16, 17], [34, 8, 8], [12, 13, 25]]
        mt = ['㉠㉡㉢'[match_spinner(fr, t)] for t in tabs]
        assert mt == ['㉠', '㉢', '㉡']
        s.text('회전판을 50번 돌린 결과 표와 알맞은 회전판을 이어 보세요.')
        s.table([['표', '빨간색', '노란색', '파란색', '회전판']] + [['표 %s' % '①②③'[i]] + [str(v) for v in t] + ['(      )'] for i, t in enumerate(tabs)],
                col_mm=[30, 35, 35, 35, 45])
        thenwhy(s, lv, '결과 표 ②가 회전판 ㉢과 어울리는 까닭은?',
                '표 ②에서 50번 중 ( 빨간색 / 파란색 )에 34번으로 가장 많이 멈췄으니, 그 색이 가장 ( 넓은 / 좁은 ) 회전판 ㉢을 돌렸을 가능성이 높아요.')
        step(s, 3, '약속하기', '말과 수, 평균 활용')
        c10 = list(range(1, 11))
        pe, p11 = prob([v for v in c10 if v % 2 == 0], c10), prob([v for v in c10 if v >= 11], c10)
        s.text('1부터 10까지의 수 카드 10장이 든 상자에서 카드 한 장을 꺼내요.')
        s.choices([('짝수일 가능성을 말로', opt(*W3)), ('11 이상일 가능성을 수로', opt('0', '1/2', '1'))])
        s.text('청팀은 모둠 6개가 응원 종이꽃을 모둠마다 평균 45개씩, 백팀은 모둠 5개가 모둠마다 평균 56개씩 만들었어요.')
        a4 = qa(s, [('청팀: 45 × 6 =', 45 * 6, '개'), ('백팀: 56 × 5 =', 56 * 5, '개'), ('종이꽃을 더 많이 만든 팀', '백팀' if 56 * 5 > 45 * 6 else '청팀')])
        step(s, 4, '확인하기', '처음 궁금증 돌아보기')
        s.text('1차시에 붙인 ‘궁금해요’ 쪽지를 다시 보고, 운동회 준비를 마무리하는 글을 써 보세요.')
        write_pane(s, lv, [('궁금증에 답하기', '______________ 이 궁금했어요. 이제 ______________ 하면 된다는 것을 알아요.'),
                           ('기억에 남는 활동', '______________ 을 했어요. ______________ 라는 것을 알게 되었어요.')])
        if lv == '도전형':
            s.lines(1)
        ans = '10차시  ① %s   ② %s   ③ %s, 표① %s, 표② %s, 표③ %s, 빨간색·넓은   ④ %s, %s, %s   ⑤ (예) 깃발 수 6, 9, 7, 6의 평균은 28 ÷ 4 = 7(개)' % (
            a1[0], ' / '.join(a2), ' → '.join(o3), mt[0], mt[1], mt[2], W3[cat3(pe)], frac_txt(p11), ' / '.join(a4))
    else:  # 도전형
        ans = hst10(s, lv)
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '운동회 마지막 놀이 문제')
        got = [2, 8, 5]
        need = 6 * 4 - sum(got)
        assert need == 9 and need not in got and avg(got + [need]) == 6
        s.text('1부터 9까지의 수 카드 9장 중 모둠원 3명이 2, 8, 5를 뽑았어요. 한 장을 더 가져와 4장의 평균을 6으로 만들려고 해요.')
        a6 = qa(s, [('가져와야 할 카드', need)])
        d = list(range(1, 7))
        cards = [('주사위 눈의 수가 7일 가능성', prob([v for v in d if v == 7], d)), ('6일 가능성', prob([v for v in d if v == 6], d)),
                 ('짝수일 가능성', prob([v for v in d if v % 2 == 0], d)), ('3 이상일 가능성', prob([v for v in d if v >= 3], d)),
                 ('6 이하일 가능성', prob([v for v in d if v <= 6], d))]
        a7 = scale_cards(s, lv, cards, nums=True)
        why(s, '3 이상일 가능성을 그렇게 정한 까닭을 써 보세요.', 1)
        ans += '   ⑥ %s (6 × 4 − 15), %s' % (a6[0], a7)
    return ans


ST = [st1, st2, st3, st4, st5, st6, st7, st8, st9, st10]


# ================================================================ 만들기
# ================================================================ 도전형 새 문제(2026-10-30) — ①~⑤를 기본형과 다른 자료·수로
B_ = '(            )'
W5C = '불가능하다 / ~아닐 것 같다 / 반반이다 / ~일 것 같다 / 확실하다'


def tans(no, parts):
    return '%d차시  ' % no + '   '.join('%s %s' % (NUM[i], p) for i, p in enumerate(parts))


def pick_words(s, items, kinds=('평균', '가능성')):
    """평균/가능성 가르기를 빈칸으로. 정답 글."""
    s.table([[q, '(              )'] for q, _ in items], header=False, col_mm=[135, 45], row_h=3118)
    return ', '.join(kinds[k] for _, k in items)


def biggest_change(tn, tv):
    d = [tv[i + 1] - tv[i] for i in range(len(tv) - 1)]
    up, dn = max(d), min(d)
    assert d.count(up) == 1 and d.count(dn) == 1
    sp = ['%s와 %s 사이' % (tn[i], tn[i + 1]) for i in range(len(tv) - 1)]
    return sp[d.index(up)], (sp[d.index(dn)] if dn < 0 else '없음')


def h_graphs(s, key, bn, bv, btitle, bcat, bax, tn, tv, lo, hi, gs, ttitle):
    hdata(s, bn, bv, bcat, '%s(명)' % bax)
    s.text('표를 보고 막대그래프로 나타내 보세요. (세로 눈금 한 칸 = 1명)')
    s.picture(fig(key + 'bar', svg_bars(bn, bv, 10, 1, btitle, bcat, bax, '명', draw=False)), width_mm=115)
    a = qa(s, [('가장 많은 것과 가장 적은 것의 학생 수 차이', max(bv) - min(bv), '명'), ('조사한 학생은 모두', sum(bv), '명')])
    s.picture(fig(key + 'line', svg_linegraph(tn, tv, lo, hi, gs, ttitle, '℃')), width_mm=105)
    up, dn = biggest_change(tn, tv)
    b = qa(s, [('%s의 온도' % tn[2], tv[2], '℃'), ('온도가 가장 많이 오른 때', up), ('온도가 내려간 때', dn)])
    return '막대 %s칸, %s / %s' % ('·'.join(map(str, bv)), ' / '.join(a), ' / '.join(b))


def h_level(s, key, names, vals, item, title, unit, ask_total=True):
    m, mv = level_steps(vals)
    s.picture(fig(key, svg_stack(names, vals, item, title)), width_mm=min(172, 26 * len(names) + 20))
    s.text('평균보다 많은 곳에서 적은 곳으로 옮기는 화살표를 그려 보세요. 옮기는 개수가 가장 적게 되도록 해요.')
    rows = [('옮긴 개수는 모두', sum(k for *_, k in mv), '개')] if ask_total else []
    a = qa(s, rows + [('고르게 했을 때 한 곳에', m, unit)])
    return '%s, %s' % (moves_txt(names, mv, '개'), ' / '.join(a))


def h_over_under(s, key, names, vals, title, cat, ax, unit, vmax, guess):
    m = avg(vals)
    assert m == guess
    s.picture(fig(key, svg_bars(names, vals, vmax, 1, title, cat, ax, unit, lab_every=5)), width_mm=115)
    s.text('평균을 %d%s로 예상했어요. 예상한 높이에 빨간 선을 긋고, 넘치는 양과 모자란 양을 견주어 보세요.' % (guess, unit))
    over = sum(v - guess for v in vals if v > guess)
    under = sum(guess - v for v in vals if v < guess)
    assert over == under
    a = qa(s, [('예상한 선보다 넘치는 양을 모두 더하면', over, unit), ('모자란 양을 모두 더하면', under, unit), ('평균', fmt(m), unit)])
    why(s, '넘치는 양과 모자란 양이 같으면 예상한 값이 평균이라고 할 수 있는 까닭을 써 보세요.', 1)
    return '%s, (예) 넘치는 만큼 모자란 곳으로 옮기면 모두 같아지기 때문' % ' / '.join(a)


def h_strip(s, key, names, vals, unit):
    t, m = total(vals), avg(vals)
    assert m.denominator == 1
    s.picture(fig(key, svg_strips(names, vals, unit, True)), width_mm=172)
    s.text('이어 붙인 띠를 자료의 수만큼 똑같이 나누는 선을 그어 보세요.')
    a = qa(s, [('자룟값을 모두 더하면', fmt(t), unit), ('똑같이 나눌 칸 수', len(vals), '칸'), ('한 칸의 크기(평균)', fmt(m), unit)])
    return ' / '.join(a)


def h_mean_tab(s, key, heads, h1, h2, vals, unit, strip=True):
    t, m = total(vals), avg(vals)
    assert m.denominator == 1
    hdata(s, heads, vals, h1, h2)
    if strip:
        s.picture(fig(key, svg_strips(heads, vals, unit, False)), width_mm=165)
    a = qa(s, [('자룟값의 합', fmt(t), unit), ('자료의 수', len(vals), '개'), ('평균: %s ÷ %d =' % (fmt(t), len(vals)), fmt(m), unit)])
    return ' / '.join(a)


def h_unknown(s, key, names, vals, mean, title, cat, ax, unit, vmax, stp):
    i = vals.index(None)
    known = [v for v in vals if v is not None]
    tt = mean * len(vals)
    x = tt - sum(known)
    allv = vals[:i] + [x] + vals[i + 1:]
    assert x > 0 and avg(allv) == mean
    below = [names[k] for k, v in enumerate(allv) if v < mean]
    hdata(s, names, [('?' if v is None else str(v)) for v in vals], cat, '%s(%s)' % (ax, unit))
    s.picture(fig(key, svg_bars(names, vals, vmax, stp, title, cat, ax, unit, unknown=i, avgline=mean)), width_mm=125)
    s.text('빨간 점선은 평균 %d%s이에요. %s 막대를 그려 보세요.' % (mean, unit, names[i]))
    a = qa(s, [('전체 합', tt, unit), ('%s의 값' % names[i], x, unit), ('평균보다 적은 것을 모두', L(below))])
    return ' / '.join(a)


def h_teams(s, key, n1, v1, n2, v2, unit):
    m1, m2 = avg(v1), avg(v2)
    assert total(v2) > total(v1) and m1 > m2 and m1.denominator == m2.denominator == 1
    s.picture(fig(key + 'a', svg_stack(['%d번' % (i + 1) for i in range(len(v1))], v1, 'block', '%s 기록(쌓기나무 1개 = 1%s)' % (n1, unit))), width_mm=95)
    s.picture(fig(key + 'b', svg_stack(['%d번' % (i + 1) for i in range(len(v2))], v2, 'block', '%s 기록(쌓기나무 1개 = 1%s)' % (n2, unit))), width_mm=118)
    a = qa(s, [('%s 합계 / 평균' % n1, '%s%s / %s' % (fmt(total(v1)), unit, fmt(m1)), unit), ('%s 합계 / 평균' % n2, '%s%s / %s' % (fmt(total(v2)), unit, fmt(m2)), unit),
               ('더 잘했다고 할 수 있는 팀', n1)])
    why(s, '합계가 더 큰 %s 더 잘했다고 할 수 없는 까닭을 써 보세요.' % josa(n2, '이가'), 1)
    return '%s, (예) 참가한 사람 수가 달라 평균으로 비교해야 해요' % ' / '.join(a)


def h_same_mean(s, n1, v1, n2, v2, unit):
    m = avg(v1)
    i = v2.index(None)
    x = m * len(v2) - sum(v for v in v2 if v is not None)
    assert m.denominator == 1 and x > 0 and avg(v2[:i] + [x] + v2[i + 1:]) == m
    hdata(s, n1[1:], v1, n1[0], unit)
    hdata(s, n2[1:], ['?' if v is None else str(v) for v in v2], n2[0], unit)
    s.text('두 모둠의 평균이 같아요.')
    a = qa(s, [('%s의 평균' % n1[0], fmt(m)), ('%s의 합' % n2[0], fmt(m * len(v2))), ('%s의 값' % n2[1 + i], fmt(x))])
    return ' / '.join(a)


def h_box_words(s, key, title, items, qs):
    """qs: [(질문, 좋은 것 개수)] — 다섯 가지 말."""
    n = sum(m for _, _, m in items)
    s.picture(fig(key, svg_bags([(title, items)], 'box')), width_mm=60)
    s.table([[q, '(                    )'] for q, _ in qs], header=False, col_mm=[120, 60], row_h=3118)
    s.text('알맞은 말: ' + W5C)
    return ', '.join(W5[cat5(F(k, n))] for _, k in qs)


def h_card_words(s, cards):
    s.text('카드마다 알맞은 말을 써 보세요. (' + W5C + ')')
    s.table([['%s %s' % (SYM[i], t), '(                    )'] for i, (t, _) in enumerate(cards)], header=False, col_mm=[125, 55], row_h=3118)
    return ', '.join('%s %s' % (SYM[i], W5[cat5(x)]) for i, (_, x) in enumerate(cards))


def h_bags_rank(s, key, bags, good):
    pr = [F(sum(m for _, k, m in it if k == good), sum(m for _, _, m in it)) for _, it in bags]
    nm = [n for n, _ in bags]
    s.picture(fig(key, svg_bags(bags)), width_mm=min(172, 45 * len(bags)))
    o = rank_order(nm, pr)
    a = qa(s, [('가능성이 ‘반반이다’인 주머니', nm[pr.index(F(1, 2))]), ('가능성이 가장 높은 주머니', o[0]), ('가능성이 높은 주머니부터 차례로', ', '.join(o))])
    return ' / '.join(a)


def h_spin5(s, key, sp, col, q4):
    pg = [sum(f for f, c, _ in secs if c == col) for _, secs in sp]
    nm = [n for n, _ in sp]
    s.picture(fig(key, svg_spinners(sp, 70)), width_mm=172)
    x, y = q4
    better = x if pg[nm.index(x)] > pg[nm.index(y)] else y
    what = '당첨' if col == WIN else '초록색'
    qa(s, [('%s에 멈출 수 없는 회전판' % what, ''), ('%s에 멈출 가능성이 반반인 회전판' % what, ''), ('%s에 멈출 가능성이 가장 높은 회전판' % what, ''),
           ('%s와 %s 중 %s에 멈출 가능성이 더 높은 회전판' % (x, y, what), '')])
    a = [nm[pg.index(0)], nm[pg.index(F(1, 2))], nm[pg.index(max(pg))], better]
    return pg, nm, ', '.join(a)


def h_counts100(s, key, cv, title):
    assert sum(v for _, v, _ in cv) == 100
    s.table([['색'] + [t for t, _, _ in cv] + ['합계'], ['횟수(번)'] + [str(v) for _, v, _ in cv] + ['100']], header=True, header_col=True,
            col_mm=[40, 35, 35, 35, 35])
    s.picture(fig(key, svg_hbars(cv, title)), width_mm=120)
    o = [t for t, v, _ in sorted(cv, key=lambda x: -x[1])]
    a = qa(s, [('나올 가능성이 높은 색부터 차례로', ', '.join(o)), ('상자에 가장 적게 들어 있을 것 같은 색', o[-1])])
    why(s, '꺼낸 결과만 보고 상자 속 구슬의 수를 정확히 알 수 없는 까닭을 써 보세요.', 1)
    return '%s, (예) 꺼낼 때마다 결과가 달라질 수 있어서 짐작만 할 수 있어요' % ' / '.join(a)


def h_spin3_match(s, key, sp, counts):
    s.picture(fig(key, svg_spinners(sp, 70)), width_mm=120)
    k = match_spinner([[f for f, _, _ in secs] for _, secs in sp], counts)
    s.ask('회전판을 %d번 돌렸더니 빨간색 %d번, 노란색 %d번, 파란색 %d번 멈췄어요. 어느 회전판을 돌렸을 가능성이 가장 높을까요?' % ((sum(counts),) + tuple(counts)))
    return '㉠㉡㉢'[k]


def h_dice3(s, conds):
    d = list(range(1, 7))
    pd = [prob([v for v in d if f(v)], d) for _, f in conds]
    s.ask('주사위를 한 번 던질 때 ' + ' '.join('%s %s' % (SYM[i], t) for i, (t, _) in enumerate(conds)) + ' — 가능성이 높은 것부터 기호를 써 보세요.')
    assert len(set(pd)) == len(pd)
    return ', '.join(SYM[i] for i in sorted(range(len(pd)), key=lambda i: -pd[i]))


def h_dice_table(s, rows):
    d = list(range(1, 7))
    ps = [prob([v for v in d if f(v)], d) for _, f in rows]
    s.table([['일', '말로', '수로']] + [[t, '', ''] for t, _ in rows], col_mm=[90, 55, 35], row_h=3118)
    return ' / '.join('%s·%s' % (W3[cat3(x)], frac_txt(x)) for x in ps)


def h_coin_q(s):
    return qa(s, [('동전을 던질 때 그림면이 나올 가능성을 말로', W3[cat3(F(1, 2))]), ('그림면이 나올 가능성을 수로', frac_txt(F(1, 2))),
                  ('숫자 면이 나올 가능성을 수로', frac_txt(F(1, 2))), ('동전을 2개 던질 때, 한 동전이 그림면이 나올 가능성을 수로', frac_txt(F(1, 2)))])


def dice_lowhigh(seed, n):
    e = example_run(seed, 'dice', n)
    lo = sum(1 for v in e if v <= 3)
    return e, lo


def record_lh(s, n=10):
    s.table([['회'] + [str(i) for i in range(1, n + 1)], ['나온 눈'] + [''] * n, ['3 이하/4 이상'] + [''] * n], header=True, header_col=True,
            col_mm=[40] + [14] * n, row_h=3402)


def record_lh_cum(s):
    s.table([['던진 횟수(번)', '30', '60', '90', '120', '150'], ['3 이하(번)'] + [''] * 5, ['4 이상(번)'] + [''] * 5], header=True, header_col=True,
            col_mm=[40] + [28] * 5, row_h=3402)


def lh_cum_answer(seed):
    r = random.Random(seed)
    out, a = [], 0
    for m in range(1, 151):
        a += r.randint(1, 6) <= 3
        if m % 30 == 0:
            out.append('%d번: 3 이하 %d, 4 이상 %d' % (m, a, m - a))
    return '(예시) ' + ' / '.join(out)


def coin_cum_q(s, seed):
    s.text('모둠 친구들의 결과를 더하듯이 동전을 120번까지 던져 기록해 보세요.')
    record_cum(s, 'coin')
    a = qa(s, [('120번 던지면 그림면은 몇 번쯤 나올 것이라고 기대할 수 있나요?', 120 // 2, '번쯤')])
    why(s, '던진 횟수가 많아질수록 그림면이 나온 횟수와 던진 횟수의 절반을 견주면 어떻게 되는지 써 보세요.', 1)
    return '%s, %s, (예) 절반에 점점 가까워져요' % (cum_answer(seed, 'coin'), a[0])


def h_t9(s, names, T9, unit_cm):
    rows = [['주제'] + names + ['평균']]
    for t, u, recs in T9:
        rows.append(['%s(%s)' % (t, u)] + [str(v) for v in recs] + ['(        )'])
    s.table(rows, col_mm=[50, 24, 24, 24, 24, 34], row_h=3402)
    s.text('계산기를 써도 돼요. 평균이 소수로 나올 수도 있어요.')
    return ', '.join('%s %s%s' % (t, fmt(avg(r)), ' ' + u if u in unit_cm else u) for t, u, r in T9)


def h_t9_near(s, names, T9):
    s.table([['주제', '평균에 가장 가까운 사람', '그 사람의 기록과 평균의 차이']] + [[t, '(          )', '(          )'] for t, _, _ in T9], col_mm=[60, 60, 60])
    out = []
    for t, u, r in T9:
        m = avg(r)
        k = nearest(r, m)
        out.append('%s %s(%s)' % (t, names[k], fmt(abs(F(str(r[k])) - m))))
    return ', '.join(out)


def h_myplay(s):
    s.ask('주제: (                              )   단위: (        )', blank=False)
    s.table([['', '나', '친구 1', '친구 2', '친구 3'], ['이름', '', '', '', ''], ['기록', '', '', '', ''], ['평균보다 (큼 / 작음)', '', '', '', ''],
             ['평균과의 차이', '', '', '', '']], header=True, header_col=True, col_mm=[48, 33, 33, 33, 33], row_h=3402)
    s.ask('평균보다 큰 기록과 평균의 차이를 모두 더한 값과, 작은 기록과 평균의 차이를 모두 더한 값을 견주어 보세요. (            )', blank=False)


def h_secret(s, who, picks, m, m2, tell):
    sec = m * 5 - sum(picks)
    sec2 = m2 * 5 - sum(picks)
    assert sec > 0 and sec2 > 0 and avg(picks + [sec]) == m
    s.text('%s%s 골랐어요. %s' % (', '.join('%s %d' % (n, v) for n, v in zip(who, picks)), josa(picks[-1], '을를')[len(str(picks[-1])):], tell % m))
    a = qa(s, [('설계자의 비밀 숫자', sec), ('평균이 %d였다면 비밀 숫자는' % m2, sec2)])
    why(s, '두 비밀 숫자의 차이가 %d인 까닭을 써 보세요.' % (sec2 - sec), 1)
    return '%s, (예) 평균이 %d 커지면 합은 %d만큼 커져요' % (' / '.join(a), m2 - m, (m2 - m) * 5)


# ---------------------------------------------------------------- 교과서 차시 버전
def htb1(s, lv):
    A = []
    step(s, 0, '동전 던지기', '먼저 공격하는 팀 정하기')
    s.text('이번에는 동전을 8번 던져 그림면과 숫자 면이 나온 차례를 기록해 보세요.')
    s.picture(fig('coin', svg_coin()), width_mm=60)
    record10(s, 'coin', 8)
    a = qa(s, [('그림면이 나온 횟수 / 숫자 면이 나온 횟수', '', '번'), ('다음 번에 어느 면이 나올지 미리 알 수 있나요?', '없어요')])
    why(s, '심판이 동전으로 먼저 공격할 팀을 정하는 방법이 두 팀에게 공정한 까닭을 써 보세요.', 1)
    A.append('기록은 학생마다 다름, 미리 알 수 없어요, (예) 두 면이 나올 가능성이 같아서')
    step(s, 1, '배울 내용 살펴보기', '평균일까, 가능성일까')
    s.text('평균으로 알아볼 일에는 ‘평균’, 가능성으로 알아볼 일에는 ‘가능성’이라고 써 보세요.')
    A.append(pick_words(s, [('우리 반 학생들의 하루 수면 시간을 대표하는 값', 0), ('내일 눈이 올 정도', 1), ('모둠별 투호 점수를 하나의 수로 나타낸 값', 0),
                            ('행운권 추첨에서 1등이 나올 정도', 1), ('일주일 동안 마신 우유 양을 대표하는 값', 0)]))
    step(s, 2, '배운 내용 떠올리기', '막대그래프와 꺾은선그래프')
    A.append(h_graphs(s, 'htb1', ['투호', '제기차기', '윷놀이', '팽이치기'], [8, 3, 6, 9], '해 보고 싶은 전통 놀이별 학생 수', '놀이', '학생 수',
                      ['10시', '11시', '12시', '1시', '2시'], [13, 16, 17, 21, 20], 10, 22, 2, '송년 잔치 날 마당의 온도'))
    step(s, 3, '송년 잔치 둘러보기', '체육관의 다섯 곳')
    acts = [('투호 놀이 — 두 모둠의 점수 비교', 0), ('윷놀이 — 모가 나올 정도', 1), ('떡 나누기 — 한 사람당 받을 떡의 수', 0),
            ('행운권 추첨 — 당첨될 정도', 1), ('팽이 돌리기 — 모둠 기록을 대표하는 값', 0)]
    s.choices([(t, opt('평균', '가능성')) for t, _ in acts])
    A.append(', '.join('%s %s' % (t.split(' — ')[0], ['평균', '가능성'][k]) for t, k in acts))
    step(s, 4, '확인하기', '학습 계획 세우기')
    write_pane(s, lv, [('평균이 쓰이는 곳', ''), ('가능성이 쓰이는 곳', ''), ('이 단원에서 알고 싶은 것', '')])
    A.append('(자유)')
    return tans(1, A)


def htb2(s, lv):
    A = []
    step(s, 0, '만져 보기', '쌓기나무로 고르게 하기')
    A.append(h_level(s, 'htb2blk', ['별빛 마을', '은하 마을', '햇살 마을', '달님 마을', '구름 마을'], [10, 7, 9, 6, 8], 'block',
                     '마을별 참여한 인원수(쌓기나무 1개 = 1명)', '명'))
    step(s, 1, '그려 보기', '투호 기록 ○ 옮기기')
    kn, kv = ['나래', '태민', '수빈', '하람', '지후'], [6, 2, 5, 1, 6]
    hdata(s, kn, kv, '이름', '넣은 화살(개)')
    A.append(h_level(s, 'htb2cir', kn, kv, 'circle', '학생별 투호 기록', '개'))
    step(s, 2, '말해 보기', '대표하는 값 정하기')
    s.text('네 모둠이 만든 등불 수는 9개, 9개, 3개, 7개예요.')
    a = qa(s, [('등불 수를 대표하는 값(고르게 한 수)', fmt(avg([9, 9, 3, 7])), '개'), ('9개, 9개, 3개, 7개처럼 자료 하나하나의 값을 부르는 말', '자룟값')])
    why(s, '두 번 나온 9개를 대표하는 값으로 정하면 알맞지 않은 까닭을 써 보세요.', 1)
    A.append('%s, (예) 3개를 만든 모둠처럼 다른 자룟값이 반영되지 않아요' % ' / '.join(a))
    step(s, 3, '약속하기', '평균')
    s.fill(['자룟값을 고르게 하여 얻은 값을 그 자료의 (            )이라고 해요.', '평균은 자료 전체를 (                ) 값으로 쓸 수 있어요.'])
    A.append('평균, 대표하는')
    step(s, 4, '확인하기', '상자 5개의 밤 수')
    A.append(h_over_under(s, 'htb2bar', ['가', '나', '다', '라', '마'], [17, 12, 15, 16, 15], '상자별 밤 수', '상자', '밤 수', '개', 20, 15))
    return tans(2, A)


def htb3(s, lv):
    A = []
    step(s, 0, '만져 보기', '종이띠 이어 붙이고 등분하기')
    s.text('바구니 5개에 든 투호 화살 수를 종이띠로 나타냈어요.')
    A.append(h_strip(s, 'htb3strip', ['빨간색', '노란색', '파란색', '초록색', '보라색'], [9, 5, 8, 4, 4], '개'))
    step(s, 1, '말해 보기', '종이띠와 계산 잇기')
    s.fill(['종이띠를 모두 이어 붙이는 것은 자룟값을 (              ) 것과 같아요.', '이어 붙인 띠를 5칸으로 똑같이 나누는 것은 (              )로 나누는 것과 같아요.'])
    A.append('모두 더하는, 자료의 수(5)')
    step(s, 2, '약속하기', '평균 구하는 식')
    s.fill(['(평균) = (                    ) ÷ (            )', '자료가 6개이면 자룟값을 모두 더한 수를 (      )으로 나누어요.'])
    A.append('자룟값을 모두 더한 수, 자료의 수, 6')
    step(s, 3, '평균 구하기', '수현이의 6일 동안 왕복 달리기 기록')
    A.append(h_mean_tab(s, 'htb3strip2', ['1일', '2일', '3일', '4일', '5일', '6일'], '날짜', '기록(회)', [78, 85, 81, 90, 76, 88], '회'))
    step(s, 4, '확인하기', '박물관 관람객 수, 읽은 책 수')
    mv = [312, 405, 368, 290, 455, 498, 402]
    hdata(s, ['월', '화', '수', '목', '금', '토', '일'], mv, '요일', '관람객 수(명)')
    bk = [7, 3, 9, 5, 6]
    assert avg(mv).denominator == 1 and avg(bk) == 6
    hi = [d for d, v in zip(['월', '화', '수', '목', '금', '토', '일'], mv) if v > avg(mv)]
    a = qa(s, [('관람객 수의 합', fmt(total(mv)), '명'), ('관람객 수의 평균', fmt(avg(mv)), '명'), ('관람객이 평균보다 많은 요일', L(hi))])
    hdata(s, ['윤호', '주아', '은찬', '가은', '시우'], bk, '이름', '책 수(권)')
    b = qa(s, [('다섯 명이 읽은 책 수의 평균', fmt(avg(bk)), '권')])
    A.append('%s / %s' % (' / '.join(a), b[0]))
    return tans(3, A)


def htb4(s, lv):
    A = []
    step(s, 0, '만져 보기', '두 팀의 점수 고르게 하기')
    s.text('투호 놀이를 했어요. 별 팀은 4명, 달 팀은 5명이 참가했어요.')
    A.append(h_teams(s, 'htb4', '별 팀', [9, 6, 8, 9], '달 팀', [7, 10, 6, 5, 7], '점'))
    step(s, 1, '그려 보기', '학년별 우산을 가져온 학생 수(평균 72명)')
    A.append(h_unknown(s, 'htb4bar', ['1학년', '2학년', '3학년', '4학년', '5학년', '6학년'], [75, 68, None, 80, 64, 70], 72,
                       '학년별 우산을 가져온 학생 수', '학년', '학생 수', '명', 100, 10))
    step(s, 2, '말해 보기', '합계와 평균')
    s.fill(['참가한 사람 수가 다른 두 팀을 합계로 비교하면 (                ) 팀이 유리해요.', '그래서 사람 수가 다른 두 집단은 (          )으로 비교해요.'])
    A.append('사람 수가 많은, 평균')
    step(s, 3, '정리하기', '모르는 자룟값 구하기')
    s.fill(['(전체 합) = (평균) (    ) (자료의 수)', '(모르는 자룟값) = (전체 합) (    ) (아는 자룟값의 합)'])
    A.append('×, −')
    step(s, 4, '확인하기', '평균이 같은 두 가족의 운동 시간')
    A.append(h_same_mean(s, ['윤호네 가족', '아버지', '어머니', '누나', '윤호'], [7, 10, 4, 7], ['예린이네 가족', '할머니', '아버지', '어머니', '예린', '동생', '삼촌'],
                         [8, 5, None, 9, 6, 4], '시간(시간)'))
    return tans(4, A)


def htb5(s, lv):
    A = []
    step(s, 0, '만져 보기', '붕어빵 통에서 꺼내기(꺼낸 것은 다시 넣어요)')
    s.text('이번 통에는 크림붕어빵 3개와 팥붕어빵 1개가 들어 있어요.')
    A.append(h_box_words(s, 'htb5fish', '붕어빵 통', [('#F3D27A', '크림', 3), ('#B7793F', '팥', 1)],
                         [('크림붕어빵이 나올 가능성', 3), ('팥붕어빵이 나올 가능성', 1), ('슈크림붕어빵이 나올 가능성', 0), ('붕어빵이 나올 가능성', 4)]))
    step(s, 1, '그려 보기', '가능성 띠에 카드 놓기')
    d = range(1, 7)
    cards = [('주사위를 던지면 눈의 수가 3의 배수일 것입니다.', prob([v for v in d if v % 3 == 0], d)), ('12월의 다음 달은 1월일 것입니다.', F(1)),
             ('제비 10개 중 당첨 제비가 7개일 때 당첨될 것입니다.', F(7, 10)), ('주사위를 던지면 눈의 수가 7일 것입니다.', F(0)),
             ('동전을 던지면 숫자 면이 나올 것입니다.', F(1, 2))]
    A.append(scale_cards(s, lv, cards))
    step(s, 2, '말해 보기', '사탕 주머니(딸기 맛 5개, 포도 맛 3개)')
    s.picture(fig('htb5candy', svg_bags([('사탕 주머니', [('#F07A8E', '딸', 5), ('#8E5BB5', '포', 3)])])), width_mm=55)
    a = qa(s, [('딸기 맛 사탕이 나올 가능성', W5[cat5(F(5, 8))]), ('포도 맛 사탕이 나올 가능성', W5[cat5(F(3, 8))]), ('사과 맛 사탕이 나올 가능성', W5[0])])
    why(s, '포도 맛 사탕을 몇 개 더 넣으면 두 맛이 나올 가능성이 ‘반반이다’가 될지 쓰고 까닭도 써 보세요.', 1)
    A.append('%s, 2개(5개씩 같아지므로)' % ' / '.join(a))
    step(s, 3, '약속하기', '가능성')
    s.fill(['어떤 일이 일어나길 기대할 수 있는 정도를 (          )이라고 해요.', '가장 낮은 말은 (            ), 가장 높은 말은 (            ), 가운데 말은 (            )예요.'])
    A.append('가능성, 불가능하다, 확실하다, 반반이다')
    step(s, 4, '확인하기', '수학익힘 — 가능성 말 쓰기')
    A.append(h_card_words(s, [('목요일의 다음 날은 금요일일 것입니다.', F(1)), ('주사위 눈의 수가 5 이하일 것입니다.', F(5, 6)),
                              ('1번부터 10번까지 번호표 중 10번을 뽑을 것입니다.', F(1, 10)), ('동전 2개를 던지면 둘 다 그림면이 나올 것입니다.', F(1, 4)),
                              ('주사위 눈의 수가 짝수일 것입니다.', F(1, 2))]))
    return tans(5, A)


def htb6(s, lv):
    A = []
    step(s, 0, '만져 보기', '손수건 주머니 가·나·다·라')
    A.append(h_bags_rank(s, 'htb6bag', [('가', [(RED, '빨', 3), (GREEN, '초', 1)]), ('나', [(RED, '빨', 2), (GREEN, '초', 2)]),
                                         ('다', [(RED, '빨', 1), (GREEN, '초', 3)]), ('라', [(RED, '빨', 4)])], '빨'))
    step(s, 1, '그려 보기', '회전판 다섯 개(초록색과 노란색)')
    sp = [('가', [(F(3, 8), GREEN, '초'), (F(5, 8), YEL, '노')]), ('나', [(F(1), YEL, '노')]), ('다', [(F(1, 2), GREEN, '초'), (F(1, 2), YEL, '노')]),
          ('라', [(F(5, 8), GREEN, '초'), (F(3, 8), YEL, '노')]), ('마', [(F(1), GREEN, '초')])]
    pg, nm, a = h_spin5(s, 'htb6sp', sp, GREEN, ('가', '라'))
    A.append(a)
    step(s, 2, '차례 정하기', '초록색에 멈출 가능성이 높은 회전판부터')
    o = rank_order(nm, pg)
    s.ask('(        ) → (        ) → (        ) → (        ) → (        )', blank=False)
    why(s, '회전판 가와 다 중 초록색에 멈출 가능성이 더 높은 것을 고르고 까닭을 써 보세요.', 1)
    A.append('%s, 다(가는 초록색이 반보다 좁아요)' % ' → '.join(o))
    step(s, 3, '말해 보기', '구슬을 100번 꺼낸 결과')
    A.append(h_counts100(s, 'htb6hb', [('주황색', 44, ORG), ('파란색', 21, BLUE), ('노란색', 35, YEL)], '색별 나온 구슬의 횟수'))
    step(s, 4, '확인하기', '수학익힘 — 가능성 비교하기')
    o5 = h_dice3(s, [('눈의 수가 3의 배수', lambda v: v % 3 == 0), ('눈의 수가 6의 약수', lambda v: 6 % v == 0), ('눈의 수가 4 이상', lambda v: v >= 4)])
    k = h_spin3_match(s, 'htb6sp6b', [('㉠', [(F(1, 2), RED, '빨'), (F(1, 4), YEL, '노'), (F(1, 4), BLUE, '파')]),
                                     ('㉡', [(F(1, 4), RED, '빨'), (F(1, 2), YEL, '노'), (F(1, 4), BLUE, '파')]),
                                     ('㉢', [(F(1, 3), RED, '빨'), (F(1, 3), YEL, '노'), (F(1, 3), BLUE, '파')])], [31, 58, 31])
    A.append('%s, %s' % (o5, k))
    return tans(6, A)


def htb7(s, lv):
    A = []
    bags = [('가', [(ORG, '주', 3), (BLUE, '파', 1)]), ('나', [(ORG, '주', 2), (BLUE, '파', 2)]), ('다', [(BLUE, '파', 4)]), ('라', [(ORG, '주', 4)])]
    po = [F(sum(m for _, k, m in it if k == '주'), 4) for _, it in bags]
    step(s, 0, '만져 보기', '경품함 가·나·다·라')
    s.picture(fig('htb7bag', svg_bags(bags, 'box')), width_mm=150)
    s.text('주황색 공이 나올 가능성을 알맞은 말로 써 보세요. (' + W5C + ')')
    qa(s, [('경품함 %s' % n, '') for n, _ in bags])
    A.append(', '.join(W5[cat5(x)] for x in po))
    step(s, 1, '그려 보기', '가능성 띠를 수로')
    s.picture(fig('scale3q', svg_scale(3, qmarks=True, boxes=False)), width_mm=165)
    s.fill(['주황색 공이 나올 가능성을 수로:  나 (      ),  다 (      ),  라 (      )', '경품함 가의 가능성은 ( 1/2보다 큰 / 1/2보다 작은 ) 수예요.'])
    A.append('나 %s, 다 %s, 라 %s, 1/2보다 큰' % tuple(frac_txt(x) for x in po[1:]))
    step(s, 2, '말해 보기', '동전과 회전판')
    sp = [('가', [(F(1, 2), RED, '빨'), (F(1, 2), BLUE, '파')]), ('나', [(F(1), BLUE, '파')]), ('다', [(F(1), RED, '빨')])]
    pr = [sum(f for f, c, _ in secs if c == RED) for _, secs in sp]
    pb = [1 - x for x in pr]
    s.picture(fig('htb7sp', svg_spinners(sp, 70)), width_mm=110)
    a = qa(s, [('빨간색에 멈출 가능성을 수로: 가, 나, 다', ', '.join(frac_txt(x) for x in pr)), ('파란색에 멈출 가능성을 수로: 가, 나, 다', ', '.join(frac_txt(x) for x in pb)),
               ('주사위를 던져 홀수가 나올 가능성과 같은 회전판', '가')])
    A.append(' / '.join(a))
    step(s, 3, '약속하기', '가능성을 수로')
    s.fill(['가능성을 수로 나타낼 때 가장 작은 수는 (      ), 가장 큰 수는 (      )이에요.', '‘반반이다’는 (      )로 나타내요.'])
    A.append('0, 1, 1/2')
    step(s, 4, '확인하기', '주사위를 한 번 던질 때')
    s.picture(fig('dice', svg_dice()), width_mm=110)
    s.ask('눈의 수가 4 이상인 눈을 모두 써 보세요.')
    b = h_dice_table(s, [('눈의 수가 4 이상일 가능성', lambda v: v >= 4), ('눈의 수가 6보다 클 가능성', lambda v: v > 6),
                         ('눈의 수가 1 이상 6 이하일 가능성', lambda v: 1 <= v <= 6), ('눈의 수가 1, 2, 3 중 하나일 가능성', lambda v: v <= 3)])
    A.append('4, 5, 6 / %s' % b)
    return tans(7, A)


def htb8(s, lv):
    A = []
    step(s, 0, '동전의 가능성', '동전 한 개를 던질 때')
    A.append(', '.join(h_coin_q(s)))
    step(s, 1, '동전 10번', '던지고 기록하기')
    record10(s, 'coin')
    qa(s, [('그림면이 나온 횟수와 숫자 면이 나온 횟수의 차', '', '번')])
    why(s, '10번 던졌을 때 그림면이 꼭 5번 나오지 않는 까닭을 써 보세요.', 1)
    A.append('%s, (예) 한 번 한 번 어느 면이 나올지 미리 알 수 없어서' % sim10_answer(91, 'coin'))
    step(s, 2, '동전 여러 번', '모둠 친구들의 결과 더하기')
    A.append(coin_cum_q(s, 92))
    step(s, 3, '주사위의 가능성', '3 이하와 4 이상')
    s.picture(fig('dice', svg_dice()), width_mm=100)
    d = list(range(1, 7))
    lo = [v for v in d if v <= 3]
    assert prob(lo, d) == F(1, 2)
    s.fill('3 이하인 눈 (              ),  3 이하가 나올 가능성 (      ),  4 이상이 나올 가능성 (      )')
    record_lh(s)
    e, k = dice_lowhigh(93, 10)
    A.append('%s, 1/2, 1/2, (예시) %s → 3 이하 %d번, 4 이상 %d번' % (L(lo), ' '.join(map(str, e)), k, 10 - k))
    step(s, 4, '주사위 여러 번', '150번까지 던지기')
    record_lh_cum(s)
    a = qa(s, [('150번 던지면 4 이상은 몇 번쯤 나올 것이라고 기대할 수 있나요?', 150 // 2, '번쯤')])
    s.choices([('같은 실험을 다시 하면 표의 수는', opt('똑같이 나와요', '조금씩 달라질 수 있어요'))])
    A.append('%s, %s, 조금씩 달라질 수 있어요' % (lh_cum_answer(94), a[0]))
    return tans(8, A)


HT9 = [('윗몸 말아 올리기', '회', [41, 36, 30, 45]), ('50 m 달리기', '초', ['9.8', '8.6', '9.2', '10.0']),
       ('공 던지기', 'm', [18, 25, 27, 21]), ('앉아 윗몸 앞으로 굽히기', 'cm', ['8.5', '12.3', '10.6', '6.2'])]
HS9 = [('제기차기', '회', [12, 7, 16, 9]), ('30초 줄넘기', '회', [52, 57, 48, 63]),
       ('공 멀리 던지기', 'm', ['19.4', '23.1', '17.8', '20.5']), ('제자리멀리뛰기', 'cm', ['142.6', '151.2', '146.4', '148.0'])]


def htb9(s, lv):
    A = []
    step(s, 0, '놀이 방법', '차례 정하기')
    items = ['평균에 가장 가까운 사람을 찾아요.', '표에 제목, 이름, 기록을 적어요.', '평균을 구할 주제를 정해요.', '다른 주제로 되풀이해요.', '기록을 측정해요.']
    order = [2, 4, 1, 0, 3]
    s.table([['차례', '할 일']] + [['(    )', t] for t in items], col_mm=[25, 155])
    rank = {idx: k + 1 for k, idx in enumerate(order)}
    A.append('(위에서부터) ' + ', '.join(str(rank[i]) for i in range(5)))
    step(s, 1, '평균 구하기', '가은이네 모둠의 새 기록')
    A.append(h_t9(s, TB_NM9, HT9, ('cm', 'm')))
    step(s, 2, '가장 가까운 사람', '기록과 평균의 차이')
    A.append(h_t9_near(s, TB_NM9, HT9))
    step(s, 3, '우리 모둠 놀이', '주제를 고르고 기록 재기')
    h_myplay(s)
    A.append('(모둠마다 다름, 두 합은 같아요)')
    step(s, 4, '또 다른 놀이', '비밀 숫자 찾기 연습')
    A.append(h_secret(s, TB_NM9, [8, 13, 5, 11], 9, 10, '설계자는 “5개 수의 평균은 %d이야.”라고 알려 주었어요.'))
    return tans(9, A)


def htb10(s, lv):
    A = []
    step(s, 0, '고르게 하기', '1번 · 은찬이의 회별 투호 기록')
    v1 = [5, 2, 4, 1, 3]
    m1, mv = level_steps(v1)
    s.picture(fig('htb10cir', svg_stack(['1회', '2회', '3회', '4회', '5회'], v1, 'circle', '은찬이의 회별 투호 기록')), width_mm=110)
    a = qa(s, [('○를 옮겨 고르게 하면 기록의 평균', m1, '개'), ('옮긴 ○의 수(가장 적게)', sum(k for *_, k in mv), '개')])
    A.append(' / '.join(a))
    step(s, 1, '평균 구하기', '2번 · 6일 동안의 도서관 이용객 수')
    A.append(h_mean_tab(s, '', ['월', '화', '수', '목', '금', '토'], '요일', '이용객 수(명)', [212, 198, 225, 204, 219, 202], '명', strip=False))
    step(s, 2, '가능성 비교', '3~4번 · 주머니와 회전판')
    bags = [('가', [(YEL, '노', 2), (GREEN, '초', 4)]), ('나', [(YEL, '노', 4), (GREEN, '초', 2)]), ('다', [(YEL, '노', 6)]),
            ('라', [(GREEN, '초', 6)]), ('마', [(YEL, '노', 3), (GREEN, '초', 3)])]
    py = [F(sum(m for _, k, m in it if k == '노'), 6) for _, it in bags]
    o3 = rank_order([n for n, _ in bags], py)
    s.picture(fig('htb10bag', svg_bags(bags)), width_mm=172)
    s.ask('3. 노란색 구슬이 나올 가능성이 높은 주머니부터:  (     ) → (     ) → (     ) → (     ) → (     )', blank=False)
    sp = [('㉠', [(F(1, 2), RED, '빨'), (F(1, 4), YEL, '노'), (F(1, 4), BLUE, '파')]), ('㉡', [(F(1, 8), RED, '빨'), (F(1, 8), YEL, '노'), (F(3, 4), BLUE, '파')]),
          ('㉢', [(F(1, 4), RED, '빨'), (F(1, 2), YEL, '노'), (F(1, 4), BLUE, '파')])]
    s.picture(fig('htb10sp', svg_spinners(sp, 70)), width_mm=120)
    fr = [[next(f for f, c, _ in secs if c == col) for col in (RED, YEL, BLUE)] for _, secs in sp]
    tabs = [[11, 19, 10], [21, 9, 10], [5, 4, 31]]
    mt = ['㉠㉡㉢'[match_spinner(fr, t)] for t in tabs]
    s.text('4. 회전판을 40번 돌린 결과 표와 알맞은 회전판을 이어 보세요.')
    s.table([['표', '빨간색', '노란색', '파란색', '회전판']] + [['표 %s' % '①②③'[i]] + [str(v) for v in t] + ['(      )'] for i, t in enumerate(tabs)],
            col_mm=[30, 35, 35, 35, 45])
    A.append('3번 %s, 4번 표① %s, 표② %s, 표③ %s' % ((' → '.join(o3),) + tuple(mt)))
    step(s, 3, '말과 수 · 평균 활용', '5~6번')
    c12 = list(range(1, 13))
    s.text('5. 1부터 12까지의 수 카드 12장이 든 상자에서 카드 한 장을 꺼내요.')
    b = qa(s, [('짝수일 가능성을 말로', W3[cat3(prob([v for v in c12 if v % 2 == 0], c12))]), ('13 이상일 가능성을 수로', frac_txt(prob([v for v in c12 if v >= 13], c12))),
               ('12 이하일 가능성을 수로', frac_txt(prob([v for v in c12 if v <= 12], c12)))])
    s.text('6. 예린: 통 7개, 통 한 개에 평균 84마리 / 윤호: 통 9개, 통 한 개에 평균 66마리')
    y, w = 84 * 7, 66 * 9
    c = qa(s, [('예린이가 접은 종이학', y, '마리'), ('윤호가 접은 종이학', w, '마리'), ('누가 몇 마리 더 많이 접었나요?', '%s, %d마리' % ('윤호' if w > y else '예린', abs(w - y)))])
    A.append('%s / %s' % (' / '.join(b), ' / '.join(c)))
    step(s, 4, '확인하고 정리해요', '평균과 가능성')
    v5 = [34, 27, 41, 30]
    d = qa(s, [('자료 34, 27, 41, 30의 평균', fmt(avg(v5)))])
    dd = list(range(1, 7))
    cards = [('주사위 눈의 수가 8일 가능성', prob([v for v in dd if v == 8], dd)), ('3의 배수일 가능성', prob([v for v in dd if v % 3 == 0], dd)),
             ('짝수일 가능성', prob([v for v in dd if v % 2 == 0], dd)), ('4 이하일 가능성', prob([v for v in dd if v <= 4], dd)),
             ('1 이상일 가능성', prob([v for v in dd if v >= 1], dd))]
    s.text('주사위 한 개를 던졌을 때 나온 눈의 수가 … 가능성을 가능성 띠에 놓아 보세요.')
    A.append('%s, %s' % (d[0], scale_cards(s, lv, cards, nums=True)))
    return tans(10, A)


# ---------------------------------------------------------------- 이야기 버전
def hst1(s, lv):
    A = []
    step(s, 0, '만져 보기', '보기 · 생각하기 · 궁금해하기')
    s.picture(fig('hstboard', svg_board(['반별 이어달리기 기록으로 반 대표 기록 정하기', '사람 수가 다른 두 팀의 줄다리기 연습 기록 비교하기', '행운권 뽑기 상자 만들기',
                                          '돌림판 놀이 만들기', '윷 던지기 실험 부스 열기'], '가을 운동회 준비할 일')), width_mm=140)
    write_pane(s, lv, [('보여요', ''), ('생각해요', ''), ('궁금해요', '')])
    A.append('(자유)')
    step(s, 1, '그려 보기', '운동장 둘러보기')
    s.text('운동장 여섯 곳에서 알아볼 것을 ‘평균’ 또는 ‘가능성’으로 써 보세요.')
    A.append(pick_words(s, [('기록판 — 반 대표 기록', 0), ('행운권 상자 — 당첨될 정도', 1), ('줄다리기 — 한 사람당 기록', 0), ('돌림판 — 선물 칸에 멈출 정도', 1),
                            ('윷 던지기 — 모가 나올 정도', 1), ('간식 나누기 — 한 반에 줄 간식 수', 0)]))
    step(s, 2, '말해 보기', '평균일까, 가능성일까')
    items = [('사람 수가 다른 두 팀의 기록 비교하기', 0), ('주사위를 던져 백팀이 먼저 할 정도 알아보기', 1), ('일주일 동안 연습한 시간을 대표하는 값 정하기', 0)]
    s.choices([(q, opt('평균', '가능성')) for q, _ in items])
    thenwhy(s, lv, '주사위를 던져 먼저 할 팀을 정하는 일이 가능성과 관련 있는 까닭은?', '')
    A.append('%s, (예) 어떤 눈이 나올지 미리 알 수 없고 기대하는 정도를 말하므로' % ', '.join(['평균', '가능성'][k] for _, k in items))
    step(s, 3, '약속하기', '4학년 때 배운 그래프')
    A.append(h_graphs(s, 'hst1', ['줄다리기', '박 깨기', '공 굴리기', '장애물 경주'], [7, 9, 4, 6], '하고 싶은 경기별 학생 수', '경기', '학생 수',
                      ['9시', '10시', '11시', '12시', '1시'], [12, 14, 18, 20, 19], 10, 22, 2, '운동회 날 운동장의 기온'))
    step(s, 4, '확인하기', '무엇을 배울까요')
    seq = ['평균을 구하는 방법 알기', '일이 일어날 가능성을 비교하기', '자료를 고르게 하여 평균의 뜻 알기', '일이 일어날 가능성을 수로 나타내기',
           '평균을 이용하여 문제 해결하기', '일이 일어날 가능성을 말로 표현하기']
    order = [2, 0, 4, 5, 1, 3]
    rank = {idx: k + 1 for k, idx in enumerate(order)}
    s.text('배우는 순서대로 번호를 써 보세요.')
    s.table([['차례', '배울 내용']] + [['(    )', t] for t in seq], col_mm=[25, 155])
    A.append('(위에서부터) ' + ', '.join(str(rank[i]) for i in range(6)))
    return tans(1, A)


def hst2(s, lv):
    A = []
    step(s, 0, '만져 보기', '응원 깃발 고르게 하기')
    rule_first(s, lv, '모둠마다 다른 응원 깃발 수를 하나의 수로 나타내려면 어떻게 하면 좋을까요?', '')
    A.append('(예상 자유) ' + h_level(s, 'hst2blk', ['1모둠', '2모둠', '3모둠', '4모둠', '5모둠'], [9, 5, 8, 4, 9], 'block',
                                      '모둠별로 만든 응원 깃발 수(쌓기나무 1개 = 깃발 1개)', '개'))
    step(s, 1, '그려 보기', '박 터뜨리기 연습 ○ 옮기기')
    kn, kv = ['하윤', '서준', '민재', '예나', '도현', '수아'], [7, 3, 6, 2, 5, 7]
    hdata(s, kn, kv, '이름', '맞힌 콩 주머니(개)')
    A.append(h_level(s, 'hst2cir', kn, kv, 'circle', '학생별 박 터뜨리기 연습 기록', '개'))
    step(s, 2, '말해 보기', '대표하는 값 정하기')
    s.text('네 모둠이 만든 응원 머리띠 수는 8개, 8개, 2개, 6개예요.')
    a = qa(s, [('머리띠 수를 대표하는 값(고르게 한 수)', fmt(avg([8, 8, 2, 6])), '개'), ('8개, 8개, 2개, 6개처럼 자료 하나하나의 값', '자룟값')])
    thenwhy(s, lv, '가장 많이 나온 수(8개)를 대표하는 값으로 정하면 안 되는 까닭은?', '')
    A.append('%s, (예) 2개·6개를 만든 모둠의 수가 반영되지 않아요' % ' / '.join(a))
    step(s, 3, '약속하기', '평균')
    s.fill(['자룟값을 고르게 하여 얻은 값을 그 자료의 (            )이라고 해요.', '평균은 자료 전체를 (                ) 값으로 쓸 수 있어요.'])
    A.append('평균, 대표하는')
    step(s, 4, '확인하기', '반별 운동회 응원단 수')
    A.append(h_over_under(s, 'hst2bar', ['1반', '2반', '3반', '4반', '5반'], [14, 9, 12, 10, 15], '반별 운동회 응원단 수', '반', '응원단 수', '명', 20, 12))
    return tans(2, A)


def hst3(s, lv):
    A = []
    step(s, 0, '만져 보기', '콩 주머니 띠 이어 붙이기')
    s.text('바구니 5개에 든 콩 주머니 수를 종이띠로 나타냈어요.')
    A.append(h_strip(s, 'hst3strip', ['빨강', '파랑', '노랑', '초록', '보라'], [7, 3, 10, 6, 4], '개'))
    step(s, 1, '그려 보기', '서준이의 6일 동안 1분 줄넘기 기록 띠')
    A.append(h_mean_tab(s, 'hst3strip2', ['1일', '2일', '3일', '4일', '5일', '6일'], '날짜', '기록(회)', [104, 117, 109, 122, 113, 101], '회'))
    step(s, 2, '말해 보기', '띠와 계산 잇기')
    s.fill(['종이띠를 모두 이어 붙이는 것은 자룟값을 (              ) 것과 같아요.', '이어 붙인 띠를 5칸으로 똑같이 나누는 것은 (              )로 나누는 것과 같아요.'])
    thenwhy(s, lv, '콩 주머니 띠를 4등분이 아니라 5등분한 까닭은?', '')
    A.append('모두 더하는, 자료의 수(5), (예) 바구니가 5개라서')
    step(s, 3, '약속하기', '평균 구하는 식')
    s.fill(['(평균) = (                    ) ÷ (            )', '자료가 7개이면 자룟값을 모두 더한 수를 (      )로 나누어요.'])
    A.append('자룟값을 모두 더한 수, 자료의 수, 7')
    step(s, 4, '확인하기', '연습 시간, 운동장을 쓴 학생 수')
    jv = [42, 35, 51, 28, 44]
    uv = [176, 210, 194, 188, 231, 205, 203]
    assert avg(jv).denominator == 1 and avg(uv).denominator == 1
    hdata(s, KIDS + ['도현'], jv, '이름', '시간(분)')
    a = qa(s, [('다섯 명의 연습 시간의 평균', fmt(avg(jv)), '분')])
    hdata(s, ['1일', '2일', '3일', '4일', '5일', '6일', '7일'], uv, '날짜', '학생 수(명)')
    lo = [d for d, v in zip(['1일', '2일', '3일', '4일', '5일', '6일', '7일'], uv) if v < avg(uv)]
    b = qa(s, [('학생 수의 합', fmt(total(uv)), '명'), ('운동장을 쓴 학생 수의 평균', fmt(avg(uv)), '명'), ('평균보다 적은 날', L(lo))])
    A.append('%s / %s' % (a[0], ' / '.join(b)))
    return tans(3, A)


def hst4(s, lv):
    A = []
    step(s, 0, '만져 보기', '청팀과 백팀 비교하기')
    rule_first(s, lv, '사람 수가 다른 두 팀의 기록을 공정하게 비교하려면 어떻게 하면 좋을까요?', '')
    s.text('박 터뜨리기 예선에서 청팀은 4명, 백팀은 6명이 콩 주머니를 맞혔어요.')
    A.append('(예상 자유) ' + h_teams(s, 'hst4', '청팀', [9, 7, 10, 6], '백팀', [8, 5, 9, 6, 7, 7], '개'))
    step(s, 1, '그려 보기', '빠진 반의 기록(평균 36개)')
    A.append(h_unknown(s, 'hst4bar', ['1반', '2반', '3반', '4반', '5반', '6반'], [41, 33, None, 38, 29, 35], 36, '반별 응원 도구 수', '반', '응원 도구 수', '개', 50, 5))
    step(s, 2, '말해 보기', '합계와 평균')
    s.fill(['참가한 사람 수가 다른 두 팀을 합계로 비교하면 (                ) 팀이 유리해요.', '그래서 사람 수가 다른 두 집단은 (          )으로 비교해요.'])
    thenwhy(s, lv, '백팀의 합계가 더 큰데도 청팀이 더 잘했다고 할 수 있는 까닭은?', '')
    A.append('사람 수가 많은, 평균, (예) 평균이 청팀 8개, 백팀 7개라서')
    step(s, 3, '약속하기', '모르는 자룟값 구하기')
    s.fill(['(전체 합) = (평균) (    ) (자료의 수)', '(모르는 자룟값) = (전체 합) (    ) (아는 자룟값의 합)'])
    A.append('×, −')
    step(s, 4, '확인하기', '평균이 같은 두 모둠')
    A.append(h_same_mean(s, ['서준이네 모둠', '서준', '준우', '지아', '도현', '수아'], [9, 6, 11, 8, 6], ['하윤이네 모둠', '하윤', '민재', '예나', '태오'],
                         [10, None, 7, 5], '기록(개)'))
    return tans(4, A)


def hst5(s, lv):
    A = []
    step(s, 0, '만져 보기', '간식 상자에서 꺼내기(꺼낸 것은 다시 넣어요)')
    s.text('이번 간식 상자에는 초코우유 5개와 바나나우유 1개가 들어 있어요.')
    A.append(h_box_words(s, 'hst5box', '간식 상자', [('#8B5A2B', '초', 5), ('#F2D04B', '바', 1)],
                         [('초코우유가 나올 가능성', 5), ('바나나우유가 나올 가능성', 1), ('딸기우유가 나올 가능성', 0), ('우유가 나올 가능성', 6)]))
    step(s, 1, '그려 보기', '가능성 띠에 카드 놓기')
    n8 = list(range(1, 9))
    cards = [('1부터 8까지 번호표 중 한 장을 뽑으면 홀수일 것입니다.', prob([v for v in n8 if v % 2], n8)), ('운동회 날이 금요일이면 다음 날은 토요일일 것입니다.', F(1)),
             ('1부터 8까지 번호표 중 한 장을 뽑으면 8일 것입니다.', F(1, 8)), ('주사위를 던지면 눈의 수가 0일 것입니다.', F(0)),
             ('1부터 8까지 번호표 중 한 장을 뽑으면 2 이상일 것입니다.', prob([v for v in n8 if v >= 2], n8))]
    A.append(scale_cards(s, lv, cards))
    step(s, 2, '말해 보기', '응원 막대 뽑기(파란 막대 5개, 노란 막대 4개)')
    s.picture(fig('hst5bag', svg_bags([('응원 막대 주머니', [(BLUE, '파', 5), (YEL, '노', 4)])])), width_mm=55)
    a = qa(s, [('파란 막대가 나올 가능성', W5[cat5(F(5, 9))]), ('노란 막대가 나올 가능성', W5[cat5(F(4, 9))]), ('빨간 막대가 나올 가능성', W5[0])])
    thenwhy(s, lv, '노란 막대를 몇 개 더 넣으면 노란 막대가 나올 가능성이 ‘~일 것 같다’가 될지 가장 적은 개수로 쓰고 까닭도 써 보세요.', '')
    A.append('%s, 2개(노란 막대 6개가 파란 막대 5개보다 많아지므로)' % ' / '.join(a))
    step(s, 3, '약속하기', '가능성')
    s.fill(['어떤 일이 일어나길 기대할 수 있는 정도를 (          )이라고 해요.', '가장 낮은 말은 (            ), 가장 높은 말은 (            ), 가운데 말은 (            )예요.'])
    A.append('가능성, 불가능하다, 확실하다, 반반이다')
    step(s, 4, '확인하기', '잘못 말한 친구 찾기')
    assert 7 * 8 == 56 and (11 + 3) - 12 == 2
    s.text('서준: “지금은 오전 11시니까 3시간 후에 오후 2시일 가능성은 ‘확실하다’야.”')
    s.text('하윤: “계산기에 7, ×, 8, =을 차례대로 누르면 56이 나올 가능성은 ‘반반이다’야.”')
    s.text('도현: “주사위를 던져 눈의 수가 1이 나올 가능성은 ‘~아닐 것 같다’야.”')
    b = qa(s, [('가능성을 잘못 말한 사람', '하윤'), ('그 말을 바르게 고치면', '확실하다')])
    A.append(' / '.join(b))
    return tans(5, A)


def hst6(s, lv):
    A = []
    step(s, 0, '만져 보기', '팀 조끼 주머니 가·나·다·라')
    A.append(h_bags_rank(s, 'hst6bag', [('가', [(BLUE, '파', 1), (RED, '빨', 3)]), ('나', [(BLUE, '파', 4)]), ('다', [(BLUE, '파', 3), (RED, '빨', 3)]),
                                         ('라', [(BLUE, '파', 4), (RED, '빨', 2)])], '파'))
    step(s, 1, '그려 보기', '회전판 게임 다섯 개(보라색 = 당첨, 하늘색 = 꽝)')
    sp = [('가', [(F(5, 8), WIN, '당첨'), (F(3, 8), LOSE, '꽝')]), ('나', [(F(1, 2), WIN, '당첨'), (F(1, 2), LOSE, '꽝')]), ('다', [(F(1), LOSE, '꽝')]),
          ('라', [(F(7, 8), WIN, '당첨'), (F(1, 8), LOSE, '꽝')]), ('마', [(F(3, 8), WIN, '당첨'), (F(5, 8), LOSE, '꽝')])]
    pw, nm, a = h_spin5(s, 'hst6sp', sp, WIN, ('가', '마'))
    A.append(a)
    step(s, 2, '말해 보기', '당첨되기 쉬운 차례')
    o = rank_order(nm, pw)
    s.ask('당첨에 멈출 가능성이 높은 회전판부터: (      ) → (      ) → (      ) → (      ) → (      )', blank=False)
    thenwhy(s, lv, '회전판 마가 나보다 당첨될 가능성이 낮은 까닭은?', '')
    A.append('%s, (예) 마는 당첨 부분이 반보다 좁아요' % ' → '.join(o))
    step(s, 3, '약속하기', '가능성 비교하기')
    s.fill(['두 가능성을 비교할 때에는 ‘(            )’를 기준으로 삼으면 편리해요.', '회전판에서 색칠된 부분이 (            ) 그 색에 멈출 가능성이 낮아요.'])
    A.append('반반이다, 좁을수록')
    step(s, 4, '확인하기', '결과 표로 예상하기')
    b = h_counts100(s, 'hst6hb', [('빨간색', 26, RED), ('흰색', 47, '#C9CED1'), ('초록색', 27, GREEN)], '색별 나온 공의 횟수')
    o5 = h_dice3(s, [('눈의 수가 2의 배수', lambda v: v % 2 == 0), ('눈의 수가 5 이상', lambda v: v >= 5), ('눈의 수가 1이 아님', lambda v: v != 1)])
    A.append('%s, %s' % (b, o5))
    return tans(6, A)


def hst7(s, lv):
    A = []
    bags = [('가', [('#E0B43A', '금', 3), ('#B8C0C6', '은', 1)]), ('나', [('#B8C0C6', '은', 4)]), ('다', [('#E0B43A', '금', 2), ('#B8C0C6', '은', 2)]),
            ('라', [('#E0B43A', '금', 4)])]
    pg = [F(sum(m for _, k, m in it if k == '금'), 4) for _, it in bags]
    step(s, 0, '만져 보기', '경품 상자 가·나·다·라')
    s.picture(fig('hst7bag', svg_bags(bags, 'box')), width_mm=150)
    s.text('금색 카드가 나올 가능성을 알맞은 말로 써 보세요. (' + W5C + ')')
    qa(s, [('상자 %s' % n, '') for n, _ in bags])
    A.append(', '.join(W5[cat5(x)] for x in pg))
    step(s, 1, '그려 보기', '가능성 띠를 수로')
    rule_first(s, lv, '상자 가에서 금색 카드가 나올 가능성은 0, 1/2, 1 가운데 어느 수와 어느 수 사이일까요?', '')
    s.picture(fig('scale3q', svg_scale(3, qmarks=True, boxes=False)), width_mm=165)
    s.fill(['금색 카드가 나올 가능성을 수로:  나 (      ),  다 (      ),  라 (      )'])
    A.append('(예상) 1/2과 1 사이, 나 %s, 다 %s, 라 %s' % tuple(frac_txt(x) for x in pg[1:]))
    step(s, 2, '말해 보기', '동전과 회전판')
    sp = [('가', [(F(1), YEL, '노')]), ('나', [(F(1, 2), RED, '빨'), (F(1, 2), YEL, '노')]), ('다', [(F(1), RED, '빨')])]
    pr = [sum(f for f, c, _ in secs if c == RED) for _, secs in sp]
    s.picture(fig('hst7sp', svg_spinners(sp, 70)), width_mm=110)
    a = qa(s, [('빨간색에 멈출 가능성을 수로: 가, 나, 다', ', '.join(frac_txt(x) for x in pr)), ('노란색에 멈출 가능성을 수로: 가, 나, 다', ', '.join(frac_txt(1 - x) for x in pr)),
               ('동전을 던져 숫자 면이 나올 가능성과 같은 회전판', '나')])
    thenwhy(s, lv, '회전판 나에서 빨간색에 멈출 가능성과 노란색에 멈출 가능성을 더하면 1이 되는 까닭은?', '')
    A.append('%s, (예) 화살은 빨간색이나 노란색 중 하나에 꼭 멈추므로' % ' / '.join(a))
    step(s, 3, '약속하기', '가능성을 수로')
    s.fill(['가능성을 수로 나타낼 때 가장 작은 수는 (      ), 가장 큰 수는 (      )이에요.', '‘반반이다’는 (      )로 나타내요.'])
    A.append('0, 1, 1/2')
    step(s, 4, '확인하기', '주사위 말과 수')
    s.picture(fig('dice', svg_dice()), width_mm=110)
    s.ask('눈의 수가 3 이하인 눈을 모두 써 보세요.')
    b = h_dice_table(s, [('눈의 수가 3 이하일 가능성', lambda v: v <= 3), ('눈의 수가 10일 가능성', lambda v: v == 10),
                         ('눈의 수가 6 이하일 가능성', lambda v: v <= 6), ('눈의 수가 2, 4, 6 중 하나일 가능성', lambda v: v % 2 == 0)])
    A.append('1, 2, 3 / %s' % b)
    return tans(7, A)


def hst8(s, lv):
    A = []
    step(s, 0, '만져 보기', '동전의 가능성')
    A.append(', '.join(h_coin_q(s)))
    step(s, 1, '그려 보기', '동전 10번 던지기')
    record10(s, 'coin')
    qa(s, [('그림면이 나온 횟수와 숫자 면이 나온 횟수의 차', '', '번')])
    why(s, '10번 던졌을 때 그림면이 꼭 5번 나오지 않는 까닭을 써 보세요.', 1)
    A.append('%s, (예) 한 번 한 번 어느 면이 나올지 미리 알 수 없어서' % sim10_answer(191, 'coin'))
    step(s, 2, '말해 보기', '동전 120번 던지기')
    A.append(coin_cum_q(s, 192))
    thenwhy(s, lv, '10번 던졌을 때와 120번 던졌을 때를 견주어 알게 된 것은?', '')
    step(s, 3, '약속하기', '주사위 3 이하와 4 이상')
    s.text('주사위 놀이에서 3 이하가 나오면 청팀, 4 이상이 나오면 백팀이 먼저 해요.')
    s.picture(fig('dice', svg_dice()), width_mm=100)
    d = list(range(1, 7))
    hi = [v for v in d if v >= 4]
    assert prob(hi, d) == F(1, 2)
    s.fill('4 이상인 눈 (              ),  3 이하가 나올 가능성 (      ),  4 이상이 나올 가능성 (      ) → 이 방법은 두 팀에게 (            )')
    record_lh(s)
    e, k = dice_lowhigh(193, 10)
    A[-1] += ', (예) 많이 던질수록 두 면이 나온 횟수가 비슷해져요'
    A.append('%s, 1/2, 1/2, 공정해요, (예시) %s → 3 이하 %d번, 4 이상 %d번' % (L(hi), ' '.join(map(str, e)), k, 10 - k))
    step(s, 4, '확인하기', '주사위 여러 번')
    record_lh_cum(s)
    a = qa(s, [('150번 던지면 3 이하는 몇 번쯤 나올 것이라고 기대할 수 있나요?', 150 // 2, '번쯤')])
    s.choices([('같은 실험을 다시 하면 표의 수는', opt('똑같이 나와요', '조금씩 달라질 수 있어요'))])
    A.append('%s, %s, 조금씩 달라질 수 있어요' % (lh_cum_answer(194), a[0]))
    return tans(8, A)


def hst9(s, lv):
    A = []
    step(s, 0, '만져 보기', '놀이 방법 차례 정하기')
    items = ['평균에 가장 가까운 사람을 찾아요.', '기록을 재요.', '다른 주제를 정하여 되풀이해요.', '평균을 구할 주제를 정해요.', '표에 제목, 이름, 기록을 적어요.']
    order = [3, 1, 4, 0, 2]
    s.table([['차례', '할 일']] + [['(    )', t] for t in items], col_mm=[25, 155])
    rank = {idx: k + 1 for k, idx in enumerate(order)}
    A.append('(위에서부터) ' + ', '.join(str(rank[i]) for i in range(5)))
    step(s, 1, '그려 보기', '서준이네 모둠의 새 주제별 평균')
    A.append(h_t9(s, KIDS, HS9, ('cm', 'm')))
    step(s, 2, '말해 보기', '가장 가까운 사람')
    A.append(h_t9_near(s, KIDS, HS9))
    thenwhy(s, lv, '평균에 가장 가까운 사람을 ‘모둠을 대표하는 친구’라고 할 수 있는 까닭은?', '')
    A[-1] += ', (예) 평균은 모둠 기록을 고르게 한 값이라 차이가 가장 작은 친구가 모둠을 잘 대표해요'
    step(s, 3, '약속하기', '우리 모둠 기록왕 놀이')
    h_myplay(s)
    A.append('(모둠마다 다름, 두 합은 같아요)')
    step(s, 4, '확인하기', '비밀 숫자 찾기 연습')
    A.append(h_secret(s, ['서준', '하윤', '예나', '도현'], [14, 6, 11, 9], 10, 12, '진행자 민재는 “5개 수의 평균은 %d이야.”라고 알려 주었어요.'))
    return tans(9, A)


def hst10(s, lv):
    A = []
    step(s, 0, '만져 보기', '민재의 회별 박 터뜨리기 기록 고르게 하기')
    v1 = [6, 2, 5, 1, 6]
    m1, mv = level_steps(v1)
    s.picture(fig('hst10cir', svg_stack(['1회', '2회', '3회', '4회', '5회'], v1, 'circle', '민재의 회별 박 터뜨리기 기록')), width_mm=110)
    a = qa(s, [('○를 옮겨 고르게 하면 기록의 평균', m1, '개'), ('옮긴 ○의 수(가장 적게)', sum(k for *_, k in mv), '개')])
    A.append(' / '.join(a))
    step(s, 1, '그려 보기', '6일 동안 응원 연습에 참여한 학생 수')
    A.append(h_mean_tab(s, '', ['1일', '2일', '3일', '4일', '5일', '6일'], '날짜', '학생 수(명)', [93, 87, 101, 96, 84, 97], '명', strip=False))
    step(s, 2, '말해 보기', '경품 뽑기와 회전판 발표')
    bags = [('가', [(RED, '빨', 4), (BLUE, '파', 2)]), ('나', [(BLUE, '파', 6)]), ('다', [(RED, '빨', 3), (BLUE, '파', 3)]),
            ('라', [(RED, '빨', 2), (BLUE, '파', 4)]), ('마', [(RED, '빨', 6)])]
    prr = [F(sum(m for _, k, m in it if k == '빨'), 6) for _, it in bags]
    o3 = rank_order([n for n, _ in bags], prr)
    s.picture(fig('hst10bag', svg_bags(bags)), width_mm=172)
    s.ask('빨간 공이 나올 가능성이 높은 주머니부터:  (     ) → (     ) → (     ) → (     ) → (     )', blank=False)
    sp = [('㉠', [(F(1, 4), RED, '빨'), (F(1, 2), YEL, '노'), (F(1, 4), BLUE, '파')]), ('㉡', [(F(1, 2), RED, '빨'), (F(1, 4), YEL, '노'), (F(1, 4), BLUE, '파')]),
          ('㉢', [(F(1, 8), RED, '빨'), (F(1, 8), YEL, '노'), (F(3, 4), BLUE, '파')])]
    s.picture(fig('hst10sp', svg_spinners(sp, 70)), width_mm=120)
    fr = [[next(f for f, c, _ in secs if c == col) for col in (RED, YEL, BLUE)] for _, secs in sp]
    tabs = [[19, 11, 10], [4, 6, 30], [9, 21, 10]]
    mt = ['㉠㉡㉢'[match_spinner(fr, t)] for t in tabs]
    s.text('회전판을 40번 돌린 결과 표와 알맞은 회전판을 이어 보세요.')
    s.table([['표', '빨간색', '노란색', '파란색', '회전판']] + [['표 %s' % '①②③'[i]] + [str(v) for v in t] + ['(      )'] for i, t in enumerate(tabs)],
            col_mm=[30, 35, 35, 35, 45])
    thenwhy(s, lv, '결과 표 ②가 회전판 ㉢과 어울리는 까닭은?', '')
    A.append('%s, 표① %s, 표② %s, 표③ %s, (예) 파란색에 가장 많이 멈췄고 ㉢은 파란색이 가장 넓어요' % ((' → '.join(o3),) + tuple(mt)))
    step(s, 3, '약속하기', '말과 수, 평균 활용')
    c8 = list(range(1, 9))
    s.text('1부터 8까지의 수 카드 8장이 든 상자에서 카드 한 장을 꺼내요.')
    b = qa(s, [('홀수일 가능성을 말로', W3[cat3(prob([v for v in c8 if v % 2], c8))]), ('9 이상일 가능성을 수로', frac_txt(prob([v for v in c8 if v >= 9], c8)))])
    s.text('청팀은 모둠 7개가 종이꽃을 모둠마다 평균 48개씩, 백팀은 모둠 8개가 모둠마다 평균 43개씩 만들었어요.')
    cw, bw = 48 * 7, 43 * 8
    c = qa(s, [('청팀이 만든 종이꽃', cw, '개'), ('백팀이 만든 종이꽃', bw, '개'), ('어느 팀이 몇 개 더 많이 만들었나요?', '%s, %d개' % ('백팀' if bw > cw else '청팀', abs(bw - cw)))])
    A.append('%s / %s' % (' / '.join(b), ' / '.join(c)))
    step(s, 4, '확인하기', '처음 궁금증 돌아보기')
    s.text('1차시의 ‘궁금해요’ 쪽지를 다시 보고, 운동회 준비를 마무리하는 글을 써 보세요.')
    write_pane(s, lv, [('궁금증에 답하기', ''), ('평균이나 가능성을 써서 해결한 일', ''), ('더 알고 싶은 것', '')])
    A.append('(예) 응원단 수 14, 9, 12, 10, 15의 평균은 60 ÷ 5 = 12(명)')
    return tans(10, A)


def build(funcs, label, short, outdir, lv):
    s = Sheet(unit_label=label, level=lv, grade_label='5학년')
    lines = [f(s, lv) for f in funcs]
    s.answers('【교사용】 6. 평균과 가능성(%s) 활동지 정답 (%s)' % (short, lv), lines,
              note='※ 이 활동지는 앱 u6-avg.html과 차시 번호가 같습니다. 동전·주사위 기록표의 답은 학생마다 다르며, 정답 쪽의 수는 예시예요.')
    os.makedirs(outdir, exist_ok=True)
    path = os.path.join(outdir, NAME % lv)
    s.save(path)
    return path


def main():
    out = []
    try:
        for lv in ('기본형', '도전형'):
            out.append(build(TB, '5-2 수학 6. 평균과 가능성(교과서 차시)', '교과서 차시', OUT_TB, lv))
            out.append(build(ST, '5-2 수학 6. 평균과 가능성(이야기 버전)', '이야기 버전', OUT_ST, lv))
    finally:
        shutil.rmtree(WORK, ignore_errors=True)
    bad = 0
    for p in out:
        prob_ = check(p)
        bad += bool(prob_)
        print(p, 'OK' if not prob_ else '\n  ' + '\n  '.join(prob_))
    sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()
