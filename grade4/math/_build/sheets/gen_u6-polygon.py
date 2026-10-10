# -*- coding: utf-8 -*-
"""4-2 수학 6. 다각형 활동지(HWPX) 만들기 — 교과서 차시 버전 · 이야기 버전 × 기본형 · 도전형

    python3 gen_u6-polygon.py

앱 원본(../units/sem2/u6-polygon.tb.js '은하의 어린이 미술관', u6-polygon.st.js '우리 반 교실 꾸미기 디자인단')의
차시 번호·제목·S.O.O.P.·탐구 질문·이야기·수를 그대로 따릅니다.

그림
  - 도형 카드·표지판·교실 그림·등대와 배·게시판 작품 등은 앱 원본의 그리기 코드를 node로 그대로 실행해 SVG로 옮겨 씁니다
    (좌표·크기가 앱과 똑같음). 모양 조각(패턴 블록) 좌표도 앱 원본에서 그대로 가져옵니다.
  - 학생이 그리는 곳에는 점 종이(앱과 같은 칸 수)·삼각 점 종이·원형 도형판을 넣습니다.
  - 모양 조각으로 만들기·채우기 그림은 실제 모양 조각과 같은 크기(한 변 25.4 mm)로 넣고, 채우는 모양 안에는
    조각의 변이 놓일 수 있는 삼각 격자 선을 옅게 그어 선을 따라 나누어 그릴 수 있게 합니다.
  - 대각선 길이를 재는 사각형은 1 = 1 cm 크기로 넣습니다(자로 재어 볼 수 있음).
정답(변·꼭짓점의 수, 대각선의 수, 길이, 각, 채우기 조각 수 등)은 이 스크립트가 좌표로 계산해 확인합니다.
그림은 임시 폴더에서 PNG로 찍습니다(저장소에 남기지 않음).
"""
import hashlib
import json
import math
import os
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from hwpxgen import Sheet, svg_to_png, check  # noqa: E402

G4 = os.path.normpath(os.path.join(HERE, '..', '..'))
UNITS = os.path.join(G4, '_build', 'units', 'sem2')
TMP = tempfile.mkdtemp(prefix='u6poly_')
FONT = "'Noto Sans KR','WenQuanYi Zen Hei',sans-serif"
INK, BLUE, TENT, GOLD = '#1D2A2A', '#2B7BD6', '#E47A38', '#E8B630'
KO = ['가', '나', '다', '라', '마', '바', '사', '아']
JA = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ']
NAMES = {3: '삼각형', 4: '사각형', 5: '오각형', 6: '육각형', 7: '칠각형', 8: '팔각형', 9: '구각형', 10: '십각형'}
H3 = math.sqrt(3) / 2
MM_PB = 25.4          # 모양 조각 한 변(실제 패턴 블록 1인치)

# ================================================================ 앱 그림 코드 옮겨 오기(node)
_STUB = r"""
const fs = require('fs');
const src = fs.readFileSync(process.argv[2], 'utf8');
const FONT = process.argv[3];
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
class El {
  constructor(tag, a) { this.tag = tag; this.a = Object.assign({}, a || {}); this.kids = []; this.textContent = ''; this.style = {};
    this.classList = { add() {}, remove() {}, toggle() {} }; }
  append(...k) { for (const x of k.flat(9)) if (x != null && x !== false) this.kids.push(x); }
  setAttribute(k, v) { this.a[k] = v; }
  set innerHTML(v) { this.kids = []; }
  addEventListener() {}
  toString() {
    const a = Object.assign({}, this.a);
    if (this.tag === 'svg') { a.xmlns = 'http://www.w3.org/2000/svg'; }
    const at = Object.entries(a).map(([k, v]) => ` ${k}="${esc(v)}"`).join('');
    return `<${this.tag}${at}>${esc(this.textContent)}${this.kids.map(k => typeof k === 'string' ? esc(k) : String(k)).join('')}</${this.tag}>`;
  }
}
const document = { createElement: t => new El(t), head: { append() {} } };
const svgEl = (t, a) => new El(t, a);
const h = (t, a, ...k) => { const e = new El(t, a); e.append(...k); return e; };
function makeSvg(w, hh) { return svgEl('svg', { viewBox: `0 0 ${w} ${hh}` }); }
function txt(x, y, t, size = 22, attrs = {}) { const e = svgEl('text', Object.assign({ x, y, 'font-size': size, 'text-anchor': 'middle', 'dominant-baseline': 'middle', 'font-family': FONT, fill: '#1D2A2A' }, attrs)); e.textContent = t; return e; }
const BLUE = '#2B7BD6', INK = '#1D2A2A', TENT = '#E47A38', PINE = '#2F6B57';
const unitSrc = src.slice(src.indexOf('//@@UNIT'), src.indexOf('//@@LESSONS'));
eval(unitSrc.replace(/^(const|let) /gm, 'var ').replace(/^function /gm, 'var __f = function '));
"""
# 위 eval: 맨 앞 const/let을 var로 바꿔 eval 밖에서도 보이게 합니다. function 선언은 eval 안에서도 함수 범위로 올라가므로
# 따로 바꿀 필요가 없지만, 안전하게 그대로 둡니다(아래 _fix로 되돌림).


def _job_js(jobs):
    """jobs: {이름: JS 식} — 식이 El이면 SVG 글, 아니면 JSON 값"""
    lines = ['const OUT = {};']
    for k, e in jobs.items():
        lines.append('OUT[%s] = (() => { const v = (%s); return (v && v.tag) ? String(v) : v; })();' % (json.dumps(k), e))
    lines.append('process.stdout.write(JSON.stringify(OUT));')
    return '\n'.join(lines)


def extract(fname, jobs):
    stub = _STUB.replace(".replace(/^function /gm, 'var __f = function ')", '')
    js = os.path.join(TMP, 'ex_%s.js' % hashlib.md5(fname.encode()).hexdigest()[:8])
    with open(js, 'w', encoding='utf-8') as f:
        f.write(stub + '\n' + _job_js(jobs))
    r = subprocess.run(['node', js, os.path.join(UNITS, fname), FONT], capture_output=True, text=True)
    if r.returncode:
        raise RuntimeError(r.stderr[-2500:])
    return json.loads(r.stdout)


SCENE_JS = """(() => { const s = makeSvg(%(W)s, %(H)s); %(V)s.deco(s);
  %(V)s.items.forEach(it => s.append(it.circle ? svgEl('circle', { cx: it.circle[0], cy: it.circle[1], r: it.circle[2], fill: it.fill, stroke: '#5C6B73', 'stroke-width': 3 })
    : svgEl('polygon', { points: p6PtsAttr(it.pts), fill: it.fill, stroke: '#5C6B73', 'stroke-width': 3, 'stroke-linejoin': 'round' })));
  return s; })()"""
MEAS = "{ measure: true, unit: 'cm', fs: 20, pad: 58, dots: true }"

TB = extract('u6-polygon.tb.js', {
    'ent': SCENE_JS % dict(W=900, H=470, V='P6_ENT'),
    'ent_items': 'P6_ENT.items.map(it => ({ n: it.n, k: it.circle ? 0 : p6Clean(it.pts).length }))',
    'mobile1': "p6Cards(P6_MOBILE1.map(p6S), { per: 4, cw: 180, ch: 170, shape: { dots: true } })",
    'mobile1_n': 'P6_MOBILE1.map(P => p6Clean(P).length)',
    'art1': "p6Cards(P6_ART1, { per: 6, cw: 190, ch: 160, shape: { dots: true } })",
    'find': "p6Cards(P6_FIND, { per: 6, cw: 190, ch: 160, shape: { dots: true } })",
    'find_ok': "P6_FIND.map(S => !!(S.pts && p6Info(S.pts).ok))",
    'sides': "p6Cards(P6_SIDES, { per: 4, cw: 220, ch: 190, shape: { dots: true } })",
    'sides_n': 'P6_SIDES.map(S => p6Clean(S.pts).length)',
    'signs': 'p6Signs()',
    'ch23': "p6Cards([p6S(p6Blob(7, [1.5, 1.3, 1.6], 5)), p6S(p6Blob(10, [1.6, 1.25], 0))], { per: 2, cw: 220, ch: 190, shape: { dots: true } })",
    'mob': "p6Cards(P6_MOB, { per: 3, cw: 340, ch: 300, shape: %s })" % MEAS,
    'mob_info': 'P6_MOB.map(S => { const i = p6Info(S.pts); return { eqL: !!i.eqL, eqA: !!i.eqA, reg: !!i.reg, n: i.n }; })',
    'reg4': "p6Cards([p6Reg(3, 2), p6Reg(4, 2), p6Reg(5, 2), p6Reg(6, 2)].map(p6S), { per: 4, cw: 170, ch: 160, shape: { dots: true } })",
    'regq': "p6Cards(P6_REGQ, { per: 3, cw: 340, ch: 300, shape: { measure: true, unit: 'cm', fs: 19, pad: 60 } })",
    'regq_info': 'P6_REGQ.map(S => { const i = p6Info(S.pts); return { eqL: !!i.eqL, eqA: !!i.eqA, reg: !!i.reg, n: i.n }; })',
    'hex6': """p6Fig(420, 340, s => {
          const P = p6Reg(6, 2), m = p6Fit(P, 420, 340, 60), Q = P.map(m);
          s.append(svgEl('polygon', { points: p6PtsAttr(Q), fill: '#FFF1C7', stroke: INK, 'stroke-width': 4 }));
          const lab = (i, t) => { const [mid, nv] = p6Out(Q, i); s.append(txt(p6R(mid[0] + nv[0] * 22), p6R(mid[1] + nv[1] * 22), t, 22, { fill: '#2B5FA8' })); };
          lab(0, '2 cm'); lab(2, '□ cm');
          const ang = (i, t) => { const c = p6Cen(Q), v = [c[0] - Q[i][0], c[1] - Q[i][1]], l = Math.hypot(...v); s.append(txt(p6R(Q[i][0] + v[0] / l * 38), p6R(Q[i][1] + v[1] / l * 38), t, 21, { fill: '#B4610F' })); };
          ang(1, '120°'); ang(4, '□°'); })""",
    'segcards': """(() => { const P = p6Blob(5, [1.5], -90); return p6Cards([p6SegCard(P, P[0], P[2]), p6SegCard(P, P[0], [(P[2][0] + P[3][0]) / 2, (P[2][1] + P[3][1]) / 2]),
          p6SegCard(P, [(P[0][0] + P[1][0]) / 2, (P[0][1] + P[1][1]) / 2], [(P[3][0] + P[4][0]) / 2, (P[3][1] + P[4][1]) / 2]), p6SegCard(P, P[1], P[2])], { per: 4, cw: 180, ch: 170 }); })()""",
    'village': """p6ArtFig(440, 210, 40, [P6_VIL.house, P6_VIL.flower, P6_VIL.bird], { bg: s => s.append(svgEl('rect', { x: 0, y: 0, width: 440, height: 210, fill: '#F4FAF2' }), svgEl('rect', { x: 0, y: 192, width: 440, height: 18, fill: '#CFE6C4' })),
          after: s => { s.append(svgEl('circle', { cx: 343, cy: 68, r: 3.5, fill: INK })); [[80, '집'], [222, '꽃'], [330, '새']].forEach(([x, t]) => s.append(txt(x, 202, t, 15))); } })""",
    'vil': 'P6_VIL',
    'ship': 'P6_SHIP',
    'fish': 'P6_FISH',
    'chick': 'P6_CHICK',
    'chick_outline': 'p6Outline(P6_CHICK.pieces.map(p => p.pts)).P',
    'light': 'p6Light()',
    'rabbit': 'P6_RABBIT.map(r => ({ pts: r.pts, n: p6Clean(r.pts).length }))',
    'ws': 'P6_WS',
    'final': "p6Cards([p6S(p6Blob(8, [1.5, 1.3], 10)), p6S([[0, 0], [3, .4], [2.6, 2.2], [.4, 1.8]]), p6Drop(), p6S(p6Blob(6, [1.5, 1.2, 1.4], 30)), { open: [[0, 2], [1.2, 0], [2.4, 2], [.4, 2]] }], { per: 5, cw: 190, ch: 170, shape: { dots: true } })",
    'pb': 'P6_PB',
    'tg': 'P6_TG',
    'reg5': 'p6Reg(5, 3)',
})

