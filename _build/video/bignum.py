"""큰 수(4학년 1학기 1단원) 부품 — 지폐, 자릿값 표, 자리별 색

    bill(1000)                       # 1000원 지폐
    ch = PlaceChart(["만", "천", "백", "십", "일"])   # 자릿값 표
    ch.fill(S, "23586")              # 칸에 숫자를 차례로 넣음
    pcol(k)                          # k번째 자리(0=일)의 색
    grp_markup("384500000000")       # 네 자리씩 띄우고 묶음마다 색을 다르게
"""
from manim import (DOWN, LEFT, RIGHT, UP, FadeIn, LaggedStart, Rectangle, RoundedRectangle, VGroup)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, M, T

HUND = "#7A4FB5"     # 백(보라) — multiply.py와 같음
THOU = "#C0392B"     # 천(빨강)
TENK = "#1F8A70"     # 만(청록)
PLACE_COLORS = [ORANGE, BLUE, HUND, THOU]

EOK = "#B5338A"      # 억(자홍)
JO = "#7A5A12"       # 조(갈색)
# 네 자리 묶음 색: 일 묶음, 만 묶음, 억 묶음, 조 묶음
GROUP_COLORS = [INK, TENK, EOK, JO]
GROUP_NAMES = ["", "만", "억", "조"]


