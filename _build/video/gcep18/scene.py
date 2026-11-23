"""「수학 원리 돋보기」 개념 차근차근 18화 — 덧셈과 뺄셈은 가족, □ 구하기

3, 5, 8 가족: 3 + 5 = 8, 5 + 3 = 8, 8 − 5 = 3, 8 − 3 = 5 / □ + 5 = 8 → 8 − 5 = 3 / 12 − □ = 7 → 12 − 7 = 5
연습: □ + 6 = 14, 15 − □ = 9
최종: GRADE=c ./make_final.sh 18
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
from conceptkit import pair_card


class GcEp18(ConceptScene):
    EP_NO = 18
    EP_TITLE = "덧셈과 뺄셈은 가족, □ 구하기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.family()
        self.box1()
        self.box2()
        self.practice()
        self.closing(f"세 수로 덧셈식 2개, 뺄셈식 2개를 만들 수 있어요\n□가 있으면 {g('반대 셈')}으로 바꾸어 구해요",
                     next_preview="개념 차근차근 19화 · 세 자리 수 덧셈·뺄셈")
        self.wait(0.5)

    def family(self):
        self.section("세 수의 가족")
        c = pair_card(8, 3, 5, size=64).scale(0.8).move_to([-3.6, 0.5, 0])
        eqs = VGroup(M(f"{b('3')} + {o('5')} = {g('8')}", 50), M(f"{o('5')} + {b('3')} = {g('8')}", 50),
                     M(f"{g('8')} − {o('5')} = {b('3')}", 50), M(f"{g('8')} − {b('3')} = {o('5')}", 50)).arrange(DOWN, buff=0.3).move_to([2.4, 0.5, 0])
        self.say("3, 5, 8은 한 가족", "3과 5를 모으면 8, 8은 3과 5로 가를 수 있어요. 이 세 수로 식 네 개를 만들 수 있어요.")
        self.play(FadeIn(c), run_time=0.5)
        self.play(LaggedStart(*[FadeIn(e, shift=LEFT * 0.2) for e in eqs], lag_ratio=0.3), run_time=1.4)
        t = M("덧셈식 2개, 뺄셈식 2개", 40, SOFT).move_to([0, -1.9, 0])
        self.play(FadeIn(t), run_time=0.4)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def box1(self):
        self.section("□ + 5 = 8")
        q = M("□ + 5 = 8", 90).move_to([0, 1.6, 0])
        self.say("어떤 수에 5를 더했더니 8", "어떤 수에 5를 더했더니 8이 되었어요. 어떤 수는 얼마일까요?")
        self.play(Write(q), run_time=0.5)
        e = M(f"가족 식으로: □ = 8 − 5 = {g('3')}", 60).move_to([0, 0.2, 0])
        self.say(f"8 − 5 = {g('3')}", "같은 가족의 뺄셈식으로 바꾸면 네모는 8 빼기 5, 3이에요.")
        self.play(FadeIn(e), run_time=0.5)
        c = M("확인: 3 + 5 = 8", 44).move_to([0, -1.0, 0])
        k = check_mark(0.4).next_to(c, RIGHT, buff=0.3)
        self.play(FadeIn(c), Create(k), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.5)

    def box2(self):
        self.section("12 − □ = 7")
        q = M("12 − □ = 7", 90).move_to([0, 1.6, 0])
        self.say("12에서 어떤 수를 뺐더니 7", "12에서 어떤 수를 뺐더니 7이 남았어요.")
        self.play(Write(q), run_time=0.5)
        e = M(f"□ = 12 − 7 = {g('5')}", 60).move_to([0, 0.2, 0])
        self.say(f"12 − 7 = {g('5')}", "12를 7과 네모로 가른 것이니, 네모는 12 빼기 7, 5예요.")
        self.play(FadeIn(e), run_time=0.5)
        c = M("확인: 12 − 5 = 7", 44).move_to([0, -1.0, 0])
        k = check_mark(0.4).next_to(c, RIGHT, buff=0.3)
        self.play(FadeIn(c), Create(k), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        qs = VGroup(M("① □ + 6 = 14", 64), M("② 15 − □ = 9", 64)).arrange(RIGHT, buff=1.6).move_to([0, 1.2, 0])
        self.say("□에 알맞은 수는?", "연습해 볼까요? 네모에 알맞은 수를 구해 보세요.")
        self.play(FadeIn(qs), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a = M(f"① 14 − 6 = {g('8')}    ② 15 − 9 = {g('6')}", 56).move_to([0, -0.4, 0])
        self.say(f"① {g('8')}  ② {g('6')}", "1번은 14 빼기 6으로 8, 2번은 15 빼기 9로 6이에요.")
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
