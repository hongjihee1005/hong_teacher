"""「수학 원리 돋보기」 37화 — 곱셈과 나눗셈은 어떤 사이일까? (1학기 3단원 4차시, 화 코드 1-3-b)

원반 21개를 3줄 7개 배열 → 가로로 묶기(3 × 7 = 21, 21 ÷ 3 = 7) → 세로로 묶기(7 × 3 = 21, 21 ÷ 7 = 3)
→ 곱셈식 하나 ↔ 나눗셈식 둘 → 수 카드 7, 4, 28
최종: ./make_final.sh 37
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Circle, Create, FadeIn, FadeOut, Indicate, LaggedStart, RoundedRectangle,
                   SurroundingRectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage


def disc(color=GREEN):
    return VGroup(Circle(radius=0.22, fill_color=color, fill_opacity=0.85, stroke_color=INK, stroke_width=2.5),
                  Circle(radius=0.07, fill_color=PAPER, fill_opacity=1, stroke_width=0))


class Ep37(EpisodeScene):
    EP_NO = 37
    EP_TITLE = "곱셈과 나눗셈은 어떤 사이일까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.array()
        self.family()
        self.cards()
        self.closing(f"곱셈식 하나는 {g('나눗셈식 둘')}로,\n나눗셈식 하나는 {g('곱셈식 둘')}로 바꿀 수 있어요",
                     next_preview="38화 · 곱셈구구로 몫을 구해요")
        self.wait(0.5)

    def grid(self):
        g_ = VGroup()
        for r in range(3):
            for c in range(7):
                g_.add(disc().move_to([-4.6 + c * 0.62, 1.0 - r * 0.62, 0]))
        return g_

    def problem(self):
        self.section("문제")
        g_ = self.grid()
        self.say("원반이 3줄에 7개씩 있어요", "원반던지기에 쓸 원반이 3줄에 7개씩 놓여 있어요.")
        self.play(LaggedStart(*[FadeIn(d, scale=0.5) for d in g_], lag_ratio=0.03, run_time=1.2))
        q = M(f"곱셈식과 나눗셈식으로\n어떻게 나타낼까요?", 48).move_to([3.4, 0.4, 0])
        self.say("곱셈식과 나눗셈식으로 어떻게 나타낼까요?", "이 원반을 곱셈식과 나눗셈식으로 어떻게 나타낼 수 있을까요?")
        self.play(FadeIn(q), run_time=0.6)
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def array(self):
        self.section("가로로, 세로로 묶기")
        g_ = self.grid()
        self.play(FadeIn(g_), run_time=0.5)
        rows = VGroup(*[SurroundingRectangle(VGroup(*g_[r * 7:(r + 1) * 7]), color=BLUE, buff=0.06, stroke_width=5, corner_radius=0.15) for r in range(3)])
        self.say(f"가로로 묶으면 {b('7개씩 3줄')}", "가로로 묶어 보면 7개씩 3줄이에요.")
        self.play(LaggedStart(*[Create(r) for r in rows], lag_ratio=0.3, run_time=1.0))
        e1 = M(f"{b('7')} × 3 = 21", 52).move_to([3.4, 1.6, 0])
        e2 = M(f"21 ÷ 3 = {b('7')}", 52).move_to([3.4, 0.7, 0])
        self.say(f"7 × 3 = 21, 그리고 21 ÷ 3 = {b('7')}", "7개씩 3줄이니 7 곱하기 3은 21. 거꾸로 21개를 3줄로 똑같이 나누면 한 줄에 7개, 21 나누기 3은 7이에요.")
        self.play(FadeIn(e1), run_time=0.5)
        self.play(FadeIn(e2), run_time=0.5)
        self.wait(0.8)
        self.play(FadeOut(rows), run_time=0.3)
        cols = VGroup(*[SurroundingRectangle(VGroup(g_[c], g_[c + 7], g_[c + 14]), color=ORANGE, buff=0.06, stroke_width=5, corner_radius=0.15) for c in range(7)])
        self.say(f"세로로 묶으면 {o('3개씩 7줄')}", "이번에는 세로로 묶어 볼까요? 3개씩 7줄이에요.")
        self.play(LaggedStart(*[Create(c) for c in cols], lag_ratio=0.15, run_time=1.2))
        e3 = M(f"{o('3')} × 7 = 21", 52).move_to([3.4, -0.5, 0])
        e4 = M(f"21 ÷ 7 = {o('3')}", 52).move_to([3.4, -1.4, 0])
        self.say(f"3 × 7 = 21, 그리고 21 ÷ 7 = {o('3')}", "3개씩 7줄이니 3 곱하기 7은 21. 21개를 7줄로 똑같이 나누면 3개씩, 21 나누기 7은 3이에요.")
        self.play(FadeIn(e3), run_time=0.5)
        self.play(FadeIn(e4), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def family(self):
        self.section("곱셈과 나눗셈의 관계")
        top = M("3 × 7 = 21", 80).move_to([0, 1.6, 0])
        l = M(f"21 ÷ 3 = {g('7')}", 64).move_to([-3.0, -0.6, 0])
        r = M(f"21 ÷ 7 = {g('3')}", 64).move_to([3.0, -0.6, 0])
        from manim import Arrow
        a1 = Arrow(top.get_bottom() + LEFT * 0.8, l.get_top(), color=SOFT, stroke_width=5)
        a2 = Arrow(top.get_bottom() + RIGHT * 0.8, r.get_top(), color=SOFT, stroke_width=5)
        self.say("곱셈식 하나에서 나눗셈식 두 개가 나와요", "곱셈식 3 곱하기 7은 21 하나에서 나눗셈식 두 개를 만들 수 있어요.")
        self.play(FadeIn(top), run_time=0.5)
        self.play(Create(a1), FadeIn(l), run_time=0.6)
        self.play(Create(a2), FadeIn(r), run_time=0.6)
        t = M(f"곱을 {b('나누어지는 수')}로, 곱한 두 수를 {o('나누는 수')}와 {g('몫')}으로", 38).move_to([0, -2.0, 0])
        self.say("곱이 나누어지는 수가 돼요", "곱 21이 나누어지는 수가 되고, 곱한 두 수가 나누는 수와 몫이 돼요.")
        self.play(FadeIn(t), run_time=0.6)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)

    def cards(self):
        self.section("수 카드로 식 만들기")
        cs = VGroup()
        for n in ("7", "4", "28"):
            box = RoundedRectangle(corner_radius=0.15, width=1.3, height=1.5, fill_color=PAPER, fill_opacity=1, stroke_color=INK, stroke_width=4)
            cs.add(VGroup(box, T(n, 60).move_to(box)))
        cs.arrange(RIGHT, buff=0.5).move_to([0, 1.6, 0])
        self.say("수 카드 7, 4, 28로 식을 만들어요", "수 카드 7, 4, 28을 한 번씩만 써서 곱셈식과 나눗셈식을 만들어 볼까요?")
        self.play(FadeIn(cs), run_time=0.6)
        self.wait(2.0)
        eqs = VGroup(M("7 × 4 = 28", 50), M("4 × 7 = 28", 50), M("28 ÷ 7 = 4", 50), M("28 ÷ 4 = 7", 50))
        eqs.arrange_in_grid(rows=2, cols=2, buff=(1.4, 0.4)).move_to([0, -0.6, 0])
        self.say("곱셈식 두 개, 나눗셈식 두 개", "곱셈식 두 개와 나눗셈식 두 개를 만들 수 있어요. 가장 큰 수 28은 곱이자 나누어지는 수예요.")
        self.play(LaggedStart(*[FadeIn(e) for e in eqs], lag_ratio=0.3, run_time=1.4))
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
