"""(세 자리 수) × (두 자리 수) 세로셈 부품 — 4학년 곱셈

    v = VertMul(S, 213, 18, x_right=-1.0, y0=2.2)
    v.show()                    # 곱해지는 수, 곱하는 수, 줄
    v.row(0, 213 * 8)           # 첫째 줄(일의 자리와 곱)
    v.row(1, 213 * 10)          # 둘째 줄(십의 자리와 곱) — 끝 0을 흐리게 하거나 빼고 씀
    v.total()
"""
from manim import DOWN, FadeIn, Create, Line, LaggedStart, VGroup

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, T


class VertMul:
    def __init__(self, S, a, b, x_right=-1.0, y0=2.3, F=68, dx=0.56, dy=0.9):
        self.S, self.a, self.b = S, a, b
        self.xr, self.y0, self.F, self.dx, self.dy = x_right, y0, F, dx, dy
        self.W = len(str(a * b)) + 1
        self.rows = []

    def x(self, k):
        return self.xr - k * self.dx

    def num(self, s, y, color=INK, faded_tail=0):
        g = VGroup()
        n = len(s)
        for i, ch in enumerate(s):
            k = n - 1 - i
            c = SOFT if k < faded_tail else color
            g.add(T(ch, self.F, c).move_to([self.x(k), y, 0]))
        return g

    def show(self):
        S = self.S
        self.top = self.num(str(self.a), self.y0)
        self.mul = VGroup(T("×", self.F).move_to([self.x(self.W - 1), self.y0 - self.dy, 0]),
                          self.num(str(self.b), self.y0 - self.dy))
        self.bar = Line([self.x(self.W - 1) - 0.35, self.y0 - self.dy * 1.55, 0],
                        [self.x(0) + 0.35, self.y0 - self.dy * 1.55, 0], color=INK, stroke_width=6)
        S.play(FadeIn(self.top), FadeIn(self.mul), Create(self.bar), run_time=0.8)

    def row(self, i, v, color=None, faded_tail=0):
        y = self.y0 - self.dy * (2.15 + i)
        r = self.num(str(v), y, color or (ORANGE if i == 0 else BLUE), faded_tail)
        self.S.play(LaggedStart(*[FadeIn(d, shift=DOWN * 0.15) for d in r[::-1]], lag_ratio=0.12, run_time=0.9))
        self.rows.append(r)
        return r

    def total(self):
        n = len(self.rows)
        yb = self.y0 - self.dy * (1.65 + n)
        bar2 = Line([self.x(self.W - 1) - 0.35, yb, 0], [self.x(0) + 0.35, yb, 0], color=INK, stroke_width=6)
        r = self.num(str(self.a * self.b), yb - self.dy * 0.6, GREEN)
        self.S.play(Create(bar2), run_time=0.4)
        self.S.play(LaggedStart(*[FadeIn(d, shift=DOWN * 0.15) for d in r[::-1]], lag_ratio=0.12, run_time=0.9))
        self.res = r
        return r
