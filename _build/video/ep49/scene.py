"""「수학 원리 돋보기」 49화 — 어느 분수가 더 클까? (1학기 6단원 6·7차시, 화 코드 1-6-c)

분모가 같으면 분자가 큰 쪽(7/8 > 5/8) → 단위분수는 분모가 작을수록 큼(1/2 > 1/4): 많이 나눌수록 조각이 작아짐
최종: ./make_final.sh 49
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, FadeIn, Indicate, Transform, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, frac_bar, row


class Ep49(EpisodeScene):
    EP_NO = 49
    EP_TITLE = "어느 분수가 더 클까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.same_den()
        self.unit_cmp()
        self.closing(f"분모가 같으면 {o('분자가 클수록')} 커요\n단위분수는 {b('분모가 작을수록')} 커요",
                     next_preview="50화 · 0.1은 어떤 수일까?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        a = frac(1, 2, 110, cn=ORANGE).move_to([-2.0, 0.3, 0])
        c = frac(1, 4, 110, cn=ORANGE).move_to([2.0, 0.3, 0])
        q = M("4가 2보다 크니까 4분의 1이 더 클까요?", 50).move_to([0, 2.3, 0])
        self.say("2분의 1과 4분의 1, 어느 쪽이 클까요?", "2분의 1과 4분의 1 중 어느 쪽이 더 클까요? 4가 2보다 크니까 4분의 1이 더 클까요?")
        self.play(FadeIn(a), FadeIn(c), FadeIn(q), run_time=0.8)
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def same_den(self):
        self.section("분모가 같으면")
        b1 = frac_bar(8, 7, width=8.0, height=0.7).move_to([0.8, 1.4, 0])
        b2 = frac_bar(8, 5, width=8.0, height=0.7, color=BLUE).move_to([0.8, 0.3, 0])
        l1 = frac(7, 8, 48, cn=ORANGE).next_to(b1, LEFT, buff=0.4)
        l2 = frac(5, 8, 48, cn=BLUE).next_to(b2, LEFT, buff=0.4)
        self.say("8분의 7과 8분의 5", "먼저 분모가 같은 8분의 7과 8분의 5를 견주어 볼게요.")
        self.play(FadeIn(b1), FadeIn(b2), FadeIn(l1), FadeIn(l2), run_time=0.7)
        r = row(frac(7, 8, 56, cn=ORANGE), "&gt;", frac(5, 8, 56, cn=BLUE), size=60).move_to([0, -1.3, 0])
        self.say(f"8분의 1이 7개 > 5개", "8분의 7은 8분의 1이 7개, 8분의 5는 5개. 분자가 큰 8분의 7이 더 커요.")
        self.play(FadeIn(r), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def unit_cmp(self):
        self.section("단위분수 비교")
        bars = VGroup()
        labels = VGroup()
        for k, d in enumerate((2, 3, 4, 6)):
            bar = frac_bar(d, 1, width=8.0, height=0.5).move_to([0.8, 2.15 - k * 0.95, 0])
            bars.add(bar)
            labels.add(frac(1, d, 30, cn=ORANGE).next_to(bar, LEFT, buff=0.4))
        self.say("같은 막대를 2, 3, 4, 6조각으로 나누면?", "같은 길이의 막대를 2조각, 3조각, 4조각, 6조각으로 똑같이 나누어 볼까요?")
        for bar, lab in zip(bars, labels):
            self.play(FadeIn(bar), FadeIn(lab), run_time=0.5)
        self.say(f"많이 나눌수록 한 조각이 {b('작아져요')}", "더 많은 조각으로 나눌수록 한 조각의 크기는 작아져요.")
        self.play(*[Indicate(bar[0], color=ORANGE) for bar in bars], run_time=0.9)
        r = row(frac(1, 2, 56, cn=ORANGE), "&gt;", frac(1, 3, 56, cn=ORANGE), "&gt;", frac(1, 4, 56, cn=ORANGE), "&gt;", frac(1, 6, 56, cn=ORANGE), size=56)
        r.move_to([0, -2.0, 0])
        self.say(f"단위분수는 {b('분모가 작을수록')} 커요", "그래서 단위분수는 분모가 작을수록 더 커요. 2분의 1이 4분의 1보다 커요.")
        self.play(FadeIn(r), run_time=0.6)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
