"""「수학 원리 돋보기」 5학년 25화 — 1 m²와 1 km² (5-1 6단원 6·7차시, 화 코드 5-1-6-d)

교실 바닥처럼 넓은 곳은 1 m²(한 변 1 m인 정사각형) / 1 m = 100 cm → 1 m² = 100 × 100 = 10000 cm²
가로 5 m, 세로 3 m → 15 m² / 땅처럼 더 넓은 곳은 1 km² = 1000 m × 1000 m = 1000000 m²
최종: GRADE=5 ./make_final.sh 25
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, ReplacementTransform,
                   Square, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from area import grid, unit_cells


class G5Ep25(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 25
    EP_TITLE = "1 m²와 1 km²"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.m2()
        self.convert()
        self.km2()
        self.closing(f"{o('1 m²')} = 10000 cm²,  {b('1 km²')} = 1000000 m²\n넓은 곳은 더 큰 단위로 나타내요",
                     next_preview="5학년 26화 · 평행사변형의 넓이")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("교실 바닥의 넓이를 cm²로 나타내면\n수가 너무 커요. 어떻게 할까요?", 44).move_to([0.6, 1.6, 0])
        self.say("넓은 곳의 넓이", "교실 바닥처럼 넓은 곳의 넓이를 제곱센티미터로 나타내면 수가 너무 커져요. 어떻게 나타내면 좋을까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def m2(self):
        self.section("1 m²")
        sq = Square(side_length=3.0, fill_color=BLUE, fill_opacity=0.25, stroke_color=INK, stroke_width=5).move_to([-3.2, 0.2, 0])
        l1 = T("1 m", 32).next_to(sq, DOWN, buff=0.15)
        l2 = T("1 m", 32).next_to(sq, LEFT, buff=0.15)
        self.say("한 변이 1 m인 정사각형", "넓은 곳은 한 변이 1미터인 정사각형의 넓이를 단위로 써요.")
        self.play(FadeIn(sq), FadeIn(l1), FadeIn(l2), run_time=0.6)
        t = M(f"{b('1 m²')}  (1 제곱미터)", 52).move_to([2.6, 1.0, 0])
        self.say(f"{b('1 m²')}, 1 제곱미터", "이 넓이를 1 미터 제곱이라 쓰고 1 제곱미터라고 읽어요.")
        self.play(FadeIn(t), run_time=0.5)
        e = M(f"가로 5 m, 세로 3 m\n→ 5 × 3 = {g('15 m²')}", 40).move_to([2.6, -0.6, 0])
        self.say(f"가로 5 m, 세로 3 m → {g('15 m²')}", "가로 5미터, 세로 3미터인 교실 바닥은 5 곱하기 3, 15 제곱미터예요.")
        self.play(FadeIn(e), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def convert(self):
        self.section("1 m²는 몇 cm²?")
        c = [-3.2, 0.1, 0]
        sq = Square(side_length=3.6, fill_color=BLUE, fill_opacity=0.15, stroke_color=INK, stroke_width=5).move_to(c)
        g10 = grid(10, 10, 0.36, c, width=1.5)
        l1 = T("100 cm", 30).next_to(sq, DOWN, buff=0.15)
        l2 = T("100 cm", 30).next_to(sq, LEFT, buff=0.15)
        self.say("1 m는 100 cm", "1미터는 100센티미터예요. 1 제곱미터 안에 1 제곱센티미터가 몇 개 들어갈까요?")
        self.play(FadeIn(sq), FadeIn(l1), FadeIn(l2), run_time=0.6)
        self.play(Create(g10), run_time=0.8)
        n = T("(그림은 10칸씩만 그렸어요)", 24, SOFT).next_to(l1, DOWN, buff=0.1)
        self.play(FadeIn(n), run_time=0.3)
        e = M(f"가로에 100개, 세로로 100줄\n100 × 100 = {o('10000')}", 40).move_to([2.8, 1.0, 0])
        r = M(f"{b('1 m²')} = {o('10000 cm²')}", 54).move_to([2.8, -0.6, 0])
        self.say(f"100 × 100 = {o('10000')}", "가로 한 줄에 1 제곱센티미터가 100개씩, 100줄이니 100 곱하기 100, 1만 개예요.")
        self.play(FadeIn(e), run_time=0.6)
        self.say(f"1 m² = {o('10000 cm²')}", "그래서 1 제곱미터는 1만 제곱센티미터예요.")
        self.play(FadeIn(r), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def km2(self):
        self.section("1 km²")
        sq = Square(side_length=3.0, fill_color=GREEN, fill_opacity=0.25, stroke_color=INK, stroke_width=5).move_to([-3.2, 0.2, 0])
        l1 = T("1 km", 32).next_to(sq, DOWN, buff=0.15)
        l2 = T("1 km", 32).next_to(sq, LEFT, buff=0.15)
        self.say("마을이나 도시처럼 더 넓은 곳", "마을이나 도시처럼 아주 넓은 곳은 한 변이 1킬로미터인 정사각형의 넓이, 1 제곱킬로미터를 써요.")
        self.play(FadeIn(sq), FadeIn(l1), FadeIn(l2), run_time=0.6)
        t = M(f"{g('1 km²')}  (1 제곱킬로미터)", 48).move_to([2.6, 1.2, 0])
        e = M(f"1 km = 1000 m\n1000 × 1000 = 1000000", 38).move_to([2.6, 0.0, 0])
        r = M(f"{g('1 km²')} = {o('1000000 m²')}", 48).move_to([2.6, -1.3, 0])
        self.play(FadeIn(t), run_time=0.5)
        self.say(f"1 km² = {o('1000000 m²')}", "1킬로미터는 1000미터이니 1000 곱하기 1000, 1 제곱킬로미터는 100만 제곱미터예요.")
        self.play(FadeIn(e), run_time=0.5)
        self.play(FadeIn(r), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
