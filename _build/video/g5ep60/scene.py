"""「수학 원리 돋보기」 5학년 60화 — 가능성을 말로 나타내고 비교하기 (5-2 6단원 5·6차시, 화 코드 5-2-6-d)

가능성: 불가능하다 · ~아닐 것 같다 · 반반이다 · ~일 것 같다 · 확실하다
회전판(빨강 칠한 부분 0, 1/4, 1/2, 3/4, 전부) → 화살이 빨강에 멈출 가능성, 칠한 부분이 넓을수록 높음
최종: GRADE=5 ./make_final.sh 60
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, PI, RIGHT, TAU, UP, Annulus, Arrow, Circle, Create, FadeIn, FadeOut, Indicate,
                   LaggedStart, Line, Sector, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o

from division import clear_stage

RED = "#E05A5A"
WORDS = ["불가능하다", "~아닐 것 같다", "반반이다", "~일 것 같다", "확실하다"]


def spinner(frac, r=0.85, center=(0, 0, 0)):
    c = np.array(center, float)
    g_ = VGroup(Circle(radius=r, fill_color=PAPER, fill_opacity=1, stroke_color=INK, stroke_width=4).move_to(c))
    if frac > 0:
        s = Sector(radius=r, start_angle=PI / 2, angle=-TAU * frac, fill_color=RED, fill_opacity=0.85, stroke_width=0)
        s.move_arc_center_to(c)
        g_.add(s)
    g_.add(Circle(radius=r, stroke_color=INK, stroke_width=4, fill_opacity=0).move_to(c))
    g_.add(Arrow(c, c + np.array([0.0, r * 0.8, 0]), color=INK, buff=0, stroke_width=5).rotate(-0.6, about_point=c))
    return g_


class G5Ep60(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 60
    EP_TITLE = "가능성을 말로 나타내고 비교하기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.words()
        self.spinners()
        self.closing(f"가능성은 {o('불가능하다')}부터 {g('확실하다')}까지 말로 나타내요\n칠한 부분이 넓을수록 그 색이 나올 가능성이 {b('높아요')}",
                     next_preview="5학년 61화 · 가능성을 수로 나타내기")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("내일 해가 동쪽에서 뜰 가능성, 주사위를 던져\n7이 나올 가능성은 어떻게 말할까요?", 42).move_to([0.6, 1.6, 0])
        self.say("일이 일어날 가능성", "내일 해가 동쪽에서 뜰 가능성, 주사위를 던져 7이 나올 가능성은 어떤 말로 나타낼까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def words(self):
        self.section("가능성을 나타내는 말")
        ln = Line([-5.6, 0.8, 0], [5.6, 0.8, 0], color=INK, stroke_width=5)
        xs = np.linspace(-5.2, 5.2, 5)
        ticks = VGroup(*[Line([x, 0.6, 0], [x, 1.0, 0], color=INK, stroke_width=4) for x in xs])
        labs = VGroup(*[T(w, 28, c).move_to([x, 0.2, 0]) for w, x, c in zip(WORDS, xs, [SOFT, BLUE, INK, ORANGE, GREEN])])
        self.say("가능성은 다섯 가지 말로", "어떤 일이 일어나길 기대할 수 있는 정도를 가능성이라고 해요. 불가능하다, 아닐 것 같다, 반반이다, 일 것 같다, 확실하다로 나타내요.")
        self.play(Create(ln), Create(ticks), run_time=0.6)
        self.play(LaggedStart(*[FadeIn(l) for l in labs], lag_ratio=0.25, run_time=1.4))
        ex = [("주사위에서 7", 0, SOFT), ("동전의 그림면", 2, INK), ("해가 동쪽에서 뜸", 4, GREEN)]
        tags = VGroup(*[T(s, 26, c).move_to([xs[i], 1.6 + (0.45 if i == 2 else 0), 0]) for s, i, c in ex])
        self.say(f"7은 {o('불가능')}, 해는 {g('확실')}", "주사위를 던져 7이 나오는 것은 불가능하고, 동전을 던져 그림면이 나오는 것은 반반, 해가 동쪽에서 뜨는 것은 확실해요.")
        self.play(LaggedStart(*[FadeIn(t) for t in tags], lag_ratio=0.4, run_time=1.4))
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def spinners(self):
        self.section("회전판으로 비교하기")
        fr = [0, 0.25, 0.5, 0.75, 1.0]
        xs = np.linspace(-5.0, 5.0, 5)
        sp = VGroup(*[spinner(f, 0.8, [x, 0.9, 0]) for f, x in zip(fr, xs)])
        labs = VGroup(*[T(w, 26).move_to([x, -0.4, 0]) for w, x in zip(WORDS, xs)])
        self.say("빨간색에 멈출 가능성은?", "회전판을 돌려 화살이 빨간색에 멈출 가능성을 견주어 볼게요.")
        self.play(LaggedStart(*[FadeIn(s) for s in sp], lag_ratio=0.2, run_time=1.2))
        self.say(f"빨간 부분이 넓을수록 {o('가능성이 높아요')}", "빨간색이 없으면 불가능하고, 반이면 반반, 전부 빨간색이면 확실해요. 빨간 부분이 넓을수록 가능성이 높아요.")
        self.play(LaggedStart(*[FadeIn(l) for l in labs], lag_ratio=0.2, run_time=1.2))
        ar = Arrow([-5.4, -1.2, 0], [5.4, -1.2, 0], color=ORANGE, buff=0, stroke_width=6)
        at = T("가능성이 높아져요", 30, ORANGE).next_to(ar, DOWN, buff=0.12)
        self.play(Create(ar), FadeIn(at), run_time=0.7)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
