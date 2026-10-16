"""「수학 원리 돋보기」 4학년 25화 — 수의 배열에서 규칙 찾기 (4-1 6단원 규칙과 관계 2·3차시, 화 코드 4-1-6-a)

수 배열표: 가로(오른쪽)로 갈수록 몇씩, 세로(아래)로 갈수록 몇씩, ↘ 방향으로 몇씩
몇 배씩 커지는 배열(3, 6, 12, 24 …) / 규칙을 덧셈식·곱셈식으로 (규칙에 맞는 식은 여러 가지)
최종: GRADE=4 ./make_final.sh 25
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Arrow, Create, CurvedArrow, FadeIn, FadeOut, Indicate, LaggedStart, Rectangle,
                   SurroundingRectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from angle import PURPLE

ROWS = [[1101, 1201, 1301, 1401, 1501],
        [2101, 2201, 2301, 2401, 2501],
        [3101, 3201, 3301, 3401, 3501],
        [4101, 4201, 4301, 4401, 4501]]


def table(cw=1.6, ch=0.75, size=38):
    cells = VGroup()
    for i, r in enumerate(ROWS):
        for j, v in enumerate(r):
            box = Rectangle(width=cw, height=ch, fill_color=PAPER, fill_opacity=1, stroke_color=SOFT, stroke_width=2)
            box.move_to([(j - 2) * cw, (1.5 - i) * ch, 0])
            cells.add(VGroup(box, T(str(v), size).move_to(box)))
    return cells


class G4Ep25(EpisodeScene):
    GRADE, SEM = 4, 1
    EP_NO = 25
    EP_TITLE = "수의 배열에서 규칙 찾기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.directions()
        self.times()
        self.closing(f"수의 배열은 {o('어느 방향')}으로 {o('몇씩')} 커지는지(작아지는지) 살펴요\n찾은 규칙은 {g('식')}으로 나타낼 수 있어요",
                     next_preview="4학년 26화 · 도형의 배열을 식으로 나타내기")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("수 배열표에 숨은 규칙은 무엇일까요?", 46).move_to([0.6, 2.35, 0])
        tb = table().move_to([0, -0.2, 0])
        self.say("숨은 규칙을 찾아봐요", "숫자 섬의 수 배열표예요. 이 표에는 어떤 규칙이 숨어 있을까요?")
        self.play(Write(q), FadeIn(tb), run_time=1.2)
        self.wait(1.0)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def directions(self):
        self.section("방향마다 규칙")
        tb = table().move_to([-1.6, 0.0, 0])
        self.play(FadeIn(tb), run_time=0.5)
        row = VGroup(*tb[0:5])
        col = VGroup(*[tb[i * 5] for i in range(4)])
        dia = VGroup(*[tb[i * 5 + i] for i in range(4)])
        r1 = SurroundingRectangle(row, color=ORANGE, buff=0.05, stroke_width=5)
        t1 = M(f"→ {o('100씩')} 커져요", 42).move_to([4.6, 1.3, 0])
        self.say(f"오른쪽으로 갈수록 {o('100씩')}", "오른쪽으로 갈수록 1101, 1201, 1301… 백의 자리 숫자가 1씩, 100씩 커져요.")
        self.play(Create(r1), FadeIn(t1), run_time=0.7)
        self.play(LaggedStart(*[Indicate(c[1], color=ORANGE, scale_factor=1.2) for c in row], lag_ratio=0.15, run_time=1.0))
        r2 = SurroundingRectangle(col, color=BLUE, buff=0.05, stroke_width=5)
        t2 = M(f"↓ {b('1000씩')} 커져요", 42).move_to([4.6, 0.3, 0])
        self.say(f"아래로 갈수록 {b('1000씩')}", "아래로 갈수록 1101, 2101, 3101… 1000씩 커져요.")
        self.play(Create(r2), FadeIn(t2), run_time=0.7)
        dl = VGroup(*[SurroundingRectangle(c, color=GREEN, buff=0.03, stroke_width=5) for c in dia])
        t3 = M(f"↘ {g('1100씩')} 커져요", 42).move_to([4.6, -0.7, 0])
        self.say(f"↘ 방향으로는 {g('1100씩')}", "오른쪽 아래로 갈수록 1101, 2201, 3301… 1100씩 커져요.")
        self.play(Create(dl), FadeIn(t3), run_time=0.7)
        e = M(f"식: 1101 + 1100 = 2201,  2201 + 1100 = 3301", 36).move_to([0.4, -2.05, 0])
        e.scale_to_fit_width(min(e.width, 12))
        self.say("규칙을 덧셈식으로", "찾은 규칙을 덧셈식으로 나타낼 수 있어요. 1101 더하기 1100은 2201.")
        self.play(FadeIn(e), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def times(self):
        self.section("몇 배씩 커지는 규칙")
        vals = [3, 6, 12, 24, 48]
        ns = VGroup(*[T(str(v), 72) for v in vals]).arrange(RIGHT, buff=1.1).move_to([0, 0.9, 0])
        self.say("3, 6, 12, 24 … 다음 수는?", "이번에는 3, 6, 12, 24로 늘어나는 수예요. 몇씩 커질까요?")
        self.play(LaggedStart(*[FadeIn(n) for n in ns[:4]], lag_ratio=0.2, run_time=1.0))
        self.wait(0.5)
        arcs = VGroup()
        for i in range(4):
            a = CurvedArrow(ns[i].get_top() + UP * 0.1, ns[i + 1].get_top() + UP * 0.1, angle=-1.2, color=PURPLE)
            l = T("×2", 32, PURPLE).next_to(a, UP, buff=0.05)
            arcs.add(VGroup(a, l))
        self.say(f"더하는 수는 3, 6, 12로 달라요 → {o('2배씩')}", "더하는 수는 3, 6, 12로 계속 달라요. 그런데 앞의 수에 2를 곱하면 다음 수가 돼요. 2배씩 커져요.")
        self.play(LaggedStart(*[Create(a) for a in arcs[:3]], lag_ratio=0.3, run_time=1.2))
        self.play(Create(arcs[3]), FadeIn(ns[4], scale=1.3), run_time=0.8)
        e = M(f"24 × 2 = {g('48')}", 56).move_to([0, -1.0, 0])
        self.say(f"다음 수는 24 × 2 = {g('48')}", "그래서 다음 수는 24 곱하기 2, 48이에요. 덧셈으로 말하기 어려우면 몇 배가 되는지 살펴봐요.")
        self.play(FadeIn(e), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
