"""「수학 원리 돋보기」 5학년 17화 — 분수와 소수의 크기 비교 (5-1 4단원 7차시, 화 코드 5-1-4-e)

망고주스 2/5 L와 0.3 L: 2/5 = 4/10 = 0.4 > 0.3 (분수를 소수로) / 0.3 = 3/10 < 4/10 (소수를 분수로)
분모가 10, 100인 분수로 바꾸면 소수로 나타내기 쉬움: 3/4 = 75/100 = 0.75
최종: GRADE=5 ./make_final.sh 17
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, Dot, FadeIn, FadeOut, Indicate, LaggedStart, Line, NumberLine,
                   Triangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, row


class G5Ep17(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 17
    EP_TITLE = "분수와 소수의 크기 비교"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.to_dec()
        self.to_frac()
        self.line()
        self.closing(f"분수와 소수는 {o('한 가지로')} 나타내어 견주어요\n분모를 {g('10, 100')}으로 바꾸면 소수로 나타내기 쉬워요",
                     next_preview="5학년 18화 · 분모가 다른 진분수의 덧셈")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("망고주스를 준서는 2/5 L, 하은이는 0.3 L 따랐어요.\n누가 더 많이 따랐을까요?", 40).move_to([0.6, 1.6, 0])
        self.say("2/5와 0.3", "망고주스를 준서는 5분의 2리터, 하은이는 0.3리터 따랐어요. 분수와 소수는 어떻게 견줄까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def to_dec(self):
        self.section("분수를 소수로")
        e = row(frac(2, 5, 70), "=", frac(4, 10, 70, cn=ORANGE, cd=ORANGE), "=", M(o("0.4"), 70), size=60).move_to([0, 1.2, 0])
        self.say(f"분모를 {o('10')}으로 만들면 2/5 = 4/10", "5분의 2의 분모와 분자에 2를 곱해 분모를 10으로 만들면 10분의 4예요.")
        self.play(FadeIn(e[:3]), run_time=0.6)
        self.say(f"4/10 = {o('0.4')}", "10분의 4는 소수로 0.4예요.")
        self.play(FadeIn(e[3:]), run_time=0.5)
        r = M(f"0.4 {g('&gt;')} 0.3  →  {g('준서')}가 더 많이", 52).move_to([0, -1.0, 0])
        self.say(f"0.4 > 0.3, {g('준서')}가 더 많이", "0.4는 0.3보다 크니 준서가 더 많이 따랐어요.")
        self.play(FadeIn(r), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def to_frac(self):
        self.section("소수를 분수로")
        e = row(M("0.3", 66), "=", frac(3, 10, 66, cn=BLUE, cd=BLUE), size=60).move_to([-3.0, 1.0, 0])
        e2 = row(frac(4, 10, 66, cn=ORANGE, cd=ORANGE), M(g("&gt;"), 66), frac(3, 10, 66, cn=BLUE, cd=BLUE), size=60).move_to([3.0, 1.0, 0])
        self.say(f"거꾸로 0.3을 {b('3/10')}으로", "거꾸로 소수를 분수로 바꾸어도 돼요. 0.3은 10분의 3이에요.")
        self.play(FadeIn(e), run_time=0.6)
        self.say("10분의 4와 10분의 3을 견주면", "10분의 4와 10분의 3을 견주어도 같은 결과예요.")
        self.play(FadeIn(e2), run_time=0.6)
        n = M(f"소수 한 자리 수는 분모 {o('10')}, 두 자리 수는 분모 {o('100')}인 분수로", 36).move_to([0, -1.3, 0])
        self.say(f"분모 {o('10, 100')}인 분수로", "소수 한 자리 수는 분모가 10인 분수로, 소수 두 자리 수는 분모가 100인 분수로 나타내요.")
        self.play(FadeIn(n), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def line(self):
        self.section("수직선에서 보기")
        nl = NumberLine(x_range=[0, 1, 0.1], length=11.0, color=INK, stroke_width=3, include_numbers=False).move_to([0, 0.3, 0])
        labs = VGroup(*[T(f"{k / 10:g}", 24, SOFT).next_to(nl.n2p(k / 10), DOWN, buff=0.18) for k in range(11)])
        self.play(Create(nl), FadeIn(labs), run_time=0.7)
        pts = [(0.3, "0.3", BLUE), (0.4, "2/5", ORANGE), (0.75, "3/4", GREEN)]
        mk = VGroup()
        for v, s, c in pts:
            d = Dot(nl.n2p(v), radius=0.12, color=c)
            t = T(s, 34, c).next_to(d, UP, buff=0.25)
            mk.add(d, t)
        self.say("수직선에 나타내면", "수직선에 나타내면 0.3, 5분의 2, 4분의 3의 자리가 한눈에 보여요.")
        self.play(LaggedStart(*[FadeIn(m) for m in mk], lag_ratio=0.2, run_time=1.2))
        n = M(f"3/4 = 75/100 = {g('0.75')}", 44).move_to([0, -1.7, 0])
        self.say(f"3/4는 75/100 = {g('0.75')}", "4분의 3은 분모를 100으로 만들면 100분의 75, 0.75예요. 오른쪽에 있을수록 커요.")
        self.play(FadeIn(n), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
