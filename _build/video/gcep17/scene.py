"""「수학 원리 돋보기」 개념 차근차근 17화 — 두 자리 수 뺄셈 세로셈

일의 자리에서 뺄 수 없으면 십의 자리에서 10을 받아내림: 52 − 27 = 25 (addsub.sub_vertical) / 수 모형으로 까닭
연습: 63 − 38 = 25
최종: GRADE=c ./make_final.sh 17
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
from addsub import sub_vertical
from base10 import number_blocks


class GcEp17(ConceptScene):
    EP_NO = 17
    EP_TITLE = "두 자리 수 뺄셈 세로셈"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.why()
        self.section("받아내림이 있는 뺄셈")
        self.say("52 − 27을 세로셈으로", "52 빼기 27을 세로셈으로 계산해 볼까요?")
        sub_vertical(self, 52, 27)
        self.settle()
        clear_stage(self, 0.5)
        self.practice()
        self.closing(f"일의 자리에서 뺄 수 없으면\n십의 자리에서 {g('10을 받아내려요')} (십의 자리는 1 작아져요)",
                     next_preview="개념 차근차근 18화 · 덧셈과 뺄셈은 가족, □ 구하기")
        self.wait(0.5)

    def why(self):
        self.section("왜 받아내릴까?")
        bl = number_blocks(52, size=0.22).move_to([-2.6, 0.8, 0])
        self.say("52에서 일 모형 7개를 빼려면?", "52는 십 모형 5개와 일 모형 2개. 일 모형 7개를 빼려는데 2개뿐이에요.")
        self.play(FadeIn(bl, lag_ratio=0.1), run_time=0.8)
        t = M(f"십 모형 1개를 {o('일 모형 10개')}로 바꾸면\n일 모형 12개 → 7개를 뺄 수 있어요", 40).move_to([2.8, 0.8, 0])
        self.say(f"십 모형 1개를 {o('일 모형 10개')}로", "그래서 십 모형 하나를 일 모형 10개로 바꾸어요. 그러면 일 모형이 12개가 되어 7개를 뺄 수 있어요. 이것이 받아내림이에요.")
        self.play(FadeIn(t), Indicate(bl[1][-1], color=ORANGE), run_time=0.8)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        q = M("63 − 38", 90).move_to([0, 1.2, 0])
        self.say("63 − 38을 세로셈으로", "연습해 볼까요? 63 빼기 38을 세로셈으로 계산해 보세요.")
        self.play(Write(q), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a = M(f"일: 13 − 8 = 5 (받아내림) · 십: 5 − 3 = 2 → {g('25')}", 40).move_to([0, -0.4, 0])
        self.say(f"{g('25')}", "일의 자리 3에서 8을 뺄 수 없어 받아내리면 13 빼기 8은 5. 십의 자리는 5 빼기 3은 2. 답은 25예요.")
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
