"""「수학 원리 돋보기」 4학년 47화 — 평행사변형의 성질 (4-2 4단원 6차시, 화 코드 4-2-4-d)

사다리꼴의 윗변 길이를 바꾸다 두 쌍이 평행해지는 순간 = 평행사변형
마주 보는 두 변의 길이가 같고, 마주 보는 두 각의 크기가 같음(가운데를 중심으로 반 바퀴 돌리면 꼭 겹침)
이웃한 두 각의 합 180° (60° + 120°)
최종: GRADE=4 ./make_final.sh 47
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, PI, RIGHT, UP, Create, DashedLine, FadeIn, FadeOut, Indicate, Polygon, Rotate,
                   ValueTracker, VGroup, Write, always_redraw)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from shapes import PURPLE, arc_at, par_mark, poly, tick

RED = "#C0392B"


class G4Ep47(EpisodeScene):
    GRADE, SEM = 4, 2
    EP_NO = 47
    EP_TITLE = "평행사변형의 성질"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.morph()
        self.props()
        self.sum180()
        self.closing(f"평행사변형은 마주 보는 두 {o('변의 길이')}와 두 {o('각의 크기')}가 같고\n이웃한 두 각의 크기의 합은 {g('180°')}",
                     next_preview="4학년 48화 · 마름모의 성질")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("마주 보는 두 쌍의 변이 평행한 사각형에는\n어떤 성질이 있을까요?", 44)
        q.move_to([0.6, 2.0, 0])
        P = [[-2.4, -1.8, 0], [1.4, -1.8, 0], [2.4, 0.2, 0], [-1.4, 0.2, 0]]
        t = poly(P, fill=BLUE)
        self.say("두 쌍의 변이 평행한 사각형", "마주 보는 두 쌍의 변이 서로 평행한 사각형에는 어떤 성질이 있을까요?")
        self.play(Write(q), Create(t), run_time=1.2)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def morph(self):
        self.section("사다리꼴에서 평행사변형으로")
        A, B, D = np.array([-3.0, -1.8, 0]), np.array([1.6, -1.8, 0]), np.array([-1.6, 1.0, 0])
        cx = ValueTracker(0.0)

        def quad():
            C = np.array([cx.get_value(), 1.0, 0])
            return poly([A, B, C, D], fill=ORANGE, op=0.3)
        q = always_redraw(quad)
        pm1 = VGroup(par_mark(A, B), par_mark(D, [0.0, 1.0, 0]))
        self.say("위아래 변이 평행한 사다리꼴", "위아래 두 변이 평행한 사다리꼴이 있어요.")
        self.add(q)
        self.play(FadeIn(pm1), run_time=0.6)
        self.say("윗변을 늘여 볼까요?", "윗변의 오른쪽 끝을 오른쪽으로 옮기며 윗변을 늘여 볼게요.")
        self.play(FadeOut(pm1), cx.animate.set_value(4.2), run_time=2.0)
        self.say(f"양옆의 변까지 {o('평행')}해지는 순간", "윗변과 아랫변의 길이가 같아지는 순간, 양옆의 두 변까지 평행해져요.")
        self.play(cx.animate.set_value(3.0), run_time=1.6)
        A_, B_, C_, D_ = A, B, B + (D - A), D
        pm = VGroup(par_mark(A_, B_), par_mark(D_, C_), par_mark(A_, D_, 2, color=ORANGE), par_mark(B_, C_, 2, color=ORANGE))
        tx = M(f"마주 보는 두 쌍의 변이 평행한 사각형 = {g('평행사변형')}", 42)
        tx.scale_to_fit_width(min(tx.width, 10.2)).move_to([0.4, 2.3, 0])
        self.say(f"이 사각형이 {g('평행사변형')}", "마주 보는 두 쌍의 변이 서로 평행한 사각형을 평행사변형이라고 해요.")
        self.play(Create(pm), FadeIn(tx), run_time=0.8)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def props(self):
        self.section("마주 보는 변과 각")
        c = np.array([-2.0, -0.2, 0])
        P = [c + np.array(p) for p in ([-2.3, -1.3, 0], [1.3, -1.3, 0], [2.3, 1.3, 0], [-1.3, 1.3, 0])]
        t = poly(P, fill=BLUE)
        self.say("마주 보는 변의 길이를 견주어 봐요", "평행사변형의 마주 보는 변의 길이를 견주어 볼까요?")
        self.play(FadeIn(t), run_time=0.5)
        tk = VGroup(tick(P[0], P[1], 1), tick(P[2], P[3], 1), tick(P[1], P[2], 2, color=GREEN), tick(P[3], P[0], 2, color=GREEN))
        self.play(Create(tk), run_time=0.7)
        arcs = VGroup(arc_at(P, 0, 0.45, ORANGE), arc_at(P, 2, 0.45, ORANGE), arc_at(P, 1, 0.4, PURPLE, 2), arc_at(P, 3, 0.4, PURPLE, 2))
        self.play(Create(arcs), run_time=0.7)
        cp = VGroup(t.copy().set_fill(ORANGE, 0.25).set_stroke(ORANGE, 6), arcs.copy())
        self.say(f"가운데를 중심으로 {o('반 바퀴')} 돌리면", "똑같은 평행사변형을 가운데를 중심으로 반 바퀴 돌려 볼게요.")
        self.add(cp)
        self.play(Rotate(cp, PI, about_point=c), run_time=2.0)
        self.say(f"{g('꼭 겹쳐요')}", "돌린 모양이 처음 모양과 꼭 겹쳐요. 마주 보는 변과 마주 보는 각이 서로 자리를 바꾸어 겹쳤어요.")
        self.play(Indicate(cp, color=GREEN, scale_factor=1.04), run_time=0.8)
        tx = M(f"마주 보는 두 변의\n{o('길이가 같아요')}\n\n마주 보는 두 각의\n{o('크기가 같아요')}", 42).move_to([3.7, 0.0, 0])
        self.say(f"마주 보는 변·각이 {o('같아요')}", "그래서 평행사변형은 마주 보는 두 변의 길이가 같고, 마주 보는 두 각의 크기가 같아요.")
        self.play(FadeOut(cp), FadeIn(tx), run_time=0.7)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def sum180(self):
        self.section("이웃한 두 각")
        h = 2.4
        dx = h / np.tan(np.radians(60))
        A = np.array([-4.2, -1.4, 0])
        P = [A, A + RIGHT * 3.6, A + RIGHT * (3.6 + dx) + UP * h, A + RIGHT * dx + UP * h]
        t = poly(P, fill=BLUE)
        a0 = arc_at(P, 0, 0.5, ORANGE)
        a1 = arc_at(P, 1, 0.45, PURPLE, 2)
        l0 = T("60°", 36, ORANGE).move_to(P[0] + np.array([0.95, 0.32, 0]))
        l1 = T("?", 40, PURPLE).move_to(P[1] + np.array([-0.2, 0.75, 0]))
        self.say("한 각이 60°이면 이웃한 각은?", "한 각이 60도인 평행사변형이에요. 이웃한 각은 몇 도일까요?")
        self.play(FadeIn(t), Create(a0), FadeIn(l0), Create(a1), FadeIn(l1), run_time=0.8)
        ext = DashedLine(P[1], P[1] + RIGHT * 2.0, color=SOFT, stroke_width=4)
        a_out = arc_at([P[1] + RIGHT * 2.0, P[1], P[2]], 1, 0.5, ORANGE)
        lo = T("60°", 34, ORANGE).move_to(P[1] + np.array([1.05, 0.35, 0]))
        self.say(f"아랫변을 늘이면 바깥에 {o('60°')}", "아랫변을 오른쪽으로 늘이면, 오른쪽 변이 왼쪽 변과 평행하니 바깥쪽에도 60도가 생겨요.")
        self.play(Create(ext), Create(a_out), FadeIn(lo), run_time=0.9)
        e = M(f"? = 180° − 60° = {g('120°')}", 46).move_to([3.4, 2.0, 0])
        self.say(f"일직선은 180° → {g('120°')}", "일직선은 180도이니 이웃한 각은 180 빼기 60, 120도예요.")
        self.play(FadeIn(e), FadeOut(l1), run_time=0.6)
        l1b = T("120°", 34, PURPLE).move_to(P[1] + np.array([-0.35, 0.8, 0]))
        self.play(FadeIn(l1b), run_time=0.4)
        e2 = M(f"이웃한 두 각의 합\n60° + 120° = {g('180°')}", 44).move_to([3.9, -0.3, 0])
        self.say(f"이웃한 두 각의 합은 {g('180°')}", "평행사변형에서 이웃한 두 각의 크기의 합은 언제나 180도예요.")
        self.play(FadeIn(e2), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
