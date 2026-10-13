"""평면도형 영상 공통 부품: 이름 붙은 점, 반직선(끝 화살표 없이 길게), 직각 표시"""
import numpy as np
from manim import DOWN, LEFT, RIGHT, UP, Dot, Line, VGroup, VMobject

from series_style import BLUE, INK, ORANGE, T


def pt(p, name, d=DOWN, color=INK, size=36):
    p = np.array(p, dtype=float)
    return VGroup(Dot(p, radius=0.09, color=color), T(name, size, color).next_to(p, d, buff=0.15))


def ray(a, b_, length=14.0, color=BLUE, width=7):
    a, b_ = np.array(a, float), np.array(b_, float)
    u = (b_ - a) / np.linalg.norm(b_ - a)
    return Line(a, a + u * length, color=color, stroke_width=width)


def line_both(a, b_, length=14.0, color=BLUE, width=7):
    a, b_ = np.array(a, float), np.array(b_, float)
    u = (b_ - a) / np.linalg.norm(b_ - a)
    m = (a + b_) / 2
    return Line(m - u * length / 2, m + u * length / 2, color=color, stroke_width=width)


def right_mark(v, a, b_, s=0.3, color=ORANGE):
    """꼭짓점 v에서 a, b 방향의 직각 표시 ⌞"""
    v, a, b_ = (np.array(x, float) for x in (v, a, b_))
    u1 = (a - v) / np.linalg.norm(a - v) * s
    u2 = (b_ - v) / np.linalg.norm(b_ - v) * s
    m = VMobject(color=color, stroke_width=5)
    m.set_points_as_corners([v + u1, v + u1 + u2, v + u2])
    return m
