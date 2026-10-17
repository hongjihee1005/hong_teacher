"""「수학 원리 돋보기」 5학년 48화 — (자연수) × (소수) (5-2 4단원 4·5차시, 화 코드 5-2-4-b)

2 × 0.9: 2의 0.1배는 0.2, 0.9배는 0.2 × 9 = 1.8 (1보다 작은 수를 곱하면 곱이 작아짐)
6 × 1.2 = 6 × 12/10 = 72/10 = 7.2 / 6 × 12 = 72의 1/10배
4 × 1.24 = 4.96 (4 × 124 = 496의 1/100배)
최종: GRADE=5 ./make_final.sh 48
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Arrow, Create, FadeIn, FadeOut, Indicate, LaggedStart, Rectangle, VGroup,
                   Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, row


class G5Ep48(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 48
    EP_TITLE = "(자연수) × (소수)"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.part()
        self.over1()
        self.closing(f"자연수의 곱셈을 한 뒤 곱하는 소수의 자리 수만큼 {o('1/10배, 1/100배')}\n1보다 작은 수를 곱하면 {g('곱이 작아져요')}",
                     next_preview="5학년 49화 · (소수) × (소수)")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("리본 2 m의 0.9배는 몇 m일까요?", 48).move_to([0.6, 1.8, 0])
        self.say("2 × 0.9는?", "리본 2미터의 0.9배는 몇 미터일까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def part(self):
        self.section("2의 0.9배")
        W = 10.0
        whole = VGroup(*[Rectangle(width=W / 10, height=0.6, fill_color=BLUE, fill_opacity=0.25, stroke_color=INK, stroke_width=2) for _ in range(10)]).arrange(RIGHT, buff=0).move_to([0, 1.5, 0])
        lab = T("2 m", 32).next_to(whole, LEFT, buff=0.2)
        self.say("2 m를 10칸으로 나누면 한 칸은 0.2 m", "2미터를 똑같이 10묶음으로 나누면 한 묶음은 0.2미터. 2의 0.1배는 0.2예요.")
        self.play(FadeIn(whole), FadeIn(lab), run_time=0.6)
        groups = whole
        tenth = VGroup(*[T("0.2", 22, SOFT).next_to(x, DOWN, buff=0.08) for x in whole])
        self.play(FadeIn(tenth), run_time=0.4)
        self.play(*[gp.animate.set_fill(ORANGE, 0.8) for gp in groups[:9]], run_time=1.0)
        e = M(f"0.9배는 0.2가 9개 → 0.2 × 9 = {g('1.8')}", 48).move_to([0, 0.1, 0])
        self.say(f"0.9배는 0.2 × 9 = {g('1.8')}", "0.9배는 0.1배가 9개이니 0.2 곱하기 9, 1.8미터예요.")
        self.play(FadeIn(e), run_time=0.6)
        n = M(f"1보다 작은 수를 곱하면 {o('2보다 작아져요')}", 42).move_to([0, -1.2, 0])
        self.say(f"1보다 작은 수를 곱하면 {o('작아져요')}", "0.9는 1보다 작아서, 2에 곱하면 2보다 작은 1.8이 돼요.")
        self.play(FadeIn(n), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def over1(self):
        self.section("1보다 큰 소수를 곱하면")
        a = M("6 × 12 = 72", 60).move_to([-3.0, 1.3, 0])
        b_ = M(f"6 × 1.2 = {g('7.2')}", 60).move_to([-3.0, -0.4, 0])
        ar = Arrow(a.get_bottom(), b_.get_top(), color=ORANGE, buff=0.1)
        l = T("1/10배", 30, ORANGE).next_to(ar, RIGHT, buff=0.1)
        self.say("6 × 1.2는?", "6 곱하기 1.2는 6 곱하기 12, 72의 10분의 1배, 7.2예요. 6보다 커졌어요.")
        self.play(FadeIn(a), Create(ar), FadeIn(l), FadeIn(b_), run_time=1.0)
        c = M("4 × 124 = 496", 60).move_to([3.2, 1.3, 0])
        d = M(f"4 × 1.24 = {g('4.96')}", 60).move_to([3.2, -0.4, 0])
        ar2 = Arrow(c.get_bottom(), d.get_top(), color=BLUE, buff=0.1)
        l2 = T("1/100배", 30, BLUE).next_to(ar2, RIGHT, buff=0.1)
        self.say("4 × 1.24는?", "4 곱하기 1.24는 4 곱하기 124, 496의 100분의 1배, 4.96이에요.")
        self.play(FadeIn(c), Create(ar2), FadeIn(l2), FadeIn(d), run_time=1.0)
        n = M(f"1보다 큰 수를 곱하면 {b('곱이 커져요')}", 42).move_to([0, -1.8, 0])
        self.play(FadeIn(n), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
