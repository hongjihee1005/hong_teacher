"""「수학 원리 돋보기」 개념 차근차근 118화 — 부피, 1 cm³와 1 m³

부피 = 공간을 차지하는 크기 / 한 모서리 1 cm 정육면체의 부피 1 cm³ / 쌓기: 가로 4 × 세로 3 × 높이 2 = 24 cm³ → (가로) × (세로) × (높이)
1 m³ = 1000000 cm³ / 연습
최종: GRADE=c ./make_final.sh 118
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
from manim import Rectangle, Square, Circle, Polygon, Dot, DashedLine, PI, Sector
from cuboid import Cuboid
from cubes import stack, box_cells


class GcEp118(ConceptScene):
    EP_NO = 118
    EP_TITLE = "부피, 1 cm³와 1 m³"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("1 cm³로 쌓기")
        st = stack(box_cells(4, 2, 3), s=0.5, center=(-3.0, 0.4, 0))
        self.say("한 모서리 1 cm인 정육면체", "공간을 차지하는 크기를 부피라고 해요. 한 모서리가 1센티미터인 정육면체의 부피를 1세제곱센티미터라고 해요.")
        self.play(FadeIn(st, lag_ratio=0.02), run_time=1.2)
        t = M(f"한 층: 가로 {o('4')} × 세로 {b('3')} = 12개\n{g('2층')} → 12 × 2 = {g('24 cm³')}", 42).move_to([2.6, 0.8, 0])
        self.say(f"4 × 3 × 2 = {g('24')}", "한 층에 4개씩 3줄, 12개. 2층이니 24개. 부피는 24세제곱센티미터예요.")
        self.play(FadeIn(t), run_time=0.5)
        t2 = M(f"부피 = {o('가로')} × {b('세로')} × {g('높이')}", 48).move_to([0, -1.6, 0])
        self.play(FadeIn(t2), run_time=0.4)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.5)
        self.step("1 m³", [(f"한 모서리 1 m인 정육면체: {o('1 m³')}", 50, 1.3),
                  (f"100 × 100 × 100 = {g('1000000 cm³')}", 50, 0.3)],
                  "1 m³ = 1000000 cm³", "한 모서리가 1미터인 정육면체의 부피는 1세제곱미터. 100 곱하기 100 곱하기 100, 100만 세제곱센티미터예요.")
        self.ask("가로 5 cm, 세로 4 cm, 높이 3 cm인 직육면체의 부피는?", "부피는?", "연습해 볼까요? 가로 5, 세로 4, 높이 3센티미터인 직육면체의 부피는?",
                 f"5 × 4 × 3 = {g('60 cm³')}", f"{g('60 cm³')}", "5 곱하기 4 곱하기 3, 60세제곱센티미터예요.", qsize=48)
        self.closing(f"부피 = {o('가로')} × {b('세로')} × {g('높이')}\n1 m³ = 1000000 cm³",
                     next_preview="개념 차근차근 119화 · 분류하기")
        self.wait(0.5)
