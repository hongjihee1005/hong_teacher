"""「수학 원리 돋보기」 개념 차근차근 89화 — 선대칭도형

한 직선을 따라 접으면 완전히 겹치는 도형, 그 직선이 대칭축 / 대칭축이 여러 개(정사각형 4, 원 무수히) / 대응점을 이은 선분은 대칭축과 수직으로 만나고 둘로 똑같이 나뉨
연습: 정삼각형의 대칭축 수
최종: GRADE=c ./make_final.sh 89
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, Line, SurroundingRectangle, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, M, T, b, g, o
from division import clear_stage
from conceptkit import ConceptScene, dot, dots, ten_frame, RED
from items import check_mark, cross_mark
from storykit import book, scroll, show_sources
from conceptkit import poly, regular, right_mark
from manim import Rectangle, Square, Circle, Triangle, Polygon, Angle, Arc, Dot, DashedLine, Rotate, PI


class GcEp89(ConceptScene):
    EP_NO = 89
    EP_TITLE = "선대칭도형"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("접으면 겹치는 도형")
        h = poly([(0, -1.2), (-1.3, 0.2), (-0.7, 1.1), (0, 0.5), (0.7, 1.1), (1.3, 0.2)], "#E2574C", 0.6).move_to([-3.0, 0.5, 0])
        ax = DashedLine(h.get_top() + UP * 0.4, h.get_bottom() + DOWN * 0.4, color=INK).move_to(h.get_center())
        ax.set_x(h.get_center()[0])
        self.say("하트를 반으로 접으면", "하트를 가운데 선을 따라 접으면 양쪽이 완전히 겹쳐요. 이런 도형을 선대칭도형, 접은 선을 대칭축이라고 해요.")
        self.play(FadeIn(h), run_time=0.4)
        self.play(Create(ax), run_time=0.5)
        t = M(f"{g('선대칭도형')}: 접으면 완전히 겹쳐요\n접는 선: {o('대칭축')}", 42).move_to([2.8, 0.6, 0])
        self.play(FadeIn(t), run_time=0.4)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.5)
        self.section("대칭축이 여러 개")
        sq = Square(2.0, fill_color=BLUE, fill_opacity=0.35, stroke_color=INK, stroke_width=5).move_to([-3.0, 0.5, 0])
        axes = VGroup(*[DashedLine(sq.get_center() + 1.5 * np.array([np.cos(a), np.sin(a), 0]), sq.get_center() - 1.5 * np.array([np.cos(a), np.sin(a), 0]), color=ORANGE) for a in (0, PI / 4, PI / 2, 3 * PI / 4)])
        self.say("정사각형은 대칭축이 4개", "정사각형은 가로, 세로, 두 대각선을 따라 접어도 겹쳐요. 대칭축이 4개예요. 원은 중심을 지나는 어느 직선으로 접어도 겹쳐서 대칭축이 셀 수 없이 많아요.")
        self.play(FadeIn(sq), Create(axes, lag_ratio=0.3), run_time=1.0)
        t = M(f"정사각형 {g('4개')}\n원은 {g('셀 수 없이 많아요')}", 42).move_to([2.6, 0.5, 0])
        self.play(FadeIn(t), run_time=0.4)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.5)
        self.ask("정삼각형의 대칭축은 몇 개?", "대칭축은 몇 개?", "연습해 볼까요? 정삼각형의 대칭축은 몇 개일까요?",
                 f"꼭짓점에서 마주 보는 변의 가운데로 → {g('3개')}", f"{g('3개')}", "각 꼭짓점에서 마주 보는 변의 가운데를 지나는 선, 3개예요.", qsize=60)
        self.closing(f"한 직선으로 접어 완전히 겹치면 {g('선대칭도형')}\n그 직선이 {o('대칭축')} (정사각형 4개, 원은 셀 수 없이)",
                     next_preview="개념 차근차근 90화 · 점대칭도형")
        self.wait(0.5)
