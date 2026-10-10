# -*- coding: utf-8 -*-
"""4-1 수학 4. 평면도형의 이동 활동지(HWPX) 만들기 — 교과서 차시 버전 · 이야기 버전 × 기본형 · 도전형

    python3 gen_u4-move.py

앱 원본(../units/u4-move.tb.js, u4-move.st.js)의 차시·계단·수를 그대로 따릅니다.
그림 소품(두더지·바늘·사과·집·도장·퍼즐·관·무늬 조각·토끼·여우·개·뱀·로봇 모모, 고흐의 방, 게임 표지, 길 조각)은
앱 원본의 그리기 코드를 node로 그대로 실행해 SVG로 옮겨 씁니다(그림이 앱과 똑같음).
그림은 임시 폴더에서 PNG로 찍습니다(저장소에 남기지 않음).
"""
import hashlib
import json
import os
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from hwpxgen import Sheet, svg_to_png  # noqa: E402

G4 = os.path.normpath(os.path.join(HERE, '..', '..'))
UNITS = os.path.join(G4, '_build', 'units')
TMP = tempfile.mkdtemp(prefix='u4move_')
FONT = "'Noto Sans KR','WenQuanYi Zen Hei',sans-serif"
BLUE, INK, TENT, PINE = '#2B7BD6', '#1D2A2A', '#E47A38', '#2F6B57'
GRAY, LINE, GOLD = '#8795A1', '#CBD8E6', '#E8B630'
KO = ['가', '나', '다', '라', '마', '바']
NUM = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩']

# ================================================================ 앱 그림 코드 옮겨 오기(node)
_EXTRACT = r"""
const fs = require('fs');
const src = fs.readFileSync(process.argv[2], 'utf8');
function grab(start) {          // start 글에서 시작해 중괄호가 닫힐 때까지
  const i = src.indexOf(start); if (i < 0) throw new Error('없음: ' + start);
  let k = src.indexOf('{', i), d = 0;
  for (; k < src.length; k++) { if (src[k] === '{') d++; else if (src[k] === '}') { d--; if (!d) break; } }
  let e = k + 1; if (src[e] === ';') e++;
  return src.slice(i, e);
}
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
class El {
  constructor(tag, a) { this.tag = tag; this.a = Object.assign({}, a || {}); this.kids = []; this.textContent = ''; }
  append(...k) { this.kids.push(...k); }
  setAttribute(k, v) { this.a[k] = v; }
  toString() {
    const at = Object.entries(this.a).map(([k, v]) => ` ${k}="${esc(v)}"`).join('');
    return `<${this.tag}${at}>${esc(this.textContent)}${this.kids.join('')}</${this.tag}>`;
  }
}
const svgEl = (t, a) => new El(t, a);
const FONT = process.argv[3];
function txt(x, y, t, size = 22, attrs = {}) { const e = svgEl('text', Object.assign({ x, y, 'font-size': size, 'text-anchor': 'middle', 'dominant-baseline': 'middle', 'font-family': FONT, fill: '#1D2A2A' }, attrs)); e.textContent = t; return e; }
const BLUE = '#2B7BD6', INK = '#1D2A2A', TENT = '#E47A38', PINE = '#2F6B57', M4_GOLD = '#E8B630', M4_GRAY = '#8795A1';
eval(grab('const M4_PIC = {').replace('const M4_PIC', 'var M4_PIC'));
eval(grab('M4_PIC.robot = {'));
eval(grab('function m4RoomArt(g)'));
eval(grab('function m4sTitleArt(g)'));
eval(grab('function m4TileDraw(g, kind, col)'));
const out = {};
const draw = (name, f) => { const g = svgEl('g'); f(g); out[name] = g.kids.join(''); };
for (const k of Object.keys(M4_PIC)) { draw(k, g => M4_PIC[k].draw(g)); out['_dim_' + k] = [M4_PIC[k].bw, M4_PIC[k].bh]; }
draw('stamp_ink', g => M4_PIC.stamp.draw(g, { ink: '#D23C3C' }));
draw('pipe_water', g => M4_PIC.pipe.draw(g, { water: true }));
draw('room', g => m4RoomArt(g));
draw('title', g => m4sTitleArt(g));
draw('tile_corner', g => m4TileDraw(g, 'corner'));
draw('tile_straight', g => m4TileDraw(g, 'straight'));
process.stdout.write(JSON.stringify(out));
"""


def load_pics():
    js = os.path.join(TMP, 'extract.js')
    with open(js, 'w', encoding='utf-8') as f:
        f.write(_EXTRACT)
    r = subprocess.run(['node', js, os.path.join(UNITS, 'u4-move.st.js'), FONT], capture_output=True, text=True)
    if r.returncode:
        raise RuntimeError(r.stderr[-1500:])
    return json.loads(r.stdout)


PIC = load_pics()


# ================================================================ 이동(행렬) — 앱과 같은 약속
# M=[a,b,c,d] : x' = a x + b y, y' = c x + d y (화면 좌표: 오른쪽 x+, 아래쪽 y+)
I_, CW, CCW, FLR, FUD = (1, 0, 0, 1), (0, -1, 1, 0), (0, 1, -1, 0), (-1, 0, 0, 1), (1, 0, 0, -1)


def mul(A, B):
    return (A[0] * B[0] + A[1] * B[2], A[0] * B[1] + A[1] * B[3], A[2] * B[0] + A[3] * B[2], A[2] * B[1] + A[3] * B[3])


def ap(M, p):
    return (M[0] * p[0] + M[1] * p[1], M[2] * p[0] + M[3] * p[1])


def pw(k):
    M = I_
    for _ in range(k % 4):
        M = mul(CW, M)
    return M


def rot(cw, deg):
    k = deg // 90
    return pw(k if cw else -k)


def flip(d):
    return FUD if d in ('위', '아래') else FLR


SEG = {'0': 'abcdef', '1': 'bc', '2': 'abdeg', '3': 'abcdg', '4': 'bcfg', '5': 'acdfg', '6': 'acdefg', '7': 'abc', '8': 'abcdefg', '9': 'abcdfg'}
UD = dict(a='d', b='c', c='b', d='a', e='f', f='e', g='g')
LR = dict(a='a', b='f', c='e', d='d', e='c', f='b', g='g')


def flipnum(n, d):
    mp = UD if d in ('위', '아래') else LR
    out = []
    for ch in str(n):
        segs = ''.join(sorted(mp[s] for s in SEG[ch]))
        out.append(next(k for k, v in SEG.items() if ''.join(sorted(v)) == segs))
    if mp is LR:
        out.reverse()
    return int(''.join(out))


# ================================================================ SVG 조각
def F(v):
    return ('%.2f' % v).rstrip('0').rstrip('.')


def svg(w, h, body):
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %s %s" width="%s" height="%s">'
            '<rect x="0" y="0" width="%s" height="%s" fill="#fff"/>%s</svg>') % (F(w), F(h), F(w), F(h), F(w), F(h), body)


def T(x, y, t, size=20, fill=INK, anchor='middle', weight='normal'):
    return ('<text x="%s" y="%s" font-size="%s" text-anchor="%s" dominant-baseline="middle" font-family="%s" '
            'font-weight="%s" fill="%s">%s</text>') % (F(x), F(y), F(size), anchor, FONT, weight, fill, t)


def grid(ox, oy, w, h, U, col=LINE, sw=1.4):
    s = []
    for x in range(w + 1):
        s.append('<line x1="%s" y1="%s" x2="%s" y2="%s"/>' % (F(ox + x * U), F(oy), F(ox + x * U), F(oy + h * U)))
    for y in range(h + 1):
        s.append('<line x1="%s" y1="%s" x2="%s" y2="%s"/>' % (F(ox), F(oy + y * U), F(ox + w * U), F(oy + y * U)))
    return '<g stroke="%s" stroke-width="%s">%s</g>' % (col, sw, ''.join(s))


def arrow(x1, y1, x2, y2, col=TENT, w=4):
    import math
    a = math.atan2(y2 - y1, x2 - x1)
    L = 14
    pts = '%s,%s %s,%s %s,%s' % (F(x2), F(y2), F(x2 - math.cos(a) * L - math.sin(a) * L * .55), F(y2 - math.sin(a) * L + math.cos(a) * L * .55),
                                 F(x2 - math.cos(a) * L + math.sin(a) * L * .55), F(y2 - math.sin(a) * L - math.cos(a) * L * .55))
    return ('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="%s" stroke-linecap="round"/><polygon points="%s" fill="%s"/>'
            % (F(x1), F(y1), F(x2 - math.cos(a) * L * .6), F(y2 - math.sin(a) * L * .6), col, w, pts, col))


class Pc:
    """조각: 그림 이름('mole' …) 또는 꼭짓점 도형 dict(pts, names, fill, stroke)."""

    def __init__(self, sp):
        if isinstance(sp, str):
            base = sp.replace('_ink', '').replace('_water', '')
            self.bw, self.bh = PIC['_dim_' + base]
            self.inner = PIC[sp]
            self.pts = None
            self.names = None
        else:
            self.pts = sp['pts']
            self.bw = max(p[0] for p in self.pts)
            self.bh = max(p[1] for p in self.pts)
            self.names = sp.get('names')
            pts = ' '.join('%s,%s' % (p[0] * 100, p[1] * 100) for p in self.pts)
            self.inner = ('<polygon points="%s" fill="%s" stroke="%s" stroke-width="4" vector-effect="non-scaling-stroke" '
                          'stroke-linejoin="round"/>') % (pts, sp.get('fill', '#DCEAFB'), sp.get('stroke', BLUE))

    def dims(self, M):
        return (self.bh, self.bw) if abs(M[0]) < .5 else (self.bw, self.bh)

    def at(self, M, cx, cy, U, op=1.0, names=False):
        """가운데 (cx,cy)에 행렬 M으로 놓은 그림."""
        xf = 'translate(%s,%s) matrix(%s,%s,%s,%s,0,0) scale(%s) translate(%s,%s)' % (
            F(cx), F(cy), M[0], M[2], M[1], M[3], F(U / 100), -50 * self.bw, -50 * self.bh)
        s = '<g opacity="%s"><g transform="%s">%s</g></g>' % (op, xf, self.inner)
        if names and self.names:
            P = []
            for p in self.pts:
                w = ap(M, ((p[0] - self.bw / 2) * U, (p[1] - self.bh / 2) * U))
                P.append((cx + w[0], cy + w[1]))
            c = (sum(p[0] for p in P) / len(P), sum(p[1] for p in P) / len(P))
            for (x, y), n in zip(P, self.names):
                d = (x - c[0], y - c[1])
                L = (d[0] ** 2 + d[1] ** 2) ** .5 or 1
                off = max(13, U * .36)
                s += T(x + d[0] / L * off, y + d[1] / L * off, n, max(15, min(24, U * .5)))
        return s

    def place(self, M, x, y, U, op=1.0, names=False):
        """왼쪽 위 칸 (x,y)에 놓기(칸 단위)."""
        d = self.dims(M)
        return self.at(M, (x + d[0] / 2) * U, (y + d[1] / 2) * U, U, op, names)

    def abs_pts(self, M, x, y):
        d = self.dims(M)
        out = []
        for p in self.pts:
            w = ap(M, (p[0] - self.bw / 2, p[1] - self.bh / 2))
            out.append((x + d[0] / 2 + w[0], y + d[1] / 2 + w[1]))
        return out


