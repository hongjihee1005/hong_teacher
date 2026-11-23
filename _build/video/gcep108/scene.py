"""「수학 원리 돋보기」 개념 차근차근 108화 — 둘레

도형의 가장자리 한 바퀴 길이 / 정다각형: 한 변 × 변의 수(정육각형 4 cm → 24 cm) / 직사각형: (가로 + 세로) × 2 / 정사각형: 한 변 × 4 / 연습
최종: GRADE=c ./make_final.sh 108
"""
import numpy as np
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
from manim import Rectangle, Square, Circle, Dot, PI


class GcEp108(ConceptScene):
    EP_NO = 108
    EP_TITLE = "둘레"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("둘레란?")
        r = Rectangle(width=4.8, height=2.4, stroke_color=INK, stroke_width=5, fill_color=ORANGE, fill_opacity=0.25).move_to([-2.2, 0.5, 0])
        self.say("가장자리를 한 바퀴", "도형의 가장자리를 한 바퀴 돈 길이를 둘레라고 해요.")
        self.play(FadeIn(r), run_time=0.4)
        self.play(Create(r.copy().set_fill(opacity=0).set_stroke(GREEN, 10)), run_time=1.4)
        la, lb = M("가로 6 cm", 36).next_to(r, UP, buff=0.2), M("세로 3 cm", 36).next_to(r, LEFT, buff=0.2)
        t = M(f"(6 + 3) × 2 = {g('18 cm')}", 50).move_to([3.4, 0.5, 0])
        self.say(f"(가로 + 세로) × 2 = {g('18 cm')}", "직사각형은 가로와 세로가 두 번씩 있으니 가로 더하기 세로에 2를 곱해요. 6 더하기 3은 9, 곱하기 2는 18센티미터.")
        self.play(FadeIn(la), FadeIn(lb), FadeIn(t), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)
        self.step("정다각형의 둘레", [(f"정사각형: 한 변 × {o('4')}", 48, 1.3), (f"정육각형 한 변 4 cm → 4 × 6 = {g('24 cm')}", 48, 0.3),
                  ("정다각형: 한 변 × 변의 수", 44, -0.7)],
                  "변이 모두 같으면 곱해요", "정다각형은 변의 길이가 모두 같아서 한 변에 변의 수를 곱하면 둘레예요. 한 변이 4센티미터인 정육각형은 24센티미터.")
        self.ask("한 변이 7 cm인 정사각형의 둘레는?", "둘레는?", "연습해 볼까요? 한 변이 7센티미터인 정사각형의 둘레는?",
                 f"7 × 4 = {g('28 cm')}", f"{g('28 cm')}", "7 곱하기 4, 28센티미터예요.", qsize=60)
        self.closing(f"가장자리 한 바퀴의 길이: {g('둘레')}\n직사각형 (가로 + 세로) × 2 · 정다각형 한 변 × 변의 수",
                     next_preview="개념 차근차근 109화 · 넓이의 뜻과 1 cm²")
        self.wait(0.5)
