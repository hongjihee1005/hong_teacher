"""「수학 원리 돋보기」 개념 차근차근 53화 — 분수와 소수의 관계

분모가 10, 100인 분수는 소수로 바로: 3/10 = 0.3, 27/100 = 0.27 / 1/2 = 5/10 = 0.5, 3/4 = 75/100 = 0.75, 2/5 = 0.4
소수 → 분수 0.6 = 6/10 = 3/5 / 크기 비교 2/5 ○ 0.3 / 연습
최종: GRADE=c ./make_final.sh 53
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
from decimal4 import grid100


class GcEp53(ConceptScene):
    EP_NO = 53
    EP_TITLE = "분수와 소수의 관계"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.ten()
        self.convert()
        self.compare()
        self.practice()
        self.closing(f"분모를 {o('10, 100')}으로 바꾸면 소수로: 3/4 = 75/100 = {g('0.75')}\n소수는 분모 10, 100인 분수로: 0.6 = 6/10 = {g('3/5')}",
                     next_preview="개념 차근차근 54화 · (분수) × (자연수)")
        self.wait(0.5)

    def ten(self):
        self.section("분모가 10, 100이면")
        g_ = grid100(27, size=3.0).move_to([-3.4, 0.5, 0])
        e1 = M(f"3/10 = {g('0.3')}", 56).move_to([2.6, 1.2, 0])
        e2 = M(f"27/100 = {g('0.27')}", 56).move_to([2.6, 0.0, 0])
        self.say("분모가 10, 100이면 바로 소수로", "분모가 10이나 100인 분수는 바로 소수로 쓸 수 있어요. 10분의 3은 0.3, 100분의 27은 0.27.")
        self.play(FadeIn(g_), FadeIn(e1), FadeIn(e2), run_time=0.8)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def convert(self):
        self.section("분모를 10, 100으로 바꾸기")
        rows = VGroup(M(f"1/2 = {o('5/10')} = {g('0.5')}", 54), M(f"2/5 = {o('4/10')} = {g('0.4')}", 54), M(f"3/4 = {o('75/100')} = {g('0.75')}", 54)).arrange(DOWN, buff=0.35).move_to([0, 1.0, 0])
        self.say("크기가 같은 분수로 바꾸어", "분모를 10이나 100으로 바꾸면 소수가 돼요. 2분의 1은 10분의 5, 0.5. 5분의 2는 10분의 4, 0.4. 4분의 3은 100분의 75, 0.75.")
        self.play(FadeIn(rows, lag_ratio=0.3), run_time=1.0)
        t = M(f"거꾸로: 0.6 = 6/10 = {g('3/5')}", 50).move_to([0, -1.2, 0])
        self.say("소수를 분수로", "거꾸로 0.6은 10분의 6, 약분하면 5분의 3이에요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def compare(self):
        self.section("분수와 소수의 크기 비교")
        e = M(f"2/5 ○ 0.3 → 0.4 {g('&gt;')} 0.3 → 2/5가 더 커요", 54).move_to([0, 0.9, 0])
        self.say("한쪽으로 바꾸어 비교", "5분의 2와 0.3은 한쪽으로 바꾸어 비교해요. 5분의 2는 0.4라서 0.3보다 커요.")
        self.play(FadeIn(e), run_time=0.6)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        qs = VGroup(M("① 3/5을 소수로", 56), M("② 0.25를 기약분수로", 56)).arrange(RIGHT, buff=1.2).move_to([0, 1.2, 0])
        self.say("바꾸어 보세요", "연습해 볼까요? 5분의 3을 소수로, 0.25를 기약분수로 바꾸어 보세요.")
        self.play(FadeIn(qs), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a = M(f"① 6/10 = {g('0.6')}   ② 25/100 = {g('1/4')}", 60).move_to([0, -0.4, 0])
        self.say(f"{g('0.6')}, {g('1/4')}", "5분의 3은 10분의 6, 0.6. 0.25는 100분의 25, 약분하면 4분의 1이에요.")
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
