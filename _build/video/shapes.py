"""삼각형·사각형·다각형(4학년 2학기) 부품 — 같은 길이 표시, 각 표시, 평행 표시, 정다각형

    t = poly([[x, y, 0], ...])                     # 다각형 선
    tick(a, b, n=1)                                # 변 ab 가운데 같은 길이 표시(짧은 금 n개)
    arc_at(P, i, r=0.5, color=…, n=1)              # 꼭짓점 i의 각 표시(호 n겹)
    par_mark(a, b, n=1)                            # 평행 표시(>)
    regular(n, r, center)                          # 정n각형 꼭짓점
"""
import numpy as np
from manim import DEGREES, Arc, Line, Polygon, VGroup, VMobject

from series_style import BLUE, INK, ORANGE

PURPLE = "#7A4FB5"


def poly(P, color=INK, fill=None, op=0.25, width=5):
    p = Polygon(*[np.array(x, float) for x in P], color=color, stroke_width=width)
    if fill:
        p.set_fill(fill, opacity=op)
    return p


def tick(a, b, n=1, size=0.22, color=ORANGE, gap=0.12):
    a, b = np.array(a, float), np.array(b, float)
    m = (a + b) / 2
    u = (b - a) / np.linalg.norm(b - a)
    nrm = np.array([-u[1], u[0], 0])
    g = VGroup()
    for k in range(n):
        c = m + u * (k - (n - 1) / 2) * gap
        g.add(Line(c - nrm * size, c + nrm * size, color=color, stroke_width=7))
    return g


def ang(p, q):
    return np.degrees(np.arctan2(q[1] - p[1], q[0] - p[0]))


def arc_at(P, i, r=0.5, color=ORANGE, n=1, width=5):
    P = [np.array(x, float) for x in P]
    p, q, s = P[i], P[(i + 1) % len(P)], P[(i - 1) % len(P)]
    a1, a2 = ang(p, q), ang(p, s)
    d = (a2 - a1) % 360
    if d > 180:
        a1, d = a2, 360 - d
    return VGroup(*[Arc(radius=r + k * 0.1, start_angle=a1 * DEGREES, angle=d * DEGREES, arc_center=p,
                        color=color, stroke_width=width) for k in range(n)])


def angle_deg(P, i):
    P = [np.array(x, float) for x in P]
    p, q, s = P[i], P[(i + 1) % len(P)], P[(i - 1) % len(P)]
    d = (ang(p, s) - ang(p, q)) % 360
    return min(d, 360 - d)


def par_mark(a, b, n=1, size=0.18, color=BLUE):
    a, b = np.array(a, float), np.array(b, float)
    m = (a + b) / 2
    u = (b - a) / np.linalg.norm(b - a)
    nrm = np.array([-u[1], u[0], 0])
    g = VGroup()
    for k in range(n):
        c = m + u * k * 0.16
        v = VMobject(color=color, stroke_width=5)
        v.set_points_as_corners([c - u * size + nrm * size, c, c - u * size - nrm * size])
        g.add(v)
    return g


def regular(n, r=1.5, center=(0, 0, 0), start=90):
    c = np.array(center, float)
    return [c + r * np.array([np.cos(np.radians(start + 360 * k / n)), np.sin(np.radians(start + 360 * k / n)), 0]) for k in range(n)]


def right_mark(O, u, v, s=0.32, color=ORANGE, width=5):
    """O에서 방향 u, v(단위가 아니어도 됨)가 이루는 직각 표시(작은 네모)"""
    O = np.array(O, float)
    u = np.array(u, float) / np.linalg.norm(u)
    v = np.array(v, float) / np.linalg.norm(v)
    m = VMobject(color=color, stroke_width=width)
    m.set_points_as_corners([O + u * s, O + (u + v) * s, O + v * s])
    return m