def cards(items, U=30, label_size=19):
    """앱 m4Cards: items = [(조각, 행렬, 이름표, 꼭짓점 이름?)]"""
    ps = [Pc(it[0]) for it in items]
    ds = [p.dims(it[1]) for p, it in zip(ps, items)]
    bw = max(d[0] for d in ds)
    bh = max(d[1] for d in ds)
    CWd, CH = bw * U + 30, bh * U + 50
    if any(len(it) > 3 and it[3] for it in items):
        CWd += U
        CH += U * .6
    body = []
    for i, (p, it) in enumerate(zip(ps, items)):
        gx, gy = 12 + i * (CWd + 12), 12
        lab = it[2]
        body.append('<rect x="%s" y="%s" width="%s" height="%s" rx="12" fill="%s" stroke="%s" stroke-width="2.5"/>' % (
            F(gx), F(gy), F(CWd), F(CH), '#FFF7E8' if lab in ('보기', '처음', '돌리기 전', '뒤집기 전', '도장') else '#fff',
            TENT if lab in ('보기', '처음', '돌리기 전', '뒤집기 전', '도장') else '#C9D4CF'))
        body.append(T(gx + 12, gy + 18, lab, label_size, anchor='start'))
        body.append(p.at(it[1], gx + CWd / 2, gy + 30 + (CH - 40) / 2, U, names=len(it) > 3 and it[3]))
    W = 12 + len(items) * (CWd + 12)
    return svg(W, CH + 24, ''.join(body))


def motif_cell(M, x, y, U, color='#E47A38'):
    pc = Pc('motif')
    inner = pc.inner if color == '#E47A38' else pc.inner.replace('#E47A38', color)
    xf = 'translate(%s,%s) matrix(%s,%s,%s,%s,0,0) scale(%s) translate(-50,-50)' % (F(x + U / 2), F(y + U / 2), M[0], M[2], M[1], M[3], F(U / 100))
    return '<g transform="%s">%s</g>' % (xf, inner)


def pattern(cells, U=70, labels=None):
    """무늬 칸: cells[r][c] = 행렬 | None(?) | '' (빈칸, 그리는 칸). labels[r][c] 작은 글자."""
    R, C = len(cells), len(cells[0])
    b = []
    for y in range(R):
        for x in range(C):
            v = cells[y][x]
            b.append('<rect x="%s" y="%s" width="%s" height="%s" fill="%s" stroke="#9AA9A3" stroke-width="2"/>' % (
                F(4 + x * U), F(4 + y * U), U, U, '#fff' if v else '#F4F7F9'))
            if v is None:
                b.append(T(4 + x * U + U / 2, 4 + y * U + U / 2, '?', U * .45, fill='#9AA9A3'))
            elif v:
                b.append(motif_cell(v, 4 + x * U, 4 + y * U, U))
    return svg(C * U + 8, R * U + 8, ''.join(b))


def motif_choices(Ms=(I_, pw(1), pw(2), pw(3)), names=KO):
    U = 70
    b = []
    for i, M in enumerate(Ms):
        gx = 10 + i * (U + 60)
        b.append(T(gx + 14, 22, names[i], 22, anchor='start'))
        b.append('<rect x="%s" y="40" width="%s" height="%s" fill="#fff" stroke="#9AA9A3" stroke-width="2"/>' % (gx + 20, U, U))
        b.append(motif_cell(M, gx + 20, 40, U))
    return svg(len(Ms) * (U + 60) + 10, U + 50, ''.join(b))


def digit(x, y, d, col='#1D2A2A'):
    R = dict(a=(8, 0, 34, 9), d=(8, 81, 34, 9), g=(8, 40.5, 34, 9), f=(0, 6, 9, 36), b=(41, 6, 9, 36), e=(0, 48, 9, 36), c=(41, 48, 9, 36))
    return ''.join('<rect x="%s" y="%s" width="%s" height="%s" rx="4" fill="%s"/>' % (F(x + R[s][0]), F(y + R[s][1]), R[s][2], R[s][3], col)
                   for s in SEG[d])


def numcards(nums):
    b = []
    x = 6
    for n in nums:
        ds = str(n)
        w = len(ds) * 66 + 34
        b.append('<rect x="%s" y="4" width="%s" height="142" rx="14" fill="#E3EEFB" stroke="#7FA7D9" stroke-width="3"/>' % (x, w - 8))
        for k, d in enumerate(ds):
            b.append(digit(x + 18 + k * 66, 30, d, '#1F4E8C'))
        x += w + 30
    return svg(x, 152, ''.join(b))


def tile(kind, r, x, y, U, no=None):
    g = '<g transform="translate(%s,%s) scale(%s)"><g transform="rotate(%s 50 50)">%s</g>' % (F(x), F(y), F(U / 100), 90 * r, PIC['tile_' + kind])
    if no:
        g += '<circle cx="16" cy="16" r="14" fill="#fff" stroke="%s" stroke-width="2"/>%s' % (INK, T(16, 17, no, 19))
    return g + '</g>'


def tilefig(kind, rs, labels):
    u = 90
    b = []
    for i, r in enumerate(rs):
        x = 6 + i * (u + 60)
        b.append(T(x + u / 2, 13, labels[i], 17, fill=GRAY))
        b.append(tile(kind, r, x, 28, u))
        if i < len(rs) - 1:
            b.append(arrow(x + u + 10, 28 + u / 2, x + u + 50, 28 + u / 2, TENT, 3))
    return svg(len(rs) * (u + 60) - 48, u + 34, ''.join(b))


def road(cols, rows, start, goal, tiles, U=96, blank=False):
    """길 판: tiles = [(x,y,kind,r,번호)]"""
    ox, oy = U * .9, U * .15
    b = ['<rect x="%s" y="%s" width="%s" height="%s" rx="8" fill="#E9F4DF" stroke="#9CC07E" stroke-width="3"/>' % (F(ox), F(oy), cols * U, rows * U)]
    b.append('<rect x="4" y="%s" width="%s" height="%s" fill="#B9B2A6"/>' % (F(oy + start * U + U * .32), F(ox - 4), F(U * .36)))
    b.append(T(ox / 2, oy + start * U + U * .16, '출발', max(16, U * .2), fill=PINE))
    b.append('<rect x="%s" y="%s" width="%s" height="%s" fill="#B9B2A6"/>' % (F(ox + cols * U), F(oy + goal * U + U * .32), F(ox - 4), F(U * .36)))
    cx, cy = ox + cols * U + ox * .5, oy + goal * U + U * .5
    b.append('<g transform="translate(%s,%s)"><rect x="%s" y="%s" width="%s" height="%s" rx="6" fill="#B5752F" stroke="#6E4518" stroke-width="3"/>'
             '<rect x="%s" y="%s" width="%s" height="%s" rx="6" fill="#D08A3C" stroke="#6E4518" stroke-width="3"/></g>' % (
                 F(cx), F(cy), F(-U * .3), F(-U * .16), F(U * .6), F(U * .38), F(-U * .3), F(-U * .3), F(U * .6), F(U * .16)))
    b.append(T(cx, oy + goal * U + U * .9, '보물', max(15, U * .18), fill='#8A5A1E'))
    have = {(t[0], t[1]) for t in tiles}
    for y in range(rows):
        for x in range(cols):
            gx, gy = ox + x * U, oy + y * U
            if (x, y) in have:
                continue
            if blank:
                b.append('<rect x="%s" y="%s" width="%s" height="%s" rx="6" fill="none" stroke="#9CC07E" stroke-width="2" stroke-dasharray="6 6"/>' % (
                    F(gx + 3), F(gy + 3), U - 6, U - 6))
            else:
                b.append('<circle cx="%s" cy="%s" r="%s" fill="#7FB069"/><rect x="%s" y="%s" width="%s" height="%s" fill="#8A6248"/>' % (
                    F(gx + U * .5), F(gy + U * .45), F(U * .2), F(gx + U * .46), F(gy + U * .6), F(U * .08), F(U * .2)))
    for (x, y, kind, r, no) in tiles:
        b.append(tile(kind, r, ox + x * U, oy + y * U, U, no))
    return svg(cols * U + ox * 2, rows * U + oy * 2, ''.join(b))


def dots(w, h, U, pts, show_names=True, given=None):
    """모눈 점: pts = [(이름, (x,y) 처음, (x,y) 민 뒤 | None)]"""
    cols = [BLUE, TENT, PINE, '#7A5BB0']
    b = [grid(20, 20, w, h, U)]
    for i, (n, p, q) in enumerate(pts):
        c = cols[i % len(cols)]
        b.append('<circle cx="%s" cy="%s" r="8" fill="%s"/>' % (F(20 + p[0] * U), F(20 + p[1] * U), c))
        if q:
            b.append('<circle cx="%s" cy="%s" r="7" fill="#fff" stroke="%s" stroke-width="3.5"/>' % (F(20 + q[0] * U), F(20 + q[1] * U), c))
        if show_names:
            b.append(T(20 + p[0] * U + 15, 20 + p[1] * U - 14, '점 ' + n, 17, fill=c))
    return svg(w * U + 40, h * U + 40, ''.join(b))


def shape_grid(w, h, U, shapes, deco=''):
    """모눈 위에 도형: shapes = [(dict, 행렬, (x,y), 꼭짓점 이름?, 투명도, 점선?)]"""
    b = [grid(10, 10, w, h, U)]
    for sp, M, pos, nm, op, dash in shapes:
        pc = Pc(sp)
        if dash:
            pts = pc.abs_pts(M, pos[0], pos[1])
            b.append('<polygon points="%s" fill="none" stroke="%s" stroke-width="3" stroke-dasharray="8 6"/>' % (
                ' '.join('%s,%s' % (F(10 + x * U), F(10 + y * U)) for x, y in pts), GRAY))
        else:
            b.append('<g transform="translate(10,10)">%s</g>' % pc.place(M, pos[0], pos[1], U, op, nm))
    return svg(w * U + 20, h * U + 20, ''.join(b) + deco)


