"""「수학 원리 돋보기」 개념 차근차근 42화 — 배수

3의 배수: 3을 1배, 2배, 3배 … 한 수 3, 6, 9, 12 … (끝이 없음) / 수직선 뛰어 세기 / 곱셈구구의 단과 같음
연습: 7의 배수를 작은 수부터 5개
최종: GRADE=c ./make_final.sh 42
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
from conceptkit import jumps, number_line


class GcEp42(ConceptScene):
    EP_NO = 42
    EP_TITLE = "배수"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.meaning()
        self.practice()
        self.closing(f"어떤 수를 1배, 2배, 3배 … 한 수가 그 수의 {g('배수')}\n3의 배수: 3, 6, 9, 12 … {o('끝이 없어요')}",
                     next_preview="개념 차근차근 43화 · 약수와 배수의 관계")
        self.wait(0.5)

    def meaning(self):
        self.section("배수란?")
        nl = number_line(24, y=0.9, label_every=3, size=26)
        self.say("3씩 뛰어 세면", "수직선에서 0부터 3씩 뛰어 세어 볼까요? 3, 6, 9, 12, 15, 18, 21, 24.")
        self.play(FadeIn(nl), run_time=0.5)
        jumps(self, nl, 3, 8, color=BLUE, run_each=0.3)
        t1 = M(f"3 × 1, 3 × 2, 3 × 3 … → {g('3의 배수')}", 48).move_to([0, -0.8, 0])
        self.say(f"{g('3의 배수')}", "3을 1배, 2배, 3배 한 수를 3의 배수라고 해요. 곱셈구구 3단의 곱과 같아요.")
        self.play(FadeIn(t1), run_time=0.5)
        t2 = M(f"배수는 {o('끝없이')} 이어져요 (가장 큰 배수는 없어요)", 42).move_to([0, -1.7, 0])
        self.say(f"배수는 {o('끝이 없어요')}", "배수는 끝없이 계속 이어져요. 가장 큰 배수는 없어요.")
        self.play(FadeIn(t2), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        q = M("7의 배수를 작은 수부터 5개 쓰세요", 52).move_to([0, 1.2, 0])
        self.say("7의 배수 5개", "연습해 볼까요? 7의 배수를 작은 수부터 5개 써 보세요.")
        self.play(FadeIn(q), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a = M(f"{g('7, 14, 21, 28, 35')}", 70).move_to([0, -0.4, 0])
        self.say(f"{g('7, 14, 21, 28, 35')}", "7, 14, 21, 28, 35예요.")
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
