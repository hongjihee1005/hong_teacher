"""「수학 원리 돋보기」 6학년 65화 — 원뿔이란? (6-2 6단원 5차시, 화 코드 6-2-6-c)

평평한 면이 원이고 1개인 입체도형 = 원뿔: 평평한 면 = 밑면, 옆을 둘러싼 굽은 면 = 옆면, 뾰족한 점 = 원뿔의 꼭짓점
원뿔의 꼭짓점과 밑면 둘레의 한 점을 이은 선분 = 모선(셀 수 없이 많고 길이가 모두 같음), 꼭짓점과 밑면 사이의 거리 = 높이
직각삼각형 모양의 종이를 돌리면 원뿔
최종: GRADE=6 ./make_final.sh 65
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, DashedLine, Dot, FadeIn, FadeOut, Indicate, LaggedStart, Line,
                   Polygon, ValueTracker, VGroup, Write, always_redraw, linear)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from round3d import FLAT, cone
from shapes import right_mark

BLU = "#7C9CC9"


class G6Ep65(EpisodeScene):
    GRADE, SEM = 6, 2
    EP_NO = 65
    EP_TITLE = "원뿔이란?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.parts()
        self.spin()
        self.closing(f"평평한 면이 {o('원 1개')}이고 뾰족한 꼭짓점이 있는 입체도형이 {g('원뿔')}\n꼭짓점과 밑면 둘레를 이은 {b('모선')}은 길이가 모두 같아요",
                     next_preview="6학년 66화 · 구란?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("고깔모자, 아이스크림 콘 같은 모양은\n어떤 입체도형일까요?", 44).move_to([0.6, 2.0, 0])
        self.say("어떤 입체도형일까?", "고깔모자, 아이스크림 콘 같은 모양은 어떤 입체도형일까요?")
        self.play(Write(q), run_time=1.0)
        cn = cone(1.1, 2.4, (0, -0.7, 0))
        self.play(FadeIn(cn), run_time=0.6)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def parts(self):
        self.section("원뿔의 구성 요소")
        cn = cone(1.6, 3.4, (-3.2, -0.2, 0))
        self.play(FadeIn(cn), run_time=0.5)
        base = Polygon(*[cn.bc + np.array([1.6 * np.cos(t), 1.6 * FLAT * np.sin(t), 0]) for t in np.linspace(0, 2 * np.pi, 60)],
                       fill_color=ORANGE, fill_opacity=0.6, stroke_width=0)
        t1 = M(f"평평한 원 1개 = {o('밑면')}, 굽은 면 = {b('옆면')}", 30).move_to([3.0, 2.0, 0])
        self.say(f"원 1개가 {o('밑면')}, 굽은 면이 {b('옆면')}", "원뿔에서 평평한 원은 밑면, 옆을 둘러싼 굽은 면은 옆면이에요. 밑면은 1개예요.")
        self.play(FadeIn(base), FadeIn(t1), run_time=0.6)
        ap = Dot(cn.apex, radius=0.12, color=GREEN)
        t2 = M(f"뾰족한 점 = {g('원뿔의 꼭짓점')}", 30).move_to([3.0, 1.1, 0])
        self.say(f"뾰족한 점 = {g('원뿔의 꼭짓점')}", "뾰족한 부분의 점을 원뿔의 꼭짓점이라고 해요.")
        self.play(FadeIn(ap, scale=2), FadeIn(t2), run_time=0.5)
        gens = VGroup(*[Line(cn.apex, cn.bc + np.array([1.6 * np.cos(t), 1.6 * FLAT * np.sin(t), 0]), color=ORANGE, stroke_width=4)
                        for t in np.linspace(np.pi * 1.05, np.pi * 1.95, 5)])
        t3 = M(f"꼭짓점과 밑면 둘레를 이은 선분 = {o('모선')}", 30).move_to([3.0, 0.2, 0])
        t3b = M("셀 수 없이 많고, 길이가 모두 같아요", 28, SOFT).move_to([3.0, -0.45, 0])
        self.say(f"모선은 {o('길이가 모두 같아요')}", "원뿔의 꼭짓점과 밑면의 둘레의 한 점을 이은 선분을 모선이라고 해요. 모선은 셀 수 없이 많고 길이가 모두 같아요.")
        self.play(LaggedStart(*[Create(l) for l in gens], lag_ratio=0.2, run_time=1.0), FadeIn(t3), FadeIn(t3b))
        hl = DashedLine(cn.apex, cn.bc, color=BLUE, stroke_width=5, dash_length=0.12)
        rm = right_mark(cn.bc, UP, RIGHT, 0.2, BLUE, 4)
        t4 = M(f"꼭짓점과 밑면 사이의 거리 = {b('높이')}", 30).move_to([3.0, -1.3, 0])
        self.say(f"꼭짓점에서 밑면까지 = {b('높이')}", "원뿔의 꼭짓점에서 밑면에 수직인 선분의 길이, 곧 꼭짓점과 밑면 사이의 거리가 높이예요. 모선보다 짧아요.")
        self.play(Create(hl), Create(rm), FadeIn(t4), run_time=0.7)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def spin(self):
        self.section("직각삼각형을 돌리면")
        C = np.array([-2.4, 0.0, 0])
        W, H = 1.5, 2.8
        axis = DashedLine(C + np.array([0, -H / 2 - 0.5, 0]), C + np.array([0, H / 2 + 0.5, 0]), color=SOFT, stroke_width=4)
        self.play(Create(axis), run_time=0.4)
        t = ValueTracker(0)

        def tri():
            k = np.cos(t.get_value())
            return Polygon(C + np.array([0, -H / 2, 0]), C + np.array([W * k, -H / 2, 0]), C + np.array([0, H / 2, 0]),
                           fill_color=BLU, fill_opacity=0.85, stroke_color=INK, stroke_width=4)

        r = always_redraw(tri)
        self.add(r)
        ghost = cone(W, H, C)
        self.say("직각을 낀 한 변을 기준으로", "직각삼각형 모양의 종이를 직각을 낀 한 변을 기준으로 한 바퀴 돌려 볼게요.")
        self.play(t.animate.set_value(2 * np.pi), FadeIn(ghost, run_time=4.0), run_time=4.0, rate_func=linear)
        res = M(f"직각삼각형을 돌리면 {g('원뿔')}", 40).move_to([3.2, 0.3, 0])
        self.say(f"{g('원뿔')}이 만들어져요", "돌린 자리가 모여 원뿔이 돼요. 빗변이 지나간 자리가 옆면이고, 빗변이 바로 모선이에요.")
        self.play(FadeIn(res), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
