"""「수학 원리 돋보기」 개념 차근차근 54화 — (분수) × (자연수)

2/5 × 3 = 2/5 + 2/5 + 2/5 = 6/5 (막대) / 분자에 자연수를 곱함, 분모는 그대로 / 약분 먼저 5/6 × 4 / 대분수 × 자연수 / 연습 3/8 × 4
최종: GRADE=c ./make_final.sh 54
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


class GcEp54(ConceptScene):
    EP_NO = 54
    EP_TITLE = "(분수) × (자연수)"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("같은 분수를 여러 번 더하기")
        bars = VGroup(*[frac_bar(5, 2, width=3.2) for _ in range(3)]).arrange(RIGHT, buff=0.3).move_to([0, 1.4, 0])
        self.say("2/5 × 3", "5분의 2 곱하기 3은 5분의 2를 세 번 더한 것이에요.")
        self.play(FadeIn(bars, lag_ratio=0.2), run_time=0.8)
        e = M(f"2/5 + 2/5 + 2/5 = (2 × 3)/5 = {g('6/5')} = 1과 1/5", 52).move_to([0, 0.0, 0])
        self.say(f"분자끼리: 2 × 3 = 6 → {g('6/5')}", "5분의 1이 2개씩 세 번, 모두 6개. 그래서 5분의 6, 대분수로 1과 5분의 1이에요. 분자에 자연수를 곱하고 분모는 그대로예요.")
        self.play(FadeIn(e), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)
        self.step("약분 먼저 하면 편해요", [(f"5/6 × 4 → 6과 4를 {o('2로 약분')} → 5 × 2 / 3 = 10/3 = {g('3과 1/3')}", 42, 1.0),
                  (f"대분수: 1과 1/4 × 3 = 5/4 × 3 = 15/4 = {g('3과 3/4')}", 44, -0.2)],
                  "약분 먼저, 대분수는 가분수로", "곱하기 전에 분모와 자연수를 약분하면 수가 작아져 편해요. 대분수는 가분수로 바꾸어 곱해요.")
        self.ask("3/8 × 4", "3/8 × 4", "연습해 볼까요? 8분의 3 곱하기 4를 계산해 보세요.",
                 f"(3 × 4)/8 = 12/8 = {g('3/2')} = 1과 1/2", f"{g('1과 1/2')}", "8분의 12, 약분하면 2분의 3, 대분수로 1과 2분의 1이에요.")
        self.closing(f"(분수) × (자연수): {o('분자')}에 자연수를 곱해요, 분모는 그대로\n2/5 × 3 = {g('6/5')}",
                     next_preview="개념 차근차근 55화 · (분수) × (분수)")
        self.wait(0.5)
