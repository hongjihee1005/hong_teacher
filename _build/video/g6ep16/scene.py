"""「수학 원리 돋보기」 6학년 16화 — (자연수) ÷ (자연수)의 몫을 소수로 (6-1 3단원 7차시, 화 코드 6-1-3-f)

30 ÷ 2 = 15이고 3은 30의 1/10배 → 3 ÷ 2 = 1.5
300 ÷ 4 = 75이고 3은 300의 1/100배 → 3 ÷ 4 = 0.75
세로셈: 3 = 3.0 = 3.00처럼 자연수 뒤에 소수점이 있다고 생각하고 0을 내려 계산
분수로: 3 ÷ 4 = 3/4 = 75/100 = 0.75
최종: GRADE=6 ./make_final.sh 16
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Arrow, Create, FadeIn, FadeOut, Indicate, LaggedStart, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from decdiv import DecDiv
from fraction import frac, row


class G6Ep16(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 16
    EP_TITLE = "(자연수) ÷ (자연수)의 몫을 소수로"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.scale()
        self.vertical()
        self.closing(f"자연수 뒤에 {o('소수점')}이 있다고 생각하고 {o('0')}을 내려 계산해요\n3 ÷ 4 = 3/4 = 75/100 = {g('0.75')}",
                     next_preview="6학년 17화 · 어림셈으로 소수점 위치 확인")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("3 ÷ 2, 3 ÷ 4의 몫을 소수로 나타낼 수 있을까요?", 44).move_to([0.6, 1.6, 0])
        self.say("몫을 소수로?", "3 나누기 2, 3 나누기 4처럼 나누어떨어지지 않는 자연수의 나눗셈은 몫을 소수로 나타낼 수 있을까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def pair(self, top, bot, k, y):
        e1 = M(top, 50).move_to([-2.4, y + 0.75, 0])
        e2 = M(bot, 50).move_to([-2.4, y - 0.75, 0])
        al = Arrow(e1.get_bottom() + LEFT * 1.1, e2.get_top() + LEFT * 1.1, color=SOFT, buff=0.08, stroke_width=5)
        ar = Arrow(e1.get_bottom() + RIGHT * 1.0, e2.get_top() + RIGHT * 1.0, color=SOFT, buff=0.08, stroke_width=5)
        nl = M(f"× {b(k)}", 30).next_to(al, LEFT, buff=0.1)
        nr = M(f"× {b(k)}", 30).next_to(ar, RIGHT, buff=0.1)
        return e1, e2, VGroup(al, ar, nl, nr)

    def scale(self):
        self.section("1/10배, 1/100배")
        e1, e2, arr = self.pair(f"30 ÷ 2 = {o('15')}", f"3 ÷ 2 = {g('1.5')}", "1/10", 0.4)
        for m in (e1, e2, arr):
            m.shift(LEFT * 1.0)
        self.say(f"30 ÷ 2 = 15 → 3 ÷ 2 = {g('1.5')}", "30 나누기 2는 15예요. 3은 30의 10분의 1배이니 몫도 10분의 1배, 3 나누기 2는 1.5예요.")
        self.play(FadeIn(e1), run_time=0.5)
        self.play(FadeIn(arr), FadeIn(e2), run_time=0.8)
        f1, f2, arr2 = self.pair(f"300 ÷ 4 = {o('75')}", f"3 ÷ 4 = {g('0.75')}", "1/100", 0.4)
        for m in (f1, f2, arr2):
            m.shift(RIGHT * 6.2)
        self.say(f"300 ÷ 4 = 75 → 3 ÷ 4 = {g('0.75')}", "300 나누기 4는 75예요. 3은 300의 100분의 1배이니 3 나누기 4는 0.75예요.")
        self.play(FadeIn(f1), run_time=0.5)
        self.play(FadeIn(arr2), FadeIn(f2), run_time=0.8)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def vertical(self):
        self.section("세로셈과 분수")
        d = DecDiv(self, "3.00", "4", x_left=-3.4, y0=1.5)
        self.say(f"3 = 3.{o('00')}이라고 생각해요", "세로셈에서는 3을 3.00처럼 자연수 뒤에 소수점이 있다고 생각해요.")
        d.show()
        self.play(d.top[1].animate.set_color(ORANGE), d.top[2].animate.set_color(ORANGE), d.pt.animate.set_color(ORANGE), run_time=0.5)
        d.quot(0, "0", ORANGE)
        d.qdot()
        self.say("30 ÷ 4 = 7, 2가 남아요", "3은 4로 나눌 수 없어 0과 소수점을 쓰고, 0을 내려 30 나누기 4는 7, 2가 남아요.")
        d.quot(1, "7")
        d.row("28", 1, 1)
        d.line(0, 1, 1)
        self.say("0을 또 내려 20 ÷ 4 = 5", "0을 또 내려 20 나누기 4는 5예요.")
        d.row("20", 2, 2, ORANGE)
        d.quot(2, "5")
        d.row("20", 2, 3)
        d.line(1, 2, 3)
        d.row("0", 2, 4)
        f = row("3 ÷ 4 =", frac(3, 4, 46), "=", frac(75, 100, 46, cn=ORANGE, cd=ORANGE), "=", M(g("0.75"), 48), size=46).move_to([3.4, 0.3, 0])
        self.say(f"분수로도 3/4 = 75/100 = {g('0.75')}", "몫을 분수로 나타낸 다음 소수로 바꿀 수도 있어요. 4분의 3은 100분의 75, 0.75예요.")
        self.play(FadeIn(f), run_time=0.7)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
