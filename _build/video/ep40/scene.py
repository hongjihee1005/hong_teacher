"""「수학 원리 돋보기」 40화 — 곱셈에서 올림은 왜 생길까? (1학기 4단원 4·5차시, 화 코드 1-4-b)

42 × 3: 십 모형 12개 → 10개를 백 모형 1개로(십의 자리 올림) → 126
14 × 6: 일 모형 24개 → 10개씩 묶어 십 모형 2개로(일의 자리 올림) → 84, 세로셈 위 작은 2
최종: ./make_final.sh 40
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, Indicate, LaggedStart, ReplacementTransform, SurroundingRectangle, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, EpisodeScene, M, T, b, g, o
from division import clear_stage
from base10 import hundred_flat, ten_rod, unit_cube
from multiply import HUND, cm, mul_vertical


class Ep40(EpisodeScene):
    EP_NO = 40
    EP_TITLE = "곱셈에서 올림은 왜 생길까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.tens_carry()
        self.section("세로셈으로 42 × 3")
        mul_vertical(self, 42, 3)
        self.settle(); self.clear_sub(); clear_stage(self, 0.6)
        self.ones_carry()
        self.section("세로셈으로 14 × 6")
        mul_vertical(self, 14, 6)
        self.settle(); self.clear_sub(); clear_stage(self, 0.6)
        self.hide_chip()
        self.closing(f"모형이 {g('10개')}가 되면 윗자리 모형 1개로 바꿔요\n그래서 곱셈에서도 {g('올림')}이 생겨요",
                     next_preview="41화 · 올림이 두 번 있는 곱셈")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M(f"동화책을 한 칸에 {b('42권')}씩 {o('3칸')}에 꽂았어요.\n모두 몇 권일까요?", 52).move_to([0, 1.3, 0])
        self.say("동화책 42권씩 3칸", "동화책을 한 칸에 42권씩 3칸에 꽂았어요. 모두 몇 권일까요?")
        self.play(Write(q), run_time=1.2)
        e = M("42 × 3 = ?", 100).move_to([0, -0.8, 0])
        self.say("십 모형이 10개보다 많아지면?", "42 곱하기 3을 수모형으로 하면 십 모형이 10개보다 많아져요. 어떻게 할까요?")
        self.play(FadeIn(e), run_time=0.5)
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def tens_carry(self):
        self.section("십 모형이 10개를 넘으면")
        rods = VGroup(*[ten_rod(0.17) for _ in range(12)]).arrange(RIGHT, buff=0.1).move_to([-2.0, 0.9, 0])
        ones = VGroup(*[unit_cube(0.17) for _ in range(6)]).arrange_in_grid(cols=2, buff=0.04).next_to(rods, RIGHT, buff=0.5)
        lab = M(f"{b('십 모형')}: 4 × 3 = {b('12개')},  {o('일 모형')}: 2 × 3 = {o('6개')}", 44).move_to([0, -0.8, 0])
        self.say(f"십 모형 {b('12개')}, 일 모형 {o('6개')}", "42씩 3묶음을 모으면 십 모형이 4 곱하기 3, 12개. 일 모형이 2 곱하기 3, 6개예요.")
        self.play(LaggedStart(*[FadeIn(r) for r in rods], lag_ratio=0.05, run_time=1.0), FadeIn(ones), FadeIn(lab))
        ring = SurroundingRectangle(VGroup(*rods[:10]), color=HUND, buff=0.08, stroke_width=6)
        self.say(f"십 모형 10개 → {cm('백 모형 1개', 2)}", "십 모형 10개를 백 모형 1개로 바꿔요.")
        self.play(Create(ring), run_time=0.5)
        flat = hundred_flat(0.17).move_to(VGroup(*rods[:10]))
        self.play(ReplacementTransform(VGroup(*rods[:10]), flat), FadeOut_ring(ring), run_time=1.0)
        res = M(f"{cm('백 1', 2)} + {b('십 2')} + {o('일 6')} = {g('126')}", 54).move_to([0, -1.9, 0])
        self.say(f"백 모형 1개, 십 모형 2개, 일 모형 6개 → {g('126')}", "백 모형 1개, 십 모형 2개, 일 모형 6개. 126권이에요.")
        self.play(FadeIn(res), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def ones_carry(self):
        self.section("일 모형이 10개를 넘으면")
        q = M(f"색연필 {b('14자루')}씩 {o('6통')}", 50).move_to([0, 2.4, 0])
        self.say("색연필 14자루씩 6통", "이번에는 색연필이 한 통에 14자루씩 6통 있어요.")
        self.play(FadeIn(q), run_time=0.5)
        rods = VGroup(*[ten_rod(0.17) for _ in range(6)]).arrange(RIGHT, buff=0.1).move_to([-4.0, 0.6, 0])
        ones = VGroup(*[unit_cube(0.2) for _ in range(24)]).arrange_in_grid(rows=3, buff=0.06).move_to([1.6, 0.6, 0])
        self.say(f"일 모형 4 × 6 = {o('24개')}", "십 모형은 6개, 일 모형은 4 곱하기 6, 24개예요.")
        self.play(FadeIn(rods), LaggedStart(*[FadeIn(c) for c in ones], lag_ratio=0.03, run_time=1.0))
        self.say(f"일 모형 10개씩 → {b('십 모형 2개')}, 남는 {o('4개')}", "일 모형 10개씩 묶으면 십 모형 2개가 되고 4개가 남아요.")
        new = VGroup(ten_rod(0.17), ten_rod(0.17)).arrange(RIGHT, buff=0.1).next_to(rods, RIGHT, buff=0.1)
        self.play(ReplacementTransform(VGroup(*ones[:10]), new[0]), ReplacementTransform(VGroup(*ones[10:20]), new[1]), run_time=1.2)
        res = M(f"{b('십 모형 8개')} + {o('일 모형 4개')} = {g('84')}", 52).move_to([0, -1.4, 0])
        self.say(f"십 모형 8개, 일 모형 4개 → {g('84')}", "십 모형은 6개와 2개, 8개. 일 모형은 4개. 그래서 84자루예요.")
        self.play(FadeIn(res), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)


def FadeOut_ring(r):
    from manim import FadeOut
    return FadeOut(r)
