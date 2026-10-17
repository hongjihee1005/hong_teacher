"""수의 범위(5학년 2학기 1단원) 부품 — 수직선 위 ●(포함)·○(포함 안 함)과 범위 선

    nl, labs = numline(a, b, step, length, center, label_every)
    r = rng(nl, lo, hi, lo_in=True, hi_in=True, color, y_off)   # lo/hi가 None이면 화살표로 끝까지
"""
import numpy as np
from manim import DOWN, LEFT, RIGHT, UP, Arrow, Circle, Dot, Line, NumberLine, VGroup

from series_style import INK, ORANGE, PAPER, SOFT, T


def numline(a, b, step=1, length=11.0, center=(0, 0, 0), label_every=1, size=26):
    nl = NumberLine(x_range=[a, b, step], length=length, color=INK, stroke_width=3, include_numbers=False).move_to(center)
    labs = VGroup()
    k = 0
    v = a
    while v <= b + 1e-9:
        if k % label_every == 0:
            labs.add(T(f"{v:g}", size, SOFT).next_to(nl.n2p(v), DOWN, buff=0.18))
        v += step
        k += 1
    return nl, labs


def endpoint(p, filled, color=ORANGE, r=0.13):
    c = Circle(radius=r, color=color, stroke_width=5).move_to(p)
    c.set_fill(color if filled else PAPER, 1)
    return c


def rng(nl, lo=None, hi=None, lo_in=True, hi_in=True, color=ORANGE, y_off=0.45):
    """수직선 위쪽에 범위 표시"""
    y = nl.n2p(nl.x_range[0])[1] + y_off
    xl = nl.n2p(lo)[0] if lo is not None else nl.n2p(nl.x_range[0])[0] - 0.1
    xr = nl.n2p(hi)[0] if hi is not None else nl.n2p(nl.x_range[1])[0] + 0.1
    g = VGroup()
    if lo is None:
        g.add(Arrow([xr, y, 0], [xl - 0.3, y, 0], color=color, buff=0, stroke_width=7, max_tip_length_to_length_ratio=0.06))
    elif hi is None:
        g.add(Arrow([xl, y, 0], [xr + 0.3, y, 0], color=color, buff=0, stroke_width=7, max_tip_length_to_length_ratio=0.06))
    else:
        g.add(Line([xl, y, 0], [xr, y, 0], color=color, stroke_width=7))
    if lo is not None:
        g.add(endpoint([xl, y, 0], lo_in, color))
        g.add(Line([xl, y, 0], nl.n2p(lo), color=color, stroke_width=2).set_opacity(0.5))
    if hi is not None:
        g.add(endpoint([xr, y, 0], hi_in, color))
        g.add(Line([xr, y, 0], nl.n2p(hi), color=color, stroke_width=2).set_opacity(0.5))
    return g
