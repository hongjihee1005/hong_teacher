"""「수학 원리 돋보기」 개념 차근차근 52화 — 분모가 다른 분수의 뺄셈

5/6 − 1/4 = 10/12 − 3/12 = 7/12 / 대분수 뺄셈 두 방법: 3과 1/4 − 1과 2/3 (자연수에서 1 받아내림 / 가분수로) → 1과 7/12
연습: 3/4 − 1/6
최종: GRADE=c ./make_final.sh 52
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


class GcEp52(ConceptScene):
    EP_NO = 52
    EP_TITLE = "분모가 다른 분수의 뺄셈"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.basic()
        self.mixed()
        self.practice()
        self.closing(f"{o('통분')}하고 분자끼리 빼요: 5/6 − 1/4 = {g('7/12')}\n대분수는 자연수에서 1을 받아내리거나 {b('가분수')}로 바꾸어 빼요",
                     next_preview="개념 차근차근 53화 · 분수와 소수의 관계")
        self.wait(0.5)

    def basic(self):
        self.section("통분해서 빼기")
        e = M(f"5/6 − 1/4 = {o('10/12')} − {b('3/12')} = {g('7/12')}", 60).move_to([0, 1.0, 0])
        self.say("5/6 − 1/4", "6분의 5 빼기 4분의 1. 6과 4의 최소공배수 12로 통분하면 12분의 10 빼기 12분의 3, 12분의 7이에요.")
        self.play(FadeIn(e), run_time=0.6)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def mixed(self):
        self.section("대분수의 뺄셈")
        q = M("3과 1/4 − 1과 2/3", 64).move_to([0, 2.0, 0])
        self.say("3과 1/4 − 1과 2/3", "3과 4분의 1 빼기 1과 3분의 2. 통분하면 3과 12분의 3 빼기 1과 12분의 8. 12분의 3에서 12분의 8을 뺄 수 없어요.")
        self.play(FadeIn(q), run_time=0.5)
        e1 = M(f"① 1 받아내림: 3과 3/12 = {o('2와 15/12')}\n→ 2와 15/12 − 1과 8/12 = {g('1과 7/12')}", 42).move_to([0, 0.7, 0])
        e2 = M(f"② 가분수로: 39/12 − 20/12 = 19/12 = {g('1과 7/12')}", 44).move_to([0, -0.8, 0])
        self.say("두 가지 방법", "첫째, 자연수 3에서 1을 받아내려 2와 12분의 15로 바꾸어 빼면 1과 12분의 7. 둘째, 둘 다 가분수로 바꾸어 빼도 같은 답이에요.")
        self.play(FadeIn(e1), run_time=0.5)
        self.play(FadeIn(e2), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        q = M("3/4 − 1/6", 84).move_to([0, 1.2, 0])
        self.say("3/4 − 1/6", "연습해 볼까요? 4분의 3 빼기 6분의 1을 계산해 보세요.")
        self.play(Write(q), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a = M(f"9/12 − 2/12 = {g('7/12')}", 64).move_to([0, -0.4, 0])
        self.say(f"{g('7/12')}", "12로 통분하면 12분의 9 빼기 12분의 2, 12분의 7이에요.")
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
