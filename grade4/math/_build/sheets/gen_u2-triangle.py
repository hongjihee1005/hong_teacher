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


def cards(ps, U=40, per=None, gap=36, vgap=30, **kw):
    """삼각형 여러 개에 가·나·다… 이름표(kw는 tri에 그대로, 리스트면 삼각형마다)."""
    cs = []
    for i, p in enumerate(ps):
        o = {k: (v[i] if isinstance(v, list) and k in ('lens', 'angs', 'names') and v and isinstance(v[0], (list, type(None))) else v)
             for k, v in kw.items()}
        o.setdefault('label', KO[i])
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