ST = extract('u6-polygon.st.js', {
    'room': 'p6sRoomFig()',
    'room_items': 'P6S_ROOM.items.map(it => ({ n: it.n, k: it.circle ? 0 : p6Clean(it.pts).length }))',
    'stk': "p6Cards(P6S_STK, { per: 4, cw: 180, ch: 170, shape: { dots: true } })",
    'stk_n': 'P6S_STK.map(S => p6Clean(S.pts).length)',
    'stkn': 'P6S_STKN',
    'art': "p6Cards(P6S_ART, { per: 6, cw: 190, ch: 160, shape: { dots: true } })",
    'artcat': 'P6S_ARTCAT',
    'find': "p6Cards(P6S_FIND, { per: 6, cw: 190, ch: 160, shape: { dots: true } })",
    'find_ok': "P6S_FIND.map(S => !!(S.pts && p6Info(S.pts).ok))",
    'sides': "p6Cards(P6S_SIDES, { per: 4, cw: 220, ch: 190, shape: { dots: true } })",
    'sides_n': 'P6S_SIDES.map(S => p6Clean(S.pts).length)',
    'signs': 'p6sSigns()',
    'ch3': "p6Cards([p6S(p6Blob(9, [1.5, 1.3, 1.6], 5)), p6S(p6Blob(10, [1.6, 1.25], 0))], { per: 2, cw: 220, ch: 190, shape: { dots: true } })",
    'ch3_n': '[p6Blob(9, [1.5, 1.3, 1.6], 5), p6Blob(10, [1.6, 1.25], 0)].map(P => p6Clean(P).length)',
    'tile': "p6Cards(P6S_TILE, { per: 3, cw: 340, ch: 300, shape: %s })" % MEAS,
    'tile_info': 'P6S_TILE.map(S => { const i = p6Info(S.pts); return { eqL: !!i.eqL, eqA: !!i.eqA, reg: !!i.reg, n: i.n, A: p6Angles(S.pts).map(Math.round) }; })',
    'regq': "p6Cards(P6S_REGQ, { per: 3, cw: 340, ch: 300, shape: { measure: true, unit: 'cm', fs: 19, pad: 60 } })",
    'regq_info': 'P6S_REGQ.map(S => { const i = p6Info(S.pts); return { eqL: !!i.eqL, eqA: !!i.eqA, reg: !!i.reg, n: i.n }; })',
    'oct': 'p6sOctFig()',
    'octv': 'P6S_OCT',
    'dg': 'P6S_DG',
    'dgn': 'P6S_DGN',
    'qd': 'P6S_QD',
    'board': 'p6sBoardFig()',
    'tree': 'P6S_TREE',
    'star': 'P6S_STAR',
    'band': 'p6sBandFig()',
    'bandpts': 'P6S_BAND',
    'bandex': 'P6S_BANDEX',
    'hex1': 'P6S_HEX1',
    'hex2': 'P6S_HEX2',
    'bighex': 'P6S_BIGHEX',
    'area': 'P6S_AREA',
    'robot': 'P6S_ROBOT.map(r => ({ pts: r.pts, n: p6Clean(r.pts).length }))',
    'final': "p6Cards(P6S_FINAL, { per: 5, cw: 190, ch: 170, shape: { dots: true } })",
    'final_ok': "P6S_FINAL.map(S => !!(S.pts && p6Info(S.pts).ok))",
    'final_n': "P6S_FINAL.map(S => S.pts ? p6Clean(S.pts).length : 0)",
    'reg52': 'p6Reg(5, 2)',
})
PB = TB['pb']


# ================================================================ SVG 조각
def F(v):
    return ('%.2f' % v).rstrip('0').rstrip('.')


def svg(w, h, body):
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %s %s" width="%s" height="%s">'
            '<rect x="0" y="0" width="%s" height="%s" fill="#fff"/>%s</svg>') % (F(w), F(h), F(w), F(h), F(w), F(h), body)


def T(x, y, t, size=20, fill=INK, anchor='middle', weight='normal'):
    return ('<text x="%s" y="%s" font-size="%s" text-anchor="%s" dominant-baseline="middle" font-family="%s" fill="%s" font-weight="%s">%s</text>'
            % (F(x), F(y), F(size), anchor, FONT, fill, weight, t))


def pts_attr(P):
    return ' '.join('%s,%s' % (F(p[0]), F(p[1])) for p in P)


def poly(P, fill='none', stroke=INK, sw=3, dash=None, extra=''):
    return ('<polygon points="%s" fill="%s" stroke="%s" stroke-width="%s" stroke-linejoin="round"%s%s/>'
            % (pts_attr(P), fill, stroke, F(sw), (' stroke-dasharray="%s"' % dash) if dash else '', extra))


_cache = {}


def png(svgtext, px=1400):
    k = hashlib.md5((svgtext + str(px)).encode('utf-8')).hexdigest()
    if k not in _cache:
        p = os.path.join(TMP, k + '.png')
        svg_to_png(svgtext, p, width_px=px)
        _cache[k] = p
    return _cache[k]


def pic(s, svgtext, mm=120, px=1400):
    s.picture(png(svgtext, px), width_mm=mm)


def vb_w(svgtext):
    """viewBox 가로·세로"""
    import re
    m = re.search(r'viewBox="([\d.\- ]+)"', svgtext)
    a = [float(x) for x in m.group(1).split()]
    return a[2], a[3]


def appfig(s, svgtext, mm):
    """앱 그림(흰 배경 없음)에 흰 바탕을 깔아 넣기"""
    pic(s, svgtext.replace('>', '><rect x="-2000" y="-2000" width="6000" height="6000" fill="#fff"/>', 1), mm)


# ---------------------------------------------------------------- 점 종이(앱과 같은 칸)
def dots_svg(cols, rows, gap=50, kind='sq', given=(), M=34, r=5.5):
    out, P = [], []
    if kind == 'sq':
        W, Hh = (cols - 1) * gap + 2 * M, (rows - 1) * gap + 2 * M
        for rr in range(rows):
            for c in range(cols):
                P.append((M + c * gap, M + rr * gap))
        at = lambda cr: P[cr[1] * cols + cr[0]]
    else:
        dy = gap * H3
        W, Hh = (cols - 1) * gap + gap / 2 + 2 * M, (rows - 1) * dy + 2 * M
        for rr in range(rows):
            for c in range(cols):
                P.append((M + c * gap + (rr % 2) * gap / 2, M + rr * dy))
        at = lambda cr: P[cr[1] * cols + cr[0]]
    for g in given:
        Q = [at(cr) for cr in g]
        out.append('<polyline points="%s" fill="none" stroke="%s" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" opacity=".75"/>' % (pts_attr(Q), GOLD))
        out.append('<polyline points="%s" fill="none" stroke="%s" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>' % (pts_attr(Q), BLUE))
    for p in P:
        out.append('<circle cx="%s" cy="%s" r="%s" fill="#6E7C86"/>' % (F(p[0]), F(p[1]), F(r)))
    return svg(W, Hh, ''.join(out))


def circ_svg(n=12, R=170, M=34, label=None):
    W = 2 * R + 2 * M + 10
    out = ['<circle cx="%s" cy="%s" r="%s" fill="#F7F4EC" stroke="#E2D8C3" stroke-width="3"/>' % (F(W / 2), F(W / 2), F(R))]
    for i in range(n):
        t = -math.pi / 2 + i * 2 * math.pi / n
        out.append('<circle cx="%s" cy="%s" r="8" fill="#9A6B3E"/>' % (F(W / 2 + R * math.cos(t)), F(W / 2 + R * math.sin(t))))
    Hh = W + (44 if label else 0)
    if label:
        out.append(T(W / 2, W + 20, label, 26))
    return svg(W, Hh, ''.join(out))


