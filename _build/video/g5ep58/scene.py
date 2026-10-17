"""「수학 원리 돋보기」 5학년 58화 — 평균 구하기 (5-2 6단원 3차시, 화 코드 5-2-6-b)

줄넘기 기록 32, 25, 30, 33회 → 종이띠를 이어 붙이면(더하기) 120 → 4등분(나누기) 30
(평균) = (자룟값을 모두 더한 수) ÷ (자료의 수) = 120 ÷ 4 = 30
최종: GRADE=5 ./make_final.sh 58
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, Line, Rectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage

VALS = [32, 25, 30, 33]
COLS = [ORANGE, BLUE, GREEN, "#7A4FB5"]
K = 0.09


class G5Ep58(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 58
    EP_TITLE = "평균 구하기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.strips()
        self.formula()
        self.closing(f"(평균) = ({o('자룟값을 모두 더한 수')}) ÷ ({b('자료의 수')})\n이어 붙이기는 더하기, 똑같이 나누기는 나누기",
                     next_preview="5학년 59화 · 평균으로 비교하고 모르는 값 구하기")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("줄넘기를 4번 했어요: 32회, 25회, 30회, 33회\n한 번에 평균 몇 회를 했을까요?", 42).move_to([0.6, 1.6, 0])
        self.say("줄넘기 기록의 평균", "줄넘기를 네 번 해서 32회, 25회, 30회, 33회를 했어요. 한 번에 평균 몇 회를 했을까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def strips(self):
        self.section("종이띠로 생각하기")
        rows = VGroup()
        for k, (v, c) in enumerate(zip(VALS, COLS)):
            r = Rectangle(width=v * K, height=0.42, fill_color=c, fill_opacity=0.7, stroke_color=INK, stroke_width=2)
            r.move_to([-5.6 + v * K / 2, 2.0 - k * 0.55, 0])
            lab = T(str(v), 26).next_to(r, RIGHT, buff=0.12)
            rows.add(VGroup(r, lab))
        self.say("기록을 종이띠로 나타내요", "네 기록을 길이가 다른 종이띠로 나타냈어요.")
        self.play(LaggedStart(*[FadeIn(r) for r in rows], lag_ratio=0.2, run_time=1.0))
        y = -0.5
        x = -5.6
        joined = VGroup()
        anims = []
        for k, v in enumerate(VALS):
            tgt = rows[k][0].copy().move_to([x + v * K / 2, y, 0])
            anims.append(rows[k][0].copy().animate.move_to(tgt.get_center()))
            joined.add(tgt)
            x += v * K
        self.say(f"이어 붙이면 {o('모두 더한 것')}: 120", "종이띠를 모두 이어 붙이면 32 더하기 25 더하기 30 더하기 33, 120이에요. 이어 붙이는 것은 더하기와 같아요.")
        self.play(LaggedStart(*[FadeIn(j, shift=DOWN * 0.3) for j in joined], lag_ratio=0.3, run_time=1.4))
        tot = T("120", 32, ORANGE).next_to(joined, RIGHT, buff=0.15)
        self.play(FadeIn(tot), run_time=0.4)
        x0 = -5.6
        L = 120 * K
        ticks = VGroup(*[Line([x0 + L * k / 4, y - 0.4, 0], [x0 + L * k / 4, y + 0.4, 0], color=RED_C, stroke_width=6) for k in range(1, 4)])
        self.say(f"4등분하면 {g('30')}씩", "이 긴 띠를 똑같이 4부분으로 접으면 한 부분은 30이에요. 똑같이 나누는 것은 나누기와 같아요.")
        self.play(Create(ticks), run_time=0.8)
        parts = VGroup(*[T("30", 28, GREEN).move_to([x0 + L * (k + 0.5) / 4, y - 0.6, 0]) for k in range(4)])
        self.play(FadeIn(parts), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def formula(self):
        self.section("평균 구하는 식")
        e1 = M(f"(32 + 25 + 30 + 33) ÷ 4", 56).move_to([0, 1.3, 0])
        e2 = M(f"= 120 ÷ 4 = {g('30 (회)')}", 56).move_to([0, 0.2, 0])
        self.say("식으로 나타내면", "식으로 나타내면 네 기록을 모두 더해서 기록의 수 4로 나누어요.")
        self.play(FadeIn(e1), run_time=0.6)
        self.say(f"120 ÷ 4 = {g('30')}", "120 나누기 4는 30. 평균 30회를 했어요.")
        self.play(FadeIn(e2), run_time=0.6)
        f = M(f"(평균) = ({o('자룟값을 모두 더한 수')}) ÷ ({b('자료의 수')})", 40).move_to([0, -1.3, 0])
        self.play(FadeIn(f), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()


RED_C = "#C0392B"
