"""「수학 원리 돋보기」 6학년 45화 — 어느 방향에서 보았을까? (6-2 3단원 2차시, 화 코드 6-2-3-a)

보는 방향에 따라 보이는 물체와 그 차례가 달라짐
가장 왼쪽과 가장 오른쪽에 무엇이 보이는지 살펴보면 어느 방향에서 본 것인지 알 수 있음
(예시: 탁자 위 공·상자·컵 — 이 영상에서 정한 배치)
최종: GRADE=6 ./make_final.sh 45
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Arrow, Circle, Create, FadeIn, FadeOut, Indicate, LaggedStart, Polygon,
                   Rectangle, RoundedRectangle, Square, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage

RED = "#E05A5A"
# 탁자 위 자리 (x 오른쪽, y 뒤쪽)
POS = {"공": (-1.0, 0.5), "상자": (0.3, -0.6), "컵": (1.2, 0.8)}
COL = {"공": RED, "상자": BLUE, "컵": GREEN}
# 보는 쪽: (이름, 사람 자리 방향, 보는 사람의 오른쪽 방향)
VIEWS = [("앞", (0, -1), (1, 0)), ("오른쪽", (1, 0), (0, 1)), ("뒤", (0, 1), (-1, 0)), ("왼쪽", (-1, 0), (0, -1))]


def icon(name, s=0.42):
    c = COL[name]
    if name == "공":
        return Circle(radius=s, fill_color=c, fill_opacity=0.9, stroke_color=INK, stroke_width=3)
    if name == "상자":
        return Square(side_length=s * 1.8, fill_color=c, fill_opacity=0.9, stroke_color=INK, stroke_width=3)
    return Polygon([-s * 0.8, s, 0], [s * 0.8, s, 0], [s * 0.55, -s, 0], [-s * 0.55, -s, 0], fill_color=c, fill_opacity=0.9, stroke_color=INK, stroke_width=3)


def order(right):
    r = np.array(right, float)
    return sorted(POS, key=lambda n: float(np.dot(np.array(POS[n]), r)))


class G6Ep45(EpisodeScene):
    GRADE, SEM = 6, 2
    EP_NO = 45
    EP_TITLE = "어느 방향에서 보았을까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.views()
        self.closing(f"보는 방향에 따라 {o('보이는 차례')}가 달라져요\n{b('가장 왼쪽')}과 {b('가장 오른쪽')}에 무엇이 있는지 살펴보아요",
                     next_preview="6학년 46화 · 만든 모양과 위에서 본 모양")
        self.wait(0.5)

    def table(self, c=(-3.6, 0.1)):
        cx, cy = c
        S = 1.25
        tb = RoundedRectangle(width=4.6, height=3.6, corner_radius=0.3, fill_color="#E8DDBE", fill_opacity=1, stroke_color=INK, stroke_width=3).move_to([cx, cy, 0])
        its = VGroup(*[icon(n, 0.3).move_to([cx + POS[n][0] * S, cy + POS[n][1] * S, 0]) for n in POS])
        labs = VGroup(*[T(n, 22).next_to(its[i], DOWN, buff=0.06) for i, n in enumerate(POS)])
        return tb, its, labs, (cx, cy)

    def problem(self):
        self.section("문제")
        q = M("탁자 위의 물건을 여러 방향에서 사진으로 찍었어요.\n어느 쪽에서 찍은 사진인지 어떻게 알 수 있을까요?", 40).move_to([0.6, 2.2, 0])
        self.say("어느 쪽에서 찍었을까요?", "탁자 위의 공, 상자, 컵을 여러 방향에서 사진으로 찍었어요. 어느 쪽에서 찍은 사진인지 어떻게 알 수 있을까요?")
        self.play(Write(q), run_time=1.0)
        tb, its, labs, _ = self.table((0, -0.7))
        self.play(FadeIn(tb), FadeIn(its), FadeIn(labs), run_time=0.6)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def views(self):
        self.section("보는 쪽에 따라 달라요")
        tb, its, labs, (cx, cy) = self.table()
        self.play(FadeIn(tb), FadeIn(its), FadeIn(labs), run_time=0.5)
        narr = {
            "앞": "앞에서 보면 왼쪽부터 공, 상자, 컵 차례로 보여요.",
            "오른쪽": "오른쪽으로 가서 보면 상자, 공, 컵 차례가 돼요. 가장 왼쪽이 상자로 바뀌었어요.",
            "뒤": "뒤에서 보면 앞에서 본 것과 거꾸로 컵, 상자, 공이에요.",
            "왼쪽": "왼쪽에서 보면 컵, 공, 상자 차례예요.",
        }
        prev = None
        for name, where, right in VIEWS:
            w = np.array([where[0], where[1], 0.0])
            eye = np.array([cx + w[0] * 2.85, cy + w[1] * 2.35, 0])
            dot = Circle(radius=0.22, fill_color=ORANGE, fill_opacity=1, stroke_color=INK, stroke_width=3).move_to(eye)
            arr = Arrow(eye, eye - w * 0.7, color=ORANGE, buff=0.22, stroke_width=5)
            cam = VGroup(dot, arr)
            seq = order(right)
            photo_box = RoundedRectangle(width=5.2, height=2.0, corner_radius=0.2, fill_color=PAPER, fill_opacity=1, stroke_color=INK, stroke_width=3).move_to([3.2, 0.3, 0])
            pics = VGroup(*[icon(n, 0.42) for n in seq]).arrange(RIGHT, buff=0.55).move_to([3.2, 0.45, 0])
            pl = VGroup(*[T(n, 24).next_to(pics[i], DOWN, buff=0.1) for i, n in enumerate(seq)])
            title = M(f"{o(name)}에서 본 모습", 34).move_to([3.2, 1.75, 0])
            grp = VGroup(cam, photo_box, pics, pl, title)
            self.say(f"{o(name)}에서 보면 {' · '.join(seq)}", narr[name])
            if prev is None:
                self.play(FadeIn(grp), run_time=0.7)
            else:
                self.play(FadeOut(prev), FadeIn(grp), run_time=0.7)
            prev = grp
            self.wait(0.6)
        tip = M(f"{b('가장 왼쪽')}과 {b('가장 오른쪽')}을 보면\n방향을 알 수 있어요", 30).move_to([3.2, -1.6, 0])
        self.say("양 끝을 살펴보아요", "이렇게 보는 방향에 따라 물체의 차례가 달라져요. 가장 왼쪽과 가장 오른쪽에 무엇이 보이는지 살펴보면 어느 방향에서 본 것인지 알 수 있어요.")
        self.play(FadeIn(tip), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
