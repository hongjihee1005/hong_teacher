"""「수학 원리 돋보기」 5학년 39화 — 진분수의 곱셈 (5-2 2단원 6·7차시, 화 코드 5-2-2-d)

넓이 모델: 1/2 × 1/3 → 가로로 반, 세로로 셋 → 겹친 칸은 6칸 중 1칸 = 1/6 (분자끼리, 분모끼리 곱함)
2/3 × 3/4 = (2 × 3)/(3 × 4) = 6/12 = 1/2 (12칸 중 6칸)
최종: GRADE=5 ./make_final.sh 39
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, Line, Rectangle, VGroup,
                   Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, row


class Area:
    """정사각형 1을 세로줄 cols, 가로줄 rows로 나눈 넓이 모델"""
    def __init__(self, cols, rows, size=3.4, center=(0, 0, 0)):
        c = np.array(center, float)
        self.c, self.s, self.cols, self.rows = c, size, cols, rows
        self.frame = Rectangle(width=size, height=size, stroke_color=INK, stroke_width=5).move_to(c)
        self.x0, self.y0 = c[0] - size / 2, c[1] - size / 2

    def vlines(self, n):
        return VGroup(*[Line([self.x0 + k * self.s / n, self.y0, 0], [self.x0 + k * self.s / n, self.y0 + self.s, 0], color=SOFT, stroke_width=3) for k in range(1, n)])

    def hlines(self, n):
        return VGroup(*[Line([self.x0, self.y0 + k * self.s / n, 0], [self.x0 + self.s, self.y0 + k * self.s / n, 0], color=SOFT, stroke_width=3) for k in range(1, n)])

    def col_fill(self, k, n, color, op=0.35):
        w = self.s * k / n
        return Rectangle(width=w, height=self.s, fill_color=color, fill_opacity=op, stroke_width=0).move_to([self.x0 + w / 2, self.c[1], 0])

    def row_fill(self, k, n, color, op=0.35, within=None):
        h = self.s * k / n
        w = self.s if within is None else self.s * within
        return Rectangle(width=w, height=h, fill_color=color, fill_opacity=op, stroke_width=0).move_to([self.x0 + w / 2, self.y0 + self.s - h / 2, 0])


class G5Ep39(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 39
    EP_TITLE = "진분수의 곱셈"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.unit()
        self.general()
        self.closing(f"(진분수) × (진분수)는 {o('분자는 분자끼리')}, {b('분모는 분모끼리')} 곱해요\n진분수끼리 곱하면 {g('더 작아져요')}",
                     next_preview="5학년 40화 · (대분수) × (대분수)")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("밭의 1/2에 채소를 심고, 그중 1/3에 상추를 심었어요.\n상추를 심은 곳은 밭 전체의 얼마일까요?", 40)
        q.scale_to_fit_width(min(q.width, 11.0)).move_to([0.5, 1.6, 0])
        self.say("1/2의 1/3은?", "밭의 2분의 1에 채소를 심고, 그중 3분의 1에 상추를 심었어요. 상추를 심은 곳은 밭 전체의 얼마일까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def unit(self):
        self.section("넓이 그림으로")
        A = Area(2, 3, 3.6, [-3.0, 0.1, 0])
        self.say("밭 전체를 정사각형 1로", "밭 전체를 정사각형 1로 나타낼게요.")
        self.play(Create(A.frame), run_time=0.5)
        v = A.vlines(2)
        c1 = A.col_fill(1, 2, ORANGE)
        self.say(f"세로로 반 → {o('1/2')}", "세로로 똑같이 둘로 나누어 한 칸을 칠하면 2분의 1, 채소를 심은 곳이에요.")
        self.play(Create(v), FadeIn(c1), run_time=0.7)
        h = A.hlines(3)
        r1 = A.row_fill(1, 3, BLUE, op=0.55, within=0.5)
        self.say(f"그중 가로로 셋 중 하나 → {b('1/2의 1/3')}", "그 2분의 1을 가로로 셋으로 나누어 한 칸을 칠하면 2분의 1의 3분의 1, 상추를 심은 곳이에요.")
        self.play(Create(h), FadeIn(r1), run_time=0.8)
        e = row(frac(1, 2, 54), "×", frac(1, 3, 54), "=", frac(1, 6, 54, cn=GREEN, cd=GREEN), size=50).move_to([3.0, 1.0, 0])
        self.say(f"전체 6칸 중 1칸 → {g('1/6')}", "전체가 6칸으로 나뉘었고 그중 1칸이니 6분의 1이에요.")
        self.play(FadeIn(e), Indicate(r1, color=GREEN), run_time=0.8)
        n = M(f"분모끼리 {b('2 × 3 = 6')}칸으로 나뉘고\n분자끼리 {o('1 × 1 = 1')}칸을 칠했어요", 34).move_to([3.0, -0.6, 0])
        self.say("분자끼리, 분모끼리 곱한 것과 같아요", "분모끼리 곱한 2 곱하기 3은 전체 칸 수, 분자끼리 곱한 1 곱하기 1은 칠한 칸 수예요.")
        self.play(FadeIn(n), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def general(self):
        self.section("2/3 × 3/4")
        A = Area(3, 4, 3.6, [-3.0, 0.1, 0])
        self.play(Create(A.frame), run_time=0.4)
        c = A.col_fill(2, 3, ORANGE)
        self.say(f"세로로 셋 중 둘 → {o('2/3')}", "이번에는 3분의 2의 4분의 3이에요. 세로로 셋으로 나누어 두 칸을 칠해요.")
        self.play(Create(A.vlines(3)), FadeIn(c), run_time=0.7)
        r = A.row_fill(3, 4, BLUE, op=0.55, within=2 / 3)
        self.say(f"그중 가로로 넷 중 셋 → {b('3/4')}", "그 부분을 가로로 넷으로 나누어 세 칸을 칠해요.")
        self.play(Create(A.hlines(4)), FadeIn(r), run_time=0.8)
        e = row(frac(2, 3, 50), "×", frac(3, 4, 50), "=", frac("2 × 3", "3 × 4", 50), "=", frac(6, 12, 50, cn=GREEN, cd=GREEN), size=46).move_to([3.0, 1.0, 0])
        self.say(f"12칸 중 6칸 → {g('6/12')}", "전체 3 곱하기 4, 12칸 중에서 2 곱하기 3, 6칸을 칠했어요. 12분의 6이에요.")
        self.play(FadeIn(e), run_time=0.8)
        e2 = row("=", frac(1, 2, 50, cn=GREEN, cd=GREEN), size=46).move_to([3.0, -0.5, 0])
        self.say(f"약분하면 {g('1/2')}", "약분하면 2분의 1이에요. 처음 3분의 2보다 작아졌어요.")
        self.play(FadeIn(e2), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
