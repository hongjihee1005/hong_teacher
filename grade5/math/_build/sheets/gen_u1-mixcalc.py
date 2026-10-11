# -*- coding: utf-8 -*-
"""5-1 수학 1. 자연수의 혼합 계산 활동지(HWPX) 4개 만들기

    python3 gen_u1-mixcalc.py

교과서 차시 버전(앱 _build/units/u1-mixcalc.tb.js '학급 임원 서아의 자치회 활동', 9개 차시)과
이야기 버전(앱 u1-mixcalc.st.js '우리 반 현장 체험 학습 계획단', 10개 차시)의
차시 번호·제목·S.O.O.P.·탐구 질문·이야기·수를 그대로 따릅니다.
식의 값과 계산 과정(… = … = …)은 모두 아래 calc()가 계산 순서(( ) 안 → 곱셈·나눗셈 → 덧셈·뺄셈,
같은 단계는 앞에서부터)대로 분수로 정확히 계산해 만들고, ○ 안 기호·□ 안 수 카드·( ) 넣기·문장 순서
문제는 모든 경우를 따져 정답을 구합니다.
"""
import hashlib
import itertools
import math
import os
import re
import sys
import tempfile
from fractions import Fraction
from xml.sax.saxutils import escape

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from hwpxgen import Sheet, svg_to_png, check  # noqa: E402

ROOT = os.path.normpath(os.path.join(HERE, '..', '..'))          # grade5/math
OUT_TB = os.path.join(ROOT, 'sem1', 'sheets')
OUT_ST = os.path.join(ROOT, 'sem1-soop', 'sheets')
NAME = '1단원_자연수의혼합계산_활동지_%s.hwpx'
TMP = tempfile.mkdtemp(prefix='u1mix_')
FONT = "'Noto Sans KR','WenQuanYi Zen Hei',sans-serif"
INK, GRAY = '#1D2A2A', '#5E6D6A'
BLUE, ORANGE, GREEN, YEL, PINK, RED = '#2B7BD6', '#E47A38', '#3E9B6A', '#F6C85F', '#F29BB8', '#E8505B'
CIRC = '㉠㉡㉢㉣㉤'
NUMS = '①②③④⑤⑥'

# ================================================================ 혼합 계산(계산 순서대로)
SYM = {'-': '−', '*': '×', '/': '÷', '+': '+'}


def toks(e):
    """'42−(17+8)' → [42, '-', '(', 17, '+', 8, ')']"""
    s = e.replace('−', '-').replace('×', '*').replace('÷', '/').replace(' ', '')
    out = []
    for m in re.finditer(r'\d+|[-+*/()]', s):
        t = m.group()
        out.append(int(t) if t.isdigit() else t)
    assert ''.join(str(t) for t in out) == s, e
    return out


def show(ts):
    """토큰 → '35 − (12 + 14)'"""
    s = ''
    for t in ts:
        if t == '(':
            s += ('' if not s or s.endswith('(') else ' ') + '('
        elif t == ')':
            s += ')'
        else:
            u = SYM.get(t, t) if isinstance(t, str) else str(t)
            s += ('' if not s or s.endswith('(') else ' ') + u
    return s


def _op(a, o, b):
    a, b = Fraction(a), Fraction(b)
    return {'+': a + b, '-': a - b, '*': a * b, '/': a / b}[o]


def _num(v):
    return int(v) if v.denominator == 1 else v


def _step(ts):
    """한 번 계산: 가장 안쪽 ( ) 안(없으면 식 전체)에서 ×÷ 먼저, 같은 단계는 앞에서부터."""
    lo, hi = 0, len(ts)
    stack = []
    for i, t in enumerate(ts):
        if t == '(':
            stack.append(i)
        elif t == ')':
            lo, hi = stack.pop() + 1, i
            break
    seg = list(range(lo, hi))
    k = None
    for i in seg:
        if ts[i] in ('*', '/'):
            k = i
            break
    if k is None:
        for i in seg:
            if ts[i] in ('+', '-'):
                k = i
                break
    a, o, b = ts[k - 1], ts[k], ts[k + 1]
    r = _num(_op(a, o, b))
    part = '%s %s %s' % (a, SYM[o], b)
    nt = ts[:k - 1] + [r] + ts[k + 2:]
    # ( 수 ) 꼴이 되면 괄호를 바로 벗김
    changed = True
    while changed:
        changed = False
        for i in range(len(nt) - 2):
            if nt[i] == '(' and nt[i + 2] == ')' and not isinstance(nt[i + 1], str):
                nt = nt[:i] + [nt[i + 1]] + nt[i + 3:]
                changed = True
                break
    return nt, part, r


def calc(e):
    """→ dict(v=값, chain='식 = … = 값', parts=['42 − 17 = 25', …], first='42 − 17')"""
    ts = toks(e)
    chain, parts = [show(ts)], []
    while len(ts) > 1:
        ts, part, r = _step(ts)
        assert isinstance(r, int) and r >= 0, (e, part, r)      # 자연수 혼합 계산: 중간 값도 0 이상 자연수
        parts.append('%s = %s' % (part, r))
        chain.append(show(ts))
    return dict(v=ts[0], chain=' = '.join(chain), parts=parts, first=parts[0].split(' = ')[0], e=show(toks(e)))


def V(e):
    """식의 값(분수로 정확히, 정수가 아니면 Fraction)."""
    ts = toks(e)
    s = ''.join('Fraction(%d)' % t if isinstance(t, int) else t for t in ts)
    return _num(eval(s))


def check_calc():
    """calc()가 파이썬 계산 순서(eval)와 같은지 견주어 확인."""
    for e in ['42−17+8', '42−(17+8)', '20+25×4+10×2', '3×2+(32−2)÷6', '36−(2+6)÷4×10', '9+3×5−4÷2',
              '5000−(650×3+4000÷10)', '40−(3+5)÷2×6', '10000−(3000÷6×4+4500÷3×2)', '17+2×(41−27)÷7']:
        assert calc(e)['v'] == V(e), e


def paren_all(e, target):
    """( )를 한 번 넣어 target이 되는 식 모두(식 전체를 묶는 것은 빼요)."""
    ts = toks(e)
    nums = [i for i, t in enumerate(ts) if not isinstance(t, str)]
    out = []
    for a, b in itertools.combinations(range(len(nums)), 2):
        if a == 0 and b == len(nums) - 1:
            continue
        i, j = nums[a], nums[b]
        nt = ts[:i] + ['('] + ts[i:j + 1] + [')'] + ts[j + 1:]
        try:
            if V(show(nt)) == target:
                out.append(show(nt))
        except ZeroDivisionError:
            pass
    return out


def ops_all(tpl, ops, once=False):
    """'72 ○ (6 ○ 2)' → [(식, 값)] 기호를 넣은 모든 경우(once면 기호마다 한 번씩)."""
    n = tpl.count('○')
    cands = itertools.permutations(ops, n) if once else itertools.product(ops, repeat=n)
    out = []
    for c in cands:
        s = tpl
        for o in c:
            s = s.replace('○', o, 1)
        try:
            out.append((show(toks(s)), V(s)))
        except ZeroDivisionError:
            pass
    return out


def slots_all(tpl, cards):
    out = []
    for p in set(itertools.permutations(cards)):
        s = tpl
        for c in p:
            s = s.replace('□', str(c), 1)
        out.append((show(toks(s)), V(s)))
    return sorted(out)


def story_all(start, cards):
    """문장 카드 순서 모두: cards=[(기호, 연산, 수)] — '+','-','/'. → [(순서, 식, 값)] (문제가 되는 순서만)"""
    out = []
    for p in itertools.permutations(range(len(cards))):
        v, e, top = Fraction(start), str(start), False      # top: 식의 맨 바깥에 +,−가 있음
        ok = True
        for i in p:
            k, o, n = cards[i]
            if o == '/':
                if v % n:
                    ok = False
                    break
                e = ('(%s)' % e if top else e) + ' ÷ %d' % n
                v = v / n
            else:
                if o == '-' and v < n:
                    ok = False
                    break
                e = e + (' + %d' % n if o == '+' else ' − %d' % n)
                v = v + n if o == '+' else v - n
                top = True
        if ok:
            assert V(e) == v, (e, v)
            out.append((' → '.join(['㉠'] + [cards[i][0] for i in p]), show(toks(e)), _num(v)))
    return out


def bingo_make(cards, target, kinds=2):
    """수 카드(같은 수를 여러 번 써도 됨, 모두 사용)와 서로 다른 기호 2가지 이상으로 target 만들기 — 예를 하나 찾아요."""
    for p in itertools.permutations(cards):
        for os_ in itertools.product('+-*/', repeat=len(p) - 1):
            if len(set(os_)) < kinds:
                continue
            for paren in [None] + list(itertools.combinations(range(len(p)), 2)):
                parts = [str(x) for x in p]
                if paren:
                    a, b = paren
                    if a == 0 and b == len(p) - 1:
                        continue
                    parts[a] = '(' + parts[a]
                    parts[b] = parts[b] + ')'
                s = parts[0] + ''.join(o + x for o, x in zip(os_, parts[1:]))
                try:
                    if V(s) == target and calc(s)['v'] == target:      # 중간 값도 모두 0 이상 자연수
                        return show(toks(s))
                except (ZeroDivisionError, AssertionError):
                    pass
    return None
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


