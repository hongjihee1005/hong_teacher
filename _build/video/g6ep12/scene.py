"""「수학 원리 돋보기」 6학년 12화 — (소수) ÷ (자연수) ⑵ 자리에서 나누어떨어지지 않을 때 (6-1 3단원 3차시, 화 코드 6-1-3-b)

4.23은 1이 4개, 0.1이 2개, 0.01이 3개
4 ÷ 3 = 1 … 1, 남은 1을 0.1 10개로 바꾸면 0.1은 12개 → 12 ÷ 3 = 4, 0.01 3개 ÷ 3 = 1 → 4.23 ÷ 3 = 1.41
분수로: 423/100 ÷ 3 = (423 ÷ 3)/100 = 141/100 = 1.41
최종: GRADE=6 ./make_final.sh 12
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, ReplacementTransform,
                   VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from decdiv import DecDiv, blocks, tenth_block
from fraction import frac, row

XS = [-4.3, 0.0, 4.3]
Y = -0.7


class G6Ep12(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 12
    EP_TITLE = "(소수) ÷ (자연수) ⑵"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.model()
        self.vertical()
        self.closing(f"나누어떨어지지 않고 남은 1은 {o('0.1 10개')}로 바꾸어 나누어요\n4.23 ÷ 3 = {g('1.41')}",
                     next_preview="6학년 13화 · 몫이 1보다 작을 때")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("4.23 ÷ 3은 얼마일까요?\n4를 3으로 나누면 1이 남아요. 남은 1은 어떻게 할까요?", 40).move_to([0.6, 1.6, 0])
        self.say("4.23 ÷ 3은?", "4.23 나누기 3을 계산해 볼게요. 4를 3으로 나누면 1이 남아요. 남은 1은 어떻게 할까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def model(self):
        self.section("남은 1을 0.1로 바꾸기")
        bl = blocks(4, 2, 3, s=0.8).move_to([0, 1.8, 0])
        lab = M(f"4.23 = 1이 4개, {o('0.1이 2개')}, {g('0.01이 3개')}", 34).next_to(bl, DOWN, buff=0.25)
        self.say("1이 4개, 0.1이 2개, 0.01이 3개", "4.23은 1이 4개, 0.1이 2개, 0.01이 3개인 수예요.")
        self.play(FadeIn(bl), FadeIn(lab), run_time=0.7)
        ones, tens, hunds = bl
        self.say("1을 셋으로 나누면 1씩, 1이 남아요", "1 4개를 셋으로 나누면 1개씩 주고 1개가 남아요.")
        self.play(FadeOut(lab), *[ones[i].animate.move_to([XS[i] - 1.0, Y, 0]) for i in range(3)], run_time=1.0)
        ten = VGroup(*[tenth_block(0.8) for _ in range(10)]).arrange(RIGHT, buff=0.05).move_to(ones[3].get_center())
        self.say(f"남은 1 = {o('0.1이 10개')}", "남은 1은 0.1이 10개와 같아요. 바꾸면 0.1은 모두 12개예요.")
        self.play(ReplacementTransform(ones[3], ten), run_time=1.0)
        allt = list(ten) + list(tens)
        anims = []
        for k, m in enumerate(allt):
            gi, j = k // 4, k % 4
            anims.append(m.animate.move_to([XS[gi] - 0.35 + j * 0.13, Y, 0]))
        self.say(f"0.1 12개를 셋으로: {o('4개씩')}", "0.1 12개를 셋으로 나누면 4개씩이에요.")
        self.play(*anims, run_time=1.2)
        self.say(f"0.01 3개를 셋으로: {g('1개씩')}", "0.01 3개를 셋으로 나누면 1개씩이에요.")
        self.play(*[hunds[i].animate.move_to([XS[i] + 0.35, Y - 0.35, 0]) for i in range(3)], run_time=0.8)
        labs = VGroup(*[M(f"1 + {o('0.4')} + {g('0.01')} = {g('1.41')}", 30).move_to([XS[i], Y - 0.95, 0]) for i in range(3)])
        self.play(FadeIn(labs), run_time=0.5)
        f = row(frac(423, 100, 42), "÷ 3 =", frac("423 ÷ 3", 100, 42, cn=ORANGE), "=", frac(141, 100, 42), "=", M(g("1.41"), 44), size=42).move_to([0, 1.8, 0])
        self.say("분수로 계산해도 1.41", "분수로 바꾸어 100분의 423 나누기 3을 계산해도 100분의 141, 1.41이에요.")
        self.play(FadeIn(f), run_time=0.7)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def vertical(self):
        self.section("세로셈")
        d = DecDiv(self, "4.23", "3", x_left=-3.0, y0=1.75, F=54, dx=0.6, dy=0.66)
        self.say("세로셈으로 계산해요", "세로셈으로 계산해 볼게요.")
        d.show()
        self.say("4 ÷ 3 = 1, 1이 남아요", "4를 3으로 나누면 몫은 1, 1이 남아요.")
        d.quot(0, "1")
        d.row("3", 0, 1)
        d.line(0, 0, 1)
        d.qdot()
        self.say(f"2를 내려 {o('12')} ÷ 3 = 4", "남은 1과 소수 첫째 자리 2를 함께 보면 0.1이 12개예요. 12 나누기 3은 4.")
        d.row("12", 1, 2, ORANGE)
        d.quot(1, "4")
        d.row("12", 1, 3)
        d.line(0, 1, 3)
        self.say(f"3을 내려 3 ÷ 3 = 1", "0.01이 3개 남았으니 3 나누기 3은 1.")
        d.row("3", 2, 4, ORANGE)
        d.quot(2, "1")
        d.row("3", 2, 5)
        d.line(2, 2, 5)
        d.row("0", 2, 6)
        r = M(f"4.23 ÷ 3 = {g('1.41')}", 48).move_to([3.2, 0.2, 0])
        self.say(f"4.23 ÷ 3 = {g('1.41')}", "4.23 나누기 3은 1.41이에요.")
        self.play(FadeIn(r), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
