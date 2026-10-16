"""「수학 원리 돋보기」 4학년 35화 — 접어 보면 보이는 성질 (4-2 2단원 3·4차시, 화 코드 4-2-2-b)

이등변삼각형: 반으로 접으면 길이가 같은 두 변에 있는 두 각이 꼭 포개어짐 → 두 각의 크기가 같음 (70°, 70°, 40°)
정삼각형: 세 방향으로 접힘 → 세 각이 같음 → 180° ÷ 3 = 60°
최종: GRADE=4 ./make_final.sh 35
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, DashedLine, FadeIn, FadeOut, Indicate, LaggedStart, Polygon,
                   VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from shapes import PURPLE, arc_at, poly, regular, tick


class G4Ep35(EpisodeScene):
    GRADE, SEM = 4, 2
    EP_NO = 35
    EP_TITLE = "접어 보면 보이는 성질"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.fold_iso()
        self.equi()
        self.closing(f"이등변삼각형은 길이가 같은 두 변에 있는 {o('두 각의 크기가 같아요')}\n정삼각형은 세 각이 모두 {g('60°')}",
                     next_preview="4학년 36화 · 예각삼각형과 둔각삼각형")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("이등변삼각형의 각에는 어떤 성질이 있을까요?", 46)
        q.scale_to_fit_width(min(q.width, 10.4)).move_to([0.6, 2.3, 0])
        P = [np.array(p) for p in ([-1.4, -1.6, 0], [1.4, -1.6, 0], [0, 2.25 - 0.4, 0])]
        P[2] = np.array([0, -1.6 + 1.4 * np.tan(np.radians(70)), 0])
        t = poly(P, fill=ORANGE).scale(0.85).move_to([0, -0.4, 0])
        self.say("이등변삼각형의 세 각", "이등변삼각형의 세 각에는 어떤 성질이 있을까요?")
        self.play(Write(q), Create(t), run_time=1.2)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def fold_iso(self):
        self.section("반으로 접어 보기")
        h = 1.3 * np.tan(np.radians(70))
        c = np.array([-2.4, -1.9, 0])
        A, B, C = c + np.array([-1.3, 0, 0]), c + np.array([1.3, 0, 0]), c + np.array([0, h, 0])
        P = [A, B, C]
        left = Polygon(A, c, C, fill_color=ORANGE, fill_opacity=0.35, stroke_color=INK, stroke_width=5)
        right = Polygon(c, B, C, fill_color=ORANGE, fill_opacity=0.35, stroke_color=INK, stroke_width=5)
        mk = VGroup(tick(B, C, 1), tick(C, A, 1))
        self.say("색종이를 반으로 접어 자르면 이등변삼각형", "색종이를 반으로 접어 겹친 채로 잘라 펼치면 이등변삼각형이 돼요.")
        self.play(FadeIn(left), FadeIn(right), Create(mk), run_time=0.8)
        fold = DashedLine(C, c, color=SOFT, stroke_width=4)
        a1 = arc_at(P, 0, r=0.45, color=BLUE)
        a2 = arc_at(P, 1, r=0.45, color=BLUE)
        self.play(Create(fold), Create(a1), Create(a2), run_time=0.7)
        self.say(f"다시 접으면 두 각이 {o('꼭 포개어져요')}", "다시 반으로 접으면 밑의 두 각이 꼭 포개어져요.")
        rg = VGroup(right, a2, mk[0])
        self.play(rg.animate.stretch(-1, 0, about_point=c), run_time=1.4)
        self.play(Indicate(VGroup(a1, a2), color=BLUE, scale_factor=1.3), run_time=0.8)
        self.play(rg.animate.stretch(-1, 0, about_point=c), run_time=1.2)
        l1 = M(f"길이가 같은 두 변에 있는\n{o('두 각의 크기가 같아요')}", 46).move_to([3.1, 1.0, 0])
        l2 = M(f"70°  =  70°", 52, BLUE).move_to([3.1, -0.4, 0])
        self.say(f"두 각의 크기가 {o('같아요')}", "그래서 이등변삼각형은 길이가 같은 두 변에 있는 두 각의 크기가 같아요. 각도기로 재면 둘 다 70도예요.")
        self.play(FadeIn(l1), run_time=0.5)
        self.play(FadeIn(l2), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def equi(self):
        self.section("정삼각형의 세 각")
        P = regular(3, 1.9, [-2.6, -0.5, 0])
        t = poly(P, fill=GREEN)
        mk = VGroup(*[tick(P[i], P[(i + 1) % 3], 2, color=GREEN) for i in range(3)])
        self.say("정삼각형은 어떤 방향으로 접힐까요?", "정삼각형은 어느 방향으로 반을 접어도 꼭 맞아요. 세 방향으로 접을 수 있어요.")
        self.play(Create(t), FadeIn(mk), run_time=0.8)
        folds = VGroup(*[DashedLine(P[i], (P[(i + 1) % 3] + P[(i + 2) % 3]) / 2, color=SOFT, stroke_width=4) for i in range(3)])
        self.play(LaggedStart(*[Create(f) for f in folds], lag_ratio=0.4, run_time=1.4))
        arcs = VGroup(*[arc_at(P, i, r=0.45, color=GREEN) for i in range(3)])
        self.say(f"그래서 {g('세 각')}의 크기가 모두 같아요", "그래서 정삼각형은 세 각의 크기가 모두 같아요.")
        self.play(Create(arcs), run_time=0.7)
        e = M(f"180° ÷ 3 = {g('60°')}", 60).move_to([3.0, 0.4, 0])
        self.say(f"180° ÷ 3 = {g('60°')}", "삼각형의 세 각의 합은 180도이니, 정삼각형의 한 각은 180 나누기 3, 60도예요.")
        self.play(FadeIn(e), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
