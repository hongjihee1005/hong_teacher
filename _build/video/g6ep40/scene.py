"""「수학 원리 돋보기」 6학년 40화 — (소수 두 자리) ÷ (소수 두 자리) (6-2 2단원 3차시, 화 코드 6-2-2-b)

3.75 m = 375 cm, 1.25 m = 125 cm → 3.75 ÷ 1.25 = 375 ÷ 125 = 3
두 수를 각각 100배 해도 몫은 같음 / 세로셈: 소수점을 오른쪽으로 두 자리씩 / 분수: 375/100 ÷ 125/100 = 375 ÷ 125 = 3
최종: GRADE=6 ./make_final.sh 40
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Brace, Create, FadeIn, FadeOut, Indicate, LaggedStart, Line, Rectangle,
                   VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from decdiv import DecDiv
from fraction import frac, row


class G6Ep40(EpisodeScene):
    GRADE, SEM = 6, 2
    EP_NO = 40
    EP_TITLE = "(소수 두 자리) ÷ (소수 두 자리)"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.cm()
        self.vertical()
        self.closing(f"(소수 두 자리) ÷ (소수 두 자리)는 두 수를 {o('똑같이 100배')} 하여\n자연수의 나눗셈으로 계산해요   3.75 ÷ 1.25 = 375 ÷ 125 = {g('3')}",
                     next_preview="6학년 41화 · (소수 두 자리) ÷ (소수 한 자리)")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("색 테이프 3.75 m를 1.25 m씩 자르면\n몇 도막이 될까요?", 44).move_to([0.6, 1.6, 0])
        self.say("3.75 ÷ 1.25는?", "색 테이프 3.75 미터를 1.25 미터씩 자르면 몇 도막이 될까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def cm(self):
        self.section("cm로 바꾸어 보기")
        W = 11.25 * 0.9
        tape = VGroup(*[Rectangle(width=W / 3, height=0.8, fill_color=[ORANGE, BLUE, GREEN][k], fill_opacity=0.55, stroke_color=INK, stroke_width=3) for k in range(3)]).arrange(RIGHT, buff=0).move_to([0, 1.6, 0])
        self.play(FadeIn(tape), run_time=0.5)
        br = Brace(tape, UP, color=INK)
        bt = M("3.75 m = 375 cm", 32).next_to(br, UP, buff=0.08)
        self.play(FadeIn(br), FadeIn(bt), run_time=0.4)
        labs = VGroup(*[M("125 cm", 28).move_to(c) for c in tape])
        self.say("m를 cm로 바꾸면", "3.75 미터는 375 센티미터, 1.25 미터는 125 센티미터예요.")
        self.play(FadeIn(labs), run_time=0.5)
        e = M(f"3.75 ÷ 1.25 = 375 ÷ 125 = {g('3')}", 48).move_to([0, 0.0, 0])
        self.say(f"375 ÷ 125 = {g('3')}", "그래서 3.75 나누기 1.25는 375 나누기 125, 3이에요. 두 수를 똑같이 100배 해도 몫은 같아요.")
        self.play(FadeIn(e), run_time=0.6)
        f = row(frac(375, 100, 44), "÷", frac(125, 100, 44), "= 375 ÷ 125 =", M(g("3"), 46), size=42).move_to([0, -1.3, 0])
        self.say("분수로도 375 ÷ 125", "분수로 바꾸어 100분의 375 나누기 100분의 125로 계산해도 분자끼리 375 나누기 125예요.")
        self.play(FadeIn(f), run_time=0.6)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def vertical(self):
        self.section("세로셈")
        d = DecDiv(self, "3.75", "1.25", x_left=-1.0, y0=1.3)
        self.say(f"소수점을 {o('두 자리씩')} 옮겨요", "세로셈에서는 두 수의 소수점을 오른쪽으로 두 자리씩 옮겨요.")
        d.show()
        d.move_point(2)
        t = M("3.75 → 375, 1.25 → 125", 32).move_to([3.6, 1.6, 0])
        self.play(FadeIn(t), run_time=0.4)
        self.say(f"375 ÷ 125 = {g('3')}", "그다음 375 나누기 125를 계산하면 3이에요.")
        d.quot(2, "3")
        d.row("375", 2, 1)
        d.line(0, 2, 1)
        d.row("0", 2, 2)
        r = M(f"{g('3')}도막", 44).move_to([3.6, 0.3, 0])
        self.play(FadeIn(r), run_time=0.4)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
