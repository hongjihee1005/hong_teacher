"""「수학 원리 돋보기」 5학년 22화 — 다각형의 둘레 (5-1 6단원 2·3차시, 화 코드 5-1-6-a)

둘레 = 테두리를 한 바퀴 돈 길이 / 정육각형(한 변 4 cm): 4 × 6 = 24 cm
직사각형(가로 6, 세로 4): (6 + 4) × 2 = 20 cm, 평행사변형(7, 5): (7 + 5) × 2 = 24 cm, 마름모(5): 5 × 4 = 20 cm
최종: GRADE=5 ./make_final.sh 22
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, Line, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from shapes import PURPLE, poly, regular, tick

RED = "#C0392B"


class G5Ep22(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 22
    EP_TITLE = "다각형의 둘레"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.unroll()
        self.quads()
        self.closing(f"둘레는 테두리를 {o('한 바퀴')} 돈 길이\n같은 길이의 변은 {g('곱셈')}으로 간단히 구해요",
                     next_preview="5학년 23화 · 넓이의 단위 1 cm²")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("한 변이 4 cm인 정육각형의 둘레는 몇 cm일까요?", 44).move_to([0.6, 2.2, 0])
        P = regular(6, 1.5, [0, -0.5, 0], 90)
        h = poly(P, fill=ORANGE)
        self.say("정육각형의 둘레", "한 변이 4센티미터인 정육각형이 있어요. 둘레는 몇 센티미터일까요?")
        self.play(Write(q), Create(h), run_time=1.2)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def unroll(self):
        self.section("테두리를 펴면")
        P = regular(6, 1.3, [-4.5, 0.5, 0], 90)
        h = poly(P, fill=ORANGE, op=0.15)
        tk = VGroup(*[tick(P[k], P[(k + 1) % 6], 1) for k in range(6)])
        labs = VGroup(*[T("4", 28).move_to((P[k] + P[(k + 1) % 6]) / 2 * 1.0 + ((P[k] + P[(k + 1) % 6]) / 2 - np.array([-4.5, 0.5, 0])) * 0.25) for k in range(6)])
        self.say("둘레는 테두리를 한 바퀴 돈 길이", "둘레는 도형의 테두리를 한 바퀴 돈 길이예요. 정육각형은 6개의 변의 길이가 모두 4센티미터예요.")
        self.play(FadeIn(h), Create(tk), FadeIn(labs), run_time=0.8)
        segs = VGroup(*[Line(P[k], P[(k + 1) % 6], color=BLUE if k % 2 else GREEN, stroke_width=8) for k in range(6)])
        self.add(segs)
        L = 0.75
        x0 = -1.2
        targets = [(np.array([x0 + k * L, -1.6, 0]), np.array([x0 + (k + 1) * L, -1.6, 0])) for k in range(6)]
        self.say("테두리를 한 줄로 펴 봐요", "테두리를 한 줄로 쭉 펴 볼게요.")
        self.play(*[s.animate.put_start_and_end_on(a, b_) for s, (a, b_) in zip(segs, targets)], run_time=1.6)
        ln = T("4 cm가 6개", 32).next_to(segs, UP, buff=0.25)
        self.play(FadeIn(ln), run_time=0.4)
        e = M(f"(정다각형의 둘레)\n= (한 변의 길이) × (변의 수)", 32).move_to([2.0, 1.6, 0])
        e2 = M(f"4 × 6 = {g('24 (cm)')}", 50).move_to([2.0, 0.2, 0])
        self.say(f"4 × 6 = {g('24 cm')}", "정다각형은 모든 변의 길이가 같으니 한 변의 길이에 변의 수를 곱하면 돼요. 4 곱하기 6, 24센티미터예요.")
        self.play(FadeIn(e), FadeIn(e2), run_time=0.7)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def quads(self):
        self.section("사각형의 둘레")
        s = 0.42
        R = [np.array(p) for p in ([-6.2, 0.2, 0], [-6.2 + 6 * s, 0.2, 0], [-6.2 + 6 * s, 0.2 + 4 * s, 0], [-6.2, 0.2 + 4 * s, 0])]
        rect = poly(R, fill=BLUE, op=0.2)
        rl = VGroup(T("6 cm", 26).next_to(rect, DOWN, buff=0.12), T("4 cm", 26).next_to(rect, LEFT, buff=0.12))
        dx = 1.0
        Pp = [np.array(p) for p in ([-1.5, 0.2, 0], [-1.5 + 7 * s, 0.2, 0], [-1.5 + 7 * s + dx, 0.2 + 1.9, 0], [-1.5 + dx, 0.2 + 1.9, 0])]
        par = poly(Pp, fill=ORANGE, op=0.2)
        pl = VGroup(T("7 cm", 26).next_to(par, DOWN, buff=0.12), T("5 cm", 26).move_to((Pp[0] + Pp[3]) / 2 + LEFT * 0.55))
        a = np.radians(60)
        L = 5 * s
        Rh = [np.array([3.4, 0.2, 0]), np.array([3.4 + L, 0.2, 0]), np.array([3.4 + L + L * np.cos(a), 0.2 + L * np.sin(a), 0]), np.array([3.4 + L * np.cos(a), 0.2 + L * np.sin(a), 0])]
        rh = poly(Rh, fill=PURPLE, op=0.2)
        rhl = T("5 cm", 26).next_to(rh, DOWN, buff=0.12)
        rtk = VGroup(*[tick(Rh[k], Rh[(k + 1) % 4], 1) for k in range(4)])
        self.say("직사각형, 평행사변형, 마름모", "직사각형, 평행사변형, 마름모의 둘레도 구해 볼게요.")
        self.play(FadeIn(rect), FadeIn(rl), FadeIn(par), FadeIn(pl), FadeIn(rh), FadeIn(rhl), Create(rtk), run_time=1.0)
        e1 = M(f"(6 + 4) × 2\n= {g('20 cm')}", 34).move_to([-4.9, -1.3, 0])
        e2 = M(f"(7 + 5) × 2\n= {g('24 cm')}", 34).move_to([-0.3, -1.3, 0])
        e3 = M(f"5 × 4\n= {g('20 cm')}", 34).move_to([4.6, -1.3, 0])
        self.say(f"직사각형: (가로 + 세로) × 2", "직사각형은 마주 보는 변의 길이가 같아서 가로와 세로를 더해 2배 하면 돼요. 6 더하기 4의 2배, 20센티미터.")
        self.play(FadeIn(e1), run_time=0.5)
        self.say(f"평행사변형: (한 변 + 이웃한 변) × 2", "평행사변형도 마주 보는 변의 길이가 같아요. 7 더하기 5의 2배, 24센티미터.")
        self.play(FadeIn(e2), run_time=0.5)
        self.say(f"마름모: (한 변) × 4", "마름모는 네 변의 길이가 모두 같아서 5 곱하기 4, 20센티미터예요.")
        self.play(FadeIn(e3), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
