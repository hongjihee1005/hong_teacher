"""「수학 원리 돋보기」 5학년 43화 — 선대칭도형 (5-2 3단원 4차시, 화 코드 5-2-3-c)

한 직선을 따라 접었을 때 완전히 겹치는 도형 = 선대칭도형, 그 직선 = 대칭축
대칭축이 여러 개인 도형: 정삼각형 3개, 정사각형 4개, 원은 셀 수 없이 많음 / 평행사변형은 선대칭도형이 아님
최종: GRADE=5 ./make_final.sh 43
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Circle, Create, Cross, DashedLine, FadeIn, FadeOut, Indicate, LaggedStart,
                   Polygon, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from shapes import PURPLE, poly, regular

RED = "#C0392B"
HOUSE = [(-1.2, -1.2), (1.2, -1.2), (1.2, 0.3), (0, 1.4), (-1.2, 0.3)]


class G5Ep43(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 43
    EP_TITLE = "선대칭도형"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.fold()
        self.axes()
        self.closing(f"한 직선을 따라 접어 완전히 겹치는 도형이 {g('선대칭도형')}\n그 직선이 {o('대칭축')}, 도형에 따라 여러 개일 수도 있어요",
                     next_preview="5학년 44화 · 선대칭도형의 성질")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("반으로 접으면 꼭 겹치는 모양에는\n어떤 특징이 있을까요?", 44).move_to([0.6, 1.8, 0])
        h = poly([np.array([x, y - 0.5, 0]) for x, y in HOUSE], fill=ORANGE)
        self.say("반으로 접으면 겹치는 모양", "반으로 접으면 꼭 겹치는 모양에는 어떤 특징이 있을까요?")
        self.play(Write(q), FadeIn(h), run_time=1.2)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def fold(self):
        self.section("접어 보기")
        c = np.array([-2.6, 0.1, 0])
        P = [c + np.array([x, y, 0]) for x, y in HOUSE]
        left = Polygon(P[0], c + np.array([0, -1.2, 0]), c + np.array([0, 1.4, 0]), P[4], fill_color=ORANGE, fill_opacity=0.5, stroke_color=INK, stroke_width=4)
        right = Polygon(c + np.array([0, -1.2, 0]), P[1], P[2], c + np.array([0, 1.4, 0]), fill_color=ORANGE, fill_opacity=0.5, stroke_color=INK, stroke_width=4)
        self.play(FadeIn(left), FadeIn(right), run_time=0.5)
        ax = DashedLine(c + np.array([0, -1.8, 0]), c + np.array([0, 2.0, 0]), color=GREEN, stroke_width=5)
        self.say("가운데 직선을 따라 접으면", "가운데 직선을 따라 접어 볼게요.")
        self.play(Create(ax), run_time=0.5)
        self.play(right.animate.stretch(-1, 0, about_point=c), run_time=1.3)
        self.play(Indicate(VGroup(left, right), color=GREEN, scale_factor=1.04), run_time=0.7)
        self.play(right.animate.stretch(-1, 0, about_point=c), run_time=1.0)
        t1 = M(f"한 직선을 따라 접어 {o('완전히 겹치는')} 도형\n= {g('선대칭도형')}", 42).move_to([3.0, 0.8, 0])
        t2 = M(f"그 직선 = {g('대칭축')}", 42).move_to([3.0, -0.6, 0])
        self.say(f"완전히 겹치면 {g('선대칭도형')}", "한 직선을 따라 접었을 때 완전히 겹치는 도형을 선대칭도형이라고 해요. 그 직선을 대칭축이라고 해요.")
        self.play(FadeIn(t1), run_time=0.5)
        self.play(FadeIn(t2), Indicate(ax, color=GREEN), run_time=0.6)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def axes(self):
        self.section("대칭축은 몇 개?")
        xs = [-4.8, -1.6, 1.6, 4.8]
        tri = poly(regular(3, 1.1, [xs[0], 0.5, 0]), fill=ORANGE)
        sq = poly(regular(4, 1.1, [xs[1], 0.5, 0], 45), fill=BLUE)
        cir = Circle(radius=0.95, color=INK, stroke_width=5).set_fill(GREEN, 0.3).move_to([xs[2], 0.5, 0])
        pr = poly([[xs[3] - 1.1, -0.2, 0], [xs[3] + 0.5, -0.2, 0], [xs[3] + 1.1, 1.2, 0], [xs[3] - 0.5, 1.2, 0]], fill=PURPLE)
        self.play(FadeIn(tri), FadeIn(sq), FadeIn(cir), FadeIn(pr), run_time=0.6)
        def axis_lines(c, angs, L=1.45):
            c = np.array(c, float)
            return VGroup(*[DashedLine(c - L * np.array([np.cos(np.radians(a)), np.sin(np.radians(a)), 0]), c + L * np.array([np.cos(np.radians(a)), np.sin(np.radians(a)), 0]), color=RED, stroke_width=3) for a in angs])
        tc = np.mean(regular(3, 1.1, [xs[0], 0.5, 0]), axis=0)
        a1 = axis_lines(tc, [90, 210, 330])
        a2 = axis_lines([xs[1], 0.5, 0], [0, 45, 90, 135])
        a3 = axis_lines([xs[2], 0.5, 0], list(range(0, 180, 20)), 1.25)
        labs = VGroup(T("3개", 34).move_to([xs[0], -1.2, 0]), T("4개", 34).move_to([xs[1], -1.2, 0]), T("셀 수 없이 많아요", 28).move_to([xs[2], -1.2, 0]), T("없어요", 34, RED).move_to([xs[3], -1.2, 0]))
        self.say(f"정삼각형은 {o('3개')}, 정사각형은 {o('4개')}", "대칭축은 도형에 따라 여러 개일 수도 있어요. 정삼각형은 3개, 정사각형은 4개예요.")
        self.play(Create(a1), FadeIn(labs[0]), run_time=0.7)
        self.play(Create(a2), FadeIn(labs[1]), run_time=0.7)
        self.say(f"원은 {g('셀 수 없이 많아요')}", "원은 중심을 지나는 직선이면 모두 대칭축이라 셀 수 없이 많아요.")
        self.play(Create(a3), FadeIn(labs[2]), run_time=0.8)
        self.say(f"평행사변형은 {RED_T('선대칭도형이 아니에요')}", "평행사변형은 어떤 직선으로 접어도 완전히 겹치지 않아요. 선대칭도형이 아니에요.")
        self.play(FadeIn(labs[3]), Indicate(pr, color=RED), run_time=0.7)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()


def RED_T(s):
    return f'<span foreground="{RED}">{s}</span>'
