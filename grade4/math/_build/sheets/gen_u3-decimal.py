# -*- coding: utf-8 -*-
"""4-2 수학 3. 소수의 덧셈과 뺄셈 활동지(교과서 차시 버전·이야기 버전 × 기본형·도전형) 만들기

    python3 gen_u3-decimal.py

앱 원본 ../units/sem2/u3-decimal.tb.js('할아버지 댁', 12차시: 1·2~3·4~5·6~14차시)와
u3-decimal.st.js('우리 반 운동회 기록원', 12차시)의 차시 번호·제목·S.O.O.P.·탐구 질문·이야기·수를 똑같이 맞춥니다.

소수 계산은 모두 1000배 한 정수(0.001이 몇 개인지)로 해서 오차가 없습니다(앱의 c3P·c3F와 같은 방법).
정답은 이 스크립트가 계산하고, 앱에 적힌 답과 assert로 견줍니다.
그림(모눈 100칸·1000칸, 수직선, 막대, 소수점 자리가 있는 세로셈 칸, 관계 그림, 색칠 그림)은 SVG로 그려
임시 폴더에서 PNG로 바꿉니다(저장소에는 남기지 않음).
글 속 분수는 읽는 말로 씁니다: 17/100 → '100분의 17', 1 76/100 → '1과 100분의 76'.
"""
import hashlib
import os
import shutil
import sys
import tempfile
from xml.sax.saxutils import escape

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from hwpxgen import Sheet, svg_to_png, check  # noqa: E402

ROOT = os.path.normpath(os.path.join(HERE, '..', '..'))      # grade4/math
OUT_TB = os.path.join(ROOT, 'sem2', 'sheets')
OUT_ST = os.path.join(ROOT, 'sem2-soop', 'sheets')
NAME = '3단원_소수의덧셈과뺄셈_활동지_%s.hwpx'
FONT = "'Noto Sans KR','WenQuanYi Zen Hei',sans-serif"
NUM = '①②③④⑤⑥⑦'
WORK = tempfile.mkdtemp(prefix='u3dec_')
_FIG = {}
INK = '#1D2A2A'
COL = {'one': '#8FB8E8', 't': '#F4A7B9', 'h': '#A9D8A2', 'k': '#F6C08A'}
B = '(          )'          # 빈칸


# ================================================================ 소수 계산(0.001의 개수)
def P(s):
    """'0.5' · '1.20' · '9' → 0.001의 개수(정수)"""
    s = str(s).strip()
    i, _, d = s.partition('.')
    assert len(d) <= 3 and (i + d).isdigit() or (i.isdigit() and d == ''), s
    return int(i or '0') * 1000 + int((d + '000')[:3])


def S(n):
    """0.001의 개수 → 가장 짧은 소수 글"""
    i, f = divmod(n, 1000)
    return '%d.%s' % (i, ('%03d' % f).rstrip('0')) if f else str(i)


def SD(n, d):
    """소수 d자리 글(끝자리 0 포함)"""
    i, f = divmod(n, 1000)
    return '%d.%s' % (i, ('%03d' % f)[:d]) if d else str(i)


def ndec(s):
    return len(str(s).partition('.')[2])


def ev(e):
    """'1.82+0.5', '0.5+0.5+0.8', '2.4−2' (덧셈·뺄셈)"""
    t = e.replace('−', '-').replace(' ', '')
    toks, cur = [], ''
    for ch in t:
        if ch in '+-':
            toks.append(cur)
            toks.append(ch)
            cur = ''
        else:
            cur += ch
    toks.append(cur)
    acc = P(toks[0])
    for k in range(1, len(toks), 2):
        acc = acc + P(toks[k + 1]) if toks[k] == '+' else acc - P(toks[k + 1])
    assert acc >= 0, e
    return acc


def cq(e, want):
    """식의 값을 계산하고 앱의 답과 견줌 → 답 글"""
    got = S(ev(e))
    assert got == want, (e, got, want)
    return got


def cmp(a, b):
    x, y = P(a), P(b)
    return '>' if x > y else '<' if x < y else '='


def times(s, k):
    """s의 10^k배(k<0이면 1/10^-k), 0.001 단위로 딱 떨어져야 함"""
    n = P(s)
    if k >= 0:
        return S(n * 10 ** k)
    q, r = divmod(n, 10 ** -k)
    assert r == 0, (s, k)
    return S(q)


def dg(n):
    """0.001의 개수 → (십, 일, 첫째, 둘째, 셋째) 숫자"""
    return [n // 10000 % 10, n // 1000 % 10, n // 100 % 10, n // 10 % 10, n % 10]


C3D = '영일이삼사오육칠팔구'


def int_read(n):
    if n == 0:
        return '영'
    out = ''
    for unit, v in (('천', 1000), ('백', 100), ('십', 10)):
        d = n // v % 10
        if d:
            out += ('' if d == 1 else C3D[d]) + unit
    if n % 10:
        out += C3D[n % 10]
    return out


def read(s):
    i, _, d = str(s).partition('.')
    return int_read(int(i)) + (' 점 ' + ''.join(C3D[int(c)] for c in d) if d else '')


# ================================================================ 그림
def fig(svg, px=1600):
    key = hashlib.md5((svg + str(px)).encode()).hexdigest()[:12]
    if key not in _FIG:
        _FIG[key] = svg_to_png(svg, os.path.join(WORK, key + '.png'), px)
    return _FIG[key]


def _svg(w, h, body):
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d"><rect width="%d" height="%d" fill="#fff"/>'
            '<g font-family="%s">%s</g></svg>' % (w, h, w, h, FONT, body))


def _t(x, y, s, size=26, anchor='middle', weight='normal', fill=INK):
    return ('<text x="%.1f" y="%.1f" font-size="%s" text-anchor="%s" font-weight="%s" fill="%s" '
            'dominant-baseline="central">%s</text>' % (x, y, size, anchor, weight, fill, escape(str(s))))


def _r(x, y, w, h, fill='none', stroke=INK, sw=2, rx=0, dash=None):
    return '<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" rx="%s" fill="%s" stroke="%s" stroke-width="%s"%s/>' % (
        x, y, w, h, rx, fill, stroke, sw, ' stroke-dasharray="%s"' % dash if dash else '')


def _l(x1, y1, x2, y2, stroke=INK, sw=2, dash=None):
    return '<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="%s" stroke-width="%s"%s/>' % (
        x1, y1, x2, y2, stroke, sw, ' stroke-dasharray="%s"' % dash if dash else '')


def _fr(x, y, n, d, size=20, fill=INK):
    """쌓은 분수"""
    w = max(len(str(n)), len(str(d))) * size * .62 + 8
    return (_t(x, y - size * .62, n, size, fill=fill) + _l(x - w / 2, y, x + w / 2, y, fill, 2) +
            _t(x, y + size * .68, d, size, fill=fill))


