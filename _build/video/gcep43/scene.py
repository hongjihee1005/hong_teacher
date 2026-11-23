"""「수학 원리 돋보기」 개념 차근차근 43화 — 약수와 배수의 관계

12 = 3 × 4 → 3과 4는 12의 약수, 12는 3과 4의 배수 / 배열 그림 / 연습: 5 × 8 = 40에서 관계 말하기
최종: GRADE=c ./make_final.sh 43
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
from prepkit import grid_items


class GcEp43(ConceptScene):
    EP_NO = 43
    EP_TITLE = "약수와 배수의 관계"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.rel()
        self.practice()
        self.closing(f"12 = 3 × 4 → {b('3')}과 {o('4')}는 12의 {g('약수')}\n12는 3과 4의 {g('배수')}",
                     next_preview="개념 차근차근 44화 · 공약수와 최대공약수")
        self.wait(0.5)

    def rel(self):
        self.section("하나의 곱셈식, 두 가지 말")
        gi = grid_items(3, 4, ORANGE, step=0.55, r=0.2, center=(-3.4, 0.8, 0))
        e = M(f"{g('12')} = {b('3')} × {o('4')}", 80).move_to([2.4, 1.2, 0])
        self.say("12 = 3 × 4", "구슬 12개를 3줄에 4개씩 놓았어요. 12는 3 곱하기 4.")
        self.play(FadeIn(gi), Write(e), run_time=0.8)
        t1 = M(f"{b('3')}과 {o('4')}는 12의 {g('약수')}", 50).move_to([2.4, 0.0, 0])
        t2 = M(f"12는 {b('3')}과 {o('4')}의 {g('배수')}", 50).move_to([2.4, -0.9, 0])
        self.say("약수이면서 배수", "그래서 3과 4는 12의 약수이고, 12는 3의 배수이면서 4의 배수예요. 하나의 곱셈식을 두 가지로 말할 수 있어요.")
        self.play(FadeIn(t1), run_time=0.5)
        self.play(FadeIn(t2), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        q = M("5 × 8 = 40 에서 약수와 배수의 관계를 말해 보세요", 44).move_to([0, 1.2, 0])
        self.say("약수와 배수로 말해요", "연습해 볼까요? 5 곱하기 8은 40. 약수와 배수의 관계를 말해 보세요.")
        self.play(FadeIn(q), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a = M(f"5와 8은 40의 {g('약수')}, 40은 5와 8의 {g('배수')}", 52).move_to([0, -0.4, 0])
        self.say("5와 8은 40의 약수, 40은 5와 8의 배수", "5와 8은 40의 약수이고, 40은 5와 8의 배수예요.")
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
