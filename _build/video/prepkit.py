"""분수 준비(곱셈부터 차근차근) 공통 부품

    PrepScene             # GRADE "P" · "분수 준비 N화"를 정해 둔 장면 바탕
    items(n, color, y, step, r)          # 구슬 n개 한 줄
    regroup(S, its, per, y, gap)         # per개씩 묶음으로 벌려 놓고 상자(반환: 상자들)
    count_under(S, boxes, start, step)   # 상자 아래에 뛰어 세기 수(step, 2·step, …)
    grid_items(rows, cols, color, step)  # 줄 맞춘 배열(반환: 줄 목록 VGroup)
    dish(label)                          # 접시(이름표)
"""
import numpy as np
from manim import DOWN, LEFT, RIGHT, UP, Ellipse, FadeIn, LaggedStart, Create, VGroup

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, PLATE, SOFT, EpisodeScene, M, T
from fraction import marble
from items import group_boxes, layout

RED = "#E0533D"
PINK = "#E46FA8"


class PrepScene(EpisodeScene):
    GRADE, SEM = "P", 1
    LABEL = "분수 준비 {}화"


def items(n, color=RED, y=0.9, step=0.62, r=0.24):
    its = VGroup(*[marble(color, r) for _ in range(n)])
    for m, p in zip(its, layout(n, n, 1, y=y, step=step)):
        m.move_to(p)
    return its


def regroup(S, its, per, y=0.9, step=0.62, gap=1.0, color=BLUE, run_time=0.8):
    n = len(its)
    pts = layout(n, per, n // per, y=y, step=step, gap=gap)
    S.play(*[m.animate.move_to(p) for m, p in zip(its, pts)], run_time=run_time)
    boxes = group_boxes(list(its), per, n // per, color=color)
    S.play(LaggedStart(*[Create(bx) for bx in boxes], lag_ratio=0.3, run_time=0.9))
    return boxes


def count_under(S, boxes, step, color=BLUE, size=40, each=0.45):
    labs = VGroup()
    for i, bx in enumerate(boxes):
        t = T(str(step * (i + 1)), size, color).next_to(bx, DOWN, buff=0.2)
        labs.add(t)
        S.play(FadeIn(t, scale=1.4), run_time=each)
    return labs


def grid_items(rows, cols, color=RED, step=0.62, r=0.24, center=(0, 0.6, 0)):
    lines = VGroup()
    for i in range(rows):
        line = VGroup(*[marble(color, r).move_to([j * step, -i * step, 0]) for j in range(cols)])
        lines.add(line)
    lines.move_to(center)
    return lines


def dish(label, w=2.6, h=0.9):
    e = Ellipse(width=w, height=h, fill_color=PLATE, fill_opacity=1, stroke_color=SOFT, stroke_width=4)
    t = T(label, 30, INK).next_to(e, DOWN, buff=0.15)
    g = VGroup(e, t)
    g.plate, g.name = e, t
    return g
