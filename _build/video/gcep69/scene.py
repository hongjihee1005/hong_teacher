"""「수학 원리 돋보기」 개념 차근차근 69화 — 비

두 양 비교: 뺄셈(차)과 나눗셈(몇 배) / 비 3 : 2 (3 대 2), 기준량은 뒤(2) / 같은 비 3 : 2 ≠ 2 : 3(순서) / 연습: 빨간 구슬 4, 파란 구슬 7
최종: GRADE=c ./make_final.sh 69
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


class GcEp69(ConceptScene):
    EP_NO = 69
    EP_TITLE = "비"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("두 양을 비교하는 두 방법")
        a = dots(6, ORANGE, cols=6, step=0.6, r=0.22).move_to([-1.0, 1.6, 0])
        c = dots(3, BLUE, cols=3, step=0.6, r=0.22).move_to([-1.9, 0.8, 0])
        la, lc = M("어른 6명", 38).next_to(a, LEFT, buff=0.4), M("어린이 3명", 38).next_to(c, LEFT, buff=0.4)
        self.say("어른 6명, 어린이 3명", "어른 6명과 어린이 3명. 두 수를 어떻게 비교할 수 있을까요?")
        self.play(FadeIn(a), FadeIn(c), FadeIn(la), FadeIn(lc), run_time=0.6)
        t1 = M(f"뺄셈: 6 − 3 = {b('3')} → 어른이 3명 더 많아요", 44).move_to([0, -0.3, 0])
        t2 = M(f"나눗셈: 6 ÷ 3 = {o('2')} → 어른이 어린이의 2배", 44).move_to([0, -1.2, 0])
        self.say("차로, 또는 몇 배로", "뺄셈으로 비교하면 3명 더 많고, 나눗셈으로 비교하면 어른이 어린이의 2배예요. 나눗셈으로 비교하는 것을 비로 나타내요.")
        self.play(FadeIn(t1), run_time=0.5)
        self.play(FadeIn(t2), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)
        self.step("비로 나타내기", [(f"{o('3')} : {b('2')}", 110, 1.4),
                  ("읽기: 3 대 2 · 3과 2의 비 · 2에 대한 3의 비 · 3의 2에 대한 비", 36, 0.0),
                  (f"기호 : 의 {b('오른쪽')}이 {b('기준량')}(기준이 되는 양)", 42, -0.9)],
                  "3 : 2, 3 대 2", "두 수를 나눗셈으로 비교할 때 기호 쌍점을 써서 3 대 2라고 나타내요. 쌍점 오른쪽 수가 기준이 되는 양, 기준량이에요.")
        self.step("순서가 중요해요", [(f"사과 3개, 배 2개 → 사과 : 배 = {o('3 : 2')}", 48, 1.0),
                  (f"배 : 사과 = {b('2 : 3')} (서로 달라요)", 48, 0.0)],
                  "3 : 2와 2 : 3은 달라요", "사과와 배의 비는 3 대 2, 배와 사과의 비는 2 대 3. 순서를 바꾸면 다른 비가 돼요.")
        self.ask("빨간 구슬 4개, 파란 구슬 7개\n파란 구슬에 대한 빨간 구슬의 비는?", "비로 나타내 보세요", "연습해 볼까요? 빨간 구슬 4개, 파란 구슬 7개가 있어요. 파란 구슬에 대한 빨간 구슬의 비를 써 보세요.",
                 f"{g('4 : 7')} (기준량은 파란 구슬 7)", f"{g('4 : 7')}", "파란 구슬이 기준이니 오른쪽에 와요. 4 대 7이에요.", qsize=46)
        self.closing(f"두 양을 나눗셈으로 비교한 것: {o('비')}  3 : 2 (3 대 2)\n쌍점 오른쪽이 {b('기준량')}, 순서를 바꾸면 다른 비",
                     next_preview="개념 차근차근 70화 · 비율")
        self.wait(0.5)
