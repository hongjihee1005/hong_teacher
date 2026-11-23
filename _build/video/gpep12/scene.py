"""「수학 원리 돋보기」 분수 준비 12화 — 12개의 3분의 2는 몇 개?

12의 3분의 2 → ① 분모 3: 똑같이 3묶음, 한 묶음 12 ÷ 3 = 4 ② 분자 2: 2묶음 → 4 × 2 = 8
나눗셈(한 묶음) → 곱셈(몇 묶음) / 연습: 10의 5분의 3 = 6 / 분수 특별편으로 이어 가기
최종: GRADE=p ./make_final.sh 12
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, FadeIn, FadeOut, Indicate, LaggedStart, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, M, T, b, g, o
from division import clear_stage
from fraction import frac, row
from fracbasic import step_card
from prepkit import PINK, RED, PrepScene, items, regroup


class GpEp12(PrepScene):
    EP_NO = 12
    EP_TITLE = "12개의 3분의 2는 몇 개?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.two_thirds()
        self.practice()
        self.wrap()
        self.closing(f"12의 {b('3분의')} {o('2')}: 한 묶음 12 ÷ {b('3')} = 4 → {o('2')}묶음 4 × {o('2')} = {g('8')}\n{b('나눗셈')}으로 한 묶음, {o('곱셈')}으로 몇 묶음",
                     next_preview="분수 특별편 1화 · 분수는 '똑같이' 나누는 데서 시작해요")
        self.wait(0.5)

    def solve(self, n, d, k, color=RED, step=0.62):
        per = n // d
        its = items(n, color=color, step=step)
        self.play(FadeIn(its, lag_ratio=0.04), run_time=0.7)
        c1 = step_card(1, f"분모 {b(str(d))} → 똑같이 {d}묶음, 한 묶음은 {n} ÷ {d}").move_to([0, 2.45, 0])
        self.say(f"1단계: {d}묶음으로 나누면 한 묶음 {g(str(per))}개", f"1단계. 분모가 {d}이니까 똑같이 {d}묶음으로 나누어요. 한 묶음은 {n} 나누기 {d}, {per}개예요.")
        self.play(FadeIn(c1), run_time=0.4)
        boxes = regroup(self, its, per, step=step, gap=1.0)
        e1 = M(f"한 묶음: {n} ÷ {b(str(d))} = {g(str(per))}", 44).move_to([0, -0.35, 0])
        self.play(Write(e1), run_time=0.6)
        c2 = step_card(2, f"분자 {o(str(k))} → {k}묶음, {per} × {k}").move_to([0, 2.45, 0])
        self.say(f"2단계: {o(str(k) + '묶음')} → {per} × {k} = {g(str(per * k))}", f"2단계. 분자가 {k}이니까 {k}묶음이에요. {per}개씩 {k}묶음, {per} 곱하기 {k}는 {per * k}.")
        self.play(FadeOut(c1), FadeIn(c2), *[boxes[i].animate.set_stroke(ORANGE, 9) for i in range(k)], run_time=0.7)
        e2 = M(f"{k}묶음: {per} × {o(str(k))} = {g(str(per * k))}", 44).move_to([0, -1.05, 0])
        self.play(Write(e2), run_time=0.6)
        ans = row(f"{n}의", frac(k, d, 46, cn=ORANGE, cd=BLUE), f"= {g(str(per * k) + '개')}", size=46).move_to([0, -2.0, 0])
        self.play(FadeIn(ans), run_time=0.5)

    def two_thirds(self):
        self.section("12의 3분의 2")
        q = row("구슬 12개의", frac(2, 3, 56, cn=ORANGE, cd=BLUE), "는 몇 개일까요?", size=48).move_to([0, 2.4, 0])
        self.say("12개의 3분의 2는 몇 개?", "앞 화에서 12의 3분의 1은 4개였어요. 그럼 12의 3분의 2는 몇 개일까요?")
        self.play(FadeIn(q), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        self.play(FadeOut(q), run_time=0.3)
        self.solve(12, 3, 2)
        self.say(f"12의 3분의 2는 {g('8개')}", "그래서 12의 3분의 2는 8개예요.")
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def practice(self):
        self.section("연습해요")
        q = row("구슬 10개의", frac(3, 5, 56, cn=ORANGE, cd=BLUE), "은 몇 개일까요?", size=48).move_to([0, 2.4, 0])
        self.say("10개의 5분의 3은?", "연습해 볼까요? 구슬 10개의 5분의 3은 몇 개일까요?")
        self.play(FadeIn(q), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        self.play(FadeOut(q), run_time=0.3)
        self.solve(10, 5, 3, color=PINK)
        self.say(f"10의 5분의 3은 {g('6개')}", "한 묶음은 10 나누기 5, 2개. 3묶음은 2 곱하기 3, 6개예요.")
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def wrap(self):
        self.section("지금까지 배운 것")
        steps = VGroup(
            M(f"① 같은 수씩 묶어 세기 → {o('곱셈')}", 38),
            M(f"② 똑같이 나누기 → {b('나눗셈')}", 38),
            M(f"③ 하나를 똑같이 나누기 → {g('분수')}(2분의 1, 4분의 1)", 38),
            M(f"④ 여러 개의 분수 → {b('나눗셈')}으로 한 묶음, {o('곱셈')}으로 몇 묶음", 38),
        ).arrange(DOWN, buff=0.4, aligned_edge=LEFT).move_to([0, 0.3, 0])
        self.say("곱셈·나눗셈이 분수의 바탕이에요", "지금까지 곱셈과 나눗셈에서 출발해 분수까지 왔어요. 곱셈과 나눗셈이 분수의 바탕이에요.")
        self.play(LaggedStart(*[FadeIn(s, shift=RIGHT * 0.3) for s in steps], lag_ratio=0.5, run_time=2.4))
        self.say("이제 분수 특별편으로!", "이제 분수 특별편으로 넘어가서 분수를 더 자세히 알아봐요.")
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
