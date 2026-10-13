"""「수학 원리 돋보기」 22화 — (세 자리 수) × (한 자리 수) (2학기 1단원 곱셈 2·3차시, 화 코드 2-1-a)

213 × 3: 수모형 세 줄 → 백·십·일을 따로 곱해 더하기(600 + 30 + 9) → 세로셈은 그 줄임
128 × 3: 일의 자리 8 × 3 = 24 → 10개 묶음 2개를 십의 자리로 올림 → 384
최종: ./make_final.sh 22
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, SurroundingRectangle, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from multiply import HUND, blocks_rows, cm, mul_vertical


class Ep22(EpisodeScene):
    EP_NO = 22
    EP_TITLE = "세 자리 수 곱하기 한 자리 수"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.blocks213()
        self.section("세로셈으로 213 × 3")
        mul_vertical(self, 213, 3)
        self.settle(); self.clear_sub(); clear_stage(self, 0.6)
        self.carry128()
        self.section("세로셈으로 128 × 3")
        mul_vertical(self, 128, 3)
        self.settle(); self.clear_sub(); clear_stage(self, 0.6)
        self.hide_chip()
        self.closing(f"백·십·일을 {g('따로 곱해 더해요')}\n곱이 10이 넘으면 {b('윗자리로 올려요')}",
                     next_preview="23화 · 올림이 여러 번 있으면?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M(f"태권도 경기가 하루에 {cm('2', 2)}{cm('1', 1)}{cm('3', 0)}경기씩 {b('3일')} 동안 열려요.\n모두 몇 경기일까요?", 52)
        q.scale_to_fit_width(min(q.width, 11.6)).move_to([0, 1.5, 0])
        self.say("태권도 경기가 하루에 213경기씩 3일", "태권도 축제에서 경기가 하루에 213경기씩 3일 동안 열려요. 모두 몇 경기일까요?")
        self.play(Write(q), run_time=1.4)
        e = M("213 × 3 = ?", 110).move_to([0, -0.6, 0])
        self.say("세 자리 수의 곱셈, 어떻게 나누어 계산할까요?", "식으로 쓰면 213 곱하기 3. 세 자리 수의 곱셈은 어떻게 나누어 계산할까요?")
        self.play(FadeIn(e), run_time=0.6)
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def blocks213(self):
        self.section("수모형으로 213 × 3")
        rows = blocks_rows(213, 3, size=0.11).move_to([-3.2, 0.3, 0])
        self.say("213을 수모형으로 3줄 놓아요", "213을 수모형으로 3번 놓아 볼게요.")
        self.play(LaggedStart(*[FadeIn(r, shift=RIGHT * 0.3) for r in rows], lag_ratio=0.3, run_time=1.4))
        lines = [
            (f"{cm('백', 2)}: {cm('200', 2)} × 3 = {cm('600', 2)}", "백 모형은 한 줄에 2개씩 3줄, 200 곱하기 3은 600.", 2, 0),
            (f"{cm('십', 1)}: {cm('10', 1)} × 3 = {cm('30', 1)}", "십 모형은 한 줄에 1개씩 3줄, 10 곱하기 3은 30.", 1, 1),
            (f"{cm('일', 0)}: {cm('3', 0)} × 3 = {cm('9', 0)}", "일 모형은 한 줄에 3개씩 3줄, 3 곱하기 3은 9.", 0, 2),
        ]
        ms = VGroup()
        for k, (mk, nar, part, idx) in enumerate(lines):
            m = M(mk, 46).move_to([3.4, 1.6 - k * 0.95, 0])
            ms.add(m)
            self.say(mk, nar)
            self.play(*[Indicate(r[idx], color=[ORANGE, BLUE, HUND][part], scale_factor=1.15) for r in rows], FadeIn(m), run_time=0.9)
            self.wait(0.4)
        tot = M(f"600 + 30 + 9 = {g('639')}", 56).move_to([3.4, -1.4, 0])
        self.say(f"모두 더하면 {g('639')}", "세 값을 모두 더하면 600 더하기 30 더하기 9, 639예요.")
        self.play(FadeIn(tot), run_time=0.6)
        tip = M("세로셈은 이 계산을 짧게 적은 것이에요", 38).move_to([0, -2.3, 0])
        self.play(FadeIn(tip), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def carry128(self):
        self.section("10개가 넘으면? 128 × 3")
        q = M(f"공연장 좌석이 {cm('1', 2)}{cm('2', 1)}{cm('8', 0)}석씩 {b('3층')}이에요", 50).move_to([0, 2.4, 0])
        self.say("공연장 좌석이 128석씩 3층", "이번에는 공연장 좌석이 128석씩 3층이에요. 128 곱하기 3을 알아볼까요?")
        self.play(FadeIn(q), run_time=0.6)
        rows = blocks_rows(128, 3, size=0.1).move_to([-3.4, 0.0, 0])
        self.play(LaggedStart(*[FadeIn(r) for r in rows], lag_ratio=0.3, run_time=1.2))
        m1 = M(f"{cm('일', 0)}: 8 × 3 = {cm('24', 0)}", 46).move_to([3.0, 1.2, 0])
        self.say(f"일 모형 8개씩 3줄 = {cm('24개', 0)}", "일 모형은 8개씩 3줄, 8 곱하기 3은 24개예요.")
        self.play(*[Indicate(r[2], color=ORANGE, scale_factor=1.15) for r in rows], FadeIn(m1), run_time=0.9)
        m2 = M(f"일 모형 {cm('10개', 0)} = 십 모형 {cm('1개', 1)}\n{cm('24', 0)} = 십 모형 {cm('2개', 1)} + 일 모형 {cm('4개', 0)}", 40).move_to([3.0, 0.1, 0])
        m2.scale_to_fit_width(min(m2.width, 6.6))
        self.say(f"일 모형 {cm('10개', 0)}는 십 모형 {cm('1개', 1)}로 바꿔요", "일 모형이 10개 모이면 십 모형 1개로 바꿀 수 있어요. 24개 중 20개는 십 모형 2개가 되고, 4개가 남아요.")
        self.play(FadeIn(m2), run_time=0.6)
        self.wait(0.8)
        m3 = M(f"그래서 {cm('2', 1)}를 {cm('십의 자리', 1)}로 {g('올려요')}", 46).move_to([3.0, -1.2, 0])
        self.say(f"{cm('2', 1)}를 {cm('십의 자리', 1)}로 올림", "그래서 일의 자리에는 4를 쓰고, 2를 십의 자리로 올려요. 이것을 올림이라고 해요.")
        self.play(FadeIn(m3), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
