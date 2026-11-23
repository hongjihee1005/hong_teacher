"""「수학 원리 돋보기」 개념 차근차근 33화 — 분모가 같은 분수의 크기 비교

3/5와 4/5: 1/5이 몇 개인지로 비교 → 분자가 큰 쪽이 큼 / 수직선 / 단위분수끼리는 분모가 작을수록 큼(1/3 > 1/5)
연습: 5/8 ○ 7/8, 1/4 ○ 1/6
최종: GRADE=c ./make_final.sh 33
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


class GcEp33(ConceptScene):
    EP_NO = 33
    EP_TITLE = "분모가 같은 분수의 크기 비교"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.same_den()
        self.unit()
        self.practice()
        self.closing(f"분모가 같으면 {o('분자')}가 큰 쪽이 커요: 4/5 &gt; 3/5\n단위분수는 {b('분모')}가 작을수록 커요: 1/3 &gt; 1/5",
                     next_preview="개념 차근차근 34화 · 분모가 같은 분수의 덧셈·뺄셈")
        self.wait(0.5)

    def same_den(self):
        self.section("분모가 같을 때")
        b1 = frac_bar(5, 3, width=6.0).move_to([0.6, 1.6, 0])
        b2 = frac_bar(5, 4, width=6.0, color=BLUE).move_to([0.6, -0.1, 0])
        l1 = frac(3, 5, 44, cn=ORANGE).next_to(b1, LEFT, buff=0.5)
        l2 = frac(4, 5, 44, cn=BLUE).next_to(b2, LEFT, buff=0.5)
        self.say("3/5와 4/5, 어느 쪽이 클까요?", "5분의 3과 5분의 4. 어느 쪽이 더 클까요? 같은 막대를 5칸으로 나누어 색칠했어요.")
        self.play(FadeIn(b1), FadeIn(l1), FadeIn(b2), FadeIn(l2), run_time=0.8)
        t = M(f"1/5이 {o('3개')} vs 1/5이 {b('4개')} → 4/5가 더 커요", 46).move_to([0, -1.6, 0])
        self.say(f"1/5이 몇 개인지로 비교", "둘 다 5분의 1이 몇 개인지 세어 보면, 3개와 4개. 그래서 5분의 4가 더 커요. 분모가 같으면 분자가 큰 쪽이 커요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def unit(self):
        self.section("단위분수끼리")
        b1 = frac_bar(3, 1, width=6.0).move_to([0.6, 1.6, 0])
        b2 = frac_bar(5, 1, width=6.0, color=BLUE).move_to([0.6, -0.1, 0])
        l1 = frac(1, 3, 44, cd=ORANGE).next_to(b1, LEFT, buff=0.5)
        l2 = frac(1, 5, 44, cd=BLUE).next_to(b2, LEFT, buff=0.5)
        self.say("1/3과 1/5은?", "3분의 1과 5분의 1은 어떨까요? 분자가 1인 단위분수예요.")
        self.play(FadeIn(b1), FadeIn(l1), FadeIn(b2), FadeIn(l2), run_time=0.8)
        t = M(f"똑같이 {b('많이')} 나눌수록 한 조각은 {o('작아져요')} → 1/3 &gt; 1/5", 44).move_to([0, -1.6, 0])
        self.say("많이 나눌수록 한 조각은 작아요", "같은 막대를 3칸과 5칸으로 나누면, 많이 나눌수록 한 조각이 작아져요. 그래서 3분의 1이 5분의 1보다 커요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        qs = VGroup(M("① 5/8 ○ 7/8", 64), M("② 1/4 ○ 1/6", 64)).arrange(RIGHT, buff=1.6).move_to([0, 1.2, 0])
        self.say("크기를 비교해 보세요", "연습해 볼까요? 동그라미 안에 큰 쪽 기호와 작은 쪽 기호 중 알맞은 것을 넣어 보세요.")
        self.play(FadeIn(qs), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a = M(f"① 5/8 {g('&lt;')} 7/8   ② 1/4 {g('&gt;')} 1/6", 60).move_to([0, -0.4, 0])
        self.say("5/8가 작고, 1/4이 커요", "1번은 분모가 같으니 분자가 작은 8분의 5가 더 작아요. 2번은 단위분수라 분모가 작은 4분의 1이 더 커요.")
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
