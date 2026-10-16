"""「수학 원리 돋보기」 4학년 36화 — 예각삼각형과 둔각삼각형 (4-2 2단원 5차시, 화 코드 4-2-2-c)

세 각이 모두 예각 = 예각삼각형, 한 각이 직각 = 직각삼각형, 한 각이 둔각 = 둔각삼각형
꼭짓점 하나를 움직이면 이름이 바뀜 / 어떤 삼각형이든 예각이 2개 이상 → 세 각을 모두 살펴야 함
두 각을 알면 180°에서 빼서 나머지 각 (35°, 40° → 105° 둔각삼각형)
최종: GRADE=4 ./make_final.sh 36
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, ValueTracker, VGroup, Write,
                   always_redraw)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from shapes import angle_deg, arc_at, poly
from geom import right_mark

ACUTE, OBTUSE = "#1F8A70", "#C0392B"


def kind_of(P):
    m = max(angle_deg(P, i) for i in range(3))
    if m < 89.5:
        return "예각삼각형", ACUTE
    if m <= 90.5:
        return "직각삼각형", ORANGE
    return "둔각삼각형", OBTUSE


class G4Ep36(EpisodeScene):
    GRADE, SEM = 4, 2
    EP_NO = 36
    EP_TITLE = "예각삼각형과 둔각삼각형"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.slide()
        self.two_acute()
        self.find()
        self.closing(f"세 각이 모두 예각이면 {sp('예각삼각형', ACUTE)}, 한 각이 둔각이면 {sp('둔각삼각형', OBTUSE)}\n{o('세 각을 모두')} 살펴서 이름을 정해요",
                     next_preview="4학년 37화 · 두 가지 기준으로 이름 붙이기")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("삼각형을 각의 크기에 따라 나누어 볼까요?", 46)
        q.scale_to_fit_width(min(q.width, 10.4)).move_to([0.6, 2.3, 0])
        shapes = VGroup(poly([[-6, -1.6, 0], [-3.4, -1.6, 0], [-4.4, 0.8, 0]], fill=ACUTE),
                        poly([[-2.1, -1.6, 0], [0.6, -1.6, 0], [-2.1, 0.8, 0]], fill=ORANGE),
                        poly([[1.8, -1.6, 0], [6.0, -1.6, 0], [2.6, -0.3, 0]], fill=OBTUSE))
        self.say("세 삼각형의 각을 살펴봐요", "세 삼각형의 각을 살펴보고, 각의 크기에 따라 나누어 볼까요?")
        self.play(Write(q), LaggedStart(*[Create(s) for s in shapes], lag_ratio=0.3), run_time=1.5)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def slide(self):
        self.section("꼭짓점을 움직이면")
        A, B = np.array([-3.0, -1.7, 0]), np.array([1.0, -1.7, 0])
        x = ValueTracker(-0.6)

        def tri():
            C = np.array([x.get_value(), 1.4, 0])
            P = [A, B, C]
            nm, col = kind_of(P)
            t = poly(P, fill=col, op=0.3)
            arcs = VGroup(*[arc_at(P, i, r=0.45, color=col) for i in range(3)])
            lab = T(nm, 56, col).move_to([4.4, 0.6, 0])
            degs = VGroup(*[T(f"{angle_deg(P, i):.0f}°", 30, SOFT).move_to(P[i] + (np.mean(P, axis=0) - P[i]) * 0.38) for i in range(3)])
            return VGroup(t, arcs, lab, degs)
        g_ = always_redraw(tri)
        self.say("위 꼭짓점을 옆으로 옮겨 봐요", "삼각형의 위 꼭짓점을 오른쪽으로 옮겨 볼까요? 각의 크기가 바뀌면서 이름도 바뀌어요.")
        self.add(g_)
        self.wait(0.8)
        self.say(f"세 각이 모두 예각 → {sp('예각삼각형', ACUTE)}", "세 각이 모두 예각인 삼각형을 예각삼각형이라고 해요.")
        self.wait(1.2)
        self.say(f"한 각이 직각 → {o('직각삼각형')}", "옮기다 보면 한 각이 직각이 되는 순간이 있어요. 직각삼각형이에요.")
        self.play(x.animate.set_value(1.0), run_time=1.8)
        self.wait(0.8)
        self.say(f"한 각이 둔각 → {sp('둔각삼각형', OBTUSE)}", "더 옮기면 한 각이 둔각이 돼요. 한 각이 둔각인 삼각형을 둔각삼각형이라고 해요.")
        self.play(x.animate.set_value(2.6), run_time=1.8)
        self.wait(1.0)
        self.settle()
        g_.clear_updaters()
        clear_stage(self, 0.6)

    def two_acute(self):
        self.section("예각은 늘 2개 이상")
        P = [np.array([-4.8, -1.4, 0]), np.array([-0.4, -1.4, 0]), np.array([-3.8, 0.4, 0])]
        t = poly(P, fill=OBTUSE, op=0.3)
        arcs = VGroup(arc_at(P, 0, r=0.5, color=ACUTE), arc_at(P, 1, r=0.5, color=ACUTE), arc_at(P, 2, r=0.4, color=OBTUSE))
        self.say("둔각삼각형에도 예각이 있어요", "둔각삼각형에도 예각이 2개 있어요. 사실 어떤 삼각형이든 예각은 2개 이상 있어요.")
        self.play(Create(t), Create(arcs), run_time=0.9)
        m1 = M(f"예각 2개만 보고 {sp('예각삼각형', ACUTE)}이라 하면 틀려요", 40).move_to([2.6, 0.6, 0])
        m2 = M(f"{o('세 각을 모두')} 살펴봐요", 46).move_to([2.6, -0.4, 0])
        VGroup(m1, m2).scale_to_fit_width(min(VGroup(m1, m2).width, 6.6))
        self.say(f"{o('세 각을 모두')} 살펴야 해요", "그래서 예각이 보인다고 바로 예각삼각형이라고 하면 안 되고, 세 각을 모두 살펴야 해요.")
        self.play(FadeIn(m1), run_time=0.5)
        self.play(FadeIn(m2), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def find(self):
        self.section("나머지 각으로 이름 정하기")
        q = M("두 각이 35°, 40°인 삼각형은?", 54).move_to([0.6, 1.8, 0])
        self.say("두 각이 35°와 40°이면?", "삼각형의 두 각이 35도와 40도예요. 어떤 삼각형일까요?")
        self.play(FadeIn(q), run_time=0.5)
        e = M(f"180° − 35° − 40° = {sp('105°', OBTUSE)}", 56).move_to([0, 0.4, 0])
        r = M(f"105°는 둔각 → {sp('둔각삼각형', OBTUSE)}", 52).move_to([0, -0.8, 0])
        self.say(f"나머지 각 {sp('105°', OBTUSE)} → 둔각삼각형", "나머지 한 각은 180에서 35와 40을 빼면 105도. 둔각이 있으니 둔각삼각형이에요.")
        self.play(FadeIn(e), run_time=0.5)
        self.play(FadeIn(r), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()


def sp(v, c):
    return f'<span foreground="{c}">{v}</span>'
