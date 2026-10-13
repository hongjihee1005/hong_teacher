"""분수 영상 공통 부품: 세로 분수 글자, 글과 분수를 한 줄로, 구슬, 분수 막대

    frac(2, 3)                     # 위 2, 가로선, 아래 3
    row("12의", frac(2, 3), "는?") # 글과 분수를 한 줄로 (글은 M 마크업 가능)
    bar = frac_bar(4, 3)           # 4칸 중 3칸 칠한 막대
"""
import numpy as np
from manim import DOWN, RIGHT, UP, Circle, Line, Rectangle, VGroup

from series_style import BLUE, INK, ORANGE, PAPER, PLATE, SOFT, M, T


def frac(n, d, size=60, cn=INK, cd=INK, bar=INK):
    top = T(str(n), size, cn)
    bot = T(str(d), size, cd)
    w = max(top.width, bot.width) + size / 260
    ln = Line([-w / 2, 0, 0], [w / 2, 0, 0], color=bar, stroke_width=max(3, size / 14))
    top.next_to(ln, UP, buff=size / 700)
    bot.next_to(ln, DOWN, buff=size / 700)
    g = VGroup(top, ln, bot)
    g.num, g.line, g.den = top, ln, bot
    return g


def row(*items, size=56, buff=0.18):
    parts = [M(x, size) if isinstance(x, str) else x for x in items]
    return VGroup(*parts).arrange(RIGHT, buff=buff)


def marble(color=BLUE, r=0.17):
    c = Circle(radius=r, fill_color=color, fill_opacity=1, stroke_color=INK, stroke_width=2)
    shine = Circle(radius=r * 0.28, fill_color=PAPER, fill_opacity=0.8, stroke_width=0).move_to(c.get_center() + np.array([-r * 0.35, r * 0.35, 0]))
    return VGroup(c, shine)


def frac_bar(d, k=0, width=6.0, height=0.8, color=ORANGE):
    """d칸으로 똑같이 나눈 막대, 앞 k칸 칠함. 반환 VGroup(칸들)"""
    w = width / d
    cells = VGroup(*[Rectangle(width=w, height=height, fill_color=color if i < k else PAPER, fill_opacity=1,
                               stroke_color=INK, stroke_width=4) for i in range(d)]).arrange(RIGHT, buff=0)
    return cells


def mixed(w, n, d, size=60, cw=INK, cn=INK, cd=INK):
    """대분수: 자연수 w와 n/d"""
    whole = T(str(w), size * 1.15, cw)
    f = frac(n, d, size, cn=cn, cd=cd)
    g = VGroup(whole, f).arrange(RIGHT, buff=size / 900)
    g.whole, g.frac = whole, f
    return g


def pie(d, k=0, r=1.0, color=ORANGE, stroke=INK):
    """d조각으로 똑같이 나눈 원, 12시부터 시계 방향으로 k조각 칠함. 반환 VGroup(조각들)"""
    from manim import PI, TAU, Sector
    secs = VGroup()
    for i in range(d):
        s = Sector(radius=r, start_angle=PI / 2 - TAU * i / d, angle=-TAU / d,
                   fill_color=color if i < k else PAPER, fill_opacity=1, stroke_color=stroke, stroke_width=4)
        s.move_arc_center_to([0, 0, 0])
        secs.add(s)
    return secs
