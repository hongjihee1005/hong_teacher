"""「수학 원리 돋보기」 개념 차근차근 72화 — 비례식

비의 성질: 전항·후항에 같은 수를 곱하거나 나누어도 비율이 같음 2 : 3 = 4 : 6 / 비례식, 외항·내항 / 외항의 곱 = 내항의 곱
□ 구하기 3 : 4 = □ : 12 → □ = 9 / 연습 5 : 2 = 15 : □
최종: GRADE=c ./make_final.sh 72
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


class GcEp72(ConceptScene):
    EP_NO = 72
    EP_TITLE = "비례식"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.step("비율이 같은 비", [(f"2 : 3 = {o('4 : 6')} = {o('6 : 9')}", 70, 1.4),
                  ("앞의 수(전항)와 뒤의 수(후항)에 같은 수를 곱해도 비율이 같아요 (2/3 = 4/6)", 36, 0.2)],
                  "비의 성질", "2 대 3의 앞과 뒤에 2를 곱하면 4 대 6, 3을 곱하면 6 대 9. 비율은 모두 3분의 2로 같아요.")
        self.section("비례식")
        e = M(f"{b('2')} : {o('3')} = {o('4')} : {b('6')}", 100).move_to([0, 1.4, 0])
        self.say("비율이 같은 두 비를 =로", "비율이 같은 두 비를 등호로 이은 식을 비례식이라고 해요.")
        self.play(Write(e), run_time=0.6)
        t1 = M(f"바깥쪽 {b('2, 6')}: 외항 · 안쪽 {o('3, 4')}: 내항", 44).move_to([0, 0.1, 0])
        t2 = M(f"외항의 곱 {b('2 × 6 = 12')} = 내항의 곱 {o('3 × 4 = 12')}", 46).move_to([0, -0.9, 0])
        self.say("외항의 곱 = 내항의 곱", "바깥쪽 두 수를 외항, 안쪽 두 수를 내항이라고 해요. 외항끼리 곱한 값과 내항끼리 곱한 값은 언제나 같아요.")
        self.play(FadeIn(t1), run_time=0.5)
        self.play(FadeIn(t2), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)
        self.step("□ 구하기", [("3 : 4 = □ : 12", 80, 1.5), (f"방법 ① 4 × 3 = 12 → 3 × 3 = {g('9')}", 46, 0.3),
                  (f"방법 ② 3 × 12 = 4 × □ → 36 = 4 × □ → □ = {g('9')}", 46, -0.7)],
                  "두 가지 방법", "3 대 4는 네모 대 12. 후항 4에 3을 곱해 12가 되었으니 전항도 3에 3을 곱해 9. 외항의 곱과 내항의 곱이 같다는 성질로도 9를 구할 수 있어요.")
        self.ask("5 : 2 = 15 : □", "□는?", "연습해 볼까요? 5 대 2는 15 대 네모. 네모에 알맞은 수는?",
                 f"5 × 3 = 15 → 2 × 3 = {g('6')}", f"{g('6')}", "전항 5에 3을 곱해 15가 되었으니 후항도 2에 3을 곱해 6이에요.")
        self.closing(f"비율이 같은 두 비를 = 로 이은 식: {o('비례식')}\n{b('외항의 곱')} = {o('내항의 곱')}",
                     next_preview="개념 차근차근 73화 · 비례배분")
        self.wait(0.5)
