# -*- coding: utf-8 -*-
"""4-1 수학 6. 규칙과 관계 활동지(HWPX) 4개 만들기

    python3 gen_u6-pattern.py

교과서 차시 버전(앱 _build/units/u6-pattern.tb.js '수리수리 수학 나라', 11개 차시: 1~8·9~10·11·12)과
이야기 버전(앱 u6-pattern.st.js '우리 반 나눔 저금통 프로젝트', 11개 차시: 1~8·9~10·11·12)의
차시 번호·제목·S.O.O.P.·탐구 질문·이야기·수를 그대로 따릅니다.
수의 배열 규칙·계산식·도형의 수·저울·동전 답은 모두 아래 자료에서 계산해 확인합니다.
"""
import hashlib
import math
import os
import random
import re
import sys
import tempfile
from fractions import Fraction
from xml.sax.saxutils import escape

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from hwpxgen import Sheet, svg_to_png, check  # noqa: E402

ROOT = os.path.normpath(os.path.join(HERE, '..', '..'))          # grade4/math
OUT_TB = os.path.join(ROOT, 'sem1', 'sheets')
OUT_ST = os.path.join(ROOT, 'sem1-soop', 'sheets')
NAME = '6단원_규칙과관계_활동지_%s.hwpx'
TMP = tempfile.mkdtemp(prefix='u6pat_')
FONT = "'Noto Sans KR','WenQuanYi Zen Hei',sans-serif"
INK, SOFT = '#1D2A2A', '#3B4A47'
LAY = ["#F6C85F", "#7FB8E6", "#9ED39A", "#F2A0A0", "#C5A5E8", "#F7B27A", "#8FD3D0"]
ORD = ["", "첫째", "둘째", "셋째", "넷째", "다섯째", "여섯째", "일곱째", "여덟째", "아홉째", "열째", "열한째", "열두째"]
CIRC = "㉠㉡㉢㉣"

# ================================================================ 수의 배열 규칙(앱 r6RulesOf와 같음)
DIRV = {"→": (0, 1), "←": (0, -1), "↓": (1, 0), "↑": (-1, 0), "↗": (-1, 1), "↙": (1, -1), "↘": (1, 1), "↖": (-1, -1)}
DIRP = {"→": "가로(→) 방향으로", "↓": "세로(↓) 방향으로", "↑": "세로(↑) 방향으로"}


def dirp(d):
    return DIRP.get(d, '%s 방향으로' % d)


def rules_of(v):
    out = []
    d = v[1] - v[0]
    if d and all(v[i] - v[i - 1] == d for i in range(1, len(v))):
        out.append(('up', d) if d > 0 else ('down', -d))
    if v[0] and v[1] % v[0] == 0 and v[1] // v[0] >= 2:
        k = v[1] // v[0]
        if all(v[i] == v[i - 1] * k for i in range(1, len(v))):
            out.append(('times', k))
    if v[1] and v[0] % v[1] == 0 and v[0] // v[1] >= 2:
        k = v[0] // v[1]
        if all(v[i] * k == v[i - 1] for i in range(1, len(v))):
            out.append(('part', k))
    return out


KIND = {'up': '%d씩 커져요', 'down': '%d씩 작아져요', 'times': '%d배가 돼요', 'part': '1/%d만큼이 돼요'}


def is_blank(x):
    return isinstance(x, tuple)


def run_from(rows, r, c, d, fill=False):
    dr, dc = DIRV[d]
    out = []
    while 0 <= r < len(rows) and 0 <= c < len(rows[r]):
        x = rows[r][c]
        if is_blank(x):
            if not fill:
                break
            x = x[1]
        out.append(x)
        r += dr
        c += dc
    return out


def rule(rows, r, c, d):
    """(문장, 종류, k) — 빈칸 앞까지 이어진 수로 규칙을 찾음."""
    seq = run_from(rows, r, c, d)
    assert len(seq) >= 3, (seq, d)
    rs = rules_of(seq)
    assert rs, seq
    kind, k = rs[0]
    return '%d부터 %s %s' % (seq[0], dirp(d), KIND[kind] % k), kind, k


def full_ok(rows):
    """빈칸에 답을 넣은 배열이 가로·세로 모두 같은 규칙인지(답 점검)."""
    R = len(rows)
    for r in range(R):
        v = run_from(rows, r, 0, '→', fill=True)
        if len(v) >= 3:
            assert rules_of(v), ('가로', v)
    C = max(len(x) for x in rows)
    if all(len(x) == C for x in rows) and R >= 3:
        for c in range(C):
            v = run_from(rows, 0, c, '↓', fill=True)
            assert rules_of(v), ('세로', v)


def grid_table(rows):
    return [[('%s' % x[0]) if is_blank(x) else str(x) for x in row] for row in rows]


def blanks_of(rows):
    return [x for row in rows for x in row if is_blank(x)]


# ================================================================ 계산식
def ev(expr):
    """식의 양쪽 값을 분수로(곱셈·나눗셈 먼저)."""
    e = expr.replace('×', '*').replace('÷', '/').replace('−', '-').replace(' ', '')
    assert re.fullmatch(r'[0-9+\-*/=]+', e), expr
    e = re.sub(r'\d+', lambda m: 'Fraction(%s)' % int(m.group()), e)
    lhs, rhs = e.split('=')
    return eval(lhs), eval(rhs)


def eq_ok(expr):
    a, b = ev(expr)
    return a == b


def fill_box(expr, vals):
    out, i = '', 0
    for ch in expr:
        if ch == '□':
            out += str(vals[i])
            i += 1
        else:
            out += ch
    assert i == len(vals), (expr, vals)
    return out


def show(expr, blank='(          )'):
    t = expr.replace('-', '−')
    for op in '+−×÷=':
        t = t.replace(op, ' %s ' % op)
    return t.replace('□', blank)


def pretty(expr):
    return show(expr)


def X(lab, e, a=None):
    """계산식 줄: (차례, 식, □ 답). 답을 넣은 식이 맞는지 바로 확인."""
    full = fill_box(e, a) if a else e
    assert eq_ok(full), full
    return (lab, e, a, full)


# ================================================================ 그림(SVG)
def T(x, y, s, fs=18, anchor='middle', fill=INK, weight='normal'):
    return ('<text x="%.1f" y="%.1f" font-size="%d" text-anchor="%s" dominant-baseline="central" fill="%s" '
            'font-weight="%s" font-family="%s">%s</text>' % (x, y, fs, anchor, fill, weight, FONT, escape(str(s))))


def wrap(body, W, H):
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d"><rect width="%d" height="%d" fill="#fff"/>%s</svg>'
            % (W, H, W, H, body), W, H)


GEN = {
    'rect2': lambda n: [(r, c) for r in range(2) for c in range(n)],
    'rect3': lambda n: [(r, c) for r in range(3) for c in range(n)],
    'tri': lambda n: [(r, c) for r in range(n) for c in range(r + 1)],
    'ell': lambda n: [(r, 0) for r in range(n)] + [(n - 1, c) for c in range(1, n)],
    'gamma': lambda n: [(0, c) for c in range(n)] + [(r, 0) for r in range(1, n)],
    'stair3': lambda n: [(0, 0), (0, 1)] + [(k, c) for k in range(1, n) for c in range(k - 1, k + 2)],
    'stair2': lambda n: [(0, 0), (0, 1), (0, 2)] + [(k, c) for k in range(1, n) for c in (k + 1, k + 2)],
    'rectM': lambda n: [(r, c) for r in range(n) for c in range(n + 1)],
    'rectP': lambda n: [(r, c) for r in range(n) for c in range(n + 2)],
    'plus': lambda n: [(n - 1, n - 1)] + [p for k in range(1, n) for p in
                                          ((n - 1 - k, n - 1), (n - 1 + k, n - 1), (n - 1, n - 1 - k), (n - 1, n - 1 + k))],
    'coinOdd': lambda n: [(r, c) for r in range(n) for c in range(2 * r + 1)],
}
LAYER = {'rectM': lambda r, c: max(c, r + 1), 'rectP': lambda r, c: max(r + 1, c - 1, 1),
         'tri': lambda r, c: r + 1, 'stair3': lambda r, c: r + 1, 'stair2': lambda r, c: r + 1, 'coinOdd': lambda r, c: r + 1}


def cnt(gen, n):
    return len(GEN[gen](n))


def cell(kind, x, y, u, col, lab=''):
    if kind == 'stone':
        return '<circle cx="%.1f" cy="%.1f" r="%.1f" fill="#222" stroke="#000" stroke-width="1"/>' % (x + u / 2, y + u / 2, u * .44)
    if kind == 'coin':
        s = '<circle cx="%.1f" cy="%.1f" r="%.1f" fill="#E2E2E2" stroke="#7E7E7E" stroke-width="1.6"/>' % (x + u / 2, y + u / 2, u * .45)
        return s + (T(x + u / 2, y + u / 2 + 1, lab, int(u * .34), fill='#555') if lab else '')
    if kind == 'mod':
        return ('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" rx="3" fill="%s" stroke="#5B4A38" stroke-width="1.6"/>'
                '<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" rx="2" fill="#fff" opacity=".35"/>'
                % (x + 1, y + 1, u - 2, u - 2, col, x + u * .22, y + u * .22, u * .56, u * .56))
    return ('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="%s" stroke="#6B5A48" stroke-width="1.6"/>'
            % (x, y, u, u, col))


def shape_svg(gen, ns, kind='sq', layers=False, anchor='bottom', mystery=None, lab='', u=24, names=None):
    figs = [(names[i] if names else ORD[n], n) for i, n in enumerate(ns)]
    if mystery:
        figs.append(('다음 모양', mystery))
    boxes = []
    for name, n in figs:
        cs = GEN[gen](n)
        mr, mc = max(r for r, _ in cs) + 1, max(c for _, c in cs) + 1
        boxes.append((name, n, cs, mr * u, mc * u))
    gap, top = 40, 12
    maxh = max(b[3] for b in boxes)
    W = gap + sum(b[4] + gap for b in boxes)
    H = top + maxh + 46
    out, x = [], gap
    for name, n, cs, h, wd in boxes:
        y0 = top if anchor == 'top' else top + maxh - h
        for r, c in cs:
            col = LAY[(LAYER[gen](r, c) - 1) % len(LAY)] if layers else ('#F6C85F' if kind == 'sq' else '#9DC8EC')
            out.append(cell(kind, x + c * u, y0 + r * u, u, col, lab))
        out.append(T(x + wd / 2, top + maxh + 26, name, 18, weight='bold' if name == '다음 모양' else 'normal'))
        x += wd + gap
    return wrap(''.join(out), W, H)


def paper_svg(rows, cols, u=24, title=None):
    """모눈 종이(다음 모양 그리기)."""
    top = 34 if title else 6
    W, H = cols * u + 12, rows * u + top + 6
    out = [T(W / 2, 16, title, 17)] if title else []
    for r in range(rows + 1):
        out.append('<line x1="6" y1="%.1f" x2="%.1f" y2="%.1f" stroke="#B9C6C1" stroke-width="1"/>' % (top + r * u, 6 + cols * u, top + r * u))
    for c in range(cols + 1):
        out.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%.1f" stroke="#B9C6C1" stroke-width="1"/>' % (6 + c * u, top, 6 + c * u, top + rows * u))
    return wrap(''.join(out), W, H)


def pair_svg(a, b, gap=40):
    sa, wa, ha = a
    sb, wb, hb = b
    W, H = wa + gap + wb, max(ha, hb)
    strip = lambda s: s.split('fill="#fff"/>', 1)[1].rsplit('</svg>', 1)[0]
    return wrap('<g transform="translate(0,%.1f)">%s</g><g transform="translate(%.1f,%.1f)">%s</g>'
                % (H - ha, strip(sa), wa + gap, H - hb, strip(sb)), W, H)


def spiral_svg(vals):
    """앱 r6SpiralModel과 같은 자리: 가운데에서 → ↓ ← ↑ 차례로 돌며 바깥으로."""
    S, V = 64, [(1, 0), (0, 1), (-1, 0), (0, -1)]
    pts = []
    for i, v in enumerate(vals):
        k, j = divmod(i, 4)
        rad = S * (0.95 + k + j / 4)
        pts.append([V[j][0] * rad, V[j][1] * rad, rad, v])
    pad = 40
    mx, my = min(p[0] for p in pts) - pad, min(p[1] for p in pts) - pad
    for p in pts:
        p[0] -= mx
        p[1] -= my
    W, H = int(max(p[0] for p in pts) + pad), int(max(p[1] for p in pts) + pad)
    d = 'M%.1f %.1f' % (pts[0][0], pts[0][1])
    for i in range(1, len(pts)):
        r = (pts[i - 1][2] + pts[i][2]) / 2
        d += ' A%.1f %.1f 0 0 1 %.1f %.1f' % (r, r, pts[i][0], pts[i][1])
    out = ['<path d="%s" fill="none" stroke="#CFDCD7" stroke-width="7" stroke-linecap="round"/>' % d]
    for x, y, _, v in pts:
        b = is_blank(v)
        out.append('<circle cx="%.1f" cy="%.1f" r="26" fill="%s" stroke="%s" stroke-width="1.8"%s/>'
                   % (x, y, '#FFF8E8' if b else '#fff', '#E47A38' if b else '#7E8E88', ' stroke-dasharray="6 4"' if b else ''))
        out.append(T(x, y + 1, v[0] if b else v, 21, fill='#C0601F' if b else INK))
    return wrap(''.join(out), W, H)


def balance_svg(L, R, what='piece'):
    W, H = 600, 250
    out = ['<polygon points="300,120 270,232 330,232" fill="#C9B79C" stroke="#6B5A48" stroke-width="2"/>',
           '<rect x="200" y="232" width="200" height="10" rx="3" fill="#A88F6E"/>',
           '<line x1="80" y1="120" x2="520" y2="120" stroke="#6B5A48" stroke-width="7" stroke-linecap="round"/>',
           '<circle cx="300" cy="120" r="8" fill="#6B5A48"/>']
    for cx, n, name in ((150, L, '가'), (450, R, '나')):
        out.append('<line x1="%d" y1="120" x2="%d" y2="190" stroke="#8C7A62" stroke-width="2"/>' % (cx - 95, cx - 10))
        out.append('<line x1="%d" y1="120" x2="%d" y2="190" stroke="#8C7A62" stroke-width="2"/>' % (cx + 95, cx + 10))
        out.append('<path d="M%d 190 Q%d 214 %d 190 Z" fill="#E8DCC8" stroke="#6B5A48" stroke-width="2"/>' % (cx - 105, cx, cx + 105))
        per = 7
        for i in range(n):
            rr, cc = divmod(i, per)
            x = cx - per * 13 + cc * 26 + 2
            y = 166 - rr * 26
            if what == 'book':
                out.append('<rect x="%d" y="%d" width="22" height="22" rx="2" fill="#9DC8EC" stroke="#2B5F8F" stroke-width="1.5"/>'
                           '<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="#2B5F8F" stroke-width="1.5"/>' % (x, y, x + 5, y, x + 5, y + 22))
            else:
                out.append('<polygon points="%d,%d %d,%d %d,%d" fill="#F6C85F" stroke="#8C6A1F" stroke-width="1.5"/>'
                           % (x + 11, y, x + 22, y + 22, x, y + 22))
        out.append(T(cx, 96, name, 26, weight='bold'))
    return wrap(''.join(out), W, H)


def plates_svg(items, names=('빨간색', '파란색'), cols=('#E05A4F', '#3E7FD0')):
    """items: [(빨강, 파랑)] — (None, None)이면 색칠할 빈 접시."""
    pw, ph, gap = 250, 150, 24
    W = gap + len(items) * (pw + gap)
    H = ph + 50
    out = []
    for i, (a, b) in enumerate(items):
        x0 = gap + i * (pw + gap)
        out.append('<ellipse cx="%.1f" cy="%.1f" rx="%.1f" ry="%.1f" fill="#FBF6EE" stroke="#8C7A62" stroke-width="2"/>'
                   % (x0 + pw / 2, ph / 2 + 6, pw / 2 - 2, ph / 2 - 2))
        for k in range(15):
            r, c = divmod(k, 5)
            if a is None:
                f, s = '#fff', '#7E8E88'
            else:
                f = cols[0] if k < a else cols[1]
                s = '#333'
            out.append('<circle cx="%.1f" cy="%.1f" r="13" fill="%s" stroke="%s" stroke-width="1.5"/>'
                       % (x0 + pw / 2 + (c - 2) * 34, ph / 2 + 6 + (r - 1) * 34, f, s))
        cap = '%s %d개 + %s %d개' % (names[0], a, names[1], b) if a is not None else '%s (   )개 + %s (   )개' % names
        out.append(T(x0 + pw / 2, ph + 30, cap, 22))
    return wrap(''.join(out), W, H)


def coins_svg(rows, lab='100', u=30, label=True):
    lw = 96 if label else 10
    W = lw + max(rows) * u + 16
    H = len(rows) * u + 16
    out = []
    for i, n in enumerate(rows):
        y = 8 + i * u
        if label:
            out.append(T(8, y + u / 2, ORD[i + 1] + ' 날', 16, anchor='start'))
        for c in range(n):
            out.append(cell('coin', lw + c * u, y, u, None, lab))
    return wrap(''.join(out), W, H)


def shell_svg():
    s, u, gap = [1, 2, 3, 5, 8], 22, 12
    W = gap + sum(k * u + gap for k in s)
    H = 8 * u + 46
    out, x = [], gap
    cols = ["#F6C85F", "#F7B27A", "#F2A0A0", "#9ED39A", "#7FB8E6"]
    for i, k in enumerate(s):
        y = H - 32 - k * u
        out.append('<rect x="%d" y="%d" width="%d" height="%d" rx="3" fill="%s" stroke="#6B5A48" stroke-width="2"/>' % (x, y, k * u, k * u, cols[i]))
        out.append('<path d="M%d %d A%d %d 0 0 1 %d %d" fill="none" stroke="#8C5A2B" stroke-width="2.5"/>' % (x, y + k * u, k * u, k * u, x + k * u, y))
        out.append(T(x + k * u / 2, H - 15, k, 18))
        x += k * u + gap
    return wrap(''.join(out), W, H)


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

    def why(self, q, n=2):
        q = '왜 그럴까요? ' + q
        self._group([(nlines(q, 34) * 8.1, self.s.ask, (q, False)), (n * 8.3, self.s.lines, (n,))])

    def write(self, q, n=2):
        self._group([(nlines(q, 34) * 8.1, self.s.ask, (q, False)), (n * 8.3, self.s.lines, (n,))])

    def pic(self, svgt, mm=150, maxh=80):
        Wd, Hd = svgt[1], svgt[2]
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
        self._q(len(rows) * 11.6 + 1, self.s.table, rows, **k)

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


# ================================================================ 자주 쓰는 묶음
def grid_block(w, rows, D, traces, pic_note=None):
    """수 배열표 + 규칙 문장. traces: [(행, 열, 방향) | None(다른 방향 자유)] → 정답 문장 목록."""
    full_ok(rows)
    w.table(grid_table(rows), header=False)
    ans = []
    for t in traces:
        if t is None:
            if D:
                w.fill("또 다른 방향의 규칙:  (                    )부터 (      ) 방향으로 (                    )")
            else:
                w.fill("(          )부터 (      ) 방향으로 (          )씩 ( 커져요 / 작아져요 ).")
            continue
        sent, kind, k = rule(rows, *t)
        start = run_from(rows, *t)[0]
        if D:
            w.fill("%d부터 %s  (                                  )" % (start, dirp(t[2])))
        elif kind in ('up', 'down'):
            w.fill("%d부터 %s (          )씩 ( 커져요 / 작아져요 )." % (start, dirp(t[2])))
        elif kind == 'times':
            w.fill("%d부터 %s (          )배가 돼요." % (start, dirp(t[2])))
        else:
            w.fill("%d부터 %s (          )분의 1만큼이 돼요." % (start, dirp(t[2])))
        ans.append(sent)
    return ans


def free_rule(rows):
    """→·↓ 말고 다른 방향의 규칙 예시(↗ 대각선, 없으면 ↑)."""
    R = len(rows)
    for d, (r, c) in (('↗', (R - 1, 0)), ('↑', (R - 1, 0))):
        seq = run_from(rows, r, c, d)
        if len(seq) >= 3 and rules_of(seq):
            return rule(rows, r, c, d)[0]
    raise AssertionError('다른 방향 규칙 없음')


def blank_asks(w, rows):
    bl = blanks_of(rows)
    w.fill('   '.join('%s (          )' % b[0] for b in bl))
    return ', '.join('%s %s' % b for b in bl)


def seq_block(w, title, heads, rows, blank='(          )'):
    """계산식의 배열 표: rows = [X(...)]"""
    tb = [['차례', '%s  (%s)' % (title, ' · '.join(heads))]]
    for lab, e, a, full in rows:
        tb.append([lab or '', show(e, blank)])
    w.table(tb, col_mm=[30, 150])
    return ['%s %s' % (lab, pretty(full)) for lab, e, a, full in rows if a]


