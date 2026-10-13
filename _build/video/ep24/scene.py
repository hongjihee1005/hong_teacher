"""「수학 원리 돋보기」 24화 — 몇십을 곱하면 0이 하나 붙는 까닭 (2학기 1단원 곱셈 5차시, 화 코드 2-1-c)

4 × 20: 4명씩 20번 → 4 × 2 = 8 묶음이 10개 → 8의 10배 = 80 ('0을 붙인다'가 아니라 10배)
→ 4 × 2, 4 × 20 나란히 → 13 × 30 = 13 × 3의 10배 = 390
최종: ./make_final.sh 24
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Circle, Create, FadeIn, FadeOut, Indicate, LaggedStart, RoundedRectangle,
                   SurroundingRectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage


def kid(color=ORANGE, r=0.09):
    return Circle(radius=r, fill_color=color, fill_opacity=1, stroke_color=INK, stroke_width=1.5)


class Ep24(EpisodeScene):
    EP_NO = 24
    EP_TITLE = "몇십을 곱하면 0이 하나 붙는 까닭"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.groups()
        self.side()
        self.two_digit()
        self.closing(f"몇십을 곱하는 것은 몇을 곱한 뒤 {g('10배')} 하는 것\n0이 붙는 것은 {g('10배')} 한 결과예요",
                     next_preview="25화 · 한 자리 수 × 몇십몇")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M(f"겨루기 체험은 한 번에 {o('4명')}씩, {b('20번')} 할 수 있어요.\n모두 몇 명이 체험할까요?", 52)
        q.scale_to_fit_width(min(q.width, 11.6)).move_to([0, 1.5, 0])
        self.say("한 번에 4명씩 20번", "가상 겨루기 체험은 한 번에 4명씩 20번 할 수 있어요. 모두 몇 명이 체험할까요?")
        self.play(Write(q), run_time=1.3)
        e = M(f"{o('4')} × {b('20')} = ?", 110).move_to([0, -0.5, 0])
        self.say("4 × 20, 왜 0이 하나 붙을까요?", "4 곱하기 20은 80이라고들 해요. 그런데 왜 0이 하나 붙을까요?")
        self.play(FadeIn(e), run_time=0.6)
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def groups(self):
        self.section("묶어서 세어 보기")
        packs = VGroup()
        for i in range(20):
            p = VGroup(*[kid() for _ in range(4)]).arrange(RIGHT, buff=0.05)
            packs.add(p)
        packs.arrange_in_grid(rows=2, cols=10, buff=(0.32, 0.5)).move_to([0, 1.1, 0])
        self.say(f"4명씩 {b('20번')}을 늘어놓아요", "4명씩 20번을 늘어놓아 볼게요.")
        self.play(LaggedStart(*[FadeIn(p, scale=0.6) for p in packs], lag_ratio=0.05, run_time=2.0))
        self.wait(0.5)
        boxes = VGroup()
        for k in range(10):
            pair = VGroup(packs[k], packs[k + 10])
            boxes.add(RoundedRectangle(corner_radius=0.12, width=pair.width + 0.2, height=pair.height + 0.2,
                                       color=BLUE, stroke_width=4).move_to(pair))
        self.say(f"2번씩 묶으면 한 묶음은 4 × 2 = {o('8명')}", "2번씩 묶어 볼까요? 한 묶음은 4명씩 2번, 4 곱하기 2는 8명이에요.")
        self.play(Create(boxes[0]), run_time=0.6)
        e1 = M(f"한 묶음: 4 × 2 = {o('8')}", 48).move_to([0, -0.6, 0])
        self.play(FadeIn(e1), run_time=0.5)
        self.wait(0.6)
        self.say(f"이런 묶음이 {b('10개')}", "이런 묶음이 모두 몇 개일까요? 10개예요.")
        self.play(LaggedStart(*[Create(bx) for bx in boxes[1:]], lag_ratio=0.12, run_time=1.4))
        nums = VGroup(*[T(str(k + 1), 26, BLUE).next_to(boxes[k], DOWN, buff=0.08) for k in range(10)])
        self.play(LaggedStart(*[FadeIn(n_) for n_ in nums], lag_ratio=0.08, run_time=0.9))
        e2 = M(f"8명씩 {b('10묶음')} = 8의 {g('10배')} = {g('80')}", 52).move_to([0, -1.5, 0])
        self.say(f"8의 {g('10배')} = {g('80')}", "8명씩 10묶음이니까 8의 10배, 80명이에요.")
        self.play(FadeIn(e2), run_time=0.6)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)

    def side(self):
        self.section("나란히 놓아 보기")
        a = M(f"4 × {o('2')} = {o('8')}", 76).move_to([-1.0, 2.35, 0])
        c = M(f"4 × {b('20')} = {b('80')}", 76).next_to(a, DOWN, buff=0.8).align_to(a, LEFT)
        self.say("4 × 2와 4 × 20을 나란히", "4 곱하기 2와 4 곱하기 20을 위아래로 나란히 놓아 볼까요?")
        self.play(FadeIn(a), FadeIn(c), run_time=0.7)
        arr1 = M(f"↓ {g('10배')}", 36).move_to((a[2].get_center() + c[2:4].get_center()) / 2)
        arr2 = M(f"↓ {g('10배')}", 36).move_to((a[4].get_center() + c[5:7].get_center()) / 2)
        self.say(f"곱하는 수가 {g('10배')}가 되면 곱도 {g('10배')}", "곱하는 수 2가 20으로 10배가 되면, 곱도 8에서 80으로 10배가 돼요.")
        self.play(FadeIn(arr1), FadeIn(arr2), run_time=0.6)
        msg = M(f"0을 '그냥 붙이는' 것이 아니라\n{g('10배')} 했기 때문에 0이 하나 생겨요", 42)
        bg = SurroundingRectangle(msg, color=GREEN, buff=0.3, stroke_width=6, corner_radius=0.2).set_fill(PAPER, 1)
        VGroup(bg, msg).move_to([0, -1.35, 0])
        self.say(f"0이 붙는 까닭은 {g('10배')}", "0을 그냥 붙이는 것이 아니라 10배를 했기 때문에 일의 자리에 0이 생기는 거예요.")
        self.play(FadeIn(bg), Write(msg), run_time=1.2)
        self.wait(1.8)
        self.settle()
        clear_stage(self, 0.6)

    def two_digit(self):
        self.section("두 자리 수 × 몇십")
        q = M("13 × 30 = ?", 96).move_to([0, 2.0, 0])
        self.say("13 × 30은 어떻게 계산할까요?", "13 곱하기 30도 같은 방법으로 계산할 수 있어요.")
        self.play(FadeIn(q), run_time=0.6)
        l1 = M(f"① 13 × {o('3')} = {o('39')}", 60).move_to([0, 0.6, 0])
        l2 = M(f"② {o('39')}의 {g('10배')} = {g('390')}", 60).move_to([0, -0.5, 0])
        self.say(f"먼저 13 × 3 = {o('39')}", "먼저 13 곱하기 3을 계산하면 39예요.")
        self.play(FadeIn(l1), run_time=0.6)
        self.say(f"30은 3의 10배이니 39의 {g('10배')} = {g('390')}", "30은 3의 10배이니까, 39의 10배인 390이에요.")
        self.play(FadeIn(l2), run_time=0.6)
        bx = SurroundingRectangle(l2, color=GREEN, buff=0.15, stroke_width=5)
        self.play(Create(bx), run_time=0.5)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
