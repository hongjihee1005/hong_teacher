"""(두·세 자리 수) ÷ (두 자리 수) 세로 나눗셈 부품 — 4학년

    d = LongDiv(S, 950, 45, x_right=-0.5, y0=1.9)
    d.show()                         # 나누는 수 )나누어지는 수
    d.quot(20)                       # 몫 칸에 수를 씀(오른쪽 끝 맞춤, 몫의 자리 = 나누어지는 수의 자리)
    d.sub_line(900, 50)              # 빼는 수와 남은 수 한 줄씩
"""
from manim import DOWN, LEFT, RIGHT, UP, Arc, Create, FadeIn, LaggedStart, Line, VGroup

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, T


class LongDiv:
    def __init__(self, S, a, b, x_right=-0.5, y0=1.9, F=64, dx=0.52, dy=0.82):
        self.S, self.a, self.b = S, a, b
        self.xr, self.y0, self.F, self.dx, self.dy = x_right, y0, F, dx, dy
        self.n = len(str(a))
        self.level = 0

    def x(self, k):
        return self.xr - k * self.dx

    def num(self, s, y, color=INK, right_k=0):
        n = len(s)
        return VGroup(*[T(ch, self.F, color).move_to([self.x(right_k + n - 1 - i), y, 0]) for i, ch in enumerate(s)])

    def show(self):
        S = self.S
        self.top = self.num(str(self.a), self.y0)
        left = self.x(self.n - 1) - self.dx * 0.75
        bar = Line([left, self.y0 + 0.5, 0], [self.x(0) + 0.4, self.y0 + 0.5, 0], color=INK, stroke_width=6)
        hook = Arc(radius=0.55, start_angle=0.6, angle=-1.2, color=INK, stroke_width=6)
        hook.move_to([left - 0.12, self.y0 + 0.02, 0])
        self.dv = T(str(self.b), self.F, INK).next_to(hook, LEFT, buff=0.18)
        S.play(FadeIn(self.top), Create(bar), Create(hook), FadeIn(self.dv), run_time=0.8)
        self.frame = VGroup(bar, hook)

    def quot(self, q, color=GREEN, right_k=0):
        r = self.num(str(q), self.y0 + 1.05, color, right_k)
        self.S.play(FadeIn(r, shift=DOWN * 0.15), run_time=0.6)
        return r

    def sub_line(self, v, rest, right_k=0, rest_k=0, color=ORANGE):
        y1 = self.y0 - self.dy * (1 + 2 * self.level)
        sv = self.num(str(v), y1, color, right_k)
        ln = Line([self.x(self.n - 1) - 0.35, y1 - self.dy * 0.5, 0], [self.x(0) + 0.35, y1 - self.dy * 0.5, 0],
                  color=INK, stroke_width=5)
        rs = self.num(str(rest), y1 - self.dy, BLUE, rest_k)
        self.S.play(FadeIn(sv, shift=DOWN * 0.15), run_time=0.5)
        self.S.play(Create(ln), FadeIn(rs, shift=DOWN * 0.15), run_time=0.6)
        self.level += 1
        return sv, rs
