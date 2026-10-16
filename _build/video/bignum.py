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

# 네 자리 묶음 색: 일 묶음, 만 묶음, 억 묶음, 조 묶음
GROUP_COLORS = [INK, TENK, ORANGE, HUND]
GROUP_NAMES = ["", "만", "억", "조"]


def pcol(k):
    """일의 자리(0)부터 네 자리마다 같은 색을 되풀이(일·십·백·천)"""
    return PLACE_COLORS[k % 4]


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
