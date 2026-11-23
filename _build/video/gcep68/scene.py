"""「수학 원리 돋보기」 개념 차근차근 68화 — 대응 관계와 식

식탁 수와 다리 수: 1→4, 2→8, 3→12 → △ = □ × 4 / 표로 정리 / 나이: 형이 늘 3살 많음 △ = □ + 3
연습: 세발자전거 수와 바퀴 수
최종: GRADE=c ./make_final.sh 68
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
from manim import Rectangle, Square, Triangle, Circle


class GcEp68(ConceptScene):
    EP_NO = 68
    EP_TITLE = "대응 관계와 식"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("함께 변하는 두 양")
        rows = VGroup(M("식탁 수(□)   1   2   3   4", 48), M(f"다리 수(△)   4   8   12  {g('16')}", 48)).arrange(DOWN, buff=0.4, aligned_edge=LEFT).move_to([0, 1.2, 0])
        self.say("식탁이 늘면 다리도", "식탁이 1개면 다리 4개, 2개면 8개, 3개면 12개. 식탁 수가 변하면 다리 수도 따라 변해요.")
        self.play(FadeIn(rows, lag_ratio=0.3), run_time=0.8)
        e = M(f"△ = □ × {o('4')}", 80).move_to([0, -0.5, 0])
        self.say(f"△ = □ × {o('4')}", "다리 수는 언제나 식탁 수의 4배예요. 이 관계를 세모는 네모 곱하기 4라는 식으로 나타내요.")
        self.play(Write(e), run_time=0.6)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)
        self.step("더하는 관계도 있어요", [("내 나이(□)   8   9   10", 48, 1.4), ("형 나이(△)  11  12   13", 48, 0.6),
                  (f"△ = □ + {o('3')}", 72, -0.6)],
                  "형은 늘 3살 많아요", "내가 8살이면 형은 11살, 9살이면 12살. 형은 언제나 3살 많아서 세모는 네모 더하기 3이에요.")
        self.ask("세발자전거 수(□)와 바퀴 수(△)의 관계를 식으로", "식으로 나타내 보세요", "연습해 볼까요? 세발자전거 수와 바퀴 수의 관계를 식으로 나타내 보세요.",
                 f"△ = □ × {g('3')}", f"△ = □ × {g('3')}", "세발자전거 한 대에 바퀴가 3개라서 세모는 네모 곱하기 3이에요.", qsize=46)
        self.closing(f"함께 변하는 두 양의 {g('대응 관계')}를 표와 식으로\n△ = □ × 4,  △ = □ + 3",
                     next_preview="개념 차근차근 69화 · 비")
        self.wait(0.5)