def row_svg(svgs, gap=20):
    """여러 SVG를 가로로 이어 붙이기(같은 높이로 맞춤 없이 위 맞춤)"""
    import re
    x, Hm, body = 0, 0, []
    for t in svgs:
        w, h = vb_w(t)
        inner = re.sub(r'^<svg[^>]*>', '', t)[:-6]
        body.append('<g transform="translate(%s,0)">%s</g>' % (F(x), inner))
        x += w + gap
        Hm = max(Hm, h)
    return svg(x - gap, Hm, ''.join(body))


# ---------------------------------------------------------------- 모양 조각(패턴 블록) 그림
def bbox(polys):
    xs = [p[0] for P in polys for p in P]
    ys = [p[1] for P in polys for p in P]
    return min(xs), min(ys), max(xs), max(ys)


def lattice(P, origin, U, tf, cid):
    """삼각 격자 선(조각의 변이 놓일 수 있는 선)을 모양 P 안에만 옅게"""
    ox, oy = origin
    x0, y0, x1, y1 = bbox([P])
    lines = []
    N = int(max(x1 - x0, y1 - y0) / 0.5) + 6
    for j in range(-N, N + 1):
        y = oy + j * H3
        if y0 - 1e-6 <= y <= y1 + 1e-6:
            lines.append(((x0 - 1, y), (x1 + 1, y)))
    for d in ((0.5, -H3), (-0.5, -H3)):
        for i in range(-3 * N, 3 * N + 1):
            p = (ox + i, oy)
            a = (p[0] - 20 * d[0], p[1] - 20 * d[1])
            b = (p[0] + 20 * d[0], p[1] + 20 * d[1])
            lines.append((a, b))
    out = ['<clipPath id="%s"><polygon points="%s"/></clipPath><g clip-path="url(#%s)" stroke="#BFCAD4" stroke-width="2" stroke-dasharray="3 5">' % (cid, pts_attr([tf(q) for q in P]), cid)]
    for a, b in lines:
        A, B = tf(a), tf(b)
        out.append('<line x1="%s" y1="%s" x2="%s" y2="%s"/>' % (F(A[0]), F(A[1]), F(B[0]), F(B[1])))
    out.append('</g>')
    return ''.join(out)


_cid = [0]


def pb_svg(pieces=(), targets=(), origins=None, pad=0.25, U=100, labels=(), mono_targets=False):
    """pieces [(k, pts)], targets [pts] (금색 점선), origins: 격자 원점(타깃마다, None이면 격자 없음)
    돌려줌: (svg 글, 가로 단위 수) — 단위 1 = 모양 조각 한 변"""
    allp = [p for _, p in pieces] + list(targets)
    x0, y0, x1, y1 = bbox(allp)
    W, Hh = x1 - x0 + 2 * pad, y1 - y0 + 2 * pad
    tf = lambda p: ((p[0] - x0 + pad) * U, (p[1] - y0 + pad) * U)
    out = []
    for i, P in enumerate(targets):
        out.append(poly([tf(p) for p in P], fill='#FFFBEA', stroke='none'))
        if origins and origins[i] is not None:
            _cid[0] += 1
            out.append(lattice(P, origins[i], U, tf, 'lc%d' % _cid[0]))
    for k, P in pieces:
        K = PB[k]
        out.append(poly([tf(p) for p in P], fill=K['fill'], stroke=K['stroke'], sw=3))
    for i, P in enumerate(targets):
        out.append(poly([tf(p) for p in P], stroke=GOLD if not mono_targets else '#9A7B3E', sw=4.5, dash='12 7'))
    for (x, y, t, fs) in labels:
        X, Y = tf((x, y))
        out.append(T(X, Y, t, fs))
    return svg(W * U, Hh * U, ''.join(out)), W


def pb_real(s, pieces=(), targets=(), origins=None, pad=0.25, labels=()):
    """실제 모양 조각 크기(한 변 25.4 mm)로 넣기 — 180 mm를 넘으면 줄임"""
    t, wu = pb_svg(pieces, targets, origins, pad, labels=labels)
    mm = wu * MM_PB
    if mm > 180:
        mm = 180
    pic(s, t, mm, px=int(min(2400, wu * 260)))
    return mm


def pb_set_svg(keys=('tri', 'sq', 'par', 'trap', 'rh', 'hex'), U=90, names=True, letters=None):
    """모양 조각 6가지를 한 줄로(실제 비율)"""
    out, x = [], 20
    Hmax = 2 * H3
    for i, k in enumerate(keys):
        P = PB[k]['pts']
        x0, y0, x1, y1 = bbox([P])
        Q = [(x + (p[0] - x0) * U, 30 + (p[1] - y0) * U + (Hmax - (y1 - y0)) * U / 2) for p in P]
        out.append(poly(Q, fill=PB[k]['fill'], stroke=PB[k]['stroke'], sw=3))
        cx = x + (x1 - x0) * U / 2
        if letters and (x1 - x0) * U < 170:
            Q = [(q[0] + (170 - (x1 - x0) * U) / 2, q[1]) for q in Q]
            out[-1] = poly(Q, fill=PB[k]['fill'], stroke=PB[k]['stroke'], sw=3)
            cx = x + 85
        lab = (letters[i] if letters else '') + (('  ' if letters else '') + PB[k]['name'] if names else '')
        out.append(T(cx, 30 + Hmax * U + 28, lab, 24))
        x += max((x1 - x0) * U, 170 if letters else 130) + 40
    return svg(x - 20, 30 + Hmax * U + 50, ''.join(out))


def tg_set_svg(U=80):
    TG = TB['tg']
    order = [('big', 2), ('mid', 1), ('sm', 2), ('sq', 1), ('par', 1)]
    out, x = [], 20
    for k, c in order:
        P = TG[k]['pts']
        x0, y0, x1, y1 = bbox([P])
        for _ in range(c):
            Q = [(x + (p[0] - x0) * U, 20 + (p[1] - y0) * U + (1 - (y1 - y0)) * U) for p in P]
            out.append(poly(Q, fill=TG[k]['fill'], stroke=TG[k]['stroke'], sw=3))
            x += (x1 - x0) * U + 24
    return svg(x, 20 + U + 20, ''.join(out))


