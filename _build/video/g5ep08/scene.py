"""「수학 원리 돋보기」 5학년 8화 — 공약수와 최대공약수 (5-1 2단원 4·5차시, 화 코드 5-1-2-c)

12와 18: 12의 약수 1, 2, 3, 4, 6, 12 / 18의 약수 1, 2, 3, 6, 9, 18 → 공약수 1, 2, 3, 6, 최대공약수 6
공약수는 최대공약수(6)의 약수와 같음
구하는 방법: 곱셈식(12 = 2 × 6, 18 = 3 × 6) / 공약수로 나누기(2) 12 18 → (3) 6 9 → 2 3, 2 × 3 = 6
최종: GRADE=5 ./make_final.sh 8
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Circle, Create, FadeIn, FadeOut, Indicate, LaggedStart, Line, VGroup, Write,
                   SurroundingRectangle)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage

A, B = 12, 18
DA = [d for d in range(1, A + 1) if A % d == 0]
DB = [d for d in range(1, B + 1) if B % d == 0]


class G5Ep08(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 8
    EP_TITLE = "공약수와 최대공약수"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.common()
        self.ladder()
        self.closing(f"두 수의 공통된 약수가 {o('공약수')}, 그중 가장 큰 수가 {g('최대공약수')}\n공약수는 최대공약수의 약수와 같아요",
                     next_preview="5학년 9화 · 공배수와 최소공배수")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("사탕 12개와 초콜릿 18개를 남김없이 똑같이 나누어 줄 때\n최대 몇 명에게 줄 수 있을까요?", 38)
        q.scale_to_fit_width(min(q.width, 11.0)).move_to([0.5, 1.5, 0])
        self.say("12와 18을 함께 나누어떨어지게", "사탕 12개와 초콜릿 18개를 여러 명에게 남김없이 똑같이 나누어 주려고 해요. 최대 몇 명에게 줄 수 있을까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def row(self, n, ds, y, col):
        lab = T(f"{n}의 약수", 34, col).move_to([-5.0, y, 0])
        nums = VGroup(*[T(str(d), 44) for d in ds])
        for k, (d, t) in enumerate(zip(ds, nums)):
            t.move_to([-3.2 + {1: 0, 2: 1, 3: 2, 4: 3, 6: 4, 9: 5, 12: 6, 18: 7}[d] * 1.15, y, 0])
        return lab, nums

    def common(self):
        self.section("공통된 약수 찾기")
        la, na = self.row(A, DA, 1.5, BLUE)
        lb, nb = self.row(B, DB, 0.2, ORANGE)
        self.say("12와 18의 약수를 나란히", "12의 약수와 18의 약수를 나란히 써 볼게요.")
        self.play(FadeIn(la), LaggedStart(*[FadeIn(t) for t in na], lag_ratio=0.15, run_time=1.0))
        self.play(FadeIn(lb), LaggedStart(*[FadeIn(t) for t in nb], lag_ratio=0.15, run_time=1.0))
        com = [d for d in DA if d in DB]
        rings = VGroup()
        for d in com:
            t1 = na[DA.index(d)]
            t2 = nb[DB.index(d)]
            rings.add(SurroundingRectangle(VGroup(t1, t2), color=GREEN, buff=0.12, corner_radius=0.2, stroke_width=5))
        self.say(f"두 수에 모두 있는 약수: {g('1, 2, 3, 6')}", "두 수에 모두 들어 있는 약수는 1, 2, 3, 6이에요. 이것을 12와 18의 공약수라고 해요.")
        self.play(LaggedStart(*[Create(r) for r in rings], lag_ratio=0.25, run_time=1.2))
        t1 = M(f"공약수: 1, 2, 3, 6  →  가장 큰 {g('6')} = {g('최대공약수')}", 42).move_to([0, -1.2, 0])
        self.say(f"가장 큰 공약수 {g('6')}이 최대공약수", "공약수 가운데 가장 큰 수 6을 최대공약수라고 해요. 그래서 최대 6명에게 똑같이 나누어 줄 수 있어요.")
        self.play(FadeIn(t1), Indicate(rings[-1], color=GREEN), run_time=0.8)
        t2 = M(f"6의 약수 1, 2, 3, 6 = {o('공약수')}", 38, SOFT).move_to([0, -2.1, 0])
        self.say(f"공약수는 {o('최대공약수의 약수')}", "그리고 6의 약수를 써 보면 1, 2, 3, 6. 공약수와 똑같아요. 공약수는 최대공약수의 약수예요.")
        self.play(FadeIn(t2), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def ladder(self):
        self.section("나눗셈으로 최대공약수 구하기")
        x0, y0 = -4.6, 1.6
        def rowt(d, a, b_, y):
            g_ = VGroup(T(d, 50, GREEN) if d else VGroup(), T(str(a), 50), T(str(b_), 50))
            g_[1].move_to([x0 + 0.9, y, 0]); g_[2].move_to([x0 + 2.2, y, 0])
            if d:
                g_[0].move_to([x0, y, 0])
            return g_
        r1 = rowt("2", 12, 18, y0)
        self.say("두 수를 공약수로 나누어요", "두 수를 함께 나누어떨어지게 하는 수, 공약수로 계속 나누어 볼게요.")
        self.play(FadeIn(r1), run_time=0.5)
        bar1 = VGroup(Line([x0 + 0.35, y0 + 0.35, 0], [x0 + 0.35, y0 - 0.4, 0], color=INK, stroke_width=4),
                      Line([x0 + 0.35, y0 - 0.4, 0], [x0 + 2.8, y0 - 0.4, 0], color=INK, stroke_width=4))
        r2 = rowt("3", 6, 9, y0 - 0.85)
        self.say(f"2로 나누면 {o('6, 9')}", "12와 18을 2로 나누면 6과 9.")
        self.play(Create(bar1), FadeIn(r2), run_time=0.7)
        y1 = y0 - 0.85
        bar2 = VGroup(Line([x0 + 0.35, y1 + 0.35, 0], [x0 + 0.35, y1 - 0.4, 0], color=INK, stroke_width=4),
                      Line([x0 + 0.35, y1 - 0.4, 0], [x0 + 2.8, y1 - 0.4, 0], color=INK, stroke_width=4))
        r3 = rowt(None, 2, 3, y1 - 0.85)
        self.say(f"3으로 나누면 {o('2, 3')}", "6과 9를 3으로 나누면 2와 3. 2와 3은 1 말고는 공약수가 없어서 멈춰요.")
        self.play(Create(bar2), FadeIn(r3), run_time=0.7)
        res = M(f"최대공약수 = {g('2')} × {g('3')} = {g('6')}", 50).move_to([2.6, 0.7, 0])
        self.say(f"왼쪽 수를 곱하면 {g('2 × 3 = 6')}", "왼쪽에 나눈 공약수를 모두 곱하면 2 곱하기 3, 6. 이것이 최대공약수예요.")
        self.play(Indicate(VGroup(r1[0], r2[0]), color=GREEN), FadeIn(res), run_time=0.8)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