def draw_sheet(shape, labels, U=34, before_label='처음 도형', M_given=I_, per_row=3):
    """앱 m4Draw(자유 그리기): 왼쪽에 주어진 도형, 오른쪽에 그리는 모눈(과제마다 하나)."""
    pc = Pc(shape)
    S = max(pc.bw, pc.bh)
    ow, DW = S + 2, S + 4
    cells = [('given', before_label)] + [('blank', l) for l in labels]
    n = len(cells)
    per = min(per_row, n)
    rowsN = (n + per - 1) // per
    cw = (DW + 1) * U
    ch = DW * U + 40
    b = []
    for i, (kind, lab) in enumerate(cells):
        gx = 10 + (i % per) * cw
        gy = 10 + (i // per) * ch
        if kind == 'given':
            b.append(T(gx + DW * U / 2, gy + 14, lab, 19, fill=GRAY))
            b.append(grid(gx, gy + 30, DW, DW, U, '#E2E8EE'))
            d = pc.dims(M_given)
            x0, y0 = (DW - d[0]) // 2, (DW - d[1]) // 2
            b.append('<g transform="translate(%s,%s)">%s</g>' % (gx, gy + 30, pc.place(M_given, x0, y0, U, names=True)))
        else:
            b.append(T(gx + DW * U / 2, gy + 14, lab, 19, fill=BLUE))
            b.append(grid(gx, gy + 30, DW, DW, U))
            for x in range(DW + 1):
                for y in range(DW + 1):
                    b.append('<circle cx="%s" cy="%s" r="2.6" fill="#9AB0C8"/>' % (F(gx + x * U), F(gy + 30 + y * U)))
    return svg(per * cw + 10, rowsN * ch + 10, ''.join(b))


# ---- 결과 모양 말로 나타내기(정답 줄) : 꼭짓점이 놓인 자리
def where(sp, M):
    pc = Pc(sp)
    P = pc.abs_pts(M, 0, 0)
    xs = [p[0] for p in P]
    ys = [p[1] for p in P]
    out = []
    for (x, y), n in zip(P, pc.names):
        h = '왼쪽' if abs(x - min(xs)) < 1e-6 else ('오른쪽' if abs(x - max(xs)) < 1e-6 else '가운데')
        v = '위' if abs(y - min(ys)) < 1e-6 else ('아래' if abs(y - max(ys)) < 1e-6 else '가운데')
        out.append('%s %s' % (n, (h + ' ' + v) if not (h == '가운데' and v == '가운데') else '가운데'))
    return ', '.join(out)


# ================================================================ PNG 찍기(같은 그림은 한 번)
_cache = {}


def png(svgtext, width_px=1400):
    k = hashlib.md5((svgtext + str(width_px)).encode('utf-8')).hexdigest()
    if k not in _cache:
        p = os.path.join(TMP, k + '.png')
        svg_to_png(svgtext, p, width_px=width_px)
        _cache[k] = p
    return _cache[k]


def pic(s, svgtext, mm=120, px=1400):
    s.picture(png(svgtext, px), width_mm=mm)


# ================================================================ 이 단원 도형(앱과 같은 좌표)
def S(pts, names=None, fill='#DCEAFB', stroke=BLUE):
    d = dict(pts=pts, fill=fill, stroke=stroke)
    if names:
        d['names'] = names
    return d


N3, N4, N5, N6 = ['ㄱ', 'ㄴ', 'ㄷ'], ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ'], ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ'], ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ']
# 교과서 버전
TRI_S = S([[1, 0], [0, 2], [3, 2]], N3)
TRI_F = S([[1, 0], [0, 3], [3, 3]], N3)
QUAD = S([[0, 0], [0, 2], [3, 3], [2, 0]], N4, '#FDE3D3', TENT)
TRI_R = S([[0, 0], [0, 3], [2, 3]], N3, '#DDEDE5', PINE)
GAMMA = S([[0, 0], [2, 0], [2, 1], [1, 1], [1, 3], [0, 3]], None, '#EADFF6', '#7A5BB0')
LSH = S([[0, 0], [3, 0], [3, 1], [1, 1], [1, 2], [0, 2]], None, '#FFF1C7', '#B08A1E')
PENT = S([[0, 0], [2, 0], [3, 2], [1, 2], [0, 1]], N5, '#DCEAFB', BLUE)                 # 앱에는 이름이 없음(활동지에서 붙임)
FLAG = S([[0, 0], [2, 0], [3, 1], [2, 2], [0, 2]], N5, '#FDE3D3', TENT)
LBIG = S([[0, 0], [1, 0], [1, 2], [2, 2], [2, 3], [0, 3]], N6, '#DDEDE5', PINE)
QUAD2 = S([[0, 0], [3, 1], [2, 3], [0, 3]], N4, '#EADFF6', '#7A5BB0')
# 이야기 버전
BRICK = S([[0, 0], [3, 0], [3, 1], [1, 1], [1, 2], [0, 2]], None, '#FFF1C7', '#B08A1E')
S_TRI_S = S([[0, 0], [0, 2], [3, 2]], N3)
S_TRI_F = S([[2, 0], [0, 3], [3, 3]], N3, '#EADFF6', '#7A5BB0')
S_QUAD = S([[1, 0], [0, 2], [3, 3], [3, 0]], N4, '#FDE3D3', TENT)
S_TRI_R = S([[0, 0], [3, 0], [0, 2]], N3, '#DDEDE5', PINE)
S_PENT = S([[0, 0], [3, 0], [3, 1], [1, 2], [0, 2]], N5, '#DCEAFB', BLUE)
S_STEP = S([[0, 0], [2, 0], [2, 1], [3, 1], [3, 2], [0, 2]], N6, '#FFF1C7', '#B08A1E')
NONAME = lambda sp: {k: v for k, v in sp.items() if k != 'names'}

TAN = [([[0, 0], [4, 0], [2, 2]], '#F7D6C2', None), ([[0, 0], [2, 2], [0, 4]], '#CFE6F7', None), ([[4, 2], [4, 4], [2, 4]], '#E2D3F3', 'tri'),
       ([[2, 2], [3, 3], [2, 4], [1, 3]], '#FFF1C7', None), ([[0, 4], [1, 3], [2, 4]], '#D7EFD9', None), ([[2, 2], [3, 1], [3, 3]], '#FADADD', None),
       ([[3, 1], [4, 0], [4, 2], [3, 3]], '#D4EEF0', 'para')]


def tangram_fig(skip, piece, start, title):
    U = 48
    b = [grid(10, 10, 10, 7, U, '#E2E8EE')]
    for pts, fill, hole in TAN:
        P = ' '.join('%s,%s' % (10 + (p[0] + 1) * U, 10 + (p[1] + 1) * U) for p in pts)
        if hole == skip:
            b.append('<polygon points="%s" fill="#fff" stroke="%s" stroke-width="3" stroke-dasharray="7 6"/>' % (P, GRAY))
        else:
            b.append('<polygon points="%s" fill="%s" stroke="#6B7A86" stroke-width="3" stroke-linejoin="round"/>' % (P, fill))
    b.append(T(10 + 3 * U, 10 + .5 * U, title, 18, fill=GRAY))
    b.append('<g transform="translate(10,10)">%s</g>' % Pc(piece).place(I_, start[0], start[1], U))
    return svg(10 * U + 20, 7 * U + 20, ''.join(b))


def tree(U, x, top):
    return ('<rect x="%s" y="%s" width="%s" height="%s" fill="#8A6248"/><circle cx="%s" cy="%s" r="%s" fill="#7FB069"/>'
            '<circle cx="%s" cy="%s" r="%s" fill="#8FC27A"/>') % (F(x * U), F((top + .4) * U), F(.7 * U), F(4.4 * U), F((x + .35) * U), F(top * U), F(1.25 * U),
                                                                   F((x - .4) * U), F((top - .6) * U), F(.7 * U))


def chest(U, x, y):
    return ('<g transform="translate(%s,%s)"><rect x="%s" y="%s" width="%s" height="%s" rx="6" fill="#B5752F" stroke="#6E4518" stroke-width="3"/>'
            '<rect x="%s" y="%s" width="%s" height="%s" rx="6" fill="#D08A3C" stroke="#6E4518" stroke-width="3"/>'
            '<rect x="%s" y="%s" width="%s" height="%s" fill="%s"/>%s</g>') % (
        F(x * U), F(y * U), F(-U * .55), F(-U * .25), F(U * 1.1), F(U * .7), F(-U * .55), F(-U * .5), F(U * 1.1), F(U * .3),
        F(-U * .09), F(-U * .2), F(U * .18), F(U * .22), GOLD, T(0, U * .75, '보물', 17, fill='#8A5A1E'))


def board_fig(w, h, U, pc, start, target, deco=''):
    """밀기 판: 처음 자리의 그림과 점선 자리(목표)."""
    p = Pc(pc)
    b = [grid(10, 10, w, h, U, '#E2E8EE'), '<g transform="translate(10,10)">%s' % deco]
    if target:
        d = p.dims(I_)
        if p.pts:
            pts = p.abs_pts(I_, target[0], target[1])
            b.append('<polygon points="%s" fill="none" stroke="%s" stroke-width="3" stroke-dasharray="8 6"/>' % (
                ' '.join('%s,%s' % (F(x * U), F(y * U)) for x, y in pts), GRAY))
        else:
            b.append('<rect x="%s" y="%s" width="%s" height="%s" rx="10" fill="none" stroke="%s" stroke-width="3" stroke-dasharray="8 6"/>' % (
                F(target[0] * U), F(target[1] * U), F(d[0] * U), F(d[1] * U), GRAY))
            b.append(p.place(I_, target[0], target[1], U, op=.18))
    b.append(p.place(I_, start[0], start[1], U))
    b.append('</g>')
    return svg(w * U + 20, h * U + 20, ''.join(b))


def slide_board(w, h, U, blocks, exit_row=None, targets=None):
    """앱 m4Slide: blocks = [(이름, 색, 칸들, x, y, 고정?)]"""
    b = ['<rect x="10" y="10" width="%s" height="%s" fill="#F7F4EC" stroke="#9AA9A3" stroke-width="3"/>' % (w * U, h * U), grid(10, 10, w, h, U, '#DCE4E0')]
    if exit_row is not None:
        y = 10 + exit_row * U
        b.append('<rect x="%s" y="%s" width="10" height="%s" fill="#fff"/>' % (8 + w * U, F(y + 4), U - 8))
        b.append(arrow(18 + w * U, y + U / 2, 18 + w * U + U * .8, y + U / 2, PINE, 5))
        b.append(T(18 + w * U + U * .45, y + U + 14, '출구', 17, fill=PINE))
    if targets:
        for name, (tx, ty) in targets.items():
            blk = next(x for x in blocks if x[0] == name)
            for cx, cy in blk[2]:
                b.append('<rect x="%s" y="%s" width="%s" height="%s" fill="none" stroke="%s" stroke-width="3" stroke-dasharray="7 5"/>' % (
                    F(10 + (tx + cx) * U + 3), F(10 + (ty + cy) * U + 3), U - 6, U - 6, GRAY))
            b.append(T(10 + (tx + blk[2][0][0]) * U + U / 2, 10 + (ty + blk[2][0][1]) * U + U / 2, name, 19, fill=GRAY))
    for name, col, cells, x, y, fixed in blocks:
        for cx, cy in cells:
            b.append('<rect x="%s" y="%s" width="%s" height="%s" rx="8" fill="%s" stroke="%s" stroke-width="2.5"/>' % (
                F(10 + (x + cx) * U + 3), F(10 + (y + cy) * U + 3), U - 6, U - 6, col, '#6B7A86'))
        if not fixed:
            cx = sum(c[0] for c in cells) / len(cells)
            cy = sum(c[1] for c in cells) / len(cells)
            b.append(T(10 + (x + cx) * U + U / 2, 10 + (y + cy) * U + U / 2, name, 18, weight='bold'))
    extra = U * 1.6 if exit_row is not None else 0
    return svg(w * U + 20 + extra, h * U + 40, ''.join(b))


