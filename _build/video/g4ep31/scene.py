"""「수학 원리 돋보기」 4학년 31화 — 진분수와 대분수의 뺄셈 (4-2 1단원 4·5차시, 화 코드 4-2-1-c)

5/6 − 2/6 = 3/6 (1/6이 5개에서 2개 덜어 냄, 약분은 아직 하지 않음)
2 4/5 − 1 2/5 = 1 2/5 (자연수끼리, 분수끼리 / 가분수 14/5 − 7/5 = 7/5)
최종: GRADE=4 ./make_final.sh 31
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


class G4Ep31(EpisodeScene):
    GRADE, SEM = 4, 2
    EP_NO = 31
    EP_TITLE = "진분수와 대분수의 뺄셈"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.proper()
        self.mixed_sub()
        self.closing(f"분모가 같은 분수의 뺄셈도 {o('분모는 그대로')}, {g('분자끼리')} 빼요\n대분수는 자연수끼리, 분수끼리 빼요",
                     next_preview="4학년 32화 · (자연수) − (분수)")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M(f"피자 {o('5/6')}판 중에서 {b('2/6')}판을 먹었어요. 남은 피자는?", 44)
        q.scale_to_fit_width(min(q.width, 10.4)).move_to([0.6, 2.2, 0])
        e = row(frac(5, 6, 70), "−", frac(2, 6, 70), "= ?", size=70).move_to([0, 0.0, 0])
        self.say("5/6 − 2/6은?", "피자 6분의 5판 중에서 6분의 2판을 먹었어요. 남은 피자는 몇 판일까요?")
        self.play(Write(q), FadeIn(e), run_time=1.2)
        self.wait(1.0)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def proper(self):
        self.section("1/6이 몇 개 남을까?")
        bar = frac_bar(6, 5, width=7.2, height=0.9, color=ORANGE).move_to([0, 1.3, 0])
        lab = frac(5, 6, 44).next_to(bar, LEFT, buff=0.4)
        self.say(f"5/6은 1/6이 {o('5개')}", "6분의 5는 6분의 1이 5개예요.")
        self.play(FadeIn(bar), FadeIn(lab), run_time=0.6)
        xs = VGroup(*[Cross(bar[i], stroke_color=RED, stroke_width=6) for i in (3, 4)])
        self.say(f"{b('2개')}를 덜어 내면 {g('3개')}", "그중 2개를 덜어 내면 6분의 1이 3개 남아요.")
        self.play(Create(xs), bar[3].animate.set_fill(PAPER), bar[4].animate.set_fill(PAPER), run_time=0.9)
        res = row(frac(5, 6, 60), "−", frac(2, 6, 60), "=", frac(3, 6, 60, cn=GREEN), size=60).move_to([0, -0.4, 0])
        self.say(f"분모는 그대로, 5 − 2 = 3 → {g('3/6')}", "분모 6은 그대로 쓰고, 분자끼리 빼면 5 빼기 2는 3, 6분의 3이에요.")
        self.play(FadeIn(res), run_time=0.6)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def mixed_sub(self):
        self.section("대분수의 뺄셈")
        q = row(mixed(2, 4, 5, 64), "−", mixed(1, 2, 5, 64), "= ?", size=60).move_to([0.6, 2.0, 0])
        self.say("2와 4/5 − 1과 2/5는?", "이번에는 2와 5분의 4에서 1과 5분의 2를 빼 볼까요?")
        self.play(FadeIn(q), run_time=0.5)
        l1 = row(b("자연수끼리"), ":", "2 − 1 = 1", size=44).move_to([-2.2, 0.75, 0])
        l2 = row(o("분수끼리"), ":", frac(4, 5, 40), "−", frac(2, 5, 40), "=", frac(2, 5, 40, cn=ORANGE), size=44).move_to([-1.4, -0.35, 0])
        self.say("자연수끼리, 분수끼리 빼요", "자연수끼리 빼면 2 빼기 1은 1, 분수끼리 빼면 5분의 4 빼기 5분의 2는 5분의 2.")
        self.play(FadeIn(l1), run_time=0.5)
        self.play(FadeIn(l2), run_time=0.5)
        r1 = row("→", mixed(1, 2, 5, 56, cw=GREEN, cn=GREEN, cd=GREEN), size=56).move_to([3.6, 0.2, 0])
        self.play(FadeIn(r1), run_time=0.5)
        l3 = row("가분수로:", frac(14, 5, 44), "−", frac(7, 5, 44), "=", frac(7, 5, 44), "=", mixed(1, 2, 5, 44, cw=GREEN, cn=GREEN, cd=GREEN), size=44).move_to([0, -1.55, 0])
        self.say(f"가분수로 바꿔도 {g('1과 2/5')}", "가분수로 바꾸어 5분의 14 빼기 5분의 7을 해도 5분의 7, 1과 5분의 2로 같아요.")
        self.play(FadeIn(l3), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
