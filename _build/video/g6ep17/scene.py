"""「수학 원리 돋보기」 6학년 17화 — 어림셈으로 소수점 위치 확인 (6-1 3단원 8차시, 화 코드 6-1-3-g)

21.8 ÷ 4를 20 ÷ 4로 어림셈하면 약 5 → 몫은 5.45 (0.545, 54.5가 아님)
15.2 ÷ 5를 15 ÷ 5로 어림셈하면 약 3 → 몫은 3.04
최종: GRADE=6 ./make_final.sh 17
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, Cross, FadeIn, FadeOut, Indicate, LaggedStart, RoundedRectangle,
                   SurroundingRectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage

RED = "#C0392B"


def card(s, x, y):
    t = M(s, 50)
    box = RoundedRectangle(width=t.width + 0.7, height=1.0, corner_radius=0.18, fill_color=PAPER, fill_opacity=1, stroke_color=INK, stroke_width=3)
    return VGroup(box, t).move_to([x, y, 0])


class G6Ep17(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 17
    EP_TITLE = "어림셈으로 소수점 위치 확인"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.first()
        self.second()
        self.closing(f"어림하기 쉬운 수로 바꾸어 {o('어림셈')}한 뒤\n몫이 {g('어림셈 결과와 비슷하게')} 소수점을 찍어요",
                     next_preview="6학년 18화 · 두 수를 비교하는 두 방법")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("21.8 ÷ 4를 계산했더니 숫자가 5, 4, 5였어요.\n소수점은 어디에 찍어야 할까요?", 42).move_to([0.6, 1.6, 0])
        self.say("소수점은 어디에?", "21.8 나누기 4를 계산했더니 몫의 숫자가 5, 4, 5였어요. 소수점은 어디에 찍어야 할까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def first(self):
        self.section("어림셈으로 확인")
        a = M(f"21.8 ÷ 4  →  {o('20 ÷ 4 = 5')}", 50).move_to([0, 1.9, 0])
        self.say(f"21.8은 약 20, 20 ÷ 4 = {o('5')}", "21.8을 어림하기 쉬운 자연수 20으로 바꾸어 어림셈하면 20 나누기 4는 5. 몫은 약 5예요.")
        self.play(FadeIn(a), run_time=0.6)
        cs = VGroup(card("0.545", -4.0, 0.2), card("5.45", 0, 0.2), card("54.5", 4.0, 0.2))
        self.say("세 가지 중 어느 것?", "0.545, 5.45, 54.5 중에서 5와 가장 비슷한 수는 무엇일까요?")
        self.play(LaggedStart(*[FadeIn(c) for c in cs], lag_ratio=0.2, run_time=0.8))
        x1 = Cross(cs[0], stroke_color=RED, stroke_width=5)
        x2 = Cross(cs[2], stroke_color=RED, stroke_width=5)
        ok = SurroundingRectangle(cs[1], color=GREEN, buff=0.12, stroke_width=6)
        r = M(f"21.8 ÷ 4 = {g('5.45')}", 50).move_to([0, -1.4, 0])
        self.say(f"약 5와 비슷한 {g('5.45')}", "0.545는 너무 작고 54.5는 너무 커요. 5와 비슷한 5.45가 몫이에요.")
        self.play(Create(x1), Create(x2), run_time=0.6)
        self.play(Create(ok), FadeIn(r), run_time=0.6)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def second(self):
        self.section("한 번 더")
        a = M(f"15.2 ÷ 5  →  {o('15 ÷ 5 = 3')}", 50).move_to([0, 1.9, 0])
        self.say(f"15.2 ÷ 5는 약 {o('3')}", "15.2 나누기 5는 15 나누기 5로 어림셈하면 약 3이에요. 몫의 숫자는 3, 0, 4예요.")
        self.play(FadeIn(a), run_time=0.6)
        cs = VGroup(card("0.304", -4.0, 0.2), card("3.04", 0, 0.2), card("30.4", 4.0, 0.2))
        self.play(LaggedStart(*[FadeIn(c) for c in cs], lag_ratio=0.2, run_time=0.8))
        x1 = Cross(cs[0], stroke_color=RED, stroke_width=5)
        x2 = Cross(cs[2], stroke_color=RED, stroke_width=5)
        ok = SurroundingRectangle(cs[1], color=GREEN, buff=0.12, stroke_width=6)
        r = M(f"15.2 ÷ 5 = {g('3.04')}", 50).move_to([0, -1.4, 0])
        self.say(f"약 3과 비슷한 {g('3.04')}", "약 3과 비슷한 수는 3.04예요. 어림셈으로 소수점의 위치를 확인할 수 있어요.")
        self.play(Create(x1), Create(x2), run_time=0.6)
        self.play(Create(ok), FadeIn(r), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
