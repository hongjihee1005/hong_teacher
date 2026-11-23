"""「수학 원리 돋보기」 개념 차근차근 114화 — 사다리꼴·마름모의 넓이

사다리꼴 2개를 돌려 붙이면 평행사변형(밑변 = 윗변 + 아랫변) → (윗변 + 아랫변) × 높이 ÷ 2 / 마름모: 직사각형의 절반 → (대각선) × (대각선) ÷ 2 / 연습
최종: GRADE=c ./make_final.sh 114
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
from conceptkit import poly, regular
from manim import Rectangle, Square, Circle, Polygon, Dot, DashedLine, PI, Sector, AnnularSector


class GcEp114(ConceptScene):
    EP_NO = 114
    EP_TITLE = "사다리꼴·마름모의 넓이"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("사다리꼴")
        t1 = poly([[-4.0, -0.8], [-0.8, -0.8], [-1.6, 1.0], [-3.2, 1.0]], BLUE, 0.45)
        t2 = poly([[-1.6, 1.0], [-0.8, -0.8], [0.8, -0.8], [1.6, 1.0]], GREEN, 0.45)
        self.say("사다리꼴 2개를 붙이면", "똑같은 사다리꼴 2개를 거꾸로 붙이면 평행사변형이 돼요. 그 밑변은 윗변과 아랫변을 더한 길이예요.")
        self.play(FadeIn(t1), run_time=0.5)
        self.play(FadeIn(t2), run_time=0.7)
        t = M(f"(윗변 + 아랫변)\n× 높이 {o('÷ 2')}", 46).move_to([4.0, 0.2, 0])
        self.play(FadeIn(t), run_time=0.4)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)
        self.section("마름모")
        rh = poly([[-2.6, -1.2], [-1.0, 0.3], [-2.6, 1.8], [-4.2, 0.3]], ORANGE, 0.5)
        box = Rectangle(width=3.2, height=3.0, stroke_color=SOFT, stroke_width=3).move_to([-2.6, 0.3, 0])
        d1 = Line([-4.2, 0.3, 0], [-1.0, 0.3, 0], color=INK, stroke_width=3)
        d2 = Line([-2.6, -1.2, 0], [-2.6, 1.8, 0], color=INK, stroke_width=3)
        self.say("마름모는 직사각형의 절반", "마름모를 둘러싼 직사각형을 그리면, 마름모는 그 직사각형의 절반이에요. 직사각형의 가로와 세로는 마름모의 두 대각선이에요.")
        self.play(FadeIn(rh), Create(d1), Create(d2), run_time=0.6)
        self.play(Create(box), run_time=0.6)
        t = M(f"(대각선) × (대각선) {o('÷ 2')}", 46).move_to([3.0, 0.3, 0])
        self.play(FadeIn(t), run_time=0.4)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)
        self.ask("윗변 3 cm, 아랫변 7 cm, 높이 4 cm인 사다리꼴의 넓이는?", "넓이는?", "연습해 볼까요? 윗변 3, 아랫변 7, 높이 4센티미터인 사다리꼴의 넓이는?",
                 f"(3 + 7) × 4 ÷ 2 = {g('20 cm²')}", f"{g('20 cm²')}", "3 더하기 7은 10, 곱하기 4는 40, 2로 나누면 20제곱센티미터예요.", qsize=46)
        self.closing(f"사다리꼴: (윗변 + 아랫변) × 높이 ÷ 2\n마름모: 대각선 × 대각선 ÷ 2",
                     next_preview="개념 차근차근 115화 · 원주와 원주율, 아르키메데스")
        self.wait(0.5)
