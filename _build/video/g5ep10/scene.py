"""「수학 원리 돋보기」 5학년 10화 — 함께 변하는 두 양 (5-1 3단원 2차시, 화 코드 5-1-3-a)

식탁이 1개씩 늘 때 다리는 4개씩 늚: 1→4, 2→8, 3→12, 4→16, 5→20
다리의 수 = 식탁의 수 × 4, 식탁의 수 = 다리의 수 ÷ 4 / 대응한다, 대응 관계
최종: GRADE=5 ./make_final.sh 10
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, Line, Rectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from corresp import CTable

WOOD = "#B5835A"


def table_icon(s=1.0):
    top = Rectangle(width=1.0 * s, height=0.14 * s, fill_color=WOOD, fill_opacity=1, stroke_width=0)
    legs = VGroup(*[Line([x * s, -0.07 * s, 0], [x * s + d * s, -0.6 * s, 0], color="#7A5230", stroke_width=5) for x, d in ((-0.42, -0.05), (-0.22, 0.0), (0.22, 0.0), (0.42, 0.05))])
    return VGroup(top, legs)


class G5Ep10(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 10
    EP_TITLE = "함께 변하는 두 양"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.grow()
        self.both()
        self.closing(f"한 양이 변할 때 다른 양이 {o('따라 변하는')} 관계가 {g('대응 관계')}\n다리의 수는 식탁의 수의 {b('4배')}",
                     next_preview="5학년 11화 · 더하거나 빼는 대응 관계")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("식탁이 늘어나면 식탁 다리의 수는\n어떻게 변할까요?", 46).move_to([0.6, 1.7, 0])
        ts = VGroup(*[table_icon(0.9) for _ in range(3)]).arrange(RIGHT, buff=0.5).move_to([0, -0.4, 0])
        self.say("식탁과 식탁 다리", "식탁이 늘어나면 식탁 다리의 수는 어떻게 변할까요?")
        self.play(Write(q), FadeIn(ts), run_time=1.2)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def grow(self):
        self.section("하나씩 늘려 보기")
        tb = CTable(["식탁의 수(개)", "다리의 수(개)"], [1, 2, 3, 4, 5], [4, 8, 12, 16, 20], center=[0, -0.9, 0])
        self.play(FadeIn(tb.frame), run_time=0.6)
        icons = VGroup()
        self.say("식탁을 하나씩 놓아 봐요", "식탁을 하나씩 놓으며 다리의 수를 세어 볼게요.")
        for k in range(5):
            ic = table_icon(1.1).move_to([-4.6 + k * 2.2, 1.4, 0])
            icons.add(ic)
            self.play(FadeIn(ic), FadeIn(tb.top[k]), FadeIn(tb.bot[k]), run_time=0.55)
        steps = VGroup(*[T("+4", 32, ORANGE).move_to([(tb.xs[k] + tb.xs[k + 1]) / 2, tb.y_bot - 0.62, 0]) for k in range(4)])
        self.say(f"식탁이 1개 늘 때 다리는 {o('4개씩')}", "식탁이 1개씩 늘어날 때마다 다리는 4개씩 늘어나요.")
        self.play(LaggedStart(*[FadeIn(s) for s in steps], lag_ratio=0.2, run_time=1.0))
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def both(self):
        self.section("두 양 사이의 관계")
        tb = CTable(["식탁의 수(개)", "다리의 수(개)"], [1, 2, 3, 4, 5], [4, 8, 12, 16, 20], center=[-0.8, 1.1, 0])
        self.add(tb.frame, tb.top, tb.bot)
        dn = tb.arrows("× 4", color=ORANGE)
        self.say(f"다리의 수는 식탁의 수의 {o('4배')}", "위아래 칸을 견주면, 다리의 수는 언제나 식탁의 수의 4배예요.")
        self.play(FadeIn(dn), run_time=0.6)
        e1 = M(f"(다리의 수) = (식탁의 수) × {o('4')}", 42).move_to([0, -0.45, 0])
        e2 = M(f"(식탁의 수) = (다리의 수) ÷ {b('4')}", 42).move_to([0, -1.2, 0])
        self.play(FadeIn(e1), run_time=0.5)
        self.say(f"거꾸로 식탁의 수는 다리의 수 {b('÷ 4')}", "거꾸로 식탁의 수는 다리의 수를 4로 나눈 것과 같아요.")
        self.play(FadeIn(e2), run_time=0.5)
        t = M(f"짝을 이루어 함께 변해요 → {g('대응 관계')}", 40).move_to([0, -2.0, 0])
        self.say(f"이런 관계를 {g('대응 관계')}라고 해요", "식탁 1개와 다리 4개처럼 두 양이 짝을 이루는 것을 대응한다고 하고, 한 양이 변할 때 다른 양이 따라 변하는 관계를 대응 관계라고 해요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
