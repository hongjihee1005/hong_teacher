"""「수학 원리 돋보기」 5학년 36화 — (진분수) × (자연수) (5-2 2단원 2차시, 화 코드 5-2-2-a)

3/5 × 2 = 3/5 + 3/5 = (3 × 2)/5 = 6/5 = 1 1/5 (분모는 그대로, 분자에 자연수를 곱함)
5/6 × 4: 분자끼리 곱한 뒤 약분 20/6 = 10/3, 또는 분모 6과 자연수 4를 먼저 약분 5/3 × 2 = 10/3 = 3 1/3
최종: GRADE=5 ./make_final.sh 36
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, Cross, FadeIn, FadeOut, Indicate, LaggedStart, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, frac_bar, mixed, row

RED = "#C0392B"


class G5Ep36(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 36
    EP_TITLE = "(진분수) × (자연수)"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.add_view()
        self.cancel()
        self.closing(f"(진분수) × (자연수)는 {o('분모는 그대로')}\n{g('분자에 자연수를 곱해요')}",
                     next_preview="5학년 37화 · (대분수) × (자연수)")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("한 사람이 피자를 3/5판씩 먹었어요.\n2명이 먹은 피자는 모두 몇 판일까요?", 44).move_to([0.6, 1.6, 0])
        self.say("3/5 × 2는?", "한 사람이 피자를 5분의 3판씩 먹었어요. 2명이 먹은 피자는 모두 몇 판일까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def add_view(self):
        self.section("같은 분수를 여러 번 더하기")
        W = 5.0
        b1 = frac_bar(5, 3, width=W, color=ORANGE).move_to([-1.6, 1.6, 0])
        b2 = frac_bar(5, 3, width=W, color=BLUE).move_to([-1.6, 0.6, 0])
        l1 = frac(3, 5, 36).next_to(b1, LEFT, buff=0.3)
        l2 = frac(3, 5, 36).next_to(b2, LEFT, buff=0.3)
        self.say("3/5를 2번 더해요", "5분의 3의 2배는 5분의 3을 두 번 더한 것과 같아요.")
        self.play(FadeIn(b1), FadeIn(l1), FadeIn(b2), FadeIn(l2), run_time=0.7)
        e = row(frac(3, 5, 52), "×", "2", "=", frac(3, 5, 52), "+", frac(3, 5, 52), "=", frac("3 × 2", 5, 52, cn=ORANGE), "=", frac(6, 5, 52, cn=GREEN), size=50)
        e.scale_to_fit_width(min(e.width, 12.4)).move_to([0, -0.8, 0])
        self.say(f"분모는 그대로, 분자에 {o('2를 곱해요')}", "1/5이 3개씩 2번이니 1/5이 3 곱하기 2, 6개예요. 분모는 그대로 두고 분자에 자연수를 곱해요.")
        self.play(FadeIn(e), run_time=0.9)
        r = row("=", mixed(1, 1, 5, 52, cw=GREEN, cn=GREEN, cd=GREEN), "판", size=48).move_to([3.6, 1.1, 0])
        self.say(f"6/5 = {g('1과 1/5판')}", "5분의 6, 대분수로 1과 5분의 1판이에요.")
        self.play(FadeIn(r), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def cancel(self):
        self.section("약분은 언제 해도 돼요")
        e1 = row(frac(5, 6, 54), "×", "4", "=", frac("5 × 4", 6, 54), "=", frac(20, 6, 54), "=", frac(10, 3, 54, cn=GREEN), size=50).move_to([0, 1.75, 0])
        self.say("5/6 × 4는?", "6분의 5 곱하기 4를 계산해 볼게요. 분자에 4를 곱하면 6분의 20, 약분하면 3분의 10이에요.")
        self.play(FadeIn(e1), run_time=0.8)
        f = frac(5, 6, 54)
        e2 = row(f, "×", "4", "=", frac(5, 3, 54), "×", "2", "=", frac(10, 3, 54, cn=GREEN), size=50).move_to([0, -0.15, 0])
        self.say(f"분모 6과 자연수 4를 {o('먼저 약분')}해도 돼요", "곱하기 전에 분모 6과 자연수 4를 2로 먼저 약분해도 돼요. 3분의 5 곱하기 2, 똑같이 3분의 10이에요. 수가 작아서 계산이 쉬워요.")
        self.play(FadeIn(e2), run_time=0.8)
        sl1 = Cross(e2[0].den, stroke_color=ORANGE, stroke_width=4).scale(0.7)
        sl2 = Cross(e2[2], stroke_color=ORANGE, stroke_width=4).scale(0.7)
        n1 = T("3", 30, ORANGE).next_to(e2[0].den, DOWN, buff=0.05)
        n2 = T("2", 30, ORANGE).next_to(e2[2], DOWN, buff=0.1)
        self.play(Create(sl1), Create(sl2), FadeIn(n1), FadeIn(n2), run_time=0.6)
        r = row("=", mixed(3, 1, 3, 54, cw=GREEN, cn=GREEN, cd=GREEN), size=50).move_to([0, -1.95, 0])
        self.say(f"= {g('3과 1/3')}", "대분수로 나타내면 3과 3분의 1이에요.")
        self.play(FadeIn(r), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
