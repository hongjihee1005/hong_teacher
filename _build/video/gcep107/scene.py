"""「수학 원리 돋보기」 개념 차근차근 107화 — 무게: kg·g·t

양팔저울로 비교, 클립·바둑돌 몇 개는 물건마다 달라 단위 필요 / 1 kg = 1000 g, 1 t = 1000 kg / 2 kg 500 g = 2500 g / 연습
최종: GRADE=c ./make_final.sh 107
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


class GcEp107(ConceptScene):
    EP_NO = 107
    EP_TITLE = "무게: kg·g·t"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.step("저울로 비교", [("양팔저울: 무거운 쪽이 아래로 내려가요", 46, 1.4),
                  ("클립 몇 개, 바둑돌 몇 개로 재면 쓰는 물건마다 달라요", 40, 0.4),
                  (f"→ 누구나 같은 {g('무게 단위')}", 46, -0.6)],
                  "같은 단위가 필요해요", "양팔저울은 무거운 쪽이 아래로 내려가요. 그런데 클립이나 바둑돌 몇 개로 재면 쓰는 물건마다 결과가 달라서 같은 단위가 필요해요.")
        self.step("kg·g·t", [(f"{o('1 kg')} = {g('1000 g')}", 64, 1.5),
                  (f"2 kg 500 g = {g('2500 g')}", 52, 0.5),
                  (f"아주 무거운 것: {b('1 t')} (1 톤) = 1000 kg", 48, -0.5)],
                  "1 kg = 1000 g", "무게의 단위에는 킬로그램과 그램이 있어요. 1킬로그램은 1000그램. 트럭처럼 아주 무거운 것은 톤으로 나타내요. 1톤은 1000킬로그램이에요.")
        self.ask("3 kg 200 g은 몇 g?", "몇 g일까요?", "연습해 볼까요? 3킬로그램 200그램은 몇 그램일까요?",
                 f"3000 g + 200 g = {g('3200 g')}", f"{g('3200 g')}", "3킬로그램은 3000그램, 더하면 3200그램이에요.")
        self.closing(f"1 kg = {o('1000 g')} · 1 t = {b('1000 kg')}\n재는 물건에 알맞은 단위를 골라요",
                     next_preview="개념 차근차근 108화 · 둘레")
        self.wait(0.5)
