"""「수학 원리 돋보기」 개념 차근차근 101화 — 1 mm와 1 km

1 cm = 10 mm, 6 cm 3 mm = 63 mm / 1000 m = 1 km, 2 km 300 m = 2300 m / 어림: 학교~도서관 약 1 km / 단위 고르기 / 연습
최종: GRADE=c ./make_final.sh 101
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
from manim import Rectangle, Square, Circle, Dot, Arrow, PI


class GcEp101(ConceptScene):
    EP_NO = 101
    EP_TITLE = "1 mm와 1 km"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.step("1 mm", [(f"1 cm를 10칸으로 나눈 한 칸: {o('1 mm')} (1 밀리미터)", 46, 1.4),
                  (f"1 cm = {o('10 mm')} · 6 cm 3 mm = {g('63 mm')}", 50, 0.4)],
                  "1 cm의 10분의 1", "자의 1센티미터를 10칸으로 나눈 작은 눈금 한 칸이 1밀리미터예요. 6센티미터 3밀리미터는 63밀리미터.")
        self.step("1 km", [(f"1000 m = {b('1 km')} (1 킬로미터)", 56, 1.4),
                  (f"2 km 300 m = {g('2300 m')}", 50, 0.4),
                  ("어른이 15분쯤 걸으면 약 1 km", 40, -0.6)],
                  "1000 m는 1 km", "1미터가 1000개 모이면 1킬로미터예요. 2킬로미터 300미터는 2300미터. 어른이 15분쯤 걸으면 약 1킬로미터를 가요.")
        self.ask("어떤 단위가 알맞을까요?\n개미 길이 · 교실 길이 · 서울~부산 거리", "알맞은 단위는?", "연습해 볼까요? 개미 길이, 교실 길이, 서울에서 부산까지의 거리에는 어떤 단위가 알맞을까요?",
                 f"개미 {o('mm')} · 교실 {b('m')} · 서울~부산 {g('km')}", "mm, m, km", "작은 개미는 밀리미터, 교실은 미터, 먼 거리는 킬로미터가 알맞아요.", qsize=46, asize=50)
        self.closing(f"1 cm = {o('10 mm')} · 1 m = 100 cm · 1 km = {b('1000 m')}\n재는 것에 알맞은 단위를 골라요",
                     next_preview="개념 차근차근 102화 · 몇 시, 몇 시 30분")
        self.wait(0.5)
