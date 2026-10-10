# -*- coding: utf-8 -*-
"""4-2 수학 2. 삼각형 활동지(HWPX) 만들기 — 교과서 차시 버전·이야기 버전 × 기본형·도전형

    python3 gen_u2-triangle.py

앱 원본: grade4/math/_build/units/sem2/u2-triangle.tb.js(교과서 차시) · u2-triangle.st.js(이야기 버전)
차시 번호·제목·S.O.O.P.·탐구 질문·이야기·수는 앱과 같습니다.
삼각형은 앱과 같은 방법(t2SSS·t2ASA·t2Iso·t2SAS)으로 cm 좌표를 계산해 그리고, 이름(이등변·정·예각·직각·둔각)과
정답도 그 좌표에서 계산해 확인합니다. '자로 재어 보세요'·'각도기로 재어 보세요' 그림은 실제 크기(1 cm = 1 cm)로 넣습니다.
"""
import hashlib
import math
import os
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from hwpxgen import Sheet, svg_to_png, check  # noqa: E402

ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))          # grade4/math
OUT_TB = os.path.join(ROOT, 'sem2', 'sheets')
OUT_ST = os.path.join(ROOT, 'sem2-soop', 'sheets')
TMP = os.environ.get('U2T_CACHE') or tempfile.mkdtemp(prefix='u2tri_')
os.makedirs(TMP, exist_ok=True)
FONT = "'Noto Sans KR','WenQuanYi Zen Hei',sans-serif"
INK, TENT, BLUE, RED, GRAY, GREEN = '#1D2A2A', '#E47A38', '#2B6FB8', '#C8472E', '#8795A1', '#24965A'
TFILL = '#FFF3E2'
KO = '가나다라마바사아자차'
CIR = '㉠㉡㉢㉣㉤'


# ================================================================ 삼각형 계산(앱과 같은 방법, cm·수학 방향)
def rad(d):
    return d * math.pi / 180


def turn(p, deg=0, flip=False):
    q = [(-x if flip else x, y) for x, y in p]
    cx, cy = sum(v[0] for v in q) / 3, sum(v[1] for v in q) / 3
    c, s = math.cos(rad(deg)), math.sin(rad(deg))
    return [(cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c) for x, y in q]


def SSS(s0, s1, s2, rot=0, flip=False):
    """세 변: s0 = 꼭짓점0→1, s1 = 1→2, s2 = 2→0"""
    x = (s0 * s0 + s2 * s2 - s1 * s1) / (2 * s0)
    y = math.sqrt(max(0, s2 * s2 - x * x))
    return turn([(0, 0), (s0, 0), (x, y)], rot, flip)


def ASA(A0, A1, s0, rot=0, flip=False):
    """밑변 s0와 양 끝 두 각(꼭짓점0의 각 A0, 꼭짓점1의 각 A1)"""
    s2 = s0 * math.sin(rad(A1)) / math.sin(rad(A0 + A1))
    return turn([(0, 0), (s0, 0), (s2 * math.cos(rad(A0)), s2 * math.sin(rad(A0)))], rot, flip)


def Iso(leg, apex, rot=0):
    """이등변: 길이가 같은 두 변 leg, 두 변 사이의 각 apex(꼭짓점2). 꼭짓점0·1은 밑변 양 끝"""
    hb, hh = leg * math.sin(rad(apex / 2)), leg * math.cos(rad(apex / 2))
    return turn([(-hb, 0), (hb, 0), (0, hh)], rot)


def SAS(l1, ang, l2, rot=0, flip=False):
    return turn([(0, 0), (l1, 0), (l2 * math.cos(rad(ang)), l2 * math.sin(rad(ang)))], rot, flip)


def move(p, dx, dy):
    return [(x + dx, y + dy) for x, y in p]


def info(p):
    L = [math.dist(p[i], p[(i + 1) % 3]) for i in range(3)]
    A = []
    for i in range(3):
        V, P, Q = p[i], p[(i + 2) % 3], p[(i + 1) % 3]
        u, w = (P[0] - V[0], P[1] - V[1]), (Q[0] - V[0], Q[1] - V[1])
        cs = (u[0] * w[0] + u[1] * w[1]) / (math.hypot(*u) * math.hypot(*w))
        A.append(math.degrees(math.acos(max(-1, min(1, cs)))))

    def pairs(X, t):
        if abs(X[0] - X[1]) < t and abs(X[1] - X[2]) < t:
            return [0, 1, 2]
        for i, j in ((0, 1), (1, 2), (0, 2)):
            if abs(X[i] - X[j]) < t:
                return [i, j]
        return []
    eqS, eqA, mx = pairs(L, .004), pairs(A, .05), max(A)
    side = '정' if len(eqS) == 3 else ('이등변' if len(eqS) == 2 else '부등변')
    ang = '직각' if abs(mx - 90) < .05 else ('둔각' if mx > 90 else '예각')
    return {'L': L, 'A': A, 'eqS': eqS, 'eqA': eqA, 'side': side, 'ang': ang}


def T(p, side=None, ang=None):
    """그림이 이름과 맞는지 확인(틀리면 바로 멈춤)"""
    I = info(p)
    assert side is None or I['side'] == side, (side, I['side'], I['L'])
    assert ang is None or I['ang'] == ang, (ang, I['ang'], I['A'])
    return p


SIDE = {'정': '정삼각형', '이등변': '이등변삼각형', '부등변': '세 변의 길이가 모두 다른 삼각형'}
SIDE_S = {'정': '정삼각형', '이등변': '이등변삼각형', '부등변': '세 변이 모두 다름'}
ANG = {'예각': '예각삼각형', '직각': '직각삼각형', '둔각': '둔각삼각형'}


def cmtxt(v):
    mm = round(v * 10)
    c, r = mm // 10, mm % 10
    return '%d cm %d mm' % (c, r) if r else '%d cm' % c


def degs(p):
    """세 각을 반올림한 수(합이 180인지 확인)"""
    a = []
    for x in info(p)['A']:
        h = round(x * 2) / 2                       # 27.5°처럼 반 도까지(합이 180이 되게)
        a.append(int(h) if h == int(h) else h)
    if sum(a) != 180:                              # 36.87°처럼 끝없는 수는 반올림한 자연수
        a = [round(x) for x in info(p)['A']]
    assert sum(a) == 180, a
    return a


def names2(p):
    """두 가지 기준의 이름(정삼각형은 이등변삼각형이기도 함)"""
    I = info(p)
    if I['side'] == '정':
        return '정삼각형(이등변삼각형), ' + ANG[I['ang']]
    if I['side'] == '이등변':
        return '이등변삼각형, ' + ANG[I['ang']]
    return ANG[I['ang']]


def nm_list(ps, f):
    return ', '.join(KO[i] for i, p in enumerate(ps) if f(info(p))) or '없음'


# ================================================================ SVG 캔버스
def F(v):
    return ('%.2f' % v).rstrip('0').rstrip('.')


class C:
    """SVG 캔버스: 그린 것의 테두리 상자를 기억해 viewBox를 저절로 정합니다."""

    def __init__(self):
        self.items, self.x0, self.y0, self.x1, self.y1 = [], 1e9, 1e9, -1e9, -1e9

    def see(self, *pts):
        for x, y in pts:
            self.x0, self.y0 = min(self.x0, x), min(self.y0, y)
            self.x1, self.y1 = max(self.x1, x), max(self.y1, y)

    def add(self, s, pts=()):
        self.items.append(s)
        self.see(*pts)
        return self

    def line(self, P, Q, col=INK, sw=5, dash=None, cap='round'):
        d = ' stroke-dasharray="%s"' % dash if dash else ''
        return self.add('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="%s" stroke-linecap="%s"%s/>'
                        % (F(P[0]), F(P[1]), F(Q[0]), F(Q[1]), col, F(sw), cap, d), [P, Q])

    def poly(self, pts, fill='none', col=INK, sw=4, dash=None, closed=True):
        tag = 'polygon' if closed else 'polyline'
        d = ' stroke-dasharray="%s"' % dash if dash else ''
        return self.add('<%s points="%s" fill="%s" stroke="%s" stroke-width="%s" stroke-linejoin="round"%s/>'
                        % (tag, ' '.join('%s,%s' % (F(x), F(y)) for x, y in pts), fill, col, F(sw), d), pts)

    def circle(self, P, r, fill=INK, col='none', sw=0, dash=None):
        d = ' stroke-dasharray="%s"' % dash if dash else ''
        return self.add('<circle cx="%s" cy="%s" r="%s" fill="%s" stroke="%s" stroke-width="%s"%s/>'
                        % (F(P[0]), F(P[1]), F(r), fill, col, F(sw), d), [(P[0] - r, P[1] - r), (P[0] + r, P[1] + r)])

    def rect(self, x, y, w, h, fill, col='none', sw=0, rx=0):
        return self.add('<rect x="%s" y="%s" width="%s" height="%s" rx="%s" fill="%s" stroke="%s" stroke-width="%s"/>'
                        % (F(x), F(y), F(w), F(h), F(rx), fill, col, F(sw)), [(x, y), (x + w, y + h)])

    def path(self, d, fill='none', col=INK, sw=3, pts=(), dash=None):
        ds = ' stroke-dasharray="%s"' % dash if dash else ''
        return self.add('<path d="%s" fill="%s" stroke="%s" stroke-width="%s" stroke-linejoin="round"%s/>' % (d, fill, col, F(sw), ds), pts)

    def text(self, x, y, s, fs=22, fill=INK, anchor='middle', bold=False):
        w = fs * sum(.55 if ord(ch) < 0x2000 else .95 for ch in s)
        x0 = x - w / 2 if anchor == 'middle' else (x - w if anchor == 'end' else x)
        return self.add('<text x="%s" y="%s" font-size="%s" fill="%s" text-anchor="%s" dominant-baseline="central"%s>%s</text>'
                        % (F(x), F(y), F(fs), fill, anchor, ' font-weight="700"' if bold else '',
                           s.replace('&', '&amp;').replace('<', '&lt;')),
                        [(x0, y - fs * .6), (x0 + w, y + fs * .6)])

    def put(self, other, dx, dy):
        self.items.append('<g transform="translate(%s,%s)">%s</g>' % (F(dx), F(dy), ''.join(other.items)))
        self.see((other.x0 + dx, other.y0 + dy), (other.x1 + dx, other.y1 + dy))
        return self

    def frame(self, pad=14, col='#C9D4CF'):
        x, y, w, h = self.x0 - pad, self.y0 - pad, self.x1 - self.x0 + 2 * pad, self.y1 - self.y0 + 2 * pad
        self.items.insert(0, '<rect x="%s" y="%s" width="%s" height="%s" rx="12" fill="#fff" stroke="%s" stroke-width="2"/>'
                          % (F(x), F(y), F(w), F(h), col))
        self.see((x, y), (x + w, y + h))
        return self

    def size(self, pad):
        return self.x1 - self.x0 + 2 * pad, self.y1 - self.y0 + 2 * pad

    def svg(self, pad=12):
        w, h = self.size(pad)
        return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="%s %s %s %s" font-family="%s">'
                '<rect x="%s" y="%s" width="%s" height="%s" fill="#fff"/>%s</svg>'
                % (F(self.x0 - pad), F(self.y0 - pad), F(w), F(h), FONT,
                   F(self.x0 - pad), F(self.y0 - pad), F(w), F(h), ''.join(self.items)))


def row(cs, gap=26, valign='middle'):
    out, x = C(), 0
    hmax = max(c.y1 - c.y0 for c in cs)
    for c in cs:
        h = c.y1 - c.y0
        dy = -c.y0 + ((hmax - h) / 2 if valign == 'middle' else (hmax - h if valign == 'bottom' else 0))
        out.put(c, x - c.x0, dy)
        x += c.x1 - c.x0 + gap
    return out


def col(cs, gap=20):
    out, y = C(), 0
    wmax = max(c.x1 - c.x0 for c in cs)
    for c in cs:
        out.put(c, -c.x0 + (wmax - (c.x1 - c.x0)) / 2, y - c.y0)
        y += c.y1 - c.y0 + gap
    return out


# ================================================================ 삼각형 그리기
def unit(v):
    l = math.hypot(*v) or 1
    return (v[0] / l, v[1] / l)


def tri(p, U=50, fill=TFILL, lens=None, angs=None, ticks=False, names=None, rights=True, fs=22, sw=4,
        label=None, arcs=True, stroke=INK, tickcol=RED):
    """삼각형 p(cm, y 위쪽)를 1 cm = U 그림 단위로 그린 캔버스.
    lens: 변마다 글(변 i = 꼭짓점 i→i+1) 또는 True(잰 길이), angs: 꼭짓점마다 글 또는 True(잰 각도, 직각은 표시만)."""
    c = C()
    P = [(x * U, -y * U) for x, y in p]
    I = info(p)
    cen = (sum(q[0] for q in P) / 3, sum(q[1] for q in P) / 3)
    c.poly(P, fill=fill, col=stroke, sw=sw)
    if lens is True:
        lens = [cmtxt(v) for v in I['L']]
    if angs is True:
        angs = [None if abs(a - 90) < .05 else '%s°' % b for a, b in zip(I['A'], degs(p))]
    if ticks:
        for i in I['eqS']:
            A_, B_ = P[i], P[(i + 1) % 3]
            m = ((A_[0] + B_[0]) / 2, (A_[1] + B_[1]) / 2)
            d = unit((B_[0] - A_[0], B_[1] - A_[1]))
            n = (-d[1], d[0])
            c.line((m[0] - n[0] * 11, m[1] - n[1] * 11), (m[0] + n[0] * 11, m[1] + n[1] * 11), tickcol, 3.5)
    for i in range(3):
        V = P[i]
        u = unit((P[(i + 2) % 3][0] - V[0], P[(i + 2) % 3][1] - V[1]))
        w = unit((P[(i + 1) % 3][0] - V[0], P[(i + 1) % 3][1] - V[1]))
        a = I['A'][i]
        if rights and abs(a - 90) < .05:
            s_ = 15
            c.poly([(V[0] + u[0] * s_, V[1] + u[1] * s_), (V[0] + (u[0] + w[0]) * s_, V[1] + (u[1] + w[1]) * s_),
                    (V[0] + w[0] * s_, V[1] + w[1] * s_)], col=TENT, sw=3, closed=False)
        t = angs[i] if angs else None
        if t:
            b = unit((u[0] + w[0], u[1] + w[1]))
            if arcs and not (abs(a - 90) < .05 and rights):
                r = 20
                s0, e0 = (V[0] + u[0] * r, V[1] + u[1] * r), (V[0] + w[0] * r, V[1] + w[1] * r)
                cr = u[0] * w[1] - u[1] * w[0]
                c.path('M%s,%s A%s,%s 0 0 %d %s,%s' % (F(s0[0]), F(s0[1]), r, r, 1 if cr > 0 else 0, F(e0[0]), F(e0[1])),
                       col=TENT, sw=2.5)
            half = rad(a / 2)
            d = min(78, max(36, fs * .95 / max(math.sin(half), .05) * .62 + 8))
            c.text(V[0] + b[0] * d, V[1] + b[1] * d, t, fs * .9, '#B4530F', bold=True)
    if lens:
        for i in range(3):
            if not lens[i]:
                continue
            A_, B_ = P[i], P[(i + 1) % 3]
            m = ((A_[0] + B_[0]) / 2, (A_[1] + B_[1]) / 2)
            d = unit((B_[0] - A_[0], B_[1] - A_[1]))
            n = (-d[1], d[0])
            if (m[0] - cen[0]) * n[0] + (m[1] - cen[1]) * n[1] < 0:
                n = (-n[0], -n[1])
            off = fs * .75 + abs(n[0]) * fs * .9 * len(lens[i]) * .3
            c.text(m[0] + n[0] * off, m[1] + n[1] * off, lens[i], fs * .9, '#1D4E80')
    if names:
        for i in range(3):
            V = P[i]
            d = unit((V[0] - cen[0], V[1] - cen[1]))
            c.text(V[0] + d[0] * 22, V[1] + d[1] * 22, names[i], fs, INK, bold=True)
    if label:
        c.text(c.x0, c.y0 - fs * .9, label, fs * 1.05, RED, anchor='start', bold=True)
    return c


def cards(ps, U=40, per=None, gap=36, vgap=30, each=None, labels=None, **kw):
    """삼각형 여러 개에 가·나·다… 이름표. kw는 모든 삼각형에, each[i](dict)는 그 삼각형에만."""
    cs = []
    if kw.get('angs') or kw.get('lens'):
        k_ = max(U, 52) / U                     # 글자가 겹치지 않게 그림을 키움(글자 크기는 그대로)
        U, gap = U * k_, gap * k_
    for i, p in enumerate(ps):
        o = dict(kw)
        o.update((each or [{}] * len(ps))[i] or {})
        o.setdefault('label', (labels or KO)[i])
        cs.append(tri(p, U, **o))
    per = per or len(cs)
    rows = [row(cs[i:i + per], gap, 'bottom') for i in range(0, len(cs), per)]
    return rows[0] if len(rows) == 1 else col(rows, vgap)


def sq_grid(cols, rows, U=50, dots=False, col_=GRAY):
    c = C()
    if dots:
        for i in range(cols + 1):
            for j in range(rows + 1):
                c.circle((i * U, j * U), 3.2, fill=col_)
    else:
        for i in range(cols + 1):
            c.line((i * U, 0), (i * U, rows * U), '#B9C4CC', 1.6)
        for j in range(rows + 1):
            c.line((0, j * U), (cols * U, j * U), '#B9C4CC', 1.6)
    return c


