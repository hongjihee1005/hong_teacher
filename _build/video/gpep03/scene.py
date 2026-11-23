"""「수학 원리 돋보기」 분수 준비 3화 — 줄 맞춰 놓으면 곱셈이 보여요

한 줄에 5개씩 3줄 → 5 × 3 = 15 / 배열을 돌리면 한 줄에 3개씩 5줄 → 3 × 5 = 15 (순서를 바꾸어도 같음)
연습: 한 줄에 4개씩 2줄 = 4 × 2 = 8
최종: GRADE=p ./make_final.sh 3
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, PI, RIGHT, UP, FadeIn, FadeOut, Indicate, LaggedStart, Rotate, SurroundingRectangle,
                   VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, M, T, b, g, o
from division import clear_stage
from prepkit import PINK, RED, PrepScene, grid_items


class GpEp03(PrepScene):
    EP_NO = 3
    EP_TITLE = "줄 맞춰 놓으면 곱셈이 보여요"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.array()
        self.turn()
        self.practice()
        self.closing(f"한 줄에 {b('5')}개씩 {o('3')}줄 = {b('5')} × {o('3')} = {g('15')}\n곱하는 두 수의 순서를 바꾸어도 답은 같아요",
                     next_preview="분수 준비 4화 · 곱셈구구가 생각나지 않을 때")
        self.wait(0.5)

    def array(self):
        self.section("줄 맞춰 놓기")
        lines = grid_items(3, 5, center=(-2.0, 0.6, 0), step=0.75, r=0.28)
        self.say("구슬을 줄 맞춰 놓았어요", "구슬을 줄 맞춰 놓았어요. 모두 몇 개일까요?")
        self.play(LaggedStart(*[FadeIn(l, shift=RIGHT * 0.3) for l in lines], lag_ratio=0.4, run_time=1.2))
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        boxes = VGroup(*[SurroundingRectangle(l, color=BLUE, buff=0.1, stroke_width=5, corner_radius=0.12) for l in lines])
        labs = VGroup(*[T(f"{5 * (i + 1)}", 40, BLUE).next_to(boxes[i], RIGHT, buff=0.3) for i in range(3)])
        self.say(f"한 줄에 {b('5개')}씩, {o('3줄')}", "한 줄에 5개씩 있고, 줄이 3줄이에요. 한 줄씩 묶어 세면 5, 10, 15.")
        for bx, lb in zip(boxes, labs):
            self.play(FadeIn(bx), FadeIn(lb, scale=1.4), run_time=0.6)
        mul = M(f"{b('5')} × {o('3')} = {g('15')}", 72).move_to([3.6, 0.6, 0])
        self.say(f"{b('5')} × {o('3')} = {g('15')}", "5씩 3줄이니까 5 곱하기 3, 15예요.")
        self.play(Write(mul), run_time=0.8)
        self.wait(1.0)
        self.settle()
        self.lines, self.mul = lines, mul
        self.play(FadeOut(boxes), FadeOut(labs), run_time=0.4)

    def turn(self):
        self.section("돌려서 보기")
        self.say("배열을 돌려 볼까요?", "이 구슬들을 그대로 옆으로 돌려 볼까요?")
        self.play(Rotate(self.lines, -PI / 2), run_time=1.4)
        cols = VGroup(*[VGroup(*[self.lines[r][c] for r in range(3)]) for c in range(5)])
        boxes = VGroup(*[SurroundingRectangle(c, color=ORANGE, buff=0.1, stroke_width=5, corner_radius=0.12) for c in cols])
        self.say(f"이번에는 한 줄에 {b('3개')}씩 {o('5줄')}", "이번에는 한 줄에 3개씩 5줄로 보여요.")
        self.play(LaggedStart(*[FadeIn(bx) for bx in boxes], lag_ratio=0.3, run_time=1.0))
        mul2 = M(f"{b('3')} × {o('5')} = {g('15')}", 72).move_to([3.6, -0.6, 0])
        self.say(f"{b('3')} × {o('5')}도 {g('15')}", "3 곱하기 5도 15. 구슬은 하나도 늘거나 줄지 않았으니까요.")
        self.play(self.mul.animate.shift(UP * 0.6), Write(mul2), run_time=0.8)
        t = M(f"곱하는 순서를 바꾸어도 답은 {g('같아요')}", 44).move_to([0, -2.2, 0])
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def practice(self):
        self.section("연습해요")
        lines = grid_items(2, 4, color=PINK, center=(-2.4, 0.6, 0), step=0.8, r=0.3)
        self.say("곱셈식으로 나타내 보세요", "연습해 볼까요? 이 구슬을 곱셈식으로 나타내 보세요.")
        self.play(FadeIn(lines, lag_ratio=0.1), run_time=0.7)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        boxes = VGroup(*[SurroundingRectangle(l, color=BLUE, buff=0.1, stroke_width=5, corner_radius=0.12) for l in lines])
        mul = M(f"한 줄에 {b('4')}개씩 {o('2')}줄\n{b('4')} × {o('2')} = {g('8')}", 54).move_to([3.4, 0.6, 0])
        self.say(f"{b('4')} × {o('2')} = {g('8')}", "한 줄에 4개씩 2줄, 4 곱하기 2는 8이에요.")
        self.play(FadeIn(boxes), Write(mul), run_time=0.8)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
