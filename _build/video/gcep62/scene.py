"""「수학 원리 돋보기」 개념 차근차근 62화 — 몫을 반올림하여 나타내기

7 ÷ 3 = 2.333… 끝나지 않음 → 소수 첫째 자리까지 반올림 2.3 / 둘째 자리까지 2.33 / 반올림은 바로 아래 자리를 봄(64화)
연습 10 ÷ 6 첫째 자리까지
최종: GRADE=c ./make_final.sh 62
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


class GcEp62(ConceptScene):
    EP_NO = 62
    EP_TITLE = "몫을 반올림하여 나타내기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.step("끝나지 않는 나눗셈", [(f"7 ÷ 3 = 2.3333…", 70, 1.3),
                  ("3이 끝없이 이어져요", 44, 0.2)],
                  "7 ÷ 3은 끝나지 않아요", "7 나누기 3을 계속 계산하면 2.3333, 3이 끝없이 이어져요. 이럴 때는 몫을 어림해서 나타내요.")
        self.step("반올림하여 나타내기", [(f"소수 첫째 자리까지: 2.3{o('3')}… → {g('2.3')}", 52, 1.2),
                  (f"소수 둘째 자리까지: 2.33{o('3')}… → {g('2.33')}", 52, 0.2),
                  ("구하려는 자리 바로 아래 숫자가 0~4면 버리고, 5~9면 올려요", 38, -0.8)],
                  "바로 아래 자리를 보고 반올림", "소수 첫째 자리까지 나타내려면 둘째 자리 숫자 3을 보고 버려서 2.3. 둘째 자리까지라면 셋째 자리를 보고 2.33이에요.")
        self.ask("10 ÷ 6 (소수 첫째 자리까지)", "10 ÷ 6을 반올림", "연습해 볼까요? 10 나누기 6의 몫을 반올림하여 소수 첫째 자리까지 나타내 보세요.",
                 f"1.66… → 둘째 자리 6은 올려요 → {g('1.7')}", f"{g('1.7')}", "10 나누기 6은 1.666. 소수 둘째 자리 6은 5 이상이니 올려서 1.7이에요.", qsize=60)
        self.closing(f"나누어떨어지지 않으면 몫을 {o('반올림')}해 나타내요\n7 ÷ 3 = 2.333… → 첫째 자리까지 {g('2.3')}",
                     next_preview="개념 차근차근 63화 · 이상·이하·초과·미만")
        self.wait(0.5)
