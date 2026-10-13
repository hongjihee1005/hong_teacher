"""「수학 원리 돋보기」 35화 — 직사각형과 정사각형은 어떤 관계일까? (1학기 2단원 7·8차시, 화 코드 1-2-d)

네 각이 모두 직각 → 직사각형 → 가로를 줄여 네 변이 같아지면 정사각형 → 정사각형은 직사각형(역은 아님)
최종: ./make_final.sh 35
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Circle, Create, FadeIn, FadeOut, Indicate, LaggedStart, Polygon, Rectangle,
                   SurroundingRectangle, ValueTracker, VGroup, Write, always_redraw)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from geom import right_mark

FILL = "#DCE8F8"


def corners_marks(r, s=0.28):
    c = r.get_vertices()
    out = VGroup()
    for i in range(4):
        v, a, b_ = c[i], c[(i + 1) % 4], c[(i - 1) % 4]
        out.add(right_mark(v, a, b_, s))
    return out


class Ep35(EpisodeScene):
    EP_NO = 35
    EP_TITLE = "직사각형과 정사각형은 어떤 관계일까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.rect()
        self.morph()
        self.relation()
        self.closing(f"네 각이 모두 직각 → {b('직사각형')}\n네 각이 직각 + 네 변이 같음 → {o('정사각형')} (정사각형도 직사각형)",
                     next_preview="36화 · 나눗셈의 두 가지 뜻")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        shapes = VGroup(
            Rectangle(width=2.2, height=1.4),
            Polygon([0, 0, 0], [2.0, 0, 0], [2.4, 1.4, 0], [0.4, 1.4, 0]),
            Rectangle(width=1.6, height=1.6),
            Polygon([0, 0, 0], [2.0, 0, 0], [2.0, 1.5, 0], [0, 1.0, 0]),
        )
        for s_, x in zip(shapes, [-4.6, -1.6, 1.4, 4.4]):
            s_.set_stroke(INK, 5).set_fill(FILL, 1).move_to([x, 0.3, 0])
        labs = VGroup(*[T(n, 36).next_to(s_, DOWN, buff=0.3) for n, s_ in zip("가나다라", shapes)])
        self.say("체험 장소에서 찾은 사각형이에요", "안전 체험 장소에서 찾은 사각형이에요. 창문, 안전바, 매트, 게시판이에요.")
        self.play(LaggedStart(*[FadeIn(s_) for s_ in shapes], lag_ratio=0.2, run_time=1.2), FadeIn(labs))
        q = M("어떤 사각형끼리 묶을 수 있을까요?", 50).move_to([0, 2.4, 0])
        self.say("어떤 사각형끼리 묶을 수 있을까요?", "직각과 변의 길이를 살펴보면 어떤 사각형끼리 묶을 수 있을까요?")
        self.play(FadeIn(q), run_time=0.6)
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        self.play(FadeOut(q), run_time=0.3)
        self.say(f"가와 다는 네 각이 모두 {o('직각')}", "삼각자를 대어 보면 가와 다는 네 각이 모두 직각이에요. 나와 라는 아니에요.")
        self.play(Create(corners_marks(shapes[0])), Create(corners_marks(shapes[2])), run_time=1.0)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def rect(self):
        self.section("직사각형")
        r = Rectangle(width=4.0, height=2.4).set_stroke(INK, 6).set_fill(FILL, 1).move_to([-2.6, 0.3, 0])
        self.play(FadeIn(r), Create(corners_marks(r, 0.3)), run_time=0.8)
        d = M(f"네 각이 모두 직각인 사각형\n→ {b('직사각형')}", 50).move_to([3.2, 0.6, 0])
        self.say(f"네 각이 모두 직각인 사각형: {b('직사각형')}", "네 각이 모두 직각인 사각형을 직사각형이라고 해요. 직각사각형이 아니라 직사각형이에요.")
        self.play(FadeIn(d), run_time=0.6)
        t = M("마주 보는 두 변의 길이가 같아요", 38).move_to([3.2, -1.0, 0])
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def morph(self):
        self.section("가로를 줄여 보면")
        w = ValueTracker(4.4)
        h = 2.4
        rect = always_redraw(lambda: Rectangle(width=w.get_value(), height=h, color=GREEN if abs(w.get_value() - h) < 0.02 else INK,
                                               fill_color=FILL, fill_opacity=1, stroke_width=6).move_to([-2.6, 0.3, 0]))
        marks = always_redraw(lambda: corners_marks(Rectangle(width=w.get_value(), height=h).move_to([-2.6, 0.3, 0]), 0.28))
        wl = always_redraw(lambda: T(f"가로 {w.get_value():.1f}", 34, BLUE).next_to(rect, DOWN, buff=0.2))
        hl = T("세로 2.4", 34, ORANGE).move_to([-2.6 - 2.5, 0.3, 0])
        self.say("직사각형의 가로를 줄여 볼까요?", "직사각형의 세로는 그대로 두고 가로를 점점 줄여 볼까요?")
        self.play(FadeIn(rect), FadeIn(marks), FadeIn(wl), FadeIn(hl), run_time=0.6)
        self.play(w.animate.set_value(2.4), run_time=2.6)
        self.say(f"네 변의 길이가 {o('모두 같아졌어요')}", "가로와 세로가 같아졌어요. 네 각이 모두 직각이고 네 변의 길이가 모두 같아요.")
        self.wait(0.6)
        d = M(f"네 각이 직각 + 네 변이 같음\n→ {o('정사각형')}", 48).move_to([3.2, 0.6, 0])
        self.say(f"이 사각형을 {o('정사각형')}이라고 해요", "이렇게 네 각이 모두 직각이고 네 변의 길이가 모두 같은 사각형을 정사각형이라고 해요.")
        self.play(FadeIn(d), run_time=0.6)
        self.wait(1.4)
        for m in (rect, marks, wl):
            m.clear_updaters()
        self.settle()
        clear_stage(self, 0.6)

    def relation(self):
        self.section("정사각형은 직사각형일까?")
        big = Circle(radius=2.2, color=BLUE, stroke_width=6, fill_color=BLUE, fill_opacity=0.08).move_to([-2.4, 0.2, 0])
        small = Circle(radius=1.0, color=ORANGE, stroke_width=6, fill_color=ORANGE, fill_opacity=0.15).move_to([-2.0, -0.3, 0])
        lb = M(f"{b('직사각형')}", 40).move_to([-2.4, 1.7, 0])
        ls = M(f"{o('정사각형')}", 36).move_to(small)
        self.say("정사각형은 직사각형이라고 할 수 있을까요?", "정사각형은 직사각형이라고 할 수 있을까요?")
        self.play(FadeIn(big), FadeIn(lb), run_time=0.6)
        self.wait(1.4)
        self.play(FadeIn(small), FadeIn(ls), run_time=0.6)
        t1 = M(f"정사각형은 네 각이 모두 직각\n→ {g('직사각형이에요')}", 38).move_to([3.0, 0.8, 0])
        t2 = M(f"직사각형은 네 변이 다를 수 있어\n→ 정사각형이라고 할 수 {o('없어요')}", 38).move_to([3.0, -0.8, 0])
        for t in (t1, t2):
            t.scale_to_fit_width(min(t.width, 6.4))
        self.say(f"정사각형은 {g('직사각형이에요')}", "정사각형은 네 각이 모두 직각이니까 직사각형이에요.")
        self.play(FadeIn(t1), run_time=0.6)
        self.say(f"하지만 직사각형이 모두 정사각형은 {o('아니에요')}", "하지만 직사각형은 네 변의 길이가 다를 수 있으니, 모든 직사각형이 정사각형은 아니에요.")
        self.play(FadeIn(t2), run_time=0.6)
        self.wait(1.8)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
