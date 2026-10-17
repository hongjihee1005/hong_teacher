"""「수학 원리 돋보기」 5학년 61화 — 가능성을 수로 나타내기 (5-2 6단원 7차시, 화 코드 5-2-6-e)

불가능하다 0, 반반이다 1/2, 확실하다 1 (0부터 1까지의 수)
주머니에 빨간 공만 4개 → 빨간 공을 꺼낼 가능성 1, 파란 공 0 / 빨강 2·파랑 2 → 빨강 1/2
최종: GRADE=5 ./make_final.sh 61
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Circle, Create, Dot, FadeIn, FadeOut, Indicate, LaggedStart, Line,
                   RoundedRectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage

RED = "#E05A5A"


def bag(colors, center):
    c = np.array(center, float)
    body = RoundedRectangle(width=2.0, height=1.6, corner_radius=0.4, fill_color="#F3E4CC", fill_opacity=1, stroke_color=INK, stroke_width=3).move_to(c)
    balls = VGroup(*[Circle(radius=0.22, fill_color=col, fill_opacity=1, stroke_color=INK, stroke_width=2) for col in colors]).arrange_in_grid(rows=2, buff=0.12).move_to(c + np.array([0, -0.1, 0]))
    return VGroup(body, balls)


class G5Ep61(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 61
    EP_TITLE = "가능성을 수로 나타내기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.line()
        self.bags()
        self.closing(f"가능성은 {o('0')}부터 {g('1')}까지의 수로 나타내요\n불가능하다 0, 반반이다 {b('1/2')}, 확실하다 1",
                     next_preview="5학년 62화 · 여러 번 던지면 어떻게 될까?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("가능성을 말이 아니라 수로 나타낼 수 있을까요?", 46).move_to([0.6, 1.8, 0])
        self.say("가능성을 수로?", "불가능하다, 반반이다, 확실하다 같은 가능성을 수로 나타낼 수 있을까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def line(self):
        self.section("0부터 1까지")
        ln = Line([-5.0, 0.6, 0], [5.0, 0.6, 0], color=INK, stroke_width=5)
        pts = [(-5.0, "0", "불가능하다", SOFT), (0.0, "1/2", "반반이다", BLUE), (5.0, "1", "확실하다", GREEN)]
        marks = VGroup()
        for x, v, w, c in pts:
            marks.add(Dot([x, 0.6, 0], radius=0.12, color=c), T(v, 44, c).move_to([x, 1.3, 0]), T(w, 30, c).move_to([x, -0.05, 0]))
        self.say(f"불가능하다는 {o('0')}, 확실하다는 {g('1')}", "가능성을 0부터 1까지의 수로 나타내면, 불가능하다는 0, 확실하다는 1이에요.")
        self.play(Create(ln), FadeIn(marks[0:3]), FadeIn(marks[6:9]), run_time=0.9)
        self.say(f"반반이다는 {b('1/2')}", "그 한가운데인 반반이다는 2분의 1이에요.")
        self.play(FadeIn(marks[3:6]), run_time=0.6)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def bags(self):
        self.section("주머니에서 공 꺼내기")
        b1 = bag([RED] * 4, [-4.2, 1.0, 0])
        b2 = bag([RED, BLUE, RED, BLUE], [0, 1.0, 0])
        b3 = bag([BLUE] * 4, [4.2, 1.0, 0])
        self.say("주머니에서 공을 하나 꺼낼 때", "주머니에서 공을 하나 꺼낼 때 빨간 공이 나올 가능성을 수로 나타내 볼게요.")
        self.play(FadeIn(b1), FadeIn(b2), FadeIn(b3), run_time=0.7)
        l1 = M(f"빨간 공만 → {g('1')}", 36).move_to([-4.2, -0.4, 0])
        l2 = M(f"반반 → {b('1/2')}", 36).move_to([0, -0.4, 0])
        l3 = M(f"빨간 공 없음 → {o('0')}", 36).move_to([4.2, -0.4, 0])
        self.say(f"빨간 공만 있으면 {g('1')}", "빨간 공만 있으면 반드시 빨간 공이 나오니 확실하다, 1이에요.")
        self.play(FadeIn(l1), run_time=0.5)
        self.say(f"빨강 2, 파랑 2면 {b('1/2')}", "빨간 공과 파란 공이 2개씩이면 반반이다, 2분의 1이에요.")
        self.play(FadeIn(l2), run_time=0.5)
        self.say(f"빨간 공이 없으면 {o('0')}", "빨간 공이 하나도 없으면 불가능하다, 0이에요.")
        self.play(FadeIn(l3), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
