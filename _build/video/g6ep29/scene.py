"""「수학 원리 돋보기」 6학년 29화 — 직육면체의 부피 (6-1 6단원 3~4차시, 화 코드 6-1-6-b)

직육면체의 부피는 1 cm³ 쌓기나무가 몇 개 들어가는지로 구함
가로(세로, 높이)가 2배, 3배 → 부피도 2배, 3배
(직육면체의 부피) = (가로) × (세로) × (높이) = (한 밑면의 넓이) × (높이), (정육면체의 부피) = (한 모서리)³
(예시: 가로 4 cm, 세로 3 cm, 높이 2 cm → 24 cm³ — 이 영상에서 정한 크기)
최종: GRADE=6 ./make_final.sh 29
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from cubes import box_cells, stack

LAYER = ["#F2C14E", "#7C9CC9"]


class G6Ep29(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 29
    EP_TITLE = "직육면체의 부피"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.layers()
        self.double()
        self.formula()
        self.closing(f"(직육면체의 부피) = ({o('가로')}) × ({b('세로')}) × ({g('높이')})\n= (한 밑면의 넓이) × (높이), 정육면체는 (한 모서리)를 세 번 곱해요",
                     next_preview="6학년 30화 · 1 m³")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("가로 4 cm, 세로 3 cm, 높이 2 cm인 직육면체의 부피는?\n쌓기나무를 하나하나 세지 않고 구할 수 있을까요?", 38).move_to([0.6, 1.6, 0])
        self.say("하나하나 세지 않고?", "가로 4 cm, 세로 3 cm, 높이 2 cm인 직육면체의 부피를 쌓기나무를 하나하나 세지 않고 구할 수 있을까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def layers(self):
        self.section("한 층씩 쌓기")
        cells = box_cells(4, 2, 3)
        g1 = stack([c for c in cells if c[1] == 0], s=0.6, center=(-2.6, -0.4, 0), color=LAYER[0])
        self.say(f"한 층: 4 × 3 = {o('12개')}", "먼저 바닥에 한 층을 깔아요. 가로로 4개씩 세로로 3줄, 4 곱하기 3은 12개예요.")
        self.play(LaggedStart(*[FadeIn(c, shift=DOWN * 0.2) for c in g1], lag_ratio=0.05, run_time=1.2))
        full = stack(cells, s=0.6, center=(-2.6, 0.0, 0), colors={c: LAYER[c[1]] for c in cells})
        self.say(f"높이만큼 {b('2층')}", "높이가 2 cm이니 이 층을 2층으로 쌓아요.")
        self.play(FadeOut(g1), FadeIn(full), run_time=1.0)
        t1 = M(f"한 층: 4 × 3 = {o('12')}", 38).move_to([3.0, 1.0, 0])
        t2 = M(f"2층: 12 × 2 = {g('24')}", 38).move_to([3.0, 0.0, 0])
        t3 = M(f"부피 = {g('24 cm³')}", 42).move_to([3.0, -1.1, 0])
        self.say(f"12 × 2 = {g('24 cm³')}", "한 층에 12개씩 2층이니 12 곱하기 2, 24개. 부피는 24 cm³예요.")
        self.play(FadeIn(t1), FadeIn(t2), run_time=0.6)
        self.play(FadeIn(t3), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def double(self):
        self.section("가로가 2배가 되면")
        a = stack(box_cells(2, 2, 2), s=0.5, center=(-3.6, 0.4, 0))
        b_ = stack(box_cells(4, 2, 2), s=0.5, center=(2.0, 0.4, 0), color="#7C9CC9")
        la = M(f"2 × 2 × 2 = {o('8')}", 34).move_to([-3.6, -1.1, 0])
        lb = M(f"4 × 2 × 2 = {b('16')}", 34).move_to([2.0, -1.1, 0])
        self.say(f"가로가 2배 → 부피도 {g('2배')}", "가로를 2배로 늘리면 쌓기나무도 8개에서 16개로 2배가 돼요. 가로, 세로, 높이가 2배, 3배가 되면 부피도 2배, 3배가 돼요.")
        self.play(FadeIn(a), FadeIn(la), run_time=0.6)
        self.play(FadeIn(b_), FadeIn(lb), run_time=0.6)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def formula(self):
        self.section("부피 구하는 식")
        f1 = M(f"(직육면체의 부피) = ({o('가로')}) × ({b('세로')}) × ({g('높이')})", 40).move_to([0, 1.6, 0])
        f2 = M(f"= ({o('한 밑면의 넓이')}) × ({g('높이')})", 40).move_to([0.6, 0.6, 0])
        self.say("가로 × 세로 × 높이", "그래서 직육면체의 부피는 가로 곱하기 세로 곱하기 높이예요. 가로 곱하기 세로는 한 밑면의 넓이이니, 한 밑면의 넓이 곱하기 높이라고도 해요.")
        self.play(FadeIn(f1), run_time=0.6)
        self.play(FadeIn(f2), run_time=0.6)
        f3 = M(f"(정육면체의 부피) = (한 모서리) × (한 모서리) × (한 모서리)", 36).move_to([0, -0.6, 0])
        e = M(f"한 모서리 3 cm → 3 × 3 × 3 = {g('27 cm³')}", 36).move_to([0, -1.5, 0])
        self.say(f"정육면체는 {g('한 모서리를 세 번')} 곱해요", "정육면체는 가로, 세로, 높이가 모두 같으니 한 모서리의 길이를 세 번 곱해요. 한 모서리가 3 cm면 27 cm³예요.")
        self.play(FadeIn(f3), run_time=0.6)
        self.play(FadeIn(e), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
