"""「수학 원리 돋보기」 4학년 46화 — 사다리꼴 (4-2 4단원 5차시, 화 코드 4-2-4-c)

평행한 변이 한 쌍이라도 있는 사각형 = 사다리꼴 (두 쌍이어도 사다리꼴, 하나도 없으면 아님)
삼각형을 밑변과 평행하게 자르면 아래쪽이 사다리꼴
최종: GRADE=4 ./make_final.sh 46
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, Cross, DashedLine, FadeIn, FadeOut, Indicate, LaggedStart, Line,
                   VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from shapes import PURPLE, par_mark, poly

RED = "#C0392B"


def at(P, c, s=1.0):
    c = np.array(c, float)
    return [c + s * np.array(p, float) for p in P]


class G4Ep46(EpisodeScene):
    GRADE, SEM = 4, 2
    EP_NO = 46
    EP_TITLE = "사다리꼴"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.define()
        self.sort()
        self.cut()
        self.closing(f"평행한 변이 {o('한 쌍이라도')} 있는 사각형은 {g('사다리꼴')}\n두 쌍이 평행해도 사다리꼴이에요",
                     next_preview="4학년 47화 · 평행사변형의 성질")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("이 사각형에는 어떤 특징이 있을까요?", 48).move_to([0.6, 2.3, 0])
        P = at([[-2.6, -1.2, 0], [2.6, -1.2, 0], [1.3, 1.0, 0], [-1.0, 1.0, 0]], [0, -0.5, 0])
        t = poly(P, fill=ORANGE)
        self.say("이 사각형을 살펴봐요", "이 사각형을 잘 살펴보세요. 어떤 특징이 있을까요?")
        self.play(Write(q), Create(t), run_time=1.2)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def define(self):
        self.section("평행한 변 찾기")
        P = at([[-2.6, -1.2, 0], [2.6, -1.2, 0], [1.3, 1.0, 0], [-1.0, 1.0, 0]], [-2.2, -0.3, 0])
        t = poly(P, fill=ORANGE)
        self.say("위쪽 변과 아래쪽 변을 길게 늘여 봐요", "위쪽 변과 아래쪽 변을 양쪽으로 길게 늘여 볼게요.")
        self.play(FadeIn(t), run_time=0.5)
        e1 = DashedLine(P[0] + LEFT * 1.6, P[1] + RIGHT * 1.6, color=BLUE, stroke_width=4)
        e2 = DashedLine(P[3] + LEFT * 3.2, P[2] + RIGHT * 2.9, color=BLUE, stroke_width=4)
        self.play(Create(e1), Create(e2), run_time=0.9)
        pm = VGroup(par_mark(P[0], P[1]), par_mark(P[3], P[2]))
        self.say(f"만나지 않아요 → {b('평행')}", "아무리 늘여도 만나지 않아요. 위쪽 변과 아래쪽 변은 서로 평행해요.")
        self.play(Create(pm), run_time=0.6)
        e3 = DashedLine(P[0] + (P[0] - P[3]) * 0.3, P[3] + (P[3] - P[0]) * 0.9, color=RED, stroke_width=4)
        e4 = DashedLine(P[1] + (P[1] - P[2]) * 0.3, P[2] + (P[2] - P[1]) * 0.9, color=RED, stroke_width=4)
        self.say(f"양옆의 두 변은 {o('만나요')}", "양옆의 두 변은 늘이면 위쪽에서 만나요. 평행하지 않아요.")
        self.play(Create(e3), Create(e4), run_time=0.8)
        tx = M(f"평행한 변이 {o('한 쌍이라도')} 있는\n사각형 = {g('사다리꼴')}", 46).move_to([3.8, 0.4, 0])
        self.say(f"이런 사각형이 {g('사다리꼴')}", "이렇게 평행한 변이 한 쌍이라도 있는 사각형을 사다리꼴이라고 해요.")
        self.play(FadeOut(e3), FadeOut(e4), FadeIn(tx), run_time=0.7)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def sort(self):
        self.section("사다리꼴일까요?")
        shapes_ = [
            ([[-1.1, -0.8, 0], [1.1, -0.8, 0], [0.6, 0.8, 0], [-0.7, 0.8, 0]], [(0, 1), (3, 2)], []),
            ([[-1.2, -0.8, 0], [0.6, -0.8, 0], [1.2, 0.8, 0], [-0.6, 0.8, 0]], [(0, 1), (3, 2)], [(0, 3), (1, 2)]),
            ([[-1.0, -0.8, 0], [1.0, -0.8, 0], [1.0, 0.8, 0], [-1.0, 0.8, 0]], [(0, 1), (3, 2)], [(0, 3), (1, 2)]),
            ([[-1.1, -0.8, 0], [1.2, -0.5, 0], [0.7, 0.9, 0], [-0.8, 0.5, 0]], [], []),
        ]
        xs = [-4.8, -1.6, 1.6, 4.8]
        gs, Ps = VGroup(), []
        for (pts, p1, p2), x in zip(shapes_, xs):
            P = at(pts, [x, 0.5, 0])
            Ps.append((P, p1, p2))
            gs.add(poly(P, fill=BLUE, op=0.15))
        tags = VGroup(*[T(s, 38).move_to([x, -1.0, 0]) for s, x in zip("①②③④", xs)])
        self.say("사다리꼴을 모두 찾아봐요", "네 사각형 가운데 사다리꼴을 모두 찾아볼까요?")
        self.play(FadeIn(gs), FadeIn(tags), run_time=0.8)
        self.pause_screen(4)
        marks = []
        for P, p1, p2 in Ps:
            m = VGroup(*[par_mark(P[i], P[j], 1, color=BLUE) for i, j in p1], *[par_mark(P[i], P[j], 2, color=ORANGE) for i, j in p2])
            marks.append(m)
        self.say(f"①은 평행한 변이 {b('한 쌍')}", "①은 위아래 변이 평행해요. 평행한 변이 한 쌍이니 사다리꼴이에요.")
        self.play(Create(marks[0]), run_time=0.6)
        self.say(f"②, ③은 평행한 변이 {o('두 쌍')}", "②와 ③은 평행한 변이 두 쌍이에요. 평행한 변이 한 쌍이라도 있으니 ②와 ③도 사다리꼴이에요.")
        self.play(Create(marks[1]), Create(marks[2]), run_time=0.8)
        x4 = Cross(gs[3], stroke_color=RED, stroke_width=6)
        self.say(f"④는 평행한 변이 {o('없어요')}", "④는 평행한 변이 하나도 없어요. 사다리꼴이 아니에요.")
        self.play(Create(x4), run_time=0.6)
        ans = M(f"사다리꼴: {g('①, ②, ③')}", 50).move_to([0, -2.1, 0])
        self.play(FadeIn(ans), Indicate(VGroup(gs[0], gs[1], gs[2]), color=GREEN, scale_factor=1.05), run_time=0.9)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def cut(self):
        self.section("삼각형을 잘라 만들기")
        A, B, C = np.array([-3.4, -1.6, 0]), np.array([1.4, -1.6, 0]), np.array([-0.4, 2.0, 0])
        tri = poly([A, B, C], fill=GREEN, op=0.2)
        self.say("삼각형을 밑변과 평행하게 잘라요", "삼각형 모양 종이를 밑변과 평행하게 곧게 잘라 볼게요.")
        self.play(FadeIn(tri), run_time=0.5)
        k = 0.5
        L, R = A + (C - A) * k, B + (C - B) * k
        cutl = DashedLine(L + LEFT * 0.6, R + RIGHT * 0.6, color=RED, stroke_width=5)
        self.play(Create(cutl), run_time=0.7)
        top = poly([L, R, C], fill=GREEN, op=0.2)
        bot = poly([A, B, R, L], fill=ORANGE, op=0.3)
        self.remove(tri)
        self.add(top, bot)
        self.play(FadeOut(cutl), top.animate.shift(UP * 0.5 + RIGHT * 0.3), run_time=0.8)
        pm = VGroup(par_mark(A, B), par_mark(L, R))
        tx = M(f"아래쪽은 {g('사다리꼴')}!", 48).move_to([3.5, 0.6, 0])
        self.say(f"아래쪽 조각은 {g('사다리꼴')}", "아래쪽 조각은 자른 선과 밑변이 평행하니 사다리꼴이에요.")
        self.play(Create(pm), FadeIn(tx), run_time=0.7)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
