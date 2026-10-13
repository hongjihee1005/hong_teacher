"""「수학 원리 돋보기」 25화 — (한 자리 수) × (몇십몇) (2학기 1단원 곱셈 6차시, 화 코드 2-1-d)

송판 4장씩 23줄: 점 배열 4 × 23을 20줄과 3줄로 갈라 → 4 × 20 = 80, 4 × 3 = 12 → 92 → 세로셈
최종: ./make_final.sh 25
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Brace, Circle, Create, DashedLine, FadeIn, FadeOut, Indicate, LaggedStart, Line,
                   SurroundingRectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage


class Ep25(EpisodeScene):
    EP_NO = 25
    EP_TITLE = "한 자리 수 × 몇십몇"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.dots()
        self.vertical()
        self.practice()
        self.closing(f"곱하는 수를 {b('몇십')}과 {o('몇')}으로 나누어\n각각 곱한 뒤 {g('더해요')}",
                     next_preview="26화 · 두 자리 수끼리의 곱셈은 네 조각")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M(f"송판이 한 줄에 {o('4장')}씩 {b('23줄')} 있어요.\n송판은 모두 몇 장일까요?", 54).move_to([0, 1.5, 0])
        self.say("송판이 4장씩 23줄", "태권도 격파 시범에 쓸 송판이 한 줄에 4장씩 23줄 있어요. 모두 몇 장일까요?")
        self.play(Write(q), run_time=1.2)
        e = M(f"4 × {b('2')}{o('3')} = ?", 110).move_to([0, -0.5, 0])
        self.say("곱하는 수가 두 자리면 어떻게 나눌까요?", "4 곱하기 23. 곱하는 수가 두 자리일 때는 어떻게 나누어 계산할까요?")
        self.play(FadeIn(e), run_time=0.6)
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def dots(self):
        self.section("점 배열을 둘로 나누기")
        step = 0.42
        x0, y0 = -5.6, 1.6
        dots = VGroup()
        for col in range(23):
            for row in range(4):
                gap = 0.35 if col >= 20 else 0
                dots.add(Circle(radius=0.12, fill_color=BLUE if col < 20 else ORANGE, fill_opacity=1, stroke_width=0)
                         .move_to([x0 + col * step + gap, y0 - row * step, 0]))
        for d in dots:
            d.set_fill(INK)
        self.say("4개씩 23줄을 점으로 나타내요", "송판 하나를 점 하나로 나타내 볼게요. 4개씩 23줄이에요.")
        self.play(LaggedStart(*[FadeIn(d, scale=0.5) for d in dots], lag_ratio=0.004, run_time=1.6))
        self.wait(0.5)
        self.say(f"23줄을 {b('20줄')}과 {o('3줄')}로 나누어요", "23줄을 20줄과 3줄로 나누어 볼까요?")
        cut = DashedLine([x0 + 19.5 * step + 0.17, y0 + 0.4, 0], [x0 + 19.5 * step + 0.17, y0 - 3 * step - 0.4, 0], color=SOFT, stroke_width=5)
        self.play(Create(cut), *[d.animate.set_fill(BLUE if i // 4 < 20 else ORANGE) for i, d in enumerate(dots)], run_time=1.0)
        left = VGroup(*dots[:80]); right = VGroup(*dots[80:])
        bl = Brace(left, DOWN, color=BLUE); br = Brace(right, DOWN, color=ORANGE)
        tl = M(f"4 × {b('20')} = {b('80')}", 44).next_to(bl, DOWN, buff=0.15)
        tr = M(f"4 × {o('3')} = {o('12')}", 44).next_to(br, DOWN, buff=0.15)
        self.say(f"파란 부분: 4 × {b('20')} = {b('80')}", "파란 부분은 4 곱하기 20, 80이에요. 24화에서 본 것처럼 4 곱하기 2의 10배예요.")
        self.play(FadeIn(bl), FadeIn(tl), Indicate(left, color=BLUE, scale_factor=1.03), run_time=0.9)
        self.say(f"주황 부분: 4 × {o('3')} = {o('12')}", "주황 부분은 4 곱하기 3, 12예요.")
        self.play(FadeIn(br), FadeIn(tr), Indicate(right, color=ORANGE, scale_factor=1.1), run_time=0.9)
        tot = M(f"{b('80')} + {o('12')} = {g('92')}", 64).move_to([0, -1.75, 0])
        self.say(f"두 덩어리를 더하면 {g('92')}", "두 덩어리를 더하면 80 더하기 12, 92장이에요.")
        self.play(FadeIn(tot, scale=1.2), run_time=0.6)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)

    def vertical(self):
        self.section("세로셈으로 나타내기")
        F = 70
        xs = [-1.6, -2.25, -2.9]
        top = VGroup(T("2", F, BLUE).move_to([xs[1], 2.35, 0]), T("3", F, ORANGE).move_to([xs[0], 2.35, 0]))
        mul = VGroup(T("×", F).move_to([xs[2], 1.45, 0]), T("4", F).move_to([xs[0], 1.45, 0]))
        bar = Line([xs[2] - 0.4, 0.9, 0], [xs[0] + 0.4, 0.9, 0], color=INK, stroke_width=6)
        self.say("세로셈으로도 같은 계산을 해요", "세로셈으로 나타내면 23 곱하기 4라고 써요. 곱하는 순서를 바꾸어도 곱은 같아요.")
        self.play(FadeIn(top), FadeIn(mul), Create(bar), run_time=0.8)
        r1 = VGroup(T("1", F, ORANGE).move_to([xs[1], 0.25, 0]), T("2", F, ORANGE).move_to([xs[0], 0.25, 0]))
        s1 = M(f"{o('3')} × 4 = {o('12')}", 44).move_to([2.6, 0.25, 0])
        self.say(f"{o('3')} × 4 = {o('12')}", "먼저 일의 자리 3 곱하기 4는 12.")
        self.play(FadeIn(r1), FadeIn(s1), run_time=0.6)
        r2 = VGroup(T("8", F, BLUE).move_to([xs[1], -0.65, 0]), T("0", F, BLUE).move_to([xs[0], -0.65, 0]))
        s2 = M(f"{b('20')} × 4 = {b('80')}", 44).move_to([2.6, -0.65, 0])
        self.say(f"{b('20')} × 4 = {b('80')}", "다음 십의 자리 20 곱하기 4는 80.")
        self.play(FadeIn(r2), FadeIn(s2), run_time=0.6)
        bar2 = Line([xs[2] - 0.4, -1.2, 0], [xs[0] + 0.4, -1.2, 0], color=INK, stroke_width=6)
        r3 = VGroup(T("9", F, GREEN).move_to([xs[1], -1.85, 0]), T("2", F, GREEN).move_to([xs[0], -1.85, 0]))
        self.say(f"더하면 {g('92')}: 점 배열의 두 덩어리와 같아요", "두 줄을 더하면 92. 점 배열에서 나눈 두 덩어리와 똑같아요.")
        self.play(Create(bar2), FadeIn(r3), run_time=0.7)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)

    def practice(self):
        self.section("스스로 해 보기")
        q = M(f"6 × {b('3')}{o('7')} = ?", 90).move_to([0, 1.7, 0])
        self.say("6 × 37은?", "6 곱하기 37도 해 볼까요? 잠깐 생각해 보세요.")
        self.play(FadeIn(q), run_time=0.6)
        self.wait(2.5)
        a = M(f"6 × {b('30')} = {b('180')},  6 × {o('7')} = {o('42')}", 54).move_to([0, 0.2, 0])
        t = M(f"{b('180')} + {o('42')} = {g('222')}", 64).move_to([0, -1.0, 0])
        self.say(f"6 × 30 = {b('180')}, 6 × 7 = {o('42')}", "37을 30과 7로 나누면, 6 곱하기 30은 180, 6 곱하기 7은 42.")
        self.play(FadeIn(a), run_time=0.6)
        self.say(f"더하면 {g('222')}", "더하면 222예요.")
        self.play(FadeIn(t), run_time=0.6)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
