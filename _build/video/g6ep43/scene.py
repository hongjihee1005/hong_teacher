"""「수학 원리 돋보기」 6학년 43화 — 몫을 반올림하여 나타내기 (6-2 2단원 6차시, 화 코드 6-2-2-e)

7 ÷ 3 = 2.333…처럼 몫이 간단한 소수로 구해지지 않을 때 몫을 반올림하여 나타냄
일의 자리까지: 소수 첫째 자리 숫자를 봄 → 약 2 / 소수 첫째 자리까지: 소수 둘째 자리 숫자를 봄 → 약 2.3
1.2 ÷ 0.7 = 1.714… → 약 2, 약 1.7, 약 1.71
최종: GRADE=6 ./make_final.sh 43
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, SurroundingRectangle, VGroup,
                   Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from decdiv import DecDiv
from tablekit import table


class G6Ep43(EpisodeScene):
    GRADE, SEM = 6, 2
    EP_NO = 43
    EP_TITLE = "몫을 반올림하여 나타내기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.endless()
        self.round_()
        self.closing(f"몫이 끝없이 이어지면 {o('반올림')}하여 나타내요\n나타내려는 자리 {b('바로 아래 자리')} 숫자를 보아요",
                     next_preview="6학년 44화 · 나누어 주고 남는 양")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("주스 7 L를 3명이 똑같이 나누면\n한 명은 몇 L씩 마실까요?", 44).move_to([0.6, 1.6, 0])
        self.say("7 ÷ 3은?", "주스 7 리터를 3명이 똑같이 나누어 마시면 한 명은 몇 리터씩 마실까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def endless(self):
        self.section("끝나지 않는 나눗셈")
        d = DecDiv(self, "7.000", "3", x_left=-3.4, y0=1.45, F=52, dx=0.56, dy=0.64)
        d.show()
        d.quot(0, "2")
        d.qdot()
        d.row("6", 0, 1)
        d.line(0, 0, 1)
        self.say("계속 1이 남아요", "7 나누기 3을 세로셈으로 계산하면 2, 1이 남아요. 0을 내려 10 나누기 3은 3, 또 1이 남아요.")
        d.row("10", 1, 2, ORANGE)
        d.quot(1, "3")
        d.row("9", 1, 3)
        d.line(1, 1, 3)
        d.row("10", 2, 4, ORANGE)
        d.quot(2, "3")
        d.row("9", 2, 5)
        d.line(2, 2, 5)
        dots = M("…", 54, GREEN).move_to([d.x(3) + 0.1, d.y0 + 1.05, 0])
        t = M(f"7 ÷ 3 = 2.333{g('…')}", 46).move_to([3.4, 0.6, 0])
        self.say(f"2.333… {o('끝없이')} 이어져요", "몇 번을 해도 1이 남아서 3이 끝없이 이어져요. 7 나누기 3은 2.333…이에요.")
        self.play(FadeIn(dots), FadeIn(t), run_time=0.6)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def round_(self):
        self.section("반올림하여 나타내기")
        frame, cells = table([["나타낼 자리", "보는 숫자", "몫"],
                              ["일의 자리까지", "2.<b><span foreground='#C0392B'>3</span></b>33…", "약 2"],
                              ["소수 첫째 자리까지", "2.3<b><span foreground='#C0392B'>3</span></b>3…", "약 2.3"],
                              ["소수 둘째 자리까지", "2.33<b><span foreground='#C0392B'>3</span></b>…", "약 2.33"]],
                             (0, 1.0), cw=2.8, hw=3.6, h=0.72, size=32)
        self.say(f"바로 아래 자리 숫자를 보아요", "몫을 반올림해서 나타내요. 일의 자리까지 나타내려면 소수 첫째 자리 숫자 3을 보고 버려서 약 2예요.")
        self.play(FadeIn(frame), *[FadeIn(c) for c in cells[0]], run_time=0.5)
        self.play(*[FadeIn(c) for c in cells[1]], run_time=0.5)
        self.say("약 2.3, 약 2.33", "소수 첫째 자리까지는 소수 둘째 자리 숫자를 보아서 약 2.3, 소수 둘째 자리까지는 약 2.33이에요.")
        self.play(*[FadeIn(c) for c in cells[2]], run_time=0.5)
        self.play(*[FadeIn(c) for c in cells[3]], run_time=0.5)
        e = M(f"1.2 ÷ 0.7 = 1.714… → 약 {g('2')}, 약 {g('1.7')}, 약 {g('1.71')}", 38).move_to([0, -1.5, 0])
        self.say("1.2 ÷ 0.7 = 1.714…", "1.2 나누기 0.7은 1.714…예요. 일의 자리까지 약 2, 소수 첫째 자리까지 약 1.7, 소수 둘째 자리까지 약 1.71이에요.")
        self.play(FadeIn(e), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
