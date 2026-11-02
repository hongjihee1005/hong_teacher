# -*- coding: utf-8 -*-
"""5-2 수학 1. 수의 범위와 어림하기 활동지(교과서 차시 버전·이야기 버전 × 기본형·도전형) 만들기

    python3 gen_u1-range.py

앱 원본 ../units/sem2/u1-range.tb.js('농산물 축제 수의 범위와 어림', 11차시)와 u1-range.st.js('우리 반 현장 체험 학습 준비', 11차시)의
차시 번호·제목·S.O.O.P.·탐구 질문·이야기·수를 그대로 따릅니다.

  - 올림·버림·반올림은 이 스크립트가 분수(Fraction, 정수 계산)로 하고, 수의 범위(이상·이하·초과·미만)에 드는지도
    분수로 비교해서 정답을 만들고 assert로 확인합니다(앱의 rg1Rnd와 같은 규칙).
  - 수직선은 ●(포함)·○(포함하지 않음)과 굵은 선으로 범위를 그리고, 학생이 그리는 칸은 눈금만 있는 빈 수직선을 줍니다.
  - 요금표·체급표·등급표는 표로, 축제 그림·칠판·독도·택배 상자·롤러코스터 수직선은 SVG로 그려
    임시 폴더에서 PNG로 바꿉니다(저장소에는 남기지 않음).
"""
import math
import os
import shutil
import sys
import tempfile
from fractions import Fraction as F
from itertools import permutations

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from hwpxgen import Sheet, svg_to_png, check  # noqa: E402

ROOT = os.path.normpath(os.path.join(HERE, '..', '..'))      # grade5/math
OUT_TB = os.path.join(ROOT, 'sem2', 'sheets')
OUT_ST = os.path.join(ROOT, 'sem2-soop', 'sheets')
NAME = '1단원_수의범위와어림하기_활동지_%s.hwpx'
FONT = "'Noto Sans KR','WenQuanYi Zen Hei',sans-serif"
NUM = '①②③④⑤⑥⑦'
SYM = '㉠㉡㉢㉣㉤㉥'
WORK = tempfile.mkdtemp(prefix='u1range_')
_FIG = {}

INK = '#1D2A2A'
RED, BLUE, GREEN, ORG = '#D64545', '#2B7BD6', '#2E8B57', '#E47A38'
AXIS = '#33403E'


# ================================================================ 계산
def R(x):
    return x if isinstance(x, F) else F(str(x))


def rnd(n, m, p):
    """올림·버림·반올림하여 10^p 자리까지(정수 계산)."""
    x, u = R(n), F(10) ** p
    q = x / u
    if m == '올림':
        k = math.ceil(q)
    elif m == '버림':
        k = math.floor(q)
    else:
        assert m == '반올림'
        k = math.floor(q + F(1, 2))
    return k * u


def below(n, p):
    """구하려는 자리 아래 수."""
    x, u = R(n), F(10) ** p
    return x - math.floor(x / u) * u


def next_digit(n, p):
    """구하려는 자리 바로 아래 자리의 숫자."""
    x = R(n) / F(10) ** (p - 1)
    return math.floor(x) % 10


def fmt(x):
    """Fraction → '250', '2.38'(유한소수만, 쓸데없는 0 없음)."""
    x = R(x)
    if x.denominator == 1:
        return str(x.numerator)
    d, k = x.denominator, 0
    while (10 ** k) % d:
        k += 1
        assert k < 6, x
    return ('%.' + str(k) + 'f') % float(x)


PN = {6: '백만', 5: '십만', 4: '만', 3: '천', 2: '백', 1: '십', 0: '일', -1: '소수 첫째', -2: '소수 둘째', -3: '소수 셋째'}


def PL(p):
    return PN[p] + (' 자리' if p < 0 else '의 자리')


def rng(lo=None, loInc=False, hi=None, hiInc=False):
    return {'lo': None if lo is None else R(lo), 'loInc': loInc, 'hi': None if hi is None else R(hi), 'hiInc': hiInc}


def inr(r, v):
    v = R(v)
    if r['lo'] is not None and (v < r['lo'] or (v == r['lo'] and not r['loInc'])):
        return False
    if r['hi'] is not None and (v > r['hi'] or (v == r['hi'] and not r['hiInc'])):
        return False
    return True


def rname(r):
    a = '%s %s' % (fmt(r['lo']), '이상' if r['loInc'] else '초과') if r['lo'] is not None else ''
    b = '%s %s' % (fmt(r['hi']), '이하' if r['hiInc'] else '미만') if r['hi'] is not None else ''
    return ' '.join(x for x in (a, b) if x) + '인 수'


def josa(w, pair):
    s = str(w)
    c = s[-1]
    has = rieul = False
    if c.isdigit():
        if c == '0' and s.strip('0.') != '' and '.' not in s:
            has, rieul = True, False          # 십·백·천·만…
        else:
            has, rieul = c in '013678', c in '178'
    else:
        code = ord(c) - 0xAC00
        if 0 <= code <= 11171:
            j = code % 28
            has, rieul = j > 0, j == 8
    M = {'이가': ('이', '가'), '을를': ('을', '를'), '은는': ('은', '는'), '과와': ('과', '와'),
         '으로': ('으로', '로'), '이에요': ('이에요', '예요')}
    a, b = M[pair]
    if pair == '으로':
        return s + (a if has and not rieul else b)
    return s + (a if has else b)


assert josa(250, '이에요') == '250이에요' and josa(2.4, '이에요') == '2.4예요' and josa(1300, '으로') == '1300으로'
assert josa(10, '으로') == '10으로' and josa(3, '을를') == '3을' and josa(2, '을를') == '2를' and josa(0, '으로') == '0으로'


def L(xs):
    return ', '.join(fmt(x) if isinstance(x, (int, float, F)) else str(x) for x in xs)


def make3(cards):
    return sorted({int(''.join(map(str, p))) for p in permutations(cards) if p[0] != 0})


# 택배 요금표(찾기쉬운 생활법령정보, 2024 — 앱 RG1FEE)
FEE = [((None, 2), (None, 60), 6000), ((2, 10), (60, 120), 7000), ((10, 20), (120, 140), 8000), ((20, 30), (140, 160), 9000)]


def fee_txt(r, u):
    return '%s %s 이하' % (r[1], u) if r[0] is None else '%s %s 초과 %s %s 이하' % (r[0], u, r[1], u)


def fee_row(k, v):
    v = R(v)
    rows = [i for i, f in enumerate(FEE) if (f[k][0] is None or v > f[k][0]) and v <= f[k][1]]
    assert len(rows) == 1, (k, v)
    return rows[0]


def fee(kg, size):
    return max(FEE[fee_row(0, kg)][2], FEE[fee_row(1, size)][2])


# ================================================================ 그림
def fig(key, svg, px=1600):
    if key not in _FIG:
        _FIG[key] = svg_to_png(svg, os.path.join(WORK, key + '.png'), px)
    return _FIG[key]


def _svg(w, h, body):
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d"><rect width="%d" height="%d" fill="#fff"/>'
            '<g font-family="%s">%s</g></svg>' % (w, h, w, h, FONT, body))


def _t(x, y, s, size=24, anchor='middle', weight='normal', fill=INK):
    return ('<text x="%s" y="%s" font-size="%s" text-anchor="%s" font-weight="%s" fill="%s" '
            'dominant-baseline="middle">%s</text>' % (x, y, size, anchor, weight, fill, s))


def _mult(v, k):
    return k is not None and (R(v) / R(k)).denominator == 1


def svg_numline(frm, to, step=1, lab=None, mid=None, r=None, W=1000, tag=None):
    """수직선. r(범위)이 있으면 ●/○과 굵은 선으로 범위를 그리고, 없으면 빈 수직선(학생이 그림)."""
    frm, to, step = R(frm), R(to), R(step)
    n = (to - frm) / step
    assert n.denominator == 1
    n = int(n)
    lab = R(lab) if lab is not None else (step * 5 if n > 12 else step)
    x0, x1, y = 70 + (60 if tag else 0), W - 60, 62
    H = 120

    def X(v):
        return x0 + float((R(v) - frm) / (to - frm)) * (x1 - x0)

    b = []
    if tag:
        b.append(_t(40, y, tag, 30, weight='bold'))
    b.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="%s" stroke-width="3"/>' % (x0 - 30, y, x1 + 30, y, AXIS))
    b.append('<path d="M%.1f,%d l-12,-7 v14 z" fill="%s"/>' % (x1 + 36, y, AXIS))
    b.append('<path d="M%.1f,%d l12,-7 v14 z" fill="%s"/>' % (x0 - 36, y, AXIS))
    for i in range(n + 1):
        v = frm + i * step
        x = X(v)
        big, md = _mult(v, lab), _mult(v, mid)
        tl = 15 if big else 11 if md else 7
        b.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="%s" stroke-width="%s"/>' % (x, y - tl, x, y + tl, AXIS, 2.6 if big else 1.6))
        if big:
            b.append(_t(x, y + 38, fmt(v), 24))
    if r is not None:
        a = X(r['lo']) if r['lo'] is not None else x0 - 30
        c = X(r['hi']) if r['hi'] is not None else x1 + 30
        b.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="%s" stroke-width="8" stroke-linecap="butt"/>' % (a, y, c, y, RED))
        if r['lo'] is None:
            b.append('<path d="M%.1f,%d l14,-10 v20 z" fill="%s"/>' % (x0 - 44, y, RED))
        if r['hi'] is None:
            b.append('<path d="M%.1f,%d l-14,-10 v20 z" fill="%s"/>' % (x1 + 44, y, RED))
        for v, inc in ((r['lo'], r['loInc']), (r['hi'], r['hiInc'])):
            if v is not None:
                b.append('<circle cx="%.1f" cy="%d" r="11" fill="%s" stroke="%s" stroke-width="4"/>' % (X(v), y, RED if inc else '#fff', RED))
    return _svg(W, H, ''.join(b))


def numline(s, key, frm, to, step=1, lab=None, mid=None, r=None, width=150, tag=None):
    s.picture(fig(key, svg_numline(frm, to, step, lab, mid, r, tag=tag)), width_mm=width)


def svg_coaster(a, b, step, label=True):
    """롤러코스터 수직선: 양 끝이 골짜기, 한가운데가 꼭대기."""
    a, b, step = R(a), R(b), R(step)
    n = int((b - a) / step)
    W, H = 1000, 300
    x0, x1, y = 80, 920, 240

    def X(v):
        return x0 + float((R(v) - a) / (b - a)) * (x1 - x0)

    m = (x0 + x1) / 2
    body = ['<path d="M%d,%d C%.1f,%d %.1f,%d %.1f,%d C%.1f,%d %.1f,%d %d,%d" fill="none" stroke="%s" stroke-width="5" stroke-dasharray="14 8"/>' % (
        x0, y - 30, x0 + 160, y - 30, m - 160, 50, m, 50, m + 160, 50, x1 - 160, y - 30, x1, y - 30, ORG),
        _t(m, 28, '꼭대기', 22, fill=ORG), _t(x0, y - 58, '골짜기', 20, fill=ORG), _t(x1, y - 58, '골짜기', 20, fill=ORG),
        '<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="3"/>' % (x0 - 20, y, x1 + 20, y, AXIS)]
    for i in range(n + 1):
        v = a + i * step
        x = X(v)
        big = i in (0, n) or (n == 10 and i == 5)
        body.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="%s" stroke-width="%s"/>' % (x, y - (14 if big else 8), x, y + (14 if big else 8), AXIS, 2.6 if big else 1.6))
        if big and label:
            body.append(_t(x, y + 36, fmt(v), 24))
    return _svg(W, H + 20, ''.join(body))


def svg_sign(n):
    return _svg(220, 140, '<rect width="220" height="140" fill="#FFF8E0"/><circle cx="110" cy="70" r="55" fill="#fff" stroke="%s" stroke-width="14"/>%s' % (
        RED, _t(110, 72, str(n), 46, weight='bold')))


def svg_spots(title, items):
    """그림 지도: 여덟 곳 카드(이름 + 눈에 띄는 글)."""
    W, H = 1000, 470
    cols = ['#E47A38', '#D64545', '#7A5BB0', '#A0672E', '#2B7BD6', '#6B7B78', '#2E8B57', '#C24C7A']
    b = ['<rect width="%d" height="%d" fill="#EEF6E8"/>' % (W, H),
         '<rect x="250" y="10" width="500" height="50" rx="25" fill="#fff" stroke="%s" stroke-width="3"/>' % ORG,
         _t(500, 36, title, 28, weight='bold', fill='#B5541C')]
    for i, (nm, tx) in enumerate(items):
        cx, top = 130 + (i % 4) * 247, 78 + (i // 4) * 196
        b.append('<rect x="%d" y="%d" width="220" height="180" rx="14" fill="#fff" stroke="#C9D6D1" stroke-width="2.5"/>' % (cx - 110, top))
        b.append('<rect x="%d" y="%d" width="220" height="46" rx="14" fill="%s"/>' % (cx - 110, top, cols[i]))
        b.append(_t(cx, top + 24, nm, 21, weight='bold', fill='#fff'))
        for k, line in enumerate(tx.split('\n')):
            b.append(_t(cx, top + 90 + k * 34, line, 22))
    return _svg(W, H, ''.join(b))


def svg_board(lines, title, foot=None):
    W, H = 1000, 100 + len(lines) * 50 + (40 if foot else 0)
    b = ['<rect x="10" y="10" width="980" height="%d" rx="12" fill="#2F5D4A" stroke="#8B6A3E" stroke-width="10"/>' % (H - 20 - (40 if foot else 0)),
         _t(W / 2, 52, title, 28, weight='bold', fill='#FFF8D6')]
    for i, t in enumerate(lines):
        b.append(_t(50, 104 + i * 50, t, 24, anchor='start', fill='#F4F1E8'))
    if foot:
        b.append(_t(W / 2, H - 22, foot, 20, fill='#6B4A2A'))
    return _svg(W, H, ''.join(b))


def svg_dokdo():
    b = ['<rect width="900" height="320" fill="#DFF0FA"/><rect y="240" width="900" height="80" fill="#9CCBE8"/>',
         '<path d="M90,250 L160,150 L230,70 L290,115 L340,185 L400,250 Z" fill="#7DA36B" stroke="#4E6E42" stroke-width="3"/>',
         '<path d="M500,250 L560,190 L620,140 L690,175 L760,250 Z" fill="#8FB27C" stroke="#4E6E42" stroke-width="3"/>',
         _t(245, 278, '서도', 26, weight='bold'), _t(630, 278, '동도', 26, weight='bold'),
         _t(235, 40, '높이 168.5 m', 24, fill='#B5541C'), _t(630, 110, '높이 98.6 m', 24, fill='#B5541C'),
         '<rect x="470" y="14" width="410" height="44" rx="8" fill="#fff" stroke="%s" stroke-width="2"/>' % BLUE,
         _t(675, 37, '독도 전체 넓이 187554 m²', 23, fill=BLUE)]
    return _svg(900, 320, ''.join(b))


def svg_box(name, kg, e=None, size=None):
    P = lambda pts, f: '<polygon points="%s" fill="%s" stroke="#8C6F4E" stroke-width="3" stroke-linejoin="round"/>' % (' '.join('%d,%d' % p for p in pts), f)
    b = [P([(150, 110), (420, 110), (420, 270), (150, 270)], '#E8C9A0'), P([(150, 110), (240, 50), (510, 50), (420, 110)], '#F2DAB8'),
         P([(420, 110), (510, 50), (510, 210), (420, 270)], '#D9B385'),
         '<rect x="10" y="170" width="120" height="52" rx="10" fill="#fff" stroke="%s" stroke-width="3"/>' % BLUE,
         _t(70, 197, '%s kg' % fmt(kg), 26, weight='bold', fill=BLUE), _t(285, 190, name, 28, weight='bold', fill='#6B4A2A')]
    if e:
        b += [_t(285, 296, '㉠ %d cm' % e[0], 24), _t(405, 30, '㉡ %d cm' % e[1], 24), _t(560, 130, '㉢', 24), _t(560, 162, '%d cm' % e[2], 24)]
    else:
        b.append(_t(285, 296, '크기 %d cm' % size, 24))
    return _svg(620, 320, ''.join(b))


def svg_cards(nums):
    b = []
    for i, n in enumerate(nums):
        x = 20 + i * 120
        b.append('<rect x="%d" y="10" width="96" height="120" rx="12" fill="#FFF8E0" stroke="%s" stroke-width="4"/>' % (x, ORG))
        b.append(_t(x + 48, 72, str(n), 56, weight='bold'))
    return _svg(40 + len(nums) * 120, 140, ''.join(b))


def svg_lock():
    b = ['<rect x="30" y="20" width="440" height="170" rx="24" fill="#5B6F8C" stroke="#33405A" stroke-width="5"/>']
    for i in range(3):
        x = 110 + i * 140
        b.append('<rect x="%d" y="60" width="90" height="90" rx="10" fill="#fff" stroke="#33405A" stroke-width="4"/>' % (x - 45))
        b.append(_t(x, 106, '?', 48, weight='bold', fill='#8090A8'))
    return _svg(500, 210, ''.join(b))


# ================================================================ 공통 활동 조각
def step(s, i, label, sub=None):
    s.step('%s %s' % (NUM[i], label), sub)


def opt(*o):
    return '( ' + ' / '.join(o) + ' )'


def ch(lv, opts, width=12):
    """기본형은 고르기, 도전형은 빈칸."""
    return opt(*opts) if lv == '기본형' else '(' + ' ' * width + ')'


def qa(s, items, col=(125, 55)):
    """(질문, 답, 단위) 표. 정답 글 목록."""
    rows, ans = [], []
    for it in items:
        q, a = it[0], it[1]
        unit = it[2] if len(it) > 2 else ''
        rows.append([q, '(            )' + unit])
        ans.append((fmt(a) if isinstance(a, (int, F)) else str(a)) + unit)
    s.table(rows, header=False, col_mm=list(col), row_h=3402)
    return ans


def why(s, q, n=2):
    s.ask(q, blank=False)
    s.lines(n)


def thenwhy(s, lv, q, frame):
    s.ask('왜 그럴까요? ' + q, blank=False)
    if lv == '기본형':
        s.fill(frame)
    else:
        s.lines(2)


def rule_first(s, lv, q, frame):
    s.ask('먼저 예상해요 · ' + q, blank=False)
    if lv == '기본형':
        s.fill(frame)
    else:
        s.lines(1)


def write_pane(s, lv, items):
    if lv == '기본형':
        s.labeled(items)
    else:
        for k, _ in items:
            s.ask(k + ':', blank=False)
            s.lines(1)


def order_table(s, items, order):
    """차례 정하기 표. order = 바른 차례의 번호 목록. 정답: 위에서부터 차례 번호."""
    s.table([['차례', '할 일']] + [['(    )', t] for t in items], col_mm=[25, 155])
    rank = {idx: k + 1 for k, idx in enumerate(order)}
    return ', '.join(str(rank[i]) for i in range(len(items)))


def marks(s, vals, ms, labels=None, unit='', note=None):
    """수 카드에 ○표·△표. ms = [(기호, 범위)]. 정답 글."""
    n = len(vals)
    rows = []
    if labels:
        rows.append(['이름'] + list(labels))
    rows.append(['수' if not labels else '기록'] + [fmt(v) + unit for v in vals])
    rows.append(['표시' if not note else note] + ['' for _ in vals])
    s.table(rows, header=bool(labels), header_col=True, col_mm=[28] + [152 / n] * n, row_h=3402)
    out = []
    for sym, r in ms:
        got = [v for v in vals if inr(r, v)]
        assert got
        out.append('%s %s' % (sym, ', '.join(fmt(v) + unit for v in got)))
    return ' / '.join(out)


def sort_cards(s, cards, bins):
    """카드 → 칸 고르기. cards = [(글, 칸 번호)]. 정답 글."""
    s.choices([(t, opt(*bins)) for t, _ in cards])
    return ', '.join(bins[k] for _, k in cards)


def digits(s, lv, tasks):
    """올림·버림·반올림 표. task = (앞말, 수, 방법, 자리, 단위)."""
    if lv == '기본형':
        rows = [['어림할 수', '어림하는 방법', '생각하기', '어림한 수']]
        cw = [42, 52, 50, 36]
    else:
        rows = [['처음 수', '어떻게 어림할까요?', '어림한 결과']]
        cw = [55, 75, 50]
    ans = []
    for pre, n, m, p, unit in tasks:
        a = rnd(n, m, p)
        if m == '올림':
            assert a >= R(n)
        if m == '버림':
            assert a <= R(n)
        how = '%s하여 %s까지' % (m, PL(p))
        num = '%s%s%s' % (pre, n, (' ' + unit) if unit else '')
        if m == '반올림':
            th = '바로 아래 숫자 (     )'
            hint = '바로 아래 숫자 %d' % next_digit(n, p)
        else:
            th = '아래 수 (        )'
            hint = '아래 수 %s' % fmt(below(n, p))
        rows.append([num, how, th, '(          )'] if lv == '기본형' else [num, how, '(          )'])
        ans.append('%s → %s%s' % (n, fmt(a), '(%s)' % hint if lv == '기본형' else ''))
    s.table(rows, col_mm=cw, row_h=3402)
    return ans


def pack(s, lv, n, u, mode, box, item_u, ks, can):
    """묶음 늘리기 표. mode ceil: 모두 담을 수 있나 / floor: 꽉 채워 바꿀 수 있나. 정답 (가장 알맞은 묶음 수, 그때의 수)."""
    best = math.ceil(F(n, u)) if mode == 'ceil' else math.floor(F(n, u))
    assert best in ks
    rows = [['%s 수' % box, '모두 몇 %s?' % item_u, can]]
    ok = []
    for k in ks:
        rows.append(['%d' % k, '(          )%s' % item_u, opt('예', '아니요') if lv == '기본형' else '(        )'])
        ok.append('%d→%d%s %s' % (k, k * u, item_u, '예' if ((k * u >= n) if mode == 'ceil' else (k * u <= n)) else '아니요'))
    s.table(rows, col_mm=[45, 65, 70], row_h=3402)
    return best, best * u, ', '.join(ok)


def fee_table(s):
    s.table([['무게', '크기(세 변의 길이의 합)', '요금']] + [[fee_txt(w, 'kg'), fee_txt(z, 'cm'), '%d원' % f] for w, z, f in FEE],
            col_mm=[62, 78, 40])


def fee_box(s, lv, key, name, kg, e=None, size=None):
    """택배 상자 한 개의 요금 구하기. 정답 글과 요금."""
    sz = sum(e) if e else size
    wr, sr = fee_row(0, kg), fee_row(1, sz)
    f = max(FEE[wr][2], FEE[sr][2])
    s.picture(fig(key, svg_box(name, kg, e, size)), width_mm=72)
    items = []
    if e:
        items.append(('크기: %d + %d + %d =' % tuple(e), sz, ' cm'))
    if lv == '기본형':
        s.choices([('무게 %s kg이 속하는 칸' % fmt(kg), opt(*[fee_txt(w, 'kg') for w, _, _ in FEE[:3]]))])
    items += [('무게에 따른 요금', FEE[wr][2], '원'), ('크기에 따른 요금', FEE[sr][2], '원'), ('%s의 택배 요금' % name, f, '원')]
    a = qa(s, items)
    txt = '%s %s' % (name, ', '.join(a)) if not lv == '기본형' else '%s (%s) %s' % (name, fee_txt(FEE[wr][0], 'kg'), ', '.join(a))
    return txt, f


AGE = [('무료', None, 4, 0), ('어린이', 4, 13, 15000), ('청소년', 13, 19, 20000), ('어른', 19, 65, 25000), ('경로', 65, None, 12000)]


def age_txt(lo, hi):
    return '%d세 미만' % hi if lo is None else '%d세 이상' % lo if hi is None else '%d세 이상 %d세 미만' % (lo, hi)


def age_row(a):
    rows = [i for i, (_, lo, hi, _f) in enumerate(AGE) if (lo is None or a >= lo) and (hi is None or a < hi)]
    assert len(rows) == 1
    return rows[0]


def dice_record(s):
    s.table([['회', '주사위 두 눈', '외친 말', '둘레 또는 넓이', '반올림하여 십의 자리까지']] +
             [[str(i), '(   ), (   )', opt('둘레', '넓이'), '(        )', '(        )'] for i in (1, 2, 3)],
             col_mm=[14, 38, 40, 40, 48], row_h=3402)


def sticky(s):
    s.table([['', '붙임쪽지 1 (문제)', '붙임쪽지 2 (문제)'],
             ['어림할 수', '', ''], ['어림 방법', opt('올림', '버림', '반올림'), opt('올림', '버림', '반올림')],
             ['나타낼 자리', '(          )의 자리까지', '(          )의 자리까지'], ['답(다른 쪽지)', '', '']],
            header=True, header_col=True, col_mm=[40, 70, 70], row_h=3402)


# ================================================================ 교과서 차시 버전
SEQ = ['버림', '이상과 이하', '반올림', '수의 범위를 활용하여 문제 해결하기', '올림', '초과와 미만', '올림, 버림, 반올림을 활용하여 문제 해결하기']
SEQ_ORDER = [1, 5, 3, 4, 0, 2, 6]
FEST = [('축제 입구', '방문자 수\n3482'), ('사과 매장', '180 g과 같거나\n무거운 사과만'), ('지게 체험장', '키 110 cm보다\n큰 사람만'),
        ('호두과자 판매장', '10개 상자\n100개 상자'), ('기념품 받는 곳', '스티커 10개·\n100개로 바꾸기'), ('버섯 매장', '판매액\n4836200원'),
        ('사과파이 판매점', '한 상자에\n10개씩'), ('축제 버스 정류장', '한 번에\n10명씩')]


def tb1(s, lv):
    s.lesson(1, '개념 찾기(S)', '단원 도입 ― 우리 마을 농산물 축제', '우리 주변에서 수의 범위나 어림이 필요한 상황에는 어떤 것이 있을까요?')
    s.scene(None, '크리에이터 정우가 가족과 함께 우리 마을 농산물 축제에 왔어요. “우리 마을에 농산물 축제가 열린다고?” 정우와 함께 축제를 둘러봐요.')
    if lv == '기본형':
        step(s, 0, '축제 둘러보기', '여덟 곳 살펴보기')
        s.picture(fig('fest', svg_spots('우리 마을 농산물 축제', FEST)), width_mm=165)
        a1 = qa(s, [('축제 입구의 방문자 수 기계에 나온 오늘 방문자는?', 3482, '명')])
        step(s, 1, '범위와 어림 찾기', '어느 쪽이 필요할까요?')
        cards = [('180 g과 같거나 무거운 사과만 진열하기', 0), ('키가 110 cm보다 큰 사람만 지게 체험하기', 0), ('체감 온도 33 ℃ 이상이면 폭염 주의보', 0),
                 ('호두과자 243개를 10개씩 담은 상자로 최소 몇 개 살까?', 1), ('스티커 228개로 사과주스를 최대 몇 병 바꿀까?', 1),
                 ('방문자 3482명을 약 몇 명이라고 전할까?', 1)]
        a2 = sort_cards(s, cards, ['수의 범위', '어림'])
        step(s, 2, '체감 온도', '폭염 주의보와 폭염 경보')
        s.text('체감 온도가 33 ℃ 이상인 상태가 2일 이상 계속될 것으로 예상되면 폭염 주의보, 35 ℃ 이상인 상태가 2일 이상 계속될 것으로 예상되면 '
               '폭염 경보를 발표해요. (출처: 질병관리청, 2024)')

        def heat(t, d):
            if d < 2:
                return '발표하지 않아요'
            return '폭염 경보' if t >= 35 else '폭염 주의보' if t >= 33 else '발표하지 않아요'
        hs = [(34, 3), (35, 2), (32, 4)]
        s.choices([('체감 온도 %d ℃가 %d일 계속될 것으로 예상될 때' % (t, d), opt('폭염 주의보', '폭염 경보', '발표하지 않아요')) for t, d in hs])
        a3 = ', '.join(heat(t, d) for t, d in hs)
        assert a3 == '폭염 주의보, 폭염 경보, 발표하지 않아요'
        step(s, 3, '배울 내용 살펴보기', '배우는 순서대로 번호 쓰기')
        a4 = order_table(s, SEQ, SEQ_ORDER)
        step(s, 4, '배운 내용 떠올리기', '어림하기와 큰 수의 크기 비교')
        s.choices([('새 색연필의 길이는 약', opt('2 cm', '17 cm', '170 cm')), ('작은 우유갑의 들이는 약', opt('2 mL', '200 mL', '20 L'))])
        cmp = [(3482, 3428), (52300, 523000)]
        sg = ['>' if a > b else '<' for a, b in cmp]
        assert sg == ['>', '<']
        if lv == '기본형':
            s.choices([('%d  (   )  %d' % c, opt('>', '<')) for c in cmp])
            s.text('자릿수가 같으면 높은 자리의 숫자부터 비교해요. 자릿수가 다르면 자릿수가 많은 수가 더 커요.')
        else:
            s.ask('%d  (     )  %d          %d  (     )  %d' % (cmp[0] + cmp[1]), blank=False)
        ans = '1차시  ① %s명   ② %s   ③ %s   ④ (위에서부터) %s   ⑤ 17 cm, 200 mL, %s' % (a1[0][:-1], a2, a3, a4, ', '.join(sg))
    else:  # 도전형
        step(s, 0, '축제 둘러보기', '여덟 곳 살펴보기')
        s.picture(fig('fest', svg_spots('우리 마을 농산물 축제', FEST)), width_mm=165)
        a1 = qa(s, [('방문자 수 3482에서 숫자 4가 나타내는 값', 400), ('오늘 방문자가 518명 더 오면 모두', 3482 + 518, '명')])
        assert 3482 + 518 == 4000
        step(s, 1, '범위와 어림 찾기', '어느 쪽이 필요할까요?')
        cards = [('무게가 2 kg 이하인 짐만 들고 체험장에 들어가기', 0), ('65세 이상인 어르신은 무료로 입장하기', 0), ('기다리는 시간이 15분 미만인 줄에 서기', 0),
                 ('밤 1683개를 100개씩 자루에 모두 담으려면 자루가 최소 몇 개?', 1), ('용돈 5730원으로 1000원짜리 공책을 최대 몇 권 살까?', 1),
                 ('키 137.6 cm를 약 138 cm라고 말하기', 1)]
        a2 = sort_cards(s, cards, ['수의 범위', '어림'])
        step(s, 2, '체감 온도', '폭염 주의보와 폭염 경보')
        s.text('폭염 주의보: 체감 온도 33 ℃ 이상이 2일 이상 계속될 것으로 예상될 때 / 폭염 경보: 체감 온도 35 ℃ 이상이 2일 이상 계속될 것으로 예상될 때 (질병관리청, 2024)')

        def heat(t, d):
            if d < 2:
                return '발표하지 않아요'
            return '폭염 경보' if t >= 35 else '폭염 주의보' if t >= 33 else '발표하지 않아요'
        hs = [(33, 2), (36, 1), (37, 3)]
        s.choices([('체감 온도 %d ℃가 %d일 계속될 것으로 예상될 때' % (t, d), opt('폭염 주의보', '폭염 경보', '발표하지 않아요')) for t, d in hs])
        a3 = ', '.join(heat(t, d) for t, d in hs)
        assert a3 == '폭염 주의보, 발표하지 않아요, 폭염 경보'
        a3b = qa(s, [('3일 동안 계속될 때 폭염 경보가 되는 가장 낮은 자연수 체감 온도', min(t for t in range(30, 40) if heat(t, 3) == '폭염 경보'), ' ℃')])
        why(s, '체감 온도가 36 ℃인데도 폭염 경보를 발표하지 않는 경우는 언제인지 써 보세요.', 1)
        step(s, 3, '배울 내용 살펴보기', '배울 내용 이어 보기')
        cards4 = [('180 g과 무게가 같거나 더 무거운 것만 고르기', 0), ('키가 110 cm를 넘는 사람만 참여하기', 1), ('243개를 10개짜리 상자로 빠짐없이 사기', 2),
                  ('228개를 10개씩 바꾸고 남는 것은 그대로 두기', 3), ('3482명을 가까운 쪽으로 약 3500명이라 하기', 4)]
        a4 = sort_cards(s, cards4, ['이상과 이하', '초과와 미만', '올림', '버림', '반올림'])
        step(s, 4, '배운 내용 떠올리기', '어림하기와 큰 수의 크기 비교')
        s.choices([('교실 문의 높이는 약', opt('20 cm', '2 m', '20 m')), ('욕조 하나의 들이는 약', opt('2 L', '200 L', '2000 L'))])
        cmp = [(1032590, 1029950), (87654, 876540)]
        sg = ['>' if a > b else '<' for a, b in cmp]
        assert sg == ['>', '<']
        s.ask('%d  (     )  %d          %d  (     )  %d' % (cmp[0] + cmp[1]), blank=False)
        dd = [d for d in range(10) if 52084 + d * 100 > 52784]
        a5 = qa(s, [('52□84가 52784보다 클 때 □에 들어갈 수 있는 가장 작은 숫자', min(dd))])
        assert min(dd) == 8
        ans = '1차시  ① %s   ② %s   ③ %s, %s (2일 이상 계속되지 않을 때)   ④ %s   ⑤ 2 m, 200 L, %s, %s' % (' / '.join(a1), a2, a3, a3b[0], a4, ', '.join(sg), a5[0])
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '수학 이야기 — 부등호를 만든 사람')
        s.text('부등호 ‘>’와 ‘<’는 영국의 수학자 오트레드(1574~1660)가 『수학의 열쇠』라는 책에서 처음 사용했다고 해요. 그때는 모양이 지금과 달랐고, '
               '그 뒤 토머스 해리엇(1560~1621)이 지금과 같은 모양을 만들었어요.')
        s.choices([('부등호를 처음 사용한 사람', opt('오트레드', '해리엇')), ('지금과 같은 모양을 만든 사람', opt('오트레드', '해리엇'))])
        c2 = [('45.6', '45.06'), ('3482', '3500')]
        g2 = ['>' if R(a) > R(b) else '<' for a, b in c2]
        assert g2 == ['>', '<']
        s.ask('45.6  (     )  45.06          3482  (     )  3500', blank=False)
        why(s, '45.6과 45.06의 크기를 어떻게 비교했는지 써 보세요.', 1)
        ans += '   ⑥ 오트레드, 해리엇, %s (자연수 부분이 같으니 소수 첫째 자리 숫자 6과 0을 비교해요)' % ', '.join(g2)
    return ans


