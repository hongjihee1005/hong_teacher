"""「수학 원리 돋보기」 개념 차근차근 113화 — 삼각형의 넓이

똑같은 삼각형 2개를 붙이면 평행사변형 → 삼각형은 그 절반 → (밑변) × (높이) ÷ 2 / 높이는 꼭짓점에서 밑변에 수직 / 연습
최종: GRADE=c ./make_final.sh 113
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


class GcEp113(ConceptScene):
    EP_NO = 113
    EP_TITLE = "삼각형의 넓이"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("두 개를 붙이면")
        A, B, C = [-3.5, -1.0], [0.5, -1.0], [-2.3, 1.2]
        t1 = poly([A, B, C], BLUE, 0.45)
        h = DashedLine([-2.3, 1.2, 0], [-2.3, -1.0, 0], color=ORANGE)
        self.say("삼각형의 밑변과 높이", "삼각형의 한 변을 밑변, 마주 보는 꼭짓점에서 밑변에 수직으로 내린 선분의 길이를 높이라고 해요.")
        self.play(FadeIn(t1), Create(h), run_time=0.7)
        t2 = poly([B, [1.7, 1.2], C], GREEN, 0.45)
        self.say("똑같은 삼각형을 붙이면 평행사변형", "똑같은 삼각형 하나를 돌려 붙이면 평행사변형이 돼요. 그러니까 삼각형은 평행사변형의 절반이에요.")
        self.play(FadeIn(t2), run_time=0.8)
        t = M(f"평행사변형의 {o('절반')} → (밑변) × (높이) {o('÷ 2')}", 46).move_to([0, -2.0, 0])
        self.play(FadeIn(t), run_time=0.4)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)
        self.step("삼각형의 넓이", [(f"(삼각형의 넓이) = (밑변) × (높이) ÷ {o('2')}", 52, 1.2),
                  (f"밑변 6 cm, 높이 4 cm → 6 × 4 ÷ 2 = {g('12 cm²')}", 48, 0.2)],
                  "밑변 × 높이 ÷ 2", "삼각형의 넓이는 밑변 곱하기 높이 나누기 2예요. 밑변 6, 높이 4면 12제곱센티미터.")
        self.ask("밑변 10 cm, 높이 7 cm인 삼각형의 넓이는?", "넓이는?", "연습해 볼까요? 밑변 10센티미터, 높이 7센티미터인 삼각형의 넓이는?",
                 f"10 × 7 ÷ 2 = {g('35 cm²')}", f"{g('35 cm²')}", "10 곱하기 7은 70, 2로 나누면 35제곱센티미터예요.", qsize=52)
        self.closing(f"똑같은 삼각형 2개 = 평행사변형\n삼각형의 넓이 = 밑변 × 높이 {o('÷ 2')}",
                     next_preview="개념 차근차근 114화 · 사다리꼴·마름모의 넓이")
        self.wait(0.5)
