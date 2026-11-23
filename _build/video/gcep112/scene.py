"""「수학 원리 돋보기」 개념 차근차근 112화 — 평행사변형의 넓이

밑변·높이(두 밑변 사이 거리) / 한쪽 삼각형을 잘라 옮기면 직사각형 → (밑변) × (높이) / 밑변·높이가 같으면 모양이 달라도 넓이가 같음 / 연습
최종: GRADE=c ./make_final.sh 112
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


class GcEp112(ConceptScene):
    EP_NO = 112
    EP_TITLE = "평행사변형의 넓이"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("잘라서 옮기면")
        A, B, C, D = [-3.5, -1.0], [0.5, -1.0], [1.7, 1.2], [-2.3, 1.2]
        par = poly([A, B, C, D], ORANGE, 0.35)
        h = DashedLine([-2.3, 1.2, 0], [-2.3, -1.0, 0], color=BLUE)
        self.say("평행사변형의 밑변과 높이", "평행사변형의 아래 변을 밑변, 두 밑변 사이의 거리를 높이라고 해요.")
        self.play(FadeIn(par), Create(h), run_time=0.7)
        tri = poly([A, [-2.3, -1.0], D], GREEN, 0.6)
        self.say("왼쪽 삼각형을 잘라 오른쪽으로", "높이를 따라 왼쪽 삼각형을 잘라 오른쪽으로 옮기면 직사각형이 돼요.")
        self.play(FadeIn(tri), run_time=0.4)
        self.play(tri.animate.shift(RIGHT * 4.0), run_time=1.2)
        t = M(f"직사각형이 되었어요 → {o('밑변')} × {b('높이')}", 46).move_to([0, -2.0, 0])
        self.play(FadeIn(t), run_time=0.4)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)
        self.step("평행사변형의 넓이", [(f"(평행사변형의 넓이) = ({o('밑변')}) × ({b('높이')})", 50, 1.3),
                  (f"밑변 8 cm, 높이 5 cm → 8 × 5 = {g('40 cm²')}", 48, 0.3),
                  ("밑변과 높이가 같으면 기울어져도 넓이가 같아요", 40, -0.7)],
                  "밑변 × 높이", "그래서 평행사변형의 넓이는 밑변 곱하기 높이예요. 밑변 8, 높이 5면 40제곱센티미터. 밑변과 높이가 같으면 기울어진 정도가 달라도 넓이가 같아요.")
        self.ask("밑변 9 cm, 높이 4 cm인 평행사변형의 넓이는?", "넓이는?", "연습해 볼까요? 밑변 9센티미터, 높이 4센티미터인 평행사변형의 넓이는?",
                 f"9 × 4 = {g('36 cm²')}", f"{g('36 cm²')}", "9 곱하기 4, 36제곱센티미터예요.", qsize=52)
        self.closing(f"평행사변형을 잘라 옮기면 직사각형\n넓이 = {o('밑변')} × {b('높이')}",
                     next_preview="개념 차근차근 113화 · 삼각형의 넓이")
        self.wait(0.5)
