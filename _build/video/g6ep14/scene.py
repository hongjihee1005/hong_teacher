"""「수학 원리 돋보기」 6학년 14화 — 소수점 아래 0을 내려 계산 (6-1 3단원 5차시, 화 코드 6-1-3-d)

2.6 m = 260 cm, 260 ÷ 4 = 65, 65 cm = 0.65 m → 2.6 ÷ 4 = 0.65
세로셈: 26 ÷ 4의 나머지 2가 남으면 2.6 = 2.60이므로 0을 내려 20 ÷ 4 = 5
나누어지는 수가 1/100배 → 몫도 1/100배 (260 ÷ 4 = 65 → 2.6 ÷ 4 = 0.65)
최종: GRADE=6 ./make_final.sh 14
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Arrow, Create, CurvedArrow, FadeIn, FadeOut, Indicate, LaggedStart, VGroup,
                   Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from decdiv import DecDiv


class G6Ep14(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 14
    EP_TITLE = "소수점 아래 0을 내려 계산"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.cm()
        self.vertical()
        self.closing(f"나누어떨어지지 않으면 소수점 아래 {o('0')}이 있다고 생각하고\n0을 내려 계속 나누어요   2.6 = 2.60",
                     next_preview="6학년 15화 · 몫에 0이 있는 경우")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("리본 2.6 m를 4명이 똑같이 나누면\n한 명은 몇 m를 가질까요?", 44).move_to([0.6, 1.6, 0])
        self.say("2.6 ÷ 4는?", "리본 2.6 미터를 4명이 똑같이 나누면 한 명은 몇 미터를 가질까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def cm(self):
        self.section("cm로 바꾸어 보기")
        a = M("2.6 m = 260 cm", 46).move_to([0, 1.9, 0])
        self.say("2.6 m는 260 cm", "2.6 미터는 260 센티미터예요.")
        self.play(FadeIn(a), run_time=0.5)
        e1 = M(f"260 ÷ 4 = {o('65')} (cm)", 50).move_to([-2.6, 0.5, 0])
        e2 = M(f"2.6 ÷ 4 = {g('0.65')} (m)", 50).move_to([-2.6, -1.1, 0])
        self.say(f"260 ÷ 4 = {o('65')} cm", "260 나누기 4는 65, 한 명은 65 센티미터를 가져요.")
        self.play(FadeIn(e1), run_time=0.5)
        ar = Arrow(e1.get_bottom() + LEFT * 1.2, e2.get_top() + LEFT * 1.2, color=SOFT, buff=0.1, stroke_width=5)
        ar2 = Arrow(e1.get_bottom() + RIGHT * 1.0, e2.get_top() + RIGHT * 1.0, color=SOFT, buff=0.1, stroke_width=5)
        n1 = M(f"× {b('1/100')}", 32).next_to(ar, LEFT, buff=0.1)
        n2 = M(f"× {b('1/100')}", 32).next_to(ar2, RIGHT, buff=0.1)
        self.say(f"65 cm = {g('0.65 m')}", "65 센티미터는 0.65 미터예요. 나누어지는 수가 100분의 1배가 되면 몫도 100분의 1배가 돼요.")
        self.play(Create(ar), Create(ar2), FadeIn(n1), FadeIn(n2), FadeIn(e2), run_time=0.9)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def vertical(self):
        self.section("0을 내려 계산하기")
        d = DecDiv(self, "2.6", "4", x_left=-2.6, y0=1.5)
        self.say("세로셈으로 계산해요", "이번에는 세로셈으로 계산해 볼게요.")
        d.show()
        d.quot(0, "0", ORANGE)
        d.qdot()
        self.say("26 ÷ 4 = 6, 2가 남아요", "2는 4로 나눌 수 없어 몫에 0과 소수점을 쓰고, 26 나누기 4는 6, 나머지는 2예요.")
        d.quot(1, "6")
        d.row("24", 1, 1)
        d.line(0, 1, 1)
        r2 = d.row("2", 1, 2)
        t = M(f"2.6 = 2.6{o('0')}\n끝에 0이 있다고 생각해요", 32).move_to([3.4, 1.4, 0])
        self.say(f"2.6 = 2.6{o('0')}, 0을 내려요", "아직 2가 남았어요. 2.6은 2.60과 같으니까 끝에 0이 있다고 생각하고 0을 내려요.")
        self.play(FadeIn(t), run_time=0.5)
        z = d.append("0")
        r20 = d.row("20", 2, 2, ORANGE)
        self.play(FadeOut(r2), run_time=0.2)
        self.say("20 ÷ 4 = 5", "20 나누기 4는 5.")
        d.quot(2, "5")
        d.row("20", 2, 3)
        d.line(1, 2, 3)
        d.row("0", 2, 4)
        r = M(f"2.6 ÷ 4 = {g('0.65')}", 48).move_to([3.4, -0.4, 0])
        self.say(f"2.6 ÷ 4 = {g('0.65')}", "2.6 나누기 4는 0.65. 한 명은 리본 0.65 미터를 가져요.")
        self.play(FadeIn(r), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
