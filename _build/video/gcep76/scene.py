"""「수학 원리 돋보기」 개념 차근차근 76화 — 삼각형·사각형·원, 오각형·육각형

곧은 선(변)으로 둘러싸인 도형, 변·꼭짓점 / 삼각형 3, 사각형 4, 오각형 5, 육각형 6 / 원은 꼭짓점·변 없음 / 열려 있으면 도형 아님 / 연습
최종: GRADE=c ./make_final.sh 76
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


class GcEp76(ConceptScene):
    EP_NO = 76
    EP_TITLE = "삼각형·사각형·원, 오각형·육각형"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("변과 꼭짓점")
        t = regular(3, 1.1, BLUE).move_to([-2.4, 0.9, 0])
        self.say("곧은 선 3개로 둘러싸인 도형", "곧은 선 3개로 둘러싸인 도형을 삼각형이라고 해요. 곧은 선을 변, 두 변이 만나는 점을 꼭짓점이라고 해요.")
        self.play(Create(t), run_time=0.8)
        verts = VGroup(*[Dot(p, radius=0.1, color=ORANGE) for p in t.get_vertices()])
        lab = M(f"{b('변')} 3개 · {o('꼭짓점')} 3개", 46).move_to([2.6, 0.9, 0])
        self.play(FadeIn(verts), FadeIn(lab), run_time=0.6)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.5)
        self.section("변의 수로 이름 짓기")
        polys = VGroup(*[regular(n, 0.75, c) for n, c in [(3, BLUE), (4, ORANGE), (5, GREEN), (6, "#B05FD0")]]).arrange(RIGHT, buff=0.8).move_to([0, 1.0, 0])
        names = VGroup(*[M(x, 36) for x in ["삼각형", "사각형", "오각형", "육각형"]])
        for n_, p_ in zip(names, polys):
            n_.next_to(p_, DOWN, buff=0.3)
        self.say("변이 3, 4, 5, 6개", "변이 4개면 사각형, 5개면 오각형, 6개면 육각형이에요. 변의 수와 꼭짓점의 수는 같아요.")
        self.play(LaggedStart(*[FadeIn(VGroup(p_, n_)) for p_, n_ in zip(polys, names)], lag_ratio=0.3), run_time=1.4)
        c = Circle(radius=0.6, stroke_color=INK, stroke_width=5).move_to([-2.0, -1.4, 0])
        t2 = M("원: 굽은 선, 변·꼭짓점이 없어요", 36).next_to(c, RIGHT, buff=0.4)
        self.play(FadeIn(c), FadeIn(t2), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)
        self.ask("변이 5개인 도형은? 꼭짓점은 몇 개?", "변이 5개면?", "연습해 볼까요? 변이 5개인 도형의 이름과 꼭짓점의 수를 말해 보세요.",
                 f"{g('오각형')}, 꼭짓점 {g('5개')}", f"{g('오각형')}, 5개", "변이 5개면 오각형, 꼭짓점도 5개예요.", qsize=56)
        self.closing(f"{b('변')}의 수로 이름: 삼각형 · 사각형 · 오각형\n원은 {o('꼭짓점')}과 변이 없어요",
                     next_preview="개념 차근차근 77화 · 선분·직선·반직선과 『원론』")
        self.wait(0.5)
