"""「수학 원리 돋보기」 개념 차근차근 109화 — 넓이의 뜻과 1 cm²

넓이 = 평면이 차지하는 크기 / 한 변 1 cm 정사각형의 넓이 1 cm²(1 제곱센티미터) / 단위넓이가 몇 개 → 넓이 / 모양이 달라도 넓이는 같을 수 있음 / 연습
최종: GRADE=c ./make_final.sh 109
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


class GcEp109(ConceptScene):
    EP_NO = 109
    EP_TITLE = "넓이의 뜻과 1 cm²"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("1 cm²")
        u = Square(1.2, fill_color=ORANGE, fill_opacity=0.6, stroke_color=INK, stroke_width=4).move_to([-4.0, 1.0, 0])
        self.say("한 변이 1 cm인 정사각형", "평면이 차지하는 크기를 넓이라고 해요. 한 변이 1센티미터인 정사각형의 넓이를 1제곱센티미터라고 하고, 1 cm²로 써요.")
        self.play(FadeIn(u), run_time=0.5)
        t = M(f"넓이 {g('1 cm²')} (1 제곱센티미터)", 36).move_to([-4.0, -0.2, 0])
        self.play(FadeIn(t), run_time=0.4)
        shapes = VGroup(VGroup(*[Square(0.6, fill_color=BLUE, fill_opacity=0.5, stroke_color=INK, stroke_width=3).move_to([c * 0.6, -r * 0.6, 0]) for r in range(2) for c in range(3)]),
                        VGroup(*[Square(0.6, fill_color=GREEN, fill_opacity=0.5, stroke_color=INK, stroke_width=3).move_to([c * 0.6, -r * 0.6, 0]) for r, c in [(0, 0), (1, 0), (1, 1), (1, 2), (2, 2), (2, 3)]])).arrange(RIGHT, buff=1.0).move_to([3.1, 0.6, 0])
        lab = M(f"모양은 달라도 둘 다 1 cm²가 {o('6개')} → {g('6 cm²')}", 40).move_to([0, -1.6, 0])
        self.say(f"1 cm²가 몇 개인지 세요", "1제곱센티미터가 몇 개인지 세면 넓이를 알 수 있어요. 모양은 달라도 둘 다 6개라서 넓이는 6제곱센티미터로 같아요.")
        self.play(FadeIn(shapes), FadeIn(lab), run_time=0.7)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.5)
        self.ask("1 cm²가 15개인 도형의 넓이는?", "넓이는?", "연습해 볼까요? 1제곱센티미터가 15개인 도형의 넓이는?",
                 f"{g('15 cm²')}", f"{g('15 cm²')}", "15제곱센티미터예요.", qsize=60)
        self.closing(f"한 변 1 cm인 정사각형의 넓이: {g('1 cm²')}\n1 cm²가 몇 개인지 세면 넓이",
                     next_preview="개념 차근차근 110화 · 직사각형·정사각형의 넓이")
        self.wait(0.5)
