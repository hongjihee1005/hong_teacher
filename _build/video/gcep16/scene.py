"""「수학 원리 돋보기」 개념 차근차근 16화 — 두 자리 수 덧셈 세로셈

자리 맞추어 쓰기(일은 일끼리, 십은 십끼리) / 일의 자리부터 / 받아올림 1: 38 + 27 = 65 (addsub.add_vertical)
연습: 46 + 37 = 83
최종: GRADE=c ./make_final.sh 16
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
from addsub import add_vertical


class GcEp16(ConceptScene):
    EP_NO = 16
    EP_TITLE = "두 자리 수 덧셈 세로셈"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.align()
        self.section("받아올림이 있는 덧셈")
        self.say("38 + 27을 세로셈으로", "38 더하기 27을 세로셈으로 계산해 볼까요?")
        add_vertical(self, 38, 27)
        self.settle()
        clear_stage(self, 0.5)
        self.practice()
        self.closing(f"{b('자리')}를 맞추어 쓰고 {o('일의 자리')}부터 더해요\n10이 넘으면 윗자리로 {g('받아올림 1')}",
                     next_preview="개념 차근차근 17화 · 두 자리 수 뺄셈 세로셈")
        self.wait(0.5)

    def align(self):
        self.section("자리를 맞추어 써요")
        good = VGroup(M("  38", 70), M("+ 27", 70)).arrange(DOWN, buff=0.2, aligned_edge=RIGHT).move_to([-3.0, 0.8, 0])
        bad = VGroup(M("38", 70), M("+ 27", 70)).arrange(DOWN, buff=0.2, aligned_edge=LEFT).move_to([3.0, 0.8, 0])
        bad[0].shift(LEFT * 0.75)
        self.say("세로셈은 자리를 맞추어 써요", "세로셈을 쓸 때는 일의 자리는 일의 자리끼리, 십의 자리는 십의 자리끼리 맞추어 써요.")
        self.play(FadeIn(good), FadeIn(bad), run_time=0.6)
        k = check_mark(0.5).next_to(good, DOWN, buff=0.4)
        x = cross_mark(0.4).next_to(bad, DOWN, buff=0.4)
        self.play(Create(k), Create(x), run_time=0.6)
        t = M("일의 자리 8과 7이 위아래로 나란히", 42).move_to([0, -1.6, 0])
        self.play(FadeIn(t), run_time=0.4)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        q = M("46 + 37", 90).move_to([0, 1.2, 0])
        self.say("46 + 37을 세로셈으로", "연습해 볼까요? 46 더하기 37을 세로셈으로 계산해 보세요.")
        self.play(Write(q), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a = M(f"일: 6 + 7 = 13 → 3 쓰고 1 받아올림 · 십: 4 + 3 + 1 = 8 → {g('83')}", 38).move_to([0, -0.4, 0])
        self.say(f"{g('83')}", "일의 자리 6 더하기 7은 13, 3을 쓰고 1을 받아올려요. 십의 자리 4 더하기 3 더하기 1은 8. 답은 83이에요.")
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
