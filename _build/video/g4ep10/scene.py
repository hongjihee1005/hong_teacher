"""「수학 원리 돋보기」 4학년 10화 — 각도의 합과 차 (4-1 2단원 각도 6차시, 화 코드 4-1-2-d)

합: 두 각을 꼭짓점과 한 변을 맞대어 이어 붙인 각도 (15° + 30° = 45°, 70° + 85° = 155°)
차: 큰 각에 작은 각을 겹쳐 남은 각도 (130° − 50° = 80°) / 자연수 계산처럼 하고 단위 °를 붙임
최종: GRADE=4 ./make_final.sh 10
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DEGREES, DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, Rotate,
                   Sector, Transform, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, g, o
from division import clear_stage
from angle import PURPLE, angle_fig, unit, wedge
from bignum import span


def colored(v, deg, start, color, L=3.2, r=1.3):
    """색칠한 부채꼴과 두 변"""
    a = angle_fig(v, deg, start=start, L=L, arc_r=0.001, color=color, width=6)
    w = Sector(radius=r, start_angle=start * DEGREES, angle=deg * DEGREES, arc_center=np.array(v, float),
               fill_color=color, fill_opacity=0.35, stroke_width=0)
    return VGroup(w, a)


class G4Ep10(EpisodeScene):
    GRADE, SEM = 4, 1
    EP_NO = 10
    EP_TITLE = "각도의 합과 차"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.add_angles(15, 30, "15° + 30°")
        self.add_angles(70, 85, "70° + 85°", second=True)
        self.sub_angles()
        self.closing(f"각도의 합과 차는 {o('자연수처럼')} 계산하고\n단위 {g('°')}를 꼭 붙여요",
                     next_preview="4학년 11화 · 삼각형의 세 각을 모으면?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("두 각을 이어 붙이면 몇 도가 될까요?", 48)
        q.scale_to_fit_width(min(q.width, 10.4)).move_to([0.6, 2.25, 0])
        a = colored([-4.2, -1.6, 0], 15, 0, ORANGE)
        b = colored([1.6, -1.6, 0], 30, 0, BLUE)
        la = T("15°", 44, ORANGE).move_to([-0.4, -1.0, 0])
        lb = T("30°", 44, BLUE).move_to([5.3, -0.9, 0])
        self.say("15°와 30°를 붙이면?", "15도인 각과 30도인 각을 이어 붙이면 몇 도가 될까요?")
        self.play(Write(q), run_time=0.9)
        self.play(FadeIn(a), FadeIn(b), FadeIn(la), FadeIn(lb), run_time=0.8)
        self.wait(1.0)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def add_angles(self, x, y, txt, second=False):
        self.section("각도의 합" if not second else "합이 직각보다 크면")
        v = np.array([-2.6, -1.9, 0])
        a = colored(v, x, 0, ORANGE)
        b = colored(np.array([2.6, -1.9, 0]), y, 0, BLUE)
        la = T(f"{x}°", 40, ORANGE).move_to(v + unit(x / 2) * (1.75 if x > 25 else 3.85))
        lb = T(f"{y}°", 40, BLUE).move_to(np.array([2.6, -1.9, 0]) + unit(y / 2) * 1.75)
        self.say(f"{txt}", f"{x}도와 {y}도를 더해 볼까요?" if not second else f"이번에는 {x}도와 {y}도예요.")
        self.play(FadeIn(a), FadeIn(b), FadeIn(la), FadeIn(lb), run_time=0.7)
        self.say(f"{o('꼭짓점')}과 {o('한 변')}을 맞대어 붙여요", "두 각의 꼭짓점을 맞추고, 한 변을 맞대어 이어 붙여요.")
        self.play(b.animate.shift(v - np.array([2.6, -1.9, 0])), FadeOut(lb), run_time=1.0)
        self.play(Rotate(b, x * DEGREES, about_point=v), run_time=1.0)
        lb2 = T(f"{y}°", 40, BLUE).move_to(v + unit(x + y / 2) * (1.75 if y > 25 else 3.85))
        self.play(FadeIn(lb2), run_time=0.3)
        tot = x + y
        arc = angle_fig(v, tot, L=0.01, arc_r=2.3, arc_color=GREEN, width=0)
        eq = M(f"{x}° + {y}° = {g(str(tot) + '°')}", 66)
        eq.scale_to_fit_width(min(eq.width, 6.4)).move_to([3.2, 1.7, 0])
        self.say(f"전체 각도 = {g(str(tot) + '°')}", f"붙인 전체 각도는 {x} 더하기 {y}, {tot}도예요. 자연수의 덧셈처럼 계산하고 도를 붙여요.")
        self.play(Create(arc[2]), run_time=0.7)
        self.play(FadeIn(eq, shift=LEFT * 0.2), run_time=0.6)
        if second:
            self.say(f"직각보다 큰 {span('둔각', '#C0392B')}이 되었어요", "두 예각을 더했더니 직각보다 큰 둔각이 되었어요.")
            self.wait(0.8)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def sub_angles(self):
        self.section("각도의 차")
        v = np.array([-0.6, -1.9, 0])
        big = colored(v, 130, 0, BLUE, r=1.3)
        sm = colored(np.array([3.4, -1.9, 0]), 50, 0, ORANGE, r=1.6)
        lb = T("130°", 40, BLUE).move_to(v + unit(105) * 1.8)
        ls = T("50°", 40, ORANGE).move_to(np.array([3.4, -1.9, 0]) + unit(25) * 2.1)
        self.say("130° − 50°는?", "이번에는 130도에서 50도를 빼 볼까요?")
        self.play(FadeIn(big), FadeIn(lb), FadeIn(sm), FadeIn(ls), run_time=0.7)
        self.say(f"큰 각 위에 작은 각을 {o('겹쳐요')}", "큰 각 위에 작은 각을 꼭짓점과 한 변을 맞추어 겹쳐요.")
        self.play(sm.animate.shift(v - np.array([3.4, -1.9, 0])), FadeOut(ls), run_time=1.0)
        ls2 = T("50°", 40, ORANGE).move_to(v + unit(25) * 2.1)
        self.play(FadeIn(ls2), run_time=0.3)
        rest = Sector(radius=2.4, start_angle=50 * DEGREES, angle=80 * DEGREES, arc_center=v,
                      fill_color=GREEN, fill_opacity=0.3, stroke_color=GREEN, stroke_width=3)
        self.say(f"남은 각도가 차 → {g('80°')}", "겹치고 남은 부분의 각도가 두 각도의 차예요. 130 빼기 50, 80도예요.")
        self.play(FadeIn(rest), run_time=0.7)
        lr = T("80°", 44, GREEN).move_to(v + unit(90) * 2.9)
        eq = M(f"130° − 50° = {g('80°')}", 66)
        eq.scale_to_fit_width(min(eq.width, 6.4)).move_to([3.4, 1.7, 0])
        self.play(FadeIn(lr), FadeIn(eq, shift=LEFT * 0.2), run_time=0.6)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
