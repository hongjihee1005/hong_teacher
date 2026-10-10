# -*- coding: utf-8 -*-
"""4-2 수학 5. 꺾은선그래프 활동지(HWPX) 4개 만들기

    python3 gen_u5-linegraph.py

교과서 차시 버전(앱 _build/units/sem2/u5-linegraph.tb.js '힘찬시 편지', 9개 차시: 1·2·3·4·5~6·7·8·9·10)과
이야기 버전(앱 u5-linegraph.st.js '우리 반 강낭콩 관찰 연구소', 10개 차시)의 차시 번호·제목·S.O.O.P.·
탐구 질문·이야기·수를 그대로 따릅니다.
그래프 자료(L5G·L5S)는 앱 소스에서 node로 그대로 읽어 오고, 그림은 앱의 l5Geom·l5Paint와 같은 규칙
(점의 높이 = (값 − 물결선 위 첫 눈금) ÷ 눈금 한 칸, 수를 쓰는 눈금 = major의 배수, 물결선은 lo > 0일 때)으로 그립니다.
정답(가장 많이 늘어난 때·눈금 한 칸의 크기·물결선 자리 등)도 그 자료로 계산합니다.
"""
import hashlib
import json
import math
import os
import subprocess
import sys
import tempfile
from xml.sax.saxutils import escape

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from hwpxgen import Sheet, svg_to_png, check  # noqa: E402

ROOT = os.path.normpath(os.path.join(HERE, '..', '..'))          # grade4/math
SRC = os.path.join(ROOT, '_build', 'units', 'sem2')
OUT_TB = os.path.join(ROOT, 'sem2', 'sheets')
OUT_ST = os.path.join(ROOT, 'sem2-soop', 'sheets')
NAME = '5단원_꺾은선그래프_활동지_%s.hwpx'
TMP = tempfile.mkdtemp(prefix='u5line_')
FONT = "'Noto Sans KR','WenQuanYi Zen Hei',sans-serif"
INK, SOFT, GRID, GRID2 = '#1D2A2A', '#3B4A47', '#DCE4E0', '#9AA9A3'
LINE, LINE2, DIM, BAR, BARS, SEL = '#D9622B', '#2B7BD6', '#AEB9B5', '#F0A35E', '#B8743A', '#D9482B'


# ================================================================ 자료 (앱 소스에서 그대로)
def _load(fname, start, end, expr):
    s = open(os.path.join(SRC, fname), encoding='utf-8').read()
    i = s.index(start)
    j = s.index(end, i)
    r = subprocess.run(['node', '-e', s[i:j] + '\nconsole.log(JSON.stringify(%s));' % expr],
                       capture_output=True, text=True)
    if r.returncode:
        raise RuntimeError(r.stderr)
    return json.loads(r.stdout)


G = _load('u5-linegraph.tb.js', 'const L5Y', 'const L5_MOODTBL', 'L5G')
_st = _load('u5-linegraph.st.js', 'const L5Y', 'function l5sMoodTable', '{S: L5S, M: L5S_MOOD}')
S, S_MOOD = _st['S'], _st['M']
MOODTBL = ["4학년이 되어 새로운 친구들을 만났다.", "1학기 체험 학습을 다녀왔다.", "부모님께 어린이날 선물을 받았다.",
           "학교 체육 대회에서 우리 반이 아쉽게 졌다.", "축구를 하다가 넘어져 다리를 다쳤다.", "가족여행을 다녀왔다.",
           "2학기 체험 학습을 다녀왔다.", "줄넘기 2단 넘기를 성공했다.", "반별 장기 자랑을 준비했다."]
_tbsrc = open(os.path.join(SRC, 'u5-linegraph.tb.js'), encoding='utf-8').read()
assert all(t in _tbsrc for t in MOODTBL)
HOT = [31.2, 33.0, 34.5, 32.9, 35.1, 33.4, 30.8, 32.0, 36.2, 33.0]
PORTAL = [("2018", [0, 3, 20, 17, 0]), ("2019", [0, 2, 10, 15, 2]), ("2020", [0, 7, 5, 19, 0]),
          ("2021", [0, 1, 15, 7, 0]), ("2022", [1, 9, 21, 14, 0])]
assert '34.5, 32.9, 35.1' in _tbsrc and '[1, 9, 21, 14, 0]' in _tbsrc
assert [sum(m) for _, m in PORTAL] == G['heat']['vals']


def V(g, **o):
    d = dict(g)
    d.update(o)
    return d


def ser(g):
    if g.get('series'):
        return [dict(s, color=s.get('color') or (LINE2 if i else LINE)) for i, s in enumerate(g['series'])]
    return [dict(name=g['yAxis'], vals=g['vals'], color=LINE)]


def vals(g, si=0):
    return ser(g)[si]['vals']


def nm(g, i):
    return g['names'][i] if g.get('names') else g['xs'][i] + (g.get('xUnit') or '')


def U(v, unit):
    v = fmt(v)
    if not unit:
        return v
    if unit[0].isascii() and unit[0].isalpha() or unit[0] == '℃':
        return '%s %s' % (v, unit)
    return v + unit


def fmt(v):
    v = round(v * 1000) / 1000
    return str(int(v)) if v == int(v) else str(v)


def seg(g, mode, si=0):
    """가장 많이 늘어난(inc)·줄어든(dec)·변한(abs)·가장 작게 변한(min) 때(끝 점 번호들)."""
    v = vals(g, si)
    d = [b - a for a, b in zip(v, v[1:])]
    sc = [x if mode == 'inc' else -x if mode == 'dec' else abs(x) for x in d]
    best = min(sc) if mode == 'min' else max(sc)
    return [i + 1 for i, s in enumerate(sc) if s == best], d


def segname(g, mode, si=0):
    ids, d = seg(g, mode, si)
    return ', '.join(nm(g, i) for i in ids)


def peak(g, mode='max', si=0):
    v = vals(g, si)
    t = max(v) if mode == 'max' else min(v)
    return ', '.join(nm(g, i) for i, x in enumerate(v) if x == t)


def trend(g, si=0):
    v = vals(g, si)
    return ['늘어남' if b > a else '줄어듦' if b < a else '그대로' for a, b in zip(v, v[1:])]


def pick_scale(g, waves, steps):
    """앱 l5Build와 같은 차례로 맞는 (물결선 위 첫 눈금, 한 칸) 찾기."""
    v = g['vals']
    mn, mx = min(v), max(v)
    a = None
    for lo in waves:
        for s in steps:
            if lo <= mn and lo + s * g['cells'] >= mx and all(abs((x - lo) / s - round((x - lo) / s)) < 1e-6 for x in v):
                a = (lo, s)
    assert a == (g.get('lo', 0), g['step']), (g['title'], a)
    return a


def cells_of(g, si=0):
    return [round((x - g.get('lo', 0)) / g['step'], 3) for x in vals(g, si)]


def kk(g, si=0):
    return '·'.join(fmt(c) for c in cells_of(g, si))


# ================================================================ 그림(SVG)
def W_(s, fs):
    w = 0
    for c in str(s):
        w += fs if '가' <= c <= '힣' else fs * .35 if c == ' ' else fs * .62
    return w


def T(x, y, s, fs=18, anchor='middle', fill=INK, weight='normal'):
    return ('<text x="%.1f" y="%.1f" font-size="%d" text-anchor="%s" dominant-baseline="central" fill="%s" '
            'font-weight="%s" font-family="%s">%s</text>' % (x, y, fs, anchor, fill, weight, FONT, escape(str(s))))


def BOX(x, y, w, h):
    return ('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" rx="4" fill="#fff" stroke="%s" stroke-width="1.6" '
            'stroke-dasharray="5 4"/>' % (x, y, w, h, SOFT))


def L_(x1, y1, x2, y2, col, w=1, extra=''):
    return '<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="%s" stroke-width="%s"%s/>' % (x1, y1, x2, y2, col, w, extra)


def wrap(body, W, H):
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d"><rect width="%d" height="%d" fill="#fff"/>%s</svg>'
            % (W, H, W, H, body), W, H)


