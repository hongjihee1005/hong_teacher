"""「수학 원리 돋보기」 6학년 22화 — 백분율이란? (6-1 4단원 6차시, 화 코드 6-1-4-e)

기준량을 100으로 할 때의 비율 = 백분율, 기호 %, 비율 1/100 = 1 % (1 퍼센트)
비율을 백분율로: 기준량이 100인 비율로 바꾸거나 비율에 100을 곱해 % 붙이기
(예: 2/5 = 40/100 = 40 %, 0.4 × 100 = 40 %, 3/4 × 100 = 75 %)
최종: GRADE=6 ./make_final.sh 22
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from decimal4 import grid100
from fraction import frac, row


class G6Ep22(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 22
    EP_TITLE = "백분율이란?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.hundred()
        self.convert()
        self.closing(f"기준량을 {o('100')}으로 할 때의 비율이 {g('백분율')}(%)\n비율에 100을 곱하고 %를 붙여요   0.4 → {g('40 %')}",
                     next_preview="6학년 23화 · 생활 속 백분율")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("비율 2/5와 3/4처럼 기준량이 다른 비율을\n쉽게 견줄 수 있는 방법이 있을까요?", 42).move_to([0.6, 1.6, 0])
        self.say("쉽게 견주는 방법은?", "비율 5분의 2와 4분의 3처럼 기준량이 다른 비율을 쉽게 견줄 수 있는 방법이 있을까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def hundred(self):
        self.section("기준량을 100으로")
        gr = grid100(0, size=3.6).move_to([-3.4, 0.2, 0])
        self.say(f"기준량을 {o('100')}으로", "기준량을 100으로 정해 볼게요. 100칸짜리 모눈 전체가 기준량이에요.")
        self.play(FadeIn(gr), run_time=0.6)
        one = gr[0][0].copy().set_fill(ORANGE, 1)
        t1 = row(frac(1, 100, 46), "=", M(o("1 %"), 50), size=46).move_to([2.6, 1.6, 0])
        t2 = M("1 퍼센트라고 읽어요", 32, SOFT).next_to(t1, DOWN, buff=0.25)
        self.say(f"1/100 = {o('1 %')}", "비율 100분의 1을 1 퍼센트라 하고 기호로 1 %라고 써요.")
        self.play(FadeIn(one), FadeIn(t1), FadeIn(t2), run_time=0.7)
        cells = VGroup(*[gr[0][i].copy().set_fill(ORANGE, 1) for i in range(40)])
        t3 = row(frac(2, 5, 46), "=", frac(40, 100, 46, cn=ORANGE), "=", M(g("40 %"), 50), size=46).move_to([2.6, -0.6, 0])
        self.say(f"2/5 = 40/100 = {g('40 %')}", "5분의 2를 기준량이 100인 비율로 바꾸면 100분의 40, 40 퍼센트예요. 기준량을 100으로 할 때의 비율을 백분율이라고 해요.")
        self.play(LaggedStart(*[FadeIn(c) for c in cells], lag_ratio=0.02, run_time=1.2), FadeIn(t3))
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def convert(self):
        self.section("비율에 100을 곱해요")
        e1 = M(f"0.4 × 100 = 40  →  {g('40 %')}", 50).move_to([0, 1.5, 0])
        self.say(f"0.4 × 100 → {g('40 %')}", "비율에 100을 곱한 값에 퍼센트를 붙여도 돼요. 0.4 곱하기 100은 40, 40 퍼센트예요.")
        self.play(FadeIn(e1), run_time=0.6)
        e2 = row(frac(3, 4, 50), "× 100 = 75  →", M(g("75 %"), 50), size=48).move_to([0, 0.1, 0])
        self.say(f"3/4 × 100 → {g('75 %')}", "4분의 3에 100을 곱하면 75, 75 퍼센트예요.")
        self.play(FadeIn(e2), run_time=0.6)
        c = M(f"40 % &lt; 75 % → {b('3/4')}이 더 커요", 44).move_to([0, -1.4, 0])
        self.say(f"백분율로 바꾸면 견주기 쉬워요", "백분율로 바꾸면 기준량이 모두 100이 되어서 크기를 한눈에 견줄 수 있어요.")
        self.play(FadeIn(c), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