def pcol(k):
    """일·십·백·천은 주황·파랑·보라·빨강, 만 자리부터는 묶음 색(만 청록, 억 자홍, 조 갈색)"""
    return PLACE_COLORS[k] if k < 4 else GROUP_COLORS[min(k // 4, 3)]


def span(v, c):
    return f'<span foreground="{c}">{v}</span>'


def place_markup(s):
    """숫자 문자열을 자리마다 색칠"""
    n = len(s)
    return "".join(span(ch, pcol(n - 1 - i)) for i, ch in enumerate(s))


def chunks(s):
    """'384500000000' → ['3845', '0000', '0000'] (앞 묶음은 네 자리보다 짧을 수 있음)"""
    out = []
    while s:
        out.insert(0, s[-4:])
        s = s[:-4]
    return out


def grp_markup(s, gap="  "):
    """네 자리씩 끊어 띄우고 묶음마다 색을 다르게: 3845 0000 0000"""
    cs = chunks(s)
    k = len(cs)
    return gap.join(span(c, GROUP_COLORS[k - 1 - i]) for i, c in enumerate(cs))


def bill(value, w=1.7, h=0.82):
    """지폐 그림(실제 지폐 모양은 아님): 1000·10000"""
    fill = {1000: "#DCEBFA", 10000: "#DDF2E3", 100000: "#F6E7C8"}.get(value, PAPER)
    edge = {1000: BLUE, 10000: TENK, 100000: ORANGE}.get(value, SOFT)
    r = RoundedRectangle(corner_radius=0.1, width=w, height=h, fill_color=fill, fill_opacity=1,
                         stroke_color=edge, stroke_width=4)
    inner = RoundedRectangle(corner_radius=0.06, width=w - 0.18, height=h - 0.18, stroke_color=edge,
                             stroke_width=1.5, stroke_opacity=0.6)
    t = T(f"{value}", 30 if value < 100000 else 26, edge).move_to(r)
    g = VGroup(r, inner, t)
    g.value = value
    return g


class PlaceChart(VGroup):
    """자릿값 표: 위 칸은 자리 이름, 아래 칸은 숫자"""

    def __init__(self, names, cell_w=1.15, head_h=0.7, cell_h=1.05, head_size=34, digit_size=64):
        super().__init__()
        n = len(names)
        self.heads, self.boxes, self.digits = VGroup(), VGroup(), VGroup()
        self.digit_size = digit_size
        for i, nm in enumerate(names):
            k = n - 1 - i
            hb = Rectangle(width=cell_w, height=head_h, fill_color="#F3EEE4", fill_opacity=1,
                           stroke_color=SOFT, stroke_width=2)
            ht = T(nm, head_size if len(nm) <= 2 else head_size - 6, pcol(k)).move_to(hb)
            db = Rectangle(width=cell_w, height=cell_h, fill_color=PAPER, fill_opacity=1,
                           stroke_color=SOFT, stroke_width=2)
            hb.move_to([i * cell_w, 0, 0])
            ht.move_to(hb)
            db.next_to(hb, DOWN, buff=0)
            self.heads.add(VGroup(hb, ht))
            self.boxes.add(db)
        self.add(self.heads, self.boxes)

    def digit(self, i, ch):
        k = len(self.boxes) - 1 - i
        return T(ch, self.digit_size, pcol(k)).move_to(self.boxes[i])

    def fill(self, S, s, run_time=1.2):
        """오른쪽 끝을 맞추어 숫자를 넣음"""
        off = len(self.boxes) - len(s)
        ds = VGroup(*[self.digit(off + i, ch) for i, ch in enumerate(s)])
        S.play(LaggedStart(*[FadeIn(d, shift=DOWN * 0.2) for d in ds], lag_ratio=0.15, run_time=run_time))
        self.digits = ds
        self.add(ds)
        return ds


# ── 수 읽기 (앱 grade4/math/_build/units/u1-bignum.tb.js의 n1Read와 같은 규칙) ──
_D = ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"]
_P = ["", "십", "백", "천"]


def _read4(c):
    r = ""
    ds = str(c).zfill(4)
    for i in range(4):
        d, p = int(ds[i]), 3 - i
        if d:
            r += ("" if (d == 1 and p > 0) else _D[d]) + _P[p]
    return r


def read_num(v):
    """23586 → '이만 삼천오백팔십육', 10000 → '만', 100000000 → '일억'"""
    s = str(int(v))
    if s == "0":
        return "영"
    cs = [int(c) for c in chunks(s)]
    parts = []
    k = len(cs)
    for i, c in enumerate(cs):
        u = k - 1 - i
        if not c:
            continue
        w = _read4(c)
        if u > 0 and c == 1:
            w = "" if (i == 0 and u == 1) else "일"
        parts.append(w + GROUP_NAMES[u])
    return " ".join(parts)


def mix_form(v):
    """23586 → '2만 3586', 384500000000 → '3845억'"""
    cs = [int(c) for c in chunks(str(int(v)))]
    if len(cs) == 1:
        return str(cs[0])
    k = len(cs)
    return " ".join(f"{c}{GROUP_NAMES[k - 1 - i]}" for i, c in enumerate(cs) if c)


def num_card(v, color, w=None, h=0.62, size=30):
    """수 카드(10000, 1000, 100, 10, 1)"""
    t = T(str(v), size, color)
    w = w or max(1.0, t.width + 0.35)
    r = RoundedRectangle(corner_radius=0.08, width=w, height=h, fill_color=PAPER, fill_opacity=1,
                         stroke_color=color, stroke_width=3.5)
    t.move_to(r)
    return VGroup(r, t)


def chunk_row(s, size=80, gap=0.55, label_size=44):
    """네 자리씩 끊은 수: (묶음 글자들, 아래 이름표들). 묶음마다 색이 다름(일 검정, 만 청록, 억 자홍, 조 갈색)"""
    cs = chunks(s)
    k = len(cs)
    nums, labs = VGroup(), VGroup()
    for i, c in enumerate(cs):
        u = k - 1 - i
        nums.add(T(c, size, GROUP_COLORS[u]))
    nums.arrange(RIGHT, buff=gap)
    for i, c in enumerate(cs):
        u = k - 1 - i
        lab = T(GROUP_NAMES[u] if u else "(일)", label_size, GROUP_COLORS[u] if u else SOFT)
        lab.next_to(nums[i], DOWN, buff=0.25)
        labs.add(lab)
    return nums, labs


def digit_row(s, right_x, y, size=64, step=0.52, color=None):
    """자리를 맞춘 숫자 줄: 오른쪽 끝(일의 자리)을 right_x에 두고 왼쪽으로 step씩. 
    결과 VGroup의 .at(k)는 k번째 자리(0=일) 숫자"""
    n = len(s)
    g = VGroup()
    for i, ch in enumerate(s):
        k = n - 1 - i
        d = T(ch, size, color or pcol(k)).move_to([right_x - k * step, y, 0])
        d.place = k
        g.add(d)
    g.at = lambda k: g[n - 1 - k]
    return g
