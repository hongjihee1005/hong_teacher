"""「수학 원리 돋보기」 6학년 41화 — (소수 두 자리) ÷ (소수 한 자리) (6-2 2단원 4차시, 화 코드 6-2-2-c)

5.89 ÷ 3.1: 두 수를 각각 100배 한 589 ÷ 310, 또는 나누는 수가 자연수가 되도록 각각 10배 한 58.9 ÷ 31 → 몫 1.9
몫의 소수점은 옮긴 나누어지는 수의 소수점 위치에 맞추어 찍음
최종: GRADE=6 ./make_final.sh 41
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Arrow, Create, FadeIn, FadeOut, Indicate, LaggedStart, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from decdiv import DecDiv


class G6Ep41(EpisodeScene):
    GRADE, SEM = 6, 2
    EP_NO = 41
    EP_TITLE = "(소수 두 자리) ÷ (소수 한 자리)"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.two_ways()
        self.vertical()
        self.closing(f"나누는 수가 {o('자연수')}가 되도록 두 수의 소수점을 똑같이 옮기고\n몫의 소수점은 {g('옮긴 소수점')} 위치에 맞추어 찍어요",
                     next_preview="6학년 42화 · (자연수) ÷ (소수)")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("5.89 ÷ 3.1은 어떻게 계산할까요?", 46).move_to([0.6, 1.6, 0])
        self.say("5.89 ÷ 3.1은?", "소수 두 자리 수를 소수 한 자리 수로 나누는 5.89 나누기 3.1은 어떻게 계산할까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def two_ways(self):
        self.section("두 가지 방법")
        a = M("5.89 ÷ 3.1", 52).move_to([0, 2.0, 0])
        self.play(FadeIn(a), run_time=0.4)
        l = M(f"각각 {o('100배')}\n589 ÷ 310 = {g('1.9')}", 40).move_to([-3.2, 0.2, 0])
        r = M(f"각각 {b('10배')}\n58.9 ÷ 31 = {g('1.9')}", 40).move_to([3.2, 0.2, 0])
        al = Arrow(a.get_bottom() + LEFT * 0.6, l.get_top(), color=ORANGE, buff=0.12, stroke_width=5)
        ar = Arrow(a.get_bottom() + RIGHT * 0.6, r.get_top(), color=BLUE, buff=0.12, stroke_width=5)
        self.say(f"모두 {o('100배')} 하면 589 ÷ 310", "두 수를 각각 100배 하면 589 나누기 310으로 계산할 수 있어요.")
        self.play(Create(al), FadeIn(l), run_time=0.7)
        self.say(f"나누는 수만 자연수가 되게 {b('10배')}", "나누는 수가 자연수가 되도록 각각 10배 해서 58.9 나누기 31로 계산해도 돼요. 몫은 둘 다 1.9예요.")
        self.play(Create(ar), FadeIn(r), run_time=0.7)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def vertical(self):
        self.section("세로셈")
        d = DecDiv(self, "5.89", "3.1", x_left=-1.6, y0=1.5)
        self.say(f"소수점을 {o('한 자리씩')} 옮겨요", "세로셈에서는 나누는 수 3.1이 자연수가 되도록 두 수의 소수점을 오른쪽으로 한 자리씩 옮겨요.")
        d.show()
        d.move_point(1)
        self.say(f"몫의 소수점은 {g('옮긴 자리')}에", "몫의 소수점은 옮긴 나누어지는 수의 소수점 위치에 맞추어 찍어요.")
        d.qdot()
        self.say("58 ÷ 31 = 1, 27이 남아요", "58 나누기 31은 1, 27이 남아요.")
        d.quot(1, "1")
        d.row("31", 1, 1)
        d.line(0, 1, 1)
        self.say("279 ÷ 31 = 9", "9를 내려 279 나누기 31은 9예요.")
        d.row("279", 2, 2, ORANGE)
        d.quot(2, "9")
        d.row("279", 2, 3)
        d.line(0, 2, 3)
        d.row("0", 2, 4)
        r = M(f"5.89 ÷ 3.1 = {g('1.9')}", 46).move_to([3.6, 0.4, 0])
        self.play(FadeIn(r), run_time=0.4)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
