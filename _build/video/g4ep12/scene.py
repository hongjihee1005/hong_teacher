"""「수학 원리 돋보기」 4학년 12화 — 사각형의 네 각을 모으면? (4-1 2단원 각도 8차시, 화 코드 4-1-2-f)

네 각을 잘라 한 점에 모으면 빈틈없이 한 바퀴(360°) / 대각선으로 삼각형 2개 → 180° + 180° = 360°
세 각을 알면 360°에서 빼서 나머지 한 각 (80°, 110°, 75° → 95°)
최종: GRADE=4 ./make_final.sh 12
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DEGREES, DOWN, LEFT, RIGHT, UP, Circle, Create, DashedLine, FadeIn, FadeOut, Indicate,
                   LaggedStart, Polygon, Sector, Transform, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, g, o
from division import clear_stage
from angle import PURPLE

C4 = [ORANGE, BLUE, PURPLE, "#1F8A70"]


def ang_at(P, i):
    p, q, r = P[i], P[(i + 1) % len(P)], P[(i - 1) % len(P)]
    a1 = np.degrees(np.arctan2(q[1] - p[1], q[0] - p[0]))
    a2 = np.degrees(np.arctan2(r[1] - p[1], r[0] - p[0]))
    d = (a2 - a1) % 360
    return a1, d


class G4Ep12(EpisodeScene):
    GRADE, SEM = 4, 1
    EP_NO = 12
    EP_TITLE = "사각형의 네 각을 모으면?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.gather()
        self.split()
        self.find()
        self.closing(f"사각형의 네 각의 크기의 합은 {g('360°')}\n삼각형 2개로 나누면 {o('180° + 180°')}",
                     next_preview="4학년 13화 · (세 자리 수) × (몇십)")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("사각형의 네 각의 크기를 모두 더하면 몇 도일까요?", 46)
        q.scale_to_fit_width(min(q.width, 10.4)).move_to([0.6, 2.25, 0])
        P = [np.array(p) for p in ([-2.6, -2.0, 0], [2.4, -2.0, 0], [1.6, 1.0, 0], [-1.6, 0.6, 0])]
        quad = Polygon(*P, color=INK, stroke_width=5)
        self.say("네 각의 합은?", "삼각형의 세 각의 합은 180도였어요. 사각형의 네 각을 모두 더하면 몇 도일까요?")
        self.play(Write(q), Create(quad), run_time=1.2)
        self.wait(1.0)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def quad(self, P, r=0.65):
        poly = Polygon(*P, color=INK, stroke_width=5)
        secs, info = VGroup(), []
        for i in range(4):
            st, d = ang_at(P, i)
            secs.add(Sector(radius=r, start_angle=st * DEGREES, angle=d * DEGREES, arc_center=P[i],
                            fill_color=C4[i], fill_opacity=0.75, stroke_color=INK, stroke_width=2))
            info.append(d)
        return poly, secs, info

    def gather(self):
        self.section("네 각 모으기")
        P = [np.array(p) for p in ([-6.2, -2.0, 0], [-1.6, -2.0, 0], [-2.2, 1.2, 0], [-5.4, 0.6, 0])]
        poly, secs, info = self.quad(P)
        self.say("네 각을 잘라 한 점에 모아요", "사각형의 네 각에 색칠하고 잘라서, 꼭짓점을 한 점에 모아 볼까요?")
        self.play(Create(poly), LaggedStart(*[FadeIn(s) for s in secs], lag_ratio=0.2), run_time=1.2)
        c = np.array([3.6, -0.3, 0])
        start = 0.0
        for i, s in enumerate(secs):
            cp = s.copy()
            self.add(cp)
            tgt = Sector(radius=1.5, start_angle=start * DEGREES, angle=info[i] * DEGREES, arc_center=c,
                         fill_color=C4[i], fill_opacity=0.75, stroke_color=INK, stroke_width=2)
            self.play(Transform(cp, tgt), run_time=0.8)
            start += info[i]
        ring = Circle(radius=1.5, color=GREEN, stroke_width=5).move_to(c)
        self.say(f"빈틈없이 {g('한 바퀴')} → {g('360°')}", "네 조각이 빈틈없이 한 바퀴를 채웠어요. 한 바퀴는 360도예요.")
        self.play(Create(ring), run_time=0.8)
        lab = M(g("360°"), 60).move_to(c + UP * 2.2)
        self.play(FadeIn(lab), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def split(self):
        self.section("삼각형 2개로 나누기")
        P = [np.array(p) for p in ([-3.0, -2.0, 0], [2.6, -2.0, 0], [1.8, 1.2, 0], [-2.0, 0.8, 0])]
        poly = Polygon(*P, color=INK, stroke_width=5)
        self.say("대각선을 하나 그어 봐요", "이번에는 사각형에 마주 보는 꼭짓점을 잇는 선을 하나 그어 볼까요?")
        self.play(Create(poly), run_time=0.7)
        d = DashedLine(P[0], P[2], color=ORANGE, stroke_width=5)
        self.play(Create(d), run_time=0.7)
        t1 = Polygon(P[0], P[1], P[2], fill_color=BLUE, fill_opacity=0.25, stroke_width=0)
        t2 = Polygon(P[0], P[2], P[3], fill_color=PURPLE, fill_opacity=0.25, stroke_width=0)
        l1 = T("180°", 40, BLUE).move_to((P[0] + P[1] + P[2]) / 3)
        l2 = T("180°", 40, PURPLE).move_to((P[0] + P[2] + P[3]) / 3)
        self.say(f"삼각형 {o('2개')}가 생겼어요", "사각형이 삼각형 2개로 나누어졌어요. 삼각형 하나의 세 각의 합은 180도예요.")
        self.play(FadeIn(t1), FadeIn(l1), run_time=0.6)
        self.play(FadeIn(t2), FadeIn(l2), run_time=0.6)
        eq = M(f"180° + 180° = {g('360°')}", 60).move_to([0, 2.3, 0]).shift(RIGHT * 0.6)
        self.say(f"180° + 180° = {g('360°')}", "그래서 사각형의 네 각의 합은 180 더하기 180, 360도예요.")
        self.play(FadeIn(eq), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def find(self):
        self.section("나머지 한 각")
        P = [np.array(p) for p in ([-5.2, -1.8, 0], [-1.8, -1.8, 0], [-0.774, 1.019, 0], [-4.644, 1.351, 0])]  # 80°, 110°, 75°, 95°
        poly = Polygon(*P, color=INK, stroke_width=5)
        labs = VGroup(T("80°", 36, ORANGE).move_to(P[0] + np.array([0.6, 0.45, 0])),
                      T("110°", 36, BLUE).move_to(P[1] + np.array([-0.55, 0.45, 0])),
                      T("75°", 36, PURPLE).move_to(P[2] + np.array([-0.6, -0.35, 0])),
                      T("?", 44, "#1F8A70").move_to(P[3] + np.array([0.45, -0.55, 0])))
        self.say("세 각이 80°, 110°, 75°이면?", "사각형의 세 각이 80도, 110도, 75도예요. 나머지 한 각은 몇 도일까요?")
        self.play(Create(poly), FadeIn(labs), run_time=0.9)
        self.wait(0.6)
        e = M(f"360° − 80° − 110° − 75° = {g('95°')}", 50).move_to([3.3, 0.0, 0])
        e.scale_to_fit_width(min(e.width, 6.8))
        self.say(f"360°에서 세 각을 빼요 → {g('95°')}", "네 각의 합이 360도이니까, 360에서 80과 110과 75를 빼면 나머지 한 각은 95도예요.")
        self.play(FadeIn(e, shift=LEFT * 0.2), run_time=0.7)
        self.play(Transform(labs[3], T("95°", 36, GREEN).move_to(labs[3])), run_time=0.6)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
