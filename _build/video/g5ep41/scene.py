"""「수학 원리 돋보기」 5학년 41화 — 합동 (5-2 3단원 2차시, 화 코드 5-2-3-a)

모양과 크기가 같아서 포개었을 때 완전히 겹치는 두 도형 = 서로 합동
돌리거나 뒤집어서 겹쳐도 합동 / 모양이 같아도 크기가 다르면 합동이 아님
최종: GRADE=5 ./make_final.sh 41
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DEGREES, DOWN, LEFT, PI, RIGHT, UP, Create, Cross, FadeIn, FadeOut, Indicate, Rotate, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from shapes import poly

RED = "#C0392B"
Q = [[0, 0, 0], [2.2, 0, 0], [2.6, 1.3, 0], [0.6, 1.9, 0]]


def quad(c, s=1.0, color=BLUE, op=0.4):
    c = np.array(c, float)
    P = [c + s * (np.array(p) - np.array([1.3, 0.95, 0])) for p in Q]
    return poly(P, fill=color, op=op)


class G5Ep41(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 41
    EP_TITLE = "합동"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.overlap()
        self.turn()
        self.notsame()
        self.closing(f"포개었을 때 {o('완전히 겹치는')} 두 도형은 서로 {g('합동')}\n돌리거나 뒤집어서 겹쳐도 합동이에요",
                     next_preview="5학년 42화 · 대응점·대응변·대응각")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("두 도형은 모양과 크기가 똑같을까요?", 46).move_to([0.6, 2.2, 0])
        a = quad([-2.8, -0.4, 0], color=BLUE)
        b_ = quad([2.8, -0.4, 0], color=ORANGE).rotate(40 * DEGREES)
        self.say("모양과 크기가 같은 도형", "미술관 바닥 타일 두 장이 있어요. 두 도형은 모양과 크기가 똑같을까요?")
        self.play(Write(q), FadeIn(a), FadeIn(b_), run_time=1.2)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def overlap(self):
        self.section("포개어 보기")
        a = quad([-2.8, 0.2, 0], color=BLUE)
        b_ = quad([2.8, 0.2, 0], color=ORANGE)
        self.play(FadeIn(a), FadeIn(b_), run_time=0.5)
        self.say("한 도형을 옮겨 포개면", "오른쪽 도형을 옮겨 왼쪽 도형 위에 포개어 볼게요.")
        self.play(b_.animate.move_to(a.get_center()), run_time=1.4)
        t = M(f"완전히 겹쳐요 → 두 도형은 서로 {g('합동')}", 44).move_to([0, -1.8, 0])
        self.say(f"완전히 겹치면 {g('합동')}", "꼭 맞게 완전히 겹쳐요. 모양과 크기가 같아서 포개었을 때 완전히 겹치는 두 도형을 서로 합동이라고 해요.")
        self.play(FadeIn(t), Indicate(VGroup(a, b_), color=GREEN, scale_factor=1.05), run_time=0.9)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def turn(self):
        self.section("돌리거나 뒤집어도")
        a = quad([-3.0, 0.3, 0], color=BLUE)
        b_ = quad([2.8, 0.3, 0], color=ORANGE).rotate(120 * DEGREES)
        self.say("방향이 달라 보여도", "이번에는 오른쪽 도형이 돌아가 있어요. 방향이 달라 보여도 합동일까요?")
        self.play(FadeIn(a), FadeIn(b_), run_time=0.5)
        self.play(Rotate(b_, -120 * DEGREES), run_time=1.2)
        self.play(b_.animate.move_to(a.get_center()), run_time=1.0)
        t = M(f"돌려서 포개도 완전히 겹치면 {g('합동')}", 42).move_to([0, -1.8, 0])
        self.say(f"돌리거나 뒤집어서 겹쳐도 {g('합동')}", "돌려서 포개니 완전히 겹쳐요. 돌리거나 뒤집어서 겹쳐도 합동이에요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def notsame(self):
        self.section("합동이 아닌 것")
        a = quad([-3.0, 0.3, 0], color=BLUE)
        b_ = quad([2.8, 0.3, 0], s=1.4, color=ORANGE)
        self.say("모양은 같은데 크기가 다르면?", "모양은 같은데 크기가 더 큰 도형은 어떨까요?")
        self.play(FadeIn(a), FadeIn(b_), run_time=0.5)
        self.play(b_.animate.move_to(a.get_center()), run_time=1.0)
        x = Cross(b_, stroke_color=RED, stroke_width=6).scale(0.6)
        t = M(f"크기가 달라 겹치지 않아요 → {RED_T('합동이 아니에요')}", 40).move_to([0, -1.8, 0])
        self.say(f"크기가 다르면 {RED_T('합동이 아니에요')}", "포개어도 남는 부분이 있어 완전히 겹치지 않아요. 크기가 다르면 합동이 아니에요.")
        self.play(Create(x), FadeIn(t), run_time=0.7)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()


def RED_T(s):
    return f'<span foreground="{RED}">{s}</span>'
