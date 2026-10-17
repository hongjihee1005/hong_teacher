"""「수학 원리 돋보기」 5학년 34화 — 반올림 (5-2 1단원 7차시, 화 코드 5-2-1-d)

축제 방문자 3482명: 십의 자리까지 → 일의 자리 2(0~4)라 버림 3480 / 백의 자리까지 → 십의 자리 8(5~9)이라 올림 3500
수직선: 3482는 3480과 3490 중 3480에 더 가까움, 3400과 3500 중 3500에 더 가까움 / 3450처럼 딱 가운데면 올림
최종: GRADE=5 ./make_final.sh 34
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Arrow, Create, Dot, FadeIn, FadeOut, Indicate, LaggedStart, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from numrange import numline

RED = "#C0392B"


class G5Ep34(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 34
    EP_TITLE = "반올림"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.tens()
        self.hundreds()
        self.rule()
        self.closing(f"바로 아래 자리 숫자가 {b('0, 1, 2, 3, 4')}이면 버리고\n{o('5, 6, 7, 8, 9')}이면 올려요 = {g('반올림')}",
                     next_preview="5학년 35화 · 어떤 어림을 써야 할까?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("축제에 3482명이 왔어요.\n약 몇 명이 왔다고 말하면 좋을까요?", 44).move_to([0.6, 1.6, 0])
        self.say("3482명은 약 몇 명?", "축제에 3482명이 왔어요. 대략 몇 명이 왔다고 말하면 좋을까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def tens(self):
        self.section("십의 자리까지")
        nl, labs = numline(3480, 3490, 1, 11.0, [0, 0.4, 0], label_every=5, size=26)
        p = Dot(nl.n2p(3482), radius=0.14, color=ORANGE)
        pl = T("3482", 32, ORANGE).next_to(p, UP, buff=0.25)
        self.say("3480과 3490 중 어디에 더 가까울까요?", "3482는 3480과 3490 사이에 있어요. 어느 쪽에 더 가까울까요?")
        self.play(Create(nl), FadeIn(labs), FadeIn(p), FadeIn(pl), run_time=0.8)
        a = Arrow(nl.n2p(3482) + UP * 0.9, nl.n2p(3480) + UP * 0.9, color=BLUE, buff=0, stroke_width=6)
        self.say(f"{b('3480')}에 더 가까워요", "3480에 더 가까워요. 일의 자리 숫자 2를 버려서 3480으로 나타내요.")
        self.play(Create(a), run_time=0.6)
        r = M(f"일의 자리 숫자 {b('2')} → 버려요 → {b('3480')}", 42).move_to([0, -1.4, 0])
        self.play(FadeIn(r), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def hundreds(self):
        self.section("백의 자리까지")
        nl, labs = numline(3400, 3500, 10, 11.0, [0, 0.4, 0], label_every=5, size=26)
        p = Dot(nl.n2p(3482), radius=0.14, color=ORANGE)
        pl = T("3482", 32, ORANGE).next_to(p, UP, buff=0.25)
        self.say("3400과 3500 중 어디에 더 가까울까요?", "이번에는 백의 자리까지 나타내요. 3482는 3400과 3500 중 어느 쪽에 더 가까울까요?")
        self.play(Create(nl), FadeIn(labs), FadeIn(p), FadeIn(pl), run_time=0.8)
        a = Arrow(nl.n2p(3482) + UP * 0.9, nl.n2p(3500) + UP * 0.9, color=ORANGE, buff=0, stroke_width=6)
        self.say(f"{o('3500')}에 더 가까워요", "3500에 더 가까워요. 십의 자리 숫자가 8이라 올려서 3500으로 나타내요.")
        self.play(Create(a), run_time=0.6)
        r = M(f"십의 자리 숫자 {o('8')} → 올려요 → {o('3500')}", 42).move_to([0, -1.4, 0])
        self.play(FadeIn(r), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def rule(self):
        self.section("반올림의 약속")
        nl, labs = numline(3400, 3500, 10, 11.0, [0, 0.9, 0], label_every=5, size=26)
        mid = Dot(nl.n2p(3450), radius=0.14, color=GREEN)
        ml = T("3450", 30, GREEN).next_to(mid, UP, buff=0.25)
        self.say("딱 가운데인 3450은?", "딱 가운데인 3450은 어느 쪽으로 할까요? 이때는 올려서 3500으로 해요.")
        self.play(Create(nl), FadeIn(labs), FadeIn(mid), FadeIn(ml), run_time=0.8)
        t1 = M(f"바로 아래 자리 숫자가 {b('0, 1, 2, 3, 4')}  →  버려요", 40).move_to([0, -0.6, 0])
        t2 = M(f"바로 아래 자리 숫자가 {o('5, 6, 7, 8, 9')}  →  올려요", 40).move_to([0, -1.4, 0])
        self.say(f"이런 방법을 {g('반올림')}이라고 해요", "구하려는 자리 바로 아래 자리의 숫자가 0, 1, 2, 3, 4이면 버리고, 5, 6, 7, 8, 9이면 올려서 나타내는 방법을 반올림이라고 해요.")
        self.play(FadeIn(t1), run_time=0.5)
        self.play(FadeIn(t2), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
