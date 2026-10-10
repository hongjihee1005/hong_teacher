# -*- coding: utf-8 -*-
"""4-1 수학 2. 각도 활동지(HWPX) 만들기 — 교과서 차시 버전·이야기 버전 × 기본형·도전형

    python3 gen_u2-angle.py

앱 원본: grade4/math/_build/units/u2-angle.tb.js(교과서 차시) · u2-angle.st.js(이야기 버전)
차시 번호·제목·S.O.O.P.·탐구 질문·이야기·수는 앱과 같습니다.
그림의 각은 모두 적힌 각도 그대로(수학 방향: 오른쪽 0°, 시계 반대 방향으로 커짐) 계산해 그립니다.
지도(9차시)·놀이판(10차시)은 한 칸이 실제 1 cm가 되게 넣습니다.
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
OUT_TB = os.path.join(ROOT, 'sem1', 'sheets')
OUT_ST = os.path.join(ROOT, 'sem1-soop', 'sheets')
TMP = os.environ.get('U2_CACHE') or tempfile.mkdtemp(prefix='u2angle_')
os.makedirs(TMP, exist_ok=True)
FONT = "'Noto Sans KR','WenQuanYi Zen Hei',sans-serif"
INK, TENT, BLUE, RED, GRAY = '#1D2A2A', '#E47A38', '#2B6FB8', '#C8472E', '#8795A1'
FILLS = ['rgba(228,122,56,.30)', 'rgba(43,123,214,.26)', 'rgba(46,139,87,.28)', 'rgba(142,91,201,.26)']
COLS = ['#E47A38', '#2B7BD6', '#2E8B57', '#8E5BC9']
KO = '가나다라마바사아자차'


# ================================================================ 그림 도구
def F(v):
    return ('%.2f' % v).rstrip('0').rstrip('.')


def rad(d):
    return d * math.pi / 180


def pt(V, deg, r):
    """수학 방향 각도 deg로 r만큼 간 점(화면 좌표, y 아래)."""
    return (V[0] + r * math.cos(rad(deg)), V[1] - r * math.sin(rad(deg)))


def ndeg(d):
    return d % 360


def dirto(V, P):
    return ndeg(math.degrees(math.atan2(-(P[1] - V[1]), P[0] - V[0])))


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

    def ellipse(self, P, rx, ry, fill, col='none', sw=0):
        return self.add('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="%s" stroke="%s" stroke-width="%s"/>'
                        % (F(P[0]), F(P[1]), F(rx), F(ry), fill, col, F(sw)), [(P[0] - rx, P[1] - ry), (P[0] + rx, P[1] + ry)])

    def rect(self, x, y, w, h, fill, col='none', sw=0, rx=0):
        return self.add('<rect x="%s" y="%s" width="%s" height="%s" rx="%s" fill="%s" stroke="%s" stroke-width="%s"/>'
                        % (F(x), F(y), F(w), F(h), F(rx), fill, col, F(sw)), [(x, y), (x + w, y + h)])

    def path(self, d, fill='none', col=INK, sw=3, pts=(), dash=None):
        ds = ' stroke-dasharray="%s"' % dash if dash else ''
        return self.add('<path d="%s" fill="%s" stroke="%s" stroke-width="%s" stroke-linejoin="round"%s/>' % (d, fill, col, F(sw), ds), pts)

    def arc(self, V, d1, d2, r, col=TENT, sw=3):
        s, e = pt(V, d1, r), pt(V, d2, r)
        large = 1 if d2 - d1 > 180 else 0
        pts = [pt(V, d1 + (d2 - d1) * t / 8, r) for t in range(9)]
        return self.path('M%s,%s A%s,%s 0 %d 0 %s,%s' % (F(s[0]), F(s[1]), F(r), F(r), large, F(e[0]), F(e[1])),
                         col=col, sw=sw, pts=pts)

    def wedge(self, V, d1, d2, r, fill, col='none', sw=0):
        pts = [V] + [pt(V, d1 + (d2 - d1) * t / 12, r) for t in range(13)]
        if d2 - d1 >= 359.99:
            return self.circle(V, r, fill=fill, col=col, sw=sw)
        s, e = pt(V, d1, r), pt(V, d2, r)
        large = 1 if d2 - d1 > 180 else 0
        return self.path('M%s,%s L%s,%s A%s,%s 0 %d 0 %s,%s Z' % (F(V[0]), F(V[1]), F(s[0]), F(s[1]), F(r), F(r), large, F(e[0]), F(e[1])),
                         fill=fill, col=col, sw=sw, pts=pts)

    def text(self, x, y, s, fs=22, fill=INK, anchor='middle', bold=False, rot=None):
        w = fs * 0.95 * len(s)
        tr = ' transform="rotate(%s %s %s)"' % (F(rot), F(x), F(y)) if rot is not None else ''
        x0 = x - w / 2 if anchor == 'middle' else (x - w if anchor == 'end' else x)
        return self.add('<text x="%s" y="%s" font-size="%s" fill="%s" text-anchor="%s" dominant-baseline="central"%s%s>%s</text>'
                        % (F(x), F(y), F(fs), fill, anchor, ' font-weight="700"' if bold else '', tr,
                           s.replace('&', '&amp;').replace('<', '&lt;')),
                        [(x0, y - fs * .6), (x0 + w, y + fs * .6)])

    def right(self, V, d1, s=22, col=TENT, sw=3):
        p1, p3 = pt(V, d1, s), pt(V, d1 + 90, s)
        p2 = (p1[0] + p3[0] - V[0], p1[1] + p3[1] - V[1])
        return self.poly([p1, p2, p3], col=col, sw=sw, closed=False)

    def put(self, other, dx, dy):
        """다른 캔버스를 (dx, dy)만큼 옮겨 넣기."""
        self.items.append('<g transform="translate(%s,%s)">%s</g>' % (F(dx), F(dy), ''.join(other.items)))
        self.see((other.x0 + dx, other.y0 + dy), (other.x1 + dx, other.y1 + dy))
        return self

    def frame(self, pad=14, col='#C9D4CF'):
        """지금 테두리 상자에 둥근 테두리(카드) 두르기."""
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
    """캔버스 여러 개를 가로로 나란히."""
    out, x = C(), 0
    hmax = max(c.y1 - c.y0 for c in cs)
    for c in cs:
        h = c.y1 - c.y0
        dy = -c.y0 + ((hmax - h) / 2 if valign == 'middle' else 0)
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


# ---------------------------------------------------------------- 각
def angle(c, V, d1, a, L=200, L2=None, col=INK, sw=5, arc=None, fill='rgba(228,122,56,.18)', deg=False, text=None,
          names=None, right=False, dash1=False, dash2=False, fs=24, dot=True, arcol=TENT):
    L2 = L2 or L
    d2 = d1 + a
    r = arc if arc is not None else max(22, min(48, min(L, L2) * .3))
    if fill and arc is not False and a < 359:
        c.wedge(V, d1, d2, r, fill)
    if right and a == 90:
        c.right(V, d1, min(r * .62, 26))
    elif arc is not False:
        c.arc(V, d1, d2, r, col=arcol)
    P1, P2 = pt(V, d1, L), pt(V, d2, L2)
    if dash1:
        c.line(V, P1, GRAY, max(3, sw * .6), '12 8')
    else:
        c.line(V, P1, col, sw)
    if dash2:
        c.line(V, P2, GRAY, max(3, sw * .6), '12 8')
    else:
        c.line(V, P2, col, sw)
    if dot:
        c.circle(V, sw * .9, fill=col)
    if deg or text:
        q = pt(V, d1 + a / 2, r + fs * 1.1)
        c.text(q[0], q[1], text or '%d°' % a, fs)
    if names:
        off = fs * 1.05
        n2, n1, nv = pt(P2, d2, off * .8), pt(P1, d1, off * .8), pt(V, d1 + a / 2 + 180, off)
        if names[0]:
            c.text(n2[0], n2[1], names[0], fs)
        if names[1]:
            c.text(nv[0], nv[1], names[1], fs)
        if names[2]:
            c.text(n1[0], n1[1], names[2], fs)
    return c


def fit(d1, a, W, H, pad=26, k2=1.0, maxL=1e9):
    pts = [(0, 0), pt((0, 0), d1, 1), pt((0, 0), d1 + a, k2)] + [pt((0, 0), d1 + t, .3) for t in range(0, int(a) + 1, 10)]
    xs, ys = [p[0] for p in pts], [p[1] for p in pts]
    bw, bh = max(xs) - min(xs), max(ys) - min(ys)
    L = min(maxL, (W - 2 * pad) / max(bw, .25), (H - 2 * pad) / max(bh, .25))
    V = (pad + (W - 2 * pad - bw * L) / 2 - min(xs) * L, pad + (H - 2 * pad - bh * L) / 2 - min(ys) * L)
    return V, L


def cards(items, cw=220, ch=170, per=None, label=True):
    """카드 여러 장(가·나·다…). item: {a, d1, L2r, maxL, label, draw(c, W, H)}"""
    per = per or len(items)
    out = C()
    for i, it in enumerate(items):
        x, y = (i % per) * (cw + 14), (i // per) * (ch + 14)
        k = C()
        k.rect(0, 0, cw, ch, '#fff', '#C9D4CF', 2, 12)
        if 'draw' in it:
            it['draw'](k, cw, ch)
        else:
            V, L = fit(it.get('d1', 0), it['a'], cw, ch, it.get('pad', 30), it.get('L2r', 1), it.get('maxL', 1e9))
            angle(k, V, it.get('d1', 0), it['a'], L, L * it.get('L2r', 1), sw=5, fs=22, right=it.get('right', False))
        if label and it.get('label', True) is not False:
            k.text(20, 20, it.get('label') or KO[i], 22, bold=True)
        out.put(k, x, y)
    return out


def single(a, d1=0, L=220, L2=None, label=None, **kw):
    c = C()
    angle(c, (0, 0), d1, a, L, L2, **kw)
    if label:
        c.text(c.x0 - 10, c.y0 + 4, label, 26, RED, bold=True)
    return c


# ---------------------------------------------------------------- 각도기
def protractor(c, Cn, rot=0, R=210):
    def P(d, r):
        return pt(Cn, d + rot, r)
    # 아래 띠(밑금 아래 18)까지 포함한 몸통
    b1, b2 = pt(P(180, R), rot - 90, 18), pt(P(0, R), rot - 90, 18)
    c.poly([P(t, R) for t in range(0, 181, 2)] + [b1, b2], fill='rgba(170,210,245,.40)', col='#1D4E80', sw=2)
    c.path('M%s,%s A%s,%s 0 0 0 %s,%s' % (F(P(0, R * .36)[0]), F(P(0, R * .36)[1]), F(R * .36), F(R * .36),
                                         F(P(180, R * .36)[0]), F(P(180, R * .36)[1])), col='#1D4E80', sw=1.2)
    ring = R - 62
    for t in range(181):
        ln = 17 if t % 10 == 0 else (11 if t % 5 == 0 else 6)
        c.line(P(t, R), P(t, R - ln), '#1D4E80', 1.6 if t % 10 == 0 else 1, cap='butt')
        if t % 5 == 0:
            c.line(P(t, ring), P(t, ring - (9 if t % 10 == 0 else 5)), '#1D4E80', 1, cap='butt')
    c.path('M%s,%s A%s,%s 0 0 0 %s,%s' % (F(P(0, ring)[0]), F(P(0, ring)[1]), F(ring), F(ring), F(P(180, ring)[0]), F(P(180, ring)[1])),
           col='#1D4E80', sw=1)
    fs = round(R * .072)
    for t in range(0, 181, 10):
        tl = max(3.5, min(176.5, t))
        po, pi = P(tl, R - 29), P(tl, R - 47)
        c.text(po[0], po[1], str(180 - t), fs, '#1D2A2A', rot=90 - t - rot)
        c.text(pi[0], pi[1], str(t), fs * .9, BLUE, rot=90 - t - rot)
    c.line(P(180, R - 2), P(0, R - 2), '#1D4E80', 2, cap='butt')
    c.circle(Cn, 5, fill='#fff', col=RED, sw=2.5)
    return c


def protfig(a, d1=0, Coff=(0, 0), rot=None, label=None, L=250):
    c = C()
    V = (0, 0)
    angle(c, V, d1, a, L, sw=5, arc=False, fill=None)
    protractor(c, (V[0] + Coff[0], V[1] + Coff[1]), d1 if rot is None else rot)
    if label:
        c.text(c.x0 + 4, c.y0 + 10, label, 28, RED, bold=True)
    return c


# ---------------------------------------------------------------- 다각형
def polygon(angles, lens, th0=0):
    """각 꼭짓점의 각(angles)과 앞 변 길이(lens, n-2개)로 다각형 꼭짓점(화면 좌표) 만들기 — 앱 a2Poly와 같은 방법."""
    n = len(angles)
    th = [th0]
    for k in range(1, n):
        th.append(th[k - 1] + 180 - angles[k])
    u = [(math.cos(rad(t)), math.sin(rad(t))) for t in th]
    sx = sum(lens[k] * u[k][0] for k in range(n - 2))
    sy = sum(lens[k] * u[k][1] for k in range(n - 2))
    a, b = u[n - 2], u[n - 1]
    det = a[0] * b[1] - a[1] * b[0]
    La = (-sx * b[1] + sy * b[0]) / det
    Lb = (-a[0] * sy + a[1] * sx) / det
    Ls = list(lens[:n - 2]) + [La, Lb]
    P = [(0.0, 0.0)]
    for k in range(n - 1):
        P.append((P[k][0] + Ls[k] * u[k][0], P[k][1] + Ls[k] * u[k][1]))
    return [(x, -y) for x, y in P]


def corners(pts):
    n = len(pts)
    out = []
    for i, V in enumerate(pts):
        Pp, Q = pts[(i - 1) % n], pts[(i + 1) % n]
        dp, dq = dirto(V, Pp), dirto(V, Q)
        u = (Pp[0] - V[0], Pp[1] - V[1])
        w = (Q[0] - V[0], Q[1] - V[1])
        cosv = (u[0] * w[0] + u[1] * w[1]) / (math.hypot(*u) * math.hypot(*w))
        a = math.degrees(math.acos(max(-1, min(1, cosv))))
        s = dp if abs(ndeg(dq - dp) - a) < .5 else dq
        out.append((V, s, a))
    return out


def polyfig(angles, lens, marks=None, size=300, fill='#fff', r=34, fs=24, wedges=False, diag=False, sw=4):
    pts = polygon(angles, lens)
    xs, ys = [p[0] for p in pts], [p[1] for p in pts]
    sc = size / max(max(xs) - min(xs), max(ys) - min(ys))
    pts = [((x - min(xs)) * sc, (y - min(ys)) * sc) for x, y in pts]
    c = C()
    c.poly(pts, fill=fill, sw=sw)
    cs = corners(pts)
    for (V, s, a), want in zip(cs, angles):
        assert abs(a - want) < .01, (a, want)
    if wedges:
        for i, (V, s, a) in enumerate(cs):
            c.wedge(V, s, s + a, r * 1.5, FILLS[i % 4], COLS[i % 4], 2)
    if diag:
        c.line(pts[0], pts[2], RED, 3, '10 7')
    for i, (V, s, a) in enumerate(cs):
        m = (marks or [None] * len(pts))[i]
        if m is None or m is False:
            continue
        if m == 'R':
            c.right(V, s, 20)
            continue
        c.arc(V, s, s + a, r)
        q = pt(V, s + a / 2, r + fs * (1.6 if a < 50 else 1.05))
        c.text(q[0], q[1], str(m), fs)
    return c, pts


def fan(parts, full=180, R=150, line=True, fs=24):
    """잘라 붙인 각: parts = [(a, 글)…] 차례로 이어 붙임."""
    c = C()
    T = (0, 0)
    s0 = 0
    for i, (a, t) in enumerate(parts):
        c.wedge(T, s0, s0 + a, R, FILLS[i % 4], COLS[i % 4], 3)
        q = pt(T, s0 + a / 2, R * .68)
        c.text(q[0], q[1], t, fs)
        s0 += a
    if line and full == 180:
        c.line((-R - 40, 0), (R + 40, 0), RED, 3, '10 6')
    c.circle(T, 5)
    return c


# ---------------------------------------------------------------- 시계
def clock(hh=None, mm=0, R=150):
    c = C()
    O = (0, 0)
    c.circle(O, R, fill='#fff', col=INK, sw=5)
    for i in range(60):
        a = 90 - i * 6
        c.line(pt(O, a, R - 5), pt(O, a, R - (10 if i % 5 else 18)), INK, 2 if i % 5 else 4, cap='butt')
    for i in range(1, 13):
        q = pt(O, 90 - i * 30, R - 36)
        c.text(q[0], q[1], str(i), R * .16)
    if hh is not None:
        hA, mA = 90 - ((hh % 12) * 30 + mm * .5), 90 - mm * 6
        d = ndeg(hA - mA)
        s, e = (mA, d) if d <= 180 else (hA, 360 - d)
        if e > .1:
            c.wedge(O, s, s + e, R * .42, 'rgba(228,122,56,.35)', TENT, 2)
        c.line(O, pt(O, mA, R * .78), BLUE, 7)
        c.line(O, pt(O, hA, R * .52), INK, 11)
    c.circle(O, 8)
    return c


def clock_angle(hh, mm):
    hA, mA = (hh % 12) * 30 + mm * .5, mm * 6
    d = abs(hA - mA) % 360
    return min(d, 360 - d)


def kind(a):
    return '예각' if 0 < a < 90 else ('직각' if a == 90 else ('둔각' if 90 < a < 180 else '그 밖의 각'))


# ---------------------------------------------------------------- 거북·로봇 지도(1 cm 격자)
def walk(start, dirs_dists):
    p, out = start, [start]
    for d, r in dirs_dists:
        p = pt(p, d, r)
        out.append(p)
    return out


def mapJ():
    S, J = (1, 6), (5, 6)
    A, B, Cc = pt(J, 60, 3), pt(J, -30, 3), pt(J, 30, 3)
    lib, main, cafe, tap, gym = pt(A, 30, 2), pt(A, 90, 2), pt(B, -60, 2), pt(B, 0, 2), pt(Cc, 0, 2)
    return dict(w=13, h=10.6, start=S, sdir=0,
                roads=[[S, J], [J, A, lib], [A, main], [J, B, cafe], [B, tap], [J, Cc, gym]],
                places=[('도서관', (lib[0] + .9, lib[1] - .55), (1.9, .9), '#FFF6D9'), ('본관', (main[0], main[1] - .6), (2.4, .9), '#FFF6D9'),
                        ('급식실', (cafe[0] + .4, cafe[1] + .55), (1.9, .9), '#FFF6D9'), ('수돗가', (tap[0] + 1.1, tap[1]), (1.9, .9), '#FFF6D9'),
                        ('운동장', (gym[0] + 1.3, gym[1]), (2.4, 1.1), '#F3D2AE'), ('교문', (S[0], S[1] - 1), (1.4, .8), '#E6EEF8'),
                        ('주차장', (2, 9.2), (2.6, 1.2), '#EDEDED')],
                trees=[(1, 1), (2.2, 1.6), (12.3, 1), (3.5, 3.4), (12.4, 9.8)], ends=dict(도서관=lib, 급식실=cafe, 수돗가=tap))


def mapY():
    T, P1, P2, P3 = (14, 1), (14, 3), (5, 3), (5, 8)
    K = pt(P3, -30, 3)
    G = pt(K, 0, 4)
    return dict(w=16, h=11.2, start=T, sdir=-90,
                roads=[[T, P1, P2, P3, K, G], [P2, (2, 3)], [P3, (5, 10.4)], [P3, (8, 8)], [P1, (14, 6)]],
                places=[('급식실', (K[0], K[1] + .75), (1.8, .9), '#FFF6D9'), ('강당', (G[0] + .2, G[1] + .75), (1.8, .9), '#FFF6D9'),
                        ('교문', (T[0] + 1.1, T[1]), (1.4, .8), '#E6EEF8'), ('주차장', (1.4, 1.9), (2.2, .9), '#EDEDED'),
                        ('텃밭', (5, 10.6), (1.6, .8), '#D6EBC8'), ('수돗가', (9.1, 8), (1.9, .9), '#FFF6D9'),
                        ('경비실', (14, 6.7), (1.8, .9), '#FFF6D9'), ('본관', (9, 1.4), (3.2, 1.2), '#FFE8D2')],
                oval=(9.5, 5.5, 3.2, 1.6, '운동장'), trees=[(2.3, 6), (3, 9), (15.3, 9.5), (12, 10.4)], ends=dict(급식실=K, 강당=G))


def mapPark():
    S, J = (1, 6), (5, 6)
    A, B = pt(J, 50, 3), pt(J, -40, 3)
    swing, slide, sand, saw, jungle = pt(A, 0, 3), pt(A, 110, 2), pt(B, 0, 3), pt(B, -110, 2), pt(J, 0, 4)
    return dict(w=13, h=11.2, start=S, sdir=0,
                roads=[[S, J], [J, A, swing], [A, slide], [J, B, sand], [B, saw], [J, jungle]],
                places=[('미끄럼틀', (slide[0] - .4, slide[1] - .75), (2.2, .9), '#FDE3C8'), ('그네', (swing[0] + 1, swing[1]), (1.6, .9), '#DCEAFB'),
                        ('정글짐', (jungle[0] + 1.25, jungle[1]), (2, .9), '#E8DDF5'), ('모래밭', (sand[0] + 1.25, sand[1]), (2, .9), '#F3D9AE'),
                        ('시소', (saw[0] - 1.3, saw[1] + .2), (1.6, .9), '#FFF6D9'), ('입구', (S[0], S[1] - 1), (1.4, .8), '#E6EEF8'),
                        ('화단', (2.2, 9.6), (2.6, 1.2), '#D6EBC8')],
                trees=[(1, 1.2), (2.4, 2), (11.8, 1.2), (12.2, 10.3), (3.6, 3.6), (10.6, 10.4)],
                ends=dict(그네=swing, 미끄럼틀=slide, 모래밭=sand, 시소=saw, 정글짐=jungle))


def run_cmds(m, cmds):
    """cmds: [(회전, 거리)] 회전은 왼쪽 +, 오른쪽 − (도). 도착점 이름 돌려줌."""
    p, d = m['start'], m['sdir']
    for turn, dist in cmds:
        d += turn
        p = pt(p, d, dist)
    for n, e in m['ends'].items():
        if math.hypot(p[0] - e[0], p[1] - e[1]) < 1e-6:
            return n
    return None


def mapfig(m, U=50):
    c = C()
    W, H = m['w'] * U, m['h'] * U
    c.rect(0, 0, W, H, '#EEF6E6')
    for x in range(int(m['w']) + 1):
        c.line((x * U, 0), (x * U, H), '#D3E2C6', 1, cap='butt')
    for y in range(int(m['h']) + 1):
        c.line((0, y * U), (W, y * U), '#D3E2C6', 1, cap='butt')
    if 'oval' in m:
        x, y, rx, ry, n = m['oval']
        c.ellipse((x * U, y * U), rx * U, ry * U, '#E9B98A', '#C98E5A', 3)
        c.text(x * U, y * U, n, 20)
    for t in m.get('trees', []):
        c.circle((t[0] * U, t[1] * U), .35 * U, fill='#8CC084', col='#5E9A55', sw=2)
    for r in m['roads']:
        c.poly([(p[0] * U, p[1] * U) for p in r], col='#D9D2C3', sw=.55 * U, closed=False)
    for r in m['roads']:
        c.poly([(p[0] * U, p[1] * U) for p in r], col='#fff', sw=2, dash='6 6', closed=False)
    for n, at, box, fill in m['places']:
        x, y = at[0] - box[0] / 2, at[1] - box[1] / 2
        c.rect(x * U, y * U, box[0] * U, box[1] * U, fill, '#9C8A62', 2, 8)
        c.text(at[0] * U, at[1] * U, n, min(20, U * .45))
    S = (m['start'][0] * U, m['start'][1] * U)
    # 출발 거북(화살표)
    c.circle(S, 9, fill='#2E8B57')
    a1 = pt(S, m['sdir'], .35 * U)
    a2 = pt(S, m['sdir'], 1.0 * U)
    c.line(a1, a2, RED, 4)
    h1, h2 = pt(a2, m['sdir'] + 150, 12), pt(a2, m['sdir'] - 150, 12)
    c.poly([a2, h1, h2], fill=RED, col=RED, sw=1)
    return c


def turnfig(came_from, a, d_new, label_from):
    """회전한 각 확대 그림: came_from(지나온 길이 놓인 방향), 늘인 보조선, 새 길(d_new)."""
    c = C()
    V = (0, 0)
    c.line(pt(V, came_from, 170), V, RED, 5)
    q = pt(V, came_from, 110)
    c.text(q[0], q[1] - 26, label_from, 18, RED)
    ext = ndeg(came_from + 180)
    d_new = ndeg(d_new)
    c.line(V, pt(V, ext, 170), GRAY, 3, '12 8')
    c.line(V, pt(V, d_new, 170), RED, 5)
    lo, hi = min(ext, d_new), max(ext, d_new)
    if hi - lo > 180:
        lo, hi = hi, lo + 360
    c.wedge(V, lo, hi, 60, 'rgba(228,122,56,.2)')
    c.arc(V, lo, hi, 60)
    q = pt(V, (lo + hi) / 2, 92)
    c.text(q[0], q[1], '?', 26, RED, bold=True)
    c.circle(V, 6)
    assert abs((hi - lo) - a) < 1e-6
    return c


# ---------------------------------------------------------------- 점 놀이판(1 cm)
def dots(c, xs, ys, U):
    for x in xs:
        for y in ys:
            c.circle((x * U, y * U), 3.5, fill='#9AA6A0')


def dice_board(U=50, small=False):
    c = C()
    if small:
        dots(c, range(1, 9), range(1, 6), U)
        c.line((1 * U, 1 * U), (1 * U, 3 * U), RED, 6)
        c.text(1 * U + 46, 1 * U - 18, '출발 변', 18, RED)
        return c
    dots(c, range(1, 13), range(1, 10), U)
    c.line((1 * U, 1 * U), (1 * U, 3 * U), RED, 6)
    c.text(1 * U + 46, 1 * U - 18, '출발 변', 18, RED)
    c.line((12 * U, 6 * U), (12 * U, 9 * U), RED, 6)
    c.text(12 * U - 10, 6 * U - 22, '도착 변', 18, RED)
    return c


def side_kind(P, Q, N):
    u = (Q[0] - P[0], Q[1] - P[1])
    v = (N[0] - P[0], N[1] - P[1])
    cr, dt = u[0] * v[1] - u[1] * v[0], u[0] * v[0] + u[1] * v[1]
    if cr == 0:
        return '0°' if dt > 0 else '180°'
    return '예각' if dt > 0 else ('둔각' if dt < 0 else '직각')


def cand_fig(cands, ys, U=50, xs=range(1, 9)):
    """앞의 변 (2,3)→(5,3), 꼭짓점 (5,3)에서 그은 새 변 후보."""
    c = C()
    dots(c, xs, ys, U)
    sh = lambda q: (q[0] * U, q[1] * U)
    P = sh((5, 3))
    c.line(sh((2, 3)), P, BLUE, 5)
    c.text(*sh((3.5, 3.45)), '앞의 변', 18, BLUE)
    for n, q, o in cands:
        Q = sh(q)
        c.line(P, Q, RED, 3.5, '9 5')
        c.text(Q[0] + o[0], Q[1] + o[1], n, 22, RED, bold=True)
    c.circle(P, 8, fill=TENT)
    return c


def drawable(cands, need):
    ok = []
    for n, q, o in cands:
        k = side_kind((5, 3), (2, 3), q)
        ln = math.hypot(q[0] - 5, q[1] - 3)
        if k == need and ln <= 3 + 1e-9:
            ok.append(n)
    return ok


# ---------------------------------------------------------------- 장면
def scene_tb():
    c = C()
    c.rect(0, 0, 900, 440, '#F4FAF0')
    c.rect(0, 395, 900, 45, '#D8EBC8')
    # 가 기린 모양 의자
    c.line((60, 340), (180, 340), '#C9A27A', 14)
    c.line((60, 340), (42, 200), '#E8C25A', 14)
    c.line((75, 340), (75, 392), '#C9A27A', 8)
    c.line((170, 340), (170, 392), '#C9A27A', 8)
    c.ellipse((46, 180), 24, 15, '#E8C25A')
    c.circle((54, 176), 3)
    # 나 책 모양 오두막
    c.poly([(232, 392), (335, 215), (438, 392)], fill='#A9CBEF', col='#2B6FB8', sw=5)
    c.rect(315, 330, 40, 62, '#F6E3C6', '#9C8A62', 3)
    # 다 구름
    for x, y, r in [(490, 95, 30), (530, 78, 38), (575, 96, 30)]:
        c.circle((x, y), r, fill='#fff', col='#C9D4CF', sw=3)
    # 라 미끄럼틀
    c.line((510, 392), (560, 245), '#8E5BC9', 8)
    c.line((560, 245), (620, 245), '#8E5BC9', 10)
    c.line((620, 245), (750, 392), '#E47A38', 12)
    c.line((620, 245), (620, 392), '#8E5BC9', 7)
    # 마 해, 바 공
    c.circle((825, 75), 42, fill='#FFD966', col='#E4B33C', sw=4)
    c.circle((820, 367), 27, fill='#F28B82', col=RED, sw=3)
    for t, x, y in [('가', 110, 160), ('나', 335, 190), ('다', 530, 25), ('라', 650, 215), ('마', 760, 75), ('바', 775, 345)]:
        c.circle((x, y), 17, fill='#fff', col=RED, sw=2.5)
        c.text(x, y, t, 20, RED, bold=True)
    return c


def slide(c, V, th, L, colr='#E8A25A', deg=False):
    T = pt(V, 180 - th, L)
    c.line((V[0] - L * math.cos(rad(th)) - 60, V[1]), (V[0] + 50, V[1]), '#9DBF86', 6)
    c.line((T[0] - 40, T[1]), (T[0] - 40, V[1]), GRAY, 7)
    c.line((T[0] - 8, T[1]), (T[0] - 8, V[1]), GRAY, 7)
    y = T[1] + 30
    while y < V[1] - 8:
        c.line((T[0] - 40, y), (T[0] - 8, y), GRAY, 4)
        y += 32
    c.line((T[0] - 46, T[1]), (T[0] + 2, T[1]), '#6E7C86', 9)
    c.line(V, T, colr, 13)
    c.wedge(V, 180 - th, 180, 54, 'rgba(43,123,214,.18)', BLUE, 2.5)
    if deg:
        q = pt(V, 180 - th / 2, 80)
        c.text(q[0], q[1], '%d°' % th, 22, BLUE)
    return c


def scene_st():
    c = C()
    c.rect(0, 0, 900, 440, '#F2F8FC')
    c.rect(0, 392, 900, 48, '#D8EBC8')
    slide(c, (205, 392), 40, 190)                               # 가 미끄럼틀
    c.line((325, 165), (258, 392), BLUE, 9)                     # 나 그네
    c.line((325, 165), (392, 392), BLUE, 9)
    c.line((325, 170), (325, 330), GRAY, 3)
    c.rect(305, 330, 40, 10, TENT, rx=3)
    c.ellipse((530, 214), 64, 32, 'none', '#F28B82', 8)          # 다 훌라후프
    c.poly([(512, 392), (548, 392), (530, 357)], fill='#8E5BC9', col='#8E5BC9', sw=1)   # 라 시소
    c.line((447, 337), (613, 376), '#E4B33C', 10)
    x0, y0, sz = 642, 222, 46                                   # 마 정글짐
    for i in range(4):
        c.line((x0 + i * sz, y0), (x0 + i * sz, 392), '#2E8B57', 6)
    for j in range(4):
        c.line((x0, y0 + j * sz * .92), (x0 + 3 * sz, y0 + j * sz * .92), '#2E8B57', 6)
    c.circle((834, 72), 40, fill='#FFD966', col='#E4B33C', sw=4)  # 바 해
    c.path('M806,392 Q848,322 892,392 Z', fill='#F3D9AE', col='#C9A27A', sw=3, pts=[(806, 330), (892, 392)])  # 사 모래 언덕
    for t, x, y in [('가', 60, 200), ('나', 325, 135), ('다', 530, 160), ('라', 470, 300), ('마', 760, 200), ('바', 770, 60), ('사', 848, 300)]:
        c.circle((x, y), 17, fill='#fff', col=RED, sw=2.5)
        c.text(x, y, t, 20, RED, bold=True)
    return c


# ---------------------------------------------------------------- 그 밖의 그림
def units_fig(angles, tools):
    """직각을 n칸으로 똑같이 나눈 눈금 위에 각 놓기."""
    panels = []
    for name, n in tools:
        ps = []
        for a, lab in angles:
            c = C()
            V, R = (0, 0), 180
            step = 90 / n
            for k in range(n):
                c.wedge(V, k * step, (k + 1) * step, R, 'rgba(170,210,245,.40)' if k % 2 else 'rgba(170,210,245,.15)', '#1D4E80', 1.5)
            angle(c, V, 0, a, R + 40, arc=False, fill=None)
            c.text(R + 50, -14, lab, 26, bold=True)
            ps.append(c)
        r = row(ps, 50)
        t = C().text(0, 0, name + '  (직각을 똑같이 %d칸으로 나눔)' % n, 22, BLUE, anchor='start', bold=True)
        panels.append(col([t, r], 10))
    return col(panels, 24)


def join_fig(mode, a, b):
    """mode sum: 가(a)에 나(b)를 이어 붙임 / diff: 가(a) 위에 나(b)를 겹침."""
    R = 170
    p1 = C()
    angle(p1, (0, 0), 0, a, R, fill=FILLS[0], arc=48)
    q = pt((0, 0), a / 2, 48 + 26 if a >= 40 else R + 34)
    p1.text(q[0], q[1], '%d°' % a, 22)
    p1.text(p1.x0 - 6, p1.y0, '가', 26, RED, bold=True)
    p2 = C()
    angle(p2, (0, 0), 0, b, R, fill=FILLS[1], arc=48, col=BLUE)
    q = pt((0, 0), b / 2, 48 + 26 if b >= 40 else R + 34)
    p2.text(q[0], q[1], '%d°' % b, 22)
    p2.text(p2.x0 - 6, p2.y0, '나', 26, RED, bold=True)
    p3 = C()
    V = (0, 0)
    if mode == 'sum':
        p3.wedge(V, 0, a, R, FILLS[0], COLS[0], 2)
        p3.wedge(V, a, a + b, R, FILLS[1], COLS[1], 2)
        p3.line(V, pt(V, 0, R + 30), INK, 5)
        p3.line(V, pt(V, a + b, R + 30), INK, 5)
        p3.arc(V, 0, a + b, 70, RED, 4)
        q = pt(V, (a + b) / 2, 104)
        p3.text(q[0], q[1], '다', 26, RED, bold=True)
    else:
        p3.wedge(V, 0, a, R, FILLS[0], COLS[0], 2)
        p3.wedge(V, 0, b, R * .92, FILLS[1], COLS[1], 2)
        p3.line(V, pt(V, 0, R + 30), INK, 5)
        p3.line(V, pt(V, a, R + 30), INK, 5)
        p3.arc(V, b, a, 80, RED, 4)
        q = pt(V, (a + b) / 2, 114)
        p3.text(q[0], q[1], '다', 26, RED, bold=True)
    p3.circle(V, 5)
    t3 = C().text(0, 0, '이어 붙인 모양' if mode == 'sum' else '겹친 모양', 20, GRAY)
    return row([p1, p2, col([p3, t3], 6)], 50)


def pinwheel_fig():
    ps = []
    cl = ['#F6C9A8', '#A9CBEF', '#B8DFC4', '#D5C1EE']
    for n in range(1, 5):
        c = C()
        O, S = (0, 0), 70
        for i in range(n):
            p1, p3 = pt(O, 90 * i, S), pt(O, 90 * i + 90, S)
            p2 = (p1[0] + p3[0], p1[1] + p3[1])
            c.poly([O, p1, p2, p3], fill=cl[i], sw=2.5)
        if n < 4:
            c.arc(O, 0, 90 * n, 22, RED, 3)
        else:
            c.circle(O, 22, fill='none', col=RED, sw=3)
        c.circle(O, 4)
        c.see((-S, -S), (S, S))
        lab = C().text(0, 0, '%d장' % n, 22, bold=True)
        ps.append(col([c, lab], 8))
    return row(ps, 40)


def straight_board():
    """예각·둔각을 그릴 선분 두 개(왼쪽 끝이 꼭짓점)."""
    ps = []
    for t in ['예각', '둔각']:
        c = C()
        c.line((0, 0), (220, 0), INK, 5)
        c.circle((0, 0), 6)
        c.see((-60, -200), (240, 30))
        c.text(-40, -180, t, 24, RED, bold=True)
        ps.append(c)
    return row(ps, 70)


def tower_fig(tilt=5):
    c = C()
    V = (0, 0)
    c.rect(-160, 0, 320, 40, '#D8EBC8')
    L = 300
    d = 90 + tilt
    P = pt(V, d, L)
    w = 34
    nx, ny = math.cos(rad(d + 90)) * w, -math.sin(rad(d + 90)) * w
    c.poly([(V[0] + nx, V[1] + ny), (P[0] + nx, P[1] + ny), (P[0] - nx, P[1] - ny), (V[0] - nx, V[1] - ny)], fill='#F4EEDF', col='#9C8A62', sw=3)
    for t in range(1, 7):
        q = pt(V, d, L * t / 7)
        c.line((q[0] + nx, q[1] + ny), (q[0] - nx, q[1] - ny), '#B9A880', 2)
    c.line(V, pt(V, 90, L + 90), BLUE, 3, '10 7')
    c.line(V, pt(V, d, L + 90), RED, 3)
    c.arc(V, 90, d, L + 70, RED, 3)
    q = pt(V, 90 + tilt / 2, L + 100)
    c.text(q[0], q[1], '%d°' % tilt, 24, RED, bold=True)
    return c


def house_fig():
    c, pts = polyfig([70, 70, 40], [1], None, size=320, fill='#CFE2F7', sw=5)
    # 문
    m = ((pts[0][0] + pts[1][0]) / 2, pts[0][1])
    c.rect(m[0] - 22, m[1] - 64, 44, 64, '#F6E3C6', '#9C8A62', 3)
    c.text(pts[2][0] + 34, pts[2][1] + 10, '가', 28, RED, bold=True)
    c.text(pts[1][0] + 26, pts[1][1] - 30, '나', 28, RED, bold=True)
    return c


def leaf_fig(d1, a, colr, label):
    c = C()
    V = (0, 0)
    P1, P2, cc = pt(V, d1, 150), pt(V, d1 + a, 150), pt(V, d1 + a / 2, 420)
    c.path('M0,0 L%s,%s Q%s,%s %s,%s Z' % (F(P1[0]), F(P1[1]), F(cc[0]), F(cc[1]), F(P2[0]), F(P2[1])),
           fill=colr, col='#4F8A43', sw=3, pts=[P1, P2, pt(V, d1 + a / 2, 260)])
    m = pt(V, d1 + a / 2, 250)
    c.line(V, m, '#4F8A43', 3)
    c.line(V, pt(V, d1, 210), '#2F6B57', 4)
    c.line(V, pt(V, d1 + a, 210), '#2F6B57', 4)
    c.arc(V, d1, d1 + a, 40)
    c.circle(V, 5)
    c.text(c.x0 + 10, c.y0 - 16, label, 24, bold=True)
    return c


def situp_fig():
    c = C()
    V = (0, 0)
    T = pt(V, 30, 300)
    c.rect(-160, 0, 560, 50, '#EDE6DA')
    c.line(V, T, '#6E4A2A', 22)
    c.line((T[0] - 20, T[1] + 10), (T[0] - 20, 0), GRAY, 10)
    c.line((T[0] - 80, T[1] + 38), (T[0] - 80, 0), GRAY, 8)
    c.line((-150, 0), (390, 0), INK, 3)
    c.arc(V, 0, 30, 70, RED, 3)
    q = pt(V, 15, 100)
    c.text(q[0] + 10, q[1], '?', 26, RED, bold=True)
    return c


def straw_fig():
    c = C()
    V = (0, 0)
    c.line((-260, 0), (260, 0), BLUE, 6)
    c.line(V, pt(V, 130, 220), '#E4B33C', 12)
    c.arc(V, 0, 130, 50)
    c.circle(V, 9, fill=RED)
    return c


def forward_fig():
    c = C()
    P = (300, 160)
    c.line((100, 160), P, BLUE, 5)
    c.circle(P, 8, fill=TENT)
    c.line(P, pt(P, 20, 150), RED, 5, '10 6')
    c.text(200, 136, '앞의 변', 20, BLUE)
    c.text(440, 92, '새 변?', 20, RED)
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
        cw = pt_ * .3528 * .98
        n = max(1, math.ceil(len(t) * cw / per_mm))
        return n * pt_ * .3528 * 1.6

    def _bump(self, mm):
        self.est += mm
        self.log = getattr(self, 'log', []) + [(sys._getframe(1).f_code.co_name, round(mm))]
        if self.est > self.BODY:
            self.warn.append('%s: 쪽 넘침 어림 %.0fmm %s' % (self.cur, self.est, self.log if os.environ.get('U2_DEBUG') else ''))
            self.est = mm
            self.log = []

    def lesson(self, no, soop, title, question, grade_label=None):
        super().lesson(no, soop, title, question, grade_label)
        self.cur = '%s차시' % no
        self.est = 0
        self.log = []
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
        self.log = []

    def answers(self, title, lines, note=None):
        super().answers(title, lines, note)


def pic(s, c, mm, pad=12):
    s.picture(png(c, pad), width_mm=mm)


def mm_for(c, k, pad=12, cap=178):
    w, _ = c.size(pad)
    return min(cap, w * k)


def figk(s, c, k=.16, pad=12, cap=178):
    """k: 1 그림 단위가 몇 mm인지(같은 k면 같은 크기)."""
    s.picture(png(c, pad), width_mm=mm_for(c, k * .85, pad, cap))


def cm_fig(s, c, U, pad=12):
    """U 단위 = 1 cm 실제 크기로 넣기."""
    w, _ = c.size(pad)
    mmw = w / U * 10
    assert mmw <= 180.5, mmw
    s.picture(png(c, pad, px=1800), width_mm=mmw)


# ================================================================ 공통 낱말
def CH(*o):
    return '( ' + ' / '.join(o) + ' )'


B = '(      )'
LV = {'basic': '기본형', 'chal': '도전형'}


def deg_sum(*v):
    return sum(v)


# ================================================================ 교과서 차시 버전
def tb1(s, ch):
    s.lesson(1, '개념 찾기(S)', '단원 도입 ― 숲 놀이터가 문을 열었어요', '숲 놀이터를 만들 때 지안이와 친구들은 각을 어떻게 이용했을까요?')
    s.scene(png(scene_tb()), '지안이와 친구들이 상상 속 숲 놀이터를 만들었어요.', width_mm=100)
    s.step('① 만져 보기', '피사의 사탑은 5°쯤 기울어졌어요')
    s.picture(png(tower_fig(5)), width_mm=32)
    s.text('땅이 단단하지 않아서 탑이 똑바로 선 방향(파란 점선)에서 5°만큼 기울어졌어요.')
    if ch:
        s.ask('탑이 기울어진 정도는 무엇으로 나타낼 수 있을까요?')
    else:
        s.choices([('탑이 기울어진 정도는 무엇으로 나타낼까요?', CH('각의 크기', '탑의 높이'))])
    s.step('② 그려 보기', '숲 놀이터에서 각 찾기')
    s.text('가 기린 모양 의자 · 나 책 모양 오두막 · 다 구름 · 라 미끄럼틀 · 마 해 · 바 공')
    s.ask('위 그림에서 각을 볼 수 있는 것을 모두 찾아 기호를 써 보세요.')
    if not ch:
        s.text('도움: 곧은 선 두 개가 한 점에서 만나는 곳을 찾아요. 동그란 모양에는 각이 없어요.')
    s.page_break()
    s.step('③ 떠올리기', '3학년 때 배운 각과 직각')
    def curve(k, W, H):
        k.path('M60,%s Q90,60 %s,50 M60,%s Q150,%s %s,%s' % (H - 40, W - 40, H - 40, H - 40, W - 30, H - 70), sw=5)
        k.circle((60, H - 40), 5)
    def apart(k, W, H):
        k.line((40, H - 40), (W - 40, H - 40))
        k.line((70, H - 60), (W - 50, 50))
    figk(s, cards([{'d1': 10, 'a': 55}, {'draw': curve}, {'draw': apart}, {'d1': 200, 'a': 110}], 200, 150), .2)
    s.ask('각을 모두 찾아 기호를 써 보세요.')
    figk(s, cards([{'d1': 30, 'a': 60}, {'d1': 15, 'a': 90}, {'d1': 0, 'a': 120}], 200, 150), .18)
    if ch:
        s.ask('직각을 찾아 기호를 써 보세요.')
    else:
        s.choices([('직각은 어느 것인가요? (삼각자의 직각을 대 봐요)', CH('가', '나', '다'))])
    s.step('④ 약속하기', '각, 꼭짓점, 변, 직각')
    if not ch:
        s.wordbox(['각', '꼭짓점', '변', '직각'])
    s.fill(['한 점에서 그은 두 반직선으로 이루어진 도형을 %s이라고 해요.' % B,
            '그 점을 각의 %s, 두 반직선을 각의 %s이라고 해요.' % (B, B),
            '종이를 반듯하게 두 번 접었을 때 생기는 각을 %s이라고 해요.' % B])
    s.step('⑤ 확인하기', '주변의 각과 배우고 싶은 것')
    s.ask('우리 주변에서 각을 볼 수 있는 곳을 두 가지 써 보세요.', blank=False)
    if not ch:
        s.text('예) 운동장 철봉, 계단, 집게')
    s.lines(1)
    s.ask('각에 대해 무엇이 궁금한가요? 배우고 싶은 것을 써 보세요.', blank=False)
    s.lines(1 if not ch else 2)
    ans = '1차시  ① %s   ② 가, 나, 라(기린 모양 의자, 책 모양 오두막, 미끄럼틀)   ③ 각: 가, 라(나는 굽은 선, 다는 한 점에서 만나지 않음) / 직각: 나   ④ 각, 꼭짓점, 변, 직각   ⑤ (예) 철봉, 계단 / 각의 크기를 어떻게 잴까?' % ('각의 크기')
    if ch:
        s.step('⑥ 도전하기', '한 점에서 그은 반직선 3개')
        c = C()
        for d in [0, 50, 120]:
            c.line((0, 0), pt((0, 0), d, 230))
        c.circle((0, 0), 6)
        figk(s, c, .2)
        s.ask('그림에서 찾을 수 있는 각은 모두 몇 개인가요?')
        s.ask('어떻게 세었는지 써 보세요.', blank=False)
        s.lines(1)
        ans += '   ⑥ 3개(작은 각 2개 + 두 각을 합친 큰 각 1개)'
    return ans


def tb2(s, ch):
    s.lesson(2, '개념 구축하기(O)', '각의 크기를 비교해 볼까요', '두 각 중에서 어느 각이 더 클까요? 어떻게 비교할 수 있을까요?')
    s.scene(None, '지안이와 은호가 만든 동물 모양 의자예요. 등받이와 앉는 곳이 이루는 각을 비교해요.')
    s.step('① 만져 보기', '가를 투명 종이에 본떠 나에 겹쳐 보기')
    pa, pb = C(), C()
    angle(pa, (0, 0), 5, 98, 200, 170, arc=40)
    pa.text(pa.x0, pa.y1 + 36, '가 코끼리 모양 의자', 22, RED, anchor='start', bold=True)
    angle(pb, (0, 0), -12, 92, 290, 250, arc=40)
    pb.text(pb.x0, pb.y1 + 36, '나 기린 모양 의자', 22, RED, anchor='start', bold=True)
    figk(s, row([pa, pb], 70), .15)
    if ch:
        s.ask('각의 크기가 더 큰 것은 어느 것인가요?')
        s.ask('나의 변이 더 긴데도 나가 더 크지 않은 까닭을 써 보세요.', blank=False)
        s.lines(1)
    else:
        s.text('꼭짓점과 한 변을 맞추어 겹친 다음, 나머지 한 변이 더 많이 벌어진 쪽을 찾아요.')
        s.choices([('각의 크기가 더 큰 것은?', CH('가', '나')), ('변이 더 길면 각도 더 클까요?', CH('예', '아니요'))])
    s.step('② 그려 보기', '눈금으로 재기 — 두 변 사이의 칸 수 세기')
    figk(s, units_fig([(45, '가'), (90, '나')], [('도하의 눈금', 4), ('유주의 눈금', 6)]), .1)
    s.table([['', '가', '나'], ['도하의 눈금', '(    )칸', '(    )칸'], ['유주의 눈금', '(    )칸', '(    )칸']])
    s.page_break()
    s.step('③ 말해 보기', '센 칸 수로 비교하기')
    if ch:
        s.fill(['나는 가보다 도하의 눈금으로 %s칸만큼, 유주의 눈금으로 %s칸만큼 더 커요.' % (B, B)])
        s.ask('같은 각인데 눈금에 따라 칸 수가 달라지는 까닭과, 각의 크기를 알려 주려면 어떻게 해야 하는지 써 보세요.', blank=False)
        s.lines(2)
    else:
        s.fill(['나는 가보다 도하의 눈금으로 %s칸만큼, 유주의 눈금으로 %s칸만큼 더 커요.' % (CH('2', '4', '6'), CH('2', '3', '6')),
                '같은 각이라도 눈금에 따라 눈금의 수가 %s.' % CH('달라져요', '같아요'),
                '각의 크기를 알려 주려면 모두 %s로 재야 해요.' % CH('같은 도구', '서로 다른 도구')])
    s.step('④ 약속하기', '각의 크기')
    if not ch:
        s.wordbox(['벌어진 정도', '변하지 않아요'])
    s.fill(['각의 크기는 각의 두 변이 %s예요.' % B, '변의 길이가 길어져도 각의 크기는 %s.' % B])
    s.step('⑤ 확인하기', '각의 크기 비교하기')
    c1 = cards([{'d1': 45, 'a': 90}, {'d1': 30, 'a': 120, 'L2r': .6}], 190, 150)
    c2 = cards([{'d1': 10, 'a': 70}, {'d1': 80, 'a': 25, 'L2r': 1.2}, {'d1': 200, 'a': 125, 'L2r': .7}], 190, 150)
    figk(s, row([c1, c2], 60), .2)
    s.ask('(왼쪽) 각의 크기가 더 작은 각은?')
    s.ask('(오른쪽) 각의 크기가 큰 것부터 차례로 기호를 써 보세요.')
    figk(s, cards([{'d1': 0, 'a': 65, 'label': '보기'}, {'d1': 30, 'a': 40, 'L2r': 1.3}, {'d1': 120, 'a': 80, 'L2r': .6},
                   {'d1': 0, 'a': 110}, {'d1': 250, 'a': 55}], 180, 140), .245)
    s.ask('보기의 각보다 작은 각을 모두 찾아 기호를 써 보세요.')
    ans = '2차시  ① 가   ② 도하 가 2칸·나 4칸 / 유주 가 3칸·나 6칸   ③ 2, 3, 달라져요, 같은 도구   ④ 벌어진 정도, 변하지 않아요   ⑤ 가 / 다, 가, 나 / 가, 라'
    if ch:
        ans = ans.replace('① 가', '① 가 (예) 각의 크기는 변의 길이와 상관없이 두 변이 벌어진 정도이기 때문이에요.')
        ans = ans.replace('③ 2, 3, 달라져요, 같은 도구', '③ 2, 3 / (예) 눈금 한 칸의 크기가 달라서 칸 수가 달라져요. 모두 같은 도구(단위)로 재야 해요.')
        s.step('⑥ 도전하기', '익힘 문제')
        figk(s, cards([{'d1': 20, 'a': 35, 'L2r': 1}, {'d1': 10, 'a': 75, 'L2r': .45, 'maxL': 120}], 190, 150), .2)
        s.ask('두 각 중 크기가 더 큰 각과 그 까닭을 써 보세요.', blank=False)
        s.lines(1)
        s.ask('직각을 똑같이 나눈 눈금으로 재었더니 가는 5칸, 나는 3칸이었어요. 가는 나보다 몇 칸만큼 더 큰가요?')
        ans += '   ⑥ 나(두 변이 더 많이 벌어져 있어서) / 2칸'
    return ans


def tb3(s, ch):
    s.lesson(3, '개념 구축하기(O)', '각의 크기를 재어 볼까요', '각의 크기를 어떻게 나타내고, 각도기로 어떻게 잴까요?')
    s.scene(None, '지안이가 그린 오르막길 그림이에요. 오르막길이 바닥과 이루는 각을 재어 봐요.')
    s.step('① 만져 보기', '각도기로 각 ㄱㄴㄷ 재기')
    c = C()
    V = (0, 0)
    for t in range(1, 5):
        q = pt(V, 60, t * 50)
        c.line(q, (q[0], q[1] - 34), '#C9A27A', 4)
    angle(c, V, 0, 60, 250, names=['ㄱ', 'ㄴ', 'ㄷ'], arc=30, fs=24)
    figk(s, c, .2)
    if not ch:
        s.text('각도기의 중심을 꼭짓점 ㄴ에, 밑금을 변 ㄴㄷ에 맞추고, 변 ㄴㄷ이 0인 쪽(안쪽) 눈금을 읽어요.')
    s.ask('각 ㄱㄴㄷ의 크기는 몇 도인가요?')
    s.step('② 그려 보기', '각도기로 각도 재기 (②는 각도기가 놓여 있어요)')
    a1 = single(50, 0, 190, label='①', arc=30)
    a3 = single(70, 0, 190, label='③', arc=30)
    a2 = protfig(125, 25, label='②', L=230)
    figk(s, row([a1, a2, a3], 40), .125)
    s.ask('①       °      ②       °      ③       °', blank=False)
    s.page_break()
    s.step('③ 말해 보기', '각도기를 바르게 쓰는 방법')
    pf = [protfig(50, 0, (45, 0), 0, '가'), protfig(50, 0, (0, 0), 0, '나'), protfig(50, 0, (0, 0), 14, '다')]
    figk(s, row(pf, 30), .115)
    if ch:
        s.ask('바르게 놓은 것과, 나머지가 틀린 까닭은?')
        s.lines(1)
    else:
        s.choices([('각도기를 바르게 놓은 것은?', CH('가', '나', '다'))])
    s.picture(png(protfig(40)), width_mm=62)
    if ch:
        s.ask('이 각의 크기는 몇 도인가요?')
        s.ask('각의 변이 짧아 각도기 눈금에 닿지 않을 때는 어떻게 할까요?', blank=False)
        s.lines(1)
    else:
        s.choices([('이 각의 크기는?', CH('40°', '140°')), ('변이 짧아 눈금에 닿지 않으면?', CH('자로 변을 늘여 재요', '잴 수 없어요'))])
    s.step('④ 약속하기', '1도(1°)')
    if not ch:
        s.wordbox(['각도', '90', '1°', '90°'])
    s.fill(['각의 크기를 %s라고 해요.' % B, '직각의 크기를 똑같이 %s으로 나눈 것 중 하나를 1도라 하고, %s라고 써요.' % (B, B),
            '직각의 크기는 %s예요.' % B])
    s.step('⑤ 확인하기', '여러 가지 모양의 각 재기')
    b4 = single(150, 195, 180, label='④', arc=30)
    b5 = single(115, 200, 190, label='⑤', arc=30)
    b6 = single(85, 50, 75, label='⑥', arc=22)
    figk(s, row([b4, b5, b6], 40), .135)
    s.ask('④       °      ⑤       °      ⑥       °', blank=False)
    if not ch:
        s.text('⑥은 변이 짧아요. 자로 변을 곧게 늘인 다음 재어요.')
    ans = '3차시  ① 60°   ② ① 50° ② 125° ③ 70°   ③ 나 / 40° / 자로 변을 곧게 늘여서 재요   ④ 각도, 90, 1°, 90°   ⑤ ④ 150° ⑤ 115° ⑥ 85°'
    if ch:
        ans = ans.replace('③ 나 /', '③ 나 (가는 중심이 꼭짓점에서 벗어남, 다는 밑금이 한 변에 맞지 않음) /')
        s.step('⑥ 도전하기', '물건에서 볼 수 있는 각도 재기')
        items = [('가위', 45, '#6E7C86'), ('스탠드', 90, '#8E5BC9'), ('부채', 135, '#B4610F'), ('펼친 책', 180, BLUE)]
        ps = []
        for n, a, cc in items:
            k = C()
            if n == '부채':
                k.wedge((0, 0), 0, 135, 150, '#FDE3C8', '#E47A38', 2)
                for t in range(15, 135, 15):
                    k.line((0, 0), pt((0, 0), t, 150), '#E4B48A', 2)
            angle(k, (0, 0), 0, a, 160, col=cc, arc=False, fill=None)
            k.text(k.x0 + 30, k.y0 - 20, n, 22, bold=True)
            ps.append(k)
        figk(s, row(ps, 40), .125)
        s.ask('가위 (    )°  스탠드 (    )°  부채 (    )°  펼친 책 (    )°', blank=False)
        s.ask('네 각도에서 찾을 수 있는 규칙을 써 보세요.', blank=False)
        s.lines(1)
        ans += '   ⑥ 45°, 90°, 135°, 180° / 45°씩 커져요'
    return ans


def tb4(s, ch):
    s.lesson(4, '개념 구축하기(O)', '직각보다 작은 각과 큰 각을 알아볼까요', '각을 직각과 비교하면 어떻게 나눌 수 있을까요?')
    s.scene(None, '지안이와 친구들이 그린 놀이기구에서 찾은 각이에요.')
    s.step('① 만져 보기', '직각과 비교해 나누기 (삼각자의 직각을 대 봐요)')
    its = [('가 철봉', 0, 90, 1), ('나 미끄럼판', 145, 35, 1), ('다 미끄럼틀 위', 225, 105, 1), ('라 미끄럼틀 계단', 20, 125, .7), ('마 시소', 0, 20, 1.2)]
    figk(s, cards([{'d1': d, 'a': a, 'L2r': r, 'label': n} for n, d, a, r in its], 175, 145), .17)
    s.table([['직각보다 작은 각', '직각', '직각보다 큰 각'], ['', '', '']], row_h=3400)
    s.step('② 그려 보기', '주어진 선분을 한 변으로 예각과 둔각 그리기')
    figk(s, straight_board(), .17)
    if not ch:
        s.text('예각은 직각보다 덜, 둔각은 직각보다 더 벌려 그려요. 두 변이 일직선이 되면 둔각이 아니에요.')
    s.page_break()
    s.step('③ 말해 보기', '시계의 두 바늘이 이루는 작은 쪽의 각')
    if ch:
        figk(s, row([col([clock(), C().text(0, 0, '4시 30분', 24, bold=True)], 10), col([clock(), C().text(0, 0, '8시', 24, bold=True)], 10)], 70), .14)
        s.text('시계에 바늘을 그려 넣고, 두 바늘이 이루는 작은 쪽의 각이 예각인지 둔각인지 써 보세요.')
    else:
        figk(s, row([col([clock(4, 30), C().text(0, 0, '4시 30분', 24, bold=True)], 10), col([clock(8, 0), C().text(0, 0, '8시', 24, bold=True)], 10)], 70), .14)
        s.text('보기: 3시는 직각이에요. 주황색으로 칠한 작은 쪽의 각을 직각과 비교해요.')
    s.table([['시각', '4시 30분', '8시'], ['예각 / 둔각', '', '']])
    s.step('④ 약속하기', '예각과 둔각')
    if not ch:
        s.wordbox(['예각', '둔각', '180°'])
    s.fill(['각도가 0°보다 크고 직각보다 작은 각을 %s이라고 해요.' % B,
            '각도가 직각보다 크고 %s보다 작은 각을 %s이라고 해요.' % (B, B)])
    s.step('⑤ 확인하기', '예각과 둔각 구별하기')
    figk(s, cards([{'d1': 50, 'a': 130}, {'d1': 160, 'a': 40}, {'d1': 215, 'a': 110}], 190, 150), .21)
    s.ask('둔각을 모두 찾아 기호를 써 보세요.')
    s.text('25°     130°     85°     90°     115°')
    s.ask('예각:                둔각:              ', blank=False)
    if not ch:
        s.text('도움: 90°는 예각도 둔각도 아니에요.')
    ans = '4차시  ① 직각보다 작은 각: 나, 마 / 직각: 가 / 직각보다 큰 각: 다, 라   ② 직각보다 작게 벌린 각과 직각보다 크고 일직선보다 작게 벌린 각(여러 가지)   ③ 4시 30분 예각(45°), 8시 둔각(120°)   ④ 예각, 180°, 둔각   ⑤ 가, 다 / 예각 25°, 85° · 둔각 130°, 115°'
    if ch:
        s.step('⑥ 도전하기', '반직선 4개로 만든 그림과 시계')
        c = C()
        for d in [0, 40, 150, 180]:
            c.line((0, 0), pt((0, 0), d, 240))
        c.circle((0, 0), 6)
        cl = row([col([clock(), C().text(0, 0, '7시', 22, bold=True)], 8), col([clock(), C().text(0, 0, '3시 30분', 22, bold=True)], 8)], 30)
        figk(s, row([c, cl], 50), .12)
        s.ask('왼쪽 그림: 둔각 (    )개, 예각 (    )개', blank=False)
        s.ask('7시, 3시 30분을 그리고 예각·둔각을 써 보세요.', blank=False)
        s.lines(1)
        ans += '   ⑥ 둔각 3개(150°, 110°, 140°), 예각 2개(40°, 30°) — 180°는 둔각이 아님 / 7시 둔각(150°), 3시 30분 예각(75°)'
    return ans


def est_table(names):
    return [['', *names], ['어림한 각도', *['약 (     )°'] * len(names)], ['잰 각도', *['(     )°'] * len(names)]]


def tb5(s, ch):
    s.lesson(5, '개념 구축하기(O)', '각도를 어림해 볼까요', '각도를 어떻게 어림할 수 있을까요?')
    s.scene(None, '은호가 만든 책 모양 오두막이에요. 오두막에서 보이는 각을 어림하고 재어 봐요.')
    s.step('① 만져 보기', '가(꼭대기)와 나(바닥 오른쪽)를 어림하고 재기')
    figk(s, house_fig(), .17)
    if not ch:
        s.text('삼각자의 각(30°, 45°, 60°, 90°)을 대 보며 어림한 다음, 각도기로 재어 확인해요.')
    s.table(est_table(['가', '나']))
    s.step('② 그려 보기', '각도기를 보지 않고 어림해 그리기')
    sb = C()
    for i, t in enumerate(['약 50°', '약 120°']):
        k = C()
        k.line((0, 0), (220, 0), INK, 5)
        k.circle((0, 0), 6)
        k.see((-150, -180), (240, 30))
        k.text(-120, -160, t, 24, RED, bold=True)
        sb.put(k, i * 470, 0)
    figk(s, sb, .17)
    s.table([['', '약 50°', '약 120°'], ['그린 각을 잰 각도', '(     )°', '(     )°']])
    s.page_break()
    s.step('③ 말해 보기', '어림한 까닭')
    if ch:
        s.ask('가를 약 40°, 나를 약 70°로 어림한 까닭을 삼각자의 각과 비교해 써 보세요.', blank=False)
        s.lines(1)
    else:
        s.fill(['가는 삼각자의 %s보다 크고 45°보다 작은 것 같아서 약 40°로 어림했어요.' % CH('30°', '60°', '90°'),
                '나는 %s보다 조금 크고 %s보다 작은 것 같아서 약 70°로 어림했어요.' % (CH('60°', '30°'), CH('직각', '45°'))])
    s.step('④ 약속하기', '각도를 어림하는 방법')
    if not ch:
        s.wordbox(['약 50°', '정확히 50°', '삼각자의 30°, 45°, 60°와 직각 90°', '각의 변의 길이'])
    s.fill(['어림한 각도는 %s처럼 나타내요.' % B, '어림할 때는 %s를 기준으로 비교하고, 각도기로 재어 확인해요.' % B])
    s.step('⑤ 확인하기', '어림하고 각도기로 재어 확인하기')
    figk(s, row([single(50, 155, 200, label='①', arc=30), single(100, 30, 200, label='②', arc=30)], 70), .16)
    s.table(est_table(['①', '②']))
    ans = '5차시  ① 가 40°, 나 70° (어림은 가깝게 하면 정답)   ② 그린 각을 재어 50°, 120°에 가까우면 잘 어림함   ③ 30°, 60°, 직각   ④ 약 50°, 삼각자의 30°, 45°, 60°와 직각 90°   ⑤ ① 50° ② 100°'
    if ch:
        ans = ans.replace('③ 30°, 60°, 직각', '③ (예) 가는 30°보다 크고 45°보다 작아 보여서, 나는 60°보다 조금 크고 직각보다 작아 보여서')
        s.step('⑥ 도전하기', '잎 끝 각도와 어림 겨루기')
        figk(s, row([leaf_fig(235, 70, '#B9E3A8', '강낭콩 잎'), leaf_fig(220, 100, '#9BD08A', '딸기 잎')], 80), .12)
        s.table(est_table(['강낭콩 잎', '딸기 잎']))
        s.picture(png(protfig(130)), width_mm=50)
        s.ask('유미 약 100°, 승호 약 140°로 어림했어요. 잰 각도가 그림과 같다면 누가 더 잘 어림했나요? 까닭은?', blank=False)
        s.lines(1)
        ans += '   ⑥ 강낭콩 잎 70°, 딸기 잎 100° / 승호(잰 각도 130°와 승호는 10°, 유미는 30° 차이)'
    return ans


def tb6(s, ch):
    s.lesson(6, '개념 구축하기(O)', '각도의 합과 차를 구해 볼까요', '두 각도의 합과 차는 어떻게 구할까요?')
    s.scene(None, '지안이가 나무 집 창문을 처음에 15° 열고, 잠시 뒤 30°를 더 열었어요.')
    s.step('① 만져 보기', '나(30°)를 가(15°)에 이어 붙이기')
    figk(s, join_fig('sum', 15, 30), .15)
    s.ask('이어 붙인 각 다를 각도기로 재어 보세요.')
    s.ask('식으로 나타내 보세요.   15° + 30° = (        )°', blank=False)
    s.step('② 그려 보기', '가(130°) 위에 나(50°) 겹치기')
    figk(s, join_fig('diff', 130, 50), .15)
    s.ask('겹치지 않고 남은 각 다는 몇 도인가요?')
    s.ask('식으로 나타내 보세요.   130° − 50° = (        )°', blank=False)
    s.page_break()
    s.step('③ 말해 보기', '각도의 합과 차를 구하는 방법')
    if ch:
        s.ask('각도의 합과 차를 어떻게 구하는지, 자연수의 계산과 비교해 써 보세요.', blank=False)
        s.lines(2)
    else:
        s.fill(['두 각도의 합은 %s과 같은 방법으로 계산하고 단위 °를 붙여요.' % CH('자연수의 덧셈', '자연수의 뺄셈'),
                '두 각도의 차는 %s 빼서 구해요.' % CH('큰 각도에서 작은 각도를', '작은 각도에서 큰 각도를')])
    s.step('④ 계산하기', '각도의 합과 차')
    s.table([['60° + 70°', '95° + 45°', '110° − 25°', '155° − 80°'], ['(     )°', '(     )°', '(     )°', '(     )°']])
    if not ch:
        s.text('도움: 받아올림과 받아내림에 주의해요. 답에는 ° 단위를 붙여요.')
    s.step('⑤ 확인하기', '사각형 종이로 만든 바람개비')
    figk(s, pinwheel_fig(), .17)
    s.text('크기와 모양이 같은 사각형 종이(한 장의 각은 직각)를 한 장씩 이어 붙였어요. 빨간 표시의 각도를 써 보세요.')
    s.table([['1장', '2장', '3장', '4장'], ['(     )°', '(     )°', '(     )°', '(     )°']])
    v = [60 + 70, 95 + 45, 110 - 25, 155 - 80]
    ans = '6차시  ① 45°, 15°+30°=45°   ② 80°, 130°−50°=80°   ③ 자연수의 덧셈, 큰 각도에서 작은 각도를   ④ %d°, %d°, %d°, %d°   ⑤ 90°, 180°, 270°, 360°' % tuple(v)
    if ch:
        ans = ans.replace('③ 자연수의 덧셈, 큰 각도에서 작은 각도를', '③ (예) 합은 자연수의 덧셈처럼, 차는 큰 각도에서 작은 각도를 빼고 °를 붙여요')
        s.step('⑥ 도전하기', '각도의 합과 차로 문제 해결하기')
        e = {'㉠': 170 - 53, '㉡': 87 + 46, '㉢': 64 + 39, '㉣': 154 - 28}
        order = ', '.join(sorted(e, key=e.get))
        s.ask('계산 결과가 작은 것부터 차례로 기호를 써 보세요.  ㉠ 170°−53°  ㉡ 87°+46°  ㉢ 64°+39°  ㉣ 154°−28°', blank=False)
        s.ask('답: (                    )', blank=False)
        s.ask('등받이 각도가 110°인 의자를 140°가 되도록 더 눕혔어요. 몇 도 더 눕혔나요?')
        k = C()
        V = (0, 0)
        k.poly([V, pt(V, 0, 120), pt(V, 60, 240)], fill=FILLS[0], sw=3)
        k.poly([V, pt(V, 60, 240), pt(V, 120, 120)], fill=FILLS[1], sw=3)
        k.arc(V, 0, 120, 44, RED, 4)
        q = pt(V, 90, 72)
        k.text(q[0], q[1], '?', 24)
        s.picture(png(k), width_mm=34)
        s.ask('30°·60° 삼각자 두 개의 60°인 부분을 이어 붙였어요. 만들어진 각은 몇 도인가요?')
        ans += '   ⑥ %s(㉢ %d°, ㉠ %d°, ㉣ %d°, ㉡ %d°) / %d° / %d°' % (order, e['㉢'], e['㉠'], e['㉣'], e['㉡'], 140 - 110, 60 + 60)
    return ans


def tb7(s, ch):
    s.lesson(7, '개념 구축하기(O)', '삼각형의 세 각의 크기의 합을 알아볼까요', '삼각형의 크기와 모양이 다르면 세 각의 크기의 합도 다를까요?')
    s.scene(None, '점심으로 먹을 삼각김밥 모양의 삼각형이에요.')
    s.step('① 만져 보기', '세 각의 크기를 재고 더하기')
    c, pts = polyfig([30, 40, 110], [10], ['㉮', '㉯', '㉰'], size=420, fill='#FFF6D9')
    figk(s, c, .27)
    s.table([['각', '㉮(왼쪽 아래)', '㉯(오른쪽 아래)', '㉰(위쪽)', '세 각의 합'], ['각도', '(     )°', '(     )°', '(     )°', '(     )°']])
    s.step('② 그려 보기', '모양이 다른 삼각형도 재어 보기')
    c2, _ = polyfig([50, 90, 40], [10], None, size=240, fill='#EAF4E4')
    figk(s, c2, .2)
    s.text('위 삼각형의 세 각을 재고, 빈 곳에 모양과 크기가 다른 삼각형을 하나 그려 세 각을 재어 보세요.')
    s.table([['', '각 ①', '각 ②', '각 ③', '세 각의 합'], ['위 삼각형', '(     )°', '(     )°', '(     )°', '(     )°'], ['내가 그린 삼각형', '(     )°', '(     )°', '(     )°', '(     )°']])
    s.page_break()
    s.step('③ 말해 보기', '세 각을 잘라 한 점에 모으기')
    t3, _ = polyfig([65, 45, 70], [10], None, size=240, fill='#fff', wedges=True, r=26)
    figk(s, row([t3, fan([(65, '①'), (45, '②'), (70, '③')], R=140)], 70), .17)
    if ch:
        s.ask('세 각을 모으면 어떤 모양이 되나요? 그래서 세 각의 크기의 합은 몇 도인지 까닭과 함께 써 보세요.', blank=False)
        s.lines(2)
    else:
        s.choices([('세 각을 한 점에 모으면?', CH('일직선', '직각')), ('일직선이 이루는 각은?', CH('90°', '180°', '360°'))])
    s.step('④ 약속하기', '삼각형의 세 각의 크기의 합')
    if not ch:
        s.wordbox(['180°', '같아요', '달라요'])
    s.fill(['삼각형의 세 각의 크기의 합은 %s예요.' % B, '삼각형의 크기와 모양이 달라도 세 각의 크기의 합은 %s.' % B])
    s.step('⑤ 확인하기', '□ 안에 알맞은 수 구하기')
    f1, _ = polyfig([35, 45, 100], [10], ['35°', '45°', '㉠'], size=260)
    f2, _ = polyfig([70, 80, 30], [10], ['70°', '㉡', '30°'], size=260)
    figk(s, row([f1, f2], 60), .14)
    s.ask('㉠ = (        )°        ㉡ = (        )°', blank=False)
    if not ch:
        s.text('도움: 180°에서 주어진 두 각을 빼요.')
    ans = '7차시  ① 30°, 40°, 110°, 합 180°   ② 50°, 90°, 40°, 합 180° / 그린 삼각형도 합 180°   ③ 일직선, 180°   ④ 180°, 같아요   ⑤ ㉠ %d°, ㉡ %d°' % (180 - 35 - 45, 180 - 70 - 30)
    if ch:
        ans = ans.replace('③ 일직선, 180°', '③ (예) 세 각을 모으면 일직선이 되고, 일직선이 이루는 각은 180°예요')
        s.step('⑥ 도전하기', '삼각형의 세 각의 합으로 문제 해결하기')
        f3, _ = polyfig([90, 35, 55], [10], ['R', '㉠', '㉡'], size=230)
        figk(s, row([f3, fan([(55, '55°'), (60, '60°'), (65, '□')], R=130)], 60), .14)
        s.ask('직각삼각형에서 ㉠ + ㉡ = (        )°      잘라 붙인 세 각에서 □ = (        )°', blank=False)
        s.ask('“삼각형의 크기가 다르면 세 각의 크기의 합도 달라요.”를 바르게 고쳐 써 보세요.', blank=False)
        s.lines(1)
        ans += '   ⑥ %d°, %d° / 삼각형의 크기가 달라도 세 각의 크기의 합은 180°로 같아요' % (180 - 90, 180 - 55 - 60)
    return ans


def tb8(s, ch):
    s.lesson(8, '개념 구축하기(O)', '사각형의 네 각의 크기의 합을 알아볼까요', '사각형의 네 각의 크기의 합은 얼마일까요?')
    s.scene(None, '숲 놀이터를 나가는 길바닥에 그려진 사각형이에요.')
    s.step('① 만져 보기', '네 각의 크기를 재고 더하기')
    c, _ = polyfig([75, 80, 100, 105], [10, 4], ['㉮', '㉯', '㉰', '㉱'], size=400, fill='#EAF4E4')
    figk(s, c, .26)
    s.table([['각', '㉮', '㉯', '㉰', '㉱', '네 각의 합'], ['각도', '(    )°', '(    )°', '(    )°', '(    )°', '(     )°']])
    s.step('② 그려 보기', '네 각을 잘라 한 점에 모으기')
    q2, _ = polyfig([55, 130, 65, 110], [10, 9.5], None, size=230, wedges=True, r=24)
    figk(s, row([q2, fan([(55, '①'), (130, '②'), (65, '③'), (110, '④')], full=360, R=120)], 70), .16)
    if ch:
        s.ask('네 각을 모은 모양을 보고 네 각의 크기의 합을 까닭과 함께 써 보세요.', blank=False)
        s.lines(1)
    else:
        s.choices([('네 각을 한 점에 모으면?', CH('일직선', '한 바퀴')), ('한 바퀴는 몇 도?', CH('180°', '360°'))])
    s.page_break()
    s.step('③ 말해 보기', '삼각형 2개로 나누어 구하기')
    q3, _ = polyfig([85, 95, 70, 110], [5.5, 7], None, size=250, diag=True, fill='#F7F1E3')
    figk(s, q3, .15)
    if ch:
        s.ask('사각형을 삼각형 2개로 나누어 네 각의 크기의 합을 구하는 식과 까닭을 써 보세요.', blank=False)
        s.lines(2)
    else:
        s.fill(['삼각형 한 개의 세 각의 크기의 합은 %s°이고, 삼각형이 %s개이니까' % ('(      )', '(      )'),
                '사각형의 네 각의 크기의 합은 (      )° + (      )° = (      )°예요.'])
    s.step('④ 약속하기', '사각형의 네 각의 크기의 합')
    if not ch:
        s.wordbox(['360°', '2개', '같아요'])
    s.fill(['사각형의 네 각의 크기의 합은 %s예요.' % B, '사각형은 삼각형 %s로 나눌 수 있어서 180°+180°로 구할 수 있어요.' % B,
            '사각형의 크기와 모양이 달라도 네 각의 크기의 합은 %s.' % B])
    s.step('⑤ 확인하기', '□ 안에 알맞은 수 구하기')
    f1, _ = polyfig([70, 110, 50, 130], [4.5, 6.5], ['70°', '110°', '50°', '㉠'], size=250)
    f2, _ = polyfig([75, 90, 115, 80], [4.5, 3.5], ['75°', '㉡', '115°', '80°'], size=250)
    figk(s, row([f1, f2], 60), .14)
    s.ask('㉠ = (        )°        ㉡ = (        )°', blank=False)
    if not ch:
        s.text('도움: 360°에서 주어진 세 각을 빼요.')
    ans = '8차시  ① 75°, 80°, 100°, 105°, 합 360°   ② 한 바퀴, 360°   ③ 180, 2, 180°+180°=360°   ④ 360°, 2개, 같아요   ⑤ ㉠ %d°, ㉡ %d°' % (360 - 70 - 110 - 50, 360 - 75 - 115 - 80)
    if ch:
        ans = ans.replace('② 한 바퀴, 360°', '② (예) 빈틈없이 한 바퀴가 되어 360°예요').replace('③ 180, 2, 180°+180°=360°', '③ 180°+180°=360° (예) 대각선으로 나눈 삼각형 2개의 각을 모두 더한 것과 같아요')
        s.step('⑥ 도전하기', '사각형의 네 각의 합으로 문제 해결하기')
        f3, _ = polyfig([70, 95, 50, 145], [6.5, 9.5], ['㉠', '㉡', '50°', '145°'], size=230)
        figk(s, row([f3, fan([(80, '80°'), (125, '125°'), (70, '70°'), (85, '□')], full=360, R=120)], 60), .14)
        s.ask('㉠ + ㉡ = (        )°      잘라 붙인 네 각에서 □ = (        )°', blank=False)
        ans += '   ⑥ %d°, %d°' % (360 - 50 - 145, 360 - 80 - 125 - 70)
    return ans


def cmd_rows(cmds, blanks_for):
    """cmds: [(dist), ('왼쪽', 60, 3)…]; blanks_for: 빈칸으로 둘 번호 집합(1부터)."""
    out = []
    for i, cmd in enumerate(cmds, 1):
        if isinstance(cmd, (int, float)):
            out.append('%s 화살표 방향으로 %s cm 이동' % ('①②③④⑤'[i - 1], cmd))
        else:
            tn, dg, ds = cmd
            mode = blanks_for.get(i)
            t = '( 왼쪽 / 오른쪽 )' if mode in ('both', 'turn') else tn
            d = '(      )' if mode in ('both', 'deg') else str(dg)
            out.append('%s %s으로 %s° 회전하여 %s cm 이동' % ('①②③④⑤'[i - 1], t, d, ds))
    return out


def cmds(s, cs, blanks):
    """주어진 명령은 한 줄 글로, 빈칸이 있는 명령만 테두리 칸에."""
    rows = cmd_rows(cs, blanks)
    s.text('주어진 명령:  ' + '   '.join(r for i, r in enumerate(rows, 1) if i not in blanks))
    s.fill([r for i, r in enumerate(rows, 1) if i in blanks])


def tb9(s, ch):
    s.lesson(9, '탐구 정리하기(O)', '생각을 더하다 ― 학교 안의 보물을 찾아라!', '거북이 명령어대로 움직이면 보물은 어디에 있을까요?')
    mj = mapJ()
    assert run_cmds(mj, [(0, 4), (60, 3), (-30, 2)]) == '도서관'
    assert run_cmds(mj, [(0, 4), (-30, 3), (-30, 2)]) == '급식실'
    assert run_cmds(mj, [(0, 4), (-30, 3), (30, 2)]) == '수돗가'
    s.scene(None, None)
    cm_fig(s, mapfig(mj), 50)
    s.step('① 만져 보기', '명령어대로 길 그리기(한 칸 1 cm)')
    s.fill(['① 화살표 방향으로 4 cm 이동   ② 왼쪽으로 60°만큼 회전하여 3 cm 이동   ③ 오른쪽으로 30°만큼 회전하여 2 cm 이동'])
    if ch:
        s.ask('보물이 있는 곳은 어디인가요?')
    else:
        s.text('도움: 왼쪽·오른쪽은 거북이 바라보는 방향을 기준으로 정해요.')
        s.choices([('보물이 있는 곳은?', CH('도서관', '본관', '운동장'))])
    s.step('② 그려 보기', '회전한 각 재기(점선: 늘인 선)')
    figk(s, row([col([turnfig(180, 60, 60, '①에서 온 길'), C().text(0, 0, '②에서 회전한 각', 20, bold=True)], 8),
                 col([turnfig(240, 30, 30, '②에서 온 길'), C().text(0, 0, '③에서 회전한 각', 20, bold=True)], 8)], 60), .08)
    s.ask('② (      )°     ③ (      )°', blank=False)
    s.step('③ 말해 보기', '명령어 바꾸기 — 급식실에 도착하려면')
    cmds(s, [4, ('오른쪽', 30, 3), ('오른쪽', 30, 2)], {2: 'both', 3: 'both'})
    if not ch:
        s.text('도움: 급식실은 처음 길보다 아래쪽에 있어요. 갈림길에서 아래로 가는 길은 가던 방향에서 30° 꺾여 있어요.')
    s.page_break()
    s.step('④ 약속하기', '회전한 각도')
    if not ch:
        s.wordbox(['보조선', '거북이 가던 방향', '지도의 위쪽'])
    s.fill(['거북이 회전한 각도는 거북이 가던 방향을 곧게 늘인 %s과 새로 가는 선 사이의 각이에요.' % B,
            '왼쪽과 오른쪽은 %s을 기준으로 정해요.' % B])
    my = mapY()
    assert run_cmds(my, [(0, 2), (-90, 9), (90, 5), (60, 3)]) == '급식실'
    assert run_cmds(my, [(0, 2), (-90, 9), (90, 5), (60, 3), (30, 4)]) == '강당'
    s.step('⑤ 확인하기', '예빈이네 학교 — 급식실과 강당의 보물 모두 찾기')
    cm_fig(s, mapfig(my, 40), 40)
    cmds(s, [2, ('오른쪽', 90, 9), ('왼쪽', 90, 5), ('왼쪽', 60, 3), ('왼쪽', 30, 4)], {3: 'both', 4: 'both', 5: 'both'})
    if not ch:
        s.text('도움: 거북이 아래쪽을 보고 출발해요. ④까지 가면 급식실, ⑤까지 가면 강당에 도착해야 해요.')
    ans = '9차시  ① 도서관   ② 60°, 30°   ③ ② 오른쪽 30° ③ 오른쪽 30°   ④ 보조선, 거북이 가던 방향   ⑤ ③ 왼쪽 90° ④ 왼쪽 60° ⑤ 왼쪽 30°'
    if ch:
        s.step('⑥ 도전하기', '수돗가로 가는 명령어 만들기(준하의 지도)')
        cmds(s, [4, ('오른쪽', 30, 3), ('왼쪽', 30, 2)], {2: 'both', 3: 'both'})
        s.ask('③에서 거북은 처음과 같은 방향을 보게 돼요. 그 까닭을 써 보세요.', blank=False)
        s.lines(1)
        ans += '   ⑥ ② 오른쪽 30° ③ 왼쪽 30° (오른쪽으로 돈 만큼 왼쪽으로 돌면 처음 방향으로 돌아와요)'
    return ans


CANDS_TB = [('가', (7, 1), (16, -12)), ('나', (3, 2), (-16, -12)), ('다', (5, 1), (18, 0)), ('라', (4, 5), (-18, 8)), ('마', (2, 2), (-18, -8))]
CANDS_ST = [('가', (7, 1), (16, -12)), ('나', (3, 2), (-16, -12)), ('다', (5, 0), (18, 0)), ('라', (8, 4), (18, 8)), ('마', (6, 5), (18, 10)), ('바', (4, 5), (-18, 10))]


def tb10(s, ch):
    s.lesson(10, '발표하기(P)', '놀이를 더하다 ― 각을 그려 도착 변까지! 출발!', '주사위 눈에 맞게 예각과 둔각을 그려 도착 변에 먼저 닿으려면 어떻게 해야 할까요?')
    s.scene(None, '주사위 눈이 1·3·5이면 예각, 2·4·6이면 둔각을 그려요. 출발 변이나 앞에 그린 변을 각의 한 변으로 하고, 새 변은 3 cm와 같거나 짧게 점과 점을 이어요. 그린 변이 도착 변에 먼저 닿는 사람이 이겨요.')
    s.step('① 규칙 알기')
    if ch:
        s.ask('주사위를 굴려 2가 나왔어요. 어떤 각을 그려야 하나요?')
        s.ask('5가 나왔어요. 어떤 각을 그려야 하나요?')
        s.ask('주사위가 4일 때 직각을 그려도 될까요? 까닭도 써 보세요.', blank=False)
        s.lines(1)
    else:
        s.choices([('주사위를 굴려 2가 나왔어요.', CH('예각', '둔각')), ('5가 나왔어요.', CH('예각', '둔각')),
                   ('새 변은 어떻게 그릴까요?', CH('3 cm와 같거나 짧게', '3 cm보다 길게')), ('4가 나왔을 때 직각을 그려도 될까요?', CH('안 돼요', '돼요'))])
    s.step('② 연습하기', '출발 변에서 예각 → 둔각 → 예각을 차례로 그리기(점 사이 1 cm)')
    cm_fig(s, dice_board(50, small=True), 50)
    s.page_break()
    s.step('③ 놀이하기', '짝과 번갈아 주사위를 굴려 도착 변까지')
    cm_fig(s, dice_board(50), 50)
    s.text('도착할 때까지 그린 횟수: 나 (      )번      짝 (      )번')
    s.step('④ 전략 말하기')
    s.picture(png(forward_fig()), width_mm=44)
    if ch:
        s.ask('앞의 변을 오른쪽(→)으로 그렸을 때 계속 오른쪽으로 나아가려면 어떤 각을 그려야 하나요? 도착 변에 빨리 닿는 방법도 써 보세요.', blank=False)
        s.lines(1)
    else:
        s.choices([('계속 오른쪽으로 나아가려면?', CH('둔각', '예각')), ('새 변은?', CH('3 cm에 가깝게 길게', '될 수 있는 대로 짧게'))])
    s.step('⑤ 확인하기', '주사위 3 — 그릴 수 있는 새 변')
    cm_fig(s, cand_fig(CANDS_TB, range(1, 6)), 50)
    ok = drawable(CANDS_TB, '예각')
    assert ok == ['나', '라'], ok
    s.ask('그릴 수 있는 새 변을 모두 찾아 기호를 써 보세요.')
    if not ch:
        s.text('도움: 3은 홀수라서 예각이에요. 새 변이 3 cm보다 길면 그릴 수 없어요.')
    ans = '10차시  ① 둔각, 예각, 3 cm와 같거나 짧게, 안 돼요(직각은 둔각이 아님)   ② 예각·둔각·예각 차례로 그림   ③ 놀이   ④ 둔각, 3 cm에 가깝게 길게   ⑤ %s (가는 둔각, 다는 직각, 마는 예각이지만 3 cm보다 김)' % ', '.join(ok)
    if ch:
        s.page_break()
        s.step('⑥ 도전하기', '또 다른 놀이 — 빨대 튕기기')
        s.picture(png(straw_fig()), width_mm=40)
        s.text('주사위 눈이 1·3·5이면 ‘예각’, 2·4·6이면 ‘둔각’을 외치고 빨대를 튕겨요. 파란 선과 빨대가 이루는 각이 외친 각이면 1점이에요.')
        s.table([['판', '1', '2', '3', '4', '5'], ['외친 각', '', '', '', '', ''], ['빨대가 만든 각', '', '', '', '', ''], ['점수', '', '', '', '', '']])
        ans += '   ⑥ 놀이 (그림의 빨대와 파란 선이 이루는 각은 둔각)'
    return ans


def tb11(s, ch):
    s.lesson(11, '발표하기(P)', '공부한 내용을 확인해요', '각도에 대해 배운 것을 이용해 문제를 해결할 수 있나요?')
    s.step('① 각도 재기')
    c1 = cards([{'d1': 15, 'a': 80, 'L2r': 1.1}, {'d1': 30, 'a': 125, 'L2r': .5, 'maxL': 110}], 190, 150)
    m1, m2 = single(40, 20, 190, label='㉮', arc=30), single(145, 160, 170, label='㉯', arc=30)
    figk(s, row([c1, m1, m2], 40), .135)
    s.ask('1. (왼쪽) 각의 크기가 더 큰 각은?')
    s.ask('2. 각도를 재어 보세요.   ㉮ (      )°    ㉯ (      )°', blank=False)
    s.step('② 예각과 둔각', '3. 예각과 둔각으로 나누기')
    figk(s, cards([{'d1': 30, 'a': 60}, {'d1': 0, 'a': 110}, {'d1': 120, 'a': 25}, {'d1': 190, 'a': 160}], 175, 140), .2)
    s.table([['예각', '둔각'], ['', '']])
    s.step('③ 어림하기', '4. 윗몸일으키기 의자와 바닥이 이루는 각')
    figk(s, situp_fig(), .14)
    s.table([['어림한 각도', '잰 각도'], ['약 (     )°', '(     )°']])
    s.page_break()
    s.step('④ □ 구하기', '5. □ 안에 알맞은 수')
    f1, _ = polyfig([95, 45, 40], [10], ['95°', '45°', '㉠'], size=250)
    f2, _ = polyfig([85, 115, 70, 90], [4.5, 4.5], ['85°', '㉡', '70°', 'R'], size=250)
    figk(s, row([f1, f2], 60), .13)
    s.ask('㉠ = (        )°        ㉡ = (        )°', blank=False)
    s.step('⑤ 미로 탈출', '다람쥐가 도토리까지 가는 길 — 갈림길 문제')
    g1 = protfig(140, label='①')
    g2 = cards([{'d1': 110, 'a': 50, 'label': '②'}], 190, 150)
    g3, _ = polyfig([105, 25, 50], [10], ['105°', '25°', '?'], size=220)
    g5, _ = polyfig([110, 70, 90, 90], [5.5, 7], ['?', '70°', 'R', 'R'], size=220)
    figk(s, col([row([g1, g2], 40), row([col([C().text(0, 0, '③', 26, RED, bold=True), g3], 4), col([C().text(0, 0, '⑤', 26, RED, bold=True), g5], 4)], 60)], 16), .1)
    if ch:
        s.ask('① 각의 크기 (      )°   ② (예각 / 둔각)   ③ ? = (      )°   ④ 175° − 85° = (      )°   ⑤ ? = (      )°', blank=False)
    else:
        s.choices([('① 각의 크기는?', CH('140°', '40°')), ('② 이 각은?', CH('예각', '둔각')), ('③ 삼각형의 ?는?', CH('50°', '30°')),
                   ('④ 175° − 85° = ?', CH('90°', '260°')), ('⑤ 사각형의 ?는?', CH('110°', '100°'))])
    ans = '11차시  ① 나 / ㉮ 40°, ㉯ 145°   ② 예각: 가, 다 / 둔각: 나, 라   ③ 어림은 가까우면 정답, 잰 각도 30°   ④ ㉠ %d°, ㉡ %d°   ⑤ 140° → 예각 → %d° → %d° → %d°' % (
        180 - 95 - 45, 360 - 85 - 70 - 90, 180 - 105 - 25, 175 - 85, 360 - 70 - 90 - 90)
    if ch:
        s.step('⑥ 도전하기', '6. 가장 큰 각과 가장 작은 각 / 7. 각도기 없이 구하기')
        h1, h2, h3 = single(70, 10, 160, label='가', arc=28), single(35, 100, 170, label='나', arc=28), single(120, 200, 150, label='다', arc=28)
        f3, _ = polyfig([50, 70, 60], [10], ['㉠', '㉡', '60°'], size=200)
        figk(s, row([h1, h2, h3, f3], 30), .12)
        s.ask('가 (     )°  나 (     )°  다 (     )°  →  가장 큰 각과 가장 작은 각의 합 (     )°, 차 (     )°', blank=False)
        s.ask('7. ㉠ + ㉡ = (        )°   어떻게 구했는지 써 보세요.', blank=False)
        s.lines(1)
        ans += '   ⑥ 가 70°, 나 35°, 다 120° / 합 %d°, 차 %d° / ㉠+㉡=%d° (180°−60°)' % (120 + 35, 120 - 35, 180 - 60)
    return ans


# ================================================================ 이야기 버전
def st1(s, ch):
    s.lesson(1, '개념 찾기(S)', '놀이터 설계단이 모였어요', '새 놀이터를 설계하려면 각에 대해 무엇을 알아야 할까요?')
    s.scene(png(scene_st()), '4학년 2반 24명이 ‘놀이터 설계단’이 되었어요.', width_mm=100)
    s.step('① 만져 보기 — 보기·생각하기·궁금해하기', '놀이터 그림을 보고 칸마다 써요')
    if ch:
        s.labeled([('보여요', ''), ('생각해요', ''), ('궁금해요', '')], row_h=3400)
    else:
        s.labeled([('보여요', '놀이터에서 ______________ 이 보여요.'), ('생각해요', '____________ 이 더 기울어지면 ____________ 할 것 같아요.'),
                   ('궁금해요', '______________ 은 어떻게 잴까?')], row_h=3400)
    s.step('② 그려 보기 — 놀이터에서 각 찾기', '가 미끄럼틀 · 나 그네 · 다 훌라후프 · 라 시소 · 마 정글짐 · 바 해 · 사 모래 언덕')
    s.ask('위 그림에서 각을 볼 수 있는 것을 모두 찾아 기호를 써 보세요.')
    if not ch:
        s.text('도움: 곧은 선 두 개가 한 점에서 만나는 곳을 찾아요. 둥근 선으로만 된 것에는 각이 없어요.')
    s.page_break()
    s.step('③ 말해 보기 — 각과 직각 떠올리기')
    def curve(k, W, H):
        k.path('M50,%s Q120,40 %s,60 M50,%s Q140,%s %s,%s' % (H - 36, W - 36, H - 36, H - 30, W - 30, H - 60), sw=5)
        k.circle((50, H - 36), 5)
    def apart(k, W, H):
        k.line((40, H - 36), (W - 40, H - 36))
        k.line((60, H - 70), (W - 60, 46))
    figk(s, cards([{'draw': curve}, {'d1': 15, 'a': 70}, {'draw': apart}, {'d1': 25, 'a': 130}], 200, 150), .2)
    s.ask('각을 모두 찾아 기호를 써 보세요.')
    figk(s, cards([{'d1': 20, 'a': 90}, {'d1': 0, 'a': 105}, {'d1': 40, 'a': 75}], 200, 150), .18)
    s.ask('정글짐 기둥과 가로 막대가 만나는 곳처럼 직각인 것을 찾아 기호를 써 보세요.')
    s.ask('왜 그럴까요? 맨 위 그림의 가는 왜 각이 아닐까요?', blank=False)
    if not ch:
        s.text('‘왜냐하면 가는 ~ 선으로 되어 있어서 ~이 아니기 때문이에요.’ 꼴로 써요.')
    s.lines(1)
    s.step('④ 약속하기 — 각의 이름')
    if not ch:
        s.wordbox(['각', '꼭짓점', '변', '직각'])
    s.fill(['한 점에서 그은 두 반직선으로 이루어진 도형을 %s이라고 해요.' % B,
            '그 점을 각의 %s, 두 반직선을 각의 %s이라고 해요.' % (B, B),
            '종이를 반듯하게 두 번 접었을 때 생기는 각을 %s이라고 해요.' % B])
    s.step('⑤ 확인하기 — 설계단의 첫 질문')
    ga, na = C(), C()
    slide(ga, (330, 260), 30, 220)
    ga.text(40, 40, '가', 26, bold=True)
    slide(na, (330, 260), 50, 220, '#6FA8DC')
    na.text(40, 40, '나', 26, bold=True)
    figk(s, row([ga, na], 50), .09)
    if ch:
        s.ask('더 가파른 미끄럼틀은?')
    else:
        s.choices([('더 가파른 미끄럼틀은? (파란색 각 비교)', CH('가', '나'))])
    s.ask('놀이터 설계단으로서 이 단원에서 알고 싶은 것을 써 보세요.', blank=False)
    if not ch:
        s.text('‘~의 각을 ~하는 방법을 알고 싶어요.’ 꼴로 써요.')
    s.lines(1)
    ans = '1차시  ① (생각 쓰기 — 예: 미끄럼틀 판과 바닥이 비스듬히 만나는 곳이 보여요 / 미끄럼틀이 더 기울어지면 더 빨리 내려올 것 같아요 / 미끄럼틀이 기울어진 정도는 어떻게 잴까?)   ② 가, 나, 라, 마   ③ 각: 나, 라 / 직각: 가 / 왜: (예) 가는 굽은 선으로 되어 있어서 한 점에서 그은 두 반직선으로 이루어진 도형이 아니기 때문이에요   ④ 각, 꼭짓점, 변, 직각   ⑤ 나 / (예) 미끄럼틀이 바닥과 이루는 각의 크기를 정확하게 재는 방법을 알고 싶어요'
    if ch:
        s.step('⑥ 도전하기', '막대 4개로 된 입구 안내판')
        c = C()
        for d in [0, 40, 100, 150]:
            c.line((0, 0), pt((0, 0), d, 240), '#9C6B3E', 7)
        c.circle((0, 0), 8)
        figk(s, c, .13)
        s.ask('그림에서 찾을 수 있는 각은 모두 몇 개인가요?')
        ans += '   ⑥ 6개(막대 4개에서 두 개씩 짝 지으면 6가지)'
    return ans


def st2(s, ch):
    s.lesson(2, '개념 구축하기(O)', '어느 미끄럼틀이 더 가파를까요 ― 각의 크기 비교', '두 미끄럼틀 중 어느 쪽이 바닥과 더 큰 각을 이룰까요? 각의 크기는 어떻게 비교할까요?')
    s.scene(None, '하린이 모둠(가)과 도윤이 모둠(나)이 그린 미끄럼틀이에요. 나의 미끄럼판이 더 길어요.')
    s.step('① 만져 보기 — 투명 종이로 겹치기')
    s.ask('먼저 예상해요: 미끄럼판이 더 긴 미끄럼틀이 바닥과 이루는 각도 더 클까요?', blank=False)
    if not ch:
        s.text('‘내 예상: 각이 (커질 / 그대로일) 것 같아요. 왜냐하면 ~’')
    s.lines(1)
    pa, pb = C(), C()
    angle(pa, (0, 0), 0, 40, 230, arc=46, col='#E8A25A')
    pa.text(pa.x0, pa.y0 - 20, '가 하린이 모둠', 22, RED, anchor='start', bold=True)
    angle(pb, (0, 0), 0, 36, 330, arc=46, col='#6FA8DC')
    pb.text(pb.x0, pb.y0 - 20, '나 도윤이 모둠', 22, RED, anchor='start', bold=True)
    figk(s, row([pa, pb], 60), .15)
    s.text('가를 투명 종이에 본떠 꼭짓점과 바닥 쪽 변을 맞추어 나에 겹쳐 보세요.')
    if ch:
        s.ask('바닥과 이루는 각이 더 큰 것은? 예상이 맞았는지도 써 보세요.')
        s.lines(1)
    else:
        s.choices([('바닥과 이루는 각이 더 큰 것은?', CH('가', '나')), ('예상이 맞았나요?', CH('맞았어요', '달랐어요'))])
    s.step('② 그려 보기 — 눈금으로 재기')
    figk(s, units_fig([(60, '가'), (90, '나')], [('서준이의 눈금', 3), ('수아의 눈금', 9)]), .1)
    s.table([['', '가', '나'], ['서준이의 눈금', '(    )칸', '(    )칸'], ['수아의 눈금', '(    )칸', '(    )칸']])
    s.page_break()
    s.step('③ 말해 보기 — 눈금이 다르면?')
    if ch:
        s.fill(['가는 서준이의 눈금으로 %s칸, 수아의 눈금으로 %s칸이에요. 같은 각이라도 눈금에 따라 칸 수가 %s.' % (B, B, B)])
    else:
        s.fill(['가는 서준이의 눈금으로 %s칸, 수아의 눈금으로 %s칸이에요.' % (CH('2', '3', '6'), CH('2', '6', '9')),
                '같은 각이라도 눈금에 따라 칸 수가 %s.' % CH('달라져요', '같아요'),
                '설계단 모두가 똑같이 알아들으려면 %s로 재야 해요.' % CH('모두 같은 단위', '각자 다른 단위')])
    s.ask('왜 그럴까요? 서준이와 수아가 같은 각을 재었는데 칸 수가 다른 까닭을 써 보세요.', blank=False)
    if not ch:
        s.text('‘왜냐하면 ~의 한 칸이 더 커서, 같은 각이라도 칸 수가 더 ~ 나오기 때문이에요.’')
    s.lines(1)
    s.step('④ 약속하기 — 각의 크기')
    if not ch:
        s.wordbox(['벌어진 정도', '변하지 않아요', '한 변'])
    s.fill(['각의 크기는 각의 두 변이 %s예요. 변의 길이가 길어져도 각의 크기는 %s.' % (B, B),
            '두 각의 크기를 비교할 때는 꼭짓점과 %s을 맞추어 겹쳐 봐요.' % B])
    s.step('⑤ 확인하기 — 놀이기구 각 비교')
    c1 = cards([{'d1': 20, 'a': 55, 'L2r': 1.4}, {'d1': 0, 'a': 75, 'L2r': .5}], 190, 150)
    c2 = cards([{'d1': 30, 'a': 100, 'L2r': .6}, {'d1': 60, 'a': 30, 'L2r': 1.3}, {'d1': 190, 'a': 65}], 190, 150)
    figk(s, row([c1, c2], 60), .2)
    s.ask('(왼쪽) 각의 크기가 더 큰 각은?')
    s.ask('(오른쪽) 각의 크기가 큰 것부터 차례로 기호를 써 보세요.')
    figk(s, cards([{'d1': 0, 'a': 70, 'label': '보기'}, {'d1': 30, 'a': 85, 'L2r': .6}, {'d1': 110, 'a': 40, 'L2r': 1.3},
                   {'d1': 0, 'a': 120}, {'d1': 240, 'a': 60}], 180, 140), .245)
    s.ask('보기의 각보다 큰 각을 모두 찾아 기호를 써 보세요.')
    ans = '2차시  ① 예상: (생각 쓰기) / 가 — 각의 크기는 변의 길이와 상관없이 두 변이 벌어진 정도로 정해요   ② 서준 가 2칸·나 3칸 / 수아 가 6칸·나 9칸   ③ 2, 6, 달라져요, 모두 같은 단위 / 왜: (예) 서준이의 한 칸이 수아의 한 칸보다 커서 서준이 눈금으로는 칸 수가 더 적게 나오기 때문이에요   ④ 벌어진 정도, 변하지 않아요, 한 변   ⑤ 나 / 가, 다, 나 / 가, 다'
    if ch:
        s.step('⑥ 도전하기', '설계단 친구들의 말')
        s.ask('수아의 눈금으로 재었더니 그네 기둥 사이의 각은 5칸, 시소 판과 땅이 이루는 각은 2칸이었어요. 어느 각이 몇 칸만큼 더 큰가요?', blank=False)
        s.ask('지유가 “각의 변을 길게 늘이면 각이 더 커져.”라고 말했어요. 바르게 고쳐 써 보세요.', blank=False)
        s.lines(1)
        ans += '   ⑥ 그네 기둥 사이의 각이 3칸만큼 더 커요 / 변을 길게 늘여도 두 변이 벌어진 정도는 같아서 각의 크기는 그대로예요'
    return ans


def st3(s, ch):
    s.lesson(3, '개념 구축하기(O)', '그네 기둥 사이의 각 ― 각도기로 재기', '그네 기둥이 벌어진 각을 어떻게 정확하게 잴 수 있을까요?')
    s.scene(None, '도윤이가 그네 기둥 두 개가 꼭대기에서 만나 벌어진 각을 재려고 해요.')
    s.step('① 만져 보기 — 각도기 맞추기')
    c = C()
    V = (0, 0)
    c.line(V, (0, 200), GRAY, 3)
    c.rect(-24, 200, 48, 12, TENT, rx=3)
    angle(c, V, 245, 50, 300, names=['ㄱ', 'ㄴ', 'ㄷ'], col='#9C6B3E', arc=34)
    figk(s, c, .17)
    if not ch:
        s.text('각도기의 중심을 꼭짓점 ㄴ에, 밑금을 변 ㄴㄷ에 맞춘 다음, 변 ㄴㄷ이 0에 있는 쪽 눈금을 읽어요.')
    s.ask('그네 기둥 사이의 각 ㄱㄴㄷ은 몇 도인가요?')
    s.step('② 그려 보기 — 여러 가지 각 재기 (②는 각도기가 놓여 있어요)')
    figk(s, row([single(35, 0, 200, label='①', arc=30), protfig(110, 20, label='②', L=230), single(75, 90, 190, label='③', arc=30)], 40), .125)
    s.ask('① 시소 판과 땅 (      )°   ② 미끄럼틀 손잡이 (      )°   ③ (      )°', blank=False)
    s.page_break()
    s.step('③ 말해 보기 — 바르게 재는 방법')
    figk(s, row([protfig(70, 0, (0, 0), 12, '가'), protfig(70, 0, (-40, 0), 0, '나'), protfig(70, 0, (0, 0), 0, '다')], 30), .115)
    if ch:
        s.ask('각도기를 바르게 놓은 것과 그 각의 크기는?')
    else:
        s.choices([('각도기를 바르게 놓은 것은?', CH('가', '나', '다')), ('다의 각의 크기는?', CH('70°', '110°'))])
    s.ask('왜 그럴까요? 이 각을 110°가 아니라 70°로 읽어야 하는 까닭을 써 보세요.', blank=False)
    if not ch:
        s.text('‘왜냐하면 이 각은 직각보다 ~고, 한 변이 ~ 눈금 0에 맞춰져 있기 때문이에요.’')
    s.lines(1)
    s.step('④ 약속하기 — 1도(°)')
    if not ch:
        s.wordbox(['각도', '90', '1°', '90°'])
    s.fill(['각의 크기를 %s라고 해요.' % B, '직각의 크기를 똑같이 %s으로 나눈 것 중 하나를 1도라 하고, %s라고 써요.' % (B, B),
            '직각의 크기는 %s예요.' % B])
    s.step('⑤ 확인하기 — 놓인 모양이 달라도')
    figk(s, row([single(125, 210, 180, label='④', arc=30), single(65, 340, 200, label='⑤', arc=30), single(100, 40, 75, label='⑥', arc=22)], 40), .135)
    s.ask('④       °      ⑤       °      ⑥       °', blank=False)
    if not ch:
        s.text('⑥은 변이 짧아요. 자로 변을 곧게 늘인 다음 재어요.')
    ans = '3차시  ① 50°   ② ① 35° ② 110° ③ 75°   ③ 다, 70° / 왜: (예) 이 각은 직각보다 작고, 한 변이 안쪽 눈금 0에 맞춰져 있어서 안쪽 눈금 70을 읽어야 하기 때문이에요   ④ 각도, 90, 1°, 90°   ⑤ ④ 125° ⑤ 65° ⑥ 100°'
    if ch:
        s.step('⑥ 도전하기', '설계도에 그린 놀이기구의 각도')
        ps = []
        for n, a, cc in [('미끄럼틀 사다리와 땅', 75, '#6E7C86'), ('철봉 기둥과 땅', 90, '#2E8B57'), ('흔들의자 등받이와 앉는 판', 120, '#B4610F')]:
            k = C()
            if a != 120:
                k.rect(-40, 0, 260, 30, '#E7F2DE')
            angle(k, (0, 0), 0, a, 170, col=cc, arc=False, fill=None)
            k.text((k.x0 + k.x1) / 2, k.y0 - 22, n, 20, bold=True)
            ps.append(k)
        figk(s, row(ps, 40), .135)
        s.ask('사다리 (     )°   철봉 (     )°   흔들의자 (     )°', blank=False)
        ans += '   ⑥ 75°, 90°, 120°'
    return ans


def st4(s, ch):
    s.lesson(4, '개념 구축하기(O)', '놀이기구 각 나누기 ― 예각과 둔각', '놀이기구의 각을 직각과 비교하면 어떻게 나눌 수 있을까요?')
    s.scene(None, '수아 모둠이 놀이기구에서 찾은 각이에요.')
    s.step('① 만져 보기 — 직각과 비교해 나누기', '삼각자의 직각을 대 봐요')
    its = [('가 정글짐', 0, 90, 1), ('나 시소', 160, 25, 1), ('다 미끄럼틀 위', 200, 130, 1), ('라 그네 기둥', 245, 50, 1.2), ('마 흔들의자', 10, 110, .6)]
    figk(s, cards([{'d1': d, 'a': a, 'L2r': r, 'label': n} for n, d, a, r in its], 175, 145), .17)
    s.table([['직각보다 작은 각', '직각', '직각보다 큰 각'], ['', '', '']], row_h=3400)
    s.step('② 그려 보기 — 예각·둔각 만들기', '주어진 선분을 한 변으로')
    figk(s, straight_board(), .17)
    if not ch:
        s.text('직각보다 작은 각과, 직각보다 크고 일직선보다 작은 각을 그려요.')
    s.page_break()
    s.step('③ 말해 보기 — 직각에 아주 가까워도')
    s.text('15°     90°     89°     135°     100°')
    s.ask('직각보다 작은 각도:              직각보다 크고 180°보다 작은 각도:              ', blank=False)
    s.ask('왜 그럴까요? 89°는 직각에 아주 가까운데도 왜 직각보다 작은 각일까요?', blank=False)
    if not ch:
        s.text('‘왜냐하면 직각은 ~°이고 89°는 그보다 ~ 작기 때문이에요.’')
    s.lines(1)
    s.step('④ 약속하기 — 예각과 둔각')
    if not ch:
        s.wordbox(['예각', '둔각', '180°', '예각도 둔각도 아니에요'])
    s.fill(['각도가 0°보다 크고 직각보다 작은 각을 %s이라고 해요.' % B,
            '각도가 직각보다 크고 %s보다 작은 각을 %s이라고 해요.' % (B, B), '90°는 %s.' % B])
    s.step('⑤ 확인하기 — 놀이터 시계탑')
    if ch:
        figk(s, row([col([clock(), C().text(0, 0, '10시', 24, bold=True)], 10), col([clock(), C().text(0, 0, '1시 30분', 24, bold=True)], 10)], 70), .14)
        s.text('시계에 바늘을 그려 넣고, 두 바늘이 이루는 작은 쪽의 각이 예각인지 둔각인지 써 보세요.')
    else:
        figk(s, row([col([clock(10, 0), C().text(0, 0, '10시', 24, bold=True)], 10), col([clock(1, 30), C().text(0, 0, '1시 30분', 24, bold=True)], 10)], 70), .14)
        s.text('주황색으로 칠한 작은 쪽의 각을 직각과 비교해요.')
    s.table([['시각', '10시', '1시 30분'], ['예각 / 둔각', '', '']])
    assert kind(clock_angle(10, 0)) == '예각' and kind(clock_angle(1, 30)) == '둔각'
    ans = '4차시  ① 직각보다 작은 각: 나, 라 / 직각: 가 / 직각보다 큰 각: 다, 마   ② 직각보다 작은 각과 직각보다 크고 일직선보다 작은 각(여러 가지)   ③ 작은 각 15°, 89° / 큰 각 135°, 100° / 왜: (예) 직각은 90°이고 89°는 90°보다 1°만큼 작기 때문이에요   ④ 예각, 180°, 둔각, 예각도 둔각도 아니에요   ⑤ 10시 예각(%d°), 1시 30분 둔각(%d°)' % (clock_angle(10, 0), clock_angle(1, 30))
    if ch:
        s.step('⑥ 도전하기', '한 점에서 그은 반직선 4개')
        c = C()
        for d in [0, 50, 120, 180]:
            c.line((0, 0), pt((0, 0), d, 240))
        c.circle((0, 0), 6)
        figk(s, c, .17)
        s.ask('예각은 몇 개, 둔각은 몇 개인가요?')
        s.ask('일직선을 이루는 두 반직선은 왜 세지 않을까요?', blank=False)
        s.lines(1)
        ans += '   ⑥ 예각 3개(50°, 70°, 60°), 둔각 2개(120°, 130°) / 일직선(180°)은 예각도 둔각도 아니기 때문이에요'
    return ans


def st5(s, ch):
    s.lesson(5, '개념 구축하기(O)', '눈대중 각도왕 ― 각도 어림하기', '각도기 없이 놀이기구의 각도를 어떻게 어림할 수 있을까요?')
    s.scene(None, '민재가 ‘눈대중 각도왕’ 놀이를 열었어요.')
    s.step('① 만져 보기 — 어림하고 재기')
    s.ask('먼저 예상해요: 각도를 잘 어림하려면 무엇과 비교하면 좋을까요?', blank=False)
    if not ch:
        s.text('‘내 예상: ~처럼 크기를 아는 각과 비교하면 좋을 것 같아요.’')
    s.lines(1)
    ps = []
    for n, a, cc in [('시소 판과 땅', 25, '#C9962A'), ('사다리와 땅', 75, '#6E7C86')]:
        k = C()
        k.rect(-40, 0, 300, 30, '#E7F2DE')
        angle(k, (0, 0), 0, a, 230, col=cc, arc=34)
        k.text((k.x0 + k.x1) / 2, k.y0 - 22, n, 20, bold=True)
        ps.append(k)
    figk(s, row(ps, 60), .17)
    s.table(est_table(['시소', '사다리']))
    s.ask('예상이 맞았나요?  ( 맞았어요 / 달랐어요 )', blank=False)
    s.step('② 그려 보기 — 어림해 만들기', '각도기를 보지 않고 그린 다음 재기')
    sb = C()
    for i, t in enumerate(['약 35°', '약 140°']):
        k = C()
        k.line((0, 0), (220, 0), INK, 5)
        k.circle((0, 0), 6)
        k.see((-150, -180), (240, 30))
        k.text(-120, -160, t, 24, RED, bold=True)
        sb.put(k, i * 470, 0)
    figk(s, sb, .15)
    s.table([['', '약 35°', '약 140°'], ['그린 각을 잰 각도', '(     )°', '(     )°']])
    s.page_break()
    s.step('③ 말해 보기 — 어림한 까닭')
    if ch:
        s.fill(['시소의 각은 삼각자의 %s보다 조금 작은 것 같아서 약 25°, 사다리의 각은 %s보다 크고 %s보다 조금 작은 것 같아서 약 75°로 어림했어요.' % (B, B, B)])
    else:
        s.fill(['시소의 각은 삼각자의 %s보다 조금 작은 것 같아서 약 25°로 어림했어요.' % CH('30°', '60°', '90°'),
                '사다리의 각은 %s보다 크고 %s보다 조금 작은 것 같아서 약 75°로 어림했어요.' % (CH('60°', '30°'), CH('직각', '45°'))])
    s.ask('왜 그럴까요? 어림한 각도에 왜 ‘약’을 붙일까요?', blank=False)
    if not ch:
        s.text('‘왜냐하면 어림한 각도는 ~ 값이라 ~이 아니기 때문이에요.’')
    s.lines(1)
    s.step('④ 약속하기 — 어림하는 방법')
    if not ch:
        s.wordbox(['약 40°', '삼각자의 30°, 45°, 60°와 직각 90°', '각도기로 재어'])
    s.fill(['어림한 각도는 %s처럼 나타내요.' % B, '어림할 때는 %s를 기준으로 비교하고, %s 확인해요.' % (B, B)])
    s.step('⑤ 확인하기 — 각도왕 도전')
    figk(s, row([single(55, 200, 200, label='①', arc=30), single(115, 20, 190, label='②', arc=30)], 70), .16)
    s.table(est_table(['①', '②']))
    ans = '5차시  ① 예상: (생각 쓰기 — 예: 직각이나 삼각자의 30°, 45°, 60°처럼 크기를 아는 각) / 시소 25°, 사다리 75° (어림은 가까우면 정답)   ② 그린 각을 재어 35°, 140°에 가까우면 잘 어림함   ③ 30°, 60°, 직각 / 왜: (예) 어림한 각도는 눈으로 짐작한 값이라 정확한 각도가 아니기 때문이에요   ④ 약 40°, 삼각자의 30°, 45°, 60°와 직각 90°, 각도기로 재어   ⑤ ① 55° ② 115°'
    if ch:
        s.step('⑥ 도전하기', '눈대중 각도왕 결승')
        s.picture(png(protfig(65)), width_mm=58)
        s.ask('민재는 약 60°, 지유는 약 80°로 어림했어요. 각도기로 재어 보니 그림과 같았어요. 어림을 더 잘한 사람은?')
        s.ask('미끄럼틀 각이 120°였어요. 하린 약 110°, 서준 약 125°, 도윤 약 135°로 어림했어요. 가장 잘 어림한 사람과 그 까닭을 써 보세요.', blank=False)
        s.lines(1)
        d = {'하린': abs(110 - 120), '서준': abs(125 - 120), '도윤': abs(135 - 120)}
        best = min(d, key=d.get)
        ans += '   ⑥ 민재(잰 각도 65°, 민재 5°·지유 15° 차이) / %s(차이 %d°로 가장 작아요)' % (best, d[best])
    return ans


def st6(s, ch):
    s.lesson(6, '개념 구축하기(O)', '울타리 모서리 각 ― 각도의 합과 차', '울타리 모서리의 두 각을 이어 붙이거나 겹치면 각도는 어떻게 될까요?')
    s.scene(None, '민재 모둠이 놀이터 울타리 모서리를 만들어요.')
    s.step('① 만져 보기 — 이어 붙이기', '55° 판(가)에 40° 판(나)')
    figk(s, join_fig('sum', 55, 40), .15)
    s.ask('이어 붙인 각 다의 각도를 각도기로 재어 보세요.')
    s.ask('식으로 나타내 보세요.   55° + 40° = (        )°', blank=False)
    s.step('② 그려 보기 — 겹쳐 보기', '140° 모서리(가)에 65° 화단 조각(나)')
    figk(s, join_fig('diff', 140, 65), .15)
    s.ask('겹치지 않고 남은 각 다는 몇 도인가요?')
    s.ask('식으로 나타내 보세요.   140° − 65° = (        )°', blank=False)
    s.page_break()
    s.step('③ 말해 보기 — 합과 차 구하는 방법')
    if ch:
        s.fill(['두 각도의 합은 %s과 같은 방법으로 계산하고, 두 각도의 차는 %s 빼서 구해요.' % (B, B)])
    else:
        s.fill(['두 각도의 합은 %s과 같은 방법으로 계산하고 단위 °를 붙여요.' % CH('자연수의 덧셈', '자연수의 뺄셈'),
                '두 각도의 차는 %s 빼서 구해요.' % CH('큰 각도에서 작은 각도를', '작은 각도에서 큰 각도를')])
    s.ask('왜 그럴까요? 이어 붙인 각을 구할 때 왜 두 각도를 더할까요?', blank=False)
    if not ch:
        s.text('‘왜냐하면 이어 붙인 각은 두 각을 ~ 합친 크기이기 때문이에요.’')
    s.lines(1)
    s.step('④ 약속하기 — 각도의 합과 차')
    s.fill(['55° + 40° = %s처럼 두 각도의 합은 수끼리 더하고 °를 붙여요.' % (CH('95°', '15°', '85°') if not ch else B),
            '140° − 65° = %s처럼 두 각도의 차는 큰 각도에서 작은 각도를 빼고 °를 붙여요.' % (CH('75°', '85°', '205°') if not ch else B)])
    s.step('⑤ 확인하기 — 울타리 각 계산')
    s.table([['68° + 47°', '85° + 95°', '132° − 58°', '175° − 90°'], ['(     )°', '(     )°', '(     )°', '(     )°']])
    if not ch:
        s.text('도움: 받아올림과 받아내림에 주의해요.')
    v = (68 + 47, 85 + 95, 132 - 58, 175 - 90)
    ans = '6차시  ① 95°, 55°+40°=95°   ② 75°, 140°−65°=75°   ③ 자연수의 덧셈, 큰 각도에서 작은 각도를 / 왜: (예) 이어 붙인 각은 두 각을 빈틈없이, 겹치지 않게 합친 크기이기 때문이에요   ④ 95°, 75°   ⑤ %d°, %d°, %d°, %d°' % v
    if ch:
        s.step('⑥ 도전하기', '회전 놀이기구 바닥판과 그네')
        figk(s, pinwheel_fig(), .15)
        s.table([['직각 조각', '1장', '2장', '3장', '4장'], ['이루는 각도', '(    )°', '(    )°', '(    )°', '(    )°']])
        s.ask('그네가 뒤로 35°, 앞으로 50° 흔들렸어요. 뒤 끝에서 앞 끝까지 그네 줄이 움직인 각도는?')
        s.ask('미끄럼틀이 바닥과 이루는 각을 45°에서 30°로 낮추었어요. 몇 도 낮추었나요?')
        ans += '   ⑥ 90°, 180°, 270°, 360° / %d° / %d°' % (35 + 50, 45 - 30)
    return ans


def st7(s, ch):
    s.lesson(7, '개념 구축하기(O)', '삼각형 화단 ― 세 각의 크기의 합', '삼각형 화단의 모양과 크기가 달라지면 세 각의 크기의 합도 달라질까요?')
    s.scene(None, '지유 모둠이 설계한 삼각형 화단이에요.')
    s.step('① 만져 보기 — 세 각 재기')
    c, _ = polyfig([45, 60, 75], [10], ['㉮', '㉯', '㉰'], size=420, fill='#E9F5DD')
    figk(s, c, .25)
    s.table([['각', '㉮(왼쪽 아래)', '㉯(오른쪽 아래)', '㉰(위쪽)', '세 각의 합'], ['각도', '(     )°', '(     )°', '(     )°', '(     )°']])
    s.step('② 그려 보기 — 화단 모양 바꾸기')
    s.ask('먼저 예상해요: 화단의 모양과 크기를 바꾸면 세 각의 크기의 합은 (달라질 / 그대로일) 것 같아요.', blank=False)
    c2, _ = polyfig([60, 80, 40], [10], None, size=230, fill='#F2F8EA')
    figk(s, c2, .19)
    s.text('위 화단의 세 각을 재고, 빈 곳에 모양과 크기가 다른 삼각형 화단을 하나 그려 세 각을 재어 보세요.')
    s.table([['', '각 ①', '각 ②', '각 ③', '세 각의 합'], ['위 화단', '(     )°', '(     )°', '(     )°', '(     )°'], ['내가 그린 화단', '(     )°', '(     )°', '(     )°', '(     )°']])
    s.page_break()
    s.step('③ 말해 보기 — 잘라 붙이기')
    t3, _ = polyfig([50, 75, 55], [10], None, size=240, wedges=True, r=26)
    figk(s, row([t3, fan([(50, '①'), (75, '②'), (55, '③')], R=140)], 70), .17)
    s.ask('왜 그럴까요? 세 각을 한 점에 모으면 왜 합이 180°라고 할 수 있나요?', blank=False)
    if not ch:
        s.text('‘왜냐하면 세 각을 모으면 ~이 되는데, ~이 이루는 각은 ~°이기 때문이에요.’')
    s.lines(1)
    s.step('④ 약속하기 — 삼각형 세 각의 합')
    if not ch:
        s.wordbox(['180°', '같아요', '빼서'])
    s.fill(['삼각형의 세 각의 크기의 합은 %s예요. 삼각형의 크기와 모양이 달라도 세 각의 크기의 합은 %s.' % (B, B),
            '두 각을 알면 180°에서 두 각을 %s 나머지 한 각을 구해요.' % B])
    s.step('⑤ 확인하기 — 화단의 빈 각')
    f1, _ = polyfig([40, 75, 65], [10], ['40°', '75°', '㉠'], size=260)
    f2, _ = polyfig([100, 30, 50], [10], ['100°', '㉡', '50°'], size=260)
    figk(s, row([f1, f2], 60), .14)
    s.ask('㉠ = (        )°        ㉡ = (        )°', blank=False)
    ans = '7차시  ① 45°, 60°, 75°, 합 180°   ② 예상: (생각 쓰기) / 60°, 80°, 40°, 합 180° / 그린 화단도 합 180°   ③ 왜: (예) 세 각을 모으면 일직선이 되는데, 일직선이 이루는 각은 180°이기 때문이에요   ④ 180°, 같아요, 빼서   ⑤ ㉠ %d°, ㉡ %d°' % (180 - 40 - 75, 180 - 100 - 50)
    if ch:
        s.step('⑥ 도전하기', '화단 문제 해결하기')
        f3, _ = polyfig([90, 25, 65], [10], ['R', '25°', '㉠'], size=230)
        figk(s, row([f3, fan([(70, '70°'), (50, '50°'), (60, '□')], R=130)], 60), .14)
        s.ask('직각삼각형 화단에서 ㉠ = (        )°      잘라 붙인 세 각에서 □ = (        )°', blank=False)
        s.ask('도윤이가 “큰 화단은 세 각의 크기의 합도 더 커.”라고 말했어요. 바르게 고쳐 써 보세요.', blank=False)
        s.lines(1)
        ans += '   ⑥ %d°, %d° / 화단의 크기가 달라도 세 각의 크기의 합은 180°로 같아요' % (180 - 90 - 25, 180 - 70 - 50)
    return ans


def st8(s, ch):
    s.lesson(8, '개념 구축하기(O)', '사각형 모래밭 ― 네 각의 크기의 합', '사각형 모래밭의 네 각의 크기의 합은 얼마일까요?')
    s.scene(None, '서준 모둠이 설계한 사각형 모래밭이에요.')
    s.step('① 만져 보기 — 네 각 재기')
    c, _ = polyfig([70, 95, 110, 85], [9, 6], ['㉮', '㉯', '㉰', '㉱'], size=400, fill='#F7E8CC')
    figk(s, c, .25)
    s.table([['각', '㉮', '㉯', '㉰', '㉱', '네 각의 합'], ['각도', '(    )°', '(    )°', '(    )°', '(    )°', '(     )°']])
    s.step('② 그려 보기 — 잘라 붙이기')
    q2, _ = polyfig([60, 120, 75, 105], [10, 8], None, size=230, wedges=True, r=24)
    figk(s, row([q2, fan([(60, '①'), (120, '②'), (75, '③'), (105, '④')], full=360, R=120)], 70), .16)
    if ch:
        s.ask('네 각을 모은 모양을 보고 네 각의 크기의 합을 써 보세요.')
    else:
        s.choices([('네 각을 한 점에 모으면?', CH('일직선', '한 바퀴')), ('한 바퀴는 몇 도?', CH('180°', '360°'))])
    s.page_break()
    s.step('③ 말해 보기 — 삼각형 2개로 나누기')
    q3, _ = polyfig([80, 100, 65, 115], [6, 7], None, size=250, diag=True, fill='#F7F1E3')
    figk(s, q3, .15)
    s.ask('(      )° + (      )° = (      )°', blank=False)
    s.ask('왜 그럴까요? 사각형의 네 각의 크기의 합을 180°+180°로 구할 수 있는 까닭을 써 보세요.', blank=False)
    if not ch:
        s.text('‘왜냐하면 사각형은 ~ 2개로 나눌 수 있고, ~ 하나의 세 각의 합이 ~°이기 때문이에요.’')
    s.lines(1)
    s.step('④ 약속하기 — 사각형 네 각의 합')
    if not ch:
        s.wordbox(['360°', '2개', '같아요'])
    s.fill(['사각형의 네 각의 크기의 합은 %s예요.' % B, '사각형은 삼각형 %s로 나눌 수 있어서 180°+180°로 구할 수 있어요.' % B,
            '사각형의 크기와 모양이 달라도 네 각의 크기의 합은 %s.' % B])
    s.step('⑤ 확인하기 — 모래밭의 빈 각')
    f1, _ = polyfig([65, 120, 75, 100], [6, 4], ['65°', '120°', '75°', '㉠'], size=250)
    f2, _ = polyfig([95, 85, 110, 70], [6, 5], ['95°', '㉡', '110°', '70°'], size=250)
    figk(s, row([f1, f2], 60), .14)
    s.ask('㉠ = (        )°        ㉡ = (        )°', blank=False)
    if not ch:
        s.text('도움: 360°에서 주어진 세 각을 빼요.')
    ans = '8차시  ① 70°, 95°, 110°, 85°, 합 360°   ② 한 바퀴, 360°   ③ 180°+180°=360° / 왜: (예) 사각형은 대각선을 그어 삼각형 2개로 나눌 수 있고, 삼각형 하나의 세 각의 크기의 합이 180°이기 때문이에요   ④ 360°, 2개, 같아요   ⑤ ㉠ %d°, ㉡ %d°' % (360 - 65 - 120 - 75, 360 - 95 - 110 - 70)
    if ch:
        s.step('⑥ 도전하기', '네 각의 합으로 문제 해결하기')
        f3, _ = polyfig([85, 75, 120, 80], [6, 6], ['㉠', '㉡', '120°', '80°'], size=230)
        figk(s, row([f3, fan([(95, '95°'), (100, '100°'), (75, '75°'), (90, '□')], full=360, R=120)], 60), .14)
        s.ask('㉠ + ㉡ = (        )°      잘라 붙인 네 각에서 □ = (        )°', blank=False)
        ans += '   ⑥ %d°, %d°' % (360 - 120 - 80, 360 - 95 - 100 - 75)
    return ans


def st9(s, ch):
    s.lesson(9, '탐구 정리하기(O)', '로봇 청소기 길 만들기 ― 회전한 각', '로봇 청소기가 놀이기구까지 가도록 회전 각도를 어떻게 정할까요?')
    mp = mapPark()
    assert run_cmds(mp, [(0, 4), (50, 3), (-50, 3)]) == '그네'
    assert run_cmds(mp, [(0, 4), (-40, 3), (40, 3)]) == '모래밭'
    assert run_cmds(mp, [(0, 4), (-40, 3), (-70, 2)]) == '시소'
    assert run_cmds(mp, [(0, 4), (50, 3), (60, 2)]) == '미끄럼틀'
    s.scene(None, None)
    cm_fig(s, mapfig(mp, 46), 46)
    s.step('① 만져 보기 — 명령대로 움직이기', '한 칸 1 cm')
    s.fill(['① 앞으로 4 cm 이동   ② 왼쪽으로 50°만큼 회전하여 3 cm 이동   ③ 오른쪽으로 50°만큼 회전하여 3 cm 이동'])
    if ch:
        s.ask('로봇 청소기가 도착하는 곳은 어디인가요?')
    else:
        s.text('도움: 왼쪽·오른쪽은 로봇이 바라보는 방향을 기준으로 정해요.')
        s.choices([('로봇 청소기가 도착하는 곳은?', CH('그네', '미끄럼틀', '정글짐'))])
    s.step('② 그려 보기 — 회전한 각 재기')
    figk(s, row([col([turnfig(180, 50, 50, '①에서 온 길'), C().text(0, 0, '그네로 갈 때 ②', 20, bold=True)], 8),
                 col([turnfig(140, 70, 250, '앞에서 온 길'), C().text(0, 0, '시소로 갈 때 마지막', 20, bold=True)], 8)], 60), .08)
    s.ask('그네 ② (      )°     시소 마지막 (      )°', blank=False)
    s.step('③ 말해 보기 — 명령어 바꾸기', '모래밭으로 가려면')
    cmds(s, [4, ('오른쪽', 40, 3), ('왼쪽', 40, 3)], {2: 'both', 3: 'both'})
    if not ch:
        s.text('도움: 모래밭은 처음 길보다 아래쪽에 있어요. ③에서는 처음 이동한 방향과 같은 쪽을 보게 돼요.')
    s.page_break()
    s.step('④ 약속하기 — 회전한 각')
    if not ch:
        s.wordbox(['보조선', '로봇이 가던 방향', '40°', '140°'])
    s.fill(['로봇이 회전한 각도는 가던 방향을 곧게 늘인 %s과 새로 가는 길 사이의 각이에요.' % B,
            '왼쪽과 오른쪽은 %s을 기준으로 정해요.' % B, '오른쪽으로 40° 돈 다음 왼쪽으로 %s 돌면 처음 방향으로 돌아와요.' % B])
    s.step('⑤ 확인하기 — 시소까지', '③의 방향은 정해져 있어요')
    cmds(s, [4, ('오른쪽', 40, 3), ('오른쪽', 70, 2)], {2: 'both', 3: 'deg'})
    if not ch:
        s.text('도움: ③에서 회전한 각은 ②에서 재어 본 각이에요.')
    ans = '9차시  ① 그네   ② 50°, 70°   ③ ② 오른쪽 40° ③ 왼쪽 40°   ④ 보조선, 로봇이 가던 방향, 40°   ⑤ ② 오른쪽 40° ③ (오른쪽) 70°'
    if ch:
        s.step('⑥ 도전하기', '미끄럼틀로 가는 명령어 만들기')
        cmds(s, [4, ('왼쪽', 50, 3), ('왼쪽', 60, 2)], {2: 'both', 3: 'both'})
        s.ask('처음 방향에서 모두 몇 도만큼 돌았나요? 식으로 나타내 보세요.', blank=False)
        s.lines(1)
        ans += '   ⑥ ② 왼쪽 50° ③ 왼쪽 60° / 50°+60°=110°'
    return ans


def st10(s, ch):
    s.lesson(10, '발표하기(P)', '놀이터 바닥 놀이 ― 각을 그려 도착 변까지!', '주사위 눈에 맞게 예각과 둔각을 그려 도착 변에 먼저 닿으려면 어떻게 해야 할까요?')
    s.scene(None, '설계단이 놀이터 바닥에 그릴 놀이판을 시험해요. 1·3·5가 나오면 예각, 2·4·6이 나오면 둔각을 그려요. 출발 변이나 앞에 그린 변을 한 변으로 하고, 새 변은 3 cm와 같거나 짧게 두 점을 이어요.')
    s.step('① 만져 보기 — 놀이 규칙 알기')
    if ch:
        s.ask('주사위를 굴려 6이 나왔어요. 어떤 각을 그려야 하나요?')
        s.ask('3이 나왔어요. 어떤 각을 그려야 하나요?')
        s.ask('주사위가 2일 때 직각을 그려도 될까요? 까닭도 써 보세요.', blank=False)
        s.lines(1)
    else:
        s.choices([('주사위를 굴려 6이 나왔어요.', CH('예각', '둔각')), ('3이 나왔어요.', CH('예각', '둔각')),
                   ('새 변은 어떻게 그릴까요?', CH('3 cm와 같거나 짧게', '3 cm보다 길게')), ('2가 나왔을 때 직각을 그려도 될까요?', CH('안 돼요', '돼요'))])
    s.step('② 그려 보기 — 연습하기', '둔각 → 예각 → 둔각을 차례로 그리기(점 사이 1 cm)')
    cm_fig(s, dice_board(50, small=True), 50)
    s.page_break()
    s.step('③ 말해 보기 — 놀이하기', '짝과 번갈아 도착 변까지')
    cm_fig(s, dice_board(50), 50)
    s.text('도착할 때까지 그린 횟수: 나 (      )번      짝 (      )번')
    s.step('④ 약속하기 — 이기는 전략')
    if ch:
        s.fill(['주사위 눈이 1, 3, 5이면 %s, 2, 4, 6이면 %s을 그려요. 앞으로 쭉 나아가려면 %s을 그려요.' % (B, B, B)])
    else:
        s.fill(['주사위 눈이 1, 3, 5이면 %s, 2, 4, 6이면 %s을 그려요.' % (CH('예각', '둔각'), CH('둔각', '예각')),
                '앞으로 쭉 나아가려면 %s을 그리고, 새 변은 3 cm에 %s 그려요.' % (CH('둔각', '예각'), CH('가깝게 길게', '될 수 있는 대로 짧게'))])
    s.ask('왜 그럴까요? 앞으로 쭉 나아가려면 왜 둔각을 그리면 좋을까요?', blank=False)
    if not ch:
        s.text('‘왜냐하면 둔각은 두 변이 ~ 벌어져서 ~ 때문이에요.’')
    s.lines(1)
    s.step('⑤ 확인하기 — 그릴 수 있는 변', '주사위 4')
    cm_fig(s, cand_fig(CANDS_ST, range(0, 7), 46), 46)
    ok = drawable(CANDS_ST, '둔각')
    assert ok == ['가', '마'], ok
    s.ask('그릴 수 있는 새 변을 모두 찾아 기호를 써 보세요.')
    if not ch:
        s.text('도움: 4는 짝수라서 둔각이에요. 새 변이 3 cm보다 길면 그릴 수 없어요.')
    ans = '10차시  ① 둔각, 예각, 3 cm와 같거나 짧게, 안 돼요(직각은 둔각이 아님)   ② 둔각·예각·둔각 차례로 그림   ③ 놀이   ④ 예각, 둔각, 둔각, 가깝게 길게 / 왜: (예) 둔각은 두 변이 많이 벌어져서, 새 변이 앞의 변과 비슷한 방향으로 계속 뻗어 나가기 때문이에요   ⑤ %s (나·바는 예각, 다는 직각, 라는 둔각이지만 3 cm보다 김)' % ', '.join(ok)
    if ch:
        s.page_break()
        s.step('⑥ 도전하기', '또 다른 놀이 — 빨대 튕기기')
        s.picture(png(straw_fig()), width_mm=40)
        s.text('주사위 눈이 1·3·5이면 ‘예각’, 2·4·6이면 ‘둔각’을 외치고 빨대를 튕겨요. 파란 선과 빨대가 이루는 각이 외친 각이면 1점이에요.')
        s.table([['판', '1', '2', '3', '4', '5'], ['외친 각', '', '', '', '', ''], ['빨대가 만든 각', '', '', '', '', ''], ['점수', '', '', '', '', '']])
        ans += '   ⑥ 놀이 (그림의 빨대와 파란 선이 이루는 각은 둔각)'
    return ans


def st11(s, ch):
    s.lesson(11, '발표하기(P)', '놀이터 설계도 발표회', '우리 반 놀이터 설계도에 담긴 각을 친구들에게 어떻게 설명할까요?')
    s.step('① 만져 보기 — 설계도 점검 ① 각도 재기')
    c1 = cards([{'d1': 245, 'a': 50, 'L2r': 1}, {'d1': 10, 'a': 115, 'L2r': .5, 'maxL': 120}], 190, 150)
    k = C()
    k.rect(-40, 0, 270, 30, '#E7F2DE')
    angle(k, (0, 0), 0, 35, 210, col=TENT, arc=30)
    k.text(k.x0 + 20, k.y0 - 10, '㉮', 26, RED, bold=True)
    m2 = single(130, 160, 170, label='㉯', arc=30)
    figk(s, row([c1, k, m2], 40), .13)
    s.ask('그네 기둥 사이의 각(가)과 흔들의자의 각(나) 중 더 큰 각은?')
    s.ask('㉮ 미끄럼판과 바닥 (      )°      ㉯ 울타리 모서리 (      )°', blank=False)
    s.step('② 그려 보기 — 설계도 점검 ② 예각과 둔각')
    its = [('가 미끄럼판', 0, 35, 1), ('나 울타리', 20, 115, 1), ('다 그네 기둥', 245, 50, 1), ('라 화단 모서리', 180, 105, .7), ('마 시소', 0, 20, 1.3)]
    figk(s, cards([{'d1': d, 'a': a, 'L2r': r, 'label': n} for n, d, a, r in its], 175, 145), .17)
    s.table([['예각', '둔각'], ['', '']])
    s.step('③ 말해 보기 — 설계도 점검 ③ 화단과 울타리')
    f1, _ = polyfig([70, 55, 55], [10], ['70°', '55°', '㉠'], size=240)
    f2, _ = polyfig([100, 95, 75, 90], [6, 5], ['100°', '㉡', '75°', 'R'], size=240)
    figk(s, row([f1, f2], 60), .13)
    s.ask('삼각형 화단 ㉠ = (      )°    사각형 모래밭 ㉡ = (      )°    울타리 75° + 48° = (      )°', blank=False)
    s.page_break()
    s.step('④ 약속하기 — 발표회장 가는 길', '갈림길마다 맞는 답')
    g1 = protfig(35, label='①')
    g3, _ = polyfig([80, 45, 55], [10], ['80°', '45°', '?'], size=220)
    g5, _ = polyfig([90, 90, 75, 105], [6, 5], ['R', 'R', '75°', '?'], size=220)
    figk(s, row([g1, col([C().text(0, 0, '③', 26, RED, bold=True), g3], 4), col([C().text(0, 0, '⑤', 26, RED, bold=True), g5], 4)], 40), .11)
    if ch:
        s.ask('① 설계도 미끄럼틀의 각도 (      )°   ② 115°로 벌어진 그네 기둥의 각은 (예각 / 둔각)', blank=False)
        s.ask('③ ? = (      )°   ④ 125° + 35° = (      )°   ⑤ ? = (      )°', blank=False)
    else:
        s.choices([('① 미끄럼틀의 각도는?', CH('35°', '145°')), ('② 그네 기둥 115°는?', CH('예각', '둔각')), ('③ 삼각형 화단의 ?는?', CH('55°', '65°')),
                   ('④ 125° + 35° = ?', CH('160°', '90°')), ('⑤ 사각형 모래밭의 ?는?', CH('105°', '95°'))])
    s.step('⑤ 확인하기 — 설계도 발표하기', '1차시 ‘궁금해요’ 쪽지를 다시 보고')
    s.ask('우리 모둠 놀이터 설계도에서 각을 이용한 곳 한 가지를 각도와 함께 소개해 보세요.', blank=False)
    if not ch:
        s.text('‘우리 모둠은 ~의 각을 ~°로 정했어요. 왜냐하면 ~’ 꼴로 써요.')
    s.lines(2)
    s.ask('1차시에 궁금했던 것 하나를 골라, 이제 어떻게 답할 수 있는지 써 보세요.', blank=False)
    if not ch:
        s.text('‘(궁금했던 것)은 ~하면 알 수 있어요.’ 꼴로 써요.')
    s.lines(2)
    ans = '11차시  ① 나 / ㉮ 35°, ㉯ 130°   ② 예각: 가, 다, 마 / 둔각: 나, 라   ③ ㉠ %d°, ㉡ %d°, %d°   ④ 35° → 둔각 → %d° → %d° → %d°   ⑤ (예) 우리 모둠은 미끄럼틀이 바닥과 이루는 각을 35°로 정했어요. 예각이지만 너무 가파르지 않아 안전해요 / 각도기의 중심을 꼭짓점에, 밑금을 바닥에 맞추고 0에서 시작하는 쪽 눈금을 읽으면 알 수 있어요' % (
        180 - 70 - 55, 360 - 100 - 75 - 90, 75 + 48, 180 - 80 - 45, 125 + 35, 360 - 90 - 90 - 75)
    if ch:
        s.step('⑥ 도전하기', '가장 큰 각과 가장 작은 각 / 각도기 없이 ㉠ + ㉡')
        h1, h2, h3 = single(65, 15, 160, label='가', arc=28), single(25, 100, 180, label='나', arc=28), single(140, 200, 150, label='다', arc=28)
        f3, _ = polyfig([55, 50, 75], [10], ['㉠', '㉡', '75°'], size=200)
        figk(s, row([h1, h2, h3, f3], 30), .12)
        s.ask('가 (     )°  나 (     )°  다 (     )°  →  가장 큰 각과 가장 작은 각의 합 (     )°, 차 (     )°', blank=False)
        s.ask('㉠ + ㉡ = (        )°   어떻게 구했는지 써 보세요.', blank=False)
        s.lines(1)
        ans += '   ⑥ 가 65°, 나 25°, 다 140° / 합 %d°, 차 %d° / ㉠+㉡=%d° (180°−75°)' % (140 + 25, 140 - 25, 180 - 75)
    return ans


# ================================================================ 만들기
TB = [tb1, tb2, tb3, tb4, tb5, tb6, tb7, tb8, tb9, tb10, tb11]
ST = [st1, st2, st3, st4, st5, st6, st7, st8, st9, st10, st11]
NOTE_FIG = '※ 그림의 각은 적힌 각도 그대로 그렸어요. 9차시 지도와 10차시 놀이판은 한 칸(점 사이)이 1 cm예요. A4 원본 크기(100%)로 인쇄하세요.'


def build(ver, lvl):
    label = '4-1 수학 2. 각도(%s)' % ('교과서 차시' if ver == 'tb' else '이야기 버전')
    s = S(unit_label=label, level=LV[lvl], grade_label='4학년')
    ch = lvl == 'chal'
    keys = [f(s, ch) for f in (TB if ver == 'tb' else ST)]
    keys.append(NOTE_FIG)
    s.answers('【교사용】 2. 각도(%s) 활동지 정답 (%s)' % ('교과서 차시' if ver == 'tb' else '이야기 버전', LV[lvl]), keys,
              note='※ 이 활동지는 앱 u2-angle.html과 차시 번호가 같습니다.')
    out = os.path.join(OUT_TB if ver == 'tb' else OUT_ST, '2단원_각도_활동지_%s.hwpx' % LV[lvl])
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
