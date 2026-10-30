# -*- coding: utf-8 -*-
"""4-1 수학 3. 곱셈과 나눗셈 활동지(교과서 차시 버전·이야기 버전 × 기본형·도전형) 만들기

    python3 gen_u3-muldiv.py

앱 원본 ../units/u3-muldiv.tb.js(교과서) · u3-muldiv.st.js(이야기)와 차시 번호·제목·S.O.O.P.·
탐구 질문·이야기·수를 똑같이 맞춥니다. 정답은 모두 이 스크립트가 계산합니다.
그림은 SVG로 그려 임시 폴더에서 PNG로 바꿉니다(저장소에는 남기지 않음).
"""
import itertools
import os
import shutil
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from hwpxgen import Sheet, svg_to_png, check  # noqa: E402

ROOT = os.path.normpath(os.path.join(HERE, '..', '..'))      # grade4/math
OUT_TB = os.path.join(ROOT, 'sem1', 'sheets')
OUT_ST = os.path.join(ROOT, 'sem1-soop', 'sheets')
NAME = '3단원_곱셈과나눗셈_활동지_%s.hwpx'
FONT = "'Noto Sans KR','WenQuanYi Zen Hei',sans-serif"
NUM = '①②③④⑤⑥⑦'
WORK = tempfile.mkdtemp(prefix='u3muldiv_')
_FIG = {}


# ---------------------------------------------------------------- 계산
def dv(n, d):
    return n // d, n % d


def ds(n, d):
    """나눗셈 답 글: 몫 … 나머지(나머지 0이면 몫만)."""
    q, r = dv(n, d)
    return '%d … %d' % (q, r) if r else str(q)


def ms(a, b):
    return str(a * b)


def best_mul(cards):
    """수 카드로 가장 큰 세 자리 수 × 남은 카드로 가장 작은 두 자리 수."""
    best = None
    for p in itertools.permutations(cards):
        if p[0] == 0 or p[3] == 0:
            continue
        a = p[0] * 100 + p[1] * 10 + p[2]
        b = p[3] * 10 + p[4]
        if best is None or a > best[0] or (a == best[0] and b < best[1]):
            best = (a, b)
    return best


