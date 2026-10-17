"""「수학 원리 돋보기」 5학년 40화 — (대분수) × (대분수) (5-2 2단원 8차시, 화 코드 5-2-2-e)

1 1/2 × 1 1/4: 가분수로 3/2 × 5/4 = 15/8 = 1 7/8
나누어 계산: (1 1/2 × 1) + (1 1/2 × 1/4) = 1 1/2 + 3/8 = 1 7/8
자연수끼리·분수끼리만 곱하면 1 1/8 → 틀림 (넓이 그림에서 빠진 부분)
최종: GRADE=5 ./make_final.sh 40
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, Cross, FadeIn, FadeOut, Indicate, LaggedStart, Rectangle, VGroup,
                   Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, mixed, row

RED = "#C0392B"


class G5Ep40(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 40
    EP_TITLE = "(대분수) × (대분수)"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.improper()
        self.area()
        self.closing(f"(대분수) × (대분수)는 {o('가분수로 바꾸어')} 곱해요\n자연수끼리, 분수끼리만 곱하면 {RED_T('안 돼요')}",
                     next_preview="5학년 41화 · 합동")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("가로 1 1/2 m, 세로 1 1/4 m인\n직사각형 천의 넓이는 몇 m²일까요?", 44).move_to([0.6, 1.6, 0])
        self.say("1과 1/2 × 1과 1/4", "가로가 1과 2분의 1미터, 세로가 1과 4분의 1미터인 직사각형 천의 넓이는 몇 제곱미터일까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def improper(self):
        self.section("가분수로 바꾸어 곱하기")
        e = row(mixed(1, 1, 2, 56), "×", mixed(1, 1, 4, 56), "=", frac(3, 2, 56, cn=BLUE), "×", frac(5, 4, 56, cn=BLUE), "=", frac(15, 8, 56), "=", mixed(1, 7, 8, 56, cw=GREEN, cn=GREEN, cd=GREEN), size=50)
        e.scale_to_fit_width(min(e.width, 12.4)).move_to([0, 0.8, 0])
        self.say(f"가분수로 바꾸면 {b('3/2 × 5/4')}", "두 대분수를 가분수로 바꾸면 2분의 3 곱하기 4분의 5예요.")
        self.play(FadeIn(e[:7]), run_time=0.8)
        self.say(f"분자끼리, 분모끼리 → 15/8 = {g('1과 7/8')}", "분자끼리, 분모끼리 곱하면 8분의 15, 대분수로 1과 8분의 7 제곱미터예요.")
        self.play(FadeIn(e[7:]), run_time=0.7)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def area(self):
        self.section("넓이 그림으로 확인")
        u = 2.2
        x0, y0 = -5.0, -1.4
        W, H = 1.5 * u, 1.25 * u
        big = Rectangle(width=u, height=u, fill_color=BLUE, fill_opacity=0.35, stroke_color=INK, stroke_width=3).move_to([x0 + u / 2, y0 + u / 2, 0])
        rgt = Rectangle(width=0.5 * u, height=u, fill_color=ORANGE, fill_opacity=0.35, stroke_color=INK, stroke_width=3).move_to([x0 + 1.25 * u, y0 + u / 2, 0])
        top = Rectangle(width=u, height=0.25 * u, fill_color=ORANGE, fill_opacity=0.35, stroke_color=INK, stroke_width=3).move_to([x0 + u / 2, y0 + 1.125 * u, 0])
        corner = Rectangle(width=0.5 * u, height=0.25 * u, fill_color=GREEN, fill_opacity=0.5, stroke_color=INK, stroke_width=3).move_to([x0 + 1.25 * u, y0 + 1.125 * u, 0])
        lw = T("1과 1/2", 28).next_to(VGroup(big, rgt), DOWN, buff=0.15)
        lh = T("1과 1/4", 28).next_to(VGroup(big, top), LEFT, buff=0.15)
        labs = VGroup(T("1", 30).move_to(big), T("1/2", 26).move_to(rgt), T("1/4", 24).move_to(top), T("1/8", 22).move_to(corner))
        self.say("천을 네 부분으로 나누어 봐요", "천을 1 곱하기 1, 2분의 1 곱하기 1, 1 곱하기 4분의 1, 2분의 1 곱하기 4분의 1의 네 부분으로 나누어 볼게요.")
        self.play(FadeIn(big), FadeIn(rgt), FadeIn(top), FadeIn(corner), FadeIn(lw), FadeIn(lh), run_time=0.8)
        self.play(LaggedStart(*[FadeIn(l) for l in labs], lag_ratio=0.25, run_time=1.0))
        e = M(f"1 + 1/2 + 1/4 + 1/8\n= 8/8 + 4/8 + 2/8 + 1/8 = {g('15/8')}", 32).move_to([2.6, 1.6, 0])
        self.say(f"모두 더하면 {g('15/8')}", "네 부분을 모두 더하면 8분의 15. 가분수로 곱한 답과 같아요.")
        self.play(FadeIn(e), run_time=0.6)
        w = M(f"자연수끼리 1 × 1, 분수끼리 1/2 × 1/4만 하면\n1과 1/8 → {RED_T('주황색 두 부분이 빠져요')}", 30).move_to([2.6, -0.1, 0])
        self.say(f"자연수끼리, 분수끼리만 곱하면 {RED_T('틀려요')}", "자연수끼리 1 곱하기 1, 분수끼리 2분의 1 곱하기 4분의 1만 하면 1과 8분의 1이 되어 주황색 두 부분이 빠져요. 그래서 가분수로 바꾸어 곱해요.")
        self.play(FadeIn(w), Indicate(VGroup(rgt, top), color=RED), run_time=0.9)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()


def RED_T(s):
    return f'<span foreground="{RED}">{s}</span>'
