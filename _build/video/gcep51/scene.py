"""「수학 원리 돋보기」 개념 차근차근 51화 — 분모가 다른 분수의 덧셈

1/2 + 1/3: 통분 3/6 + 2/6 = 5/6 (막대) / 3/4 + 5/6 = 9/12 + 10/12 = 19/12 = 1과 7/12 / 대분수: 자연수끼리, 분수끼리
연습: 2/5 + 1/2
최종: GRADE=c ./make_final.sh 51
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
from fraction import frac, frac_bar, row


class GcEp51(ConceptScene):
    EP_NO = 51
    EP_TITLE = "분모가 다른 분수의 덧셈"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.basic()
        self.over()
        self.practice()
        self.closing(f"{o('통분')} → 분자끼리 더하기 → 필요하면 {b('약분')}·대분수로\n1/2 + 1/3 = 3/6 + 2/6 = {g('5/6')}",
                     next_preview="개념 차근차근 52화 · 분모가 다른 분수의 뺄셈")
        self.wait(0.5)

    def basic(self):
        self.section("통분해서 더하기")
        bar = frac_bar(6, 0, width=7.2).move_to([0, 1.4, 0])
        for k in range(3):
            bar[k].set_fill(ORANGE, 1)
        for k in range(3, 5):
            bar[k].set_fill(BLUE, 1)
        self.say("1/2 + 1/3", "2분의 1 더하기 3분의 1. 조각 크기가 다르니 먼저 6으로 통분해요. 2분의 1은 6분의 3, 3분의 1은 6분의 2.")
        self.play(FadeIn(bar), run_time=0.6)
        e = M(f"1/2 + 1/3 = {o('3/6')} + {b('2/6')} = {g('5/6')}", 60).move_to([0, 0.0, 0])
        self.say(f"{g('5/6')}", "분모가 같아졌으니 분자끼리 더해 6분의 5예요.")
        self.play(FadeIn(e), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def over(self):
        self.section("합이 1보다 크면")
        e1 = M(f"3/4 + 5/6 = 9/12 + 10/12 = {o('19/12')} = {g('1과 7/12')}", 54).move_to([0, 1.2, 0])
        self.say("가분수는 대분수로", "4분의 3 더하기 6분의 5는 12분의 9 더하기 12분의 10, 12분의 19. 대분수로 1과 12분의 7이에요.")
        self.play(FadeIn(e1), run_time=0.6)
        e2 = M(f"대분수: 1과 1/2 + 2와 1/3 = (1 + 2) + (3/6 + 2/6) = {g('3과 5/6')}", 44).move_to([0, -0.1, 0])
        self.say("대분수는 자연수끼리, 분수끼리", "대분수끼리 더할 때는 자연수는 자연수끼리, 분수는 통분해서 분수끼리 더해요.")
        self.play(FadeIn(e2), run_time=0.6)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        q = M("2/5 + 1/2", 84).move_to([0, 1.2, 0])
        self.say("2/5 + 1/2", "연습해 볼까요? 5분의 2 더하기 2분의 1을 계산해 보세요.")
        self.play(Write(q), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a = M(f"4/10 + 5/10 = {g('9/10')}", 64).move_to([0, -0.4, 0])
        self.say(f"{g('9/10')}", "10으로 통분하면 10분의 4 더하기 10분의 5, 10분의 9예요.")
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
