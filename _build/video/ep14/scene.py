"""「수학 원리 돋보기」 14화 — 분모가 같은 분수의 크기 비교 (2학기 4단원 분수 7차시, 화 코드 2-4-e)

7분의 5와 7분의 3: 막대로 견주기 → 단위분수 7분의 1이 몇 개인가 → 수직선(8분의 5)
→ 대분수끼리(자연수 먼저) → 가분수와 대분수(한 가지로 바꾸어)
최종: ./make_final.sh 14
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (
    DOWN, LEFT, RIGHT, UP,
    Arrow, Create, Dot, FadeIn, FadeOut, Indicate, LaggedStart, Line, SurroundingRectangle, Triangle, VGroup, Write,
)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, frac_bar, mixed, row


class Ep14(EpisodeScene):
    EP_NO = 14
    EP_TITLE = "분모가 같은 분수의 크기 비교"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.bars()
        self.numline()
        self.mixed_cmp()
        self.improper_cmp()
        self.closing(f"분모가 같으면 {o('분자가 큰')} 분수가 더 커요\n(단위분수가 몇 개인지 견주어요)",
                     next_preview="15화 · 들이는 어떻게 비교하고 나타낼까?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        a = frac(5, 7, 110, cn=ORANGE).move_to([-2.2, -0.2, 0])
        bq = frac(3, 7, 110, cn=BLUE).move_to([2.2, -0.2, 0])
        mid = T("○", 90, SOFT).move_to([0, -0.2, 0])
        q = M("어느 분수가 더 클까요?", 60).move_to([0, 2.2, 0])
        self.say("피자 7분의 5와 7분의 3", "똑같은 피자를 7조각으로 나누었어요. 7분의 5와 7분의 3, 어느 쪽이 더 많을까요?")
        self.play(Write(q), FadeIn(a), FadeIn(bq), FadeIn(mid), run_time=1.2)
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def bars(self):
        self.section("막대로 견주기")
        b1 = frac_bar(7, 5, width=8.4, height=0.75, color=ORANGE).move_to([0.9, 1.5, 0])
        b2 = frac_bar(7, 3, width=8.4, height=0.75, color=BLUE).move_to([0.9, -0.1, 0])
        l1 = frac(5, 7, 48, cn=ORANGE).next_to(b1, LEFT, buff=0.4)
        l2 = frac(3, 7, 48, cn=BLUE).next_to(b2, LEFT, buff=0.4)
        self.say("똑같은 막대를 7칸으로 나누어 칠해요", "똑같은 막대를 똑같이 7칸으로 나누어 칠해 볼게요.")
        self.play(FadeIn(b1), FadeIn(l1), FadeIn(b2), FadeIn(l2), run_time=0.9)
        self.wait(0.6)
        self.say(f"7분의 1이 {o('5개')}와 {b('3개')}", "7분의 5는 7분의 1이 5개, 7분의 3은 7분의 1이 3개예요.")
        n1 = VGroup(*[T(str(i + 1), 30, PAPER).move_to(b1[i]) for i in range(5)])
        n2 = VGroup(*[T(str(i + 1), 30, PAPER).move_to(b2[i]) for i in range(3)])
        self.play(LaggedStart(*[FadeIn(x) for x in n1], lag_ratio=0.15), LaggedStart(*[FadeIn(x) for x in n2], lag_ratio=0.15), run_time=1.2)
        ln = Line(b2[2].get_right() + UP * 1.0, b2[2].get_right() + DOWN * 0.5, color=SOFT, stroke_width=4)
        self.play(Create(ln), run_time=0.5)
        res = row(frac(5, 7, 60, cn=ORANGE), "&gt;", frac(3, 7, 60, cn=BLUE), size=70).move_to([0, -1.85, 0])
        self.say(f"5개가 더 많으니 {o('7분의 5')}가 더 커요", "같은 크기의 조각이 5개인 쪽이 더 많아요. 7분의 5가 더 커요.")
        self.play(FadeIn(res, scale=1.2), run_time=0.7)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)

    def numline(self):
        self.section("수직선에서 보기")
        L, R, y = -5.6, 5.6, 0.2
        line = Line([L, y, 0], [R, y, 0], color=INK, stroke_width=5)
        ticks = VGroup()
        for k in range(9):
            x = L + (R - L) * k / 8
            ticks.add(Line([x, y + 0.18, 0], [x, y - 0.18, 0], color=INK, stroke_width=4 if k in (0, 8) else 3))
        z = T("0", 44).move_to([L, y - 0.6, 0])
        one = T("1", 44).move_to([R, y - 0.6, 0])
        self.say("0부터 1까지를 똑같이 8칸으로 나누었어요", "수직선에서 0부터 1까지를 똑같이 8칸으로 나누었어요. 한 칸은 8분의 1이에요.")
        self.play(Create(line), Create(ticks), FadeIn(z), FadeIn(one), run_time=1.0)
        step = (R - L) / 8
        hops = VGroup()
        for k in range(5):
            a = np.array([L + k * step, y + 0.3, 0])
            hops.add(Arrow(a, a + RIGHT * step, buff=0.02, color=ORANGE, stroke_width=5, max_tip_length_to_length_ratio=0.2).shift(UP * 0.25))
        self.say(f"8분의 1씩 {o('5번')} 가면 {o('8분의 5')}", "8분의 1씩 5번 가면 8분의 5예요.")
        self.play(LaggedStart(*[Create(h) for h in hops], lag_ratio=0.35, run_time=2.0))
        p5 = Dot([L + 5 * step, y, 0], radius=0.12, color=ORANGE)
        f5 = frac(5, 8, 46, cn=ORANGE).next_to(p5, DOWN, buff=0.5)
        self.play(FadeIn(p5, scale=2), FadeIn(f5), run_time=0.6)
        p3 = Dot([L + 3 * step, y, 0], radius=0.12, color=BLUE)
        f3 = frac(3, 8, 46, cn=BLUE).next_to(p3, DOWN, buff=0.5)
        self.say(f"{b('8분의 3')}은 더 왼쪽", "8분의 3은 3칸이니 더 왼쪽에 있어요. 수직선에서는 오른쪽에 있을수록 큰 수예요.")
        self.play(FadeIn(p3, scale=2), FadeIn(f3), run_time=0.6)
        arr = Arrow([-2.0, 2.2, 0], [2.0, 2.2, 0], buff=0, color=GREEN, stroke_width=6)
        al = T("오른쪽일수록 커요", 40, GREEN).next_to(arr, UP, buff=0.15)
        self.play(Create(arr), FadeIn(al), run_time=0.7)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)

    def mixed_cmp(self):
        self.section("대분수끼리 비교")
        a = mixed(1, 2, 5, 90).move_to([-2.4, 0.9, 0])
        c = mixed(2, 1, 5, 90).move_to([2.4, 0.9, 0])
        self.say("1과 5분의 2와 2와 5분의 1, 어느 쪽이 클까요?", "1과 5분의 2와 2와 5분의 1, 어느 쪽이 더 클까요?")
        self.play(FadeIn(a), FadeIn(c), run_time=0.7)
        self.wait(1.6)
        self.say(f"먼저 {g('자연수')}를 견주어요: 1 &lt; 2", "대분수는 먼저 자연수 부분을 견주어요. 1보다 2가 크니까 2와 5분의 1이 더 커요.")
        self.play(a.whole.animate.set_color(GREEN), c.whole.animate.set_color(GREEN), run_time=0.5)
        self.play(Indicate(c.whole, color=GREEN, scale_factor=1.4), run_time=0.8)
        res = row(mixed(1, 2, 5, 60), "&lt;", mixed(2, 1, 5, 60, cw=GREEN), size=70).move_to([0, -1.1, 0])
        self.play(FadeIn(res), run_time=0.6)
        tip = M(f"자연수가 같으면 그다음 {o('분자')}를 견주어요", 42).move_to([0, -2.2, 0])
        self.play(FadeIn(tip), run_time=0.5)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)

    def improper_cmp(self):
        self.section("가분수와 대분수 비교")
        a = frac(7, 3, 90, cn=ORANGE).move_to([-2.4, 1.0, 0])
        c = mixed(2, 2, 3, 90).move_to([2.4, 1.0, 0])
        self.say("3분의 7과 2와 3분의 2는?", "이번에는 가분수 3분의 7과 대분수 2와 3분의 2를 견주어 볼까요?")
        self.play(FadeIn(a), FadeIn(c), run_time=0.7)
        self.wait(1.6)
        conv = row(frac(7, 3, 56, cn=ORANGE), "=", mixed(2, 1, 3, 56), size=56).move_to([-2.4, -1.1, 0])
        self.say(f"한 가지로 바꾸면 쉬워요: 3분의 7 = {o('2와 3분의 1')}", "모양이 다르면 한 가지로 바꾸면 쉬워요. 3분의 7은 3분의 1이 7개, 곧 2와 3분의 1이에요.")
        self.play(FadeIn(conv), run_time=0.7)
        self.wait(0.8)
        res = row(mixed(2, 1, 3, 56), "&lt;", mixed(2, 2, 3, 56, cn=GREEN), size=60).move_to([2.4, -1.1, 0])
        self.say(f"자연수가 같으니 분자: 1 &lt; 2 → {g('2와 3분의 2')}가 더 커요",
                 "자연수 2가 같으니 분자를 견주면 1보다 2가 커요. 그래서 2와 3분의 2가 더 커요.")
        self.play(FadeIn(res), run_time=0.7)
        bx = SurroundingRectangle(c, color=GREEN, buff=0.15, stroke_width=6, corner_radius=0.15)
        self.play(Create(bx), run_time=0.5)
        self.wait(1.8)
        self.settle()
        clear_stage(self, 0.7)
        self.hide_chip()
