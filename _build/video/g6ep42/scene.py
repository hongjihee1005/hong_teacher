"""「수학 원리 돋보기」 6학년 42화 — (자연수) ÷ (소수) (6-2 2단원 5차시, 화 코드 6-2-2-d)

10 cm = 100 mm, 2.5 cm = 25 mm → 10 ÷ 2.5 = 100 ÷ 25 = 4
나누는 수가 자연수가 되도록 두 수를 각각 10배 또는 100배 / 3 ÷ 0.75: 3을 3.00으로 생각하고 소수점을 두 자리씩 → 300 ÷ 75 = 4
최종: GRADE=6 ./make_final.sh 42
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Brace, Create, FadeIn, FadeOut, Indicate, LaggedStart, Rectangle, VGroup,
                   Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from decdiv import DecDiv

GC = [ORANGE, BLUE, GREEN, "#7A4FB5"]


class G6Ep42(EpisodeScene):
    GRADE, SEM = 6, 2
    EP_NO = 42
    EP_TITLE = "(자연수) ÷ (소수)"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.mm()
        self.vertical()
        self.closing(f"(자연수) ÷ (소수)는 나누는 수가 자연수가 되도록 두 수를 {o('똑같이 10배, 100배')}\n자연수 뒤에 {b('0')}을 붙여 생각해요   3 ÷ 0.75 = 300 ÷ 75 = {g('4')}",
                     next_preview="6학년 43화 · 몫을 반올림하여 나타내기")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("10 cm인 막대를 2.5 cm씩 자르면\n몇 도막이 될까요?", 44).move_to([0.6, 1.6, 0])
        self.say("10 ÷ 2.5는?", "10 센티미터인 막대를 2.5 센티미터씩 자르면 몇 도막이 될까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def mm(self):
        self.section("mm로 바꾸어 보기")
        W = 10.0
        bar = VGroup(*[Rectangle(width=W / 4, height=0.8, fill_color=GC[k], fill_opacity=0.55, stroke_color=INK, stroke_width=3) for k in range(4)]).arrange(RIGHT, buff=0).move_to([0, 1.5, 0])
        br = Brace(bar, UP, color=INK)
        bt = M("10 cm = 100 mm", 32).next_to(br, UP, buff=0.08)
        self.play(FadeIn(bar), FadeIn(br), FadeIn(bt), run_time=0.6)
        labs = VGroup(*[M("25 mm", 28).move_to(c) for c in bar])
        self.say("2.5 cm = 25 mm", "2.5 센티미터는 25 밀리미터예요.")
        self.play(FadeIn(labs), run_time=0.5)
        e = M(f"10 ÷ 2.5 = 100 ÷ 25 = {g('4')}", 48).move_to([0, -0.1, 0])
        self.say(f"100 ÷ 25 = {g('4')}", "10 나누기 2.5는 100 나누기 25, 4예요. 두 수를 똑같이 10배 했어요.")
        self.play(FadeIn(e), run_time=0.6)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def vertical(self):
        self.section("3 ÷ 0.75")
        d = DecDiv(self, "3.00", "0.75", x_left=-1.4, y0=1.3)
        self.say(f"3을 {o('3.00')}으로 생각해요", "3 나누기 0.75는 3을 3.00으로 생각해요.")
        d.show()
        self.play(d.top[1].animate.set_color(ORANGE), d.top[2].animate.set_color(ORANGE), d.pt.animate.set_color(ORANGE), run_time=0.4)
        self.say(f"소수점을 {o('두 자리씩')} 옮기면 300 ÷ 75", "나누는 수 0.75가 자연수가 되도록 두 수의 소수점을 두 자리씩 옮기면 300 나누기 75예요.")
        d.move_point(2)
        d.quot(2, "4")
        d.row("300", 2, 1)
        d.line(0, 2, 1)
        d.row("0", 2, 2)
        r = M(f"3 ÷ 0.75 = {g('4')}", 46).move_to([3.6, 0.6, 0])
        self.say(f"3 ÷ 0.75 = {g('4')}", "300 나누기 75는 4. 3 나누기 0.75는 4예요.")
        self.play(FadeIn(r), run_time=0.4)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
