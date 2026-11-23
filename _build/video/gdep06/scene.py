"""「수학 원리 돋보기」 나눗셈 차근차근 6화 — 1과 0이 들어간 나눗셈

5 ÷ 1 = 5(한 명이 다 가짐) / 5 ÷ 5 = 1(5명이 하나씩) / 0 ÷ 5 = 0(나눌 것이 없음)
5 ÷ 0: 0명에게는 나누어 줄 수 없음, 곱셈으로 보면 0 × □ = 5인 □가 없음 → 0으로는 나눌 수 없어요
최종: GRADE=d ./make_final.sh 6
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, M, T, b, g, o
from division import clear_stage
from divkit import DivScene, deal
from items import cross_mark
from prepkit import RED, dish, items


class GdEp06(DivScene):
    EP_NO = 6
    EP_TITLE = "1과 0이 들어간 나눗셈"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.case(1, "÷ 1: 한 명에게 다 주기", f"5 ÷ {o('1')} = {g('5')}", "5개를 한 명에게 똑같이 주면, 그 한 명이 5개를 다 가져요. 5 나누기 1은 5예요.")
        self.case(5, "같은 수로 나누기", f"5 ÷ {o('5')} = {g('1')}", "5개를 5명에게 똑같이 나누면 한 명에게 1개씩이에요. 5 나누기 5는 1이에요.")
        self.zero_top()
        self.zero_bottom()
        self.closing(f"□ ÷ 1 = □ · □ ÷ □ = 1 · 0 ÷ □ = 0\n{o('0으로는 나눌 수 없어요')}",
                     next_preview="나눗셈 차근차근 7화 · 똑같이 나누고 남으면? 나머지")
        self.wait(0.5)

    def case(self, d, sec, res, narr):
        self.section(sec)
        its = items(5, y=2.0, step=0.6, r=0.23)
        dishes = VGroup(*[dish(str(i + 1), w=1.6 if d > 2 else 2.6, h=0.6 if d > 2 else 0.9) for i in range(d)]).arrange(RIGHT, buff=0.4).move_to([0, -0.4, 0])
        self.say(f"사탕 5개를 {d}명에게 똑같이", f"사탕 5개를 {d}명에게 똑같이 나누어 볼까요?")
        self.play(FadeIn(its), FadeIn(dishes), run_time=0.6)
        if d == 1:
            for k, m in enumerate(its):
                self.play(m.animate.move_to(dishes[0].plate.get_center() + UP * 0.5 + RIGHT * (k - 2) * 0.42), run_time=0.25)
        else:
            for m, dd in zip(its, dishes):
                self.play(m.animate.move_to(dd.plate.get_center() + UP * 0.35), run_time=0.25)
        t = M(res, 70).move_to([0, -2.0, 0])
        self.say(res, narr)
        self.play(Write(t), run_time=0.6)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def zero_top(self):
        self.section("0을 나누면?")
        dishes = VGroup(*[dish(str(i + 1), w=1.6, h=0.6) for i in range(5)]).arrange(RIGHT, buff=0.4).move_to([0, 0.2, 0])
        self.say("사탕이 하나도 없어요", "이번에는 사탕이 하나도 없어요. 0개를 5명에게 나누면 한 명에게 몇 개일까요?")
        self.play(FadeIn(dishes), run_time=0.5)
        t = M(f"{b('0')} ÷ 5 = {g('0')}", 70).move_to([0, -1.6, 0])
        self.say(f"{b('0')} ÷ 5 = {g('0')}", "나눌 것이 없으니 모두 0개씩이에요. 0 나누기 5는 0이에요.")
        self.play(Write(t), run_time=0.6)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def zero_bottom(self):
        self.section("0으로 나누면?")
        q = M(f"5 ÷ {o('0')} = ?", 80).move_to([0, 2.0, 0])
        self.say("5 ÷ 0은 얼마일까요?", "그럼 5 나누기 0은 얼마일까요?")
        self.play(Write(q), run_time=0.6)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        its = items(5, y=0.6, step=0.6, r=0.23)
        t1 = M(f"사탕 5개를 {o('0명')}에게? → 받을 사람이 없어요", 42).move_to([0, -0.4, 0])
        self.say(f"{o('0명')}에게는 나누어 줄 수 없어요", "사탕 5개를 0명에게 나누어 줄 수 있을까요? 받을 사람이 없으니 나누어 줄 수가 없어요.")
        self.play(FadeIn(its), FadeIn(t1), run_time=0.6)
        t2 = M(f"곱셈으로 보면 {o('0')} × □ = 5 → 이런 □는 {o('없어요')}", 40).move_to([0, -1.25, 0])
        self.say(f"0 × □ = 5인 □는 {o('없어요')}", "곱셈으로 바꾸어 보면 0 곱하기 몇이 5인지 찾아야 해요. 그런데 0에는 무엇을 곱해도 0이라, 그런 수가 없어요.")
        self.play(FadeIn(t2), run_time=0.6)
        t3 = M(f"그래서 {o('0으로는 나눌 수 없어요')}", 54).move_to([0, -2.15, 0])
        no = cross_mark(0.45).next_to(q, RIGHT, buff=0.4)
        self.say(f"{o('0으로는 나눌 수 없어요')}", "그래서 수학에서는 0으로 나누지 않기로 해요. 0으로는 나눌 수 없어요.")
        self.play(FadeIn(t3), Create(no), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
