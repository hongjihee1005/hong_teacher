"""「수학 원리 돋보기」 개념 차근차근 111화 — 1 m²와 1 km²

1 m² = 100 cm × 100 cm = 10000 cm² / 1 km² = 1000 m × 1000 m = 1000000 m² / 알맞은 단위 고르기 / 연습
최종: GRADE=c ./make_final.sh 111
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


class GcEp111(ConceptScene):
    EP_NO = 111
    EP_TITLE = "1 m²와 1 km²"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.step("1 m²", [(f"한 변이 1 m인 정사각형: {o('1 m²')}", 50, 1.5),
                  (f"100 cm × 100 cm = {g('10000 cm²')}", 52, 0.5),
                  ("1 m가 100 cm라서 1 cm²가 100줄 × 100개", 38, -0.5)],
                  "1 m² = 10000 cm²", "한 변이 1미터인 정사각형의 넓이가 1제곱미터예요. 1미터는 100센티미터라서 100 곱하기 100, 10000제곱센티미터예요.")
        self.step("1 km²", [(f"한 변이 1 km인 정사각형: {b('1 km²')}", 50, 1.5),
                  (f"1000 m × 1000 m = {g('1000000 m²')}", 52, 0.5),
                  ("마을, 도시처럼 아주 넓은 곳을 나타내요", 38, -0.5)],
                  "1 km² = 1000000 m²", "한 변이 1킬로미터인 정사각형의 넓이는 1제곱킬로미터. 1000 곱하기 1000, 100만 제곱미터예요.")
        self.ask("공책 · 교실 바닥 · 우리 시의 넓이에 알맞은 단위는?", "알맞은 단위는?", "연습해 볼까요? 공책, 교실 바닥, 우리 시의 넓이에 알맞은 단위는?",
                 f"공책 {o('cm²')} · 교실 {b('m²')} · 시 {g('km²')}", "cm², m², km²", "공책은 제곱센티미터, 교실은 제곱미터, 시는 제곱킬로미터가 알맞아요.", qsize=50)
        self.closing(f"1 m² = {o('10000 cm²')} · 1 km² = {b('1000000 m²')}\n넓이에 알맞은 단위를 골라요",
                     next_preview="개념 차근차근 112화 · 평행사변형의 넓이")
        self.wait(0.5)
