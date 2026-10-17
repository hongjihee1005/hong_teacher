"""「수학 원리 돋보기」 6학년 46화 — 만든 모양과 위에서 본 모양 (6-2 3단원 3차시, 화 코드 6-2-3-b)

쌓기나무로 만든 모양만 보면 뒤에 숨겨진 쌓기나무가 있을 수 있어서 똑같이 만들 수 없을 때가 있음
위에서 본 모양 = 바닥에 닿아 있는 면의 모양 → 만든 모양과 위에서 본 모양을 함께 보면 숨겨진 쌓기나무가 있는지 알 수 있음
(예시 모양: 앞 왼쪽 2층, 앞 오른쪽·뒤 오른쪽 1층, 뒤 왼쪽은 숨은 자리 — 이 영상에서 정한 모양)
최종: GRADE=6 ./make_final.sh 46
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, SurroundingRectangle, VGroup,
                   Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from cubes import flat, heights_cells, stack, top_view

A = {(0, 0): 2, (1, 0): 1, (1, 1): 1}               # 숨은 자리 없음: 4개
B = {(0, 0): 2, (1, 0): 1, (1, 1): 1, (0, 1): 1}    # 숨은 자리에 1개: 5개


class G6Ep46(EpisodeScene):
    GRADE, SEM = 6, 2
    EP_NO = 46
    EP_TITLE = "만든 모양과 위에서 본 모양"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.same_picture()
        self.top()
        self.closing(f"만든 모양만 보면 {o('숨겨진 쌓기나무')}가 있을 수 있어요\n{b('위에서 본 모양')}을 함께 보면 바닥에 놓인 자리를 알 수 있어요",
                     next_preview="6학년 47화 · 위·앞·옆에서 본 모양")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("이 모양을 만드는 데 쌓기나무가 몇 개 필요할까요?", 44).move_to([0.6, 2.2, 0])
        self.say("쌓기나무는 몇 개?", "쌓기나무로 만든 모양이에요. 이 모양을 똑같이 만드는 데 쌓기나무가 몇 개 필요할까요?")
        self.play(Write(q), run_time=0.9)
        st = stack(heights_cells(A), s=0.9, center=(0, -0.4, 0))
        self.play(FadeIn(st), run_time=0.6)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def same_picture(self):
        self.section("숨은 쌓기나무")
        a = stack(heights_cells(A), s=0.9, center=(-3.2, 0.6, 0))
        bb = stack(heights_cells(B), s=0.9, center=(3.2, 0.6, 0), colors={(0, 0, 1): ORANGE})
        la = M(f"{b('4개')}로 만든 모양", 34).move_to([-3.2, -1.1, 0])
        lb = M(f"{o('5개')}로 만든 모양", 34).move_to([3.2, -1.1, 0])
        self.say("두 모양을 견주어 보아요", "왼쪽은 쌓기나무 4개, 오른쪽은 5개로 만든 모양이에요. 그런데 그림으로는 똑같아 보여요.")
        self.play(FadeIn(a), FadeIn(bb), FadeIn(la), FadeIn(lb), run_time=0.7)
        self.wait(0.5)
        hid = stack(heights_cells(B), s=0.9, center=(3.2, 0.6, 0), colors={(0, 0, 1): ORANGE})
        for m in hid:
            if m.cell != (0, 0, 1):
                m.set_fill(opacity=0.18).set_stroke(opacity=0.3)
        self.say(f"뒤에 {o('숨은 쌓기나무')}가 있었어요", "오른쪽 모양의 앞 쌓기나무를 흐리게 해 보면, 뒤에 숨은 주황색 쌓기나무가 있어요. 그림만 보고는 알 수 없었어요.")
        self.play(FadeOut(bb), FadeIn(hid), run_time=0.9)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def top(self):
        self.section("위에서 본 모양")
        a = stack(heights_cells(A), s=0.75, center=(-3.4, 1.1, 0))
        bb = stack(heights_cells(B), s=0.75, center=(2.6, 1.1, 0))
        self.play(FadeIn(a), FadeIn(bb), run_time=0.5)
        ta = flat(top_view(A), s=0.6, center=(-3.4, -1.0, 0), color="#7C9CC9", frame=(2, 2))
        tb = flat(top_view(B), s=0.6, center=(2.6, -1.0, 0), color="#7C9CC9", frame=(2, 2))
        ra = T("위에서 본 모양", 24, SOFT).next_to(ta, DOWN, buff=0.12)
        rb = T("위에서 본 모양", 24, SOFT).next_to(tb, DOWN, buff=0.12)
        self.say(f"위에서 본 모양 = {b('바닥에 닿은 면')}", "위에서 본 모양은 바닥에 닿아 있는 면의 모양과 같아요. 두 모양을 위에서 보면 달라요.")
        self.play(FadeIn(ta), FadeIn(tb), FadeIn(ra), FadeIn(rb), run_time=0.7)
        empty = SurroundingRectangle(ta[0], color=ORANGE, buff=0.04, stroke_width=5)
        self.say(f"뒤 왼쪽 자리가 {o('비었는지')} 알 수 있어요", "왼쪽 모양은 뒤 왼쪽 자리가 비어 있고, 오른쪽 모양은 그 자리에 쌓기나무가 있어요. 위에서 본 모양을 함께 보면 숨은 쌓기나무가 있는지 알 수 있어요.")
        self.play(Create(empty), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