def compass(pc_name='needle', M=I_, deco=''):
    """바늘(화살표)과 둘레의 위·아래·왼·오른 이름."""
    p = Pc(pc_name)
    b = [p.at(M, 160, 150, 100), T(160, 22, '위쪽', 20, fill=GRAY), T(160, 280, '아래쪽', 20, fill=GRAY),
         T(30, 150, '왼쪽', 20, fill=GRAY), T(290, 150, '오른쪽', 20, fill=GRAY), deco]
    return svg(320, 300, ''.join(b))


def flower_bed():
    b = []
    for i, (x, y) in enumerate([(360, 90), (385, 130), (355, 170), (392, 205), (372, 60)]):
        c = ['#F28B9B', '#F7DC6F', '#C3A6E3', '#F5B07A', '#7FB2E5'][i]
        b.append('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#4E9A52" stroke-width="4"/><circle cx="%s" cy="%s" r="12" fill="%s"/>'
                 '<circle cx="%s" cy="%s" r="5" fill="#fff"/>' % (x, y + 6, x, y + 28, x, y, c, x, y))
    b.append(T(378, 250, '꽃밭', 20, fill='#4E9A52'))
    return ''.join(b)


def needle_flower():
    p = Pc('needle')
    b = [p.at(I_, 150, 150, 100), T(150, 22, '위쪽', 20, fill=GRAY), T(150, 280, '아래쪽', 20, fill=GRAY), T(28, 150, '왼쪽', 20, fill=GRAY),
         T(278, 150, '오른쪽', 20, fill=GRAY), flower_bed()]
    return svg(430, 300, ''.join(b))


def needle_exit():
    p = Pc('needle')
    b = [p.at(I_, 150, 140, 100), T(150, 20, '위쪽', 20, fill=GRAY), T(28, 140, '왼쪽', 20, fill=GRAY), T(272, 140, '오른쪽', 20, fill=GRAY),
         '<rect x="98" y="262" width="104" height="40" rx="10" fill="#DFF2E6" stroke="%s" stroke-width="3"/>' % PINE, T(150, 283, '출구 ▼', 21, fill=PINE)]
    return svg(300, 310, ''.join(b))


def three_scenes(panels):
    """처음(흐림) → 나중 그림 여러 개. panels = [(번호, 그림, 행렬, 밀기?)]"""
    U = 30
    b = []
    x0 = 10
    for no, name, M, slide in panels:
        p = Pc(name)
        w = 11 if slide else 9
        b.append('<rect x="%s" y="8" width="%s" height="%s" rx="10" fill="#fff" stroke="#C9D4CF" stroke-width="2"/>' % (x0, w * U, 4 * U))
        b.append(T(x0 + 16, 24, no, 19, fill=GRAY))
        if slide:
            b.append(p.place(I_, x0 / U + .5, 1.3, U, op=.3) + p.place(M, x0 / U + 6, 1.3, U))
            b.append(arrow(x0 + 3.8 * U, 1.0 * U, x0 + 6 * U, 1.0 * U))
        else:
            b.append(p.place(I_, x0 / U + .6, 1.3, U, op=1) + p.place(M, x0 / U + 5.6, 1.3, U))
            b.append(arrow(x0 + 3.9 * U, 2.6 * U, x0 + 5.4 * U, 2.6 * U))
        x0 += w * U + 16
    return svg(x0, 4 * U + 16, ''.join(b))


def guess_fig(name, op, label):
    """이동 카드 맞히기 한 판: 전 → 후."""
    p = Pc(name)
    U = 34
    b = ['<rect x="4" y="4" width="%s" height="%s" rx="10" fill="#fff" stroke="#C9D4CF" stroke-width="2"/>' % (11 * U, 6 * U), T(20, 22, label, 20, anchor='start')]
    if op[0] == 'slide':
        v = {'위': (0, -1), '아래': (0, 1), '왼': (-1, 0), '오른': (1, 0)}[op[1]]
        b.append(grid(4 + .5 * U, 4 + 1 * U, 10, 5, U, '#E8EDF1'))
        sx, sy = 4, 3 if v[1] < 0 else 1
        if v[0] < 0:
            sx = 6
        b.append('<g transform="translate(%s,%s)">%s%s</g>' % (4 + .5 * U, 4 + U, p.place(I_, sx, sy, U, op=.3), p.place(I_, sx + 2 * v[0], sy + 2 * v[1], U)))
        b.append(T(4 + 10.6 * U, 22, '흐린 그림: 처음', 15, fill=GRAY, anchor='end'))
    else:
        M = op[1]
        b.append(p.at(I_, 4 + 2.8 * U, 4 + 3.4 * U, U * 1.1) + T(4 + 2.8 * U, 4 + 5.5 * U, '전', 17, fill=GRAY))
        b.append(arrow(4 + 4.8 * U, 4 + 3.4 * U, 4 + 6.2 * U, 4 + 3.4 * U))
        b.append(p.at(M, 4 + 8.2 * U, 4 + 3.4 * U, U * 1.1) + T(4 + 8.2 * U, 4 + 5.5 * U, '후', 17, fill=GRAY))
    return svg(11 * U + 8, 6 * U + 8, ''.join(b))


def guess_row(items):
    """guess_fig 여러 개를 한 줄로."""
    parts = [guess_fig(*it) for it in items]
    import re
    U = 34
    w1 = 11 * U + 8
    body = ''.join('<g transform="translate(%s,0)">%s</g>' % (i * (w1 + 14), re.sub(r'^<svg[^>]*>|</svg>$', '', p)) for i, p in enumerate(parts))
    return svg(len(parts) * (w1 + 14), 6 * U + 8, body)


def room_fig(art, holes, letters=KO):
    """고흐의 방·게임 표지 퍼즐: 빈 곳(점선)과 아래에 돌아간 조각들."""
    k = 1.5
    RX, RY = 40, 10
    b = ['<defs>%s</defs>' % ''.join('<clipPath id="cp%d"><rect x="0" y="0" width="100" height="100"/></clipPath>' % i for i in range(len(holes)))]
    b.append('<g transform="translate(%s,%s) scale(%s)">%s</g>' % (RX, RY, k, PIC[art]))
    for p in holes:
        b.append('<rect x="%s" y="%s" width="%s" height="%s" fill="#FBFCFB" stroke="%s" stroke-width="3" stroke-dasharray="8 6"/>' % (
            F(RX + p[0] * 100 * k), F(RY + p[1] * 100 * k), F(100 * k), F(100 * k), GRAY))
    for i, (tx, ty, ang) in enumerate(holes):
        cx, cy = 115 + i * 150, 200 * k + 110
        piece = ('<g clip-path="url(#cp%d)"><g transform="translate(%s,%s)">%s</g></g>'
                 '<rect x="0" y="0" width="100" height="100" fill="none" stroke="%s" stroke-width="2"/>') % (i, -tx * 100, -ty * 100, PIC[art], INK)
        b.append('<g transform="translate(%s,%s) rotate(%s) scale(%s) translate(-50,-50)">%s</g>' % (cx, F(cy), ang, F(k * .82), piece))
        b.append(T(cx - 70, cy - 62, letters[i], 24, weight='bold'))
    return svg(300 * k + 80, 200 * k + 210, ''.join(b))


def script_table(s, rows, head=('인형', '대사(행동)', '이동 카드')):
    s.table([list(head)] + rows, col_mm=[24, 120, 36])


CARD_TXT = ['위쪽으로 2칸 밀기', '아래쪽으로 2칸 밀기', '왼쪽으로 2칸 밀기', '오른쪽으로 2칸 밀기', '왼쪽으로 뒤집기', '위쪽으로 뒤집기',
            '시계 방향으로 90°만큼 돌리기', '시계 방향으로 180°만큼 돌리기', '시계 반대 방향으로 90°만큼 돌리기', '시계 반대 방향으로 180°만큼 돌리기']
CARD_OPS = [('slide', '위'), ('slide', '아래'), ('slide', '왼'), ('slide', '오른'), ('m', FLR), ('m', FUD), ('m', CW), ('m', pw(2)), ('m', CCW), ('m', pw(2))]


def cards_table(s):
    s.table([['번호', '이동 카드', '번호', '이동 카드']] + [[NUM[i], CARD_TXT[i], NUM[i + 5], CARD_TXT[i + 5]] for i in range(5)],
            col_mm=[14, 76, 14, 76], row_h=2600)


def card_answer(op):
    """같은 결과가 나오는 카드 번호 모두."""
    out = []
    for i, o in enumerate(CARD_OPS):
        if o == op or (o[0] == 'm' and op[0] == 'm' and o[1] == op[1]):
            out.append(NUM[i])
    return '·'.join(out)


BTN = [('㉠', True, 90), ('㉡', True, 180), ('㉢', True, 270), ('㉣', False, 90), ('㉤', False, 180), ('㉥', False, 270)]
BTN_TXT = '㉠ 시계 방향 90°   ㉡ 시계 방향 180°   ㉢ 시계 방향 270°   ㉣ 시계 반대 방향 90°   ㉤ 시계 반대 방향 180°   ㉥ 시계 반대 방향 270°'


def tile_ok(kind, r, need):
    r %= 4
    return r == need if kind == 'corner' else r % 2 == need % 2


