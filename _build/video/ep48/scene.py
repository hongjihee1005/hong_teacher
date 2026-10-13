"""「수학 원리 돋보기」 48화 — 단위분수가 모이면? (1학기 6단원 5차시, 화 코드 1-6-b)

분자가 1인 분수 = 단위분수 → 6분의 1이 하나씩 쌓여 6분의 5 → 6개면 전체(1)
최종: ./make_final.sh 48
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, FadeIn, Indicate, Transform, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, frac_bar, row


class Ep48(EpisodeScene):
    EP_NO = 48
    EP_TITLE = "단위분수가 모이면?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.unit()
        self.stack()
        self.closing(f"분자가 1인 분수 → {o('단위분수')}\n단위분수가 분모만큼 모이면 {g('전체(1)')}가 돼요",
                     next_preview="49화 · 어느 분수가 더 클까?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        f = frac(5, 6, 120, cn=ORANGE).move_to([0, 0.2, 0])
        q = M("6분의 5는 무엇이 몇 개 모인 것일까요?", 50).move_to([0, 2.3, 0])
        self.say("6분의 5는 무엇이 몇 개일까요?", "6분의 5는 무엇이 몇 개 모인 것일까요?")
        self.play(FadeIn(f), FadeIn(q), run_time=0.7)
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def unit(self):
        self.section("단위분수")
        fs = VGroup(*[frac(1, d, 80, cn=ORANGE) for d in (2, 3, 4, 5, 6)]).arrange(RIGHT, buff=1.0).move_to([0, 0.8, 0])
        self.say(f"분자가 1인 분수를 {o('단위분수')}라고 해요", "2분의 1, 3분의 1, 4분의 1처럼 분자가 1인 분수를 단위분수라고 해요.")
        self.play(FadeIn(fs), run_time=0.7)
        self.play(*[Indicate(f.num, color=ORANGE, scale_factor=1.5) for f in fs], run_time=0.8)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def stack(self):
        self.section("6분의 1씩 모으기")
        bar = frac_bar(6, 0, width=8.4, height=0.9).move_to([0, 1.3, 0])
        self.play(FadeIn(bar), run_time=0.5)
        lab = row(frac(1, 6, 64, cn=ORANGE), "이 1개 →", frac(1, 6, 64, cn=ORANGE), size=48).move_to([0, -0.4, 0])
        self.say("6분의 1씩 하나씩 색칠해요", "6분의 1을 하나씩 색칠해 볼까요?")
        for k in range(5):
            new = row(frac(1, 6, 64, cn=ORANGE), f"이 {k + 1}개 →", frac(k + 1, 6, 64, cn=ORANGE), size=48).move_to([0, -0.4, 0])
            if k == 0:
                self.play(bar[0].animate.set_fill(ORANGE), FadeIn(new), run_time=0.6)
                lab = new
            else:
                self.play(bar[k].animate.set_fill(ORANGE), Transform(lab, new), run_time=0.6)
            self.wait(0.3)
        self.say(f"6분의 5는 {o('6분의 1이 5개')}", "6분의 5는 6분의 1이 5개 모인 거예요.")
        self.wait(1.0)
        new = row(frac(1, 6, 64, cn=ORANGE), "이 6개 →", frac(6, 6, 64, cn=ORANGE), f"= {g('1')}", size=48).move_to([0, -0.4, 0])
        self.say(f"6개 모이면 {g('전체, 1')}", "6분의 1이 6개 모이면 막대가 꽉 차요. 전체, 곧 1이에요.")
        self.play(bar[5].animate.set_fill(ORANGE), Transform(lab, new), run_time=0.7)
        self.play(Indicate(bar, color=GREEN, scale_factor=1.03), run_time=0.8)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
