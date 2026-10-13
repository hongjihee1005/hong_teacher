"""들이와 무게 영상 공통 부품: 비커(눈금·물 높이), 컵, 물병, 저울 바늘, 양팔저울

    bk = Beaker(1000, major=100, minor=50, height=4.0)   # VGroup, bk.set_level(ml) / bk.level_anim(tracker)
"""
import numpy as np
from manim import (DOWN, LEFT, PI, RIGHT, UP, Arc, Circle, Line, Polygon, Rectangle, RoundedRectangle,
                   VGroup, always_redraw)

from series_style import BLUE, INK, ORANGE, PAPER, SOFT, T

WATER = "#8EC5F0"


class Beaker(VGroup):
    def __init__(self, cap, major=100, minor=None, height=4.0, width=1.8, label_every=None, unit="mL", size=26):
        super().__init__()
        self.cap, self.h, self.w = cap, height, width
        self.glass = VGroup(Line([-width / 2, height, 0], [-width / 2, 0, 0], color=INK, stroke_width=5),
                            Line([-width / 2, 0, 0], [width / 2, 0, 0], color=INK, stroke_width=5),
                            Line([width / 2, 0, 0], [width / 2, height, 0], color=INK, stroke_width=5))
        ticks = VGroup()
        labs = VGroup()
        step = minor or major
        label_every = label_every or major
        v = step
        while v <= cap + 1e-6:
            y = height * v / cap
            big = abs(v / major - round(v / major)) < 1e-6
            ln = 0.42 if big else 0.22
            ticks.add(Line([width / 2 - ln, y, 0], [width / 2, y, 0], color=INK, stroke_width=3 if big else 2))
            if abs(v / label_every - round(v / label_every)) < 1e-6:
                labs.add(T(f"{int(v)}", size, INK).next_to([width / 2, y, 0], RIGHT, buff=0.12))
            v += step
        self.ticks, self.labs = ticks, labs
        self.unit_lab = T(unit, size, SOFT).move_to([width / 2 + 0.45, height + 0.38, 0])
        self.water = Rectangle(width=width - 0.08, height=0.001, fill_color=WATER, fill_opacity=0.85, stroke_width=0)
        self.water.move_to([0, 0.0005, 0])
        self.add(self.water, self.glass, self.ticks, self.labs, self.unit_lab)
        self.base = np.array([0.0, 0.0, 0.0])

    def water_rect(self, ml):
        hh = max(self.h * ml / self.cap, 0.001)
        bottom = self.glass[1].get_center()
        r = Rectangle(width=self.w - 0.08, height=hh, fill_color=WATER, fill_opacity=0.85, stroke_width=0)
        r.move_to(bottom + UP * (hh / 2 + 0.02))
        return r

    def set_level(self, ml):
        self.water.become(self.water_rect(ml))
        return self


def cup(color=ORANGE, s=0.5):
    """종이컵"""
    return Polygon([-0.5 * s, 0.6 * s, 0], [0.5 * s, 0.6 * s, 0], [0.36 * s, -0.6 * s, 0], [-0.36 * s, -0.6 * s, 0],
                   color=INK, fill_color=color, fill_opacity=1, stroke_width=3)


def bottle(h=2.4, w=1.0, color=WATER, fill=1.0):
    body = RoundedRectangle(corner_radius=0.2, width=w, height=h * 0.75, stroke_color=INK, stroke_width=4,
                            fill_color=PAPER, fill_opacity=1)
    neck = Rectangle(width=w * 0.38, height=h * 0.18, stroke_color=INK, stroke_width=4, fill_color=PAPER, fill_opacity=1)
    neck.next_to(body, UP, buff=0)
    capm = Rectangle(width=w * 0.46, height=h * 0.07, stroke_width=0, fill_color=ORANGE, fill_opacity=1).next_to(neck, UP, buff=0)
    wat = Rectangle(width=w - 0.1, height=h * 0.75 * fill - 0.1, stroke_width=0, fill_color=color, fill_opacity=0.85)
    wat.align_to(body, DOWN).shift(UP * 0.05)
    return VGroup(body, wat, neck, capm)
