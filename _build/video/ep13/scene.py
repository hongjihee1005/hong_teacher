"""「수학 원리 돋보기」 13화 — 대분수 (2학기 4단원 분수 6차시, 화 코드 2-4-d)

4분의 7 조각 → 원 하나(1)와 4분의 3 → 1과 4분의 3(대분수) → 대분수 → 가분수(단위분수 개수 세기)
→ 가분수 → 대분수(분모만큼씩 묶기: 4분의 9 = 2와 4분의 1)
최종: ./make_final.sh 13
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (
    DOWN, LEFT, RIGHT, UP,
    Create, FadeIn, FadeOut, Indicate, LaggedStart, RoundedRectangle, SurroundingRectangle, VGroup, Write,
)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, mixed, pie, row


class Ep13(EpisodeScene):
    EP_NO = 13
    EP_TITLE = "대분수"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.regroup()
        self.to_improper()
        self.to_mixed()
        self.closing(f"자연수와 진분수로 이루어진 분수가 {g('대분수')}\n단위분수가 몇 개인지 세면 가분수와 서로 바꿀 수 있어요",
                     next_preview="14화 · 분모가 같은 분수의 크기 비교")
        self.wait(0.5)

    # ── 문제 ──
    def problem(self):
        self.section("문제")
        p1 = pie(4, 4, 1.2).move_to([-1.5, -0.3, 0])
        p2 = pie(4, 3, 1.2).move_to([1.5, -0.3, 0])
        f = frac(7, 4, 80, cn=ORANGE).move_to([5.0, -0.3, 0])
        self.say(f"지난 시간에 본 {o('4분의 7')}이에요", "지난 시간에 본 4분의 7이에요. 원 하나가 꽉 차고, 조각 3개가 더 있어요.")
        self.play(FadeIn(p1), FadeIn(p2), FadeIn(f), run_time=0.8)
        q = M(f"1보다 큰 분수를 {g('더 쉽게')} 나타낼 수는 없을까요?", 52).move_to([0, 2.2, 0])
        self.say("1보다 큰 분수를 더 쉽게 나타낼 수는 없을까요?", "1보다 큰 분수를 한눈에 알아보기 쉽게 나타낼 수는 없을까요?")
        self.play(Write(q), run_time=1.2)
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    # ── 1과 4분의 3 (핵심 장면) ──
    def regroup(self):
        self.section("1과 4분의 3")
        p1 = pie(4, 4, 1.25).move_to([-3.3, 0.6, 0])
        p2 = pie(4, 3, 1.25).move_to([0.0, 0.6, 0])
        self.play(FadeIn(p1), FadeIn(p2), run_time=0.6)
        self.say(f"꽉 찬 원 하나는 {g('1')}", "꽉 찬 원 하나는 1이에요.")
        one = T("1", 90, GREEN).next_to(p1, DOWN, buff=0.3)
        self.play(Indicate(p1, color=GREEN, scale_factor=1.06), FadeIn(one), run_time=0.8)
        self.say(f"남은 조각은 {o('4분의 3')}", "남은 조각 3개는 4분의 3이에요.")
        th = frac(3, 4, 64, cn=ORANGE).next_to(p2, DOWN, buff=0.25)
        self.play(FadeIn(th), run_time=0.6)
        self.wait(0.6)
        m = mixed(1, 3, 4, 90, cw=GREEN, cn=ORANGE).move_to([4.2, 1.0, 0])
        self.say(f"합쳐서 {g('1')}과 {o('4분의 3')}이라고 써요", "이 둘을 합쳐 1과 4분의 3이라고 쓰고, 그대로 1과 4분의 3이라고 읽어요.")
        self.play(FadeIn(m, shift=LEFT * 0.3), run_time=0.8)
        nm = M(f"자연수 + 진분수\n→ {g('대분수')}", 44).next_to(m, DOWN, buff=0.4)
        self.say(f"자연수와 진분수로 이루어진 분수: {g('대분수')}", "1과 4분의 3처럼 자연수와 진분수로 이루어진 분수를 대분수라고 해요.")
        self.play(FadeIn(nm), run_time=0.6)
        self.wait(1.0)
        eq = row(frac(7, 4, 80, cn=ORANGE), "=", mixed(1, 3, 4, 80, cw=GREEN, cn=ORANGE), size=80).move_to([0, -0.4, 0])
        self.say(f"{o('4분의 7')}과 {g('1과 4분의 3')}은 같은 수", "4분의 7과 1과 4분의 3은 같은 양을 다르게 나타낸 같은 수예요.")
        self.play(FadeOut(VGroup(one, th, nm)), VGroup(p1, p2).animate.scale(0.75).shift(UP * 1.0 + RIGHT * 1.6),
                  m.animate.set_opacity(0), run_time=0.6)
        self.play(FadeIn(eq), run_time=0.7)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)

    # ── 대분수 → 가분수 ──
    def to_improper(self):
        self.section("대분수를 가분수로")
        m = mixed(2, 1, 3, 90, cw=GREEN, cn=ORANGE).move_to([-4.6, 1.3, 0])
        self.say(f"{g('2와 3분의 1')}을 가분수로 바꿔 볼까요?", "2와 3분의 1을 가분수로 바꾸어 볼까요?")
        self.play(FadeIn(m), run_time=0.6)
        ps = VGroup(pie(3, 3, 0.9), pie(3, 3, 0.9), pie(3, 1, 0.9)).arrange(RIGHT, buff=0.35).move_to([1.4, 1.3, 0])
        self.play(FadeIn(ps), run_time=0.7)
        self.say(f"3분의 1 조각을 세어요: 3, 6, {o('7')}", "3분의 1 조각이 모두 몇 개인지 세어 봐요. 원 하나에 3개씩, 3, 6, 그리고 1개 더해서 7개.")
        labs = VGroup()
        k = 0
        for pi_, cnt in zip(ps, (3, 3, 1)):
            for i in range(cnt):
                k += 1
                a = np.pi / 2 - 2 * np.pi * (i + 0.5) / 3
                labs.add(T(str(k), 30, PAPER).move_to(pi_.get_center() + 0.5 * np.array([np.cos(a), np.sin(a), 0])))
        self.play(LaggedStart(*[FadeIn(l, scale=1.5) for l in labs], lag_ratio=0.25, run_time=1.8))
        e = row(mixed(2, 1, 3, 60, cw=GREEN, cn=ORANGE), f"= 3 × 2 + 1 = {o('7')}개 →", frac(7, 3, 60, cn=ORANGE), size=50).move_to([0, -1.3, 0])
        self.say(f"3분의 1이 {o('7개')} → {o('3분의 7')}", "3분의 1이 3 곱하기 2, 더하기 1, 7개예요. 그래서 3분의 7이에요.")
        self.play(FadeIn(e), run_time=0.8)
        self.wait(1.8)
        self.settle()
        clear_stage(self, 0.6)

    # ── 가분수 → 대분수 ──
    def to_mixed(self):
        self.section("가분수를 대분수로")
        f = frac(9, 4, 90, cn=ORANGE).move_to([-5.2, 1.3, 0])
        self.say(f"{o('4분의 9')}를 대분수로 바꿔 볼까요?", "이번에는 4분의 9를 대분수로 바꾸어 볼까요? 4분의 1 조각이 9개예요.")
        self.play(FadeIn(f), run_time=0.6)
        pieces = VGroup(*[pie(4, 1, 0.55)[0].copy() for _ in range(9)])
        for i, s in enumerate(pieces):
            s.move_to([-3.4 + i * 0.95, 1.3, 0])
        self.play(LaggedStart(*[FadeIn(s, scale=0.6) for s in pieces], lag_ratio=0.1, run_time=1.2))
        self.say(f"{b('분모 4')}만큼씩 묶으면 원 하나", "분모가 4이니까 4조각씩 모으면 원 하나, 곧 1이 돼요.")
        targets = [pie(4, 4, 0.9).move_to([-2.6, 0.0, 0]), pie(4, 4, 0.9).move_to([0.0, 0.0, 0]), pie(4, 1, 0.9).move_to([2.6, 0.0, 0])]
        anims = []
        for i, s in enumerate(pieces):
            gi, kk = divmod(i, 4)
            tgt = targets[gi][kk]
            anims.append(s.animate.become(tgt))
        self.play(LaggedStart(*anims, lag_ratio=0.12, run_time=2.2))
        rest = targets[2].copy()
        for kk in range(1, 4):
            self.add(rest[kk])
        self.bring_to_front(*pieces)
        lab = VGroup(T("1", 60, GREEN).next_to(targets[0], DOWN, buff=0.2), T("1", 60, GREEN).next_to(targets[1], DOWN, buff=0.2),
                     frac(1, 4, 44, cn=ORANGE).next_to(targets[2], DOWN, buff=0.15))
        self.play(FadeIn(lab), run_time=0.6)
        e = row(frac(9, 4, 60, cn=ORANGE), "=", mixed(2, 1, 4, 60, cw=GREEN, cn=ORANGE), size=60).move_to([4.8, 1.3, 0])
        self.say(f"원 {g('2개')}와 {o('4분의 1')} → {g('2와 4분의 1')}", "원 2개와 4분의 1 조각 하나가 남았어요. 그래서 4분의 9는 2와 4분의 1이에요.")
        self.play(FadeIn(e), run_time=0.7)
        tip = M(f"9 ÷ 4 = {g('2')} … {o('1')}  →  몫은 자연수, 나머지는 분자", 40).move_to([1.6, -2.4, 0])
        self.say("나눗셈으로도 생각할 수 있어요", "나눗셈으로 생각하면 9 나누기 4는 2, 나머지 1. 몫 2가 자연수, 나머지 1이 분자가 돼요.")
        self.play(FadeIn(tip, shift=UP * 0.2), run_time=0.7)
        self.wait(2.0)
        self.settle()
        clear_stage(self, 0.7)
        self.hide_chip()
