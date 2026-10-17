"""「수학 원리 돋보기」 5학년 29화 — 사다리꼴의 넓이 (5-1 6단원 13·14차시, 화 코드 5-1-6-h)

윗변 2 cm, 아랫변 6 cm, 높이 4 cm: 똑같은 사다리꼴을 돌려 붙이면 밑변 (2 + 6), 높이 4인 평행사변형 → 32의 반 16 cm²
(사다리꼴의 넓이) = (윗변 + 아랫변) × (높이) ÷ 2
최종: GRADE=5 ./make_final.sh 29
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, PI, RIGHT, UP, Create, DashedLine, FadeIn, FadeOut, Indicate, LaggedStart, Rotate,
                   VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from area import grid
from shapes import poly

S = 0.45


class G5Ep29(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 29
    EP_TITLE = "사다리꼴의 넓이"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.double()
        self.closing(f"(사다리꼴의 넓이) = ({o('윗변')} + {b('아랫변')}) × (높이) {g('÷ 2')}\n똑같은 사다리꼴 두 개면 평행사변형이에요",
                     next_preview="5학년 30화 · 넓이가 같아도 둘레는 다를까?")
        self.wait(0.5)

    def trap(self, ox, oy):
        return [np.array([ox, oy, 0]), np.array([ox + 6 * S, oy, 0]), np.array([ox + 3 * S, oy + 4 * S, 0]), np.array([ox + 1 * S, oy + 4 * S, 0])]

    def problem(self):
        self.section("문제")
        q = M("윗변 2 cm, 아랫변 6 cm, 높이 4 cm인\n사다리꼴의 넓이는?", 44).move_to([0.6, 2.0, 0])
        P = self.trap(-1.35, -1.6)
        self.say("사다리꼴의 넓이", "윗변 2센티미터, 아랫변 6센티미터, 높이 4센티미터인 사다리꼴의 넓이는 어떻게 구할까요?")
        self.play(Write(q), FadeIn(poly(P, fill=ORANGE, op=0.4)), run_time=1.2)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def double(self):
        self.section("똑같은 사다리꼴 두 개")
        ox, oy = -5.4, -1.3
        P = self.trap(ox, oy)
        gr = grid(9, 4, S, [ox + 4.5 * S, oy + 2 * S, 0])
        t1 = poly(P, fill=ORANGE, op=0.55)
        hl = DashedLine(P[3], [P[3][0], oy, 0], color=GREEN, stroke_width=5)
        lu = T("윗변 2", 26, ORANGE).next_to(VGroup(*[]) if False else t1, UP, buff=0.12).set_x((P[2][0] + P[3][0]) / 2)
        ld = T("아랫변 6", 26, BLUE).move_to([ox + 3 * S, oy - 0.28, 0])
        lh = T("높이 4", 26, GREEN).move_to([ox - 0.6, oy + 2 * S, 0])
        self.play(FadeIn(gr), FadeIn(t1), Create(hl), FadeIn(lu), FadeIn(ld), FadeIn(lh), run_time=0.8)
        t2 = t1.copy().set_fill(BLUE, 0.55)
        self.say("똑같은 사다리꼴을 돌려 붙여요", "똑같은 사다리꼴을 하나 더 만들어 반 바퀴 돌려서 옆에 붙여 볼게요.")
        self.add(t2)
        self.play(Rotate(t2, PI, about_point=(P[1] + P[2]) / 2), run_time=1.6)
        e0 = M(f"평행사변형의 밑변 = {o('2')} + {b('6')} = 8", 32).move_to([3.5, 1.9, 0])
        self.say(f"평행사변형의 밑변은 {o('윗변')} + {b('아랫변')}", "두 사다리꼴이 평행사변형이 되었어요. 평행사변형의 밑변은 윗변과 아랫변을 더한 8센티미터, 높이는 4센티미터예요.")
        self.play(FadeIn(e0), run_time=0.5)
        e1 = M(f"평행사변형  8 × 4 = 32 (cm²)", 32).move_to([3.5, 1.0, 0])
        e2 = M(f"사다리꼴은 그 반  {g('16 (cm²)')}", 32).move_to([3.5, 0.1, 0])
        self.say(f"사다리꼴은 그 반 → {g('16 cm²')}", "평행사변형의 넓이는 8 곱하기 4, 32. 사다리꼴은 그 반이니 16 제곱센티미터예요.")
        self.play(FadeIn(e1), run_time=0.5)
        self.play(FadeIn(e2), Indicate(t1, color=ORANGE), run_time=0.7)
        f = M(f"= ({o('윗변')} + {b('아랫변')}) × (높이) {g('÷ 2')}", 32).move_to([3.5, -0.9, 0])
        self.play(FadeIn(f), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
