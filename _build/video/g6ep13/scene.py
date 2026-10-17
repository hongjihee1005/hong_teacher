"""「수학 원리 돋보기」 6학년 13화 — (소수) ÷ (자연수) ⑶ 몫이 1보다 작을 때 (6-1 3단원 4차시, 화 코드 6-1-3-c)

1.24는 1이 1개, 0.1이 2개, 0.01이 4개. 1을 2로 나눌 수 없으므로 1을 0.1 10개로 → 0.1은 12개, 12 ÷ 2 = 6
0.01 4개 ÷ 2 = 2 → 1.24 ÷ 2 = 0.62
세로셈: 1을 2로 나눌 수 없으므로 몫의 자연수 자리에 0을 쓰고 소수점을 찍음
최종: GRADE=6 ./make_final.sh 13
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

XS = [-3.0, 3.0]
Y = -0.6


class G6Ep13(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 13
    EP_TITLE = "몫이 1보다 작을 때"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.model()
        self.vertical()
        self.closing(f"나누어지는 수의 자연수 부분이 나누는 수보다 작으면\n몫의 자연수 자리에 {o('0')}을 쓰고 소수점을 찍어요",
                     next_preview="6학년 14화 · 소수점 아래 0을 내려 계산")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("1.24 ÷ 2는 얼마일까요?\n1을 2로 나눌 수 없을 때는 어떻게 할까요?", 42).move_to([0.6, 1.6, 0])
        self.say("1.24 ÷ 2는?", "1.24 나누기 2를 계산해 볼게요. 1을 2로 나눌 수 없을 때는 어떻게 할까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def model(self):
        self.section("1을 0.1 10개로")
        bl = blocks(1, 2, 4, s=0.9).move_to([0, 1.8, 0])
        self.say("1이 1개, 0.1이 2개, 0.01이 4개", "1.24는 1이 1개, 0.1이 2개, 0.01이 4개예요.")
        self.play(FadeIn(bl), run_time=0.6)
        ones, tens, hunds = bl
        ten = VGroup(*[tenth_block(0.9) for _ in range(10)]).arrange(RIGHT, buff=0.05).move_to(ones[0].get_center())
        self.say(f"1을 둘로 못 나누니 {o('0.1 10개')}로", "1 하나는 둘로 똑같이 나눌 수 없어요. 그래서 1을 0.1 10개로 바꾸면 0.1은 12개예요.")
        self.play(ReplacementTransform(ones[0], ten), run_time=1.0)
        allt = list(ten) + list(tens)
        self.say(f"0.1 12개를 둘로: {o('6개씩')}", "0.1 12개를 둘로 나누면 6개씩이에요.")
        self.play(*[m.animate.move_to([XS[k // 6] - 0.55 + (k % 6) * 0.15, Y, 0]) for k, m in enumerate(allt)], run_time=1.2)
        self.say(f"0.01 4개를 둘로: {g('2개씩')}", "0.01 4개를 둘로 나누면 2개씩이에요.")
        self.play(*[hunds[k].animate.move_to([XS[k // 2] + 0.55 + (k % 2) * 0.13, Y - 0.38, 0]) for k in range(4)], run_time=0.8)
        labs = VGroup(*[M(f"{o('0.6')} + {g('0.02')} = {g('0.62')}", 34).move_to([x, Y - 1.0, 0]) for x in XS])
        self.say(f"1.24 ÷ 2 = {g('0.62')}", "한 쪽은 0.1이 6개, 0.01이 2개라서 0.62예요. 몫이 1보다 작아요.")
        self.play(FadeIn(labs), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def vertical(self):
        self.section("세로셈")
        d = DecDiv(self, "1.24", "2", x_left=-2.8, y0=1.5)
        self.say("세로셈으로 계산해요", "세로셈으로 계산해 볼게요.")
        d.show()
        z = d.quot(0, "0", ORANGE)
        dot = d.qdot()
        t = M(f"1은 2로 나눌 수 없어서\n몫의 자연수 자리에 {o('0')}", 32).move_to([3.3, 1.6, 0])
        self.say(f"몫의 자연수 자리에 {o('0')}, 그리고 소수점", "1은 2로 나눌 수 없으므로 몫의 자연수 자리에 0을 쓰고, 1.24의 소수점에 맞추어 소수점을 찍어요.")
        self.play(FadeIn(t), Indicate(z, color=ORANGE, scale_factor=1.5), run_time=0.8)
        self.say(f"{o('12')} ÷ 2 = 6", "12 나누기 2는 6.")
        d.quot(1, "6")
        d.row("12", 1, 1)
        d.line(0, 1, 1)
        self.say("4 ÷ 2 = 2", "4를 내려 4 나누기 2는 2.")
        d.row("4", 2, 2, ORANGE)
        d.quot(2, "2")
        d.row("4", 2, 3)
        d.line(2, 2, 3)
        d.row("0", 2, 4)
        r = M(f"1.24 ÷ 2 = {g('0.62')}", 48).move_to([3.3, -0.3, 0])
        self.say(f"1.24 ÷ 2 = {g('0.62')}", "1.24 나누기 2는 0.62예요.")
        self.play(FadeIn(r), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
