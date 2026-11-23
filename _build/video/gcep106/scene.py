"""「수학 원리 돋보기」 개념 차근차근 106화 — 들이: L와 mL

들이 = 그릇에 담을 수 있는 양, 옮겨 담아 비교 → 컵 몇 개로 재면 컵마다 달라 단위 필요 / 1 L(리터), 1 mL(밀리리터), 1 L = 1000 mL
1 L 300 mL = 1300 mL / 생활: 우유 200 mL, 생수 2 L / 연습
최종: GRADE=c ./make_final.sh 106
"""
import numpy as np
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
from manim import Rectangle, Square, Circle, Dot, PI


class GcEp106(ConceptScene):
    EP_NO = 106
    EP_TITLE = "들이: L와 mL"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.step("들이 비교하기", [("그릇에 담을 수 있는 양: 들이", 50, 1.5),
                  ("한쪽 그릇의 물을 다른 그릇에 옮겨 담아 넘치면 처음 그릇이 더 많이 담겨요", 36, 0.5),
                  (f"컵으로 세면 컵 크기마다 달라요 → {g('같은 단위')}가 필요해요", 40, -0.5)],
                  "옮겨 담아 비교해요", "그릇에 담을 수 있는 양을 들이라고 해요. 옮겨 담아 비교할 수 있지만, 컵으로 세면 컵 크기에 따라 달라서 같은 단위가 필요해요.")
        self.step("L와 mL", [(f"{o('1 L')} (1 리터) · {b('1 mL')} (1 밀리리터)", 54, 1.5),
                  (f"1 L = {g('1000 mL')}", 64, 0.4),
                  (f"1 L 300 mL = {g('1300 mL')}", 52, -0.6)],
                  "1 L = 1000 mL", "들이의 단위에는 리터와 밀리리터가 있어요. 1리터는 1000밀리리터예요. 1리터 300밀리리터는 1300밀리리터.")
        self.ask("우유 한 갑 · 큰 생수병 · 욕조에 알맞은 단위는?", "알맞은 단위는?", "연습해 볼까요? 작은 우유 한 갑, 큰 생수병, 욕조의 들이에는 어떤 단위가 알맞을까요?",
                 f"우유 {b('200 mL')} · 생수 {o('2 L')} · 욕조 {o('200 L')}쯤", "mL, L, L", "작은 우유는 밀리리터, 생수병과 욕조는 리터로 나타내는 것이 알맞아요.", qsize=50, asize=48)
        self.closing(f"그릇에 담을 수 있는 양: {g('들이')}\n1 L = {o('1000 mL')}",
                     next_preview="개념 차근차근 107화 · 무게: kg·g·t")
        self.wait(0.5)