def tile_btns(kind, r, need):
    return [l for l, cw, deg in BTN if tile_ok(kind, r + (deg // 90 if cw else -deg // 90), need)]


def ansdraw(sp, ops):
    """그리기 정답 줄: [(이름, 행렬)] → '이름: 꼭짓점 자리'"""
    return ' / '.join('%s: %s' % (n, '처음과 같은 모양' if M == I_ else where(sp, M)) for n, M in ops)


DIRS4 = '( 위 / 아래 / 왼 / 오른 )'
MOVE3 = '( 밀기 / 뒤집기 / 돌리기 )'
SIDE4 = '( 위쪽 / 아래쪽 / 왼쪽 / 오른쪽 )'


def why(s, q, n=2):
    s.ask(q, blank=False)
    s.lines(n)


def help_(s, t):
    s.text('도움  ' + t)


# ================================================================ 교과서 차시 버전
def build_tb(level):
    C = level == '도전형'
    s = Sheet(unit_label='4-1 수학 4. 평면도형의 이동(교과서 차시)', level=level, grade_label='4학년')
    A = []

    # ---------------- 1차시
    s.lesson(1, '개념 찾기(S)', '단원 도입 ― 칠교놀이와 그림자 연극 「두두의 소원」', '평면도형을 이동하면 어떤 변화가 있을까요?')
    s.scene(None, '오늘은 그림자 연극 「두두의 소원」을 하는 날이에요. 두더지 두두가 세상에서 가장 예쁘고 향기로운 것을 찾으러 길을 떠나요.')
    s.step('① 만져 보기', '칠교놀이 ― 보라색 삼각형 조각을 빈자리(점선)에 넣기')
    pic(s, tangram_fig('tri', S([[0, 0], [2, 0], [2, 2]], None, '#C9B3E6', '#7A5BB0'), (7, 1), '칠교판'), 105)
    if not C:
        help_(s, '빈자리의 직각은 오른쪽 아래에 있어요. 보라색 조각의 직각은 어디에 있나요?')
    s.choices([('보라색 조각의 직각은 어디에 있나요?', '( 오른쪽 위 / 오른쪽 아래 )'),
               ('조각을 빈자리에 넣으려면?', '( 밀기만 해요 /\n돌리거나 뒤집은 다음 밀어요 )')])
    s.step('② 그림자 연극 보기', '두두와 바늘을 어떻게 움직였는지 고르기')
    pic(s, three_scenes([('①', 'mole', I_, True), ('②', 'mole', FLR, False), ('③', 'needle', CW, False)]), 175)
    if not C:
        help_(s, '자리만 옮겨 갔으면 밀기, 왼쪽과 오른쪽이 바뀌었으면 뒤집기, 빙그르르 돌아갔으면 돌리기예요.')
    s.choices([('① 두두가 반딧불이를 따라 나무 쪽으로 갔어요.', MOVE3), ('② 두두가 나비를 따라 뒤돌아 갔어요.', MOVE3),
               ('③ 바늘이 꽃밭을 가리키도록 움직였어요.', MOVE3)])
    s.step('③ 말해 보기', '밀기, 뒤집기, 돌리기 중 어느 것과 닮았을까요?')
    s.choices([('슈퍼마켓에서 손수레를 밀면서 장을 봤어요.', MOVE3), ('체육 시간에 색판 뒤집기 놀이를 했어요.', MOVE3),
               ('어머니께서 이불을 뒤집어서 먼지를 터셨어요.', MOVE3), ('모형 시계의 시곗바늘을 돌려 보았어요.', MOVE3),
               ('퍼즐 조각을 돌려서 퍼즐을 맞추었어요.', MOVE3)])
    s.step('④ 떠올리기', '2단원 각도 ― 직각은 90°')
    if not C:
        help_(s, '직각 하나는 90°예요. 90°를 두 번 더하면 180°예요.')
    s.table([['직각', '90° + 90°', '180° + 90°', '270° + 90°', '360° − 90°'], ['(     )°', '(     )°', '(     )°', '(     )°', '(     )°']])
    s.step('⑤ 무늬에서 규칙 찾기', '? 칸에 들어갈 모양을 가~라에서 골라요')
    pic(s, pattern([[I_, pw(1), pw(2), pw(3), I_, pw(1), None, None]], 66), 150)
    pic(s, motif_choices(), 95)
    if not C:
        help_(s, '색칠된 부채꼴이 어느 모서리로 옮겨 가는지 봐요. 네 칸마다 같은 모양이 되풀이돼요.')
    s.ask('? 칸에 들어갈 모양:  일곱째 칸 (     ),  여덟째 칸 (     )', blank=False)
    a1 = '1차시  ① 오른쪽 위, 돌리거나 뒤집은 다음 밀어요  ② 밀기, 뒤집기, 돌리기  ③ 밀기, 뒤집기, 뒤집기, 돌리기, 돌리기  ④ 90°, 180°, 270°, 360°, 270°  ⑤ 다, 라'
    if C:
        s.step('⑥ 도전하기', '평행사변형 조각을 빈자리에 넣기')
        pic(s, tangram_fig('para', S([[1, 1], [0, 0], [0, 2], [1, 3]], None, '#BFE5E8', '#2B8A94'), (7, 2), '칠교판'), 105)
        s.ask('평행사변형 조각을 돌리기만 해서 빈자리에 맞출 수 있을까요?  ( 있어요 / 없어요 )', blank=False)
        why(s, '그렇게 생각한 까닭과, 조각을 맞추는 방법을 써 보세요.')
        a1 += '  ⑥ 없어요 (예) 돌려 봐도 기울어진 쪽이 반대라서 뒤집은 다음 밀어야 맞아요.'
    A.append(a1)

    # ---------------- 2차시
    s.lesson(2, '개념 구축하기(O)', '평면도형을 밀어 볼까요', '평면도형을 밀면 무엇이 바뀌고 무엇이 그대로일까요?')
    s.scene(None, '길을 잃은 두두가 반딧불이를 만났어요. “함께 나무에 가서 다른 친구들에게 물어보는 게 좋겠어요.”')
    s.step('① 만져 보기', '두두를 나무 쪽(점선 자리)으로 밀기')
    U = 46
    pic(s, board_fig(12, 7, U, 'mole', (1, 3), (7, 3), tree(U, 10.7, 2.2)), 125)
    s.ask('두두를 (     )쪽으로 (     )칸 밀면 점선 자리에 가요.', blank=False)
    s.choices([('두두를 오른쪽으로 밀었더니 위치가', '( 오른쪽으로 바뀌었어요 /\n왼쪽으로 바뀌었어요 / 그대로예요 )'),
               ('어느 쪽으로 밀어도 두두의 모양은', '( 변하지 않았어요 / 변했어요 )')])
    s.step('② 점 밀기', '점 ㄱ을 위쪽, 아래쪽, 왼쪽, 오른쪽으로 각각 2칸 민 점을 모눈의 꼭짓점에 찍기')
    pic(s, dots(10, 8, 40, [('ㄱ', (5, 4), None)]), 95)
    if not C:
        help_(s, '점과 점 사이(칸)를 세어요. 선이나 점의 개수를 세는 것이 아니에요.')
        s.wordbox(['방향', '색깔', '위치', '모양'])
    s.fill('미는 (          )에 따라 점이 이동한 만큼 (          )가 바뀌어요.')
    s.step('③ 점을 민 방법 말하기', '모눈 한 칸은 1 cm예요. (● 처음 점, ○ 민 뒤의 점)')
    pic(s, dots(12, 8, 38, [('ㄱ', (1, 1), (4, 1)), ('ㄴ', (10, 2), (8, 2)), ('ㄷ', (3, 6), (3, 4)), ('ㄹ', (7, 5), (7, 6))]), 120)
    s.text('보기  점 ㄱ은 오른쪽으로 3 cm 밀었어요.')
    for n in 'ㄴㄷㄹ':
        s.ask('점 %s은 %s쪽으로 (     ) cm 밀었어요.' % (n, DIRS4), blank=False)
    s.step('④ 삼각형 밀기와 약속', '삼각형 ㄱㄴㄷ을 위쪽, 아래쪽, 왼쪽, 오른쪽으로 각각 6칸 민 도형 그리기')
    pic(s, shape_grid(15, 14, 30, [(TRI_S, I_, (6, 6), True, 1, False)]), 105)
    if not C:
        help_(s, '꼭짓점 하나씩 6칸 옮겨 찍어요. 두 도형 사이의 빈칸이 아니라, 같은 꼭짓점이 6칸 움직여요.')
    s.fill('약속: 도형을 밀면 도형의 ( 위치 / 모양 )만 바뀌고 ( 모양 / 위치 )은 변하지 않아요.')
    s.step('⑤ 조각 빼내기', '초록색 조각을 출구 밖으로 빼내기')
    pic(s, slide_board(4, 4, 62, [('노랑', '#F7DC6F', [(0, 0), (1, 0)], 0, 0, False), ('주황', '#F5B07A', [(0, 0)], 3, 0, False),
                                  ('빨강', '#E8796B', [(0, 0), (0, 1)], 2, 0, False), ('초록', '#7CC68D', [(0, 0), (1, 0)], 0, 1, False),
                                  ('파랑', '#7FB2E5', [(0, 0), (0, 1)], 3, 2, False), ('보라', '#C3A6E3', [(0, 0), (1, 0)], 0, 3, False)], exit_row=1), 70)
    if not C:
        help_(s, '초록색 조각이 오른쪽으로 가는 길을 막는 조각이 있어요.')
    s.fill(['먼저 빨간색 조각을 %s쪽으로 (     )칸 밀었어.' % DIRS4, '그다음 초록색 조각을 %s쪽으로 (     )칸 밀어서 빼냈어.' % DIRS4])
    s.step('⑥ 밀기로 무늬 만들기', '무늬 조각으로 기본 모양(굵은 칸)을 만들고, 밀기만 써서 무늬 완성하기')
    pic(s, pattern([[''] * 6 for _ in range(4)], 50).replace('</svg>', '<rect x="4" y="4" width="100" height="100" fill="none" stroke="%s" stroke-width="5"/></svg>' % GOLD), 85)
    s.ask('내 기본 모양을 어느 쪽으로 밀어서 무늬를 만들었나요?', blank=False)
    s.lines(1)
    t4 = ' / '.join('%s 6칸: 꼭짓점 ㄱ (%d, %d)' % (d, 7 + dx * 6, 6 + dy * 6) for d, dx, dy in (('위', 0, -1), ('아래', 0, 1), ('왼', -1, 0), ('오른', 1, 0)))
    a2 = ('2차시  ① 오른쪽, 6칸 / 오른쪽으로 바뀌었어요, 변하지 않았어요  ② 점 ㄱ에서 위·아래·왼쪽·오른쪽으로 2칸씩 / 방향, 위치  ③ ㄴ 왼쪽 2 cm, ㄷ 위쪽 2 cm, ㄹ 아래쪽 1 cm  '
          '④ (모눈 왼쪽 위에서 가로·세로 칸 수) %s, 모양은 처음과 같음 / 위치, 모양  ⑤ 아래, 2 / 오른, 4  ⑥ 학생마다 다름(밀기만 썼는지 확인)' % t4)
    if C:
        s.step('⑦ 도전하기', '조각 가와 나를 밀어 점선 모양 완성하기')
        pic(s, slide_board(10, 8, 40, [('고정', '#9AA8B4', [(0, 1), (0, 2), (1, 2), (2, 2)], 2, 4, True), ('가', '#F7C6A3', [(0, 0), (1, 0), (2, 0), (1, 1)], 2, 0, False),
                                       ('나', '#A8D5E2', [(1, 0), (1, 1), (1, 2), (0, 1)], 8, 4, False)], targets={'가': (2, 4), '나': (4, 4)}), 90)
        s.ask('조각 가를 (     )쪽으로 (     )칸 밀고, 조각 나를 (     )쪽으로 (     )칸 밀어요.', blank=False)
        why(s, '칸 수를 어떻게 세었는지 써 보세요.', 1)
        a2 += '  ⑦ 가: 아래쪽 4칸, 나: 왼쪽 4칸 (같은 칸끼리 움직인 칸 수를 세어요.)'
    A.append(a2)

    # ---------------- 3차시
    s.lesson(3, '개념 구축하기(O)', '평면도형을 뒤집어 볼까요 ⑴ 두더지와 삼각형', '평면도형을 뒤집으면 무엇이 바뀔까요?')
    s.scene(None, '두두가 나무에서 나비를 만났어요. “저를 따라와요!” 나비가 뒤편으로 날자 두두가 따라가요.')
    s.step('① 만져 보기', '두두 그림을 뒤집어 보기 (다리는 아래쪽, 꼬리는 위쪽)')
    pic(s, cards([('mole', I_, '처음'), ('mole', FUD, '위쪽으로 뒤집기'), ('mole', FLR, '왼쪽으로 뒤집기')], 30, 17), 120)
    s.text('처음 두두를 위쪽으로 뒤집었을 때를 생각해요.')
    s.choices([('두두의 다리는', '( 아래쪽에서 위쪽으로 바뀌어요 /\n위쪽에서 아래쪽으로 바뀌어요 /\n그대로 아래쪽에 있어요 )'),
               ('두두의 꼬리는', '( 위쪽에서 아래쪽으로 바뀌어요 /\n아래쪽에서 위쪽으로 바뀌어요 /\n그대로 위쪽에 있어요 )')])
    s.fill('왼쪽이나 오른쪽으로 뒤집으면 두두의 ( 왼쪽과 오른쪽 / 위쪽과 아래쪽 )이 서로 바뀌어요. 뒤집어도 두두의 모양은 ( 변하지 않아요 / 변해요 ).')
    s.step('② 그려 보기', '삼각형 ㄱㄴㄷ을 위쪽, 아래쪽, 왼쪽, 오른쪽으로 뒤집은 도형')
    pic(s, draw_sheet(TRI_F, ['위쪽으로 뒤집기', '아래쪽으로 뒤집기', '왼쪽으로 뒤집기', '오른쪽으로 뒤집기'], 30), 150)
    if not C:
        help_(s, '위쪽으로 뒤집으면 위에 있던 꼭짓점 ㄱ이 아래로 가요. 왼쪽으로 뒤집으면 ㄴ과 ㄷ이 서로 자리를 바꿔요.')
    s.step('③ 말해 보기', '뒤집은 삼각형을 처음 삼각형과 비교하기')
    s.fill('위쪽이나 아래쪽으로 뒤집으면 도형의 ( 위쪽과 아래쪽 / 왼쪽과 오른쪽 )이 서로 바뀌고, 왼쪽이나 오른쪽으로 뒤집으면 ( 왼쪽과 오른쪽 / 위쪽과 아래쪽 )이 서로 바뀌어요. '
           '위쪽으로 뒤집은 도형과 아래쪽으로 뒤집은 도형은 ( 같아요 / 달라요 ).')
    s.step('④ 약속하기', '‘모양’은 겉으로 나타나는 생김새예요')
    if not C:
        s.wordbox(['방향', '모양'])
    s.fill('약속: 도형을 뒤집으면 도형의 (          )만 바뀌고 (          )은 변하지 않아요.')
    s.step('⑤ 확인하기', '보기의 모양 조각을 오른쪽으로 뒤집은 모양 고르기')
    pic(s, cards([(GAMMA, I_, '보기'), (GAMMA, FLR, '가'), (GAMMA, FUD, '나'), (GAMMA, CW, '다')], 26), 105)
    s.choices([('오른쪽으로 뒤집었을 때의 모양은?', '( 가 / 나 / 다 )'),
               ('도형을 같은 쪽으로 두 번 뒤집으면?', '( 처음 모양과 같아져요 /\n왼쪽과 오른쪽이 바뀐 모양 / 모양이 변해요 )')])
    a3 = ('3차시  ① 아래쪽에서 위쪽으로 바뀌어요, 위쪽에서 아래쪽으로 바뀌어요 / 왼쪽과 오른쪽, 변하지 않아요  ② %s  ③ 위쪽과 아래쪽, 왼쪽과 오른쪽, 같아요  ④ 방향, 모양  ⑤ 가, 처음 모양과 같아져요'
          % ansdraw(TRI_F, [('위쪽·아래쪽', FUD), ('왼쪽·오른쪽', FLR)]))
    if C:
        s.step('⑥ 도전하기', '어떤 도형을 왼쪽으로 뒤집었더니 왼쪽 그림과 같았어요. 처음 도형 그리기')
        pic(s, draw_sheet(QUAD2, ['처음 도형'], 30, before_label='움직인 도형', M_given=FLR), 95)
        why(s, '처음 도형을 어떻게 찾았는지 써 보세요.', 1)
        a3 += '  ⑥ %s (왼쪽으로 뒤집은 도형을 다시 왼쪽으로 뒤집어요.)' % where(QUAD2, I_)
    A.append(a3)

    # ---------------- 4차시
    s.lesson(4, '개념 구축하기(O)', '평면도형을 뒤집어 볼까요 ⑵ 사각형과 도장', '어느 쪽으로 뒤집었는지 어떻게 알 수 있을까요?')
    s.step('① 만져 보기', '사각형 ㄱㄴㄷㄹ을 네 방향으로 뒤집어 보며 꼭짓점의 자리 살펴보기')
    pic(s, cards([(QUAD, I_, '처음', True), (QUAD, FUD, '위쪽', True), (QUAD, FUD, '아래쪽', True), (QUAD, FLR, '왼쪽', True), (QUAD, FLR, '오른쪽', True)], 24, 17), 150)
    s.choices([('처음 사각형을 위쪽으로 뒤집은 모양과 같은 것은?', '( 아래쪽 / 왼쪽 / 오른쪽 )으로\n뒤집은 모양'),
               ('처음 사각형을 왼쪽으로 뒤집은 모양과 같은 것은?', '( 오른쪽 / 위쪽 / 아래쪽 )으로\n뒤집은 모양')])
    s.step('② 그려 보기', '사각형 ㄱㄴㄷㄹ을 네 방향으로 뒤집은 도형')
    pic(s, draw_sheet(QUAD, ['위쪽으로 뒤집기', '아래쪽으로 뒤집기', '왼쪽으로 뒤집기', '오른쪽으로 뒤집기'], 30), 150)
    if not C:
        help_(s, '위쪽으로 뒤집으면 ㄱ과 ㄴ, ㄹ과 ㄷ이 위아래로 자리를 바꿔요. 오른쪽으로 뒤집으면 ㄱ과 ㄹ, ㄴ과 ㄷ이 좌우로 자리를 바꿔요.')
    s.step('③ 모양 조각을 뒤집은 방향', '꼭지·굴뚝이 어디로 갔는지 보기')
    pic(s, cards([('apple', I_, '사과'), ('apple', FUD, '뒤집은 후'), ('house', I_, '집'), ('house', FLR, '뒤집은 후')], 30, 17), 120)
    s.fill(['사과 조각: 나는 %s쪽으로 뒤집었어.' % DIRS4, '집 조각: 나는 %s쪽으로 뒤집었어.' % DIRS4,
            '사과 조각은 ( 위쪽과 아래쪽 / 왼쪽과 오른쪽 )이, 집 조각은 ( 왼쪽과 오른쪽 / 위쪽과 아래쪽 )이 서로 바뀌었어요.'])
    s.step('④ 약속하기', '약속을 확인하고 친구의 생각 판단하기')
    s.fill('약속: 도형을 뒤집으면 도형의 ( 방향 / 모양 )만 바뀌고 ( 모양 / 방향 )은 변하지 않아요.')
    s.text('친구: “사각형을 뒤집었더니 꼭짓점 ㄱ이 다른 곳으로 갔으니까 모양이 변했어.”')
    s.choices([('친구의 말은', '( 틀렸어요 / 맞아요 )'), ('꼭짓점의 자리가 바뀐 것은 무엇이 바뀐 걸까요?', '( 방향 / 모양 )')])
    s.step('⑤ 도장 찍기', '토끼 도장을 종이에 찍은 모양 찾기')
    pic(s, cards([('stamp', I_, '도장'), ('stamp_ink', I_, '가'), ('stamp_ink', FUD, '나'), ('stamp_ink', FLR, '다')], 30), 110)
    if not C:
        help_(s, '접힌 귀와 웃는 눈이 어느 쪽에 있는지 봐요.')
    s.choices([('도장을 종이에 찍은 모양은?', '( 가 / 나 / 다 )')])
    if C:
        why(s, '그렇게 생각한 까닭을 써 보세요.', 1)
    else:
        s.choices([('그렇게 생각한 까닭은?', '( 도장의 왼쪽과 오른쪽이 서로 바뀌어요 /\n위쪽과 아래쪽이 서로 바뀌어요 /\n모양이 똑같이 나와요 )')])
    a4 = ('4차시  ① 아래쪽, 오른쪽  ② %s  ③ 위 또는 아래, 왼 또는 오른 / 위쪽과 아래쪽, 왼쪽과 오른쪽  ④ 방향, 모양 / 틀렸어요, 방향  ⑤ 다, 도장을 찍으면 도장의 왼쪽과 오른쪽이 서로 바뀌기 때문이에요.'
          % ansdraw(QUAD, [('위쪽·아래쪽', FUD), ('왼쪽·오른쪽', FLR)]))
    if C:
        s.step('⑥ 도전하기', '투명 필름에 쓴 28과 21을 각각 위쪽으로 뒤집기')
        pic(s, numcards([28, 21]), 80)
        s.ask('28 → (        ),   21 → (        ),   두 수의 합 (        )', blank=False)
        why(s, '디지털 숫자 2를 위쪽으로 뒤집으면 어떤 숫자처럼 보이는지, 1과 8은 어떻게 되는지 써 보세요.', 1)
        a4 += '  ⑥ %d, %d, 합 %d (2는 5처럼 보이고 1, 8은 그대로예요.)' % (flipnum(28, '위'), flipnum(21, '위'), flipnum(28, '위') + flipnum(21, '위'))
    A.append(a4)

    # ---------------- 5차시
    s.lesson(5, '개념 구축하기(O)', '평면도형을 돌려 볼까요 ⑴ 바늘과 시계 방향', '평면도형을 시계 방향으로 돌리면 어떻게 바뀔까요?')
    s.scene(None, '지친 나비가 바늘을 보여 줬어요. “바늘이 가리키는 방향으로 가면 꽃밭에 갈 수 있어요.”')
    s.step('① 만져 보기', '바늘이 오른쪽의 꽃밭을 가리키도록 돌리기')
    pic(s, needle_flower(), 70)
    if not C:
        help_(s, '시계 방향은 시곗바늘이 도는 방향이에요. 90°는 직각만큼이에요.')
    s.ask('바늘을 시계 방향으로 (     )°만큼 돌리면 꽃밭을 가리켜요.', blank=False)
    s.ask('바늘을 시계 반대 방향으로 (     )°만큼 돌려도 꽃밭을 가리켜요.', blank=False)
    s.step('② 예상하고 돌려 보기', '위쪽을 가리키던 바늘을 돌리면 뾰족한 부분이 가리키는 쪽')
    s.choices([('시계 방향으로 90°', SIDE4), ('시계 반대 방향으로 90°', SIDE4), ('시계 방향으로 180°', SIDE4),
               ('시계 방향으로 270°', SIDE4), ('시계 방향으로 360°', SIDE4)])
    s.step('③ 그려 보기', '삼각형 ㄱㄴㄷ을 시계 방향으로 90°, 180°, 270°, 360°만큼 돌린 도형')
    pic(s, draw_sheet(TRI_R, ['시계 방향 90°', '시계 방향 180°', '시계 방향 270°', '시계 방향 360°'], 30), 150)
    if not C:
        help_(s, '위쪽 부분인 꼭짓점 ㄱ이 어디로 가는지 먼저 생각해요.')
    s.step('④ 말해 보기', '시계 방향으로 돌렸을 때의 변화')
    if not C:
        s.wordbox(['오른쪽', '아래쪽', '왼쪽', '처음과 같아요'])
    s.fill('시계 방향으로 90°만큼 돌리면 위쪽 부분이 (        )으로, 180°만큼 돌리면 (        )으로, 270°만큼 돌리면 (        )으로 가요. 360°만큼 돌리면 (              ).')
    s.step('⑤ 확인하기', '보기의 모양 조각을 시계 방향으로 90°만큼 돌린 모양 고르기')
    pic(s, cards([(LSH, I_, '보기'), (LSH, FUD, '가'), (LSH, CW, '나'), (LSH, CCW, '다')], 24), 110)
    s.choices([('시계 방향으로 90°만큼 돌린 모양은?', '( 가 / 나 / 다 )'),
               ('도형을 돌린 방법을 바르게 말한 것은?', '( 시계 방향으로 돌렸어요 /\n시계 방향으로 90°만큼 돌렸어요 /\n90°만큼 돌렸어요 )')])
    a5 = ('5차시  ① 90, 270  ② 오른쪽, 왼쪽, 아래쪽, 왼쪽, 위쪽  ③ %s  ④ 오른쪽, 아래쪽, 왼쪽, 처음과 같아요  ⑤ 나, 시계 방향으로 90°만큼 돌렸어요(방향과 각도를 함께)'
          % ansdraw(TRI_R, [('90°', pw(1)), ('180°', pw(2)), ('270°', pw(3)), ('360°', I_)]))
    if C:
        s.step('⑥ 도전하기', '도형을 시계 방향으로 180°만큼 돌린 도형 그리기')
        pic(s, draw_sheet(PENT, ['시계 방향 180°'], 30), 95)
        why(s, '시계 방향으로 180°만큼 돌린 도형과 위쪽으로 뒤집은 도형은 어떻게 다른가요?', 1)
        a5 += '  ⑥ %s (180°만큼 돌리면 위아래와 좌우가 모두 바뀐 것처럼 보이고, 위쪽으로 뒤집으면 위아래만 바뀌어요.)' % where(PENT, pw(2))
    A.append(a5)

    # ---------------- 6차시
    s.lesson(6, '개념 구축하기(O)', '평면도형을 돌려 볼까요 ⑵ 시계 반대 방향과 퍼즐', '시계 반대 방향으로 돌리면 어떻게 될까요? 같은 모양이 되는 방법은 몇 가지일까요?')
    s.step('① 만져 보기', '위쪽을 가리키던 바늘을 시계 반대 방향으로 돌리면?')
    pic(s, compass(), 45)
    s.choices([('시계 반대 방향으로 90°', SIDE4), ('시계 반대 방향으로 180°', SIDE4), ('시계 반대 방향으로 270°', SIDE4), ('시계 반대 방향으로 360°', SIDE4)])
    s.step('② 그려 보기', '삼각형 ㄱㄴㄷ을 시계 반대 방향으로 90°, 180°, 270°, 360°만큼 돌린 도형')
    pic(s, draw_sheet(TRI_R, ['시계 반대 90°', '시계 반대 180°', '시계 반대 270°', '시계 반대 360°'], 30), 150)
    if not C:
        help_(s, '위쪽 부분인 꼭짓점 ㄱ이 시계 반대 방향으로 90°만큼 돌면 왼쪽으로 가요.')
    s.step('③ 약속하기', '약속을 완성하고 같은 모양이 되는 짝 찾기')
    s.fill('약속: 도형을 돌리면 도형의 ( 방향 / 모양 )만 바뀌고 ( 모양 / 방향 )은 변하지 않아요. 시계 반대 방향으로 90°만큼 돌린 모양은 시계 방향으로 ( 90° / 180° / 270° )만큼 돌린 모양과 같아요.')
    s.step('④ 퍼즐 조각 돌리기', '가운데 조각을 돌려서 ‘돌린 후’와 같은 모양을 만드는 방법 두 가지')
    pic(s, cards([('puzzle', I_, '처음'), ('puzzle', CW, '돌린 후')], 34), 60)
    if not C:
        help_(s, '튀어나온 부분이 위쪽에서 오른쪽으로 갔어요.')
    s.fill(['시계 방향으로 (     )°만큼 돌렸어.', '( 시계 / 시계 반대 ) 방향으로 270°만큼 돌렸어.'])
    s.step('⑤ 확인하기', '보기의 도형을 돌렸을 때의 도형이 아닌 것 고르기')
    pic(s, cards([(GAMMA, I_, '보기'), (GAMMA, CW, '가'), (GAMMA, FLR, '나'), (GAMMA, pw(2), '다')], 26), 105)
    s.choices([('돌렸을 때의 도형이 아닌 것은?', '( 가 / 나 / 다 )'),
               ('시계 반대 방향으로 270°만큼 돌린 모양과 같은 것은?', '( 시계 방향으로 90°만큼 돌린 모양 /\n시계 방향으로 270°만큼 돌린 모양 /\n시계 반대 방향으로 90°만큼 돌린 모양 )')])
    s.step('⑥ 돌리기로 무늬 만들기', '규칙을 하나 고르고, 규칙대로 돌려 그린 다음 아래쪽으로 밀기')
    s.ask('내가 고른 규칙:  ( 시계 / 시계 반대 ) 방향으로 ( 90° / 180° / 270° )만큼 돌리기', blank=False)
    pic(s, pattern([[I_, '', '', ''], ['', '', '', '']], 60), 80)
    a6 = ('6차시  ① 왼쪽, 아래쪽, 오른쪽, 위쪽  ② %s  ③ 방향, 모양, 270°  ④ 90 / 시계 반대  ⑤ 나(뒤집은 모양), 시계 방향으로 90°만큼 돌린 모양  ⑥ 학생마다 다름(앞 칸을 규칙만큼 돌렸는지 확인)'
          % ansdraw(TRI_R, [('90°', pw(3)), ('180°', pw(2)), ('270°', pw(1)), ('360°', I_)]))
    if C:
        s.step('⑦ 도전하기', '오른쪽으로 한 칸, 아래로 한 줄 갈 때마다 시계 방향으로 90°만큼 돌리는 무늬. ? 칸 채우기')
        ans = [[pw(r + c) for c in range(4)] for r in range(2)]
        pic(s, pattern([[ans[0][0], None, ans[0][2], None], [None, ans[1][1], None, ans[1][3]]], 60), 80)
        pic(s, motif_choices(), 95)
        s.ask('첫째 줄: 둘째 칸 (    ), 넷째 칸 (    )    둘째 줄: 첫째 칸 (    ), 셋째 칸 (    )', blank=False)
        why(s, '둘째 줄 첫째 칸을 어떻게 찾았는지 써 보세요.', 1)
        a6 += '  ⑦ 나, 라 / 나, 라 (둘째 줄 첫 칸은 첫째 줄 첫 칸을 시계 방향으로 90°만큼 돌린 모양)'
    A.append(a6)

    # ---------------- 7차시
    s.lesson(7, '탐구 정리하기(O)', '생각을 더하다 ― 길을 연결하여 보물을 찾아볼까요', '길 조각을 어떻게 돌려야 길이 이어질까요? 방법은 몇 가지일까요?')
    need = [2, 0, 2, 0, 2, 0]
    turn = [1, 2, 3, 2, 3, 3]
    pos = [(0, 0), (0, 1), (1, 1), (1, 2), (2, 2), (2, 3)]
    r0 = [(need[i] - turn[i]) % 4 for i in range(6)]
    s.step('① 길 연결하기', '출발점에서 보물까지 길을 모두 연결하려면 길 조각을 돌려야 해요')
    pic(s, road(3, 4, 0, 3, [(pos[i][0], pos[i][1], 'corner', r0[i], NUM[i]) for i in range(6)], 80), 80)
    if not C:
        help_(s, '①은 출발점에서 들어온 길이 아래쪽으로 꺾여야 해요.')
    s.ask('① 길 조각은 왼쪽과 ( 위쪽 / 아래쪽 )이 열리도록 돌려야 해요.', blank=False)
    s.step('② 알맞은 단추 모두 찾기', '처음 → 이어지는 모양으로 만드는 단추에 ○표 (조각마다 두 개)')
    s.text(BTN_TXT)
    import re
    figs = [tilefig('corner', [r0[i], need[i]], [NUM[i] + ' 처음', '이어지는 모양']) for i in range(6)]
    W1 = 2 * 150 - 48 + 40
    body = ''.join('<g transform="translate(%s,%s)">%s</g>' % ((i % 3) * W1, (i // 3) * 140, re.sub(r'^<svg[^>]*>|</svg>$', '', f)) for i, f in enumerate(figs))
    pic(s, svg(3 * W1, 280, body), 150)
    s.table([['조각', '①', '②', '③', '④', '⑤', '⑥'], ['단추'] + ['㉠㉡㉢\n㉣㉤㉥'] * 6], row_h=3600)
    s.step('③ 말해 보기', '같은 모양이 되는 두 가지 방법')
    if not C:
        help_(s, '시계 방향 각도와 시계 반대 방향 각도를 더하면 360°가 돼요.')
    s.fill(['시계 방향으로 90°만큼 돌린 모양 = 시계 반대 방향으로 (      )°만큼 돌린 모양',
            '시계 방향으로 180°만큼 돌린 모양 = 시계 반대 방향으로 (      )°만큼 돌린 모양',
            '시계 방향으로 270°만큼 돌린 모양 = 시계 반대 방향으로 (      )°만큼 돌린 모양'])
    s.step('④ 약속하기', '돌리는 방법을 말할 때 꼭 지킬 것')
    s.fill('돌리는 방법을 말할 때에는 돌리는 ( 방향 / 색깔 )과 ( 각도 / 길이 )를 함께 말해요. 같은 모양이 되게 돌리는 방법은 ( 두 / 한 ) 가지가 있어요.')
    s.step('⑤ 나만의 길 만들기', '곧은 길·꺾인 길 조각을 그려 넣어 출발점에서 보물까지 잇기')
    pic(s, road(4, 3, 0, 2, [], 64, blank=True), 75)
    s.ask('내가 돌린 길 조각 하나를 설명해 보세요. (예: 곧은 길을 시계 방향으로 90°만큼 돌렸어.)', blank=False)
    s.lines(1)
    bt = ' '.join('%s %s' % (NUM[i], ', '.join(tile_btns('corner', r0[i], need[i]))) for i in range(6))
    a7 = '7차시  ① 아래쪽  ② %s  ③ 270, 180, 90  ④ 방향, 각도, 두  ⑤ 학생마다 다름' % bt
    if C:
        s.step('⑥ 도전하기', '길 조각마다 돌리기 단추를 딱 한 번만 눌러 길 연결하기')
        CH = [(0, 0, 'straight', 1, 0), (1, 0, 'corner', 2, 1), (1, 1, 'straight', 0, 1), (1, 2, 'corner', 0, 2), (2, 2, 'straight', 1, 0),
              (3, 2, 'corner', 3, 0), (3, 1, 'straight', 0, 1), (3, 0, 'corner', 1, 2)]
        pic(s, road(4, 3, 0, 0, [(x, y, k, r, NUM[i]) for i, (x, y, k, need_, r) in enumerate(CH)], 70), 95)
        s.table([['조각'] + NUM[:8], ['단추'] + [''] * 8], row_h=2800)
        why(s, '곧은 길 조각은 왜 누를 수 있는 단추가 더 많을까요?', 1)
        a7 += '  ⑥ ' + ' '.join('%s %s' % (NUM[i], '·'.join(tile_btns(k, r, nd))) for i, (x, y, k, nd, r) in enumerate(CH)) + \
              ' 중 하나 (곧은 길은 90°나 270°만큼 돌리면 모두 눕기 때문이에요.)'
    A.append(a7)

    # ---------------- 8차시
    s.lesson(8, '발표하기(P)', '놀이를 더하다 ― 밀고, 뒤집고, 돌려서 인형극을 만들어 볼까요', '이동 카드대로 종이 인형을 움직여 어떤 인형극을 만들 수 있을까요?')
    s.scene(None, '“이런! 깡충깡충 뛰던 토끼가 구덩이에 쏙 빠졌어요.” 종이 인형을 책상 위에 놓고 위에서 내려다보며 움직여요.')
    s.step('① 이동 카드 알아보기', '인형극에서 쓸 이동 카드 10장')
    cards_table(s)
    if not C:
        help_(s, '밀기 카드는 2칸씩 움직여요. 뒤집기·돌리기 카드는 자리는 그대로이고 방향이 바뀌어요.')
    s.ask('위치가 바뀌는 카드 번호: (                    )', blank=False)
    s.ask('방향이 바뀌는 카드 번호: (                    )', blank=False)
    s.step('② 대본 예시 따라 하기', '행동에 맞는 이동 카드 번호 쓰기')
    script_table(s, [['토끼', '(구덩이로 떨어지며) 으악! 구덩이에 빠졌어.', ''], ['여우', '(구덩이 쪽으로 뛰어가며) 토끼야, 괜찮니?', ''],
                     ['여우', '(구덩이 속을 들여다보며) 어쩌다 거기 빠지게 된 거야?', ''], ['토끼', '(위쪽으로 뛰며) 모르겠어. 나 좀 도와줘!', '']])
    if not C:
        help_(s, '여우는 토끼 왼쪽에 있어요. 구덩이 속을 들여다보려면 여우의 머리가 아래쪽을 향해야 해요.')
    s.step('③ 우리 모둠 대본 만들기', '토끼는 동물 친구들의 도움으로 구덩이에서 빠져나올 수 있을까요?')
    script_table(s, [['', '', ''], ['', '', ''], ['', '', ''], ['', '', '']], head=('인형', '행동과 대사', '이동 카드'))
    s.step('④ 이동 카드 맞히기', '친구가 이동 카드 한 장대로 인형을 움직였어요. 어떤 카드일까요?')
    R4 = [('fox', ('slide', '위'), '㉮'), ('rabbit', ('m', FLR), '㉯'), ('dog', ('m', CW), '㉰'), ('rabbit', ('m', pw(2)), '㉱')]
    pic(s, guess_row(R4[:2]), 150)
    pic(s, guess_row(R4[2:]), 150)
    s.table([['', '㉮', '㉯', '㉰', '㉱'], ['카드 번호', '', '', '', '']])
    s.step('⑤ 되돌아보기', '인형극 놀이를 되돌아봐요')
    s.choices([('이동 방향이 헷갈리지 않게 하려면?', '( 책상 위에 놓고 위에서 내려다보는 방향으로 /\n관객마다 자기가 보는 쪽에서 )'),
               ('⑦ 시계 방향 90° 돌리기와 결과가 같은 것은?', '( 시계 반대 방향으로 270°만큼 돌리기 /\n시계 반대 방향으로 90°만큼 돌리기 /\n오른쪽으로 뒤집기 )'),
               ('⑤ 왼쪽으로 뒤집기와 결과가 같은 것은?', '( 오른쪽으로 뒤집기 / 위쪽으로 뒤집기 /\n시계 방향으로 180°만큼 돌리기 )')])
    a8 = ('8차시  ① ①②③④ / ⑤⑥⑦⑧⑨⑩  ② ②, ④, ⑦, ①  ③ 학생마다 다름  ④ ㉮ %s ㉯ %s ㉰ %s ㉱ %s  ⑤ 책상 위에 놓고 위에서 내려다보는 방향, 시계 반대 방향으로 270°만큼 돌리기, 오른쪽으로 뒤집기'
          % tuple(card_answer(r[1]) for r in R4))
    if C:
        s.step('⑥ 도전하기', '뒤집기와 돌리기 카드만 나와요')
        R6 = [('fox', ('m', FUD), '㉮'), ('snake', ('m', CCW), '㉯'), ('rabbit', ('m', CW), '㉰')]
        pic(s, guess_row(R6), 170)
        s.table([['', '㉮', '㉯', '㉰'], ['카드 번호', '', '', '']])
        why(s, '뒤집기 카드와 돌리기 카드를 어떻게 구별했는지 써 보세요.', 1)
        a8 += '  ⑥ ㉮ %s ㉯ %s ㉰ %s (좌우나 위아래만 바뀌면 뒤집기, 머리가 다른 쪽을 향하면 돌리기)' % tuple(card_answer(r[1]) for r in R6)
    A.append(a8)

    # ---------------- 9차시
    s.lesson(9, '발표하기(P)', '공부한 내용을 확인해요', '밀기, 뒤집기, 돌리기를 이용해 여러 가지 문제를 해결할 수 있을까요?')
    s.step('① 확인 1', '도형을 오른쪽으로 7 cm 밀었을 때의 도형 그리기 (모눈 한 칸 = 1 cm)')
    pic(s, shape_grid(12, 4, 40, [(FLAG, I_, (1, 1), True, 1, False)]), 120)
    s.step('② 확인 2', '보기의 도형을 오른쪽으로 뒤집었을 때의 도형 고르기')
    pic(s, cards([(NONAME(QUAD2), I_, '보기'), (NONAME(QUAD2), FLR, '가'), (NONAME(QUAD2), FUD, '나')], 28), 85)
    s.ask('답: ( 가 / 나 )', blank=False)
    s.step('③ 확인 3', '점을 어떻게 밀었는지 쓰기 (● 처음 점, ○ 민 뒤의 점)')
    pic(s, dots(9, 8, 36, [('ㄱ', (7, 2), (2, 2)), ('ㄴ', (4, 6), (4, 4))]), 85)
    s.ask('점 ㄱ은 %s쪽으로 (     )칸,  점 ㄴ은 %s쪽으로 (     )칸 밀었어요.' % (DIRS4, DIRS4), blank=False)
    s.step('④ 확인 4', '도형을 시계 방향으로 270°만큼 돌렸을 때의 도형 그리기')
    pic(s, draw_sheet(LBIG, ['시계 방향 270°'], 30), 95)
    if not C:
        help_(s, '시계 방향으로 270°만큼 돌리면 위쪽 부분이 왼쪽으로 가요.')
    s.step('⑤ 확인 5', '세 자리 수가 적힌 투명 카드를 아래쪽으로 뒤집었을 때 나오는 수')
    pic(s, numcards([820]), 50)
    s.ask('아래쪽으로 뒤집으면 (          )', blank=False)
    s.step('⑥ 확인 6', '규칙 ‘시계 방향으로 90°만큼 돌리기’로 무늬 만들기 (빈칸에 가~라 쓰기)')
    pic(s, pattern([[I_, '', '', '', '', ''], ['', '', '', '', '', '']], 56).replace('</svg>', '<rect x="4" y="4" width="112" height="112" fill="none" stroke="%s" stroke-width="5"/></svg>' % GOLD), 95)
    pic(s, motif_choices(), 85)
    if not C:
        help_(s, '노란 테두리 안 네 칸을 시계 방향으로 돌며 채운 다음(왼쪽 위 → 오른쪽 위 → 오른쪽 아래 → 왼쪽 아래), 그 모양을 오른쪽으로 밀어요.')
    s.step('⑦ 확인 7 ★★', '관을 시계 반대 방향으로 90°만큼 돌렸더니 물이 흘렀어요. 돌리기 전의 관 고르기')
    pic(s, cards([('pipe_water', pw(2), '돌린 후'), ('pipe', I_, '가'), ('pipe', pw(1), '나'), ('pipe', pw(2), '다'), ('pipe', pw(3), '라')], 28), 130)
    s.text('물통은 왼쪽에, 꽃밭은 아래쪽에 있어요.')
    s.fill('시계 반대 방향으로 90°만큼 돌린 것을 거꾸로 생각하여 ( 시계 방향 / 시계 반대 방향 )으로 (      )°만큼 돌리면 돌리기 전의 모습을 구할 수 있어요.  돌리기 전의 관: (      )')
    before = mul(CW, pw(2))
    pat = '윗줄 ' + ' '.join(['가', '나'] * 3) + ' / 아랫줄 ' + ' '.join(['라', '다'] * 3)
    a9 = ('9차시  ① 같은 꼭짓점이 각각 오른쪽으로 7칸 간 자리(꼭짓점 ㄱ이 모눈 왼쪽 끝에서 8칸, 위쪽 끝에서 1칸), 모양은 그대로  ② 가  ③ 왼쪽 5칸, 위쪽 2칸  ④ %s  ⑤ %d  ⑥ %s  ⑦ 시계 방향, 90, %s'
          % (where(LBIG, pw(3)), flipnum(820, '아래'), pat, KO[[I_, pw(1), pw(2), pw(3)].index(before)]))
    if C:
        s.step('⑧ 도전하기', '「고흐의 방」 퍼즐 ― 빈 곳에 맞게 조각을 돌리는 방법')
        pic(s, room_fig('room', [(0, 1, 180), (1, 0, 90), (2, 1, -90)]), 100)
        for k in '가나다':
            s.ask('조각 %s: ( 시계 / 시계 반대 ) 방향으로 (      )°만큼 돌려요.' % k, blank=False)
        why(s, '조각을 돌리는 방법을 무엇을 보고 정했는지 써 보세요.', 1)
        a9 += '  ⑧ 가 시계 방향 180°(시계 반대 방향 180°도 됨), 나 시계 반대 방향 90°, 다 시계 방향 90° (천장·벽 같은 위쪽 부분이 어디 있는지 봐요.)'
    A.append(a9)

    s.answers('【교사용】 4. 평면도형의 이동(교과서 차시) 활동지 정답 (%s)' % level, A, note='※ 이 활동지는 앱 u4-move.html과 차시 번호가 같습니다.')
    return s
