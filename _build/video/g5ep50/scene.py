"""「수학 원리 돋보기」 5학년 50화 — 소수 두 자리 × 소수 한 자리 (5-2 4단원 7차시, 화 코드 5-2-4-d)

0.21 × 0.6: 0.21의 0.1배는 0.021 → 0.6배는 0.021 × 6 = 0.126
4.32 × 1.8 = 432/100 × 18/10 = 7776/1000 = 7.776 (432 × 18 = 7776의 1/1000배)
어림으로 확인: 4.32 × 1.8 ≈ 4 × 2 = 8 → 7.776이 알맞음
최종: GRADE=5 ./make_final.sh 50
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Arrow, Create, Cross, FadeIn, FadeOut, Indicate, LaggedStart, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, row

RED = "#C0392B"


class G5Ep50(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 50
    EP_TITLE = "소수 두 자리 × 소수 한 자리"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.small()
        self.big()
        self.estimate()
        self.closing(f"두 수의 소수점 아래 자리 수를 {o('더한 만큼')}\n곱의 소수점 아래 자리 수가 정해져요",
                     next_preview="5학년 51화 · 곱의 소수점은 어디에?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("4.32 × 1.8의 소수점은 어디에 찍을까요?", 46).move_to([0.6, 1.8, 0])
        self.say("4.32 × 1.8은?", "4.32 곱하기 1.8을 계산하면 소수점은 어디에 찍어야 할까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def small(self):
        self.section("0.21 × 0.6")
        a = M(f"0.21의 0.1배 = {o('0.021')}", 52).move_to([0, 1.5, 0])
        b_ = M(f"0.21의 0.6배 = 0.021 × 6 = {g('0.126')}", 52).move_to([0, 0.2, 0])
        self.say(f"0.21의 0.1배는 {o('0.021')}", "0.21의 0.1배는 0.21을 10으로 나눈 것과 같아서 0.021이에요.")
        self.play(FadeIn(a), run_time=0.6)
        self.say(f"0.6배는 0.021이 6개 → {g('0.126')}", "0.6배는 0.1배가 6개이니 0.021 곱하기 6, 0.126이에요.")
        self.play(FadeIn(b_), run_time=0.6)
        n = M(f"소수 두 자리 × 소수 한 자리 → 소수 {o('세 자리')}", 42).move_to([0, -1.2, 0])
        self.play(FadeIn(n), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def big(self):
        self.section("4.32 × 1.8")
        a = M("432 × 18 = 7776", 62).move_to([-3.0, 1.3, 0])
        b_ = M(f"4.32 × 1.8 = {g('7.776')}", 62).move_to([-3.0, -0.4, 0])
        ar = Arrow(a.get_bottom(), b_.get_top(), color=ORANGE, buff=0.1)
        l = T("1/100 × 1/10 = 1/1000배", 26, ORANGE).next_to(ar, RIGHT, buff=0.1)
        self.say("432 × 18 = 7776", "자연수처럼 432 곱하기 18을 하면 7776이에요.")
        self.play(FadeIn(a), run_time=0.5)
        self.say(f"1/100배와 1/10배 → 곱은 {o('1/1000배')}", "4.32는 432의 100분의 1배, 1.8은 18의 10분의 1배이니 곱은 1000분의 1배, 7.776이에요.")
        self.play(Create(ar), FadeIn(l), FadeIn(b_), run_time=0.9)
        f = row(frac(432, 100, 44), "×", frac(18, 10, 44), "=", frac(7776, 1000, 44), "=", M(g("7.776"), 50), size=42).move_to([2.9, -1.7, 0])
        self.play(FadeIn(f), run_time=0.6)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def estimate(self):
        self.section("어림으로 확인")
        e = M(f"4.32 × 1.8  →  약 4 × 2 = {o('8')}", 54).move_to([0, 1.4, 0])
        self.say(f"어림하면 약 {o('8')}", "계산한 뒤 어림으로 확인해 봐요. 4.32는 약 4, 1.8은 약 2이니 곱은 약 8이에요.")
        self.play(FadeIn(e), run_time=0.6)
        opts = VGroup(M("77.76", 54, SOFT), M(g("7.776"), 54), M("0.7776", 54, SOFT)).arrange(RIGHT, buff=1.4).move_to([0, -0.2, 0])
        x1 = Cross(opts[0], stroke_color=RED, stroke_width=5)
        x3 = Cross(opts[2], stroke_color=RED, stroke_width=5)
        self.say(f"8에 가까운 {g('7.776')}이 알맞아요", "77.76이나 0.7776은 8과 너무 달라요. 8에 가까운 7.776이 알맞아요.")
        self.play(FadeIn(opts), run_time=0.6)
        self.play(Create(x1), Create(x3), Indicate(opts[1], color=GREEN), run_time=0.8)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
