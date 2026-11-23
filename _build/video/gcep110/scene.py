"""「수학 원리 돋보기」 개념 차근차근 110화 — 직사각형·정사각형의 넓이

가로 5 cm, 세로 3 cm → 한 줄에 5개씩 3줄 = 5 × 3 = 15 cm² → (가로) × (세로) / 정사각형 (한 변) × (한 변) / 연습
최종: GRADE=c ./make_final.sh 110
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


class GcEp110(ConceptScene):
    EP_NO = 110
    EP_TITLE = "직사각형·정사각형의 넓이"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("왜 가로 × 세로일까?")
        g_ = VGroup(*[Square(0.7, fill_color=BLUE, fill_opacity=0.35, stroke_color=INK, stroke_width=3).move_to([c * 0.7, -r * 0.7, 0]) for r in range(3) for c in range(5)]).move_to([-2.6, 0.6, 0])
        self.say("1 cm²가 몇 개일까요?", "가로 5센티미터, 세로 3센티미터인 직사각형에 1제곱센티미터를 채워 볼까요?")
        self.play(FadeIn(g_, lag_ratio=0.03), run_time=1.0)
        t = M(f"한 줄에 {o('5개')}씩 {b('3줄')}\n→ 5 × 3 = {g('15 cm²')}", 46).move_to([3.0, 0.8, 0])
        self.say(f"5 × 3 = {g('15')}", "한 줄에 5개씩 3줄이니 5 곱하기 3, 15제곱센티미터. 그래서 직사각형의 넓이는 가로 곱하기 세로예요.")
        self.play(FadeIn(t), run_time=0.5)
        t2 = M(f"직사각형: {o('가로')} × {b('세로')} · 정사각형: 한 변 × 한 변", 42).move_to([0, -1.6, 0])
        self.play(FadeIn(t2), run_time=0.4)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.5)
        self.ask("한 변이 6 cm인 정사각형의 넓이는?", "넓이는?", "연습해 볼까요? 한 변이 6센티미터인 정사각형의 넓이는?",
                 f"6 × 6 = {g('36 cm²')}", f"{g('36 cm²')}", "6 곱하기 6, 36제곱센티미터예요.", qsize=60)
        self.closing(f"직사각형의 넓이 = {o('가로')} × {b('세로')}\n정사각형의 넓이 = 한 변 × 한 변",
                     next_preview="개념 차근차근 111화 · 1 m²와 1 km²")
        self.wait(0.5)
