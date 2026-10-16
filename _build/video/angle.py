"""각도(4학년 1학기 2단원) 부품 — 각, 움직이는 각, 각도기

    a = angle_fig([0, 0, 0], 50, start=0, L=3)        # 꼭짓점·두 변·호
    ang = DynAngle(S, v, tracker, start=0, L=3)       # tracker(도)에 따라 벌어지는 각
    p = protractor([0, 0, 0], R=3)                    # 각도기(안쪽 눈금: 오른쪽 0, 바깥 눈금: 왼쪽 0)
"""
import numpy as np
from manim import (DEGREES, DOWN, LEFT, ORIGIN, PI, RIGHT, UP, Annulus, AnnularSector, Arc, Dot, Line,
                   Sector, VGroup, always_redraw)

from series_style import BLUE, INK, ORANGE, PAPER, SOFT, T

PURPLE = "#7A4FB5"


def unit(deg):
    r = deg * DEGREES
    return np.array([np.cos(r), np.sin(r), 0.0])


def angle_fig(v, deg, start=0.0, L=3.0, L2=None, color=BLUE, arc_r=0.6, arc_color=ORANGE, width=7, fill=False):
    v = np.array(v, float)
    s1 = Line(v, v + unit(start) * L, color=color, stroke_width=width)
    s2 = Line(v, v + unit(start + deg) * (L2 or L), color=color, stroke_width=width)
    if fill:
        arc = Sector(radius=arc_r, start_angle=start * DEGREES, angle=deg * DEGREES, arc_center=v,
                     fill_color=arc_color, fill_opacity=0.35, stroke_color=arc_color, stroke_width=4)
    else:
        arc = Arc(radius=arc_r, start_angle=start * DEGREES, angle=deg * DEGREES, arc_center=v,
                  color=arc_color, stroke_width=6)
    dot = Dot(v, radius=0.08, color=INK)
    g = VGroup(s1, s2, arc, dot)
    g.s1, g.s2, g.arc, g.v = s1, s2, arc, v
    return g


def dyn_angle(v, tracker, start=0.0, L=3.0, color=BLUE, arc_r=0.6, arc_color=ORANGE, width=7):
    """tracker 값(도)에 따라 다시 그려지는 각"""
    v = np.array(v, float)
    return always_redraw(lambda: angle_fig(v, max(tracker.get_value(), 0.5), start, L, color=color,
                                           arc_r=arc_r, arc_color=arc_color, width=width))


def protractor(c, R=3.0, inner=True, outer=True, color=INK, num_size=20):
    """반원 각도기. 안쪽 숫자는 오른쪽이 0(시계 반대 방향으로 커짐), 바깥 숫자는 왼쪽이 0"""
    c = np.array(c, float)
    body = AnnularSector(inner_radius=0, outer_radius=R, angle=PI, start_angle=0, arc_center=c,
                         fill_color="#DCEBFA", fill_opacity=0.55, stroke_color=color, stroke_width=2.5)
    base = Line(c + LEFT * R, c + RIGHT * R, color=color, stroke_width=3)
    ticks = VGroup()
    for d in range(0, 181):
        ln = 0.12 if d % 5 else (0.22 if d % 10 else 0.34)
        w = 1.2 if d % 5 else (2 if d % 10 else 2.6)
        u = unit(d)
        ticks.add(Line(c + u * R, c + u * (R - ln), color=color, stroke_width=w))
    nums = VGroup()
    for d in range(0, 181, 10):
        u = unit(d)
        if outer:
            nums.add(T(str(180 - d), num_size, PURPLE).move_to(c + u * (R - 0.5)))
        if inner:
            nums.add(T(str(d), num_size, BLUE).move_to(c + u * (R - 1.05)))
    center = VGroup(Line(c + LEFT * 0.15, c + RIGHT * 0.15, color=ORANGE, stroke_width=4),
                    Line(c, c + UP * 0.25, color=ORANGE, stroke_width=4))
    g = VGroup(body, base, ticks, nums, center)
    g.c, g.R = c, R
    return g


def wedge(v, deg, start, r=1.2, color=ORANGE, op=0.55):
    """각을 재는 작은 부채꼴 조각"""
    return Sector(radius=r, start_angle=start * DEGREES, angle=deg * DEGREES, arc_center=np.array(v, float),
                  fill_color=color, fill_opacity=op, stroke_color=INK, stroke_width=2)
