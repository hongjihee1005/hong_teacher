"""「수학 원리 돋보기」 분수 준비 7화 — 곱셈으로 나눗셈 답 찾기

12 ÷ 3 = □ → '3씩 몇 묶음이면 12?' → 3 × □ = 12 → 3, 6, 9, 12 → □ = 4
한 가족: 3 × 4 = 12, 4 × 3 = 12, 12 ÷ 3 = 4, 12 ÷ 4 = 3 (배열 하나) / 연습: 20 ÷ 5 = 4
최종: GRADE=p ./make_final.sh 7
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, RIGHT, UP, FadeIn, FadeOut, Indicate, LaggedStart, SurroundingRectangle, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, M, T, b, g, o
from division import clear_stage
from prepkit import PINK, RED, PrepScene, grid_items


class GpEp07(PrepScene):
    EP_NO = 7
    EP_TITLE = "곱셈으로 나눗셈 답 찾기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.find()
        self.family()
        self.practice()
        self.closing(f"{b('12')} ÷ {o('3')} = □ 는 '{o('3')} × □ = {b('12')}'로 생각해요\n곱셈과 나눗셈은 {g('한 가족')}",
                     next_preview="분수 준비 8화 · 하나를 똑같이 나누기")
        self.wait(0.5)

    def skip(self, step, upto, y=-0.2):
        nums = VGroup(*[T(str(step * (i + 1)), 64, BLUE) for i in range(upto // step)]).arrange(RIGHT, buff=0.9).move_to([0, y, 0])
        fingers = VGroup(*[T(f"{i + 1}번", 30, ORANGE).next_to(n_, DOWN, buff=0.2) for i, n_ in enumerate(nums)])
        for n_, f in zip(nums, fingers):
            self.play(FadeIn(n_, scale=1.4), FadeIn(f), run_time=0.55)
        return VGroup(nums, fingers)

    def find(self):
        self.section("곱셈으로 생각하기")
        q = M(f"{b('12')} ÷ {o('3')} = □", 80).move_to([0, 2.2, 0])
        self.say("12 ÷ 3은 얼마일까요?", "12 나누기 3은 얼마일까요? 바로 생각나지 않으면 곱셈으로 바꾸어 생각해요.")
        self.play(Write(q), run_time=0.7)
        t = M(f"'{o('3')}씩 몇 번 뛰면 {b('12')}가 될까?'  →  {o('3')} × □ = {b('12')}", 46).move_to([0, 1.0, 0])
        self.say(f"3씩 몇 번 뛰면 12가 될까?", "3씩 몇 번 뛰어 세면 12가 될까요? 3 곱하기 몇이 12인지 찾는 거예요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        self.say("3, 6, 9, 12 — 네 번!", "3, 6, 9, 12. 네 번 뛰었어요.")
        self.skip(3, 12)
        a = M(f"{o('3')} × {g('4')} = {b('12')}  이니까  {b('12')} ÷ {o('3')} = {g('4')}", 52).move_to([0, -1.9, 0])
        self.say(f"그래서 12 ÷ 3 = {g('4')}", "3 곱하기 4가 12이니까, 12 나누기 3은 4예요.")
        self.play(Write(a), run_time=0.8)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def family(self):
        self.section("곱셈과 나눗셈은 한 가족")
        lines = grid_items(3, 4, center=(-3.6, 0.3, 0), step=0.75, r=0.28)
        self.say("구슬 12개가 3줄, 한 줄에 4개", "구슬 12개가 한 줄에 4개씩 3줄 있어요. 이 그림 하나로 식을 네 개 만들 수 있어요.")
        self.play(FadeIn(lines, lag_ratio=0.1), run_time=0.8)
        eqs = VGroup(
            M(f"{b('4')} × {o('3')} = {g('12')}", 50), M(f"{b('3')} × {o('4')} = {g('12')}", 50),
            M(f"{g('12')} ÷ {o('3')} = {b('4')}", 50), M(f"{g('12')} ÷ {b('4')} = {o('3')}", 50),
        ).arrange(DOWN, buff=0.35).move_to([2.8, 0.3, 0])
        nar = ["한 줄에 4개씩 3줄, 4 곱하기 3은 12.", "순서를 바꾸어 3 곱하기 4도 12.",
               "12개를 3줄로 나누면 한 줄에 4개, 12 나누기 3은 4.", "12개를 4개씩 묶으면 3줄, 12 나누기 4는 3."]
        subs = [f"{b('4')} × {o('3')} = 12", f"{b('3')} × {o('4')} = 12", f"12 ÷ {o('3')} = {b('4')}", f"12 ÷ {b('4')} = {o('3')}"]
        for e, s, n_ in zip(eqs, subs, nar):
            self.say(s, n_)
            self.play(FadeIn(e, shift=RIGHT * 0.3), run_time=0.6)
        box = SurroundingRectangle(eqs, color=GREEN, buff=0.2, stroke_width=5, corner_radius=0.15)
        self.say(f"모두 {g('한 가족')}이에요", "모두 한 그림에서 나온 한 가족이에요.")
        self.play(FadeIn(box), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def practice(self):
        self.section("연습해요")
        q = M(f"{b('20')} ÷ {o('5')} = □", 80).move_to([0, 2.2, 0])
        self.say("20 ÷ 5를 곱셈으로 생각해 보세요", "연습해 볼까요? 20 나누기 5를 곱셈으로 바꾸어 생각해 보세요.")
        self.play(Write(q), run_time=0.6)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        self.say("5, 10, 15, 20 — 네 번", "5씩 뛰어 세요. 5, 10, 15, 20. 네 번이에요.")
        self.skip(5, 20, y=0.4)
        a = M(f"{o('5')} × {g('4')} = {b('20')}  →  {b('20')} ÷ {o('5')} = {g('4')}", 54).move_to([0, -1.6, 0])
        self.say(f"20 ÷ 5 = {g('4')}", "5 곱하기 4가 20이니까, 20 나누기 5는 4예요.")
        self.play(Write(a), run_time=0.8)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
