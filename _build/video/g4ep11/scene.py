"""「수학 원리 돋보기」 4학년 11화 — 삼각형의 세 각을 모으면? (4-1 2단원 각도 7차시, 화 코드 4-1-2-e)

세 각을 잘라 한 점에 모으면 일직선(180°) / 모양·크기가 달라도 언제나 180° / 두 각을 알면 180°에서 빼서 나머지 한 각
최종: GRADE=4 ./make_final.sh 11
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DEGREES, DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, Line, Polygon,
                   Rotate, Sector, Transform, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, g, o
from division import clear_stage
from angle import PURPLE

C3 = [ORANGE, BLUE, PURPLE]


def ang_of(p, q, r):
    """꼭짓점 p에서 q, r 방향 사이: (시작 각, 크기) 도 단위, 반시계"""
    a1 = np.degrees(np.arctan2(*(q - p)[1::-1]))
    a2 = np.degrees(np.arctan2(*(r - p)[1::-1]))
    d = (a2 - a1) % 360
    if d > 180:
        a1, d = a2, 360 - d
    return a1, d


def tri_parts(P, r=0.7):
    P = [np.array(p, float) for p in P]
    sectors, info = VGroup(), []
    for i in range(3):
        p, q, s = P[i], P[(i + 1) % 3], P[(i + 2) % 3]
        st, d = ang_of(p, q, s)
        sectors.add(Sector(radius=r, start_angle=st * DEGREES, angle=d * DEGREES, arc_center=p,
                           fill_color=C3[i], fill_opacity=0.75, stroke_color=INK, stroke_width=2))
        info.append((st, d))
    tri = Polygon(*P, color=INK, stroke_width=5)
    return tri, sectors, info


class G4Ep11(EpisodeScene):
    GRADE, SEM = 4, 1
    EP_NO = 11
    EP_TITLE = "삼각형의 세 각을 모으면?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.gather([[-5.6, -2.0, 0], [-0.6, -2.0, 0], [-3.9, 1.4, 0]], "세 각 모으기")
        self.gather([[-6.0, -2.0, 0], [-0.4, -2.0, 0], [-5.2, 0.4, 0]], "모양이 달라도", again=True)
        self.find()
        self.closing(f"삼각형의 세 각의 크기의 합은 언제나 {g('180°')}\n두 각을 알면 {o('180°에서 빼서')} 나머지 각을 구해요",
                     next_preview="4학년 12화 · 사각형의 네 각을 모으면?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("삼각형의 모양이 다르면 세 각의 합도 다를까요?", 46)
        q.scale_to_fit_width(min(q.width, 10.4)).move_to([0.6, 2.25, 0])
        shapes = VGroup(Polygon([-6, -2, 0], [-2.6, -2, 0], [-4.6, 0.8, 0], color=INK, stroke_width=5),
                        Polygon([-1.6, -2, 0], [2.2, -2, 0], [-1.2, 0.0, 0], color=INK, stroke_width=5),
                        Polygon([3.0, -2, 0], [6.2, -2, 0], [3.0, 1.0, 0], color=INK, stroke_width=5))
        self.say("세 각의 합은 같을까, 다를까?", "모양과 크기가 다른 삼각형들이에요. 세 각의 크기를 더하면 서로 다를까요?")
        self.play(Write(q), run_time=0.9)
        self.play(LaggedStart(*[Create(s) for s in shapes], lag_ratio=0.3, run_time=1.4))
        self.wait(1.0)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def gather(self, P, sec, again=False):
        self.section(sec)
        tri, secs, info = tri_parts(P)
        self.say("세 각에 색칠하고 잘라 내요" if not again else "이번에는 길쭉한 삼각형",
                 "삼각형의 세 각에 색칠하고, 각 부분을 잘라 내 볼까요?" if not again else "이번에는 모양이 아주 다른 삼각형으로 해 볼까요?")
        self.play(Create(tri), run_time=0.7)
        self.play(LaggedStart(*[FadeIn(s) for s in secs], lag_ratio=0.25, run_time=0.9))
        c = np.array([3.6, -1.6, 0])
        base = Line(c + LEFT * 2.6, c + RIGHT * 2.6, color=SOFT, stroke_width=4)
        self.say(f"한 점에 모아 붙이면?", "잘라 낸 세 조각의 꼭짓점을 한 점에 모아 나란히 붙여 볼게요.")
        self.play(Create(base), run_time=0.4)
        start = 0.0
        moved = VGroup()
        for i, s in enumerate(secs):
            st, d = info[i]
            cp = s.copy()
            self.add(cp)
            target = Sector(radius=0.7, start_angle=start * DEGREES, angle=d * DEGREES, arc_center=c,
                            fill_color=C3[i], fill_opacity=0.75, stroke_color=INK, stroke_width=2).scale(1.7, about_point=c)
            self.play(Transform(cp, target), run_time=0.9)
            moved.add(cp)
            start += d
        self.say(f"딱 {g('일직선')} → {g('180°')}", "세 조각이 빈틈없이 모여 일직선이 되었어요. 일직선은 180도예요.")
        self.play(Indicate(base, color=GREEN, scale_factor=1.02), run_time=0.8)
        lab = M(f"{g('180°')}", 64).move_to(c + UP * 1.9)
        self.play(FadeIn(lab, shift=DOWN * 0.2), run_time=0.5)
        if again:
            m = M(f"모양과 크기가 달라도 {g('언제나 180°')}", 50).move_to([0, 2.3, 0]).shift(RIGHT * 0.6)
            self.say(f"모양이 달라도 {g('언제나 180°')}", "모양과 크기가 달라도 삼각형의 세 각의 크기의 합은 언제나 180도예요.")
            self.play(FadeIn(m), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def find(self):
        self.section("나머지 한 각")
        P = [np.array(p) for p in ([-5.6, -2.0, 0], [-1.6, -2.0, 0], [-2.81, 1.33, 0])]  # 50°, 70°, 60°
        tri = Polygon(*P, color=INK, stroke_width=5)
        la = T("50°", 40, ORANGE).move_to(P[0] + np.array([0.9, 0.35, 0]))
        lb = T("70°", 40, BLUE).move_to(P[1] + np.array([-0.85, 0.35, 0]))
        lc = T("?", 48, PURPLE).move_to(P[2] + np.array([-0.05, -0.95, 0]))
        self.say("두 각이 50°와 70°이면?", "삼각형의 두 각이 50도와 70도예요. 나머지 한 각은 몇 도일까요?")
        self.play(Create(tri), FadeIn(la), FadeIn(lb), FadeIn(lc), run_time=0.9)
        self.wait(0.6)
        e1 = M(f"180° − 50° − 70° = {g('60°')}", 58).move_to([3.4, 0.3, 0])
        e1.scale_to_fit_width(min(e1.width, 6.6))
        self.say(f"180°에서 두 각을 빼요 → {g('60°')}", "세 각의 합이 180도이니까, 180에서 50과 70을 빼면 나머지 한 각은 60도예요.")
        self.play(FadeIn(e1, shift=LEFT * 0.2), run_time=0.7)
        self.play(Transform(lc, T("60°", 40, GREEN).move_to(lc)), run_time=0.6)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
