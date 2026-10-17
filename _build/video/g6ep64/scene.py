"""「수학 원리 돋보기」 6학년 64화 — 원기둥의 전개도 (6-2 6단원 3~4차시, 화 코드 6-2-6-b)

원기둥을 잘라서 펼쳐 놓은 그림 = 원기둥의 전개도: 밑면은 합동인 원 2개, 옆면은 직사각형 1개
옆면의 가로 = 밑면의 둘레 = (밑면의 지름) × (원주율), 옆면의 세로 = 원기둥의 높이
두 밑면은 옆면의 마주 보는 두 변에 하나씩 붙어 있어야 함
(예시: 반지름 3 cm, 높이 10 cm → 옆면 가로 6 × 3.14 = 18.84 cm — 이 영상에서 정한 크기)
최종: GRADE=6 ./make_final.sh 64
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, PI, RIGHT, UP, Brace, Circle, Create, FadeIn, FadeOut, Indicate, LaggedStart, Line,
                   Rectangle, ReplacementTransform, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from round3d import cylinder

YEL = "#F2C14E"
U = 0.24     # 1 cm
RR, HH = 3, 10


class G6Ep64(EpisodeScene):
    GRADE, SEM = 6, 2
    EP_NO = 64
    EP_TITLE = "원기둥의 전개도"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.unroll()
        self.lengths()
        self.closing(f"원기둥의 전개도: 밑면 {o('원 2개')}, 옆면 {b('직사각형 1개')}\n옆면의 가로 = {g('밑면의 둘레')}, 세로 = 높이",
                     next_preview="6학년 65화 · 원뿔이란?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("원기둥을 잘라서 펼치면 옆면은 어떤 모양이 될까요?", 42).move_to([0.6, 2.0, 0])
        self.say("옆면을 펼치면?", "원기둥을 잘라서 펼치면 굽은 옆면은 어떤 모양이 될까요?")
        self.play(Write(q), run_time=0.9)
        cy = cylinder(1.0, 2.2, (0, -0.6, 0))
        self.play(FadeIn(cy), run_time=0.6)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def unroll(self):
        self.section("펼치기")
        cy = cylinder(RR * U, HH * U, (-4.6, 0.0, 0))
        self.play(FadeIn(cy), run_time=0.4)
        Wd = 2 * PI * RR * U
        side = Rectangle(width=Wd, height=HH * U, fill_color=BLUE, fill_opacity=0.45, stroke_color=INK, stroke_width=4).move_to([1.6, 0.1, 0])
        self.say(f"옆면은 {b('직사각형')}", "옆면을 한 줄로 잘라 펼치면 직사각형이 돼요.")
        self.play(ReplacementTransform(cy.side.copy(), side), run_time=1.4)
        top = Circle(radius=RR * U, fill_color=ORANGE, fill_opacity=0.55, stroke_color=INK, stroke_width=4).next_to(side, UP, buff=0)
        bot = Circle(radius=RR * U, fill_color=ORANGE, fill_opacity=0.55, stroke_color=INK, stroke_width=4).next_to(side, DOWN, buff=0)
        top.shift(LEFT * Wd * 0.25)
        bot.shift(LEFT * Wd * 0.25)
        self.say(f"밑면은 {o('원 2개')}", "두 밑면은 합동인 원 2개예요. 옆면의 위와 아래, 마주 보는 두 변에 하나씩 붙어 있어요.")
        self.play(ReplacementTransform(cy.top.copy(), top), FadeIn(bot), run_time=1.0)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def lengths(self):
        self.section("옆면의 가로와 세로")
        Wd = 2 * PI * RR * U
        C = np.array([-2.4, 0.0, 0])
        side = Rectangle(width=Wd, height=HH * U, fill_color=BLUE, fill_opacity=0.45, stroke_color=INK, stroke_width=4).move_to(C)
        top = Circle(radius=RR * U, fill_color=ORANGE, fill_opacity=0.55, stroke_color=INK, stroke_width=4).next_to(side, UP, buff=0).shift(LEFT * Wd * 0.25)
        bot = Circle(radius=RR * U, fill_color=ORANGE, fill_opacity=0.55, stroke_color=INK, stroke_width=4).next_to(side, DOWN, buff=0).shift(LEFT * Wd * 0.25)
        self.play(FadeIn(side), FadeIn(top), FadeIn(bot), run_time=0.5)
        rl = Line(top.get_center(), top.get_center() + RIGHT * RR * U, color=INK, stroke_width=3)
        rt = M("3 cm", 22).next_to(rl, UP, buff=0.04)
        self.play(Create(rl), FadeIn(rt), run_time=0.4)
        hb = Brace(side, LEFT, color=GREEN)
        ht = M(f"높이 {g('10 cm')}", 28).next_to(hb, LEFT, buff=0.08)
        self.say(f"세로 = 원기둥의 {g('높이')}", "옆면의 세로는 원기둥의 높이와 같아요. 10 센티미터예요.")
        self.play(FadeIn(hb), FadeIn(ht), run_time=0.5)
        line = Line(side.get_corner(DOWN + LEFT), side.get_corner(DOWN + RIGHT), color=ORANGE, stroke_width=9)
        circ = Circle(radius=RR * U, color=ORANGE, stroke_width=9).move_to(bot)
        self.say(f"가로 = {o('밑면의 둘레')}", "옆면의 가로는 밑면의 둘레와 같아요. 옆면이 밑면 둘레를 한 바퀴 감싸고 있었거든요.")
        self.play(Create(circ), run_time=0.7)
        self.play(ReplacementTransform(circ, line), run_time=1.0)
        e = M(f"가로 = 지름 × 원주율\n= 6 × 3.14 = {o('18.84')} (cm)", 34).move_to([3.6, 0.3, 0])
        self.say(f"6 × 3.14 = {o('18.84 cm')}", "밑면의 지름이 6 센티미터이니 옆면의 가로는 6 곱하기 3.14, 18.84 센티미터예요.")
        self.play(FadeIn(e), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
