"""「수학 원리 돋보기」 38화 — 곱셈구구로 몫을 구해요 (1학기 3단원 5·6차시, 화 코드 1-3-c)

컵 18개를 6개씩 → 6 × □ = 18 → □ = 3 → 18 ÷ 6 = 3 / 학생 28명이 4명씩 → 곱셈표 4단에서 28 찾기 → 7
최종: ./make_final.sh 38
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, Rectangle, SurroundingRectangle,
                   VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage


class Ep38(EpisodeScene):
    EP_NO = 38
    EP_TITLE = "곱셈구구로 몫을 구해요"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.box_eq()
        self.table()
        self.practice()
        self.closing(f"나눗셈의 몫은 {o('나누는 수의 단')} 곱셈구구에서\n곱이 나누어지는 수가 되는 곱을 찾아요",
                     next_preview="39화 · 20 × 3과 23 × 3은 어떻게 계산할까?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M(f"컵 {b('18개')}를 한 명에게 {o('6개')}씩 주면\n몇 명에게 나누어 줄 수 있을까요?", 52).move_to([0, 1.3, 0])
        self.say("컵 18개를 6개씩", "컵 쌓기 대회에서 컵 18개를 한 명에게 6개씩 주려고 해요. 몇 명에게 줄 수 있을까요?")
        self.play(Write(q), run_time=1.2)
        e = M(f"18 ÷ 6 = {g('□')}", 100).move_to([0, -0.8, 0])
        self.play(FadeIn(e), run_time=0.5)
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def box_eq(self):
        self.section("곱셈식으로 생각하기")
        e = M(f"18 ÷ 6 = {g('□')}", 80).move_to([-3.0, 1.6, 0])
        m = M(f"6 × {g('□')} = 18", 80).move_to([3.0, 1.6, 0])
        self.say(f"몫 □는 6과 곱해서 18이 되는 수", "18 나누기 6의 몫 네모는 6과 곱해서 18이 되는 수예요.")
        self.play(FadeIn(e), run_time=0.5)
        self.play(FadeIn(m), run_time=0.5)
        tries = [("6 × 1 = 6", False), ("6 × 2 = 12", False), ("6 × 3 = 18", True)]
        ms = VGroup()
        for k, (t, ok) in enumerate(tries):
            mm = M(t if not ok else f"6 × {g('3')} = {g('18')}", 52).move_to([0, 0.3 - k * 0.8, 0])
            ms.add(mm)
            self.play(FadeIn(mm), run_time=0.5)
            self.wait(0.3)
        self.say(f"6 × {g('3')} = 18 → 18 ÷ 6 = {g('3')}", "6 곱하기 3이 18이니까 18 나누기 6은 3. 3명에게 나누어 줄 수 있어요.")
        self.play(Indicate(ms[2], color=GREEN, scale_factor=1.15), run_time=0.8)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def table(self):
        self.section("곱셈표에서 찾기")
        q = M(f"학생 {b('28명')}이 한 번에 {o('4명')}씩 달리면 몇 번?", 44).move_to([3.4, 2.3, 0])
        q.scale_to_fit_width(min(q.width, 6.4))
        self.say("28명이 4명씩 달리기를 해요", "학생 28명이 한 번에 4명씩 달리기를 하면 몇 번 해야 할까요? 28 나누기 4를 곱셈표로 구해 볼게요.")
        self.play(FadeIn(q), run_time=0.5)
        cell = 0.48
        x0, y0 = -6.4, 2.6
        cells = {}
        g_ = VGroup()
        for r in range(10):
            for c in range(10):
                if r == 0 and c == 0:
                    txt = "×"
                elif r == 0:
                    txt = str(c)
                elif c == 0:
                    txt = str(r)
                else:
                    txt = str(r * c)
                rect = Rectangle(width=cell, height=cell, stroke_color=SOFT, stroke_width=1.5,
                                 fill_color="#EFE8DB" if (r == 0 or c == 0) else PAPER, fill_opacity=1).move_to([x0 + c * cell, y0 - r * cell, 0])
                t = T(txt, 20).move_to(rect)
                cells[(r, c)] = VGroup(rect, t)
                g_.add(cells[(r, c)])
        self.play(FadeIn(g_), run_time=0.8)
        row4 = VGroup(*[cells[(4, c)] for c in range(10)])
        self.say(f"나누는 수 {o('4')}의 단을 찾아요", "먼저 나누는 수 4의 단을 찾아요.")
        self.play(*[c_[0].animate.set_fill(ORANGE, 0.3) for c_ in row4], run_time=0.7)
        self.say(f"4단에서 {b('28')}을 찾아요", "4단을 따라가며 28을 찾아요. 4, 8, 12, 16, 20, 24, 28!")
        for c in range(1, 8):
            self.play(Indicate(cells[(4, c)][1], color=ORANGE, scale_factor=1.4), run_time=0.3)
        hit = SurroundingRectangle(cells[(4, 7)], color=GREEN, buff=0.02, stroke_width=6)
        self.play(Create(hit), run_time=0.4)
        top = SurroundingRectangle(cells[(0, 7)], color=GREEN, buff=0.02, stroke_width=6)
        self.say(f"28 위의 수 {g('7')}이 몫", "28이 있는 줄의 맨 위를 보면 7. 4 곱하기 7은 28이에요.")
        self.play(Create(top), run_time=0.4)
        e = M(f"4 × {g('7')} = 28 → 28 ÷ 4 = {g('7')}", 46).move_to([3.4, 0.6, 0])
        self.play(FadeIn(e), run_time=0.5)
        a = M(f"달리기를 {g('7번')} 해요", 46).move_to([3.4, -0.5, 0])
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)

    def practice(self):
        self.section("스스로 해 보기")
        rows = [("42 ÷ 7 = ?", f"7 × {g('6')} = 42 → {g('6')}", "42 나누기 7은? 7단에서 42를 찾으면 7 곱하기 6, 몫은 6이에요."),
                ("32 ÷ 4 = ?", f"4 × {g('8')} = 32 → {g('8')}", "32 나누기 4는? 4 곱하기 8은 32, 몫은 8이에요."),
                ("40 ÷ 5 = ?", f"5 × {g('8')} = 40 → {g('8')}", "40 나누기 5는? 5 곱하기 8은 40, 몫은 8이에요.")]
        for k, (q, a, nar) in enumerate(rows):
            y = 1.6 - k * 1.2
            mq = M(q, 54).move_to([-2.8, y, 0])
            ma = M(a, 50).move_to([2.8, y, 0])
            self.say(q, nar.split("?")[0] + "?")
            self.play(FadeIn(mq), run_time=0.4)
            self.wait(1.8)
            self.say(a, nar.split("?")[1].strip())
            self.play(FadeIn(ma), run_time=0.5)
            self.wait(0.6)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
