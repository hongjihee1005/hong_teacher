# -*- coding: utf-8 -*-
"""5-1 수학 3. 대응 관계 활동지(HWPX) 4개 만들기

    python3 gen_u3-corresp.py

교과서 차시 버전(앱 _build/units/u3-corresp.tb.js '친환경 에너지 공원', 8개 차시)과
이야기 버전(앱 u3-corresp.st.js '우리 반 환경 동아리 탐사대', 9개 차시)의
차시 번호·제목·S.O.O.P.·탐구 질문·이야기·수를 그대로 따릅니다.
대응표의 수는 모두 관계식(함수)으로 계산하고, 기호 식은 표의 모든 짝을 넣어 맞는지 확인하며,
그림의 개수(날개·기둥·말뚝·삼각형 …)도 관계식과 같은지 확인합니다.
"""
import hashlib
import math
import os
import sys
import tempfile
from xml.sax.saxutils import escape

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from hwpxgen import Sheet, svg_to_png, check  # noqa: E402

ROOT = os.path.normpath(os.path.join(HERE, '..', '..'))          # grade5/math
OUT_TB = os.path.join(ROOT, 'sem1', 'sheets')
OUT_ST = os.path.join(ROOT, 'sem1-soop', 'sheets')
NAME = '3단원_대응관계_활동지_%s.hwpx'
TMP = tempfile.mkdtemp(prefix='u3corr_')
FONT = "'Noto Sans KR','WenQuanYi Zen Hei',sans-serif"
INK, GRAY = '#1D2A2A', '#5E6D6A'
BLUE, ORANGE, GREEN, YEL, PINK = '#2B7BD6', '#E47A38', '#3E9B6A', '#F6C85F', '#F29BB8'
CIRC = '㉠㉡㉢㉣㉤'
B = '(      )'

# ================================================================ 대응표·기호 식
OPS = {'+': '+', '−': '-', '×': '*', '÷': '/'}


def ev(expr, env):
    s = expr
    for k, v in env.items():
        s = s.replace(k, '(%r)' % v)
    for k, v in OPS.items():
        s = s.replace(k, v)
    return eval(s)


def eq_ok(e, env):
    """e: '△=□+1', env: {기호: [값 …]} — 모든 짝에서 등호 양쪽이 같은지."""
    lhs, rhs = e.split('=')
    n = len(next(iter(env.values())))
    for i in range(n):
        one = {k: v[i] for k, v in env.items()}
        assert abs(ev(lhs, one) - ev(rhs, one)) < 1e-9, (e, one)
    return e


def eqs(pair, env):
    return [eq_ok(e, env) for e in pair]


def ctable(heads, xs, f, bx=(), by=()):
    """가로 대응표(첫 열 회색). bx·by: 빈칸으로 둘 자리(앱 table의 bx·by와 같은 번호). → (rows, 빈칸 정답 목록)"""
    ys = [f(x) for x in xs]
    r1 = [heads[0]] + ['(     )' if i in bx else str(x) for i, x in enumerate(xs)]
    r2 = [heads[1]] + ['(     )' if i in by else str(y) for i, y in enumerate(ys)]
    blanks = [str(x) for i, x in enumerate(xs) if i in bx] + [str(y) for i, y in enumerate(ys) if i in by]
    return [r1, r2], blanks, ys


# ================================================================ 그림(SVG)
def T(x, y, s, fs=18, anchor='middle', fill=INK, weight='normal'):
    return ('<text x="%.1f" y="%.1f" font-size="%d" text-anchor="%s" dominant-baseline="central" fill="%s" '
            'font-weight="%s" font-family="%s">%s</text>' % (x, y, fs, anchor, fill, weight, FONT, escape(str(s))))


def wrap(body, W, H):
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d"><rect width="%d" height="%d" fill="#fff"/>%s</svg>'
            % (W, H, W, H, body), W, H)


def R(x, y, w, h, fill, rx=3, stroke=INK, sw=2):
    return ('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" rx="%.1f" fill="%s" stroke="%s" stroke-width="%.1f"/>'
            % (x, y, w, h, rx, fill, stroke, sw))


def C(x, y, r, fill, stroke=INK, sw=2):
    return '<circle cx="%.1f" cy="%.1f" r="%.1f" fill="%s" stroke="%s" stroke-width="%.1f"/>' % (x, y, r, fill, stroke, sw)


def L(x1, y1, x2, y2, col=INK, sw=3):
    return ('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="%s" stroke-width="%.1f" stroke-linecap="round"/>'
            % (x1, y1, x2, y2, col, sw))


def P(pts, fill, stroke=INK, sw=2):
    return '<polygon points="%s" fill="%s" stroke="%s" stroke-width="%.1f"/>' % (
        ' '.join('%.1f,%.1f' % p for p in pts), fill, stroke, sw)


def blades(cx, cy, k, ln, col):
    out = []
    for i in range(k):
        a = -math.pi / 2 + 2 * math.pi * i / k
        ex, ey = cx + ln * math.cos(a), cy + ln * math.sin(a)
        mx, my = cx + ln * .55 * math.cos(a), cy + ln * .55 * math.sin(a)
        nx, ny = -math.sin(a) * ln * .16, math.cos(a) * ln * .16
        out.append(P([(cx, cy), (mx + nx, my + ny), (ex, ey), (mx - nx, my - ny)], col, sw=1.6))
    return ''.join(out)


# 한 개짜리 그림: (그리기 함수(x, y) → svg, 너비, 높이, 세는 것의 개수)
def ico_wind(x, y):
    return L(x + 60, y + 70, x + 60, y + 170, GRAY, 5) + blades(x + 60, y + 70, 3, 52, '#DCEAFB') + C(x + 60, y + 70, 6, '#fff')


def ico_fan(x, y):
    return (L(x + 60, y + 70, x + 60, y + 160, GRAY, 6) + R(x + 35, y + 158, 50, 10, '#ccc') + C(x + 60, y + 70, 54, 'none', GRAY, 1.6)
            + blades(x + 60, y + 70, 5, 48, '#BFE3CF') + C(x + 60, y + 70, 7, '#fff'))


def ico_bike(x, y):
    return (C(x + 30, y + 120, 24, 'none', INK, 4) + C(x + 100, y + 120, 24, 'none', INK, 4)
            + '<polyline points="%.1f,%.1f %.1f,%.1f %.1f,%.1f %.1f,%.1f" fill="none" stroke="%s" stroke-width="4"/>'
            % (x + 30, y + 120, x + 55, y + 85, x + 90, y + 85, x + 100, y + 120, BLUE)
            + L(x + 55, y + 85, x + 65, y + 120, BLUE, 4) + L(x + 90, y + 85, x + 86, y + 68, INK, 4) + L(x + 78, y + 68, x + 96, y + 68))


def ico_table(x, y):
    return (P([(x + 15, y + 80), (x + 105, y + 80), (x + 120, y + 95), (x + 30, y + 95)], '#E9C9A0')
            + ''.join(L(x + a, y + 95 if a in (30, 120) else y + 82, x + a, y + (165 if a in (30, 120) else 145), '#8A5A2B', 5)
                      for a in (18, 104, 30, 118)))


def ico_photo(x, y):
    return (L(x, y + 60, x + 120, y + 60, GRAY, 2) + R(x + 20, y + 66, 80, 70, '#FFF6D8') + C(x + 60, y + 95, 14, '#9ED39A', sw=1.5)
            + R(x + 26, y + 52, 10, 22, ORANGE, 2) + R(x + 84, y + 52, 10, 22, ORANGE, 2))


def ico_cotton(x, y):
    return (C(x + 65, y + 50, 30, PINK) + L(x + 65, y + 80, x + 65, y + 120, '#A07850', 4)
            + ''.join(R(x + 10 + 28 * i, y + 130, 24, 24, '#FFF6D8', 3) + T(x + 22 + 28 * i, y + 142, '1분', 10) for i in range(4)))


def ico_pack(x, y):
    out = ''.join(R(x + 14 + 24 * i, y + 70, 20, 70, '#DCEAFB', 6) + R(x + 19 + 24 * i, y + 58, 10, 14, BLUE, 2) for i in range(4))
    return out + R(x + 10, y + 98, 100, 12, YEL, 2)


