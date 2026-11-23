"""「수학 원리 돋보기」 개념 차근차근 91화 — 직육면체와 정육면체

직사각형 6개로 둘러싸인 직육면체(면 6·모서리 12·꼭짓점 8) / 정사각형 6개 → 정육면체 / 겨냥도(보이지 않는 모서리 점선) / 마주 보는 면 평행 / 연습
최종: GRADE=c ./make_final.sh 91
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
from solid import prism, pyramid, regular as sreg
from round3d import cylinder, cone, sphere
from cubes import stack, heights_cells, flat, top_view, front_view, side_view


class GcEp91(ConceptScene):
    EP_NO = 91
    EP_TITLE = "직육면체와 정육면체"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("직육면체")
        a = Cuboid(2.8, 1.6, 2.0, [-3.2, 0.4, 0])
        A = VGroup(a.face("front", ORANGE, 0.35), a.face("top", ORANGE, 0.2), a.face("right", ORANGE, 0.28), a.edges())
        self.say("직사각형 6개로 둘러싸인 도형", "직사각형 6개로 둘러싸인 도형을 직육면체라고 해요. 상자 모양이에요.")
        self.play(FadeIn(A), run_time=0.8)
        t = M(f"면 {b('6')} · 모서리 {o('12')} · 꼭짓점 {g('8')}\n안 보이는 모서리는 점선 (겨냥도)", 40).move_to([2.6, 0.8, 0])
        self.say("면 6, 모서리 12, 꼭짓점 8", "면은 6개, 면과 면이 만나는 모서리는 12개, 모서리가 만나는 꼭짓점은 8개예요. 보이지 않는 모서리를 점선으로 그린 그림을 겨냥도라고 해요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)
        self.section("정육면체")
        c = Cuboid(2.0, 2.0, 2.0, [-3.0, 0.3, 0])
        C = VGroup(c.face("front", GREEN, 0.35), c.face("top", GREEN, 0.2), c.face("right", GREEN, 0.28), c.edges())
        self.say("정사각형 6개로 둘러싸이면", "정사각형 6개로 둘러싸인 도형은 정육면체예요. 주사위 모양이에요. 정육면체도 직육면체라고 할 수 있어요.")
        self.play(FadeIn(C), run_time=0.8)
        t = M(f"정사각형 6개 → {g('정육면체')}\n정육면체는 직육면체예요\n마주 보는 면끼리는 평행해요 (3쌍)", 40).move_to([2.6, 0.6, 0])
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)
        self.ask("직육면체에서 한 면과 평행한 면은 몇 개?", "평행한 면은?", "연습해 볼까요? 직육면체에서 한 면과 평행한 면은 몇 개일까요?",
                 f"마주 보는 면 {g('1개')} (수직인 면은 4개)", f"{g('1개')}", "마주 보는 면 하나와 평행해요. 이웃한 면 4개와는 수직이에요.", qsize=52)
        self.closing(f"{o('직육면체')}: 직사각형 6개 · {g('정육면체')}: 정사각형 6개\n면 6 · 모서리 12 · 꼭짓점 8",
                     next_preview="개념 차근차근 92화 · 전개도")
        self.wait(0.5)