def tb2(s, lv):
    s.lesson(2, '개념 구축하기(O)', '이상과 이하를 알아볼까요', '180과 같거나 큰 수, 145와 같거나 작은 수를 어떻게 나타낼 수 있을까요?')
    s.scene(None, '축제 첫째 날 아침, 상인들이 사과의 무게를 재어 진열하고 있어요. “180 g과 같거나 무거운 사과만 골라 진열하려고 해요.”')
    if lv == '기본형':
        step(s, 0, '사과 고르기', '180 g과 같거나 무거운 사과')
        r180 = rng(180, True)
        ap = [180, 170, 181, 179, 183]
        s.choices([('사과 %d g' % w, opt('진열해요', '진열하지 않아요')) for w in ap])
        disp = [w for w in ap if inr(r180, w)]
        assert disp == [180, 181, 183] and min(disp) == 180
        a1 = qa(s, [('진열하는 사과 중에서 가장 가벼운 사과의 무게', min(disp), ' g')])
        step(s, 1, '수직선에 나타내기', '180과 같거나 큰 수')
        if lv == '기본형':
            s.text('180은 포함되니 180에 ●을 찍고, 더 큰 수 쪽(오른쪽)으로 굵은 선을 그어요.')
        else:
            s.text('180과 같거나 큰 수를 수직선에 나타내 보세요.')
        numline(s, 'tb2a', 179, 183)
        step(s, 2, '제자리멀리뛰기', '145 cm와 같거나 짧은 기록')
        m3 = marks(s, [143, 147.8, 145, 144.6, 148], [('○', rng(hi=145, hiInc=True))], ['지유', '승민', '채희', '우진', '민서'], ' cm')
        s.text('145와 같거나 작은 수를 수직선에 나타내 보세요.' + (' (145에 ●, 왼쪽으로 선)' if lv == '기본형' else ''))
        numline(s, 'tb2b', 142, 146)
        step(s, 3, '약속하기', '이상과 이하')
        numline(s, 'tb2c', 179, 183, r=r180, width=110)
        numline(s, 'tb2d', 142, 146, r=rng(hi=145, hiInc=True), width=110)
        s.fill(['180, 181, 183과 같이 180과 같거나 큰 수를 180 %s인 수라고 합니다.' % ch(lv, ['이상', '이하'], 8),
                '143, 144.6, 145와 같이 145와 같거나 작은 수를 145 %s인 수라고 합니다.' % ch(lv, ['이상', '이하'], 8),
                '수직선의 ●은 그 수가 %s 것을 의미해요.' % ch(lv, ['포함된다는', '포함되지 않는다는'], 14)])
        step(s, 4, '확인하기', '이상인 수와 이하인 수')
        s.text('68 이상인 수에 모두 ○표, 52 이하인 수에 모두 △표 해 보세요.')
        m5 = marks(s, [54, 48.7, 75, 67.9, 68, 68.3, 52], [('○', rng(68, True)), ('△', rng(hi=52, hiInc=True))])
        assert m5 == '○ 75, 68, 68.3 / △ 48.7, 52'
        s.picture(fig('sign30', svg_sign(30)), width_mm=32)
        s.text('어린이 보호 구역의 표지판은 자동차가 한 시간에 30 km 이하의 빠르기로 가야 한다는 뜻이에요. 30 이하인 수를 그림에 나타내 보세요.')
        numline(s, 'tb2e', 27, 33)
        ans = '2차시  ① 진열해요: 180·181·183 g, %s   ② 180에 ●, 오른쪽으로 선   ③ %s, 145에 ●, 왼쪽으로 선   ④ 이상, 이하, 포함된다는   ⑤ %s, 30에 ●, 왼쪽으로 선' % (
            a1[0], m3, m5)
    else:  # 도전형
        step(s, 0, '사과 고르기', '250 g과 같거나 무거운 배')
        s.text('배 매장에서는 250 g과 같거나 무거운 배만 선물 상자에 담아요.')
        r250 = rng(250, True)
        ap = [249, 250.5, 250, 248.9, 262]
        s.choices([('배 %s g' % fmt(w), opt('선물 상자에 담아요', '담지 않아요')) for w in ap])
        disp = [w for w in ap if inr(r250, w)]
        assert disp == [250.5, 250, 262]
        a1 = qa(s, [('선물 상자에 담는 배 중에서 가장 가벼운 배의 무게', min(disp), ' g'), ('선물 상자에 담지 않는 배의 수', len(ap) - len(disp), '개')])
        step(s, 1, '수직선에 나타내기', '250과 같거나 큰 수')
        s.text('250과 같거나 큰 수를 수직선에 나타내 보세요.')
        numline(s, 'htb2a', 248, 253)
        step(s, 2, '제자리멀리뛰기', '152 cm와 같거나 짧은 기록')
        m3 = marks(s, [151.9, 153, 152, 150.4, 152.1], [('○', rng(hi=152, hiInc=True))], ['나래', '건우', '보미', '태성', '은수'], ' cm')
        assert m3 == '○ 151.9 cm, 152 cm, 150.4 cm'
        s.text('152와 같거나 작은 수를 수직선에 나타내 보세요.')
        numline(s, 'htb2b', 149, 154)
        step(s, 3, '약속하기', '이상과 이하')
        numline(s, 'htb2c', 248, 253, r=r250, width=110)
        numline(s, 'htb2d', 149, 154, r=rng(hi=152, hiInc=True), width=110)
        s.fill(['250.5, 262와 같이 250과 같거나 큰 수를 250 (        )인 수라고 합니다.',
                '150.4, 151.9와 같이 152와 같거나 작은 수를 152 (        )인 수라고 합니다.',
                '152 이하인 수에 152는 (            ). 그래서 수직선의 152에 (    )을 그려요.'])
        step(s, 4, '확인하기', '이상인 수와 이하인 수')
        s.text('90 이상인 수에 모두 ○표, 75 이하인 수에 모두 △표 해 보세요.')
        m5 = marks(s, [87, 91.5, 90, 89.9, 74.8, 75, 75.1], [('○', rng(90, True)), ('△', rng(hi=75, hiInc=True))])
        assert m5 == '○ 91.5, 90 / △ 74.8, 75'
        s.picture(fig('sign50', svg_sign(50)), width_mm=32)
        s.text('이 표지판은 자동차가 한 시간에 50 km 이하의 빠르기로 가야 한다는 뜻이에요. 50 이하인 수를 그림에 나타내고, 이 길을 달릴 수 있는 가장 빠른 빠르기를 써 보세요.')
        numline(s, 'htb2e', 47, 53)
        a5 = qa(s, [('이 길에서 달릴 수 있는 가장 빠른 빠르기', 50, ' km')])
        ans = '2차시  ① 담아요: 250.5·250·262 g, %s   ② 250에 ●, 오른쪽으로 선   ③ %s, 152에 ●, 왼쪽으로 선   ④ 이상, 이하, 들어가요(포함돼요)·●   ⑤ %s, 50에 ●·왼쪽으로 선, %s' % (
            ' / '.join(a1), m3, m5, a5[0])
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '수학익힘 — 이상과 이하')
        s.text('37 이하인 수에 모두 ○표 해 보세요.')
        m6 = marks(s, [39, 42, 36.5, 34, 40.7], [('○', rng(hi=37, hiInc=True))])
        numline(s, 'tb2f', 54, 61, r=rng(hi=59, hiInc=True), width=110)
        s.ask('그림에 나타낸 수의 범위: (        ) (이상 / 이하)인 수', blank=False)
        kids = [('준호', 140.2), ('유라', 130.0), ('성욱', 126.9), ('채영', 137.4)]
        no = [k for k, v in kids if inr(rng(hi=130, hiInc=True), v)]
        assert no == ['유라', '성욱']
        s.text('키가 130 cm 이하인 사람은 탈 수 없는 놀이기구가 있어요. 준호 140.2 cm, 유라 130.0 cm, 성욱 126.9 cm, 채영 137.4 cm예요.')
        a6 = qa(s, [('이 놀이기구를 탈 수 없는 사람 수', len(no), '명')])
        s.text('성호: “16 이상인 수 중에서 가장 작은 수는 17이야.”  아영: “53 이하인 수는 53과 같거나 작은 수야.”  해미: “20.1은 20 이상인 수야.”')
        assert inr(rng(20, True), 20.1)
        s.choices([('수의 범위에 대해 잘못 말한 사람', opt('성호', '아영', '해미'))])
        why(s, '잘못 말한 것을 바르게 고쳐 써 보세요.', 1)
        ans += '   ⑥ %s, 59 이하, %s(유라·성욱), 성호 → 16 이상인 수 중에서 가장 작은 수는 16이에요' % (m6, a6[0])
    return ans


def tb3(s, lv):
    s.lesson(3, '개념 구축하기(O)', '초과와 미만을 알아볼까요', '110보다 큰 수, 64보다 작은 수를 어떻게 나타낼 수 있을까요?')
    s.scene(None, '“지게 체험을 하려면 조건이 있네요?” 안전을 위해 키가 110 cm보다 큰 사람만 지게 체험에 참여할 수 있어요.')
    if lv == '기본형':
        step(s, 0, '지게 체험', '110 cm보다 큰 키')
        r110 = rng(110, False)
        ks = [('시원', 109), ('소은', 113.2), ('현서', 113), ('도진', 110), ('수민', 110.8)]
        s.choices([('%s %s cm' % (k, fmt(v)), opt('참여할 수 있어요', '참여할 수 없어요')) for k, v in ks])
        ok = [k for k, v in ks if inr(r110, v)]
        assert ok == ['소은', '현서', '수민']
        s.choices([('키가 110 cm인 도진이는 지게 체험에 참여할 수', opt('있어요', '없어요'))])
        step(s, 1, '수직선에 나타내기', '110보다 큰 수')
        s.text('110보다 큰 수를 수직선에 나타내 보세요.' + (' 110은 포함되지 않으니 110에 ○을 찍고 오른쪽으로 선을 그어요.' if lv == '기본형' else ''))
        numline(s, 'tb3a', 109, 113)
        step(s, 2, '왕복 오래달리기', '64회보다 적은 기록')
        m3 = marks(s, [68, 60, 64, 63, 59], [('○', rng(hi=64))], ['민준', '소민', '승호', '서율', '지완'], '회')
        s.text('64보다 작은 수를 수직선에 나타내 보세요.')
        numline(s, 'tb3b', 59, 65)
        step(s, 3, '약속하기', '초과와 미만')
        numline(s, 'tb3c', 109, 113, r=r110, width=110)
        numline(s, 'tb3d', 59, 65, r=rng(hi=64), width=110)
        s.fill(['110.8, 113, 113.2와 같이 110보다 큰 수를 110 %s인 수라고 합니다.' % ch(lv, ['이상', '초과', '미만'], 8),
                '59, 60, 63과 같이 64보다 작은 수를 64 %s인 수라고 합니다.' % ch(lv, ['이하', '초과', '미만'], 8),
                '수직선의 ○은 그 수가 %s 것을 의미해요.' % ch(lv, ['포함된다는', '포함되지 않는다는'], 14)])
        step(s, 4, '확인하기', '초과인 수와 미만인 수')
        s.text('59.6 초과인 수에 모두 ○표, 48.2 미만인 수에 모두 △표 해 보세요.')
        m5 = marks(s, [48, 60, 59.6, 48.2, 63, 46.5, 59.7], [('○', rng(59.6)), ('△', rng(hi=48.2))])
        assert m5 == '○ 60, 63, 59.7 / △ 48, 46.5'
        el = [('가', 1500), ('나', 1290), ('다', 1510)]
        beep = [k for k, v in el if inr(rng(1500), v)]
        assert beep == ['다']
        s.text('무게가 1500 kg을 초과하면 경고음이 울리는 엘리베이터가 있어요. 가 엘리베이터 1500 kg, 나 엘리베이터 1290 kg, 다 엘리베이터 1510 kg일 때 '
               '경고음이 울리는 엘리베이터를 모두 써 보세요.')
        s.ask('경고음이 울리는 엘리베이터', blank=True)
        ans = '3차시  ① 참여할 수 있어요: 소은·현서·수민, 없어요   ② 110에 ○, 오른쪽으로 선   ③ %s, 64에 ○, 왼쪽으로 선   ④ 초과, 미만, 포함되지 않는다는   ⑤ %s, %s 엘리베이터' % (
            m3, m5, ', '.join(beep))
    else:  # 도전형
        step(s, 0, '지게 체험', '125 cm보다 큰 키')
        s.text('축제의 바이킹은 키가 125 cm보다 큰 사람만 탈 수 있어요.')
        r125 = rng(125, False)
        ks = [('하율', 124.9), ('준서', 125), ('예린', 125.1), ('도겸', 131), ('서아', 118)]
        s.choices([('%s %s cm' % (k, fmt(v)), opt('탈 수 있어요', '탈 수 없어요')) for k, v in ks])
        ok = [k for k, v in ks if inr(r125, v)]
        assert ok == ['예린', '도겸']
        a1 = qa(s, [('바이킹을 탈 수 있는 사람 수', len(ok), '명')])
        why(s, '키가 125 cm인 준서가 바이킹을 탈 수 없는 까닭을 써 보세요.', 1)
        step(s, 1, '수직선에 나타내기', '125보다 큰 수')
        s.text('125보다 큰 수를 수직선에 나타내 보세요.')
        numline(s, 'htb3a', 123, 128)
        step(s, 2, '왕복 오래달리기', '72회보다 적은 기록')
        m3 = marks(s, [71, 72, 75, 68, 73], [('○', rng(hi=72))], ['가람', '다온', '로하', '미루', '보담'], '회')
        assert m3 == '○ 71회, 68회'
        s.text('72보다 작은 수를 수직선에 나타내 보세요.')
        numline(s, 'htb3b', 67, 74)
        step(s, 3, '약속하기', '초과와 미만')
        numline(s, 'htb3c', 123, 128, r=r125, width=110)
        numline(s, 'htb3d', 67, 74, r=rng(hi=72), width=110)
        s.fill(['125.1, 131과 같이 125보다 큰 수를 125 (        )인 수라고 합니다.',
                '68, 71과 같이 72보다 작은 수를 72 (        )인 수라고 합니다.',
                '72 미만인 자연수 중에서 가장 큰 수는 (        )이고, 수직선의 72에는 (    )을 그려요.'])
        step(s, 4, '확인하기', '초과인 수와 미만인 수')
        s.text('34.5 초과인 수에 모두 ○표, 21.3 미만인 수에 모두 △표 해 보세요.')
        m5 = marks(s, [34.5, 34.6, 21.3, 21.2, 40, 19.9, 34], [('○', rng(34.5)), ('△', rng(hi=21.3))])
        assert m5 == '○ 34.6, 40 / △ 21.2, 19.9'
        tr = [('가', 19.8), ('나', 20), ('다', 20.5), ('라', 32)]
        no = [k for k, v in tr if inr(rng(20), v)]
        assert no == ['다', '라']
        s.text('무게가 20 t을 초과하는 차는 지나갈 수 없는 다리가 있어요. 가 트럭 19.8 t, 나 트럭 20 t, 다 트럭 20.5 t, 라 트럭 32 t이에요.')
        s.ask('다리를 지나갈 수 없는 트럭을 모두 쓰세요.', blank=True)
        s.ask('다리를 지나갈 수 있는 트럭을 모두 쓰세요.', blank=True)
        ans = '3차시  ① 탈 수 있어요: 예린·도겸, %s (125 cm보다 커야 하는데 125 cm는 같아요)   ② 125에 ○, 오른쪽으로 선   ③ %s, 72에 ○, 왼쪽으로 선   ④ 초과, 미만, 71·○   ⑤ %s, 다·라, 가·나' % (
            a1[0], m3, m5)
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '수학익힘 — 초과와 미만')
        s.text('42 미만인 수에 모두 ○표 해 보세요.')
        m6 = marks(s, [41.5, 57, 42, 36, 42.9], [('○', rng(hi=42))])
        s.text('14.6 미만인 수를 그림에 나타내 보세요. (작은 눈금 한 칸은 0.1이에요.)')
        numline(s, 'tb3e', 14, 15, step=0.1, lab=1, mid=0.5)
        bag = [('가', 11.9), ('나', 18.1), ('다', 12), ('라', 13.7)]
        pay = [k for k, v in bag if inr(rng(12), v)]
        assert pay == ['나', '라']
        s.text('비행기 수하물 무게가 12 kg을 초과하면 추가 요금을 내야 해요. 가 11.9 kg, 나 18.1 kg, 다 12 kg, 라 13.7 kg 중 추가 요금을 내야 하는 수하물은?')
        s.ask('추가 요금을 내야 하는 수하물', blank=True)
        s.picture(fig('cards358', svg_cards([3, 5, 8])), width_mm=50)
        nums = make3([3, 5, 8])
        b1 = max(v for v in nums if v < 600)
        b2 = min(v for v in nums if v > 700)
        assert (b1, b2) == (583, 835)
        a6 = qa(s, [('수 카드 3, 5, 8로 만든 600 미만인 수 중에서 가장 큰 수', b1), ('700 초과인 수 중에서 가장 작은 수', b2)])
        why(s, '700 초과인 수 중에서 가장 작은 수를 어떻게 찾았는지 써 보세요.', 1)
        ans += '   ⑥ %s, 14.6에 ○·왼쪽으로 선, %s, %s' % (m6, '·'.join(pay), ', '.join(a6))
    return ans


DUST = [('좋음', '0 이상 15 이하', rng(0, True, 15, True)), ('보통', '16 이상 35 이하', rng(16, True, 35, True)),
        ('나쁨', '36 이상 75 이하', rng(36, True, 75, True)), ('매우 나쁨', '76 이상', rng(76, True))]
TYPE = [('1급', rng(350)), ('2급', rng(250, False, 350, True)), ('3급', rng(150, False, 250, True)), ('4급', rng(hi=150, hiInc=True))]


