# -*- coding: utf-8 -*-
"""5-1 수학 6. 다각형의 둘레와 넓이 활동지(교과서 차시 버전·이야기 버전 × 기본형·도전형) 만들기

    python3 gen_u6-area.py

앱 원본 ../units/u6-area.tb.js('태민이의 온라인 집', 13개 차시 묶음: 1~5, 6~7, 8~9, 10~11, 12, 13~14, 15, 16, 17)와
u6-area.st.js('우리 반 꿈의 교실 설계도', 1~13차시)의 차시 번호·제목·S.O.O.P.·탐구 질문·이야기·수를 그대로 따릅니다.

그림
  - 학생이 길이를 재거나, 높이를 긋거나, 칸을 세거나, 도형을 그리는 그림은 **실제 크기**로 넣습니다:
    1 cm = 40 px, 그림 너비(mm) = px ÷ 4. 모눈 한 칸이 정말로 1 cm예요(1×18 공원 모눈만 본문 너비 180 mm에 맞추느라 99 %).
  - 길이가 글로 적혀 있어 재지 않는 그림(넓이 비교 그림, m·km 그림)은 크기를 줄여 넣습니다.
  - 태민이의 집·꿈의 교실 설계도·야구장 내야·평행선 그림은 앱 원본의 그리기 코드를 node로 그대로 실행해 SVG로 옮겨 씁니다.
정답(둘레, 넓이, 높이, 칸 수, 반 칸 수, 여러 직사각형 등)은 모두 이 스크립트가 좌표로 계산해 확인합니다.
그림은 SVG로 그려 임시 폴더에서 PNG로 바꿉니다(저장소에는 남기지 않음). Chromium 하나를 띄워 모든 그림을 찍습니다.
"""
import json
import math
import os
import shutil
import subprocess
import sys
import tempfile
from xml.sax.saxutils import escape

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from hwpxgen import Sheet, check  # noqa: E402

ROOT = os.path.normpath(os.path.join(HERE, '..', '..'))      # grade5/math
UNITS = os.path.join(ROOT, '_build', 'units')
OUT_TB = os.path.join(ROOT, 'sem1', 'sheets')
OUT_ST = os.path.join(ROOT, 'sem1-soop', 'sheets')
NAME = '6단원_다각형의둘레와넓이_활동지_%s.hwpx'
FONT = "'Noto Sans KR','WenQuanYi Zen Hei',sans-serif"
NUM = '①②③④⑤⑥⑦⑧'
KO = '가나다라마바사아'
WORK = tempfile.mkdtemp(prefix='u6area_')
INK, BLUE, RED, GREEN, ORG, GRAY = '#1D2A2A', '#2B7BD6', '#D64545', '#2E8B57', '#E47A38', '#8795A1'
F1, F2, F3, F4, F6 = '#DCEAFB', '#FDE3D3', '#DDEDE5', '#FFF1C7', '#FBE0E6'
GRID = '#B9C8D6'
U = 40            # 실제 크기: 1 cm = 40 px

# ================================================================ 그림 찍기(Chromium 하나)
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

    def png(self, svg, width_px):
        key = (svg, int(width_px))
        if key not in self.cache:
            if not self.proc:
                self._start()
            self.n += 1
            out = os.path.join(WORK, 'f%04d.png' % self.n)
            self.proc.stdin.write(json.dumps({'svg': svg, 'out': out, 'width': int(width_px)}, ensure_ascii=False) + '\n')
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

# ================================================================ 앱 그림 코드 옮겨 오기(node)
_EX = r"""
const fs = require('fs');
const src = fs.readFileSync(process.argv[2], 'utf8');
const FONT = process.argv[4];
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
class El {
  constructor(tag, a) { this.tag = tag; this.a = Object.assign({}, a || {}); this.kids = []; this.textContent = ''; this.style = {}; this.dataset = {};
    this.classList = { add() {}, remove() {}, toggle() {} }; }
  append(...k) { for (const x of k.flat(9)) if (x != null && x !== false) this.kids.push(x); }
  appendChild(x) { this.kids.push(x); return x; }
  setAttribute(k, v) { this.a[k] = v; }
  getAttribute(k) { return this.a[k]; }
  set innerHTML(v) { this.kids = []; }
  addEventListener() {}
  querySelector() { return null; } querySelectorAll() { return []; }
  toString() {
    const a = Object.assign({}, this.a);
    if (this.tag === 'svg') { a.xmlns = 'http://www.w3.org/2000/svg'; delete a.class; }
    const at = Object.entries(a).map(([k, v]) => ` ${k}="${esc(v)}"`).join('');
    return `<${this.tag}${at}>${esc(this.textContent)}${this.kids.map(k => typeof k === 'string' ? esc(k) : String(k)).join('')}</${this.tag}>`;
  }
}
const document = { createElement: t => new El(t), createElementNS: (n, t) => new El(t), head: { append() {} } };
const svgEl = (t, a) => new El(t, a);
const h = (t, a, ...k) => { const plain = a && !(a instanceof El) && typeof a === 'object' && !Array.isArray(a); const e = new El(t, plain ? a : {}); if (!plain && a != null) e.append(a); e.append(...k); return e; };
function makeSvg(w, hh) { return svgEl('svg', { viewBox: `0 0 ${w} ${hh}` }); }
function txt(x, y, t, size = 22, attrs = {}) { const e = svgEl('text', Object.assign({ x, y, 'font-size': size, 'text-anchor': 'middle', 'dominant-baseline': 'middle', 'font-family': FONT, fill: '#1D2A2A' }, attrs)); e.textContent = t; return e; }
const findSvg = e => { if (!e || typeof e !== 'object') return null; if (e.tag === 'svg') return e; for (const k of e.kids || []) { const r = findSvg(k); if (r) return r; } return null; };
const api = { provide() {}, hint() {}, done() {}, bad() {} };
const unitSrc = src.slice(src.indexOf('//@@UNIT'), src.indexOf('//@@LESSONS'));
const lesSrc = src.slice(src.indexOf('//@@LESSONS'));
eval((unitSrc + '\n' + lesSrc.slice(0, lesSrc.indexOf('const LESSONS'))).replace(/^(const|let) /gm, 'var '));
const OUT = {};
for (const [k, e] of Object.entries(JSON.parse(process.argv[3]))) { const v = eval(e); const s = findSvg(v); OUT[k] = s ? String(s) : v; }
process.stdout.write(JSON.stringify(OUT));
"""


def extract(fname, jobs):
    js = os.path.join(WORK, 'ex.js')
    with open(js, 'w', encoding='utf-8') as f:
        f.write(_EX)
    r = subprocess.run(['node', js, os.path.join(UNITS, fname), json.dumps(jobs), FONT], capture_output=True, text=True)
    if r.returncode:
        raise RuntimeError(r.stderr[-2500:])
    return json.loads(r.stdout)


APP_TB = extract('u6-area.tb.js', {
    'house': '(() => { const b = new El("div"); ar6House(b, api, {}); return b; })()',
    'places': 'AR6_PLACES', 'diamond': 'ar6Diamond()', 'par': 'ar6ParLines()', 'treasure': 'AR6_TREASURE'})
APP_ST = extract('u6-area.st.js', {
    'plan': 'ar6sPlanSvg(null).svg', 'places': 'AR6S_PLACES', 'par': 'ar6sParLines()', 'treasure': 'AR6_TREASURE'})


def appfig(s, svgtext, mm):
    """앱 그림(흰 배경 없음)에 흰 바탕을 깔아 넣기"""
    w = float(svgtext.split('viewBox="')[1].split('"')[0].split()[2])
    t = svgtext.replace('>', '><rect x="-2000" y="-2000" width="6000" height="6000" fill="#fff"/>', 1)
    s.picture(SHOT.png(t, min(2400, w * 3)), width_mm=mm)


# ================================================================ 도형 계산
def area(P):
    a = 0
    for i in range(len(P)):
        x1, y1 = P[i]
        x2, y2 = P[(i + 1) % len(P)]
        a += x1 * y2 - x2 * y1
    return abs(a) / 2


def perim(P):
    return sum(math.dist(P[i], P[(i + 1) % len(P)]) for i in range(len(P)))


def nr(v):
    """정수에 가까우면 정수로"""
    r = round(v)
    assert abs(v - r) < 1e-6, ('정수가 아님', v)
    return r


def line_dist(p, a, b):
    """점 p와 직선 ab 사이의 거리"""
    return abs((b[0] - a[0]) * (a[1] - p[1]) - (a[0] - p[0]) * (b[1] - a[1])) / math.dist(a, b)


def clip(P, x0, y0, x1, y1):
    """다각형 P를 네모 [x0,x1]×[y0,y1]로 자르기(서덜랜드–호지먼)"""
    def cut(pts, inside, inter):
        out = []
        for i in range(len(pts)):
            c, n = pts[i], pts[(i + 1) % len(pts)]
            if inside(c):
                out.append(c)
                if not inside(n):
                    out.append(inter(c, n))
            elif inside(n):
                out.append(inter(c, n))
        return out

    def ix(xv):
        return lambda c, n: (xv, c[1] + (n[1] - c[1]) * (xv - c[0]) / (n[0] - c[0]))

    def iy(yv):
        return lambda c, n: (c[0] + (n[0] - c[0]) * (yv - c[1]) / (n[1] - c[1]), yv)
    Q = list(P)
    for inside, inter in ((lambda p: p[0] >= x0, ix(x0)), (lambda p: p[0] <= x1, ix(x1)),
                          (lambda p: p[1] >= y0, iy(y0)), (lambda p: p[1] <= y1, iy(y1))):
        if not Q:
            break
        Q = cut(Q, inside, inter)
    return Q


def cells_of(P):
    """다각형이 덮는 모눈 칸: (온전한 칸 수, 반 칸 수) — 그 밖의 조각이 있으면 멈춤"""
    xs, ys = [p[0] for p in P], [p[1] for p in P]
    full = half = 0
    for x in range(int(min(xs)), int(math.ceil(max(xs)))):
        for y in range(int(min(ys)), int(math.ceil(max(ys)))):
            Q = clip(P, x, y, x + 1, y + 1)
            a = area(Q) if len(Q) >= 3 else 0
            if abs(a - 1) < 1e-9:
                full += 1
            elif abs(a - .5) < 1e-9:
                half += 1
            else:
                assert a < 1e-9, ('반 칸도 온 칸도 아닌 조각', x, y, a)
    return full, half


def rect(x, y, w, h):
    return [(x, y), (x + w, y), (x + w, y + h), (x, y + h)]


