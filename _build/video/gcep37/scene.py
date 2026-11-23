"""「수학 원리 돋보기」 개념 차근차근 37화 — 소수의 크기 비교

0.5와 0.45: 자릿수가 많다고 큰 게 아님 → 0.5 = 0.50, 0.01이 50개 vs 45개 / 모눈 그림 / 높은 자리부터 비교
소수 끝의 0은 써도 안 써도 같음(0.3 = 0.30) / 연습: 1.08 ○ 1.8, 2.35 ○ 2.351
최종: GRADE=c ./make_final.sh 37
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
from decimal4 import dec_markup, dec_vertical, grid100


class GcEp37(ConceptScene):
    EP_NO = 37
    EP_TITLE = "소수의 크기 비교"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.trap()
        self.rule()
        self.practice()
        self.closing(f"자리를 맞추고 {g('높은 자리부터')} 비교해요\n0.5 = {o('0.50')} &gt; 0.45 (숫자가 많다고 큰 게 아니에요)",
                     next_preview="개념 차근차근 38화 · 소수의 덧셈")
        self.wait(0.5)

    def trap(self):
        self.section("0.5와 0.45")
        g1 = grid100(50, size=2.5).move_to([-3.2, 1.0, 0])
        g2 = grid100(45, size=2.5, color=BLUE).move_to([3.2, 1.0, 0])
        l1 = M("0.5", 50).next_to(g1, DOWN, buff=0.25)
        l2 = M("0.45", 50).next_to(g2, DOWN, buff=0.25)
        self.say("0.5와 0.45, 어느 쪽이 클까요?", "0.5와 0.45. 0.45는 숫자가 더 많으니 더 클까요? 모눈에 칠해 볼게요.")
        self.play(FadeIn(g1), FadeIn(g2), FadeIn(l1), FadeIn(l2), run_time=0.9)
        t = M(f"0.5 = {o('0.50')} → 50칸 &gt; 45칸 → {g('0.5가 더 커요')}", 46).move_to([0, -1.95, 0])
        self.say(f"{g('0.5가 더 커요')}", "0.5는 0.50과 같아서 50칸, 0.45는 45칸. 0.5가 더 커요. 숫자가 많다고 큰 게 아니에요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def rule(self):
        self.section("높은 자리부터")
        a = M(dec_markup("3.62"), 90).move_to([-2.2, 1.0, 0])
        c = M(dec_markup("3.58"), 90).move_to([2.2, 1.0, 0])
        self.say("3.62와 3.58", "3.62와 3.58. 소수점을 맞추고 높은 자리부터 비교해요.")
        self.play(FadeIn(a), FadeIn(c), run_time=0.5)
        t = M(f"일의 자리 3 = 3 → 소수 첫째 자리 {o('6 &gt; 5')} → 3.62 &gt; 3.58", 44).move_to([0, -0.4, 0])
        self.say("소수 첫째 자리에서 결정", "일의 자리는 3으로 같고, 소수 첫째 자리 6이 5보다 커요. 그래서 3.62가 더 커요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        qs = VGroup(M("① 1.08 ○ 1.8", 60), M("② 2.35 ○ 2.351", 60)).arrange(RIGHT, buff=1.4).move_to([0, 1.2, 0])
        self.say("크기를 비교해요", "연습해 볼까요? 두 소수의 크기를 비교해 보세요.")
        self.play(FadeIn(qs), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a = M(f"① 1.08 {g('&lt;')} 1.80   ② 2.350 {g('&lt;')} 2.351", 56).move_to([0, -0.4, 0])
        self.say("둘 다 오른쪽이 커요", "1.8은 1.80이라 소수 첫째 자리 8이 0보다 커서 1.8이 더 커요. 2.35는 2.350이라 2.351이 더 커요.")
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
