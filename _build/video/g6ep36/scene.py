"""「수학 원리 돋보기」 6학년 36화 — (자연수) ÷ (분수) (6-2 1단원 5차시, 화 코드 6-2-1-d)

아라온호가 6 km를 가는 데 2/3시간 → 1시간 동안 가는 거리는 6 ÷ 2/3
1/3시간 동안 6 ÷ 2 = 3 (km), 1시간 동안 3 × 3 = 9 (km)
(자연수) ÷ (분수): 자연수를 분자로 나누고 분모를 곱함 6 ÷ 2/3 = (6 ÷ 2) × 3 = 9 / 또는 18/3 ÷ 2/3 = 18 ÷ 2 = 9
최종: GRADE=6 ./make_final.sh 36
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Brace, Create, FadeIn, FadeOut, Indicate, LaggedStart, Line, Rectangle,
                   VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, row


class G6Ep36(EpisodeScene):
    GRADE, SEM = 6, 2
    EP_NO = 36
    EP_TITLE = "(자연수) ÷ (분수)"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.time_bar()
        self.rule()
        self.closing(f"(자연수) ÷ (분수)는 자연수를 {o('분자로 나누고')} {b('분모를 곱해요')}\n6 ÷ 2/3 = (6 ÷ 2) × 3 = {g('9')}",
                     next_preview="6학년 37화 · (분수) ÷ (분수)를 곱셈으로")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("쇄빙선 아라온호가 6 km를 가는 데 2/3시간이 걸렸어요.\n1시간 동안에는 몇 km를 갈까요?", 40).move_to([0.6, 1.6, 0])
        self.say("6 ÷ 2/3는?", "쇄빙선 아라온호가 6 킬로미터를 가는 데 3분의 2시간이 걸렸어요. 같은 빠르기로 1시간 동안에는 몇 킬로미터를 갈까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def time_bar(self):
        self.section("1/3시간씩 생각하기")
        W = 9.0
        cells = VGroup(*[Rectangle(width=W / 3, height=0.9, fill_color=PAPER, fill_opacity=1, stroke_color=INK, stroke_width=3) for _ in range(3)]).arrange(RIGHT, buff=0).move_to([0, 1.4, 0])
        top = T("1시간", 28, SOFT).next_to(cells, UP, buff=0.15)
        self.play(FadeIn(cells), FadeIn(top), run_time=0.5)
        self.say(f"2/3시간에 {o('6 km')}", "1시간을 3칸으로 나누면 2칸이 3분의 2시간이에요. 이 2칸 동안 6 킬로미터를 갔어요.")
        self.play(cells[0].animate.set_fill(ORANGE, 0.6), cells[1].animate.set_fill(ORANGE, 0.6), run_time=0.5)
        br = Brace(VGroup(cells[0], cells[1]), DOWN, color=ORANGE)
        bt = M(o("6 km"), 32).next_to(br, DOWN, buff=0.08)
        self.play(FadeIn(br), FadeIn(bt), run_time=0.4)
        k1 = M(f"{b('3 km')}", 32).move_to(cells[0])
        k2 = M(f"{b('3 km')}", 32).move_to(cells[1])
        e1 = M(f"1/3시간: 6 ÷ {o('2')} = {b('3')} (km)", 40).move_to([0, -0.6, 0])
        self.say(f"1/3시간에 6 ÷ 2 = {b('3 km')}", "한 칸, 곧 3분의 1시간에는 6 나누기 2, 3 킬로미터를 가요.")
        self.play(FadeIn(k1), FadeIn(k2), FadeIn(e1), run_time=0.6)
        k3 = M(f"{b('3 km')}", 32).move_to(cells[2])
        e2 = M(f"1시간: 3 × {b('3')} = {g('9')} (km)", 40).move_to([0, -1.5, 0])
        self.say(f"1시간에 3 × 3 = {g('9 km')}", "1시간은 3칸이니 3 곱하기 3, 9 킬로미터를 가요.")
        self.play(cells[2].animate.set_fill(BLUE, 0.4), FadeIn(k3), FadeIn(e2), run_time=0.6)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def rule(self):
        self.section("두 가지 방법")
        e1 = row("6 ÷", frac(2, 3, 56, cn=ORANGE, cd=BLUE), "=", M(f"(6 ÷ {o('2')}) × {b('3')}", 54), "=", M(g("9"), 56), size=54).move_to([0, 1.3, 0])
        self.say(f"분자로 나누고 {b('분모를 곱해요')}", "자연수를 분수의 분자로 나누고 분모를 곱하면 돼요. 6 나누기 2 곱하기 3, 9예요.")
        self.play(FadeIn(e1), run_time=0.7)
        e2 = row("6 ÷", frac(2, 3, 56), "=", frac(18, 3, 56, cn=ORANGE), "÷", frac(2, 3, 56), "=", "18 ÷ 2", "=", M(g("9"), 56), size=54).move_to([0, -0.5, 0])
        self.say(f"6 = {o('18/3')}로 바꾸어도 9", "자연수 6을 나누는 수와 분모가 같은 분수 3분의 18로 바꾸어 분자끼리 나누어도 18 나누기 2, 9예요.")
        self.play(FadeIn(e2), run_time=0.7)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
