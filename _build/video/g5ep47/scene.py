"""「수학 원리 돋보기」 5학년 47화 — (소수) × (자연수) (5-2 4단원 2·3차시, 화 코드 5-2-4-a)

0.3 × 4: 0.1이 3 × 4 = 12개 → 1.2 / 1.4 × 6 = 14/10 × 6 = 84/10 = 8.4 (14 × 6 = 84의 1/10배)
3.14 × 3 = 314 × 3 = 942의 1/100배 → 9.42
최종: GRADE=5 ./make_final.sh 47
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Arrow, Create, FadeIn, FadeOut, Indicate, LaggedStart, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from decimal4 import grid100
from fraction import frac, row


class G5Ep47(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 47
    EP_TITLE = "(소수) × (자연수)"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.tenths()
        self.natural()
        self.two_place()
        self.closing(f"자연수의 곱셈을 하고 곱해지는 수의 소수점 아래 자리 수만큼\n{o('1/10배, 1/100배')} 하면 돼요",
                     next_preview="5학년 48화 · (자연수) × (소수)")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("물 0.3 L씩 4컵이면 모두 몇 L일까요?", 48).move_to([0.6, 1.8, 0])
        self.say("0.3 × 4는?", "컵에 물을 0.3리터씩 담았어요. 4컵이면 모두 몇 리터일까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def tenths(self):
        self.section("0.1이 몇 개?")
        grids = VGroup()
        for k in range(4):
            gr = grid100(30, 1.9, color=[ORANGE, BLUE, GREEN, "#7A4FB5"][k])
            grids.add(gr)
        grids.arrange(RIGHT, buff=0.35).move_to([0, 0.9, 0])
        self.say("0.3을 4번 더해요", "0.3은 0.1이 3개예요. 0.3을 4번 더하면 0.1이 몇 개일까요?")
        self.play(LaggedStart(*[FadeIn(gr) for gr in grids], lag_ratio=0.25, run_time=1.4))
        e = M(f"0.1이 3 × 4 = {o('12개')} → {g('1.2')}", 50).move_to([0, -1.2, 0])
        self.say(f"0.1이 12개 → {g('1.2')}", "0.1이 3 곱하기 4, 12개예요. 0.1이 12개면 1.2. 모두 1.2리터예요.")
        self.play(FadeIn(e), run_time=0.6)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def natural(self):
        self.section("자연수의 곱셈 이용하기")
        a = M("14 × 6 = 84", 64).move_to([-2.8, 1.2, 0])
        b_ = M(f"1.4 × 6 = {g('8.4')}", 64).move_to([-2.8, -0.6, 0])
        ar1 = Arrow(a.get_bottom() + LEFT * 1.6, b_.get_top() + LEFT * 1.6, color=ORANGE, buff=0.1)
        ar2 = Arrow(a.get_bottom() + RIGHT * 1.6, b_.get_top() + RIGHT * 1.6, color=ORANGE, buff=0.1)
        l1 = T("1/10배", 30, ORANGE).next_to(ar1, LEFT, buff=0.1)
        l2 = T("1/10배", 30, ORANGE).next_to(ar2, RIGHT, buff=0.1)
        self.say("1.4 × 6은?", "1.4 곱하기 6을 계산해 볼까요? 먼저 자연수 14 곱하기 6은 84예요.")
        self.play(FadeIn(a), run_time=0.5)
        self.say(f"곱해지는 수가 1/10배면 곱도 {o('1/10배')}", "1.4는 14의 10분의 1배예요. 곱해지는 수가 10분의 1배가 되면 곱도 10분의 1배가 되니 84의 10분의 1배, 8.4예요.")
        self.play(Create(ar1), FadeIn(l1), FadeIn(b_), Create(ar2), FadeIn(l2), run_time=0.9)
        f = row(frac(14, 10, 50), "× 6 =", frac("14 × 6", 10, 50), "=", frac(84, 10, 50), "=", M(g("8.4"), 56), size=48).move_to([3.0, 0.3, 0])
        f.scale_to_fit_width(min(f.width, 6.0))
        self.say("분수의 곱셈으로도 확인", "분수의 곱셈으로 나타내도 10분의 14 곱하기 6은 10분의 84, 8.4예요.")
        self.play(FadeIn(f), run_time=0.7)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def two_place(self):
        self.section("소수 두 자리 수")
        a = M("314 × 3 = 942", 64).move_to([0, 1.3, 0])
        b_ = M(f"3.14 × 3 = {g('9.42')}", 64).move_to([0, -0.5, 0])
        ar = Arrow(a.get_bottom(), b_.get_top(), color=BLUE, buff=0.1)
        l = T("1/100배", 32, BLUE).next_to(ar, RIGHT, buff=0.15)
        self.say("3.14 × 3은?", "3.14 곱하기 3은 어떨까요? 314 곱하기 3은 942예요.")
        self.play(FadeIn(a), run_time=0.5)
        self.say(f"3.14는 314의 1/100배 → {g('9.42')}", "3.14는 314의 100분의 1배이니 곱도 942의 100분의 1배, 9.42예요.")
        self.play(Create(ar), FadeIn(l), FadeIn(b_), run_time=0.8)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
