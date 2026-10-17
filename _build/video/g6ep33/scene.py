"""「수학 원리 돋보기」 6학년 33화 — 분모가 같은 (분수) ÷ (분수) ⑴ (6-2 1단원 2차시, 화 코드 6-2-1-a)

7/10 ÷ 1/10은 7/10에서 1/10을 몇 번 덜어 낼 수 있는지와 같음 → 7/10은 1/10이 7개 → 7
4/9 ÷ 2/9: 4/9는 1/9이 4개, 2/9는 1/9이 2개 → 4 ÷ 2 = 2 / 분모가 같은 (분수) ÷ (분수)는 분자끼리 나눔
최종: GRADE=6 ./make_final.sh 33
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Brace, Create, FadeIn, FadeOut, Indicate, LaggedStart, SurroundingRectangle,
                   VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, frac_bar, row

COLS = [ORANGE, BLUE, GREEN, "#7A4FB5"]


class G6Ep33(EpisodeScene):
    GRADE, SEM = 6, 2
    EP_NO = 33
    EP_TITLE = "분모가 같은 (분수) ÷ (분수)"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.take_out()
        self.group()
        self.closing(f"(분수) ÷ (분수)는 나누는 분수를 {o('몇 번 덜어 낼 수 있는지')}\n분모가 같으면 {g('분자끼리 나누어요')}",
                     next_preview="6학년 34화 · 분자끼리 나누어떨어지지 않을 때")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("빙하 조각 7/10 kg을 1/10 kg씩 상자에 담으면\n상자 몇 개에 담을 수 있을까요?", 42).move_to([0.6, 1.6, 0])
        self.say("7/10 ÷ 1/10은?", "남극 과학 기지에서 빙하 조각 10분의 7 킬로그램을 10분의 1 킬로그램씩 상자에 담으려고 해요. 상자 몇 개에 담을 수 있을까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def take_out(self):
        self.section("덜어 내기")
        bar = frac_bar(10, 7, width=8.0, height=0.9, color=BLUE).move_to([0.5, 1.6, 0])
        lab = frac(7, 10, 40).next_to(bar, LEFT, buff=0.3)
        self.play(FadeIn(bar), FadeIn(lab), run_time=0.5)
        self.say(f"1/10씩 덜어 내면 {o('7번')}", "10분의 7에서 10분의 1을 몇 번 덜어 낼 수 있을까요? 하나씩 덜어 내 볼게요.")
        nums = VGroup()
        for k in range(7):
            n = T(str(k + 1), 30, ORANGE).next_to(bar[k], DOWN, buff=0.15)
            nums.add(n)
            self.play(bar[k].animate.set_fill(ORANGE, 1), FadeIn(n), run_time=0.22)
        e = row(frac(7, 10, 52), "÷", frac(1, 10, 52), "=", M(g("7"), 56), size=52).move_to([0, -0.8, 0])
        self.say(f"7/10 ÷ 1/10 = {g('7')}", "7번 덜어 낼 수 있어요. 10분의 7은 10분의 1이 7개이기 때문이에요. 10분의 7 나누기 10분의 1은 7이에요.")
        self.play(FadeIn(e), run_time=0.6)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def group(self):
        self.section("분자끼리 나누기")
        bar = frac_bar(9, 4, width=8.1, height=0.9, color=BLUE).move_to([0.5, 1.6, 0])
        lab = frac(4, 9, 40).next_to(bar, LEFT, buff=0.3)
        self.say(f"4/9 ÷ 2/9는?", "이번에는 9분의 4 나누기 9분의 2예요. 9분의 4는 9분의 1이 4개, 9분의 2는 9분의 1이 2개예요.")
        self.play(FadeIn(bar), FadeIn(lab), run_time=0.5)
        g1 = SurroundingRectangle(VGroup(bar[0], bar[1]), color=ORANGE, buff=0.05, stroke_width=6)
        g2 = SurroundingRectangle(VGroup(bar[2], bar[3]), color=GREEN, buff=0.05, stroke_width=6)
        self.say(f"2개씩 묶으면 {o('2묶음')}", "9분의 1 4개를 2개씩 묶으면 2묶음이에요.")
        self.play(Create(g1), run_time=0.4)
        self.play(Create(g2), run_time=0.4)
        e = row(frac(4, 9, 52), "÷", frac(2, 9, 52), "=", "4 ÷ 2", "=", M(g("2"), 56), size=52).move_to([0, -0.4, 0])
        self.say(f"분자끼리 4 ÷ 2 = {g('2')}", "그래서 9분의 4 나누기 9분의 2는 분자끼리 나눈 4 나누기 2, 2예요.")
        self.play(FadeIn(e), run_time=0.6)
        r = M(f"분모가 같으면 {g('분자끼리 나누어요')}", 40).move_to([0, -1.6, 0])
        self.play(FadeIn(r), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
