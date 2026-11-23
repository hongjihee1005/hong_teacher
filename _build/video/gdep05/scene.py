"""「수학 원리 돋보기」 나눗셈 차근차근 5화 — 곱셈구구로 몫 찾기

28 ÷ 4 = □ → 4 × □ = 28 → 4단을 차례로: 4, 8, 12, 16, 20, 24, 28 → 7
곱셈과 나눗셈 가족(4 × 7, 7 × 4, 28 ÷ 4, 28 ÷ 7) / 연습: 42 ÷ 6 → 6 × 7 = 42
최종: GRADE=d ./make_final.sh 5
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, Rectangle,
                   SurroundingRectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, M, T, b, g, o
from division import clear_stage
from divkit import DivScene


class GdEp05(DivScene):
    EP_NO = 5
    EP_TITLE = "곱셈구구로 몫 찾기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.find(28, 4)
        self.family()
        self.practice()
        self.closing(f"{b('28')} ÷ {o('4')} = □ → {o('4')} × □ = {b('28')}\n나누는 수의 단을 외워 나누어지는 수를 찾으면 그 수가 {g('몫')}",
                     next_preview="나눗셈 차근차근 6화 · 1과 0이 들어간 나눗셈")
        self.wait(0.5)

    def find(self, a, d, quick=False):
        self.section("곱셈구구로 바꾸기")
        q = M(f"{b(str(a))} ÷ {o(str(d))} = □", 80).move_to([-3.6, 2.0, 0])
        m = M(f"{o(str(d))} × □ = {b(str(a))}", 80).move_to([3.4, 2.0, 0])
        self.say(f"{a} ÷ {d} = □", f"{a} 나누기 {d}는 얼마일까요?")
        self.play(Write(q), run_time=0.6)
        self.say(f"{d} 곱하기 몇이 {a}일까?", f"{d} 곱하기 몇이 {a}가 되는지 찾으면 돼요. {d}단을 외워 볼까요?")
        self.play(FadeIn(m, shift=RIGHT * 0.3), run_time=0.6)
        rows = VGroup()
        for k in range(1, 10):
            r = M(f"{d} × {k} = {d * k}", 36).move_to([-4.0 + ((k - 1) // 5) * 4.0, 0.8 - ((k - 1) % 5) * 0.62, 0])
            rows.add(r)
        ans = a // d
        for k in range(1, ans + 1):
            self.play(FadeIn(rows[k - 1]), run_time=0.22 if quick else 0.32)
        hit = SurroundingRectangle(rows[ans - 1], color=GREEN, buff=0.1, stroke_width=6)
        self.say(f"{d} × {g(str(ans))} = {a}!", f"{d} 곱하기 {ans}가 {a}이에요!")
        self.play(Create(hit), run_time=0.5)
        a_ = M(f"그래서 {b(str(a))} ÷ {o(str(d))} = {g(str(ans))}", 56).move_to([3.6, -0.6, 0])
        self.say(f"몫은 {g(str(ans))}", f"그래서 {a} 나누기 {d}의 몫은 {ans}예요.")
        self.play(FadeIn(a_), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def family(self):
        self.section("곱셈과 나눗셈 가족")
        eqs = VGroup(M(f"{o('4')} × {g('7')} = {b('28')}", 56), M(f"{g('7')} × {o('4')} = {b('28')}", 56),
                     M(f"{b('28')} ÷ {o('4')} = {g('7')}", 56), M(f"{b('28')} ÷ {g('7')} = {o('4')}", 56)).arrange_in_grid(rows=2, buff=(1.4, 0.6)).move_to([0, 0.5, 0])
        self.say("세 수 4, 7, 28로 식 네 개", "4, 7, 28 세 수로 곱셈식 두 개와 나눗셈식 두 개를 만들 수 있어요.")
        self.play(LaggedStart(*[FadeIn(e) for e in eqs], lag_ratio=0.4, run_time=1.6))
        t = M(f"곱셈을 알면 나눗셈도 {g('바로')} 알 수 있어요", 46).move_to([0, -1.6, 0])
        self.say("곱셈을 알면 나눗셈도 알아요", "그래서 곱셈구구를 알면 나눗셈의 몫도 바로 알 수 있어요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def practice(self):
        self.section("연습해요")
        q = M(f"{b('42')} ÷ {o('6')} = □", 80).move_to([0, 1.0, 0])
        self.say("42 ÷ 6은?", "연습해 볼까요? 42 나누기 6은 얼마일까요? 6단을 떠올려 보세요.")
        self.play(Write(q), run_time=0.6)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.4)
        self.find(42, 6, quick=True)
        self.hide_chip()
