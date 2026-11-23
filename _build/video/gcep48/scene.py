"""「수학 원리 돋보기」 개념 차근차근 48화 — 약분과 기약분수

약분: 분모와 분자를 공약수로 나누어 간단히(12/18 → 6/9 → 2/3) / 최대공약수로 한 번에 / 기약분수: 분모와 분자의 공약수가 1뿐
연습: 16/24 기약분수로
최종: GRADE=c ./make_final.sh 48
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


class GcEp48(ConceptScene):
    EP_NO = 48
    EP_TITLE = "약분과 기약분수"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.reduce()
        self.irr()
        self.practice()
        self.closing(f"{o('약분')}: 분모와 분자를 공약수로 나누어 간단히\n{g('기약분수')}: 더는 약분할 수 없는 분수 (최대공약수로 한 번에)",
                     next_preview="개념 차근차근 49화 · 통분")
        self.wait(0.5)

    def reduce(self):
        self.section("약분")
        e1 = M(f"12/18 → ÷{o('2')} → 6/9 → ÷{o('3')} → {g('2/3')}", 60).move_to([0, 1.3, 0])
        self.say("공약수로 나누어 간단히", "18분의 12의 분모와 분자를 공약수 2로 나누면 9분의 6, 다시 3으로 나누면 3분의 2. 이렇게 간단히 하는 것을 약분이라고 해요.")
        self.play(FadeIn(e1), run_time=0.6)
        e2 = M(f"최대공약수 {b('6')}으로 한 번에: 12/18 = {g('2/3')}", 52).move_to([0, 0.1, 0])
        self.say(f"최대공약수로 {b('한 번에')}", "12와 18의 최대공약수 6으로 나누면 한 번에 3분의 2가 돼요.")
        self.play(FadeIn(e2), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def irr(self):
        self.section("기약분수")
        e = M(f"{g('2/3')}: 2와 3의 공약수는 1뿐 → {g('기약분수')}", 54).move_to([0, 1.0, 0])
        self.say(f"더는 약분할 수 없는 {g('기약분수')}", "3분의 2는 분모와 분자의 공약수가 1뿐이라 더는 약분할 수 없어요. 이런 분수를 기약분수라고 해요.")
        self.play(FadeIn(e), run_time=0.6)
        t = M("크기는 같고 가장 간단한 모양이에요", 42, SOFT).move_to([0, -0.2, 0])
        self.play(FadeIn(t), run_time=0.4)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        q = M("16/24를 기약분수로", 70).move_to([0, 1.2, 0])
        self.say("16/24를 기약분수로", "연습해 볼까요? 24분의 16을 기약분수로 나타내 보세요.")
        self.play(FadeIn(q), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a = M(f"최대공약수 8로 나누어 {g('2/3')}", 60).move_to([0, -0.4, 0])
        self.say(f"{g('2/3')}", "16과 24의 최대공약수 8로 나누면 3분의 2예요.")
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