def tri_grid(n, rows, U=50):
    """삼각 모눈: 한 칸(작은 정삼각형 한 변) = U. 가로 n칸, rows 줄."""
    c = C()
    h = U * math.sqrt(3) / 2
    for j in range(rows + 1):
        c.line((0, j * h), (n * U, j * h), '#B9C4CC', 1.6)
    # 두 방향 빗금: x = k*U + y/√3 (오른쪽으로 기움), 지그재그로 줄마다 반 칸 어긋나게
    H = rows * h
    for k in range(-rows, n + rows + 1):
        for sgn in (1, -1):
            x0, y0, x1, y1 = k * U, 0.0, k * U + sgn * H / math.sqrt(3), H
            # 사각형 [0,n*U]×[0,H] 안으로 자르기
            pts = []
            for t in [i / 400 for i in range(401)]:
                x, y = x0 + (x1 - x0) * t, y0 + (y1 - y0) * t
                if -1e-6 <= x <= n * U + 1e-6:
                    pts.append((x, y))
            if len(pts) > 1:
                c.line(pts[0], pts[-1], '#B9C4CC', 1.6)
    return c


# ================================================================ 그림 넣기·쪽 높이 어림
_cache = {}


def png(c, pad=12, px=1400):
    s = c.svg(pad) if isinstance(c, C) else c
    k = hashlib.md5((s + str(px)).encode()).hexdigest()[:16]
    if k not in _cache:
        p = os.path.join(TMP, k + '.png')
        if not os.path.exists(p):
            svg_to_png(s, p, px)
        _cache[k] = p
    return _cache[k]


class S(Sheet):
    """Sheet + 쪽 높이 어림(넘치면 경고)."""
    BODY = 273.0

    def __init__(self, *a, **k):
        super().__init__(*a, **k)
        self.est, self.warn, self.cur = 0.0, [], ''

    def _lines(self, t, pt_, per_mm=180.0):
        em = pt_ * .3528
        w = sum(.35 if ch == ' ' else (.6 if ord(ch) < 0x2000 else 1.0) for ch in t) * em
        n = max(1, math.ceil(w / per_mm))
        return n * pt_ * .3528 * 1.6

    def _bump(self, mm):
        self.est += mm
        if self.est > self.BODY:
            self.warn.append('%s: 쪽 넘침 어림 %.0fmm' % (self.cur, self.est))
            self.est = mm

    def lesson(self, no, soop, title, question, grade_label=None):
        super().lesson(no, soop, title, question, grade_label)
        self.cur = '%s차시' % no
        self.est = 0
        self._bump(25.4 + 2.3 + max(12.7, self._lines('탐구 질문  ' + question, 15, 170) + 3))

    def scene(self, png_path=None, text=None, width_mm=None):
        super().scene(png_path, text, width_mm)
        for t in ([text] if isinstance(text, str) else (text or [])):
            self._bump(self._lines(t, 13))
        self._bump(5.6)

    def _pic(self, p, w):
        from hwpxgen import _png_size
        pw, ph = _png_size(p)
        self._bump(min(w, 180) * ph / pw + 2)

    def step(self, label, sub=None):
        if not self._after_scene:
            self._bump(2.8)
        super().step(label, sub)
        self._bump(self._lines(label + (sub or '') + '      ', 15))

    def text(self, t):
        super().text(t)
        self._bump(self._lines(t, 13))

    def ask(self, q, blank=True, answer_space=8):
        super().ask(q, blank, answer_space)
        self._bump(self._lines(q + ('   답: (        )' if blank else ''), 14))

    def lines(self, n=2, length=50):
        super().lines(n, length)
        self._bump(n * 7.9)

    def picture(self, png_path, width_mm=120, align='center'):
        super().picture(png_path, width_mm, align)
        self._pic(png_path, width_mm)

    def choices(self, pairs):
        super().choices(pairs)
        for q, a in pairs:
            self._bump(max(12, self._lines(q, 13, 110) + 1.5))

    def labeled(self, pairs, label_mm=None, row_h=3969):
        super().labeled(pairs, label_mm, row_h)
        for k, v in pairs:
            self._bump(max(row_h / 283.465, self._lines(v, 13, 145) + 1.5))

    def wordbox(self, words):
        super().wordbox(words)
        self._bump(12.7)

    def fill(self, sentences):
        super().fill(sentences)
        ss = [sentences] if isinstance(sentences, str) else sentences
        self._bump(max(12.7 * len(ss), sum(self._lines(t, 14, 175) for t in ss) + 2))

    def table(self, rows, header=True, header_col=False, col_mm=None, row_h=None, head_h=2835):
        super().table(rows, header, header_col, col_mm, row_h, head_h)
        for i, r in enumerate(rows):
            h = (head_h if header and i == 0 else (row_h or 3118)) / 283.465
            ln = max(len(str(v).split('\n')) for v in r)
            self._bump(max(h, ln * 8.5 + 1))

    def page_break(self):
        super().page_break()
        self.est = 0


def figk(s, c, k=.16, pad=12, cap=178):
    """k: 그림 1단위가 몇 mm인지(같은 k면 같은 크기)."""
    w, _ = c.size(pad)
    s.picture(png(c, pad), width_mm=min(cap, w * k * .85))


def cm_fig(s, c, U, pad=12):
    """U 그림 단위 = 실제 1 cm 크기로 넣기."""
    w, _ = c.size(pad)
    mmw = w / U * 10
    assert mmw <= 180.5, mmw
    s.picture(png(c, pad, px=1800), width_mm=mmw)


def CH(*o):
    return '( ' + ' / '.join(o) + ' )'


B = '(      )'
LV = {'basic': '기본형', 'chal': '도전형'}
UCM = 60          # 실제 크기 그림: 1 cm = 60 그림 단위


# ================================================================ 이야기 그림·특별 그림
def tag(c, x, y, t, r=17):
    c.circle((x, y), r, fill='#fff', col=RED, sw=2.5)
    c.text(x, y, t, 20, RED, bold=True)


def room_fig():
    """교과서 1차시: 예나가 꾹이를 위해 준비한 물건(앱 T2_ROOM과 같은 그림)."""
    c = C()
    c.rect(0, 0, 900, 460, '#FFF8EE')
    c.rect(0, 380, 900, 80, '#E9D8BE')
    c.poly([(50, 385), (150, 180), (250, 385)], fill='#F6C28B', col='#B4610F', sw=5)
    c.path('M120,385 Q150,320 180,385 Z', fill='#7A4A1E', col='none', sw=0)
    c.path('M300,40 Q465,75 630,40', col='#8A6A3A', sw=3)
    for x, cl in [(320, '#F28B82'), (380, '#FBD25B'), (440, '#8ECAE6'), (500, '#A7D7A0'), (560, '#F28B82')]:
        y = 40 + 35 * (1 - ((x + 25 - 465) / 165) ** 2) * .9
        c.poly([(x, y), (x + 50, y), (x + 25, y + 70)], fill=cl, col='#6B5B3E', sw=2)
    c.rect(685, 35, 180, 130, '#DDEFFC', '#8A6A3A', 6)
    c.poly([(700, 120), (775, 60), (850, 120), (775, 105)], fill='#E47A38', col='#7A3B08', sw=2)
    c.line((775, 105), (775, 140), INK, 2)
    c.poly([(305, 385), (360, 295), (415, 385)], fill='#fff', col='#5A5A5A', sw=4)
    c.rect(335, 345, 50, 40, '#2F3E2F')
    c.circle((530, 250), 55, fill='#fff', col='#4A5A66', sw=6)
    c.line((530, 250), (530, 210), INK, 4)
    c.line((530, 250), (560, 250), INK, 4)
    c.circle((690, 345), 40, fill='#C9B6E8', col='#7C64A8', sw=4)
    c.path('M655,330 Q690,360 725,330 M660,360 Q690,330 722,362', col='#7C64A8', sw=2)
    c.rect(765, 320, 120, 62, '#9CCB9A', '#4F8A43', 4, rx=6)
    for t, x, y in [('가', 150, 150), ('나', 280, 40), ('다', 660, 40), ('라', 360, 265), ('마', 530, 172), ('바', 690, 282), ('사', 825, 296)]:
        tag(c, x, y, t)
    return c


ROOM_ITEMS = ['꾹이의 삼각형 집', '삼각형 장식품(가랜드)', '행글라이더 사진', '삼각김밥', '둥근 시계', '털실 공', '네모 방석']
ROOM_OK = [0, 1, 2, 3]


def camp_fig():
    """이야기 1차시: 캠프 준비물(앱 T2S_CAMP와 같은 그림)."""
    c = C()
    c.rect(0, 0, 900, 460, '#EEF7FC')
    c.rect(0, 385, 900, 75, '#CFE6C0')
    c.poly([(50, 385), (170, 160), (290, 385)], fill='#8ECAE6', col='#2B6FB8', sw=5)
    c.poly([(140, 385), (170, 300), (200, 385)], fill='#2B6FB8', col='none', sw=0)
    c.path('M320,40 Q470,75 620,40', col='#8A6A3A', sw=3)
    for x, cl in [(335, '#F28B82'), (395, '#FBD25B'), (455, '#8ECAE6'), (515, '#A7D7A0'), (570, '#F28B82')]:
        y = 40 + 35 * (1 - ((x + 22 - 470) / 150) ** 2) * .9
        c.poly([(x, y), (x + 44, y), (x + 22, y + 62)], fill=cl, col='#6B5B3E', sw=2)
    c.circle((760, 80), 45, fill='#FFD95A', col='#E0A800', sw=4)
    c.rect(345, 260, 70, 120, '#FFF1C9', '#B4610F', 4, rx=30)
    c.path('M355,262 Q380,225 405,262', col='#B4610F', sw=4)
    c.rect(455, 305, 150, 78, '#9CCB9A', '#4F8A43', 4, rx=6)
    c.rect(500, 296, 60, 12, '#4F8A43', rx=4)
    c.rect(705, 255, 10, 130, '#8795A1')
    c.poly([(650, 262), (710, 175), (770, 262)], fill='#FBD25B', col='#B4610F', sw=5)
    c.text(710, 235, '!', 34, '#7A3B08', bold=True)
    c.poly([(805, 383), (845, 305), (885, 383)], fill='#fff', col='#5A5A5A', sw=4)
    c.rect(828, 350, 34, 33, '#2F3E2F')
    for t, x, y in [('가', 170, 130), ('나', 300, 30), ('다', 690, 40), ('라', 380, 210), ('마', 530, 275), ('바', 640, 175), ('사', 845, 283)]:
        tag(c, x, y, t)
    return c


CAMP_ITEMS = ['A형 텐트', '깃발 가랜드', '둥근 해', '둥근 랜턴', '네모 아이스박스', '‘텐트 줄 조심’ 표지판', '삼각김밥']
CAMP_OK = [0, 1, 5, 6]


def truss_fig():
    c = C()
    A, Bp, Cp = (260, 30), (40, 270), (480, 270)
    c.poly([A, Bp, Cp], fill='#D6ECFA', col=INK, sw=5)
    for q in [(170, 270), (330, 270)]:
        c.line(A, q, '#8A6A3A', 5)
    return c


def truss_count():
    """밑변 위 점 4개(양 끝 + 지지대 2곳) 중 두 점을 고르면 삼각형 하나: 4C2 = 6"""
    return math.comb(4, 2)


def scene_tris(tris, k, deco=None, letters=True, fs=20):
    """cm 좌표(바닥 왼쪽 0,0)의 그림 속 삼각형들. 1 cm = k 그림 단위."""
    c = C()
    X = lambda v: (v[0] * k, -v[1] * k)
    if deco:
        deco(c, X)
    for i, (p, fl) in enumerate(tris):
        c.poly([X(v) for v in p], fill=fl, col=INK, sw=3)
    if letters:
        for i, (p, fl) in enumerate(tris):
            P = [X(v) for v in p]
            cx, cy = sum(q[0] for q in P) / 3, sum(q[1] for q in P) / 3
            big = info(p)['L'][0] > 2.5
            if big:
                c.text(cx, cy, KO[i], fs, RED, bold=True)
            else:
                # 작은 삼각형은 옆에 이름표
                c.text(cx, cy - 0.95 * k if cy > -6 * k else cy + 0.95 * k, KO[i], fs * .9, RED, bold=True)
    return c


SAIL = [
    (T([(10.8, 12.3), (10.8, 3.3), (10.8 - 9 * math.sin(rad(40)), 12.3 - 9 * math.cos(rad(40)))], '이등변'), '#FDF6E3'),
    (T([(11.2, 11.5), (11.2, 4.5), (11.2 + 7 * math.sin(rad(60)), 8)], '정'), '#FDF6E3'),
    (T([(11, 13), (11, 14.4), (12.6, 13.4)], '부등변'), '#FFD6D6'),
    (T([(6, 2.4), (7.2, 2.4), (6.6, 0.7)], '이등변'), '#FFF1C9'),
    (T([(9, 2.4), (10.4, 2.4), (9.7, 2.4 - 1.4 * math.sin(rad(60)))], '정'), '#FFF1C9'),
    (T([(13.2, 2.4), (14.6, 2.4), (13.5, 0.9)], '부등변'), '#FFF1C9')]


def sail_fig(k=40):
    def deco(c, X):
        c.rect(-0.5 * k, -15.2 * k, 20.5 * k, 15.7 * k, '#EAF5FC')
        c.rect(-0.5 * k, -0.9 * k, 20.5 * k, 1.4 * k, '#A9D3EE')
        c.poly([X(v) for v in [(3, 2.6), (19, 2.6), (17, 0.4), (5, 0.4)]], fill='#B07A4B', col='#6E4A2A', sw=4)
        c.line(X((11, 2.6)), X((11, 14.4)), '#6E4A2A', 7)
    return scene_tris(SAIL, k, deco)


CAMPTRI = [
    (T([(2, 1), (12, 1), (7, 9)], '이등변'), '#D6ECFA'),
    (T([(5.5, 1), (8.5, 1), (7, 1 + 1.5 * math.sqrt(3))], '정'), '#FFE3C2'),
    (T([(14.4, 12), (16, 12), (15.2, 12 - .8 * math.sqrt(3))], '정'), '#FFD6D6'),
    (T([(16.6, 12), (18, 12), (17.3, 9.8)], '이등변'), '#FFF1C9'),
    (T([(18.6, 12), (20, 12), (19, 10.3)], '부등변'), '#DDF2D8'),
    (T([(14, 1), (20, 1), (16, 5)], '부등변'), '#EADCF5')]


def camp_tri_fig(k=40):
    def deco(c, X):
        c.rect(0.8 * k, -13.4 * k, 20.6 * k, 13.4 * k, '#EEF7FC')
        c.rect(0.8 * k, -1 * k, 20.6 * k, 1 * k, '#CFE6C0')
        c.line(X((13.6, 1)), X((13.6, 12.6)), '#8A6A3A', 6)
        c.line(X((20.8, 1)), X((20.8, 12.6)), '#8A6A3A', 6)
        c.line(X((13.6, 12)), X((20.8, 12)), '#6B5B3E', 2.5)
    c = C()
    X = lambda v: (v[0] * k, -v[1] * k)
    deco(c, X)
    for p, fl in CAMPTRI:
        c.poly([X(v) for v in p], fill=fl, col=INK, sw=3)
    pos = [(7, 6.2), (7, 2.1), (15.2, 10.4), (17.3, 9.0), (19.3, 9.5), (16.7, 2.5)]
    for i, (x, y) in enumerate(pos):
        c.text(x * k, -y * k, KO[i], 22, RED, bold=True)
    return c


def cut_fig():
    """색종이를 반으로 접고(왼쪽이 접힌 선) 비스듬히 자르기 → 펼치면 이등변삼각형."""
    c = C()
    c.rect(0, 0, 160, 220, '#FFE3C2', INK, 3)
    c.line((0, 0), (0, 220), BLUE, 5)
    c.text(-10, -22, '접힌 선', 18, BLUE, anchor='start')
    c.line((0, 30), (130, 220), RED, 4, dash='10 8')
    c.text(90, 110, '✂', 30, RED)
    c.text(80, 250, '① 접어서 자르기', 20, INK)
    c.text(230, 120, '→', 40, INK, bold=True)
    d = C()
    d.poly([(0, 220), (130, 30 + 0), (260, 220)], fill='#FFE3C2', col=INK, sw=4)
    d.poly([(0, 220), (130, 30), (260, 220)], fill='none', col=INK, sw=4)
    d.line((130, 30), (130, 220), BLUE, 3, dash='8 6')
    d.text(130, 250, '② 펼치기', 20, INK)
    c.put(d, 300, 0)
    return c


def fold_fig(p, names, folds, U=UCM):
    """삼각형에 접는 선(꼭짓점 → 마주 보는 변의 가운데)을 점선으로."""
    c = tri(p, U, names=names, fill='#FFE3C2')
    P = [(x * U, -y * U) for x, y in p]
    for v in folds:
        a, b = P[(v + 1) % 3], P[(v + 2) % 3]
        c.line(P[v], ((a[0] + b[0]) / 2, (a[1] + b[1]) / 2), BLUE, 3, dash='9 7')
    return c


def line_fig():
    """교과서 4차시 도전: 정삼각형 ㄱㄴㄷ과 ㅁㄷㄹ, ㄴ·ㄷ·ㄹ은 한 직선 위."""
    k, r3 = 60, math.sqrt(3)
    X = lambda v: (v[0] * k, -v[1] * k)
    N, D, R, G, M = (0, 0), (4, 0), (7, 0), (2, 2 * r3), (5.5, 1.5 * r3)
    assert abs(math.dist(N, G) - 4) < 1e-9 and abs(math.dist(D, M) - 3) < 1e-9 and abs(math.dist(R, M) - 3) < 1e-9
    c = C()
    c.line(X((-0.6, 0)), X((7.6, 0)), INK, 2)
    for t in [(N, D, G), (D, R, M)]:
        c.poly([X(v) for v in t], fill=TFILL, col=INK, sw=4)
    # 각 ㄱㄷㅁ: ㄷ에서 ㅁ 방향(60°) ~ ㄱ 방향(120°)
    Dp = X(D)
    pts = [(Dp[0] + 36 * math.cos(rad(a)), Dp[1] - 36 * math.sin(rad(a))) for a in range(60, 121, 6)]
    c.poly([Dp] + pts, fill='rgba(228,122,56,.4)', col='none', sw=0)
    c.text(*X((4, 1.05)), '?', 24, '#B4530F', bold=True)
    for p, n, o in [(N, 'ㄴ', (-.3, -.35)), (D, 'ㄷ', (0, -.4)), (R, 'ㄹ', (.3, -.35)), (G, 'ㄱ', (0, .35)), (M, 'ㅁ', (0, .35))]:
        c.text(*X((p[0] + o[0], p[1] + o[1])), n, 24, bold=True)
    return c


