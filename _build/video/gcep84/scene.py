"""「수학 원리 돋보기」 개념 차근차근 84화 — 수직과 평행

두 직선이 직각으로 만나면 수직, 한 직선을 다른 직선의 수선 / 한 직선에 수직인 두 직선은 서로 만나지 않음 → 평행, 평행선 / 평행선 사이의 거리는 어디서나 같음
생활: 횡단보도·사다리 / 연습
최종: GRADE=c ./make_final.sh 84
"""
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
from conceptkit import poly, regular, right_mark
from manim import Rectangle, Square, Circle, Triangle, Polygon, Angle, Arc, Dot, Ellipse, RoundedRectangle, ORIGIN, PI


class GcEp84(ConceptScene):
    EP_NO = 84
    EP_TITLE = "수직과 평행"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("수직")
        h = Line([-5.2, 0.0, 0], [-0.8, 0.0, 0], color=INK, stroke_width=6)
        v = Line([-3.0, -1.6, 0], [-3.0, 1.9, 0], color=BLUE, stroke_width=6)
        rm = right_mark([-3.0, 0.0, 0], (1, 0, 0), (0, 1, 0), s=0.35, color=ORANGE)
        self.say("직각으로 만나면 수직", "두 직선이 만나서 이루는 각이 직각일 때, 두 직선은 서로 수직이라고 해요. 한 직선을 다른 직선의 수선이라고 해요.")
        self.play(Create(h), Create(v), run_time=0.7)
        self.play(Create(rm), run_time=0.4)
        t = M(f"직각으로 만나요 → {b('수직')}\n파란 선은 검은 선의 {b('수선')}", 40).move_to([3.0, 0.6, 0])
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)
        self.section("평행")
        base = Line([-5.2, -1.4, 0], [-0.6, -1.4, 0], color=SOFT, stroke_width=4)
        p1 = Line([-4.2, -1.8, 0], [-4.2, 1.9, 0], color=ORANGE, stroke_width=6)
        p2 = Line([-1.8, -1.8, 0], [-1.8, 1.9, 0], color=ORANGE, stroke_width=6)
        self.say("한 직선에 수직인 두 직선", "한 직선에 수직인 두 직선을 그으면, 두 직선은 아무리 늘여도 서로 만나지 않아요. 이런 두 직선을 평행하다고 해요.")
        self.play(Create(base), run_time=0.4)
        self.play(Create(p1), Create(p2), run_time=0.7)
        dist = VGroup(*[Line([-4.2, y, 0], [-1.8, y, 0], color=GREEN, stroke_width=4) for y in (1.2, 0.0, -1.0)])
        t = M(f"만나지 않는 두 직선: {o('평행선')}\n평행선 사이의 거리는 {g('어디서나 같아요')}", 40).move_to([2.6, 0.6, 0])
        self.play(Create(dist, lag_ratio=0.3), run_time=0.8)
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)
        self.ask("사다리의 가로 막대끼리는? 세로 기둥과 가로 막대는?", "수직일까 평행일까?", "연습해 볼까요? 사다리에서 가로 막대끼리는 어떤 관계일까요? 세로 기둥과 가로 막대는요?",
                 f"가로 막대끼리 {o('평행')} · 기둥과 막대 {b('수직')}", "평행, 수직", "가로 막대끼리는 서로 만나지 않으니 평행, 세로 기둥과 가로 막대는 직각으로 만나니 수직이에요.", qsize=46, asize=48)
        self.closing(f"직각으로 만나는 두 직선: {b('수직')}\n만나지 않는 두 직선: {o('평행')} (거리가 어디서나 같아요)",
                     next_preview="개념 차근차근 85화 · 사다리꼴·평행사변형·마름모")
        self.wait(0.5)