def graph_svg(g, pts='vals', kind=None, ticks=True, wave=True, title=True, axes=True, legend=None,
              mark=None, bg=None, draw=False, show_vals=None):
    """꺾은선그래프(앱 l5Paint와 같은 모양).
    pts: 'vals'(자료대로) | None(빈 판) | [값|None …] (한 줄만, 빈 칸 None)
    ticks: True(수 씀) | False(수 없음, 다섯 칸마다 굵은 줄 — 학생이 정함)
    wave: True(lo > 0이면 물결선) | False(물결선 자리만 비워 둠 — 학생이 그림)
    title: True | False(빈 칸 '제목:') ; axes: True | False(축 이름 빈칸)
    mark: (번째(소수), 이름) 빨간 점선 ; bg: {'name','vals'} 흐린 선(그 위에 그림) ; draw: 그리기용(칸을 크게)"""
    kind = kind or g.get('kind') or 'line'
    fs = 18
    n = len(g['xs'])
    lo, step, cells = g.get('lo', 0) or 0, g['step'], g['cells']
    major = g.get('major') or step * 5
    S_ = ser(g)
    if pts is None:
        S_ = [dict(S_[0], vals=[None] * n)]
    elif pts != 'vals':
        S_ = [dict(S_[0], vals=pts)]
    if bg:
        S_ = [dict(name=bg['name'], vals=bg['vals'], color=DIM, dim=True)] + [dict(s, color=LINE2, name=bg.get('me', s['name'])) for s in S_]
    if legend is None:
        legend = len(S_) > 1
    sv = g.get('showVals') if show_vals is None else show_vals
    SW = g.get('sw') or max(90, max(W_(s, fs - 1) for s in g['xs']) + 26)
    L = max(64, W_(fmt(lo + step * cells), fs - 2) + 26, W_(g.get('xAxis') or '', fs - 1) + 22)
    if not axes:
        L = max(L, 96)
    Tp = (92 if title is not None else 58) + (30 if legend else 0)
    CH = max(10, min(28, 260 // cells))
    if draw:
        CH = max(12, min(28, 300 // cells))
    PH = cells * CH
    PB = Tp + PH
    WG = 34 if (lo > 0 or wave is False) else 0
    base = PB + WG
    PW = n * SW
    xu = W_('(%s)' % g['xUnit'], fs - 2) + 8 if g.get('xUnit') else 0
    W = max(L + PW + 18 + xu, W_(g['title'], 22) + 40, W_('%s (%s)' % (g['yAxis'], g['unit']), fs) + 30)
    H = base + 26 + fs + 10
    X = lambda i: L + SW * (i + .5)
    Y = lambda v: max(Tp - 8, min(base, PB - (v - lo) / step * CH))
    o = []
    if title is True:
        o.append(T(W / 2, 30, g['title'], 22))
    elif title is False:
        o.append(T(W / 2 - 110, 30, '제목:', 20, anchor='end') + BOX(W / 2 - 100, 12, min(W / 2 + 80, 380), 36))
    if legend:
        lx = L
        for s in S_:
            col = s['color']
            o.append(L_(lx, Tp - 60, lx + 30, Tp - 60, col, 4) + '<circle cx="%.1f" cy="%.1f" r="5" fill="%s"/>' % (lx + 15, Tp - 60, col))
            o.append(T(lx + 38, Tp - 60, s['name'], fs - 2, anchor='start'))
            lx += 38 + W_(s['name'], fs - 2) + 26
    if axes:
        o.append(T(8, Tp - 26, '%s (%s)' % (g['yAxis'], g['unit']), fs, anchor='start', fill=SOFT))
    else:
        o.append(BOX(8, Tp - 42, 150, 32))
    for k in range(cells + 1):
        val = lo + k * step
        y = PB - k * CH
        mj = (abs(val / major - round(val / major)) < 1e-6) if ticks else (k % 5 == 0)
        o.append(L_(L, y, L + PW, y, GRID2 if mj and (k or lo) else GRID, 1.6 if mj else 1))
        if mj and ticks:
            o.append(T(L - 9, y, fmt(val), fs - 2, anchor='end'))
    for i in range(n):
        o.append(L_(X(i), Tp, X(i), PB, GRID))
    o.append(L_(L, Tp, L, base, INK, 2) + L_(L, base, L + PW, base, INK, 2))
    if lo > 0 and wave is True:
        y0, a, wl = PB + WG / 2, 4, 14

        def wv(dy):
            d = 'M%.1f %.1f' % (L - 12, y0 + dy)
            x = L - 12
            while x < L + PW:
                d += ' q%.1f %.1f %.1f 0 t%.1f 0' % (wl / 4, -a, wl / 2, wl / 2)
                x += wl
            return d
        o.append('<rect x="%.1f" y="%.1f" width="%.1f" height="10" fill="#fff"/>' % (L - 12, y0 - 5, PW + 14))
        for dy in (-5, 5):
            o.append('<path d="%s" stroke="%s" stroke-width="1.8" fill="none"/>' % (wv(dy), INK))
    if (ticks and lo > 0) or not ticks:
        o.append(T(L - 9, base, '0', fs - 2, anchor='end'))
    if mark:
        mx = X(mark[0])
        o.append(L_(mx, Tp, mx, PB, SEL, 2, ' stroke-dasharray="6 5"') + T(mx, Tp - 12, mark[1], 16, fill=SEL))
    for i, x in enumerate(g['xs']):
        o.append(T(X(i), base + 20, x, fs - 1))
    if axes:
        o.append(T(L - 10, base + 20, g['xAxis'], fs - 2, anchor='end', fill=SOFT))
    else:
        o.append(BOX(4, base + 6, L - 22, 28))
    if g.get('xUnit'):
        o.append(T(L + PW + 6, base + 20, '(%s)' % g['xUnit'], fs - 2, anchor='start', fill=SOFT))
    for s in S_:
        vv, col = s['vals'], s['color']
        if kind == 'bar':
            for i, v in enumerate(vv):
                if v is None:
                    continue
                y = Y(v)
                if PB - y > 0:
                    o.append('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="%s" stroke="%s"/>'
                             % (X(i) - SW * .25, y, SW * .5, PB - y, BAR, BARS))
            continue
        for i in range(len(vv) - 1):
            if vv[i] is not None and vv[i + 1] is not None:
                o.append(L_(X(i), Y(vv[i]), X(i + 1), Y(vv[i + 1]), col, 3.5, ' stroke-linecap="round"'))
        for i, v in enumerate(vv):
            if v is None:
                continue
            o.append('<circle cx="%.1f" cy="%.1f" r="6" fill="%s" stroke="#fff" stroke-width="2"/>' % (X(i), Y(v), col))
            if sv and not s.get('dim'):
                o.append(T(X(i), Y(v) + (21 if s.get('lab') == 'down' else -17), fmt(v), 15, fill=col))
    kindtag = 'draw' if (draw or pts is None or pts != 'vals' or bg) else 'read'
    return wrap(''.join(o), W, H) + (kindtag,)


def pair_svg(parts, gap=36):
    """[(머리글|None, (svg, W, H, …)), …] 를 옆으로 나란히."""
    lead_h = 34 if any(p[0] for p in parts) else 0
    W = sum(p[1][1] for p in parts) + gap * (len(parts) - 1)
    H = max(p[1][2] for p in parts) + lead_h
    x, out = 0, []
    for lead, (svg, w, h, *_) in parts:
        if lead:
            out.append(T(x + w / 2, 16, lead, 21, weight='bold', fill='#2B6FB8'))
        inner = svg.split('>', 1)[1].rsplit('</svg>', 1)[0]
        out.append('<svg x="%d" y="%d" width="%d" height="%d" viewBox="0 0 %d %d">%s</svg>' % (x, lead_h, w, h, w, h, inner))
        x += w + gap
    return wrap(''.join(out), W, H) + ('read',)


def day_svg():
    o = ['<rect width="640" height="230" fill="#F3F7FB"/>']
    for x in (140, 500):
        r = 52
        o.append('<circle cx="%d" cy="110" r="%d" fill="#7FB8E6" stroke="#2B6FB8" stroke-width="2"/>' % (x, r))
        o.append('<path d="M%.1f %.1f q%.1f %.1f %.1f 0 t%.1f %.1f q%.1f %.1f %.1f %.1f Z" fill="#6FBF73"/>'
                 % (x - r * .5, 110 - r * .3, r * .3, -r * .3, r * .6, r * .3, r * .4, -r * .4, r * .3, -r * .8, r * .1))
    o.append(T(140, 190, '지구가 태어났을 때', 19) + T(140, 214, '하루의 길이: 4시간', 19, fill=SEL))
    o.append(T(500, 190, '지금', 19) + T(500, 214, '하루의 길이: 24시간', 19, fill=SEL))
    o.append('<path d="M230 110 H400" stroke="%s" stroke-width="4"/><path d="M400 98 L424 110 L400 122 Z" fill="%s"/>' % (SOFT, SOFT))
    o.append(T(320, 90, '오랜 시간이 흘러', 17))
    return wrap(''.join(o), 640, 230) + ('read',)


def hot_svg(title, days):
    n, CW = len(days), 64
    W, H = 30 + n * CW, 330
    lo, hi, top, bot = 28, 38, 66, 260
    Y = lambda t: bot - (t - lo) / (hi - lo) * (bot - top)
    o = [T(W / 2, 22, title, 19)]
    o.append(L_(10, Y(33), W - 10, Y(33), SEL, 2, ' stroke-dasharray="7 5"') + T(W - 12, Y(33) - 12, '33 ℃', 15, anchor='end', fill=SEL))
    for i, (d, t) in enumerate(days):
        cx = 15 + CW * (i + .5)
        o.append('<rect x="%.1f" y="%d" width="14" height="%d" rx="7" fill="#fff" stroke="%s" stroke-width="1.5"/>' % (cx - 7, top - 6, bot - top + 10, GRID2))
        o.append('<rect x="%.1f" y="%.1f" width="8" height="%.1f" fill="#E04A3A"/>' % (cx - 4, Y(t), bot + 6 - Y(t)))
        o.append('<circle cx="%.1f" cy="%d" r="12" fill="#E04A3A" stroke="#B5402F" stroke-width="1.5"/>' % (cx, bot + 14))
        o.append(T(cx, 48, '%.1f' % t, 15) + T(cx, bot + 44, d, 16))
    return wrap(''.join(o), W, H) + ('read',)


def thermo_svg(title, labels, vs, lo=10, hi=30):
    n, CW = len(labels), 96
    W, H, top, bot = 20 + n * CW, 400, 60, 320
    Y = lambda t: bot - (t - lo) / (hi - lo) * (bot - top)
    o = [T(W / 2, 24, title, 19)]
    for i, v in enumerate(vs):
        cx = 10 + CW * (i + .5) + 14
        o.append('<rect x="%.1f" y="%d" width="16" height="%d" rx="8" fill="#fff" stroke="%s" stroke-width="1.5"/>' % (cx - 8, top - 10, bot - top + 14, GRID2))
        for t in range(lo, hi + 1):
            big = t % 5 == 0
            o.append(L_(cx - 8 - (14 if big else 8), Y(t), cx - 8, Y(t), INK, 1.6 if big else 1))
            if big:
                o.append(T(cx - 26, Y(t), str(t), 13, anchor='end'))
        o.append('<rect x="%.1f" y="%.1f" width="8" height="%.1f" fill="#E04A3A"/>' % (cx - 4, Y(v), bot + 6 - Y(v)))
        o.append('<circle cx="%.1f" cy="%d" r="13" fill="#E04A3A" stroke="#B5402F" stroke-width="1.5"/>' % (cx, bot + 16))
        o.append(T(cx - 10, bot + 52, labels[i], 15))
    return wrap(''.join(o), W, H) + ('read',)


_cache = {}


def png(svgtuple, width_px=1500):
    svg = svgtuple[0]
    key = hashlib.sha1(svg.encode('utf-8')).hexdigest()[:16]
    if key not in _cache:
        p = os.path.join(TMP, key + '.png')
        svg_to_png(svg, p, width_px=width_px)
        _cache[key] = p
    return _cache[key]


# ================================================================ 쪽 높이를 어림해 묶음째 넘기기
LIMIT = 258.0


def nlines(t, per):
    return max(1, math.ceil(len(t) / per))


class W:
    def __init__(self, s):
        self.s, self.y, self.buf = s, 0.0, []
        self.after_pic = False
        self.hold = False

    def _q(self, h, fn, *a, **k):
        if self.hold:
            self.hold = False
        elif self.after_pic and self.buf:
            if not (fn == self.s.picture and self.buf[-1][1] in (self.s.text, self.s.table, self.s.fill, self.s.choices)):
                self.flush()
        self.buf.append((h, fn, a, k))

    def flush(self):
        if not self.buf:
            return
        h = sum(b[0] for b in self.buf)
        if self.y + h > LIMIT and self.y > 60:
            self.s.page_break()
            self.y = 0.0
        for _, fn, a, k in self.buf:
            fn(*a, **k)
        self.y += h
        self.buf = []

    def lesson(self, no, soop, title, question, scene):
        self.flush()
        self.after_pic = False
        self.s.lesson(no=no, soop=soop, title=title, question=question)
        self.y = 46 + 4 * (len(question) > 34)
        self._q(sum(nlines(t, 37) * 7.4 for t in ([scene] if isinstance(scene, str) else scene)) + 6,
                self.s.scene, None, scene)
        self.flush()

    def step(self, label, sub=None):
        self.flush()
        self.after_pic = False
        self._q(11.5, self.s.step, label, sub)

    def text(self, t):
        self._q(nlines(t, 37) * 7.4, self.s.text, t)

    def ask(self, q, blank=True):
        self._q(nlines(q + (' 답: (        )' if blank else ''), 34) * 8.1, self.s.ask, q, blank)
        if not blank:
            self.hold = True

    def lines(self, n=2):
        self._q(n * 8.3, self.s.lines, n)

    def why(self, q, n=2, lead='왜 그럴까요? '):
        q = lead + q
        self._group([(nlines(q, 34) * 8.1, self.s.ask, (q, False)), (n * 8.3, self.s.lines, (n,))])

    def write(self, q, n=2):
        self.why(q, n, lead='')

    def pic(self, svgt, mm=150, maxh=None):
        Wd, Hd = svgt[1], svgt[2]
        if maxh is None:
            maxh = {'read': 64, 'draw': 84}.get(svgt[3] if len(svgt) > 3 else '', 80)
        mm = min(mm, 178, maxh * Wd / Hd)
        self._q(mm * Hd / Wd + 2.5, self.s.picture, png(svgt), mm, 'center')
        self.after_pic = True

    def choices(self, pairs):
        h = sum(max(12.0, nlines(q, 22) * 6.6 + 3, nlines(a, 13) * 6.6 + 3) for q, a in pairs)
        self._q(h, self.s.choices, pairs)

    def labeled(self, pairs, label_mm=None, row_h=3969):
        lw = label_mm or 30
        per = int((180 - lw) / 4.7)
        h = sum(max(row_h / 283.465, nlines(v, per) * 6.6 + 3) for _, v in pairs)
        self._q(h, self.s.labeled, pairs, label_mm, row_h)

    def wordbox(self, words):
        self._q(13.5, self.s.wordbox, words)

    def fill(self, sents):
        sents = [sents] if isinstance(sents, str) else sents
        self._q(sum(max(12.7, nlines(t, 33) * 8.0 + 3) for t in sents) + 1, self.s.fill, sents)

    def table(self, rows, **k):
        extra = sum(max(0, max(nlines(str(c), 14) for c in r) - 1) * 5.5 for r in rows)
        self._q(len(rows) * 11.6 + 1 + extra, self.s.table, rows, **k)

    def _group(self, items):
        def run():
            for _, fn, a in items:
                fn(*a)
        self._q(sum(i[0] for i in items), run)

    def pick(self, q, opts):
        items = [(nlines(q + ' 답: (        )', 34) * 8.1, self.s.ask, (q,))]
        for i, o in enumerate(opts):
            t = '%s %s' % ('①②③④⑤'[i], o)
            items.append((nlines(t, 37) * 7.4, self.s.text, (t,)))
        self._group(items)


# ---------------------------------------------------------------- 자주 쓰는 묶음
def gtable(g, blanks=(), si=None):
    head = '%s(%s)' % (g['xAxis'], g['xUnit']) if g.get('xUnit') else g['xAxis']
    cols = g['names'] if g.get('names') else g['xs']
    v = g['vals'] if si is None else vals(g, si)
    return [[head] + list(cols), ['%s(%s)' % (g['yAxis'], g['unit'])] + ['(     )' if i in blanks else fmt(x) for i, x in enumerate(v)]]


def trend_rows(g, si=0):
    return [('%s → %s' % (nm(g, i), nm(g, i + 1)), '( 늘어남 / 줄어듦 / 그대로 )') for i in range(len(g['xs']) - 1)]


def trend_key(g, si=0):
    return ', '.join('%s→%s %s' % (nm(g, i), nm(g, i + 1), t) for i, t in enumerate(trend(g, si)))


def order_rows(items):
    return [(t, '(    )번째') for t in items]


def order_key(items, order):
    rank = {idx: k + 1 for k, idx in enumerate(order)}
    return '(위에서부터) ' + ', '.join(str(rank[i]) for i in range(len(items)))


def write3(w, D, panes, row_h=6400):
    """[(이름, 기본형 문장 틀, 도전형 도움말)]"""
    w.labeled([(a, ('(%s)\n\n' % c) if D else (b + '\n\n')) for a, b, c in panes], row_h=row_h)


def scale_ask(w, D, g, waves, steps, unit_word=None):
    """물결선·세로 눈금 한 칸 고르기(앱 l5Build의 waveChoices·stepChoices)."""
    lo, st = pick_scale(g, waves or [0], steps)
    u = g['unit']
    rows = []
    if waves:
        rows.append(("물결선을 어디에 넣을까요?", '( ' + ' / '.join(('0과 %s 사이' % U(x, u)) if x else '넣지 않기' for x in waves) + ' )'))
    rows.append(("세로 눈금 한 칸의 크기는?", '( ' + ' / '.join(U(x, u) for x in steps) + ' )'))
    if not D:
        mn, mx = min(g['vals']), max(g['vals'])
        w.fill("가장 작은 수는 (        ), 가장 큰 수는 (        )예요. 세로 눈금은 %d칸이에요." % g['cells'])
    w.choices(rows)
    return lo, st


# ================================================================ 교과서 차시 버전 (힘찬시 편지)
def tb_l1(w, D):
    g, dish = G['temp'], G['dish']
    w.lesson(1, "개념 찾기(S)", "단원 도입 ― 힘찬시와 소망시의 학급 편지", "조사한 자료의 변화가 한눈에 보이도록 나타낼 방법은 없을까요?",
             "힘찬시에 사는 한결이는 다른 지역 친구 수아와 편지를 주고받아요. 두 친구는 자기 지역의 변화를 한눈에 보여 주고 싶어 해요.")
    w.step("① 그림 살펴보기", "하루의 길이")
    w.text("“지금은 하루의 길이가 24시간이지만 옛날에는 아니었대. 지구가 태어났을 때에는 4시간이었다고 하니 신기하지?”")
    w.pic(day_svg(), 120)
    w.ask("지구가 태어났을 때 하루의 길이는 몇 시간이었나요?")
    w.choices([("오랜 시간 동안 하루의 길이는?", "( 점점 길어졌어요 / 점점 짧아졌어요 / 변하지 않았어요 )")])
    w.pick("시간에 따라 변하는 양은 어떻게 나타내면 변화가 한눈에 보일까요?",
           ["때마다 값을 점으로 찍고 점들을 선으로 이어 나타내요.", "그림의 크기로 수량을 나타내요.", "글로만 길게 써요."])
    w.step("② 한결이의 편지", "편지 옆 그래프")
    w.text("“안녕? 나는 힘찬시에 사는 이한결이라고 해. 우리 도시는 바다 근처에 있어. 특산품은 갈치인데 여러 가지 요리로 만들어 먹으면 정말 맛있어. 또 겨울에는 다른 지역에 비해서 기온이 높은 편이지.”")
    w.pic(graph_svg(g), 110)
    w.choices([("힘찬시의 특산품은?", "( 갈치 / 사과 / 감귤 )"),
               ("편지 옆 그래프가 나타내는 것은?", "( 연도별 12월 최고 기온 / 월별 갈치 어획량 / 연도별 눈 온 날수 )"),
               ("한결이가 나타낸 그래프는?", "( 꺾은선으로 나타낸 그래프 / 막대그래프 / 그림그래프 )")])
    w.step("③ 곰곰! 배운 내용 떠올리기", "좋아하는 갈치 요리 막대그래프")
    w.table(gtable(dish))
    w.text("세로 눈금 한 칸은 1명이에요. 표를 보고 막대그래프를 완성해 보세요.")
    if not D:
        w.fill("구이 %d명 → 눈금 (    )칸,  조림 → (    )칸,  국 → (    )칸,  튀김 → (    )칸" % dish['vals'][0])
    w.pic(graph_svg(dish, pts=None, draw=True), 100)
    items = ["꺾은선그래프로 나타내기", "꺾은선그래프 알아보기", "꺾은선그래프를 생활에 활용하기", "꺾은선그래프의 내용 알아보기",
             "자료를 조사하여 꺾은선그래프로 나타내기"]
    order = [1, 3, 0, 4, 2]
    w.step("④ 똑똑! 무엇을 배울까요", "공부할 차례대로 번호 쓰기")
    w.choices(order_rows(items))
    w.step("⑤ 답장 쓰기", "한결이에게")
    write3(w, D, [("답장", "반가워! 나는 (          )에 사는 (          )(이)라고 해. 우리 지역은 (                    )", "내 소개와 우리 지역 소개"),
                  ("경험", "꺾은선으로 나타낸 그래프를 (                    )에서 본 적이 있어요.", "꺾은선 그래프를 본 곳"),
                  ("궁금", "꺾은선으로 나타낸 그래프는 (                    ) 자료를 나타내기에 좋을 것 같아요.", "어떤 자료에 좋을까요?")])
    ans = ("1차시  ① 4시간, 점점 길어졌어요, ① ② 갈치, 연도별 12월 최고 기온, 꺾은선으로 나타낸 그래프 "
           "③ 막대 %s칸 ④ %s ⑤ (생각 쓰기 — 예: 신문에서 월별 기온 그래프를 봤어요 / 시간이 지나면서 변하는 자료)"
           % (kk(dish), order_key(items, order)))
    if D:
        v = g['vals']
        w.step("⑥ 도전하기", "‘연도별 12월 최고 기온’ 그래프 더 읽기")
        w.ask("12월 최고 기온이 가장 높았던 해는?")
        w.ask("2021년의 12월 최고 기온은 몇 ℃인가요?")
        w.ask("2022년에는 2021년보다 몇 ℃ 낮아졌나요?")
        w.why("두 점의 높이 차이로 무엇을 알 수 있을까요?", 1)
        ans += " ⑥ %s, %s, %s, 왜: (예: 기온이 얼마나 변했는지 알 수 있어요)" % (
            peak(g), U(v[2], '℃'), U(v[2] - v[3], '℃'))
    return ans


def tb_l2(w, D):
    f, p, rain, room = G['fish'], G['plant'], G['rain'], G['room']
    w.lesson(2, "개념 구축하기(O)", "꺾은선그래프를 알아볼까요", "시간에 따라 변하는 자료를 점과 선분으로 나타내면 무엇이 편리할까요?",
             "한결이는 힘찬시의 월별 갈치 어획량을 표로 나타냈어요. 이번에는 막대 대신 점으로 나타내 볼까요?")
    w.step("① 만져 보기", "어획량만큼의 높이에 점 찍기")
    w.table(gtable(f))
    w.text("세로 눈금 한 칸은 %s이에요. 월마다 어획량만큼의 높이에 점을 찍고, 이웃한 점을 선분으로 이어 보세요." % U(f['step'], 't'))
    if not D:
        w.fill("8월 700 t → 눈금 (    )칸,  9월 → (    )칸,  10월 → (    )칸,  11월 → (    )칸,  12월 → (    )칸")
    w.pic(graph_svg(f, pts=None, draw=True), 110)
    w.step("② 두 그래프 견주기", "㈎ 막대그래프와 ㈏ 점과 선분")
    w.pic(pair_svg([("㈎", graph_svg(V(f, kind='bar'))), ("㈏", graph_svg(f))]), 165)
    w.choices([("두 그래프의 가로와 세로는?", "( 가로: 월, 세로: 어획량 / 가로: 어획량, 세로: 월 )"),
               ("변화를 한눈에 알아보기 쉬운 그래프는?", "( ㈎ / ㈏ )")])
    w.pick("두 그래프에서 어획량의 변화를 각각 어떻게 알 수 있나요?",
           ["㈎는 막대의 길이를 견주어, ㈏는 선이 어느 쪽으로 얼마나 기울어졌는지 보고 알아요.", "두 그래프 모두 제목을 보고 알아요."])
    if D:
        w.why("㈏가 변화를 알아보기 더 쉬운 까닭을 써 보세요.", 1)
    w.step("③ 약속하기", "꺾은선그래프")
    if not D:
        w.wordbox(["점", "선분", "꺾은선그래프", "막대그래프", "그림"])
    w.fill("㈏ 그래프와 같이 연속적으로 변화하는 양을 (      )으로 표시하고, 그 점들을 (      )으로 이어 그린 그래프를 (                )라고 해요.")
    w.step("④ 말해 보기", "어느 식물의 키 그래프")
    w.pic(graph_svg(p, mark=(3.5, '9월')), 110)
    w.choices([("가로와 세로는?", "( 가로: 월, 세로: 식물의 키 / 가로: 식물의 키, 세로: 월 )"),
               ("꺾은선이 나타내는 것은?", "( 식물의 키의 변화 / 식물의 잎의 수 / 달마다 내린 비의 양 )")])
    w.ask("세로 눈금 한 칸은 몇 cm를 나타내나요?" + ("  (도움: 0과 5 사이가 5칸)" if not D else ""))
    w.ask("조사하지 않은 9월의 식물의 키는 약 몇 cm일까요? 빨간 점선 위에 점을 찍고 써 보세요." + ("  (도움: 8월과 10월의 가운데쯤)" if not D else ""))
    w.pick("꺾은선그래프로 나타내면 어떤 점이 편리한가요?",
           ["조사하지 않은 때의 값도 두 점 사이의 선분을 보고 어림할 수 있어요.", "항목별 수량이 정확한 수로 쓰여 있어요."])
    nine = (p['vals'][3] + p['vals'][4]) / 2
    cards = [("월별 해수면 높이의 변화", 0), ("지역별 농업 가구 수", 1), ("하루 동안 시각별 운동장의 기온", 0),
             ("우리 반 학생들이 좋아하는 과일", 1), ("연도별 우리 학교 학생 수의 변화", 0), ("반별로 모은 헌 종이의 무게", 1)]
    w.step("⑤ 확인하기", "더 알맞은 그래프 고르기")
    w.choices([(t, "( 꺾은선그래프 / 막대그래프 )") for t, _ in cards])
    ans = ("2차시  ① 점 %s칸, 선분으로 잇기 ② 가로: 월, 세로: 어획량 / ㈏ / ① ③ 점, 선분, 꺾은선그래프 "
           "④ 가로: 월, 세로: 식물의 키 / 식물의 키의 변화 / %s / 약 %s / ① ⑤ %s"
           % (kk(f), U(p['step'], 'cm'), U(nine, 'cm'), ', '.join('꺾은선' if b == 0 else '막대' for _, b in cards)))
    if D:
        ans = ans.replace(" ③ ", " / 왜: (예: 선이 기울어진 정도로 늘고 줄어든 것이 바로 보여요) ③ ", 1)
        w.step("⑥ 도전하기", "강수량 그래프와 교실의 기온 그래프")
        w.pic(pair_svg([("막대그래프", graph_svg(V(rain, kind='bar'))), ("꺾은선그래프", graph_svg(rain))]), 150)
        w.choices([("강수량의 변화를 한눈에 알아보기 쉬운 그래프는?", "( 막대그래프 / 꺾은선그래프 )"),
                   ("6월의 강수량을 예상할 때 더 편리한 그래프는?", "( 막대그래프 / 꺾은선그래프 )")])
        w.pic(graph_svg(room), 130)
        w.choices([("가로와 세로는?", "( 가로: 시각, 세로: 기온 / 가로: 기온, 세로: 시각 )"),
                   ("꺾은선이 나타내는 것은?", "( 교실의 기온 변화 / 교실의 학생 수 / 하루의 길이 )")])
        w.ask("교실의 기온 그래프에서 세로 눈금 한 칸은 몇 ℃인가요?")
        w.why("6월의 강수량을 예상할 때 꺾은선그래프가 더 편리한 까닭을 써 보세요.", 1)
        ans += (" ⑥ 꺾은선그래프, 꺾은선그래프 / 가로: 시각, 세로: 기온 / 교실의 기온 변화 / %s, "
                "왜: (예: 5월과 7월의 점을 이은 선분을 보고 6월의 값을 어림할 수 있어요)" % U(room['step'], '℃'))
    return ans


def tb_l3(w, D):
    sn, m = G['snow'], G['multiA']
    m2 = V(m, step=2, lo=130, cells=10, major=10)
    p2, yo = G['plant2'], G['yoon']
    w.lesson(3, "개념 구축하기(O)", "꺾은선그래프의 내용을 알아볼까요", "꺾은선그래프를 보고 어떤 내용을 알 수 있을까요?",
             "수아는 겨울이 무척 춥다고 했어요. 한결이는 힘찬시의 연도별 눈 온 날수를 꺾은선그래프로 나타냈어요.")
    w.step("① 만져 보기", "선분마다 늘어남·줄어듦·그대로")
    w.pic(graph_svg(sn), 115)
    if not D:
        w.text("선분이 오른쪽 위로 올라가면 늘어남, 오른쪽 아래로 내려가면 줄어듦, 평평하면 그대로예요.")
    w.choices(trend_rows(sn))
    w.step("② 그려 보기", "‘연도별 눈 온 날수’ 그래프의 내용")
    w.ask("세로 눈금 한 칸은 며칠을 나타내나요?")
    w.ask("눈 온 날수가 가장 많은 해는?")
    v = sn['vals']
    w.ask("2022년에는 2021년보다 눈 온 날수가 며칠 더 적어졌나요?")
    w.ask("전년과 비교하여 눈 온 날수가 가장 많이 늘어난 때는?" + ("  (도움: 오른쪽 위로 가장 많이 올라간 선분)" if not D else ""))
    w.step("③ 말해 보기", "다문화 가구 수 ― 두 그래프 견주기")
    w.pic(pair_svg([("㈎", graph_svg(m)), ("㈏", graph_svg(m2))]), 170)
    w.pick("두 그래프의 다른 점을 모두 고르세요.", ["㈏에는 물결 모양의 선이 그려져 있어요.", "세로 눈금 한 칸의 크기가 달라요.",
                                           "조사한 자료가 달라요.", "가로에 나타낸 것이 달라요."])
    w.choices([("㈏에서 물결선이 생략한 부분은?", "( 0가구와 130가구 사이 / 130가구와 150가구 사이 / 0가구와 50가구 사이 )")])
    w.ask("㈎의 세로 눈금 한 칸은 몇 가구인가요?")
    w.ask("㈏의 세로 눈금 한 칸은 몇 가구인가요?" + ("  (도움: 130과 140 사이가 5칸)" if not D else ""))
    w.choices([("변화를 뚜렷하게 알 수 있는 그래프는?", "( ㈎ / ㈏ )")])
    w.step("④ 약속하기", "물결선")
    if not D:
        w.wordbox(["생략", "작게", "크게", "뚜렷하게", "변하지 않아요"])
    w.fill(["물결선(≈)은 일부분을 (          )할 때 사용해요.",
            "물결선을 사용하면 세로 눈금 한 칸의 크기를 (        ) 할 수 있어서 변화가 (            ) 보여요. 하지만 자료의 값은 (              )."])
    w.step("⑤ 확인하기", "㈏ 그래프로 묻고 답하기")
    w.ask("전년과 비교하여 다문화 가구 수가 가장 많이 늘어난 때는?")
    w.ask("전년과 비교하여 다문화 가구 수가 줄어든 때는?")
    w.ask("다문화 가구 수가 가장 많은 때는?")
    w.ask("2023년의 다문화 가구 수는 몇 가구인가요?" + ("  (도움: 130에서 몇 칸 위? 한 칸은 2가구)" if not D else ""))
    mv = m['vals']
    dec = [nm(m, i + 1) for i in range(len(mv) - 1) if mv[i + 1] < mv[i]]
    ans = ("3차시  ① %s ② %s, %s, %s, %s ③ ①②, 0가구와 130가구 사이, %s, %s, ㈏ ④ 생략, 작게, 뚜렷하게, 변하지 않아요 "
           "⑤ %s, %s, %s, %s"
           % (trend_key(sn), U(sn['step'], '일'), peak(sn), U(v[2] - v[3], '일'), segname(sn, 'inc'),
              U(m['step'], '가구'), U(m2['step'], '가구'), segname(m2, 'inc'), ', '.join(dec), peak(m2), U(mv[4], '가구')))
    if D:
        w.step("⑥ 도전하기", "식물의 키와 윤재의 몸무게")
        w.pic(graph_svg(p2), 105)
        w.text("매월 1일에 식물의 키를 조사했어요.")
        w.ask("5월의 식물의 키는 몇 cm인가요?")
        w.ask("7월에는 6월보다 몇 cm 더 자랐나요?")
        w.choices([("㉠ 시간이 지남에 따라 식물의 키가 자랐어요.", "( ○ / × )"),
                   ("㉡ 전월과 비교하여 식물의 키가 가장 적게 자란 때는 7월이에요.", "( ○ / × )")])
        w.pic(graph_svg(yo, mark=(.5, '7살 7월')), 110)
        w.text("매년 1월에 윤재의 몸무게를 쟀어요.")
        w.ask("9살과 10살 사이에 윤재의 몸무게는 몇 kg 늘었나요?")
        w.ask("7살 7월에 윤재의 몸무게는 약 몇 kg이었을까요? 빨간 점선 위에 점을 찍고 써 보세요.")
        w.why("㉡이 잘못된 까닭을 써 보세요.", 1)
        pv, yv = p2['vals'], yo['vals']
        assert segname(p2, 'min') == '4월'
        ans += (" ⑥ %s, %s, ㉠ ○ ㉡ ×, %s, 약 %s, 왜: 가장 적게 자란 때는 %s(1 cm)예요"
                % (U(pv[2], 'cm'), U(pv[4] - pv[3], 'cm'), U(yv[3] - yv[2], 'kg'), U((yv[0] + yv[1]) / 2, 'kg'), segname(p2, 'min')))
    return ans


def tb_l4(w, D):
    c, j, pe, cu, bi = G['cls'], G['jump'], G['pencil'], G['culture'], G['birth']
    w.lesson(4, "개념 구축하기(O)", "꺾은선그래프로 나타내는 방법을 알아볼까요", "표를 보고 꺾은선그래프로 나타내려면 어떻게 해야 할까요?",
             "한결이는 수아의 편지를 읽고 우리 학교의 연도별 학급 수를 조사했어요.")
    w.step("① 만져 보기", "연도별 학급 수 ― 세로 눈금 22칸")
    w.table(gtable(c))
    w.choices([("가로에 나타낼 것은?", "( 연도 / 학급 수 )"), ("세로에 나타낼 것은?", "( 연도 / 학급 수 )")])
    pick_scale(c, [0], [1, 2, 5])
    if not D:
        w.fill("가장 큰 수 (      )학급까지 나타내고, 홀수도 눈금에 맞아야 해요. 한 칸을 ( 1 / 2 / 5 )학급으로 정해요.")
    else:
        w.choices([("세로 눈금 한 칸의 크기는?", "( 1학급 / 2학급 / 5학급 )")])
    w.choices([("알맞은 제목은?", "( 좋아하는 학교 행사 / 연도별 한결이네 학교의 학급 수 / 한결이네 반 학생 수 )")])
    w.text("축 이름과 제목을 쓰고, 세로 눈금에 수를 쓴 뒤 점을 찍어 선분으로 이어 보세요.")
    w.pic(graph_svg(c, pts=None, ticks=False, axes=False, title=False, draw=True), 110)
    w.step("② 그려 보기", "물결선이 있는 꺾은선그래프")
    if not D:
        w.text("먼저 쉬운 것부터: 날짜별 색연필의 길이를 세로 눈금 10칸에 나타내 보세요.")
        w.table(gtable(pe))
        pick_scale(pe, [0], [1, 2, 5])
        w.fill("가장 큰 수 (      ) cm를 10칸에 나타내려면 한 칸을 ( 1 / 2 / 5 ) cm로 해요.")
        w.pic(graph_svg(pe, pts=None, ticks=False, draw=True), 90)
        w.text("높이뛰기 선수의 월별 최고 기록이에요. 물결선(0 cm와 220 cm 사이)과 눈금(한 칸 2 cm)을 그려 두었어요. 점을 찍어 보세요.")
        w.table(gtable(j))
        w.pic(graph_svg(j, pts=None, draw=True), 100)
    else:
        w.text("높이뛰기 선수의 월별 최고 기록을 물결선이 있는 꺾은선그래프로 나타내 보세요. 세로 눈금은 10칸이에요.")
        w.table(gtable(j))
        scale_ask(w, D, j, [0, 200, 220, 230], [1, 2, 5])
        w.pic(graph_svg(j, pts=None, ticks=False, wave=False, draw=True), 100)
        w.why("물결선을 그 자리에 넣은 까닭을 써 보세요.", 1)
    cards = [("가로에는 연도를, 세로에는 학급 수를 나타내요.", 0), ("자료의 값이 없는 0 cm와 220 cm 사이를 생략할 수 있어요.", 1),
             ("가장 큰 수 240 cm까지 나타낼 수 있게 정해요.", 2), ("무엇을 조사한 그래프인지 알 수 있게 붙여요.", 3),
             ("변하는 양이 무엇인지 생각해서 세로에 나타내요.", 0), ("가장 작은 수보다 위까지 생략하면 안 돼요.", 1)]
    bins = "㉠ 가로와 세로 ㉡ 물결선 ㉢ 세로 눈금 한 칸의 크기 ㉣ 제목"
    w.step("③ 말해 보기", "그릴 때 생각할 점")
    w.text("알맞은 것의 기호를 쓰세요.  " + bins)
    w.choices([(t, "(       )") for t, _ in cards])
    items = ["가장 큰 수를 나타낼 수 있도록 눈금 한 칸의 크기 정하기", "알맞은 제목 쓰기", "가로와 세로에 무엇을 나타낼지 정하기",
             "점을 찍고 점들을 선분으로 잇기", "물결선을 넣을 곳을 정하고 물결선 그리기"]
    order = [2, 4, 0, 3, 1]
    w.step("④ 약속하기", "꺾은선그래프로 나타내는 차례")
    w.choices(order_rows(items))
    w.step("⑤ 확인하기", "연도별 경상남도 문화 시설 수 ― 세로 눈금 15칸")
    w.table(gtable(cu))
    lo, st = scale_ask(w, D, cu, [0, 70, 75, 80], [1, 2, 5])
    w.pic(graph_svg(cu, pts=None, ticks=False, wave=False, draw=True), 105)
    ans = ("4차시  ① 가로: 연도, 세로: 학급 수 / 한 칸 %s / 연도별 한결이네 학교의 학급 수 / 점 %s칸(2005년과 2010년은 평평) "
           % (U(c['step'], '학급'), kk(c)))
    if not D:
        ans += ("② 색연필: 18 cm, 한 칸 %s, 점 %s칸 / 높이뛰기: 220 cm에서 %s칸 위 " % (U(pe['step'], 'cm'), kk(pe), kk(j)))
    else:
        ans += ("② 물결선 0 cm와 %s 사이, 한 칸 %s, 220 cm에서 %s칸 위, 왜: 가장 낮은 기록이 224 cm라 0~220 cm에는 자료의 값이 없어요 "
                % (U(j['lo'], 'cm'), U(j['step'], 'cm'), kk(j)))
    ans += ("③ %s ④ %s ⑤ %s물결선 0개와 %s 사이, 한 칸 %s, 75개에서 %s칸 위"
            % (' '.join('㉠㉡㉢㉣'[b] for _, b in cards), order_key(items, order),
               '' if D else '가장 작은 수 76개, 가장 큰 수 88개, ', U(lo, '개'), U(st, '개'), kk(cu)))
    if D:
        w.step("⑥ 도전하기", "연도별 출생아 수 ― 세로 눈금 10칸")
        w.table(gtable(bi))
        lo2, st2 = scale_ask(w, D, bi, [0, 200, 250, 300], [5, 10, 50])
        w.pic(graph_svg(bi, pts=None, ticks=False, wave=False, draw=True), 95)
        w.why("한 칸을 그 크기로 정한 까닭을 써 보세요.", 1)
        ans += (" ⑥ 물결선 0명과 %s 사이, 한 칸 %s, 250명에서 %s칸 위, 왜: 250명부터 10칸으로 가장 큰 수 330명까지 나타내야 해요"
                % (U(lo2, '명'), U(st2, '명'), kk(bi)))
    return ans


def tb_l56(w, D):
    h, hg, rope, reg = G['heat'], G['hang'], G['rope'], G['regions']
    days = [('%d일' % (i + 1), t) for i, t in enumerate(HOT)]
    hot = [d for d, t in days if t >= 33]
    w.lesson("5~6", "탐구 정리하기(O)", "자료를 조사하여 꺾은선그래프로 나타내어 볼까요",
             "우리 모둠이 정한 지역의 연도별 폭염일수를 조사하여 어떻게 나타낼까요?",
             "수아는 소망시가 여름에 매우 더워서 폭염일수가 많다고 했어요. 폭염일수는 하루 최고 기온이 33 ℃보다 높거나 같은 날의 수예요.")
    w.step("① 폭염일 알기", "어느 지역의 7월 1일~10일 하루 최고 기온")
    w.pic(hot_svg("어느 지역의 7월 1일~10일 하루 최고 기온(℃)", days), 165)
    if not D:
        w.text("빨간 점선(33 ℃)에 닿거나 그보다 높은 온도계에 ○표 하세요. 33.0 ℃인 날도 폭염일이에요.")
    w.ask("폭염일인 날을 모두 써 보세요.")
    w.ask("이 열흘 동안의 폭염일수는 며칠인가요?")
    w.step("② 자료 조사하기", "기상자료개방포털 폭염일수 검색 결과(예시)")
    months = ["5월", "6월", "7월", "8월", "9월"]
    rows = [["연도"] + months + ["연합계"]]
    for y, mm in PORTAL:
        rows.append([y] + [str(x) for x in mm] + ['(     )' if D else str(sum(mm))])
    w.table(rows)
    if D:
        w.text("‘연합계’는 한 해 동안의 폭염일수예요. 연합계를 계산해 쓰고 아래 표를 완성해 보세요.")
    else:
        w.text("한 해 동안의 폭염일수는 맨 오른쪽 ‘연합계’ 칸에 있어요. 표를 완성해 보세요.")
    w.table(gtable(h, blanks=range(5)))
    w.step("③ 그래프로 나타내기", "연도별 폭염일수 ― 세로 눈금 30칸")
    if not D:
        w.text("먼저 쉬운 것부터: 회차별 오래 매달리기 기록을 점으로 찍어 보세요(세로 눈금 한 칸 1초).")
        w.table(gtable(hg))
        w.pic(graph_svg(hg, pts=None, draw=True), 85)
        w.text("이제 연도별 폭염일수를 나타내 보세요.")
    lo, st = scale_ask(w, D, h, [0, 20, 30], [1, 2, 5])
    w.pic(graph_svg(h, pts=None, ticks=False, wave=False, draw=True), 110)
    w.step("④ 공학 도구로 나타내기", "간격과 물결선 바꾸어 보기")
    t5 = V(h, step=5, lo=0, cells=5, major=25)
    t1 = V(h, step=1, lo=20, cells=25, major=5)
    w.text("공학 도구에 연도별 폭염일수를 넣고 ㈎ 간격 5·물결선 없음, ㈏ 간격 1·물결선 있음으로 그렸어요.")
    w.pic(pair_svg([("㈎", graph_svg(t5)), ("㈏", graph_svg(t1))]), 170)
    w.choices([("변화가 더 뚜렷하게 보이는 그래프는?", "( ㈎ / ㈏ )"),
               ("㈏에서 2018년의 폭염일수는?", "( ㈎보다 많아요 / ㈎와 같아요 / ㈎보다 적어요 )")])
    w.step("⑤ 알 수 있는 내용 말하기", "완성한 그래프 읽기")
    w.ask("전년과 비교했을 때 폭염일수가 가장 많이 늘어난 때는?")
    w.ask("전년과 비교했을 때 폭염일수가 가장 많이 줄어든 때는?")
    w.ask("폭염일수가 가장 많았던 때는?")
    w.pic(graph_svg(reg), 135)
    w.text("두 모둠이 조사한 지역을 한 그래프에 나타냈어요.")
    r0, r1 = reg['series'][0]['vals'], reg['series'][1]['vals']
    w.choices([("2021년에 폭염일수가 더 많은 지역은?", "( 우리 모둠 지역 / 다른 모둠 지역 )")])
    ids_i, d = seg(h, 'inc')
    ids_d, _ = seg(h, 'dec')
    ans = ("5~6차시  ① %s / %d일 ② %s%s ③ %s물결선 0일과 %s 사이, 한 칸 %s, 20일에서 %s칸 위 ④ ㈏, ㈎와 같아요 "
           "⑤ %s(%d일 늘어남), %s(%d일 줄어듦), %s / %s"
           % (', '.join(hot), len(hot), '연합계 ' + ', '.join(str(sum(m)) for _, m in PORTAL) + ' / ' if D else '',
              ', '.join('%s년 %d일' % (x, v) for x, v in zip(h['xs'], h['vals'])),
              '' if D else '매달리기 점 %s칸 / 가장 작은 수 23일, 가장 큰 수 45일, ' % kk(hg),
              U(lo, '일'), U(st, '일'), kk(h), nm(h, ids_i[0]), d[ids_i[0] - 1], nm(h, ids_d[0]), -d[ids_d[0] - 1], peak(h),
              '우리 모둠 지역' if r0[3] > r1[3] else '다른 모둠 지역'))
    if D:
        w.step("⑥ 도전하기", "회차별 줄넘기 기록 ― 세로 눈금 10칸")
        w.table(gtable(rope))
        lo2, st2 = scale_ask(w, D, rope, [0, 30, 35], [1, 2, 5])
        w.pic(graph_svg(rope, pts=None, ticks=False, wave=False, draw=True), 95)
        w.why("물결선을 0개와 35개 사이에 넣으면 안 되는 까닭을 써 보세요.", 1)
        ans += (" ⑥ 물결선 0개와 %s 사이, 한 칸 %s, 30개에서 %s칸 위, 왜: 가장 작은 기록 33개를 나타낼 수 없어요"
                % (U(lo2, '개'), U(st2, '개'), kk(rope)))
    return ans


def tb_l7(w, D):
    pk, bu, bn = G['park'], G['bikeUse'], G['bikeN']
    bi, pe, rm, du, ma = G['birth'], G['peach'], G['room'], G['dust'], G['mask']
    w.lesson(7, "탐구 정리하기(O)", "꺾은선그래프를 생활에 활용해 볼까요", "꺾은선그래프를 해석하여 앞으로의 변화를 어떻게 예상할 수 있을까요?",
             "수아가 사는 곳에는 예쁜 공원이 많아요. 한결이는 힘찬시의 연도별 공원 수를 알아보았어요.")
    w.step("① 만져 보기", "선분마다 늘어남·줄어듦 표시하기")
    w.pic(graph_svg(pk), 115)
    w.choices(trend_rows(pk))
    w.step("② 예상하기", "2024년의 공원 수")
    w.pick("무엇을 조사하여 나타낸 꺾은선그래프인가요?", ["힘찬시에 있는 연도별 공원 수", "힘찬시의 연도별 눈 온 날수", "소망시의 연도별 공원 수"])
    w.ask("전년과 비교하여 공원 수가 가장 많이 늘어난 때는?")
    w.choices([("2024년의 공원 수는?", "( 늘어날 것 같아요 / 줄어들 것 같아요 )")])
    if D:
        w.why("그렇게 예상한 까닭을 써 보세요.", 1)
    else:
        w.fill("(          )년부터 (          )년까지 공원 수가 계속 (            ) 때문이에요.")
    w.step("③ 두 그래프 견주기", "공영 자전거 대여 횟수와 자전거 수")
    w.pic(pair_svg([(None, graph_svg(bu)), (None, graph_svg(bn))]), 175)
    w.choices([("대여 횟수는?", "( 계속 늘어났어요 / 계속 줄어들었어요 / 늘었다가 줄었어요 )"),
               ("공영 자전거 수는?", "( 계속 늘어났어요 / 계속 줄어들었어요 / 변하지 않았어요 )")])
    w.pick("두 자료는 어떤 관계가 있다고 말할 수 있나요?", ["대여 횟수가 늘어남에 따라 공영 자전거 수도 늘어나요.",
                                              "대여 횟수가 늘어남에 따라 공영 자전거 수는 줄어들어요.", "두 자료는 아무 관계가 없어요."])
    w.ask("‘연도별 공영 자전거 수’ 그래프의 세로 눈금 한 칸은 몇 대인가요?" + ("  (도움: 40000과 50000 사이가 5칸)" if not D else ""))
    w.step("④ 약속하기", "꺾은선그래프를 생활에 활용하기")
    if not D:
        w.wordbox(["늘어난", "줄어든", "예상할", "항상 맞는 것은 아니에요"])
    w.fill("선이 오른쪽 위로 올라가면 자료가 (          ) 것이고, 오른쪽 아래로 내려가면 (          ) 것이에요. 변화의 흐름을 보면 앞으로의 자료를 (          ) 수 있지만, 그 예상이 (                        ).")
    w.step("⑤ 확인하기", "알 수 있는 내용은 어느 그래프일까요?")
    w.pic(pair_svg([("㈎", graph_svg(bi)), ("㈏", graph_svg(pe)), ("㈐", graph_svg(rm))], gap=24), 178)
    cards = [("시간이 지남에 따라 계속 줄어들었어요.", 0), ("시간이 지남에 따라 계속 늘어났어요.", 1), ("늘어나다가 마지막에 조금 줄어들었어요.", 2),
             ("2023년은 2020년보다 70명 적어요.", 0), ("가장 높은 때는 오후 1시예요.", 2), ("2023년에는 1900 kg이에요.", 1)]
    assert bi['vals'][0] - bi['vals'][-1] == 70 and peak(rm) == '오후 1시' and pe['vals'][-1] == 1900
    w.choices([(t, "( ㈎ / ㈏ / ㈐ )") for t, _ in cards])
    ans = ("7차시  ① %s ② ①, %s, 늘어날 것 같아요, %s ③ 계속 늘어났어요, 계속 늘어났어요, ①, %s ④ 늘어난, 줄어든, 예상할, 항상 맞는 것은 아니에요 ⑤ %s"
           % (trend_key(pk), segname(pk, 'inc'),
              '왜: (예: 2020년부터 2023년까지 계속 늘어났기 때문이에요)' if D else '2020, 2023, 늘어났기',
              U(bn['step'], '대'), ', '.join('㈎㈏㈐'[b] for _, b in cards)))
    if D:
        w.step("⑥ 도전하기", "복숭아 수확량, 미세먼지와 마스크")
        w.choices([("복숭아 수확량(㈏)은 시간이 지남에 따라 계속?", "( 줄어들었어요 / 늘어났어요 )")])
        w.pic(pair_svg([(None, graph_svg(du)), (None, graph_svg(ma))]), 160)
        w.choices([("㉠ 미세먼지가 ‘나쁨’인 날수는 줄어들었어요.", "( ○ / × )"), ("㉡ 마스크 판매량은 늘어났어요.", "( ○ / × )")])
        w.pick("두 그래프는 어떤 관계가 있나요?", ["‘나쁨’인 날수가 늘어남에 따라 마스크 판매량도 늘어나요.", "‘나쁨’인 날수가 늘어남에 따라 마스크 판매량은 줄어들어요."])
        w.why("2024년의 복숭아 수확량을 예상하고 까닭을 써 보세요.", 1, lead='')
        ans += " ⑥ 늘어났어요, ㉠ × ㉡ ○, ①, (예: 2019년부터 2023년까지 계속 늘어났으니 2024년에도 늘어날 것 같아요)"
    return ans


def tb_l8(w, D):
    su, fl = G['sugar'], G['flour']
    w.lesson(8, "탐구 정리하기(O)", "생각을 더하다 ― 그래프에서 물건의 가격 변화를 알아볼까요?",
             "꺾은선그래프를 보고 물건의 가격이 어떻게 변할지 예상할 수 있을까요?",
             "물건의 가격은 재료의 가격과 이동 비용 등에 따라 오르거나 내려갈 수 있어요. 최근 4년간 설탕과 케첩의 가격을 조사했어요(출처: 소비자물가정보서비스, 2023).")
    sv, kv = vals(su, 0), vals(su, 1)
    w.step("① 그래프 살펴보기", "연도별 설탕과 케첩의 가격")
    w.pic(graph_svg(su), 140)
    w.choices([("가로와 세로는?", "( 가로: 연도, 세로: 가격 / 가로: 가격, 세로: 연도 )"),
               ("물결선이 나타내는 것은?", "( 0원과 1500원 사이를 생략했어요 / 가격이 1500원만큼 떨어졌어요 / 1500원과 2000원 사이를 생략했어요 )")])
    w.ask("세로 눈금 한 칸은 몇 원을 나타내나요?" + ("  (도움: 1500과 2000 사이가 5칸)" if not D else ""))
    w.ask("2022년 설탕(1 kg)의 가격은 몇 원인가요?")
    w.step("② 변화 표시하기", "케첩(500 g) 선의 선분마다")
    w.choices(trend_rows(su, 1))
    w.step("③ 관계와 예상", "두 꺾은선을 함께 보기")
    w.choices([("설탕과 케첩의 가격은?", "( 두 가지 모두 계속 올랐어요 / 설탕은 오르고 케첩은 내렸어요 / 두 가지 모두 계속 내렸어요 )"),
               ("두 가격의 관계는?", "( 설탕이 올라감에 따라 케첩도 올라가요 / 설탕이 올라감에 따라 케첩은 내려가요 )"),
               ("2023년의 두 가격은?", "( 계속 올랐으니 오를 것 같아요 / 2022년에 많이 올랐으니 반드시 내려가요 )"),
               ("“설탕의 가격이 오르면 케첩의 가격도 반드시 똑같이 오른다.”", "( ○ / × )")])
    ids, d = seg(su, 'inc', 0)
    w.step("④ 가장 많이 오른 때", "설탕 가격")
    if not D:
        w.fill("1856 − 1664 = (        )원,   1907 − 1856 = (        )원,   2188 − 1907 = (        )원")
    w.ask("설탕의 가격이 전년과 비교하여 가장 많이 오른 때는?")
    w.ask("그때 설탕의 가격은 전년보다 몇 원 올랐나요?")
    w.step("⑤ 밀가루와 어묵", "연도별 밀가루와 어묵의 가격")
    w.pic(graph_svg(fl), 140)
    w.ask("밀가루(1 kg)의 가격이 전년보다 가장 많이 오른 때는?")
    w.ask("어묵(300 g)의 가격이 전년보다 가장 많이 오른 때는?")
    w.choices([("밀가루와 어묵의 가격 변화는?", "( 둘 다 계속 올랐어요 / 밀가루는 2020년에 내렸어요 / 어묵은 2021년에 내렸어요 )"),
               ("2023년의 두 가격은?", "( 둘 다 오를 것 같아요 / 둘 다 내릴 것 같아요 )")])
    assert all(x > 0 for x in seg(fl, 'inc', 0)[1] + seg(fl, 'inc', 1)[1] + seg(su, 'inc', 1)[1])
    ans = ("8차시  ① 가로: 연도, 세로: 가격 / 0원과 1500원 사이를 생략했어요 / %s / %s ② %s "
           "③ 모두 계속 올랐어요, 설탕이 올라감에 따라 케첩도 올라가요, 오를 것 같아요, × ④ %s%s, %s ⑤ %s, %s, 둘 다 계속 올랐어요, 둘 다 오를 것 같아요"
           % (U(su['step'], '원'), U(sv[3], '원'), trend_key(su, 1), '' if D else '192, 51, 281 / ',
              nm(su, ids[0]), U(d[ids[0] - 1], '원'), segname(fl, 'inc', 0), segname(fl, 'inc', 1)))
    if D:
        fv, ev = vals(fl, 0), vals(fl, 1)
        w.step("⑥ 도전하기", "가격 계산하기")
        w.ask("2022년 어묵의 가격은 2021년보다 몇 원 올랐나요?")
        w.ask("밀가루의 가격은 2019년부터 2022년까지 모두 몇 원 올랐나요?")
        w.ask("2022년에 어묵(300 g)은 밀가루(1 kg)보다 몇 원 더 비싼가요?")
        w.why("“설탕의 가격이 오르면 케첩의 가격도 반드시 똑같이 오른다.”가 틀린 까닭을 써 보세요.", 1)
        ans += (" ⑥ %s, %s, %s, 왜: 물건의 가격은 재료의 가격뿐 아니라 이동 비용 등 여러 가지에 따라 정해져요"
                % (U(ev[3] - ev[2], '원'), U(fv[3] - fv[0], '원'), U(ev[3] - fv[3], '원')))
    return ans


def mood_rows(g, notes, head='월', score='감정 점수(점)', unit='월', blank=False):
    rows = [[head, '가장 기억에 남는 일', score]]
    for i, x in enumerate(g['xs']):
        rows.append([x + unit, '' if blank else notes[i], '' if blank else str(g['vals'][i])])
    return rows


def tb_l9(w, D):
    me, pa = G['moodEx'], G['pair']
    w.lesson(9, "발표하기(P)", "놀이를 더하다 ― 너의 감정을 그래프로 나타내 봐!", "나의 감정은 한 해 동안 어떻게 변했을까요?",
             "매월 가장 기억에 남는 일과 그때의 감정을 0점부터 100점까지의 점수로 나타내고, 꺾은선그래프로 그려요.")
    items = ["월별 감정 점수를 꺾은선그래프로 나타내기", "친구들과 감정 그래프를 비교하고 알 수 있는 내용 이야기하기",
             "감정 점수표에 매월 가장 기억에 남는 일을 쓰고 감정을 0점~100점으로 나타내기"]
    w.step("① 놀이 방법 알기", "차례대로 번호 쓰기")
    w.choices(order_rows(items))
    w.step("② 예시 그래프 그리기", "어느 친구의 월별 나의 감정 점수표")
    w.table(mood_rows(me, MOODTBL), col_mm=[22, 118, 40])
    if not D:
        w.fill("세로 눈금 한 칸은 10점이에요. 80점 → (    )칸, 70점 → (    )칸, 20점 → (    )칸")
    w.pic(graph_svg(me, pts=None, draw=True), 120)
    w.step("③ 변화 찾기", "완성한 감정 그래프 읽기")
    w.ask("전월과 비교하여 감정 점수의 변화가 가장 큰 때는?" + ("  (도움: 올라간 것도 내려간 것도 변화예요)" if not D else ""))
    w.ask("전월과 비교하여 감정 점수의 변화가 가장 작은 때를 모두 써 보세요.")
    w.ask("감정 점수가 가장 높은 달은?")
    w.step("④ 나의 감정 그래프", "3월부터 11월까지")
    w.table(mood_rows(me, MOODTBL, blank=True), col_mm=[22, 118, 40])
    w.pic(graph_svg(V(me, title='월별 나의 감정 그래프'), pts=None, draw=True), 115)
    w.ask("내 그래프에서 전월과 비교하여 감정 점수의 변화가 가장 큰 때는?")
    w.ask("내 그래프에서 전월과 비교하여 감정 점수의 변화가 가장 작은 때는?")
    w.step("⑤ 친구와 비교하기", "나이별 감정 그래프(‘나’와 ‘친구’)")
    w.pic(graph_svg(pa), 120)
    a0, a1 = vals(pa, 0), vals(pa, 1)
    w.ask("‘나’의 감정 점수가 가장 높은 나이는?")
    w.ask("‘친구’의 점수가 ‘나’보다 높은 나이를 모두 써 보세요.")
    w.ask("‘나’의 감정 점수가 전년보다 줄어든 나이는?")
    w.ask("‘친구’의 감정 점수가 전년과 같은 나이는?")
    ids_b, d = seg(me, 'abs')
    ans = ("9차시  ① %s ② 점 %s칸 ③ %s(%d점 변함), %s, %s ④ (내 그래프 — 선분이 가장 많이·가장 덜 기울어진 달) "
           "⑤ %s, %s, %s, %s"
           % (order_key(items, [2, 0, 1]), kk(me), segname(me, 'abs'), abs(d[ids_b[0] - 1]), segname(me, 'min'), peak(me),
              peak(pa, 'max', 0), ', '.join(nm(pa, i) for i in range(5) if a1[i] > a0[i]),
              ', '.join(nm(pa, i + 1) for i in range(4) if a0[i + 1] < a0[i]),
              ', '.join(nm(pa, i + 1) for i in range(4) if a1[i + 1] == a1[i])))
    if D:
        gf = V(pa, series=None, vals=a1, title='나이별 감정 그래프')
        w.step("⑥ 도전하기", "‘나’의 선(회색) 위에 친구의 꺾은선 그리기")
        w.table(gtable(gf))
        w.pic(graph_svg(gf, pts=None, bg={'name': '나', 'vals': a0, 'me': '친구'}, legend=True, draw=True), 115)
        w.why("9살에 ‘나’와 ‘친구’의 감정은 각각 어떻게 변했나요?", 1, lead='')
        ans += " ⑥ 친구 점 %s칸, (예: 9살에 친구는 점수가 올랐지만 나는 내려갔어요)" % kk(gf)
    return ans


def tb_l10(w, D):
    gd, pp, dr = G['good'], G['pop'], G['drink']
    w.lesson(10, "발표하기(P)", "공부한 내용을 확인해요", "꺾은선그래프를 읽고, 그리고, 활용할 수 있나요?",
             "꺾은선그래프에서 가로·세로와 세로 눈금 한 칸의 크기를 확인하고, 선분이 기울어진 쪽과 정도를 보며 변화를 알아봐요.")
    w.step("① 척척! 그래프 읽기", "월별 미세먼지가 ‘좋음’인 날수")
    w.pic(graph_svg(gd), 110)
    w.choices([("가로와 세로는?", "( 가로: 월, 세로: 날수 / 가로: 날수, 세로: 월 )")])
    w.ask("세로 눈금 한 칸은 며칠을 나타내나요?" + ("  (도움: 0과 10 사이가 5칸)" if not D else ""))
    w.step("② 척척! ○× 문제", "같은 그래프 보기")
    gv = gd['vals']
    st = [("‘좋음’인 날수가 가장 많은 때는 8월이에요.", peak(gd) == '8월'),
          ("전월과 비교하여 ‘좋음’인 날수가 가장 많이 줄어든 때는 11월이에요.", segname(gd, 'dec') == '11월'),
          ("‘좋음’인 날수는 7월부터 줄어들었어요.", gv[1] < gv[0])]
    w.choices([(t, "( ○ / × )") for t, _ in st])
    w.step("③ 척척! 그래프 완성하기", "어느 지역의 연도별 인구")
    w.table(gtable(pp))
    w.text("빠진 2014년의 점을 찍어 꺾은선그래프를 완성해 보세요." + (" (굵은 눈금 45에 맞춰요)" if not D else ""))
    pv = pp['vals']
    w.pic(graph_svg(pp, pts=[v if i != 2 else None for i, v in enumerate(pv)], draw=True), 120)
    w.step("④ 척척! 어림하고 예상하기", "조사하지 않은 2020년")
    w.pic(graph_svg(pp, mark=(3.5, '2020년')), 110)
    w.ask("2020년의 인구는 약 몇만 명이었을까요? 빨간 점선 위에 점을 찍고 써 보세요.")
    w.choices([("앞으로 이 지역의 인구는?", "( 줄어들 것 같아요 / 늘어날 것 같아요 )")])
    if D:
        w.why("그렇게 예상한 까닭을 써 보세요.", 1)
    else:
        w.pick("그렇게 예상한 까닭은?", ["2014년부터 2022년까지 인구가 계속 줄어들었기 때문이에요.", "2006년부터 2014년까지 인구가 늘어났기 때문이에요."])
    w.step("⑤ 꼭꼭! 확인하고 정리해요", "아기 곰 얼음 조각 건너기")
    w.pic(graph_svg(dr), 115)
    dv = dr['vals']
    ice = [("월별 음료수 판매량을 조사하여 나타낸 꺾은선그래프예요.", True), ("세로 눈금 한 칸은 10병을 나타내요.", dr['step'] == 10),
           ("10월의 판매량은 150병이에요.", dv[4] == 150), ("시간이 지남에 따라 판매량은 줄어들었어요.", False),
           ("전월과 비교하여 판매량이 가장 많이 줄어든 때는 9월이에요.", segname(dr, 'dec') == '9월')]
    w.text("옳은 문장에 ○, 옳지 않은 문장에 ×를 하세요. ○인 얼음 조각만 밟아야 엄마 곰을 만나요.")
    w.choices([('얼음 %d. %s' % (i + 1, t), "( ○ / × )") for i, (t, _) in enumerate(ice)])
    ox = lambda b: '○' if b else '×'
    ans = ("10차시  ① 가로: 월, 세로: 날수 / %s ② %s ③ 2014년 %s(28에서 %s칸 위) ④ 약 %s, 줄어들 것 같아요, %s "
           "⑤ %s → 얼음 1·5"
           % (U(gd['step'], '일'), ' '.join(ox(b) for _, b in st), U(pv[2], '만 명'), fmt(cells_of(pp)[2]),
              U((pv[3] + pv[4]) / 2, '만 명'), '왜: (예: 2014년부터 계속 줄어들었기 때문이에요)' if D else '①',
              ' '.join(ox(b) for _, b in ice)))
    assert [b for _, b in ice] == [True, False, False, False, True]
    if D:
        w.step("⑥ 도전하기", "‘월별 음료수 판매량’ 더 읽기")
        w.ask("8월의 음료수 판매량은 몇 병인가요?")
        w.ask("9월의 판매량은 8월보다 몇 병 줄어들었나요?")
        w.ask("전월과 비교하여 판매량이 가장 많이 늘어난 때를 모두 써 보세요.")
        w.choices([("판매량의 변화를 알아보기에 더 알맞은 그래프는?", "( 막대그래프 / 꺾은선그래프 )")])
        w.why("‘시간이 지남에 따라 판매량은 줄어들었어요.’를 옳게 고쳐 써 보세요.", 1, lead='')
        ans += (" ⑥ %s, %s, %s, 꺾은선그래프, (예: 6월부터 8월까지는 늘어났다가 그 뒤로 줄어들었어요)"
                % (U(dv[2], '병'), U(dv[2] - dv[3], '병'), segname(dr, 'inc')))
    return ans


# ================================================================ 이야기 버전 (강낭콩 관찰 연구소)
def st_l1(w, D):
    sp, tw = S['sprout'], S['town']
    w.lesson(1, "개념 찾기(S)", "강낭콩 관찰 연구소를 열어요",
             "강낭콩이 자라는 모습처럼 시간에 따라 변하는 기록을 어떻게 나타내면 한눈에 보일까요?",
             "새싹초등학교 4학년 3반은 강낭콩을 기르는 ‘강낭콩 관찰 연구소’를 열었어요. 연구소장 하은, 기록 담당 지우, 온도 담당 민준, 사진 담당 서진이 함께해요.")
    w.step("① 만져 보기 — 보기·생각하기·궁금해하기", "강낭콩 화분과 온도계를 떠올리며")
    write3(w, D, [("보여요", "강낭콩을 기르면 (                    )을 잴 수 있어요.", "연구소에서 잴 수 있는 것"),
                  ("생각해요", "잰 기록은 (                    )로 나타내면 좋겠어요.", "기록을 정리했던 경험"),
                  ("궁금해요", "(                    )은 어떻게 나타낼까?", "변하는 기록을 나타내는 방법에 대해 궁금한 것")])
    w.step("② 그려 보기 — 막대그래프 떠올리기", "모둠별 싹이 튼 강낭콩 수")
    w.table(gtable(sp))
    w.text("세로 눈금 한 칸은 1개예요. 막대그래프로 나타내 보세요.")
    if not D:
        w.fill("1모둠 %d개 → 눈금 (    )칸,  2모둠 → (    )칸,  3모둠 → (    )칸,  4모둠 → (    )칸" % sp['vals'][0])
    w.pic(graph_svg(sp, pts=None, draw=True), 100)
    w.step("③ 말해 보기 — 점과 선으로 나타낸 그래프", "민준이가 가져온 그래프(이야기 속 자료)")
    w.pic(graph_svg(tw), 115)
    w.choices([("그래프의 가로가 나타내는 것은?", "( 월 / 기온 )")])
    w.ask("7월의 낮 최고 기온은 몇 ℃인가요?" + ("  (도움: 0과 10 사이가 5칸이니 한 칸은 2 ℃)" if not D else ""))
    w.ask("낮 최고 기온이 가장 높은 달은?")
    if D:
        w.why("이 그래프를 보면 무엇을 한눈에 알 수 있을까요?")
    else:
        w.fill("왜 그럴까요? 달마다 기온이 (                    )하다가 9월에 (              ) 모습을 한눈에 알 수 있어요.")
    w.step("④ 약속하기 — 무엇을 배울까요", "알맞은 것 고르기")
    w.pick("강낭콩의 키처럼 시간에 따라 변하는 기록은 어떻게 나타내면 변화가 잘 보일까요?",
           ["때마다 값을 점으로 찍고 점들을 선으로 이어요.", "그림의 크기로 나타내요.", "글로만 길게 써요."])
    w.pick("점과 선으로 나타낸 그래프를 읽을 때 먼저 확인할 것은?",
           ["가로와 세로가 무엇을 나타내는지와 세로 눈금 한 칸의 크기", "선의 색깔과 굵기"])
    w.choices([("그래프를 보고 더 할 수 있는 일은?", "( 앞으로 어떻게 변할지 예상하기 / 강낭콩의 색깔 바꾸기 )")])
    w.step("⑤ 확인하기 — 관찰 계획 세우기", "연구 일지")
    write3(w, D, [("잴 것", "나는 강낭콩의 (              )을 (          )마다 재어 기록하고 싶어요.", "무엇을 재어 기록하고 싶나요?"),
                  ("예상", "처음에는 (              )하다가 시간이 지나면 (              )할 것 같아요.", "기록이 어떻게 변할 것 같나요?")], row_h=5600)
    tv = tw['vals']
    ans = ("1차시  ① (생각 쓰기 — 예: 줄기의 키를 잴 수 있어요 / 표로 / 자라는 모습을 한눈에 볼 수 있을까?) ② 막대 %s칸 "
           "③ 월, %s, %s, (예: 기온이 점점 올라가다가 9월에 내려가는 모습) ④ ①, ①, 앞으로 어떻게 변할지 예상하기 "
           "⑤ (예: 강낭콩 줄기의 키를 이틀마다 / 처음에는 조금씩 자라다가 빠르게 커질 것 같아요)"
           % (kk(sp), U(tv[2], '℃'), peak(tw)))
    if D:
        ids, d = seg(tw, 'dec')
        w.step("⑥ 도전하기", "‘월별 우리 고장의 낮 최고 기온’ 더 읽기")
        w.ask("전월과 비교하여 기온이 가장 많이 내려간 때는?")
        w.ask("9월의 기온은 8월보다 몇 ℃ 낮아졌나요?")
        w.why("8월의 점과 9월의 점은 3칸 차이 나요. 기온 차이가 3 ℃가 아닌 까닭을 써 보세요.", 1, lead='')
        ans += " ⑥ %s, %s, (예: 세로 눈금 한 칸이 2 ℃이므로 3칸은 6 ℃예요)" % (nm(tw, ids[0]), U(-d[ids[0] - 1], '℃'))
    return ans


def st_l2(w, D):
    ha, ya = S['hae'], S['yard']
    w.lesson(2, "개념 구축하기(O)", "하은이 강낭콩의 키 ― 꺾은선그래프를 알아봐요",
             "시간에 따라 변하는 기록을 점과 선분으로 나타내면 무엇이 편리할까요?",
             "연구소장 하은이가 10월 2일부터 이틀마다 강낭콩의 키를 재어 표로 정리했어요.")
    w.step("① 만져 보기 — 키를 점으로 찍기", "세로 눈금 한 칸 1 cm")
    w.table(gtable(ha))
    if D:
        w.write("먼저 예상해요. 점을 어느 높이에 찍으면 좋을까요? 내 규칙을 써 보세요.", 1)
    else:
        w.fill("먼저 예상해요. 내 규칙: 키가 (      ) cm이면 그 날짜 위 (      )칸 높이에 점을 찍어요.")
    w.pic(graph_svg(ha, pts=None, draw=True), 105)
    w.step("② 그려 보기 — 막대와 꺾은선 견주기", "㈎ 막대그래프와 ㈏ 꺾은선그래프")
    w.pic(pair_svg([("㈎", graph_svg(V(ha, kind='bar'))), ("㈏", graph_svg(ha))]), 160)
    w.choices([("두 그래프의 가로와 세로는?", "( 가로: 날짜, 세로: 키 / 가로: 키, 세로: 날짜 )"),
               ("㈎와 ㈏는 키를 각각 어떻게 나타냈나요?", "( ㈎ 막대, ㈏ 점과 선분 / ㈎ 선분, ㈏ 막대 )"),
               ("자라는 모습을 한눈에 알아보기 쉬운 그래프는?", "( ㈎ / ㈏ )")])
    if D:
        w.why("㈏ 그래프에서 키가 가장 많이 자란 때를 어떻게 한눈에 찾을 수 있을까요?")
    else:
        w.fill("왜 그럴까요? 선분이 오른쪽 위로 가장 (                    ) 곳을 찾으면 돼요.")
    w.step("③ 말해 보기 — 재지 않은 날 어림하기", "하은이는 7일에 결석했어요")
    w.pic(graph_svg(ha, mark=(2.5, '7일')), 105)
    hv = ha['vals']
    w.ask("세로 눈금 한 칸은 몇 cm를 나타내나요?")
    w.ask("7일의 키는 약 몇 cm일까요? 빨간 점선 위에 점을 찍고 써 보세요." + ("  (도움: 6일과 8일의 가운데쯤)" if not D else ""))
    w.pick("꺾은선그래프로 나타내면 어떤 점이 편리한가요?",
           ["재지 않은 날의 값도 두 점 사이의 선분을 보고 어림할 수 있어요.", "날짜마다 키가 정확한 수로 쓰여 있어요."])
    w.step("④ 약속하기 — 꺾은선그래프")
    if not D:
        w.wordbox(["점", "선분", "막대", "꺾은선그래프", "그림그래프"])
    w.fill("강낭콩의 키처럼 연속적으로 변화하는 양을 (      )으로 표시하고, 그 점들을 (      )으로 이어 그린 그래프를 (                )라고 해요.")
    cards = [("날짜별 우리 반 강낭콩의 키", 0), ("모둠별로 수확한 강낭콩 꼬투리 수", 1), ("하루 동안 시각별 교실의 기온", 0),
             ("우리 반 학생들이 좋아하는 콩 요리", 1), ("주별 화분 흙의 온도", 0), ("콩의 종류별 씨앗 한 개의 무게", 1)]
    w.step("⑤ 확인하기 — 어떤 그래프가 알맞을까", "연구소에서 기록할 자료")
    w.choices([(t, "( 꺾은선그래프 / 막대그래프 )") for t, _ in cards])
    ids, d = seg(ha, 'inc')
    ans = ("2차시  ① 내 규칙: 한 칸이 1 cm이므로 키만큼 칸을 세어 점 찍기, 점 %s칸 ② 가로: 날짜, 세로: 키 / ㈎ 막대, ㈏ 점과 선분 / ㈏ / "
           "왜: 선분이 오른쪽 위로 가장 많이 기울어진 곳(%s→%s, %s) ③ %s, 약 %s, ① ④ 점, 선분, 꺾은선그래프 ⑤ %s"
           % (kk(ha), nm(ha, ids[0] - 1), nm(ha, ids[0]), U(d[ids[0] - 1], 'cm'), U(ha['step'], 'cm'), U((hv[2] + hv[3]) / 2, 'cm'),
              ', '.join('꺾은선' if b == 0 else '막대' for _, b in cards)))
    if D:
        yv = ya['vals']
        w.step("⑥ 도전하기", "시각별 운동장의 기온")
        w.pic(graph_svg(ya, mark=(1.5, '오전 10시 30분')), 110)
        w.ask("오전 10시의 운동장 기온은 몇 ℃인가요?")
        w.ask("재지 않은 오전 10시 30분의 기온은 약 몇 ℃일까요? 점을 찍고 써 보세요.")
        w.ask("한 시간 전과 비교하여 기온이 가장 많이 오른 때는?")
        w.why("오전 10시 30분의 기온을 그렇게 어림한 까닭을 써 보세요.", 1)
        ans += (" ⑥ %s, 약 %s, %s, 왜: 두 점 사이에서 일정하게 변한다고 생각하면 16 ℃와 20 ℃의 가운데예요"
                % (U(yv[1], '℃'), U((yv[1] + yv[2]) / 2, '℃'), segname(ya, 'inc')))
    return ans


def st_l3(w, D):
    mo, vi, ji, v2 = S['morning'], S['vine'], S['jiwoo'], S['vine2']
    vb = V(vi, step=1, lo=40, cells=15, major=5)
    w.lesson(3, "개념 구축하기(O)", "교실 기온과 덩굴 강낭콩 ― 꺾은선그래프를 읽어요",
             "꺾은선그래프를 보고 어떤 내용을 알 수 있을까요? 물결선은 왜 쓸까요?",
             "강낭콩은 따뜻해야 잘 자라요. 민준이가 한 주 동안 아침마다 교실의 기온을 재어 꺾은선그래프로 나타냈어요.")
    w.step("① 만져 보기 — 오르락내리락 표시하기", "요일별 아침 교실의 기온")
    if D:
        w.write("먼저 예상해요. 선분의 모양을 보고 늘었는지 줄었는지 어떻게 알 수 있을까요? 내 규칙을 써 보세요.", 1)
    else:
        w.fill("먼저 예상해요. 내 규칙: 선분이 오른쪽 위로 가면 (          ), 오른쪽 아래로 가면 (          )이에요.")
    w.pic(graph_svg(mo), 110)
    w.choices(trend_rows(mo))
    w.step("② 그려 보기 — 그래프에서 내용 찾기")
    mv = mo['vals']
    w.ask("세로 눈금 한 칸은 몇 ℃를 나타내나요?")
    w.ask("아침 기온이 가장 높았던 요일은?")
    w.ask("목요일의 아침 기온은 수요일보다 몇 ℃ 높나요?")
    w.ask("전날과 비교하여 기온이 가장 많이 내려간 때는?" + ("  (도움: 오른쪽 아래로 가장 많이 기울어진 선분)" if not D else ""))
    w.step("③ 말해 보기 — 물결선 만나기", "교문 옆 덩굴 강낭콩의 키")
    w.pic(pair_svg([("㈎", graph_svg(vi)), ("㈏", graph_svg(vb))]), 170)
    w.pick("두 그래프의 다른 점을 모두 고르세요.", ["㈏에는 물결 모양의 선이 그려져 있어요.", "세로 눈금 한 칸의 크기가 달라요.",
                                           "조사한 강낭콩이 달라요.", "가로에 나타낸 것이 달라요."])
    w.choices([("㈏에서 물결선이 생략한 부분은?", "( 0 cm와 40 cm 사이 / 40 cm와 55 cm 사이 / 0 cm와 10 cm 사이 )")])
    w.ask("㈎의 세로 눈금 한 칸은 몇 cm인가요?" + ("  (도움: 0과 10 사이가 2칸)" if not D else ""))
    w.ask("㈏의 세로 눈금 한 칸은 몇 cm인가요?")
    w.choices([("키의 변화를 뚜렷하게 알 수 있는 그래프는?", "( ㈎ / ㈏ )")])
    if D:
        w.why("지우가 “㈏에서는 선이 더 많이 기울었으니 덩굴 강낭콩이 더 많이 자랐네!”라고 했어요. 맞는 말일까요?")
    else:
        w.fill("왜 그럴까요? 지우의 말은 (    ). 물결선은 필요 없는 부분을 (          )해서 변화가 뚜렷하게 보일 뿐, 강낭콩의 키는 (          ).")
    w.step("④ 약속하기 — 물결선")
    if not D:
        w.wordbox(["생략", "작게", "크게", "뚜렷하게", "변하지 않아요"])
    w.fill(["물결선(≈)은 일부분을 (          )할 때 사용해요.",
            "물결선을 사용하면 세로 눈금 한 칸의 크기를 (        ) 할 수 있어서 변화가 (            ) 보여요. 하지만 자료의 값은 (              )."])
    w.step("⑤ 확인하기 — 묻고 답하기", "㈏ 그래프 보기")
    w.ask("이틀 전과 비교하여 가장 많이 자란 때는?")
    w.ask("이틀 전과 비교하여 가장 조금 자란 때는?")
    w.ask("28일의 덩굴 강낭콩의 키는 몇 cm인가요?" + ("  (도움: 40 cm에서 몇 칸 위?)" if not D else ""))
    ids, d = seg(mo, 'dec')
    ans = ("3차시  ① 내 규칙: 오른쪽 위 늘어남, 오른쪽 아래 줄어듦 / %s ② %s, %s, %s, %s ③ ①②, 0 cm와 40 cm 사이, %s, %s, ㈏, "
           "왜: 아니에요. 물결선은 필요 없는 부분을 생략할 뿐 강낭콩의 키는 두 그래프에서 똑같아요 ④ 생략, 작게, 뚜렷하게, 변하지 않아요 ⑤ %s, %s, %s"
           % (trend_key(mo), U(mo['step'], '℃'), peak(mo), U(mv[3] - mv[2], '℃'), nm(mo, ids[0]), U(vi['step'], 'cm'), U(vb['step'], 'cm'),
              segname(vb, 'inc'), segname(vb, 'min'), U(vb['vals'][4], 'cm')))
    if D:
        jv = ji['vals']
        w.step("⑥ 도전하기", "지우 강낭콩의 키와 덩굴 강낭콩")
        w.pic(graph_svg(ji), 100)
        w.ask("3주의 지우 강낭콩의 키는 몇 cm인가요?")
        w.ask("5주에는 4주보다 몇 cm 더 자랐나요?")
        w.choices([("㉠ 시간이 지남에 따라 지우 강낭콩의 키가 자랐어요.", "( ○ / × )"),
                   ("㉡ 전주와 비교하여 키가 가장 많이 자란 때는 2주예요.", "( ○ / × )")])
        w.pic(graph_svg(v2, mark=(.5, '21일')), 105)
        w.ask("21일의 덩굴 강낭콩의 키는 약 몇 cm였을까요? 점을 찍고 써 보세요.")
        assert segname(ji, 'inc') == '3주'
        ans += (" ⑥ %s, %s, ㉠ ○ ㉡ ×(가장 많이 자란 때는 %s), 약 %s"
                % (U(jv[2], 'cm'), U(jv[4] - jv[3], 'cm'), segname(ji, 'inc'), U((v2['vals'][0] + v2['vals'][1]) / 2, 'cm')))
    return ans


def st_l4(w, D):
    lf, po, ji, pd, wa = S['leaf'], S['pot'], S['jiwoo'], S['pod'], S['water']
    w.lesson(4, "개념 구축하기(O)", "잎의 수와 화분의 무게 ― 꺾은선그래프로 나타내요",
             "기록한 표를 꺾은선그래프로 나타내려면 어떻게 해야 할까요?",
             "기록 담당 지우가 매주 월요일에 강낭콩 잎의 수를 세어 표로 정리했어요.")
    w.step("① 만져 보기 — 표를 꺾은선그래프로", "세로 눈금 15칸")
    w.table(gtable(lf))
    pick_scale(lf, [0], [1, 2, 5])
    if D:
        w.write("먼저 예상해요. 세로 눈금 한 칸의 크기는 어떻게 정하면 좋을까요? 내 규칙을 써 보세요.", 1)
    else:
        w.fill("먼저 예상해요. 가장 큰 수 (      )장까지 나타내고, 7과 11도 눈금에 맞도록 한 칸을 ( 1 / 2 / 5 )장으로 해요.")
    w.choices([("가로에 나타낼 것은?", "( 주 / 잎의 수 )"), ("세로에 나타낼 것은?", "( 주 / 잎의 수 )"),
               ("알맞은 제목은?", "( 좋아하는 콩 요리 / 주별 지우 강낭콩의 잎의 수 / 우리 반 학생 수 )")])
    w.text("축 이름과 제목을 쓰고, 세로 눈금에 수를 쓴 뒤 점을 찍어 선분으로 이어 보세요.")
    w.pic(graph_svg(lf, pts=None, ticks=False, axes=False, title=False, draw=True), 105)
    w.step("② 그려 보기 — 물결선이 있는 꺾은선그래프", "날짜별 하은이 강낭콩 화분의 무게(3일 저녁에 물을 주었어요)")
    if not D:
        w.text("먼저 쉬운 것부터: 주별 지우 강낭콩의 키를 세로 눈금 15칸에 나타내 보세요.")
        w.table(gtable(ji))
        pick_scale(ji, [0], [1, 2, 5])
        w.fill("가장 큰 수 (      ) cm를 15칸에 나타내려면 한 칸을 ( 1 / 2 / 5 ) cm로 해요.")
        w.pic(graph_svg(ji, pts=None, ticks=False, draw=True), 90)
        w.text("이제 화분의 무게예요. 물결선(0 g과 330 g 사이)과 눈금(한 칸 2 g)을 그려 두었어요. 점을 찍어 보세요.")
        w.table(gtable(po))
        w.pic(graph_svg(po, pts=None, draw=True), 100)
    else:
        w.table(gtable(po))
        scale_ask(w, D, po, [0, 300, 330, 350], [1, 2, 5])
        w.pic(graph_svg(po, pts=None, ticks=False, wave=False, draw=True), 100)
        w.why("물결선을 0 g과 350 g 사이에 넣으면 안 되는 까닭을 써 보세요.", 1)
    cards = [("가로에는 주를, 세로에는 잎의 수를 나타내요.", 0), ("자료의 값이 없는 0 g과 330 g 사이를 생략할 수 있어요.", 1),
             ("가장 큰 수 352 g까지 나타낼 수 있게 정해요.", 2), ("무엇을 기록한 그래프인지 알 수 있게 붙여요.", 3),
             ("변하는 양이 무엇인지 생각해서 세로에 나타내요.", 0), ("가장 작은 수보다 위까지 생략하면 안 돼요.", 1)]
    w.step("③ 말해 보기 — 그릴 때 생각할 점")
    w.text("알맞은 것의 기호를 쓰세요.  ㉠ 가로와 세로 ㉡ 물결선 ㉢ 세로 눈금 한 칸의 크기 ㉣ 제목")
    w.choices([(t, "(       )") for t, _ in cards])
    items = ["가장 큰 수를 나타낼 수 있도록 눈금 한 칸의 크기 정하기", "알맞은 제목 쓰기", "가로와 세로에 무엇을 나타낼지 정하기",
             "점을 찍고 점들을 선분으로 잇기", "물결선을 넣을 곳을 정하고 물결선 그리기"]
    w.step("④ 약속하기 — 나타내는 차례")
    w.choices(order_rows(items))
    w.step("⑤ 확인하기 — 꼬투리 수 그래프", "주별 우리 반 강낭콩 꼬투리 수 ― 세로 눈금 25칸")
    w.table(gtable(pd))
    lo, st = scale_ask(w, D, pd, [0, 10, 15], [1, 2, 5])
    w.pic(graph_svg(pd, pts=None, ticks=False, wave=False, draw=True), 105)
    ans = ("4차시  ① 내 규칙: 한 칸 %s(12장까지, 7·11도 맞음) / 가로: 주, 세로: 잎의 수 / 주별 지우 강낭콩의 잎의 수 / 점 %s칸 "
           % (U(lf['step'], '장'), kk(lf)))
    if D:
        ans += ("② 물결선 0 g과 %s 사이, 한 칸 %s, 330 g에서 %s칸 위, 왜: 가장 가벼운 340 g을 나타낼 수 없어요 "
                % (U(po['lo'], 'g'), U(po['step'], 'g'), kk(po)))
    else:
        ans += "② 지우: 15 cm, 한 칸 %s, 점 %s칸 / 화분: 330 g에서 %s칸 위 " % (U(ji['step'], 'cm'), kk(ji), kk(po))
    ans += ("③ %s ④ %s ⑤ %s물결선 0개와 %s 사이, 한 칸 %s, 10개에서 %s칸 위"
            % (' '.join('㉠㉡㉢㉣'[b] for _, b in cards), order_key(items, [2, 4, 0, 3, 1]),
               '' if D else '가장 작은 수 12개, 가장 큰 수 35개, ', U(lo, '개'), U(st, '개'), kk(pd)))
    if D:
        w.step("⑥ 도전하기", "요일별 지우가 화분에 준 물의 양 ― 세로 눈금 10칸")
        w.table(gtable(wa))
        lo2, st2 = scale_ask(w, D, wa, [0, 30, 40, 50], [1, 2, 5])
        w.pic(graph_svg(wa, pts=None, ticks=False, wave=False, draw=True), 90)
        ans += " ⑥ 물결선 0 mL와 %s 사이, 한 칸 %s, 40 mL에서 %s칸 위" % (U(lo2, 'mL'), U(st2, 'mL'), kk(wa))
    return ans


def st_l5(w, D):
    rm, se = S['room'], S['seo']
    w.lesson(5, "개념 구축하기(O)", "온도 모둠의 조사 ― 자료를 조사하여 나타내요",
             "강낭콩이 자라는 교실의 기온을 직접 조사하여 꺾은선그래프로 나타내려면 어떻게 해야 할까요?",
             "민준이네 온도 모둠은 ‘강낭콩이 있는 창가는 하루 동안 얼마나 따뜻할까?’가 궁금해졌어요.")
    w.step("① 만져 보기 — 무엇을 어떻게 조사할까", "조사 계획")
    w.choices([("무엇을 조사하면 좋을까요?", "( 시각별 창가의 기온 / 모둠별 좋아하는 계절 / 반별 강낭콩 화분 수 )"),
               ("조사한 기온은 어떤 그래프로?", "( 꺾은선그래프 / 그림그래프 )")])
    w.pick("어떻게 재면 좋을까요?", ["같은 온도계로 오전 9시부터 1시간마다 재요.", "생각날 때마다 아무 온도계로 재요.", "하루에 한 번만 재요."])
    w.step("② 그려 보기 — 온도계 읽어 표 만들기", "시각별 창가 온도계")
    w.pic(thermo_svg("시각별 창가 온도계(℃)", rm['names'], rm['vals']), 160)
    if not D:
        w.text("작은 눈금 한 칸은 1 ℃, 수가 쓰인 긴 눈금은 5 ℃마다 있어요. 빨간 기둥 끝을 읽어요.")
    w.table([['시각'] + rm['names'], ['기온(℃)'] + ['(    )'] * 6])
    w.step("③ 말해 보기 — 꺾은선그래프로 나타내기", "세로 눈금 10칸")
    lo, st = scale_ask(w, D, rm, [0, 10, 15, 20], [1, 2, 5])
    w.pic(graph_svg(rm, pts=None, ticks=False, wave=False, draw=True), 110)
    if D:
        w.why("물결선을 0 ℃와 20 ℃ 사이에 넣으면 왜 안 될까요?", lead='')
    else:
        w.fill("물결선을 0 ℃와 20 ℃ 사이에 넣으면 안 돼요. 가장 낮은 기온이 (      ) ℃라서 20 ℃까지 생략하면 그 기온을 나타낼 수 (        ).")
    items = ["표로 정리하기", "알 수 있는 내용 이야기하기", "알고 싶은 것과 조사 방법 정하기", "꺾은선그래프로 나타내기", "자료를 재어 모으기"]
    w.step("④ 약속하기 — 조사하여 나타내는 차례")
    w.choices(order_rows(items))
    w.step("⑤ 확인하기 — 우리 그래프 읽기", "완성한 그래프")
    w.pic(graph_svg(rm), 115)
    w.ask("창가의 기온이 가장 높았던 시각은?")
    w.ask("한 시간 전과 비교하여 기온이 가장 많이 오른 때는?")
    rv = rm['vals']
    first_down = next(nm(rm, i + 1) for i in range(5) if rv[i + 1] < rv[i])
    w.choices([("기온이 내려가기 시작한 때는?", "( 오전 11시 / 낮 12시 / 오후 1시 / 오후 2시 )")])
    ans = ("5차시  ① 시각별 창가의 기온, 꺾은선그래프, ① ② %s ③ %s물결선 0 ℃와 %s 사이, 한 칸 %s, 15 ℃에서 %s칸 위, "
           "%s ④ %s ⑤ %s, %s, %s"
           % (', '.join('%s %s' % (a, U(b, '℃')) for a, b in zip(rm['names'], rv)), '' if D else '가장 작은 수 17 ℃, 가장 큰 수 25 ℃, ',
              U(lo, '℃'), U(st, '℃'), kk(rm), '왜: 가장 낮은 기온이 17 ℃라서 20 ℃까지 생략하면 오전 9시와 10시의 기온을 나타낼 수 없어요' if D else '17, 없어요',
              order_key(items, [2, 4, 0, 3, 1]), peak(rm), segname(rm, 'inc'), first_down))
    if D:
        w.step("⑥ 도전하기", "주별 서진이 강낭콩의 키 ― 세로 눈금 10칸")
        w.table(gtable(se))
        lo2, st2 = scale_ask(w, D, se, None, [1, 2, 5])
        w.pic(graph_svg(se, pts=None, ticks=False, draw=True), 90)
        w.why("한 칸을 그 크기로 정한 까닭을 써 보세요.", 1)
        ans += " ⑥ 한 칸 %s, 점 %s칸, 왜: 10칸으로 가장 큰 수 18 cm까지 나타내야 해요" % (U(st2, 'cm'), kk(se))
    return ans


def st_l6(w, D):
    rm, hl, bo = S['room'], S['hall'], S['both']
    w.lesson(6, "탐구 정리하기(O)", "교실과 복도 ― 공학 도구와 두 줄 꺾은선그래프",
             "공학 도구로 그래프를 그리고, 두 곳의 기록을 한 그래프에 나타내면 무엇을 알 수 있을까요?",
             "다른 모둠은 같은 날 복도의 기온을 쟀어요. 복도 모둠의 기록 쪽지: 오전 9시 16 ℃ · 오전 10시 17 ℃ · 오전 11시 19 ℃ · 낮 12시 21 ℃ · 오후 1시 21 ℃ · 오후 2시 20 ℃")
    assert hl['vals'] == [16, 17, 19, 21, 21, 20]
    w.step("① 만져 보기 — 공학 도구로 그리기", "간격과 물결선 바꾸어 보기")
    t5 = V(hl, step=5, lo=0, cells=5, major=25)
    t1 = V(hl, step=1, lo=15, cells=10, major=5)
    w.text("공학 도구에 복도의 기온을 넣고 ㈎ 간격 5·물결선 없음, ㈏ 간격 1·물결선 있음으로 그렸어요.")
    w.pic(pair_svg([("㈎", graph_svg(t5)), ("㈏", graph_svg(t1))]), 175)
    w.choices([("변화가 더 뚜렷하게 보이는 그래프는?", "( ㈎ / ㈏ )"),
               ("두 그래프에서 기온의 값은?", "( 서로 달라요 / 똑같아요 )")])
    w.step("② 그려 보기 — 한 그래프에 두 줄", "교실의 기온(흐린 선) 위에 복도의 기온 찍기")
    w.table(gtable(hl))
    gh = V(bo, series=None, vals=hl['vals'])
    w.pic(graph_svg(gh, pts=None, bg={'name': '교실', 'vals': rm['vals'], 'me': '복도'}, legend=True, draw=True), 120)
    w.step("③ 말해 보기 — 두 줄 그래프 읽기", "시각별 교실과 복도의 기온")
    w.pic(graph_svg(bo), 125)
    a, b = rm['vals'], hl['vals']
    dif = [x - y for x, y in zip(a, b)]
    w.ask("낮 12시에 교실은 복도보다 몇 ℃ 높나요?")
    w.ask("두 곳의 기온 차이가 가장 큰 시각은?")
    w.ask("복도의 기온이 한 시간 전과 같았던 때는?")
    if D:
        w.why("창가 교실이 복도보다 더 따뜻한 까닭은 무엇일까요? 그래프를 보고 생각해 써요.", lead='')
    else:
        w.fill("그래프를 보면 교실 선이 늘 복도 선보다 (        )에 있어요. 창가에는 (          )이 들어오기 때문인 것 같아요.")
    w.step("④ 약속하기 — 여러 변화를 한 그래프에")
    if not D:
        w.wordbox(["두 가지 이상", "색이나 모양", "눈금 한 칸의 크기"])
    w.fill("한 꺾은선그래프에 (              )의 변화를 함께 나타낼 수 있어요. 이때 선의 (              )을 다르게 하고 무엇을 나타내는지 적어요. 공학 도구로 그릴 때도 (                    )와 물결선을 알맞게 정해야 변화가 잘 보여요.")
    w.step("⑤ 확인하기 — 모둠 발표 준비", "연구 일지")
    write3(w, D, [("사실", "(        )시에 교실은 (      ) ℃, 복도는 (      ) ℃로 (                    )", "그래프에서 알 수 있는 사실"),
                  ("의견", "(            )가 하루 내내 더 따뜻했으므로 화분은 (            )에 두면 좋겠어요.", "화분을 어디에 두면 좋을지와 근거")], row_h=5600)
    same = [nm(hl, i + 1) for i in range(5) if b[i + 1] == b[i]]
    mx = max(dif)
    ans = ("6차시  ① ㈏, 똑같아요 ② 복도 점 15 ℃에서 %s칸 위 ③ %s, %s, %s, %s ④ 두 가지 이상, 색이나 모양, 눈금 한 칸의 크기 "
           "⑤ (예: 오후 1시에 교실 25 ℃, 복도 21 ℃로 차이가 가장 커요 / 창가 교실이 더 따뜻하므로 화분은 교실 창가에)"
           % (kk(hl), U(dif[3], '℃'), ', '.join(nm(bo, i) for i in range(6) if dif[i] == mx), ', '.join(same),
              '(예: 교실 선이 늘 위에 있어요. 창가에 햇빛이 들어와요)' if D else '위, 햇빛'))
    if D:
        w.step("⑥ 도전하기", "‘시각별 교실과 복도의 기온’ 더 읽기")
        w.ask("교실의 기온이 한 시간 전보다 가장 많이 오른 때는?")
        w.ask("오후 2시에 교실은 복도보다 몇 ℃ 높나요?")
        w.choices([("복도의 기온은 오전 9시부터 오후 2시까지 계속 올라갔어요.", "( ○ / × )")])
        w.why("위 문장을 옳게 고쳐 써 보세요.", 1, lead='')
        ans += " ⑥ %s, %s, ×, (예: 복도는 낮 12시까지 오르다가 오후 1시에 그대로였고 오후 2시에 내려갔어요)" % (segname(bo, 'inc', 0), U(dif[5], '℃'))
    return ans


def st_l7(w, D):
    gd, gl, hv = S['garden'], S['gleaf'], S['harvest']
    w.lesson(7, "개념 구축하기(O)", "텃밭 강낭콩 ― 그래프로 앞날을 예상해요",
             "꺾은선그래프를 보고 앞으로의 변화를 어떻게 예상할 수 있을까요?",
             "학교 텃밭에 심은 강낭콩도 연구소가 매주 키를 재었어요.")
    w.step("① 만져 보기 — 텃밭 강낭콩의 키 읽기", "주별 텃밭 강낭콩의 키")
    w.pic(graph_svg(gd), 115)
    gv = gd['vals']
    w.ask("4주의 텃밭 강낭콩의 키는 몇 cm인가요?")
    w.choices([("시간이 지남에 따라 키는?", "( 계속 늘어났어요 / 계속 줄어들었어요 / 늘었다가 줄어들었어요 )")])
    w.ask("전주와 비교하여 가장 많이 자란 때는?")
    w.step("② 그려 보기 — 7주에는 어떻게 될까")
    w.choices([("7주의 키는?", "( 27 cm보다 더 클 것 같아요 / 27 cm보다 작아질 것 같아요 / 0 cm가 될 것 같아요 )")])
    w.pick("지우가 “7주에는 반드시 32 cm가 될 거야.”라고 했어요. 알맞은 생각은?",
           ["그래프로 예상할 수는 있지만 꼭 그렇게 된다고 말할 수는 없어요.", "그래프로 예상한 것은 언제나 꼭 맞아요."])
    if D:
        w.why("7주의 키를 그렇게 예상한 까닭을 써 보세요.", lead='')
    else:
        w.fill("왜냐하면 1주부터 6주까지 선이 계속 오른쪽 (      )로 올라가서 키가 계속 (          ) 때문이에요.")
    w.step("③ 말해 보기 — 두 그래프 견주기", "키와 잎의 수")
    w.pic(pair_svg([("키", graph_svg(gd)), ("잎의 수", graph_svg(gl))]), 175)
    w.choices([("두 그래프는 각각?", "( 모두 계속 늘어났어요 / 키는 늘고 잎은 줄었어요 / 둘 다 변하지 않았어요 )"),
               ("두 그래프의 관계는?", "( 키가 자람에 따라 잎의 수도 늘어나요 / 키가 자랄수록 잎의 수는 줄어들어요 )")])
    w.ask("6주의 잎의 수는 몇 장인가요?")
    if D:
        w.why("두 그래프를 함께 보면 무엇이 좋을까요?", lead='')
    else:
        w.fill("두 그래프를 함께 보면 강낭콩의 키가 자랄 때 (            )도 어떻게 변하는지 알 수 있어요.")
    w.step("④ 약속하기 — 그래프로 예상하기")
    if not D:
        w.wordbox(["늘어날", "꼭 맞는 것은 아니에요", "함께 어떻게 변하는지"])
    w.fill("선이 계속 오른쪽 위로 올라가면 앞으로도 (          ) 것이라고 예상할 수 있어요. 하지만 예상은 (                    ). 두 꺾은선그래프를 견주면 두 자료가 (                    ) 알 수 있어요.")
    w.step("⑤ 확인하기 — 생활 속 꺾은선그래프", "연구 일지")
    write3(w, D, [("찾기", "(            )에서 (            )을 나타낸 꺾은선그래프를 보았어요.", "어디에서 어떤 꺾은선그래프를 보았나요?"),
                  ("알 수 있는 것", "시간이 지남에 따라 (          )이 (          )하고 있어서 앞으로 (          )할 것 같아요.", "알 수 있는 내용이나 예상")], row_h=5600)
    ans = ("7차시  ① %s, 계속 늘어났어요, %s ② 27 cm보다 더 클 것 같아요, ①, %s ③ 모두 계속 늘어났어요, 키가 자람에 따라 잎의 수도 늘어나요, %s, %s "
           "④ 늘어날, 꼭 맞는 것은 아니에요, 함께 어떻게 변하는지 ⑤ (예: 날씨 뉴스에서 월별 평균 기온 그래프 / 가을부터 내려가 12월에는 더 추워질 것 같아요)"
           % (U(gv[3], 'cm'), segname(gd, 'inc'), '왜: (예: 1주부터 6주까지 계속 자랐기 때문이에요)' if D else '위, 자랐기',
              U(gl['vals'][5], '장'), '왜: (예: 키가 자랄 때 잎의 수도 어떻게 변하는지 알 수 있어요)' if D else '잎의 수'))
    if D:
        xv = hv['vals']
        w.step("⑥ 도전하기", "연도별 우리 학교 텃밭 강낭콩 수확량(이야기 속 자료)")
        w.pic(graph_svg(hv), 110)
        w.ask("전년과 비교하여 수확량이 줄어든 때는?")
        w.ask("전년과 비교하여 수확량이 가장 많이 늘어난 때는?")
        w.why("2025년의 수확량을 예상하고 까닭을 써 보세요.", 1, lead='')
        ans += (" ⑥ %s, %s, (예: 2022년부터 계속 늘어났으니 늘어날 것 같아요)"
                % (', '.join(nm(hv, i + 1) for i in range(4) if xv[i + 1] < xv[i]), segname(hv, 'inc')))
    return ans


def st_l8(w, D):
    pr, bn = S['price'], S['bean']
    w.lesson(8, "탐구 정리하기(O)", "생각을 더하다 ― 콩나물과 두부의 가격", "가격 그래프를 보고 물건값의 변화를 어떻게 읽고 예상할 수 있을까요?",
             "강낭콩처럼 콩으로 만드는 먹을거리가 궁금해진 연구소는 급식실 영양 선생님께 어느 가게의 콩나물과 두부 가격 기록을 받았어요(이야기 속 자료).")
    kv, dv = vals(pr, 0), vals(pr, 1)
    w.step("① 만져 보기 — 두 물건의 가격 그래프", "점 옆의 수가 가격이에요")
    w.pic(graph_svg(pr), 140)
    w.choices([("가로와 세로는?", "( 가로: 연도, 세로: 가격 / 가로: 가격, 세로: 연도 )"),
               ("물결선이 나타내는 것은?", "( 0원과 1000원 사이를 생략했어요 / 가격이 0원이 되었어요 )"),
               ("콩나물과 두부의 가격은?", "( 둘 다 계속 올랐어요 / 콩나물은 오르고 두부는 내렸어요 / 둘 다 계속 내렸어요 )")])
    w.ask("세로 눈금 한 칸은 몇 원을 나타내나요?" + ("  (도움: 1000과 1500 사이가 5칸)" if not D else ""))
    w.step("② 그려 보기 — 가장 많이 오른 때")
    if not D:
        w.fill(["두부: 1720 − 1680 = (      ),  1890 − 1720 = (      ),  2050 − 1890 = (      )",
                "콩나물: 1320 − 1240 = (      ),  1410 − 1320 = (      ),  1530 − 1410 = (      )"])
    w.ask("두부의 가격이 전년보다 가장 많이 오른 때는?")
    w.ask("콩나물의 가격이 전년보다 가장 많이 오른 때는?")
    w.ask("2023년에 두부는 콩나물보다 몇 원 더 비싼가요?")
    w.step("③ 말해 보기 — 2024년의 가격 예상")
    w.choices([("2024년에 두 물건의 가격은?", "( 둘 다 오를 것 같아요 / 둘 다 내릴 것 같아요 )"),
               ("그 예상에 대한 알맞은 생각은?", "( 실제로는 달라질 수도 있어요 / 반드시 그렇게 돼요 )")])
    if D:
        w.why("2024년의 가격을 그렇게 예상한 까닭을 써 보세요.", lead='')
    else:
        w.fill("왜냐하면 2020년부터 2023년까지 콩나물과 두부의 가격이 해마다 계속 (          ) 때문이에요.")
    w.step("④ 약속하기 — 꼭 같이 변할까?", "같은 가게의 연도별 콩(1 kg)의 가격")
    w.pic(graph_svg(bn), 110)
    b = bn['vals']
    w.choices([("2021년에 콩의 가격은 전년보다?", "( 올랐어요 / 내렸어요 / 그대로예요 )"),
               ("2021년에 두부의 가격은 전년보다?", "( 올랐어요 / 내렸어요 / 그대로예요 )"),
               ("재료인 콩의 가격이 내려가면 두부의 가격도 반드시 내려가요.", "( ○ / × )")])
    w.step("⑤ 확인하기 — 장보기 쪽지 쓰기")
    write3(w, D, [("사실", "(        )의 가격은 2020년 (        )원에서 2023년 (        )원으로 올랐고, (        )년에 가장 많이 올랐어요.", "그래프에서 알 수 있는 사실"),
                  ("편리한 점", "가격 그래프를 보면 (                    )을 알 수 있어서 (                    )할 때 도움이 돼요.", "생활에서 편리한 점")], row_h=5600)
    ans = ("8차시  ① 가로: 연도, 세로: 가격 / 0원과 1000원 사이를 생략했어요 / 둘 다 계속 올랐어요 / %s ② %s%s, %s, %s "
           "③ 둘 다 오를 것 같아요, 실제로는 달라질 수도 있어요, %s ④ %s, %s, × ⑤ (예: 두부 1680원 → 2050원, 2022년에 가장 많이 / 물건값의 변화를 알아 장 볼 돈을 계획할 때)"
           % (U(pr['step'], '원'), '' if D else '두부 40·170·160, 콩나물 80·90·120 / ', segname(pr, 'inc', 1), segname(pr, 'inc', 0),
              U(dv[3] - kv[3], '원'), '왜: (예: 해마다 계속 올랐기 때문이에요)' if D else '올랐기',
              '내렸어요' if b[1] < b[0] else '올랐어요', '올랐어요' if dv[1] > dv[0] else '내렸어요'))
    if D:
        ids, d = seg(bn, 'inc')
        w.step("⑥ 도전하기", "‘연도별 콩(1 kg)의 가격’ 더 읽기")
        w.ask("2023년의 콩 가격은 몇 원인가요?")
        w.ask("전년과 비교하여 콩 가격이 가장 많이 오른 때는?")
        w.ask("2023년의 콩 가격은 2020년보다 몇 원 올랐나요?")
        w.why("“콩 가격이 내려가면 두부 가격도 반드시 내려간다.”가 틀린 까닭을 써 보세요.", 1)
        ans += (" ⑥ %s, %s(%s 오름), %s, 왜: 2021년에 콩 가격은 내렸지만 두부 가격은 올랐어요"
                % (U(b[3], '원'), nm(bn, ids[0]), U(d[ids[0] - 1], '원'), U(b[3] - b[0], '원')))
    return ans


def st_l9(w, D):
    mo, mj = S['mood'], S['moodJ']
    w.lesson(9, "발표하기(P)", "놀이를 더하다 ― 관찰 기간 나의 기분 그래프", "강낭콩을 기르는 동안 나의 기분은 어떻게 변했을까요?",
             "연구소장 하은이가 강낭콩을 기른 8주 동안의 기분을 0점부터 100점까지 점수로 나타냈어요.")
    w.step("① 만져 보기 — 하은이의 기분 그래프", "주별 하은이의 기분 점수표")
    w.table(mood_rows(mo, S_MOOD, head='주', score='기분 점수(점)', unit='주'), col_mm=[22, 118, 40])
    w.pic(graph_svg(mo), 120)
    w.ask("전주와 비교하여 기분 점수의 변화가 가장 큰 때는?" + ("  (도움: 선분이 가장 많이 기울어진 곳)" if not D else ""))
    w.ask("전주와 비교하여 기분 점수의 변화가 가장 작은 때는?")
    w.ask("8주의 기분 점수는 몇 점인가요?")
    w.step("② 그려 보기 — 나의 기분 그래프", "강낭콩을 기른 8주 동안")
    w.table(mood_rows(mo, S_MOOD, head='주', score='기분 점수(점)', unit='주', blank=True), col_mm=[22, 118, 40])
    w.pic(graph_svg(V(mo, title='주별 나의 기분 그래프'), pts=None, draw=True), 115)
    w.ask("내 그래프에서 기분 점수의 변화가 가장 큰 때는?")
    w.ask("내 그래프에서 기분 점수의 변화가 가장 작은 때는?")
    w.step("③ 말해 보기 — 친구 그래프 함께 그리기", "하은이 그래프(흐린 선) 위에 지우의 점수 찍기")
    gj = V(mo, title='주별 하은이와 지우의 기분 그래프', vals=mj)
    w.table(gtable(V(gj, yAxis='지우의 기분 점수')))
    w.pic(graph_svg(gj, pts=None, bg={'name': '하은', 'vals': mo['vals'], 'me': '지우'}, legend=True, draw=True), 120)
    w.step("④ 약속하기 — 두 그래프 견주기", "하은이와 지우의 기분 그래프")
    both = V(mo, title='주별 하은이와 지우의 기분 그래프', series=[{'name': '하은', 'vals': mo['vals']}, {'name': '지우', 'vals': mj}])
    w.pic(graph_svg(both), 120)
    w.ask("두 사람 모두 기분 점수가 전주보다 내려간 때를 모두 써 보세요.")
    w.ask("지우의 기분 점수가 전주와 같았던 때를 모두 써 보세요.")
    w.step("⑤ 확인하기 — 기분 그래프 발표")
    write3(w, D, [("발표 1", "(      )주에 (                    )해서 기분 점수가 (      )점에서 (      )점으로 변했어요.", "기분이 가장 크게 변한 때와 그 까닭"),
                  ("발표 2", "나와 친구 모두 (      )주에 (            )했지만, (      )주에는 (            )했어요.", "친구의 그래프와 같은 점·다른 점")], row_h=5600)
    hv = mo['vals']
    ids, d = seg(mo, 'abs')
    bd = [nm(mo, i + 1) for i in range(7) if hv[i + 1] < hv[i] and mj[i + 1] < mj[i]]
    sm = [nm(mo, i + 1) for i in range(7) if mj[i + 1] == mj[i]]
    ans = ("9차시  ① %s(%d점 변함), %s, %s ② (내 그래프) ③ 지우 점 %s칸 ④ %s, %s ⑤ (예: 4주에 잎이 시들어서 70점에서 30점으로 / 4주에 둘 다 내려갔지만 3주에는 하은이는 내려가고 지우는 올라갔어요)"
           % (segname(mo, 'abs'), abs(d[ids[0] - 1]), segname(mo, 'min'), U(hv[7], '점'), '·'.join(str(x // 10) for x in mj),
              ', '.join(bd), ', '.join(sm)))
    if D:
        w.step("⑥ 도전하기", "하은이의 기분 그래프 더 읽기")
        w.ask("6주에는 5주보다 기분 점수가 몇 점 올랐나요?")
        w.choices([("하은이의 기분 점수는 1주부터 8주까지 계속 올라갔어요.", "( ○ / × )")])
        w.ask("하은이의 기분 점수가 가장 낮았던 때는?")
        w.why("6주의 점과 5주의 점은 3칸 차이 나요. 점수 차이를 어떻게 구하는지 써 보세요.", 1, lead='')
        ans += " ⑥ %s, ×, %s, (예: 한 칸이 10점이므로 3칸은 30점이에요)" % (U(hv[5] - hv[4], '점'), peak(mo, 'min'))
    return ans


def st_l10(w, D):
    sl, jn, fw, gd = S['seoLeaf'], S['join'], S['flower'], S['garden']
    w.lesson(10, "발표하기(P)", "강낭콩 연구 발표회 ― 공부한 내용 확인", "꺾은선그래프를 배우기 전과 후, 내 생각은 어떻게 달라졌나요?",
             "연구 발표회 날이에요. 서진이는 ‘주별 서진이 강낭콩의 잎의 수’ 그래프를 보여 줄 거예요. 꼬투리를 딴 뒤 잎이 누렇게 지기 시작했대요.")
    w.step("① 만져 보기 — 서진이의 잎 그래프")
    w.pic(graph_svg(sl), 105)
    lv = sl['vals']
    w.ask("세로 눈금 한 칸은 몇 장을 나타내나요?" + ("  (도움: 0과 10 사이가 5칸)" if not D else ""))
    ox3 = [("잎의 수가 가장 많은 때는 8주예요.", peak(sl) == '8주'), ("전주와 비교하여 잎의 수가 가장 많이 줄어든 때는 10주예요.", segname(sl, 'dec') == '10주'),
           ("잎의 수는 6주부터 계속 줄어들었어요.", lv[1] < lv[0])]
    w.choices([(t, "( ○ / × )") for t, _ in ox3])
    w.step("② 그려 보기 — 빠진 점 찍기", "연도별 강낭콩 기르기에 참여한 학생 수")
    w.table(gtable(jn))
    jv = jn['vals']
    w.text("하은이가 빠뜨린 2022년의 점을 찍어 꺾은선그래프를 완성해 보세요." + (" (물결선 위 첫 눈금은 30명, 한 칸은 1명)" if not D else ""))
    w.pic(graph_svg(jn, pts=[v if i != 2 else None for i, v in enumerate(jv)], draw=True), 110)
    w.step("③ 말해 보기 — 앞으로 어떻게 될까")
    w.ask("2023년에는 2022년보다 몇 명 줄었나요?")
    w.choices([("2025년에 참여할 학생 수는?", "( 줄어들 것 같아요 / 늘어날 것 같아요 )")])
    if D:
        w.why("참여하는 학생 수를 다시 늘리려면 어떻게 하면 좋을까요? 그래프를 근거로 써 보세요.", lead='')
    else:
        w.fill("그래프를 보면 (        )년부터 계속 줄었어요. 그래서 (                              )하면 좋겠어요.")
    w.step("④ 약속하기 — 징검돌 건너기", "월별 학교 화단에 쓴 물의 양")
    w.pic(graph_svg(fw), 110)
    fv = fw['vals']
    stones = [("월별 학교 화단에 쓴 물의 양을 조사하여 나타낸 꺾은선그래프예요.", True), ("세로 눈금 한 칸은 10 L를 나타내요.", fw['step'] == 10),
              ("10월에 쓴 물의 양은 150 L예요.", fv[4] == 150), ("시간이 지남에 따라 쓴 물의 양은 계속 줄어들었어요.", False),
              ("전월과 비교하여 쓴 물의 양이 가장 많이 줄어든 때는 9월이에요.", segname(fw, 'dec') == '9월')]
    w.text("옳은 문장에 ○, 옳지 않은 문장에 ×를 하세요. ○인 징검돌만 밟아야 강낭콩 밭에 도착해요.")
    w.choices([('돌 %d. %s' % (i + 1, t), "( ○ / × )") for i, (t, _) in enumerate(stones)])
    assert [b for _, b in stones] == [True, False, False, False, True]
    w.step("⑤ 확인하기 — 예전 생각, 지금 생각", "1차시에 궁금했던 것을 떠올리며")
    write3(w, D, [("예전 생각", "예전에는 (                    )라고 생각했어요.", "꺾은선그래프를 배우기 전의 생각"),
                  ("지금 생각", "지금은 (                    )라고 생각해요.", "배운 뒤에 바뀐 생각"),
                  ("왜 바뀌었나", "(                    )을 해 보고 바뀌었어요.", "어떤 활동 때문에 바뀌었나요?")])
    ox = lambda b: '○' if b else '×'
    ans = ("10차시  ① %s, %s ② 2022년 %s(30에서 %s칸 위) ③ %s, 줄어들 것 같아요, %s ④ %s → 돌 1·5 "
           "⑤ (생각 쓰기 — 예: 예전엔 막대그래프로만 / 지금은 꺾은선그래프가 변화를 한눈에 / 7일의 키를 어림해 보고)"
           % (U(sl['step'], '장'), ' '.join(ox(b) for _, b in ox3), U(jv[2], '명'), fmt(cells_of(jn)[2]), U(jv[2] - jv[3], '명'),
              '(예: 2022년부터 계속 줄었어요. 연구소의 그래프를 전시해 재미를 알리면 좋겠어요)' if D else '2022, (예: 강낭콩 기르기의 재미를 알리기)',
              ' '.join(ox(b) for _, b in stones)))
    if D:
        w.step("⑥ 도전하기", "마인드맵 ― ‘꺾은선그래프’를 정리해요")
        w.labeled([("떠오르는 말", "(점, 선분, 물결선 …)\n"), ("묶어 보기", "(읽을 때 / 그릴 때)\n"),
                   ("이어지는 말", "(물결선과 눈금 한 칸의 크기 …)\n"), ("덧붙이는 말", "(예를 들면 …)\n")], row_h=5600)
        w.text("★ 선택 문제 — 주별 텃밭 강낭콩의 키 그래프로 풀어 보세요.")
        w.pic(graph_svg(gd), 100)
        g = gd['vals']
        w.ask("5주와 6주 사이에 일정하게 자랐다면, 5주 반쯤의 키는 약 몇 cm일까요?")
        w.ask("1주부터 6주까지 텃밭 강낭콩은 모두 몇 cm 자랐나요?")
        ans += (" ⑥ (마인드맵 — 예: 읽을 때: 가로·세로·눈금 한 칸·기울어진 정도 / 그릴 때: 축·물결선·눈금·점과 선분·제목) ★ 약 %s, %s"
                % (U((g[4] + g[5]) / 2, 'cm'), U(g[5] - g[0], 'cm')))
    return ans


# ================================================================ 만들기
TB_LESSONS = [tb_l1, tb_l2, tb_l3, tb_l4, tb_l56, tb_l7, tb_l8, tb_l9, tb_l10]
ST_LESSONS = [st_l1, st_l2, st_l3, st_l4, st_l5, st_l6, st_l7, st_l8, st_l9, st_l10]


def build(lessons, unit_label, ver, level, out_dir):
    s = Sheet(unit_label=unit_label, level=level, grade_label='4학년')
    w = W(s)
    D = level == '도전형'
    keys = [fn(w, D) for fn in lessons]
    w.flush()
    s.answers("【교사용】 5. 꺾은선그래프(%s) 활동지 정답 (%s)" % (ver, level), keys,
              note="※ 이 활동지는 앱 u5-linegraph.html과 차시 번호가 같습니다.")
    os.makedirs(out_dir, exist_ok=True)
    path = os.path.join(out_dir, NAME % level)
    s.save(path)
    probs = check(path)
    print(('OK  ' if not probs else 'ERR ') + os.path.relpath(path, ROOT), probs or '', '쪽 나눔 %d' % sum('pageBreak="1"' in b for b in s.body))
    if '-v' in sys.argv:
        for k in keys:
            print('   ', k)
    return probs


def main():
    bad = []
    for level in ('기본형', '도전형'):
        bad += build(TB_LESSONS, "4-2 수학 5. 꺾은선그래프(교과서 차시)", "교과서 차시", level, OUT_TB)
        bad += build(ST_LESSONS, "4-2 수학 5. 꺾은선그래프(이야기 버전)", "이야기 버전", level, OUT_ST)
    if bad:
        sys.exit(1)


if __name__ == '__main__':
    main()
