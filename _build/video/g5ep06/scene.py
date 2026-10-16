"""「수학 원리 돋보기」 5학년 6화 — 약수란 무엇일까? (5-1 2단원 2차시, 화 코드 5-1-2-a)

꽃 6송이를 꽃병에 남김없이 똑같이: 1, 2, 3, 6개 꽃병은 됨, 4, 5개는 남음 → 6의 약수 1, 2, 3, 6
어떤 수를 나누어떨어지게 하는 수 = 약수 / 곱이 8인 곱셈식 1×8, 2×4 → 8의 약수 1, 2, 4, 8
1과 자기 자신은 언제나 약수
최종: GRADE=5 ./make_final.sh 6
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Circle, Create, Cross, Dot, FadeIn, FadeOut, Indicate, LaggedStart,
                   RoundedRectangle, SurroundingRectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage

RED = "#C0392B"
PINK = "#E86A92"


def flower(r=0.16):
    pet = VGroup(*[Circle(radius=r * 0.6, fill_color=PINK, fill_opacity=1, stroke_width=0).move_to(r * 0.7 * np.array([np.cos(a), np.sin(a), 0]))
                   for a in np.linspace(0, 2 * np.pi, 6)[:-1]])
    return VGroup(pet, Circle(radius=r * 0.45, fill_color="#F5C242", fill_opacity=1, stroke_width=0))


def vases(k, n=6, w=1.0):
    """n송이를 k개 꽃병에 차례로 나누기 → (꽃병들, 꽃들, 남은 수)"""
    vs = VGroup(*[RoundedRectangle(width=w, height=0.9, corner_radius=0.15, fill_color=PAPER, fill_opacity=1, stroke_color=INK, stroke_width=3) for _ in range(k)]).arrange(RIGHT, buff=0.2)
    per, rest = divmod(n, k)
    fl = VGroup()
    for v in vs:
        grp = VGroup(*[flower(0.13) for _ in range(per)]).arrange_in_grid(cols=min(per, 3), buff=0.05) if per else VGroup()
        if per:
            grp.move_to(v)
        fl.add(grp)
    left = VGroup(*[flower(0.13) for _ in range(rest)])
    return vs, fl, left


class G5Ep06(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 6
    EP_TITLE = "약수란 무엇일까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.try_vases()
        self.define()
        self.mult()
        self.closing(f"어떤 수를 {o('나누어떨어지게')} 하는 수가 그 수의 {g('약수')}\n1과 자기 자신은 언제나 약수예요",
                     next_preview="5학년 7화 · 배수와, 약수와 배수의 관계")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("꽃 6송이를 꽃병 몇 개에 남김없이\n똑같이 나누어 꽂을 수 있을까요?", 44).move_to([0.6, 1.7, 0])
        fl = VGroup(*[flower(0.25) for _ in range(6)]).arrange(RIGHT, buff=0.3).move_to([0, -0.5, 0])
        self.say("꽃 6송이를 똑같이", "꽃 6송이를 꽃병 몇 개에 남김없이 똑같이 나누어 꽂을 수 있을까요?")
        self.play(Write(q), FadeIn(fl), run_time=1.2)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def try_vases(self):
        self.section("꽃병 수를 바꾸어 보기")
        self.say("꽃병을 1개부터 6개까지 바꾸어 봐요", "꽃병을 1개부터 6개까지 바꾸어 가며 똑같이 나누어 꽂아 볼게요.")
        x0, y0, dy, w, gap = -4.0, 2.3, 0.78, 0.82, 0.14
        bad = VGroup()
        for k in range(1, 7):
            y = y0 - (k - 1) * dy
            lab = T(f"꽃병 {k}개", 28).move_to([x0 - 1.0, y, 0])
            per, rest = divmod(6, k)
            row = VGroup(lab)
            for v in range(k):
                cx = x0 + v * (w + gap) + w / 2
                box = RoundedRectangle(width=w, height=0.62, corner_radius=0.12, fill_color=PAPER, fill_opacity=1,
                                       stroke_color=INK, stroke_width=3).move_to([cx, y, 0])
                fl = VGroup(*[flower(0.1) for _ in range(per)]).arrange_in_grid(rows=1 if per <= 3 else 2, buff=0.03).move_to(box)
                row.add(box, fl)
            xr = x0 + k * (w + gap) + 0.2
            if rest:
                left = VGroup(*[flower(0.12) for _ in range(rest)]).arrange(RIGHT, buff=0.05)
                left.next_to([xr, y, 0], RIGHT, buff=0.05)
                lt = T(f"{rest}송이 남음", 24, RED).next_to(left, RIGHT, buff=0.15)
                row.add(left, lt)
                bad.add(row)
            mark = T("○" if not rest else "×", 38, GREEN if not rest else RED).move_to([5.6, y, 0])
            row.add(mark)
            self.play(FadeIn(row), run_time=0.45)
        self.say(f"4개, 5개는 {o('남아요')}", "꽃병이 4개나 5개이면 꽃이 남아요. 1개, 2개, 3개, 6개일 때만 남김없이 똑같이 나눌 수 있어요.")
        self.play(Indicate(bad, color=RED, scale_factor=1.03), run_time=0.8)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def define(self):
        self.section("약수")
        eqs = VGroup(*[M(f"6 ÷ {k} = {6 // k}" + ("" if 6 % k == 0 else f" … {RED_T(str(6 % k))}"), 42, INK if 6 % k == 0 else SOFT) for k in range(1, 7)])
        eqs.arrange(DOWN, aligned_edge=LEFT, buff=0.42).move_to([-3.2, 0.3, 0])
        self.say("나눗셈으로 나타내면", "나눗셈으로 나타내 볼까요? 6을 1, 2, 3, 6으로 나누면 나머지가 없어요.")
        self.play(LaggedStart(*[FadeIn(e) for e in eqs], lag_ratio=0.2, run_time=1.4))
        boxes = VGroup(*[SurroundingRectangle(eqs[k - 1], color=GREEN, buff=0.07) for k in (1, 2, 3, 6)])
        self.play(Create(boxes), run_time=0.6)
        t = M(f"6을 {o('나누어떨어지게')} 하는 수\n1, 2, 3, 6 = {g('6의 약수')}", 44).move_to([3.3, 0.4, 0])
        self.say(f"1, 2, 3, 6은 {g('6의 약수')}", "이렇게 어떤 수를 나누어떨어지게 하는 수를 그 수의 약수라고 해요. 1, 2, 3, 6은 6의 약수예요.")
        self.play(FadeIn(t), run_time=0.6)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def mult(self):
        self.section("곱셈식으로 약수 찾기")
        def arr(r, c, col):
            return VGroup(*[Dot(radius=0.13, color=col) for _ in range(r * c)]).arrange_in_grid(rows=r, cols=c, buff=0.16)
        a1 = arr(1, 8, BLUE).move_to([-3.6, 1.3, 0])
        a2 = arr(2, 4, ORANGE).move_to([-3.6, -0.3, 0])
        l1 = M(f"1 × 8 = 8", 44).move_to([0.9, 1.3, 0])
        l2 = M(f"2 × 4 = 8", 44).move_to([0.9, -0.3, 0])
        self.say("곱이 8이 되는 곱셈식", "8개의 점을 직사각형 모양으로 늘어놓아 볼까요? 1줄에 8개, 2줄에 4개씩 놓을 수 있어요.")
        self.play(FadeIn(a1), FadeIn(l1), run_time=0.6)
        self.play(FadeIn(a2), FadeIn(l2), run_time=0.6)
        t = M(f"8의 약수: {g('1, 2, 4, 8')}", 48).move_to([0, -1.8, 0])
        self.say(f"곱하는 두 수가 약수 → {g('1, 2, 4, 8')}", "곱이 8이 되는 곱셈식에서 곱하는 두 수는 8의 약수예요. 8의 약수는 1, 2, 4, 8이에요.")
        self.play(FadeIn(t), run_time=0.5)
        n = M(f"{o('1')}과 {o('자기 자신')}은\n언제나 약수", 40).move_to([4.6, 0.5, 0])
        self.say(f"1과 자기 자신은 {o('언제나')} 약수", "어떤 수든 1과 자기 자신으로는 언제나 나누어떨어지니, 1과 자기 자신은 언제나 약수예요.")
        self.play(FadeIn(n), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()


def RED_T(s):
    return f'<span foreground="{RED}">{s}</span>'
