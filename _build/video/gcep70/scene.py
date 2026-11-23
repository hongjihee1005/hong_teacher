"""「수학 원리 돋보기」 개념 차근차근 70화 — 비율

비율 = (비교하는 양) ÷ (기준량), 2 : 5 → 2/5 = 0.4 / 생활: 걸린 시간에 대한 간 거리(빠르기), 넓이에 대한 인구(인구 밀도)
연습: 20문제 중 15문제 맞힘 → 비율
최종: GRADE=c ./make_final.sh 70
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
from manim import Rectangle


class GcEp70(ConceptScene):
    EP_NO = 70
    EP_TITLE = "비율"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.step("비를 하나의 수로", [(f"{o('2')} : {b('5')}", 100, 1.6),
                  (f"비율 = {o('비교하는 양')} ÷ {b('기준량')} = 2 ÷ 5 = {g('2/5')} = {g('0.4')}", 46, 0.3),
                  ("비율은 분수나 소수로 나타내요", 40, -0.7)],
                  "비율은 비교하는 양 ÷ 기준량", "2 대 5를 하나의 수로 나타내면 비교하는 양 2를 기준량 5로 나눈 2분의 5, 0.4예요. 이것을 비율이라고 해요.")
        self.step("생활 속 비율", [(f"빠르기: 2시간에 120 km → 120 ÷ 2 = {g('60')} (1시간에 60 km)", 42, 1.2),
                  (f"인구 밀도: 넓이 10 km²에 5000명 → 5000 ÷ 10 = {g('500')} (1 km²에 500명)", 40, 0.1),
                  ("기준량이 1일 때의 양으로 비교하면 공평해요", 38, -0.9)],
                  "빠르기, 인구 밀도", "자동차가 2시간에 120킬로미터를 가면 걸린 시간에 대한 간 거리의 비율은 60. 1시간에 60킬로미터 빠르기예요. 넓이에 대한 인구도 비율로 나타내 비교해요.")
        self.ask("20문제 중 15문제를 맞혔어요\n전체 문제에 대한 맞힌 문제의 비율은?", "비율을 구해 보세요", "연습해 볼까요? 20문제 중 15문제를 맞혔어요. 맞힌 문제의 비율을 분수와 소수로 나타내 보세요.",
                 f"15 ÷ 20 = 15/20 = {g('3/4')} = {g('0.75')}", f"{g('3/4')}, {g('0.75')}", "15 나누기 20, 20분의 15는 4분의 3, 소수로 0.75예요.", qsize=46)
        self.closing(f"비율 = {o('비교하는 양')} ÷ {b('기준량')}\n2 : 5의 비율 = 2/5 = {g('0.4')}",
                     next_preview="개념 차근차근 71화 · 백분율")
        self.wait(0.5)
