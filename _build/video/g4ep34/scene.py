"""「수학 원리 돋보기」 4학년 34화 — 이등변삼각형과 정삼각형 (4-2 2단원 삼각형 2차시, 화 코드 4-2-2-a)

두 변의 길이가 같은 삼각형 = 이등변삼각형, 세 변의 길이가 같은 삼각형 = 정삼각형
같은 길이 표시로 분류 / 정삼각형도 두 변의 길이가 같으니 이등변삼각형
최종: GRADE=4 ./make_final.sh 34
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, RoundedRectangle,
                   VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from shapes import PURPLE, poly, regular, tick


def iso(c, w=2.4, h=2.6):
    c = np.array(c, float)
    return [c + np.array([-w / 2, -h / 2, 0]), c + np.array([w / 2, -h / 2, 0]), c + np.array([0, h / 2, 0])]


def scalene(c):
    c = np.array(c, float)
    return [c + np.array([-1.4, -1.1, 0]), c + np.array([1.5, -1.1, 0]), c + np.array([-0.5, 1.2, 0])]


class G4Ep34(EpisodeScene):
    GRADE, SEM = 4, 2
    EP_NO = 34
    EP_TITLE = "이등변삼각형과 정삼각형"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.isosceles()
        self.equilateral()
        self.relation()
        self.closing(f"두 변의 길이가 같으면 {o('이등변삼각형')}\n세 변의 길이가 같으면 {g('정삼각형')}",
                     next_preview="4학년 35화 · 접어 보면 보이는 성질")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("세 삼각형의 변의 길이를 비교해 볼까요?", 46).move_to([0.6, 2.3, 0])
        A, B, C = iso([-4.3, -0.4, 0]), regular(3, 1.6, [0, -0.6, 0]), scalene([4.3, -0.4, 0])
        shapes = VGroup(poly(A, fill=ORANGE), poly(B, fill=GREEN), poly(C, fill=BLUE))
        labs = VGroup(*[T(t, 40, SOFT).next_to(s, DOWN, buff=0.25) for t, s in zip("가나다", shapes)])
        self.say("가, 나, 다 삼각형", "가, 나, 다 세 삼각형이 있어요. 변의 길이로 나누어 볼까요?")
        self.play(Write(q), LaggedStart(*[Create(s) for s in shapes], lag_ratio=0.3), FadeIn(labs), run_time=1.6)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def isosceles(self):
        self.section("이등변삼각형")
        A = iso([-2.6, -0.3, 0], 2.8, 3.2)
        t = poly(A, fill=ORANGE)
        self.say("가 삼각형의 변을 재어 봐요", "가 삼각형의 세 변의 길이를 재어 볼까요?")
        self.play(Create(t), run_time=0.7)
        mk = VGroup(tick(A[1], A[2], 1), tick(A[2], A[0], 1))
        self.say(f"{o('두 변')}의 길이가 같아요", "왼쪽 변과 오른쪽 변의 길이가 같아요. 같은 길이는 같은 표시를 해요.")
        self.play(Create(mk), run_time=0.7)
        name = M(f"두 변의 길이가 같은 삼각형\n= {o('이등변삼각형')}", 50).move_to([3.0, 0.3, 0])
        self.say(f"이런 삼각형을 {o('이등변삼각형')}", "두 변의 길이가 같은 삼각형을 이등변삼각형이라고 해요.")
        self.play(FadeIn(name), run_time=0.6)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def equilateral(self):
        self.section("정삼각형")
        B = regular(3, 1.9, [-2.6, -0.6, 0])
        t = poly(B, fill=GREEN)
        self.say("나 삼각형은?", "나 삼각형의 세 변을 재어 보면 어떨까요?")
        self.play(Create(t), run_time=0.7)
        mk = VGroup(*[tick(B[i], B[(i + 1) % 3], 2, color=GREEN) for i in range(3)])
        self.say(f"{g('세 변')}의 길이가 모두 같아요", "세 변의 길이가 모두 같아요.")
        self.play(Create(mk), run_time=0.7)
        name = M(f"세 변의 길이가 같은 삼각형\n= {g('정삼각형')}", 50).move_to([3.0, 0.3, 0])
        self.say(f"이런 삼각형을 {g('정삼각형')}", "세 변의 길이가 같은 삼각형을 정삼각형이라고 해요.")
        self.play(FadeIn(name), run_time=0.6)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def relation(self):
        self.section("정삼각형도 이등변삼각형")
        B = regular(3, 1.8, [-3.0, -0.4, 0])
        t = poly(B, fill=GREEN)
        mk = VGroup(*[tick(B[i], B[(i + 1) % 3], 2, color=GREEN) for i in range(3)])
        self.play(FadeIn(t), FadeIn(mk), run_time=0.5)
        self.say("정삼각형도 이등변삼각형일까요?", "그럼 정삼각형도 이등변삼각형이라고 할 수 있을까요?")
        self.wait(0.6)
        self.play(Indicate(VGroup(mk[1], mk[2]), color=ORANGE, scale_factor=1.4), run_time=0.9)
        a = M(f"세 변이 같으면 {o('두 변')}도 같아요", 42).move_to([2.6, 0.7, 0])
        b_ = M(f"→ 정삼각형은 {o('이등변삼각형')}이에요", 42).move_to([2.6, -0.3, 0])
        self.say(f"정삼각형은 {o('이등변삼각형')}이에요", "세 변의 길이가 같으면 당연히 두 변의 길이도 같아요. 그래서 정삼각형은 이등변삼각형이라고 할 수 있어요.")
        self.play(FadeIn(a), run_time=0.5)
        self.play(FadeIn(b_), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
