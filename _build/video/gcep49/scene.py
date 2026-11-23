"""「수학 원리 돋보기」 개념 차근차근 49화 — 통분

분모가 다른 두 분수의 분모를 같게: 1/2과 1/3 → 3/6과 2/6 (공통분모 6)
방법 ① 두 분모의 곱 ② 최소공배수(더 간단) 5/6과 3/8 → 24 / 연습: 3/4과 5/6
최종: GRADE=c ./make_final.sh 49
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, Line, ReplacementTransform, SurroundingRectangle, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, M, T, b, g, o
from division import clear_stage
from conceptkit import ConceptScene, dot, dots, ten_frame, RED
from items import check_mark, cross_mark
from storykit import book, scroll, show_sources
from fraction import frac, frac_bar, row


class GcEp49(ConceptScene):
    EP_NO = 49
    EP_TITLE = "통분"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.why()
        self.two_ways()
        self.practice()
        self.closing(f"{o('통분')}: 크기가 같은 분수로 바꾸어 분모를 같게\n공통분모는 두 분모의 곱 또는 {g('최소공배수')}(더 간단)",
                     next_preview="개념 차근차근 50화 · 분모가 다른 분수의 크기 비교")
        self.wait(0.5)

    def why(self):
        self.section("분모를 같게")
        b1 = frac_bar(2, 1, width=6.0).move_to([0.8, 1.6, 0])
        b2 = frac_bar(3, 1, width=6.0, color=BLUE).move_to([0.8, 0.6, 0])
        l1, l2 = M("1/2", 44).next_to(b1, LEFT, buff=0.4), M("1/3", 44).next_to(b2, LEFT, buff=0.4)
        self.say("1/2과 1/3은 조각 크기가 달라요", "2분의 1과 3분의 1은 조각의 크기가 달라서 바로 비교하거나 더하기 어려워요.")
        self.play(FadeIn(b1), FadeIn(b2), FadeIn(l1), FadeIn(l2), run_time=0.7)
        c1 = frac_bar(6, 3, width=6.0).move_to(b1)
        c2 = frac_bar(6, 2, width=6.0, color=BLUE).move_to(b2)
        self.play(ReplacementTransform(b1, c1), ReplacementTransform(b2, c2), run_time=0.8)
        t = M(f"6칸으로 나누면 1/2 = {o('3/6')}, 1/3 = {b('2/6')}", 50).move_to([0, -0.6, 0])
        self.say(f"분모를 6으로 같게: {o('3/6')}, {b('2/6')}", "두 막대를 모두 6칸으로 나누면 2분의 1은 6분의 3, 3분의 1은 6분의 2. 분모가 같아졌어요. 이것을 통분이라고 해요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def two_ways(self):
        self.section("공통분모 찾기")
        e1 = M(f"① 두 분모의 곱: 5/6, 3/8 → 분모 {b('48')}: 40/48, 18/48", 46).move_to([0, 1.2, 0])
        e2 = M(f"② 최소공배수: 6과 8 → {g('24')}: 20/24, 9/24", 46).move_to([0, 0.1, 0])
        self.say("두 가지 방법", "공통분모는 두 분모를 곱해서 찾을 수도 있고, 두 분모의 최소공배수로 찾을 수도 있어요. 최소공배수를 쓰면 수가 더 작아서 간단해요.")
        self.play(FadeIn(e1), run_time=0.5)
        self.play(FadeIn(e2), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        q = M("3/4과 5/6을 최소공배수로 통분하세요", 52).move_to([0, 1.2, 0])
        self.say("3/4과 5/6을 통분", "연습해 볼까요? 4분의 3과 6분의 5를 최소공배수를 공통분모로 하여 통분해 보세요.")
        self.play(FadeIn(q), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a = M(f"4와 6의 최소공배수 12 → {g('9/12')}, {g('10/12')}", 56).move_to([0, -0.4, 0])
        self.say(f"{g('9/12')}, {g('10/12')}", "4와 6의 최소공배수는 12. 12분의 9와 12분의 10이에요.")
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