def rhombus_fig():
    """이야기 5차시 도전: 한 변 5 cm 정삼각형 2장을 한 변끼리 붙임."""
    k, r3 = 50, math.sqrt(3)
    X = lambda v: (v[0] * k, -v[1] * k)
    A, Bv, Cv, D = (0, 0), (5, 0), (2.5, 2.5 * r3), (7.5, 2.5 * r3)
    T([A, Bv, Cv], '정')
    T([Bv, D, Cv], '정')
    c = C()
    c.poly([X(v) for v in (A, Bv, Cv)], fill='#FFD6D6', col=INK, sw=4)
    c.poly([X(v) for v in (Bv, D, Cv)], fill='#FFF1C9', col=INK, sw=4)
    c.text(*X((2.5, -.45)), '5 cm', 20, '#1D4E80')
    return c


DOTS_A, DOTS_B, DOTS_C = (1, 4), (5, 4), [(0, 1), (3, 1), (5, 1), (7, 2)]
DOT_KIND = [info([(q[0], -q[1]) for q in (DOTS_A, DOTS_B, cc)])['ang'] for cc in DOTS_C]
assert DOT_KIND == ['둔각', '예각', '직각', '둔각'], DOT_KIND


def dots_fig(U=UCM):
    c = sq_grid(7, 5, U, dots=True)
    X = lambda q: (q[0] * U, q[1] * U)
    c.line(X(DOTS_A), X(DOTS_B), INK, 5)
    c.text(X(DOTS_A)[0], X(DOTS_A)[1] + 26, 'ㄱ', 22, bold=True)
    c.text(X(DOTS_B)[0], X(DOTS_B)[1] + 26, 'ㄴ', 22, bold=True)
    for i, q in enumerate(DOTS_C):
        c.circle(X(q), 8, fill=TENT)
        c.text(X(q)[0] + 22, X(q)[1] - 18, CIR[i], 22, '#B4530F', bold=True)
    return c


def rigid_fig():
    """사각형 틀과 삼각형 틀을 옆에서 밀기 전·민 뒤."""
    def frame(pts, dash=None, colr='#8A6A3A'):
        k = C()
        k.poly(pts, fill='none', col=colr, sw=7, dash=dash)
        for q in pts:
            k.circle(q, 8, fill=INK)
        return k
    sq0 = frame([(0, 160), (160, 160), (160, 0), (0, 0)])
    sq1 = frame([(0, 160), (160, 160), (230, 25), (70, 25)])
    tr0 = frame([(0, 160), (160, 160), (80, 0)])
    tr1 = frame([(0, 160), (160, 160), (80, 0)])
    def lab(k, t):
        k.text((k.x0 + k.x1) / 2, k.y1 + 30, t, 20)
        return k
    a = row([lab(sq0, '사각형 틀'), C().text(0, 0, '밀면 →', 22, TENT, bold=True), lab(sq1, '찌그러져요')], 24)
    b = row([lab(tr0, '삼각형 틀'), C().text(0, 0, '밀면 →', 22, TENT, bold=True), lab(tr1, '그대로예요')], 24)
    return row([a, b], 70)


def path_fig(n):
    """보물 상자 길 찾기 판(옳으면 →, 옳지 않으면 ↓). 상자 번호 = 옳지 않은 설명 수 + 1"""
    c, cell = C(), 64
    for r in range(n + 1):
        for k in range(n - r + 1):
            x, y = 80 + k * cell, 70 + r * cell
            if k < n - r:
                c.line((x, y), (x + cell, y), '#E3D8C3', 8)
            if r < n - k:
                c.line((x, y), (x, y + cell), '#E3D8C3', 8)
    for r in range(n + 1):
        k = n - r
        x, y = 80 + k * cell, 70 + r * cell
        c.rect(x - 20, y - 15, 40, 30, '#D9C7A2', '#8A6A3A', 2, rx=6)
        c.text(x, y + 30, '%d' % (r + 1), 17, '#8A6A3A', bold=True)
    c.circle((80, 70), 10, fill=TENT)
    c.text(80, 40, '출발', 20, bold=True)
    c.text(80 + n * cell - 20, 30, '옳으면 →', 18, BLUE, anchor='end')
    c.text(40, 70 + n * cell + 50, '옳지 않으면 ↓', 18, RED, anchor='start')
    return c


def euclid_fig(U=UCM, L=5):
    """선분 ㄱㄴ(실제 5 cm)과 원을 그릴 빈자리."""
    c = C()
    c.rect(-5.3 * U, -5.5 * U, (L + 10.6) * U, 6.3 * U, 'none', '#DDE3E0', 1.5)
    c.line((0, 0), (L * U, 0), INK, 5)
    for x, t in [(0, 'ㄱ'), (L * U, 'ㄴ')]:
        c.circle((x, 0), 7, fill=INK)
        c.text(x, 30, t, 22, bold=True)
    c.text(L * U / 2, 26, '%d cm' % L, 18, '#1D4E80')
    return c


def grid_pair(U=UCM, dots=False, cols=8, rows=5, gap=1.0, tri=False):
    """그려 보기 칸 두 개(왼쪽·오른쪽) 1 cm 모눈."""
    a = sq_grid(cols, rows, U, dots=dots)
    if tri:
        b = tri_grid(cols, rows, U)
    else:
        b = sq_grid(cols, rows, U, dots=dots)
    return row([a, b], gap * U, 'top')


def dice_faces(p):
    """주사위 놀이(1 이등변 2 정 3 세 변이 모두 다름 4 예각 5 직각 6 둔각)에서 낼 수 있는 눈."""
    I = info(p)
    f = []
    if I['side'] in ('이등변', '정'):
        f.append(1)
    if I['side'] == '정':
        f.append(2)
    if I['side'] == '부등변':
        f.append(3)
    f.append({'예각': 4, '직각': 5, '둔각': 6}[I['ang']])
    return f


def relay(p):
    """이어달리기: 왼쪽(각) 바구니, 오른쪽(변) 바구니"""
    I = info(p)
    return ANG[I['ang']], {'정': '정삼각형', '이등변': '이등변삼각형', '부등변': '세 변의 길이가 모두 다른 삼각형'}[I['side']]


def relay_ans(ps):
    return ', '.join('%s %s·%s' % (KO[i], relay(p)[0].replace('삼각형', ''), relay(p)[1].replace('세 변의 길이가 모두 다른 삼각형', '세 변이 모두 다름'))
                     for i, p in enumerate(ps))


def two_fig(pa, pb, oa, ob, U=40):
    """앱 t2Two: 두 삼각형 나란히(같은 축척이 아니어도 각자 비율은 정확)."""
    return row([tri(pa, U, **oa), tri(pb, U, **ob)], 80)


def real(s, ps, per=None, gap=1.0, **kw):
    """실제 크기(1 cm = 1 cm) 삼각형 카드."""
    cm_fig(s, cards(ps, UCM, per=per, gap=gap * UCM, vgap=.6 * UCM, fs=24, **kw), UCM)


def sides_ans(ps):
    out = []
    for i, p in enumerate(ps):
        I = info(p)
        out.append('%s %s(같은 변 %d개)' % (KO[i], '·'.join(cmtxt(v) for v in I['L']), len(I['eqS'])))
    return ', '.join(out)


def side_groups(ps):
    return '세 변이 모두 다름 %s / 두 변만 같음 %s / 세 변이 같음 %s' % (
        nm_list(ps, lambda I: I['side'] == '부등변'), nm_list(ps, lambda I: I['side'] == '이등변'), nm_list(ps, lambda I: I['side'] == '정'))


def ang_groups(ps):
    return '예각삼각형 %s / 직각삼각형 %s / 둔각삼각형 %s' % (
        nm_list(ps, lambda I: I['ang'] == '예각'), nm_list(ps, lambda I: I['ang'] == '직각'), nm_list(ps, lambda I: I['ang'] == '둔각'))


def two_table(ps):
    """두 기준 표의 정답 글"""
    cell = lambda sd, an: nm_list(ps, lambda I: (I['side'] != '부등변') == sd and I['ang'] == an)
    return '이등변삼각형: 예각 %s, 직각 %s, 둔각 %s / 세 변의 길이가 모두 다른 삼각형: 예각 %s, 직각 %s, 둔각 %s' % (
        cell(True, '예각'), cell(True, '직각'), cell(True, '둔각'), cell(False, '예각'), cell(False, '직각'), cell(False, '둔각'))


def tag3(p):
    """세 각을 예·직·둔으로(꼭짓점 차례)"""
    return '·'.join('직' if abs(a - 90) < .05 else ('둔' if a > 90 else '예') for a in info(p)['A'])


TWO_TABLE = [['', '예각삼각형', '직각삼각형', '둔각삼각형'], ['이등변삼각형', '', '', ''], ['세 변의 길이가\n모두 다른 삼각형', '', '', '']]
REL_HEAD = ['카드', '왼쪽 바구니(각의 크기)', '오른쪽 바구니(변의 길이)']


# ================================================================ 교과서 차시 버전
T2_ROOF = [T(SSS(3, 3, 3, 180), '정'), T(SSS(2, 4, 4, 0), '이등변'), T(SSS(4, 3, 2, 8), '부등변'), T(SSS(2, 2, 2, 25), '정'), T(SSS(5, 3, 3, 90), '이등변')]
T2_ISO3 = [T(Iso(4, 40, 15), '이등변', '예각'), T(Iso(3, 120, -100), '이등변', '둔각'), T(Iso(3.5, 90, 200), '이등변', '직각')]
T2_TWOANG = [T(Iso(3, 80, 20), '이등변', '예각'), T(Iso(3, 130, -10), '이등변', '둔각')]
T2_ACU = [T(SAS(4, 90, 3, 0), '부등변', '직각'), T(ASA(70, 60, 4, 10), '부등변', '예각'), T(ASA(45, 32, 5, 0), '부등변', '둔각'), T(ASA(65, 60, 4, 200), '부등변', '예각'), T(ASA(50, 28, 5, 195), '부등변', '둔각')]
T2_HOME = [T(SSS(3, 3, 3, 0), '정', '예각'), T(Iso(3, 40, 0), '이등변', '예각'), T(Iso(3, 50, 30), '이등변', '예각'), T(Iso(2.5, 90, 45), '이등변', '직각'), T(Iso(2.5, 120, 0), '이등변', '둔각')]
T2_SEVEN = [T(Iso(5, 50, 10), '이등변', '예각'), T(ASA(25, 40, 5, -5), '부등변', '둔각'), T(Iso(3, 120, 180), '이등변', '둔각'), T(ASA(75, 60, 4, 20), '부등변', '예각'),
            T(Iso(3, 90, 30), '이등변', '직각'), T(SSS(4, 3, 5, -15), '부등변', '직각'), T(Iso(3.5, 100, 70), '이등변', '둔각')]
T2_STR = [T(Iso(2.5, 90, 0), '이등변', '직각'), T(Iso(4, 140, 0), '이등변', '둔각'), T(ASA(45, 25, 5, 0), '부등변', '둔각'), T(SSS(4, 4, 4, 180), '정', '예각'), T(Iso(5, 40, 0), '이등변', '예각'), T(SAS(3, 90, math.sqrt(3) * 3, 0), '부등변', '직각')]
T2_STR_N = ['가 · 송전탑', '나 · 광명역', '다 · 남지철교', '라 · 관람차', '마 · 미술관', '바 · 정글돔']
T2_RELAY = [T(SSS(3, 3, 3, 0), '정', '예각'), T(Iso(3, 120, 0), '이등변', '둔각'), T(SSS(4, 3, 5, 0), '부등변', '직각'), T(ASA(70, 50, 4, 0), '부등변', '예각')]
T2_RELAY8 = [T(Iso(3, 90, 0), '이등변', '직각'), T(ASA(30, 40, 5, 0), '부등변', '둔각'), T(SSS(3.5, 3.5, 3.5, 30), '정', '예각'), T(Iso(4, 50, 0), '이등변', '예각'),
             T(SAS(4, 90, 2.5, 0), '부등변', '직각'), T(Iso(3, 140, 0), '이등변', '둔각'), T(ASA(55, 75, 4, 0), '부등변', '예각'), T(Iso(3.5, 100, 180), '이등변', '둔각')]
T2_DICE = [T(SSS(3, 3, 3, 0), '정', '예각'), T(Iso(3, 90, 0), '이등변', '직각'), T(ASA(25, 45, 5, 0), '부등변', '둔각'), T(Iso(3, 120, 0), '이등변', '둔각'), T(ASA(60, 70, 4, 0), '부등변', '예각'), T(SAS(4, 90, 3, 0), '부등변', '직각')]
T2_R1 = [T(SSS(3, 3, 3, 180), '정'), T(SSS(3, 4, 4, 0), '이등변'), T(SSS(4, 3, 2.5, 5), '부등변'), T(SSS(2.5, 2.5, 2.5, 20), '정'), T(SSS(4, 3, 3, 90), '이등변')]
T2_R3 = [T(ASA(30, 35, 5, 0), '부등변', '둔각'), T(SAS(3, 90, 4, 20), '부등변', '직각'), T(ASA(60, 70, 4, 0), '부등변', '예각')]
T2_R5 = [T(Iso(3, 120, 0), '이등변', '둔각'), T(Iso(3, 90, 0), '이등변', '직각'), T(SSS(3, 3, 3, 0), '정', '예각'), T(ASA(20, 50, 5, 0), '부등변', '둔각')]
DIE_TXT = '주사위 눈: 1 이등변삼각형 · 2 정삼각형 · 3 세 변의 길이가 모두 다른 삼각형 · 4 예각삼각형 · 5 직각삼각형 · 6 둔각삼각형'


def third(a, b):
    return 180 - a - b


def tb1(s, ch):
    s.lesson(1, '개념 찾기(S)', '단원 도입 ― 꾹이를 위해 삼각형을 준비해요', '우리 주변에서 볼 수 있는 삼각형은 어떤 모양일까요? 서로 무엇이 같고 무엇이 다를까요?')
    s.scene(png(room_fig()), '예나는 아파 보이는 길고양이 꾹이를 구조해 함께 지내게 되었어요. 꾹이는 삼각형을 아주 좋아해요. 예나가 꾹이를 위해 물건을 준비했어요.', width_mm=84)
    s.step('① 찾아 보기', '삼각형을 찾을 수 있는 물건')
    s.text(' · '.join('%s %s' % (KO[i], n) for i, n in enumerate(ROOM_ITEMS)))
    s.ask('위 그림에서 삼각형을 찾을 수 있는 물건을 모두 찾아 기호를 써 보세요.')
    if not ch:
        s.text('도움: 곧은 선 3개로 둘러싸인 모양을 찾아요. 둥근 것과 네모난 것은 삼각형이 아니에요.')
    s.step('② 떠올리기', '3학년 때 배운 직각삼각형')
    figk(s, cards([ASA(70, 50, 4), SAS(4, 90, 2.5, 160), ASA(30, 35, 5)], U=50), .13)
    assert [info(p)['ang'] for p in [ASA(70, 50, 4), SAS(4, 90, 2.5, 160), ASA(30, 35, 5)]] == ['예각', '직각', '둔각']
    if ch:
        s.ask('직각삼각형을 찾아 기호를 써 보세요.')
        s.ask('삼각형의 변, 꼭짓점, 각은 각각 몇 개인가요?   변 (    )개, 꼭짓점 (    )개, 각 (    )개', blank=False)
    else:
        s.choices([('직각삼각형은? (ㄴ 모양 표시를 찾아요)', CH('가', '나', '다')), ('삼각형의 변, 꼭짓점, 각은 각각 몇 개?', CH('3개', '4개'))])
        s.text('삼각형에는 굽은 선이 (있어요 / 없어요).')
    s.page_break()
    s.step('③ 계산하기', '삼각형의 세 각의 크기의 합')
    figk(s, two_fig(ASA(50, 70, 4), ASA(25, 40, 5), dict(angs=['50°', '70°', '□°']), dict(angs=['25°', '40°', '□°']), U=45), .13)
    if not ch:
        s.text('도움: 삼각형의 세 각의 크기의 합은 180°예요. 180에서 알고 있는 두 각을 빼요.')
    s.ask('왼쪽 □ = (      )°      오른쪽 □ = (      )°', blank=False)
    s.step('④ 약속 떠올리기')
    if not ch:
        s.wordbox(['직각삼각형', '예각', '둔각', '180°'])
    s.fill(['한 각이 직각인 삼각형을 %s이라고 해요.' % B,
            '각도가 0°보다 크고 직각보다 작은 각을 %s, 직각보다 크고 180°보다 작은 각을 %s이라고 해요.' % (B, B),
            '삼각형의 세 각의 크기의 합은 %s예요.' % B])
    s.step('⑤ 확인하기', '주변의 삼각형')
    s.ask('우리 주변에서 삼각형을 본 곳을 써 보세요.', blank=False)
    if not ch:
        s.text('예) 건물 지붕, 횡단보도 앞 노란색 삼각형(옐로 카펫), 삼각자')
    s.lines(1)
    s.ask('여러 삼각형의 같은 점과 다른 점을 써 보세요.', blank=False)
    if not ch:
        s.text('‘같은 점: 변이 ~개예요. 다른 점: 길이가 같은 변이 ~.’ 꼴로 써요.')
    s.lines(2)
    ans = '1차시  ① %s   ② 나 / 변 3개, 꼭짓점 3개, 각 3개, 굽은 선 없어요   ③ %d°, %d°   ④ 직각삼각형, 예각, 둔각, 180°   ⑤ (예) 건물 지붕, 삼각자 / 같은 점: 변이 3개예요. 다른 점: 길이가 같은 변이 있는 삼각형도 있고 없는 삼각형도 있어요.' % (
        ', '.join(KO[i] for i in ROOM_OK), third(50, 70), third(25, 40))
    if ch:
        s.step('⑥ 도전하기', '예각·직각·둔각 구별하기')
        s.text('35°      90°      89°      120°      100°')
        s.ask('예각을 모두 써 보세요.')
        s.ask('둔각을 모두 써 보세요.')
        ans += '   ⑥ 예각 35°, 89° / 둔각 120°, 100° (90°는 직각)'
    return ans


