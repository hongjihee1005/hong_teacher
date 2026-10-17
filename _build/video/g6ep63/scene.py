"""「수학 원리 돋보기」 6학년 63화 — 원기둥이란? (6-2 6단원 2차시, 화 코드 6-2-6-a)

두 면이 평행하고 합동인 원으로 이루어진 입체도형 = 원기둥
평행하고 합동인 두 면 = 밑면, 두 밑면과 만나는 굽은 면 = 옆면, 두 밑면 사이의 거리 = 높이
직사각형 모양의 종이를 한 변을 기준으로 돌리면 원기둥
최종: GRADE=6 ./make_final.sh 63
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, DashedLine, DoubleArrow, FadeIn, FadeOut, Indicate, LaggedStart,
                   Line, Polygon, ValueTracker, VGroup, Write, always_redraw, linear)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from round3d import FLAT, cylinder, cone, sphere
from solid import prism, regular

YEL = "#F2C14E"


class G6Ep63(EpisodeScene):
    GRADE, SEM = 6, 2
    EP_NO = 63
    EP_TITLE = "원기둥이란?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.parts()
        self.spin()
        self.closing(f"평행하고 합동인 {o('두 원')}으로 이루어진 입체도형이 {g('원기둥')}\n두 원은 {o('밑면')}, 굽은 면은 {b('옆면')}, 두 밑면 사이의 거리는 높이",
                     next_preview="6학년 64화 · 원기둥의 전개도")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("통조림 캔, 휴지 심 같은 모양은\n각기둥과 무엇이 다를까요?", 44).move_to([0.6, 2.0, 0])
        self.say("각기둥과 무엇이 다를까?", "마을 체육 대회에서 쓰는 음료수 캔, 휴지 심 같은 모양을 살펴보아요. 각기둥과 무엇이 다를까요?")
        self.play(Write(q), run_time=1.0)
        cy = cylinder(1.0, 2.0, (2.4, -0.8, 0))
        pr = prism(regular(6, 1.0), 2.0, center=(-2.4, -0.8, 0))
        self.play(FadeIn(pr.edges(width=4)), FadeIn(cy), run_time=0.7)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def parts(self):
        self.section("밑면 · 옆면 · 높이")
        cy = cylinder(1.5, 3.0, (-3.0, 0.0, 0))
        self.play(FadeIn(cy), run_time=0.6)
        bot = Polygon(*[cy.bc + np.array([1.5 * np.cos(t), 1.5 * FLAT * np.sin(t), 0]) for t in np.linspace(0, 2 * np.pi, 60)],
                      fill_color=ORANGE, fill_opacity=0.6, stroke_width=0)
        top = cy.top.copy().set_fill(ORANGE, 0.8)
        t1 = M(f"평행하고 합동인 두 원 = {o('밑면')}", 34).move_to([3.0, 1.7, 0])
        self.say(f"평행하고 합동인 두 원 = {o('밑면')}", "위와 아래의 두 원은 서로 평행하고 모양과 크기가 같아요. 이 두 면을 밑면이라고 해요. 밑면은 아래에 있는 면만이 아니에요.")
        self.play(FadeIn(bot), FadeIn(top), FadeIn(t1), run_time=0.7)
        side = cy.side.copy().set_fill(BLUE, 0.55)
        t2 = M(f"두 밑면과 만나는 굽은 면 = {b('옆면')}", 34).move_to([3.0, 0.6, 0])
        self.say(f"굽은 면 = {b('옆면')}", "두 밑면과 만나는 굽은 면을 옆면이라고 해요.")
        self.play(FadeIn(side), FadeIn(t2), run_time=0.7)
        x = cy.bc[0] + 1.5 + 0.45
        ar = DoubleArrow([x, cy.bc[1], 0], [x, cy.tc[1], 0], color=GREEN, buff=0, stroke_width=5, tip_length=0.22)
        t3 = M(f"두 밑면 사이의 거리 = {g('높이')}", 34).move_to([3.0, -0.5, 0])
        self.say(f"두 밑면 사이의 거리 = {g('높이')}", "두 밑면 사이의 거리를 높이라고 해요.")
        self.play(Create(ar), FadeIn(t3), run_time=0.6)
        d = M(f"이런 입체도형 = {g('원기둥')}", 38).move_to([3.0, -1.7, 0])
        self.say(f"이런 입체도형이 {g('원기둥')}", "두 면이 평행하고 합동인 원으로 이루어진 입체도형을 원기둥이라고 해요. 각기둥과 달리 꼭짓점과 모서리가 없어요.")
        self.play(FadeIn(d), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def spin(self):
        self.section("직사각형을 돌리면")
        C = np.array([-2.0, 0.0, 0])
        W, H = 1.4, 2.6
        axis = DashedLine(C + np.array([0, -H / 2 - 0.5, 0]), C + np.array([0, H / 2 + 0.5, 0]), color=SOFT, stroke_width=4)
        self.play(Create(axis), run_time=0.4)
        t = ValueTracker(0)

        def rect():
            k = np.cos(t.get_value())
            return Polygon(C + np.array([0, -H / 2, 0]), C + np.array([W * k, -H / 2, 0]), C + np.array([W * k, H / 2, 0]), C + np.array([0, H / 2, 0]),
                           fill_color=YEL, fill_opacity=0.85, stroke_color=INK, stroke_width=4)

        r = always_redraw(rect)
        self.add(r)
        self.say("한 변을 기준으로 한 바퀴", "직사각형 모양의 종이를 한 변을 기준으로 한 바퀴 돌려 볼게요.")
        ghost = cylinder(W, H, C)
        self.play(t.animate.set_value(2 * np.pi), FadeIn(ghost, run_time=4.0), run_time=4.0, rate_func=linear)
        res = M(f"직사각형을 돌리면 {g('원기둥')}", 40).move_to([3.2, 0.3, 0])
        self.say(f"{g('원기둥')}이 만들어져요", "돌린 자리가 모여 원기둥이 만들어져요. 기준이 된 변의 길이가 원기둥의 높이, 돌린 변의 길이가 밑면의 반지름이 돼요.")
        self.play(FadeIn(res), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
