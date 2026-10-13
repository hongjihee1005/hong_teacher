"""「수학 원리 돋보기」 30화 — 같은 자리끼리 뺄 수 없으면? (1학기 1단원 5·6차시, 화 코드 1-1-c)

385 − 213(받아내림 없음) → 282 − 118: 일 모형 2개에서 8개를 뺄 수 없어 십 모형 1개를 일 모형 10개로
→ 세로셈(빗금, 1 작아진 수, 10) → 315 − 174
최종: ./make_final.sh 30
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, Line, SurroundingRectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from base10 import break_ten, ten_rod, unit_cube
from multiply import cm
from addsub import sub_vertical


class Ep30(EpisodeScene):
    EP_NO = 30
    EP_TITLE = "같은 자리끼리 뺄 수 없으면?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.section("세로셈으로 385 − 213")
        sub_vertical(self, 385, 213)
        self.settle(); self.clear_sub(); clear_stage(self, 0.6)
        self.borrow_blocks()
        self.section("세로셈으로 282 − 118")
        sub_vertical(self, 282, 118)
        self.settle(); self.clear_sub(); clear_stage(self, 0.6)
        self.section("한 번 더! 315 − 174")
        sub_vertical(self, 315, 174)
        self.settle(); self.clear_sub(); clear_stage(self, 0.6)
        self.hide_chip()
        self.closing(f"같은 자리끼리 뺄 수 없으면 {g('바로 윗자리에서 10을 받아내려요')}\n받아내린 윗자리 수는 {o('1 작아져요')}",
                     next_preview="31화 · 받아내림이 두 번 있으면?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M(f"활동 사진 {cm('2', 2)}{cm('8', 1)}{cm('2', 0)}장 중에서 {cm('1', 2)}{cm('1', 1)}{cm('8', 0)}장을 누리집에 올렸어요.\n남은 사진은 몇 장일까요?", 48)
        q.scale_to_fit_width(min(q.width, 11.6)).move_to([0, 1.5, 0])
        self.say("사진 282장 중 118장", "동물 구조 단체의 활동 사진 282장 중에서 118장을 누리집에 올렸어요. 남은 사진은 몇 장일까요?")
        self.play(Write(q), run_time=1.3)
        e = M(f"28{o('2')} − 11{o('8')} = ?", 110).move_to([0, -0.5, 0])
        self.say(f"일의 자리 {o('2')}에서 {o('8')}을 뺄 수 있을까요?", "그런데 일의 자리 2에서 8을 뺄 수 있을까요? 같은 자리끼리 뺄 수 없으면 어떻게 할까요?")
        self.play(FadeIn(e), run_time=0.6)
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def borrow_blocks(self):
        self.section("십 모형 1개를 풀어요")
        s = 0.22
        rods = VGroup(*[ten_rod(s) for _ in range(8)]).arrange(RIGHT, buff=0.12).move_to([-2.6, 0.6, 0])
        ones = VGroup(*[unit_cube(s) for _ in range(2)]).arrange(DOWN, buff=0.05).next_to(rods, RIGHT, buff=0.5)
        lab = M(f"{b('십 모형 8개')}, {o('일 모형 2개')}", 44).move_to([-2.2, -1.2, 0])
        self.say(f"82는 {b('십 모형 8개')}와 {o('일 모형 2개')}", "282의 십의 자리와 일의 자리, 82를 보면 십 모형 8개와 일 모형 2개예요.")
        self.play(FadeIn(rods), FadeIn(ones), FadeIn(lab), run_time=0.8)
        self.say(f"일 모형 2개에서 {o('8개')}를 덜어 낼 수 없어요", "일 모형 2개에서 8개를 덜어 낼 수 없어요.")
        self.play(Indicate(ones, color=ORANGE, scale_factor=1.3), run_time=0.8)
        self.wait(0.4)
        self.say(f"{b('십 모형 1개')}를 {o('일 모형 10개')}로 바꿔요!", "그래서 십 모형 1개를 일 모형 10개로 바꾸어요!")
        pts = [np.array([3.2 + (k % 5) * 0.32, 1.2 - (k // 5) * 0.32, 0]) for k in range(10)]
        anim, cubes = break_ten(rods[-1], pts, run_time=1.4, lag=0.08)
        self.play(anim)
        self.play(ones.animate.arrange(RIGHT, buff=0.08).move_to([3.85, 0.25, 0]), run_time=0.6)
        lab2 = M(f"{b('십 모형 7개')}, {o('일 모형 12개')}", 44).move_to([-2.2, -1.2, 0])
        self.say(f"이제 {b('십 모형 7개')}, {o('일 모형 12개')}", "이제 십 모형은 7개로 1 작아지고, 일 모형은 12개가 되었어요.")
        self.play(FadeOut(lab), FadeIn(lab2), run_time=0.5)
        self.wait(0.6)
        res = M(f"{o('12')} − 8 = {g('4')}", 56).move_to([3.4, -1.2, 0])
        self.say(f"{o('12')} − 8 = {g('4')}", "이제 일 모형 12개에서 8개를 덜어 내면 4개가 남아요.")
        self.play(FadeIn(res), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