def tb4(s, lv):
    s.lesson(4, '개념 구축하기(O)', '수의 범위를 활용하여 문제를 해결해 볼까요', '이상, 이하, 초과, 미만을 함께 사용하여 수의 범위를 어떻게 나타낼 수 있을까요?')
    s.scene(None, '축제가 열린 날 오후 2시에 축제 장소의 초미세 먼지 농도는 25 마이크로그램이에요.')
    if lv == '기본형':
        step(s, 0, '초미세 먼지 등급', '25 마이크로그램은 어느 등급?')
        s.table([['등급', '초미세 먼지 농도(마이크로그램)']] + [[a, b] for a, b, _ in DUST], col_mm=[50, 130])
        s.text('(출처: 에어코리아, 2024) 마이크로그램은 무게의 단위 중 하나로, 1 마이크로그램은 1 g의 백만분의 1이에요.')
        g = [a for a, _, r in DUST if inr(r, 25)]
        assert g == ['보통']
        s.choices([('25 마이크로그램은', opt('좋음', '보통', '나쁨', '매우 나쁨') + ' 등급')])
        s.text('‘보통’ 등급의 범위(16 이상 35 이하인 수)를 수직선에 나타내 보세요.' + (' (16과 35에 ●, 두 점 사이에 선)' if lv == '기본형' else ''))
        numline(s, 'tb4a', 10, 40, lab=10, mid=5)
        step(s, 1, '여러 가지 범위', '16과 35로 만든 범위')
        for i, (t, key) in enumerate([('16 이상 35 미만인 수', 'tb4b'), ('16 초과 35 이하인 수', 'tb4c'), ('16 초과 35 미만인 수', 'tb4d')]):
            s.text('%s %s' % (NUM[i], t))
            numline(s, key, 10, 40, lab=10, mid=5, width=140)
        step(s, 2, '타자 급수', '아윤이네 모둠의 타자 수')
        s.table([['급수', '타자 수(타)']] + [[a, rname(r)[:-3]] for a, r in TYPE], col_mm=[50, 130])
        st = [('아윤', 285), ('준수', 246), ('민성', 350), ('지현', 237)]
        lev = [[a for a, r in TYPE if inr(r, v)] for _, v in st]
        assert all(len(x) == 1 for x in lev)
        lev = [x[0] for x in lev]
        assert lev == ['2급', '3급', '2급', '3급']
        s.choices([('%s %d타' % (k, v), opt(*[a for a, _ in TYPE])) for k, v in st])
        s.text('2급의 범위(250 초과 350 이하인 수)를 수직선에 나타내 보세요. (큰 눈금 100, 중간 눈금 50, 작은 눈금 10)')
        numline(s, 'tb4e', 100, 400, step=10, lab=100, mid=50)
        step(s, 3, '약속하기', '그림을 보고 범위 읽기')
        O = [rng(16, True, 35, True), rng(16, True, 35), rng(16, False, 35, True), rng(16, False, 35)]
        show = [O[3], O[0], O[2], O[1]]
        for i, r in enumerate(show):
            numline(s, 'tb4r%d' % i, 10, 40, lab=10, mid=5, r=r, width=135, tag=SYM[i])
        if lv == '기본형':
            s.wordbox([rname(r) for r in O])
        s.table([['그림', '수의 범위']] + [[SYM[i], '(                                      )'] for i in range(4)], col_mm=[30, 150])
        a4 = ', '.join('%s %s' % (SYM[i], rname(r)) for i, r in enumerate(show))
        step(s, 4, '확인하기', '마을버스 요금과 우리 주변의 수의 범위')
        s.text('“우리 지역에서 6세 이상 13세 미만인 어린이의 마을버스 요금은 400원이야.” 400원을 내는 나이에 모두 ○표 해 보세요.')
        m5 = marks(s, [5, 6, 9, 12, 13, 15], [('○', rng(6, True, 13))], unit='세')
        s.ask('우리 주변에서 수의 범위를 활용하는 상황을 ‘이상’, ‘이하’, ‘초과’, ‘미만’ 중에서 2개를 사용하여 써 보세요.', blank=False)
        if lv == '기본형':
            s.fill('(        )세 이상 (        )세 미만은 ______________________________ 입니다.')
        else:
            s.lines(2)
        ans = '4차시  ① 보통, 16과 35에 ●·사이에 선   ② (1) 16에 ●·35에 ○  (2) 16에 ○·35에 ●  (3) 16과 35에 ○ (모두 두 점 사이에 선)   ③ %s, 250에 ○·350에 ●   ④ %s   ⑤ %s, (예) 8세 이상 19세 미만은 박물관 입장료가 2000원입니다.' % (
            ', '.join('%s %s' % (k, l) for (k, _), l in zip(st, lev)), a4, m5)
    else:  # 도전형
        PM = [('좋음', '0 이상 30 이하', rng(0, True, 30, True)), ('보통', '31 이상 80 이하', rng(31, True, 80, True)),
              ('나쁨', '81 이상 150 이하', rng(81, True, 150, True)), ('매우 나쁨', '151 이상', rng(151, True))]
        step(s, 0, '초미세 먼지 등급', '미세 먼지 농도로 등급 찾기')
        s.text('이번에는 미세 먼지 농도(마이크로그램)의 등급표예요. (출처: 에어코리아, 2024)')
        s.table([['등급', '미세 먼지 농도(마이크로그램)']] + [[a, b] for a, b, _ in PM], col_mm=[50, 130])
        vals = [80, 81, 30, 151]
        g = [[a for a, _, r in PM if inr(r, v)][0] for v in vals]
        assert g == ['보통', '나쁨', '좋음', '매우 나쁨']
        s.choices([('농도 %d 마이크로그램' % v, opt('좋음', '보통', '나쁨', '매우 나쁨')) for v in vals])
        s.text('‘나쁨’ 등급의 범위를 수직선에 나타내 보세요.')
        numline(s, 'htb4a', 70, 160, step=10, lab=10)
        step(s, 1, '여러 가지 범위', '81과 150으로 만든 범위')
        for i, (t, key) in enumerate([('81 초과 150 미만인 수', 'htb4b'), ('81 이상 150 미만인 수', 'htb4c'), ('81 초과 150 이하인 수', 'htb4d')]):
            s.text('%s %s' % (NUM[i], t))
            numline(s, key, 70, 160, step=10, lab=10, width=140)
        a2 = qa(s, [('81 초과 150 미만인 자연수의 개수', len([v for v in range(200) if inr(rng(81, False, 150), v)]), '개')])
        assert a2[0] == '68개'
        step(s, 2, '타자 급수', '줄넘기 급수')
        JR = [('1급', rng(150, True)), ('2급', rng(120, True, 150)), ('3급', rng(90, True, 120)), ('4급', rng(hi=90))]
        s.text('※ 이 자료에서 만든 1분 줄넘기 급수표예요.')
        s.table([['급수', '1분 동안 넘은 횟수(회)']] + [[a, rname(r)[:-3]] for a, r in JR], col_mm=[50, 130])
        st = [('연우', 150), ('하람', 149), ('지성', 120), ('소이', 90), ('태리', 89)]
        lev = [[a for a, r in JR if inr(r, v)][0] for _, v in st]
        assert lev == ['1급', '2급', '2급', '3급', '4급']
        s.choices([('%s %d회' % (k, v), opt(*[a for a, _ in JR])) for k, v in st])
        s.text('2급의 범위를 수직선에 나타내 보세요.')
        numline(s, 'htb4e', 80, 170, step=10, lab=10)
        step(s, 3, '약속하기', '그림을 보고 범위 읽기')
        O = [rng(81, True, 150, True), rng(81, True, 150), rng(81, False, 150, True), rng(81, False, 150)]
        show = [O[2], O[3], O[1], O[0]]
        for i, r in enumerate(show):
            numline(s, 'htb4r%d' % i, 70, 160, step=10, lab=10, r=r, width=135, tag=SYM[i])
        s.table([['그림', '그림이 나타내는 수의 범위']] + [[SYM[i], ''] for i in range(4)], col_mm=[30, 150])
        a4 = ', '.join('%s %s' % (SYM[i], rname(r)) for i, r in enumerate(show))
        step(s, 4, '확인하기', '박물관 입장료와 우리 주변의 수의 범위')
        s.text('“우리 지역 박물관은 7세 이상 19세 미만이면 청소년 요금을 내요.” 청소년 요금을 내는 나이에 모두 ○표 해 보세요.')
        m5 = marks(s, [6, 7, 12, 18, 19, 25], [('○', rng(7, True, 19))], unit='세')
        assert m5 == '○ 7세, 12세, 18세'
        a5 = qa(s, [('청소년 요금을 내는 나이는 모두 몇 가지', len([a for a in range(100) if inr(rng(7, True, 19), a)]), '가지')])
        s.ask('우리 주변에서 ‘초과’와 ‘이하’를 함께 사용하는 상황을 하나 만들어 쓰고, 그 범위에 드는 자연수를 세 개 써 보세요.', blank=False)
        s.lines(2)
        ans = '4차시  ① %s, 81과 150에 ●·사이에 선   ② (1) 81과 150에 ○  (2) 81에 ●·150에 ○  (3) 81에 ○·150에 ● (모두 두 점 사이에 선), %s   ③ %s, 120에 ●·150에 ○   ④ %s   ⑤ %s, %s, (예) 5 kg 초과 10 kg 이하인 짐은 7000원이에요. — 6, 8, 10' % (
            ', '.join('%d %s' % (v, x) for v, x in zip(vals, g)), a2[0], ', '.join('%s %s' % (k, l) for (k, _), l in zip(st, lev)), a4, m5, a5[0])
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '수학익힘 — 수의 범위 활용')
        mail = [('5 g 이하', rng(hi=5, hiInc=True), 400), ('5 g 초과 25 g 이하', rng(5, False, 25, True), 430), ('25 g 초과 50 g 이하', rng(25, False, 50, True), 450)]
        s.table([['무게', '우편 요금']] + [[a, '%d원' % f] for a, _, f in mail], col_mm=[90, 90])
        p38 = [f for _, r, f in mail if inr(r, 38)]
        assert p38 == [450]
        a6 = qa(s, [('무게가 38 g인 편지의 우편 요금 (출처: 우정사업본부, 2024)', p38[0], '원')])
        s.text('38 g이 속하는 무게의 범위를 수직선에 나타내 보세요.')
        numline(s, 'tb4f', 5, 50, step=5, lab=5)
        s.text('남학생 씨름 체급표의 일부: 경장급 40 kg 이하, 소장급 40 kg 초과 45 kg 이하, …, 청장급 50 kg 초과 55 kg 이하 (출처: 대한씨름협회, 2024)')
        kk = [('지환', 52), ('민찬', 55), ('도준', 46), ('재영', 39)]
        cj = [k for k, v in kk if inr(rng(50, False, 55, True), v)]
        assert cj == ['지환', '민찬']
        s.ask('지환 52 kg, 민찬 55 kg, 도준 46 kg, 재영 39 kg 중에서 청장급에 속하는 학생', blank=True)
        cnt = [v for v in [51.8, 54, 57, 60, 53.2] if inr(rng(53, True, 57, True), v)]
        assert len(cnt) == 3
        a7 = qa(s, [('51.8, 54, 57, 60, 53.2 중에서 53 이상 57 이하인 수의 개수', len(cnt), '개')])
        opts = [rng(74, True, 78), rng(74, True, 79), rng(75, True, 79)]
        good = [rname(r) for r in opts if all(inr(r, v) for v in range(74, 79))]
        assert good == ['74 이상 79 미만인 수']
        s.choices([('74, 75, 76, 77, 78이 모두 속하는 범위', opt(*[rname(r) for r in opts]))])
        cand = [R(a) + R(b) / 10 for a in range(0, 10) for b in range(0, 10) if inr(rng(5, False, 9), a) and inr(rng(3, True, 8), b)]
        pw = min(cand)
        assert pw == R('6.3')
        s.text('보물 상자 비밀번호: 자연수 부분은 5 초과 9 미만이고, 소수 첫째 자리 숫자는 3 이상 8 미만인 소수 한 자리 수 중에서 가장 작은 수예요.')
        a8 = qa(s, [('비밀번호', pw)])
        why(s, '비밀번호의 자연수 부분을 5로 하지 않은 까닭을 써 보세요.', 1)
        ans += '   ⑥ %s, 25에 ○·50에 ●, %s, %s, %s, %s (5 초과에는 5가 들어가지 않아요)' % (a6[0], '·'.join(cj), a7[0], good[0], a8[0])
    return ans


