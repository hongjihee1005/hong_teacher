# -*- coding: utf-8 -*-
"""5-1 수학 2. 약수와 배수 활동지(교과서 차시 버전·이야기 버전 × 기본형·도전형) 만들기

    python3 gen_u2-factor.py

앱 원본 ../units/u2-factor.tb.js(교과서, 10차시: 1·2·3·4~5·6~7·8·9·10) · u2-factor.st.js(이야기, 11차시)와
차시 번호·제목·S.O.O.P.·탐구 질문·이야기·수를 똑같이 맞춥니다. 약수·배수·최대공약수·최소공배수 등
정답은 모두 이 스크립트가 계산합니다. 그림은 SVG로 그려 임시 폴더에서 PNG로 바꿉니다(저장소에는 남기지 않음).
"""
import os
import shutil
import sys
import tempfile
from math import gcd

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from hwpxgen import Sheet, svg_to_png, check  # noqa: E402

ROOT = os.path.normpath(os.path.join(HERE, '..', '..'))      # grade5/math
OUT_TB = os.path.join(ROOT, 'sem1', 'sheets')
OUT_ST = os.path.join(ROOT, 'sem1-soop', 'sheets')
NAME = '2단원_약수와배수_활동지_%s.hwpx'
FONT = "'Noto Sans KR','WenQuanYi Zen Hei',sans-serif"
NUM = '①②③④⑤⑥⑦'
WORK = tempfile.mkdtemp(prefix='u2factor_')
_FIG = {}


# ---------------------------------------------------------------- 계산
def divs(n):
    return [d for d in range(1, n + 1) if n % d == 0]


def mults(n, k):
    return [n * (i + 1) for i in range(k)]


def mults_to(n, mx):
    return mults(n, mx // n)


def lcm(a, b):
    return a // gcd(a, b) * b


def both(A, B):
    return [x for x in A if x in B]


def leaves(v):
    """더 이상 나눌 수 없는 수들의 곱: 12 → [2, 2, 3]"""
    r, x, d = [], v, 2
    while d * d <= x:
        while x % d == 0:
            r.append(d)
            x //= d
        d += 1
    if x > 1:
        r.append(x)
    return r


def X(A):
    return ' × '.join(str(v) for v in A)


def L(A):
    return ', '.join(str(v) for v in A)


def pairs_of(n):
    """곱이 n이 되는 두 수의 짝(작은 수부터): 8 → [(1,8),(2,4)]"""
    return [(d, n // d) for d in divs(n) if d * d <= n]


def ladder(a, b):
    """두 수를 공약수(작은 소수부터)로 차례로 나눈 과정. [(d, a, b), …], 마지막 몫 (a, b)"""
    rows = []
    for d in leaves(gcd(a, b)):
        rows.append((d, a, b))
        a, b = a // d, b // d
    return rows, (a, b)


def ladder_text(a, b, goal='both'):
    rows, (qa, qb) = ladder(a, b)
    t = ' → '.join('%d ) %d %d' % r for r in rows) + ' → %d %d' % (qa, qb)
    ds = [r[0] for r in rows]
    g, m = gcd(a, b), lcm(a, b)
    prod = 1
    for d in ds:
        prod *= d
    assert prod == g and g * qa * qb == m
    parts = []
    if goal in ('gcd', 'both'):
        parts.append('최대공약수 %s = %d' % (X(ds), g) if len(ds) > 1 else '최대공약수 %d' % g)
    if goal in ('lcm', 'both'):
        parts.append('최소공배수 %s = %d' % (X(ds + [qa, qb]), m))
    return t + ', ' + ', '.join(parts)


def josa(w, pair):
    """받침에 맞는 조사(앱의 fm2J와 같음)."""
    s = str(w)
    c = s[-1]
    has = rieul = False
    if c.isdigit():
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


# ---------------------------------------------------------------- 그림
def fig(key, svg, px=1600):
    if key not in _FIG:
        _FIG[key] = svg_to_png(svg, os.path.join(WORK, key + '.png'), px)
    return _FIG[key]


def _svg(w, h, body):
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d"><rect width="%d" height="%d" fill="#fff"/>'
            '<g font-family="%s">%s</g></svg>' % (w, h, w, h, FONT, body))


def _t(x, y, s, size=26, anchor='middle', weight='normal', fill='#000'):
    return '<text x="%s" y="%s" font-size="%s" text-anchor="%s" font-weight="%s" fill="%s">%s</text>' % (
        x, y, size, anchor, weight, fill, s)


def _box(x, y, w, h=None):
    h = h or w
    return '<rect x="%s" y="%s" width="%s" height="%s" fill="#fff" stroke="#777" stroke-width="2" rx="4"/>' % (x, y, w, h)


def svg_cicada():
    out = ['<rect x="0" y="0" width="900" height="250" fill="#EAF4E4"/>',
           '<rect x="380" y="30" width="18" height="220" fill="#8B6A4B"/><rect x="500" y="30" width="18" height="220" fill="#8B6A4B"/>']
    for x, col in ((389, '#3E3A2E'), (509, '#4D3A28')):
        y = 150
        out.append('<ellipse cx="%d" cy="%d" rx="30" ry="13" fill="#C8E1F0" stroke="#7FA7C0" stroke-width="2" transform="rotate(-20 %d %d)"/>' % (x - 16, y, x, y))
        out.append('<ellipse cx="%d" cy="%d" rx="30" ry="13" fill="#C8E1F0" stroke="#7FA7C0" stroke-width="2" transform="rotate(20 %d %d)"/>' % (x + 16, y, x, y))
        out.append('<ellipse cx="%d" cy="%d" rx="12" ry="26" fill="%s"/>' % (x, y + 6, col))
        out.append('<circle cx="%d" cy="%d" r="4" fill="#C0392B"/><circle cx="%d" cy="%d" r="4" fill="#C0392B"/>' % (x - 6, y - 16, x + 6, y - 16))
    for x, t1, t2 in ((40, '나는 13년마다 나타나!', '미국의 13년 매미'), (560, '나는 17년마다 나타나!', '미국의 17년 매미')):
        out.append('<rect x="%d" y="40" width="300" height="74" rx="18" fill="#fff" stroke="#AEBBB6" stroke-width="2"/>' % x)
        out.append(_t(x + 150, 70, t1, 22))
        out.append(_t(x + 150, 100, t2, 19, fill='#2F6B57'))
    out.append('<rect x="250" y="190" width="400" height="44" rx="22" fill="#FFF1BF" stroke="#E2C66A" stroke-width="2"/>')
    out.append(_t(450, 220, '2024년에 두 매미가 동시에 나타났대!', 22))
    return _svg(900, 250, ''.join(out))


def svg_numline(mx, tick=1, lab=1, zero=None, title=None):
    """0부터 mx까지 수직선(뛰어 세기 화살표를 직접 그려 넣는 빈 수직선)."""
    W, x0, x1, y = 1000, 50, 950, 120 if title else 80
    Xp = lambda v: x0 + v / mx * (x1 - x0)
    out = []
    if title:
        out.append(_t(W / 2, 34, title, 24))
    out.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="#000" stroke-width="3"/>' % (x0 - 20, y, x1 + 20, y))
    v = 0
    while v <= mx:
        big = v % lab == 0
        out.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="#000" stroke-width="%d"/>' % (
            Xp(v), y - (14 if big else 8), Xp(v), y + (14 if big else 8), 3 if big else 2))
        if big:
            out.append(_t('%.1f' % Xp(v), y + 44, str(v), 24))
        v += tick
    H = y + 60
    if zero:
        out.append(_t(Xp(0), y + 74, '(%s)' % zero, 20, 'start'))
        H += 24
    return _svg(W, H, ''.join(out))


