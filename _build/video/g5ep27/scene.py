"""「수학 원리 돋보기」 5학년 27화 — 삼각형의 넓이 (5-1 6단원 10·11차시, 화 코드 5-1-6-f)

밑변 6 cm, 높이 4 cm인 삼각형: 똑같은 삼각형 두 개를 붙이면 평행사변형(6 × 4 = 24) → 그 반 12 cm²
(삼각형의 넓이) = (밑변) × (높이) ÷ 2 / 밑변과 높이가 같으면 넓이가 같음
최종: GRADE=5 ./make_final.sh 27
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, PI, RIGHT, UP, Create, DashedLine, FadeIn, FadeOut, Indicate, LaggedStart, Polygon,
                   Rotate, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from area import grid
from shapes import poly, right_mark

S = 0.5


class G5Ep27(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 27
    EP_TITLE = "삼각형의 넓이"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.double()
        self.same()
        self.closing(f"(삼각형의 넓이) = {o('(밑변)')} × {b('(높이)')} {g('÷ 2')}\n똑같은 삼각형 두 개면 평행사변형이에요",
                     next_preview="5학년 28화 · 마름모의 넓이")
        self.wait(0.5)

    def tri(self, ox, oy, base=6, h=4, top=2):
        return [np.array([ox, oy, 0]), np.array([ox + base * S, oy, 0]), np.array([ox + top * S, oy + h * S, 0])]

    def problem(self):
        self.section("문제")
        q = M("밑변 6 cm, 높이 4 cm인 삼각형의 넓이는?", 46).move_to([0.6, 2.3, 0])
        P = self.tri(-1.5, -1.4)
        self.say("삼각형의 넓이", "밑변이 6센티미터, 높이가 4센티미터인 삼각형의 넓이는 어떻게 구할까요?")
        self.play(Write(q), FadeIn(poly(P, fill=ORANGE, op=0.4)), run_time=1.2)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def double(self):
        self.section("똑같은 삼각형 두 개")
        ox, oy = -4.2, -1.2
        P = self.tri(ox, oy)
        gr = grid(10, 4, S, [ox + 5 * S, oy + 2 * S, 0])
        t1 = poly(P, fill=ORANGE, op=0.55)
        hl = DashedLine(P[2], [P[2][0], oy, 0], color=GREEN, stroke_width=5)
        lb = T("밑변 6 cm", 28, BLUE).move_to([ox + 3 * S, oy - 0.3, 0])
        lh = T("높이 4 cm", 28, GREEN).move_to([ox - 0.85, oy + 1.0, 0])
        self.play(FadeIn(gr), FadeIn(t1), Create(hl), FadeIn(lb), FadeIn(lh), run_time=0.8)
        t2 = t1.copy().set_fill(BLUE, 0.55)
        self.say("똑같은 삼각형을 하나 더", "똑같은 삼각형을 하나 더 만들어 돌려서 붙여 볼게요.")
        self.add(t2)
        self.play(Rotate(t2, PI, about_point=(P[1] + P[2]) / 2), run_time=1.6)
        e1 = M(f"평행사변형\n6 × 4 = 24 (cm²)", 32).move_to([3.9, 1.7, 0])
        self.say(f"평행사변형이 되었어요: {o('24 cm²')}", "두 삼각형이 꼭 맞게 붙어 밑변 6센티미터, 높이 4센티미터인 평행사변형이 되었어요. 넓이는 24 제곱센티미터.")
        self.play(FadeIn(e1), run_time=0.5)
        e2 = M(f"삼각형은 그 반\n24 ÷ 2 = {g('12 (cm²)')}", 32).move_to([3.9, 0.45, 0])
        self.say(f"삼각형은 그 반, {g('12 cm²')}", "삼각형 하나는 평행사변형의 반이니 24 나누기 2, 12 제곱센티미터예요.")
        self.play(FadeIn(e2), Indicate(t1, color=ORANGE), run_time=0.8)
        f = M(f"= {o('(밑변)')} × {b('(높이)')} {g('÷ 2')}", 34).move_to([3.9, -0.65, 0])
        self.play(FadeIn(f), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def same(self):
        self.section("모양이 달라도")
        tris = VGroup()
        for k, top in enumerate((0, 2, 5)):
            P = self.tri(-5.6 + k * 3.9, -0.9, base=4, h=4, top=top)
            tris.add(poly(P, fill=[BLUE, ORANGE, GREEN][k], op=0.35))
        self.say("밑변과 높이가 같은 삼각형들", "밑변이 4센티미터, 높이가 4센티미터인 삼각형들이에요. 꼭짓점의 위치가 달라요.")
        self.play(LaggedStart(*[FadeIn(t) for t in tris], lag_ratio=0.3, run_time=1.2))
        t = M(f"모두 4 × 4 ÷ 2 = {g('8 cm²')}", 46).move_to([0, -1.9, 0])
        self.say(f"넓이는 모두 {g('8 cm²')}", "밑변과 높이가 같으면 모양이 달라도 넓이는 모두 8 제곱센티미터로 같아요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
