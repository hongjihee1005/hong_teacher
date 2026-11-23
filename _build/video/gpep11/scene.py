"""「수학 원리 돋보기」 분수 준비 11화 — 12개의 3분의 1은 몇 개?

구슬 12개의 3분의 1 → ① 분모 3: 똑같이 3묶음(12 ÷ 3 = 4) ② 분자 1: 그중 1묶음 → 4개
12의 2분의 1 = 6, 12의 4분의 1 = 3 / 연습: 15의 5분의 1 = 3
최종: GRADE=p ./make_final.sh 11
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, RIGHT, UP, FadeIn, FadeOut, Indicate, LaggedStart, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, M, T, b, g, o
from division import clear_stage
from fraction import frac, row
from fracbasic import step_card
from prepkit import PINK, RED, PrepScene, items, regroup


class GpEp11(PrepScene):
    EP_NO = 11
    EP_TITLE = "12개의 3분의 1은 몇 개?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.third()
        self.others()
        self.practice()
        self.closing(f"12의 {b('3분의')} {o('1')}: 12를 똑같이 {b('3')}묶음 → 그중 {o('1')}묶음 = {g('4')}\n한 묶음은 나눗셈으로: 12 ÷ 3 = 4",
                     next_preview="분수 준비 12화 · 12개의 3분의 2는 몇 개?")
        self.wait(0.5)

    def solve(self, n, d, color=RED, step=0.62, quick=False):
        its = items(n, color=color, step=step)
        self.play(FadeIn(its, lag_ratio=0.04), run_time=0.7)
        c1 = step_card(1, f"분모 {b(str(d))} → 똑같이 {b(str(d))}묶음으로 나누어요").move_to([0, 2.45, 0])
        self.say(f"1단계: 분모 {b(str(d))} → {d}묶음으로", f"1단계. 분모가 {d}이니까 {n}개를 똑같이 {d}묶음으로 나누어요.")
        self.play(FadeIn(c1), run_time=0.4)
        boxes = regroup(self, its, n // d, step=step, gap=1.0)
        per = n // d
        eq = M(f"한 묶음: {n} ÷ {b(str(d))} = {g(str(per))}", 46).move_to([0, -0.6, 0])
        self.say(f"한 묶음은 {n} ÷ {d} = {g(str(per))}개", f"한 묶음에는 {n} 나누기 {d}, {per}개씩 있어요.")
        self.play(Write(eq), run_time=0.6)
        c2 = step_card(2, f"분자 {o('1')} → 그중 {o('1')}묶음").move_to([0, 2.45, 0])
        self.say(f"2단계: 분자 {o('1')} → 1묶음", "2단계. 분자가 1이니까 그중 1묶음이에요.")
        self.play(FadeOut(c1), FadeIn(c2), boxes[0].animate.set_stroke(ORANGE, 9), run_time=0.6)
        ans = row(f"{n}의", frac(1, d, 52, cn=ORANGE, cd=BLUE), f"= {g(str(per) + '개')}", size=52).move_to([0, -1.9, 0])
        self.say(f"{n}의 {b(f'{d}분의')} {o('1')} = {g(f'{per}개')}", f"그래서 {n}의 {d}분의 1은 {per}개예요.")
        self.play(FadeIn(ans), run_time=0.6)
        return its

    def third(self):
        self.section("12의 3분의 1")
        q = row("구슬 12개의", frac(1, 3, 56, cn=ORANGE, cd=BLUE), "은 몇 개일까요?", size=48).move_to([0, 2.4, 0])
        self.say("12개의 3분의 1은 몇 개?", "구슬 12개의 3분의 1은 몇 개일까요?")
        self.play(FadeIn(q), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        self.play(FadeOut(q), run_time=0.3)
        self.solve(12, 3)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def others(self):
        self.section("2분의 1, 4분의 1도")
        rows_ = VGroup(
            row("12의", frac(1, 2, 52, cn=ORANGE, cd=BLUE), "→ 똑같이 2묶음 → 12 ÷ 2 =", g("6"), size=46),
            row("12의", frac(1, 4, 52, cn=ORANGE, cd=BLUE), "→ 똑같이 4묶음 → 12 ÷ 4 =", g("3"), size=46),
        ).arrange(DOWN, buff=0.7).move_to([0, 0.4, 0])
        self.say(f"12의 2분의 1은 {g('6')}", "같은 방법으로, 12의 2분의 1은 똑같이 2묶음으로 나눈 한 묶음, 12 나누기 2는 6이에요.")
        self.play(FadeIn(rows_[0]), run_time=0.6)
        self.say(f"12의 4분의 1은 {g('3')}", "12의 4분의 1은 똑같이 4묶음으로 나눈 한 묶음, 12 나누기 4는 3이에요.")
        self.play(FadeIn(rows_[1]), run_time=0.6)
        t = M(f"아래 수로 {b('나누면')} 한 묶음이 나와요", 46).move_to([0, -2.0, 0])
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def practice(self):
        self.section("연습해요")
        q = row("구슬 15개의", frac(1, 5, 56, cn=ORANGE, cd=BLUE), "은 몇 개일까요?", size=48).move_to([0, 2.4, 0])
        self.say("15개의 5분의 1은?", "연습해 볼까요? 구슬 15개의 5분의 1은 몇 개일까요?")
        self.play(FadeIn(q), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        self.play(FadeOut(q), run_time=0.3)
        self.solve(15, 5, color=PINK, step=0.5, quick=True)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
