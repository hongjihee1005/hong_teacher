"""「수학 원리 돋보기」 4학년 33화 — 분수끼리 뺄 수 없으면? (4-2 1단원 7차시, 화 코드 4-2-1-e)

4 1/3 − 1 2/3: 1/3에서 2/3를 뺄 수 없음 → 4 1/3 = 3 4/3 → 3 4/3 − 1 2/3 = 2 2/3
방법 2: 13/3 − 5/3 = 8/3 = 2 2/3
최종: GRADE=4 ./make_final.sh 33
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, Cross, FadeIn, FadeOut, Indicate, LaggedStart, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, frac_bar, mixed, row

RED = "#C0392B"


class G4Ep33(EpisodeScene):
    GRADE, SEM = 4, 2
    EP_NO = 33
    EP_TITLE = "분수끼리 뺄 수 없으면?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.borrow()
        self.improper()
        self.closing(f"분수끼리 뺄 수 없으면 자연수에서 {o('1')}을 {o('분수로 바꾸어')} 빼요\n또는 두 대분수를 {g('가분수')}로 바꾸어 빼요",
                     next_preview="4학년 34화 · 이등변삼각형과 정삼각형")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        e = row(mixed(4, 1, 3, 72), "−", mixed(1, 2, 3, 72), "= ?", size=72).move_to([0, 1.0, 0])
        self.say("4와 1/3 − 1과 2/3은?", "4와 3분의 1에서 1과 3분의 2를 빼 볼까요?")
        self.play(FadeIn(e), run_time=0.6)
        n = row(frac(1, 3, 52, cn=RED), "에서", frac(2, 3, 52, cn=RED), "를 뺄 수 있을까요?", size=46).move_to([0, -0.8, 0])
        self.say("1/3에서 2/3를 뺄 수 있을까요?", "분수끼리 빼려니 3분의 1에서 3분의 2를 뺄 수가 없어요.")
        self.play(FadeIn(n), run_time=0.6)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def borrow(self):
        self.section("1을 3/3로 바꾸기")
        bars = VGroup(*[frac_bar(3, 3, 2.0, 0.65, BLUE) for _ in range(4)], frac_bar(3, 1, 2.0, 0.65, BLUE)).arrange(RIGHT, buff=0.2).move_to([0, 1.8, 0])
        self.say("4와 1/3을 막대로", "4와 3분의 1을 막대로 나타냈어요.")
        self.play(FadeIn(bars), run_time=0.6)
        l1 = row(mixed(4, 1, 3, 52), "=", mixed(3, 4, 3, 52, cn=ORANGE), size=52).move_to([0, 0.6, 0])
        self.say(f"자연수 4에서 1을 {o('3/3')}로 → {o('3과 4/3')}", "자연수 4에서 1을 3분의 3으로 바꾸어 분수 부분에 보태면, 3과 3분의 4가 돼요.")
        self.play(bars[3].animate.set_fill(ORANGE), bars[4][0].animate.set_fill(ORANGE), FadeIn(l1), run_time=0.9)
        l2 = row(mixed(3, 4, 3, 52), "−", mixed(1, 2, 3, 52), "=", mixed(2, 2, 3, 56, cw=GREEN, cn=GREEN, cd=GREEN), size=52).move_to([0, -0.6, 0])
        self.say(f"이제 분수끼리 뺄 수 있어요 → {g('2와 2/3')}", "이제 자연수끼리 3 빼기 1은 2, 분수끼리 3분의 4 빼기 3분의 2는 3분의 2. 답은 2와 3분의 2예요.")
        self.play(FadeIn(l2), run_time=0.6)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def improper(self):
        self.section("가분수로 바꾸어 빼기")
        l1 = VGroup(row(mixed(4, 1, 3, 56), "=", frac(13, 3, 56, cn=BLUE), size=56), row(mixed(1, 2, 3, 56), "=", frac(5, 3, 56, cn=ORANGE), size=56)).arrange(RIGHT, buff=1.4).move_to([0, 1.3, 0])
        self.say("두 대분수를 가분수로", "두 대분수를 가분수로 바꾸면 3분의 13과 3분의 5예요.")
        self.play(FadeIn(l1), run_time=0.6)
        l2 = row(frac(13, 3, 60), "−", frac(5, 3, 60), "=", frac(8, 3, 60, cn=GREEN), "=", mixed(2, 2, 3, 60, cw=GREEN, cn=GREEN, cd=GREEN), size=60).move_to([0, -0.4, 0])
        self.say(f"13/3 − 5/3 = 8/3 = {g('2와 2/3')}", "3분의 13 빼기 3분의 5는 3분의 8, 2와 3분의 2. 같은 답이에요.")
        self.play(FadeIn(l2), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
