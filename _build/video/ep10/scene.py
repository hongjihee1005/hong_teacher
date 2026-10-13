"""「수학 원리 돋보기」 10화 — 12의 3분의 2는 몇 개일까? (2학기 4단원 분수 2·3차시, 화 코드 2-4-a)

분수 복습(분모 = 똑같이 나눈 수, 분자 = 그중 몇) → 구슬 12개를 3묶음 → 한 묶음 = 12의 1/3 = 4
→ 2묶음 = 12의 2/3 = 8 → 4개씩 묶으면? (분모는 묶음의 수) → 24의 3/4 = 18
최종: ./make_final.sh 10
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (
    DOWN, LEFT, RIGHT, UP,
    Create, FadeIn, FadeOut, GrowFromCenter, Indicate, LaggedStart, Line, RoundedRectangle,
    SurroundingRectangle, VGroup, Write,
)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, frac_bar, marble, row


class Ep10(EpisodeScene):
    EP_NO = 10
    EP_TITLE = "12의 3분의 2는 몇 개일까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.review()
        self.problem()
        self.marbles()
        self.which_den()
        self.practice()
        self.closing(f"전체의 분수만큼은 {b('분모')}만큼 똑같이 묶고\n{o('분자')}만큼 묶음을 세요",
                     next_preview="11화 · 길이와 시간도 분수만큼")
        self.wait(0.5)

    # ── 분수 다시 보기 ──
    def review(self):
        self.section("분수 다시 보기")
        bar = frac_bar(5, 3).move_to([-2.2, 0.6, 0])
        f = frac(3, 5, 110, cn=ORANGE, cd=BLUE).move_to([3.0, 0.6, 0])
        self.say("띠를 똑같이 5로 나눈 것 중 3을 색칠했어요", "띠를 똑같이 5로 나눈 것 중 3을 색칠했어요.")
        self.play(FadeIn(bar), run_time=0.7)
        self.wait(0.6)
        self.say("5분의 3이라고 해요", "이것을 5분의 3이라고 해요.")
        self.play(Write(f), run_time=1.0)
        ld = M(f"{b('분모')}: 똑같이 나눈 수", 40).next_to(f.den, RIGHT, buff=0.5)
        ln = M(f"{o('분자')}: 그중 몇", 40).next_to(f.num, RIGHT, buff=0.5)
        VGroup(ld, ln).shift(LEFT * 0.0)
        self.say(f"아래 {b('분모')}는 나눈 수, 위 {o('분자')}는 그중 몇", "아래의 분모는 똑같이 나눈 수, 위의 분자는 그중 몇 개인지를 나타내요.")
        self.play(FadeIn(ld, shift=LEFT * 0.2), Indicate(f.den, color=BLUE), run_time=0.8)
        self.play(FadeIn(ln, shift=LEFT * 0.2), Indicate(f.num, color=ORANGE), run_time=0.8)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    # ── 문제 ──
    def problem(self):
        self.section("문제")
        ms = VGroup(*[marble() for _ in range(12)]).arrange(RIGHT, buff=0.2).move_to([0, -0.2, 0])
        lab = T("12개", 44, INK).next_to(ms, DOWN, buff=0.3)
        self.say(f"구슬이 {b('12개')} 있어요", "구슬이 12개 있어요.")
        self.play(LaggedStart(*[GrowFromCenter(m) for m in ms], lag_ratio=0.06, run_time=1.2), FadeIn(lab))
        q = row("12의", frac(2, 3, 64), "는 몇 개일까요?", size=60).move_to([0, 2.0, 0])
        self.say("12의 3분의 2는 몇 개일까요?", "구슬 12개의 3분의 2는 몇 개일까요?")
        self.play(FadeIn(q, shift=DOWN * 0.2), run_time=0.8)
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    # ── 구슬 묶기 (핵심 장면) ──
    def marbles(self):
        self.section("똑같이 묶어 보기")
        ms = VGroup(*[marble() for _ in range(12)]).arrange(RIGHT, buff=0.2).move_to([0, 1.3, 0])
        self.play(FadeIn(ms), run_time=0.5)
        f23 = frac(2, 3, 80, cn=ORANGE, cd=BLUE).move_to([-5.6, 1.5, 0])
        self.play(FadeIn(f23), run_time=0.4)
        self.say(f"{b('분모 3')}: 똑같이 {b('3묶음')}으로 나눠요", "분모가 3이니까, 먼저 구슬 12개를 똑같이 3묶음으로 나누어요.")
        self.play(Indicate(f23.den, color=BLUE, scale_factor=1.4), run_time=0.7)
        cx = [-3.6, 0, 3.6]
        targets = []
        for gi in range(3):
            for k in range(4):
                r, c = divmod(k, 2)
                targets.append(np.array([cx[gi] - 0.22 + c * 0.44, 0.5 - r * 0.44 + 0.22, 0]))
        self.play(*[m.animate.move_to(p) for m, p in zip(ms, targets)], run_time=1.4)
        boxes = VGroup(*[RoundedRectangle(corner_radius=0.2, width=1.5, height=1.4, color=BLUE, stroke_width=5).move_to([x, 0.5, 0]) for x in cx])
        self.play(LaggedStart(*[Create(bx) for bx in boxes], lag_ratio=0.25, run_time=0.9))
        cnt = VGroup(*[T("4개", 38, BLUE).next_to(bx, DOWN, buff=0.2) for bx in boxes])
        self.say(f"12 ÷ 3 = 4 → 한 묶음은 {b('4개')}", "12를 3묶음으로 나누면 12 나누기 3, 한 묶음은 4개예요.")
        self.play(FadeIn(cnt), run_time=0.6)
        self.wait(0.6)
        one = row("12의", frac(1, 3, 52, cd=BLUE), f"= {b('4')}", size=50).move_to([0, -1.75, 0])
        self.say("한 묶음은 12의 3분의 1, 4개", "한 묶음은 전체 3묶음 중 1묶음이니까 12의 3분의 1, 4개예요.")
        self.play(Indicate(boxes[0], color=BLUE, scale_factor=1.08), FadeIn(one), run_time=0.9)
        self.wait(1.0)
        self.say(f"{o('분자 2')}: {o('2묶음')}을 세요", "분자가 2이니까 2묶음을 세요.")
        self.play(Indicate(f23.num, color=ORANGE, scale_factor=1.4), run_time=0.7)
        self.play(*[m[0].animate.set_fill(ORANGE) for m in ms[:8]],
                  boxes[0].animate.set_color(ORANGE), boxes[1].animate.set_color(ORANGE), run_time=0.9)
        two = row("12의", frac(2, 3, 52, cn=ORANGE, cd=BLUE), f"= 4 + 4 = {g('8')}", size=50).move_to([0, -1.75, 0])
        self.say(f"4개씩 2묶음 → {g('8개')}", "4개씩 2묶음이니까 4 더하기 4, 8개예요.")
        self.play(FadeOut(one), FadeIn(two), run_time=0.7)
        ans = SurroundingRectangle(two, color=GREEN, buff=0.18, stroke_width=6, corner_radius=0.15)
        self.play(Create(ans), run_time=0.5)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)

    # ── 분모는 무엇일까 ──
    def which_den(self):
        self.section("헷갈리지 마세요")
        ms = VGroup(*[marble() for _ in range(12)])
        cx = [-4.2, -1.4, 1.4, 4.2]
        for i, m in enumerate(ms):
            gi, k = divmod(i, 3)
            m.move_to([cx[gi] - 0.4 + k * 0.4, 0.9, 0])
        boxes = VGroup(*[RoundedRectangle(corner_radius=0.2, width=1.55, height=0.8, color=BLUE, stroke_width=5).move_to([x, 0.9, 0]) for x in cx])
        q = M(f"12개를 {o('3개씩')} 묶었어요. 한 묶음은 전체의 얼마일까요?", 44)
        q.scale_to_fit_width(min(q.width, 10.8)).move_to([0.4, 2.3, 0])
        self.say("이번에는 3개씩 묶었어요", "이번에는 구슬 12개를 3개씩 묶었어요. 한 묶음은 전체의 얼마일까요?")
        self.play(FadeIn(q), FadeIn(ms), run_time=0.8)
        self.play(LaggedStart(*[Create(bx) for bx in boxes], lag_ratio=0.2, run_time=0.9))
        self.wait(1.6)
        nums = VGroup(*[T(f"{i + 1}묶음", 34, BLUE).next_to(bx, DOWN, buff=0.2) for i, bx in enumerate(boxes)])
        self.say(f"묶음을 세면 {b('4묶음')}", "묶음의 수를 세어 보면 모두 4묶음이에요.")
        self.play(LaggedStart(*[FadeIn(n) for n in nums], lag_ratio=0.2, run_time=0.9))
        a1 = row("한 묶음 =", frac(1, 4, 60, cd=BLUE), size=54).move_to([0, -1.1, 0])
        wrong = row("(", frac(1, 3, 44, cd=SOFT), "이 아니에요)", size=40).set_color(SOFT).next_to(a1, RIGHT, buff=0.5)
        self.say(f"한 묶음은 {b('4분의 1')}, 3분의 1이 아니에요",
                 "한 묶음은 4묶음 중 1묶음이니까 4분의 1이에요. 묶음 안의 개수 3을 분모로 쓰면 안 돼요.")
        self.play(FadeIn(a1, scale=1.2), run_time=0.6)
        self.play(FadeIn(wrong), run_time=0.5)
        tip = M(f"{b('분모')}는 한 묶음 안의 개수가 아니라 {b('전체 묶음의 수')}", 42).move_to([0, -2.2, 0])
        self.play(FadeIn(tip, shift=UP * 0.2), run_time=0.6)
        self.wait(1.8)
        self.settle()
        clear_stage(self, 0.6)

    # ── 연습 ──
    def practice(self):
        self.section("스스로 구해 보기")
        q = row("24의", frac(3, 4, 64, cn=ORANGE, cd=BLUE), "는?", size=64).move_to([0, 2.0, 0])
        self.say("24의 4분의 3은 얼마일까요?", "24의 4분의 3은 얼마일까요? 잠깐 생각해 보세요.")
        self.play(FadeIn(q), run_time=0.6)
        self.wait(2.5)
        s1 = M(f"① {b('분모 4')}: 24 ÷ 4 = {b('6')}  (한 묶음)", 50).move_to([0, 0.5, 0])
        s2 = M(f"② {o('분자 3')}: 6 + 6 + 6 = {g('18')}  (3묶음)", 50).move_to([0, -0.6, 0])
        s2.align_to(s1, LEFT)
        self.say(f"① 24를 {b('4묶음')}으로: 한 묶음 {b('6')}", "먼저 분모 4만큼 똑같이 나누면 24 나누기 4, 한 묶음은 6이에요.")
        self.play(FadeIn(s1, shift=RIGHT * 0.2), run_time=0.6)
        self.wait(0.6)
        self.say(f"② {o('3묶음')}을 세면 {g('18')}", "분자 3만큼 3묶음을 세면 6, 12, 18. 24의 4분의 3은 18이에요.")
        self.play(FadeIn(s2, shift=RIGHT * 0.2), run_time=0.6)
        bx = SurroundingRectangle(s2, color=GREEN, buff=0.15, stroke_width=5, corner_radius=0.15)
        self.play(Create(bx), run_time=0.5)
        self.wait(1.8)
        self.settle()
        clear_stage(self, 0.7)
        self.hide_chip()