def tb2(s, ch):
    s.lesson(2, '개념 구축하기(O)', '이등변삼각형과 정삼각형을 알아볼까요', '삼각형을 변의 길이에 따라 어떻게 나눌 수 있을까요?')
    s.scene(None, '예나가 꾹이를 처음 만난 곳의 지붕과 표지판에서 찾은 삼각형 가~마예요. (실제 크기로 그렸어요.)')
    s.step('① 재어 보기', '자로 세 변의 길이를 재기')
    real(s, T2_ROOF[:3], gap=.8)
    real(s, T2_ROOF[3:], gap=1.5, labels=KO[3:])
    s.table([['삼각형', '가', '나', '다', '라', '마'], ['세 변의 길이(cm)', '', '', '', '', ''], ['길이가 같은 변의 수', '(  )개', '(  )개', '(  )개', '(  )개', '(  )개']],
            row_h=3600)
    if not ch:
        s.text('도움: 길이가 같은 변을 초록색으로 따라 그려 보세요. 같은 변이 없으면 0개예요.')
    s.page_break()
    s.step('② 나누어 보기', '변의 길이에 따라')
    s.table([['세 변의 길이가 모두 다른 삼각형', '두 변의 길이만 같은 삼각형', '세 변의 길이가 같은 삼각형'], ['', '', '']], row_h=2600)
    s.step('③ 약속하기', '변의 길이에 따른 이름')
    if not ch:
        s.wordbox(['이등변삼각형', '정삼각형'])
    s.fill(['두 변의 길이가 같은 삼각형을 %s이라고 해요.' % B, '세 변의 길이가 같은 삼각형을 %s이라고 해요.' % B])
    s.step('④ 그려 보기', '왼쪽 모눈종이에 이등변삼각형, 오른쪽 삼각 모눈종이에 정삼각형')
    figk(s, grid_pair(tri=True, cols=8, rows=5), .17)
    if not ch:
        s.text('도움: 이등변삼각형은 한 꼭짓점에서 두 변이 똑같은 칸 수만큼 가게 해요(예: 오른쪽으로 2칸 위로 4칸, 왼쪽으로 2칸 위로 4칸).')
    s.page_break()
    s.step('⑤ 확인하기', '돛단배 그림에서 찾기')
    figk(s, sail_fig(), .155)
    s.text('이등변삼각형을 찾아 세 변을 빨간색으로 그리고, 정삼각형을 찾아 초록색으로 칠해 보세요. 자로 재어 비교해요.')
    iso = [i for i, (p, _) in enumerate(SAIL) if info(p)['side'] != '부등변']
    eq = [i for i, (p, _) in enumerate(SAIL) if info(p)['side'] == '정']
    if ch:
        s.ask('이등변삼각형의 기호를 모두 써 보세요.')
        s.ask('정삼각형의 기호를 모두 써 보세요. 정삼각형에도 빨간 테두리를 그려야 하는 까닭도 써 보세요.', blank=False)
        s.lines(1)
    else:
        s.text('도움: 배에 그려진 작은 삼각형(라, 마, 바)과 깃발(다)도 살펴봐요. 정삼각형도 두 변의 길이가 같아요.')
        s.ask('이등변삼각형의 기호를 모두 써 보세요.')
        s.ask('정삼각형의 기호를 모두 써 보세요.')
    ans = '2차시  ① %s   ② %s   ③ 이등변삼각형, 정삼각형   ④ (그리기) 두 변의 칸 수가 같은 삼각형 / 세 변이 모두 같은 칸 수인 삼각형   ⑤ 이등변삼각형 %s, 정삼각형 %s' % (
        sides_ans(T2_ROOF), side_groups(T2_ROOF), ', '.join(KO[i] for i in iso), ', '.join(KO[i] for i in eq))
    if ch:
        ans += ' (정삼각형도 두 변의 길이가 같기 때문)'
        s.step('⑥ 도전하기', '익힘 문제')
        s.ask('세 변의 길이가 다음과 같은 삼각형 중 이등변삼각형이 아닌 것은?  ㉠ 6 cm, 7 cm, 6 cm  ㉡ 3 cm, 5 cm, 4 cm  ㉢ 8 cm, 8 cm, 8 cm')
        figk(s, two_fig(SSS(4, 7, 7, 0), SSS(5, 5, 5), dict(lens=['4 cm', '7 cm', '□ cm'], ticks=True), dict(lens=['5 cm', '□ cm', None]), U=30), .17)
        s.text('왼쪽은 이등변삼각형, 오른쪽은 정삼각형이에요. (같은 표시를 한 변은 길이가 같아요.)')
        s.ask('왼쪽 □ = (     ) cm    오른쪽 □ = (     ) cm    한 변이 9 cm인 정삼각형의 세 변의 길이의 합 = (     ) cm', blank=False)
        ans += '   ⑥ ㉡ / 7 cm, 5 cm, %d cm (9 × 3)' % (9 * 3)
    return ans


def tb3(s, ch):
    s.lesson(3, '개념 구축하기(O)', '이등변삼각형의 성질을 알아볼까요', '이등변삼각형의 각의 크기에는 어떤 성질이 있을까요?')
    s.scene(None, '꾹이를 환영하려고 이등변삼각형 모양 장식품을 만들어요.')
    s.step('① 만져 보기', '색종이를 반으로 접어 비스듬히 잘라 펼치기')
    figk(s, cut_fig(), .16)
    if ch:
        s.fill(['겹쳐진 부분에 있는 두 변의 길이는 %s. 겹쳐진 부분에 있는 두 각의 크기는 %s.' % (B, B)])
    else:
        s.fill(['겹쳐진 부분에 있는 두 변의 길이가 %s. 겹쳐진 부분에 있는 두 각의 크기도 %s.' % (CH('같아요', '달라요'), CH('같아요', '달라요'))])
    s.step('② 재어 보기', '이등변삼각형 가~다의 세 변과 세 각 재기(실제 크기)')
    real(s, T2_ISO3, gap=.6)
    s.table([['삼각형', '가', '나', '다'], ['길이가 같은 두 변', '(    ) cm', '(    ) cm', '(    ) cm'], ['크기가 같은 두 각', '(    )°', '(    )°', '(    )°']])
    if not ch:
        s.text('도움: 길이가 같은 두 변은 초록색, 크기가 같은 두 각은 빨간색으로 표시해 보세요.')
    s.page_break()
    s.step('③ 접어 보기', '꼭짓점 ㄴ을 꼭짓점 ㄷ에 겹쳐 반으로 접기')
    fp = Iso(5, 50, 0)
    cm_fig(s, fold_fig(fp, ['ㄴ', 'ㄷ', 'ㄱ'], [2]), UCM)
    if ch:
        s.fill(['꼭짓점 ㄴ과 ㄷ을 겹치면 각 %s과 각 %s이 꼭 포개어져요. 그래서 두 각의 크기가 %s.' % (B, B, B)])
    else:
        s.fill(['꼭짓점 ㄴ과 ㄷ을 겹치면 각 ㄱㄴㄷ과 각 %s이 꼭 포개어져요.' % CH('ㄱㄷㄴ', 'ㄴㄱㄷ'),
                '이등변삼각형을 반으로 접으면 길이가 같은 두 변에 있는 %s이 포개어지므로 크기가 %s.' % (CH('두 각', '세 각'), CH('같아요', '달라요'))])
    s.step('④ 약속하기', '이등변삼각형의 성질')
    if not ch:
        s.wordbox(['두 각'])
    s.fill(['이등변삼각형은 길이가 같은 두 변에 있는 %s의 크기가 같아요.' % B])
    s.text('두 각의 크기가 같은 삼각형이에요(실제 크기). 자로 세 변을 재어 길이가 같은 변을 초록색으로 그려 보세요.')
    real(s, T2_TWOANG, gap=1.2, each=[dict(angs=['%s°' % degs(p)[0], '%s°' % degs(p)[1], None]) for p in T2_TWOANG])
    s.ask('가에서 길이가 같은 두 변 (      ) cm, 나에서 길이가 같은 두 변 (      ) cm', blank=False)
    s.page_break()
    s.step('⑤ 확인하기', '□ 안에 알맞은 수')
    figk(s, two_fig(Iso(5, 120, 0), Iso(8, 30, 0), dict(lens=[None, '5 cm', '5 cm'], angs=['30°', '□°', None]),
                    dict(lens=[None, '8 cm', '□ cm'], angs=['75°', '75°', None]), U=30), .17)
    if not ch:
        s.text('도움: 왼쪽은 두 변이 5 cm인 이등변삼각형이에요. 오른쪽은 두 각이 75°로 같아요.')
    s.ask('왼쪽 □ = (      )°      오른쪽 □ = (      ) cm', blank=False)
    l2 = [cmtxt(info(p)['L'][1]) for p in T2_TWOANG]
    ans = '3차시  ① 같아요, 같아요   ② 가 %s·%d° / 나 %s·%d° / 다 %s·%d°   ③ ㄱㄷㄴ, 두 각, 같아요   ④ 두 각 / 가 %s, 나 %s   ⑤ 30°, 8 cm' % tuple(
        sum([[cmtxt(info(p)['L'][1]), degs(p)[0]] for p in T2_ISO3], []) + l2)
    if ch:
        ans = ans.replace('③ ㄱㄷㄴ, 두 각, 같아요', '③ ㄱㄴㄷ, ㄱㄷㄴ, 같아요')
        s.step('⑥ 도전하기', '익힘 문제')
        figk(s, two_fig(Iso(6, 110, 0), Iso(5, 50, 0), dict(lens=[None, '6 cm', '□ cm'], angs=['35°', '35°', None]),
                        dict(lens=[None, '5 cm', '□ cm'], angs=['65°', None, '50°']), U=28), .17)
        s.ask('왼쪽 □ = (     ) cm    오른쪽 □ = (     ) cm', blank=False)
        s.ask('삼각형의 두 각의 크기예요. 이등변삼각형은?  ㉠ 15°, 140°   ㉡ 70°, 25°   ㉢ 30°, 75°')
        cm = tri(Iso(4, 90, 0), 45, ticks=True, angs=['45°', '㉠', '㉡'], rights=False)
        figk(s, cm, .17)
        s.ask('이등변삼각형에서 ㉠과 ㉡의 각도의 차는 몇 도인가요?')
        assert third(65, 50) == 65 and third(30, 75) == 75 and third(15, 140) != 15 and third(70, 25) not in (70, 25)
        ans += '   ⑥ 6 cm, 5 cm(나머지 각 %d°) / ㉢(나머지 각 %d°) / ㉠ 45°, ㉡ %d°, 차 %d°' % (third(65, 50), third(30, 75), third(45, 45), third(45, 45) - 45)
    return ans


