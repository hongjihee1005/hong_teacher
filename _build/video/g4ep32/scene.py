"""「수학 원리 돋보기」 4학년 32화 — (자연수) − (분수) (4-2 1단원 6차시, 화 코드 4-2-1-d)

3 − 1 3/4: 3에서 1을 4/4로 바꾸어 2 4/4 − 1 3/4 = 1 1/4 (받아내림과 같은 원리)
방법 2: 12/4 − 7/4 = 5/4 = 1 1/4
최종: GRADE=4 ./make_final.sh 32
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, Cross, FadeIn, FadeOut, Indicate, LaggedStart, ReplacementTransform,
                   VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, frac_bar, mixed, row

RED = "#C0392B"


class G4Ep32(EpisodeScene):
    GRADE, SEM = 4, 2
    EP_NO = 32
    EP_TITLE = "(자연수) − (분수)"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.break_one()
        self.improper()
        self.closing(f"자연수에서 {o('1만큼')}을 분모와 분자가 같은 분수로 바꾸어 빼요\n또는 모두 {g('가분수')}로 바꾸어 빼요",
                     next_preview="4학년 33화 · 분수끼리 뺄 수 없으면?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M(f"리본 {b('3 m')} 중에서 {o('1과 3/4 m')}를 썼어요. 남은 리본은?", 44)
        q.scale_to_fit_width(min(q.width, 10.4)).move_to([0.6, 2.2, 0])
        e = row("3 −", mixed(1, 3, 4, 70), "= ?", size=70).move_to([0, 0.0, 0])
        self.say("3 − 1과 3/4은?", "리본 3미터 중에서 1과 4분의 3미터를 썼어요. 남은 리본은 몇 미터일까요?")
        self.play(Write(q), FadeIn(e), run_time=1.2)
        self.say("3에는 분수 부분이 없어요", "그런데 3에는 분수 부분이 없어요. 어떻게 빼야 할까요?")
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def break_one(self):
        self.section("1을 4/4로 바꾸기")
        bars = VGroup(*[frac_bar(4, 4, 2.6, 0.7, BLUE) for _ in range(3)]).arrange(RIGHT, buff=0.25).move_to([0, 1.6, 0])
        lab = T("3", 52).next_to(bars, LEFT, buff=0.4)
        self.say("3은 1이 3개", "3은 1이 3개예요.")
        self.play(FadeIn(bars), FadeIn(lab), run_time=0.6)
        l1 = row("3 =", "2 +", frac(4, 4, 48, cn=ORANGE), "=", mixed(2, 4, 4, 52, cn=ORANGE, cd=ORANGE), size=52).move_to([0, 0.3, 0])
        self.say(f"1을 {o('4/4')}로 바꾸면 3 = {o('2와 4/4')}", "그중 1을 4분의 4로 바꾸면 3은 2와 4분의 4가 돼요. 받아내림과 같은 생각이에요.")
        self.play(bars[2].animate.set_fill(ORANGE), FadeIn(l1), run_time=0.8)
        xs = VGroup(Cross(bars[0], stroke_color=RED, stroke_width=6), *[Cross(bars[2][i], stroke_color=RED, stroke_width=5) for i in range(3)])
        self.say("1과 3/4을 덜어 내면", "여기서 1과 4분의 3을 덜어 내면, 1이 1개, 4분의 1이 1개 남아요.")
        self.play(Create(xs), run_time=0.9)
        l2 = row(mixed(2, 4, 4, 52), "−", mixed(1, 3, 4, 52), "=", mixed(1, 1, 4, 56, cw=GREEN, cn=GREEN, cd=GREEN), size=52).move_to([0, -1.1, 0])
        self.say(f"2와 4/4 − 1과 3/4 = {g('1과 1/4')}", "2와 4분의 4 빼기 1과 4분의 3은 1과 4분의 1. 남은 리본은 1과 4분의 1미터예요.")
        self.play(FadeIn(l2), run_time=0.6)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def improper(self):
        self.section("가분수로 바꾸어 빼기")
        l1 = VGroup(row("3 =", frac(12, 4, 56, cn=BLUE), size=56), row(mixed(1, 3, 4, 56), "=", frac(7, 4, 56, cn=ORANGE), size=56)).arrange(RIGHT, buff=1.4).move_to([0, 1.3, 0])
        self.say("둘 다 가분수로", "3을 4분의 12로, 1과 4분의 3을 4분의 7로 바꾸어 볼까요?")
        self.play(FadeIn(l1), run_time=0.6)
        l2 = row(frac(12, 4, 60), "−", frac(7, 4, 60), "=", frac(5, 4, 60, cn=GREEN), "=", mixed(1, 1, 4, 60, cw=GREEN, cn=GREEN, cd=GREEN), size=60).move_to([0, -0.4, 0])
        self.say(f"12/4 − 7/4 = 5/4 = {g('1과 1/4')}", "4분의 12 빼기 4분의 7은 4분의 5, 대분수로 1과 4분의 1. 같은 답이에요.")
        self.play(FadeIn(l2), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
