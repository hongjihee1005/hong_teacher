"""「수학 원리 돋보기」 4학년 13화 — 123 × 20은 어떻게 계산할까? (4-1 3단원 곱셈과 나눗셈 2차시, 화 코드 4-1-3-a)

123 × 2 = 246 → 123 × 20 = 2460 (× 20 = × 2 × 10, 10배 하면 0이 하나 붙음)
수모형: 123씩 20묶음 = (123씩 2묶음)이 10개 / 세로셈 / 214 × 30 = 6420
최종: GRADE=4 ./make_final.sh 13
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, RoundedRectangle,
                   SurroundingRectangle, Transform, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from base10 import number_blocks
from mul2 import VertMul


class G4Ep13(EpisodeScene):
    GRADE, SEM = 4, 1
    EP_NO = 13
    EP_TITLE = "123 × 20은 어떻게 계산할까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.groups()
        self.chain()
        self.vertical()
        self.second()
        self.closing(f"(세 자리 수) × (몇십)은 (세 자리 수) × (몇)을 구한 뒤\n{o('10배')} → 끝에 {g('0을 하나')} 붙여요",
                     next_preview="4학년 14화 · (세 자리 수) × (몇십몇)")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M(f"가정의 달 축제에서 풍선을 한 묶음에 {b('123개')}씩\n{o('20묶음')} 나누어 주었어요. 모두 몇 개일까요?", 48)
        q.scale_to_fit_width(min(q.width, 11.0)).move_to([0, 1.4, 0])
        self.say("123개씩 20묶음", "가정의 달 축제에서 풍선을 한 묶음에 123개씩 20묶음 나누어 주었어요. 모두 몇 개일까요?")
        self.play(Write(q), run_time=1.3)
        e = M("123 × 20 = ?", 100).move_to([0, -0.8, 0])
        self.play(FadeIn(e), run_time=0.6)
        self.wait(1.0)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def groups(self):
        self.section("20묶음 = 2묶음이 10개")
        pair = VGroup(*[number_blocks(123, size=0.06, ones_cols=1) for _ in range(2)]).arrange(RIGHT, buff=0.12)
        box = RoundedRectangle(corner_radius=0.12, width=pair.width + 0.3, height=pair.height + 0.3, stroke_color=ORANGE,
                               stroke_width=4, fill_color=PAPER, fill_opacity=1)
        unit = VGroup(box, pair.move_to(box))
        self.say("123씩 2묶음을 한 상자에", "123씩 2묶음을 한 상자에 담으면 246이에요.")
        unit.move_to([0, 1.4, 0]).scale(1.6)
        lab = M(f"123 × 2 = {o('246')}", 50).next_to(unit, DOWN, buff=0.3)
        self.play(FadeIn(unit), FadeIn(lab), run_time=0.8)
        self.wait(0.6)
        boxes = VGroup(*[unit.copy().scale(1 / 1.6) for _ in range(10)]).arrange_in_grid(rows=2, buff=(0.25, 0.3)).move_to([0, 0.5, 0])
        boxes.scale_to_fit_width(min(boxes.width, 12.0))
        self.say(f"이런 상자가 {o('10개')}이면 20묶음", "이런 상자가 10개 있으면 123씩 20묶음이 돼요.")
        self.play(FadeOut(lab), Transform(unit, boxes[0]), run_time=0.7)
        self.play(LaggedStart(*[FadeIn(x) for x in boxes[1:]], lag_ratio=0.1, run_time=1.2))
        t = M(f"246이 10개 → {g('2460')}", 56).move_to([0, -1.9, 0])
        self.say(f"246이 10개 → {g('2460')}", "246이 10개이면 2460이에요.")
        self.play(FadeIn(t), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def chain(self):
        self.section("× 2 하고 × 10")
        l1 = M(f"123 × {o('2')} = 246", 64).move_to([0, 1.6, 0])
        l2 = M(f"123 × {b('20')} = 123 × {o('2')} × {b('10')}", 56).move_to([0, 0.4, 0])
        l3 = M(f"= 246 × {b('10')} = 246{g('0')}", 64).move_to([0, -0.8, 0])
        self.say(f"20은 {o('2')} × {b('10')}", "20은 2 곱하기 10이에요. 그래서 123 곱하기 20은 123 곱하기 2를 먼저 하고, 10배 하면 돼요.")
        self.play(FadeIn(l1), run_time=0.5)
        self.play(FadeIn(l2), run_time=0.6)
        self.say(f"10배 하면 끝에 {g('0이 하나')} 붙어요", "어떤 수를 10배 하면 끝에 0이 하나 붙어요. 246의 10배는 2460.")
        self.play(FadeIn(l3), run_time=0.6)
        self.play(Indicate(l3[-1], color=GREEN, scale_factor=1.6), run_time=0.8)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def vertical(self):
        self.section("세로셈으로")
        v = VertMul(self, 123, 20, x_right=-0.6, y0=2.1)
        self.say("세로셈으로 써 볼까요?", "세로셈으로 써 볼까요?")
        v.show()
        self.say(f"먼저 일의 자리에 {g('0')}을 써요", "곱하는 수 20의 일의 자리는 0이에요. 그래서 먼저 답의 일의 자리에 0을 써요.")
        y = v.y0 - v.dy * 2.15
        z = T("0", v.F, GREEN).move_to([v.x(0), y, 0])
        self.play(FadeIn(z, shift=DOWN * 0.15), run_time=0.5)
        self.say(f"그다음 123 × {o('2')} = {o('246')}을 앞에", "그다음 123 곱하기 2, 246을 0 앞에 차례로 써요.")
        r = VGroup(*[T(ch, v.F, ORANGE).move_to([v.x(3 - i), y, 0]) for i, ch in enumerate("246")])
        self.play(LaggedStart(*[FadeIn(d, shift=DOWN * 0.15) for d in r[::-1]], lag_ratio=0.15, run_time=0.9))
        ans = M(f"123 × 20 = {g('2460')}", 56).move_to([3.6, 0.6, 0])
        self.say(f"풍선은 모두 {g('2460개')}", "그래서 풍선은 모두 2460개예요.")
        self.play(FadeIn(ans), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def second(self):
        self.section("해 보기")
        q = M("214 × 30 = ?", 84).move_to([0, 1.6, 0])
        self.say("214 × 30은?", "214 곱하기 30은 얼마일까요?")
        self.play(FadeIn(q), run_time=0.5)
        self.pause_screen(5)
        a1 = M(f"214 × {o('3')} = {o('642')}", 60).move_to([0, 0.2, 0])
        a2 = M(f"214 × {b('30')} = 642{g('0')}", 60).move_to([0, -1.0, 0])
        self.say(f"214 × 3 = 642 → {g('6420')}", "214 곱하기 3은 642. 10배 하면 6420이에요.")
        self.play(FadeIn(a1), run_time=0.5)
        self.play(FadeIn(a2), run_time=0.5)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
