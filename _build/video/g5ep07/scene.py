"""「수학 원리 돋보기」 5학년 7화 — 배수와, 약수와 배수의 관계 (5-1 2단원 3차시, 화 코드 5-1-2-b)

영양제를 하루 3알씩: 1일 3, 2일 6, 3일 9 … → 3의 배수 3, 6, 9, 12, …(셀 수 없이 많음)
12 = 3 × 4 → 3과 4는 12의 약수, 12는 3과 4의 배수
최종: GRADE=5 ./make_final.sh 7
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Arrow, ArcBetweenPoints, Circle, Create, Dot, FadeIn, FadeOut, Indicate,
                   LaggedStart, Line, NumberLine, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage

PILL = "#E8A23B"


def pills(n, r=0.12):
    return VGroup(*[Circle(radius=r, fill_color=PILL, fill_opacity=1, stroke_color="#A86A10", stroke_width=2) for _ in range(n)]).arrange(RIGHT, buff=0.04)


class G5Ep07(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 7
    EP_TITLE = "배수와, 약수와 배수의 관계"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.days()
        self.jump()
        self.relation()
        self.closing(f"어떤 수를 1배, 2배, 3배, … 한 수가 그 수의 {g('배수')}\n곱셈식 하나로 {o('약수')}와 {b('배수')}를 함께 읽어요",
                     next_preview="5학년 8화 · 공약수와 최대공약수")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("영양제를 하루에 3알씩 먹어요.\n날수에 따라 필요한 영양제는 몇 알일까요?", 44).move_to([0.6, 1.6, 0])
        p = pills(3, 0.22).move_to([0, -0.5, 0])
        self.say("하루에 3알씩", "영양제를 하루에 3알씩 먹어요. 날수에 따라 필요한 영양제는 몇 알일까요?")
        self.play(Write(q), FadeIn(p), run_time=1.2)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def days(self):
        self.section("날마다 3알씩")
        rows = VGroup()
        for d in range(1, 5):
            lab = T(f"{d}일", 32).move_to([-5.0, 2.0 - (d - 1) * 0.85, 0])
            ps = VGroup(*[pills(3, 0.12) for _ in range(d)]).arrange(RIGHT, buff=0.25).next_to(lab, RIGHT, buff=0.4)
            eq = M(f"3 × {d} = {o(str(3 * d))}", 36).move_to([3.9, lab.get_y(), 0])
            rows.add(VGroup(lab, ps, eq))
        self.say("날수가 늘 때마다 3알씩", "1일은 3알, 2일은 6알, 3일은 9알, 4일은 12알이에요.")
        self.play(LaggedStart(*[FadeIn(r) for r in rows], lag_ratio=0.4, run_time=2.0))
        t = M(f"3을 1배, 2배, 3배, … 한 수 = {g('3의 배수')}", 44).move_to([0, -1.6, 0])
        self.say(f"3, 6, 9, 12, … 는 {g('3의 배수')}", "이렇게 어떤 수를 1배, 2배, 3배 한 수를 그 수의 배수라고 해요. 3, 6, 9, 12는 3의 배수예요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def jump(self):
        self.section("수직선에서 뛰어 세기")
        nl = NumberLine(x_range=[0, 24, 1], length=12.0, include_numbers=False, color=INK, stroke_width=3).move_to([0, 0.2, 0])
        nums = VGroup(*[T(str(k), 24, SOFT).next_to(nl.n2p(k), DOWN, buff=0.18) for k in range(0, 25, 3)])
        self.play(Create(nl), FadeIn(nums), run_time=0.7)
        arcs = VGroup(*[ArcBetweenPoints(nl.n2p(k), nl.n2p(k + 3), angle=-1.6, color=ORANGE, stroke_width=5) for k in range(0, 24, 3)])
        dots = VGroup(*[Dot(nl.n2p(k), radius=0.1, color=ORANGE) for k in range(3, 25, 3)])
        self.say("3씩 뛰어 세면", "수직선에서 0부터 3씩 뛰어 세어 볼게요. 뛰어 센 자리가 모두 3의 배수예요.")
        self.play(LaggedStart(*[Create(a) for a in arcs], lag_ratio=0.3, run_time=2.0), LaggedStart(*[FadeIn(d) for d in dots], lag_ratio=0.3, run_time=2.0))
        t = M(f"3, 6, 9, 12, 15, 18, 21, 24, {o('…')}", 44).move_to([0, -1.5, 0])
        self.say(f"끝없이 이어져요 → {o('셀 수 없이 많아요')}", "계속 뛰어 세면 끝없이 이어져요. 배수는 셀 수 없이 많아요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def relation(self):
        self.section("약수와 배수의 관계")
        eq = M(f"{b('3')} × {b('4')} = {o('12')}", 90).move_to([0, 1.3, 0])
        self.say("곱셈식 하나를 두 가지로 읽어요", "3 곱하기 4는 12. 이 곱셈식 하나를 두 가지로 읽을 수 있어요.")
        self.play(FadeIn(eq), run_time=0.6)
        l1 = M(f"{b('3')}과 {b('4')}는 {o('12')}의 {g('약수')}", 48).move_to([0, -0.4, 0])
        l2 = M(f"{o('12')}는 {b('3')}과 {b('4')}의 {g('배수')}", 48).move_to([0, -1.4, 0])
        self.say(f"3과 4는 12의 {g('약수')}", "12는 3과 4로 나누어떨어지니, 3과 4는 12의 약수예요.")
        self.play(FadeIn(l1), run_time=0.5)
        self.say(f"12는 3과 4의 {g('배수')}", "또 12는 3의 4배, 4의 3배이니, 12는 3과 4의 배수예요.")
        self.play(FadeIn(l2), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
