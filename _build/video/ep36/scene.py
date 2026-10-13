"""「수학 원리 돋보기」 36화 — 나눗셈의 두 가지 뜻 (1학기 3단원 나눗셈 2·3차시, 화 코드 1-3-a)

화살 6개를 2명에게 똑같이 나누기(6 ÷ 2 = 3) → 이름(나누어지는 수, 나누는 수, 몫) →
나무 도막 8개를 2개씩 덜어 내기(8 − 2 − 2 − 2 − 2 = 0 → 8 ÷ 2 = 4) → 두 뜻 나란히
최종: ./make_final.sh 36
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, Line, Rectangle,
                   RoundedRectangle, SurroundingRectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, PLATE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage

WOOD = "#C99A62"


def arrow_stick():
    return VGroup(Line([0, -0.45, 0], [0, 0.45, 0], color=INK, stroke_width=5),
                  Line([0, 0.45, 0], [-0.1, 0.3, 0], color=ORANGE, stroke_width=5),
                  Line([0, 0.45, 0], [0.1, 0.3, 0], color=ORANGE, stroke_width=5))


def block():
    return Rectangle(width=0.5, height=0.3, fill_color=WOOD, fill_opacity=1, stroke_color=INK, stroke_width=2.5)


def plate(label, w=2.4, h=1.8):
    box = RoundedRectangle(corner_radius=0.3, width=w, height=h, fill_color=PLATE, fill_opacity=1, stroke_color=SOFT, stroke_width=3)
    return VGroup(box, T(label, 34).next_to(box, UP, buff=0.12))


class Ep36(EpisodeScene):
    EP_NO = 36
    EP_TITLE = "나눗셈의 두 가지 뜻"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.share()
        self.names()
        self.take_away()
        self.both()
        self.closing(f"{b('똑같이 나누어 주기')}도, {o('똑같이 덜어 내기')}도\n모두 나눗셈으로 나타내요",
                     next_preview="37화 · 곱셈과 나눗셈은 어떤 사이일까?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        arrows = VGroup(*[arrow_stick() for _ in range(6)]).arrange(RIGHT, buff=0.35).move_to([0, 0.0, 0])
        q = M(f"화살 {b('6개')}를 {o('2명')}이 똑같이 나누어 가지면\n한 명이 몇 개씩 가질까요?", 50).move_to([0, 1.9, 0])
        self.say("투호 화살 6개를 2명이 나누어 가져요", "다인이와 호원이가 투호 화살 6개를 똑같이 나누어 가지려고 해요.")
        self.play(LaggedStart(*[FadeIn(a, shift=DOWN * 0.2) for a in arrows], lag_ratio=0.15, run_time=1.0))
        self.say("한 명이 몇 개씩 가질까요?", "한 명이 몇 개씩 가질 수 있을까요?")
        self.play(Write(q), run_time=1.1)
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def share(self):
        self.section("똑같이 나누어 주기")
        arrows = VGroup(*[arrow_stick() for _ in range(6)]).arrange(RIGHT, buff=0.35).move_to([0, 1.7, 0])
        p1, p2 = plate("다인"), plate("호원")
        VGroup(p1, p2).arrange(RIGHT, buff=1.4).move_to([0, -0.6, 0])
        self.play(FadeIn(arrows), FadeIn(p1), FadeIn(p2), run_time=0.6)
        self.bring_to_front(arrows)
        self.say("한 개씩 번갈아 나누어 주어요", "한 사람에게 하나씩 번갈아 나누어 줄게요.")
        for k in range(3):
            self.play(arrows[2 * k].animate.move_to(p1[0].get_center() + RIGHT * (k - 1) * 0.5),
                      arrows[2 * k + 1].animate.move_to(p2[0].get_center() + RIGHT * (k - 1) * 0.5), run_time=0.6)
        self.say(f"한 명이 {g('3개')}씩", "모두 나누어 주니 한 명이 3개씩 가져요.")
        labs = VGroup(T("3개", 40, GREEN).next_to(p1, DOWN, buff=0.2), T("3개", 40, GREEN).next_to(p2, DOWN, buff=0.2))
        self.play(FadeIn(labs), run_time=0.5)
        e = M(f"{b('6')} ÷ {o('2')} = {g('3')}", 80).move_to([0, -2.5, 0])
        self.play(FadeOut(labs), run_time=0.3)
        e.move_to([0, 1.7, 0])
        self.say(f"식으로 {b('6')} ÷ {o('2')} = {g('3')}", "이것을 식으로 6 나누기 2는 3이라고 써요.")
        self.play(Write(e), run_time=0.9)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def names(self):
        self.section("나눗셈식의 이름")
        e = M(f"{b('6')} ÷ {o('2')} = {g('3')}", 130).move_to([0, 0.9, 0])
        self.play(FadeIn(e), run_time=0.5)
        l1 = T("나누어지는 수", 40, BLUE).next_to(e[0], DOWN, buff=0.5).shift(LEFT * 0.6)
        l2 = T("나누는 수", 40, ORANGE).next_to(e[2], DOWN, buff=0.5)
        l3 = T("몫", 46, GREEN).next_to(e[4], DOWN, buff=0.5)
        self.say(f"6은 {b('나누어지는 수')}, 2는 {o('나누는 수')}, 3은 {g('몫')}", "6은 나누어지는 수, 2는 나누는 수, 3은 몫이라고 해요.")
        self.play(FadeIn(l1), run_time=0.5)
        self.play(FadeIn(l2), run_time=0.5)
        self.play(FadeIn(l3), run_time=0.5)
        r = M("읽기: 6 나누기 2는 3과 같습니다", 44).move_to([0, -1.9, 0])
        self.say("6 나누기 2는 3과 같습니다", "6 나누기 2는 3과 같습니다라고 읽어요.")
        self.play(FadeIn(r), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def take_away(self):
        self.section("똑같이 덜어 내기")
        q = M(f"나무 도막 {b('8개')}를 한 명이 {o('2개')}씩 가지면 몇 명이 가질까요?", 46).move_to([0, 2.4, 0])
        q.scale_to_fit_width(min(q.width, 11.6))
        blocks = VGroup(*[block() for _ in range(8)]).arrange_in_grid(rows=2, buff=0.12).move_to([-4.2, 0.6, 0])
        self.say("나무 도막 8개를 2개씩 가지면?", "이번에는 나무 도막 8개를 한 명이 2개씩 가지려고 해요. 몇 명이 가질 수 있을까요?")
        self.play(FadeIn(q), FadeIn(blocks), run_time=0.8)
        left = 8
        log = VGroup()
        for k in range(4):
            pair = VGroup(blocks[2 * k], blocks[2 * k + 1])
            tgt = np.array([-1.2 + k * 1.5, 0.6, 0])
            self.play(pair.animate.arrange(DOWN, buff=0.08).move_to(tgt), run_time=0.6)
            left -= 2
            n = T(f"{k + 1}명", 32, ORANGE).next_to(pair, DOWN, buff=0.15)
            self.play(FadeIn(n), run_time=0.3)
            log.add(n)
        self.say(f"2개씩 {g('4번')} 덜어 내니 0", "2개씩 덜어 내기를 4번 하니 남은 것이 없어요.")
        sub = M("8 − 2 − 2 − 2 − 2 = 0", 52).move_to([0, -1.0, 0])
        self.play(FadeIn(sub), run_time=0.6)
        e = M(f"{b('8')} ÷ {o('2')} = {g('4')}", 70).move_to([0, -2.0, 0])
        self.say(f"나눗셈식으로 {b('8')} ÷ {o('2')} = {g('4')}", "이것을 나눗셈식으로 8 나누기 2는 4라고 써요. 몫 4는 덜어 낸 횟수, 가질 수 있는 사람 수예요.")
        self.play(Write(e), run_time=0.8)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def both(self):
        self.section("두 가지 뜻 나란히")
        l = M(f"{b('똑같이 나누어 주기')}\n6 ÷ 2 = 3\n한 명에게 {g('3개')}씩", 44).move_to([-3.2, 0.5, 0])
        r = M(f"{o('똑같이 덜어 내기')}\n8 ÷ 2 = 4\n{g('4명')}이 가져요", 44).move_to([3.2, 0.5, 0])
        bl = SurroundingRectangle(l, color=BLUE, buff=0.35, stroke_width=5, corner_radius=0.2)
        br = SurroundingRectangle(r, color=ORANGE, buff=0.35, stroke_width=5, corner_radius=0.2)
        self.say("나눗셈에는 두 가지 뜻이 있어요", "나눗셈에는 두 가지 뜻이 있어요. 똑같이 나누어 주기와 똑같이 덜어 내기.")
        self.play(FadeIn(l), Create(bl), run_time=0.7)
        self.play(FadeIn(r), Create(br), run_time=0.7)
        self.wait(1.8)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
