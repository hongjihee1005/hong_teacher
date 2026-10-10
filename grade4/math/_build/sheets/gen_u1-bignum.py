# -*- coding: utf-8 -*-
"""4-1 수학 1. 큰 수 — 활동지(HWPX) 4개 만들기

    python3 gen_u1-bignum.py

교과서 차시 버전(_build/units/u1-bignum.tb.js)과 이야기 버전(u1-bignum.st.js)의 차시를 그대로 따라
기본형·도전형을 만듭니다.
  grade4/math/sem1/sheets/1단원_큰수_활동지_{기본형,도전형}.hwpx        (교과서 차시)
  grade4/math/sem1-soop/sheets/1단원_큰수_활동지_{기본형,도전형}.hwpx   (이야기 버전)
그림은 SVG로 그려 임시 폴더에서 PNG로 바꿉니다. 답은 될 수 있는 대로 여기서 계산합니다.
"""
import hashlib
import itertools
import math
import os
import shutil
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from hwpxgen import Sheet, svg_to_png, check  # noqa: E402

MATH = os.path.normpath(os.path.join(HERE, '..', '..'))
UNIT = '1. 큰 수'
FNAME = '1단원_큰수_활동지_%s.hwpx'
NOTE = '※ 이 활동지는 앱 u1-bignum.html과 차시 번호가 같습니다.'
WORK = tempfile.mkdtemp(prefix='u1bignum-')
CIRC = '①②③④⑤⑥⑦⑧'
B = '(            )'
b = '(      )'

# ================================================================ 큰 수 도우미 (앱의 n1Read·n1Mix와 같음)
_D = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구']
_P = ['', '십', '백', '천']
_U = ['', '만', '억', '조']
PLACE = ['일', '십', '백', '천', '만', '십만', '백만', '천만', '억', '십억', '백억', '천억', '조', '십조', '백조', '천조']


def chunks(v):
    s = str(int(v))
    return [int(s[max(0, i - 4):i]) for i in range(len(s), 0, -4)]


def _read4(c):
    r, ds = '', str(c).zfill(4)
    for i, ch in enumerate(ds):
        d, p = int(ch), 3 - i
        if d:
            r += ('' if d == 1 and p > 0 else _D[d]) + _P[p]
    return r


def rd(v):
    """수 → 읽는 말: 10000 → '만', 31548 → '삼만 천오백사십팔'"""
    ch, parts = chunks(v), []
    for k in range(len(ch) - 1, -1, -1):
        c = ch[k]
        if not c:
            continue
        w = _read4(c)
        if k > 0 and c == 1:
            w = '' if (k == len(ch) - 1 and k == 1) else '일'
        parts.append(w + _U[k])
    return ' '.join(parts)


def mix(v):
    """수 → 섞어 쓰기: 23586 → '2만 3586'"""
    ch = chunks(v)
    if len(ch) == 1:
        return str(ch[0])
    return ' '.join('%d%s' % (ch[k], _U[k]) for k in range(len(ch) - 1, -1, -1) if ch[k])


def cmp(a, c):
    return '>' if a > c else '<' if a < c else '='


def deciding_place(a, c):
    """자리 수가 같은 두 수의 크기가 정해지는 자리 이름"""
    sa, sc = str(a), str(c)
    assert len(sa) == len(sc)
    for i, (x, y) in enumerate(zip(sa, sc)):
        if x != y:
            return PLACE[len(sa) - 1 - i]


def biggest(cards):
    return max(''.join(p) for p in itertools.permutations(cards))


def digit_value(v, d):
    s = str(v)
    i = s.index(str(d))
    return int(s[i]) * 10 ** (len(s) - 1 - i)


assert rd(31548) == '삼만 천오백사십팔' and rd(10000) == '만' and rd(100000000) == '일억'
assert mix(23586) == '2만 3586' and mix(384500000000) == '3845억'

# ================================================================ 그림 (SVG → PNG)
FONT = "font-family=\"'Noto Sans KR','WenQuanYi Zen Hei',sans-serif\""
INK = '#222'
_png_cache = {}


def png(svg, width_px=1600):
    key = hashlib.md5(svg.encode('utf-8')).hexdigest()
    if key not in _png_cache:
        out = os.path.join(WORK, key + '.png')
        svg_to_png(svg, out, width_px)
        _png_cache[key] = out
    return _png_cache[key]


def _svg(w, h, body):
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" %s>'
            '<rect width="%d" height="%d" fill="#fff"/>%s</svg>' % (w, h, FONT, w, h, body))


def _t(x, y, s, fs=22, anchor='middle', fill=INK, weight='normal'):
    return ('<text x="%.1f" y="%.1f" font-size="%d" text-anchor="%s" fill="%s" font-weight="%s" '
            'dominant-baseline="middle">%s</text>' % (x, y, fs, anchor, fill, weight, s))


