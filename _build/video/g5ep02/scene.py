"""「수학 원리 돋보기」 5학년 2화 — 곱셈과 나눗셈이 섞인 식 (5-1 1단원 3차시, 화 코드 5-1-1-b)

쿠키 32개를 4상자에 똑같이 나누어 담고 2상자를 가져감: 32 ÷ 4 × 2 = 16 (앞에서부터)
쿠키 32개를 4명씩 2모둠, 모두 8명에게 똑같이: 32 ÷ (4 × 2) = 4 (( ) 안을 먼저)
최종: GRADE=5 ./make_final.sh 2
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Circle, Create, FadeIn, FadeOut, Indicate, LaggedStart, Rectangle,
                   SurroundingRectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from mixcalc import Expr

COOKIE = "#C98B4B"


def cookies(n, w=0.26):
    return VGroup(*[Circle(radius=w / 2, fill_color=COOKIE, fill_opacity=1, stroke_color="#8A5A2B", stroke_width=2) for _ in range(n)])


class G5Ep02(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 2
    EP_TITLE = "곱셈과 나눗셈이 섞인 식"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.inorder()
        self.paren()
        self.closing(f"곱셈과 나눗셈이 섞인 식도 {o('앞에서부터 차례대로')}\n( )가 있으면 {g('( ) 안을 먼저')} 계산해요",
                     next_preview="5학년 3화 · 곱셈을 먼저 하는 까닭")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("쿠키 32개를 4상자에 똑같이 나누어 담았어요.\n2상자에 든 쿠키는 몇 개일까요?", 42).move_to([0.6, 1.5, 0])
        e = T("32 ÷ 4 × 2", 64).move_to([0, -0.6, 0])
        self.say("32 ÷ 4 × 2는?", "쿠키 32개를 4상자에 똑같이 나누어 담았어요. 2상자에 든 쿠키는 모두 몇 개일까요?")
        self.play(Write(q), run_time=1.0)
        self.play(FadeIn(e), run_time=0.5)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def boxes(self, y):
        bx = VGroup(*[Rectangle(width=1.5, height=1.1, stroke_color=INK, stroke_width=4, fill_color=PAPER, fill_opacity=1) for _ in range(4)]).arrange(RIGHT, buff=0.3).move_to([2.6, y, 0])
        cs = VGroup()
        for r in bx:
            c = cookies(8).arrange_in_grid(rows=2, cols=4, buff=0.08).move_to(r)
            cs.add(c)
        return bx, cs

    def inorder(self):
        self.section("앞에서부터 차례대로")
        e = Expr(["32", "÷", "4", "×", "2"], center=[-3.6, 1.7, 0], F=72)
        self.play(FadeIn(e.g), run_time=0.5)
        bx, cs = self.boxes(0.9)
        s1, s2 = e.steps()
        self.say(f"① 32 ÷ 4 = {o('8')}, 한 상자에 8개", "먼저 32개를 4상자에 똑같이 나누면 한 상자에 8개씩이에요. 32 나누기 4는 8.")
        self.play(FadeIn(bx), LaggedStart(*[FadeIn(c) for c in cs], lag_ratio=0.2, run_time=1.0), *e.mark(s1))
        sel = SurroundingRectangle(VGroup(bx[0], bx[1]), color=BLUE, buff=0.1, stroke_width=6)
        self.say(f"② 8 × 2 = {b('16')}, 2상자에 16개", "2상자를 가져가면 8의 2배, 16개예요.")
        self.play(Create(sel), *e.mark(s2), run_time=0.8)
        a = M(f"32 ÷ 4 × 2 = {g('16')}", 56).move_to([0, -2.1, 0])
        self.say(f"앞에서부터 차례대로 → {g('16')}", "곱셈과 나눗셈이 섞인 식도 앞에서부터 차례대로 계산해요. 2상자에는 쿠키가 16개 들어 있어요.")
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def paren(self):
        self.section("( )가 있는 식")
        q = M("쿠키 32개를 4명씩 2모둠 친구들에게\n똑같이 나누어 주면 한 명에게 몇 개?", 38).move_to([0.6, 2.0, 0])
        self.say("나누어 줄 사람 수를 먼저 구해요", "이번에는 쿠키 32개를 4명씩 2모둠 친구들에게 똑같이 나누어 주어요. 한 명이 몇 개씩 받을까요? 먼저 사람 수를 구해야 해요.")
        self.play(FadeIn(q), run_time=0.6)
        e = Expr(["32", "÷", "(", "4", "×", "2", ")"], center=[-3.0, 0.4, 0], F=72)
        self.play(FadeIn(e.g), run_time=0.5)
        s1, s2 = e.steps()
        ppl = VGroup(*[VGroup(*[Circle(radius=0.2, fill_color=c, fill_opacity=1, stroke_width=0) for _ in range(4)]).arrange(RIGHT, buff=0.12)
                       for c in (BLUE, GREEN)]).arrange(DOWN, buff=0.35).move_to([3.4, 0.3, 0])
        self.say(f"① 4 × 2 = {o('8')}명", "괄호 안을 먼저 계산해요. 4명씩 2모둠이니 4 곱하기 2, 모두 8명이에요.")
        self.play(FadeIn(ppl), *e.mark(s1), run_time=0.8)
        self.say(f"② 32 ÷ 8 = {b('4')}개씩", "32개를 8명에게 똑같이 나누면 한 명에게 4개씩이에요.")
        self.play(*e.mark(s2), run_time=0.8)
        a = M(f"32 ÷ 4 × 2 = 16\n32 ÷ (4 × 2) = {g('4')}", 40).move_to([3.5, -1.3, 0])
        self.say(f"( )가 있으면 {g('( ) 안을 먼저')}", "같은 수와 기호라도 괄호가 있으면 괄호 안을 먼저 계산해서 16과 4로 답이 달라져요.")
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