def ico_canday(x, y, lab=''):
    out = R(x + 8, y + 70, 104, 80, '#F4E6C9', 4)
    out += ''.join(R(x + 18 + 30 * (i % 3), y + 80 + 34 * (i // 3), 24, 30, '#C9D6D3', 4) for i in range(6))
    return out + (T(x + 60, y + 52, lab, 15) if lab else '')


def ico_team(x, y):
    out = R(x + 25, y + 80, 70, 50, '#E9C9A0', 6)
    pos = [(60, 60), (14, 92), (106, 92), (30, 148), (90, 148)]
    return out + ''.join(C(x + a, y + b, 12, '#FFD8B0') for a, b in pos)


def ico_lamp(x, y):
    return (R(x + 5, y + 60, 110, 12, '#ccc') + ''.join(R(x + 12 + 34 * i, y + 78, 28, 70, '#FFF7C2', 8) for i in range(3)))


def ico_egg(x, y):
    return R(x + 4, y + 70, 132, 64, '#F4E6C9', 6) + ''.join(
        '<ellipse cx="%.1f" cy="%.1f" rx="10" ry="13" fill="#fff" stroke="%s" stroke-width="1.6"/>'
        % (x + 20 + 25 * (i % 5), y + 87 + 30 * (i // 5), INK) for i in range(10))


def ico_milk(x, y):
    return R(x + 4, y + 70, 132, 70, '#DCEAFB', 6) + ''.join(
        R(x + 12 + 25 * (i % 5), y + 76 + 32 * (i // 5), 19, 27, '#fff', 2) + P([(x + 12 + 25 * (i % 5), y + 76 + 32 * (i // 5)),
                                                                                 (x + 21.5 + 25 * (i % 5), y + 70 + 32 * (i // 5)),
                                                                                 (x + 31 + 25 * (i % 5), y + 76 + 32 * (i // 5))], BLUE, sw=1)
        for i in range(10))


def ico_octopus(x, y):
    out = ''.join(L(x + 70, y + 95, x + 70 + 52 * math.cos(math.pi * (.08 + .84 * i / 7)), y + 95 + 52 * math.sin(math.pi * (.08 + .84 * i / 7)), '#D3473A', 6)
                  for i in range(8))
    return out + '<ellipse cx="%.1f" cy="%.1f" rx="38" ry="34" fill="#F29B8F" stroke="%s" stroke-width="2"/>' % (x + 70, y + 72, INK)


ICON = {  # 이름: (함수, 너비, 높이, 하나에 몇 개)
    'wind': (ico_wind, 120, 180, 3), 'fan': (ico_fan, 120, 175, 5), 'bike': (ico_bike, 130, 150, 2),
    'table': (ico_table, 135, 170, 4), 'photo': (ico_photo, 120, 145, 2), 'cotton': (ico_cotton, 130, 160, 4),
    'pack': (ico_pack, 120, 150, 4), 'canday': (ico_canday, 120, 160, 6), 'team': (ico_team, 120, 165, 5),
    'lamp': (ico_lamp, 120, 155, 3), 'egg': (ico_egg, 140, 140, 10), 'milk': (ico_milk, 140, 145, 10),
    'octopus': (ico_octopus, 140, 155, 8),
}


def group_fig(kind, ns, lab, count_lab):
    """한 묶음에 k개씩 있는 그림을 n=1,2,3 … 차례로. lab(n): 아래 이름, count_lab(cnt): 셈."""
    fn, w0, h0, k = ICON[kind]
    out, x, gap = [], 20, 34
    for n in ns:
        bw = max(n * w0, len(lab(n)) * 19)
        pad = (bw - n * w0) / 2
        out.append(R(x - 8, 8, bw + 16, h0 + 6, '#FBFCFB', 10, '#C9D6D3', 1.5))
        for i in range(n):
            out.append(fn(x + pad + i * w0, 0, '%d일째' % (i + 1)) if kind == 'canday' else fn(x + pad + i * w0, 0))
        out.append(T(x + bw / 2, h0 + 32, lab(n), 19, weight='bold'))
        if count_lab:
            out.append(T(x + bw / 2, h0 + 58, count_lab(n * k), 17, fill=GRAY))
        x += bw + gap
    return wrap(''.join(out), x - gap + 20, h0 + (74 if count_lab else 48))


# 사이사이(+ 양 끝)에 놓이는 그림
CHAIN = {  # 이름: (본체 너비, 사이 너비, 양 끝에도 있는지, 사이 수 = n에 대한 식)
    'shade': (110, 0, True), 'fence': (90, 0, True), 'card': (90, 0, True), 'armchair': (70, 22, True),
    'bars': (24, 70, False), 'bins': (70, 16, False), 'art': (84, 34, False), 'chair': (70, 40, False),
    'hextri': (70, 44, True), 'sqtri': (60, 0, True),
}


def chain_count(kind, n):
    a, b, ends = CHAIN[kind]
    if kind == 'sqtri':
        return n + 2
    return n + 1 if ends else n - 1


def chain_one(kind, n, x0, y0):
    """→ (svg, 너비, 셈한 수)"""
    a, b, ends = CHAIN[kind]
    out, cnt = [], 0
    if kind == 'sqtri':
        x = x0 + 34
        out.append(P([(x, y0 + 60), (x, y0 + 120), (x - 32, y0 + 90)], YEL)); cnt += 1
        for i in range(n):
            out.append(R(x + a * i, y0 + 60, a, 60, '#9DC8EC', 0))
            out.append(P([(x + a * i, y0 + 60), (x + a * i + a, y0 + 60), (x + a * i + a / 2, y0 + 12)], YEL)); cnt += 1
        xe = x + a * n
        out.append(P([(xe, y0 + 60), (xe, y0 + 120), (xe + 32, y0 + 90)], YEL)); cnt += 1
        return ''.join(out), xe + 32 - x0 + 6, cnt
    if kind == 'hextri':
        x = x0 + 46
        def tri(cx):
            return P([(cx - 17, y0 + 52), (cx + 17, y0 + 52), (cx, y0 + 86)], YEL)
        out.append(tri(x - 22)); cnt += 1
        for i in range(n):
            cx = x + i * (a + b) + a / 2
            pts = [(cx + 36 * math.cos(math.pi / 3 * j), y0 + 70 + 36 * math.sin(math.pi / 3 * j)) for j in range(6)]
            out.append(P(pts, '#9DC8EC'))
            nx = x + i * (a + b) + a + b / 2
            out.append(tri(nx)); cnt += 1
        return ''.join(out), x + n * (a + b) - x0 + 4, cnt
    x = x0 + 16
    marks = []
    for i in range(n):
        bx = x + i * (a + b)
        if kind == 'shade':
            out.append(P([(bx, y0 + 40), (bx + a, y0 + 40), (bx + a - 10, y0 + 62), (bx + 10, y0 + 62)], '#2F4F7A'))
            out.append(''.join(L(bx + 14 + 16 * j, y0 + 44, bx + 18 + 16 * j, y0 + 58, '#9DC8EC', 1.4) for j in range(6)))
        elif kind == 'fence':
            out.append(R(bx + 4, y0 + 50, a - 8, 22, '#E9C9A0', 1) + R(bx + 4, y0 + 86, a - 8, 22, '#E9C9A0', 1))
        elif kind == 'card':
            out.append(R(bx + 4, y0 + 40, a - 8, 64, '#FFF6D8', 3) + L(bx + 16, y0 + 60, bx + a - 16, y0 + 60, GRAY, 2))
        elif kind == 'armchair':
            out.append(R(bx, y0 + 70, a, 30, '#F2A0A0', 4) + R(bx, y0 + 30, a, 40, '#F7C1C1', 4))
        elif kind == 'bars':
            out.append(R(bx, y0 + 20, a, 110, '#9DC8EC', 3) + T(bx + a / 2, y0 + 75, '가', 14))
        elif kind == 'bins':
            col = [BLUE, GREEN, ORANGE, '#9B7BD0', '#D3473A'][i % 5]
            out.append(R(bx, y0 + 50, a, 80, col, 4) + R(bx + 8, y0 + 40, a - 16, 12, '#ccc', 2))
        elif kind == 'art':
            out.append(R(bx, y0 + 40, a, 76, '#FFF6D8', 2, '#8A5A2B', 5) + C(bx + a / 2, y0 + 78, 16, PINK, sw=1))
        elif kind == 'chair':
            out.append(R(bx + 6, y0 + 40, a - 12, 46, '#9ED39A', 6) + R(bx, y0 + 86, a, 16, '#9ED39A', 4)
                       + L(bx + 6, y0 + 102, bx + 6, y0 + 132, INK, 3) + L(bx + a - 6, y0 + 102, bx + a - 6, y0 + 132, INK, 3))
        # 사이(와 양 끝)의 표시
        if ends or i > 0:
            marks.append(bx - b / 2)
    if ends:
        marks.append(x + n * (a + b) - b / 2)
    for mx in marks:
        cnt += 1
        if kind == 'shade':
            out.append(L(mx, y0 + 36, mx, y0 + 140, GRAY, 6))
        elif kind == 'fence':
            out.append(R(mx - 6, y0 + 36, 12, 90, '#8A5A2B', 2))
        elif kind == 'card':
            out.append(C(mx, y0 + 40, 9, '#D3473A'))
        elif kind == 'armchair':
            out.append(R(mx - 9, y0 + 54, 18, 50, '#B5541C', 4))
        elif kind == 'bars':
            out.append(R(mx - b / 2 + 4, y0 + 66, b - 8, 18, ORANGE, 3) + T(mx, y0 + 98, '나', 13))
        elif kind == 'bins':
            out.append(R(mx - 3, y0 + 30, 6, 100, GRAY, 1))
        elif kind == 'art':
            out.append('<circle cx="%.1f" cy="%.1f" r="8" fill="none" stroke="%s" stroke-width="3"/>' % (mx, y0 + 78, GRAY))
        elif kind == 'chair':
            out.append(R(mx - 13, y0 + 62, 26, 40, YEL, 4) + T(mx, y0 + 82, '☀', 14))
    return ''.join(out), x + n * (a + b) - (b / 2 if ends else b) - x0 + 16, cnt


def chain_fig(kind, ns, lab, count_lab):
    out, x = [], 10
    for n in ns:
        lw = len(lab(n)) * 18
        s, w, cnt = chain_one(kind, n, x, 0)
        if w < lw:
            s, w, cnt = chain_one(kind, n, x + (lw - w) / 2, 0)
            w = lw
        assert cnt == chain_count(kind, n), (kind, n, cnt)
        out.append(s)
        out.append(T(x + w / 2, 162, lab(n), 18, weight='bold'))
        if count_lab:
            out.append(T(x + w / 2, 188, count_lab(cnt), 16, fill=GRAY))
        x += w + 30
    return wrap(''.join(out), x - 20, 204 if count_lab else 178)


def one_fig(body, W, H):
    return wrap(body, W, H)


def ball_fig(lab, w, kind='tball'):
    out = []
    for i in range(3):
        cx = 70 + 110 * i
        if kind == 'tball':
            out.append(C(cx, 70, 34, '#F7F2E3') + '<path d="M%.1f,%.1f q 18,34 0,68" fill="none" stroke="#D3473A" stroke-width="2"/>' % (cx - 14, 37))
        else:
            out.append(R(cx - 26, 30, 52, 80, '#C9D6D3', 10) + R(cx - 26, 30, 52, 12, '#9AA9A6', 6))
        out.append(T(cx, 128, w, 16, fill=GRAY))
    out.append(T(185, 160, lab, 18, weight='bold'))
    return wrap(''.join(out), 370, 180)


def crank_fig():
    s = (R(70, 80, 170, 60, YEL, 14, '#B58A12', 3) + P([(240, 72), (290, 56), (290, 164), (240, 148)], '#FFE9A8', '#B58A12', 3)
         + C(130, 110, 16, '#fff', GRAY, 3) + L(130, 110, 130, 60, GRAY, 6) + C(130, 56, 9, ORANGE)
         + L(300, 80, 380, 50, YEL, 5) + L(300, 110, 392, 110, YEL, 5) + L(300, 140, 380, 170, YEL, 5)
         + T(150, 180, '손잡이를 1분 돌리면', 18, fill=GRAY) + T(500, 96, '불이 5분 동안', 22, fill='#B5541C') + T(500, 128, '켜져요', 22, fill='#B5541C'))
    return wrap(s, 640, 200)


def board_fig():
    """1차시 동아리 게시판(이야기 버전)."""
    out = [R(8, 8, 694, 250, '#EAF6EC', 16, '#8CC9A0', 4), T(355, 34, '초록 탐사대 캠페인 — 모으고, 아끼고, 나눠요', 20, fill='#2E7D4A')]
    out.append(ico_pack(40, 20))
    out.append(ico_canday(195, 16, '하루'))
    out.append(ico_team(350, 30))
    s, wd, c = chain_one('fence', 2, 478, 40)
    out.append(s)
    for t, x in (("페트병 4개 한 묶음", 100), ("하루에 캔 6개", 255), ("한 모둠 5명", 410), ("꽃밭 울타리", 584)):
        out.append(T(x, 232, t, 15, fill=GRAY))
    return wrap(''.join(out), 710, 266)


_cache = {}


def png(svgt, width_px=1500):
    svg = svgt[0]
    key = hashlib.sha1(svg.encode('utf-8')).hexdigest()[:16]
    if key not in _cache:
        p = os.path.join(TMP, key + '.png')
        svg_to_png(svg, p, width_px=width_px)
        _cache[key] = p
    return _cache[key]


# ================================================================ 쪽 높이를 어림해 묶음째 넘기기(4학년 활동지와 같은 방식)
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

    def pic(self, svgt, mm=150, maxh=60):
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
        self._q(sum(max(11.6, 7.5 * max(str(c).count('\n') + 1 for c in r)) for r in rows) + 1, self.s.table, rows, **k)

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
def corr(w, heads, xs, f, bx=(), by=(), D=False, more=False):
    """대응표. 도전형(more)이면 둘째 줄을 첫 칸 말고 모두 비워요."""
    if D and more:
        by = tuple(range(1, len(xs)))
    rows, blanks, ys = ctable(heads, xs, f, bx, by)
    cw = 52 if max(len(h) for h in heads) > 11 else 44
    w.table(rows, header=False, header_col=True, col_mm=[cw] + [(180 - cw) / len(xs)] * len(xs))
    return ', '.join(blanks), ys


def eq_block(w, D, title, syms, pair, env, form):
    """기호 식 두 가지. form: 기본형 틀 [‘△ = □ (   ) (   )’, …]."""
    eqs(pair, env)
    if title:
        w.text(title)
    if D:
        w.fill('식 1:  (                              )        식 2:  (                              )')
    else:
        w.fill('     '.join(form))
    return ' / '.join(pair)


def write2(w, D, pairs):
    """[(질문, 기본형 문장 틀, 예시 답)] — 기본형은 문장 틀, 도전형은 쓰는 줄."""
    for q, frame, _ in pairs:
        if D:
            w.write(q, 2)
        else:
            w.ask(q, blank=False)
            w.fill(frame)
    return ' / '.join('(예: %s)' % a for _, _, a in pairs)


def why1(w, D, q, frame, ans):
    """앱의 ‘먼저 예상해요’·‘왜 그럴까요?’ 칸."""
    if D:
        w.write(q, 2)
    else:
        w.ask(q, blank=False)
        w.fill(frame)
    return '(예: %s)' % ans


def OX(xs):
    return [(x, '( ○ / × )') for x in xs]


def ox_ans(n, good):
    return ' '.join('○' if i in good else '×' for i in range(n))


def seq_order(w, items, order):
    """order: 앱 sequence의 정답 차례(바른 차례의 items 번호 목록)."""
    w.choices([(t, '(      )번째') for t in items])
    pos = {k: i + 1 for i, k in enumerate(order)}
    return ', '.join(str(pos[i]) for i in range(len(items)))


def link_block(w, left, right, pairs, lt, rt):
    """짝 잇기: 오른쪽에 ㉠㉡… 이름을 붙이고 왼쪽 칸에 이름을 쓰게."""
    w.text('%s:  ' % rt + '   '.join('%s %s' % (CIRC[i], r) for i, r in enumerate(right)))
    w.choices([(l, '(      )') for l in left])
    return ', '.join(CIRC[pairs[i]] for i in range(len(left)))


def pick_ans(i):
    return '①②③④⑤'[i]


def water_table(w):
    w.table([['음식물', '콜라', '우유', '식용유', '라면 국물'],
             ['1 mL를 깨끗한 물로 만드는 데\n필요한 물의 양'] + ['%d L' % v for _, v in WATER]],
            col_mm=[60, 30, 30, 30, 30])
    w.text('(출처: 국립환경과학원, 『우리가 남긴 음식물, 물을 얼마나 오염시킬까요?』)')


WATER = [("콜라", 24), ("우유", 54), ("식용유", 37), ("라면 국물", 7)]
WV = dict(WATER)

ORDER_SRC = ["카드를 보고 두 양 사이의 대응 관계를 기호를 사용하여 각자 식으로 나타내요", "카드를 섞어 뒤집어 쌓아 두고 가위바위보로 순서를 정해요",
             "남은 카드가 없을 때까지 반복하고, 점수의 합이 가장 높은 사람이 이겨요", "자기 차례에 카드 한 장을 뒤집어 내려놓아요",
             "식이 맞은 사람은 1점, 카드를 뒤집은 사람은 주사위를 던져 점수를 더 얻어요"]
ORDER_ANS = [1, 3, 0, 4, 2]


def game_block(w, D, deck):
    """놀이 카드: 카드마다 기호가 정해져 있고 대응표의 수를 넣어 두 식을 확인."""
    rows = [['카드', '알려 주는 것', '식 1', '식 2']]
    keys = []
    use = deck if D else deck[:4]
    for t, note, s1, s2, f, x0, pair in use:
        xs = [x0 + i for i in range(4)]
        eqs(pair, {s1: xs, s2: [f(x) for x in xs]})
        rows.append([t, note, '', ''])
        keys.append('%s %s' % (t.split('(')[0], ', '.join(pair)))
    w.table(rows, col_mm=[52, 64, 32, 32], row_h=4300)
    w.text('점수 기록:  식이 맞으면 1점 + (카드를 뒤집은 사람) 주사위 눈이 홀수이면 1점, 짝수이면 2점')
    w.table([['판', '1', '2', '3', '4', '5', '6', '합계'], ['내 점수', '', '', '', '', '', '', '']], header=True)
    return ' / '.join(keys)


def dice_score(eye):
    return 1 + (2 if eye % 2 == 0 else 1)


# ================================================================ 교과서 차시 버전
TB_SCENE = ("다온이는 한결이와 함께 친환경 에너지 공원에 왔어요. 태양광 그늘막, 자전거 발전기, 전기 열차, 풍력 발전기, "
            "태양열 충전기처럼 환경을 보호하는 멋진 시설물이 가득해요.")


def tb_l1(w, D):
    w.lesson(1, "개념 찾기(S)", "단원 도입 ― 친환경 에너지 공원", "우리 주변에서 한 양이 변할 때 함께 변하는 다른 양에는 무엇이 있을까요?", TB_SCENE)
    w.step("① 그림 살펴보기", "에펠 탑 칠하기")
    w.text("에펠 탑은 주기적으로 새로 칠하는데 1번 칠할 때마다 페인트 54 t을 사용한대요. 표를 완성해 보세요.")
    t1, _ = corr(w, ["칠하는 횟수(번)", "사용한 페인트의 양(t)"], [1, 2, 3, 4] if D else [1, 2, 3], lambda n: 54 * n, by=(1, 2, 3) if D else (1, 2))
    w.fill("칠하는 횟수가 1번씩 늘어날 때마다 페인트의 양은 (        ) t씩 늘어나요.")
    w.step("② 공원 둘러보기", "공원에서 볼 수 있는 친환경 시설")
    o2 = ["풍력 발전기", "전기 열차", "의자와 태양열 충전기", "석탄을 태우는 발전소", "모노레일"]
    w.text("공원에서 볼 수 있는 친환경 시설이면 ○, 아니면 ×에 표시해 보세요.")
    w.choices(OX(o2))
    w.step("③ 함께 변하는 두 양", "풍력 발전기와 날개")
    w.pic(group_fig('wind', [1, 2], lambda n: '풍력 발전기 %d대' % n, None), 90, 50)
    w.ask("풍력 발전기 1대의 날개는 몇 개인가요?")
    w.ask("풍력 발전기 2대의 날개는 몇 개인가요?")
    w.step("④ 배울 내용 살펴보기", "배우는 순서대로 번호 쓰기")
    s4 = seq_order(w, ["대응 관계를 식으로 나타내기", "두 양 사이의 관계 알아보기", "대응 관계를 이용하여 문제 해결하기",
                       "생활 속에서 대응 관계를 찾아 식으로 나타내기"], [1, 0, 3, 2])
    w.step("⑤ 배운 내용 떠올리기", "4학년 때 배운 규칙")
    seq = [3 * 2 ** i for i in range(5)]
    w.ask("수의 배열 3, 6, 12, 24, □에서 □에 알맞은 수는?")
    sq = [1 + 2 * i for i in range(5)]
    w.ask("사각형이 1개, 3개, 5개, 7개로 놓인 도형의 배열에서 다섯째에 놓일 사각형은 몇 개?")
    ans = ("1차시  ① %s, 54 ② %s ③ 3개, 6개 ④ %s ⑤ %d, %d개" % (t1, ox_ans(5, [0, 1, 2, 4]), s4, seq[4], sq[4]))
    if D:
        w.step("⑥ 도전하기", "함께 변하는 두 양")
        w.text("블록 자동차 1대에는 바퀴가 4개, 관람차 1칸에는 4명이 탈 수 있어요.")
        w.ask("블록 자동차가 2대이면 바퀴는 몇 개?")
        w.ask("블록 자동차가 10대이면 바퀴는 몇 개?")
        w.ask("관람차 3칸에는 몇 명이 탈 수 있나요?")
        w.why("블록 자동차 10대의 바퀴가 14개가 아닌 까닭을 써 보세요.", 1)
        ans += " ⑥ %d개, %d개, %d명, 왜: (예: 10+4가 아니라 바퀴 4개씩 10묶음이에요)" % (4 * 2, 4 * 10, 4 * 3)
    return ans


def tb_l2(w, D):
    w.lesson(2, "개념 구축하기(O)", "두 양 사이의 관계를 알아볼까요 ⑴", "한 양이 변할 때 다른 양은 어떻게 함께 변할까요?",
             "공원 입구 무인 자전거 대여소예요. 한결: “자전거 1대에 바퀴가 2개씩 있어.”")
    w.step("① 만져 보기", "자전거의 수와 바퀴의 수")
    w.pic(group_fig('bike', [1, 2, 3], lambda n: '자전거 %d대' % n, None), 170, 42)
    t1, _ = corr(w, ["자전거의 수(대)", "자전거 바퀴의 수(개)"], [1, 2, 3], lambda n: 2 * n, by=(1, 2))
    w.fill("자전거가 1대씩 늘어날 때마다 자전거 바퀴는 (        )개씩 늘어나요.")
    w.text("자전거의 수에 따라 함께 변하는 것이면 ○, 아니면 ×에 표시해 보세요.")
    w.choices(OX(["자전거 바퀴의 수", "자전거 손잡이의 수", "자전거 페달의 수", "자전거 대여소의 수"]))
    w.step("② 그려 보기", "식탁의 수와 식탁 다리의 수")
    w.pic(group_fig('table', [1, 2, 3], lambda n: '식탁 %d개' % n, None), 170, 45)
    t2, _ = corr(w, ["식탁의 수(개)", "식탁 다리의 수(개)"], [1, 2, 3, 4], lambda n: 4 * n, by=(1, 2, 3), D=D, more=True)
    w.ask("식탁이 5개일 때 식탁 다리는 몇 개?")
    w.step("③ 말해 보기", "두 양을 함께 관련지어 말하기")
    w.fill(["식탁 다리의 수는 식탁의 수의 (        )배예요.", "식탁의 수는 식탁 다리의 수를 (        )로 나눈 것과 같아요."])
    w.pick("두 양을 함께 관련지어 말한 것은 어느 것인가요?", ["식탁 다리는 4개씩 늘어나요.", "식탁 다리의 수는 식탁의 수의 4배예요.", "식탁은 1개씩 늘어나요."])
    w.step("④ 약속하기")
    if not D:
        w.wordbox(["대응한다", "비교한다", "규칙이다", "대응 관계", "크기 관계", "덧셈 관계"])
    w.fill(["식탁의 수와 식탁 다리의 수와 같이 두 양이 짝을 이루는 것을 (              )고 하고,",
            "한 양이 변함에 따라 다른 양이 변할 때 두 양 사이의 관계를 (              )라고 합니다."])
    w.step("⑤ 확인하기", "교실에서 대응하는 두 양 찾기")
    lk = link_block(w, ["의자의 수", "사진의 수", "모둠의 수(모둠마다 책상 4개)"], ["책상의 수", "의자 다리의 수", "집게의 수"], [1, 2, 0], "한 양", "짝을 이루는 양")
    w.pic(group_fig('photo', [1, 2, 3], lambda n: '사진 %d장' % n, None), 150, 40)
    w.fill(["집게의 수는 사진의 수의 (        )배예요.", "사진의 수는 집게의 수를 (        )로 나눈 것과 같아요."])
    ans = "2차시  ① %s, 2, %s ② %s, %d개 ③ 4, 4, ② ④ 대응한다, 대응 관계 ⑤ %s, 2, 2" % (t1, ox_ans(4, [0, 1, 2]), t2, 4 * 5, lk)
    if D:
        w.step("⑥ 도전하기", "컵과 칫솔, 표에 없는 수 구하기")
        w.text("컵 1개에 칫솔이 2개씩 꽂혀 있어요.")
        t6, _ = corr(w, ["컵의 수(개)", "칫솔의 수(개)"], [1, 2, 3], lambda n: 2 * n, by=(1, 2))
        w.fill("칫솔의 수는 컵의 수의 (     )배이고, 컵의 수는 칫솔의 수를 (     )로 나눈 것과 같아요.")
        w.ask("삼각형 1개마다 사각형 3개를 놓는 배열에서 삼각형이 4개이면 사각형은 몇 개?")
        w.ask("그릇 한 개에 방울토마토가 12개씩 있어요. 그릇 8개에는 모두 몇 개?")
        w.why("방울토마토가 20개가 아닌 까닭을 써 보세요.", 1)
        ans += " ⑥ %s, 2, 2, %d개, %d개, 왜: (예: 12+8이 아니라 12개씩 8묶음이에요)" % (t6, 3 * 4, 12 * 8)
    return ans


def tb_l3(w, D):
    w.lesson(3, "개념 구축하기(O)", "두 양 사이의 관계를 알아볼까요 ⑵", "더하거나 빼는 관계인 두 양 사이의 대응 관계는 어떻게 말할까요?",
             "태양광 그늘막이 공원 길을 따라 이어져 있어요. 이웃한 그늘막은 기둥을 함께 써요.")
    w.step("① 만져 보기", "그늘막의 수와 기둥의 수")
    w.pic(chain_fig('shade', [1, 2, 3], lambda n: '그늘막 %d개' % n, None), 170, 42)
    t1, _ = corr(w, ["그늘막의 수(개)", "기둥의 수(개)"], [1, 2, 3, 4], lambda n: n + 1, by=(1, 2, 3))
    w.ask("그늘막이 5개일 때 기둥은 몇 개?")
    w.step("② 그려 보기", "대응 관계 말하기")
    w.fill(["그늘막의 수는 기둥의 수보다 (     )개 더 ( 적어요 / 많아요 ).", "기둥의 수는 그늘막의 수보다 (     )개 더 ( 적어요 / 많아요 )."])
    w.text("그늘막의 수와 기둥의 수 사이의 대응 관계를 바르게 말한 것이면 ○, 아니면 ×에 표시해 보세요.")
    w.choices(OX(["기둥의 수는 그늘막의 수에 1을 더한 것과 같아요.", "그늘막의 수는 기둥의 수에서 1을 뺀 것과 같아요.",
                  "기둥의 수는 그늘막의 수의 2배예요.", "기둥은 1개씩 늘어나요."]))
    w.step("③ 말해 보기", "가 모양 막대와 나 모양 막대")
    w.pic(chain_fig('bars', [1, 2, 3, 4], lambda n: '가 막대 %d개' % n, None), 170, 40)
    t3, _ = corr(w, ["가 모양 막대의 수(개)", "나 모양 막대의 수(개)"], [1, 2, 3, 4], lambda n: n - 1, by=(1, 2, 3))
    w.fill(["나 모양 막대의 수는 가 모양 막대의 수에서 (     )을 뺀 것과 같아요.", "가 모양 막대의 수는 나 모양 막대의 수에 (     )을 더한 것과 같아요."])
    w.ask("가 모양 막대가 10개일 때 나 모양 막대는 몇 개?")
    w.step("④ 정리하기", "곱의 관계와 합(차)의 관계")
    lk = link_block(w, ["자전거의 수와 바퀴의 수", "그늘막의 수와 기둥의 수", "식탁의 수와 식탁 다리의 수", "가 모양 막대의 수와 나 모양 막대의 수"],
                    ["나 모양 막대의 수는 가 모양 막대의 수에서 1을 뺀 것", "바퀴의 수는 자전거의 수의 2배", "기둥의 수는 그늘막의 수에 1을 더한 것",
                     "식탁 다리의 수는 식탁의 수의 4배"], [1, 2, 3, 0], "두 양", "대응 관계")
    w.pick("어느 말이 맞나요?", ["몇 배인 관계만 대응 관계예요.", "몇 배인 관계도, 더하거나 빼는 관계도 모두 대응 관계예요."])
    w.step("⑤ 확인하기", "사각형과 삼각형의 배열")
    w.pic(chain_fig('sqtri', [1, 2, 3], lambda n: '사각형 %d개' % n, None), 160, 42)
    t5, _ = corr(w, ["사각형의 수(개)", "삼각형의 수(개)"], [1, 2, 3, 4], lambda n: n + 2, by=(1, 2, 3), D=D, more=True)
    w.fill(["삼각형의 수는 사각형의 수에 (     )를 더한 것과 같아요.", "사각형의 수는 삼각형의 수에서 (     )를 뺀 것과 같아요."])
    w.choices([("서로 대응하는 두 양은?", "( 사각형의 수와 삼각형의 수 / 사각형의 색깔과 삼각형의 색깔 / 배열의 이름과 종이의 수 )")])
    ans = ("3차시  ① %s, %d개 ② 1, 적어요, 1, 많아요, %s ③ %s, 1, 1, %d개 ④ %s, ② ⑤ %s, 2, 2, 사각형의 수와 삼각형의 수"
           % (t1, 5 + 1, ox_ans(4, [0, 1]), t3, 10 - 1, lk, t5))
    if D:
        w.step("⑥ 도전하기", "의자와 팔걸이, 민지와 오빠의 나이")
        w.pic(chain_fig('armchair', [3], lambda n: '의자 %d개, 팔걸이 %d개' % (n, n + 1), None), 70, 36)
        t6, _ = corr(w, ["의자의 수(개)", "팔걸이의 수(개)"], [1, 2, 3, 4], lambda n: n + 1, by=(1, 2, 3))
        w.ask("의자가 20개일 때 팔걸이는 몇 개?")
        w.text("매년 3월 1일에 민지가 10살, 11살, 12살일 때 오빠는 14살, 15살, 16살이었어요.")
        assert [n + 4 for n in (10, 11, 12)] == [14, 15, 16]
        w.ask("민지가 15살인 해에 오빠는 몇 살?")
        w.why("의자가 20개일 때 팔걸이가 40개가 아닌 까닭을 써 보세요.", 1)
        ans += " ⑥ %s, %d개, %d살, 왜: (예: 이웃한 의자는 팔걸이를 함께 써서 팔걸이는 의자보다 1개만 더 많아요)" % (t6, 21, 15 + 4)
    return ans


def tb_l4(w, D):
    w.lesson(4, "개념 구축하기(O)", "대응 관계를 식으로 나타내어 볼까요", "두 양 사이의 대응 관계를 기호를 사용하여 식으로 어떻게 나타낼까요?",
             "자전거 발전기로 솜사탕 1개를 만들려면 페달을 4분 동안 밟아야 해요.")
    xs = [1, 2, 3, 4, 5]
    f = lambda n: 4 * n
    w.step("① 만져 보기", "솜사탕의 수와 페달을 밟는 시간")
    w.pic(group_fig('cotton', [1, 2, 3], lambda n: '솜사탕 %d개' % n, None), 170, 42)
    t1, ys = corr(w, ["솜사탕의 수(개)", "페달을 밟는 시간(분)"], xs, f, bx=(3,), by=(1, 2, 4))
    w.fill(["솜사탕이 1개씩 늘어날 때마다 페달을 밟는 시간은 (     )분씩 늘어나요.", "페달을 밟는 시간은 솜사탕의 수의 (     )배예요."])
    w.step("② 그려 보기", "보기 카드로 낱말 식 만들기")
    w.wordbox(["=", "2", "4", "+", "−", "×", "÷", "솜사탕의 수", "페달을 밟는 시간"])
    env = {'A': xs, 'B': ys}
    eqs(['B=A×4', 'A=B÷4'], env)
    if D:
        w.fill(["곱셈식:  (                                                        )", "나눗셈식:  (                                                        )"])
    else:
        w.fill(["(페달을 밟는 시간) = (솜사탕의 수) (     ) (     )", "(솜사탕의 수) = (페달을 밟는 시간) (     ) (     )"])
    w.step("③ 말해 보기", "엽서와 자석")
    w.text("엽서를 나란히 붙이며 엽서와 엽서가 만나는 곳과 양 끝에 자석을 붙였어요.")
    w.pic(chain_fig('card', [1, 2, 3], lambda n: '엽서 %d장' % n, None), 160, 40)
    t3, ys3 = corr(w, ["엽서의 수(장)", "자석의 수(개)"], xs, lambda n: n + 1, bx=(2, 4), by=(3,))
    w.fill(["자석의 수는 엽서의 수에 (     )을 더한 것과 같아요.", "엽서의 수는 자석의 수에서 (     )을 뺀 것과 같아요."])
    w.step("④ 약속하기", "기호를 사용한 식")
    if not D:
        w.wordbox(["기호", "글자", "그림"])
    w.fill("각 양을 ○, △, □, ☆과 같은 (          )로 나타내면 두 양 사이의 대응 관계를 식으로 간단하게 나타낼 수 있어요.")
    e4 = eq_block(w, D, "엽서의 수를 □, 자석의 수를 △라고 할 때 덧셈식과 뺄셈식으로 나타내 보세요.", None, ['△=□+1', '□=△−1'],
                  {'□': xs, '△': ys3}, ['△ = □ (     ) (     )', '□ = △ (     ) (     )'])
    w.step("⑤ 확인하기", "티볼 공의 수와 무게")
    w.pic(ball_fig('티볼 공 1개의 무게는 80 g', '80 g'), 100, 40)
    t5, ys5 = corr(w, ["티볼 공의 수(개)", "티볼 공의 무게(g)"], xs, lambda n: 80 * n, bx=(2, 4), by=(1, 3, 4))
    e5 = eq_block(w, D, "티볼 공의 수를 ☆, 티볼 공의 무게를 □라고 할 때 식으로 나타내 보세요.", None, ['□=☆×80', '☆=□÷80'],
                  {'☆': xs, '□': ys5}, ['□ = ☆ (     ) (     )', '☆ = □ (     ) (     )'])
    w.ask("티볼 공 50개의 무게는 몇 g?")
    ans = ("4차시  ① %s, 4, 4 ② (페달을 밟는 시간)=(솜사탕의 수)×4, (솜사탕의 수)=(페달을 밟는 시간)÷4 ③ %s, 1, 1 ④ 기호, %s ⑤ %s, %s, %d g"
           % (t1, t3, e4, t5, e5, 50 * 80))
    if D:
        w.step("⑥ 도전하기", "바람개비, 서우의 나이, 팔찌")
        w.pick("팔찌 1개에 구슬이 20개씩 있어요. 대응 관계를 잘못 설명한 사람은?",
               ["미나: 팔찌의 수를 □, 구슬의 수를 ▽라고 하면 □=▽÷20이에요.", "세빈: ♡=◎×20에서 ◎는 구슬의 수, ♡는 팔찌의 수예요."])
        eqs(['□=▽÷20'], {'□': [1, 2, 3], '▽': [20, 40, 60]})
        e6a = eq_block(w, D, "날개가 6개인 바람개비의 수를 □, 바람개비 날개의 수를 ○라고 할 때", None, ['○=□×6', '□=○÷6'],
                       {'□': [1, 2, 3, 4], '○': [6, 12, 18, 24]}, [])
        e6b = eq_block(w, D, "매년 1월 1일의 연도를 △, 서우의 나이를 ☆라고 할 때 (2023년에 10살)", None, ['☆=△−2013', '△=☆+2013'],
                       {'△': [2023, 2024, 2025, 2026], '☆': [10, 11, 12, 13]}, [])
        w.why("세빈이의 설명이 틀린 까닭을 써 보세요.", 1)
        ans += " ⑥ ②(세빈), %s, %s, 왜: (예: ◎가 구슬의 수이면 ♡=◎×20은 팔찌의 수가 구슬의 20배라는 뜻이 되어요. ◎가 팔찌의 수, ♡가 구슬의 수여야 해요)" % (e6a, e6b)
    return ans


def tb_l5(w, D):
    w.lesson(5, "개념 구축하기(O)", "생활 속에서 대응 관계를 찾아 식으로 나타내어 볼까요", "생활 속에서 서로 대응하는 두 양을 찾아 식으로 어떻게 나타낼까요?",
             ["“풍력 발전기는 1대당 날개가 3개씩 있고, 의자 2개 사이에 태양열 충전기가 1개씩 있어.”",
              "“전기 열차는 1분에 100 m씩 이동하고, 모노레일은 페달을 1번 밟으면 50 cm를 이동한대.”"])
    w.step("① 만져 보기", "서로 대응하는 두 양 찾기")
    spots = [("풍력 발전기", "풍력 발전기의 수와 (              )의 수", "날개"), ("전기 열차", "전기 열차가 달린 시간과 (              )", "이동 거리"),
             ("모노레일", "페달을 밟은 (              )와 이동 거리", "횟수"), ("의자와 충전기", "의자의 수와 (                    )의 수", "태양열 충전기"),
             ("자전거", "자전거의 수와 (                    )의 수", "자전거 바퀴")]
    if D:
        w.labeled([(a, '\n') for a, _, _ in spots[:4]], row_h=3400)
    else:
        w.labeled([(a, b) for a, b, _ in spots[:4]], row_h=3400)
    xs4 = [1, 2, 3, 4]
    w.step("② 그려 보기", "풍력 발전기의 수와 날개의 수")
    w.pic(group_fig('wind', [1, 2, 3], lambda n: '풍력 발전기 %d대' % n, None), 150, 40)
    t2, ys2 = corr(w, ["풍력 발전기의 수(대) ◇", "날개의 수(개) ♡"], xs4, lambda n: 3 * n, bx=(3,), by=(1, 2))
    e2 = eq_block(w, D, None, None, ['♡=◇×3', '◇=♡÷3'], {'◇': xs4, '♡': ys2}, ['♡ = ◇ (     ) (     )', '◇ = ♡ (     ) (     )'])
    w.step("③ 말해 보기", "내가 고른 기호로 식 쓰기")
    t3a, ys3 = corr(w, ["전기 열차가 달린 시간(분)", "이동 거리(m)"], xs4, lambda n: 100 * n, by=(1, 2, 3) if D else ())
    eqs(['☆=□×100'], {'□': xs4, '☆': ys3})
    w.fill("(     )를 달린 시간, (     )를 이동 거리라고 하면   식: (                              )")
    w.pic(chain_fig('chair', [3], lambda n: '의자 %d개, 태양열 충전기 %d개' % (n, n - 1), None), 70, 34)
    t3b, ys3b = corr(w, ["의자의 수(개)", "태양열 충전기의 수(개)"], [2, 3, 4, 5], lambda n: n - 1, by=(1, 2, 3) if D else ())
    eqs(['△=□−1'], {'□': [2, 3, 4, 5], '△': ys3b})
    w.fill("(     )를 의자의 수, (     )를 충전기의 수라고 하면   식: (                              )")
    w.step("④ 비교하기", "친구의 식과 견주기")
    w.pick("다온이는 전기 열차의 대응 관계를 ☆=□×100, 한결이는 ▽=⊙×100으로 나타냈어요. (□, ⊙는 달린 시간, ☆, ▽는 이동 거리) 어떻게 생각하나요?",
           ["두 식 모두 맞아요. 기호만 다르게 하여 같은 대응 관계를 나타냈어요.", "□와 △만 쓸 수 있으니 한결이의 식은 틀렸어요.", "두 식 모두 틀렸어요."])
    eqs(['▽=⊙×100'], {'⊙': xs4, '▽': ys3})
    e4 = eq_block(w, D, "모노레일 페달을 밟은 횟수를 ⊙, 이동 거리(cm)를 ▽라고 할 때 (1번 밟으면 50 cm)", None, ['▽=⊙×50', '⊙=▽÷50'],
                  {'⊙': xs4, '▽': [50 * n for n in xs4]}, ['▽ = ⊙ (     ) (     )', '⊙ = ▽ (     ) (     )'])
    w.step("⑤ 확인하기", "작품과 고리")
    w.text("“작품을 전시하기 위해 사용한 고리의 수는 작품의 수보다 1개 더 적어.”")
    w.pic(chain_fig('art', [1, 2, 3], lambda n: '작품 %d개' % n, None), 160, 40)
    xs5 = [1, 2, 3, 4, 5]
    t5, ys5 = corr(w, ["작품의 수(개)", "고리의 수(개)"], xs5, lambda n: n - 1, by=(1, 2, 3, 4))
    eqs(['△=□−1'], {'□': xs5, '△': ys5})
    w.fill("(     )를 작품의 수, (     )를 고리의 수라고 하면   식: (                              )")
    ans = ("5차시  ① 날개, 이동 거리, 횟수, 태양열 충전기(그 밖에 자전거와 바퀴) ② %s, %s ③ %s예) □, ☆, ☆=□×100 / %s예) □, △, △=□−1 "
           "④ ①, %s ⑤ %s, 예) □, △, △=□−1" % (t2, e2, (t3a + ', ') if t3a else '', (t3b + ', ') if t3b else '', e4, t5))
    if D:
        w.step("⑥ 도전하기", "도시락과 초밥, 주호와 누나의 나이")
        e6a = eq_block(w, D, "도시락마다 초밥이 8개씩 있어요. 도시락의 수를 □, 초밥의 수를 ○라고 할 때", None, ['○=□×8', '□=○÷8'],
                       {'□': xs4, '○': [8 * n for n in xs4]}, [])
        e6b = eq_block(w, D, "어느 해 4월 1일에 주호는 9살, 누나는 14살이었어요. 주호의 나이를 □, 누나의 나이를 ○라고 할 때", None, ['○=□+5', '□=○−5'],
                       {'□': [9, 10, 11, 12], '○': [14, 15, 16, 17]}, [])
        w.ask("주호가 13살이 되는 해에 누나는 몇 살?")
        w.why("같은 대응 관계를 여러 가지 식으로 나타낼 수 있는 까닭을 써 보세요.", 1)
        ans += " ⑥ %s, %s, %d살, 왜: (예: 어떤 기호를 쓰는지, 무엇을 기준으로 하는지에 따라 식이 달라질 수 있어요)" % (e6a, e6b, 13 + 5)
    return ans


def tb_l6(w, D):
    w.lesson(6, "탐구 정리하기(O)", "생각을 더하다 ― 소중한 물, 우리가 지켜요",
             "대응 관계를 이용하여 음식물을 깨끗한 물로 만드는 데 필요한 물의 양을 어떻게 구할까요?",
             "물은 우리의 건강을 지키고 물에서 사는 동물과 식물을 보호하는 소중한 자원이에요. 물을 오염시키는 원인 중 하나가 버려진 음식물이에요.")
    w.step("① 이해해요", "구하려는 것 찾기")
    water_table(w)
    w.text("문제: 우유 200 mL를 깨끗한 물로 만드는 데 필요한 물은 몇 L일까요?")
    w.pick("구하려는 것은 무엇인가요?", ["우유 200 mL를 깨끗한 물로 만드는 데 필요한 물의 양", "우유 1 mL를 깨끗한 물로 만드는 데 필요한 물의 양", "우유 200 mL의 무게"])
    w.ask("우유 1 mL를 깨끗한 물로 만드는 데 필요한 물은 몇 L?")
    w.step("② 계획해요", "해결 방법 고르기")
    w.pick("어떤 방법으로 해결하면 좋을까요?", ["우유가 1 mL씩 늘어날 때마다 필요한 물이 몇 L씩 늘어나는지 알아보고, 대응 관계를 식으로 나타내요.",
                                     "우유 200 mL와 54 L를 더해요.", "우유가 200 mL이니 물도 200 L가 필요하다고 생각해요."])
    w.step("③ 해결해요 ①", "표와 식으로 나타내기")
    xs = [1, 2, 3, 4]
    t3, ys = corr(w, ["우유의 양(mL) □", "필요한 물의 양(L) △"], xs, lambda n: 54 * n, by=(1, 2, 3))
    w.fill("필요한 물의 양(L)은 우유의 양(mL)의 (        )배예요.")
    e3 = eq_block(w, D, None, None, ['△=□×54', '□=△÷54'], {'□': xs, '△': ys}, ['△ = □ (     ) (     )', '□ = △ (     ) (     )'])
    w.step("④ 해결해요 ②", "식을 이용하여 구하기")
    qs = [("우유", 200), ("콜라", 200), ("식용유", 15), ("라면 국물", 500)]
    for food, ml in qs:
        w.ask("%s %d mL를 깨끗한 물로 만드는 데 필요한 물은 몇 L?" % (food, ml))
    a4 = ', '.join('%d L' % (ml * WV[food]) for food, ml in qs)
    assert 200 * 54 == 10800
    w.step("⑤ 되돌아봐요")
    a5 = write2(w, D, [("문제를 해결한 방법을 설명해 보세요.", "표를 만들어 대응 관계를 찾고 △=□×(     )로 나타낸 뒤, □에 (     )을 넣어 (          ) L를 구했어요.",
                        "표를 만들어 대응 관계를 찾고 △=□×54로 나타낸 뒤, □에 200을 넣어 10800 L를 구했어요"),
                       ("물을 지키기 위해 내가 할 수 있는 일을 써 보세요.", "나는 (                                        ) 물을 지키겠어요.",
                        "먹을 만큼만 받아서 음식물을 남기지 않아요")])
    ans = "6차시  ① ①, 54 L ② ① ③ %s, 54, %s ④ %s ⑤ %s" % (t3, e3, a4, a5)
    if D:
        w.step("⑥ 도전하기", "조건을 바꾸어 풀기")
        w.ask("우유 1 L(=1000 mL)를 깨끗한 물로 만드는 데 필요한 물은 몇 L?")
        w.ask("우유 200 mL에는 콜라 200 mL보다 물이 몇 L 더 필요한가요?")
        w.why("콜라 200 mL보다 더 필요한 물이 30 L가 아닌 까닭을 써 보세요.", 1)
        ans += " ⑥ %d L, %d L, 왜: (예: 54−24=30은 1 mL일 때의 차라서 200 mL일 때는 200×30=6000 L예요)" % (1000 * 54, 200 * 54 - 200 * 24)
    return ans


TB_DECK = [  # 카드, 알려 주는 것, 첫째 기호, 둘째 기호, 관계, 첫째 양의 처음 수, 정답 식
    ("꽃의 수(□)와 꽃잎의 수(△)", "꽃 1송이에 꽃잎이 5장", '□', '△', lambda n: 5 * n, 1, ['△=□×5', '□=△÷5']),
    ("토끼풀의 수(□)와 잎의 수(△)", "토끼풀 1개에 잎이 3장", '□', '△', lambda n: 3 * n, 1, ['△=□×3', '□=△÷3']),
    ("의자의 수(○)와 팔걸이의 수(☆)", "의자 사이와 양 끝에 팔걸이", '○', '☆', lambda n: n + 1, 1, ['☆=○+1', '○=☆−1']),
    ("문어의 수(◇)와 문어 다리의 수(○)", "문어 1마리에 다리가 8개", '◇', '○', lambda n: 8 * n, 1, ['○=◇×8', '◇=○÷8']),
    ("세발자전거의 수(△)와 바퀴의 수(♡)", "세발자전거 1대에 바퀴가 3개", '△', '♡', lambda n: 3 * n, 1, ['♡=△×3', '△=♡÷3']),
    ("동생의 나이(□)와 언니의 나이(○)", "동생이 9살일 때 언니는 12살", '□', '○', lambda n: n + 3, 9, ['○=□+3', '□=○−3']),
]


def tb_l7(w, D):
    w.lesson(7, "발표하기(P)", "놀이를 더하다 ― 자신만만 대응 관계", "놀이 카드에서 두 양 사이의 대응 관계를 찾아 기호를 사용하여 식으로 나타낼 수 있나요?",
             "카드를 뒤집어 두 양 사이의 대응 관계를 카드에 정해진 기호로 식을 세워요.")
    w.step("① 놀이 방법 알기", "차례대로 번호 쓰기")
    s1 = seq_order(w, ORDER_SRC, ORDER_ANS)
    w.step("② 규칙 살펴보기", "토끼풀 카드와 점수")
    w.text("토끼풀 카드: 토끼풀의 수(□)와 잎의 수(△), 토끼풀 1개에 잎이 3장이에요. 맞는 식이면 ○, 아니면 ×에 표시해 보세요.")
    o2 = ["△=□×3", "□=△÷3", "△=□+3", "□=△×3"]
    env = {'□': [1, 2, 3, 4], '△': [3, 6, 9, 12]}
    good = []
    for i, e in enumerate(o2):
        try:
            eq_ok(e, env); good.append(i)
        except AssertionError:
            pass
    assert good == [0, 1]
    w.choices(OX(o2))
    w.ask("식이 맞고, 내가 카드를 뒤집었는데 주사위 눈이 4가 나왔어요. 이 카드에서 얻은 점수는 몇 점?")
    w.step("③ 놀이하기", "카드마다 정해진 기호로 식 두 가지 쓰기")
    g = game_block(w, D, TB_DECK)
    w.step("④ 또 다른 놀이", "식에 알맞은 상황 찾기")
    w.pic(group_fig('octopus', [1], lambda n: '문어 1마리에 다리 8개', None), 45, 34)
    w.pick("○=△×8에 알맞은 상황은?", ["문어의 수(△)와 문어 다리의 수(○)", "문어 다리의 수(△)와 문어의 수(○)", "나이가 8살 차이 나는 형(○)과 동생(△)"])
    w.step("⑤ 정리하기")
    a5 = write2(w, D, [("놀이에서 식을 세울 때 주의할 점은 무엇인가요?", "카드에 정해진 (          )가 어떤 양을 나타내는지 잘 살펴봐요.",
                        "카드에 정해진 기호가 어떤 양을 나타내는지 잘 살펴봐요"),
                       ("놀이 카드에 넣고 싶은 새로운 대응 관계를 써 보세요.", "(          )의 수(□)와 (          )의 수(△):  식 (                    )",
                        "거미의 수(□)와 거미 다리의 수(△): △=□×8")])
    ans = "7차시  ① %s ② %s, %d점 ③ %s ④ ① ⑤ %s" % (s1, ox_ans(4, good), dice_score(4), g, a5)
    if D:
        w.step("⑥ 도전하기", "식 ☆=◇+2에 알맞은 상황")
        o6 = ["사각형의 수(◇)와 삼각형의 수(☆) — 3차시 배열", "동생의 나이(◇)와 2살 많은 언니의 나이(☆)", "자전거의 수(◇)와 바퀴의 수(☆)", "언니의 나이(◇)와 2살 적은 동생의 나이(☆)"]
        w.choices(OX(o6))
        eqs(['☆=◇+2'], {'◇': [1, 2, 3], '☆': [3, 4, 5]})
        w.why("자전거의 수와 바퀴의 수가 알맞지 않은 까닭을 써 보세요.", 1)
        ans += " ⑥ %s, 왜: (예: 자전거 바퀴의 수는 자전거의 수의 2배라서 ☆=◇×2로 나타내요)" % ox_ans(4, [0, 1])
    return ans


def tb_l8(w, D):
    w.lesson(8, "발표하기(P)", "공부한 내용을 확인해요", "대응 관계에서 배운 내용을 잘 알고 있나요?",
             "두 양 사이의 대응 관계를 표에서 찾아 말로 설명하고, 기호를 사용한 식으로 나타내요.")
    w.step("① 1번", "선풍기의 수와 날개의 수")
    w.pic(group_fig('fan', [1, 2, 3], lambda n: '선풍기 %d대' % n, None), 150, 40)
    w.fill("선풍기 날개의 수는 선풍기의 수의 (        )배예요.")
    w.step("② 2~4번", "상자 1개에 달걀 10개")
    w.pic(group_fig('egg', [1, 2], lambda n: '상자 %d개' % n, None), 100, 32)
    xs = [1, 2, 3, 4]
    t2, ys = corr(w, ["상자의 수(개)", "달걀의 수(개)"], xs, lambda n: 10 * n, bx=(2,), by=(1, 3), D=D, more=True)
    e2 = eq_block(w, D, "상자의 수를 □, 달걀의 수를 ☆라고 할 때", None, ['☆=□×10', '□=☆÷10'], {'□': xs, '☆': ys},
                  ['☆ = □ (     ) (     )', '□ = ☆ (     ) (     )'])
    w.ask("상자 9개에 들어 있는 달걀은 모두 몇 개?")
    w.step("③ 5~7번", "육각형과 삼각형의 배열")
    w.pic(chain_fig('hextri', [1, 2, 3], lambda n: '육각형 %d개' % n, None), 165, 40)
    xs3 = [1, 2, 3, 4, 5]
    t3, ys3 = corr(w, ["육각형의 수(개)", "삼각형의 수(개)"], xs3, lambda n: n + 1, bx=(2,), by=(1, 3, 4))
    e3 = eq_block(w, D, "육각형의 수를 □, 삼각형의 수를 △라고 할 때", None, ['△=□+1', '□=△−1'], {'□': xs3, '△': ys3},
                  ['△ = □ (     ) (     )', '□ = △ (     ) (     )'])
    w.ask("삼각형이 28개일 때 육각형은 몇 개?")
    w.step("④ 8번", "식 ○=△×4에 알맞은 상황")
    w.choices(OX(["고양이의 수(△)와 고양이 다리의 수(○)", "네발자전거의 수(△)와 바퀴의 수(○)", "사각형의 수(△)와 사각형 꼭짓점의 수(○)",
                  "고양이 다리의 수(△)와 고양이의 수(○)", "세발자전거의 수(△)와 바퀴의 수(○)"]))
    w.step("⑤ 확인하고 정리해요", "기린과 다리, 기둥과 줄")
    w.fill(["기린 다리의 수는 기린의 수의 (     )배예요. → (기린 다리의 수)=(기린의 수)×(     )",
            "기린의 수는 기린 다리의 수를 4로 나눈 것과 같아요. → (기린의 수)=(기린 다리의 수)÷4",
            "기둥의 수는 줄의 수에 1을 더한 것과 같아요. → (기둥의 수)=(줄의 수)+1",
            "줄의 수는 기둥의 수에서 (     )을 뺀 것과 같아요. → (줄의 수)=(기둥의 수)−(     )"])
    ans = ("8차시  ① 5 ② %s, %s, %d개 ③ %s, %s, %d개 ④ %s ⑤ 4, 4, 1, 1"
           % (t2, e2, 10 * 9, t3, e3, 28 - 1, ox_ans(5, [0, 1, 2])))
    if D:
        w.step("⑥ 도전하기", "두 양과 식 잇기 (앞의 양이 □, 뒤의 양이 △)")
        left = ["풍력 발전기의 수와 날개의 수", "그늘막의 수와 기둥의 수", "의자의 수와 태양열 충전기의 수", "솜사탕의 수와 페달을 밟는 시간(분)"]
        right = ["△=□+1", "△=□×4", "△=□×3", "△=□−1"]
        pairs = [2, 0, 3, 1]
        fs = [lambda n: 3 * n, lambda n: n + 1, lambda n: n - 1, lambda n: 4 * n]
        for i, fn in enumerate(fs):
            xs6 = [2, 3, 4, 5]
            eq_ok(right[pairs[i]], {'□': xs6, '△': [fn(x) for x in xs6]})
        lk = link_block(w, left, right, pairs, "두 양", "식")
        w.why("곱의 관계와 합(차)의 관계는 각각 어떤 식으로 나타내는지 써 보세요.", 1)
        ans += " ⑥ %s, 왜: (예: 곱의 관계는 곱셈식·나눗셈식으로, 합(차)의 관계는 덧셈식·뺄셈식으로 나타내요)" % lk
    return ans


# ================================================================ 이야기 버전
ST_SCENE = ("햇살초등학교 5학년 2반 환경 동아리 ‘초록 탐사대’가 한 학기 동안 재활용과 에너지 절약 캠페인을 펼쳐요. "
            "동아리장 윤서, 기록 담당 태오, 그림 담당 하린, 계산 담당 준서, 질문 대장 민아가 함께해요.")


def st_l1(w, D):
    w.lesson(1, "개념 찾기(S)", "초록 탐사대, 캠페인을 시작해요", "우리 동아리 캠페인 속에서 한 양이 변할 때 함께 변하는 다른 양에는 무엇이 있을까요?", ST_SCENE)
    w.step("① 만져 보기 — 보기·생각하기·궁금해하기", "동아리장 윤서가 붙인 캠페인 게시판")
    w.pic(board_fig(), 160, 62)
    if D:
        w.labeled([("보여요", "\n"), ("생각해요", "\n"), ("궁금해요", "\n")], row_h=5000)
    else:
        w.labeled([("보여요", "게시판에서 (                              )이 보여요.\n"),
                   ("생각해요", "(                    )이 늘어나면 (                    )도 늘어날 것 같아요.\n"),
                   ("궁금해요", "(                    )일 때 (                    )은 몇 개일까?\n")], row_h=5000)
    w.step("② 그려 보기 — 함께 늘어나는 두 양", "페트병 4개씩 한 묶음")
    w.pic(group_fig('pack', [1, 2, 3], lambda n: '페트병 %d묶음' % n, None), 165, 40)
    t2, _ = corr(w, ["페트병 묶음의 수(묶음)", "페트병의 수(개)"], [1, 2, 3], lambda n: 4 * n, by=(1, 2))
    w.step("③ 말해 보기 — 함께 변하는 짝 찾기")
    w.text("한 양이 변할 때 다른 양도 함께 변하는 두 양이면 ○, 아니면 ×에 표시해 보세요.")
    w.choices(OX(["캔을 모은 날수와 모은 캔의 수(하루에 6개씩)", "모둠의 수와 모둠 친구의 수(한 모둠 5명)", "울타리 판의 수와 필요한 말뚝의 수", "동아리 이름과 윤서의 키"]))
    a3 = why1(w, D, "왜 그럴까요? 캔을 모은 날수와 모은 캔의 수가 함께 변한다고 할 수 있는 까닭을 써 볼까요?",
              "하루에 캔을 (     )개씩 모으므로 날수가 1일 늘어날 때마다 캔은 (     )개씩 늘어나요.",
              "하루에 캔을 6개씩 모으므로 날수가 1일 늘어날 때마다 캔은 6개씩 늘어나요")
    w.step("④ 약속하기 — 무엇을 배울까요", "배우는 순서대로 번호 쓰기")
    s4 = seq_order(w, ["대응 관계를 □, △ 같은 기호를 사용하여 식으로 나타내기", "두 양 사이의 관계 알아보기", "대응 관계를 이용하여 문제 해결하기",
                       "학교와 생활 속에서 대응 관계를 찾아 식으로 나타내기"], [1, 0, 3, 2])
    w.step("⑤ 확인하기 — 4학년 때 배운 규칙")
    seq = [5 * 2 ** i for i in range(5)]
    sq = [2 + 3 * i for i in range(5)]
    w.ask("수의 배열 5, 10, 20, 40, □에서 □에 알맞은 수는?")
    w.ask("사각형이 2개, 5개, 8개, 11개로 놓인 도형의 배열에서 다섯째에 놓일 사각형은 몇 개?")
    ans = ("1차시  ① (예: 페트병 4개가 한 묶음으로 묶여 있어요 / 묶음이 늘어나면 페트병도 늘어날 것 같아요 / 캔을 30일 동안 모으면 몇 개일까?) "
           "② %s ③ %s, %s ④ %s ⑤ %d, %d개" % (t2, ox_ans(4, [0, 1, 2]), a3, s4, seq[4], sq[4]))
    if D:
        w.step("⑥ 도전하기", "동아리방 전등과 모둠")
        w.text("동아리방 전등은 1줄에 형광등이 3개씩 있어요. 또, 한 모둠은 5명이에요.")
        w.ask("전등이 4줄이면 형광등은 몇 개?")
        w.ask("전등이 10줄이면 형광등은 몇 개?")
        w.ask("모둠이 6개이면 모둠 친구는 모두 몇 명?")
        w.why("전등이 10줄일 때 형광등이 13개가 아닌 까닭을 써 보세요.", 1)
        ans += " ⑥ %d개, %d개, %d명, 왜: (예: 10+3이 아니라 형광등 3개씩 10줄이에요)" % (3 * 4, 3 * 10, 5 * 6)
    return ans


def st_l2(w, D):
    w.lesson(2, "개념 구축하기(O)", "페트병 묶음과 캔 모으기 ― 두 양 사이의 관계 ⑴", "한 양이 변할 때 다른 양은 어떻게 함께 변할까요?",
             "재활용 날, 태오가 페트병을 4개씩 한 묶음으로 묶어요. 준서는 날마다 캔을 6개씩 모아 상자에 담아요.")
    w.step("① 만져 보기 — 페트병 묶음 세기", "먼저 예상해요")
    a0 = why1(w, D, "페트병 묶음이 늘어나면 페트병의 수는 어떻게 될지 예상해 봐요.",
              "내 예상: 묶음이 1묶음씩 늘어나면 페트병은 (                              )",
              "페트병 묶음이 1묶음씩 늘어날 때마다 페트병은 4개씩 늘어나요")
    w.pic(group_fig('pack', [1, 2, 3], lambda n: '페트병 %d묶음' % n, None), 165, 40)
    t1, _ = corr(w, ["페트병 묶음의 수(묶음)", "페트병의 수(개)"], [1, 2, 3, 4], lambda n: 4 * n, by=(1, 2, 3))
    w.fill("페트병 묶음이 1묶음씩 늘어날 때마다 페트병은 (        )개씩 늘어나요.")
    w.step("② 그려 보기 — 캔 모으기 달력")
    w.pic(group_fig('canday', [1, 2, 3], lambda n: '%d일 동안' % n, None), 165, 42)
    t2, _ = corr(w, ["캔을 모은 날수(일)", "모은 캔의 수(개)"], [1, 2, 3, 4], lambda n: 6 * n, by=(1, 2, 3), D=D, more=True)
    w.ask("5일 동안 모으면 캔은 몇 개?")
    w.step("③ 말해 보기 — 두 양을 함께 말하기")
    w.fill(["모은 캔의 수는 모은 날수의 (        )배예요.", "모은 날수는 모은 캔의 수를 (        )으로 나눈 것과 같아요."])
    w.pick("두 양을 함께 관련지어 말한 것은 어느 것인가요?", ["캔은 6개씩 늘어나요.", "모은 캔의 수는 모은 날수의 6배예요.", "날수는 하루씩 늘어나요."])
    a3 = why1(w, D, "왜 그럴까요? ‘캔은 6개씩 늘어나요’라고만 말하면 부족한 까닭은 무엇일까요?",
              "이 말에는 (                ) 한 양만 들어 있어서 (                )와 함께 말해야 해요.",
              "캔의 수 한 양만 말했기 때문이에요. 모은 날수와 함께 두 양을 관련지어 말해야 해요")
    w.step("④ 약속하기 — 대응과 대응 관계")
    if not D:
        w.wordbox(["대응한다", "비교한다", "어림한다", "대응 관계", "크기 관계", "순서 관계"])
    w.fill(["페트병 묶음의 수와 페트병의 수와 같이 두 양이 짝을 이루는 것을 (              )고 하고,",
            "한 양이 변함에 따라 다른 양이 변할 때 두 양 사이의 관계를 (              )라고 합니다."])
    w.step("⑤ 확인하기 — 모둠과 친구 수")
    lk = link_block(w, ["모둠의 수(한 모둠 5명)", "페트병 묶음의 수", "캔을 모은 날수"], ["모은 캔의 수", "모둠 친구의 수", "페트병의 수"], [1, 2, 0], "한 양", "짝을 이루는 양")
    w.pic(group_fig('team', [1, 2, 3], lambda n: '모둠 %d개' % n, None), 150, 40)
    w.fill(["모둠 친구의 수는 모둠의 수의 (        )배예요.", "모둠의 수는 모둠 친구의 수를 (        )로 나눈 것과 같아요."])
    ans = ("2차시  ① %s, %s, 4 ② %s, %d개 ③ 6, 6, ②, %s ④ 대응한다, 대응 관계 ⑤ %s, 5, 5" % (a0, t1, t2, 6 * 5, a3, lk))
    if D:
        w.step("⑥ 도전하기", "화분과 상추 모종")
        w.text("하린이가 동아리 텃밭의 화분 1개에 상추 모종을 3포기씩 심어요.")
        t6, _ = corr(w, ["화분의 수(개)", "상추 모종의 수(포기)"], [1, 2, 3, 4], lambda n: 3 * n, by=(1, 2, 3))
        w.fill("상추 모종의 수는 화분의 수의 (     )배이고, 화분의 수는 상추 모종의 수를 (     )으로 나눈 것과 같아요.")
        w.ask("화분이 12개이면 상추 모종은 몇 포기?")
        w.ask("상추 모종 45포기를 모두 심으려면 화분은 몇 개?")
        w.why("모종 45포기에 필요한 화분의 수를 구할 때 나눗셈을 하는 까닭을 써 보세요.", 1)
        ans += " ⑥ %s, 3, 3, %d포기, %d개, 왜: (예: 화분의 수는 상추 모종의 수를 3으로 나눈 것과 같아요)" % (t6, 3 * 12, 45 // 3)
    return ans


def st_l3(w, D):
    w.lesson(3, "개념 구축하기(O)", "꽃밭 울타리와 분리수거함 ― 두 양 사이의 관계 ⑵", "더하거나 빼는 관계인 두 양 사이의 대응 관계는 어떻게 말할까요?",
             "초록 탐사대가 학교 꽃밭에 울타리를 세워요. 울타리 판을 한 줄로 잇고, 판 사이와 양 끝에 말뚝을 박아요.")
    w.step("① 만져 보기 — 꽃밭 울타리 세우기", "먼저 예상해요")
    a0 = why1(w, D, "울타리 판이 늘어날 때 말뚝의 수는 어떻게 될지 예상해 봐요.",
              "내 예상: 판이 1개씩 늘어나면 말뚝은 (     )개씩 늘어나고, 말뚝은 판보다 (     )개 더 많아요.",
              "울타리 판이 1개씩 늘어날 때마다 말뚝도 1개씩 늘어나요. 말뚝의 수는 울타리 판의 수보다 1개 더 많아요")
    w.pic(chain_fig('fence', [1, 2, 3], lambda n: '울타리 판 %d개' % n, None), 165, 40)
    t1, _ = corr(w, ["울타리 판의 수(개)", "말뚝의 수(개)"], [1, 2, 3, 4], lambda n: n + 1, by=(1, 2, 3))
    w.ask("울타리 판이 6개일 때 말뚝은 몇 개?")
    w.step("② 그려 보기 — 1 차이를 바르게 말하기", "민아: “말뚝과 판은 1 차이가 나!”")
    w.fill(["말뚝의 수는 울타리 판의 수보다 (     )개 더 ( 적어요 / 많아요 ).", "울타리 판의 수는 말뚝의 수보다 (     )개 더 ( 적어요 / 많아요 )."])
    w.text("울타리 판의 수와 말뚝의 수 사이의 대응 관계를 바르게 말한 것이면 ○, 아니면 ×에 표시해 보세요.")
    w.choices(OX(["말뚝의 수는 울타리 판의 수에 1을 더한 것과 같아요.", "울타리 판의 수는 말뚝의 수에서 1을 뺀 것과 같아요.",
                  "말뚝의 수는 울타리 판의 수의 2배예요.", "말뚝은 1개씩 늘어나요."]))
    a2 = why1(w, D, "왜 그럴까요? ‘말뚝의 수는 울타리 판의 수의 2배예요’라고 하면 안 되는 까닭은 무엇일까요?",
              "판이 1개일 때는 맞지만, 판이 2개일 때 말뚝은 (     )개가 아니라 (     )개예요.",
              "판이 1개일 때는 말뚝이 2개라서 맞지만, 판이 2개일 때 말뚝은 4개가 아니라 3개예요")
    w.step("③ 말해 보기 — 분리수거함 칸막이", "수거함과 수거함 사이에만 칸막이")
    w.pic(chain_fig('bins', [1, 2, 3, 4], lambda n: '수거함 %d개' % n, None), 165, 40)
    t3, _ = corr(w, ["분리수거함의 수(개)", "칸막이의 수(개)"], [1, 2, 3, 4], lambda n: n - 1, by=(1, 2, 3), D=D, more=True)
    w.fill(["칸막이의 수는 분리수거함의 수에서 (     )을 뺀 것과 같아요.", "분리수거함의 수는 칸막이의 수에 (     )을 더한 것과 같아요."])
    w.ask("분리수거함이 9개일 때 칸막이는 몇 개?")
    w.step("④ 약속하기 — 곱의 관계와 합(차)의 관계")
    lk = link_block(w, ["페트병 묶음의 수와 페트병의 수", "울타리 판의 수와 말뚝의 수", "캔을 모은 날수와 모은 캔의 수", "분리수거함의 수와 칸막이의 수"],
                    ["칸막이의 수는 분리수거함의 수에서 1을 뺀 것", "페트병의 수는 묶음의 수의 4배", "말뚝의 수는 울타리 판의 수에 1을 더한 것",
                     "모은 캔의 수는 모은 날수의 6배"], [1, 2, 3, 0], "두 양", "대응 관계")
    w.pick("어느 말이 맞나요?", ["몇 배인 관계만 대응 관계예요.", "몇 배인 관계도, 더하거나 빼는 관계도 모두 대응 관계예요."])
    w.step("⑤ 확인하기 — 동아리 게시판 테두리", "사각형과 삼각형 색종이")
    w.pic(chain_fig('sqtri', [1, 2, 3], lambda n: '사각형 %d개' % n, None), 160, 40)
    t5, _ = corr(w, ["사각형의 수(개)", "삼각형의 수(개)"], [1, 2, 3, 4], lambda n: n + 2, by=(1, 2, 3))
    w.fill(["삼각형의 수는 사각형의 수에 (     )를 더한 것과 같아요.", "사각형의 수는 삼각형의 수에서 (     )를 뺀 것과 같아요."])
    w.choices([("서로 대응하는 두 양은?", "( 사각형의 수와 삼각형의 수 / 사각형의 색깔과 삼각형의 색깔 / 게시판의 이름과 색종이의 크기 )")])
    ans = ("3차시  ① %s, %s, %d개 ② 1, 많아요, 1, 적어요, %s, %s ③ %s, 1, 1, %d개 ④ %s, ② ⑤ %s, 2, 2, 사각형의 수와 삼각형의 수"
           % (a0, t1, 6 + 1, ox_ans(4, [0, 1]), a2, t3, 9 - 1, lk, t5))
    if D:
        w.step("⑥ 도전하기", "윤서와 언니의 나이")
        w.text("매년 3월 1일에 윤서와 언니의 나이를 적었어요. 윤서가 11살일 때 언니는 15살이에요.")
        t6, _ = corr(w, ["윤서의 나이(살)", "언니의 나이(살)"], [11, 12, 13, 14], lambda n: n + 4, by=(1, 2, 3))
        w.ask("윤서가 20살인 해에 언니는 몇 살?")
        w.ask("언니가 30살인 해에 윤서는 몇 살?")
        w.why("언니가 30살일 때 윤서의 나이를 구할 때 뺄셈을 하는 까닭을 써 보세요.", 1)
        ans += " ⑥ %s, %d살, %d살, 왜: (예: 윤서의 나이는 언니의 나이에서 4를 뺀 것과 같아요)" % (t6, 20 + 4, 30 - 4)
    return ans


def st_l4(w, D):
    w.lesson(4, "개념 구축하기(O)", "손 발전기 손전등 ― 대응 관계를 식으로 나타내기", "두 양 사이의 대응 관계를 기호를 사용하여 식으로 어떻게 나타낼까요?",
             "에너지 절약 체험 날, 준서가 손 발전기 손전등을 가져왔어요. 손잡이를 1분 돌리면 불이 5분 동안 켜진대요.")
    xs = [1, 2, 3, 4, 5]
    w.step("① 만져 보기 — 돌린 시간과 켜지는 시간")
    w.pic(crank_fig(), 120, 38)
    t1, ys = corr(w, ["손잡이를 돌린 시간(분)", "불이 켜지는 시간(분)"], xs, lambda n: 5 * n, bx=(3,), by=(1, 2, 4))
    w.fill(["손잡이를 돌린 시간이 1분씩 늘어날 때마다 불이 켜지는 시간은 (     )분씩 늘어나요.", "불이 켜지는 시간은 손잡이를 돌린 시간의 (     )배예요."])
    w.step("② 그려 보기 — 보기 카드로 식 만들기")
    w.wordbox(["=", "1", "5", "+", "−", "×", "÷", "돌린 시간", "켜지는 시간"])
    eqs(['B=A×5', 'A=B÷5'], {'A': xs, 'B': ys})
    if D:
        w.fill(["곱셈식:  (                                                        )", "나눗셈식:  (                                                        )"])
    else:
        w.fill(["(켜지는 시간) = (돌린 시간) (     ) (     )", "(돌린 시간) = (켜지는 시간) (     ) (     )"])
    w.step("③ 말해 보기 — 울타리를 낱말 식으로", "3차시의 꽃밭 울타리")
    w.wordbox(["=", "1", "2", "+", "−", "×", "÷", "울타리 판의 수", "말뚝의 수"])
    ys3 = [n + 1 for n in xs]
    eqs(['B=A+1', 'A=B−1'], {'A': xs, 'B': ys3})
    if D:
        w.fill(["덧셈식:  (                                                        )", "뺄셈식:  (                                                        )"])
    else:
        w.fill(["(말뚝의 수) = (울타리 판의 수) (     ) (     )", "(울타리 판의 수) = (말뚝의 수) (     ) (     )"])
    a3 = why1(w, D, "왜 그럴까요? 덧셈식과 뺄셈식이 둘 다 맞는 까닭은 무엇일까요?",
              "말뚝의 수를 구할 때는 판의 수에 1을 (       ), 판의 수를 구할 때는 말뚝의 수에서 1을 (       ). 기준이 달라요.",
              "무엇을 기준으로 하느냐에 따라 달라요. 말뚝의 수를 구할 때는 판의 수에 1을 더하고, 판의 수를 구할 때는 말뚝의 수에서 1을 빼요")
    w.step("④ 약속하기 — 기호로 간단하게")
    w.fill("각 양을 □, △, ○, ☆과 같은 기호로 나타내면 두 양 사이의 대응 관계를 식으로 간단하게 나타낼 수 있어요.")
    e4 = eq_block(w, D, "울타리 판의 수를 □, 말뚝의 수를 △라고 할 때 덧셈식과 뺄셈식으로 나타내 보세요.", None, ['△=□+1', '□=△−1'],
                  {'□': xs, '△': ys3}, ['△ = □ (     ) (     )', '□ = △ (     ) (     )'])
    w.step("⑤ 확인하기 — 캔의 무게", "빈 캔 1개의 무게는 15 g")
    w.pic(ball_fig('빈 캔 1개의 무게는 15 g', '15 g', 'can'), 100, 40)
    t5, ys5 = corr(w, ["캔의 수(개)", "캔의 무게(g)"], xs, lambda n: 15 * n, bx=(2, 4), by=(1, 3, 4))
    e5 = eq_block(w, D, "캔의 수를 ☆, 캔의 무게를 ○라고 할 때 식으로 나타내 보세요.", None, ['○=☆×15', '☆=○÷15'],
                  {'☆': xs, '○': ys5}, ['○ = ☆ (     ) (     )', '☆ = ○ (     ) (     )'])
    w.ask("빈 캔 40개의 무게는 몇 g?")
    ans = ("4차시  ① %s, 5, 5 ② (켜지는 시간)=(돌린 시간)×5, (돌린 시간)=(켜지는 시간)÷5 ③ (말뚝의 수)=(울타리 판의 수)+1, "
           "(울타리 판의 수)=(말뚝의 수)−1, %s ④ %s ⑤ %s, %s, %d g" % (t1, a3, e4, t5, e5, 40 * 15))
    if D:
        w.step("⑥ 도전하기", "병뚜껑 화분과 윤서의 나이")
        w.text("화분 1개에 병뚜껑을 8개씩 붙여요.")
        w.pick("화분의 수와 병뚜껑의 수 사이의 대응 관계를 잘못 설명한 사람은?",
               ["태오: 화분의 수를 ◇, 병뚜껑의 수를 ♡라고 하면 ♡=◇×8이에요.", "민아: ○=☆÷8에서 ☆는 화분의 수, ○는 병뚜껑의 수예요."])
        eqs(['♡=◇×8'], {'◇': [1, 2, 3], '♡': [8, 16, 24]})
        e6 = eq_block(w, D, "매년 1월 1일의 연도를 △, 윤서의 나이를 ☆라고 할 때 (2026년에 11살)", None, ['☆=△−2015', '△=☆+2015'],
                      {'△': [2026, 2027, 2028, 2029], '☆': [11, 12, 13, 14]}, [])
        w.why("민아의 설명이 틀린 까닭을 써 보세요.", 1)
        ans += " ⑥ ②(민아), %s, 왜: (예: ○=☆÷8이면 ☆가 병뚜껑의 수, ○가 화분의 수여야 해요. 기호가 나타내는 양을 바꾸어 말했어요)" % e6
    return ans


def st_l5(w, D):
    w.lesson(5, "개념 구축하기(O)", "학교 곳곳에서 찾은 대응 관계", "학교와 생활 속에서 서로 대응하는 두 양을 찾아 식으로 어떻게 나타낼까요?",
             ["교실 전등은 1줄에 형광등이 3개, 창문 1개에 유리가 2장, 급식 우유 상자 1개에 우유가 10팩 들어 있어요.",
              "수돗가 꼭지를 1분 틀면 물이 6 L 나온다고 해요(탐사대가 정한 양)."])
    w.step("① 만져 보기 — 학교 탐사", "서로 대응하는 두 양 찾기")
    if D:
        w.labeled([(a, '\n') for a in ("교실 전등", "창문", "우유 상자", "수돗가")], row_h=3400)
    else:
        w.labeled([("교실 전등", "전등 줄의 수와 (                    )의 수"), ("창문", "창문의 수와 (                    )의 수"),
                   ("우유 상자", "우유 상자의 수와 (                    )의 수"), ("수돗가", "물을 튼 시간과 (                    )")], row_h=3400)
    xs4 = [1, 2, 3, 4]
    w.step("② 그려 보기 — 교실 전등")
    w.pic(group_fig('lamp', [1, 2, 3], lambda n: '전등 %d줄' % n, None), 150, 40)
    t2, ys2 = corr(w, ["전등 줄의 수(줄) ◇", "형광등의 수(개) ♡"], xs4, lambda n: 3 * n, bx=(3,), by=(1, 2))
    e2 = eq_block(w, D, None, None, ['♡=◇×3', '◇=♡÷3'], {'◇': xs4, '♡': ys2}, ['♡ = ◇ (     ) (     )', '◇ = ♡ (     ) (     )'])
    w.step("③ 말해 보기 — 내가 고른 기호로")
    t3a, ys3 = corr(w, ["물을 튼 시간(분)", "쓴 물의 양(L)"], xs4, lambda n: 6 * n, by=(1, 2, 3) if D else ())
    eqs(['☆=□×6'], {'□': xs4, '☆': ys3})
    w.fill("(     )를 물을 튼 시간, (     )를 쓴 물의 양이라고 하면   식: (                              )")
    w.pic(chain_fig('bins', [3], lambda n: '분리수거함 %d개, 칸막이 %d개' % (n, n - 1), None), 75, 34)
    xs5 = [1, 2, 3, 4, 5]
    t3b, ys3b = corr(w, ["분리수거함의 수(개)", "칸막이의 수(개)"], xs5, lambda n: n - 1, by=(1, 2, 3, 4) if D else ())
    eqs(['△=□−1'], {'□': xs5, '△': ys3b})
    w.fill("(     )를 분리수거함의 수, (     )를 칸막이의 수라고 하면   식: (                              )")
    w.step("④ 약속하기 — 친구의 식과 견주기")
    w.fill("같은 대응 관계라도 어떤 기호를 쓰는지, 무엇을 기준으로 하는지에 따라 식이 달라질 수 있어요.")
    eqs(['☆=□×6', '♡=◇×6'], {'□': xs4, '◇': xs4, '☆': ys3, '♡': ys3})
    eqs(['□=☆÷6'], {'□': xs4, '☆': ys3})
    w.pick("태오는 ☆=□×6, 하린이는 ♡=◇×6으로 나타냈어요. (□, ◇는 물을 튼 시간, ☆, ♡는 쓴 물의 양) 어떻게 생각하나요?",
           ["두 식 모두 맞아요. 기호만 다르게 하여 같은 대응 관계를 나타냈어요.", "□와 △만 쓸 수 있으니 하린이의 식은 틀렸어요.", "두 식 모두 틀렸어요."])
    w.pick("준서는 같은 관계를 □=☆÷6으로 나타냈어요. (□는 물을 튼 시간, ☆는 쓴 물의 양) 어떻게 생각하나요?",
           ["맞아요. 쓴 물의 양을 기준으로 하여 나눗셈식으로 나타냈어요.", "틀렸어요. 곱셈식으로만 나타낼 수 있어요."])
    e4 = eq_block(w, D, "우유 상자의 수를 □, 우유의 수를 ○라고 할 때 (상자 1개에 우유 10팩)", None, ['○=□×10', '□=○÷10'],
                  {'□': xs4, '○': [10 * n for n in xs4]}, ['○ = □ (     ) (     )', '□ = ○ (     ) (     )'])
    w.step("⑤ 확인하기 — 우리 주변 대응 관계", "급식실 의자 1개에 다리 4개")
    eqs(['○=□×4'], {'□': xs4, '○': [4 * n for n in xs4]})
    w.fill("(     )를 의자의 수, (     )를 의자 다리의 수라고 하면   식: (                              )")
    a5 = write2(w, D, [("우리 집이나 학교에서 찾은 대응 관계를 두 양, 관계, 기호 식으로 써 보세요.",
                        "두 양: (              )의 수(□)와 (              )의 수(△) / 관계: (                    ) / 식: (              )",
                        "횡단보도의 흰 줄의 수(□)와 그 사이 검은 줄의 수(△): 흰 줄 사이에만 검은 줄이 있으므로 △=□−1")])
    ans = ("5차시  ① 형광등, 유리, 우유, 쓴 물의 양 ② %s, %s ③ %s예) □, ☆, ☆=□×6 / %s예) □, △, △=□−1 ④ ①, ①, %s ⑤ 예) □, ○, ○=□×4, %s"
           % (t2, e2, (t3a + ', ') if t3a else '', (t3b + ', ') if t3b else '', e4, a5))
    if D:
        w.step("⑥ 도전하기", "우유 상자와 수돗가")
        e6 = eq_block(w, D, "물을 튼 시간(분)을 ◇, 쓴 물의 양(L)을 ○라고 할 때", None, ['○=◇×6', '◇=○÷6'], {'◇': xs4, '○': ys3}, [])
        w.ask("우유 140팩을 담으려면 우유 상자는 몇 개?")
        w.ask("양치하는 3분 동안 물을 틀어 두면 물은 몇 L 쓰일까요?")
        w.why("양치할 때 컵을 쓰면 좋은 까닭을 대응 관계로 설명해 보세요.", 1)
        ans += " ⑥ %s, %d개, %d L, 왜: (예: ○=◇×6이라 물을 1분 틀 때마다 6 L씩 쓰이므로 컵을 쓰면 물을 아낄 수 있어요)" % (e6, 140 // 10, 6 * 3)
    return ans


def st_l6(w, D):
    w.lesson(6, "개념 구축하기(O)", "남긴 음식이 물을 더럽혀요 ― 대응 관계로 문제 해결하기",
             "대응 관계를 이용하여 남긴 음식을 깨끗한 물로 만드는 데 필요한 물의 양을 어떻게 구할까요?",
             "초록 탐사대가 ‘급식 남기지 않기’ 캠페인을 준비해요. “우리 모둠이 오늘 남긴 우유 150 mL를 깨끗한 물로 만드는 데 필요한 물은 몇 L일까?”")
    w.step("① 만져 보기 — 문제 이해하기", "태오가 조사한 표")
    water_table(w)
    w.pick("구하려는 것은 무엇인가요?", ["남긴 우유 150 mL를 깨끗한 물로 만드는 데 필요한 물의 양", "우유 1 mL를 깨끗한 물로 만드는 데 필요한 물의 양", "남긴 우유 150 mL의 무게"])
    w.ask("우유 1 mL를 깨끗한 물로 만드는 데 필요한 물은 몇 L?")
    w.step("② 그려 보기 — 해결 계획 세우기")
    w.pick("어떤 방법으로 해결하면 좋을까요?", ["우유가 1 mL씩 늘어날 때마다 필요한 물이 몇 L씩 늘어나는지 표로 알아보고, 대응 관계를 식으로 나타내요.",
                                     "우유 150 mL와 54 L를 더해요.", "우유가 150 mL이니 물도 150 L가 필요하다고 생각해요."])
    w.step("③ 말해 보기 — 표와 식으로 나타내기")
    xs = [1, 2, 3, 4]
    t3, ys = corr(w, ["우유의 양(mL) □", "필요한 물의 양(L) △"], xs, lambda n: 54 * n, by=(1, 2, 3))
    w.fill("필요한 물의 양(L)은 우유의 양(mL)의 (        )배예요.")
    e3 = eq_block(w, D, None, None, ['△=□×54', '□=△÷54'], {'□': xs, '△': ys}, ['△ = □ (     ) (     )', '□ = △ (     ) (     )'])
    w.step("④ 약속하기 — 어림하고 식으로 구하기")
    real = 150 * 54
    opts = [200, 8000, 80000]
    near = min(range(3), key=lambda i: abs(opts[i] - real))
    assert near == 1 and 100 * 54 < real < 200 * 54
    w.choices([("남긴 우유 150 mL에 필요한 물은 어느 정도일까요? (어림)", "( 약 200 L / 약 8000 L / 약 80000 L )")])
    w.ask("△=□×54에 □=150을 넣어 실제로 계산해 보세요. 필요한 물은 몇 L?")
    w.step("⑤ 확인하기 — 다른 음식물도 구하고 되돌아보기")
    qs = [("콜라", 250), ("식용유", 20), ("라면 국물", 400)]
    for food, ml in qs:
        w.ask("%s %d mL를 깨끗한 물로 만드는 데 필요한 물은 몇 L?" % (food, ml))
    a5q = ', '.join('%d L' % (ml * WV[food]) for food, ml in qs)
    a5 = write2(w, D, [("문제를 해결한 방법을 설명해 보세요.", "표에서 (     )배인 관계를 찾아 △=□×(     )로 나타내고, □에 (     )을 넣어 (          ) L를 구했어요.",
                        "표에서 필요한 물의 양이 우유의 양의 54배인 관계를 찾아 △=□×54로 나타내고, □에 150을 넣어 8100 L를 구했어요"),
                       ("물을 지키기 위해 우리 동아리가 할 수 있는 일을 써 보세요.", "(                              )하면 물을 아낄 수 있으니 (                    )하겠어요.",
                        "급식을 먹을 만큼만 받아 남기지 않겠어요")])
    ans = "6차시  ① ①, 54 L ② ① ③ %s, 54, %s ④ 약 8000 L, %d L ⑤ %s, %s" % (t3, e3, real, a5q, a5)
    if D:
        w.step("⑥ 도전하기", "조건을 바꾸어 풀기")
        w.ask("우유 1 L(=1000 mL)를 깨끗한 물로 만드는 데 필요한 물은 몇 L?")
        w.ask("남긴 우유 150 mL에는 콜라 250 mL보다 물이 몇 L 더 필요한가요?")
        w.why("두 양의 차를 구할 때 54−24=30을 쓰면 안 되는 까닭을 써 보세요.", 1)
        ans += " ⑥ %d L, %d L, 왜: (예: 54−24는 1 mL일 때의 차이고, 우유와 콜라의 양이 달라서 각각 구해 빼야 해요)" % (1000 * 54, 150 * 54 - 250 * 24)
    return ans


def st_l7(w, D):
    w.lesson(7, "탐구 정리하기(O)", "탐사 노트 정리하기", "지금까지 찾은 대응 관계를 표와 기호 식으로 정리할 수 있나요?",
             "기록 담당 태오의 탐사 노트를 함께 정리해요.")
    w.step("① 만져 보기 — 탐사 노트 ① 교실 전등")
    w.pic(group_fig('lamp', [1, 2, 3], lambda n: '전등 %d줄' % n, None), 150, 40)
    w.fill(["형광등의 수는 전등 줄의 수의 (        )배예요.", "전등 줄의 수는 형광등의 수를 (        )으로 나눈 것과 같아요."])
    w.step("② 그려 보기 — 탐사 노트 ② 우유 상자", "상자 1개에 우유 10팩")
    w.pic(group_fig('milk', [1, 2], lambda n: '상자 %d개' % n, None), 100, 32)
    xs = [1, 2, 3, 4]
    t2, ys = corr(w, ["우유 상자의 수(개)", "우유의 수(팩)"], xs, lambda n: 10 * n, bx=(2,), by=(1, 3), D=D, more=True)
    e2 = eq_block(w, D, "상자의 수를 □, 우유의 수를 ☆라고 할 때", None, ['☆=□×10', '□=☆÷10'], {'□': xs, '☆': ys},
                  ['☆ = □ (     ) (     )', '□ = ☆ (     ) (     )'])
    w.ask("우유 상자 8개에 들어 있는 우유는 모두 몇 팩?")
    w.step("③ 말해 보기 — 탐사 노트 ③ 병뚜껑 아트", "육각형 사이와 양 끝에 삼각형")
    w.pic(chain_fig('hextri', [1, 2, 3], lambda n: '육각형 %d개' % n, None), 165, 40)
    xs3 = [1, 2, 3, 4, 5]
    t3, ys3 = corr(w, ["육각형의 수(개)", "삼각형의 수(개)"], xs3, lambda n: n + 1, bx=(2,), by=(1, 3, 4))
    e3 = eq_block(w, D, "육각형의 수를 □, 삼각형의 수를 △라고 할 때", None, ['△=□+1', '□=△−1'], {'□': xs3, '△': ys3},
                  ['△ = □ (     ) (     )', '□ = △ (     ) (     )'])
    w.ask("삼각형이 35개일 때 육각형은 몇 개?")
    w.step("④ 약속하기 — 탐사 노트 정리")
    w.fill(["모둠 친구의 수는 모둠의 수의 (     )배예요. → (모둠 친구의 수)=(모둠의 수)×(     )",
            "모둠의 수는 모둠 친구의 수를 5로 나눈 것과 같아요. → (모둠의 수)=(모둠 친구의 수)÷5",
            "말뚝의 수는 울타리 판의 수에 1을 더한 것과 같아요. → (말뚝의 수)=(울타리 판의 수)+1",
            "울타리 판의 수는 말뚝의 수에서 (     )을 뺀 것과 같아요. → (울타리 판의 수)=(말뚝의 수)−(     )"])
    w.step("⑤ 확인하기 — 식에 맞는 상황", "식 ○=△×6")
    w.choices(OX(["캔을 모은 날수(△)와 모은 캔의 수(○) — 하루 6개씩", "곤충의 수(△)와 곤충 다리의 수(○)", "모은 캔의 수(△)와 캔을 모은 날수(○) — 하루 6개씩",
                  "의자의 수(△)와 의자 다리의 수(○) — 의자 1개에 다리 4개", "육각형의 수(△)와 육각형 변의 수(○)"]))
    ans = ("7차시  ① 3, 3 ② %s, %s, %d팩 ③ %s, %s, %d개 ④ 5, 5, 1, 1 ⑤ %s"
           % (t2, e2, 10 * 8, t3, e3, 35 - 1, ox_ans(5, [0, 1, 4])))
    if D:
        w.step("⑥ 도전하기", "두 양과 식 잇기 (앞의 양이 □, 뒤의 양이 △)")
        left = ["페트병 묶음의 수와 페트병의 수", "울타리 판의 수와 말뚝의 수", "분리수거함의 수와 칸막이의 수", "캔을 모은 날수와 모은 캔의 수"]
        right = ["△=□+1", "△=□×6", "△=□×4", "△=□−1"]
        pairs = [2, 0, 3, 1]
        fs = [lambda n: 4 * n, lambda n: n + 1, lambda n: n - 1, lambda n: 6 * n]
        for i, fn in enumerate(fs):
            xs6 = [2, 3, 4, 5]
            eq_ok(right[pairs[i]], {'□': xs6, '△': [fn(x) for x in xs6]})
        lk = link_block(w, left, right, pairs, "두 양", "식")
        w.why("울타리 판이 100개일 때 말뚝의 수를 식으로 바로 구하는 방법을 써 보세요.", 1)
        ans += " ⑥ %s, 왜: (예: △=□+1에 □=100을 넣으면 △=101이므로 말뚝은 101개예요)" % lk
    return ans


ST_DECK = [
    ("페트병 묶음의 수(□)와 페트병의 수(△)", "한 묶음에 페트병이 4개", '□', '△', lambda n: 4 * n, 1, ['△=□×4', '□=△÷4']),
    ("캔을 모은 날수(○)와 모은 캔의 수(☆)", "하루에 캔을 6개씩 모아요", '○', '☆', lambda n: 6 * n, 1, ['☆=○×6', '○=☆÷6']),
    ("울타리 판의 수(△)와 말뚝의 수(♡)", "판 사이와 양 끝에 말뚝", '△', '♡', lambda n: n + 1, 1, ['♡=△+1', '△=♡−1']),
    ("모둠의 수(◇)와 모둠 친구의 수(○)", "한 모둠은 5명", '◇', '○', lambda n: 5 * n, 1, ['○=◇×5', '◇=○÷5']),
    ("분리수거함의 수(□)와 칸막이의 수(☆)", "수거함 사이에만 칸막이", '□', '☆', lambda n: n - 1, 1, ['☆=□−1', '□=☆+1']),
    ("윤서의 나이(□)와 언니의 나이(○)", "윤서가 11살일 때 언니는 15살", '□', '○', lambda n: n + 4, 11, ['○=□+4', '□=○−4']),
]


def st_l8(w, D):
    w.lesson(8, "발표하기(P)", "자신만만 대응 관계 놀이", "놀이 카드에서 두 양 사이의 대응 관계를 찾아 기호를 사용하여 식으로 나타낼 수 있나요?",
             "윤서가 캠페인에서 만난 두 양으로 놀이 카드를 만들었어요.")
    w.step("① 만져 보기 — 놀이 방법 알기", "차례대로 번호 쓰기")
    s1 = seq_order(w, ORDER_SRC, ORDER_ANS)
    w.step("② 그려 보기 — 규칙 살펴보기", "페트병 카드와 점수")
    w.text("페트병 카드: 페트병 묶음의 수(□)와 페트병의 수(△), 한 묶음에 페트병이 4개예요. 맞는 식이면 ○, 아니면 ×에 표시해 보세요.")
    o2 = ["△=□×4", "□=△÷4", "△=□+4", "□=△×4"]
    env = {'□': [1, 2, 3, 4], '△': [4, 8, 12, 16]}
    good = []
    for i, e in enumerate(o2):
        try:
            eq_ok(e, env); good.append(i)
        except AssertionError:
            pass
    assert good == [0, 1]
    w.choices(OX(o2))
    w.ask("식이 맞고, 내가 카드를 뒤집었는데 주사위 눈이 6이 나왔어요. 이 카드에서 얻은 점수는 몇 점?")
    w.step("③ 말해 보기 — 놀이하기", "카드마다 정해진 기호로 식 두 가지 쓰기")
    g = game_block(w, D, ST_DECK)
    w.step("④ 약속하기 — 또 다른 놀이", "민아: “내 식은 ○=△×8이야.”")
    w.pic(group_fig('octopus', [1], lambda n: '문어 1마리에 다리 8개', None), 45, 34)
    w.pick("○=△×8에 알맞은 상황은?", ["문어의 수(△)와 문어 다리의 수(○)", "문어 다리의 수(△)와 문어의 수(○)", "나이가 8살 차이 나는 형(○)과 동생(△)"])
    a4 = why1(w, D, "왜 그럴까요? ‘문어 다리의 수(△)와 문어의 수(○)’가 답이 될 수 없는 까닭은 무엇일까요?",
              "△가 8이면 ○=8×8=(        )이 되는데, 문어는 (     )마리이므로 맞지 않아요.",
              "△가 문어 다리의 수 8이면 ○=8×8=64가 되는데, 문어는 1마리뿐이므로 맞지 않아요")
    w.step("⑤ 확인하기 — 놀이 돌아보기")
    a5 = write2(w, D, [("놀이에서 식을 세울 때 주의할 점은 무엇인가요?", "(          )와 (          ) 기호가 각각 무엇을 나타내는지 확인하고 식을 세워요.",
                        "카드에 정해진 기호가 각각 어떤 양을 나타내는지 확인하고 식을 세워요"),
                       ("놀이 카드에 넣고 싶은 새로운 대응 관계를 써 보세요.", "(          )의 수(□)와 (          )의 수(△):  식 (                    )",
                        "세발자전거의 수(□)와 바퀴의 수(△): △=□×3")])
    ans = "8차시  ① %s ② %s, %d점 ③ %s ④ ①, %s ⑤ %s" % (s1, ox_ans(4, good), dice_score(6), g, a4, a5)
    if D:
        w.step("⑥ 도전하기", "식 ☆=◇+2에 알맞은 상황")
        w.choices(OX(["사각형의 수(◇)와 삼각형의 수(☆) — 3차시 게시판 테두리", "동생의 나이(◇)와 2살 많은 형의 나이(☆)", "모둠의 수(◇)와 모둠 친구의 수(☆)",
                      "형의 나이(◇)와 2살 적은 동생의 나이(☆)"]))
        eqs(['☆=◇+2'], {'◇': [1, 2, 3], '☆': [3, 4, 5]})
        w.why("모둠의 수와 모둠 친구의 수가 알맞지 않은 까닭을 써 보세요.", 1)
        ans += " ⑥ %s, 왜: (예: 모둠 친구의 수는 모둠의 수의 5배라서 ☆=◇×5로 나타내요)" % ox_ans(4, [0, 1])
    return ans


def st_l9(w, D):
    w.lesson(9, "발표하기(P)", "우리가 만든 대응 관계 문제 발표회", "생활 속 대응 관계로 문제를 만들어 친구에게 설명할 수 있나요?",
             "초록 탐사대는 생활 속에서 짝을 이루어 함께 변하는 두 양을 찾아 대응 관계 카드를 만들고 발표해요.")
    w.step("① 만져 보기 — 친구의 카드 풀기", "태오가 만든 문제 카드")
    w.text("“동아리 텃밭 화분 1개에 상추 모종을 3포기씩 심어요. 화분의 수를 □, 상추 모종의 수를 △라고 할 때 대응 관계를 식 두 가지로 나타내고, "
           "모종 27포기를 심으려면 화분이 몇 개 필요한지 구해 보세요.”")
    xs = [1, 2, 3, 4]
    t1, ys = corr(w, ["화분의 수(개) □", "상추 모종의 수(포기) △"], xs, lambda n: 3 * n, by=(1, 2, 3) if D else ())
    e1 = eq_block(w, D, None, None, ['△=□×3', '□=△÷3'], {'□': xs, '△': ys}, ['△ = □ (     ) (     )', '□ = △ (     ) (     )'])
    w.ask("상추 모종 27포기를 심으려면 화분은 몇 개?")
    w.step("② 그려 보기 — 내 대응 관계 카드 만들기")
    if D:
        w.labeled([("두 양", "\n"), ("관계", "\n")], row_h=3400)
    else:
        w.labeled([("두 양", "첫째 양 (                    ),   둘째 양 (                    )"),
                   ("관계", "둘째 양 = 첫째 양 ( × / ÷ / + / − ) (        )")], row_h=3400)
    w.table([["첫째 양 □", "", "", "", ""], ["둘째 양 △", "", "", "", ""]], header=False, header_col=True, col_mm=[40, 35, 35, 35, 35])
    w.fill("식 1:  (                              )        식 2:  (                              )")
    w.step("③ 말해 보기 — 발표 원고 쓰기")
    a3 = write2(w, D, [("내 카드의 두 양과 대응 관계를 소개해 보세요.", "제 카드의 두 양은 (            )와 (            )예요. (            )은 (            )의 (     )배예요.",
                        "제 카드의 두 양은 화분의 수와 상추 모종의 수예요. 모종의 수는 화분의 수의 3배예요"),
                       ("식을 두 가지로 나타낸 까닭을 설명해 보세요.", "△=(        )는 (        )를 구할 때, □=(        )는 (        )를 구할 때 써요.",
                        "△=□×3은 모종의 수를 구할 때, □=△÷3은 화분의 수를 구할 때 써요. 기준이 달라서 식이 두 가지예요")])
    w.step("④ 약속하기 — 친구의 식 살펴보기", "준서: “책꽂이 한 칸에 책 12권, △=□+12예요.”")
    t4, ys4 = corr(w, ["책꽂이 칸의 수(칸) □", "책의 수(권) △"], [1, 2, 3], lambda n: 12 * n, by=(1, 2))
    try:
        eq_ok('△=□+12', {'□': [1, 2, 3], '△': ys4}); bad = False
    except AssertionError:
        bad = True
    assert bad
    eqs(['△=□×12'], {'□': [1, 2, 3], '△': ys4})
    w.pick("준서의 식 △=□+12를 어떻게 고치면 좋을까요?", ["△=□×12로 고쳐요. 책의 수는 칸의 수의 12배예요.", "고치지 않아도 돼요. 칸이 1일 때 책이 13권이에요.", "□=△+12로 고쳐요."])
    a4 = why1(w, D, "왜 그럴까요? 친구의 식이 맞는지 확인하는 방법을 써 볼까요?",
              "□에 (     ), △에 (     )를 넣으면 (     )+12=(     )로 같지 않으므로 식이 틀렸어요.",
              "□에 2, △에 24를 넣으면 2+12=14로 24와 같지 않으므로 △=□+12는 틀렸어요. 2×12=24이므로 △=□×12가 맞아요")
    w.step("⑤ 확인하기 — 처음 궁금증 돌아보기", "1차시 ‘궁금해요’ 쪽지를 떠올리며")
    a5 = write2(w, D, [("1차시에 궁금했던 것 하나에 이제 답해 보세요.", "(                    )이 궁금했어요. (              )이므로 (              )예요.",
                        "캔을 30일 동안 모으면 몇 개인지 궁금했어요. △=□×6이므로 30×6=180(개)예요"),
                       ("대응 관계를 기호를 사용한 식으로 나타내면 좋은 점은 무엇인가요?", "식으로 나타내면 (                                        )할 수 있어요.",
                        "표를 끝까지 만들지 않아도 울타리 판이 100개일 때 말뚝이 101개인 것을 바로 알 수 있어요")])
    assert 30 * 6 == 180
    ans = ("9차시  ① %s%s, %d개 ② (예: 화분의 수와 상추 모종의 수, 둘째 양 = 첫째 양 × 3, 표 3·6·9·12, △=□×3 / □=△÷3) ③ %s ④ %s, ①, %s ⑤ %s"
           % ((t1 + ', ') if t1 else '', e1, 27 // 3, a3, t4, a4, a5))
    if D:
        w.step("⑥ 도전하기", "윤서가 낸 마지막 퀴즈")
        q = [("○=☆−3에서 ☆가 50일 때 ○는?", 50 - 3), ("♡=◇÷5에서 ♡가 9일 때 ◇는?", 9 * 5), ("△=□×12에서 △가 96일 때 □는?", 96 // 12)]
        assert 45 / 5 == 9 and 8 * 12 == 96
        for t, _ in q:
            w.ask(t)
        w.why("♡=◇÷5에서 ♡가 9일 때 ◇를 구하는 방법을 써 보세요.", 1)
        ans += " ⑥ %s, 왜: (예: ◇를 5로 나누면 9이므로 ◇는 9의 5배인 45예요)" % ', '.join(str(a) for _, a in q)
    return ans


# ================================================================ 만들기
TB_LESSONS = [tb_l1, tb_l2, tb_l3, tb_l4, tb_l5, tb_l6, tb_l7, tb_l8]
ST_LESSONS = [st_l1, st_l2, st_l3, st_l4, st_l5, st_l6, st_l7, st_l8, st_l9]


def build(lessons, unit_label, ver, level, out_dir):
    s = Sheet(unit_label=unit_label, level=level, grade_label='5학년')
    w = W(s)
    D = level == '도전형'
    keys = [fn(w, D) for fn in lessons]
    w.flush()
    s.answers("【교사용】 3. 대응 관계(%s) 활동지 정답 (%s)" % (ver, level), keys,
              note="※ 이 활동지는 앱 u3-corresp.html과 차시 번호가 같습니다.")
    os.makedirs(out_dir, exist_ok=True)
    path = os.path.join(out_dir, NAME % level)
    s.save(path)
    probs = check(path)
    print(('OK  ' if not probs else 'ERR ') + os.path.relpath(path, ROOT), probs or '', '쪽 나눔 %d' % sum('pageBreak="1"' in b for b in s.body))
    return probs


def main():
    bad = []
    for level in ('기본형', '도전형'):
        bad += build(TB_LESSONS, "5-1 수학 3. 대응 관계(교과서 차시)", "교과서 차시", level, OUT_TB)
        bad += build(ST_LESSONS, "5-1 수학 3. 대응 관계(이야기 버전)", "이야기 버전", level, OUT_ST)
    if bad:
        sys.exit(1)


if __name__ == '__main__':
    main()
