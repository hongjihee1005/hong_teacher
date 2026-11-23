"""「수학 원리 돋보기」 나눗셈 차근차근 19화 — 거꾸로 생각하기: 어떤 수 구하기

□ ÷ 4 = 6 → 4명에게 6개씩이면 전체는 4 × 6 = 24 → 확인 24 ÷ 4 = 6
24 ÷ □ = 3 → □ × 3 = 24 → 8 / 연습: □ ÷ 5 = 7 → 35
최종: GRADE=d ./make_final.sh 19
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, M, T, b, g, o
from division import clear_stage
from divkit import DivScene, slot
from items import check_mark
from prepkit import RED, dish, items


class GdEp19(DivScene):
    EP_NO = 19
    EP_TITLE = "거꾸로 생각하기: 어떤 수 구하기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.unknown_total()
        self.unknown_divisor()
        self.practice()
        self.closing(f"□ ÷ 4 = 6 → □ = 4 × 6 = {g('24')}\n나눗셈의 □는 {b('곱셈')}으로 바꾸어 찾고, 넣어서 확인해요",
                     next_preview="나눗셈 차근차근 20화 · 나눗셈과 분수는 친구")
        self.wait(0.5)

    def unknown_total(self):
        self.section("나누어지는 수를 모를 때")
        q = M(f"□ ÷ {o('4')} = {g('6')}", 90).move_to([0, 2.2, 0])
        self.say("□ ÷ 4 = 6, □는?", "어떤 수를 4로 나누었더니 6이 되었어요. 어떤 수는 얼마일까요?")
        self.play(Write(q), run_time=0.6)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        dishes = VGroup(*[dish(n, w=2.0, h=0.75) for n in ["가", "나", "다", "라"]]).arrange(RIGHT, buff=0.5).move_to([0, 0.2, 0])
        its = VGroup()
        for d in dishes:
            for k in range(6):
                m = items(1, r=0.15)[0]
                m.move_to(slot(d, k, cols=3, step=0.38))
                its.add(m)
        self.say(f"4명에게 {g('6개')}씩 나누어 준 것", "4명에게 똑같이 나누었더니 한 명에게 6개씩이었다는 뜻이에요.")
        self.play(FadeIn(dishes), FadeIn(its, lag_ratio=0.03), run_time=0.9)
        a = M(f"전체 □ = {o('4')} × {g('6')} = {b('24')}", 56).move_to([0, -1.2, 0])
        self.say(f"전체는 4 × 6 = {b('24')}", "전체를 모으면 4 곱하기 6, 24예요.")
        self.play(FadeIn(a), run_time=0.6)
        c = M(f"확인: 24 ÷ 4 = 6", 44).move_to([0, -2.1, 0])
        k = check_mark(0.4).next_to(c, RIGHT, buff=0.3)
        self.say("확인: 24 ÷ 4 = 6", "24를 넣어 확인해요. 24 나누기 4는 6. 맞아요!")
        self.play(FadeIn(c), Create(k), run_time=0.6)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def unknown_divisor(self):
        self.section("나누는 수를 모를 때")
        q = M(f"{b('24')} ÷ □ = {g('3')}", 90).move_to([0, 1.8, 0])
        self.say("24 ÷ □ = 3, □는?", "이번에는 24를 어떤 수로 나누었더니 3이 되었어요.")
        self.play(Write(q), run_time=0.6)
        t1 = M(f"곱셈으로: □ × {g('3')} = {b('24')}", 56).move_to([0, 0.5, 0])
        self.say("곱셈으로 바꾸면 □ × 3 = 24", "곱셈으로 바꾸면 어떤 수 곱하기 3이 24예요.")
        self.play(FadeIn(t1), run_time=0.6)
        t2 = M(f"8 × 3 = 24 → □ = {o('8')}", 56).move_to([0, -0.6, 0])
        self.say(f"□ = {o('8')}", "8 곱하기 3이 24이니까, 어떤 수는 8이에요.")
        self.play(FadeIn(t2), run_time=0.6)
        c = M("확인: 24 ÷ 8 = 3", 44).move_to([0, -1.7, 0])
        self.play(FadeIn(c), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def practice(self):
        self.section("연습해요")
        q = M(f"□ ÷ {o('5')} = {g('7')}", 90).move_to([0, 1.4, 0])
        self.say("□ ÷ 5 = 7, □는?", "연습해 볼까요? 어떤 수를 5로 나누었더니 7이 되었어요. 어떤 수는?")
        self.play(Write(q), run_time=0.6)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a = M(f"□ = 5 × 7 = {b('35')}  (확인: 35 ÷ 5 = 7)", 52).move_to([0, -0.2, 0])
        self.say(f"□ = {b('35')}", "5 곱하기 7은 35. 어떤 수는 35예요. 35 나누기 5는 7로 맞아요.")
        self.play(FadeIn(a), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
