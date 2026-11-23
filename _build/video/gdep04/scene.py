"""「수학 원리 돋보기」 나눗셈 차근차근 4화 — 뺄셈으로 나눗셈하기

12 ÷ 3: 12 − 3 − 3 − 3 − 3 = 0 → 4번 뺐으니 몫 4 / 수직선에서 12부터 3씩 거꾸로 뛰기
연습: 15 ÷ 5 (5씩 3번)
최종: GRADE=d ./make_final.sh 4
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, ArcBetweenPoints, Create, FadeIn, FadeOut, Indicate, LaggedStart, Line,
                   VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, M, T, b, g, o
from division import clear_stage
from divkit import DivScene
from prepkit import RED, items


class GdEp04(DivScene):
    EP_NO = 4
    EP_TITLE = "뺄셈으로 나눗셈하기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.subtract()
        self.numline(12, 3, "수직선에서 거꾸로 뛰기")
        self.practice()
        self.closing(f"나눗셈은 같은 수를 {o('몇 번 뺄 수 있는지')} 세는 것\n{b('12')} − 3 − 3 − 3 − 3 = 0 → {g('4번')} → 12 ÷ 3 = {g('4')}",
                     next_preview="나눗셈 차근차근 5화 · 곱셈구구로 몫 찾기")
        self.wait(0.5)

    def subtract(self):
        self.section("3씩 덜어 내기")
        its = items(12, y=1.4, step=0.6, r=0.23)
        q = M(f"{b('12')} ÷ {o('3')}: 12개에서 {o('3개')}씩 몇 번 덜어 낼 수 있을까요?", 42).move_to([0, 2.5, 0])
        self.say("12개에서 3개씩 몇 번 덜어 낼까요?", "구슬 12개에서 3개씩 몇 번 덜어 낼 수 있을까요?")
        self.play(FadeIn(q), FadeIn(its, lag_ratio=0.05), run_time=0.8)
        rest = 12
        lines = VGroup()
        for k in range(4):
            grp = VGroup(*its[k * 3:(k + 1) * 3])
            rest -= 3
            ln = M(f"{rest + 3} − {o('3')} = {b(str(rest))}", 40).move_to([-3.0 + (k % 2) * 6.0, -0.4 - (k // 2) * 0.8, 0])
            nar = f"{rest + 3}에서 3을 빼면 {rest}." + (" 다 덜어 냈어요." if rest == 0 else "")
            self.say(f"{k + 1}번째: {rest + 3} − 3 = {rest}", nar)
            self.play(grp.animate.shift(DOWN * 3.2).set_opacity(0.25), FadeIn(ln), run_time=0.6)
            lines.add(ln)
        t = M(f"{o('4번')} 뺐더니 0 → 몫은 {g('4')}", 50).move_to([0, -2.2, 0])
        self.say(f"{o('4번')} 뺐으니 몫은 {g('4')}", "모두 4번 뺐더니 0이 되었어요. 그래서 12 나누기 3의 몫은 4예요.")
        self.play(FadeOut(its), FadeIn(t), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def numline(self, a, d, sec, quick=False):
        self.section(sec)
        L, R, y = -5.6, 5.6, 0.3
        x = lambda v: L + (R - L) * v / a
        ln = Line([L - 0.2, y, 0], [R + 0.2, y, 0], color=INK, stroke_width=5)
        ticks = VGroup(*[Line([x(v), y - 0.15, 0], [x(v), y + 0.15, 0], color=INK, stroke_width=3) for v in range(a + 1)])
        nums = VGroup(*[T(str(v), 30, INK).next_to(ticks[v], DOWN, buff=0.2) for v in range(0, a + 1, d)])
        self.say(f"{a}에서 {d}씩 거꾸로 뛰어 볼까요?", f"수직선에서 {a}부터 0까지 {d}씩 거꾸로 뛰어 볼까요?")
        self.play(Create(ln), Create(ticks), FadeIn(nums), run_time=0.8)
        arcs = VGroup()
        for k in range(a // d):
            s, e = a - k * d, a - (k + 1) * d
            arc = ArcBetweenPoints([x(s), y + 0.2, 0], [x(e), y + 0.2, 0], angle=-2.0, color=ORANGE, stroke_width=6)
            lab = T(str(k + 1), 36, ORANGE).next_to(arc, UP, buff=0.05)
            self.play(Create(arc), FadeIn(lab), run_time=0.35 if quick else 0.5)
            arcs.add(arc, lab)
        q = a // d
        t = M(f"{d}씩 {g(f'{q}번')} 뛰어 0에 왔어요 → {a} ÷ {d} = {g(str(q))}", 46).move_to([0, -1.9, 0])
        self.say(f"{g(f'{q}번')} 뛰었으니 몫은 {g(str(q))}", f"{d}씩 {q}번 뛰어서 0에 왔어요. 그래서 {a} 나누기 {d}는 {q}예요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def practice(self):
        self.section("연습해요")
        q = M(f"{b('15')} ÷ {o('5')}를 뺄셈으로 구해 보세요", 50).move_to([0, 1.0, 0])
        self.say("15 ÷ 5를 뺄셈으로", "연습해 볼까요? 15 나누기 5를 뺄셈으로 구해 보세요.")
        self.play(FadeIn(q), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a = M(f"15 − 5 = 10, 10 − 5 = 5, 5 − 5 = 0\n→ {g('3번')} 뺐으니 15 ÷ 5 = {g('3')}", 42).move_to([0, -0.6, 0])
        self.say(f"5씩 {g('3번')} → 몫 {g('3')}", "15에서 5를 빼면 10, 10에서 5를 빼면 5, 5에서 5를 빼면 0. 3번 뺐으니 몫은 3이에요.")
        self.play(FadeIn(a), run_time=0.6)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.5)
        self.numline(15, 5, "수직선으로 확인", quick=True)
        self.hide_chip()