def pairs_of(seq, op, n=2):
    k = {'+': seq[1] - seq[0], '-': seq[0] - seq[1], '×': seq[1] // seq[0], '÷': seq[0] // seq[1]}[op]
    out = []
    for i in range(n):
        res = seq[i + 1]
        e = '%d%s%d=%d' % (seq[i], op, k, res)
        assert eq_ok(e), e
        out.append(pretty(e))
    return out


def eq_frames(w, D, q, seq, op, n=2):
    """이웃한 두 수로 식 쓰기."""
    w.text(q)
    if D:
        w.fill('식:  (                              ),   (                              )')
    else:
        k = {'+': seq[1] - seq[0], '-': seq[0] - seq[1], '×': seq[1] // seq[0], '÷': seq[0] // seq[1]}[op]
        sym = {'+': '+', '-': '−', '×': '×', '÷': '÷'}[op]
        w.fill('%d %s %d = (        ),     (        ) %s %d = (        )' % (seq[0], sym, k, sym, k))
    return pairs_of(seq, op, n)


def counts_table(w, gen, ns, what, unit='개', blanks=()):
    head = [''] + [ORD[n] for n in ns]
    row = ['%s의 수(%s)' % (what, unit)] + ['(     )' if n in blanks else str(cnt(gen, n)) for n in ns]
    w.table([head, row])
    return ', '.join('%s %d' % (ORD[n], cnt(gen, n)) for n in ns if n in blanks)


def expr_table(w, ns, exprs, blanks):
    head = [''] + [ORD[n] for n in ns]
    row = ['식'] + ['(          )' if n in blanks else exprs[n] for n in ns]
    w.table([head, row])
    return ', '.join('%s %s' % (ORD[n], exprs[n]) for n in ns if n in blanks)


def paper_for(gen, n, extra=1):
    cs = GEN[gen](n)
    return paper_svg(max(r for r, _ in cs) + 1 + extra, max(c for _, c in cs) + 1 + extra + 1)


def draw_next(w, gen, n, mm, maxh, what='모양'):
    w.text('규칙에 따라 %s %s을 모눈에 그려 보세요.' % (ORD[n], what))
    w.pic(paper_for(gen, n), mm, maxh)


def OX(xs):
    return [(x, '( ○ / × )') for x in xs]


def write2(w, D, pairs):
    """[(질문, 기본형 문장 틀, 예시 답)] — 기본형은 문장 틀, 도전형은 쓰는 줄."""
    for q, frame, _ in pairs:
        if D:
            w.write(q, 2)
        else:
            w.ask(q, blank=False)
            w.fill(frame)
    return ' / '.join('(예: %s)' % a for _, _, a in pairs)


def cards_table(cards, cols=4):
    """카드 [글] → 번호 붙인 표."""
    rows, r = [], []
    for i, t in enumerate(cards):
        r.append('%d. %s' % (i + 1, pretty(t + '=0').split(' = ')[0]))
        if len(r) == cols:
            rows.append(r)
            r = []
    if r:
        rows.append(r + [''] * (cols - len(r)))
    return rows


def check_pairs(pairs):
    vals = []
    for a, b in pairs:
        x, y = ev(a + '=' + b)
        assert x == y and x.denominator == 1, (a, b)
        vals.append(x)
    assert len(set(vals)) == len(vals)


def match_block(w, D, pairs, seed, cols=4):
    check_pairs(pairs)
    cards = [t for p in pairs for t in p]
    random.Random(seed).shuffle(cards)
    w.table(cards_table(cards, cols), header=False)
    n = len(pairs)
    if D:
        w.text('크기가 같은 두 카드의 번호를 짝지어 써 보세요.')
        w.fill(['   '.join(['(    ,    )'] * min(5, n))] + (['   '.join(['(    ,    )'] * (n - 5))] if n > 5 else []))
    else:
        w.text('크기가 같은 두 카드를 찾아 (번호, 번호)로 짝지어 써 보세요. 계산하기 전에 수의 변화를 먼저 살펴봐요.')
        w.fill(['   '.join(['(    ,    )'] * 4), '   '.join(['(    ,    )'] * (n - 4))] if n <= 8 else
               ['   '.join(['(    ,    )'] * 5), '   '.join(['(    ,    )'] * (n - 5))])
    idx = {t: i + 1 for i, t in enumerate(cards)}
    return ', '.join('(%d,%d) %s = %s' % (idx[a], idx[b], pretty(a + '=0').split(' = ')[0], pretty(b + '=0').split(' = ')[0])
                     for a, b in pairs)


def seq_order(w, items, order):
    """items(뒤섞인 글), order: 바른 차례의 items 번호 목록 → 각 글이 몇 번째인지."""
    w.choices([(t, '(      )번째') for t in items])
    pos = {k: i + 1 for i, k in enumerate(order)}
    return ', '.join(str(pos[i]) for i in range(len(items)))


# ================================================================ 교과서 차시 버전
R6T3 = [[43, 45, 47, 49, 51, 53], [40, 42, 44, 46, 48, 50], [37, 39, 41, 43, 45, 47], [34, 36, 38, 40, 42, 44]]
R6SP = list(range(2, 33, 2))
R6ADD = [X('', '10+90=100'), X('', '20+80=100'), X('', '30+70=100'), X('', '40+60=100')]
R6SUB = [X('', '121-11=110'), X('', '122-12=110'), X('', '123-13=110'), X('', '124-14=110')]
R6MUL = [X('', '1×3=3'), X('', '11×3=33'), X('', '111×3=333'), X('', '1111×3=3333')]
R6DIV = [X('', '5÷5=1'), X('', '55÷5=11'), X('', '555÷5=111'), X('', '5555÷5=1111')]
R6PAIRS = [("5+13", "9+9"), ("12-2", "15-5"), ("10+7", "8+9"), ("4×6", "3×8"), ("30+30", "29+31"), ("51-11", "52-12"), ("6+8", "7+7"), ("20-15", "18-13")]
R6PAIRS2 = [("25+17", "27+15"), ("46-19", "47-20"), ("6×4", "12×2"), ("33+33", "30+36"), ("70-35", "80-45"), ("9×5", "15×3"), ("18+19", "20+17"), ("64-28", "66-30"), ("8×7", "28×2"), ("41+29", "35+35")]


def tb_l1(w, D):
    w.lesson(1, "개념 찾기(S)", "단원 도입 ― 수리수리 수학 나라", "수와 도형, 계산식의 배열 속에는 어떤 규칙이 숨어 있을까요?",
             "하진이와 지혜, 현우는 수학 가상 세계 ‘수리수리 수학 나라’의 숫자 섬, 도형 섬, 무지개 섬, 저울 섬을 탐험하며 숨겨진 규칙을 찾아요.")
    w.step("① 그림 살펴보기", "땅속 암모나이트 화석")
    w.text("암모나이트의 단면은 한 변의 길이가 각각 1, 2, 3, 5, 8, ...인 정사각형들로 이어 붙여 그릴 수 있대요.")
    w.pic(shell_svg(), 120, 50)
    w.pick("그림을 보고 알 수 있는 것은?", ["자연 속에서도 규칙을 찾을 수 있어요.", "정사각형의 크기가 모두 같아요.", "규칙은 수학책에만 있어요."])
    w.text("우리 주변에서 규칙을 찾을 수 있는 것이면 ○, 아니면 ×에 표시해 보세요.")
    w.choices(OX(["포장지와 벽지의 무늬", "달력의 수 배열", "사물함 번호", "아무렇게나 쏟아 놓은 블록"]))
    w.step("② 똑똑! 무엇을 배울까요", "네 섬에서 볼 수 있는 것")
    w.text("‘수학 가상 세계에 오신 것을 환영합니다!’ 각 섬에서 볼 수 있는 것을 알맞은 섬에 ○표 해 보세요.")
    isl = "( 숫자 섬 / 도형 섬 / 무지개 섬 / 저울 섬 )"
    cards = [("입구 바닥에 나타난 수의 배열", 0), ("하늘 위로 떠오른 도형의 배열", 1), ("무지개 위의 덧셈식과 뺄셈식", 2),
             ("사다리 위의 곱셈식과 나눗셈식", 2), ("크기가 같은 두 양을 재는 저울", 3)]
    w.choices([(t, isl) for t, _ in cards])
    names = ["숫자 섬", "도형 섬", "무지개 섬", "저울 섬"]
    w.step("③ 그림 보며 이야기하기", "무지개와 사다리 위의 계산식")
    seq_block(w, "무지개 위 덧셈식", ["더해지는 수", "더하는 수", "합"], R6ADD)
    seq_block(w, "사다리 위 곱셈식", ["곱해지는 수", "곱하는 수", "곱"], R6MUL)
    w.choices([("무지개 위 덧셈식들의 같은 점은?", "( 합이 모두 100 / 더하는 수가 모두 같아요 )"),
               ("곱해지는 수 1, 11, 111, 1111은 어떻게 변하나요?", "( 1이 1개씩 늘어나요 / 1씩 커져요 / 2배가 돼요 )")])
    w.step("④ 곰곰! 배운 내용을 떠올려요", "2학년 때 배운 덧셈표")
    add = [[2, 3, 4, 5], [3, 4, ('㉠', 5), 6], [4, 5, 6, 7], [5, 6, 7, ('㉡', 8)]]
    g = grid_block(w, add, D, [(0, 0, '↘')])
    b = blank_asks(w, add)
    w.step("⑤ 생각 나누기", "내 생각 쓰기")
    a5 = write2(w, D, [("가상 세계를 경험해 본 적이 있나요? (가상 세계: 실제 있는 것처럼 보이지만 실제로는 없는 세계)",
                        "나는 (                         )에서 가상 세계를 경험해 봤어요.", "가상 현실 기기로 생존 수영 수업을 해 봤어요"),
                       ("4개의 섬에서 하진이와 친구들에게 어떤 일이 펼쳐질지 예상해 써 보세요.",
                        "(            ) 섬에서 (                    )을 찾아 탈출할 것 같아요.", "수의 배열에서 규칙을 찾아 섬을 탈출할 것 같아요")])
    ans = ("1차시  ① ①, ○ ○ ○ × ② %s ③ 합이 모두 100, 1이 1개씩 늘어나요 ④ %s / %s ⑤ %s"
           % (', '.join(names[k] for _, k in cards), g[0], b, a5))
    if D:
        w.step("⑥ 도전하기", "그림 속 규칙을 이어 가기")
        w.ask("암모나이트 정사각형의 한 변의 길이 1, 2, 3, 5, 8 다음에 올 수는? (앞의 두 수를 더해요)")
        w.ask("1×3=3, 11×3=33, 111×3=333, 1111×3=3333 다음 식 11111×3의 곱은?")
        assert 11111 * 3 == 33333 and 5 + 8 == 13
        w.why("11111×3의 곱을 계산하지 않고 알 수 있는 까닭을 써 보세요.")
        ans += " ⑥ 13, 33333, 왜: (예: 곱해지는 수의 1이 1개 늘어나면 곱의 3도 1개 늘어나요)"
    return ans


def tb_l2(w, D):
    w.lesson(2, "개념 구축하기(O)", "수의 배열에서 규칙을 찾아볼까요", "수의 배열에서 규칙을 어떻게 찾을 수 있을까요?",
             "숫자 섬 입구 바닥에 수의 배열이 나타났어요.")
    A = [[1201, 2201, 3201, 4201], [1101, 2101, 3101, 4101], [1001, 2001, 3001, 4001], [901, 1901, 2901, 3901]]
    w.step("① 만져 보기", "숫자 섬 입구의 수의 배열")
    w.text("수를 차례로 따라가며 규칙을 찾아 문장을 완성해 보세요.")
    g1 = grid_block(w, A, D, [(0, 0, '→'), (0, 1, '↓'), None])
    B = [[27, 54, 108, 216], [9, 18, ('㉠', 36), 72], [3, 6, 12, 24], [1, 2, 4, ('㉡', 8)]]
    w.step("② 그려 보기", "몇 배가 되는 수의 배열")
    w.text("덧셈과 뺄셈으로 말하기 어려운 수의 배열이에요. 규칙을 찾고 빈칸에 알맞은 수를 써 보세요.")
    g2 = grid_block(w, B, D, [(0, 0, '→'), (0, 1, '↓')])
    b2 = blank_asks(w, B)
    w.step("③ 말해 보기", "바구니 번호")
    C = [["가 708", "가 718", "가 728", "㉠"], ["나 708", "㉡", "나 728", "나 738"], ["다 708", "다 718", "다 728", "다 738"], ["라 708", "라 718", "라 728", "라 738"]]
    w.table(C, header=False)
    w.choices([("가로(→) 방향의 규칙은?", "( 글자는 그대로, 수는 10씩 커져요 / 글자는 바뀌고, 수는 그대로예요 )"),
               ("세로(↓) 방향의 규칙은?", "( 글자는 가, 나, 다, 라 순서로 바뀌고 수는 그대로예요 / 글자는 그대로, 수는 10씩 커져요 )")])
    w.fill("㉠ (              )      ㉡ (              )")
    w.step("④ 약속하기", "수의 배열에서 규칙 찾기")
    if D:
        w.fill(["수의 배열에서 규칙을 찾을 때는 (                ) 몇씩 (                          ) 살펴봐요.",
                "덧셈과 뺄셈으로 말하기 어려우면 몇 (            ) 생각해요. 규칙을 말할 때는 시작하는 수와 (          )을 함께 말해요."])
    else:
        w.fill(["수의 배열에서 규칙을 찾을 때는 ( 어느 방향으로 / 어느 색깔로 ) 몇씩 ( 커지거나 작아지는지 / 놓여 있는지 ) 살펴봐요.",
                "덧셈과 뺄셈으로 말하기 어려우면 몇 ( 배가 되는지 / 개가 있는지 ) 생각해요. 규칙을 말할 때는 시작하는 수와 ( 방향을 / 글자 크기를 ) 함께 말해요."])
    E = [[2072, 2272, 2472, 2672], [2062, 2262, ('㉠', 2462), 2662], [2052, 2252, 2452, 2652], [2042, ('㉡', 2242), 2442, 2642]]
    w.step("⑤ 확인하기", "익힘책 문제")
    g5 = grid_block(w, E, D, [(0, 0, '→'), (0, 1, '↓')])
    b5 = blank_asks(w, E)
    ans = ("2차시  ① %s / %s / (예: %s) ② %s / %s / %s ③ 글자는 그대로·수는 10씩 커져요, 글자는 가·나·다·라로 바뀌고 수는 그대로예요, ㉠ 가 738, ㉡ 나 718 "
           "④ 어느 방향으로, 커지거나 작아지는지, 배가 되는지, 방향 ⑤ %s / %s / %s"
           % (g1[0], g1[1], free_rule(A), g2[0], g2[1], b2, g5[0], g5[1], b5))
    if D:
        F = [[256, 128, 64, ('★', 32), 16, ('▲', 8)]]
        w.step("⑥ 도전하기", "→ 방향의 수의 배열")
        w.table(grid_table(F), header=False)
        assert rules_of([256, 128, 64, 32, 16, 8]) == [('part', 2)]
        w.fill("규칙: 256부터 → 방향으로 (                              )      ★ (        )   ▲ (        )")
        w.why("이 배열의 규칙을 덧셈이나 뺄셈으로 말하기 어려운 까닭을 써 보세요.", 1)
        ans += " ⑥ 1/2만큼이 돼요, ★ 32, ▲ 8, 왜: 이웃한 두 수의 차가 128, 64, 32로 일정하지 않아요"
    return ans


def tb_l3(w, D):
    w.lesson(3, "개념 구축하기(O)", "수의 배열에서 규칙을 찾아 식으로 나타내어 볼까요", "수의 배열에서 찾은 규칙을 어떻게 식으로 나타낼 수 있을까요?",
             "‘숫자 섬을 탈출하려면 화면에 나타난 수의 배열에서 규칙을 찾아 식으로 나타내어야 합니다.’")
    w.step("① 만져 보기", "가로(→)와 세로(↓) 방향의 규칙")
    g1 = grid_block(w, R6T3, D, [(0, 0, '→'), (0, 0, '↓')])
    w.step("② 그려 보기", "이웃한 두 수로 식 쓰기")
    e1 = eq_frames(w, D, "가로(→) 방향의 규칙을 이웃한 두 수로 덧셈식 2개로 나타내어 보세요.", R6T3[0], '+')
    e2 = eq_frames(w, D, "세로(↓) 방향의 규칙을 이웃한 두 수로 뺄셈식 2개로 나타내어 보세요.", [r[0] for r in R6T3], '-')
    w.step("③ 말해 보기", "한 줄로 늘어선 수의 배열")
    S = [3, 9, 27, 81, 243, 729]
    w.table([[str(x) for x in S]], header=False)
    w.choices([("3부터 → 방향의 규칙은?", "( 6씩 커져요 / 3배가 돼요 / 3씩 커져요 )")])
    e3 = eq_frames(w, D, "→ 방향의 규칙을 곱셈식 2개로 나타내어 보세요.", S, '×')
    e4 = eq_frames(w, D, "← 방향의 규칙을 나눗셈식 2개로 나타내어 보세요.", S[::-1], '÷')
    w.step("④ 약속하기", "규칙을 식으로 나타내기")
    if D:
        w.fill(["한 방향을 정해 (            ) 두 수로 식을 써요. 수가 커지면 (                    )으로,",
                "작아지면 (                    )으로 나타낼 수 있어요. 43=43처럼 (              ) 규칙이 드러나지 않아요."])
    else:
        w.wordbox(["이웃한", "덧셈식이나 곱셈식", "뺄셈식이나 나눗셈식", "등호만 쓰면"])
        w.fill(["한 방향을 정해 (            ) 두 수로 식을 써요. 수가 커지면 (                    )으로,",
                "작아지면 (                    )으로 나타낼 수 있어요. 43=43처럼 (              ) 규칙이 드러나지 않아요."])
    w.step("⑤ 확인하기", "나선 모양 수의 배열")
    sp = [x if i not in (6, 9) else (('㉠', x) if i == 6 else ('㉡', x)) for i, x in enumerate(R6SP)]
    w.text("2부터 나선을 따라 수가 놓여 있어요. 한 방향으로 이웃한 수를 살펴 규칙을 찾고, ㉠과 ㉡에 알맞은 수를 구해 보세요.")
    w.pic(spiral_svg(sp), 100, 92)
    # 6부터 ← (j=2) : 6, 14, 22, 30 / 4부터 ↓ (j=1): 4, 12, 20, 28
    assert R6SP[2::4] == [6, 14, 22, 30] and R6SP[1::4] == [4, 12, 20, 28]
    if D:
        w.fill("㉠ (        )   ㉡ (        )    내가 찾은 규칙: (                                        )")
    else:
        w.fill(["6부터 ← 방향으로 (        )씩 커져요. → ㉠ (        )", "4부터 ↓ 방향으로 (        )씩 커져요. → ㉡ (        )"])
    ans = ("3차시  ① %s / %s ② %s / %s ③ 3배가 돼요, %s / %s ④ 이웃한, 덧셈식이나 곱셈식, 뺄셈식이나 나눗셈식, 등호만 쓰면 "
           "⑤ 6부터 ← 방향으로 8씩 커져요 → ㉠ 14, 4부터 ↓ 방향으로 8씩 커져요 → ㉡ 20"
           % (g1[0], g1[1], ', '.join(e1), ', '.join(e2), ', '.join(e3), ', '.join(e4)))
    if D:
        w.step("⑥ 도전하기", "여러 가지 식으로 나타내기")
        w.write("나선 위 수의 배열에서 한 방향의 규칙을 이웃한 두 수로 식 2개로 나타내어 보세요.", 1)
        w.ask("4, 12, 36, 108, 324의 → 방향 규칙을 곱셈식으로 나타내어 보세요.")
        w.why("같은 배열의 규칙을 덧셈식으로도, 뺄셈식으로도 나타낼 수 있는 까닭을 써 보세요.", 1)
        ans += " ⑥ (예: 2+8=10, 10+8=18 / 2+2=4) / %s / 왜: (예: 방향을 반대로 하면 커지는 규칙이 작아지는 규칙이 돼요)" % pairs_of([4, 12, 36], '×', 1)[0]
    return ans


def tb_l4(w, D):
    w.lesson(4, "개념 구축하기(O)", "도형의 배열에서 규칙을 찾아볼까요", "도형의 배열에서 모양과 수는 어떻게 변할까요?",
             "‘도형 섬으로 가고 싶다면 도형의 배열에서 비밀을 알아내세요.’ 하늘 위로 사각형으로 만든 모양이 떠올랐어요.")
    w.step("① 만져 보기", "사각형으로 만든 모양의 배열")
    w.pic(shape_svg('rect2', [1, 2, 3, 4]), 150, 40)
    c1 = counts_table(w, 'rect2', [1, 2, 3, 4], '사각형', blanks=(3, 4))
    w.step("② 그려 보기", "다섯째 모양 그리기")
    draw_next(w, 'rect2', 5, 110, 45)
    w.choices([("첫째부터 오른쪽으로 모양은 어떻게 변하나요?", "( 가로의 사각형이 1개씩 늘어나요 / 세로의 사각형이 1개씩 늘어나요 )"),
               ("사각형의 수는 어떻게 변하나요?", "( 2개씩 늘어나요 / 1개씩 늘어나요 / 2배가 돼요 )")])
    w.ask("다섯째 모양의 사각형은 몇 개인가요?")
    w.step("③ 말해 보기", "바둑돌로 만든 모양의 배열")
    w.pic(shape_svg('tri', [1, 2, 3, 4], kind='stone'), 130, 55)
    c3 = counts_table(w, 'tri', [1, 2, 3, 4], '바둑돌', blanks=(3, 4))
    if D:
        w.fill("늘어난 바둑돌:  첫째→둘째 (    )개,  둘째→셋째 (    )개,  셋째→넷째 (    )개")
    else:
        w.fill("늘어난 바둑돌:  첫째→둘째 2개,  둘째→셋째 (    )개,  셋째→넷째 (    )개")
    w.ask("다섯째 모양에 필요한 바둑돌은 몇 개인가요?")
    w.step("④ 약속하기", "도형의 배열에서 규칙 찾기")
    if D:
        w.fill(["첫째, 둘째, 셋째, ...로 갈수록 (          )이 어떻게 바뀌는지와 도형의 (          )가 몇 개씩 늘어나는지를 함께 살펴봐요.",
                "사각형의 배열은 (                    ) 늘어나고, 바둑돌의 배열은 (                    ) 늘어나요."])
    else:
        w.fill(["첫째, 둘째, 셋째, ...로 갈수록 ( 모양이 / 색깔이 ) 어떻게 바뀌는지와 도형의 ( 수가 / 이름이 ) 몇 개씩 늘어나는지를 함께 살펴봐요.",
                "사각형의 배열은 ( 2개씩 일정하게 / 2개, 3개, 4개씩 ) 늘어나고, 바둑돌의 배열은 ( 2개, 3개, 4개, ...씩 / 2개씩 일정하게 ) 늘어나요."])
    w.step("⑤ 확인하기", "ㄴ 모양의 배열")
    w.pic(shape_svg('ell', [1, 2, 3, 4], mystery=6), 160, 60)
    w.choices([("ㄴ 모양의 사각형의 수는 어떻게 변하나요?", "( 2개씩 늘어나요 / 1개씩 늘어나요 / 2배가 돼요 )"),
               ("‘다음 모양’은 몇째에 알맞은 모양인가요?", "( 다섯째 / 여섯째 / 일곱째 )")])
    assert [cnt('ell', n) for n in (1, 2, 3, 4, 6)] == [1, 3, 5, 7, 11]
    ans = ("4차시  ① %s ② 가로의 사각형이 1개씩 늘어나요, 2개씩, 10개(가로 5개, 세로 2줄) ③ %s, 3개·4개, 15개 "
           "④ 모양, 수, 2개씩 일정하게, 2개·3개·4개…씩 ⑤ 2개씩, 여섯째(사각형 11개)" % (c1, c3))
    assert cnt('rect2', 5) == 10 and cnt('tri', 5) == 15
    if D:
        w.step("⑥ 도전하기", "익힘책 ― 사각형으로 만든 모양")
        w.pic(shape_svg('gamma', [1, 2, 3, 4], anchor='top'), 140, 55)
        c6 = counts_table(w, 'gamma', [1, 2, 3, 4], '사각형', blanks=(3, 4))
        w.ask("사각형은 몇 개씩 늘어나나요?")
        w.why("여섯째 모양의 사각형이 몇 개인지 규칙으로 구하고, 그렇게 구한 까닭을 써 보세요.", 1)
        ans += " ⑥ %s, 2개, 여섯째 %d개 왜: 1개부터 아래쪽과 오른쪽으로 1개씩, 모두 2개씩 늘어나요" % (c6, cnt('gamma', 6))
    return ans


def tb_l5(w, D):
    w.lesson(5, "개념 구축하기(O)", "도형의 배열에서 규칙을 찾아 식으로 나타내어 볼까요", "도형의 배열에서 찾은 규칙을 어떻게 식으로 나타낼 수 있을까요?",
             "‘도형의 배열에서 규칙을 찾아야 문이 열릴 것 같아.’ 도형 섬을 나가는 거대한 문에 배열이 나타났어요.")
    w.step("① 만져 보기", "계단 모양의 배열")
    w.pic(shape_svg('stair3', [1, 2, 3, 4], layers=True, anchor='top'), 150, 55)
    c1 = counts_table(w, 'stair3', [1, 2, 3, 4], '사각형', blanks=(3, 4))
    w.choices([("사각형의 수는 어떻게 변하나요?", "( 2개부터 3개씩 늘어나요 / 3개부터 2개씩 늘어나요 / 2배가 돼요 )")])
    draw_next(w, 'stair3', 5, 100, 60)
    w.step("② 그려 보기", "사각형의 수를 덧셈식으로")
    ex = {1: '2', 2: '2+3', 3: '2+3+3', 4: '2+3+3+3', 5: '2+3+3+3+3'}
    e2 = expr_table(w, [1, 2, 3, 4, 5], ex, blanks=(4, 5) if not D else (3, 4, 5))
    for n in range(1, 6):
        assert eval(ex[n]) == cnt('stair3', n)
    w.step("③ 말해 보기", "모형으로 만든 모양의 배열")
    w.text("같은 색은 앞 모양에서 새로 늘어난 모형이에요.")
    w.pic(shape_svg('rectM', [1, 2, 3, 4], kind='mod', layers=True), 150, 60)
    exm = {1: '2', 2: '2+4', 3: '2+4+6', 4: '2+4+6+8', 5: '2+4+6+8+10'}
    for n in range(1, 6):
        assert eval(exm[n]) == cnt('rectM', n)
    e3 = expr_table(w, [1, 2, 3, 4, 5], exm, blanks=(4, 5) if not D else (3, 4, 5))
    w.step("④ 약속하기", "도형의 배열을 식으로")
    if not D:
        w.wordbox(["덧셈식", "곱셈식", "여러 가지 식"])
    w.fill(["몇 개씩 늘어나는지 찾으면 (          )으로 나타낼 수 있어요. 직사각형 모양이면 가로와 세로의 수를 곱하는",
            "(          )으로도 나타낼 수 있어요. 한 가지 배열을 (                  )으로 나타낼 수 있어요."])
    w.step("⑤ 확인하기", "(가로)×(세로)의 곱셈식")
    exx = {n: '%d×%d' % (n + 1, n) for n in range(1, 7)}
    e5 = expr_table(w, [1, 2, 3, 4, 5], exx, blanks=(4, 5))
    w.choices([("2+4+6+8+10과 6×5의 크기는?", "( 같아요 / 덧셈식이 커요 / 곱셈식이 커요 )")])
    assert eval('2+4+6+8+10') == 6 * 5 == 30
    ans = ("5차시  ① %s, 2개부터 3개씩, 다섯째 14개(넷째 아래 한 칸 오른쪽에 3개) ② %s ③ %s ④ 덧셈식, 곱셈식, 여러 가지 식 ⑤ %s, 같아요(30)"
           % (c1, e2, e3, e5))
    assert cnt('stair3', 5) == 14
    if D:
        w.step("⑥ 도전하기", "여섯째 모양")
        w.pic(shape_svg('rectM', [4, 5], kind='mod'), 90, 45)
        draw_next(w, 'rectM', 6, 90, 55)
        w.ask("여섯째 모양의 모형 수를 곱셈식으로 나타내고, 모두 몇 개인지 구해 보세요.")
        w.why("2+4+6+8+10+12와 7×6의 크기가 같은 까닭을 써 보세요.", 1)
        assert 7 * 6 == 42 == sum(range(2, 13, 2)) == cnt('rectM', 6)
        ans += " ⑥ 7×6=42(개), 왜: 둘 다 여섯째 모양의 모형 수를 센 식이에요(늘어난 수를 더하거나 가로 7개씩 6줄로 세었어요)"
    return ans


def tb_l6(w, D):
    w.lesson(6, "개념 구축하기(O)", "덧셈식과 뺄셈식의 배열에서 규칙을 찾아볼까요", "덧셈식과 뺄셈식의 배열에서 어떤 규칙을 찾을 수 있을까요?",
             "무지개 섬에 도착하니 커다란 무지개 위로 덧셈식의 배열이 나타났어요.")
    w.step("① 만져 보기", "무지개 위 덧셈식")
    seq_block(w, "무지개 위 덧셈식", ["더해지는 수", "더하는 수", "합"], R6ADD)
    w.text("식마다 변하는 수에 ○표 해 보세요.")
    w.pick("덧셈식의 배열에서 찾은 규칙은?", ["합이 일정할 때 더해지는 수가 10씩 커지면 더하는 수는 10씩 작아져요.",
                                    "더해지는 수와 더하는 수가 모두 10씩 커져요.", "합이 10씩 커져요."])
    w.step("② 그려 보기", "다음 식 쓰기")
    a1 = seq_block(w, "덧셈식", ["더해지는 수", "더하는 수", "합"], R6ADD + [X('㉠', '□+□=□', [50, 50, 100])])
    a2 = seq_block(w, "무지개 위 뺄셈식", ["빼지는 수", "빼는 수", "차"], R6SUB + [X('㉡', '□-□=□', [125, 15, 110])])
    w.step("③ 말해 보기", "추측하고 계산기로 확인하기")
    L3 = [X('첫째', '88+2=90'), X('둘째', '888+12=900'), X('셋째', '8888+112=9000'), X('넷째', '□+1112=90000', [88888]),
          X('다섯째', '□+□=□', [888888, 11112, 900000])]
    a3 = seq_block(w, "덧셈식의 배열", ["더해지는 수", "더하는 수", "합"], L3)
    if not D:
        w.fill("더해지는 수는 88부터 (    )이 1개씩, 더하는 수는 2부터 앞자리에 (    )이 1개씩, 합은 90부터 (    )이 1개씩 늘어나요.")
    w.step("④ 약속하기", "계산식의 배열에서 규칙 찾기")
    if D:
        w.fill(["계산식의 배열에서는 (                          )를 살펴 규칙을 찾아요. 합이 일정할 때 더해지는 수가 10씩 커지면 더하는 수는 10씩 (          ).",
                "차가 일정할 때 빼지는 수가 1씩 커지면 빼는 수도 1씩 (          ). 찾은 규칙으로 다음 계산 결과를 (          ) 계산기로 확인해요."])
    else:
        w.fill(["계산식의 배열에서는 ( 변하는 수와 변하지 않는 수 / 가장 큰 수 )를 살펴 규칙을 찾아요. 합이 일정할 때 더해지는 수가 10씩 커지면 더하는 수는 10씩 ( 작아져요 / 커져요 ).",
                "차가 일정할 때 빼지는 수가 1씩 커지면 빼는 수도 1씩 ( 커져요 / 작아져요 ). 찾은 규칙으로 다음 계산 결과를 ( 추측하고 / 지우고 ) 계산기로 확인해요."])
    w.step("⑤ 확인하기", "뺄셈식의 배열")
    L5 = [X('첫째', '13-2=11'), X('둘째', '133-22=111'), X('셋째', '1333-222=1111'), X('넷째', '13333-2222=11111'),
          X('다섯째', '□-□=□', [133333, 22222, 111111])]
    a5 = seq_block(w, "뺄셈식의 배열", ["빼지는 수", "빼는 수", "차"], L5)
    w.choices([("규칙에 따라 차가 1111111이 되는 뺄셈식은 몇째일까요?", "( 다섯째 / 여섯째 / 일곱째 )")])
    assert 1333333 - 222222 == 1111111
    ans = ("6차시  ① 변하는 수: 더해지는 수·더하는 수, ① ② %s, %s ③ %s, %s%s ④ 변하는 수와 변하지 않는 수, 작아져요, 커져요, 추측하고 "
           "⑤ %s, 여섯째(1333333−222222=1111111)" % (a1[0], a2[0], a3[0], a3[1], '' if D else ' / 8, 1, 0', a5[0]))
    if D:
        w.step("⑥ 도전하기", "익힘책 ― 빈칸에 알맞은 식")
        b1 = seq_block(w, "덧셈식의 배열", ["더해지는 수", "더하는 수", "합"],
                       [X('', '130+100=230'), X('', '110+120=230'), X('', '90+140=230'), X('', '70+160=230'), X('㉠', '□+□=□', [50, 180, 230])])
        b2 = seq_block(w, "뺄셈식의 배열", ["빼지는 수", "빼는 수", "차"],
                       [X('', '350-150=200'), X('', '400-200=200'), X('', '450-250=200'), X('', '500-300=200'), X('㉡', '□-□=□', [550, 350, 200])])
        b3 = seq_block(w, "덧셈식의 배열", ["더해지는 수", "더하는 수", "합"],
                       [X('첫째', '12+89=101'), X('둘째', '112+889=1001'), X('셋째', '1112+8889=10001'), X('넷째', '11112+88889=100001'),
                        X('다섯째', '□+□=□', [111112, 888889, 1000001])])
        w.why("㉡의 차가 200으로 그대로인 까닭을 써 보세요.", 1)
        ans += " ⑥ %s, %s, %s, 왜: 빼지는 수와 빼는 수가 똑같이 50씩 커지기 때문이에요" % (b1[0], b2[0], b3[0])
    return ans


def tb_l7(w, D):
    w.lesson(7, "개념 구축하기(O)", "곱셈식과 나눗셈식의 배열에서 규칙을 찾아볼까요", "곱셈식과 나눗셈식의 배열에서 어떤 규칙을 찾을 수 있을까요?",
             "하늘에서 사다리가 내려왔어요. 사다리 위에 곱셈식과 나눗셈식이 있어요.")
    w.step("① 만져 보기", "사다리 위 곱셈식")
    a1 = seq_block(w, "사다리 위 곱셈식", ["곱해지는 수", "곱하는 수", "곱"], R6MUL + [X('㉠', '□×□=□', [11111, 3, 33333])])
    w.pick("곱셈식의 배열에서 찾은 규칙은?", ["곱해지는 수는 1부터 1이 1개씩 늘어나고, 곱은 3부터 3이 1개씩 늘어나요.", "곱하는 수가 1씩 커져요.", "곱이 3씩 커져요."])
    w.step("② 그려 보기", "사다리 위 나눗셈식")
    a2 = seq_block(w, "사다리 위 나눗셈식", ["나누어지는 수", "나누는 수", "몫"], R6DIV + [X('㉡', '□÷□=□', [55555, 5, 11111])])
    if not D:
        w.fill("나누어지는 수는 5부터 (    )가 1개씩 늘어나고, 몫은 1부터 (    )이 1개씩 늘어나요.")
    w.step("③ 말해 보기", "추측하고 계산기로 확인하기")
    a3 = seq_block(w, "곱셈식의 배열", ["곱해지는 수", "곱하는 수", "곱"],
                   [X('첫째', '3×9=27'), X('둘째', '3×99=297'), X('셋째', '3×999=2997'), X('넷째', '3×9999=□', [29997]), X('다섯째', '□×□=□', [3, 99999, 299997])])
    if not D:
        w.fill("곱하는 수는 9부터 (    )가 1개씩 늘어나고, 곱은 27부터 2와 7 사이에 (    )가 1개씩 늘어나요.")
    w.step("④ 약속하기", "곱셈식과 나눗셈식의 배열")
    if D:
        w.fill(["곱셈식과 나눗셈식의 배열에서도 (                          )를 살펴 규칙을 찾아요.",
                "곱해지는 수의 1이 1개씩 늘어나면 곱의 3도 1개씩 (          ). 찾은 규칙으로 다음 곱이나 몫을 (          ) 계산기로 확인해요."])
    else:
        w.fill(["곱셈식과 나눗셈식의 배열에서도 ( 변하는 수와 변하지 않는 수 / 가장 작은 수 )를 살펴 규칙을 찾아요.",
                "곱해지는 수의 1이 1개씩 늘어나면 곱의 3도 1개씩 ( 늘어나요 / 줄어들어요 ). 찾은 규칙으로 다음 곱이나 몫을 ( 추측하고 / 어림하지 않고 ) 계산기로 확인해요."])
    w.step("⑤ 확인하기", "나눗셈식의 배열")
    a5 = seq_block(w, "나눗셈식의 배열", ["나누어지는 수", "나누는 수", "몫"],
                   [X('첫째', '42÷6=7'), X('둘째', '4422÷66=67'), X('셋째', '444222÷666=667'), X('넷째', '44442222÷6666=6667'),
                    X('다섯째', '□÷□=□', [4444422222, 66666, 66667])])
    w.choices([("규칙에 따라 몫이 666667이 되는 나눗셈식은 몇째일까요?", "( 다섯째 / 여섯째 / 일곱째 )")])
    assert 444444222222 // 666666 == 666667 and 444444222222 % 666666 == 0
    ans = ("7차시  ① %s, ① ② %s%s ③ %s, %s%s ④ 변하는 수와 변하지 않는 수, 늘어나요, 추측하고 ⑤ %s, 여섯째(444444222222÷666666=666667)"
           % (a1[0], a2[0], '' if D else ' / 5, 1', a3[0], a3[1], '' if D else ' / 9, 9', a5[0]))
    if D:
        w.step("⑥ 도전하기", "익힘책 ― 빈칸의 식과 잘못 설명한 사람")
        b1 = seq_block(w, "나눗셈식의 배열", ["나누어지는 수", "나누는 수", "몫"],
                       [X('', '200÷2=100'), X('', '300÷3=100'), X('', '400÷4=100'), X('', '500÷5=100'), X('㉡', '□÷□=□', [600, 6, 100])])
        b2 = seq_block(w, "곱셈식의 배열", ["곱해지는 수", "곱하는 수", "곱"],
                       [X('첫째', '105×6=630'), X('둘째', '1005×6=6030'), X('셋째', '10005×6=60030'), X('넷째', '□×□=□', [100005, 6, 600030])])
        seq_block(w, "나눗셈식의 배열", ["나누어지는 수", "나누는 수", "몫"],
                  [X('첫째', '721÷7=103'), X('둘째', '7021÷7=1003'), X('셋째', '70021÷7=10003'), X('넷째', '700021÷7=100003')])
        w.text("지혜: “나누어지는 수는 7과 2 사이에 0이 1개씩 늘어나고 몫은 1과 3 사이에 0이 1개씩 늘어나.”")
        w.text("은솔: “다섯째에 알맞은 나눗셈식은 7000021÷7=100003이야.”")
        w.choices([("잘못 설명한 사람은?", "( 지혜 / 은솔 )")])
        w.why("잘못 설명한 사람의 식을 바르게 고쳐 써 보세요.", 1)
        assert 7000021 // 7 == 1000003
        ans += " ⑥ %s, %s, 은솔, 왜: 다섯째는 7000021÷7=1000003이에요(몫의 0도 5개)" % (b1[0], b2[0])
    return ans


def tb_l8(w, D):
    w.lesson(8, "개념 구축하기(O)", "크기가 같은 두 양의 관계를 식으로 나타내어 볼까요", "크기가 같은 두 양의 관계를 어떻게 식으로 나타낼 수 있을까요?",
             "저울 섬에 도착했어요. 왼쪽 접시 가에는 모양 조각 10개, 오른쪽 접시 나에는 모양 조각 12개가 있어요. 모양 조각 하나의 무게는 모두 같아요.")
    w.step("① 만져 보기", "식 10−1=12−3이 옳은지 저울로 확인하기")
    w.pic(balance_svg(10, 12), 120, 50)
    w.text("가에서 1개, 나에서 3개를 덜어 내도록 조각에 × 표시해 보세요.")
    w.fill("가에 남은 조각 (      )개,  나에 남은 조각 (      )개")
    w.choices([("저울이 수평을 이루나요?", "( 수평 / 가 쪽으로 기울어요 / 나 쪽으로 기울어요 )"), ("식 10−1=12−3은 옳은가요?", "( 옳아요 / 옳지 않아요 )")])
    w.step("② 그려 보기", "저울로 등호를 사용한 식 만들기")
    assert 10 - 2 == 12 - 4 and 10 - 4 == 12 - 6
    w.fill(["10 − 2 = 12 − □     □ = (        )", "10 − □ = 12 − 6     □ = (        )"])
    if not D:
        w.text("도움: 가가 나보다 2개 적어요. 나에서 2개 더 많이 덜어 내야 수평이 돼요.")
    w.step("③ 말해 보기", "초콜릿 접시 ― 15개씩 담아요")
    w.pic(plates_svg([(3, 12), (4, 11), (10, 5), (12, 3)]), 170, 45)
    w.text("3 + 12 = 4 + 11,   10 + 5 = 12 + 3 처럼 아래 빈 접시 두 개를 색칠해 7 + 8 = □ + □ 의 식을 2개 만들어 보세요.")
    w.pic(plates_svg([(None, None), (None, None)]), 110, 40)
    w.fill("7 + 8 = (      ) + (      ),      7 + 8 = (      ) + (      )")
    w.choices([("빨간색 초콜릿이 늘어나면 파란색 초콜릿은?", "( 늘어난 만큼 줄어요 / 똑같이 늘어요 / 그대로예요 )")])
    w.step("④ 약속하기", "등호(=)")
    if not D:
        w.wordbox(["크기가 같은", "등호(=)"])
    w.fill("4+8=5+7, 6−3=10−7, 4×6=8×3과 같이 (                ) 두 양의 관계를 (            )를 사용하여 식으로 나타낼 수 있어요.")
    w.step("⑤ 확인하기", "크기가 같은 두 양을 등호로")
    w.text("보기: 42 + 38 = 40 × 2.  계산하기보다 수의 변화를 살펴 크기가 같은 두 양을 찾아 등호로 이어 보세요.")
    w.table([["30 + 30", "51 − 11", "52 − 12", "29 + 31"]], header=False)
    w.fill("(            ) = (            ),     (            ) = (            )")
    check_pairs([("42+38", "40×2"), ("30+30", "29+31"), ("51-11", "52-12")])
    ans = ("8차시  ① 9개, 9개, 수평, 옳아요 ② 4, 4 ③ (예) 7+8=6+9, 7+8=11+4, 늘어난 만큼 줄어요 ④ 크기가 같은, 등호(=) "
           "⑤ 30+30=29+31, 51−11=52−12")
    if D:
        w.step("⑥ 도전하기", "참일까요, 거짓일까요?")
        eqs = ["4+5=9", "12-5=9", "7=3+4", "8+2=10+4", "7+4=15-4", "8=8"]
        w.choices([(pretty(e), '( 참 / 거짓 )') for e in eqs])
        tf = ['참' if eq_ok(e) else '거짓' for e in eqs]
        nums = [("7+4+5=7+□", 9), ("2+15=5+□", 12), ("83-30=□-10", 63)]
        for e, a in nums:
            assert eq_ok(fill_box(e, [a]))
        w.fill('   '.join(show(e, '(      )') for e, _ in nums))
        w.why("12−5=9가 거짓인 까닭을 등호의 뜻을 넣어 써 보세요.", 1)
        ans += " ⑥ %s / 9, 12, 63(★) / 왜: 등호 양쪽의 크기가 같아야 하는데 12−5는 7이라 9와 크기가 달라요" % ', '.join(tf)
    return ans


def tb_l9(w, D):
    w.lesson("9~10", "탐구 정리하기(O)", "생각을 더하다 ― 규칙적으로 모아 기부해 볼까요",
             "규칙을 찾아 식으로 나타내면 모은 금액을 어떻게 쉽게 구할 수 있을까요?",
             "“은지는 100원부터 시작하여 매일 200원씩 늘려가며 저금한 금액을 기부하려고 합니다. 10일 동안 저금하였을 때, 은지가 모은 금액은 모두 얼마인지 구해 봅시다.”")
    w.step("① 이해해요", "문제 이해하기")
    w.choices([("구하려는 것은?", "( 10일 동안 모은 금액 / 첫째 날 저금한 금액 )"), ("매일 얼마씩 늘려가며 저금하나요?", "( 100원 / 200원 / 300원 )"),
               ("얼마 동안 저금했나요?", "( 5일 / 10일 / 20일 )")])
    w.step("② 계획해요", "어떻게 해결할까요?")
    w.pick("어떤 방법으로 해결하면 좋을까요?", ["저금한 동전의 수에서 규칙을 찾아 식으로 나타내고, 그림을 그려 덧셈을 곱셈으로 바꾸어요.",
                                       "날마다 저금한 금액을 대강 어림해요."])
    w.ask("첫째 날 100원, 둘째 날 300원을 저금했어요. 100원짜리 동전으로 둘째 날은 몇 개인가요?")
    w.step("③ 해결해요 ①", "날마다 저금한 동전을 줄지어 놓기")
    w.pic(coins_svg([1, 3, 5, 7]), 110, 45)
    ex = {1: '1', 2: '1+3', 3: '1+3+5', 4: '1+3+5+7'}
    e3 = expr_table(w, [1, 2, 3, 4], ex, blanks=(3, 4))
    w.step("④ 해결해요 ②", "동전을 옮겨 덧셈을 곱셈으로")
    w.text("보기: 1+3 → 2×2.  셋째 줄의 동전을 첫째 줄로 옮겨 정사각형을 만들어 모눈에 그려 보세요.")
    w.pic(pair_svg(coins_svg([1, 3, 5], label=False), paper_svg(4, 6, 30, title='옮긴 모양')), 110, 45)
    if not D:
        w.fill("1 + 3 + 5 = (    ) × (    )       1 + 3 + 5 + 7 = (    ) × (    )")
    else:
        w.fill("1 + 3 + 5 = (              )       1 + 3 + 5 + 7 = (              )")
    w.ask("열째까지의 동전을 정사각형으로 옮기면 한 줄에 몇 개씩인가요?")
    w.ask("10일 동안 저금한 100원짜리 동전은 모두 몇 개인가요?")
    w.ask("은지가 10일 동안 모은 금액은 모두 얼마인가요?")
    coins = [1 + 2 * i for i in range(10)]
    assert sum(coins) == 10 * 10 == 100 and sum(coins) * 100 == 10000
    w.step("⑤ 되돌아봐요", "해결한 과정 돌아보기")
    a5 = write2(w, D, [("문제를 해결한 방법을 설명해 보세요.", "동전의 수를 (                    )로 나타내고, 동전을 옮겨 (          ) 모양을 만들어 (      )×(      )로 구했어요.",
                        "동전 수를 1+3+5+…로 나타내고 정사각형을 만들어 10×10으로 구했어요"),
                       ("다른 방법으로도 해결할 수 있을까요?", "100원 + 300원 + (        ) + ... + (          )을 차례로 더해요.", "100원+300원+500원+…+1900원을 차례로 더해요")])
    ans = ("9~10차시  ① 10일 동안 모은 금액, 200원, 10일 ② ①, 3개 ③ %s ④ 3×3, 4×4, 10개, 100개, 10000원 ⑤ %s" % (e3, a5))
    if D:
        w.step("⑥ 도전하기", "척척! 내 힘으로 풀어요")
        w.text("준호는 200원부터 시작하여 매일 200원씩 늘려가며 10일 동안 저금했어요. 100원짜리 동전은 2개, 4개, 6개, 8개, ...로 늘어나요.")
        w.pic(coins_svg([2, 4, 6, 8]), 110, 45)
        w.fill("2 + 4 + 6 + 8 = (    ) × (    )      열째까지 = (    ) × (    )")
        w.ask("준호가 10일 동안 모은 금액은 모두 얼마인가요?")
        w.why("동전을 옮기면 정사각형이 아니라 직사각형이 되는 까닭을 써 보세요.", 1)
        c2 = [2 * (i + 1) for i in range(10)]
        assert sum(c2[:4]) == 5 * 4 and sum(c2) == 11 * 10 == 110
        ans += " ⑥ 5×4, 11×10=110(개), 11000원, 왜: 은지보다 날마다 1개씩 더 많아 한 줄이 줄 수보다 1개 많아요"
    return ans


def tb_l11(w, D):
    w.lesson(11, "발표하기(P)", "놀이를 더하다 ― 내 짝을 찾아라!", "크기가 같은 두 양을 어떻게 빨리 찾을 수 있을까요?",
             "뒤집은 카드 2장의 크기가 같으면 등호를 사용한 식을 완성할 수 있어요. 2명이 하는 놀이예요.")
    w.step("① 놀이 방법 알기", "차례대로 번호 쓰기")
    items = ["카드 2장을 골라 뒤집어요.", "문제 카드의 식을 완성하고 반으로 잘라요.", "카드를 더 많이 가져간 사람이 이겨요.",
             "자른 카드를 섞어 뒤집어 놓고 가위바위보로 순서를 정해요.", "크기가 같으면 카드를 가져오고, 다르면 다시 뒤집어 놓아요."]
    o1 = seq_order(w, items, [1, 3, 0, 4, 2])
    w.step("② 문제 카드 완성하기", "왼쪽과 똑같은 식이 아니면 어떤 수라도 좋아요(두 자리 수까지)")
    cards = [("5+13", "+", "4+14"), ("12-2", "-", "15-5"), ("10+7", "+", "8+9"), ("4×6", "×", "3×8")]
    for l, _, e in cards:
        assert eq_ok(l + '=' + e)
    w.fill(['%s = (      ) %s (      )' % (pretty(l + '=0').split(' = ')[0], {'+': '+', '-': '−', '×': '×'}[op]) for l, op, _ in cards])
    if not D:
        w.text("도움: 5+13에서 5가 4로 1만큼 작아지면 13은 14로 1만큼 커져야 해요.")
    w.step("③ 놀이하기", "카드 16장에서 짝 찾기")
    m = match_block(w, D, R6PAIRS, 'tb11')
    w.step("④ 정리하기", "빨리 찾는 방법")
    if D:
        w.fill("모두 계산하기보다 수의 (        )를 살펴봐요. 덧셈에서는 한 수가 커진 만큼 다른 수가 (          ) 크기가 같고, 뺄셈에서는 빼지는 수가 커진 만큼 빼는 수도 (          ) 크기가 같아요.")
    else:
        w.fill("모두 계산하기보다 수의 ( 변화를 / 색깔을 ) 살펴봐요. 덧셈에서는 한 수가 커진 만큼 다른 수가 ( 작아지면 / 커지면 ) 크기가 같고, 뺄셈에서는 빼지는 수가 커진 만큼 빼는 수도 ( 커지면 / 작아지면 ) 크기가 같아요.")
    w.step("⑤ 확인하기", "가져올 수 있을까요?")
    w.choices([("가져올 수 있는 두 카드는?", "( 24+17과 25+16 / 30−12와 31−11 / 6×4와 5×5 )"), ("18+25와 짝이 되는 카드는?", "( 20+23 / 20+27 / 16+25 )")])
    assert eq_ok('24+17=25+16') and not eq_ok('30-12=31-11') and eq_ok('18+25=20+23')
    ans = ("11차시  ① %s ② (예) 4+14, 15−5, 8+9, 3×8 ③ %s ④ 변화, 작아지면, 커지면 ⑤ 24+17과 25+16, 20+23" % (o1, m))
    if D:
        w.step("⑥ 도전하기", "카드 20장 ― 어려운 판")
        m2 = match_block(w, D, R6PAIRS2, 'tb11b', cols=5)
        w.why("70−35와 80−45가 짝인 까닭을 계산하지 않고 설명해 보세요.", 1)
        ans += " ⑥ %s, 왜: 빼지는 수와 빼는 수가 똑같이 10만큼 커졌어요" % m2
    return ans


def tb_l12(w, D):
    w.lesson(12, "발표하기(P)", "공부한 내용을 확인해요", "규칙과 관계에서 배운 내용을 잘 알고 있나요?",
             "수의 배열과 도형의 배열, 계산식의 배열에서 규칙을 찾고, 크기가 같은 두 양을 등호로 나타내 봐요.")
    S = [128, 64, 32, 16, 8, 4]
    w.step("① 척척! 1번", "수의 배열을 식으로")
    w.table([[str(x) for x in S]], header=False)
    w.choices([("128부터 → 방향의 규칙은?", "( 64씩 작아져요 / 1/2만큼이 돼요 / 2배가 돼요 )")])
    e1 = eq_frames(w, D, "→ 방향의 규칙을 이웃한 두 수로 식 2개로 나타내어 보세요.", S, '÷')
    w.step("② 척척! 2번", "계단 모양의 배열")
    w.pic(shape_svg('tri', [1, 2, 3, 4], layers=True), 120, 50)
    ex = {1: '1', 2: '1+2', 3: '1+2+3', 4: '1+2+3+4'}
    e2 = expr_table(w, [1, 2, 3, 4], ex, blanks=(3, 4))
    w.ask("다섯째 모양의 사각형은 몇 개인가요?")
    w.step("③ 척척! 3번", "등호를 사용한 식 완성하기")
    nums = [("6+8=7+□", 7), ("13+□=23+12", 22), ("11-□=10-5", 6), ("30-15=□-25", 40)]
    for e, a in nums:
        assert eq_ok(fill_box(e, [a]))
    w.fill(['     '.join(show(e, '(      )') for e, _ in nums[:2]), '     '.join(show(e, '(      )') for e, _ in nums[2:])])
    w.step("④ 척척! 4번", "여섯째 식 쓰기")
    a1 = seq_block(w, "덧셈식의 배열", ["더해지는 수", "더하는 수", "합"],
                   [X(ORD[i + 1], '%d+149=%d' % (541 + 100 * i, 690 + 100 * i)) for i in range(5)] + [X('여섯째', '□+□=□', [1041, 149, 1190])])
    a2 = seq_block(w, "뺄셈식의 배열", ["빼지는 수", "빼는 수", "차"],
                   [X(ORD[i + 1], '%d-%d=131' % (254 + 110 * i, 123 + 110 * i)) for i in range(5)] + [X('여섯째', '□-□=□', [804, 673, 131])])
    w.step("⑤ 꼭꼭! 확인하고 정리해요", "□를 구해 글자 칸 색칠하기")
    w.text("① 3, 6, 12, □, 48, □     ② 45−30=15, 55−40=15, 65−50=15, 75−□=15     ③ 11÷1=11, 22÷2=11, 33÷3=11, □÷4=11")
    tiles = [[24, "규"], [34, "사"], [96, "칙"], [54, "연"], [60, "찾"], [78, "심"], [44, "기"], [42, "산"]]
    w.table([[str(t[0]) for t in tiles], [t[1] for t in tiles]], header=False)
    w.fill("□ :  ① (      ), (      )   ② (      )   ③ (      )      색칠한 글자: (                    )")
    assert [3 * 2 ** i for i in range(6)] == [3, 6, 12, 24, 48, 96] and 75 - 60 == 15 and 44 // 4 == 11
    ans = ("12차시  ① 1/2만큼이 돼요, %s ② %s, 15개 ③ %s ④ %s, %s ⑤ 24, 96, 60, 44 → 규칙 찾기"
           % (', '.join(e1), e2, ', '.join(str(a) for _, a in nums), a1[0], a2[0]))
    if D:
        w.step("⑥ 도전하기", "나누는 수가 63이 되는 나눗셈식")
        rows = [X(ORD[i + 1], '%d÷%d=12345679' % (111111111 * (i + 1), 9 * (i + 1))) for i in range(5)]
        seq_block(w, "나눗셈식의 배열", ["나누어지는 수", "나누는 수", "몫"], rows)
        w.choices([("나누는 수가 63이 되는 나눗셈식은 몇째일까요?", "( 여섯째 / 일곱째 / 여덟째 )")])
        w.ask("그 나눗셈식을 써 보세요.")
        assert 777777777 // 63 == 12345679 and 777777777 % 63 == 0
        w.why("일곱째라고 생각한 까닭을 써 보세요.", 1)
        ans += " ⑥ 일곱째, 777777777÷63=12345679, 왜: 나누는 수가 9씩 커지고 63은 9의 7배예요"
    return ans


# ================================================================ 이야기 버전
R6S_CAL = [[1, 2, 3, 4, 5, 6, 7], [8, 9, 10, 11, 12, 13, 14], [15, 16, 17, 18, 19, 20, 21], [22, 23, 24, 25, 26, 27, 28], [29, 30]]
R6S_LOCK = [[1305, 2305, 3305, 4305], [1205, 2205, 3205, 4205], [1105, 2105, 3105, 4105], [1005, 2005, 3005, 4005]]
R6S_SP = [3 * (i + 1) for i in range(16)]
R6S_ADD = [X('', '100+400=500'), X('', '150+350=500'), X('', '200+300=500'), X('', '250+250=500')]
R6S_SUB = [X('', '520-120=400'), X('', '530-130=400'), X('', '540-140=400'), X('', '550-150=400')]
R6S_MUL = [X('', '1×6=6'), X('', '11×6=66'), X('', '111×6=666'), X('', '1111×6=6666')]
R6S_DIV = [X('', '8÷8=1'), X('', '88÷8=11'), X('', '888÷8=111'), X('', '8888÷8=1111')]
R6S_PAIRS = [("7+15", "11+11"), ("14-3", "16-5"), ("9+8", "10+7"), ("2×9", "3×6"), ("40+40", "39+41"), ("63-23", "64-24"), ("5+9", "7+7"), ("30-17", "33-20")]
R6S_PAIRS2 = [("26+18", "28+16"), ("57-19", "58-20"), ("5×6", "10×3"), ("21+21", "20+22"), ("90-45", "85-40"), ("8×4", "16×2"), ("19+17", "20+16"), ("72-25", "70-23"), ("9×6", "18×3"), ("33+29", "31+31")]


def st_why(w, D, q, frame, ans):
    """앱의 ‘먼저 예상해요’·‘왜 그럴까요?’ 칸."""
    if D:
        w.write(q, 2)
    else:
        w.ask(q, blank=False)
        w.fill(frame)
    return '(예: %s)' % ans


def st_l1(w, D):
    w.lesson(1, "개념 찾기(S)", "나눔 저금통 프로젝트를 시작해요", "우리 반 나눔 저금통 프로젝트 속에는 어떤 규칙과 관계가 숨어 있을까요?",
             "4학년 1반은 ‘나눔 저금통’에 규칙적으로 돈을 모아 학기 말에 지역 아동센터에 기부하기로 했어요. 반장 서연, 저금 기록을 맡은 지후, 꾸미기 담당 하은, 동전 탑을 좋아하는 민준, 퀴즈를 내는 다온이가 함께해요.")
    w.step("① 만져 보기 — 보기·생각하기·궁금해하기", "11월 나눔 달력(동그라미 = 저금통을 여는 날: 5일, 12일, 19일, 26일)")
    w.table([["일", "월", "화", "수", "목", "금", "토"]] + [[str(x) for x in r] + [''] * (7 - len(r)) for r in R6S_CAL])
    if D:
        w.labeled([("보여요", "\n"), ("생각해요", "\n"), ("궁금해요", "\n")], row_h=5600)
    else:
        w.labeled([("보여요", "달력에서 (                              )이 보여요.\n"), ("생각해요", "규칙적으로 모으면 (                              )\n"),
                   ("궁금해요", "(                              )은 어떤 규칙일까?\n")], row_h=5600)
    w.step("② 그려 보기 — 우리 반 규칙 모으기", "알맞은 상자에 ○표")
    box = "( 수의 배열 / 도형의 배열 / 계산식의 배열 / 크기가 같은 두 양 )"
    cards = [("사물함 번호 1105, 1205, 1305", 0), ("게시판 테두리의 색종이 무늬", 1), ("동전을 1개, 3개, 6개로 쌓은 탑", 1),
             ("100+400=500, 150+350=500", 2), ("1×6=6, 11×6=66, 111×6=666", 2), ("저울 양쪽에 공책 꾸러미를 올려 수평 맞추기", 3)]
    names = ["수의 배열", "도형의 배열", "계산식의 배열", "크기가 같은 두 양"]
    w.choices([(t, box) for t, _ in cards])
    w.step("③ 말해 보기 — 곱셈표 떠올리기", "다온이가 붙인 곱셈표의 일부")
    G = [[2, 4, 6, 8], [3, 6, 9, 12], [4, 8, ('㉠', 12), 16], [5, 10, 15, ('㉡', 20)]]
    g = grid_block(w, G, D, [(0, 0, '→')])
    b = blank_asks(w, G)
    a3 = st_why(w, D, "왜 그럴까요? 곱셈표에서 ㉠이 12인 까닭을 규칙으로 설명해 볼까요?",
                "㉠은 4부터 가로(→) 방향으로 (    )씩 커지는 줄에 있으므로 8 다음 수 (      )이에요.",
                "㉠은 4부터 가로(→) 방향으로 4씩 커지는 줄에 있으므로 8보다 4만큼 큰 12예요")
    w.step("④ 약속하기 — 무엇을 배울까요", "이 단원에서 배울 것에 ○표")
    w.choices(OX(["수의 배열에서 규칙을 찾아 식으로 나타내기", "도형의 배열에서 규칙을 찾아 식으로 나타내기", "계산식의 배열에서 다음 계산 결과 추측하기",
                  "크기가 같은 두 양을 등호로 나타내기", "저금통을 가장 예쁘게 색칠하기"]))
    w.choices([("규칙을 말할 때 꼭 함께 말해야 할 것은?", "( 어느 방향으로 몇씩 변하는지 / 수를 무슨 색으로 썼는지 )")])
    w.step("⑤ 확인하기 — 우리 반 저금 계획")
    a5 = write2(w, D, [("나눔 저금통에 어떤 규칙으로 돈을 모으면 좋을까요?", "첫째 날 (          )원을 넣고, 매일 (          )원씩 늘려서 넣어요.",
                        "첫째 날 100원을 넣고, 그다음부터 매일 100원씩 늘려서 넣어요"),
                       ("규칙적으로 모으면 좋은 점은 무엇일까요?", "규칙적으로 모으면 (                    )을 미리 알 수 있어요.",
                        "며칠 뒤에 얼마가 모일지 미리 알 수 있어요")])
    ans = ("1차시  ① (예: 동그라미 친 날이 7일마다 있어요 / 금방 많이 모일 것 같아요 / 아래 칸으로 가면 왜 7씩 커질까?) ② %s ③ %s / %s / %s "
           "④ ○ ○ ○ ○ ×, 어느 방향으로 몇씩 변하는지 ⑤ %s" % (', '.join(names[k] for _, k in cards), g[0], b, a3, a5))
    if D:
        w.step("⑥ 도전하기", "프로젝트 속 규칙을 이어 가기")
        w.ask("민준이는 첫째 날 100원, 둘째 날 300원, 셋째 날 500원을 넣었어요. 같은 규칙이면 넷째 날에는 몇 원을 넣을까요?")
        w.ask("11월 달력에서 9일 바로 아래 칸의 날짜는 며칠인가요?")
        assert R6S_CAL[2][1] == 16
        w.why("달력에서 바로 아래 칸의 날짜가 7만큼 큰 까닭을 써 보세요.", 1)
        ans += " ⑥ 700원, 16일, 왜: 한 줄에 일주일(7일)이 있어서 아래 칸은 7일 뒤예요"
    return ans


def st_l2(w, D):
    w.lesson(2, "개념 구축하기(O)", "사물함 번호와 나눔 상자 번호 ― 수의 배열에서 규칙 찾기", "수의 배열에서 규칙을 어떻게 찾을 수 있을까요?",
             "서연이가 저금통을 넣어 둘 사물함을 찾고 있어요.")
    w.step("① 만져 보기 — 사물함 번호판")
    a0 = st_why(w, D, "먼저 예상해요. 사물함 번호가 어떤 규칙으로 붙어 있을지 예상해 봐요.",
                "내 규칙: 오른쪽으로 가면 (            )씩 커지고, 아래로 가면 (            )씩 작아져요.",
                "오른쪽으로 가면 1000씩 커지고, 아래로 가면 100씩 작아져요")
    g1 = grid_block(w, R6S_LOCK, D, [(0, 0, '→'), (0, 1, '↓'), None])
    w.step("② 그려 보기 — 몇 배가 되는 배열", "다온이의 ‘규칙 수 퍼즐’")
    B = [[16, 48, 144, 432], [8, 24, ('㉠', 72), 216], [4, 12, 36, 108], [2, 6, 18, ('㉡', 54)]]
    g2 = grid_block(w, B, D, [(0, 0, '→'), (0, 1, '↓')])
    b2 = blank_asks(w, B)
    w.step("③ 말해 보기 — 나눔 상자 이름표", "하은이가 계절마다 붙인 이름표")
    C = [["봄 205", "봄 215", "봄 225", "㉠"], ["여름 205", "㉡", "여름 225", "여름 235"], ["가을 205", "가을 215", "가을 225", "가을 235"],
         ["겨울 205", "겨울 215", "겨울 225", "겨울 235"]]
    w.table(C, header=False)
    w.choices([("가로(→) 방향의 규칙은?", "( 글자는 그대로, 수는 10씩 커져요 / 글자는 바뀌고, 수는 그대로예요 )"),
               ("세로(↓) 방향의 규칙은?", "( 글자는 봄·여름·가을·겨울 순서로 바뀌고 수는 그대로예요 / 글자는 그대로, 수는 10씩 커져요 )")])
    w.fill("㉠ (              )      ㉡ (              )")
    a3 = st_why(w, D, "왜 그럴까요? 규칙을 말할 때 시작하는 수와 방향을 함께 말해야 하는 까닭은 무엇일까요?",
                "같은 표에서도 (            )에 따라 규칙이 다르기 때문이에요.",
                "같은 표에서도 방향에 따라 규칙이 다르기 때문이에요. 사물함은 → 방향으로 1000씩 커지지만 ↓ 방향으로는 100씩 작아졌어요")
    w.step("④ 약속하기 — 수의 배열에서 규칙 찾기")
    if D:
        w.fill(["수의 배열에서 규칙을 찾을 때는 (                ) 몇씩 (                          ) 살펴봐요.",
                "덧셈과 뺄셈으로 말하기 어려우면 몇 (            ) 생각해요. 규칙을 말할 때는 시작하는 수와 (          )을 함께 말해요."])
    else:
        w.fill(["수의 배열에서 규칙을 찾을 때는 ( 어느 방향으로 / 어느 색깔로 ) 몇씩 ( 커지거나 작아지는지 / 놓여 있는지 ) 살펴봐요.",
                "덧셈과 뺄셈으로 말하기 어려우면 몇 ( 배가 되는지 / 개가 있는지 ) 생각해요. 규칙을 말할 때는 시작하는 수와 ( 방향을 / 글자 크기를 ) 함께 말해요."])
    w.step("⑤ 확인하기 — 신발장 번호표", "떨어진 번호표 ㉠, ㉡")
    E = [[1080, 1580, 2080, 2580], [1060, 1560, ('㉠', 2060), 2560], [1040, 1540, 2040, 2540], [1020, ('㉡', 1520), 2020, 2520]]
    g5 = grid_block(w, E, D, [(0, 0, '→'), (0, 1, '↓')])
    b5 = blank_asks(w, E)
    ans = ("2차시  ① %s / %s / %s / (예: %s) ② %s / %s / %s ③ 글자는 그대로·수는 10씩 커져요, 글자는 봄·여름·가을·겨울로 바뀌고 수는 그대로예요, ㉠ 봄 235, ㉡ 여름 215 / %s "
           "④ 어느 방향으로, 커지거나 작아지는지, 배가 되는지, 방향 ⑤ %s / %s / %s"
           % (a0, g1[0], g1[1], free_rule(R6S_LOCK), g2[0], g2[1], b2, a3, g5[0], g5[1], b5))
    if D:
        F = [[729, 243, 81, ('★', 27), 9, ('▲', 3)]]
        w.step("⑥ 도전하기", "다온이의 → 방향 수 퀴즈")
        w.table(grid_table(F), header=False)
        assert rules_of([729, 243, 81, 27, 9, 3]) == [('part', 3)]
        w.fill("규칙: 729부터 → 방향으로 (                              )      ★ (        )   ▲ (        )")
        w.why("이 배열의 규칙을 덧셈이나 뺄셈으로 말하기 어려운 까닭을 써 보세요.", 1)
        ans += " ⑥ 1/3만큼이 돼요, ★ 27, ▲ 3, 왜: 이웃한 두 수의 차가 486, 162, 54로 일정하지 않아요"
    return ans


def st_l3(w, D):
    w.lesson(3, "개념 구축하기(O)", "11월 나눔 달력 ― 수의 배열을 식으로 나타내기", "수의 배열에서 찾은 규칙을 어떻게 식으로 나타낼 수 있을까요?",
             "지후가 11월 나눔 달력을 교실에 붙였어요.")
    w.step("① 만져 보기 — 나눔 달력의 규칙")
    a0 = st_why(w, D, "먼저 예상해요. 달력에서 아래 칸으로 가면 날짜가 어떻게 변할지 예상해 봐요.",
                "내 규칙: 아래 칸으로 가면 (        )씩 커져요. 왜냐하면 (                    ) 때문이에요.",
                "아래 칸으로 가면 7씩 커져요. 한 줄에 일주일(7일)이 있기 때문이에요")
    g1 = grid_block(w, R6S_CAL, D, [(1, 0, '→'), (0, 2, '↓')])
    w.step("② 그려 보기 — 달력 규칙을 식으로")
    e1 = eq_frames(w, D, "가로(→) 방향의 규칙을 이웃한 두 수로 덧셈식 2개로 나타내어 보세요.", R6S_CAL[1], '+')
    e2 = eq_frames(w, D, "세로(↑) 방향(아래에서 위로)의 규칙을 이웃한 두 수로 뺄셈식 2개로 나타내어 보세요.", [24, 17, 10, 3], '-')
    w.step("③ 말해 보기 — 4배가 되는 수 카드", "다온이의 수 카드")
    S = [2, 8, 32, 128, 512]
    w.table([[str(x) for x in S]], header=False)
    w.choices([("2부터 → 방향의 규칙은?", "( 6씩 커져요 / 4배가 돼요 / 4씩 커져요 )")])
    e3 = eq_frames(w, D, "→ 방향의 규칙을 곱셈식 2개로 나타내어 보세요.", S, '×')
    e4 = eq_frames(w, D, "← 방향의 규칙을 나눗셈식 2개로 나타내어 보세요.", S[::-1], '÷')
    a3 = st_why(w, D, "왜 그럴까요? 2, 8, 32, 128의 규칙을 덧셈식이 아니라 곱셈식으로 나타내는 까닭은?",
                "이웃한 두 수의 차는 (    ), (    ), (    )로 일정하지 않지만, 언제나 (    )배가 되기 때문이에요.",
                "이웃한 두 수의 차는 6, 24, 96으로 일정하지 않지만 언제나 4배가 되기 때문이에요")
    w.step("④ 약속하기 — 규칙을 식으로")
    if not D:
        w.wordbox(["이웃한", "덧셈식이나 곱셈식", "뺄셈식이나 나눗셈식", "등호만 쓰면"])
    w.fill(["한 방향을 정해 (            ) 두 수로 식을 써요. 수가 커지면 (                    )으로,",
            "작아지면 (                    )으로 나타낼 수 있어요. 8=8처럼 (              ) 규칙이 드러나지 않아요."])
    w.step("⑤ 확인하기 — 저금통 뚜껑의 소용돌이", "3부터 소용돌이를 따라 붙인 번호 스티커")
    sp = [x if i not in (6, 9) else (('㉠', x) if i == 6 else ('㉡', x)) for i, x in enumerate(R6S_SP)]
    w.pic(spiral_svg(sp), 100, 92)
    assert R6S_SP[2::4] == [9, 21, 33, 45] and R6S_SP[1::4] == [6, 18, 30, 42]
    if D:
        w.fill("㉠ (        )   ㉡ (        )    내가 찾은 규칙: (                                        )")
    else:
        w.fill(["9부터 ← 방향으로 (        )씩 커져요. → ㉠ (        )", "6부터 ↓ 방향으로 (        )씩 커져요. → ㉡ (        )"])
    ans = ("3차시  ① %s / %s / %s ② %s / %s ③ 4배가 돼요, %s / %s / %s ④ 이웃한, 덧셈식이나 곱셈식, 뺄셈식이나 나눗셈식, 등호만 쓰면 "
           "⑤ 9부터 ← 방향으로 12씩 커져요 → ㉠ 21, 6부터 ↓ 방향으로 12씩 커져요 → ㉡ 30"
           % (a0, g1[0], g1[1], ', '.join(e1), ', '.join(e2), ', '.join(e3), ', '.join(e4), a3))
    if D:
        w.step("⑥ 도전하기", "여러 가지 식으로 나타내기")
        w.write("소용돌이 위 수의 배열에서 한 방향의 규칙을 이웃한 두 수로 식 2개로 나타내어 보세요.", 1)
        w.ask("5, 10, 20, 40, 80의 → 방향 규칙을 곱셈식으로 나타내어 보세요.")
        w.why("같은 소용돌이에서 12씩 커지는 규칙과 3씩 커지는 규칙이 함께 있는 까닭을 써 보세요.", 1)
        ans += " ⑥ (예: 3+12=15, 15+12=27 / 3+3=6) / %s / 왜: 소용돌이를 따라가면 3씩, 한 방향으로 한 바퀴 건너뛰면 4개 뒤라 12씩 커져요" % pairs_of([5, 10, 20], '×', 1)[0]
    return ans


def st_l4(w, D):
    w.lesson(4, "개념 구축하기(O)", "나눔 게시판 꾸미기 ― 도형의 배열에서 규칙 찾기", "도형의 배열에서 모양과 수는 어떻게 변할까요?",
             "하은이가 나눔 게시판 테두리를 색종이 사각형으로 꾸미고 있어요.")
    w.step("① 만져 보기 — 게시판 테두리 무늬")
    w.pic(shape_svg('rect3', [1, 2, 3, 4]), 150, 45)
    a0 = st_why(w, D, "먼저 예상해요. 다음 모양으로 갈 때 사각형이 어떻게 늘어날지 예상해 봐요.",
                "내 규칙: 세로 3줄은 그대로이고, 오른쪽에 사각형이 (      )개씩 늘어나요.",
                "세로 3줄은 그대로이고 오른쪽에 한 줄씩 붙어서 사각형이 3개씩 늘어나요")
    c1 = counts_table(w, 'rect3', [1, 2, 3, 4], '사각형', blanks=(3, 4))
    w.step("② 그려 보기 — 다섯째 무늬 만들기")
    draw_next(w, 'rect3', 5, 110, 50)
    w.choices([("첫째부터 오른쪽으로 모양은 어떻게 변하나요?", "( 세로 3줄은 그대로, 가로가 1개씩 늘어요 / 세로가 1개씩 늘어요 )"),
               ("사각형의 수는 어떻게 변하나요?", "( 3개씩 늘어나요 / 1개씩 늘어나요 / 2배가 돼요 )")])
    w.ask("다섯째 모양의 사각형은 몇 개인가요?")
    w.step("③ 말해 보기 — 민준이의 동전 탑")
    w.pic(shape_svg('tri', [1, 2, 3, 4], kind='coin', lab='100'), 130, 55)
    c3 = counts_table(w, 'tri', [1, 2, 3, 4], '동전', blanks=(3, 4))
    if D:
        w.fill("늘어난 동전:  첫째→둘째 (    )개,  둘째→셋째 (    )개,  셋째→넷째 (    )개      다섯째 탑: (      )개")
    else:
        w.fill("늘어난 동전:  첫째→둘째 2개,  둘째→셋째 (    )개,  셋째→넷째 (    )개      다섯째 탑: (      )개")
    a3 = st_why(w, D, "왜 그럴까요? 게시판 무늬와 동전 탑은 늘어나는 방법이 어떻게 다른가요?",
                "게시판 무늬는 (      )개씩 일정하게 늘어나고, 동전 탑은 (      )개, (      )개, (      )개씩 늘어나요.",
                "게시판 무늬는 3개씩 일정하게 늘어나지만, 동전 탑은 2개, 3개, 4개, ...로 늘어나는 수가 1개씩 커져요")
    w.step("④ 약속하기 — 도형의 배열에서 규칙 찾기")
    if D:
        w.fill(["첫째, 둘째, 셋째, ...로 갈수록 (          )이 어떻게 바뀌는지와 도형의 (          )가 몇 개씩 늘어나는지를 함께 살펴봐요.",
                "게시판 무늬는 (                    ) 늘어나고, 동전 탑은 (                    ) 늘어나요."])
    else:
        w.fill(["첫째, 둘째, 셋째, ...로 갈수록 ( 모양이 / 색깔이 ) 어떻게 바뀌는지와 도형의 ( 수가 / 이름이 ) 몇 개씩 늘어나는지를 함께 살펴봐요.",
                "게시판 무늬는 ( 3개씩 일정하게 / 2개, 3개, 4개씩 ) 늘어나고, 동전 탑은 ( 2개, 3개, 4개, ...씩 / 3개씩 일정하게 ) 늘어나요."])
    w.step("⑤ 확인하기 — 십자 모양 스티커")
    w.pic(shape_svg('plus', [1, 2, 3, 4], mystery=6, u=20), 165, 62)
    w.choices([("십자 모양의 사각형의 수는 어떻게 변하나요?", "( 4개씩 늘어나요 / 1개씩 늘어나요 / 2배가 돼요 )"),
               ("‘다음 모양’은 몇째에 알맞은 모양인가요?", "( 다섯째 / 여섯째 / 일곱째 )")])
    assert [cnt('plus', n) for n in (1, 2, 3, 4, 6)] == [1, 5, 9, 13, 21] and cnt('rect3', 5) == 15 and cnt('tri', 5) == 15
    ans = ("4차시  ① %s / %s ② 세로 3줄은 그대로·가로가 1개씩, 3개씩, 15개(가로 5개, 세로 3줄) ③ %s, 3개·4개, 15개 / %s "
           "④ 모양, 수, 3개씩 일정하게, 2개·3개·4개…씩 ⑤ 4개씩, 여섯째(사각형 21개)" % (a0, c1, c3, a3))
    if D:
        w.step("⑥ 도전하기", "민준이가 만든 ㄴ 모양 배열")
        w.pic(shape_svg('ell', [1, 2, 3, 4]), 130, 50)
        c6 = counts_table(w, 'ell', [1, 2, 3, 4], '사각형', blanks=(3, 4))
        w.ask("사각형은 몇 개씩 늘어나나요?")
        w.why("열째 모양의 사각형이 몇 개인지 규칙으로 구하고, 그렇게 구한 까닭을 써 보세요.", 1)
        ans += " ⑥ %s, 2개, 열째 %d개 왜: 1개부터 위쪽과 오른쪽으로 1개씩, 모두 2개씩 늘어나요(1+2×9)" % (c6, cnt('ell', 10))
    return ans


def st_l5(w, D):
    w.lesson(5, "개념 구축하기(O)", "나눔 장터 쿠키 상자 ― 도형의 배열을 식으로 나타내기", "도형의 배열에서 찾은 규칙을 어떻게 식으로 나타낼 수 있을까요?",
             "게시판 아래로 사각형 리본을 계단처럼 붙여 내려가요. 같은 색은 같은 때 붙인 리본이에요.")
    w.step("① 만져 보기 — 계단 리본 장식")
    w.pic(shape_svg('stair2', [1, 2, 3, 4], layers=True, anchor='top'), 150, 55)
    a0 = st_why(w, D, "먼저 예상해요. 리본이 어떻게 늘어날지 예상해 봐요.",
                "내 규칙: (      )개부터 시작해서 아래쪽에 (      )개씩 늘어나요.", "3개부터 시작해서 아래 오른쪽에 2개씩 늘어나요")
    c1 = counts_table(w, 'stair2', [1, 2, 3, 4], '사각형', blanks=(3, 4))
    w.choices([("사각형의 수는 어떻게 변하나요?", "( 3개부터 2개씩 늘어나요 / 2개부터 3개씩 늘어나요 / 2배가 돼요 )")])
    draw_next(w, 'stair2', 5, 100, 60)
    w.step("② 그려 보기 — 리본 수를 덧셈식으로")
    ex = {1: '3', 2: '3+2', 3: '3+2+2', 4: '3+2+2+2', 5: '3+2+2+2+2'}
    for n in range(1, 6):
        assert eval(ex[n]) == cnt('stair2', n)
    e2 = expr_table(w, [1, 2, 3, 4, 5], ex, blanks=(4, 5) if not D else (3, 4, 5))
    w.step("③ 말해 보기 — 쿠키 상자", "같은 색은 앞 상자에서 새로 늘어난 쿠키")
    w.pic(shape_svg('rectP', [1, 2, 3, 4], kind='mod', layers=True), 150, 55)
    exm = {1: '3', 2: '3+5', 3: '3+5+7', 4: '3+5+7+9', 5: '3+5+7+9+11'}
    for n in range(1, 6):
        assert eval(exm[n]) == cnt('rectP', n)
    e3 = expr_table(w, [1, 2, 3, 4, 5], exm, blanks=(4, 5) if not D else (3, 4, 5))
    w.step("④ 약속하기 — 도형의 배열을 식으로")
    if not D:
        w.wordbox(["덧셈식", "곱셈식", "여러 가지 식"])
    w.fill(["몇 개씩 늘어나는지 찾으면 (          )으로 나타낼 수 있어요. 직사각형 모양이면 가로와 세로의 수를 곱하는",
            "(          )으로도 나타낼 수 있어요. 한 가지 배열을 (                  )으로 나타낼 수 있어요."])
    w.step("⑤ 확인하기 — 가로×세로로 세기")
    exx = {n: '%d×%d' % (n + 2, n) for n in range(1, 7)}
    e5 = expr_table(w, [1, 2, 3, 4, 5], exx, blanks=(4, 5))
    w.choices([("3+5+7+9+11과 7×5의 크기는?", "( 같아요 / 덧셈식이 커요 / 곱셈식이 커요 )")])
    assert eval('3+5+7+9+11') == 35 == 7 * 5
    a5 = st_why(w, D, "왜 그럴까요? 3+5+7+9+11과 7×5의 크기가 같은 까닭을 쿠키 상자로 설명해 볼까요?",
                "두 식은 모두 (          ) 상자의 쿠키 수예요. 덧셈식은 (                ), 곱셈식은 (                )로 센 것이에요.",
                "두 식은 모두 다섯째 상자의 쿠키 수예요. 덧셈식은 늘어난 쿠키를 차례로 더했고, 곱셈식은 가로 7개씩 세로 5줄로 세었어요")
    ans = ("5차시  ① %s / %s, 3개부터 2개씩, 다섯째 11개 ② %s ③ %s ④ 덧셈식, 곱셈식, 여러 가지 식 ⑤ %s, 같아요(35) / %s"
           % (a0, c1, e2, e3, e5, a5))
    assert cnt('stair2', 5) == 11
    if D:
        w.step("⑥ 도전하기", "여섯째 쿠키 상자")
        w.pic(shape_svg('rectP', [4, 5], kind='mod'), 100, 45)
        draw_next(w, 'rectP', 6, 100, 55)
        w.ask("여섯째 상자의 쿠키 수를 곱셈식으로 나타내고, 모두 몇 개인지 구해 보세요.")
        w.why("3+5+7+9+11+13으로 더해도 같은 답이 나오는 까닭을 써 보세요.", 1)
        assert 8 * 6 == 48 == sum(range(3, 14, 2)) == cnt('rectP', 6)
        ans += " ⑥ 8×6=48(개), 왜: 둘 다 여섯째 상자의 쿠키 수를 센 식이에요"
    return ans


def st_l6(w, D):
    w.lesson(6, "개념 구축하기(O)", "저금 기록장 ― 덧셈식과 뺄셈식의 배열", "덧셈식과 뺄셈식의 배열에서 어떤 규칙을 찾을 수 있을까요?",
             "서연이와 지후는 날마다 둘이 합쳐 500원을 넣기로 했어요. 지후가 기록장에 식을 적었어요.")
    w.step("① 만져 보기 — 둘이 함께 500원")
    a0 = st_why(w, D, "먼저 예상해요. 서연이가 넣는 돈이 늘어나면 지후가 넣는 돈은 어떻게 될까요?",
                "내 규칙: 서연이가 (        )원 늘리면 지후는 (        )원 줄여요.", "둘이 합쳐 500원이 되어야 하므로 서연이가 50원 늘리면 지후는 50원 줄여요")
    seq_block(w, "서연이와 지후가 함께 넣은 돈(원)", ["서연", "지후", "합"], R6S_ADD)
    w.text("식마다 변하는 수에 ○표 해 보세요.")
    w.pick("덧셈식의 배열에서 찾은 규칙은?", ["합이 일정할 때 더해지는 수가 50씩 커지면 더하는 수는 50씩 작아져요.",
                                    "더해지는 수와 더하는 수가 모두 50씩 커져요.", "합이 50씩 커져요."])
    w.step("② 그려 보기 — 다음 식 쓰기")
    a1 = seq_block(w, "함께 넣은 돈", ["서연", "지후", "합"], R6S_ADD + [X('㉠', '□+□=□', [300, 200, 500])])
    a2 = seq_block(w, "하은이가 만든 뺄셈식 카드", ["빼지는 수", "빼는 수", "차"], R6S_SUB + [X('㉡', '□-□=□', [560, 160, 400])])
    w.step("③ 말해 보기 — 9와 1이 늘어나는 덧셈식", "추측하고 계산기로 확인하기")
    a3 = seq_block(w, "덧셈식의 배열", ["더해지는 수", "더하는 수", "합"],
                   [X('첫째', '99+11=110'), X('둘째', '999+111=1110'), X('셋째', '9999+1111=11110'), X('넷째', '□+11111=111110', [99999]),
                    X('다섯째', '□+□=□', [999999, 111111, 1111110])])
    a3w = st_why(w, D, "왜 그럴까요? 다섯째 식을 계산하지 않고 어떻게 알아냈는지 설명해 볼까요?",
                 "더해지는 수는 (    )가, 더하는 수는 (    )이, 합은 (    )이 하나씩 늘어나므로 다섯째는 (                          )예요.",
                 "더해지는 수는 9가, 더하는 수는 1이, 합은 1이 1개씩 늘어나므로 다섯째는 999999+111111=1111110이에요")
    w.step("④ 약속하기 — 계산식의 배열")
    if D:
        w.fill(["계산식의 배열에서는 (                          )를 살펴 규칙을 찾아요. 합이 일정할 때 더해지는 수가 50씩 커지면 더하는 수는 50씩 (          ).",
                "차가 일정할 때 빼지는 수가 10씩 커지면 빼는 수도 10씩 (          ). 찾은 규칙으로 다음 계산 결과를 (          ) 계산기로 확인해요."])
    else:
        w.fill(["계산식의 배열에서는 ( 변하는 수와 변하지 않는 수 / 가장 큰 수 )를 살펴 규칙을 찾아요. 합이 일정할 때 더해지는 수가 50씩 커지면 더하는 수는 50씩 ( 작아져요 / 커져요 ).",
                "차가 일정할 때 빼지는 수가 10씩 커지면 빼는 수도 10씩 ( 커져요 / 작아져요 ). 찾은 규칙으로 다음 계산 결과를 ( 추측하고 / 지우고 ) 계산기로 확인해요."])
    w.step("⑤ 확인하기 — 5와 3이 늘어나는 뺄셈식")
    a5 = seq_block(w, "뺄셈식의 배열", ["빼지는 수", "빼는 수", "차"],
                   [X('첫째', '54-32=22'), X('둘째', '554-332=222'), X('셋째', '5554-3332=2222'), X('넷째', '55554-33332=22222'),
                    X('다섯째', '□-□=□', [555554, 333332, 222222])])
    w.choices([("규칙에 따라 차가 2222222가 되는 뺄셈식은 몇째일까요?", "( 다섯째 / 여섯째 / 일곱째 )")])
    assert 5555554 - 3333332 == 2222222
    ans = ("6차시  ① %s / 변하는 수: 서연·지후가 넣은 돈, ① ② %s, %s ③ %s, %s / %s ④ 변하는 수와 변하지 않는 수, 작아져요, 커져요, 추측하고 "
           "⑤ %s, 여섯째(5555554−3333332=2222222)" % (a0, a1[0], a2[0], a3[0], a3[1], a3w, a5[0]))
    if D:
        w.step("⑥ 도전하기", "다른 모둠의 저금 기록")
        b1 = seq_block(w, "덧셈식의 배열", ["더해지는 수", "더하는 수", "합"],
                       [X('', '250+150=400'), X('', '230+170=400'), X('', '210+190=400'), X('', '190+210=400'), X('㉠', '□+□=□', [170, 230, 400])])
        b2 = seq_block(w, "뺄셈식의 배열", ["빼지는 수", "빼는 수", "차"],
                       [X('', '600-250=350'), X('', '650-300=350'), X('', '700-350=350'), X('', '750-400=350'), X('㉡', '□-□=□', [800, 450, 350])])
        w.why("㉡의 차가 350으로 그대로인 까닭을 써 보세요.", 1)
        ans += " ⑥ %s, %s, 왜: 빼지는 수와 빼는 수가 똑같이 50씩 커지기 때문이에요" % (b1[0], b2[0])
    return ans


def st_l7(w, D):
    w.lesson(7, "개념 구축하기(O)", "지후의 계산기 놀이 ― 곱셈식과 나눗셈식의 배열", "곱셈식과 나눗셈식의 배열에서 어떤 규칙을 찾을 수 있을까요?",
             "저금 기록을 맡은 지후가 쉬는 시간에 계산기로 곱셈식과 나눗셈식을 만들었어요.")
    w.step("① 만져 보기 — 1이 늘어나는 곱셈식")
    a0 = st_why(w, D, "먼저 예상해요. 1111×6 다음 식의 곱은 어떻게 될까요?",
                "내 규칙: 곱해지는 수의 1이 (    )개이면 곱의 6도 (    )개예요.", "곱해지는 수의 1이 몇 개이면 곱의 6도 그만큼 있어요. 그래서 11111×6=66666이에요")
    a1 = seq_block(w, "지후의 계산기 곱셈식", ["곱해지는 수", "곱하는 수", "곱"], R6S_MUL + [X('㉠', '□×□=□', [11111, 6, 66666])])
    w.pick("곱셈식의 배열에서 찾은 규칙은?", ["곱해지는 수는 1부터 1이 1개씩 늘어나고, 곱은 6부터 6이 1개씩 늘어나요.", "곱하는 수가 1씩 커져요.", "곱이 6씩 커져요."])
    w.step("② 그려 보기 — 8이 늘어나는 나눗셈식")
    a2 = seq_block(w, "지후의 계산기 나눗셈식", ["나누어지는 수", "나누는 수", "몫"], R6S_DIV + [X('㉡', '□÷□=□', [88888, 8, 11111])])
    if not D:
        w.fill("나누어지는 수는 8부터 (    )이 1개씩 늘어나고, 몫은 1부터 (    )이 1개씩 늘어나요.")
    w.step("③ 말해 보기 — 9가 늘어나는 곱셈식", "추측하고 계산기로 확인하기")
    a3 = seq_block(w, "곱셈식의 배열", ["곱해지는 수", "곱하는 수", "곱"],
                   [X('첫째', '6×9=54'), X('둘째', '6×99=594'), X('셋째', '6×999=5994'), X('넷째', '6×9999=□', [59994]), X('다섯째', '□×□=□', [6, 99999, 599994])])
    a3w = st_why(w, D, "왜 그럴까요? 넷째 곱 59994를 어떻게 추측했는지 설명해 볼까요?",
                 "곱하는 수에 9가 1개 늘어나면 곱은 (    )와 (    ) 사이에 9가 1개 늘어나므로 (            )예요.",
                 "곱하는 수에 9가 1개 늘어나면 곱은 5와 4 사이에 9가 1개 늘어나요. 셋째 곱 5994에서 9를 하나 더 넣으면 59994예요")
    w.step("④ 약속하기 — 곱셈식과 나눗셈식의 배열")
    if D:
        w.fill(["곱셈식과 나눗셈식의 배열에서도 (                          )를 살펴 규칙을 찾아요.",
                "곱해지는 수의 1이 1개씩 늘어나면 곱의 6도 1개씩 (          ). 찾은 규칙으로 다음 곱이나 몫을 (          ) 계산기로 확인해요."])
    else:
        w.fill(["곱셈식과 나눗셈식의 배열에서도 ( 변하는 수와 변하지 않는 수 / 가장 작은 수 )를 살펴 규칙을 찾아요.",
                "곱해지는 수의 1이 1개씩 늘어나면 곱의 6도 1개씩 ( 늘어나요 / 줄어들어요 ). 찾은 규칙으로 다음 곱이나 몫을 ( 추측하고 / 어림하지 않고 ) 계산기로 확인해요."])
    w.step("⑤ 확인하기 — 81이 늘어나는 나눗셈식")
    a5 = seq_block(w, "나눗셈식의 배열", ["나누어지는 수", "나누는 수", "몫"],
                   [X('첫째', '81÷9=9'), X('둘째', '8181÷9=909'), X('셋째', '818181÷9=90909'), X('넷째', '81818181÷9=9090909'),
                    X('다섯째', '□÷□=□', [8181818181, 9, 909090909])])
    w.choices([("규칙에 따라 몫이 90909090909가 되는 나눗셈식은 몇째일까요?", "( 다섯째 / 여섯째 / 일곱째 )")])
    assert 818181818181 // 9 == 90909090909 and 818181818181 % 9 == 0
    ans = ("7차시  ① %s / %s, ① ② %s%s ③ %s, %s / %s ④ 변하는 수와 변하지 않는 수, 늘어나요, 추측하고 ⑤ %s, 여섯째(818181818181÷9=90909090909)"
           % (a0, a1[0], a2[0], '' if D else ' / 8, 1', a3[0], a3[1], a3w, a5[0]))
    if D:
        w.step("⑥ 도전하기", "다른 친구들이 찾은 계산식")
        b1 = seq_block(w, "곱셈식의 배열", ["곱해지는 수", "곱하는 수", "곱"],
                       [X('', '20×101=2020'), X('', '30×101=3030'), X('', '40×101=4040'), X('', '50×101=5050'), X('㉠', '□×□=□', [60, 101, 6060])])
        b2 = seq_block(w, "나눗셈식의 배열", ["나누어지는 수", "나누는 수", "몫"],
                       [X('', '240÷2=120'), X('', '360÷3=120'), X('', '480÷4=120'), X('', '600÷5=120'), X('㉡', '□÷□=□', [720, 6, 120])])
        seq_block(w, "나눗셈식의 배열", ["나누어지는 수", "나누는 수", "몫"],
                  [X('첫째', '612÷6=102'), X('둘째', '6012÷6=1002'), X('셋째', '60012÷6=10002'), X('넷째', '600012÷6=100002')])
        w.text("서연: “나누어지는 수는 6과 1 사이에 0이 1개씩 늘어나고 몫은 1과 2 사이에 0이 1개씩 늘어나.”")
        w.text("민준: “다섯째에 알맞은 나눗셈식은 6000012÷6=100002야.”")
        w.choices([("잘못 설명한 사람은?", "( 서연 / 민준 )")])
        w.why("잘못 설명한 사람의 식을 바르게 고쳐 써 보세요.", 1)
        assert 6000012 // 6 == 1000002
        ans += " ⑥ %s, %s, 민준, 왜: 다섯째는 6000012÷6=1000002예요(몫의 0도 5개)" % (b1[0], b2[0])
    return ans


def st_l8(w, D):
    w.lesson(8, "개념 구축하기(O)", "공정하게 나누어요 ― 크기가 같은 두 양과 등호", "크기가 같은 두 양의 관계를 어떻게 식으로 나타낼 수 있을까요?",
             "저금통 돈으로 산 공책을 두 모둠에 나누어 주려고 해요. 저울 왼쪽 가에는 공책 11권, 오른쪽 나에는 공책 14권이 있어요(공책의 무게는 모두 같아요).")
    w.step("① 만져 보기 — 저울로 확인하기", "식 11−1=14−4가 옳을까요?")
    w.pic(balance_svg(11, 14, 'book'), 120, 50)
    w.text("가에서 1권, 나에서 4권을 덜어 내도록 공책에 × 표시해 보세요.")
    w.fill("가에 남은 공책 (      )권,  나에 남은 공책 (      )권")
    w.choices([("저울이 수평을 이루나요?", "( 수평 / 가 쪽으로 기울어요 / 나 쪽으로 기울어요 )"), ("식 11−1=14−4는 옳은가요?", "( 옳아요 / 옳지 않아요 )")])
    a1 = st_why(w, D, "왜 그럴까요? 등호(=)를 사용한 식이 옳은지 저울로 어떻게 알 수 있을까요?",
                "등호 왼쪽과 오른쪽을 저울 양쪽에 올렸을 때 (          )을 이루면 두 양의 크기가 같으므로 식이 옳아요.",
                "등호 왼쪽과 오른쪽을 저울 양쪽에 올렸을 때 수평을 이루면 두 양의 크기가 같으므로 식이 옳아요")
    w.step("② 그려 보기 — 수평 만들기")
    assert 11 - 3 == 14 - 6 and 11 - 5 == 14 - 8
    w.fill(["11 − 3 = 14 − □     □ = (        )", "11 − □ = 14 − 8     □ = (        )"])
    if not D:
        w.text("도움: 가가 나보다 3권 적어요. 나에서 3권 더 많이 덜어 내야 수평이 돼요.")
    w.step("③ 말해 보기 — 나눔 꾸러미", "간식을 15개씩 담아요")
    nm = ('사탕', '젤리')
    w.pic(plates_svg([(2, 13), (3, 12), (9, 6), (11, 4)], nm, ('#E05A4F', '#7BC47F')), 170, 45)
    w.text("2 + 13 = 3 + 12,   9 + 6 = 11 + 4 처럼 아래 빈 꾸러미 두 개를 색칠해 6 + 9 = □ + □ 의 식을 2개 만들어 보세요.")
    w.pic(plates_svg([(None, None), (None, None)], nm), 110, 40)
    w.fill("6 + 9 = (      ) + (      ),      6 + 9 = (      ) + (      )")
    w.choices([("사탕이 늘어나면 젤리는?", "( 늘어난 만큼 줄어요 / 똑같이 늘어요 / 그대로예요 )")])
    w.step("④ 약속하기 — 등호(=)")
    if not D:
        w.wordbox(["크기가 같은", "등호(=)", "같다"])
    w.fill(["5+9=6+8, 9−4=12−7, 3×8=6×4와 같이 (                ) 두 양의 관계를 (            )를 사용하여 식으로 나타낼 수 있어요.",
            "등호는 ‘답을 쓰라’는 표시가 아니라 양쪽의 크기가 (          )는 뜻이에요."])
    w.step("⑤ 확인하기 — 크기가 같은 두 양 찾기", "나눔 장터 가격표")
    w.text("보기: 25 + 35 = 30 × 2.  계산하기보다 수의 변화를 살펴 크기가 같은 두 양을 찾아 등호로 이어 보세요.")
    w.table([["40 + 40", "63 − 23", "65 − 25", "39 + 41"]], header=False)
    w.fill("(            ) = (            ),     (            ) = (            )")
    check_pairs([("25+35", "30×2"), ("40+40", "39+41"), ("63-23", "65-25")])
    ans = ("8차시  ① 10권, 10권, 수평, 옳아요 / %s ② 6, 5 ③ (예) 6+9=5+10, 6+9=9+6, 늘어난 만큼 줄어요 ④ 크기가 같은, 등호(=), 같다 "
           "⑤ 40+40=39+41, 63−23=65−25" % a1)
    if D:
        w.step("⑥ 도전하기", "참일까요, 거짓일까요?")
        eqs = ["6+7=13", "15-6=8", "9=4+5", "5+5=10+5", "8+5=15-2", "12=12"]
        w.choices([(pretty(e), '( 참 / 거짓 )') for e in eqs])
        tf = ['참' if eq_ok(e) else '거짓' for e in eqs]
        nums = [("6+3+8=6+□", 11), ("3+16=7+□", 12), ("74-20=□-10", 64)]
        for e, a in nums:
            assert eq_ok(fill_box(e, [a]))
        w.fill('   '.join(show(e, '(      )') for e, _ in nums))
        w.why("5+5=10+5가 거짓인 까닭을 등호의 뜻을 넣어 써 보세요.", 1)
        ans += " ⑥ %s / 11, 12, 64(★) / 왜: 등호 양쪽의 크기가 같아야 하는데 5+5는 10, 10+5는 15로 크기가 달라요" % ', '.join(tf)
    return ans


def st_l9(w, D):
    w.lesson("9~10", "탐구 정리하기(O)", "나눔 저금통을 열어요 ― 규칙으로 모은 돈 구하기",
             "규칙을 찾아 식으로 나타내면 모은 금액을 어떻게 쉽게 구할 수 있을까요?",
             "“서연이는 50원부터 시작하여 매일 100원씩 늘려 가며 나눔 저금통에 저금했어요. 12일 동안 저금했을 때, 서연이가 모은 금액은 모두 얼마일까요?”")
    w.step("① 만져 보기 — 문제 이해하기")
    w.choices([("구하려는 것은?", "( 12일 동안 모은 금액 / 첫째 날 넣은 금액 )"), ("매일 얼마씩 늘려 가며 저금하나요?", "( 50원 / 100원 / 150원 )"),
               ("얼마 동안 저금했나요?", "( 10일 / 12일 / 20일 )")])
    w.step("② 그려 보기 — 해결 계획 세우기")
    w.pick("민준과 하은이의 말을 듣고, 어떤 방법으로 해결하면 좋을지 골라 보세요.",
           ["넣은 동전의 수에서 규칙을 찾아 식으로 나타내고, 그림을 그려 덧셈을 곱셈으로 바꾸어요.", "날마다 넣은 금액을 대강 어림해요."])
    w.ask("첫째 날 50원, 둘째 날 150원을 넣었어요. 50원짜리 동전으로 둘째 날은 몇 개인가요?")
    w.step("③ 말해 보기 — 동전 줄을 덧셈식으로")
    w.pic(coins_svg([1, 3, 5, 7], lab='50'), 110, 45)
    ex = {1: '1', 2: '1+3', 3: '1+3+5', 4: '1+3+5+7'}
    e3 = expr_table(w, [1, 2, 3, 4], ex, blanks=(3, 4))
    w.step("④ 약속하기 — 덧셈을 곱셈으로", "보기: 1+3 → 2×2")
    w.text("넷째 줄 동전 3개를 첫째 줄로, 셋째 줄 동전 1개를 둘째 줄로 옮겨 정사각형을 만들어 모눈에 그려 보세요.")
    w.pic(pair_svg(coins_svg([1, 3, 5, 7], lab='50', label=False), paper_svg(5, 8, 30, title='옮긴 모양')), 120, 50)
    if not D:
        w.fill("1 + 3 + 5 = (    ) × (    )       1 + 3 + 5 + 7 = (    ) × (    )")
    else:
        w.fill("1 + 3 + 5 = (              )       1 + 3 + 5 + 7 = (              )")
    w.ask("열두째 날까지의 동전을 정사각형으로 옮기면 한 줄에 몇 개씩인가요?")
    w.ask("12일 동안 넣은 50원짜리 동전은 모두 몇 개인가요?")
    w.ask("서연이가 12일 동안 모은 금액은 모두 얼마인가요?")
    coins = [1 + 2 * i for i in range(12)]
    assert sum(coins) == 144 == 12 * 12 and 144 * 50 == 7200
    a4 = st_why(w, D, "왜 그럴까요? 1+3+5+7을 4×4로 바꿀 수 있는 까닭을 동전으로 설명해 볼까요?",
                "긴 줄의 동전을 짧은 줄로 옮기면 한 줄에 (    )개씩 (    )줄인 정사각형이 되기 때문이에요.",
                "긴 줄의 동전을 짧은 줄로 옮기면 한 줄에 4개씩 4줄인 정사각형이 되기 때문이에요")
    w.step("⑤ 확인하기 — 되돌아봐요")
    a5 = write2(w, D, [("문제를 해결한 방법을 설명해 보세요.", "동전의 수를 (                    )로 나타내고, 동전을 옮겨 (          ) 모양을 만들어 (      )×(      )로 구했어요.",
                        "동전 수를 1+3+5+…로 나타내고 정사각형을 만들어 12×12=144(개)로 구했어요. 50원짜리 144개는 7200원이에요"),
                       ("다른 방법으로도 해결할 수 있을까요?", "50원 + 150원 + (        ) + ... + (          )을 차례로 더해요.", "50원+150원+250원+…+1150원을 차례로 더해요")])
    ans = ("9~10차시  ① 12일 동안 모은 금액, 100원, 12일 ② ①, 3개 ③ %s ④ 3×3, 4×4, 12개, 144개, 7200원 / %s ⑤ %s" % (e3, a4, a5))
    if D:
        w.step("⑥ 도전하기", "스스로 풀어요")
        w.text("하은이는 300원부터 시작하여 매일 200원씩 늘려 가며 8일 동안 저금했어요. 100원짜리 동전은 3개, 5개, 7개, 9개, ...로 늘어나요.")
        w.pic(coins_svg([3, 5, 7, 9]), 110, 45)
        w.fill("3 + 5 + 7 + 9 = (    ) × (    )      여덟째까지 = (    ) × (    )")
        w.ask("하은이가 8일 동안 모은 금액은 모두 얼마인가요?")
        w.why("동전을 옮기면 정사각형이 아니라 직사각형이 되는 까닭을 써 보세요.", 1)
        c2 = [3 + 2 * i for i in range(8)]
        assert sum(c2[:4]) == 6 * 4 and sum(c2) == 10 * 8 == 80
        ans += " ⑥ 6×4, 10×8=80(개), 8000원, 왜: 첫째 날이 3개라 한 줄이 줄 수보다 2개 많아요"
    return ans


def st_l11(w, D):
    w.lesson(11, "발표하기(P)", "나눔 장터 ‘내 짝을 찾아라!’ 놀이", "크기가 같은 두 양을 어떻게 빨리 찾을 수 있을까요?",
             "나눔 장터에서 4학년 1반이 ‘내 짝을 찾아라!’ 놀이 부스를 열어요. 2명이 하는 놀이예요.")
    w.step("① 만져 보기 — 놀이 방법 알기", "차례대로 번호 쓰기")
    items = ["카드 2장을 골라 뒤집어요.", "문제 카드의 식을 완성하고 반으로 잘라요.", "카드를 더 많이 가져간 사람이 이겨요.",
             "자른 카드를 섞어 뒤집어 놓고 가위바위보로 순서를 정해요.", "크기가 같으면 카드를 가져오고, 다르면 다시 뒤집어 놓아요."]
    o1 = seq_order(w, items, [1, 3, 0, 4, 2])
    w.step("② 그려 보기 — 문제 카드 만들기", "왼쪽과 똑같은 식이 아니면 어떤 수라도 좋아요(두 자리 수까지)")
    cards = [("6+17", "+", "7+16"), ("15-4", "-", "16-5"), ("9+12", "+", "10+11"), ("3×8", "×", "6×4")]
    for l, _, e in cards:
        assert eq_ok(l + '=' + e)
    w.fill(['%s = (      ) %s (      )' % (pretty(l + '=0').split(' = ')[0], {'+': '+', '-': '−', '×': '×'}[op]) for l, op, _ in cards])
    if not D:
        w.text("도움: 6+17에서 6이 7로 1만큼 커지면 17은 16으로 1만큼 작아져야 해요.")
    w.step("③ 말해 보기 — 놀이하기", "카드 16장에서 짝 찾기")
    m = match_block(w, D, R6S_PAIRS, 'st11')
    w.step("④ 약속하기 — 빨리 찾는 방법")
    if D:
        w.fill("모두 계산하기보다 수의 (        )를 살펴봐요. 덧셈에서는 한 수가 커진 만큼 다른 수가 (          ) 크기가 같고, 뺄셈에서는 빼지는 수가 커진 만큼 빼는 수도 (          ) 크기가 같아요.")
    else:
        w.fill("모두 계산하기보다 수의 ( 변화를 / 색깔을 ) 살펴봐요. 덧셈에서는 한 수가 커진 만큼 다른 수가 ( 작아지면 / 커지면 ) 크기가 같고, 뺄셈에서는 빼지는 수가 커진 만큼 빼는 수도 ( 커지면 / 작아지면 ) 크기가 같아요.")
    a4 = st_why(w, D, "왜 그럴까요? 1학년 동생에게 짝을 빨리 찾는 비법을 알려 준다면 뭐라고 말할까요?",
                "덧셈 카드는 한 수가 커진 만큼 다른 수가 (          ) 짝이고, 뺄셈 카드는 두 수가 똑같이 (                ) 짝이야.",
                "덧셈 카드는 한 수가 커진 만큼 다른 수가 작아졌으면 짝이고, 뺄셈 카드는 두 수가 똑같이 커지거나 작아졌으면 짝이야")
    w.step("⑤ 확인하기 — 가져올 수 있을까?")
    w.choices([("가져올 수 있는 두 카드는?", "( 26+17과 27+16 / 40−13과 41−12 / 7×4와 6×5 )"), ("19+24와 짝이 되는 카드는?", "( 21+22 / 21+26 / 17+24 )")])
    assert eq_ok('26+17=27+16') and not eq_ok('40-13=41-12') and eq_ok('19+24=21+22')
    ans = ("11차시  ① %s ② (예) 7+16, 16−5, 10+11, 6×4 ③ %s ④ 변화, 작아지면, 커지면 / %s ⑤ 26+17과 27+16, 21+22" % (o1, m, a4))
    if D:
        w.step("⑥ 도전하기", "카드 20장 ― 어려운 판")
        m2 = match_block(w, D, R6S_PAIRS2, 'st11b', cols=5)
        w.why("90−45와 85−40이 짝인 까닭을 계산하지 않고 설명해 보세요.", 1)
        ans += " ⑥ %s, 왜: 빼지는 수와 빼는 수가 똑같이 5만큼 작아졌어요" % m2
    return ans


def st_l12(w, D):
    w.lesson(12, "발표하기(P)", "나눔 저금통 발표회 ― 배운 내용 확인하기", "규칙과 관계에서 배운 내용을 잘 알고 있나요?",
             "4학년 1반은 규칙적으로 모은 돈을 기부하며 나눔 저금통 프로젝트를 마쳤어요. 발표회에서 배운 내용을 확인해요.")
    S = [486, 162, 54, 18, 6, 2]
    w.step("① 만져 보기 — 줄어드는 수의 배열", "발표회 첫 문제")
    w.table([[str(x) for x in S]], header=False)
    w.choices([("486부터 → 방향의 규칙은?", "( 324씩 작아져요 / 1/3만큼이 돼요 / 3배가 돼요 )")])
    e1 = eq_frames(w, D, "→ 방향의 규칙을 이웃한 두 수로 식 2개로 나타내어 보세요.", S, '÷')
    w.step("② 그려 보기 — 십자 스티커를 식으로")
    w.pic(shape_svg('plus', [1, 2, 3, 4], u=20), 130, 55)
    ex = {1: '1', 2: '1+4', 3: '1+4+4', 4: '1+4+4+4'}
    for n in range(1, 5):
        assert eval(ex[n]) == cnt('plus', n)
    e2 = expr_table(w, [1, 2, 3, 4], ex, blanks=(3, 4))
    w.ask("다섯째 모양의 사각형은 몇 개인가요?")
    w.step("③ 말해 보기 — 등호 식 완성하기")
    nums = [("9+7=10+□", 6), ("15+□=25+14", 24), ("18-□=17-6", 7), ("40-12=□-22", 50)]
    for e, a in nums:
        assert eq_ok(fill_box(e, [a]))
    w.fill(['     '.join(show(e, '(      )') for e, _ in nums[:2]), '     '.join(show(e, '(      )') for e, _ in nums[2:])])
    w.step("④ 약속하기 — 여섯째 식 추측하기")
    a1 = seq_block(w, "덧셈식의 배열", ["더해지는 수", "더하는 수", "합"],
                   [X(ORD[i + 1], '%d+205=%d' % (312 + 100 * i, 517 + 100 * i)) for i in range(5)] + [X('여섯째', '□+□=□', [812, 205, 1017])])
    a2 = seq_block(w, "뺄셈식의 배열", ["빼지는 수", "빼는 수", "차"],
                   [X(ORD[i + 1], '%d-%d=223' % (365 + 110 * i, 142 + 110 * i)) for i in range(5)] + [X('여섯째', '□-□=□', [915, 692, 223])])
    w.step("⑤ 확인하기 — 비밀 글자 찾기", "□를 구해 글자 칸 색칠하기")
    w.text("① 4, 12, 36, □, 324, □     ② 62−40=22, 72−50=22, 82−60=22, 92−□=22     ③ 12÷1=12, 24÷2=12, 36÷3=12, □÷4=12")
    tiles = [[108, "나"], [118, "사"], [972, "눔"], [962, "랑"], [70, "실"], [60, "저"], [48, "천"], [44, "금"]]
    w.table([[str(t[0]) for t in tiles], [t[1] for t in tiles]], header=False)
    w.fill("□ :  ① (      ), (      )   ② (      )   ③ (      )      색칠한 글자: (                    )")
    assert [4 * 3 ** i for i in range(6)] == [4, 12, 36, 108, 324, 972] and 92 - 70 == 22 and 48 // 4 == 12
    w.step("⑥ 확인하기 — 예전 생각, 지금 생각", "1차시에 궁금했던 것을 떠올리며")
    a6 = write2(w, D, [("1차시에 궁금했던 것 가운데 하나를 골라, 이제 어떻게 답할 수 있는지 써 보세요.",
                        "(                    )이 궁금했는데, 이제는 (                    ) 때문이라는 것을 알아요.",
                        "달력에서 아래 칸으로 가면 왜 7씩 커지는지 궁금했는데, 이제는 한 줄에 일주일(7일)이 있기 때문이라는 것을 알아요"),
                       ("나눔 저금통 프로젝트에서 규칙을 알아서 편리했던 점을 발표문으로 써 보세요.",
                        "(            )에서 규칙을 찾아 (            )로 나타내니 (                    )을 쉽게 알 수 있었어요.",
                        "서연이가 모은 동전에서 규칙을 찾아 12×12로 나타내니 모은 금액 7200원을 쉽게 알 수 있었어요")])
    ans = ("12차시  ① 1/3만큼이 돼요, %s ② %s, 17개 ③ %s ④ %s, %s ⑤ 108, 972, 70, 48 → 나눔 실천 ⑥ %s"
           % (', '.join(e1), e2, ', '.join(str(a) for _, a in nums), a1[0], a2[0], a6))
    assert cnt('plus', 5) == 17
    if D:
        w.step("⑦ 도전하기", "마인드맵 ― ‘규칙과 관계’를 정리해요")
        w.labeled([("떠오르는 말", "(배열, 방향, 등호 …)\n"), ("묶어 보기", "(규칙 찾기 / 등호)\n"),
                   ("이어지는 말", "(커지는 규칙과 덧셈식 …)\n"), ("덧붙이는 말", "(예를 들면 …)\n")], row_h=5600)
        w.text("★ 선택 문제 — 발표회 보너스 문제")
        rows = [X(ORD[i + 1], '12345679×%d=%d' % (9 * (i + 1), 111111111 * (i + 1))) for i in range(4)]
        seq_block(w, "곱셈식의 배열", ["곱해지는 수", "곱하는 수", "곱"], rows)
        w.choices([("곱이 777777777이 되는 곱셈식은 몇째일까요?", "( 여섯째 / 일곱째 / 여덟째 )")])
        w.ask("12345679×□=777777777에서 □는?")
        assert 12345679 * 63 == 777777777
        w.why("일곱째라고 생각한 까닭을 써 보세요.", 1)
        ans += (" ⑦ (마인드맵 — 예: 수의 배열·도형의 배열·계산식의 배열·등호 / 시작하는 수와 방향, 변하는 수 / 저울의 수평과 등호) "
                "★ 일곱째, 63, 왜: 곱하는 수가 9씩 커지고 곱은 111111111씩 커지므로 777777777은 일곱째(9×7=63)예요")
    return ans


# ================================================================ 도전형 ― ①~⑤를 새 문제로 (⑥ 도전하기는 그대로)
GEN['xcross'] = lambda n: [(n - 1, n - 1)] + [p for k in range(1, n) for p in
                                              ((n - 1 - k, n - 1 - k), (n - 1 + k, n - 1 + k), (n - 1 + k, n - 1 - k), (n - 1 - k, n - 1 + k))]
LAYER.setdefault('coinOdd', lambda r, c: r + 1)
H_ADD = [X('', '120+480=600'), X('', '140+460=600'), X('', '160+440=600'), X('', '180+420=600')]
H_SUB = [X('', '315-15=300'), X('', '325-25=300'), X('', '335-35=300'), X('', '345-45=300')]
H_MUL = [X('', '1×7=7'), X('', '11×7=77'), X('', '111×7=777'), X('', '1111×7=7777')]
H_DIV = [X('', '4÷4=1'), X('', '44÷4=11'), X('', '444÷4=111'), X('', '4444÷4=1111')]
H_PAIRS = [("6+14", "8+12"), ("13-4", "15-6"), ("9+7", "10+6"), ("3×6", "2×9"), ("20+20", "19+21"), ("41-11", "42-12"), ("5+7", "6+6"), ("25-11", "24-10")]
HS_PAIRS = [("8+16", "10+14"), ("17-5", "19-7"), ("11+8", "12+7"), ("4×5", "2×10"), ("35+35", "34+36"), ("52-12", "53-13"), ("6+9", "7+8"), ("28-15", "27-14")]
H_MULT = [[3, 6, 9, 12], [4, 8, 12, 16], [5, 10, ('㉠', 15), 20], [6, 12, 18, ('㉡', 24)]]
H_RULES = ["카드를 많이 모은 사람이 놀이에서 이겨요.", "뒤집은 두 카드의 크기가 같으면 내가 가지고, 다르면 제자리에 다시 엎어 놓아요.",
           "식을 다 쓴 문제 카드를 가운데 선을 따라 둘로 잘라요.", "순서를 정한 뒤 내 차례에 카드 두 장을 뒤집어요.",
           "잘라 낸 카드를 모두 섞어서 글자가 안 보이게 펼쳐 놓고 순서를 정해요."]
H_RULE_ORDER = [2, 4, 3, 1, 0]


def h_order(w):
    return seq_order(w, H_RULES, H_RULE_ORDER)


def h_tb_l1(w, D):
    w.lesson(1, "개념 찾기(S)", "단원 도입 ― 수리수리 수학 나라", "수와 도형, 계산식의 배열 속에는 어떤 규칙이 숨어 있을까요?",
             "하진이와 지혜, 현우는 수학 가상 세계 ‘수리수리 수학 나라’의 숫자 섬, 도형 섬, 무지개 섬, 저울 섬을 탐험하며 숨겨진 규칙을 찾아요.")
    w.step("① 그림 살펴보기", "정사각형 길이의 수가 이어지는 방법")
    w.pic(shell_svg(), 120, 50)
    assert 2 + 3 == 5 and 3 + 5 == 8
    w.fill(["5는 바로 앞의 두 수 (      )와 (      )을 더한 수예요.", "8은 바로 앞의 두 수 (      )과 (      )를 더한 수예요."])
    w.text("규칙이 있는 것이면 ○, 아니면 ×에 표시해 보세요.")
    w.choices(OX(["횡단보도의 흰 줄과 검은 줄", "엘리베이터의 층 단추 번호", "바람에 흩어진 나뭇잎", "교실 시간표의 요일 차례"]))
    w.step("② 똑똑! 무엇을 배울까요", "어느 섬에서 만날까요?")
    isl = "( 숫자 섬 / 도형 섬 / 무지개 섬 / 저울 섬 )"
    cards = [("양쪽 접시에 같은 무게의 조각을 올린 저울", 3), ("벽돌을 계단처럼 한 층씩 더 쌓은 모양", 1), ("곱셈식 3×9, 3×99, 3×999", 2),
             ("가로로 1000씩 커지는 번호판", 0), ("뺄셈식 121−11, 122−12, 123−13", 2)]
    w.choices([(t, isl) for t, _ in cards])
    names = ["숫자 섬", "도형 섬", "무지개 섬", "저울 섬"]
    w.step("③ 그림 보며 이야기하기", "뺄셈식과 나눗셈식의 배열")
    seq_block(w, "무지개 위 뺄셈식", ["빼지는 수", "빼는 수", "차"], R6SUB)
    seq_block(w, "사다리 위 나눗셈식", ["나누어지는 수", "나누는 수", "몫"], R6DIV)
    w.choices([("뺄셈식들의 같은 점은?", "( 차가 모두 110 / 빼는 수가 모두 같아요 )"),
               ("몫 1, 11, 111, 1111은 어떻게 변하나요?", "( 1이 1개씩 늘어나요 / 10씩 커져요 / 2배가 돼요 )")])
    w.step("④ 곰곰! 배운 내용을 떠올려요", "2학년 때 배운 곱셈표")
    g = grid_block(w, H_MULT, D, [(0, 0, '→'), (0, 0, '↓')])
    b = blank_asks(w, H_MULT)
    w.step("⑤ 생각 나누기", "내 생각 쓰기")
    a5 = write2(w, D, [("생활 속에서 규칙을 알면 편리했던 때를 떠올려 써 보세요.", "", "달력의 규칙을 알아서 다음 주 같은 요일의 날짜를 바로 알았어요"),
                       ("네 섬 가운데 가장 먼저 가 보고 싶은 섬과 그 까닭을 써 보세요.", "", "저울 섬에 가서 크기가 같은 두 양을 찾아보고 싶어요")])
    ans = ("1차시  ① 2, 3, 3, 5 / ○ ○ × ○ ② %s ③ 차가 모두 110, 1이 1개씩 늘어나요 ④ %s / %s / %s ⑤ %s"
           % (', '.join(names[k] for _, k in cards), g[0], g[1], b, a5))
    w.step("⑥ 도전하기", "그림 속 규칙을 이어 가기")
    w.ask("암모나이트 정사각형의 한 변의 길이 1, 2, 3, 5, 8 다음에 올 수는? (앞의 두 수를 더해요)")
    w.ask("1×3=3, 11×3=33, 111×3=333, 1111×3=3333 다음 식 11111×3의 곱은?")
    assert 11111 * 3 == 33333 and 5 + 8 == 13
    w.why("11111×3의 곱을 계산하지 않고 알 수 있는 까닭을 써 보세요.")
    ans += " ⑥ 13, 33333, 왜: (예: 곱해지는 수의 1이 1개 늘어나면 곱의 3도 1개 늘어나요)"
    return ans


def h_tb_l2(w, D):
    w.lesson(2, "개념 구축하기(O)", "수의 배열에서 규칙을 찾아볼까요", "수의 배열에서 규칙을 어떻게 찾을 수 있을까요?",
             "숫자 섬 입구 바닥에 수의 배열이 나타났어요.")
    A = [[3405 + 10 * c - 100 * r for c in range(4)] for r in range(4)]
    w.step("① 만져 보기", "숫자 섬 두 번째 문의 수의 배열")
    w.text("한 방향을 골라 수를 따라가며 규칙을 찾아 써 보세요.")
    g1 = grid_block(w, A, D, [(0, 0, '→'), (0, 2, '↓'), None])
    B = [[5, 10, 20, 40], [15, 30, ('㉠', 60), 120], [45, 90, 180, 360], [135, 270, 540, ('㉡', 1080)]]
    w.step("② 그려 보기", "몇 배씩 커지는 수의 배열")
    w.text("가로와 세로의 규칙이 서로 달라요. 규칙을 찾고 빈칸의 수를 구해 보세요.")
    g2 = grid_block(w, B, D, [(0, 0, '→'), (0, 1, '↓')])
    b2 = blank_asks(w, B)
    w.step("③ 말해 보기", "보물 상자 번호")
    C = [["%d층 %d" % (r, 401 + 2 * c) for c in range(4)] for r in range(1, 5)]
    C[0][3], C[1][1] = "㉠", "㉡"
    w.table(C, header=False)
    w.choices([("가로(→) 방향의 규칙은?", "( 층은 그대로, 수는 2씩 커져요 / 층은 바뀌고, 수는 그대로예요 )"),
               ("세로(↓) 방향의 규칙은?", "( 층은 1층, 2층, 3층, 4층으로 바뀌고 수는 그대로예요 / 층은 그대로, 수는 2씩 커져요 )")])
    w.fill("㉠ (              )      ㉡ (              )")
    w.step("④ 약속하기", "수의 배열에서 규칙 찾기")
    w.fill(["수의 배열의 규칙은 가로와 세로뿐 아니라 (            ) 방향으로도 찾을 수 있어요.",
            "이웃한 수의 차가 일정하면 몇씩 (                ), 일정하지 않으면 몇 (            )를 살펴봐요."])
    E = [[7350 - 100 * c - 10 * r for c in range(4)] for r in range(4)]
    E[1][2] = ('㉠', E[1][2])
    E[3][1] = ('㉡', E[3][1])
    w.step("⑤ 확인하기", "익힘책 문제 ― 작아지는 배열")
    g5 = grid_block(w, E, D, [(0, 0, '→'), (0, 1, '↓')])
    b5 = blank_asks(w, E)
    ans = ("2차시  ① %s / %s / (예: %s) ② %s / %s / %s ③ 층은 그대로·수는 2씩 커져요, 층은 1층·2층·3층·4층으로 바뀌고 수는 그대로예요, ㉠ 1층 407, ㉡ 2층 403 "
           "④ 대각선, 커지거나 작아지는지, 배가 되는지 ⑤ %s / %s / %s"
           % (g1[0], g1[1], free_rule(A), g2[0], g2[1], b2, g5[0], g5[1], b5))
    F = [[256, 128, 64, ('★', 32), 16, ('▲', 8)]]
    w.step("⑥ 도전하기", "→ 방향의 수의 배열")
    w.table(grid_table(F), header=False)
    assert rules_of([256, 128, 64, 32, 16, 8]) == [('part', 2)]
    w.fill("규칙: 256부터 → 방향으로 (                              )      ★ (        )   ▲ (        )")
    w.why("이 배열의 규칙을 덧셈이나 뺄셈으로 말하기 어려운 까닭을 써 보세요.", 1)
    ans += " ⑥ 1/2만큼이 돼요, ★ 32, ▲ 8, 왜: 이웃한 두 수의 차가 128, 64, 32로 일정하지 않아요"
    return ans


def h_tb_l3(w, D):
    w.lesson(3, "개념 구축하기(O)", "수의 배열에서 규칙을 찾아 식으로 나타내어 볼까요", "수의 배열에서 찾은 규칙을 어떻게 식으로 나타낼 수 있을까요?",
             "‘숫자 섬을 탈출하려면 화면에 나타난 수의 배열에서 규칙을 찾아 식으로 나타내어야 합니다.’")
    R = [[12 + 5 * c + 8 * r for c in range(6)] for r in range(4)]
    w.step("① 만져 보기", "두 번째 화면의 수의 배열")
    g1 = grid_block(w, R, D, [(0, 0, '→'), (0, 0, '↓')])
    w.step("② 그려 보기", "방향을 정해 식 쓰기")
    e1 = eq_frames(w, D, "세로(↓) 방향의 규칙을 이웃한 두 수로 덧셈식 2개로 나타내어 보세요.", [r[0] for r in R], '+')
    e2 = eq_frames(w, D, "가로(←) 방향(오른쪽에서 왼쪽으로)의 규칙을 이웃한 두 수로 뺄셈식 2개로 나타내어 보세요.", R[0][::-1], '-')
    w.step("③ 말해 보기", "5배씩 커지는 수")
    S = [2, 10, 50, 250, 1250, 6250]
    w.table([[str(x) for x in S]], header=False)
    w.choices([("2부터 → 방향의 규칙은?", "( 8씩 커져요 / 5배가 돼요 / 5씩 커져요 )")])
    e3 = eq_frames(w, D, "2부터 오른쪽으로 가는 규칙을 곱셈식 2개로 써 보세요.", S, '×')
    e4 = eq_frames(w, D, "6250부터 왼쪽으로 가는 규칙을 나눗셈식 2개로 써 보세요.", S[::-1], '÷')
    w.step("④ 약속하기", "규칙을 식으로 나타내기")
    w.fill(["같은 배열이라도 (            )을 반대로 하면 덧셈식이 뺄셈식으로, 곱셈식이 (              )으로 바뀌어요.",
            "식으로 나타낼 때는 이웃한 두 수와 그 사이에서 (              ) 수를 함께 써요."])
    w.step("⑤ 확인하기", "나선 모양 수의 배열 ― 다른 칸 찾기")
    sp = [x if i not in (7, 12) else (('㉠', x) if i == 7 else ('㉡', x)) for i, x in enumerate(R6SP)]
    w.text("2부터 나선을 따라 수가 놓여 있어요. 같은 방향으로 이웃한 수를 살펴 ㉠과 ㉡에 알맞은 수를 구해 보세요.")
    w.pic(spiral_svg(sp), 100, 92)
    assert R6SP[3::4] == [8, 16, 24, 32] and R6SP[0::4] == [2, 10, 18, 26]
    w.fill("㉠ (        )   ㉡ (        )    ㉡을 구한 규칙: (                                        )")
    ans = ("3차시  ① %s / %s ② %s / %s ③ 5배가 돼요, %s / %s ④ 방향, 나눗셈식, 변하는(늘거나 주는) "
           "⑤ ㉠ 16(8부터 ↑ 방향으로 8씩 커져요), ㉡ 26(2부터 → 방향으로 8씩 커져요)"
           % (g1[0], g1[1], ', '.join(e1), ', '.join(e2), ', '.join(e3), ', '.join(e4)))
    w.step("⑥ 도전하기", "여러 가지 식으로 나타내기")
    w.write("나선 위 수의 배열에서 한 방향의 규칙을 이웃한 두 수로 식 2개로 나타내어 보세요.", 1)
    w.ask("4, 12, 36, 108, 324의 → 방향 규칙을 곱셈식으로 나타내어 보세요.")
    w.why("같은 배열의 규칙을 덧셈식으로도, 뺄셈식으로도 나타낼 수 있는 까닭을 써 보세요.", 1)
    ans += " ⑥ (예: 2+8=10, 10+8=18 / 2+2=4) / %s / 왜: (예: 방향을 반대로 하면 커지는 규칙이 작아지는 규칙이 돼요)" % pairs_of([4, 12, 36], '×', 1)[0]
    return ans


def h_tb_l4(w, D):
    w.lesson(4, "개념 구축하기(O)", "도형의 배열에서 규칙을 찾아볼까요", "도형의 배열에서 모양과 수는 어떻게 변할까요?",
             "‘도형 섬으로 가고 싶다면 도형의 배열에서 비밀을 알아내세요.’ 하늘 위로 사각형으로 만든 모양이 떠올랐어요.")
    w.step("① 만져 보기", "세 줄로 늘어나는 사각형")
    w.pic(shape_svg('rect3', [1, 2, 3, 4]), 150, 45)
    c1 = counts_table(w, 'rect3', [1, 2, 3, 4], '사각형', blanks=(2, 3, 4))
    w.step("② 그려 보기", "여섯째 모양 그리기")
    draw_next(w, 'rect3', 6, 110, 50)
    w.choices([("모양은 어떻게 변하나요?", "( 세로 3개는 그대로, 가로가 1개씩 늘어나요 / 세로가 1개씩 늘어나요 )"),
               ("사각형은 몇 개씩 달라지나요?", "( 3개씩 늘어나요 / 1개씩 늘어나요 / 3배가 돼요 )")])
    w.ask("여덟째 모양의 사각형은 몇 개인가요?")
    w.step("③ 말해 보기", "바둑돌로 만든 계단 모양")
    w.pic(shape_svg('coinOdd', [1, 2, 3, 4], kind='stone', u=20), 140, 55)
    c3 = counts_table(w, 'coinOdd', [1, 2, 3, 4], '바둑돌', blanks=(3, 4))
    w.fill("늘어난 바둑돌:  첫째→둘째 (    )개,  둘째→셋째 (    )개,  셋째→넷째 (    )개")
    w.ask("여섯째 모양에 필요한 바둑돌은 몇 개인가요?")
    w.step("④ 약속하기", "도형의 배열에서 규칙 찾기")
    w.fill(["다음 모양을 알려면 앞 모양에 도형이 (          )에 몇 개 붙는지 살펴봐요.",
            "늘어나는 수가 늘 같은 배열도 있고, 늘어나는 수가 (            ) 커지는 배열도 있어요."])
    w.step("⑤ 확인하기", "십자 모양의 배열")
    w.pic(shape_svg('plus', [1, 2, 3, 4], mystery=7, u=16), 165, 62)
    w.choices([("십자 모양의 사각형의 수는 어떻게 변하나요?", "( 4개씩 늘어나요 / 2개씩 늘어나요 / 4배가 돼요 )"),
               ("‘다음 모양’은 몇째에 알맞은 모양인가요?", "( 여섯째 / 일곱째 / 여덟째 )")])
    assert [cnt('plus', n) for n in (1, 2, 3, 4, 7)] == [1, 5, 9, 13, 25] and cnt('rect3', 8) == 24 and cnt('coinOdd', 6) == 36
    ans = ("4차시  ① %s ② 세로 3개는 그대로·가로가 1개씩 늘어나요, 3개씩, 24개(가로 8개, 세로 3줄) ③ %s, 3개·5개·7개, 36개 "
           "④ 어디, 점점 ⑤ 4개씩, 일곱째(사각형 25개)" % (c1, c3))
    w.step("⑥ 도전하기", "익힘책 ― 사각형으로 만든 모양")
    w.pic(shape_svg('gamma', [1, 2, 3, 4], anchor='top'), 140, 55)
    c6 = counts_table(w, 'gamma', [1, 2, 3, 4], '사각형', blanks=(3, 4))
    w.ask("사각형은 몇 개씩 늘어나나요?")
    w.why("여섯째 모양의 사각형이 몇 개인지 규칙으로 구하고, 그렇게 구한 까닭을 써 보세요.", 1)
    ans += " ⑥ %s, 2개, 여섯째 %d개 왜: 1개부터 아래쪽과 오른쪽으로 1개씩, 모두 2개씩 늘어나요" % (c6, cnt('gamma', 6))
    return ans


def h_tb_l5(w, D):
    w.lesson(5, "개념 구축하기(O)", "도형의 배열에서 규칙을 찾아 식으로 나타내어 볼까요", "도형의 배열에서 찾은 규칙을 어떻게 식으로 나타낼 수 있을까요?",
             "‘도형의 배열에서 규칙을 찾아야 문이 열릴 것 같아.’ 도형 섬을 나가는 거대한 문에 배열이 나타났어요.")
    w.step("① 만져 보기", "두 칸씩 내려가는 계단")
    w.pic(shape_svg('stair2', [1, 2, 3, 4], layers=True, anchor='top'), 150, 55)
    c1 = counts_table(w, 'stair2', [1, 2, 3, 4], '사각형', blanks=(2, 3, 4))
    w.choices([("사각형은 몇 개씩 달라지나요?", "( 3개부터 2개씩 늘어나요 / 2개부터 3개씩 늘어나요 / 2배가 돼요 )")])
    draw_next(w, 'stair2', 6, 100, 60)
    w.step("② 그려 보기", "사각형의 수를 덧셈식으로")
    ex = {1: '3', 2: '3+2', 3: '3+2+2', 4: '3+2+2+2', 5: '3+2+2+2+2'}
    for n in range(1, 6):
        assert eval(ex[n]) == cnt('stair2', n)
    e2 = expr_table(w, [1, 2, 3, 4, 5], ex, blanks=(2, 3, 4, 5))
    w.step("③ 말해 보기", "모형으로 만든 직사각형")
    w.text("같은 색은 앞 모양에서 새로 늘어난 모형이에요.")
    w.pic(shape_svg('rectP', [1, 2, 3, 4], kind='mod', layers=True), 150, 55)
    exm = {1: '3', 2: '3+5', 3: '3+5+7', 4: '3+5+7+9', 5: '3+5+7+9+11'}
    for n in range(1, 6):
        assert eval(exm[n]) == cnt('rectP', n)
    e3 = expr_table(w, [1, 2, 3, 4, 5], exm, blanks=(2, 3, 4, 5))
    w.step("④ 약속하기", "도형의 배열을 식으로")
    w.fill(["늘어나는 모양을 차례로 더하면 (          )으로, 가로 몇 개씩 몇 줄인지 보면 (          )으로 나타낼 수 있어요.",
            "두 식은 모양이 달라도 같은 도형의 수를 센 것이라 계산 결과가 (          )."])
    w.step("⑤ 확인하기", "(가로)×(세로)의 곱셈식")
    exx = {n: '%d×%d' % (n + 2, n) for n in range(1, 7)}
    e5 = expr_table(w, [1, 2, 3, 4, 5], exx, blanks=(2, 3, 5))
    w.choices([("3+5+7+9+11과 7×5의 크기는?", "( 같아요 / 덧셈식이 커요 / 곱셈식이 커요 )")])
    assert eval('3+5+7+9+11') == 7 * 5 == 35 and cnt('stair2', 6) == 13
    ans = ("5차시  ① %s, 3개부터 2개씩, 여섯째 13개(다섯째 아래 오른쪽에 2개) ② %s ③ %s ④ 덧셈식, 곱셈식, 같아요 ⑤ %s, 같아요(35)"
           % (c1, e2, e3, e5))
    w.step("⑥ 도전하기", "여섯째 모양")
    w.pic(shape_svg('rectM', [4, 5], kind='mod'), 90, 45)
    draw_next(w, 'rectM', 6, 90, 55)
    w.ask("여섯째 모양의 모형 수를 곱셈식으로 나타내고, 모두 몇 개인지 구해 보세요.")
    w.why("2+4+6+8+10+12와 7×6의 크기가 같은 까닭을 써 보세요.", 1)
    assert 7 * 6 == 42 == sum(range(2, 13, 2)) == cnt('rectM', 6)
    ans += " ⑥ 7×6=42(개), 왜: 둘 다 여섯째 모양의 모형 수를 센 식이에요(늘어난 수를 더하거나 가로 7개씩 6줄로 세었어요)"
    return ans


def h_tb_l6(w, D):
    w.lesson(6, "개념 구축하기(O)", "덧셈식과 뺄셈식의 배열에서 규칙을 찾아볼까요", "덧셈식과 뺄셈식의 배열에서 어떤 규칙을 찾을 수 있을까요?",
             "무지개 섬에 도착하니 커다란 무지개 위로 덧셈식의 배열이 나타났어요.")
    w.step("① 만져 보기", "두 번째 무지개 위 덧셈식")
    seq_block(w, "두 번째 무지개 덧셈식", ["더해지는 수", "더하는 수", "합"], H_ADD)
    w.pick("이 덧셈식의 배열에서 찾은 규칙은?", ["더해지는 수가 20씩 커지고 더하는 수가 20씩 작아지면 합은 600으로 같아요.",
                                      "더해지는 수와 더하는 수가 모두 20씩 커져요.", "합이 20씩 작아져요."])
    w.step("② 그려 보기", "다음 식 쓰기")
    a1 = seq_block(w, "덧셈식", ["더해지는 수", "더하는 수", "합"], H_ADD + [X('㉠', '□+□=□', [200, 400, 600])])
    a2 = seq_block(w, "두 번째 무지개 뺄셈식", ["빼지는 수", "빼는 수", "차"], H_SUB + [X('㉡', '□-□=□', [355, 55, 300])])
    w.step("③ 말해 보기", "규칙으로 먼저 맞혀 보기")
    L3 = [X('첫째', '77+3=80'), X('둘째', '777+23=800'), X('셋째', '7777+223=8000'), X('넷째', '□+2223=80000', [77777]),
          X('다섯째', '□+□=□', [777777, 22223, 800000])]
    a3 = seq_block(w, "덧셈식 차례", ["더해지는 수", "더하는 수", "합"], L3)
    w.step("④ 약속하기", "계산식의 배열에서 규칙 찾기")
    w.fill(["더하는 두 수 가운데 하나가 커진 만큼 다른 하나가 (            ) 합은 그대로예요.",
            "빼는 두 수가 똑같이 커지면 차는 (            ). 다음 식은 규칙으로 먼저 (            ) 뒤에 계산해서 확인해요."])
    w.step("⑤ 확인하기", "2와 3이 늘어나는 뺄셈식")
    L5 = [X('첫째', '24-3=21'), X('둘째', '244-33=211'), X('셋째', '2444-333=2111'), X('넷째', '24444-3333=21111'),
          X('다섯째', '□-□=□', [244444, 33333, 211111])]
    a5 = seq_block(w, "뺄셈식 차례", ["빼지는 수", "빼는 수", "차"], L5)
    w.choices([("규칙에 따라 차가 2111111이 되는 뺄셈식은 몇째일까요?", "( 다섯째 / 여섯째 / 일곱째 )")])
    assert 2444444 - 333333 == 2111111
    ans = ("6차시  ① ① ② %s, %s ③ %s, %s ④ 작아지면, 그대로예요, 추측한 "
           "⑤ %s, 여섯째(2444444−333333=2111111)" % (a1[0], a2[0], a3[0], a3[1], a5[0]))
    w.step("⑥ 도전하기", "익힘책 ― 빈칸에 알맞은 식")
    b1 = seq_block(w, "덧셈식의 배열", ["더해지는 수", "더하는 수", "합"],
                   [X('', '130+100=230'), X('', '110+120=230'), X('', '90+140=230'), X('', '70+160=230'), X('㉠', '□+□=□', [50, 180, 230])])
    b2 = seq_block(w, "뺄셈식의 배열", ["빼지는 수", "빼는 수", "차"],
                   [X('', '350-150=200'), X('', '400-200=200'), X('', '450-250=200'), X('', '500-300=200'), X('㉡', '□-□=□', [550, 350, 200])])
    b3 = seq_block(w, "덧셈식의 배열", ["더해지는 수", "더하는 수", "합"],
                   [X('첫째', '12+89=101'), X('둘째', '112+889=1001'), X('셋째', '1112+8889=10001'), X('넷째', '11112+88889=100001'),
                    X('다섯째', '□+□=□', [111112, 888889, 1000001])])
    w.why("㉡의 차가 200으로 그대로인 까닭을 써 보세요.", 1)
    ans += " ⑥ %s, %s, %s, 왜: 빼지는 수와 빼는 수가 똑같이 50씩 커지기 때문이에요" % (b1[0], b2[0], b3[0])
    return ans


def h_tb_l7(w, D):
    w.lesson(7, "개념 구축하기(O)", "곱셈식과 나눗셈식의 배열에서 규칙을 찾아볼까요", "곱셈식과 나눗셈식의 배열에서 어떤 규칙을 찾을 수 있을까요?",
             "하늘에서 사다리가 내려왔어요. 사다리 위에 곱셈식과 나눗셈식이 있어요.")
    w.step("① 만져 보기", "두 번째 사다리 위 곱셈식")
    a1 = seq_block(w, "두 번째 사다리 곱셈식", ["곱해지는 수", "곱하는 수", "곱"], H_MUL + [X('㉠', '□×□=□', [11111, 7, 77777])])
    w.pick("이 곱셈식의 배열에서 찾은 규칙은?", ["곱해지는 수의 1이 1개씩 늘어나면 곱의 7도 1개씩 늘어나요.", "곱하는 수가 7씩 커져요.", "곱이 7배씩 커져요."])
    w.step("② 그려 보기", "두 번째 사다리 위 나눗셈식")
    a2 = seq_block(w, "두 번째 사다리 나눗셈식", ["나누어지는 수", "나누는 수", "몫"], H_DIV + [X('㉡', '□÷□=□', [44444, 4, 11111])])
    w.step("③ 말해 보기", "규칙으로 먼저 맞혀 보기")
    a3 = seq_block(w, "곱셈식 차례", ["곱해지는 수", "곱하는 수", "곱"],
                   [X('첫째', '5×9=45'), X('둘째', '5×99=495'), X('셋째', '5×999=4995'), X('넷째', '5×9999=□', [49995]), X('다섯째', '□×□=□', [5, 99999, 499995])])
    w.step("④ 약속하기", "곱셈식과 나눗셈식의 배열")
    w.fill(["곱하는 수에 9가 1개 늘어나면 곱에서도 (          ) 사이에 9가 1개 늘어나요.",
            "나누어지는 수의 4가 1개씩 늘어나면 몫의 (          )도 1개씩 늘어나요. 추측한 결과는 (            )로 확인해요."])
    w.step("⑤ 확인하기", "2와 1이 늘어나는 나눗셈식")
    a5 = seq_block(w, "나눗셈식 차례", ["나누어지는 수", "나누는 수", "몫"],
                   [X('첫째', '21÷3=7'), X('둘째', '2211÷33=67'), X('셋째', '222111÷333=667'), X('넷째', '22221111÷3333=6667'),
                    X('다섯째', '□÷□=□', [2222211111, 33333, 66667])])
    w.choices([("규칙에 따라 몫이 666667이 되는 나눗셈식은 몇째일까요?", "( 다섯째 / 여섯째 / 일곱째 )")])
    assert 222222111111 // 333333 == 666667 and 222222111111 % 333333 == 0
    ans = ("7차시  ① %s, ① ② %s ③ %s, %s ④ 4와 5, 1, 계산기 ⑤ %s, 여섯째(222222111111÷333333=666667)"
           % (a1[0], a2[0], a3[0], a3[1], a5[0]))
    w.step("⑥ 도전하기", "익힘책 ― 빈칸의 식과 잘못 설명한 사람")
    b1 = seq_block(w, "나눗셈식의 배열", ["나누어지는 수", "나누는 수", "몫"],
                   [X('', '200÷2=100'), X('', '300÷3=100'), X('', '400÷4=100'), X('', '500÷5=100'), X('㉡', '□÷□=□', [600, 6, 100])])
    b2 = seq_block(w, "곱셈식의 배열", ["곱해지는 수", "곱하는 수", "곱"],
                   [X('첫째', '105×6=630'), X('둘째', '1005×6=6030'), X('셋째', '10005×6=60030'), X('넷째', '□×□=□', [100005, 6, 600030])])
    seq_block(w, "나눗셈식의 배열", ["나누어지는 수", "나누는 수", "몫"],
              [X('첫째', '721÷7=103'), X('둘째', '7021÷7=1003'), X('셋째', '70021÷7=10003'), X('넷째', '700021÷7=100003')])
    w.text("지혜: “나누어지는 수는 7과 2 사이에 0이 1개씩 늘어나고 몫은 1과 3 사이에 0이 1개씩 늘어나.”")
    w.text("은솔: “다섯째에 알맞은 나눗셈식은 7000021÷7=100003이야.”")
    w.choices([("잘못 설명한 사람은?", "( 지혜 / 은솔 )")])
    w.why("잘못 설명한 사람의 식을 바르게 고쳐 써 보세요.", 1)
    assert 7000021 // 7 == 1000003
    ans += " ⑥ %s, %s, 은솔, 왜: 다섯째는 7000021÷7=1000003이에요(몫의 0도 5개)" % (b1[0], b2[0])
    return ans


def h_tb_l8(w, D):
    w.lesson(8, "개념 구축하기(O)", "크기가 같은 두 양의 관계를 식으로 나타내어 볼까요", "크기가 같은 두 양의 관계를 어떻게 식으로 나타낼 수 있을까요?",
             "저울 섬에 도착했어요. 왼쪽 접시 가에는 모양 조각 10개, 오른쪽 접시 나에는 모양 조각 12개가 있어요. 모양 조각 하나의 무게는 모두 같아요.")
    w.step("① 만져 보기", "다른 저울 ― 식 9−2=13−6이 옳은지 확인하기")
    w.text("두 번째 저울에는 가에 9개, 나에 13개가 있어요.")
    w.pic(balance_svg(9, 13), 120, 50)
    w.text("가에서 2개, 나에서 6개를 덜어 내도록 조각에 × 표시해 보세요.")
    w.fill("가에 남은 조각 (      )개,  나에 남은 조각 (      )개")
    assert 9 - 2 == 13 - 6
    w.choices([("두 번째 저울은 어떻게 되나요?", "( 수평 / 가 쪽으로 기울어요 / 나 쪽으로 기울어요 )"), ("식 9−2=13−6은 옳은가요?", "( 옳아요 / 옳지 않아요 )")])
    w.step("② 그려 보기", "두 번째 저울로 등호를 사용한 식 만들기")
    assert 9 - 3 == 13 - 7 and 9 - 4 == 13 - 8
    w.fill(["9 − 3 = 13 − □     □ = (        )", "9 − □ = 13 − 8     □ = (        )"])
    w.step("③ 말해 보기", "초콜릿 접시 ― 15개씩 담아요")
    w.pic(plates_svg([(5, 10), (6, 9), (13, 2), (14, 1)]), 170, 45)
    w.text("위 접시처럼 빈 접시 두 개를 색칠해 4 + 11 = □ + □ 의 식을 2개 만들어 보세요.")
    w.pic(plates_svg([(None, None), (None, None)]), 110, 40)
    w.fill("4 + 11 = (      ) + (      ),      4 + 11 = (      ) + (      )")
    w.choices([("파란색 초콜릿이 1개 줄면 빨간색 초콜릿은?", "( 1개 늘어요 / 1개 줄어요 / 그대로예요 )")])
    w.step("④ 약속하기", "등호(=)")
    w.fill("7+5=6+6, 9−2=10−3, 2×9=3×6에서 =는 왼쪽과 오른쪽의 (                )는 것을 나타내요. 이 기호를 (            )라고 해요.")
    w.step("⑤ 확인하기", "크기가 같은 두 양을 등호로")
    w.text("보기: 36 + 24 = 30 × 2.  계산하기보다 수의 변화를 살펴 크기가 같은 두 양을 찾아 등호로 이어 보세요.")
    w.table([["45 + 25", "72 − 18", "70 − 16", "40 + 30"]], header=False)
    w.fill("(            ) = (            ),     (            ) = (            )")
    check_pairs([("36+24", "30×2"), ("45+25", "40+30"), ("72-18", "70-16")])
    ans = ("8차시  ① 7개, 7개, 수평, 옳아요 ② 7, 4 ③ (예) 4+11=3+12, 4+11=8+7, 1개 늘어요 ④ 크기가 같다, 등호 "
           "⑤ 45+25=40+30, 72−18=70−16")
    w.step("⑥ 도전하기", "참일까요, 거짓일까요?")
    eqs = ["4+5=9", "12-5=9", "7=3+4", "8+2=10+4", "7+4=15-4", "8=8"]
    w.choices([(pretty(e), '( 참 / 거짓 )') for e in eqs])
    tf = ['참' if eq_ok(e) else '거짓' for e in eqs]
    nums = [("7+4+5=7+□", 9), ("2+15=5+□", 12), ("83-30=□-10", 63)]
    for e, a in nums:
        assert eq_ok(fill_box(e, [a]))
    w.fill('   '.join(show(e, '(      )') for e, _ in nums))
    w.why("12−5=9가 거짓인 까닭을 등호의 뜻을 넣어 써 보세요.", 1)
    ans += " ⑥ %s / 9, 12, 63(★) / 왜: 등호 양쪽의 크기가 같아야 하는데 12−5는 7이라 9와 크기가 달라요" % ', '.join(tf)
    return ans


def h_tb_l9(w, D):
    w.lesson("9~10", "탐구 정리하기(O)", "생각을 더하다 ― 규칙적으로 모아 기부해 볼까요",
             "규칙을 찾아 식으로 나타내면 모은 금액을 어떻게 쉽게 구할 수 있을까요?",
             "“은지는 100원부터 시작하여 매일 200원씩 늘려가며 저금한 금액을 기부하려고 합니다. 10일 동안 저금하였을 때, 은지가 모은 금액은 모두 얼마인지 구해 봅시다.”")
    w.step("① 이해해요", "날마다 저금한 금액 살펴보기")
    w.choices([("첫째 날 저금한 금액은?", "( 100원 / 200원 / 300원 )"), ("다섯째 날 저금한 금액은?", "( 500원 / 900원 / 1000원 )"),
               ("열째 날 저금한 금액은?", "( 1000원 / 1900원 / 2000원 )")])
    assert 100 + 200 * 4 == 900 and 100 + 200 * 9 == 1900
    w.step("② 계획해요", "어떻게 해결할까요?")
    w.pick("10일 동안 모은 금액을 빠르게 구하는 방법으로 알맞은 것은?", ["동전 수를 덧셈식으로 나타내고, 동전을 옮겨 정사각형을 만들어 곱셈으로 구해요.",
                                                      "열째 날 저금한 금액에 10을 곱해요."])
    w.ask("셋째 날 저금한 금액은 100원짜리 동전으로 몇 개인가요?")
    w.step("③ 해결해요 ①", "다섯째 날까지 동전을 줄지어 놓기")
    w.pic(coins_svg([1, 3, 5, 7, 9]), 120, 50)
    ex = {1: '1', 2: '1+3', 3: '1+3+5', 4: '1+3+5+7', 5: '1+3+5+7+9'}
    e3 = expr_table(w, [1, 2, 3, 4, 5], ex, blanks=(2, 4, 5))
    w.step("④ 해결해요 ②", "동전을 옮겨 덧셈을 곱셈으로")
    w.text("넷째 줄까지의 동전을 옮겨 정사각형을 만들어 모눈에 그려 보세요.")
    w.pic(pair_svg(coins_svg([1, 3, 5, 7], label=False), paper_svg(5, 7, 30, title='옮긴 모양')), 120, 50)
    w.fill("1 + 3 + 5 + 7 = (              )       1 + 3 + 5 + 7 + 9 = (              )")
    w.ask("열째 날에 저금한 100원짜리 동전은 몇 개인가요?")
    w.ask("1+3+5+…+19를 곱셈식으로 나타내어 보세요.")
    w.ask("은지가 10일 동안 모은 금액은 모두 얼마인가요?")
    coins = [1 + 2 * i for i in range(10)]
    assert coins[-1] == 19 and sum(coins) == 100 and sum(coins[:5]) == 25
    w.step("⑤ 되돌아봐요", "해결한 과정 돌아보기")
    a5 = write2(w, D, [("‘열째 날 금액에 10을 곱하는’ 방법이 틀린 까닭을 써 보세요.", "", "날마다 저금한 금액이 달라서 1900원씩 10번 모은 것이 아니에요"),
                       ("같은 규칙으로 12일 동안 저금하면 모두 얼마가 되는지 구하는 방법을 써 보세요.", "", "동전이 1+3+…+23개이므로 12×12=144(개), 14400원이에요")])
    assert sum(1 + 2 * i for i in range(12)) == 144
    ans = ("9~10차시  ① 100원, 900원, 1900원 ② ①, 5개 ③ %s ④ 4×4, 5×5, 19개, 10×10, 10000원 ⑤ %s" % (e3, a5))
    w.step("⑥ 도전하기", "척척! 내 힘으로 풀어요")
    w.text("준호는 200원부터 시작하여 매일 200원씩 늘려가며 10일 동안 저금했어요. 100원짜리 동전은 2개, 4개, 6개, 8개, ...로 늘어나요.")
    w.pic(coins_svg([2, 4, 6, 8]), 110, 45)
    w.fill("2 + 4 + 6 + 8 = (    ) × (    )      열째까지 = (    ) × (    )")
    w.ask("준호가 10일 동안 모은 금액은 모두 얼마인가요?")
    w.why("동전을 옮기면 정사각형이 아니라 직사각형이 되는 까닭을 써 보세요.", 1)
    c2 = [2 * (i + 1) for i in range(10)]
    assert sum(c2[:4]) == 5 * 4 and sum(c2) == 11 * 10 == 110
    ans += " ⑥ 5×4, 11×10=110(개), 11000원, 왜: 은지보다 날마다 1개씩 더 많아 한 줄이 줄 수보다 1개 많아요"
    return ans


def h_tb_l11(w, D):
    w.lesson(11, "발표하기(P)", "놀이를 더하다 ― 내 짝을 찾아라!", "크기가 같은 두 양을 어떻게 빨리 찾을 수 있을까요?",
             "뒤집은 카드 2장의 크기가 같으면 등호를 사용한 식을 완성할 수 있어요. 2명이 하는 놀이예요.")
    w.step("① 놀이 방법 알기", "놀이의 차례를 번호로 쓰기")
    o1 = h_order(w)
    w.step("② 문제 카드 완성하기", "왼쪽과 크기가 같은 다른 식을 만들어요(두 자리 수까지)")
    cards = [("8+15", "+", "9+14"), ("17-6", "-", "18-7"), ("11+9", "+", "12+8"), ("2×12", "×", "4×6")]
    for l, _, e in cards:
        assert eq_ok(l + '=' + e)
    w.fill(['%s = (      ) %s (      )' % (pretty(l + '=0').split(' = ')[0], {'+': '+', '-': '−', '×': '×'}[op]) for l, op, _ in cards])
    w.step("③ 놀이하기", "새 카드 16장에서 짝 찾기")
    m = match_block(w, D, H_PAIRS, 'tb11h')
    w.step("④ 정리하기", "빨리 찾는 방법")
    w.fill("짝을 찾을 때는 두 식에서 (          ) 수끼리 견주어 봐요. 곱셈에서는 한 수가 2배가 되면 다른 수는 (              )이 되어야 크기가 같아요.")
    w.step("⑤ 확인하기", "가져올 수 있을까요?")
    w.choices([("가져올 수 있는 두 카드는?", "( 35+18과 36+17 / 50−14와 51−13 / 8×3과 7×4 )"), ("27+16과 짝이 되는 카드는?", "( 29+14 / 29+18 / 25+16 )")])
    assert eq_ok('35+18=36+17') and not eq_ok('50-14=51-13') and not eq_ok('8×3=7×4') and eq_ok('27+16=29+14')
    ans = ("11차시  ① %s ② (예) 9+14, 18−7, 12+8, 4×6 ③ %s ④ 같은 자리의, 반(1/2) ⑤ 35+18과 36+17, 29+14" % (o1, m))
    w.step("⑥ 도전하기", "카드 20장 ― 어려운 판")
    m2 = match_block(w, D, R6PAIRS2, 'tb11b', cols=5)
    w.why("70−35와 80−45가 짝인 까닭을 계산하지 않고 설명해 보세요.", 1)
    ans += " ⑥ %s, 왜: 빼지는 수와 빼는 수가 똑같이 10만큼 커졌어요" % m2
    return ans


def h_tb_l12(w, D):
    w.lesson(12, "발표하기(P)", "공부한 내용을 확인해요", "규칙과 관계에서 배운 내용을 잘 알고 있나요?",
             "수의 배열과 도형의 배열, 계산식의 배열에서 규칙을 찾고, 크기가 같은 두 양을 등호로 나타내 봐요.")
    S = [3, 6, 12, 24, 48, 96]
    w.step("① 척척! 1번", "커지는 수의 배열을 식으로")
    w.table([[str(x) for x in S]], header=False)
    w.choices([("이 수의 배열에서 → 방향으로 찾을 수 있는 규칙은?", "( 3씩 커져요 / 2배가 돼요 / 1/2만큼이 돼요 )")])
    e1 = eq_frames(w, D, "→ 방향의 규칙을 이웃한 두 수로 곱셈식 2개로 나타내어 보세요.", S, '×')
    w.step("② 척척! 2번", "줄마다 2개씩 더 많은 모양")
    w.pic(shape_svg('coinOdd', [1, 2, 3, 4], layers=True, u=20), 130, 50)
    ex = {1: '1', 2: '1+3', 3: '1+3+5', 4: '1+3+5+7'}
    for n in range(1, 5):
        assert eval(ex[n]) == cnt('coinOdd', n)
    e2 = expr_table(w, [1, 2, 3, 4], ex, blanks=(2, 3, 4))
    w.ask("여섯째 모양의 사각형은 몇 개인가요?")
    w.step("③ 척척! 3번", "등호를 사용한 식 완성하기")
    nums = [("7+9=8+□", 8), ("14+□=24+11", 21), ("16-□=15-4", 5), ("50-18=□-28", 60)]
    for e, a in nums:
        assert eq_ok(fill_box(e, [a]))
    w.fill(['     '.join(show(e, '(      )') for e, _ in nums[:2]), '     '.join(show(e, '(      )') for e, _ in nums[2:])])
    w.step("④ 척척! 4번", "여섯째 식 쓰기")
    a1 = seq_block(w, "덧셈식 차례", ["더해지는 수", "더하는 수", "합"],
                   [X(ORD[i + 1], '%d+237=%d' % (423 + 100 * i, 660 + 100 * i)) for i in range(5)] + [X('여섯째', '□+□=□', [923, 237, 1160])])
    a2 = seq_block(w, "뺄셈식 차례", ["빼지는 수", "빼는 수", "차"],
                   [X(ORD[i + 1], '%d-%d=152' % (376 + 120 * i, 224 + 120 * i)) for i in range(5)] + [X('여섯째', '□-□=□', [976, 824, 152])])
    w.step("⑤ 꼭꼭! 확인하고 정리해요", "□를 구해 글자 칸 색칠하기")
    w.text("① 2, 6, 18, □, 162, □     ② 85−60=25, 95−70=25, 105−80=25, 115−□=25     ③ 13÷1=13, 26÷2=13, 39÷3=13, □÷4=13")
    tiles = [[54, "규"], [64, "관"], [486, "칙"], [476, "계"], [90, "발"], [80, "등"], [52, "견"], [42, "호"]]
    w.table([[str(t[0]) for t in tiles], [t[1] for t in tiles]], header=False)
    w.fill("□ :  ① (      ), (      )   ② (      )   ③ (      )      색칠한 글자: (                    )")
    assert [2 * 3 ** i for i in range(6)] == [2, 6, 18, 54, 162, 486] and 115 - 90 == 25 and 52 // 4 == 13
    ans = ("12차시  ① 2배가 돼요, %s ② %s, 36개 ③ %s ④ %s, %s ⑤ 54, 486, 90, 52 → 규칙 발견"
           % (', '.join(e1), e2, ', '.join(str(a) for _, a in nums), a1[0], a2[0]))
    assert cnt('coinOdd', 6) == 36
    w.step("⑥ 도전하기", "나누는 수가 63이 되는 나눗셈식")
    rows = [X(ORD[i + 1], '%d÷%d=12345679' % (111111111 * (i + 1), 9 * (i + 1))) for i in range(5)]
    seq_block(w, "나눗셈식의 배열", ["나누어지는 수", "나누는 수", "몫"], rows)
    w.choices([("나누는 수가 63이 되는 나눗셈식은 몇째일까요?", "( 여섯째 / 일곱째 / 여덟째 )")])
    w.ask("그 나눗셈식을 써 보세요.")
    assert 777777777 // 63 == 12345679 and 777777777 % 63 == 0
    w.why("일곱째라고 생각한 까닭을 써 보세요.", 1)
    ans += " ⑥ 일곱째, 777777777÷63=12345679, 왜: 나누는 수가 9씩 커지고 63은 9의 7배예요"
    return ans


# ---------------------------------------------------------------- 이야기 버전 도전형
H_DEC = [['', '', 1, 2, 3, 4, 5], [6, 7, 8, 9, 10, 11, 12], [13, 14, 15, 16, 17, 18, 19], [20, 21, 22, 23, 24, 25, 26], [27, 28, 29, 30, 31]]


def h_st_l1(w, D):
    w.lesson(1, "개념 찾기(S)", "나눔 저금통 프로젝트를 시작해요", "우리 반 나눔 저금통 프로젝트 속에는 어떤 규칙과 관계가 숨어 있을까요?",
             "4학년 1반은 ‘나눔 저금통’에 규칙적으로 돈을 모아 학기 말에 지역 아동센터에 기부하기로 했어요. 반장 서연, 저금 기록을 맡은 지후, 꾸미기 담당 하은, 동전 탑을 좋아하는 민준, 퀴즈를 내는 다온이가 함께해요.")
    w.step("① 만져 보기 — 보기·생각하기·궁금해하기", "11월에 이어 붙인 12월 나눔 달력(저금통을 여는 날: 3일, 10일, 17일, 24일, 31일)")
    w.table([["일", "월", "화", "수", "목", "금", "토"]] + [[str(x) for x in r] + [''] * (7 - len(r)) for r in H_DEC])
    w.labeled([("보여요", "\n"), ("생각해요", "\n"), ("궁금해요", "\n")], row_h=5600)
    w.ask("저금통을 여는 날은 며칠마다 돌아오나요?")
    w.step("② 그려 보기 — 우리 반 규칙 모으기", "알맞은 상자에 ○표")
    box = "( 수의 배열 / 도형의 배열 / 계산식의 배열 / 크기가 같은 두 양 )"
    cards = [("신발장 번호 2101, 2201, 2301", 0), ("창문에 붙인 별·달·별·달 스티커", 1), ("구슬을 1개, 4개, 9개로 놓은 판", 1),
             ("20×101=2020, 30×101=3030", 2), ("88÷8=11, 888÷8=111", 2), ("양팔 저울에 공책과 연필을 올려 수평 맞추기", 3)]
    names = ["수의 배열", "도형의 배열", "계산식의 배열", "크기가 같은 두 양"]
    w.choices([(t, box) for t, _ in cards])
    w.step("③ 말해 보기 — 곱셈표 떠올리기", "다온이가 새로 붙인 곱셈표의 일부")
    g = grid_block(w, H_MULT, D, [(0, 0, '→'), (0, 3, '↓')])
    b = blank_asks(w, H_MULT)
    a3 = st_why(w, D, "왜 그럴까요? ㉡이 24인 까닭을 가로와 세로 두 방향의 규칙으로 설명해 볼까요?", "",
                "가로로 보면 6부터 6씩 커져서 18 다음은 24이고, 세로로 보면 12부터 4씩 커져서 20 다음은 24예요")
    w.step("④ 약속하기 — 무엇을 배울까요", "이 단원에서 배울 것에 ○표")
    w.choices(OX(["수의 배열에서 규칙을 찾아 다음 수 알아내기", "도형의 배열에서 다음 모양 그리기", "계산식의 배열에서 규칙 찾기",
                  "크기가 같은 두 양을 저울로 알아보기", "저금통에 돈을 가장 많이 넣는 경쟁하기"]))
    w.choices([("‘규칙’이라고 할 수 있는 것은?", "( 같은 방법으로 되풀이되는 것 / 한 번만 우연히 일어나는 것 )")])
    w.step("⑤ 확인하기 — 우리 반 저금 계획")
    a5 = write2(w, D, [("나눔 저금통 프로젝트에서 내가 맡고 싶은 일과 그 까닭을 써 보세요.", "", "저금 기록을 맡아 날마다 모인 돈의 규칙을 찾아보고 싶어요"),
                       ("모은 돈을 기부하기 전에 꼭 확인해야 할 것은 무엇일까요?", "", "모은 금액이 기록한 금액과 같은지 확인해요")])
    ans = ("1차시  ① (예: 저금통을 여는 날이 모두 목요일이에요 / 31일에도 열 수 있어요 / 1월에는 며칠에 열까?), 7일마다 ② %s ③ %s / %s / %s / %s "
           "④ ○ ○ ○ ○ ×, 같은 방법으로 되풀이되는 것 ⑤ %s" % (', '.join(names[k] for _, k in cards), g[0], g[1], b, a3, a5))
    w.step("⑥ 도전하기", "프로젝트 속 규칙을 이어 가기")
    w.ask("민준이는 첫째 날 100원, 둘째 날 300원, 셋째 날 500원을 넣었어요. 같은 규칙이면 넷째 날에는 몇 원을 넣을까요?")
    w.ask("11월 달력에서 9일 바로 아래 칸의 날짜는 며칠인가요?")
    assert R6S_CAL[2][1] == 16
    w.why("달력에서 바로 아래 칸의 날짜가 7만큼 큰 까닭을 써 보세요.", 1)
    ans += " ⑥ 700원, 16일, 왜: 한 줄에 일주일(7일)이 있어서 아래 칸은 7일 뒤예요"
    return ans


def h_st_l2(w, D):
    w.lesson(2, "개념 구축하기(O)", "사물함 번호와 나눔 상자 번호 ― 수의 배열에서 규칙 찾기", "수의 배열에서 규칙을 어떻게 찾을 수 있을까요?",
             "서연이가 저금통을 넣어 둘 사물함을 찾고 있어요.")
    A = [[2408 + 10 * c - 100 * r for c in range(4)] for r in range(4)]
    w.step("① 만져 보기 — 옆 반 사물함 번호판")
    a0 = st_why(w, D, "먼저 예상해요. 옆 반 사물함 번호는 어떤 규칙으로 붙어 있을지 예상해 봐요.", "",
                "오른쪽으로 가면 10씩 커지고, 아래로 가면 100씩 작아져요")
    g1 = grid_block(w, A, D, [(0, 0, '→'), (0, 3, '↓'), None])
    B = [[7, 14, 28, 56], [21, 42, ('㉠', 84), 168], [63, 126, 252, 504], [189, 378, 756, ('㉡', 1512)]]
    w.step("② 그려 보기 — 몇 배가 되는 배열", "다온이의 두 번째 ‘규칙 수 퍼즐’")
    g2 = grid_block(w, B, D, [(0, 0, '→'), (0, 1, '↓')])
    b2 = blank_asks(w, B)
    w.step("③ 말해 보기 — 요일별 나눔 상자 이름표", "하은이가 요일마다 붙인 이름표")
    days = ["월", "화", "수", "목"]
    C = [["%s %d" % (d, 31 + 5 * c) for c in range(4)] for d in days]
    C[0][3], C[1][1] = "㉠", "㉡"
    w.table(C, header=False)
    w.choices([("가로(→) 방향의 규칙은?", "( 요일은 그대로, 수는 5씩 커져요 / 요일은 바뀌고, 수는 그대로예요 )"),
               ("세로(↓) 방향의 규칙은?", "( 요일은 월·화·수·목 차례로 바뀌고 수는 그대로예요 / 요일은 그대로, 수는 5씩 커져요 )")])
    w.fill("㉠ (              )      ㉡ (              )")
    a3 = st_why(w, D, "왜 그럴까요? 같은 번호판에서 → 방향과 ↓ 방향의 규칙이 다른 까닭은 무엇일까요?", "",
                "번호를 붙일 때 옆으로는 끝자리 수를, 아래로는 백의 자리 수를 바꾸었기 때문이에요")
    w.step("④ 약속하기 — 수의 배열에서 규칙 찾기")
    w.fill(["수의 배열의 규칙은 가로와 세로뿐 아니라 (            ) 방향으로도 찾을 수 있어요.",
            "이웃한 수의 차가 일정하면 몇씩 (                ), 일정하지 않으면 몇 (            )를 살펴봐요."])
    E = [[4300 - 100 * c + 50 * r for c in range(4)] for r in range(4)]
    E[1][2] = ('㉠', E[1][2])
    E[3][1] = ('㉡', E[3][1])
    w.step("⑤ 확인하기 — 우산꽂이 번호표", "떨어진 번호표 ㉠, ㉡")
    g5 = grid_block(w, E, D, [(0, 0, '→'), (0, 1, '↓')])
    b5 = blank_asks(w, E)
    ans = ("2차시  ① %s / %s / %s / (예: %s) ② %s / %s / %s ③ 요일은 그대로·수는 5씩 커져요, 요일은 월·화·수·목으로 바뀌고 수는 그대로예요, ㉠ 월 46, ㉡ 화 36 / %s "
           "④ 대각선, 커지거나 작아지는지, 배가 되는지 ⑤ %s / %s / %s"
           % (a0, g1[0], g1[1], free_rule(A), g2[0], g2[1], b2, a3, g5[0], g5[1], b5))
    F = [[729, 243, 81, ('★', 27), 9, ('▲', 3)]]
    w.step("⑥ 도전하기", "다온이의 → 방향 수 퀴즈")
    w.table(grid_table(F), header=False)
    assert rules_of([729, 243, 81, 27, 9, 3]) == [('part', 3)]
    w.fill("규칙: 729부터 → 방향으로 (                              )      ★ (        )   ▲ (        )")
    w.why("이 배열의 규칙을 덧셈이나 뺄셈으로 말하기 어려운 까닭을 써 보세요.", 1)
    ans += " ⑥ 1/3만큼이 돼요, ★ 27, ▲ 3, 왜: 이웃한 두 수의 차가 486, 162, 54로 일정하지 않아요"
    return ans


def h_st_l3(w, D):
    w.lesson(3, "개념 구축하기(O)", "11월 나눔 달력 ― 수의 배열을 식으로 나타내기", "수의 배열에서 찾은 규칙을 어떻게 식으로 나타낼 수 있을까요?",
             "지후가 11월 나눔 달력을 교실에 붙였어요.")
    w.step("① 만져 보기 — 달력의 대각선 규칙")
    a0 = st_why(w, D, "먼저 예상해요. 달력에서 오른쪽 아래(↘) 칸으로 가면 날짜가 어떻게 변할지 예상해 봐요.", "",
                "아래 칸으로 7, 오른쪽 칸으로 1만큼 커지므로 오른쪽 아래 칸은 8씩 커져요")
    g1 = grid_block(w, R6S_CAL, D, [(0, 0, '↘'), (0, 6, '↙')])
    w.step("② 그려 보기 — 대각선 규칙을 식으로")
    e1 = eq_frames(w, D, "1부터 ↘ 방향의 규칙을 이웃한 두 수로 덧셈식 2개로 나타내어 보세요.", [1, 9, 17, 25], '+')
    e2 = eq_frames(w, D, "22부터 ↗ 방향(왼쪽 아래에서 오른쪽 위로)의 규칙을 이웃한 두 수로 뺄셈식 2개로 나타내어 보세요.", [22, 16, 10, 4], '-')
    w.step("③ 말해 보기 — 5배가 되는 수 카드", "다온이의 새 수 카드")
    S = [3, 15, 75, 375, 1875]
    w.table([[str(x) for x in S]], header=False)
    w.choices([("3부터 → 방향의 규칙은?", "( 12씩 커져요 / 5배가 돼요 / 5씩 커져요 )")])
    e3 = eq_frames(w, D, "3부터 오른쪽으로 가는 규칙을 곱셈식 2개로 써 보세요.", S, '×')
    e4 = eq_frames(w, D, "1875부터 왼쪽으로 가는 규칙을 나눗셈식 2개로 써 보세요.", S[::-1], '÷')
    a3 = st_why(w, D, "왜 그럴까요? 같은 수 카드의 규칙을 곱셈식으로도, 나눗셈식으로도 나타낼 수 있는 까닭은?", "",
                "→ 방향으로는 5배가 되고, ← 방향으로는 1/5만큼이 되어서 5로 나누는 식이 되기 때문이에요")
    w.step("④ 약속하기 — 규칙을 식으로")
    w.fill(["같은 배열이라도 (            )을 반대로 하면 덧셈식이 뺄셈식으로, 곱셈식이 (              )으로 바뀌어요.",
            "식으로 나타낼 때는 이웃한 두 수와 그 사이에서 (              ) 수를 함께 써요."])
    w.step("⑤ 확인하기 — 저금통 뚜껑의 소용돌이", "다른 자리에 떨어진 번호 스티커")
    sp = [x if i not in (7, 12) else (('㉠', x) if i == 7 else ('㉡', x)) for i, x in enumerate(R6S_SP)]
    w.pic(spiral_svg(sp), 100, 92)
    assert R6S_SP[3::4] == [12, 24, 36, 48] and R6S_SP[0::4] == [3, 15, 27, 39]
    w.fill("㉠ (        )   ㉡ (        )    ㉡을 구한 규칙: (                                        )")
    ans = ("3차시  ① %s / %s / %s ② %s / %s ③ 5배가 돼요, %s / %s / %s ④ 방향, 나눗셈식, 변하는(늘거나 주는) "
           "⑤ ㉠ 24(12부터 ↑ 방향으로 12씩 커져요), ㉡ 39(3부터 → 방향으로 12씩 커져요)"
           % (a0, g1[0], g1[1], ', '.join(e1), ', '.join(e2), ', '.join(e3), ', '.join(e4), a3))
    w.step("⑥ 도전하기", "여러 가지 식으로 나타내기")
    w.write("소용돌이 위 수의 배열에서 한 방향의 규칙을 이웃한 두 수로 식 2개로 나타내어 보세요.", 1)
    w.ask("5, 10, 20, 40, 80의 → 방향 규칙을 곱셈식으로 나타내어 보세요.")
    w.why("같은 소용돌이에서 12씩 커지는 규칙과 3씩 커지는 규칙이 함께 있는 까닭을 써 보세요.", 1)
    ans += " ⑥ (예: 3+12=15, 15+12=27 / 3+3=6) / %s / 왜: 소용돌이를 따라가면 3씩, 한 방향으로 한 바퀴 건너뛰면 4개 뒤라 12씩 커져요" % pairs_of([5, 10, 20], '×', 1)[0]
    return ans


def h_st_l4(w, D):
    w.lesson(4, "개념 구축하기(O)", "나눔 게시판 꾸미기 ― 도형의 배열에서 규칙 찾기", "도형의 배열에서 모양과 수는 어떻게 변할까요?",
             "하은이가 나눔 게시판 테두리를 색종이 사각형으로 꾸미고 있어요.")
    w.step("① 만져 보기 — 두 줄 테두리 무늬")
    w.pic(shape_svg('rect2', [1, 2, 3, 4]), 150, 40)
    a0 = st_why(w, D, "먼저 예상해요. 두 줄 무늬는 다음 모양으로 갈 때 사각형이 어떻게 늘어날지 예상해 봐요.", "",
                "세로 2줄은 그대로이고 오른쪽에 한 줄씩 붙어서 사각형이 2개씩 늘어나요")
    c1 = counts_table(w, 'rect2', [1, 2, 3, 4], '사각형', blanks=(2, 3, 4))
    w.step("② 그려 보기 — 여섯째 무늬 만들기")
    draw_next(w, 'rect2', 6, 110, 45)
    w.choices([("모양은 어떻게 변하나요?", "( 세로 2개는 그대로, 가로가 1개씩 늘어나요 / 세로가 1개씩 늘어나요 )"),
               ("사각형은 몇 개씩 달라지나요?", "( 2개씩 늘어나요 / 1개씩 늘어나요 / 2배가 돼요 )")])
    w.ask("아홉째 모양의 사각형은 몇 개인가요?")
    w.step("③ 말해 보기 — 민준이의 동전 계단")
    w.pic(shape_svg('coinOdd', [1, 2, 3, 4], kind='coin', lab='100', u=22), 140, 55)
    c3 = counts_table(w, 'coinOdd', [1, 2, 3, 4], '동전', blanks=(3, 4))
    w.fill("늘어난 동전:  첫째→둘째 (    )개,  둘째→셋째 (    )개,  셋째→넷째 (    )개      여섯째 계단: (      )개")
    a3 = st_why(w, D, "왜 그럴까요? 동전 계단에서 늘어나는 동전의 수가 점점 커지는 까닭은 무엇일까요?", "",
                "새로 놓는 맨 아래 줄이 앞 줄보다 2개씩 더 길어지기 때문이에요(3개, 5개, 7개, ...)")
    w.step("④ 약속하기 — 도형의 배열에서 규칙 찾기")
    w.fill(["다음 모양을 알려면 앞 모양에 도형이 (          )에 몇 개 붙는지 살펴봐요.",
            "늘어나는 수가 늘 같은 배열도 있고, 늘어나는 수가 (            ) 커지는 배열도 있어요."])
    w.step("⑤ 확인하기 — 엑스(X) 모양 스티커")
    w.pic(shape_svg('xcross', [1, 2, 3, 4], mystery=7, u=14), 165, 62)
    w.choices([("엑스 모양의 사각형의 수는 어떻게 변하나요?", "( 4개씩 늘어나요 / 2개씩 늘어나요 / 4배가 돼요 )"),
               ("‘다음 모양’은 몇째에 알맞은 모양인가요?", "( 다섯째 / 여섯째 / 일곱째 )")])
    assert [cnt('xcross', n) for n in (1, 2, 3, 4, 7)] == [1, 5, 9, 13, 25] and cnt('rect2', 9) == 18 and cnt('coinOdd', 6) == 36
    ans = ("4차시  ① %s / %s ② 세로 2개는 그대로·가로가 1개씩 늘어나요, 2개씩, 18개(가로 9개, 세로 2줄) ③ %s, 3개·5개·7개, 36개 / %s "
           "④ 어디, 점점 ⑤ 4개씩, 일곱째(사각형 25개)" % (a0, c1, c3, a3))
    w.step("⑥ 도전하기", "민준이가 만든 ㄴ 모양 배열")
    w.pic(shape_svg('ell', [1, 2, 3, 4]), 130, 50)
    c6 = counts_table(w, 'ell', [1, 2, 3, 4], '사각형', blanks=(3, 4))
    w.ask("사각형은 몇 개씩 늘어나나요?")
    w.why("열째 모양의 사각형이 몇 개인지 규칙으로 구하고, 그렇게 구한 까닭을 써 보세요.", 1)
    ans += " ⑥ %s, 2개, 열째 %d개 왜: 1개부터 위쪽과 오른쪽으로 1개씩, 모두 2개씩 늘어나요(1+2×9)" % (c6, cnt('ell', 10))
    return ans


def h_st_l5(w, D):
    w.lesson(5, "개념 구축하기(O)", "나눔 장터 쿠키 상자 ― 도형의 배열을 식으로 나타내기", "도형의 배열에서 찾은 규칙을 어떻게 식으로 나타낼 수 있을까요?",
             "게시판 아래로 사각형 리본을 계단처럼 붙여 내려가요. 같은 색은 같은 때 붙인 리본이에요.")
    w.step("① 만져 보기 — 세 칸씩 붙이는 리본 계단")
    w.pic(shape_svg('stair3', [1, 2, 3, 4], layers=True, anchor='top'), 150, 55)
    a0 = st_why(w, D, "먼저 예상해요. 이 리본 계단은 어떻게 늘어날지 예상해 봐요.", "", "2개부터 시작해서 한 칸 아래에 3개씩 늘어나요")
    c1 = counts_table(w, 'stair3', [1, 2, 3, 4], '사각형', blanks=(2, 3, 4))
    w.choices([("사각형은 몇 개씩 달라지나요?", "( 2개부터 3개씩 늘어나요 / 3개부터 2개씩 늘어나요 / 3배가 돼요 )")])
    draw_next(w, 'stair3', 6, 100, 60)
    w.step("② 그려 보기 — 리본 수를 덧셈식으로")
    ex = {1: '2', 2: '2+3', 3: '2+3+3', 4: '2+3+3+3', 5: '2+3+3+3+3'}
    for n in range(1, 6):
        assert eval(ex[n]) == cnt('stair3', n)
    e2 = expr_table(w, [1, 2, 3, 4, 5], ex, blanks=(2, 3, 4, 5))
    w.step("③ 말해 보기 — 선물 상자 모형", "같은 색은 앞 상자에서 새로 늘어난 모형")
    w.pic(shape_svg('rectM', [1, 2, 3, 4], kind='mod', layers=True), 150, 55)
    exm = {1: '2', 2: '2+4', 3: '2+4+6', 4: '2+4+6+8', 5: '2+4+6+8+10'}
    for n in range(1, 6):
        assert eval(exm[n]) == cnt('rectM', n)
    e3 = expr_table(w, [1, 2, 3, 4, 5], exm, blanks=(2, 3, 4, 5))
    w.step("④ 약속하기 — 도형의 배열을 식으로")
    w.fill(["늘어나는 모양을 차례로 더하면 (          )으로, 가로 몇 개씩 몇 줄인지 보면 (          )으로 나타낼 수 있어요.",
            "두 식은 모양이 달라도 같은 도형의 수를 센 것이라 계산 결과가 (          )."])
    w.step("⑤ 확인하기 — 가로×세로로 세기")
    exx = {n: '%d×%d' % (n + 1, n) for n in range(1, 7)}
    e5 = expr_table(w, [1, 2, 3, 4, 5], exx, blanks=(2, 3, 5))
    w.choices([("2+4+6+8+10과 6×5의 크기는?", "( 같아요 / 덧셈식이 커요 / 곱셈식이 커요 )")])
    assert eval('2+4+6+8+10') == 30 == 6 * 5 and cnt('stair3', 6) == 17
    a5 = st_why(w, D, "왜 그럴까요? 6×5가 다섯째 선물 상자의 모형 수인 까닭을 설명해 볼까요?", "",
                "다섯째 상자는 가로 6개씩 세로 5줄이라 모형이 6×5=30(개)이에요")
    ans = ("5차시  ① %s / %s, 2개부터 3개씩, 여섯째 17개 ② %s ③ %s ④ 덧셈식, 곱셈식, 같아요 ⑤ %s, 같아요(30) / %s"
           % (a0, c1, e2, e3, e5, a5))
    w.step("⑥ 도전하기", "여섯째 쿠키 상자")
    w.pic(shape_svg('rectP', [4, 5], kind='mod'), 100, 45)
    draw_next(w, 'rectP', 6, 100, 55)
    w.ask("여섯째 상자의 쿠키 수를 곱셈식으로 나타내고, 모두 몇 개인지 구해 보세요.")
    w.why("3+5+7+9+11+13으로 더해도 같은 답이 나오는 까닭을 써 보세요.", 1)
    assert 8 * 6 == 48 == sum(range(3, 14, 2)) == cnt('rectP', 6)
    ans += " ⑥ 8×6=48(개), 왜: 둘 다 여섯째 상자의 쿠키 수를 센 식이에요"
    return ans


def h_st_l6(w, D):
    w.lesson(6, "개념 구축하기(O)", "저금 기록장 ― 덧셈식과 뺄셈식의 배열", "덧셈식과 뺄셈식의 배열에서 어떤 규칙을 찾을 수 있을까요?",
             "서연이와 지후는 날마다 둘이 합쳐 500원을 넣기로 했어요. 지후가 기록장에 식을 적었어요.")
    rows = [X('', '120+380=500'), X('', '140+360=500'), X('', '160+340=500'), X('', '180+320=500')]
    w.step("① 만져 보기 — 둘째 주 기록")
    a0 = st_why(w, D, "먼저 예상해요. 둘째 주에 서연이가 날마다 20원씩 더 넣으면 지후는 어떻게 해야 할까요?", "",
                "합이 500원이 되어야 하므로 지후는 날마다 20원씩 덜 넣어요")
    seq_block(w, "둘째 주에 함께 넣은 돈(원)", ["서연", "지후", "합"], rows)
    w.pick("이 덧셈식의 배열에서 찾은 규칙은?", ["서연이가 넣은 돈이 20원씩 커지면 지후가 넣은 돈은 20원씩 작아지고 합은 500원으로 같아요.",
                                      "두 사람이 넣은 돈이 모두 20원씩 커져요.", "합이 20원씩 작아져요."])
    w.step("② 그려 보기 — 다음 식 쓰기")
    a1 = seq_block(w, "둘째 주에 함께 넣은 돈", ["서연", "지후", "합"], rows + [X('㉠', '□+□=□', [200, 300, 500])])
    a2 = seq_block(w, "하은이의 새 뺄셈식 카드", ["빼지는 수", "빼는 수", "차"],
                   [X('', '715-215=500'), X('', '725-225=500'), X('', '735-235=500'), X('', '745-245=500'), X('㉡', '□-□=□', [755, 255, 500])])
    w.step("③ 말해 보기 — 8과 1이 늘어나는 덧셈식", "규칙으로 먼저 맞혀 보기")
    a3 = seq_block(w, "덧셈식 차례", ["더해지는 수", "더하는 수", "합"],
                   [X('첫째', '88+12=100'), X('둘째', '888+112=1000'), X('셋째', '8888+1112=10000'), X('넷째', '□+11112=100000', [88888]),
                    X('다섯째', '□+□=□', [888888, 111112, 1000000])])
    a3w = st_why(w, D, "왜 그럴까요? 여섯째 식의 합이 몇인지 계산하지 않고 어떻게 알 수 있을까요?", "",
                 "합은 100부터 0이 1개씩 늘어나므로 여섯째 합은 1 뒤에 0이 7개인 10000000이에요")
    w.step("④ 약속하기 — 계산식의 배열")
    w.fill(["더하는 두 수 가운데 하나가 커진 만큼 다른 하나가 (            ) 합은 그대로예요.",
            "빼는 두 수가 똑같이 커지면 차는 (            ). 다음 식은 규칙으로 먼저 (            ) 뒤에 계산해서 확인해요."])
    w.step("⑤ 확인하기 — 7과 4가 늘어나는 뺄셈식")
    a5 = seq_block(w, "뺄셈식 차례", ["빼지는 수", "빼는 수", "차"],
                   [X('첫째', '75-43=32'), X('둘째', '775-443=332'), X('셋째', '7775-4443=3332'), X('넷째', '77775-44443=33332'),
                    X('다섯째', '□-□=□', [777775, 444443, 333332])])
    w.choices([("규칙에 따라 차가 3333332가 되는 뺄셈식은 몇째일까요?", "( 다섯째 / 여섯째 / 일곱째 )")])
    assert 7777775 - 4444443 == 3333332 and 8888888 + 1111112 == 10000000
    ans = ("6차시  ① %s / ① ② %s, %s ③ %s, %s / %s ④ 작아지면, 그대로예요, 추측한 "
           "⑤ %s, 여섯째(7777775−4444443=3333332)" % (a0, a1[0], a2[0], a3[0], a3[1], a3w, a5[0]))
    w.step("⑥ 도전하기", "다른 모둠의 저금 기록")
    b1 = seq_block(w, "덧셈식의 배열", ["더해지는 수", "더하는 수", "합"],
                   [X('', '250+150=400'), X('', '230+170=400'), X('', '210+190=400'), X('', '190+210=400'), X('㉠', '□+□=□', [170, 230, 400])])
    b2 = seq_block(w, "뺄셈식의 배열", ["빼지는 수", "빼는 수", "차"],
                   [X('', '600-250=350'), X('', '650-300=350'), X('', '700-350=350'), X('', '750-400=350'), X('㉡', '□-□=□', [800, 450, 350])])
    w.why("㉡의 차가 350으로 그대로인 까닭을 써 보세요.", 1)
    ans += " ⑥ %s, %s, 왜: 빼지는 수와 빼는 수가 똑같이 50씩 커지기 때문이에요" % (b1[0], b2[0])
    return ans


def h_st_l7(w, D):
    w.lesson(7, "개념 구축하기(O)", "지후의 계산기 놀이 ― 곱셈식과 나눗셈식의 배열", "곱셈식과 나눗셈식의 배열에서 어떤 규칙을 찾을 수 있을까요?",
             "저금 기록을 맡은 지후가 쉬는 시간에 계산기로 곱셈식과 나눗셈식을 만들었어요.")
    w.step("① 만져 보기 — 1이 늘어나는 곱셈식 ×9")
    a0 = st_why(w, D, "먼저 예상해요. 1111×9 다음 식의 곱은 어떻게 될까요?", "", "곱해지는 수의 1이 5개이면 곱의 9도 5개라서 11111×9=99999예요")
    a1 = seq_block(w, "지후의 두 번째 곱셈식", ["곱해지는 수", "곱하는 수", "곱"],
                   [X('', '1×9=9'), X('', '11×9=99'), X('', '111×9=999'), X('', '1111×9=9999'), X('㉠', '□×□=□', [11111, 9, 99999])])
    w.pick("이 곱셈식의 배열에서 찾은 규칙은?", ["곱해지는 수의 1이 1개씩 늘어나면 곱의 9도 1개씩 늘어나요.", "곱하는 수가 9씩 커져요.", "곱이 9배씩 커져요."])
    w.step("② 그려 보기 — 7이 늘어나는 나눗셈식")
    a2 = seq_block(w, "지후의 두 번째 나눗셈식", ["나누어지는 수", "나누는 수", "몫"],
                   [X('', '7÷7=1'), X('', '77÷7=11'), X('', '777÷7=111'), X('', '7777÷7=1111'), X('㉡', '□÷□=□', [77777, 7, 11111])])
    w.step("③ 말해 보기 — 9가 늘어나는 곱셈식 4×", "규칙으로 먼저 맞혀 보기")
    a3 = seq_block(w, "곱셈식 차례", ["곱해지는 수", "곱하는 수", "곱"],
                   [X('첫째', '4×9=36'), X('둘째', '4×99=396'), X('셋째', '4×999=3996'), X('넷째', '4×9999=□', [39996]), X('다섯째', '□×□=□', [4, 99999, 399996])])
    a3w = st_why(w, D, "왜 그럴까요? 곱의 첫 자리 3과 끝자리 6은 그대로이고 9만 늘어나는 까닭을 생각해 볼까요?", "",
                 "4×10=40에서 4를 빼면 36, 4×100=400에서 4를 빼면 396처럼 곱하는 수가 9, 99, 999로 늘어날 때마다 가운데에 9가 하나씩 더 생겨요")
    w.step("④ 약속하기 — 곱셈식과 나눗셈식의 배열")
    w.fill(["곱하는 수에 9가 1개 늘어나면 곱에서도 (          ) 사이에 9가 1개 늘어나요.",
            "나누어지는 수의 7이 1개씩 늘어나면 몫의 (          )도 1개씩 늘어나요. 추측한 결과는 (            )로 확인해요."])
    w.step("⑤ 확인하기 — 63이 늘어나는 나눗셈식")
    a5 = seq_block(w, "나눗셈식 차례", ["나누어지는 수", "나누는 수", "몫"],
                   [X('첫째', '63÷9=7'), X('둘째', '6363÷9=707'), X('셋째', '636363÷9=70707'), X('넷째', '63636363÷9=7070707'),
                    X('다섯째', '□÷□=□', [6363636363, 9, 707070707])])
    w.choices([("규칙에 따라 몫이 70707070707이 되는 나눗셈식은 몇째일까요?", "( 다섯째 / 여섯째 / 일곱째 )")])
    assert 636363636363 // 9 == 70707070707 and 636363636363 % 9 == 0
    ans = ("7차시  ① %s / %s, ① ② %s ③ %s, %s / %s ④ 3과 6, 1, 계산기 ⑤ %s, 여섯째(636363636363÷9=70707070707)"
           % (a0, a1[0], a2[0], a3[0], a3[1], a3w, a5[0]))
    w.step("⑥ 도전하기", "다른 친구들이 찾은 계산식")
    b1 = seq_block(w, "곱셈식의 배열", ["곱해지는 수", "곱하는 수", "곱"],
                   [X('', '20×101=2020'), X('', '30×101=3030'), X('', '40×101=4040'), X('', '50×101=5050'), X('㉠', '□×□=□', [60, 101, 6060])])
    b2 = seq_block(w, "나눗셈식의 배열", ["나누어지는 수", "나누는 수", "몫"],
                   [X('', '240÷2=120'), X('', '360÷3=120'), X('', '480÷4=120'), X('', '600÷5=120'), X('㉡', '□÷□=□', [720, 6, 120])])
    seq_block(w, "나눗셈식의 배열", ["나누어지는 수", "나누는 수", "몫"],
              [X('첫째', '612÷6=102'), X('둘째', '6012÷6=1002'), X('셋째', '60012÷6=10002'), X('넷째', '600012÷6=100002')])
    w.text("서연: “나누어지는 수는 6과 1 사이에 0이 1개씩 늘어나고 몫은 1과 2 사이에 0이 1개씩 늘어나.”")
    w.text("민준: “다섯째에 알맞은 나눗셈식은 6000012÷6=100002야.”")
    w.choices([("잘못 설명한 사람은?", "( 서연 / 민준 )")])
    w.why("잘못 설명한 사람의 식을 바르게 고쳐 써 보세요.", 1)
    assert 6000012 // 6 == 1000002
    ans += " ⑥ %s, %s, 민준, 왜: 다섯째는 6000012÷6=1000002예요(몫의 0도 5개)" % (b1[0], b2[0])
    return ans


def h_st_l8(w, D):
    w.lesson(8, "개념 구축하기(O)", "공정하게 나누어요 ― 크기가 같은 두 양과 등호", "크기가 같은 두 양의 관계를 어떻게 식으로 나타낼 수 있을까요?",
             "저금통 돈으로 산 공책을 두 모둠에 나누어 주려고 해요. 저울 왼쪽 가에는 공책 11권, 오른쪽 나에는 공책 14권이 있어요(공책의 무게는 모두 같아요).")
    w.step("① 만져 보기 — 저울로 확인하기", "식 11−2=14−5가 옳을까요?")
    w.pic(balance_svg(11, 14, 'book'), 120, 50)
    w.text("가에서 2권, 나에서 5권을 덜어 내도록 공책에 × 표시해 보세요.")
    w.fill("가에 남은 공책 (      )권,  나에 남은 공책 (      )권")
    assert 11 - 2 == 14 - 5
    w.choices([("저울은 어떻게 되나요?", "( 수평 / 가 쪽으로 기울어요 / 나 쪽으로 기울어요 )"), ("식 11−2=14−5는 옳은가요?", "( 옳아요 / 옳지 않아요 )")])
    a1 = st_why(w, D, "왜 그럴까요? 식 11−2=14−4가 옳지 않은 까닭을 저울로 설명해 볼까요?", "",
                "가에는 9권, 나에는 10권이 남아 나 쪽으로 기울므로 두 양의 크기가 같지 않아요")
    w.step("② 그려 보기 — 수평 만들기")
    assert 11 - 4 == 14 - 7 and 11 - 6 == 14 - 9
    w.fill(["11 − 4 = 14 − □     □ = (        )", "11 − □ = 14 − 9     □ = (        )"])
    w.step("③ 말해 보기 — 나눔 꾸러미", "간식을 15개씩 담아요")
    nm = ('사탕', '젤리')
    w.pic(plates_svg([(1, 14), (4, 11), (8, 7), (12, 3)], nm, ('#E05A4F', '#7BC47F')), 170, 45)
    w.text("위 꾸러미처럼 빈 꾸러미 두 개를 색칠해 5 + 10 = □ + □ 의 식을 2개 만들어 보세요.")
    w.pic(plates_svg([(None, None), (None, None)], nm), 110, 40)
    w.fill("5 + 10 = (      ) + (      ),      5 + 10 = (      ) + (      )")
    w.choices([("젤리가 2개 줄면 사탕은?", "( 2개 늘어요 / 2개 줄어요 / 그대로예요 )")])
    w.step("④ 약속하기 — 등호(=)")
    w.fill(["7+5=6+6, 9−2=10−3, 2×9=3×6에서 =는 왼쪽과 오른쪽의 (                )는 것을 나타내요.",
            "등호 양쪽에 놓인 두 양을 저울에 올리면 (          )을 이루어요."])
    w.step("⑤ 확인하기 — 크기가 같은 두 양 찾기", "나눔 장터의 새 가격표")
    w.text("보기: 24 + 36 = 30 × 2.  계산하기보다 수의 변화를 살펴 크기가 같은 두 양을 찾아 등호로 이어 보세요.")
    w.table([["55 + 15", "84 − 26", "80 − 22", "50 + 20"]], header=False)
    w.fill("(            ) = (            ),     (            ) = (            )")
    check_pairs([("24+36", "30×2"), ("55+15", "50+20"), ("84-26", "80-22")])
    ans = ("8차시  ① 9권, 9권, 수평, 옳아요 / %s ② 7, 6 ③ (예) 5+10=6+9, 5+10=13+2, 2개 늘어요 ④ 크기가 같다, 수평 "
           "⑤ 55+15=50+20, 84−26=80−22" % a1)
    w.step("⑥ 도전하기", "참일까요, 거짓일까요?")
    eqs = ["6+7=13", "15-6=8", "9=4+5", "5+5=10+5", "8+5=15-2", "12=12"]
    w.choices([(pretty(e), '( 참 / 거짓 )') for e in eqs])
    tf = ['참' if eq_ok(e) else '거짓' for e in eqs]
    nums = [("6+3+8=6+□", 11), ("3+16=7+□", 12), ("74-20=□-10", 64)]
    for e, a in nums:
        assert eq_ok(fill_box(e, [a]))
    w.fill('   '.join(show(e, '(      )') for e, _ in nums))
    w.why("5+5=10+5가 거짓인 까닭을 등호의 뜻을 넣어 써 보세요.", 1)
    ans += " ⑥ %s / 11, 12, 64(★) / 왜: 등호 양쪽의 크기가 같아야 하는데 5+5는 10, 10+5는 15로 크기가 달라요" % ', '.join(tf)
    return ans


def h_st_l9(w, D):
    w.lesson("9~10", "탐구 정리하기(O)", "나눔 저금통을 열어요 ― 규칙으로 모은 돈 구하기",
             "규칙을 찾아 식으로 나타내면 모은 금액을 어떻게 쉽게 구할 수 있을까요?",
             "“서연이는 50원부터 시작하여 매일 100원씩 늘려 가며 나눔 저금통에 저금했어요. 12일 동안 저금했을 때, 서연이가 모은 금액은 모두 얼마일까요?”")
    w.step("① 만져 보기 — 날마다 넣은 금액")
    w.choices([("첫째 날 넣은 금액은?", "( 50원 / 100원 / 150원 )"), ("넷째 날 넣은 금액은?", "( 300원 / 350원 / 400원 )"),
               ("열두째 날 넣은 50원짜리 동전은?", "( 12개 / 23개 / 24개 )")])
    assert 50 + 100 * 3 == 350 and 1 + 2 * 11 == 23
    w.step("② 그려 보기 — 해결 계획 세우기")
    w.pick("12일 동안 모은 금액을 빠르게 구하는 방법으로 알맞은 것은?",
           ["동전 수를 덧셈식으로 나타내고, 동전을 옮겨 정사각형을 만들어 곱셈으로 구해요.", "열두째 날 넣은 금액에 12를 곱해요."])
    w.ask("넷째 날 넣은 금액은 50원짜리 동전으로 몇 개인가요?")
    w.step("③ 말해 보기 — 다섯째 날까지 동전 줄")
    w.pic(coins_svg([1, 3, 5, 7, 9], lab='50'), 120, 50)
    ex = {1: '1', 2: '1+3', 3: '1+3+5', 4: '1+3+5+7', 5: '1+3+5+7+9'}
    e3 = expr_table(w, [1, 2, 3, 4, 5], ex, blanks=(2, 4, 5))
    w.step("④ 약속하기 — 덧셈을 곱셈으로", "다섯째 날까지의 동전 옮기기")
    w.text("다섯째 날까지의 동전을 옮겨 정사각형을 만들어 모눈에 그려 보세요.")
    w.pic(pair_svg(coins_svg([1, 3, 5, 7, 9], lab='50', label=False), paper_svg(6, 10, 30, title='옮긴 모양')), 120, 50)
    w.fill("1 + 3 + 5 + 7 + 9 = (              )       여섯째 날까지 = (              )")
    w.ask("1+3+5+…+23을 곱셈식으로 나타내어 보세요.")
    w.ask("12일 동안 넣은 50원짜리 동전은 모두 몇 개인가요?")
    w.ask("서연이가 12일 동안 모은 금액은 모두 얼마인가요?")
    coins = [1 + 2 * i for i in range(12)]
    assert sum(coins[:5]) == 25 and sum(coins[:6]) == 36 and sum(coins) == 144 and 144 * 50 == 7200
    a4 = st_why(w, D, "왜 그럴까요? 열두째 날 동전 수 23개에 12를 곱하면 안 되는 까닭은 무엇일까요?", "",
                "날마다 넣은 동전 수가 1개, 3개, 5개, ...로 달라서 23개씩 12번 넣은 것이 아니에요")
    w.step("⑤ 확인하기 — 되돌아봐요")
    a5 = write2(w, D, [("정사각형으로 옮겨 세는 방법이 편리한 까닭을 써 보세요.", "", "많은 수를 하나하나 더하지 않고 한 줄의 개수끼리 곱하면 되어서 편리해요"),
                       ("같은 규칙으로 15일 동안 저금하면 모두 얼마가 되는지 구하는 방법을 써 보세요.", "", "동전이 15×15=225(개)이므로 50원×225=11250원이에요")])
    assert sum(1 + 2 * i for i in range(15)) == 225 and 225 * 50 == 11250
    ans = ("9~10차시  ① 50원, 350원, 23개 ② ①, 7개 ③ %s ④ 5×5, 6×6, 12×12, 144개, 7200원 / %s ⑤ %s" % (e3, a4, a5))
    w.step("⑥ 도전하기", "스스로 풀어요")
    w.text("하은이는 300원부터 시작하여 매일 200원씩 늘려 가며 8일 동안 저금했어요. 100원짜리 동전은 3개, 5개, 7개, 9개, ...로 늘어나요.")
    w.pic(coins_svg([3, 5, 7, 9]), 110, 45)
    w.fill("3 + 5 + 7 + 9 = (    ) × (    )      여덟째까지 = (    ) × (    )")
    w.ask("하은이가 8일 동안 모은 금액은 모두 얼마인가요?")
    w.why("동전을 옮기면 정사각형이 아니라 직사각형이 되는 까닭을 써 보세요.", 1)
    c2 = [3 + 2 * i for i in range(8)]
    assert sum(c2[:4]) == 6 * 4 and sum(c2) == 10 * 8 == 80
    ans += " ⑥ 6×4, 10×8=80(개), 8000원, 왜: 첫째 날이 3개라 한 줄이 줄 수보다 2개 많아요"
    return ans


def h_st_l11(w, D):
    w.lesson(11, "발표하기(P)", "나눔 장터 ‘내 짝을 찾아라!’ 놀이", "크기가 같은 두 양을 어떻게 빨리 찾을 수 있을까요?",
             "나눔 장터에서 4학년 1반이 ‘내 짝을 찾아라!’ 놀이 부스를 열어요. 2명이 하는 놀이예요.")
    w.step("① 만져 보기 — 놀이 방법 알기", "놀이의 차례를 번호로 쓰기")
    o1 = h_order(w)
    w.step("② 그려 보기 — 문제 카드 만들기", "왼쪽과 크기가 같은 다른 식을 만들어요(두 자리 수까지)")
    cards = [("7+18", "+", "8+17"), ("19-5", "-", "20-6"), ("12+9", "+", "13+8"), ("3×10", "×", "5×6")]
    for l, _, e in cards:
        assert eq_ok(l + '=' + e)
    w.fill(['%s = (      ) %s (      )' % (pretty(l + '=0').split(' = ')[0], {'+': '+', '-': '−', '×': '×'}[op]) for l, op, _ in cards])
    w.step("③ 말해 보기 — 놀이하기", "새 카드 16장에서 짝 찾기")
    m = match_block(w, D, HS_PAIRS, 'st11h')
    w.step("④ 약속하기 — 빨리 찾는 방법")
    w.fill("짝을 찾을 때는 두 식에서 (          ) 수끼리 견주어 봐요. 곱셈에서는 한 수가 2배가 되면 다른 수는 (              )이 되어야 크기가 같아요.")
    a4 = st_why(w, D, "왜 그럴까요? 4×5와 2×10이 짝인 까닭을 계산하지 않고 설명해 볼까요?", "",
                "4가 반인 2가 되고 5가 2배인 10이 되어서 곱의 크기가 같아요")
    w.step("⑤ 확인하기 — 가져올 수 있을까?")
    w.choices([("가져올 수 있는 두 카드는?", "( 44+19와 45+18 / 60−22와 61−21 / 9×2와 8×3 )"), ("28+15와 짝이 되는 카드는?", "( 30+13 / 30+17 / 26+15 )")])
    assert eq_ok('44+19=45+18') and not eq_ok('60-22=61-21') and not eq_ok('9×2=8×3') and eq_ok('28+15=30+13')
    ans = ("11차시  ① %s ② (예) 8+17, 20−6, 13+8, 5×6 ③ %s ④ 같은 자리의, 반(1/2) / %s ⑤ 44+19와 45+18, 30+13" % (o1, m, a4))
    w.step("⑥ 도전하기", "카드 20장 ― 어려운 판")
    m2 = match_block(w, D, R6S_PAIRS2, 'st11b', cols=5)
    w.why("90−45와 85−40이 짝인 까닭을 계산하지 않고 설명해 보세요.", 1)
    ans += " ⑥ %s, 왜: 빼지는 수와 빼는 수가 똑같이 5만큼 작아졌어요" % m2
    return ans


def h_st_l12(w, D):
    w.lesson(12, "발표하기(P)", "나눔 저금통 발표회 ― 배운 내용 확인하기", "규칙과 관계에서 배운 내용을 잘 알고 있나요?",
             "4학년 1반은 규칙적으로 모은 돈을 기부하며 나눔 저금통 프로젝트를 마쳤어요. 발표회에서 배운 내용을 확인해요.")
    S = [5, 10, 20, 40, 80, 160]
    w.step("① 만져 보기 — 커지는 수의 배열", "발표회 첫 문제")
    w.table([[str(x) for x in S]], header=False)
    w.choices([("이 수의 배열에서 → 방향으로 찾을 수 있는 규칙은?", "( 5씩 커져요 / 2배가 돼요 / 1/2만큼이 돼요 )")])
    e1 = eq_frames(w, D, "→ 방향의 규칙을 이웃한 두 수로 곱셈식 2개로 나타내어 보세요.", S, '×')
    w.step("② 그려 보기 — 계단 스티커를 식으로")
    w.pic(shape_svg('tri', [1, 2, 3, 4], layers=True), 120, 50)
    ex = {1: '1', 2: '1+2', 3: '1+2+3', 4: '1+2+3+4'}
    for n in range(1, 5):
        assert eval(ex[n]) == cnt('tri', n)
    e2 = expr_table(w, [1, 2, 3, 4], ex, blanks=(2, 3, 4))
    w.ask("여섯째 모양의 사각형은 몇 개인가요?")
    w.step("③ 말해 보기 — 등호 식 완성하기")
    nums = [("8+6=9+□", 5), ("17+□=27+13", 23), ("20-□=19-7", 8), ("60-14=□-24", 70)]
    for e, a in nums:
        assert eq_ok(fill_box(e, [a]))
    w.fill(['     '.join(show(e, '(      )') for e, _ in nums[:2]), '     '.join(show(e, '(      )') for e, _ in nums[2:])])
    w.step("④ 약속하기 — 여섯째 식 추측하기")
    a1 = seq_block(w, "덧셈식 차례", ["더해지는 수", "더하는 수", "합"],
                   [X(ORD[i + 1], '%d+318=%d' % (214 + 100 * i, 532 + 100 * i)) for i in range(5)] + [X('여섯째', '□+□=□', [714, 318, 1032])])
    a2 = seq_block(w, "뺄셈식 차례", ["빼지는 수", "빼는 수", "차"],
                   [X(ORD[i + 1], '%d-%d=245' % (402 + 120 * i, 157 + 120 * i)) for i in range(5)] + [X('여섯째', '□-□=□', [1002, 757, 245])])
    w.step("⑤ 확인하기 — 비밀 글자 찾기", "□를 구해 글자 칸 색칠하기")
    w.text("① 2, 8, 32, □, 512, □     ② 74−50=24, 84−60=24, 94−70=24, 104−□=24     ③ 15÷1=15, 30÷2=15, 45÷3=15, □÷4=15")
    tiles = [[128, "함"], [118, "사"], [2048, "께"], [2038, "랑"], [80, "나"], [70, "저"], [60, "눔"], [50, "금"]]
    w.table([[str(t[0]) for t in tiles], [t[1] for t in tiles]], header=False)
    w.fill("□ :  ① (      ), (      )   ② (      )   ③ (      )      색칠한 글자: (                    )")
    assert [2 * 4 ** i for i in range(6)] == [2, 8, 32, 128, 512, 2048] and 104 - 80 == 24 and 60 // 4 == 15
    w.step("⑥ 확인하기 — 예전 생각, 지금 생각", "프로젝트를 돌아보며")
    a6 = write2(w, D, [("프로젝트를 하기 전과 비교해 ‘규칙’에 대한 내 생각이 어떻게 달라졌는지 써 보세요.", "",
                        "예전에는 규칙이 무늬에만 있는 줄 알았는데, 이제는 수와 계산식, 저금한 돈에도 규칙이 있다는 것을 알아요"),
                       ("이 단원에서 배운 것 가운데 동생에게 가장 알려 주고 싶은 것과 그 까닭을 써 보세요.", "",
                        "등호는 양쪽의 크기가 같다는 뜻이라는 것을 알려 주고 싶어요. 답을 쓰라는 표시로 잘못 아는 친구가 많기 때문이에요")])
    ans = ("12차시  ① 2배가 돼요, %s ② %s, 21개 ③ %s ④ %s, %s ⑤ 128, 2048, 80, 60 → 함께 나눔 ⑥ %s"
           % (', '.join(e1), e2, ', '.join(str(a) for _, a in nums), a1[0], a2[0], a6))
    assert cnt('tri', 6) == 21
    w.step("⑦ 도전하기", "마인드맵 ― ‘규칙과 관계’를 정리해요")
    w.labeled([("떠오르는 말", "(배열, 방향, 등호 …)\n"), ("묶어 보기", "(규칙 찾기 / 등호)\n"),
               ("이어지는 말", "(커지는 규칙과 덧셈식 …)\n"), ("덧붙이는 말", "(예를 들면 …)\n")], row_h=5600)
    w.text("★ 선택 문제 — 발표회 보너스 문제")
    rows = [X(ORD[i + 1], '12345679×%d=%d' % (9 * (i + 1), 111111111 * (i + 1))) for i in range(4)]
    seq_block(w, "곱셈식의 배열", ["곱해지는 수", "곱하는 수", "곱"], rows)
    w.choices([("곱이 777777777이 되는 곱셈식은 몇째일까요?", "( 여섯째 / 일곱째 / 여덟째 )")])
    w.ask("12345679×□=777777777에서 □는?")
    assert 12345679 * 63 == 777777777
    w.why("일곱째라고 생각한 까닭을 써 보세요.", 1)
    ans += (" ⑦ (마인드맵 — 예: 수의 배열·도형의 배열·계산식의 배열·등호 / 시작하는 수와 방향, 변하는 수 / 저울의 수평과 등호) "
            "★ 일곱째, 63, 왜: 곱하는 수가 9씩 커지고 곱은 111111111씩 커지므로 777777777은 일곱째(9×7=63)예요")
    return ans


HARD = {tb_l1: h_tb_l1, tb_l2: h_tb_l2, tb_l3: h_tb_l3, tb_l4: h_tb_l4, tb_l5: h_tb_l5, tb_l6: h_tb_l6, tb_l7: h_tb_l7,
        tb_l8: h_tb_l8, tb_l9: h_tb_l9, tb_l11: h_tb_l11, tb_l12: h_tb_l12,
        st_l1: h_st_l1, st_l2: h_st_l2, st_l3: h_st_l3, st_l4: h_st_l4, st_l5: h_st_l5, st_l6: h_st_l6, st_l7: h_st_l7,
        st_l8: h_st_l8, st_l9: h_st_l9, st_l11: h_st_l11, st_l12: h_st_l12}


# ================================================================ 만들기
TB_LESSONS = [tb_l1, tb_l2, tb_l3, tb_l4, tb_l5, tb_l6, tb_l7, tb_l8, tb_l9, tb_l11, tb_l12]
ST_LESSONS = [st_l1, st_l2, st_l3, st_l4, st_l5, st_l6, st_l7, st_l8, st_l9, st_l11, st_l12]


def build(lessons, unit_label, ver, level, out_dir):
    s = Sheet(unit_label=unit_label, level=level, grade_label='4학년')
    w = W(s)
    D = level == '도전형'
    keys = [(HARD[fn] if D else fn)(w, D) for fn in lessons]
    w.flush()
    s.answers("【교사용】 6. 규칙과 관계(%s) 활동지 정답 (%s)" % (ver, level), keys,
              note="※ 이 활동지는 앱 u6-pattern.html과 차시 번호가 같습니다.")
    os.makedirs(out_dir, exist_ok=True)
    path = os.path.join(out_dir, NAME % level)
    s.save(path)
    probs = check(path)
    print(('OK  ' if not probs else 'ERR ') + os.path.relpath(path, ROOT), probs or '', '쪽 나눔 %d' % sum('pageBreak="1"' in b for b in s.body))
    return probs


def main():
    bad = []
    for level in ('기본형', '도전형'):
        bad += build(TB_LESSONS, "4-1 수학 6. 규칙과 관계(교과서 차시)", "교과서 차시", level, OUT_TB)
        bad += build(ST_LESSONS, "4-1 수학 6. 규칙과 관계(이야기 버전)", "이야기 버전", level, OUT_ST)
    if bad:
        sys.exit(1)


if __name__ == '__main__':
    main()
