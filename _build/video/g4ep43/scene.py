"""「수학 원리 돋보기」 4학년 43화 — 소수의 뺄셈 (4-2 3단원 10·11차시, 화 코드 4-2-3-f)

1.3 − 0.6: 1을 0.1 열 개로 풀어 0.1이 13개 − 6개 = 7개 → 0.7
5.2 − 2.47 = 2.73 (끝에 0을 붙여 5.20, 받아내림 두 번)
최종: GRADE=4 ./make_final.sh 43
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, Cross, FadeIn, FadeOut, Indicate, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac_bar
from decimal4 import dec_vertical

RED = "#C0392B"


class G4Ep43(EpisodeScene):
    GRADE, SEM = 4, 2
    EP_NO = 43
    EP_TITLE = "소수의 뺄셈"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.tenths()
        self.section("1.3 − 0.6 세로셈")
        self.say("세로셈으로 1.3 − 0.6", "1.3 빼기 0.6을 세로셈으로도 계산해 볼게요.")
        r = dec_vertical(self, "1.3", "0.6", "-")
        self.say(f"1.3 − 0.6 = {g(r)}", f"1.3 빼기 0.6은 {r}이에요.")
        self.wait(1.0)
        self.settle(); clear_stage(self, 0.6)
        self.section("5.2 − 2.47")
        self.say(f"5.2를 {o('5.20')}으로 생각해요", "5.2 빼기 2.47은 소수점 아래 자리 수가 달라요. 5.2 끝에 0을 붙여 5.20으로 생각해요.")
        r = dec_vertical(self, "5.2", "2.47", "-")
        self.say(f"5.2 − 2.47 = {g(r)}", f"5.2 빼기 2.47은 {r}이에요.")
        self.wait(1.2)
        self.settle(); clear_stage(self, 0.6)
        self.hide_chip()
        self.closing(f"소수의 뺄셈도 {o('소수점')}을 맞추고 같은 자리끼리 빼요\n뺄 수 없으면 {g('윗자리에서 받아내림')}",
                     next_preview="4학년 44화 · 수직과 수선")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("리본 1.3 m 중에서 0.6 m를 썼어요. 남은 리본은?", 46)
        q.scale_to_fit_width(min(q.width, 10.4)).move_to([0.6, 1.6, 0])
        self.say("1.3 − 0.6은?", "리본 1.3미터 중에서 0.6미터를 썼어요. 남은 리본은 몇 미터일까요?")
        self.play(Write(q), run_time=0.9)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def tenths(self):
        self.section("0.1이 몇 개?")
        one = frac_bar(10, 10, 5.0, 0.7, BLUE)
        part = frac_bar(10, 3, 5.0, 0.7, BLUE)
        bars = VGroup(one, part).arrange(RIGHT, buff=0.25).move_to([0, 1.3, 0])
        lab = T("1.3", 44).next_to(bars, LEFT, buff=0.3)
        self.say(f"1.3은 0.1이 {b('13개')}", "1.3을 막대로 나타내면 1과 0.3이에요. 1을 0.1 열 개로 풀면 0.1이 모두 13개예요.")
        self.play(FadeIn(bars), FadeIn(lab), run_time=0.7)
        xs = VGroup(*[Cross(c, stroke_color=RED, stroke_width=5) for c in list(part[:3]) + list(one[7:])])
        self.say(f"0.1 {o('6개')}를 덜어 내면", "여기서 0.6, 0.1 6개를 덜어 내 볼까요?")
        self.play(Create(xs), *[c.animate.set_fill(PAPER) for c in list(part[:3]) + list(one[7:])], run_time=0.9)
        res = M(f"0.1이 13 − 6 = {g('7개')} → {g('0.7')}", 54).move_to([0, -0.4, 0])
        self.say(f"0.1이 {g('7개')} 남아요 → {g('0.7')}", "0.1이 7개 남았어요. 남은 리본은 0.7미터예요.")
        self.play(FadeIn(res), run_time=0.6)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)
