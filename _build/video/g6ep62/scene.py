"""「수학 원리 돋보기」 6학년 62화 — 큰 피자 1판, 작은 피자 2판? (6-2 5단원 8~9차시 생각을 더하다, 화 코드 6-2-5-g)

피자 두께가 같으면 넓이가 넓을수록 더 많이 먹을 수 있음
메뉴 1(지름 32 cm 1판) 16 × 16 × 3.14 = 803.84 cm², 메뉴 2(지름 20 cm 2판) 10 × 10 × 3.14 × 2 = 628 cm² → 메뉴 1
지름이 2배가 되면 넓이는 4배 (반지름 × 반지름이라서)
최종: GRADE=6 ./make_final.sh 62
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Circle, Create, FadeIn, FadeOut, Indicate, LaggedStart, Line, Square,
                   SurroundingRectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage

CHEESE = "#F2C14E"


def pizza(r, center):
    c = np.array(center, float)
    crust = Circle(radius=r, fill_color="#D99A4E", fill_opacity=1, stroke_color=INK, stroke_width=3).move_to(c)
    top = Circle(radius=r * 0.86, fill_color=CHEESE, fill_opacity=1, stroke_width=0).move_to(c)
    dots = VGroup(*[Circle(radius=r * 0.09, fill_color="#C0392B", fill_opacity=1, stroke_width=0).move_to(c + r * 0.5 * np.array([np.cos(a), np.sin(a), 0]))
                    for a in np.linspace(0, 2 * np.pi, 6, endpoint=False)])
    return VGroup(crust, top, dots)


class G6Ep62(EpisodeScene):
    GRADE, SEM = 6, 2
    EP_NO = 62
    EP_TITLE = "큰 피자 1판, 작은 피자 2판?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.compare()
        self.fourfold()
        self.closing(f"두께가 같으면 {o('넓이')}가 넓을수록 더 많이 먹을 수 있어요\n지름이 2배가 되면 넓이는 {g('4배')}",
                     next_preview="6학년 63화 · 원기둥이란?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("값이 같다면 어느 메뉴를 고를까요?\n메뉴 1: 지름 32 cm 피자 1판 · 메뉴 2: 지름 20 cm 피자 2판", 38).move_to([0.6, 2.0, 0])
        self.say("어느 메뉴가 더 많을까?", "값이 같은 두 메뉴가 있어요. 메뉴 1은 지름 32 센티미터 피자 1판, 메뉴 2는 지름 20 센티미터 피자 2판이에요. 피자를 더 많이 먹으려면 어느 메뉴를 고를까요?")
        self.play(Write(q), run_time=1.0)
        a = pizza(1.6, (-3.2, -0.8, 0))
        b1 = pizza(1.0, (2.0, -0.8, 0))
        b2 = pizza(1.0, (4.2, -0.8, 0))
        self.play(FadeIn(a), FadeIn(b1), FadeIn(b2), run_time=0.6)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def compare(self):
        self.section("넓이로 견주기")
        a = pizza(1.35, (-3.4, 0.75, 0))
        b1 = pizza(1.0, (2.0, 0.75, 0))
        b2 = pizza(1.0, (4.4, 0.75, 0))
        la = M("메뉴 1", 30).move_to([-3.4, 2.35, 0])
        lb = M("메뉴 2", 30).move_to([3.2, 2.35, 0])
        self.play(FadeIn(a), FadeIn(b1), FadeIn(b2), FadeIn(la), FadeIn(lb), run_time=0.5)
        e1 = M(f"16 × 16 × 3.14\n= {o('803.84')} (cm²)", 34).move_to([-3.4, -1.45, 0])
        self.say(f"메뉴 1: {o('803.84 cm²')}", "두께가 같으면 넓이로 견주어요. 메뉴 1은 반지름 16 센티미터, 16 곱하기 16 곱하기 3.14, 803.84 제곱센티미터예요.")
        self.play(FadeIn(e1), run_time=0.6)
        e2 = M(f"10 × 10 × 3.14 × 2\n= {b('628')} (cm²)", 34).move_to([3.2, -1.45, 0])
        self.say(f"메뉴 2: {b('628 cm²')}", "메뉴 2는 반지름 10 센티미터 피자 2판, 10 곱하기 10 곱하기 3.14 곱하기 2, 628 제곱센티미터예요.")
        self.play(FadeIn(e2), run_time=0.6)
        box = SurroundingRectangle(VGroup(a, e1), color=GREEN, buff=0.15, stroke_width=5)
        self.say(f"{g('메뉴 1')}이 더 많아요", "메뉴 1이 더 넓어서 피자를 더 많이 먹을 수 있어요.")
        self.play(Create(box), run_time=0.6)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def fourfold(self):
        self.section("지름이 2배면 넓이는?")
        s = 0.55
        C1 = np.array([-5.0, 0.3, 0])
        small = Circle(radius=s, fill_color=CHEESE, fill_opacity=0.9, stroke_color=INK, stroke_width=3).move_to(C1)
        C2 = np.array([-1.8, 0.3, 0])
        big = Circle(radius=2 * s, fill_color=CHEESE, fill_opacity=0.5, stroke_color=INK, stroke_width=3).move_to(C2)
        l1 = M("반지름 1", 28).next_to(small, DOWN, buff=0.15)
        l2 = M("반지름 2", 28).next_to(big, DOWN, buff=0.15)
        self.play(FadeIn(small), FadeIn(l1), FadeIn(big), FadeIn(l2), run_time=0.6)
        sq1 = Square(side_length=s, color=BLUE, stroke_width=4).move_to(C1 + np.array([s / 2, s / 2, 0]))
        sq2 = VGroup(*[Square(side_length=s, color=BLUE, stroke_width=4).move_to(C2 + np.array([(i + 0.5) * s, (j + 0.5) * s, 0])) for i in range(2) for j in range(2)])
        self.say(f"반지름 × 반지름이 {g('4배')}", "원의 넓이는 반지름 곱하기 반지름 곱하기 원주율이에요. 반지름이 2배가 되면 반지름 곱하기 반지름은 2 곱하기 2, 4배가 돼요.")
        self.play(Create(sq1), run_time=0.4)
        self.play(LaggedStart(*[Create(x) for x in sq2], lag_ratio=0.2, run_time=0.8))
        t = M(f"지름 2배 → 넓이 {g('4배')}", 40).move_to([3.4, 1.2, 0])
        t2 = M("작은 피자 2판으로는\n큰 피자 1판을 못 따라가요", 30).move_to([3.4, -0.2, 0])
        self.say(f"넓이는 {g('4배')}", "그래서 지름이 2배인 피자는 넓이가 4배예요. 작은 피자를 2판 먹어도 큰 피자 1판보다 적을 수 있어요.")
        self.play(FadeIn(t), FadeIn(t2), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
