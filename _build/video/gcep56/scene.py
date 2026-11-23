"""「수학 원리 돋보기」 개념 차근차근 56화 — (소수) × (자연수)

0.3 × 4: 0.1이 3개씩 4번 = 0.1이 12개 = 1.2 / 3 × 4 = 12에서 소수점 / 1.4 × 6 = 8.4, 3.14 × 3 = 9.42 / 연습 0.7 × 5
최종: GRADE=c ./make_final.sh 56
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


class GcEp56(ConceptScene):
    EP_NO = 56
    EP_TITLE = "(소수) × (자연수)"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.step("0.1이 몇 개", [(f"0.3 × 4 = 0.1이 {o('3개')}씩 4번 = 0.1이 {o('12개')}", 50, 1.2),
                  (f"= {g('1.2')}", 70, 0.0)],
                  "0.1이 몇 개인지로", "0.3 곱하기 4는 0.1이 3개씩 4번, 0.1이 12개예요. 0.1이 10개면 1이니까 1.2.")
        self.step("자연수처럼 곱하고 소수점", [(f"3 × 4 = 12 → 0.3 × 4 = {g('1.2')}", 54, 1.4),
                  (f"14 × 6 = 84 → 1.4 × 6 = {g('8.4')}", 54, 0.4),
                  (f"314 × 3 = 942 → 3.14 × 3 = {g('9.42')}", 54, -0.6)],
                  "자연수처럼 곱하고 소수점을 찍어요", "자연수처럼 곱한 다음, 곱해지는 소수의 소수점 아래 자리 수만큼 소수점을 찍어요. 3.14는 소수 두 자리라서 9.42.")
        self.ask("0.7 × 5", "0.7 × 5", "연습해 볼까요? 0.7 곱하기 5를 계산해 보세요.",
                 f"7 × 5 = 35 → {g('3.5')}", f"{g('3.5')}", "7 곱하기 5는 35, 소수 한 자리라서 3.5예요.")
        self.closing(f"자연수처럼 곱하고, 소수 {o('자리 수')}만큼 소수점을 찍어요\n0.3 × 4 = {g('1.2')}  (0.1이 12개)",
                     next_preview="개념 차근차근 57화 · (소수) × (소수), 소수점 위치")
        self.wait(0.5)
