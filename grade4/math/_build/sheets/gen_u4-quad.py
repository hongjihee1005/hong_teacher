# -*- coding: utf-8 -*-
"""4-2 수학 4. 사각형 활동지(HWPX) 만들기 — 교과서 차시 버전 · 이야기 버전 × 기본형 · 도전형

    python3 gen_u4-quad.py

앱 원본 ../units/sem2/u4-quad.tb.js('하율이의 놀이공원 사각형', 11차시)·u4-quad.st.js('우리 반 학교 지도 만들기', 11차시)의
차시 번호·제목·S.O.O.P.·탐구 질문·이야기·수·도형 좌표를 그대로 따릅니다.

- 사각형 이름(사다리꼴·평행사변형·마름모·직사각형·정사각형)과 평행·수직·길이는 앱의 q4Info와 같은 계산으로 좌표에서 구하고,
  앱에 적힌 정답과 같은지 확인합니다(다르면 멈춤).
- 학생이 자로 재거나 긋는 그림(점 종이, 평행선 사이의 거리, 삼각자로 수선·평행선 긋기, 직사각형·정사각형 재기,
  마름모 접기, 종이띠)은 **실제 크기**로 넣습니다: 1 cm = 40 px, 그림 너비(mm) = px ÷ 4. 점 종이 한 칸은 1 cm예요.
- 그림은 SVG로 그려 임시 폴더에서 PNG로 찍습니다(저장소에 남기지 않음). Chromium 하나를 띄워 모든 그림을 찍습니다.
"""
import json
import math
import os
import subprocess
import sys
import tempfile
from types import SimpleNamespace
from xml.sax.saxutils import escape

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from hwpxgen import Sheet  # noqa: E402

ROOT = os.path.normpath(os.path.join(HERE, '..', '..'))      # grade4/math
OUT_TB = os.path.join(ROOT, 'sem2', 'sheets')
OUT_ST = os.path.join(ROOT, 'sem2-soop', 'sheets')
NAME = '4단원_사각형_활동지_%s.hwpx'
WORK = tempfile.mkdtemp(prefix='u4quad_')
FONT = "'Noto Sans KR','WenQuanYi Zen Hei',sans-serif"
INK, TENT, SKY, RED, GREEN, GRAY, PUR = '#1D2A2A', '#E47A38', '#2B7BD6', '#D2463A', '#24965A', '#8795A1', '#7C4DBA'
FILL, LINE = '#FFF3E2', '#C9D4CF'
DOT = '#93A39C'
KO = ['가', '나', '다', '라', '마', '바', '사', '아']
V = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ']
U = 40            # 실제 크기 그림: 1 cm = 40 px

# ================================================================ 그림 찍기(Chromium 한 번만)
_NODE = r"""
const path = require('path');
const { chromium } = require(path.join(process.env.NPM_ROOT, 'playwright'));
const readline = require('readline');
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium' });
  const p = await b.newPage({ viewport: { width: 2600, height: 1200 }, deviceScaleFactor: 1 });
  const rl = readline.createInterface({ input: process.stdin });
  for await (const line of rl) {
    const m = JSON.parse(line);
    await p.setContent('<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#fff}' +
      '#w{display:inline-block;width:' + m.width + 'px;line-height:0}#w>svg{width:100%;height:auto;display:block}</style>' +
      '</head><body><div id="w">' + m.svg + '</div></body></html>');
    try { await p.evaluate(() => document.fonts.ready); } catch (e) {}
    await p.locator('#w').screenshot({ path: m.out });
    process.stdout.write('{"ok":1}\n');
  }
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
"""


class Shot:
    def __init__(self):
        self.proc, self.cache, self.n = None, {}, 0

    def _start(self):
        js = os.path.join(WORK, 'shot.js')
        with open(js, 'w') as f:
            f.write(_NODE)
        npm_root = subprocess.run(['npm', 'root', '-g'], capture_output=True, text=True).stdout.strip()
        self.proc = subprocess.Popen(['node', js], stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                                     env=dict(os.environ, NPM_ROOT=npm_root), text=True, bufsize=1)

    def png(self, svgtext, width_px):
        key = (svgtext, width_px)
        if key not in self.cache:
            if not self.proc:
                self._start()
            self.n += 1
            out = os.path.join(WORK, 'f%04d.png' % self.n)
            self.proc.stdin.write(json.dumps({'svg': svgtext, 'out': out, 'width': int(width_px)}, ensure_ascii=False) + '\n')
            self.proc.stdin.flush()
            if not self.proc.stdout.readline():
                raise RuntimeError('그림 찍기 실패')
            self.cache[key] = out
        return self.cache[key]

    def close(self):
        if self.proc:
            self.proc.stdin.close()
            self.proc.wait(timeout=60)


SHOT = Shot()


class Fig:
    """SVG 그림 한 장(px 크기를 기억)"""
    def __init__(self, w, h, body):
        self.w, self.h = w, h
        self.svg = ('<svg xmlns="http://www.w3.org/2000/svg" width="%s" height="%s" viewBox="0 0 %s %s">'
                    '<rect x="0" y="0" width="%s" height="%s" fill="#fff"/>%s</svg>') % (F(w), F(h), F(w), F(h), F(w), F(h), body)


def pic(s, fig, mm=120):
    """그림 넣기(지정한 너비 mm)"""
    assert mm <= 180, mm
    px = max(900, min(2400, int(fig.w * 2.2)))
    s.picture(SHOT.png(fig.svg, px), width_mm=mm)


def real(s, fig):
    """실제 크기 그림: 1 cm = 40 px"""
    mm = fig.w / U * 10
    assert mm <= 180, ('실제 크기 그림이 너무 넓어요', mm)
    px = max(900, min(2400, int(fig.w * 3)))
    s.picture(SHOT.png(fig.svg, px), width_mm=mm)


# ================================================================ 기하(앱 q4Info와 같은 계산)
def F(v):
    t = '%.2f' % v
    t = t.rstrip('0').rstrip('.')
    return '0' if t in ('-0', '') else t


def sub(a, b):
    return (a[0] - b[0], a[1] - b[1])


def cr(a, b):
    return a[0] * b[1] - a[1] * b[0]


def dt(a, b):
    return a[0] * b[0] + a[1] * b[1]


def ln_(v):
    return math.hypot(v[0], v[1])


def unit(v):
    l = ln_(v) or 1
    return (v[0] / l, v[1] / l)


def dist(a, b):
    return ln_(sub(a, b))


def rad(d):
    return d * math.pi / 180


def info(p):
    n = len(p)
    S = [sub(p[(i + 1) % n], p[i]) for i in range(n)]
    L = [ln_(v) for v in S]
    tol = 1e-7 * max(L) * max(L)
    par = lambda a, b: abs(cr(a, b)) <= tol
    eqL = lambda a, b: abs(a - b) <= 1e-7 * max(L)
    turns = [cr(S[i], S[(i + 1) % n]) for i in range(n)]
    simple = all(t > tol for t in turns) or all(t < -tol for t in turns)
    A = []
    for i in range(n):
        u = unit(sub(p[(i + n - 1) % n], p[i]))
        w = unit(sub(p[(i + 1) % n], p[i]))
        A.append(math.degrees(math.acos(max(-1, min(1, dt(u, w))))))
    I = SimpleNamespace(S=S, L=L, A=A, simple=simple)
    if n != 4:
        return I
    I.par02, I.par13 = par(S[0], S[2]), par(S[1], S[3])
    I.npar = int(I.par02) + int(I.par13)
    I.allEq = eqL(L[0], L[1]) and eqL(L[1], L[2]) and eqL(L[2], L[3])
    I.oppEq = eqL(L[0], L[2]) and eqL(L[1], L[3])
    I.rights = [abs(dt(S[i], S[(i + 3) % 4])) <= tol for i in range(4)]
    I.allRight = all(I.rights)
    I.oppAng = abs(A[0] - A[2]) < 1e-6 and abs(A[1] - A[3]) < 1e-6
    I.kind = ('bad' if not simple else 'none' if I.npar == 0 else 'trap' if I.npar == 1 else
              'sq' if I.allRight and I.allEq else 'rect' if I.allRight else 'rhom' if I.allEq else 'para')
    return I


KNAME = {'none': '평행한 변이 없는 사각형', 'trap': '사다리꼴', 'para': '평행사변형', 'rhom': '마름모', 'rect': '직사각형', 'sq': '정사각형'}
DEF = {'사다리꼴': lambda I: I.npar >= 1, '평행사변형': lambda I: I.npar == 2, '마름모': lambda I: I.allEq,
       '직사각형': lambda I: I.allRight, '정사각형': lambda I: I.allRight and I.allEq, '평행한 변이 없는 사각형': lambda I: I.npar == 0}
DESC = [('평행한 변이 있습니다.', lambda I: I.npar >= 1), ('마주 보는 두 쌍의 변이 평행합니다.', lambda I: I.npar == 2),
        ('마주 보는 두 각의 크기가 같습니다.', lambda I: I.oppAng), ('마주 보는 두 변의 길이가 같습니다.', lambda I: I.oppEq),
        ('네 변의 길이가 모두 같습니다.', lambda I: I.allEq), ('네 각의 크기가 모두 90°입니다.', lambda I: I.allRight)]
GDESC = [('평행한 변이 없는 사각형', lambda I: I.npar == 0), ('평행한 변이 있는 사각형', lambda I: I.npar >= 1),
         ('마주 보는 두 쌍의 변이 평행한 사각형', lambda I: I.npar == 2), ('마주 보는 두 변의 길이가 같은 사각형', lambda I: I.oppEq),
         ('네 변의 길이가 모두 같은 사각형', lambda I: I.allEq), ('네 각의 크기가 모두 90°인 사각형', lambda I: I.allRight)]
ASKQ = [('평행한 변이 있나요?', lambda I: I.npar >= 1), ('마주 보는 두 쌍의 변이 평행한가요?', lambda I: I.npar == 2),
        ('마주 보는 두 각의 크기가 같나요?', lambda I: I.oppAng), ('마주 보는 두 변의 길이가 같나요?', lambda I: I.oppEq),
        ('네 변의 길이가 모두 같나요?', lambda I: I.allEq), ('네 각의 크기가 모두 90°인가요?', lambda I: I.allRight)]


def K(p, kind):
    I = info(p)
    assert I.kind == kind, ('사각형 그림 오류', p, I.kind, kind)
    return p


def ans(lst, fn, expect):
    """조건에 맞는 번호를 계산하고 앱에 적힌 정답과 같은지 확인"""
    a = [i for i, p in enumerate(lst) if fn(p)]
    assert a == expect, ('정답 오류', a, expect)
    return a


def kos(idx, names=KO):
    return ', '.join(names[i] for i in idx)


def PG(a, b, deg):
    c, s_ = math.cos(rad(deg)) * b, math.sin(rad(deg)) * b
    return [(0, 0), (a, 0), (a + c, -s_), (c, -s_)]


def RH(a, deg):
    return PG(a, a, deg)


def from_angles(A, l0, l1):
    d = [0]
    for i in range(1, 4):
        d.append(d[i - 1] + 180 - A[i])
    u = [(math.cos(rad(x)), math.sin(rad(x))) for x in d]
    rx, ry = -(l0 * u[0][0] + l1 * u[1][0]), -(l0 * u[0][1] + l1 * u[1][1])
    det = u[2][0] * u[3][1] - u[2][1] * u[3][0]
    l2 = (rx * u[3][1] - ry * u[3][0]) / det
    assert l2 > 0
    P = [(0, 0)]
    for i, l in enumerate([l0, l1, l2]):
        P.append((P[i][0] + l * u[i][0], P[i][1] + l * u[i][1]))
    return [(x, -y) for x, y in P]


def has_perp(p):
    n = len(p)
    S = [sub(p[(i + 1) % n], p[i]) for i in range(n)]
    return any(abs(dt(S[i], S[j])) < 1e-9 for i in range(n) for j in range(i + 1, n))


def side_name(n, i):
    return '변 %s%s' % (V[i], V[(i + 1) % n])


# ================================================================ 그리기 조각
def T(x, y, t, size=20, fill=INK, anchor='middle', weight='normal'):
    return ('<text x="%s" y="%s" font-size="%s" text-anchor="%s" dominant-baseline="central" fill="%s" font-weight="%s" '
            'font-family="%s">%s</text>') % (F(x), F(y), F(size), anchor, fill, weight, FONT, escape(str(t)))


def L(P, Q, col=INK, w=4, dash=None, cap='round', op=None):
    return '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="%s" stroke-linecap="%s"%s%s/>' % (
        F(P[0]), F(P[1]), F(Q[0]), F(Q[1]), col, F(w), cap, ' stroke-dasharray="%s"' % dash if dash else '',
        ' opacity="%s"' % op if op else '')


def pts(P):
    return ' '.join('%s,%s' % (F(x), F(y)) for x, y in P)


def POLY(P, fill='none', stroke=INK, w=4, dash=None, extra=''):
    return '<polygon points="%s" fill="%s" stroke="%s" stroke-width="%s" stroke-linejoin="round"%s%s/>' % (
        pts(P), fill, stroke, F(w), ' stroke-dasharray="%s"' % dash if dash else '', extra)


def RECT(x, y, w, h, fill='#fff', stroke=LINE, sw=2, rx=12, dash=None):
    return '<rect x="%s" y="%s" width="%s" height="%s" rx="%s" fill="%s" stroke="%s" stroke-width="%s"%s/>' % (
        F(x), F(y), F(w), F(h), F(rx), fill, stroke, F(sw), ' stroke-dasharray="%s"' % dash if dash else '')


def CIRC(x, y, r, fill=INK, stroke=None, sw=0):
    return '<circle cx="%s" cy="%s" r="%s" fill="%s"%s/>' % (F(x), F(y), F(r), fill,
                                                             ' stroke="%s" stroke-width="%s"' % (stroke, F(sw)) if stroke else '')


def cen(P):
    return (sum(v[0] for v in P) / len(P), sum(v[1] for v in P) / len(P))


def corner(P, i):
    n = len(P)
    Vx = P[i]
    u = unit(sub(P[(i + n - 1) % n], Vx))
    w = unit(sub(P[(i + 1) % n], Vx))
    b = unit((u[0] + w[0], u[1] + w[1]))
    if dt(b, sub(cen(P), Vx)) < 0:
        b = (-b[0], -b[1])
    return Vx, u, w, b


def arc(Vx, u, w, r, wedge=False):
    s_ = (Vx[0] + u[0] * r, Vx[1] + u[1] * r)
    e = (Vx[0] + w[0] * r, Vx[1] + w[1] * r)
    sw = 1 if cr(u, w) > 0 else 0
    return (('M%s,%s L' % (F(Vx[0]), F(Vx[1]))) if wedge else 'M') + '%s,%s A%s,%s 0 0 %d %s,%s' % (
        F(s_[0]), F(s_[1]), F(r), F(r), sw, F(e[0]), F(e[1])) + (' Z' if wedge else '')


def ARC(Vx, u, w, r, col=TENT, sw=2.5, fill='none', wedge=False):
    return '<path d="%s" fill="%s" stroke="%s" stroke-width="%s"/>' % (arc(Vx, u, w, r, wedge), fill, col, F(sw))


def RMK(Vx, u, w, s_, col=TENT, sw=2.5):
    P = [(Vx[0] + u[0] * s_, Vx[1] + u[1] * s_), (Vx[0] + (u[0] + w[0]) * s_, Vx[1] + (u[1] + w[1]) * s_),
         (Vx[0] + w[0] * s_, Vx[1] + w[1] * s_)]
    return '<polyline points="%s" fill="none" stroke="%s" stroke-width="%s"/>' % (pts(P), col, F(sw))


def polyG(P, fill=FILL, sw=4, stroke=INK, names=None, lens=None, angs=None, rights=True, fs=20, sideCol=None):
    """앱 q4PolyG와 같은 그림: 직각 표시, 각 글(호), 변 글, 꼭짓점 이름"""
    n = len(P)
    I = info(P)
    C = cen(P)
    short = min(dist(P[i], P[(i + 1) % n]) for i in range(n))
    rr = max(13, min(30, short * .2))
    b = [POLY(P, fill, 'none', 0)]
    for i in range(n):
        col = (sideCol[i] if sideCol and sideCol[i] else stroke)
        b.append(L(P[i], P[(i + 1) % n], col, sw + 2 if sideCol and sideCol[i] else sw))
    for i in range(n):
        Vx, u, w, bb = corner(P, i)
        right = abs(I.A[i] - 90) < 1e-6
        lab = angs[i] if angs and i < len(angs) else None
        if right and rights:
            b.append(RMK(Vx, u, w, min(15, rr * .75)))
        elif lab:
            b.append(ARC(Vx, u, w, rr))
        if lab:
            dd = rr + fs * (1.3 if I.A[i] < 50 else .95)
            b.append(T(Vx[0] + bb[0] * dd, Vx[1] + bb[1] * dd, lab, fs * .9, fill='#B4530F'))
    if lens:
        for i in range(n):
            t = lens[i] if i < len(lens) else None
            if not t:
                continue
            A, B = P[i], P[(i + 1) % n]
            M = ((A[0] + B[0]) / 2, (A[1] + B[1]) / 2)
            d = unit(sub(B, A))
            nn = (-d[1], d[0])
            if dt(nn, sub(M, C)) < 0:
                nn = (-nn[0], -nn[1])
            off = fs * ((.55 + len(t) * .27) if abs(nn[0]) > .7 else .95) + 2
            b.append(T(M[0] + nn[0] * off, M[1] + nn[1] * off, t, fs * .9, fill='#1D4E80'))
    if names:
        for i in range(n):
            nm = V[i] if names is True else names[i]
            if not nm:
                continue
            Vx, u, w, bb = corner(P, i)
            b.append(T(Vx[0] - bb[0] * fs * 1.05, Vx[1] - bb[1] * fs * 1.05, nm, fs))
    return ''.join(b)


def fit(p, box, k=None):
    """앱 q4Map: 좌표 → 그림(상자 가운데)"""
    x0, y0, w, h, pad = box
    xs, ys = [v[0] for v in p], [v[1] for v in p]
    bw, bh = max(xs) - min(xs), max(ys) - min(ys)
    kk = min((w - 2 * pad) / max(bw, .01), (h - 2 * pad) / max(bh, .01))
    if k:
        kk = min(kk, k)
    ox = x0 + (w - bw * kk) / 2 - min(xs) * kk
    oy = y0 + (h - bh * kk) / 2 - min(ys) * kk
    return SimpleNamespace(P=[(ox + v[0] * kk, oy + v[1] * kk) for v in p], k=kk, ox=ox, oy=oy)


def dotsm(m, x0, y0, x1, y1, r=2.6, col=DOT):
    i0, i1 = math.ceil((x0 - m.ox) / m.k), math.floor((x1 - m.ox) / m.k)
    j0, j1 = math.ceil((y0 - m.oy) / m.k), math.floor((y1 - m.oy) / m.k)
    return ''.join(CIRC(m.ox + i * m.k, m.oy + j * m.k, r, col) for i in range(i0, i1 + 1) for j in range(j0, j1 + 1))


