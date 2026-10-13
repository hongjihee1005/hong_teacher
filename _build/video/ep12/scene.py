"""「수학 원리 돋보기」 12화 — 진분수와 가분수 (2학기 4단원 분수 5차시, 화 코드 2-4-c)

4분의 1 조각을 하나씩 늘려 가기 → 4분의 4 = 1 → 조각이 모자라면 새 원(새 전체)이 생김 → 4분의 7
→ 진분수·가분수 이름 → 자연수를 분수로(1 = 5/5, 2 = 6/3) → 고르기
최종: ./make_final.sh 12
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (
    DOWN, LEFT, RIGHT, UP,
    Create, FadeIn, FadeOut, Indicate, LaggedStart, RoundedRectangle, SurroundingRectangle,
    Transform, VGroup, Write,
)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, pie, row
from items import check_mark


class Ep12(EpisodeScene):
    EP_NO = 12
    EP_TITLE = "진분수와 가분수"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.count_up()
        self.names()
        self.whole_numbers()
        self.sort_quiz()
        self.closing(f"분자 &lt; 분모 → {b('진분수')},  분자 ≥ 분모 → {o('가분수')}\n분자와 분모가 같으면 {g('1')}과 같아요",
                     next_preview="13화 · 대분수")
        self.wait(0.5)

    # ── 문제 ──
    def problem(self):
        self.section("문제")
        q = M(f"분자가 분모보다 {o('큰')} 분수도 있을까요?", 58).move_to([0, 1.6, 0])
        f = frac(7, 4, 110, cn=ORANGE).move_to([0, -0.5, 0])
        self.say("지금까지 본 분수는 분자가 분모보다 작았어요", "지금까지 본 분수는 5분의 3처럼 분자가 분모보다 작았어요.")
        self.play(Write(q), run_time=1.2)
        self.say("4분의 7 같은 분수도 있을까요?", "그럼 4분의 7처럼 분자가 분모보다 큰 분수도 있을까요?")
        self.play(FadeIn(f, scale=1.2), run_time=0.8)
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    # ── 4분의 1씩 세기 (핵심 장면) ──
    def count_up(self):
        self.section("4분의 1씩 세어 보기")
        r = 1.35
        p1 = pie(4, 0, r).move_to([-3.6, 0.4, 0])
        p2 = pie(4, 0, r).move_to([0.0, 0.4, 0])
        self.say(f"원을 똑같이 4조각으로 나눈 한 조각은 {o('4분의 1')}", "원을 똑같이 4조각으로 나누면 한 조각은 4분의 1이에요.")
        self.play(FadeIn(p1), run_time=0.6)
        lab = frac(1, 4, 90, cn=ORANGE).move_to([4.3, 0.4, 0])
        self.play(p1[0].animate.set_fill(ORANGE), FadeIn(lab), run_time=0.6)
        self.wait(0.6)
        self.say("한 조각씩 늘려 볼까요?", "한 조각씩 늘려 볼까요?")
        for k in (2, 3):
            new = frac(k, 4, 90, cn=ORANGE).move_to(lab)
            self.play(p1[k - 1].animate.set_fill(ORANGE), Transform(lab, new), run_time=0.6)
            self.wait(0.4)
        new = frac(4, 4, 90, cn=ORANGE).move_to(lab)
        self.say(f"4조각을 모두 칠하면 {o('4분의 4')} = 원 {g('1')}개", "4조각을 모두 칠하면 4분의 4. 원 하나가 꽉 찼으니 1과 같아요.")
        self.play(p1[3].animate.set_fill(ORANGE), Transform(lab, new), run_time=0.6)
        eq1 = M(f"= {g('1')}", 90).next_to(lab, RIGHT, buff=0.25)
        self.play(FadeIn(eq1), Indicate(p1, color=GREEN, scale_factor=1.06), run_time=0.8)
        self.wait(1.0)
        self.say(f"조각이 더 필요하면? {g('새 원')}이 생겨요!", "한 조각 더 칠하고 싶으면 어떻게 할까요? 조각이 모자라니 새 원이 생겨요!")
        self.play(FadeOut(eq1), FadeIn(p2, shift=LEFT * 0.3), run_time=0.8)
        for k in (5, 6, 7):
            new = frac(k, 4, 90, cn=ORANGE).move_to(lab)
            self.play(p2[k - 5].animate.set_fill(ORANGE), Transform(lab, new), run_time=0.6)
            self.wait(0.35)
        self.say(f"4분의 1이 7개 → {o('4분의 7')}", "4분의 1이 모두 7개. 그래서 4분의 7이에요. 분자가 분모보다 큰 분수도 있어요!")
        self.play(Indicate(lab, color=ORANGE, scale_factor=1.2), run_time=0.8)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)

    # ── 이름 ──
    def names(self):
        self.section("진분수와 가분수")
        left = VGroup(frac(1, 4, 70, cn=BLUE), frac(2, 4, 70, cn=BLUE), frac(3, 4, 70, cn=BLUE)).arrange(RIGHT, buff=0.6)
        right = VGroup(frac(4, 4, 70, cn=ORANGE), frac(5, 4, 70, cn=ORANGE), frac(7, 4, 70, cn=ORANGE)).arrange(RIGHT, buff=0.6)
        left.move_to([-3.3, 0.9, 0])
        right.move_to([3.3, 0.9, 0])
        bl = RoundedRectangle(corner_radius=0.3, width=5.6, height=3.9, stroke_color=BLUE, stroke_width=5).move_to([-3.3, 0.2, 0])
        br = RoundedRectangle(corner_radius=0.3, width=5.6, height=3.9, stroke_color=ORANGE, stroke_width=5).move_to([3.3, 0.2, 0])
        nl = M(f"{b('진분수')}", 56).move_to([-3.3, -0.5, 0])
        nr = M(f"{o('가분수')}", 56).move_to([3.3, -0.5, 0])
        dl = M("분자 &lt; 분모", 40).move_to([-3.3, -1.4, 0])
        dr = M("분자 = 분모, 분자 &gt; 분모", 40).move_to([3.3, -1.4, 0])
        self.say(f"분자가 분모보다 작은 분수는 {b('진분수')}", "4분의 1, 4분의 2, 4분의 3처럼 분자가 분모보다 작은 분수를 진분수라고 해요.")
        self.play(Create(bl), FadeIn(left), run_time=0.9)
        self.play(FadeIn(nl), FadeIn(dl), run_time=0.6)
        self.wait(0.8)
        self.say(f"분자가 분모와 같거나 큰 분수는 {o('가분수')}",
                 "4분의 4, 4분의 5, 4분의 7처럼 분자가 분모와 같거나 분모보다 큰 분수를 가분수라고 해요.")
        self.play(Create(br), FadeIn(right), run_time=0.9)
        self.play(FadeIn(nr), FadeIn(dr), run_time=0.6)
        self.play(Indicate(right[0], color=ORANGE, scale_factor=1.3), run_time=0.8)
        tip = M(f"4분의 4도 {o('가분수')}예요 (= {g('1')})", 40).move_to([3.3, 2.55, 0])
        self.play(FadeIn(tip), run_time=0.5)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)

    # ── 자연수를 분수로 ──
    def whole_numbers(self):
        self.section("자연수를 분수로")
        r = 1.0
        p = pie(5, 5, r).move_to([-4.2, 0.6, 0])
        e1 = row(f"{g('1')} =", frac(5, 5, 70, cn=ORANGE), size=70).move_to([-4.2, -1.25, 0])
        self.say(f"{g('1')}은 5분의 몇일까요?", "1을 5분의 몇으로 나타낼 수 있을까요? 5조각이 모두 모이면 1이에요.")
        self.play(FadeIn(p), run_time=0.6)
        self.play(FadeIn(e1), run_time=0.6)
        self.wait(0.8)
        ps = VGroup(pie(3, 3, r), pie(3, 3, r)).arrange(RIGHT, buff=0.3).move_to([1.6, 0.6, 0])
        e2 = row(f"{g('2')} =", frac(6, 3, 70, cn=ORANGE), size=70).move_to([1.6, -1.25, 0])
        self.say(f"{g('2')}는 3분의 몇? 3분의 1이 {o('6개')}", "2는 3분의 몇일까요? 원 2개에 3분의 1 조각이 6개. 그래서 3분의 6이에요.")
        self.play(FadeIn(ps), run_time=0.6)
        self.play(FadeIn(e2), run_time=0.6)
        self.wait(1.0)
        e3 = row(f"{g('3')} =", frac(12, 4, 60, cn=ORANGE), size=60).move_to([5.3, -0.2, 0])
        self.say(f"{g('3')}은 4분의 {o('12')} (4 × 3 = 12)", "그럼 3은 4분의 몇일까요? 원 하나에 4조각, 원 3개면 4 곱하기 3, 4분의 12예요.")
        self.play(FadeIn(e3), run_time=0.6)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)

    # ── 고르기 ──
    def sort_quiz(self):
        self.section("가분수를 찾아라")
        items = [(3, 5), (6, 6), (8, 3), (2, 7), (9, 4), (4, 9)]
        fs = VGroup(*[frac(n, d, 76) for n, d in items]).arrange(RIGHT, buff=0.9).move_to([0, 0.9, 0])
        self.say(f"이 중에서 {o('가분수')}를 모두 찾아보세요", "이 중에서 가분수를 모두 찾아보세요. 분자와 분모를 견주어 보세요.")
        self.play(LaggedStart(*[FadeIn(f, shift=UP * 0.2) for f in fs], lag_ratio=0.15, run_time=1.2))
        self.wait(3.0)
        marks = VGroup()
        anims = []
        for f, (n, d) in zip(fs, items):
            col = ORANGE if n >= d else BLUE
            anims.append(f.animate.set_color(col))
            if n >= d:
                marks.add(SurroundingRectangle(f, color=ORANGE, buff=0.15, stroke_width=6, corner_radius=0.15))
        self.say(f"{o('6분의 6, 3분의 8, 4분의 9')}가 가분수!", "분자가 분모와 같거나 큰 6분의 6, 3분의 8, 4분의 9가 가분수예요. 나머지는 진분수예요.")
        self.play(*anims, run_time=0.6)
        self.play(LaggedStart(*[Create(m) for m in marks], lag_ratio=0.3, run_time=1.0))
        names = VGroup(*[T("가분수" if n >= d else "진분수", 30, ORANGE if n >= d else BLUE).next_to(f, DOWN, buff=0.35)
                         for f, (n, d) in zip(fs, items)])
        self.play(FadeIn(names), run_time=0.6)
        self.wait(2.0)
        self.settle()
        clear_stage(self, 0.7)
        self.hide_chip()
