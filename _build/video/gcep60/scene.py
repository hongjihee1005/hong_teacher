"""「수학 원리 돋보기」 개념 차근차근 60화 — (소수) ÷ (자연수)

6.2 ÷ 2 = 3.1 (62 ÷ 2 = 31, 0.1이 62개) / 몫의 소수점은 나누어지는 수의 소수점 바로 위 / 1.24 ÷ 2 = 0.62 / 2.6 ÷ 4: 0을 내려 0.65
연습 4.5 ÷ 3
최종: GRADE=c ./make_final.sh 60
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


class GcEp60(ConceptScene):
    EP_NO = 60
    EP_TITLE = "(소수) ÷ (자연수)"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.step("0.1이 몇 개", [(f"6.2 = 0.1이 62개 → 62 ÷ 2 = 31 → 0.1이 31개 = {g('3.1')}", 46, 1.0)],
                  "자연수의 나눗셈으로", "6.2는 0.1이 62개. 62 나누기 2는 31이니까 0.1이 31개, 3.1이에요.")
        self.step("몫의 소수점은 바로 위에", [(f"1.24 ÷ 2 = {g('0.62')}", 60, 1.4),
                  ("세로셈에서 몫의 소수점은 나누어지는 수의 소수점 바로 위", 40, 0.4),
                  (f"2.6 ÷ 4: 2.6 = 2.60, 0을 내려 → {g('0.65')}", 48, -0.6)],
                  "소수점을 바로 위에 찍어요", "세로셈에서는 몫의 소수점을 나누어지는 수의 소수점 바로 위에 찍어요. 나누어떨어지지 않으면 소수 끝에 0이 있다고 보고 0을 내려 계산해요.")
        self.ask("4.5 ÷ 3", "4.5 ÷ 3", "연습해 볼까요? 4.5 나누기 3을 계산해 보세요.",
                 f"45 ÷ 3 = 15 → {g('1.5')}", f"{g('1.5')}", "0.1이 45개를 3으로 나누면 0.1이 15개, 1.5예요.")
        self.closing(f"자연수처럼 나누고 몫의 소수점은 {o('바로 위')}에\n6.2 ÷ 2 = {g('3.1')}",
                     next_preview="개념 차근차근 61화 · (소수) ÷ (소수)")
        self.wait(0.5)
