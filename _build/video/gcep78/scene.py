"""「수학 원리 돋보기」 개념 차근차근 78화 — 각과 직각

한 점에서 그은 두 반직선 → 각(꼭짓점·변), 각 ㄱㄴㄷ / 종이를 두 번 접어 직각 만들기 / 직각 표시 / 생활 속 직각(책 모서리) / 연습
최종: GRADE=c ./make_final.sh 78
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


class GcEp78(ConceptScene):
    EP_NO = 78
    EP_TITLE = "각과 직각"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("각")
        v = np.array([-1.5, 0.0, 0])
        r1 = Line(v, v + np.array([3.6, 0, 0]), color=BLUE, stroke_width=6)
        r2 = Line(v, v + np.array([2.4, 2.0, 0]), color=BLUE, stroke_width=6)
        ang = Angle(r1, r2, radius=0.6, color=ORANGE, stroke_width=5)
        self.say("한 점에서 그은 두 반직선", "한 점에서 그은 두 반직선으로 이루어진 도형을 각이라고 해요.")
        self.play(Create(r1), Create(r2), run_time=0.8)
        self.play(Create(ang), run_time=0.4)
        labs = VGroup(M("ㄴ", 40).next_to(v, DOWN + LEFT, buff=0.15), M("ㄷ", 40).next_to(r1.get_end(), DOWN, buff=0.15), M("ㄱ", 40).next_to(r2.get_end(), UP, buff=0.15))
        t = M(f"각 ㄱㄴㄷ · 꼭짓점 {o('ㄴ')} · 변 ㄴㄱ, ㄴㄷ", 42).move_to([0, -1.4, 0])
        self.say("각 ㄱㄴㄷ", "이 각을 각 기역 니은 디귿이라고 읽어요. 가운데 점 니은이 꼭짓점이고, 두 반직선이 변이에요.")
        self.play(FadeIn(labs), FadeIn(t), run_time=0.6)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)
        self.section("직각")
        c = np.array([-1.0, -0.6, 0])
        a1 = Line(c, c + np.array([3.0, 0, 0]), color=INK, stroke_width=6)
        a2 = Line(c, c + np.array([0, 2.6, 0]), color=INK, stroke_width=6)
        rm = right_mark(c, (1, 0, 0), (0, 1, 0), s=0.35, color=ORANGE)
        self.say("종이를 두 번 접으면", "종이를 반으로 접고, 접힌 선끼리 맞추어 한 번 더 접으면 반듯한 모서리가 생겨요. 이런 각을 직각이라고 해요.")
        self.play(Create(a1), Create(a2), run_time=0.7)
        self.play(Create(rm), run_time=0.4)
        t = M(f"{o('직각')}: 종이를 두 번 접어 만든 각\n직각은 ㄴ 모양으로 표시해요", 40).move_to([3.4, 0.6, 0])
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)
        self.ask("주변에서 직각을 찾아보세요", "직각을 찾아요", "연습해 볼까요? 교실에서 직각을 찾아 보세요.",
                 f"책 모서리 · 칠판 모서리 · 공책 귀퉁이 → {g('직각')}", "직각", "책 모서리, 칠판 모서리, 공책 귀퉁이처럼 반듯한 모서리가 직각이에요.", qsize=56, asize=48)
        self.closing(f"한 점에서 그은 두 반직선: {b('각')}  (꼭짓점 · 변)\n종이를 두 번 접은 반듯한 각: {o('직각')}",
                     next_preview="개념 차근차근 79화 · 직각삼각형·직사각형·정사각형")
        self.wait(0.5)
