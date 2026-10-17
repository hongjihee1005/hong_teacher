"""「수학 원리 돋보기」 5학년 23화 — 넓이의 단위 1 cm² (5-1 6단원 4차시, 화 코드 5-1-6-b)

두 직사각형의 넓이 비교: 겹치면 남는 부분이 생겨 어렵고, 단위(작은 사각형·삼각형)에 따라 개수가 달라짐
→ 한 변이 1 cm인 정사각형의 넓이를 단위로: 1 cm²(1 제곱센티미터) / 1 cm²가 4개 = 4 cm²
가 6 cm², 나 8 cm² → 나가 2 cm² 더 넓음 / 모양이 달라도 넓이가 같을 수 있음
최종: GRADE=5 ./make_final.sh 23
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, Square, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from area import grid, unit_cells

S = 0.6


class G5Ep23(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 23
    EP_TITLE = "넓이의 단위 1 cm²"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.unit()
        self.compare()
        self.closing(f"한 변이 1 cm인 정사각형의 넓이가 {o('1 cm²')}\n1 cm²가 몇 개인지 세면 {g('넓이')}를 정확히 견줄 수 있어요",
                     next_preview="5학년 24화 · 직사각형의 넓이")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("두 직사각형 중 어느 것이 더 넓을까요?", 46).move_to([0.6, 2.3, 0])
        a = unit_cells(3, 2, S, [-3.0, -0.3, 0], color=ORANGE, op=0.35).set_stroke(width=0)
        b_ = unit_cells(4, 2, S, [2.6, -0.3, 0], color=BLUE, op=0.35).set_stroke(width=0)
        from manim import SurroundingRectangle
        fa = SurroundingRectangle(a, buff=0, color=INK, stroke_width=5)
        fb = SurroundingRectangle(b_, buff=0, color=INK, stroke_width=5)
        la, lb = T("가", 38).next_to(a, UP, buff=0.2), T("나", 38).next_to(b_, UP, buff=0.2)
        self.say("가와 나, 어느 쪽이 넓을까요?", "가와 나 두 직사각형 중 어느 것이 더 넓을까요? 넓이를 정확하게 견주려면 어떻게 해야 할까요?")
        self.play(Write(q), FadeIn(VGroup(a, b_, fa, fb, la, lb)), run_time=1.2)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def unit(self):
        self.section("1 cm²")
        sq = Square(side_length=1.6, fill_color=ORANGE, fill_opacity=0.6, stroke_color=INK, stroke_width=5).move_to([-3.4, 0.4, 0])
        l1 = T("1 cm", 30).next_to(sq, DOWN, buff=0.15)
        l2 = T("1 cm", 30).next_to(sq, LEFT, buff=0.15)
        self.say("한 변이 1 cm인 정사각형", "넓이를 잴 때는 한 변이 1센티미터인 정사각형의 넓이를 단위로 써요.")
        self.play(FadeIn(sq), FadeIn(l1), FadeIn(l2), run_time=0.7)
        t = M(f"{o('1 cm²')}", 90).move_to([1.6, 1.0, 0])
        r = M("1 제곱센티미터", 44, SOFT).move_to([1.6, -0.2, 0])
        self.say(f"{o('1 cm²')}, 1 제곱센티미터", "이 넓이를 1 센티미터 제곱이라고 쓰고, 1 제곱센티미터라고 읽어요.")
        self.play(Write(t), FadeIn(r), run_time=0.8)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def compare(self):
        self.section("1 cm²로 세어 보기")
        ca, cb = [-3.0, 0.3, 0], [2.6, 0.3, 0]
        ga, gb = grid(3, 2, S, ca), grid(4, 2, S, cb)
        a = unit_cells(3, 2, S, ca, color=ORANGE)
        b_ = unit_cells(4, 2, S, cb, color=BLUE)
        la, lb = T("가", 38).next_to(ga, UP, buff=0.2), T("나", 38).next_to(gb, UP, buff=0.2)
        self.play(FadeIn(ga), FadeIn(gb), FadeIn(la), FadeIn(lb), run_time=0.5)
        self.say("1 cm²가 몇 개인지 세어요", "1 제곱센티미터가 몇 개 들어가는지 세어 볼게요.")
        self.play(LaggedStart(*[FadeIn(c, scale=0.6) for c in a], lag_ratio=0.15, run_time=1.2))
        self.play(LaggedStart(*[FadeIn(c, scale=0.6) for c in b_], lag_ratio=0.12, run_time=1.2))
        ta = M(f"6개 → {o('6 cm²')}", 40).next_to(ga, DOWN, buff=0.35)
        tb = M(f"8개 → {b('8 cm²')}", 40).next_to(gb, DOWN, buff=0.35)
        self.say(f"가는 {o('6 cm²')}, 나는 {b('8 cm²')}", "가는 6개라서 6 제곱센티미터, 나는 8개라서 8 제곱센티미터예요.")
        self.play(FadeIn(ta), FadeIn(tb), run_time=0.6)
        r = M(f"나가 {g('2 cm²')} 더 넓어요", 46).move_to([0, -2.1, 0])
        self.say(f"나가 {g('2 cm²')} 더 넓어요", "그래서 나가 2 제곱센티미터 더 넓어요. 같은 단위로 세면 넓이를 정확히 견줄 수 있어요.")
        self.play(FadeIn(r), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
