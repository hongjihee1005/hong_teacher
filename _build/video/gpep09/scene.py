"""「수학 원리 돋보기」 분수 준비 9화 — 조각에 이름 붙이기: 2분의 1, 4분의 1

똑같이 2조각 중 1조각 = 2분의 1(아래 2 = 몇 조각으로 나누었나, 위 1 = 그중 1조각) → 3분의 1 → 4분의 1
연습: 막대를 똑같이 6칸 중 1칸 = 6분의 1
최종: GRADE=p ./make_final.sh 9
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, M, T, b, g, o
from division import clear_stage
from fraction import frac, frac_bar, pie
from prepkit import PrepScene


class GpEp09(PrepScene):
    EP_NO = 9
    EP_TITLE = "조각에 이름 붙이기: 2분의 1, 4분의 1"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.half()
        self.more()
        self.practice()
        self.closing(f"똑같이 {b('2')}조각으로 나눈 것 중 {o('1')}조각 = {b('2분의')} {o('1')}\n아래 수 = {b('몇 조각으로 나누었나')}",
                     next_preview="분수 준비 10화 · 조각이 많을수록 한 조각은 작아져요")
        self.wait(0.5)

    def half(self):
        self.section("2분의 1")
        bar = frac_bar(2, 1, width=4.4, height=1.6).move_to([-3.2, 0.3, 0])
        self.say("종이를 똑같이 2조각으로 나누었어요", "종이 한 장을 똑같이 2조각으로 나누었어요. 그중 한 조각에 색칠했어요.")
        self.play(FadeIn(bar), run_time=0.6)
        self.say("이 한 조각의 이름은?", "이 한 조각에 이름을 붙여 볼까요?")
        self.play(Indicate(bar[0], color=ORANGE, scale_factor=1.08), run_time=0.7)
        f = frac(1, 2, 130, cn=ORANGE, cd=BLUE).move_to([1.4, 0.3, 0])
        self.say(f"{b('2분의')} {o('1')}", "똑같이 2조각으로 나눈 것 중의 1조각, 2분의 1이라고 해요.")
        self.play(Write(f), run_time=0.9)
        ld = M(f"← 몇 조각으로 {b('똑같이')} 나누었나", 38).next_to(f.den, RIGHT, buff=0.4)
        ln = M(f"← 그중 {o('몇 조각')}인가", 38).next_to(f.num, RIGHT, buff=0.4)
        self.say("아래는 나눈 조각 수, 위는 그중 몇 조각", "아래 2는 몇 조각으로 똑같이 나누었는지, 위 1은 그중 몇 조각인지 알려 줘요.")
        self.play(FadeIn(ld), run_time=0.5)
        self.play(FadeIn(ln), run_time=0.5)
        r = M(f"읽을 때는 {b('아래')}부터: '{b('2분의')} {o('1')}'", 42).move_to([0, -2.1, 0])
        self.play(FadeIn(r), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def more(self):
        self.section("3분의 1, 4분의 1")
        xs = [-4.2, 0, 4.2]
        ps = VGroup(*[pie(d, 1, 0.95).move_to([x, 1.25, 0]) for d, x in zip([2, 3, 4], xs)])
        fs = VGroup(*[frac(1, d, 54, cn=ORANGE, cd=BLUE).next_to(p, DOWN, buff=0.3) for d, p in zip([2, 3, 4], ps)])
        rd = VGroup(*[M(f"{b(f'{d}분의')} {o('1')}", 36).next_to(f, DOWN, buff=0.2) for d, f in zip([2, 3, 4], fs)])
        nar = ["2조각 중 1조각, 2분의 1.", "3조각 중 1조각, 3분의 1.", "4조각 중 1조각, 4분의 1."]
        for i in range(3):
            self.say(f"{i + 2}조각 중 1조각 = {b(f'{i + 2}분의')} {o('1')}", nar[i])
            self.play(FadeIn(ps[i]), Write(fs[i]), FadeIn(rd[i]), run_time=0.8)
        t = M(f"{b('몇 조각')}으로 나누었는지가 아래로 가요", 42).move_to([0, -1.85, 0])
        self.say("나눈 조각 수가 아래로", "피자를 몇 조각으로 나누었는지가 분수의 아래로 가요.")
        self.play(FadeOut(rd), FadeIn(t), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def practice(self):
        self.section("연습해요")
        bar = frac_bar(6, 1, width=7.2, height=1.1).move_to([0, 0.9, 0])
        self.say("색칠한 한 칸의 이름은?", "연습해 볼까요? 막대를 똑같이 나누어 한 칸에 색칠했어요. 이 한 칸의 이름은 무엇일까요?")
        self.play(FadeIn(bar), run_time=0.6)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        nums = VGroup(*[T(str(i + 1), 36, BLUE).move_to(c) for i, c in enumerate(bar)])
        self.say(f"모두 {b('6칸')}", "먼저 몇 칸으로 나누었는지 세어요. 1, 2, 3, 4, 5, 6. 6칸이에요.")
        self.play(LaggedStart(*[FadeIn(n_, scale=1.4) for n_ in nums], lag_ratio=0.6, run_time=2.0))
        f = frac(1, 6, 100, cn=ORANGE, cd=BLUE).move_to([0, -1.3, 0])
        self.say(f"6칸 중 1칸 = {b('6분의')} {o('1')}", "6칸 중 1칸이니까 6분의 1이에요.")
        self.play(Write(f), run_time=0.7)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
