"""「수학 원리 돋보기」 5학년 26화 — 평행사변형의 넓이 (5-1 6단원 8·9차시, 화 코드 5-1-6-e)

밑변 6 cm, 높이 4 cm: 한쪽 삼각형을 잘라 반대쪽에 붙이면 가로 6, 세로 4인 직사각형 → 6 × 4 = 24 cm²
(평행사변형의 넓이) = (밑변) × (높이) / 밑변과 높이가 같으면 모양이 달라도 넓이가 같음
최종: GRADE=5 ./make_final.sh 26
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, DashedLine, FadeIn, FadeOut, Indicate, LaggedStart, Polygon, VGroup,
                   Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from area import grid
from shapes import poly, right_mark

S = 0.5


class G5Ep26(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 26
    EP_TITLE = "평행사변형의 넓이"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.terms()
        self.cut()
        self.same()
        self.closing(f"(평행사변형의 넓이) = {o('(밑변)')} × {b('(높이)')}\n잘라 붙이면 {g('직사각형')}이 돼요",
                     next_preview="5학년 27화 · 삼각형의 넓이")
        self.wait(0.5)

    def pts(self, ox, oy, base=6, h=4, sh=2):
        return [np.array([ox, oy, 0]), np.array([ox + base * S, oy, 0]), np.array([ox + (base + sh) * S, oy + h * S, 0]), np.array([ox + sh * S, oy + h * S, 0])]

    def problem(self):
        self.section("문제")
        q = M("이 평행사변형의 넓이는 어떻게 구할까요?", 46).move_to([0.6, 2.3, 0])
        P = self.pts(-2.0, -1.4)
        self.say("평행사변형의 넓이", "이 평행사변형의 넓이는 어떻게 구할까요? 1 제곱센티미터를 세려니 잘린 칸이 있어요.")
        self.play(Write(q), FadeIn(grid(8, 4, S, [0, -0.4, 0])), FadeIn(poly(P, fill=ORANGE, op=0.4)), run_time=1.2)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def terms(self):
        self.section("밑변과 높이")
        P = self.pts(-2.0, -1.0)
        par = poly(P, fill=ORANGE, op=0.3)
        self.play(FadeIn(par), run_time=0.5)
        base = VGroup(DashedLine(P[0], P[1], color=BLUE, stroke_width=0), T("밑변", 32, BLUE).next_to(VGroup(*[]) if False else par, DOWN, buff=0.2))
        hl = DashedLine(P[3], [P[3][0], P[0][1], 0], color=GREEN, stroke_width=5)
        rm = right_mark([P[3][0], P[0][1], 0], RIGHT, UP, 0.22, color=GREEN)
        ht = T("높이", 32, GREEN).next_to(par, LEFT, buff=0.2)
        self.say(f"아래 변이 {b('밑변')}", "평행한 두 변을 밑변이라고 해요. 여기서는 아래 변을 밑변으로 볼게요.")
        self.play(par.animate.set_stroke(width=5), FadeIn(base[1]), run_time=0.5)
        self.say(f"두 밑변 사이의 거리가 {g('높이')}", "두 밑변 사이의 거리, 곧 수직인 선분의 길이를 높이라고 해요.")
        self.play(Create(hl), Create(rm), FadeIn(ht), run_time=0.7)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def cut(self):
        self.section("잘라서 붙이기")
        ox, oy = -4.7, -1.2
        P = self.pts(ox, oy)
        gr = grid(10, 4, S, [ox + 5 * S, oy + 2 * S, 0])
        foot = np.array([P[3][0], oy, 0])
        tri = Polygon(P[0], foot, P[3], fill_color=BLUE, fill_opacity=0.6, stroke_color=INK, stroke_width=4)
        rest = Polygon(foot, P[1], P[2], P[3], fill_color=ORANGE, fill_opacity=0.5, stroke_color=INK, stroke_width=4)
        l1 = T("밑변 6 cm", 30, BLUE).next_to(VGroup(tri, rest), DOWN, buff=0.15)
        l2 = T("높이 4 cm", 30, GREEN).next_to(VGroup(tri, rest), LEFT, buff=0.15)
        self.play(FadeIn(gr), FadeIn(tri), FadeIn(rest), FadeIn(l1), FadeIn(l2), run_time=0.7)
        cl = DashedLine(P[3], foot, color=INK, stroke_width=5)
        self.say("높이를 따라 잘라요", "높이를 따라 왼쪽 삼각형을 잘라 볼게요.")
        self.play(Create(cl), run_time=0.5)
        self.say(f"반대쪽에 붙이면 {o('직사각형')}", "자른 삼각형을 오른쪽으로 옮겨 붙이면 직사각형이 돼요.")
        self.play(tri.animate.shift(RIGHT * 6 * S), run_time=1.4)
        e = M(f"가로 6 cm, 세로 4 cm인 직사각형\n6 × 4 = {g('24 (cm²)')}", 32).move_to([3.75, 1.3, 0])
        self.say(f"6 × 4 = {g('24 cm²')}", "가로는 밑변 6센티미터, 세로는 높이 4센티미터인 직사각형이니 넓이는 24 제곱센티미터예요.")
        self.play(FadeIn(e), run_time=0.6)
        f = M(f"= {o('(밑변)')} × {b('(높이)')}", 38).move_to([3.75, 0.1, 0])
        self.play(FadeIn(f), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def same(self):
        self.section("모양이 달라도")
        shapes_ = VGroup()
        for k, sh in enumerate((0, 2, 4)):
            P = self.pts(-5.8 + k * 4.0, -0.9, base=4, h=4, sh=sh)
            shapes_.add(poly(P, fill=[BLUE, ORANGE, GREEN][k], op=0.35))
        self.say("밑변과 높이가 같은 평행사변형들", "밑변이 4센티미터, 높이가 4센티미터인 평행사변형들이에요. 기울어진 정도가 달라요.")
        self.play(LaggedStart(*[FadeIn(s) for s in shapes_], lag_ratio=0.3, run_time=1.2))
        t = M(f"모두 4 × 4 = {g('16 cm²')}", 46).move_to([0, -1.9, 0])
        self.say(f"넓이는 모두 {g('16 cm²')}", "밑변과 높이가 같으면 모양이 달라도 넓이는 모두 16 제곱센티미터로 같아요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
