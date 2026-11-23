"""「수학 원리 돋보기」 개념 차근차근 61화 — (소수) ÷ (소수)

3.6 ÷ 0.9 = 36 ÷ 9 = 4 (둘 다 10배 해도 몫은 같음) / 3.75 ÷ 1.25 = 375 ÷ 125 = 3 / 자연수 ÷ 소수 10 ÷ 2.5 = 100 ÷ 25 = 4
연습 4.8 ÷ 0.6
최종: GRADE=c ./make_final.sh 61
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


class GcEp61(ConceptScene):
    EP_NO = 61
    EP_TITLE = "(소수) ÷ (소수)"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.step("똑같이 10배 해도 몫은 같아요", [(f"6 ÷ 2 = 3,  60 ÷ 20 = 3,  600 ÷ 200 = 3", 48, 1.5),
                  (f"3.6 ÷ 0.9 → ({o('× 10')}) → 36 ÷ 9 = {g('4')}", 54, 0.4)],
                  "두 수에 같은 수를 곱하면 몫은 그대로", "나누어지는 수와 나누는 수에 똑같이 10을 곱해도 몫은 같아요. 그래서 3.6 나누기 0.9는 36 나누기 9로 바꾸어 4.")
        self.step("소수점 옮기기", [(f"3.75 ÷ 1.25 → {o('× 100')} → 375 ÷ 125 = {g('3')}", 52, 1.2),
                  (f"10 ÷ 2.5 → {o('× 10')} → 100 ÷ 25 = {g('4')}", 52, 0.0),
                  ("나누는 수가 자연수가 되도록 소수점을 같은 칸만큼 옮겨요", 38, -1.1)],
                  "나누는 수를 자연수로", "나누는 수가 자연수가 되도록 두 수의 소수점을 같은 칸만큼 오른쪽으로 옮겨요.")
        self.ask("4.8 ÷ 0.6", "4.8 ÷ 0.6", "연습해 볼까요? 4.8 나누기 0.6을 계산해 보세요.",
                 f"48 ÷ 6 = {g('8')}", f"{g('8')}", "둘 다 10배 하면 48 나누기 6, 8이에요.")
        self.closing(f"두 수의 소수점을 {o('같은 칸만큼')} 옮겨 나누는 수를 자연수로\n3.6 ÷ 0.9 = 36 ÷ 9 = {g('4')}",
                     next_preview="개념 차근차근 62화 · 몫을 반올림하여 나타내기")
        self.wait(0.5)
