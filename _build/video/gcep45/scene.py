"""「수학 원리 돋보기」 개념 차근차근 45화 — 공배수와 최소공배수

4의 배수·6의 배수 → 겹치는 것 12, 24, 36 …(공배수), 가장 작은 12(최소공배수) / 공배수는 최소공배수의 배수
나누어 구하기: 2 ) 4 6 → 2 3 → 2 × 2 × 3 = 12 / 생활: 4분·6분마다 오는 버스가 같이 떠난 뒤 다시 함께 → 12분 뒤
연습: 6과 8
최종: GRADE=c ./make_final.sh 45
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
from conceptkit import number_line


class GcEp45(ConceptScene):
    EP_NO = 45
    EP_TITLE = "공배수와 최소공배수"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.common()
        self.divide()
        self.bus()
        self.practice()
        self.closing(f"두 수의 공통인 배수 = {b('공배수')}, 그중 가장 작은 수 = {g('최소공배수')}\n4와 6 → 공배수 12, 24, 36 … · 최소공배수 {g('12')}",
                     next_preview="개념 차근차근 46화 · 소수(素數)는 무엇일까?")
        self.wait(0.5)

    def common(self):
        self.section("두 수의 배수에서 겹치는 것")
        nl = number_line(24, y=0.6, label_every=2, size=24)
        self.say("4의 배수와 6의 배수", "수직선에 4의 배수는 파란색, 6의 배수는 주황색으로 표시해 볼까요?")
        self.play(FadeIn(nl), run_time=0.5)
        m4 = VGroup(*[dot(BLUE, 0.14).move_to([nl.x(v), 0.95, 0]) for v in range(4, 25, 4)])
        m6 = VGroup(*[dot(ORANGE, 0.14).move_to([nl.x(v), 1.3, 0]) for v in range(6, 25, 6)])
        self.play(FadeIn(m4, lag_ratio=0.1), run_time=0.7)
        self.play(FadeIn(m6, lag_ratio=0.1), run_time=0.6)
        t = M(f"함께 표시된 수 12, 24 … = {b('공배수')}, 가장 작은 {g('12')} = {g('최소공배수')}", 42).move_to([0, -1.0, 0])
        self.say(f"가장 작은 공배수 {g('12')}", "두 색이 함께 있는 12, 24가 공배수, 가장 작은 12가 최소공배수예요. 공배수는 12의 배수예요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def divide(self):
        self.section("나누어 구하기")
        rows = VGroup(M(f"{o('2')} ) 4   6", 60), M("      2   3", 60)).arrange(DOWN, buff=0.25, aligned_edge=LEFT).move_to([-2.6, 0.6, 0])
        self.say("함께 나누고 남은 수까지 곱해요", "4와 6을 2로 나누면 2와 3. 최소공배수는 왼쪽 수와 아래에 남은 수를 모두 곱해요.")
        self.play(FadeIn(rows, lag_ratio=0.4), run_time=0.8)
        t = M(f"{o('2')} × 2 × 3 = {g('12')}", 60).move_to([2.8, 0.6, 0])
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def bus(self):
        self.section("생활 속 최소공배수")
        t = M("4분마다 오는 버스와 6분마다 오는 버스가\n9시에 함께 떠났어요. 다음에 함께 떠나는 때는?", 42).move_to([0, 1.3, 0])
        a = M(f"4와 6의 최소공배수 12 → {g('9시 12분')}", 52).move_to([0, -0.3, 0])
        self.say(f"{g('9시 12분')}", "4분마다와 6분마다가 다시 만나는 때는 4와 6의 최소공배수, 12분 뒤. 9시 12분이에요.")
        self.play(FadeIn(t), run_time=0.5)
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        q = M("6과 8의 최소공배수는?", 60).move_to([0, 1.2, 0])
        self.say("6과 8의 최소공배수는?", "연습해 볼까요? 6과 8의 최소공배수를 구해 보세요.")
        self.play(FadeIn(q), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a = M(f"2 ) 6 8 → 3, 4 → 2 × 3 × 4 = {g('24')}", 52).move_to([0, -0.4, 0])
        self.say(f"{g('24')}", "2로 나누면 3과 4. 2 곱하기 3 곱하기 4, 최소공배수는 24예요.")
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
