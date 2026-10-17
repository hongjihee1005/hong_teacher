"""「수학 원리 돋보기」 6학년 1화 — (자연수) ÷ (자연수)의 몫을 분수로 ⑴ (6-1 1단원 2차시, 화 코드 6-1-1-a)

종이 1장을 5명에게 똑같이 → 1 ÷ 5 = 1/5
종이 3장을 5명에게 똑같이 → 한 장마다 1/5씩, 1/5이 3개 → 3 ÷ 5 = 3/5
●÷▲ = ●/▲ (나누어지는 수가 분자, 나누는 수가 분모)
최종: GRADE=6 ./make_final.sh 1
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, Rectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, row

PURPLE = "#7A4FB5"
PINK = "#D9668C"
COLS = [ORANGE, BLUE, GREEN, PURPLE, PINK]


def sheet(n=5, w=2.0, h=1.5, center=(0, 0, 0), color=None):
    """종이 한 장을 n칸 세로로 나눈 것. color=None이면 칸마다 다른 색"""
    cells = VGroup(*[Rectangle(width=w / n, height=h, fill_color=PAPER, fill_opacity=1, stroke_color=INK, stroke_width=3)
                     for _ in range(n)]).arrange(RIGHT, buff=0).move_to(center)
    return cells


class G6Ep01(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 1
    EP_TITLE = "(자연수) ÷ (자연수)의 몫을 분수로"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.one()
        self.three()
        self.closing(f"(자연수) ÷ (자연수)의 몫은 {o('나누어지는 수')}를 분자,\n{b('나누는 수')}를 분모로 하는 분수예요   3 ÷ 5 = 3/5",
                     next_preview="6학년 2화 · 몫이 1보다 큰 (자연수) ÷ (자연수)")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("종이 3장을 5명에게 똑같이 나누어 주면\n한 명은 몇 장을 받을까요?", 44).move_to([0.6, 1.6, 0])
        self.say("3 ÷ 5는?", "종이 3장을 5명에게 똑같이 나누어 주려고 해요. 한 명은 몇 장을 받을까요?")
        self.play(Write(q), run_time=1.0)
        sh = VGroup(*[Rectangle(width=1.6, height=1.2, fill_color=PAPER, fill_opacity=1, stroke_color=INK, stroke_width=3) for _ in range(3)]).arrange(RIGHT, buff=0.4).move_to([0, -0.3, 0])
        self.play(LaggedStart(*[FadeIn(s, shift=DOWN * 0.2) for s in sh], lag_ratio=0.2, run_time=0.8))
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def one(self):
        self.section("1장을 5명에게")
        s = sheet(5, 3.5, 1.8, [-2.6, 0.8, 0])
        self.say("1장을 5명에게 똑같이", "먼저 종이 1장을 5명에게 똑같이 나누어 볼게요. 1장을 5칸으로 똑같이 나누어요.")
        self.play(FadeIn(s), run_time=0.6)
        self.play(LaggedStart(*[c.animate.set_fill(COLS[i], opacity=0.8) for i, c in enumerate(s)], lag_ratio=0.15, run_time=1.0))
        e = row("1 ÷ 5", "=", frac(1, 5, 60, cn=ORANGE), size=56).move_to([3.0, 0.8, 0])
        self.say(f"한 명은 {o('1/5장')}", "한 명은 5칸 중 1칸, 5분의 1장을 받아요. 1 나누기 5는 5분의 1이에요.")
        self.play(Indicate(s[0], color=ORANGE, scale_factor=1.15), run_time=0.7)
        self.play(FadeIn(e), run_time=0.6)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def three(self):
        self.section("3장을 5명에게")
        xs = [-4.4, -1.6, 1.2]
        sheets = VGroup(*[sheet(5, 2.4, 1.5, [x, 1.4, 0]) for x in xs])
        self.say("한 장씩 5칸으로", "이번에는 종이 3장이에요. 한 장씩 5칸으로 똑같이 나누어 5명에게 한 칸씩 나누어 줘요.")
        self.play(FadeIn(sheets), run_time=0.6)
        self.play(LaggedStart(*[c.animate.set_fill(COLS[i], opacity=0.8) for s in sheets for i, c in enumerate(s)], lag_ratio=0.04, run_time=1.4))
        mine = VGroup(*[s[0] for s in sheets])
        self.say(f"한 명이 받는 것: {o('1/5이 3개')}", "주황색 친구는 장마다 5분의 1장씩, 모두 3번 받아요. 5분의 1이 3개예요.")
        self.play(*[Indicate(m, color=ORANGE, scale_factor=1.2) for m in mine], run_time=0.8)
        target = sheet(5, 2.4, 1.5, [-1.6, -0.9, 0])
        lab = T("종이 1장", 26, SOFT).next_to(target, LEFT, buff=0.25)
        self.play(FadeIn(target), FadeIn(lab), run_time=0.5)
        moved = VGroup(*[m.copy() for m in mine])
        self.play(*[mv.animate.move_to(target[i].get_center()) for i, mv in enumerate(moved)], run_time=1.2)
        e = row("3 ÷ 5", "=", frac(3, 5, 60, cn=ORANGE), size=56).move_to([3.9, -0.9, 0])
        self.say(f"3 ÷ 5 = {o('3/5')}장", "모아 보면 종이 1장의 5분의 3이에요. 3 나누기 5는 5분의 3이에요.")
        self.play(FadeIn(e), run_time=0.6)
        self.wait(0.8)
        self.settle()
        clear_stage(self, 0.6)
        self.rule()

    def rule(self):
        self.section("나눗셈을 분수로")
        e1 = row("1 ÷ 5", "=", frac(1, 5, 60), size=56)
        e2 = row("3 ÷ 5", "=", frac(3, 5, 60), size=56)
        e3 = row(M("●", 56, ORANGE), M(" ÷ ", 56), M("▲", 56, BLUE), "=", frac("●", "▲", 60, cn=ORANGE, cd=BLUE), size=56)
        grp = VGroup(e1, e2, e3).arrange(DOWN, buff=0.45).move_to([0, 0.5, 0])
        self.say("나누어지는 수는 분자, 나누는 수는 분모", "나누어지는 수는 분자가 되고, 나누는 수는 분모가 돼요.")
        self.play(FadeIn(e1), FadeIn(e2), run_time=0.6)
        self.play(FadeIn(e3), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
