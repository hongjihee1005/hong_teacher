"""「수학 원리 돋보기」 11화 — 길이와 시간도 분수만큼 (2학기 4단원 분수 4차시, 화 코드 2-4-b)

30 cm 색 테이프의 5분의 2 = 12 cm, 5분의 4 = 24 cm → 1시간(60분)의 3분의 1 = 20분, 4분의 3 = 45분
→ 1 m의 4분의 1 = 25 cm, 1시간의 2분의 1 = 30분
최종: ./make_final.sh 11
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (
    DOWN, LEFT, PI, RIGHT, TAU, UP,
    Brace, Circle, Create, Dot, FadeIn, FadeOut, Indicate, LaggedStart, Line, Sector,
    SurroundingRectangle, VGroup, Write,
)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, frac_bar, row


def clock_face(c, r=1.8):
    face = Circle(radius=r, fill_color=PAPER, fill_opacity=1, stroke_color=INK, stroke_width=6).move_to(c)
    ticks = VGroup()
    for k in range(60):
        a = PI / 2 - TAU * k / 60
        d = np.array([np.cos(a), np.sin(a), 0])
        ln = 0.22 if k % 5 == 0 else 0.1
        ticks.add(Line(c + d * (r - ln), c + d * r, color=INK, stroke_width=4 if k % 5 == 0 else 2))
    nums = VGroup(*[T(str(h), 30).move_to(c + (r - 0.45) * np.array([np.cos(PI / 2 - TAU * h / 12), np.sin(PI / 2 - TAU * h / 12), 0]))
                    for h in range(1, 13)])
    return VGroup(face, ticks, nums)


def minute_sector(c, r, start_min, minutes, color):
    return Sector(radius=r - 0.02, start_angle=PI / 2 - TAU * start_min / 60, angle=-TAU * minutes / 60,
                  fill_color=color, fill_opacity=0.55, stroke_width=0).move_arc_center_to(c)


class Ep11(EpisodeScene):
    EP_NO = 11
    EP_TITLE = "길이와 시간도 분수만큼"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.tape()
        self.clock()
        self.practice()
        self.closing(f"길이와 시간도 {b('분모')}만큼 똑같이 나누고\n{o('분자')}만큼 세면 돼요",
                     next_preview="12화 · 진분수와 가분수")
        self.wait(0.5)

    # ── 문제 ──
    def problem(self):
        self.section("문제")
        bar = frac_bar(1, 0, width=9.0, height=0.7, color=ORANGE).move_to([0, 0.0, 0])
        bar[0].set_fill("#F7D9B5", 1)
        lab = T("30 cm", 44).next_to(bar, DOWN, buff=0.3)
        self.say(f"길이가 {b('30 cm')}인 색 테이프가 있어요", "길이가 30센티미터인 색 테이프가 있어요.")
        self.play(FadeIn(bar), FadeIn(lab), run_time=0.8)
        q = row("30 cm의", frac(2, 5, 60, cn=ORANGE, cd=BLUE), "는 몇 cm일까요?", size=56).move_to([0, 2.0, 0])
        self.say("30 cm의 5분의 2는 몇 cm일까요?", "30센티미터의 5분의 2는 몇 센티미터일까요? 길이도 분수만큼 구할 수 있을까요?")
        self.play(FadeIn(q, shift=DOWN * 0.2), run_time=0.8)
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    # ── 색 테이프 (핵심 장면) ──
    def tape(self):
        self.section("색 테이프 나누기")
        W = 9.0
        bar = frac_bar(5, 0, width=W, height=0.8).move_to([0, 1.0, 0])
        whole = VGroup(bar)
        self.say(f"{b('분모 5')}: 똑같이 {b('5칸')}으로 나눠요", "분모가 5이니까, 30센티미터를 똑같이 5칸으로 나누어요.")
        self.play(FadeIn(bar), run_time=0.8)
        cells = VGroup(*[T("6 cm", 32, BLUE).move_to(c.get_center()) for c in bar])
        self.say(f"30 ÷ 5 = 6 → 한 칸은 {b('6 cm')}", "30 나누기 5는 6, 한 칸은 6센티미터예요.")
        self.play(LaggedStart(*[FadeIn(x) for x in cells], lag_ratio=0.15, run_time=1.0))
        br = Brace(bar, DOWN, color=SOFT)
        bl = T("30 cm", 36, SOFT).next_to(br, DOWN, buff=0.1)
        self.play(FadeIn(br), FadeIn(bl), run_time=0.5)
        self.wait(0.6)
        self.say(f"{o('분자 2')}: {o('2칸')}을 세면 6 + 6 = {g('12 cm')}", "분자가 2이니까 2칸을 세면 6 더하기 6, 12센티미터예요.")
        self.play(*[bar[i].animate.set_fill(ORANGE, 1) for i in range(2)], run_time=0.7)
        a1 = row("30 cm의", frac(2, 5, 52, cn=ORANGE, cd=BLUE), f"= 6 + 6 = {g('12 cm')}", size=50).move_to([0, -1.6, 0])
        self.play(FadeIn(a1), run_time=0.6)
        self.wait(1.4)
        self.say(f"{o('4칸')}이면? 6 × 4 = {g('24 cm')}", "그럼 5분의 4는요? 4칸을 세면 6 곱하기 4, 24센티미터예요.")
        self.play(*[bar[i].animate.set_fill(ORANGE, 1) for i in range(2, 4)], run_time=0.7)
        a2 = row("30 cm의", frac(4, 5, 52, cn=ORANGE, cd=BLUE), f"= 6 × 4 = {g('24 cm')}", size=50).move_to(a1)
        self.play(FadeOut(a1), FadeIn(a2), run_time=0.6)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)

    # ── 시계 ──
    def clock(self):
        self.section("1시간을 나누면")
        c = np.array([-3.2, -0.1, 0])
        r = 1.9
        face = clock_face(c, r)
        self.say(f"1시간은 {b('60분')}이에요", "시간도 나눌 수 있어요. 1시간은 60분이에요.")
        self.play(FadeIn(face), run_time=0.8)
        q = row("1시간의", frac(1, 3, 56, cd=BLUE), "은 몇 분?", size=52).move_to([3.0, 1.8, 0])
        self.say("1시간의 3분의 1은 몇 분일까요?", "1시간의 3분의 1은 몇 분일까요?")
        self.play(FadeIn(q), run_time=0.6)
        self.wait(1.0)
        secs = [minute_sector(c, r, 20 * k, 20, col) for k, col in enumerate((ORANGE, BLUE, GREEN))]
        divs = VGroup(*[Line(c, c + r * np.array([np.cos(PI / 2 - TAU * m / 60), np.sin(PI / 2 - TAU * m / 60), 0]),
                             color=INK, stroke_width=5) for m in (0, 20, 40)])
        self.say(f"60분을 똑같이 {b('3')}으로 나누면 {o('20분')}씩", "60분을 똑같이 3으로 나누면 60 나누기 3, 20분씩이에요.")
        self.play(Create(divs), run_time=0.8)
        self.play(FadeIn(secs[0]), run_time=0.6)
        self.bring_to_front(face[1], face[2], divs)
        a1 = row("1시간의", frac(1, 3, 48, cd=BLUE), f"= 60 ÷ 3 = {g('20분')}", size=46).move_to([3.0, 0.5, 0])
        self.play(FadeIn(a1), run_time=0.6)
        self.wait(1.4)
        self.play(FadeOut(VGroup(secs[0], divs)), run_time=0.4)
        q2 = row("1시간의", frac(3, 4, 48, cn=ORANGE, cd=BLUE), "는?", size=46).move_to([3.0, -0.7, 0])
        self.say("1시간의 4분의 3은?", "이번에는 1시간의 4분의 3은 몇 분일까요?")
        self.play(FadeIn(q2), run_time=0.6)
        divs4 = VGroup(*[Line(c, c + r * np.array([np.cos(PI / 2 - TAU * m / 60), np.sin(PI / 2 - TAU * m / 60), 0]),
                              color=INK, stroke_width=5) for m in (0, 15, 30, 45)])
        self.play(Create(divs4), run_time=0.8)
        s4 = VGroup(*[minute_sector(c, r, 15 * k, 15, ORANGE) for k in range(3)])
        self.say(f"60 ÷ 4 = 15분, {o('3칸')}이면 {g('45분')}", "60분을 4로 나누면 한 칸은 15분. 3칸을 세면 15, 30, 45. 45분이에요.")
        self.play(LaggedStart(*[FadeIn(s) for s in s4], lag_ratio=0.4, run_time=1.4))
        self.bring_to_front(face[1], face[2], divs4)
        a2 = M(f"15 × 3 = {g('45분')}", 46).move_to([3.0, -1.75, 0])
        self.play(FadeIn(a2), run_time=0.5)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)

    # ── 연습 ──
    def practice(self):
        self.section("스스로 구해 보기")
        qs = [
            (row("1 m(100 cm)의", frac(1, 4, 52, cd=BLUE), "는?", size=52), f"100 ÷ 4 = {g('25 cm')}",
             "1미터, 곧 100센티미터의 4분의 1은 몇 센티미터일까요?", "100 나누기 4, 25센티미터예요."),
            (row("1시간의", frac(1, 2, 52, cd=BLUE), "은?", size=52), f"60 ÷ 2 = {g('30분')}",
             "1시간의 2분의 1은 몇 분일까요?", "60 나누기 2, 30분이에요. 그래서 30분을 반 시간이라고도 해요."),
        ]
        subs = ["1 m(100 cm)의 4분의 1은?", "1시간의 2분의 1은?"]
        for (qm, ans, n1, n2), y, sub in zip(qs, (1.75, -0.45), subs):
            qm.move_to([0, y, 0])
            am = M(ans, 52).next_to(qm, DOWN, buff=0.25)
            self.say(sub, n1)
            self.play(FadeIn(qm), run_time=0.6)
            self.wait(2.2)
            self.say(ans, n2)
            self.play(FadeIn(am, scale=1.2), run_time=0.6)
            self.wait(1.0)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.7)
        self.hide_chip()
