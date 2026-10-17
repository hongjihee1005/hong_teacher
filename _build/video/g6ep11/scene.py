"""「수학 원리 돋보기」 6학년 11화 — (소수) ÷ (자연수) ⑴ 자리마다 나누어떨어질 때 (6-1 3단원 2차시, 화 코드 6-1-3-a)

6.2는 1이 6개, 0.1이 2개 → 6 ÷ 2 = 3, 0.1의 개수 2 ÷ 2 = 1 → 6.2 ÷ 2 = 3.1
세로셈: 자연수 부분을 나눈 몫을 쓰고, 나누어지는 수의 소수점에 맞추어 몫의 소수점을 찍은 뒤 소수 첫째 자리를 나눔
분수로: 62/10 ÷ 2 = (62 ÷ 2)/10 = 31/10 = 3.1
최종: GRADE=6 ./make_final.sh 11
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, DashedLine, FadeIn, FadeOut, Indicate, LaggedStart, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from decdiv import DecDiv, blocks
from fraction import frac, row


class G6Ep11(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 11
    EP_TITLE = "(소수) ÷ (자연수) ⑴"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.model()
        self.vertical()
        self.closing(f"1은 1끼리, {o('0.1은 0.1끼리')} 나누어요\n몫의 소수점은 {g('나누어지는 수의 소수점')}에 맞추어 찍어요",
                     next_preview="6학년 12화 · 자리에서 나누어떨어지지 않을 때")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("끈 6.2 m를 2명이 똑같이 나누어 가지면\n한 명은 몇 m를 가질까요?", 44).move_to([0.6, 1.6, 0])
        self.say("6.2 ÷ 2는?", "끈 6.2 미터를 2명이 똑같이 나누어 가지면 한 명은 몇 미터를 가질까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def model(self):
        self.section("1과 0.1로 나누어 보기")
        bl = blocks(6, 2, 0, s=0.85).move_to([-1.0, 1.6, 0])
        lab = M(f"6.2 = 1이 6개, {o('0.1이 2개')}", 38).move_to([-1.0, 0.6, 0])
        self.say(f"6.2는 1이 6개, {o('0.1이 2개')}", "6.2는 1이 6개, 0.1이 2개인 수예요.")
        self.play(FadeIn(bl), FadeIn(lab), run_time=0.7)
        ones, tens = bl[0], bl[1]
        g1 = VGroup(*ones[:3], tens[0])
        g2 = VGroup(*ones[3:], tens[1])
        self.say("둘로 똑같이 나누면", "이것을 둘로 똑같이 나누면 1은 3개씩, 0.1은 1개씩이에요.")
        self.play(FadeOut(lab), run_time=0.3)
        self.play(g1.animate.arrange(RIGHT, buff=0.15, aligned_edge=DOWN).move_to([-3.0, -0.3, 0]), g2.animate.arrange(RIGHT, buff=0.15, aligned_edge=DOWN).move_to([3.0, -0.3, 0]), run_time=1.2)
        l1 = M(f"3 + {o('0.1')} = {g('3.1')}", 40).next_to(g1, DOWN, buff=0.35)
        l2 = M(f"3 + {o('0.1')} = {g('3.1')}", 40).next_to(g2, DOWN, buff=0.35)
        self.say(f"6.2 ÷ 2 = {g('3.1')}", "6 나누기 2는 3, 0.1이 2개를 2로 나누면 0.1이 1개. 그래서 6.2 나누기 2는 3.1이에요.")
        self.play(FadeIn(l1), FadeIn(l2), run_time=0.6)
        f = row(frac(62, 10, 44), "÷ 2 =", frac("62 ÷ 2", 10, 44, cn=ORANGE), "=", frac(31, 10, 44), "=", M(g("3.1"), 46), size=44).move_to([0, 1.9, 0])
        self.say("분수로 바꾸어도 3.1", "분수로 바꾸어 계산해도 10분의 62 나누기 2는 10분의 31, 3.1이에요.")
        self.play(FadeIn(f), run_time=0.7)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def vertical(self):
        self.section("세로셈")
        d = DecDiv(self, "6.2", "2", x_left=-2.6, y0=1.4)
        self.say("세로셈으로 계산해요", "세로셈으로 계산해 볼게요.")
        d.show()
        self.say("자연수 부분: 6 ÷ 2 = 3", "먼저 자연수 부분 6을 2로 나누면 3이에요.")
        d.quot(0, "3")
        d.row("6", 0, 1)
        d.line(0, 0, 1)
        dot = d.qdot()
        t = M(f"나누어지는 수의 소수점에 맞추어\n{g('몫의 소수점')}을 찍어요", 32).move_to([3.0, 1.4, 0])
        self.say(f"소수점을 {g('그대로 올려')} 찍어요", "나누어지는 수의 소수점에 맞추어 몫의 소수점을 찍어요.")
        self.play(FadeIn(t), Indicate(d.pt, color=GREEN, scale_factor=2.5), Indicate(dot, color=GREEN, scale_factor=2.5), run_time=0.8)
        self.say("소수 첫째 자리: 2 ÷ 2 = 1", "소수 첫째 자리 2를 내려 2로 나누면 1이에요.")
        d.row("2", 1, 2, ORANGE)
        d.quot(1, "1")
        d.row("2", 1, 3)
        d.line(1, 1, 3)
        d.row("0", 1, 4)
        r = M(f"6.2 ÷ 2 = {g('3.1')}", 48).move_to([3.0, -0.3, 0])
        self.say(f"6.2 ÷ 2 = {g('3.1')}", "6.2 나누기 2는 3.1이에요. 한 명은 끈을 3.1 미터 가져요.")
        self.play(FadeIn(r), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
