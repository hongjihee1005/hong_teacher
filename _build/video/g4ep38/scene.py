"""「수학 원리 돋보기」 4학년 38화 — 0.1보다 작은 수, 0.01 (4-2 3단원 소수의 덧셈과 뺄셈 2~3차시, 화 코드 4-2-3-a)

1/100 = 0.01(영 점 영일), 17/100 = 0.17(영 점 일칠, 0.01이 17개)
1.76: 1은 일의 자리 1, 7은 소수 첫째 자리 0.7, 6은 소수 둘째 자리 0.06
최종: GRADE=4 ./make_final.sh 38
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, SurroundingRectangle,
                   VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, row
from decimal4 import grid100, dec_markup


class G4Ep38(EpisodeScene):
    GRADE, SEM = 4, 2
    EP_NO = 38
    EP_TITLE = "0.1보다 작은 수, 0.01"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.hundredth()
        self.seventeen()
        self.places()
        self.closing(f"1을 100으로 나눈 하나는 {o('0.01')} (영 점 영일)\n소수 둘째 자리 숫자는 {b('0.01')}이 몇 개인지 나타내요",
                     next_preview="4학년 39화 · 0.01보다 작은 수, 0.001")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("할아버지 댁 저울이 1.76 kg을 가리켜요.\n0.1보다 작은 자리는 무엇일까요?", 46)
        q.scale_to_fit_width(min(q.width, 10.6)).move_to([0.6, 1.6, 0])
        n = M(dec_markup("1.76"), 110).move_to([0, -0.5, 0])
        self.say("1.76의 6은 무엇을 뜻할까요?", "할아버지 댁 저울이 1.76킬로그램을 가리켜요. 끝의 6은 무엇을 뜻할까요?")
        self.play(Write(q), FadeIn(n), run_time=1.2)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def hundredth(self):
        self.section("0.01")
        gd = grid100(0, 4.0).move_to([-3.0, 0.3, 0])
        self.say("1을 100칸으로 나누어요", "큰 정사각형 하나를 1이라고 하고, 똑같이 100칸으로 나누어요.")
        self.play(FadeIn(gd), run_time=0.7)
        self.say(f"한 줄(10칸)은 {o('0.1')}", "한 줄, 10칸은 1을 10으로 나눈 하나, 0.1이에요.")
        self.play(*[gd[0][i].animate.set_fill(BLUE) for i in range(10)], run_time=0.7)
        self.play(*[gd[0][i].animate.set_fill("#FFFFFF") for i in range(10)], run_time=0.4)
        self.play(gd[0][0].animate.set_fill(ORANGE), run_time=0.5)
        e = VGroup(row("1칸 =", frac(1, 100, 52), size=52), M(f"= {o('0.01')}", 70), M("영 점 영일", 48, SOFT)).arrange(DOWN, buff=0.35).move_to([3.2, 0.5, 0])
        self.say(f"1칸 = 1/100 = {o('0.01')}", "그중 한 칸은 100분의 1, 소수로 0.01이라 쓰고 영 점 영일이라고 읽어요.")
        self.play(FadeIn(e), run_time=0.7)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def seventeen(self):
        self.section("0.17")
        gd = grid100(17, 4.0).move_to([-3.0, 0.3, 0])
        self.say("17칸을 칠하면?", "이번에는 17칸을 칠했어요.")
        self.play(FadeIn(gd), run_time=0.7)
        e = VGroup(row(frac(17, 100, 52), "=", M(o("0.17"), 66), size=52), M("영 점 일칠", 48, SOFT),
                   M(f"0.01이 {o('17개')}", 50)).arrange(DOWN, buff=0.35).move_to([3.2, 0.5, 0])
        self.say(f"17/100 = {o('0.17')} (영 점 일칠)", "100분의 17은 0.17, 영 점 일칠이라고 읽어요. 0.01이 17개예요.")
        self.play(FadeIn(e), run_time=0.7)
        self.say("0.1이 1개, 0.01이 7개", "한 줄 0.1과 남은 7칸 0.07을 합한 것으로도 볼 수 있어요.")
        self.play(Indicate(VGroup(*gd[0][:10]), color=BLUE, scale_factor=1.03), run_time=0.7)
        self.play(Indicate(VGroup(*gd[0][10:17]), color=ORANGE, scale_factor=1.05), run_time=0.7)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def places(self):
        self.section("자리마다 나타내는 값")
        n = M(dec_markup("1.76"), 130).move_to([0, 1.7, 0])
        self.say("1.76의 숫자들", "처음 문제의 1.76을 살펴봐요.")
        self.play(FadeIn(n), run_time=0.5)
        rows = VGroup(M(f"1 → 일의 자리 → 1", 46),
                      M(f"{o('7')} → 소수 첫째 자리 → {o('0.7')}", 46),
                      M(f"{b('6')} → 소수 둘째 자리 → {b('0.06')}", 46)).arrange(DOWN, aligned_edge=LEFT, buff=0.3).move_to([0, -0.5, 0])
        nar = [("1은 일의 자리 → 1", "1은 일의 자리 숫자로 1을 나타내요."),
               (f"{o('7')}은 소수 첫째 자리 → {o('0.7')}", "7은 소수 첫째 자리 숫자로 0.7을 나타내요."),
               (f"{b('6')}은 소수 둘째 자리 → {b('0.06')}", "6은 소수 둘째 자리 숫자로 0.06을 나타내요.")]
        for r, (mk, t) in zip(rows, nar):
            self.say(mk, t)
            self.play(FadeIn(r, shift=RIGHT * 0.2), run_time=0.5)
        self.say(f"1.76 = 1 + {o('0.7')} + {b('0.06')}", "그래서 1.76은 1과 0.7과 0.06을 더한 수예요.")
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
