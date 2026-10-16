"""「수학 원리 돋보기」 4학년 49화 — 사각형들은 어떤 관계일까? (4-2 4단원 8차시, 화 코드 4-2-4-f)

조건을 하나씩 더하면 이름이 좁아짐: 사각형 ⊃ 사다리꼴(평행 한 쌍) ⊃ 평행사변형(두 쌍) ⊃ 직사각형(네 각 직각)·마름모(네 변 같음) ⊃ 정사각형(둘 다)
정사각형은 마름모(O), 마름모는 정사각형(늘 그렇지는 않음)
최종: GRADE=4 ./make_final.sh 49
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, Intersection, RoundedRectangle, VGroup,
                   Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from shapes import PURPLE, poly, right_mark, tick

RED = "#C0392B"
TEAL = "#1F8A70"


def box(w, h, c, color):
    return RoundedRectangle(width=w, height=h, corner_radius=0.35, stroke_color=color, stroke_width=5,
                            fill_color=color, fill_opacity=0.08).move_to(c)


class G4Ep49(EpisodeScene):
    GRADE, SEM = 4, 2
    EP_NO = 49
    EP_TITLE = "사각형들은 어떤 관계일까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.nest()
        self.quiz()
        self.closing(f"조건이 하나씩 더해질수록 이름이 {o('좁아져요')}\n정사각형은 직사각형이면서 {g('마름모')}이기도 해요",
                     next_preview="4학년 50화 · 꺾은선그래프는 무엇을 보여 줄까?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("정사각형은 마름모라고 할 수 있을까요?", 48).move_to([0.6, 2.2, 0])
        sq = poly([[-1.1, -1.1, 0], [1.1, -1.1, 0], [1.1, 1.1, 0], [-1.1, 1.1, 0]], fill=GREEN).move_to([-2.4, -0.4, 0])
        P = [np.array(p) for p in ([-1.2, -1.0, 0], [0.8, -1.0, 0], [1.6, 0.8, 0], [-0.4, 0.8, 0])]
        rh = poly(P, fill=PURPLE).move_to([2.6, -0.4, 0])
        l1 = T("정사각형", 36).next_to(sq, DOWN, buff=0.25)
        l2 = T("마름모", 36).next_to(rh, DOWN, buff=0.25)
        self.say("정사각형은 마름모일까요?", "정사각형은 마름모라고 할 수 있을까요? 사각형들 사이의 관계를 알아봐요.")
        self.play(Write(q), FadeIn(sq), FadeIn(rh), FadeIn(l1), FadeIn(l2), run_time=1.2)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def nest(self):
        self.section("조건을 하나씩 더하면")
        b0 = box(13.0, 4.9, [0, 0.1, 0], SOFT)
        b1 = box(11.4, 4.1, [0.3, 0.0, 0], ORANGE)
        b2 = box(9.8, 3.3, [0.6, -0.1, 0], BLUE)
        b3 = box(4.8, 2.35, [-0.8, -0.13, 0], TEAL)
        b4 = box(4.8, 2.35, [2.2, -0.13, 0], PURPLE)
        l0 = T("사각형", 32, INK).move_to(b0.get_corner(UP + LEFT) + np.array([0.8, -0.35, 0]))
        l1 = T("사다리꼴", 32, ORANGE).move_to(b1.get_corner(UP + LEFT) + np.array([0.95, -0.35, 0]))
        l2 = T("평행사변형", 32, BLUE).move_to(b2.get_corner(UP + LEFT) + np.array([1.1, -0.35, 0]))
        l3 = T("직사각형", 30, TEAL).move_to(b3.get_corner(UP + LEFT) + np.array([0.9, -0.33, 0]))
        l4 = T("마름모", 30, PURPLE).move_to(b4.get_corner(UP + RIGHT) + np.array([-0.75, -0.33, 0]))
        c0 = T("변 4개", 28, SOFT).next_to(l0, RIGHT, buff=0.3)
        c1 = T("+ 평행한 변 한 쌍", 28, ORANGE).next_to(l1, RIGHT, buff=0.3)
        c2 = T("+ 평행한 변 두 쌍", 28, BLUE).next_to(l2, RIGHT, buff=0.3)
        self.say("네 변으로 둘러싸인 사각형", "가장 넓은 이름은 사각형이에요. 네 변으로 둘러싸인 도형이면 모두 사각형이에요.")
        self.play(Create(b0), FadeIn(l0), FadeIn(c0), run_time=0.8)
        self.say(f"평행한 변이 {o('한 쌍')}이라도 → 사다리꼴", "그 가운데 평행한 변이 한 쌍이라도 있으면 사다리꼴이에요.")
        self.play(Create(b1), FadeIn(l1), FadeIn(c1), run_time=0.8)
        self.say(f"평행한 변이 {b('두 쌍')} → 평행사변형", "사다리꼴 가운데 평행한 변이 두 쌍이면 평행사변형이에요.")
        self.play(Create(b2), FadeIn(l2), FadeIn(c2), run_time=0.8)
        self.say(f"네 각이 직각이면 {g('직사각형')}", "평행사변형 가운데 네 각이 모두 직각이면 직사각형이에요.")
        self.play(Create(b3), FadeIn(l3), run_time=0.7)
        self.say(f"네 변이 같으면 {PURPLE_T('마름모')}", "평행사변형 가운데 네 변의 길이가 모두 같으면 마름모예요.")
        self.play(Create(b4), FadeIn(l4), run_time=0.7)
        ov = Intersection(b3, b4, color=GREEN, fill_color=GREEN, fill_opacity=0.35, stroke_width=0)
        sq = T("정사각형", 32, GREEN).move_to(ov.get_center() + DOWN * 0.15)
        self.say(f"둘 다이면 {g('정사각형')}", "네 각이 모두 직각이고 네 변의 길이도 모두 같으면, 직사각형이면서 마름모예요. 이것이 정사각형이에요.")
        self.play(FadeIn(ov), FadeIn(sq), run_time=0.8)
        self.play(Indicate(sq, color=GREEN, scale_factor=1.3), run_time=0.8)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def quiz(self):
        self.section("맞을까요?")
        q1 = M(f"정사각형은 마름모예요.", 40).move_to([-3.4, 1.9, 0])
        q2 = M(f"마름모는 정사각형이에요.", 40).move_to([3.4, 1.9, 0])
        self.say("두 문장을 살펴봐요", "두 문장이 맞는지 생각해 볼까요?")
        self.play(FadeIn(q1), FadeIn(q2), run_time=0.6)
        self.pause_screen(4)
        s = 1.7
        c1 = np.array([-3.4, 0.0, 0])
        S = [c1 + np.array(p) * s / 2 for p in ([-1, -1, 0], [1, -1, 0], [1, 1, 0], [-1, 1, 0])]
        sq = poly(S, fill=GREEN)
        sk = VGroup(*[tick(S[i], S[(i + 1) % 4], 1) for i in range(4)])
        o1 = T("O", 70, GREEN).move_to([-1.3, 0.6, 0])
        self.say(f"정사각형은 네 변이 같으니 {g('마름모예요')}", "정사각형은 네 변의 길이가 모두 같아요. 그러니 정사각형은 마름모예요. 맞아요.")
        self.play(FadeIn(sq), Create(sk), FadeIn(o1), run_time=0.8)
        c2 = np.array([3.0, 0.0, 0])
        a = np.radians(60)
        L = 1.8
        R = [np.array([0, 0, 0.0]), np.array([L, 0, 0]), np.array([L + L * np.cos(a), L * np.sin(a), 0]), np.array([L * np.cos(a), L * np.sin(a), 0])]
        m = (R[0] + R[2]) / 2
        R = [p - m + c2 for p in R]
        rh = poly(R, fill=PURPLE)
        rk = VGroup(*[tick(R[i], R[(i + 1) % 4], 1) for i in range(4)])
        x2 = T("X", 70, RED).move_to([5.7, 0.6, 0])
        self.say(f"마름모는 각이 직각이 아닐 수 있어요 → {o('늘 맞지는 않아요')}", "마름모는 네 각이 직각이 아닐 수도 있어요. 그래서 마름모라고 모두 정사각형은 아니에요.")
        self.play(FadeIn(rh), Create(rk), FadeIn(x2), run_time=0.8)
        n = M(f"넓은 이름 안에 {g('좁은 이름')}이 들어 있어요", 42).move_to([0, -2.0, 0])
        self.play(FadeIn(n), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()


def PURPLE_T(s):
    return f'<span foreground="{PURPLE}">{s}</span>'
