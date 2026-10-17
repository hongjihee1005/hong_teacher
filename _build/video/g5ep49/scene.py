"""「수학 원리 돋보기」 5학년 49화 — (소수) × (소수) (5-2 4단원 6차시, 화 코드 5-2-4-c)

가로 0.8 m, 세로 0.6 m인 천: 1 m²를 100칸(0.01 m²)으로 나눈 모눈에서 8칸 × 6줄 = 48칸 → 0.48 m²
3.4 × 1.7 = 34/10 × 17/10 = 578/100 = 5.78 (34 × 17 = 578의 1/100배)
1보다 작은 두 수의 곱은 두 수보다 작음
최종: GRADE=5 ./make_final.sh 49
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Arrow, Create, FadeIn, FadeOut, Indicate, LaggedStart, Rectangle, VGroup,
                   Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from decimal4 import grid100
from fraction import frac, row


class G5Ep49(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 49
    EP_TITLE = "(소수) × (소수)"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.area()
        self.calc()
        self.closing(f"자연수처럼 곱한 뒤 {o('두 소수의 소수점 아래 자리 수')}만큼\n1/10배, 1/100배 … 해요",
                     next_preview="5학년 50화 · 소수 두 자리 × 소수 한 자리")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("가로 0.8 m, 세로 0.6 m인 천의 넓이는 몇 m²일까요?", 44)
        q.scale_to_fit_width(min(q.width, 11.0)).move_to([0.6, 1.8, 0])
        self.say("0.8 × 0.6은?", "가로 0.8미터, 세로 0.6미터인 직사각형 천의 넓이는 몇 제곱미터일까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def area(self):
        self.section("1 m² 모눈으로")
        S = 3.8
        gr = grid100(0, S).move_to([-2.8, 0.1, 0])
        l1 = T("1 m", 30).next_to(gr, DOWN, buff=0.12)
        l2 = T("1 m", 30).next_to(gr, LEFT, buff=0.12)
        self.say("1 m²를 100칸으로", "한 변이 1미터인 정사각형을 가로 10칸, 세로 10칸, 모두 100칸으로 나누면 한 칸은 0.01 제곱미터예요.")
        self.play(FadeIn(gr), FadeIn(l1), FadeIn(l2), run_time=0.7)
        cells = gr[0]
        sel = [cells[r * 10 + c] for r in range(4, 10) for c in range(8)]
        self.say(f"가로 {o('8칸')}, 세로 {b('6줄')}", "가로 0.8미터는 8칸, 세로 0.6미터는 6줄이에요.")
        self.play(*[x.animate.set_fill(ORANGE, 1) for x in sel], run_time=1.2)
        e = M(f"8 × 6 = {o('48칸')}\n0.01 m²가 48개 → {g('0.48 m²')}", 42).move_to([3.4, 0.6, 0])
        self.say(f"48칸 → {g('0.48 m²')}", "8칸씩 6줄이니 48칸. 0.01 제곱미터가 48개라서 넓이는 0.48 제곱미터예요.")
        self.play(FadeIn(e), run_time=0.6)
        n = M(f"0.8 × 0.6 = {g('0.48')}", 50).move_to([3.4, -1.0, 0])
        self.play(FadeIn(n), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def calc(self):
        self.section("3.4 × 1.7")
        a = M("34 × 17 = 578", 62).move_to([-3.0, 1.3, 0])
        b_ = M(f"3.4 × 1.7 = {g('5.78')}", 62).move_to([-3.0, -0.4, 0])
        ar = Arrow(a.get_bottom(), b_.get_top(), color=ORANGE, buff=0.1)
        l = T("1/10 × 1/10 = 1/100배", 28, ORANGE).next_to(ar, RIGHT, buff=0.1)
        self.say("3.4 × 1.7은?", "3.4 곱하기 1.7은 어떨까요? 34 곱하기 17은 578이에요.")
        self.play(FadeIn(a), run_time=0.5)
        self.say(f"두 수가 모두 1/10배 → 곱은 {o('1/100배')}", "3.4는 34의 10분의 1배, 1.7은 17의 10분의 1배예요. 곱은 10분의 1의 10분의 1, 100분의 1배가 되어 5.78이에요.")
        self.play(Create(ar), FadeIn(l), FadeIn(b_), run_time=0.9)
        f = row(frac(34, 10, 46), "×", frac(17, 10, 46), "=", frac(578, 100, 46), "=", M(g("5.78"), 52), size=44).move_to([2.9, -1.7, 0])
        self.play(FadeIn(f), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
