"""회전체(원기둥·원뿔·구) 겨냥도 부품 — 밑면 원을 납작한 타원으로 그림, 안 보이는 뒤쪽 반은 점선

    cylinder(r, h, center)   → VGroup(옆면 채움, 아래 타원(앞 실선·뒤 점선), 위 타원, 옆 선 2개); .top .bottom .side 속성
    cone(r, h, center)       → VGroup(옆면 채움, 밑 타원, 옆 선 2개); .apex .base
    sphere(r, center)        → VGroup(원, 적도 타원(앞 실선·뒤 점선)); .center
"""
import numpy as np
from manim import PI, DashedVMobject, Ellipse, Line, Polygon, VGroup, VMobject

from series_style import INK, SOFT

FLAT = 0.32   # 타원의 세로/가로 비


def _ellipse_halves(c, r, color=INK, width=4):
    c = np.array(c, float)
    e = Ellipse(width=2 * r, height=2 * r * FLAT, color=color, stroke_width=width).move_to(c)
    pts_f = [c + np.array([r * np.cos(t), r * FLAT * np.sin(t), 0]) for t in np.linspace(PI, 2 * PI, 40)]
    pts_b = [c + np.array([r * np.cos(t), r * FLAT * np.sin(t), 0]) for t in np.linspace(0, PI, 40)]
    f = VMobject(color=color, stroke_width=width).set_points_smoothly(pts_f)
    b = VMobject(color=SOFT, stroke_width=width - 1).set_points_smoothly(pts_b)
    b = DashedVMobject(b, num_dashes=14)
    return f, b, e


def _front(c, r, n=40):
    return [c + np.array([r * np.cos(t), r * FLAT * np.sin(t), 0]) for t in np.linspace(PI, 2 * PI, n)]


def cylinder(r, h, center=(0, 0, 0), fill="#F2C14E", op=0.5, color=INK):
    c = np.array(center, float)
    bc, tc = c + np.array([0, -h / 2, 0]), c + np.array([0, h / 2, 0])
    bf, bb, _ = _ellipse_halves(bc, r, color)
    top = Ellipse(width=2 * r, height=2 * r * FLAT, color=color, stroke_width=4, fill_color=fill, fill_opacity=min(1, op + 0.25)).move_to(tc)
    side = Polygon(*_front(bc, r), tc + np.array([r, 0, 0]), tc + np.array([-r, 0, 0]), fill_color=fill, fill_opacity=op, stroke_width=0)
    lf = Line(bc + np.array([-r, 0, 0]), tc + np.array([-r, 0, 0]), color=color, stroke_width=4)
    rt = Line(bc + np.array([r, 0, 0]), tc + np.array([r, 0, 0]), color=color, stroke_width=4)
    g = VGroup(side, bb, bf, lf, rt, top)
    g.top, g.bottom, g.side, g.bot_front, g.bot_back = top, VGroup(bf, bb), side, bf, bb
    g.bc, g.tc, g.r, g.h = bc, tc, r, h
    return g


def cone(r, h, center=(0, 0, 0), fill="#7C9CC9", op=0.5, color=INK):
    c = np.array(center, float)
    bc = c + np.array([0, -h / 2, 0])
    apex = c + np.array([0, h / 2, 0])
    bf, bb, _ = _ellipse_halves(bc, r, color)
    side = Polygon(*_front(bc, r), apex, fill_color=fill, fill_opacity=op, stroke_width=0)
    lf = Line(bc + np.array([-r, 0, 0]), apex, color=color, stroke_width=4)
    rt = Line(bc + np.array([r, 0, 0]), apex, color=color, stroke_width=4)
    g = VGroup(side, bb, bf, lf, rt)
    g.apex, g.bc, g.r, g.h, g.base = apex, bc, r, h, VGroup(bf, bb)
    return g


def sphere(r, center=(0, 0, 0), fill="#6FBF8E", op=0.45, color=INK):
    from manim import Circle
    c = np.array(center, float)
    body = Circle(radius=r, color=color, stroke_width=4, fill_color=fill, fill_opacity=op).move_to(c)
    ef, eb, _ = _ellipse_halves(c, r, color, 3)
    g = VGroup(body, eb, ef)
    g.center_, g.r = c, r
    return g
