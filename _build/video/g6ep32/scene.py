"""「수학 원리 돋보기」 6학년 32화 — 부피가 같아도 겉넓이는 다를까? (6-1 6단원 9차시 생각을 더하다, 화 코드 6-1-6-e)

같은 상자를 여러 개 쌓으면 쌓은 모양이 달라도 부피는 같지만 겉넓이는 다를 수 있음
겹치는 부분 없이 포장할 때 필요한 포장지 넓이 = 쌓은 모양의 겉넓이 → 겉넓이가 더 좁은 모양으로 쌓으면 포장지 절약
(예시: 한 모서리 10 cm 정육면체 상자 4개 — 한 줄 40×10×10: 1800 cm², 2×2 판 20×20×10: 1600 cm², 이 영상에서 정한 크기)
최종: GRADE=6 ./make_final.sh 32
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, SurroundingRectangle, VGroup,
                   Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from cubes import box_cells, stack


class G6Ep32(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 32
    EP_TITLE = "부피가 같아도 겉넓이는 다를까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.compare()
        self.closing(f"쌓은 모양이 달라도 {o('부피')}는 같지만 {b('겉넓이')}는 다를 수 있어요\n겉넓이가 좁은 모양으로 쌓으면 {g('포장지를 아낄 수 있어요')}",
                     next_preview="6학년 33화 · 분모가 같은 (분수) ÷ (분수)")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("한 모서리가 10 cm인 상자 4개를 쌓아 포장하려고 해요.\n어떤 모양으로 쌓으면 포장지가 덜 들까요?", 40).move_to([0.6, 1.8, 0])
        self.say("어떻게 쌓을까요?", "한 모서리가 10 cm인 정육면체 상자 4개를 쌓아서 한꺼번에 포장하려고 해요. 어떤 모양으로 쌓으면 포장지가 덜 들까요?")
        self.play(Write(q), run_time=1.0)
        a = stack(box_cells(4, 1, 1), s=0.7, center=(-3.2, -0.6, 0))
        b_ = stack(box_cells(2, 1, 2), s=0.7, center=(3.0, -0.6, 0), color="#7C9CC9")
        self.play(FadeIn(a), FadeIn(b_), run_time=0.7)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def compare(self):
        self.section("부피와 겉넓이 견주기")
        a = stack(box_cells(4, 1, 1), s=0.7, center=(-3.4, 1.3, 0))
        b_ = stack(box_cells(2, 1, 2), s=0.7, center=(3.0, 1.3, 0), color="#7C9CC9")
        la = M("한 줄로: 40 × 10 × 10", 32).move_to([-3.4, 0.2, 0])
        lb = M("두 줄로: 20 × 20 × 10", 32).move_to([3.0, 0.2, 0])
        self.play(FadeIn(a), FadeIn(b_), FadeIn(la), FadeIn(lb), run_time=0.6)
        va = M(f"부피 {o('4000 cm³')}", 34).move_to([-3.4, -0.5, 0])
        vb = M(f"부피 {o('4000 cm³')}", 34).move_to([3.0, -0.5, 0])
        self.say(f"부피는 둘 다 {o('4000 cm³')}", "상자 4개를 쌓았으니 쌓은 모양이 달라도 부피는 둘 다 4000 cm³예요.")
        self.play(FadeIn(va), FadeIn(vb), run_time=0.6)
        sa = M(f"겉넓이 (400 + 400 + 100) × 2\n= {b('1800 cm²')}", 30).move_to([-3.4, -1.45, 0])
        sb = M(f"겉넓이 (400 + 200 + 200) × 2\n= {g('1600 cm²')}", 30).move_to([3.0, -1.45, 0])
        self.say(f"겉넓이는 {b('1800')}과 {g('1600')}", "하지만 겉넓이는 한 줄로 쌓으면 1800 cm², 두 줄로 쌓으면 1600 cm²로 달라요.")
        self.play(FadeIn(sa), run_time=0.5)
        self.play(FadeIn(sb), run_time=0.5)
        box = SurroundingRectangle(VGroup(b_, sb), color=GREEN, buff=0.15, stroke_width=5)
        self.say(f"두 줄로 쌓으면 {g('포장지를 아껴요')}", "겹치는 면이 많을수록 겉넓이가 좁아져요. 두 줄로 쌓으면 포장지를 200 cm² 아낄 수 있어요.")
        self.play(Create(box), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
