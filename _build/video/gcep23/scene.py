"""「수학 원리 돋보기」 개념 차근차근 23화 — 3·6단, 4·8단

3단 표 옆에 6단: 6단의 곱은 3단의 곱의 2배(3 × 4 = 12 → 6 × 4 = 24) — 배열 그림으로 / 4단 → 8단도 2배
연습: 6 × 7(3 × 7 = 21의 2배 42), 8 × 6(4 × 6 = 24의 2배 48)
최종: GRADE=c ./make_final.sh 23
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
from conceptkit import table_rows
from prepkit import grid_items


class GcEp23(ConceptScene):
    EP_NO = 23
    EP_TITLE = "3·6단, 4·8단"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.pair(3, 6)
        self.why()
        self.pair(4, 8)
        self.practice()
        self.closing(f"{o('6단')}은 {b('3단')}의 2배, {o('8단')}은 {b('4단')}의 2배\n6 × 4 = (3 × 4)의 2배 = {g('24')}",
                     next_preview="개념 차근차근 24화 · 7·9단, 1단과 0의 곱")
        self.wait(0.5)

    def pair(self, a, c):
        self.section(f"{a}단과 {c}단")
        r1 = table_rows(a, 9, 36, BLUE).move_to([-3.0, 0.4, 0])
        r2 = table_rows(c, 9, 36, ORANGE).move_to([2.6, 0.4, 0])
        self.say(f"{a}단과 {c}단을 나란히", f"{a}단과 {c}단을 나란히 놓아 볼까요?")
        self.play(FadeIn(r1, lag_ratio=0.05), run_time=0.8)
        self.play(FadeIn(r2, lag_ratio=0.05), run_time=0.8)
        arrows = M("→ 2배 →", 34, GREEN).move_to([-0.3, 0.4, 0])
        self.say(f"곱이 모두 {g('2배')}", f"{c}단의 곱은 {a}단의 곱의 2배예요. {a} 곱하기 4는 {a * 4}, {c} 곱하기 4는 {c * 4}.")
        self.play(FadeIn(arrows), Indicate(r1[3], color=GREEN), Indicate(r2[3], color=GREEN), run_time=0.8)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def why(self):
        self.section("왜 2배일까?")
        g1 = grid_items(4, 3, BLUE, step=0.5, r=0.18, center=(-3.0, 0.6, 0))
        g2 = grid_items(4, 6, ORANGE, step=0.5, r=0.18, center=(2.4, 0.6, 0))
        self.say("3개씩 4줄, 6개씩 4줄", "3개씩 4줄과 6개씩 4줄을 볼까요? 6개씩은 3개씩을 두 번 붙인 것과 같아요.")
        self.play(FadeIn(g1), FadeIn(g2), run_time=0.7)
        l1 = M("3 × 4 = 12", 44).next_to(g1, DOWN, buff=0.4)
        l2 = M(f"6 × 4 = 12 + 12 = {g('24')}", 44).next_to(g2, DOWN, buff=0.4)
        self.play(FadeIn(l1), FadeIn(l2), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        qs = VGroup(M("① 6 × 7", 70), M("② 8 × 6", 70)).arrange(RIGHT, buff=2.2).move_to([0, 1.2, 0])
        self.say("2배를 이용해 구해요", "연습해 볼까요? 2배를 이용해 6 곱하기 7과 8 곱하기 6을 구해 보세요.")
        self.play(FadeIn(qs), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a1 = M(f"① 3 × 7 = 21의 2배 → {g('42')}", 50).move_to([0, -0.1, 0])
        a2 = M(f"② 4 × 6 = 24의 2배 → {g('48')}", 50).move_to([0, -1.0, 0])
        self.say(f"{g('42')}와 {g('48')}", "6 곱하기 7은 3 곱하기 7, 21의 2배라서 42. 8 곱하기 6은 4 곱하기 6, 24의 2배라서 48이에요.")
        self.play(FadeIn(a1), FadeIn(a2), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
