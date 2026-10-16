"""대응 관계(5학년 1학기 3단원) 부품 — 두 줄 대응 표

    tb = CTable(["식탁의 수", "다리의 수"], [1, 2, 3, 4, 5], [4, 8, 12, 16, 20], center=[0, 0, 0])
    S.play(FadeIn(tb.frame))            # 칸과 머리글
    S.play(FadeIn(tb.top[i]), FadeIn(tb.bot[i]))   # i번째 값
    arrows = tb.arrows("× 4")            # 위 칸 → 아래 칸 화살표와 글
"""
import numpy as np
from manim import DOWN, LEFT, RIGHT, UP, Arrow, Rectangle, VGroup

from series_style import BLUE, INK, ORANGE, PAPER, SOFT, T

HEAD = "#F3EEE4"


class CTable:
    def __init__(self, heads, top, bot, center=(0, 0, 0), cw=1.25, hw=2.6, h=0.85, F=40, hcols=(BLUE, ORANGE)):
        c = np.array(center, float)
        n = len(top)
        W = hw + n * cw
        x0 = c[0] - W / 2
        self.frame = VGroup()
        self.top, self.bot = VGroup(), VGroup()
        self.xs = []
        for r, (hd, vals, col) in enumerate(zip(heads, (top, bot), hcols)):
            y = c[1] + (0.5 - r) * h
            hr = Rectangle(width=hw, height=h, fill_color=HEAD, fill_opacity=1, stroke_color=SOFT, stroke_width=2).move_to([x0 + hw / 2, y, 0])
            ht = T(hd, 30, col).move_to(hr)
            if ht.width > hw * 0.92:
                ht.scale_to_fit_width(hw * 0.92)
            self.frame.add(hr, ht)
            for k, v in enumerate(vals):
                x = x0 + hw + (k + 0.5) * cw
                if r == 0:
                    self.xs.append(x)
                self.frame.add(Rectangle(width=cw, height=h, fill_color=PAPER, fill_opacity=1, stroke_color=SOFT, stroke_width=2).move_to([x, y, 0]))
                (self.top if r == 0 else self.bot).add(T(str(v), F, col).move_to([x, y, 0]))
        self.y_top, self.y_bot, self.h = c[1] + 0.5 * h, c[1] - 0.5 * h, h
        self.right = x0 + W

    def arrows(self, label, color=INK, side="right", up=False):
        g = VGroup()
        xr = self.right + 0.25
        a = Arrow([xr, self.y_bot if up else self.y_top, 0], [xr, self.y_top if up else self.y_bot, 0], color=color, buff=0.05, stroke_width=7,
                  path_arc=-1.2 if not up else 1.2)
        t = T(label, 40, color).next_to(a, RIGHT, buff=0.1)
        g.add(a, t)
        return g
