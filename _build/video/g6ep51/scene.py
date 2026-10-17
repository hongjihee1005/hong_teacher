"""「수학 원리 돋보기」 6학년 51화 — 간단한 자연수의 비 (6-2 4단원 3차시, 화 코드 6-2-4-b)

비의 성질로 소수나 분수의 비를 간단한 자연수의 비로 나타냄
(소수) : (소수) → 10, 100, …을 곱함 / (분수) : (분수) → 두 분모의 공배수를 곱함 / 자연수의 비가 되면 공약수로 나눔
(예시: 0.7 : 0.5 = 7 : 5, 1.2 : 0.8 = 12 : 8 = 3 : 2, 1/3 : 1/4 = 4 : 3, 1/2 : 0.3 = 0.5 : 0.3 = 5 : 3)
최종: GRADE=6 ./make_final.sh 51
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Arrow, Create, FadeIn, FadeOut, Indicate, LaggedStart, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, row


class G6Ep51(EpisodeScene):
    GRADE, SEM = 6, 2
    EP_NO = 51
    EP_TITLE = "간단한 자연수의 비"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.decimal()
        self.fraction()
        self.closing(f"소수의 비는 {o('10, 100')}을 곱하고, 분수의 비는 {b('분모의 공배수')}를 곱해요\n자연수의 비가 되면 {g('공약수로 나누어')} 간단히 해요",
                     next_preview="6학년 52화 · 비례식")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("0.7 : 0.5나 1/3 : 1/4처럼 소수나 분수의 비를\n간단한 자연수의 비로 나타낼 수 있을까요?", 40).move_to([0.6, 1.6, 0])
        self.say("자연수의 비로?", "0.7 대 0.5나 3분의 1 대 4분의 1처럼 소수나 분수의 비를 간단한 자연수의 비로 나타낼 수 있을까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def step(self, a, bb, k, y, color=ORANGE):
        e1 = M(a, 48).move_to([-3.6, y, 0])
        e2 = M(bb, 48).move_to([2.4, y, 0])
        ar = Arrow(e1.get_right() + RIGHT * 0.2, e2.get_left() + LEFT * 0.2, color=color, buff=0, stroke_width=5)
        lab = M(f"<span foreground='{color}'>{k}</span>", 30).next_to(ar, UP, buff=0.08)
        return VGroup(e1, ar, lab, e2)

    def decimal(self):
        self.section("소수의 비")
        s1 = self.step("0.7 : 0.5", "7 : 5", "× 10", 1.6)
        self.say(f"전항과 후항에 {o('10')}을 곱해요", "소수 한 자리 수의 비는 전항과 후항에 10을 곱하면 자연수의 비가 돼요. 0.7 대 0.5는 7 대 5예요.")
        self.play(FadeIn(s1), run_time=0.8)
        s2 = self.step("1.2 : 0.8", "12 : 8", "× 10", 0.0)
        s3 = self.step("12 : 8", "3 : 2", "÷ 4", -1.4, BLUE)
        self.say(f"자연수의 비가 되면 {b('공약수로')} 나누어요", "1.2 대 0.8은 10을 곱하면 12 대 8이에요. 12와 8의 공약수 4로 나누면 3 대 2로 더 간단해져요.")
        self.play(FadeIn(s2), run_time=0.7)
        self.play(FadeIn(s3), run_time=0.7)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def fraction(self):
        self.section("분수의 비")
        e = row(frac(1, 3, 52), ":", frac(1, 4, 52), size=50).move_to([-3.6, 1.5, 0])
        r = M("4 : 3", 52).move_to([2.4, 1.5, 0])
        ar = Arrow(e.get_right() + RIGHT * 0.2, r.get_left() + LEFT * 0.2, color=ORANGE, buff=0, stroke_width=5)
        lab = M(o("× 12"), 30).next_to(ar, UP, buff=0.08)
        self.say(f"분모 3과 4의 공배수 {o('12')}를 곱해요", "분수의 비는 두 분모의 공배수를 곱해요. 3과 4의 공배수 12를 곱하면 3분의 1 곱하기 12는 4, 4분의 1 곱하기 12는 3이에요. 4 대 3이에요.")
        self.play(FadeIn(e), run_time=0.5)
        self.play(Create(ar), FadeIn(lab), FadeIn(r), run_time=0.8)
        e2 = row(frac(1, 2, 52), ": 0.3", "=", "0.5 : 0.3", "=", M(g("5 : 3"), 50), size=50).move_to([0, -0.3, 0])
        self.say(f"분수와 소수가 섞이면 {b('한 가지로')} 바꾸어요", "분수와 소수가 섞여 있으면 분수를 소수로 바꾸거나 소수를 분수로 바꾸어요. 2분의 1 대 0.3은 0.5 대 0.3, 10을 곱하면 5 대 3이에요.")
        self.play(FadeIn(e2), run_time=0.7)
        t = M("간단한 비는 한 가지만 있는 것이 아니에요", 32, SOFT).move_to([0, -1.6, 0])
        self.play(FadeIn(t), run_time=0.4)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
