"""「수학 원리 돋보기」 개념 차근차근 117화 — 직육면체의 겉넓이

여섯 면의 넓이의 합 / 마주 보는 면이 같으니 (세 면의 넓이) × 2 / 전개도로 / 예: 5 × 4 × 3 → (20 + 15 + 12) × 2 = 94 cm² / 정육면체: 한 면 × 6 / 연습
최종: GRADE=c ./make_final.sh 117
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
from conceptkit import poly, regular
from manim import Rectangle, Square, Circle, Polygon, Dot, DashedLine, PI, Sector
from cuboid import Cuboid
from cubes import stack, box_cells


class GcEp117(ConceptScene):
    EP_NO = 117
    EP_TITLE = "직육면체의 겉넓이"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("겉면의 넓이")
        cb = Cuboid(2.5, 1.5, 2.0, [-3.4, 0.4, 0])
        C = VGroup(cb.face("front", ORANGE, 0.4), cb.face("top", BLUE, 0.4), cb.face("right", GREEN, 0.4), cb.edges())
        la = VGroup(M("가로 5 cm", 30).next_to(cb.face("front", ORANGE, 0), DOWN, buff=0.2), M("높이 3 cm", 30).next_to(cb.face("front", ORANGE, 0), LEFT, buff=0.2))
        self.say("여섯 면의 넓이를 더해요", "직육면체의 여섯 면의 넓이를 모두 더한 것을 겉넓이라고 해요. 가로 5, 세로 4, 높이 3센티미터인 상자를 볼까요?")
        self.play(FadeIn(C), FadeIn(la), run_time=0.7)
        t = M(f"마주 보는 면끼리 같아요\n→ ({o('5 × 3')} + {b('5 × 4')} + {g('4 × 3')}) × 2\n= (15 + 20 + 12) × 2 = {g('94 cm²')}", 40).move_to([2.6, 0.6, 0])
        self.say(f"세 면의 넓이 × 2 = {g('94')}", "마주 보는 면끼리 넓이가 같아서 서로 다른 세 면의 넓이를 더해 2를 곱하면 돼요. 15 더하기 20 더하기 12는 47, 곱하기 2는 94제곱센티미터.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.5)
        self.ask("한 모서리가 3 cm인 정육면체의 겉넓이는?", "겉넓이는?", "연습해 볼까요? 한 모서리가 3센티미터인 정육면체의 겉넓이는?",
                 f"3 × 3 × 6 = {g('54 cm²')}", f"{g('54 cm²')}", "한 면은 9제곱센티미터, 면이 6개라서 54제곱센티미터예요.", qsize=56)
        self.closing(f"여섯 면의 넓이의 합: {g('겉넓이')}\n직육면체 = (세 면의 넓이) × 2 · 정육면체 = 한 면 × 6",
                     next_preview="개념 차근차근 118화 · 부피, 1 cm³와 1 m³")
        self.wait(0.5)
