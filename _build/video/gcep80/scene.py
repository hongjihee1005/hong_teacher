"""「수학 원리 돋보기」 개념 차근차근 80화 — 원: 중심·반지름·지름

누름 못과 끈으로 원 그리기 → 중심, 반지름(모두 같음), 지름(중심을 지나는 선분, 가장 긴 선분) / 지름 = 반지름 × 2 / 컴퍼스 / 연습
최종: GRADE=c ./make_final.sh 80
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
from manim import Rectangle, Square, Circle, Triangle, Polygon, Angle, Arc, Dot, Ellipse, RoundedRectangle, ORIGIN, PI


class GcEp80(ConceptScene):
    EP_NO = 80
    EP_TITLE = "원: 중심·반지름·지름"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("중심과 반지름")
        c = np.array([-3.6, 0.5, 0])
        circ = Circle(radius=1.5, stroke_color=INK, stroke_width=5).move_to(c)
        cen = Dot(c, radius=0.09, color=ORANGE)
        self.say("한 점에서 같은 거리", "한 점에서 같은 거리에 있는 점들을 이으면 원이 돼요. 가운데 점을 원의 중심이라고 해요.")
        self.play(FadeIn(cen), Create(circ), run_time=1.0)
        rs = VGroup(*[Line(c, c + 1.5 * np.array([np.cos(a), np.sin(a), 0]), color=BLUE, stroke_width=5) for a in (0.3, 1.6, 2.6, 4.0, 5.2)])
        self.play(Create(rs, lag_ratio=0.2), run_time=0.9)
        t = M(f"중심과 원 위의 점을 이은 선분: {b('반지름')}\n반지름은 모두 {b('길이가 같아요')}", 40).move_to([2.9, 0.6, 0])
        self.say(f"{b('반지름')}은 모두 같아요", "중심과 원 위의 한 점을 이은 선분을 반지름이라고 해요. 한 원에서 반지름은 모두 길이가 같아요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)
        self.section("지름")
        c = np.array([-3.6, 0.5, 0])
        circ = Circle(radius=1.5, stroke_color=INK, stroke_width=5).move_to(c)
        d = Line(c + LEFT * 1.5, c + RIGHT * 1.5, color=ORANGE, stroke_width=7)
        ch = Line(c + 1.5 * np.array([np.cos(2.4), np.sin(2.4), 0]), c + 1.5 * np.array([np.cos(0.5), np.sin(0.5), 0]), color=SOFT, stroke_width=4)
        self.play(Create(circ), FadeIn(Dot(c, radius=0.09, color=INK)), run_time=0.6)
        self.say(f"중심을 지나는 {o('지름')}", "원 위의 두 점을 이은 선분 중 중심을 지나는 선분을 지름이라고 해요. 지름은 원 안에 그을 수 있는 가장 긴 선분이에요.")
        self.play(Create(ch), Create(d), run_time=0.8)
        t = M(f"{o('지름')} = 반지름 × 2\n원 안에서 가장 긴 선분", 42).move_to([2.9, 0.6, 0])
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)
        self.ask("반지름이 4 cm인 원의 지름은?", "지름은?", "연습해 볼까요? 반지름이 4센티미터인 원의 지름은 몇 센티미터일까요?",
                 f"4 × 2 = {g('8 cm')}", f"{g('8 cm')}", "지름은 반지름의 2배, 8센티미터예요.", qsize=60)
        self.closing(f"원의 {o('중심')}에서 원 위까지: {b('반지름')}(모두 같아요)\n{g('지름')} = 반지름 × 2, 가장 긴 선분",
                     next_preview="개념 차근차근 81화 · 각도와 각도기, 왜 360°일까?")
        self.wait(0.5)