# ---------------------------------------------------------------- 모눈종이(한 장 = 1)
def _grid1(x0, y0, Sz, v, div, mono=None, pre=0, pre_col=None):
    """v: 이 장에 칠할 0.001의 개수(0~1000). 세로 한 줄(0.1)씩 왼쪽부터, 줄 안에서는 위 칸(0.01)부터,
    칸 안은 위 가는 줄(0.001)부터. pre: 먼저 칠해 둔 0.01 칸 수(다른 색)."""
    c, sl = Sz / 10, Sz / 100
    o = [_r(x0, y0, Sz, Sz, '#fff', 'none', 0)]
    ct, ch, ck = (mono or COL['t']), (mono or COL['h']), (mono or COL['k'])
    if v >= 1000:
        o.append(_r(x0, y0, Sz, Sz, mono or COL['t'], 'none', 0))
    elif v:
        cols, cells, sls = v // 100, v % 100 // 10, v % 10
        if cols:
            o.append(_r(x0, y0, cols * c, Sz, ct, 'none', 0))
        if cells:
            o.append(_r(x0 + cols * c, y0, c, cells * c, ch, 'none', 0))
        if sls:
            o.append(_r(x0 + cols * c, y0 + cells * c, c, sls * sl, ck, 'none', 0))
    for k in range(pre):
        o.append(_r(x0 + k // 10 * c, y0 + k % 10 * c, c, c, pre_col, 'none', 0))
    if div >= 1000:
        for k in range(1, 100):
            if k % 10:
                o.append(_l(x0, y0 + k * sl, x0 + Sz, y0 + k * sl, '#DDE4E1', .6))
    for k in range(1, 10):
        if div >= 10:
            o.append(_l(x0 + k * c, y0, x0 + k * c, y0 + Sz, '#7A8C86', 1.4))
        if div >= 100:
            o.append(_l(x0, y0 + k * c, x0 + Sz, y0 + k * c, '#9AABA4', 1))
    o.append(_r(x0, y0, Sz, Sz, 'none', INK, 2.6))
    return ''.join(o)


def svg_grids(items, Sz=300):
    """items: [{v, div, cap, n(장 수), mono, pre, pre_col, zoom}] — 모눈 묶음을 가로로"""
    gap, igap, x, body, H = 18, 46, 20, [], Sz + 74
    for it in items:
        v, div = it.get('v', 0), it.get('div', 100)
        n = it.get('n') or max(1, -(-v // 1000))
        x_start = x
        for k in range(n):
            part = max(0, min(1000, v - k * 1000))
            body.append(_grid1(x, 20, Sz, part, div, it.get('mono'), it.get('pre', 0) if k == 0 else 0, it.get('pre_col')))
            x += Sz + gap
        x -= gap
        last = v - (n - 1) * 1000
        if it.get('zoom') and div >= 1000 and v % 10:
            cols, cells, sls = last // 100, last % 100 // 10, last % 10
            c = Sz / 10
            xk, yk = x - Sz + cols * c, 20 + cells * c
            zx, zy, Z = x + 40, 60, 130
            body.append(_r(xk - 1, yk - 1, c + 2, c + 2, 'none', '#7A8C86', 3, dash='5 3'))
            body.append(_l(xk + c, yk, zx, zy, '#7A8C86', 1.5, '5 3') + _l(xk + c, yk + c, zx, zy + Z, '#7A8C86', 1.5, '5 3'))
            body.append(_r(zx, zy, Z, Z, '#fff', 'none', 0) + _r(zx, zy, Z, sls * Z / 10, it.get('mono') or COL['k'], 'none', 0))
            for k in range(1, 10):
                body.append(_l(zx, zy + k * Z / 10, zx + Z, zy + k * Z / 10, '#9AABA4', 1))
            body.append(_r(zx, zy, Z, Z, 'none', INK, 2) + _t(zx + Z / 2, zy - 24, '0.01 한 칸 확대', 20, fill='#56645F'))
            x += 40 + Z
        if it.get('cap'):
            body.append(_t((x_start + x) / 2, Sz + 50, it['cap'], 26))
        x += igap
    W = int(x - igap + 20)
    return _svg(W, H, ''.join(body))


def legend(keys):
    L = {'one': '1', 't': '0.1', 'h': '0.01', 'k': '0.001'}
    names = {'t': '분홍', 'h': '연두', 'k': '주황', 'one': '파랑'}
    return '색: ' + ' · '.join('%s %s' % (names[k], L[k]) for k in keys)


# ---------------------------------------------------------------- 막대(1을 10칸으로)
def svg_bars(rows, end='1'):
    """rows: [(이름, 칠한 칸 수, 색)] — 0칸이면 빈 막대(학생이 칠함)"""
    c, H = 66, 20 + len(rows) * 120
    body = []
    for r, (name, n, color) in enumerate(rows):
        y = 20 + r * 120
        body.append(_t(20, y + 18, name, 26, 'start'))
        for k in range(10):
            body.append(_r(170 + k * c, y + 40, c, 50, color if k < n else '#fff', '#7A8C86', 1.6))
        body.append(_r(170, y + 40, 10 * c, 50, 'none', INK, 2.6))
        body.append(_t(170, y + 108, '0', 20) + _t(170 + 10 * c, y + 108, end, 20))
    return _svg(170 + 10 * c + 50, H, ''.join(body))


# ---------------------------------------------------------------- 수직선
def svg_line(frm, to, minor, major, mid=None, unit='', marks=(), arrow=None, box=None, label_minor=False,
             W=1000, fs=22):
    """값은 0.001의 개수. marks: [(값, 글)] 파란 세모, arrow: (시작, 끝) 화살표, box: 값(□ 칸)"""
    x0, ln, y = 60, W - 140, 150
    X = lambda v: x0 + (v - frm) / (to - frm) * ln
    o = [_l(X(frm) - 8, y, X(to) + 20, y, INK, 2.6),
         '<path d="M%.1f %.1f l-12 -7 v14 z" fill="%s"/>' % (X(to) + 30, y, INK)]
    v = frm
    while v <= to:
        maj = (v - frm) % major == 0
        md = mid and (v - frm) % mid == 0
        L = 20 if maj else 13 if md else 8
        o.append(_l(X(v), y - L, X(v), y + L, INK, 2.4 if maj else 1.3))
        if maj or label_minor:
            o.append(_t(X(v), y + 44, S(v), fs))
        v += minor
    if unit:
        o.append(_t(X(to) + 40, y + 44, '(%s)' % unit, fs - 2, 'start'))
    for val, txt in marks:
        o.append('<path d="M%.1f %d l-13 -26 h26 z" fill="#2B7BD6"/>' % (X(val), y - 22))
        o.append(_t(X(val), y - 66, txt, 24, fill='#2B7BD6'))
    if arrow:
        a, b = arrow
        o.append('<circle cx="%.1f" cy="%d" r="8" fill="#2B7BD6"/>' % (X(a), y))
        o.append('<path d="M%.1f %d Q%.1f %d %.1f %d" fill="none" stroke="#C8472E" stroke-width="3.5"/>' % (
            X(a), y - 12, (X(a) + X(b)) / 2, y - 90, X(b), y - 14))
        dx = -1 if b < a else 1
        o.append('<path d="M%.1f %d l%d -16 l%d 6 z" fill="#C8472E"/>' % (X(b), y - 8, -6 * dx, -10 * dx))
    if box is not None:
        o.append(_r(X(box) - 22, y - 92, 44, 44, '#fff', INK, 2.4, 6))
        o.append(_l(X(box), y - 48, X(box), y - 22, INK, 2))
    return _svg(W, 230, ''.join(o))


# ---------------------------------------------------------------- 세로셈 칸(소수점 자리 포함)
CW, DW = 58, 26


def _vgeom(a, b, op):
    r = S(ev('%s%s%s' % (a, op, b)))
    D = max(ndec(a), ndec(b))
    I = max(len(a.partition('.')[0]), len(b.partition('.')[0]), len(SD(P(r), D).partition('.')[0]))
    return r, D, I


def _vcell(x0, y0, a, b, op, lv, mode, title):
    """한 문제의 세로셈 칸. mode: 'given'(두 수를 소수점에 맞추어 써 줌) | 'blank'(빈칸에 직접 쓰기)
    기본형: 받아올림·받아내림 칸, 끝자리 0(회색), 답 칸의 소수점(찍어 줌) / 도전형: 소수점 자리만 점선 칸"""
    r, D, I = _vgeom(a, b, op)
    basic = lv == '기본형'
    o = [_t(x0, y0 + 18, title, 28, 'start', 'bold')]
    xi = lambda k: x0 + CW + k * CW                      # 자연수 부분 k번째 칸 왼쪽
    xd = x0 + CW + I * CW                                # 소수점 칸 왼쪽
    xj = lambda j: xd + DW + j * CW                      # 소수 부분 j번째 칸 왼쪽
    right = xj(D) if D else xd
    y = y0 + 46
    if basic and mode == 'given':
        for k in range(I):
            o.append(_r(xi(k) + 15, y + 2, CW - 30, 26, '#fff', '#C8472E', 1.4, 3, '4 3'))
        for j in range(D - 1):
            o.append(_r(xj(j) + 15, y + 2, CW - 30, 26, '#fff', '#C8472E', 1.4, 3, '4 3'))
        y += 34
    sym = '+' if op == '+' else '−'

    def num_row(s, yy, with_op):
        ip, _, dp = s.partition('.')
        out = []
        if with_op:
            out.append(_t(x0 + CW / 2, yy + CW / 2, sym, 42))
        for k, ch in enumerate(ip):
            out.append(_t(xi(I - len(ip) + k) + CW / 2, yy + CW / 2, ch, 44))
        if '.' in s or (basic and D):
            out.append('<circle cx="%.1f" cy="%.1f" r="5" fill="%s"/>' % (xd + DW / 2, yy + CW - 10, INK))
        for j in range(D):
            if j < len(dp):
                out.append(_t(xj(j) + CW / 2, yy + CW / 2, dp[j], 44))
            elif basic:
                out.append(_t(xj(j) + CW / 2, yy + CW / 2, '0', 44, fill='#A9B4B0'))
        return ''.join(out)

    def box_row(yy, dot):
        out = []
        for k in range(I):
            out.append(_r(xi(k) + 5, yy + 4, CW - 10, CW - 8, '#fff', '#555', 2, 5))
        if D:
            if dot == 'dot':
                out.append('<circle cx="%.1f" cy="%.1f" r="6" fill="%s"/>' % (xd + DW / 2, yy + CW - 10, INK))
            else:
                out.append(_r(xd + 3, yy + CW - 24, DW - 6, 20, '#fff', '#2B7BD6', 1.6, 4, '3 3'))
        for j in range(D):
            out.append(_r(xj(j) + 5, yy + 4, CW - 10, CW - 8, '#fff', '#555', 2, 5))
        return ''.join(out)

    if mode == 'given':
        o.append(num_row(a, y, False))
        y += CW
        o.append(num_row(b, y, True))
        y += CW + 6
        o.append(_l(x0 + 6, y, right + 4, y, INK, 3))
        y += 8
        o.append(box_row(y, 'dot' if basic else 'box'))
        y += CW
    else:   # 빈칸: 두 수와 답을 직접 소수점에 맞추어 씀
        for row in range(3):
            if row == 1:
                o.append(_t(x0 + CW / 2, y + CW / 2, sym, 42))
            if row == 2:
                o.append(_l(x0 + 6, y + 4, right + 4, y + 4, INK, 3))
                y += 12
            o.append(box_row(y, 'box'))
            y += CW
    return o, right + 10 - x0, y - y0


def svg_vert(probs, lv, per_row=4, mode='given'):
    """probs: [(a, op, b)] → 소수점 자리 있는 세로셈 칸 여러 개"""
    cells = []
    for k, (a, op, b) in enumerate(probs):
        title = '%s %s %s %s' % (NUM[k] if len(probs) > 1 else '', a, '+' if op == '+' else '−', b)
        o, w, h = _vcell(0, 0, a, b, op, lv, mode, title.strip())
        cells.append((o, max(w, 26 * len(title) * .62 + 10), h))
    colw = max(c[1] for c in cells) + 50
    rows = [cells[i:i + per_row] for i in range(0, len(cells), per_row)]
    body, y = [], 14
    for row in rows:
        hmax = max(c[2] for c in row)
        for k, (o, w, h) in enumerate(row):
            body.append('<g transform="translate(%.1f %.1f)">%s</g>' % (24 + k * colw, y, ''.join(o)))
        y += hmax + 30
    W = int(24 + min(per_row, len(cells)) * colw)
    return _svg(W, int(y), ''.join(body)), W


def vert(s, probs, lv, per_row=4, mode='given', max_mm=176):
    svg, W = svg_vert(probs, lv, per_row, mode)
    s.picture(fig(svg, min(2400, W * 2)), width_mm=min(max_mm, W * .16))
    return ['%s%s%s=%s' % (a, '+' if op == '+' else '−', b, S(ev(a + op + b))) for a, op, b in probs]


def svg_chars(rows, title):
    c = 60
    W = 40 + len(rows[0]) * c + 30
    o = [_t(20, 24, title, 26, 'start')]
    for r, row in enumerate(rows):
        y = 50 + r * c + (8 if r == len(rows) - 1 else 0)
        for k, ch in enumerate(row):
            if ch:
                o.append(_t(40 + k * c + c / 2, y + c / 2, ch, 44))
    yl = 50 + (len(rows) - 1) * c + 4
    o.append(_l(36, yl, 40 + len(rows[0]) * c, yl, INK, 3))
    return _svg(W, 60 + len(rows) * c + 30, ''.join(o))


# ---------------------------------------------------------------- 1, 0.1, 0.01, 0.001 관계
def svg_rel(blank=False):
    V = ['1', '0.1', '0.01', '0.001']
    X = lambda k: 110 + k * 225
    o = []
    fills = ['#DCEAFB', '#FBD9E1', '#DFF1DA', '#FDE6CC']
    for k, v in enumerate(V):
        o.append(_r(X(k) - 70, 95, 140, 62, fills[k], INK, 2, 12))
        o.append(_t(X(k), 126, '' if blank and k in (2, 3) else v, 32))
    for k in range(3):
        a, b = X(k) + 40, X(k + 1) - 40
        o.append('<path d="M%d 90 Q%d 30 %d 90" fill="none" stroke="#2B7BD6" stroke-width="3"/>' % (a, (a + b) / 2, b))
        o.append('<path d="M%d 90 l-3 -15 l-10 9z" fill="#2B7BD6"/>' % b)
        o.append(_fr((a + b) / 2, 34, 1, 10, 18, '#2B7BD6'))
        o.append('<path d="M%d 162 Q%d 222 %d 162" fill="none" stroke="#C8472E" stroke-width="3"/>' % (b, (a + b) / 2, a))
        o.append('<path d="M%d 162 l3 15 l10 -9z" fill="#C8472E"/>' % a)
        o.append(_t((a + b) / 2, 222, '10배', 20, fill='#C8472E'))
    return _svg(900, 250, ''.join(o))


# ---------------------------------------------------------------- 색칠 그림(해·풀·토끼·당근)
RAB = [('sun', 'M40 80 a50 50 0 1 0 100 0 a50 50 0 1 0 -100 0z', 90, 80),
       ('earL', 'M330 150 C290 60 305 10 345 20 C372 30 366 100 360 150 Z', 338, 85),
       ('earR', 'M450 150 C490 60 475 10 435 20 C408 30 414 100 420 150 Z', 442, 85),
       ('head', 'M270 215 a120 85 0 1 0 240 0 a120 85 0 1 0 -240 0z', 390, 245),
       ('body', 'M280 445 q-10 -115 110 -145 q120 30 110 145 z', 390, 385),
       ('carrot', 'M540 270 h90 l-45 175 z', 585, 305),
       ('grass', 'M45 445 q30 -90 55 0 q25 -90 55 0 q25 -90 55 0 z', 128, 412)]


def svg_rabbit(labels):
    o = []
    for rid, d, lx, ly in RAB:
        o.append('<path d="%s" fill="#fff" stroke="%s" stroke-width="2.5"/>' % (d, INK))
    for rid, d, lx, ly in RAB:
        o.append(_t(lx, ly, labels[rid], 26))
    o.append('<circle cx="350" cy="200" r="6" fill="%s"/><circle cx="430" cy="200" r="6" fill="%s"/>' % (INK, INK))
    return _svg(700, 460, ''.join(o))


def color_task(s, items, labels, names, lv):
    """items: [(식, 색 이름)] → 표 + 그림. 정답 글 돌려줌"""
    vals = [S(ev(e)) for e, _ in items]
    rows = [['식', '계산한 값', '칠할 색']] + [[e.replace('-', '−') + ' =', B, c] for (e, c) in items]
    s.table(rows, col_mm=[70, 55, 55])
    s.picture(fig(svg_rabbit(labels)), width_mm=110)
    if lv == '기본형':
        s.text('계산한 값이 적힌 칸만 그 식의 색으로 칠해요. 답이 아닌 수가 적힌 칸은 칠하지 않아요.')
    inv = {}
    for rid, _, _, _ in RAB:
        lv_ = P(labels[rid])
        k = next((i for i, v in enumerate(vals) if P(v) == lv_), None)
        inv.setdefault(k, []).append(names[rid])
    parts = ['%s=%s %s(%s)' % (e.replace('-', '−'), v, c, '·'.join(inv.get(i, []))) for i, ((e, c), v) in enumerate(zip(items, vals))]
    rest = inv.get(None, [])
    return ', '.join(parts) + (', 칠하지 않음: %s' % '·'.join(rest) if rest else '')


RNAME = {'sun': '해', 'earL': '왼쪽 귀', 'earR': '오른쪽 귀', 'head': '얼굴', 'body': '몸', 'carrot': '당근', 'grass': '풀'}


# ================================================================ 공통 활동 조각
def step(s, i, label, sub=None):
    s.step('%s %s' % (NUM[i], label), sub)


def o(lv, *opts, n=10):
    """기본형: ( 보기 / 보기 ), 도전형: 빈칸"""
    return '( ' + ' / '.join(opts) + ' )' if lv == '기본형' else '(' + ' ' * n + ')'


def ch(*opts):
    return '( ' + ' / '.join(opts) + ' )'


def why(s, q, n=2):
    s.ask('왜 그럴까요? ' + q, blank=False)
    s.lines(n)


def rule_first(s, q):
    s.ask('먼저 예상해요 · ' + q, blank=False)
    s.ask('내 예상: ______________________________________________', blank=False)


def then_why(s, q, lv, frame=None):
    if lv == '기본형' and frame:
        s.ask('왜 그럴까요? ' + q, blank=False)
        s.fill(frame)
    else:
        why(s, q)


def place_table(s, rows, lv, cols=5):
    """자릿값 표. rows: [(이름, 수 글 또는 None(빈칸), 보일지)]. cols=5: 십·일·첫째·둘째·셋째"""
    head = ['', '십의 자리', '일의 자리', '소수 첫째 자리', '소수 둘째 자리', '소수 셋째 자리'][:cols + 1]
    out = [head]
    for name, num, show in rows:
        if show and num is not None:
            d = dg(P(num))
            nd = ndec(num)
            cells = []
            for k in range(5):
                if k == 0 and P(num) < 10000:
                    cells.append('')
                elif k >= 2 and k - 2 >= nd:
                    cells.append('')
                else:
                    cells.append(str(d[k]))
            out.append([name] + cells[5 - cols:])
        else:
            out.append([name] + [''] * cols)
    s.table(out, col_mm=[36] + [144 / cols] * cols)


# ================================================================ 교과서 차시 버전
def tb1(s, lv):
    s.lesson(1, '개념 찾기(S)', '단원 도입 ― 할아버지 댁에서 찾은 소수',
             '우리 주변에서 소수는 어디에 쓰이고, 소수의 덧셈과 뺄셈은 언제 필요할까요?')
    s.scene(None, '재윤이는 가족과 함께 할아버지 댁에 갔어요. 지난번에 심은 보리가 싹을 틔웠고, 대추나무에 대추가 열렸고, 귀여운 새끼 토끼들이 태어났어요.')
    step(s, 0, '만져 보기', '에베레스트산')
    s.text('“에베레스트산은 세계에서 가장 높은 산이야. 그 높이가 무려 8848.86 m나 된다고 해.”')
    s.choices([('8848.86에서 소수점 오른쪽에 있는 숫자는 몇 개인가요?', o(lv, '1개', '2개', '3개')),
               ('산의 높이를 8848.86 m처럼 소수로 나타내면 좋은 점은?',
                '( 더 정확하게 나타낼 수 있어요 /\n수를 읽지 않아도 돼요 /\n높이가 더 높아져요 )')])
    step(s, 1, '그려 보기', '할아버지 댁에서 찾은 것')
    s.text('그림 속 할아버지 댁: 할아버지 댁, 할머니가 토끼에게 먹이 주기, 동생이 천을 자르기, 할아버지의 대추 수확, 재윤이가 싹 튼 보리 보기, 젖소')
    s.text('“싹이 난 보리의 길이를 재어 보고, 대추의 무게도 재어 보고, 토끼장에 들어갈 천을 자르기도 했어요.” 소수로 나타내기에 알맞은 것에 모두 ○ 하세요.')
    s.choices([('싹이 난 보리의 키', '(    )'), ('수확한 대추의 무게', '(    )'), ('짠 우유의 양', '(    )'), ('새로 태어난 토끼의 수', '(    )')])
    step(s, 2, '말해 보기', '무엇을 배울까요')
    s.choices([('이 단원에서 배울 내용이 아닌 것은?', '( 소수 두 자리 수와 세 자리 수 /\n소수의 크기 비교 /\n소수의 덧셈과 뺄셈 / 소수의 곱셈 )')])
    if lv == '기본형':
        s.text('길이, 무게, 들이처럼 재어서 나타내는 양은 소수로 나타낼 때가 많아요. 하나, 둘 세는 것은 자연수로 나타내요.')
    step(s, 3, '배운 내용 떠올리기', '3학년 1학기 분수와 소수')
    if lv == '기본형':
        s.picture(fig(svg_bars([('10분의 7', 7, COL['t'])])), width_mm=120)
    s.fill(['10분의 1을 소수로 나타내면 (        )이에요.',
            '10분의 7은 0.1이 (      )개이므로 소수로 (        )이에요.',
            '0.1이 13개인 수는 (        )이에요.',
            '0.6 (    ) 0.8          1.4 (    ) 1.2      (>, =, < 중 알맞은 것)'])
    step(s, 4, '경험 나누기')
    if lv == '기본형':
        s.labeled([('경험', '방학 때 ______________________________ 에 가서 ____________________ 했어요.'),
                   ('소수', '____________________ 에서 ________ 처럼 소수를 보았어요.')])
    else:
        s.ask('시골이나 할아버지·할머니 댁에 갔던 경험을 써 보세요.', blank=False)
        s.lines(1)
        s.ask('우리 주변에서 소수를 본 적이 있나요? 어디에서 보았나요?', blank=False)
        s.lines(1)
    ans = '1차시  ① 2개, 더 정확하게 나타낼 수 있어요   ② 보리의 키·대추의 무게·우유의 양에 ○   ③ 소수의 곱셈   ④ 0.1, 7, 0.7, 1.3, %s, %s   ⑤ (자유)' % (
        cmp('0.6', '0.8'), cmp('1.4', '1.2'))
    if lv == '도전형':
        step(s, 5, '도전하기', '재윤이의 몸무게')
        s.text('재윤이는 할아버지 댁에서 몸무게를 재었더니 32.5 kg이었어요.')
        s.fill(['32.5는 0.1이 (          )개인 수예요.', '32.5를 읽으면 (                    )예요.',
                '32.5 kg과 32.8 kg 중 더 무거운 것은 (            )이에요.'])
        why(s, '32.5는 0.1이 35개가 아니에요. 그 까닭을 써 보세요.', 1)
        assert P('32.5') // 100 == 325
        ans += '   ⑥ 325, %s, 32.8 kg / 예) 32는 0.1이 320개라서 32.5는 0.1이 325개예요' % read('32.5')
    return ans


def tb2(s, lv):
    s.lesson('2~3', '개념 구축하기(O)', '소수 두 자리 수를 알아볼까요', '0.1보다 작은 수는 어떻게 쓰고 읽을까요?')
    s.scene(None, '“어? 보리에서 싹이 돋았네!” 재윤이가 보리의 키를 재었더니 0.1 m와 0.2 m 사이였어요.')
    step(s, 0, '만져 보기', '보리의 키 재기')
    s.text('0.1 m를 똑같이 10칸으로 나눈 작은 눈금이 있는 자예요.')
    s.picture(fig(svg_line(0, 200, 10, 100, 50, 'm', marks=[(170, '보리 끝')])), width_mm=160)
    s.fill(['보리의 키는 %s 사이예요.' % o(lv, '0 m와 0.1 m', '0.1 m와 0.2 m', '0.2 m와 0.3 m', n=16),
            '보리의 끝은 0.1 m에서 작은 눈금 (      )칸만큼 더 가 있어요.',
            '작은 눈금 한 칸은 1을 똑같이 (        )칸으로 나눈 것 중의 하나예요.',
            '작은 눈금 한 칸의 크기를 분수로 나타내면 %s이에요.' % o(lv, '10분의 1', '100분의 1', '1000분의 1')])
    step(s, 1, '그려 보기', '100분의 17을 소수로')
    s.text('0부터 1까지 작은 눈금이 100분의 1씩 있는 수직선이에요. 0에서 100분의 17만큼 화살표를 그려 보세요.')
    s.picture(fig(svg_line(0, 1000, 10, 100, 50)), width_mm=170)
    s.fill(['100분의 17은 100분의 1이 (      )개예요.',
            '100분의 1 = 0.01이므로 100분의 17은 0.01이 (      )개 → 소수로 (          )',
            '0.17은 %s이라고 읽어요.' % o(lv, '영 점 일칠', '영 점 십칠', n=14)])
    step(s, 2, '말해 보기', '1과 100분의 76을 모눈종이에')
    s.text('모눈종이 한 장 전체가 1이에요. 1과 100분의 76만큼 색칠해 보세요.')
    s.picture(fig(svg_grids([{'v': 0, 'n': 2}])), width_mm=105)
    s.fill(['100분의 76을 소수로 나타내면 (          )이에요.',
            '1과 100분의 76은 1과 0.76만큼이므로 소수로 (          )이에요.',
            '1.76은 1이 (    )개, 0.1이 (    )개, 0.01이 (    )개예요.'])
    step(s, 3, '약속하기', '소수 두 자리 수')
    if lv == '기본형':
        s.wordbox(['0.01', '영 점 영일', '영 점 일칠', '소수 첫째 자리', '소수 둘째 자리', '0.7', '0.06'])
    s.fill(['분수 100분의 1은 소수로 (        )이라 쓰고, (              )이라고 읽어요.',
            '분수 100분의 17은 소수로 0.17이라 쓰고, (              )이라고 읽어요.',
            '1.76에서 7은 (                ) 숫자이고 (      )을 나타내요.',
            '6은 (                ) 숫자이고 (      )을 나타내요.'])
    step(s, 4, '확인하기', '쓰고 읽기, 자릿값')
    s.text('전체 크기가 1인 모눈종이예요. ' + legend(['t', 'h']))
    s.picture(fig(svg_grids([{'v': 640, 'cap': '왼쪽'}, {'v': 280, 'cap': '오른쪽'}])), width_mm=105)
    s.table([['', '0.1의 수', '0.01의 수', '소수', '읽기'], ['왼쪽', '(    )개', '(    )개', '', ''], ['오른쪽', '(    )개', '(    )개', '', '']])
    s.table([['수', '숫자', '몇째 자리 숫자인가요?', '나타내는 수'], ['6.57', '6', '', ''], ['3.19', '9', '', ''], ['8.24', '2', '', '']],
            col_mm=[30, 22, 78, 50])
    s.ask('음료수병에 쓰인 1.77 L는 (                  ) 리터라고 읽어요.', blank=False)
    ans = '2~3차시  ① 0.1 m와 0.2 m, 7, 100, 100분의 1   ② 17, 17, 0.17, 영 점 일칠   ③ 0.76, 1.76, 1·7·6   ④ 0.01, 영 점 영일, 영 점 일칠, 소수 첫째 자리, 0.7, 소수 둘째 자리, 0.06   ' \
          '⑤ 왼쪽 6·4·0.64·%s, 오른쪽 2·8·0.28·%s / 6.57: 일의 자리·6, 3.19: 소수 둘째 자리·0.09, 8.24: 소수 첫째 자리·0.2 / %s' % (
              read('0.64'), read('0.28'), read('1.77'))
    if lv == '도전형':
        step(s, 5, '도전하기', '수학익힘')
        s.picture(fig(svg_grids([{'v': 360, 'cap': '모눈종이'}])), width_mm=55)
        s.fill(['색칠한 부분을 소수로 나타내면 (          )', '2와 100분의 11을 소수로 (          ) 쓰고, (                  )이라고 읽어요.'])
        s.picture(fig(svg_line(8100, 8200, 10, 100, 50, box=8170)), width_mm=150)
        s.fill(['수직선의 □에 알맞은 소수는 (          )',
                '소수 둘째 자리 숫자가 5인 수는 ( ㉠ 6.51 / ㉡ 15.24 / ㉢ 0.85 ) 중 (      )',
                '0.1이 4개, 0.01이 3개인 수는 (          )',
                '리본 115 cm는 (          ) m, 128 cm는 (          ) m예요.'])
        why(s, '0.17을 ‘영 점 십칠’이라고 읽으면 안 되는 까닭을 써 보세요.', 1)
        ans += '   ⑥ 0.36, 2.11, %s, 8.17, ㉢, 0.43, 1.15, 1.28 / 예) 1은 소수 첫째 자리 숫자(0.1), 7은 소수 둘째 자리 숫자(0.07)라서 숫자를 하나씩 읽어요' % read('2.11')
    return ans


def tb3(s, lv):
    s.lesson('4~5', '개념 구축하기(O)', '소수 세 자리 수를 알아볼까요', '0.01보다 작은 수는 어떻게 쓰고 읽을까요?')
    s.scene(None, '재윤이가 저수지 주변 산책로를 따라 걸은 거리는 0.12 km와 0.13 km 사이예요.')
    step(s, 0, '만져 보기', '산책로 거리')
    s.text('0.12 km와 0.13 km 사이를 똑같이 10칸으로 나눈 수직선이에요.')
    s.picture(fig(svg_line(120, 130, 1, 10, 5, 'km', marks=[(125, '재윤')])), width_mm=160)
    s.fill(['재윤이는 0.12 km에서 작은 눈금 (      )칸만큼 더 걸었어요.',
            '작은 눈금 한 칸은 1을 똑같이 (          )칸으로 나눈 것 중의 하나예요.',
            '작은 눈금 한 칸의 크기를 분수로 나타내면 %s이에요.' % o(lv, '10분의 1', '100분의 1', '1000분의 1')])
    step(s, 1, '그려 보기', '1000분의 125를 소수로')
    s.text('0부터 0.13까지 작은 눈금이 1000분의 1씩 있는 수직선이에요. 0에서 1000분의 125만큼 화살표를 그려 보세요.')
    s.picture(fig(svg_line(0, 130, 1, 10, fs=17)), width_mm=176)
    s.fill(['1000분의 125는 1000분의 1이 (        )개예요.',
            '1000분의 1 = 0.001이므로 1000분의 125를 소수로 나타내면 (          )이에요.',
            '0.125는 %s라고 읽어요.' % o(lv, '영 점 백이십오', '영 점 일이오', n=14)])
    step(s, 2, '말해 보기', '1과 1000분의 853을 모눈종이에')
    s.text('0.01 한 칸을 다시 10칸으로 나눈 가는 줄 하나가 0.001이에요. 1과 1000분의 853만큼 색칠해 보세요.')
    s.picture(fig(svg_grids([{'v': 0, 'n': 2, 'div': 1000}])), width_mm=105)
    s.fill(['1000분의 853을 소수로 나타내면 (          )이에요.',
            '1과 1000분의 853을 소수로 나타내면 (          )이에요.',
            '1.853은 1이 (    )개, 0.1이 (    )개, 0.01이 (    )개, 0.001이 (    )개예요.'])
    step(s, 3, '약속하기', '소수 세 자리 수')
    if lv == '기본형':
        s.wordbox(['0.001', '영 점 영영일', '영 점 일이오', '소수 둘째 자리', '소수 셋째 자리', '0.003'])
    s.fill(['분수 1000분의 1은 소수로 (          )이라 쓰고, (              )이라고 읽어요.',
            '분수 1000분의 125는 소수로 0.125라 쓰고, (              )라고 읽어요.',
            '1.853에서 5는 (                ) 숫자이고 0.05를, 3은 (                ) 숫자이고 (        )을 나타내요.'])
    step(s, 4, '확인하기', '쓰고 읽기, 자릿값')
    s.text('전체 크기가 1인 모눈종이예요. ' + legend(['t', 'h', 'k']))
    s.picture(fig(svg_grids([{'v': 378, 'div': 1000, 'cap': '왼쪽', 'zoom': True}, {'v': 805, 'div': 1000, 'cap': '오른쪽', 'zoom': True}])), width_mm=170)
    s.table([['', '소수', '읽기'], ['왼쪽', '', ''], ['오른쪽', '', '']], col_mm=[30, 60, 90])
    s.table([['수', '숫자', '몇째 자리 숫자인가요?', '나타내는 수'], ['2.167', '1', '', ''], ['5.394', '9', '', ''], ['7.475', '5', '', '']],
            col_mm=[30, 22, 78, 50])
    ans = '4~5차시  ① 5, 1000, 1000분의 1   ② 125, 0.125, 영 점 일이오   ③ 0.853, 1.853, 1·8·5·3   ④ 0.001, 영 점 영영일, 영 점 일이오, 소수 둘째 자리, 소수 셋째 자리, 0.003   ' \
          '⑤ 0.378 %s, 0.805 %s / 2.167: 소수 첫째 자리·0.1, 5.394: 소수 둘째 자리·0.09, 7.475: 소수 셋째 자리·0.005' % (read('0.378'), read('0.805'))
    if lv == '도전형':
        step(s, 5, '도전하기', '여러 가지 방법으로 설명하기')
        s.fill(['0.486은 0.1이 (    )개, 0.01이 (    )개, 0.001이 (    )개인 수예요.', '0.486은 0.001이 (          )개인 수예요.',
                '3과 1000분의 294를 소수로 (          ) 쓰고, (                    )라고 읽어요.'])
        s.picture(fig(svg_line(1400, 1410, 1, 10, 5, box=1406)), width_mm=150)
        s.fill(['수직선의 □에 알맞은 소수는 (          )',
                '숫자 7이 0.007을 나타내는 수는 ( 2.472 / 6.527 / 7.035 ) 중 (          )',
                '3과 4 사이, 소수 둘째 자리 숫자 5, 0.1이 8개, 0.001이 9개인 소수 세 자리 수는 (          )'])
        s.text('윤서: “1.053은 일 점 영오삼이라고 읽어.”  지원: “0.001이 1053개인 수야.”  영준: “3은 소수 둘째 자리 숫자이고 0.03을 나타내.”')
        why(s, '1.053을 잘못 설명한 사람을 찾고, 바르게 고쳐 써 보세요.', 1)
        assert read('1.053') == '일 점 영오삼' and P('1.053') == 1053
        ans += '   ⑥ 4·8·6, 486, 3.294, %s, 1.406, 6.527, 3.859 / 영준: 3은 소수 셋째 자리 숫자이고 0.003을 나타내요' % read('3.294')
    return ans


def tb4(s, lv):
    s.lesson(6, '개념 구축하기(O)', '소수의 크기를 비교해 볼까요', '두 소수의 크기는 어떻게 비교할까요?')
    s.scene(None, '며칠 전 태어난 흰토끼의 무게는 0.68 kg, 검은토끼의 무게는 0.42 kg이에요.')
    step(s, 0, '만져 보기', '토끼의 무게만큼 칠하기')
    s.text('모눈 한 칸의 크기는 0.01이에요. 두 모눈종이에 토끼의 무게만큼 칠해 보세요.')
    s.picture(fig(svg_grids([{'v': 0, 'cap': '흰토끼 0.68 kg'}, {'v': 0, 'cap': '검은토끼 0.42 kg'}])), width_mm=110)
    s.fill(['0.68은 0.01이 (      )개, 0.42는 0.01이 (      )개예요.', '더 무거운 토끼는 %s예요.' % o(lv, '흰토끼', '검은토끼')])
    step(s, 1, '그려 보기', '0.3과 0.30')
    s.text('왼쪽에는 0.3만큼(0.1이 3개) 세로 줄로, 오른쪽에는 0.30만큼(0.01이 30개) 한 칸씩 칠해 보세요.')
    s.picture(fig(svg_grids([{'v': 0, 'cap': '0.3'}, {'v': 0, 'cap': '0.30'}])), width_mm=110)
    s.fill('두 모눈종이에 칠한 부분의 크기는 %s.' % o(lv, '같아요', '0.3이 더 커요', '0.30이 더 커요', n=14))
    step(s, 2, '말해 보기', '2.136과 2.135 비교하기')
    place_table(s, [('2.136', '2.136', lv == '기본형'), ('2.135', '2.135', lv == '기본형')], lv, cols=4)
    s.fill(['자연수 부분 → 소수 첫째 자리 → 소수 둘째 자리 → 소수 셋째 자리 차례로 비교하면,',
            '처음으로 숫자가 다른 자리는 (                )예요.   2.136 (    ) 2.135'])
    step(s, 3, '약속하기', '소수의 크기 비교')
    s.fill(['0.3과 0.30은 %s 수예요.' % o(lv, '같은', '다른', n=8),
            '필요한 경우 소수의 %s 끝자리에 0을 붙여서 나타낼 수 있어요.' % o(lv, '오른쪽', '왼쪽', n=8),
            '소수의 크기는 %s부터 소수 첫째 자리, 둘째 자리, 셋째 자리 수를 차례대로 비교해요.' % o(lv, '자연수 부분', '소수 셋째 자리', n=12)])
    step(s, 4, '확인하기', '>, =, < 알맞게 쓰기')
    pairs = [('0.15', '0.21'), ('7.898', '7.893'), ('3.24', '3.240'), ('1.23', '1.4'), ('0.345', '1.12')]
    s.table([[a, '(      )', b] for a, b in pairs[:3]] + [[a, '(      )', b] for a, b in pairs[3:]], header=False, col_mm=[60, 60, 60])
    a5 = ', '.join('%s%s%s' % (a, cmp(a, b), b) for a, b in pairs)
    assert [cmp(a, b) for a, b in pairs] == ['<', '>', '=', '<', '<']
    ans = '6차시  ① 68, 42, 흰토끼   ② 같아요   ③ 소수 셋째 자리, >   ④ 같은, 오른쪽, 자연수 부분   ⑤ %s' % a5
    if lv == '도전형':
        step(s, 5, '도전하기', '수학익힘')
        s.fill(['23.5와 같은 수는 ( ㉠ 20.35 / ㉡ 23.050 / ㉢ 23.05 / ㉣ 23.50 ) 중 (      )',
                '7.24는 0.01이 (        )개, 7.4는 0.01이 (        )개이므로 더 작은 수는 (        )',
                '4.8 (    ) 4.95          1.324 (    ) 1.326',
                '㉠ 0.001이 380개인 수, ㉡ 0.01이 37개, 0.001이 6개인 수 중 더 큰 수는 (      )',
                '㉠ 0.87  ㉡ 1.016  ㉢ 1.01  ㉣ 1.16을 작은 수부터: (                    )',
                '오렌지주스 2.57 L, 포도주스 2.09 L가 남았어요. 더 적게 남은 것은 (            )'])
        why(s, '1.23은 1.4보다 숫자가 많은데 왜 더 작을까요?', 1)
        order = sorted([('㉠', '0.87'), ('㉡', '1.016'), ('㉢', '1.01'), ('㉣', '1.16')], key=lambda t: P(t[1]))
        assert P('0.38') > P('0.376') and cmp('4.8', '4.95') == '<'
        ans += '   ⑥ ㉣, 724, 740, 7.24, <, <, ㉠, %s, 포도주스 / 예) 자연수 부분이 같고 소수 첫째 자리에서 2 < 4이기 때문이에요' % ', '.join(t[0] for t in order)
    return ans


def tb5(s, lv):
    s.lesson(7, '개념 구축하기(O)', '소수 사이의 관계를 알아볼까요', '1, 0.1, 0.01, 0.001 사이에는 어떤 관계가 있을까요?')
    s.scene(None, '새로 태어난 토끼의 잠자리를 부드러운 천으로 만들어요. 크기가 1인 천을 동생은 10조각, 재윤이는 100조각, 할아버지는 1000조각으로 똑같이 나누어 잘랐어요.')
    step(s, 0, '만져 보기', '천 자르기')
    s.picture(fig(svg_grids([{'v': 100, 'div': 10, 'mono': COL['t'], 'cap': '동생(10조각)'},
                             {'v': 10, 'div': 100, 'mono': COL['t'], 'cap': '재윤(100조각)'},
                             {'v': 1, 'div': 1000, 'mono': COL['t'], 'cap': '할아버지(1000조각)', 'zoom': True}])), width_mm=176)
    s.fill(['동생이 자른 한 조각: 10분의 1 = (          )', '재윤이가 자른 한 조각: 100분의 1 = (          )',
            '할아버지가 자른 한 조각: 1000분의 1 = (          )',
            '한 조각의 크기가 가장 큰 사람은 %s이에요.' % o(lv, '동생', '재윤', '할아버지')])
    step(s, 1, '그려 보기', '1, 0.1, 0.01, 0.001의 관계')
    s.picture(fig(svg_rel()), width_mm=140)
    s.fill(['0.1의 10분의 1은 (        )이에요.        1은 0.1의 (      )배예요.',
            '1의 100분의 1은 (        ), 1의 1000분의 1은 (        )이에요.',
            '0.001을 10배 하면 (        ), 100배 하면 (        ), 1000배 하면 (        )이에요.'])
    step(s, 2, '말해 보기', '10배, 10분의 1 하기')
    s.text('자릿값 표에 숫자를 써 보세요. 소수점은 일의 자리와 소수 첫째 자리 사이에 그대로 있어요.')
    seq1 = ['0.716', times('0.716', 1), times('0.716', 2)]
    seq2 = ['3.5', times('3.5', -1), times('3.5', -2)]
    assert seq1[1:] == ['7.16', '71.6'] and seq2[1:] == ['0.35', '0.035']
    place_table(s, [('0.716', '0.716', True), ('10배', seq1[1], False), ('100배', seq1[2], False),
                    ('3.5', '3.5', True), ('10분의 1', seq2[1], False), ('100분의 1', seq2[2], False)], lv)
    s.fill(['0.716 →(10배) (          ) →(10배) (          )', '3.5 →(10분의 1) (          ) →(10분의 1) (          )',
            '10배 하면 소수점을 기준으로 수가 %s으로 한 자리 이동해요.' % o(lv, '왼쪽', '오른쪽', n=8),
            '10분의 1을 하면 소수점을 기준으로 수가 %s으로 한 자리 이동해요.' % o(lv, '왼쪽', '오른쪽', n=8)])
    step(s, 3, '약속하기', '소수 사이의 관계')
    if lv == '기본형':
        s.wordbox(['0.01', '0.001', '1', '왼쪽', '오른쪽'])
    s.fill(['1의 10분의 1은 0.1, 100분의 1은 (        ), 1000분의 1은 (        )이에요.',
            '0.001을 10배 하면 (        ), 100배 하면 0.1, 1000배 하면 (      )이에요.',
            '소수를 10배 하면 수가 (        )으로, 10분의 1을 하면 (        )으로 한 자리 이동해요.'])
    step(s, 4, '확인하기', '알맞은 소수 쓰기')
    a = [times('1.159', 2), times('1.159', 3), times('831', -2), times('831', -3)]
    assert a == ['115.9', '1159', '8.31', '0.831']
    s.fill(['1.159의 100배는 (          )이고, 1000배는 (          )이에요.',
            '831의 100분의 1은 (          )이고, 1000분의 1은 (          )이에요.'])
    s.text('예지: “0.93의 10배인 수야.”   하준: “93의 10분의 1이야.”   다윤: “0.093의 1000배야.”')
    vals = [times('0.93', 1), times('93', -1), times('0.093', 3)]
    assert vals == ['9.3', '9.3', '93']
    s.ask('다른 수를 설명한 사람은 %s이에요.' % o(lv, '예지', '하준', '다윤'), blank=False)
    ans = '7차시  ① 0.1, 0.01, 0.001, 동생   ② 0.01, 10, 0.01, 0.001, 0.01, 0.1, 1   ③ %s → %s, %s → %s, 왼쪽, 오른쪽   ④ 0.01, 0.001, 0.01, 1, 왼쪽, 오른쪽   ⑤ %s, 다윤(예지·하준 9.3, 다윤 93)' % (
        seq1[1], seq1[2], seq2[1], seq2[2], ', '.join(a))
    if lv == '도전형':
        step(s, 5, '도전하기', '수학익힘')
        c1 = [times('0.29', -1), times(times('0.29', -1), 2), times(times(times('0.29', -1), 2), -1)]
        assert c1 == ['0.029', '2.9', '0.29']
        s.fill(['0.29의 10분의 1 = (          ),  0.029의 100배 = (          ),  2.9의 10분의 1 = (          )',
                '잘못 설명한 것: ㉠ 3.4의 10배는 34  ㉡ 0.47의 1000배는 47  ㉢ 1.5의 100분의 1은 0.015  → (      )',
                '0.07인 것을 모두 고르면: ㉠ 0.007의 10배 ㉡ 0.7의 100배 ㉢ 70의 100분의 1 ㉣ 0.7의 10분의 1 → (          )',
                '□가 다른 하나: ㉠ 0.58의 □배는 58  ㉡ 0.031의 □배는 0.31  ㉢ 0.6의 □분의 1은 0.006 → (      )',
                '가장 작은 수: 진호 149의 1000분의 1, 민성 14.9의 10분의 1, 수현 0.149의 100배 → (          )'])
        why(s, '1.159의 100배가 11.59가 아닌 까닭을 써 보세요.', 1)
        assert times('0.47', 3) == '470' and times('0.007', 1) == '0.07' and times('70', -2) == '0.7' and times('0.7', -1) == '0.07'
        assert [times('149', -3), times('14.9', -1), times('0.149', 2)] == ['0.149', '1.49', '14.9']
        ans += '   ⑥ 0.029, 2.9, 0.29, ㉡(470), ㉠·㉣, ㉡(10), 진호 / 예) 100배는 10배를 두 번 한 것이라 수가 왼쪽으로 두 자리 이동해 115.9가 돼요'
    return ans


def tb6(s, lv):
    s.lesson(8, '개념 구축하기(O)', '소수 한 자리 수의 덧셈을 해 볼까요', '소수 한 자리 수의 덧셈은 어떻게 할까요?')
    s.scene(None, '“젖을 짜야 송아지에게 우유를 배불리 먹일 수 있단다.” 할아버지를 도와 재윤이가 짠 우유는 0.6 L이고, 동생이 짠 우유는 0.2 L예요.')
    step(s, 0, '만져 보기', '우유의 양만큼 칠하기')
    s.text('막대 한 칸은 0.1 L예요. 세 막대에 우유의 양만큼 칠해 보세요.')
    s.picture(fig(svg_bars([('재윤', 0, ''), ('동생', 0, ''), ('모두', 0, '')], '1 L')), width_mm=130)
    s.fill(['알맞은 식은 %s이에요.' % o(lv, '0.6+0.2', '0.6−0.2', '6+2'),
            '재윤이와 동생이 짠 우유는 모두 (        ) L예요.'])
    a1 = cq('0.6+0.2', '0.8')
    step(s, 1, '그려 보기', '0.1이 몇 개인지 생각하기')
    s.picture(fig(svg_grids([{'v': 1400, 'div': 10, 'cap': '1.4'}, {'v': 2700, 'div': 10, 'cap': '2.7'}], Sz=200)), width_mm=170)
    s.fill(['1.4는 0.1이 (      )개, 2.7은 0.1이 (      )개예요.', '1.4 + 2.7은 0.1이 (      )개 → 1.4 + 2.7 = (          )'])
    a2 = cq('1.4+2.7', '4.1')
    step(s, 2, '말해 보기', '세로로 계산하기')
    s.text('소수 첫째 자리끼리의 합이 10이거나 10보다 크면 일의 자리로 받아올림해요.' + (' 빨간 점선 칸에 받아올림한 수를 써요.' if lv == '기본형' else ' 답에 소수점도 찍어요.'))
    vert(s, [('1.4', '+', '2.7')], lv, max_mm=60)
    step(s, 3, '약속하기', '소수 한 자리 수의 덧셈 방법')
    s.fill(['① %s의 위치를 맞추어 써요.' % o(lv, '소수점', '오른쪽 끝'),
            '② 자연수의 덧셈과 같이 %s끼리 계산해요.' % o(lv, '같은 자리 수', '다른 자리 수', n=14),
            '③ 소수점을 그대로 %s.' % o(lv, '내려 찍어요', '지워요'),
            '같은 자리 수끼리의 합이 10이거나 10보다 크면 바로 %s로 받아올림해요.' % o(lv, '윗자리', '아랫자리', n=8)])
    step(s, 4, '확인하기', '계산하기')
    a5 = vert(s, [('0.4', '+', '4.1'), ('2.8', '+', '1.4'), ('1.5', '+', '0.3'), ('3.9', '+', '5.5')], lv)
    assert [x.split('=')[1] for x in a5] == ['4.5', '4.2', '1.8', '9.4']
    s.text('“작년에 하준이의 발 길이는 21.7 cm였고, 올해는 작년보다 1.3 cm 더 자랐어요.”')
    s.ask('올해 하준이의 발 길이는?  식: %s   답: (          ) cm' % o(lv, '21.7+1.3', '21.7−1.3', n=14), blank=False)
    a6 = cq('21.7+1.3', '23')
    ans = '8차시  ① 0.6+0.2, %s   ② 14, 27, 41, %s   ③ 1.4+2.7=4.1(소수 첫째 자리 4+7=11, 받아올림 1)   ④ 소수점, 같은 자리 수, 내려 찍어요, 윗자리   ⑤ %s, 21.7+1.3=%s cm' % (
        a1, a2, ', '.join(a5), a6)
    if lv == '도전형':
        step(s, 5, '도전하기', '수학익힘')
        s.fill(['4.7은 0.1이 (      )개, 1.9는 0.1이 (      )개 → 모두 (      )개 → 4.7 + 1.9 = (        )',
                '3.4 + 2.5 = (        )    1.2 + 4.8 = (        )    7.1 + 0.3 = (        )    2.4 + 5.7 = (        )',
                '2.7, 4.3, 3.5, 2.8 중 가장 큰 수와 가장 작은 수의 합은 (        )',
                '민정이는 1.5 km를 걸었고 수호는 민정이보다 0.6 km 더 걸었어요. 수호가 걸은 거리는 (        ) km'])
        why(s, '1.2 + 4.8의 답을 6.0이라고 쓰지 않고 6이라고 써도 되는 까닭을 써 보세요.', 1)
        nums = ['2.7', '4.3', '3.5', '2.8']
        mx, mn = max(nums, key=P), min(nums, key=P)
        ans += '   ⑥ 47, 19, 66, %s, %s, %s, %s, %s, %s, %s km / 예) 6.0은 0.1이 60개로 6과 같은 수라서 끝자리 0은 쓰지 않아도 돼요' % (
            cq('4.7+1.9', '6.6'), cq('3.4+2.5', '5.9'), cq('1.2+4.8', '6'), cq('7.1+0.3', '7.4'), cq('2.4+5.7', '8.1'),
            cq('%s+%s' % (mx, mn), '7'), cq('1.5+0.6', '2.1'))
    return ans


def tb7(s, lv):
    s.lesson(9, '개념 구축하기(O)', '소수 두 자리 수의 덧셈을 해 볼까요', '소수 두 자리 수의 덧셈은 어떻게 할까요?')
    s.scene(None, '“올해는 대추나무에 대추가 많이 열렸구나.” 동생은 대추를 0.35 kg 수확했고, 재윤이는 동생보다 0.23 kg 더 많이 수확했어요.')
    step(s, 0, '만져 보기', '모눈에 이어서 칠하기')
    s.text('모눈 한 칸은 0.01이에요. 연두색은 동생이 수확한 0.35 kg이에요. 이어서 0.23만큼 더 칠해 보세요.')
    s.picture(fig(svg_grids([{'v': 0, 'pre': 35, 'pre_col': COL['h'], 'cap': '연두: 0.35'}])), width_mm=55)
    s.fill(['알맞은 식은 %s이에요.' % o(lv, '0.35+0.23', '0.35−0.23', n=14), '재윤이가 수확한 대추는 (          ) kg이에요.'])
    a1 = cq('0.35+0.23', '0.58')
    step(s, 1, '그려 보기', '0.01이 몇 개인지 생각하기')
    s.fill(['1.82는 0.01이 (        )개예요.', '0.5는 0.01이 (        )개예요.%s' % ('  (0.5 = 0.50)' if lv == '기본형' else ''),
            '1.82 + 0.5는 0.01이 (        )개 → 1.82 + 0.5 = (          )'])
    a2 = cq('1.82+0.5', '2.32')
    step(s, 2, '말해 보기', '소수점을 맞추어 세로로 계산하기')
    if lv == '기본형':
        s.text('두 수의 소수점을 세로로 맞추어 썼어요. 0.5 = 0.50으로 생각해요(회색 0).')
        vert(s, [('1.82', '+', '0.5')], lv, max_mm=60)
    else:
        s.text('빈칸에 두 수를 소수점끼리 맞추어 직접 쓰고 계산해 보세요. 파란 점선 칸이 소수점 자리예요.')
        vert(s, [('1.82', '+', '0.5')], lv, mode='blank', max_mm=60)
    step(s, 3, '약속하기', '소수 두 자리 수의 덧셈 방법')
    s.fill(['소수 두 자리 수의 덧셈도 %s의 위치를 맞추어 쓰고,' % o(lv, '소수점', '오른쪽 끝'),
            '자연수의 덧셈과 같이 %s하여 계산해요.' % o(lv, '받아올림', '받아내림'),
            '자리 수가 다르면 소수의 오른쪽 끝자리에 %s을 붙여 생각할 수 있어요. 그리고 소수점을 그대로 내려 찍어요.' % o(lv, '0', '1', n=6)])
    step(s, 4, '확인하기', '계산하기')
    a5 = vert(s, [('1.73', '+', '3.4'), ('5.09', '+', '4.27'), ('0.28', '+', '0.92'), ('1.65', '+', '0.8')], lv)
    assert [x.split('=')[1] for x in a5] == ['5.13', '9.36', '1.2', '2.45']
    ans = '9차시  ① 0.35+0.23, %s   ② 182, 50, 232, %s   ③ 1.82+0.50=2.32   ④ 소수점, 받아올림, 0   ⑤ %s (1.20=1.2)' % (a1, a2, ', '.join(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '카드로 만든 소수 더하기')
        s.text('카드 [ . ] [ 2 ] [ 4 ] [ 7 ]을 한 번씩 모두 사용하여 소수 두 자리 수를 만들고, 친구가 만든 소수 4.27과의 합을 구해 보세요.')
        s.fill(['내가 만든 소수 (          ) + 4.27 = (          )',
                '밤을 슬기는 1.39 kg, 지호는 1.84 kg 주웠어요. 두 사람이 주운 밤은 모두 (          ) kg',
                '합이 더 큰 것: ㉠ 0.5 + 1.56   ㉡ 0.75 + 1.43  → (      )'])
        why(s, '1.82 + 0.5를 1.87이라고 계산하면 무엇이 틀렸는지 써 보세요.', 1)
        made = ['2.47', '2.74', '4.27', '4.72', '7.24', '7.42']
        sums = ['%s+4.27=%s' % (m, S(ev(m + '+4.27'))) for m in made]
        g1, g2 = ev('0.5+1.56'), ev('0.75+1.43')
        assert g2 > g1
        ans += '   ⑥ (만든 수에 따라) %s, %s, ㉡(%s > %s) / 예) 0.5를 0.05처럼 오른쪽 끝을 맞추어 더했어요. 소수점을 맞추면 2.32예요' % (
            ', '.join(sums), cq('1.39+1.84', '3.23'), S(g2), S(g1))
    return ans


def tb8(s, lv):
    s.lesson(10, '개념 구축하기(O)', '소수 한 자리 수의 뺄셈을 해 볼까요', '소수 한 자리 수의 뺄셈은 어떻게 할까요?')
    s.scene(None, '“할아버지와 할머니 지팡이는 뭐로 만드는 거예요?” “명아주라는 풀의 줄기로 만든단다.” 할아버지의 지팡이는 0.9 m, 할머니의 지팡이는 0.8 m예요.')
    step(s, 0, '만져 보기', '지팡이 길이만큼 칠하기')
    s.text('막대 한 칸은 0.1 m예요. 두 막대에 지팡이의 길이만큼 칠해 보세요.')
    s.picture(fig(svg_bars([('할아버지', 0, ''), ('할머니', 0, '')], '1 m')), width_mm=130)
    s.fill(['알맞은 식은 %s이에요.' % o(lv, '0.9−0.8', '0.9+0.8'), '두 막대는 (      )칸 차이가 나요.',
            '두 지팡이의 길이의 차는 (        ) m예요.'])
    a1 = cq('0.9-0.8', '0.1')
    step(s, 1, '그려 보기', '0.1이 몇 개인지 생각하기')
    s.fill(['6.5는 0.1이 (      )개, 2.8은 0.1이 (      )개예요.', '6.5 − 2.8은 0.1이 (      )개 → 6.5 − 2.8 = (          )'])
    a2 = cq('6.5-2.8', '3.7')
    step(s, 2, '말해 보기', '세로로 계산하기')
    s.text('소수 첫째 자리에서 5에서 8을 뺄 수 없으면 일의 자리에서 받아내림해요.' + (' 빨간 점선 칸에 받아내림한 뒤의 수를 써요.' if lv == '기본형' else ''))
    vert(s, [('6.5', '-', '2.8')], lv, max_mm=60)
    step(s, 3, '약속하기', '소수 한 자리 수의 뺄셈 방법')
    s.fill(['① 소수점의 위치를 %s 써요.' % o(lv, '맞추어', '다르게'),
            '② 자연수의 뺄셈과 같이 같은 자리 수끼리 계산해요. 뺄 수 없으면 바로 %s에서 %s해요.' % (o(lv, '윗자리', '아랫자리', n=8), o(lv, '받아올림', '받아내림', n=8)),
            '③ 소수점을 그대로 %s.' % o(lv, '내려 찍어요', '지워요')])
    step(s, 4, '확인하기', '계산하기')
    a5 = vert(s, [('4.7', '-', '1.2'), ('8.1', '-', '0.7'), ('3.6', '-', '0.4'), ('7.2', '-', '4.9')], lv)
    assert [x.split('=')[1] for x in a5] == ['3.5', '7.4', '3.2', '2.3']
    s.text('“은우는 쓰레기를 주우면서 1 km를 달리는 지역 행사에 참가했어요. 은우가 0.3 km를 달렸다면 도착점까지 몇 km를 더 달려야 할까요?”')
    s.ask('식: %s   답: (          ) km' % o(lv, '1−0.3', '1+0.3'), blank=False)
    a6 = cq('1-0.3', '0.7')
    ans = '10차시  ① 0.9−0.8, 1, %s   ② 65, 28, 37, %s   ③ 6.5−2.8=3.7(일의 자리 6→5, 소수 첫째 자리 15−8=7)   ④ 맞추어, 윗자리, 받아내림, 내려 찍어요   ⑤ %s, 1−0.3=%s km' % (
        a1, a2, ', '.join(a5), a6)
    if lv == '도전형':
        step(s, 5, '도전하기', '카드로 만든 소수 빼기')
        s.text('카드 [ . ] [ 2 ] [ 6 ] [ 3 ] [ 7 ] 중 세 장을 골라 만들 수 있는 가장 작은 소수 한 자리 수를 만들어요.')
        s.fill(['가장 작은 소수 한 자리 수: (        ),   (        ) − 1.6 = (        )',
                '5.4보다 0.7만큼 더 작은 수는 (        )',
                '차가 3.8인 뺄셈식을 말한 사람: 유하 4.9−1.2, 도진 5.1−1.3, 선우 7.3−3.7 → (        )'])
        why(s, '1 − 0.3을 계산할 때 1을 어떻게 생각하면 좋은지 써 보세요.', 1)
        digits = sorted('2637')
        small = '%s.%s' % (digits[0], digits[1])
        assert small == '2.3'
        diffs = {k: ev(e) for k, e in (('유하', '4.9-1.2'), ('도진', '5.1-1.3'), ('선우', '7.3-3.7'))}
        who = [k for k, v in diffs.items() if v == P('3.8')]
        assert who == ['도진']
        ans += '   ⑥ 2.3, %s, %s, 도진 / 예) 1=1.0으로 생각하고 1.0−0.3을 계산하면 0.7이에요' % (cq('2.3-1.6', '0.7'), cq('5.4-0.7', '4.7'))
    return ans


def tb9(s, lv):
    s.lesson(11, '개념 구축하기(O)', '소수 두 자리 수의 뺄셈을 해 볼까요', '소수 두 자리 수의 뺄셈은 어떻게 할까요?')
    s.scene(None, '재윤이와 동생은 할아버지 댁에서 0.74 km 떨어진 밭에 명아주를 보러 갔다가 0.23 km를 돌아왔어요.')
    step(s, 0, '만져 보기', '수직선에 화살표 그리기')
    s.text('작은 눈금 한 칸은 0.01 km예요. 파란 점 0.74에서 왼쪽으로 0.23만큼 화살표를 그려 보세요.')
    s.picture(fig(svg_line(0, 1000, 10, 100, 50, 'km', marks=[(740, '0.74')])), width_mm=170)
    s.fill(['알맞은 식은 %s이에요.' % o(lv, '0.74−0.23', '0.74+0.23', n=14), '할아버지 댁까지 남은 거리는 (          ) km예요.'])
    a1 = cq('0.74-0.23', '0.51')
    step(s, 1, '그려 보기', '0.01이 몇 개인지 생각하기')
    s.fill(['2.2는 0.01이 (        )개, 1.35는 0.01이 (        )개예요.%s' % ('  (2.2 = 2.20)' if lv == '기본형' else ''),
            '2.2 − 1.35는 0.01이 (        )개 → 2.2 − 1.35 = (          )'])
    a2 = cq('2.2-1.35', '0.85')
    step(s, 2, '말해 보기', '소수점을 맞추어 세로로 계산하기')
    if lv == '기본형':
        s.text('2.2 = 2.20으로 생각해요(회색 0). 받아내림이 여러 번 있어요.')
        vert(s, [('2.2', '-', '1.35')], lv, max_mm=60)
    else:
        s.text('빈칸에 두 수를 소수점끼리 맞추어 직접 쓰고 계산해 보세요. 파란 점선 칸이 소수점 자리예요.')
        vert(s, [('2.2', '-', '1.35')], lv, mode='blank', max_mm=60)
    step(s, 3, '약속하기', '소수 두 자리 수의 뺄셈 방법')
    s.fill(['소수 두 자리 수의 뺄셈도 %s의 위치를 맞추어 쓰고,' % o(lv, '소수점', '오른쪽 끝'),
            '자연수의 뺄셈과 같이 %s하여 계산해요.' % o(lv, '받아올림', '받아내림'),
            '자리 수가 다르면 끝자리에 %s을 붙여 생각할 수 있어요. 그리고 소수점을 그대로 내려 찍어요.' % o(lv, '0', '1', n=6)])
    step(s, 4, '확인하기', '계산하기')
    a5 = vert(s, [('5.6', '-', '1.43'), ('4.01', '-', '3.28'), ('0.69', '-', '0.2'), ('2.87', '-', '0.39')], lv)
    assert [x.split('=')[1] for x in a5] == ['4.17', '0.73', '0.49', '2.48']
    ans = '11차시  ① 0.74−0.23, %s   ② 220, 135, 85, %s   ③ 2.20−1.35=0.85   ④ 소수점, 받아내림, 0   ⑤ %s' % (a1, a2, ', '.join(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '□ 안에 들어갈 수')
        s.fill(['8.34 − 4.6 = (          )  →  8.34 − 4.6 < 3.□4 에서 □ 안에 들어갈 수 있는 수: (              )',
                '4.1은 0.01이 (        )개, 1.57은 (        )개 → 4.1 − 1.57 = (          )',
                '8.2 − 2.58 = (          ) → (          ) − 1.79 = (          )',
                '유은이의 키는 1.43 m, 동생의 키는 1.28 m예요. 유은이는 동생보다 (          ) m 더 커요.'])
        why(s, '□ 안에 들어갈 수를 어떻게 찾았는지 써 보세요.', 1)
        r = ev('8.34-4.6')
        ok = [d for d in range(10) if P('3.%d4' % d) > r]
        assert S(r) == '3.74' and ok == [8, 9]
        ans += '   ⑥ 3.74, 8·9, 410, 157, %s, %s, 5.62, %s, %s / 예) 3.74 < 3.□4가 되려면 □가 7보다 커야 해요' % (
            cq('4.1-1.57', '2.53'), cq('8.2-2.58', '5.62'), cq('5.62-1.79', '3.83'), cq('1.43-1.28', '0.15'))
    return ans


FOOD = [('새우볶음밥', '0.5'), ('수제비', '0.9'), ('제육덮밥', '0.8'), ('멸치주먹밥', '0.5'), ('햄치즈샌드위치', '0.7')]


def tb10(s, lv):
    s.lesson(12, '탐구 정리하기(O)', '생각을 더하다 ― 음식에 포함된 나트륨의 양을 권장량과 비교해 볼까요',
             '오늘 먹은 음식의 나트륨의 양은 하루 권장량보다 얼마나 많을까요?')
    s.scene(None, '나트륨은 소금을 이루는 성분 중 하나로 너무 많이 먹으면 건강에 해로워요. 하루 나트륨 권장량은 성인이 2 g, 어린이가 1.5 g이에요.')
    step(s, 0, '이해해요', '미소가 먹은 음식 찾기')
    s.text('미소: “아버지, 저는 오늘 아침에는 멸치주먹밥, 점심에는 새우볶음밥을 먹었어요. 아버지께서는 오늘 뭐 드셨어요?”')
    s.text('아버지: “아침에는 햄치즈 샌드위치, 점심에는 수제비를 먹었지.”   미소: “오늘 저녁 메뉴는 제육덮밥이네.”')
    s.table([['음식'] + [f for f, _ in FOOD], ['나트륨'] + ['%s g' % g for _, g in FOOD], ['미소가 먹은 것 ○'] + [''] * 5],
            header=True, header_col=True, col_mm=[40, 28, 28, 28, 28, 28])
    s.fill(['구하려는 것: 미소가 먹은 나트륨의 양은 어린이의 하루 권장량보다 %s' % o(lv, '몇 g 더 많은지', '몇 g 더 적은지', n=16),
            '어린이의 하루 나트륨 권장량은 (        ) g이에요.'])
    step(s, 1, '계획해요')
    s.choices([('알맞은 계획은?', '( ㉠ 덧셈으로 모두 더한 뒤 뺄셈으로\n권장량과의 차를 구해요 /\n㉡ 권장량에 모두 더해요 /\n㉢ 가장 짠 음식만 비교해요 )'),
               ('미소가 먹은 나트륨의 양을 구하는 식은?', '( 0.5+0.5+0.8 /\n0.7+0.9+0.8 / 0.5+0.9+0.8 )')])
    step(s, 2, '해결해요')
    s.fill(['미소가 먹은 나트륨: 0.5 + 0.5 + 0.8 = (          ) (g)', '권장량과의 차: (          ) − 1.5 = (          ) (g)',
            '미소가 먹은 나트륨의 양은 어린이 권장량보다 (          ) g 더 많아요.'])
    m1 = cq('0.5+0.5+0.8', '1.8')
    m2 = cq('1.8-1.5', '0.3')
    step(s, 3, '되돌아봐요')
    if lv == '기본형':
        s.labeled([('방법', '먼저 세 음식의 나트륨을 (          ) 1.8 g을 구하고, 1.8에서 1.5를 (          ) 0.3 g을 구했어요.'),
                   ('다른 방법', '0.1이 몇 개인지 생각해서 5 + 5 + 8 = (      )개, (      ) − 15 = (      )개이니 0.3 g이에요.'),
                   ('생활', '나트륨을 너무 많이 먹지 않으려면 ______________________________ 해요.')], row_h=4536)
    else:
        for q in ['내가 문제를 해결한 방법을 설명해 보세요.', '다른 방법으로도 해결할 수 있을까요?', '나트륨을 너무 많이 먹지 않으려면 어떻게 하면 좋을까요?']:
            s.ask(q, blank=False)
            s.lines(1)
    step(s, 4, '척척! 내 힘으로', '아버지가 먹은 나트륨')
    s.fill(['아버지가 먹은 음식: (                ), (                ), (                )',
            '아버지가 먹은 나트륨: 0.7 + 0.9 + 0.8 = (          ) (g)', '성인 권장량과의 차: (          ) − 2 = (          ) (g)'])
    f1 = cq('0.7+0.9+0.8', '2.4')
    f2 = cq('2.4-2', '0.4')
    ans = '12차시  ① 멸치주먹밥·새우볶음밥·제육덮밥에 ○, 몇 g 더 많은지, 1.5   ② ㉠, 0.5+0.5+0.8   ③ %s, 1.8, %s, 0.3   ④ %s   ⑤ 햄치즈샌드위치·수제비·제육덮밥, %s, 2.4, %s' % (
        m1, m2, '더해, 빼서, 18, 18, 3' if lv == '기본형' else '(자유) 예) 0.1의 개수로 18개−15개=3개', f1, f2)
    if lv == '도전형':
        step(s, 5, '도전하기', '더 생각해 봐요')
        s.fill(['미소가 저녁에 제육덮밥 대신 새우볶음밥을 먹었다면: 0.5 + 0.5 + 0.5 = (        ) (g)',
                '→ 어린이 권장량과 ( 같아요 / 더 많아요 / 더 적어요 )',
                '오늘 아버지는 미소보다 나트륨을 2.4 − 1.8 = (        ) g 더 먹었어요.'])
        why(s, '2.4 − 2를 2.2라고 계산하면 안 되는 까닭을 써 보세요.', 1)
        ans += '   ⑥ %s, 같아요, %s / 예) 2는 0.2가 아니에요. 2=2.0으로 생각해 소수점을 맞추면 0.4예요' % (cq('0.5+0.5+0.5', '1.5'), cq('2.4-1.8', '0.6'))
    return ans


def teams_data():
    T = [('1모둠', '5.47', '5.47'), ('2모둠', '5.83', '5.38'), ('3모둠', '5.09', '5.09'), ('4모둠', '5.62', '5.62')]
    valid = [(n, a) for n, a, b in T if a == b]
    by = sorted(valid, key=lambda t: P(t[1]))
    conds = [('가장 큰 소수를 쓴 모둠', by[-1][0]), ('가장 작은 소수를 쓴 모둠', by[0][0]), ('두 번째로 큰 소수를 쓴 모둠', by[-2][0])]
    return T, conds


def tb11(s, lv):
    s.lesson(13, '발표하기(P)', '놀이를 더하다 ― 소수를 수어로 표현할 수 있다고?',
             '소수를 수어로 전달하고, 전달받은 소수의 크기를 어떻게 비교할까요?')
    s.scene(None, '4명씩 모둠을 만들어 첫 번째 사람이 쓴 소수 두 자리 수를 수어로 차례로 전달해요. 마지막 사람이 쓴 소수와 같으면 조건 카드에 맞는 모둠이 1점을 얻어요.')
    step(s, 0, '놀이 방법 알기')
    s.choices([('첫 번째 사람은 스케치북에 어떤 수를 쓰나요?', '( 일의 자리 수와 뽑은 카드 두 장으로\n만든 소수 두 자리 수 / 아무 자연수 )'),
               ('수어는 어느 방향으로 표현하나요?', '( 친구가 보는 방향 / 내가 보는 방향 )'),
               ('마지막 사람과 첫 번째 사람이 쓴 소수가 다르면?', '( 점수를 얻을 수 없어요 / 1점을 얻어요 )'),
               ('이기려면 무엇을 잘해야 할까요? (모두)', '( 수어를 정확하게 표현하기 /\n소수의 크기 비교하기 / 빨리 소리치기 )')])
    step(s, 1, '수 카드 뽑기')
    s.text('선생님이 알려 준 일의 자리 수는 3이에요. 주머니에서 뽑은 카드는 차례대로 7, 2예요. (첫 번째 카드는 소수 첫째 자리, 두 번째 카드는 소수 둘째 자리)')
    s.fill(['스케치북에 쓴 소수: (          )   읽기: (                    )',
            '소수 첫째 자리 숫자 7은 (        )을, 소수 둘째 자리 숫자 2는 (        )를 나타내요.'])
    if lv == '도전형':
        s.ask('내가 뽑은 카드로: 일의 자리 (    ), 카드 (    ), (    ) → 소수 (          ), 읽기 (                    )', blank=False)
    step(s, 2, '조건 카드')
    T, conds = teams_data()
    s.table([['모둠', '첫 번째 사람', '마지막 사람', '점수를 얻을 수 있나요?']] + [[n, a, b, ''] for n, a, b in T], col_mm=[30, 40, 40, 70])
    s.table([['조건 카드', '1점을 얻는 모둠']] + [[c, ''] for c, _ in conds], col_mm=[110, 70])
    step(s, 3, '또 다른 놀이', '더 큰 소수에 ○')
    pairs = [('9.35', '9.53'), ('9.62', '9.58'), ('9.07', '9.70'), ('9.41', '9.14'), ('9.89', '9.98'), ('9.26', '9.29')]
    s.table([[a, b] for a, b in pairs[:3]], header=False)
    s.table([[a, b] for a, b in pairs[3:]], header=False)
    big = [a if P(a) > P(b) else b for a, b in pairs]
    step(s, 4, '되돌아보기')
    if lv == '기본형':
        s.labeled([('비교 방법', '일의 자리 수가 같으면 (                ) 수를 비교하고, 그것도 같으면 (                ) 수를 비교했어요.'),
                   ('배려', '친구가 잘 볼 수 있게 ______________________________ 표현했어요.')], row_h=4536)
    else:
        for q in ['두 소수 두 자리 수의 크기를 어떻게 비교했나요?', '수어로 전달할 때 친구를 위해 어떤 점을 배려했나요?']:
            s.ask(q, blank=False)
            s.lines(1)
    ans = '13차시  ① 소수 두 자리 수, 친구가 보는 방향, 점수를 얻을 수 없어요, 수어·크기 비교   ② 3.72, %s, 0.7, 0.02   ③ 2모둠은 못 얻음, %s   ④ %s   ⑤ %s' % (
        read('3.72'), ', '.join('%s→%s' % (c, t) for c, t in conds), ', '.join(big),
        '소수 첫째 자리, 소수 둘째 자리 / (자유)' if lv == '기본형' else '(자유)')
    if lv == '도전형':
        step(s, 5, '도전하기', '전달한 소수 비교하기')
        s.fill(['4.37, 4.73, 4.07 중 가장 큰 소수는 (          )', '9.58 (    ) 9.6          6.05 (    ) 6.50',
                '2.81, 2.18, 2.8 중 가장 작은 소수는 (          )'])
        why(s, '9.58과 9.6 중 어느 것이 더 큰지 까닭을 써 보세요.', 1)
        ans += '   ⑥ %s, %s, %s, %s / 예) 9.6=9.60이고 소수 첫째 자리에서 5 < 6이라서 9.6이 더 커요' % (
            max(['4.37', '4.73', '4.07'], key=P), cmp('9.58', '9.6'), cmp('6.05', '6.50'), min(['2.81', '2.18', '2.8'], key=P))
    return ans


def tb12(s, lv):
    s.lesson(14, '발표하기(P)', '공부한 내용을 확인해요', '소수의 덧셈과 뺄셈 단원에서 배운 내용을 잘 알고 있나요?')
    s.scene(None, '척척! 내 힘으로 풀고, 꼭꼭! 확인하고 정리해요.')
    step(s, 0, '쓰고 읽기')
    s.fill(['이 점 팔구오는 (          )라고 써요.          5.09는 (                    )라고 읽어요.',
            '0.01이 48개인 수는 (          )이에요.          1.603은 0.001이 (          )개예요.',
            '4.592의 5는 0.5를 나타내요. 0.351의 5는 (          ), 1.285의 5는 (          )를 나타내요.'])
    assert read('2.895') == '이 점 팔구오'
    step(s, 1, '계산하기')
    a2 = vert(s, [('0.6', '+', '2.1'), ('5.7', '-', '1.9'), ('3.64', '+', '3.88'), ('4.3', '-', '2.56')], lv)
    assert [x.split('=')[1] for x in a2] == ['2.7', '3.8', '7.52', '1.74']
    step(s, 2, '관계와 크기')
    s.choices([('0.007의 100배와 나타내는 수가 같은 것은?', '( 0.07의 10배 / 7의 100분의 1 )'),
               ('0.7의 10분의 1과 나타내는 수가 같은 것은?', '( 0.07의 10배 / 7의 100분의 1 )')])
    s.ask('㉠ 4.295  ㉡ 4.286  ㉢ 5.28을 큰 수부터 차례대로: (                    )', blank=False)
    assert times('0.007', 2) == times('0.07', 1) == '0.7' and times('0.7', -1) == times('7', -2) == '0.07'
    order = [k for k, _ in sorted([('㉠', '4.295'), ('㉡', '4.286'), ('㉢', '5.28')], key=lambda t: -P(t[1]))]
    step(s, 3, '잘못 고치기', '★')
    s.text('누군가 3.8 + 5.76을 아래처럼 계산했어요.')
    assert S(P('0.38') + P('5.76')) == '6.14'
    s.picture(fig(svg_chars([['', '', '3', '.', '8'], ['+', '5', '.', '7', '6'], ['', '6', '.', '1', '4']], '잘못 계산한 세로셈')), width_mm=50)
    s.ask('잘못 계산한 까닭은 %s' % o(lv, '소수점의 위치를 맞추어 쓰지 않았어요', '받아올림을 하지 않았어요', '자연수 부분만 더했어요', n=30), blank=False)
    s.text('옳게 계산해 보세요.')
    vert(s, [('3.8', '+', '5.76')], lv, mode='given' if lv == '기본형' else 'blank', max_mm=60)
    step(s, 4, '꼭꼭! 색칠하기')
    labels = {'earL': '1.7', 'earR': '1.7', 'head': '5.16', 'body': '3.5', 'carrot': '2.97', 'grass': '4.16', 'sun': '4.5'}
    a5 = color_task(s, [('1.2+0.5', '분홍'), ('2.67+2.49', '하늘'), ('5.3-1.8', '주황'), ('4.38-1.41', '연두')], labels, RNAME, lv)
    ans = '14차시  ① 2.895, %s, 0.48, 1603, 0.05, 0.005   ② %s   ③ 0.07의 10배, 7의 100분의 1, %s   ④ 소수점의 위치를 맞추어 쓰지 않았어요, 3.80+5.76=%s   ⑤ %s' % (
        read('5.09'), ', '.join(a2), ', '.join(order), cq('3.8+5.76', '9.56'), a5)
    if lv == '도전형':
        step(s, 5, '도전하기', '★★ 남은 음료수')
        s.text('음료수 2 L 중에서 하준이는 0.35 L, 채아는 0.26 L를 마셨어요.')
        s.fill(['두 사람이 마신 양: 식 (                    ) = (          ) L', '남은 양: 2 − (          ) = (          ) L'])
        why(s, '2 − 0.61을 계산할 때 2를 어떻게 생각하면 좋은지 써 보세요.', 1)
        ans += '   ⑥ 0.35+0.26=%s, %s / 예) 2=2.00으로 생각하고 소수점을 맞추어 빼요' % (cq('0.35+0.26', '0.61'), cq('2-0.61', '1.39'))
    return ans


# ================================================================ 이야기 버전
def st1(s, lv):
    s.lesson(1, '개념 찾기(S)', '운동회 기록원이 되었어요', '운동회 기록에는 어떤 소수가 쓰이고, 소수를 더하고 빼야 할 때는 언제일까요?')
    s.scene(None, '햇살초등학교 가을 운동회 날, 4학년 2반은 ‘기록원 모둠’을 맡았어요. 기록 반장 윤서와 민재, 하린, 도현, 수아가 줄자·초시계·계량컵을 들고 운동장을 누벼요.')
    step(s, 0, '만져 보기', '보기·생각하기·궁금해하기')
    s.table([['종목', '이름', '기록'], ['멀리뛰기', '민재', '1.37 m'], ['50 m 달리기', '하린', '9.48초'], ['공 던지기', '도현', '18.6 m'],
             ['물 마시기', '수아', '0.246 L']], col_mm=[70, 50, 60])
    if lv == '기본형':
        s.labeled([('보여요', '기록판에 ______________________________ 이 보여요.'),
                   ('생각해요', '____________________ 할 때 소수를 더하거나 빼야 할 것 같아요.'),
                   ('궁금해요', '______________________________ 은 어떻게 할까?')])
    else:
        for q in ['보여요: 기록판에서 보이는 것', '생각해요: 소수를 쓰거나 계산할 일', '궁금해요: 소수에 대해 궁금한 것']:
            s.ask(q, blank=False)
            s.lines(1)
    step(s, 1, '그려 보기', '0.1 떠올리기')
    s.text('준비 운동으로 줄넘기 줄을 재요. 1 m를 똑같이 10칸으로 나눈 막대에 하린이의 줄 0.7 m만큼 칠해 보세요.')
    s.picture(fig(svg_bars([('하린이의 줄', 0, '')], '1 m')), width_mm=125)
    s.fill(['1 m를 똑같이 10칸으로 나눈 한 칸은 (        ) m예요.', '0.7은 0.1이 (      )개인 수예요.', '0.1이 13개인 수는 (        )이에요.'])
    step(s, 2, '말해 보기', '소수로 적는 기록')
    s.text('소수로 나타내기에 알맞은 기록에 모두 ○ 하세요.')
    s.choices([('멀리뛰기 거리', '(    )'), ('50 m 달리기에 걸린 시간', '(    )'), ('마신 물의 양', '(    )'), ('이어달리기에 나간 학생 수', '(    )')])
    then_why(s, '운동회 기록을 자연수가 아니라 소수로 적으면 좋은 점은 무엇일까요?', lv,
             '소수로 적으면 1 m나 1초보다 (          ) 부분까지 적을 수 있어서 기록을 더 (          ) 나타낼 수 있어요.')
    step(s, 3, '약속하기', '소수 한 자리 수 떠올리기')
    s.fill(['0.6 (    ) 0.8          1.4 (    ) 1.2', '2.5를 읽으면 (                )예요.',
            '공 던지기 18.6 m와 18.4 m 중 더 멀리 던진 기록은 (          )예요.'])
    step(s, 4, '확인하기', '더할까, 뺄까?')
    s.choices([('민재가 멀리뛰기 연습에서 두 번 뛴 거리를 모두 합하면?', '( 덧셈 / 뺄셈 )'),
               ('물 1 L 중에서 수아가 마시고 남은 물은?', '( 덧셈 / 뺄셈 )'),
               ('도현이는 민재보다 공을 몇 m 더 멀리 던졌을까?', '( 덧셈 / 뺄셈 )'),
               ('이어달리기 1구간과 2구간의 거리를 합하면?', '( 덧셈 / 뺄셈 )')])
    ans = '1차시  ① (자유)   ② 0.1, 7, 1.3   ③ 멀리뛰기 거리·걸린 시간·물의 양에 ○ / %s   ④ %s, %s, %s, 18.6 m   ⑤ 덧셈, 뺄셈, 뺄셈, 덧셈' % (
        '작은, 정확하게' if lv == '기본형' else '예) 1 m나 1초보다 작은 부분까지 적어 더 정확하고, 비슷한 기록도 가릴 수 있어요',
        cmp('0.6', '0.8'), cmp('1.4', '1.2'), read('2.5'))
    if lv == '도전형':
        step(s, 5, '도전하기', '도현이의 공 던지기 기록')
        s.fill(['18.6은 0.1이 (          )개인 수예요.', '18.6을 읽으면 (                    )이에요.',
                '0.4보다 0.1이 3개 더 많은 수는 (        )이에요.'])
        why(s, '18.6이 0.1이 86개가 아닌 까닭을 써 보세요.', 1)
        ans += '   ⑥ 186, %s, %s / 예) 18은 0.1이 180개라서 18.6은 0.1이 186개예요' % (read('18.6'), cq('0.4+0.3', '0.7'))
    return ans


def st2(s, lv):
    s.lesson(2, '개념 구축하기(O)', '멀리뛰기 기록을 재요 ― 소수 두 자리 수', '0.1보다 작은 부분까지 기록하려면 어떻게 할까요?')
    s.scene(None, '민재가 제자리 멀리뛰기를 했어요. 발뒤꿈치가 닿은 곳은 1.3 m와 1.4 m 사이예요. 0.1 m씩 나뉜 줄자의 칸이 다시 똑같이 10칸으로 나뉘어 있어요.')
    step(s, 0, '만져 보기', '민재의 멀리뛰기')
    s.picture(fig(svg_line(1000, 1500, 10, 100, 50, 'm', marks=[(1370, '민재')])), width_mm=170)
    s.fill(['민재의 기록은 %s 사이예요.' % o(lv, '1.2 m와 1.3 m', '1.3 m와 1.4 m', '1.4 m와 1.5 m', n=16),
            '1.3 m에서 작은 눈금 (      )칸만큼 더 갔어요.',
            '작은 눈금 한 칸은 1을 똑같이 (        )칸으로 나눈 것 중의 하나예요.',
            '작은 눈금 한 칸의 크기를 분수로 나타내면 %s이에요.' % o(lv, '10분의 1', '100분의 1', '1000분의 1')])
    step(s, 1, '그려 보기', '구름판 표시 붙이기')
    s.text('윤서는 출발선에서 100분의 23 m 앞에 구름판 표시 테이프를 붙이려고 해요. 0에서 100분의 23만큼 화살표를 그려 보세요.')
    s.picture(fig(svg_line(0, 1000, 10, 100, 50, 'm')), width_mm=170)
    s.fill(['100분의 23은 100분의 1이 (      )개예요.', '100분의 1 = 0.01이므로 100분의 23은 0.01이 (      )개 → 소수로 (          )',
            '0.23은 %s이라고 읽어요.' % o(lv, '영 점 이삼', '영 점 이십삼', n=14)])
    step(s, 2, '말해 보기', '민재의 기록을 모눈에')
    s.text('민재의 기록 1과 100분의 37 m만큼 모눈종이에 색칠해 보세요. 모눈종이 한 장 전체가 1이에요.')
    s.picture(fig(svg_grids([{'v': 0, 'n': 2}])), width_mm=105)
    s.fill(['100분의 37을 소수로 나타내면 (          )이에요.', '1과 100분의 37은 소수로 (          )이에요.',
            '1.37은 1이 (    )개, 0.1이 (    )개, 0.01이 (    )개예요.'])
    then_why(s, '민재의 기록 1.37을 ‘일 점 삼십칠’이라고 읽으면 안 되는 까닭은 무엇일까요?', lv,
             '3은 (                ) 숫자로 0.3을, 7은 (                ) 숫자로 0.07을 나타내요. 그래서 소수점 아래 숫자는 하나씩 ‘(                )’이라고 읽어요.')
    step(s, 3, '약속하기', '소수 두 자리 수')
    s.fill(['분수 100분의 1은 소수로 %s이라 쓰고, %s이라고 읽어요.' % (o(lv, '0.1', '0.01', '0.001', n=8), o(lv, '영 점 일', '영 점 영일', n=12)),
            '1.37에서 3은 %s 숫자이고 %s을 나타내요.' % (o(lv, '일의 자리', '소수 첫째 자리', '소수 둘째 자리', n=16), o(lv, '3', '0.3', '0.03', n=8)),
            '7은 %s 숫자이고 %s을 나타내요.' % (o(lv, '소수 첫째 자리', '소수 둘째 자리', n=16), o(lv, '0.7', '0.07', n=8))])
    step(s, 4, '확인하기', '기록 쓰고 읽기')
    s.text('전체 크기가 1인 모눈종이예요. ' + legend(['t', 'h']))
    s.picture(fig(svg_grids([{'v': 520, 'cap': '왼쪽'}, {'v': 90, 'cap': '오른쪽'}])), width_mm=105)
    s.table([['', '0.1의 수', '0.01의 수', '소수', '읽기'], ['왼쪽', '(    )개', '(    )개', '', ''], ['오른쪽', '(    )개', '(    )개', '', '']])
    s.table([['친구들의 기록', '숫자', '몇째 자리 숫자인가요?', '나타내는 수'], ['하린 1.48 m', '4', '', ''], ['도현 1.65 m', '5', '', ''],
             ['구름판 3.07 m', '3', '', '']], col_mm=[42, 20, 70, 48])
    ans = '2차시  ① 1.3 m와 1.4 m, 7, 100, 100분의 1   ② 23, 23, 0.23, 영 점 이삼   ③ 0.37, 1.37, 1·3·7 / %s   ④ 0.01, 영 점 영일, 소수 첫째 자리, 0.3, 소수 둘째 자리, 0.07   ' \
          '⑤ 왼쪽 5·2·0.52·%s, 오른쪽 0·9·0.09·%s / 1.48: 소수 첫째 자리·0.4, 1.65: 소수 둘째 자리·0.05, 3.07: 일의 자리·3' % (
              '소수 첫째 자리, 소수 둘째 자리, 일 점 삼칠' if lv == '기본형' else '예) 3은 0.3, 7은 0.07을 나타내므로 숫자를 하나씩 ‘일 점 삼칠’로 읽어요',
              read('0.52'), read('0.09'))
    if lv == '도전형':
        step(s, 5, '도전하기', '기록원 수첩')
        s.fill(['수아의 멀리뛰기 기록 145 cm를 m로 나타내면 (          ) m예요.'])
        s.picture(fig(svg_line(1200, 1300, 10, 100, 50, box=1260)), width_mm=150)
        s.fill(['수직선의 □에 알맞은 소수는 (          )', '0.1이 8개, 0.01이 5개인 수는 (          )예요.'])
        why(s, '145 cm가 14.5 m가 아닌 까닭을 써 보세요.', 1)
        ans += '   ⑥ 1.45, 1.26, 0.85 / 예) 1 m=100 cm이므로 1 cm=0.01 m이고, 145 cm는 0.01 m가 145개라서 1.45 m예요'
    return ans


def st3(s, lv):
    s.lesson(3, '개념 구축하기(O)', '마신 물의 양을 재요 ― 소수 세 자리 수', '0.01보다 작은 양은 어떻게 쓰고 읽을까요?')
    s.scene(None, '달리기를 마친 수아가 물을 마셨어요. 계량컵으로 재어 보니 0.24 L와 0.25 L 사이였어요.')
    step(s, 0, '만져 보기', '수아가 마신 물')
    rule_first(s, '0.01을 다시 똑같이 10칸으로 나누면 작은 눈금 한 칸은 얼마일까요?')
    s.picture(fig(svg_line(240, 250, 1, 10, 5, 'L', marks=[(246, '수아')])), width_mm=160)
    s.fill(['수아가 마신 물은 0.24 L에서 작은 눈금 (      )칸만큼 더 있어요.',
            '작은 눈금 한 칸은 1을 똑같이 (          )칸으로 나눈 것 중의 하나예요.',
            '작은 눈금 한 칸의 크기를 분수로 나타내면 %s이에요.' % o(lv, '10분의 1', '100분의 1', '1000분의 1')])
    s.ask('예상이 맞았나요?  ( 맞았어요 / 고쳤어요 )', blank=False)
    step(s, 1, '그려 보기', '1000분의 246을 소수로')
    s.text('수아가 마신 물의 양을 분수로 나타내면 1000분의 246 L예요.')
    s.fill(['1000분의 246은 1000분의 1이 (        )개예요.', '1000분의 1은 소수로 (          )이라 쓰고, (                )이라고 읽어요.',
            '1000분의 246은 0.001이 246개 → 소수로 (          )',
            '0.246은 %s이라고 읽어요.' % o(lv, '영 점 이사육', '영 점 이백사십육', n=14)])
    step(s, 2, '말해 보기', '모둠이 마신 물')
    s.text('기록원 모둠 다섯 명이 마신 물을 모두 모아 재었더니 1과 1000분의 358 L였어요. 모눈종이에 색칠해 보세요. 0.01 한 칸을 다시 10줄로 나누었어요.')
    s.picture(fig(svg_grids([{'v': 0, 'n': 2, 'div': 1000}])), width_mm=105)
    s.fill(['1000분의 358을 소수로 나타내면 (          )이에요.', '1과 1000분의 358은 소수로 (          )이에요.',
            '1.358은 1이 (    )개, 0.1이 (    )개, 0.01이 (    )개, 0.001이 (    )개예요.'])
    then_why(s, '1.358은 0.001이 몇 개인 수일까요? 어떻게 세었는지 말해 봐요.', lv,
             '1은 0.001이 (          )개, 0.358은 0.001이 (        )개라서 모두 (          )개예요.')
    step(s, 3, '약속하기', '소수 세 자리 수')
    s.fill(['분수 1000분의 1은 소수로 %s이라 쓰고, %s이라고 읽어요.' % (o(lv, '0.01', '0.001', n=8), o(lv, '영 점 영일', '영 점 영영일', n=12)),
            '1.358에서 8은 %s 숫자이고 %s을 나타내요.' % (o(lv, '소수 둘째 자리', '소수 셋째 자리', n=16), o(lv, '0.08', '0.008', n=8)),
            '1.358은 0.001이 %s인 수예요.' % o(lv, '358개', '1358개', n=8)])
    step(s, 4, '확인하기', '물의 양 쓰고 읽기')
    s.text('전체 크기가 1인 모눈종이예요. ' + legend(['t', 'h', 'k']))
    s.picture(fig(svg_grids([{'v': 427, 'div': 1000, 'cap': '윤서', 'zoom': True}, {'v': 603, 'div': 1000, 'cap': '도현', 'zoom': True}])), width_mm=170)
    s.table([['', '소수(L)', '읽기'], ['윤서', '', ''], ['도현', '', '']], col_mm=[30, 60, 90])
    s.table([['수', '숫자', '몇째 자리 숫자인가요?', '나타내는 수'], ['2.519', '1', '', ''], ['4.086', '6', '', '']], col_mm=[30, 22, 78, 50])
    ans = '3차시  ① (예상 자유) 6, 1000, 1000분의 1   ② 246, 0.001, 영 점 영영일, 0.246, 영 점 이사육   ③ 0.358, 1.358, 1·3·5·8 / %s   ④ 0.001, 영 점 영영일, 소수 셋째 자리, 0.008, 1358개   ' \
          '⑤ 0.427 %s, 0.603 %s / 2.519: 소수 둘째 자리·0.01, 4.086: 소수 셋째 자리·0.006' % (
              '1000, 358, 1358' if lv == '기본형' else '예) 1은 0.001이 1000개, 0.358은 358개라서 1358개', read('0.427'), read('0.603'))
    if lv == '도전형':
        step(s, 5, '도전하기', '조건에 맞는 소수')
        s.fill(['5와 6 사이, 소수 둘째 자리 숫자는 3, 0.1이 7개, 0.001이 2개인 소수 세 자리 수는 (          )',
                '0.001이 2075개인 수는 (          )', '도현이가 잰 거리 16.408 m를 읽으면 (                        )'])
        why(s, '0.001이 2075개인 수가 20.75가 아닌 까닭을 써 보세요.', 1)
        assert S(2075) == '2.075'
        ans += '   ⑥ 5.732, 2.075, %s / 예) 0.001이 1000개이면 1이므로 2000개는 2, 75개는 0.075라서 2.075예요' % read('16.408')
    return ans


def st4(s, lv):
    s.lesson(4, '개념 구축하기(O)', '누구 기록이 더 클까요 ― 소수의 크기 비교', '자리 수가 다른 소수는 어떻게 비교할까요?')
    s.scene(None, '윤서 모둠은 물을 0.64 L, 민재 모둠은 0.46 L 마셨어요.')
    step(s, 0, '만져 보기', '물을 더 많이 마신 모둠')
    s.text('모눈 한 칸이 0.01이에요. 두 모둠이 마신 양만큼 모눈을 칠해 보세요.')
    s.picture(fig(svg_grids([{'v': 0, 'cap': '윤서 모둠 0.64 L'}, {'v': 0, 'cap': '민재 모둠 0.46 L'}])), width_mm=110)
    s.fill(['0.64는 0.01이 (      )개, 0.46은 0.01이 (      )개예요.', '물을 더 많이 마신 모둠은 %s이에요.' % o(lv, '윤서 모둠', '민재 모둠')])
    step(s, 1, '그려 보기', '0.5와 0.50')
    rule_first(s, '0.5와 0.50 중 어느 것이 더 클까요?')
    s.text('도현이의 물병에는 ‘0.5 L’, 하린이의 물병에는 ‘0.50 L’라고 쓰여 있어요. 0.5는 세로 줄(0.1)로, 0.50은 한 칸(0.01)씩 칠해 보세요.')
    s.picture(fig(svg_grids([{'v': 0, 'cap': '0.5 L'}, {'v': 0, 'cap': '0.50 L'}])), width_mm=110)
    s.fill(['0.5는 0.1이 (      )개, 0.50은 0.01이 (      )개예요.', '0.5와 0.50은 %s.' % o(lv, '크기가 같아요', '0.50이 더 커요', '0.5가 더 커요', n=14)])
    s.ask('예상이 맞았나요?  ( 맞았어요 / 고쳤어요 )', blank=False)
    step(s, 2, '말해 보기', '공 던지기 기록 비교')
    s.text('공 던지기에서 도현이는 18.25 m, 민재는 18.3 m를 던졌어요. 자릿값 표에 숫자를 쓰고 높은 자리부터 비교해 보세요.')
    place_table(s, [('도현 18.25', '18.25', lv == '기본형'), ('민재 18.3', '18.3', lv == '기본형')], lv)
    s.fill(['처음으로 숫자가 다른 자리는 (                )예요.   18.25 (    ) 18.3   → 더 멀리 던진 사람: (        )'])
    then_why(s, '18.25는 숫자가 더 많은데 왜 18.3보다 작을까요?', lv,
             '자연수 부분 18은 (        )고, 소수 첫째 자리에서 (    )가 (    )보다 작기 때문이에요.')
    step(s, 3, '약속하기', '소수의 크기 비교')
    s.fill(['0.5와 0.50은 %s예요.' % o(lv, '같은 수', '다른 수', n=8),
            '필요한 경우 소수의 %s에 0을 붙여서 나타낼 수 있어요.' % o(lv, '오른쪽 끝자리', '왼쪽 끝자리', n=12),
            '소수의 크기는 %s부터 높은 자리 수를 차례대로 비교해요.' % o(lv, '자연수 부분', '소수 맨 끝자리', n=12)])
    step(s, 4, '확인하기', '기록 비교하기')
    pairs = [('0.29', '0.3'), ('6.784', '6.781'), ('2.7', '2.700')]
    s.table([[a, '(      )', b] for a, b in pairs], header=False, col_mm=[60, 60, 60])
    s.ask('50 m 달리기: 하린 9.48초, 수아 9.5초 → 더 빨리 달린 사람은 %s' % o(lv, '하린', '수아'), blank=False)
    assert [cmp(a, b) for a, b in pairs] == ['<', '>', '='] and P('9.48') < P('9.5')
    ans = '4차시  ① 64, 46, 윤서 모둠   ② (예상 자유) 5, 50, 크기가 같아요   ③ 소수 첫째 자리, <, 민재 / %s   ④ 같은 수, 오른쪽 끝자리, 자연수 부분   ⑤ %s, 하린' % (
        '같, 2, 3' if lv == '기본형' else '예) 자연수 부분은 같고 소수 첫째 자리에서 2 < 3이기 때문이에요',
        ', '.join('%s%s%s' % (a, cmp(a, b), b) for a, b in pairs))
    if lv == '도전형':
        step(s, 5, '도전하기', '공 던지기 순위')
        s.fill(['기록 ㉠ 17.9 m ㉡ 18.06 m ㉢ 18.1 m ㉣ 17.95 m를 먼 것부터 차례대로: (                    )',
                '㉠ 0.001이 520개인 수  ㉡ 0.01이 51개, 0.001이 9개인 수 중 더 큰 수는 (      )'])
        why(s, '18.06과 18.1 중 어느 기록이 더 먼지 까닭을 써 보세요.', 1)
        rec = [('㉠', '17.9'), ('㉡', '18.06'), ('㉢', '18.1'), ('㉣', '17.95')]
        order = [k for k, _ in sorted(rec, key=lambda t: -P(t[1]))]
        assert order == ['㉢', '㉡', '㉣', '㉠'] and 520 > 519
        ans += '   ⑥ %s, ㉠(0.52 > 0.519) / 예) 18.1=18.10이고 소수 첫째 자리에서 0 < 1이라서 18.1이 더 멀어요' % ', '.join(order)
    return ans


def st5(s, lv):
    s.lesson(5, '개념 구축하기(O)', '물을 나누어 담아요 ― 소수 사이의 관계', '10배 하거나 10분의 1을 하면 소수는 어떻게 변할까요?')
    s.scene(None, '물 당번 하린이가 물을 준비해요. 컵 하나에 0.245 L씩 담고, 큰 물통의 물 36 L를 10모둠에 똑같이 나누고, 한 모둠의 물을 다시 10명에게 똑같이 나누어요.')
    step(s, 0, '만져 보기', '물 당번 하린이')
    rule_first(s, '어떤 소수를 10배 하면 숫자들은 어느 쪽으로 움직일까요?')
    q1 = ['0.245', times('0.245', 1), times('0.245', 2)]
    q2 = ['36', times('36', -1), times('36', -2)]
    assert q1[1:] == ['2.45', '24.5'] and q2[1:] == ['3.6', '0.36']
    place_table(s, [('한 컵 0.245', '0.245', True), ('10컵(10배)', q1[1], False), ('100컵(100배)', q1[2], False),
                    ('물통 36', '36', True), ('한 모둠(10분의 1)', q2[1], False), ('한 명(100분의 1)', q2[2], False)], lv)
    s.fill(['한 컵 0.245 L →(10배) 10컵 (          ) L →(10배) 100컵 (          ) L',
            '물통 36 L →(10분의 1) 한 모둠 (          ) L →(10분의 1) 한 명 (          ) L'])
    s.ask('예상이 맞았나요?  ( 맞았어요 / 고쳤어요 )', blank=False)
    step(s, 1, '그려 보기', '1, 0.1, 0.01, 0.001')
    s.text('응원 깃발을 만들 천 1장을 윤서는 10조각, 민재는 100조각, 하린이는 1000조각으로 똑같이 나누었어요. 색칠한 것이 한 조각이에요.')
    s.picture(fig(svg_grids([{'v': 100, 'div': 10, 'mono': COL['t'], 'cap': '윤서의 한 조각'},
                             {'v': 10, 'div': 100, 'mono': COL['t'], 'cap': '민재의 한 조각'},
                             {'v': 1, 'div': 1000, 'mono': COL['t'], 'cap': '하린이의 한 조각', 'zoom': True}])), width_mm=176)
    s.picture(fig(svg_rel()), width_mm=130)
    s.fill(['한 조각은 윤서 (        ), 민재 (        ), 하린 (        )',
            '0.1의 10분의 1은 (        )이고, 1은 0.1의 (      )배예요.',
            '0.001을 100배 하면 (        )이고, 1000배 하면 (        )이에요.'])
    step(s, 2, '말해 보기', '100배와 100분의 1')
    a3 = [times('2.468', 2), times('2.468', 3), times('573', -2), times('573', -3)]
    assert a3 == ['246.8', '2468', '5.73', '0.573']
    s.fill(['2.468의 100배는 (          )이고, 1000배는 (          )이에요.', '573의 100분의 1은 (          )이고, 1000분의 1은 (          )이에요.'])
    then_why(s, '2.468의 1000배가 2468이 되는 까닭을 숫자가 움직이는 방법으로 말해 봐요.', lv,
             '1000배는 10배를 (      )번 한 것이라서 숫자가 소수점을 기준으로 (        )으로 (      )자리 움직여요.')
    step(s, 3, '약속하기', '소수 사이의 관계')
    s.fill(['어떤 수를 10배 하면 소수점을 기준으로 수가 %s으로 한 자리 이동하고,' % o(lv, '왼쪽', '오른쪽', n=8),
            '10분의 1을 하면 %s으로 한 자리 이동해요.' % o(lv, '왼쪽', '오른쪽', n=8),
            '0.001을 %s 하면 1이에요.' % o(lv, '10배', '100배', '1000배', n=8)])
    step(s, 4, '확인하기', '다른 수를 말한 친구')
    s.text('윤서: “0.48의 10배인 수야.”   민재: “48의 10분의 1이야.”   하린: “0.048의 1000배야.”')
    assert [times('0.48', 1), times('48', -1), times('0.048', 3)] == ['4.8', '4.8', '48']
    s.ask('다른 수를 말한 친구는 %s' % o(lv, '윤서', '민재', '하린'), blank=False)
    s.text('0.06인 것에 모두 ○ 하세요.')
    cand = [('0.006의 10배', times('0.006', 1)), ('0.6의 100배', times('0.6', 2)), ('60의 1000분의 1', times('60', -3)), ('0.6의 10분의 1', times('0.6', -1))]
    s.choices([(c, '(    )') for c, _ in cand])
    yes = [c for c, v in cand if v == '0.06']
    ans = '5차시  ① (예상 자유) %s, %s, %s, %s   ② 0.1, 0.01, 0.001, 0.01, 10, 0.1, 1   ③ %s / %s   ④ 왼쪽, 오른쪽, 1000배   ⑤ 하린(윤서·민재 4.8, 하린 48), %s에 ○' % (
        q1[1], q1[2], q2[1], q2[2], ', '.join(a3), '3, 왼쪽, 3' if lv == '기본형' else '예) 1000배는 10배를 세 번 한 것이라 숫자가 왼쪽으로 세 자리 움직여요',
        '·'.join(yes))
    if lv == '도전형':
        step(s, 5, '도전하기', '물 당번 문제')
        s.fill(['0.71의 □배는 71이에요. □ 안에 알맞은 수는 (        )',
                '물 8.4 L를 10명이 똑같이 나누어 마시면 한 명은 (          ) L예요.',
                '가장 큰 수를 말한 친구: 윤서 259의 1000분의 1, 민재 25.9의 10분의 1, 하린 0.259의 100배 → (        )'])
        why(s, '0.71이 71이 되려면 숫자가 어떻게 움직여야 하는지 써 보세요.', 1)
        assert times('0.71', 2) == '71' and times('8.4', -1) == '0.84'
        vv = {'윤서': times('259', -3), '민재': times('25.9', -1), '하린': times('0.259', 2)}
        best = max(vv, key=lambda k: P(vv[k]))
        assert best == '하린'
        ans += '   ⑥ 100, 0.84, 하린(25.9) / 예) 숫자가 왼쪽으로 두 자리 움직여야 하므로 100배예요'
    return ans


def st6(s, lv):
    s.lesson(6, '개념 구축하기(O)', '물을 또 마셨어요 ― 소수 한 자리 수의 덧셈', '소수 한 자리 수끼리는 어떻게 더할까요?')
    s.scene(None, '수아는 오전에 물을 0.4 L, 오후에 0.5 L 마셨어요.')
    step(s, 0, '만져 보기', '수아가 마신 물')
    s.text('1 L를 똑같이 10칸으로 나눈 막대에 오전·오후에 마신 양과 모두 마신 양을 칠해 보세요.')
    s.picture(fig(svg_bars([('오전', 0, ''), ('오후', 0, ''), ('모두', 0, '')], '1 L')), width_mm=130)
    s.fill('식: %s = (          ) L' % o(lv, '0.4+0.5', '0.5−0.4'))
    a1 = cq('0.4+0.5', '0.9')
    step(s, 1, '그려 보기', '0.1의 개수로 더하기')
    rule_first(s, '소수 한 자리 수끼리 더할 때 0.1이 몇 개인지 세면 어떻게 계산할 수 있을까요?')
    s.text('민재는 운동회 전에 운동장 둘레를 오전에 1.7 km, 오후에 2.6 km 걸었어요.')
    s.fill(['1.7은 0.1이 (      )개, 2.6은 0.1이 (      )개예요.', '1.7 + 2.6은 0.1이 (      )개 → (          ) km'])
    a2 = cq('1.7+2.6', '4.3')
    s.ask('예상이 맞았나요?  ( 맞았어요 / 고쳤어요 )', blank=False)
    step(s, 2, '말해 보기', '세로로 더하기')
    s.text('같은 자리 수끼리 더해 아래 칸에 쓰고' + (', 받아올림한 수는 빨간 점선 칸에 써요.' if lv == '기본형' else ', 소수점도 찍어요.'))
    vert(s, [('1.7', '+', '2.6')], lv, max_mm=60)
    then_why(s, '세로셈에서 소수점을 그대로 내려 찍는 까닭은 무엇일까요?', lv,
             '소수점을 맞추어 (                ) 끼리 더했으니, 답에서도 일의 자리와 소수 첫째 자리 사이에 (          )이 그대로 와야 해요.')
    step(s, 3, '약속하기', '소수 한 자리 수의 덧셈')
    s.fill(['소수 한 자리 수의 덧셈은 %s의 위치를 맞추어 쓰고,' % o(lv, '소수점', '오른쪽 끝'),
            '자연수의 덧셈과 같이 %s 더해요.' % o(lv, '같은 자리 수끼리', '앞에서부터 아무 자리끼리', n=16),
            '합이 10이거나 10보다 크면 바로 윗자리로 %s하고, 소수점을 그대로 내려 찍어요.' % o(lv, '받아올림', '받아내림')])
    step(s, 4, '확인하기', '기록 더하기')
    a5 = vert(s, [('0.6', '+', '3.2'), ('4.7', '+', '2.5'), ('5.4', '+', '0.6'), ('8.9', '+', '1.3')], lv)
    assert [x.split('=')[1] for x in a5] == ['3.8', '7.2', '6', '10.2']
    s.ask('하린이는 공 던지기 1차 시기에 12.4 m를 던졌고, 2차 시기에는 1.8 m 더 멀리 던졌어요. 2차 기록은 (          ) m예요.', blank=False)
    a6 = cq('12.4+1.8', '14.2')
    ans = '6차시  ① 0.4+0.5, %s   ② (예상 자유) 17, 26, 43, %s   ③ 1.7+2.6=4.3 / %s   ④ 소수점, 같은 자리 수끼리, 받아올림   ⑤ %s (5.4+0.6=6.0=6), %s m' % (
        a1, a2, '같은 자리, 소수점' if lv == '기본형' else '예) 소수점을 맞추어 같은 자리끼리 더했으니 답에서도 소수점이 같은 자리에 와야 해요',
        ', '.join(a5), a6)
    if lv == '도전형':
        step(s, 5, '도전하기', '수 카드로 만든 소수')
        s.text('수 카드 [3] [6] [8]과 소수점 카드 [ . ] 중 세 장을 골라 가장 큰 소수 한 자리 수를 만들고, 가장 작은 소수 한 자리 수 3.6과의 합을 구해 보세요.')
        s.fill(['가장 큰 소수 한 자리 수: (        )  →  (        ) + 3.6 = (          )', '2.7보다 3.9만큼 더 큰 수는 (          )'])
        why(s, '가장 큰 소수 한 자리 수를 어떻게 만들었는지 써 보세요.', 1)
        d = sorted('368', reverse=True)
        big = '%s.%s' % (d[0], d[1])
        assert big == '8.6'
        ans += '   ⑥ 8.6, %s, %s / 예) 일의 자리에 가장 큰 수 8, 소수 첫째 자리에 그다음 큰 수 6을 놓았어요' % (cq('8.6+3.6', '12.2'), cq('2.7+3.9', '6.6'))
    return ans


def st7(s, lv):
    s.lesson(7, '개념 구축하기(O)', '이어달리기 거리를 더해요 ― 소수 두 자리 수의 덧셈', '소수 두 자리 수의 덧셈은 어떻게 할까요?')
    s.scene(None, '4학년 이어달리기는 1구간 0.26 km, 2구간 0.38 km를 달려요.')
    step(s, 0, '만져 보기', '이어달리기 코스')
    s.text('모눈 한 칸이 0.01 km예요. 연두색은 1구간 0.26 km예요. 이어서 2구간 거리만큼 더 칠해 보세요.')
    s.picture(fig(svg_grids([{'v': 0, 'pre': 26, 'pre_col': COL['h'], 'cap': '연두: 1구간 0.26 km'}])), width_mm=60)
    s.fill('식: %s = (          ) km' % o(lv, '0.26+0.38', '0.38−0.26', n=14))
    a1 = cq('0.26+0.38', '0.64')
    step(s, 1, '그려 보기', '0.01의 개수로 더하기')
    s.text('윤서가 출발선 테이프 2.75 m에 0.6 m를 이어 붙였어요.')
    s.fill(['2.75는 0.01이 (        )개, 0.6은 0.01이 (        )개예요.', '2.75 + 0.6은 0.01이 (        )개 → (          ) m'])
    a2 = cq('2.75+0.6', '3.35')
    then_why(s, '0.6을 0.01이 6개라고 하면 안 되는 까닭은 무엇일까요?', lv,
             '0.6은 0.1이 (      )개이고, 0.1은 0.01이 (      )개라서 0.6은 0.01이 (      )개예요.')
    step(s, 2, '말해 보기', '소수점 맞추어 더하기')
    if lv == '기본형':
        s.text('두 수를 소수점끼리 맞추어 썼어요. 0.6 = 0.60으로 생각해요(회색 0).')
        vert(s, [('2.75', '+', '0.6')], lv, max_mm=60)
    else:
        s.text('빈칸에 두 수를 소수점끼리 맞추어 직접 쓰고 계산해 보세요. 파란 점선 칸이 소수점 자리예요.')
        vert(s, [('2.75', '+', '0.6')], lv, mode='blank', max_mm=60)
    s.text('하린이는 2.75 + 0.6을 2.81이라고 계산했어요. 하린이에게 무엇을 고치면 좋을지 말해 주세요.')
    assert S(P('2.75') + P('0.06')) == '2.81'
    if lv == '기본형':
        s.fill('하린아, (            )을 맞추어 썼구나. (            )끼리 맞추어 2.75 + 0.60으로 계산하면 (          )야.')
    else:
        s.lines(2)
    step(s, 3, '약속하기', '소수 두 자리 수의 덧셈')
    s.fill(['소수 두 자리 수의 덧셈도 %s의 위치를 맞추어 써요.' % o(lv, '소수점', '오른쪽 끝'),
            '자리 수가 다르면 소수의 오른쪽 끝자리에 %s을 붙여 생각하고,' % o(lv, '0', '1', n=6),
            '자연수의 덧셈과 같이 %s하여 계산한 다음 소수점을 그대로 내려 찍어요.' % o(lv, '받아올림', '받아내림')])
    step(s, 4, '확인하기', '기록 더하기')
    a5 = vert(s, [('1.46', '+', '2.3'), ('3.58', '+', '4.67'), ('0.85', '+', '0.15'), ('4.9', '+', '0.36')], lv)
    assert [x.split('=')[1] for x in a5] == ['3.76', '8.25', '1', '5.26']
    s.ask('윤서는 물을 0.65 L 마시고, 잠시 뒤에 0.48 L를 더 마셨어요. 모두 (          ) L예요.', blank=False)
    a6 = cq('0.65+0.48', '1.13')
    ans = '7차시  ① 0.26+0.38, %s   ② 275, 60, 335, %s / %s   ③ 2.75+0.60=3.35 / 예) 하린아, 오른쪽 끝을 맞추어 0.6을 0.06처럼 더했어. 소수점끼리 맞추면 3.35야   ④ 소수점, 0, 받아올림   ⑤ %s (0.85+0.15=1.00=1), %s L' % (
        a1, a2, '6, 10, 60' if lv == '기본형' else '예) 0.6은 0.1이 6개이고 0.1은 0.01이 10개라서 0.01이 60개예요',
        ', '.join(a5), a6)
    if lv == '도전형':
        step(s, 5, '도전하기', '이어달리기 기록원의 문제')
        s.fill(['합이 더 큰 것: ㉠ 0.7 + 1.48   ㉡ 0.95 + 1.26  → (      )',
                '3.47 →(+1.85) (          ) →(+0.7) (          )'])
        why(s, '5.32 + 0.7을 5.39라고 계산하면 무엇이 틀렸는지 써 보세요.', 1)
        g1, g2 = ev('0.7+1.48'), ev('0.95+1.26')
        assert g2 > g1
        ans += '   ⑥ ㉡(%s > %s), %s, %s / 예) 0.7을 0.07처럼 더했어요. 소수점을 맞추면 6.02예요' % (
            S(g2), S(g1), cq('3.47+1.85', '5.32'), cq('5.32+0.7', '6.02'))
    return ans


def st8(s, lv):
    s.lesson(8, '개념 구축하기(O)', '누가 더 멀리 던졌을까 ― 소수 한 자리 수의 뺄셈', '소수 한 자리 수의 뺄셈은 어떻게 할까요?')
    s.scene(None, '응원 리본을 재었더니 하린이의 리본은 0.8 m, 수아의 리본은 0.5 m였어요.')
    step(s, 0, '만져 보기', '응원 리본')
    s.text('1 m를 10칸으로 나눈 막대에 두 리본의 길이를 칠하고, 하린이의 리본이 몇 m 더 긴지 알아보세요.')
    s.picture(fig(svg_bars([('하린', 0, ''), ('수아', 0, '')], '1 m')), width_mm=130)
    s.fill(['두 막대는 (      )칸 차이가 나요.', '식: %s = (          ) m' % o(lv, '0.8+0.5', '0.8−0.5')])
    a1 = cq('0.8-0.5', '0.3')
    step(s, 1, '그려 보기', '0.1의 개수로 빼기')
    s.text('공 던지기에서 도현이는 15.2 m, 민재는 12.7 m를 던졌어요.')
    s.fill(['15.2는 0.1이 (        )개, 12.7은 0.1이 (        )개예요.', '15.2 − 12.7은 0.1이 (      )개 → (          ) m'])
    a2 = cq('15.2-12.7', '2.5')
    then_why(s, '15.2 − 12.7을 0.1의 개수로 계산하면 좋은 점은 무엇일까요?', lv,
             '0.1의 개수로 바꾸면 (          ) − (          )처럼 (          )의 뺄셈으로 계산할 수 있어요.')
    step(s, 2, '말해 보기', '세로로 빼기')
    s.text('같은 자리 수끼리 빼서 아래 칸에 써요. 맨 앞 십의 자리가 0이면 비워 두어도 돼요.')
    vert(s, [('15.2', '-', '12.7')], lv, max_mm=70)
    then_why(s, '소수 첫째 자리에서 2에서 7을 뺄 수 없을 때 어떻게 했나요?', lv,
             '일의 자리에서 1을 받아내림해 (      ) − 7을 하고, 일의 자리는 (      )가 되었어요.')
    step(s, 3, '약속하기', '소수 한 자리 수의 뺄셈')
    s.fill(['소수 한 자리 수의 뺄셈은 소수점의 위치를 %s 쓰고, 같은 자리 수끼리 빼요.' % o(lv, '맞추어', '오른쪽 끝에 맞추어', n=12),
            '같은 자리 수끼리 뺄 수 없으면 바로 윗자리에서 %s하고, 소수점을 그대로 내려 찍어요.' % o(lv, '받아올림', '받아내림')])
    step(s, 4, '확인하기', '기록의 차')
    a5 = vert(s, [('5.8', '-', '2.3'), ('7.1', '-', '4.6'), ('9', '-', '3.4'), ('6.2', '-', '0.8')], lv)
    assert [x.split('=')[1] for x in a5] == ['3.5', '2.5', '5.6', '5.4']
    s.ask('이어달리기 코스 1.5 km 중에서 0.8 km를 달렸어요. 남은 거리는 (          ) km예요.', blank=False)
    a6 = cq('1.5-0.8', '0.7')
    ans = '8차시  ① 3, 0.8−0.5, %s   ② 152, 127, 25, %s / %s   ③ 15.2−12.7=2.5 / %s   ④ 맞추어, 받아내림   ⑤ %s (9=9.0), %s km' % (
        a1, a2, '152, 127, 자연수' if lv == '기본형' else '예) 152−127처럼 자연수의 뺄셈으로 계산할 수 있어 편리해요',
        '12, 4' if lv == '기본형' else '예) 일의 자리 5에서 1을 받아내림해 12−7=5, 일의 자리는 4가 되어 4−2=2',
        ', '.join(a5), a6)
    if lv == '도전형':
        step(s, 5, '도전하기', '카드로 만든 소수 빼기')
        s.text('카드 [ . ] [4] [7] [5] [9] 중 세 장을 골라 가장 작은 소수 한 자리 수를 만들고, 그 수에서 2.8을 빼 보세요.')
        s.fill(['가장 작은 소수 한 자리 수: (        ),   (        ) − 2.8 = (          )', '6.3보다 1.9만큼 더 작은 수는 (          )'])
        why(s, '9 − 3.4를 계산할 때 9를 어떻게 생각하면 좋은지 써 보세요.', 1)
        d = sorted('4759')
        assert '%s.%s' % (d[0], d[1]) == '4.5'
        ans += '   ⑥ 4.5, %s, %s / 예) 9=9.0으로 생각하고 소수점을 맞추어 빼요' % (cq('4.5-2.8', '1.7'), cq('6.3-1.9', '4.4'))
    return ans


def st9(s, lv):
    s.lesson(9, '개념 구축하기(O)', '남은 물은 얼마일까 ― 소수 두 자리 수의 뺄셈', '소수 두 자리 수의 뺄셈은 어떻게 할까요?')
    s.scene(None, '수아의 물병에 물이 0.83 L 있었어요. 달리기를 마치고 0.25 L를 마셨어요.')
    step(s, 0, '만져 보기', '수아의 물병')
    s.text('작은 눈금 한 칸은 0.01 L예요. 파란 점 0.83에서 왼쪽으로 0.25만큼 화살표를 그려 남은 물의 양을 알아보세요.')
    s.picture(fig(svg_line(0, 1000, 10, 100, 50, 'L', marks=[(830, '0.83')])), width_mm=170)
    s.fill('식: %s = (          ) L' % o(lv, '0.83+0.25', '0.83−0.25', n=14))
    a1 = cq('0.83-0.25', '0.58')
    step(s, 1, '그려 보기', '0.01의 개수로 빼기')
    s.text('윤서의 물통에는 물이 1.5 L 있었어요. 그중 0.68 L를 마셨어요.')
    s.fill(['1.5는 0.01이 (        )개, 0.68은 0.01이 (        )개예요.', '1.5 − 0.68은 0.01이 (        )개 → (          ) L'])
    a2 = cq('1.5-0.68', '0.82')
    then_why(s, '1.5를 1.50으로 생각하면 왜 계산하기 편리할까요?', lv,
             '1.50으로 생각하면 0.68과 소수 (            ) 자리까지 자리 수가 같아져서 0.01의 개수로 바로 뺄 수 있어요.')
    step(s, 2, '말해 보기', '소수점 맞추어 빼기')
    if lv == '기본형':
        s.text('두 수를 소수점끼리 맞추어 썼어요. 1.5 = 1.50으로 생각해요(회색 0).')
        vert(s, [('1.5', '-', '0.68')], lv, max_mm=60)
    else:
        s.text('빈칸에 두 수를 소수점끼리 맞추어 직접 쓰고 계산해 보세요. 파란 점선 칸이 소수점 자리예요.')
        vert(s, [('1.5', '-', '0.68')], lv, mode='blank', max_mm=60)
    then_why(s, '1.50 − 0.68에서 소수 둘째 자리 0에서 8을 어떻게 뺐나요?', lv,
             '소수 첫째 자리에서 받아내림해 (      ) − 8을 하고, 소수 첫째 자리는 (      )가 되어 다시 일의 자리에서 받아내림해 (      ) − 6을 했어요.')
    step(s, 3, '약속하기', '소수 두 자리 수의 뺄셈')
    s.fill(['소수 두 자리 수의 뺄셈도 %s의 위치를 맞추어 써요.' % o(lv, '소수점', '오른쪽 끝'),
            '1.5 − 0.68처럼 자리 수가 다르면 1.5를 %s으로 생각하고,' % o(lv, '1.50', '1.05', n=8),
            '자연수의 뺄셈과 같이 %s하여 계산한 다음 소수점을 그대로 내려 찍어요.' % o(lv, '받아내림', '받아올림')])
    step(s, 4, '확인하기', '남은 양과 차')
    a5 = vert(s, [('4.36', '-', '1.12'), ('6.03', '-', '2.47'), ('0.9', '-', '0.35'), ('5.42', '-', '2.8')], lv)
    assert [x.split('=')[1] for x in a5] == ['3.24', '3.56', '0.55', '2.62']
    s.ask('멀리뛰기에서 하린이는 1.62 m, 도현이는 1.48 m를 뛰었어요. 하린이가 (          ) m 더 멀리 뛰었어요.', blank=False)
    a6 = cq('1.62-1.48', '0.14')
    ans = '9차시  ① 0.83−0.25, %s   ② 150, 68, 82, %s / %s   ③ 1.50−0.68=0.82 / %s   ④ 소수점, 1.50, 받아내림   ⑤ %s, %s m' % (
        a1, a2, '둘째' if lv == '기본형' else '예) 0.68과 자리 수가 같아져서 150개−68개로 바로 뺄 수 있어요',
        '10, 4, 14' if lv == '기본형' else '예) 소수 첫째 자리에서 받아내림해 10−8=2, 소수 첫째 자리는 4가 되어 일의 자리에서 받아내림해 14−6=8',
        ', '.join(a5), a6)
    if lv == '도전형':
        step(s, 5, '도전하기', '□ 안에 들어갈 수')
        s.fill(['7.25 − 3.6 = (          )', '7.25 − 3.6 < 3.□5 에서 □ 안에 들어갈 수 있는 수를 모두 쓰면 (              )'])
        why(s, '□ 안에 6이 들어갈 수 없는 까닭을 써 보세요.', 1)
        r = ev('7.25-3.6')
        ok = [d for d in range(10) if P('3.%d5' % d) > r]
        assert S(r) == '3.65' and ok == [7, 8, 9]
        ans += '   ⑥ 3.65, 7·8·9 / 예) □가 6이면 3.65 = 3.65로 같아서 3.65보다 크지 않아요'
    return ans


def st10(s, lv):
    s.lesson(10, '탐구 정리하기(O)', '생각을 더하다 ― 운동회 물병 계획', '여러 단계의 소수 계산 문제는 어떻게 해결할까요?')
    s.scene(None, '운동회 날 한 사람에게 1.5 L 물병을 하나씩 나누어 주었어요. 민재는 오전에 0.45 L, 점심에 0.3 L, 오후에 0.58 L를 마셨어요. 민재의 물병에 남은 물은 몇 L일까요?')
    step(s, 0, '만져 보기', '이해해요')
    s.choices([('구하려는 것은 무엇인가요?', '( 모두 마신 물의 양 /\n물병에 남은 물의 양 /\n오전과 오후에 마신 물의 차 )'),
               ('알맞은 계획은?', '( 마신 양을 모두 더한 다음 1.5에서 빼요 /\n1.5에 마신 양을 모두 더해요 /\n오전에 마신 양만 1.5에서 빼요 )')])
    step(s, 1, '그려 보기', '어림하고 해결해요')
    s.fill(['먼저 어림해요: 민재가 마신 물은 모두 1 L보다 %s' % o(lv, '많아요', '적어요'),
            '① 오전과 점심: 0.45 + 0.3 = (          )', '② 모두 마신 양: 0.75 + 0.58 = (          ) L',
            '③ 남은 물: 1.5 − (          ) = (          ) L'])
    r1, r2, r3 = cq('0.45+0.3', '0.75'), cq('0.75+0.58', '1.33'), cq('1.5-1.33', '0.17')
    assert P('0.5') + P('0.3') + P('0.6') > 1000
    if lv == '기본형':
        vert(s, [('0.45', '+', '0.3'), ('0.75', '+', '0.58'), ('1.5', '-', '1.33')], lv, per_row=3, max_mm=130)
    step(s, 2, '말해 보기', '잘못 고치기')
    s.text('도현이는 기록 4.6과 2.35의 합을 아래처럼 계산했어요.')
    s.picture(fig(svg_chars([['', '', '4', '.', '6'], ['+', '2', '.', '3', '5'], ['', '2', '.', '8', '1']], '도현이가 계산한 세로셈')), width_mm=50)
    s.ask('잘못 계산한 까닭은 %s' % o(lv, '소수점의 위치를 맞추어 쓰지 않았어요', '받아올림을 하지 않았어요', '자연수 부분만 더했어요', n=30), blank=False)
    s.text('옳게 계산해 보세요.')
    vert(s, [('4.6', '+', '2.35')], lv, mode='given' if lv == '기본형' else 'blank', max_mm=60)
    step(s, 3, '약속하기', '운동회 문제 만들기')
    vert(s, [('4.2', '-', '1.75')], lv, max_mm=60)
    s.ask('4.2 − 1.75에 알맞은 운동회 문제를 만들어 써 보세요.', blank=False)
    if lv == '기본형':
        s.fill('(            )이 4.2 (      ) 있었는데 1.75 (      )를 (            )했어요. 남은 (            )은 몇 (      )일까요?')
    else:
        s.lines(2)
    step(s, 4, '확인하기', '청팀과 백팀')
    s.fill(['청팀 코스 세 구간 0.35 km, 0.42 km, 0.28 km를 모두 더하면 (          ) km예요.',
            '백팀 코스 1.2 km는 청팀 코스보다 (          ) km 더 길어요.'])
    b1, b2 = cq('0.35+0.42+0.28', '1.05'), cq('1.2-1.05', '0.15')
    ans = '10차시  ① 물병에 남은 물의 양, 마신 양을 모두 더한 다음 1.5에서 빼요   ② 많아요, %s, %s, 1.33, %s   ③ 소수점의 위치를 맞추어 쓰지 않았어요, 4.60+2.35=%s   ④ 4.2−1.75=%s, 예) 응원 물통에 물이 4.2 L 있었는데 1.75 L를 마셨어요. 남은 물은? (2.45 L)   ⑤ %s, %s' % (
        r1, r2, r3, cq('4.6+2.35', '6.95'), cq('4.2-1.75', '2.45'), b1, b2)
    if lv == '도전형':
        step(s, 5, '도전하기', '★★ 남은 물')
        s.text('물 2 L 중에서 하린이는 0.46 L, 수아는 0.37 L를 마셨어요.')
        s.fill(['두 사람이 마신 양: 식 (                    ) = (          ) L', '남은 양: 2 − (          ) = (          ) L'])
        why(s, '먼저 어림하면 좋은 점을 써 보세요.', 1)
        ans += '   ⑥ 0.46+0.37=%s, %s / 예) 답이 알맞은지 살펴볼 수 있어요' % (cq('0.46+0.37', '0.83'), cq('2-0.83', '1.17'))
    return ans


DUEL = [('멀리뛰기', 'm', True, ('윤서', '1.46'), ('민재', '1.5')),
        ('50 m 달리기', '초', False, ('하린', '9.48'), ('도현', '9.5')),
        ('공 던지기', 'm', True, ('수아', '16.07'), ('준호', '16.7')),
        ('물 마시기', 'L', True, ('서연', '0.35'), ('지우', '0.348')),
        ('멀리뛰기', 'm', True, ('도현', '1.09'), ('수아', '1.1')),
        ('50 m 달리기', '초', False, ('민재', '10.2'), ('지우', '9.87')),
        ('공 던지기', 'm', True, ('준호', '18.45'), ('윤서', '18.5')),
        ('물 마시기', 'L', True, ('하린', '0.407'), ('서연', '0.47'))]


def st11(s, lv):
    s.lesson(11, '발표하기(P)', '기록 카드 대결 놀이', '소수의 크기 비교와 계산을 놀이로 해 볼까요?')
    s.scene(None, '기록원 모둠이 운동회 기록 카드로 대결 놀이를 해요.')
    step(s, 0, '만져 보기', '가장 큰 기록 카드')
    s.text('수 카드 [1] [5] [8]과 소수점 카드 [ . ]를 한 번씩 모두 사용하여 소수 두 자리 수를 만들어요.')
    s.fill(['가장 큰 소수 두 자리 수: (          )', '같은 카드로 만든 가장 작은 소수 두 자리 수: (          )', '두 수의 차: (          ) − (          ) = (          )'])
    d = sorted('158')
    big, small = '%s.%s%s' % (d[2], d[1], d[0]), '%s.%s%s' % (d[0], d[1], d[2])
    assert (big, small) == ('8.51', '1.58')
    if lv == '기본형':
        s.text('가장 큰 수: 일의 자리에 가장 큰 수부터 놓아요. 가장 작은 수: 일의 자리에 가장 작은 수부터 놓아요.')
    step(s, 1, '놀이하기', '기록 대결 8판')
    s.text('멀리뛰기·공 던지기·물 마시기는 기록이 큰 친구가, 50 m 달리기는 걸린 시간이 짧은(기록이 작은) 친구가 이겨요. 이긴 친구의 이름을 써요.')
    rows = [['판', '종목', '기록 1', '기록 2', '이긴 친구']]
    win = []
    for k, (ev_, u, bigwin, (n1, v1), (n2, v2)) in enumerate(DUEL):
        rows.append([str(k + 1), ev_, '%s %s %s' % (n1, v1, u), '%s %s %s' % (n2, v2, u), ''])
        w = n1 if (P(v1) > P(v2)) == bigwin else n2
        assert P(v1) != P(v2)
        win.append(w)
    s.table(rows, col_mm=[14, 40, 44, 44, 38], row_h=2835)
    step(s, 2, '말해 보기', '이기는 방법 발표하기')
    if lv == '기본형':
        s.labeled([('이기는 방법', '먼저 (              )을 비교하고, 같으면 소수 첫째 자리, 소수 둘째 자리 차례로 비교해요. 달리기는 기록이 (        ) 친구가 이겨요.'),
                   ('헷갈린 기록', '______________ 와 ______________ 가 헷갈렸어요. 끝자리에 0을 붙이면 ______________________ 예요.')], row_h=4536)
    else:
        for q in ['기록 대결에서 이기는 방법을 친구에게 설명해 보세요.', '놀이를 하며 헷갈렸던 기록은 무엇이었나요? 어떻게 비교하면 되는지도 써 보세요.']:
            s.ask(q, blank=False)
            s.lines(1)
    step(s, 3, '확인하기', '가장 좋은 기록')
    run = [('㉠', '9.7'), ('㉡', '9.65'), ('㉢', '10.2')]
    jump = ['1.4', '1.39', '1.425']
    s.fill(['50 m 달리기 기록 ㉠ 9.7초 ㉡ 9.65초 ㉢ 10.2초 중 가장 빠른 기록은 (      )',
            '멀리뛰기 기록 1.4 m, 1.39 m, 1.425 m 중 가장 먼 기록은 (          )'])
    fast = min(run, key=lambda t: P(t[1]))[0]
    far = max(jump, key=P)
    ans = '11차시  ① %s, %s, %s   ② %s   ③ %s   ④ %s, %s m' % (
        big, small, cq('%s-%s' % (big, small), '6.93'), ', '.join('%d판 %s' % (k + 1, w) for k, w in enumerate(win)),
        '자연수 부분, 작은 / (자유)' if lv == '기본형' else '(자유) 예) 자연수 부분부터 차례로 비교하고, 달리기는 기록이 작은 친구가 이겨요',
        fast, far)
    if lv == '도전형':
        step(s, 4, '도전하기', '가장 작은 소수 세 자리 수')
        s.text('수 카드 [0] [2] [7] [9]와 소수점 카드 [ . ]를 한 번씩 모두 사용하여 가장 작은 소수 세 자리 수를 만들어요.')
        s.fill(['가장 작은 소수 세 자리 수: (          ),  읽기: (                    )', '이 수의 100배는 (          )'])
        why(s, '가장 작은 소수 세 자리 수를 어떻게 만들었는지 써 보세요.', 1)
        dd = sorted('0279')
        sm = '%s.%s' % (dd[0], ''.join(dd[1:]))
        assert sm == '0.279'
        ans += '   ⑤ %s, %s, %s / 예) 높은 자리에 작은 숫자부터 놓았어요. 일의 자리에는 0을 놓을 수 있어요' % (sm, read(sm), times(sm, 2))
    return ans


def st12(s, lv):
    s.lesson(12, '발표하기(P)', '운동회 기록 발표회 ― 공부한 내용을 확인해요', '소수를 배우기 전과 후, 내 생각은 어떻게 달라졌나요?')
    s.scene(None, '운동회가 끝나고 기록원 모둠이 기록 발표회를 열어요.')
    step(s, 0, '만져 보기', '기록 쓰고 읽기')
    s.fill(['이 점 영칠오를 소수로 쓰면 (          )', '6.08을 읽으면 (                    )', '0.01이 52개인 수는 (          )',
            '3.104는 0.001이 (          )개예요.'])
    assert read('2.075') == '이 점 영칠오' and P('3.104') == 3104
    step(s, 1, '그려 보기', '계산하기')
    a2 = vert(s, [('0.7', '+', '2.6'), ('6.4', '-', '2.7'), ('2.58', '+', '3.67'), ('5.2', '-', '3.48')], lv)
    assert [x.split('=')[1] for x in a2] == ['3.3', '3.7', '6.25', '1.72']
    step(s, 2, '말해 보기', '같은 수, 큰 수')
    s.choices([('0.004의 100배와 같은 수는?', '( 0.04의 10배 / 4의 100분의 1 )'), ('0.4의 10분의 1과 같은 수는?', '( 0.04의 10배 / 4의 100분의 1 )')])
    assert times('0.004', 2) == times('0.04', 1) == '0.4' and times('0.4', -1) == times('4', -2) == '0.04'
    s.ask('㉠ 6.317  ㉡ 6.309  ㉢ 7.3을 큰 수부터 차례대로: (                    )', blank=False)
    order = [k for k, _ in sorted([('㉠', '6.317'), ('㉡', '6.309'), ('㉢', '7.3')], key=lambda t: -P(t[1]))]
    step(s, 3, '확인하기', '색칠하기')
    labels = {'earL': '1.7', 'earR': '1.7', 'head': '5.34', 'body': '3.7', 'carrot': '2.92', 'grass': '4.24', 'sun': '4.3'}
    a4 = color_task(s, [('1.4+0.3', '분홍'), ('3.56+1.78', '하늘'), ('6.1-2.4', '주황'), ('5.27-2.35', '연두')], labels, RNAME, lv)
    step(s, 4, '되돌아보기', '예전 생각, 지금 생각')
    if lv == '기본형':
        s.labeled([('예전 생각', '예전에는 ______________________________________ 라고 생각했어요.'),
                   ('지금 생각', '지금은 ______________________________________ 라고 생각해요.'),
                   ('왜 바뀌었나', '______________________________________ 을 해 보고 바뀌었어요.')], row_h=4536)
    else:
        for q in ['예전 생각: 배우기 전의 생각', '지금 생각: 배운 뒤에 바뀐 생각', '왜 바뀌었나: 어떤 활동 때문에 바뀌었나요?']:
            s.ask(q, blank=False)
            s.lines(1)
    ans = '12차시  ① 2.075, %s, 0.52, 3104   ② %s   ③ 0.04의 10배, 4의 100분의 1, %s   ④ %s   ⑤ (자유)' % (
        read('6.08'), ', '.join(a2), ', '.join(order), a4)
    if lv == '도전형':
        step(s, 5, '도전하기', '★★ 두 사람이 마신 물')
        s.text('수아는 운동회 날 물을 1.25 L 마셨고, 하린이는 수아보다 0.4 L 더 적게 마셨어요.')
        s.fill(['하린이가 마신 물: 1.25 − 0.4 = (          ) L', '두 사람이 마신 물: 1.25 + (          ) = (          ) L'])
        why(s, '1.25 − 0.4를 1.21이라고 계산하면 무엇이 틀렸는지 써 보세요.', 1)
        ans += '   ⑥ %s, %s / 예) 0.4를 0.04처럼 오른쪽 끝을 맞추어 뺐어요. 소수점을 맞추면 0.85예요' % (cq('1.25-0.4', '0.85'), cq('1.25+0.85', '2.1'))
    return ans


TB = [tb1, tb2, tb3, tb4, tb5, tb6, tb7, tb8, tb9, tb10, tb11, tb12]
ST = [st1, st2, st3, st4, st5, st6, st7, st8, st9, st10, st11, st12]


def build(funcs, label, short, outdir, lv):
    s = Sheet(unit_label=label, level=lv, grade_label='4학년')
    lines = [f(s, lv) for f in funcs]
    s.answers('【교사용】 3. 소수의 덧셈과 뺄셈(%s) 활동지 정답 (%s)' % (short, lv), lines,
              note='※ 이 활동지는 앱 u3-decimal.html과 차시 번호가 같습니다.')
    os.makedirs(outdir, exist_ok=True)
    path = os.path.join(outdir, NAME % lv)
    s.save(path)
    return path


def main():
    out = []
    try:
        for lv in ('기본형', '도전형'):
            out.append(build(TB, '4-2 수학 3. 소수의 덧셈과 뺄셈(교과서 차시)', '교과서 차시', OUT_TB, lv))
            out.append(build(ST, '4-2 수학 3. 소수의 덧셈과 뺄셈(이야기 버전)', '이야기 버전', OUT_ST, lv))
    finally:
        shutil.rmtree(WORK, ignore_errors=True)
    bad = 0
    for p in out:
        prob = check(p)
        bad += bool(prob)
        print(p, 'OK' if not prob else '\n  ' + '\n  '.join(prob))
    sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()
