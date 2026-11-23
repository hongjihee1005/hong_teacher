"""「개념 차근차근」(초1~초6 개념, EPISODES_CONCEPT.md) 공통 부품

    class GcEp01(ConceptScene): ...          # 화면 "개념 차근차근 1화", 바탕 버터색
    ten_frame(n)                              # 10칸 틀(2줄 × 5칸)에 구슬 n개
    dots(n, color, cols)                      # 구슬 n개를 cols칸씩
    pair_card(a, b)                           # 모으기·가르기 그림(위 한 수, 아래 두 수)
"""
import numpy as np
from manim import DOWN, LEFT, RIGHT, UP, Circle, Line, RoundedRectangle, Square, VGroup

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T

RED = "#E2574C"


class ConceptScene(EpisodeScene):
    GRADE, SEM = "C", 1
    LABEL = "개념 차근차근 {}화"


def dot(color=RED, r=0.24):
    return Circle(radius=r, fill_color=color, fill_opacity=1, stroke_color=INK, stroke_width=2.5)


def dots(n, color=RED, cols=5, step=0.62, r=0.24):
    g = VGroup(*[dot(color, r) for _ in range(n)])
    for i, d in enumerate(g):
        rr, cc = divmod(i, cols)
        d.move_to([cc * step, -rr * step, 0])
    return g


def ten_frame(n=0, color=RED, cell=0.8, colors=None):
    """10칸 틀. 반환 VGroup(칸들, 구슬들). colors가 있으면 구슬마다 색"""
    cells = VGroup(*[Square(side_length=cell, fill_color=PAPER, fill_opacity=1, stroke_color=INK, stroke_width=3)
                     for _ in range(10)])
    for i, c in enumerate(cells):
        rr, cc = divmod(i, 5)
        c.move_to([cc * cell, -rr * cell, 0])
    bs = VGroup()
    for i in range(n):
        col = colors[i] if colors else color
        bs.add(dot(col, cell * 0.33).move_to(cells[i]))
    return VGroup(cells, bs)


def pair_card(top, left, right, size=72, color=INK):
    """모으기·가르기 그림: 위 한 칸, 아래 두 칸, 이어 주는 선"""
    def box(v, c):
        r = RoundedRectangle(corner_radius=0.2, width=1.3, height=1.1, fill_color=PAPER, fill_opacity=1,
                             stroke_color=INK, stroke_width=3)
        t = T(str(v), size, c).move_to(r)
        return VGroup(r, t)
    a = box(top, GREEN).move_to([0, 1.0, 0])
    b = box(left, BLUE).move_to([-1.3, -0.9, 0])
    c = box(right, ORANGE).move_to([1.3, -0.9, 0])
    l1 = Line(a.get_bottom(), b.get_top(), color=INK, stroke_width=4)
    l2 = Line(a.get_bottom(), c.get_top(), color=INK, stroke_width=4)
    return VGroup(l1, l2, a, b, c)
