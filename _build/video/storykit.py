"""사실·역사 이야기 영상 공통 부품(분수 이야기, 자연수 이야기)

    timeline(points, y)        # 시간 띠: [(이름, 위치 0~1)] → 띠와 눈금·이름
    scroll(w, h)               # 파피루스(양 끝이 말린 종이)
    book(title)                # 옛 책(세로 표지)
    show_sources(S, lines)     # '이 영상의 출처' 화면(작은 글씨, 몇 초)
"""
import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Circle, FadeIn, FadeOut, Line, Rectangle, RoundedRectangle, VGroup)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, M, T

PAPYRUS = "#E9D7A8"
BOOK = "#B5523B"


def timeline(points, y=0.0, x0=-6.0, x1=6.0, color=INK, size=30):
    bar = Line([x0, y, 0], [x1, y, 0], color=color, stroke_width=6)
    marks = VGroup()
    for name, p in points:
        x = x0 + (x1 - x0) * p
        tick = Line([x, y - 0.18, 0], [x, y + 0.18, 0], color=color, stroke_width=6)
        lab = M(name, size).next_to(tick, DOWN, buff=0.2)
        marks.add(VGroup(tick, lab))
    g = VGroup(bar, marks)
    g.bar, g.marks = bar, marks
    g.x = lambda p: x0 + (x1 - x0) * p
    return g


def scroll(w=4.6, h=2.6):
    body = Rectangle(width=w, height=h, fill_color=PAPYRUS, fill_opacity=1, stroke_color="#9C7B3C", stroke_width=4)
    rl = RoundedRectangle(corner_radius=0.12, width=0.3, height=h + 0.3, fill_color="#D6BE80", fill_opacity=1,
                          stroke_color="#9C7B3C", stroke_width=4).next_to(body, LEFT, buff=-0.05)
    rr = rl.copy().next_to(body, RIGHT, buff=-0.05)
    g = VGroup(body, rl, rr)
    g.body = body
    return g


def book(title, w=2.2, h=3.0):
    cover = Rectangle(width=w, height=h, fill_color=BOOK, fill_opacity=1, stroke_color=INK, stroke_width=4)
    label = Rectangle(width=w * 0.36, height=h * 0.75, fill_color=PAPER, fill_opacity=1, stroke_color=INK,
                      stroke_width=2).move_to(cover.get_center() + RIGHT * w * 0.18)
    t = VGroup(*[T(c, 34, INK) for c in title]).arrange(DOWN, buff=0.04)
    t.scale_to_fit_height(min(t.height, label.height * 0.9)).move_to(label)
    seams = VGroup(*[Line(cover.get_corner(UP + LEFT) + RIGHT * 0.18 + DOWN * h * k, cover.get_corner(UP + LEFT) + RIGHT * 0.32 + DOWN * h * k,
                          color=PAPER, stroke_width=3) for k in (0.15, 0.38, 0.62, 0.85)])
    return VGroup(cover, label, t, seams)


def show_sources(S, lines, seconds=6.0):
    """'이 영상의 출처' 화면. lines는 글 목록(짧게)."""
    S.settle()
    S.clear_sub() if hasattr(S, "clear_sub") else None
    head = T("이 영상의 출처", 50, GREEN).move_to([0, 2.8, 0])
    body = VGroup(*[M(x, 26) for x in lines]).arrange(DOWN, buff=0.22, aligned_edge=LEFT)
    if body.width > 12.6:
        body.scale_to_fit_width(12.6)
    body.next_to(head, DOWN, buff=0.45)
    S._log.append((S.now(), "출처", "이 영상의 출처", "이 영상에서 소개한 사실의 출처예요."))
    S.play(FadeIn(head), FadeIn(body, lag_ratio=0.05), run_time=0.8)
    S.wait(seconds)
    S.play(FadeOut(head), FadeOut(body), run_time=0.5)
