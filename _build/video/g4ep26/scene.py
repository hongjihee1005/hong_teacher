"""「수학 원리 돋보기」 4학년 26화 — 도형의 배열을 식으로 나타내기 (4-1 6단원 4·5차시, 화 코드 4-1-6-b)

바둑돌 1, 3, 5, 7 … (2개씩 늘어남) → 1+3+5 = 3×3 (정사각형으로 모으기), 다섯째까지 5×5 = 25
2+4+6+8+10 = 6×5 (직사각형) / 덧셈식과 곱셈식의 크기가 같음
최종: GRADE=4 ./make_final.sh 26
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Circle, Create, FadeIn, FadeOut, Indicate, LaggedStart, SurroundingRectangle,
                   Transform, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from angle import PURPLE

COLS = [ORANGE, BLUE, PURPLE, GREEN, "#C0392B", "#1F8A70"]


def stone(c, r=0.17):
    return Circle(radius=r, fill_color=c, fill_opacity=1, stroke_color=INK, stroke_width=2)


def L_shape(k, origin, s=0.42, color=ORANGE):
    """k번째 ㄱ자(2k-1개) — 정사각형 k×k의 바깥 껍질"""
    o_ = np.array(origin, float)
    pts = [(k - 1, j) for j in range(k)] + [(i, k - 1) for i in range(k - 1)]
    return VGroup(*[stone(color).move_to(o_ + np.array([x * s, -y * s, 0])) for x, y in pts])


class G4Ep26(EpisodeScene):
    GRADE, SEM = 4, 1
    EP_NO = 26
    EP_TITLE = "도형의 배열을 식으로 나타내기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.odd_square()
        self.even_rect()
        self.closing(f"늘어나는 수는 {o('덧셈식')}으로, 모아서 생긴 모양은 {b('곱셈식')}으로\n1 + 3 + 5 = {g('3 × 3')}처럼 크기가 같아요",
                     next_preview="4학년 27화 · 계산식의 배열에서 규칙 찾기")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("은지가 날마다 저금한 동전 수예요. 몇 개씩 늘어날까요?", 42)
        q.scale_to_fit_width(min(q.width, 10.4)).move_to([0.6, 2.3, 0])
        groups = VGroup()
        for k, n in enumerate([1, 3, 5, 7]):
            gp = VGroup(*[stone(ORANGE) for _ in range(n)]).arrange(RIGHT, buff=0.08)
            lab = T(f"{k + 1}일째", 30, SOFT)
            groups.add(VGroup(gp, lab).arrange(DOWN, buff=0.25))
        groups.arrange(RIGHT, buff=0.9).move_to([0, 0.0, 0])
        self.say("1개, 3개, 5개, 7개", "은지는 100원짜리 동전을 첫째 날 1개, 둘째 날 3개, 셋째 날 5개, 넷째 날 7개 저금했어요.")
        self.play(Write(q), LaggedStart(*[FadeIn(x) for x in groups], lag_ratio=0.3), run_time=1.6)
        t = M(f"{o('2개씩')} 늘어나요 → 덧셈식 1 + 2 = 3, 3 + 2 = 5 …", 40).move_to([0, -1.6, 0])
        self.say(f"{o('2개씩')} 늘어나요", "동전이 2개씩 늘어나요. 이 규칙은 덧셈식으로 나타낼 수 있어요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5, msg="모두 몇 개인지 쉽게 셀 방법은?")
        self.settle()
        clear_stage(self, 0.6)

    def odd_square(self):
        self.section("정사각형으로 모으기")
        org = np.array([-5.4, 1.6, 0])
        shells = [L_shape(k, org, color=COLS[k - 1]) for k in range(1, 6)]
        sums = ["1", "1 + 3", "1 + 3 + 5", "1 + 3 + 5 + 7", "1 + 3 + 5 + 7 + 9"]
        eq = None
        self.say("동전을 ㄱ자 모양으로 붙여 봐요", "날마다 저금한 동전을 ㄱ자 모양으로 차례로 붙여 볼까요?")
        for k in range(5):
            self.play(LaggedStart(*[FadeIn(s, scale=0.5) for s in shells[k]], lag_ratio=0.05), run_time=0.7)
            n = k + 1
            new = M(f"{sums[k]} = {n} × {n} = {g(str(n * n))}", 44).move_to([2.6, 0.6, 0])
            new.scale_to_fit_width(min(new.width, 7.0))
            if eq is None:
                eq = new
                self.play(FadeIn(eq), run_time=0.4)
            else:
                self.play(Transform(eq, new), run_time=0.5)
            if n == 3:
                self.say(f"1 + 3 + 5 = {g('3 × 3')}", "셋째 날까지 모으면 가로 3개, 세로 3개인 정사각형이 돼요. 1 더하기 3 더하기 5는 3 곱하기 3, 9개예요.")
                self.wait(0.6)
        self.say(f"다섯째 날까지 {g('5 × 5 = 25')}", "다섯째 날까지 모으면 5 곱하기 5, 25개. 하나하나 더하지 않아도 곱셈식으로 쉽게 구할 수 있어요.")
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def even_rect(self):
        self.section("직사각형으로 모으기")
        s = 0.3
        org = np.array([-5.0, 1.9, 0])
        cols = VGroup()
        for k, n in enumerate([2, 4, 6, 8, 10]):
            c = VGroup(*[stone(COLS[k], r=0.13).move_to(org + np.array([k * s, -j * s, 0])) for j in range(n)])
            cols.add(c)
        self.say("2, 4, 6, 8, 10개를 세워 놓으면?", "이번에는 바둑돌이 2개, 4개, 6개, 8개, 10개로 늘어나요. 모두 몇 개일까요?")
        self.play(LaggedStart(*[FadeIn(c) for c in cols], lag_ratio=0.25, run_time=1.4))
        ns = [2, 4, 6, 8, 10]
        rev = VGroup()
        for k in range(5):
            rev.add(VGroup(*[stone(COLS[4 - k], r=0.13).set_fill(opacity=0.45).move_to(org + np.array([k * s, -j * s, 0]))
                             for j in range(ns[k], 12)]))
        self.say("거꾸로 하나 더 붙이면 직사각형", "같은 배열을 하나 더 거꾸로 붙이면, 세로 12개, 가로 5개인 직사각형이 돼요.")
        self.play(LaggedStart(*[FadeIn(r) for r in rev], lag_ratio=0.15, run_time=1.2))
        box = SurroundingRectangle(VGroup(cols, rev), color=SOFT, buff=0.1, stroke_width=3)
        self.play(Create(box), run_time=0.5)
        e1 = M(f"전체: 12 × 5 = 60", 42).move_to([2.8, 1.0, 0])
        e2 = M(f"절반: 2+4+6+8+10 = {g('30')}", 42).move_to([2.8, 0.0, 0])
        e3 = M(f"= {g('6 × 5')}", 50).move_to([2.8, -1.0, 0])
        self.say(f"절반만 → 2+4+6+8+10 = {g('6 × 5')}", "전체는 12 곱하기 5, 60개. 그 절반이니까 2 더하기 4 더하기 6 더하기 8 더하기 10은 6 곱하기 5, 30개예요.")
        self.play(FadeIn(e1), run_time=0.4)
        self.play(FadeIn(e2), run_time=0.4)
        self.play(FadeIn(e3), run_time=0.4)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
