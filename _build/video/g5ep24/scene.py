"""「수학 원리 돋보기」 5학년 24화 — 직사각형의 넓이 (5-1 6단원 5차시, 화 코드 5-1-6-c)

가로 5 cm, 세로 3 cm: 1 cm²가 한 줄에 5개씩 3줄 → 5 × 3 = 15 cm² / (직사각형의 넓이) = (가로) × (세로)
정사각형(한 변 4 cm): 4 × 4 = 16 cm²
최종: GRADE=5 ./make_final.sh 24
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, SurroundingRectangle,
                   VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from area import grid, unit_cells

S = 0.62


class G5Ep24(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 24
    EP_TITLE = "직사각형의 넓이"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.rows()
        self.square()
        self.closing(f"(직사각형의 넓이) = {o('(가로)')} × {b('(세로)')}\n(정사각형의 넓이) = (한 변) × (한 변)",
                     next_preview="5학년 25화 · 1 m²와 1 km²")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("가로 5 cm, 세로 3 cm인 직사각형의 넓이는?", 46).move_to([0.6, 2.3, 0])
        c = [0, -0.3, 0]
        cells = unit_cells(5, 3, S, c, color=ORANGE, op=0.35).set_stroke(width=0)
        fr = SurroundingRectangle(cells, buff=0, color=INK, stroke_width=5)
        l1 = T("5 cm", 32).next_to(fr, DOWN, buff=0.15)
        l2 = T("3 cm", 32).next_to(fr, LEFT, buff=0.15)
        self.say("1 cm²가 몇 개 들어갈까요?", "가로 5센티미터, 세로 3센티미터인 직사각형의 넓이는 몇 제곱센티미터일까요?")
        self.play(Write(q), FadeIn(VGroup(cells, fr, l1, l2)), run_time=1.2)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def rows(self):
        self.section("한 줄에 몇 개, 몇 줄")
        c = [-2.4, 0.2, 0]
        gr = grid(5, 3, S, c)
        cells = unit_cells(5, 3, S, c, color=ORANGE)
        l1 = T("가로 5 cm", 30, ORANGE).next_to(gr, DOWN, buff=0.15)
        l2 = T("세로 3 cm", 30, BLUE).next_to(gr, LEFT, buff=0.15)
        self.play(FadeIn(gr), FadeIn(l1), FadeIn(l2), run_time=0.5)
        self.say(f"한 줄에 {o('5개')}", "1 제곱센티미터를 가로 한 줄에 놓으면 5개가 들어가요.")
        self.play(LaggedStart(*[FadeIn(x, scale=0.6) for x in cells[:5]], lag_ratio=0.15, run_time=0.9))
        self.say(f"그런 줄이 {b('3줄')}", "그런 줄이 세로로 3줄 있어요.")
        self.play(LaggedStart(*[FadeIn(x, scale=0.6) for x in cells[5:]], lag_ratio=0.08, run_time=1.2))
        e = M(f"{o('5')} × {b('3')} = {g('15 (cm²)')}", 56).move_to([3.4, 1.0, 0])
        self.say(f"5개씩 3줄 → {g('15 cm²')}", "5개씩 3줄이니 5 곱하기 3, 15개. 넓이는 15 제곱센티미터예요.")
        self.play(FadeIn(e), run_time=0.5)
        f = M(f"(직사각형의 넓이)\n= {o('(가로)')} × {b('(세로)')}", 40).move_to([3.4, -0.6, 0])
        self.say(f"넓이 = {o('가로')} × {b('세로')}", "그래서 직사각형의 넓이는 가로와 세로를 곱하면 돼요. 일일이 세지 않아도 돼요.")
        self.play(FadeIn(f), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def square(self):
        self.section("정사각형의 넓이")
        c = [-2.4, 0.0, 0]
        gr = grid(4, 4, S, c)
        cells = unit_cells(4, 4, S, c, color=GREEN)
        l1 = T("4 cm", 30).next_to(gr, DOWN, buff=0.15)
        l2 = T("4 cm", 30).next_to(gr, LEFT, buff=0.15)
        self.say("한 변이 4 cm인 정사각형", "한 변이 4센티미터인 정사각형은 가로와 세로가 같아요.")
        self.play(FadeIn(gr), FadeIn(l1), FadeIn(l2), LaggedStart(*[FadeIn(x, scale=0.6) for x in cells], lag_ratio=0.05, run_time=1.2))
        e = M(f"4 × 4 = {g('16 (cm²)')}", 56).move_to([3.4, 0.8, 0])
        f = M(f"(정사각형의 넓이)\n= (한 변) × (한 변)", 40).move_to([3.4, -0.7, 0])
        self.say(f"4 × 4 = {g('16 cm²')}", "그래서 정사각형의 넓이는 한 변의 길이를 두 번 곱해요. 4 곱하기 4, 16 제곱센티미터예요.")
        self.play(FadeIn(e), FadeIn(f), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