def tb5(s, lv):
    s.lesson(5, '개념 구축하기(O)', '올림을 알아볼까요', '호두과자 243개를 상자로 살 때 최소로 사야 하는 호두과자의 수를 어떻게 구할 수 있을까요?')
    s.scene(None, '호두과자 판매장에서 다른 반 선생님이 호두과자 243개를 사서 학생들에게 나누어 주려고 해요. 호두과자는 10개씩 담은 상자와 100개씩 담은 상자로 팔아요.')
    if lv == '기본형':
        step(s, 0, '상자 수 정하기', '최소로 사야 하는 상자')
        s.text('10개씩 담은 상자로 사요. 상자 수에 따라 호두과자가 모두 몇 개인지 쓰고, 243개를 모두 살 수 있는지 골라 보세요.')
        b1, n1, o1 = pack(s, lv, 243, 10, 'ceil', '10개씩 담은 상자', '개', [24, 25], '243개를 모두 살 수 있나요?')
        s.text('100개씩 담은 상자로 사요.')
        b2, n2, o2 = pack(s, lv, 243, 100, 'ceil', '100개씩 담은 상자', '개', [2, 3], '243개를 모두 살 수 있나요?')
        assert (n1, n2) == (250, 300)
        a1 = qa(s, [('10개씩 담은 상자로 산다면 최소', n1, '개'), ('100개씩 담은 상자로 산다면 최소', n2, '개')])
        step(s, 1, '숫자로 살펴보기', '243 올림하기')
        a2 = digits(s, lv, [('', '243', '올림', 1, ''), ('', '243', '올림', 2, '')])
        step(s, 2, '음식값 내기', '10000원짜리 지폐로만')
        s.text('음식점에서 12500원인 음식을 10000원짜리 지폐로만 계산하려고 해요.')
        b3, n3, o3 = pack(s, lv, 12500, 10000, 'ceil', '10000원짜리 지폐', '원', [1, 2], '음식값을 모두 낼 수 있나요?')
        a3 = digits(s, lv, [('', '12500', '올림', 4, '원')])
        a3b = qa(s, [('내야 하는 지폐 수', b3, '장')])
        step(s, 3, '약속하기', '올림')
        s.fill(['구하려는 자리의 아래 수를 %s 나타내는 방법을 %s이라고 합니다.' % (ch(lv, ['올려서', '버려서'], 8), ch(lv, ['올림', '버림', '반올림'], 8)),
                '올림하여 나타낸 수는 원래 수와 같거나 %s.' % ch(lv, ['커요', '작아요'], 8)])
        step(s, 4, '확인하기', '소수 올림과 잘못 어림한 친구')
        assert fmt(rnd('5.146', '올림', -1)) == '5.2' and fmt(rnd('5.146', '올림', -2)) == '5.15'
        s.text('보기: 5.146을 올림하여 소수 첫째 자리까지 나타내면 5.2, 소수 둘째 자리까지 나타내면 5.15예요.')
        a5 = digits(s, lv, [('', '2.378', '올림', -1, ''), ('', '2.378', '올림', -2, '')])
        s.text('주아(1572 g): “내가 모은 우유갑의 무게를 올림하여 백의 자리까지 나타내면 1600 g이야.”  은찬(1248 g): “나는 1200 g이야.”')
        assert rnd(1572, '올림', 2) == 1600 and rnd(1248, '올림', 2) != 1200
        s.choices([('잘못 어림한 사람', opt('주아', '은찬'))])
        a5b = qa(s, [('바르게 고친 무게', rnd(1248, '올림', 2), ' g')])
        ans = '5차시  ① 24상자 240개 아니요·25상자 250개 예, 2상자 200개 아니요·3상자 300개 예, %s   ② %s   ③ 1장 10000원 아니요·2장 20000원 예, %s, %s   ④ 올려서, 올림, 커요   ⑤ %s, 은찬, %s' % (
            ' / '.join(a1), ' / '.join(a2), a3[0], a3b[0], ' / '.join(a5), a5b[0])
    else:  # 도전형
        step(s, 0, '상자 수 정하기', '최소로 사야 하는 상자')
        s.text('축제 손님에게 나누어 줄 사과 1365개를 사려고 해요. 사과는 10개들이 상자와 100개들이 상자로만 팔아요.')
        b1, n1, o1 = pack(s, lv, 1365, 10, 'ceil', '10개들이 상자', '개', [136, 137], '1365개를 모두 살 수 있나요?')
        b2, n2, o2 = pack(s, lv, 1365, 100, 'ceil', '100개들이 상자', '개', [13, 14], '1365개를 모두 살 수 있나요?')
        assert (n1, n2) == (1370, 1400)
        a1 = qa(s, [('10개들이 상자로 산다면 사과는 최소', n1, '개'), ('100개들이 상자로 산다면 남는 사과는', n2 - 1365, '개')])
        step(s, 1, '숫자로 살펴보기', '1365 올림하기')
        a2 = digits(s, lv, [('', '1365', '올림', 1, ''), ('', '1365', '올림', 2, ''), ('', '1365', '올림', 3, '')])
        step(s, 2, '음식값 내기', '10000원짜리 지폐로만')
        s.text('가족 식사비 47300원을 10000원짜리 지폐로만 내려고 해요.')
        b3, n3, o3 = pack(s, lv, 47300, 10000, 'ceil', '10000원짜리 지폐', '원', [4, 5], '식사비를 모두 낼 수 있나요?')
        a3 = digits(s, lv, [('', '47300', '올림', 4, '원')])
        a3b = qa(s, [('내야 하는 지폐 수', b3, '장'), ('받는 거스름돈', n3 - 47300, '원')])
        step(s, 3, '약속하기', '올림')
        s.fill(['구하려는 자리의 아래 수를 (          ) 나타내는 방법을 (          )이라고 합니다.',
                '올림하여 나타낸 수는 원래 수와 같거나 (          ).'])
        lo = min(v for v in range(1, 1000) if rnd(v, '올림', 2) == 600)
        assert lo == 501
        a4 = qa(s, [('올림하여 백의 자리까지 나타내면 600이 되는 자연수 중에서 가장 작은 수', lo), ('그중에서 가장 큰 수', 600)])
        step(s, 4, '확인하기', '소수 올림과 잘못 어림한 친구')
        a5 = digits(s, lv, [('', '4.603', '올림', -1, ''), ('', '4.603', '올림', -2, '')])
        kids = [('지안', 3008, 3100), ('태오', 4500, 4500), ('윤서', 2901, 2900)]
        bad = [k for k, n, v in kids if rnd(n, '올림', 2) != v]
        assert bad == ['윤서']
        s.text('세 친구가 올림하여 백의 자리까지 나타냈어요. 지안: 3008 → 3100  태오: 4500 → 4500  윤서: 2901 → 2900')
        s.choices([('잘못 어림한 사람', opt('지안', '태오', '윤서'))])
        a5b = qa(s, [('바르게 고친 수', rnd(2901, '올림', 2))])
        why(s, '태오가 4500을 올림해도 4500 그대로인 까닭을 써 보세요.', 1)
        ans = '5차시  ① 136상자 1360개 아니요·137상자 1370개 예, 13상자 1300개 아니요·14상자 1400개 예, %s   ② %s   ③ 4장 40000원 아니요·5장 50000원 예, %s, %s   ④ 올려서, 올림, 커요, %s   ⑤ %s, 윤서, %s (아래 수가 0이라 올릴 것이 없어요)' % (
            ' / '.join(a1), ' / '.join(a2), a3[0], ' / '.join(a3b), ' / '.join(a4), ' / '.join(a5), a5b[0])
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '수학익힘 — 올림')
        a6 = qa(s, [('298을 올림하여 십의 자리까지', rnd(298, '올림', 1)), ('36.51을 올림하여 소수 첫째 자리까지', rnd('36.51', '올림', -1))])
        cs = [729, 845, 720, 697, 713]
        two = [c for c in cs if (rnd(c, '올림', 1) // 10) % 10 == 2]
        assert two == [720, 713]
        s.ask('올림하여 십의 자리까지 나타내면 십의 자리 숫자가 2가 되는 수를 모두 고르세요: 729, 845, 720, 697, 713', blank=True)
        ppl = [('은결', 5202, 2), ('소민', 5419, 1), ('슬아', 5100, 3)]
        vv = [rnd(n, '올림', p) for _, n, p in ppl]
        assert vv == [5300, 5420, 6000]
        s.text('은결: 5202를 올림하여 백의 자리까지 / 소민: 5419를 올림하여 십의 자리까지 / 슬아: 5100을 올림하여 천의 자리까지')
        s.choices([('나타낸 수가 가장 작은 사람', opt('은결', '소민', '슬아'))])
        dd = [d for d in range(10) if rnd(4508 + d * 10, '올림', 1) == 4530]
        assert dd == [2]
        a7 = qa(s, [('45□8을 올림하여 십의 자리까지 나타내면 4530일 때 □', dd[0]),
                    ('탁구공 1425개를 100개씩 담는 상자에만 담을 때, 담아야 하는 탁구공은 최소', rnd(1425, '올림', 2), '개'),
                    ('필요한 상자는 최소', rnd(1425, '올림', 2) // 100, '상자')])
        why(s, '탁구공 상자를 14상자만 사면 안 되는 까닭을 써 보세요.', 1)
        ans += '   ⑥ %s, 720·713, 은결(5300·5420·6000), %s' % (' / '.join(a6), ' / '.join(a7))
    return ans


def tb6(s, lv):
    s.lesson(6, '개념 구축하기(O)', '버림을 알아볼까요', '스티커 228개를 기념품으로 바꿀 때 최대로 사용할 수 있는 스티커의 수를 어떻게 구할 수 있을까요?')
    s.scene(None, '축제에서 모은 스티커가 228개예요. 안내 직원: “스티커 10개는 사과주스 1병으로 바꿀 수 있고, 스티커 100개는 모자 1개로 바꿀 수 있어요.”')
    if lv == '기본형':
        step(s, 0, '기념품으로 바꾸기', '최대로 사용할 수 있는 스티커')
        b1, n1, o1 = pack(s, lv, 228, 10, 'floor', '사과주스', '개', [22, 23], '스티커로 바꿀 수 있나요?')
        b2, n2, o2 = pack(s, lv, 228, 100, 'floor', '모자', '개', [2, 3], '스티커로 바꿀 수 있나요?')
        assert (n1, n2) == (220, 200)
        a1 = qa(s, [('사과주스로 바꿀 때 최대로 사용할 수 있는 스티커', n1, '개'), ('모자로 바꿀 때 최대로 사용할 수 있는 스티커', n2, '개')])
        step(s, 1, '숫자로 살펴보기', '228 버림하기')
        a2 = digits(s, lv, [('', '228', '버림', 1, ''), ('', '228', '버림', 2, '')])
        step(s, 2, '공책 사기', '1000원짜리 공책')
        s.text('문구점에서 23140원으로 1000원짜리 공책을 사려고 해요.')
        b3, n3, o3 = pack(s, lv, 23140, 1000, 'floor', '공책', '원', [23, 24], '가진 돈으로 살 수 있나요?')
        a3 = digits(s, lv, [('', '23140', '버림', 3, '원')])
        step(s, 3, '약속하기', '버림')
        s.fill(['구하려는 자리의 아래 수를 %s 나타내는 방법을 %s이라고 합니다.' % (ch(lv, ['올려서', '버려서'], 8), ch(lv, ['올림', '버림', '반올림'], 8)),
                '버림하여 나타낸 수는 원래 수와 같거나 %s. 올림은 ‘최소’, 버림은 %s를 구할 때 쓸 수 있어요.' % (ch(lv, ['커요', '작아요'], 8), ch(lv, ['‘최소’', '‘최대’'], 8))])
        step(s, 4, '확인하기', '과일 무게와 여행 가방 비밀번호')
        assert fmt(rnd('214.357', '버림', -1)) == '214.3'
        s.text('사과 214.357 g을 버림하여 소수 첫째 자리까지 나타내면 214.3 g이에요.')
        a5 = digits(s, lv, [('사과 ', '214.357', '버림', -2, 'g'), ('배 ', '520.413', '버림', -1, 'g')])
        pw = [v for v in range(1000) if rnd(v, '버림', 1) == 420 and v % 10 == 1]
        assert pw == [421]
        s.picture(fig('lock', svg_lock()), width_mm=60)
        s.text('“비밀번호를 버림하여 십의 자리까지 나타내면 420이야.” “비밀번호의 일의 자리 숫자는 1이야.”')
        if lv == '기본형':
            s.text('버림하여 십의 자리까지 나타내면 420이 되는 수는 (      )부터 (      )까지예요.')
        a5b = qa(s, [('여행 가방의 비밀번호', pw[0])])
        ans = '6차시  ① 22병 220개 예·23병 230개 아니요, 2개 200개 예·3개 300개 아니요, %s   ② %s   ③ 23권 23000원 예·24권 24000원 아니요, %s, 최대 23000원   ④ 버려서, 버림, 작아요, ‘최대’   ⑤ %s, %s%s' % (
            ' / '.join(a1), ' / '.join(a2), a3[0], ' / '.join(a5), a5b[0], ' (420부터 429까지)' if lv == '기본형' else '')
    else:  # 도전형
        step(s, 0, '기념품으로 바꾸기', '최대로 사용할 수 있는 쿠폰')
        s.text('축제 쿠폰 3075장을 모았어요. 쿠폰 10장은 음료 1잔으로, 쿠폰 100장은 티셔츠 1장으로 바꿀 수 있어요.')
        b1, n1, o1 = pack(s, lv, 3075, 10, 'floor', '음료', '장', [307, 308], '쿠폰으로 바꿀 수 있나요?')
        b2, n2, o2 = pack(s, lv, 3075, 100, 'floor', '티셔츠', '장', [30, 31], '쿠폰으로 바꿀 수 있나요?')
        assert (n1, n2) == (3070, 3000)
        a1 = qa(s, [('음료로 바꿀 때 남는 쿠폰', 3075 - n1, '장'), ('티셔츠로 바꿀 때 남는 쿠폰', 3075 - n2, '장')])
        step(s, 1, '숫자로 살펴보기', '3075 버림하기')
        a2 = digits(s, lv, [('', '3075', '버림', 1, ''), ('', '3075', '버림', 2, ''), ('', '3075', '버림', 3, '')])
        step(s, 2, '공책 사기', '10000원짜리 책')
        s.text('서점에서 45900원으로 10000원짜리 책을 사려고 해요.')
        b3, n3, o3 = pack(s, lv, 45900, 10000, 'floor', '책', '원', [4, 5], '가진 돈으로 살 수 있나요?')
        a3 = digits(s, lv, [('', '45900', '버림', 4, '원')])
        a3b = qa(s, [('살 수 있는 책은 최대', b3, '권'), ('남는 돈', 45900 - n3, '원')])
        step(s, 3, '약속하기', '버림')
        s.fill(['구하려는 자리의 아래 수를 (          ) 나타내는 방법을 (          )이라고 합니다.',
                '버림하여 나타낸 수는 원래 수와 같거나 (          ).'])
        hi = max(v for v in range(1000) if rnd(v, '버림', 1) == 380)
        assert hi == 389
        a4 = qa(s, [('버림하여 십의 자리까지 나타내면 380이 되는 자연수 중에서 가장 큰 수', hi)])
        step(s, 4, '확인하기', '과일 무게와 여행 가방 비밀번호')
        a5 = digits(s, lv, [('참외 ', '412.648', '버림', -1, 'g'), ('참외 ', '412.648', '버림', -2, 'g'), ('자두 ', '70.759', '버림', 0, 'g')])
        pw = [v for v in range(1000) if rnd(v, '버림', 2) == 700 and (v // 10) % 10 == 5 and v % 10 == 8]
        assert pw == [758]
        s.picture(fig('lock', svg_lock()), width_mm=60)
        s.text('“비밀번호를 버림하여 백의 자리까지 나타내면 700이야.” “십의 자리 숫자는 5이고, 일의 자리 숫자는 십의 자리 숫자보다 3 커.”')
        a5b = qa(s, [('여행 가방의 비밀번호', pw[0])])
        ans = '6차시  ① 307잔 3070장 예·308잔 3080장 아니요, 30장 3000장 예·31장 3100장 아니요, %s   ② %s   ③ 4권 40000원 예·5권 50000원 아니요, %s, %s   ④ 버려서, 버림, 작아요, %s   ⑤ %s, %s' % (
            ' / '.join(a1), ' / '.join(a2), a3[0], ' / '.join(a3b), a4[0], ' / '.join(a5), a5b[0])
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '수학익힘 — 버림')
        a6 = qa(s, [('239를 버림하여 십의 자리까지', rnd(239, '버림', 1)), ('7.914를 버림하여 소수 둘째 자리까지', rnd('7.914', '버림', -2))])
        c17 = [v for v in [1812, 1708, 1790, 1656] if rnd(v, '버림', 2) == 1700]
        assert c17 == [1708, 1790]
        s.ask('버림하여 백의 자리까지 나타내면 1700이 되는 수를 모두 고르세요: 1812, 1708, 1790, 1656', blank=True)
        tri = [('㉠', '2.615'), ('㉡', '2.738'), ('㉢', '2.609')]
        tv = [rnd(v, '버림', -1) for _, v in tri]
        odd = [k for (k, _), v in zip(tri, tv) if tv.count(v) == 1]
        assert odd == ['㉡']
        s.ask('버림하여 소수 첫째 자리까지 나타낸 수가 다른 하나: ㉠ 2.615  ㉡ 2.738  ㉢ 2.609', blank=True)
        sm = rnd(3718, '버림', 3) + rnd(2194, '버림', 1)
        assert sm == 5190
        egg = rnd(1846, '버림', 1)
        sm2 = [v for v in range(126, 133) if rnd(v, '버림', 1) == 130]
        a7 = qa(s, [('승아는 3718을 버림하여 천의 자리까지, 영호는 2194를 버림하여 십의 자리까지 나타냈어요. 두 수의 합', sm),
                    ('달걀 1846개를 10개씩 포장할 때 팔 수 있는 달걀은 최대', egg, '개'), ('팔 수 있는 상자는 최대', egg // 10, '상자'),
                    ('125 초과 132 이하인 자연수 중에서 버림하여 십의 자리까지 나타내면 130이 되는 가장 작은 수', min(sm2))])
        why(s, '달걀을 185상자까지 팔 수 없는 까닭을 써 보세요.', 1)
        ans += '   ⑥ %s, 1708·1790, ㉡, %s' % (' / '.join(a6), ' / '.join(a7))
    return ans


def tb7(s, lv):
    s.lesson(7, '개념 구축하기(O)', '반올림을 알아볼까요', '축제에 방문한 사람 3482명을 어떻게 어림할 수 있을까요?')
    s.scene(None, '축제에 방문한 사람은 3482명이에요. 롤러코스터 수직선에 3482를 ↓로 나타내고, 공이 어느 쪽 골짜기로 굴러갈지 생각해 봐요. 공은 꼭대기에서 더 가까운 쪽으로 굴러가요.')
    if lv == '기본형':
        step(s, 0, '롤러코스터 수직선', '3482는 어느 쪽에 더 가까울까요?')
        s.text('① 3480과 3490 사이의 수직선 (눈금 한 칸: 1)')
        s.picture(fig('co1', svg_coaster(3480, 3490, 1)), width_mm=130)
        s.text('② 3400과 3500 사이의 수직선 (눈금 한 칸: 10)')
        s.picture(fig('co2', svg_coaster(3400, 3500, 10)), width_mm=130)
        c1, c2 = rnd(3482, '반올림', 1), rnd(3482, '반올림', 2)
        assert (c1, c2) == (3480, 3500) and abs(3482 - c1) < abs(3482 - 3490) and abs(3482 - c2) < abs(3482 - 3400)
        a1 = qa(s, [('방문한 사람 수를 십의 자리까지 어림하면', c1, '명'), ('백의 자리까지 어림하면', c2, '명')])
        step(s, 1, '자리 숫자 살펴보기', '3482 반올림하기')
        a2 = digits(s, lv, [('', '3482', '반올림', 1, ''), ('', '3482', '반올림', 2, '')])
        step(s, 2, '야구장의 넓이', '26331 m²')
        a3 = digits(s, lv, [('야구장 ', '26331', '반올림', 3, 'm²'), ('야구장 ', '26331', '반올림', 4, 'm²')])
        step(s, 3, '약속하기', '반올림')
        s.fill('구하려는 자리 바로 아래 자리의 숫자가 0, 1, 2, 3, 4이면 %s, 5, 6, 7, 8, 9이면 %s 나타내는 방법을 %s이라고 합니다.' % (
            ch(lv, ['버리고', '올리고'], 8), ch(lv, ['버려서', '올려서'], 8), ch(lv, ['올림', '버림', '반올림'], 8)))
        a4 = qa(s, [('롤러코스터 꼭대기에 있는 3485를 반올림하여 십의 자리까지', rnd(3485, '반올림', 1))])
        step(s, 4, '확인하기', '소수 반올림과 독도')
        assert fmt(rnd('7.936', '반올림', -1)) == '7.9' and fmt(rnd('7.936', '반올림', -2)) == '7.94'
        s.text('보기: 7.936을 반올림하여 소수 첫째 자리까지 나타내면 7.9, 소수 둘째 자리까지 나타내면 7.94예요.')
        a5 = digits(s, lv, [('', '6.253', '반올림', -1, ''), ('', '6.253', '반올림', -2, '')])
        s.picture(fig('dokdo', svg_dokdo()), width_mm=120)
        s.text('독도에 대해 조사하여 그린 그림이에요. (출처: 외교부 독도, 2024)')
        a5b = qa(s, [('독도의 전체 넓이를 반올림하여 만의 자리까지', rnd(187554, '반올림', 4), ' m²'),
                     ('서도의 높이를 반올림하여 일의 자리까지', rnd('168.5', '반올림', 0), ' m'), ('동도의 높이를 반올림하여 일의 자리까지', rnd('98.6', '반올림', 0), ' m')])
        ans = '7차시  ① (1) 3480에서 2칸(3480 쪽 골짜기)  (2) 3480과 3490 사이(3500 쪽 골짜기), %s   ② %s   ③ %s   ④ 버리고, 올려서, 반올림, %s   ⑤ %s, %s' % (
            ' / '.join(a1), ' / '.join(a2), ' / '.join(a3), a4[0], ' / '.join(a5), ' / '.join(a5b))
    else:  # 도전형
        step(s, 0, '롤러코스터 수직선', '5716은 어느 쪽에 더 가까울까요?')
        s.text('어제 축제에 방문한 사람은 5716명이에요. 5716을 ↓로 나타내고 공이 굴러갈 골짜기를 찾아보세요.')
        s.text('① 5710과 5720 사이의 수직선 (눈금 한 칸: 1)')
        s.picture(fig('hco1', svg_coaster(5710, 5720, 1)), width_mm=130)
        s.text('② 5700과 5800 사이의 수직선 (눈금 한 칸: 10)')
        s.picture(fig('hco2', svg_coaster(5700, 5800, 10)), width_mm=130)
        c1, c2 = rnd(5716, '반올림', 1), rnd(5716, '반올림', 2)
        assert (c1, c2) == (5720, 5700)
        a1 = qa(s, [('어제 방문한 사람 수를 십의 자리까지 어림하면', c1, '명'), ('백의 자리까지 어림하면', c2, '명')])
        step(s, 1, '자리 숫자 살펴보기', '5716 반올림하기')
        a2 = digits(s, lv, [('', '5716', '반올림', 1, ''), ('', '5716', '반올림', 2, ''), ('', '5716', '반올림', 3, '')])
        step(s, 2, '야구장의 넓이', '경기장 84952 m²')
        a3 = digits(s, lv, [('경기장 ', '84952', '반올림', 2, 'm²'), ('경기장 ', '84952', '반올림', 3, 'm²'), ('경기장 ', '84952', '반올림', 4, 'm²')])
        step(s, 3, '약속하기', '반올림')
        s.fill('구하려는 자리 바로 아래 자리의 숫자가 (                  )이면 버리고, (                  )이면 올려서 나타내는 방법을 (          )이라고 합니다.')
        lo = min(v for v in range(10000) if rnd(v, '반올림', 2) == 5700)
        hi = max(v for v in range(10000) if rnd(v, '반올림', 2) == 5700)
        assert (lo, hi) == (5650, 5749)
        a4 = qa(s, [('롤러코스터 꼭대기에 있는 5750을 반올림하여 백의 자리까지', rnd(5750, '반올림', 2)),
                    ('반올림하여 백의 자리까지 나타내면 5700이 되는 자연수 중 가장 작은 수와 가장 큰 수', '%d, %d' % (lo, hi))])
        step(s, 4, '확인하기', '소수 반올림과 운동장')
        a5 = digits(s, lv, [('', '9.465', '반올림', 0, ''), ('', '9.465', '반올림', -1, ''), ('', '9.465', '반올림', -2, '')])
        s.text('※ 이 자료에서 만든 문제예요. 우리 학교 운동장 한 바퀴는 412.6 m이고, 운동장의 넓이는 6835 m²예요.')
        a5b = qa(s, [('운동장 한 바퀴를 반올림하여 일의 자리까지', rnd('412.6', '반올림', 0), ' m'),
                     ('운동장 넓이를 반올림하여 백의 자리까지', rnd(6835, '반올림', 2), ' m²'), ('운동장 넓이를 반올림하여 천의 자리까지', rnd(6835, '반올림', 3), ' m²')])
        ans = '7차시  ① (1) 5716은 5720 쪽 골짜기  (2) 5716은 5700 쪽 골짜기, %s   ② %s   ③ %s   ④ 0, 1, 2, 3, 4 / 5, 6, 7, 8, 9 / 반올림, %s   ⑤ %s, %s' % (
            ' / '.join(a1), ' / '.join(a2), ' / '.join(a3), ' / '.join(a4), ' / '.join(a5), ' / '.join(a5b))
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '수학익힘 — 반올림')
        no = [v for v in [2477, 2484, 2486, 2479] if rnd(v, '반올림', 1) != 2480]
        assert no == [2486]
        a6 = qa(s, [('4056을 반올림하여 천의 자리까지', rnd(4056, '반올림', 3)), ('13.458을 반올림하여 소수 첫째 자리까지', rnd('13.458', '반올림', -1)),
                    ('2477, 2484, 2486, 2479 중에서 반올림하여 십의 자리까지 나타낸 수가 2480이 아닌 수', no[0]),
                    ('학교까지의 거리 284 m를 반올림하여 백의 자리까지', rnd(284, '반올림', 2), ' m')])
        g = [rnd('6.253', '반올림', 0), rnd('6.174', '반올림', -1), rnd('6.319', '반올림', -2)]
        assert g[0] < g[1] < g[2]
        a7 = qa(s, [('㉠ 6.253을 반올림하여 일의 자리까지', g[0]), ('㉡ 6.174를 반올림하여 소수 첫째 자리까지', g[1]),
                    ('㉢ 6.319를 반올림하여 소수 둘째 자리까지', g[2])])
        s.ask('작은 수부터 차례대로 기호를 쓰세요.', blank=True)
        tot = 214985 + 189863
        a8 = qa(s, [('남자 관람객 214985명, 여자 관람객 189863명일 때 전체 관람객', tot, '명'), ('전체 관람객을 반올림하여 만의 자리까지', rnd(tot, '반올림', 4), '명')])
        why(s, '404848을 반올림하여 만의 자리까지 나타낼 때 410000이 아닌 까닭을 써 보세요.', 1)
        ans += '   ⑥ %s, %s, ㉠ ㉡ ㉢, %s' % (' / '.join(a6), ' / '.join(a7), ' / '.join(a8))
    return ans


def tb8(s, lv):
    s.lesson(8, '개념 구축하기(O)', '올림, 버림, 반올림을 활용하여 문제를 해결해 볼까요', '실생활 상황에 알맞은 어림 방법은 어떻게 고를까요?')
    s.scene(None, '사과파이 판매점: “사과파이 485개를 한 상자에 10개씩 담아 판매하고 있어요.” “그럼 사과파이를 최대 몇 상자까지 판매할 수 있나요?”')
    if lv == '기본형':
        step(s, 0, '사과파이 상자', '10개보다 적은 사과파이는?')
        s.choices([('알맞은 어림 방법', opt('올림', '버림', '반올림'))])
        b1, n1, o1 = pack(s, lv, 485, 10, 'floor', '상자', '개', [48, 49], '10개씩 꽉 채울 수 있나요?')
        a1 = qa(s, [('사과파이는 최대 몇 상자까지 판매할 수 있나요?', b1, '상자')])
        step(s, 1, '축제 버스', '124명이 모두 타려면')
        s.text('축제 버스 정류장: “버스를 한 번 운행할 때 10명씩 탈 수 있어요.” 124명이 모두 타려면 버스는 최소 몇 번 운행해야 할까요?')
        s.choices([('알맞은 어림 방법', opt('올림', '버림', '반올림'))])
        b2, n2, o2 = pack(s, lv, 124, 10, 'ceil', '운행 횟수', '명', [12, 13], '124명이 모두 탈 수 있나요?')
        a2 = qa(s, [('버스는 최소 몇 번 운행해야 하나요?', b2, '번')])
        step(s, 2, '버섯 매장 판매액', '반올림하기')
        s.text('버섯 매장: “어제 판매액은 4836200원이었고, 오늘 예상 판매액은 5370000원이에요.”')
        a3 = digits(s, lv, [('어제 ', '4836200', '반올림', 5, '원'), ('오늘 ', '5370000', '반올림', 5, '원'),
                            ('어제 ', '4836200', '반올림', 6, '원'), ('오늘 ', '5370000', '반올림', 6, '원')])
        step(s, 3, '정리하기', '상황에 알맞은 어림 방법')
        cards = [('한 개에 10명까지 앉는 의자에 246명이 모두 앉을 때 필요한 최소 의자 수', 0), ('동전 7300원을 1000원짜리 지폐로 최대 몇 장 바꿀까?', 1),
                 ('발 길이 21.8 cm를 1 cm 단위로 가장 가까운 눈금으로 나타내기', 2), ('복숭아 572개를 10개씩 상자에 담아 최대 몇 개를 팔까?', 1),
                 ('학생 307명에게 1자루씩, 10자루씩 묶음으로 연필을 살 때 최소 몇 자루?', 0), ('줄넘기 459번을 대략 몇 번 했다고 말하기', 2),
                 ('끈 734 cm를 1 m씩 잘라 최대 몇 도막을 만들까?', 1)]
        a4 = sort_cards(s, cards, ['올림', '버림', '반올림'])
        step(s, 4, '확인하기', '바르게 어림했나요?')
        ways = [('올림', 1), ('올림', 2), ('버림', 2), ('반올림', 2), ('반올림', 3)]
        hit = ['%s하여 %s까지' % (m, PL(p)) for m, p in ways if rnd(3159, m, p) == 3200]
        assert hit == ['올림하여 백의 자리까지', '반올림하여 백의 자리까지']
        s.text('3159를 어림하여 3200으로 나타내는 방법을 모두 골라 ○표 해 보세요.')
        s.table([['방법'] + ['%s하여\n%s까지' % (m, PL(p)) for m, p in ways], ['○표'] + [''] * 5], header=True, header_col=True, col_mm=[25, 31, 31, 31, 31, 31], row_h=3402)
        bread = 1800 + 1500
        assert bread == 3300 and rnd(bread, '올림', 3) == 4000
        s.text('1800원인 크림빵과 1500원인 감자빵을 1000원짜리 지폐로만 사려고 해요. 서빈: “반올림하여 3000원을 내야 해.” 하영: “올림하여 4000원을 내야 해.” '
               '영은: “버림하여 3000원을 내야 해.”')
        s.choices([('바르게 말한 사람', opt('서빈', '하영', '영은'))])
        ans = '8차시  ① 버림, 48상자 480개 예·49상자 490개 아니요, %s   ② 올림, 12번 120명 아니요·13번 130명 예, %s   ③ %s   ④ %s   ⑤ %s, 하영(3300원 → 4000원)' % (
            a1[0], a2[0], ' / '.join(a3), a4, ' · '.join(hit))
    else:  # 도전형
        step(s, 0, '사과파이 상자', '10개보다 적게 남은 귤은?')
        s.text('귤 매장: “귤 763개를 한 봉지에 10개씩 담아 팔아요. 10개가 안 되는 귤은 봉지에 담지 않아요.”')
        s.choices([('최대 몇 봉지를 팔 수 있는지 구할 때 알맞은 어림 방법', opt('올림', '버림', '반올림'))])
        b1, n1, o1 = pack(s, lv, 763, 10, 'floor', '봉지', '개', [76, 77], '10개씩 꽉 채울 수 있나요?')
        a1 = qa(s, [('귤은 최대 몇 봉지까지 팔 수 있나요?', b1, '봉지'), ('봉지에 담지 못하는 귤', 763 - n1, '개')])
        step(s, 1, '축제 버스', '238명이 모두 타려면')
        s.text('셔틀버스는 한 번에 10명씩 탈 수 있어요. 238명이 모두 타려면 최소 몇 번 운행해야 할까요?')
        s.choices([('알맞은 어림 방법', opt('올림', '버림', '반올림'))])
        b2, n2, o2 = pack(s, lv, 238, 10, 'ceil', '운행 횟수', '명', [23, 24], '238명이 모두 탈 수 있나요?')
        a2 = qa(s, [('셔틀버스는 최소 몇 번 운행해야 하나요?', b2, '번'), ('마지막 운행 때 타는 사람', 238 - 230, '명')])
        step(s, 2, '버섯 매장 판매액', '반올림하기')
        s.text('딸기 매장: “지난주 판매액은 7351900원, 이번 주 판매액은 6849000원이에요.”')
        a3 = digits(s, lv, [('지난주 ', '7351900', '반올림', 5, '원'), ('이번 주 ', '6849000', '반올림', 5, '원'),
                            ('지난주 ', '7351900', '반올림', 6, '원'), ('이번 주 ', '6849000', '반올림', 6, '원')])
        step(s, 3, '정리하기', '상황에 알맞은 어림 방법')
        cards = [('엘리베이터에 10명씩 타고 83명이 모두 올라가려면 최소 몇 번?', 0), ('동전 5640원을 1000원짜리 지폐로 최대 몇 장 바꿀까?', 1),
                 ('몸무게 38.6 kg을 1 kg 단위로 가까운 쪽으로 말하기', 2), ('색종이 415장을 100장씩 묶으면 최대 몇 묶음?', 1),
                 ('학생 196명에게 공책을 10권 묶음으로 사서 1권씩 줄 때 최소 몇 권?', 0), ('경기장 관중 28417명을 약 몇만 명이라고 말하기', 2),
                 ('리본 925 cm를 1 m씩 잘라 최대 몇 개를 만들까?', 1)]
        a4 = sort_cards(s, cards, ['올림', '버림', '반올림'])
        step(s, 4, '확인하기', '바르게 어림했나요?')
        ways = [(m, p) for m in ('올림', '버림', '반올림') for p in (1, 2, 3) if rnd(6450, m, p) == 6500]
        assert ways == [('올림', 2), ('반올림', 2)]
        s.text('6450을 어림하여 6500으로 나타내는 방법을 두 가지 써 보세요.')
        s.ask('방법 1: (          )하여 (          )까지        방법 2: (          )하여 (          )까지', blank=False)
        snack = 2700 + 1600
        assert rnd(snack, '올림', 3) == 5000
        s.text('2700원인 과자와 1600원인 음료를 1000원짜리 지폐로만 사려고 해요.')
        a5 = qa(s, [('최소로 내야 하는 돈', rnd(snack, '올림', 3), '원'), ('받는 거스름돈', rnd(snack, '올림', 3) - snack, '원')])
        ans = '8차시  ① 버림, 76봉지 760개 예·77봉지 770개 아니요, %s   ② 올림, 23번 230명 아니요·24번 240명 예, %s   ③ %s   ④ %s   ⑤ 올림하여 백의 자리까지·반올림하여 백의 자리까지, %s' % (
            ' / '.join(a1), ' / '.join(a2), ' / '.join(a3), a4, ' / '.join(a5))
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '수학익힘 — 알맞은 어림 방법')
        a6 = qa(s, [('동전 7300원을 1000원짜리 지폐로 바꿀 때 (올림 / 버림 / 반올림)하여 생각한 돈', rnd(7300, '버림', 3), '원'),
                    ('바꿀 수 있는 지폐는 최대', rnd(7300, '버림', 3) // 1000, '장'),
                    ('10명까지 앉는 긴 의자에 246명이 모두 앉을 때 필요한 의자는 최소', rnd(246, '올림', 1) // 10, '개')])
        assert rnd('21.8', '반올림', 0) == 22 and rnd(572, '버림', 1) == 570 and rnd(734, '버림', 2) // 100 == 7
        s.text('도하: 발 길이 21.8 cm를 1 cm 단위로 가장 가까운 눈금을 읽어 22 cm / 준기: 복숭아 572개를 10개씩 담아 570개 / 하림: 끈 734 cm를 1 m씩 잘라 7개')
        s.choices([('어림하는 방법이 다른 사람', opt('도하', '준기', '하림'))])
        why(s, '그 사람이 쓴 어림 방법과 다른 두 사람이 쓴 어림 방법을 써 보세요.', 1)
        ans += '   ⑥ 버림 %s, 도하(반올림, 준기·하림은 버림)' % ' / '.join(a6)
    return ans


def tb9(s, lv):
    s.lesson(9, '탐구 정리하기(O)', '생각을 더하다 ― 택배 요금은 얼마일까요', '상자의 무게와 크기가 속하는 수의 범위를 이용하여 택배 요금을 구할 수 있을까요?')
    s.scene(None, '수학+경제: 택배 요금은 상자의 무게와 크기에 따라 정해지고, 무게에 따른 요금과 크기에 따른 요금이 다른 경우 더 높은 요금으로 정해져요. '
                  '(출처: 찾기쉬운 생활법령정보, 2024)')
    if lv == '기본형':
        step(s, 0, '요금표 살펴보기', '무게 3 kg, 크기 50 cm인 상자')
        fee_table(s)
        assert FEE[fee_row(0, 3)][2] == 7000 and FEE[fee_row(1, 50)][2] == 6000 and fee(3, 50) == 7000
        a1 = qa(s, [('무게 3 kg에 따른 요금', 7000, '원'), ('크기 50 cm에 따른 요금', 6000, '원'), ('이 상자의 택배 요금', fee(3, 50), '원')])
        step(s, 1, '가 상자', '크기는 ㉠ + ㉡ + ㉢')
        s.text('시온이네 반 친구들이 전학 간 친구에게 선물을 보내려고 상자 2개를 준비했어요.')
        t2, f2 = fee_box(s, lv, 'boxga', '가 상자', 5, [27, 24, 20])
        step(s, 2, '나 상자', '두 상자의 요금 더하기')
        t3, f3 = fee_box(s, lv, 'boxna', '나 상자', 12, [30, 32, 28])
        assert (f2, f3) == (7000, 8000)
        a3 = qa(s, [('가 상자 + 나 상자 =', f2 + f3, '원')])
        step(s, 3, '아영이와 동생', '할아버지께 보내는 선물')
        t4, f4 = fee_box(s, lv, 'boxay', '아영이의 상자', 6, [38, 35, 30])
        t5, f5 = fee_box(s, lv, 'boxds', '동생의 상자', 8, [40, 42, 48])
        assert (f4, f5) == (7000, 8000)
        a4 = qa(s, [('두 상자의 택배 요금은 모두', f4 + f5, '원')])
        step(s, 4, '되돌아보기', '경계의 수 살피기')
        s.text('7000원인 무게의 범위(2 kg 초과 10 kg 이하)를 수직선에 나타내 보세요.')
        numline(s, 'tb9a', 0, 12)
        s.fill('택배 요금을 구할 때는 무게가 속하는 범위와 크기가 속하는 범위를 %s 찾고, 두 요금이 다르면 %s 요금으로 정해요.' % (
            ch(lv, ['모두', '하나만'], 8), ch(lv, ['더 높은', '더 낮은'], 8)))
        ans = '9차시  ① %s   ② %s   ③ %s, %s   ④ %s / %s, %s   ⑤ 2에 ○·10에 ●·사이에 선, 모두, 더 높은' % (
            ' / '.join(a1), t2, t3, a3[0], t4, t5, a4[0])
    else:  # 도전형
        step(s, 0, '요금표 살펴보기', '무게 15 kg, 크기 100 cm인 상자')
        fee_table(s)
        assert FEE[fee_row(0, 15)][2] == 8000 and FEE[fee_row(1, 100)][2] == 7000 and fee(15, 100) == 8000
        a1 = qa(s, [('무게 15 kg에 따른 요금', 8000, '원'), ('크기 100 cm에 따른 요금', 7000, '원'), ('이 상자의 택배 요금', fee(15, 100), '원')])
        step(s, 1, '가 상자', '크기는 ㉠ + ㉡ + ㉢')
        s.text('시온이네 반은 가벼운 인형과 큰 그림책을 상자에 담았어요.')
        t2, f2 = fee_box(s, lv, 'hboxga', '가 상자', 1.8, [45, 40, 35])
        step(s, 2, '나 상자', '두 상자의 요금 더하기')
        t3, f3 = fee_box(s, lv, 'hboxna', '나 상자', 21, [40, 30, 25])
        assert (f2, f3) == (7000, 9000)
        a3 = qa(s, [('가 상자 + 나 상자 =', f2 + f3, '원')])
        step(s, 3, '아영이와 동생', '할아버지께 보내는 선물')
        t4, f4 = fee_box(s, lv, 'hboxay', '아영이의 상자', 2, [50, 40, 31])
        t5, f5 = fee_box(s, lv, 'hboxds', '동생의 상자', 20, [60, 50, 45])
        assert (f4, f5) == (8000, 9000)
        a4 = qa(s, [('두 상자의 택배 요금은 모두', f4 + f5, '원')])
        step(s, 4, '되돌아보기', '경계의 수 살피기')
        s.text('크기에 따른 요금이 8000원인 크기의 범위를 수직선에 나타내 보세요.')
        numline(s, 'htb9a', 100, 160, step=10, lab=10)
        a5 = qa(s, [('크기가 140 cm인 상자의 크기 요금', FEE[fee_row(1, 140)][2], '원'), ('크기가 141 cm인 상자의 크기 요금', FEE[fee_row(1, 141)][2], '원')])
        ans = '9차시  ① %s   ② %s   ③ %s, %s   ④ %s / %s, %s   ⑤ 120에 ○·140에 ●·사이에 선, %s' % (
            ' / '.join(a1), t2, t3, a3[0], t4, t5, a4[0], ' / '.join(a5))
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '경계에 있는 수에 주의하기')
        s.text('※ 이 자료에서 만든 문제예요. 경계에 있는 수에 주의하여 택배 요금을 구해 보세요.')
        t6, f6 = fee_box(s, lv, 'boxda', '다 상자', 10, [50, 40, 30])
        t7, f7 = fee_box(s, lv, 'boxra', '라 상자', 2, [60, 41, 40])
        assert (f6, f7) == (7000, 9000)
        why(s, '다 상자의 무게 10 kg이 8000원 칸이 아닌 까닭을 써 보세요.', 1)
        ans += '   ⑥ %s / %s (10 kg은 ‘10 kg 이하’에 들어가요)' % (t6, t7)
    return ans


BOARD = [400, 420, 1230, 2000, 425, 600, 680, 1000, 530, 450, 427, 430, 500, 500]
GAME = [('437', '버림', 2), ('416', '올림', 1), ('1234', '반올림', 1), ('2345', '버림', 3), ('424.6', '반올림', 0), ('512', '올림', 2),
        ('689', '버림', 1), ('1080', '버림', 2), ('521', '올림', 1), ('457', '버림', 1), ('426.1', '올림', 0), ('434', '반올림', 1),
        ('409', '올림', 2), ('549', '반올림', 2)]
assert [rnd(n, m, p) for n, m, p in GAME] == BOARD


def game_table(s, lv, game, board=None):
    rows = [['번호', '문제', '답']]
    for i, (n, m, p) in enumerate(game):
        rows.append([str(i + 1), '%s %s하여 %s까지 나타내면?' % (josa(n, '을를'), m, PL(p)), '(          )'])
    s.table(rows, col_mm=[18, 122, 40], row_h=2835)
    if board and lv == '기본형':
        s.wordbox([fmt(v) for v in board])
    return ', '.join('%d) %s' % (i + 1, fmt(rnd(n, m, p))) for i, (n, m, p) in enumerate(game))


def tb10(s, lv):
    s.lesson(10, '탐구 정리하기(O)', '놀이를 더하다 ― 알쏭달쏭 수를 잡아요', '올림, 버림, 반올림을 이용한 문제를 만들고 답을 찾을 수 있을까요?')
    s.scene(None, '반 전체가 두 모둠으로 나누어 하는 놀이예요. (준비물: 붙임쪽지, 바구니)')
    if lv == '기본형':
        step(s, 0, '놀이 방법 알기', '준비하기 순서')
        items = ['문제를 쓴 붙임쪽지는 접어 바구니에 넣고, 답을 쓴 붙임쪽지는 칠판에 붙여요.', '반 전체를 두 모둠으로 나누고, 붙임쪽지를 한 사람당 2장씩 나누어 가져요.',
                 '모둠에서 문제를 풀 순서를 정해요.', '한 장에는 올림, 버림, 반올림 중 하나를 이용한 문제를, 다른 한 장에는 답을 써요.', '모둠원끼리 문제와 답이 맞는지 확인해요.']
        a1 = order_table(s, items, [1, 3, 4, 0, 2])
        step(s, 1, '문제 만들기', '붙임쪽지 2장')
        s.text('어림할 수와 방법, 나타낼 자리를 정하고 답을 써요. 두 쪽지의 어림 방법은 다르게 해요. 예) 437을 버림하여 백의 자리까지 → 400')
        assert rnd(437, '버림', 2) == 400
        sticky(s)
        step(s, 2, '놀이하기', '칠판의 답 쪽지 찾기')
        s.text('바구니에서 뽑은 문제예요. 칠판에 붙은 답 쪽지(400, 420, 1230, 2000, 425, 600, 680, 1000, 530, 450, 427, 430, 500, 500) 중에서 알맞은 답을 찾아 써 보세요. '
               '(※ 교과서 그림에는 답 쪽지만 있어서 문제는 이 자료에서 만들었어요.)')
        a3 = game_table(s, lv, GAME)
        step(s, 3, '전략 세우기', '헷갈렸던 문제')
        five = [('409', '올림', 2), ('549', '반올림', 2), ('590', '버림', 2), ('550', '반올림', 2), ('451', '버림', 1)]
        hit = [i for i, (n, m, p) in enumerate(five) if rnd(n, m, p) == 500]
        assert hit == [0, 1, 2]
        s.text('칠판에 답 쪽지 500이 2장 있어요. 답이 500인 문제를 모두 골라 ○표 해 보세요.')
        s.table([['문제', '○표']] + [['%s %s하여 %s까지' % (josa(n, '을를'), m, PL(p)), ''] for n, m, p in five], col_mm=[140, 40], row_h=2835)
        a4 = qa(s, [('426.1을 올림하여 일의 자리까지', rnd('426.1', '올림', 0)), ('424.6을 반올림하여 일의 자리까지', rnd('424.6', '반올림', 0))])
        step(s, 4, '돌아보기', '놀이를 하며 생각한 것')
        write_pane(s, lv, [('나의 방법', '______________ 문제는 ______________ 만 보고 먼저 생각했어요.'),
                           ('알게 된 점', '놀이를 하며 ______________________________ 을 알게 되었어요.')])
        ans = '10차시  ① (위에서부터) %s   ② (모둠마다 다름)   ③ %s   ④ 409 올림·549 반올림·590 버림, %s   ⑤ (자유)' % (a1, a3, ' / '.join(a4))
    else:  # 도전형
        step(s, 0, '놀이 방법 알기', '규칙 바르게 알기')
        rules = [('한 사람이 붙임쪽지를 2장씩 나누어 가져요.', '맞아요'), ('두 붙임쪽지의 어림 방법은 같게 해요.', '틀려요'),
                 ('문제를 쓴 쪽지는 칠판에, 답을 쓴 쪽지는 바구니에 넣어요.', '틀려요'), ('모둠원끼리 문제와 답이 맞는지 확인해요.', '맞아요')]
        s.choices([(t, opt('맞아요', '틀려요')) for t, _ in rules])
        a1 = ', '.join(a for _, a in rules)
        why(s, '틀린 규칙 하나를 골라 바르게 고쳐 써 보세요.', 1)
        step(s, 1, '문제 만들기', '답이 500인 문제')
        s.text('답이 500이 되도록 어림할 수를 정해 문제를 만들어 보세요. 세 문제의 어림 방법은 모두 달라야 해요.')
        s.table([['어림 방법', '어림할 수', '나타낼 자리', '답'], ['올림', '', '백의 자리까지', '500'], ['버림', '', '백의 자리까지', '500'], ['반올림', '', '백의 자리까지', '500']],
                col_mm=[35, 55, 50, 40], row_h=3402)
        assert rnd(401, '올림', 2) == 500 and rnd(599, '버림', 2) == 500 and rnd(450, '반올림', 2) == 500 and rnd(549, '반올림', 2) == 500
        step(s, 2, '놀이하기', '뽑은 문제 풀기')
        HG = [('3618', '올림', 2), ('2091', '버림', 1), ('15.48', '반올림', -1), ('7.206', '올림', -2), ('9950', '반올림', 2),
              ('40019', '버림', 3), ('6005', '올림', 3), ('3.95', '반올림', 0), ('84.37', '버림', 0), ('12549', '반올림', 3)]
        a3 = game_table(s, lv, HG)
        step(s, 3, '전략 세우기', '헷갈렸던 문제')
        five = [('2501', '올림', 3), ('3499', '버림', 3), ('2499', '반올림', 3), ('3500', '반올림', 3), ('2950', '반올림', 2)]
        hit = [i for i, (n, m, p) in enumerate(five) if rnd(n, m, p) == 3000]
        assert hit == [0, 1, 4]
        s.text('답 쪽지가 3000인 문제를 모두 골라 ○표 해 보세요.')
        s.table([['문제', '○표']] + [['%s %s하여 %s까지' % (josa(n, '을를'), m, PL(p)), ''] for n, m, p in five], col_mm=[140, 40], row_h=2835)
        lo = min(v for v in range(10000) if rnd(v, '반올림', 3) == 3000)
        hi = max(v for v in range(10000) if rnd(v, '반올림', 3) == 3000)
        a4 = qa(s, [('반올림하여 천의 자리까지 나타내면 3000이 되는 자연수 중 가장 작은 수', lo), ('그중 가장 큰 수', hi)])
        assert (lo, hi) == (2500, 3499)
        step(s, 4, '돌아보기', '놀이를 하며 생각한 것')
        s.ask('친구들이 헷갈릴 만한 문제를 하나 만들고, 왜 헷갈리는지 써 보세요.', blank=False)
        s.lines(2)
        ans = '10차시  ① %s (예: 두 쪽지의 어림 방법은 다르게 해요)   ② (예) 올림 401~500 중 하나, 버림 500~599 중 하나, 반올림 450~549 중 하나   ③ %s   ④ 2501 올림·3499 버림·2950 반올림, %s   ⑤ (자유)' % (
            a1, a3, ' / '.join(a4))
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '또 다른 놀이 — 주사위 어림 놀이')
        s.text('4명이 주사위 2개로 해요. ‘둘레’나 ‘넓이’를 외치며 주사위 2개를 던지고, 두 눈의 수를 직사각형의 가로와 세로로 하여 둘레 또는 넓이를 구한 다음 '
               '반올림하여 십의 자리까지 나타내요. 3번 성공해 보세요.')
        ex = [(4, 6), (3, 5)]
        outs = []
        for a, b in ex:
            ar, pr = a * b, (a + b) * 2
            outs.append('%d·%d: 넓이 %d → %s, 둘레 %d → %s' % (a, b, ar, fmt(rnd(ar, '반올림', 1)), pr, fmt(rnd(pr, '반올림', 1))))
        assert outs[0] == '4·6: 넓이 24 → 20, 둘레 20 → 20'
        a6 = qa(s, [('4와 6을 던져 ‘넓이!’ → 넓이', 24, ' cm²'), ('반올림하여 십의 자리까지', rnd(24, '반올림', 1)),
                    ('3과 5를 던져 ‘둘레!’ → 둘레', 16, ' cm'), ('반올림하여 십의 자리까지', rnd(16, '반올림', 1))])
        dice_record(s)
        why(s, '둘레 25 cm를 반올림하여 십의 자리까지 나타내면 얼마인지, 그 까닭과 함께 써 보세요.', 1)
        ans += '   ⑥ %s, 기록표는 놀이마다 다름, 25 → 30 (일의 자리 숫자 5는 올려요)' % ' / '.join(a6)
    return ans


def tb11(s, lv):
    s.lesson(11, '발표하기(P)', '공부한 내용을 확인해요', '수의 범위와 올림, 버림, 반올림을 이용하여 문제를 해결할 수 있을까요?')
    if lv == '기본형':
        step(s, 0, '이상과 이하', '○표와 △표')
        s.text('46 이상인 수에 모두 ○표, 49 이하인 수에 모두 △표 해 보세요. 두 가지 표를 모두 하는 수도 있어요.')
        m1 = marks(s, [46, 17, 77, 28.5, 49, 80], [('○', rng(46, True)), ('△', rng(hi=49, hiInc=True))])
        assert m1 == '○ 46, 77, 49, 80 / △ 46, 17, 28.5, 49'
        step(s, 1, '범위를 그림에', '수직선에 나타내기')
        s.text('① 32 이상 35 미만인 수')
        numline(s, 'tb11a', 30, 37)
        s.text('② 41.5 초과 43 이하인 수 (41.5는 41과 42 사이 한가운데예요.)')
        numline(s, 'tb11b', 39, 46)
        step(s, 2, '학생 수 어림하기', '백의 자리까지')
        sch = [('하늘 초등학교', 282), ('새싹 초등학교', 308)]
        s.table([['학교', '학생 수(명)', '올림', '버림', '반올림']] + [[a, str(v), '(       )', '(       )', '(       )'] for a, v in sch], col_mm=[48, 33, 33, 33, 33], row_h=3402)
        a3 = ' / '.join('%s %s' % (a, '·'.join(fmt(rnd(v, m, 2)) for m in ('올림', '버림', '반올림'))) for a, v in sch)
        assert a3 == '하늘 초등학교 300·200·300 / 새싹 초등학교 400·300·300'
        step(s, 3, '어림 방법과 범위', '양말 기부와 입장료')
        s.text('가은: “양말 357켤레를 상자 1개에 100켤레씩 담아 기부하려면 최대 몇 켤레까지 담을 수 있을까?”')
        s.choices([('필요한 어림 방법', opt('올림', '버림', '반올림'))])
        a4 = qa(s, [('상자에 담을 수 있는 양말은 최대', rnd(357, '버림', 2), '켤레')])
        tick = [('8세 미만', None, 8, 0), ('8세 이상 14세 미만', 8, 14, 2000), ('14세 이상 20세 미만', 14, 20, 4000), ('20세 이상 65세 미만', 20, 65, 7000), ('65세 이상', 65, None, 0)]
        s.table([['나이', '미술 전시회 입장료']] + [[a, '%d원' % f if f else '무료'] for a, _, _, f in tick], col_mm=[90, 90])
        fam = [('수현', 11), ('아버지', 47), ('어머니', 45), ('동생', 8)]

        def tf(a):
            r = [f for _, lo, hi, f in tick if (lo is None or a >= lo) and (hi is None or a < hi)]
            assert len(r) == 1
            return r[0]
        tot = sum(tf(a) for _, a in fam)
        assert tot == 18000
        items = [('%s %d세의 입장료' % (k, a), tf(a), '원') for k, a in fam] + [('수현이네 가족의 입장료는 모두', tot, '원')]
        a4b = qa(s, items)
        step(s, 4, '확인하고 정리하기', '수의 범위와 어림하기')
        numline(s, 'tb11c', 5, 11, r=rng(6, True, 10, True), width=100)
        numline(s, 'tb11d', 12, 17, r=rng(13, False, 16), width=100)
        s.fill(['위 그림: 6 이상 10 %s인 수' % ch(lv, ['이하', '미만'], 8), '아래 그림: 13 %s 16 미만인 수' % ch(lv, ['이상', '초과'], 8)])
        assert rnd(252, '올림', 1) == 260
        s.text('252를 올림하여 십의 자리까지 나타내면 260이에요.')
        a5 = qa(s, [('417을 버림하여 십의 자리까지', rnd(417, '버림', 1)), ('791을 반올림하여 백의 자리까지', rnd(791, '반올림', 2))])
        ans = '11차시  ① %s   ② (1) 32에 ●·35에 ○  (2) 41.5에 ○·43에 ● (두 점 사이에 선)   ③ %s   ④ 버림, %s, %s   ⑤ 이하, 초과, %s' % (
            m1, a3, a4[0], ' / '.join(a4b), ' / '.join(a5))
    else:  # 도전형
        step(s, 0, '이상과 이하', '○표와 △표')
        s.text('63 이상인 수에 모두 ○표, 67 이하인 수에 모두 △표 해 보세요.')
        m1 = marks(s, [63, 29, 88, 66.5, 67, 70, 62.9], [('○', rng(63, True)), ('△', rng(hi=67, hiInc=True))])
        assert m1 == '○ 63, 88, 66.5, 67, 70 / △ 63, 29, 66.5, 67, 62.9'
        a1 = qa(s, [('○표와 △표를 모두 한 수의 개수', 3, '개')])
        step(s, 1, '범위를 그림에', '수직선에 나타내기')
        s.text('① 58 초과 62 이하인 수')
        numline(s, 'htb11a', 56, 64)
        s.text('② 7.5 이상 9 미만인 수 (작은 눈금 한 칸은 0.5예요.)')
        numline(s, 'htb11b', 6, 10, step=0.5, lab=1)
        step(s, 2, '학생 수 어림하기', '백의 자리까지')
        sch = [('달빛 초등학교', 450), ('은하 초등학교', 1049)]
        s.table([['학교', '학생 수(명)', '올림', '버림', '반올림']] + [[a, str(v), '(       )', '(       )', '(       )'] for a, v in sch], col_mm=[48, 33, 33, 33, 33], row_h=3402)
        a3 = ' / '.join('%s %s' % (a, '·'.join(fmt(rnd(v, m, 2)) for m in ('올림', '버림', '반올림'))) for a, v in sch)
        assert a3 == '달빛 초등학교 500·400·500 / 은하 초등학교 1100·1000·1000'
        step(s, 3, '어림 방법과 범위', '귤 상자와 입장료')
        s.text('귤 2436개를 상자 1개에 100개씩 담아 팔려고 해요. 100개가 안 되는 귤은 팔지 않아요.')
        a4 = qa(s, [('팔 수 있는 귤은 최대', rnd(2436, '버림', 2), '개'), ('팔지 않는 귤', 2436 - rnd(2436, '버림', 2), '개')])
        tick = [('8세 미만', None, 8, 0), ('8세 이상 14세 미만', 8, 14, 2000), ('14세 이상 20세 미만', 14, 20, 4000), ('20세 이상 65세 미만', 20, 65, 7000), ('65세 이상', 65, None, 0)]
        s.table([['나이', '미술 전시회 입장료']] + [[a, '%d원' % f if f else '무료'] for a, _, _, f in tick], col_mm=[90, 90])
        fam = [('민재', 14), ('할아버지', 66), ('누나', 20), ('동생', 8), ('어머니', 44)]

        def tf(a):
            r = [f for _, lo, hi, f in tick if (lo is None or a >= lo) and (hi is None or a < hi)]
            assert len(r) == 1
            return r[0]
        tot = sum(tf(a) for _, a in fam)
        assert tot == 20000
        s.text('민재 14세, 할아버지 66세, 누나 20세, 동생 8세, 어머니 44세가 함께 전시회에 가요.')
        a4b = qa(s, [('입장료를 내지 않는 사람', '할아버지'), ('민재네 가족의 입장료는 모두', tot, '원')])
        step(s, 4, '확인하고 정리하기', '수의 범위와 어림하기')
        numline(s, 'htb11c', 22, 30, r=rng(24, False, 28, True), width=100)
        numline(s, 'htb11d', 38, 47, r=rng(40, True, 45), width=100)
        s.ask('위 그림이 나타내는 수의 범위: (                              )', blank=False)
        s.ask('아래 그림이 나타내는 수의 범위: (                              )', blank=False)
        a5 = qa(s, [('3009를 올림하여 백의 자리까지', rnd(3009, '올림', 2)), ('6950을 반올림하여 백의 자리까지', rnd(6950, '반올림', 2)), ('849를 버림하여 십의 자리까지', rnd(849, '버림', 1))])
        ans = '11차시  ① %s, %s(63·66.5·67)   ② (1) 58에 ○·62에 ●  (2) 7.5에 ●·9에 ○ (두 점 사이에 선)   ③ %s   ④ %s, %s   ⑤ 24 초과 28 이하인 수, 40 이상 45 미만인 수, %s' % (
            m1, a1[0], a3, ' / '.join(a4), ' / '.join(a4b), ' / '.join(a5))
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '수 카드로 세 자리 수 만들기')
        s.picture(fig('cards613', svg_cards([6, 1, 3])), width_mm=50)
        got = [v for v in make3([6, 1, 3]) if rnd(v, '올림', 2) == 200]
        assert got == [136, 163]
        s.text('수 카드 6, 1, 3을 한 번씩 모두 사용하여 세 자리 수를 만들려고 해요.')
        a6 = qa(s, [('올림하여 백의 자리까지 나타내면 200이 되는 수를 모두', L(got)), ('그때 백의 자리 숫자', 1), ('만들 수 있는 수의 개수', len(got), '개')])
        why(s, '올림하여 백의 자리까지 나타내면 200이 되는 세 자리 수는 어떤 범위에 있는지 써 보세요.', 1)
        ans += '   ⑥ %s (101 이상 200 이하인 수)' % ' / '.join(a6)
    return ans


TB = [tb1, tb2, tb3, tb4, tb5, tb6, tb7, tb8, tb9, tb10, tb11]


# ================================================================ 이야기 버전
TRIP = [('매표소', '나이별 입장료\n어린이 15000원'), ('회오리 열차', '키 140 cm\n이상'), ('범퍼카', '키 120 cm\n초과'), ('기념품 가게', '열쇠고리\n10개·100개'),
        ('동전 교환기', '동전 → 지폐'), ('방문자 전광판', '오늘 예상\n2637명'), ('길 안내판', '학교에서\n47.36 km'), ('택배 보내는 곳', '무게·크기\n요금표')]
BADGE = [('금 배지', rng(12000)), ('은 배지', rng(9000, False, 12000, True)), ('동 배지', rng(6000, False, 9000, True)), ('참가 배지', rng(hi=6000, hiInc=True))]


def age_table(s):
    s.table([['구분', '나이', '입장료']] + [[k, age_txt(lo, hi), '%d원' % f if f else '무료'] for k, lo, hi, f in AGE], col_mm=[40, 90, 50])


def st1(s, lv):
    s.lesson(1, '개념 찾기(S)', '현장 체험 학습 준비 회의', '현장 체험 학습을 준비할 때 수의 범위나 어림이 필요한 곳은 어디일까요?')
    s.scene(None, '푸른초등학교 5학년 1반이 별빛 놀이공원으로 현장 체험 학습을 떠나요. 준비 위원장 지호, 돈 관리 담당 서연, 길 안내 담당 도윤, '
                  '질문 대장 하린이가 강 선생님과 함께 준비해요.')
    if lv == '기본형':
        step(s, 0, '만져 보기', '보기 · 생각하기 · 궁금해하기')
        s.picture(fig('stboard', svg_board(['① 놀이 기구마다 탈 수 있는 키 기준 확인하기', '② 나이별 입장료 알아보고 단체 입장권 값 내기', '③ 5학년 136명에게 줄 기념품 열쇠고리 사기',
                                             '④ 모둠 간식비 동전을 지폐로 바꾸기', '⑤ 오늘 예상 방문자 수·학교에서 가는 거리 알아보기', '⑥ 만든 작품과 짐은 학교로 택배 보내기'],
                                            '현장 체험 학습 준비 — 별빛 놀이공원', '준비 위원장 지호가 칠판에 적었어요.')), width_mm=140)
        write_pane(s, lv, [('보여요', '칠판에 ______________________ 이 보여요.'), ('생각해요', '____________ 하려면 ____________ 을 따져야 해요.'),
                           ('궁금해요', '______________________ 은 어떻게 할까?')])
        step(s, 1, '그려 보기', '놀이공원 안내도 둘러보기')
        s.picture(fig('trip', svg_spots('별빛 놀이공원 안내도', TRIP)), width_mm=165)
        a2 = qa(s, [('방문자 전광판에 나온 오늘 예상 방문자', 2637, '명'), ('길 안내판에 나온 학교에서 놀이공원까지의 거리', '47.36', ' km')])
        step(s, 2, '말해 보기', '범위일까, 어림일까')
        cards = [('키 140 cm 이상만 회오리 열차 타기', 0), ('4세 이상 13세 미만은 어린이 입장료', 0), ('대기 시간이 30분 미만인 놀이 기구부터 타기', 0),
                 ('열쇠고리 136개를 10개 묶음으로 최소 몇 묶음 살까?', 1), ('동전 23460원을 1000원짜리 지폐로 최대 얼마까지 바꿀까?', 1),
                 ('예상 방문자 2637명을 약 몇 명이라고 말할까?', 1)]
        a3 = sort_cards(s, cards, ['수의 범위', '어림'])
        thenwhy(s, lv, '‘예상 방문자 2637명을 약 몇 명이라고 말할까?’에 어림이 필요한 까닭은?',
                '방문자 수는 정확한 수가 꼭 ( 필요하고 / 필요하지 않고 ), 약 2600명처럼 대략의 수로 말하면 ( 알기 쉬우므로 / 알기 어려우므로 ) 어림이 필요해요.')
        step(s, 3, '약속하기', '3·4학년 때 배운 것')
        s.text('※ 이 자료에서 만든 문제예요.')
        s.choices([('체험 학습 버스 한 대의 길이는 약', opt('1 m', '11 m', '110 m')), ('내 물병의 들이는 약', opt('50 mL', '500 mL', '50 L'))])
        cmp = [(2637, 2367), (47360, 473600)]
        sg = ['>' if a > b else '<' for a, b in cmp]
        assert sg == ['>', '<']
        if lv == '기본형':
            s.choices([('%d  (   )  %d' % c, opt('>', '<')) for c in cmp])
        else:
            s.ask('2637  (     )  2367          47360  (     )  473600', blank=False)
        step(s, 4, '확인하기', '무엇을 배울까요')
        a5 = order_table(s, SEQ, SEQ_ORDER)
        ans = '1차시  ① (자유)   ② %s   ③ %s, 필요하지 않고·알기 쉬우므로   ④ 11 m, 500 mL, %s   ⑤ (위에서부터) %s' % (' / '.join(a2), a3, ', '.join(sg), a5)
    else:  # 도전형
        step(s, 0, '만져 보기', '보기 · 생각하기 · 궁금해하기')
        s.picture(fig('stboard', svg_board(['① 놀이 기구마다 탈 수 있는 키 기준 확인하기', '② 나이별 입장료 알아보고 단체 입장권 값 내기', '③ 5학년 136명에게 줄 기념품 열쇠고리 사기',
                                             '④ 모둠 간식비 동전을 지폐로 바꾸기', '⑤ 오늘 예상 방문자 수·학교에서 가는 거리 알아보기', '⑥ 만든 작품과 짐은 학교로 택배 보내기'],
                                            '현장 체험 학습 준비 — 별빛 놀이공원', '준비 위원장 지호가 칠판에 적었어요.')), width_mm=140)
        s.ask('칠판의 ①~⑥ 가운데 ‘수의 범위’를 따져야 하는 일의 번호를 모두 쓰세요.', blank=True)
        s.ask('칠판의 ①~⑥ 가운데 ‘어림’이 필요한 일의 번호를 모두 쓰세요.', blank=True)
        why(s, '③을 할 때 무엇을 따져야 하는지 써 보세요.', 1)
        step(s, 1, '그려 보기', '놀이공원 안내도 둘러보기')
        s.picture(fig('trip', svg_spots('별빛 놀이공원 안내도', TRIP)), width_mm=165)
        a2 = qa(s, [('예상 방문자 2637명에서 숫자 6이 나타내는 값', 600), ('거리 47.36 km에서 소수 첫째 자리 숫자', 3),
                    ('회오리 열차와 범퍼카의 키 기준 차이', 140 - 120, ' cm')])
        step(s, 2, '말해 보기', '범위일까, 어림일까')
        cards = [('몸무게 40 kg 이하인 어린이만 미니 바이킹 타기', 0), ('키 100 cm 미만인 어린이는 보호자와 함께 타기', 0), ('13세 이상 19세 미만은 청소년 요금 내기', 0),
                 ('간식 293개를 10개 봉지로 최소 몇 봉지 살까?', 1), ('버스로 간 47.36 km를 약 47 km라고 말하기', 1)]
        a3 = sort_cards(s, cards, ['수의 범위', '어림'])
        thenwhy(s, lv, '열쇠고리 136개를 10개 묶음으로 살 때 버림이 아니라 올림이 필요한 까닭은?', '')
        step(s, 3, '약속하기', '3·4학년 때 배운 것')
        s.text('※ 이 자료에서 만든 문제예요.')
        s.choices([('회전목마가 한 바퀴 도는 데 걸리는 시간은 약', opt('3초', '3분', '3시간')), ('5학년 어린이 한 명의 몸무게는 약', opt('4 kg', '40 kg', '400 kg'))])
        cmp = [(2637, 2673), (473600, 47360)]
        sg = ['>' if a > b else '<' for a, b in cmp]
        assert sg == ['<', '>']
        s.ask('2637  (     )  2673          473600  (     )  47360', blank=False)
        dd = [d for d in range(10) if 2607 + d * 10 < 2637]
        assert dd == [0, 1, 2]
        a4 = qa(s, [('26□7이 2637보다 작을 때 □에 들어갈 수 있는 숫자의 개수', len(dd), '개')])
        step(s, 4, '확인하기', '무엇을 배울까요')
        cards5 = [('키가 140 cm와 같거나 큰 사람만 타기', 0), ('키가 120 cm를 넘어야 혼자 운전하기', 1), ('열쇠고리 136개를 10개 묶음으로 빠짐없이 사기', 2),
                  ('동전을 지폐로 바꾸고 남는 동전은 돌려받기', 3), ('2637명을 가까운 쪽으로 약 2600명이라 하기', 4)]
        a5 = sort_cards(s, cards5, ['이상과 이하', '초과와 미만', '올림', '버림', '반올림'])
        ans = '1차시  ① 범위: ①·②·⑥, 어림: ③·④·⑤, (예) 10개 묶음을 몇 개 사야 136명이 모두 받을 수 있는지   ② %s   ③ %s, (예) 버림하면 열쇠고리가 모자라 못 받는 친구가 생겨요   ④ 3분, 40 kg, %s, %s   ⑤ %s' % (
            ' / '.join(a2), a3, ', '.join(sg), a4[0], a5)
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '하린이가 찾은 수학 이야기')
        s.text('부등호 ‘>’와 ‘<’는 영국의 수학자 오트레드(1574~1660)가 『수학의 열쇠』라는 책에서 처음 사용했다고 해요. 그 뒤 토머스 해리엇(1560~1621)이 지금과 같은 모양을 만들었어요.')
        s.choices([('부등호를 처음 사용한 사람', opt('오트레드', '해리엇')), ('지금과 같은 모양을 만든 사람', opt('오트레드', '해리엇'))])
        g2 = ['>' if R(a) > R(b) else '<' for a, b in [('47.36', '47.306'), ('2637', '2700')]]
        assert g2 == ['>', '<']
        s.ask('47.36  (     )  47.306          2637  (     )  2700', blank=False)
        why(s, '47.36과 47.306의 크기를 어떻게 비교했는지 써 보세요.', 1)
        ans += '   ⑥ 오트레드, 해리엇, %s (47.36은 47.360, 소수 둘째 자리 숫자 6과 0을 비교)' % ', '.join(g2)
    return ans


def st2(s, lv):
    s.lesson(2, '개념 구축하기(O)', '회오리 열차를 탈 수 있을까 ― 이상과 이하', '140과 같거나 큰 수, 5와 같거나 작은 수를 어떻게 나타낼 수 있을까요?')
    s.scene(None, '놀이공원 누리집에 ‘회오리 열차는 키가 140 cm와 같거나 큰 사람만 탈 수 있어요.’라고 적혀 있어요. 하린: “140 cm인 사람은 탈 수 있을까?”')
    if lv == '기본형':
        step(s, 0, '만져 보기', '회오리 열차 키 기준')
        rule_first(s, lv, '140 cm와 키가 같은 사람도 회오리 열차를 탈 수 있을까요?', '내 예상: 140 cm인 사람은 ( 탈 수 있어요 / 탈 수 없어요 ). 왜냐하면 ______________________')
        r140 = rng(140, True)
        ks = [('가', 138), ('나', 140), ('다', 145.5), ('라', 139.9), ('마', 152)]
        s.choices([('%s %s cm' % (k, fmt(v)), opt('탈 수 있어요', '탈 수 없어요')) for k, v in ks])
        ok = [fmt(v) for _, v in ks if inr(r140, v)]
        assert ok == ['140', '145.5', '152']
        a1 = qa(s, [('탈 수 있는 키 중에서 가장 작은 키', 140, ' cm')])
        step(s, 1, '그려 보기', '140과 같거나 큰 수')
        s.text('140과 같거나 큰 수를 수직선에 나타내 보세요.' + (' 140에 ●을 찍고 오른쪽으로 선을 그어요.' if lv == '기본형' else ''))
        numline(s, 'st2a', 138, 143)
        step(s, 2, '말해 보기', '짐 보관함에 넣을 수 있을까')
        s.text('짐 보관함에는 무게가 5 kg과 같거나 가벼운 가방만 넣을 수 있어요. 넣을 수 있는 가방에 ○표 해 보세요.')
        m3 = marks(s, [4.8, 5.3, 5, 3.9, 6.1], [('○', rng(hi=5, hiInc=True))], ['지호', '서연', '도윤', '하린', '민우'], ' kg')
        s.text('5와 같거나 작은 수를 수직선에 나타내 보세요.')
        numline(s, 'st2b', 2, 7)
        thenwhy(s, lv, '무게가 5 kg인 도윤이의 가방도 보관함에 넣을 수 있는 까닭은?',
                '보관함에는 5 kg과 ( 같거나 가벼운 / 같거나 무거운 ) 가방을 넣을 수 있으므로, 5 kg인 가방도 ( 넣을 수 있어요 / 넣을 수 없어요 ).')
        step(s, 3, '약속하기', '이상과 이하')
        numline(s, 'st2c', 138, 143, r=r140, width=110)
        numline(s, 'st2d', 2, 7, r=rng(hi=5, hiInc=True), width=110)
        s.fill(['140, 145.5, 152와 같이 140과 같거나 큰 수를 140 %s인 수라고 합니다.' % ch(lv, ['이상', '이하'], 8),
                '3.9, 4.8, 5와 같이 5와 같거나 작은 수를 5 %s인 수라고 합니다.' % ch(lv, ['이상', '이하'], 8),
                '수직선의 ●은 그 수가 %s 것을 의미해요.' % ch(lv, ['포함된다는', '포함되지 않는다는'], 14)])
        step(s, 4, '확인하기', '이상인 수, 이하인 수')
        s.text('75 이상인 수에 모두 ○표, 60 이하인 수에 모두 △표 해 보세요.')
        m5 = marks(s, [58, 75, 74.9, 81, 60, 66, 60.2], [('○', rng(75, True)), ('△', rng(hi=60, hiInc=True))])
        assert m5 == '○ 75, 81 / △ 58, 60'
        s.picture(fig('sign20', svg_sign(20)), width_mm=32)
        s.text('꼬마 자동차 길의 표지판은 한 시간에 20 km 이하의 빠르기로 달려야 한다는 뜻이에요. 20 이하인 수를 그림에 나타내 보세요.')
        numline(s, 'st2e', 17, 23)
        ans = '2차시  ① (예상) 탈 수 있어요, 탈 수 있어요: 나·다·마, %s   ② 140에 ●, 오른쪽으로 선   ③ %s, 5에 ●·왼쪽으로 선, 같거나 가벼운·넣을 수 있어요   ④ 이상, 이하, 포함된다는   ⑤ %s, 20에 ●·왼쪽으로 선' % (
            a1[0], m3, m5)
    else:  # 도전형
        step(s, 0, '만져 보기', '회오리 열차 키 기준')
        rule_first(s, lv, '키가 139.9 cm인 사람은 회오리 열차를 탈 수 있을까요?', '')
        r140 = rng(140, True)
        ks = [('가', 141), ('나', 139.5), ('다', 140), ('라', 150.2), ('마', 137)]
        s.choices([('%s %s cm' % (k, fmt(v)), opt('탈 수 있어요', '탈 수 없어요')) for k, v in ks])
        ok = [k for k, v in ks if inr(r140, v)]
        assert ok == ['가', '다', '라']
        a1 = qa(s, [('탈 수 있는 사람 수', len(ok), '명'), ('탈 수 없는 사람 중에서 가장 큰 키', max(v for _, v in ks if not inr(r140, v)), ' cm')])
        step(s, 1, '그려 보기', '130과 같거나 큰 수')
        s.text('바이킹은 키가 130 cm와 같거나 큰 사람만 탈 수 있어요. 130과 같거나 큰 수를 수직선에 나타내 보세요.')
        numline(s, 'hst2a', 128, 133)
        step(s, 2, '말해 보기', '작은 보관함에 넣을 수 있을까')
        s.text('작은 보관함에는 무게가 8 kg과 같거나 가벼운 가방만 넣을 수 있어요. 넣을 수 있는 가방에 ○표 해 보세요.')
        m3 = marks(s, [8.1, 7.9, 8, 6.5, 9], [('○', rng(hi=8, hiInc=True))], ['지호', '서연', '도윤', '하린', '민우'], ' kg')
        assert m3 == '○ 7.9 kg, 8 kg, 6.5 kg'
        s.text('8과 같거나 작은 수를 수직선에 나타내 보세요.')
        numline(s, 'hst2b', 5, 10)
        thenwhy(s, lv, '8.1 kg인 지호의 가방은 작은 보관함에 넣을 수 없는 까닭은?', '')
        step(s, 3, '약속하기', '이상과 이하')
        numline(s, 'hst2c', 128, 133, r=rng(130, True), width=110)
        numline(s, 'hst2d', 5, 10, r=rng(hi=8, hiInc=True), width=110)
        s.fill(['130과 같거나 큰 수를 130 (        )인 수라고 합니다.',
                '6.5, 7.9, 8과 같이 8과 같거나 작은 수를 8 (        )인 수라고 합니다.',
                '130 이상인 수에 130이 들어가므로 수직선의 130에는 (    )을 그려요.'])
        step(s, 4, '확인하기', '이상인 수, 이하인 수')
        s.text('48 이상인 수에 모두 ○표, 35 이하인 수에 모두 △표 해 보세요.')
        m5 = marks(s, [35, 48, 47.9, 50, 35.1, 34, 60], [('○', rng(48, True)), ('△', rng(hi=35, hiInc=True))])
        assert m5 == '○ 48, 50, 60 / △ 35, 34'
        s.picture(fig('sign40', svg_sign(40)), width_mm=32)
        s.text('주차장 길의 표지판은 한 시간에 40 km 이하의 빠르기로 달려야 한다는 뜻이에요. 40 이하인 수를 그림에 나타내 보세요.')
        numline(s, 'hst2e', 37, 43)
        a5 = qa(s, [('이 길에서 달릴 수 있는 가장 빠른 빠르기', 40, ' km')])
        ans = '2차시  ① (예상) 탈 수 없어요, 탈 수 있어요: 가·다·라, %s   ② 130에 ●, 오른쪽으로 선   ③ %s, 8에 ●·왼쪽으로 선, (예) 8 kg과 같거나 가벼워야 하는데 8.1 kg은 8 kg보다 무거워요   ④ 이상, 이하, ●   ⑤ %s, 40에 ●·왼쪽으로 선, %s' % (
            ' / '.join(a1), m3, m5, a5[0])
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '이상과 이하 문제')
        s.text('45 이하인 수에 모두 ○표 해 보세요.')
        m6 = marks(s, [47, 44.5, 45, 52.3, 39], [('○', rng(hi=45, hiInc=True))])
        numline(s, 'st2f', 86, 91, r=rng(88, True), width=110)
        s.ask('그림에 나타낸 수의 범위: (        ) (이상 / 이하)인 수', blank=False)
        kk = [('가', '125.0'), ('나', '131.2'), ('다', '124.8'), ('라', '126')]
        g = [k for k, v in kk if inr(rng(hi=125, hiInc=True), v)]
        assert g == ['가', '다']
        s.text('꼬마 기차는 키가 125 cm 이하인 어린이가 보호자와 함께 타야 해요. 가 125.0 cm, 나 131.2 cm, 다 124.8 cm, 라 126 cm예요.')
        a6 = qa(s, [('보호자와 함께 타야 하는 어린이 수', len(g), '명')])
        s.text('지호: “30 이상인 수에는 30도 들어가.”  도윤: “25 이하인 수 중에서 가장 큰 수는 24야.”  하린: “12.5는 12 이상인 수야.”')
        s.choices([('잘못 말한 사람', opt('지호', '도윤', '하린'))])
        why(s, '잘못 말한 것을 바르게 고쳐 써 보세요.', 1)
        ans += '   ⑥ %s, 88 이상, %s(가·다), 도윤 → 25 이하인 수 중에서 가장 큰 수는 25예요' % (m6, a6[0])
    return ans


def st3(s, lv):
    s.lesson(3, '개념 구축하기(O)', '범퍼카를 혼자 운전할 수 있을까 ― 초과와 미만', '120보다 큰 수, 30보다 작은 수를 어떻게 나타낼 수 있을까요?')
    s.scene(None, '범퍼카 안내판: ‘키가 120 cm보다 큰 어린이는 혼자 운전할 수 있어요.’ 하린: “이번에는 ‘같거나’라는 말이 없네?”')
    if lv == '기본형':
        step(s, 0, '만져 보기', '범퍼카 키 기준')
        rule_first(s, lv, '키가 120 cm인 어린이도 범퍼카를 혼자 운전할 수 있을까요?', '내 예상: 120 cm인 어린이는 혼자 운전할 수 ( 있어요 / 없어요 ). 왜냐하면 ______________________')
        r120 = rng(120)
        ks = [('가', 119), ('나', 124.5), ('다', 120), ('라', 120.3), ('마', 131)]
        s.choices([('%s %s cm' % (k, fmt(v)), opt('혼자 운전할 수 있어요', '없어요')) for k, v in ks])
        ok = [k for k, v in ks if inr(r120, v)]
        assert ok == ['나', '라', '마']
        s.choices([('키가 120 cm인 어린이는 범퍼카를 혼자 운전할 수', opt('있어요', '없어요'))])
        step(s, 1, '그려 보기', '120보다 큰 수')
        s.text('120보다 큰 수를 수직선에 나타내 보세요.' + (' 120은 포함되지 않으니 ○을 찍어요.' if lv == '기본형' else ''))
        numline(s, 'st3a', 118, 123)
        step(s, 2, '말해 보기', '대기 시간이 짧은 놀이 기구')
        s.text('도윤: “대기 시간이 30분보다 짧은 놀이 기구부터 타자!” 30분보다 짧은 놀이 기구에 ○표 해 보세요.')
        m3 = marks(s, [45, 18, 30, 27, 33], [('○', rng(hi=30))], ['회오리 열차', '회전목마', '범퍼카', '바이킹', '하늘 자전거'], '분')
        s.text('30보다 작은 수를 수직선에 나타내 보세요.')
        numline(s, 'st3b', 26, 32)
        thenwhy(s, lv, '대기 시간이 30분인 범퍼카를 먼저 타지 않는 까닭은?',
                '30분보다 ( 짧은 / 긴 ) 놀이 기구부터 타기로 했는데, 범퍼카는 30분과 ( 같아서 / 달라서 ) 30분보다 짧지 않아요.')
        step(s, 3, '약속하기', '초과와 미만')
        numline(s, 'st3c', 118, 123, r=r120, width=110)
        numline(s, 'st3d', 26, 32, r=rng(hi=30), width=110)
        s.fill(['120.3, 124.5, 131과 같이 120보다 큰 수를 120 %s인 수라고 합니다.' % ch(lv, ['이상', '초과', '미만'], 8),
                '18, 27과 같이 30보다 작은 수를 30 %s인 수라고 합니다.' % ch(lv, ['이하', '초과', '미만'], 8),
                '수직선의 ○은 그 수가 %s 것을 의미해요.' % ch(lv, ['포함된다는', '포함되지 않는다는'], 14)])
        step(s, 4, '확인하기', '초과인 수, 미만인 수')
        s.text('32.5 초과인 수에 모두 ○표, 18 미만인 수에 모두 △표 해 보세요.')
        m5 = marks(s, [18, 32.6, 17.9, 32.5, 40, 12, 33], [('○', rng(32.5)), ('△', rng(hi=18))])
        assert m5 == '○ 32.6, 40, 33 / △ 17.9, 12'
        el = [('가', 1200), ('나', 1185), ('다', 1230)]
        beep = [k for k, v in el if inr(rng(1200), v)]
        assert beep == ['다']
        s.text('전망대 승강기는 안의 무게가 1200 kg을 초과하면 경고음이 울려요. 가 승강기 1200 kg, 나 승강기 1185 kg, 다 승강기 1230 kg일 때 경고음이 울리는 승강기를 모두 써 보세요.')
        s.ask('경고음이 울리는 승강기', blank=True)
        ans = '3차시  ① (예상) 없어요, 혼자 운전할 수 있어요: 나·라·마, 없어요   ② 120에 ○, 오른쪽으로 선   ③ %s, 30에 ○·왼쪽으로 선, 짧은·같아서   ④ 초과, 미만, 포함되지 않는다는   ⑤ %s, %s 승강기' % (
            m3, m5, '·'.join(beep))
    else:  # 도전형
        step(s, 0, '만져 보기', '범퍼카 키 기준')
        rule_first(s, lv, '키가 120.1 cm인 어린이는 범퍼카를 혼자 운전할 수 있을까요?', '')
        r120 = rng(120)
        ks = [('가', 121), ('나', 120), ('다', 119.9), ('라', 126.4), ('마', 120.5)]
        s.choices([('%s %s cm' % (k, fmt(v)), opt('혼자 운전할 수 있어요', '없어요')) for k, v in ks])
        ok = [k for k, v in ks if inr(r120, v)]
        assert ok == ['가', '라', '마']
        a1 = qa(s, [('혼자 운전할 수 있는 어린이 수', len(ok), '명')])
        step(s, 1, '그려 보기', '25보다 큰 수')
        s.text('회전 그네는 몸무게가 25 kg보다 무거워야 혼자 탈 수 있어요. 25보다 큰 수를 수직선에 나타내 보세요.')
        numline(s, 'hst3a', 23, 28)
        step(s, 2, '말해 보기', '대기 시간이 짧은 놀이 기구')
        s.text('하린: “대기 시간이 45분보다 짧은 놀이 기구만 타자!” 45분보다 짧은 놀이 기구에 ○표 해 보세요.')
        m3 = marks(s, [44, 45, 50, 38, 46], [('○', rng(hi=45))], ['유령의 집', '바이킹', '회오리 열차', '물레방아', '자이로 드롭'], '분')
        assert m3 == '○ 44분, 38분'
        s.text('45보다 작은 수를 수직선에 나타내 보세요.')
        numline(s, 'hst3b', 42, 48)
        thenwhy(s, lv, '대기 시간이 45분인 바이킹은 타지 않는 까닭은?', '')
        step(s, 3, '약속하기', '초과와 미만')
        numline(s, 'hst3c', 23, 28, r=rng(25), width=110)
        numline(s, 'hst3d', 42, 48, r=rng(hi=45), width=110)
        s.fill(['25보다 큰 수를 25 (        )인 수라고 합니다.',
                '38, 44와 같이 45보다 작은 수를 45 (        )인 수라고 합니다.',
                '45 미만인 수에 45는 (              ). 그래서 45에 (    )을 그려요.'])
        step(s, 4, '확인하기', '초과인 수, 미만인 수')
        s.text('15.5 초과인 수에 모두 ○표, 9 미만인 수에 모두 △표 해 보세요.')
        m5 = marks(s, [15.5, 15.6, 9, 8.9, 20, 3, 16], [('○', rng(15.5)), ('△', rng(hi=9))])
        assert m5 == '○ 15.6, 20, 16 / △ 8.9, 3'
        bt = [('가', 298), ('나', 300), ('다', 301.5), ('라', 340)]
        stop = [k for k, v in bt if inr(rng(300), v)]
        assert stop == ['다', '라']
        s.text('호수의 놀이 보트는 탄 사람들의 무게가 300 kg을 초과하면 출발할 수 없어요. 가 보트 298 kg, 나 보트 300 kg, 다 보트 301.5 kg, 라 보트 340 kg이에요.')
        s.ask('출발할 수 없는 보트를 모두 쓰세요.', blank=True)
        ans = '3차시  ① (예상) 있어요, 혼자 운전할 수 있어요: 가·라·마, %s   ② 25에 ○, 오른쪽으로 선   ③ %s, 45에 ○·왼쪽으로 선, (예) 45분보다 짧아야 하는데 45분은 같아요   ④ 초과, 미만, 들어가지 않아요·○   ⑤ %s, 다·라' % (
            a1[0], m3, m5)
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '초과와 미만 문제')
        s.text('26 미만인 수에 모두 ○표 해 보세요.')
        m6 = marks(s, [25.9, 26, 31, 19, 26.4], [('○', rng(hi=26))])
        s.text('8.3 초과인 수를 그림에 나타내 보세요. (작은 눈금 한 칸은 0.1이에요.)')
        numline(s, 'st3e', 8, 9, step=0.1, lab=1, mid=0.5)
        bag = [('가', 9.9), ('나', 10), ('다', 10.4), ('라', 15.2)]
        big = [k for k, v in bag if inr(rng(10), v)]
        assert big == ['다', '라']
        s.text('짐 보관소에서는 짐의 무게가 10 kg을 초과하면 큰 사물함을 써야 해요. 가 9.9 kg, 나 10 kg, 다 10.4 kg, 라 15.2 kg 중 큰 사물함을 써야 하는 짐은?')
        s.ask('큰 사물함을 써야 하는 짐', blank=True)
        s.picture(fig('cards369', svg_cards([3, 6, 9])), width_mm=50)
        nums = make3([3, 6, 9])
        b1, b2 = max(v for v in nums if v < 700), min(v for v in nums if v > 400)
        assert (b1, b2) == (693, 639)
        a6 = qa(s, [('수 카드 3, 6, 9로 만든 700 미만인 수 중에서 가장 큰 수', b1), ('400 초과인 수 중에서 가장 작은 수', b2)])
        why(s, '400 초과인 수 중에서 가장 작은 수의 백의 자리 숫자를 3으로 하지 않은 까닭을 써 보세요.', 1)
        ans += '   ⑥ %s, 8.3에 ○·오른쪽으로 선, %s, %s' % (m6, '·'.join(big), ', '.join(a6))
    return ans


def st4(s, lv):
    s.lesson(4, '개념 구축하기(O)', '입장료와 걷기 배지 ― 수의 범위 활용하기', '이상, 이하, 초과, 미만을 함께 사용하여 수의 범위를 어떻게 나타낼 수 있을까요?')
    s.scene(None, '서연이가 매표소의 나이별 입장료 표를 보며 손님들의 입장료를 알아봐요.')
    if lv == '기본형':
        step(s, 0, '만져 보기', '나이별 입장료')
        age_table(s)
        cs = [('아기', 2), ('동생', 4), ('우리 반 친구', 11), ('중학생', 13), ('대학생 도우미', 19), ('할머니', 65)]
        grp = [AGE[age_row(a)][0] for _, a in cs]
        assert grp == ['무료', '어린이', '어린이', '청소년', '어른', '경로']
        s.choices([('%s %d세' % (k, a), opt(*[g for g, _, _, _ in AGE])) for k, a in cs])
        s.text('어린이 요금의 나이 범위(4 이상 13 미만인 수)를 수직선에 나타내 보세요. (작은 눈금 한 칸은 1이에요.)')
        numline(s, 'st4a', 0, 20, lab=5)
        step(s, 1, '그려 보기', '경곗값이 같은 여러 범위')
        s.text('꼬마 기차, 하늘 자전거, 회전 그네는 모두 110 cm와 130 cm를 기준으로 탈 수 있는 키를 정했어요.')
        for i, (t, key) in enumerate([('꼬마 기차: 110 이상 130 이하인 수', 'st4b'), ('하늘 자전거: 110 초과 130 미만인 수', 'st4c'), ('회전 그네: 110 초과 130 이하인 수', 'st4d')]):
            s.text('%s %s' % (NUM[i], t))
            numline(s, key, 100, 140, lab=10, mid=5, width=140)
        step(s, 2, '말해 보기', '걷기 배지 받기')
        s.table([['배지', '걸음 수(걸음)']] + [[a, rname(r)[:-3]] for a, r in BADGE], col_mm=[50, 130])
        kd = [('지호', 9000), ('서연', 12450), ('도윤', 8760), ('하린', 12000), ('민우', 6000)]
        bd = [[a for a, r in BADGE if inr(r, v)] for _, v in kd]
        assert all(len(x) == 1 for x in bd)
        bd = [x[0] for x in bd]
        assert bd == ['동 배지', '금 배지', '동 배지', '은 배지', '참가 배지']
        s.choices([('%s %d걸음' % (k, v), opt(*[a for a, _ in BADGE])) for k, v in kd])
        s.text('은 배지의 범위(9000 초과 12000 이하인 수)를 수직선에 나타내 보세요. (큰 눈금 1000, 작은 눈금 500)')
        numline(s, 'st4e', 5000, 14000, step=500, lab=1000)
        thenwhy(s, lv, '하린이는 12000걸음을 걸었는데 금 배지가 아니라 은 배지를 받는 까닭은?',
                '금 배지는 12000 ( 초과 / 이상 )라서 12000이 들어가지 않고, 은 배지는 9000 초과 12000 ( 이하 / 미만 )라서 12000이 들어가요.')
        step(s, 3, '약속하기', '두 조건을 모두 만족하는 수')
        O = [rng(110, True, 130, True), rng(110, True, 130), rng(110, False, 130, True), rng(110, False, 130)]
        for i, r in enumerate([O[1], O[2]]):
            numline(s, 'st4r%d' % i, 100, 140, lab=10, mid=5, r=r, width=135, tag=SYM[i])
        if lv == '기본형':
            s.wordbox([rname(r) for r in O])
        s.table([['그림', '수의 범위']] + [[SYM[i], '(                                      )'] for i in range(2)], col_mm=[30, 150])
        s.fill('110 이상 130 이하인 수는 110과 같거나 크고, 130과 같거나 작은 수예요. 두 조건을 %s 수예요.' % ch(lv, ['모두 만족하는', '하나만 만족해도 되는'], 14))
        step(s, 4, '확인하기', '우리 주변의 수의 범위')
        cnt = [v for v in [51.8, 54, 57, 60, 53.2, 56.9] if inr(rng(53, True, 57, True), v)]
        assert len(cnt) == 4
        a5 = qa(s, [('51.8, 54, 57, 60, 53.2, 56.9 중에서 53 이상 57 이하인 수의 개수', len(cnt), '개')])
        s.ask('우리 주변에서 수의 범위를 활용하는 상황을 ‘이상’, ‘이하’, ‘초과’, ‘미만’ 중에서 2개를 사용하여 써 보세요.', blank=False)
        if lv == '기본형':
            s.fill('(        ) 이상 (        ) 미만은 ______________________________ 이에요.')
        else:
            s.lines(2)
        ans = '4차시  ① %s, 4에 ●·13에 ○·사이에 선   ② (1) 110·130에 ●  (2) 110·130에 ○  (3) 110에 ○·130에 ● (모두 두 점 사이에 선)   ③ %s, 9000에 ○·12000에 ●, 초과·이하   ④ ㉠ %s, ㉡ %s, 모두 만족하는   ⑤ %s(54·57·53.2·56.9), (예) 4세 이상 13세 미만은 어린이 입장료 15000원을 내요.' % (
            ', '.join('%s %s' % (k, g) for (k, _), g in zip(cs, grp)), ', '.join('%s %s' % (k, b) for (k, _), b in zip(kd, bd)), rname(O[1]), rname(O[2]), a5[0])
    else:  # 도전형
        step(s, 0, '만져 보기', '나이별 입장료')
        age_table(s)
        cs = [('사촌 동생', 3), ('형', 18), ('삼촌', 64), ('내 친구', 12), ('할아버지', 70), ('선생님', 34)]
        grp = [AGE[age_row(a)][0] for _, a in cs]
        assert grp == ['무료', '청소년', '어른', '어린이', '경로', '어른']
        s.choices([('%s %d세' % (k, a), opt(*[g for g, _, _, _ in AGE])) for k, a in cs])
        s.text('청소년 요금의 나이 범위를 수직선에 나타내 보세요. (작은 눈금 한 칸은 1이에요.)')
        numline(s, 'hst4a', 0, 25, lab=5)
        step(s, 1, '그려 보기', '경곗값이 같은 여러 범위')
        s.text('미니 바이킹, 공중 그네, 꼬마 열차는 모두 100 cm와 140 cm를 기준으로 탈 수 있는 키를 정했어요.')
        for i, (t, key) in enumerate([('미니 바이킹: 100 이상 140 미만인 수', 'hst4b'), ('공중 그네: 100 초과 140 이하인 수', 'hst4c'), ('꼬마 열차: 100 초과 140 미만인 수', 'hst4d')]):
            s.text('%s %s' % (NUM[i], t))
            numline(s, key, 90, 150, lab=10, mid=5, width=140)
        a2 = qa(s, [('키 100 cm인 어린이가 탈 수 있는 것', '미니 바이킹'), ('키 140 cm인 어린이가 탈 수 있는 것', '공중 그네')])
        step(s, 2, '말해 보기', '걷기 배지 받기')
        s.table([['배지', '걸음 수(걸음)']] + [[a, rname(r)[:-3]] for a, r in BADGE], col_mm=[50, 130])
        kd = [('지호', 12001), ('서연', 9000), ('도윤', 6001), ('하린', 5999), ('민우', 9001)]
        bd = [[a for a, r in BADGE if inr(r, v)][0] for _, v in kd]
        assert bd == ['금 배지', '동 배지', '동 배지', '참가 배지', '은 배지']
        s.choices([('%s %d걸음' % (k, v), opt(*[a for a, _ in BADGE])) for k, v in kd])
        s.text('동 배지의 범위를 수직선에 나타내 보세요. (큰 눈금 1000, 작은 눈금 500)')
        numline(s, 'hst4e', 5000, 14000, step=500, lab=1000)
        thenwhy(s, lv, '서연이는 9000걸음을 걸었는데 은 배지가 아니라 동 배지를 받는 까닭은?', '')
        step(s, 3, '약속하기', '두 조건을 모두 만족하는 수')
        O = [rng(100, True, 140, True), rng(100, True, 140), rng(100, False, 140, True), rng(100, False, 140)]
        for i, r in enumerate([O[0], O[3]]):
            numline(s, 'hst4r%d' % i, 90, 150, lab=10, mid=5, r=r, width=135, tag=SYM[i])
        s.table([['그림', '그림이 나타내는 수의 범위']] + [[SYM[i], ''] for i in range(2)], col_mm=[30, 150])
        a4 = qa(s, [('㉡의 범위에 드는 자연수의 개수', len([v for v in range(200) if inr(O[3], v)]), '개')])
        assert a4[0] == '39개'
        step(s, 4, '확인하기', '우리 주변의 수의 범위')
        cnt = [v for v in [12.9, 13, 15.5, 16, 16.1, 14] if inr(rng(13, False, 16, True), v)]
        assert cnt == [15.5, 16, 14]
        a5 = qa(s, [('12.9, 13, 15.5, 16, 16.1, 14 중에서 13 초과 16 이하인 수의 개수', len(cnt), '개')])
        s.ask('‘이상’과 ‘미만’을 함께 사용하여 놀이공원에서 쓸 규칙을 하나 만들어 써 보세요.', blank=False)
        s.lines(2)
        ans = '4차시  ① %s, 13에 ●·19에 ○·사이에 선   ② (1) 100에 ●·140에 ○  (2) 100에 ○·140에 ●  (3) 100·140에 ○ (모두 두 점 사이에 선), %s   ③ %s, 6000에 ○·9000에 ●, (예) 은 배지는 9000 초과라 9000이 들어가지 않아요   ④ ㉠ %s, ㉡ %s, %s   ⑤ %s(15.5·16·14), (자유)' % (
            ', '.join('%s %s' % (k, g) for (k, _), g in zip(cs, grp)), ' / '.join(a2), ', '.join('%s %s' % (k, b) for (k, _), b in zip(kd, bd)), rname(O[0]), rname(O[3]), a4[0], a5[0])
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '수의 범위 활용 문제')
        opts = [rng(61, True, 64), rng(61, True, 65), rng(62, True, 65)]
        good = [rname(r) for r in opts if all(inr(r, v) for v in range(61, 65))]
        assert good == ['61 이상 65 미만인 수']
        s.choices([('61, 62, 63, 64가 모두 속하는 범위', opt(*[rname(r) for r in opts]))])
        s.text('41.5 초과 43 이하인 수를 수직선에 나타내 보세요. (작은 눈금 한 칸은 0.5예요.)')
        numline(s, 'st4f', 39, 46, step=0.5, lab=1)
        cand = [R(a) + R(b) / 10 for a in range(10) for b in range(10) if inr(rng(3, False, 7), a) and inr(rng(2, True, 6), b)]
        pw = max(cand)
        assert pw == R('6.5')
        s.text('사물함 비밀번호 힌트: 자연수 부분은 3 초과 7 미만이고, 소수 첫째 자리 숫자는 2 이상 6 미만인 소수 한 자리 수 중에서 가장 큰 수예요.')
        a6 = qa(s, [('사물함 비밀번호', pw)])
        why(s, '비밀번호를 7.5나 6.6으로 하지 않은 까닭을 써 보세요.', 1)
        ans += '   ⑥ %s, 41.5에 ○·43에 ●, %s (7 미만에는 7이, 6 미만에는 6이 들어가지 않아요)' % (good[0], a6[0])
    return ans


def st5(s, lv):
    s.lesson(5, '개념 구축하기(O)', '기념품 열쇠고리를 사요 ― 올림', '열쇠고리 136개가 필요할 때 묶음으로 최소 몇 개를 사야 할까요?')
    s.scene(None, '체험 학습 기념으로 5학년 학생 136명에게 열쇠고리를 하나씩 나누어 주려고 해요. 기념품 가게에서는 열쇠고리를 10개 묶음과 100개 상자로만 팔아요. '
                  '서연: “최소 몇 개를 사야 모두 받을 수 있을까?”')
    if lv == '기본형':
        step(s, 0, '만져 보기', '열쇠고리 묶음 늘리기')
        rule_first(s, lv, '열쇠고리를 10개 묶음으로만 살 때 최소 몇 개를 사야 할까요?', '내 예상: (        )개, 왜냐하면 ______________________')
        b1, n1, _ = pack(s, lv, 136, 10, 'ceil', '10개 묶음', '개', [13, 14], '136명이 모두 받을 수 있나요?')
        b2, n2, _ = pack(s, lv, 136, 100, 'ceil', '100개 상자', '개', [1, 2], '136명이 모두 받을 수 있나요?')
        assert (n1, n2) == (140, 200)
        a1 = qa(s, [('10개 묶음으로 산다면 최소', n1, '개'), ('100개 상자로 산다면 최소', n2, '개')])
        step(s, 1, '그려 보기', '숫자로 올림하기')
        a2 = digits(s, lv, [('열쇠고리 ', '136', '올림', 1, '개'), ('열쇠고리 ', '136', '올림', 2, '개')])
        step(s, 2, '말해 보기', '단체 입장권 값 내기')
        s.text('단체 입장권 값은 모두 38400원이에요. 강 선생님이 10000원짜리 지폐로만 낸다면 최소 얼마를 내야 할까요?')
        b3, n3, _ = pack(s, lv, 38400, 10000, 'ceil', '10000원짜리 지폐', '원', [3, 4], '입장권 값을 모두 낼 수 있나요?')
        a3 = digits(s, lv, [('입장권 값 ', '38400', '올림', 4, '원')])
        thenwhy(s, lv, '38400원을 낼 때 30000원이 아니라 40000원을 내야 하는 까닭은?',
                '30000원을 내면 (        )원이 모자라요. 만의 자리 아래 수 8400을 ( 10000 / 0 )으로 생각해 올려서 최소 40000원을 내야 해요.')
        step(s, 3, '약속하기', '올림')
        s.fill('구하려는 자리의 %s를 %s 나타내는 방법을 %s이라고 합니다. 올림한 수는 처음 수와 %s.' % (
            ch(lv, ['아래 수', '윗자리 수'], 8), ch(lv, ['올려서', '버려서'], 8), ch(lv, ['올림', '버림', '반올림'], 8), ch(lv, ['같거나 커요', '같거나 작아요'], 10)))
        step(s, 4, '확인하기', '소수 올림과 잘못 어림한 친구')
        s.text('모둠 간식 가방의 무게는 3.472 kg이에요.')
        a5 = digits(s, lv, [('간식 가방 ', '3.472', '올림', -1, 'kg'), ('간식 가방 ', '3.472', '올림', -2, 'kg')])
        assert rnd(2716, '올림', 2) == 2800 and rnd(3105, '올림', 2) == 3200
        s.text('페트병 무게를 올림하여 백의 자리까지 나타냈어요. 도윤: “내가 모은 페트병 2716 g은 약 2800 g이야.” 서연: “내가 모은 페트병 3105 g은 약 3100 g이야.”')
        s.choices([('잘못 어림한 사람', opt('도윤', '서연'))])
        a5b = qa(s, [('바르게 고친 무게', 3200, ' g')])
        ans = '5차시  ① (예상) 140개, 13묶음 130개 아니요·14묶음 140개 예, 1상자 100개 아니요·2상자 200개 예, %s   ② %s   ③ 3장 30000원 아니요·4장 40000원 예, %s, 8400·10000   ④ 아래 수, 올려서, 올림, 같거나 커요   ⑤ %s, 서연, %s' % (
            ' / '.join(a1), ' / '.join(a2), a3[0], ' / '.join(a5), a5b[0])
    else:  # 도전형
        step(s, 0, '만져 보기', '열쇠고리 묶음 늘리기')
        s.text('선생님 7명도 열쇠고리를 받기로 해서 모두 143개가 필요해졌어요.')
        rule_first(s, lv, '143개가 필요할 때 10개 묶음으로 사면 남는 열쇠고리는 몇 개일까요?', '')
        b1, n1, _ = pack(s, lv, 143, 10, 'ceil', '10개 묶음', '개', [14, 15], '143명이 모두 받을 수 있나요?')
        b2, n2, _ = pack(s, lv, 143, 100, 'ceil', '100개 상자', '개', [1, 2], '143명이 모두 받을 수 있나요?')
        assert (n1, n2) == (150, 200)
        a1 = qa(s, [('10개 묶음으로 산다면 최소', n1, '개'), ('그때 남는 열쇠고리', n1 - 143, '개')])
        step(s, 1, '그려 보기', '숫자로 올림하기')
        a2 = digits(s, lv, [('열쇠고리 ', '143', '올림', 1, '개'), ('열쇠고리 ', '1043', '올림', 2, '개'), ('열쇠고리 ', '1043', '올림', 3, '개')])
        step(s, 2, '말해 보기', '저녁 식사비 내기')
        s.text('돌아오는 길에 먹은 저녁 식사비는 52700원이에요. 강 선생님이 10000원짜리 지폐로만 낸다면 최소 얼마를 내야 할까요?')
        b3, n3, _ = pack(s, lv, 52700, 10000, 'ceil', '10000원짜리 지폐', '원', [5, 6], '식사비를 모두 낼 수 있나요?')
        a3 = digits(s, lv, [('식사비 ', '52700', '올림', 4, '원')])
        a3b = qa(s, [('받는 거스름돈', n3 - 52700, '원')])
        thenwhy(s, lv, '52700원을 낼 때 지폐를 5장만 내면 안 되는 까닭은?', '')
        step(s, 3, '약속하기', '올림')
        s.fill('구하려는 자리의 (          )를 (          ) 나타내는 방법을 (          )이라고 합니다. 올림한 수는 처음 수와 (                ).')
        got = [v for v in range(1, 1000) if rnd(v, '올림', 1) == 250]
        assert (min(got), max(got)) == (241, 250)
        a4 = qa(s, [('올림하여 십의 자리까지 나타내면 250이 되는 자연수 중에서 가장 작은 수', min(got)), ('그런 자연수는 모두 몇 개', len(got), '개')])
        step(s, 4, '확인하기', '소수 올림과 잘못 어림한 친구')
        s.text('하린이의 물통과 도시락 무게는 모두 5.207 kg이에요.')
        a5 = digits(s, lv, [('물통과 도시락 ', '5.207', '올림', -1, 'kg'), ('물통과 도시락 ', '5.207', '올림', -2, 'kg')])
        kids = [('도윤', 4001, 4100), ('서연', 6200, 6300), ('하린', 7099, 7100)]
        bad = [k for k, n, v in kids if rnd(n, '올림', 2) != v]
        assert bad == ['서연']
        s.text('올림하여 백의 자리까지 나타냈어요. 도윤: 4001 → 4100  서연: 6200 → 6300  하린: 7099 → 7100')
        s.choices([('잘못 어림한 사람', opt('도윤', '서연', '하린'))])
        a5b = qa(s, [('바르게 고친 수', rnd(6200, '올림', 2))])
        ans = '5차시  ① (예상) 7개, 14묶음 140개 아니요·15묶음 150개 예, 1상자 100개 아니요·2상자 200개 예, %s   ② %s   ③ 5장 50000원 아니요·6장 60000원 예, %s, %s, (예) 50000원은 2700원이 모자라요   ④ 아래 수, 올려서, 올림, 같거나 커요, %s   ⑤ %s, 서연, %s' % (
            ' / '.join(a1), ' / '.join(a2), a3[0], a3b[0], ' / '.join(a4), ' / '.join(a5), a5b[0])
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '올림 문제')
        a6 = qa(s, [('397을 올림하여 십의 자리까지', rnd(397, '올림', 1))])
        cs = [836, 541, 640, 457, 633]
        four = [c for c in cs if (rnd(c, '올림', 1) // 10) % 10 == 4]
        assert four == [836, 640, 633]
        s.ask('올림하여 십의 자리까지 나타내면 십의 자리 숫자가 4가 되는 수를 모두 고르세요: 836, 541, 640, 457, 633', blank=True)
        dd = [d for d in range(10) if rnd(6207 + d * 10, '올림', 1) == 6250]
        assert dd == [4]
        a7 = qa(s, [('62□7을 올림하여 십의 자리까지 나타내면 6250일 때 □', dd[0]),
                    ('생수 1836병을 100병씩 상자에 모두 담을 때 상자로 최소 몇 병을 담을 수 있게 할까요?', rnd(1836, '올림', 2), '병'),
                    ('필요한 상자 수', rnd(1836, '올림', 2) // 100, '상자')])
        why(s, '62□7의 □에 5를 넣으면 안 되는 까닭을 써 보세요.', 1)
        ans += '   ⑥ %s, 836·640·633, %s' % (a6[0], ' / '.join(a7))
    return ans


def st6(s, lv):
    s.lesson(6, '개념 구축하기(O)', '동전을 지폐로 바꿔요 ― 버림', '동전 23460원을 지폐로 바꿀 때 최대 얼마까지 바꿀 수 있을까요?')
    s.scene(None, '서연이네 모둠이 간식비로 모은 동전이 23460원이에요. 놀이공원의 동전 교환기는 동전을 1000원짜리나 10000원짜리 지폐로 바꿔 주고, 남는 동전은 돌려줘요.')
    if lv == '기본형':
        step(s, 0, '만져 보기', '동전을 지폐로')
        rule_first(s, lv, '동전 23460원을 1000원짜리 지폐로 바꾸면 최대 얼마까지 바꿀 수 있을까요?', '내 예상: (          )원, 왜냐하면 ______________________')
        b1, n1, _ = pack(s, lv, 23460, 1000, 'floor', '1000원짜리 지폐', '원', [23, 24], '동전으로 바꿀 수 있나요?')
        b2, n2, _ = pack(s, lv, 23460, 10000, 'floor', '10000원짜리 지폐', '원', [2, 3], '동전으로 바꿀 수 있나요?')
        assert (n1, n2) == (23000, 20000)
        a1 = qa(s, [('1000원짜리 지폐로 최대', n1, '원'), ('그때 남는 동전', 23460 - n1, '원'), ('10000원짜리 지폐로 최대', n2, '원')])
        step(s, 1, '그려 보기', '숫자로 버림하기')
        a2 = digits(s, lv, [('동전 ', '23460', '버림', 3, '원'), ('동전 ', '23460', '버림', 4, '원')])
        step(s, 2, '말해 보기', '젤리 봉지 만들기')
        s.text('간식으로 산 젤리 158개를 10개씩 봉지에 담아 모둠에 나누어 주려고 해요. 10개씩 꽉 찬 봉지는 최대 몇 개 만들 수 있을까요?')
        b3, n3, _ = pack(s, lv, 158, 10, 'floor', '봉지', '개', [15, 16], '10개씩 꽉 채울 수 있나요?')
        a3 = qa(s, [('10개씩 담은 젤리는 최대', n3, '개'), ('158을 버림하여 십의 자리까지', rnd(158, '버림', 1))])
        thenwhy(s, lv, '남은 젤리 8개로 봉지를 하나 더 만들지 않는 까닭은?',
                '10개씩 꽉 채워야 하는데 남은 젤리는 8개라 ( 10개가 안 되므로 / 10개가 넘으므로 ), 일의 자리 수 8을 ( 0 / 10 )으로 생각해 버려요.')
        step(s, 3, '약속하기', '버림')
        s.fill('구하려는 자리의 아래 수를 %s 나타내는 방법을 %s이라고 합니다. 버림한 수는 처음 수와 %s.' % (
            ch(lv, ['올려서', '버려서'], 8), ch(lv, ['올림', '버림', '반올림'], 8), ch(lv, ['같거나 커요', '같거나 작아요'], 10)))
        step(s, 4, '확인하기', '짐 무게와 사물함 비밀번호')
        s.text('도윤이네 모둠 짐의 무게는 4.386 kg이에요.')
        a5 = digits(s, lv, [('짐 ', '4.386', '버림', -1, 'kg'), ('짐 ', '4.386', '버림', -2, 'kg')])
        pw = [v for v in range(1000) if rnd(v, '버림', 1) == 560 and v % 10 == 8]
        assert pw == [568]
        s.picture(fig('lock', svg_lock()), width_mm=60)
        s.text('하린: “사물함 비밀번호를 버림하여 십의 자리까지 나타내면 560이야.” 지호: “비밀번호의 일의 자리 숫자는 8이야.”')
        if lv == '기본형':
            s.text('버림하여 십의 자리까지 나타내면 560이 되는 수는 (      )부터 (      )까지예요.')
        a5b = qa(s, [('사물함 비밀번호', pw[0])])
        ans = '6차시  ① (예상) 23000원, 23장 23000원 예·24장 24000원 아니요, 2장 20000원 예·3장 30000원 아니요, %s   ② %s   ③ 15봉지 150개 예·16봉지 160개 아니요, %s, 10개가 안 되므로·0   ④ 버려서, 버림, 같거나 작아요   ⑤ %s, %s%s' % (
            ' / '.join(a1), ' / '.join(a2), ' / '.join(a3), ' / '.join(a5), a5b[0], ' (560부터 569까지)' if lv == '기본형' else '')
    else:  # 도전형
        step(s, 0, '만져 보기', '동전을 지폐로')
        s.text('도윤이네 모둠도 동전을 모았더니 31780원이에요.')
        rule_first(s, lv, '동전 31780원을 10000원짜리 지폐로 바꾸면 남는 동전은 얼마일까요?', '')
        b1, n1, _ = pack(s, lv, 31780, 1000, 'floor', '1000원짜리 지폐', '원', [31, 32], '동전으로 바꿀 수 있나요?')
        b2, n2, _ = pack(s, lv, 31780, 10000, 'floor', '10000원짜리 지폐', '원', [3, 4], '동전으로 바꿀 수 있나요?')
        assert (n1, n2) == (31000, 30000)
        a1 = qa(s, [('1000원짜리 지폐로 바꿀 때 남는 동전', 31780 - n1, '원'), ('10000원짜리 지폐로 바꿀 때 남는 동전', 31780 - n2, '원')])
        step(s, 1, '그려 보기', '숫자로 버림하기')
        a2 = digits(s, lv, [('동전 ', '31780', '버림', 2, '원'), ('동전 ', '31780', '버림', 3, '원'), ('동전 ', '31780', '버림', 4, '원')])
        step(s, 2, '말해 보기', '사탕 봉지 만들기')
        s.text('사탕 247개를 10개씩 봉지에 꽉 채워 담으려고 해요.')
        b3, n3, _ = pack(s, lv, 247, 10, 'floor', '봉지', '개', [24, 25], '10개씩 꽉 채울 수 있나요?')
        a3 = qa(s, [('봉지에 담은 사탕은 최대', n3, '개'), ('봉지에 담지 못한 사탕', 247 - n3, '개')])
        thenwhy(s, lv, '사탕 봉지 수를 구할 때 올림이 아니라 버림을 쓰는 까닭은?', '')
        step(s, 3, '약속하기', '버림')
        s.fill('구하려는 자리의 아래 수를 (          ) 나타내는 방법을 (          )이라고 합니다. 버림한 수는 처음 수와 (                ).')
        hi = max(v for v in range(10000) if rnd(v, '버림', 2) == 1200)
        assert hi == 1299
        a4 = qa(s, [('버림하여 백의 자리까지 나타내면 1200이 되는 자연수 중에서 가장 큰 수', hi)])
        step(s, 4, '확인하기', '물 무게와 사물함 비밀번호')
        s.text('서연이네 모둠 물병의 무게는 모두 6.159 kg이에요.')
        a5 = digits(s, lv, [('물병 ', '6.159', '버림', -1, 'kg'), ('물병 ', '6.159', '버림', -2, 'kg')])
        pw = [v for v in range(1000) if rnd(v, '버림', 1) == 830 and v % 10 == v // 100 + 1]
        assert pw == [839]
        s.picture(fig('lock', svg_lock()), width_mm=60)
        s.text('하린: “사물함 비밀번호를 버림하여 십의 자리까지 나타내면 830이야.” 지호: “일의 자리 숫자는 백의 자리 숫자보다 1 커.”')
        a5b = qa(s, [('사물함 비밀번호', pw[0])])
        ans = '6차시  ① (예상) 1780원, 31장 31000원 예·32장 32000원 아니요, 3장 30000원 예·4장 40000원 아니요, %s   ② %s   ③ 24봉지 240개 예·25봉지 250개 아니요, %s, (예) 10개씩 꽉 찬 봉지만 만들 수 있어 남는 7개는 버려요   ④ 버려서, 버림, 같거나 작아요, %s   ⑤ %s, %s' % (
            ' / '.join(a1), ' / '.join(a2), ' / '.join(a3), a4[0], ' / '.join(a5), a5b[0])
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '버림 문제')
        a6 = qa(s, [('674를 버림하여 십의 자리까지', rnd(674, '버림', 1))])
        cs = [4591, 4612, 4500, 4499, 4567]
        g = [c for c in cs if rnd(c, '버림', 2) == 4500]
        assert g == [4591, 4500, 4567]
        s.ask('버림하여 백의 자리까지 나타내면 4500이 되는 수를 모두 고르세요: 4591, 4612, 4500, 4499, 4567', blank=True)
        sm = rnd(4826, '버림', 3) + rnd(3157, '버림', 1)
        assert sm == 7150
        a7 = qa(s, [('지호는 4826을 버림하여 천의 자리까지, 하린이는 3157을 버림하여 십의 자리까지 나타냈어요. 두 수의 합', sm),
                    ('기념 엽서 1846장을 10장씩 묶어 팔 때 팔 수 있는 엽서는 최대', rnd(1846, '버림', 1), '장'), ('묶음 수', rnd(1846, '버림', 1) // 10, '묶음')])
        why(s, '4499를 버림하여 백의 자리까지 나타내면 4500이 되지 않는 까닭을 써 보세요.', 1)
        ans += '   ⑥ %s, 4591·4500·4567, %s' % (a6[0], ' / '.join(a7))
    return ans


def st7(s, lv):
    s.lesson(7, '개념 구축하기(O)', '방문자 수와 거리 ― 반올림', '오늘 예상 방문자 2637명을 어떻게 어림하면 실제 수에 가까울까요?')
    s.scene(None, '놀이공원 전광판에 ‘오늘 예상 방문자 2637명’이라고 떠 있어요. 도윤: “2637명을 대략 몇 명이라고 말하면 실제 수에 가까울까?”')
    if lv == '기본형':
        step(s, 0, '만져 보기', '공은 어느 쪽으로 굴러갈까')
        s.text('롤러코스터 수직선에 2637을 ↓로 나타내고, 공이 굴러갈 골짜기에 ○표 해 보세요. 공은 꼭대기에서 더 가까운 쪽으로 굴러가요.')
        s.text('① 2630과 2640 사이의 수직선 (눈금 한 칸: 1)')
        s.picture(fig('sco1', svg_coaster(2630, 2640, 1)), width_mm=130)
        s.text('② 2600과 2700 사이의 수직선 (눈금 한 칸: 10)')
        s.picture(fig('sco2', svg_coaster(2600, 2700, 10)), width_mm=130)
        c1, c2 = rnd(2637, '반올림', 1), rnd(2637, '반올림', 2)
        assert (c1, c2) == (2640, 2600)
        a1 = qa(s, [('십의 자리까지 어림하면', c1, '명'), ('백의 자리까지 어림하면', c2, '명')])
        step(s, 1, '그려 보기', '숫자로 반올림하기')
        a2 = digits(s, lv, [('방문자 ', '2637', '반올림', 1, '명'), ('방문자 ', '2637', '반올림', 2, '명')])
        step(s, 2, '말해 보기', '한가운데 있는 수')
        s.text('하린: “방문자가 2650명이면 2600명과 2700명 중 어느 쪽이라고 할까?” 2650은 롤러코스터의 꼭대기에 있어요. '
               '0부터 9까지 열 개의 숫자 중 0, 1, 2, 3, 4의 다섯 개는 버리고 5, 6, 7, 8, 9의 다섯 개는 올리기로 해요.')
        c3 = rnd(2650, '반올림', 2)
        assert c3 == 2700 and 2650 - 2600 == 2700 - 2650
        a3 = qa(s, [('2650을 반올림하여 백의 자리까지', c3)])
        thenwhy(s, lv, '2650을 반올림하여 백의 자리까지 나타내면 2700이 되는 까닭은?',
                '바로 아래 자리인 ( 십 / 일 )의 자리 숫자가 5이고, 반올림에서는 5, 6, 7, 8, 9이면 ( 올리기로 / 버리기로 ) 했으므로 2700이 돼요.')
        step(s, 3, '약속하기', '반올림')
        s.fill('구하려는 자리 바로 아래 자리의 숫자가 %s이면 버리고, %s이면 올려서 나타내는 방법을 %s이라고 합니다.' % (
            ch(lv, ['0, 1, 2, 3, 4', '5, 6, 7, 8, 9'], 14), ch(lv, ['0, 1, 2, 3, 4', '5, 6, 7, 8, 9'], 14), ch(lv, ['올림', '버림', '반올림'], 8)))
        step(s, 4, '확인하기', '거리와 넓이')
        s.text('길 안내판의 거리 47.36 km와 놀이공원 안내서의 넓이 158462 m²를 반올림해 보세요.')
        a5 = digits(s, lv, [('거리 ', '47.36', '반올림', 0, 'km'), ('거리 ', '47.36', '반올림', -1, 'km'),
                            ('넓이 ', '158462', '반올림', 4, 'm²'), ('넓이 ', '158462', '반올림', 3, 'm²')])
        ans = '7차시  ① (1) 2630에서 7칸(2640 쪽 골짜기)  (2) 2630과 2640 사이(2600 쪽 골짜기), %s   ② %s   ③ %s, 십·올리기로   ④ 0, 1, 2, 3, 4 / 5, 6, 7, 8, 9 / 반올림   ⑤ %s' % (
            ' / '.join(a1), ' / '.join(a2), a3[0], ' / '.join(a5))
    else:  # 도전형
        step(s, 0, '만져 보기', '공은 어느 쪽으로 굴러갈까')
        s.text('어제 방문자는 3176명이었어요. 롤러코스터 수직선에 3176을 ↓로 나타내고, 공이 굴러갈 골짜기에 ○표 해 보세요.')
        s.text('① 3170과 3180 사이의 수직선 (눈금 한 칸: 1)')
        s.picture(fig('hsco1', svg_coaster(3170, 3180, 1)), width_mm=130)
        s.text('② 3100과 3200 사이의 수직선 (눈금 한 칸: 10)')
        s.picture(fig('hsco2', svg_coaster(3100, 3200, 10)), width_mm=130)
        c1, c2 = rnd(3176, '반올림', 1), rnd(3176, '반올림', 2)
        assert (c1, c2) == (3180, 3200)
        a1 = qa(s, [('십의 자리까지 어림하면', c1, '명'), ('백의 자리까지 어림하면', c2, '명')])
        step(s, 1, '그려 보기', '숫자로 반올림하기')
        a2 = digits(s, lv, [('방문자 ', '3176', '반올림', 1, '명'), ('방문자 ', '3176', '반올림', 2, '명'), ('방문자 ', '3176', '반올림', 3, '명')])
        step(s, 2, '말해 보기', '한가운데 있는 수')
        s.text('3150은 3100과 3200의 한가운데에 있어요.')
        a3 = qa(s, [('3150을 반올림하여 백의 자리까지', rnd(3150, '반올림', 2)), ('3249를 반올림하여 백의 자리까지', rnd(3249, '반올림', 2)),
                    ('3250을 반올림하여 백의 자리까지', rnd(3250, '반올림', 2))])
        thenwhy(s, lv, '3249와 3250은 1밖에 차이 나지 않는데 반올림한 수가 다른 까닭은?', '')
        step(s, 3, '약속하기', '반올림')
        s.fill('구하려는 자리 바로 아래 자리의 숫자가 (                  )이면 버리고, (                  )이면 올려서 나타내는 방법을 (          )이라고 합니다.')
        step(s, 4, '확인하기', '거리와 넓이')
        s.text('※ 이 자료에서 만든 수예요. 놀이공원 둘레길은 58.629 km이고, 주차장 넓이는 276381 m²예요.')
        a5 = digits(s, lv, [('둘레길 ', '58.629', '반올림', 0, 'km'), ('둘레길 ', '58.629', '반올림', -1, 'km'), ('둘레길 ', '58.629', '반올림', -2, 'km'),
                            ('주차장 ', '276381', '반올림', 4, 'm²'), ('주차장 ', '276381', '반올림', 3, 'm²')])
        ans = '7차시  ① (1) 3180 쪽 골짜기  (2) 3200 쪽 골짜기, %s   ② %s   ③ %s, (예) 십의 자리 숫자가 4이면 버리고 5이면 올려요   ④ 0, 1, 2, 3, 4 / 5, 6, 7, 8, 9 / 반올림   ⑤ %s' % (
            ' / '.join(a1), ' / '.join(a2), ' / '.join(a3), ' / '.join(a5))
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '반올림 문제')
        no = [v for v in [3566, 3574, 3575, 3569] if rnd(v, '반올림', 1) != 3570]
        assert no == [3575]
        g = [rnd('7.352', '반올림', 0), rnd('7.284', '반올림', -1), rnd('7.315', '반올림', -2)]
        assert max(g) == g[2] and g == [7, R('7.3'), R('7.32')]
        tot = 284126 + 267853
        a6 = qa(s, [('5046을 반올림하여 천의 자리까지', rnd(5046, '반올림', 3)),
                    ('3566, 3574, 3575, 3569 중에서 반올림하여 십의 자리까지 나타낸 수가 3570이 아닌 수', no[0]),
                    ('㉠ 7.352를 반올림하여 일의 자리까지', g[0]), ('㉡ 7.284를 반올림하여 소수 첫째 자리까지', g[1]), ('㉢ 7.315를 반올림하여 소수 둘째 자리까지', g[2]),
                    ('남자 284126명, 여자 267853명일 때 전체 방문자', tot, '명'), ('전체 방문자를 반올림하여 만의 자리까지', rnd(tot, '반올림', 4), '명')])
        s.ask('㉠, ㉡, ㉢ 중에서 나타낸 수가 가장 큰 것', blank=True)
        why(s, '551979를 반올림하여 만의 자리까지 나타낼 때 어느 자리의 숫자를 보았는지 써 보세요.', 1)
        ans += '   ⑥ %s, ㉢' % ' / '.join(a6)
    return ans


def st8(s, lv):
    s.lesson(8, '개념 구축하기(O)', '어떤 어림이 알맞을까 ― 올림·버림·반올림 활용', '상황에 따라 올림, 버림, 반올림 중 어떤 방법으로 어림해야 할까요?')
    s.scene(None, '놀이공원 안을 도는 순환 버스는 한 번 운행할 때 10명씩 탈 수 있어요. 5학년 학생 127명이 모두 타려면 버스는 최소 몇 번 운행해야 할까요?')
    if lv == '기본형':
        step(s, 0, '만져 보기', '순환 버스는 몇 번')
        s.choices([('10명보다 적게 남은 학생도 모두 타야 해요. 알맞은 어림 방법은', opt('올림', '버림', '반올림'))])
        b1, _, _ = pack(s, lv, 127, 10, 'ceil', '운행 횟수', '명', [12, 13], '127명이 모두 탈 수 있나요?')
        a1 = qa(s, [('버스는 최소 몇 번 운행해야 하나요?', b1, '번')])
        step(s, 1, '그려 보기', '열쇠고리 묶음 팔기')
        s.text('기념품 가게 점원이 새로 들어온 열쇠고리 365개를 10개씩 묶어 팔려고 해요. 10개씩 꽉 찬 묶음은 최대 몇 묶음까지 팔 수 있을까요?')
        s.choices([('알맞은 어림 방법은', opt('올림', '버림', '반올림'))])
        b2, _, _ = pack(s, lv, 365, 10, 'floor', '묶음', '개', [36, 37], '10개씩 꽉 채울 수 있나요?')
        a2 = qa(s, [('최대 몇 묶음까지 팔 수 있나요?', b2, '묶음')])
        step(s, 2, '말해 보기', '방문자 수 어림하기')
        s.text('놀이공원 안내서에 ‘지난해 방문자 3846500명, 올해 예상 방문자 4271000명’이라고 적혀 있어요. 하린이가 발표 자료에 넣으려고 반올림해요.')
        a3 = digits(s, lv, [('지난해 ', '3846500', '반올림', 5, '명'), ('올해 예상 ', '4271000', '반올림', 5, '명'),
                            ('지난해 ', '3846500', '반올림', 6, '명'), ('올해 예상 ', '4271000', '반올림', 6, '명')])
        thenwhy(s, lv, '방문자 수를 말할 때 올림이나 버림보다 반올림이 알맞은 까닭은?',
                '방문자 수는 ( 대략 얼마쯤인지 / 정확히 몇 명인지 ) 알면 되므로, 실제 수에 ( 더 가까운 / 더 먼 ) 쪽으로 어림하는 반올림이 알맞아요.')
        step(s, 3, '약속하기', '알맞은 어림 방법')
        cards = [('공연장 의자 한 줄에 10명씩, 246명이 모두 앉으려면 최소 몇 줄?', 0), ('동전 7300원을 1000원짜리 지폐로 최대 얼마까지 바꿀까?', 1),
                 ('학교에서 놀이공원까지 47.36 km를 약 몇 km라고 말할까?', 2), ('사진 엽서 572장을 10장씩 묶어 팔 때 최대 몇 장?', 1),
                 ('생수 1836병을 100병씩 상자에 모두 담을 때 최소 몇 상자?', 0), ('줄넘기를 459번 했다고 친구에게 대략 말하기', 2)]
        a4 = sort_cards(s, cards, ['올림', '버림', '반올림'])
        step(s, 4, '확인하기', '바르게 어림한 친구')
        s.text('모둠 동전 7300원을 1000원짜리 지폐로 바꾸려고 해요.')
        s.choices([('알맞은 어림 방법', opt('올림', '버림', '반올림'))])
        a5 = qa(s, [('바꿀 수 있는 돈', rnd(7300, '버림', 3), '원'), ('지폐는 최대', rnd(7300, '버림', 3) // 1000, '장')])
        assert 1800 + 1500 == 3300 and rnd(3300, '올림', 3) == 4000
        s.text('1800원짜리 기념 배지와 1500원짜리 아이스크림을 사고 1000원짜리 지폐로만 내려고 해요. 지호: “반올림하여 3000원을 내면 돼.” '
               '서연: “올림하여 4000원을 내야 해.” 도윤: “버림하여 3000원을 내면 돼.”')
        s.choices([('바르게 말한 사람', opt('지호', '서연', '도윤'))])
        ans = '8차시  ① 올림, 12번 120명 아니요·13번 130명 예, %s   ② 버림, 36묶음 360개 예·37묶음 370개 아니요, %s   ③ %s, 대략 얼마쯤인지·더 가까운   ④ %s   ⑤ 버림, %s, 서연(3300원 → 4000원)' % (
            a1[0], a2[0], ' / '.join(a3), a4, ' / '.join(a5))
    else:  # 도전형
        step(s, 0, '만져 보기', '순환 버스는 몇 번')
        s.text('이번에는 5학년과 6학년 학생 263명이 함께 순환 버스를 타요. 버스는 한 번에 10명씩 탈 수 있어요.')
        s.choices([('알맞은 어림 방법은', opt('올림', '버림', '반올림'))])
        b1, _, _ = pack(s, lv, 263, 10, 'ceil', '운행 횟수', '명', [26, 27], '263명이 모두 탈 수 있나요?')
        a1 = qa(s, [('버스는 최소 몇 번 운행해야 하나요?', b1, '번'), ('마지막 운행 때 타는 학생', 263 - 260, '명')])
        step(s, 1, '그려 보기', '배지 묶음 팔기')
        s.text('기념품 가게에 배지 1208개가 들어왔어요. 10개씩 꽉 채운 묶음으로만 팔아요.')
        s.choices([('알맞은 어림 방법은', opt('올림', '버림', '반올림'))])
        b2, _, _ = pack(s, lv, 1208, 10, 'floor', '묶음', '개', [120, 121], '10개씩 꽉 채울 수 있나요?')
        a2 = qa(s, [('최대 몇 묶음까지 팔 수 있나요?', b2, '묶음')])
        step(s, 2, '말해 보기', '방문자 수 어림하기')
        s.text('※ 이 자료에서 만든 수예요. ‘가 놀이공원 5286400명, 나 놀이공원 4952000명’을 반올림해요.')
        a3 = digits(s, lv, [('가 ', '5286400', '반올림', 5, '명'), ('나 ', '4952000', '반올림', 5, '명'),
                            ('가 ', '5286400', '반올림', 6, '명'), ('나 ', '4952000', '반올림', 6, '명')])
        thenwhy(s, lv, '백만의 자리까지 반올림하면 두 놀이공원의 방문자 수가 같아지는 까닭은?', '')
        step(s, 3, '약속하기', '알맞은 어림 방법')
        cards = [('한 번에 4명씩 타는 범퍼카 대신, 한 번에 10명씩 타는 보트에 57명이 모두 타려면 최소 몇 번?', 0), ('동전 9450원을 1000원짜리 지폐로 최대 얼마까지 바꿀까?', 1),
                 ('대기 시간 38분을 약 40분이라고 말하기', 2), ('사진 316장을 10장씩 앨범 한 쪽에 꽉 채우면 최대 몇 쪽?', 1),
                 ('물 1250병을 100병씩 상자에 모두 담을 때 최소 몇 상자?', 0), ('놀이공원 넓이 276381 m²를 약 28만 m²라고 말하기', 2)]
        a4 = sort_cards(s, cards, ['올림', '버림', '반올림'])
        step(s, 4, '확인하기', '바르게 어림한 친구')
        s.text('모둠 동전 9450원을 1000원짜리 지폐로 바꾸려고 해요.')
        a5 = qa(s, [('바꿀 수 있는 돈', rnd(9450, '버림', 3), '원'), ('돌려받는 동전', 9450 - rnd(9450, '버림', 3), '원')])
        assert 2300 + 1900 == 4200 and rnd(4200, '올림', 3) == 5000
        s.text('2300원짜리 모자와 1900원짜리 음료를 사고 1000원짜리 지폐로만 내려고 해요. 지호: “반올림하여 4000원을 내면 돼.” '
               '서연: “올림하여 5000원을 내야 해.” 도윤: “버림하여 4000원을 내면 돼.”')
        s.choices([('바르게 말한 사람', opt('지호', '서연', '도윤'))])
        ans = '8차시  ① 올림, 26번 260명 아니요·27번 270명 예, %s   ② 버림, 120묶음 1200개 예·121묶음 1210개 아니요, %s   ③ %s, (예) 두 수 모두 백만의 자리 바로 아래 숫자를 보면 5000000에 더 가까워요   ④ %s   ⑤ %s, 서연(4200원 → 5000원)' % (
            ' / '.join(a1), a2[0], ' / '.join(a3), a4, ' / '.join(a5))
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '같은 수가 되는 여러 가지 어림 방법')
        ways = [(m, p) for m in ('올림', '버림', '반올림') for p in (1, 2, 3) if rnd(4271, m, p) == 4300]
        assert ways == [('올림', 2), ('반올림', 2)]
        s.text('올해 놀이공원 하루 최대 방문자 4271명을 4300명이라고 어림했어요. 어떤 방법으로 어림했는지 두 가지를 찾아보세요.')
        s.ask('방법 1: (          )하여 (          )까지        방법 2: (          )하여 (          )까지', blank=False)
        a6 = qa(s, [('의자 한 줄에 10명씩, 246명이 모두 앉으려면 의자는 최소', rnd(246, '올림', 1) // 10, '줄')])
        why(s, '4271을 반올림하여 십의 자리까지 나타내면 4300이 되지 않는 까닭을 써 보세요.', 1)
        ans += '   ⑥ 올림하여 백의 자리까지, 반올림하여 백의 자리까지, %s, (반올림하여 십의 자리까지는 4270)' % a6[0]
    return ans


def st9(s, lv):
    s.lesson(9, '탐구 정리하기(O)', '짐을 택배로 보내요 ― 택배 요금 정하기', '상자의 무게와 크기가 속하는 범위로 택배 요금을 어떻게 정할 수 있을까요?')
    s.scene(None, '체험관에서 만든 작품과 기념품이 많아서 학교로 택배를 보내기로 했어요. 택배 요금은 상자의 무게와 크기에 따라 정해지고, 두 요금이 다르면 더 높은 요금으로 정해요. '
                  '상자의 크기는 가로, 세로, 높이의 합이에요. (요금표 출처: 찾기쉬운 생활법령정보, 2024)')
    if lv == '기본형':
        step(s, 0, '만져 보기', '요금표 읽기')
        fee_table(s)
        assert FEE[fee_row(0, 2)][2] == 6000 and FEE[fee_row(1, 120)][2] == 7000
        s.choices([('무게가 2 kg인 상자의 무게 요금', opt('6000원', '7000원')), ('크기가 120 cm인 상자의 크기 요금', opt('7000원', '8000원')),
                   ('무게 요금 6000원, 크기 요금 7000원이면 택배 요금', opt('6000원', '7000원', '13000원'))])
        step(s, 1, '그려 보기', '가 상자의 요금')
        s.text('지호네 모둠의 가 상자는 무게가 1.5 kg이고, 가로·세로·높이가 30 cm, 25 cm, 20 cm예요.')
        t2, f2 = fee_box(s, lv, 'sboxga', '가 상자', 1.5, [30, 25, 20])
        step(s, 2, '말해 보기', '나 상자의 요금')
        s.text('서연이네 모둠의 나 상자는 무게가 11 kg이고, 가로·세로·높이가 40 cm, 35 cm, 30 cm예요.')
        t3, f3 = fee_box(s, lv, 'sboxna', '나 상자', 11, [40, 35, 30])
        assert (f2, f3) == (7000, 8000)
        thenwhy(s, lv, '나 상자의 택배 요금이 7000원이 아니라 8000원인 까닭은?',
                '무게 11 kg은 ( 10 kg 초과 20 kg 이하 / 2 kg 초과 10 kg 이하 )라서 8000원, 크기 105 cm는 7000원이에요. 두 요금이 다르면 ( 더 높은 / 더 낮은 ) 요금으로 정해요.')
        step(s, 3, '약속하기', '모두 얼마일까')
        a4 = qa(s, [('가 상자와 나 상자를 함께 보낼 때 요금은 모두', f2 + f3, '원')])
        s.fill('택배 요금은 상자의 무게와 크기가 속하는 %s를 찾아 정하고, 두 요금이 다르면 %s 요금으로 정해요.' % (ch(lv, ['수의 범위', '가장 큰 수'], 10), ch(lv, ['더 높은', '더 낮은'], 8)))
        step(s, 4, '확인하기', '하린이와 도윤이의 상자')
        t5, f5 = fee_box(s, lv, 'sboxda', '다 상자', 6.5, [45, 40, 38])
        t6, f6 = fee_box(s, lv, 'sboxra', '라 상자', 2, [55, 38, 27])
        assert (f5, f6) == (8000, 7000)
        ans = '9차시  ① 6000원, 7000원, 7000원   ② %s   ③ %s, 10 kg 초과 20 kg 이하·더 높은   ④ %s, 수의 범위, 더 높은   ⑤ %s / %s' % (t2, t3, a4[0], t5, t6)
    else:  # 도전형
        step(s, 0, '만져 보기', '요금표 읽기')
        fee_table(s)
        assert FEE[fee_row(0, 10)][2] == 7000 and FEE[fee_row(1, 60)][2] == 6000
        s.choices([('무게가 10 kg인 상자의 무게 요금', opt('7000원', '8000원')), ('크기가 60 cm인 상자의 크기 요금', opt('6000원', '7000원')),
                   ('무게 요금 8000원, 크기 요금 9000원이면 택배 요금', opt('8000원', '9000원', '17000원'))])
        step(s, 1, '그려 보기', '가 상자의 요금')
        s.text('하린이네 모둠의 가 상자는 무게가 2.5 kg이고, 가로·세로·높이가 25 cm, 20 cm, 14 cm예요.')
        t2, f2 = fee_box(s, lv, 'hsboxga', '가 상자', 2.5, [25, 20, 14])
        step(s, 2, '말해 보기', '나 상자의 요금')
        s.text('지호네 모둠의 나 상자는 무게가 9 kg이고, 가로·세로·높이가 50 cm, 45 cm, 40 cm예요.')
        t3, f3 = fee_box(s, lv, 'hsboxna', '나 상자', 9, [50, 45, 40])
        assert (f2, f3) == (7000, 8000)
        thenwhy(s, lv, '가 상자는 무게 요금으로, 나 상자는 크기 요금으로 택배 요금이 정해진 까닭은?', '')
        step(s, 3, '약속하기', '모두 얼마일까')
        a4 = qa(s, [('가 상자와 나 상자를 함께 보낼 때 요금은 모두', f2 + f3, '원'), ('나 상자의 크기를 몇 cm 넘게 줄이지 않으면 7000원이 되지 않을까요? (세 변의 합을 적어도 몇 cm 줄여야 하는지)', 135 - 120, ' cm')])
        step(s, 4, '확인하기', '하린이와 도윤이의 상자')
        t5, f5 = fee_box(s, lv, 'hsboxda', '다 상자', 15, [55, 50, 45])
        t6, f6 = fee_box(s, lv, 'hsboxra', '라 상자', 0.8, [20, 20, 20])
        assert (f5, f6) == (9000, 6000)
        ans = '9차시  ① 7000원, 6000원, 9000원   ② %s   ③ %s, (예) 두 요금 중 더 높은 요금으로 정하는데, 가는 무게 요금이, 나는 크기 요금이 더 높아요   ④ %s   ⑤ %s / %s' % (
            t2, t3, ' / '.join(a4), t5, t6)
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '조건을 바꾸어 생각하기')
        s.text('도윤이네 모둠이 짐을 하나 더 넣었더니 상자 무게가 10.4 kg, 크기가 105 cm가 되었어요.')
        f7 = fee('10.4', 105)
        need = R('10.4') - 10
        assert f7 == 8000 and fee(10, 105) == 7000 and need == R('0.4')
        a6 = qa(s, [('지금 택배 요금', f7, '원')])
        s.choices([('7000원으로 보내려면 상자 무게가', opt('10 kg 미만', '10 kg 이하', '10 kg 초과') + '가 되어야 해요')])
        a7 = qa(s, [('짐을 적어도 몇 kg 빼야 하나요?', need, ' kg')])
        why(s, '무게를 10 kg 미만이 아니라 10 kg 이하로 만들면 되는 까닭을 써 보세요.', 1)
        ans += '   ⑥ %s, 10 kg 이하, %s' % (a6[0], a7[0])
    return ans


SGAME = [('136', '올림', 1), ('23460', '버림', 3), ('2637', '반올림', 2), ('47.36', '반올림', 0), ('158', '버림', 1), ('3.472', '올림', -1),
         ('127', '올림', 1), ('4386', '버림', 2), ('2650', '반올림', 2), ('365', '버림', 1), ('38400', '올림', 4), ('158462', '반올림', 3)]
_sg = [rnd(n, m, p) for n, m, p in SGAME]
assert len(set(_sg)) == len(_sg)


def st10(s, lv):
    s.lesson(10, '발표하기(P)', '알쏭달쏭 어림 퀴즈 놀이', '올림, 버림, 반올림을 이용한 문제를 만들고 해결할 수 있을까요?')
    s.scene(None, '체험 학습을 마치고 돌아온 날, 지호가 ‘알쏭달쏭 어림 퀴즈 놀이’를 준비했어요. (반 전체 두 모둠, 준비물: 붙임쪽지, 바구니)')
    if lv == '기본형':
        step(s, 0, '만져 보기', '놀이 방법')
        items = ['바구니에서 뽑은 문제를 함께 읽고, 출발선의 친구가 칠판으로 걸어가 답 쪽지를 찾아요.', '붙임쪽지 한 장에 올림·버림·반올림 문제를, 다른 한 장에 답을 써요.',
                 '모둠원끼리 문제와 답이 맞는지 확인해요.', '문제 쪽지는 접어 바구니에, 답 쪽지는 칠판에 붙여요.', '모든 모둠원이 문제를 풀 때까지 하고, 점수가 많은 모둠이 이겨요.']
        a1 = order_table(s, items, [1, 2, 3, 0, 4])
        step(s, 1, '그려 보기', '문제 만들기')
        s.text('체험 학습에서 만난 수로 문제를 만들어요. 두 쪽지의 어림 방법은 다르게 해요. 예) 2637을 반올림하여 백의 자리까지 → 2600')
        assert rnd(2637, '반올림', 2) == 2600
        sticky(s)
        step(s, 2, '말해 보기', '퀴즈 놀이')
        s.text('바구니에서 뽑은 문제예요. 칠판에서 알맞은 답 쪽지를 찾아 답을 써 보세요.')
        board = sorted(_sg)
        a3 = game_table(s, lv, SGAME, board)
        thenwhy(s, lv, '놀이에서 가장 헷갈렸던 문제를 하나 골라, 답을 찾은 방법을 써 볼까요?',
                '(          )을/를 (          )하여 (          )까지 나타내는 문제였어요. (          ) 숫자가 (     )이라서 ( 올렸어요 / 버렸어요 ).')
        step(s, 3, '약속하기', '주사위 어림 놀이')
        s.text('‘둘레’나 ‘넓이’를 외치며 주사위 두 개를 던지고, 두 눈의 수를 가로·세로로 하는 직사각형의 둘레나 넓이를 구한 뒤 반올림하여 십의 자리까지 나타내요. 3회 성공하면 끝나요.')
        assert rnd(24, '반올림', 1) == 20 and rnd(25, '반올림', 1) == 30
        if lv == '기본형':
            s.text('둘레는 (가로 + 세로) × 2, 넓이는 가로 × 세로예요. 예) 24 → 20, 25 → 30')
        dice_record(s)
        step(s, 4, '확인하기', '놀이를 돌아봐요')
        a5 = qa(s, [('4386을 버림하여 백의 자리까지', rnd(4386, '버림', 2)), ('3.472를 올림하여 소수 첫째 자리까지', rnd('3.472', '올림', -1))])
        s.fill(['올림한 수는 처음 수와 %s.' % ch(lv, ['같거나 커요', '같거나 작아요'], 10), '버림한 수는 처음 수와 %s.' % ch(lv, ['같거나 커요', '같거나 작아요'], 10)])
        ans = '10차시  ① (위에서부터) %s   ② (모둠마다 다름)   ③ %s, (예) 2650을 반올림하여 백의 자리까지 — 십의 자리 숫자 5라 올려서 2700   ④ 기록표는 놀이마다 다름   ⑤ %s, 같거나 커요, 같거나 작아요' % (
            a1, a3, ' / '.join(a5))
    else:  # 도전형
        step(s, 0, '만져 보기', '놀이 규칙 알기')
        rules = [('붙임쪽지 한 장에는 문제를, 다른 한 장에는 답을 써요.', '맞아요'), ('답 쪽지는 접어서 바구니에 넣어요.', '틀려요'),
                 ('모든 모둠원이 문제를 풀 때까지 놀이를 해요.', '맞아요'), ('점수가 적은 모둠이 이겨요.', '틀려요')]
        s.choices([(t, opt('맞아요', '틀려요')) for t, _ in rules])
        a1 = ', '.join(a for _, a in rules)
        step(s, 1, '그려 보기', '답이 2600인 문제 만들기')
        s.text('답이 2600이 되도록 어림할 수를 정해 문제를 만들어 보세요. 세 문제의 어림 방법은 모두 달라야 해요.')
        s.table([['어림 방법', '어림할 수', '나타낼 자리', '답'], ['올림', '', '백의 자리까지', '2600'], ['버림', '', '백의 자리까지', '2600'], ['반올림', '', '백의 자리까지', '2600']],
                col_mm=[35, 55, 50, 40], row_h=3402)
        assert rnd(2501, '올림', 2) == 2600 and rnd(2699, '버림', 2) == 2600 and rnd(2550, '반올림', 2) == 2600 and rnd(2649, '반올림', 2) == 2600
        step(s, 2, '말해 보기', '퀴즈 놀이')
        HSG = [('1043', '올림', 2), ('31780', '버림', 4), ('3176', '반올림', 1), ('58.629', '반올림', -1), ('247', '버림', 1), ('5.207', '올림', -2),
               ('263', '올림', 1), ('6.159', '버림', -1), ('3250', '반올림', 2), ('276381', '반올림', 4)]
        a3 = game_table(s, lv, HSG)
        thenwhy(s, lv, '6.159를 버림하여 소수 첫째 자리까지 나타낸 수와 반올림하여 소수 첫째 자리까지 나타낸 수를 비교하여 써 볼까요?', '')
        step(s, 3, '약속하기', '주사위 어림 놀이')
        s.text('주사위 두 눈의 수를 가로·세로로 하는 직사각형의 둘레나 넓이를 구한 뒤 반올림하여 십의 자리까지 나타내요.')
        a4 = qa(s, [('5와 6을 던져 ‘넓이!’ → 반올림하여 십의 자리까지', rnd(30, '반올림', 1)), ('6과 6을 던져 ‘넓이!’ → 반올림하여 십의 자리까지', rnd(36, '반올림', 1)),
                    ('6과 6을 던져 ‘둘레!’ → 반올림하여 십의 자리까지', rnd(24, '반올림', 1))])
        pairs = sorted({tuple(sorted((a, b))) for a in range(1, 7) for b in range(1, 7) if rnd(a * b, '반올림', 1) == 30})
        assert pairs == [(5, 5), (5, 6)]
        s.ask('넓이를 반올림하여 십의 자리까지 나타내면 30이 되는 두 눈을 모두 찾아 쓰세요.', blank=True)
        step(s, 4, '확인하기', '놀이를 돌아봐요')
        a5 = qa(s, [('5208을 올림하여 백의 자리까지', rnd(5208, '올림', 2)), ('7.351을 버림하여 소수 첫째 자리까지', rnd('7.351', '버림', -1)),
                    ('4999를 반올림하여 천의 자리까지', rnd(4999, '반올림', 3))])
        why(s, '반올림한 수는 처음 수보다 클 때도, 작을 때도 있어요. 그 까닭을 써 보세요.', 1)
        ans = '10차시  ① %s   ② (예) 올림 2501~2600 중 하나, 버림 2600~2699 중 하나, 반올림 2550~2649 중 하나   ③ %s, (예) 버림 6.1, 반올림 6.2로 달라요   ④ %s, (5, 5)·(5, 6)   ⑤ %s, (예) 바로 아래 숫자가 0~4이면 버려서 작아지고 5~9이면 올려서 커져요' % (
            a1, a3, ' / '.join(a4), ' / '.join(a5))
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '수 카드 놀이')
        s.picture(fig('cards257', svg_cards([2, 5, 7])), width_mm=50)
        nums = make3([2, 5, 7])
        b1 = max(v for v in nums if rnd(v, '반올림', 2) == 500)
        b2 = min(v for v in nums if rnd(v, '올림', 2) == 300)
        assert (b1, b2) == (527, 257)
        a6 = qa(s, [('반올림하여 백의 자리까지 나타내면 500이 되는 수 중에서 가장 큰 수', b1), ('올림하여 백의 자리까지 나타내면 300이 되는 수 중에서 가장 작은 수', b2)])
        why(s, '반올림하여 백의 자리까지 나타내면 500이 되는 수는 어떤 범위에 있는지 써 보세요.', 1)
        ans += '   ⑥ %s (450 이상 550 미만인 수)' % ' / '.join(a6)
    return ans


def st11(s, lv):
    s.lesson(11, '발표하기(P)', '현장 체험 학습 보고회', '수의 범위와 어림하기로 체험 학습을 어떻게 준비했는지 발표할 수 있나요?')
    s.scene(None, '보고회 날이에요! 준비 위원들이 체험 학습을 준비하며 만난 문제를 친구들에게 내요.')
    if lv == '기본형':
        step(s, 0, '만져 보기', '이상인 수와 이하인 수')
        s.text('지호가 낸 문제예요. 38 이상인 수에 모두 ○표, 41 이하인 수에 모두 △표 해 보세요. 한 수에 ○표와 △표를 함께 할 수도 있어요.')
        m1 = marks(s, [38, 12, 55, 27.5, 41, 60], [('○', rng(38, True)), ('△', rng(hi=41, hiInc=True))])
        assert m1 == '○ 38, 55, 41, 60 / △ 38, 12, 27.5, 41'
        step(s, 1, '그려 보기', '범위를 그림으로')
        s.text('서연이가 낸 문제예요. ① 22 이상 25 미만인 수')
        numline(s, 'st11a', 20, 27)
        s.text('② 16.5 초과 18 이하인 수 (작은 눈금 한 칸은 0.5예요.)')
        numline(s, 'st11b', 14, 21, step=0.5, lab=1)
        step(s, 2, '말해 보기', '두 학교의 학생 수')
        s.text('도윤이가 낸 문제예요. 별빛 놀이공원에 같은 날 함께 온 두 학교의 학생 수를 백의 자리까지 나타내 보세요.')
        sch = [('푸른초등학교', 286), ('햇살초등학교', 314)]
        s.table([['학교', '학생 수(명)', '올림', '버림', '반올림']] + [[a, str(v), '(       )', '(       )', '(       )'] for a, v in sch], col_mm=[48, 33, 33, 33, 33], row_h=3402)
        a3 = ' / '.join('%s %s' % (a, '·'.join(fmt(rnd(v, m, 2)) for m in ('올림', '버림', '반올림'))) for a, v in sch)
        assert a3 == '푸른초등학교 300·200·300 / 햇살초등학교 400·300·300'
        thenwhy(s, lv, '286과 314를 반올림하여 백의 자리까지 나타내면 둘 다 300이 되는 까닭은?',
                '286은 200보다 ( 300 / 400 )에 더 가깝고, 314도 400보다 ( 300 / 200 )에 더 가까워서 반올림하면 둘 다 300이 돼요.')
        step(s, 3, '약속하기', '하린이네 가족 입장료')
        s.text('하린이는 다음 주말에 가족과 함께 별빛 놀이공원에 다시 가기로 했어요. 하린 11세, 아버지 45세, 어머니 43세, 동생 4세, 할머니 67세예요.')
        age_table(s)
        fam = [('하린', 11), ('아버지', 45), ('어머니', 43), ('동생', 4), ('할머니', 67)]
        fs = [AGE[age_row(a)][3] for _, a in fam]
        assert sum(fs) == 92000
        a4 = qa(s, [('%s %d세' % (k, a), f, '원') for (k, a), f in zip(fam, fs)] + [('가족 입장료는 모두', sum(fs), '원')])
        step(s, 4, '확인하기', '처음 궁금증 돌아보기')
        s.text('1차시에 붙인 ‘궁금해요’ 쪽지를 다시 보고, 체험 학습 준비를 마무리하는 글을 써 보세요.')
        write_pane(s, lv, [('궁금증에 답하기', '______________ 이 궁금했어요. 이제 ______________ 라는 것을 알아요.'),
                           ('기억에 남는 활동', '______________ 을 했어요. ______________ 라는 것을 알게 되었어요.')])
        if lv == '도전형':
            s.lines(1)
        ans = '11차시  ① %s   ② (1) 22에 ●·25에 ○  (2) 16.5에 ○·18에 ● (두 점 사이에 선)   ③ %s, 300·300   ④ %s   ⑤ (자유) (예) ‘140 cm 이상’에는 140 cm도 들어가요.' % (
            m1, a3, ' / '.join(a4))
    else:  # 도전형
        step(s, 0, '만져 보기', '이상인 수와 이하인 수')
        s.text('지호가 낸 문제예요. 52 이상인 수에 모두 ○표, 55 이하인 수에 모두 △표 해 보세요.')
        m1 = marks(s, [52, 18, 71, 54.5, 55, 90, 51.9], [('○', rng(52, True)), ('△', rng(hi=55, hiInc=True))])
        assert m1 == '○ 52, 71, 54.5, 55, 90 / △ 52, 18, 54.5, 55, 51.9'
        a1 = qa(s, [('52 이상 55 이하인 수의 개수', 3, '개')])
        step(s, 1, '그려 보기', '범위를 그림으로')
        s.text('서연이가 낸 문제예요. ① 31 초과 34 이하인 수')
        numline(s, 'hst11a', 29, 36)
        s.text('② 9.5 이상 11 미만인 수 (작은 눈금 한 칸은 0.5예요.)')
        numline(s, 'hst11b', 8, 13, step=0.5, lab=1)
        step(s, 2, '말해 보기', '두 학교의 학생 수')
        s.text('도윤이가 낸 문제예요. 다른 날 온 두 학교의 학생 수를 백의 자리까지 나타내 보세요.')
        sch = [('별빛초등학교', 349), ('바다초등학교', 1251)]
        s.table([['학교', '학생 수(명)', '올림', '버림', '반올림']] + [[a, str(v), '(       )', '(       )', '(       )'] for a, v in sch], col_mm=[48, 33, 33, 33, 33], row_h=3402)
        a3 = ' / '.join('%s %s' % (a, '·'.join(fmt(rnd(v, m, 2)) for m in ('올림', '버림', '반올림'))) for a, v in sch)
        assert a3 == '별빛초등학교 400·300·300 / 바다초등학교 1300·1200·1300'
        thenwhy(s, lv, '349를 반올림한 수는 버림한 수와 같고, 1251을 반올림한 수는 올림한 수와 같은 까닭은?', '')
        step(s, 3, '약속하기', '하린이네 친척 입장료')
        s.text('하린이의 친척들도 놀이공원에 가기로 했어요. 사촌 3세, 삼촌 36세, 숙모 34세, 사촌 형 16세, 증조할머니 88세예요.')
        age_table(s)
        fam = [('사촌', 3), ('삼촌', 36), ('숙모', 34), ('사촌 형', 16), ('증조할머니', 88)]
        fs = [AGE[age_row(a)][3] for _, a in fam]
        assert sum(fs) == 82000
        a4 = qa(s, [('어른 요금을 내는 사람 수', 2, '명'), ('친척들의 입장료는 모두', sum(fs), '원'), ('100000원을 내면 거스름돈', 100000 - sum(fs), '원')])
        step(s, 4, '확인하기', '처음 궁금증 돌아보기')
        s.ask('체험 학습 준비에서 ‘올림’이 필요했던 일과 ‘버림’이 필요했던 일을 하나씩 쓰고, 두 방법이 어떻게 다른지 써 보세요.', blank=False)
        s.lines(3)
        ans = '11차시  ① %s, %s(52·54.5·55)   ② (1) 31에 ○·34에 ● (2) 9.5에 ●·11에 ○ (두 점 사이에 선)   ③ %s, (예) 349는 300에, 1251은 1300에 더 가까워요   ④ %s   ⑤ (자유) (예) 열쇠고리는 올림, 동전 바꾸기는 버림' % (
            m1, a1[0], a3, ' / '.join(a4))
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '보고회 마지막 문제')
        s.picture(fig('cards351', svg_cards([3, 5, 1])), width_mm=50)
        got = [v for v in make3([3, 5, 1]) if rnd(v, '올림', 2) == 400]
        assert got == [315, 351]
        s.text('수 카드 3, 5, 1을 한 번씩 써서 세 자리 수를 만들어요. 지호: “올림하여 백의 자리까지 나타내었을 때 400이면 백의 자리 숫자는 3이구나.”')
        a6 = qa(s, [('올림하여 백의 자리까지 나타내면 400이 되는 수를 모두', L(got)), ('만들 수 있는 수의 개수', len(got), '개')])
        why(s, '올림하여 백의 자리까지 나타내면 400이 되는 수의 범위를 ‘초과’와 ‘이하’를 사용하여 써 보세요.', 1)
        ans += '   ⑥ %s (300 초과 400 이하인 수)' % ' / '.join(a6)
    return ans


ST = [st1, st2, st3, st4, st5, st6, st7, st8, st9, st10, st11]


# ================================================================ 만들기
def build(funcs, label, short, outdir, lv):
    s = Sheet(unit_label=label, level=lv, grade_label='5학년')
    lines = [f(s, lv) for f in funcs]
    s.answers('【교사용】 1. 수의 범위와 어림하기(%s) 활동지 정답 (%s)' % (short, lv), lines,
              note='※ 이 활동지는 앱 u1-range.html과 차시 번호가 같습니다. 수직선은 ●(포함)·○(포함하지 않음)과 범위 쪽 굵은 선으로 그렸으면 정답이에요.')
    os.makedirs(outdir, exist_ok=True)
    path = os.path.join(outdir, NAME % lv)
    s.save(path)
    return path


def main():
    out = []
    try:
        for lv in ('기본형', '도전형'):
            out.append(build(TB, '5-2 수학 1. 수의 범위와 어림하기(교과서 차시)', '교과서 차시', OUT_TB, lv))
            out.append(build(ST, '5-2 수학 1. 수의 범위와 어림하기(이야기 버전)', '이야기 버전', OUT_ST, lv))
    finally:
        shutil.rmtree(WORK, ignore_errors=True)
    bad = 0
    for p in out:
        prob_ = check(p)
        bad += bool(prob_)
        print(p, 'OK' if not prob_ else '\n  ' + '\n  '.join(prob_))
    sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()
