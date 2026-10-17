"""「수학 원리 돋보기」 5학년 42화 — 대응점·대응변·대응각 (5-2 3단원 3차시, 화 코드 5-2-3-b)

합동인 삼각형 ㄱㄴㄷ과 ㄹㅁㅂ: 포개었을 때 겹치는 점·변·각 = 대응점·대응변·대응각
대응변의 길이가 같고(5 cm·4 cm·3 cm), 대응각의 크기가 같음 / 대응점의 순서대로 읽음
최종: GRADE=5 ./make_final.sh 42
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DEGREES, DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, Line, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from shapes import PURPLE, arc_at, poly

TRI = [np.array(p) for p in ([0, 0, 0], [2.4, 0, 0], [0, 1.8, 0])]


def place(c, rot=0):
    c = np.array(c, float)
    m = sum(TRI) / 3
    R = np.array([[np.cos(np.radians(rot)), -np.sin(np.radians(rot)), 0], [np.sin(np.radians(rot)), np.cos(np.radians(rot)), 0], [0, 0, 1]])
    return [c + R @ (p - m) for p in TRI]


def labels(P, names, color=INK):
    cen = sum(P) / 3
    return VGroup(*[T(nm, 32, color).move_to(p + (p - cen) / np.linalg.norm(p - cen) * 0.35) for p, nm in zip(P, names)])


class G5Ep42(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 42
    EP_TITLE = "대응점·대응변·대응각"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.corr()
        self.props()
        self.closing(f"포개었을 때 겹치는 점·변·각이 {o('대응점·대응변·대응각')}\n합동이면 대응변의 길이와 대응각의 크기가 {g('같아요')}",
                     next_preview="5학년 43화 · 선대칭도형")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("합동인 두 삼각형에서 서로 겹치는\n점, 변, 각은 어떤 관계일까요?", 44).move_to([0.6, 1.9, 0])
        A = poly(place([-2.6, -0.6, 0]), fill=BLUE)
        B = poly(place([2.6, -0.6, 0], 180), fill=ORANGE)
        self.say("합동인 두 삼각형", "합동인 두 삼각형이 있어요. 포개었을 때 서로 겹치는 점, 변, 각은 어떤 관계일까요?")
        self.play(Write(q), FadeIn(A), FadeIn(B), run_time=1.2)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def corr(self):
        self.section("겹치는 점·변·각")
        P = place([-3.0, 0.7, 0])
        Qp = place([3.0, 0.7, 0], 180)
        A, B = poly(P, fill=BLUE), poly(Qp, fill=ORANGE)
        la, lb = labels(P, ["ㄱ", "ㄴ", "ㄷ"]), labels(Qp, ["ㄹ", "ㅁ", "ㅂ"])
        self.play(FadeIn(A), FadeIn(B), FadeIn(la), FadeIn(lb), run_time=0.6)
        ghost = B.copy().set_fill(ORANGE, 0.25)
        self.say("오른쪽 삼각형을 돌려 포개면", "오른쪽 삼각형을 돌려서 왼쪽 삼각형에 포개 볼게요.")
        self.add(ghost)
        self.play(ghost.animate.rotate(180 * DEGREES).move_to(A.get_center()), run_time=1.4)
        self.play(FadeOut(ghost), run_time=0.4)
        cols = [ORANGE, GREEN, PURPLE]
        dots = VGroup(*[VGroup(*[T("●", 26, c).move_to(X[k]) for X in (P, Qp)]) for k, c in enumerate(cols)])
        t1 = M(f"겹치는 점 = {o('대응점')}: ㄱ과 ㄹ, ㄴ과 ㅁ, ㄷ과 ㅂ", 36).move_to([0, -1.45, 0])
        self.say(f"겹치는 점은 {o('대응점')}", "포개었을 때 겹치는 점을 대응점이라고 해요. 점 ㄱ과 점 ㄹ, 점 ㄴ과 점 ㅁ, 점 ㄷ과 점 ㅂ이 대응점이에요.")
        self.play(LaggedStart(*[FadeIn(d) for d in dots], lag_ratio=0.3, run_time=1.0), FadeIn(t1))
        e1 = VGroup(Line(P[0], P[1], color=BLUE, stroke_width=10), Line(Qp[0], Qp[1], color=BLUE, stroke_width=10))
        t2 = M(f"겹치는 변 = {b('대응변')}, 겹치는 각 = {g('대응각')}", 36).move_to([0, -2.1, 0])
        self.say(f"겹치는 변은 {b('대응변')}, 겹치는 각은 {g('대응각')}", "겹치는 변을 대응변, 겹치는 각을 대응각이라고 해요. 변 ㄱㄴ의 대응변은 변 ㄹㅁ이에요.")
        self.play(Create(e1), FadeIn(t2), run_time=0.8)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def props(self):
        self.section("대응변과 대응각의 크기")
        P = place([-3.0, 0.4, 0])
        Qp = place([3.0, 0.4, 0], 180)
        A, B = poly(P, fill=BLUE), poly(Qp, fill=ORANGE)
        la, lb = labels(P, ["ㄱ", "ㄴ", "ㄷ"]), labels(Qp, ["ㄹ", "ㅁ", "ㅂ"])
        def side_lab(X, i, j, s, c):
            m = (X[i] + X[j]) / 2
            cen = sum(X) / 3
            return T(s, 28, c).move_to(m + (m - cen) / np.linalg.norm(m - cen) * 0.55)
        sl = VGroup(side_lab(P, 0, 1, "4 cm", BLUE), side_lab(P, 1, 2, "5 cm", GREEN), side_lab(P, 2, 0, "3 cm", ORANGE),
                    side_lab(Qp, 0, 1, "4 cm", BLUE), side_lab(Qp, 1, 2, "5 cm", GREEN), side_lab(Qp, 2, 0, "3 cm", ORANGE))
        self.say("대응변의 길이를 견주면", "대응변끼리 길이를 견주어 볼까요?")
        self.play(FadeIn(A), FadeIn(B), FadeIn(la), FadeIn(lb), run_time=0.5)
        self.play(FadeIn(sl), run_time=0.7)
        arcs = VGroup(arc_at(P, 1, 0.4, PURPLE), arc_at(Qp, 1, 0.4, PURPLE))
        t = M(f"대응변의 길이가 {o('같고')}, 대응각의 크기가 {g('같아요')}", 40).move_to([0, -1.8, 0])
        self.say(f"대응변의 길이, 대응각의 크기가 {g('같아요')}", "서로 합동인 두 도형은 대응변의 길이가 같고, 대응각의 크기도 같아요. 각 ㄱㄴㄷ과 각 ㄹㅁㅂ처럼 대응점의 순서대로 읽어요.")
        self.play(Create(arcs), FadeIn(t), run_time=0.8)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
