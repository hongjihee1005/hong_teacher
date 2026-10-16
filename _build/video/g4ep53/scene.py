"""「수학 원리 돋보기」 4학년 53화 — 다각형은 어떤 도형일까? (4-2 6단원 2·3차시, 화 코드 4-2-6-a)

선분으로만 둘러싸인 도형 = 다각형 (굽은 선이 있거나, 둘러싸이지 않으면 아님)
변의 수로 이름: 오각형·육각형·칠각형·팔각형 — 변의 수 = 꼭짓점의 수
최종: GRADE=4 ./make_final.sh 53
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Arc, Circle, Create, Cross, Dot, FadeIn, FadeOut, Indicate, LaggedStart,
                   Line, VGroup, VMobject, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from shapes import PURPLE, poly, regular

RED = "#C0392B"
NAMES = {5: "오각형", 6: "육각형", 7: "칠각형", 8: "팔각형"}


def irregular(n, r, c, seed):
    rng = np.random.default_rng(seed)
    c = np.array(c, float)
    pts = []
    for k in range(n):
        a = np.radians(90 + 360 * k / n + rng.uniform(-12, 12))
        rr = r * rng.uniform(0.8, 1.05)
        pts.append(c + rr * np.array([np.cos(a), np.sin(a), 0]))
    return pts


class G4Ep53(EpisodeScene):
    GRADE, SEM = 4, 2
    EP_NO = 53
    EP_TITLE = "다각형은 어떤 도형일까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.define()
        self.names()
        self.closing(f"{o('선분으로만')} 둘러싸인 도형이 다각형\n변이 몇 개인지에 따라 {g('오각형, 육각형, …')}",
                     next_preview="4학년 54화 · 정다각형")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("이 도형들의 이름은 무엇일까요?", 48).move_to([0.6, 2.2, 0])
        shs = VGroup(*[poly(irregular(n, 1.1, [x, -0.4, 0], n), fill=c) for n, x, c in
                       ((5, -4.2, ORANGE), (6, -1.4, BLUE), (7, 1.4, GREEN), (8, 4.2, PURPLE))])
        self.say("삼각형, 사각형 말고 다른 도형", "삼각형과 사각형은 알고 있지요. 그럼 이런 도형들은 이름이 무엇일까요?")
        self.play(Write(q), LaggedStart(*[Create(s) for s in shs], lag_ratio=0.2, run_time=1.4))
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def define(self):
        self.section("다각형")
        a = poly(irregular(5, 1.2, [-4.2, 0.3, 0], 3), fill=BLUE)
        c = Circle(radius=1.1, color=INK, stroke_width=5).set_fill(ORANGE, 0.25).move_to([0, 0.3, 0])
        P = irregular(6, 1.2, [4.2, 0.3, 0], 9)
        op = VMobject(color=INK, stroke_width=5)
        op.set_points_as_corners(P)
        la = T("①", 38).move_to([-4.2, -1.4, 0])
        lc = T("②", 38).move_to([0, -1.4, 0])
        lo = T("③", 38).move_to([4.2, -1.4, 0])
        self.say("세 도형을 견주어 봐요", "세 도형을 견주어 볼까요?")
        self.play(Create(a), Create(c), Create(op), FadeIn(VGroup(la, lc, lo)), run_time=1.2)
        x2 = Cross(c, stroke_color=RED, stroke_width=6).scale(0.7)
        self.say(f"②는 {o('굽은 선')}으로 되어 있어요", "②는 굽은 선으로 둘러싸여 있어요.")
        self.play(Create(x2), run_time=0.5)
        gapd = VGroup(Dot(P[0], radius=0.1, color=RED), Dot(P[-1], radius=0.1, color=RED))
        x3 = Cross(op, stroke_color=RED, stroke_width=6).scale(0.7)
        self.say(f"③은 {o('둘러싸여 있지 않아요')}", "③은 선분이 끊어져 있어 둘러싸여 있지 않아요.")
        self.play(FadeIn(gapd, scale=2), Create(x3), run_time=0.6)
        t = M(f"{o('선분으로만')} 둘러싸인 도형 = {g('다각형')}", 46).move_to([0, 2.3, 0])
        self.say(f"선분으로만 둘러싸인 ①이 {g('다각형')}", "①처럼 선분으로만 둘러싸인 도형을 다각형이라고 해요.")
        self.play(FadeIn(t), Indicate(a, color=GREEN), run_time=0.8)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def names(self):
        self.section("변의 수로 이름 붙이기")
        xs = [-4.8, -1.6, 1.6, 4.8]
        cols = [ORANGE, BLUE, GREEN, PURPLE]
        shapes_, labels = [], []
        for n, x, cl in zip((5, 6, 7, 8), xs, cols):
            P = irregular(n, 1.1, [x, 1.25, 0], n + 20)
            shapes_.append((P, poly(P, fill=cl)))
        self.say("변을 세어 이름을 붙여요", "다각형은 변의 수에 따라 이름을 붙여요. 변을 하나씩 세어 볼까요?")
        self.play(*[Create(s) for _, s in shapes_], run_time=1.0)
        for (P, s), n, x, cl in zip(shapes_, (5, 6, 7, 8), xs, cols):
            nums = VGroup()
            c = np.mean(P, axis=0)
            for k in range(n):
                m = (P[k] + P[(k + 1) % n]) / 2
                d = m - c
                nums.add(T(str(k + 1), 22, cl).move_to(m + d / np.linalg.norm(d) * 0.28))
            name = M(f"변 {n}개\n{g(NAMES[n])}", 34).move_to([x, -0.95, 0])
            labels.append(name)
            self.say(f"변이 {n}개 → {g(NAMES[n])}", f"변이 {n}개이면 {NAMES[n]}이에요.")
            self.play(LaggedStart(*[FadeIn(t) for t in nums], lag_ratio=0.12, run_time=0.9), FadeIn(name))
        dots = VGroup(*[Dot(p, radius=0.08, color=RED) for p in shapes_[1][0]])
        n2 = M(f"변의 수 = {o('꼭짓점의 수')}", 40).move_to([0, -2.3, 0])
        self.say(f"변의 수와 {o('꼭짓점의 수')}는 같아요", "육각형의 꼭짓점을 세어 보면 6개예요. 다각형은 변의 수와 꼭짓점의 수가 같아요.")
        self.play(LaggedStart(*[FadeIn(d, scale=2) for d in dots], lag_ratio=0.1, run_time=0.8), FadeIn(n2))
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
