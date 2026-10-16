"""「수학 원리 돋보기」 4학년 42화 — 소수의 덧셈은 왜 소수점을 맞출까? (4-2 3단원 8·9차시, 화 코드 4-2-3-e)

0.3 + 0.5: 0.1이 3개 + 5개 = 8개 → 0.8 / 세로셈: ① 소수점 맞추기 ② 같은 자리끼리 ③ 소수점 내려 찍기
2.47 + 1.85 = 4.32 (받아올림 두 번) / 3.6 + 1.25 = 4.85 (자리 수가 다르면 끝에 0)
최종: GRADE=4 ./make_final.sh 42
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, Cross, FadeIn, FadeOut, Indicate, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac_bar
from decimal4 import dec_vertical

RED = "#C0392B"


class G4Ep42(EpisodeScene):
    GRADE, SEM = 4, 2
    EP_NO = 42
    EP_TITLE = "소수의 덧셈은 왜 소수점을 맞출까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.tenths()
        self.wrong()
        self.section("2.47 + 1.85")
        self.say("세로셈으로 2.47 + 1.85", "이제 2.47 더하기 1.85를 세로셈으로 계산해 볼게요. 소수점을 맞추어 써요.")
        r = dec_vertical(self, "2.47", "1.85", "+")
        self.say(f"2.47 + 1.85 = {g(r)}", f"2.47 더하기 1.85는 {r}예요.")
        self.wait(1.2)
        self.settle(); clear_stage(self, 0.6)
        self.section("자리 수가 다르면")
        self.say("3.6 + 1.25는?", "3.6 더하기 1.25처럼 소수점 아래 자리 수가 다르면, 3.6 끝에 0을 붙여 3.60으로 생각해요.")
        r = dec_vertical(self, "3.6", "1.25", "+")
        self.say(f"3.6 + 1.25 = {g(r)}", f"3.6 더하기 1.25는 {r}예요.")
        self.wait(1.2)
        self.settle(); clear_stage(self, 0.6)
        self.hide_chip()
        self.closing(f"① {o('소수점')}을 맞추어 쓰고 ② {b('같은 자리끼리')} 계산하고\n③ 소수점을 {g('그대로 내려 찍어요')}",
                     next_preview="4학년 43화 · 소수의 뺄셈")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("우유 0.3 L와 주스 0.5 L를 섞으면 몇 L일까요?", 46)
        q.scale_to_fit_width(min(q.width, 10.4)).move_to([0.6, 1.6, 0])
        self.say("0.3 + 0.5는?", "우유 0.3리터와 주스 0.5리터를 섞으면 몇 리터일까요?")
        self.play(Write(q), run_time=0.9)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def tenths(self):
        self.section("0.1이 몇 개?")
        b1 = frac_bar(10, 3, 7.0, 0.7, ORANGE).move_to([0.6, 1.6, 0])
        b2 = frac_bar(10, 5, 7.0, 0.7, BLUE).move_to([0.6, 0.6, 0])
        l1 = T("0.3", 44, ORANGE).next_to(b1, LEFT, buff=0.3)
        l2 = T("0.5", 44, BLUE).next_to(b2, LEFT, buff=0.3)
        self.say(f"0.3은 0.1이 {o('3개')}, 0.5는 {b('5개')}", "0.3은 0.1이 3개, 0.5는 0.1이 5개예요.")
        self.play(FadeIn(b1), FadeIn(l1), FadeIn(b2), FadeIn(l2), run_time=0.7)
        b3 = frac_bar(10, 8, 7.0, 0.7, GREEN).move_to([0.6, -0.6, 0])
        l3 = T("0.8", 44, GREEN).next_to(b3, LEFT, buff=0.3)
        self.say(f"모두 0.1이 {g('8개')} → {g('0.8')}", "모으면 0.1이 8개, 0.8리터예요. 자연수의 덧셈처럼 같은 단위끼리 더했어요.")
        self.play(FadeIn(b3), FadeIn(l3), run_time=0.7)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def wrong(self):
        self.section("소수점을 맞추는 까닭")
        a = VGroup(T("2.47", 72), T("+   1.8", 72)).arrange(DOWN, aligned_edge=RIGHT, buff=0.25).move_to([-3.0, 0.6, 0])
        x = Cross(a, stroke_color=RED, stroke_width=6)
        self.say("끝을 맞추어 쓰면?", "2.47 더하기 1.8을 자연수처럼 끝을 맞추어 쓰면, 7과 8이 같은 줄에 와요.")
        self.play(FadeIn(a), run_time=0.6)
        n = M(f"0.07과 {o('0.8')}을 더하게 돼요", 42).next_to(a, DOWN, buff=0.4)
        self.say(f"0.07과 0.8은 {o('단위가 달라요')}", "0.07과 0.8은 자리가 달라서 바로 더할 수 없어요.")
        self.play(FadeIn(n), Create(x), run_time=0.7)
        c = VGroup(T("2.47", 72), T("+ 1.80", 72)).arrange(DOWN, aligned_edge=RIGHT, buff=0.25).move_to([3.0, 0.6, 0])
        n2 = M(f"소수점을 맞추면 {g('같은 자리')}끼리", 42).next_to(c, DOWN, buff=0.4)
        self.say(f"소수점을 맞추면 {g('같은 자리끼리')} 줄이 맞아요", "소수점을 맞추어 쓰면 같은 자리 숫자끼리 위아래로 줄이 맞아요.")
        self.play(FadeIn(c), FadeIn(n2), run_time=0.7)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)
