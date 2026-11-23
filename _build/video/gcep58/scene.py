"""「수학 원리 돋보기」 개념 차근차근 58화 — (분수) ÷ (자연수)

4/5 ÷ 2: 분자가 나누어떨어지면 분자 ÷ 2 → 2/5 / 3/5 ÷ 2: 크기가 같은 분수 6/10로 바꾸어 3/10 / ÷ 2는 × 1/2 → 3/5 × 1/2 = 3/10
연습 2/3 ÷ 4
최종: GRADE=c ./make_final.sh 58
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
from decimal4 import grid100


class GcEp58(ConceptScene):
    EP_NO = 58
    EP_TITLE = "(분수) ÷ (자연수)"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("분자가 나누어떨어지면")
        bar = frac_bar(5, 4, width=6.0).move_to([0, 1.4, 0])
        self.say("4/5를 둘로 똑같이", "5분의 4를 2명이 똑같이 나누면 한 명은 5분의 1이 2개, 5분의 2예요.")
        self.play(FadeIn(bar), run_time=0.5)
        e = M(f"4/5 ÷ 2 = (4 ÷ 2)/5 = {g('2/5')}", 56).move_to([0, 0.0, 0])
        self.play(FadeIn(e), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.5)
        self.step("나누어떨어지지 않으면", [(f"3/5 ÷ 2 → 3 ÷ 2 가 안 돼요", 50, 1.6),
                  (f"크기가 같은 분수로: 3/5 = {o('6/10')} → 6/10 ÷ 2 = {g('3/10')}", 46, 0.6),
                  (f"또는 ÷ 2 = × {b('1/2')}: 3/5 × 1/2 = {g('3/10')}", 46, -0.4)],
                  "분자를 늘리거나 × 1/2로", "5분의 3을 2로 나눌 때는 분자 3이 2로 나누어떨어지지 않아요. 크기가 같은 10분의 6으로 바꾸어 나누면 10분의 3. 또는 2로 나누는 것은 2분의 1을 곱하는 것과 같아서 10분의 3이에요.")
        self.ask("2/3 ÷ 4", "2/3 ÷ 4", "연습해 볼까요? 3분의 2 나누기 4를 계산해 보세요.",
                 f"2/3 × 1/4 = 2/12 = {g('1/6')}", f"{g('1/6')}", "4분의 1을 곱하면 12분의 2, 약분하면 6분의 1이에요.")
        self.closing(f"÷ (자연수)는 × {o('1/자연수')}와 같아요\n3/5 ÷ 2 = 3/5 × 1/2 = {g('3/10')}",
                     next_preview="개념 차근차근 59화 · (분수) ÷ (분수)")
        self.wait(0.5)
