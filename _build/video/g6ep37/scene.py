"""「수학 원리 돋보기」 6학년 37화 — (분수) ÷ (분수)를 곱셈으로 (6-2 1단원 6차시, 화 코드 6-2-1-e)

바닷물 4/5 L로 수조의 2/3가 찼다면 수조의 1/3에는 4/5 ÷ 2 = 2/5 (L), 수조 가득은 2/5 × 3 = 6/5 = 1 1/5 (L)
4/5 ÷ 2/3 = 4/5 ÷ 2 × 3 = 4/5 × 1/2 × 3 = 4/5 × 3/2 → 나눗셈을 곱셈으로 바꾸고 나누는 분수의 분자와 분모를 바꿈
최종: GRADE=6 ./make_final.sh 37
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Brace, Create, CurvedArrow, FadeIn, FadeOut, Indicate, LaggedStart, Line,
                   Rectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, mixed, row


class G6Ep37(EpisodeScene):
    GRADE, SEM = 6, 2
    EP_NO = 37
    EP_TITLE = "(분수) ÷ (분수)를 곱셈으로"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.tank()
        self.flip()
        self.closing(f"(분수) ÷ (분수)는 나눗셈을 {o('곱셈')}으로 바꾸고\n나누는 분수의 {b('분자와 분모를 바꾸어')} 곱해요",
                     next_preview="6학년 38화 · (대분수) ÷ (분수)")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("바닷물 4/5 L를 부었더니 수조의 2/3가 찼어요.\n수조를 가득 채우려면 몇 L가 필요할까요?", 42).move_to([0.6, 1.6, 0])
        self.say("4/5 ÷ 2/3는?", "바닷물 5분의 4 리터를 부었더니 수조의 3분의 2가 찼어요. 수조를 가득 채우려면 바닷물이 몇 리터 필요할까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def tank(self):
        self.section("수조로 생각하기")
        H = 3.3
        cells = VGroup(*[Rectangle(width=2.2, height=H / 3, fill_color=PAPER, fill_opacity=1, stroke_color=INK, stroke_width=3) for _ in range(3)]).arrange(UP, buff=0).move_to([-4.0, 0.3, 0])
        self.play(FadeIn(cells), run_time=0.4)
        self.play(cells[0].animate.set_fill(BLUE, 0.55), cells[1].animate.set_fill(BLUE, 0.55), run_time=0.5)
        br = Brace(VGroup(cells[0], cells[1]), LEFT, color=BLUE)
        bt = M(b("4/5 L"), 30).next_to(br, LEFT, buff=0.08)
        self.play(FadeIn(br), FadeIn(bt), run_time=0.4)
        e1 = row("수조의", frac(1, 3, 40), ":", frac(4, 5, 44), "÷ 2 =", frac(2, 5, 44, cn=ORANGE), "(L)", size=42).move_to([2.0, 1.5, 0])
        self.say(f"수조의 1/3: 4/5 ÷ 2 = {o('2/5')}", "2칸에 5분의 4 리터가 들어 있으니 한 칸, 곧 수조의 3분의 1에는 5분의 4 나누기 2, 5분의 2 리터가 들어가요.")
        self.play(FadeIn(e1), FadeIn(M(o("2/5"), 30).move_to(cells[0])), FadeIn(M(o("2/5"), 30).move_to(cells[1])), run_time=0.7)
        e2 = row("수조 가득:", frac(2, 5, 44), "× 3 =", frac(6, 5, 44, cn=GREEN, cd=GREEN), "=", mixed(1, 1, 5, 44, cw=GREEN, cn=GREEN, cd=GREEN), "(L)", size=42).move_to([2.0, 0.0, 0])
        self.say(f"가득: 2/5 × 3 = {g('1과 1/5 L')}", "수조 가득은 3칸이니 5분의 2 곱하기 3, 5분의 6, 1과 5분의 1 리터예요.")
        self.play(cells[2].animate.set_fill(GREEN, 0.4), FadeIn(M(g("2/5"), 30).move_to(cells[2])), FadeIn(e2), run_time=0.7)
        e3 = M(f"4/5 ÷ 2/3 = 4/5 {o('÷ 2')} {b('× 3')}", 40).move_to([2.0, -1.4, 0])
        self.say(f"÷ 2/3는 {o('÷ 2')}를 하고 {b('× 3')}", "그러니까 3분의 2로 나누는 것은 2로 나누고 3을 곱하는 것과 같아요.")
        self.play(FadeIn(e3), run_time=0.6)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def flip(self):
        self.section("분자와 분모를 바꾸어 곱하기")
        e1 = row(frac(4, 5, 54), "÷", frac(2, 3, 54), "=", frac(4, 5, 54), M(f"{o('÷ 2')}", 54), M(f"{b('× 3')}", 54), size=52).move_to([0, 1.7, 0])
        self.play(FadeIn(e1), run_time=0.5)
        e2 = row("=", frac(4, 5, 54), "×", frac(1, 2, 54, cn=ORANGE, cd=ORANGE), "× 3", "=", frac(4, 5, 54), "×", frac(3, 2, 54, cn=BLUE, cd=ORANGE), size=52).move_to([0.4, 0.2, 0])
        self.say(f"÷ 2는 × 1/2, 그래서 {b('× 3/2')}", "2로 나누는 것은 2분의 1을 곱하는 것과 같아요. 2분의 1 곱하기 3은 2분의 3이니, 5분의 4 곱하기 2분의 3이 돼요.")
        self.play(FadeIn(e2), run_time=0.8)
        f = frac(2, 3, 60).move_to([-5.2, -1.5, 0])
        f2 = frac(3, 2, 60, cn=BLUE, cd=ORANGE).move_to([-3.0, -1.5, 0])
        ar = CurvedArrow(f.get_right() + RIGHT * 0.15, f2.get_left() + LEFT * 0.15, color=SOFT, angle=-1.0)
        t = M(f"나누는 분수의 {b('분자와 분모를 바꾸어')} 곱해요", 32).move_to([2.0, -1.5, 0])
        self.say(f"나누는 분수를 {b('뒤집어')} 곱해요", "그래서 분수의 나눗셈은 나눗셈을 곱셈으로 바꾸고 나누는 분수의 분자와 분모를 바꾸어 곱하면 돼요. 5분의 4 곱하기 2분의 3은 5분의 6이에요.")
        self.play(FadeIn(f), run_time=0.3)
        self.play(Create(ar), FadeIn(f2), FadeIn(t), run_time=0.8)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
