"""「수학 원리 돋보기」 개념 차근차근 116화 — 원의 넓이

원을 잘게 잘라 엇갈려 붙이면 직사각형에 가까움 → 가로 = 원주의 반(반지름 × 3.14), 세로 = 반지름 → 반지름 × 반지름 × 3.14 / 연습
최종: GRADE=c ./make_final.sh 116
"""
import numpy as np
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, Line, SurroundingRectangle, TransformFromCopy, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, M, T, b, g, o
from division import clear_stage
from conceptkit import ConceptScene, dot, dots, ten_frame, RED
from items import check_mark, cross_mark
from storykit import book, scroll, show_sources
from conceptkit import poly, regular
from manim import Rectangle, Square, Circle, Polygon, Dot, DashedLine, PI, Sector
from cuboid import Cuboid
from cubes import stack, box_cells


class GcEp116(ConceptScene):
    EP_NO = 116
    EP_TITLE = "원의 넓이"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("잘라서 붙이면")
        n, r = 16, 1.3
        pie = VGroup(*[Sector(radius=r, start_angle=2 * PI * k / n, angle=2 * PI / n, fill_color=ORANGE if k < n // 2 else BLUE, fill_opacity=0.7, stroke_color=INK, stroke_width=2).move_arc_center_to([-4.2, 0.6, 0]) for k in range(n)])
        self.say("원을 잘게 잘라요", "원을 피자처럼 잘게 잘라 볼까요?")
        self.play(FadeIn(pie), run_time=0.6)
        w = 2 * PI * r / n
        row = VGroup()
        for k in range(n):
            s = Sector(radius=r, start_angle=PI / 2 - PI / n if k % 2 == 0 else -PI / 2 - PI / n, angle=2 * PI / n, fill_color=ORANGE if k % 2 == 0 else BLUE, fill_opacity=0.7, stroke_color=INK, stroke_width=2)
            s.move_arc_center_to([-1.0 + k * w / 2, -0.7 if k % 2 == 0 else 0.6, 0])
            row.add(s)
        self.say("엇갈려 붙이면 직사각형처럼", "잘라 낸 조각을 위아래로 엇갈려 붙이면 직사각형에 가까운 모양이 돼요. 잘게 자를수록 더 직사각형에 가까워져요.")
        self.play(TransformFromCopy(pie, row), run_time=1.4)
        t = M(f"가로 = {o('원주의 반')} = 반지름 × 3.14 · 세로 = {b('반지름')}", 40).move_to([0, -2.0, 0])
        self.play(FadeIn(t), run_time=0.4)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.5)
        self.step("원의 넓이", [(f"(원의 넓이) = {b('반지름')} × {b('반지름')} × 3.14", 52, 1.2),
                  (f"반지름 5 cm → 5 × 5 × 3.14 = {g('78.5 cm²')}", 48, 0.2)],
                  "반지름 × 반지름 × 3.14", "그래서 원의 넓이는 반지름 곱하기 반지름 곱하기 3.14예요. 반지름이 5센티미터면 78.5제곱센티미터.")
        self.ask("반지름 10 cm인 원의 넓이는?", "넓이는?", "연습해 볼까요? 반지름이 10센티미터인 원의 넓이는?",
                 f"10 × 10 × 3.14 = {g('314 cm²')}", f"{g('314 cm²')}", "10 곱하기 10은 100, 곱하기 3.14는 314제곱센티미터예요.", qsize=60)
        self.closing(f"원을 잘라 붙이면 직사각형처럼\n원의 넓이 = {b('반지름')} × {b('반지름')} × 3.14",
                     next_preview="개념 차근차근 117화 · 직육면체의 겉넓이")
        self.wait(0.5)