def tb4(s, ch):
    s.lesson(4, '개념 구축하기(O)', '정삼각형의 성질을 알아볼까요', '정삼각형의 각의 크기에는 어떤 성질이 있을까요?')
    s.scene(None, '예나는 아버지와 함께 꾹이의 집을 정삼각형 모양으로 만들었어요.')
    s.step('① 접어 보기', '정삼각형을 서로 다른 세 방향으로 반 접기(오려서 접어 보세요)')
    cm_fig(s, fold_fig(SSS(5, 5, 5, 0), ['ㄴ', 'ㄷ', 'ㄱ'], [0, 1, 2]), UCM)
    if ch:
        s.fill(['접었을 때 포개어지는 두 각의 크기는 %s. 세 방향으로 접을 수 있으니 정삼각형은 %s의 크기가 같아요.' % (B, B)])
    else:
        s.fill(['접었을 때 포개어지는 두 각의 크기는 %s.' % CH('같아요', '달라요'),
                '세 방향으로 접을 수 있으니 정삼각형은 %s의 크기가 같아요.' % CH('세 각', '두 각')])
    s.page_break()
    s.step('② 재어 보기', '각도기로 정삼각형 두 개의 세 각 재기(실제 크기)')
    big, small = SSS(6, 6, 6, 8), SSS(4, 4, 4, -20)
    cm_fig(s, row([tri(big, UCM, names=['ㄴ', 'ㄷ', 'ㄱ'], fs=24), tri(small, UCM, names=['ㅁ', 'ㅂ', 'ㄹ'], fs=24)], 1.2 * UCM, 'bottom'), UCM)
    s.table([['각', 'ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ'], ['각의 크기', '(   )°', '(   )°', '(   )°', '(   )°', '(   )°', '(   )°']])
    s.page_break()
    s.step('③ 말해 보기', '세 각이 모두 60°인 삼각형의 변 재기(실제 크기)')
    pa, pb = SSS(3, 3, 3, 0), SSS(2, 2, 2, 180)
    real(s, [pa, pb], gap=2, angs=['60°', '60°', '60°'])
    s.ask('가의 세 변 (      ), 나의 세 변 (      )', blank=False)
    if ch:
        s.ask('세 각의 크기가 같은 삼각형은 어떤 삼각형인가요?')
    else:
        s.choices([('세 각의 크기가 같은 삼각형은?', CH('정삼각형', '직각삼각형', '둔각삼각형'))])
    s.step('④ 약속하기', '정삼각형의 성질')
    if not ch:
        s.wordbox(['세 각', '60°'])
    s.fill(['정삼각형은 %s의 크기가 같아요. 세 각의 크기의 합이 180°이므로 정삼각형의 한 각의 크기는 %s예요.' % (B, B)])
    s.step('⑤ 확인하기', '□ 안에 알맞은 수')
    figk(s, two_fig(SSS(4, 4, 4, 0), SSS(5, 5, 5, 180), dict(lens=['4 cm', '4 cm', '4 cm'], angs=['□°', None, None]),
                    dict(lens=['5 cm', '□ cm', None], angs=['60°', '60°', '60°']), U=36), .16)
    if not ch:
        s.text('도움: 왼쪽은 세 변의 길이가 같은 정삼각형, 오른쪽은 세 각의 크기가 같은 삼각형이에요.')
    s.ask('왼쪽 □ = (      )°      오른쪽 □ = (      ) cm', blank=False)
    ans = '4차시  ① 같아요, 세 각   ② 모두 60°   ③ 가 세 변 모두 %s, 나 세 변 모두 %s / 정삼각형   ④ 세 각, 60°   ⑤ %d°, 5 cm' % (
        cmtxt(info(pa)['L'][0]), cmtxt(info(pb)['L'][0]), 180 // 3)
    assert degs(big) == [60, 60, 60] and degs(small) == [60, 60, 60]
    if ch:
        s.step('⑥ 도전하기', '삼각형 ㄱㄴㄷ과 삼각형 ㅁㄷㄹ은 정삼각형이고, 점 ㄴ, ㄷ, ㄹ은 한 직선 위에 있어요.')
        figk(s, line_fig(), .14)
        s.ask('각 ㄱㄷㅁ의 크기는 몇 도인가요?')
        s.ask('한 변이 3 cm인 정삼각형과 2 cm인 정삼각형의 같은 점과 다른 점을 써 보세요.', blank=False)
        s.lines(1)
        ans += '   ⑥ %d° (180 − 60 − 60) / 같은 점: 세 각의 크기가 모두 60°예요. 다른 점: 변의 길이가 달라요.' % (180 - 60 - 60)
    return ans


def tb5(s, ch):
    s.lesson(5, '개념 구축하기(O)', '예각삼각형과 둔각삼각형을 알아볼까요', '삼각형을 각의 크기에 따라 어떻게 나눌 수 있을까요?')
    s.scene(None, '꾹이를 위해 준비한 스크래처, 터널 장난감, 캣타워에서 찾은 삼각형이에요.')
    s.step('① 만져 보기', '세 각에 예각은 [예], 직각은 [직], 둔각은 [둔]으로 표시하기')
    g0 = info(T2_ACU[0])['A']
    gtag = ['직' if abs(a - 90) < .05 else '예' for a in g0]
    cm_fig(s, cards(T2_ACU, UCM * .62, per=5, gap=.5 * UCM, fs=22, each=[dict(angs=gtag)] + [{}] * 4), UCM)
    if ch:
        s.text('삼각자의 직각을 대 보며 나~마의 세 각에 [예], [직], [둔]을 써넣어 보세요.')
    else:
        s.text('가처럼 나~마의 세 각에 [예], [직], [둔]을 써넣어 보세요. 삼각자의 직각을 대 보면 직각보다 작은지, 같은지, 큰지 알 수 있어요.')
    s.step('② 나누어 보기', '각의 크기에 따라')
    s.table([['세 각이 모두 예각인 삼각형', '한 각이 직각인 삼각형', '한 각이 둔각인 삼각형'], ['', '', '']], row_h=2600)
    s.step('③ 약속하기', '각의 크기에 따른 이름')
    if not ch:
        s.wordbox(['예각삼각형', '둔각삼각형'])
    s.fill(['세 각이 모두 예각인 삼각형을 %s이라고 해요.' % B, '한 각이 둔각인 삼각형을 %s이라고 해요.' % B])
    s.page_break()
    s.step('④ 그려 보기', '점 종이에 예각삼각형(왼쪽)과 둔각삼각형(오른쪽) 그리기')
    figk(s, grid_pair(dots=True, cols=8, rows=5), .17)
    if not ch:
        s.text('도움: 그린 뒤 삼각자의 직각을 세 꼭짓점에 대 보아요. 예각삼각형은 세 각이 모두 직각보다 작아야 해요.')
    s.step('⑤ 확인하기', '채아: 55°, 45° / 수호: 45°, 40°')
    s.text('채아와 수호가 그린 삼각형의 두 각의 크기예요.')
    s.ask('채아가 그린 삼각형의 나머지 한 각 (      )°   수호가 그린 삼각형의 나머지 한 각 (      )°', blank=False)
    if ch:
        s.ask('둔각삼각형을 그린 사람은 누구인가요?')
    else:
        s.choices([('둔각삼각형을 그린 사람은?', CH('채아', '수호'))])
    a1, a2 = third(55, 45), third(45, 40)
    assert a1 < 90 < a2
    ans = '5차시  ① %s   ② %s   ③ 예각삼각형, 둔각삼각형   ④ (그리기)   ⑤ %d°, %d° / 수호' % (
        ', '.join('%s %s' % (KO[i], tag3(p)) for i, p in enumerate(T2_ACU) if i), ang_groups(T2_ACU), a1, a2)
    if ch:
        s.step('⑥ 도전하기', '익힘 문제')
        figk(s, dots_fig(), .13)
        s.ask('선분 ㄱㄴ의 양 끝과 어느 점을 이으면 예각삼각형이 될까요?')
        s.ask('두 각의 크기가 25°, 55°인 삼각형은 어떤 삼각형인가요? 까닭도 써 보세요.', blank=False)
        s.lines(1)
        ans += '   ⑥ %s(㉠ 둔각, ㉢ 직각, ㉣ 둔각삼각형) / 둔각삼각형(나머지 각 %d°)' % (CIR[DOT_KIND.index('예각')], third(25, 55))
    return ans


def home_fig():
    k = 30
    X = lambda v: (v[0] * k, -v[1] * k)
    c = C()
    c.rect(X((1, 0))[0], X((0, 6))[1], 9 * k, 6 * k, '#F3E3C7', '#8A6A3A', 3)
    roof = [(1, 6), (10, 6), (5.5, 6 + 4.5 * math.sqrt(3))]
    T(roof, '정', '예각')
    lst = [(roof, '가'), (move(T2_HOME[1], 13, 2.5), '나'), (move(T2_HOME[2], 17, 3), '다'), (move(T2_HOME[3], 21, 7), '라'), (move(T2_HOME[4], 22, 1), '마')]
    for p, l in lst:
        P = [X(v) for v in p]
        c.poly(P, fill='#FFD9A8', col=INK, sw=3)
        c.text(sum(q[0] for q in P) / 3, sum(q[1] for q in P) / 3 + 4, l, 22, RED, bold=True)
    c.rect(c.x0 - 20, c.y0 - 20, c.x1 - c.x0 + 40, c.y1 - c.y0 + 40, 'none', '#E9D8BE', 2)
    return c


def tb6(s, ch):
    s.lesson(6, '탐구 정리하기(O)', '두 가지 기준으로 삼각형을 분류해 볼까요', '한 삼각형을 두 가지 기준으로 나누면 이름을 어떻게 붙일 수 있을까요?')
    s.scene(png(home_fig()), '예나가 꾹이를 집에 데려왔어요. 예나의 집에서 찾은 삼각형이에요. 삼각형 가는 세 변의 길이가 모두 같고, 세 각이 모두 60°예요.', width_mm=78)
    s.step('① 말해 보기', '은우와 다윤이의 말')
    if ch:
        s.fill(['은우: “세 변의 길이가 같으니까 %s이야.”   다윤: “세 각이 모두 예각이니까 %s이야.”' % (B, B)])
    else:
        s.fill(['은우: “세 변의 길이가 같으니까 %s이야.”' % CH('정삼각형', '예각삼각형'), '다윤: “세 각이 모두 예각이니까 %s이야.”' % CH('예각삼각형', '직각삼각형')])
    s.ask('은우와 다윤이가 같은 삼각형의 이름을 다르게 말한 까닭을 써 보세요.', blank=False)
    if not ch:
        s.text('‘은우는 ~을, 다윤이는 ~을 기준으로 했기 때문이에요.’ 꼴로 써요.')
    s.lines(1)
    s.step('② 이름 붙이기', '삼각형 나, 다, 라, 마의 이름을 두 가지씩')
    figk(s, cards(T2_HOME[1:], 40, ticks=True, angs=True, labels=KO[1:], gap=40), .13)
    s.table([['삼각형', '나', '다', '라', '마'], ['변의 길이에 따른 이름', '', '', '', ''], ['각의 크기에 따른 이름', '', '', '', '']], row_h=3000)
    if not ch:
        s.text('도움: 같은 표시를 한 변은 길이가 같아요. 각의 크기는 가장 큰 각을 봐요.')
    s.page_break()
    s.step('③ 분류하기', '삼각형 가~사를 표의 알맞은 칸에 기호로 쓰기')
    figk(s, cards(T2_SEVEN, 36, per=4, ticks=True, angs=True, gap=40), .15)
    s.table(TWO_TABLE, header_col=True, row_h=2600)
    s.step('④ 알게 된 점')
    if ch:
        s.fill(['이등변삼각형에는 예각·직각·둔각삼각형이 %s. 세 변의 길이가 모두 다른 삼각형에도 %s. 정삼각형은 세 각이 모두 60°라서 %s으로 분류해요.' % (B, B, B)])
    else:
        s.fill(['이등변삼각형에는 예각삼각형, 직각삼각형, 둔각삼각형이 %s.' % CH('모두 있어요', '하나도 없어요'),
                '세 변의 길이가 모두 다른 삼각형에도 예각·직각·둔각삼각형이 %s.' % CH('모두 있어요', '예각삼각형만 있어요'),
                '정삼각형은 세 각이 모두 60°라서 %s으로 분류할 수 있어요.' % CH('예각삼각형', '직각삼각형', '둔각삼각형')])
    s.page_break()
    s.step('⑤ 확인하기', '두 변의 길이가 3 cm로 같고 한 각이 25°인 삼각형 ㄱㄴㄷ')
    pc = Iso(3, 130, 0)
    figk(s, tri(pc, 45, lens=[None, '3 cm', '3 cm'], angs=['25°', None, None], names=['ㄴ', 'ㄷ', 'ㄱ']), .16)
    s.text('수빈: “두 변의 길이가 같으니까 이등변삼각형이야.”   정수: “한 각이 예각이니까 예각삼각형이야.”')
    s.ask('잘못 설명한 사람은 누구인가요?')
    if ch:
        s.ask('삼각형 ㄱㄴㄷ의 세 각을 구하고, 알맞은 이름을 모두 써 보세요.', blank=False)
        s.lines(1)
    else:
        s.ask('삼각형 ㄱㄴㄷ의 세 각: 25°, (      )°, (      )°', blank=False)
        s.choices([('변의 길이에 따른 이름', CH('이등변삼각형', '정삼각형')), ('각의 크기에 따른 이름', CH('예각삼각형', '직각삼각형', '둔각삼각형'))])
    ans = '6차시  ① 정삼각형, 예각삼각형 / (예) 은우는 변의 길이를, 다윤이는 각의 크기를 기준으로 했기 때문이에요.   ② %s   ③ %s   ④ 모두 있어요, 모두 있어요, 예각삼각형   ⑤ 정수 / 25°, 25°, %d° → 이등변삼각형, 둔각삼각형' % (
        ' / '.join('%s %s' % (KO[i + 1], names2(p)) for i, p in enumerate(T2_HOME[1:])), two_table(T2_SEVEN), third(25, 25))
    assert degs(pc) == [25, 25, 130]
    if ch:
        s.step('⑥ 도전하기', '조건에 맞는 삼각형 그리기(왼쪽: 이등변삼각형이면서 둔각삼각형, 오른쪽: 세 변의 길이가 모두 다르면서 직각삼각형)')
        figk(s, grid_pair(cols=8, rows=5), .17)
        ans += '   ⑥ (그리기 예) 위 꼭짓점에서 양쪽 아래로 3칸·1칸씩 / 모눈 선을 따라 직각을 만들고 두 변을 3칸·4칸으로'
    return ans


def tb7(s, ch):
    s.lesson(7, '탐구 정리하기(O)', '생각을 더하다 ― 구조물에서 삼각형을 찾아볼까요', '다리와 탑, 건물에는 왜 삼각형이 많을까요? 구조물에서 찾은 삼각형의 이름은 무엇일까요?')
    s.step('① 밀어 보기', '사각형 틀과 삼각형 틀을 옆에서 밀기')
    figk(s, rigid_fig(), .11)
    if ch:
        s.ask('다리나 탑을 만들 때 삼각형을 많이 쓰는 까닭을 써 보세요.', blank=False)
        s.lines(1)
    else:
        s.choices([('밀어도 모양이 변하지 않는 틀은?', CH('사각형 틀', '삼각형 틀')),
                   ('다리나 탑에 삼각형을 많이 쓰는 까닭은?', CH('튼튼하기 때문', '가장 예쁘기 때문'))])
    s.step('② 이름 붙이기 ①', '구조물 사진 속 삼각형(보기: 가는 이등변삼각형, 직각삼각형)')
    figk(s, cards(T2_STR[:3], 34, ticks=True, angs=True, labels=T2_STR_N[:3], gap=60), .15)
    s.table([['구조물', '가 송전탑', '나 광명역', '다 남지철교'], ['알맞은 이름', '이등변삼각형,\n직각삼각형', '', '']], row_h=3400)
    s.step('③ 이름 붙이기 ②', '다른 구조물에서 찾은 삼각형')
    figk(s, cards(T2_STR[3:], 30, ticks=True, angs=True, labels=T2_STR_N[3:], gap=60), .15)
    s.table([['구조물', '라 관람차', '마 미술관', '바 정글돔'], ['알맞은 이름', '', '', '']], row_h=3400)
    if not ch:
        s.text('도움: 세 변의 길이가 모두 다르면 각의 크기에 따른 이름만 붙여요. 정삼각형은 예각삼각형이기도 해요.')
    s.page_break()
    s.step('④ 정리하기', '삼각형을 분류하는 기준')
    if not ch:
        s.wordbox(['정삼각형', '예각삼각형', '둔각삼각형'])
    s.fill(['변의 길이에 따라 이등변삼각형, %s, 세 변의 길이가 모두 다른 삼각형으로 나눌 수 있어요.' % B,
            '각의 크기에 따라 %s, 직각삼각형, %s으로 나눌 수 있어요.' % (B, B)])
    s.step('⑤ 찾아 보기', '우리 주변의 삼각형')
    s.ask('주변의 물건이나 구조물에서 찾은 삼각형과 그 이름, 그렇게 생각한 까닭을 써 보세요.', blank=False)
    if not ch:
        s.text('예) 그네의 지붕에서 찾은 삼각형은 두 변의 길이가 같으므로 이등변삼각형이고, 한 각이 둔각이므로 둔각삼각형이에요.')
    s.lines(3)
    ans = '7차시  ① %s   ② %s   ③ %s   ④ 정삼각형, 예각삼각형, 둔각삼각형   ⑤ (예) 그네 지붕의 삼각형은 두 변의 길이가 같으므로 이등변삼각형, 한 각이 둔각이므로 둔각삼각형' % (
        '튼튼하기 때문(밀어도 모양이 변하지 않음)' if ch else '삼각형 틀, 튼튼하기 때문',
        ' / '.join('%s: %s' % (T2_STR_N[i][0], names2(p)) for i, p in enumerate(T2_STR[:3])),
        ' / '.join('%s: %s' % (T2_STR_N[i + 3][0], names2(p)) for i, p in enumerate(T2_STR[3:])))
    if ch:
        s.step('⑥ 도전하기', '그네 지붕에서 찾은 삼각형')
        sw = T(Iso(3, 110, 0), '이등변', '둔각')
        figk(s, tri(sw, 45, ticks=True, angs=True), .15)
        s.ask('알맞은 이름을 모두 써 보세요.')
        ans += '   ⑥ ' + names2(sw)
    return ans


def tb8(s, ch):
    s.lesson(8, '발표하기(P)', '놀이를 더하다 ― 삼각형을 분류하며 달려요', '삼각형 카드를 두 가지 기준에 따라 빠르고 정확하게 분류할 수 있을까요?')
    s.scene(None, '카드 한 장을 왼쪽 바구니(예각·직각·둔각삼각형)와 오른쪽 바구니(이등변삼각형·정삼각형·세 변의 길이가 모두 다른 삼각형)에 하나씩 넣어요. 잘못 넣으면 한 장에 5초를 더해요.')
    s.step('① 놀이 준비', '바구니 붙임쪽지 나누기')
    s.text('예각삼각형 · 이등변삼각형 · 직각삼각형 · 정삼각형 · 둔각삼각형 · 세 변의 길이가 모두 다른 삼각형')
    s.table([['왼쪽 바구니 (각의 크기)', '오른쪽 바구니 (변의 길이)'], ['', '']], row_h=2400)
    s.step('② 놀이 한 판', '카드마다 왼쪽 바구니 하나, 오른쪽 바구니 하나')
    figk(s, cards(T2_RELAY, 40, ticks=True, angs=True, gap=50), .15)
    s.table([REL_HEAD] + [[KO[i], '', ''] for i in range(4)], row_h=2300)
    s.step('③ 말해 보기', '놀이에서 이기려면')
    if ch:
        s.ask('놀이에서 이기기 위한 방법을 두 가지 써 보세요.', blank=False)
        s.lines(1)
    else:
        s.choices([('두 기준에 따라 정확하게 분류해요.', CH('좋아요', '안 좋아요')), ('빠른 친구가 먼 바구니에 넣을 카드를 맡아요.', CH('좋아요', '안 좋아요')),
                   ('카드를 아무 바구니에나 빨리 넣어요.', CH('좋아요', '안 좋아요'))])
    s.page_break()
    s.step('④ 또 다른 놀이', '주사위 눈에 맞는 카드 내려놓기')
    s.text(DIE_TXT)
    figk(s, cards(T2_DICE, 34, per=6, ticks=True, angs=True, gap=36), .15)
    s.table([['카드'] + list(KO[:6]), ['낼 수 있는 눈'] + [''] * 6], row_h=2400)
    if not ch:
        s.text('도움: 정삼각형도 두 변의 길이가 같아서 1(이등변삼각형)에 낼 수 있어요. 카드마다 눈이 두 개 이상이에요.')
    s.step('⑤ 확인하기', '카드를 넣을 두 바구니')
    c1, c2 = T(Iso(3, 90, 0), '이등변', '직각'), T(ASA(40, 25, 5, 0), '부등변', '둔각')
    figk(s, cards([c1, c2], 40, lens=True, angs=True, gap=70, fs=20), .15)
    s.ask('가: 왼쪽 (                 ), 오른쪽 (                 )', blank=False)
    s.ask('나: 왼쪽 (                 ), 오른쪽 (                 )', blank=False)
    ans = '8차시  ① 왼쪽: 예각·직각·둔각삼각형 / 오른쪽: 이등변삼각형·정삼각형·세 변의 길이가 모두 다른 삼각형   ② %s   ③ %s   ④ %s   ⑤ 가 %s, %s / 나 %s, %s' % (
        relay_ans(T2_RELAY), '(예) 두 기준에 따라 정확하게 분류해요. 빠른 친구가 먼 바구니에 넣을 카드를 맡아요.' if ch else '좋아요, 좋아요, 안 좋아요',
        ', '.join('%s %s' % (KO[i], '·'.join(map(str, dice_faces(p)))) for i, p in enumerate(T2_DICE)), *relay(c1), *relay(c2))
    if ch:
        s.page_break()
        s.step('⑥ 도전하기', '카드 8장으로 한 판 더! 벌점 없이 분류해 보세요.')
        figk(s, cards(T2_RELAY8, 32, per=4, ticks=True, angs=True, gap=40), .15)
        s.table([REL_HEAD] + [[KO[i], '', ''] for i in range(8)], row_h=1900)
        ans += '   ⑥ ' + relay_ans(T2_RELAY8)
    return ans


def tb9(s, ch):
    s.lesson(9, '발표하기(P)', '공부한 내용을 확인해요', '삼각형을 변의 길이와 각의 크기에 따라 분류하고, 그 성질을 설명할 수 있나요?')
    s.step('1번', '삼각형 가~마의 변의 길이')
    figk(s, cards(T2_R1, 34, lens=True, fs=18, gap=50), .15)
    s.ask('이등변삼각형을 모두 찾아 기호를 써 보세요.')
    s.ask('정삼각형을 모두 찾아 기호를 써 보세요.')
    if not ch:
        s.text('도움: 정삼각형도 두 변의 길이가 같으니 이등변삼각형이라고도 할 수 있어요.')
    s.step('2·3번', '□ 안에 알맞은 수 / 삼각형의 이름')
    figk(s, two_fig(Iso(9, 40, 0), SSS(8, 8, 8, 0), dict(lens=[None, '9 cm', '□ cm'], angs=['70°', '□°', None], ticks=True),
                    dict(lens=['8 cm', '□ cm', None], angs=[None, None, '□°']), U=20), .17)
    s.text('왼쪽은 이등변삼각형, 오른쪽은 정삼각형이에요.')
    s.ask('이등변삼각형: □ = (     ) cm, □ = (     )°    정삼각형: □ = (     ) cm, □ = (     )°', blank=False)
    figk(s, cards(T2_R3, 34, angs=True, labels=['①', '②', '③'], gap=60), .15)
    if ch:
        s.ask('①, ②, ③의 이름을 각의 크기에 따라 써 보세요.   ① (          )  ② (          )  ③ (          )', blank=False)
    else:
        s.choices([('①', CH('예각삼각형', '직각삼각형', '둔각삼각형')), ('②', CH('예각삼각형', '직각삼각형', '둔각삼각형')), ('③', CH('예각삼각형', '직각삼각형', '둔각삼각형'))])
    s.page_break()
    s.step('4번', '1 cm 모눈종이에 그리기 — 두 변의 길이가 3 cm로 같고, 한 각이 직각인 삼각형')
    cm_fig(s, sq_grid(9, 5, UCM), UCM)
    if not ch:
        s.text('도움: 모눈 한 칸이 1 cm예요. 직각을 끼고 있는 두 변을 3칸씩 그려요.')
    s.step('5·6번', '삼각형 가~라')
    figk(s, cards(T2_R5, 36, lens=True, angs=True, fs=18, gap=50), .15)
    s.ask('이등변삼각형이면서 둔각삼각형인 것은?')
    s.text('예지: “한 각이 예각이니까 다는 예각삼각형이야.”   은우: “세 변의 길이가 같으니까 다는 정삼각형이야.”')
    s.ask('잘못 설명한 사람은 누구인가요?')
    s.ask('잘못 설명한 사람의 말을 바르게 고쳐 써 보세요.', blank=False)
    s.lines(1)
    s.page_break()
    stm = [('이등변삼각형은 두 각의 크기가 같아요.', True), ('세 변의 길이가 같은 삼각형을 정삼각형이라고 해요.', True), ('정삼각형은 세 각의 크기가 같아요.', True),
           ('둔각삼각형은 세 각이 모두 둔각이에요.', False), ('예각삼각형은 세 각이 모두 예각이에요.', True), ('두 변의 길이가 같은 삼각형은 둔각삼각형이에요.', False)]
    s.step('보물 찾기', '설명이 옳으면 오른쪽(→), 옳지 않으면 아래쪽(↓)으로')
    for i, (q, t) in enumerate(stm):
        s.text('%d. %s' % (i + 1, q))
    figk(s, path_fig(len(stm)), .11)
    s.ask('도착한 보물 상자의 번호는?')
    box = sum(1 for _, t in stm if not t) + 1
    I1 = lambda f: nm_list(T2_R1, f)
    ans = '9차시  1번 이등변 %s / 정 %s   2·3번 9 cm, 70°, 8 cm, 60° / ① %s ② %s ③ %s   4번 직각을 낀 두 변이 3칸인 직각삼각형   5·6번 %s / 예지 / 세 각이 모두 예각이니까 예각삼각형이야   보물 찾기 %s → %d번 상자' % (
        I1(lambda I: I['side'] != '부등변'), I1(lambda I: I['side'] == '정'), *[ANG[info(p)['ang']] for p in T2_R3],
        nm_list(T2_R5, lambda I: I['side'] != '부등변' and I['ang'] == '둔각'), ''.join('○' if t else '×' for _, t in stm), box)
    assert degs(Iso(9, 40))[0] == 70
    if ch:
        s.step('도전하기', '유클리드처럼 원 두 개로 정삼각형 그리기')
        s.text('컴퍼스로 점 ㄱ과 점 ㄴ을 각각 중심으로 하고 반지름이 선분 ㄱㄴ(5 cm)인 원을 그려, 두 원이 만나는 점과 ㄱ, ㄴ을 이어 보세요.')
        cm_fig(s, euclid_fig(), UCM)
        s.ask('이렇게 그린 삼각형이 정삼각형인 까닭을 써 보세요.', blank=False)
        s.lines(1)
        ans += '   도전 세 변이 모두 원의 반지름(5 cm)과 같아서'
    return ans


# ================================================================ 이야기 버전
T2S_FLAGS = [T(SSS(3, 4, 4, 0), '이등변'), T(SSS(3, 3, 3, 15), '정'), T(SSS(4, 2.5, 3.5, 180), '부등변'), T(SSS(5, 3, 3, 90), '이등변'), T(SSS(2.5, 2.5, 2.5, 200), '정')]
T2S_ISO = [T(Iso(4, 50, 20), '이등변', '예각'), T(Iso(3.5, 110, -80), '이등변', '둔각')]
T2S_TWOANG = [T(Iso(3.5, 70, 10), '이등변', '예각'), T(Iso(3, 140, -20), '이등변', '둔각')]
T2S_TENTS = [T(SAS(4.5, 90, 2.5, 0), '부등변', '직각'), T(ASA(55, 65, 4, 10), '부등변', '예각'), T(ASA(30, 40, 5, 0), '부등변', '둔각'), T(ASA(70, 50, 4, 190), '부등변', '예각'), T(ASA(20, 55, 5, 185), '부등변', '둔각')]
T2S_HOME = [T(SSS(3.5, 3.5, 3.5, 0), '정', '예각'), T(Iso(3, 70, 0), '이등변', '예각'), T(Iso(3, 90, 20), '이등변', '직각'), T(Iso(2.8, 130, 0), '이등변', '둔각'), T(SAS(4, 90, 3, 0), '부등변', '직각')]
T2S_SEVEN = [T(Iso(4.5, 40, 15), '이등변', '예각'), T(ASA(35, 30, 5, -5), '부등변', '둔각'), T(Iso(3, 110, 170), '이등변', '둔각'), T(ASA(65, 55, 4, 15), '부등변', '예각'),
             T(Iso(3.2, 90, 40), '이등변', '직각'), T(SAS(4, 90, 2.5, -10), '부등변', '직각'), T(Iso(3.5, 125, 80), '이등변', '둔각')]
T2S_STR = [(T(Iso(4, 70, 0), '이등변', '예각'), '가 · A형 텐트'), (T(Iso(4, 120, 0), '이등변', '둔각'), '나 · 정자 지붕'), (T(SSS(4, 4, 4, 0), '정', '예각'), '다 · 안내 표지판'),
           (T(SAS(4, 90, 3, 0), '부등변', '직각'), '라 · 캠프장 철교'), (T(ASA(70, 50, 3.5, 0), '부등변', '예각'), '마 · 돔 텐트'), (T(Iso(3, 90, 0), '이등변', '직각'), '바 · 송전탑')]
T2S_RELAY4 = [T(Iso(3.5, 90, 0), '이등변', '직각'), T(SSS(3, 3, 3, 0), '정', '예각'), T(ASA(25, 50, 5, 0), '부등변', '둔각'), T(ASA(65, 45, 4, 0), '부등변', '예각')]
T2S_RELAY8 = [T(Iso(3, 130, 0), '이등변', '둔각'), T(SAS(3.5, 90, 2.5, 0), '부등변', '직각'), T(SSS(4, 4, 4, 30), '정', '예각'), T(Iso(4, 44, 0), '이등변', '예각'),
              T(ASA(35, 25, 5, 0), '부등변', '둔각'), T(Iso(3.5, 90, 180), '이등변', '직각'), T(ASA(75, 45, 4, 0), '부등변', '예각'), T(Iso(3, 105, 180), '이등변', '둔각')]
T2S_DICE = [T(SSS(3.5, 3.5, 3.5, 0), '정', '예각'), T(Iso(3, 90, 0), '이등변', '직각'), T(ASA(30, 35, 5, 0), '부등변', '둔각'), T(Iso(3, 115, 0), '이등변', '둔각'), T(ASA(65, 70, 4, 0), '부등변', '예각'), T(SAS(4.5, 90, 2.5, 0), '부등변', '직각')]
FRIENDS = [(n, x, y, third(x, y)) for n, x, y in [('하준', 50, 35), ('서연', 70, 45), ('지호', 40, 50)]]
assert [('둔각' if z > 90 else '직각' if z == 90 else '예각') for _, _, _, z in FRIENDS] == ['둔각', '예각', '직각']


def st1(s, ch):
    s.lesson(1, '개념 찾기(S)', '텐트 캠프를 준비해요', '캠프 준비물 곳곳에 있는 삼각형은 서로 무엇이 같고 무엇이 다를까요?')
    s.scene(png(camp_fig()), '강 선생님이 “학기 말에 운동장에서 텐트 캠프를 해요!”라고 하셨어요. 4학년 3반의 캠프 준비물이에요.', width_mm=92)
    s.step('① 만져 보기 — 보기·생각하기·궁금해하기', '캠프 준비물 그림을 보고 칸마다 써요')
    if ch:
        s.labeled([('보여요', ''), ('생각해요', ''), ('궁금해요', '')], row_h=3000)
    else:
        s.labeled([('보여요', '캠프 준비물에서 ______________ 이 보여요.'), ('생각해요', '______________ 은 ____________ 해서 삼각형으로 만든 것 같아요.'),
                   ('궁금해요', '______________ 은 왜 그럴까?')], row_h=3000)
    s.step('② 그려 보기 — 캠프 준비물에서 삼각형 찾기')
    s.text(' · '.join('%s %s' % (KO[i], n) for i, n in enumerate(CAMP_ITEMS)))
    s.ask('삼각형을 찾을 수 있는 것을 모두 찾아 기호를 써 보세요.')
    if not ch:
        s.text('도움: 곧은 선 3개로 둘러싸인 모양을 찾아요. 둥근 것과 네모난 것은 삼각형이 아니에요.')
    s.page_break()
    s.step('③ 말해 보기 — 직각삼각형 떠올리기', '하준이 모둠이 그린 텐트 앞모습')
    rp = [ASA(60, 55, 4, 0), ASA(25, 35, 5, 0), SAS(3.5, 90, 3, 170)]
    assert [info(p)['ang'] for p in rp] == ['예각', '둔각', '직각']
    figk(s, cards(rp, 45), .13)
    if ch:
        s.ask('직각삼각형을 찾아 기호를 써 보세요.')
    else:
        s.choices([('직각삼각형은? (ㄴ 모양 표시를 찾아요)', CH('가', '나', '다')), ('삼각형의 변과 각은 각각 몇 개?', CH('3개', '4개'))])
    s.ask('왜 그럴까요? 다를 직각삼각형이라고 할 수 있는 까닭을 써 보세요.', blank=False)
    if not ch:
        s.text('‘왜냐하면 다는 한 각이 ~이기 때문이에요.’ 꼴로 써요.')
    s.lines(1)
    s.step('④ 약속하기 — 4-1에서 배운 것')
    if not ch:
        s.wordbox(['직각삼각형', '예각', '둔각', '180°'])
    s.fill(['한 각이 직각인 삼각형을 %s이라고 해요.' % B,
            '각도가 0°보다 크고 직각보다 작은 각을 %s, 직각보다 크고 180°보다 작은 각을 %s이라고 해요.' % (B, B),
            '삼각형의 세 각의 크기의 합은 %s예요.' % B])
    s.step('⑤ 확인하기 — 깃발의 남은 각', '서연이가 깃발 두 장의 두 각을 각도기로 재었어요')
    figk(s, two_fig(ASA(80, 45, 4), ASA(35, 20, 5), dict(angs=['80°', '45°', '□°']), dict(angs=['35°', '20°', '□°']), U=40), .13)
    s.ask('왼쪽 깃발 □ = (      )°      오른쪽 깃발 □ = (      )°', blank=False)
    s.ask('캠프를 준비하며 삼각형에 대해 알고 싶은 것을 써 보세요.', blank=False)
    if not ch:
        s.text('‘삼각형의 ~을 알고 싶어요.’ 꼴로 써요.')
    s.lines(1)
    ans = '1차시  ① (생각 쓰기 — 예: 텐트 앞모습이 커다란 삼각형으로 보여요 / 텐트를 삼각형으로 세우면 바람이 불어도 잘 버틸 것 같아요 / 삼각형도 모양에 따라 이름이 다를까?)   ② %s   ③ 다%s / 왜: (예) 다는 세 각 중 한 각이 직각이기 때문이에요   ④ 직각삼각형, 예각, 둔각, 180°   ⑤ %d°, %d° / (예) 변의 길이와 각의 크기에 따라 삼각형에 어떤 이름을 붙이는지 알고 싶어요' % (
        ', '.join(KO[i] for i in CAMP_OK), '' if ch else ', 3개', third(80, 45), third(35, 20))
    if ch:
        s.step('⑥ 도전하기', '지호가 텐트 앞판에 꼭대기에서 바닥까지 지지대 2개를 붙였어요')
        figk(s, truss_fig(), .1)
        s.ask('그림에서 찾을 수 있는 삼각형은 모두 몇 개인가요? 어떻게 세었는지도 써 보세요.', blank=False)
        s.lines(1)
        ans += '   ⑥ %d개 (작은 삼각형 3개 + 2개를 합친 삼각형 2개 + 전체 1개)' % truss_count()
        assert truss_count() == 3 + 2 + 1
    return ans


def st2(s, ch):
    s.lesson(2, '개념 구축하기(O)', '깃발 가랜드 ― 이등변삼각형과 정삼각형', '깃발 삼각형을 변의 길이에 따라 어떻게 나눌 수 있을까요?')
    s.scene(None, '모둠마다 가랜드에 걸 깃발을 하나씩 만들었어요(가~마). 실제 크기로 그렸어요.')
    s.step('① 만져 보기 — 깃발 세 변 재기')
    real(s, T2S_FLAGS[:3], gap=.6)
    real(s, T2S_FLAGS[3:], gap=1.5, labels=KO[3:])
    s.table([['깃발', '가', '나', '다', '라', '마'], ['세 변의 길이(cm)', '', '', '', '', ''], ['길이가 같은 변의 수', '(  )개', '(  )개', '(  )개', '(  )개', '(  )개']],
            row_h=3600)
    if not ch:
        s.text('도움: 길이가 같은 변을 초록색으로 따라 그려요. 같은 변이 없으면 0개예요.')
    s.page_break()
    s.step('② 말해 보기 — 변의 길이로 나누기')
    s.table([['세 변의 길이가 모두 다른 삼각형', '두 변의 길이만 같은 삼각형', '세 변의 길이가 같은 삼각형'], ['', '', '']], row_h=2600)
    s.ask('왜 그럴까요? 깃발 다를 다른 깃발과 따로 나눈 까닭을 써 보세요.', blank=False)
    if not ch:
        s.text('‘왜냐하면 다는 세 변의 길이가 ~이기 때문이에요.’ 꼴로 써요.')
    s.lines(1)
    s.step('③ 약속하기 — 이등변삼각형과 정삼각형')
    if not ch:
        s.wordbox(['이등변삼각형', '정삼각형'])
    s.fill(['두 변의 길이가 같은 삼각형을 %s이라고 해요.' % B, '세 변의 길이가 같은 삼각형을 %s이라고 해요.' % B])
    s.step('④ 확인하기 — 막대로 만든 깃발 틀', '예린이 모둠')
    s.text('세 막대의 길이:  ㉠ 5 cm, 5 cm, 5 cm   ㉡ 4 cm, 6 cm, 4 cm   ㉢ 3 cm, 5 cm, 6 cm')
    if ch:
        s.ask('이등변삼각형이 아닌 것과 정삼각형을 각각 찾아 보세요.   아닌 것 (     ), 정삼각형 (     )', blank=False)
    else:
        s.choices([('이등변삼각형이 아닌 것은?', CH('㉠', '㉡', '㉢')), ('정삼각형은?', CH('㉠', '㉡', '㉢'))])
    figk(s, two_fig(SSS(4, 6, 6, 0), SSS(7, 7, 7), dict(lens=['4 cm', '6 cm', '6 cm'], ticks=True), dict(lens=['7 cm', None, None]), U=26), .17)
    s.text('왼쪽은 이등변삼각형 깃발, 오른쪽은 정삼각형 깃발이에요. 둘레에 끈을 둘러요.')
    s.ask('왼쪽 깃발의 둘레 (      ) cm      오른쪽 깃발의 둘레 (      ) cm', blank=False)
    ans = '2차시  ① %s   ② %s / 왜: (예) 다는 세 변의 길이가 %s로 모두 달라서 길이가 같은 변이 없기 때문이에요   ③ 이등변삼각형, 정삼각형   ④ ㉢, ㉠ / %d cm, %d cm' % (
        sides_ans(T2S_FLAGS), side_groups(T2S_FLAGS), ', '.join(cmtxt(v) for v in sorted(info(T2S_FLAGS[2])['L'])), 4 + 6 + 6, 7 * 3)
    if ch:
        s.step('⑤ 도전하기', '끈으로 만든 깃발 틀')
        s.text('다은이네 모둠은 끈 18 cm를 남김없이 써서 정삼각형 깃발 틀을 만들었어요. 민우네 모둠은 끈 20 cm로 두 변이 7 cm인 이등변삼각형 틀을 만들었어요.')
        s.ask('다은이네 깃발의 한 변 (      ) cm      민우네 깃발의 나머지 한 변 (      ) cm', blank=False)
        ans += '   ⑤ %d cm (18 ÷ 3), %d cm (20 − 7 − 7)' % (18 // 3, 20 - 7 - 7)
    return ans


def st3(s, ch):
    s.lesson(3, '개념 구축하기(O)', '깃발 도안 그리기 ― 텐트촌에서 찾아요', '이등변삼각형과 정삼각형은 어떻게 그리고, 그림 속에서 어떻게 찾을까요?')
    s.step('① 만져 보기 — 모눈종이에 이등변삼각형', '예린이의 깃발 도안')
    s.step('② 그려 보기 — 삼각 모눈종이에 정삼각형')
    s.text('왼쪽 모눈종이에는 이등변삼각형을, 오른쪽 삼각 모눈종이에는 정삼각형을 그려 보세요.')
    figk(s, grid_pair(tri=True, cols=8, rows=5), .17)
    if not ch:
        s.text('도움: 이등변삼각형은 위 꼭짓점에서 오른쪽으로 2칸 아래로 4칸, 왼쪽으로 2칸 아래로 4칸처럼 두 변을 같은 칸 수로 그려요. 정삼각형은 삼각 모눈의 선을 따라 세 변을 같은 칸 수로 그려요.')
    s.ask('왜 그럴까요? 내가 그린 삼각형이 정삼각형인지 어떻게 확인했나요?', blank=False)
    if not ch:
        s.text('‘세 변의 칸 수를 세어 보니 모두 ~칸으로 같아서 정삼각형이에요.’ 꼴로 써요.')
    s.lines(1)
    s.page_break()
    s.step('③ 말해 보기 — 텐트촌 그림에서 찾기', '민우가 그린 우리 반 텐트촌')
    figk(s, camp_tri_fig(), .185)
    s.text('이등변삼각형을 찾아 세 변을 빨간색으로 그리고, 정삼각형을 찾아 초록색으로 칠해 보세요. 자로 재어 비교해요.')
    iso = [KO[i] for i, (p, _) in enumerate(CAMPTRI) if info(p)['side'] != '부등변']
    eq = [KO[i] for i, (p, _) in enumerate(CAMPTRI) if info(p)['side'] == '정']
    if not ch:
        s.text('도움: 텐트 문(나)과 깃발(다, 라, 마)도 살펴봐요. 정삼각형도 두 변의 길이가 같아요.')
    s.ask('이등변삼각형의 기호를 모두 써 보세요.')
    s.ask('정삼각형의 기호를 모두 써 보세요.')
    s.step('④ 확인하기 — □ 안에 알맞은 수', '같은 표시를 한 변은 길이가 같아요')
    figk(s, two_fig(SSS(3, 5, 5, 0), SSS(6, 6, 6, 180), dict(lens=['3 cm', '5 cm', '□ cm'], ticks=True), dict(lens=['6 cm', '□ cm', None], ticks=True), U=26), .17)
    s.ask('왼쪽 □ = (      ) cm      오른쪽 □ = (      ) cm', blank=False)
    ans = '3차시  ①② (그리기) 두 변의 칸 수가 같은 삼각형 / 세 변이 모두 같은 칸 수인 삼각형 / 왜: (예) 세 변의 칸 수를 세어 보니 모두 같아서 세 변의 길이가 같은 정삼각형이에요   ③ 이등변삼각형 %s / 정삼각형 %s   ④ 5 cm, 6 cm' % (', '.join(iso), ', '.join(eq))
    if ch:
        s.page_break()
        s.step('⑤ 도전하기', '두 변의 길이가 3칸으로 같고, 한 각이 직각인 삼각형을 1 cm 모눈종이에 그려 보세요')
        cm_fig(s, sq_grid(9, 5, UCM), UCM)
        ans += '   ⑤ 직각을 낀 두 변이 3칸(3 cm)인 직각삼각형(이등변삼각형이면서 직각삼각형)'
    return ans


def st4(s, ch):
    s.lesson(4, '개념 구축하기(O)', '접어 자른 깃발 ― 이등변삼각형의 성질', '이등변삼각형의 각의 크기에는 어떤 규칙이 있을까요?')
    s.scene(None, '서연이는 깃발을 빨리 만들려고 색종이를 반으로 접어 비스듬히 잘랐어요.')
    s.step('① 만져 보기 — 접어서 자른 깃발')
    s.ask('먼저 예상해요: 반으로 접어 자른 깃발의 변과 각에는 어떤 규칙이 있을까요?', blank=False)
    if not ch:
        s.text('‘내 예상: 두 변의 길이가 ~하고, 두 각의 크기도 ~할 것 같아요.’ 꼴로 써요.')
    s.lines(1)
    figk(s, cut_fig(), .14)
    if ch:
        s.fill(['겹쳐서 자른 두 변의 길이는 %s. 겹쳐 있던 두 각의 크기는 %s.' % (B, B)])
    else:
        s.fill(['펼친 깃발에서 겹쳐서 자른 두 변의 길이가 %s. 겹쳐 있던 두 각의 크기도 %s.' % (CH('같아요', '달라요'), CH('같아요', '달라요'))])
    s.step('② 그려 보기 — 재어서 표시하기', '모둠마다 자른 깃발 두 장(실제 크기)')
    real(s, T2S_ISO, gap=1)
    s.table([['깃발', '가', '나'], ['길이가 같은 두 변', '(    ) cm', '(    ) cm'], ['크기가 같은 두 각', '(    )°', '(    )°']])
    if not ch:
        s.text('도움: 같은 변은 초록색, 같은 각은 빨간색으로 표시해 보세요.')
    s.page_break()
    s.step('③ 말해 보기 — 반으로 접어 보기', '꼭짓점 ㄴ을 꼭짓점 ㄷ에 겹치기(오려서 접어 보세요)')
    cm_fig(s, fold_fig(Iso(5, 44, 0), ['ㄴ', 'ㄷ', 'ㄱ'], [2]), UCM)
    if ch:
        s.fill(['반으로 접으면 각 %s과 각 %s이 꼭 포개어져요.' % (B, B)])
    else:
        s.fill(['반으로 접으면 각 ㄱㄴㄷ과 각 %s이 꼭 포개어져요. 그래서 두 각의 크기가 %s.' % (CH('ㄱㄷㄴ', 'ㄴㄱㄷ'), CH('같아요', '달라요'))])
    s.ask('왜 그럴까요? 반으로 접었을 때 포개어지는 두 각의 크기가 같은 까닭을 써 보세요.', blank=False)
    if not ch:
        s.text('‘왜냐하면 두 각이 ~ 포개어져서 남거나 모자라는 곳이 ~ 때문이에요.’ 꼴로 써요.')
    s.lines(1)
    s.step('④ 약속하기 — 이등변삼각형의 성질')
    if not ch:
        s.wordbox(['두 각'])
    s.fill(['이등변삼각형은 길이가 같은 두 변에 있는 %s의 크기가 같아요.' % B])
    s.page_break()
    s.text('두 각의 크기가 같은 깃발이에요(실제 크기). 자로 세 변을 재어 길이가 같은 변을 초록색으로 그려 보세요.')
    real(s, T2S_TWOANG, gap=1.2, each=[dict(angs=['%s°' % degs(p)[0], '%s°' % degs(p)[1], None]) for p in T2S_TWOANG])
    s.ask('가에서 길이가 같은 두 변 (        ), 나에서 길이가 같은 두 변 (        )', blank=False)
    s.step('⑤ 확인하기 — □ 안에 알맞은 수', '왼쪽은 두 변이 6 cm인 깃발, 오른쪽은 두 각이 70°인 깃발')
    figk(s, two_fig(Iso(6, 110, 0), Iso(7, 40, 0), dict(lens=[None, '6 cm', '6 cm'], angs=['35°', '□°', None]),
                    dict(lens=[None, '7 cm', '□ cm'], angs=['70°', '70°', None]), U=26), .17)
    s.ask('왼쪽 □ = (      )°      오른쪽 □ = (      ) cm', blank=False)
    ans = '4차시  ① (예상 예) 두 변의 길이가 같고 두 각의 크기도 같아요 / 같아요, 같아요   ② 가 %s·%d° / 나 %s·%d°   ③ %s / 왜: (예) 두 각이 꼭 포개어져서 남거나 모자라는 곳이 없기 때문이에요   ④ 두 각 / 가 %s, 나 %s   ⑤ 35°, 7 cm' % (
        cmtxt(info(T2S_ISO[0])['L'][1]), degs(T2S_ISO[0])[0], cmtxt(info(T2S_ISO[1])['L'][1]), degs(T2S_ISO[1])[0],
        'ㄱㄴㄷ, ㄱㄷㄴ' if ch else 'ㄱㄷㄴ, 같아요', cmtxt(info(T2S_TWOANG[0])['L'][1]), cmtxt(info(T2S_TWOANG[1])['L'][1]))
    if ch:
        s.step('⑥ 도전하기', '이등변삼각형의 성질과 세 각의 크기의 합')
        s.ask('삼각형의 두 각의 크기예요. 이등변삼각형은?  ㉠ 40°, 100°   ㉡ 50°, 60°   ㉢ 20°, 150°')
        figk(s, tri(Iso(4, 80, 0), 40, ticks=True, angs=['㉠', '㉡', '80°']), .14)
        s.ask('㉠의 크기는 몇 도인가요? 어떻게 구했는지도 써 보세요.', blank=False)
        s.lines(1)
        assert third(40, 100) == 40
        ans += '   ⑥ ㉠(나머지 각 %d°, ㉡ %d°, ㉢ %d°) / %d° (180 − 80 = 100, 100 ÷ 2 = 50)' % (third(40, 100), third(50, 60), third(20, 150), (180 - 80) // 2)
    return ans


def st5(s, ch):
    s.lesson(5, '개념 구축하기(O)', '정삼각형 텐트 앞판 ― 정삼각형의 성질', '정삼각형 모양 텐트 앞판의 각에는 어떤 규칙이 있을까요?')
    s.scene(None, '지호네 모둠 텐트의 앞판은 정삼각형이에요.')
    s.step('① 만져 보기 — 세 방향으로 접기')
    s.ask('먼저 예상해요: 정삼각형 앞판은 몇 가지 방법으로 반을 접을 수 있고, 각에는 어떤 규칙이 있을까요?', blank=False)
    if not ch:
        s.text('‘내 예상: ~가지 방법으로 접을 수 있고, ~ 각의 크기가 같을 것 같아요.’ 꼴로 써요.')
    s.lines(1)
    cm_fig(s, fold_fig(SSS(5, 5, 5, 0), ['ㄴ', 'ㄷ', 'ㄱ'], [0, 1, 2]), UCM)
    if ch:
        s.fill(['접었을 때 포개어지는 두 각의 크기는 %s. 세 방향으로 접을 수 있으니 정삼각형은 %s의 크기가 같아요.' % (B, B)])
    else:
        s.fill(['접었을 때 포개어지는 두 각의 크기는 %s. 세 방향으로 접을 수 있으니 정삼각형은 %s의 크기가 같아요.' % (CH('같아요', '달라요'), CH('세 각', '두 각'))])
    s.page_break()
    s.step('② 그려 보기 — 각도기로 세 각 재기', '크기가 다른 정삼각형 앞판 두 개(실제 크기)')
    big, small = SSS(5.5, 5.5, 5.5, 8), SSS(4, 4, 4, -15)
    assert degs(big) == [60] * 3 and degs(small) == [60] * 3
    cm_fig(s, row([tri(big, UCM, names=['ㄴ', 'ㄷ', 'ㄱ'], fs=24), tri(small, UCM, names=['ㅁ', 'ㅂ', 'ㄹ'], fs=24)], 1.4 * UCM, 'bottom'), UCM)
    s.table([['각', 'ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ'], ['각의 크기', '(   )°', '(   )°', '(   )°', '(   )°', '(   )°', '(   )°']])
    s.page_break()
    s.step('③ 말해 보기 — 세 각이 같은 삼각형', '세 각이 모두 60°인 텐트 창문(실제 크기)')
    pa, pb = SSS(3.5, 3.5, 3.5, 0), SSS(2.5, 2.5, 2.5, 180)
    real(s, [pa, pb], gap=2, angs=['60°', '60°', '60°'])
    s.ask('가의 세 변 (        ), 나의 세 변 (        )', blank=False)
    if ch:
        s.ask('세 각의 크기가 같은 삼각형은 어떤 삼각형인가요?')
    else:
        s.choices([('세 각의 크기가 같은 삼각형은?', CH('정삼각형', '직각삼각형', '둔각삼각형'))])
    s.ask('왜 그럴까요? 정삼각형의 한 각이 언제나 60°인 까닭을 써 보세요.', blank=False)
    if not ch:
        s.text('‘왜냐하면 세 각의 크기의 합 ~°를 똑같이 ~으로 나누면 ~°이기 때문이에요.’ 꼴로 써요.')
    s.lines(1)
    s.step('④ 약속하기 — 정삼각형의 성질')
    if not ch:
        s.wordbox(['세 각', '60°'])
    s.fill(['정삼각형은 %s의 크기가 같아요. 세 각의 크기의 합이 180°이므로 정삼각형의 한 각의 크기는 %s예요.' % (B, B)])
    s.step('⑤ 확인하기 — □ 안에 알맞은 수')
    figk(s, two_fig(SSS(6, 6, 6, 0), SSS(9, 9, 9, 180), dict(lens=['6 cm', '6 cm', '6 cm'], angs=['□°', None, None]),
                    dict(lens=['9 cm', '□ cm', None], angs=['60°', '60°', '60°']), U=22), .16)
    s.ask('왼쪽 □ = (      )°      오른쪽 □ = (      ) cm', blank=False)
    ans = '5차시  ① (예상 예) 세 방향으로 접을 수 있고 세 각의 크기가 같아요 / 같아요, 세 각   ② 모두 60°   ③ 가 세 변 모두 %s, 나 세 변 모두 %s / 정삼각형 / 왜: (예) 세 각의 크기의 합 180°를 똑같이 셋으로 나누면 60°이기 때문이에요   ④ 세 각, %d°   ⑤ 60°, 9 cm' % (
        cmtxt(info(pa)['L'][0]), cmtxt(info(pb)['L'][0]), 180 // 3)
    if ch:
        s.step('⑥ 도전하기', '한 변이 5 cm인 정삼각형 깃발 2장을 한 변끼리 꼭 맞게 붙여 사각형 깃발을 만들었어요')
        figk(s, rhombus_fig(), .12)
        s.ask('사각형 깃발의 둘레 (      ) cm      두 정삼각형의 각이 모인 꼭짓점의 각 (      )°', blank=False)
        ans += '   ⑥ %d cm (5 × 4, 붙인 변은 둘레가 아님), %d° (60 + 60)' % (5 * 4, 60 + 60)
    return ans


def st6(s, ch):
    s.lesson(6, '개념 구축하기(O)', '여러 모양 텐트 ― 예각삼각형과 둔각삼각형', '텐트 앞모습 삼각형을 각의 크기에 따라 어떻게 나눌 수 있을까요?')
    s.scene(None, '캠핑 용품점 안내지에 실린 텐트 앞모습 가~마예요.')
    s.step('① 만져 보기 — 각마다 예·직·둔', '가와 같이 세 각에 [예], [직], [둔]으로 표시하기')
    gtag = ['직' if abs(a - 90) < .05 else '예' for a in info(T2S_TENTS[0])['A']]
    cm_fig(s, cards(T2S_TENTS, UCM * .62, per=5, gap=.5 * UCM, fs=22, each=[dict(angs=gtag)] + [{}] * 4), UCM)
    if not ch:
        s.text('도움: 삼각자의 직각을 대 보아요. 직각보다 작으면 [예], 꼭 맞으면 [직], 크면 [둔]이에요.')
    s.step('② 그려 보기 — 각의 크기로 나누기')
    s.table([['세 각이 모두 예각인 삼각형', '한 각이 직각인 삼각형', '한 각이 둔각인 삼각형'], ['', '', '']], row_h=2600)
    s.ask('왜 그럴까요? 다에도 예각이 두 개 있는데 ‘세 각이 모두 예각인 삼각형’에 넣지 않은 까닭을 써 보세요.', blank=False)
    if not ch:
        s.text('‘왜냐하면 다는 예각이 두 개 있지만 나머지 한 각이 ~이기 때문이에요.’ 꼴로 써요.')
    s.lines(1)
    s.step('③ 약속하기 — 예각삼각형과 둔각삼각형')
    if not ch:
        s.wordbox(['예각삼각형', '둔각삼각형'])
    s.fill(['세 각이 모두 예각인 삼각형을 %s이라고 해요.' % B, '한 각이 둔각인 삼각형을 %s이라고 해요.' % B])
    s.page_break()
    s.step('④ 그려 보기 — 점 종이에 텐트 그리기', '왼쪽에 예각삼각형 텐트, 오른쪽에 둔각삼각형 텐트')
    figk(s, grid_pair(dots=True, cols=8, rows=5), .17)
    if not ch:
        s.text('도움: 그린 뒤 삼각자의 직각을 세 꼭짓점에 대 보아요.')
    s.step('⑤ 확인하기 — 누가 둔각삼각형을 그렸을까', ' / '.join('%s: %d°, %d°' % (n, x, y) for n, x, y, _ in FRIENDS))
    s.text('세 친구가 그린 텐트의 두 각이에요. 나머지 한 각을 구해 보세요.')
    s.ask('   '.join('%s (      )°' % n for n, _, _, _ in FRIENDS), blank=False)
    if ch:
        s.ask('둔각삼각형을 그린 사람은 누구인가요?')
    else:
        s.choices([('둔각삼각형을 그린 사람은?', CH(*[n for n, _, _, _ in FRIENDS]))])
    ans = '6차시  ① %s   ② %s / 왜: (예) 다는 예각이 두 개 있지만 나머지 한 각이 둔각이어서 세 각이 모두 예각은 아니기 때문이에요   ③ 예각삼각형, 둔각삼각형   ④ (그리기)   ⑤ %s / 하준' % (
        ', '.join('%s %s' % (KO[i], tag3(p)) for i, p in enumerate(T2S_TENTS) if i), ang_groups(T2S_TENTS), ', '.join('%s %d°' % (n, z) for n, _, _, z in FRIENDS))
    if ch:
        s.step('⑥ 도전하기', '각의 크기를 따져 보세요')
        s.ask('민우가 “둔각이 두 개인 삼각형도 그릴 수 있어.”라고 했어요. 민우의 말이 맞는지 까닭과 함께 써 보세요.', blank=False)
        s.lines(1)
        s.ask('두 각의 크기가 25°, 60°인 삼각형은 어떤 삼각형인가요?')
        ans += '   ⑥ 그릴 수 없어요(둔각 두 개만 더해도 180°보다 커요) / 둔각삼각형(나머지 각 %d°)' % third(25, 60)
    return ans


def st7(s, ch):
    s.lesson(7, '개념 구축하기(O)', '텐트에 이름표 붙이기 ― 두 가지 기준', '한 삼각형을 변의 길이와 각의 크기, 두 가지 기준으로 나누면 이름을 어떻게 붙일 수 있을까요?')
    s.step('① 만져 보기 — 하나의 텐트, 두 이름', '정삼각형 모양 안내 표지판')
    sp = SSS(4, 4, 4, 0)
    figk(s, tri(sp, 34, lens=True, angs=True), .13)
    if ch:
        s.fill(['하준: “세 변의 길이가 같으니까 %s이야.”   서연: “세 각이 모두 예각이니까 %s이야.”' % (B, B)])
    else:
        s.fill(['하준: “세 변의 길이가 같으니까 %s이야.”' % CH('정삼각형', '직각삼각형'), '서연: “세 각이 모두 예각이니까 %s이야.”' % CH('예각삼각형', '둔각삼각형')])
    s.ask('왜 그럴까요? 하준이와 서연이가 같은 삼각형을 다르게 부른 까닭을 써 보세요.', blank=False)
    if not ch:
        s.text('‘왜냐하면 하준이는 ~을, 서연이는 ~을 기준으로 나누었기 때문이에요.’ 꼴로 써요.')
    s.lines(1)
    s.step('② 그려 보기 — 이름 두 가지 고르기', '우리 반 텐트촌에서 찾은 삼각형')
    figk(s, cards(T2S_HOME, 30, per=3, lens=True, angs=True, fs=17, gap=40), .14)
    s.table([['삼각형', '가', '나', '다', '라', '마'], ['변의 길이에 따른 이름', '', '', '', '', ''], ['각의 크기에 따른 이름', '', '', '', '', '']], row_h=3000)
    if not ch:
        s.text('도움: 세 변의 길이가 모두 다른 삼각형은 각의 크기에 따른 이름만 써요.')
    s.page_break()
    s.step('③ 말해 보기 — 두 기준으로 나누는 표', '삼각형 가~사를 알맞은 칸에 기호로 쓰기')
    figk(s, cards(T2S_SEVEN, 36, per=4, ticks=True, angs=True, gap=40), .15)
    s.table(TWO_TABLE, header_col=True, row_h=2600)
    s.ask('표를 보고 알게 된 점을 써 보세요.', blank=False)
    if not ch:
        s.text('‘~삼각형에도 예각삼각형, 직각삼각형, 둔각삼각형이 모두 있어요.’ 꼴로 써요.')
    s.lines(1)
    s.page_break()
    s.step('④ 확인하기 — 민우의 말 고치기')
    mp = Iso(4, 120, 0)
    figk(s, tri(mp, 40, lens=[None, '4 cm', '4 cm'], angs=['30°', None, None], ticks=True), .14)
    s.text('두 변이 4 cm로 같은 이등변삼각형 깃발에서, 길이가 같은 두 변 중 한 변과 나머지 변 사이의 각이 30°예요. 민우는 “한 각이 30°로 예각이니까 예각삼각형이야.”라고 했어요.')
    if ch:
        s.ask('이 깃발의 세 각을 구해 보세요.   (      )°, (      )°, (      )°', blank=False)
        s.ask('민우의 말을 바르게 고쳐 써 보세요.', blank=False)
        s.lines(1)
    else:
        s.choices([('이 깃발의 세 각은?', CH('30°, 30°, %d°' % third(30, 30), '30°, 75°, 75°')),
                   ('민우의 말을 바르게 고치면?', CH('한 각이 둔각이니까 둔각삼각형이야', '두 각이 예각이니까 예각삼각형이야'))])
    assert degs(mp) == [30, 30, 120]
    ans = '7차시  ① 정삼각형, 예각삼각형 / 왜: (예) 하준이는 변의 길이를, 서연이는 각의 크기를 기준으로 나누었기 때문이에요   ② %s   ③ %s / (예) 이등변삼각형에도, 세 변의 길이가 모두 다른 삼각형에도 예각·직각·둔각삼각형이 모두 있어요   ④ 30°, 30°, %d° / 한 각이 둔각이니까 둔각삼각형이야' % (
        ' / '.join('%s %s' % (KO[i], names2(p)) for i, p in enumerate(T2S_HOME)), two_table(T2S_SEVEN), third(30, 30))
    if ch:
        s.step('⑤ 도전하기', '1 cm 모눈종이에 두 변의 길이가 같은 둔각삼각형을 그려 보세요')
        cm_fig(s, sq_grid(9, 4, UCM), UCM)
        ans += '   ⑤ (그리기 예) 위 꼭짓점에서 왼쪽 아래로 3칸·1칸, 오른쪽 아래로 3칸·1칸'
    return ans


def st8(s, ch):
    s.lesson(8, '탐구 정리하기(O)', '왜 텐트 뼈대는 삼각형일까 ― 구조물 속 삼각형', '텐트 뼈대와 다리, 지붕에는 왜 삼각형을 많이 쓸까요? 그 삼각형의 이름은 무엇일까요?')
    s.step('① 만져 보기 — 뼈대 밀어 보기', '예린이가 막대로 만든 텐트 뼈대')
    figk(s, rigid_fig(), .11)
    if not ch:
        s.choices([('밀어도 모양이 그대로인 뼈대는?', CH('사각형 뼈대', '삼각형 뼈대'))])
    s.ask('왜 그럴까요? 텐트 뼈대에 삼각형을 쓰는 까닭을 써 보세요.', blank=False)
    if not ch:
        s.text('‘왜냐하면 삼각형은 옆에서 밀어도 ~ 튼튼한 모양이기 때문이에요.’ 꼴로 써요.')
    s.lines(1)
    s.step('② 말해 보기 — 캠프장 구조물의 삼각형')
    figk(s, cards([p for p, _ in T2S_STR], 30, per=3, ticks=True, angs=True, labels=[n for _, n in T2S_STR], gap=60, fs=20), .15)
    s.table([['구조물', '가', '나', '다', '라', '마', '바'], ['알맞은 이름\n(모두)', '', '', '', '', '', '']], row_h=3600)
    if not ch:
        s.text('도움: 세 변의 길이가 모두 다르면 각의 크기에 따른 이름만 써요.')
    s.page_break()
    s.step('③ 약속하기 — 삼각형 나누기 정리')
    if ch:
        s.fill(['변의 길이에 따라 이등변삼각형, 정삼각형, %s으로 나눌 수 있어요. 각의 크기에 따라 %s으로 나눌 수 있어요.' % (B, B),
                '이등변삼각형은 길이가 같은 두 변에 있는 두 각의 크기가 같고, 정삼각형은 세 각이 모두 %s예요. 삼각형은 옆에서 밀어도 모양이 %s 구조물에 많이 써요.' % (B, B)])
    else:
        s.fill(['변의 길이에 따라 이등변삼각형, 정삼각형, %s으로 나눌 수 있어요.' % CH('세 변의 길이가 모두 다른 삼각형', '직각삼각형'),
                '각의 크기에 따라 %s으로 나눌 수 있어요.' % CH('예각삼각형, 직각삼각형, 둔각삼각형', '이등변삼각형, 정삼각형'),
                '정삼각형은 세 각이 모두 %s예요. 삼각형은 옆에서 밀어도 모양이 %s 구조물에 많이 써요.' % (CH('60°', '90°'), CH('바뀌지 않아', '쉽게 바뀌어'))])
    s.step('④ 확인하기 — 내가 찾은 삼각형')
    s.ask('학교나 집 둘레의 물건·구조물에서 삼각형을 하나 찾아 두 가지 기준으로 이름을 붙이고, 까닭도 써 보세요.', blank=False)
    if not ch:
        s.text('‘~에서 찾은 삼각형은 ~이므로 ~삼각형이고, ~이므로 ~삼각형이에요.’ 꼴로 써요. (그네 지지대, 옷걸이, 지붕, 정글짐 등)')
    s.lines(3)
    ans = '8차시  ① %s(예) 삼각형은 옆에서 밀어도 모양이 바뀌지 않는 튼튼한 모양이어서 바람이 불어도 잘 버티기 때문이에요   ② %s   ③ 세 변의 길이가 모두 다른 삼각형, 예각삼각형·직각삼각형·둔각삼각형, 60°, 바뀌지 않아   ④ (예) 그네 지지대에서 찾은 삼각형은 두 변의 길이가 같아 보이므로 이등변삼각형이고, 세 각이 모두 직각보다 작아 보이므로 예각삼각형이에요' % (
        '' if ch else '삼각형 뼈대 / ', ' / '.join('%s %s' % (n[0], names2(p)) for p, n in T2S_STR))
    if ch:
        s.step('⑤ 도전하기', '두 가지 기준을 함께 생각해요')
        s.text('㉠ 정삼각형이면서 둔각삼각형   ㉡ 이등변삼각형이면서 직각삼각형   ㉢ 세 변의 길이가 모두 다르면서 둔각삼각형')
        s.ask('그릴 수 없는 삼각형을 찾고, 그 까닭을 써 보세요.', blank=False)
        s.lines(1)
        ans += '   ⑤ ㉠ (정삼각형의 세 각은 모두 60°라서 둔각이 있을 수 없어요)'
    return ans


def st9(s, ch):
    s.lesson(9, '발표하기(P)', '캠프 놀이 ― 삼각형 분류 이어달리기', '삼각형 카드를 두 가지 기준으로 빠르고 정확하게 나누려면 어떻게 해야 할까요?')
    s.scene(None, '캠프 날 운동장에서 삼각형 분류 이어달리기를 해요. 카드마다 왼쪽 바구니(각의 크기) 하나, 오른쪽 바구니(변의 길이) 하나를 골라요. 잘못 넣으면 한 장당 5초가 더해져요.')
    s.step('① 만져 보기 — 연습 한 판')
    figk(s, cards(T2S_RELAY4, 40, ticks=True, angs=True, gap=50), .15)
    s.table([REL_HEAD] + [[KO[i], '', ''] for i in range(4)], row_h=2300)
    s.step('② 말해 보기 — 우리 모둠 작전')
    if ch:
        s.ask('기록을 가장 줄일 수 있는 방법을 써 보세요.', blank=False)
        s.lines(1)
    else:
        s.choices([('기록을 가장 줄일 수 있는 방법은?', CH('세 변과 세 각을 꼼꼼히 보고 정확하게 나눈다', '예각이 보이면 무조건 예각삼각형 바구니에 넣는다'))])
    s.ask('우리 모둠의 작전을 써 보세요.', blank=False)
    if not ch:
        s.text('‘카드를 받으면 먼저 ~을 보고, 그다음 ~을 봐요.’ 꼴로 써요.')
    s.lines(1)
    s.page_break()
    s.step('③ 확인하기 — 본 경기 8장', '벌점 없이 마치면 통과예요')
    figk(s, cards(T2S_RELAY8, 32, per=4, ticks=True, angs=True, gap=40), .15)
    s.table([REL_HEAD] + [[KO[i], '', ''] for i in range(8)], row_h=1900)
    s.page_break()
    s.step('④ 발표하기 — 주사위 카드 놀이', '다은이가 만든 놀이')
    s.text(DIE_TXT)
    figk(s, cards(T2S_DICE, 34, per=6, ticks=True, angs=True, gap=36), .15)
    s.table([['카드'] + list(KO[:6]), ['낼 수 있는 눈'] + [''] * 6], row_h=2400)
    if not ch:
        s.text('도움: 눈 1(이등변삼각형)에는 정삼각형 카드도 낼 수 있어요. 카드마다 눈이 두 개 이상이에요.')
    ans = '9차시  ① %s   ② 세 변과 세 각을 꼼꼼히 보고 정확하게 나눈다 / (예) 카드를 받으면 먼저 가장 큰 각이 예각·직각·둔각 중 무엇인지 보고, 그다음 길이가 같은 변이 몇 개인지 세어 두 바구니를 정해요   ③ %s   ④ %s' % (
        relay_ans(T2S_RELAY4), relay_ans(T2S_RELAY8), ', '.join('%s %s' % (KO[i], '·'.join(map(str, dice_faces(p)))) for i, p in enumerate(T2S_DICE)))
    if ch:
        s.step('⑤ 도전하기', '세 각이 45°, 45°, 90°이고 직각을 낀 두 변의 길이가 같은 카드')
        s.ask('왼쪽(각의 크기) 바구니 (                )   오른쪽(변의 길이) 바구니 (                )', blank=False)
        ans += '   ⑤ %s, %s' % relay(Iso(3, 90))
    return ans


def st10(s, ch):
    s.lesson(10, '발표하기(P)', '우리 반 텐트촌 삼각형 발표회', '캠프를 준비하며 알게 된 삼각형 이야기를 친구들에게 어떻게 소개할까요?')
    stm = [('정삼각형은 세 각의 크기가 모두 60°예요.', True), ('이등변삼각형은 세 각의 크기가 모두 같아요.', False), ('한 각이 직각인 삼각형은 둔각삼각형이에요.', False),
           ('세 각이 모두 예각인 삼각형은 예각삼각형이에요.', True), ('둔각삼각형에는 둔각이 두 개 있을 수 있어요.', False), ('두 각의 크기가 같은 삼각형은 이등변삼각형이에요.', True)]
    s.step('① 만져 보기 — 보물 상자 길 찾기', '설명이 옳으면 오른쪽(→), 옳지 않으면 아래(↓)로')
    for i, (q, t) in enumerate(stm):
        s.text('%d. %s' % (i + 1, q))
    figk(s, path_fig(len(stm)), .1)
    s.ask('도착한 보물 상자의 번호는?')
    box = sum(1 for _, t in stm if not t) + 1
    s.page_break()
    s.step('② 그려 보기 — □ 안에 알맞은 수', '왼쪽은 이등변삼각형 깃발, 오른쪽은 정삼각형 표지판')
    fl = Iso(10, 50, 0)
    assert cmtxt(info(fl)['L'][0]) == '8 cm 5 mm' and degs(fl)[0] == 65
    figk(s, two_fig(fl, SSS(7, 7, 7, 0), dict(lens=['8 cm 5 mm', '10 cm', '□ cm'], angs=['65°', '□°', None], ticks=True),
                    dict(lens=['7 cm', '□ cm', None], angs=[None, None, '□°']), U=20), .17)
    s.ask('깃발: □ = (     ) cm, □ = (     )°    표지판: □ = (     ) cm, □ = (     )°', blank=False)
    s.step('③ 말해 보기 — 친구의 말 살피기', '정삼각형 표지판을 보고')
    s.text('다은: “한 각이 예각이니까 예각삼각형이야.”   지호: “세 변의 길이가 같으니까 정삼각형이야.”')
    s.ask('까닭을 잘못 말한 사람은 누구인가요?')
    s.ask('왜 그럴까요? 다은이의 말을 바르게 고쳐 써 보세요.', blank=False)
    if not ch:
        s.text('‘~이 모두 ~이니까 예각삼각형이야.’ 꼴로 써요.')
    s.lines(1)
    s.step('④ 확인하기 — 우리 반 텐트촌 발표', '1차시 ‘궁금해요’를 다시 보고')
    s.ask('우리 반 텐트촌에서 삼각형 하나를 골라 소개해 보세요.', blank=False)
    if not ch:
        s.text('‘~은 ~이므로 ~삼각형이고, ~이므로 ~삼각형이에요. 그래서 ~해요.’ 꼴로 써요.')
    s.lines(2)
    s.ask('1차시에 궁금했던 것 하나에 답해 보세요.', blank=False)
    if not ch:
        s.text('‘~이 궁금했는데, ~라는 것을 알게 되었어요.’ 꼴로 써요.')
    s.lines(2)
    ans = '10차시  ① %s → %d번 상자   ② 10 cm, 65°, 7 cm, 60°   ③ 다은 / 세 각이 모두 예각(60°)이니까 예각삼각형이야   ④ (예) 우리 모둠 텐트 앞판은 세 변의 길이가 같으므로 정삼각형이고, 세 각이 모두 60°로 예각이므로 예각삼각형이에요 / 왜 텐트 뼈대가 삼각형인지 궁금했는데, 삼각형은 옆에서 밀어도 모양이 바뀌지 않는 튼튼한 모양이라는 것을 알게 되었어요' % (
        ''.join('○' if t else '×' for _, t in stm), box)
    if ch:
        s.page_break()
        s.step('⑤ 도전하기', '유클리드처럼 자와 컴퍼스로 정삼각형 그리기')
        s.text('점 ㄱ과 점 ㄴ을 각각 중심으로 하고 반지름이 선분 ㄱㄴ(5 cm)인 원을 그려, 두 원이 만나는 점과 ㄱ, ㄴ을 이어 보세요.')
        cm_fig(s, euclid_fig(), UCM)
        s.ask('이렇게 그린 삼각형이 정삼각형인 까닭을 써 보세요.', blank=False)
        s.lines(1)
        ans += '   ⑤ 세 변이 모두 원의 반지름(5 cm)과 같아서 세 변의 길이가 같아요'
    return ans


# ================================================================ 만들기
TB = [tb1, tb2, tb3, tb4, tb5, tb6, tb7, tb8, tb9]
ST = [st1, st2, st3, st4, st5, st6, st7, st8, st9, st10]
NOTE_FIG = '※ 삼각형 그림은 적힌 길이·각도의 비율 그대로 그렸고, ‘실제 크기’라고 적은 그림과 1 cm 모눈은 자로 재면 그 길이가 나와요. A4 원본 크기(100%)로 인쇄하세요.'


def build(ver, lvl):
    vname = '교과서 차시' if ver == 'tb' else '이야기 버전'
    s = S(unit_label='4-2 수학 2. 삼각형(%s)' % vname, level=LV[lvl], grade_label='4학년')
    ch = lvl == 'chal'
    keys = [f(s, ch) for f in (TB if ver == 'tb' else ST)]
    keys.append(NOTE_FIG)
    s.answers('【교사용】 2. 삼각형(%s) 활동지 정답 (%s)' % (vname, LV[lvl]), keys,
              note='※ 이 활동지는 앱 u2-triangle.html과 차시 번호가 같습니다.')
    out = os.path.join(OUT_TB if ver == 'tb' else OUT_ST, '2단원_삼각형_활동지_%s.hwpx' % LV[lvl])
    os.makedirs(os.path.dirname(out), exist_ok=True)
    s.save(out)
    return out, s.warn


if __name__ == '__main__':
    bad = False
    for ver in ('tb', 'st'):
        for lvl in ('basic', 'chal'):
            out, warn = build(ver, lvl)
            probs = check(out)
            print(('OK ' if not probs else 'FAIL ') + out)
            for w in warn:
                print('   [쪽] ' + w)
            for p in probs:
                print('   ' + p)
                bad = True
    sys.exit(1 if bad else 0)
