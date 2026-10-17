"""「수학 원리 돋보기」 6학년 18화 — 두 수를 비교하는 두 방법 (6-1 4단원 2차시, 화 코드 6-1-4-a)

모노레일 한 대에 어른 6명, 어린이 3명
뺄셈으로 비교: 어른이 어린이보다 3명 많음 (모노레일이 늘면 차이도 변함: 3, 6, 9, 12)
나눗셈으로 비교: 어른 수는 어린이 수의 2배, 어린이 수는 어른 수의 1/2배 (모노레일이 늘어도 변하지 않음)
최종: GRADE=6 ./make_final.sh 18
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Circle, Create, FadeIn, FadeOut, Indicate, LaggedStart, RoundedRectangle,
                   SurroundingRectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from tablekit import table


def person(color, r=0.17):
    head = Circle(radius=r * 0.62, fill_color=color, fill_opacity=1, stroke_color=INK, stroke_width=2)
    body = RoundedRectangle(width=r * 1.9, height=r * 1.6, corner_radius=r * 0.6, fill_color=color, fill_opacity=1, stroke_color=INK, stroke_width=2)
    body.next_to(head, DOWN, buff=0.03)
    return VGroup(head, body)


class G6Ep18(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 18
    EP_TITLE = "두 수를 비교하는 두 방법"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.two_ways()
        self.grow()
        self.closing(f"두 양은 {o('뺄셈')}(차이)이나 {b('나눗셈')}(몇 배)으로 비교해요\n두 양이 함께 늘어나도 {g('몇 배인지는 변하지 않아요')}",
                     next_preview="6학년 19화 · 비란?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("모노레일 한 대에 어른 6명, 어린이 3명이 타요.\n어른과 어린이 수를 어떻게 비교할 수 있을까요?", 40).move_to([0.6, 1.8, 0])
        self.say("어떻게 비교할까요?", "모노레일 한 대에 어른 6명, 어린이 3명이 타요. 어른 수와 어린이 수를 어떻게 비교할 수 있을까요?")
        self.play(Write(q), run_time=1.0)
        car = RoundedRectangle(width=5.4, height=1.4, corner_radius=0.4, fill_color="#E8DDBE", fill_opacity=1, stroke_color=INK, stroke_width=4).move_to([0, -0.3, 0])
        ad = VGroup(*[person(BLUE, 0.2) for _ in range(6)]).arrange(RIGHT, buff=0.12).move_to([-0.9, -0.3, 0])
        ch = VGroup(*[person(ORANGE, 0.15) for _ in range(3)]).arrange(RIGHT, buff=0.12).move_to([1.9, -0.35, 0])
        self.play(FadeIn(car), LaggedStart(*[FadeIn(p) for p in list(ad) + list(ch)], lag_ratio=0.08, run_time=1.0))
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def two_ways(self):
        self.section("뺄셈과 나눗셈")
        ad = VGroup(*[person(BLUE, 0.22) for _ in range(6)]).arrange(RIGHT, buff=0.15).move_to([-3.0, 1.6, 0])
        ch = VGroup(*[person(ORANGE, 0.22) for _ in range(3)]).arrange(RIGHT, buff=0.15)
        ch.next_to(ad, DOWN, buff=0.35).align_to(ad, LEFT)
        la = T("어른", 28, BLUE).next_to(ad, LEFT, buff=0.3)
        lc = T("어린이", 28, ORANGE).next_to(ch, LEFT, buff=0.3)
        self.play(FadeIn(ad), FadeIn(ch), FadeIn(la), FadeIn(lc), run_time=0.6)
        extra = SurroundingRectangle(ad[3:], color=SOFT, buff=0.08)
        e1 = M(f"뺄셈: 6 − 3 = {o('3')}  → 어른이 3명 더 많아요", 32).move_to([1.6, 0.0, 0])
        self.say(f"뺄셈으로: {o('3명 더')} 많아요", "뺄셈으로 비교하면 6 빼기 3은 3, 어른이 어린이보다 3명 더 많아요.")
        self.play(Create(extra), FadeIn(e1), run_time=0.7)
        self.play(FadeOut(extra), run_time=0.3)
        pairs = VGroup(SurroundingRectangle(ad[:3], color=GREEN, buff=0.08), SurroundingRectangle(ad[3:], color=GREEN, buff=0.08))
        e2 = M(f"나눗셈: 6 ÷ 3 = {b('2')}  → 어른 수는 어린이 수의 2배", 32).move_to([1.6, -0.9, 0])
        e3 = M(f"3 ÷ 6 = {b('1/2')}  → 어린이 수는 어른 수의 1/2배", 32).move_to([1.6, -1.7, 0])
        self.say(f"나눗셈으로: {b('2배')}", "나눗셈으로 비교하면 6 나누기 3은 2, 어른 수는 어린이 수의 2배예요. 어린이 수는 어른 수의 2분의 1배예요.")
        self.play(Create(pairs), FadeIn(e2), run_time=0.7)
        self.play(FadeIn(e3), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def grow(self):
        self.section("모노레일이 늘어나면")
        rows = [["모노레일 수(대)", "1", "2", "3", "4"],
                ["어른 수(명)", "6", "12", "18", "24"],
                ["어린이 수(명)", "3", "6", "9", "12"]]
        frame, cells = table(rows, (0, 1.6), cw=1.3, hw=3.2, h=0.62, size=30)
        self.say("모노레일이 늘어나면?", "모노레일이 2대, 3대, 4대로 늘어나면 어떻게 될까요?")
        self.play(FadeIn(frame), *[FadeIn(c) for r in cells for c in r], run_time=0.8)
        f2, c2 = table([["어른 − 어린이", "3", "6", "9", "12"], ["어른 ÷ 어린이", "2", "2", "2", "2"]], (0, -0.8), cw=1.3, hw=3.2, h=0.62, size=30, head_row=False)
        self.say(f"차이는 {o('변하고')}", "어른과 어린이의 차이는 3, 6, 9, 12로 계속 변해요.")
        self.play(FadeIn(f2[:5]), *[FadeIn(c) for c in c2[0]], run_time=0.6)
        self.play(*[c.animate.set_color(ORANGE) for c in c2[0][1:]], run_time=0.4)
        self.say(f"몇 배인지는 {b('변하지 않아요')}", "하지만 어른 수는 언제나 어린이 수의 2배예요. 두 양이 함께 늘어나도 몇 배인지는 변하지 않아요.")
        self.play(FadeIn(f2[5:]), *[FadeIn(c) for c in c2[1]], run_time=0.6)
        self.play(*[c.animate.set_color(BLUE) for c in c2[1][1:]], run_time=0.4)
        self.play(Indicate(VGroup(*c2[1][1:]), color=BLUE), run_time=0.8)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
