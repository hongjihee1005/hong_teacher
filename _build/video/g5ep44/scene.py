"""「수학 원리 돋보기」 5학년 44화 — 선대칭도형의 성질 (5-2 3단원 5·6차시, 화 코드 5-2-3-d)

대칭축을 따라 접으면 겹치는 점·변·각 = 대응점·대응변·대응각 → 대응변의 길이, 대응각의 크기가 같음
대응점을 이은 선분은 대칭축과 수직으로 만나고, 대칭축은 그 선분을 똑같이 둘로 나눔 → 선대칭도형 그리기
최종: GRADE=5 ./make_final.sh 44
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, DashedLine, Dot, FadeIn, FadeOut, Indicate, LaggedStart, Line,
                   VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from shapes import PURPLE, arc_at, poly, right_mark, tick
from move import grid

RED = "#C0392B"
HALF = [(0, 0), (-2, 0), (-3, 2), (-1, 3), (0, 4)]


class G5Ep44(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 44
    EP_TITLE = "선대칭도형의 성질"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.props()
        self.draw()
        self.closing(f"대응점을 이은 선분은 대칭축과 {o('수직')}으로 만나고\n대칭축이 그 선분을 {g('똑같이 둘로')} 나눠요",
                     next_preview="5학년 45화 · 점대칭도형")
        self.wait(0.5)

    def shape_pts(self, gd, ax_col, row0):
        left = [gd.pt(ax_col + x, row0 + y) for x, y in HALF]
        right = [gd.pt(ax_col - x, row0 + y) for x, y in HALF[::-1]][1:-1]
        return left + right

    def problem(self):
        self.section("문제")
        q = M("선대칭도형에서 대응점을 이은 선분과\n대칭축은 어떤 관계일까요?", 44).move_to([0.6, 1.9, 0])
        gd = grid(10, 5, 0.5, [0, -0.9, 0])
        P = self.shape_pts(gd, 5, 0)
        self.say("대응점과 대칭축", "선대칭도형에서 대응점을 이은 선분과 대칭축은 어떤 관계일까요?")
        self.play(Write(q), FadeIn(gd), FadeIn(poly(P, fill=ORANGE)), run_time=1.2)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def props(self):
        self.section("대응점을 이으면")
        gd = grid(10, 6, 0.6, [-2.9, 0.2, 0])
        P = self.shape_pts(gd, 5, 1)
        sh = poly(P, fill=ORANGE, op=0.3)
        ax = DashedLine(gd.pt(5, -0.3), gd.pt(5, 6.3), color=GREEN, stroke_width=5)
        self.play(FadeIn(gd), FadeIn(sh), Create(ax), run_time=0.7)
        A, A2 = P[2], P[6]
        d = VGroup(Dot(A, radius=0.1, color=BLUE), Dot(A2, radius=0.1, color=BLUE))
        la = VGroup(T("ㄱ", 30, BLUE).next_to(A, LEFT, buff=0.12), T("ㄴ", 30, BLUE).next_to(A2, RIGHT, buff=0.12))
        self.say("접었을 때 겹치는 두 점, 대응점", "대칭축을 따라 접었을 때 겹치는 점이 대응점이에요. 점 ㄱ과 점 ㄴ이 대응점이에요.")
        self.play(FadeIn(d), FadeIn(la), run_time=0.5)
        seg = Line(A, A2, color=BLUE, stroke_width=6)
        mid = (A + A2) / 2
        rm = right_mark(mid, RIGHT, UP, 0.24, color=RED)
        tk = VGroup(tick(A, mid, 1), tick(mid, A2, 1))
        self.say(f"대칭축과 {o('수직')}으로 만나요", "대응점을 선분으로 이으면 대칭축과 수직으로 만나요.")
        self.play(Create(seg), Create(rm), run_time=0.7)
        self.say(f"대칭축이 {g('똑같이 둘로')} 나눠요", "또 대칭축은 이 선분을 똑같이 둘로 나눠요. 대칭축에서 두 대응점까지의 거리가 같아요.")
        self.play(Create(tk), run_time=0.6)
        t = M(f"대응변의 길이와\n대응각의 크기도\n{g('서로 같아요')}", 38).move_to([4.3, 0.6, 0])
        self.say(f"대응변·대응각도 {g('같아요')}", "접으면 꼭 겹치니 대응변의 길이와 대응각의 크기도 서로 같아요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def draw(self):
        self.section("선대칭도형 완성하기")
        gd = grid(10, 6, 0.6, [-2.4, 0.2, 0])
        left = [gd.pt(5 + x, 1 + y) for x, y in HALF]
        half = VGroup(*[Line(left[k], left[k + 1], color=INK, stroke_width=6) for k in range(len(left) - 1)])
        ax = DashedLine(gd.pt(5, -0.3), gd.pt(5, 6.3), color=GREEN, stroke_width=5)
        self.say("반쪽만 있는 도형", "대칭축의 왼쪽만 그려진 도형을 선대칭도형으로 완성해 볼게요.")
        self.play(FadeIn(gd), Create(ax), Create(half), run_time=0.8)
        rights = [gd.pt(5 - x, 1 + y) for x, y in HALF]
        dots = VGroup(*[Dot(r, radius=0.09, color=ORANGE) for r in rights[1:-1]])
        guides = VGroup(*[DashedLine(l, r, color=ORANGE, stroke_width=3) for l, r in zip(left[1:-1], rights[1:-1])])
        self.say(f"대칭축까지와 {o('같은 거리')}만큼 건너편에 점", "각 꼭짓점에서 대칭축까지 수직으로 간 거리만큼 건너편에 대응점을 찍어요.")
        self.play(LaggedStart(*[Create(gl) for gl in guides], lag_ratio=0.3, run_time=1.2), LaggedStart(*[FadeIn(dt, scale=2) for dt in dots], lag_ratio=0.3, run_time=1.2))
        other = VGroup(*[Line(rights[k], rights[k + 1], color=ORANGE, stroke_width=6) for k in range(len(rights) - 1)])
        self.say(f"점을 이으면 {g('완성')}", "대응점들을 차례로 이으면 선대칭도형이 완성돼요.")
        self.play(Create(other), run_time=1.0)
        t = M(f"대칭축까지의 거리가 같게!", 40).move_to([3.6, 0.4, 0])
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
