"""「수학 원리 돋보기」 6학년 3화 — (분수) ÷ (자연수) (6-1 1단원 4차시, 화 코드 6-1-1-c)

다슬기 4/9 t을 트럭 2대에 → 4/9는 1/9이 4개, 4 ÷ 2 = 2 → 4/9 ÷ 2 = (4 ÷ 2)/9 = 2/9
2/3 ÷ 5: 분자 2가 5로 나누어떨어지지 않음 → 크기가 같은 분수 10/15로 → (10 ÷ 5)/15 = 2/15
최종: GRADE=6 ./make_final.sh 3
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Brace, Create, Cross, FadeIn, FadeOut, Indicate, LaggedStart, Line, Rectangle,
                   VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, frac_bar, row

RED = "#C0392B"


class G6Ep03(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 3
    EP_TITLE = "(분수) ÷ (자연수)"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.divisible()
        self.not_divisible()
        self.closing(f"분자가 자연수의 배수이면 {o('분자를 자연수로 나누고')}\n아니면 {b('크기가 같은 분수')}로 바꾸어 나누어요",
                     next_preview="6학년 4화 · ÷ 3은 × 1/3")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("다슬기 4/9 t을 트럭 2대에 똑같이 나누어 실으면\n한 대에 몇 t을 실을까요?", 42).move_to([0.6, 1.6, 0])
        self.say("4/9 ÷ 2는?", "다슬기 9분의 4 톤을 트럭 2대에 똑같이 나누어 실으려고 해요. 한 대에 몇 톤을 실을까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def divisible(self):
        self.section("분자를 나누어요")
        bar = frac_bar(9, 4, width=7.2, height=0.9, color=ORANGE).move_to([-0.6, 1.5, 0])
        lab = frac(4, 9, 40).next_to(bar, LEFT, buff=0.3)
        self.say(f"4/9는 {o('1/9이 4개')}", "9분의 4는 9분의 1이 4개예요.")
        self.play(FadeIn(bar), FadeIn(lab), run_time=0.6)
        self.say("2대에 똑같이 나누면", "9분의 1 4개를 트럭 2대에 똑같이 나누면 한 대에 2개씩이에요.")
        self.play(bar[2].animate.set_fill(BLUE), bar[3].animate.set_fill(BLUE), run_time=0.6)
        br = Brace(VGroup(bar[0], bar[1]), DOWN, color=ORANGE)
        bt = T("한 대", 26, ORANGE).next_to(br, DOWN, buff=0.08)
        self.play(FadeIn(br), FadeIn(bt), run_time=0.4)
        e = row(frac(4, 9, 54), "÷", "2", "=", frac("4 ÷ 2", 9, 54, cn=ORANGE), "=", frac(2, 9, 54, cn=GREEN), size=50).move_to([0, -0.9, 0])
        self.say(f"분자를 나누어 {g('2/9')}", "분자 4를 2로 나누면 돼요. 9분의 4 나누기 2는 9분의 2 톤이에요.")
        self.play(FadeIn(e), run_time=0.7)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def not_divisible(self):
        self.section("나누어떨어지지 않으면")
        bar = frac_bar(3, 2, width=7.5, height=0.9, color=ORANGE).move_to([-0.4, 1.7, 0])
        lab = frac(2, 3, 40).next_to(bar, LEFT, buff=0.3)
        self.say(f"2/3 ÷ 5는? 분자 2를 5로 {o('못 나눠요')}", "3분의 2 나누기 5는 어떨까요? 분자 2는 5로 나누어떨어지지 않아요.")
        self.play(FadeIn(bar), FadeIn(lab), run_time=0.6)
        fine = frac_bar(15, 10, width=7.5, height=0.9, color=ORANGE).move_to(bar.get_center())
        lab2 = frac(10, 15, 40, cn=BLUE, cd=BLUE).move_to(lab.get_center())
        self.say(f"더 잘게 나누면 {b('10/15')}", "한 칸을 5칸으로 더 잘게 나누면 3분의 2는 15분의 10과 크기가 같아요.")
        self.play(FadeOut(bar), FadeIn(fine), FadeOut(lab), FadeIn(lab2), run_time=0.9)
        self.say("10칸을 5로 나누면 2칸씩", "15분의 1이 10개이니 5로 나누면 2개씩이에요.")
        self.play(LaggedStart(*[fine[i].animate.set_fill([ORANGE, BLUE, GREEN, "#7A4FB5", "#D9668C"][i // 2], opacity=1) for i in range(10)], lag_ratio=0.06, run_time=1.0))
        e = row(frac(2, 3, 50), "÷", "5", "=", frac(10, 15, 50, cn=BLUE, cd=BLUE), "÷", "5", "=", frac("10 ÷ 5", 15, 50, cn=ORANGE), "=", frac(2, 15, 50, cn=GREEN), size=46)
        e.scale_to_fit_width(min(e.width, 12.4)).move_to([0, -0.5, 0])
        self.say(f"= {g('2/15')}", "3분의 2 나누기 5는 15분의 10 나누기 5, 15분의 2예요. 분자가 자연수의 배수인 분수로 바꾸어 나누어요.")
        self.play(FadeIn(e), run_time=0.8)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
