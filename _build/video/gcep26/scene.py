"""「수학 원리 돋보기」 개념 차근차근 26화 — (두·세 자리 수) × (한 자리 수)

23 × 3: 수 모형 23을 3줄 → 십끼리 20 × 3 = 60, 일끼리 3 × 3 = 9 → 69 / 올림: 128 × 3 세로셈(multiply.mul_vertical)
연습: 46 × 2, 215 × 4
최종: GRADE=c ./make_final.sh 26
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
from base10 import number_blocks
from multiply import mul_vertical


class GcEp26(ConceptScene):
    EP_NO = 26
    EP_TITLE = "(두·세 자리 수) × (한 자리 수)"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.blocks()
        self.section("올림이 있는 곱셈")
        self.say("128 × 3을 세로셈으로", "128 곱하기 3을 세로셈으로 계산해 볼까요? 일의 자리부터 곱해요.")
        mul_vertical(self, 128, 3)
        self.settle()
        clear_stage(self, 0.5)
        self.practice()
        self.closing(f"자리마다 나누어 곱하고 더해요: 23 × 3 = {b('60')} + {o('9')} = {g('69')}\n곱이 10을 넘으면 윗자리로 {g('올림')}",
                     next_preview="개념 차근차근 27화 · (두·세 자리 수) × (두 자리 수)")
        self.wait(0.5)

    def blocks(self):
        self.section("자리마다 나누어 곱해요")
        rows = VGroup(*[number_blocks(23, size=0.16) for _ in range(3)]).arrange(DOWN, buff=0.25).move_to([-3.2, 0.8, 0])
        self.say("23이 3줄", "23 곱하기 3은 23을 세 번 더한 것이에요. 수 모형 23을 3줄 놓았어요.")
        self.play(FadeIn(rows, lag_ratio=0.2), run_time=1.0)
        e1 = M(f"십 모형: {b('20')} × 3 = {b('60')}", 46).move_to([2.6, 1.4, 0])
        e2 = M(f"일 모형: {o('3')} × 3 = {o('9')}", 46).move_to([2.6, 0.5, 0])
        e3 = M(f"60 + 9 = {g('69')}", 56).move_to([2.6, -0.5, 0])
        self.say("십끼리, 일끼리 곱해요", "십 모형은 20씩 3줄이라 60, 일 모형은 3씩 3줄이라 9. 더하면 69예요.")
        self.play(FadeIn(e1), run_time=0.4)
        self.play(FadeIn(e2), run_time=0.4)
        self.play(FadeIn(e3), run_time=0.4)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        qs = VGroup(M("① 46 × 2", 70), M("② 215 × 4", 70)).arrange(RIGHT, buff=2.0).move_to([0, 1.2, 0])
        self.say("곱셈을 해 보세요", "연습해 볼까요? 46 곱하기 2와 215 곱하기 4를 구해 보세요.")
        self.play(FadeIn(qs), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a1 = M(f"① 80 + 12 = {g('92')}", 50).move_to([0, -0.1, 0])
        a2 = M(f"② 800 + 40 + 20 = {g('860')}", 50).move_to([0, -1.0, 0])
        self.say(f"{g('92')}와 {g('860')}", "46 곱하기 2는 80 더하기 12로 92. 215 곱하기 4는 800, 40, 20을 더해 860이에요.")
        self.play(FadeIn(a1), FadeIn(a2), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
