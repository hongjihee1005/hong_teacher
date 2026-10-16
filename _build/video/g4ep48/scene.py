"""「수학 원리 돋보기」 4학년 48화 — 마름모의 성질 (4-2 4단원 7차시, 화 코드 4-2-4-e)

네 변의 길이가 모두 같은 사각형 = 마름모 (같은 길이 막대 네 개로 만든 사각형을 기울여도 네 변은 같음)
마주 보는 두 쌍의 변이 평행, 마주 보는 각이 같음, 두 대각선이 서로 수직으로 만나고 서로를 똑같이 둘로 나눔
최종: GRADE=4 ./make_final.sh 48
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, DashedLine, Dot, FadeIn, FadeOut, Indicate, Line, ValueTracker,
                   VGroup, Write, always_redraw)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from shapes import PURPLE, arc_at, par_mark, poly, right_mark, tick

RED = "#C0392B"


def rhombus(c, s, deg):
    """한 변 s, 아래 왼쪽 각 deg인 마름모 꼭짓점(가운데 c)"""
    c = np.array(c, float)
    a = np.radians(deg)
    A = np.array([0, 0, 0.0])
    B = A + np.array([s, 0, 0])
    D = A + np.array([s * np.cos(a), s * np.sin(a), 0])
    C = B + D - A
    m = (A + C) / 2
    return [p - m + c for p in (A, B, C, D)]


class G4Ep48(EpisodeScene):
    GRADE, SEM = 4, 2
    EP_NO = 48
    EP_TITLE = "마름모의 성질"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.lean()
        self.diag()
        self.closing(f"마름모는 {o('네 변의 길이가 모두 같은')} 사각형\n두 대각선은 서로 {g('수직')}으로 만나고 서로를 {b('똑같이 둘로')} 나눠요",
                     next_preview="4학년 49화 · 사각형들은 어떤 관계일까?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("길이가 같은 막대 네 개로 만든 사각형에는\n어떤 성질이 있을까요?", 44).move_to([0.6, 2.1, 0])
        P = rhombus([0, -0.7, 0], 2.4, 60)
        t = poly(P, fill=PURPLE)
        self.say("길이가 같은 막대 네 개", "길이가 같은 막대 네 개를 이어 만든 사각형에는 어떤 성질이 있을까요?")
        self.play(Write(q), Create(t), run_time=1.2)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def lean(self):
        self.section("마름모")
        th = ValueTracker(90)
        c = [-2.4, -0.3, 0]

        def shape():
            P = rhombus(c, 2.6, th.get_value())
            return VGroup(poly(P, fill=PURPLE, op=0.2), *[tick(P[i], P[(i + 1) % 4], 1, color=ORANGE) for i in range(4)])
        sh = always_redraw(shape)
        self.say("네 변의 길이가 같은 정사각형", "막대 네 개로 정사각형을 만들었어요. 네 변의 길이가 모두 같아요.")
        self.add(sh)
        self.wait(0.6)
        self.say("옆으로 기울여 볼까요?", "이 사각형을 옆으로 살짝 밀어 기울여 볼게요.")
        self.play(th.animate.set_value(55), run_time=2.0)
        tx = M(f"네 변의 길이가 모두 같은\n사각형 = {g('마름모')}", 44).move_to([3.4, 0.9, 0])
        self.say(f"네 변이 같은 사각형 = {g('마름모')}", "기울여도 막대의 길이는 그대로라 네 변의 길이가 모두 같아요. 이런 사각형을 마름모라고 해요.")
        self.play(FadeIn(tx), run_time=0.6)
        P = rhombus(c, 2.6, 55)
        q = lambda a, b_: (a + (b_ - a) * 0.14, a + (b_ - a) * 0.62)
        pm = VGroup(par_mark(*q(P[0], P[1])), par_mark(*q(P[3], P[2])), par_mark(*q(P[0], P[3]), 2, color=GREEN), par_mark(*q(P[1], P[2]), 2, color=GREEN))
        arcs = VGroup(arc_at(P, 0, 0.45, ORANGE), arc_at(P, 2, 0.45, ORANGE), arc_at(P, 1, 0.4, BLUE, 2), arc_at(P, 3, 0.4, BLUE, 2))
        t2 = M(f"마주 보는 변이 {b('평행')}하고\n마주 보는 {o('각의 크기가 같아요')}", 38).move_to([3.4, -1.0, 0])
        self.say(f"마주 보는 변은 평행, 마주 보는 각은 같아요", "마름모도 마주 보는 두 쌍의 변이 평행해요. 그래서 평행사변형처럼 마주 보는 각의 크기가 같아요.")
        self.play(Create(pm), Create(arcs), FadeIn(t2), run_time=0.9)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def diag(self):
        self.section("두 대각선")
        c = np.array([-2.4, -0.3, 0])
        P = rhombus(c, 2.7, 60)
        t = poly(P, fill=PURPLE, op=0.2)
        self.say("마주 보는 꼭짓점을 이어요", "마주 보는 꼭짓점끼리 선분으로 이어 볼게요. 이 선분을 대각선이라고 해요.")
        self.play(FadeIn(t), run_time=0.5)
        d1 = Line(P[0], P[2], color=BLUE, stroke_width=6)
        d2 = Line(P[1], P[3], color=ORANGE, stroke_width=6)
        self.play(Create(d1), Create(d2), run_time=1.0)
        u = (P[2] - P[0]) / np.linalg.norm(P[2] - P[0])
        v = (P[3] - P[1]) / np.linalg.norm(P[3] - P[1])
        rm = right_mark(c, u, v, 0.3, color=GREEN)
        self.say(f"두 대각선이 {g('수직')}으로 만나요", "두 대각선이 만나는 곳을 보면 직각이에요. 두 대각선은 서로 수직으로 만나요.")
        self.play(Create(rm), run_time=0.6)
        tk = VGroup(tick(P[0], c, 1, color=BLUE), tick(c, P[2], 1, color=BLUE), tick(P[1], c, 2, color=ORANGE), tick(c, P[3], 2, color=ORANGE))
        self.say(f"서로를 {b('똑같이 둘로')} 나눠요", "또 한 대각선은 다른 대각선을 똑같이 둘로 나누어요. 만난 곳에서 양쪽 길이가 같아요.")
        self.play(Create(tk), run_time=0.7)
        tx = M(f"두 대각선은\n서로 {g('수직')}으로 만나고\n서로를 {b('똑같이 둘로')} 나눠요", 42).move_to([3.4, 0.8, 0])
        e = M(f"대각선 8 cm → 반은 {b('4 cm')}", 42).move_to([3.4, -1.3, 0])
        self.say(f"대각선이 8 cm이면 반은 {b('4 cm')}", "그래서 한 대각선의 길이가 8센티미터이면, 만난 곳에서 양쪽으로 4센티미터씩 나뉘어요.")
        self.play(FadeIn(tx), run_time=0.6)
        self.play(FadeIn(e), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
