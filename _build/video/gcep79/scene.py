"""「수학 원리 돋보기」 개념 차근차근 79화 — 직각삼각형·직사각형·정사각형

한 각이 직각인 삼각형(기울어져도) / 네 각이 직각 → 직사각형 / 네 각 직각 + 네 변 같음 → 정사각형 / 정사각형은 직사각형이지만 거꾸로는 아님 / 연습
최종: GRADE=c ./make_final.sh 79
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


class GcEp79(ConceptScene):
    EP_NO = 79
    EP_TITLE = "직각삼각형·직사각형·정사각형"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("직각삼각형")
        t1 = poly([(-1, -0.8), (1.2, -0.8), (-1, 1.0)], BLUE).move_to([-3.0, 0.6, 0])
        t2 = poly([(-1, -0.8), (1.2, -0.8), (-1, 1.0)], BLUE).rotate(0.6).move_to([0.6, 0.6, 0])
        self.say("한 각이 직각인 삼각형", "한 각이 직각인 삼각형을 직각삼각형이라고 해요. 비스듬히 놓여 있어도 직각이 있으면 직각삼각형이에요.")
        self.play(FadeIn(t1), FadeIn(t2), run_time=0.7)
        lab = M(f"{o('직각')}이 하나 → {b('직각삼각형')}", 44).move_to([0, -1.5, 0])
        self.play(FadeIn(lab), run_time=0.4)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.5)
        self.section("직사각형과 정사각형")
        r = Rectangle(width=3.0, height=1.8, fill_color=ORANGE, fill_opacity=0.4, stroke_color=INK, stroke_width=5).move_to([-3.0, 0.8, 0])
        s = Square(1.8, fill_color=GREEN, fill_opacity=0.4, stroke_color=INK, stroke_width=5).move_to([2.4, 0.8, 0])
        l1 = M(f"{o('직사각형')}\n네 각이 모두 직각", 36).next_to(r, DOWN, buff=0.3)
        l2 = M(f"{g('정사각형')}\n네 각 직각 + 네 변 길이가 같음", 36).next_to(s, DOWN, buff=0.3)
        self.say("직사각형과 정사각형", "네 각이 모두 직각인 사각형은 직사각형, 네 각이 모두 직각이고 네 변의 길이도 모두 같으면 정사각형이에요.")
        self.play(FadeIn(r), FadeIn(l1), run_time=0.5)
        self.play(FadeIn(s), FadeIn(l2), run_time=0.5)
        t = M(f"정사각형은 {o('직사각형')}이에요 (거꾸로는 아니에요)", 40).move_to([0, -2.0, 0])
        self.say("정사각형도 직사각형", "정사각형도 네 각이 직각이니 직사각형이에요. 하지만 직사각형이 모두 정사각형은 아니에요.")
        self.play(FadeIn(t), run_time=0.4)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.5)
        self.ask("네 변이 모두 5 cm이고 네 각이 직각인 사각형은?", "어떤 사각형일까요?", "연습해 볼까요? 네 변이 모두 5센티미터이고 네 각이 직각인 사각형의 이름은?",
                 f"{g('정사각형')} (직사각형이기도 해요)", f"{g('정사각형')}", "정사각형이에요. 네 각이 직각이라 직사각형이기도 해요.", qsize=46)
        self.closing(f"{b('직각삼각형')}: 직각이 하나 · {o('직사각형')}: 네 각이 직각\n{g('정사각형')}: 네 각이 직각 + 네 변이 같음",
                     next_preview="개념 차근차근 80화 · 원: 중심·반지름·지름")
        self.wait(0.5)