def best_div(cards):
    """몫이 가장 큰 (세 자리 수) ÷ (두 자리 수)."""
    best = None
    for p in itertools.permutations(cards):
        if p[0] == 0 or p[3] == 0:
            continue
        a = p[0] * 100 + p[1] * 10 + p[2]
        b = p[3] * 10 + p[4]
        key = (a // b, a)
        if best is None or key > best[0]:
            best = (key, a, b)
    return best[1], best[2]


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


def _box(x, y, c):
    return '<rect x="%s" y="%s" width="%s" height="%s" fill="#fff" stroke="#777" stroke-width="2" rx="4"/>' % (
        x + 4, y + 4, c - 8, c - 8)


def svg_longmul(a, b, labels=False):
    """세로 곱셈 틀. b가 몇십이면 한 줄, 몇십몇이면 두 줄 + 합."""
    c = 56
    p = a * b
    ncol = max(len(str(p)), len(str(a)), len(str(b)) + 1) + 1
    lab_w = 300 if labels else 0
    W = 30 + ncol * c + lab_w + 20
    X = lambda col: 30 + (ncol - 1 - col) * c       # col 0 = 일의 자리
    out, y = [], 10

    def digits(s, yy):
        for i, ch in enumerate(reversed(s)):
            out.append(_t(X(i) + c / 2, yy + c * 0.72, ch, 34))

    def boxes(k, start, yy):
        for i in range(start, start + k):
            out.append(_box(X(i), yy, c))

    def line(yy):
        out.append('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#000" stroke-width="3"/>' % (
            X(ncol - 1), yy, X(0) + c, yy))

    digits(str(a), y)
    y += c
    digits(str(b), y)
    out.append(_t(X(ncol - 1) + c / 2, y + c * 0.72, '×', 34))
    y += c + 6
    line(y - 3)
    if b % 10 == 0:
        boxes(len(str(p)), 0, y)
        if labels:
            out.append(_t(X(0) + c + 20, y + c * 0.68, '← %d × %d의 10배' % (a, b // 10), 24, 'start'))
        y += c
    else:
        u, t = b % 10, b // 10
        boxes(len(str(a * u)), 0, y)
        if labels:
            out.append(_t(X(0) + c + 20, y + c * 0.68, '← %d × %d' % (a, u), 24, 'start'))
        y += c
        boxes(len(str(a * t)), 1, y)
        if labels:
            out.append(_t(X(0) + c + 20, y + c * 0.68, '← %d × %d0 (0 생략)' % (a, t), 24, 'start'))
        y += c + 6
        line(y - 3)
        boxes(len(str(p)), 0, y)
        if labels:
            out.append(_t(X(0) + c + 20, y + c * 0.68, '← 두 곱의 합', 24, 'start'))
        y += c
    return _svg(W, y + 12, ''.join(out))


def svg_longdiv(n, d):
    """세로 나눗셈 틀(몫 칸 + 빼는 줄 칸)."""
    c = 56
    q, r = dv(n, d)
    L, k = len(str(n)), len(str(q))
    left = 30 + len(str(d)) * 30 + 30
    W = left + L * c + 40
    X = lambda col: left + col * c                 # col 0 = 가장 높은 자리
    out, y = [], 10
    for col in range(L - k, L):                    # 몫 칸
        out.append(_box(X(col), y, c))
    y += c + 4
    out.append(_t(left - 34, y + c * 0.72, str(d), 34, 'end'))
    out.append('<path d="M%s %s Q%s %s %s %s" fill="none" stroke="#000" stroke-width="3"/>' % (
        left - 6, y - 2, left + 10, y + c / 2, left - 6, y + c))
    out.append('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#000" stroke-width="3"/>' % (
        left - 6, y - 2, X(L - 1) + c, y - 2))
    for i, ch in enumerate(str(n)):
        out.append(_t(X(i) + c / 2, y + c * 0.72, ch, 34))
    y += c

    def boxes(cols, yy):
        for col in cols:
            out.append(_box(X(col), yy, c))

    def line(yy):
        out.append('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#000" stroke-width="3"/>' % (
            X(0), yy, X(L - 1) + c, yy))

    rlen = len(str(d - 1))
    if k == 1:
        boxes(range(L), y)
        y += c + 6
        line(y - 3)
        boxes(range(L - rlen, L), y)
        y += c
    else:
        assert n // 10 >= d, (n, d)
        boxes(range(L - 1), y)
        y += c + 6
        line(y - 3)
        boxes(range(L), y)
        y += c
        boxes(range(L), y)
        y += c + 6
        line(y - 3)
        boxes(range(L - rlen, L), y)
        y += c
    return _svg(W, y + 12, ''.join(out))


def svg_bundles(per, k, cols, item):
    cw, ch = 74, 46
    W, H = 40 + cols * (cw + 8) + 10, 70 + k * (ch + 8) + 10
    out = [_t(W / 2, 32, '%s 한 묶음에 %d개 · 세로 한 줄 = %d묶음' % (item, per, k), 24)]
    for r in range(k):
        for c in range(cols):
            x, y = 40 + c * (cw + 8), 56 + r * (ch + 8)
            out.append('<rect x="%d" y="%d" width="%d" height="%d" rx="8" fill="#FDEBD9" stroke="#B4610F" stroke-width="2"/>' % (
                x, y, cw, ch))
            out.append(_t(x + cw / 2, y + ch * 0.7, str(per), 22))
    out.append('<rect x="34" y="50" width="%d" height="%d" rx="10" fill="none" stroke="#2B6FB8" stroke-width="3" stroke-dasharray="8 5"/>' % (
        cw + 12, k * (ch + 8) + 4))
    return _svg(W, H, ''.join(out))


def svg_rods(m, group_label):
    """십 모형 m개(백 모형은 십 모형 10개로 바꾸어 그림)."""
    rw, rh, gap = 26, 200, 14
    W = 40 + m * (rw + gap)
    out = [_t(W / 2, 30, '십 모형 %d개 (백 모형 1개 = 십 모형 10개)' % m, 24)]
    for i in range(m):
        x = 30 + i * (rw + gap)
        out.append('<rect x="%d" y="50" width="%d" height="%d" fill="#BFDDF5" stroke="#2B6FB8" stroke-width="2"/>' % (x, rw, rh))
        for j in range(1, 10):
            out.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="#2B6FB8" stroke-width="1"/>' % (
                x, 50 + j * rh / 10, x + rw, 50 + j * rh / 10))
    out.append(_t(W / 2, 290, group_label, 22))
    return _svg(W, 305, ''.join(out))


def svg_area(a, b, item, row_name, split=10):
    rows, rh = b, 16
    w = 520
    x0, y0 = 150, 50
    H = y0 + rows * rh + 40
    out = [_t(x0 + w / 2, 34, '한 줄 = 한 %s(%s %d개)' % (row_name, item, a), 24)]
    for i in range(rows):
        fill = '#FDEBD9' if i < split else '#DCEBFA'
        out.append('<rect x="%d" y="%d" width="%d" height="%d" fill="%s" stroke="#999" stroke-width="1"/>' % (
            x0, y0 + i * rh, w, rh, fill))
    ys = y0 + split * rh
    out.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="#B4610F" stroke-width="5"/>' % (x0 - 10, ys, x0 + w + 10, ys))
    out.append(_t(x0 - 14, y0 + split * rh / 2 + 9, '%d%s' % (split, row_name), 24, 'end'))
    out.append(_t(x0 - 14, ys + (rows - split) * rh / 2 + 9, '%d%s' % (rows - split, row_name), 24, 'end'))
    out.append(_t(x0 + w / 2, H - 8, '%d%s를 %d%s와 %d%s로 나누었어요' % (rows, row_name, split, row_name, rows - split, row_name), 22))
    return _svg(x0 + w + 30, H, ''.join(out))


def svg_jump(n, d, unit):
    W, x0, x1, y = 960, 40, 900, 170
    X = lambda v: x0 + v / n * (x1 - x0)
    out = ['<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="#000" stroke-width="3"/>' % (x0, y, x1, y)]
    big = 10 * d
    v = 0
    marks = [0]
    while v + big <= n:
        out.append('<path d="M%.1f %d Q%.1f %d %.1f %d" fill="none" stroke="#B4610F" stroke-width="3"/>' % (
            X(v), y, (X(v) + X(v + big)) / 2, y - 90, X(v + big), y))
        out.append(_t((X(v) + X(v + big)) / 2, y - 52, '%d %s' % (big, unit), 22, fill='#B4610F'))
        v += big
        marks.append(v)
    while v + d <= n:
        out.append('<path d="M%.1f %d Q%.1f %d %.1f %d" fill="none" stroke="#2B6FB8" stroke-width="2"/>' % (
            X(v), y, (X(v) + X(v + d)) / 2, y - 40, X(v + d), y))
        v += d
        out.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="#000" stroke-width="2"/>' % (X(v), y - 8, X(v), y + 8))
    close = X(n) - X(marks[-1]) < 70
    for m in marks:
        out.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="#000" stroke-width="3"/>' % (X(m), y - 12, X(m), y + 12))
        out.append(_t(X(m) - (4 if close and m == marks[-1] else 0), y + 40, str(m), 24,
                      'end' if close and m == marks[-1] else 'middle'))
    out.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="#C00" stroke-width="3"/>' % (X(n), y - 14, X(n), y + 14))
    out.append(_t(X(n) + (4 if close else 0), y + 40, str(n), 24, 'start' if close else 'middle', fill='#C00'))
    out.append(_t(W / 2, 30, '주황: %d %s씩 크게 뛰기 · 파랑: %d %s씩 뛰기' % (big, unit, d, unit), 22))
    return _svg(W, 225, ''.join(out))


def svg_round(v, lo, hi, step, name):
    W, x0, x1, y = 900, 60, 840, 90
    X = lambda t: x0 + (t - lo) / (hi - lo) * (x1 - x0)
    out = [_t(W / 2, 30, name, 24),
           '<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="#000" stroke-width="3"/>' % (x0, y, x1, y)]
    t = lo
    while t <= hi:
        big = t in (lo, hi) or (t - lo) % ((hi - lo) // 2) == 0
        out.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="#000" stroke-width="2"/>' % (
            X(t), y - (14 if big else 8), X(t), y + (14 if big else 8)))
        t += step
    out.append(_t(X(lo), y + 42, str(lo), 24))
    out.append(_t(X(hi), y + 42, str(hi), 24))
    out.append('<path d="M%.1f %d l-10 -18 h20 z" fill="#C00"/>' % (X(v), y - 6))
    out.append(_t(X(v), y - 30, str(v), 24, fill='#C00', weight='bold'))
    return _svg(W, 150, ''.join(out))


# ---------------------------------------------------------------- 공통 활동 조각
def step(s, i, label, sub=None):
    s.step('%s %s' % (NUM[i], label), sub)


def calc(s, items):
    """계산 칸 표. items: ('mul',a,b) | ('mul',a,b,앞글,단위) | ('div',n,d) | ('div',n,d,앞글,[이름2],[단위2],chk)
       | ('q', 글, 답, 단위). 정답 글 목록을 돌려줌."""
    rows, ans = [], []
    for it in items:
        kind = it[0]
        if kind == 'mul':
            a, b = it[1], it[2]
            pre = it[3] if len(it) > 3 else ''
            unit = it[4] if len(it) > 4 else ''
            rows.append([(pre + '\n' if pre else '') + '%d × %d =' % (a, b), '(            )' + unit])
            ans.append(ms(a, b) + unit)
        elif kind == 'div':
            n, d = it[1], it[2]
            pre = it[3] if len(it) > 3 else ''
            names = it[4] if len(it) > 4 and it[4] else None
            units = it[5] if len(it) > 5 and it[5] else ['', '']
            chk = it[6] if len(it) > 6 else False
            q, r = dv(n, d)
            if names:
                rows.append([(pre + '\n' if pre else '') + '%d ÷ %d =' % (n, d),
                             '%s (      )%s\n%s (      )%s' % (names[0], units[0], names[1], units[1])])
                ans.append('%s %d%s, %s %d%s' % (names[0], q, units[0], names[1], r, units[1]))
            else:
                rows.append(['%d ÷ %d =' % (n, d), '몫 (      ) … 나머지 (      )'])
                ans.append('%d … %d' % (q, r))
            if chk:
                rows.append(['확인', '%d × (    ) = (      )\n(      ) + (    ) = %d' % (d, n)])
                ans[-1] += '(확인 %d × %d = %d, %d + %d = %d)' % (d, q, d * q, d * q, r, n)
        else:
            _, text, a, unit = it
            rows.append([text, '(            )' + unit])
            ans.append(str(a) + unit)
    s.table(rows, header=False, col_mm=[100, 80], row_h=3402)
    return ans


def quot_try(s, n, d, ks, lv):
    """몫을 차례로 어림해 보는 표."""
    rows = [['어림한 몫', '%d × 몫' % d, '%d − (%d × 몫)' % (n, d), '어떻게 할까요?']]
    for k in ks:
        judge = '( 1 크게 / 1 작게 / 알맞아요 )' if lv == '기본형' else '(            )'
        rows.append([str(k), '(        )', '(        )', judge])
    s.table(rows, col_mm=[28, 38, 48, 66])
    out = []
    q, r = dv(n, d)
    for k in ks:
        if d * k > n:
            out.append('%d: %d, 뺄 수 없음 → 1 작게' % (k, d * k))
        elif n - d * k >= d:
            out.append('%d: %d, %d → 1 크게' % (k, d * k, n - d * k))
        else:
            out.append('%d: %d, %d → 알맞아요' % (k, d * k, n - d * k))
    return out


def mul_table(s, n, d, ks):
    rows = [['%d × %d' % (d, k) for k in ks], ['(          )'] * len(ks)]
    s.table(rows)
    return ', '.join('%d×%d=%d' % (d, k, d * k) for k in ks)


def choice_line(opts):
    return '( ' + ' / '.join(opts) + ' )'


def why(s, q, lv, n=2):
    s.ask(q, blank=False)
    s.lines(n)


def board_table(s, cells):
    full = ['출발'] + cells + ['도착']
    rows = [full[i:i + 6] for i in range(0, len(full), 6)]
    s.table(rows, header=False, row_h=2835)


def board_answers(cells):
    out = []
    for e in cells:
        if '×' in e:
            a, b = map(int, e.split('×'))
            out.append('%s=%d' % (e, a * b))
        else:
            a, b = map(int, e.split('÷'))
            out.append('%s=%s' % (e, ds(a, b).replace(' ', '')))
    return ', '.join(out)


def order_rules(s, rules, show):
    """규칙을 섞어 보여 주고 차례 번호를 쓰게 함. show = 보여 줄 차례(원래 번호 목록)."""
    rows = [['차례', '놀이 방법']] + [['(    )', rules[i][2:]] for i in show]
    s.table(rows, col_mm=[25, 155])
    return ' '.join('%d' % (i + 1) for i in show)


# ================================================================ 교과서 차시 버전
TB_BOARD = ["210÷30", "124×32", "84÷21", "560÷70", "95÷18", "315×24", "432÷36", "450÷60", "206×45", "78÷13", "589÷31",
            "612×15", "91÷24", "728÷52", "253×40", "670÷80", "806÷26", "845×19", "963÷42", "60÷15", "507×36", "740÷37"]
RULES = ["① 가위바위보로 순서를 정하고 말을 출발 칸에 놓아요.", "② 주사위를 굴려 나온 눈의 수만큼 말을 옮겨요.",
         "③ 칸의 식을 계산하고, 상대방이 계산기로 확인해요.", "④ 잘못 계산하면 말을 전에 있던 칸으로 돌려놓아요.",
         "⑤ 도착 칸에 먼저 도착하는 사람이 이겨요."]
SHOW = [2, 0, 4, 1, 3]


def tb1(s, lv):
    s.lesson(1, '개념 찾기(S)', '단원 도입 ― 가정의 달 축제에서 자원봉사를 해요',
             '우리 주변에서 곱셈과 나눗셈은 언제 쓰일까요?')
    s.scene(None, '선우네 가족은 가정의 달 축제에서 자원봉사를 하고 있어요. 입장 팔찌, 블록, 엽서, 카네이션, 빵, 기념품까지 준비할 것이 많아요.')
    step(s, 0, '만져 보기', '메뚜기 멀리뛰기')
    s.text('메뚜기는 몸길이의 약 20배만큼 멀리 뛸 수 있대요. 몸길이가 115 mm인 메뚜기는 얼마만큼 멀리 뛸 수 있을까요?')
    s.ask('115 × 2 = (          ) mm', blank=False)
    s.ask('115 × 20 = (          ) mm', blank=False)
    if lv == '기본형':
        s.fill('20은 2의 (      )배이므로 115 × 20은 115 × 2의 (      )배예요.')
    step(s, 1, '그려 보기', '곱셈·나눗셈 상황 찾기')
    s.choices([('한 상자에 213개씩 들어 있는 블록 상자 18개의 블록 수를 구할 때 쓰는 셈은?', '( 곱셈 / 나눗셈 )'),
               ('엽서 160장을 한 바구니에 20장씩 담을 때 필요한 바구니 수를 구할 때 쓰는 셈은?', '( 곱셈 / 나눗셈 )'),
               ('축제에서 할 수 있는 체험이 아닌 것은?', '( 블록 만들기 / 엽서 쓰기 /\n빵 만들기 / 수영 대회 )')])
    step(s, 2, '말해 보기', '보기 - 생각하기 - 궁금해하기')
    if lv == '기본형':
        s.text('예시: 블록 만들기 체험장에 블록을 옮겨요. / 곱하는 수, 나누는 수가 두 자리 수가 돼요.')
        s.labeled([('보기', '축제 그림에서 ____________________________ 이 보여요.'),
                   ('생각하기', '3학년 때 배운 곱셈·나눗셈과 ____________________ 이 다를 것 같아요.'),
                   ('궁금해하기', '__________________________________________ 이 궁금해요.')])
    else:
        for q in ['보기: 축제 그림에서 어떤 상황이 보이나요?', '생각하기: 3학년 때 배운 곱셈·나눗셈과 어떤 점이 다를 것 같나요?',
                  '궁금해하기: 무엇이 궁금한가요?']:
            s.ask(q, blank=False)
            s.lines(1)
    step(s, 3, '배운 내용 떠올리기', '3학년 2학기 곱셈과 나눗셈')
    a4 = calc(s, [('mul', 213, 4), ('mul', 36, 24), ('div', 75, 4, '', None, None, True), ('div', 427, 6)])
    step(s, 4, '확인하기', '알맞은 식 고르기')
    s.choices([('입장 팔찌가 한 묶음에 123개씩 20묶음 있어요. 팔찌 수를 구하는 식은?', '( 123 × 20 / 123 ÷ 20 / 123 + 20 )'),
               ('참가한 사람 76명을 19모둠으로 똑같이 나눌 때 한 모둠의 사람 수를 구하는 식은?', '( 76 × 19 / 76 ÷ 19 / 76 − 19 )')])
    ans = '1차시  ① %d mm, %d mm%s   ② 곱셈, 나눗셈, 수영 대회   ③ (자유)   ④ %s   ⑤ 123 × 20, 76 ÷ 19' % (
        115 * 2, 115 * 20, ' (10, 10)' if lv == '기본형' else '', ', '.join(a4))
    if lv == '도전형':
        step(s, 5, '도전하기', '메뚜기가 뛴 거리')
        s.ask('몸길이 115 mm인 메뚜기가 몸길이의 20배만큼 뛰었어요. 뛴 거리는 몇 mm인가요?  (          ) mm', blank=False)
        s.ask('뛴 거리는 몇 cm인가요?  (          ) cm', blank=False)
        why(s, '왜 그렇게 바꾸었는지 까닭을 써 보세요.', lv, 1)
        ans += '   ⑥ 2300 mm, %d cm (예: 10 mm = 1 cm이므로 2300 mm는 230 cm예요)' % (115 * 20 // 10)
    return ans


def tb2(s, lv):
    s.lesson(2, '개념 구축하기(O)', '세 자리 수에 몇십을 곱해 볼까요', '123 × 20은 어떻게 계산할까요?')
    s.scene(None, '선우는 입장 팔찌를 한 묶음에 123개씩 20묶음 정리했어요.')
    step(s, 0, '만져 보기', '입장 팔찌 세어 보기')
    s.picture(fig('bund123', svg_bundles(123, 2, 10, '입장 팔찌')), width_mm=170)
    s.text('세로 한 줄(123개씩 2묶음)씩 세어 보세요.')
    a1 = calc(s, [('q', '123 × 2 =', 246, ''), ('q', '123 × 20은 123 × 2의 몇 배인가요?', 10, '배'),
                  ('q', '123 × 20 =', 2460, ''), ('q', '입장 팔찌는 모두 몇 개인가요?', 2460, '개')])
    step(s, 1, '그려 보기', '곱하는 수가 10배가 되면')
    s.text('546 × 7과 546 × 70의 곱을 자릿값 표에 써 보세요.')
    s.table([['', '만의 자리', '천의 자리', '백의 자리', '십의 자리', '일의 자리'],
             ['546 × 7', '', '', '', '', ''], ['546 × 70', '', '', '', '', '']])
    s.ask('600 × 3 = 1800이니까 600 × 30 = (            )', blank=False)
    step(s, 2, '말해 보기', '말로 정리하기')
    if lv == '기본형':
        s.fill(['(세 자리 수) × (몇십)은 (세 자리 수) × (몇)의 값을 ( 10배 / 2배 / 100배 ) 한 값과 같아요.',
                '546 × 7 = 3822이면 546 × 70 = ( 38220 / 3822 / 382200 )이에요.'])
    else:
        s.fill(['(세 자리 수) × (몇십)은 (세 자리 수) × (몇)의 값을 (          ) 한 값과 같아요.',
                '546 × 7 = 3822이면 546 × 70 = (            )이에요.'])
        why(s, '546 × 70이 546 × 7의 10배인 까닭을 써 보세요.', lv)
    step(s, 3, '약속하기', '세로로 계산하기')
    s.text('203 × 40을 세로로 계산해 보세요. 203 × 4를 계산하고 일의 자리에 0을 써요.')
    s.picture(fig('lm203x40' + lv, svg_longmul(203, 40, lv == '기본형')), width_mm=95 if lv == '기본형' else 60)
    if lv == '기본형':
        s.ask('203 × 4 = (          )  →  203 × 40 = (          )', blank=False)
    step(s, 4, '확인하기')
    a5 = calc(s, [('mul', 748, 60), ('mul', 400, 20), ('mul', 310, 50),
                  ('mul', 290, 30, '매일 290 km씩 달리는 고속버스가 30일 동안 달린 거리', ' km')])
    ans = '2차시  ① %s   ② 3822 → 38220 (숫자가 한 자리씩 왼쪽으로), 18000   ③ 10배, 38220   ④ 812, 8120   ⑤ %s' % (
        ', '.join(a1), ', '.join(a5))
    if lv == '도전형':
        ans = ans.replace('④ 812, 8120', '④ 8120')
        step(s, 5, '도전하기', '문제 만들기와 □ 찾기')
        s.text('‘한 개에 950원인 지우개가 있습니다.’ 뒤에 950 × 80에 알맞은 문제를 이어 쓰고 풀어 보세요.')
        s.lines(1)
        s.ask('식: 950 × 80 = (            )원', blank=False)
        s.ask('847 × □0 = 50820일 때 □ 안의 수는?  (      )', blank=False)
        why(s, '□ 안의 수를 어떻게 찾았는지 써 보세요.', lv, 1)
        sq = 50820 // 10 // 847
        assert 847 * sq * 10 == 50820
        ans += '   ⑥ 예) 이 지우개를 80개 산다면 얼마를 내야 할까요? %d원 / %d (847 × %d = %d)' % (950 * 80, sq, sq, 847 * sq)
    return ans


def tb3(s, lv):
    s.lesson(3, '개념 구축하기(O)', '세 자리 수에 몇십몇을 곱해 볼까요', '213 × 18은 어떻게 계산할까요?')
    s.scene(None, '서현이가 블록 만들기 체험장에 블록을 한 상자에 213개씩 18상자 옮겼어요.')
    step(s, 0, '만져 보기', '어림하고 두 묶음으로 나누어 계산하기')
    s.choices([('먼저 어림해요. 블록은 모두 몇 개쯤일까요?', '( 400개쯤 / 4000개쯤 / 40000개쯤 )')])
    s.picture(fig('area213', svg_area(213, 18, '블록', '상자')), width_mm=130)
    a1 = calc(s, [('q', '213 × 10 =', 2130, ''), ('q', '213 × 8 =', 1704, ''), ('q', '213 × 18 =', 213 * 18, '')])
    step(s, 1, '그려 보기', '374 × 23 세로로 계산하기')
    s.text('374 × 3, 374 × 20을 차례로 쓰고 더해요.')
    s.picture(fig('lm374x23' + lv, svg_longmul(374, 23, lv == '기본형')), width_mm=110 if lv == '기본형' else 70)
    step(s, 2, '말해 보기', '말로 정리하기')
    if lv == '기본형':
        s.fill(['(세 자리 수) × (몇십몇)은 세 자리 수에 몇십몇의 ( 일의 자리 수 / 백의 자리 수 )를 곱한 값과',
                '( 십의 자리 수 / 일의 자리 수 )를 곱한 값을 ( 더해요 / 빼요 ).',
                '십의 자리 수를 곱한 값은 ( 한 자리 왼쪽으로 밀어 / 일의 자리에 맞추어 ) 써요.'])
    else:
        s.fill(['(세 자리 수) × (몇십몇)은 세 자리 수에 몇십몇의 (            )를 곱한 값과',
                '(            )를 곱한 값을 (        ).'])
        why(s, '374 × 20의 곱을 한 자리 왼쪽으로 밀어 쓰는 까닭을 써 보세요.', lv)
    step(s, 3, '약속하기', '279 × 35 세로로 계산하기')
    s.picture(fig('lm279x35', svg_longmul(279, 35)), width_mm=70)
    step(s, 4, '확인하기', '먼저 어림해 보면 잘못 계산한 것을 찾기 쉬워요')
    a5 = calc(s, [('mul', 654, 48), ('mul', 754, 12), ('mul', 579, 67), ('mul', 304, 27)])
    if lv == '기본형':
        s.choices([('304 × 27은 약 얼마일까요?', '( 900 / 9000 / 90000 )')])
    ans = '3차시  ① 4000개쯤, %s (어림한 4000개보다 조금 적어요)   ② 1122, 7480(748), %d   ③ 일의 자리 수, 십의 자리 수, 더해요%s   ④ %d, %d(837), %d   ⑤ %s%s' % (
        ', '.join(a1), 374 * 23, ', 한 자리 왼쪽으로 밀어' if lv == '기본형' else '',
        279 * 5, 279 * 30, 279 * 35, ', '.join(a5), ', 약 9000' if lv == '기본형' else '')
    if lv == '도전형':
        a, b = best_mul([1, 3, 5, 6, 8])
        step(s, 5, '도전하기', '수 카드 1, 3, 5, 6, 8')
        s.text('수 카드를 한 번씩 모두 사용하여 가장 큰 세 자리 수와 가장 작은 두 자리 수를 만들고, 두 수의 곱을 구해 보세요.')
        s.ask('가장 큰 세 자리 수 (        ), 가장 작은 두 자리 수 (      ), 곱 (            )', blank=False)
        why(s, '수 카드를 어떻게 놓았는지 까닭을 써 보세요.', lv, 1)
        ans += '   ⑥ %d, %d, %d × %d = %d' % (a, b, a, b, a * b)
    return ans


def tb4(s, lv):
    s.lesson(4, '개념 구축하기(O)', '몇십으로 나누어 볼까요', '160 ÷ 20과 271 ÷ 50은 어떻게 계산할까요?')
    s.scene(None, '엽서 160장을 한 바구니에 20장씩 담으려고 해요.')
    step(s, 0, '만져 보기', '수 모형을 20씩 묶기')
    s.picture(fig('rods16', svg_rods(16, '십 모형 2개씩 묶어 보세요.')), width_mm=150)
    a1 = calc(s, [('q', '십 모형 2개씩 몇 묶음인가요?', 8, '묶음'), ('q', '160 ÷ 20 =', 8, ''),
                  ('q', '확인: 20 × 8 =', 160, ''), ('q', '필요한 바구니는 몇 개인가요?', 8, '개')])
    step(s, 1, '그려 보기', '271 ÷ 50의 몫을 4, 6, 5로 어림하기')
    a2 = quot_try(s, 271, 50, [4, 6, 5], lv)
    s.ask('271 ÷ 50 = (      ) … (      )', blank=False)
    step(s, 2, '말해 보기', '몫을 고치는 방법')
    if lv == '기본형':
        s.fill(['나머지가 나누는 수보다 크거나 같으면 몫을 1 ( 크게 / 작게 ) 해요.',
                '나누는 수 × 몫이 나누어지는 수보다 커서 뺄 수 없으면 몫을 1 ( 작게 / 크게 ) 해요.',
                '나머지는 언제나 나누는 수보다 ( 작아야 / 커야 ) 해요.'])
    else:
        s.fill(['나머지가 나누는 수보다 크거나 같으면 몫을 (          ) 해요.',
                '나누는 수 × 몫이 나누어지는 수보다 커서 뺄 수 없으면 몫을 (          ) 해요.'])
        why(s, '나머지가 나누는 수보다 작아야 하는 까닭을 써 보세요.', lv)
    step(s, 3, '약속하기', '372 ÷ 60 세로로 계산하기')
    s.picture(fig('ld372_60', svg_longdiv(372, 60)), width_mm=55)
    s.ask('확인: 60 × (    ) = (        ),  (        ) + (      ) = 372', blank=False)
    step(s, 4, '확인하기')
    a5 = calc(s, [('div', 68, 20), ('div', 280, 40),
                  ('div', 360, 50, '구슬 360개를 50개씩 나누어 목걸이를 만들면', ['목걸이', '남는 구슬'], ['개', '개'])])
    q, r = dv(372, 60)
    ans = '4차시  ① %s   ② %s, 271 ÷ 50 = %s   ③ 크게, 작게%s   ④ %d … %d (확인 60 × %d = %d, %d + %d = 372)   ⑤ %s' % (
        ', '.join(a1), ' / '.join(a2), ds(271, 50), ', 작아야' if lv == '기본형' else '', q, r, q, 60 * q, 60 * q, r, ', '.join(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '친구의 계산 살펴보기')
        s.text('친구가 161 ÷ 30을 계산했어요. “30 × 4 = 120, 120 + 41 = 161이니 161 ÷ 30 = 4 … 41이 맞아요.”')
        s.choices([('잘못 계산한 까닭은?', '( 30 × 4를 잘못 계산했어요 /\n나머지 41이 나누는 수 30보다 커요 /\n161에서 120을 잘못 뺐어요 )')])
        s.ask('옳게 계산하면 161 ÷ 30 = (      ) … (      )', blank=False)
        why(s, '검산이 맞아 보이는데 왜 틀렸는지 써 보세요.', lv, 1)
        ans += '   ⑥ 나머지 41이 나누는 수 30보다 커요, %s' % ds(161, 30)
    return ans


def tb5(s, lv):
    s.lesson(5, '개념 구축하기(O)', '몇십몇으로 나누어 볼까요 ⑴ 몫이 한 자리 수인 경우', '76 ÷ 19와 164 ÷ 52는 어떻게 계산할까요?')
    s.scene(None, '카네이션 만들기 체험에 76명이 참가했어요. 19모둠으로 똑같이 나누면 한 모둠은 몇 명일까요?')
    step(s, 0, '만져 보기', '76 ÷ 19의 몫을 3, 5, 4로 어림하기')
    a1 = quot_try(s, 76, 19, [3, 5, 4], lv)
    s.ask('76 ÷ 19 = (      )  →  한 모둠은 (      )명', blank=False)
    step(s, 1, '그려 보기', '곱셈표로 164 ÷ 52의 몫 어림하기')
    if lv == '기본형':
        s.text('164를 160으로, 52를 50으로 어림하면 몫은 3쯤이에요.')
    a2 = mul_table(s, 164, 52, [2, 3, 4])
    s.ask('164 ÷ 52 = (      ) … (      )', blank=False)
    step(s, 2, '말해 보기', '정리하기')
    if lv == '기본형':
        s.fill(['164 ÷ 52는 52 × 3 = 156이므로 몫은 ( 3 / 4 / 8 )이고, 나머지는 164 − 156 = ( 8 / 56 / 108 )이에요.',
                '계산이 맞는지 52 × 3 = 156, 156 + 8 = ( 164 / 156 / 172 )으로 확인해요.'])
    else:
        s.fill(['164 ÷ 52는 52 × 3 = 156이므로 몫은 (    )이고, 나머지는 (        )이에요.',
                '계산이 맞는지 (                                   )으로 확인해요.'])
        why(s, '몫을 4로 하지 않은 까닭을 써 보세요.', lv)
    step(s, 3, '약속하기', '524 ÷ 78 세로로 계산하기')
    s.text('524를 520으로, 78을 80으로 어림해 몫을 정해 보세요.')
    s.picture(fig('ld524_78', svg_longdiv(524, 78)), width_mm=55)
    s.ask('확인: 78 × (    ) = (        ),  (        ) + (      ) = 524', blank=False)
    step(s, 4, '확인하기')
    a5 = calc(s, [('div', 69, 24), ('div', 288, 36),
                  ('div', 138, 15, '페트병 15개로 티셔츠 한 장을 만들 때, 페트병 138개로', ['티셔츠', '남는 페트병'], ['장', '개'])])
    q, r = dv(524, 78)
    ans = '5차시  ① %s, 4, 4명   ② %s, %s   ③ 3, 8, 164%s   ④ %d … %d (78 × %d = %d, %d + %d = 524)   ⑤ %s' % (
        ' / '.join(a1), a2, ds(164, 52), '' if lv == '기본형' else ' (예: 52 × 4 = 208은 164보다 커서 뺄 수 없어요)',
        q, r, q, 78 * q, 78 * q, r, ', '.join(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '거꾸로 생각하기')
        s.ask('□ ÷ 44 = 7 … 13일 때 □ = (          )', blank=False)
        s.ask('길이가 135 m인 산책로의 처음부터 끝까지 가로등 28개를 같은 간격으로 세우면 간격은 몇 m인가요?  (      ) m', blank=False)
        why(s, '가로등 사이의 간격 수를 어떻게 구했는지 써 보세요.', lv, 1)
        assert 135 % 27 == 0
        ans += '   ⑥ %d, %d m (간격은 28 − 1 = 27군데)' % (44 * 7 + 13, 135 // 27)
    return ans


def tb6(s, lv):
    s.lesson(6, '개념 구축하기(O)', '몇십몇으로 나누어 볼까요 ⑵ 몫이 두 자리 수이고 나누어떨어지는 경우',
             '736 ÷ 32는 어떻게 계산할까요?')
    s.scene(None, '빵 만들기 체험을 위해 밀가루 반죽 736 g을 32 g씩 나누어요.')
    step(s, 0, '만져 보기', '크게 뛰고 작게 뛰어 세기')
    s.choices([('먼저 어림해요. 반죽은 몇십 개쯤 될까요?', '( 2개쯤 / 20개쯤 / 200개쯤 )')])
    s.picture(fig('jump736', svg_jump(736, 32, 'g')), width_mm=170)
    a1 = calc(s, [('q', '32 × 20 =', 640, ''), ('q', '736 − 640 =', 96, ''), ('q', '32 × 3 =', 96, ''),
                  ('q', '736 ÷ 32 =   → 반죽은 몇 개인가요?', 23, '개')])
    step(s, 1, '그려 보기', '736 ÷ 32 세로로 계산하기')
    s.text('몫의 십의 자리부터 구해요.')
    s.picture(fig('ld736_32', svg_longdiv(736, 32)), width_mm=55)
    s.ask('확인: 32 × (      ) = (          )', blank=False)
    step(s, 2, '말해 보기', '정리하기')
    if lv == '기본형':
        s.fill(['몫이 두 자리 수인 나눗셈은 몫을 ( 십의 자리와 일의 자리 / 백의 자리와 십의 자리 )로 나누어 구해요.',
                '736 ÷ 32에서 먼저 32 × ( 20 / 2 / 30 ) = 640을 빼고, 남은 96에서 32 × 3 = 96을 빼요.',
                '그래서 몫은 ( 23 / 5 / 203 )이에요.'])
    else:
        s.fill(['736 ÷ 32에서 먼저 32 × (      ) = 640을 빼고, 남은 (      )에서 32 × (    ) = 96을 빼요.',
                '그래서 몫은 (      )이에요.'])
        why(s, '736에서 32 × 20을 먼저 빼는 까닭을 써 보세요.', lv)
    step(s, 3, '약속하기', '곱셈표로 918 ÷ 27의 몫 어림하기')
    a4 = mul_table(s, 918, 27, [20, 30, 40])
    s.ask('918 − 810 = (        ),  27 × (    ) = 108  →  918 ÷ 27 = (        )', blank=False)
    step(s, 4, '확인하기', '계산하고 맞는지 확인하기')
    a5 = calc(s, [('div', 516, 43), ('div', 799, 17), ('div', 828, 23, '', None, None, True)])
    ans = '6차시  ① 20개쯤, %s   ② 23 (64 → 96 → 96 → 0), 32 × 23 = 736   ③ %s   ④ %s, 108, 4, %s   ⑤ %s' % (
        ', '.join(a1), '십의 자리와 일의 자리, 20, 23' if lv == '기본형' else '20, 96, 3, 23 (예: 32 × 30 = 960은 736보다 커서)',
        a4, ds(918, 27), ', '.join(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '빈칸의 수 구하기')
        s.text('13 ) □□6 을 계산했더니 몫의 십의 자리에서 26을 빼고, 일의 자리에서도 26을 빼서 나머지가 0이 되었어요.')
        s.ask('몫은? (        )    나누어지는 수는? (          )', blank=False)
        why(s, '어떻게 찾았는지 써 보세요.', lv, 1)
        assert 13 * 22 == 286
        ans += '   ⑥ 22, 286 (13 × 22 = 286)'
    return ans


def tb7(s, lv):
    s.lesson(7, '개념 구축하기(O)', '몇십몇으로 나누어 볼까요 ⑶ 몫이 두 자리 수이고 나머지가 있는 경우',
             '950 ÷ 45는 어떻게 계산할까요?')
    s.scene(None, '기념품 한 개를 포장하는 데 리본 45 cm가 필요해요. 리본 950 cm로 기념품을 몇 개까지 포장할 수 있을까요?')
    step(s, 0, '만져 보기', '뛰어 세기')
    s.choices([('먼저 어림해요. 기념품은 몇 개쯤 포장할 수 있을까요?', '( 2개쯤 / 20개쯤 / 200개쯤 )')])
    s.picture(fig('jump950', svg_jump(950, 45, 'cm')), width_mm=170)
    s.ask('45 × 20 = (        ),  950 − 900 = (      ),  50 − 45 = (      )', blank=False)
    s.ask('기념품 (      )개를 포장하고 리본 (      ) cm가 남아요.', blank=False)
    step(s, 1, '그려 보기', '950 ÷ 45 세로로 계산하기')
    s.picture(fig('ld950_45', svg_longdiv(950, 45)), width_mm=55)
    s.ask('확인: 45 × (      ) = (        ),  (        ) + (    ) = 950', blank=False)
    step(s, 2, '말해 보기', '나머지가 있는 나눗셈에서 확인할 것')
    if lv == '기본형':
        s.fill(['950 ÷ 45의 몫은 ( 21 / 20 / 22 ), 나머지는 5예요.',
                '나머지는 나누는 수보다 ( 작아야 / 커야 ) 해요.',
                '계산이 맞는지 45 × 21 = 945, 945 + 5 = ( 950 / 945 / 900 )으로 확인해요.'])
    else:
        s.fill(['950 ÷ 45의 몫은 (      ), 나머지는 (      )예요.'])
        why(s, '나머지 5가 알맞은지 어떻게 알 수 있는지 써 보세요.', lv)
    step(s, 3, '약속하기', '곱셈표로 828 ÷ 34의 몫 어림하기')
    a4 = mul_table(s, 828, 34, [10, 20, 30])
    s.ask('828 − 680 = (        ),  34 × (    ) = 136  →  828 ÷ 34 = (      ) … (      )', blank=False)
    step(s, 4, '확인하기')
    a5 = calc(s, [('div', 370, 16), ('div', 755, 52), ('div', 907, 25),
                  ('div', 547, 36, '빈 병 547개를 한 상자에 36개씩 담으면', ['상자', '남는 빈 병'], ['상자', '개'])])
    ans = '7차시  ① 20개쯤, 900, 50, 5 / 21개, 5 cm   ② 21 … 5 (90 → 50 → 45 → 5), 45 × 21 = 945, 945 + 5 = 950   ③ %s   ④ %s, 148, 4, %s   ⑤ %s' % (
        '21, 작아야, 950' if lv == '기본형' else '21, 5 (예: 5는 나누는 수 45보다 작아요)', a4, ds(828, 34), ', '.join(a5))
    if lv == '도전형':
        a, b = best_div([2, 3, 6, 8, 1])
        step(s, 5, '도전하기', '수 카드 2, 3, 6, 8, 1')
        s.text('수 카드를 한 번씩 모두 사용하여 몫이 가장 큰 (세 자리 수) ÷ (두 자리 수)를 만들고 계산해 보세요.')
        s.ask('(        ) ÷ (      ) = (      ) … (      )', blank=False)
        why(s, '나누어지는 수와 나누는 수를 어떻게 만들었는지 써 보세요.', lv, 1)
        ans += '   ⑥ %d ÷ %d = %s' % (a, b, ds(a, b))
    return ans


def tb8(s, lv):
    s.lesson(8, '개념 구축하기(O)', '어림셈을 활용해 볼까요',
             '실제 수를 계산하기 쉬운 수로 바꾸면 얼마쯤인지 어떻게 알 수 있을까요?')
    s.scene(None, '선우는 한 개에 890원인 야광봉을 19개 사려고 해요.')
    step(s, 0, '만져 보기', '곱셈 어림하기')
    s.picture(fig('r890', svg_round(890, 800, 900, 10, '야광봉 한 개의 값 890원')), width_mm=120)
    s.picture(fig('r19', svg_round(19, 10, 20, 1, '야광봉의 수 19개')), width_mm=120)
    s.ask('890은 (      )으로, 19는 (      )으로 어림해요.  어림한 식 900 × 20 = (          )원 정도', blank=False)
    step(s, 1, '그려 보기', '연필 480원 × 28자루')
    s.ask('480은 (      )에, 28은 (      )에 더 가까워요.', blank=False)
    s.ask('어림한 식 (      ) × (      ) = (          )원 정도', blank=False)
    step(s, 2, '말해 보기', '나눗셈 어림하기')
    s.text('의자 370개를 한 줄에 30개씩 놓으면 몇 줄쯤 될까요? 370 가까이에서 30으로 나누기 쉬운 수를 찾아요.')
    s.ask('30씩 뛰어 세기: 330, (      ), (      ), 420', blank=False)
    s.ask('370보다 작은 쪽: (      ) ÷ 30 = (    )줄쯤      370보다 큰 쪽: (      ) ÷ 30 = (    )줄쯤', blank=False)
    step(s, 3, '약속하기', '어림한 방법 견주기')
    s.choices([('누나는 370을 360으로 어림했어요.', '( 실제 수보다 작게 / 크게 )'),
               ('선우는 370을 390으로 어림했어요.', '( 실제 수보다 작게 / 크게 )'),
               ('어림셈에 대해 바른 말은?', '( 어림한 답은 하나뿐이에요 /\n방법에 따라 답이 다를 수 있어요 )')])
    if lv == '도전형':
        why(s, '누나와 선우의 어림이 둘 다 알맞은 까닭을 써 보세요.', lv, 1)
    step(s, 4, '확인하기', '사탕 250개를 친구 20명에게')
    if lv == '기본형':
        s.text('20으로 나누기 쉬운 수: 240, 260')
    s.ask('250을 (      )으로 어림하면 (      ) ÷ 20 = (    )  →  한 사람에게 (    )개쯤', blank=False)
    ans = '8차시  ① 900, 20, 18000   ② 500, 30 / 500 × 30 = 15000   ③ 360, 390 / 360 ÷ 30 = 12, 390 ÷ 30 = 13   ④ 작게, 크게, 방법에 따라 답이 다를 수 있어요   ⑤ 240 ÷ 20 = 12 → 12개쯤 (또는 260 ÷ 20 = 13 → 13개쯤)'
    assert 240 // 20 == 12 and 260 // 20 == 13 and 360 // 30 == 12 and 390 // 30 == 13
    if lv == '도전형':
        step(s, 5, '도전하기', '우리 반 어림셈왕')
        s.ask('612 × 38을 600 × 40으로 어림하면 (          )', blank=False)
        s.ask('297 × 51을 300 × 50으로 어림하면 (          )', blank=False)
        s.ask('실제 612 × 38 = (          )', blank=False)
        why(s, '어림한 값과 실제 값을 견주어 알게 된 점을 써 보세요.', lv, 1)
        ans += '   ⑥ %d, %d, %d (어림한 값과 가까워요)' % (600 * 40, 300 * 50, 612 * 38)
    return ans


def tb9(s, lv):
    s.lesson(9, '탐구 정리하기(O)', '생각을 더하다 ― 지구를 위해 물 발자국을 줄여요',
             '물 발자국을 줄이려면 어떤 샐러드를 만들어야 할까요?')
    s.scene(None, ['다온이는 요리 수업 시간에 친구 23명을 위한 샐러드를 만들려고 해요.',
                   '물 발자국은 음식이나 물건을 만들거나 버릴 때 사용되는 물의 양이에요.'])
    step(s, 0, '이해해요')
    s.choices([('무엇을 비교해야 할까요?', '( 물 발자국 / 무게 / 색깔 )'),
               ('사과 복숭아 양상추 샐러드의 재료는?', '( 사과, 복숭아, 양상추 /\n토마토, 바나나, 양상추 )'),
               ('만들어야 할 샐러드는 모두 몇 인분?', '( 20인분 / 23인분 / 32인분 )')])
    step(s, 1, '계획하고 해결해요', '1인분의 물 발자국 (출처: 물 발자국 네트워크, 2023)')
    s.table([['샐러드', '재료의 물 발자국(L)', '1인분 합(L)'],
             ['사과 복숭아 양상추', '125 + 140 + 119', '(          )'],
             ['토마토 바나나 양상추', '100 + 160 + 119', '(          )']], col_mm=[55, 75, 50])
    s.ask('물 발자국이 더 적은 샐러드: (                            )', blank=False)
    step(s, 2, '23인분 구하기', '379 × 23 (L)')
    s.picture(fig('lm379x23' + lv, svg_longmul(379, 23, lv == '기본형')), width_mm=110 if lv == '기본형' else 70)
    step(s, 3, '되돌아봐요')
    if lv == '기본형':
        s.labeled([('방법', '1인분의 물 발자국을 ________ 비교하고, 23을 ________ 했어요.'),
                   ('실천', '물 발자국을 줄이려고 나는 ______________________ 할 수 있어요.')])
    else:
        s.ask('어떤 방법으로 해결했는지 설명해 보세요.', blank=False)
        s.lines(1)
        s.ask('물 발자국을 줄이기 위해 내가 할 수 있는 일을 써 보세요.', blank=False)
        s.lines(1)
    step(s, 4, '내 힘으로 풀어요', '반 친구 20명, 2가지 재료 샐러드')
    s.table([['샐러드', '재료의 물 발자국(L)', '1인분 합(L)'],
             ['바나나 복숭아', '160 + 140', '(          )'],
             ['사과 양상추', '125 + 119', '(          )']], col_mm=[55, 75, 50])
    s.ask('만들어야 할 샐러드 (                    ),  20인분: 244 × 20 = (          ) L', blank=False)
    assert 125 + 140 + 119 == 384 and 100 + 160 + 119 == 379
    ans = '9차시  ① 물 발자국, 사과·복숭아·양상추, 23인분   ② 384, 379 / 토마토 바나나 양상추 샐러드   ③ 1137, 7580(758), %d L   ④ %s   ⑤ 300, 244 / 사과 양상추 샐러드, %d L' % (
        379 * 23, '더해, 곱 / (자유)' if lv == '기본형' else '(자유) 예: 1인분을 더해 비교하고 23을 곱했어요', 244 * 20)
    if lv == '도전형':
        step(s, 5, '도전하기', '얼마나 더 많았을까요?')
        s.text('다온이가 사과 복숭아 양상추 샐러드(1인분 384 L)를 23인분 만들었다면 물 발자국은 얼마나 더 많았을까요?')
        s.ask('384 × 23 = (          ) L,   (          ) − 8717 = (        ) L', blank=False)
        why(s, '더 간단하게 구하는 방법을 써 보세요.', lv, 1)
        ans += '   ⑥ %d L, %d L (예: (384 − 379) × 23 = 5 × 23 = 115)' % (384 * 23, 384 * 23 - 379 * 23)
    return ans


def tb10(s, lv):
    s.lesson(10, '발표하기(P)', '놀이를 더하다 ― 신나는 곱셈, 나눗셈 우주여행!',
             '곱셈과 나눗셈을 옳게 계산하며 우주여행 놀이를 해 볼까요?')
    s.scene(None, '놀이판의 식을 옳게 계산해야 앞으로 나아갈 수 있어요. 상대방의 계산이 맞는지 계산기로 확인해요.')
    step(s, 0, '놀이 방법 알기', '차례대로 번호 쓰기')
    order = order_rules(s, RULES, SHOW)
    step(s, 1, '놀이판 살펴보기', '210 ÷ 30 칸에 멈추었어요')
    a2 = calc(s, [('div', 210, 30, '', None, None, True)])
    step(s, 2, '놀이하기', '우주여행 놀이판')
    board_table(s, TB_BOARD)
    s.table([['멈춘 칸의 식', '내 답', '친구 확인(○/×)']] + [['', '', '']] * 4, col_mm=[70, 70, 40])
    step(s, 3, '규칙 지키기')
    s.choices([('말이 이동한 칸에 상대방의 말이 있으면?', '( 주사위를 한 번 더 굴려 이동 /\n상대방 말을 출발 칸으로 / 한 번 쉬기 )'),
               ('칸의 식을 잘못 계산하면?', '( 전에 있던 칸으로 / 그대로 / 도착 칸으로 )'),
               ('놀이할 때 주의할 점은?', '( 계산기로 확인해요 / 이기는 것만 생각해요 /\n친구가 틀리면 놀려요 )')])
    step(s, 4, '계산 다시 확인하기')
    a5 = calc(s, [('div', 963, 42), ('mul', 845, 19), ('div', 670, 80)])
    ans = '10차시  ① 위에서부터 %s   ② %s   ③ (놀이 기록)   ④ 한 번 더 굴려 이동, 전에 있던 칸으로, 계산기로 확인해요   ⑤ %s' % (
        order, a2[0], ', '.join(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '어려웠던 식')
        a6 = calc(s, [('mul', 507, 36), ('div', 728, 52), ('div', 91, 24, '', None, None, True)])
        why(s, '놀이판에서 가장 어려웠던 식과 그 까닭을 써 보세요.', lv, 1)
        ans += '   ⑥ %s' % ', '.join(a6)
    return ans


def tb11(s, lv):
    s.lesson(11, '발표하기(P)', '공부한 내용을 확인해요', '곱셈과 나눗셈을 정확하게 계산하고 설명할 수 있나요?')
    s.scene(None, '가정의 달 축제 자원봉사를 마치며 곱셈과 나눗셈을 정리해요.')
    step(s, 0, '곱셈 확인하기')
    a1 = calc(s, [('mul', 340, 2), ('mul', 340, 20), ('mul', 420, 54), ('mul', 550, 48), ('mul', 720, 30)])
    step(s, 1, '나눗셈 계산하고 확인하기', '785 ÷ 19')
    s.picture(fig('ld785_19', svg_longdiv(785, 19)), width_mm=55)
    s.ask('확인: 19 × (      ) = (        ),  (        ) + (    ) = 785', blank=False)
    step(s, 2, '몫의 크기 비교하기')
    s.choices([('630 ÷ 90 ○ 228 ÷ 34', '( > / = / < )'), ('60 ) 482 의 몫과 나머지는?', '( 8 … 2 / 7 … 62 / 8 … 20 )')])
    step(s, 3, '잘못 계산한 곳 찾기', '298 ÷ 36')
    s.text('친구의 계산: 36 × 7 = 252, 298 − 252 = 46 → 298 ÷ 36 = 7 … 46')
    s.choices([('잘못 계산한 까닭은?', '( 나머지가 나누는 수보다 커요 /\n36 × 7을 잘못 계산했어요 /\n몫을 1 작게 해야 해요 )')])
    s.ask('옳게 계산하면 298 ÷ 36 = (      ) … (      )', blank=False)
    step(s, 4, '문제 해결하기')
    s.text('로봇 875개를 25상자에, 인형 777개를 21상자에 똑같이 나누어 담았어요. 또 어떤 수에 21을 곱했더니 462가 되었어요.')
    a5 = calc(s, [('q', '한 상자에 담은 로봇 875 ÷ 25 =', 875 // 25, '개'), ('q', '한 상자에 담은 인형 777 ÷ 21 =', 777 // 21, '개'),
                  ('q', '어떤 수는?', 462 // 21, ''), ('q', '150에 어떤 수를 곱한 값은?', 150 * (462 // 21), '')])
    assert 875 % 25 == 0 and 777 % 21 == 0 and 462 % 21 == 0
    q, r = dv(785, 19)
    ans = '11차시  ① %s   ② %d … %d (19 × %d = %d, %d + %d = 785)   ③ >, 8 … 2   ④ 나머지가 나누는 수보다 커요, %s   ⑤ %s' % (
        ', '.join(a1), q, r, q, 19 * q, 19 * q, r, ds(298, 36), ', '.join(a5))
    assert 630 // 90 > 228 // 34 and ds(482, 60) == '8 … 2'
    if lv == '도전형':
        step(s, 5, '도전하기', '사다리 타기')
        a6 = calc(s, [('mul', 243, 48), ('div', 68, 17), ('div', 776, 59), ('div', 560, 80)])
        why(s, '이 단원에서 가장 자신 있는 계산과 그 까닭을 써 보세요.', lv, 1)
        ans += '   ⑥ %s' % ', '.join(a6)
    return ans


# ================================================================ 이야기 버전
ST_BOARD = ["240÷30", "135×24", "96÷32", "420÷60", "87÷25", "208×35", "476÷28", "350÷40", "314×26", "91÷13", "645÷43",
            "523×18", "77÷19", "936÷52", "160×45", "590÷80", "741÷39", "472×23", "880÷24", "54÷18", "609×32", "826÷59"]


def rule_first(s, q, lv):
    s.ask('먼저 예상해요 · ' + q, blank=False)
    s.ask('내 규칙: ______________________________________________', blank=False)


def st1(s, lv):
    s.lesson(1, '개념 찾기(S)', '과학 축제 준비 위원회가 되었어요', '과학 축제를 준비할 때 곱셈과 나눗셈은 언제 쓰일까요?')
    s.scene(None, '우리 학교에 과학 축제가 열려요. 4학년 2반 26명이 과학 축제 준비 위원회를 맡았어요. 위원장 하준이와 서윤, 도윤, 지아, 민재, 예린이가 부스마다 준비를 나누어 맡아요.')
    step(s, 0, '만져 보기', '보기·생각하기·궁금해하기')
    s.text('칠판 준비 목록: ‘빨대 로켓 빨대: 한 봉지에 136개씩 20봉지’, ‘고무 찰흙 180개: 한 바구니에 30개씩’, ‘과학 마술 참가자 92명: 23모둠으로’')
    if lv == '기본형':
        s.labeled([('보여요', '준비 목록에서 ____________________________ 이 보여요.'),
                   ('생각해요', '______________ 은 ( 곱셈 / 나눗셈 )으로 구하면 될 것 같아요.'),
                   ('궁금해요', '______________________________ 은 어떻게 계산할까?')])
    else:
        for q in ['보여요: 준비 목록에서 곱하거나 나누어야 하는 수', '생각해요: 어떤 셈을 쓰면 될까요?', '궁금해요: 곱셈과 나눗셈에서 궁금한 것']:
            s.ask(q, blank=False)
            s.lines(1)
    step(s, 1, '그려 보기', '트랙 조각 이어 붙이기')
    s.text('도윤이의 트랙 조각 한 개의 길이는 125 cm예요. 조각 20개를 이어 붙이면 트랙은 몇 cm일까요?')
    s.ask('125 × 2 = (          ) cm      125 × 20 = (          ) cm', blank=False)
    if lv == '기본형':
        s.fill('20은 2의 (      )배이므로 125 × 20은 125 × 2의 (      )배예요.')
    step(s, 2, '말해 보기', '3학년 때 배운 셈 떠올리기')
    a3 = calc(s, [('mul', 214, 3), ('mul', 42, 23), ('div', 86, 4, '', None, None, True), ('div', 532, 7)])
    if lv == '기본형':
        s.fill('4 × 21 + 2 = (      )이고, 이 값이 나누어지는 수 86과 같으면 맞게 계산한 거예요.')
    else:
        why(s, '왜 그럴까요? 86 ÷ 4를 계산한 뒤 왜 4 × 21 + 2를 계산해 볼까요?', lv, 1)
    step(s, 3, '약속하기', '곱셈과 나눗셈이 필요한 때')
    if lv == '기본형':
        s.fill(['같은 수를 여러 번 모을 때는 ( 곱셈 / 나눗셈 )을, 똑같이 나누거나 몇씩 묶을 때는 ( 나눗셈 / 덧셈 )을 써요.',
                '나눗셈은 나누는 수 × 몫 + 나머지 = ( 나누어지는 수 / 나누는 수 )로 맞는지 확인해요.'])
    else:
        s.fill(['같은 수를 여러 번 모을 때는 (        )을, 똑같이 나누거나 몇씩 묶을 때는 (        )을 써요.',
                '나눗셈은 나누는 수 × 몫 + 나머지 = (              )로 맞는지 확인해요.'])
    step(s, 4, '확인하기', '준비 목록 보고 고르기')
    s.choices([('종이컵을 한 줄에 48개씩 15줄 쌓았어요. 종이컵 수를 구하는 식은?', '( 48 × 15 / 48 ÷ 15 / 48 + 15 )'),
               ('건전지 200개를 한 상자에 24개씩 담을 때 상자 수를 구하는 식은?', '( 200 × 24 / 200 ÷ 24 / 200 − 24 )')])
    s.text('나눗셈이 필요한 일에 모두 ○ 하세요.')
    s.choices([('㉠ 비눗방울 용액 864 mL를 36 mL씩 컵에 나누어요', '(    )'), ('㉡ 돋보기 32개의 값을 구해요', '(    )'),
               ('㉢ 참가자 92명을 23모둠으로 똑같이 나누어요', '(    )'), ('㉣ 트랙 조각 20개의 길이를 구해요', '(    )')])
    ans = '1차시  ① (자유)   ② 250, 2500%s   ③ %s%s   ④ 곱셈, 나눗셈, 나누어지는 수   ⑤ 48 × 15, 200 ÷ 24, ㉠·㉢에 ○' % (
        ' (10, 10)' if lv == '기본형' else '', ', '.join(a3),
        ' / 86' if lv == '기본형' else ' / 예) 나누는 수 × 몫 + 나머지가 나누어지는 수 86과 같으면 맞게 계산한 것이기 때문이에요')
    if lv == '도전형':
        step(s, 5, '도전하기', '트랙을 더 길게')
        s.ask('트랙 조각 20개의 길이 2500 cm는 몇 m인가요?  (        ) m', blank=False)
        s.ask('트랙 조각 30개를 이으면 125 × 30 = (          ) cm', blank=False)
        why(s, '125 × 30을 125 × 3으로 구하는 방법을 써 보세요.', lv, 1)
        ans += '   ⑥ 25 m, %d cm (125 × 3 = 375의 10배)' % (125 * 30)
    return ans


def st2(s, lv):
    s.lesson(2, '개념 구축하기(O)', '빨대 로켓 키트를 주문해요 ― (세 자리 수) × (몇십)', '136 × 20은 어떻게 계산할까요?')
    s.scene(None, '빨대 로켓 부스를 맡은 지아가 빨대를 한 봉지에 136개씩 20봉지 주문했어요.')
    step(s, 0, '만져 보기', '예상하고 확인하기')
    rule_first(s, '136 × 2를 알면 136 × 20은 어떻게 구할 수 있을까요?', lv)
    s.picture(fig('bund136', svg_bundles(136, 2, 10, '빨대')), width_mm=170)
    a1 = calc(s, [('q', '136 × 2 =', 272, ''), ('q', '136 × 20은 136 × 2의 몇 배인가요?', 10, '배'), ('q', '136 × 20 =', 2720, '')])
    s.ask('예상이 맞았나요?  ( 맞았어요 / 고쳤어요 )', blank=False)
    step(s, 1, '그려 보기', '자릿값 표에서 10배 하기')
    s.text('체험 안내 스티커를 한 묶음에 258장씩 40묶음 인쇄해요.')
    s.table([['', '만의 자리', '천의 자리', '백의 자리', '십의 자리', '일의 자리'],
             ['258 × 4', '', '', '', '', ''], ['258 × 40', '', '', '', '', '']])
    s.ask('700 × 5 = 3500이니까 700 × 50 = (            )', blank=False)
    step(s, 2, '말해 보기', '까닭 말하기')
    if lv == '기본형':
        s.fill(['(세 자리 수) × (몇십)은 (세 자리 수) × (몇)의 값을 ( 10배 / 2배 / 100배 ) 한 값과 같아요.',
                '258 × 4 = 1032일 때 258 × 40 = ( 10320 / 1032 / 103200 )이에요.',
                '왜냐하면 40은 4의 (      )배라서 258씩 40번 모은 것은 258씩 4번 모은 것을 (      )번 모은 것과 같기 때문이에요.'])
    else:
        s.fill(['(세 자리 수) × (몇십)은 (세 자리 수) × (몇)의 값을 (        ) 한 값과 같아요.',
                '258 × 4 = 1032일 때 258 × 40 = (            )이에요.'])
        why(s, '왜 그럴까요? 곱하는 수가 4에서 40으로 바뀌면 왜 곱도 10배가 될까요?', lv)
    step(s, 3, '약속하기', '세로로 계산하기')
    s.text('약속: (세 자리 수) × (몇십)은 (세 자리 수) × (몇)을 계산하고 일의 자리에 0을 써요. 자석을 한 상자에 307개씩 60상자 주문했어요.')
    s.picture(fig('lm307x60' + lv, svg_longmul(307, 60, lv == '기본형')), width_mm=95 if lv == '기본형' else 60)
    if lv == '기본형':
        s.ask('307 × 6 = (          )  →  307 × 60 = (          )', blank=False)
    step(s, 4, '확인하기')
    a5 = calc(s, [('mul', 426, 30), ('mul', 500, 70), ('mul', 815, 20),
                  ('mul', 175, 40, '고무줄이 한 봉지에 175개씩 들어 있어요. 40봉지에 든 고무줄은', '개')])
    ans = '2차시  ① 예) 136 × 2 = 272를 10배 해요 / %s   ② 1032 → 10320, 35000   ③ 10배, 10320%s   ④ %s%d   ⑤ %s' % (
        ', '.join(a1), ', 10, 10' if lv == '기본형' else ' / 예) 40은 4의 10배라서 258씩 40번 모은 것은 4번 모은 것을 10번 모은 것과 같기 때문이에요',
        '1842, ' if lv == '기본형' else '', 307 * 60, ', '.join(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '□ 찾기와 크기 견주기')
        s.ask('638 × □0 = 25520일 때 □ = (      )', blank=False)
        s.ask('512 × 70 = (          ),   468 × 80 = (          )   →   곱이 더 큰 것: (            )', blank=False)
        why(s, '□ 안의 수를 어떻게 찾았는지 써 보세요.', lv, 1)
        assert 638 * 4 * 10 == 25520
        ans += '   ⑥ 4, %d, %d, 468 × 80' % (512 * 70, 468 * 80)
    return ans


def st3(s, lv):
    s.lesson(3, '개념 구축하기(O)', '자석 클립을 세어요 ― (세 자리 수) × (몇십몇)', '248 × 16은 어떻게 계산할까요?')
    s.scene(None, '자석 체험 부스를 맡은 민재가 클립을 한 상자에 248개씩 16상자 준비했어요.')
    step(s, 0, '만져 보기', '예상하고 확인하기')
    rule_first(s, '16상자를 어떻게 나누면 계산하기 쉬울까요?', lv)
    s.choices([('클립은 모두 몇 개쯤일까요?', '( 400개쯤 / 4000개쯤 / 40000개쯤 )')])
    s.picture(fig('area248', svg_area(248, 16, '클립', '상자')), width_mm=130)
    a1 = calc(s, [('q', '248 × 10 =', 2480, ''), ('q', '248 × 6 =', 1488, ''), ('q', '248 × 16 =', 248 * 16, '')])
    step(s, 1, '그려 보기', '286 × 34 세로로 계산하기')
    s.text('둥근 자석을 한 상자에 286개씩 34상자 주문했어요. 286 × 4, 286 × 30을 차례로 쓰고 더해요.')
    s.picture(fig('lm286x34' + lv, svg_longmul(286, 34, lv == '기본형')), width_mm=110 if lv == '기본형' else 70)
    step(s, 2, '말해 보기', '까닭 말하기')
    if lv == '기본형':
        s.fill(['(세 자리 수) × (몇십몇)은 세 자리 수에 몇십몇의 ( 일의 자리 수 / 백의 자리 수 )를 곱한 값과',
                '( 십의 자리 수 / 일의 자리 수 )를 곱한 값을 ( 더해요 / 빼요 ). 둘째 줄은 실제로 286 × ( 30 / 3 )의 곱이에요.',
                '왜냐하면 34의 3은 (      )을 나타내서 286 × 30은 286 × 3의 (      )배이기 때문이에요.'])
    else:
        s.fill(['(세 자리 수) × (몇십몇)은 세 자리 수에 몇십몇의 (            )를 곱한 값과 (            )를 곱한 값을 (      ).'])
        why(s, '왜 그럴까요? 둘째 줄의 곱 8580을 쓸 때 왜 한 자리 왼쪽으로 밀어 쓸까요?', lv)
    step(s, 3, '약속하기', '어림해서 확인하기')
    s.text('지아는 탐구 노트 405권에 스티커를 26장씩 붙인다며 405 × 26을 1170이라고 계산했어요.')
    s.choices([('405 × 26은 약 얼마일까요?', '( 약 1200 / 약 12000 / 약 120000 )')])
    s.ask('실제로 계산하면 405 × 26 = (          )장', blank=False)
    if lv == '도전형':
        why(s, '지아가 어디에서 잘못했는지 써 보세요.', lv, 1)
    step(s, 4, '확인하기', '먼저 어림해 보면 잘못 계산한 것을 찾기 쉬워요')
    a5 = calc(s, [('mul', 527, 36), ('mul', 618, 45), ('mul', 904, 17),
                  ('mul', 165, 24, '체험 카드를 한 묶음에 165장씩 24묶음 만들었어요.', '장')])
    ans = '3차시  ① 예) 10상자와 6상자로 나누어 더해요 / 4000개쯤, %s   ② 1144, 8580(858), %d   ③ 일의 자리 수, 십의 자리 수, 더해요%s   ④ 약 12000, %d%s   ⑤ %s' % (
        ', '.join(a1), 286 * 34, ', 30, 30, 10' if lv == '기본형' else ' / 예) 34의 3은 30을 나타내서 286 × 30 = 8580이기 때문이에요',
        405 * 26, '' if lv == '기본형' else ' (405를 45처럼 계산했어요)', ', '.join(a5))
    if lv == '도전형':
        a, b = best_mul([2, 4, 5, 7, 9])
        step(s, 5, '도전하기', '수 카드 2, 4, 5, 7, 9')
        s.text('수 카드를 한 번씩 모두 사용하여 가장 큰 세 자리 수와 가장 작은 두 자리 수를 만들고, 두 수의 곱을 구해 보세요.')
        s.ask('가장 큰 세 자리 수 (        ), 가장 작은 두 자리 수 (      ), 곱 (            )', blank=False)
        why(s, '수 카드를 어떻게 놓았는지 까닭을 써 보세요.', lv, 1)
        ans += '   ⑥ %d, %d, %d × %d = %d' % (a, b, a, b, a * b)
    return ans


def st4(s, lv):
    s.lesson(4, '개념 구축하기(O)', '고무 찰흙을 바구니에 나누어요 ― 몇십으로 나누기', '180 ÷ 30과 293 ÷ 40은 어떻게 계산할까요?')
    s.scene(None, '탱탱볼 부스를 맡은 예린이가 고무 찰흙 180개를 한 바구니에 30개씩 담으려고 해요.')
    step(s, 0, '만져 보기', '예상하고 확인하기')
    rule_first(s, '180 ÷ 30의 몫은 어떻게 구할 수 있을까요?', lv)
    s.picture(fig('rods18', svg_rods(18, '십 모형 3개씩 묶어 보세요.')), width_mm=160)
    a1 = calc(s, [('q', '십 모형 3개씩 몇 묶음인가요?', 6, '묶음'), ('q', '180 ÷ 30 =', 6, ''), ('q', '확인: 30 × 6 =', 180, '')])
    step(s, 1, '그려 보기', '몫 어림하고 고치기')
    s.text('실험 안내 카드 293장을 한 모둠에 40장씩 묶으려고 해요. 몫을 6, 8, 7로 어림해 보세요.')
    a2 = quot_try(s, 293, 40, [6, 8, 7], lv)
    s.ask('293 ÷ 40 = (      ) … (      )  →  (      )묶음, 남는 카드 (      )장', blank=False)
    step(s, 2, '말해 보기', '까닭 말하기')
    if lv == '기본형':
        s.fill(['나머지가 나누는 수보다 크거나 같으면 몫을 1 ( 크게 / 작게 ) 해요.',
                '나누는 수 × 몫이 나누어지는 수보다 커서 뺄 수 없으면 몫을 1 ( 작게 / 크게 ) 해요.',
                '나머지는 언제나 나누는 수보다 ( 작아야 / 커야 ) 해요.'])
    else:
        s.fill(['나머지가 나누는 수보다 크거나 같으면 몫을 (        ) 해요.',
                '나누는 수 × 몫이 나누어지는 수보다 커서 뺄 수 없으면 몫을 (        ) 해요.'])
        why(s, '왜 그럴까요? 나머지가 나누는 수보다 크면 왜 몫을 1 크게 해야 할까요?', lv)
    step(s, 3, '약속하기', '세로로 계산하기')
    s.text('물감 458 mL를 70 mL씩 통에 나누어 담아요. 458 ÷ 70을 세로로 계산해 보세요.')
    s.picture(fig('ld458_70', svg_longdiv(458, 70)), width_mm=55)
    s.ask('확인: 70 × (    ) = (        ),  (        ) + (      ) = 458', blank=False)
    step(s, 4, '확인하기')
    a5 = calc(s, [('div', 87, 20), ('div', 350, 50), ('div', 513, 60),
                  ('div', 245, 30, '자석 245개를 한 상자에 30개씩 담으면', ['상자', '남는 자석'], ['상자', '개'])])
    q, r = dv(458, 70)
    ans = '4차시  ① 예) 180 ÷ 30은 18 ÷ 3과 몫이 같아요 / %s   ② %s / %s, 7묶음, 13장   ③ 크게, 작게%s   ④ %d … %d (70 × %d = %d, %d + %d = 458)   ⑤ %s' % (
        ', '.join(a1), ' / '.join(a2), ds(293, 40), ', 작아야' if lv == '기본형' else ' / 예) 나머지에서 나누는 수를 한 번 더 빼서 묶음을 하나 더 만들 수 있기 때문이에요',
        q, r, q, 70 * q, 70 * q, r, ', '.join(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '민재의 계산 살펴보기')
        s.text('민재가 227 ÷ 40을 계산했어요. “40 × 4 = 160, 160 + 67 = 227이니 227 ÷ 40 = 4 … 67이 맞아요.”')
        s.choices([('잘못 계산한 까닭은?', '( 40 × 4를 잘못 계산했어요 /\n나머지 67이 나누는 수 40보다 커요 /\n227에서 160을 잘못 뺐어요 )')])
        s.ask('옳게 계산하면 227 ÷ 40 = (      ) … (      )', blank=False)
        why(s, '확인한 식이 맞아 보이는데 왜 틀렸는지 써 보세요.', lv, 1)
        ans += '   ⑥ 나머지 67이 나누는 수 40보다 커요, %s' % ds(227, 40)
    return ans


def st5(s, lv):
    s.lesson(5, '개념 구축하기(O)', '과학 마술 모둠을 나누어요 ― 몫이 한 자리 수인 나눗셈', '92 ÷ 23과 213 ÷ 47은 어떻게 계산할까요?')
    s.scene(None, '과학 마술 체험에 92명이 참가해요. 23모둠으로 똑같이 나누면 한 모둠은 몇 명일까요?')
    step(s, 0, '만져 보기', '예상하고 확인하기')
    rule_first(s, '92 ÷ 23의 몫을 어떻게 어림하면 좋을까요?', lv)
    a1 = quot_try(s, 92, 23, [3, 5, 4], lv)
    s.ask('92 ÷ 23 = (      )  →  한 모둠은 (      )명', blank=False)
    step(s, 1, '그려 보기', '곱셈표로 몫 어림하기')
    s.text('실험 관찰 기록지 213장을 47장씩 묶어 모둠에 나누어 주려고 해요.')
    a2 = mul_table(s, 213, 47, [3, 4, 5])
    s.ask('213 ÷ 47 = (      ) … (      )  →  (      )묶음, 남는 기록지 (      )장', blank=False)
    step(s, 2, '말해 보기', '까닭 말하기')
    if lv == '기본형':
        s.fill(['213 ÷ 47에서 47 × 4 = 188이므로 몫은 ( 4 / 5 / 2 )예요.',
                '나머지를 구하는 식은 ( 213 − 188 / 213 − 47 / 235 − 213 )이에요.',
                '왜냐하면 47 × 5 = 235는 213보다 ( 커서 / 작아서 ) 213에서 뺄 수 없기 때문이에요.'])
    else:
        s.fill(['213 ÷ 47에서 47 × 4 = 188이므로 몫은 (    )이고, 나머지를 구하는 식은 (              )이에요.'])
        why(s, '왜 그럴까요? 47 × 5 = 235를 몫으로 쓰지 않은 까닭은 무엇일까요?', lv)
    step(s, 3, '약속하기', '세로로 계산하기')
    s.text('탐구 쪽지 347장을 58장씩 묶어요. 347 ÷ 58을 세로로 계산해 보세요.')
    s.picture(fig('ld347_58', svg_longdiv(347, 58)), width_mm=55)
    s.ask('확인: 58 × (    ) = (        ),  (        ) + (      ) = 347', blank=False)
    step(s, 4, '확인하기')
    a5 = calc(s, [('div', 78, 26), ('div', 95, 32), ('div', 432, 54),
                  ('div', 200, 24, '건전지 200개를 한 상자에 24개씩 담으면', ['상자', '남는 건전지'], ['상자', '개'])])
    q, r = dv(347, 58)
    ans = '5차시  ① 예) 92를 90, 23을 20으로 어림하면 4쯤 / %s, 4, 4명   ② %s, %s, 4묶음, 25장   ③ 4, 213 − 188%s   ④ %d … %d (58 × %d = %d, %d + %d = 347)   ⑤ %s' % (
        ' / '.join(a1), a2, ds(213, 47), ', 커서' if lv == '기본형' else ' / 예) 235는 213보다 커서 뺄 수 없기 때문이에요',
        q, r, q, 58 * q, 58 * q, r, ', '.join(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '거꾸로 생각하기')
        s.ask('□ ÷ 36 = 6 … 25일 때 □ = (          )', blank=False)
        s.ask('길이가 112 m인 축제 길의 처음부터 끝까지 깃발 15개를 같은 간격으로 세우면 간격은 몇 m인가요?  (      ) m', blank=False)
        why(s, '깃발 사이의 간격 수를 어떻게 구했는지 써 보세요.', lv, 1)
        assert 112 % 14 == 0
        ans += '   ⑥ %d, %d m (간격은 15 − 1 = 14군데)' % (36 * 6 + 25, 112 // 14)
    return ans


def st6(s, lv):
    s.lesson(6, '개념 구축하기(O)', '비눗방울 용액을 나누어요 ― 몫이 두 자리 수이고 나누어떨어지는 나눗셈', '864 ÷ 36은 어떻게 계산할까요?')
    s.scene(None, '비눗방울 부스를 맡은 서윤이가 비눗방울 용액 864 mL를 컵에 36 mL씩 나누어 담으려고 해요.')
    step(s, 0, '만져 보기', '예상하고 확인하기')
    rule_first(s, '864 ÷ 36의 몫은 한 자리 수일까요, 두 자리 수일까요?', lv)
    s.choices([('용액을 담은 컵은 몇십 개쯤 될까요?', '( 2개쯤 / 20개쯤 / 200개쯤 )')])
    s.picture(fig('jump864', svg_jump(864, 36, 'mL')), width_mm=170)
    a1 = calc(s, [('q', '36 × 20 =', 720, ''), ('q', '864 − 720 =', 144, ''), ('q', '36 × 4 =', 144, ''),
                  ('q', '864 ÷ 36 =   → 컵은 몇 개인가요?', 24, '개')])
    step(s, 1, '그려 보기', '864 ÷ 36 세로로 계산하기')
    s.text('몫의 십의 자리부터 구해요.')
    s.picture(fig('ld864_36', svg_longdiv(864, 36)), width_mm=55)
    s.ask('확인: 36 × (      ) = (          )', blank=False)
    step(s, 2, '말해 보기', '까닭 말하기')
    if lv == '기본형':
        s.fill(['몫이 두 자리 수인 나눗셈은 몫을 ( 십의 자리와 일의 자리 / 백의 자리와 십의 자리 )로 나누어 구해요.',
                '864 ÷ 36에서 먼저 36 × ( 20 / 2 / 30 ) = 720을 빼고, 남은 144에서 36 × 4 = 144를 빼요. 그래서 몫은 ( 24 / 42 / 204 )예요.',
                '왜냐하면 36 × 30 = (          )은 864보다 커서 뺄 수 없기 때문이에요.'])
    else:
        s.fill(['864 ÷ 36에서 먼저 36 × (      ) = 720을 빼고, 남은 (      )에서 36 × (    ) = 144를 빼요. 그래서 몫은 (      )예요.'])
        why(s, '왜 그럴까요? 864에서 36 × 20을 먼저 빼는 까닭은 무엇일까요?', lv)
    step(s, 3, '약속하기', '곱셈표로 몫 어림하기')
    s.text('축제 홍보 전단 992장을 31장씩 묶어요.')
    a4 = mul_table(s, 992, 31, [20, 30, 40])
    s.ask('992 − 930 = (      ),  31 × (    ) = 62  →  992 ÷ 31 = (      )', blank=False)
    step(s, 4, '확인하기', '계산하고 맞는지 확인하기')
    a5 = calc(s, [('div', 598, 26), ('div', 714, 17), ('div', 975, 39, '', None, None, True)])
    ans = '6차시  ① 예) 36 × 10 = 360이 864보다 작아 두 자리 수 / 20개쯤, %s   ② 24 (72 → 144 → 144 → 0), 36 × 24 = 864   ③ %s   ④ %s, 62, 2, %s   ⑤ %s' % (
        ', '.join(a1), '십의 자리와 일의 자리, 20, 24, 1080' if lv == '기본형' else '20, 144, 4, 24 / 예) 36 × 30 = 1080은 864보다 커서 뺄 수 있는 가장 큰 몇십 번은 20번이기 때문이에요',
        a4, ds(992, 31), ', '.join(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '거꾸로 생각하고 나누기')
        s.ask('□ ÷ 24 = 31일 때 □ = (          )', blank=False)
        s.ask('물 로켓 부품 816개를 한 세트에 34개씩 담으면 몇 세트인가요?  (        )세트', blank=False)
        why(s, '□를 어떻게 구했는지 써 보세요.', lv, 1)
        assert 816 % 34 == 0
        ans += '   ⑥ %d, %d세트' % (24 * 31, 816 // 34)
    return ans


def st7(s, lv):
    s.lesson(7, '개념 구축하기(O)', '안내 스티커를 나누어요 ― 몫이 두 자리 수이고 나머지가 있는 나눗셈', '830 ÷ 38은 어떻게 계산할까요?')
    s.scene(None, '위원장 하준이가 부스 안내 스티커 830장을 한 모둠에 38장씩 나누어 주려고 해요.')
    step(s, 0, '만져 보기', '뛰어 세며 까닭 말하기')
    s.choices([('몇 모둠쯤에 줄 수 있을까요?', '( 2모둠쯤 / 20모둠쯤 / 200모둠쯤 )')])
    s.picture(fig('jump830', svg_jump(830, 38, '장')), width_mm=170)
    s.ask('38 × 20 = (        ),  830 − 760 = (      ),  70 − 38 = (      )', blank=False)
    s.ask('(      )모둠에 주고 스티커 (      )장이 남아요.', blank=False)
    if lv == '기본형':
        s.fill('왜냐하면 남은 32장은 한 모둠에 줄 (      )장보다 적기 때문이에요.')
    else:
        why(s, '왜 그럴까요? 남은 32장으로는 왜 한 모둠에 더 줄 수 없을까요?', lv, 1)
    step(s, 1, '그려 보기', '830 ÷ 38 세로로 계산하기')
    s.picture(fig('ld830_38', svg_longdiv(830, 38)), width_mm=55)
    s.ask('확인: 38 × (      ) = (        ),  (        ) + (    ) = 830', blank=False)
    step(s, 2, '말해 보기', '까닭 말하기')
    if lv == '기본형':
        s.fill(['830 ÷ 38의 몫은 ( 21 / 20 / 22 ), 나머지는 32예요. 나머지는 나누는 수보다 ( 작아야 / 커야 ) 해요.',
                '몫을 22로 하지 않은 까닭: 38 × 22 = (        )은 830보다 커서 뺄 수 없기 때문이에요.'])
    else:
        s.fill(['830 ÷ 38의 몫은 (      ), 나머지는 (      )예요.'])
        why(s, '왜 그럴까요? 몫을 22로 하지 않은 까닭은 무엇일까요?', lv)
    step(s, 3, '약속하기', '곱셈표로 몫 어림하기')
    s.text('탐구 보고서 표지 671장을 29장씩 묶어요.')
    a4 = mul_table(s, 671, 29, [10, 20, 30])
    s.ask('671 − 580 = (      ),  29 × (    ) = 87  →  671 ÷ 29 = (      ) … (      )', blank=False)
    step(s, 4, '확인하기')
    a5 = calc(s, [('div', 485, 21), ('div', 763, 45), ('div', 600, 27),
                  ('div', 925, 42, '종이컵 925개를 한 탑에 42개씩 쌓으면', ['탑', '남는 종이컵'], ['개', '개'])])
    ans = '7차시  ① 20모둠쯤, 760, 70, 32 / 21모둠, 32장%s   ② 21 … 32 (76 → 70 → 38 → 32), 38 × 21 = 798, 798 + 32 = 830   ③ %s   ④ %s, 91, 3, %s   ⑤ %s' % (
        ', 38' if lv == '기본형' else ' / 예) 32장은 한 모둠에 줄 38장보다 적기 때문이에요',
        '21, 작아야, %d' % (38 * 22) if lv == '기본형' else '21, 32 / 예) 38 × 22 = 836은 830보다 커서 뺄 수 없기 때문이에요',
        a4, ds(671, 29), ', '.join(a5))
    if lv == '도전형':
        a, b = best_div([1, 4, 5, 7, 9])
        step(s, 5, '도전하기', '수 카드 1, 4, 5, 7, 9')
        s.text('수 카드를 한 번씩 모두 사용하여 몫이 가장 큰 (세 자리 수) ÷ (두 자리 수)를 만들고 계산해 보세요.')
        s.ask('(        ) ÷ (      ) = (      ) … (      )', blank=False)
        why(s, '나누어지는 수와 나누는 수를 어떻게 만들었는지 써 보세요.', lv, 1)
        ans += '   ⑥ %d ÷ %d = %s' % (a, b, ds(a, b))
    return ans


def st8(s, lv):
    s.lesson(8, '개념 구축하기(O)', '축제 예산을 어림해요 ― 어림셈', '준비물 값이나 줄 수를 어떻게 하면 빠르게 어림할 수 있을까요?')
    s.scene(None, '예산을 맡은 지아가 한 개에 680원인 돋보기를 32개 사려고 해요.')
    step(s, 0, '만져 보기', '곱셈 어림하기')
    s.picture(fig('r680', svg_round(680, 600, 700, 10, '돋보기 한 개의 값 680원')), width_mm=120)
    s.picture(fig('r32', svg_round(32, 30, 40, 1, '돋보기의 수 32개')), width_mm=120)
    s.ask('680은 (      )으로, 32는 (      )으로 어림해요.  어림한 식 700 × 30 = (          )원 정도', blank=False)
    if lv == '기본형':
        s.fill('680은 600과 (      )만큼, 700과 (      )만큼 차이가 나서 700에 더 가까워요.')
    else:
        why(s, '왜 그럴까요? 680을 600이 아니라 700으로 어림한 까닭은 무엇일까요?', lv, 1)
    step(s, 1, '그려 보기', '풍선 310원 × 47봉지')
    s.ask('310은 (      )에, 47은 (      )에 더 가까워요.', blank=False)
    s.ask('어림한 식 (      ) × (      ) = (          )원 정도', blank=False)
    step(s, 2, '말해 보기', '나눗셈 어림하기')
    s.text('관람석 방석 430개를 한 줄에 40개씩 놓으면 몇 줄쯤 될까요? 430 가까이에서 40으로 나누기 쉬운 수를 찾아요.')
    s.ask('40씩 뛰어 세기: 360, (      ), (      ), 480', blank=False)
    s.ask('서윤: (      ) ÷ 40 = (    )줄쯤      도윤: (      ) ÷ 40 = (    )줄쯤', blank=False)
    step(s, 3, '약속하기', '어림한 방법 견주기')
    s.choices([('서윤이는 430을 400으로 어림했어요.', '( 실제 수보다 작게 / 크게 )'),
               ('도윤이는 430을 440으로 어림했어요.', '( 실제 수보다 작게 / 크게 )'),
               ('어림셈에 대해 바른 말은?', '( 어림한 답은 하나뿐이에요 /\n방법에 따라 답이 다를 수 있어요 )')])
    if lv == '도전형':
        why(s, '왜 그럴까요? 서윤이(10줄쯤)와 도윤이(11줄쯤)의 어림이 둘 다 알맞은 까닭은 무엇일까요?', lv, 1)
    step(s, 4, '확인하기', '과자 170개를 20모둠에')
    if lv == '기본형':
        s.text('20으로 나누기 쉬운 수: 160, 180')
    s.ask('170을 (      )으로 어림하면 (      ) ÷ 20 = (    )  →  한 모둠에 (    )개쯤', blank=False)
    assert 400 // 40 == 10 and 440 // 40 == 11 and 160 // 20 == 8 and 180 // 20 == 9
    ans = '8차시  ① 700, 30, 21000%s   ② 300, 50 / 300 × 50 = 15000   ③ 400, 440 / 400 ÷ 40 = 10, 440 ÷ 40 = 11   ④ 작게, 크게, 방법에 따라 답이 다를 수 있어요%s   ⑤ 160 ÷ 20 = 8 → 8개쯤 (또는 180 ÷ 20 = 9 → 9개쯤)' % (
        ' / 80, 20' if lv == '기본형' else ' / 예) 680은 700에 더 가깝기 때문이에요',
        '' if lv == '기본형' else ' / 예) 둘 다 430에 가까우면서 40으로 나누기 쉬운 수로 바꾸었기 때문이에요')
    if lv == '도전형':
        step(s, 5, '도전하기', '예산 25000원')
        s.ask('실제 값 680 × 32 = (          )원', blank=False)
        s.ask('25000원에서 남는 돈은? (          )원', blank=False)
        why(s, '어림한 값 21000원과 실제 값을 견주어 알게 된 점을 써 보세요.', lv, 1)
        ans += '   ⑥ %d원, %d원' % (680 * 32, 25000 - 680 * 32)
    return ans


def st9(s, lv):
    s.lesson(9, '탐구 정리하기(O)', '생각을 더하다 ― 체험 부스 재료비를 비교해요', '재료비를 아끼려면 어떤 체험 부스를 열어야 할까요?')
    s.scene(None, ['위원회는 탱탱볼 부스와 비눗방울 부스 중 하나를 더 열려고 해요. 체험할 사람은 32명이에요.',
                   '1인분 재료비: 탱탱볼 부스 고무 가루 245원·색소 60원·종이컵 40원 / 비눗방울 부스 세제 150원·물엿 145원·종이컵 40원'])
    step(s, 0, '이해해요')
    s.choices([('무엇을 견주어야 할까요?', '( 1인분 재료비 / 이름의 길이 / 바구니 색깔 )'),
               ('비눗방울 부스의 재료는?', '( 세제, 물엿, 종이컵 /\n고무 가루, 색소, 종이컵 )'),
               ('체험할 사람은 몇 명인가요?', '( 23명 / 32명 / 40명 )')])
    step(s, 1, '계획하고 해결해요', '1인분 재료비 비교하기')
    s.table([['부스', '재료비(원)', '1인분 합(원)'],
             ['탱탱볼 부스', '245 + 60 + 40', '(          )'],
             ['비눗방울 부스', '150 + 145 + 40', '(          )']], col_mm=[55, 75, 50])
    s.ask('재료비가 더 적게 드는 부스: (                    )', blank=False)
    step(s, 2, '32명 재료비 구하기', '335 × 32 (원)')
    s.picture(fig('lm335x32' + lv, svg_longmul(335, 32, lv == '기본형')), width_mm=110 if lv == '기본형' else 70)
    step(s, 3, '되돌아봐요')
    if lv == '기본형':
        s.labeled([('방법', '먼저 1인분 재료비를 ________ 비교하고, 그다음 335에 ______ 를 곱했어요.'),
                   ('아이디어', '______ 대신 ______ 을 쓰면 1인분에 ____원, 32명이면 ______원을 아낄 수 있어요.')])
    else:
        s.ask('어떤 차례로 해결했는지 설명해 보세요.', blank=False)
        s.lines(1)
        s.ask('재료비를 더 아낄 수 있는 방법을 써 보세요.', blank=False)
        s.lines(1)
    step(s, 4, '내 힘으로 풀어요', '40명이 체험할 부스')
    s.table([['부스', '재료비(원)', '1인분 합(원)'],
             ['자석 팽이 부스', '280 + 95', '(          )'],
             ['빨대 로켓 부스', '190 + 135', '(          )']], col_mm=[55, 75, 50])
    s.ask('열어야 할 부스 (                  ),  40명: 325 × 40 = (          )원', blank=False)
    assert 245 + 60 + 40 == 345 and 150 + 145 + 40 == 335
    ans = '9차시  ① 1인분 재료비, 세제·물엿·종이컵, 32명   ② 345, 335 / 비눗방울 부스   ③ 670, 10050(1005), %d원   ④ %s   ⑤ 375, 325 / 빨대 로켓 부스, %d원' % (
        335 * 32, '더해, 32 / 예) 종이컵 대신 다회용 컵, 40원, 1280원' if lv == '기본형' else '예) 1인분 재료비를 더해 비교하고 335에 32를 곱했어요 / 다회용 컵을 쓰면 40 × 32 = 1280원을 아껴요',
        325 * 40)
    if lv == '도전형':
        step(s, 5, '도전하기', '얼마나 더 들었을까요?')
        s.text('만약 탱탱볼 부스(1인분 345원)를 32명이 체험했다면 재료비가 얼마나 더 들었을까요?')
        s.ask('345 × 32 = (          )원,   (          ) − 10720 = (        )원', blank=False)
        why(s, '더 간단하게 구하는 방법을 써 보세요.', lv, 1)
        ans += '   ⑥ %d원, %d원 (예: (345 − 335) × 32 = 10 × 32 = 320)' % (345 * 32, 345 * 32 - 335 * 32)
    return ans


def st10(s, lv):
    s.lesson(10, '발표하기(P)', '놀이를 더하다 ― 과학 축제 부스 탐험 놀이', '곱셈과 나눗셈을 옳게 계산하며 축제 부스를 탐험해 볼까요?')
    s.scene(None, '축제가 끝나고 위원회 친구들이 교실에서 ‘부스 탐험 놀이’를 해요.')
    step(s, 0, '놀이 방법 알기', '차례대로 번호 쓰기')
    order = order_rules(s, RULES, SHOW)
    step(s, 1, '놀이판 살펴보기', '첫 칸 240 ÷ 30에 멈추었어요')
    a2 = calc(s, [('div', 240, 30, '', None, None, True)])
    step(s, 2, '놀이하기', '부스 탐험 놀이판')
    board_table(s, ST_BOARD)
    s.table([['멈춘 칸의 식', '내 답', '친구 확인(○/×)']] + [['', '', '']] * 4, col_mm=[70, 70, 40])
    step(s, 3, '규칙 지키기')
    s.choices([('말이 이동한 칸에 상대방의 말이 있으면?', '( 주사위를 한 번 더 굴려 이동 /\n상대방 말을 출발 칸으로 / 한 번 쉬기 )'),
               ('칸의 식을 잘못 계산하면?', '( 전에 있던 칸으로 / 그대로 / 도착 칸으로 )'),
               ('놀이할 때 알맞은 태도는?', '( 계산기로 확인해요 / 이기는 것만 생각해요 /\n친구가 틀리면 놀려요 )')])
    step(s, 4, '발표하기')
    if lv == '기본형':
        s.labeled([('방법', '나눗셈은 먼저 ________ 하고 ____________ 인지 확인했어요.\n곱셈은 곱하는 수를 ______ 과 ____ 로 나누어 계산했어요.'),
                   ('배려', '친구가 ________ 할 때 ________ 하고, 틀렸을 때 ____________ 라고 말했어요.')], row_h=5669)
    else:
        s.ask('놀이에서 계산을 옳게 하려고 어떤 방법을 썼나요?', blank=False)
        s.lines(1)
        s.ask('친구와 놀이할 때 배려한 점은 무엇인가요?', blank=False)
        s.lines(1)
    ans = '10차시  ① 위에서부터 %s   ② %s   ③ (놀이 기록)   ④ 한 번 더 굴려 이동, 전에 있던 칸으로, 계산기로 확인해요   ⑤ %s' % (
        order, a2[0], '예) 몫을 어림, 나머지가 나누는 수보다 작은지 / 몇십, 몇 / (자유)' if lv == '기본형' else '(자유) 예: 몫을 어림하고 나머지가 나누는 수보다 작은지 확인했어요')
    if lv == '도전형':
        step(s, 5, '도전하기', '어려웠던 식')
        a6 = calc(s, [('mul', 609, 32), ('div', 880, 24), ('div', 87, 25, '', None, None, True)])
        why(s, '놀이판에서 가장 어려웠던 식과 그 까닭을 써 보세요.', lv, 1)
        ans += '   ⑥ %s' % ', '.join(a6)
    return ans


def st11(s, lv):
    s.lesson(11, '발표하기(P)', '축제 부스 운영 계획을 발표해요', '과학 축제 부스를 운영할 때 곱셈과 나눗셈을 어떻게 쓸까요?')
    s.scene(None, '우리 반은 다음 축제에서 비눗방울 부스를 운영해요.')
    step(s, 0, '만져 보기', '운영 계획 계산하기')
    s.ask('1차시에 궁금했던 것: ____________________________________________', blank=False)
    a1 = calc(s, [('div', 312, 24, '신청한 312명이 한 회에 24명씩 체험하면', ['체험 횟수', '남는 사람'], ['회', '명']),
                  ('mul', 335, 24, '한 회(24명)의 재료비는', '원'),
                  ('div', 850, 35, '남은 용액 850 mL를 35 mL씩 컵에 담으면', ['컵', '남는 용액'], ['개', ' mL'])])
    step(s, 1, '그려 보기', '잘못 계산한 곳 찾기')
    s.text('도윤이의 계산: 53 × 6 = 318, 412 − 318 = 94 → 412 ÷ 53 = 6 … 94')
    s.choices([('잘못 계산한 까닭은?', '( 나머지 94가 나누는 수 53보다 커요 /\n53 × 6을 잘못 계산했어요 /\n몫을 1 작게 해야 해요 )')])
    s.ask('옳게 계산하면 412 ÷ 53 = (      ) … (      )', blank=False)
    step(s, 2, '말해 보기', '몫의 크기 비교하기')
    s.choices([('720 ÷ 80 ○ 355 ÷ 41', '( > / = / < )'), ('545 ÷ 60의 몫과 나머지는?', '( 9 … 5 / 8 … 65 / 9 … 50 )')])
    step(s, 3, '약속하기', '부스 운영 계획 발표하기')
    if lv == '기본형':
        s.labeled([('부스', '우리 부스는 ________ 예요. ____명이 한 회에 ____명씩 ____회 동안 체험해요.'),
                   ('계산', '__________ = ____ 으로 ________ 을 구했어요.'),
                   ('확인', '나눗셈은 ____ × ____ = ____ 으로 확인했어요.')])
    else:
        for q in ['우리 부스 이름과 하는 일', '계획에 쓴 곱셈이나 나눗셈과 그 까닭', '계산이 맞는지 확인한 방법']:
            s.ask(q, blank=False)
            s.lines(1)
    step(s, 4, '확인하기', '예전 생각, 지금 생각')
    if lv == '기본형':
        s.labeled([('예전 생각', '예전에는 ______________________________ 라고 생각했어요.'),
                   ('지금 생각', '지금은 ______________________________ 라고 생각해요.'),
                   ('왜 바뀌었나', '______________________________ 을 해 보고 바뀌었어요.')])
    else:
        for q in ['예전 생각', '지금 생각', '왜 바뀌었나']:
            s.ask(q + ':', blank=False)
            s.lines(1)
    assert 720 // 80 > 355 // 41 and ds(545, 60) == '9 … 5'
    ans = '11차시  ① (자유) / %s   ② 나머지 94가 나누는 수 53보다 커요, %s   ③ >, 9 … 5   ④ 예) 비눗방울 부스, 312명이 24명씩 13회 / 312 ÷ 24 = 13, 335 × 24 = 8040 / 24 × 13 = 312   ⑤ (자유)' % (
        ', '.join(a1), ds(412, 53))
    if lv == '도전형':
        step(s, 5, '도전하기', '마인드맵과 사다리 계산')
        s.labeled([('떠오르는 말', ''), ('묶어 보기', '곱셈: \n나눗셈: '), ('이어지는 말', '')])
        a6 = calc(s, [('mul', 326, 57), ('div', 84, 21), ('div', 803, 46), ('div', 630, 70)])
        ans += '   ⑥ (마인드맵 자유) %s' % ', '.join(a6)
    return ans


TB = [tb1, tb2, tb3, tb4, tb5, tb6, tb7, tb8, tb9, tb10, tb11]
ST = [st1, st2, st3, st4, st5, st6, st7, st8, st9, st10, st11]


# ================================================================ 도전형 (①~⑤를 기본형과 다른 문제로, ⑥ 도전하기는 그대로)
TB_BOARD_H = ["270÷30", "146×25", "92÷23", "480÷60", "97÷16", "328×27", "544÷34", "530÷70", "407×38", "84÷14", "651÷21",
              "735×16", "83÷27", "896÷64", "362×50", "710÷90", "917÷28", "689×43", "874÷38", "75÷25", "609×45", "814÷37"]
ST_BOARD_H = ["320÷40", "157×36", "88÷22", "540÷90", "79÷24", "246×38", "612÷36", "460÷50", "273×45", "95÷19", "744÷24",
              "418×27", "86÷29", "975÷65", "250×64", "630÷70", "823÷37", "556×19", "791÷26", "72÷24", "708×43", "925÷18"]
SHOW_H = [3, 1, 4, 0, 2]
BAD_RULES = ('① 가위바위보로 순서를 정하고 말을 도착 칸에 놓아요.  ② 주사위를 굴려 나온 눈의 수의 두 배만큼 말을 옮겨요.  '
             '③ 칸의 식을 계산하고, 상대방이 계산기로 확인해요.  ④ 잘못 계산하면 말을 출발 칸으로 돌려놓아요.  '
             '⑤ 도착 칸에 먼저 도착하는 사람이 이겨요.')
BAD_FIX = '①(출발 칸에 놓아요), ②(나온 눈의 수만큼 옮겨요), ④(전에 있던 칸으로 돌려놓아요)'
RULE_Q = [('계산이 맞는지는 누가 확인하나요?', '( 상대방이 계산기로 / 나 혼자 / 아무도 안 해요 )'),
          ('누가 먼저 시작하나요?', '( 가위바위보로 정해요 / 나이가 많은 사람이 해요 )'),
          ('놀이에서 이기는 사람은?', '( 도착 칸에 먼저 도착한 사람 /\n계산을 더 많이 한 사람 )')]


def h_tb1(s, lv):
    s.lesson(1, '개념 찾기(S)', '단원 도입 ― 가정의 달 축제에서 자원봉사를 해요',
             '우리 주변에서 곱셈과 나눗셈은 언제 쓰일까요?')
    s.scene(None, '선우네 가족은 가정의 달 축제에서 자원봉사를 하고 있어요. 입장 팔찌, 블록, 엽서, 카네이션, 빵, 기념품까지 준비할 것이 많아요.')
    step(s, 0, '만져 보기', '개구리 멀리뛰기 상상하기')
    s.text('몸길이가 132 mm인 개구리가 몸길이의 30배만큼 멀리 뛰었다고 생각해 보세요.')
    s.ask('132 × 3 = (          ) mm', blank=False)
    s.ask('132 × 30 = (          ) mm', blank=False)
    s.ask('132 × 30은 132 × 3의 몇 배인가요?')
    step(s, 1, '그려 보기', '곱셈과 나눗셈 중 알맞은 셈 고르기')
    s.choices([('카네이션을 한 다발에 12송이씩 145다발 만들 때 카네이션 수를 구하는 셈은?', '( 곱셈 / 나눗셈 )'),
               ('빵 384개를 한 상자에 32개씩 담을 때 필요한 상자 수를 구하는 셈은?', '( 곱셈 / 나눗셈 )'),
               ('기념품 600개를 25명이 똑같이 나누어 가질 때 한 사람이 받는 수를 구하는 셈은?', '( 곱셈 / 나눗셈 )')])
    step(s, 2, '말해 보기', '보기 - 생각하기 - 궁금해하기를 내 말로 쓰기')
    for q in ['보기: 축제 그림에서 어떤 상황이 보이나요?', '생각하기: 3학년 때 배운 곱셈·나눗셈과 어떤 점이 다를 것 같나요?',
              '궁금해하기: 무엇이 궁금한가요?']:
        s.ask(q, blank=False)
        s.lines(1)
    step(s, 3, '배운 내용 떠올리기', '3학년 2학기 곱셈과 나눗셈 (받아올림·나머지)')
    a4 = calc(s, [('mul', 307, 6), ('mul', 48, 35), ('div', 94, 6, '', None, None, True), ('div', 615, 4)])
    step(s, 4, '확인하기', '상황에 알맞은 식 고르기')
    s.choices([('기념품을 한 상자에 250개씩 넣었더니 32상자가 되었어요. 기념품 수를 구하는 식은?', '( 250 × 32 / 250 ÷ 32 / 250 + 32 )'),
               ('빵 528개를 24개씩 봉지에 담을 때 필요한 봉지 수를 구하는 식은?', '( 528 × 24 / 528 ÷ 24 / 528 − 24 )')])
    ans = '1차시  ① %d mm, %d mm, 10배   ② 곱셈, 나눗셈, 나눗셈   ③ (자유)   ④ %s   ⑤ 250 × 32, 528 ÷ 24' % (
        132 * 3, 132 * 30, ', '.join(a4))
    step(s, 5, '도전하기', '메뚜기가 뛴 거리')
    s.ask('몸길이 115 mm인 메뚜기가 몸길이의 20배만큼 뛰었어요. 뛴 거리는 몇 mm인가요?  (          ) mm', blank=False)
    s.ask('뛴 거리는 몇 cm인가요?  (          ) cm', blank=False)
    why(s, '왜 그렇게 바꾸었는지 까닭을 써 보세요.', lv, 1)
    ans += '   ⑥ 2300 mm, %d cm (예: 10 mm = 1 cm이므로 2300 mm는 230 cm예요)' % (115 * 20 // 10)
    return ans


def h_tb2(s, lv):
    s.lesson(2, '개념 구축하기(O)', '세 자리 수에 몇십을 곱해 볼까요', '123 × 20은 어떻게 계산할까요?')
    s.scene(None, '선우는 입장 팔찌를 한 묶음에 123개씩 20묶음 정리했어요.')
    step(s, 0, '만져 보기', '다른 상자의 입장 팔찌 세어 보기')
    s.text('다른 상자에는 입장 팔찌가 한 묶음에 214개씩 30묶음 있어요.')
    s.picture(fig('bund214', svg_bundles(214, 3, 10, '입장 팔찌')), width_mm=170)
    a1 = calc(s, [('q', '214 × 3 =', 214 * 3, ''), ('q', '214 × 30은 214 × 3의 몇 배인가요?', 10, '배'),
                  ('q', '214 × 30 =', 214 * 30, ''), ('q', '이 상자의 입장 팔찌는 모두 몇 개인가요?', 214 * 30, '개')])
    step(s, 1, '그려 보기', '839 × 6과 839 × 60 견주기')
    s.text('839 × 6과 839 × 60의 곱을 자릿값 표에 써 보세요.')
    s.table([['', '만의 자리', '천의 자리', '백의 자리', '십의 자리', '일의 자리'],
             ['839 × 6', '', '', '', '', ''], ['839 × 60', '', '', '', '', '']])
    s.ask('800 × 7 = 5600이니까 800 × 70 = (            )', blank=False)
    step(s, 2, '말해 보기', '말로 정리하고 까닭 쓰기')
    s.fill(['(세 자리 수) × (몇십)은 (세 자리 수) × (몇)의 값을 (          ) 한 값과 같아요.',
            '839 × 6 = 5034이면 839 × 60 = (            )이에요.'])
    why(s, '839 × 60이 839 × 6의 10배인 까닭을 써 보세요.', lv)
    step(s, 3, '약속하기', '605 × 70 세로로 계산하기')
    s.text('605 × 70을 세로로 계산해 보세요. 605 × 7을 계산하고 일의 자리에 0을 써요.')
    s.picture(fig('lm605x70', svg_longmul(605, 70)), width_mm=60)
    step(s, 4, '확인하기', '0이 있는 곱셈과 문장제')
    a5 = calc(s, [('mul', 857, 40), ('mul', 600, 50), ('mul', 409, 80),
                  ('mul', 375, 60, '하루에 375 km씩 나는 철새가 60일 동안 난 거리', ' km')])
    assert 839 * 6 == 5034
    ans = '2차시  ① %s   ② 5034 → 50340 (숫자가 한 자리씩 왼쪽으로), %d   ③ 10배, %d   ④ %d   ⑤ %s' % (
        ', '.join(a1), 800 * 70, 839 * 60, 605 * 70, ', '.join(a5))
    step(s, 5, '도전하기', '문제 만들기와 □ 찾기')
    s.text('‘한 개에 950원인 지우개가 있습니다.’ 뒤에 950 × 80에 알맞은 문제를 이어 쓰고 풀어 보세요.')
    s.lines(1)
    s.ask('식: 950 × 80 = (            )원', blank=False)
    s.ask('847 × □0 = 50820일 때 □ 안의 수는?  (      )', blank=False)
    why(s, '□ 안의 수를 어떻게 찾았는지 써 보세요.', lv, 1)
    sq = 50820 // 10 // 847
    assert 847 * sq * 10 == 50820
    ans += '   ⑥ 예) 이 지우개를 80개 산다면 얼마를 내야 할까요? %d원 / %d (847 × %d = %d)' % (950 * 80, sq, sq, 847 * sq)
    return ans


def h_tb3(s, lv):
    s.lesson(3, '개념 구축하기(O)', '세 자리 수에 몇십몇을 곱해 볼까요', '213 × 18은 어떻게 계산할까요?')
    s.scene(None, '서현이가 블록 만들기 체험장에 블록을 한 상자에 213개씩 18상자 옮겼어요.')
    step(s, 0, '만져 보기', '다른 블록 상자를 어림하고 두 묶음으로 나누어 계산하기')
    s.text('다음 날에는 블록을 한 상자에 326개씩 27상자 옮겼어요.')
    s.choices([('먼저 어림해요. 블록은 모두 몇 개쯤일까요?', '( 900개쯤 / 9000개쯤 / 90000개쯤 )')])
    s.picture(fig('area326', svg_area(326, 27, '블록', '상자', split=20)), width_mm=130)
    a1 = calc(s, [('q', '326 × 20 =', 326 * 20, ''), ('q', '326 × 7 =', 326 * 7, ''), ('q', '326 × 27 =', 326 * 27, '')])
    step(s, 1, '그려 보기', '586 × 47 세로로 계산하기')
    s.text('586 × 7, 586 × 40을 차례로 쓰고 더해요.')
    s.picture(fig('lm586x47', svg_longmul(586, 47)), width_mm=70)
    step(s, 2, '말해 보기', '말로 정리하고 까닭 쓰기')
    s.fill(['(세 자리 수) × (몇십몇)은 세 자리 수에 몇십몇의 (            )를 곱한 값과',
            '(            )를 곱한 값을 (        ).'])
    why(s, '586 × 40의 곱을 한 자리 왼쪽으로 밀어 쓰는 까닭을 써 보세요.', lv)
    step(s, 3, '약속하기', '708 × 64 세로로 계산하기')
    s.picture(fig('lm708x64', svg_longmul(708, 64)), width_mm=70)
    step(s, 4, '확인하기', '어림하고 계산하기')
    a5 = calc(s, [('mul', 893, 57), ('mul', 465, 38), ('mul', 709, 46), ('mul', 260, 75)])
    s.choices([('893 × 57은 약 얼마일까요?', '( 5400 / 54000 / 540000 )')])
    ans = '3차시  ① 9000개쯤, %s (어림한 9000개보다 조금 적어요)   ② %d, %d(%d), %d   ③ 일의 자리 수, 십의 자리 수, 더해요   ④ %d, %d(%d), %d   ⑤ %s, 약 54000' % (
        ', '.join(a1), 586 * 7, 586 * 40, 586 * 4, 586 * 47, 708 * 4, 708 * 60, 708 * 6, 708 * 64, ', '.join(a5))
    a, b = best_mul([1, 3, 5, 6, 8])
    step(s, 5, '도전하기', '수 카드 1, 3, 5, 6, 8')
    s.text('수 카드를 한 번씩 모두 사용하여 가장 큰 세 자리 수와 가장 작은 두 자리 수를 만들고, 두 수의 곱을 구해 보세요.')
    s.ask('가장 큰 세 자리 수 (        ), 가장 작은 두 자리 수 (      ), 곱 (            )', blank=False)
    why(s, '수 카드를 어떻게 놓았는지 까닭을 써 보세요.', lv, 1)
    ans += '   ⑥ %d, %d, %d × %d = %d' % (a, b, a, b, a * b)
    return ans


def h_tb4(s, lv):
    s.lesson(4, '개념 구축하기(O)', '몇십으로 나누어 볼까요', '160 ÷ 20과 271 ÷ 50은 어떻게 계산할까요?')
    s.scene(None, '엽서 160장을 한 바구니에 20장씩 담으려고 해요.')
    step(s, 0, '만져 보기', '엽서 240장을 30장씩 — 수 모형을 30씩 묶기')
    s.picture(fig('rods24', svg_rods(24, '십 모형 3개씩 묶어 보세요.')), width_mm=170)
    a1 = calc(s, [('q', '십 모형 3개씩 몇 묶음인가요?', 8, '묶음'), ('q', '240 ÷ 30 =', 8, ''),
                  ('q', '확인: 30 × 8 =', 240, ''), ('q', '필요한 바구니는 몇 개인가요?', 8, '개')])
    step(s, 1, '그려 보기', '418 ÷ 60의 몫을 7, 5, 6으로 어림하기')
    a2 = quot_try(s, 418, 60, [7, 5, 6], lv)
    s.ask('418 ÷ 60 = (      ) … (      )', blank=False)
    step(s, 2, '말해 보기', '몫을 고치는 방법과 까닭')
    s.fill(['나머지가 나누는 수보다 크거나 같으면 몫을 (          ) 해요.',
            '나누는 수 × 몫이 나누어지는 수보다 커서 뺄 수 없으면 몫을 (          ) 해요.'])
    why(s, '나머지가 나누는 수보다 작아야 하는 까닭을 써 보세요.', lv)
    step(s, 3, '약속하기', '645 ÷ 70 세로로 계산하기')
    s.picture(fig('ld645_70', svg_longdiv(645, 70)), width_mm=55)
    s.ask('확인: 70 × (    ) = (        ),  (        ) + (      ) = 645', blank=False)
    step(s, 4, '확인하기', '나머지가 있는 나눗셈과 문장제')
    a5 = calc(s, [('div', 97, 30), ('div', 560, 80),
                  ('div', 455, 60, '색종이 455장을 60장씩 묶으면', ['묶음', '남는 색종이'], ['묶음', '장'])])
    q, r = dv(645, 70)
    ans = '4차시  ① %s   ② %s, 418 ÷ 60 = %s   ③ 크게, 작게   ④ %d … %d (확인 70 × %d = %d, %d + %d = 645)   ⑤ %s' % (
        ', '.join(a1), ' / '.join(a2), ds(418, 60), q, r, q, 70 * q, 70 * q, r, ', '.join(a5))
    step(s, 5, '도전하기', '친구의 계산 살펴보기')
    s.text('친구가 161 ÷ 30을 계산했어요. “30 × 4 = 120, 120 + 41 = 161이니 161 ÷ 30 = 4 … 41이 맞아요.”')
    s.choices([('잘못 계산한 까닭은?', '( 30 × 4를 잘못 계산했어요 /\n나머지 41이 나누는 수 30보다 커요 /\n161에서 120을 잘못 뺐어요 )')])
    s.ask('옳게 계산하면 161 ÷ 30 = (      ) … (      )', blank=False)
    why(s, '검산이 맞아 보이는데 왜 틀렸는지 써 보세요.', lv, 1)
    ans += '   ⑥ 나머지 41이 나누는 수 30보다 커요, %s' % ds(161, 30)
    return ans


def h_tb5(s, lv):
    s.lesson(5, '개념 구축하기(O)', '몇십몇으로 나누어 볼까요 ⑴ 몫이 한 자리 수인 경우', '76 ÷ 19와 164 ÷ 52는 어떻게 계산할까요?')
    s.scene(None, '카네이션 만들기 체험에 76명이 참가했어요. 19모둠으로 똑같이 나누면 한 모둠은 몇 명일까요?')
    step(s, 0, '만져 보기', '87 ÷ 29의 몫을 2, 4, 3으로 어림하기')
    s.text('오후 체험에는 87명이 참가해 29모둠으로 똑같이 나누어요.')
    a1 = quot_try(s, 87, 29, [2, 4, 3], lv)
    s.ask('87 ÷ 29 = (      )  →  한 모둠은 (      )명', blank=False)
    step(s, 1, '그려 보기', '곱셈표로 293 ÷ 64의 몫 어림하기')
    a2 = mul_table(s, 293, 64, [3, 4, 5])
    s.ask('293 ÷ 64 = (      ) … (      )', blank=False)
    step(s, 2, '말해 보기', '정리하고 까닭 쓰기')
    s.fill(['293 ÷ 64는 64 × 4 = 256이므로 몫은 (    )이고, 나머지는 (        )이에요.',
            '계산이 맞는지 (                                   )으로 확인해요.'])
    why(s, '몫을 5로 하지 않은 까닭을 써 보세요.', lv)
    step(s, 3, '약속하기', '437 ÷ 83 세로로 계산하기')
    s.text('437을 440으로, 83을 80으로 어림해 몫을 정해 보세요.')
    s.picture(fig('ld437_83', svg_longdiv(437, 83)), width_mm=55)
    s.ask('확인: 83 × (    ) = (        ),  (        ) + (      ) = 437', blank=False)
    step(s, 4, '확인하기', '몫이 한 자리 수인 나눗셈과 문장제')
    a5 = calc(s, [('div', 98, 27), ('div', 372, 62),
                  ('div', 250, 34, '종이 상자 34개로 로봇 한 개를 만들 때, 상자 250개로', ['로봇', '남는 상자'], ['개', '개'])])
    q, r = dv(437, 83)
    q2, r2 = dv(293, 64)
    ans = '5차시  ① %s, 3, 3명   ② %s, %s   ③ %d, %d, 64 × %d = %d, %d + %d = 293 (예: 64 × 5 = 320은 293보다 커서 뺄 수 없어요)   ④ %d … %d (83 × %d = %d, %d + %d = 437)   ⑤ %s' % (
        ' / '.join(a1), a2, ds(293, 64), q2, r2, q2, 64 * q2, 64 * q2, r2, q, r, q, 83 * q, 83 * q, r, ', '.join(a5))
    step(s, 5, '도전하기', '거꾸로 생각하기')
    s.ask('□ ÷ 44 = 7 … 13일 때 □ = (          )', blank=False)
    s.ask('길이가 135 m인 산책로의 처음부터 끝까지 가로등 28개를 같은 간격으로 세우면 간격은 몇 m인가요?  (      ) m', blank=False)
    why(s, '가로등 사이의 간격 수를 어떻게 구했는지 써 보세요.', lv, 1)
    assert 135 % 27 == 0
    ans += '   ⑥ %d, %d m (간격은 28 − 1 = 27군데)' % (44 * 7 + 13, 135 // 27)
    return ans


def h_tb6(s, lv):
    s.lesson(6, '개념 구축하기(O)', '몇십몇으로 나누어 볼까요 ⑵ 몫이 두 자리 수이고 나누어떨어지는 경우',
             '736 ÷ 32는 어떻게 계산할까요?')
    s.scene(None, '빵 만들기 체험을 위해 밀가루 반죽 736 g을 32 g씩 나누어요.')
    step(s, 0, '만져 보기', '반죽 851 g을 37 g씩 — 크게 뛰고 작게 뛰어 세기')
    s.choices([('먼저 어림해요. 반죽은 몇십 개쯤 될까요?', '( 2개쯤 / 20개쯤 / 200개쯤 )')])
    s.picture(fig('jump851', svg_jump(851, 37, 'g')), width_mm=170)
    a1 = calc(s, [('q', '37 × 20 =', 740, ''), ('q', '851 − 740 =', 111, ''), ('q', '37 × 3 =', 111, ''),
                  ('q', '851 ÷ 37 =   → 반죽은 몇 개인가요?', 851 // 37, '개')])
    assert 851 % 37 == 0
    step(s, 1, '그려 보기', '912 ÷ 38 세로로 계산하기')
    s.picture(fig('ld912_38', svg_longdiv(912, 38)), width_mm=55)
    s.ask('확인: 38 × (      ) = (          )', blank=False)
    step(s, 2, '말해 보기', '정리하고 까닭 쓰기')
    s.fill(['912 ÷ 38에서 먼저 38 × (      ) = 760을 빼고, 남은 (      )에서 38 × (    ) = 152를 빼요.',
            '그래서 몫은 (      )이에요.'])
    why(s, '912에서 38 × 20을 먼저 빼는 까닭을 써 보세요.', lv)
    step(s, 3, '약속하기', '곱셈표로 943 ÷ 41의 몫 어림하기')
    a4 = mul_table(s, 943, 41, [20, 30, 40])
    s.ask('943 − 820 = (        ),  41 × (    ) = 123  →  943 ÷ 41 = (        )', blank=False)
    step(s, 4, '확인하기', '계산하고 맞는지 확인하기 (몫이 두 자리 수)')
    a5 = calc(s, [('div', 672, 32), ('div', 986, 17), ('div', 966, 42, '', None, None, True)])
    assert 912 % 38 == 0 and 943 % 41 == 0
    ans = '6차시  ① 20개쯤, %s   ② %d (76 → 152 → 152 → 0), 38 × %d = 912   ③ 20, 152, 4, %d (예: 38 × 30 = 1140은 912보다 커서)   ④ %s, 123, 3, %s   ⑤ %s' % (
        ', '.join(a1), 912 // 38, 912 // 38, 912 // 38, a4, ds(943, 41), ', '.join(a5))
    step(s, 5, '도전하기', '빈칸의 수 구하기')
    s.text('13 ) □□6 을 계산했더니 몫의 십의 자리에서 26을 빼고, 일의 자리에서도 26을 빼서 나머지가 0이 되었어요.')
    s.ask('몫은? (        )    나누어지는 수는? (          )', blank=False)
    why(s, '어떻게 찾았는지 써 보세요.', lv, 1)
    assert 13 * 22 == 286
    ans += '   ⑥ 22, 286 (13 × 22 = 286)'
    return ans


def h_tb7(s, lv):
    s.lesson(7, '개념 구축하기(O)', '몇십몇으로 나누어 볼까요 ⑶ 몫이 두 자리 수이고 나머지가 있는 경우',
             '950 ÷ 45는 어떻게 계산할까요?')
    s.scene(None, '기념품 한 개를 포장하는 데 리본 45 cm가 필요해요. 리본 950 cm로 기념품을 몇 개까지 포장할 수 있을까요?')
    step(s, 0, '만져 보기', '리본 785 cm로 36 cm씩 — 뛰어 세기')
    s.choices([('먼저 어림해요. 기념품은 몇 개쯤 포장할 수 있을까요?', '( 2개쯤 / 20개쯤 / 200개쯤 )')])
    s.picture(fig('jump785', svg_jump(785, 36, 'cm')), width_mm=170)
    s.ask('36 × 20 = (        ),  785 − 720 = (      ),  65 − 36 = (      )', blank=False)
    s.ask('기념품 (      )개를 포장하고 리본 (      ) cm가 남아요.', blank=False)
    step(s, 1, '그려 보기', '897 ÷ 42 세로로 계산하기')
    s.picture(fig('ld897_42', svg_longdiv(897, 42)), width_mm=55)
    s.ask('확인: 42 × (      ) = (        ),  (        ) + (    ) = 897', blank=False)
    step(s, 2, '말해 보기', '나머지가 알맞은지 따져 보기')
    s.fill(['897 ÷ 42의 몫은 (      ), 나머지는 (      )예요.'])
    why(s, '나머지 15가 알맞은지 어떻게 알 수 있는지 써 보세요.', lv)
    step(s, 3, '약속하기', '곱셈표로 913 ÷ 37의 몫 어림하기')
    a4 = mul_table(s, 913, 37, [10, 20, 30])
    s.ask('913 − 740 = (        ),  37 × (    ) = 148  →  913 ÷ 37 = (      ) … (      )', blank=False)
    step(s, 4, '확인하기', '나머지가 있는 나눗셈과 문장제')
    a5 = calc(s, [('div', 459, 18), ('div', 836, 53), ('div', 999, 28),
                  ('div', 634, 45, '빈 캔 634개를 한 봉지에 45개씩 담으면', ['봉지', '남는 빈 캔'], ['봉지', '개'])])
    assert ds(897, 42) == '21 … 15' and ds(785, 36) == '21 … 29' and ds(913, 37) == '24 … 25'
    ans = '7차시  ① 20개쯤, 720, 65, 29 / 21개, 29 cm   ② 21 … 15 (84 → 57 → 42 → 15), 42 × 21 = 882, 882 + 15 = 897   ③ 21, 15 (예: 15는 나누는 수 42보다 작아요)   ④ %s, 173, 4, %s   ⑤ %s' % (
        a4, ds(913, 37), ', '.join(a5))
    a, b = best_div([2, 3, 6, 8, 1])
    step(s, 5, '도전하기', '수 카드 2, 3, 6, 8, 1')
    s.text('수 카드를 한 번씩 모두 사용하여 몫이 가장 큰 (세 자리 수) ÷ (두 자리 수)를 만들고 계산해 보세요.')
    s.ask('(        ) ÷ (      ) = (      ) … (      )', blank=False)
    why(s, '나누어지는 수와 나누는 수를 어떻게 만들었는지 써 보세요.', lv, 1)
    ans += '   ⑥ %d ÷ %d = %s' % (a, b, ds(a, b))
    return ans


def h_tb8(s, lv):
    s.lesson(8, '개념 구축하기(O)', '어림셈을 활용해 볼까요',
             '실제 수를 계산하기 쉬운 수로 바꾸면 얼마쯤인지 어떻게 알 수 있을까요?')
    s.scene(None, '선우는 한 개에 890원인 야광봉을 19개 사려고 해요.')
    step(s, 0, '만져 보기', '곱셈 어림하기 — 한 개에 610원인 머리띠 42개')
    s.picture(fig('r610', svg_round(610, 600, 700, 10, '머리띠 한 개의 값 610원')), width_mm=120)
    s.picture(fig('r42', svg_round(42, 40, 50, 1, '머리띠의 수 42개')), width_mm=120)
    s.ask('610은 (      )으로, 42는 (      )으로 어림해요.  어림한 식 600 × 40 = (          )원 정도', blank=False)
    step(s, 1, '그려 보기', '색연필 720원 × 53자루')
    s.ask('720은 (      )에, 53은 (      )에 더 가까워요.', blank=False)
    s.ask('어림한 식 (      ) × (      ) = (          )원 정도', blank=False)
    step(s, 2, '말해 보기', '나눗셈 어림하기 — 의자 530개를 40개씩')
    s.text('의자 530개를 한 줄에 40개씩 놓으면 몇 줄쯤 될까요? 530 가까이에서 40으로 나누기 쉬운 수를 찾아요.')
    s.ask('40씩 뛰어 세기: 480, (      ), (      ), 600', blank=False)
    s.ask('530보다 작은 쪽: (      ) ÷ 40 = (    )줄쯤      530보다 큰 쪽: (      ) ÷ 40 = (    )줄쯤', blank=False)
    step(s, 3, '약속하기', '어림한 방법 견주고 까닭 쓰기')
    s.choices([('누나는 530을 520으로 어림했어요.', '( 실제 수보다 작게 / 크게 )'),
               ('선우는 530을 560으로 어림했어요.', '( 실제 수보다 작게 / 크게 )'),
               ('어림셈은 언제 쓰면 좋을까요?', '( 정확한 값이 꼭 필요할 때 /\n대강의 크기를 빨리 알고 싶을 때 )')])
    why(s, '누나와 선우의 어림이 둘 다 알맞은 까닭을 써 보세요.', lv, 1)
    step(s, 4, '확인하기', '사탕 470개를 친구 30명에게')
    s.ask('470을 (      )으로 어림하면 (      ) ÷ 30 = (    )  →  한 사람에게 (    )개쯤', blank=False)
    assert 520 // 40 == 13 and 560 // 40 == 14 and 450 // 30 == 15 and 480 // 30 == 16
    ans = '8차시  ① 600, 40, %d   ② 700, 50 / 700 × 50 = %d   ③ 520, 560 / 520 ÷ 40 = 13, 560 ÷ 40 = 14   ④ 작게, 크게, 대강의 크기를 빨리 알고 싶을 때 / (예) 둘 다 530에 가까우면서 40으로 나누기 쉬운 수로 바꾸었어요   ⑤ 450 ÷ 30 = 15 → 15개쯤 (또는 480 ÷ 30 = 16 → 16개쯤)' % (
        600 * 40, 700 * 50)
    step(s, 5, '도전하기', '우리 반 어림셈왕')
    s.ask('612 × 38을 600 × 40으로 어림하면 (          )', blank=False)
    s.ask('297 × 51을 300 × 50으로 어림하면 (          )', blank=False)
    s.ask('실제 612 × 38 = (          )', blank=False)
    why(s, '어림한 값과 실제 값을 견주어 알게 된 점을 써 보세요.', lv, 1)
    ans += '   ⑥ %d, %d, %d (어림한 값과 가까워요)' % (600 * 40, 300 * 50, 612 * 38)
    return ans


def h_tb9(s, lv):
    s.lesson(9, '탐구 정리하기(O)', '생각을 더하다 ― 지구를 위해 물 발자국을 줄여요',
             '물 발자국을 줄이려면 어떤 샐러드를 만들어야 할까요?')
    s.scene(None, ['다온이는 요리 수업 시간에 친구 23명을 위한 샐러드를 만들려고 해요.',
                   '물 발자국은 음식이나 물건을 만들거나 버릴 때 사용되는 물의 양이에요.'])
    step(s, 0, '이해해요', '무엇을 구해야 할까요')
    s.choices([('물 발자국을 바르게 말한 것은?', '( 음식이나 물건을 만들거나 버릴 때 쓰는 물의 양 /\n하루에 마시는 물의 양 )'),
               ('물 발자국이 더 적은 샐러드를 고르려면 먼저 무엇을 구할까요?', '( 1인분 물 발자국의 합 / 재료의 개수 )'),
               ('23인분의 물 발자국을 구할 때 쓰는 셈은?', '( 곱셈 / 나눗셈 )')])
    step(s, 1, '계획하고 해결해요', '샐러드 세 가지 견주기 (출처: 물 발자국 네트워크, 2023)')
    s.fill(['사과 복숭아 양상추: 125 + 140 + 119 = (        ) L',
            '토마토 바나나 양상추: 100 + 160 + 119 = (        ) L',
            '사과 바나나 양상추: 125 + 160 + 119 = (        ) L'])
    s.ask('물 발자국이 가장 적은 샐러드: (                            )', blank=False)
    step(s, 2, '23인분 구하기', '20인분과 3인분으로 나누어 구하기')
    s.fill('379 × 23 = 379 × 20 + 379 × 3 = (          ) + (          ) = (          ) L')
    step(s, 3, '되돌아봐요', '해결한 방법과 실천')
    s.ask('어떤 방법으로 해결했는지 설명해 보세요.', blank=False)
    s.lines(1)
    s.ask('물 발자국을 줄이기 위해 내가 할 수 있는 일을 써 보세요.', blank=False)
    s.lines(1)
    step(s, 4, '내 힘으로 풀어요', '반 친구 26명, 2가지 재료 샐러드')
    s.fill(['토마토 사과: 100 + 125 = (        ) L', '복숭아 양상추: 140 + 119 = (        ) L'])
    s.ask('만들어야 할 샐러드 (                    ),  26인분: (      ) × 26 = (          ) L', blank=False)
    assert 125 + 160 + 119 == 404 and 100 + 125 == 225 and 140 + 119 == 259
    ans = '9차시  ① 음식이나 물건을 만들거나 버릴 때 쓰는 물의 양, 1인분 물 발자국의 합, 곱셈   ② 384, 379, 404 / 토마토 바나나 양상추 샐러드   ③ %d, %d, %d L   ④ (자유) 예: 1인분을 더해 비교하고 23을 곱했어요   ⑤ 225, 259 / 토마토 사과 샐러드, 225 × 26 = %d L' % (
        379 * 20, 379 * 3, 379 * 23, 225 * 26)
    step(s, 5, '도전하기', '얼마나 더 많았을까요?')
    s.text('다온이가 사과 복숭아 양상추 샐러드(1인분 384 L)를 23인분 만들었다면 물 발자국은 얼마나 더 많았을까요?')
    s.ask('384 × 23 = (          ) L,   (          ) − 8717 = (        ) L', blank=False)
    why(s, '더 간단하게 구하는 방법을 써 보세요.', lv, 1)
    ans += '   ⑥ %d L, %d L (예: (384 − 379) × 23 = 5 × 23 = 115)' % (384 * 23, 384 * 23 - 379 * 23)
    return ans


def h_tb10(s, lv):
    s.lesson(10, '발표하기(P)', '놀이를 더하다 ― 신나는 곱셈, 나눗셈 우주여행!',
             '곱셈과 나눗셈을 옳게 계산하며 우주여행 놀이를 해 볼까요?')
    s.scene(None, '놀이판의 식을 옳게 계산해야 앞으로 나아갈 수 있어요. 상대방의 계산이 맞는지 계산기로 확인해요.')
    step(s, 0, '놀이 방법 알기', '잘못 적힌 규칙 찾아 고치기')
    s.text(BAD_RULES)
    s.ask('잘못 적힌 규칙 세 개를 찾아 번호를 쓰고 바르게 고쳐 보세요.', blank=False)
    s.lines(2)
    order = BAD_FIX
    step(s, 1, '놀이판 살펴보기', '97 ÷ 16 칸에 멈추었어요')
    a2 = calc(s, [('div', 97, 16, '', None, None, True)])
    step(s, 2, '놀이하기', '도전 우주여행 놀이판')
    board_table(s, TB_BOARD_H)
    s.table([['멈춘 칸', '내 답', '확인한 식', '친구 확인']] + [['', '', '', '']] * 4, col_mm=[40, 45, 60, 35])
    step(s, 3, '규칙 지키기', '규칙 다시 확인하기')
    s.choices(RULE_Q)
    step(s, 4, '계산 다시 확인하기', '도전 놀이판의 식')
    a5 = calc(s, [('div', 917, 28), ('mul', 689, 43), ('div', 710, 90)])
    ans = '10차시  ① %s   ② %s   ③ (놀이 기록)   ④ 상대방이 계산기로, 가위바위보로 정해요, 도착 칸에 먼저 도착한 사람   ⑤ %s' % (
        order, a2[0], ', '.join(a5))
    step(s, 5, '도전하기', '어려웠던 식')
    a6 = calc(s, [('mul', 507, 36), ('div', 728, 52), ('div', 91, 24, '', None, None, True)])
    why(s, '놀이판에서 가장 어려웠던 식과 그 까닭을 써 보세요.', lv, 1)
    ans += '   ⑥ %s' % ', '.join(a6)
    return ans


def h_tb11(s, lv):
    s.lesson(11, '발표하기(P)', '공부한 내용을 확인해요', '곱셈과 나눗셈을 정확하게 계산하고 설명할 수 있나요?')
    s.scene(None, '가정의 달 축제 자원봉사를 마치며 곱셈과 나눗셈을 정리해요.')
    step(s, 0, '곱셈 확인하기', '몇십, 몇십몇 곱하기')
    a1 = calc(s, [('mul', 460, 3), ('mul', 460, 30), ('mul', 385, 62), ('mul', 704, 59), ('mul', 830, 40)])
    step(s, 1, '나눗셈 계산하고 확인하기', '916 ÷ 23')
    s.picture(fig('ld916_23', svg_longdiv(916, 23)), width_mm=55)
    s.ask('확인: 23 × (      ) = (        ),  (        ) + (    ) = 916', blank=False)
    step(s, 2, '몫의 크기 비교하기', '몫과 나머지 견주기')
    s.choices([('560 ÷ 80 ○ 301 ÷ 43', '( > / = / < )'), ('70 ) 537 의 몫과 나머지는?', '( 7 … 47 / 6 … 117 / 7 … 37 )')])
    step(s, 3, '잘못 계산한 곳 찾기', '391 ÷ 47')
    s.text('친구의 계산: 47 × 9 = 423, 423 − 391 = 32 → 391 ÷ 47 = 9 … 32')
    s.choices([('잘못 계산한 까닭은?', '( 나머지가 나누는 수보다 커요 /\n47 × 9를 잘못 계산했어요 /\n47 × 9가 391보다 커서 몫을 1 작게 해야 해요 )')])
    s.ask('옳게 계산하면 391 ÷ 47 = (      ) … (      )', blank=False)
    step(s, 4, '문제 해결하기', '나누어 담고 어떤 수 구하기')
    s.text('로봇 936개를 36상자에, 인형 828개를 23상자에 똑같이 나누어 담았어요. 또 어떤 수에 32를 곱했더니 896이 되었어요.')
    a5 = calc(s, [('q', '한 상자에 담은 로봇 936 ÷ 36 =', 936 // 36, '개'), ('q', '한 상자에 담은 인형 828 ÷ 23 =', 828 // 23, '개'),
                  ('q', '어떤 수는?', 896 // 32, ''), ('q', '125에 어떤 수를 곱한 값은?', 125 * (896 // 32), '')])
    assert 936 % 36 == 0 and 828 % 23 == 0 and 896 % 32 == 0
    assert 560 // 80 == 301 // 43 and ds(537, 70) == '7 … 47' and 47 * 9 > 391
    q, r = dv(916, 23)
    ans = '11차시  ① %s   ② %d … %d (23 × %d = %d, %d + %d = 916)   ③ =, 7 … 47   ④ 47 × 9가 391보다 커서 몫을 1 작게 해야 해요, %s   ⑤ %s' % (
        ', '.join(a1), q, r, q, 23 * q, 23 * q, r, ds(391, 47), ', '.join(a5))
    step(s, 5, '도전하기', '사다리 타기')
    a6 = calc(s, [('mul', 243, 48), ('div', 68, 17), ('div', 776, 59), ('div', 560, 80)])
    why(s, '이 단원에서 가장 자신 있는 계산과 그 까닭을 써 보세요.', lv, 1)
    ans += '   ⑥ %s' % ', '.join(a6)
    return ans


def h_st1(s, lv):
    s.lesson(1, '개념 찾기(S)', '과학 축제 준비 위원회가 되었어요', '과학 축제를 준비할 때 곱셈과 나눗셈은 언제 쓰일까요?')
    s.scene(None, '우리 학교에 과학 축제가 열려요. 4학년 2반 26명이 과학 축제 준비 위원회를 맡았어요. 위원장 하준이와 서윤, 도윤, 지아, 민재, 예린이가 부스마다 준비를 나누어 맡아요.')
    step(s, 0, '만져 보기', '보기·생각하기·궁금해하기 — 두 번째 준비 목록')
    s.text('칠판 준비 목록 2: ‘풍선 로켓 풍선: 한 봉지에 145개씩 30봉지’, ‘탐구 노트 216권: 한 모둠에 24권씩’, ‘돋보기 체험 참가자 84명: 21모둠으로’')
    for q in ['보여요: 준비 목록에서 곱하거나 나누어야 하는 수', '생각해요: 어떤 셈을 쓰면 될까요?', '궁금해요: 곱셈과 나눗셈에서 궁금한 것']:
        s.ask(q, blank=False)
        s.lines(1)
    step(s, 1, '그려 보기', '긴 트랙 조각 이어 붙이기')
    s.text('서윤이의 트랙 조각 한 개의 길이는 135 cm예요. 조각 40개를 이어 붙이면 트랙은 몇 cm일까요?')
    s.ask('135 × 4 = (          ) cm      135 × 40 = (          ) cm', blank=False)
    step(s, 2, '말해 보기', '3학년 때 배운 셈 떠올리고 확인하기')
    a3 = calc(s, [('mul', 309, 5), ('mul', 57, 34), ('div', 95, 7, '', None, None, True), ('div', 748, 6)])
    why(s, '왜 그럴까요? 95 ÷ 7을 계산한 뒤 왜 7 × 13 + 4를 계산해 볼까요?', lv, 1)
    step(s, 3, '약속하기', '곱셈과 나눗셈이 필요한 때 (빈칸에 직접)')
    s.fill(['같은 수를 여러 번 모을 때는 (        )을, 똑같이 나누거나 몇씩 묶을 때는 (        )을 써요.',
            '나눗셈은 나누는 수 × 몫 + 나머지 = (              )로 맞는지 확인해요.'])
    step(s, 4, '확인하기', '준비 목록 2 보고 고르기')
    s.choices([('비커를 한 줄에 36개씩 25줄 놓았어요. 비커 수를 구하는 식은?', '( 36 × 25 / 36 ÷ 25 / 36 + 25 )'),
               ('자석 360개를 한 상자에 45개씩 담을 때 상자 수를 구하는 식은?', '( 360 × 45 / 360 ÷ 45 / 360 − 45 )')])
    s.text('곱셈이 필요한 일에 모두 ○ 하세요.')
    s.choices([('㉠ 풍선 145개씩 30봉지의 풍선 수를 구해요', '(    )'), ('㉡ 탐구 노트 216권을 24권씩 나누어요', '(    )'),
               ('㉢ 돋보기 한 개의 값으로 21개의 값을 구해요', '(    )'), ('㉣ 참가자 84명을 21모둠으로 나누어요', '(    )')])
    assert ds(95, 7) == '13 … 4'
    ans = '1차시  ① (자유)   ② %d, %d   ③ %s / 예) 나누는 수 × 몫 + 나머지가 나누어지는 수 95와 같으면 맞게 계산한 것이기 때문이에요   ④ 곱셈, 나눗셈, 나누어지는 수   ⑤ 36 × 25, 360 ÷ 45, ㉠·㉢에 ○' % (
        135 * 4, 135 * 40, ', '.join(a3))
    step(s, 5, '도전하기', '트랙을 더 길게')
    s.ask('트랙 조각 20개의 길이 2500 cm는 몇 m인가요?  (        ) m', blank=False)
    s.ask('트랙 조각 30개를 이으면 125 × 30 = (          ) cm', blank=False)
    why(s, '125 × 30을 125 × 3으로 구하는 방법을 써 보세요.', lv, 1)
    ans += '   ⑥ 25 m, %d cm (125 × 3 = 375의 10배)' % (125 * 30)
    return ans


def h_st2(s, lv):
    s.lesson(2, '개념 구축하기(O)', '빨대 로켓 키트를 주문해요 ― (세 자리 수) × (몇십)', '136 × 20은 어떻게 계산할까요?')
    s.scene(None, '빨대 로켓 부스를 맡은 지아가 빨대를 한 봉지에 136개씩 20봉지 주문했어요.')
    step(s, 0, '만져 보기', '추가 주문 247개씩 30봉지 — 예상하고 확인하기')
    rule_first(s, '247 × 3을 알면 247 × 30은 어떻게 구할 수 있을까요?', lv)
    s.picture(fig('bund247', svg_bundles(247, 3, 10, '빨대')), width_mm=170)
    a1 = calc(s, [('q', '247 × 3 =', 247 * 3, ''), ('q', '247 × 30은 247 × 3의 몇 배인가요?', 10, '배'), ('q', '247 × 30 =', 247 * 30, '')])
    s.ask('예상이 맞았나요?  ( 맞았어요 / 고쳤어요 )', blank=False)
    step(s, 1, '그려 보기', '자릿값 표에서 10배 하기 — 369장씩 80묶음')
    s.text('체험 안내 스티커를 한 묶음에 369장씩 80묶음 인쇄해요.')
    s.table([['', '만의 자리', '천의 자리', '백의 자리', '십의 자리', '일의 자리'],
             ['369 × 8', '', '', '', '', ''], ['369 × 80', '', '', '', '', '']])
    s.ask('900 × 6 = 5400이니까 900 × 60 = (            )', blank=False)
    step(s, 2, '말해 보기', '정리하고 까닭 쓰기')
    s.fill(['(세 자리 수) × (몇십)은 (세 자리 수) × (몇)의 값을 (        ) 한 값과 같아요.',
            '369 × 8 = 2952일 때 369 × 80 = (            )이에요.'])
    why(s, '왜 그럴까요? 곱하는 수가 8에서 80으로 바뀌면 왜 곱도 10배가 될까요?', lv)
    step(s, 3, '약속하기', '508 × 90 세로로 계산하기')
    s.text('자석을 한 상자에 508개씩 90상자 주문했어요. 508 × 9를 계산하고 일의 자리에 0을 써요.')
    s.picture(fig('lm508x90', svg_longmul(508, 90)), width_mm=60)
    step(s, 4, '확인하기', '0이 있는 곱셈과 문장제')
    a5 = calc(s, [('mul', 693, 50), ('mul', 800, 40), ('mul', 704, 30),
                  ('mul', 286, 70, '고무줄이 한 봉지에 286개씩 들어 있어요. 70봉지에 든 고무줄은', '개')])
    assert 369 * 8 == 2952
    ans = '2차시  ① 예) 247 × 3 = 741을 10배 해요 / %s   ② 2952 → 29520, %d   ③ 10배, %d / 예) 80은 8의 10배라서 369씩 80번 모은 것은 8번 모은 것을 10번 모은 것과 같기 때문이에요   ④ %d   ⑤ %s' % (
        ', '.join(a1), 900 * 60, 369 * 80, 508 * 90, ', '.join(a5))
    step(s, 5, '도전하기', '□ 찾기와 크기 견주기')
    s.ask('638 × □0 = 25520일 때 □ = (      )', blank=False)
    s.ask('512 × 70 = (          ),   468 × 80 = (          )   →   곱이 더 큰 것: (            )', blank=False)
    why(s, '□ 안의 수를 어떻게 찾았는지 써 보세요.', lv, 1)
    assert 638 * 4 * 10 == 25520
    ans += '   ⑥ 4, %d, %d, 468 × 80' % (512 * 70, 468 * 80)
    return ans


def h_st3(s, lv):
    s.lesson(3, '개념 구축하기(O)', '자석 클립을 세어요 ― (세 자리 수) × (몇십몇)', '248 × 16은 어떻게 계산할까요?')
    s.scene(None, '자석 체험 부스를 맡은 민재가 클립을 한 상자에 248개씩 16상자 준비했어요.')
    step(s, 0, '만져 보기', '다른 클립 315개씩 27상자 — 예상하고 확인하기')
    rule_first(s, '27상자를 어떻게 나누면 계산하기 쉬울까요?', lv)
    s.choices([('클립은 모두 몇 개쯤일까요?', '( 900개쯤 / 9000개쯤 / 90000개쯤 )')])
    s.picture(fig('area315', svg_area(315, 27, '클립', '상자', split=20)), width_mm=130)
    a1 = calc(s, [('q', '315 × 20 =', 315 * 20, ''), ('q', '315 × 7 =', 315 * 7, ''), ('q', '315 × 27 =', 315 * 27, '')])
    step(s, 1, '그려 보기', '457 × 63 세로로 계산하기')
    s.text('둥근 자석을 한 상자에 457개씩 63상자 주문했어요. 457 × 3, 457 × 60을 차례로 쓰고 더해요.')
    s.picture(fig('lm457x63', svg_longmul(457, 63)), width_mm=70)
    step(s, 2, '말해 보기', '정리하고 까닭 쓰기')
    s.fill(['(세 자리 수) × (몇십몇)은 세 자리 수에 몇십몇의 (            )를 곱한 값과 (            )를 곱한 값을 (      ).'])
    why(s, '왜 그럴까요? 둘째 줄의 곱 27420을 쓸 때 왜 한 자리 왼쪽으로 밀어 쓸까요?', lv)
    step(s, 3, '약속하기', '어림해서 잘못 찾기')
    s.text('지아는 탐구 노트 508권에 스티커를 34장씩 붙인다며 508 × 34를 3556이라고 계산했어요.')
    s.choices([('508 × 34는 약 얼마일까요?', '( 약 1500 / 약 15000 / 약 150000 )')])
    s.ask('실제로 계산하면 508 × 34 = (          )장', blank=False)
    why(s, '지아가 어디에서 잘못했는지 써 보세요.', lv, 1)
    step(s, 4, '확인하기', '어림하고 계산하기')
    a5 = calc(s, [('mul', 736, 48), ('mul', 549, 26), ('mul', 807, 39),
                  ('mul', 245, 32, '체험 카드를 한 묶음에 245장씩 32묶음 만들었어요.', '장')])
    assert 457 * 60 == 27420 and 508 * 4 + 508 * 3 == 3556
    ans = '3차시  ① 예) 20상자와 7상자로 나누어 더해요 / 9000개쯤, %s   ② %d, %d(%d), %d   ③ 일의 자리 수, 십의 자리 수, 더해요 / 예) 63의 6은 60을 나타내서 457 × 60 = 27420이기 때문이에요   ④ 약 15000, %d (508 × 30을 1524로 써서 한 자리 왼쪽으로 밀어 쓰지 않았어요)   ⑤ %s' % (
        ', '.join(a1), 457 * 3, 457 * 60, 457 * 6, 457 * 63, 508 * 34, ', '.join(a5))
    a, b = best_mul([2, 4, 5, 7, 9])
    step(s, 5, '도전하기', '수 카드 2, 4, 5, 7, 9')
    s.text('수 카드를 한 번씩 모두 사용하여 가장 큰 세 자리 수와 가장 작은 두 자리 수를 만들고, 두 수의 곱을 구해 보세요.')
    s.ask('가장 큰 세 자리 수 (        ), 가장 작은 두 자리 수 (      ), 곱 (            )', blank=False)
    why(s, '수 카드를 어떻게 놓았는지 까닭을 써 보세요.', lv, 1)
    ans += '   ⑥ %d, %d, %d × %d = %d' % (a, b, a, b, a * b)
    return ans


def h_st4(s, lv):
    s.lesson(4, '개념 구축하기(O)', '고무 찰흙을 바구니에 나누어요 ― 몇십으로 나누기', '180 ÷ 30과 293 ÷ 40은 어떻게 계산할까요?')
    s.scene(None, '탱탱볼 부스를 맡은 예린이가 고무 찰흙 180개를 한 바구니에 30개씩 담으려고 해요.')
    step(s, 0, '만져 보기', '찰흙 240개를 40개씩 — 예상하고 확인하기')
    rule_first(s, '240 ÷ 40의 몫은 어떻게 구할 수 있을까요?', lv)
    s.picture(fig('rods24b', svg_rods(24, '십 모형 4개씩 묶어 보세요.')), width_mm=170)
    a1 = calc(s, [('q', '십 모형 4개씩 몇 묶음인가요?', 6, '묶음'), ('q', '240 ÷ 40 =', 6, ''), ('q', '확인: 40 × 6 =', 240, '')])
    step(s, 1, '그려 보기', '몫 어림하고 고치기 — 538 ÷ 70')
    s.text('실험 안내 카드 538장을 한 모둠에 70장씩 묶으려고 해요. 몫을 8, 6, 7로 어림해 보세요.')
    a2 = quot_try(s, 538, 70, [8, 6, 7], lv)
    s.ask('538 ÷ 70 = (      ) … (      )  →  (      )묶음, 남는 카드 (      )장', blank=False)
    step(s, 2, '말해 보기', '정리하고 까닭 쓰기')
    s.fill(['나머지가 나누는 수보다 크거나 같으면 몫을 (        ) 해요.',
            '나누는 수 × 몫이 나누어지는 수보다 커서 뺄 수 없으면 몫을 (        ) 해요.'])
    why(s, '왜 그럴까요? 나머지가 나누는 수보다 크면 왜 몫을 1 크게 해야 할까요?', lv)
    step(s, 3, '약속하기', '635 ÷ 80 세로로 계산하기')
    s.text('물감 635 mL를 80 mL씩 통에 나누어 담아요. 635 ÷ 80을 세로로 계산해 보세요.')
    s.picture(fig('ld635_80', svg_longdiv(635, 80)), width_mm=55)
    s.ask('확인: 80 × (    ) = (        ),  (        ) + (      ) = 635', blank=False)
    step(s, 4, '확인하기', '나머지가 있는 나눗셈과 문장제')
    a5 = calc(s, [('div', 98, 30), ('div', 420, 60), ('div', 707, 90),
                  ('div', 386, 50, '자석 386개를 한 상자에 50개씩 담으면', ['상자', '남는 자석'], ['상자', '개'])])
    q, r = dv(635, 80)
    q2, r2 = dv(538, 70)
    ans = '4차시  ① 예) 240 ÷ 40은 24 ÷ 4와 몫이 같아요 / %s   ② %s / %s, %d묶음, %d장   ③ 크게, 작게 / 예) 나머지에서 나누는 수를 한 번 더 빼서 묶음을 하나 더 만들 수 있기 때문이에요   ④ %d … %d (80 × %d = %d, %d + %d = 635)   ⑤ %s' % (
        ', '.join(a1), ' / '.join(a2), ds(538, 70), q2, r2, q, r, q, 80 * q, 80 * q, r, ', '.join(a5))
    step(s, 5, '도전하기', '민재의 계산 살펴보기')
    s.text('민재가 227 ÷ 40을 계산했어요. “40 × 4 = 160, 160 + 67 = 227이니 227 ÷ 40 = 4 … 67이 맞아요.”')
    s.choices([('잘못 계산한 까닭은?', '( 40 × 4를 잘못 계산했어요 /\n나머지 67이 나누는 수 40보다 커요 /\n227에서 160을 잘못 뺐어요 )')])
    s.ask('옳게 계산하면 227 ÷ 40 = (      ) … (      )', blank=False)
    why(s, '확인한 식이 맞아 보이는데 왜 틀렸는지 써 보세요.', lv, 1)
    ans += '   ⑥ 나머지 67이 나누는 수 40보다 커요, %s' % ds(227, 40)
    return ans


def h_st5(s, lv):
    s.lesson(5, '개념 구축하기(O)', '과학 마술 모둠을 나누어요 ― 몫이 한 자리 수인 나눗셈', '92 ÷ 23과 213 ÷ 47은 어떻게 계산할까요?')
    s.scene(None, '과학 마술 체험에 92명이 참가해요. 23모둠으로 똑같이 나누면 한 모둠은 몇 명일까요?')
    step(s, 0, '만져 보기', '오후 참가자 84명을 28모둠으로 — 예상하고 확인하기')
    rule_first(s, '84 ÷ 28의 몫을 어떻게 어림하면 좋을까요?', lv)
    a1 = quot_try(s, 84, 28, [2, 4, 3], lv)
    s.ask('84 ÷ 28 = (      )  →  한 모둠은 (      )명', blank=False)
    step(s, 1, '그려 보기', '곱셈표로 몫 어림하기 — 382 ÷ 73')
    s.text('실험 관찰 기록지 382장을 73장씩 묶어 모둠에 나누어 주려고 해요.')
    a2 = mul_table(s, 382, 73, [4, 5, 6])
    s.ask('382 ÷ 73 = (      ) … (      )  →  (      )묶음, 남는 기록지 (      )장', blank=False)
    step(s, 2, '말해 보기', '정리하고 까닭 쓰기')
    s.fill(['382 ÷ 73에서 73 × 5 = 365이므로 몫은 (    )이고, 나머지를 구하는 식은 (              )이에요.'])
    why(s, '왜 그럴까요? 73 × 6 = 438을 몫으로 쓰지 않은 까닭은 무엇일까요?', lv)
    step(s, 3, '약속하기', '461 ÷ 67 세로로 계산하기')
    s.text('탐구 쪽지 461장을 67장씩 묶어요. 461 ÷ 67을 세로로 계산해 보세요.')
    s.picture(fig('ld461_67', svg_longdiv(461, 67)), width_mm=55)
    s.ask('확인: 67 × (    ) = (        ),  (        ) + (      ) = 461', blank=False)
    step(s, 4, '확인하기', '몫이 한 자리 수인 나눗셈과 문장제')
    a5 = calc(s, [('div', 91, 13), ('div', 89, 21), ('div', 576, 64),
                  ('div', 300, 46, '건전지 300개를 한 상자에 46개씩 담으면', ['상자', '남는 건전지'], ['상자', '개'])])
    q, r = dv(461, 67)
    q2, r2 = dv(382, 73)
    ans = '5차시  ① 예) 84를 80, 28을 30으로 어림하면 3쯤 / %s, 3, 3명   ② %s, %s, %d묶음, %d장   ③ %d, 382 − 365 / 예) 438은 382보다 커서 뺄 수 없기 때문이에요   ④ %d … %d (67 × %d = %d, %d + %d = 461)   ⑤ %s' % (
        ' / '.join(a1), a2, ds(382, 73), q2, r2, q2, q, r, q, 67 * q, 67 * q, r, ', '.join(a5))
    step(s, 5, '도전하기', '거꾸로 생각하기')
    s.ask('□ ÷ 36 = 6 … 25일 때 □ = (          )', blank=False)
    s.ask('길이가 112 m인 축제 길의 처음부터 끝까지 깃발 15개를 같은 간격으로 세우면 간격은 몇 m인가요?  (      ) m', blank=False)
    why(s, '깃발 사이의 간격 수를 어떻게 구했는지 써 보세요.', lv, 1)
    assert 112 % 14 == 0
    ans += '   ⑥ %d, %d m (간격은 15 − 1 = 14군데)' % (36 * 6 + 25, 112 // 14)
    return ans


def h_st6(s, lv):
    s.lesson(6, '개념 구축하기(O)', '비눗방울 용액을 나누어요 ― 몫이 두 자리 수이고 나누어떨어지는 나눗셈', '864 ÷ 36은 어떻게 계산할까요?')
    s.scene(None, '비눗방울 부스를 맡은 서윤이가 비눗방울 용액 864 mL를 컵에 36 mL씩 나누어 담으려고 해요.')
    step(s, 0, '만져 보기', '용액 952 mL를 34 mL씩 — 예상하고 확인하기')
    rule_first(s, '952 ÷ 34의 몫은 한 자리 수일까요, 두 자리 수일까요?', lv)
    s.choices([('용액을 담은 컵은 몇십 개쯤 될까요?', '( 2개쯤 / 20개쯤 / 200개쯤 )')])
    s.picture(fig('jump952', svg_jump(952, 34, 'mL')), width_mm=170)
    a1 = calc(s, [('q', '34 × 20 =', 680, ''), ('q', '952 − 680 =', 272, ''), ('q', '34 × 8 =', 272, ''),
                  ('q', '952 ÷ 34 =   → 컵은 몇 개인가요?', 952 // 34, '개')])
    assert 952 % 34 == 0
    step(s, 1, '그려 보기', '897 ÷ 39 세로로 계산하기')
    s.picture(fig('ld897_39', svg_longdiv(897, 39)), width_mm=55)
    s.ask('확인: 39 × (      ) = (          )', blank=False)
    step(s, 2, '말해 보기', '정리하고 까닭 쓰기')
    s.fill(['897 ÷ 39에서 먼저 39 × (      ) = 780을 빼고, 남은 (      )에서 39 × (    ) = 117을 빼요. 그래서 몫은 (      )예요.'])
    why(s, '왜 그럴까요? 897에서 39 × 20을 먼저 빼는 까닭은 무엇일까요?', lv)
    step(s, 3, '약속하기', '곱셈표로 몫 어림하기 — 966 ÷ 42')
    s.text('축제 홍보 전단 966장을 42장씩 묶어요.')
    a4 = mul_table(s, 966, 42, [20, 30, 40])
    s.ask('966 − 840 = (      ),  42 × (    ) = 126  →  966 ÷ 42 = (      )', blank=False)
    step(s, 4, '확인하기', '계산하고 맞는지 확인하기 (몫이 두 자리 수)')
    a5 = calc(s, [('div', 735, 35), ('div', 918, 18), ('div', 988, 52, '', None, None, True)])
    assert 897 % 39 == 0 and 966 % 42 == 0
    ans = '6차시  ① 예) 34 × 10 = 340이 952보다 작아 두 자리 수 / 20개쯤, %s   ② %d (78 → 117 → 117 → 0), 39 × %d = 897   ③ 20, 117, 3, %d / 예) 39 × 30 = 1170은 897보다 커서 뺄 수 있는 가장 큰 몇십 번은 20번이기 때문이에요   ④ %s, 126, 3, %s   ⑤ %s' % (
        ', '.join(a1), 897 // 39, 897 // 39, 897 // 39, a4, ds(966, 42), ', '.join(a5))
    step(s, 5, '도전하기', '거꾸로 생각하고 나누기')
    s.ask('□ ÷ 24 = 31일 때 □ = (          )', blank=False)
    s.ask('물 로켓 부품 816개를 한 세트에 34개씩 담으면 몇 세트인가요?  (        )세트', blank=False)
    why(s, '□를 어떻게 구했는지 써 보세요.', lv, 1)
    assert 816 % 34 == 0
    ans += '   ⑥ %d, %d세트' % (24 * 31, 816 // 34)
    return ans


def h_st7(s, lv):
    s.lesson(7, '개념 구축하기(O)', '안내 스티커를 나누어요 ― 몫이 두 자리 수이고 나머지가 있는 나눗셈', '830 ÷ 38은 어떻게 계산할까요?')
    s.scene(None, '위원장 하준이가 부스 안내 스티커 830장을 한 모둠에 38장씩 나누어 주려고 해요.')
    step(s, 0, '만져 보기', '스티커 760장을 34장씩 — 뛰어 세며 까닭 말하기')
    s.choices([('몇 모둠쯤에 줄 수 있을까요?', '( 2모둠쯤 / 20모둠쯤 / 200모둠쯤 )')])
    s.picture(fig('jump760', svg_jump(760, 34, '장')), width_mm=170)
    s.ask('34 × 20 = (        ),  760 − 680 = (      ),  80 − 34 − 34 = (      )', blank=False)
    s.ask('(      )모둠에 주고 스티커 (      )장이 남아요.', blank=False)
    why(s, '왜 그럴까요? 남은 12장으로는 왜 한 모둠에 더 줄 수 없을까요?', lv, 1)
    step(s, 1, '그려 보기', '943 ÷ 27 세로로 계산하기')
    s.picture(fig('ld943_27', svg_longdiv(943, 27)), width_mm=55)
    s.ask('확인: 27 × (      ) = (        ),  (        ) + (    ) = 943', blank=False)
    step(s, 2, '말해 보기', '정리하고 까닭 쓰기')
    s.fill(['943 ÷ 27의 몫은 (      ), 나머지는 (      )예요.'])
    why(s, '왜 그럴까요? 몫을 35로 하지 않은 까닭은 무엇일까요?', lv)
    step(s, 3, '약속하기', '곱셈표로 몫 어림하기 — 795 ÷ 34')
    s.text('탐구 보고서 표지 795장을 34장씩 묶어요.')
    a4 = mul_table(s, 795, 34, [10, 20, 30])
    s.ask('795 − 680 = (      ),  34 × (    ) = 102  →  795 ÷ 34 = (      ) … (      )', blank=False)
    step(s, 4, '확인하기', '나머지가 있는 나눗셈과 문장제')
    a5 = calc(s, [('div', 593, 24), ('div', 871, 56), ('div', 700, 31),
                  ('div', 962, 43, '종이컵 962개를 한 탑에 43개씩 쌓으면', ['탑', '남는 종이컵'], ['개', '개'])])
    assert ds(760, 34) == '22 … 12' and ds(943, 27) == '34 … 25' and 27 * 35 > 943 and ds(795, 34) == '23 … 13'
    ans = '7차시  ① 20모둠쯤, 680, 80, 12 / 22모둠, 12장 / 예) 12장은 한 모둠에 줄 34장보다 적기 때문이에요   ② 34 … 25 (81 → 133 → 108 → 25), 27 × 34 = 918, 918 + 25 = 943   ③ 34, 25 / 예) 27 × 35 = 945는 943보다 커서 뺄 수 없기 때문이에요   ④ %s, 115, 3, %s   ⑤ %s' % (
        a4, ds(795, 34), ', '.join(a5))
    a, b = best_div([1, 4, 5, 7, 9])
    step(s, 5, '도전하기', '수 카드 1, 4, 5, 7, 9')
    s.text('수 카드를 한 번씩 모두 사용하여 몫이 가장 큰 (세 자리 수) ÷ (두 자리 수)를 만들고 계산해 보세요.')
    s.ask('(        ) ÷ (      ) = (      ) … (      )', blank=False)
    why(s, '나누어지는 수와 나누는 수를 어떻게 만들었는지 써 보세요.', lv, 1)
    ans += '   ⑥ %d ÷ %d = %s' % (a, b, ds(a, b))
    return ans


def h_st8(s, lv):
    s.lesson(8, '개념 구축하기(O)', '축제 예산을 어림해요 ― 어림셈', '준비물 값이나 줄 수를 어떻게 하면 빠르게 어림할 수 있을까요?')
    s.scene(None, '예산을 맡은 지아가 한 개에 680원인 돋보기를 32개 사려고 해요.')
    step(s, 0, '만져 보기', '곱셈 어림하기 — 820원짜리 비커 47개')
    s.picture(fig('r820', svg_round(820, 800, 900, 10, '비커 한 개의 값 820원')), width_mm=120)
    s.picture(fig('r47', svg_round(47, 40, 50, 1, '비커의 수 47개')), width_mm=120)
    s.ask('820은 (      )으로, 47은 (      )으로 어림해요.  어림한 식 800 × 50 = (          )원 정도', blank=False)
    why(s, '왜 그럴까요? 820을 900이 아니라 800으로 어림한 까닭은 무엇일까요?', lv, 1)
    step(s, 1, '그려 보기', '풍선 590원 × 62봉지')
    s.ask('590은 (      )에, 62는 (      )에 더 가까워요.', blank=False)
    s.ask('어림한 식 (      ) × (      ) = (          )원 정도', blank=False)
    step(s, 2, '말해 보기', '나눗셈 어림하기 — 방석 670개를 50개씩')
    s.text('관람석 방석 670개를 한 줄에 50개씩 놓으면 몇 줄쯤 될까요? 670 가까이에서 50으로 나누기 쉬운 수를 찾아요.')
    s.ask('50씩 뛰어 세기: 600, (      ), (      ), 750', blank=False)
    s.ask('서윤: (      ) ÷ 50 = (    )줄쯤      도윤: (      ) ÷ 50 = (    )줄쯤', blank=False)
    step(s, 3, '약속하기', '어림한 방법 견주고 까닭 쓰기')
    s.choices([('서윤이는 670을 650으로 어림했어요.', '( 실제 수보다 작게 / 크게 )'),
               ('도윤이는 670을 700으로 어림했어요.', '( 실제 수보다 작게 / 크게 )'),
               ('어림셈은 언제 쓰면 좋을까요?', '( 정확한 값이 꼭 필요할 때 /\n대강의 크기를 빨리 알고 싶을 때 )')])
    why(s, '왜 그럴까요? 서윤이(13줄쯤)와 도윤이(14줄쯤)의 어림이 둘 다 알맞은 까닭은 무엇일까요?', lv, 1)
    step(s, 4, '확인하기', '과자 380개를 30모둠에')
    s.ask('380을 (      )으로 어림하면 (      ) ÷ 30 = (    )  →  한 모둠에 (    )개쯤', blank=False)
    assert 650 // 50 == 13 and 700 // 50 == 14 and 360 // 30 == 12 and 390 // 30 == 13
    ans = '8차시  ① 800, 50, %d / 예) 820은 800과 20, 900과 80만큼 차이 나서 800에 더 가깝기 때문이에요   ② 600, 60 / 600 × 60 = %d   ③ 650, 700 / 650 ÷ 50 = 13, 700 ÷ 50 = 14   ④ 작게, 크게, 대강의 크기를 빨리 알고 싶을 때 / 예) 둘 다 670에 가까우면서 50으로 나누기 쉬운 수로 바꾸었기 때문이에요   ⑤ 360 ÷ 30 = 12 → 12개쯤 (또는 390 ÷ 30 = 13 → 13개쯤)' % (
        800 * 50, 600 * 60)
    step(s, 5, '도전하기', '예산 25000원')
    s.ask('실제 값 680 × 32 = (          )원', blank=False)
    s.ask('25000원에서 남는 돈은? (          )원', blank=False)
    why(s, '어림한 값 21000원과 실제 값을 견주어 알게 된 점을 써 보세요.', lv, 1)
    ans += '   ⑥ %d원, %d원' % (680 * 32, 25000 - 680 * 32)
    return ans


def h_st9(s, lv):
    s.lesson(9, '탐구 정리하기(O)', '생각을 더하다 ― 체험 부스 재료비를 비교해요', '재료비를 아끼려면 어떤 체험 부스를 열어야 할까요?')
    s.scene(None, ['위원회는 탱탱볼 부스와 비눗방울 부스 중 하나를 더 열려고 해요. 체험할 사람은 32명이에요.',
                   '1인분 재료비: 탱탱볼 부스 고무 가루 245원·색소 60원·종이컵 40원 / 비눗방울 부스 세제 150원·물엿 145원·종이컵 40원'])
    step(s, 0, '이해해요', '무엇을 구해야 할까요')
    s.choices([('두 부스에 모두 들어가는 재료는?', '( 종이컵 / 물엿 / 색소 )'),
               ('재료비가 적게 드는 부스를 고르려면 먼저 무엇을 구할까요?', '( 1인분 재료비의 합 / 재료의 개수 )'),
               ('32명의 재료비를 구할 때 쓰는 셈은?', '( 곱셈 / 나눗셈 )')])
    step(s, 1, '계획하고 해결해요', '1인분 재료비와 그 차')
    s.fill(['탱탱볼 부스 1인분: 245 + 60 + 40 = (          )원',
            '비눗방울 부스 1인분: (                      ) = (          )원'])
    s.ask('재료비가 더 적게 드는 부스는 어느 것이고, 1인분에 몇 원 더 적나요?', blank=False)
    step(s, 2, '32명 재료비 구하기', '30명과 2명으로 나누어 구하기')
    s.fill('335 × 32 = 335 × 30 + 335 × 2 = (          ) + (        ) = (          )원')
    step(s, 3, '되돌아봐요', '해결한 차례와 아끼는 방법')
    s.ask('어떤 차례로 해결했는지 설명해 보세요.', blank=False)
    s.lines(1)
    s.ask('재료비를 더 아낄 수 있는 방법을 써 보세요.', blank=False)
    s.lines(1)
    step(s, 4, '내 힘으로 풀어요', '36명이 체험할 부스')
    s.fill(['물 로켓 부스 1인분: 310 + 85 = (        )원', '종이 비행기 부스 1인분: 160 + 215 = (        )원'])
    s.ask('열어야 할 부스 (                  ),  36명: (      ) × 36 = (          )원', blank=False)
    assert 245 + 60 + 40 == 345 and 150 + 145 + 40 == 335 and 310 + 85 == 395 and 160 + 215 == 375
    ans = '9차시  ① 종이컵, 1인분 재료비의 합, 곱셈   ② 345, 150 + 145 + 40 = 335 / 비눗방울 부스, 10원   ③ %d, %d, %d원   ④ 예) 1인분 재료비를 더해 비교하고 335에 32를 곱했어요 / 다회용 컵을 쓰면 40 × 32 = 1280원을 아껴요   ⑤ 395, 375 / 종이 비행기 부스, 375 × 36 = %d원' % (
        335 * 30, 335 * 2, 335 * 32, 375 * 36)
    step(s, 5, '도전하기', '얼마나 더 들었을까요?')
    s.text('만약 탱탱볼 부스(1인분 345원)를 32명이 체험했다면 재료비가 얼마나 더 들었을까요?')
    s.ask('345 × 32 = (          )원,   (          ) − 10720 = (        )원', blank=False)
    why(s, '더 간단하게 구하는 방법을 써 보세요.', lv, 1)
    ans += '   ⑥ %d원, %d원 (예: (345 − 335) × 32 = 10 × 32 = 320)' % (345 * 32, 345 * 32 - 335 * 32)
    return ans


def h_st10(s, lv):
    s.lesson(10, '발표하기(P)', '놀이를 더하다 ― 과학 축제 부스 탐험 놀이', '곱셈과 나눗셈을 옳게 계산하며 축제 부스를 탐험해 볼까요?')
    s.scene(None, '축제가 끝나고 위원회 친구들이 교실에서 ‘부스 탐험 놀이’를 해요.')
    step(s, 0, '놀이 방법 알기', '잘못 적힌 규칙 찾아 고치기')
    s.text(BAD_RULES)
    s.ask('잘못 적힌 규칙 세 개를 찾아 번호를 쓰고 바르게 고쳐 보세요.', blank=False)
    s.lines(2)
    order = BAD_FIX
    step(s, 1, '놀이판 살펴보기', '79 ÷ 24 칸에 멈추었어요')
    a2 = calc(s, [('div', 79, 24, '', None, None, True)])
    step(s, 2, '놀이하기', '도전 부스 탐험 놀이판')
    board_table(s, ST_BOARD_H)
    s.table([['멈춘 칸', '내 답', '확인한 식', '친구 확인']] + [['', '', '', '']] * 4, col_mm=[40, 45, 60, 35])
    step(s, 3, '규칙 지키기', '규칙 다시 확인하기')
    s.choices(RULE_Q)
    step(s, 4, '발표하기', '계산 방법과 배려한 점')
    s.ask('놀이에서 계산을 옳게 하려고 어떤 방법을 썼나요?', blank=False)
    s.lines(1)
    s.ask('친구와 놀이할 때 배려한 점은 무엇인가요?', blank=False)
    s.lines(1)
    ans = '10차시  ① %s   ② %s   ③ (놀이 기록)   ④ 상대방이 계산기로, 가위바위보로 정해요, 도착 칸에 먼저 도착한 사람   ⑤ (자유) 예: 몫을 어림하고 나머지가 나누는 수보다 작은지 확인했어요' % (
        order, a2[0])
    step(s, 5, '도전하기', '어려웠던 식')
    a6 = calc(s, [('mul', 609, 32), ('div', 880, 24), ('div', 87, 25, '', None, None, True)])
    why(s, '놀이판에서 가장 어려웠던 식과 그 까닭을 써 보세요.', lv, 1)
    ans += '   ⑥ %s' % ', '.join(a6)
    return ans


def h_st11(s, lv):
    s.lesson(11, '발표하기(P)', '축제 부스 운영 계획을 발표해요', '과학 축제 부스를 운영할 때 곱셈과 나눗셈을 어떻게 쓸까요?')
    s.scene(None, '우리 반은 다음 축제에서 비눗방울 부스를 운영해요.')
    step(s, 0, '만져 보기', '더 많은 사람이 신청했을 때의 운영 계획')
    s.ask('1차시에 궁금했던 것: ____________________________________________', blank=False)
    a1 = calc(s, [('div', 425, 25, '신청한 425명이 한 회에 25명씩 체험하면', ['체험 횟수', '남는 사람'], ['회', '명']),
                  ('mul', 335, 25, '한 회(25명)의 재료비는', '원'),
                  ('div', 940, 45, '남은 용액 940 mL를 45 mL씩 컵에 담으면', ['컵', '남는 용액'], ['개', ' mL'])])
    step(s, 1, '그려 보기', '잘못 계산한 곳 찾기 — 몫이 너무 큰 경우')
    s.text('서윤이의 계산: 64 × 8 = 512, 512 − 497 = 15 → 497 ÷ 64 = 8 … 15')
    s.choices([('잘못 계산한 까닭은?', '( 나머지 15가 나누는 수 64보다 커요 /\n64 × 8을 잘못 계산했어요 /\n64 × 8이 497보다 커서 몫을 1 작게 해야 해요 )')])
    s.ask('옳게 계산하면 497 ÷ 64 = (      ) … (      )', blank=False)
    step(s, 2, '말해 보기', '몫과 나머지 견주기')
    s.choices([('810 ÷ 90 ○ 452 ÷ 49', '( > / = / < )'), ('638 ÷ 70의 몫과 나머지는?', '( 9 … 8 / 8 … 78 / 9 … 80 )')])
    step(s, 3, '약속하기', '부스 운영 계획 발표하기 (내 말로)')
    for q in ['우리 부스 이름과 하는 일', '계획에 쓴 곱셈이나 나눗셈과 그 까닭', '계산이 맞는지 확인한 방법']:
        s.ask(q, blank=False)
        s.lines(1)
    step(s, 4, '확인하기', '예전 생각, 지금 생각 (내 말로)')
    for q in ['예전 생각', '지금 생각', '왜 바뀌었나']:
        s.ask(q + ':', blank=False)
        s.lines(1)
    assert 810 // 90 == 452 // 49 and ds(638, 70) == '9 … 8' and 64 * 8 > 497 and 425 % 25 == 0
    ans = '11차시  ① (자유) / %s   ② 64 × 8이 497보다 커서 몫을 1 작게 해야 해요, %s   ③ =, 9 … 8   ④ 예) 비눗방울 부스, 425명이 25명씩 17회 / 425 ÷ 25 = 17, 335 × 25 = %d / 25 × 17 = 425   ⑤ (자유)' % (
        ', '.join(a1), ds(497, 64), 335 * 25)
    step(s, 5, '도전하기', '마인드맵과 사다리 계산')
    s.labeled([('떠오르는 말', ''), ('묶어 보기', '곱셈: \n나눗셈: '), ('이어지는 말', '')])
    a6 = calc(s, [('mul', 326, 57), ('div', 84, 21), ('div', 803, 46), ('div', 630, 70)])
    ans += '   ⑥ (마인드맵 자유) %s' % ', '.join(a6)
    return ans


HARD = {f: globals()['h_' + f.__name__] for f in TB + ST}




def build(funcs, label, short, outdir, lv):
    s = Sheet(unit_label=label, level=lv, grade_label='4학년')
    lines = [(HARD[f] if lv == '도전형' else f)(s, lv) for f in funcs]
    hard = lv == '도전형'
    if funcs is TB:
        lines.append('10차시 놀이판  ' + board_answers(TB_BOARD_H if hard else TB_BOARD))
    else:
        lines.append('10차시 놀이판  ' + board_answers(ST_BOARD_H if hard else ST_BOARD))
    s.answers('【교사용】 3. 곱셈과 나눗셈(%s) 활동지 정답 (%s)' % (short, lv), lines,
              note='※ 이 활동지는 앱 u3-muldiv.html과 차시 번호가 같습니다.')
    os.makedirs(outdir, exist_ok=True)
    path = os.path.join(outdir, NAME % lv)
    s.save(path)
    return path


def main():
    out = []
    try:
        for lv in ('기본형', '도전형'):
            out.append(build(TB, '4-1 수학 3. 곱셈과 나눗셈(교과서 차시)', '교과서 차시', OUT_TB, lv))
            out.append(build(ST, '4-1 수학 3. 곱셈과 나눗셈(이야기 버전)', '이야기 버전', OUT_ST, lv))
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