def chart_svg(ncols, rows, hl=None):
    """자릿값 표. rows: [(왼쪽 이름, 숫자 글 또는 None(빈칸))]. 오른쪽 맞춤. hl: 강조할 자리 번호(일=0)."""
    hl = hl or []
    lab = any(r[0] for r in rows)
    LW = 150 if lab else 0
    CW = 62
    W = LW + ncols * CW + 4
    RH = 50
    H = 2 + RH * 2 + RH * len(rows) + 2
    out = []
    x0 = 2 + LW
    # 묶음 줄 (조·억·만·일)
    for g in range((ncols + 3) // 4):
        lo, hi = g * 4, min(ncols, g * 4 + 4)          # 자리 번호 범위
        xa = x0 + (ncols - hi) * CW
        xb = x0 + (ncols - lo) * CW
        out.append('<rect x="%d" y="2" width="%d" height="%d" fill="#E6E6E6" stroke="#555" stroke-width="2"/>'
                   % (xa, xb - xa, RH))
        out.append(_t((xa + xb) / 2, 2 + RH / 2, ['일', '만', '억', '조'][g], 24, weight='bold'))
    for j in range(ncols):
        p = ncols - 1 - j
        x = x0 + j * CW
        fill = '#FFE9C7' if p in hl else '#F4F4F4'
        out.append('<rect x="%d" y="%d" width="%d" height="%d" fill="%s" stroke="#555" stroke-width="2"/>'
                   % (x, 2 + RH, CW, RH, fill))
        out.append(_t(x + CW / 2, 2 + RH * 1.5, ['일', '십', '백', '천'][p % 4], 22))
    for r, (name, digs) in enumerate(rows):
        y = 2 + RH * (2 + r)
        if lab:
            out.append('<rect x="2" y="%d" width="%d" height="%d" fill="#F4F4F4" stroke="#555" stroke-width="2"/>'
                       % (y, LW, RH))
            out.append(_t(2 + LW / 2, y + RH / 2, name, 21))
        for j in range(ncols):
            p = ncols - 1 - j
            x = x0 + j * CW
            fill = '#FFF6E6' if p in hl else '#fff'
            out.append('<rect x="%d" y="%d" width="%d" height="%d" fill="%s" stroke="#555" stroke-width="2"/>'
                       % (x, y, CW, RH, fill))
            if digs is not None and p < len(digs):
                out.append(_t(x + CW / 2, y + RH / 2, digs[len(digs) - 1 - p], 28, weight='bold'))
    # 묶음 사이 굵은 선
    for g in range(1, (ncols + 3) // 4):
        if g * 4 < ncols:
            x = x0 + (ncols - g * 4) * CW
            out.append('<line x1="%d" y1="2" x2="%d" y2="%d" stroke="#000" stroke-width="5"/>' % (x, x, H - 2))
    return _svg(W, H, ''.join(out)), W / H


def numline_svg(levels, target=10000):
    """수직선 확대: levels=[(시작, 간격)], 눈금 5개(시작~target)."""
    W, RH = 960, 92
    H = RH * len(levels) + 10
    out = []
    for i, (start, step) in enumerate(levels):
        y = 40 + i * RH
        out.append('<line x1="40" y1="%d" x2="920" y2="%d" stroke="%s" stroke-width="3"/>' % (y, y, INK))
        out.append(_t(20, y - 22, '한 칸: %d' % step, 18, anchor='start', fill='#555'))
        for k in range(5):
            v = start + k * step
            x = 120 + k * 180
            big = v == target
            out.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="%d"/>'
                       % (x, y - 12, x, y + 12, INK, 4 if big else 3))
            out.append(_t(x, y + 32, str(v), 22, weight='bold' if big else 'normal'))
    return _svg(W, H, ''.join(out)), W / H


def hop_svg(vals, lab='+ ?', fs=22):
    n = len(vals) - 1
    W, H = 960, 170

    def xs(k):
        return 80 + k * (800 / n)
    out = ['<line x1="30" y1="110" x2="930" y2="110" stroke="%s" stroke-width="3"/>' % INK]
    for k, v in enumerate(vals):
        out.append('<line x1="%.1f" y1="96" x2="%.1f" y2="124" stroke="%s" stroke-width="3"/>' % (xs(k), xs(k), INK))
        out.append(_t(xs(k), 150, v, fs))
        if k < n:
            out.append('<path d="M %.1f 92 Q %.1f 26 %.1f 92" fill="none" stroke="#333" stroke-width="3"/>'
                       % (xs(k) + 6, (xs(k) + xs(k + 1)) / 2, xs(k + 1) - 6))
            out.append(_t((xs(k) + xs(k + 1)) / 2, 38, lab, 20))
    return _svg(W, H, ''.join(out)), W / H


def chain_svg(vals, lab='10배'):
    n, W, H, bw = len(vals), 940, 120, 140
    gap = (W - 20 - n * bw) / (n - 1)
    out = []
    for i, v in enumerate(vals):
        x = 10 + i * (bw + gap)
        out.append('<rect x="%.1f" y="36" width="%d" height="60" rx="10" fill="#fff" stroke="#555" '
                   'stroke-width="2.5" %s/>' % (x, bw, 'stroke-dasharray="7 5"' if v is None else ''))
        out.append(_t(x + bw / 2, 67, '(       )' if v is None else str(v), 24 if v is not None else 22))
        if i < n - 1:
            ax, bx = x + bw + 4, x + bw + gap - 4
            out.append('<line x1="%.1f" y1="66" x2="%.1f" y2="66" stroke="#333" stroke-width="3"/>' % (ax, bx - 8))
            out.append('<path d="M %.1f 66 l -11 -7 v 14 z" fill="#333"/>' % bx)
            out.append(_t((ax + bx) / 2, 22, lab, 18))
    return _svg(W, H, ''.join(out)), W / H


def bills_svg(n, label, per_row=10):
    bw, bh, gx = 84, 46, 8
    rows = (n + per_row - 1) // per_row
    W = 10 + per_row * (bw + gx)
    H = 10 + rows * (bh + 10)
    out = []
    for i in range(n):
        x = 10 + (i % per_row) * (bw + gx)
        y = 10 + (i // per_row) * (bh + 10)
        out.append('<rect x="%d" y="%d" width="%d" height="%d" rx="6" fill="#EEF5EA" stroke="#555" stroke-width="2"/>'
                   % (x, y, bw, bh))
        out.append(_t(x + bw / 2, y + bh / 2, label, 18))
    return _svg(W, H, ''.join(out)), W / H


def board_svg(board, col=None):
    """3×4 놀이판. col: {칸 번호: 'me'|'cpu'}"""
    col = col or {}
    CW, CH = 150, 92
    W, H = 4 * CW + 20, 3 * CH + 20
    out = []
    for i, v in enumerate([c for r in board for c in r]):
        r, c = divmod(i, 4)
        x, y = 10 + c * CW, 10 + r * CH
        who = col.get(i)
        fill = '#9CC7F2' if who == 'me' else '#F4A79A' if who == 'cpu' else '#fff'
        out.append('<rect x="%d" y="%d" width="%d" height="%d" rx="12" fill="%s" stroke="#555" stroke-width="2"/>'
                   % (x + 4, y + 4, CW - 8, CH - 8, fill))
        out.append(_t(x + CW / 2, y + CH / 2 - (8 if who else 0), v, 34, weight='bold'))
        if who:
            out.append(_t(x + CW / 2, y + CH - 18, '나' if who == 'me' else '상대', 17))
    return _svg(W, H, ''.join(out)), W / H


def board_pair_svg(board, c1, c2, n1='가', n2='나'):
    a, _ = board_svg(board, c1)
    bb, _ = board_svg(board, c2)
    inner = lambda sv: sv[sv.index('<rect width'):sv.rindex('</svg>')]
    W, H = 2 * 620 + 60, 296 + 44
    body = (_t(310, 20, n1, 26, weight='bold') + '<g transform="translate(0,40)">' + inner(a) + '</g>'
            + _t(620 + 60 + 310, 20, n2, 26, weight='bold') + '<g transform="translate(680,40)">' + inner(bb) + '</g>')
    return _svg(W, H, body), W / H


TB_BOARD = [['158', '7', '93', '406'], ['25', '805', '61', '3'], ['370', '9', '42', '8']]
ST_BOARD = [['264', '5', '81', '730'], ['19', '615', '402', '6'], ['58', '3', '97', '8']]


def _lines3():
    L = []
    for r in range(3):
        for c in range(4):
            for dr, dc in ((0, 1), (1, 0), (1, 1), (1, -1)):
                cells = [(r + dr * k, c + dc * k) for k in range(3)]
                if all(0 <= a < 3 and 0 <= q < 4 for a, q in cells):
                    L.append([a * 4 + q for a, q in cells])
    return L


LINES3 = _lines3()


def win_cell(col, who):
    """who가 지금 한 칸만 더 칠하면 이기는 칸들"""
    out = set()
    for L in LINES3:
        mine = [i for i in L if col.get(i) == who]
        empty = [i for i in L if i not in col]
        if len(mine) == 2 and len(empty) == 1:
            out.add(empty[0])
    return out


# ================================================================ 쪽 나눔을 따지는 감싸개
PAGE_MM = 262          # A4 297 − 위아래 여백 24 − 여유


def _em(t):
    return sum(1.0 if ord(ch) > 0x2E80 else 0.55 for ch in t)


def _nlines(t, pt, width_mm=176):
    return max(1, math.ceil(_em(t) * pt * 0.3528 * 1.04 / width_mm))


def _lh(pt):
    return pt * 0.3528 * 1.6


class W:
    def __init__(self, label, level, ver):
        self.s = Sheet(unit_label='4-1 수학 %s(%s)' % (UNIT, label), level=level, grade_label='4학년')
        self.label, self.level, self.ver = label, level, ver
        self.basic = level == '기본형'
        self.keys = []

    # ---- 차시 시작·끝
    def lesson(self, no, soop, title, question, scene=None, pic=None, pic_mm=None):
        self.no = no
        self.head = [lambda: self.s.lesson(no=no, soop=soop, title=title, question=question)]
        hh = 25.4 + 1.5 + max(12.7, _nlines('탐구 질문  ' + question, 15, 170) * _lh(15) + 2)
        if scene or pic:
            p = None
            if pic:
                p, asp = png(pic[0]), pic[1]
                hh += (pic_mm or 110) / asp
            self.head.append(lambda: self.s.scene(p, scene, width_mm=pic_mm))
            if scene:
                hh += sum(_nlines(t, 13) * _lh(13) for t in ([scene] if isinstance(scene, str) else scene))
            hh += 5.6
        self.head_h = hh
        self.steps = []          # [(높이, [동작])]
        self.cur = None
        self.nstep = 0
        self.akeys = []

    def end(self):
        for f in self.head:
            f()
        used, self.pages = self.head_h, 1
        for st in self.steps:
            h, ops = st[0], st[1]
            if used + h > PAGE_MM and used > self.head_h + 1 and (PAGE_MM - used < 60 or used + st[2][0] + st[2][1] > PAGE_MM):
                self.s.page_break()
                used, self.pages = 0, self.pages + 1
            hs = st[2]
            for i, f in enumerate(ops):
                # 남은 자리가 넉넉하면 단계 안의 동작 사이에서 나눔(단계 제목은 다음 동작과 함께)
                if i >= 2 and used + hs[i] > PAGE_MM:
                    self.s.page_break()
                    used, self.pages = 0, self.pages + 1
                f()
                used += hs[i]
        line = '%d차시  ' % self.no + '   '.join(self.akeys)
        self.keys.append(line)

    def _op(self, h, f):
        self.cur[0] += h
        self.cur[1].append(f)
        self.cur[2].append(h)

    # ---- 본문
    def step(self, name, sub=None, key=True):
        self.nstep += 1
        c = CIRC[self.nstep - 1]
        th = 2.8 + _lh(15) * _nlines(name + (sub or '') + '      ', 15)
        self.cur = [0, [], []]
        self.steps.append(self.cur)
        self._op(th, lambda: self.s.step(c + ' ' + name, sub))
        self.circ = c
        return c

    def key(self, *parts):
        """정답 줄에 이 단계 답을 더함"""
        self.akeys.append(self.circ + ' ' + ', '.join(str(p) for p in parts))

    def text(self, t):
        self._op(_nlines(t, 13) * _lh(13), lambda: self.s.text(t))

    def hint(self, t):
        if self.basic:
            self.text('도움  ' + t)

    def ask(self, q, blank=True):
        t = q + ('   답: (        )' if blank else '')
        self._op(_nlines(t, 14) * _lh(14), lambda: self.s.ask(q, blank=blank))

    def lines(self, n=2):
        self._op(n * _lh(14), lambda: self.s.lines(n))

    def why(self, q, frame=None, n=2):
        """'왜 그럴까요?' 쓰는 칸. 기본형은 문장 틀을 함께."""
        self.ask(q, blank=False)
        if self.basic and frame:
            self.text('도움  ' + frame)
        self.lines(n)

    def pic(self, svg_asp, mm=150):
        svg, asp = svg_asp
        p = png(svg)
        self._op(mm / asp + 2, lambda: self.s.picture(p, width_mm=mm))

    def choices(self, pairs):
        h = sum(max(12, max(_nlines(q, 13, 110), _nlines(a, 13, 60)) * _lh(13) + 2) for q, a in pairs)
        self._op(h, lambda: self.s.choices(pairs))

    def labeled(self, pairs, label_mm=None, row_h=3969):
        lw = label_mm or 30
        h = sum(max(row_h / 283.465, _nlines(v, 13, 176 - lw - 4) * _lh(13) + 2) for k, v in pairs)
        self._op(h, lambda: self.s.labeled(pairs, label_mm=label_mm, row_h=row_h))

    def wordbox(self, words):
        t = '낱말 상자:  ' + '   ·   '.join(words)
        self._op(max(12.7, _nlines(t, 14, 170) * _lh(14) + 2), lambda: self.s.wordbox(words))

    def fill(self, sentences):
        if isinstance(sentences, str):
            sentences = [sentences]
        h = max(12.7 * len(sentences), sum(_nlines(t, 14, 170) * _lh(14) for t in sentences) + 3)
        self._op(h, lambda: self.s.fill(sentences))

    def table(self, rows, col_mm=None, header=True, header_col=False, row_h=None):
        n = max(len(r) for r in rows)
        if col_mm:
            ws = col_mm
        elif header and n > 2 and rows[0][0] == '':
            ws = [50] + [130 / (n - 1)] * (n - 1)
        else:
            ws = [180 / n] * n
        h = 0
        for r, row in enumerate(rows):
            base = (10 if header and r == 0 else (row_h or 3118) / 283.465)
            need = max(_nlines(str(v), 15, max(8, ws[c] - 4)) for c, v in enumerate(row)) * _lh(15) + 1.5
            h += max(base, need)
        self._op(h + 1, lambda: self.s.table(rows, header=header, header_col=header_col, col_mm=col_mm, row_h=row_h))

    # ---- 이야기 버전 탐구 도우미 (앱 ruleFirst·thenWhy)
    def predict(self, q, frame):
        self.text('먼저 예상해요 — ' + q)
        if self.basic:
            self.text('도움  ' + frame)
        self.ask('내 예상:', blank=False)
        self.lines(1)

    def predict_check(self):
        self.choices([('내 예상이 맞았나요?', '( 맞았어요 / 조금 고쳐야 해요 / 많이 고쳐야 해요 )')])

    def save(self, path):
        self.s.answers('【교사용】 %s(%s) 활동지 정답 (%s)' % (UNIT, self.label, self.level), self.keys, note=NOTE)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        self.s.save(path)
        return path


def opts(*xs):
    return '( ' + ' / '.join(xs) + ' )'


# ================================================================ 교과서 차시 버전
def tb1(w):
    w.lesson(1, '개념 찾기(S)', '단원 도입 ― 나눔과 기부 속의 큰 수',
             '우리 주변에서 0이 많은 큰 수를 어디에서 볼 수 있을까요?',
             scene='예준이가 인터넷에서 나눔과 기부에 관한 기사를 읽고 있어요. 희망 나눔 전시회, 책 보내기 운동, '
                   '나눔 콘서트처럼 세상을 아름답게 만드는 활동에는 0이 많은 큰 수가 자주 나와요.')
    cards = [('흑꼬리도요가 한 번에 날아간 거리', '12200 km'), ('흑꼬리도요가 쉬지 않고 날아간 날', '11일'),
             ('희망 나눔 전시회 입장권 한 장', '1000원'), ('아버지 회사가 기증한 책의 금액', '10000000원'),
             ('예준이가 통장에 모은 돈', '23586원'), ('함께 전시회에 간 친구', '10명')]
    big = [v for t, v in cards if len(''.join(ch for ch in v if ch.isdigit())) >= 5]
    w.step('만져 보기', '숫자가 다섯 개 이상인 큰 수에 ○표 하기')
    w.hint('카드에 적힌 수의 숫자가 몇 개인지 하나씩 세어 봐요. 1000은 숫자가 4개, 12200은 숫자가 5개예요.')
    w.table([['기사 속 내용', '수', '○표']] + [[t, v, ''] for t, v in cards], col_mm=[105, 45, 30])
    w.key('○: ' + ', '.join(big))
    w.step('떠올리기', '네 자리 수 삼천오백팔십육을 자릿값 표에 나타내기')
    w.table([['', '천의 자리', '백의 자리', '십의 자리', '일의 자리'], ['숫자', b, b, b, b]])
    if w.basic:
        w.fill('3586은 1000이 (    )개, 100이 (    )개, 10이 (    )개, 1이 (    )개인 수예요.')
        w.key('3, 5, 8, 6 / 3개, 5개, 8개, 6개')
    else:
        w.key('3, 5, 8, 6')
    w.step('말해 보기', '보기 - 생각하기 - 궁금해하기')
    if w.basic:
        w.labeled([('보기', '나는 ______________ 에서 0이 많은 큰 수를 보았어요.'),
                   ('생각하기', '나는 ______________ 나눔(기부)을 해 보았어요.'),
                   ('궁금해하기', '큰 수에 대해 ______________ 이(가) 궁금해요.')])
    else:
        w.labeled([('보기', '생활 속에서 0이 많은 큰 수를 어디에서 보았나요?'),
                   ('생각하기', '나눔과 기부 활동을 해 본 경험은?'),
                   ('궁금해하기', '큰 수에 대해 무엇이 궁금한가요?')], row_h=5670)
    w.key('(생각 쓰기 — 예: 텔레비전 가격표에서 보았어요 / 안 입는 옷을 기부했어요 / 0이 아주 많은 수는 어떻게 읽을까요?)')
    w.step('떠올리기', '네 자리 수의 크기 비교 (○ 안에 >, =, <)')
    w.hint('천의 자리 숫자부터 차례대로 비교해요. 자리 수가 다르면 자리 수가 많은 쪽이 더 커요.')
    prs = [(3586, 3612), (7140, 7104), (999, 9999)]
    w.ask('     '.join('%d  (    )  %d' % p for p in prs), blank=False)
    w.key(', '.join(cmp(*p) for p in prs))
    w.step('확인하기', '큰 수가 필요한 상황')
    sit = [('우리나라 사람 수를 나타낼 때', 1), ('자동차의 가격을 말할 때', 1), ('필통 속 연필 수를 셀 때', 0),
           ('흑꼬리도요가 날아간 거리를 나타낼 때', 1)]
    w.choices([(t, '( 필요해요 / 필요 없어요 )') for t, _ in sit])
    w.ask('12200 km에서 숫자는 모두 몇 개인가요?')
    w.key(', '.join('필요해요' if n else '필요 없어요' for _, n in sit), '%d개' % len('12200'))
    if not w.basic:
        w.step('도전하기', '다음 시간에 배울 수 미리 생각하기')
        w.ask('1000원짜리 지폐 9장은 모두 얼마인가요?')
        w.ask('가장 큰 네 자리 수 9999보다 1만큼 더 큰 수를 숫자로 써 보세요.')
        w.ask('그 수는 몇 자리 수인가요?')
        w.why('9999보다 1만큼 더 큰 수가 99991이 아닌 까닭을 써 보세요.')
        w.key('%d원, %d, %d자리, (까닭 — 예: 9999 뒤에 1을 붙인 것이 아니라 1만큼 더한 수이기 때문이에요)'
              % (1000 * 9, 9999 + 1, len(str(10000))))
    w.end()


def tb2(w):
    w.lesson(2, '개념 구축하기(O)', '만을 알아볼까요', '1000이 10개인 수는 어떻게 쓰고 읽을까요?',
             scene='희망 나눔 전시회의 입장권은 한 장에 1000원이에요. 예준이네 모둠 10명의 입장권 값을 알아봐요.')
    w.step('만져 보기', '1000원짜리 지폐로 입장권 10장 값 만들기')
    w.pic(bills_svg(10, '1000원'), 150)
    w.hint('1000원짜리 8장은 8000원, 9장은 9000원이에요. 한 장 더 놓으면 얼마일까요?')
    w.ask('1000원짜리 지폐 10장은 모두 몇 원인가요?')
    w.ask('1000원짜리 10장은 10000원짜리 지폐 몇 장과 같은 금액인가요?')
    w.key('%d원, %d장' % (1000 * 10, 1000 * 10 // 10000))
    w.step('그려 보기', '수직선을 점점 크게 보기')
    lv = [(6000, 1000), (9600, 100), (9960, 10), (9996, 1)]
    w.pic(numline_svg(lv), 150)
    w.fill('10000은 9000보다 (      ), 9900보다 (      ), 9990보다 (      ), 9999보다 (      )만큼 더 큰 수예요.')
    w.key(', '.join(str(10000 - v) for v in (9000, 9900, 9990, 9999)))
    w.step('말해 보기', '10000까지의 수 사이의 관계')
    w.pic(chain_svg([1, 10, None, 1000, None]), 140)
    w.ask('10000은 1000의 (      )배, 100의 (      )배, 10의 (      )배예요.', blank=False)
    w.choices([('1, 10, 100, 1000, 10000의 규칙은?', '( 10배씩 커져요 / 1씩 커져요 )')])
    w.key('100, 10000', '%d배, %d배, %d배' % (10000 // 1000, 10000 // 100, 10000 // 10), '10배씩 커져요')
    if not w.basic:
        w.why('10000이 100의 100배인 까닭을 써 보세요.', n=1)
    w.step('약속하기', '만')
    if w.basic:
        w.wordbox(['10000', '1만', '만', '일만'])
    w.fill('1000이 10개인 수를 (          ) 또는 (        )이라 쓰고, (        ) 또는 (        )이라고 읽어요.')
    w.key('10000, 1만, 만, 일만')
    w.step('확인하기', '100원짜리, 10원짜리 동전으로 10000원 만들기')
    w.hint('100원짜리 10개는 1000원, 10원짜리 100개는 1000원이에요.')
    w.table([['', '100원짜리 동전만', '10원짜리 동전만'], ['필요한 동전 수', '(      )개', '(      )개']])
    w.key('%d개, %d개' % (10000 // 100, 10000 // 10))
    if not w.basic:
        w.step('도전하기', '10000을 여러 가지로')
        w.ask('설명하는 수가 다른 하나는?  ㉠ 9999보다 1만큼 더 큰 수  ㉡ 8000보다 200만큼 더 큰 수  '
              '㉢ 100이 100개인 수  ㉣ 1000이 10개인 수')
        w.ask('윤서는 들이가 10000 mL인 물통에 물을 7000 mL 담았어요. 가득 담으려면 몇 mL를 더 담아야 하나요?')
        w.ask('가격이 10000원이 아닌 것은?  ㉠ 1000원짜리 볼펜 10자루  ㉡ 100원짜리 구슬 100개  ㉢ 500원짜리 공책 2권')
        w.ask('500원짜리 동전만으로 10000원을 만들려면 몇 개가 필요한가요?')
        w.why('500원짜리 동전의 개수를 어떻게 구했는지 써 보세요.')
        vals = {'㉠': 9999 + 1, '㉡': 8000 + 200, '㉢': 100 * 100, '㉣': 1000 * 10}
        odd = [k for k, v in vals.items() if v != 10000]
        pr = {'㉠': 1000 * 10, '㉡': 100 * 100, '㉢': 500 * 2}
        w.key(odd[0], '%d mL' % (10000 - 7000), [k for k, v in pr.items() if v != 10000][0],
              '%d개' % (10000 // 500), '(까닭 — 예: 500원짜리 2개가 1000원이고 10000원은 1000원이 10개라서 2 × 10 = 20개예요)')
    w.end()


def tb3(w):
    w.lesson(3, '개념 구축하기(O)', '다섯 자리 수를 알아볼까요',
             '10000이 2개, 1000이 3개, 100이 5개, 10이 8개, 1이 6개인 수는 어떻게 쓰고 읽을까요?',
             scene='예준이는 통장에 모은 23586원을 아프리카 아이들을 위해 기부하려고 해요.')
    w.step('만져 보기', '돈 모형으로 23586원 만들기')
    w.hint('10000원짜리부터 놓아요. 23586에서 10000은 몇 개 들어 있나요?')
    w.table([['10000원', '1000원', '100원', '10원', '1원'], ['(    )장', '(    )장', '(    )개', '(    )개', '(    )개']])
    w.key('/'.join('23586'))
    v = 51465
    w.step('그려 보기', '51465를 자릿값 표에 나타내기')
    w.table([['', '만의 자리', '천의 자리', '백의 자리', '십의 자리', '일의 자리'],
             ['숫자', '', '', '', '', ''], ['나타내는 값', '', '', '', '', '']])
    w.key('숫자 5, 1, 4, 6, 5 / 값 ' + ', '.join(str(int(d) * 10 ** (4 - i)) for i, d in enumerate(str(v))))
    w.step('말해 보기', '51465는 얼마만큼의 수일까요?')
    w.ask('만의 자리 숫자 5가 나타내는 값은?')
    w.ask('일의 자리 숫자 5가 나타내는 값은?')
    w.fill('51465 = (          ) + 1000 + (        ) + 60 + 5')
    w.key('50000, 5, 50000, 400')
    if not w.basic:
        w.why('같은 숫자 5가 나타내는 값이 서로 다른 까닭을 써 보세요.', n=1)
    w.step('약속하기', '다섯 자리 수')
    if w.basic:
        w.wordbox(['23586', '2만 3586', '이만 삼천오백팔십육'])
    w.fill('10000이 2개, 1000이 3개, 100이 5개, 10이 8개, 1이 6개인 수를 (          ) 또는 (            )이라 쓰고, '
           '(                        )이라고 읽어요.')
    w.key('23586, %s, %s' % (mix(23586), rd(23586)))
    w.step('확인하기', '다섯 자리 수를 쓰고 읽기')
    w.hint('숫자가 0인 자리는 읽지 않아요. 읽은 말에 없는 자리에는 0을 써요.')
    w.ask('사만 육천이백오십구를 수로 써 보세요.')
    w.ask('80573을 읽어 보세요.')
    w.ask('10000이 3개, 1000이 1개, 100이 5개, 10이 4개, 1이 8개인 수를 쓰고 읽어 보세요.')
    w.ask('숫자 3이 30000을 나타내는 수는?   ㉠ 79831   ㉡ 30754   ㉢ 13256')
    w.ask('민호는 ‘35012 = 30000 + 500 + 10 + 2’라고 했어요. 바르게 고쳐 써 보세요.')
    k3 = [k for k, n in (('㉠', 79831), ('㉡', 30754), ('㉢', 13256)) if '3' in str(n) and digit_value(n, 3) == 30000]
    w.key('46259', rd(80573), '31548(%s)' % rd(31548), k3[0], '35012 = 30000 + 5000 + 10 + 2')
    if not w.basic:
        cards = ['3', '5', '6', '8', '0']
        mx = max(int(''.join(p)) for p in itertools.permutations(cards) if p[0] != '0')
        mn = min(int(''.join(p)) for p in itertools.permutations(cards) if p[0] != '0')
        w.step('도전하기', '수 카드 3, 5, 6, 8, 0을 한 번씩 모두 사용하기')
        w.ask('만들 수 있는 가장 큰 다섯 자리 수를 쓰고 읽어 보세요.')
        w.ask('만들 수 있는 가장 작은 다섯 자리 수를 쓰고 읽어 보세요.')
        w.why('가장 작은 수를 만들 때 만의 자리에 0을 놓을 수 없는 까닭을 써 보세요.')
        w.key('%d(%s), %d(%s), (까닭 — 예: 만의 자리가 0이면 다섯 자리 수가 되지 않아요)' % (mx, rd(mx), mn, rd(mn)))
    w.end()


def tb4(w):
    w.lesson(4, '개념 구축하기(O)', '십만, 백만, 천만을 알아볼까요', '10000이 10개, 100개, 1000개인 수는 어떻게 쓰고 읽을까요?',
             scene='예준이는 100000원, 예준이네 학교는 1000000원, 아버지의 회사는 10000000원 상당의 책을 도서관에 기증했어요.')
    w.step('만져 보기', '돈 모형을 10개씩 묶어 가며 만들기')
    w.hint('10000원짜리 10장을 묶으면 10만 원 묶음 하나가 돼요.')
    w.table([['', '10000이 10개', '10000이 100개', '10000이 1000개'],
             ['0을 모두 써서', '', '', ''], ['만을 써서', '10만', '(      )만', '(      )만']])
    w.key('%d, %d, %d / 100만, 1000만' % (10000 * 10, 10000 * 100, 10000 * 1000))
    v = 86290000
    w.step('그려 보기', '86290000을 자릿값 표에 나타내기')
    w.hint('일의 자리부터 네 자리씩 끊으면 8629 / 0000이에요.')
    w.pic(chart_svg(8, [('', None)]), 120)
    w.key('천만 8, 백만 6, 십만 2, 만 9, 나머지 0')
    w.step('말해 보기', '86290000은 얼마만큼의 수일까요?')
    w.ask('86290000에서 숫자 8이 나타내는 값은?')
    w.choices([('86290000에서 숫자 2는 몇의 자리 숫자인가요?', opts('만의 자리', '십만의 자리', '백만의 자리'))])
    w.fill('86290000 = 80000000 + (              ) + (              ) + 90000')
    w.key(digit_value(v, 8), '십만의 자리', '%d, %d' % (6000000, 200000))
    w.step('약속하기', '십만, 백만, 천만')
    if w.basic:
        w.wordbox(['십만', '86290000', '8629만', '팔천육백이십구만'])
    w.fill(['10000이 10개인 수를 100000 또는 10만이라 쓰고 (          )이라고 읽어요.',
            '10000이 8629개인 수를 (              ) 또는 (          )이라 쓰고, (                    )이라고 읽어요.'])
    w.key('십만, 86290000, %s, %s' % (mix(v), rd(v)))
    w.step('확인하기', '수를 쓰고 읽기 (일의 자리부터 네 자리씩 나누어 읽어요)')
    w.hint('2090458 → 209 / 0458 → 이백구만 사백오십팔')
    w.ask('오천이백십구만을 수로 써 보세요.')
    w.ask('476245를 읽어 보세요.')
    w.ask('광고 ‘6400만 화소 카메라!’에서 6400만을 0을 모두 써서 나타내 보세요.')
    w.ask('광고 ‘판매량 1000000개 돌파!’에서 1000000을 읽어 보세요.')
    w.key('52190000', rd(476245), '64000000', rd(1000000))
    if not w.basic:
        w.step('도전하기', '천만 단위까지의 수')
        w.ask('10000이 3705개인 수를 쓰고 읽어 보세요.')
        w.ask('숫자 5가 나타내는 값이 가장 작은 수는?   ㉠ 1540000   ㉡ 25700000   ㉢ 57910000')
        w.ask('25264108에서 천만의 자리 숫자 2가 나타내는 값은 십만의 자리 숫자 2가 나타내는 값의 몇 배인가요?')
        w.why('몇 배인지 어떻게 구했는지 써 보세요.')
        c5 = min((('㉠', 1540000), ('㉡', 25700000), ('㉢', 57910000)), key=lambda kv: digit_value(kv[1], 5))[0]
        w.key('%d(%s), %s, %d배, (까닭 — 예: 20000000과 200000은 0이 2개 차이 나서 100배예요)'
              % (10000 * 3705, rd(10000 * 3705), c5, 20000000 // 200000))
    w.end()


def tb5(w):
    w.lesson(5, '개념 구축하기(O)', '억을 알아볼까요', '1000만이 10개인 수는 어떻게 쓰고 읽을까요?',
             scene='나눔 콘서트 영상의 조회 수가 100000000회예요.')
    w.step('만져 보기', '1만에서 10개씩 모아 10배씩 키우기')
    w.hint('1만이 10개이면 10만, 10만이 10개이면 100만이에요.')
    w.pic(chain_svg(['1만', '10만', None, None, None], '10개'), 150)
    w.ask('1000만이 10개인 수를 0을 모두 써서 나타내 보세요.')
    w.key('100만, 1000만, 1억', '100000000')
    v = 384500000000
    w.step('그려 보기', '384500000000을 자릿값 표에 나타내기')
    w.hint('일의 자리부터 네 자리씩 끊으면 3845 / 0000 / 0000이에요.')
    w.pic(chart_svg(12, [('', None)]), 165)
    w.key('천억 3, 백억 8, 십억 4, 억 5, 나머지 0')
    w.step('말해 보기', '384500000000은 얼마만큼의 수일까요?')
    w.fill('384500000000 = (                  ) + 80000000000 + (                ) + 500000000')
    w.choices([('1억이 10개, 100개, 1000개인 수는?', opts('10억, 100억, 1000억', '10만, 100만, 1000만'))])
    w.key('300000000000, 4000000000', '10억, 100억, 1000억')
    w.step('약속하기', '억')
    if w.basic:
        w.wordbox(['100000000', '1억', '억', '일억', '3845억'])
    w.fill(['1000만이 10개인 수를 (                ) 또는 (        )이라 쓰고, (      ) 또는 (      )이라고 읽어요.',
            '1억이 3845개인 수는 (            )이에요.'])
    w.key('100000000, 1억, 억, 일억, %s' % mix(v))
    w.step('확인하기', '수를 쓰거나 읽기 (예: 4100000000 → 사십일억)')
    w.hint('27506100000 → 275 / 0610 / 0000 → 이백칠십오억 육백십만')
    w.ask('삼천이백칠십사억 오천사백육십일만을 수로 써 보세요.')
    w.ask('27506100000을 읽어 보세요.')
    w.ask('뉴스 ‘1억 6600만 년 전 공룡 발자국’에서 1억 6600만을 0을 모두 써서 나타내 보세요.')
    if w.basic:
        w.key('327454610000', rd(27506100000), '166000000')
    else:
        w.key('327454610000', rd(27506100000), '166000000')
    if not w.basic:
        n = 2530 * 10 ** 8 + 2901 * 10 ** 4 + 6789
        w.step('도전하기', '천억 단위까지의 수')
        w.ask('1억이 2530개, 1만이 2901개, 1이 6789개인 수를 쓰고 읽어 보세요.')
        w.ask('154800693257에 대해 옳게 말한 것은?  ㉠ 숫자 1은 1000억을 나타내요.  ㉡ 숫자 4는 억의 자리 숫자예요.  '
              '㉢ 백억의 자리 숫자는 8이에요.')
        w.ask('9000만보다 1000만만큼 더 큰 수를 써 보세요.')
        w.why('위 문제에서 옳지 않은 것을 하나 골라 바르게 고쳐 써 보세요.')
        s = '154800693257'
        assert s[0] == '1' and len(s) == 12 and s[2] == '4' and PLACE[len(s) - 3] == '십억' and s[1] == '5'
        w.key('%d(%s), ㉠, %d(1억), (예: ㉡ 숫자 4는 십억의 자리 숫자예요 / ㉢ 백억의 자리 숫자는 5예요)'
              % (n, rd(n), 90000000 + 10000000))
    w.end()


def tb6(w):
    w.lesson(6, '개념 구축하기(O)', '조를 알아볼까요', '1000억이 10개인 수는 어떻게 쓰고 읽을까요?',
             scene='예준이가 사는 도시는 올해 노인 복지를 위해 1000000000000원을 사용할 계획이에요.')
    w.step('만져 보기', '1억에서 10개씩 모아 10배씩 키우기')
    w.pic(chain_svg(['1억', '10억', None, None, None], '10개'), 150)
    w.ask('1000억이 10개인 수를 0을 모두 써서 나타내 보세요.')
    w.key('100억, 1000억, 1조', '1000000000000')
    v = 2893000000000000
    w.step('그려 보기', '2893000000000000을 자릿값 표에 나타내기')
    w.hint('일의 자리부터 네 자리씩 끊으면 2893 / 0000 / 0000 / 0000이에요.')
    w.pic(chart_svg(16, [('', None)]), 176)
    w.key('천조 2, 백조 8, 십조 9, 조 3, 나머지 0')
    w.step('말해 보기', '2893000000000000은 얼마만큼의 수일까요?')
    w.fill(['2893000000000000 = 2000000000000000 + (                      )',
            '                              + (                      ) + 3000000000000'])
    w.choices([('숫자 2는 몇의 자리 숫자인가요?', opts('조의 자리', '십조의 자리', '천조의 자리'))])
    w.key('800000000000000, 90000000000000', '천조의 자리')
    w.step('약속하기', '조')
    if w.basic:
        w.wordbox(['1000000000000', '1조', '조', '일조', '2893조'])
    w.fill(['1000억이 10개인 수를 (                    ) 또는 (      )라 쓰고, (      ) 또는 (      )라고 읽어요.',
            '1조가 2893개인 수는 (            )예요.'])
    w.key('1000000000000, 1조, 조, 일조, %s' % mix(v))
    w.step('확인하기', '수를 쓰거나 읽기 (예: 325000000000000 → 삼백이십오조)')
    w.hint('조, 억, 만 사이에 네 자리씩 있어요. 비어 있는 자리에는 0을 써요.')
    w.ask('칠십구조 천이백억 백오십만을 수로 써 보세요.')
    w.ask('2059038000000000을 읽어 보세요.')
    w.ask('1조가 10개인 수를 써 보세요.')
    w.ask('설명하는 수가 다른 하나는?  ㉠ 10억이 1000개인 수  ㉡ 1조의 10배인 수  ㉢ 9조보다 1조만큼 더 큰 수')
    T = 10 ** 12
    vals = {'㉠': 10 ** 9 * 1000, '㉡': T * 10, '㉢': 9 * T + T}
    odd = [k for k, x in vals.items() if list(vals.values()).count(x) == 1][0]
    w.key(79 * T + 1200 * 10 ** 8 + 150 * 10 ** 4, rd(2059038000000000), 10 * T, odd)
    if not w.basic:
        w.step('도전하기', '친구에게 설명할 수 정하기')
        w.text('‘1조가 □개, 1억이 □개, 1만이 □개인 수’의 □를 마음대로 채우고 수로 써 보세요.')
        w.text('예: 1조가 1632개, 1억이 2789개, 1만이 3085개인 수 → 1632조 2789억 3085만 → 1632278930850000')
        w.ask('1조가 (      )개, 1억이 (      )개, 1만이 (      )개인 수', blank=False)
        w.ask('섞어 쓰기: (                          )   숫자로: (                                  )', blank=False)
        w.why('만 아래 네 자리(천, 백, 십, 일의 자리)에 0을 4개 쓰는 까닭을 써 보세요.', n=1)
        ex = 1632 * T + 2789 * 10 ** 8 + 3085 * 10 ** 4
        assert str(ex) == '1632278930850000'
        w.key('학생마다 다름(예: %s → %d), (까닭 — 예: 1이 하나도 없어서 일, 십, 백, 천의 자리가 모두 0이에요)' % (mix(ex), ex))
    w.end()


def tb7(w):
    w.lesson(7, '개념 구축하기(O)', '뛰어 세기를 해 볼까요', '큰 수를 뛰어 세면 어느 자리 숫자가 어떻게 변할까요?',
             scene='예준이 아버지의 회사는 매년 콩 10만 kg과 쌀 20만 kg을 기부해요.')
    w.step('만져 보기', '4년 동안 기부한 무게를 뛰어 세기')
    w.table([['', '1년째', '2년째', '3년째', '4년째'], ['콩 (kg)', '10만', '', '', ''], ['쌀 (kg)', '20만', '', '', '']])
    if w.basic:
        w.fill('10만씩 뛰어 세면 (        )의 자리 숫자가 1씩, 20만씩 뛰어 세면 (    )씩 커져요.')
    w.key(', '.join('%d만' % (10 * k) for k in (2, 3, 4)) + ' / ' + ', '.join('%d만' % (20 * k) for k in (2, 3, 4))
          + (' / 십만, 2' if w.basic else ''))
    w.step('그려 보기', '얼마씩 뛰어 세었을까요? (1000만, 2억처럼 써도 돼요)')
    w.hint('두 수에서 숫자가 바뀐 자리를 찾고, 그 자리 숫자가 얼마씩 커졌는지 봐요.')
    w.pic(hop_svg(['2400만', '3400만', '4400만', '5400만']), 130)
    w.ask('2400만 – 3400만 – 4400만 – 5400만은 얼마씩 뛰어 세었나요?')
    w.pic(hop_svg(['1356000000', '1556000000', '1756000000', '1956000000'], fs=19), 130)
    w.ask('1356000000 – 1556000000 – …은 얼마씩 뛰어 세었나요?')
    w.choices([('두 번째 뛰어 세기에서 숫자가 변하는 자리는?', opts('억의 자리', '천만의 자리', '십억의 자리'))])
    d2 = 1556000000 - 1356000000
    w.key('%s씩' % mix(3400 * 10 ** 4 - 2400 * 10 ** 4), '%s씩(%d)' % (mix(d2), d2), deciding_place(1356000000, 1556000000) + '의 자리')
    w.step('말해 보기', '내가 정해서 3억부터 4번 뛰어 세기')
    w.text('친구는 1억씩 뛰어 세었대요: 3억, 4억, 5억, 6억, 7억. 나는 얼마씩 뛰어 셀까요?')
    w.ask('나는 (            )씩:  3억, (          ), (          ), (          ), (          )', blank=False)
    w.ask('숫자가 변한 자리: (            )의 자리', blank=False)
    w.key('학생마다 다름(예: 1000만씩 → 3억 1000만, 3억 2000만, 3억 3000만, 3억 4000만, 천만의 자리)')
    w.step('약속하기', '뛰어 세기')
    if w.basic:
        w.wordbox(['십만', '100만', '어느 자리 숫자가 얼마씩 변하는지'])
        w.fill(['10만씩 뛰어 세면 (        )의 자리 숫자가 1씩 커져요. 90만 다음 수는 (        )이에요.',
                '뛰어 세기를 할 때에는 (                                  ) 살펴봐요.'])
    else:
        w.ask('10만씩 뛰어 셀 때 90만 다음 수는?')
        w.why('뛰어 세기를 할 때 무엇을 살펴보면 좋을지 써 보세요.', n=1)
    w.key('십만, 100만, 어느 자리 숫자가 얼마씩 변하는지' if w.basic else '100만, 어느 자리 숫자가 얼마씩 변하는지 살펴봐요')
    w.step('확인하기', '빈 곳에 알맞은 수 쓰기 (‘351억’처럼 써도 돼요)')
    w.hint('먼저 이웃한 두 수를 보고 얼마씩 뛰어 세었는지 찾아요. 빈칸이 맨 앞이면 거꾸로 뛰어 세어요.')
    w.ask('120000, 150000, 180000, (            ), (            )', blank=False)
    w.ask('(          ), 451억, 551억, 651억, (          )', blank=False)
    w.ask('2180조, 2380조, (          ), 2780조, (          )', blank=False)
    w.ask('지민이는 1월부터 한 달에 30000원씩 기부했어요. 5월까지 모두 얼마를 기부했나요?')
    w.key('210000, 240000', '351억, 751억', '2580조, 2980조', '%d원' % (30000 * 5))
    if not w.basic:
        w.step('도전하기', '뛰어 세기로 문제 해결하기')
        w.ask('★에서 60만씩 3번 뛰어 세었더니 520만이 되었어요. ★은 얼마인가요?')
        w.ask('200조씩: 4013조, 4213조, 4413조, (          ), (          ), (          )', blank=False)
        w.ask('34조 2540억 – 36조 2540억 – 38조 2540억 – 40조 2540억은 얼마씩 뛰어 세었나요?')
        w.why('★을 어떻게 구했는지 써 보세요.')
        w.key('%d만' % (520 - 60 * 3), '4613조, 4813조, 5013조', '2조씩',
              '(까닭 — 예: 520만에서 60만씩 거꾸로 3번 뛰어 세었어요: 460만, 400만, 340만)')
    w.end()


def tb8(w):
    w.lesson(8, '개념 구축하기(O)', '수의 크기를 비교해 볼까요', '큰 수의 크기는 어떻게 비교할까요?',
             scene='여러 기업에서 기부한 콩 9600000 kg과 쌀 14400000 kg을 어려운 이웃에게 나누어 주려고 해요.')
    w.step('만져 보기', '자리 수가 다른 두 수 비교하기')
    w.table([['', '자리 수'], ['콩 9600000 kg', '(      )자리'], ['쌀 14400000 kg', '(      )자리']], col_mm=[90, 90])
    w.ask('9600000  (    )  14400000', blank=False)
    w.key('%d자리, %d자리' % (len('9600000'), len('14400000')), cmp(9600000, 14400000))
    a, c = 1273000000000, 1281000000000
    w.step('그려 보기', '자리 수가 같은 두 수 비교하기')
    w.pic(chart_svg(13, [('가', str(a)), ('나', str(c))]), 176)
    w.choices([('크기가 정해지는 자리는?', opts('천억의 자리', '백억의 자리', '십억의 자리'))])
    w.ask('1273000000000  (    )  1281000000000', blank=False)
    w.key(deciding_place(a, c) + '의 자리', cmp(a, c))
    w.step('말해 보기', '○ 안에 >, =, < 쓰기')
    w.hint('먼저 자리 수를 세어요. 자리 수가 같으면 높은 자리부터 차례대로 비교해요.')
    prs = [(423518, 5106730, None), (387653000, 387461000, None), (2457000, 213900, None),
           (5170320000, 5172130000, ('51억 7032만', '51억 7213만'))]
    for x, y, sh in prs:
        w.ask('%s  (    )  %s' % (sh or (x, y)), blank=False) if sh else w.ask('%d  (    )  %d' % (x, y), blank=False)
    w.key(', '.join(cmp(x, y) for x, y, _ in prs))
    w.step('약속하기', '수의 크기를 비교하는 방법')
    if w.basic:
        w.wordbox(['많은', '높은', '큰'])
        w.fill(['자리 수가 다를 때에는 자리 수가 (      ) 쪽이 더 큰 수예요.',
                '자리 수가 같을 때에는 (      ) 자리 수부터 차례대로 비교하여 높은 자리 수가 (      ) 쪽이 더 큰 수예요.'])
        w.key('많은, 높은, 큰')
    else:
        w.why('큰 수의 크기를 비교하는 방법을 내 말로 써 보세요.', n=3)
        w.key('(예: 자리 수가 다르면 자리 수가 많은 쪽이 더 커요. 같으면 높은 자리부터 비교해 높은 자리 수가 큰 쪽이 더 커요)')
    w.step('확인하기', '우주 발사체 개발 비용 (출처: 한국항공우주연구원, 2023)')
    items = [('나로호', '약 5025억 원', 502500000000), ('누리호', '약 1조 9572억 원', 1957200000000),
             ('다누리호', '약 236700000000원', 236700000000)]
    w.table([['이름', '개발 비용', '0을 모두 써서']] + [[n, s, '' if w.basic else '-'] for n, s, _ in items]
            if w.basic else [['이름', '개발 비용']] + [[n, s] for n, s, _ in items],
            col_mm=[40, 70, 70] if w.basic else [60, 120])
    w.ask('개발 비용이 많은 것부터:  (          ) > (          ) > (          )', blank=False)
    order = ' > '.join(n for n, s, v in sorted(items, key=lambda t: -t[2]))
    if w.basic:
        w.key(', '.join(str(v) for _, _, v in items), order)
    else:
        w.key(order)
    if not w.basic:
        w.step('도전하기', '큰 수의 크기 비교 더 해 보기')
        ok = [d for d in range(10) if 19462700 < int('194%d2700' % d)]
        w.ask('19462700 < 194□2700에서 □ 안에 들어갈 수 있는 수를 모두 써 보세요.')
        w.ask('작은 수부터 차례대로 기호를 써 보세요.   ㉠ 290만   ㉡ 292000000   ㉢ 293000')
        w.ask('창덕궁 관람객 수예요(출처: 국가통계포털, 2023). 2020년 사십칠만 이천팔백칠십오 명, 2021년 643549명, '
              '2022년 118만 6361명. 관람객이 가장 적었던 해는?')
        w.why('□ 안에 6을 넣을 수 없는 까닭을 써 보세요.', n=1)
        three = sorted([('㉠', 2900000), ('㉡', 292000000), ('㉢', 293000)], key=lambda t: t[1])
        yrs = min([('2020년', 472875), ('2021년', 643549), ('2022년', 1186361)], key=lambda t: t[1])[0]
        w.key(', '.join(map(str, ok)), ', '.join(k for k, _ in three), yrs, '(까닭 — 예: 6을 넣으면 두 수가 같아져서 < 가 아니에요)')
    w.end()


POP = [('프랑스', '6794만 명', 67940000), ('카자흐스탄', '천구백육십이만 명', 19620000),
       ('중국', '14억 1218만 명', 1412180000), ('미국', '삼억 삼천삼백이십구만 명', 333290000),
       ('대한민국', '오천백육십삼만 명', 51630000), ('필리핀', '1억 1556만 명', 115560000),
       ('남아프리카 공화국', '59890000명', 59890000), ('인도', '십사억 천칠백십칠만 명', 1417170000),
       ('브라질', '2억 1531만 명', 215310000), ('호주', '2598만 명', 25980000)]
POPD = {n: v for n, _, v in POP}


def tb9(w):
    w.lesson(9, '탐구 정리하기(O)', '생각을 더하다 ― 세계 여러 나라의 인구를 비교해 볼까요',
             '형태가 다른 큰 수의 크기를 어떻게 비교할까요?',
             scene='2022년 세계 여러 나라의 인구예요(출처: 세계은행, 2023). 대한민국의 인구는 51630000명이에요.')
    four = ['중국', '인도', '필리핀']
    w.step('수로 쓰기', '0을 모두 써서 나타내기')
    w.hint('14억 1218만 → 14 / 1218 / 0000')
    w.table([['나라', '인구', '0을 모두 써서']] + [[n, s, '(                    )명'] for n, s, v in POP if n in four],
            col_mm=[35, 65, 80])
    w.key(', '.join('%s %d' % (n, POPD[n]) for n in four))
    w.step('차례 정하기', '인구가 많은 나라부터')
    w.ask('대한민국, 중국, 인도, 필리핀:  (        ) > (        ) > (        ) > (        )', blank=False)
    w.key(' > '.join(sorted(['대한민국'] + four, key=lambda n: -POPD[n])))
    w.step('말해 보기', '인구를 비교하며 알게 된 것')
    w.ask('필리핀보다 인구가 많은 나라를 모두 써 보세요.')
    w.choices([('중국과 인도의 인구는 어느 자리에서 크기가 정해지나요?', opts('천만의 자리', '백만의 자리', '십만의 자리'))])
    w.key(', '.join(n for n in ['대한민국', '중국', '인도'] if POPD[n] > POPD['필리핀']),
          deciding_place(POPD['중국'], POPD['인도']) + '의 자리')
    w.step('정리하기', '형태가 다른 큰 수를 비교하는 방법')
    if w.basic:
        w.wordbox(['같은 형태로 바꾸어요', '자리 수', '높은 자리'])
        w.fill(['수의 형태가 다르면 먼저 (                      ). 그다음 (          )를 비교하고,',
                '자리 수가 같으면 (            ) 수부터 차례대로 비교해요.'])
        w.key('같은 형태로 바꾸어요, 자리 수, 높은 자리')
    else:
        w.why('형태가 다른 큰 수를 비교하는 방법을 차례대로 써 보세요.', n=3)
        w.key('(예: 먼저 같은 형태로 바꾸고, 자리 수를 비교한 뒤, 같으면 높은 자리부터 비교해요)')
    six = ['프랑스', '카자흐스탄', '미국', '남아프리카 공화국', '호주', '브라질']
    w.step('확인하기', '세 나라를 골라 인구가 적은 나라부터')
    if w.basic:
        w.table([['나라', '인구', '0을 모두 써서']] + [[n, s, ''] for n, s, v in POP if n in six], col_mm=[45, 65, 70])
    else:
        w.table([['나라', '인구']] + [[n, s] for n, s, v in POP if n in six], col_mm=[70, 110])
    w.ask('내가 고른 세 나라:  (            ) < (            ) < (            )', blank=False)
    asc = sorted(six, key=lambda n: POPD[n])
    w.key(('%s / ' % ', '.join('%s %d' % (n, POPD[n]) for n in six) if w.basic else '')
          + '학생마다 다름(전체 차례: %s)' % ' < '.join(asc))
    if not w.basic:
        w.step('도전하기', '여섯 나라 모두 인구가 적은 나라부터')
        w.ask('(          ) < (          ) < (          ) < (          ) < (          ) < (          )', blank=False)
        w.why('8자리 수와 9자리 수를 어떻게 이용했는지 써 보세요.')
        w.key(' < '.join(asc), '(까닭 — 예: 8자리 수인 나라가 9자리 수인 나라보다 적고, 같은 자리 수끼리는 높은 자리부터 비교했어요)')
    w.end()


def tb10(w):
    w.lesson(10, '발표하기(P)', '놀이를 더하다 ― 도전! 연속된 세 칸을 먼저 색칠해요!',
             '수 카드 3장으로 가장 큰 수를 만들려면 어떻게 놓아야 할까요?')
    w.step('놀이 방법 알기')
    w.text('① 수 카드 12장을 섞어 뒤집어 놓아요. ② 순서대로 카드를 3장 가져와 모두 사용하여 가장 큰 수를 만들어요. '
           '③ 만든 수의 크기를 비교해요. ④ 더 큰 수를 만든 사람이 자기 카드 중 1장을 골라 놀이판에서 그 수를 찾아 '
           '한 칸만 색칠해요(이미 색칠된 칸은 안 돼요). ⑤ 연속된 세 칸을 먼저 색칠하는 사람이 이겨요.')
    w.choices([('놀이판에 색칠할 수 있는 사람은?', opts('더 큰 수를 만든 사람', '두 사람 모두')),
               ('이미 색칠된 칸을 다시 색칠할 수 있나요?', opts('있어요', '없어요')),
               ('놀이에서 이기는 사람은?', opts('연속된 세 칸을 먼저 색칠한 사람', '가장 큰 카드를 가진 사람'))])
    w.key('더 큰 수를 만든 사람, 없어요, 연속된 세 칸을 먼저 색칠한 사람')
    sets = [['9', '93', '406'], ['8', '805', '25'], ['3', '370', '42']]
    w.step('가장 큰 수 만들기', '카드 3장을 모두 사용하기')
    w.hint('9와 93 중 무엇을 앞에 놓을지 두 가지로 놓아 보고 비교해요: 993과 939')
    w.table([['카드 3장', '가장 큰 수']] + [[',  '.join(s), ''] for s in sets], col_mm=[80, 100])
    w.key(', '.join(biggest(s) for s in sets))
    w.step('크기 비교하기', '자리 수부터 세어요')
    w.ask('예준(7, 406, 158) 7406158  (    )  친구(93, 61, 8) 93861', blank=False)
    w.ask('예준(805, 42, 3) 805423  (    )  친구(370, 25, 9) 937025', blank=False)
    w.choices([('두 번째에서 크기가 정해지는 자리는?', opts('십만의 자리', '만의 자리', '천의 자리'))])
    w.key(cmp(7406158, 93861), cmp(805423, 937025), deciding_place(805423, 937025) + '의 자리')
    w.step('놀이하기', '친구와 놀이를 하고 기록해요 (파란색: 나, 빨간색: 상대)')
    w.pic(board_svg(TB_BOARD), 75)
    w.table([['판', '내 카드', '내가 만든 수', '부등호', '상대가 만든 수', '색칠한 칸']] + [[str(k), '', '', '', '', ''] for k in (1, 2)],
            col_mm=[14, 36, 36, 20, 36, 38])
    w.key('학생마다 다름')
    w.step('발표하기')
    if w.basic:
        w.labeled([('카드 놓기', '숫자가 ______ 카드를 모두 쓰고, 맨 앞에 ______ 숫자가 오도록 놓아요.'),
                   ('나의 전략', '상대가 두 칸을 이으면 ______________________.')])
    else:
        w.ask('카드 3장으로 가장 큰 수를 만들 때 어떻게 카드를 놓았나요?', blank=False)
        w.lines(1)
        w.ask('연속된 세 칸을 먼저 색칠하기 위한 나의 전략은?', blank=False)
        w.lines(1)
    w.key('(생각 쓰기 — 예: 맨 앞에 큰 숫자가 오도록 놓아요 / 상대가 두 칸을 이으면 남은 한 칸을 먼저 막아요)')
    if not w.basic:
        c1 = {4: 'me', 5: 'me', 2: 'cpu', 10: 'cpu'}
        c2 = {8: 'cpu', 9: 'cpu', 0: 'me', 7: 'me'}
        flat = [x for r in TB_BOARD for x in r]
        win = [flat[i] for i in win_cell(c1, 'me') if flat[i] in ('61', '9', '158')]
        block = [flat[i] for i in win_cell(c2, 'cpu') if flat[i] in ('42', '7', '406')]
        assert len(win) == 1 and len(block) == 1
        w.step('도전하기', '어느 칸을 색칠해야 할까요? (나: 파란색, 상대: 빨간색)')
        w.pic(board_pair_svg(TB_BOARD, c1, c2), 170)
        w.ask('가: 내 카드는 61, 9, 158이에요. 바로 이기려면 어느 수를 색칠해야 하나요?')
        w.ask('나: 내 카드는 42, 7, 406이에요. 상대가 이기지 못하게 막으려면 어느 수를 색칠해야 하나요?')
        w.why('나에서 그 칸을 고른 까닭을 써 보세요.', n=1)
        w.key(win[0], block[0], '(까닭 — 예: 상대가 370과 9를 이어서 42 칸을 칠하면 상대가 이기기 때문이에요)')
    w.end()


def tb11(w):
    w.lesson(11, '발표하기(P)', '공부한 내용을 확인해요', '큰 수를 읽고 쓰고, 뛰어 세고, 크기를 비교할 수 있나요?')
    w.step('확인 1', '만과 다섯 자리 수')
    w.ask('10000은 9000보다 (        )만큼 더 큰 수예요.', blank=False)
    w.ask('10000이 8개, 1000이 3개, 100이 4개, 10이 9개, 1이 2개인 수를 쓰고 읽어 보세요.')
    w.key(10000 - 9000, '83492(%s)' % rd(83492))
    w.step('확인 2', '큰 수를 쓰고 읽고, 숫자가 나타내는 값 알기 (예: 35만 – 350000 – 삼십오만)')
    w.ask('1089억을 0을 모두 써서 나타내 보세요.')
    w.ask('268만(2680000)을 읽어 보세요.')
    w.ask('59804620000에서 숫자 8이 나타내는 값은?')
    w.ask('8259107930000에서 숫자 8이 나타내는 값은?')
    w.key(1089 * 10 ** 8, rd(2680000), digit_value(59804620000, 8), digit_value(8259107930000, 8))
    w.step('확인 3', '뛰어 세기와 크기 비교')
    w.ask('506억, (          ), 546억, 566억, (          )', blank=False)
    w.ask('82570000, 83570000, (              ), 85570000, (              )', blank=False)
    w.ask('932800  (    )  1263840          72648392800  (    )  72503840510', blank=False)
    w.key('526억, 586억', '%d, %d' % (84570000, 86570000), '%s, %s' % (cmp(932800, 1263840), cmp(72648392800, 72503840510)))
    w.step('확인 4', '2020년 나라별 등록된 자동차 수 (출처: 국가통계포털, 2023)')
    w.table([['대한민국', '미국', '스위스', '이집트'], ['24365979대', '2억 8903만 7000대', '㉠ 오백이십칠만 사천사백칠십삼 대', '7162200대']],
            row_h=4500)
    w.ask('㉠을 수로 써 보세요.')
    w.ask('이집트보다 등록된 자동차 수가 많은 나라를 모두 써 보세요.')
    cars = {'대한민국': 24365979, '미국': 289037000, '스위스': 5274473}
    w.key('5274473대', ', '.join(n for n, v in cars.items() if v > 7162200))
    w.step('확인 5', '1부터 5까지의 수를 한 번씩 모두 사용하여 다섯 자리 수 만들기')
    w.text('민우: 5만보다 큰 수야.  유주: 천의 자리 숫자가 4, 백의 자리 숫자가 2인 수야.  나은: 일의 자리 숫자가 가장 작아.')
    w.hint('5만보다 크려면 만의 자리 숫자가 5여야 해요.')
    w.ask('세 친구의 설명에 맞는 수는?')
    sol = [''.join(p) for p in itertools.permutations('12345')
           if int(''.join(p)) > 50000 and p[1] == '4' and p[2] == '2' and p[4] == '1']
    assert sol == ['54231']
    w.key(sol[0])
    if not w.basic:
        w.step('도전하기', '꼭꼭 — □ 안에 알맞은 수')
        w.ask('100만이 100개인 수는 (      )억이에요.', blank=False)
        w.ask('10000은 9980보다 (      )만큼 더 큰 수예요.', blank=False)
        w.ask('17062845에서 7000000을 나타내는 숫자를 써 보세요.')
        w.ask('41조에서 3조씩 두 번 뛰어 세면 (      )조예요.', blank=False)
        w.why('이 단원에서 가장 자신 있는 것과 더 연습하고 싶은 것을 써 보세요.')
        w.key(10 ** 6 * 100 // 10 ** 8, 10000 - 9980, str(17062845)[1], 41 + 3 * 2, '(생각 쓰기)')
    w.end()


# ================================================================ 이야기 버전
def st1(w):
    w.lesson(1, '개념 찾기(S)', '우주 탐험대가 되었어요', '우주 이야기에는 왜 0이 많은 큰 수가 자주 나올까요?',
             scene='4학년 3반 26명이 ‘우주 탐험대’가 되었어요. 다음 달 우주 과학관 견학을 앞두고 대장 하늘이와 서아, 도윤, '
                   '민준, 지우, 라온이가 함께 탐험 일지를 써요.')
    w.step('만져 보기 — 보기·생각하기·궁금해하기', '견학 안내문을 보고 칸에 한 가지씩 써요')
    w.text('안내문: 견학비 10000원, 지구에서 달까지 약 384400 km, 지구에서 태양까지 약 150000000 km')
    if w.basic:
        w.labeled([('보여요', '안내문에 ______________ 이(가) 보여요.'),
                   ('생각해요', '______________ 인 것 같아요.'),
                   ('궁금해요', '______________ 은(는) 어떻게 할까?')])
    else:
        w.labeled([('보여요', ''), ('생각해요', ''), ('궁금해요', '')])
    w.key('(생각 쓰기 — 예: 견학비 10000원이 보여요 / 150000000은 0이 7개나 있어서 아주 큰 수인 것 같아요 / 150000000은 어떻게 읽을까?)')
    cards = [('견학비 (한 사람)', '10000원'), ('우리 반 탐험대원', '26명'), ('지구에서 달까지 (약)', '384400 km'),
             ('망원경으로 찾은 별자리', '7개'), ('지구 둘레 (약)', '40000 km'), ('천체투영관 의자', '120개')]
    w.step('그려 보기 — 큰 수에 동그라미', '숫자가 다섯 개 이상인 수에 ○표')
    w.hint('카드에 적힌 수의 숫자가 몇 개인지 세어 봐요. 120은 숫자가 3개, 40000은 숫자가 5개예요.')
    w.table([['안내문 속 내용', '수', '○표']] + [[t, v, ''] for t, v in cards], col_mm=[95, 50, 35])
    w.key('○: ' + ', '.join(v for t, v in cards if len(''.join(ch for ch in v if ch.isdigit())) >= 5))
    w.step('말해 보기 — 네 자리 수 떠올리기', '우주 퀴즈 최고 점수 ‘이천칠십오 점’')
    w.table([['', '천의 자리', '백의 자리', '십의 자리', '일의 자리'], ['숫자', b, b, b, b]])
    w.why('왜 그럴까요? 2075에서 백의 자리에 0 카드를 놓아야 하는 까닭은?',
          '‘왜냐하면 백의 자리 숫자가 ~이고, 0을 놓지 않으면 ~이 되기 때문이에요.’', n=1)
    w.key('2, 0, 7, 5', '왜: (예: 이천칠십오에는 백이 없어서 백의 자리 숫자가 0이고, 0을 놓지 않으면 275처럼 다른 수가 되기 때문이에요)')
    w.step('약속하기 — 네 자리 수 비교 떠올리기')
    if w.basic:
        w.fill(['네 자리 수의 크기는 %s 자리 숫자부터 차례대로 비교해요.' % opts('낮은', '높은'),
                '2075와 2105는 천의 자리 숫자가 같으니 %s 숫자를 비교해요. 그래서 2075 %s 2105예요.'
                % (opts('십의 자리', '백의 자리', '일의 자리'), opts('>', '<'))])
    else:
        w.fill(['네 자리 수의 크기는 (        ) 자리 숫자부터 차례대로 비교해요.',
                '2075와 2105는 천의 자리 숫자가 같으니 (            ) 숫자를 비교해요. 그래서 2075 (    ) 2105예요.'])
    w.key('높은, 백의 자리, ' + cmp(2075, 2105))
    w.step('확인하기 — 큰 수가 필요한 곳')
    sit = [('지구에서 태양까지의 거리를 나타낼 때', 1), ('우리 반 탐험대원 수를 셀 때', 0),
           ('과학관에 1년 동안 온 관람객 수를 나타낼 때', 1), ('필통 속 연필 수를 셀 때', 0)]
    w.choices([(t, '( 필요해요 / 필요 없어요 )') for t, _ in sit])
    w.ask('8640  (    )  8604          999  (    )  1000', blank=False)
    w.key(', '.join('필요해요' if n else '필요 없어요' for _, n in sit), cmp(8640, 8604) + ', ' + cmp(999, 1000))
    if not w.basic:
        w.step('도전하기', '서아의 견학비 모으기')
        w.ask('서아가 1000원짜리 지폐 9장을 모았어요. 모두 얼마인가요?')
        w.ask('가장 큰 네 자리 수 9999보다 1만큼 더 큰 수를 숫자로 쓰고, 몇 자리 수인지 써 보세요.')
        w.why('9999에 1을 더하면 어떻게 되는지 받아올림으로 설명해 보세요.')
        w.key('9000원, 10000(다섯 자리 수)', '(까닭 — 예: 일의 자리부터 차례로 받아올림하여 만의 자리에 1이 생겨요)')
    w.end()


def st2(w):
    w.lesson(2, '개념 구축하기(O)', '견학비 만 원을 모아요 ― 만', '1000이 10개인 수는 어떻게 쓰고 읽을까요?',
             scene='견학비는 한 사람에 10000원이에요. 서아는 용돈에서 1000원짜리 지폐를 한 장씩 모으고 있어요.')
    w.step('만져 보기 — 1000원씩 모으기', '먼저 예상하고 지폐를 놓아 봐요')
    w.predict('1000원짜리 지폐 몇 장을 모으면 견학비 10000원이 될까요?',
              '‘내 예상: 1000원짜리 ~장이 모이면 10000원이 될 것 같아요.’ 꼴로 써요.')
    w.table([['1000원짜리', '7장', '8장', '9장', '10장'], ['금액', '7000원', '', '', '']])
    w.ask('1000원짜리 10장은 10000원짜리 지폐 몇 장과 같은 금액인가요?')
    w.predict_check()
    w.key('8000원, 9000원, 10000원', '1장', '예상: (생각 쓰기 — 예: 10장)')
    w.step('그려 보기 — 수직선 확대하기')
    w.pic(numline_svg([(6000, 1000), (9600, 100), (9960, 10), (9996, 1)]), 150)
    w.fill('10000은 9000보다 (      ), 9900보다 (      ), 9990보다 (      ), 9999보다 (      )만큼 더 큰 수예요.')
    w.key(', '.join(str(10000 - v) for v in (9000, 9900, 9990, 9999)))
    w.step('말해 보기 — 10배씩 커지는 수')
    w.pic(chain_svg([1, 10, None, 1000, None]), 140)
    w.ask('10000은 1000의 (      )배, 100의 (      )배, 10의 (      )배예요.', blank=False)
    w.why('왜 그럴까요? 10000이 100의 100배인 까닭은?',
          '‘왜냐하면 100의 10배는 ~이고, ~의 10배가 10000이기 때문이에요.’', n=1)
    w.key('100, 10000', '%d배, %d배, %d배' % (10000 // 1000, 10000 // 100, 10000 // 10),
          '왜: (예: 100의 10배는 1000이고 1000의 10배가 10000이라서 100이 100개 모여야 10000이에요)')
    w.step('약속하기 — 만')
    if w.basic:
        w.fill('1000이 10개인 수를 %s 또는 %s이라 쓰고, %s이라고 읽어요.'
               % (opts('1000만', '10000', '100000'), opts('10천', '1만', '100만'), opts('십천', '천십', '만 또는 일만')))
    else:
        w.fill('1000이 10개인 수를 (          ) 또는 (        )이라 쓰고, (        ) 또는 (        )이라고 읽어요.')
    w.key('10000, 1만, 만 또는 일만')
    w.step('확인하기 — 저금통 동전으로 만 원', '도윤이의 저금통')
    w.hint('100원짜리 10개는 1000원, 10원짜리 100개는 1000원이에요.')
    w.table([['', '100원짜리 동전만', '10원짜리 동전만'], ['10000원이 되는 동전 수', '(      )개', '(      )개']])
    w.key('%d개, %d개' % (10000 // 100, 10000 // 10))
    if not w.basic:
        w.step('도전하기', '견학비 10000원을 여러 가지로')
        w.ask('설명하는 수가 다른 하나는?  ㉠ 9990보다 10만큼 더 큰 수  ㉡ 1000이 10개인 수  ㉢ 9000보다 100만큼 더 큰 수  '
              '㉣ 10이 1000개인 수')
        w.ask('지우는 견학비 10000원 중에서 6000원을 냈어요. 얼마를 더 내야 하나요?')
        w.ask('5000원짜리 지폐만으로 견학비 10000원을 내려면 몇 장이 필요한가요?')
        w.why('설명하는 수가 다른 하나를 어떻게 찾았는지 써 보세요.')
        vals = {'㉠': 9990 + 10, '㉡': 1000 * 10, '㉢': 9000 + 100, '㉣': 10 * 1000}
        w.key([k for k, v in vals.items() if v != 10000][0], '%d원' % (10000 - 6000), '%d장' % (10000 // 5000),
              '(까닭 — 예: ㉢은 9100이고 나머지는 모두 10000이에요)')
    w.end()


def st3(w):
    w.lesson(3, '개념 구축하기(O)', '우주 간식 통장 ― 다섯 자리 수',
             '10000이 3개, 1000이 2개, 100이 6개, 10이 0개, 1이 4개인 수는 어떻게 쓰고 읽을까요?',
             scene='우주 탐험대 ‘우주 간식’ 통장에 32604원이 모였어요.')
    w.step('만져 보기 — 간식 통장 금액 만들기', '돈 모형으로 32604원')
    w.hint('10000원짜리부터 놓아요. 32604에서 10000은 몇 개 들어 있나요?')
    w.table([['10000원', '1000원', '100원', '10원', '1원'], ['(    )장', '(    )장', '(    )개', '(    )개', '(    )개']])
    w.key('/'.join('32604'))
    w.step('그려 보기 — 관람객 수를 표에', '지난달 관람객 40527명')
    w.table([['', '만의 자리', '천의 자리', '백의 자리', '십의 자리', '일의 자리'], ['숫자', '', '', '', '', '']])
    w.fill('40527 = (          ) + 500 + 20 + 7      읽기: (                        )')
    w.key('4, 0, 5, 2, 7', '40000, ' + rd(40527))
    w.step('말해 보기 — 같은 숫자, 다른 값', '기념품 가게 하루 판매 금액 72471원')
    w.ask('만의 자리 숫자 7이 나타내는 값은?')
    w.ask('십의 자리 숫자 7이 나타내는 값은?')
    w.fill('72471 = 70000 + (        ) + 400 + (      ) + 1')
    w.why('왜 그럴까요? 72471에서 두 7이 나타내는 값이 다른 까닭은?',
          '‘왜냐하면 앞의 7은 ~의 자리에 있어서 ~을, 뒤의 7은 ~의 자리에 있어서 ~을 나타내기 때문이에요.’', n=1)
    w.key('70000, 70, 2000, 70', '왜: (예: 앞의 7은 만의 자리에 있어서 70000을, 뒤의 7은 십의 자리에 있어서 70을 나타내요)')
    w.step('약속하기 — 다섯 자리 수')
    if w.basic:
        w.fill(['10000이 3개, 1000이 2개, 100이 6개, 10이 0개, 1이 4개인 수를 %s 또는 %s라 쓰고,'
                % (opts('3264', '32604', '302604'), opts('3만 2604', '32만 604', '3만 264')),
                '%s라고 읽어요.' % opts('삼만 이천육백영사', '삼 이 육 영 사', '삼만 이천육백사')])
    else:
        w.fill('10000이 3개, 1000이 2개, 100이 6개, 10이 0개, 1이 4개인 수를 (          ) 또는 (            )라 쓰고, '
               '(                      )라고 읽어요.')
    w.key('32604, %s, %s' % (mix(32604), rd(32604)))
    w.step('확인하기 — 쓰고 읽기')
    w.hint('숫자가 0인 자리는 읽지 않아요. 읽은 말에 없는 자리에는 0을 써요.')
    w.ask('칠만 오백구를 수로 써 보세요.')
    w.ask('60380을 읽어 보세요.')
    w.ask('10000이 5개, 100이 8개, 1이 3개인 수를 써 보세요.')
    w.ask('숫자 4가 4000을 나타내는 수는?   ㉠ 84213   ㉡ 12340   ㉢ 40917')
    k4 = [k for k, n in (('㉠', 84213), ('㉡', 12340), ('㉢', 40917)) if digit_value(n, 4) == 4000][0]
    w.key(70509, rd(60380), 5 * 10000 + 8 * 100 + 3, k4)
    if not w.basic:
        cards = '70429'
        ps = [int(''.join(p)) for p in itertools.permutations(cards) if p[0] != '0']
        w.step('도전하기', '탐험대 수 카드 7, 0, 4, 2, 9를 한 번씩 모두 사용하기')
        w.ask('가장 큰 다섯 자리 수를 쓰고 읽어 보세요.')
        w.ask('가장 작은 다섯 자리 수를 쓰고 읽어 보세요.')
        w.why('가장 작은 수를 만든 방법을 써 보세요.')
        w.key('%d(%s), %d(%s), (까닭 — 예: 만의 자리에는 0을 놓을 수 없어서 2를 놓고, 남은 수를 작은 수부터 놓았어요)'
              % (max(ps), rd(max(ps)), min(ps), rd(min(ps))))
    w.end()


def st4(w):
    w.lesson(4, '개념 구축하기(O)', '과학관을 다녀간 사람들 ― 십만, 백만, 천만',
             '10000이 10개, 100개, 1000개인 수는 어떻게 쓰고 읽을까요?',
             scene='우주 과학관 안내판에 ‘관람객 1만 명 → 10만 명 → 100만 명 → 1000만 명 돌파!’라고 쓰여 있어요.')
    w.step('만져 보기 — 10개씩 모으기', '먼저 예상하고 10배씩 키워 봐요')
    w.predict('1만에서 10개씩 3번 모으면 0이 몇 개인 수가 될까요?',
              '‘내 예상: 10개씩 모을 때마다 0이 ~개씩 늘어서 ~이 될 것 같아요.’ 꼴로 써요.')
    w.table([['1만', '10만', '100만', '1000만'], ['10000', '', '', '']])
    w.ask('10000이 1000개인 수에는 0이 몇 개 있나요?')
    w.predict_check()
    w.key('100000, 1000000, 10000000', '%d개' % str(10000 * 1000).count('0'), '예상: (생각 쓰기)')
    v = 20480000
    w.step('그려 보기 — 2048만을 표에', '지금까지 다녀간 관람객 20480000명')
    w.hint('일의 자리부터 네 자리씩 끊으면 2048 / 0000이에요. 백만의 자리 숫자는 0이에요.')
    w.pic(chart_svg(8, [('', None)]), 120)
    w.key('천만 2, 백만 0, 십만 4, 만 8, 나머지 0')
    w.step('말해 보기 — 얼마만큼의 수일까')
    w.ask('20480000에서 숫자 2가 나타내는 값은?')
    w.choices([('20480000에서 백만의 자리 숫자는?', opts('2', '0', '4'))])
    w.fill('20480000 = 20000000 + (            ) + (            )')
    w.why('왜 그럴까요? 20480000을 ‘2048만’이라고도 쓸 수 있는 까닭은?',
          '‘왜냐하면 네 자리씩 끊으면 ~ / ~이라서 10000이 ~개인 수이기 때문이에요.’', n=1)
    w.key(digit_value(v, 2), str(v)[1], '400000, 80000', '왜: (예: 네 자리씩 끊으면 2048 / 0000이라서 10000이 2048개인 수예요)')
    w.step('약속하기 — 십만, 백만, 천만')
    if w.basic:
        w.fill(['10000이 10개인 수를 100000 또는 10만이라 쓰고 %s이라고 읽어요.' % opts('만십', '십만', '일십만'),
                '10000이 100개인 수는 %s, 1000개인 수는 %s이에요.' % (opts('100만', '10만'), opts('1억', '1000만')),
                '10000이 2048개인 수를 20480000 또는 %s이라 쓰고, %s이라고 읽어요.'
                % (opts('2048천', '2048만'), opts('이천사십팔만', '이만 사백팔십'))])
    else:
        w.fill(['10000이 10개인 수를 100000 또는 10만이라 쓰고 (        )이라고 읽어요.',
                '10000이 100개인 수는 (        ), 1000개인 수는 (        )이에요.',
                '10000이 2048개인 수를 20480000 또는 (          )이라 쓰고, (                  )이라고 읽어요.'])
    w.key('십만, 100만, 1000만, %s, %s' % (mix(v), rd(v)))
    w.step('확인하기 — 쓰고 읽기')
    w.hint('일의 자리부터 네 자리씩 끊고, 앞의 수에 ‘만’을 붙여 읽어요. 쉼표(,)는 세 자리마다 찍은 거예요.')
    w.ask('오백칠만 삼천을 수로 써 보세요.')
    w.ask('30600000을 읽어 보세요.')
    w.ask('안내판의 ‘1,250,000명’을 네 자리씩 끊어 읽어 보세요.')
    w.choices([('10만 원 묶음이 10개이면 모두 얼마인가요?', opts('10만 원', '100만 원', '1000만 원'))])
    w.key(507 * 10000 + 3000, rd(30600000), rd(1250000), '100만 원')
    if not w.basic:
        w.step('도전하기', '‘꿈나무 우주 교실’ 기금 3050000원')
        w.table([['100만 원 묶음', '10만 원 묶음', '10000원'], ['(      )개', '(      )개', '(      )장']])
        w.text('돈 모형을 가장 적게 써서 3050000원을 만들어 보세요.')
        w.why('십만의 자리 숫자가 0인 것을 어떻게 알 수 있는지 써 보세요.')
        n = 3050000
        w.key('%d개, %d개, %d장' % (n // 10 ** 6, n // 10 ** 5 % 10, n // 10 ** 4 % 10),
              '(까닭 — 예: 네 자리씩 끊으면 305 / 0000이고, 305의 가운데 숫자가 십만의 자리 숫자 0이에요)')
    w.end()


def st5(w):
    w.lesson(5, '개념 구축하기(O)', '태양까지 얼마나 멀까 ― 억', '1000만이 10개인 수는 어떻게 쓰고 읽을까요?',
             scene='지구에서 태양까지는 약 150000000 km래요(어림값).')
    w.step('만져 보기 — 1억까지 모으기', '1만에서 10개씩 모아 10배씩')
    w.pic(chain_svg(['1만', '10만', '100만', '1000만', None], '10개'), 150)
    w.ask('1000만이 10개인 수를 0을 모두 써서 나타내 보세요.')
    w.ask('지구에서 태양까지 약 1억 5000만 km예요. 1억 5000만을 0을 모두 써서 나타내 보세요.')
    w.key('1억', 10 ** 8, 15000 * 10 ** 4)
    v = 1430000000
    w.step('그려 보기 — 토성까지의 거리', '태양에서 토성까지 약 1430000000 km')
    w.hint('일의 자리부터 네 자리씩 끊으면 14 / 3000 / 0000이에요.')
    w.pic(chart_svg(12, [('', None)]), 165)
    w.key('십억 1, 억 4, 천만 3, 나머지 0')
    w.step('말해 보기 — 얼마만큼의 수일까')
    w.fill('1430000000 = (                ) + 400000000 + (              )')
    w.choices([('1430000000에서 숫자 1은 몇의 자리 숫자인가요?', opts('억의 자리', '십억의 자리', '백억의 자리')),
               ('1억이 10개, 100개, 1000개인 수는?', opts('10만, 100만, 1000만', '10억, 100억, 1000억'))])
    w.why('왜 그럴까요? 1430000000을 ‘십사억 삼천만’이라고 읽는 까닭은?',
          '‘왜냐하면 네 자리씩 끊으면 ~ / ~ / ~이라서 1억이 ~개, 1만이 ~개이기 때문이에요.’', n=1)
    assert rd(v) == '십사억 삼천만'
    w.key('1000000000, 30000000', PLACE[len(str(v)) - 1] + '의 자리', '10억, 100억, 1000억',
          '왜: (예: 네 자리씩 끊으면 14 / 3000 / 0000이라서 1억이 14개, 1만이 3000개예요)')
    w.step('약속하기 — 억')
    if w.basic:
        w.fill(['1000만이 10개인 수를 %s 또는 %s이라 쓰고, %s이라고 읽어요.'
                % (opts('10000000', '100000000'), opts('1억', '1000만'), opts('천만', '억 또는 일억')),
                '태양에서 해왕성까지는 약 45억 km예요. 45억은 1억이 %s인 수예요.' % opts('4500개', '45개', '450개')])
    else:
        w.fill(['1000만이 10개인 수를 (              ) 또는 (      )이라 쓰고, (      ) 또는 (      )이라고 읽어요.',
                '태양에서 해왕성까지는 약 45억 km예요. 45억은 1억이 (        )개인 수예요.'])
    w.key('100000000, 1억, 억 또는 일억, 45개')
    w.step('확인하기 — 행성까지의 거리', '태양에서 행성까지 (어림값)')
    w.hint('일의 자리부터 네 자리씩 끊고 억, 만을 붙여 읽어요. 778000000 → 7 / 7800 / 0000')
    w.ask('화성까지 약 이억 이천팔백만 km를 수로 써 보세요.')
    w.ask('목성까지 약 778000000 km를 읽어 보세요.')
    w.ask('천왕성까지 약 2870000000 km를 읽어 보세요.')
    w.ask('해왕성까지 약 45억 km를 0을 모두 써서 나타내 보세요.')
    w.key('%d km' % (2 * 10 ** 8 + 2800 * 10 ** 4), rd(778000000), rd(2870000000), '%d km' % (45 * 10 ** 8))
    if not w.basic:
        n = 3500 * 10 ** 8 + 260 * 10 ** 4
        s = '504360000000'
        good = '㉠' if digit_value(int(s), 5) == 5000 * 10 ** 8 else '?'
        w.step('도전하기', '억 단위의 수 더 알아보기')
        w.ask('우리 은하에는 별이 1000억 개가 넘는다고 해요. 1000억을 0을 모두 써서 나타내 보세요.')
        w.ask('1억이 3500개, 1만이 260개인 수를 쓰고 읽어 보세요.')
        w.ask('504360000000에 대해 옳게 말한 것은?  ㉠ 숫자 5는 5000억을 나타내요.  ㉡ 숫자 3은 백억의 자리 숫자예요.  '
              '㉢ 십억의 자리 숫자는 0이에요.')
        w.why('옳지 않은 것 하나를 골라 바르게 고쳐 써 보세요.')
        w.key(1000 * 10 ** 8, '%d(%s)' % (n, rd(n)), good, '(예: ㉡ 숫자 3은 억의 자리 숫자예요 / ㉢ 십억의 자리 숫자는 4예요)')
    w.end()


def st6(w):
    w.lesson(6, '개념 구축하기(O)', '빛이 1년 동안 가는 거리 ― 조', '1000억이 10개인 수는 어떻게 쓰고 읽을까요?',
             scene='이웃 은하인 안드로메다은하에는 별이 약 1조 개 있다고 해요(어림값).')
    w.step('만져 보기 — 1조까지 모으기', '먼저 예상하고 1억에서 10배씩 키워 봐요')
    w.predict('1억에서 10개씩 4번 모으면 어떤 수가 될까요?', '‘내 예상: 1억 → ~ → ~ → ~ → ~이 될 것 같아요.’ 꼴로 써요.')
    w.pic(chain_svg(['1억', '10억', None, None, None], '10개'), 150)
    w.ask('1000억이 10개인 수를 0을 모두 써서 나타내 보세요.')
    w.predict_check()
    w.key('100억, 1000억, 1조', 10 ** 12, '예상: (생각 쓰기)')
    v = 9460000000000
    w.step('그려 보기 — 1광년을 표에', '빛이 1년 동안 가는 거리 약 9460000000000 km')
    w.hint('일의 자리부터 네 자리씩 끊으면 9 / 4600 / 0000 / 0000이에요.')
    w.pic(chart_svg(16, [('', None)]), 176)
    w.key('조 9, 천억 4, 백억 6, 나머지 0')
    w.step('말해 보기 — 얼마만큼의 수일까')
    w.fill('9460000000000 = (                    ) + 400000000000 + (                  )')
    w.choices([('9460000000000에서 숫자 4는 몇의 자리 숫자인가요?', opts('백억의 자리', '천억의 자리', '조의 자리'))])
    w.why('왜 그럴까요? 9460000000000을 ‘9조 4600억’이라고 쓰는 까닭은?',
          '‘왜냐하면 네 자리씩 끊으면 ~이라서 1조가 ~개, 1억이 ~개이기 때문이에요.’', n=1)
    w.key('9000000000000, 60000000000', '천억의 자리', '왜: (예: 네 자리씩 끊으면 9 / 4600 / 0000 / 0000이라서 1조가 9개, 1억이 4600개예요)')
    w.step('약속하기 — 조')
    if w.basic:
        w.fill(['1000억이 10개인 수를 %s 또는 %s라 쓰고, %s라고 읽어요.'
                % (opts('1000000000000', '100000000000'), opts('10억', '1조'), opts('조 또는 일조', '십억')),
                '1조가 9개, 1억이 4600개인 수는 %s이에요.' % opts('9억 4600만', '9조 4600억', '94조 600억')])
    else:
        w.fill(['1000억이 10개인 수를 (                    ) 또는 (      )라 쓰고, (      ) 또는 (      )라고 읽어요.',
                '1조가 9개, 1억이 4600개인 수는 (              )이에요.'])
    w.key('1000000000000, 1조, 조 또는 일조, %s' % mix(v))
    w.step('확인하기 — 쓰고 읽기')
    w.hint('조, 억, 만 사이에는 네 자리씩 있어요. 50080000000000 → 50 / 0800 / 0000 / 0000')
    w.ask('삼조 칠백억 이십만을 수로 써 보세요.')
    w.ask('50080000000000을 읽어 보세요.')
    w.ask('1조가 10개인 수를 써 보세요.')
    w.ask('설명하는 수가 다른 하나는?  ㉠ 1000억이 10개인 수  ㉡ 10억이 1000개인 수  ㉢ 9999억보다 1억만큼 더 큰 수  '
          '㉣ 1억이 1000개인 수')
    E = 10 ** 8
    vals = {'㉠': 1000 * E * 10, '㉡': 10 * E * 1000, '㉢': 9999 * E + E, '㉣': E * 1000}
    T = 10 ** 12
    w.key(3 * T + 700 * E + 20 * 10 ** 4, rd(50080000000000), 10 * T, [k for k, x in vals.items() if x != T][0])
    if not w.basic:
        ex = 9 * T + 4600 * E + 25 * 10 ** 4
        assert str(ex) == '9460000250000'
        w.step('도전하기', '탐험 일지에 나만의 큰 수 적기')
        w.text('‘1조가 □개, 1억이 □개, 1만이 □개인 수’의 □를 마음대로 채우고 수로 써 보세요.')
        w.text('예: 1조가 9개, 1억이 4600개, 1만이 25개인 수 → 9조 4600억 25만 → 9460000250000')
        w.ask('1조가 (      )개, 1억이 (      )개, 1만이 (      )개인 수', blank=False)
        w.ask('섞어 쓰기: (                          )   숫자로: (                                  )', blank=False)
        w.why('만 아래 네 자리에 0을 4개 쓰는 까닭을 써 보세요.', n=1)
        w.key('학생마다 다름(예: %s → %d), (까닭 — 예: 1이 하나도 없어서 일, 십, 백, 천의 자리가 모두 0이에요)' % (mix(ex), ex))
    w.end()


def st7(w):
    w.lesson(7, '개념 구축하기(O)', '빛처럼 뛰어 세기 ― 뛰어 세기', '큰 수를 뛰어 세면 어느 자리 숫자가 어떻게 변할까요?',
             scene='빛은 1초에 약 30만 km를 가요(어림값). 탐험대는 우주 탐험 게임 속 로켓도 뛰어 세어 보기로 했어요.')
    w.step('만져 보기 — 빛과 로켓 뛰어 세기', '먼저 예상하고 뛰어 세어 봐요')
    w.predict('30만씩 뛰어 세면 어느 자리 숫자가 어떻게 변할까요?', '‘내 예상: ~의 자리 숫자가 ~씩 커질 것 같아요.’ 꼴로 써요.')
    w.table([['', '처음', '한 번', '두 번', '세 번'],
             ['빛 (30만 km씩)', '30만', '', '', ''],
             ['로켓 (1억 km씩)', '1억 5000만', '', '', '']])
    w.predict_check()
    w.key(', '.join(mix(300000 * k) for k in (2, 3, 4)) + ' / ' + ', '.join(mix(150000000 + 10 ** 8 * k) for k in (1, 2, 3)),
          '예상: (예: 십만의 자리 숫자가 3씩 커져요. 90만 다음은 120만)')
    w.step('그려 보기 — 얼마씩 뛰었을까', '500억, 2억처럼 써도 돼요')
    w.hint('두 수에서 숫자가 바뀐 자리를 찾고, 그 자리 숫자가 얼마씩 커졌는지 봐요.')
    w.pic(hop_svg(['2600억', '3100억', '3600억', '4100억']), 110)
    w.ask('게임 속 로켓 연구비 2600억 – 3100억 – 3600억 – 4100억은 얼마씩 뛰어 세었나요?')
    w.pic(hop_svg(['4320000000', '4520000000', '4720000000', '4920000000'], fs=19), 110)
    w.ask('4320000000 – 4520000000 – …은 얼마씩 뛰어 세었나요?')
    w.choices([('두 번째 뛰어 세기에서 숫자가 변하는 자리는?', opts('천만의 자리', '억의 자리', '십억의 자리'))])
    w.key('%s씩' % mix((3100 - 2600) * 10 ** 8), '%s씩' % mix(4520000000 - 4320000000), deciding_place(4320000000, 4520000000) + '의 자리')
    w.step('말해 보기 — 내가 정해서 뛰어 세기', '1조부터 4번')
    w.text('고를 수 있는 것: 1000억씩, 1조씩, 2조씩, 10조씩.  라온이는 1조씩: 1조, 2조, 3조, 4조, 5조')
    w.ask('나는 (            )씩:  1조, (            ), (            ), (            ), (            )', blank=False)
    w.why('왜 그럴까요? 내가 고른 만큼 뛰어 세면 왜 그 자리 숫자만 변할까요?',
          '‘왜냐하면 더하는 수의 0이 아닌 숫자가 ~의 자리에만 있어서 ~ 때문이에요.’', n=1)
    w.key('학생마다 다름(예: 1000억씩 → 1조 1000억, 1조 2000억, 1조 3000억, 1조 4000억)',
          '왜: (예: 더하는 수의 0이 아닌 숫자가 그 자리에만 있어서 뛸 때마다 그 자리 숫자만 커져요)')
    w.step('약속하기 — 뛰어 세기')
    if w.basic:
        w.fill(['30만씩 뛰어 세면 %s의 자리 숫자가 3씩 커져요. 90만 다음 수는 %s이에요.'
                % (opts('만', '십만', '백만'), opts('93만', '900만', '120만')),
                '뛰어 세기를 할 때에는 %s 살펴봐요.' % opts('0이 모두 몇 개인지만', '어느 자리 숫자가 얼마씩 변하는지')])
    else:
        w.fill(['30만씩 뛰어 세면 (        )의 자리 숫자가 3씩 커져요. 90만 다음 수는 (        )이에요.',
                '뛰어 세기를 할 때에는 (                                      ) 살펴봐요.'])
    w.key('십만, %s, 어느 자리 숫자가 얼마씩 변하는지' % mix(900000 + 300000))
    w.step('확인하기 — 빈칸 채우기', '‘38억’처럼 써도 돼요')
    w.ask('240000, 270000, (            ), (            )', blank=False)
    w.ask('8조 500억, 8조 1500억, (              ), (              )', blank=False)
    w.ask('(          ), 48억, 58억, 68억', blank=False)
    w.ask('‘별빛 기금’은 1월에 40만 원이었고 매달 15만 원씩 늘었어요. 4월에는 얼마인가요?')
    w.key('300000, 330000', '%s, %s' % (mix(8250000000000), mix(8350000000000)), '38억', '%d만 원' % (40 + 15 * 3))
    if not w.basic:
        w.step('도전하기', '뛰어 세기로 탐험대 문제 해결하기')
        w.ask('★에서 50만씩 4번 뛰어 세었더니 380만이 되었어요. ★은 얼마인가요?')
        w.ask('200조씩: 3018조, 3218조, (          ), (          )', blank=False)
        w.ask('12조 750억 – 15조 750억 – 18조 750억은 얼마씩 뛰어 세었나요?')
        w.why('★을 어떻게 구했는지 써 보세요.')
        w.key('%d만' % (380 - 50 * 4), '3418조, 3618조', '3조씩', '(까닭 — 예: 380만에서 50만씩 거꾸로 4번 뛰어 세었어요)')
    w.end()


def st8(w):
    w.lesson(8, '개념 구축하기(O)', '어느 쪽이 더 멀까요 ― 수의 크기 비교', '큰 수의 크기는 어떻게 비교할까요?',
             scene='탐험대가 우주 거리 두 쌍을 비교해요(모두 어림값).')
    w.step('만져 보기 — 표에서 비교하기', '먼저 비교 방법을 예상해요')
    w.predict('자리 수가 다른 두 수, 자리 수가 같은 두 수는 각각 어떻게 비교할까요?',
              '‘내 예상: 자리 수가 다르면 ~, 자리 수가 같으면 ~부터 비교할 것 같아요.’ 꼴로 써요.')
    w.pic(chart_svg(9, [('태양 지름', '1390000'), ('지구~달', '384400'),
                        ('가까울 때', '147100000'), ('멀 때', '152100000')]), 110)
    w.ask('태양 지름 1390000 km  (    )  지구~달 384400 km', blank=False)
    w.ask('지구와 태양 사이 가까울 때 147100000 km  (    )  멀 때 152100000 km', blank=False)
    w.choices([('두 번째에서 크기가 정해지는 자리는?', opts('억의 자리', '천만의 자리', '백만의 자리'))])
    w.predict_check()
    w.key(cmp(1390000, 384400), cmp(147100000, 152100000), deciding_place(147100000, 152100000) + '의 자리')
    w.step('그려 보기 — 부등호로 나타내기')
    w.hint('먼저 자리 수를 세어요. 형태가 다르면 같은 형태로 바꾸어 생각해요. 38만 = 380000')
    prs = [(527300, 4180000, None), (2872500000, 2817900000, None),
           (9460000000000, 946000000000, ('9조 4600억', '9460억')), (380000, 380000, ('38만', '380000'))]
    for x, y, sh in prs:
        w.ask('%s  (    )  %s' % (sh if sh else (x, y)), blank=False)
    w.key(', '.join(cmp(x, y) for x, y, _ in prs))
    w.step('말해 보기 — 하늘이의 말 고치기')
    w.text('하늘이: ‘384400이 1390000보다 커요. 3이 1보다 크니까요.’')
    w.ask('하늘이의 말을 바르게 고친 것을 골라 기호를 써 보세요.')
    w.text('㉠ 두 수의 첫 숫자를 비교하면 되니까 384400이 더 커요.')
    w.text('㉡ 384400은 여섯 자리, 1390000은 일곱 자리라서 1390000이 더 커요.')
    w.text('㉢ 0이 많은 수가 언제나 더 커요.')
    w.choices([('‘2억 2800만’과 ‘778000000’을 비교할 때 먼저 할 일은?', opts('앞 숫자 2와 7만 비교', '같은 형태로 바꾸기'))])
    w.why('왜 그럴까요? 앞자리 숫자만 보고 크기를 정하면 안 되는 까닭은?',
          '‘왜냐하면 자리 수가 다르면 앞자리 숫자가 나타내는 값이 ~ 때문이에요.’', n=1)
    w.key('㉡', '같은 형태로 바꾸기',
          '왜: (예: 자리 수가 다르면 앞자리 숫자가 나타내는 값이 달라서, 자리 수가 많은 수가 더 커요)')
    w.step('약속하기 — 크기 비교')
    if w.basic:
        w.fill(['자리 수가 다를 때에는 자리 수가 %s 쪽이 더 큰 수예요.' % opts('적은', '많은'),
                '자리 수가 같을 때에는 %s 자리 수부터 차례대로 비교하여 높은 자리 수가 %s 쪽이 더 큰 수예요.'
                % (opts('높은', '낮은'), opts('작은', '큰'))])
    else:
        w.fill(['자리 수가 다를 때에는 자리 수가 (      ) 쪽이 더 큰 수예요.',
                '자리 수가 같을 때에는 (      ) 자리 수부터 차례대로 비교하여 높은 자리 수가 (      ) 쪽이 더 큰 수예요.'])
    w.key('많은, 높은, 큰')
    pl = [('화성', '약 2억 2800만 km', 228000000), ('목성', '약 778000000 km', 778000000),
          ('토성', '약 십사억 삼천만 km', 1430000000), ('지구', '약 1억 5000만 km', 150000000)]
    w.step('확인하기 — 가까운 행성부터', '태양에서 행성까지의 거리 (어림값)')
    if w.basic:
        w.table([['행성', '거리', '0을 모두 써서']] + [[n, s, ''] for n, s, v in pl], col_mm=[30, 70, 80])
    else:
        w.table([['행성', '거리']] + [[n, s] for n, s, v in pl], col_mm=[60, 120])
    w.ask('가까운 행성부터:  (        ) < (        ) < (        ) < (        )', blank=False)
    order = ' < '.join(n for n, s, v in sorted(pl, key=lambda t: t[2]))
    w.key((', '.join(str(v) for _, _, v in pl) + ' / ' if w.basic else '') + order)
    if not w.basic:
        ok = [d for d in range(10) if int('38%d200' % d) > 384400]
        three = sorted([('㉠', 9 * 10 ** 12), ('㉡', 99000000000), ('㉢', 9000 * 10 ** 8)], key=lambda t: -t[1])
        w.step('도전하기', '큰 수의 크기 비교 더 해 보기')
        w.ask('38□200 > 384400에서 □ 안에 들어갈 수 있는 수를 모두 써 보세요.')
        w.ask('큰 수부터 차례대로 기호를 써 보세요.   ㉠ 9조   ㉡ 99000000000   ㉢ 9000억')
        w.why('□ 안에 4를 넣을 수 없는 까닭을 써 보세요.', n=1)
        w.key(', '.join(map(str, ok)), ', '.join(k for k, _ in three), '(까닭 — 예: 4를 넣으면 384200이 되어 384400보다 작아요)')
    w.end()


def st9(w):
    w.lesson(9, '탐구 정리하기(O)', '우주 거리 사다리 ― 형태가 다른 큰 수 비교', '형태가 다른 큰 수의 크기를 어떻게 비교할까요?',
             scene='탐험대가 모은 우주 거리 카드예요(모두 어림값). 수의 형태가 제각각이에요.')
    cards = [('지구 → 달', '약 38만 km', 380000), ('태양 → 해왕성', '약 사십오억 km', 4500000000),
             ('빛이 1년 동안 가는 거리', '약 9조 4600억 km', 9460000000000),
             ('보이저 1호 (2024년)', '240억 km보다 멀리', 24000000000)]
    w.step('만져 보기 — 같은 형태로 바꾸기', '0을 모두 써서 숫자로')
    w.hint('38만 → 38 / 0000,  9조 4600억 → 9 / 4600 / 0000 / 0000')
    w.table([['우주 거리 카드', '적힌 수', '0을 모두 써서 (km)']] + [[n, s, ''] for n, s, v in cards], col_mm=[55, 50, 75])
    w.key(', '.join(str(v) for _, _, v in cards))
    lad = [('지구 → 달', '약 38만 km', 380000), ('지구 → 태양', '약 150000000 km', 150000000),
           ('태양 → 해왕성', '약 사십오억 km', 4500000000), ('보이저 1호', '240억 km보다 멀리', 24000000000),
           ('빛이 1년 동안 가는 거리', '약 9조 4600억 km', 9460000000000), ('지구 둘레', '약 40000 km', 40000)]
    w.step('그려 보기 — 우주 거리 사다리', '먼 것부터 차례대로 번호 쓰기')
    w.table([['우주 거리', '적힌 수', '자리 수', '먼 차례']] + [[n, s, '(    )자리', '(    )'] for n, s, v in lad],
            col_mm=[55, 55, 35, 35])
    ranks = {n: i + 1 for i, (n, s, v) in enumerate(sorted(lad, key=lambda t: -t[2]))}
    w.key(' / '.join('%s %d자리 %d번' % (n, len(str(v)), ranks[n]) for n, s, v in lad))
    w.step('말해 보기 — 비교한 방법 설명하기')
    if w.basic:
        w.labeled([('방법', '먼저 ______________ 로 바꾸었어요. 그다음 ______________ 를 세어 비교했어요.'),
                   ('놀라운 점', '______________ 은 약 ______ km로, ______________ 보다 훨씬 멀어서 놀라워요.')], row_h=5100)
    else:
        w.ask('형태가 다른 수를 어떻게 비교했는지 차례대로 써 보세요.', blank=False)
        w.lines(2)
        w.ask('우주 거리 사다리에서 가장 놀라운 점을 큰 수를 넣어 써 보세요.', blank=False)
        w.lines(2)
    w.key('(생각 쓰기 — 예: 먼저 모두 숫자로 바꾸고 자리 수를 세었어요 / 빛이 1년 동안 가는 거리는 약 9조 4600억 km로 태양까지보다 훨씬 멀어요)')
    w.step('약속하기 — 형태가 다른 수 비교')
    if w.basic:
        w.fill(['형태가 다른 수는 먼저 %s 나타내요.' % opts('앞 숫자만 보고', '같은 형태로 바꾸어'),
                '그다음 %s를 비교하고, 자리 수가 같으면 %s 자리 수부터 차례대로 비교해요.'
                % (opts('자리 수', '0이 아닌 숫자의 개수'), opts('낮은', '높은'))])
    else:
        w.fill(['형태가 다른 수는 먼저 (                    ) 나타내요.',
                '그다음 (          )를 비교하고, 자리 수가 같으면 (      ) 자리 수부터 차례대로 비교해요.'])
    w.key('같은 형태로 바꾸어, 자리 수, 높은')
    w.step('확인하기 — 같은 형태로 비교')
    w.ask('45억  (    )  4500000000          240억  (    )  9조 4600억', blank=False)
    w.ask('우리 은하의 별은 1000억 개가 넘고, 안드로메다은하의 별은 약 1조 개래요. 1조는 1000억의 몇 배인가요?')
    w.key('%s, %s' % (cmp(45 * 10 ** 8, 4500000000), cmp(240 * 10 ** 8, 9460000000000)), '%d배' % (10 ** 12 // (1000 * 10 ** 8)))
    if not w.basic:
        six = [('땅 → 국제우주정거장', '약 400 km', 400), ('지구 지름', '약 1만 2700 km', 12700), ('지구 둘레', '약 40000 km', 40000),
               ('태양 지름', '약 백삼십구만 km', 1390000), ('지구 → 달', '약 384400 km', 384400), ('달 지름', '약 3474 km', 3474)]
        asc = sorted(six, key=lambda t: t[2])[:3]
        w.step('도전하기', '우주 카드 6장 중 가장 짧은 것 3개')
        w.table([['우주 카드', '거리']] + [[n, s] for n, s, v in six], col_mm=[90, 90])
        w.ask('짧은 것부터:  (                ) < (                ) < (                )', blank=False)
        w.why('세 개를 어떻게 골랐는지 써 보세요.', n=1)
        w.key(' < '.join(n for n, s, v in asc), '(까닭 — 예: 모두 숫자로 바꾸고 자리 수가 적은 것부터 골랐어요)')
    w.end()


def st10(w):
    w.lesson(10, '발표하기(P)', '놀이를 더하다 ― 별 세 칸 잇기',
             '가장 큰 수를 만들고 크기를 비교하는 놀이에서 이기려면 어떻게 해야 할까요?')
    sets = [['5', '730', '19'], ['81', '6', '402'], ['97', '3', '615']]
    w.step('놀이 준비 — 가장 큰 수 만들기', '별 카드 3장을 모두 이어 붙여요')
    w.hint('카드를 모두 쓰면 자리 수는 늘 같아요. 맨 앞에 오는 숫자가 커지도록 순서를 바꿔 봐요.')
    w.table([['별 카드 3장', '가장 큰 수']] + [[',  '.join(s), ''] for s in sets], col_mm=[80, 100])
    w.key(', '.join(biggest(s) for s in sets))
    w.step('비교하기 — 누가 더 클까')
    w.ask('하늘 816402  (    )  도윤 976153', blank=False)
    w.ask('서아 8730615  (    )  도윤 976153', blank=False)
    w.choices([('첫 번째에서 크기가 정해지는 자리는?', opts('십만의 자리', '만의 자리', '백만의 자리'))])
    w.key(cmp(816402, 976153), cmp(8730615, 976153), deciding_place(816402, 976153) + '의 자리')
    w.step('놀이하기 — 별 세 칸 잇기', '더 큰 수를 만든 사람이 별 칸 하나를 색칠해요')
    w.text('카드 3장으로 가장 큰 수를 만들어 친구와 비교해요. 이어진 세 칸(가로·세로·대각선)을 먼저 색칠하면 이겨요.')
    w.pic(board_svg(ST_BOARD), 95)
    w.table([['판', '내 카드', '내가 만든 수', '부등호', '친구가 만든 수', '색칠한 칸']] + [[str(k), '', '', '', '', ''] for k in (1, 2, 3)],
            col_mm=[14, 36, 36, 20, 36, 38])
    w.key('학생마다 다름')
    w.step('발표하기 — 이기는 방법')
    if w.basic:
        w.labeled([('만드는 방법', '맨 앞에 오는 숫자가 ______ 순서를 정해요. 예를 들어 5, 730, 19로는 ______ 를 만들어요.'),
                   ('색칠 작전', '______ 칸을 먼저 색칠하고, 상대가 두 칸을 이으면 ______________.')], row_h=5100)
    else:
        w.ask('가장 큰 수를 만드는 나만의 방법을 써 보세요.', blank=False)
        w.lines(2)
        w.ask('놀이판에서 이기려면 어떻게 색칠하면 좋을까요?', blank=False)
        w.lines(2)
    w.key('(생각 쓰기 — 예: 맨 앞 숫자가 가장 크도록 놓아요, 5, 730, 19로는 %s / 가운데 칸을 먼저 색칠하고 두 칸이 이어지면 남은 칸을 막아요)'
          % biggest(['5', '730', '19']))
    if not w.basic:
        cards = '013568'
        ps = sorted(int(''.join(p)) for p in itertools.permutations(cards) if p[0] != '0' and int(''.join(p)) > 300000)
        w.step('도전하기', '수 카드 0, 1, 3, 5, 6, 8을 한 번씩 모두 사용하기')
        w.ask('30만보다 큰 여섯 자리 수 중에서 가장 작은 수를 만들어 보세요.')
        w.why('그 수를 만든 방법을 써 보세요.')
        w.key(ps[0], '(까닭 — 예: 십만의 자리에 3을 놓고, 나머지 0, 1, 5, 6, 8을 작은 수부터 놓았어요)')
    w.end()


def st11(w):
    w.lesson(11, '발표하기(P)', '우주 큰 수 신문을 발표해요', '큰 수를 배우기 전과 후, 내 생각은 어떻게 달라졌나요?')
    w.step('확인 1 — 읽고 쓰기')
    w.ask('4500000000을 읽어 보세요.')
    w.ask('삼천이백팔만 오백을 수로 써 보세요.')
    w.ask('1억이 2개, 1만이 3800개인 수를 써 보세요.')
    w.ask('숫자 7이 70억을 나타내는 수는?   ㉠ 7350000000   ㉡ 73500000000   ㉢ 735000000')
    k7 = [k for k, n in (('㉠', 7350000000), ('㉡', 73500000000), ('㉢', 735000000)) if digit_value(n, 7) == 70 * 10 ** 8][0]
    w.key(rd(4500000000), 3208 * 10 ** 4 + 500, 2 * 10 ** 8 + 3800 * 10 ** 4, k7)
    w.step('확인 2 — 뛰어 세기와 비교')
    w.ask('2400만, 2600만, 2800만, (          ), (          )', blank=False)
    w.ask('1억 5000만  (    )  99999999          14억 3000만  (    )  2870000000', blank=False)
    w.key('3000만, 3200만', '%s, %s' % (cmp(150000000, 99999999), cmp(1430000000, 2870000000)))
    w.step('신문 쓰기 — 우주 큰 수 신문', '1차시에 궁금했던 것을 떠올려요')
    w.ask('1차시에 내가 궁금했던 것:', blank=False)
    w.lines(1)
    if w.basic:
        w.labeled([('제목', '______________ 은(는) ______ km!'),
                   ('큰 수 기사', '______________ 까지는 약 ______________ km예요. ‘______________’이라고 읽어요.'),
                   ('비교 기사', '______ 가 ______ 보다 멀어요. 숫자로 바꾸면 ____자리와 ____자리라서 ______.')], row_h=5100)
    else:
        w.labeled([('제목', ''), ('큰 수 기사', ''), ('비교 기사', '')], row_h=7370)
    w.key('(생각 쓰기 — 예: 빛은 1년에 약 9조 4600억 km를 달려요! / 지구에서 태양까지 약 150000000 km, 일억 오천만 / '
          '토성(14억 3000만 km)이 목성(7억 7800만 km)보다 멀어요, 10자리와 9자리)')
    w.step('발표하기 — 예전 생각, 지금 생각')
    if w.basic:
        w.labeled([('예전 생각', '예전에는 ______________________ 라고 생각했어요.'),
                   ('지금 생각', '지금은 ______________________ 라고 생각해요.'),
                   ('왜 바뀌었나', '______________________ 을(를) 해 보고 바뀌었어요.')])
    else:
        w.labeled([('예전 생각', ''), ('지금 생각', ''), ('왜 바뀌었나', '')], row_h=5100)
    w.key('(생각 쓰기 — 예: 예전에는 앞자리 숫자가 큰 수가 더 크다고 생각했어요 / 지금은 자리 수부터 센다고 생각해요 / 우주 거리 사다리를 해 보고 바뀌었어요)')
    if not w.basic:
        w.step('도전하기', '마인드맵과 단원 도전 문제')
        w.labeled([('떠오르는 말', ''), ('묶어 보기', ''), ('이어지는 말', ''), ('덧붙이는 말', '')], row_h=3969)
        w.ask('9999만보다 1만큼 더 큰 수를 써 보세요.')
        w.ask('10억이 100개인 수를 써 보세요.')
        w.ask('가장 큰 수는?   ㉠ 9999억   ㉡ 1조   ㉢ 999900000000')
        E = 10 ** 8
        big = max([('㉠', 9999 * E), ('㉡', 10 ** 12), ('㉢', 999900000000)], key=lambda t: t[1])[0]
        w.key('마인드맵 (생각 쓰기)', 9999 * 10 ** 4 + 1, '%d(%s)' % (10 * E * 100, mix(10 * E * 100)), big)
    w.end()


TB = [tb1, tb2, tb3, tb4, tb5, tb6, tb7, tb8, tb9, tb10, tb11]
ST = [st1, st2, st3, st4, st5, st6, st7, st8, st9, st10, st11]


def build():
    made = []
    for ver, label, folder, fns in (('tb', '교과서 차시', 'sem1', TB), ('st', '이야기 버전', 'sem1-soop', ST)):
        for level in ('기본형', '도전형'):
            w = W(label, level, ver)
            for f in fns:
                f(w)
            path = os.path.join(MATH, folder, 'sheets', FNAME % level)
            w.save(path)
            made.append(path)
    return made


if __name__ == '__main__':
    try:
        files = build()
        bad = 0
        for f in files:
            p = check(f)
            bad += bool(p)
            print(os.path.relpath(f, MATH), 'OK' if not p else '\n  ' + '\n  '.join(p))
    finally:
        shutil.rmtree(WORK, ignore_errors=True)
    sys.exit(1 if bad else 0)
