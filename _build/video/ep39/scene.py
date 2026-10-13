"""「수학 원리 돋보기」 39화 — 20 × 3과 23 × 3은 어떻게 계산할까? (1학기 4단원 곱셈 2·3차시, 화 코드 1-4-a)

20 × 3: 20씩 뛰어 세기 → 십 모형 2개씩 3묶음 = 십 모형 6개 = 60 (2 × 3의 10배)
23 × 3: 십 모형과 일 모형을 따로 곱해 더하기(60 + 9) → 세로셈
최종: ./make_final.sh 39
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import DOWN, LEFT, RIGHT, UP, Arrow, ArcBetweenPoints, Create, FadeIn, Indicate, LaggedStart, Line, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from multiply import blocks_rows, cm, mul_vertical


class Ep39(EpisodeScene):
    EP_NO = 39
    EP_TITLE = "20 × 3과 23 × 3은 어떻게 계산할까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.jump()
        self.tens()
        self.split23()
        self.section("세로셈으로 23 × 3")
        mul_vertical(self, 23, 3)
        self.settle(); self.clear_sub(); clear_stage(self, 0.6)
        self.hide_chip()
        self.closing(f"(몇십) × (몇)은 (몇) × (몇)의 {g('10배')}\n(몇십몇) × (몇)은 {b('십')}과 {o('일')}을 따로 곱해 더해요",
                     next_preview="40화 · 곱셈에서 올림은 왜 생길까?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M(f"책상 한 개에 의자가 {b('20개')}씩, 책상이 {o('3개')}예요.\n의자는 모두 몇 개일까요?", 52).move_to([0, 1.3, 0])
        self.say("책상 하나에 의자 20개씩, 책상 3개", "강당의 책상 한 개에 의자가 20개씩 놓여 있어요. 책상 3개에 놓인 의자는 모두 몇 개일까요?")
        self.play(Write(q), run_time=1.2)
        e = M("20 × 3 = ?", 100).move_to([0, -0.8, 0])
        self.play(FadeIn(e), run_time=0.5)
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def jump(self):
        self.section("20씩 뛰어 세기")
        L, R, y = -5.6, 5.6, 0.3
        line = Line([L, y, 0], [R, y, 0], color=INK, stroke_width=5)
        ticks = VGroup()
        for v in range(0, 71, 10):
            x = L + (R - L) * v / 70
            ticks.add(VGroup(Line([x, y + 0.15, 0], [x, y - 0.15, 0], color=INK, stroke_width=3), T(str(v), 30).move_to([x, y - 0.5, 0])))
        self.play(Create(line), FadeIn(ticks), run_time=0.8)
        self.say("0에서 20씩 3번 뛰어 세요", "수직선에서 0부터 20씩 3번 뛰어 세어 볼까요?")
        for k in range(3):
            a = np.array([L + (R - L) * 20 * k / 70, y + 0.2, 0])
            c = np.array([L + (R - L) * 20 * (k + 1) / 70, y + 0.2, 0])
            arc = ArcBetweenPoints(a, c, angle=-1.6, color=ORANGE, stroke_width=6)
            lab = T("+20", 30, ORANGE).move_to((a + c) / 2 + UP * 0.9)
            self.play(Create(arc), FadeIn(lab), run_time=0.6)
        self.say(f"20, 40, {g('60')}", "20, 40, 60. 20 곱하기 3은 60이에요.")
        e = M(f"20 × 3 = {g('60')}", 70).move_to([0, -1.6, 0])
        self.play(FadeIn(e), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def tens(self):
        self.section("십 모형으로 보면")
        rows = blocks_rows(20, 3, size=0.13, buff=0.25).move_to([-3.6, 0.1, 0])
        self.say(f"20은 {b('십 모형 2개')}, 3묶음이면", "20은 십 모형 2개. 이것이 3묶음 있어요.")
        self.play(LaggedStart(*[FadeIn(r) for r in rows], lag_ratio=0.3, run_time=1.0))
        l1 = M(f"십 모형: 2 × 3 = {b('6개')}", 50).move_to([2.8, 1.2, 0])
        l2 = M(f"십 모형 6개 = {g('60')}", 50).move_to([2.8, 0.2, 0])
        self.say(f"십 모형 2 × 3 = {b('6개')} → {g('60')}", "십 모형이 2개씩 3묶음이니 2 곱하기 3, 6개. 십 모형 6개는 60이에요.")
        self.play(FadeIn(l1), run_time=0.5)
        self.play(FadeIn(l2), run_time=0.5)
        l3 = M(f"2 × 3 = 6의 {g('10배')} → 60", 50).move_to([2.8, -0.9, 0])
        self.say(f"2 × 3 = 6의 {g('10배')}", "그래서 20 곱하기 3은 2 곱하기 3인 6의 10배, 60이에요.")
        self.play(FadeIn(l3), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def split23(self):
        self.section("23 × 3 나누어 곱하기")
        rows = blocks_rows(23, 3, size=0.13, buff=0.25).move_to([-3.6, 0.1, 0])
        self.say("23 × 3은 어떻게 할까요?", "이번에는 23 곱하기 3이에요. 23을 수모형으로 3묶음 놓아요.")
        self.play(LaggedStart(*[FadeIn(r) for r in rows], lag_ratio=0.3, run_time=1.0))
        l1 = M(f"{b('십')}: 20 × 3 = {b('60')}", 50).move_to([2.8, 1.3, 0])
        l2 = M(f"{o('일')}: 3 × 3 = {o('9')}", 50).move_to([2.8, 0.3, 0])
        l3 = M(f"{b('60')} + {o('9')} = {g('69')}", 60).move_to([2.8, -0.9, 0])
        self.say(f"{b('십 모형')}: 20 × 3 = {b('60')}", "십 모형끼리 곱하면 20 곱하기 3은 60.")
        self.play(*[Indicate(r[1], color=BLUE, scale_factor=1.1) for r in rows], FadeIn(l1), run_time=0.8)
        self.say(f"{o('일 모형')}: 3 × 3 = {o('9')}", "일 모형끼리 곱하면 3 곱하기 3은 9.")
        self.play(*[Indicate(r[2], color=ORANGE, scale_factor=1.2) for r in rows], FadeIn(l2), run_time=0.8)
        self.say(f"더하면 {g('69')}", "두 값을 더하면 60 더하기 9, 69예요.")
        self.play(FadeIn(l3), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
