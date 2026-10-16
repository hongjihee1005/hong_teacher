"""막대그래프·꺾은선그래프(4학년) 부품

    ch = Chart(items, vmax=10, step=1, origin=[-5, -2, 0], w=9, h=4, title="…", xlab="활동", ylab="(명)")
    S.play(FadeIn(ch.axes_group))
    bars = ch.bars(values)            # 세로 막대 VGroup (아래에서 자라는 애니메이션: GrowFromEdge(b, DOWN))
    dots = ch.dots(values); lines = ch.lines(values)   # 꺾은선
"""
import numpy as np
from manim import DOWN, LEFT, RIGHT, UP, Dot, Line, Rectangle, VGroup

from series_style import BLUE, INK, ORANGE, SOFT, T

GRIDC = "#CFC8BA"


class Chart:
    def __init__(self, items, vmax, step, origin=(-5, -2, 0), w=9.0, h=4.0, title="", ylab="", xlab="",
                 label_size=30, tick_every=1, vmin=0, bar_color=BLUE):
        self.items, self.vmax, self.step, self.vmin = items, vmax, step, vmin
        self.o = np.array(origin, float)
        self.w, self.h = w, h
        self.n = len(items)
        self.cw = w / self.n
        self.bar_color = bar_color
        g = VGroup()
        nt = int(round((vmax - vmin) / step))
        self.unit = h / nt
        for i in range(nt + 1):
            y = self.o[1] + i * self.unit
            g.add(Line([self.o[0], y, 0], [self.o[0] + w, y, 0], color=GRIDC if i else INK, stroke_width=2 if i else 4))
            if i % tick_every == 0:
                g.add(T(str(vmin + i * step), label_size - 4, SOFT).next_to([self.o[0], y, 0], LEFT, buff=0.15))
        g.add(Line(self.o, self.o + UP * h, color=INK, stroke_width=4))
        self.xlabels = VGroup()
        for i, it in enumerate(items):
            t = T(it, label_size, INK).move_to([self.o[0] + (i + 0.5) * self.cw, self.o[1] - 0.35, 0])
            if t.width > self.cw * 0.95:
                t.scale_to_fit_width(self.cw * 0.95)
            self.xlabels.add(t)
        g.add(self.xlabels)
        if ylab:
            g.add(T(ylab, label_size - 4, SOFT).next_to(self.o + UP * h, UP, buff=0.32).shift(RIGHT * 0.15))
        if xlab:
            g.add(T(xlab, label_size - 4, SOFT).next_to(self.o + RIGHT * w, DOWN, buff=0.12).shift(DOWN * 0.25))
        if title:
            g.add(T(title, label_size + 4, INK).next_to(self.o + RIGHT * w / 2 + UP * h, UP, buff=0.5))
        self.axes_group = g

    def y(self, v):
        return self.o[1] + (v - self.vmin) / self.step * self.unit

    def x(self, i):
        return self.o[0] + (i + 0.5) * self.cw

    def bars(self, values, width=0.55, color=None):
        g = VGroup()
        for i, v in enumerate(values):
            hh = max(self.y(v) - self.o[1], 0.001)
            r = Rectangle(width=self.cw * width, height=hh, fill_color=color or self.bar_color, fill_opacity=0.85,
                          stroke_color=INK, stroke_width=2)
            r.move_to([self.x(i), self.o[1] + hh / 2, 0])
            g.add(r)
        return g

    def dots(self, values, color=ORANGE):
        return VGroup(*[Dot([self.x(i), self.y(v), 0], radius=0.09, color=color) for i, v in enumerate(values)])

    def lines(self, values, color=ORANGE):
        return VGroup(*[Line([self.x(i), self.y(values[i]), 0], [self.x(i + 1), self.y(values[i + 1]), 0], color=color,
                             stroke_width=6) for i in range(len(values) - 1)])