# ---------------------------------------------------------------- 꼭짓점 이름이 있는 도형(대각선 긋기)
def shape_cells(shapes, per=None, cw=300, ch=240, names=True, scale=None, pad=40, label=True, fill='#EEF5FD'):
    """shapes: [{pts, label}] — scale(px/단위)을 주면 그 크기 그대로(1단위 = scale px)"""
    per = per or len(shapes)
    rows = (len(shapes) + per - 1) // per
    out = []
    for i, S in enumerate(shapes):
        P = S['pts']
        gx, gy = 10 + (i % per) * (cw + 14), 10 + (i // per) * (ch + 14)
        x0, y0, x1, y1 = bbox([P])
        top = 40 if label else 0
        k = scale or min((cw - 2 * pad) / max(x1 - x0, 1e-6), (ch - top - 2 * pad) / max(y1 - y0, 1e-6))
        ox = gx + (cw - (x1 - x0) * k) / 2 - x0 * k
        oy = gy + top + (ch - top - (y1 - y0) * k) / 2 - y0 * k
        Q = [(ox + p[0] * k, oy + p[1] * k) for p in P]
        out.append('<rect x="%s" y="%s" width="%s" height="%s" rx="12" fill="#fff" stroke="#CBD8E6" stroke-width="2"/>' % (F(gx), F(gy), F(cw), F(ch)))
        if label:
            out.append(T(gx + cw / 2, gy + 24, S.get('label', KO[i]), 24))
        out.append(poly(Q, fill=fill, sw=3.5))
        cx, cy = sum(q[0] for q in Q) / len(Q), sum(q[1] for q in Q) / len(Q)
        for j, q in enumerate(Q):
            out.append('<circle cx="%s" cy="%s" r="5" fill="%s"/>' % (F(q[0]), F(q[1]), INK))
            if names:
                vx, vy = q[0] - cx, q[1] - cy
                L = math.hypot(vx, vy) or 1
                out.append(T(q[0] + vx / L * 28, q[1] + vy / L * 28, JA[j], 28, weight='bold'))
    return svg(per * (cw + 14) + 6, rows * (ch + 14) + 6, ''.join(out))


def fold_svg():
    A = [(60, 50), (310, 50), (310, 300), (60, 300)]
    out = [poly(A, fill='#F7B2C4', stroke='#C2456A', sw=3)]
    for j, p in enumerate(A):
        out.append('<circle cx="%s" cy="%s" r="11" fill="#fff" stroke="#C2456A" stroke-width="3"/>' % p)
        dx = -26 if p[0] < 100 else 26
        dy = -22 if p[1] < 100 else 22
        out.append(T(p[0] + dx, p[1] + dy, JA[j], 24))
    return svg(370, 350, ''.join(out))


def game_svg(regions, vx, vy, vw, vh):
    out = []
    for r in regions:
        out.append(poly([(p[0] - vx, p[1] - vy) for p in r['pts']], fill='#fff', sw=3))
    for r in regions:
        for p in r['pts']:
            out.append('<circle cx="%s" cy="%s" r="3.5" fill="%s"/>' % (F(p[0] - vx), F(p[1] - vy), INK))
    return svg(vw, vh, ''.join(out))


def blank_box(w=900, h=300, text=''):
    return svg(w, h, '<rect x="3" y="3" width="%s" height="%s" rx="14" fill="#fff" stroke="#B9C6D3" stroke-width="3" stroke-dasharray="10 7"/>%s'
               % (F(w - 6), F(h - 6), T(w / 2, 26, text, 20, '#8795A1') if text else ''))


def ws_table(s, rows):
    s.table([list(r) for r in rows], header=False, row_h=2600)


# ---------------------------------------------------------------- 계산(정답 확인)
def dist(a, b):
    return math.hypot(a[0] - b[0], a[1] - b[1])


def ndiag(n):
    return n * (n - 3) // 2


def quad_diag(P):
    """사각형 ㄱㄴㄷㄹ의 두 대각선: (길이1, 길이2, 만나는 각(작은 쪽))"""
    u = (P[2][0] - P[0][0], P[2][1] - P[0][1])
    v = (P[3][0] - P[1][0], P[3][1] - P[1][1])
    a, b = math.hypot(*u), math.hypot(*v)
    ang = math.degrees(math.acos(abs(u[0] * v[0] + u[1] * v[1]) / (a * b)))
    return a, b, ang


def area(P):
    s = 0
    for i in range(len(P)):
        a, b = P[i], P[(i + 1) % len(P)]
        s += a[0] * b[1] - b[0] * a[1]
    return abs(s) / 2


TRI_A = area(PB['tri']['pts'])


def n_fill(P, k):
    """모양 P를 조각 k만으로 채울 때 조각 수(넓이로)"""
    v = area(P) / area(PB[k]['pts'])
    assert abs(v - round(v)) < 1e-3, (k, v)
    return int(round(v))


def why(s, q, n=2):
    s.ask(q, blank=False)
    s.lines(n)


def help_(s, t):
    s.text('도움  ' + t)


PBN = ['정삼각형', '정사각형', '평행사변형', '사다리꼴', '마름모', '정육각형']
NAMES6 = ['삼각형', '사각형', '오각형', '육각형', '칠각형', '팔각형']


def opts(*o):
    return '( ' + ' / '.join(o) + ' )'


def real_cm(s, shapes, per=2, cw=560, ch=420):
    """1단위 = 1 cm 로 넣기(자로 재기)"""
    t = shape_cells(shapes, per=per, cw=cw, ch=ch, scale=100, pad=40)
    w, _ = vb_w(t)
    pic(s, t, w / 10, px=int(w * 1.6))


def quad_rows(shapes):
    rows = []
    for S in shapes:
        a, b, g = quad_diag(S['pts'])
        rows.append((S['label'], a, b, g))
    return rows


def dicetable(s):
    s.table([['눈의 수', '1', '2', '3', '4', '5', '6'], ['다각형', '삼각형', '사각형', '오각형', '육각형', '칠각형', '팔각형']])


def hex_targets(xs, y=0.0):
    """정육각형(모양 조각 크기) 여러 개를 가로로"""
    return [[(x + px, y + py) for px, py in ((0, 0), (1, 0), (1.5, -H3), (1, -2 * H3), (0, -2 * H3), (-0.5, -H3))] for x in xs]


# ================================================================ 교과서 차시 버전
def build_tb(level):
    C = level == '도전형'
    s = Sheet(unit_label='4-2 수학 6. 다각형(교과서 차시)', level=level, grade_label='4학년')
    A = []

    # ---------------- 1차시
    ent = TB['ent_items']
    s.lesson(1, '개념 찾기(S)', '단원 도입 ― 어린이 미술관에서 도형을 찾아요',
             '어린이 미술관의 작품에서 어떤 도형을 찾을 수 있을까요? 삼각형, 사각형보다 변이 많은 도형은 무엇이라고 부를까요?')
    s.scene(None, '은하네 가족은 어린이 미술관에 갔어요. 입구의 물개·고래·나비 작품, 천장에 매달린 모빌에서 여러 가지 도형을 찾아요.')
    s.step('① 찾아 보기', '미술관 입구의 물개, 고래, 나비 작품에서 도형 찾기')
    appfig(s, TB['ent'], 150)
    if not C:
        help_(s, '작품을 이루는 조각을 하나씩 손가락으로 짚어 봐요. 곧은 선인지 굽은 선인지 살펴봐요.')
    want = ['물개 몸', '물개 꼬리지느러미', '고래 몸', '나비 몸', '고래 물줄기']
    kk = {it['n']: it['k'] for it in ent}
    s.table([['작품 조각'] + want, ['둘러싼 선'] + ['곧은 선 (   )개\n/ 굽은 선'] * len(want)])
    a1 = '1차시  ① ' + ', '.join('%s %s' % (w, ('곧은 선 %d개' % kk[w]) if kk[w] else '굽은 선') for w in want)
    s.step('② 떠올리기', '배운 내용 떠올리기')
    s.choices([('두 점을 곧게 이은 선은?', opts('선분', '반직선', '직선')),
               ('사각형의 변과 꼭짓점은 각각 몇 개?', '( 변 3개, 꼭짓점 3개 /\n변 4개, 꼭짓점 4개 /\n변 4개, 꼭짓점 3개 )'),
               ('마주 보는 두 쌍의 변이 서로 평행하고\n네 변의 길이가 모두 같은 사각형은?', opts('사다리꼴', '마름모', '직사각형'))])
    a1 += '  ② 선분, 변 4개·꼭짓점 4개, 마름모'
    s.step('③ 세어 보기', '천장에 매달린 모빌의 도형 가~라의 변 세기')
    appfig(s, TB['mobile1'], 140)
    if not C:
        help_(s, '한 변을 짚고 시작해서 한 바퀴 돌며 세어요. 센 변에 작은 표시를 하면 두 번 세지 않아요.')
    s.table([['도형', '가', '나', '다', '라'], ['변의 수', '(     )개', '(     )개', '(     )개', '(     )개']])
    m1 = TB['mobile1_n']
    assert m1 == [5, 4, 3, 6]
    a1 += '  ③ 가 %d개, 나 %d개, 다 %d개, 라 %d개' % tuple(m1)
    s.step('④ 궁금해하기', '“천장에 매달린 저 도형은 무엇이라고 불러야 할까?”')
    s.fill('삼각형은 변이 ( 3개 / 4개 ), 사각형은 변이 ( 4개 / 5개 )예요. 도형의 이름은 ( 변의 수 / 색깔 )와 관련이 있어요.')
    a1 += '  ④ 3개, 4개, 변의 수'
    s.step('⑤ 확인하기', '우리 주변의 도형과 알고 싶은 것')
    s.ask('우리 주변이나 미술관에서 본 도형을 써 보세요.', blank=False)
    if not C:
        help_(s, '‘텔레비전은 직사각형’처럼 물건 이름과 도형 이름을 짝지어 써요.')
    s.lines(1)
    s.ask('이 단원에서 알고 싶은 것을 써 보세요.', blank=False)
    s.lines(1)
    a1 += '  ⑤ (예) 텔레비전·책상은 직사각형, 교통안전 표지는 삼각형, 접시는 원이에요. / 변이 5개인 도형은 무엇이라고 부르는지 알고 싶어요.'
    if C:
        s.step('⑥ 도전하기', '교실에서 찾은 물건의 도형')
        s.choices([('삼각자에서 찾을 수 있는 도형은?', opts('삼각형', '사각형', '원')),
                   ('창문과 칠판에서 찾을 수 있는 도형은?', opts('삼각형', '사각형', '원')),
                   ('칠교판의 조각에서 찾을 수 있는 도형을\n모두 고르면?', opts('삼각형', '사각형', '원'))])
        why(s, '칠교판의 조각에서 원을 찾을 수 없는 까닭을 써 보세요.', 1)
        a1 += '  ⑥ 삼각형, 사각형, 삼각형·사각형 (예) 칠교 조각은 모두 곧은 선으로만 둘러싸여 있고 굽은 선이 없기 때문이에요.'
    A.append(a1)

    # ---------------- 2~3차시
    s.lesson('2~3', '개념 구축하기(O)', '다각형을 알아볼까요', '다각형은 어떤 도형일까요? 다각형의 이름은 어떻게 정할까요?')
    s.scene(None, '은하가 어린이 미술관 입구의 작품에서 찾은 도형을 살펴봐요.')
    s.step('① 분류하기', '선의 특징에 따라 도형 가~바를 나누기')
    appfig(s, TB['art1'], 175)
    if not C:
        help_(s, '굽은 선이 조금이라도 있는지 살펴봐요. 선분은 두 점을 곧게 이은 선이에요.')
    s.labeled([('선분으로만\n둘러싸인 도형', ''), ('굽은 선이\n있는 도형', '')], row_h=3402)
    s.fill('약속: 선분으로만 둘러싸인 도형을 ( 다각형 / 원 / 곡선 도형 )이라고 합니다.')
    a23 = '2~3차시  ① 선분으로만: 나, 다, 라, 마 / 굽은 선: 가, 바 / 다각형'
    s.step('② 찾아 보기', '다각형을 모두 찾기')
    appfig(s, TB['find'], 175)
    ok = [KO[i] for i, v in enumerate(TB['find_ok']) if v]
    assert ok == ['가', '나', '마', '바']
    s.ask('다각형을 모두 찾아 기호를 써 보세요.')
    s.choices([('다는 왜 다각형이 아닐까요?', '( 굽은 선이 포함되어 있어서 /\n변이 너무 적어서 / 열려 있어서 )'),
               ('라는 왜 다각형이 아닐까요?', '( 굽은 선이 있어서 /\n일부분이 열려 있어서 / 변의 길이가 달라서 )')])
    a23 += '  ② %s / 굽은 선이 포함되어 있어서, 일부분이 열려 있어서' % ', '.join(ok)
    s.step('③ 그려 보기', '주어진 선분(노란 선)에 이어 다각형 완성하기 ①, ②')
    pic(s, dots_svg(10, 6, 50, 'sq', [[[1, 4], [1, 1], [3, 1]], [[6, 1], [8, 2], [8, 4]]]), 120)
    if not C:
        help_(s, '노란 선의 끝에서 곧은 선만 이어 그리고, 처음 점으로 돌아와 닫아요.')
    s.page_break()
    s.step('③ 그려 보기 (이어서)', '점 종이에 팔각형, 육각형, 오각형을 그리고 변과 꼭짓점 세기')
    pic(s, dots_svg(12, 7, 46), 150)
    s.table([['', '팔각형', '육각형', '오각형'], ['변의 수', '(     )개', '(     )개', '(     )개'], ['꼭짓점의 수', '(     )개', '(     )개', '(     )개']])
    s.fill('알게 된 점: 다각형은 변의 수와 꼭짓점의 수가 ( 같아요 / 달라요 ).')
    a23 += '  ③ (예) 주어진 선분에 이어 닫힌 다각형 / 팔각형 8, 8 · 육각형 6, 6 · 오각형 5, 5 / 같아요'
    s.step('④ 약속하기', '다각형 가~아를 변의 수에 따라 나누기')
    appfig(s, TB['sides'], 150)
    if not C:
        help_(s, '변에 1, 2, 3 …처럼 번호를 붙이며 세어요. 오목하게 들어간 곳의 변도 빠뜨리지 않아요.')
    s.table([['변 5개', '변 6개', '변 7개', '변 8개'], ['', '', '', '']], row_h=3402)
    if not C:
        s.wordbox(['오각형', '육각형', '칠각형', '팔각형'])
    s.fill('약속: 다각형은 변의 수에 따라 변이 5개이면 (          ), 변이 6개이면 (          ), 변이 7개이면 (          ), '
           '변이 8개이면 (          )이라고 부릅니다.')
    sn = TB['sides_n']
    grp = {n: ', '.join(KO[i] for i, v in enumerate(sn) if v == n) for n in (5, 6, 7, 8)}
    assert grp == {5: '가, 바', 6: '다, 마', 7: '나, 아', 8: '라, 사'}
    a23 += '  ④ 변 5개: %s / 6개: %s / 7개: %s / 8개: %s / 오각형, 육각형, 칠각형, 팔각형' % (grp[5], grp[6], grp[7], grp[8])
    s.step('⑤ 확인하기', '교통안전 표지에서 다각형 찾기, 도형판에 작품 만들기')
    appfig(s, TB['signs'], 130)
    s.ask('횡단보도 표지: (          )   자전거 전용 표지: (          )   정지 표지: (          )', blank=False)
    s.text('도형판(점 종이)에 다각형을 3개 이상 그려 작품을 만들어 보세요.')
    pic(s, dots_svg(11, 8, 44), 110)
    s.ask('작품의 이름과 이용한 다각형을 설명해 보세요.', blank=False)
    if not C:
        help_(s, '‘나는 ~과 ~을 이용하여 ~을 만들었어. ~은 변과 꼭짓점이 ~개씩이야.’ 꼴로 써요.')
    s.lines(2)
    a23 += '  ⑤ 오각형, 사각형, 팔각형 / (예) 나는 사각형과 육각형을 이용하여 비행기를 만들었어. 사각형은 변과 꼭짓점이 4개씩이야.'
    if C:
        s.step('⑥ 도전하기', '다각형의 이름 알아보기')
        appfig(s, TB['ch23'], 80)
        s.ask('가의 이름: (            )      나의 이름: (            )', blank=False)
        s.choices([('팔각형을 보고 옳게 설명한 것은?\n㉠ 변이 9개입니다.  ㉡ 꼭짓점이 8개입니다.\n㉢ 다각형의 이름은 칠각형입니다.', opts('㉠', '㉡', '㉢'))])
        why(s, '나의 이름을 어떻게 알았는지 써 보세요.', 1)
        a23 += '  ⑥ 칠각형, 십각형 / ㉡ (예) 꼭짓점을 하나씩 짚으며 세었더니 10개라서 변도 10개인 십각형이에요.'
    A.append(a23)

    # ---------------- 4차시
    s.lesson(4, '개념 구축하기(O)', '정다각형을 알아볼까요', '변의 길이와 각의 크기에 따라 다각형을 어떻게 분류할 수 있을까요?')
    s.scene(None, '제1 전시실 천장의 모빌에 다각형 가~바가 매달려 있어요. 은하가 자와 각도기로 변의 길이와 각의 크기를 재었어요.')
    s.step('① 분류하기', '변의 길이와 각의 크기에 따라 나누기')
    appfig(s, TB['mob'], 150)
    mi = TB['mob_info']
    eqL = ', '.join(KO[i] for i, v in enumerate(mi) if v['eqL'])
    eqA = ', '.join(KO[i] for i, v in enumerate(mi) if v['eqA'])
    both = ', '.join(KO[i] for i, v in enumerate(mi) if v['reg'])
    assert (eqL, eqA, both) == ('나, 다, 라, 마, 바', '나, 다, 라, 마', '나, 다, 라, 마')
    s.labeled([('변의 길이가\n모두 같은 다각형', ''), ('각의 크기가\n모두 같은 다각형', ''), ('두 가지가\n모두 같은 다각형', '')], label_mm=45, row_h=3402)
    if not C:
        help_(s, '바는 변의 길이는 모두 같지만 각의 크기는 70°와 110°예요.')
    a4 = '4차시  ① 변의 길이가 모두 같은: %s / 각의 크기가 모두 같은: %s / 두 가지 모두: %s' % (eqL, eqA, both)
    s.step('② 약속하기', '정다각형의 뜻')
    appfig(s, TB['reg4'], 125)
    s.fill(['( 변의 길이가 모두 같고, 각의 크기가 모두 같은 / 변의 길이만 모두 같은 / 각의 크기만 모두 같은 ) 다각형을 정다각형이라고 합니다.',
            '위의 정다각형은 차례로 정삼각형, ( 정사각형 / 직사각형 ), ( 정오각형 / 오각형 ), 정육각형이에요.'])
    a4 += '  ② 변의 길이가 모두 같고, 각의 크기가 모두 같은 / 정사각형, 정오각형'
    s.step('③ 찾아 보기', '도형 가~마에서 정다각형 찾기')
    appfig(s, TB['regq'], 150)
    rq = TB['regq_info']
    regs = ', '.join(KO[i] for i, v in enumerate(rq) if v['reg'])
    assert regs == '가, 다, 마' and rq[1]['eqA'] and not rq[1]['eqL'] and not rq[3]['eqA'] and not rq[3]['eqL']
    s.ask('정다각형을 모두 찾아 기호를 써 보세요.')
    s.choices([('나가 정다각형이 아닌 까닭은?', '( 각의 크기는 모두 같지만 변의 길이가 모두 같지 않아서 /\n변의 길이는 모두 같지만 각의 크기가 모두 같지 않아서 /\n비스듬히 놓여 있어서 )'),
               ('라가 정다각형이 아닌 까닭은?', '( 변의 길이와 각의 크기가 모두 같지 않아서 /\n변이 6개라서 / 굽은 선이 있어서 )')])
    a4 += '  ③ %s / 각의 크기는 모두 같지만 변의 길이가 모두 같지 않아서, 변의 길이와 각의 크기가 모두 같지 않아서' % regs
    s.step('④ 구하기', '정육각형을 보고 □ 안에 알맞은 수 쓰기')
    appfig(s, TB['hex6'], 70)
    s.ask('□ cm = (       ) cm        □° = (       )°', blank=False)
    if not C:
        help_(s, '정다각형은 변의 길이가 모두 같고, 각의 크기도 모두 같아요.')
    a4 += '  ④ 2 cm, 120°'
    s.step('⑤ 만들어 보기', '원형 도형판(점 12개)에 정삼각형, 정사각형, 정육각형 만들기')
    pic(s, row_svg([circ_svg(label='정삼각형'), circ_svg(label='정사각형'), circ_svg(label='정육각형')], 30), 150)
    if not C:
        help_(s, '정삼각형은 4칸씩, 정사각형은 3칸씩, 정육각형은 2칸씩 건너뛰며 점을 이어요.')
    s.fill('정사각형은 변이 (     )개, 꼭짓점이 (     )개인 정다각형이에요. 정다각형의 변의 수가 많아질수록 모양이 ( 원 / 삼각형 )에 가까워져요.')
    a4 += '  ⑤ 12개 점에서 4칸·3칸·2칸씩 건너뛰어 잇기 / 4, 4, 원'
    if C:
        s.step('⑥ 도전하기', '정다각형 문제')
        s.choices([('• 각의 크기가 모두 같습니다.\n• 길이가 같은 선분 9개로 둘러싸여 있습니다.\n설명하는 도형의 이름은?', opts('구각형', '정구각형', '정팔각형'))])
        s.ask('한 변이 8 cm인 정육각형이에요. 다른 한 변의 길이는 (       ) cm, 한 각의 크기는 (       )°예요.', blank=False)
        why(s, '직사각형이 정다각형이 아닌 까닭을 써 보세요.', 1)
        a4 += '  ⑥ 정구각형 / 8 cm, 120° / 네 각의 크기는 같지만 네 변의 길이가 같지 않기 때문이에요.'
    A.append(a4)

    # ---------------- 5차시
    s.lesson(5, '개념 구축하기(O)', '대각선을 알아볼까요', '다각형에서 대각선은 어떤 선분일까요? 사각형의 대각선에는 어떤 성질이 있을까요?')
    s.scene(None, '제2 전시실 체험 공간이에요. 은하가 색종이를 반으로 접었다 펴요.')
    s.step('① 접어 보기', '색종이를 꼭짓점끼리 맞추어 삼각형 모양으로 두 번 접었다 펴기')
    pic(s, fold_svg(), 55)
    s.text('색종이를 접었다 편 선을 그림에 그려 보세요.')
    s.ask('색종이에 생긴 선은 (     )개이고, 서로 ( 마주 보는 / 이웃한 ) 꼭짓점을 이은 선이에요.', blank=False)
    a5 = '5차시  ① 2개, 마주 보는'
    s.step('② 이어 보기', '사각형 ㄱㄴㄷㄹ에서 서로 이웃하지 않는 두 꼭짓점끼리 잇기')
    pic(s, shape_cells([{'pts': [[0, 0], [4.2, 0], [5, 2.8], [.6, 3.2]], 'label': '사각형 ㄱㄴㄷㄹ'}], cw=460, ch=330), 75)
    if not C:
        help_(s, '꼭짓점 ㄱ과 이웃한 꼭짓점은 ㄴ과 ㄹ이에요.')
    s.ask('그은 선분은 선분 ㄱㄷ과 선분 ( ㄴㄹ / ㄱㄴ / ㄷㄹ )이에요.', blank=False)
    a5 += '  ② ㄴㄹ'
    s.step('③ 약속하기', '대각선의 뜻')
    s.fill('다각형에서 선분 ㄱㄷ, 선분 ㄴㄹ과 같이 서로 ( 이웃하지 않는 / 이웃하는 ) 두 꼭짓점을 이은 선분을 ( 대각선 / 변 / 수선 )이라고 합니다.')
    appfig(s, TB['segcards'], 130)
    s.ask('대각선을 옳게 그은 것을 골라 기호를 써 보세요.')
    a5 += '  ③ 이웃하지 않는, 대각선 / 가'
    s.step('④ 그어 보기', '삼각형, 사각형, 오각형에 대각선을 모두 긋고 세기')
    T5 = [{'pts': [[0, 3], [3.6, 3], [1.4, 0]], 'label': '삼각형'}, {'pts': [[0, 0], [3.8, .4], [4.4, 3], [.4, 3.2]], 'label': '사각형'},
          {'pts': [[1.8, 0], [4, 1.4], [3.4, 3.6], [.6, 3.8], [-.2, 1.6]], 'label': '오각형'}]
    pic(s, shape_cells(T5, cw=300, ch=280, names=False), 150)
    s.table([['', '삼각형', '사각형', '오각형'], ['대각선의 수', '(     )개', '(     )개', '(     )개']])
    s.fill('삼각형은 꼭짓점이 모두 서로 ( 이웃하고 있어서 / 떨어져 있어서 ) 대각선을 그을 수 없어요. 변의 수가 많아질수록 대각선의 수는 ( 많아져요 / 적어져요 / 그대로예요 ).')
    a5 += '  ④ %d개, %d개, %d개 / 이웃하고 있어서, 많아져요' % (ndiag(3), ndiag(4), ndiag(5))
    s.page_break()
    s.step('⑤ 확인하기', '네 사각형에 대각선을 긋고 자와 각도기로 재기 (1 cm 크기 그대로 그렸어요)')
    QT = [{'pts': [[0, 0], [4, 0], [5, 2.5], [1, 2.5]], 'label': '평행사변형'}, {'pts': [[0, 1.5], [2.5, 0], [5, 1.5], [2.5, 3]], 'label': '마름모'},
          {'pts': [[0, 0], [4, 0], [4, 2.5], [0, 2.5]], 'label': '직사각형'}, {'pts': [[0, 0], [3, 0], [3, 3], [0, 3]], 'label': '정사각형'}]
    real_cm(s, QT, ch=400)
    qr = quad_rows(QT)
    s.table([['', '평행사변형', '마름모', '직사각형', '정사각형'],
             ['두 대각선의 길이', '(   ) cm\n(   ) cm', '(   ) cm\n(   ) cm', '(   ) cm\n(   ) cm', '(   ) cm\n(   ) cm'],
             ['두 대각선이 만나는 각', '(     )°', '(     )°', '(     )°', '(     )°']], row_h=3402)
    eqs = [r[0] for r in qr if abs(r[1] - r[2]) < 1e-9]
    perp = [r[0] for r in qr if abs(r[3] - 90) < 1e-9]
    assert eqs == ['직사각형', '정사각형'] and perp == ['마름모', '정사각형']
    s.choices([('두 대각선의 길이가 같은 사각형을 모두 고르면?', opts('평행사변형', '마름모', '직사각형', '정사각형')),
               ('두 대각선이 서로 수직으로 만나는 사각형을\n모두 고르면?', opts('평행사변형', '마름모', '직사각형', '정사각형'))])
    s.fill('알게 된 점: 네 사각형 모두 한 대각선이 다른 대각선을 똑같이 ( 둘로 / 셋으로 ) 나눠요. 정사각형의 두 대각선은 길이가 같고, 서로 ( 수직으로 / 평행하게 ) 만나요.')
    meas = ' · '.join('%s %.1f cm, %.1f cm, %d°' % (n, a, b, round(g)) for n, a, b, g in qr)
    a5 += '  ⑤ (어림값) %s / 길이가 같은 것: 직사각형, 정사각형 / 수직: 마름모, 정사각형 / 둘로, 수직으로' % meas
    if C:
        s.step('⑥ 도전하기', '육각형의 대각선, 잘못 말한 친구')
        pic(s, shape_cells([{'pts': [[1, 0], [3.2, .2], [4.4, 1.8], [3.4, 3.6], [1.2, 3.6], [-.2, 1.8]], 'label': '육각형'}], cw=420, ch=360, names=False), 65)
        s.ask('육각형에 대각선을 모두 그으면 (       )개예요.', blank=False)
        s.text('효빈: “오각형의 한 꼭짓점에서 그을 수 있는 대각선은 2개야.”  민혁: “삼각형의 대각선은 1개야.”  서진: “사각형의 대각선은 2개야.”')
        s.ask('대각선에 대해 잘못 말한 사람은? ( 효빈 / 민혁 / 서진 )', blank=False)
        why(s, '잘못 말한 사람의 말을 바르게 고쳐 써 보세요.', 1)
        a5 += '  ⑥ %d개 / 민혁 — 삼각형은 꼭짓점이 모두 서로 이웃하여 대각선이 없어요.' % ndiag(6)
    A.append(a5)

    # ---------------- 6차시
    s.lesson(6, '탐구 정리하기(O)', '모양 만들기를 해 볼까요', '모양 조각으로 어떻게 여러 가지 모양을 만들 수 있을까요?')
    s.scene(None, '제3 전시실 ‘모양 조각의 나라’예요. 은하가 모양 조각으로 꾸민 작품을 둘러봐요.')
    s.step('① 살펴보기', '모양 조각 6가지 살펴보기')
    pic(s, pb_set_svg(names=False, letters=KO), 150)
    if not C:
        s.wordbox(PBN)
    s.table([['조각', '가', '나', '다', '라', '마', '바'], ['이름', '', '', '', '', '', ''], ['변의 수', '(   )개', '(   )개', '(   )개', '(   )개', '(   )개', '(   )개']], row_h=3402)
    s.fill('( 사다리꼴 / 정육각형 )의 긴 변 하나만 빼면 모양 조각의 변의 길이는 모두 같아요.')
    pk = ['tri', 'sq', 'par', 'trap', 'rh', 'hex']
    a6 = '6차시  ① ' + ', '.join('%s %s(%d개)' % (KO[i], PB[k]['name'], len(PB[k]['pts'])) for i, k in enumerate(pk)) + ' / 사다리꼴'
    s.step('② 찾아 보기', '모양 조각으로 꾸민 마을에서 집, 꽃, 새에 사용한 조각 찾기')
    appfig(s, TB['village'], 120)
    vil = TB['vil']
    used = {w: [PB[k]['name'] for k in pk if any(p['k'] == k for p in vil[e])] for w, e in (('집', 'house'), ('꽃', 'flower'), ('새', 'bird'))}
    assert used == {'집': ['정사각형', '사다리꼴'], '꽃': ['정삼각형', '정사각형', '마름모'], '새': ['평행사변형', '마름모']}
    if not C:
        help_(s, '가늘고 긴 조각은 마름모, 기울어진 네모 조각은 평행사변형이에요.')
    s.labeled([('집', ''), ('꽃', ''), ('새', '')], row_h=3118)
    a6 += '  ② 집: %s / 꽃: %s / 새: %s' % tuple(', '.join(used[w]) for w in ('집', '꽃', '새'))
    s.step('③ 따라 만들기', '우주선 작품과 같은 모양 만들기 (실제 모양 조각 크기)')
    pb_real(s, [], [p['pts'] for p in TB['ship']])
    s.text('모양 조각을 점선 안에 올려 보거나, 칸마다 알맞은 조각의 이름을 써 보세요.')
    ship_k = [PB[k]['name'] for k in pk if k != 'tri' and any(p['k'] == k for p in TB['ship'])]
    assert ship_k == ['정사각형', '평행사변형', '사다리꼴', '마름모']
    s.ask('우주선을 만드는 데 사용한 모양 조각은 정삼각형과 무엇일까요? 모두 써 보세요.')
    s.fill('만든 방법: 길이가 같은 변끼리 이어 붙이고, 조각끼리 서로 ( 겹치지 않게 / 겹치게 ) 놓았어요. 같은 모양 조각을 여러 번 ( 사용할 수 있어요 / 사용할 수 없어요 ).')
    a6 += '  ③ %s / 겹치지 않게, 사용할 수 있어요' % ', '.join(ship_k)
    s.page_break()
    s.step('④ 나만의 작품', '모양 조각을 4개 이상 써서 나만의 작품 만들기')
    pic(s, blank_box(900, 300, '모양 조각을 대고 따라 그려요'), 140)
    s.ask('작품 이름: (                    )', blank=False)
    s.ask('사용한 모양 조각과 만든 방법을 설명해 보세요.', blank=False)
    if not C:
        help_(s, '‘~, ~을 사용하여 ~을 만들었습니다. 모양 조각을 붙일 때에는 변과 변을 이어 붙였습니다.’ 꼴로 써요.')
    s.lines(2)
    a6 += '  ④ (예) 거북 — 정삼각형, 정사각형, 평행사변형, 사다리꼴을 사용하여 거북을 만들었습니다. 변과 변을 이어 붙였습니다.'
    s.step('⑤ 칠교 만들기', '칠교 조각으로 다각형 만들기')
    pic(s, tg_set_svg(), 150)
    s.text('칠교 조각: 큰 삼각형 2개, 중간 삼각형 1개, 작은 삼각형 2개, 정사각형 1개, 평행사변형 1개')
    if not C:
        help_(s, '작은 삼각형 2개와 정사각형 1개로 큰 삼각형과 같은 모양을 만들 수 있어요.')
    s.table([['', '조각 3개로 만들기', '조각 4개로 만들기'], ['사용한 조각', '', ''], ['만든 다각형의 이름', '(            )', '(            )']], row_h=3402)
    a6 += '  ⑤ (예) 작은 삼각형 2개 + 정사각형 → 삼각형 / 작은 삼각형 2개 + 정사각형 + 중간 삼각형 → 사다리꼴(사각형)'
    if C:
        s.step('⑥ 도전하기', '모양 조각으로 오각형, 칠교 조각으로 직사각형 만들기')
        pic(s, blank_box(900, 240, '만든 모양을 그려요'), 120)
        s.ask('오각형을 만드는 데 사용한 조각: (                              )', blank=False)
        s.ask('직사각형을 만드는 데 사용한 칠교 조각: (                              )', blank=False)
        why(s, '만든 모양이 오각형인 까닭을 써 보세요.', 1)
        a6 += '  ⑥ (예) 정사각형 위에 정삼각형 → 오각형(변이 5개) / 작은 삼각형 2개 + 정사각형 → 직사각형'
    A.append(a6)

    # ---------------- 7차시
    s.lesson(7, '탐구 정리하기(O)', '모양 채우기를 해 볼까요', '모양 조각으로 주어진 모양을 어떻게 빈틈없이 채울 수 있을까요?')
    s.scene(None, '벽에 붙은 작품은 정육각형으로 채워져 있어요. 은하도 모양 조각으로 모양을 채워 봐요.')
    s.step('① 한 가지로 채우기', '세 정육각형을 서로 다른 한 가지 조각으로만 채우기')
    hx = hex_targets([0, 2.35, 4.7])
    pb_real(s, [], hx, [h[0] for h in hx], pad=0.12)
    s.text('점선(조각의 변이 놓이는 선)을 따라 선을 그어 나누어 보세요. 실제 모양 조각과 같은 크기예요.')
    nh = {k: n_fill(hx[0], k) for k in ('tri', 'par', 'trap', 'hex')}
    assert nh == {'tri': 6, 'par': 3, 'trap': 2, 'hex': 1}
    s.ask('정육각형 하나를 채우는 조각의 수 ― 정삼각형만: (     )개, 평행사변형만: (     )개, 사다리꼴만: (     )개', blank=False)
    a7 = '7차시  ① 정삼각형 %d개, 평행사변형 %d개, 사다리꼴 %d개' % (nh['tri'], nh['par'], nh['trap'])
    s.step('② 두 가지로 채우기', '두 가지 조각으로 정육각형을 서로 다른 방법으로 채우기')
    hx2 = hex_targets([0, 2.6])
    pb_real(s, [], hx2, [h[0] for h in hx2], pad=0.12)
    if not C:
        help_(s, '사다리꼴 1개와 정삼각형 3개로 채울 수 있어요. 평행사변형과 정삼각형을 함께 써도 돼요.')
    s.ask('채운 방법을 설명해 보세요.', blank=False)
    s.lines(2)
    a7 += '  ② (예) 사다리꼴 1개 + 정삼각형 3개 / 평행사변형 1개 + 정삼각형 4개 / 평행사변형 2개 + 정삼각형 2개'
    s.page_break()
    s.step('③ 물고기 채우기', '은하와 다른 방법으로 물고기 그림 채우기')
    fish = TB['fish']
    exk = {}
    for p in fish['ex']:
        exk[p['k']] = exk.get(p['k'], 0) + 1
    assert exk == {'hex': 1, 'trap': 8, 'tri': 2}
    t, wu = pb_svg([(p['k'], p['pts']) for p in fish['ex']], [], None, pad=0.15, U=60)
    s.text('은하가 채운 물고기 (정육각형 1개, 사다리꼴 8개, 정삼각형 2개)')
    pic(s, t, 70)
    pb_real(s, [], [fish['outline']], [fish['outline'][0]], pad=0.12)
    fa = n_fill(fish['outline'], 'tri')
    s.ask('어떤 조각을 사용하여 채웠는지 써 보세요.', blank=False)
    s.lines(1)
    a7 += '  ③ (예) 정삼각형, 평행사변형, 사다리꼴, 마름모 등 — 은하와 다르게 채우면 정답(물고기 넓이 = 정삼각형 %d개)' % fa
    s.page_break()
    s.step('④ 엽서 꾸미기', '닭 모양을 모양 조각으로 빈틈없이 채우고 친구에게 엽서 쓰기')
    pb_real(s, [], [TB['chick_outline']], None, pad=0.15)
    if not C:
        help_(s, '머리, 볏, 부리, 꼬리, 몸통 모양을 보고 맞는 조각을 찾아요. 볏과 부리는 정삼각형, 머리는 정사각형 크기예요.')
    s.ask('친구에게 엽서를 써 보세요. 채운 방법이 들어가게 써요.', blank=False)
    s.lines(2)
    ck = {}
    for p in TB['chick']['pieces']:
        ck[PB[p['k']]['name']] = ck.get(PB[p['k']]['name'], 0) + 1
    a7 += '  ④ (예) %s로 채웠어요. / 민수에게, 이 엽서는 정삼각형, 정사각형, 평행사변형, 정육각형, 마름모를 사용하여 닭 모양을 채운 거야.' % ', '.join('%s %d개' % kv for kv in ck.items())
    s.step('⑤ 확인하기', '정육각형 2개를 붙인 모양을 한 가지 조각으로 채우기')
    hp = [hex_targets([1.6], 3)[0], hex_targets([3.1], 3 - H3)[0]]
    t, wu = pb_svg([], hp, None, pad=0.15, U=60)
    pic(s, t, 60)
    nn = {k: n_fill(hp[0], k) * 2 for k in ('tri', 'par', 'trap')}
    s.ask('정삼각형만으로 (     )개, 평행사변형만으로 (     )개, 사다리꼴만으로 (     )개', blank=False)
    if not C:
        help_(s, '정육각형 1개를 채우는 수를 떠올리고, 정육각형이 2개이니 두 배를 해요.')
    a7 += '  ⑤ 정삼각형 %d개, 평행사변형 %d개, 사다리꼴 %d개' % (nn['tri'], nn['par'], nn['trap'])
    if C:
        s.step('⑥ 도전하기', '한 가지 조각만 사용하여 평행사변형 채우기')
        pg = [(1, 3), (3, 3), (4, 3 - 2 * H3), (2, 3 - 2 * H3)]
        pb_real(s, [], [pg], [pg[0]], pad=0.12)
        s.ask('정삼각형만: (     )개, 평행사변형 조각만: (     )개', blank=False)
        why(s, '사다리꼴 조각만으로는 채울 수 없는 까닭을 써 보세요.', 1)
        assert n_fill(pg, 'tri') == 8 and n_fill(pg, 'par') == 4
        a7 += '  ⑥ 정삼각형 8개, 평행사변형 4개 / (예) 사다리꼴은 정삼각형 3개 넓이인데 이 모양은 정삼각형 8개 넓이라서 3씩 나누어떨어지지 않아요.'
    A.append(a7)

    # ---------------- 8차시
    s.lesson(8, '탐구 정리하기(O)', '생각을 더하다 ― 공학 도구를 사용하여 나만의 모양을 만들어 볼까요',
             '공학 도구로 다각형을 어떻게 만들 수 있을까요? 만든 다각형으로 어떤 모양을 만들 수 있을까요?')
    s.scene(None, '은하는 태블릿의 공학 도구로 다각형을 만들어요. 활동지에서는 공학 도구의 모눈 점과 같은 점 종이에 그려 봐요.')
    s.step('① 다각형 만들기', '‘다각형’ 메뉴처럼 꼭짓점을 차례로 이어 삼각형, 사다리꼴, 평행사변형, 육각형 그리기')
    pic(s, dots_svg(18, 11, 34, M=20, r=3.5), 165)
    if not C:
        help_(s, '사다리꼴은 평행한 변이 한 쌍이라도 있어야 해요. 점 종이의 가로줄을 따라 두 변을 그어 봐요.')
    a8 = '8차시  ① (예) 점 종이에 삼각형, 사다리꼴, 평행사변형, 육각형'
    s.step('② 정다각형 만들기', '‘정다각형 : 한 변’ 메뉴로 정사각형, ‘다각형’ 메뉴로 마름모 만들기')
    s.text('위 점 종이의 빈 곳에 정사각형과 마름모도 그려 보세요.')
    s.fill('‘정다각형 : 한 변’ 메뉴에서 두 점을 눌러 한 변을 정하고, 점의 수에 (     )를 넣으면 정사각형이 만들어져요. 마름모는 네 ( 변의 길이 / 각의 크기 )가 모두 같아요.')
    a8 += '  ② 4, 변의 길이 (정사각형도 네 변의 길이가 같은 마름모예요.)'
    s.step('③ 살펴보기', '친구들이 공학 도구로 만든 등대와 배')
    appfig(s, TB['light'], 110)
    if not C:
        help_(s, '등대는 아래부터 탑, 불빛 방, 지붕이에요. 배의 몸통은 마주 보는 두 쌍의 변이 평행해요.')
    s.labeled([('등대에 사용한\n다각형', ''), ('배에 사용한\n다각형', '')], label_mm=40, row_h=3402)
    a8 += '  ③ 등대: 삼각형, 정사각형, 사다리꼴 / 배: 마름모, 평행사변형'
    s.step('④ 나만의 모양', '다각형을 옮기고 복제하여 나만의 모양 만들기 (다각형 4개 이상)')
    pic(s, blank_box(900, 260, '나만의 모양을 그려요'), 130)
    s.ask('만든 모양의 이름과 사용한 다각형을 설명해 보세요.', blank=False)
    s.lines(2)
    a8 += '  ④ (예) 난 등대 모양을 만들었어. 사다리꼴로 탑을, 정사각형으로 불빛 방을, 삼각형으로 지붕을 만들었어.'
    s.step('⑤ 확인하기', '공학 도구로 다각형을 만드는 방법')
    s.choices([('‘다각형’ 메뉴에서 꼭짓점을 차례대로 누른 뒤\n마지막에 무엇을 눌러야 할까요?', opts('처음 꼭짓점', '아무 빈 곳', '마지막 꼭짓점')),
               ('‘정다각형 : 한 변’ 메뉴에서 점의 수에\n6을 넣으면 어떤 도형이 만들어질까요?', opts('육각형', '정육각형', '정삼각형')),
               ('모양과 크기가 같은 도형을 여러 개 만들 때\n쓰는 기능은?', opts('복제', '지우기', '취소'))])
    a8 += '  ⑤ 처음 꼭짓점, 정육각형, 복제'
    if C:
        s.step('⑥ 도전하기', '‘정다각형 : 한 변’ 메뉴로 정오각형과 정팔각형 만들기')
        s.ask('정오각형: 점의 수에 (     )를 넣어요.   정팔각형: 점의 수에 (     )을 넣어요.', blank=False)
        why(s, '정팔각형이 정오각형보다 원에 더 가까워 보이는 까닭을 써 보세요.', 1)
        a8 += '  ⑥ 5, 8 / (예) 변의 수가 많을수록 꼭짓점의 각이 커지고 둘레가 둥글게 보여 원에 가까워져요.'
    A.append(a8)

    # ---------------- 9차시
    rab = TB['rabbit']
    rn = [r['n'] for r in rab]
    s.lesson(9, '발표하기(P)', '놀이를 더하다 ― 다각형의 이름에 맞게 색칠해 볼까요', '주사위 눈의 수에 맞는 다각형을 어떻게 빨리 찾을 수 있을까요?')
    s.step('① 놀이 방법', '주사위 눈의 수에 해당하는 다각형 알아보기 (2명, 색연필·주사위)')
    dicetable(s)
    s.text('1. 가위바위보로 놀이 순서를 정합니다.  2. 주사위를 굴려 나온 눈의 수에 해당하는 다각형을 그림에서 한 개 골라 원하는 색으로 칠합니다.  '
           '3. 색칠할 다각형을 찾지 못하거나 없으면 상대방에게 차례가 넘어갑니다.  4. 2~3을 반복하여 그림을 완성합니다.')
    s.choices([('주사위 눈의 수가 4이면 어떤 다각형을 칠할까요?', opts('사각형', '육각형', '팔각형')),
               ('주사위 눈의 수가 6이면 어떤 다각형을 칠할까요?', opts('육각형', '칠각형', '팔각형')),
               ('칠할 다각형이 그림에 없으면 어떻게 할까요?', '( 상대방에게 차례가 넘어가요 /\n아무 다각형이나 칠해요 / 주사위를 다시 굴려요 )')])
    a9 = '9차시  ① 육각형, 팔각형, 상대방에게 차례가 넘어가요'
    s.step('② 놀이 한 판', '친구와 번갈아 주사위를 굴려 토끼 그림 완성하기')
    pic(s, game_svg(rab, 90, 20, 420, 590), 95)
    if not C:
        help_(s, '꼭짓점에 점이 찍혀 있어요. 점(꼭짓점)을 세면 변의 수를 알 수 있어요.')
    cnt = {n: rn.count(n) for n in range(3, 9)}
    a9 += '  ② 토끼 그림: ' + ', '.join('%s %d개' % (NAMES[n], c) for n, c in cnt.items() if c)
    s.step('③ 말해 보기', '놀이를 하며 생각한 것')
    s.choices([('놀이를 잘하려면 어떻게 해야 할까요?', '( 눈의 수에 해당하는 다각형을 옳게 찾아요 /\n가장 큰 도형부터 칠해요 /\n색을 예쁘게 칠하는 데만 집중해요 )'),
               ('토끼 그림에서 칠각형은 어디에 있었나요?', opts('귀', '코', '눈'))])
    assert rn[0] == 7 and rn[7] == 3 and rn[5] == 4 and rn[4] == 8 and rn[13] == 6
    a9 += '  ③ 눈의 수에 해당하는 다각형을 옳게 찾아요, 귀'
    s.step('④ 또 다른 놀이', '주사위를 세 번 굴려 나온 눈의 수에 해당하는 다각형을 점 종이에 그리기')
    s.table([['', '첫째', '둘째', '셋째'], ['나온 눈의 수', '', '', ''], ['그릴 다각형', '', '', '']])
    pic(s, dots_svg(12, 8, 44), 140)
    s.text('다각형의 한 변이 5개보다 많은 점을 연결하지 않게 그려요.')
    a9 += '  ④ 눈의 수 + 2 = 변의 수 (예: 눈 3 → 오각형)'
    s.step('⑤ 확인하기', '토끼 그림의 다각형 떠올리기')
    s.fill('토끼의 머리처럼 변이 8개인 다각형은 (          )이고, 발처럼 변이 6개인 다각형은 (          )이에요. 주사위 눈이 (     )이면 오각형을 칠해요.')
    a9 += '  ⑤ 팔각형, 육각형, 3'
    if C:
        s.step('⑥ 도전하기', '친구가 말한 것이 옳은지 생각하기')
        s.choices([('“칠각형은 꼭짓점이 7개야.”', opts('옳아요', '틀려요')), ('“눈의 수가 5이면 오각형을 칠해.”', opts('옳아요', '틀려요')),
                   ('“팔각형을 칠하려면 주사위 눈이 6이 나와야 해.”', opts('옳아요', '틀려요'))])
        why(s, '틀린 말을 바르게 고쳐 써 보세요.', 1)
        a9 += '  ⑥ 옳아요, 틀려요, 옳아요 — 눈의 수가 5이면 칠각형을 칠해요(눈의 수에 2를 더한 수가 변의 수).'
    A.append(a9)

    # ---------------- 10차시
    s.lesson(10, '발표하기(P)', '공부한 내용을 확인해요', '다각형, 정다각형, 대각선, 모양 만들기와 채우기를 잘 알고 있나요?')
    s.step('1번', '다각형을 모두 찾아 기호와 이름 쓰기')
    appfig(s, TB['final'], 170)
    s.table([['다각형의 기호', '', '', ''], ['다각형의 이름', '', '', '']], header=False, header_col=True)
    a10 = '10차시  1번 가 팔각형, 나 사각형, 라 육각형'
    s.step('2번', '삼각 점 종이에 정삼각형과 정육각형 그리기')
    pic(s, dots_svg(10, 6, 52, 'tri'), 130)
    if not C:
        help_(s, '점과 점 사이의 간격이 같도록 변을 그어요. 정육각형은 정삼각형 6개를 모은 모양이에요.')
    a10 += '  2번 (예) 한 변이 점 간격 1~2칸인 정삼각형·정육각형'
    s.step('3번', '정오각형에 대각선을 모두 긋기')
    pic(s, shape_cells([{'pts': TB['reg5'], 'label': '정오각형'}], cw=380, ch=340, names=False), 55)
    s.ask('정오각형의 대각선은 (       )개예요.', blank=False)
    a10 += '  3번 %d개' % ndiag(5)
    s.page_break()
    s.step('4번', '2가지 모양 조각을 모두 사용하여 정다각형 만들기')
    pic(s, blank_box(900, 240, '만든 정다각형을 그려요'), 120)
    s.ask('사용한 조각: (                      )   만든 정다각형: (                )', blank=False)
    if not C:
        help_(s, '사다리꼴 위에 정삼각형을 올리면 큰 정삼각형이 돼요.')
    a10 += '  4번 (예) 사다리꼴 1개 + 정삼각형 1개 → 정삼각형 / 사다리꼴 1개 + 정삼각형 3개 → 정육각형'
    s.step('5번', '수호와 예지가 만들려고 하는 도형')
    s.text('수호: “변의 길이가 모두 같고, 각의 크기가 모두 같은 다각형을 만들어 볼까?”   예지: “변이 8개이고, 한 변의 길이가 4 cm인 도형을 만들자.”')
    s.ask('도형의 이름: (                )   모든 변의 길이의 합: (       ) cm', blank=False)
    s.ask('식:', blank=False)
    a10 += '  5번 정팔각형, 4 × 8 = %d (cm)' % (4 * 8)
    s.step('낱말 찾기', '빈칸에 알맞은 낱말을 글자판에서 찾기 (→ ↓ ↘ ↙ 방향)')
    ws_table(s, [list(r) for r in TB['ws']])
    if not C:
        s.wordbox(['다각형', '칠각형', '정팔각형', '대각선'])
    s.fill(['1. 선분으로만 둘러싸인 도형을 (            )(이)라고 합니다.', '2. 변이 7개인 다각형을 (            )(이)라고 합니다.',
            '3. 길이가 같은 선분 8개로 둘러싸여 있고, 각의 크기가 모두 같은 도형을 (            )(이)라고 합니다.',
            '4. 다각형에서 서로 이웃하지 않는 두 꼭짓점을 이은 선분을 (            )(이)라고 합니다.'])
    WS = TB['ws']
    assert WS[1][2:5] == '다각형' and WS[2][5] + WS[3][5] + WS[4][5] == '칠각형'
    assert WS[3][0] + WS[4][1] + WS[5][2] + WS[6][3] == '정팔각형' and WS[4][3] + WS[5][2] + WS[6][1] == '대각선'
    a10 += '  낱말 찾기 1 다각형(둘째 줄 →) 2 칠각형(↓) 3 정팔각형(↘) 4 대각선(↙)'
    if C:
        s.step('6번 ★★', '3가지 모양 조각을 모두 사용하여 주어진 모양을 빈틈없이 채우기')
        bt = [(1.2, 3.6), (4.2, 3.6), (2.7, 3.6 - 3 * H3)]
        pb_real(s, [], [bt], [bt[0]], pad=0.12)
        s.ask('사용한 조각과 개수: (                                        )', blank=False)
        why(s, '어떻게 채웠는지 차례대로 써 보세요.', 1)
        assert n_fill(bt, 'tri') == 9
        a10 += '  6번 (예) 아래 줄 사다리꼴 1개 + 평행사변형 1개, 가운데 줄 사다리꼴 1개, 맨 위 정삼각형 1개 (넓이 = 정삼각형 9개)'
    A.append(a10)

    s.answers('【교사용】 6. 다각형(교과서 차시) 활동지 정답 (%s)' % level, A,
              note='※ 이 활동지는 앱 u6-polygon.html과 차시 번호가 같습니다. 그림은 앱과 같은 좌표로 그렸고, 모양 조각 그림은 실제 모양 조각(한 변 2.54 cm)과 같은 크기예요.')
    return s
