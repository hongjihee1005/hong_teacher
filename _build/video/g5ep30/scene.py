"""「수학 원리 돋보기」 5학년 30화 — 넓이가 같아도 둘레는 다를까? (5-1 6단원 15차시, 화 코드 5-1-6-i)

넓이 36 m²인 직사각형 공원: 1×36(둘레 74), 2×18(40), 3×12(30), 4×9(26), 6×6(24) → 정사각형에 가까울수록 둘레가 짧음
둘레 20 m인 직사각형: 1×9(9), 2×8(16), 3×7(21), 4×6(24), 5×5(25) → 정사각형에 가까울수록 넓음
최종: GRADE=5 ./make_final.sh 30
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, Rectangle, Transform,
                   VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage

S = 0.17


class G5Ep30(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 30
    EP_TITLE = "넓이가 같아도 둘레는 다를까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.same_area()
        self.same_perim()
        self.closing(f"넓이가 같아도 둘레는, 둘레가 같아도 넓이는 {o('다를 수 있어요')}\n{g('정사각형')}에 가까울수록 둘레는 짧고 넓이는 넓어요",
                     next_preview="5학년 31화 · 이상·이하·초과·미만")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("넓이가 36 m²인 직사각형 공원을 만들어요.\n울타리(둘레)를 가장 짧게 하려면?", 42).move_to([0.6, 1.6, 0])
        self.say("넓이 36 m², 둘레를 가장 짧게", "넓이가 36 제곱미터인 직사각형 모양의 공원을 만들어요. 울타리를 가장 짧게 하려면 가로와 세로를 어떻게 하면 좋을까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def same_area(self):
        self.section("넓이가 같은 직사각형들")
        sizes = [(18, 2), (12, 3), (9, 4), (6, 6)]
        S2 = 0.2
        rows = VGroup()
        x = -6.4
        for k, (w, h) in enumerate(sizes):
            r = Rectangle(width=w * S2, height=h * S2, fill_color=[BLUE, ORANGE, GREEN, "#7A4FB5"][k], fill_opacity=0.45, stroke_color=INK, stroke_width=4)
            r.move_to([x + w * S2 / 2, 1.0, 0], aligned_edge=DOWN).set_y(0.9 + h * S2 / 2)
            lab = M(f"{w} × {h}\n둘레 {o(str(2 * (w + h)))}", 28).next_to(r, DOWN, buff=0.18)
            rows.add(VGroup(r, lab))
            x += w * S2 + 0.55
        self.say("가로와 세로를 바꾸어 봐요", "넓이가 36이 되는 가로와 세로를 바꾸어 가며 둘레를 구해 볼게요.")
        caps = [f"18 × 2 → 둘레 {o('40 m')}", f"12 × 3 → 둘레 {o('30 m')}", f"9 × 4 → 둘레 {o('26 m')}", f"6 × 6 → 둘레 {o('24 m')}"]
        for rr, cap, nar in zip(rows, caps, ["18 곱하기 2는 둘레가 40미터.", "12 곱하기 3은 30미터.", "9 곱하기 4는 26미터.", "6 곱하기 6, 정사각형은 24미터예요."]):
            self.say(cap, nar)
            self.play(FadeIn(rr), run_time=0.5)
        t = M(f"넓이는 모두 36 m²인데 둘레는 {o('달라요')}  →  {g('6 × 6')}이 가장 짧아요", 34).move_to([0, -1.6, 0])
        self.say(f"정사각형 {g('6 × 6')}의 둘레가 가장 짧아요", "넓이는 모두 36 제곱미터로 같은데 둘레는 달라요. 가로와 세로가 비슷할수록, 정사각형일 때 둘레가 가장 짧아요.")
        self.play(FadeIn(t), Indicate(rows[-1][0], color=GREEN), run_time=0.8)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def same_perim(self):
        self.section("둘레가 같은 직사각형들")
        sizes = [(9, 1), (8, 2), (7, 3), (6, 4), (5, 5)]
        S2 = 0.36
        rows = VGroup()
        x = -6.5
        for k, (w, h) in enumerate(sizes):
            r = Rectangle(width=w * S2, height=h * S2, fill_color=[BLUE, ORANGE, GREEN, "#7A4FB5", BLUE][k], fill_opacity=0.45, stroke_color=INK, stroke_width=4)
            r.move_to([x + w * S2 / 2, 0.8 + h * S2 / 2, 0])
            lab = M(f"{w} × {h}\n넓이 {b(str(w * h))}", 26).next_to(r, DOWN, buff=0.15)
            rows.add(VGroup(r, lab))
            x += w * S2 + 0.25
        rows.scale_to_fit_width(min(rows.width, 12.6)).move_to([0, 0.6, 0])
        self.say("이번에는 둘레가 20 m로 같아요", "이번에는 둘레가 모두 20미터인 직사각형들이에요. 넓이를 견주어 볼까요?")
        self.play(LaggedStart(*[FadeIn(r) for r in rows], lag_ratio=0.25, run_time=1.6))
        t = M(f"둘레가 같아도 넓이는 {o('달라요')}  →  {g('5 × 5')}가 가장 넓어요", 34).move_to([0, -1.7, 0])
        self.say(f"정사각형 {g('5 × 5')}가 가장 넓어요", "둘레가 같아도 넓이는 9, 16, 21, 24, 25로 달라요. 이번에도 정사각형에 가까울수록 넓어요.")
        self.play(FadeIn(t), Indicate(rows[-1][0], color=GREEN), run_time=0.8)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
