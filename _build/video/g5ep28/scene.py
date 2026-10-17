"""「수학 원리 돋보기」 5학년 28화 — 마름모의 넓이 (5-1 6단원 12차시, 화 코드 5-1-6-g)

두 대각선 6 cm, 4 cm인 마름모: 둘러싸는 직사각형(6 × 4 = 24)의 반 = 12 cm² (바깥 삼각형 4개 = 안쪽 삼각형 4개)
(마름모의 넓이) = (한 대각선) × (다른 대각선) ÷ 2
최종: GRADE=5 ./make_final.sh 28
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, DashedLine, FadeIn, FadeOut, Indicate, LaggedStart, Line, Polygon,
                   Rectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from area import grid
from shapes import PURPLE, poly, right_mark

S = 0.55


class G5Ep28(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 28
    EP_TITLE = "마름모의 넓이"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.box()
        self.closing(f"(마름모의 넓이) = {o('(한 대각선)')} × {b('(다른 대각선)')} {g('÷ 2')}\n둘러싸는 직사각형의 반이에요",
                     next_preview="5학년 29화 · 사다리꼴의 넓이")
        self.wait(0.5)

    def rh(self, c):
        c = np.array(c, float)
        return [c + np.array([-3 * S, 0, 0]), c + np.array([0, -2 * S, 0]), c + np.array([3 * S, 0, 0]), c + np.array([0, 2 * S, 0])]

    def problem(self):
        self.section("문제")
        q = M("두 대각선이 6 cm, 4 cm인 마름모의 넓이는?", 46).move_to([0.6, 2.3, 0])
        P = self.rh([0, -0.4, 0])
        self.say("마름모의 넓이", "두 대각선의 길이가 6센티미터, 4센티미터인 마름모의 넓이는 어떻게 구할까요?")
        self.play(Write(q), FadeIn(poly(P, fill=PURPLE, op=0.4)), run_time=1.2)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def box(self):
        self.section("둘러싸는 직사각형")
        c = np.array([-2.8, 0.1, 0])
        P = self.rh(c)
        gr = grid(6, 4, S, c)
        rh = poly(P, fill=PURPLE, op=0.45)
        d1 = DashedLine(P[0], P[2], color=ORANGE, stroke_width=5)
        d2 = DashedLine(P[1], P[3], color=BLUE, stroke_width=5)
        l1 = T("6 cm", 30, ORANGE).move_to(c + np.array([0, -2 * S - 0.32, 0]))
        l2 = T("4 cm", 30, BLUE).move_to(c + np.array([3 * S + 0.55, 0, 0]))
        self.play(FadeIn(gr), FadeIn(rh), Create(d1), Create(d2), FadeIn(l1), FadeIn(l2), run_time=0.9)
        rect = Rectangle(width=6 * S, height=4 * S, stroke_color=INK, stroke_width=5).move_to(c)
        self.say("마름모를 둘러싸는 직사각형", "마름모를 꼭 맞게 둘러싸는 직사각형을 그려요. 가로와 세로가 두 대각선의 길이와 같아요.")
        self.play(Create(rect), run_time=0.8)
        corners = [c + np.array([-3 * S, -2 * S, 0]), c + np.array([3 * S, -2 * S, 0]), c + np.array([3 * S, 2 * S, 0]), c + np.array([-3 * S, 2 * S, 0])]
        outs = VGroup(*[Polygon(P[k], corners[k], P[(k + 1) % 4], fill_color=ORANGE, fill_opacity=0.35, stroke_width=0) for k in range(4)])
        self.say(f"바깥 삼각형과 안쪽 삼각형이 {o('같아요')}", "직사각형 안에서 마름모 바깥의 삼각형 4개는 마름모 안쪽 삼각형 4개와 크기가 똑같아요.")
        self.play(FadeIn(outs), run_time=0.8)
        self.play(Indicate(outs, color=ORANGE), run_time=0.8)
        e1 = M(f"직사각형  6 × 4 = 24 (cm²)", 34).move_to([3.4, 1.6, 0])
        e2 = M(f"마름모는 그 반  {g('12 (cm²)')}", 34).move_to([3.4, 0.7, 0])
        self.say(f"마름모는 직사각형의 반 → {g('12 cm²')}", "그래서 마름모는 직사각형의 반이에요. 6 곱하기 4는 24, 그 반 12 제곱센티미터예요.")
        self.play(FadeIn(e1), run_time=0.5)
        self.play(FadeIn(e2), run_time=0.5)
        f = M(f"= {o('(한 대각선)')} × {b('(다른 대각선)')} {g('÷ 2')}", 32).move_to([3.4, -0.3, 0])
        self.say("대각선끼리 곱해서 2로 나눠요", "마름모의 넓이는 한 대각선과 다른 대각선을 곱한 뒤 2로 나누면 돼요.")
        self.play(FadeIn(f), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
