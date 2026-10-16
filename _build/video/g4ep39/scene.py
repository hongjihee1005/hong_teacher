"""「수학 원리 돋보기」 4학년 39화 — 0.01보다 작은 수, 0.001 (4-2 3단원 4~5차시, 화 코드 4-2-3-b)

0.01 한 칸을 확대해 다시 10칸 → 1/1000 = 0.001(영 점 영영일)
125/1000 = 0.125(영 점 일이오), 1.853 = 1 + 0.8 + 0.05 + 0.003
최종: GRADE=4 ./make_final.sh 39
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, Line, Rectangle, SurroundingRectangle,
                   VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, row
from decimal4 import GREEN2, dec_markup, grid100


class G4Ep39(EpisodeScene):
    GRADE, SEM = 4, 2
    EP_NO = 39
    EP_TITLE = "0.01보다 작은 수, 0.001"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.zoom()
        self.example()
        self.places()
        self.closing(f"1을 1000으로 나눈 하나는 {sp('0.001', GREEN2)} (영 점 영영일)\n소수 셋째 자리 숫자는 {sp('0.001', GREEN2)}이 몇 개인지 나타내요",
                     next_preview="4학년 40화 · 0.3과 0.30은 같을까?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("0.01보다 더 작은 수도 있을까요?", 50).move_to([0.6, 1.8, 0])
        n = M(dec_markup("1.853"), 110).move_to([0, -0.2, 0])
        self.say("0.01보다 작은 수", "할아버지가 강아지 몸무게를 1.853킬로그램이라고 하셨어요. 0.01보다 더 작은 자리도 있을까요?")
        self.play(Write(q), FadeIn(n), run_time=1.2)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def zoom(self):
        self.section("한 칸을 다시 10으로")
        gd = grid100(1, 3.6).move_to([-4.0, 0.3, 0])
        self.say(f"모눈 한 칸은 {o('0.01')}", "100칸 모눈의 한 칸은 0.01이었어요.")
        self.play(FadeIn(gd), run_time=0.6)
        big = VGroup(*[Rectangle(width=0.42, height=3.6, fill_color=GREEN2 if i == 0 else "#FFE2C2", fill_opacity=1,
                                 stroke_color=SOFT, stroke_width=2) for i in range(10)]).arrange(RIGHT, buff=0).move_to([1.6, 0.3, 0])
        frame = Rectangle(width=4.2, height=3.6, stroke_color=ORANGE, stroke_width=5).move_to(big)
        l1 = Line(gd[0][0].get_corner(UP + RIGHT), frame.get_corner(UP + LEFT), color=ORANGE, stroke_width=3)
        l2 = Line(gd[0][0].get_corner(DOWN + RIGHT), frame.get_corner(DOWN + LEFT), color=ORANGE, stroke_width=3)
        self.say("그 한 칸을 크게 확대해서 10칸으로", "그 한 칸을 크게 확대해서 다시 똑같이 10칸으로 나누어 볼까요?")
        self.play(Create(l1), Create(l2), FadeIn(big), Create(frame), run_time=1.2)
        e = VGroup(row(frac(1, 1000, 46), size=46), M(sp("= 0.001", GREEN2), 60), M("영 점 영영일", 42, SOFT)).arrange(DOWN, buff=0.3).move_to([5.3, 0.3, 0])
        self.say(f"그중 하나 = 1/1000 = {sp('0.001', GREEN2)}", "그중 한 칸은 1을 1000으로 나눈 하나, 1000분의 1이에요. 0.001이라 쓰고 영 점 영영일이라고 읽어요.")
        self.play(FadeIn(e), run_time=0.7)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def example(self):
        self.section("0.125")
        l1 = row(frac(125, 1000, 64), "=", M(sp("0.125", GREEN2), 80), size=64).move_to([0, 1.3, 0])
        l2 = M("영 점 일이오", 52, SOFT).move_to([0, 0.0, 0])
        l3 = M(f"0.001이 {sp('125개', GREEN2)}", 56).move_to([0, -1.1, 0])
        self.say(f"125/1000 = {sp('0.125', GREEN2)}", "1000분의 125는 0.125. 영 점 일이오라고 읽어요. 소수점 아래는 숫자를 하나씩 읽어요.")
        self.play(FadeIn(l1), FadeIn(l2), run_time=0.7)
        self.say(f"0.001이 {sp('125개', GREEN2)}", "0.125는 0.001이 125개인 수예요.")
        self.play(FadeIn(l3), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def places(self):
        self.section("1.853")
        n = M(dec_markup("1.853"), 120).move_to([0, 1.8, 0])
        self.play(FadeIn(n), run_time=0.5)
        rows = VGroup(M("1이 1개 → 1", 44), M(f"0.1이 {o('8개')} → {o('0.8')}", 44), M(f"0.01이 {b('5개')} → {b('0.05')}", 44),
                      M(f"0.001이 {sp('3개', GREEN2)} → {sp('0.003', GREEN2)}", 44)).arrange(DOWN, aligned_edge=LEFT, buff=0.22).move_to([0, -0.5, 0])
        self.say("1.853을 자리마다 나누면", "1.853은 1이 1개, 0.1이 8개, 0.01이 5개, 0.001이 3개인 수예요.")
        for r in rows:
            self.play(FadeIn(r, shift=RIGHT * 0.2), run_time=0.45)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()


def sp(v, c):
    return f'<span foreground="{c}">{v}</span>'
