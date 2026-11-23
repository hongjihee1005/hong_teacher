"""「수학 원리 돋보기」 개념 차근차근 14화 — 10을 만들어 더하기 (8 + 5)

10칸 틀 두 개: 8 + 5 → 5를 2와 3으로 가르기 → 8 + 2 = 10, 10 + 3 = 13
다른 방법: 8을 3과 5로 → 5 + 5 = 10, 10 + 3 / 연습: 9 + 4, 7 + 6
최종: GRADE=c ./make_final.sh 14
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

class GcEp14(ConceptScene):
    EP_NO = 14
    EP_TITLE = "10을 만들어 더하기 (8 + 5)"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.frames()
        self.other()
        self.practice()
        self.closing(f"합이 10보다 크면 {g('10을 먼저')} 만들어요\n8 + 5 = 8 + {o('2')} + 3 = {g('10')} + 3 = 13",
                     next_preview="개념 차근차근 15화 · 10에서 빼기 (13 − 5)")
        self.wait(0.5)

    def frames(self):
        self.section("10칸 틀로 더하기")
        f1 = ten_frame(8, BLUE, cell=0.7).move_to([-3.0, 1.2, 0])
        f2 = ten_frame(5, ORANGE, cell=0.7).move_to([3.0, 1.2, 0])
        l1, l2 = T("8", 54, BLUE).next_to(f1, UP, buff=0.2), T("5", 54, ORANGE).next_to(f2, UP, buff=0.2)
        self.say("8 + 5는 얼마일까요?", "8 더하기 5는 얼마일까요? 10칸 틀 두 개에 8개와 5개를 넣었어요.")
        self.play(FadeIn(f1), FadeIn(f2), FadeIn(l1), FadeIn(l2), run_time=0.8)
        mv = VGroup(f2[1][0], f2[1][1])
        self.say(f"첫째 틀의 빈칸 {o('2')}개를 채워요", "첫째 틀에는 빈칸이 2개 있어요. 주황 구슬 2개를 옮겨 채우면 10이 돼요.")
        self.play(mv[0].animate.move_to(f1[0][8]), mv[1].animate.move_to(f1[0][9]), run_time=1.0)
        e = M(f"8 + 5 = 8 + {o('2')} + {o('3')} = {g('10')} + 3 = {g('13')}", 56).move_to([0, -0.8, 0])
        self.say(f"10과 3, 그래서 {g('13')}", "5를 2와 3으로 갈라, 8에 2를 더해 10을 만들고, 남은 3을 더하면 13이에요.")
        self.play(FadeIn(e), run_time=0.6)
        t = M("(5를 2와 3으로 가르기: 개념 차근차근 2화 · 10의 짝: 3화)", 30, SOFT).move_to([0, -1.9, 0])
        self.play(FadeIn(t), run_time=0.3)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def other(self):
        self.section("다른 방법도 있어요")
        e = M(f"8 + 5 = {o('3')} + {b('5')} + 5 = 3 + {g('10')} = {g('13')}", 56).move_to([0, 1.0, 0])
        self.say("8을 3과 5로 가르면?", "이번에는 8을 3과 5로 갈라 볼까요? 5와 5를 더해 10을 만들고 3을 더해도 13이에요.")
        self.play(FadeIn(e), run_time=0.6)
        t = M("어느 쪽을 가르든 10을 먼저 만들면 쉬워요", 44).move_to([0, -0.4, 0])
        self.play(FadeIn(t), run_time=0.4)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        qs = VGroup(M("① 9 + 4", 70), M("② 7 + 6", 70)).arrange(RIGHT, buff=2.2).move_to([0, 1.4, 0])
        self.say("10을 만들어 더해 보세요", "연습해 볼까요? 10을 만들어 더해 보세요.")
        self.play(FadeIn(qs), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a1 = M(f"9 + {o('1')} + 3 = 10 + 3 = {g('13')}", 46).move_to([0, 0.0, 0])
        a2 = M(f"7 + {o('3')} + 3 = 10 + 3 = {g('13')}", 46).move_to([0, -1.0, 0])
        self.say(f"둘 다 {g('13')}", "9 더하기 4는 4를 1과 3으로 갈라 13. 7 더하기 6은 6을 3과 3으로 갈라 13이에요.")
        self.play(FadeIn(a1), FadeIn(a2), run_time=0.7)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
