"""「수학 원리 돋보기」 6학년 35화 — 분모가 다른 (분수) ÷ (분수) (6-2 1단원 4차시, 화 코드 6-2-1-c)

어제 주운 쓰레기 3/5 kg은 오늘 주운 1/10 kg의 몇 배? → 3/5 = 6/10, 1/10이 6개 → 6배
분모가 다른 (분수) ÷ (분수)는 통분한 다음 분자끼리 나눔: 3/4 ÷ 4/7 = 21/28 ÷ 16/28 = 21 ÷ 16 = 21/16 = 1 5/16
최종: GRADE=6 ./make_final.sh 35
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, frac_bar, mixed, row


class G6Ep35(EpisodeScene):
    GRADE, SEM = 6, 2
    EP_NO = 35
    EP_TITLE = "분모가 다른 (분수) ÷ (분수)"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.split()
        self.general()
        self.closing(f"분모가 다른 (분수) ÷ (분수)는 {o('통분')}한 다음\n{g('분자끼리 나누어요')}",
                     next_preview="6학년 36화 · (자연수) ÷ (분수)")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("어제 주운 쓰레기 3/5 kg은\n오늘 주운 쓰레기 1/10 kg의 몇 배일까요?", 42).move_to([0.6, 1.6, 0])
        self.say("3/5 ÷ 1/10은?", "남극 기지 주변에서 어제 주운 쓰레기 5분의 3 킬로그램은 오늘 주운 10분의 1 킬로그램의 몇 배일까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def split(self):
        self.section("같은 크기로 나누기")
        b5 = frac_bar(5, 3, width=8.0, height=0.85, color=ORANGE).move_to([0.6, 1.7, 0])
        l5 = frac(3, 5, 38).next_to(b5, LEFT, buff=0.3)
        b10 = frac_bar(10, 1, width=8.0, height=0.85, color=BLUE).move_to([0.6, 0.5, 0])
        l10 = frac(1, 10, 38).next_to(b10, LEFT, buff=0.3)
        self.say("분모가 달라서 바로 셀 수 없어요", "5분의 3과 10분의 1은 한 칸의 크기가 달라서 바로 셀 수 없어요.")
        self.play(FadeIn(b5), FadeIn(l5), FadeIn(b10), FadeIn(l10), run_time=0.6)
        fine = frac_bar(10, 6, width=8.0, height=0.85, color=ORANGE).move_to(b5.get_center())
        lf = frac(6, 10, 38, cn=ORANGE).move_to(l5.get_center())
        self.say(f"3/5 = {o('6/10')}", "5분의 3을 분모가 10인 분수로 바꾸면 10분의 6이에요.")
        self.play(FadeOut(b5), FadeIn(fine), FadeOut(l5), FadeIn(lf), run_time=0.9)
        nums = VGroup(*[T(str(k + 1), 26, ORANGE).next_to(fine[k], UP, buff=0.1) for k in range(6)])
        self.play(LaggedStart(*[FadeIn(n) for n in nums], lag_ratio=0.12, run_time=0.8))
        e = row(frac(3, 5, 50), "÷", frac(1, 10, 50), "=", frac(6, 10, 50), "÷", frac(1, 10, 50), "=", "6 ÷ 1", "=", M(g("6"), 54), size=50)
        e.scale_to_fit_width(min(e.width, 12.4)).move_to([0, -1.0, 0])
        self.say(f"1/10이 6개 → {g('6배')}", "10분의 6은 10분의 1이 6개이니 6배예요.")
        self.play(FadeIn(e), run_time=0.7)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def general(self):
        self.section("통분하고 분자끼리")
        e1 = row(frac(3, 4, 56), "÷", frac(4, 7, 56), "=", frac(21, 28, 56, cd=ORANGE), "÷", frac(16, 28, 56, cd=ORANGE), size=54).move_to([0, 1.5, 0])
        self.say(f"분모를 {o('28')}로 통분", "4분의 3 나누기 7분의 4는 분모를 28로 통분해요. 28분의 21 나누기 28분의 16이에요.")
        self.play(FadeIn(e1), run_time=0.7)
        e2 = row("=", "21 ÷ 16", "=", frac(21, 16, 56, cn=GREEN, cd=GREEN), "=", mixed(1, 5, 16, 56, cw=GREEN, cn=GREEN, cd=GREEN), size=54).move_to([0.6, -0.2, 0])
        self.say(f"분자끼리 21 ÷ 16 = {g('21/16')}", "분모가 같아졌으니 분자끼리 나누면 21 나누기 16, 16분의 21, 1과 16분의 5예요.")
        self.play(FadeIn(e2), run_time=0.7)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
