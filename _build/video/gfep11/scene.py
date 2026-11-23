"""「수학 원리 돋보기」 분수 특별편 11화 — 가분수와 대분수 바꾸기, 한눈에 정리

가분수 → 대분수: 4분의 11 → 4분의 1 조각을 4개씩 묶으면 1 → 2묶음 + 3조각 → 2와 4분의 3
대분수 → 가분수: 2와 3분의 1 → 1 = 3분의 3으로 풀기 → 3분의 1이 7개 → 3분의 7
수직선 정리: 진분수(0과 1 사이), 4분의 4 = 1, 4분의 7 = 1과 4분의 3(같은 자리) / 세 가지 분수 표
최종: GRADE=f ./make_final.sh 11
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, Dot, FadeIn, FadeOut, Indicate, LaggedStart, Line, Rectangle,
                   SurroundingRectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, frac_bar, row
from fracbasic import mixed_wide as mixed, step_card


class GfEp11(EpisodeScene):
    GRADE, SEM = "F", 1
    LABEL = "분수 특별편 {}화"
    EP_NO = 11
    EP_TITLE = "가분수와 대분수 바꾸기, 한눈에 정리"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.to_mixed()
        self.to_improper()
        self.numline()
        self.summary()
        self.closing(f"가분수 → 대분수: 분모만큼씩 묶어 {g('1')}을 만들어요\n대분수 → 가분수: {g('1')}을 분모만큼 조각으로 풀어요",
                     next_preview="분수 특별편을 모두 마쳤어요! 처음부터 다시 보아도 좋아요")
        self.wait(0.5)

    def to_mixed(self):
        self.section("가분수 → 대분수")
        f = frac(11, 4, 80, cn=ORANGE, cd=BLUE).move_to([-5.9, 0.4, 0])
        self.say("4분의 11을 대분수로 바꾸어 볼까요?", "4분의 11을 대분수로 바꾸어 볼까요?")
        self.play(Write(f), run_time=0.6)
        w = 0.55
        pieces = VGroup(*[Rectangle(width=w, height=0.75, fill_color=ORANGE, fill_opacity=1, stroke_color=INK, stroke_width=4)
                          for _ in range(11)]).arrange(RIGHT, buff=0.12).move_to([0.6, 1.6, 0])
        self.say("4분의 1 조각이 11개", "4분의 11은 4분의 1 조각이 11개 있는 것이에요.")
        self.play(LaggedStart(*[FadeIn(p, scale=0.6) for p in pieces], lag_ratio=0.12, run_time=1.4))
        self.pause_screen(5)
        self.settle()
        bars = VGroup(*[frac_bar(4, 0, width=4 * w, height=0.75) for _ in range(3)]).arrange(RIGHT, buff=0.5).move_to([0.6, -0.2, 0])
        c1 = step_card(1, f"분모 {b('4')}만큼씩 묶으면 {g('1')}이 돼요").move_to([0, 2.55, 0])
        self.say(f"1단계: {b('4')}조각씩 묶으면 {g('1')}", "1단계. 분모가 4이니까 조각 4개가 모이면 막대 하나, 곧 1이 돼요. 4개씩 묶어요.")
        self.play(FadeIn(c1), FadeIn(bars), run_time=0.5)
        anims = [pieces[i].animate.move_to(bars[i // 4][i % 4]) for i in range(11)]
        self.play(LaggedStart(*anims, lag_ratio=0.08, run_time=2.0))
        ones = VGroup(*[T("1", 48, GREEN).next_to(bars[k], DOWN, buff=0.25) for k in range(2)])
        rest = frac(3, 4, 44, cn=ORANGE, cd=BLUE).next_to(bars[2], DOWN, buff=0.2)
        self.say(f"꽉 찬 막대 {g('2개')}, 남은 조각 {o('3개')}", "꽉 찬 막대가 2개, 남은 조각이 3개예요.")
        self.play(FadeIn(ones), FadeIn(rest), run_time=0.6)
        c2 = step_card(2, f"꽉 찬 것은 {g('자연수')}, 남은 것은 {o('진분수')}로").move_to([0, 2.55, 0])
        res = row(frac(11, 4, 60, cn=ORANGE, cd=BLUE), "=", mixed(2, 3, 4, 60, cw=GREEN, cn=ORANGE, cd=BLUE), size=60).move_to([-1.6, -1.95, 0])
        self.say(f"2단계: 4분의 11 = {g('2')}와 {o('4분의 3')}", "2단계. 꽉 찬 2개는 자연수 2, 남은 것은 4분의 3. 4분의 11은 2와 4분의 3이에요.")
        self.play(FadeOut(c1), FadeIn(c2), Write(res), run_time=0.8)
        tip = M(f"(11 안에 4가 {g('2번')}, {o('3')}이 남아요)", 32, SOFT).next_to(res, RIGHT, buff=0.5)
        self.say("11 안에 4가 2번, 3이 남아요", "11 안에 4가 2번 들어가고 3이 남는 것과 같아요.")
        self.play(FadeIn(tip), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def to_improper(self):
        self.section("대분수 → 가분수")
        m = mixed(2, 1, 3, 80, cw=GREEN, cn=ORANGE, cd=BLUE).move_to([-5.6, 0.4, 0])
        self.say("이번에는 2와 3분의 1을 가분수로", "이번에는 거꾸로, 2와 3분의 1을 가분수로 바꾸어 볼까요?")
        self.play(Write(m), run_time=0.6)
        bars = VGroup(frac_bar(3, 3, width=2.4, height=0.8, color=GREEN), frac_bar(3, 3, width=2.4, height=0.8, color=GREEN),
                      frac_bar(3, 1, width=2.4, height=0.8)).arrange(RIGHT, buff=0.45).move_to([0.8, 1.4, 0])
        labs = VGroup(T("1", 44, GREEN).next_to(bars[0], DOWN, buff=0.2), T("1", 44, GREEN).next_to(bars[1], DOWN, buff=0.2),
                      frac(1, 3, 40, cn=ORANGE, cd=BLUE).next_to(bars[2], DOWN, buff=0.15))
        self.say(f"꽉 찬 막대 {g('2개')}와 {o('3분의 1')}", "2와 3분의 1은 꽉 찬 막대 2개와 3분의 1이에요.")
        self.play(FadeIn(bars), FadeIn(labs), run_time=0.7)
        self.pause_screen(5)
        self.settle()
        c1 = step_card(1, f"{g('1')}을 분모 {b('3')}만큼 조각으로 풀어요: 1 = 3분의 3").move_to([0, 2.55, 0])
        self.say(f"1단계: {g('1')} = {o('3분의 3')}", "1단계. 막대 하나 1을 분모 3만큼 조각으로 풀어요. 1은 3분의 1이 3개, 3분의 3이에요.")
        self.play(FadeIn(c1), run_time=0.4)
        self.play(*[c.animate.set_fill(ORANGE, 1) for c in bars[0]], *[c.animate.set_fill(ORANGE, 1) for c in bars[1]],
                  FadeOut(labs[0]), FadeOut(labs[1]), run_time=0.8)
        nums = VGroup()
        k = 0
        for bar in bars:
            for i, c in enumerate(bar):
                if bar is bars[2] and i >= 1:
                    break
                k += 1
                nums.add(T(str(k), 32, INK).move_to(c))
        c2 = step_card(2, f"3분의 1 조각을 모두 세어요").move_to([0, 2.55, 0])
        self.say(f"2단계: 3분의 1이 모두 {o('7개')}", "2단계. 3분의 1 조각을 모두 세어요. 3개, 3개, 1개, 모두 7개예요.")
        self.play(FadeOut(c1), FadeIn(c2), LaggedStart(*[FadeIn(n_, scale=1.4) for n_ in nums], lag_ratio=0.5, run_time=2.0))
        res = row(mixed(2, 1, 3, 60, cw=GREEN, cn=ORANGE, cd=BLUE), "=", frac(7, 3, 60, cn=ORANGE, cd=BLUE), size=60).move_to([0, -1.2, 0])
        self.say(f"2와 3분의 1 = {o('3분의 7')}", "그래서 2와 3분의 1은 3분의 7이에요.")
        self.play(Write(res), run_time=0.7)
        tip = M(f"(3 + 3 + 1 = 7, 분모 {b('3')}은 그대로)", 36, SOFT).move_to([0, -2.3, 0])
        self.say(f"분모 {b('3')}은 그대로예요", "3 더하기 3 더하기 1은 7. 조각 크기가 같으니 분모 3은 그대로예요.")
        self.play(FadeIn(tip), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def numline(self):
        self.section("수직선에서 한눈에")
        L, U, y = -5.0, 4.6, 0.0   # 0에서 2까지, 1만큼의 길이 U
        x = lambda v: L + U * v
        ln = Line([L - 0.3, y, 0], [x(2) + 0.4, y, 0], color=INK, stroke_width=5)
        ticks = VGroup(*[Line([x(i / 4), y - (0.25 if i % 4 == 0 else 0.15), 0], [x(i / 4), y + (0.25 if i % 4 == 0 else 0.15), 0],
                              color=INK, stroke_width=5 if i % 4 == 0 else 3) for i in range(9)])
        nums = VGroup(*[T(str(i), 44, GREEN if i else INK).next_to(ticks[4 * i], DOWN, buff=0.25) for i in range(3)])
        self.say("0부터 2까지 수직선, 1칸을 4로 나누었어요", "0부터 2까지 수직선이에요. 1만큼을 똑같이 4칸으로 나누었어요.")
        self.play(Create(ln), Create(ticks), FadeIn(nums), run_time=0.9)
        zone = Rectangle(width=U, height=0.5, fill_color=BLUE, fill_opacity=0.12, stroke_width=0).move_to([x(0.5), y, 0])
        zl = M(f"{b('진분수')}: 0과 1 사이", 36).move_to([x(0.5), 1.9, 0])
        pts = VGroup(*[VGroup(Dot([x(i / 4), y, 0], radius=0.1, color=BLUE), frac(i, 4, 34, cn=BLUE, cd=BLUE).move_to([x(i / 4), 0.9, 0])) for i in (1, 2, 3)])
        self.say(f"{b('진분수')}는 0과 1 사이", "진분수 4분의 1, 4분의 2, 4분의 3은 0과 1 사이에 있어요.")
        self.play(FadeIn(zone), FadeIn(zl), FadeIn(pts), run_time=0.7)
        p1 = VGroup(Dot([x(1), y, 0], radius=0.12, color=ORANGE), frac(4, 4, 34, cn=ORANGE, cd=ORANGE).move_to([x(1), 0.9, 0]))
        self.say(f"{o('4분의 4')}는 1과 같은 자리", "가분수 4분의 4는 1과 같은 자리에 있어요.")
        self.play(FadeIn(p1), run_time=0.5)
        p7 = VGroup(Dot([x(1.75), y, 0], radius=0.12, color=ORANGE), frac(7, 4, 34, cn=ORANGE, cd=ORANGE).move_to([x(1.75), 0.9, 0]),
                    mixed(1, 3, 4, 34, cw=GREEN, cn=GREEN, cd=GREEN).move_to([x(1.75), -1.25, 0]))
        lab = M(f"{o('가분수')} 4분의 7 = {g('대분수')} 1과 4분의 3 (같은 자리)", 36).move_to([0.6, -2.25, 0])
        self.say(f"4분의 7 = 1과 4분의 3, {g('같은 자리')}", "가분수 4분의 7과 대분수 1과 4분의 3은 수직선에서 같은 자리예요. 같은 수를 다르게 쓴 거예요.")
        self.play(FadeIn(p7), FadeIn(lab), run_time=0.7)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def summary(self):
        self.section("세 가지 분수 정리")
        rows = [
            ("진분수", "분자가 분모보다 작아요", "1보다 작아요", "4분의 3"),
            ("가분수", "분자가 분모와 같거나 커요", "1과 같거나 커요", "4분의 7"),
            ("대분수", "자연수 + 진분수", "1보다 커요", "1과 4분의 3"),
        ]
        head = ["이름", "생김새", "크기", "예"]
        widths, h = [2.1, 5.0, 3.3, 2.9], 0.95
        colors = [GREEN, INK, INK, INK]
        tb = VGroup()
        for r, line in enumerate([head] + [list(x) for x in rows]):
            xx = -sum(widths) / 2
            for c, (txt, wd) in enumerate(zip(line, widths)):
                fill = "#D7ECEC" if (r == 0 or c == 0) else PAPER
                rect = Rectangle(width=wd, height=h, stroke_color=INK, stroke_width=2, fill_color=fill, fill_opacity=1)
                rect.move_to([xx + wd / 2, 1.5 - r * h, 0])
                col = INK if r == 0 else colors[c]
                tb.add(rect, M(txt, 32 if c else 38, col).move_to(rect))
                xx += wd
        self.say("세 가지 분수를 한눈에 정리해요", "진분수, 가분수, 대분수를 한눈에 정리해 볼까요?")
        self.play(FadeIn(tb, lag_ratio=0.05), run_time=1.2)
        self.say(f"진분수 {b('1보다 작음')} · 가분수 {o('1 이상')} · 대분수 {g('자연수와 진분수')}",
                 "진분수는 1보다 작고, 가분수는 1과 같거나 크고, 대분수는 자연수와 진분수로 이루어져 있어요.")
        self.wait(2.0)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
