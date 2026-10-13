"""그림그래프 부품: 큰·중간·작은 그림(동그라미)으로 수를 나타내는 표

    UNITS2 = [(10, 0.26, BLUE), (1, 0.14, ORANGE)]
    pg = picture_graph("좋아하는 과일", [("사과", 24), ...], UNITS2, item_head="과일", unit_word="명")
    pg.icons[i] → 줄 i의 그림들(큰 것부터)
"""
from manim import DOWN, LEFT, RIGHT, UP, Circle, Line, Rectangle, VGroup

from series_style import BLUE, INK, ORANGE, PAPER, SOFT, T, M

UNITS2 = [(10, 0.25, BLUE), (1, 0.13, ORANGE)]
UNITS3 = [(100, 0.27, BLUE), (10, 0.18, ORANGE), (1, 0.1, "#2E9E5B")]


def icon(r, color):
    return Circle(radius=r, fill_color=color, fill_opacity=1, stroke_color=INK, stroke_width=2)


def split(v, units):
    out = []
    for u, r, c in units:
        k, v = divmod(v, u)
        out.append(k)
    return out


def icons_for(v, units):
    g = VGroup()
    for (u, r, c), k in zip(units, split(v, units)):
        for _ in range(k):
            g.add(icon(r, c))
    if len(g):
        g.arrange(RIGHT, buff=0.1)
    return g


def picture_graph(title, rows, units, item_head="항목", unit_word="", col1=1.9, col2=7.6, row_h=0.74, size=40, value_head=None):
    n = len(rows)
    W = col1 + col2
    H = row_h * (n + 1)
    frame = Rectangle(width=W, height=H, stroke_color=INK, stroke_width=4, fill_color=PAPER, fill_opacity=1)
    lines = VGroup()
    top = frame.get_top()[1]
    left = frame.get_left()[0]
    for i in range(1, n + 1):
        y = top - row_h * i
        lines.add(Line([left, y, 0], [left + W, y, 0], color=SOFT if i > 1 else INK, stroke_width=2 if i > 1 else 4))
    lines.add(Line([left + col1, top, 0], [left + col1, top - H, 0], color=INK, stroke_width=4))
    h1 = T(item_head, size).move_to([left + col1 / 2, top - row_h / 2, 0])
    h2 = T(value_head or "수", size).move_to([left + col1 + col2 / 2, top - row_h / 2, 0])
    names, icons = VGroup(), VGroup()
    for i, (nm, v) in enumerate(rows):
        y = top - row_h * (i + 1.5)
        names.add(T(nm, size).move_to([left + col1 / 2, y, 0]))
        ic = icons_for(v, units)
        if len(ic):
            ic.move_to([left + col1 + 0.25, y, 0], aligned_edge=LEFT)
        icons.add(ic)
    ttl = M(title, 46).next_to(frame, UP, buff=0.25)
    legend = VGroup()
    for u, r, c in units:
        legend.add(VGroup(icon(r, c), T(f"{u}{unit_word}", 32)).arrange(RIGHT, buff=0.12))
    legend.arrange(RIGHT, buff=0.45).next_to(frame, DOWN, buff=0.2).align_to(frame, RIGHT)
    g = VGroup(frame, lines, h1, h2, names, icons, ttl, legend)
    g.frame, g.names, g.icons, g.ttl, g.legend, g.heads, g.lines = frame, names, icons, ttl, legend, VGroup(h1, h2), lines
    return g
