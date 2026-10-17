"""「수학 원리 돋보기」 6학년 56화 — 원주는 지름의 몇 배? (6-2 5단원 2차시, 화 코드 6-2-5-a)

원의 둘레 = 원주
반지름 1 cm인 원: 원 안의 정육각형 둘레 6 cm = 지름 2 cm의 3배, 원 밖의 정사각형 둘레 8 cm = 지름의 4배
원주는 정육각형 둘레보다 길고 정사각형 둘레보다 짧음 → 지름의 3배보다 길고 4배보다 짧음
최종: GRADE=6 ./make_final.sh 56
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, PI, RIGHT, TAU, UP, Circle, Create, DashedLine, Dot, FadeIn, FadeOut, Indicate,
                   LaggedStart, Line, Polygon, RegularPolygon, Square, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage

R = 1.8
C = np.array([-3.2, 0.1, 0])


class G6Ep56(EpisodeScene):
    GRADE, SEM = 6, 2
    EP_NO = 56
    EP_TITLE = "원주는 지름의 몇 배?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.bounds()
        self.closing(f"원의 둘레를 {o('원주')}라고 해요\n원주는 지름의 {b('3배')}보다 길고 {b('4배')}보다 짧아요",
                     next_preview="6학년 57화 · 원주율")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("원의 둘레는 지름의 몇 배쯤일까요?", 46).move_to([0.6, 2.2, 0])
        self.say("원의 둘레는 지름의 몇 배?", "원의 둘레를 원주라고 해요. 원주는 지름의 몇 배쯤일까요?")
        self.play(Write(q), run_time=0.8)
        c = Circle(radius=1.4, color=ORANGE, stroke_width=7).move_to([0, -0.5, 0])
        d = Line(c.get_left(), c.get_right(), color=BLUE, stroke_width=6)
        self.play(Create(c), Create(d), run_time=0.8)
        self.play(FadeIn(M(o("원주"), 34).next_to(c, UP, buff=0.1)), FadeIn(M(b("지름"), 30).next_to(d, DOWN, buff=0.1)), run_time=0.4)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def bounds(self):
        self.section("두 도형 사이에 끼우기")
        circ = Circle(radius=R, color=ORANGE, stroke_width=7).move_to(C)
        rr = Line(C, C + RIGHT * R, color=INK, stroke_width=4)
        rl = M("반지름 1 cm", 26).next_to(rr, DOWN, buff=0.08)
        self.play(Create(circ), Create(rr), FadeIn(rl), run_time=0.7)
        hexa = RegularPolygon(n=6, start_angle=0, color=BLUE, stroke_width=6).scale(R).move_to(C)
        t1 = M(f"원 안의 정육각형: 둘레 {b('6 cm')}\n= 지름 2 cm의 {b('3배')}", 34).move_to([3.0, 1.6, 0])
        self.say(f"안쪽 정육각형 둘레 = 지름의 {b('3배')}", "반지름이 1 cm인 원 안에 꼭 맞는 정육각형을 그려요. 정육각형은 한 변이 반지름과 같은 1 cm라서 둘레는 6 cm, 지름 2 cm의 3배예요.")
        self.play(Create(hexa), FadeIn(t1), run_time=0.9)
        sq = Square(side_length=2 * R, color=GREEN, stroke_width=6).move_to(C)
        t2 = M(f"원 밖의 정사각형: 둘레 {g('8 cm')}\n= 지름 2 cm의 {g('4배')}", 34).move_to([3.0, 0.0, 0])
        self.say(f"바깥 정사각형 둘레 = 지름의 {g('4배')}", "원 밖에 꼭 맞는 정사각형은 한 변이 지름과 같은 2 cm라서 둘레는 8 cm, 지름의 4배예요.")
        self.play(Create(sq), FadeIn(t2), run_time=0.9)
        self.play(Indicate(circ, color=ORANGE, scale_factor=1.04), run_time=0.7)
        t3 = M(f"{b('지름 × 3')} &lt; {o('원주')} &lt; {g('지름 × 4')}", 40).move_to([3.0, -1.5, 0])
        self.say(f"원주는 3배보다 길고 4배보다 짧아요", "원주는 정육각형의 둘레보다 길고 정사각형의 둘레보다 짧아요. 그래서 원주는 지름의 3배보다 길고 4배보다 짧아요.")
        self.play(FadeIn(t3), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
