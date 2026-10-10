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
