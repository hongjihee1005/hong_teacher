"""「수학 원리 돋보기」 개념 차근차근 34화 — 분모가 같은 분수의 덧셈·뺄셈

2/7 + 3/7: 1/7이 2개 + 3개 = 5개 → 5/7 (분모는 그대로! 2/7 + 3/7 ≠ 5/14) / 3/5 + 4/5 = 7/5 = 1과 2/5
뺄셈 6/8 − 2/8 = 4/8 / 연습: 4/9 + 3/9, 7/10 − 4/10
최종: GRADE=c ./make_final.sh 34
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


class GcEp34(ConceptScene):
    EP_NO = 34
    EP_TITLE = "분모가 같은 분수의 덧셈·뺄셈"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.add_part()
        self.trap()
        self.over()
        self.sub_part()
        self.practice()
        self.closing(f"분모가 같으면 {o('분자끼리')} 더하고 빼요, {b('분모는 그대로')}\n2/7 + 3/7 = {g('5/7')}",
                     next_preview="개념 차근차근 35화 · 소수는 언제 생겼을까? 0.1")
        self.wait(0.5)

    def add_part(self):
        self.section("분모가 같은 덧셈")
        b1 = frac_bar(7, 0, width=7.0).move_to([0, 1.2, 0])
        for k in range(2):
            b1[k].set_fill(ORANGE, 1)
        for k in range(2, 5):
            b1[k].set_fill(BLUE, 1)
        self.say("2/7과 3/7을 더하면?", "7분의 2와 7분의 3을 더해 볼까요? 막대에 주황 2칸, 파랑 3칸을 칠했어요.")
        self.play(FadeIn(b1), run_time=0.6)
        e = M(f"1/7이 {o('2개')} + {b('3개')} = {g('5개')} → 2/7 + 3/7 = {g('5/7')}", 48).move_to([0, -0.2, 0])
        self.say(f"1/7이 5개, {g('5/7')}", "7분의 1이 2개와 3개, 모두 5개. 그래서 7분의 5예요. 분자끼리만 더하고 분모는 그대로 써요.")
        self.play(FadeIn(e), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def trap(self):
        self.section("이렇게 하면 안 돼요")
        w = M(f"2/7 + 3/7 = 5/14 ?  {o('틀려요')}", 56).move_to([0, 1.0, 0])
        t = M("분모까지 더하면 조각의 크기가 바뀌어요\n7칸짜리 막대가 14칸이 되는 게 아니에요", 40).move_to([0, -0.4, 0])
        self.say("분모까지 더하면 틀려요", "분모까지 더해서 14분의 5라고 하면 틀려요. 분모는 몇 칸으로 나누었는지를 나타내서, 더해도 바뀌지 않아요.")
        self.play(FadeIn(w), FadeIn(t), run_time=0.6)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def over(self):
        self.section("1보다 커지면")
        e = M(f"3/5 + 4/5 = {o('7/5')} = {g('1과 2/5')}", 64).move_to([0, 1.0, 0])
        self.say("합이 1보다 크면 대분수로", "5분의 3 더하기 5분의 4는 5분의 7. 1보다 크니 대분수로 1과 5분의 2라고도 나타내요.")
        self.play(FadeIn(e), run_time=0.6)
        t = M("(가분수와 대분수: 분수 특별편 9~11화)", 32, SOFT).move_to([0, -0.2, 0])
        self.play(FadeIn(t), run_time=0.3)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.5)

    def sub_part(self):
        self.section("분모가 같은 뺄셈")
        b1 = frac_bar(8, 6, width=7.0).move_to([0, 1.2, 0])
        xs = VGroup(*[cross_mark(0.3).move_to(b1[k]) for k in (4, 5)])
        self.say("6/8에서 2/8을 빼면?", "8분의 6에서 8분의 2를 빼 볼까요?")
        self.play(FadeIn(b1), run_time=0.5)
        self.play(Create(xs), run_time=0.5)
        e = M(f"6/8 − 2/8 = {g('4/8')}", 64).move_to([0, -0.2, 0])
        self.say(f"{g('4/8')}", "8분의 1이 6개에서 2개를 빼면 4개. 8분의 4예요.")
        self.play(FadeIn(e), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        qs = VGroup(M("① 4/9 + 3/9", 64), M("② 7/10 − 4/10", 64)).arrange(RIGHT, buff=1.4).move_to([0, 1.2, 0])
        self.say("계산해 보세요", "연습해 볼까요? 두 문제를 계산해 보세요.")
        self.play(FadeIn(qs), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a = M(f"① {g('7/9')}    ② {g('3/10')}", 64).move_to([0, -0.4, 0])
        self.say(f"{g('7/9')}, {g('3/10')}", "9분의 4 더하기 9분의 3은 9분의 7, 10분의 7 빼기 10분의 4는 10분의 3이에요.")
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
