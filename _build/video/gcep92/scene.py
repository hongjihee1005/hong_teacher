"""「수학 원리 돋보기」 개념 차근차근 92화 — 전개도

정육면체를 모서리를 따라 잘라 펼친 그림 = 전개도(정사각형 6개) / 여러 가지 모양이 있음 / 접었을 때 겹치는 면이 있으면 전개도 아님 / 연습
최종: GRADE=c ./make_final.sh 92
"""
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
from manim import Rectangle, Square, Circle, Polygon, Dot, PI
from cuboid import Cuboid
from solid import prism, pyramid, regular as sreg
from round3d import cylinder, cone, sphere
from cubes import stack, heights_cells, flat, top_view, front_view, side_view


def net(cells, s=0.75, color=ORANGE):
    return VGroup(*[Square(s, fill_color=color, fill_opacity=0.5, stroke_color=INK, stroke_width=4).move_to([c * s, -r * s, 0]) for r, c in cells])


class GcEp92(ConceptScene):
    EP_NO = 92
    EP_TITLE = "전개도"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("펼친 그림")
        c = Cuboid(1.8, 1.8, 1.6, [-4.0, 0.4, 0])
        C = VGroup(c.face("front", ORANGE, 0.35), c.face("top", ORANGE, 0.2), c.face("right", ORANGE, 0.28), c.edges())
        n1 = net([(0, 1), (1, 0), (1, 1), (1, 2), (1, 3), (2, 1)]).move_to([2.0, 0.5, 0])
        self.say("정육면체 상자를 펼치면", "정육면체 상자를 모서리를 따라 잘라 펼치면 정사각형 6개가 이어진 그림이 돼요. 이것을 전개도라고 해요.")
        self.play(FadeIn(C), run_time=0.5)
        self.play(TransformFromCopy(C, n1), run_time=1.2)
        t = M(f"정사각형 {g('6개')} → 정육면체의 {g('전개도')}", 44).move_to([0, -1.9, 0])
        self.play(FadeIn(t), run_time=0.4)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.5)
        self.section("전개도일까?")
        a = net([(0, 0), (1, 0), (1, 1), (1, 2), (2, 2), (2, 3)], color=BLUE).move_to([-3.2, 0.4, 0])
        b2 = net([(0, 0), (0, 1), (1, 1), (1, 2), (1, 3), (0, 3)], color="#E2574C").move_to([2.8, 0.4, 0])
        self.say("접으면 상자가 될까?", "왼쪽과 오른쪽 그림을 접으면 정육면체가 될까요? 왼쪽은 되고, 오른쪽은 접으면 두 면이 겹쳐서 전개도가 아니에요.")
        self.play(FadeIn(a), FadeIn(b2), run_time=0.6)
        lb = M(f"{o('겹치는 면')} → 전개도 아님", 40).next_to(b2, DOWN, buff=0.4)
        la = M(f"{g('전개도예요')}", 40).next_to(a, DOWN, buff=0.4)
        self.play(FadeIn(la), FadeIn(lb), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)
        self.ask("정육면체 전개도의 면은 몇 개? 모양은?", "면의 수와 모양은?", "연습해 볼까요? 정육면체의 전개도에는 면이 몇 개 있고, 어떤 모양일까요?",
                 f"{g('정사각형 6개')}", f"{g('정사각형 6개')}", "정사각형 6개예요. 이어 붙인 모양은 여러 가지가 될 수 있어요.", qsize=56)
        self.closing(f"입체도형을 모서리를 따라 잘라 펼친 그림: {g('전개도')}\n접었을 때 겹치는 면이 없어야 해요",
                     next_preview="개념 차근차근 93화 · 각기둥")
        self.wait(0.5)