def cards(lst, per=None, k=30, cw=200, ch=170, rights=True, labels=None, dots=True, names=None):
    """앱 q4Cards: 점 종이 카드 여러 장"""
    per = per or len(lst)
    rows = (len(lst) + per - 1) // per
    b = []
    for i, p in enumerate(lst):
        x, y = 10 + (i % per) * (cw + 10), 10 + (i // per) * (ch + 10)
        b.append(RECT(x, y, cw, ch))
        m = fit(p, (x, y + 16, cw, ch - 16, 26), k)
        if dots:
            b.append(dotsm(m, x + 6, y + 26, x + cw - 6, y + ch - 6, 2.4))
        b.append(polyG(m.P, fs=17, sw=3.5, rights=rights, names=names[i] if names else None))
        b.append(T(x + 18, y + 18, (labels or KO)[i], 20, weight='bold'))
    return Fig(per * (cw + 10) + 10, rows * (ch + 10) + 10, ''.join(b))


def labeled(p, lens=None, angs=None, W=380, H=250):
    """앱 q4Labeled: 글이 붙은 사각형(□ 문제)"""
    m = fit(p, (0, 0, W, H, 60), 70)
    return Fig(W, H, polyG(m.P, fs=19, lens=lens, angs=angs))


def side_by_side(figs, gap=20):
    """그림 여러 장을 옆으로(같은 높이로 맞추지 않고 위쪽 맞춤)"""
    W = sum(f.w for f in figs) + gap * (len(figs) - 1)
    H = max(f.h for f in figs)
    b, x = [], 0
    for f in figs:
        inner = f.svg[f.svg.index('>') + 1:f.svg.rindex('</svg>')]
        b.append('<g transform="translate(%s,%s)">%s</g>' % (F(x), F((H - f.h) / 2), inner))
        x += f.w + gap
    return Fig(W, H, ''.join(b))


def rh_diag(a, b_, labs, k=22):
    """앱 q4RhDiag: 마름모와 마주 보는 꼭짓점끼리 이은 선분"""
    C = (160, 140)
    P = [(C[0], C[1] - a * k), (C[0] - b_ * k, C[1]), (C[0], C[1] + a * k), (C[0] + b_ * k, C[1])]
    b = [polyG(P, fs=18, names=True, rights=False), L(P[0], P[2], SKY, 3), L(P[1], P[3], SKY, 3), T(C[0] + 16, C[1] + 18, 'ㅁ', 17),
         T(C[0] + 30, (C[1] + P[0][1]) / 2, labs[0], 16, '#1D4E80'), T(C[0] + 30, (C[1] + P[2][1]) / 2, labs[1], 16, '#1D4E80'),
         ARC(C, (0, -1), (-1, 0), 18), T(C[0] - 34, C[1] - 30, labs[2], 17, '#B4530F')]
    return Fig(320, 280, ''.join(b))


def angle_cards(lst):
    b = []
    for i, (a0, A) in enumerate(lst):
        x = 10 + i * 170
        Vx = (x + 62, 105)
        b.append(RECT(x, 5, 160, 160) + T(x + 16, 22, KO[i], 18, weight='bold'))
        u = (math.cos(rad(a0)), -math.sin(rad(a0)))
        w = (math.cos(rad(a0 + A)), -math.sin(rad(a0 + A)))
        b.append(L(Vx, (Vx[0] + u[0] * 80, Vx[1] + u[1] * 80)) + L(Vx, (Vx[0] + w[0] * 80, Vx[1] + w[1] * 80)))
    return Fig(len(lst) * 170 + 10, 170, ''.join(b))


def ldir(a):
    return (math.cos(rad(a)), -math.sin(rad(a)))


def lines_fig(lines, W=520, H=280):
    """앱 q4LinesFig: 이름 붙은 직선(정적)"""
    b = []
    for Ln in lines:
        d = ldir(Ln['a'])
        A = (Ln['c'][0] - d[0] * Ln['len'], Ln['c'][1] - d[1] * Ln['len'])
        B = (Ln['c'][0] + d[0] * Ln['len'], Ln['c'][1] + d[1] * Ln['len'])
        b.append(L(A, B) + T(B[0] + d[0] * 16, B[1] + d[1] * 16, Ln['n'], 20))
    return Fig(W, H, ''.join(b))


def lines_named(lines, W=760, H=440):
    """앱 q4Lines(길이 아닌 것): 직선 + 끝에 이름"""
    b = []
    for Ln in lines:
        d = ldir(Ln['a'])
        A = (Ln['c'][0] - d[0] * Ln['len'], Ln['c'][1] - d[1] * Ln['len'])
        B = (Ln['c'][0] + d[0] * Ln['len'], Ln['c'][1] + d[1] * Ln['len'])
        b.append(L(A, B))
        lp = (B[0] + d[0] * 18, B[1] + d[1] * 18)
        b.append(T(max(14, min(W - 14, lp[0])), max(14, min(H - 14, lp[1])), Ln['n'], 22, weight='bold'))
    return Fig(W, H, RECT(1, 1, W - 2, H - 2) + ''.join(b))


def road_fig(lines, W=760, H=440):
    """앱 q4Lines(road): 이름 붙은 길"""
    b = ['<rect x="0" y="0" width="%d" height="%d" fill="#EAF3E3"/>' % (W, H)]
    for Ln in lines:
        d = ldir(Ln['a'])
        A = (Ln['c'][0] - d[0] * Ln['len'], Ln['c'][1] - d[1] * Ln['len'])
        B = (Ln['c'][0] + d[0] * Ln['len'], Ln['c'][1] + d[1] * Ln['len'])
        b.append(L(A, B, '#C9C2B5', 30, cap='butt') + L(A, B, '#fff', 2, '14 10'))
    for Ln in lines:
        d = ldir(Ln['a'])
        lp = (Ln['c'][0] + d[0] * Ln['len'] * Ln.get('lp', .55), Ln['c'][1] + d[1] * Ln['len'] * Ln.get('lp', .55))
        b.append(RECT(lp[0] - 38, lp[1] - 15, 76, 30, '#fff', INK, 2, 9) + T(lp[0], lp[1], Ln['n'], 18))
    return Fig(W, H, ''.join(b))


def line_pairs(lines, mode):
    def ang(i, j):
        d = ((lines[i]['a'] - lines[j]['a']) % 180 + 180) % 180
        return min(d, 180 - d)
    out = []
    for i in range(len(lines)):
        for j in range(i + 1, len(lines)):
            a = ang(i, j)
            if (mode == 'perp' and abs(a - 90) < 1e-9) or (mode == 'para' and a < 1e-9):
                out.append((lines[i]['n'], lines[j]['n']))
    return out


def jo(word, withB, noB):
    """받침에 따라 조사(앱 q4J)"""
    c = str(word).strip()[-1]
    if c == '°':
        return noB
    if c.isdigit():
        return withB if c in '013678' else noB
    if 'ㄱ' <= c <= 'ㅎ':
        return withB
    k = ord(c) - 0xAC00
    if k < 0 or k > 11171:
        return withB
    return withB if k % 28 else noB


def pairs_txt(pr):
    return ', '.join('%s%s %s' % (a, jo(a, '과', '와'), b_) for a, b_ in pr)


def right_panels(panels):
    """앱 q4RightMark: 두 직선이 만나는 그림 세 칸"""
    PW, PH = 250, 230
    b = []
    for i, pn in enumerate(panels):
        x, y = 12 + i * (PW + 12), 12
        C = (x + PW / 2, y + PH / 2 + 10)
        b.append(RECT(x, y, PW, PH))
        gx = x + 25
        while gx < x + PW:
            b.append(L((gx, y + 2), (gx, y + PH - 2), '#E6ECE9', 1))
            gx += 25
        gy = y + 25
        while gy < y + PH:
            b.append(L((x + 2, gy), (x + PW - 2, gy), '#E6ECE9', 1))
            gy += 25
        u, w = ldir(pn[0]), ldir(pn[0] + pn[1])
        R = 95
        b.append(L((C[0] - u[0] * R, C[1] - u[1] * R), (C[0] + u[0] * R, C[1] + u[1] * R)))
        b.append(L((C[0] - w[0] * R * .5, C[1] - w[1] * R * .5), (C[0] + w[0] * R, C[1] + w[1] * R)))
        b.append(T(x + 18, y + 18, KO[i], 20, weight='bold'))
    return Fig(len(panels) * (PW + 12) + 12, PH + 24, ''.join(b))


def two_lines(L1, L2):
    """㉠ ㉡ 두 직선 그림 두 개"""
    b = []
    for i in range(2):
        x = 5 + i * 310
        b.append(RECT(x, 5, 300, 210) + T(x + 17, 22, ['㉠', '㉡'][i], 18))
    for A, B in L1 + L2:
        b.append(L(A, B))
    return Fig(620, 220, ''.join(b))


def sq_draw():
    """2차시 도전: 삼각자로 수선을 그은 두 그림(앱 q4SqDraw)"""
    b = []
    for i, ok in ((0, False), (1, True)):
        x = 10 + i * 305
        b.append(RECT(x, 5, 295, 220) + T(x + 18, 22, ['㉠', '㉡'][i], 20))
        b.append(L((x + 15, 180), (x + 280, 180)))
        if ok:
            b.append(POLY([(x + 120, 180), (x + 230, 180), (x + 120, 90)], 'rgba(170,210,245,.55)', '#1D4E80', 2))
            b.append(L((x + 120, 215), (x + 120, 40), SKY, 4))
            b.append(RMK((x + 120, 180), (1, 0), (0, -1), 12, '#1D4E80', 2))
        else:
            b.append(POLY([(x + 90, 180), (x + 230, 180), (x + 160, 110)], 'rgba(170,210,245,.55)', '#1D4E80', 2))
            b.append(L((x + 60, 210), (x + 200, 70), SKY, 4))
    return Fig(620, 230, ''.join(b))


# ---------------------------------------------------------------- 실제 크기 그림(1 cm = 40 px)
def clip_panel(cid, x, y, w, h, inner, title=None):
    b = ['<clipPath id="%s"><rect x="%s" y="%s" width="%s" height="%s"/></clipPath>' % (cid, F(x), F(y), F(w), F(h)),
         RECT(x, y, w, h, '#fff', LINE, 1.5, 8), '<g clip-path="url(#%s)">%s</g>' % (cid, inner)]
    if title:
        b.append(T(x + 10, y + 16, title, 17, weight='bold', anchor='start'))
    return ''.join(b)


def line_panel(ang, W_cm, H_cm, O_frac, pt=None, lineName=None, cid='lp', title=None, x0=0, extra=None):
    """주어진 직선(방향 ang°)과 점 ㄱ(직선을 따라 s cm, 직선에서 n cm 위). 실제 크기."""
    W, H = W_cm * U, H_cm * U
    e = ldir(ang)
    nv = (-e[1], e[0])
    up = nv if nv[1] < 0 else (-nv[0], -nv[1])
    O = (x0 + W / 2, H * O_frac)
    S = lambda s_, n: (O[0] + e[0] * s_ * U + up[0] * n * U, O[1] + e[1] * s_ * U + up[1] * n * U)
    b = [L(S(-40, 0), S(40, 0), INK, 3.5)]
    if pt:
        P = S(pt[0], pt[1])
        b.append(CIRC(P[0], P[1], 6, RED) + T(P[0] + 15, P[1] - 15, 'ㄱ', 22, RED, weight='bold'))
    if extra:
        b.append(extra(S))
    if lineName:
        P = S(-W_cm / 2 + 1.2, -.5)
        b.append(T(P[0], P[1], lineName, 17, GRAY))
    return clip_panel(cid, x0, 0, W, H, ''.join(b), title), W, H


_CID = [0]


def line_fig(ang, W_cm=16, H_cm=6.5, O_frac=.62, pt=None, lineName='주어진 직선', title=None):
    _CID[0] += 1
    body, W, H = line_panel(ang, W_cm, H_cm, O_frac, pt, lineName, cid='lp%d' % _CID[0], title=title)
    return Fig(W + 2, H + 2, '<g transform="translate(1,1)">%s</g>' % body)


def dist_fig(items, W_cm=8.6, H_cm=6.2):
    """평행선 두 쌍(사이의 거리 d cm, 방향 ang°), 아래 직선 위 점 ㄱ에서 수선 긋기. 실제 크기."""
    b, x = [], 1
    for k, it in enumerate(items):
        W, H = W_cm * U, H_cm * U
        e = ldir(it['ang'])
        nv = (-e[1], e[0])
        up = nv if nv[1] < 0 else (-nv[0], -nv[1])
        O = (x + W / 2, 1 + H / 2 + it['d'] * U / 2)
        S = lambda s_, n, O=O, e=e, up=up: (O[0] + e[0] * s_ * U + up[0] * n * U, O[1] + e[1] * s_ * U + up[1] * n * U)
        inner = L(S(-30, 0), S(30, 0), INK, 3.5) + L(S(-30, it['d']), S(30, it['d']), INK, 3.5)
        P = S(it['sA'], 0)
        inner += CIRC(P[0], P[1], 5.5, TENT) + T(P[0] + 4, P[1] + 18, 'ㄱ', 19, TENT, weight='bold')
        b.append(clip_panel('dp%d' % k, x, 1, W, H, inner, it.get('title')))
        x += W + 14
    return Fig(x - 13, H_cm * U + 2, ''.join(b))


def seg_fig(d, segs, ang=0, Upx=U, names=None, lens=None, show=(), lineNames=None, rightMk=False, lnS=7.4, W=700, H=300):
    """앱 q4SegFig: 평행선과 그 사이를 잇는 선분"""
    e = ldir(ang)
    up0 = (-e[1], e[0])
    up = up0 if up0[1] < 0 else (-up0[0], -up0[1])
    O = (W / 2, H / 2 + d * Upx / 2)
    S = lambda s_, n: (O[0] + e[0] * s_ * Upx + up[0] * n * Upx, O[1] + e[1] * s_ * Upx + up[1] * n * Upx)
    b = [L(S(-30, 0), S(30, 0)), L(S(-30, d), S(30, d))]
    if lineNames:
        a, c = S(lnS, d + .5), S(lnS, -.5)
        b.append(T(a[0], a[1], lineNames[0], 18) + T(c[0], c[1], lineNames[1], 18))
    for i, (s1, s2) in enumerate(segs):
        A, B = S(s1, 0), S(s2, d)
        b.append(L(A, B, SKY, 4) + CIRC(A[0], A[1], 4.5) + CIRC(B[0], B[1], 4.5))
        if abs(s1 - s2) < 1e-9 and rightMk:
            b.append(RMK(A, e, up, 13))
        lab = S(s2 + (s2 - s1) * .08, d + .42)
        b.append(T(lab[0], lab[1], (names or KO)[i], 20, weight='bold'))
        if i in show:
            M = ((A[0] + B[0]) / 2, (A[1] + B[1]) / 2)
            tx = lens[i]
            b.append(RECT(M[0] + 10, M[1] - 14, 14 + len(tx) * 11, 28, '#fff', '#1D4E80', 1.5, 8) +
                     T(M[0] + 17 + len(tx) * 5.5, M[1], tx, 17, '#1D4E80'))
    return Fig(W, H, '<clipPath id="sg"><rect x="0" y="0" width="%d" height="%d"/></clipPath><g clip-path="url(#sg)">%s</g>' % (W, H, ''.join(b)))


def geo_panels(panels, cid='g'):
    """점 종이(실제 크기, 한 칸 1 cm). panels: dict(cols, rows, fixed=[], start=None, title, extra)
    너비가 모자라면 아래로 쌓습니다."""
    pad, top = 22, 30
    sizes = [(p['cols'] * U + pad * 2, p['rows'] * U + pad * 2 + top) for p in panels]
    side = sum(w for w, _ in sizes) + 14 * (len(panels) - 1) <= 17.6 * U
    b, x, y = [], 0, 0
    for k, p in enumerate(panels):
        w, h = sizes[k]
        ox, oy = x + pad, y + top + pad
        px = lambda q, ox=ox, oy=oy: (ox + q[0] * U, oy + q[1] * U)
        g = [RECT(x + 1, y + 1, w - 2, h - 2, '#fff', LINE, 1.5, 10)]
        if p.get('title'):
            g.append(T(x + 12, y + 17, p['title'], 17, weight='bold', anchor='start'))
        for j in range(p['rows'] + 1):
            for i in range(p['cols'] + 1):
                g.append(CIRC(*px((i, j)), 3.2, '#6F7F88'))
        st = p.get('start')
        if st:
            P = [px(q) for q in st]
            g.append(POLY(P, 'rgba(228,122,56,.12)', INK, 3.5))
            C = cen(P)
            for i, q in enumerate(P):
                d = unit(sub(q, C))
                g.append(CIRC(q[0], q[1], 6, SKY) + T(q[0] + d[0] * 22, q[1] + d[1] * 22, V[i], 19, weight='bold'))
        fx = p.get('fixed') or []
        if fx:
            P = [px(q) for q in fx]
            for i in range(len(P) - 1):
                g.append(L(P[i], P[i + 1], SKY, 6))
            C = cen(P)
            for i, q in enumerate(P):
                d = (0, -1) if len(P) < 3 else unit(sub(q, C))
                g.append(CIRC(q[0], q[1], 6, SKY) + T(q[0] + d[0] * 22, q[1] + d[1] * 22, V[i], 19, weight='bold'))
        if p.get('extra'):
            g.append(p['extra'](px))
        b.append(''.join(g))
        if side:
            x += w + 14
        else:
            y += h + 12
    W = (x - 14) if side else max(w for w, _ in sizes)
    H = max(h for _, h in sizes) if side else y - 12
    return Fig(W, H, ''.join(b))


def meas_fig(p, names=True):
    """직사각형·정사각형(실제 크기, 점 종이 위)"""
    xs, ys = [v[0] for v in p], [v[1] for v in p]
    pad = 1.2
    W, H = (max(xs) - min(xs) + 2 * pad) * U, (max(ys) - min(ys) + 2 * pad) * U
    m = SimpleNamespace(ox=(pad - min(xs)) * U, oy=(pad - min(ys)) * U, k=U)
    P = [(m.ox + v[0] * U, m.oy + v[1] * U) for v in p]
    return Fig(W, H, RECT(1, 1, W - 2, H - 2, '#fff', LINE, 1.5, 8) + dotsm(m, 4, 4, W - 4, H - 4, 2.4, '#B5C2BC') +
               polyG(P, fs=18, rights=False, names=names, sw=3))


def rhfold_fig(a, b_, rot):
    """마름모 종이를 두 번 접었다 펼친 모습(실제 크기): 접힌 선 ㄱㄷ(빨강), ㄴㄹ(파랑), 만나는 점 ㅁ"""
    ra = rad(rot)
    e1, e2 = (math.sin(ra), -math.cos(ra)), (math.cos(ra), math.sin(ra))
    R = max(a, b_) + .9
    W = H = 2 * R * U
    C = (W / 2, H / 2)
    Pt = lambda x, y: (C[0] + e2[0] * x * U + e1[0] * y * U, C[1] + e2[1] * x * U + e1[1] * y * U)
    Kp = {'ㄱ': Pt(0, a), 'ㄴ': Pt(-b_, 0), 'ㄷ': Pt(0, -a), 'ㄹ': Pt(b_, 0)}
    bb = [POLY([Kp['ㄱ'], Kp['ㄴ'], Kp['ㄷ'], Kp['ㄹ']], '#FDE7EF', INK, 3.5),
          L(Kp['ㄱ'], Kp['ㄷ'], RED, 2.5, '9 6'), L(Kp['ㄴ'], Kp['ㄹ'], SKY, 2.5, '9 6'), T(C[0] - 18, C[1] + 18, 'ㅁ', 19, weight='bold')]
    for nm, P in Kp.items():
        d = unit(sub(P, C))
        bb.append(T(P[0] + d[0] * 20, P[1] + d[1] * 20, nm, 20, weight='bold'))
    return Fig(W, H, ''.join(bb))


def pgcut_fig(p):
    """평행사변형 종이: 꼭짓점 ㄱ·ㄷ을 이은 자르는 선과 네 각(색)"""
    m = fit(p, (0, 0, 420, 260, 40), 60)
    P = m.P
    cols = ['#F28B82', '#8ECAE6', '#A7D7A0', '#FBD25B']
    b = [POLY(P, '#FFFDF6', INK, 4)]
    for i in range(4):
        Vx, u, w, bb = corner(P, i)
        b.append(ARC(Vx, u, w, 34, 'none', 0, cols[i], True))
        b.append(T(Vx[0] - bb[0] * 22, Vx[1] - bb[1] * 22, V[i], 20, weight='bold'))
    b.append(L(P[0], P[2], RED, 3, '10 7'))
    b.append(T((P[0][0] + P[2][0]) / 2 + 26, (P[0][1] + P[2][1]) / 2 + 12, '✂', 22, RED))
    return Fig(420, 260, ''.join(b))


def foldpar_fig():
    """종이를 접어 만든 평행선(앱 q4FoldPar의 펼친 모습)"""
    paper = [(90, 70), (610, 40), (660, 230), (600, 380), (130, 360), (60, 220)]
    ra = rad(-12)
    re_, rn = (math.cos(ra), math.sin(ra)), (-math.sin(ra), math.cos(ra))
    RO = (360, 215)
    P = lambda s_: (RO[0] + re_[0] * s_ * 40, RO[1] + re_[1] * s_ * 40)
    b = ['<clipPath id="pp"><polygon points="%s"/></clipPath>' % pts(paper), POLY(paper, '#FFF6DA', '#B48A2A', 3),
         '<g clip-path="url(#pp)">', L(P(-9), P(9), RED, 4, '12 6')]
    for s_ in (-4, 4):
        A = P(s_)
        b.append(L((A[0] - rn[0] * 260, A[1] - rn[1] * 260), (A[0] + rn[0] * 260, A[1] + rn[1] * 260), SKY, 4, '12 6'))
        b.append(RMK(A, re_, rn, 14, '#1D4E80', 2.5))
    b.append('</g>')
    b.append(T(P(7)[0], P(7)[1] - 22, '빨간 선', 17, RED) + T(P(-4)[0] - 40, 95, '파란 선', 17, SKY) + T(P(4)[0] + 60, 95, '파란 선', 17, SKY))
    return Fig(720, 420, ''.join(b))


def strips_fig():
    """종이띠 6개(실제 크기): 5 cm 4개, 3 cm 2개"""
    b, y = [], 8
    hgt = 0.8 * U
    for i, Lc in enumerate([5, 5, 5, 5, 3, 3]):
        col, sc = ('#FBD25B', '#8A6A3A') if Lc == 5 else ('#A9D6F2', '#1D4E80')
        x = 8 if i % 2 == 0 else 8 + 5.6 * U
        if i % 2 == 0 and i:
            y += hgt + 12
        b.append(RECT(x, y, Lc * U, hgt, col, sc, 2, 4) + T(x + Lc * U / 2, y + hgt / 2, '%d cm' % Lc, 17, sc))
    return Fig(8 + 11.2 * U, y + hgt + 8, ''.join(b))


def cutstrip_fig(cut, length):
    """직사각형 띠(높이 3)를 잘라 생긴 조각"""
    W, H = 760, 170 if length <= 15 else 150
    m = fit([(0, 0), (length, 3)], (0, 10, W, H - 10, 20), 46)
    b = [dotsm(m, 4, 12, W - 4, H - 4, 2), RECT(m.ox, m.oy, length * m.k, 3 * m.k, FILL, INK, 4, 0)]
    for t, bt in cut[1:-1]:
        b.append(L((m.ox + t * m.k, m.oy), (m.ox + bt * m.k, m.oy + 3 * m.k), RED, 3, '8 5'))
    pieces = pieces_of(cut)
    for i, p in enumerate(pieces):
        c = cen(p)
        b.append(T(m.ox + c[0] * m.k, m.oy + c[1] * m.k, KO[i], 22, weight='bold'))
    return Fig(W, H, ''.join(b))


def pieces_of(cut):
    return [[(c[0], 0), (d[0], 0), (d[1], 3), (c[1], 3)] for c, d in zip(cut[:-1], cut[1:])]


def overlap_fig(ang=55):
    """폭 3 cm, 2 cm인 직사각형 종이 두 장을 겹친 모습(앱 q4Overlap)"""
    W, H, Uo = 640, 420, 50
    h1, h2 = 3, 2
    C = (W / 2, H / 2)
    S = lambda x, y: (C[0] + x * Uo, C[1] - y * Uo)
    th = rad(ang)
    d, nn = (math.cos(th), math.sin(th)), (-math.sin(th), math.cos(th))
    Lh = 7
    b = ['<clipPath id="ov"><rect x="0" y="0" width="%d" height="%d"/></clipPath><g clip-path="url(#ov)">' % (W, H),
         POLY([S(-Lh, -h1 / 2), S(Lh, -h1 / 2), S(Lh, h1 / 2), S(-Lh, h1 / 2)], 'rgba(251,210,91,.6)', '#B48A2A', 3)]
    r2 = [S(d[0] * a + nn[0] * bb, d[1] * a + nn[1] * bb) for a, bb in [(-Lh, -h2 / 2), (Lh, -h2 / 2), (Lh, h2 / 2), (-Lh, h2 / 2)]]
    b.append(POLY(r2, 'rgba(142,202,230,.6)', SKY, 3))
    X = lambda yy, bb: ((math.cos(th) * yy - bb) / math.sin(th), yy)
    Q = [S(*X(-h1 / 2, -h2 / 2)), S(*X(-h1 / 2, h2 / 2)), S(*X(h1 / 2, h2 / 2)), S(*X(h1 / 2, -h2 / 2))]
    b.append(POLY(Q, 'rgba(210,70,58,.35)', RED, 4))
    b.append('</g>')
    assert info(Q).kind == 'para'
    return Fig(W, H, ''.join(b))


def path_fig(ends, n=6):
    """앱 q4Path: 옳으면 →, 옳지 않으면 ↓"""
    W, H = 560, 420
    cw, chh = (W - 120) / n, (H - 120) / n
    O = (40, 50)
    b = []
    for i in range(n + 1):
        for j in range(n + 1 - i):
            x, y = O[0] + i * cw, O[1] + j * chh
            if i + j < n:
                b.append(L((x, y), (x + cw, y), '#BFCDC7', 3) + L((x, y), (x, y + chh), '#BFCDC7', 3))
    for dd, nm in enumerate(ends):
        if not nm:
            continue
        x, y = O[0] + (n - dd) * cw, O[1] + dd * chh
        b.append(CIRC(x, y, 10, '#F28B82') + T(x + 14, y - 2, nm, 16, anchor='start'))
    b.append(CIRC(O[0], O[1], 9, TENT) + T(O[0], O[1] - 22, '출발', 16) + T(W - 70, 22, '옳음 → / 옳지 않음 ↓', 15, GRAY))
    return Fig(W, H, ''.join(b))


def tower_fig(floors, tags, roof=0, deco=None):
    """앱 q4Tower: 건물 옆모습과 길이 표시(1 m = 44 px)"""
    M = 44
    top = max(f[0] for f in floors) + roof
    W, H = 700, top * M + 90
    X0, X1 = 150, 520
    Y = lambda y: H - 40 - y * M
    Xp = lambda x: X0 + x * M
    b = [RECT(0, H - 40, W, 40, '#D9CBB2', 'none', 0, 0), RECT(X0, Y(top), X1 - X0, top * M, '#F3E6D3', '#8A6A3A', 3, 0)]
    for x in (X0 + 4, (X0 + X1) / 2, X1 - 4):
        b.append(L((x, Y(0)), (x, Y(top)), '#8A6A3A', 8, cap='butt'))
    for y, nm, lab in floors:
        b.append(L((X0 - 20, Y(y)), (X1 + 60, Y(y)), INK, 5) + T(X1 + 84, Y(y), nm, 20, weight='bold'))
        if lab:
            b.append(T(X0 - 52, Y(y) - 14, lab, 15, '#5A4A20'))
    if deco:
        b.append(deco(Xp, Y))
    for t, x1, y1, x2, y2, dx in tags:
        A, B = (Xp(x1), Y(y1)), (Xp(x2), Y(y2))
        col = '#1D4E80'
        b.append(L(A, B, col, 2.5))
        d = unit(sub(B, A))
        nn = (-d[1], d[0])
        for P in (A, B):
            b.append(L((P[0] - nn[0] * 7, P[1] - nn[1] * 7), (P[0] + nn[0] * 7, P[1] + nn[1] * 7), col, 2.5))
        Mp = ((A[0] + B[0]) / 2 + dx, (A[1] + B[1]) / 2)
        b.append(RECT(Mp[0] - 34, Mp[1] - 14, 68, 28, '#fff', col, 2, 8) + T(Mp[0], Mp[1], t, 17, col))
    return Fig(W, H, ''.join(b))


def door(x, y0, hh, col='#9C6B3A'):
    return lambda X, Y: RECT(X(x), Y(y0 + hh), 1.2 * 44, hh * 44, col, 'none', 0, 0)


def stair(x0, y0, dx, dy):
    return lambda X, Y: L((X(x0), Y(y0)), (X(x0 + dx), Y(y0 + dy)), '#5A4A3F', 7)


def game_cards(shapes):
    """놀이 도형 카드(가~바)와 이름"""
    b = []
    for i, (nm, p) in enumerate(shapes):
        x = 10 + i * 150
        b.append(RECT(x, 10, 140, 150, '#fff', LINE, 2, 12) + T(x + 16, 26, KO[i], 18, weight='bold'))
        m = fit(p, (x, 30, 140, 95, 14), 20)
        b.append(polyG(m.P, fs=12, sw=3))
        b.append(T(x + 70, 140, nm, 16))
    return Fig(len(shapes) * 150 + 10, 170, ''.join(b))


def move_opts(start, cols, rows, need, which=None):
    """꼭짓점 하나만 옮겨 조건을 만족하는 경우 모두"""
    out = []
    for i in (which if which is not None else range(4)):
        for x in range(cols + 1):
            for y in range(rows + 1):
                q = (x, y)
                if q in [tuple(v) for v in start]:
                    continue
                Vv = [tuple(v) for v in start]
                Vv[i] = q
                I = info(Vv)
                if I.simple and need(I, Vv):
                    out.append((i, q))
    return out


def move_txt(start, i, q):
    dx, dy = q[0] - start[i][0], q[1] - start[i][1]
    parts = []
    if dx:
        parts.append('%s으로 %d칸' % ('오른쪽' if dx > 0 else '왼쪽', abs(dx)))
    if dy:
        parts.append('%s로 %d칸' % ('아래' if dy > 0 else '위', abs(dy)))
    return '꼭짓점 %s을 %s' % (V[i], ', '.join(parts))


def fourth(fx):
    """주어진 꼭짓점 ㄱ, ㄴ, ㄷ으로 평행사변형의 넷째 꼭짓점(ㄱ + ㄷ − ㄴ)"""
    return (fx[0][0] + fx[2][0] - fx[1][0], fx[0][1] + fx[2][1] - fx[1][1])


# ================================================================ 1차시 장면 그림
def park_fig():
    b = ['<rect x="0" y="0" width="900" height="460" fill="#EAF5FB"/><rect x="0" y="390" width="900" height="70" fill="#CFE6B8"/>']
    b.append(RECT(40, 200, 210, 190, '#F6C28B', '#B4610F', 5, 0) + POLY([(30, 205), (145, 170), (260, 205)], '#D2463A', 'none', 0) +
             RECT(70, 240, 70, 55, '#DDEFFC', '#5A4A3F', 4, 0) + RECT(165, 260, 55, 130, '#7A4A1E', 'none', 0, 0) + T(105, 320, '매표소', 18))
    b.append(RECT(340, 210, 10, 180, '#8795A1', 'none', 0, 0) + RECT(300, 130, 90, 90, '#2B7BD6', '#1D4E80', 4, 0) + T(345, 175, '출구 →', 18, '#fff'))
    b.append('<circle cx="550" cy="160" r="120" fill="none" stroke="#7C4DBA" stroke-width="6"/>' +
             L((550, 160), (490, 390), '#5A4A3F', 6) + L((550, 160), (610, 390), '#5A4A3F', 6))
    for k in range(8):
        a = k * math.pi / 4
        b.append(L((550, 160), (550 + 120 * math.cos(a), 160 + 120 * math.sin(a)), '#B9A5DA', 2) +
                 CIRC(550 + 120 * math.cos(a), 160 + 120 * math.sin(a), 14, ['#F28B82', '#FBD25B', '#8ECAE6', '#A7D7A0'][k % 4]))
    for x, y, c in ((730, 90, '#F28B82'), (770, 80, '#FBD25B'), (750, 125, '#8ECAE6')):
        b.append(L((x, y + 30), (755, 195), '#5A4A3F', 1.5) + '<ellipse cx="%d" cy="%d" rx="24" ry="30" fill="%s"/>' % (x, y, c))
    b.append(L((825, 180), (825, 315), '#5A4A3F', 4) + POLY([(828, 182), (885, 205), (828, 228)], '#E47A38', 'none', 0))
    b.append(RECT(700, 315, 100, 70, '#A7D7A0', '#24965A', 4, 0) + L((750, 315), (750, 385), '#D2463A', 5, cap='butt') +
             L((700, 350), (800, 350), '#D2463A', 5, cap='butt'))
    # 이름표(활동지용)
    for x, y, t in ((145, 415, '① 매표소'), (345, 415, '② 정사각형 표지판'), (550, 22, '③ 대관람차'), (750, 22, '④ 풍선'),
                    (855, 335, '⑤ 깃발'), (750, 415, '⑥ 기념품 상자')):
        b.append(RECT(x - len(t) * 8 - 6, y - 15, len(t) * 16 + 12, 30, '#fff', '#5A4A3F', 1.5, 8) + T(x, y, t, 17))
    return Fig(900, 460, ''.join(b))


PARK = ['① 매표소', '② 정사각형 표지판', '③ 대관람차', '④ 풍선', '⑤ 삼각형 깃발', '⑥ 기념품 상자']
PARK_OK = [0, 1, 5]


def school_fig():
    b = ['<rect x="0" y="0" width="900" height="300" fill="#FBF4E6"/><rect x="0" y="300" width="900" height="160" fill="#E6D8C3"/>']
    b.append(RECT(40, 50, 200, 150, '#DDEFFC', '#5A4A3F', 5, 0) + L((140, 50), (140, 200), '#5A4A3F', 4) + L((40, 125), (240, 125), '#5A4A3F', 4))
    b.append(CIRC(340, 100, 50, '#fff', '#5A4A3F', 5) + L((340, 100), (340, 65)) + L((340, 100), (365, 110)))
    b.append(RECT(440, 50, 210, 140, '#F6E3B4', '#8A6A3A', 6, 0) + RECT(460, 70, 70, 50, '#fff', 'none', 0, 0) +
             RECT(550, 80, 80, 60, '#C8E6C9', 'none', 0, 0) + T(545, 170, '우리 반 소식', 16, '#5A4A20'))
    b.append(RECT(745, 140, 10, 70, '#8795A1', 'none', 0, 0) + POLY([(700, 150), (750, 45), (800, 150)], '#FBD25B', '#B4610F', 5) + T(750, 120, '천천히', 15, '#7A3B08'))
    b.append(RECT(50, 250, 210, 190, '#A9D6F2', '#1D4E80', 5, 0) + L((120, 250), (120, 440), '#1D4E80', 3) + L((190, 250), (190, 440), '#1D4E80', 3) +
             L((50, 345), (260, 345), '#1D4E80', 3))
    b.append(CIRC(375, 385, 45, '#E47A38', '#7A3B08', 3) + L((330, 385), (420, 385), '#7A3B08', 2.5) + L((375, 340), (375, 430), '#7A3B08', 2.5))
    b.append(POLY([(500, 430), (770, 430), (720, 330), (560, 330)], '#C99A6B', '#7A4A1E', 5))
    for x, c in ((590, '#F28B82'), (640, '#FBD25B'), (690, '#B39DDB')):
        b.append(L((x, 330), (x, 305), '#4F8A43', 4) + CIRC(x, 300, 11, c))
    for x, y, t in ((140, 225, '① 교실 창문'), (340, 175, '② 둥근 시계'), (545, 215, '③ 게시판'), (750, 235, '④ ‘천천히’ 표지'),
                    (155, 285, '⑤ 사물함'), (375, 312, '⑥ 농구공'), (635, 445, '⑦ 화단')):
        b.append(RECT(x - len(t) * 8 - 6, y - 15, len(t) * 16 + 12, 30, '#fff', '#5A4A3F', 1.5, 8) + T(x, y, t, 17))
    return Fig(900, 460, ''.join(b))


SCHOOL = ['① 교실 창문', '② 둥근 시계', '③ 게시판', '④ ‘천천히’ 삼각형 표지', '⑤ 사물함', '⑥ 농구공', '⑦ 화단']
SCHOOL_OK = [0, 2, 4, 6]


def goat_fig():
    b = ['<rect x="0" y="0" width="420" height="220" fill="#F6F1E7"/>',
         '<ellipse cx="210" cy="110" rx="150" ry="80" fill="#E8D9A8" stroke="#8A6A3A" stroke-width="5"/>',
         '<ellipse cx="210" cy="110" rx="95" ry="62" fill="#E0B04A" stroke="#7A5A1E" stroke-width="3"/>',
         RECT(140, 92, 140, 36, '#1D2A2A', 'none', 0, 6), CIRC(250, 85, 9, '#fff'), T(210, 205, '염소의 눈', 18, '#5A4A3F')]
    return Fig(420, 220, ''.join(b))


# ================================================================ 이 단원 사각형(앱과 같은 좌표, 1칸 = 1 cm)
Q4S = {
    't1': K([(0, 3), (1, 0), (4, 0), (6, 3)], 'trap'), 't2': K([(0, 3), (2, 0), (4, 0), (5, 3)], 'trap'), 't3': K([(0, 0), (3, 0), (3, 4), (0, 2)], 'trap'),
    't4': K([(0, 2), (4, 0), (5, 2), (3, 3)], 'trap'), 't6': K([(0, 0), (4, 2), (4, 4), (0, 4)], 'trap'), 't7': K([(0, 2), (1, 0), (4, 0), (6, 2)], 'trap'),
    'p1': K([(0, 0), (4, 1), (5, 3), (1, 2)], 'para'), 'p2': K([(0, 3), (3, 0), (6, 0), (3, 3)], 'para'), 'p3': K([(0, 0), (5, 0), (4, 3), (-1, 3)], 'para'),
    'p4': K([(0, 0), (4, 0), (5, 3), (1, 3)], 'para'), 'p5': K([(0, 3), (2, 0), (6, 0), (4, 3)], 'para'), 'p6': K([(0, 0), (4, 0), (5, 2), (1, 2)], 'para'),
    'r1': K([(0, 0), (2, 1), (3, 3), (1, 2)], 'rhom'), 'r2': K([(0, 2), (3, 0), (6, 2), (3, 4)], 'rhom'), 'r3': K([(0, 2), (4, 0), (8, 2), (4, 4)], 'rhom'),
    'c1': K([(0, 0), (4, 0), (4, 2), (0, 2)], 'rect'), 'c2': K([(0, 1), (2, 0), (4, 4), (2, 5)], 'rect'), 'c3': K([(0, 0), (5, 0), (5, 3), (0, 3)], 'rect'),
    's1': K([(0, 0), (3, 0), (3, 3), (0, 3)], 'sq'), 's2': K([(0, 1), (3, 0), (4, 3), (1, 4)], 'sq'),
    'n1': K([(0, 1), (3, 0), (5, 3), (1, 3)], 'none'), 'n2': K([(2, 0), (4, 2), (2, 5), (0, 2)], 'none'), 'n3': K([(0, 0), (4, 1), (3, 4), (0, 3)], 'none'),
    'n4': K([(1, 0), (5, 2), (4, 4), (0, 3)], 'none'), 'n5': K([(0, 0), (4, 1), (5, 4), (0, 3)], 'none'), 'n6': K([(2, 0), (4, 1), (2, 4), (0, 1)], 'none'),
}


def QL(keys):
    return [Q4S[k] for k in keys.split()]


GSH = [('사다리꼴', Q4S['t1']), ('평행사변형', Q4S['p4']), ('마름모', Q4S['r2']), ('직사각형', Q4S['c3']), ('정사각형', Q4S['s1']), ('사각형', Q4S['n1'])]
GSH_I = [info(p) for _, p in GSH]


def sheet_table(s, shapes_labels, rows):
    """설명 줄 × 사각형 칸(◯ 표 하는 표)"""
    s.table([[''] + list(shapes_labels)] + [[r] + [''] * len(shapes_labels) for r in rows])


def tbl_answer(shapes, rows, labels=KO):
    out = []
    for r, fn in rows:
        hit = [labels[i] for i, p in enumerate(shapes) if fn(info(p))]
        out.append('%s %s' % (r.rstrip('.'), ', '.join(hit) if hit else '없음'))
    return out


# ================================================================ 활동지 공통
class B:
    def __init__(self, s, level):
        self.s, self.C = s, level == '도전형'

    def help(self, t):
        if not self.C:
            self.s.text('도움  ' + t)

    def why(self, q, n=2):
        self.s.ask(q, blank=False)
        self.s.lines(n)


ROUTE_TB = [dict(n='나눔길', c=(380, 225), a=0, len=365, lp=.8), dict(n='행복길', c=(170, 220), a=90, len=215, lp=.6),
            dict(n='희망길', c=(600, 220), a=90, len=215, lp=.6), dict(n='배려길', c=(370, 165), a=25, len=155, lp=.55),
            dict(n='꿈길', c=(330, 295), a=140, len=130, lp=-.45)]
ROUTE_ST = [dict(n='햇살길', c=(380, 230), a=0, len=360, lp=.8), dict(n='구름길', c=(150, 220), a=90, len=200, lp=.6),
            dict(n='바람길', c=(610, 220), a=90, len=200, lp=.6), dict(n='별빛길', c=(380, 150), a=28, len=150, lp=.55),
            dict(n='숲길', c=(360, 315), a=135, len=120, lp=-.45)]


def LN(spec):
    return [dict(n=n, c=c, a=a, len=l) for n, c, a, l in spec]


GAME_RULES = ['가위바위보로 순서를 정하고, 카드를 섞어 한 사람당 7장씩 나누어 가져요.',
              '남은 카드는 뒤집어 쌓고, 맨 위 카드 한 장을 내용이 보이게 놓아요.',
              '놓인 카드가 도형 카드이면 알맞은 설명 카드를, 설명 카드이면 알맞은 도형 카드를 내려놓아요.',
              '내려놓을 카드가 없으면 쌓아 둔 카드에서 한 장을 가져와요.',
              '먼저 카드를 모두 내려놓는 사람이 이겨요.']
SHUF = [2, 4, 0, 3, 1]       # 활동지에 섞어 놓은 차례(가~마)


def game_rules_step(s):
    s.labeled([(KO[k], GAME_RULES[i]) for k, i in enumerate(SHUF)], label_mm=14, row_h=3402)
    s.ask('놀이 순서대로 기호를 써 보세요.  (     ) → (     ) → (     ) → (     ) → (     )', blank=False)
    return ' → '.join(KO[SHUF.index(i)] for i in range(5))


def game_table_step(s, b):
    """도형 카드에 내려놓을 수 있는 설명 카드 번호 쓰기 + 질문 표"""
    pic(s, game_cards(GSH), 172)
    s.labeled([('설명 %d' % (i + 1), d) for i, (d, _) in enumerate(GDESC)], label_mm=22, row_h=2900)
    s.table([['도형 카드'] + KO[:6], ['내려놓을 수 있는\n설명 카드 번호'] + [''] * 6], col_mm=[40] + [23.3] * 6, row_h=4300)
    return ' / '.join('%s %s' % (KO[i], ','.join(str(k + 1) for k, (_, fn) in enumerate(GDESC) if fn(GSH_I[i]))) for i in range(6))


def twenty_step(s, b):
    s.text('친구가 몰래 고른 도형 카드(가~바)를 ‘예/아니요’ 질문으로 맞혀요. 먼저 카드마다 질문의 답을 표에 ‘예’ 또는 ‘아니요’로 써 보세요.')
    s.table([['질문'] + KO[:6]] + [[q] + [''] * 6 for q, _ in ASKQ], col_mm=[62] + [19.7] * 6)
    s.ask('친구의 대답: 평행한 변이 있나요? → 예,  네 변의 길이가 모두 같나요? → 아니요,  네 각의 크기가 모두 90°인가요? → 예', blank=False)
    s.ask('친구가 고른 카드:  (     )', blank=False)
    tab = ' / '.join('%s %s' % (KO[i], ''.join('○' if fn(GSH_I[i]) else '×' for _, fn in ASKQ)) for i in range(6))
    pick = [i for i in range(6) if GSH_I[i].npar >= 1 and not GSH_I[i].allEq and GSH_I[i].allRight]
    assert pick == [3]
    return tab + '(질문 1~6 차례, ○ 예 × 아니요)', '%s(%s)' % (KO[pick[0]], GSH[pick[0]][0])


# ================================================================ 교과서 차시 버전
def build_tb(level):
    s = Sheet(unit_label='4-2 수학 4. 사각형(교과서 차시)', level=level, grade_label='4학년')
    b = B(s, level)
    C = b.C
    A = []

    # ---------------------------------------------------------------- 1차시
    s.lesson(1, '개념 찾기(S)', '단원 도입 ― 놀이공원에서 직선과 사각형을 찾아요', '놀이공원 곳곳에서 어떤 직각과 직선, 사각형을 찾을 수 있을까요?')
    s.scene(None, '하율이는 부모님과 놀이공원에 놀러 갔어요. “어머니, 저기 보세요. 매표소에 직각이 보여요.” “마치 도형들이 하율이랑 숨바꼭질을 하는 것 같구나!”')
    s.step('① 살펴보기', '염소의 눈동자와 놀이공원에서 사각형 찾기')
    pic(s, goat_fig(), 62)
    s.choices([('염소의 눈동자는 어떤 모양인가요?', '( 동그라미 / 삼각형 / 직사각형 )'),
               ('직사각형 모양 눈동자는 어떤 점이 좋을까요?', '( 옆으로 넓게 볼 수 있어요 /\n위쪽만 잘 보여요 )')])
    pic(s, park_fig(), 150)
    b.help('곧은 선 4개로 둘러싸인 모양이 사각형이에요. 건물의 창문과 문, 표지판, 상자를 살펴봐요.')
    s.text('사각형을 찾을 수 있는 것에 ◯표 하세요.')
    s.table([[x.split(' ', 1)[1] for x in PARK], [''] * 6])
    s.step('② 떠올리기', '3학년 때 배운 직각 찾기')
    pic(s, angle_cards([(20, 90), (0, 60), (-35, 90), (10, 120)]), 125)
    b.help('종이를 반듯하게 두 번 접었을 때 생기는 각이 직각이에요(90°). 기울어진 각도 직각일 수 있어요.')
    s.ask('직각을 모두 골라 기호를 써 보세요.')
    s.text('직각인지 확인하는 방법으로 알맞은 것에 모두 ◯표 하세요.')
    s.choices([('삼각자의 직각 부분을 대어 봐요.', '(     )'), ('각도기로 재어 90°인지 봐요.', '(     )'), ('변의 길이를 비교해 봐요.', '(     )')])
    s.step('③ 계산하기', '사각형의 네 각의 크기의 합(4-1)')
    pic(s, labeled(from_angles([80, 95, 100, 85], 5, 3.5), angs=['80°', '95°', '100°', '□°']), 80)
    b.help('사각형의 네 각의 크기의 합은 360°예요. 360에서 알고 있는 세 각을 빼요.')
    s.ask('식:  360 − (      ) − (      ) − (      ) = (      )        □ = (      )°', blank=False)
    s.step('④ 약속 떠올리기', '알맞은 말에 ◯표 하기')
    s.fill(['네 각이 모두 직각인 사각형을 ( 직사각형 / 정사각형 / 삼각형 )이라고 해요.',
            '네 각이 모두 직각이고 네 변의 길이가 모두 같은 사각형을 ( 정사각형 / 직사각형 / 직각삼각형 )이라고 해요.'])
    s.step('⑤ 확인하기', '우리 주변에서 직각과 사각형 찾기')
    s.ask('교실이나 집에서 직각을 찾을 수 있는 곳:', blank=False)
    s.lines(1)
    s.ask('주변에서 찾은 사각형과 그 모양의 특징:', blank=False)
    s.lines(1)
    a = ('1차시  ① 직사각형, 옆으로 넓게 볼 수 있어요 / 매표소, 정사각형 표지판, 기념품 상자  ② 가, 다 / 삼각자, 각도기에 ◯  '
         '③ 360 − 80 − 95 − 100 = 85, □ = 85°  ④ 직사각형, 정사각형  ⑤ (예) 칠판의 귀퉁이 / 교실 문은 직사각형이에요. 네 각이 모두 직각이에요.')
    if C:
        s.step('⑥ 도전하기', '점 종이에 직사각형과 정사각형 만들기 (한 칸은 1 cm)')
        real(s, geo_panels([dict(cols=10, rows=6, title='직사각형'), dict(cols=10, rows=6, title='정사각형')]))
        b.why('정사각형과 직사각형은 어떤 점이 다른지 써 보세요.', 1)
        a += '  ⑥ 네 각이 모두 직각인 사각형 / 네 각이 모두 직각이고 네 변의 길이가 같은 사각형 (정사각형은 네 변의 길이도 모두 같아요.)'
    A.append(a)

    # ---------------------------------------------------------------- 2차시
    s.lesson(2, '개념 구축하기(O)', '수직과 수선을 알아볼까요', '두 직선이 어떻게 만날 때 서로 수직이라고 할까요? 수선은 어떻게 그을까요?')
    s.scene(None, '하율이는 놀이공원 매표소와 난간에서 여러 가지 각을 보았어요.')
    s.step('① 찾아 보기', '두 직선이 만나서 이루는 각이 직각인 곳에 직각 표시(└) 하기')
    pn = [(0, 90), (25, 90), (-15, 65)]
    pic(s, right_panels(pn), 140)
    b.help('삼각자의 직각을 한 직선에 맞추어 대 보세요. 다른 직선이 삼각자의 변과 겹치면 직각이에요.')
    s.ask('직각으로 만나는 그림의 기호를 모두 써 보세요.')
    s.step('② 약속하기', '수직과 수선')
    if not C:
        s.wordbox(['수직', '수선', '평행'])
    s.fill(['두 직선이 만나서 이루는 각이 직각일 때, 두 직선은 서로 (          )이라고 해요.',
            '두 직선이 서로 수직으로 만나면 한 직선을 다른 직선에 대한 (          )이라고 해요.'])
    s.choices([('선분과 선분이 만나서 이루는 각이 직각일 때에도 서로 수직이라고 할까요?', '( 네 / 아니요 )'),
               ('두 직선이 서로 수직이려면 두 직선의 길이가 비슷해야 할까요?', '( 네 / 아니요 )')])
    s.step('③ 그려 보기', '삼각자를 사용하여 수선 긋기 (실제 크기)')
    b.help('삼각자의 직각을 낀 한 변을 주어진 직선에 맞추고, 직각을 낀 다른 한 변을 따라 직선을 그어요.')
    s.text('⑴ 주어진 직선에 대한 수선을 그어 보세요.')
    real(s, line_fig(0, 16, 4.6, .55))
    s.text('⑵ 점 ㄱ을 지나고 주어진 직선에 수직인 직선을 그어 보세요.')
    real(s, line_fig(18, 16, 6.2, .68, pt=(2.5, 2.5)))
    s.choices([('그은 직선이 수선인 것을 어떻게 알 수 있나요?', '( 만나서 이루는 각이 직각이라서 /\n두 직선의 길이가 같아서 )')])
    s.step('④ 말해 보기', '놀이공원 지도에서 서로 수직으로 만나는 두 길 찾기')
    pic(s, road_fig(ROUTE_TB), 140)
    pr = line_pairs(ROUTE_TB, 'perp')
    assert pr == [('나눔길', '행복길'), ('나눔길', '희망길')], pr
    b.help('나눔길과 직각으로 만나는 길을 찾아봐요. 삼각자를 대어 봐도 좋아요.')
    s.ask('서로 수직으로 만나는 두 길:  (          )과 (          ),  (          )과 (          )', blank=False)
    s.step('⑤ 확인하기', '익힘 문제')
    pic(s, lines_fig([dict(n='가', c=(260, 230), a=0, len=210), dict(n='나', c=(260, 140), a=90, len=115)]), 72)
    s.choices([('직선 가와 직선 나는 서로 (     )입니다.', '( 수직 / 수선 )'), ('직선 가는 직선 나에 대한 (     )입니다.', '( 수직 / 수선 )')])
    PERP4 = [[(0, 0), (3, 0), (3, 3), (0, 2)], Q4S['p4'], [(0, 3), (4, 3), (1, 0)], [(0, 2), (2, 0), (4, 2)]]
    pk = ans(PERP4, has_perp, [0, 3])
    pic(s, cards(PERP4, 4, 30, rights=False), 150)
    s.ask('서로 수직인 변이 있는 도형을 모두 골라 기호를 써 보세요.')
    L6 = LN([('가', (380, 70), 0, 320), ('나', (110, 275), 90, 140), ('다', (230, 285), 45, 130), ('라', (470, 285), 135, 130),
             ('마', (620, 200), 20, 110), ('바', (640, 330), 110, 90)])
    p6 = line_pairs(L6, 'perp')
    assert len(p6) == 3
    pic(s, lines_named(L6), 120)
    b.help('직선을 늘였을 때 만나는 것도 생각해요.')
    s.ask('서로 수직으로 만나는 두 직선을 모두 짝 지어 쓰고, 모두 몇 쌍인지 써 보세요.', blank=False)
    s.ask('짝: (                                        )      모두 (     )쌍', blank=False)
    a = ('2차시  ① 가, 나  ② 수직, 수선 / 네, 아니요  ③ 삼각자의 직각을 낀 다른 한 변을 따라 그은 직선(⑵는 점 ㄱ을 지남), 만나서 이루는 각이 직각이라서  '
         '④ %s  ⑤ 수직, 수선 / %s / %s, 3쌍' % (pairs_txt([(q, p) for p, q in pr]), kos(pk), pairs_txt(p6)))
    if C:
        s.step('⑥ 도전하기', '삼각자로 수선을 옳게 그은 것 찾기')
        pic(s, sq_draw(), 120)
        s.ask('수선을 옳게 그은 것의 기호:  (     )', blank=False)
        s.choices([('점 ㄱ을 지나고 주어진 직선에 수직인 직선은 몇 개 그을 수 있나요?', '( 1개 / 2개 /\n셀 수 없이 많아요 )')])
        b.why('잘못 그은 그림은 무엇이 잘못되었는지 써 보세요.', 1)
        a += '  ⑥ ㉡, 1개 (㉠은 삼각자의 직각을 끼지 않은 긴 변을 직선에 맞추어서 직각으로 만나지 않아요.)'
    A.append(a)

    # ---------------------------------------------------------------- 3차시
    s.lesson(3, '개념 구축하기(O)', '평행과 평행선을 알아볼까요', '아무리 늘여도 만나지 않는 두 직선은 어떤 관계일까요? 평행선은 어떻게 그을까요?')
    s.scene(None, '하율이는 회전목마와 대관람차에서 여러 가지 직선을 보았어요.')
    s.step('① 찾아 보기', '아무리 늘여도 서로 만나지 않는 두 직선 찾기')
    L3 = LN([('가', (380, 395), 0, 320), ('나', (120, 230), 90, 110), ('다', (235, 215), 90, 120), ('바', (520, 110), 30, 150),
             ('라', (430, 300), 120, 80), ('마', (590, 290), 120, 85)])
    p3 = line_pairs(L3, 'para')
    assert p3 == [('나', '다'), ('라', '마')], p3
    pic(s, lines_named(L3), 120)
    b.help('자를 대고 직선을 길게 늘여 보세요. 기울어진 두 직선도 서로 만나지 않을 수 있어요.')
    s.ask('서로 만나지 않는 두 직선:  직선 (     )와 직선 (     ),  직선 (     )와 직선 (     )', blank=False)
    s.choices([('직선 나와 직선 다는 직선 가와 어떻게 만나나요?', '( 수직으로 만나요 / 60°로 만나요 )'),
               ('직선 라와 직선 마는 어떤 직선과 수직으로 만나나요?', '( 직선 가 / 직선 바 / 직선 나 )')])
    s.step('② 약속하기', '평행과 평행선')
    if not C:
        s.wordbox(['평행', '평행선', '수직', '수선'])
    s.fill(['한 직선에 수직인 두 직선을 그었을 때, 그 두 직선은 서로 만나지 않아요.',
            '이와 같이 서로 만나지 않는 두 직선을 (          )하다고 해요.',
            '이때 평행한 두 직선을 (          )이라고 해요.'])
    s.step('③ 접어 보기', '종이를 접어 평행선 만들기')
    pic(s, foldpar_fig(), 105)
    s.text('종이를 반으로 접어 빨간 선을 만들고, 빨간 선에 맞추어 두 번 더 접어 파란 선 두 개를 만들었어요.')
    s.choices([('두 파란 선이 평행선인 까닭은?', '( 두 파란 선이 모두 빨간 선과 수직이라서 /\n두 파란 선의 길이가 같아서 )')])
    s.step('④ 그려 보기', '삼각자 2개로 평행선 긋기 (실제 크기)')
    b.help('한 삼각자를 고정하고, 다른 삼각자를 고정한 삼각자를 따라 밀어서 변을 따라 그어요.')
    s.text('⑴ 주어진 직선과 평행한 직선을 그어 보세요.   ⑵ 점 ㄱ을 지나고 주어진 직선과 평행한 직선을 그어 보세요.')
    real(s, side_by_side([line_fig(0, 8.6, 5, .78, title='⑴'), line_fig(-15, 8.6, 5, .78, pt=(1.5, 3.25), title='⑵')], 12))
    s.choices([('주어진 직선과 평행한 직선은 몇 개 그을 수 있나요?', '( 1개 / 2개 / 셀 수 없이 많아요 )'),
               ('점 ㄱ을 지나고 주어진 직선과 평행한 직선은?', '( 1개 / 2개 / 셀 수 없이 많아요 )')])
    s.step('⑤ 확인하기', '익힘 문제')
    pic(s, two_lines([((30, 70), (285, 100)), ((30, 170), (285, 125))], [((345, 180), (470, 50)), ((435, 190), (560, 60))]), 100)
    s.ask('서로 만나지 않는 두 직선의 기호를 써 보세요.')
    q1, q2 = [(0, 0), (1, 3), (4, 3), (6, 0)], [(0, 2), (1, 4), (5, 4), (6, 1), (4, 0), (1, 0)]
    f1, f2 = fit(q1, (0, 0, 380, 280, 50), 50), fit(q2, (0, 0, 420, 300, 50), 45)
    pic(s, side_by_side([Fig(380, 280, dotsm(f1, 6, 6, 374, 274) + polyG(f1.P, fs=20, names=True, rights=False)),
                         Fig(420, 300, dotsm(f2, 6, 6, 414, 294) + polyG(f2.P, fs=20, names=True, rights=False))], 30), 150)
    for q, want in ((q1, (1, 3)), (q2, (1, 4))):
        Iq = info(q)
        assert abs(cr(Iq.S[want[0]], Iq.S[want[1]])) < 1e-9
    s.ask('사각형 ㄱㄴㄷㄹ에서 서로 평행한 두 변:  변 (        )과 변 (        )', blank=False)
    s.ask('육각형 ㄱㄴㄷㄹㅁㅂ에서 서로 평행한 두 변:  변 (        )과 변 (        )', blank=False)
    s.choices([('수호: “평행한 두 직선은 서로 수직으로 만나.”\n바르게 고친 것은?', '( 평행한 두 직선은 서로 만나지 않아 /\n평행한 두 직선은 한 점에서 만나 )')])
    a = ('3차시  ① 나와 다, 라와 마 / 수직으로 만나요, 직선 바  ② 평행, 평행선  ③ 두 파란 선이 모두 빨간 선과 수직이라서  '
         '④ 고정한 삼각자를 따라 다른 삼각자를 밀어 그은 직선(⑵는 점 ㄱ을 지남) / 셀 수 없이 많아요, 1개  '
         '⑤ ㉡ / 변 ㄴㄷ과 변 ㄹㄱ / 변 ㄴㄷ과 변 ㅁㅂ / 평행한 두 직선은 서로 만나지 않아')
    if C:
        s.step('⑥ 도전하기', '기울어진 직선들 중에서 서로 평행한 두 직선 모두 찾기')
        L3c = LN([('가', (190, 230), 55, 130), ('나', (330, 230), 55, 130), ('다', (440, 120), 10, 110), ('라', (520, 300), 150, 110), ('마', (620, 220), 55, 120)])
        pc = line_pairs(L3c, 'para')
        assert len(pc) == 3
        pic(s, lines_named(L3c), 115)
        s.ask('서로 평행한 두 직선을 모두 짝 지어 쓰고, 모두 몇 쌍인지 써 보세요.  (                              ),  (     )쌍', blank=False)
        b.why('세 직선이 모두 서로 평행하면 짝이 몇 쌍 생기는지, 그 까닭을 써 보세요.', 1)
        a += '  ⑥ %s, 3쌍 (가, 나, 마 세 직선이 모두 같은 방향이라 두 개씩 짝 지으면 3쌍이에요.)' % pairs_txt(pc)
    A.append(a)

    # ---------------------------------------------------------------- 4차시
    s.lesson(4, '개념 구축하기(O)', '평행선 사이의 거리를 알아볼까요', '평행선 사이의 거리는 어떻게 잴까요?')
    s.scene(None, '배가 고파진 하율이네 가족은 먹거리 장터의 한식 구역에서 양식 구역으로 가려고 해요.')
    s.step('① 재어 보기', '평행한 두 길 사이를 잇는 길 가~마의 길이 재기 (실제 크기)')
    sg = [(-5.5, -2.5), (-3.5, -2), (0, 0), (1.5, 3.5), (3, 6)]
    lens = [math.hypot(b2 - a1, 3) for a1, b2 in sg]
    assert lens.index(min(lens)) == 2
    real(s, seg_fig(3, sg, lineNames=['양식 구역 쪽 길', '한식 구역 쪽 길'], lnS=5.6, H=230))
    b.help('자의 눈금 0을 선분의 한끝에 맞추고 재어요.')
    s.ask('길이가 가장 짧은 선분의 기호와 길이:  선분 (     ),  (       ) cm', blank=False)
    s.choices([('가장 짧은 선분은 평행선과 어떻게 만나나요?', '( 수직으로 만나요 / 비스듬히 만나요 )')])
    s.step('② 약속하기', '평행선 사이의 거리')
    if not C:
        s.wordbox(['수직인', '평행선 사이의 거리', '비스듬한'])
    s.fill(['평행선의 한 직선에서 다른 직선에 (          ) 선분을 그어요.', '이때 수직인 선분의 길이를 (                    )라고 해요.'])
    s.step('③ 그어서 재기', '점 ㄱ에서 평행선에 수직인 선분을 긋고 거리 재기 (실제 크기)')
    real(s, dist_fig([dict(d=3, ang=0, sA=0, title='⑴'), dict(d=2, ang=25, sA=1, title='⑵')]))
    b.help('삼각자의 직각을 낀 한 변을 아래 직선에 맞추고, 점 ㄱ에서 위 직선까지 그어요.')
    s.ask('평행선 사이의 거리:  ⑴ (       ) cm     ⑵ (       ) cm', blank=False)
    s.choices([('평행선 사이의 거리는 어디에서 재어도 같을까요?', '( 네, 모두 같아요 / 아니요, 달라요 )')])
    s.step('④ 그려 보기', '평행선 사이의 거리가 3 cm가 되도록 평행선 긋기 (실제 크기)')
    real(s, line_fig(-10, 16, 5.6, .8))
    b.help('주어진 직선에 수선을 긋고, 수선 위에서 3 cm인 곳에 점을 찍은 다음, 그 점을 지나는 평행선을 그어요.')
    b.why('어떻게 그었는지 설명해 보세요.', 1)
    s.step('⑤ 확인하기', '익힘 문제')
    sg2 = [(-5, -3), (-2.5, -1), (0.5, 2.5), (4, 4)]
    pic(s, seg_fig(2.5, sg2, names=['㉠', '㉡', '㉢', '㉣'], lineNames=['가', '나'], H=260), 110)
    s.ask('평행선 가와 나 사이의 거리를 나타내는 선분의 기호를 써 보세요.')
    sg3 = [(-7, -7 + math.sqrt(39)), (1.2, 1.2), (2.6, 2.6 + math.sqrt(11))]
    assert [round(math.hypot(q - p, 5), 6) for p, q in sg3] == [8, 5, 6]
    real(s, seg_fig(5, sg3, names=[' '] * 3, lens=['8 cm', '5 cm', '6 cm'], show=(0, 1, 2), lineNames=['가', '나'], rightMk=True, H=290))
    s.ask('직선 가와 직선 나는 평행해요. 평행선 사이의 거리는 몇 cm인가요?')
    pic(s, seg_fig(3, [(-3.5, -1.5), (2, 2)], names=['㉠', '㉡'], rightMk=True, H=230, W=520), 85)
    s.ask('평행선 사이의 거리를 옳게 잰 것의 기호를 써 보세요.')
    a = ('4차시  ① 선분 다, 3 cm / 수직으로 만나요  ② 수직인, 평행선 사이의 거리  ③ ⑴ 3 cm ⑵ 2 cm / 네, 모두 같아요  '
         '④ (예) 주어진 직선에 수선을 긋고 수선 위 3 cm인 곳에 점을 찍어, 삼각자 2개로 그 점을 지나는 평행선을 그었어요.  ⑤ ㉣ / 5 cm / ㉡')
    if C:
        s.step('⑥ 도전하기', '사다리꼴 표지판의 평행한 두 변을 늘인 직선 사이의 거리 재기 (실제 크기)')
        real(s, dist_fig([dict(d=2.5, ang=-20, sA=-1)], W_cm=12, H_cm=5.6))
        s.ask('평행선 사이의 거리:  (     ) cm (     ) mm  =  (       ) cm', blank=False)
        b.why('비스듬히 그은 선분으로 재면 왜 안 되는지 써 보세요.', 1)
        a += '  ⑥ 2 cm 5 mm = 2.5 cm (비스듬한 선분은 수직인 선분보다 길어서 거리가 아니에요.)'
    A.append(a)

    # ---------------------------------------------------------------- 5차시
    s.lesson(5, '개념 구축하기(O)', '사다리꼴을 알아볼까요', '평행한 변이 있는 사각형을 무엇이라고 할까요?')
    s.scene(None, '하율이는 마법의 성의 지붕과 성벽 장식에서 여러 가지 사각형을 찾았어요.')
    s.step('① 분류하기', '평행한 변이 있는지에 따라 사각형 나누기')
    C5A = QL('t2 p1 c1 n1 t3 n2')
    yes = ans(C5A, lambda p: info(p).npar >= 1, [0, 1, 2, 4])
    pic(s, cards(C5A, 6, 26, cw=180, ch=160), 175)
    b.help('점 종이의 칸을 세어 마주 보는 두 변이 같은 방향인지 봐요. 평행한 변이 한 쌍만 있어도 ‘있는’ 쪽이에요.')
    s.table([['평행한 변이 있는 사각형', '평행한 변이 없는 사각형'], ['', '']], row_h=3600)
    s.step('② 약속하기', '사다리꼴')
    s.fill('평행한 변이 있는 사각형을 ( 사다리꼴 / 평행사변형 / 마름모 )이라고 해요.')
    s.choices([('평행한 변이 두 쌍인 사각형도 사다리꼴일까요?', '( 네 / 아니요 )')])
    s.step('③ 찾아 보기', '사다리꼴 모두 찾기')
    C5B = QL('t7 t4 n3 n4 p4')
    tr = ans(C5B, lambda p: info(p).npar >= 1, [0, 1, 4])
    pic(s, cards(C5B, 5, 26, cw=180, ch=160), 165)
    s.ask('사다리꼴을 모두 골라 기호를 써 보세요.')
    s.choices([('다와 라는 왜 사다리꼴이 아닌가요?', '( 평행한 변이 없어서 / 직각이 없어서 )')])
    s.step('④ 그려 보기', '점 종이에 서로 다른 모양의 사다리꼴 2개 그리기 (한 칸은 1 cm)')
    b.help('주어진 선분 ㄱㄴ과 평행한 변을 하나 그리면 사다리꼴이 돼요.')
    real(s, geo_panels([dict(cols=10, rows=6, fixed=[(1, 1), (4, 1)], title='⑴ 선분 ㄱㄴ을 이용하여'), dict(cols=10, rows=6, title='⑵ 앞과 다른 모양으로')]))
    s.step('⑤ 확인하기', '익힘 문제')
    C5E = QL('n3 t1 p4 c1 n4 t3')
    te = ans(C5E, lambda p: info(p).npar >= 1, [1, 2, 3, 5])
    pic(s, cards(C5E, 6, 26, cw=180, ch=160), 175)
    s.ask('사다리꼴을 모두 골라 기호를 써 보세요.')
    q5 = [(0, 0), (0, 4), (3, 3), (3, 1)]
    assert abs(cr(info(q5).S[0], info(q5).S[2])) < 1e-9
    f5 = fit(q5, (0, 0, 300, 260, 45), 45)
    pic(s, Fig(300, 260, dotsm(f5, 6, 6, 294, 254) + polyG(f5.P, fs=20, names=True, rights=False)), 58)
    s.ask('사다리꼴 ㄱㄴㄷㄹ에서 서로 평행한 두 변:  변 (        )과 변 (        )', blank=False)
    a = ('5차시  ① 있는: %s / 없는: %s  ② 사다리꼴, 네  ③ %s, 평행한 변이 없어서  ④ 평행한 변이 한 쌍 이상인 사각형(학생마다 다름)  ⑤ %s / 변 ㄱㄴ과 변 ㄷㄹ'
         % (kos(yes), kos([i for i in range(6) if i not in yes]), kos(tr), kos(te)))
    if C:
        s.step('⑥ 도전하기', '꼭짓점 옮기기와 조건에 맞는 사다리꼴')
        fixp, g0, cand = [(1, 4), (5, 4), (4, 1)], (1, 0), [(0, 0), (2, 0), (1, 1), (0, 3)]
        okc = [i for i, c in enumerate(cand) if info([c] + fixp).kind == 'trap']
        assert okc == [2]

        def mv(px):
            P = [px(q) for q in [g0] + fixp]
            o = POLY(P, 'rgba(228,122,56,.12)', INK, 3.5) + T(P[0][0] - 4, P[0][1] - 18, 'ㄱ', 20, RED, weight='bold') + CIRC(P[0][0], P[0][1], 6, RED)
            for k, c in enumerate(cand):
                Q = px(c)
                o += CIRC(Q[0], Q[1], 6, SKY) + T(Q[0] - 16, Q[1] - 14, ['ㄴ', 'ㄷ', 'ㄹ', 'ㅁ'][k], 18, SKY, weight='bold')
            return o
        pic(s, geo_panels([dict(cols=6, rows=5, extra=mv)]), 62)
        s.ask('점 ㄱ을 점 ㄴ, ㄷ, ㄹ, ㅁ 중 어디로 옮기면 사다리꼴이 되나요?  점 (     )', blank=False)
        s.text('평행한 두 변의 길이가 3 cm, 4 cm이고, 두 변 사이의 거리가 3 cm인 사다리꼴을 그려 보세요.')
        real(s, geo_panels([dict(cols=10, rows=6)]))
        b.why('그린 사다리꼴이 조건에 맞는지 어떻게 확인했는지 써 보세요.', 1)
        a += '  ⑥ 점 ㄹ / (예) 3칸짜리 변과 4칸짜리 변을 3칸 떨어지게 나란히 그려요(점 종이 칸으로 길이와 거리를 확인).'
    A.append(a)

    # ---------------------------------------------------------------- 6차시
    s.lesson(6, '개념 구축하기(O)', '평행사변형을 알아볼까요', '마주 보는 두 쌍의 변이 서로 평행한 사각형은 어떤 성질이 있을까요?')
    s.scene(None, '하늘로 높이 올라가는 배 모양 놀이기구의 계단 난간과 간판에서 여러 가지 사각형을 찾았어요.')
    s.step('① 분류하기', '평행한 변이 몇 쌍인지에 따라 나누기')
    C6A = QL('p2 c2 t1 r2 t6 p3')
    one = ans(C6A, lambda p: info(p).npar == 1, [2, 4])
    pic(s, cards(C6A, 6, 26, cw=180, ch=160), 175)
    b.help('마주 보는 변은 두 쌍이 있어요. 각 쌍이 평행한지 하나씩 살펴봐요. 직사각형도 두 쌍이 평행해요.')
    s.table([['평행한 변이 한 쌍인 사각형', '평행한 변이 두 쌍인 사각형'], ['', '']], row_h=3600)
    s.step('② 약속하기', '평행사변형')
    s.fill('마주 보는 두 쌍의 변이 서로 평행한 사각형을 ( 평행사변형 / 사다리꼴 / 마름모 )이라고 해요.')
    s.step('③ 잘라 보기', '평행사변형 종이를 잘라 성질 알아보기')
    pic(s, pgcut_fig(PG(5, 3, 60)), 82)
    s.text('① 빨간 선(꼭짓점 ㄱ과 ㄷ을 이은 선)을 따라 잘라 한 조각을 180° 돌려 겹쳐 봐요.  ② 각을 잘라 이웃하는 두 각을 나란히 이어 붙여 봐요.')
    s.choices([('①에서 마주 보는 두 변의 길이는?', '( 같아요 / 달라요 )'), ('①에서 마주 보는 두 각의 크기는?', '( 같아요 / 달라요 )')])
    b.help('이웃하는 두 각을 이어 붙이면 일직선이 돼요.')
    s.ask('②에서 이웃하는 두 각의 크기의 합:  (       )°', blank=False)
    s.step('④ 그려 보기', '점 종이에 서로 다른 모양의 평행사변형 2개 그리기 (한 칸은 1 cm)')
    fx6 = [(2, 1), (1, 4), (5, 4)]
    assert info(fx6 + [fourth(fx6)]).kind == 'para'
    b.help('주어진 두 선분과 평행하게 나머지 두 변을 그어요.')
    real(s, geo_panels([dict(cols=10, rows=6, fixed=fx6, title='⑴ 선분 ㄱㄴ, ㄴㄷ을 이용하여'), dict(cols=10, rows=6, title='⑵ 앞과 다른 모양으로')]))
    s.step('⑤ 확인하기', '평행사변형의 성질로 구하기')
    P6 = PG(4, 2, 50)
    I6 = info(P6)
    assert round(I6.A[2]) == 50 and round(I6.A[1]) == 130
    pic(s, labeled(P6, lens=['4 cm', '㉡ cm', '㉠ cm', '2 cm'], angs=['50°', '㉣°', '㉢°', None]), 80)
    s.ask('㉠ (     ) cm   ㉡ (     ) cm   ㉢ (     )°   ㉣ (     )°', blank=False)
    s.choices([('윤서: “마주 보는 두 쌍의 변이 서로 평행하니까 평행사변형이야.”\n진우: “네 변의 길이가 모두 같으니까 평행사변형이야.”\n잘못 말한 사람은?', '( 윤서 / 진우 )')])
    pic(s, labeled(PG(9, 7, 70), lens=['9 cm', '□ cm', '□ cm', '7 cm']), 80)
    s.ask('평행사변형의 두 □ 안에 알맞은 수의 합을 구해 보세요.')
    a = ('6차시  ① 한 쌍: %s / 두 쌍: %s  ② 평행사변형  ③ 같아요, 같아요 / 180°  ④ ⑴ 넷째 꼭짓점은 ㄱ에서 오른쪽으로 4칸 ⑵ 학생마다 다름  '
         '⑤ ㉠ 4 ㉡ 2 ㉢ 50 ㉣ 130 (180 − 50) / 진우 / 7 + 9 = 16' % (kos(one), kos([i for i in range(6) if i not in one])))
    if C:
        s.step('⑥ 도전하기', '꼭짓점 한 개만 옮겨 평행사변형 만들기 (한 칸은 1 cm)')
        st6 = [(1, 4), (5, 4), (6, 1), (3, 1)]
        mo = move_opts(st6, 9, 6, lambda I, Vv: I.npar == 2)
        real(s, geo_panels([dict(cols=9, rows=6, start=st6)]))
        s.ask('어느 꼭짓점을 어디로 옮겼는지 쓰고, 옮긴 모양을 그려 보세요.', blank=False)
        s.lines(1)
        b.why('옮긴 모양이 평행사변형인 까닭을 써 보세요.', 1)
        a += '  ⑥ (예) %s (가능한 것: %s) / 마주 보는 두 쌍의 변이 서로 평행해서' % (move_txt(st6, *mo[0]), '; '.join(move_txt(st6, *m) for m in mo))
    A.append(a)

    # ---------------------------------------------------------------- 7차시
    s.lesson(7, '개념 구축하기(O)', '마름모를 알아볼까요', '네 변의 길이가 모두 같은 사각형은 어떤 성질이 있을까요?')
    s.scene(None, '하율이는 기념품 가게의 기념품에서 여러 가지 사각형을 찾았어요.')
    s.step('① 분류하기', '변의 길이에 따라 사각형 나누기')
    C7A = QL('r1 p6 c1 s2 n6 r3')
    eq = ans(C7A, lambda p: info(p).allEq, [0, 3, 5])
    pic(s, cards(C7A, 6, 26, cw=180, ch=160), 175)
    b.help('비스듬한 변은 가로·세로로 몇 칸 가는지 세어 봐요. 가로 2칸·세로 1칸과 가로 1칸·세로 2칸은 길이가 같아요.')
    s.table([['네 변의 길이가 모두 같은 사각형', '네 변의 길이가 모두 같지는 않은 사각형'], ['', '']], row_h=3600)
    s.step('② 약속하기', '마름모')
    s.fill('네 변의 길이가 모두 같은 사각형을 ( 마름모 / 평행사변형 / 사다리꼴 )라고 해요.')
    s.step('③ 접어 보기', '마름모 종이를 두 번 접었다 펼쳐서 재어 보기 (실제 크기)')
    real(s, rhfold_fig(2.4, 1.6, 18))
    s.text('① ㄱㄷ을 따라 반으로 접고, ② ㄴㄹ을 따라 한 번 더 접은 다음 펼쳤어요. 두 접힌 선이 만나는 점이 ㅁ이에요.')
    s.ask('선분 ㅁㄱ (      ),  선분 ㅁㄷ (      ),  선분 ㅁㄴ (      ),  선분 ㅁㄹ (      )', blank=False)
    s.choices([('①에서 마주 보는 두 각(각 ㄴ과 각 ㄹ)의 크기는?', '( 같아요 / 달라요 )'),
               ('선분 ㄱㄷ과 선분 ㄴㄹ이 만나서 이루는 각은?', '( 90° / 60° / 180° )')])
    s.step('④ 그려 보기', '점 종이에 서로 다른 모양의 마름모 2개 그리기 (한 칸은 1 cm)')
    fx7 = [(3, 1), (1, 2)]
    b.help('네 변의 길이가 모두 같게 그려요. 선분 ㄱㄴ은 왼쪽으로 2칸, 아래로 1칸 가요.')
    real(s, geo_panels([dict(cols=10, rows=6, fixed=fx7, title='⑴ 선분 ㄱㄴ을 이용하여'), dict(cols=10, rows=6, title='⑵ 앞과 다른 모양으로')]))
    s.step('⑤ 확인하기', '마름모의 성질로 구하기')
    R7 = RH(7, 70)
    assert round(info(R7).A[1]) == 110 and round(info(R7).A[3]) == 110
    pic(s, side_by_side([labeled(R7, lens=['7 cm', '㉡ cm'], angs=[None, '110°', None, '㉠°'], W=360), rh_diag(4, 6, ['4 cm', '㉢ cm', '㉣°'])], 20), 125)
    s.ask('㉠ (     )°   ㉡ (     ) cm   ㉢ (     ) cm   ㉣ (     )°', blank=False)
    C7E = QL('p1 c3 r2 t2 s2 n6')
    re7 = ans(C7E, lambda p: info(p).allEq, [2, 4])
    pic(s, cards(C7E, 6, 26, cw=180, ch=160), 175)
    s.ask('마름모를 모두 골라 기호를 써 보세요.')
    s.choices([('마름모에 대한 설명으로 잘못된 것은?\n㉠ 마주 보는 두 변의 길이가 다릅니다.\n㉡ 마주 보는 꼭짓점끼리 이은 두 선분은 서로 수직으로 만납니다.\n㉢ 네 변의 길이가 모두 같습니다.', '( ㉠ / ㉡ / ㉢ )')])
    a = ('7차시  ① 같은: %s / 같지 않은: %s  ② 마름모  ③ 2 cm 4 mm, 2 cm 4 mm, 1 cm 6 mm, 1 cm 6 mm / 같아요, 90°  '
         '④ 네 변의 길이가 모두 같은 사각형(학생마다 다름)  ⑤ ㉠ 110 ㉡ 7 ㉢ 4 ㉣ 90 / %s / ㉠'
         % (kos(eq), kos([i for i in range(6) if i not in eq]), kos(re7)))
    if C:
        s.step('⑥ 도전하기', '꼭짓점 한 개만 옮겨 마름모 만들기 (한 칸은 1 cm)')
        st7 = [(1, 3), (4, 1), (8, 3), (4, 5)]
        mo = move_opts(st7, 9, 6, lambda I, Vv: I.allEq)
        real(s, geo_panels([dict(cols=9, rows=6, start=st7)]))
        s.ask('어느 꼭짓점을 어디로 옮겼는지 쓰고, 옮긴 모양을 그려 보세요.', blank=False)
        s.lines(1)
        b.why('옮긴 모양이 마름모인 까닭을 써 보세요.', 1)
        a += '  ⑥ %s (네 변의 길이가 모두 같아져요.)' % '; '.join(move_txt(st7, *m) for m in mo)
    A.append(a)

    # ---------------------------------------------------------------- 8차시
    s.lesson(8, '탐구 정리하기(O)', '여러 가지 사각형을 알아볼까요', '여러 가지 사각형은 각각 어떤 성질을 가지고 있을까요?')
    s.scene(None, '해 질 녘, 하율이는 나가는 길을 알려 주는 표지판에서 직사각형과 정사각형을 찾았어요.')
    s.step('① 살펴보기', '직사각형과 정사각형의 변과 각 재어 보기 (실제 크기)')
    real(s, side_by_side([meas_fig(Q4S['c3']), meas_fig(Q4S['s1'])], 24))
    s.choices([('직사각형과 정사각형의 네 각의 크기는?', '( 모두 90°예요 / 두 각만 90°예요 )'),
               ('직사각형과 정사각형에서 평행한 변은 각각 몇 쌍?', '( 각각 1쌍 / 각각 2쌍 )'),
               ('마주 보는 두 변의 길이는?', '( 같아요 / 달라요 )')])
    s.step('② 정리하기', '알맞은 말에 ◯표 하기')
    s.fill(['직사각형은 네 각이 모두 ( 90° / 60° )이고, 마주 보는 두 쌍의 변이 서로 ( 평행해요 / 수직이에요 ).',
            '정사각형은 직사각형의 성질에 더해 네 변의 길이가 모두 ( 같아요 / 달라요 ).'])
    s.step('③ 표 채우기', '설명에 알맞은 사각형을 찾아 ◯표 하기')
    C8 = [Q4S['c3'], K([(0, 3), (1, 0), (4, 0), (6, 3)], 'trap'), Q4S['r2'], Q4S['s1'], Q4S['p5']]
    pic(s, cards(C8, 5, 22, cw=180, ch=150), 160)
    b.help('한 줄씩 설명을 읽고 가~마를 하나씩 확인해요. 한 사각형이 여러 설명에 맞을 수 있어요.')
    sheet_table(s, KO[:5], [r for r, _ in DESC])
    s.step('④ 만들어 보기', '종이띠 6개 중 4개로 서로 다른 사각형 2개 만들기 (실제 크기, 잘라서 써요)')
    real(s, strips_fig())
    b.help('긴 띠 4개로 만들면 네 변의 길이가 모두 같아요. 긴 띠와 짧은 띠를 번갈아 놓으면 마주 보는 변의 길이가 같아요.')
    s.table([['', '고른 띠 4개', '만든 사각형의 이름'], ['첫째', '', ''], ['둘째', '', '']], col_mm=[25, 85, 70])
    b.why('만든 사각형 하나를 친구에게 설명해 보세요.', 1)
    s.step('⑤ 확인하기', '익힘 문제')
    C8E = QL('p5 s1 t6 r1 c2 n1')
    rr8 = ans(C8E, lambda p: info(p).allRight, [1, 4])
    sq8 = ans(C8E, lambda p: info(p).allRight and info(p).allEq, [1])
    pic(s, cards(C8E, 6, 26, cw=180, ch=160), 175)
    s.ask('직사각형을 모두 고르면 (          ),  정사각형을 모두 고르면 (          )', blank=False)
    pic(s, side_by_side([labeled([(0, 0), (8, 0), (8, 4), (0, 4)], lens=['8 cm', '㉡ cm', None, '4 cm'], angs=[None, None, '㉠°', None]),
                         labeled([(0, 0), (5, 0), (5, 5), (0, 5)], lens=[None, '㉣ cm', '5 cm', None], angs=['㉢°', None, None, None], W=260)], 20), 120)
    s.text('왼쪽은 직사각형, 오른쪽은 정사각형이에요.')
    s.ask('㉠ (     )°   ㉡ (     ) cm   ㉢ (     )°   ㉣ (     ) cm', blank=False)
    qn = [(0, 0), (5, 0), (5, 3), (2, 3)]
    assert not info(qn).allRight
    fq = fit(qn, (0, 0, 320, 220, 30), 50)
    pic(s, Fig(320, 220, dotsm(fq, 5, 5, 315, 215, 2.4) + polyG(fq.P, fs=18)), 55)
    s.choices([('이 도형은 직사각형인가요?', '( 직사각형이에요 / 아니에요 )'), ('그렇게 생각한 까닭은?', '( 네 각이 모두 직각이 아니라서 /\n평행한 변이 있어서 )')])
    t8 = tbl_answer(C8, DESC)
    a = ('8차시  ① 모두 90°예요, 각각 2쌍, 같아요  ② 90°, 평행해요, 같아요  ③ %s  ④ (예) 5 cm 4개 → 마름모(각 ㄱ이 90°이면 정사각형), 5 cm·3 cm를 번갈아 → 평행사변형(각 ㄱ이 90°이면 직사각형)  '
         '⑤ 직사각형 %s, 정사각형 %s / ㉠ 90 ㉡ 4 ㉢ 90 ㉣ 5 / 아니에요, 네 각이 모두 직각이 아니라서' % (' / '.join(t8), kos(rr8), kos(sq8)))
    if C:
        s.step('⑥ 도전하기', '직사각형 종이띠를 잘라 생긴 조각 가~바')
        CUT = [(0, 0), (4, 4), (6, 5), (8, 7), (10, 10), (13, 13), (15, 15)]
        PCS = pieces_of(CUT)
        assert [info(p).kind for p in PCS] == ['rect', 'trap', 'para', 'trap', 'sq', 'rect']
        pic(s, cutstrip_fig(CUT, 15), 170)
        ROWS = [('사다리꼴(평행한 변이 있는 사각형)', lambda I: I.npar >= 1), ('평행사변형(마주 보는 두 쌍의 변이 평행한 사각형)', lambda I: I.npar == 2),
                ('마름모(네 변의 길이가 모두 같은 사각형)', lambda I: I.allEq), ('직사각형(네 각이 모두 직각인 사각형)', lambda I: I.allRight),
                ('정사각형(네 각이 모두 직각이고 네 변의 길이가 모두 같은 사각형)', lambda I: I.allRight and I.allEq)]
        sheet_table(s, KO[:6], [r for r, _ in ROWS])
        b.why('조각 마가 여러 줄에 ◯가 되는 까닭을 써 보세요.', 1)
        a += '  ⑥ %s / 마는 정사각형이라 네 각이 직각이고 네 변이 같아서 모든 약속에 맞아요.' % ' / '.join(x.split('(')[0] + ' ' + x.split(') ')[1] for x in tbl_answer(PCS, ROWS))
    A.append(a)

    # ---------------------------------------------------------------- 9차시
    s.lesson(9, '탐구 정리하기(O)', '생각을 더하다 ― 소방관의 대피 훈련을 도와주세요', '평행선 사이의 거리를 이용하여 대피에 필요한 줄사다리의 길이를 어떻게 구할까요?')
    s.scene(None, '소방관이 훈련 탑에서 대피 훈련을 하고 있어요. 각 층의 기둥은 바닥과 수직으로 튼튼하게 세워져 있어요. “신속히 대피하라! 줄사다리가 얼마나 필요할까요?”')
    s.step('① 이해해요', '무엇을 구할까요?')
    s.choices([('구하려고 하는 것은?', '( 줄사다리가 몇 m보다 길어야 하는지 /\n훈련 탑의 계단의 수 )'), ('소방관은 어디에서 어디로 대피하나요?', '( 3층에서 1층 바닥으로 /\n1층에서 옥상으로 )')])
    s.step('② 계획해요', '어떻게 구할까요?')
    s.fill(['각 층의 바닥과 기둥이 서로 ( 수직 / 평행 )으로 만나므로, 층 바닥을 나타내는 선분 가, 나, 다는 서로 ( 평행해요 / 수직이에요 ).',
            '그래서 1층 바닥에서 3층 바닥까지의 높이는 ( 평행선 사이의 거리 / 비스듬한 계단의 길이 )를 이용하여 구해요.'])
    s.step('③ 해결해요', '필요한 길이에 ◯표 하고 줄사다리의 길이 구하기')

    def deco9(X, Y):
        o = RECT(X(5.6), Y(7.3), 1.2 * 44, 2.1 * 44, '#9C6B3A', 'none', 0, 0) + RECT(X(5.6), Y(2.7), 1.2 * 44, 2.7 * 44, '#9C6B3A', 'none', 0, 0)
        o += L((X(2.6), Y(0)), (X(2.6 + 1.9596), Y(2.9)), '#5A4A3F', 7)
        for k in range(11):
            o += L((X(8.6), Y(5.2 * k / 10)), (X(9.0), Y(5.2 * k / 10)), '#B4610F', 2)
        o += L((X(8.6), Y(0)), (X(8.6), Y(5.2)), '#B4610F', 2.5, '6 3') + L((X(9.0), Y(0)), (X(9.0), Y(5.2)), '#B4610F', 2.5, '6 3')
        o += L((X(6.8), Y(5.2)), (X(9.0), Y(5.2)), '#B4610F', 3) + T(X(9.3), Y(5.75), '줄사다리', 14, '#B4610F')
        return o
    pic(s, tower_fig([(0, '다', '1층 바닥'), (2.9, '나', '2층 바닥'), (5.2, '가', '3층 바닥')],
                     [('2.9 m', 1, 0, 1, 2.9, 0), ('2.3 m', 1, 2.9, 1, 5.2, 0), ('2.1 m', 5.5, 5.2, 5.5, 7.3, 0), ('2.7 m', 5.5, 0, 5.5, 2.7, 0),
                      ('3.5 m', 2.6, 0, 2.6 + 1.9596, 2.9, 44)], 2.4, deco9), 120)
    assert abs(math.hypot(1.9596, 2.9) - 3.5) < .01
    b.help('층 바닥에서 바로 위층 바닥까지 수직으로 잰 길이를 찾아요. 문의 높이와 비스듬한 계단의 길이는 필요하지 않아요.')
    s.ask('1층 바닥에서 3층 바닥까지의 높이:  (       ) + (       ) = (       ) (m)', blank=False)
    s.ask('줄사다리는 (       ) m보다 길어야 해요.', blank=False)
    s.step('④ 되돌아봐요', '해결 과정 설명하기')
    b.why('문제를 어떻게 해결했는지 설명해 보세요.', 2)
    b.why('주의할 점을 써 보세요.', 1)
    s.step('⑤ 척척 풀어요', '옥상에서 1층 바닥까지 대피하는 줄의 길이')
    s.text('옥상과 각 층 바닥을 선분 가, 나, 다, 라로 나타내었어요. 줄은 1층 바닥에 맞닿게 설치해요.')

    def deco9b(X, Y):
        return (L((X(2.6), Y(0)), (X(2.6 + 1.7205), Y(3.5)), '#5A4A3F', 7) + L((X(2.6), Y(3.5)), (X(2.6 + 1.4697), Y(6.0)), '#5A4A3F', 7) +
                L((X(8.8), Y(0)), (X(8.8), Y(8.4)), '#B4610F', 3, '6 4') + T(X(8.8), Y(8.75), '줄', 14, '#B4610F'))
    pic(s, tower_fig([(0, '라', '1층 바닥'), (3.5, '다', '2층 바닥'), (6.0, '나', '3층 바닥'), (8.4, '가', '옥상')],
                     [('3.5 m', 1, 0, 1, 3.5, 0), ('2.5 m', 1, 3.5, 1, 6.0, 0), ('2.4 m', 1, 6.0, 1, 8.4, 0), ('3.9 m', 2.6, 0, 2.6 + 1.7205, 3.5, 44),
                      ('2.9 m', 2.6, 3.5, 2.6 + 1.4697, 6.0, 44)], 0, deco9b), 112)
    h9 = round(3.5 + 2.5 + 2.4, 1)
    assert h9 == 8.4
    s.ask('식:                                    줄은 (       ) m보다 길어야 해요.', blank=False)
    a = ('9차시  ① 줄사다리가 몇 m보다 길어야 하는지, 3층에서 1층 바닥으로  ② 수직, 평행해요, 평행선 사이의 거리  ③ 2.9 m, 2.3 m에 ◯ / 2.9 + 2.3 = 5.2 (m), 5.2 m  '
         '④ (예) 층 바닥이 기둥과 수직이라 서로 평행해요. 평행선 사이의 거리를 더했어요. / 비스듬한 계단의 길이는 높이가 아니에요.  ⑤ 3.5 + 2.5 + 2.4 = 8.4, 8.4 m')
    if C:
        s.step('⑥ 도전하기', '척척 문제의 훈련 탑을 다시 보고 구하기')
        s.ask('3층 바닥(나)에서 1층 바닥(라)까지 내려가는 줄은 몇 m보다 길어야 하나요?  식:                     (       ) m', blank=False)
        s.ask('옥상(가)에서 2층 바닥(다)까지는 몇 m인가요?  식:                     (       ) m', blank=False)
        b.why('비스듬한 계단의 길이 3.9 m를 더하면 안 되는 까닭을 써 보세요.', 1)
        assert round(3.5 + 2.5, 1) == 6 and round(2.5 + 2.4, 1) == 4.9
        a += '  ⑥ 3.5 + 2.5 = 6 (m), 2.5 + 2.4 = 4.9 (m) / 계단은 비스듬해서 바닥 사이의 수직 거리가 아니에요.'
    A.append(a)

    # ---------------------------------------------------------------- 10차시
    s.lesson(10, '탐구 정리하기(O)', '놀이를 더하다 ― 빨리! 더 빨리! 내려놓아요', '도형 카드와 설명 카드를 어떻게 이어야 할까요?')
    s.scene(None, '3~4명이 함께 하는 카드 놀이예요. 도형 카드와 설명 카드를 알맞게 이어 먼저 다 내려놓으면 이겨요.')
    s.step('① 놀이 방법 알기', '놀이 순서 정하기')
    order = game_rules_step(s)
    s.step('② 연습하기', '도형 카드에 내려놓을 수 있는 설명 카드 찾기')
    b.help('정사각형은 네 각이 모두 90°이고 네 변의 길이가 모두 같아요. 한 도형에 맞는 설명이 여러 장일 수 있어요.')
    gt = game_table_step(s, b)
    sqd = [k + 1 for k, (_, fn) in enumerate(GDESC) if fn(info(Q4S['s1']))]
    assert sqd == [2, 3, 4, 5, 6]
    eqs = [GSH[i][0] for i in range(6) if GSH_I[i].allEq]
    assert eqs == ['마름모', '정사각형']
    s.ask('‘네 변의 길이가 모두 같은 사각형’ 설명 카드 위에 내려놓을 수 있는 도형 카드:  (          )', blank=False)
    s.step('③ 놀이하기', '친구들과 카드 놀이 하기')
    s.text('위의 도형 카드 6장과 설명 카드 6장을 오려 놀이 카드로 써요. 내려놓을 카드가 없을 때만 한 장을 가져와요.')
    s.step('④ 또 다른 놀이', '‘예/아니요’ 질문으로 사각형 맞히기')
    tw, pk10 = twenty_step(s, b)
    s.step('⑤ 되돌아보기', '놀이 되돌아보기')
    b.why('놀이에서 이기려면 어떻게 해야 할까요?', 1)
    b.why('놀이하면서 헷갈렸던 성질을 써 보세요.', 1)
    a = ('10차시  ① %s  ② %s / 마름모(다), 정사각형(마)  ④ %s / %s  ⑤ (예) 사각형의 성질을 잘 알고 빨리 이어요. / 정사각형도 마주 보는 두 쌍의 변이 평행해요.'
         % (order, gt, tw, pk10))
    if C:
        s.step('⑥ 도전하기', '내려놓을 수 있는 카드 생각하기')
        trd = [k + 1 for k, (_, fn) in enumerate(GDESC) if fn(GSH_I[0])]
        assert trd == [2]
        two = [GSH[i][0] for i in range(6) if GSH_I[i].npar == 2]
        assert two == ['평행사변형', '마름모', '직사각형', '정사각형']
        s.ask('사다리꼴(가) 카드 위에 내려놓을 수 있는 설명 카드 번호:  (          )', blank=False)
        s.ask('‘마주 보는 두 쌍의 변이 평행한 사각형’ 카드 위에 내려놓을 수 있는 도형 카드:  (                    )', blank=False)
        b.why('정사각형 카드가 ‘마주 보는 두 쌍의 변이 평행한 사각형’에 맞는 까닭을 써 보세요.', 1)
        a += '  ⑥ 2 / 평행사변형, 마름모, 직사각형, 정사각형 / 정사각형은 마주 보는 두 쌍의 변이 모두 평행하기 때문이에요.'
    A.append(a)

    # ---------------------------------------------------------------- 11차시
    s.lesson(11, '발표하기(P)', '공부한 내용을 확인해요', '수직과 평행, 여러 가지 사각형에 대해 무엇을 알게 되었나요?')
    s.step('① 수직과 평행', '알맞은 말을 고르고 평행선을 그어 거리 재기')
    L11 = [dict(n='라', c=(260, 210), a=0, len=220), dict(n='가', c=(140, 135), a=90, len=115), dict(n='나', c=(250, 135), a=90, len=115), dict(n='다', c=(380, 135), a=65, len=115)]
    pic(s, lines_fig(L11), 80)
    s.choices([('직선 가는 직선 라에 대한 (     )입니다.', '( 수선 / 평행선 )'), ('직선 가와 직선 나는 서로 (     ).', '( 수직입니다 / 평행합니다 )')])
    s.text('점 ㄱ을 지나고 주어진 직선과 평행한 직선을 긋고, 두 직선 사이의 거리를 재어 보세요. (실제 크기)')
    real(s, line_fig(8, 16, 6.4, .8, pt=(1.5, 4)))
    s.ask('평행선 사이의 거리:  (       ) cm', blank=False)
    s.step('② 사각형 완성하기', '점 종이에 사각형 완성하기 (한 칸은 1 cm)')
    fxr = [(6, 1), (4, 2), (6, 3)]
    r4 = fourth(fxr)
    assert info(fxr + [r4]).kind == 'rhom' and r4 == (8, 2)
    b.help('사다리꼴은 평행한 변이 한 쌍이라도 있으면 돼요. 마름모는 네 변의 길이가 모두 같아야 해요.')
    real(s, geo_panels([dict(cols=10, rows=6, fixed=[(1, 4), (2, 1)], title='⑴ 선분 ㄱㄴ을 이용한 사다리꼴'),
                        dict(cols=10, rows=6, fixed=fxr, title='⑵ 선분 ㄱㄴ, ㄴㄷ을 이용한 마름모')]))
    s.step('③ 성질로 구하기', '□ 안에 알맞은 수 써넣기')
    P11 = PG(5, 4, 60)
    I11 = info(P11)
    assert round(I11.A[0]) == 60 and round(I11.A[1]) == 120
    pic(s, side_by_side([labeled(P11, lens=['㉠ cm', '㉡ cm', '5 cm', '4 cm'], angs=['㉣°', '㉢°', None, '120°']),
                         labeled([(0, 0), (7, 0), (7, 4), (0, 4)], lens=['7 cm', None, '㉤ cm', '4 cm'], angs=[None, '㉥°', None, None])], 20), 140)
    s.text('왼쪽은 평행사변형, 오른쪽은 직사각형이에요.')
    s.ask('㉠ (    ) cm  ㉡ (    ) cm  ㉢ (    )°  ㉣ (    )°  ㉤ (    ) cm  ㉥ (    )°', blank=False)
    s.step('④ 바꾸어 그리기', '① 꼭짓점 ㄱ을 옮겨 사다리꼴 → ② 꼭짓점 ㄴ을 옮겨 평행사변형 (한 칸은 1 cm)')
    S11 = [(1, 1), (2, 5), (7, 5), (6, 2)]
    assert info(S11).kind == 'none'

    def need11(I, Vv):
        if I.npar != 1:
            return False
        t = (Vv[0][0] + Vv[2][0] - Vv[3][0], Vv[0][1] + Vv[2][1] - Vv[3][1])
        return 0 <= t[0] <= 9 and 0 <= t[1] <= 6 and info([Vv[0], t, Vv[2], Vv[3]]).simple
    mo11 = move_opts(S11, 9, 6, need11, which=[0])
    ex = mo11[0][1]
    t11 = (ex[0] + S11[2][0] - S11[3][0], ex[1] + S11[2][1] - S11[3][1])
    assert info([ex, t11, S11[2], S11[3]]).kind in ('para', 'rect', 'rhom', 'sq')
    real(s, geo_panels([dict(cols=9, rows=6, start=S11, title='① 꼭짓점 ㄱ 옮기기'), dict(cols=9, rows=6, start=S11, title='② 이어서 꼭짓점 ㄴ 옮기기')]))
    b.help('① 꼭짓점 ㄱ을 옮겨 변 ㄹㄱ이 변 ㄴㄷ과 평행하게 해 봐요.')
    s.step('⑤ 꼭꼭 정리하기', '옳으면 →, 옳지 않으면 ↓로 이동하여 도착한 꽃 찾기')
    ST11 = [('두 직선이 만나서 이루는 각이 직각일 때 두 직선은 서로 평행하다고 합니다.', False), ('평행한 변이 있는 사각형을 사다리꼴이라고 합니다.', True),
            ('마름모에서 마주 보는 두 각의 크기는 같습니다.', True), ('직사각형은 네 변의 길이가 모두 같고 네 각의 크기가 모두 같습니다.', False),
            ('평행사변형에서 마주 보는 두 변의 길이는 같습니다.', True), ('정사각형은 마주 보는 두 변이 서로 평행합니다.', True)]
    ends = [None, '카네이션', '해바라기', '과꽃', '무궁화', None, None]
    nf = sum(1 for _, t in ST11 if not t)
    assert ends[nf] == '해바라기'
    s.choices([('%d. %s' % (k + 1, t), '( 옳아요 / 옳지 않아요 )') for k, (t, _) in enumerate(ST11)])
    pic(s, path_fig(ends), 92)
    s.ask('도착한 곳의 꽃:  (          )', blank=False)
    a = ('11차시  ① 수선, 평행합니다 / 점 ㄱ을 지나는 평행선, 4 cm  ② ⑴ 평행한 변이 있게 완성(학생마다 다름) ⑵ 넷째 꼭짓점은 ㄱ에서 오른쪽으로 2칸, 아래로 1칸  '
         '③ ㉠ 5 ㉡ 4 ㉢ 120 ㉣ 60 ㉤ 7 ㉥ 90  ④ (예) ① %s → ② 꼭짓점 ㄴ을 %s (그 밖에 ①은 %s도 됨)  ⑤ %s → 해바라기'
         % (move_txt(S11, 0, ex), move_txt(S11, 1, t11).split('을 ', 1)[1], ', '.join(move_txt(S11, 0, q).split('을 ', 1)[1] for _, q in mo11[1:]) or '없음',
            ', '.join('%d %s' % (k + 1, '옳음' if t else '옳지 않음') for k, (_, t) in enumerate(ST11))))
    if C:
        s.step('⑥ 도전하기', '크기가 다른 직사각형 종이 2장을 겹쳤어요')
        pic(s, overlap_fig(55), 100)
        s.ask('겹쳐진 부분(빨간 부분)의 이름:  (              )', blank=False)
        b.why('그렇게 생각한 까닭을 써 보세요.', 2)
        a += '  ⑥ 평행사변형 (겹쳐진 부분의 마주 보는 두 변은 같은 직사각형 종이의 변이라 서로 평행해요. 마주 보는 두 쌍의 변이 평행해요.)'
    A.append(a)

    s.answers('【교사용】 4. 사각형(교과서 차시) 활동지 정답 (%s)' % level, A, note='※ 이 활동지는 앱 u4-quad.html과 차시 번호가 같습니다.')
    return s


# ================================================================ 이야기 버전
def build_st(level):
    s = Sheet(unit_label='4-2 수학 4. 사각형(이야기 버전)', level=level, grade_label='4학년')
    b = B(s, level)
    C = b.C
    A = []

    # ---------------------------------------------------------------- 1차시
    s.lesson(1, '개념 찾기(S)', '우리 학교 지도를 만들기로 했어요', '우리 학교 곳곳에서 어떤 직각과 직선, 사각형을 찾을 수 있을까요?')
    s.scene(None, '윤 선생님이 “전학 온 친구와 1학년 동생들을 위해 우리 학교 지도를 만들어 볼까요?”라고 하셨어요. 도윤이가 복도 사진을 찍어 왔어요.')
    pic(s, school_fig(), 150)
    s.step('① 만져 보기', '보기·생각하기·궁금해하기')
    s.labeled([('보여요', '복도 사진에서 ____________________이 보여요.'), ('생각해요', '____________은 ____________해서 그런 모양인 것 같아요.'),
               ('궁금해요', '____________________은 왜 그럴까?')], label_mm=28)
    s.step('② 그려 보기', '복도에서 사각형 찾기')
    b.help('곧은 선 4개로 둘러싸인 모양이 사각형이에요. 네 각이 직각이 아니어도 사각형이에요.')
    s.text('사각형을 찾을 수 있는 것에 ◯표 하세요.')
    s.table([[x.split(' ', 1)[1].replace(' 삼각형 표지', ' 표지') for x in SCHOOL], [''] * 7])
    s.step('③ 말해 보기', '복도 바닥 줄무늬에서 직각 떠올리기')
    pic(s, angle_cards([(10, 90), (0, 70), (-35, 90), (15, 115)]), 125)
    s.ask('직각을 모두 골라 기호를 써 보세요.')
    s.text('직각인지 확인하는 방법으로 알맞은 것에 모두 ◯표 하세요.')
    s.choices([('삼각자의 직각 부분을 대어 봐요.', '(     )'), ('각도기로 재어 90°인지 봐요.', '(     )'), ('두 변의 길이가 같은지 비교해 봐요.', '(     )')])
    b.help('다의 두 변이 벌어진 정도를 떠올려요. ‘왜냐하면 각의 크기가 ~이기 때문이에요.’ 꼴로 써요.')
    b.why('다는 비스듬히 기울어져 있는데도 직각이라고 할 수 있는 까닭은 무엇일까요?', 1)
    s.step('④ 약속하기', '3학년·4학년 1학기에 배운 것')
    s.fill(['네 각이 모두 직각인 사각형을 ( 직사각형 / 정사각형 / 삼각형 )이라고 해요.',
            '네 각이 모두 직각이고 네 변의 길이가 모두 같은 사각형을 ( 정사각형 / 직사각형 / 직각삼각형 )이라고 해요.',
            '사각형의 네 각의 크기의 합은 ( 360° / 180° / 90° )예요.'])
    s.step('⑤ 확인하기', '화단의 남은 각')
    pic(s, labeled(from_angles([70, 105, 110, 75], 5, 3.5), angs=['70°', '105°', '110°', '□°']), 80)
    v1 = 360 - 70 - 105 - 110
    assert v1 == 75
    s.ask('식:  360 − (      ) − (      ) − (      ) = (      )        □ = (      )°', blank=False)
    s.ask('학교 지도를 만들며 선이나 사각형에 대해 알고 싶은 것:', blank=False)
    s.lines(1)
    a = ('1차시  ① 학생마다 다름  ② 교실 창문, 게시판, 사물함, 화단  ③ 가, 다 / 삼각자, 각도기에 ◯ / 왜냐하면 기울어져 있어도 두 변이 벌어진 정도가 90°이기 때문이에요.  '
         '④ 직사각형, 정사각형, 360°  ⑤ 360 − 70 − 105 − 110 = 75, □ = 75° / (예) 화단처럼 생긴 사각형의 이름')
    if C:
        s.step('⑥ 도전하기', '운동장(직사각형)과 모래 놀이터(정사각형)를 점 종이에 그리기 (한 칸은 1 cm)')
        real(s, geo_panels([dict(cols=10, rows=6, title='운동장(직사각형)'), dict(cols=10, rows=6, title='모래 놀이터(정사각형)')]))
        b.why('화단은 직사각형이 아니지만 사각형이라고 할 수 있는 까닭을 써 보세요.', 1)
        a += '  ⑥ 네 각이 모두 직각인 사각형 / 네 변의 길이까지 같은 사각형 / 곧은 선 4개로 둘러싸여 있기 때문이에요.'
    A.append(a)

    # ---------------------------------------------------------------- 2차시
    s.lesson(2, '개념 구축하기(O)', '복도가 만나는 곳 ― 수직과 수선', '두 복도가 어떻게 만날 때 서로 수직이라고 할까요? 수선은 어떻게 그을까요?')
    s.scene(None, '도윤이 모둠이 복도와 복도가 만나는 곳 세 군데를 그려 왔어요.')
    s.step('① 만져 보기', '두 직선이 직각으로 만나는 곳에 직각 표시(└) 하기')
    pic(s, right_panels([(10, 90), (0, 110), (-30, 90)]), 140)
    b.help('삼각자의 직각을 한 직선에 맞추어 대 보세요. 직선이 기울어져 있어도 직각일 수 있어요.')
    s.ask('직각으로 만나는 그림의 기호를 모두 써 보세요.')
    s.step('② 약속하기', '수직과 수선')
    if not C:
        s.wordbox(['수직', '수선', '평행'])
    s.fill(['두 직선이 만나서 이루는 각이 직각일 때, 두 직선은 서로 (          )이라고 해요.',
            '두 직선이 서로 수직으로 만나면 한 직선을 다른 직선에 대한 (          )이라고 해요.',
            '선분과 선분이 만나서 이루는 각이 직각일 때에도 서로 (          )이라고 해요.'])
    b.help('수직의 약속에서 무엇을 보는지 떠올려요. ‘네, 왜냐하면 수직은 ~만 보기 때문이에요.’ 꼴로 써요.')
    b.why('짧은 복도가 긴 복도와 직각으로 만나요. 두 복도의 길이가 달라도 서로 수직이라고 할 수 있을까요? 까닭도 써 보세요.', 1)
    s.step('③ 그려 보기', '삼각자로 수선 긋기 (실제 크기)')
    b.help('삼각자의 직각을 낀 한 변을 주어진 직선에 맞추고, 직각을 낀 다른 한 변을 따라 그어요.')
    s.text('⑴ 주어진 직선(본관 복도)에 대한 수선을 그어 보세요.')
    real(s, line_fig(0, 16, 4.6, .55, lineName='본관 복도'))
    s.text('⑵ 점 ㄱ(보건실 문)을 지나고 주어진 직선에 수직인 직선을 그어 보세요.')
    real(s, line_fig(-12, 16, 6.2, .68, pt=(1.5, 2.5)))
    s.step('④ 말해 보기', '학교 지도에서 수직인 길')
    pic(s, road_fig(ROUTE_ST), 140)
    pr = line_pairs(ROUTE_ST, 'perp')
    assert pr == [('햇살길', '구름길'), ('햇살길', '바람길')], pr
    s.ask('서로 수직으로 만나는 두 길:  (          )과 (          ),  (          )과 (          )', blank=False)
    b.why('구름길과 햇살길이 서로 수직인지 어떻게 확인했는지 써 보세요.', 1)
    s.step('⑤ 확인하기', '수직과 수선 문제')
    pic(s, lines_fig([dict(n='가', c=(260, 140), a=30, len=190), dict(n='나', c=(260, 140), a=120, len=110)]), 72)
    s.choices([('직선 가와 직선 나는 서로 (     )입니다.', '( 수직 / 수선 )'), ('직선 나는 직선 가에 대한 (     )입니다.', '( 수직 / 수선 )')])
    PERP = [[(0, 3), (2, 0), (4, 3)], [(0, 0), (4, 0), (4, 3), (1, 3)], Q4S['p1'], [(0, 2), (2, 0), (4, 2), (2, 4)]]
    pk = ans(PERP, has_perp, [1, 3])
    pic(s, cards(PERP, 4, 30, rights=False), 150)
    s.ask('태민이가 만든 지도 기호예요. 서로 수직인 변이 있는 것을 모두 골라 기호를 써 보세요.')
    L6 = LN([('가', (380, 60), 0, 320), ('나', (150, 260), 90, 130), ('다', (300, 290), 30, 110), ('라', (460, 280), 120, 110),
             ('마', (620, 230), 160, 100), ('바', (650, 340), 70, 70)])
    p6 = line_pairs(L6, 'perp')
    assert len(p6) == 3
    pic(s, lines_named(L6), 120)
    s.ask('서로 수직으로 만나는 두 직선을 모두 짝 지어 쓰고, 모두 몇 쌍인지 써 보세요.', blank=False)
    s.ask('짝: (                                        )      모두 (     )쌍', blank=False)
    a = ('2차시  ① 가, 다  ② 수직, 수선, 수직 / 네, 왜냐하면 수직은 만나서 이루는 각이 직각인지만 보고 길이와는 상관없기 때문이에요.  '
         '③ 삼각자의 직각을 따라 그은 수선(⑵는 점 ㄱ을 지남)  ④ %s / (예) 두 길이 만나는 곳에 삼각자의 직각을 대어 보니 꼭 맞았어요.  ⑤ 수직, 수선 / %s / %s, 3쌍'
         % (pairs_txt([(q, p) for p, q in pr]), kos(pk), pairs_txt(p6)))
    if C:
        s.step('⑥ 도전하기', '점 ㄱ(급식실 문)을 지나는 수선')
        s.choices([('점 ㄱ을 지나고 주어진 직선에 수직인 직선은 몇 개 그을 수 있나요?', '( 1개 / 2개 /\n셀 수 없이 많아요 )'),
                   ('점 ㄱ을 지나지 않아도 된다면, 주어진 직선에 대한 수선은?', '( 1개 / 2개 /\n셀 수 없이 많아요 )')])
        b.why('두 답이 다른 까닭을 써 보세요.', 1)
        a += '  ⑥ 1개, 셀 수 없이 많아요 (삼각자를 밀면 수선을 계속 그을 수 있지만, 점 ㄱ을 지나는 곳은 한 군데뿐이에요.)'
    A.append(a)

    # ---------------------------------------------------------------- 3차시
    s.lesson(3, '개념 구축하기(O)', '만나지 않는 복도 ― 평행과 평행선', '아무리 늘여도 만나지 않는 두 복도는 어떤 관계일까요? 평행선은 어떻게 그을까요?')
    s.scene(None, '하린이 모둠이 2층 복도를 직선으로 그렸어요.')
    s.step('① 만져 보기', '먼저 예상하고, 만나지 않는 두 직선 찾기')
    b.why('내 예상: 한 직선에 수직인 두 직선은 서로 어떤 관계일까요?', 1)
    L3 = LN([('가', (380, 40), 0, 330), ('나', (150, 230), 90, 110), ('다', (260, 240), 90, 120), ('바', (600, 345), 150, 120),
             ('라', (470, 190), 60, 80), ('마', (640, 210), 60, 85)])
    p3 = line_pairs(L3, 'para')
    assert p3 == [('나', '다'), ('라', '마')], p3
    pic(s, lines_named(L3), 120)
    b.help('자를 대고 직선을 길게 늘여 보세요.')
    s.ask('서로 만나지 않는 두 직선:  직선 (     )와 직선 (     ),  직선 (     )와 직선 (     )', blank=False)
    s.choices([('직선 나와 직선 다는 직선 가와 어떻게 만나나요?', '( 수직으로 만나요 / 60°로 만나요 )'),
               ('직선 라와 직선 마는 어떤 직선과 수직으로 만나나요?', '( 직선 가 / 직선 바 / 직선 나 )')])
    s.step('② 약속하기', '평행과 평행선')
    if not C:
        s.wordbox(['평행', '평행선', '수직', '수선'])
    s.fill(['서로 만나지 않는 두 직선을 (          )하다고 해요.', '이때 평행한 두 직선을 (          )이라고 해요.'])
    s.step('③ 그려 보기', '종이 접어 평행선 (소율이의 방법)')
    pic(s, foldpar_fig(), 105)
    b.help('파란 선과 빨간 선이 어떻게 만나는지 떠올려요.')
    b.why('두 파란 선이 평행선이라고 말할 수 있는 까닭은 무엇일까요?', 1)
    s.step('④ 그려 보기', '삼각자 두 개로 평행선 긋기 (실제 크기)')
    b.help('한 삼각자를 고정하고, 다른 삼각자를 고정한 삼각자를 따라 밀어서 그어요.')
    s.text('⑴ 주어진 직선과 평행한 직선을 그어 보세요.   ⑵ 점 ㄱ(음악실 문)을 지나고 주어진 직선과 평행한 직선을 그어 보세요.')
    real(s, side_by_side([line_fig(10, 8.6, 5, .78, title='⑴'), line_fig(-8, 8.6, 5, .78, pt=(0.5, 2.75), title='⑵')], 12))
    s.choices([('주어진 직선과 평행한 직선은 몇 개 그을 수 있나요?', '( 1개 / 2개 / 셀 수 없이 많아요 )'),
               ('점 ㄱ을 지나고 주어진 직선과 평행한 직선은?', '( 1개 / 2개 / 셀 수 없이 많아요 )')])
    s.step('⑤ 확인하기', '평행 찾기')
    pic(s, two_lines([((30, 60), (290, 60)), ((30, 170), (290, 135))], [((345, 190), (480, 40)), ((440, 200), (575, 50))]), 100)
    s.ask('서로 만나지 않는 두 직선의 기호를 써 보세요.')
    q1, q2 = [(0, 0), (2, 3), (5, 3), (6, 0)], [(0, 1), (2, 0), (5, 0), (6, 2), (4, 4), (1, 3)]
    for q, want in ((q1, (1, 3)), (q2, (2, 5))):
        Iq = info(q)
        assert abs(cr(Iq.S[want[0]], Iq.S[want[1]])) < 1e-9
    f1, f2 = fit(q1, (0, 0, 380, 280, 50), 50), fit(q2, (0, 0, 420, 300, 50), 45)
    pic(s, side_by_side([Fig(380, 280, dotsm(f1, 6, 6, 374, 274) + polyG(f1.P, fs=20, names=True, rights=False)),
                         Fig(420, 300, dotsm(f2, 6, 6, 414, 294) + polyG(f2.P, fs=20, names=True, rights=False))], 30), 150)
    s.ask('급식실 지붕 기호 ㄱㄴㄷㄹ에서 서로 평행한 두 변:  변 (        )과 변 (        )', blank=False)
    s.ask('도서관 기호 ㄱㄴㄷㄹㅁㅂ에서 서로 평행한 두 변:  변 (        )과 변 (        )', blank=False)
    s.choices([('준서: “비스듬히 기울어진 두 직선은 평행이 아니야.”\n바르게 고친 것은?', '( 기울어진 두 직선도 만나지 않으면 평행이야 /\n평행한 두 직선은 꼭 가로로 놓여야 해 )')])
    a = ('3차시  ① (예) 아무리 늘여도 서로 만나지 않아요 / 나와 다, 라와 마 / 수직으로 만나요, 직선 바  ② 평행, 평행선  '
         '③ 왜냐하면 두 파란 선이 모두 빨간 선과 수직이기 때문이에요.  ④ 삼각자 2개로 그은 평행선(⑵는 점 ㄱ을 지남) / 셀 수 없이 많아요, 1개  '
         '⑤ ㉡ / 변 ㄴㄷ과 변 ㄹㄱ / 변 ㄷㄹ과 변 ㅂㄱ / 기울어진 두 직선도 만나지 않으면 평행이야')
    if C:
        s.step('⑥ 도전하기', '운동장 쪽 길 ― 서로 평행한 두 직선 모두 찾기')
        L3c = LN([('가', (170, 220), 125, 120), ('나', (320, 240), 125, 130), ('다', (450, 110), 15, 110), ('라', (540, 300), 40, 100), ('마', (630, 230), 125, 110)])
        pc = line_pairs(L3c, 'para')
        assert len(pc) == 3
        pic(s, lines_named(L3c), 115)
        s.ask('서로 평행한 두 직선을 모두 짝 지어 쓰고, 모두 몇 쌍인지 써 보세요.  (                              ),  (     )쌍', blank=False)
        b.why('평행한 직선이 세 개이면 짝이 몇 쌍 생기는지, 그 까닭을 써 보세요.', 1)
        a += '  ⑥ %s, 3쌍 (가, 나, 마를 두 개씩 짝 지으면 3쌍이에요.)' % pairs_txt(pc)
    A.append(a)

    # ---------------------------------------------------------------- 4차시
    s.lesson(4, '개념 구축하기(O)', '복도 폭 재기 ― 평행선 사이의 거리', '평행한 두 복도 사이의 폭(평행선 사이의 거리)은 어떻게 잴까요?')
    s.scene(None, '도서관 복도와 음악실 복도는 서로 평행해요. 두 복도를 잇는 건널목 중 가장 짧은 것을 지도에 표시하려고 해요.')
    s.step('① 만져 보기', '가장 짧은 건널목 찾기 (실제 크기)')
    sg = [(-6.5, -4), (-4, -2.5), (-1, -1), (1, 2.5), (2.5, 4.5)]
    lens = [math.hypot(q - p, 3) for p, q in sg]
    assert lens.index(min(lens)) == 2
    real(s, seg_fig(3, sg, lineNames=['도서관 복도', '음악실 복도'], lnS=6.8, H=230))
    b.help('자의 눈금 0을 선분의 한끝에 맞추고 재어요.')
    s.ask('길이가 가장 짧은 선분의 기호와 길이:  선분 (     ),  (       ) cm', blank=False)
    s.choices([('가장 짧은 선분은 평행선과 어떻게 만나나요?', '( 수직으로 만나요 / 비스듬히 만나요 )')])
    b.why('가장 짧은 건널목을 찾으려면 어떻게 하면 될까요?', 1)
    s.step('② 약속하기', '평행선 사이의 거리')
    if not C:
        s.wordbox(['수직인', '평행선 사이의 거리', '비스듬한'])
    s.fill(['평행선의 한 직선에서 다른 직선에 (          ) 선분을 그어요.', '이때 수직인 선분의 길이를 (                    )라고 해요.'])
    s.step('③ 재어 보기', '지도 속 복도 폭 재기 (실제 크기)')
    real(s, dist_fig([dict(d=4, ang=0, sA=1, title='⑴'), dict(d=2.5, ang=-20, sA=0, title='⑵')], H_cm=6.6))
    b.help('점 ㄱ에서 평행선에 수직인 선분을 긋고 길이를 재요.')
    s.ask('복도 폭:  ⑴ (       ) cm     ⑵ (     ) cm (     ) mm', blank=False)
    s.step('④ 그려 보기', '폭이 2 cm인 복도 그리기 (실제 크기)')
    real(s, line_fig(-10, 16, 4.8, .78))
    b.help('주어진 직선에 수선을 긋고, 수선 위에서 2 cm인 곳에 점을 찍은 다음, 그 점을 지나는 평행선을 그어요.')
    b.why('어떻게 그었는지 설명해 보세요.', 1)
    s.step('⑤ 확인하기', '거리를 바르게 재었나요?')
    pic(s, seg_fig(2.5, [(-5, -3), (-2, -2), (0.5, 2.5), (3, 5.5)], names=['㉠', '㉡', '㉢', '㉣'], lineNames=['가', '나'], H=260), 110)
    s.ask('평행선 가와 나 사이의 거리를 나타내는 선분의 기호를 써 보세요.')
    sg3 = [(-7, -4), (0.5, 0.5), (2.5, 2.5 + math.sqrt(33))]
    assert [round(math.hypot(q - p, 4), 6) for p, q in sg3] == [5, 4, 7]
    real(s, seg_fig(4, sg3, names=[' '] * 3, lens=['5 cm', '4 cm', '7 cm'], show=(0, 1, 2), lineNames=['가', '나'], rightMk=True, H=250))
    s.ask('직선 가와 직선 나는 평행해요. 평행선 사이의 거리는 몇 cm인가요?')
    pic(s, seg_fig(3, [(-3.5, -1.5), (2, 2)], names=['㉠', '㉡'], rightMk=True, H=230, W=520), 85)
    s.choices([('준서는 ㉠처럼, 지아는 ㉡처럼 재었어요. 옳게 잰 사람은?', '( 준서 / 지아 )')])
    a = ('4차시  ① 선분 다, 3 cm / 수직으로 만나요 / 두 복도와 수직으로 만나는 선분을 찾으면 돼요.  ② 수직인, 평행선 사이의 거리  ③ ⑴ 4 cm ⑵ 2 cm 5 mm(2.5 cm)  '
         '④ (예) 주어진 직선에서 수선의 길이가 2 cm인 곳에 점을 찍고, 삼각자 2개로 그 점을 지나는 평행선을 그었어요.  ⑤ ㉡ / 4 cm / 지아')
    if C:
        s.step('⑥ 도전하기', '비스듬한 화단 울타리 두 줄 사이의 거리 재기 (실제 크기)')
        real(s, dist_fig([dict(d=3.5, ang=25, sA=-1)], W_cm=12, H_cm=7.6))
        s.ask('두 울타리 사이의 거리:  (     ) cm (     ) mm  =  (       ) cm', blank=False)
        b.why('울타리를 따라 비스듬히 재면 안 되는 까닭을 써 보세요.', 1)
        a += '  ⑥ 3 cm 5 mm = 3.5 cm (비스듬한 선분은 수직인 선분보다 길어요.)'
    A.append(a)

    # ---------------------------------------------------------------- 5차시
    s.lesson(5, '개념 구축하기(O)', '화단과 창문 ― 사다리꼴', '평행한 변이 있는 사각형을 무엇이라고 할까요?')
    s.scene(None, '소율이 모둠이 학교 화단과 창문, 게시물의 모양을 점 종이에 옮겨 그렸어요.')
    s.step('① 만져 보기', '화단과 창문 나누기')
    C5A = QL('p2 t1 n3 t6 c3 n5')
    yes = ans(C5A, lambda p: info(p).npar >= 1, [0, 1, 3, 4])
    pic(s, cards(C5A, 6, 26, cw=180, ch=160), 175)
    b.help('점 종이의 칸을 세어 마주 보는 두 변이 같은 방향인지 봐요.')
    s.table([['평행한 변이 있는 사각형', '평행한 변이 없는 사각형'], ['', '']], row_h=3600)
    b.why('다와 바를 다른 사각형과 따로 나눈 까닭은 무엇일까요?', 1)
    s.step('② 약속하기', '사다리꼴')
    s.fill('평행한 변이 있는 사각형을 ( 사다리꼴 / 평행사변형 / 마름모 )이라고 해요.')
    s.choices([('태민: “직사각형 창문은 평행한 변이 두 쌍이라서 사다리꼴이 아니야.” 맞을까요?', '( 아니요, 사다리꼴이에요 /\n네, 맞아요 )')])
    s.step('③ 말해 보기', '사다리꼴 찾기')
    C5B = QL('n1 t2 r1 n4 t3')
    tr = ans(C5B, lambda p: info(p).npar >= 1, [1, 2, 4])
    pic(s, cards(C5B, 5, 26, cw=180, ch=160), 165)
    s.ask('사다리꼴을 모두 골라 기호를 써 보세요.')
    s.choices([('가와 라는 왜 사다리꼴이 아닌가요?', '( 평행한 변이 없어서 / 직각이 없어서 )')])
    s.step('④ 그려 보기', '지도 기호 사다리꼴 2개 그리기 (한 칸은 1 cm)')
    b.help('주어진 선분 ㄱㄴ과 평행한 변을 하나 그리면 사다리꼴이 돼요.')
    real(s, geo_panels([dict(cols=10, rows=6, fixed=[(2, 4), (7, 4)], title='⑴ 선분 ㄱㄴ을 이용하여'), dict(cols=10, rows=6, title='⑵ 앞과 다른 모양으로')]))
    s.step('⑤ 확인하기', '사다리꼴과 평행한 변')
    C5E = QL('t7 n2 s2 p6 n6 t4')
    te = ans(C5E, lambda p: info(p).npar >= 1, [0, 2, 3, 5])
    pic(s, cards(C5E, 6, 26, cw=180, ch=160), 175)
    s.ask('사다리꼴을 모두 골라 기호를 써 보세요.')
    q5 = [(0, 1), (4, 0), (4, 4), (0, 3)]
    assert abs(cr(info(q5).S[1], info(q5).S[3])) < 1e-9
    f5 = fit(q5, (0, 0, 300, 260, 45), 45)
    pic(s, Fig(300, 260, dotsm(f5, 6, 6, 294, 254) + polyG(f5.P, fs=20, names=True, rights=False)), 58)
    s.ask('사다리꼴 ㄱㄴㄷㄹ(계단 옆면)에서 서로 평행한 두 변:  변 (        )과 변 (        )', blank=False)
    a = ('5차시  ① 있는: %s / 없는: %s / 왜냐하면 다와 바는 마주 보는 변을 늘이면 모두 만나서 평행한 변이 없기 때문이에요.  ② 사다리꼴, 아니요, 사다리꼴이에요  '
         '③ %s, 평행한 변이 없어서  ④ 평행한 변이 한 쌍 이상인 사각형(학생마다 다름)  ⑤ %s / 변 ㄴㄷ과 변 ㄹㄱ'
         % (kos(yes), kos([i for i in range(6) if i not in yes]), kos(tr), kos(te)))
    if C:
        s.step('⑥ 도전하기', '새 화단: 평행한 두 변이 2 cm, 5 cm, 두 변 사이의 거리가 2 cm인 사다리꼴 (한 칸은 1 cm)')
        real(s, geo_panels([dict(cols=10, rows=6)]))
        b.why('그린 사다리꼴이 조건에 맞는지 어떻게 확인했는지 써 보세요.', 1)
        a += '  ⑥ (예) 5칸짜리 변을 그리고 2칸 떨어진 곳에 그 변과 평행한 2칸짜리 변을 그려요(모양은 학생마다 다름).'
    A.append(a)

    # ---------------------------------------------------------------- 6차시
    s.lesson(6, '개념 구축하기(O)', '주차 칸 ― 평행사변형', '마주 보는 두 쌍의 변이 서로 평행한 사각형은 어떤 성질이 있을까요?')
    s.scene(None, '학교 주차장의 비스듬한 주차 칸과 바닥 표시를 그렸어요.')
    s.step('① 만져 보기', '주차 칸 나누기')
    C6A = QL('t2 p3 r1 c1 t6 p6')
    one = ans(C6A, lambda p: info(p).npar == 1, [0, 4])
    pic(s, cards(C6A, 6, 26, cw=180, ch=160), 175)
    b.help('마주 보는 변 두 쌍을 하나씩 살펴봐요. 직사각형과 마름모도 두 쌍이 평행해요.')
    s.table([['평행한 변이 한 쌍인 사각형', '평행한 변이 두 쌍인 사각형'], ['', '']], row_h=3600)
    s.step('② 약속하기', '평행사변형')
    s.fill('마주 보는 두 쌍의 변이 서로 평행한 사각형을 ( 평행사변형 / 사다리꼴 / 마름모 )이라고 해요.')
    s.step('③ 만져 보기', '주차 칸 종이 잘라 보기')
    b.why('내 예상: 평행사변형의 마주 보는 변과 각에는 어떤 규칙이 있을까요?', 1)
    pic(s, pgcut_fig(PG(6, 3, 55)), 82)
    s.text('① 빨간 선(꼭짓점 ㄱ과 ㄷ을 이은 선)을 따라 잘라 한 조각을 180° 돌려 겹쳐 봐요.  ② 각을 잘라 이웃하는 두 각을 나란히 이어 붙여 봐요.')
    s.choices([('①에서 마주 보는 두 변의 길이는?', '( 같아요 / 달라요 )'), ('①에서 마주 보는 두 각의 크기는?', '( 같아요 / 달라요 )')])
    s.ask('②에서 이웃하는 두 각의 크기의 합:  (       )°', blank=False)
    s.step('④ 그려 보기', '지도 기호 평행사변형 2개 그리기 (한 칸은 1 cm)')
    fx6 = [(3, 1), (1, 5), (6, 5)]
    assert info(fx6 + [fourth(fx6)]).kind == 'para' and fourth(fx6) == (8, 1)
    b.help('주어진 두 선분과 평행하게 나머지 두 변을 그어요.')
    real(s, geo_panels([dict(cols=10, rows=6, fixed=fx6, title='⑴ 선분 ㄱㄴ, ㄴㄷ을 이용하여'), dict(cols=10, rows=6, title='⑵ 앞과 다른 모양으로')]))
    s.step('⑤ 확인하기', '성질로 구하기')
    P6 = PG(5, 3, 65)
    assert round(info(P6).A[1]) == 115
    pic(s, labeled(P6, lens=['5 cm', '㉡ cm', '㉠ cm', '3 cm'], angs=['65°', '㉣°', '㉢°', None]), 80)
    s.ask('㉠ (     ) cm   ㉡ (     ) cm   ㉢ (     )°   ㉣ (     )°', blank=False)
    s.choices([('하린: “마주 보는 두 쌍의 변이 서로 평행하니까 평행사변형이야.”\n도윤: “직각이 없으니까 평행사변형이야.”\n약속에 맞게 말한 사람은?', '( 하린 / 도윤 )')])
    if C:
        pic(s, labeled(PG(8, 6, 60), lens=['8 cm', '□ cm', '□ cm', '6 cm']), 80)
        s.ask('평행사변형의 두 □ 안에 알맞은 수의 합을 구해 보세요.')
    a = ('6차시  ① 한 쌍: %s / 두 쌍: %s  ② 평행사변형  ③ (예) 마주 보는 두 변의 길이와 두 각의 크기가 같을 것 같아요. / 같아요, 같아요 / 180°  '
         '④ ⑴ 넷째 꼭짓점은 ㄱ에서 오른쪽으로 5칸(ㄷ에서 오른쪽으로 2칸, 위로 4칸) ⑵ 학생마다 다름  ⑤ ㉠ 5 ㉡ 3 ㉢ 65 ㉣ 115 (180 − 65) / 하린'
         % (kos(one), kos([i for i in range(6) if i not in one])))
    if C:
        a += ' / 6 + 8 = 14'
        s.step('⑥ 도전하기', '꼭짓점 한 개만 옮겨 평행사변형 주차 칸 만들기 (한 칸은 1 cm)')
        st6 = [(1, 4), (5, 4), (7, 1), (2, 1)]
        mo = move_opts(st6, 9, 6, lambda I, Vv: I.npar == 2)
        real(s, geo_panels([dict(cols=9, rows=6, start=st6)]))
        s.ask('어느 꼭짓점을 어디로 옮겼는지 쓰고, 옮긴 모양을 그려 보세요.', blank=False)
        s.lines(1)
        b.why('옮긴 모양이 평행사변형인 까닭을 써 보세요.', 1)
        a += '  ⑥ (예) %s (가능한 것: %s) / 마주 보는 두 쌍의 변이 서로 평행해서' % (move_txt(st6, *mo[0]), '; '.join(move_txt(st6, *m) for m in mo))
    A.append(a)

    # ---------------------------------------------------------------- 7차시
    s.lesson(7, '개념 구축하기(O)', '강당 바닥 타일 ― 마름모', '네 변의 길이가 모두 같은 사각형은 어떤 성질이 있을까요?')
    s.scene(None, '강당 바닥에는 여러 가지 모양의 타일 무늬가 있어요.')
    s.step('① 만져 보기', '강당 타일 나누기')
    C7A = QL('r3 p1 s2 c3 r2 n6')
    eq = ans(C7A, lambda p: info(p).allEq, [0, 2, 4])
    pic(s, cards(C7A, 6, 26, cw=180, ch=160), 175)
    b.help('비스듬한 변은 가로·세로로 몇 칸 가는지 세어 봐요. 가로 4칸·세로 2칸과 가로 2칸·세로 4칸은 길이가 같아요.')
    s.table([['네 변의 길이가 모두 같은 사각형', '네 변의 길이가 모두 같지는 않은 사각형'], ['', '']], row_h=3600)
    s.step('② 약속하기', '마름모')
    s.fill('네 변의 길이가 모두 같은 사각형을 ( 마름모 / 평행사변형 / 사다리꼴 )라고 해요.')
    b.why('다 타일은 비스듬히 기울어진 정사각형 모양이에요. 다도 마름모라고 할 수 있을까요? 까닭도 써 보세요.', 1)
    s.step('③ 만져 보기', '마름모 타일 접어 보기 (실제 크기)')
    b.why('내 예상: 마름모를 접었다 펼치면 마주 보는 꼭짓점끼리 이은 두 선분은 어떻게 만날까요?', 1)
    real(s, rhfold_fig(2.5, 1.5, 22))
    s.text('① ㄱㄷ을 따라 반으로 접고, ② ㄴㄹ을 따라 한 번 더 접은 다음 펼쳤어요. 두 접힌 선이 만나는 점이 ㅁ이에요.')
    s.ask('선분 ㅁㄱ (      ),  선분 ㅁㄷ (      ),  선분 ㅁㄴ (      ),  선분 ㅁㄹ (      )', blank=False)
    s.choices([('마주 보는 두 각(각 ㄴ과 각 ㄹ)의 크기는?', '( 같아요 / 달라요 )'), ('선분 ㄱㄷ과 선분 ㄴㄹ이 만나서 이루는 각은?', '( 90° / 60° / 180° )')])
    s.step('④ 그려 보기', '지도 기호 마름모 2개 그리기 (한 칸은 1 cm)')
    b.help('네 변의 길이가 모두 같게 그려요. 선분 ㄱㄴ은 오른쪽으로 2칸, 위로 1칸 가요.')
    real(s, geo_panels([dict(cols=10, rows=6, fixed=[(1, 3), (3, 2)], title='⑴ 선분 ㄱㄴ을 이용하여'), dict(cols=10, rows=6, title='⑵ 앞과 다른 모양으로')]))
    s.step('⑤ 확인하기', '마름모 타일 문제')
    R7 = RH(6, 65)
    assert round(info(R7).A[1]) == 115
    pic(s, side_by_side([labeled(R7, lens=['6 cm', '㉡ cm'], angs=[None, '115°', None, '㉠°'], W=360), rh_diag(5, 3, ['5 cm', '㉢ cm', '㉣°'])], 20), 125)
    s.ask('㉠ (     )°   ㉡ (     ) cm   ㉢ (     ) cm   ㉣ (     )°', blank=False)
    C7E = QL('p4 r1 c2 r3 t1 s1')
    re7 = ans(C7E, lambda p: info(p).allEq, [1, 3, 5])
    pic(s, cards(C7E, 6, 26, cw=180, ch=160), 175)
    s.ask('마름모를 모두 골라 기호를 써 보세요.')
    s.choices([('마름모에 대한 설명으로 잘못된 것은?\n㉠ 네 변의 길이가 모두 같습니다.\n㉡ 마주 보는 두 각의 크기가 다릅니다.\n㉢ 마주 보는 꼭짓점끼리 이은 두 선분은 서로 수직으로 만납니다.', '( ㉠ / ㉡ / ㉢ )')])
    a = ('7차시  ① 같은: %s / 같지 않은: %s  ② 마름모 / 네, 왜냐하면 다는 네 변의 길이가 모두 같기 때문이에요.  ③ (예) 서로 수직으로 만날 것 같아요. / '
         '2 cm 5 mm, 2 cm 5 mm, 1 cm 5 mm, 1 cm 5 mm / 같아요, 90°  ④ 네 변의 길이가 모두 같은 사각형(학생마다 다름)  ⑤ ㉠ 115 ㉡ 6 ㉢ 5 ㉣ 90 / %s / ㉡'
         % (kos(eq), kos([i for i in range(6) if i not in eq]), kos(re7)))
    if C:
        s.step('⑥ 도전하기', '꼭짓점 한 개만 옮겨 마름모 타일 만들기 (한 칸은 1 cm)')
        st7 = [(1, 3), (3, 1), (6, 3), (3, 5)]
        mo = move_opts(st7, 9, 6, lambda I, Vv: I.allEq)
        real(s, geo_panels([dict(cols=9, rows=6, start=st7)]))
        s.ask('어느 꼭짓점을 어디로 옮겼는지 쓰고, 옮긴 모양을 그려 보세요.', blank=False)
        s.lines(1)
        b.why('옮긴 모양이 마름모인 까닭을 써 보세요.', 1)
        a += '  ⑥ %s (네 변의 길이가 모두 같아져요.)' % '; '.join(move_txt(st7, *m) for m in mo)
    A.append(a)

    # ---------------------------------------------------------------- 8차시
    s.lesson(8, '탐구 정리하기(O)', '지도 기호 정리 ― 여러 가지 사각형', '여러 가지 사각형은 각각 어떤 성질을 가지고 있을까요?')
    s.scene(None, '지도에서 교실은 직사각형, 계단참은 정사각형 기호로 그렸어요.')
    s.step('① 만져 보기', '교실과 계단참 재어 보기 (실제 크기)')
    real(s, side_by_side([meas_fig([(0, 0), (6, 0), (6, 3), (0, 3)]), meas_fig([(0, 0), (4, 0), (4, 4), (0, 4)])], 24))
    s.choices([('직사각형과 정사각형의 네 각의 크기는?', '( 모두 90°예요 / 두 각만 90°예요 )'),
               ('직사각형과 정사각형에서 평행한 변은 각각 몇 쌍?', '( 각각 1쌍 / 각각 2쌍 )'),
               ('마주 보는 두 변의 길이는?', '( 같아요 / 달라요 )')])
    s.step('② 약속하기', '직사각형과 정사각형의 성질')
    s.fill(['직사각형은 네 각이 모두 ( 90° / 60° )이고, 마주 보는 두 쌍의 변이 서로 ( 평행해요 / 수직이에요 ).',
            '정사각형은 직사각형의 성질에 더해 네 변의 길이가 모두 ( 같아요 / 달라요 ).'])
    s.step('③ 그려 보기', '지도 기호 성질 표')
    C8 = QL('p5 s1 t1 c3 r2')
    assert [info(p).kind for p in C8] == ['para', 'sq', 'trap', 'rect', 'rhom']
    pic(s, cards(C8, 5, 22, cw=180, ch=150), 160)
    b.help('한 줄씩 설명을 읽고 가~마를 하나씩 확인해요. 한 사각형이 여러 설명에 맞을 수 있어요.')
    sheet_table(s, KO[:5], [r for r, _ in DESC])
    b.why('나(정사각형)는 왜 모든 줄에 ◯가 되었을까요?', 1)
    s.step('④ 만들어 보기', '종이띠 지도 기호 (실제 크기, 잘라서 써요)')
    real(s, strips_fig())
    b.help('긴 띠 4개로 만들면 네 변의 길이가 모두 같아요. 긴 띠와 짧은 띠를 번갈아 놓으면 마주 보는 변의 길이가 같아요.')
    s.table([['', '고른 띠 4개', '만든 사각형의 이름'], ['첫째', '', ''], ['둘째', '', '']], col_mm=[25, 85, 70])
    b.why('만든 사각형을 친구에게 설명해 보세요. (나는 ~을 만들었어. 그 이유는 ~)', 1)
    s.step('⑤ 확인하기', '직사각형과 정사각형')
    C8E = QL('n1 c2 p5 s2 c1 r1')
    rr8 = ans(C8E, lambda p: info(p).allRight, [1, 3, 4])
    sq8 = ans(C8E, lambda p: info(p).allRight and info(p).allEq, [3])
    pic(s, cards(C8E, 6, 26, cw=180, ch=160), 175)
    s.ask('직사각형을 모두 고르면 (          ),  정사각형을 모두 고르면 (          )', blank=False)
    pic(s, side_by_side([labeled([(0, 0), (9, 0), (9, 5), (0, 5)], lens=['9 cm', '㉡ cm', None, '5 cm'], angs=[None, None, '㉠°', None]),
                         labeled([(0, 0), (6, 0), (6, 6), (0, 6)], lens=[None, '㉣ cm', '6 cm', None], angs=['㉢°', None, None, None], W=260)], 20), 120)
    s.text('왼쪽은 직사각형(교실), 오른쪽은 정사각형(계단참)이에요.')
    s.ask('㉠ (     )°   ㉡ (     ) cm   ㉢ (     )°   ㉣ (     ) cm', blank=False)
    t8 = tbl_answer(C8, DESC)
    a = ('8차시  ① 모두 90°예요, 각각 2쌍, 같아요  ② 90°, 평행해요, 같아요  ③ %s / 왜냐하면 정사각형은 네 각이 모두 90°이고 네 변의 길이가 모두 같기 때문이에요.  '
         '④ (예) 5 cm 4개 → 마름모, 5 cm·3 cm를 번갈아 → 평행사변형(각 ㄱ이 90°이면 직사각형)  ⑤ 직사각형 %s, 정사각형 %s / ㉠ 90 ㉡ 5 ㉢ 90 ㉣ 6'
         % (' / '.join(t8), kos(rr8), kos(sq8)))
    if C:
        s.step('⑥ 도전하기', '긴 직사각형 현수막 종이를 잘라 생긴 조각 가~마')
        CUT = [(0, 0), (3, 3), (8, 4), (13, 9), (15, 15), (20, 20)]
        PCS = pieces_of(CUT)
        assert [info(p).kind for p in PCS] == ['sq', 'trap', 'rhom', 'trap', 'rect']
        pic(s, cutstrip_fig(CUT, 20), 170)
        ROWS = [('사다리꼴(평행한 변이 있는 사각형)', lambda I: I.npar >= 1), ('평행사변형(마주 보는 두 쌍의 변이 평행한 사각형)', lambda I: I.npar == 2),
                ('마름모(네 변의 길이가 모두 같은 사각형)', lambda I: I.allEq), ('직사각형(네 각이 모두 직각인 사각형)', lambda I: I.allRight),
                ('정사각형(네 각이 모두 직각이고 네 변의 길이가 모두 같은 사각형)', lambda I: I.allRight and I.allEq)]
        sheet_table(s, KO[:5], [r for r, _ in ROWS])
        b.why('조각 다가 마름모인 까닭을 써 보세요.', 1)
        a += '  ⑥ %s / 다는 네 변의 길이가 모두 5 cm로 같아요.' % ' / '.join(x.split('(')[0] + ' ' + x.split(') ')[1] for x in tbl_answer(PCS, ROWS))
        assert all(abs(l - 5) < 1e-9 for l in info(PCS[2]).L)
    A.append(a)

    # ---------------------------------------------------------------- 9차시
    MAIN = dict(f12=3.2, f23=3.1, stair=3.8, door=2.4, win=1.5)
    MAIN['h'] = round(MAIN['f12'] + MAIN['f23'], 1)
    MAIN['dx'] = math.sqrt(MAIN['stair'] ** 2 - MAIN['f12'] ** 2)
    ANX = dict(f12=3.4, f23=3.0, f3r=2.8, s1=4.1, s2=3.6)
    ANX['h'] = round(ANX['f12'] + ANX['f23'] + ANX['f3r'], 1)
    ANX['dx1'] = math.sqrt(ANX['s1'] ** 2 - ANX['f12'] ** 2)
    ANX['dx2'] = math.sqrt(ANX['s2'] ** 2 - ANX['f23'] ** 2)
    assert MAIN['h'] == 6.3 and ANX['h'] == 9.2
    s.lesson(9, '탐구 정리하기(O)', '학교 건물 높이 ― 평행선 사이의 거리로 구해요', '평행선 사이의 거리를 이용하여 학교 건물의 높이를 어떻게 구할까요?')
    s.scene(None, '운동회 날 본관 3층 바닥 높이에서 1층 바닥까지 닿는 응원 현수막을 걸려고 해요. 윤 선생님이 “본관의 각 층 바닥은 기둥과 수직으로 튼튼하게 만나요.”라고 알려 주셨어요.')
    s.step('① 이해해요', '무엇을 구할까요?')
    s.choices([('구하려고 하는 것은?', '( 3층 바닥 높이에서 1층 바닥까지 닿는 현수막의 길이 /\n본관 계단의 수 )'),
               ('현수막은 어디에서 어디까지 닿아야 하나요?', '( 3층 바닥 높이에서 1층 바닥까지 /\n1층에서 옥상까지 )')])
    s.step('② 계획해요', '어떻게 구할까요?')
    s.fill(['각 층의 바닥과 기둥이 서로 ( 수직 / 평행 )으로 만나므로, 층 바닥을 나타내는 선분 가, 나, 다는 서로 ( 평행해요 / 수직이에요 ).',
            '그래서 1층 바닥에서 3층 바닥까지의 높이는 ( 평행선 사이의 거리 / 비스듬한 계단의 길이 )를 더해서 구해요.'])
    s.step('③ 해결해요', '필요한 길이에 ◯표 하고 현수막의 길이 구하기')
    h_ = MAIN['h']

    def deco_m(X, Y):
        o = door(6.4, 0, MAIN['door'])(X, Y)
        o += RECT(X(6.4), Y(h_ + 0.9 + MAIN['win']), 1.2 * 44, MAIN['win'] * 44, '#BFE3F7', '#5A4A3F', 2, 0)
        o += stair(2.6, 0, MAIN['dx'], MAIN['f12'])(X, Y)
        o += RECT(X(8.55), Y(h_), 0.5 * 44, h_ * 44, 'rgba(242,139,130,.35)', '#C2185B', 2, 0, '6 4') + T(X(8.8), Y(h_ + 0.45), '현수막', 14, '#C2185B')
        return o
    pic(s, tower_fig([(0, '다', '1층 바닥'), (MAIN['f12'], '나', '2층 바닥'), (h_, '가', '3층 바닥')],
                     [('%s m' % MAIN['f12'], 1, 0, 1, MAIN['f12'], 0), ('%s m' % MAIN['f23'], 1, MAIN['f12'], 1, h_, 0),
                      ('%s m' % MAIN['win'], 6.3, h_ + 0.9, 6.3, h_ + 0.9 + MAIN['win'], 0), ('%s m' % MAIN['door'], 6.3, 0, 6.3, MAIN['door'], 0),
                      ('%s m' % MAIN['stair'], 2.6, 0, 2.6 + MAIN['dx'], MAIN['f12'], 44)], 2.6, deco_m), 120)
    b.help('층 바닥에서 바로 위층 바닥까지 수직으로 잰 길이를 찾아요. 문과 창문의 높이, 비스듬한 계단의 길이는 필요하지 않아요.')
    s.ask('1층 바닥에서 3층 바닥까지의 높이:  (       ) + (       ) = (       ) (m)', blank=False)
    s.ask('현수막의 길이는 (       ) m여야 해요.', blank=False)
    s.step('④ 되돌아봐요', '해결 과정 설명하기')
    b.help('층 바닥끼리 평행한 까닭을 먼저 쓰고, 어떤 길이를 골라 어떻게 계산했는지 써요.')
    b.why('문제를 어떻게 해결했는지 설명해 보세요.', 2)
    b.why('주의할 점을 써 보세요.', 1)
    s.step('⑤ 척척 풀어요', '별관 옥상에서 1층 바닥까지 닿는 줄')
    s.text('별관 옥상과 각 층 바닥을 선분 가, 나, 다, 라로 나타내었어요. 줄은 1층 바닥에 맞닿게 설치해요.')
    y3 = round(ANX['f12'] + ANX['f23'], 1)

    def deco_a(X, Y):
        return (stair(2.6, 0, ANX['dx1'], ANX['f12'])(X, Y) + stair(2.6, ANX['f12'], ANX['dx2'], ANX['f23'])(X, Y) +
                L((X(8.8), Y(0)), (X(8.8), Y(ANX['h'])), '#B4610F', 3, '6 4') + T(X(8.8), Y(ANX['h'] + 0.35), '줄', 14, '#B4610F'))
    pic(s, tower_fig([(0, '라', '1층 바닥'), (ANX['f12'], '다', '2층 바닥'), (y3, '나', '3층 바닥'), (ANX['h'], '가', '옥상')],
                     [('%s m' % ANX['f12'], 1, 0, 1, ANX['f12'], 0), ('%.1f m' % ANX['f23'], 1, ANX['f12'], 1, y3, 0), ('%s m' % ANX['f3r'], 1, y3, 1, ANX['h'], 0),
                      ('%s m' % ANX['s1'], 2.6, 0, 2.6 + ANX['dx1'], ANX['f12'], 44), ('%s m' % ANX['s2'], 2.6, ANX['f12'], 2.6 + ANX['dx2'], y3, 44)], 0, deco_a), 110)
    s.ask('식:                                    줄은 (       ) m보다 길어야 해요.', blank=False)
    a = ('9차시  ① 3층 바닥 높이에서 1층 바닥까지 닿는 현수막의 길이, 3층 바닥 높이에서 1층 바닥까지  ② 수직, 평행해요, 평행선 사이의 거리  '
         '③ %s m, %s m에 ◯ / %s + %s = %s (m), %s m  ④ (예) 각 층 바닥이 기둥과 수직이라 바닥끼리 평행해요. 평행선 사이의 거리를 더했어요. / 비스듬한 계단의 길이는 높이가 아니에요.  '
         '⑤ %s + %.1f + %s = %s, %s m' % (MAIN['f12'], MAIN['f23'], MAIN['f12'], MAIN['f23'], h_, h_, ANX['f12'], ANX['f23'], ANX['f3r'], ANX['h'], ANX['h']))
    if C:
        s.step('⑥ 도전하기', '별관 그림을 다시 보고 구하기')
        s.ask('3층 바닥(나)에서 1층 바닥(라)까지는 몇 m인가요?  식:                     (       ) m', blank=False)
        s.ask('옥상(가)에서 2층 바닥(다)까지는 몇 m인가요?  식:                     (       ) m', blank=False)
        b.why('계단의 길이 4.1 m와 3.6 m를 쓰지 않는 까닭을 써 보세요.', 1)
        r1, r2 = round(ANX['f12'] + ANX['f23'], 1), round(ANX['f23'] + ANX['f3r'], 1)
        assert (r1, r2) == (6.4, 5.8)
        a += '  ⑥ %s + %.1f = %s (m), %.1f + %s = %s (m) / 계단은 비스듬해서 바닥 사이의 수직 거리가 아니에요.' % (ANX['f12'], ANX['f23'], r1, ANX['f23'], ANX['f3r'], r2)
    A.append(a)

    # ---------------------------------------------------------------- 10차시
    s.lesson(10, '발표하기(P)', '지도 기호 카드 놀이 ― 빨리! 더 빨리!', '도형 카드와 설명 카드를 어떻게 이어야 할까요?')
    s.scene(None, '태민이가 지도 기호로 카드 놀이를 만들었어요. 3~4명이 함께 하는 놀이예요.')
    s.step('① 만져 보기', '놀이 방법 알기')
    order = game_rules_step(s)
    s.step('② 말해 보기', '카드 잇기 연습')
    b.help('마름모는 네 변의 길이가 모두 같고, 마주 보는 두 쌍의 변이 평행해요. 한 도형에 맞는 설명이 여러 장일 수 있어요.')
    gt = game_table_step(s, b)
    rhd = [k + 1 for k, (_, fn) in enumerate(GDESC) if fn(info(Q4S['r2']))]
    assert rhd == [2, 3, 4, 5]
    rights = [GSH[i][0] for i in range(6) if GSH_I[i].allRight]
    assert rights == ['직사각형', '정사각형']
    s.ask('‘네 각의 크기가 모두 90°인 사각형’ 설명 카드 위에 내려놓을 수 있는 도형 카드:  (          )', blank=False)
    b.why('마름모 카드에 ‘네 각의 크기가 모두 90°인 사각형’ 카드를 내려놓을 수 없는 까닭은 무엇일까요?', 1)
    s.step('③ 놀이하기', '빨리! 더 빨리! 내려놓아요')
    s.text('위의 도형 카드 6장과 설명 카드 6장을 오려 놀이 카드로 써요. 내려놓을 카드가 없을 때만 한 장을 가져와요.')
    s.step('④ 놀이하기', '예·아니요 사각형 맞히기')
    tw, pk10 = twenty_step(s, b)
    s.step('⑤ 발표하기', '놀이 되돌아보기')
    b.why('놀이에서 이기려면 어떻게 해야 할까요?', 1)
    b.why('놀이하면서 헷갈렸던 성질과 바르게 고친 생각을 써 보세요.', 1)
    a = ('10차시  ① %s  ② %s / 직사각형(라), 정사각형(마) / 왜냐하면 이 마름모 카드는 네 변의 길이는 같지만 네 각이 모두 90°는 아니기 때문이에요.  ④ %s / %s  '
         '⑤ (예) 사각형마다 어떤 성질이 있는지 잘 알아야 해요. / 정사각형도 마주 보는 두 쌍의 변이 평행해요.' % (order, gt, tw, pk10))
    if C:
        s.step('⑥ 도전하기', '내려놓을 수 있는 카드 생각하기')
        opp = [GSH[i][0] for i in range(6) if GSH_I[i].oppEq]
        assert opp == ['평행사변형', '마름모', '직사각형', '정사각형']
        s.ask('사다리꼴(가) 카드 위에 내려놓을 수 있는 설명 카드 번호:  (          )', blank=False)
        s.ask('‘마주 보는 두 변의 길이가 같은 사각형’ 카드 위에 내려놓을 수 있는 도형 카드:  (                    )', blank=False)
        b.why('이 놀이의 사다리꼴 카드에 ‘마주 보는 두 변의 길이가 같은 사각형’ 카드를 내려놓을 수 없는 까닭을 써 보세요.', 1)
        a += '  ⑥ 2 / 평행사변형, 마름모, 직사각형, 정사각형 / 이 사다리꼴은 평행한 두 변(3 cm, 5 cm)의 길이가 달라서 마주 보는 두 변의 길이가 같지 않아요.'
        assert [round(x, 6) for x in info(Q4S['t1']).L][0::2] == [3.0, 5.0]
    A.append(a)

    # ---------------------------------------------------------------- 11차시
    s.lesson(11, '발표하기(P)', '우리 반 학교 지도 발표회', '학교 지도를 만들며 수직과 평행, 여러 가지 사각형에 대해 무엇을 알게 되었나요?')
    s.step('① 말해 보기', '수직과 평행 다시 보기')
    L11 = [dict(n='라', c=(260, 210), a=0, len=220), dict(n='가', c=(110, 140), a=70, len=100), dict(n='나', c=(250, 140), a=90, len=100), dict(n='다', c=(380, 140), a=90, len=100)]
    pic(s, lines_fig(L11), 80)
    s.choices([('직선 나는 직선 라에 대한 (     )입니다.', '( 수선 / 평행선 )'), ('직선 나와 직선 다는 서로 (     ).', '( 수직입니다 / 평행합니다 )')])
    s.text('점 ㄱ(과학실 문)을 지나고 주어진 직선과 평행한 직선을 긋고, 두 직선 사이의 거리를 재어 보세요. (실제 크기)')
    real(s, line_fig(6, 16, 5.4, .78, pt=(1, 3)))
    s.ask('평행선 사이의 거리:  (       ) cm', blank=False)
    s.step('② 그려 보기', '지도 기호 완성하기 (한 칸은 1 cm)')
    fxr = [(5, 2), (7, 1), (9, 2)]
    r4 = fourth(fxr)
    assert info(fxr + [r4]).kind == 'rhom' and r4 == (7, 3)
    b.help('사다리꼴은 평행한 변이 한 쌍이라도 있으면 돼요. 마름모는 네 변의 길이가 모두 같아야 해요.')
    real(s, geo_panels([dict(cols=10, rows=6, fixed=[(1, 1), (2, 4)], title='⑴ 사다리꼴(화단 기호)'), dict(cols=10, rows=6, fixed=fxr, title='⑵ 마름모(강당 기호)')]))
    s.step('③ 확인하기', '성질로 구하기')
    P11 = PG(6, 4, 55)
    assert round(info(P11).A[1]) == 125
    pic(s, side_by_side([labeled(P11, lens=['㉠ cm', '㉡ cm', '6 cm', '4 cm'], angs=['㉣°', '㉢°', None, '125°']),
                         labeled([(0, 0), (8, 0), (8, 3), (0, 3)], lens=['8 cm', None, '㉤ cm', '3 cm'], angs=[None, '㉥°', None, None])], 20), 140)
    s.text('왼쪽은 주차 칸(평행사변형), 오른쪽은 교실(직사각형) 기호예요.')
    s.ask('㉠ (    ) cm  ㉡ (    ) cm  ㉢ (    )°  ㉣ (    )°  ㉤ (    ) cm  ㉥ (    )°', blank=False)
    s.step('④ 확인하기', '옳은 설명 따라 길 찾기')
    ST11 = [('두 직선이 만나서 이루는 각이 직각일 때 두 직선은 서로 수직이라고 합니다.', True), ('평행선 사이의 거리는 재는 곳에 따라 달라집니다.', False),
            ('평행사변형에서 이웃하는 두 각의 크기의 합은 180°입니다.', True), ('마름모는 네 각의 크기가 모두 같습니다.', False),
            ('사다리꼴은 평행한 변이 있는 사각형입니다.', True), ('정사각형은 네 변의 길이가 모두 같고 네 각이 모두 직각입니다.', True)]
    ends = [None, '도서관', '보건실', '과학실', '음악실', None, None]
    nf = sum(1 for _, t in ST11 if not t)
    assert ends[nf] == '보건실'
    s.choices([('%d. %s' % (k + 1, t), '( 옳아요 / 옳지 않아요 )') for k, (t, _) in enumerate(ST11)])
    pic(s, path_fig(ends), 92)
    s.ask('도착한 곳:  (          )', blank=False)
    s.step('⑤ 발표하기', '우리 반 학교 지도 발표회')
    b.help('1차시에 쓴 ‘궁금해요’를 다시 보고, 이 단원에서 배운 말로 답을 써요.')
    b.why('우리 학교 지도에서 찾은 사각형 하나를 골라 이름과 까닭을 소개해 보세요.', 1)
    b.why('1차시에 궁금했던 것 중에서 알게 된 것을 써 보세요.', 1)
    a = ('11차시  ① 수선, 평행합니다 / 점 ㄱ을 지나는 평행선, 3 cm  ② ⑴ 평행한 변이 있게 완성(학생마다 다름) ⑵ 넷째 꼭짓점은 ㄴ에서 아래로 2칸  '
         '③ ㉠ 6 ㉡ 4 ㉢ 125 ㉣ 55 ㉤ 8 ㉥ 90  ④ %s → 보건실  ⑤ (예) 주차장 기호는 평행사변형이에요. 마주 보는 두 쌍의 변이 서로 평행하기 때문이에요. / 학생마다 다름'
         % ', '.join('%d %s' % (k + 1, '옳음' if t else '옳지 않음') for k, (_, t) in enumerate(ST11)))
    if C:
        s.step('⑥ 도전하기', '폭이 서로 다른 직사각형 종이띠 2장을 겹쳤어요')
        pic(s, overlap_fig(55), 100)
        s.choices([('겹쳐진 부분(빨간 부분)의 이름은?', '( 사다리꼴 / 평행사변형 /\n마름모 / 직사각형 )')])
        b.why('그렇게 생각한 까닭을 써 보세요.', 2)
        a += '  ⑥ 평행사변형(평행한 변이 있으니 사다리꼴이라고도 할 수 있어요) / 겹쳐진 부분의 마주 보는 두 변은 같은 직사각형 종이의 변이라 서로 평행해요.'
    A.append(a)

    s.answers('【교사용】 4. 사각형(이야기 버전) 활동지 정답 (%s)' % level, A, note='※ 이 활동지는 앱 u4-quad.html과 차시 번호가 같습니다.')
    return s


# ================================================================ 만들기
def main():
    out = []
    try:
        for build, d in ((build_tb, OUT_TB), (build_st, OUT_ST)):
            os.makedirs(d, exist_ok=True)
            for level in ('기본형', '도전형'):
                s = build(level)
                p = os.path.join(d, NAME % level)
                s.save(p)
                out.append(p)
                print('만듦:', os.path.relpath(p, ROOT))
    finally:
        SHOT.close()
    return out


if __name__ == '__main__':
    main()
