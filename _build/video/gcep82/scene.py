"""「수학 원리 돋보기」 개념 차근차근 82화 — 삼각형 세 각의 합 180°, 사각형 360°

삼각형 세 각을 잘라 이어 붙이면 일직선(180°) / 사각형은 대각선으로 삼각형 2개 → 360° / 연습: 두 각이 50°, 70°이면 나머지
최종: GRADE=c ./make_final.sh 82
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, Line, SurroundingRectangle, TransformFromCopy, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, M, T, b, g, o
from division import clear_stage
from conceptkit import ConceptScene, dot, dots, ten_frame, RED
from items import check_mark, cross_mark
from storykit import book, scroll, show_sources
from conceptkit import poly, regular, right_mark
from manim import Rectangle, Square, Circle, Triangle, Polygon, Angle, Arc, Dot, Ellipse, RoundedRectangle, ORIGIN, PI


class GcEp82(ConceptScene):
    EP_NO = 82
    EP_TITLE = "삼각형 세 각의 합 180°, 사각형 360°"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("삼각형의 세 각")
        A, B, C = np.array([-4.2, -0.6, 0]), np.array([-0.6, -0.6, 0]), np.array([-2.9, 1.8, 0])
        tri = Polygon(A, B, C, fill_color=BLUE, fill_opacity=0.3, stroke_color=INK, stroke_width=5)
        angs = VGroup(Angle(Line(A, B), Line(A, C), radius=0.5, color=ORANGE, stroke_width=8),
                      Angle(Line(B, C), Line(B, A), radius=0.5, color=GREEN, stroke_width=8),
                      Angle(Line(C, A), Line(C, B), radius=0.5, color="#B05FD0", stroke_width=8))
        self.say("삼각형의 세 각을 잘라 붙이면", "삼각형의 세 각을 잘라 한 점에 이어 붙이면 어떻게 될까요?")
        self.play(FadeIn(tri), Create(angs), run_time=0.8)
        line = Line([1.0, -0.3, 0], [5.6, -0.3, 0], color=INK, stroke_width=5)
        p = np.array([3.3, -0.3, 0])
        fan = VGroup(Arc(radius=0.9, start_angle=0, angle=0.9, arc_center=p, color=ORANGE, stroke_width=10),
                     Arc(radius=0.9, start_angle=0.9, angle=1.25, arc_center=p, color="#B05FD0", stroke_width=10),
                     Arc(radius=0.9, start_angle=2.15, angle=PI - 2.15, arc_center=p, color=GREEN, stroke_width=10))
        self.play(Create(line), run_time=0.4)
        self.play(TransformFromCopy(angs, fan), run_time=1.0)
        t = M(f"세 각이 모여 일직선 → {g('180°')}", 50).move_to([3.3, -1.4, 0])
        self.say(f"일직선, {g('180도')}", "세 각이 모이면 일직선이 돼요. 일직선은 180도. 그래서 삼각형 세 각의 크기의 합은 언제나 180도예요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)
        self.section("사각형의 네 각")
        q = poly([(-2.0, -1.0), (1.6, -1.2), (2.2, 1.0), (-1.2, 1.4)], ORANGE).move_to([-1.6, 0.4, 0])
        vs = q.get_vertices()
        diag = Line(vs[0], vs[2], color=INK, stroke_width=4)
        self.say("대각선으로 나누면", "사각형에 대각선을 하나 그으면 삼각형 2개로 나뉘어요.")
        self.play(FadeIn(q), run_time=0.5)
        self.play(Create(diag), run_time=0.5)
        t = M(f"삼각형 2개 → 180° × 2 = {g('360°')}", 50).move_to([3.0, 0.4, 0])
        self.say(f"180° × 2 = {g('360°')}", "삼각형 두 개의 각을 합한 것과 같으니 사각형 네 각의 합은 180도 곱하기 2, 360도예요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)
        self.ask("삼각형의 두 각이 50°, 70°일 때 나머지 한 각은?", "나머지 한 각은?", "연습해 볼까요? 삼각형의 두 각이 50도와 70도일 때 나머지 한 각은 몇 도일까요?",
                 f"180° − 50° − 70° = {g('60°')}", f"{g('60°')}", "180도에서 50도와 70도를 빼면 60도예요.", qsize=48)
        self.closing(f"삼각형 세 각의 합 {g('180°')} · 사각형 네 각의 합 {g('360°')}\n(사각형은 삼각형 2개로 나뉘어요)",
                     next_preview="개념 차근차근 83화 · 삼각형 분류하기")
        self.wait(0.5)
