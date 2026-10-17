"""「수학 원리 돋보기」 5학년 38화 — (자연수) × (분수) (5-2 2단원 4·5차시, 화 코드 5-2-2-c)

6 × 1/3: 6의 1/3 = 6을 똑같이 셋으로 나눈 하나 = 2 / 6 × 2/3 = 6의 1/3이 2개 = 4 = (6 × 2)/3
1보다 작은 수를 곱하면 원래 수보다 작아짐 / 3 × 1 1/4 = 3 + 3/4 = 3 3/4 (1보다 큰 수를 곱하면 커짐)
최종: GRADE=5 ./make_final.sh 38
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Circle, Create, FadeIn, FadeOut, Indicate, LaggedStart, RoundedRectangle,
                   SurroundingRectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, mixed, row

RED = "#E05A5A"


def apples(n, r=0.28):
    return VGroup(*[Circle(radius=r, fill_color=RED, fill_opacity=1, stroke_color="#8A2B2B", stroke_width=2) for _ in range(n)])


class G5Ep38(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 38
    EP_TITLE = "(자연수) × (분수)"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.third()
        self.two_thirds()
        self.compare()
        self.closing(f"(자연수) × (분수)는 {o('분모는 그대로')}, 자연수와 분자를 곱해요\n1보다 작은 수를 곱하면 {g('작아지고')}, 1보다 큰 수를 곱하면 커져요",
                     next_preview="5학년 39화 · 진분수의 곱셈")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("사과 6개의 2/3는 몇 개일까요?", 48).move_to([0.6, 1.8, 0])
        a = apples(6).arrange(RIGHT, buff=0.25).move_to([0, -0.3, 0])
        self.say("6 × 2/3는?", "사과 6개의 3분의 2는 몇 개일까요?")
        self.play(Write(q), FadeIn(a), run_time=1.2)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def third(self):
        self.section("6의 1/3")
        groups = VGroup(*[apples(2).arrange(RIGHT, buff=0.2) for _ in range(3)]).arrange(RIGHT, buff=0.9).move_to([0, 1.0, 0])
        boxes = VGroup(*[SurroundingRectangle(gr, color=SOFT, buff=0.15, corner_radius=0.15) for gr in groups])
        self.say("6개를 똑같이 셋으로 나누면", "6의 3분의 1은 6을 똑같이 셋으로 나눈 것 중의 하나예요.")
        self.play(FadeIn(groups), Create(boxes), run_time=0.8)
        self.play(boxes[0].animate.set_stroke(ORANGE, 6), run_time=0.4)
        e = row("6 ×", frac(1, 3, 52), "=", T("2", 60, ORANGE), size=50).move_to([0, -0.8, 0])
        self.say(f"6의 1/3은 {o('2')}", "셋으로 나눈 것 중 하나는 2개. 6 곱하기 3분의 1은 2예요.")
        self.play(FadeIn(e), run_time=0.5)
        self.wait(0.8)
        self.settle()
        clear_stage(self, 0.6)

    def two_thirds(self):
        self.section("6의 2/3")
        groups = VGroup(*[apples(2).arrange(RIGHT, buff=0.2) for _ in range(3)]).arrange(RIGHT, buff=0.9).move_to([0, 1.3, 0])
        boxes = VGroup(*[SurroundingRectangle(gr, color=SOFT, buff=0.15, corner_radius=0.15) for gr in groups])
        self.add(groups, boxes)
        self.say(f"1/3이 {o('2개')}이면", "3분의 2는 3분의 1이 2개예요. 셋으로 나눈 것 중 두 묶음이에요.")
        self.play(boxes[0].animate.set_stroke(ORANGE, 6), boxes[1].animate.set_stroke(ORANGE, 6), run_time=0.6)
        e = row("6 ×", frac(2, 3, 52), "=", frac("6 × 2", 3, 52), "=", frac(12, 3, 52), "=", T("4", 60, GREEN), size=48).move_to([0, -0.4, 0])
        self.say(f"6 × 2/3 = {g('4')}", "두 묶음은 4개. 식으로는 분모는 그대로 두고 자연수 6과 분자 2를 곱해 3분의 12, 4예요.")
        self.play(FadeIn(e), run_time=0.8)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def compare(self):
        self.section("곱이 작아질까, 커질까?")
        e1 = row("6 ×", frac(2, 3, 50), "=", T("4", 56, ORANGE), size=48).move_to([-3.2, 1.3, 0])
        n1 = M(f"1보다 작은 수를 곱하면\n6보다 {o('작아져요')}", 34).next_to(e1, DOWN, buff=0.4)
        self.say(f"1보다 작은 수를 곱하면 {o('작아져요')}", "3분의 2는 1보다 작아요. 1보다 작은 수를 곱하면 곱은 원래 수 6보다 작아져요.")
        self.play(FadeIn(e1), FadeIn(n1), run_time=0.7)
        e2 = row("3 ×", mixed(1, 1, 4, 50), "=", T("3", 50), "+", frac(3, 4, 46), "=", mixed(3, 3, 4, 52, cw=BLUE, cn=BLUE, cd=BLUE), size=44).move_to([3.0, 1.3, 0])
        n2 = M(f"1보다 큰 수를 곱하면\n3보다 {b('커져요')}", 34).next_to(e2, DOWN, buff=0.4)
        self.say(f"1보다 큰 수를 곱하면 {b('커져요')}", "3 곱하기 1과 4분의 1은 3과 3의 4분의 1을 더해 3과 4분의 3. 1보다 큰 수를 곱하면 원래 수보다 커져요.")
        self.play(FadeIn(e2), FadeIn(n2), run_time=0.7)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
