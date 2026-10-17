"""「수학 원리 돋보기」 6학년 5화 — (대분수) ÷ (자연수) (6-1 1단원 6차시, 화 코드 6-1-1-e)

철망 4 1/2 km로 유도울타리 4개를 똑같이
방법 1: 자연수 부분과 진분수 부분으로 나누어 (4 ÷ 4) + (1/2 ÷ 4) = 1 + 1/8 = 1 1/8
방법 2: 가분수로 바꾸어 9/2 ÷ 4 = 36/8 ÷ 4 = 9/8 = 1 1/8 (또는 9/2 × 1/4)
최종: GRADE=6 ./make_final.sh 5
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, Rectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, mixed, row

PURPLE = "#7A4FB5"
COLS = [ORANGE, BLUE, GREEN, PURPLE]


class G6Ep05(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 5
    EP_TITLE = "(대분수) ÷ (자연수)"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.way1()
        self.way2()
        self.closing(f"(대분수) ÷ (자연수)는 {o('자연수 부분과 진분수 부분')}으로 나누거나\n{b('가분수')}로 바꾸어 계산해요",
                     next_preview="6학년 6화 · 각기둥이란?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("철망 4와 1/2 km로 유도울타리 4개를 똑같이 만들면\n한 개에 몇 km를 쓸까요?", 42).move_to([0.6, 1.6, 0])
        self.say("4와 1/2 ÷ 4는?", "철망 4와 2분의 1 킬로미터로 유도울타리 4개를 똑같이 만들려고 해요. 울타리 한 개에 철망을 몇 킬로미터 쓸까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def way1(self):
        self.section("방법 1 · 자연수와 분수로 나누어")
        U = 2.4
        wholes = VGroup(*[Rectangle(width=U, height=0.7, fill_color=PAPER, fill_opacity=1, stroke_color=INK, stroke_width=3) for _ in range(4)]).arrange(RIGHT, buff=0)
        half = VGroup(*[Rectangle(width=U / 8, height=0.7, fill_color=PAPER, fill_opacity=1, stroke_color=INK, stroke_width=3) for _ in range(4)]).arrange(RIGHT, buff=0)
        allg = VGroup(wholes, half).arrange(RIGHT, buff=0).move_to([0, 1.7, 0])
        tick = VGroup(*[T(str(k), 22, SOFT).next_to(wholes[k - 1].get_corner(DOWN + RIGHT), DOWN, buff=0.1) for k in range(1, 5)])
        self.say("4 km와 1/2 km", "철망 4 킬로미터와 2분의 1 킬로미터가 있어요.")
        self.play(FadeIn(allg), FadeIn(tick), run_time=0.7)
        self.say(f"4 km를 4로 나누면 {o('1 km')}씩", "먼저 자연수 부분 4 킬로미터를 4로 나누면 1 킬로미터씩이에요.")
        self.play(*[wholes[i].animate.set_fill(COLS[i], opacity=0.8) for i in range(4)], run_time=0.7)
        self.say(f"1/2 km를 4로 나누면 {o('1/8 km')}씩", "남은 2분의 1 킬로미터를 4로 나누면 8분의 1 킬로미터씩이에요.")
        self.play(*[half[i].animate.set_fill(COLS[i], opacity=0.8) for i in range(4)], run_time=0.7)
        e = row("(4 ÷ 4)", "+", "(", frac(1, 2, 44), "÷ 4 )", "=", "1", "+", frac(1, 8, 44), "=", mixed(1, 1, 8, 46, cw=GREEN, cn=GREEN, cd=GREEN), size=44)
        e.scale_to_fit_width(min(e.width, 12.4)).move_to([0, -0.3, 0])
        self.say(f"한 개에 {g('1과 1/8 km')}", "울타리 한 개에 1과 8분의 1 킬로미터를 써요.")
        self.play(FadeIn(e), run_time=0.8)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def way2(self):
        self.section("방법 2 · 가분수로 바꾸어")
        e1 = row(mixed(4, 1, 2, 54), "÷ 4", "=", frac(9, 2, 54, cn=BLUE), "÷ 4", size=52).move_to([0, 1.9, 0])
        self.say(f"가분수로 바꾸면 {b('9/2')}", "4와 2분의 1을 가분수로 바꾸면 2분의 9예요.")
        self.play(FadeIn(e1), run_time=0.7)
        e2 = row("=", frac(36, 8, 54), "÷ 4", "=", frac("36 ÷ 4", 8, 54, cn=ORANGE), "=", frac(9, 8, 54, cn=GREEN), size=52).move_to([0, 0.4, 0])
        self.say(f"분자가 4의 배수가 되게 {o('36/8')}", "분자 9는 4로 나누어떨어지지 않으니 크기가 같은 분수 8분의 36으로 바꾸어 분자를 4로 나눠요.")
        self.play(FadeIn(e2), run_time=0.8)
        e3 = row("=", frac(9, 2, 54), "×", frac(1, 4, 54, cn=ORANGE), "=", frac(9, 8, 54, cn=GREEN), "=", mixed(1, 1, 8, 54, cw=GREEN, cn=GREEN, cd=GREEN), size=52).move_to([0, -1.2, 0])
        self.say(f"곱셈으로 해도 {g('1과 1/8')}", "분수의 곱셈으로 나타내어 2분의 9 곱하기 4분의 1로 계산해도 8분의 9, 1과 8분의 1이에요. 두 방법의 답이 같아요.")
        self.play(FadeIn(e3), run_time=0.8)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