# ================================================================ 그림
def barbell_fig(bar, plates):
    """plates: [(이름, 색, 무게, 개수)] — 개수를 양쪽에 반씩."""
    W, H = 760, 230
    cx, cy = W / 2, 100
    s = R(60, cy - 7, W - 120, 14, '#9AA3A8', 7) + R(cx - 60, cy - 12, 120, 24, '#C9CFD2', 6)
    s += T(cx, cy + 32, '쇠막대 %d kg' % bar, 18)
    left = right = cx - 75
    xs_l, xs_r = cx - 80, cx + 80
    for name, col, wt, k in plates:
        hh = 150 if wt >= 25 else 105
        for side in (-1, 1):
            for _ in range(k // 2):
                if side < 0:
                    s += R(xs_l - 26, cy - hh / 2, 26, hh, col, 5)
                    xs_l -= 30
                else:
                    s += R(xs_r, cy - hh / 2, 26, hh, col, 5)
                    xs_r += 30
    s += R(xs_l - 6, cy - 16, 8, 32, '#555', 2) + R(xs_r - 2, cy + -16, 8, 32, '#555', 2)
    y = 200
    x = 90
    for name, col, wt, k in plates:
        s += R(x, y - 12, 24, 24, col, 4) + T(x + 34, y, '%s %d kg × %d개' % (name, wt, k), 18, 'start')
        x += 330
    return wrap(s, W, H)


def road_fig(points, spans):
    """points: [(거리, 이름)], spans: [(a, b, 글, 위쪽?)]"""
    W, H = 900, 240
    X = lambda d: 50 + d * 800 / points[-1][0]
    s = L(X(0), 125, X(points[-1][0]), 125, '#8A7F74', 6)
    for d, n in points:
        s += C(X(d), 125, 9, '#2F6B57', '#2F6B57') + T(X(d), 150, n, 20)
    ups = 0
    for a, b, t, up in spans:
        if up:
            y = 92 - ups * 46
            ups += 1
            s += '<path d="M%.1f %.1f V%.1f H%.1f V%.1f" fill="none" stroke="%s" stroke-width="2.5"/>' % (X(a), y + 12, y, X(b), y + 12, ORANGE)
            s += T((X(a) + X(b)) / 2, y - 13, t, 19, fill='#C0571C')
        else:
            y = 190
            s += '<path d="M%.1f %.1f V%.1f H%.1f V%.1f" fill="none" stroke="%s" stroke-width="2.5"/>' % (X(a), y - 12, y, X(b), y - 12, ORANGE)
            s += T((X(a) + X(b)) / 2, y + 16, t, 19, fill='#C0571C')
    return wrap(s, W, H)


def dots_fig(groups, per=10, shape='c'):
    """groups: [dict(label, n, color, cross=0, group=0, note='')] — 모둠마다 한 줄 묶음 그림."""
    r, gap = 11, 27
    rows = []
    for g in groups:
        p = g.get('per', per)
        rows.append(math.ceil(g['n'] / p))
    W = 40 + 220 + max(min(g['n'], g.get('per', per)) for g in groups) * gap + 30
    H = 20 + sum(max(1, k) * gap + 26 for k in rows)
    s, y = '', 22
    for g, k in zip(groups, rows):
        p = g.get('per', per)
        s += T(20, y + (k * gap) / 2 - 4, g['label'], 19, 'start', weight='bold')
        if g.get('note'):
            s += T(20, y + (k * gap) / 2 + 20, g['note'], 15, 'start', fill=GRAY)
        x0 = 260
        for i in range(g['n']):
            col, row = i % p, i // p
            x, yy = x0 + col * gap + (8 * (col // g['group']) if g.get('group') else 0), y + row * gap + r
            if shape == 'r' or g.get('shape') == 'r':
                s += R(x - r, yy - r, 2 * r, 2 * r, g['color'], 3, INK, 1.5)
            else:
                s += C(x, yy, r, g['color'], INK, 1.5)
            if i >= g['n'] - g.get('cross', 0):
                s += L(x - r, yy - r, x + r, yy + r, RED, 3) + L(x - r, yy + r, x + r, yy - r, RED, 3)
        y += k * gap + 26
    W = max(W, 300)
    return wrap(s, int(W + 16), int(H))


def bus_fig(seats, groups):
    """groups: [(이름, 수, 색)] — 앞에서부터 차례로 앉힘. 4줄 좌석(가운데 통로) + 맨 뒤 5자리."""
    cols, n_rows = 4, math.ceil((seats - 5) / 4)
    W, H = 150 + (n_rows + 1) * 52 + 40, 300
    s = R(20, 20, W - 40, 260, '#FFF8E7', 30, INK, 3) + R(36, 110, 70, 80, '#DDE6EA', 8) + T(71, 150, '운전석', 16)
    xy = [(150 + r * 52, 40 + c * 52 + (30 if c >= 2 else 0)) for r in range(n_rows) for c in range(cols)]
    xy = xy[:seats - 5] + [(150 + n_rows * 52, 40 + c * 48) for c in range(5)]
    cols_of = []
    for _, k, col in groups:
        cols_of += [col] * k
    for i, (x, y) in enumerate(xy):
        s += R(x, y, 42, 38, cols_of[i] if i < len(cols_of) else '#fff', 6, INK, 1.5)
    return wrap(s, W, H)


def dice_fig(ds):
    pip = {1: [(0, 0)], 2: [(-1, -1), (1, 1)], 3: [(-1, -1), (0, 0), (1, 1)], 4: [(-1, -1), (1, -1), (-1, 1), (1, 1)],
           5: [(-1, -1), (1, -1), (0, 0), (-1, 1), (1, 1)], 6: [(-1, -1), (1, -1), (-1, 0), (1, 0), (-1, 1), (1, 1)]}
    s = ''
    for i, d in enumerate(ds):
        cx = 55 + i * 110
        s += R(cx - 42, 13, 84, 84, '#fff', 14, INK, 3)
        for a, b in pip[d]:
            s += C(cx + a * 22, 55 + b * 22, 8, INK, INK, 1)
    return wrap(s, 330, 110)


# ================================================================ 자주 쓰는 묶음
def order_block(w, D, exprs, labels=None, title=None):
    """계산 순서 나타내기: 식마다 ①②③… 칸에 먼저 계산할 부분을 쓰고 결과. → 정답 글"""
    cs = [calc(e) for e in exprs]
    if title:
        w.text(title)
    if D:
        rows = [['식', '계산 과정 (식 = … = …)']]
        for i, c in enumerate(cs):
            rows.append([('%s  ' % labels[i] if labels else '') + c['e'], ''])
        w.table(rows, col_mm=[62, 118], row_h=4000)
    else:
        n = max(len(c['parts']) for c in cs)
        rows = [['식'] + ['%s %s 계산' % (NUMS[i], '첫째 둘째 셋째 넷째 다섯째'.split()[i]) for i in range(n)] + ['계산 결과']]
        for i, c in enumerate(cs):
            rows.append([('%s  ' % labels[i] if labels else '') + c['e']] + ['        =' if j < len(c['parts']) else '' for j in range(n)] + [''])
        cw = 54
        rest = (180 - cw - 24) / n
        w.table(rows, col_mm=[cw] + [rest] * n + [24], row_h=3600)
    return ', '.join(c['chain'] for c in cs)


def first_block(w, exprs, labels=None):
    """가장 먼저 계산할 부분 찾기"""
    w.choices([(('%s  ' % labels[i] if labels else '') + calc(e)['e'], '(                 )') for i, e in enumerate(exprs)])
    return ', '.join(calc(e)['first'] for e in exprs)


def opts(o, a):
    return ('( ' + ' / '.join(o) + ' )', o[a])


def blanks_block(w, D, parts):
    """parts: 글과 (보기, 정답 번호)를 섞은 목록 — 기본형은 보기 고르기, 도전형은 빈칸 쓰기."""
    s, ans = '', []
    for p in parts:
        if isinstance(p, str):
            s += p
        else:
            o, a = p
            if D:
                s += '(' + ' ' * max(14, 2 * len(o[a])) + ')'
            else:
                s += opts(o, a)[0]
            ans.append(o[a])
    w.fill(s)
    return ', '.join(ans)


def build_block(w, D, ex, unit, ansQ, cards=None, prompt=None, asks=(), unit_ask=None, note=None):
    """하나의 식으로 나타내기(앱 mx1Build). asks: [(질문, 식)] 먼저 묻는 계산. → 정답 글"""
    out = []
    if prompt:
        w.text(prompt)
    for q, e in asks:
        w.ask(q)
        out.append(str(calc(e)['v']))
    c = calc(ex)
    if cards and not D:
        w.text('수 카드:  ' + '   '.join(str(x) for x in cards) + (('   ' + note) if note else ''))
    w.fill(['하나의 식:  (                                                        )',
            '%s  (            ) %s' % (ansQ, unit)])
    out.append('%s, %s%s' % (c['chain'], c['v'], unit))
    return ', '.join(out)


def items_table(w, items, head=('물건', '묶음', '무게')):
    rows = [[head[0]] + [it[0] for it in items[:6]], [head[1] + '·' + head[2]] + ['%d%s\n%d %s' % (it[1], it[2], it[3], it[4]) for it in items[:6]]]
    w.table(rows, header=True, header_col=True, col_mm=[30] + [25] * 6)
    if len(items) > 6:
        rest = items[6:]
        rows = [[head[0]] + [it[0] for it in rest], [head[1] + '·' + head[2]] + ['%d%s\n%d %s' % (it[1], it[2], it[3], it[4]) for it in rest]]
        rows = [r + [''] * (7 - len(r)) for r in rows]
        w.table(rows, header=True, header_col=True, col_mm=[30] + [25] * 6)


def bag_rows(items, fixed):
    """fixed: {이름: 개수} → (표 줄들, 정답 글들, 합)"""
    by = {it[0]: it for it in items}
    rows, ans, tot = [], [], 0
    for n, k in fixed.items():
        it = by[n]
        e = '%d÷%d×%d' % (it[3], it[1], k) if k != 1 else '%d÷%d' % (it[3], it[1])
        v = calc(e)['v']
        tot += v
        rows.append(['%s %d%s' % (n, k, it[2]), '', ''])
        ans.append('%s %s=%d' % (n, calc(e)['e'], v))
    return rows, ans, tot


def board_table(w, n=4):
    w.table([[''] * n for _ in range(n)], header=False, col_mm=[180 / n] * n, row_h=5200)


# ================================================================ 교과서 차시 버전
TB_SCENE = "학급 임원이 된 서아는 자치회에 참여하여 한 학기 동안 여러 가지 활동을 해요."
BAG = [("휴지", 10, "개", 1000, "g"), ("물티슈", 20, "개", 1300, "g"), ("손전등", 2, "개", 1000, "g"), ("라디오", 1, "개", 500, "g"),
       ("담요", 2, "개", 3000, "g"), ("호루라기", 1, "개", 20, "g"), ("통조림", 10, "개", 5000, "g"), ("쿠키", 40, "개", 800, "g"),
       ("초콜릿", 5, "개", 1000, "g"), ("우비", 1, "벌", 600, "g"), ("성냥개비", 10, "세트", 150, "g"), ("물", 6, "병", 9000, "g")]


def tb_l1(w, D):
    w.lesson(1, "개념 찾기(S)", "단원 도입 ― 학급 임원 서아의 자치회 활동", "덧셈, 뺄셈, 곱셈, 나눗셈이 섞여 있는 식은 어떤 순서로 계산할까요?", TB_SCENE)
    w.step("① 역기 무게 구하기", "쇠막대 20 kg, 빨간색 원판 25 kg 4개, 초록색 원판 10 kg 2개")
    w.pic(barbell_fig(20, [("빨간색 원판", RED, 25, 4), ("초록색 원판", '#5DB36A', 10, 2)]), 130, 42)
    w.ask("빨간색 원판 4개의 무게는? 25 × 4 =")
    w.ask("초록색 원판 2개의 무게는? 10 × 2 =")
    w.ask("쇠막대와 원판을 모두 더하면 몇 kg인가요?")
    tot = calc('20+25×4+10×2')
    assert tot['v'] == 140
    w.step("② 자치회 활동 살펴보기")
    w.pick("자치회는 무엇인가요?", ["학교생활을 자치적으로 운영하기 위하여 학생들이 만든 학교 안의 조직", "선생님들만 모여서 회의하는 곳", "학교 밖에서 운동하는 모임"])
    w.pick("서아네 자치회 그림에서 볼 수 없는 활동은?", ["운동장 대여함에서 줄넘기 빌리기", "급식실과 특별실에서 사진 촬영하기", "텃밭 상자에 모종 심기", "수영장에서 수영 대회 열기"])
    w.step("③ 경험 떠올리기")
    a3 = write2(w, D, [("자치회 활동에 참여했던 경험을 써 보세요.", "나는 (                    ) 활동에 참여해서 (                    )을 했어요.",
                        "어린이날 행사를 준비하며 반마다 풍선을 나누었어요"),
                       ("덧셈, 뺄셈, 곱셈, 나눗셈이 섞여 있는 생활 속 상황을 써 보세요.", "(                    )할 때 (       )과 (       )이 섞여 있었어요.",
                        "게임에서 점수를 2배로 받고 벌점을 뺐어요")])
    w.step("④ 배울 내용 살펴보기", "20 + 25 × 4 + 10 × 2를 두 가지 순서로")
    w.ask("앞에서부터 차례대로 계산하면 20 + 25 × 4 + 10 × 2 =")
    w.ask("곱셈을 먼저 계산하면 20 + 25 × 4 + 10 × 2 =")
    seqv = 20
    for o, n in (('+', 25), ('*', 4), ('+', 10), ('*', 2)):
        seqv = _op(seqv, o, n)
    assert seqv == 380
    b4 = blanks_block(w, D, ["역기의 실제 무게는 ", (["140 kg", "380 kg"], 0), "이에요. 같은 식이라도 계산하는 ",
                             (["순서", "글씨"], 0), "에 따라 결과가 달라질 수 있어요."])
    w.step("⑤ 배운 내용 떠올리기", "3·4학년 때 배운 계산")
    qs = ['458+376', '703−258', '245×36', '756÷28']
    for e in qs:
        w.ask(calc(e)['e'] + ' =')
    ans = "1차시  ① 100 kg, 20 kg, %d kg(%s) ② ①, ④ ③ %s ④ %d, %d, %s ⑤ %s" % (
        tot['v'], tot['chain'], a3, seqv, tot['v'], b4, ', '.join(str(calc(e)['v']) for e in qs))
    if D:
        w.step("⑥ 도전하기", "하나의 식으로 나타내기")
        a6 = build_block(w, D, '20+25×2+10×4', ' kg', '모두', prompt="20 kg짜리 쇠막대에 25 kg짜리 빨간색 원판 2개와 10 kg짜리 초록색 원판 4개를 끼웠어요. 모두 몇 kg인지 하나의 식으로 나타내어 구해 보세요.")
        w.why("곱셈을 먼저 계산해야 하는 까닭을 써 보세요.", 1)
        ans += " ⑥ %s, 왜: (예: 원판 무게를 먼저 구해야 쇠막대 무게와 더할 수 있어요)" % a6
    return ans


def tb_l2(w, D):
    w.lesson(2, "개념 구축하기(O)", "덧셈과 뺄셈이 섞여 있는 식을 계산해 볼까요", "덧셈과 뺄셈이 섞여 있는 식은 어떤 순서로 계산할까요?",
             "학급 임원 선거를 하는 날이에요. 서아네 반 여학생은 14명 중에서 2명이 결석했고 남학생은 10명 모두 출석했어요.")
    w.step("① 만져 보기", "선거에 참여한 학생 수")
    w.pic(dots_fig([dict(label="여학생 14명", n=14, color='#F3A6B5', cross=2, note="2명 결석"), dict(label="남학생 10명", n=10, color='#8DB8E8', note="모두 출석")], per=14), 150, 40)
    a1 = build_block(w, D, '14−2+10', '명', '선거에 참여한 학생은 모두', cards=[14, 2, 10], asks=[("선거에 참여한 여학생은 몇 명인가요? 14 − 2 =", '14−2')],
                     prompt="출석한 학생이 모두 선거에 참여했다면 선거에 참여한 학생은 모두 몇 명인지 하나의 식으로 나타내어 구해 보세요.")
    w.step("② 그려 보기", "( )가 있는 식으로 나타내기")
    w.text("미술관 1층에 작품 35개가 있었어요. 2층으로 12개, 3층으로 14개를 옮겼어요. 옮긴 작품 수를 ( )로 묶어 하나의 식으로 나타내 보세요.")
    a2 = build_block(w, D, '35−(12+14)', '개', '1층에 남아 있는 작품은', cards=[35, 12, 14], note='( )',
                     asks=[("2층과 3층으로 옮긴 작품은 모두 몇 개인가요? 12 + 14 =", '12+14')])
    w.step("③ 말해 보기", "두 식 비교하기")
    a3 = order_block(w, D, ['42−17+8', '42−(17+8)'], labels=['가', '나'])
    w.choices([("두 식 가와 나의 계산 결과는?", "( 같아요 / 달라요 )")])
    w.step("④ 약속하기")
    a4 = blanks_block(w, D, ["덧셈과 뺄셈이 섞여 있는 식은 ", (["앞에서부터 차례대로", "덧셈을 먼저", "뒤에서부터 차례대로"], 0), " 계산해요. ( )가 있는 식은 ",
                             (["( ) 안", "( ) 밖"], 0), "을 먼저 계산해요."])
    w.step("⑤ 확인하기")
    w.text("가장 먼저 계산해야 하는 부분을 써 보세요.")
    a5a = first_block(w, ['43−14+5', '43−(14+5)'])
    w.ask("19 + 15 − 23 =")
    w.ask("72 − (16 + 29) =")
    a5 = build_block(w, D, '15−(2+4)', '장', '남은 색종이는', cards=[15, 2, 4], note='( )',
                     prompt="예준이는 색종이 15장 중에서 나무를 접는 데 2장, 꽃을 접는 데 4장을 사용했어요. 남은 색종이는 몇 장인지 ( )가 있는 하나의 식으로 나타내 보세요.")
    ans = "2차시  ① %s ② %s ③ %s, 달라요 ④ %s ⑤ %s, %d, %d, %s" % (a1, a2, a3, a4, a5a, calc('19+15−23')['v'], calc('72−(16+29)')['v'], a5)
    if D:
        w.step("⑥ 도전하기", "식과 계산 결과 잇기, 도서관에서 서점까지")
        lk = link_block(w, ["15 + 18 − 7", "40 − (19 + 2)", "23 + 11 − 16"], ["19", "26", "18"], [1, 0, 2], "식", "계산 결과")
        assert [calc(e)['v'] for e in ['15+18−7', '40−(19+2)', '23+11−16']] == [26, 19, 18]
        w.pic(road_fig([(0, "학교"), (190, "도서관"), (390, "서점"), (770, "공원")], [(0, 770, "770 m", True), (0, 390, "390 m", True), (190, 770, "580 m", False)]), 150, 45)
        a6 = build_block(w, D, '390+580−770', ' m', '도서관에서 서점까지의 거리는', prompt="그림을 보고 도서관에서 서점까지의 거리를 하나의 식으로 나타내어 구해 보세요.")
        w.why("390과 580을 더한 다음 770을 빼는 까닭을 써 보세요.", 1)
        ans += " ⑥ %s, %s, 왜: (예: 두 거리를 더하면 도서관~서점 부분이 두 번 들어가서 학교~공원 거리를 빼요)" % (lk, a6)
    return ans


def tb_l3(w, D):
    w.lesson(3, "개념 구축하기(O)", "곱셈과 나눗셈이 섞여 있는 식을 계산해 볼까요", "곱셈과 나눗셈이 섞여 있는 식은 어떤 순서로 계산할까요?",
             "학급 임원 48명이 6명씩 모둠을 만들어 자치회에서 운영할 활동을 정하려고 해요.")
    w.step("① 만져 보기", "자치회 활동 수")
    w.pic(dots_fig([dict(label="학급 임원 48명", n=48, color='#B9D7A8', group=6, note="6명씩 모둠", per=48)]), 175, 20)
    a1 = build_block(w, D, '48÷6×2', '가지', '자치회에서 운영할 활동은', cards=[48, 6, 2], asks=[("모둠은 몇 개인가요? 48 ÷ 6 =", '48÷6')],
                     prompt="한 모둠이 활동을 2가지씩 정한다면 자치회에서 운영할 활동은 몇 가지인지 하나의 식으로 나타내어 구해 보세요.")
    w.step("② 그려 보기", "( )가 있는 식으로 나타내기")
    w.text("딸기 56개를 한 상자에 7개씩 4줄로 담으려고 해요. 한 상자에 담을 딸기 수를 ( )로 묶어 하나의 식으로 나타내 보세요.")
    w.pic(dots_fig([dict(label="한 상자: 7개씩 4줄", n=28, color=RED, per=7)]), 95, 34)
    a2 = build_block(w, D, '56÷(7×4)', '개', '필요한 상자는', cards=[56, 7, 4], note='( )', asks=[("한 상자에 담을 딸기는 몇 개인가요? 7 × 4 =", '7×4')])
    w.step("③ 말해 보기", "옳게 계산한 사람 찾기")
    w.labeled([("서윤", "32 ÷ 4 × 2 = 8 × 2 = 16"), ("시우", "32 ÷ (4 × 2) = 8 × 2 = 16")], row_h=3000)
    w.pick("옳게 계산한 사람은?", ["서윤", "시우", "둘 다"])
    a3w = why1(w, D, "시우가 잘못 계산한 까닭을 써 보세요.", "( )가 있는 식은 (          )을 먼저 계산해야 하는데 (          )를 먼저 계산했어요.",
               "( )가 있는 식은 ( ) 안을 먼저 계산해야 하는데 32 ÷ 4를 먼저 계산했어요")
    a3 = order_block(w, D, ['32÷(4×2)'], title="시우의 식을 바르게 계산해 보세요.")
    w.step("④ 약속하기")
    a4 = blanks_block(w, D, ["곱셈과 나눗셈이 섞여 있는 식은 ", (["앞에서부터 차례대로", "곱셈을 먼저", "나눗셈을 먼저"], 0), " 계산해요. ( )가 있는 식은 ",
                             (["( ) 안", "( ) 밖"], 0), "을 먼저 계산해요."])
    w.step("⑤ 확인하기")
    a5 = order_block(w, D, ['42÷7×13', '26×4÷8', '105÷(5×7)'])
    w.text("○ 안에 ×, ÷를 한 번씩 써넣어 계산 결과가 더 작은 식을 만들어 보세요.")
    w.fill("72 ○ (6 ○ 2)   →   72 (    ) (6 (    ) 2) = (        )")
    o5 = min(ops_all('72○(6○2)', '×÷', once=True), key=lambda x: x[1])
    assert o5 == ('72 ÷ (6 × 2)', 6)
    ans = "3차시  ① %s ② %s ③ ①, %s, %s ④ %s ⑤ %s, %s = %d" % (a1, a2, a3w, a3, a4, a5, o5[0], o5[1])
    if D:
        w.step("⑥ 도전하기", "결과 비교, 상추 모종, ○ 안 기호")
        w.choices([("84 ÷ (7 × 2)   ○   5 × 16 ÷ 8", "( > / = / < )")])
        c6 = '<' if calc('84÷(7×2)')['v'] < calc('5×16÷8')['v'] else '>'
        a6 = build_block(w, D, '25×3÷15', '개', '한 곳에 심어야 하는 상추 모종은',
                         prompt="은재는 한 판에 25개씩 담긴 상추 모종 3판을 15곳에 똑같이 나누어 심으려고 해요. 한 곳에 심어야 하는 상추 모종은 몇 개인지 하나의 식으로 나타내 보세요.")
        w.fill("16 (    ) 4 (    ) 5 = 20     (×, ÷를 한 번씩)")
        g = [e for e, v in ops_all('16○4○5', '×÷', once=True) if v == 20]
        assert g == ['16 ÷ 4 × 5']
        w.why("16 × 4 ÷ 5는 20이 될 수 없는 까닭을 써 보세요.", 1)
        ans += " ⑥ %s(%d, %d), %s, %s, 왜: (예: 16 × 4 ÷ 5 = 64 ÷ 5는 나누어떨어지지 않아 20이 아니에요)" % (
            c6, calc('84÷(7×2)')['v'], calc('5×16÷8')['v'], a6, g[0])
    return ans


def tb_l4(w, D):
    w.lesson(4, "개념 구축하기(O)", "덧셈, 뺄셈, 곱셈이 섞여 있는 식을 계산해 볼까요", "덧셈, 뺄셈, 곱셈이 섞여 있는 식은 어떤 순서로 계산할까요?",
             "안전한 학교생활 안내 자료를 만들기 위해 급식실에서 사진 9장, 특별실 3곳에서 사진을 4장씩 찍어야 해요.")
    w.step("① 만져 보기", "앞으로 찍을 사진 수")
    w.pic(dots_fig([dict(label="급식실", n=9, color=YEL, note="9장"), dict(label="특별실 3곳", n=12, color='#BFDDF5', group=4, note="4장씩"),
                    dict(label="지금까지 찍은 사진", n=7, color='#CDE8C4', note="7장")], per=12, shape='r'), 150, 45)
    a1 = build_block(w, D, '9+3×4−7', '장', '앞으로 찍어야 하는 사진은', cards=[9, 3, 4, 7],
                     asks=[("특별실 3곳에서 찍을 사진은? 3 × 4 =", '3×4'), ("급식실과 특별실에서 찍을 사진은 모두? 9 + 3 × 4 =", '9+3×4')],
                     prompt="지금까지 7장을 찍었다면 앞으로 찍어야 하는 사진은 몇 장인지 하나의 식으로 나타내어 구해 보세요.")
    w.step("② 그려 보기", "두 식 비교하기")
    a2 = order_block(w, D, ['34−2×4+6', '34−2×(4+6)'], labels=['가', '나'])
    w.step("③ 말해 보기", "계산 순서 나타내기")
    a3 = order_block(w, D, ['39+6×5−2', '45−(4+2)×3'])
    w.step("④ 약속하기")
    a4 = blanks_block(w, D, ["덧셈, 뺄셈, 곱셈이 섞여 있는 식은 ", (["곱셈", "덧셈", "뺄셈"], 0), "을 먼저 계산해요. 덧셈과 뺄셈은 ",
                             (["앞에서부터 차례대로", "뒤에서부터 차례대로"], 0), " 계산하고, ( )가 있으면 ", (["( ) 안", "곱셈"], 0), "을 가장 먼저 계산해요."])
    w.step("⑤ 확인하기")
    w.ask("48 − 2 × (9 + 7) =")
    w.ask("20 − 2 × 6 + 7 =")
    a5 = build_block(w, D, '65−(8+7)×2', '권', '남아 있는 책은', cards=[65, 8, 7, 2], note='( )',
                     prompt="유나네 반 학급 문고에 책이 65권 있었어요. 여학생 8명과 남학생 7명이 한 명당 2권씩 빌려 갔다면 남아 있는 책은 몇 권인지 하나의 식으로 나타내 보세요.")
    ans = "4차시  ① %s ② %s ③ %s ④ %s ⑤ %d, %d, %s" % (a1, a2, a3, a4, calc('48−2×(9+7)')['v'], calc('20−2×6+7')['v'], a5)
    if D:
        w.step("⑥ 도전하기", "30보다 작은 식, 꿀떡 문제")
        w.choices([("2 + 3 × 16 − 18", "( 30보다 작아요 / 30보다 커요 )"), ("3 × (25 − 17) + 5", "( 30보다 작아요 / 30보다 커요 )")])
        v1, v2 = calc('2+3×16−18')['v'], calc('3×(25−17)+5')['v']
        assert v1 > 30 > v2
        w.ask("18 + 4 × (24 − 15) < □에서 □ 안에 들어갈 수 있는 가장 작은 자연수는?")
        a6 = build_block(w, D, '(25+15)×2−13', '개', '민주가 산 꿀떡은',
                         prompt="유성이는 분홍색 꿀떡 25개와 초록색 꿀떡 15개를 샀고, 민주는 유성이가 산 꿀떡의 2배보다 13개 더 적게 샀어요. 민주가 산 꿀떡은 몇 개인지 하나의 식으로 나타내 보세요.")
        w.why("25 + 15를 ( )로 묶어야 하는 까닭을 써 보세요.", 1)
        ans += " ⑥ 커요(%d), 작아요(%d), %d, %s, 왜: (예: 유성이가 산 꿀떡 전체의 2배이므로 합을 먼저 구해야 해요)" % (v1, v2, calc('18+4×(24−15)')['v'] + 1, a6)
    return ans


def tb_l5(w, D):
    w.lesson(5, "개념 구축하기(O)", "덧셈, 뺄셈, 나눗셈이 섞여 있는 식을 계산해 볼까요", "덧셈, 뺄셈, 나눗셈이 섞여 있는 식은 어떤 순서로 계산할까요?",
             "운동장 대여함에 줄넘기가 8개 있었어요. 줄넘기 30개를 준비하여 운동장 대여함과 체육관 대여함에 똑같이 나누어 더 넣었어요.")
    w.step("① 만져 보기", "남아 있는 줄넘기 수")
    w.pic(dots_fig([dict(label="운동장 대여함", n=8, color='#F6C9A6', note="처음 8개"), dict(label="준비한 줄넘기", n=30, color='#BFDDF5', group=15, note="두 대여함에 똑같이")], per=30), 160, 30)
    a1 = build_block(w, D, '8+30÷2−6', '개', '운동장 대여함에 남아 있는 줄넘기는', cards=[8, 30, 2, 6],
                     asks=[("운동장 대여함에 더 넣은 줄넘기는? 30 ÷ 2 =", '30÷2'), ("더 넣은 뒤 운동장 대여함의 줄넘기는? 8 + 30 ÷ 2 =", '8+30÷2')],
                     prompt="그 뒤 학생들이 운동장 대여함에서 줄넘기 6개를 빌려 갔다면 남아 있는 줄넘기는 몇 개인지 하나의 식으로 나타내어 구해 보세요.")
    w.step("② 그려 보기", "두 식 비교하기")
    a2 = order_block(w, D, ['44−32÷4+7', '(44−32)÷4+7'], labels=['가', '나'])
    w.step("③ 말해 보기", "계산 순서 나타내기")
    a3 = order_block(w, D, ['5−12÷6+28', '3+72÷(15−6)', '63÷(2+5)−4'])
    w.step("④ 약속하기")
    a4 = blanks_block(w, D, ["덧셈, 뺄셈, 나눗셈이 섞여 있는 식은 ", (["나눗셈", "덧셈", "뺄셈"], 0), "을 먼저 계산해요. 덧셈과 뺄셈은 ",
                             (["앞에서부터 차례대로", "뒤에서부터 차례대로"], 0), " 계산하고, ( )가 있으면 ", (["( ) 안", "나눗셈"], 0), "을 가장 먼저 계산해요."])
    w.step("⑤ 확인하기", "문장 순서를 정해 문제 만들기")
    cards = [("㉡", '+', 8), ("㉢", '/', 4), ("㉣", '-', 12)]
    w.labeled([("㉠", "색종이 24장이 있습니다."), ("㉡", "색종이 8장을 더 받았습니다."), ("㉢", "4명이 똑같이 나누어 가졌습니다."),
               ("㉣", "색종이 12장을 동생에게 주었습니다.")], label_mm=16, row_h=2900)
    w.text("㉠ 다음에 올 문장의 순서를 정하고, ‘지금 가지고 있는 색종이는 몇 장일까요?’를 붙여 문제를 만들어요.")
    w.fill(['순서:  ㉠ → (     ) → (     ) → (     )', '하나의 식:  (                                                 )', '답:  (          )장'])
    st = story_all(24, cards)
    ans = "5차시  ① %s ② %s ③ %s ④ %s ⑤ (예) %s" % (a1, a2, a3, a4, ' / '.join('%s: %s = %s장' % s for s in st))
    if D:
        w.step("⑥ 도전하기", "( ) 넣기, 무게 비교")
        w.fill("24 − 18 ÷ 2 + 7 = 10이 되도록 ( )를 넣어 보세요.   (                                    )")
        p6 = paren_all('24−18÷2+7', 10)
        assert p6 == ['(24 − 18) ÷ 2 + 7'], p6
        w.ask("잘못 계산한 식 52 ÷ (4 + 9) − 2를 바르게 계산하면?")
        w.table([["칫솔 1개", "비누 2개", "치약 1개"], ["25 g", "260 g", "150 g"]])
        a6 = build_block(w, D, '25+260÷2−150', ' g', '더 무거운 무게는', prompt="칫솔 1개와 비누 1개의 무게의 합은 치약 1개의 무게보다 몇 g 더 무거운지 하나의 식으로 나타내 보세요.")
        w.why("260을 2로 나누어야 하는 까닭을 써 보세요.", 1)
        ans += " ⑥ %s, %d, %s, 왜: (예: 260 g은 비누 2개의 무게라서 비누 1개의 무게를 구하려면 2로 나누어야 해요)" % (p6[0], calc('52÷(4+9)−2')['v'], a6)
    return ans


def tb_l6(w, D):
    w.lesson(6, "개념 구축하기(O)", "덧셈, 뺄셈, 곱셈, 나눗셈이 섞여 있는 식을 계산해 볼까요", "덧셈, 뺄셈, 곱셈, 나눗셈이 섞여 있는 식은 어떤 순서로 계산할까요?",
             "텃밭 상자 6개에 고추 모종을 각각 3개씩 2줄로 심었어요. 상추 모종 32개 중에서 시든 모종 2개를 빼고 텃밭 상자 6개에 똑같이 나누어 심으려고 해요.")
    w.step("① 만져 보기", "텃밭 상자 한 개의 모종 수")
    w.pic(dots_fig([dict(label="한 상자의 고추", n=6, color=RED, group=3, note="3개씩 2줄", per=6), dict(label="상추 모종 32개", n=32, color='#7BC47F', cross=2, note="시든 모종 2개", per=16)]), 140, 40)
    a1 = build_block(w, D, '3×2+(32−2)÷6', '개', '텃밭 상자 한 개에 심는 모종은 모두', cards=[3, 2, 32, 2, 6], note='( )',
                     asks=[("상자 한 개의 고추 모종은? 3 × 2 =", '3×2'), ("상자 한 개의 상추 모종은? (32 − 2) ÷ 6 =", '(32−2)÷6')])
    w.step("② 그려 보기", "계산 순서 나타내기")
    a2 = order_block(w, D, ['3×2+(32−2)÷6', '9+3×5−4÷2', '36−(2+6)÷4×10'])
    w.step("③ 말해 보기", "가장 먼저 계산할 부분 찾기")
    a3 = first_block(w, ['12+5×46−34÷2', '12+5×(46−34)÷2'])
    a3w = why1(w, D, "( )가 있고 없음에 따라 무엇이 달라지는지 써 보세요.", "( )가 없으면 (          )을 먼저, ( )가 있으면 (          )을 가장 먼저 계산해요.",
               "( )가 없으면 곱셈 5 × 46을 먼저, ( )가 있으면 ( ) 안 46 − 34를 가장 먼저 계산해요")
    w.step("④ 약속하기")
    a4 = blanks_block(w, D, ["덧셈, 뺄셈, 곱셈, 나눗셈이 섞여 있는 식은 ", (["곱셈과 나눗셈", "덧셈과 뺄셈"], 0), "을 먼저 계산해요. ( )가 있으면 ",
                             (["( ) 안", "곱셈과 나눗셈"], 0), "을 가장 먼저 계산해요. 같은 단계끼리는 ", (["앞에서부터 차례대로", "뒤에서부터 차례대로"], 0), " 계산해요."])
    w.step("⑤ 확인하기", "조건 골라 문제 만들기")
    w.table([["방울토마토", "체리", "과자", "초콜릿"], ["100 g 1500원", "100 g 3500원", "3개 4200원", "3개 6000원"]])
    w.text("지훈이는 ( 방울토마토 / 체리 ) 100 g과 ( 과자 / 초콜릿 ) 2개를 사고 10000원을 냈어요. 조건에 ○표 하고, 받아야 하는 거스름돈을 하나의 식으로 나타내어 구해 보세요.")
    w.fill(['하나의 식:  (                                                        )', '거스름돈  (            )원'])
    shop = []
    for n1, p1 in (("방울토마토", 1500), ("체리", 3500)):
        for n2, p2 in (("과자", 4200), ("초콜릿", 6000)):
            e = '10000−(%d+%d÷3×2)' % (p1, p2)
            shop.append('%s·%s %s = %d원' % (n1, n2, calc(e)['e'], calc(e)['v']))
    ans = "6차시  ① %s ② %s ③ %s, %s ④ %s ⑤ %s" % (a1, a2, a3, a3w, a4, ' / '.join(shop))
    if D:
        w.step("⑥ 도전하기", "결과가 다른 식, 거스름돈, 가장 작은 식")
        three = ['20+5×(25−9)÷8', '4+27÷9×(32−23)', '33+2×3÷6−4']
        w.pick("계산 결과가 다른 하나는?", [calc(e)['e'] for e in three])
        vals = [calc(e)['v'] for e in three]
        assert vals[0] == vals[2] != vals[1]
        w.table([["수첩", "지우개"], ["1권 650원", "10개 4000원"]])
        a6 = build_block(w, D, '5000−(650×3+4000÷10)', '원', '거스름돈은', prompt="은빈이는 수첩 3권과 지우개 1개를 사고 5000원을 냈어요. 받아야 하는 거스름돈은 얼마인지 하나의 식으로 나타내 보세요.")
        w.fill("5, 9, 3을 □ 안에 한 번씩 넣어 결과가 가장 작은 식:   □ × (□ + □) − 28 ÷ 7  →  (                              ) = (        )")
        sl = min(slots_all('□×(□+□)−28÷7', [5, 9, 3]), key=lambda x: x[1])
        w.why("어떤 수를 곱하는 수로 골랐는지 까닭을 써 보세요.", 1)
        ans += " ⑥ ②(%d, 나머지 %d), %s, %s = %d(3 × (9 + 5)도 됨), 왜: (예: 곱하는 수가 작을수록 결과가 작아서 가장 작은 3을 골랐어요)" % (vals[1], vals[0], a6, sl[0], sl[1])
    return ans


def tb_l7(w, D):
    w.lesson(7, "탐구 정리하기(O)", "생각을 더하다 ― 나를 지켜 주는 생존 가방", "혼합 계산을 이용하여 생존 가방에 넣은 물건의 무게를 구할 수 있을까요?",
             "생존 가방은 재난이 일어났을 때 바로 들고 나갈 수 있도록 꼭 필요한 물건을 넣어 둔 가방이에요.")
    w.step("① 생존 가방 알아보기", "물건의 묶음과 무게")
    items_table(w, BAG)
    w.choices([("초등학교 5학년 학생은 생존 가방을 몇 g 정도로 준비하면 좋을까요?", "( 500 g / 5000 g / 50000 g )"),
               ("물티슈 20개가 1300 g일 때 물티슈 1개의 무게를 구하는 식은?", "( 1300 ÷ 20 / 1300 × 20 / 1300 − 20 )")])
    w.step("② 재원이의 생존 가방", "물건마다 하나의 식으로")
    w.text("예: 성냥개비 2세트의 무게  150 ÷ 10 × 2 = 30 (g)")
    fixed = {"담요": 1, "물": 1, "통조림": 2, "초콜릿": 3, "성냥개비": 2}
    rows, a2, tot = bag_rows(BAG, fixed)
    assert tot == 4630
    w.table([["넣은 물건", "하나의 식", "무게(g)"]] + rows, col_mm=[40, 100, 40], row_h=2900)
    w.ask("재원이의 생존 가방은 모두 몇 g인가요?")
    w.step("③ 무게가 알맞은지 따져 보기")
    w.choices([("재원이의 생존 가방은 무게가 알맞은가요?", "( 알맞아요 / 알맞지 않아요 )")])
    w.ask("재원이가 물 1병을 더 넣으면 생존 가방은 몇 g이 될까요?")
    plus = tot + calc('9000÷6')['v']
    w.step("④ 나만의 생존 가방", "5000 g보다 무거우면 다른 물건으로 바꿔요")
    w.table([["넣은 물건", "하나의 식", "무게(g)"]] + [['', '', '']] * 5 + [["합계", "", ""]], col_mm=[40, 100, 40], row_h=2900)
    w.step("⑤ 친구에게 설명하기")
    a5 = write2(w, D, [("생존 가방에 넣은 물건과 그 까닭을 써 보세요.", "나는 (                    )을 넣었어요. 왜냐하면 (                    ) 때문이에요.",
                        "휴지, 손전등, 물, 쿠키, 통조림이 필요할 것 같아서 넣었어요"),
                       ("생존 가방의 무게가 알맞은지와 그 까닭을 써 보세요.", "모두 (          ) g이라서 5000 g보다 ( 가벼워서 / 무거워서 ) ( 알맞아요 / 바꿔야 해요 ).",
                        "모두 4700 g이라 5000 g보다 가벼워서 알맞아요")])
    ans = "7차시  ① 5000 g, 1300 ÷ 20 ② %s, 모두 %d g ③ 알맞아요(5000 g보다 가벼워요), %d g ④ (학생마다 다름) ⑤ %s" % ('; '.join(a2), tot, plus, a5)
    if D:
        w.step("⑥ 도전하기", "또 다른 생존 가방")
        fx = {"휴지": 5, "손전등": 1, "물": 2, "쿠키": 10, "통조림": 1}
        rows6, a6, t6 = bag_rows(BAG, fx)
        assert t6 == 4700
        w.table([["넣은 물건", "하나의 식", "무게(g)"]] + rows6 + [["합계", "", ""]], col_mm=[40, 100, 40], row_h=2900)
        w.why("물 2병의 무게를 9000 ÷ 6 × 2로 구하는 까닭을 써 보세요.", 1)
        ans += " ⑥ %s, 합계 %d g, 왜: (예: 9000 g은 물 6병의 무게라서 1병의 무게를 먼저 구하고 2를 곱해요)" % ('; '.join(a6), t6)
    return ans


def tb_l8(w, D):
    w.lesson(8, "발표하기(P)", "놀이를 더하다 ― 하나, 둘, 셋 빙고!", "수 카드로 혼합 계산식을 만들어 빙고 놀이를 해 볼까요?",
             "4명이 함께 하는 ‘하나, 둘, 셋 빙고!’ 놀이예요. 뒤집은 수 카드로 식을 만들어 놀이판의 수를 색칠해요.")
    w.step("① 놀이 방법 알아보기")
    w.choices([("놀이판에 써넣는 수는?", "( 1~25 중 16개 / 1~16 차례로 )"),
               ("뒤집은 수 카드는 모두 사용해요.", "( ○ / × )"),
               ("+, −, ×, ÷ 중에서 서로 다른 2가지를 사용해요.", "( ○ / × )"),
               ("필요한 경우 ( )를 사용할 수 있어요.", "( ○ / × )"),
               ("같은 수는 한 번만 써야 해요.", "( ○ / × )"),
               ("가장 먼저 몇 줄을 색칠한 사람이 ‘빙고’를 외치나요?", "( 1줄 / 3줄 / 4줄 )")])
    w.step("② 식 만들기 연습", "뒤집은 수 카드: 7, 5, 8")
    w.ask("친구가 만든 식 7 + 5 − 8 + 5 =")
    w.fill("7, 5, 8을 모두 사용하여 계산 결과가 12인 식:  (                                        )")
    ex12 = '(8−7)×5+7'
    assert calc(ex12)['v'] == 12
    w.step("③ 놀이판 만들기", "1부터 25까지의 수 중에서 16개를 골라 써요")
    board_table(w)
    w.step("④ 빙고 놀이", "만든 식과 색칠한 수를 적어요")
    w.table([["번", "뒤집은 수 카드", "내가 만든 식", "계산 결과"]] + [[str(i), '', '', ''] for i in range(1, 5)], col_mm=[14, 46, 90, 30], row_h=2900)
    w.step("⑤ 또 다른 놀이 방법", "주사위 3번 + 기호 3가지")
    w.text("예를 들어 주사위를 3번 던져 2, 3, 6이 나왔어요. +, −, ×, ÷, ( ) 중에서 3가지를 사용하여 식을 만들고 계산해 보세요.")
    w.pic(dice_fig([2, 3, 6]), 60, 22)
    w.lines(2)
    dice = ['(2+3)×6', '6÷(3−2)', '2×(6+3)']
    ans = "8차시  ① 1~25 중 16개, ○ ○ ○ ×, 3줄 ② %d, (예: %s) ③④ (학생마다 다름) ⑤ (예: %s)" % (
        calc('7+5−8+5')['v'], calc(ex12)['chain'], ', '.join(calc(e)['chain'] for e in dice))
    if D:
        w.step("⑥ 도전하기", "3줄 빙고 준비: 수 카드 3, 4, 6으로 여러 수 만들기")
        tg = [1, 6, 18, 30]
        exs = []
        for t in tg:
            e = bingo_make([3, 4, 6], t)
            assert e and calc(e)['v'] == t
            exs.append(e)
        w.fill(['계산 결과가 %d인 식:  (                                    )' % t for t in tg])
        w.why("원하는 수를 만들 때 쓴 나만의 비법을 써 보세요.", 1)
        ans += " ⑥ (예: %s), 왜: (예: 큰 수는 곱셈, 작은 수는 뺄셈이나 나눗셈을 써요)" % ', '.join('%s = %d' % (e, t) for e, t in zip(exs, tg))
    return ans


def tb_l9(w, D):
    w.lesson(9, "발표하기(P)", "공부한 내용을 확인해요", "자연수의 혼합 계산을 계산 순서에 맞게 할 수 있나요?",
             "서아와 함께 한 자치회 활동을 떠올리며 배운 계산 순서를 확인해요.")
    w.step("① 먼저 계산할 부분", "가장 먼저 계산해야 하는 부분 쓰기")
    a1 = first_block(w, ['29+8×4−14', '46÷(28−5)+16'])
    w.step("② 계산 순서 나타내기")
    a2 = order_block(w, D, ['32−(25+6)', '63÷7×3'])
    w.step("③ 잇고 비교하기")
    lk = link_block(w, ["8 × 5 − 35 ÷ 5 + 13", "17 + 2 × (41 − 27) ÷ 7"], ["21", "14", "46"], [2, 0], "식", "계산 결과")
    assert [calc('8×5−35÷5+13')['v'], calc('17+2×(41−27)÷7')['v']] == [46, 21]
    w.choices([("15 × 3 − 27 + 36 ÷ 6   ○   28 ÷ (22 − 8) × 11 + 2", "( > / = / < )")])
    l, r = calc('15×3−27+36÷6')['v'], calc('28÷(22−8)×11+2')['v']
    assert l == r == 24
    w.step("④ 문제 해결하기")
    a4 = build_block(w, D, '43+5×4−35', '개', '남은 칭찬 도장은', cards=[43, 5, 4, 35],
                     prompt="시우는 지난달에 칭찬 도장을 43개 받았고 이번 달은 매주 5개씩 4주 동안 받았어요. 공책으로 바꾸는 데 35개를 사용했다면 남은 칭찬 도장은 몇 개인지 하나의 식으로 나타내 보세요.")
    w.fill("15 + 9 − 6 ÷ 3 = 16이 되도록 ( )를 넣어 보세요.   (                                    )")
    p4 = paren_all('15+9−6÷3', 16)
    assert p4 == ['15 + (9 − 6) ÷ 3'], p4
    w.step("⑤ 확인하고 정리해요")
    a5 = order_block(w, D, ['29−13+5', '40÷2×4', '2+4×7−15÷3'])
    b5 = blanks_block(w, D, ["덧셈과 뺄셈, 곱셈과 나눗셈이 섞여 있는 식은 ", (["앞에서부터 차례대로", "뒤에서부터 차례대로"], 0), " 계산해요. 덧셈, 뺄셈, 곱셈, 나눗셈이 섞여 있는 식은 ",
                             (["곱셈과 나눗셈", "덧셈과 뺄셈"], 0), "을 먼저 계산해요. ( )가 있는 식은 ", (["( ) 안", "( ) 밖"], 0), "을 가장 먼저 계산해요."])
    ans = "9차시  ① %s ② %s ③ %s, =(둘 다 %d) ④ %s, %s ⑤ %s, %s" % (a1, a2, lk, l, a4, p4[0], a5, b5)
    if D:
        w.step("⑥ 도전하기", "지훈이의 학용품")
        w.table([["필통", "색연필"], ["1개 3500원", "3자루 1200원"]])
        a6 = build_block(w, D, '5000−(3500+1200÷3×2)', '원', '㉡ 남은 돈은',
                         prompt="지훈이는 5000원으로 3500원짜리 필통 1개와 색연필 2자루를 사려고 해요. 남은 돈은 얼마인지 ㉠ 하나의 식으로 나타내고 ㉡ 남은 돈을 구해 보세요.")
        w.why("산 물건값을 ( )로 묶어야 하는 까닭을 써 보세요.", 1)
        ans += " ⑥ %s, 왜: (예: 필통값과 색연필값을 모두 5000원에서 빼야 해서 합을 먼저 구해요)" % a6
    return ans


# ================================================================ 이야기 버전
SNACK = [("생수", 6, "병", 3000, "원"), ("주스", 4, "병", 3600, "원"), ("귤", 10, "개", 3000, "원"), ("바나나", 5, "개", 2500, "원"),
         ("과자", 3, "봉지", 4500, "원"), ("주먹밥", 2, "개", 3000, "원"), ("김밥", 1, "줄", 3500, "원"), ("젤리", 8, "개", 4000, "원"),
         ("물티슈", 1, "개", 1200, "원"), ("쿠키", 12, "개", 3600, "원")]
FIX = {"생수": 4, "주먹밥": 4, "귤": 4, "과자": 2}


def st_l1(w, D):
    w.lesson(1, "개념 찾기(S)", "현장 체험 학습 계획단이 모였어요", "체험 학습을 계획할 때 여러 가지 계산이 섞인 식은 어떤 순서로 계산해야 할까요?",
             "솔빛초등학교 5학년 3반은 ‘별빛 과학관’으로 현장 체험 학습을 가요. 반장 지우와 도윤, 서하, 민준, 하린이가 ‘체험 학습 계획단’이 되었어요.")
    w.step("① 만져 보기", "보기·생각하기·궁금해하기")
    w.labeled([("준비 쪽지", "우리 반 26명과 선생님 2명이 45인승 버스 1대를 타요. / 모둠은 4명씩, 모둠마다 체험 활동지를 3장씩 받아요. / "
                "4D 영상관 표: 학생 1000원, 어른 2000원, 할인 쿠폰 3000원 / 간식 초콜릿 36개를 버스 앞쪽·뒤쪽 바구니에 똑같이 나누어 넣어요. / "
                "모둠 간식비는 15000원, 남는 돈은 거스름돈으로 돌려받아요.")], label_mm=26)
    if D:
        w.labeled([("보여요", ""), ("생각해요", ""), ("궁금해요", "")], label_mm=30, row_h=4300)
    else:
        w.labeled([("보여요", "쪽지에 (                                        )이 보여요."),
                   ("생각해요", "(                    )을 구하려면 (                    )해야 할 것 같아요."),
                   ("궁금해요", "(                                        )은 어떻게 계산할까?")], label_mm=30, row_h=4300)
    w.step("② 그려 보기", "버스 빈자리")
    w.pic(bus_fig(45, [("학생", 26, '#8DB8E8'), ("선생님", 2, '#F3A6B5')]), 130, 45)
    w.text("파란 자리는 학생 26명, 분홍 자리는 선생님 2명이 앉은 자리예요.")
    w.ask("버스에 탄 사람은 모두 몇 명인가요? 26 + 2 =")
    w.ask("빈자리는 몇 개인가요? 45 − 28 =")
    w.step("③ 말해 보기", "도윤이의 식: 45 − 26 + 2 = 19 + 2 = 21")
    four = ['45−26+2', '45−(26+2)', '45−26−2', '(45−26)+2']
    w.choices([(calc(e)['e'], '( 바른 식 / 틀린 식 )') for e in four])
    good = [calc(e)['v'] == 17 for e in four]
    assert good == [False, True, True, False]
    a3 = why1(w, D, "45 − 26 + 2와 45 − (26 + 2)의 계산 결과가 다른 까닭을 써 보세요.",
              "45 − 26 + 2는 (          )을 먼저, 45 − (26 + 2)는 (          )을 먼저 계산해서 결과가 달라요.",
              "45 − 26 + 2는 45 − 26을 먼저 계산하고, 45 − (26 + 2)는 ( ) 안의 26 + 2를 먼저 계산해서 21과 17로 달라져요")
    w.step("④ 말해 보기", "생활 속 혼합 계산")
    a4 = write2(w, D, [("두 가지 이상의 계산이 섞여 있던 생활 속 상황을 써 보세요.", "(          )원짜리 (          ) (     )개를 사고 (          )원을 냈어요.",
                        "800원짜리 우유 3개를 사고 5000원을 내서 5000 − 800 × 3 = 2600, 거스름돈 2600원을 받았어요"),
                       ("그 상황을 계산할 때 무엇을 먼저 계산했나요?", "(                    )을 먼저 구해야 (                    )을 알 수 있어서 먼저 계산했어요.",
                        "우유 3개의 값 800 × 3을 먼저 구해야 낸 돈에서 뺄 수 있어서 곱셈을 먼저 계산했어요")])
    w.step("⑤ 확인하기", "배운 계산 떠올리기")
    qs = ['375+468', '704−359', '236×24', '672÷24']
    for e in qs:
        w.ask(calc(e)['e'] + ' =')
    ans = "1차시  ① (학생마다 다름) ② 28명, 17개 ③ 바른 식: 45 − (26 + 2), 45 − 26 − 2 / %s ④ %s ⑤ %s" % (a3, a4, ', '.join(str(calc(e)['v']) for e in qs))
    if D:
        w.step("⑥ 도전하기", "버스 2대의 빈자리")
        a6 = build_block(w, D, '45×2−(26+27+4)', '개', '빈자리는',
                         prompt="옆 반도 함께 가기로 해서 45인승 버스 2대를 빌렸어요. 우리 반 학생 26명, 옆 반 학생 27명, 선생님 4명이 탄다면 빈자리는 몇 개인지 하나의 식으로 나타내어 구해 보세요.")
        w.why("26 + 27 + 4를 ( )로 묶는 까닭을 써 보세요.", 1)
        ans += " ⑥ %s, 왜: (예: 탄 사람 수를 모두 더해 한꺼번에 빼야 해서요)" % a6
    return ans


def st_l2(w, D):
    w.lesson(2, "개념 구축하기(O)", "체험 학습에 가는 사람 수 ― 덧셈과 뺄셈", "덧셈과 뺄셈이 섞여 있는 식은 어떤 순서로 계산할까요?",
             "우리 반 남학생은 14명인데 그중 2명이 가족 행사로 체험 학습에 가지 못해요. 여학생 12명은 모두 가요.")
    w.step("① 만져 보기", "참가하는 학생 수")
    w.pic(dots_fig([dict(label="남학생 14명", n=14, color='#8DB8E8', cross=2, note="2명 못 가요"), dict(label="여학생 12명", n=12, color='#F3A6B5', note="모두 가요")], per=14), 150, 40)
    r1 = why1(w, D, "먼저 예상해요: 덧셈과 뺄셈이 섞여 있는 식은 어떤 순서로 계산할까요?", "내 규칙: 덧셈과 뺄셈이 섞여 있으면 (                    ) 계산해요.",
              "덧셈과 뺄셈이 섞여 있는 식은 앞에서부터 차례대로 계산해요")
    a1 = build_block(w, D, '14−2+12', '명', '체험 학습에 가는 학생은 모두', cards=[14, 2, 12], asks=[("체험 학습에 가는 남학생은? 14 − 2 =", '14−2')])
    w.step("② 그려 보기", "( )가 있는 식")
    w.text("버스 짐칸에 생수 40병을 실었어요. 가는 길에 1모둠이 9병, 2모둠이 7병을 꺼내 갔어요. 꺼내 간 생수 수를 ( )로 묶어 하나의 식으로 나타내 보세요.")
    a2 = build_block(w, D, '40−(9+7)', '병', '짐칸에 남은 생수는', cards=[40, 9, 7], note='( )', asks=[("두 모둠이 꺼내 간 생수는 모두? 9 + 7 =", '9+7')])
    w.step("③ 말해 보기", "서하가 쓴 두 식 비교하기")
    a3 = order_block(w, D, ['50−18+6', '50−(18+6)'], labels=['가', '나'])
    a3w = why1(w, D, "두 식의 계산 결과가 다른 까닭을 써 보세요.", "가는 (               )부터, 나는 ( ) 안의 (               )부터 계산해서 결과가 달라요.",
               "가는 앞에서부터 50 − 18을 먼저, 나는 ( ) 안의 18 + 6을 먼저 계산해서 38과 26으로 달라요")
    w.step("④ 약속하기")
    a4 = blanks_block(w, D, ["덧셈과 뺄셈이 섞여 있는 식은 ", (["앞에서부터 차례대로", "덧셈을 먼저", "뒤에서부터 차례대로"], 0), " 계산해요. ( )가 있는 식은 ",
                             (["( ) 안", "( ) 밖"], 0), "을 먼저 계산해요."])
    w.step("⑤ 확인하기", "먼저 계산할 곳, 계산 결과 잇기")
    a5 = first_block(w, ['52−19+7', '52−(19+7)'])
    lk = link_block(w, ["27 + 16 − 9", "61 − (25 + 18)", "45 − 17 + 12"], ["18", "40", "34"], [2, 0, 1], "식", "계산 결과")
    assert [calc(e)['v'] for e in ['27+16−9', '61−(25+18)', '45−17+12']] == [34, 18, 40]
    ans = "2차시  ① %s, %s ② %s ③ %s, %s ④ %s ⑤ %s, %s" % (r1, a1, a2, a3, a3w, a4, a5, lk)
    if D:
        w.step("⑥ 도전하기", "과학관에서 공원까지")
        w.pic(road_fig([(0, "정류장"), (360, "과학관"), (620, "공원"), (900, "식당")], [(0, 900, "900 m", True), (0, 620, "620 m", True), (360, 900, "540 m", False)]), 150, 45)
        a6 = build_block(w, D, '620+540−900', ' m', '과학관에서 공원까지의 거리는', prompt="그림을 보고 과학관에서 공원까지의 거리를 하나의 식으로 나타내어 구해 보세요.")
        w.why("620과 540을 더한 다음 900을 빼는 까닭을 써 보세요.", 1)
        ans += " ⑥ %s, 왜: (예: 두 거리를 더하면 과학관~공원 부분이 두 번 들어가서 정류장~식당 거리를 빼요)" % a6
    return ans


def st_l3(w, D):
    w.lesson(3, "개념 구축하기(O)", "모둠을 나누고 활동지를 나누어요 ― 곱셈과 나눗셈", "곱셈과 나눗셈이 섞여 있는 식은 어떤 순서로 계산할까요?",
             "체험 학습에 가는 학생 24명이 4명씩 모둠을 만들어요. 과학관에서 모둠마다 체험 활동지를 3장씩 받아요.")
    w.step("① 만져 보기", "필요한 활동지 수")
    w.pic(dots_fig([dict(label="가는 학생 24명", n=24, color='#B9D7A8', group=4, note="4명씩 모둠", per=24)]), 150, 24)
    a1 = build_block(w, D, '24÷4×3', '장', '필요한 활동지는', cards=[24, 4, 3], asks=[("모둠은 몇 개인가요? 24 ÷ 4 =", '24÷4')])
    w.step("② 그려 보기", "( )가 있는 식")
    w.text("민준이는 자석 96개를 꾸러미로 나누려고 해요. 꾸러미 하나에 자석을 4개씩 3줄로 담아요. 꾸러미 하나에 담을 자석 수를 ( )로 묶어 하나의 식으로 나타내 보세요.")
    w.pic(dots_fig([dict(label="꾸러미 하나: 4개씩 3줄", n=12, color='#7AA7D9', per=4)]), 80, 30)
    a2 = build_block(w, D, '96÷(4×3)', '개', '꾸러미는', cards=[96, 4, 3], note='( )', asks=[("꾸러미 하나에 담을 자석은? 4 × 3 =", '4×3')])
    a2w = why1(w, D, "96 ÷ 4 × 3과 96 ÷ (4 × 3)의 계산 결과가 다른 까닭을 써 보세요.", "앞의 식은 (          )을 먼저, 뒤의 식은 ( ) 안의 (          )을 먼저 계산해서 (     )과 (     )로 달라요.",
               "96 ÷ 4 × 3은 96 ÷ 4 = 24를 먼저 계산해서 %d, 96 ÷ (4 × 3)은 4 × 3 = 12를 먼저 계산해서 %d이 돼요" % (calc('96÷4×3')['v'], calc('96÷(4×3)')['v']))
    w.step("③ 말해 보기", "옳게 계산한 사람 찾기")
    w.labeled([("서하", "36 ÷ 3 × 2 = 12 × 2 = 24"), ("민준", "36 ÷ (3 × 2) = 12 × 2 = 24")], row_h=3000)
    w.pick("옳게 계산한 사람은?", ["서하", "민준", "둘 다"])
    w.pick("민준이가 잘못 계산한 까닭은?", ["( )가 있는 식은 ( ) 안을 먼저 계산해야 하는데 36 ÷ 3을 먼저 계산했어요.", "곱셈을 나눗셈보다 먼저 계산해야 하는데 나눗셈을 먼저 했어요.", "36 ÷ 3을 잘못 계산했어요."])
    a3 = order_block(w, D, ['36÷(3×2)'], title="민준이의 식을 바르게 계산해 보세요.")
    w.step("④ 약속하기")
    a4 = blanks_block(w, D, ["곱셈과 나눗셈이 섞여 있는 식은 ", (["앞에서부터 차례대로", "곱셈을 먼저", "나눗셈을 먼저"], 0), " 계산해요. ( )가 있는 식은 ",
                             (["( ) 안", "( ) 밖"], 0), "을 먼저 계산해요."])
    w.step("⑤ 확인하기", "계산하고 가장 작은 식 만들기")
    a5 = order_block(w, D, ['54÷6×4', '120÷(4×5)'])
    w.text("○ 안에 ×, ÷를 한 번씩 써넣어 계산 결과가 더 작은 식을 만들어 보세요.")
    w.fill("96 ○ (8 ○ 2)   →   96 (    ) (8 (    ) 2) = (        )")
    o5 = min(ops_all('96○(8○2)', '×÷', once=True), key=lambda x: x[1])
    assert o5 == ('96 ÷ (8 × 2)', 6)
    ans = "3차시  ① %s ② %s, %s ③ ①, ①, %s ④ %s ⑤ %s, %s = %d" % (a1, a2, a2w, a3, a4, a5, o5[0], o5[1])
    if D:
        w.step("⑥ 도전하기", "기념품 나누기, ○ 안 기호")
        a6 = build_block(w, D, '6×5÷3', '개', '한 모둠에',
                         prompt="선생님이 한 상자에 6개씩 든 열쇠고리 5상자를 사서 3모둠에 똑같이 나누어 주려고 해요. 한 모둠에 몇 개씩 줄 수 있는지 하나의 식으로 나타내 보세요.")
        w.fill("18 (    ) 6 (    ) 4 = 12     (×, ÷를 한 번씩)")
        g = [e for e, v in ops_all('18○6○4', '×÷', once=True) if v == 12]
        assert g == ['18 ÷ 6 × 4']
        w.why("6 × 5를 먼저 계산해도 되는 까닭을 써 보세요.", 1)
        ans += " ⑥ %s, %s, 왜: (예: 곱셈과 나눗셈은 앞에서부터 차례대로 계산하는데 6 × 5가 앞에 있어요)" % (a6, g[0])
    return ans


def st_l4(w, D):
    w.lesson(4, "개념 구축하기(O)", "4D 영상관 표값을 계산해요 ― 덧셈, 뺄셈, 곱셈", "덧셈, 뺄셈, 곱셈이 섞여 있는 식은 어떤 순서로 계산할까요?",
             "과학관 4D 영상관 표는 어른 1장에 2000원, 학생 1장에 1000원이에요. 할인 쿠폰 3000원이 있어요.")
    w.step("① 만져 보기", "영상관 표값")
    w.table([["어른 표 1장", "학생 표 1장", "할인 쿠폰"], ["2000원", "1000원", "3000원"]])
    r1 = why1(w, D, "먼저 예상해요: 덧셈, 뺄셈, 곱셈이 섞여 있는 식에서는 무엇을 먼저 계산할까요?", "내 규칙: (          )을 먼저 계산하고, 덧셈과 뺄셈은 (                    ) 계산해요.",
              "곱셈을 먼저 계산하고, 덧셈과 뺄셈은 앞에서부터 차례대로 계산해요")
    a1 = build_block(w, D, '2000+1000×24−3000', '원', '내야 할 돈은', cards=[2000, 1000, 24, 3000],
                     asks=[("학생 표 24장의 값은? 1000 × 24 =", '1000×24'), ("쿠폰을 쓰기 전 표값은 모두? 2000 + 1000 × 24 =", '2000+1000×24')],
                     prompt="선생님 표 1장과 학생 표 24장을 사고 할인 쿠폰 3000원을 쓰면 내야 할 돈은 얼마인지 2000부터 써서 하나의 식으로 나타내 보세요.")
    w.step("② 그려 보기", "하린이의 두 식 비교하기")
    a2 = order_block(w, D, ['40−3×5+7', '40−3×(5+7)'], labels=['가', '나'])
    a2w = why1(w, D, "나에서 ( ) 때문에 계산 순서가 어떻게 달라졌나요?", "가는 곱셈 (          )을 먼저 했지만, 나는 ( ) 안의 (          )을 가장 먼저 했어요.",
               "가는 곱셈 3 × 5를 먼저 했지만, 나는 ( ) 안의 5 + 7을 곱셈보다도 먼저 계산했어요")
    w.step("③ 말해 보기", "계산 순서 나타내기")
    a3 = order_block(w, D, ['26+4×7−9', '50−(6+3)×4'])
    w.step("④ 약속하기")
    a4 = blanks_block(w, D, ["덧셈, 뺄셈, 곱셈이 섞여 있는 식은 ", (["곱셈", "덧셈", "뺄셈"], 0), "을 먼저 계산해요. 덧셈과 뺄셈은 ",
                             (["앞에서부터 차례대로", "뒤에서부터 차례대로"], 0), " 계산하고, ( )가 있으면 ", (["( ) 안", "곱셈"], 0), "을 가장 먼저 계산해요."])
    w.step("⑤ 확인하기", "버스 간식 젤리")
    w.ask("48 − 3 × (6 + 8) =")
    a5 = build_block(w, D, '80−(4+5)×3', '개', '남은 젤리는', cards=[80, 4, 5, 3], note='( )',
                     prompt="버스 간식 젤리가 80개 있었어요. 1모둠 학생 4명과 2모둠 학생 5명이 한 명당 3개씩 먹었다면 남은 젤리는 몇 개인지 하나의 식으로 나타내 보세요.")
    ans = "4차시  ① %s, %s ② %s, %s ③ %s ④ %s ⑤ %d, %s" % (r1, a1, a2, a2w, a3, a4, calc('48−3×(6+8)')['v'], a5)
    if D:
        w.step("⑥ 도전하기", "40보다 작은 식, 기념품 수")
        w.choices([("5 + 4 × 9 − 3", "( 40보다 작아요 / 40보다 커요 )"), ("4 × (12 − 3) + 6", "( 40보다 작아요 / 40보다 커요 )")])
        v1, v2 = calc('5+4×9−3')['v'], calc('4×(12−3)+6')['v']
        assert v1 < 40 < v2
        a6 = build_block(w, D, '(12+8)×2−5', '개', '지우가 산 기념품은',
                         prompt="도윤이는 열쇠고리 12개와 자석 8개를 샀고, 지우는 도윤이가 산 기념품 수의 2배보다 5개 더 적게 샀어요. 지우가 산 기념품은 몇 개인지 하나의 식으로 나타내 보세요.")
        w.why("12 + 8 × 2 − 5로 쓰면 안 되는 까닭을 써 보세요.", 1)
        ans += " ⑥ 작아요(%d), 커요(%d), %s, 왜: (예: 12 + 8 × 2 − 5는 자석만 2배 한 셈이라 %d이 돼요)" % (v1, v2, a6, calc('12+8×2−5')['v'])
    return ans


def st_l5(w, D):
    w.lesson(5, "개념 구축하기(O)", "버스 간식을 나누어요 ― 덧셈, 뺄셈, 나눗셈", "덧셈, 뺄셈, 나눗셈이 섞여 있는 식은 어떤 순서로 계산할까요?",
             "버스 앞쪽 간식 바구니에 초콜릿이 5개 있었어요. 초콜릿 36개를 더 사서 앞쪽 바구니와 뒤쪽 바구니에 똑같이 나누어 넣었어요.")
    w.step("① 만져 보기", "앞쪽 바구니의 초콜릿")
    w.pic(dots_fig([dict(label="앞쪽 바구니", n=5, color='#C98B5B', note="처음 5개"), dict(label="더 산 초콜릿", n=36, color='#E3B98F', group=18, note="두 바구니에 똑같이")], per=36, shape='r'), 175, 30)
    a1 = build_block(w, D, '5+36÷2−9', '개', '앞쪽 바구니에 남은 초콜릿은', cards=[5, 36, 2, 9],
                     asks=[("앞쪽 바구니에 더 넣은 초콜릿은? 36 ÷ 2 =", '36÷2'), ("더 넣은 뒤 앞쪽 바구니의 초콜릿은? 5 + 36 ÷ 2 =", '5+36÷2')],
                     prompt="그 뒤 앞쪽에 앉은 친구들이 9개를 먹었다면 앞쪽 바구니에 남은 초콜릿은 몇 개인지 하나의 식으로 나타내어 구해 보세요.")
    w.step("② 그려 보기", "두 식 비교하기")
    a2 = order_block(w, D, ['52−36÷4+5', '(52−36)÷4+5'], labels=['가', '나'])
    a2w = why1(w, D, "가에서 52 − 36을 먼저 계산하면 안 되는 까닭을 써 보세요.", "가에는 ( )가 없으므로 (                    )을 먼저 계산해야 해요.",
               "가에는 ( )가 없으므로 나눗셈 36 ÷ 4를 먼저 계산해야 해요")
    w.step("③ 말해 보기", "계산 순서 나타내기")
    a3 = order_block(w, D, ['7−18÷6+25', '4+96÷(20−8)'])
    w.step("④ 약속하기")
    a4 = blanks_block(w, D, ["덧셈, 뺄셈, 나눗셈이 섞여 있는 식은 ", (["나눗셈", "덧셈", "뺄셈"], 0), "을 먼저 계산해요. 덧셈과 뺄셈은 ",
                             (["앞에서부터 차례대로", "뒤에서부터 차례대로"], 0), " 계산하고, ( )가 있으면 ", (["( ) 안", "나눗셈"], 0), "을 가장 먼저 계산해요."])
    w.step("⑤ 확인하기", "문장 순서로 문제 만들기")
    cards = [("㉡", '+', 6), ("㉢", '/', 3), ("㉣", '-', 12)]
    w.labeled([("㉠", "스티커 30장이 있습니다."), ("㉡", "스티커 6장을 더 받았습니다."), ("㉢", "3모둠이 똑같이 나누어 가졌습니다."),
               ("㉣", "스티커 12장을 버스 창문 꾸미기에 썼습니다.")], label_mm=16, row_h=2900)
    w.text("㉠ 뒤에 올 문장의 순서를 정하고, ‘한 모둠이 지금 가지고 있는 스티커는 몇 장일까요?’를 붙여 문제를 만들어요.")
    w.fill(['순서:  ㉠ → (     ) → (     ) → (     )', '하나의 식:  (                                                 )', '답:  (          )장'])
    st = story_all(30, cards)
    ans = "5차시  ① %s ② %s, %s ③ %s ④ %s ⑤ (예) %s" % (a1, a2, a2w, a3, a4, ' / '.join('%s: %s = %s장' % s for s in st))
    if D:
        w.step("⑥ 도전하기", "( ) 넣기, 무게 비교")
        w.fill("28 − 16 ÷ 4 + 5 = 8이 되도록 ( )를 넣어 보세요.   (                                    )")
        p6 = paren_all('28−16÷4+5', 8)
        assert p6 == ['(28 − 16) ÷ 4 + 5'], p6
        w.table([["물통 1개", "도시락 2개", "과일 컵 1개"], ["350 g", "800 g", "150 g"]])
        a6 = build_block(w, D, '350+800÷2−150', ' g', '더 무거운 무게는', prompt="물통 1개와 도시락 1개의 무게의 합은 과일 컵 1개의 무게보다 몇 g 더 무거운지 하나의 식으로 나타내 보세요.")
        w.why("800을 2로 나누어야 하는 까닭을 써 보세요.", 1)
        ans += " ⑥ %s, %s, 왜: (예: 800 g은 도시락 2개의 무게라서 1개의 무게를 구하려면 2로 나누어요)" % (p6[0], a6)
    return ans


def st_l6(w, D):
    w.lesson(6, "개념 구축하기(O)", "모둠 가방과 거스름돈 ― 덧셈, 뺄셈, 곱셈, 나눗셈", "덧셈, 뺄셈, 곱셈, 나눗셈이 섞여 있는 식은 어떤 순서로 계산할까요?",
             "모둠 가방 6개에 주스를 각각 3개씩 2줄로 넣었어요. 쿠키 50개 중에서 부서진 2개를 빼고 모둠 가방 6개에 똑같이 나누어 넣으려고 해요.")
    w.step("① 만져 보기", "모둠 가방 한 개의 간식 수")
    w.pic(dots_fig([dict(label="가방 하나의 주스", n=6, color='#F4B860', group=3, note="3개씩 2줄", per=6, shape='r'), dict(label="쿠키 50개", n=50, color='#C98B5B', cross=2, note="부서진 쿠키 2개", per=25)]), 170, 40)
    r1 = why1(w, D, "먼저 예상해요: 네 가지 계산과 ( )가 모두 섞여 있으면 어떤 순서로 계산할까요?", "내 규칙: ( ) 안 → (                    ) → (                    )",
              "( ) 안을 가장 먼저, 그다음 곱셈과 나눗셈, 마지막에 덧셈과 뺄셈을 앞에서부터 차례대로 계산해요")
    a1 = build_block(w, D, '3×2+(50−2)÷6', '개', '모둠 가방 한 개에 든 간식은 모두', cards=[3, 2, 50, 2, 6], note='( )',
                     asks=[("가방 한 개의 주스는? 3 × 2 =", '3×2'), ("가방 한 개의 쿠키는? (50 − 2) ÷ 6 =", '(50−2)÷6')])
    w.step("② 그려 보기", "계산 순서 나타내기")
    a2 = order_block(w, D, ['8+4×6−9÷3', '40−(3+5)÷2×6'])
    w.step("③ 말해 보기", "틀린 곳 찾기")
    w.labeled([("도윤", "70 + 20 ÷ 2 − 10 = 90 ÷ 2 − 10 = 45 − 10 = 35"), ("서하", "30 − (2 + 3) × 4 + 5 = 30 − 5 × 9 → 계산할 수 없어요.")], row_h=3000)
    w.ask("도윤이의 식을 바르게 계산한 값은?")
    w.ask("서하의 식을 바르게 계산한 값은?")
    a3w = why1(w, D, "도윤이에게 무엇을 고치면 좋을지 알려 주세요.", "도윤아, 70 + 20보다 (               )을 먼저 계산해야 해. 그러면 (       )이 돼.",
               "도윤아, 덧셈보다 나눗셈 20 ÷ 2를 먼저 계산해야 해. 그러면 70 + 10 − 10 = 70이 돼")
    w.step("④ 약속하기")
    a4 = blanks_block(w, D, ["덧셈, 뺄셈, 곱셈, 나눗셈이 섞여 있는 식은 ", (["곱셈과 나눗셈", "덧셈과 뺄셈"], 0), "을 먼저 계산해요. 같은 단계끼리는 ",
                             (["앞에서부터 차례대로", "뒤에서부터 차례대로"], 0), " 계산하고, ( )가 있으면 ", (["( ) 안", "곱셈"], 0), "을 가장 먼저 계산해요."])
    w.step("⑤ 확인하기", "조건을 골라 거스름돈 구하기")
    w.table([["김밥 1줄", "주먹밥 1개", "음료 3병", "요구르트 4개"], ["3000원", "1500원", "2700원", "2000원"]])
    w.text("1모둠은 ( 김밥 1줄 / 주먹밥 1개 )와 ( 음료 / 요구르트 ) 2개를 사고 10000원을 냈어요. 조건에 ○표 하고, 받아야 하는 거스름돈을 하나의 식으로 나타내어 구해 보세요.")
    w.fill(['하나의 식:  (                                                        )', '거스름돈  (            )원'])
    shop = []
    for n1, p1 in (("김밥", 3000), ("주먹밥", 1500)):
        for n2, p2, k in (("음료", 2700, 3), ("요구르트", 2000, 4)):
            e = '10000−(%d+%d÷%d×2)' % (p1, p2, k)
            shop.append('%s·%s %s = %d원' % (n1, n2, calc(e)['e'], calc(e)['v']))
    ans = "6차시  ① %s, %s ② %s ③ %d, %d, %s ④ %s ⑤ %s" % (r1, a1, a2, calc('70+20÷2−10')['v'], calc('30−(2+3)×4+5')['v'], a3w, a4, ' / '.join(shop))
    if D:
        w.step("⑥ 도전하기", "가장 작은 식, 결과가 다른 식")
        w.fill("4, 7, 2를 □ 안에 한 번씩 넣어 결과가 가장 작은 식:   □ × (□ + □) − 36 ÷ 9  →  (                              ) = (        )")
        sl = min(slots_all('□×(□+□)−36÷9', [4, 7, 2]), key=lambda x: x[1])
        three = ['20+5×(25−9)÷8', '4+27÷9×(32−23)', '33+2×3÷6−4']
        w.pick("계산 결과가 다른 하나는?", [calc(e)['e'] for e in three])
        vals = [calc(e)['v'] for e in three]
        assert vals[0] == vals[2] != vals[1]
        w.why("곱하는 수로 어떤 수를 골랐는지 까닭을 써 보세요.", 1)
        ans += " ⑥ %s = %d(2 × (7 + 4)도 됨), ②(%d, 나머지 %d), 왜: (예: 곱하는 수가 작을수록 결과가 작아서 가장 작은 2를 골랐어요)" % (sl[0], sl[1], vals[1], vals[0])
    return ans


def st_l7(w, D):
    w.lesson(7, "탐구 정리하기(O)", "계획단 회의 ― 계산 순서를 정리해요", "혼합 계산의 계산 순서를 한눈에 정리하고, 실수를 바로잡을 수 있나요?",
             "지우가 회의 칠판에 식 네 개를 썼어요. 계획단이 혼합 계산의 순서를 정리하고 친구들의 실수를 바로잡아요.")
    w.step("① 만져 보기", "가장 먼저 계산할 곳")
    a1 = first_block(w, ['29+8×4−14', '46÷(28−5)+16', '60−24÷6×2', '35−12+8'])
    w.step("② 그려 보기", "계산 순서 정리하기")
    a2 = seq_order(w, ["㉮ 덧셈과 뺄셈을 앞에서부터 차례대로 계산해요.", "㉯ ( ) 안을 계산해요.", "㉰ 곱셈과 나눗셈을 앞에서부터 차례대로 계산해요."], [1, 2, 0])
    a2w = why1(w, D, "곱셈을 덧셈보다 먼저 계산하는 까닭을 표값 문제(2000 + 1000 × 24)로 설명해 보세요.",
               "1000 × 24는 (                    )의 값이라서 먼저 구해야 하고, 2000 + 1000을 먼저 하면 (                    ).",
               "1000 × 24는 학생 표 24장의 값이라서 먼저 구해야 하고, 2000 + 1000을 먼저 하면 선생님 표값까지 24번 세게 돼요")
    w.step("③ 말해 보기", "친구의 실수 바로잡기")
    w.labeled([("민준", "47 − 7 × 5 = 40 × 5 = 200"), ("하린", "23 − 2 + 8 = 23 − 10 = 13"), ("서하", "18 ÷ (3 × 2) = 18 ÷ 3 = 6")], row_h=2900)
    for n in ("민준이", "하린이", "서하"):
        w.ask("%s의 식을 바르게 계산한 값은?" % n)
    fix = [calc(e)['v'] for e in ['47−7×5', '23−2+8', '18÷(3×2)']]
    a3 = write2(w, D, [("혼합 계산을 할 때 조심할 점을 친구들에게 알려 주세요.", "(                    )하지 말고, 계산하기 전에 (                    )을 먼저 표시하면 좋아요.",
                        "계산하기 쉬운 수끼리 먼저 계산하거나 앞에서부터만 계산하지 말고, 계산 순서대로 번호를 먼저 표시하면 실수가 줄어요")])
    w.step("④ 약속하기")
    a4 = blanks_block(w, D, ["혼합 계산은 ", (["( ) 안", "곱셈과 나눗셈", "덧셈과 뺄셈"], 0), "을 가장 먼저 계산하고, 그다음 ", (["곱셈과 나눗셈", "덧셈과 뺄셈"], 0),
                             ", 마지막으로 ", (["덧셈과 뺄셈", "곱셈과 나눗셈"], 0), "을 계산해요. 같은 단계끼리는 ", (["앞에서부터 차례대로", "계산하기 쉬운 것부터"], 0), " 계산해요."])
    w.step("⑤ 확인하기", "( )를 넣어 목표 수 만들기")
    w.fill(["6 × 8 − 2 + 4 = 40   →   (                                    )", "15 + 9 − 6 ÷ 3 = 16   →   (                                    )"])
    p1, p2 = paren_all('6×8−2+4', 40), paren_all('15+9−6÷3', 16)
    assert p1 == ['6 × (8 − 2) + 4'] and p2 == ['15 + (9 − 6) ÷ 3'], (p1, p2)
    ans = "7차시  ① %s ② %s(㉯ → ㉰ → ㉮), %s ③ %d, %d, %d, %s ④ %s ⑤ %s, %s" % (a1, a2, a2w, fix[0], fix[1], fix[2], a3, a4, p1[0], p2[0])
    if D:
        w.step("⑥ 도전하기", "○ 안에 +, −, ×, ÷ 넣기(같은 기호를 여러 번 써도 돼요)")
        w.fill("12 (    ) 4 (    ) 2 (    ) 3 = 9")
        sols = [e for e, v in ops_all('12○4○2○3', '+−×÷') if v == 9]
        assert sols
        w.why("내가 만든 식이 9가 되는지 계산 순서대로 써서 확인해 보세요.", 1)
        ans += " ⑥ (예: %s)" % ', '.join(calc(e)['chain'] for e in sols)
    return ans


def st_l8(w, D):
    w.lesson(8, "발표하기(P)", "모둠 간식 바구니를 꾸려요 ― 예산 안에서", "모둠 간식비 15000원 안에서 간식 바구니를 꾸리고, 값을 하나의 식으로 구할 수 있나요?",
             "모둠 간식비는 15000원이에요. 과학관 매점 가격표를 보고 4명이 먹을 간식 바구니를 꾸려요.")
    w.step("① 만져 보기", "1모둠 바구니")
    items_table(w, SNACK, ('물건', '묶음', '값'))
    w.text("예: 생수 4병의 값  3000 ÷ 6 × 4 = 2000 (원)")
    rows, a1, tot = bag_rows(SNACK, FIX)
    assert tot == 12200
    w.table([["산 물건", "하나의 식", "값(원)"]] + rows, col_mm=[40, 100, 40], row_h=2900)
    w.ask("1모둠 바구니 값은 모두 얼마인가요?")
    w.ask("15000원에서 남는 돈은 얼마인가요?")
    w.step("② 그려 보기", "거스름돈을 하나의 식으로")
    a2 = build_block(w, D, '10000−(3000÷6×4+4500÷3×2)', '원', '거스름돈은', cards=[10000, 3000, 6, 4, 4500, 3, 2], note='( )',
                     prompt="2모둠은 생수 4병과 과자 2봉지만 사고 10000원을 냈어요. 받아야 하는 거스름돈을 하나의 식으로 나타내어 구해 보세요.")
    w.step("③ 만들기", "우리 모둠 바구니(15000원을 넘으면 바꿔요)")
    w.table([["산 물건", "하나의 식", "값(원)"]] + [['', '', '']] * 4 + [["합계", "", ""]], col_mm=[40, 100, 40], row_h=2900)
    w.step("④ 말해 보기", "바구니 발표")
    a4 = write2(w, D, [("무엇을 골랐고, 왜 골랐는지 써 보세요.", "우리 모둠은 (                              )을 골랐어요. 4명이 (                    )하려고요.",
                        "생수 4병, 주먹밥 4개, 귤 4개를 골랐어요. 4명이 한 개씩 똑같이 먹고 마실 수 있게 하려고요"),
                       ("값을 구한 식 하나와 계산 순서를 설명해 보세요.", "(          )의 값은 (                    ) = (          )원이에요. (          )을 먼저 계산했어요.",
                        "주먹밥 4개의 값은 3000 ÷ 2 × 4 = 6000원이에요. 1개의 값을 먼저 구하려고 3000 ÷ 2를 먼저 계산했어요")])
    ans = "8차시  ① %s, 모두 %d원, %d원 ② %s ③ (학생마다 다름) ④ %s" % ('; '.join(a1), tot, 15000 - tot, a2, a4)
    if D:
        w.step("⑥ 도전하기", "1모둠 바구니 값 12200원")
        w.ask("1모둠 4명이 바구니 값을 똑같이 나누어 내면 한 명이 낼 돈은? (2000 + 6000 + 1200 + 3000) ÷ 4 =")
        e = '(2000+6000+1200+3000)÷4'
        assert calc(e)['v'] == tot // 4
        w.ask("남는 돈으로 귤(1개 300원)을 더 산다면 최대 몇 개 살 수 있나요?")
        k = (15000 - tot) // 300
        w.why("2000 + 6000 + 1200 + 3000 ÷ 4로 쓰면 안 되는 까닭을 써 보세요.", 1)
        ans += " ⑥ %d원, %d개(300 × %d = %d), 왜: (예: ( ) 없이 쓰면 3000만 4로 나누어 %d이 돼요)" % (calc(e)['v'], k, k, 300 * k, calc('2000+6000+1200+3000÷4')['v'])
    return ans


def st_l9(w, D):
    w.lesson(9, "발표하기(P)", "버스 안 혼합 계산 빙고", "수 카드로 혼합 계산식을 만들어 빙고 놀이를 할 수 있나요?",
             "과학관에 가는 버스 안에서 혼합 계산 빙고를 해요. 놀이판에는 1부터 25까지의 수 중 16개를 써요.")
    w.step("① 규칙 알기")
    w.pick("뒤집은 카드가 4, 6, 2예요. 규칙에 맞는 식은?", ["4 + 6 + 2", "4 × 6 ÷ 2", "4 × 6"])
    w.ask("4 × 6 ÷ 2 =")
    w.ask("카드가 7, 5, 8일 때 하린이가 만든 식 7 + 5 − 8 + 5 =")
    w.choices([("친구가 만든 식의 계산 결과가 맞으면?", "( 모두 색칠 / 만든 사람만 색칠 )")])
    w.step("② 놀이판 만들기", "1부터 25까지의 수 중에서 16개를 골라 써요")
    board_table(w)
    w.step("③ 놀이하기", "만든 식과 색칠한 수를 적어요")
    w.table([["번", "뒤집은 수 카드", "내가 만든 식", "계산 결과"]] + [[str(i), '', '', ''] for i in range(1, 5)], col_mm=[14, 46, 90, 30], row_h=2900)
    w.step("④ 말해 보기", "빙고 비법")
    a4 = write2(w, D, [("원하는 수를 만들 때 쓴 비법을 써 보세요.", "큰 수가 필요하면 (          )을, 작은 수가 필요하면 (          )을 쓰고, ( )를 넣어 (                    )했어요.",
                        "큰 수가 필요하면 곱셈을, 작은 수가 필요하면 뺄셈이나 나눗셈을 썼어요. ( )를 넣으면 먼저 계산하는 곳이 바뀌어 결과를 다르게 만들 수 있어요")])
    ans = "9차시  ① ②, %d, %d, 모두 색칠 ②③ (학생마다 다름) ④ %s" % (calc('4×6÷2')['v'], calc('7+5−8+5')['v'], a4)
    if D:
        w.step("⑥ 도전하기", "두 줄 빙고 준비: 카드 4, 6, 2로 여러 수 만들기")
        tg = [2, 5, 14, 20]
        exs = []
        for t in tg:
            e = bingo_make([4, 6, 2], t)
            assert e and calc(e)['v'] == t
            exs.append(e)
        w.fill(['계산 결과가 %d인 식:  (                                    )' % t for t in tg])
        w.why("두 줄을 먼저 색칠하려면 어떤 수를 노리면 좋을지 써 보세요.", 1)
        ans += " ⑥ (예: %s), 왜: (예: 이미 색칠한 줄과 이어지는 칸의 수를 노려요)" % ', '.join('%s = %d' % (e, t) for e, t in zip(exs, tg))
    return ans


def st_l10(w, D):
    w.lesson(10, "발표하기(P)", "체험 학습을 다녀왔어요! 배운 것을 발표해요", "체험 학습을 계획하며 배운 혼합 계산을 친구들에게 설명할 수 있나요?",
             "체험 학습을 무사히 다녀왔어요. 계획단이 체험 학습에서 쓴 식들을 모아 배운 것을 발표해요.")
    w.step("① 만져 보기", "체험 학습 결산 식")
    left = ['8×5−35÷5+13', '17+2×(41−27)÷7', '(30−6)÷4×3']
    vals = [calc(e)['v'] for e in left]
    right = [21, 14, 18, 46]
    assert vals == [46, 21, 18]
    lk = link_block(w, [calc(e)['e'] for e in left], [str(x) for x in right], [right.index(v) for v in vals], "식", "계산 결과")
    w.step("② 그려 보기", "계산 순서 나타내기")
    a2 = order_block(w, D, ['2+4×7−15÷3', '32÷(13−5)×6'])
    w.step("③ 확인하기", "기념품 거스름돈")
    w.table([["배지 1개", "엽서 3장"], ["2500원", "1200원"]])
    a3 = build_block(w, D, '5000−(2500+1200÷3×2)', '원', '남은 돈은', cards=[5000, 2500, 1200, 3, 2], note='( )',
                     prompt="지우가 5000원으로 배지 1개와 엽서 2장을 샀어요. 남은 돈은 얼마인지 하나의 식으로 나타내어 구해 보세요.")
    w.step("④ 말해 보기", "체험 학습 발표")
    a4 = write2(w, D, [("체험 학습 계획에서 하나의 식으로 나타냈던 상황 하나를 발표해 보세요.", "(                    )을 구할 때 (                              )이라는 식을 만들었어요.",
                        "4D 영상관 표값을 구할 때 2000 + 1000 × 24 − 3000 = 23000이라는 식을 만들어 23000원을 구했어요"),
                       ("계산 순서를 지켜야 하는 까닭을 발표해 보세요.", "계산 순서가 다르면 (                    )이 달라지기 때문이에요.",
                        "같은 식이라도 계산 순서가 다르면 결과가 달라지기 때문에 모두 같은 순서를 지켜야 해요")])
    assert calc('2000+1000×24−3000')['v'] == 23000
    w.step("⑤ 되돌아보기", "예전 생각, 지금 생각")
    if D:
        w.labeled([("예전 생각", ""), ("지금 생각", ""), ("왜 바뀌었나", "")], label_mm=34, row_h=4300)
    else:
        w.labeled([("예전 생각", "예전에는 (                                        )라고 생각했어요."),
                   ("지금 생각", "지금은 (                                        )라고 생각해요."),
                   ("왜 바뀌었나", "(                                        )을 해 보고 바뀌었어요.")], label_mm=34, row_h=4300)
    ans = "10차시  ① %s ② %s ③ %s ④ %s ⑤ (예: 예전에는 앞에서부터 계산하면 된다고 생각했지만, 지금은 곱셈과 나눗셈을 먼저 계산해야 한다는 것을 알아요)" % (lk, a2, a3, a4)
    if D:
        w.step("⑥ 도전하기", "( ) 넣기, 가장 큰 식")
        w.fill("18 + 12 ÷ 3 − 2 = 8이 되도록 ( )를 넣어 보세요.   (                                    )")
        p = paren_all('18+12÷3−2', 8)
        assert p == ['(18 + 12) ÷ 3 − 2'], p
        w.fill("48 ○ (6 ○ 2)에 ×, ÷를 한 번씩 넣어 결과가 가장 큰 식:  (                              ) = (        )")
        mx = max(ops_all('48○(6○2)', '×÷', once=True), key=lambda x: x[1])
        assert mx == ('48 × (6 ÷ 2)', 144)
        w.why("결과가 가장 커지도록 기호를 넣은 까닭을 써 보세요.", 1)
        ans += " ⑥ %s, %s = %d, 왜: (예: 나누는 수는 작게, 곱하는 수는 크게 해야 결과가 커져요)" % (p[0], mx[0], mx[1])
    return ans


# ================================================================ 만들기
TB_LESSONS = [tb_l1, tb_l2, tb_l3, tb_l4, tb_l5, tb_l6, tb_l7, tb_l8, tb_l9]
ST_LESSONS = [st_l1, st_l2, st_l3, st_l4, st_l5, st_l6, st_l7, st_l8, st_l9, st_l10]


def build(lessons, unit_label, ver, level, out_dir):
    s = Sheet(unit_label=unit_label, level=level, grade_label='5학년')
    w = W(s)
    D = level == '도전형'
    keys = [fn(w, D) for fn in lessons]
    w.flush()
    s.answers("【교사용】 1. 자연수의 혼합 계산(%s) 활동지 정답 (%s)" % (ver, level), keys,
              note="※ 이 활동지는 앱 u1-mixcalc.html과 차시 번호가 같습니다.")
    os.makedirs(out_dir, exist_ok=True)
    path = os.path.join(out_dir, NAME % level)
    s.save(path)
    probs = check(path)
    print(('OK  ' if not probs else 'ERR ') + os.path.relpath(path, ROOT), probs or '', '쪽 나눔 %d' % sum('pageBreak="1"' in b for b in s.body))
    return probs


def main():
    check_calc()
    bad = []
    for level in ('기본형', '도전형'):
        bad += build(TB_LESSONS, "5-1 수학 1. 자연수의 혼합 계산(교과서 차시)", "교과서 차시", level, OUT_TB)
        bad += build(ST_LESSONS, "5-1 수학 1. 자연수의 혼합 계산(이야기 버전)", "이야기 버전", level, OUT_ST)
    if bad:
        sys.exit(1)


if __name__ == '__main__':
    main()
