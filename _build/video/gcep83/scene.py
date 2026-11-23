"""「수학 원리 돋보기」 개념 차근차근 83화 — 삼각형 분류하기

변의 길이로: 이등변삼각형(두 변 같음, 두 각 같음), 정삼각형(세 변 같음, 세 각 60°) / 각의 크기로: 예각삼각형, 직각삼각형, 둔각삼각형
예각(0°보다 크고 90°보다 작음), 둔각(90°보다 크고 180°보다 작음) / 연습
최종: GRADE=c ./make_final.sh 83
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


class GcEp83(ConceptScene):
    EP_NO = 83
    EP_TITLE = "삼각형 분류하기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("변의 길이로")
        iso = poly([(-0.9, -0.8), (0.9, -0.8), (0, 1.2)], BLUE).move_to([-3.0, 0.8, 0])
        equ = regular(3, 1.1, ORANGE).move_to([2.4, 0.8, 0])
        l1 = M(f"{b('이등변삼각형')}\n두 변의 길이가 같아요\n(두 각의 크기도 같아요)", 34).next_to(iso, DOWN, buff=0.3)
        l2 = M(f"{o('정삼각형')}\n세 변의 길이가 같아요\n(세 각이 모두 60°)", 34).next_to(equ, DOWN, buff=0.3)
        self.say("변의 길이로 나누면", "두 변의 길이가 같은 삼각형은 이등변삼각형, 세 변의 길이가 모두 같으면 정삼각형이에요. 정삼각형은 세 각이 모두 60도예요.")
        self.play(FadeIn(iso), FadeIn(l1), run_time=0.5)
        self.play(FadeIn(equ), FadeIn(l2), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.5)
        self.section("각의 크기로")
        ts = VGroup(poly([(-0.9, -0.7), (0.9, -0.7), (0.1, 0.9)], GREEN), poly([(-0.9, -0.7), (0.9, -0.7), (-0.9, 0.9)], BLUE),
                    poly([(-1.2, -0.7), (0.9, -0.7), (-1.7, 0.4)], ORANGE)).arrange(RIGHT, buff=1.2).move_to([0, 1.0, 0])
        names = VGroup(M(f"{g('예각삼각형')}\n세 각이 모두 예각", 32), M(f"{b('직각삼각형')}\n한 각이 직각", 32), M(f"{o('둔각삼각형')}\n한 각이 둔각", 32))
        for n_, t_ in zip(names, ts):
            n_.next_to(t_, DOWN, buff=0.3)
        self.say("각의 크기로 나누면", "세 각이 모두 직각보다 작은 예각이면 예각삼각형, 한 각이 직각이면 직각삼각형, 한 각이 직각보다 큰 둔각이면 둔각삼각형이에요.")
        self.play(LaggedStart(*[FadeIn(VGroup(t_, n_)) for t_, n_ in zip(ts, names)], lag_ratio=0.3), run_time=1.4)
        t = M("예각: 0°보다 크고 90°보다 작은 각 · 둔각: 90°보다 크고 180°보다 작은 각", 32, SOFT).move_to([0, -2.0, 0])
        self.play(FadeIn(t), run_time=0.4)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.5)
        self.ask("세 각이 40°, 40°, 100°인 삼각형은?", "어떤 삼각형일까요?", "연습해 볼까요? 세 각이 40도, 40도, 100도인 삼각형을 변과 각으로 각각 분류해 보세요.",
                 f"두 각이 같아 {b('이등변삼각형')}, 100°가 있어 {o('둔각삼각형')}", "이등변 · 둔각", "두 각이 같으니 이등변삼각형이고, 100도인 둔각이 있으니 둔각삼각형이에요.", qsize=52, asize=46)
        self.closing(f"변으로: {b('이등변삼각형')} · {o('정삼각형')}\n각으로: {g('예각')} · 직각 · 둔각삼각형",
                     next_preview="개념 차근차근 84화 · 수직과 평행")
        self.wait(0.5)
