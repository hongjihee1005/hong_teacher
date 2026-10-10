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
        angs = [None if abs(a - 90) < .05 else '%d°' % b for a, b in zip(I['A'], degs(p))]
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
        if png_path:
            self._pic(png_path, width_mm or 100)
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
