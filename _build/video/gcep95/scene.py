"""「수학 원리 돋보기」 개념 차근차근 95화 — 원기둥

두 밑면이 평행하고 합동인 원, 옆면은 굽은 면 / 높이 / 전개도: 원 2개 + 직사각형(가로 = 밑면의 둘레, 세로 = 높이) / 각기둥과 비교 / 연습
최종: GRADE=c ./make_final.sh 95
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
from manim import Rectangle, Square, Circle, Polygon, Dot, PI
from cuboid import Cuboid
from round3d import cylinder, cone, sphere
from cubes import stack, heights_cells


class GcEp95(ConceptScene):
    EP_NO = 95
    EP_TITLE = "원기둥"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("원기둥")
        cy = cylinder(1.0, 2.2, center=(-3.4, 0.4, 0))
        self.say("밑면이 원인 기둥", "통조림처럼 두 밑면이 서로 평행하고 합동인 원이고, 옆면이 굽은 면인 입체도형을 원기둥이라고 해요.")
        self.play(FadeIn(cy), run_time=0.7)
        t = M(f"두 밑면: {b('평행·합동인 원')}\n옆면: {o('굽은 면')}\n두 밑면 사이의 거리: {g('높이')}", 40).move_to([2.4, 0.6, 0])
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)
        self.section("원기둥의 전개도")
        rect = Rectangle(width=4.4, height=1.8, fill_color=ORANGE, fill_opacity=0.4, stroke_color=INK, stroke_width=4).move_to([0.6, 0.4, 0])
        c1 = Circle(radius=0.7, fill_color=BLUE, fill_opacity=0.4, stroke_color=INK, stroke_width=4).next_to(rect, UP, buff=0)
        c2 = Circle(radius=0.7, fill_color=BLUE, fill_opacity=0.4, stroke_color=INK, stroke_width=4).next_to(rect, DOWN, buff=0)
        self.say("펼치면 원 2개와 직사각형", "원기둥을 펼치면 원 2개와 직사각형 1개가 돼요. 옆면이 직사각형으로 펼쳐져요.")
        self.play(FadeIn(rect), FadeIn(c1), FadeIn(c2), run_time=0.8)
        la = M(f"가로 = {o('밑면의 둘레')}", 34).next_to(rect, LEFT, buff=0.3).shift(UP * 0.3)
        lb = M(f"세로 = {g('높이')}", 34).next_to(rect, LEFT, buff=0.3).shift(DOWN * 0.3)
        self.say("가로는 밑면의 둘레", "직사각형의 가로는 밑면인 원의 둘레와 같고, 세로는 원기둥의 높이와 같아요.")
        self.play(FadeIn(la), FadeIn(lb), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)
        self.ask("원기둥과 각기둥의 다른 점은?", "다른 점은?", "연습해 볼까요? 원기둥과 각기둥은 무엇이 다를까요?",
                 f"밑면이 {b('원')} / {o('다각형')}, 옆면이 {b('굽은 면')} / {o('직사각형')}", "밑면과 옆면", "원기둥은 밑면이 원이고 옆면이 굽은 면, 각기둥은 밑면이 다각형이고 옆면이 직사각형이에요. 원기둥에는 꼭짓점과 모서리가 없어요.", qsize=60, asize=44)
        self.closing(f"밑면이 {b('원')} 2개, 옆면이 {o('굽은 면')}: 원기둥\n전개도: 원 2개 + 직사각형(가로 = 밑면의 둘레)",
                     next_preview="개념 차근차근 96화 · 원뿔과 구")
        self.wait(0.5)
