"""「수학 원리 돋보기」 개념 차근차근 39화 — 소수의 뺄셈

소수점 맞추기, 빈자리 0 채우기: 5 − 1.37 = 3.63 (5 = 5.00) / 받아내림은 자연수와 같음 (decimal4.dec_vertical)
연습: 4.2 − 2.75
최종: GRADE=c ./make_final.sh 39
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


class GcEp39(ConceptScene):
    EP_NO = 39
    EP_TITLE = "소수의 뺄셈"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.zero()
        self.section("세로셈으로")
        self.say("5 − 1.37", "5 빼기 1.37을 세로셈으로 계산해요. 5를 5.00으로 보고 소수점을 맞추어요.")
        dec_vertical(self, "5.00", "1.37", "-")
        self.settle()
        clear_stage(self, 0.5)
        self.practice()
        self.closing(f"소수점을 맞추고, 빈자리에 {o('0')}을 채워 빼요\n5 − 1.37 = 5.00 − 1.37 = {g('3.63')}",
                     next_preview="개념 차근차근 40화 · 자연수의 혼합 계산과 괄호")
        self.wait(0.5)

    def zero(self):
        self.section("빈자리에 0")
        e1 = M(f"5 = 5.0 = {o('5.00')}", 70).move_to([0, 1.2, 0])
        t = M("소수 끝에 0을 붙여도 크기는 같아요\n그래서 빈자리를 0으로 채워 계산할 수 있어요", 42).move_to([0, -0.2, 0])
        self.say("5는 5.00과 같아요", "5는 5.0, 5.00과 같아요. 소수 끝에 0을 붙여도 크기는 같아서, 빈자리를 0으로 채워 계산할 수 있어요.")
        self.play(FadeIn(e1), FadeIn(t), run_time=0.7)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        q = M("4.2 − 2.75", 90).move_to([0, 1.2, 0])
        self.say("4.2 − 2.75", "연습해 볼까요? 4.2 빼기 2.75를 계산해 보세요.")
        self.play(Write(q), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a = M(f"4.20 − 2.75 = {g('1.45')}", 64).move_to([0, -0.4, 0])
        self.say(f"{g('1.45')}", "4.2를 4.20으로 보고 받아내림하며 빼면 1.45예요.")
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