def rects_area(n):
    return [(w, n // w) for w in range(1, n + 1) if n % w == 0 and w <= n // w]


def rects_perim(p):
    return [(w, p // 2 - w) for w in range(1, p // 4 + 1)]


# ================================================================ SVG 조각
def F(v):
    return ('%.2f' % v).rstrip('0').rstrip('.')


def T(x, y, t, size=18, fill=INK, anchor='middle', weight='normal'):
    return ('<text x="%s" y="%s" font-size="%s" text-anchor="%s" dominant-baseline="central" font-family="%s" fill="%s" '
            'font-weight="%s" style="white-space:pre">%s</text>' % (F(x), F(y), F(size), anchor, FONT, fill, weight, escape(str(t))))


class Fig:
    """cm 모눈 좌표(가로 x, 아래쪽 y) 그림. k = 1 cm의 px. real이면 실제 크기."""

    def __init__(self, cols, rows, k=U, pad=.7, grid=True, padx=None):
        self.cols, self.rows, self.k, self.grid = cols, rows, k, grid
        self.px, self.py = (pad if padx is None else padx), pad
        self.W = (cols + 2 * self.px) * k
        self.H = (rows + 2 * self.py) * k
        self.under, self.parts = [], []

    def m(self, p):
        return ((self.px + p[0]) * self.k, (self.py + p[1]) * self.k)

    def pts(self, P):
        return ' '.join('%s,%s' % tuple(F(v) for v in self.m(p)) for p in P)

    def poly(self, P, fill=F1, stroke=INK, w=3, dash=None, op=None):
        self.parts.append('<polygon points="%s" fill="%s" stroke="%s" stroke-width="%s" stroke-linejoin="round"%s%s/>'
                          % (self.pts(P), fill, stroke, F(w), (' stroke-dasharray="%s"' % dash) if dash else '',
                             (' fill-opacity="%s"' % op) if op else ''))

    def seg(self, a, b, col=INK, w=3, dash=None):
        (x1, y1), (x2, y2) = self.m(a), self.m(b)
        self.parts.append('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="%s" stroke-linecap="round"%s/>'
                          % (F(x1), F(y1), F(x2), F(y2), col, F(w), (' stroke-dasharray="%s"' % dash) if dash else ''))

    def text(self, p, t, size=18, col=INK, anchor='middle', weight='normal'):
        x, y = self.m(p)
        self.parts.append(T(x, y, t, size, col, anchor, weight))

    def lab(self, a, b, t, c=None, col=INK, off=.42, size=17):
        """변 ab 바깥쪽(c에서 먼 쪽)에 길이 글"""
        mx, my = (a[0] + b[0]) / 2, (a[1] + b[1]) / 2
        dx, dy = b[0] - a[0], b[1] - a[1]
        L = math.hypot(dx, dy)
        nx, ny = -dy / L, dx / L
        if c is not None and (c[0] - mx) * nx + (c[1] - my) * ny > 0:
            nx, ny = -nx, -ny
        self.text((mx + nx * off, my + ny * off), t, size, col)

    def labels(self, P, idx_text, col=INK, size=17):
        c = (sum(p[0] for p in P) / len(P), sum(p[1] for p in P) / len(P))
        for i, t in idx_text.items():
            self.lab(P[i], P[(i + 1) % len(P)], t, c, col, size=size)

    def ticks(self, P, marks):
        """같은 길이 표시(변 가운데 짧은 금 n개)"""
        for i, n in enumerate(marks):
            a, b = P[i], P[(i + 1) % len(P)]
            mx, my = (a[0] + b[0]) / 2, (a[1] + b[1]) / 2
            dx, dy = b[0] - a[0], b[1] - a[1]
            L = math.hypot(dx, dy)
            ux, uy, nx, ny = dx / L, dy / L, -dy / L, dx / L
            for j in range(n):
                o = (j - (n - 1) / 2) * .13
                cx, cy = mx + ux * o, my + uy * o
                self.seg((cx - nx * .14, cy - ny * .14), (cx + nx * .14, cy + ny * .14), INK, 2.2)

    def right(self, F_, u, v, col=RED, s=.28):
        a = (F_[0] + u[0] * s, F_[1] + u[1] * s)
        b = (F_[0] + u[0] * s + v[0] * s, F_[1] + u[1] * s + v[1] * s)
        c = (F_[0] + v[0] * s, F_[1] + v[1] * s)
        self.parts.append('<polyline points="%s" fill="none" stroke="%s" stroke-width="2"/>' % (self.pts([a, b, c]), col))

    def cells(self, C, fill):
        for x, y in C:
            self.poly(rect(x, y, 1, 1), fill, INK, 1.6)

    def svg(self):
        g = []
        if self.grid:
            for x in range(self.cols + 1):
                (a, b), (c, d) = self.m((x, 0)), self.m((x, self.rows))
                g.append('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="1.3"/>' % (F(a), F(b), F(c), F(d), GRID))
            for y in range(self.rows + 1):
                (a, b), (c, d) = self.m((0, y)), self.m((self.cols, y))
                g.append('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="1.3"/>' % (F(a), F(b), F(c), F(d), GRID))
        return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %s %s"><rect width="%s" height="%s" fill="#fff"/>%s%s%s</svg>'
                % (F(self.W), F(self.H), F(self.W), F(self.H), ''.join(self.under), ''.join(g), ''.join(self.parts)))


def real(s, fig):
    """실제 크기로 넣기(1 cm = 40 px → 그림 너비 mm = px ÷ 4)"""
    assert fig.k == U
    mm = fig.W / 4
    assert mm <= 182, ('실제 크기 그림이 너무 넓어요', mm)
    s.picture(SHOT.png(fig.svg(), fig.W * 2.5), width_mm=min(mm, 180))


def small(s, fig, mm):
    s.picture(SHOT.png(fig.svg(), min(2400, fig.W * 2.5)), width_mm=mm)


def side_by_side(figs, gap=.6):
    """같은 k의 Fig 여러 개를 가로로 잇기(실제 크기 유지)"""
    k = figs[0].k
    W = sum(f.W for f in figs) + gap * k * (len(figs) - 1)
    H = max(f.H for f in figs)
    out, x = [], 0
    for f in figs:
        inner = f.svg().split('>', 1)[1].rsplit('</svg>', 1)[0]
        out.append('<g transform="translate(%s,0)">%s</g>' % (F(x), inner))
        x += f.W + gap * k
    box = Fig(0, 0, k)
    box.W, box.H = W, H
    box.svg = lambda: ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %s %s"><rect width="%s" height="%s" fill="#fff"/>%s</svg>'
                       % (F(W), F(H), F(W), F(H), ''.join(out)))
    return box


def regpoly(n, side):
    """밑변이 가로인 정다각형 꼭짓점(cm), 왼쪽 위가 (0,0) 쪽"""
    R = side / (2 * math.sin(math.pi / n))
    a0 = math.pi / 2 + math.pi / n
    P = [(R * math.cos(a0 + 2 * math.pi * i / n), R * math.sin(a0 + 2 * math.pi * i / n)) for i in range(n)]
    mx, my = min(p[0] for p in P), min(p[1] for p in P)
    P = [(x - mx, y - my) for x, y in P]
    for i in range(n):
        assert abs(math.dist(P[i], P[(i + 1) % n]) - side) < 1e-9
    return P


def reg_fig(items, k=U, gap=1.2):
    """정다각형 여러 개(실제 크기): items [(n, side, 글, 이름, fill)]"""
    figs = []
    for n, side, lab, name, fill in items:
        P = regpoly(n, side)
        w, hh = max(p[0] for p in P), max(p[1] for p in P)
        f = Fig(w, hh + .9, k, pad=.6, grid=False)
        Q = [(x, y) for x, y in P]
        f.poly(Q, fill, INK, 3)
        f.ticks(Q, [1] * n)
        f.labels(Q, {0: lab}, BLUE)
        if name:
            f.text((w / 2, hh + .95), name, 17, GRAY)
        figs.append(f)
    return side_by_side(figs, gap) if len(figs) > 1 else figs[0]


def height_fig(P, base, cols, rows, name=None, ext=False, k=U):
    """높이 긋기: 밑변(base 두 꼭짓점 번호)은 파랑, ext면 밑변을 늘인 점선"""
    f = Fig(cols, rows, k)
    f.poly(P, F1, INK, 2.6)
    a, b = P[base[0]], P[base[1]]
    if ext:
        dx, dy = b[0] - a[0], b[1] - a[1]
        L = math.hypot(dx, dy)
        ux, uy = dx / L, dy / L
        lo, hi = -1e9, 1e9
        # 모눈 안에서 직선 끝까지
        ts = []
        for t in [i / 10 for i in range(-200, 201)]:
            x, y = a[0] + ux * t, a[1] + uy * t
            if -1e-9 <= x <= cols + 1e-9 and -1e-9 <= y <= rows + 1e-9:
                ts.append(t)
        f.seg((a[0] + ux * min(ts), a[1] + uy * min(ts)), (a[0] + ux * max(ts), a[1] + uy * max(ts)), BLUE, 2, '6 5')
    f.seg(a, b, BLUE, 5)
    if name:
        c = (sum(p[0] for p in P) / len(P), sum(p[1] for p in P) / len(P))
        f.text(c, name, 20, INK, weight='bold')
    return f


def draw_grid(cols, rows, given=None, k=U, pad=.5, padx=None):
    """그리는 모눈(실제 크기). given (x, y, 길이): 파란 가로 선분"""
    f = Fig(cols, rows, k, pad=pad, padx=padx)
    if given:
        x, y, L = given
        f.seg((x, y), (x + L, y), BLUE, 5)
        f.lab((x, y), (x + L, y), '%d cm' % L, (x + L / 2, y + 1), BLUE)
    for x in range(cols + 1):
        for y in range(rows + 1):
            cx, cy = f.m((x, y))
            f.parts.append('<circle cx="%s" cy="%s" r="2.2" fill="#8A9BAA"/>' % (F(cx), F(cy)))
    return f


# ================================================================ 활동 조각
def step(s, i, label, sub=None):
    s.step('%s %s' % (NUM[i], label), sub)


def stepn(s, i, name):
    """앱 단계 이름 '만져 보기 — 텃밭에 울타리 두르기' → 단계 제목 | 부제"""
    a, _, b = name.partition(' — ')
    step(s, i, a, b or None)


def opt_text(opts):
    return '( ' + ' / '.join(opts) + ' )'


def blanks(s, lv, parts):
    """앱 blanks: parts = 글 | (보기 목록, 정답 번호). 기본형은 보기, 도전형은 빈칸 + 낱말 상자. 정답 글 목록."""
    txt, ans, words = '', [], []
    for p in parts:
        if isinstance(p, str):
            txt += p
        else:
            opts, a = p
            ans.append(opts[a])
            words += list(opts)
            txt += opt_text(opts) if lv == '기본형' else '(            )'
    if lv == '도전형':
        s.wordbox(sorted(set(words), key=lambda w: (len(w), w)))
    s.fill(txt)
    return ans


def chooses(s, items):
    """[(질문, 보기 목록, 정답 번호)] → 2칸 고르기 표(보기가 길면 글로). 정답 글 목록."""
    ans = []
    short = all(len(opt_text(o)) <= 30 for q, o, a in items)
    if short:
        s.choices([(q, opt_text(o)) for q, o, a in items])
    else:
        for q, o, a in items:
            s.ask(q, blank=False)
            s.fill(['%s %s' % ('㉠㉡㉢㉣㉤'[i], x) for i, x in enumerate(o)])
            s.ask('답: (        )', blank=False)
    for q, o, a in items:
        if isinstance(a, list):
            ans.append(', '.join('㉠㉡㉢㉣㉤'[i] for i in a))
        elif short:
            ans.append(o[a])
        else:
            ans.append('㉠㉡㉢㉣㉤'[a])
    return ans


def multi(s, q, opts, a):
    """여러 개 고르기"""
    s.ask(q + '  (모두 고르세요)', blank=False)
    s.fill(['%s %s' % ('㉠㉡㉢㉣㉤'[i], x) for i, x in enumerate(opts)])
    s.ask('답: (                )', blank=False)
    return ', '.join('㉠㉡㉢㉣㉤'[i] for i in a)


def frame(help1):
    """앱 도움 둘째 줄 '‘…~…’ 꼴로 써요.' → 쓰기 틀"""
    t = help1.split('‘', 1)[1].rsplit('’', 1)[0] if '‘' in help1 else help1
    return t.replace('~', '__________')


def why(s, lv, q, help1, label='왜 그럴까요?'):
    s.ask('%s %s' % (label, q), blank=False)
    if lv == '기본형':
        s.fill(frame(help1))
    else:
        s.lines(2)


def rule_first(s, lv, q, help1):
    s.ask('먼저 예상해요 · ' + q, blank=False)
    if lv == '기본형':
        s.fill(frame(help1))
    else:
        s.lines(1)


def hint(s, lv, t):
    if lv == '기본형':
        s.text('도움: ' + t)


def calc_rows(s, rows):
    """[(문제 글, 답 글)] → 문제마다 '답: (   )' 줄. 정답 글 목록 돌려줌."""
    out = []
    for q, a in rows:
        s.ask(q)
        out.append(a)
    return out


def write_lines(s, lv, items):
    """앱 writeStep: [(질문, 예시)] — 기본형은 예시 한 줄을 보여 줌"""
    for q, ex in items:
        s.ask(q, blank=False)
        if lv == '기본형' and ex:
            s.text(ex)
        s.lines(2)


def head(s, no, soop, title, question, scene=None):
    s.lesson(no, soop, title, question)
    if scene:
        s.scene(None, scene)


def rect_table(s, kind, lst):
    """넓이 또는 둘레가 같은 직사각형 표(학생이 채움). kind 'area'|'perim'"""
    if kind == 'area':
        s.table([['가로(cm)'] + [''] * len(lst), ['세로(cm)'] + [''] * len(lst), ['둘레(cm)'] + [''] * len(lst)], header=False, header_col=True)
        return ', '.join('%d×%d 둘레 %d cm' % (w, h, (w + h) * 2) for w, h in lst)
    s.table([['가로(cm)'] + [''] * len(lst), ['세로(cm)'] + [''] * len(lst), ['넓이(cm²)'] + [''] * len(lst)], header=False, header_col=True)
    return ', '.join('%d×%d 넓이 %d cm²' % (w, h, w * h) for w, h in lst)


def tile_fig(bricks, k=30):
    """여러 가지 단위로 재기(이 자료에서 다시 그림): 줄마다 ○ 원 / ▭ 직사각형 / □ 정사각형. 정답 개수 돌려줌."""
    cols = max(b[1] + b[3] for b in bricks) + 3.2
    rows_h = max(b[4] for b in bricks) + 1.1
    f = Fig(cols, rows_h * 3, k, pad=.4, grid=False)
    counts = []
    for r, unit in enumerate(['○ 원', '▭ 직사각형', '□ 정사각형']):
        oy = r * rows_h + .6
        f.text((0, oy + 1), unit, 16, INK, anchor='start')
        row = []
        for name, x, y, w, hh in bricks:
            x0 = x + 3.2
            P = rect(x0, oy, w, hh)
            f.poly(P, '#F3DCC8', '#9A6B3E', 2.4)
            f.text((x0 + w / 2, oy - .3), name, 15)
            if r == 0:
                for i in range(w):
                    for j in range(hh):
                        cx, cy = f.m((x0 + i + .5, oy + j + .5))
                        f.parts.append('<circle cx="%s" cy="%s" r="%s" fill="#BFD9F5" stroke="%s" stroke-width="1.6"/>' % (F(cx), F(cy), F(k * .5 - 1.5), BLUE))
                row.append(w * hh)
            elif r == 1:
                # 2×1 조각을 왼쪽 위부터 가로로, 남는 칸은 세로로, 그래도 남으면 빈칸
                used, n = set(), 0
                for j in range(hh):
                    for i in range(w):
                        if (i, j) in used:
                            continue
                        if i + 1 < w and (i + 1, j) not in used:
                            used |= {(i, j), (i + 1, j)}
                            f.poly(rect(x0 + i + .06, oy + j + .06, 1.88, .88), '#CFE8D8', GREEN, 1.8)
                            n += 1
                        elif j + 1 < hh and (i, j + 1) not in used:
                            used |= {(i, j), (i, j + 1)}
                            f.poly(rect(x0 + i + .06, oy + j + .06, .88, 1.88), '#CFE8D8', GREEN, 1.8)
                            n += 1
                row.append(n)
            else:
                for i in range(w):
                    for j in range(hh):
                        f.poly(rect(x0 + i + .06, oy + j + .06, .88, .88), '#BFD9F5', BLUE, 1.6)
                row.append(w * hh)
        counts.append(row)
    return f, counts


def cut_fig(base_poly, moved, result, cols, rows, marks=(), labs=(), k=U):
    """잘라 옮기기: 처음 도형(색) + 자르는 선, 옮긴 결과는 점선으로"""
    f = Fig(cols, rows, k)
    for P, fill in base_poly:
        f.poly(P, fill, INK, 2.6)
    for P in moved:
        f.poly(P, 'none', GRAY, 2.2, '6 5')
    if result:
        f.poly(result, 'none', RED, 3)
    for a, b, col, dash in marks:
        f.seg(a, b, col, 3, dash)
    for a, b, t, c, col in labs:
        f.lab(a, b, t, c, col)
    return f


def game_board(treasure):
    f = Fig(12, 10, U, pad=.4)
    for x, y in treasure:
        cx, cy = f.m((x + .5, y + .5))
        f.parts.append('<rect x="%s" y="%s" width="24" height="18" rx="3" fill="#C9A15A" stroke="#7A5A1E" stroke-width="1.6"/>'
                       % (F(cx - 12), F(cy - 9)))
    return f


def game_record(s):
    s.table([['차례', '주사위 두 눈', '곱', '넓이 / 둘레', '가로 × 세로', '보물']] + [[str(i), '', '', '', '', ''] for i in range(1, 6)], row_h=2600)


def big_unit_fig(big, side, small_):
    """1 m²(1 km²) 안을 작은 단위로 채우는 그림(줄여서 그림)"""
    f = Fig(10, 10, 26, pad=1.3, grid=False)
    f.poly(rect(0, 0, 10, 10), '#FFF8EA', INK, 3)
    for i in range(10):
        f.poly(rect(i, 0, 1, 1), '#BFD9F5', BLUE, 1.4)
        if i:
            f.poly(rect(0, i, 1, 1), '#BFD9F5', BLUE, 1.4)
    f.text((5, 5), big, 30, INK, weight='bold')
    f.text((5, 6.4), '(한 칸은 %s)' % small_, 17, GRAY)
    f.text((5, -.7), side, 17, BLUE)
    f.text((10.6, 5), '…', 22, BLUE)
    f.text((5, 1.5), '…', 22, BLUE)
    return f


def place_table(s, places, lv, shape=True):
    """설계도·집에서 찾은 곳: 곳 | (모양) | 둘레? 넓이?"""
    blank = '' if lv == '도전형' else '( 둘레 / 넓이 )'
    if shape:
        rows = [['곳', '모양', '둘레? 넓이?']] + [[p['name'], '', blank] for p in places]
        s.table(rows, col_mm=[60, 60, 60], row_h=2300)
        return ', '.join('%s %s·%s' % (p['name'], p['shape'], '둘레' if p['what'] == '둘레' else '넓이') for p in places)
    rows = [['곳', '둘레? 넓이?']] + [[p['name'], blank] for p in places]
    s.table(rows, col_mm=[90, 90], row_h=2300)
    return ', '.join('%s %s' % (p['name'], '둘레' if p['what'] == '둘레' else '넓이') for p in places)


# ================================================================ 교과서 차시 버전 (태민이의 온라인 집)
TB_STORY = ('태민이는 캐릭터를 만들어 온라인 공간에 집을 지었어요. 집터에 정사각형 모양의 울타리를 치고, 직사각형 모양의 정원과 문패를 만들고, '
            '창고에는 삼각형 모양의 창문, 마당에는 마름모 모양의 텃밭, 수영장에는 사다리꼴 모양의 그늘막을 만들었어요.')
SHAPES6 = ['정사각형', '직사각형', '평행사변형', '삼각형', '마름모', '사다리꼴']


def tb1(s, lv):
    head(s, 1, '개념 찾기(S)', '단원 도입 ― 태민이의 온라인 집 둘러보기',
         '태민이가 온라인 공간에 지은 집에서 둘레와 넓이를 구해야 하는 곳은 어디일까요?', TB_STORY)
    step(s, 0, '찾아 보기', '태민이의 집 둘러보기')
    appfig(s, APP_TB['house'], 120)
    s.text('집 곳곳에 어떤 도형이 있는지 찾아보고, 둘레와 넓이 중 무엇을 알아보면 좋을지 골라 보세요.')
    places = [p for p in APP_TB['places'] if p['id'] != 'brick']
    a1 = place_table(s, places, lv, shape=False)
    step(s, 1, '생각해 보기', '야구장 내야')
    s.text('야구장에서 본루, 1루, 2루, 3루를 연결한 선으로 둘러싸인 곳을 내야라고 해요.')
    appfig(s, APP_TB['diamond'], 70)
    hint(s, lv, '내야는 네 변의 길이가 모두 같고 네 각이 모두 직각이에요.')
    a2 = chooses(s, [('내야는 어떤 모양일까요?', ['직사각형', '정사각형', '사다리꼴'], 1),
                     ('내야의 ‘둘레’를 구한다는 것은 무엇을 구하는 것일까요?', ['본루 → 1루 → 2루 → 3루 → 본루로 한 바퀴 도는 길이', '내야가 차지하는 평면의 크기'], 0),
                     ('내야의 ‘넓이’를 구한다는 것은 무엇을 구하는 것일까요?', ['본루 → 1루 → 2루 → 3루 → 본루로 한 바퀴 도는 길이', '내야가 차지하는 평면의 크기'], 1)])
    step(s, 2, '떠올리기', '이전에 배웠어요')
    s.text('두 직선은 서로 평행해요.')
    appfig(s, APP_TB['par'], 80)
    a3 = chooses(s, [('평행선 사이의 거리를 나타내는 선분은?', ['㉠', '㉡', '㉢'], 1),
                     ('마주 보는 두 쌍의 변이 서로 평행한 사각형은?', ['사다리꼴', '평행사변형', '삼각형'], 1),
                     ('변의 길이가 모두 같고, 각의 크기가 모두 같은 다각형은?', ['정다각형', '대각선', '직사각형'], 0)])
    step(s, 3, '이어 보기', '곳과 모양')
    a4 = blanks(s, lv, ['집터의 울타리는 ', (['정사각형', '삼각형', '마름모'], 0), ', 정원과 문패는 ', (['직사각형', '사다리꼴', '평행사변형'], 0),
                        ', 화장실 타일은 ', (['삼각형', '평행사변형', '정사각형'], 1), ', 창고 창문은 ', (['마름모', '직사각형', '삼각형'], 2),
                        ', 텃밭은 ', (['마름모', '사다리꼴', '직사각형'], 0), ', 수영장 그늘막은 ', (['평행사변형', '사다리꼴', '정사각형'], 1), ' 모양이에요.'])
    step(s, 4, '확인하기', '구해 보고 싶은 것')
    write_lines(s, lv, [('우리 주변에서 둘레나 넓이를 구해 보고 싶은 다각형을 써 보세요.', '예) 텔레비전 화면의 넓이, 직사각형 액자의 넓이'),
                        ('이 단원에서 알고 싶은 것을 써 보세요.', '')])
    ans = '1차시  ① %s  ② %s  ③ %s  ④ %s  ⑤ (자유)' % (a1, ', '.join(a2), ', '.join(a3), ', '.join(a4))
    if lv == '도전형':
        step(s, 5, '도전하기', '둘레일까, 넓이일까')
        a6 = chooses(s, [('바지를 고르려고 허리를 한 바퀴 재요.', ['둘레', '넓이'], 0), ('벽에 벽지를 빈틈없이 붙이려고 해요.', ['둘레', '넓이'], 1),
                         ('꽃밭 가장자리에 울타리를 치려고 해요.', ['둘레', '넓이'], 0), ('바닥에 깔 돗자리의 크기를 알아보려고 해요.', ['둘레', '넓이'], 1)])
        s.ask('둘레와 넓이는 어떻게 다른지 내 말로 써 보세요.', blank=False)
        s.lines(2)
        ans += '  ⑥ %s / 예) 둘레는 테두리를 한 바퀴 돈 길이, 넓이는 차지하는 평면의 크기예요.' % ', '.join(a6)
    return ans


def tb2(s, lv):
    head(s, 2, '개념 구축하기(O)', '정다각형의 둘레를 구해 볼까요', '정다각형의 둘레는 어떻게 구할 수 있을까요?',
         '태민이가 집터에 정사각형 모양으로 울타리를 치려고 해요.')
    step(s, 0, '만져 보기', '집터 설계도에 끈 두르기')
    s.text('집터 설계도는 한 변이 3 cm인 정사각형이에요(그림은 실제 크기, 모눈 한 칸은 1 cm). 변을 따라 손가락으로 한 바퀴 둘러 보세요.')
    f = Fig(3, 3, pad=.8)
    SQ = rect(0, 0, 3, 3)
    f.poly(SQ, F4, INK, 3.5)
    f.ticks(SQ, [1, 1, 1, 1])
    f.labels(SQ, {0: '3 cm'}, BLUE)
    real(s, f)
    a1 = blanks(s, lv, ['정사각형의 변은 4개이고, 네 변의 길이가 ', (['모두 같아요', '모두 달라요'], 0), '. 그래서 정사각형의 둘레는 한 변의 길이를 ',
                        (['4', '2'], 0), '배 하여 구할 수 있어요.'])
    a1b = calc_rows(s, [('집터의 둘레는 몇 cm일까요?   3 × 4 = (      )', '%d cm' % nr(perim(SQ)))])
    step(s, 1, '그려 보기', '정삼각형과 정오각형')
    s.text('한 변이 3 cm인 정삼각형과 정오각형이에요(실제 크기). 자로 변의 길이를 재어 확인하고, 표를 완성해 보세요.')
    real(s, reg_fig([(3, 3, '3 cm', '정삼각형', F1), (5, 3, '3 cm', '정오각형', F3)]))
    rows = [(3, '정삼각형'), (4, '정사각형'), (5, '정오각형')]
    s.table([['도형', '한 변의 길이', '변의 수', '둘레']] + [[nm, '3 cm', '(    )개', '(    ) cm'] for n, nm in rows])
    a2 = ', '.join('%s %d개 %d cm' % (nm, n, nr(perim(regpoly(n, 3)))) for n, nm in rows)
    step(s, 2, '말해 보기', '정다각형의 둘레 구하는 방법')
    hint(s, lv, '같은 수를 여러 번 더하는 것은 곱셈으로 나타낼 수 있어요.')
    a3 = blanks(s, lv, ['정다각형은 ', (['모든 변의 길이가 같아서', '모든 변의 길이가 달라서'], 0), ' 변의 길이를 하나하나 더하지 않고 ',
                        (['한 변의 길이에 변의 수를 곱하여', '변의 수끼리 더하여'], 0), ' 둘레를 구할 수 있어요. 정오각형의 둘레 3+3+3+3+3은 ',
                        (['3×5', '3+5', '5×5'], 0), '와 같아요.'])
    step(s, 3, '약속하기', '정다각형의 둘레')
    a4 = blanks(s, lv, ['(정다각형의 둘레) = (', (['한 변의 길이', '둘레', '넓이'], 0), ') × (', (['변의 수', '대각선의 수', '한 변의 길이'], 0), ')'])
    step(s, 4, '확인하기', '정다각형의 둘레 구하기')
    s.text('그림은 실제 크기예요. 자로 한 변을 재어 확인해도 좋아요.')
    real(s, reg_fig([(6, 4, '4 cm', '정육각형', F1), (8, 2, '2 cm', '정팔각형', F2)]))
    a5 = calc_rows(s, [('정육각형의 둘레:  4 × (    ) = (    ) cm', '4×6=%d cm' % nr(perim(regpoly(6, 4)))),
                       ('정팔각형의 둘레:  2 × (    ) = (    ) cm', '2×8=%d cm' % nr(perim(regpoly(8, 2))))])
    ans = '2차시  ① %s, %s  ② %s  ③ %s  ④ %s  ⑤ %s' % (', '.join(a1), a1b[0], a2, ', '.join(a3), ', '.join(a4), ', '.join(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '수학익힘 문제')
        assert 7 * 5 == 35 and 20 * 3 == 60 and 54 // 6 == 9 and 25 * 9 == 225 and 225 // 5 == 45
        per = {'㉠': 10 * 8, '㉡': 19 * 4, '㉢': 12 * 10}
        shortest = min(per, key=per.get)
        assert shortest == '㉡'
        a6 = calc_rows(s, [('한 변이 7 cm인 정오각형의 둘레:  7 + 7 + 7 + (   ) + (   ) = 7 × (   ) = (     ) cm', '7, 7, 5, 35 cm'),
                           ('한 변이 20 cm인 정삼각형의 둘레는 몇 cm일까요?', '60 cm'),
                           ('둘레가 54 cm인 정육각형의 한 변의 길이는 몇 cm일까요?', '9 cm'),
                           ('둘레가 가장 짧은 것은?  ㉠ 한 변이 10 cm인 정팔각형  ㉡ 한 변이 19 cm인 정사각형  ㉢ 한 변이 12 cm인 정십각형',
                            '%s (㉠ 80 cm, ㉡ 76 cm, ㉢ 120 cm)' % shortest),
                           ('한 변이 25 cm인 정구각형과 둘레가 같은 정오각형의 한 변은 몇 cm일까요?', '45 cm (둘레 225 cm)')])
        s.ask('둘레를 알 때 정다각형의 한 변의 길이를 구하는 방법을 써 보세요.', blank=False)
        s.lines(1)
        ans += '  ⑥ %s / (한 변의 길이) = (둘레) ÷ (변의 수)' % ', '.join(a6)
    return ans


PAR3 = [(0, math.sqrt(12)), (6, math.sqrt(12)), (8, 0), (2, 0)]
RH3 = [(0, 3), (4, 0), (8, 3), (4, 6)]


def tb3(s, lv):
    head(s, 3, '개념 구축하기(O)', '사각형의 둘레를 구해 볼까요', '직사각형, 평행사변형, 마름모의 둘레는 어떻게 구할 수 있을까요?',
         '태민이가 직사각형 모양의 정원을 만들었어요.')
    step(s, 0, '만져 보기', '정원 설계도(실제 크기)')
    s.text('정원 설계도는 가로 8 cm, 세로 5 cm인 직사각형이에요. 가로의 길이를 가로, 세로의 길이를 세로라고 부르기도 해요.')
    R = rect(0, 0, 8, 5)
    f = Fig(8, 5, pad=.8)
    f.poly(R, F3, GREEN, 3.5)
    f.ticks(R, [1, 2, 1, 2])
    f.labels(R, {0: '8 cm', 1: '5 cm'}, BLUE)
    f.text((4, 2.5), '정원', 20, GREEN)
    real(s, f)
    assert nr(perim(R)) == 8 * 2 + 5 * 2 == (8 + 5) * 2 == 26
    a1 = blanks(s, lv, ['직사각형은 마주 보는 두 변의 길이가 ', (['같아요', '달라요'], 0), '.'])
    a1 += calc_rows(s, [('방법 1:  8 × 2 + 5 × 2 = (      ) cm', '26 cm'), ('방법 2:  (8 + 5) × 2 = (      ) cm', '26 cm')])
    step(s, 1, '평행사변형', '한 변 6 cm, 이웃한 변 4 cm')
    s.text('그림은 실제 크기예요. 자로 두 변의 길이를 재어 보세요.')
    f = Fig(8, math.sqrt(12), pad=.8, grid=False)
    f.poly(PAR3, F1, INK, 3.5)
    f.ticks(PAR3, [1, 2, 1, 2])
    f.labels(PAR3, {0: '6 cm', 1: '4 cm'}, BLUE)
    real(s, f)
    assert abs(math.dist(PAR3[1], PAR3[2]) - 4) < 1e-9 and nr(perim(PAR3)) == 20
    a2 = blanks(s, lv, ['평행사변형은 마주 보는 두 변의 길이가 ', (['같아요', '달라요'], 0), '.'])
    a2 += calc_rows(s, [('둘레:  (6 + 4) × 2 = (      ) cm', '20 cm')])
    step(s, 2, '마름모', '한 변 5 cm')
    f = Fig(8, 6, pad=.8, grid=False)
    f.poly(RH3, F4, INK, 3.5)
    f.ticks(RH3, [1, 1, 1, 1])
    f.labels(RH3, {0: '5 cm'}, BLUE)
    real(s, f)
    assert all(abs(math.dist(RH3[i], RH3[(i + 1) % 4]) - 5) < 1e-9 for i in range(4)) and nr(perim(RH3)) == 20
    a3 = blanks(s, lv, ['마름모는 네 변의 길이가 ', (['모두 같아요', '모두 달라요'], 0), '.'])
    a3 += calc_rows(s, [('둘레:  5 × (    ) = (      ) cm', '5×4=20 cm')])
    step(s, 3, '약속하기', '사각형의 둘레')
    a4 = blanks(s, lv, ['(직사각형의 둘레) = (가로) × 2 + (세로) × 2 = (가로 + ', (['세로', '가로', '둘레'], 0), ') × ', (['2', '4'], 0),
                        ' / (평행사변형의 둘레) = (한 변의 길이 + ', (['이웃한 변의 길이', '높이'], 0), ') × 2 / (마름모의 둘레) = (한 변의 길이) × ', (['4', '2'], 0)])
    step(s, 4, '확인하기', '둘레가 20 cm인 직사각형 그리기')
    s.text('모눈 한 칸은 1 cm예요(실제 크기). 파란 선분을 한 변으로 하여 둘레가 20 cm인 직사각형을 그려 보세요.')
    hint(s, lv, '둘레가 20 cm이면 가로와 세로의 합은 20 ÷ 2 = 10 (cm)예요.')
    real(s, draw_grid(10, 7, (2, 2, 6)))
    w2 = 20 // 2 - 6
    a5 = calc_rows(s, [('그린 직사각형의 다른 한 변은 몇 cm일까요?', '%d cm' % w2),
                       ('이웃한 두 변이 17 cm, 14 cm인 평행사변형의 둘레:  (17 + (    )) × (    ) = (      ) cm', '14, 2, %d cm' % ((17 + 14) * 2)),
                       ('한 변이 26 cm인 마름모의 둘레는 몇 cm일까요?', '%d cm' % (26 * 4)),
                       ('둘레가 58 cm인 직사각형의 한 변이 7 cm예요. 다른 한 변은 몇 cm일까요?', '%d cm' % (58 // 2 - 7))])
    ans = '3차시  ① %s  ② %s  ③ %s  ④ %s  ⑤ %s' % (', '.join(a1), ', '.join(a2), ', '.join(a3), ', '.join(a4), ', '.join(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '둘레가 더 짧은 것은')
        f = Fig(40, 13, 12, pad=.8, grid=False)
        R2 = rect(0, 0, 18, 11)
        P2 = [(21, 8.66), (36, 8.66), (41, 0), (26, 0)]
        f.poly(R2, F3)
        f.labels(R2, {0: '18 cm', 1: '11 cm'}, INK, 15)
        f.poly(P2, F1)
        f.labels(P2, {0: '15 cm', 1: '10 cm'}, INK, 15)
        f.text((9, 12.2), '직사각형', 15, GRAY)
        f.text((31, 10.2), '평행사변형', 15, GRAY)
        small(s, f, 120)
        a6 = calc_rows(s, [('직사각형의 둘레는?', '%d cm' % ((18 + 11) * 2)), ('평행사변형의 둘레는?', '%d cm' % ((15 + 10) * 2)),
                           ('둘레가 더 짧은 것은?', '평행사변형'), ('한 변이 14 cm인 마름모의 둘레는?', '%d cm' % (14 * 4))])
        s.ask('직사각형의 둘레를 (가로 + 세로) × 2로 구할 수 있는 까닭을 써 보세요.', blank=False)
        s.lines(2)
        ans += '  ⑥ %s / 까닭: 예) 마주 보는 두 변의 길이가 같아서 (가로+세로)가 2번 있어요.' % ', '.join(a6)
    return ans


def tb4(s, lv):
    head(s, 4, '개념 구축하기(O)', '1 cm²를 알아볼까요', '넓이를 정확하게 비교하고 나타내려면 어떤 단위를 사용하면 좋을까요?',
         '태민이가 벽을 만드는 데 더 넓은 벽돌을 사용하려고 해요.')
    step(s, 0, '대어 보기', '벽돌 가와 나 겹쳐 보기')
    s.text('벽돌 가와 나를 종이에 따라 그려 오린 다음, 나를 가 위에 모서리를 맞추어 겹쳐 보세요(그림은 실제 크기).')
    f = Fig(11, 3.6, pad=.6, grid=False)
    f.poly(rect(0, .6, 5, 2), '#F3DCC8', '#9A6B3E', 3)
    f.poly(rect(7, 0, 3, 3), '#BFD9F5', BLUE, 3)
    f.text((2.5, 3.1), '벽돌 가', 17)
    f.text((8.5, 3.45), '벽돌 나', 17)
    real(s, f)
    a1 = blanks(s, lv, ['직접 대어 보니 가와 나는 ', (['서로 남거나 모자라는 부분이 있어서', '꼭 맞게 겹쳐져서'], 0), ' 어느 벽돌이 얼마나 더 넓은지 ',
                        (['알기 어려워요', '바로 알 수 있어요'], 0), '.'])
    step(s, 1, '단위로 재기', '여러 가지 모양을 단위로')
    s.text('여러 가지 모양을 단위로 사용하여 벽돌 가와 나를 채웠어요(단위 모양은 이 자료에서 다시 그렸어요). 개수를 세어 표를 완성해 보세요.')
    f, cnt = tile_fig([('가', 0, 1, 5, 2), ('나', 7, 0, 3, 3)])
    small(s, f, 110)
    assert cnt == [[10, 9], [5, 4], [10, 9]]
    s.table([['단위 모양', '가(개)', '나(개)', '알게 된 점'], ['○ 원', '', '', '( 빈틈이 생겨요 / 빈틈이 없어요 )'],
             ['▭ 직사각형', '', '', '( 채우지 못한 곳이 남아요 / 꼭 맞게 채워져요 )'], ['□ 정사각형', '', '', '더 넓은 벽돌: (     )']], col_mm=[30, 22, 22, 106])
    a2 = '원 가 %d·나 %d(빈틈이 생겨요), 직사각형 가 %d·나 %d(채우지 못한 곳이 남아요), 정사각형 가 %d·나 %d(가가 더 넓어요)' % (cnt[0][0], cnt[0][1], cnt[1][0], cnt[1][1], cnt[2][0], cnt[2][1])
    step(s, 2, '말해 보기', '알맞은 단위')
    a3 = chooses(s, [('같은 벽돌 가를 재었는데 직사각형 단위로는 5개, 정사각형 단위로는 10개였어요. 까닭은?', ['단위의 모양과 크기가 달라서', '벽돌 가의 넓이가 바뀌어서'], 0),
                     ('넓이를 재는 단위로 가장 알맞은 모양은?', ['원', '직사각형(▭)', '정사각형'], 2)])
    step(s, 3, '약속하기', '1 cm²')
    f = Fig(1, 1, pad=1.1, grid=False)
    f.poly(rect(0, 0, 1, 1), '#9CC3F0', INK, 2.5)
    f.lab((0, 0), (1, 0), '1 cm', (.5, .5))
    f.lab((1, 0), (1, 1), '1 cm', (.5, .5))
    f.text((.5, 1.6), '1 cm²', 18, INK, weight='bold')
    real(s, f)
    a4 = blanks(s, lv, ['넓이의 단위로 한 변의 길이가 ', (['1 cm', '1 m', '10 cm'], 0), '인 정사각형의 넓이를 사용할 수 있어요. 이 넓이를 ',
                        (['1 cm²', '1 cm', '1 m²'], 0), '라 쓰고, ', (['1 제곱센티미터', '1 센티미터', '1 제곱미터'], 0), '라고 읽어요.'])
    step(s, 4, '확인하기', '1 cm²의 개수 세기')
    T4 = [(1, 1), (2, 1), (3, 1), (2, 2)]
    f = Fig(5, 4, pad=.5)
    f.cells(T4, F1)
    real(s, f)
    a5 = calc_rows(s, [('1 cm²가 (    )개 → 1 cm²의 (    )배 → 넓이는 (    ) cm²', '%d개, %d배, %d cm²' % ((len(T4),) * 3))])
    ans = '4차시  ① %s  ② %s  ③ %s  ④ %s  ⑤ %s' % (', '.join(a1), a2, ', '.join(a3), ', '.join(a4), a5[0])
    if lv == '도전형':
        step(s, 5, '도전하기', '넓이 구하고 비교하기')
        C15 = [(1, 1), (2, 1), (3, 1), (4, 1), (5, 1), (1, 2), (2, 2), (3, 2), (4, 2), (5, 2), (1, 3), (2, 3), (3, 3), (1, 4), (2, 4)]
        GA = [(1, 1), (2, 1), (3, 1), (1, 2), (2, 2), (3, 2), (1, 3)]
        NA = [(6, 1), (7, 1), (8, 1), (6, 2), (7, 2), (8, 2), (6, 3), (7, 3), (8, 3)]
        DA = [(11, 1), (12, 1), (11, 2), (12, 2), (11, 3), (12, 3)]
        f1 = Fig(7, 6, pad=.4)
        f1.cells(C15, F3)
        f2 = Fig(14, 5, pad=.4)
        f2.cells(GA, F1)
        f2.cells(NA, F2)
        f2.cells(DA, F3)
        for p, t in (((2.5, 4.5), '가'), ((7.5, 4.5), '나'), ((12, 4.5), '다')):
            f2.text(p, t, 18, INK, weight='bold')
        real(s, f1)
        order = ''.join(n for n, c in sorted([('가', len(GA)), ('나', len(NA)), ('다', len(DA))], key=lambda x: x[1]))
        assert order == '다가나'
        a6 = calc_rows(s, [('위 도형의 넓이는 몇 cm²일까요?', '%d cm²' % len(C15))])
        real(s, f2)
        a6 += calc_rows(s, [('가, 나, 다의 넓이를 쓰고, 넓이가 좁은 것부터 차례대로 써 보세요.', '가 %d, 나 %d, 다 %d cm² → 다, 가, 나' % (len(GA), len(NA), len(DA))),
                            ('6 cm²를 바르게 읽어 보세요.', '6 제곱센티미터')])
        s.text('넓이가 8 cm²인 도형을 서로 다른 모양으로 2개 색칠해 보세요(모눈 한 칸은 1 cm).')
        real(s, draw_grid(8, 5, pad=.4))
        ans += '  ⑥ %s, 8 cm² 도형 2개(예: 2×4 직사각형과 ㄱ자 모양)' % ', '.join(a6)
    return ans


def tb5(s, lv):
    head(s, 5, '개념 구축하기(O)', '직사각형의 넓이를 구해 볼까요', '직사각형과 정사각형의 넓이는 어떻게 구할 수 있을까요?',
         '태민이가 직사각형 모양의 문패를 만들었어요.')
    step(s, 0, '만져 보기', '문패 설계도의 1 cm² 세기')
    s.text('문패 설계도예요(실제 크기, 모눈 한 칸은 1 cm²). 1 cm²를 하나씩 세어 보세요.')
    C = [(x, y) for y in range(1, 4) for x in range(1, 5)]
    f = Fig(6, 5, pad=.5)
    f.cells(C, F4)
    real(s, f)
    a1 = calc_rows(s, [('1 cm²가 (    )개 → 1 cm²의 (    )배 → 넓이는 (    ) cm²', '%d개, %d배, %d cm²' % ((len(C),) * 3))])
    step(s, 1, '줄로 세기', '가로 한 줄에 몇 개씩 몇 줄')
    s.text('위 문패를 이번에는 한 줄씩 묶어 세어 보세요. 가로 4 cm, 세로 3 cm예요.')
    a2 = calc_rows(s, [('1 cm²가 가로 한 줄에 (    )개씩 (    )줄 → 4 × 3 = (    )(개) → 넓이는 (    ) cm²', '4개씩 3줄, 12개, 12 cm²')])
    step(s, 2, '말해 보기', '직사각형의 넓이 구하는 방법')
    a3 = blanks(s, lv, ['한 줄에 놓인 1 cm²의 수는 ', (['가로의 길이', '세로의 길이'], 0), '와 같고, 줄의 수는 ', (['세로의 길이', '가로의 길이'], 0),
                        '와 같아요. 그래서 직사각형의 넓이는 가로와 세로를 ', (['곱하여', '더하여'], 0), ' 구할 수 있어요.'])
    step(s, 3, '약속하기', '직사각형과 정사각형의 넓이')
    a4 = blanks(s, lv, ['(직사각형의 넓이) = (가로) × (', (['세로', '가로', '둘레'], 0), ') / 정사각형은 네 변의 길이가 ', (['모두 같으므로', '모두 다르므로'], 0),
                        ' (정사각형의 넓이) = (한 변의 길이) × (', (['한 변의 길이', '변의 수'], 0), ')'])
    step(s, 4, '확인하기', '그리고 넓이 구하기')
    s.text('모눈 한 칸은 1 cm예요(실제 크기). 가: 가로 4 cm, 세로 7 cm인 직사각형, 나: 한 변이 8 cm인 정사각형을 그려 보세요.')
    hint(s, lv, '(가로) × (세로)로 계산해요. 둘레와 헷갈리지 않게 해요.')
    real(s, draw_grid(13, 8, pad=.4))
    a5 = calc_rows(s, [('가의 넓이:  4 × 7 = (      ) cm²', '%d cm²' % area(rect(0, 0, 4, 7))), ('나의 넓이:  8 × 8 = (      ) cm²', '%d cm²' % area(rect(0, 0, 8, 8)))])
    ans = '5차시  ① %s  ② %s  ③ %s  ④ %s  ⑤ %s' % (a1[0], a2[0], ', '.join(a3), ', '.join(a4), ', '.join(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '수학익힘 문제')
        assert 400 // 16 == 25 and 400 % 16 == 0 and (70 // 2 - 22) == 13
        a6 = calc_rows(s, [('한 변이 10 cm인 정사각형의 넓이:  10 × (    ) = (      ) cm²', '10, 100 cm²'),
                           ('가로 21 cm, 세로 5 cm인 직사각형의 넓이는?', '105 cm²'),
                           ('가: 한 변이 12 cm인 정사각형, 나: 가로 17 cm, 세로 9 cm인 직사각형 — 더 넓은 것은?', '나 (가 144 cm², 나 153 cm²)'),
                           ('넓이가 400 cm²인 직사각형의 가로가 16 cm예요. 세로는?', '25 cm'),
                           ('한 변이 11 cm인 정사각형의 네 변을 3 cm씩 늘이면 넓이는?', '196 cm² (한 변 14 cm)'),
                           ('둘레가 70 cm, 세로가 22 cm인 직사각형의 가로와 넓이는?', '가로 13 cm, 넓이 %d cm²' % (13 * 22))])
        s.ask('넓이와 가로를 알 때 세로를 구하는 방법을 써 보세요.', blank=False)
        s.lines(1)
        ans += '  ⑥ %s / (세로) = (넓이) ÷ (가로)' % ', '.join(a6)
    return ans


def tb67(s, lv):
    head(s, '6~7', '개념 구축하기(O)', '1 cm²보다 더 큰 넓이의 단위를 알아볼까요', '넓은 장소나 지역의 넓이는 어떤 단위로 나타내면 좋을까요?',
         '태민이가 직사각형 모양의 거실 바닥을 만들었어요. 거실 바닥은 가로 800 cm, 세로 500 cm예요.')
    step(s, 0, '거실 바닥 재기', 'cm²로 나타내기')
    f = Fig(8, 5, 22, pad=1.1, grid=False)
    f.poly(rect(0, 0, 8, 5), '#F6E1B8', '#B08A1E', 3)
    f.labels(rect(0, 0, 8, 5), {0: '800 cm', 1: '500 cm'}, INK, 15)
    f.text((4, 2.5), '거실 바닥', 17, '#7A6A3A')
    small(s, f, 60)
    hint(s, lv, '8 × 5 = 40이고, 800 × 500은 40 뒤에 0을 4개 붙여요.')
    a1 = calc_rows(s, [('거실 바닥의 넓이:  800 × 500 = (            ) cm²', '%d cm²' % (800 * 500))])
    a1 += blanks(s, lv, ['넓은 곳의 넓이를 cm²로 나타내면 수가 너무 커서 쓰거나 읽기 ', (['불편해요', '편리해요'], 0),
                         '. 한 변의 길이가 1 m인 정사각형의 넓이를 ', (['1 m²', '1 cm²', '1 km²'], 0), '라 쓰고, ', (['1 제곱미터', '1 미터', '1 제곱센티미터'], 0), '라고 읽어요.'])
    step(s, 1, '1 m²와 1 cm²', '1 m²는 몇 cm²일까요')
    small(s, big_unit_fig('1 m²', '1 m = 100 cm', '1 cm²'), 55)
    hint(s, lv, '1 m² = 100 cm²가 아니에요. 가로 한 줄에 몇 개씩, 몇 줄인지 생각해요.')
    a2 = calc_rows(s, [('1 cm²가 가로 한 줄에 (      )개씩 (      )줄 → 100 × 100 = (          )(개) → 1 m² = (          ) cm²', '100개씩 100줄, 10000개, 10000 cm²')])
    step(s, 2, '교실 바닥 재기', '1 m² 종이 늘어놓기')
    s.text('넓이가 1 m²인 정사각형 종이를 교실 바닥에 늘어놓았어요. 종이가 가로로 7장, 세로로 9장 들어가요(그림은 줄여서 그렸어요).')
    f = Fig(7, 9, 16, pad=.4)
    f.cells([(x, y) for x in range(7) for y in range(9)], '#F4FAF2')
    small(s, f, 32)
    a3 = calc_rows(s, [('1 m² 종이가 한 줄에 (    )장씩 (    )줄 → 교실 바닥의 넓이는 7 × 9 = (      ) m²', '7장씩 9줄, %d m²' % (7 * 9))])
    step(s, 3, '1 km²', '지역의 넓이')
    s.text('서울특별시의 넓이는 605000000 m², 세종특별자치시의 넓이는 465000000 m²예요(공공데이터포털 2024).')
    a4 = chooses(s, [('605000000 m²를 바르게 읽은 것은?', ['육억 오백만 제곱미터', '육천오백만 제곱미터', '육억 오천만 제곱미터'], 0),
                     ('465000000 m²를 바르게 읽은 것은?', ['사천육백오십만 제곱미터', '사억 육천오백만 제곱미터', '사억 육백오십만 제곱미터'], 1)])
    a4 += blanks(s, lv, ['수가 너무 커서 불편하니, 한 변의 길이가 1 km인 정사각형의 넓이를 ', (['1 km²', '1 m²', '1 km'], 0), '라 쓰고, ',
                         (['1 제곱킬로미터', '1 킬로미터', '1 제곱미터'], 0), '라고 읽어요.'])
    small(s, big_unit_fig('1 km²', '1 km = 1000 m', '1 m²'), 55)
    a4 += calc_rows(s, [('1 m²가 가로 한 줄에 (        )개씩 (        )줄 → 1 km² = (              ) m²', '1000개씩 1000줄, 1000000 m²')])
    step(s, 4, '확인하기', '여러 가지 단위')
    hint(s, lv, '1 m² = 10000 cm², 1 km² = 1000000 m²')
    assert 30000 // 10000 == 3 and 12 * 1000000 == 12000000
    a5 = calc_rows(s, [('칠판의 넓이 30000 cm² = (      ) m²', '3 m²'), ('호수의 넓이 약 12 km² = 약 (              ) m²', '12000000 m²')])
    a5 += chooses(s, [('우리 학교 운동장의 넓이는 약 1750', ['cm²', 'm²', 'km²'], 1), ('수첩의 넓이는 96', ['cm²', 'm²', 'km²'], 0),
                      ('덕유산 국립 공원의 넓이는 약 232', ['cm²', 'm²', 'km²'], 2)])
    ans = '6~7차시  ① %s  ② %s  ③ %s  ④ %s  ⑤ %s' % (', '.join(a1), a2[0], a3[0], ', '.join(a4), ', '.join(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '넓이의 단위 사이의 관계')
        assert 58000000 < 60 * 1000000 and 104 * 10000 > 1000000 and 7 * 5 == 35 and 3 * 2 == 6
        a6 = calc_rows(s, [('5 m² = (          ) cm²     70000 cm² = (     ) m²', '50000, 7'),
                           ('9 km² = (              ) m²     2000000 m² = (     ) km²', '9000000, 2'),
                           ('58000000 m² (  >, =, <  ) 60 km²     104 m² (  >, =, <  ) 1000000 cm²', '<, >'),
                           ('가로 7000 m, 세로 5 km인 직사각형 모양 땅의 넓이는 몇 km²일까요?', '35 km²'),
                           ('가로 300 cm, 세로 2 m인 직사각형 모양 전시대의 넓이는 몇 m²일까요?', '6 m²'),
                           ('단위를 잘못 사용한 것을 찾아 바르게 고쳐 보세요.  ㉠ 도서관 휴게실 38 m²  ㉡ 학교 운동장 420 cm²  ㉢ 제주특별자치도 약 1850 km²', '㉡ → 420 m²')])
        s.ask('1 m² = 100 cm²라고 생각한 친구에게 해 줄 말을 써 보세요.', blank=False)
        s.lines(2)
        ans += '  ⑥ %s / 예) 1 m² 안에는 1 cm²가 100개씩 100줄이라 10000 cm²예요.' % ', '.join(a6)
    return ans


PAR89 = [(1, 4), (6, 4), (8, 1), (3, 1)]
PARC = [(1, 4), (6, 4), (9, 1), (4, 1)]


def tb89(s, lv):
    head(s, '8~9', '개념 구축하기(O)', '평행사변형의 넓이를 구해 볼까요', '평행사변형의 넓이는 어떻게 구할 수 있을까요?',
         '태민이가 화장실에 평행사변형 모양의 타일을 붙이려고 해요.')
    step(s, 0, '밑변과 높이', '높이 긋기')
    s.text('파란 변을 밑변으로 하여, 마주 보는 변까지 수직인 선분(높이)을 삼각자로 그어 보세요(실제 크기, 모눈 한 칸은 1 cm).')
    real(s, height_fig(PAR89, (0, 1), 9, 5))
    h0 = nr(line_dist(PAR89[2], PAR89[0], PAR89[1]))
    a1 = blanks(s, lv, ['평행사변형에서 평행한 두 변을 ', (['밑변', '높이', '대각선'], 0), '이라 하고, 두 밑변 사이의 거리를 ', (['높이', '둘레', '밑변'], 0), '라고 합니다.'])
    a1 += calc_rows(s, [('이 평행사변형의 높이는 몇 cm일까요?', '%d cm' % h0)])
    step(s, 1, '높이 긋기', '여러 가지 평행사변형')
    s.text('평행사변형 가, 나, 다에서 파란 변을 밑변으로 할 때의 높이를 그어 보세요. 다는 밑변을 늘인 점선까지 그어도 돼요.')
    hint(s, lv, '밑변이 꼭 아래에 있는 변은 아니에요. 나는 밑변이 세로로 놓여 있어서 높이를 가로로 그어요.')
    GA, NA, DA = [(1, 4), (5, 4), (6, 1), (2, 1)], [(1, 1), (1, 4), (5, 5), (5, 2)], [(1, 4), (4, 4), (8, 1), (5, 1)]
    real(s, side_by_side([height_fig(GA, (2, 3), 7, 5, '가'), height_fig(NA, (0, 1), 6, 6, '나')]))
    real(s, height_fig(DA, (0, 1), 9, 5, '다', ext=True))
    hs = [nr(line_dist(GA[0], GA[2], GA[3])), nr(line_dist(NA[2], NA[0], NA[1])), nr(line_dist(DA[2], DA[0], DA[1]))]
    assert hs == [3, 4, 3]
    a2 = calc_rows(s, [('높이:  가 (    ) cm,  나 (    ) cm,  다 (    ) cm', '가 %d, 나 %d, 다 %d cm' % tuple(hs))])
    a2 += blanks(s, lv, ['다처럼 높이는 평행사변형의 ', (['바깥에 그을 수도 있어요', '안쪽에만 그을 수 있어요'], 0), '. 평행한 두 변 사이의 거리는 어디에서 재어도 ', (['같아요', '달라요'], 0), '.'])
    step(s, 2, '세어 보기', '1 cm²의 개수')
    s.text('밑변 5 cm, 높이 3 cm인 평행사변형이에요(실제 크기). 온전한 칸과 반 칸을 세어 보세요.')
    f = Fig(10, 5, pad=.5)
    f.poly(PARC, F1, INK, 3)
    real(s, f)
    full, half = cells_of(PARC)
    assert (full, half) == (12, 6) and full + half / 2 == area(PARC) == 15
    a3 = calc_rows(s, [('1 cm² (    )개, 반 칸 (    )개 → 반 칸은 1 cm² (    )개와 같아요 → 넓이는 (      ) cm²', '%d개, %d개, %d개, %d cm²' % (full, half, half // 2, nr(area(PARC))))])
    a3 += blanks(s, lv, ['이렇게 하나씩 세는 방법은 ', (['시간이 오래 걸리고 반 칸을 모으기 불편해요', '언제나 가장 빨라요'], 0), '.'])
    step(s, 3, '약속하기', '잘라서 직사각형 만들기')
    s.text('같은 평행사변형을 빨간 높이를 따라 잘라 왼쪽 조각을 오른쪽에 붙였어요. 점선은 옮긴 조각이에요. 만든 직사각형을 살펴보세요.')
    real(s, cut_fig([([(4, 1), (9, 1), (6, 4), (4, 4)], F1), ([(1, 4), (4, 4), (4, 1)], F2)], [[(6, 4), (9, 4), (9, 1)]], None, 11, 5,
                    marks=[((4, 1), (4, 4), RED, '6 4')], labs=[((1, 4), (6, 4), '밑변 5 cm', (3, 2), BLUE)]))
    a4 = blanks(s, lv, ['만든 직사각형의 가로는 평행사변형의 ', (['밑변의 길이', '높이', '이웃한 변의 길이'], 0), '와 같고, 세로는 평행사변형의 ', (['높이', '밑변의 길이', '둘레'], 0),
                        '와 같아요. (평행사변형의 넓이) = (', (['밑변의 길이', '이웃한 변의 길이'], 0), ') × (', (['높이', '밑변의 길이'], 0), ')'])
    a4 += calc_rows(s, [('5 × 3 = (      ) cm²', '15 cm²')])
    step(s, 4, '확인하기', '평행사변형의 넓이')
    a5 = calc_rows(s, [('밑변 4 cm, 높이 7 cm → (      ) cm²     밑변 5 m, 높이 6 m → (      ) m²', '28 cm², 30 m²'),
                       ('밑변 6 cm, 넓이 24 cm² → 6 × □ = 24 → 높이 (    ) cm', '4 cm'),
                       ('높이 3 m, 넓이 18 m² → □ × 3 = 18 → 밑변 (    ) m', '6 m')])
    s.text('평행선 사이에 있는 평행사변형 가, 나, 다의 넓이를 비교해 보세요(그림은 줄여서 그렸어요).')
    f = Fig(19, 7, 22, pad=.5)
    PP = [[(1, 6), (4, 6), (5, 1), (2, 1)], [(6, 6), (9, 6), (13, 1), (10, 1)], [(15, 6), (18, 6), (17, 1), (14, 1)]]
    for P, fl, nm in zip(PP, (F1, F2, F3), '가나다'):
        f.poly(P, fl)
        f.text(((P[0][0] + P[2][0]) / 2, 3.5), nm, 17, weight='bold')
    for y in (1, 6):
        f.seg((0, y), (19, y), GRAY, 1.5, '6 5')
    for x in (2, 10, 15):
        f.seg((x, 1), (x, 6), RED, 2.5)
    for P in PP:
        f.lab(P[0], P[1], '3 cm', (P[0][0] + 1.5, 3), INK, size=14)
    f.text((.9, 3.5), '5 cm', 14, RED)
    small(s, f, 140)
    ars = [nr(area(P)) for P in PP]
    assert ars == [15, 15, 15]
    a5 += calc_rows(s, [('가 (     ) cm², 나 (     ) cm², 다 (     ) cm²', '모두 15 cm²')])
    a5 += blanks(s, lv, ['밑변의 길이와 높이가 각각 같으면 넓이도 ', (['같아요', '달라요'], 0), '.'])
    ans = '8~9차시  ① %s  ② %s  ③ %s  ④ %s  ⑤ %s' % (', '.join(a1), ', '.join(a2), ', '.join(a3), ', '.join(a4), ', '.join(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '수학익힘 문제')
        assert 165 // 15 == 11 and 10 * 14 == 140 and 6 * 22 == 132
        a6 = calc_rows(s, [('평행사변형을 잘라 만든 직사각형의 가로가 5 cm, 세로가 7 cm예요. 평행사변형의 넓이는?', '35 cm²'),
                           ('밑변 18 cm, 높이 12 cm인 평행사변형의 넓이는?', '%d cm²' % (18 * 12)),
                           ('더 좁은 것은?  ㉠ 밑변 10 m, 높이 14 m  ㉡ 밑변 6 m, 높이 22 m', '㉡ (㉠ 140 m², ㉡ 132 m²)'),
                           ('넓이가 165 cm², 밑변이 15 cm인 평행사변형의 높이는?', '11 cm')])
        s.text('모눈 한 칸은 1 cm예요. 점을 이어 넓이가 10 cm²인 평행사변형을 서로 다른 모양으로 2개 그려 보세요.')
        real(s, draw_grid(12, 7, pad=.4))
        s.ask('넓이가 10 cm²가 되도록 밑변과 높이를 어떻게 정했는지 써 보세요.', blank=False)
        s.lines(1)
        ans += '  ⑥ %s, 그리기 예) 밑변 5 cm·높이 2 cm, 밑변 2 cm·높이 5 cm(밑변×높이=10)' % ', '.join(a6)
    return ans


TRI = [(1, 5), (9, 5), (3, 1)]


def tb1011(s, lv):
    head(s, '10~11', '개념 구축하기(O)', '삼각형의 넓이를 구해 볼까요', '삼각형의 넓이는 어떻게 구할 수 있을까요?',
         '태민이가 창고에 삼각형 모양의 창문을 만들었어요.')
    step(s, 0, '밑변과 높이', '창문의 높이 긋기')
    s.text('파란 변을 밑변으로 할 때, 마주 보는 꼭짓점에서 밑변에 수직인 선분(높이)을 그어 보세요(실제 크기).')
    T0 = [(1, 5), (7, 5), (3, 1)]
    real(s, height_fig(T0, (0, 1), 8, 6))
    a1 = blanks(s, lv, ['삼각형에서 한 변을 밑변이라고 하면, 그 밑변과 마주 보는 ', (['꼭짓점', '변'], 0), '에서 밑변에 ', (['수직으로', '비스듬하게'], 0), ' 그은 선분의 길이를 높이라고 합니다.'])
    a1 += calc_rows(s, [('이 삼각형의 높이는 몇 cm일까요?', '%d cm' % nr(line_dist(T0[2], T0[0], T0[1])))])
    step(s, 1, '높이 긋기', '여러 가지 삼각형')
    s.text('삼각형 가, 나, 다에서 파란 변을 밑변으로 할 때의 높이를 그어 보세요.')
    hint(s, lv, '가는 직각삼각형이라 한 변이 곧 높이예요. 나는 밑변을 늘인 점선까지 그어요. 다는 밑변이 세로로 놓여 있어요.')
    GA, NA, DA = [(1, 1), (1, 5), (5, 5)], [(3, 5), (6, 5), (1, 1)], [(1, 1), (1, 5), (5, 3)]
    real(s, side_by_side([height_fig(GA, (1, 2), 6, 6, '가'), height_fig(NA, (0, 1), 7, 6, '나', ext=True), height_fig(DA, (0, 1), 6, 6, '다')], .3))
    a2 = blanks(s, lv, ['나처럼 둔각삼각형은 높이가 삼각형 ', (['밖에', '안에만'], 0), ' 있을 수 있어요. 한 삼각형에서 밑변이 될 수 있는 변은 ', (['세 변 모두', '아래에 있는 변 하나'], 0),
                        '이고, 밑변에 따라 높이도 ', (['달라져요', '언제나 같아요'], 0), '.'])
    step(s, 2, '붙여 보기', '똑같은 삼각형 2개')
    s.text('밑변 8 cm, 높이 4 cm인 똑같은 삼각형 2개 중 하나를 반 바퀴 돌려 붙였더니 빨간 선의 평행사변형이 되었어요.')
    PAR = [(1, 5), (9, 5), (11, 1), (3, 1)]
    real(s, cut_fig([(TRI, F1), ([(9, 5), (11, 1), (3, 1)], F2)], [], PAR, 12, 6,
                    marks=[((3, 1), (3, 5), RED, '5 4')], labs=[((1, 5), (9, 5), '밑변 8 cm', (5, 3), BLUE)]))
    assert area(PAR) == 2 * area(TRI) == 32
    a3 = blanks(s, lv, ['만든 평행사변형의 밑변의 길이는 삼각형의 ', (['밑변의 길이', '높이'], 0), '와 같고, 높이는 삼각형의 ', (['높이', '밑변의 길이'], 0),
                        '와 같아요. 삼각형의 넓이는 평행사변형의 넓이의 ', (['반', '2배'], 0), '이에요.'])
    a3 += calc_rows(s, [('삼각형의 넓이:  8 × 4 ÷ 2 = (      ) cm²', '%d cm²' % nr(area(TRI)))])
    step(s, 3, '약속하기', '높이의 반에서 잘라 붙이기')
    s.text('같은 삼각형을 높이의 반이 되는 곳(회색 점선)에서 잘라 위 조각을 반 바퀴 돌려 오른쪽에 붙였어요.')
    top, bot = [(3, 1), (2, 3), (6, 3)], [(2, 3), (6, 3), (9, 5), (1, 5)]
    P2 = [(1, 5), (9, 5), (10, 3), (2, 3)]
    f = cut_fig([(bot, F1), (top, F2)], [[(6, 3), (10, 3), (9, 5)]], P2, 11, 6, marks=[((0, 3), (11, 3), GRAY, '4 4')])
    real(s, f)
    assert area(P2) == area(TRI) and nr(line_dist(P2[2], P2[0], P2[1])) == 2
    a4 = calc_rows(s, [('만든 평행사변형의 밑변 (    ) cm, 높이 (    ) cm → 8 × 2 = (      ) cm²', '8 cm, 2 cm, 16 cm²')])
    a4 += blanks(s, lv, ['높이는 삼각형 높이의 ', (['반', '2배'], 0), '이에요. (삼각형의 넓이) = (', (['밑변의 길이', '둘레'], 0), ') × (', (['높이', '밑변의 길이'], 0), ') ÷ ', (['2', '4'], 0)])
    step(s, 4, '확인하기', '삼각형의 넓이')
    hint(s, lv, '밑변을 모르면 □로 놓고 식을 세워요: □ × 4 ÷ 2 = 12')
    a5 = calc_rows(s, [('밑변 7 cm, 높이 6 cm → (      ) cm²     밑변 5 m, 높이 8 m → (      ) m²', '21 cm², 20 m²'),
                       ('높이 4 cm, 넓이 12 cm² → □ × 4 ÷ 2 = 12 → 밑변 (    ) cm', '6 cm'),
                       ('밑변 6 m, 넓이 15 m² → 6 × □ ÷ 2 = 15 → 높이 (    ) m', '5 m')])
    s.text('모눈 위 삼각형 가, 나, 다의 넓이를 비교해 보세요(한 칸은 1 cm, 그림은 줄여서 그렸어요).')
    TT = [[(1, 5), (6, 5), (3, 1)], [(7, 5), (12, 5), (7, 1)], [(13, 5), (18, 5), (20, 1)]]
    f = Fig(21, 6, 22, pad=.4)
    for P, fl, nm, at in zip(TT, (F1, F2, F3), '가나다', ((3.4, 3.9), (8.6, 3.9), (17, 4.2))):
        f.poly(P, fl)
        f.text(at, nm, 16, weight='bold')
    small(s, f, 150)
    ars = [nr(area(P)) for P in TT]
    assert ars == [10, 10, 10]
    a5 += calc_rows(s, [('가 (     ) cm², 나 (     ) cm², 다 (     ) cm²', '모두 10 cm² (밑변 5 cm, 높이 4 cm)')])
    a5 += blanks(s, lv, ['밑변의 길이와 높이가 각각 같으면 넓이도 ', (['같아요', '달라요'], 0), '.'])
    ans = '10~11차시  ① %s  ② %s  ③ %s  ④ %s  ⑤ %s' % (', '.join(a1), ', '.join(a2), ', '.join(a3), ', '.join(a4), ', '.join(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '수학익힘 문제')
        assert 54 * 2 // 9 == 12 and 12 * 4 // 8 == 6
        a6 = calc_rows(s, [('밑변 10 cm, 높이 4 cm인 삼각형:  10 × 4 ÷ 2 = (      ) cm²', '20 cm²'),
                           ('넓이가 54 cm², 밑변이 9 cm인 삼각형의 높이는?', '12 cm'),
                           ('밑변 6 cm, 높이 8 cm인 삼각형을 높이의 반에서 잘라 평행사변형을 만들었어요. 잘못 설명한 사람은?  유라: “만든 평행사변형의 높이는 8 cm야.”  진환: “만든 평행사변형의 밑변은 6 cm야.”', '유라 (높이는 4 cm)'),
                           ('한 삼각형에서 밑변 12 cm일 때 높이 4 cm예요. 밑변 8 cm일 때 높이는?', '6 cm')])
        s.text('점을 이어 넓이가 6 cm²인 삼각형을 서로 다른 모양으로 2개 그려 보세요(모눈 한 칸은 1 cm).')
        real(s, draw_grid(10, 7, pad=.4))
        s.ask('같은 삼각형은 어느 변을 밑변으로 해도 넓이가 같은 까닭을 써 보세요.', blank=False)
        s.lines(1)
        ans += '  ⑥ %s, 그리기 예) 밑변 4 cm·높이 3 cm, 밑변 6 cm·높이 2 cm(밑변×높이=12)' % ', '.join(a6)
    return ans


RH12 = [(1, 3), (4, 1), (7, 3), (4, 5)]


def tb12(s, lv):
    head(s, 12, '개념 구축하기(O)', '마름모의 넓이를 구해 볼까요', '마름모의 넓이는 어떻게 구할 수 있을까요?',
         '태민이가 마름모 모양의 텃밭을 만들었어요.')
    step(s, 0, '둘러싸기', '마름모를 둘러싸는 직사각형')
    s.text('텃밭 설계도(실제 크기)의 마름모를 둘러싸는 직사각형을 점선으로 그렸어요. 귀퉁이 삼각형 4개를 오려 마름모 위에 놓아 보세요.')
    f = Fig(8, 6, pad=.5)
    f.poly(rect(1, 1, 6, 4), F4, ORG, 2.5, '6 5')
    f.poly(RH12, F3, INK, 3)
    f.seg((1, 3), (7, 3), BLUE, 3)
    f.seg((4, 1), (4, 5), RED, 3)
    real(s, f)
    d1, d2 = math.dist(RH12[0], RH12[2]), math.dist(RH12[1], RH12[3])
    assert (d1, d2) == (6, 4) and area(rect(1, 1, 6, 4)) == 2 * area(RH12) == 24
    a1 = calc_rows(s, [('둘러싸는 직사각형의 가로는 한 대각선의 길이인 (    ) cm, 세로는 다른 대각선의 길이인 (    ) cm예요. 직사각형의 넓이는 마름모 넓이의 (    )배예요.', '6 cm, 4 cm, 2배'),
                       ('마름모의 넓이:  6 × 4 ÷ 2 = (      ) cm²', '12 cm²')])
    step(s, 1, '잘라 보기', '대각선을 따라 잘라 붙이기')
    s.text('마름모를 파란 대각선을 따라 잘라 위 조각을 아래 조각의 오른쪽에 붙였어요(점선이 옮긴 조각).')
    P2 = [(1, 3), (7, 3), (10, 5), (4, 5)]
    real(s, cut_fig([([(1, 3), (7, 3), (4, 5)], F3), ([(1, 3), (4, 1), (7, 3)], F4)], [[(4, 5), (7, 3), (10, 5)]], P2, 11, 6,
                    marks=[((1, 3), (7, 3), BLUE, None), ((4, 1), (4, 5), RED, '5 4')]))
    assert area(P2) == area(RH12)
    a2 = calc_rows(s, [('평행사변형의 밑변은 한 대각선(파란색)인 (    ) cm, 높이는 다른 대각선(빨간색)의 반인 (    ) cm → 6 × 2 = (      ) cm²', '6 cm, 2 cm, 12 cm²')])
    step(s, 2, '말해 보기', '두 방법 비교하기')
    a3 = blanks(s, lv, ['둘러싸는 직사각형으로 구해도 6 × 4 ÷ 2, 잘라서 평행사변형으로 구해도 6 × (4 ÷ 2)예요. 두 방법 모두 ',
                        (['두 대각선의 길이를 곱한 다음 2로 나눈 것', '두 대각선의 길이를 더한 것'], 0), '과 같아요.'])
    step(s, 3, '약속하기', '마름모의 넓이')
    a4 = blanks(s, lv, ['(마름모의 넓이) = (한 대각선의 길이) × (', (['다른 대각선의 길이', '한 변의 길이', '높이'], 0), ') ÷ ', (['2', '4'], 0)])
    step(s, 4, '확인하기', '마름모의 넓이 구하기')
    f = Fig(21, 9, 20, pad=.4, grid=False)
    f.poly([(1, 4.5), (5, 2), (9, 4.5), (5, 7)], F3)
    f.poly([(12, 4.5), (16.5, 1.5), (21, 4.5), (16.5, 7.5)], F4)
    for a, b, c in (((1, 4.5), (9, 4.5), BLUE), ((5, 2), (5, 7), RED), ((12, 4.5), (21, 4.5), BLUE), ((16.5, 1.5), (16.5, 7.5), RED)):
        f.seg(a, b, c, 2)
    for p, t, c in (((3, 4), '8 cm', BLUE), ((5.9, 6.2), '5 cm', RED), ((14, 4), '9 m', BLUE), ((17.3, 6.6), '6 m', RED), ((5, 8.3), '가', INK), ((16.5, 8.6), '나', INK)):
        f.text(p, t, 15, c)
    small(s, f, 120)
    a5 = calc_rows(s, [('가:  8 × 5 ÷ 2 = (      ) cm²', '%d cm²' % (8 * 5 // 2)), ('나:  9 × 6 ÷ 2 = (      ) m²', '%d m²' % (9 * 6 // 2))])
    ans = '12차시  ① %s  ② %s  ③ %s  ④ %s  ⑤ %s' % (', '.join(a1), a2[0], ', '.join(a3), ', '.join(a4), ', '.join(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '수학익힘 문제')
        assert 16 * 11 // 2 == 88 and 65 * 2 // 13 == 10 and 17 * 8 // 2 == 68 and 12 * 12 // 2 == 72 and 40 * 50 // 2 == 1000
        a6 = calc_rows(s, [('마름모를 잘라 만든 평행사변형의 밑변이 10 cm, 높이가 4 cm예요(마름모의 대각선 10 cm, 8 cm). 마름모의 넓이:  10 × 8 ÷ 2 = (      ) cm²', '40 cm²'),
                           ('대각선이 16 cm, 11 cm인 마름모의 넓이는?', '88 cm²'),
                           ('넓이가 65 cm², 한 대각선이 13 cm인 마름모의 다른 대각선은?', '10 cm'),
                           ('더 넓은 마름모는?  대각선 17 cm, 8 cm  /  대각선 12 cm, 12 cm', '12 cm, 12 cm (68 cm² < 72 cm²)'),
                           ('가로 40 cm, 세로 50 cm인 직사각형 종이의 네 변의 가운데를 이어 마름모 모양 가오리연을 만들었어요. 연의 넓이는?', '1000 cm²')])
        s.text('점을 이어 넓이가 16 cm²인 마름모를 그려 보세요(모눈 한 칸은 1 cm).')
        real(s, draw_grid(10, 8, pad=.4))
        ans += '  ⑥ %s, 그리기 예) 대각선 8 cm·4 cm (곱이 32), 한 변 4 cm인 정사각형도 돼요' % ', '.join(a6)
    return ans


TZ = [(1, 5), (9, 5), (5, 1), (3, 1)]


def tb1314(s, lv):
    head(s, '13~14', '개념 구축하기(O)', '사다리꼴의 넓이를 구해 볼까요', '사다리꼴의 넓이는 어떻게 구할 수 있을까요?',
         '태민이가 수영장에 사다리꼴 모양의 그늘막을 만들었어요.')
    step(s, 0, '밑변과 높이', '사다리꼴의 높이 긋기')
    s.text('사다리꼴 가, 나에서 파란 변과 평행한 변 사이에 높이를 그어 보세요(실제 크기).')
    NA = [(2, 4), (4, 4), (8, 1), (1, 1)]
    real(s, height_fig(TZ, (0, 1), 10, 6, '가'))
    real(s, height_fig(NA, (0, 1), 9, 5, '나'))
    hs = [nr(line_dist(TZ[2], TZ[0], TZ[1])), nr(line_dist(NA[2], NA[0], NA[1]))]
    a1 = blanks(s, lv, ['사다리꼴에서 평행한 두 변을 ', (['밑변', '높이'], 0), '이라 하고, 한 밑변을 윗변, 다른 밑변을 아랫변이라고 합니다. 두 밑변 사이의 거리를 ', (['높이', '대각선'], 0), '라고 합니다.'])
    a1 += calc_rows(s, [('가의 높이 (    ) cm, 나의 높이 (    ) cm', '가 %d cm, 나 %d cm' % tuple(hs))])
    a1 += blanks(s, lv, ['나처럼 윗변이 아랫변보다 ', (['길 수도 있어요', '길 수 없어요'], 0), '.'])
    step(s, 1, '붙여 보기', '똑같은 사다리꼴 2개')
    s.text('윗변 2 cm, 아랫변 8 cm, 높이 4 cm인 똑같은 사다리꼴 2개 중 하나를 반 바퀴 돌려 붙였더니 빨간 선의 평행사변형이 되었어요(실제 크기).')
    PAR = [(1, 5), (11, 5), (13, 1), (3, 1)]
    real(s, cut_fig([(TZ, F6), ([(9, 5), (11, 5), (13, 1), (5, 1)], F4)], [], PAR, 14, 6, marks=[((4, 1), (4, 5), RED, '5 4')]))
    assert area(PAR) == 2 * area(TZ) == 40
    a2 = calc_rows(s, [('만든 평행사변형의 밑변은 사다리꼴의 (윗변 + 아랫변)인 (    ) cm, 높이는 (    ) cm예요.', '10 cm, 4 cm')])
    a2 += blanks(s, lv, ['사다리꼴의 넓이는 평행사변형 넓이의 ', (['반', '2배'], 0), '이에요.'])
    a2 += calc_rows(s, [('사다리꼴의 넓이:  (2 + 8) × 4 ÷ 2 = (      ) cm²', '%d cm²' % nr(area(TZ)))])
    step(s, 2, '잘라 보기', '높이의 반에서 잘라 붙이기')
    s.text('같은 사다리꼴을 높이의 반(회색 점선)에서 잘라 위 조각을 반 바퀴 돌려 오른쪽에 붙였어요.')
    P2 = [(1, 5), (11, 5), (12, 3), (2, 3)]
    real(s, cut_fig([([(2, 3), (7, 3), (9, 5), (1, 5)], F6), ([(3, 1), (5, 1), (7, 3), (2, 3)], F4)], [[(9, 5), (11, 5), (12, 3), (7, 3)]], P2, 13, 6,
                    marks=[((0, 3), (13, 3), GRAY, '4 4')]))
    assert area(P2) == area(TZ)
    a3 = calc_rows(s, [('만든 평행사변형의 밑변 (    ) cm, 높이 (    ) cm → 10 × 2 = (      ) cm²', '10 cm, 2 cm, 20 cm²')])
    step(s, 3, '약속하기', '사다리꼴의 넓이')
    a4 = blanks(s, lv, ['(사다리꼴의 넓이) = (윗변의 길이 + ', (['아랫변의 길이', '높이', '대각선의 길이'], 0), ') × (', (['높이', '윗변의 길이'], 0), ') ÷ ', (['2', '4'], 0)])
    assert (4 + 5) * 6 // 2 == 27 and (7 + 5) * 8 // 2 == 48 and 45 * 2 // 18 == 5 and 30 * 2 // 10 == 6
    a4 += calc_rows(s, [('윗변 4 cm, 아랫변 5 cm, 높이 6 cm → (      ) cm²     윗변 7 m, 아랫변 5 m, 높이 8 m → (      ) m²', '27 cm², 48 m²'),
                        ('윗변 12 cm, 아랫변 6 cm, 넓이 45 cm² → (12 + 6) × □ ÷ 2 = 45 → 높이 (    ) cm', '5 cm'),
                        ('윗변 4 m, 아랫변 6 m, 넓이 30 m² → 높이 (    ) m', '6 m')])
    step(s, 4, '여러 방법', '여러 가지 방법으로 넓이 구하기')
    s.text('모눈 위 사다리꼴(윗변 2 cm, 아랫변 6 cm, 높이 4 cm)이에요(실제 크기). 세 가지 방법으로 넓이를 구해 보세요.')
    RTZ = [(1, 1), (3, 1), (7, 5), (1, 5)]
    f1, f2, f3 = Fig(8, 6, pad=.3), Fig(8, 6, pad=.3), Fig(8, 6, pad=.3)
    f1.poly([(1, 1), (3, 1), (1, 5)], F1)
    f1.poly([(3, 1), (7, 5), (1, 5)], F2)
    f2.poly(rect(1, 1, 2, 4), F1)
    f2.poly([(3, 1), (7, 5), (3, 5)], F2)
    f3.poly(RTZ, F3)
    f3.poly([(3, 1), (7, 1), (7, 5)], '#fff', GRAY, 2.2, '5 4')
    for f, t in ((f1, '방법 1'), (f2, '방법 2'), (f3, '방법 3')):
        f.text((4, 5.6), t, 15, GRAY)
    real(s, side_by_side([f1, f2, f3], .3))
    assert area(RTZ) == 16 == area(rect(1, 1, 6, 4)) - 8
    a5 = calc_rows(s, [('방법 1 (삼각형 2개):  2 × 4 ÷ 2 = (    ),  6 × 4 ÷ 2 = (    ) → (      ) cm²', '4, 12, 16 cm²'),
                       ('방법 2 (직사각형과 삼각형):  2 × 4 = (    ),  4 × 4 ÷ 2 = (    ) → (      ) cm²', '8, 8, 16 cm²'),
                       ('방법 3 (둘러싼 직사각형에서 빼기):  6 × 4 = (    ),  24 − (    ) = (      ) cm²', '24, 8, 16 cm²')])
    a5 += blanks(s, lv, ['구한 방법은 달라도 넓이는 ', (['같아요', '달라요'], 0), '.'])
    ans = '13~14차시  ① %s  ② %s  ③ %s  ④ %s  ⑤ %s' % (', '.join(a1), ', '.join(a2), a3[0], ', '.join(a4), ', '.join(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '수학익힘 문제')
        G, N = [(2, 1), (6, 1), (1, 6)], [(6, 1), (9, 6), (1, 6)]
        assert area(G) == 10 and area(N) == 20 and (4 + 8) * 5 / 2 == 30 and 70 * 2 // 14 == 10
        f = Fig(10, 7, 24, pad=.5)
        f.poly(G, F1)
        f.poly(N, F2)
        f.text((3, 2.6), '가', 15, weight='bold')
        f.text((5.6, 4.4), '나', 15, weight='bold')
        f.lab((2, 1), (6, 1), '4 cm', (5, 4), size=14)
        f.lab((1, 6), (9, 6), '8 cm', (5, 4), size=14)
        small(s, f, 60)
        a6 = calc_rows(s, [('윗변 4 cm, 아랫변 8 cm, 높이 5 cm인 사다리꼴을 대각선으로 나누었어요. 가 (    ) cm², 나 (    ) cm² → 사다리꼴 (    ) cm²', '가 10, 나 20, 사다리꼴 30 cm²'),
                           ('넓이가 70 cm², 윗변 6 cm, 아랫변 8 cm인 사다리꼴의 높이는?', '10 cm')])
        s.text('점을 이어 넓이가 12 cm²인 사다리꼴을 그려 보세요. 평행한 변이 한 쌍만 있게 그려 봐요(모눈 한 칸은 1 cm).')
        real(s, draw_grid(10, 7, pad=.4))
        s.ask('사다리꼴을 삼각형 2개로 나누어 넓이를 구할 때 두 삼각형의 높이가 같은 까닭을 써 보세요.', blank=False)
        s.lines(1)
        ans += '  ⑥ %s, 그리기 예) 윗변 2 cm·아랫변 4 cm·높이 4 cm((윗변+아랫변)×높이=24)' % ', '.join(a6)
    return ans