def svg_arrays(n, pers, color='#2B7BD6'):
    """바둑돌·스티커 n개를 한 줄에 per개씩 늘어놓은 그림 여러 개(마지막 줄이 덜 차면 그대로)."""
    r, gap, pad = 13, 34, 26
    panels = []
    for per in pers:
        rows = -(-n // per)
        w = max(per * gap + pad * 2, 190)
        pad2 = (w - per * gap) / 2
        h = rows * gap + 70
        panels.append((per, rows, w, h, pad2))
    W = sum(p[2] for p in panels) + 30 * (len(panels) - 1) + 20
    H = max(p[3] for p in panels) + 10
    out, x = [], 10
    for per, rows, w, h, pad2 in panels:
        out.append('<rect x="%d" y="5" width="%d" height="%d" rx="12" fill="#FBFCFB" stroke="#B9C4C0" stroke-width="2"/>' % (x, w, H - 10))
        out.append(_t(x + w / 2, 38, '한 줄에 %d개씩' % per, 22))
        for i in range(n):
            cx = x + pad2 + (i % per) * gap + gap / 2
            cy = 60 + (i // per) * gap + gap / 2
            out.append('<circle cx="%.1f" cy="%.1f" r="%d" fill="%s"/>' % (cx, cy, r, color))
        x += w + 30
    return _svg(W, H, ''.join(out))


def svg_ladder(rows, last, gcap=None):
    """공약수로 나누기 틀. rows: [(d, a, b)] 칸에 None이면 빈칸, 글자면 그대로. last: (a, b)."""
    cw, ch = 96, 60
    xd, xa, xb = 20, 150, 150 + cw + 20
    W = xb + cw + 30
    out, y = [], 12

    def cell(x, yy, v):
        if v is None:
            out.append(_box(x + 8, yy + 6, cw - 16, ch - 12))
        else:
            out.append(_t(x + cw / 2, yy + ch * 0.7, v, 34))

    for d, a, b in rows:
        cell(xd, y, d)
        out.append('<path d="M%d %d Q%d %d %d %d" fill="none" stroke="#000" stroke-width="3"/>' % (
            xa - 18, y + 4, xa - 4, y + ch / 2, xa - 18, y + ch - 2))
        out.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="#000" stroke-width="3"/>' % (xa - 18, y + ch - 2, xb + cw + 6, y + ch - 2))
        cell(xa, y, a)
        cell(xb, y, b)
        y += ch + 6
    cell(xa, y, last[0])
    cell(xb, y, last[1])
    y += ch + 8
    return _svg(W, y, ''.join(out))


def ladder_fig(a, b, lv, key=None):
    """두 수로 시작하는 빈 사다리. 기본형은 나누는 수를 넣어 주고, 도전형은 모두 빈칸."""
    rs, _ = ladder(a, b)
    rows = []
    for i, (d, x, y) in enumerate(rs):
        rows.append((str(d) if lv == '기본형' else None, str(a) if i == 0 else None, str(b) if i == 0 else None))
    return fig(key or 'ld%d_%d%s' % (a, b, lv), svg_ladder(rows, (None, None)))


def svg_grid(w, h, unit='cm'):
    c = 38
    x0, y0 = 150, 20
    out = []
    for i in range(w + 1):
        out.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="#BBB" stroke-width="1.5"/>' % (x0 + i * c, y0, x0 + i * c, y0 + h * c))
    for j in range(h + 1):
        out.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="#BBB" stroke-width="1.5"/>' % (x0, y0 + j * c, x0 + w * c, y0 + j * c))
    out.append('<rect x="%d" y="%d" width="%d" height="%d" fill="none" stroke="#000" stroke-width="4"/>' % (x0, y0, w * c, h * c))
    out.append(_t(x0 + w * c / 2, y0 + h * c + 40, '가로 %d %s' % (w, unit), 26))
    out.append(_t(x0 - 14, y0 + h * c / 2 + 9, '세로 %d %s' % (h, unit), 26, 'end'))
    out.append(_t(x0 + w * c + 10, y0 + 20, '(모눈 한 칸 = 1 %s)' % unit, 18, 'start', fill='#555'))
    return _svg(x0 + w * c + 190, y0 + h * c + 60, ''.join(out))


def svg_strips(strips, pieces):
    c = 44
    out, y = [], 16
    for n in strips:
        out.append(_t(20, y + c * 0.7, '%d칸 띠' % n, 24, 'start'))
        for i in range(n):
            out.append('<rect x="%d" y="%d" width="%d" height="%d" fill="#FFF8E8" stroke="#555" stroke-width="2"/>' % (140 + i * c, y, c, c))
        y += c + 18
    y += 10
    out.append(_t(20, y + 24, '보기의 조각', 24, 'start', weight='bold'))
    y += 44
    x = 20
    cols = ['#F3B6C8', '#DCEBFA', '#DDF0E4', '#FDEBD9', '#FFF1BF', '#E3DAF5']
    for i, (k, n) in enumerate(pieces):
        if x + n * c + 60 > 140 + max(strips) * c + 20:
            x = 20
            y += c + 26
        out.append(_t(x + 14, y + c * 0.7, k, 26))
        for j in range(n):
            out.append('<rect x="%d" y="%d" width="%d" height="%d" fill="%s" stroke="#555" stroke-width="2"/>' % (
                x + 34 + j * c, y, c, c, cols[i % len(cols)]))
        x += 34 + n * c + 36
    y += c + 14
    return _svg(140 + max(strips) * c + 30, y, ''.join(out))


# ---------------------------------------------------------------- 공통 활동 조각
def step(s, i, label, sub=None):
    s.step('%s %s' % (NUM[i], label), sub)


def qa(s, items, col=(118, 62)):
    """묻고 답하기 표. items: (질문, 답, 단위). 정답 글 목록을 돌려줌."""
    rows, ans = [], []
    for it in items:
        q, a = it[0], it[1]
        unit = it[2] if len(it) > 2 else ''
        rows.append([q, '(              )' + unit])
        ans.append((L(a) if isinstance(a, (list, tuple)) else str(a)) + (' ' + unit if unit == 'cm' else unit))
    s.table(rows, header=False, col_mm=list(col), row_h=3402)
    return ans


def opt(*o):
    return '( ' + ' / '.join(o) + ' )'


def why(s, q, n=2):
    s.ask(q, blank=False)
    s.lines(n)


def thenwhy(s, lv, q, frame):
    """'왜 그럴까요?' 칸: 기본형은 문장 틀, 도전형은 빈 줄."""
    s.ask('왜 그럴까요? ' + q, blank=False)
    if lv == '기본형':
        s.fill(frame)
    else:
        s.lines(2)


def rule_first(s, q, lv, frame=None):
    s.ask('먼저 예상해요 · ' + q, blank=False)
    if lv == '기본형' and frame:
        s.fill(frame)
    else:
        s.ask('내 규칙: ______________________________________________', blank=False)


def num_board(s, nums, cols):
    rows = [[str(v) for v in nums[i:i + cols]] for i in range(0, len(nums), cols)]
    s.table(rows, header=False, row_h=2835)


def row_table(s, label, nums, label_mm=32):
    """이름 칸 + 수 칸 한 줄. 수가 13개보다 많으면 두 줄로 나누어 칸이 좁아지지 않게 함."""
    vals = [str(v) for v in nums]
    k = -(-len(vals) // 2) if len(vals) > 13 else len(vals)
    rows = []
    for i in range(0, len(vals), k):
        chunk = vals[i:i + k]
        rows.append([label if i == 0 else ''] + chunk + [''] * (k - len(chunk)))
    s.table(rows, header=False, header_col=True, col_mm=[label_mm] + [(180 - label_mm) / k] * k, row_h=2835)


def share_table(s, n, unit_box, item, unit_item):
    """n개를 상자 1~n개에 나누어 보는 표."""
    rows = [['%s 수' % unit_box, '한 %s에 담는 %s' % (unit_box, item), '남김없이 똑같이?']]
    for k in range(1, n + 1):
        rows.append(['%d개' % k, '(        )%s' % unit_item, '( ○ / × )'])
    s.table(rows, col_mm=[40, 80, 60], row_h=2600)
    out = []
    for k in range(1, n + 1):
        out.append('%d개 %s' % (k, ('%d%s ○' % (n // k, unit_item)) if n % k == 0 else '×'))
    return ', '.join(out)


def div_table(s, n, ds, given):
    rows = [['나눗셈식', '몫', '나머지', '나누어떨어지나요?']]
    for d in ds:
        q, r = divmod(n, d)
        if d in given:
            rows.append(['%d ÷ %d' % (n, d), str(q), str(r), '○' if r == 0 else '×'])
        else:
            rows.append(['%d ÷ %d' % (n, d), '(      )', '(      )', '( ○ / × )'])
    s.table(rows, col_mm=[45, 35, 35, 65], row_h=2600)
    return ', '.join('%d÷%d=%d…%d' % (n, d, n // d, n % d) for d in ds if d not in given)


def pair_table(s, n, lv, who, unit):
    """n개를 한 줄에 똑같은 수씩: 곱이 n이 되는 짝."""
    ps = pairs_of(n)
    rows = [['한 줄에 서는 %s' % who, '줄 수', '곱셈식']]
    for a, b in ps:
        if lv == '기본형':
            rows.append(['%d%s' % (a, unit), '(      )줄', '%d × (      ) = %d' % (a, n)])
        else:
            rows.append(['(      )%s' % unit, '(      )줄', '(    ) × (    ) = %d' % n])
    s.table(rows, col_mm=[55, 45, 80], row_h=2600)
    return ' / '.join('%d × %d' % p for p in ps)


def order_rules(s, rules, show):
    rows = [['차례', '놀이 방법']] + [['(    )', rules[i][2:]] for i in show]
    s.table(rows, col_mm=[25, 155])
    return ' '.join(str(i + 1) for i in show)


def sort_table(s, lv, cards, bins):
    """카드 나누기 표. cards: (글, 상자 번호). 정답 글."""
    s.text('㉮ %s   ㉯ %s' % (bins[0], bins[1]))
    rows = [[t, '( ㉮ / ㉯ )' if lv == '기본형' else '(        )'] for t, _ in cards]
    s.table(rows, header=False, col_mm=[145, 35], row_h=2835)
    return ', '.join('㉮㉯'[b] for _, b in cards)


def write_pane(s, lv, items):
    """보기·생각하기 같은 세 칸 쓰기. items: (이름, 기본형 문장 틀)."""
    if lv == '기본형':
        s.labeled(items)
    else:
        for k, _ in items:
            s.ask(k + ':', blank=False)
            s.lines(1)


GAME_RULES = ['① 서로 다른 색의 색연필을 고르고 가위바위보로 순서를 정해요.',
              '② 첫 번째 사람은 놀이판에서 25보다 작은 수 하나에 ×표 해요.',
              '③ 다음 사람은 ‘약수’나 ‘배수’를 외치고, 앞 사람이 고른 수의 약수나 배수 하나에 ×표 해요.',
              '④ ×표 할 수 있는 수가 없을 때까지 순서대로 계속해요.']
GAME_SHOW = [2, 0, 3, 1]


def strip_ok(strips):
    return [i for i, n in enumerate(range(1, 7)) if all(m % n == 0 for m in strips)]


STRIP = [('㉠', 1), ('㉡', 2), ('㉢', 3), ('㉣', 4), ('㉤', 5), ('㉥', 6)]


# ================================================================ 교과서 차시 버전
def tb1(s, lv):
    s.lesson(1, '개념 찾기(S)', '단원 도입 ― 할머니와 함께 살게 되었어요', '우리 주변에서 약수와 배수는 언제 쓰일까요?')
    s.scene(None, '다음 주부터 할머니께서 윤우네 집에서 같이 사세요. 윤우는 꽃병에 꽃을 나누어 꽂고, 생신 선물 상자를 준비하고, 매일 영양제를 챙겨 드리고, 함께 박수를 치며 걷기로 했어요.')
    step(s, 0, '그림 살펴보기', '두 매미의 이야기')
    s.picture(fig('cicada', svg_cicada()), width_mm=120)
    s.choices([('두 매미는 각각 몇 년마다 나타나나요?', '( 13년마다, 17년마다 /\n13일마다, 17일마다 / 2년마다, 4년마다 )'),
               ('두 매미가 동시에 나타난 해는?', opt('2013년', '2017년', '2024년')),
               ('매미들이 궁금해하는 것은 무엇일까요?', '( 다시 두 매미가 동시에 나타나는 때 /\n매미의 몸길이 / 매미가 우는 소리의 크기 )')])
    step(s, 1, '상황 나누기', '똑같이 나누는 상황, 몇 배만큼 담거나 세는 상황')
    cards = [('귤 10개를 접시 2개에 남김없이 똑같이 나누어 담기', 0), ('꽃 6송이를 꽃병 몇 개에 남김없이 똑같이 나누어 꽂기', 0),
             ('한 묶음에 6개인 음료수를 2묶음 사기', 1), ('매일 영양제를 3알씩, 날수에 따라 챙겨 드리기', 1),
             ('엽서 8장을 4명에게 똑같이 나누어 주기', 0), ('양갱 12개와 약과 16개를 상자에 똑같이 나누어 담기', 0),
             ('2초마다 박수를 치며 걷기', 1)]
    a2 = sort_table(s, lv, cards, ['똑같이 나누는 상황', '몇 배만큼 담거나 세는 상황'])
    step(s, 2, '말해 보기', '나누어 본 경험, 묶음으로 산 경험')
    write_pane(s, lv, [('나누기', '______________ 을 똑같이 나누어 본 적이 있어요.'),
                       ('묶음', '한 묶음에 ____ 개인 ________ 을 ____ 묶음 산 적이 있어요.'),
                       ('궁금', '__________________________________ 이 궁금해요.')])
    step(s, 3, '배운 내용 떠올리기', '3학년 곱셈과 나눗셈')
    a4 = qa(s, [('6 × □ = 42이므로 42 ÷ 6 =', 42 // 6), ('8 × □ = 56이므로 56 ÷ 8 =', 56 // 8), ('13 × 4 =', 13 * 4),
                ('80 ÷ 4 =', 80 // 4), ('72 ÷ 3 =', 72 // 3)])
    step(s, 4, '확인하기', '이 단원에서 배울 내용')
    s.text('이 단원에서 배울 내용에 모두 ○ 하세요.')
    s.choices([('곱셈식과 나눗셈식으로 약수와 배수 찾기', '(    )'), ('공약수와 최대공약수', '(    )'),
               ('공배수와 최소공배수', '(    )'), ('분수의 덧셈과 뺄셈', '(    )')])
    s.choices([('꽃 6송이를 꽃병 몇 개에 남김없이 똑같이 나누어 꽂을 수 있는지 알아볼 때 필요한 것은?', opt('약수', '배수')),
               ('매일 3알씩 먹는 영양제가 날수에 따라 몇 알 필요한지 알아볼 때 필요한 것은?', opt('약수', '배수'))])
    ans = '1차시  ① 13년마다, 17년마다 / 2024년 / 다시 두 매미가 동시에 나타나는 때   ② %s   ③ (자유)   ④ %s   ⑤ 앞의 세 가지에 ○, 약수, 배수' % (
        a2, ' / '.join(a4))
    if lv == '도전형':
        step(s, 5, '도전하기', '나누기와 묶음 세기')
        a6 = qa(s, [('귤 10개를 접시 2개에 남김없이 똑같이 나누어 담으면 한 접시에', 10 // 2, '개'),
                    ('엽서 8장을 4명에게 똑같이 나누어 주면 한 명에게', 8 // 4, '장'),
                    ('한 묶음에 6개인 음료수 2묶음은 모두', 6 * 2, '개'), ('한 묶음에 6개인 음료수 5묶음은 모두', 6 * 5, '개')])
        why(s, '위의 네 문제 중 똑같이 나누는 상황은 어느 것인지, 그렇게 생각한 까닭을 써 보세요.', 1)
        ans += '   ⑥ %s (똑같이 나누는 상황: 귤·엽서)' % ' / '.join(a6)
    return ans


def tb2(s, lv):
    s.lesson(2, '개념 구축하기(O)', '약수를 알아볼까요', '꽃 6송이를 꽃병 몇 개에 남김없이 똑같이 나누어 꽂을 수 있을까요?')
    s.scene(None, '윤우는 할머니께서 좋아하시는 꽃 6송이를 꽃병 몇 개에 남김없이 똑같이 나누어 꽂으려고 해요.')
    step(s, 0, '만져 보기', '꽃병 1개부터 6개까지 나누어 꽂기')
    a1 = share_table(s, 6, '꽃병', '꽃', '송이')
    s.ask('꽃 6송이를 남김없이 똑같이 나누어 꽂을 수 있는 꽃병의 수를 모두 써 보세요.  (                    )개', blank=False)
    s.choices([('구하는 방법으로 알맞은 것은?', '( 6을 나누어떨어지게 하는 수를 구해요 /\n6에 1, 2, 3, …을 곱해요 /\n6보다 작은 수를 모두 구해요 )')])
    step(s, 1, '그려 보기', '나눗셈식으로 알아보기')
    a2 = div_table(s, 6, range(1, 7), [1, 3, 4])
    s.ask('6을 나누어떨어지게 하는 수를 모두 써 보세요.  (                    )', blank=False)
    step(s, 2, '말해 보기', '바둑돌 8개를 한 줄에 똑같은 개수씩')
    s.picture(fig('arr8', svg_arrays(8, [2, 3, 4])), width_mm=150)
    s.text('남는 줄 없이 꽉 차는 방법을 찾아 곱셈식으로 나타내요.')
    a3 = qa(s, [('8 ÷ □ = 4', 2), ('8 ÷ □ = 2', 4), ('1 × 8 = 8, 2 × 4 = 8을 보고 8의 약수를 모두 쓰기', divs(8))])
    if lv == '기본형':
        s.fill('곱이 8이 되는 곱셈식에서 곱하는 두 수는 8의 ( 약수 / 배수 )예요.')
    else:
        why(s, '한 줄에 3개씩 놓으면 왜 꽉 차지 않을까요?', 1)
    step(s, 3, '약속하기', '약수')
    if lv == '기본형':
        s.fill(['6을 나누어떨어지게 하는 수인 1, 2, 3, 6을 6의 ( 약수 / 배수 / 몫 )라고 해요.',
                '어떤 수를 ( 나누어떨어지게 하는 / 1배, 2배, 3배, … 한 ) 수를 그 수의 약수라고 해요.',
                '어떤 수의 약수에는 ( 1과 자기 자신 / 0과 1 / 2와 자기 자신 )이 항상 들어 있어요.'])
    else:
        s.fill(['6을 나누어떨어지게 하는 수인 1, 2, 3, 6을 6의 (          )라고 해요.',
                '어떤 수를 (                          ) 수를 그 수의 약수라고 해요.',
                '어떤 수의 약수에는 (                  )이 항상 들어 있어요.'])
    step(s, 4, '확인하기', '9의 약수에 ○표 하기')
    num_board(s, list(range(1, 10)), 9)
    s.text('9의 약수를 찾은 방법으로 알맞은 것에 모두 ○ 하세요.')
    s.choices([('9를 나누어떨어지게 하는 수를 찾았어요.', '(    )'), ('곱이 9가 되는 곱셈식 1 × 9 = 9, 3 × 3 = 9를 찾았어요.', '(    )'),
               ('9보다 작은 홀수를 모두 찾았어요.', '(    )')])
    ans = '2차시  ① %s → 1, 2, 3, 6개, 6을 나누어떨어지게 하는 수를 구해요   ② %s → %s   ③ %s%s   ④ 약수, 나누어떨어지게 하는, 1과 자기 자신   ⑤ %s에 ○, 앞의 두 가지에 ○' % (
        a1, a2, L(divs(6)), ' / '.join(a3), ', 약수' if lv == '기본형' else ' (예: 8 ÷ 3 = 2 … 2라서 2개가 남아요)', L(divs(9)))
    if lv == '도전형':
        step(s, 5, '도전하기', '수학익힘 약수 문제')
        n24 = [v for v in range(1, 200) if divs(v) == [1, 2, 3, 4, 6, 8, 12, 24]]
        a70 = [v for v in divs(70) if v > 10 and v % 2]
        assert n24 == [24] and a70 == [35] and len(divs(48)) > len(divs(100))
        a6 = qa(s, [('35 ÷ □ = 5', 35 // 5), ('35의 약수를 모두 쓰기', divs(35)), ('28의 약수를 모두 쓰기', divs(28)),
                    ('48과 100 중 약수가 더 많은 수', 48), ('약수가 1, 2, 3, 4, 6, 8, 12, 24인 어떤 수', 24),
                    ('70의 약수 중 10보다 크고 홀수인 수', 35)])
        why(s, '48과 100 중 약수가 더 많은 수를 어떻게 알았는지 써 보세요.', 1)
        ans += '   ⑥ %s (48의 약수 %d개, 100의 약수 %d개)' % (' / '.join(a6), len(divs(48)), len(divs(100)))
    return ans


def tb3(s, lv):
    s.lesson(3, '개념 구축하기(O)', '배수를 알아볼까요', '날수에 따라 필요한 영양제는 몇 알일까요?')
    s.scene(None, '윤우는 매일 할머니께 영양제를 3알씩 챙겨 드리려고 해요.')
    step(s, 0, '만져 보기', '수직선에서 3씩 뛰어 세기')
    s.picture(fig('nl18', svg_numline(18)), width_mm=170)
    s.text('0에서 시작해 3씩 다섯 번 뛰어 세어 화살표를 그려 보세요.')
    a1 = qa(s, [('1일 동안 필요한 영양제', 3, '알'), ('2일 동안 필요한 영양제', 6, '알'), ('3일 동안 필요한 영양제', 9, '알')])
    s.choices([('규칙으로 알맞은 것은?', '( 1일씩 늘어날 때마다 3알씩 늘어나요 /\n1일씩 늘어날 때마다 1알씩 늘어나요 )'),
               ('구하는 방법으로 알맞은 것은?', '( 3에 1배, 2배, 3배, … 한 수를 구해요 /\n3을 나누어떨어지게 하는 수를 구해요 )')])
    step(s, 1, '그려 보기', '곱셈식으로 3을 몇 배 한 수 알아보기')
    a2 = qa(s, [('3을 1배 한 수: 3 × 1 =', 3), ('3을 2배 한 수: 3 × 2 =', 6), ('3을 3배 한 수: 3 × □ = 9', 3),
                ('3을 4배 한 수: 3 × 4 =', 12), ('3을 1배, 2배, 3배 한 수를 차례로', mults(3, 3))])
    step(s, 2, '약속하기', '배수')
    if lv == '기본형':
        s.fill(['3을 1배, 2배, 3배, … 한 수인 3, 6, 9, …를 3의 ( 배수 / 약수 / 곱 )라고 해요.',
                '어떤 수를 ( 1배, 2배, 3배, … / 나누어떨어지게 ) 한 수를 그 수의 배수라고 해요.',
                '어떤 수의 배수는 ( 셀 수 없이 많아요 / 3개뿐이에요 ). 배수 중 가장 작은 수는 ( 자기 자신 / 0 / 1 )이에요.'])
    else:
        s.fill(['3을 1배, 2배, 3배, … 한 수인 3, 6, 9, …를 3의 (          )라고 해요.',
                '어떤 수를 (                    ) 한 수를 그 수의 배수라고 해요.',
                '어떤 수의 배수는 (                ). 배수 중 가장 작은 수는 (            )이에요.'])
    step(s, 3, '4의 배수 찾기', '4의 배수에 색칠하기')
    num_board(s, list(range(1, 21)), 10)
    step(s, 4, '약수와 배수의 관계', '18 = 1 × 18 · 18 = 2 × 9 · 18 = 3 × 6 · 18 = 2 × 3 × 3')
    s.text('옳게 말한 것에 ○, 틀리게 말한 것에 × 하세요.')
    s.choices([('서윤: 2와 9는 18의 약수야.', '( ○ / × )'), ('시우: 18은 2와 9의 배수야.', '( ○ / × )'),
               ('유나: 2 × 3도 18의 약수야.', '( ○ / × )'), ('18은 6의 약수야.', '( ○ / × )')])
    if lv == '기본형':
        s.fill('어떤 수를 여러 수의 곱으로 나타냈을 때, 곱하는 수들은 어떤 수의 ( 약수 / 배수 )이고, 어떤 수는 곱하는 수들의 ( 약수 / 배수 )예요.')
    else:
        s.fill('어떤 수를 여러 수의 곱으로 나타냈을 때, 곱하는 수들은 어떤 수의 (        )이고, 어떤 수는 곱하는 수들의 (        )예요.')
    ans = '3차시  ① %s, 1일씩 늘어날 때마다 3알씩, 3에 1배, 2배, 3배, … 한 수   ② %s   ③ 배수, 1배, 2배, 3배, …, 셀 수 없이 많아요, 자기 자신   ④ %s에 색칠   ⑤ ○, ○, ○, × (18은 6의 배수), 약수, 배수' % (
        ' / '.join(a1), ' / '.join(a2), L(mults_to(4, 20)))
    if lv == '도전형':
        step(s, 5, '도전하기', '5의 배수에 ○표, 8의 배수에 △표')
        num_board(s, list(range(1, 51)), 10)
        near = min(mults_to(12, 120), key=lambda v: abs(v - 100))
        assert near == 96
        a6 = qa(s, [('16의 배수를 가장 작은 수부터 5개', mults(16, 5)), ('26의 배수 중 두 자리 수는 몇 개?', len(mults_to(26, 99)), '개'),
                    ('도훈: 12의 배수야. 민영: 그중 100에 가장 가까운 수야. 두 사람이 설명하는 수', near)])
        s.choices([('30 = 2 × 3 × 5를 보고 옳게 말한 것은?', '( ㉠ 30은 2 × 3의 약수예요 /\n㉡ 30의 약수는 2, 3, 5뿐이에요 /\n㉢ 2 × 5는 30의 배수예요 /\n㉣ 5는 30의 약수예요 )')])
        ans += '   ⑥ ○ %s / △ %s, %s, ㉣' % (L(mults_to(5, 50)), L(mults_to(8, 50)), ' / '.join(a6))
    return ans


def tree_fill(s, lv, a, b):
    """두 수를 여러 수의 곱으로 나타내는 칸."""
    rows = []
    for n in (a, b):
        lf = leaves(n)
        if lv == '기본형':
            rows.append('%d = %d × (      ) = %s' % (n, lf[0], ' × '.join([str(lf[0])] + ['(    )'] * (len(lf) - 1))))
        else:
            rows.append('%d = ______________________________' % n)
    s.fill(rows)
    return '%d = %s, %d = %s' % (a, X(leaves(a)), b, X(leaves(b)))


def tb45(s, lv):
    s.lesson('4~5', '개념 구축하기(O)', '공약수와 최대공약수를 알아볼까요', '양갱 12개와 약과 16개를 상자 몇 개에 남김없이 똑같이 나누어 담을 수 있을까요?')
    s.scene(None, '할머니 생신 기념 선물로 윤우는 양갱 12개와 약과 16개를 상자에 남김없이 똑같이 나누어 담으려고 해요.')
    step(s, 0, '만져 보기', '똑같이 나누어 담을 수 있는 상자 수에 ○표 하기')
    row_table(s, '양갱 12개', list(range(1, 13)))
    row_table(s, '약과 16개', list(range(1, 17)))
    com = both(divs(12), divs(16))
    a1 = qa(s, [('양갱과 약과를 모두 남김없이 똑같이 나누어 담을 수 있는 상자 수를 모두', com, '개'),
                ('최대한 많은 상자에 똑같이 나누어 담는다면 상자는', gcd(12, 16), '개')])
    if lv == '기본형':
        s.fill('그때 한 상자에 양갱 (      )개, 약과 (      )개씩이에요.')
    step(s, 1, '약속하기', '공약수와 최대공약수')
    a2 = qa(s, [('8의 약수를 모두', divs(8)), ('12의 약수를 모두', divs(12)), ('8과 12의 공통된 약수를 모두', both(divs(8), divs(12))),
                ('공통된 약수 중 가장 큰 수', gcd(8, 12))])
    if lv == '기본형':
        s.fill(['8과 12의 공통된 약수인 1, 2, 4를 8과 12의 ( 공약수 / 공배수 / 최대공약수 )라고 해요.',
                '공약수 중에서 가장 큰 수인 4를 8과 12의 ( 최대공약수 / 최소공배수 / 공약수 )라고 해요.'])
    else:
        s.fill(['8과 12의 공통된 약수인 1, 2, 4를 8과 12의 (            )라고 해요.',
                '공약수 중에서 가장 큰 수인 4를 8과 12의 (              )라고 해요.'])
    step(s, 2, '공약수와 최대공약수의 관계', '두 줄에 모두 있는 수끼리 잇기')
    row_table(s, '24의 약수', divs(24))
    row_table(s, '32의 약수', divs(32))
    a3 = qa(s, [('24와 32의 최대공약수', gcd(24, 32)), ('최대공약수 8의 약수를 모두', divs(8)), ('24와 32의 공약수 중 가장 작은 수', 1)])
    s.choices([('알게 된 점으로 알맞은 것은?', '( 최대공약수의 약수는 공약수와 같아요 /\n최대공약수의 배수는 공약수와 같아요 /\n공약수는 최대공약수보다 커요 )')])
    s.page_break()
    step(s, 3, '여러 수의 곱으로 구하기', '12와 18, 30과 45')
    t1 = tree_fill(s, lv, 12, 18)
    s.ask('공통으로 들어 있는 수를 모두 곱하면 12와 18의 최대공약수 = (            )', blank=False)
    t2 = tree_fill(s, lv, 30, 45)
    s.ask('30과 45의 최대공약수 = (            )', blank=False)
    s.choices([('여러 수의 곱으로 나타낸 식으로 최대공약수를 구하는 방법은?', '( 식에 공통으로 들어 있는 수를 모두 곱해요 /\n식에 있는 수를 모두 곱해요 /\n식에서 가장 큰 수를 골라요 )')])
    step(s, 4, '공약수로 나누어 구하기', '어떤 공약수로 먼저 나누어도 괜찮아요')
    s.picture(ladder_fig(12, 18, lv), width_mm=55)
    s.picture(ladder_fig(30, 45, lv), width_mm=55)
    s.ask('12와 18의 최대공약수 (        ),  30과 45의 최대공약수 (        )', blank=False)
    s.ask('12와 18을 6으로 한 번에 나누면 몫은 2와 3이에요. 이때 최대공약수는?  (      )', blank=False)
    if lv == '기본형':
        s.fill('두 수의 공약수로 더 이상 나눌 수 없을 때까지 나누고, 나눈 ( 공약수 / 마지막 몫 )를 모두 곱해요.')
    else:
        why(s, '공약수로 나누어 최대공약수를 구하는 방법을 써 보세요.', 1)
    ans = '4~5차시  ① %s%s   ② %s, 공약수, 최대공약수   ③ %s, 최대공약수의 약수는 공약수와 같아요   ④ %s → %d, %s → %d, 공통으로 들어 있는 수를 모두 곱해요   ⑤ %s / %s, 6' % (
        ' / '.join(a1), ', 양갱 %d개, 약과 %d개' % (12 // 4, 16 // 4) if lv == '기본형' else '', ' / '.join(a2), ' / '.join(a3),
        t1, gcd(12, 18), t2, gcd(30, 45), ladder_text(12, 18, 'gcd'), ladder_text(30, 45, 'gcd'))
    ans += ', 공약수' if lv == '기본형' else ', 더 이상 나눌 수 없을 때까지 나누고 나눈 공약수를 모두 곱해요'
    if lv == '도전형':
        step(s, 5, '도전하기', '그림 맞추기 퍼즐과 수학익힘')
        s.text('가로 15 cm, 세로 9 cm인 직사각형 모양의 사진을 크기가 같은 정사각형 모양으로 남는 부분 없이 나누어 퍼즐을 만들려고 해요.')
        s.picture(fig('grid15x9', svg_grid(15, 9)), width_mm=125)
        g = gcd(15, 9)
        a6 = qa(s, [('가장 큰 정사각형의 한 변의 길이', g, 'cm'), ('그때 정사각형 조각은 모두', (15 // g) * (9 // g), '개'),
                    ('연필 78자루와 볼펜 84자루를 최대한 많은 사람에게 남김없이 똑같이 나누어 주려면', gcd(78, 84), '명')])
        s.ask('정원: ‘54와 72의 공약수 중에서 가장 작은 수는 6이야.’ 바르게 고쳐 써 보세요.', blank=False)
        s.lines(1)
        ans += '   ⑥ %s, 54와 72의 공약수 중에서 가장 작은 수는 1이야.' % ' / '.join(a6)
    return ans


def tb67(s, lv):
    s.lesson('6~7', '개념 구축하기(O)', '공배수와 최소공배수를 알아볼까요', '윤우와 할머니가 다시 박수를 동시에 치는 때는 몇 초 후일까요?')
    s.scene(None, '할머니의 건강을 위해 윤우와 할머니는 박수를 치며 걷기로 했어요. 윤우는 2초마다, 할머니는 3초마다 박수를 쳐요.')
    step(s, 0, '만져 보기', '박수를 치는 때에 ○표 하기')
    row_table(s, '윤우(초)', list(range(1, 14)))
    row_table(s, '할머니(초)', list(range(1, 14)))
    com = both(mults_to(2, 13), mults_to(3, 13))
    a1 = qa(s, [('13초까지 두 사람이 다시 박수를 동시에 치는 때를 모두', com, '초 후'),
                ('처음으로 다시 박수를 동시에 치는 때', lcm(2, 3), '초 후')])
    step(s, 1, '약속하기', '공배수와 최소공배수')
    a2 = qa(s, [('4의 배수를 가장 작은 수부터 6개', mults(4, 6)), ('6의 배수를 가장 작은 수부터 6개', mults(6, 6)),
                ('위에서 쓴 수 중 4와 6의 공통된 배수를 모두', both(mults(4, 6), mults(6, 6))), ('공통된 배수 중 가장 작은 수', lcm(4, 6))])
    if lv == '기본형':
        s.fill(['4와 6의 공통된 배수인 12, 24, …를 4와 6의 ( 공배수 / 공약수 / 최소공배수 )라고 해요.',
                '공배수 중에서 가장 작은 수인 12를 4와 6의 ( 최소공배수 / 최대공약수 / 공배수 )라고 해요.'])
    else:
        s.fill(['4와 6의 공통된 배수인 12, 24, …를 4와 6의 (            )라고 해요.',
                '공배수 중에서 가장 작은 수인 12를 4와 6의 (              )라고 해요.'])
        why(s, '4와 6의 최소공배수가 4와 6보다 작을 수 없는 까닭을 써 보세요.', 1)
    step(s, 2, '공배수와 최소공배수의 관계', '두 줄에 모두 있는 수끼리 잇기')
    row_table(s, '6의 배수', mults(6, 10))
    row_table(s, '9의 배수', mults(9, 10))
    a3 = qa(s, [('6과 9의 최소공배수', lcm(6, 9)), ('최소공배수 18의 배수를 가장 작은 수부터 3개', mults(18, 3))])
    s.choices([('알게 된 점으로 알맞은 것은?', '( 최소공배수의 배수는 공배수와 같아요 /\n최소공배수의 약수는 공배수와 같아요 /\n공배수는 3개뿐이에요 )')])
    s.page_break()
    step(s, 3, '여러 수의 곱으로 구하기', '18과 30, 9와 21')
    t1 = tree_fill(s, lv, 18, 30)
    s.ask('18의 배수 18, 36, 54, 72, 90과 30의 배수 30, 60, 90, 120, 150에서 찾은 최소공배수: (        )', blank=False)
    s.ask('공통인 2 × 3은 한 번만, 남은 3과 5를 곱하면 18과 30의 최소공배수 = (            )', blank=False)
    t2 = tree_fill(s, lv, 9, 21)
    s.ask('9와 21의 최소공배수 = (            )', blank=False)
    s.choices([('여러 수의 곱으로 나타낸 식으로 최소공배수를 구하는 방법은?', '( 공통으로 들어 있는 수는 한 번만 곱하고,\n공통이 아닌 남은 수를 곱해요 /\n식에 있는 수를 모두 곱해요 /\n공통으로 들어 있는 수만 곱해요 )')])
    step(s, 4, '공약수로 나누어 구하기', '나눈 공약수와 마지막 몫을 모두 곱해요(ㄴ자 모양)')
    s.picture(ladder_fig(18, 30, lv), width_mm=55)
    s.picture(ladder_fig(9, 21, lv), width_mm=55)
    s.ask('18과 30의 최소공배수 (        ),  9와 21의 최소공배수 (        )', blank=False)
    s.ask('18과 30을 최대공약수 6으로 한 번에 나누면 몫은 3과 5예요. 최소공배수 6 × 3 × 5 = (        )', blank=False)
    if lv == '기본형':
        s.fill('더 이상 나눌 수 없을 때까지 나누고, 나눈 공약수와 ( 마지막 몫 / 처음 두 수 )을 모두 곱해요.')
    assert lcm(18, 30) == 6 * 3 * 5
    ans = '6~7차시  ① %s   ② %s, 공배수, 최소공배수%s   ③ %s, 최소공배수의 배수는 공배수와 같아요   ④ %s → %d, %d, %s → %d   ⑤ %s / %s, 90%s' % (
        ' / '.join(a1), ' / '.join(a2), '' if lv == '기본형' else ' (예: 공배수는 4의 배수이면서 6의 배수라서 4와 6보다 크거나 같아요)',
        ' / '.join(a3), t1, lcm(18, 30), lcm(18, 30), t2, lcm(9, 21), ladder_text(18, 30, 'lcm'), ladder_text(9, 21, 'lcm'),
        ', 마지막 몫' if lv == '기본형' else '')
    if lv == '도전형':
        step(s, 5, '도전하기', '놀이공원 열차')
        s.text('코끼리 열차는 6분마다, 호랑이 열차는 10분마다 출발해요. 두 열차가 오후 2시 20분에 동시에 출발했어요. 수직선에 두 열차가 출발하는 때를 표시해 보세요.')
        s.picture(fig('nl60', svg_numline(60, 2, 10, zero='0 = 오후 2시 20분')), width_mm=170)
        m = lcm(6, 10)
        a6 = qa(s, [('두 열차는 몇 분마다 동시에 출발하나요?', m, '분'), ('다음번에 두 열차가 동시에 출발하는 시각', '오후 2시 %d분' % (20 + m)),
                    ('54와 18의 최소공배수', lcm(54, 18)), ('8과 20의 공배수 중에서 100보다 작은 수는 몇 개?', len(mults_to(lcm(8, 20), 99)), '개')])
        assert 20 + m == 50
        ans += '   ⑥ 코끼리 %s / 호랑이 %s, %s' % (L(mults_to(6, 60)), L(mults_to(10, 60)), ' / '.join(a6))
    return ans


def tb8(s, lv):
    s.lesson(8, '탐구 정리하기(O)', '생각을 더하다 ― 체육 대회에 어떻게 입장해야 할까요', '남학생과 여학생이 몇 명씩 몇 줄로 줄을 서는 방법은 각각 몇 가지일까요?')
    s.scene(None, ['지한이의 일기: 기다리고 기다리던 어린이날 기념 체육 대회가 며칠 후에 열린다. 우리 학교 5학년 학생들은 동물 가면을 쓰고 입장을 하기로 했다. 남학생과 여학생이 따로 입장할 때 남학생과 여학생이 각각 줄을 서는 방법에 대해 알아보기로 했다. 남학생과 여학생이 몇 명씩 몇 줄로 줄을 서는 방법은 각각 몇 가지일까?',
                   '조건  1. 5학년은 6개의 반이 있습니다.  2. 5학년 각 반의 남학생은 12명입니다.  3. 5학년 여학생은 모두 84명입니다.'])
    step(s, 0, '이해해요')
    s.choices([('구하려는 것은 무엇인가요?', '( 남학생과 여학생이 각각 줄을 서는 방법의 가짓수 /\n5학년 반의 수 / 동물 가면의 수 )')])
    a1 = qa(s, [('5학년 반의 수', 6, '개'), ('5학년 각 반의 남학생 수', 12, '명'), ('5학년 여학생 수', 84, '명')])
    step(s, 1, '계획해요')
    s.choices([('5학년 남학생 수는 어떻게 구할까요?', '( 각 반의 남학생 수와 반의 수를 곱해요 /\n각 반의 남학생 수와 반의 수를 더해요 )'),
               ('줄을 서는 방법의 가짓수는 무엇을 이용해 구할까요?', opt('학생 수의 약수', '학생 수의 배수')),
               ('‘6명씩 12줄’과 ‘12명씩 6줄’은?', '( 서로 다른 방법으로 세어요 /\n같은 방법이라 한 번만 세어요 )')])
    a2 = qa(s, [('5학년 남학생 수 12 × 6 =', 12 * 6, '명')])
    step(s, 2, '해결해요 ① 남학생', '72명이 한 줄에 똑같은 수씩')
    p1 = pair_table(s, 72, lv, '학생 수', '명')
    a3 = qa(s, [('72의 약수를 모두', divs(72)), ('남학생이 줄을 서는 방법', len(divs(72)), '가지')])
    step(s, 3, '해결해요 ② 여학생', '84명이 한 줄에 똑같은 수씩')
    p2 = pair_table(s, 84, lv, '학생 수', '명')
    a4 = qa(s, [('84의 약수를 모두', divs(84)), ('여학생이 줄을 서는 방법', len(divs(84)), '가지')])
    step(s, 4, '되돌아봐요')
    if lv == '기본형':
        s.labeled([('방법', '남학생 수를 ________ 로 구하고, 72의 ________ 의 개수를 세었어요.'),
                   ('까닭', '학생들을 몇 명씩 똑같이 ________ 서야 하니까 ________ 를 이용했어요.')])
    else:
        why(s, '어떤 방법으로 해결했는지 설명해 보세요.', 1)
        why(s, '약수와 배수 중 무엇을 이용했고, 왜 그랬는지 써 보세요.', 1)
    ans = '8차시  ① 줄을 서는 방법의 가짓수, %s   ② 곱해요, 학생 수의 약수, 서로 다른 방법, %s   ③ %s / %s   ④ %s / %s   ⑤ 예) 12 × 6 = 72, 약수 / 나누어, 약수' % (
        ' / '.join(a1), ' / '.join(a2), p1, ' / '.join(a3), p2, ' / '.join(a4))
    if lv == '도전형':
        step(s, 5, '도전하기', '봄맞이 마을 축제 입장')
        s.text('5학년은 5개의 반이 있고 각 반의 여학생은 14명, 5학년 남학생은 모두 80명이에요. 여학생과 남학생이 따로 입장할 때 줄을 서는 방법은 각각 몇 가지일까요?')
        a6 = qa(s, [('5학년 여학생 수 14 × 5 =', 14 * 5, '명'), ('70의 약수를 모두', divs(70)), ('여학생이 줄을 서는 방법', len(divs(70)), '가지'),
                    ('80의 약수를 모두', divs(80)), ('남학생이 줄을 서는 방법', len(divs(80)), '가지')])
        ans += '   ⑥ %s' % ' / '.join(a6)
    return ans


def tb9(s, lv):
    s.lesson(9, '발표하기(P)', '놀이를 더하다 ― 약수와 배수 이어달리기', '앞 사람이 고른 수의 약수나 배수를 찾아 이어 갈 수 있을까요?')
    s.scene(None, '놀이판에는 1부터 50까지의 수가 있어요. 앞 사람이 고른 수의 약수나 배수 중 아직 ×표 하지 않은 수를 골라 ×표 해요.')
    step(s, 0, '놀이 방법 알기', '차례대로 번호 쓰기')
    a1 = order_rules(s, GAME_RULES, GAME_SHOW)
    step(s, 1, '규칙 알기')
    s.choices([('첫 번째 사람이 고를 수 있는 수는?', opt('25보다 작은 수', '25보다 큰 수', '아무 수나'))])
    a2 = qa(s, [('첫 번째 사람이 20에 ×표 했어요. ‘약수!’를 외쳤다면 ×표 할 수 있는 수를 모두', [v for v in divs(20) if v != 20]),
                ('‘배수!’를 외쳤다면 놀이판(1~50)에서 ×표 할 수 있는 수를 모두', [v for v in mults_to(20, 50) if v != 20])])
    step(s, 2, '놀이하기', '친구와 약수와 배수 이어달리기')
    num_board(s, list(range(1, 51)), 10)
    s.ask('내가 ×표 한 수를 차례로 써 보세요: ______________________________________', blank=False)
    step(s, 3, '전략 생각하기', '놀이판(1~50)을 떠올리며')
    a4 = qa(s, [('앞 사람이 17에 ×표 했어요(다른 수는 아직 ×표 하지 않았어요). ×표 할 수 있는 수를 모두', [v for v in divs(17) + mults_to(17, 50) if v != 17])])
    s.choices([('앞 사람이 49에 ×표 했고, 1과 7에는 이미 ×표 되어 있어요. 다음 사람은 어떻게 될까요?', '( ×표 할 수 있는 수가 없어요 /\n98에 ×표 해요 / 14에 ×표 해요 )'),
               ('1에 ×표 하면 다음 사람은 어떤 수를 고를 수 있을까요?', '( ×표 하지 않은 아무 수나 /\n1의 약수만 )')])
    step(s, 4, '또 다른 놀이', '약수 카드를 한 번에 여러 장')
    s.text('각자 1~20 중 10개의 수를 카드에 써서 놀이해요. 앞 사람이 내려놓은 수의 약수가 쓰인 카드를 한 번에 여러 장 내려놓을 수 있어요.')
    hand = [3, 5, 6, 8, 18, 4]
    ok12 = [v for v in hand if 12 % v == 0]
    s.ask('앞 사람이 12를 내려놓았어요. 내 카드 %s 중 내려놓을 수 있는 카드에 모두 ○ 하세요.' % L(hand), blank=False)
    s.choices([('이 놀이에서 이기는 사람은?', '( 가장 먼저 카드를 모두 내려놓은 사람 /\n카드를 가장 많이 가진 사람 )')])
    ans = '9차시  ① %s   ② 25보다 작은 수, %s   ③ (놀이)   ④ %s, ×표 할 수 있는 수가 없어요, ×표 하지 않은 아무 수나(모든 수는 1의 배수)   ⑤ %s, 가장 먼저 카드를 모두 내려놓은 사람' % (
        a1, ' / '.join(a2), ' / '.join(a4), L(ok12))
    if lv == '도전형':
        step(s, 5, '도전하기', '이기는 전략')
        why(s, '상대가 ×표 할 수 있는 수가 없게 만들려면 어떤 수를 고르면 좋을까요? 까닭과 함께 써 보세요.', 2)
        ans += '   ⑥ 예) 약수와 배수가 놀이판에 거의 없는 수(47, 49처럼 큰 수)를 골라요. 1을 고르면 상대가 아무 수나 고를 수 있어요.'
    return ans


def tb10(s, lv):
    s.lesson(10, '발표하기(P)', '공부한 내용을 확인해요', '약수와 배수, 최대공약수와 최소공배수를 구하고 활용할 수 있나요?')
    step(s, 0, '약수와 배수 쓰기')
    a1 = qa(s, [('52의 약수를 모두', divs(52)), ('8의 배수를 가장 작은 수부터 5개', mults(8, 5)), ('11의 배수를 가장 작은 수부터 5개', mults(11, 5))])
    s.choices([('35 = 1 × 35, 35 = 5 × 7이에요. ‘1, 5, 7, 35는 35의 □예요.’', opt('약수', '배수')),
               ('‘35는 1, 5, 7, 35의 □예요.’', opt('약수', '배수'))])
    step(s, 1, '종이띠 채우기', '한 가지 조각만 골라 9칸, 12칸 띠를 모두 채우기')
    s.picture(fig('strip9_12', svg_strips([9, 12], STRIP)), width_mm=125)
    okp = strip_ok([9, 12])
    s.ask('두 종이띠를 모두 채울 수 있는 조각을 모두 쓰세요.  (                    )', blank=False)
    step(s, 2, '최대공약수와 최소공배수', '공약수로 나누어 구하기')
    s.picture(ladder_fig(30, 50, lv), width_mm=55)
    s.picture(ladder_fig(72, 54, lv), width_mm=55)
    s.table([['', '최대공약수', '최소공배수'], ['30과 50', '(        )', '(        )'], ['72와 54', '(        )', '(        )']])
    step(s, 3, '생활 속 문제')
    g, m = gcd(84, 56), lcm(6, 8)
    a4 = qa(s, [('물 84병, 담요 56개를 최대한 많은 상자에 남김없이 똑같이 나누어 담으려면 필요한 상자', g, '개'),
                ('분홍색 빛은 6초마다, 파란색 빛은 8초마다 깜박여요. 지금 동시에 깜박였다면 다시 동시에 깜박이는 때', m, '초 후'),
                ('두 빛이 동시에 깜박인 후 2분 동안 동시에 몇 번 깜박일까요?', 120 // m, '번')])
    step(s, 4, '확인하고 정리해요')
    a5 = qa(s, [('8의 약수: 1, □, 4, 8', 2), ('20의 약수 1, 2, 4, 5, 10, 20과 견주면 8과 20의 최대공약수', gcd(8, 20)),
                ('3과 4의 공배수: 12, □, 36, …', 24), ('3과 4의 최소공배수', lcm(3, 4))])
    s.choices([('‘어떤 수를 나누어떨어지게 하는 수’는?', opt('약수', '배수')), ('‘어떤 수를 1배, 2배, 3배, … 한 수’는?', opt('약수', '배수'))])
    ans = '10차시  ① %s, 약수, 배수   ② %s   ③ %s / %s   ④ %s   ⑤ %s, 약수, 배수' % (
        ' / '.join(a1), ', '.join(STRIP[i][0] for i in okp), ladder_text(30, 50), ladder_text(72, 54), ' / '.join(a4), ' / '.join(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '단원 첫 쪽의 매미 문제')
        s.text('13년마다 나타나는 매미와 17년마다 나타나는 매미가 2024년에 동시에 나타났대요.')
        a6 = qa(s, [('두 매미는 몇 년마다 동시에 나타날까요?', lcm(13, 17), '년'), ('다음에 두 매미가 다시 동시에 나타나는 해', 2024 + lcm(13, 17), '년')])
        s.picture(fig('ldq36', svg_ladder([('3', '36', '㉠'), ('3', '㉡', '15')], ('㉢', '5'))), width_mm=55)
        e1 = 15 * 3
        e2 = 36 // 3
        e3 = e2 // 3
        assert e1 % 3 == 0 and e2 == 12 and e3 == 4 and 15 // 3 == 5
        a7 = qa(s, [('㉠', e1), ('㉡', e2), ('㉢', e3), ('36과 ㉠의 최소공배수', lcm(36, e1))])
        ans += '   ⑥ %s, %s' % (' / '.join(a6), ' / '.join(a7))
    return ans


# ================================================================ 이야기 버전
def st1(s, lv):
    s.lesson(1, '개념 찾기(S)', '학급 장터 준비단이 모였어요', '학급 장터를 준비할 때 약수와 배수는 언제 쓰일까요?')
    s.scene(None, '해든초등학교 5학년 2반은 학기 말에 ‘학급 장터’를 열기로 했어요. 반장 서진이와 민호, 예린, 태오, 하윤이가 장터 준비단이 되어 일을 나누어 맡았어요.')
    step(s, 0, '만져 보기', '보기·생각하기·궁금해하기')
    s.fill(['📋 학급 장터 준비 계획표', '· 쿠키 24개를 봉지 몇 개에 남김없이 똑같이 나누어 담기', '· 사탕 18개와 젤리 12개로 똑같은 선물 꾸러미 만들기',
            '· 홍보 포스터를 날마다 4장씩 붙이기', '· 장터 날 풍선 이벤트는 4분마다, 뽑기 이벤트는 6분마다 시작하기', '· 놀이 부스: 약수와 배수 이어달리기'])
    write_pane(s, lv, [('보여요', '계획표에 ____________________________ 이 보여요.'),
                       ('생각해요', '________ 하려면 ________________ 을 알아야 할 것 같아요.'),
                       ('궁금해요', '______________________________ 은 어떻게 구할까?')])
    step(s, 1, '그려 보기', '나누는 일, 되풀이되는 일')
    cards = [('쿠키 24개를 봉지 몇 개에 똑같이 나누어 담기', 0), ('색 도화지 한 장을 크기가 같은 가격표로 남김없이 자르기', 0),
             ('사탕 18개를 친구들에게 똑같이 나누어 주기', 0), ('홍보 포스터를 날마다 4장씩 붙이기', 1),
             ('풍선 이벤트를 4분마다 시작하기', 1), ('한 상자에 6개씩 든 주스를 3상자 사기', 1)]
    a2 = sort_table(s, lv, cards, ['남김없이 똑같이 나누는 일', '몇 배씩 늘어나거나 되풀이되는 일'])
    thenwhy(s, lv, '‘쿠키를 봉지에 똑같이 나누는 일’과 ‘포스터를 날마다 4장씩 붙이는 일’은 무엇이 다를까요?',
            '쿠키는 정해진 수를 ______________ 일이고, 포스터는 4장씩 ______________ 일이에요.')
    step(s, 2, '말해 보기', '나누어 본 경험, 묶음으로 센 경험')
    write_pane(s, lv, [('나누기', '______ ____개를 ____명이 ____개씩 똑같이 나누었어요.'),
                       ('묶음', '한 묶음에 ____개씩 ____묶음이라서 모두 ____개예요.')])
    step(s, 3, '약속하기', '이 단원에서 배울 것')
    s.text('이 단원에서 배울 내용에 모두 ○ 하세요.')
    s.choices([('곱셈식과 나눗셈식으로 약수와 배수 찾기', '(    )'), ('공약수와 최대공약수', '(    )'),
               ('공배수와 최소공배수', '(    )'), ('분수의 덧셈과 뺄셈', '(    )')])
    s.choices([('쿠키 24개를 봉지 몇 개에 남김없이 똑같이 나누어 담을 수 있는지 알아볼 때 필요한 것은?', opt('약수', '배수')),
               ('포스터를 날마다 4장씩 붙일 때 날수에 따라 몇 장인지 알아볼 때 필요한 것은?', opt('약수', '배수'))])
    step(s, 4, '확인하기', '곱셈과 나눗셈 떠올리기')
    a5 = qa(s, [('4 × □ = 24이므로 24 ÷ 4 =', 24 // 4), ('7 × □ = 63이므로 63 ÷ 7 =', 63 // 7), ('15 × 4 =', 15 * 4),
                ('90 ÷ 5 =', 90 // 5), ('84 ÷ 7 =', 84 // 7)])
    ans = '1차시  ① (자유)   ② %s / 예) 쿠키는 정해진 24개를 남김없이 똑같이 나누는 일이고, 포스터는 4장, 8장, 12장, …처럼 4의 몇 배씩 늘어나는 일이에요   ③ (자유)   ④ 앞의 세 가지에 ○, 약수, 배수   ⑤ %s' % (
        a2, ' / '.join(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 장터 준비물')
        a6 = qa(s, [('쿠키 24개를 한 봉지에 4개씩 담으면 봉지는', 24 // 4, '개'), ('사탕 18개를 3명에게 똑같이 나누어 주면 한 명에게', 18 // 3, '개'),
                    ('포스터를 날마다 4장씩 5일 동안 붙이면 모두', 4 * 5, '장'), ('한 상자에 6개씩 든 주스 3상자는 모두', 6 * 3, '개')])
        ans += '   ⑥ %s' % ' / '.join(a6)
    return ans


def st2(s, lv):
    s.lesson(2, '개념 구축하기(O)', '쿠키를 봉지에 똑같이 나누어요 ― 약수', '쿠키를 봉지 몇 개에 남김없이 똑같이 나누어 담을 수 있을까요?')
    s.scene(None, '장터에서 팔 쿠키를 봉지에 남김없이 똑같이 나누어 담으려고 해요. 민호가 먼저 쿠키 8개로 연습해요.')
    step(s, 0, '만져 보기', '쿠키 나누어 담기')
    rule_first(s, '쿠키 8개를 봉지 몇 개에 똑같이 나누어 담을 수 있을까요?', lv, '내 규칙: 8 ÷ (봉지 수)가 ______________ 때 똑같이 나눌 수 있어요.')
    a1 = share_table(s, 8, '봉지', '쿠키', '개')
    s.ask('쿠키 8개를 남김없이 똑같이 나누어 담을 수 있는 봉지의 수를 모두 써 보세요.  (                    )개', blank=False)
    s.choices([('봉지 수를 구하는 방법으로 알맞은 것은?', '( 8을 나누어떨어지게 하는 수를 구해요 /\n8에 1, 2, 3, …을 곱해요 /\n8보다 작은 수를 모두 구해요 )')])
    s.ask('예상이 맞았나요?  ( 맞았어요 / 고쳤어요 )', blank=False)
    step(s, 1, '그려 보기', '마카롱 12개 ― 나눗셈식으로 알아보기')
    a2 = div_table(s, 12, range(1, 13), [1, 4, 8, 9, 10, 11])
    s.ask('12를 나누어떨어지게 하는 수를 모두 써 보세요.  (                         )', blank=False)
    step(s, 2, '말해 보기', '스티커 18장 ― 곱셈식으로 찾기')
    s.text('태오는 장터 스티커 18장을 판에 한 줄에 똑같은 수씩 붙이려고 해요. 모든 줄이 꽉 차는 방법을 찾아요.')
    s.picture(fig('arr18', svg_arrays(18, [3, 4, 6], '#8A6FD1')), width_mm=160)
    a3 = qa(s, [('18 ÷ □ = 6', 3), ('1 × 18 = 18, 2 × 9 = 18, 3 × 6 = 18을 보고 18의 약수를 모두', divs(18))])
    thenwhy(s, lv, '곱이 18이 되는 곱셈식으로 약수를 찾으면 왜 편리할까요?',
            '곱셈식 하나에서 약수를 ____개씩 짝 지어 찾을 수 있어서 ______________ 해요.')
    step(s, 3, '약속하기', '약수')
    if lv == '기본형':
        s.fill(['12를 나누어떨어지게 하는 수인 1, 2, 3, 4, 6, 12를 12의 ( 약수 / 배수 / 몫 )라고 해요.',
                '어떤 수를 ( 나누어떨어지게 하는 / 1배, 2배, 3배, … 한 ) 수를 그 수의 약수라고 해요.',
                '어떤 수의 약수에는 ( 1과 자기 자신 / 0과 1 / 2와 자기 자신 )이 항상 들어 있어요.'])
    else:
        s.fill(['12를 나누어떨어지게 하는 수인 1, 2, 3, 4, 6, 12를 12의 (          )라고 해요.',
                '어떤 수를 (                          ) 수를 그 수의 약수라고 해요.',
                '어떤 수의 약수에는 (                  )이 항상 들어 있어요.'])
    step(s, 4, '확인하기', '젤리 16개 ― 16의 약수에 ○표 하기')
    num_board(s, list(range(1, 17)), 8)
    s.text('16의 약수를 찾은 방법으로 알맞은 것에 모두 ○ 하세요.')
    s.choices([('16을 나누어떨어지게 하는 수를 찾았어요.', '(    )'), ('곱이 16이 되는 곱셈식 1 × 16, 2 × 8, 4 × 4를 찾았어요.', '(    )'),
               ('16보다 작은 짝수를 모두 찾았어요.', '(    )')])
    ans = '2차시  ① 예) 8 ÷ (봉지 수)가 나누어떨어질 때 / %s → 1, 2, 4, 8개, 8을 나누어떨어지게 하는 수를 구해요   ② %s → %s   ③ %s / 예) 2 × 9 = 18이면 2와 9가 둘 다 약수라서 두 개씩 짝 지어 빠뜨리지 않고 빨리 찾을 수 있어요   ④ 약수, 나누어떨어지게 하는, 1과 자기 자신   ⑤ %s에 ○, 앞의 두 가지에 ○' % (
        a1, a2, L(divs(12)), ' / '.join(a3), L(divs(16)))
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 약수 구하기')
        n21 = [v for v in range(1, 200) if divs(v) == [1, 3, 7, 21]]
        a42 = [v for v in divs(42) if v > 10 and v % 2]
        assert n21 == [21] and a42 == [21]
        more = 36 if len(divs(36)) > len(divs(40)) else 40
        a6 = qa(s, [('20 ÷ □ = 4', 20 // 4), ('30의 약수를 모두', divs(30)), ('36과 40 중 약수가 더 많은 수', more),
                    ('약수가 1, 3, 7, 21인 어떤 수', 21), ('42의 약수 중 10보다 크고 홀수인 수', 21)])
        ans += '   ⑥ %s (36의 약수 %d개, 40의 약수 %d개)' % (' / '.join(a6), len(divs(36)), len(divs(40)))
    return ans


def st3(s, lv):
    s.lesson(3, '개념 구축하기(O)', '날마다 홍보 포스터를 붙여요 ― 배수', '날수에 따라 붙인 포스터는 모두 몇 장일까요?')
    s.scene(None, '홍보 담당 태오는 날마다 포스터를 4장씩 붙이기로 했어요.')
    step(s, 0, '만져 보기', '4장씩 뛰어 세기')
    s.picture(fig('nl24', svg_numline(24)), width_mm=170)
    s.text('0에서 시작해 4씩 다섯 번 뛰어 세어 화살표를 그려 보세요.')
    a1 = qa(s, [('1일 동안 붙인 포스터', 4, '장'), ('2일 동안 붙인 포스터', 8, '장'), ('5일 동안 붙인 포스터', 4 * 5, '장')])
    s.choices([('규칙으로 알맞은 것은?', '( 1일씩 늘어날 때마다 4장씩 늘어나요 /\n1일씩 늘어날 때마다 1장씩 늘어나요 )')])
    step(s, 1, '그려 보기', '곱셈식으로 나타내기')
    a2 = qa(s, [('4를 1배 한 수: 4 × 1 =', 4), ('4를 2배 한 수: 4 × 2 =', 8), ('4를 3배 한 수: 4 × □ = 12', 3),
                ('4를 6배 한 수: 4 × 6 =', 24), ('4를 1배, 2배, 3배, 4배 한 수를 차례로', mults(4, 4))])
    thenwhy(s, lv, '4를 몇 배 한 수는 끝이 있을까요? 왜 그렇게 생각하나요?',
            '4에 곱하는 수를 계속 ______________ 수 있어서 4를 몇 배 한 수는 ______________.')
    step(s, 2, '약속하기', '배수')
    if lv == '기본형':
        s.fill(['4를 1배, 2배, 3배, … 한 수인 4, 8, 12, …를 4의 ( 배수 / 약수 / 몫 )라고 해요.',
                '어떤 수를 ( 1배, 2배, 3배, … / 나누어떨어지게 ) 한 수를 그 수의 배수라고 해요.',
                '어떤 수의 배수는 ( 셀 수 없이 많아요 / 4개뿐이에요 ). 배수 중 가장 작은 수는 ( 자기 자신 / 0 / 1 )이에요.'])
    else:
        s.fill(['4를 1배, 2배, 3배, … 한 수인 4, 8, 12, …를 4의 (          )라고 해요.',
                '어떤 수를 (                    ) 한 수를 그 수의 배수라고 해요.',
                '어떤 수의 배수는 (                ). 배수 중 가장 작은 수는 (            )이에요.'])
    step(s, 3, '말해 보기', '20 = 1 × 20 · 20 = 2 × 10 · 20 = 4 × 5 · 20 = 2 × 2 × 5')
    s.text('준비단 친구들의 말 중 옳은 것에 ○, 틀린 것에 × 하세요.')
    s.choices([('민호: 4와 5는 20의 약수야.', '( ○ / × )'), ('예린: 20은 4와 5의 배수야.', '( ○ / × )'),
               ('태오: 2 × 2도 20의 약수야.', '( ○ / × )'), ('서진: 20은 10의 약수야.', '( ○ / × )')])
    thenwhy(s, lv, '4 × 5 = 20에서 4와 20은 어떤 관계인지 두 가지로 말해 봐요.',
            '4는 20의 ________ 이고, 20은 4의 ________ 예요. 왜냐하면 ________________________.')
    step(s, 4, '확인하기', '6분마다 종 ― 6의 배수에 색칠하기')
    num_board(s, list(range(1, 31)), 10)
    ans = '3차시  ① %s, 1일씩 늘어날 때마다 4장씩   ② %s / 예) 4에 곱하는 수를 끝없이 늘릴 수 있어서 셀 수 없이 많아요   ③ 배수, 1배, 2배, 3배, …, 셀 수 없이 많아요, 자기 자신   ④ ○, ○, ○, × (20은 10의 배수) / 4는 20의 약수, 20은 4의 배수(20 ÷ 4 = 5, 20은 4를 5배 한 수)   ⑤ %s에 색칠' % (
        ' / '.join(a1), ' / '.join(a2), L(mults_to(6, 30)))
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 3의 배수에 ○표, 7의 배수에 △표')
        num_board(s, list(range(1, 51)), 10)
        near = min(mults_to(9, 99), key=lambda v: abs(v - 50))
        assert near == 54
        a6 = qa(s, [('15의 배수를 가장 작은 수부터 5개', mults(15, 5)), ('14의 배수 중 두 자리 수는 몇 개?', len(mults_to(14, 99)), '개'),
                    ('서진: 9의 배수야. 예린: 그중 50에 가장 가까운 수야. 두 사람이 설명하는 수', near)])
        s.choices([('42 = 2 × 3 × 7을 보고 옳게 말한 것은?', '( ㉠ 42는 2 × 3의 약수예요 /\n㉡ 42의 약수는 2, 3, 7뿐이에요 /\n㉢ 3 × 7은 42의 배수예요 /\n㉣ 7은 42의 약수예요 )')])
        ans += '   ⑥ ○ %s / △ %s, %s, ㉣' % (L(mults_to(3, 50)), L(mults_to(7, 50)), ' / '.join(a6))
    return ans


def st4(s, lv):
    s.lesson(4, '개념 구축하기(O)', '선물 꾸러미를 만들어요 ― 공약수와 최대공약수', '사탕 18개와 젤리 12개를 꾸러미 몇 개에 남김없이 똑같이 나누어 담을 수 있을까요?')
    s.scene(None, '예린이는 장터 선물로 사탕 18개와 젤리 12개를 꾸러미에 남김없이 똑같이 나누어 담으려고 해요.')
    step(s, 0, '만져 보기', '똑같이 나눌 수 있는 꾸러미 수에 ○표 하기')
    row_table(s, '사탕 18개', list(range(1, 19)))
    row_table(s, '젤리 12개', list(range(1, 13)))
    g = gcd(18, 12)
    a1 = qa(s, [('사탕과 젤리를 모두 남김없이 똑같이 나누어 담을 수 있는 꾸러미 수를 모두', both(divs(18), divs(12)), '개'),
                ('최대한 많은 꾸러미를 만든다면 꾸러미는', g, '개'), ('그때 한 꾸러미에 사탕은', 18 // g, '개')])
    step(s, 1, '약속하기', '공약수와 최대공약수')
    a2 = qa(s, [('16의 약수를 모두', divs(16)), ('20의 약수를 모두', divs(20)), ('16과 20의 공통된 약수를 모두', both(divs(16), divs(20))),
                ('공통된 약수 중 가장 큰 수', gcd(16, 20))])
    if lv == '기본형':
        s.fill(['16과 20의 공통된 약수인 1, 2, 4를 16과 20의 ( 공약수 / 공배수 / 최대공약수 )라고 해요.',
                '공약수 중에서 가장 큰 수인 4를 16과 20의 ( 최대공약수 / 최소공배수 / 공약수 )라고 해요.'])
    else:
        s.fill(['16과 20의 공통된 약수인 1, 2, 4를 16과 20의 (            )라고 해요.',
                '공약수 중에서 가장 큰 수인 4를 16과 20의 (              )라고 해요.'])
    step(s, 2, '말해 보기', '두 줄에 모두 있는 수끼리 잇기')
    row_table(s, '30의 약수', divs(30))
    row_table(s, '45의 약수', divs(45))
    a3 = qa(s, [('30과 45의 최대공약수', gcd(30, 45)), ('최대공약수 15의 약수를 모두', divs(15))])
    s.choices([('알게 된 점으로 알맞은 것은?', '( 최대공약수의 약수는 공약수와 같아요 /\n최대공약수의 배수는 공약수와 같아요 /\n공약수는 최대공약수보다 커요 )')])
    thenwhy(s, lv, '최대공약수만 알면 공약수를 모두 찾을 수 있는 까닭은 무엇일까요?',
            '공약수는 최대공약수의 ________ 와 같아서, 최대공약수의 ________ 를 구하면 돼요.')
    step(s, 3, '확인하기', '공약수 찾고 설명하기')
    a4 = qa(s, [('20과 30의 공약수를 모두', both(divs(20), divs(30))), ('20과 30의 최대공약수', gcd(20, 30))])
    s.choices([('하윤: ‘20과 30의 공약수 중에서 가장 작은 수는 2야.’ 바르게 고친 것은?', '( 가장 작은 수는 1이야 /\n가장 작은 수는 5야 / 가장 작은 수는 10이야 )')])
    s.ask('공약수와 최대공약수를 처음 배우는 친구에게 설명해 보세요.', blank=False)
    if lv == '기본형':
        s.fill('공약수는 두 수의 공통된 ________ 이고, 최대공약수는 공약수 중 가장 ________ 수예요. 예를 들어 ________________.')
    else:
        s.lines(2)
    ans = '4차시  ① %s   ② %s, 공약수, 최대공약수   ③ %s, 최대공약수의 약수는 공약수와 같아요 / 예) 공약수는 최대공약수의 약수와 같아서 15의 약수를 구하면 돼요   ④ %s, 가장 작은 수는 1이야, 예) 공약수는 두 수의 공통된 약수, 최대공약수는 그중 가장 큰 수예요' % (
        ' / '.join(a1), ' / '.join(a2), ' / '.join(a3), ' / '.join(a4))
    if lv == '도전형':
        step(s, 4, '도전하기', '★ 장터 선물 문제')
        a6 = qa(s, [('연필 36자루와 지우개 24개를 최대한 많은 친구에게 남김없이 똑같이 나누어 주려면', gcd(36, 24), '명'),
                    ('24와 32의 공약수는 모두', len(divs(gcd(24, 32))), '개'),
                    ('40과 56을 어떤 수로 나누면 둘 다 나누어떨어져요. 어떤 수 중에서 가장 큰 수', gcd(40, 56))])
        ans += '   ⑤ %s' % ' / '.join(a6)
    return ans


def st5(s, lv):
    s.lesson(5, '개념 구축하기(O)', '최대공약수를 빠르게 구해요', '약수를 모두 쓰지 않고도 최대공약수를 구할 수 있을까요?')
    s.scene(None, '선물 꾸러미가 더 커졌어요. 사탕 24개와 젤리 36개예요.')
    step(s, 0, '만져 보기', '곱으로 나타내기')
    rule_first(s, '두 수를 여러 수의 곱으로 나타내면 최대공약수를 어떻게 찾을 수 있을까요?', lv,
               '내 규칙: 두 식에 공통으로 들어 있는 수를 ______________ 하면 최대공약수예요.')
    t1 = tree_fill(s, lv, 24, 36)
    s.ask('24와 36의 최대공약수 = (            )', blank=False)
    t2 = tree_fill(s, lv, 20, 30)
    s.ask('20과 30의 최대공약수 = (            )', blank=False)
    s.choices([('여러 수의 곱으로 나타낸 식으로 최대공약수를 구하는 방법은?', '( 식에 공통으로 들어 있는 수를 모두 곱해요 /\n식에 있는 수를 모두 곱해요 /\n식에서 가장 큰 수를 골라요 )')])
    step(s, 1, '그려 보기', '공약수로 나누기')
    s.picture(ladder_fig(24, 36, lv), width_mm=55)
    s.picture(ladder_fig(20, 30, lv), width_mm=55)
    s.ask('24와 36을 12로 한 번에 나누면 몫은 2와 3이에요. 이때 최대공약수는?  (      )', blank=False)
    step(s, 2, '말해 보기', '태오의 실수')
    s.text('태오는 24와 36을 2로 나누어 몫 12와 18을 쓰고 멈춘 뒤, 최대공약수가 2라고 했어요.')
    s.picture(fig('ldtae', svg_ladder([('2', '24', '36')], ('12', '18'))), width_mm=45)
    s.choices([('태오의 계산에서 잘못된 점은?', '( 12와 18을 더 나눌 수 있는데 멈추었어요 /\n2로 나누면 안 돼요 / 몫을 잘못 계산했어요 )'),
               ('끝까지 나누면 24와 36의 최대공약수는?', opt('12', '2', '72'))])
    thenwhy(s, lv, '공약수로 나눌 때 ‘더 이상 나눌 수 없을 때까지’ 나누어야 하는 까닭은 무엇일까요?',
            '중간에 멈추면 아직 나눌 수 있는 공약수를 ________ 못해서, 구한 수가 가장 ________ 공약수가 되지 않아요.')
    step(s, 3, '약속하기', '최대공약수 구하는 방법')
    if lv == '기본형':
        s.fill(['방법 1: 여러 수의 곱으로 나타낸 식에서 ( 공통으로 들어 있는 수 / 공통이 아닌 수 )를 모두 곱해요.',
                '방법 2: 공약수로 ( 더 이상 나눌 수 없을 때까지 / 한 번만 ) 나누고, 나눈 ( 공약수 / 마지막 몫 )를 모두 곱해요.',
                '두 방법으로 구한 최대공약수는 ( 같아요 / 달라요 ).'])
    else:
        s.fill(['방법 1: 여러 수의 곱으로 나타낸 식에서 (                        )를 모두 곱해요.',
                '방법 2: 공약수로 (                              ) 나누고, 나눈 (          )를 모두 곱해요.',
                '두 방법으로 구한 최대공약수는 (          ).'])
    step(s, 4, '확인하기', '가격표 자르기')
    s.text('하윤이는 가로 18 cm, 세로 12 cm인 색 도화지를 크기가 같은 정사각형 가격표로 남는 부분 없이 자르려고 해요.')
    s.picture(fig('grid18x12', svg_grid(18, 12)), width_mm=120)
    g = gcd(18, 12)
    a5 = qa(s, [('가장 큰 정사각형 가격표의 한 변의 길이', g, 'cm'), ('그때 가격표는 모두', (18 // g) * (12 // g), '장')])
    ans = '5차시  ① 예) 공통으로 들어 있는 수를 모두 곱해요 / %s → %d, %s → %d, 공통으로 들어 있는 수를 모두 곱해요   ② %s / %s, 12   ③ 12와 18을 더 나눌 수 있는데 멈추었어요, 12 / 예) 아직 나눌 수 있는 공약수를 곱하지 못해서 가장 큰 공약수가 되지 않아요   ④ 공통으로 들어 있는 수, 더 이상 나눌 수 없을 때까지, 공약수, 같아요   ⑤ %s' % (
        t1, gcd(24, 36), t2, gcd(20, 30), ladder_text(24, 36, 'gcd'), ladder_text(20, 30, 'gcd'), ' / '.join(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 최대공약수 구하기')
        a6 = qa(s, [('42와 56의 최대공약수', gcd(42, 56)), ('공책 48권과 색연필 60자루를 최대한 많은 모둠에 남김없이 똑같이 나누어 주려면', gcd(48, 60), '모둠'),
                    ('그때 한 모둠에 색연필은', 60 // gcd(48, 60), '자루')])
        s.ask('민호: ‘32와 48의 공약수 중 가장 작은 수는 2야.’ 바르게 고쳐 써 보세요.', blank=False)
        s.lines(1)
        ans += '   ⑥ %s, 32와 48의 공약수 중 가장 작은 수는 1이야.' % ' / '.join(a6)
    return ans


def st6(s, lv):
    s.lesson(6, '개념 구축하기(O)', '장터 이벤트 시간표를 짜요 ― 공배수와 최소공배수', '풍선 이벤트와 뽑기 이벤트가 다시 동시에 시작하는 때는 몇 분 후일까요?')
    s.scene(None, '방송 담당 태오가 이벤트 시간표를 짜요. 장터를 연 순간 두 이벤트를 함께 시작하고, 그다음부터 풍선 이벤트는 4분마다, 뽑기 이벤트는 6분마다 다시 시작해요.')
    step(s, 0, '만져 보기', '24분까지 이벤트가 시작하는 때에 ○표 하기')
    row_table(s, '풍선(분 후)', list(range(1, 25)), label_mm=30)
    row_table(s, '뽑기(분 후)', list(range(1, 25)), label_mm=30)
    a1 = qa(s, [('24분까지 두 이벤트가 다시 동시에 시작하는 때를 모두', both(mults_to(4, 24), mults_to(6, 24)), '분 후'),
                ('처음으로 다시 동시에 시작하는 때', lcm(4, 6), '분 후')])
    step(s, 1, '약속하기', '공배수와 최소공배수')
    a2 = qa(s, [('6의 배수를 가장 작은 수부터 8개', mults(6, 8)), ('8의 배수를 가장 작은 수부터 8개', mults(8, 8)),
                ('위에서 쓴 수 중 6과 8의 공통된 배수를 모두', both(mults(6, 8), mults(8, 8))), ('공통된 배수 중 가장 작은 수', lcm(6, 8))])
    if lv == '기본형':
        s.fill(['6과 8의 공통된 배수인 24, 48, …를 6과 8의 ( 공배수 / 공약수 / 최소공배수 )라고 해요.',
                '공배수 중에서 가장 작은 수인 24를 6과 8의 ( 최소공배수 / 최대공약수 / 공배수 )라고 해요.'])
    else:
        s.fill(['6과 8의 공통된 배수인 24, 48, …를 6과 8의 (            )라고 해요.',
                '공배수 중에서 가장 작은 수인 24를 6과 8의 (              )라고 해요.'])
    step(s, 2, '말해 보기', '두 줄에 모두 있는 수끼리 잇기')
    row_table(s, '8의 배수', mults(8, 10))
    row_table(s, '12의 배수', mults(12, 10))
    a3 = qa(s, [('8과 12의 최소공배수', lcm(8, 12)), ('최소공배수 24의 배수를 가장 작은 수부터 3개', mults(24, 3))])
    s.choices([('알게 된 점으로 알맞은 것은?', '( 최소공배수의 배수는 공배수와 같아요 /\n최소공배수의 약수는 공배수와 같아요 /\n공배수는 3개뿐이에요 )')])
    thenwhy(s, lv, '‘최소’공배수인데 왜 8과 12보다 작은 수가 될 수 없을까요?',
            '공배수는 8의 배수이면서 ________ 의 배수라서 ________ 보다 작을 수 없어요.')
    step(s, 3, '확인하기', '공배수 찾고 설명하기')
    a4 = qa(s, [('9와 12의 최소공배수', lcm(9, 12)), ('10과 15의 공배수를 가장 작은 수부터 3개', mults(lcm(10, 15), 3))])
    s.choices([('예린: ‘최소공배수는 항상 두 수를 곱한 수야.’ 이 말은?', '( 틀렸어요. 4와 6의 최소공배수는 12예요 /\n맞아요. 두 수를 곱하면 언제나 최소공배수예요 )')])
    s.ask('공배수와 최소공배수를 장터 이벤트 시간표로 설명해 보세요.', blank=False)
    if lv == '기본형':
        s.fill('두 이벤트가 동시에 시작하는 때는 4와 6의 ________ 이고, 처음으로 동시에 시작하는 12분 후의 12는 ________ 예요.')
    else:
        s.lines(2)
    ans = '6차시  ① %s   ② %s, 공배수, 최소공배수   ③ %s, 최소공배수의 배수는 공배수와 같아요 / 예) 12의 배수 중 가장 작은 수가 12라서 공배수는 12보다 작을 수 없어요   ④ %s, 틀렸어요, 예) 동시에 시작하는 때는 공배수, 처음 12분 후는 최소공배수' % (
        ' / '.join(a1), ' / '.join(a2), ' / '.join(a3), ' / '.join(a4))
    if lv == '도전형':
        step(s, 4, '도전하기', '★ 마을버스와 학교 셔틀')
        s.text('장터 날 학교 앞에서 마을버스는 8분마다, 학교 셔틀은 12분마다 출발해요. 두 차가 오전 10시에 동시에 출발했어요. 수직선에 두 차가 출발하는 때를 표시해 보세요.')
        s.picture(fig('nl48', svg_numline(48, 4, 8, zero='0 = 오전 10시')), width_mm=170)
        m = lcm(8, 12)
        a6 = qa(s, [('두 차는 몇 분마다 동시에 출발하나요?', m, '분'), ('다음번에 두 차가 동시에 출발하는 시각', '오전 10시 %d분' % m)])
        ans += '   ⑤ 마을버스 %s / 셔틀 %s, %s' % (L(mults_to(8, 48)), L(mults_to(12, 48)), ' / '.join(a6))
    return ans


def st7(s, lv):
    s.lesson(7, '개념 구축하기(O)', '최소공배수를 빠르게 구해요', '배수를 모두 늘어놓지 않고도 최소공배수를 구할 수 있을까요?')
    s.scene(None, '장터 날 무대 공연은 12분마다, 퀴즈 방송은 20분마다 시작해요.')
    step(s, 0, '만져 보기', '곱으로 나타내기')
    rule_first(s, '12 = 2 × 2 × 3, 20 = 2 × 2 × 5를 이용하면 최소공배수를 어떻게 구할 수 있을까요?', lv,
               '내 규칙: 공통인 수는 ________ 곱하고, 공통이 아닌 남은 수를 ________.')
    t1 = tree_fill(s, lv, 12, 20)
    s.ask('12의 배수 12, 24, 36, 48, 60과 20의 배수 20, 40, 60에서 찾은 최소공배수: (        )', blank=False)
    t2 = tree_fill(s, lv, 10, 15)
    s.ask('10과 15의 최소공배수 = (            )', blank=False)
    s.choices([('여러 수의 곱으로 나타낸 식으로 최소공배수를 구하는 방법은?', '( 공통으로 들어 있는 수는 한 번만 곱하고,\n공통이 아닌 남은 수를 곱해요 /\n식에 있는 수를 모두 곱해요 /\n공통으로 들어 있는 수만 곱해요 )')])
    step(s, 1, '그려 보기', '공약수로 나누기(ㄴ자 모양으로 곱하기)')
    s.picture(ladder_fig(12, 20, lv), width_mm=55)
    s.picture(ladder_fig(10, 15, lv), width_mm=55)
    s.ask('12와 20을 최대공약수 4로 한 번에 나누면 몫은 3과 5예요. 최소공배수 4 × 3 × 5 = (        )', blank=False)
    step(s, 2, '말해 보기', '예린이의 실수')
    s.text('예린이는 12 = 2 × 2 × 3, 20 = 2 × 2 × 5이니까 최소공배수는 2 × 2 × 3 × 2 × 2 × 5 = 240이라고 했어요.')
    assert 2 * 2 * 3 * 2 * 2 * 5 == 240 == 12 * 20
    s.choices([('예린이의 계산에서 잘못된 점은?', '( 공통으로 들어 있는 2 × 2를 두 번 곱했어요 /\n공통이 아닌 3과 5를 곱했어요 /\n12를 여러 수의 곱으로 잘못 나타냈어요 )'),
               ('240은 12와 20의 무엇일까요?', '( 공배수이지만 최소공배수는 아니에요 /\n최소공배수예요 / 공배수가 아니에요 )')])
    thenwhy(s, lv, '공통으로 들어 있는 수를 한 번만 곱해도 되는 까닭은 무엇일까요?',
            '2 × 2 × 3 × 5에는 이미 12와 20이 모두 ________ 있어서, 2 × 2를 또 곱하면 ________________.')
    step(s, 3, '약속하기', '최소공배수 구하는 방법')
    if lv == '기본형':
        s.fill(['방법 1: 공통으로 들어 있는 수는 ( 한 번만 / 두 번 ) 곱하고, 공통이 아닌 남은 수를 ( 곱해요 / 빼요 ).',
                '방법 2: 공약수로 더 이상 나눌 수 없을 때까지 나누고, 나눈 공약수와 ( 마지막 몫 / 처음 두 수 )을 모두 곱해요.'])
    else:
        s.fill(['방법 1: 공통으로 들어 있는 수는 (          ) 곱하고, 공통이 아닌 남은 수를 (        ).',
                '방법 2: 공약수로 더 이상 나눌 수 없을 때까지 나누고, 나눈 공약수와 (            )을 모두 곱해요.'])
    step(s, 4, '확인하기', '최소공배수 구하기')
    a5 = qa(s, [('9와 15의 최소공배수', lcm(9, 15)), ('14와 21의 최소공배수', lcm(14, 21)),
                ('어떤 두 수의 최소공배수가 16이에요. 두 수의 공배수를 가장 작은 수부터 3개', mults(16, 3)),
                ('6과 15의 공배수 중에서 100보다 작은 수는 몇 개?', len(mults_to(lcm(6, 15), 99)), '개')])
    ans = '7차시  ① 예) 공통인 수는 한 번만 곱하고 남은 수를 곱해요 / %s → %d, %s → %d, 공통으로 들어 있는 수는 한 번만 곱하고 남은 수를 곱해요   ② %s / %s, %d   ③ 공통으로 들어 있는 2 × 2를 두 번 곱했어요, 공배수이지만 최소공배수는 아니에요 / 예) 60 안에 12와 20이 모두 들어 있어서 2 × 2를 또 곱하면 더 큰 공배수가 될 뿐이에요   ④ 한 번만, 곱해요, 마지막 몫   ⑤ %s' % (
        t1, lcm(12, 20), t2, lcm(10, 15), ladder_text(12, 20, 'lcm'), ladder_text(10, 15, 'lcm'), 4 * 3 * 5, ' / '.join(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 공약수로 나눈 식의 빈칸')
        s.picture(fig('ldq40', svg_ladder([('2', '40', '㉠'), ('5', '㉡', '15')], ('㉢', '3'))), width_mm=55)
        e1, e2 = 15 * 2, 40 // 2
        e3 = e2 // 5
        assert e1 // 2 // 5 == 3 and e3 == 4
        a6 = qa(s, [('㉠', e1), ('㉡', e2), ('㉢', e3), ('40과 ㉠의 최대공약수', gcd(40, e1)), ('40과 ㉠의 최소공배수', lcm(40, e1))])
        ans += '   ⑥ %s' % ' / '.join(a6)
    return ans


def st8(s, lv):
    s.lesson(8, '개념 구축하기(O)', '장터 자리를 배치해요 ― 생각을 더하다', '의자를 몇 개씩 몇 줄로 놓는 방법은 모두 몇 가지일까요?')
    s.scene(None, ['장터 손님이 앉을 의자와 진열대를 배치해요.',
                   '📝 서진이의 자리 배치 메모  조건 1. 우리 반은 6개 모둠이에요.  조건 2. 모둠마다 의자를 8개씩 가져와요.  조건 3. 진열대에 놓을 종이컵은 60개예요.  의자와 종이컵을 각각 몇 개씩 몇 줄로 남김없이 똑같이 놓는 방법은 몇 가지일까?'])
    step(s, 0, '이해해요')
    s.choices([('구하려는 것은 무엇인가요?', '( 의자와 종이컵을 각각 몇 개씩 몇 줄로 놓는 방법의 가짓수 /\n우리 반 모둠의 수 / 진열대의 길이 )')])
    a1 = qa(s, [('모둠의 수', 6, '개'), ('모둠마다 가져오는 의자의 수', 8, '개'), ('종이컵의 수', 60, '개')])
    step(s, 1, '계획해요')
    s.choices([('의자의 수는 어떻게 구할까요?', '( 모둠마다 가져오는 의자 수와 모둠의 수를 곱해요 /\n더해요 )'),
               ('놓는 방법의 가짓수는 무엇을 이용해 구할까요?', opt('그 수의 약수', '그 수의 배수')),
               ('‘6개씩 8줄’과 ‘8개씩 6줄’은?', '( 서로 다른 방법으로 세어요 /\n같은 방법이라 한 번만 세어요 )')])
    a2 = qa(s, [('의자의 수 8 × 6 =', 8 * 6, '개')])
    step(s, 2, '해결해요 ① 의자', '48개를 한 줄에 똑같은 수씩')
    p1 = pair_table(s, 48, lv, '의자 수', '개')
    a3 = qa(s, [('48의 약수를 모두', divs(48)), ('의자를 놓는 방법', len(divs(48)), '가지')])
    step(s, 3, '해결해요 ② 종이컵', '60개를 한 줄에 똑같은 수씩')
    if lv == '기본형':
        s.text('60 = 1 × 60 = 2 × 30 = 3 × 20 = 4 × 15 = 5 × 12 = 6 × 10')
    a4 = qa(s, [('60의 약수를 모두', divs(60)), ('종이컵을 놓는 방법', len(divs(60)), '가지')])
    step(s, 4, '되돌아봐요')
    if lv == '기본형':
        s.labeled([('방법', '먼저 ________ 을 구하고, 그 수의 ________ 의 개수를 세었어요.'),
                   ('까닭', '정해진 ____개를 몇 개씩 똑같이 나누어 놓는 일이라서 ________ 를 이용했어요.')])
    else:
        why(s, '어떤 방법으로 해결했는지 설명해 보세요.', 1)
        why(s, '약수와 배수 중 무엇을 이용했고, 왜 그랬는지 써 보세요.', 1)
    ans = '8차시  ① 놓는 방법의 가짓수, %s   ② 곱해요, 그 수의 약수, 서로 다른 방법, %s   ③ %s / %s   ④ %s   ⑤ 예) 의자 수 8 × 6 = 48, 약수 / 48, 약수' % (
        ' / '.join(a1), ' / '.join(a2), p1, ' / '.join(a3), ' / '.join(a4))
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 탁자 36개')
        s.text('6학년 형님 반에서 탁자 36개를 빌려주었어요. 탁자를 몇 개씩 몇 줄로 남김없이 똑같이 놓는 방법을 구해 보세요.')
        a6 = qa(s, [('36의 약수를 모두', divs(36)), ('탁자를 놓는 방법', len(divs(36)), '가지'), ('탁자를 4줄로 놓으면 한 줄에', 36 // 4, '개')])
        why(s, '6 × 6 = 36은 왜 한 가지 방법으로만 셀까요?', 1)
        ans += '   ⑥ %s, 예) 6개씩 6줄은 바꾸어도 같은 방법이에요' % ' / '.join(a6)
    return ans


def st9(s, lv):
    s.lesson(9, '탐구 정리하기(O)', '준비단 회의 ― 무엇을 구해야 할까?', '언제 최대공약수를 구하고, 언제 최소공배수를 구할까요?')
    s.scene(None, '장터 준비단이 해결할 문제를 모았어요.')
    step(s, 0, '만져 보기', '문제 나누기')
    cards = [('귤 45개와 사과 30개를 최대한 많은 봉지에 남김없이 똑같이 나누어 담기', 0),
             ('가로 18 cm, 세로 12 cm 도화지를 가장 큰 정사각형으로 남김없이 자르기', 0),
             ('공책 48권과 색연필 60자루를 최대한 많은 모둠에 똑같이 나누어 주기', 0),
             ('4분마다, 6분마다 시작하는 이벤트가 다시 동시에 시작하는 때', 1),
             ('빨간 전구는 4초마다, 초록 전구는 10초마다 깜박일 때 처음으로 동시에 깜박이는 때', 1),
             ('8분마다, 12분마다 출발하는 두 차가 다시 동시에 출발하는 때', 1)]
    a1 = sort_table(s, lv, cards, ['최대공약수로 해결해요', '최소공배수로 해결해요'])
    thenwhy(s, lv, '문제에 어떤 말이 있으면 최대공약수를, 어떤 말이 있으면 최소공배수를 떠올리면 좋을까요?',
            '“________________”라는 말이 있으면 최대공약수, “________________”라는 말이 있으면 최소공배수를 떠올려요.')
    step(s, 1, '그려 보기', '한 번에 두 가지 구하기')
    s.picture(ladder_fig(24, 40, lv), width_mm=55)
    s.picture(ladder_fig(18, 27, lv), width_mm=55)
    s.table([['', '최대공약수', '최소공배수'], ['24와 40', '(        )', '(        )'], ['18과 27', '(        )', '(        )']])
    step(s, 2, '말해 보기', '헷갈리는 말 바로잡기')
    s.text('준비단 친구들이 회의에서 한 말이에요. 옳은 말에 ○, 틀린 말에 × 하세요.')
    s.choices([('서진: 최대공약수는 두 수 중 작은 수보다 클 수 없어.', '( ○ / × )'), ('민호: 최소공배수는 언제나 두 수를 곱한 수야.', '( ○ / × )'),
               ('예린: 최소공배수의 배수는 모두 공배수야.', '( ○ / × )'), ('태오: 공약수 중 가장 작은 수는 언제나 1이야.', '( ○ / × )'),
               ('하윤: ‘최소’공배수니까 두 수보다 작은 수야.', '( ○ / × )')])
    step(s, 3, '약속하기', '약수와 배수 정리')
    a4 = qa(s, [('12의 약수: 1, 2, 3, 4, □, 12', 6), ('18의 약수 1, 2, 3, 6, 9, 18과 견주면 12와 18의 최대공약수', gcd(12, 18)),
                ('4와 6의 공배수: 12, □, 36, …', 24), ('4와 6의 최소공배수', lcm(4, 6))])
    s.choices([('‘어떤 수를 나누어떨어지게 하는 수’는?', opt('약수', '배수')), ('‘어떤 수를 1배, 2배, 3배, … 한 수’는?', opt('약수', '배수'))])
    step(s, 4, '확인하기', '장터 문제 해결하기')
    g, m = gcd(45, 30), lcm(4, 10)
    a5 = qa(s, [('귤 45개와 사과 30개를 최대한 많은 봉지에 남김없이 똑같이 나누어 담으려면 필요한 봉지', g, '개'),
                ('그때 한 봉지에 귤은', 45 // g, '개'),
                ('빨간 전구는 4초마다, 초록 전구는 10초마다 깜박여요. 지금 동시에 깜박였다면 다시 동시에 깜박이는 때', m, '초 후'),
                ('지금 동시에 깜박인 뒤 1분 동안 두 전구는 동시에 몇 번 더 깜박일까요?', 60 // m, '번')])
    ans = '9차시  ① %s / 예) ‘최대한 많이 남김없이 똑같이’, ‘가장 큰’ → 최대공약수, ‘다시 동시에’, ‘처음으로 함께’ → 최소공배수   ② %s / %s   ③ ○, ×, ○, ○, ×   ④ %s, 약수, 배수   ⑤ %s' % (
        a1, ladder_text(24, 40), ladder_text(18, 27), ' / '.join(a4), ' / '.join(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 한 가지 조각으로 8칸, 12칸 장식 띠 채우기')
        s.picture(fig('strip8_12', svg_strips([8, 12], STRIP)), width_mm=125)
        okp = strip_ok([8, 12])
        s.ask('두 장식 띠를 모두 채울 수 있는 조각을 모두 쓰세요.  (                    )', blank=False)
        why(s, '그 조각으로 채울 수 있는 까닭을 공약수로 설명해 보세요.', 1)
        ans += '   ⑥ %s (1, 2, 4는 8과 12의 공약수)' % ', '.join(STRIP[i][0] for i in okp)
    return ans


def st10(s, lv):
    s.lesson(10, '발표하기(P)', '장터 놀이 부스 ― 약수와 배수 이어달리기', '앞 사람이 고른 수의 약수나 배수를 찾아 이어 갈 수 있을까요?')
    s.scene(None, '하윤이가 놀이 부스에서 손님에게 ‘약수와 배수 이어달리기’를 알려 줘요. 놀이판에는 1부터 50까지의 수가 있어요.')
    step(s, 0, '놀이 방법 알기', '차례대로 번호 쓰기')
    rules = GAME_RULES[:3] + ['④ ×표 할 수 있는 수가 없을 때까지 차례대로 계속해요.']
    a1 = order_rules(s, rules, GAME_SHOW)
    step(s, 1, '규칙 알기')
    s.choices([('첫 번째 사람이 고를 수 있는 수는?', opt('25보다 작은 수', '25보다 큰 수', '아무 수나'))])
    a2 = qa(s, [('첫 번째 사람이 18에 ×표 했어요. ‘약수!’를 외쳤다면 ×표 할 수 있는 수를 모두', [v for v in divs(18) if v != 18]),
                ('‘배수!’를 외쳤다면 놀이판(1~50)에서 ×표 할 수 있는 수를 모두', [v for v in mults_to(18, 50) if v != 18])])
    step(s, 2, '놀이하기', '친구와 약수와 배수 이어달리기')
    num_board(s, list(range(1, 51)), 10)
    s.ask('내가 ×표 한 수를 차례로 써 보세요: ______________________________________', blank=False)
    step(s, 3, '전략 생각하기', '놀이판(1~50)을 떠올리며')
    a4 = qa(s, [('앞 사람이 19에 ×표 했어요(다른 수는 아직 ×표 하지 않았어요). ×표 할 수 있는 수를 모두', [v for v in divs(19) + mults_to(19, 50) if v != 19])])
    s.choices([('앞 사람이 47에 ×표 했고, 1에는 이미 ×표 되어 있어요. 다음 사람은 어떻게 될까요?', '( ×표 할 수 있는 수가 없어요 /\n94에 ×표 해요 / 7에 ×표 해요 )'),
               ('1에 ×표 하면 다음 사람은 어떤 수를 고를 수 있을까요?', '( ×표 하지 않은 아무 수나 /\n1의 약수만 )')])
    s.ask('놀이 부스 손님에게 알려 줄 ‘이기는 비법’을 써 보세요.', blank=False)
    if lv == '기본형':
        s.fill('약수와 배수가 ________ 수를 고르면 상대가 ________________ 해서 이기기 쉬워요.')
    else:
        s.lines(2)
    ans = '10차시  ① %s   ② 25보다 작은 수, %s   ③ (놀이)   ④ %s, ×표 할 수 있는 수가 없어요, ×표 하지 않은 아무 수나(모든 수는 1의 배수) / 예) 약수와 배수가 거의 없는 수(1이 ×표 된 뒤의 47)를 고르면 상대가 ×표 할 수 없어요' % (
        a1, ' / '.join(a2), ' / '.join(a4))
    if lv == '도전형':
        step(s, 4, '도전하기', '★ 한 판 더')
        s.text('친구와 한 판 더 하고, 상대가 ×표 할 수 있는 수가 없게 만들어 이겨 보세요.')
        why(s, '41, 43, 47처럼 큰 수를 노리면 좋은 까닭을 써 보세요.', 2)
        ans += '   ⑤ 예) 약수는 1과 자기 자신뿐이고 배수는 놀이판(1~50)에 없어서 1이 ×표 되어 있으면 상대가 고를 수가 없어요'
    return ans


def st11(s, lv):
    s.lesson(11, '발표하기(P)', '학급 장터 날! 배운 것을 발표해요', '장터를 준비하며 배운 약수와 배수를 친구들에게 설명할 수 있나요?')
    s.scene(None, '드디어 장터 날이에요! 장터를 마치고 남은 것을 정리하고, 배운 것을 발표해요.')
    step(s, 0, '만져 보기', '장터 결산')
    a1 = qa(s, [('남은 쿠키 56개를 봉지에 남김없이 똑같이 나누어 담을 수 있는 봉지의 수를 모두', divs(56), '개'),
                ('하루에 7장씩 나누어 준 쿠폰 수(7의 배수)를 가장 작은 수부터 5개', mults(7, 5))])
    s.choices([('35 = 5 × 7이에요. ‘5와 7은 35의 □예요.’', opt('약수', '배수')), ('‘35는 5와 7의 □예요.’', opt('약수', '배수'))])
    step(s, 1, '그려 보기', '최대공약수와 최소공배수')
    s.picture(ladder_fig(36, 48, lv), width_mm=55)
    s.picture(ladder_fig(45, 60, lv), width_mm=55)
    s.table([['', '최대공약수', '최소공배수'], ['36과 48', '(        )', '(        )'], ['45와 60', '(        )', '(        )']])
    step(s, 2, '말해 보기', '장터 발표')
    if lv == '기본형':
        s.labeled([('최대공약수', '사탕 18개와 젤리 12개를 최대한 많은 ________ 에 똑같이 나누려고 최대공약수 ____ 을 구했어요.'),
                   ('최소공배수', '4분마다, 6분마다 시작하는 이벤트가 다시 동시에 시작하는 때를 알려고 최소공배수 ____ 를 구했어요.')], row_h=4535)
    else:
        why(s, '최대공약수를 장터 준비의 어디에 썼는지 발표해 보세요.', 1)
        why(s, '최소공배수를 장터 준비의 어디에 썼는지 발표해 보세요.', 1)
    step(s, 3, '확인하기', '장터 수익 나눔')
    g = gcd(72, 96)
    a4 = qa(s, [('공책 72권과 연필 96자루를 최대한 많은 상자에 남김없이 똑같이 나누어 담으려면 필요한 상자', g, '개'),
                ('그때 한 상자에 공책은', 72 // g, '권'), ('그때 한 상자에 연필은', 96 // g, '자루')])
    step(s, 4, '되돌아보기', '예전 생각, 지금 생각')
    write_pane(s, lv, [('예전 생각', '예전에는 ______________________________ 라고 생각했어요.'),
                       ('지금 생각', '지금은 ______________________________ 라고 생각해요.'),
                       ('왜 바뀌었나', '______________________________ 을 해 보고 바뀌었어요.')])
    ans = '11차시  ① %s, 약수, 배수   ② %s / %s   ③ 꾸러미, %d / %d   ④ %s   ⑤ (자유)' % (
        ' / '.join(a1), ladder_text(36, 48), ladder_text(45, 60), gcd(18, 12), lcm(4, 6), ' / '.join(a4))
    if lv == '도전형':
        ans = ans.replace('③ 꾸러미, %d / %d' % (gcd(18, 12), lcm(4, 6)),
                          '③ 예) 사탕 18개와 젤리 12개 → 최대공약수 %d(%d꾸러미), 4분·6분 이벤트 → 최소공배수 %d(%d분 후)' % (gcd(18, 12), gcd(18, 12), lcm(4, 6), lcm(4, 6)))
        step(s, 5, '도전하기', '★★ 매미 이야기')
        s.picture(fig('cicada', svg_cicada()), width_mm=110)
        s.text('미국에는 13년마다 나타나는 매미와 17년마다 나타나는 매미가 있는데, 2024년에 두 매미가 동시에 나타났대요.')
        a6 = qa(s, [('두 매미는 몇 년마다 동시에 나타날까요?', lcm(13, 17), '년'), ('다음에 두 매미가 다시 동시에 나타나는 해', 2024 + lcm(13, 17), '년')])
        assert lcm(6, 9) == 18 and lcm(13, 17) == 13 * 17
        s.choices([('6과 9의 최소공배수는 18이고 6 × 9 = 54예요. 13과 17의 최소공배수가 13 × 17과 같은 까닭은?', '( 13과 17의 공약수가 1뿐이라서\n공통으로 들어 있는 수가 없어요 /\n두 수가 모두 홀수라서 그래요 )')])
        ans += '   ⑥ %s, 13과 17의 공약수가 1뿐이라서' % ' / '.join(a6)
    return ans


TB = [tb1, tb2, tb3, tb45, tb67, tb8, tb9, tb10]
ST = [st1, st2, st3, st4, st5, st6, st7, st8, st9, st10, st11]


def build(funcs, label, short, outdir, lv):
    s = Sheet(unit_label=label, level=lv, grade_label='5학년')
    lines = [f(s, lv) for f in funcs]
    s.answers('【교사용】 2. 약수와 배수(%s) 활동지 정답 (%s)' % (short, lv), lines,
              note='※ 이 활동지는 앱 u2-factor.html과 차시 번호가 같습니다.')
    os.makedirs(outdir, exist_ok=True)
    path = os.path.join(outdir, NAME % lv)
    s.save(path)
    return path


def main():
    out = []
    try:
        for lv in ('기본형', '도전형'):
            out.append(build(TB, '5-1 수학 2. 약수와 배수(교과서 차시)', '교과서 차시', OUT_TB, lv))
            out.append(build(ST, '5-1 수학 2. 약수와 배수(이야기 버전)', '이야기 버전', OUT_ST, lv))
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
