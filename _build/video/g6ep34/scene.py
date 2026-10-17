"""「수학 원리 돋보기」 6학년 34화 — 분자끼리 나누어떨어지지 않을 때 (6-2 1단원 3차시, 화 코드 6-2-1-b)

식수 7/9 L를 2/9 L 컵에 담으면 3컵과 1컵의 반(1/2컵) → 3 1/2컵
5/7 ÷ 2/7 → 1/7이 5개를 2개씩 묶기 → 5 ÷ 2 = 5/2 = 2 1/2 (몫을 분수로, 대분수로 나타내지 않아도 됨)
최종: GRADE=6 ./make_final.sh 34
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, Rectangle,
                   SurroundingRectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, frac_bar, mixed, row

GCOL = [ORANGE, GREEN, "#7A4FB5"]


class G6Ep34(EpisodeScene):
    GRADE, SEM = 6, 2
    EP_NO = 34
    EP_TITLE = "분자끼리 나누어떨어지지 않을 때"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.cups()
        self.rule()
        self.closing(f"분자끼리 나누어떨어지지 않으면 {o('몫을 분수로')} 나타내요\n7/9 ÷ 2/9 = 7 ÷ 2 = 7/2 = {g('3과 1/2')}",
                     next_preview="6학년 35화 · 분모가 다른 (분수) ÷ (분수)")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("식수 7/9 L를 2/9 L씩 컵에 담으면\n몇 컵이 될까요?", 44).move_to([0.6, 1.6, 0])
        self.say("7/9 ÷ 2/9는?", "식수 9분의 7 리터를 9분의 2 리터씩 컵에 담으면 몇 컵이 될까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def cups(self):
        self.section("2/9씩 담기")
        bar = frac_bar(9, 7, width=8.1, height=0.9, color=BLUE).move_to([0.5, 1.7, 0])
        lab = frac(7, 9, 40).next_to(bar, LEFT, buff=0.3)
        self.play(FadeIn(bar), FadeIn(lab), run_time=0.5)
        self.say(f"2/9씩 {o('3컵')}", "9분의 1 7개를 2개씩 담으면 3컵을 채우고 9분의 1이 1개 남아요.")
        boxes = VGroup()
        for k in range(3):
            r = SurroundingRectangle(VGroup(bar[2 * k], bar[2 * k + 1]), color=GCOL[k], buff=0.05, stroke_width=6)
            t = M(f"{k + 1}컵", 28, GCOL[k]).next_to(r, DOWN, buff=0.12)
            boxes.add(r, t)
            self.play(Create(r), FadeIn(t), run_time=0.35)
        half = Rectangle(width=bar[0].width * 2, height=0.9, stroke_color=SOFT, stroke_width=4).move_to(bar[6].get_center() + RIGHT * bar[0].width / 2)
        ht = M(f"{b('1/2')}컵", 28).next_to(half, DOWN, buff=0.12)
        self.say(f"남은 1/9는 한 컵의 {b('반')}", "남은 9분의 1은 9분의 2 컵의 반이에요. 그래서 2분의 1컵이에요.")
        self.play(Create(half), FadeIn(ht), run_time=0.6)
        e = row(frac(7, 9, 52), "÷", frac(2, 9, 52), "=", mixed(3, 1, 2, 54, cw=GREEN, cn=GREEN, cd=GREEN), "(컵)", size=52).move_to([0, -0.9, 0])
        self.say(f"7/9 ÷ 2/9 = {g('3과 1/2')}", "모두 3과 2분의 1컵이에요.")
        self.play(FadeIn(e), run_time=0.6)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def rule(self):
        self.section("몫을 분수로")
        e1 = row(frac(7, 9, 56), "÷", frac(2, 9, 56), "=", "7 ÷ 2", "=", frac(7, 2, 56, cn=ORANGE, cd=ORANGE), "=", mixed(3, 1, 2, 56, cw=GREEN, cn=GREEN, cd=GREEN), size=54).move_to([0, 1.4, 0])
        self.say(f"분자끼리 7 ÷ 2 = {o('7/2')}", "분모가 같으니 분자끼리 나누면 7 나누기 2. 나누어떨어지지 않으니 몫을 분수 2분의 7로 나타내요.")
        self.play(FadeIn(e1), run_time=0.7)
        e2 = row(frac(5, 7, 56), "÷", frac(2, 7, 56), "=", "5 ÷ 2", "=", frac(5, 2, 56, cn=ORANGE, cd=ORANGE), "=", mixed(2, 1, 2, 56, cw=GREEN, cn=GREEN, cd=GREEN), size=54).move_to([0, -0.4, 0])
        self.say(f"5/7 ÷ 2/7 = {g('5/2')}", "7분의 5 나누기 7분의 2도 5 나누기 2, 2분의 5예요. 대분수로 나타내지 않아도 돼요.")
        self.play(FadeIn(e2), run_time=0.7)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
