"""「수학 원리 돋보기」 개념 차근차근 50화 — 분모가 다른 분수의 크기 비교

2/3 ○ 3/4 → 통분 8/12 < 9/12 / 막대 그림 / 분자가 같으면 분모가 작은 쪽이 큼(3/5 > 3/7) / 연습: 5/6 ○ 7/9
최종: GRADE=c ./make_final.sh 50
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


class GcEp50(ConceptScene):
    EP_NO = 50
    EP_TITLE = "분모가 다른 분수의 크기 비교"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.common()
        self.num_same()
        self.practice()
        self.closing(f"분모가 다르면 {o('통분')}해서 분자를 비교해요\n2/3 = 8/12 &lt; 9/12 = 3/4",
                     next_preview="개념 차근차근 51화 · 분모가 다른 분수의 덧셈")
        self.wait(0.5)

    def common(self):
        self.section("통분해서 비교")
        b1 = frac_bar(12, 8, width=7.2).move_to([0.8, 1.5, 0])
        b2 = frac_bar(12, 9, width=7.2, color=BLUE).move_to([0.8, 0.5, 0])
        l1 = M("2/3 = 8/12", 40).next_to(b1, LEFT, buff=0.3)
        l2 = M("3/4 = 9/12", 40).next_to(b2, LEFT, buff=0.3)
        self.say("2/3과 3/4, 어느 쪽이 클까요?", "3분의 2와 4분의 3. 분모가 달라 바로 비교하기 어려워요. 3과 4의 최소공배수 12로 통분해 볼까요?")
        self.play(FadeIn(b1), FadeIn(b2), FadeIn(l1), FadeIn(l2), run_time=0.8)
        t = M(f"8/12 &lt; 9/12 → {g('3/4이 더 커요')}", 54).move_to([0, -0.8, 0])
        self.say(f"{g('3/4이 더 커요')}", "12분의 8과 12분의 9. 분모가 같아지면 분자만 비교하면 돼요. 4분의 3이 더 커요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def num_same(self):
        self.section("분자가 같으면")
        e = M(f"3/5 ○ 3/7 → 조각 3개씩, 조각이 큰 쪽 → 3/5 {g('&gt;')} 3/7", 46).move_to([0, 1.0, 0])
        self.say("분자가 같으면 분모가 작은 쪽이 커요", "5분의 3과 7분의 3처럼 분자가 같으면, 조각 수가 같으니 조각이 큰 쪽, 분모가 작은 5분의 3이 더 커요.")
        self.play(FadeIn(e), run_time=0.6)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        q = M("5/6 ○ 7/9", 80).move_to([0, 1.2, 0])
        self.say("5/6과 7/9 비교", "연습해 볼까요? 6분의 5와 9분의 7의 크기를 비교해 보세요.")
        self.play(FadeIn(q), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a = M(f"분모 18로: 15/18 &gt; 14/18 → 5/6 {g('&gt;')} 7/9", 54).move_to([0, -0.4, 0])
        self.say("5/6이 더 커요", "6과 9의 최소공배수 18로 통분하면 18분의 15와 18분의 14. 6분의 5가 더 커요.")
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
