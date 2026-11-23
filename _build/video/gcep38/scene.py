"""「수학 원리 돋보기」 개념 차근차근 38화 — 소수의 덧셈

소수점을 맞추어 세로셈 1.6 + 0.85(빈자리 0) = 2.45 (decimal4.dec_vertical) / 0.1이 몇 개로 생각하기 0.7 + 0.5 = 1.2
연습: 2.4 + 1.38
최종: GRADE=c ./make_final.sh 38
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, Line, SurroundingRectangle, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, M, T, b, g, o
from division import clear_stage
from conceptkit import ConceptScene, dot, dots, ten_frame, RED
from items import check_mark, cross_mark
from storykit import book, scroll, show_sources
from decimal4 import dec_markup, dec_vertical, grid100


class GcEp38(ConceptScene):
    EP_NO = 38
    EP_TITLE = "소수의 덧셈"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.count()
        self.section("소수점을 맞추어 세로셈")
        self.say("1.6 + 0.85", "1.6 더하기 0.85를 세로셈으로 계산해요. 소수점을 위아래로 맞추는 것이 가장 중요해요.")
        dec_vertical(self, "1.6", "0.85", "+")
        self.settle()
        clear_stage(self, 0.5)
        self.practice()
        self.closing(f"{g('소수점')}을 맞추어 쓰고, 자연수처럼 더해요\n빈자리는 {o('0')}이 있다고 생각해요: 1.6 = 1.60",
                     next_preview="개념 차근차근 39화 · 소수의 뺄셈")
        self.wait(0.5)

    def count(self):
        self.section("0.1이 몇 개")
        e = M(f"0.7 + 0.5 = 0.1이 {o('7개')} + {b('5개')} = 0.1이 12개 = {g('1.2')}", 46).move_to([0, 0.8, 0])
        self.say("0.1이 몇 개인지로", "0.7 더하기 0.5는 0.1이 7개와 5개, 모두 12개. 0.1이 10개면 1이니까 1.2예요.")
        self.play(FadeIn(e), run_time=0.6)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        q = M("2.4 + 1.38", 90).move_to([0, 1.2, 0])
        self.say("2.4 + 1.38", "연습해 볼까요? 2.4 더하기 1.38을 계산해 보세요.")
        self.play(Write(q), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a = M(f"2.40 + 1.38 = {g('3.78')}", 64).move_to([0, -0.4, 0])
        self.say(f"{g('3.78')}", "2.4를 2.40으로 보고 소수점을 맞추어 더하면 3.78이에요.")
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
