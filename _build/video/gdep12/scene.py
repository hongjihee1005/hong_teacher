"""「수학 원리 돋보기」 나눗셈 차근차근 12화 — 몇십을 나누면?

6 ÷ 3 = 2 와 60 ÷ 3 = 20 나란히 / 십 모형 6개를 3묶음 → 한 묶음 십 모형 2개 = 20
연습: 80 ÷ 4 = 20
최종: GRADE=d ./make_final.sh 12
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, M, T, b, g, o
from division import DivBoard, clear_stage
from divkit import DivScene


class GdEp12(DivScene):
    EP_NO = 12
    EP_TITLE = "몇십을 나누면?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.compare()
        board = DivBoard(self, 60, 3, who="모둠", item="색종이", unit="장")
        board.show_number()
        board.show_plates()
        board.deal_tens()
        board.show_result()
        board.clear()
        self.why()
        self.practice()
        self.closing(f"6 ÷ 3 = 2 이면 {b('60')} ÷ 3 = {g('20')}\n십 모형으로 나누면 몫도 '몇십'이에요",
                     next_preview="나눗셈 차근차근 13화 · 나눗셈 세로셈, 어디에 무엇을 쓸까?")
        self.wait(0.5)

    def compare(self):
        self.section("문제")
        a = M(f"6 ÷ 3 = {g('2')}", 80).move_to([-3.2, 1.0, 0])
        c = M(f"{b('60')} ÷ 3 = ?", 80).move_to([3.2, 1.0, 0])
        self.say("6 ÷ 3은 2, 그럼 60 ÷ 3은?", "6 나누기 3은 2예요. 그럼 60 나누기 3은 얼마일까요?")
        self.play(FadeIn(a), run_time=0.5)
        self.play(FadeIn(c), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.5)

    def why(self):
        self.section("왜 20일까?")
        a = M(f"{o('6')}개 ÷ 3 = {g('2')}개", 64).move_to([0, 1.2, 0])
        c = M(f"십 모형 {o('6')}개 ÷ 3 = 십 모형 {g('2')}개 = {g('20')}", 56).move_to([0, 0.0, 0])
        self.say("십 모형 6개를 나누는 것", "60은 십 모형 6개예요. 십 모형 6개를 3묶음으로 나누면 한 묶음에 십 모형 2개, 곧 20이에요.")
        self.play(FadeIn(a), run_time=0.5)
        self.play(FadeIn(c), run_time=0.6)
        t = M(f"6 ÷ 3 = 2 에 {b('0')}을 하나 붙이면 60 ÷ 3 = 2{b('0')}", 44).move_to([0, -1.4, 0])
        self.say("2에 0을 붙여 20", "그래서 6 나누기 3의 몫 2에 0을 하나 붙이면 60 나누기 3의 몫 20이 돼요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def practice(self):
        self.section("연습해요")
        q = M(f"{b('80')} ÷ 4 = ?", 90).move_to([0, 1.2, 0])
        self.say("80 ÷ 4는?", "연습해 볼까요? 80 나누기 4는 얼마일까요?")
        self.play(Write(q), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a = M(f"8 ÷ 4 = 2 → {b('80')} ÷ 4 = {g('20')}", 64).move_to([0, -0.4, 0])
        self.say(f"80 ÷ 4 = {g('20')}", "8 나누기 4는 2이니까, 십 모형 8개를 4묶음으로 나누면 한 묶음에 십 모형 2개. 80 나누기 4는 20이에요.")
        self.play(FadeIn(a), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
