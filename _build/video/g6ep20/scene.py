"""「수학 원리 돋보기」 6학년 20화 — 비율이란? (6-1 4단원 4차시, 화 코드 6-1-4-c)

기준량에 대한 비교하는 양의 크기 = 비율, (비율) = (비교하는 양) ÷ (기준량)
2 : 5 → 2/5 = 0.4 (분수로도 소수로도), 비율은 1보다 클 수도 있음 (예: 5 : 2 → 5/2 = 2.5)
최종: GRADE=6 ./make_final.sh 20
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Brace, Create, FadeIn, FadeOut, Indicate, LaggedStart, Rectangle, VGroup,
                   Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, frac_bar, row


class G6Ep20(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 20
    EP_TITLE = "비율이란?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.rate()
        self.big()
        self.closing(f"(비율) = ({o('비교하는 양')}) ÷ ({b('기준량')})\n비율은 분수로도 소수로도 나타내요   2 : 5 → 2/5 = {g('0.4')}",
                     next_preview="6학년 21화 · 생활 속 비율")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("비 2 : 5를 하나의 수로 나타낼 수 있을까요?", 46).move_to([0.6, 1.6, 0])
        self.say("2 : 5를 하나의 수로?", "비 2 대 5를 하나의 수로 나타낼 수 있을까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def rate(self):
        self.section("비율")
        base = frac_bar(5, 0, width=6.0, height=0.8, color=BLUE).move_to([0.6, 1.9, 0])
        for c in base:
            c.set_fill(BLUE, 0.35)
        comp = frac_bar(5, 2, width=6.0, height=0.8, color=ORANGE)[:2].align_to(base, LEFT).shift(DOWN * 1.1)
        comp.set_y(0.8)
        lb = M(b("기준량 5"), 30).next_to(base, LEFT, buff=0.3)
        lc = M(o("비교하는 양 2"), 30).next_to(comp, LEFT, buff=0.3).align_to(lb, RIGHT)
        self.say(f"기준량 {b('5')}에 대한 비교하는 양 {o('2')}", "2 대 5에서 기준량은 5, 비교하는 양은 2예요. 기준량을 1로 볼 때 비교하는 양은 얼마일까요?")
        self.play(FadeIn(base), FadeIn(lb), run_time=0.5)
        self.play(FadeIn(comp), FadeIn(lc), run_time=0.5)
        e = row("(비율) =", M(f"({o('비교하는 양')})", 40), "÷", M(f"({b('기준량')})", 40), size=40).move_to([0, -0.4, 0])
        self.say(f"(비율) = (비교하는 양) ÷ (기준량)", "기준량에 대한 비교하는 양의 크기를 비율이라고 해요. 비교하는 양을 기준량으로 나누어 구해요.")
        self.play(FadeIn(e), run_time=0.6)
        r = row("2 ÷ 5 =", frac(2, 5, 50, cn=ORANGE, cd=BLUE), "=", M(g("0.4"), 50), size=48).move_to([0, -1.6, 0])
        self.say(f"2 ÷ 5 = 2/5 = {g('0.4')}", "2 나누기 5는 5분의 2, 소수로 0.4예요. 비율은 분수로도 소수로도 나타낼 수 있어요.")
        self.play(FadeIn(r), run_time=0.6)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def big(self):
        self.section("1보다 큰 비율")
        base = frac_bar(2, 2, width=2.4, height=0.8, color=BLUE).move_to([-2.0, 1.6, 0])
        comp = frac_bar(5, 5, width=6.0, height=0.8, color=ORANGE).align_to(base, LEFT).set_y(0.4)
        lb = M(b("기준량 2"), 30).next_to(base, LEFT, buff=0.3)
        lc = M(o("비교하는 양 5"), 30).next_to(comp, LEFT, buff=0.3)
        self.say(f"5 : 2라면?", "이번에는 5 대 2예요. 기준량은 2, 비교하는 양은 5예요.")
        self.play(FadeIn(base), FadeIn(lb), FadeIn(comp), FadeIn(lc), run_time=0.6)
        r = row("5 ÷ 2 =", frac(5, 2, 50, cn=ORANGE, cd=BLUE), "=", M(g("2.5"), 50), size=48).move_to([0, -1.2, 0])
        self.say(f"비율 {g('2.5')}: 1보다 클 수도 있어요", "5 나누기 2는 2분의 5, 2.5예요. 비교하는 양이 기준량보다 크면 비율은 1보다 커요.")
        self.play(FadeIn(r), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
