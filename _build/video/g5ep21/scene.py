"""「수학 원리 돋보기」 5학년 21화 — 분모가 다른 대분수의 뺄셈 (5-1 5단원 6·7차시, 화 코드 5-1-5-d)

3 5/6 − 1 2/3 = 3 5/6 − 1 4/6 = 2 1/6 (분수끼리 뺄 수 있을 때)
4 1/2 − 1 2/3 = 4 3/6 − 1 4/6: 3/6에서 4/6을 뺄 수 없음 → 자연수 1을 6/6으로 풀어 3 9/6 − 1 4/6 = 2 5/6
가분수로: 27/6 − 10/6 = 17/6 = 2 5/6
최종: GRADE=5 ./make_final.sh 21
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


class G5Ep21(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 21
    EP_TITLE = "분모가 다른 대분수의 뺄셈"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.easy()
        self.borrow()
        self.improper()
        self.closing(f"분수끼리 뺄 수 없으면 자연수의 {o('1을 분수로')} 풀어 내려요\n가분수로 바꾸어 빼도 {g('같은 답')}",
                     next_preview="5학년 22화 · 다각형의 둘레")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("리본 4 1/2 m 중에서 1 2/3 m를 썼어요.\n남은 리본은 몇 m일까요?", 44).move_to([0.6, 1.6, 0])
        self.say("4와 1/2 빼기 1과 2/3", "리본 4와 2분의 1미터 중에서 1과 3분의 2미터를 썼어요. 남은 리본은 몇 미터일까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def easy(self):
        self.section("분수끼리 뺄 수 있을 때")
        e = row(mixed(3, 5, 6, 56), "−", mixed(1, 2, 3, 56), "=", mixed(3, 5, 6, 56), "−", mixed(1, 4, 6, 56, cn=BLUE, cd=BLUE), size=52).move_to([0, 1.6, 0])
        self.say("먼저 쉬운 경우: 3과 5/6 − 1과 2/3", "먼저 3과 6분의 5 빼기 1과 3분의 2를 볼게요. 통분하면 1과 3분의 2는 1과 6분의 4예요.")
        self.play(FadeIn(e), run_time=0.8)
        r = row("=", T("2", 64, BLUE), "+", frac(1, 6, 56, cn=ORANGE, cd=ORANGE), "=", mixed(2, 1, 6, 62, cw=GREEN, cn=GREEN, cd=GREEN), size=54).move_to([0, 0.0, 0])
        self.say(f"자연수끼리 2, 분수끼리 1/6 → {g('2와 1/6')}", "자연수끼리 빼면 2, 분수끼리 빼면 6분의 1. 2와 6분의 1이에요.")
        self.play(FadeIn(r), run_time=0.6)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def borrow(self):
        self.section("분수끼리 뺄 수 없을 때")
        e = row(mixed(4, 1, 2, 56), "−", mixed(1, 2, 3, 56), "=", mixed(4, 3, 6, 56), "−", mixed(1, 4, 6, 56), size=52).move_to([0, 2.1, 0])
        self.say("통분하면 4와 3/6 − 1과 4/6", "이제 처음 문제예요. 통분하면 4와 6분의 3 빼기 1과 6분의 4.")
        self.play(FadeIn(e), run_time=0.8)
        x = Cross(VGroup(e[4].frac, e[6].frac), stroke_color=RED, stroke_width=5).scale(0.9)
        self.say(f"3/6에서 4/6을 {o('뺄 수 없어요')}", "분수끼리 빼려니 6분의 3에서 6분의 4를 뺄 수 없어요.")
        self.play(Create(x), run_time=0.5)
        self.play(FadeOut(x), run_time=0.3)
        W = 1.9
        wholes = VGroup(*[frac_bar(6, 6, width=W, height=0.5, color=ORANGE) for _ in range(4)])
        part = frac_bar(6, 3, width=W, height=0.5, color=ORANGE)
        bars = VGroup(*wholes, part).arrange(RIGHT, buff=0.18).move_to([0, 0.75, 0])
        self.say("4와 3/6을 막대로", "4와 6분의 3을 막대로 나타내면 꽉 찬 막대 4개와 3칸이에요.")
        self.play(FadeIn(bars), run_time=0.6)
        self.say(f"자연수 {o('1')}을 6/6으로 풀어요", "자연수 하나를 6분의 6으로 풀어 분수 부분에 보태면, 3과 6분의 9가 돼요.")
        self.play(Indicate(wholes[3], color=BLUE, scale_factor=1.15), run_time=0.8)
        self.play(wholes[3].animate.set_fill(BLUE, 1), run_time=0.5)
        r1 = row("=", mixed(3, 9, 6, 54, cn=BLUE, cd=BLUE), "−", mixed(1, 4, 6, 54), size=50).move_to([-3.0, -0.75, 0])
        self.play(FadeIn(r1), run_time=0.6)
        r2 = row("=", T("2", 62, INK), "+", frac(5, 6, 54), "=", mixed(2, 5, 6, 58, cw=GREEN, cn=GREEN, cd=GREEN), size=50).move_to([3.0, -0.75, 0])
        self.say(f"이제 뺄 수 있어요 → {g('2와 5/6')}", "이제 자연수끼리 2, 분수끼리 6분의 9 빼기 6분의 4는 6분의 5. 남은 리본은 2와 6분의 5미터예요.")
        self.play(FadeIn(r2), run_time=0.6)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def improper(self):
        self.section("가분수로 바꾸어 빼기")
        e = row(mixed(4, 3, 6, 56), "−", mixed(1, 4, 6, 56), "=", frac(27, 6, 56, cn=BLUE), "−", frac(10, 6, 56, cn=BLUE), "=", frac(17, 6, 56, cn=GREEN), "=", mixed(2, 5, 6, 56, cw=GREEN, cn=GREEN, cd=GREEN), size=50)
        e.scale_to_fit_width(min(e.width, 12.0)).move_to([0, 0.8, 0])
        self.say("가분수로 바꾸면", "대분수를 가분수로 바꾸어 빼도 돼요. 6분의 27 빼기 6분의 10은 6분의 17, 2와 6분의 5. 답이 같아요.")
        self.play(FadeIn(e), run_time=1.0)
        n = M(f"가분수로 하면 {o('받아내림')}을 생각하지 않아도 돼요", 40).move_to([0, -1.2, 0])
        self.say(f"가분수는 {o('받아내림')} 없이", "가분수로 바꾸면 자연수에서 1을 풀어 내리지 않아도 바로 뺄 수 있어요.")
        self.play(FadeIn(n), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
