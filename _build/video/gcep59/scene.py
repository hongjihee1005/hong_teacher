"""「수학 원리 돋보기」 개념 차근차근 59화 — (분수) ÷ (분수)

6/7 ÷ 2/7: 2/7이 몇 번 들어가나 → 6 ÷ 2 = 3 / 분모가 다르면 통분 3/4 ÷ 1/8 = 6/8 ÷ 1/8 = 6
뒤집어 곱하는 까닭: 3/4 ÷ 2/3 = 9/12 ÷ 8/12 = 9 ÷ 8 = 9/8, 그리고 3/4 × 3/2 = 9/8 / 연습 5/6 ÷ 1/3
최종: GRADE=c ./make_final.sh 59
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


class GcEp59(ConceptScene):
    EP_NO = 59
    EP_TITLE = "(분수) ÷ (분수)"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("몇 번 들어갈까?")
        bar = frac_bar(7, 6, width=7.0).move_to([0, 1.4, 0])
        for k in range(6):
            bar[k].set_fill([ORANGE, BLUE][(k // 2) % 2], 1)
        self.say("6/7 안에 2/7이 몇 번?", "7분의 6 안에 7분의 2가 몇 번 들어갈까요? 2칸씩 묶어 보면 3번.")
        self.play(FadeIn(bar), run_time=0.6)
        e = M(f"6/7 ÷ 2/7 = 6 ÷ 2 = {g('3')}", 60).move_to([0, 0.0, 0])
        self.say(f"분모가 같으면 분자끼리 나눠요: {g('3')}", "분모가 같으면 분자끼리 나누면 돼요. 6 나누기 2는 3.")
        self.play(FadeIn(e), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.5)
        self.step("분모가 다르면 통분", [(f"3/4 ÷ 1/8 = {o('6/8')} ÷ 1/8 = 6 ÷ 1 = {g('6')}", 54, 1.0)],
                  "통분해서 분자끼리", "분모가 다르면 통분해서 분자끼리 나눠요. 4분의 3은 8분의 6, 8분의 1이 6번 들어가요.")
        self.step("왜 뒤집어서 곱할까?", [(f"3/4 ÷ 2/3 = 9/12 ÷ 8/12 = 9 ÷ 8 = {g('9/8')}", 48, 1.5),
                  (f"3/4 × {o('3/2')} = {g('9/8')}  ← 같아요!", 52, 0.5),
                  ("나누는 분수의 분모와 분자를 바꾸어 곱하면 같은 답", 40, -0.5)],
                  "뒤집어 곱해도 같아요", "4분의 3 나누기 3분의 2를 통분해서 나누면 8분의 9. 그런데 3분의 2를 뒤집은 2분의 3을 곱해도 8분의 9. 그래서 분수의 나눗셈은 나누는 분수를 뒤집어 곱하면 돼요.")
        self.ask("5/6 ÷ 1/3", "5/6 ÷ 1/3", "연습해 볼까요? 6분의 5 나누기 3분의 1을 계산해 보세요.",
                 f"5/6 × 3/1 = 15/6 = {g('5/2')} = 2와 1/2", f"{g('2와 1/2')}", "뒤집어 곱하면 6분의 15, 약분하면 2분의 5, 2와 2분의 1이에요.")
        self.closing(f"(분수) ÷ (분수): 몇 번 들어가는지 → {o('통분')}해서 분자끼리\n또는 나누는 분수를 {g('뒤집어 곱하기')}",
                     next_preview="개념 차근차근 60화 · (소수) ÷ (자연수)")
        self.wait(0.5)
