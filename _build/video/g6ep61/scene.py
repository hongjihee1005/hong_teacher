"""「수학 원리 돋보기」 6학년 61화 — 원의 넓이 활용 (6-2 5단원 7차시, 화 코드 6-2-5-f)

중심이 같은 두 원 사이의 넓이 = 큰 원의 넓이 − 작은 원의 넓이 (반지름 4 m, 1 m → 50.24 − 3.14 = 47.1 m²)
도형의 일부분을 옮겨 반원으로 바꾸어 넓이 구하기 (반지름 5 cm 반원 → 78.5 ÷ 2 = 39.25 cm², 작은 반원을 옮기는 그림은 이 영상에서 정한 모양)
최종: GRADE=6 ./make_final.sh 61
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, PI, RIGHT, UP, Annulus, Circle, Create, FadeIn, FadeOut, Indicate, LaggedStart, Line,
                   Sector, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage

RED = "#E05A5A"


class G6Ep61(EpisodeScene):
    GRADE, SEM = 6, 2
    EP_NO = 61
    EP_TITLE = "원의 넓이 활용"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.ring()
        self.half()
        self.closing(f"두 원 사이의 넓이는 {o('큰 원')} − {b('작은 원')}\n도형을 옮기거나 나누어 {g('원·반원')}으로 바꾸어 구해요",
                     next_preview="6학년 62화 · 큰 피자 1판, 작은 피자 2판?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("중심이 같은 두 원 사이에 빨간 꽃을 심었어요.\n빨간 꽃밭의 넓이는 몇 m²일까요?", 42).move_to([0.6, 2.0, 0])
        self.say("빨간 꽃밭의 넓이는?", "중심이 같은 두 원 사이에 빨간 꽃을 심었어요. 큰 원의 반지름은 4 미터, 작은 원의 반지름은 1 미터예요. 빨간 꽃밭의 넓이는 몇 제곱미터일까요?")
        self.play(Write(q), run_time=1.0)
        ring = Annulus(inner_radius=0.4, outer_radius=1.6, fill_color=RED, fill_opacity=0.7, stroke_color=INK, stroke_width=3).move_to([0, -0.8, 0])
        self.play(FadeIn(ring), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def ring(self):
        self.section("큰 원 − 작은 원")
        C = np.array([-3.6, 0.2, 0])
        big = Circle(radius=2.0, fill_color=RED, fill_opacity=0.7, stroke_color=INK, stroke_width=3).move_to(C)
        small = Circle(radius=0.5, fill_color=PAPER, fill_opacity=1, stroke_color=INK, stroke_width=3).move_to(C)
        r1 = Line(C, C + np.array([2.0 * np.cos(0.5), 2.0 * np.sin(0.5), 0]), color=INK, stroke_width=4)
        r1t = M("4 m", 26).next_to(r1.get_center(), UP, buff=0.1)
        r2 = Line(C, C + DOWN * 0.5, color=INK, stroke_width=4)
        r2t = M("1 m", 24).next_to(r2, RIGHT, buff=0.05)
        self.play(FadeIn(big), FadeIn(r1), FadeIn(r1t), run_time=0.5)
        e1 = M(f"큰 원: 4 × 4 × 3.14 = {o('50.24')}", 38).move_to([2.6, 1.6, 0])
        self.say(f"큰 원 {o('50.24 m²')}", "먼저 큰 원 전체의 넓이를 구해요. 4 곱하기 4 곱하기 3.14, 50.24 제곱미터예요.")
        self.play(FadeIn(e1), run_time=0.5)
        e2 = M(f"작은 원: 1 × 1 × 3.14 = {b('3.14')}", 38).move_to([2.6, 0.6, 0])
        self.say(f"작은 원 {b('3.14 m²')}", "가운데 작은 원은 1 곱하기 1 곱하기 3.14, 3.14 제곱미터예요.")
        self.play(FadeIn(small), FadeIn(r2), FadeIn(r2t), FadeIn(e2), run_time=0.6)
        e3 = M(f"50.24 − 3.14 = {g('47.1')} (m²)", 44).move_to([2.6, -0.7, 0])
        self.say(f"빼면 {g('47.1 m²')}", "큰 원에서 작은 원을 빼면 50.24 빼기 3.14, 빨간 꽃밭은 47.1 제곱미터예요.")
        self.play(FadeIn(e3), run_time=0.6)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def half(self):
        self.section("옮겨서 반원 만들기")
        s = 0.42
        C = np.array([-4.2, -1.0, 0])
        r = 5 * s
        # 반지름 5 cm 반원 안에 지름 위로 작은 반원 두 개: 오른쪽 작은 반원은 파낸 모양, 왼쪽은 붙은 모양
        big = Sector(radius=r, start_angle=0, angle=PI, fill_color=GREEN, fill_opacity=0.55, stroke_color=INK, stroke_width=3)
        big.move_arc_center_to(C)
        hole = Sector(radius=r / 2, start_angle=0, angle=PI, fill_color=PAPER, fill_opacity=1, stroke_color=INK, stroke_width=3)
        hole.move_arc_center_to(C + RIGHT * r / 2)
        bump = Sector(radius=r / 2, start_angle=PI, angle=PI, fill_color=GREEN, fill_opacity=0.55, stroke_color=INK, stroke_width=3)
        bump.move_arc_center_to(C + LEFT * r / 2)
        self.say("색칠한 부분의 넓이는?", "이번에는 색칠한 부분의 넓이를 구해 볼게요. 큰 반원의 반지름은 5 센티미터예요. 한쪽은 작은 반원만큼 파였고, 다른 쪽은 작은 반원만큼 튀어나왔어요.")
        self.play(FadeIn(big), FadeIn(hole), FadeIn(bump), run_time=0.7)
        moved = bump.copy()
        self.say(f"튀어나온 부분을 {o('옮기면')}", "아래로 튀어나온 작은 반원을 떼어 파인 곳으로 옮기면 꼭 맞아요.")
        self.play(moved.animate.rotate(PI, about_point=C).set_fill(ORANGE, 0.7), FadeOut(bump), run_time=1.4)
        t = M(f"반지름 5 cm인 {g('반원')}이 돼요", 36).move_to([2.6, 1.0, 0])
        e = M(f"5 × 5 × 3.14 ÷ 2\n= 78.5 ÷ 2 = {g('39.25')} (cm²)", 36).move_to([2.6, -0.3, 0])
        self.say(f"반원의 넓이 {g('39.25 cm²')}", "그러면 반지름 5 센티미터인 반원이 돼요. 넓이는 78.5 나누기 2, 39.25 제곱센티미터예요.")
        self.play(FadeIn(t), run_time=0.5)
        self.play(FadeIn(e), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
