"""여러 화에서 같이 쓰는 작은 그림: 건전지, 묶음 배치, ✓ / ✗ 표시"""
import numpy as np
from manim import DOWN, UP, Line, Rectangle, RoundedRectangle, SurroundingRectangle, VGroup

from series_style import BLUE, GREEN, INK, ORANGE

CELL = "#D9D2C5"



def battery():
    body = RoundedRectangle(corner_radius=0.05, width=0.26, height=0.56, fill_color=CELL, fill_opacity=1,
                            stroke_color=INK, stroke_width=2.5)
    top = Rectangle(width=0.1, height=0.06, fill_color=INK, fill_opacity=1, stroke_width=0)
    top.next_to(body, UP, buff=0)
    band = Rectangle(width=0.26, height=0.14, fill_color=ORANGE, fill_opacity=0.85, stroke_width=0)
    band.move_to(body.get_top() + DOWN * 0.12)
    return VGroup(body, band, top)


def layout(n, per, groups, y=0.0, step=0.4, gap=0.75):
    """n개를 per개씩 groups묶음 + 나머지로 늘어놓을 자리"""
    pts, x = [], 0.0
    for gi in range(groups):
        for i in range(per):
            pts.append(x)
            x += step
        x += gap - step
    for i in range(n - per * groups):
        pts.append(x)
        x += step
    pts = np.array(pts)
    pts -= (pts[0] + pts[-1]) / 2
    return [np.array([p, y, 0]) for p in pts]


def group_boxes(items, per, groups, color=BLUE):
    return VGroup(*[SurroundingRectangle(VGroup(*items[gi * per:(gi + 1) * per]), color=color, buff=0.12,
                                         stroke_width=5, corner_radius=0.15) for gi in range(groups)])


def check_mark(size=0.6, color=GREEN):
    p0, p1, p2 = (np.array(v) * size for v in ([-0.5, 0, 0], [-0.15, -0.4, 0], [0.55, 0.45, 0]))
    return VGroup(Line(p0, p1, stroke_width=14, color=color), Line(p1, p2, stroke_width=14, color=color))


def cross_mark(size=0.6, color=INK):
    a = size * 0.5
    return VGroup(Line([-a, -a, 0], [a, a, 0], stroke_width=14, color=color),
                  Line([-a, a, 0], [a, -a, 0], stroke_width=14, color=color))
