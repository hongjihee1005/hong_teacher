"""「수학 원리 돋보기」 개념 차근차근 57화 — (소수) × (소수), 소수점 위치

0.8 × 0.6: 100칸 모눈(가로 0.8, 세로 0.6) → 48칸 = 0.48 / 곱의 소수점 아래 자리 수 = 두 수의 소수점 아래 자리 수의 합
3.4 × 1.7 = 5.78 / 어림으로 확인 / 연습 2.5 × 0.4
최종: GRADE=c ./make_final.sh 57
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, Line, SurroundingRectangle, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, M, T, b, g, o
from division import clear_stage
from conceptkit import ConceptScene, dot, dots, ten_frame, RED
from items import check_mark, cross_mark
from storykit import book, scroll, show_sources
from fraction import frac, frac_bar, row
from decimal4 import grid100
from manim import Rectangle


class GcEp57(ConceptScene):
    EP_NO = 57
    EP_TITLE = "(소수) × (소수), 소수점 위치"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("모눈으로 0.8 × 0.6")
        S_ = 0.32
        cells = VGroup()
        for r in range(10):
            for c in range(10):
                on = c < 8 and r < 6
                cells.add(Rectangle(width=S_, height=S_, fill_color=GREEN if on else "#FFFFFF", fill_opacity=0.8 if on else 1, stroke_color=SOFT, stroke_width=1.5).move_to([c * S_, -r * S_, 0]))
        cells.move_to([-3.2, 0.5, 0])
        self.say("가로 0.8, 세로 0.6", "1을 100칸으로 나눈 모눈에서 가로 0.8, 세로 0.6만큼 칠하면 몇 칸일까요?")
        self.play(FadeIn(cells), run_time=0.8)
        e = M(f"8 × 6 = 48칸 → 0.8 × 0.6 = {g('0.48')}", 48).move_to([2.6, 1.0, 0])
        t = M(f"소수 한 자리 × 소수 한 자리\n→ 곱은 소수 {o('두 자리')}", 40).move_to([2.6, -0.3, 0])
        self.say(f"{g('0.48')}, 소수 두 자리", "8칸 곱하기 6칸, 48칸. 한 칸이 0.01이니까 0.48이에요. 소수 한 자리끼리 곱하면 소수 두 자리가 돼요.")
        self.play(FadeIn(e), FadeIn(t), run_time=0.6)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)
        self.step("소수점 위치 규칙", [(f"3.4 × 1.7 → 34 × 17 = 578", 52, 1.4),
                  (f"소수 {o('1자리')} + {o('1자리')} = {o('2자리')} → {g('5.78')}", 52, 0.4),
                  ("어림: 약 3 × 2 = 6 → 5.78이 알맞아요", 42, -0.6)],
                  "자리 수를 더해요", "자연수처럼 34 곱하기 17은 578. 두 수의 소수점 아래 자리 수를 더한 두 자리만큼 소수점을 찍어 5.78. 어림하면 약 6이라 알맞아요.")
        self.ask("2.5 × 0.4", "2.5 × 0.4", "연습해 볼까요? 2.5 곱하기 0.4를 계산해 보세요.",
                 f"25 × 4 = 100 → 소수 두 자리 → 1.00 = {g('1')}", f"{g('1')}", "25 곱하기 4는 100, 소수 두 자리라서 1.00, 곧 1이에요.")
        self.closing(f"곱의 소수점 아래 자리 수 = 두 수의 {o('자리 수의 합')}\n0.8 × 0.6 = {g('0.48')}",
                     next_preview="개념 차근차근 58화 · (분수) ÷ (자연수)")
        self.wait(0.5)
