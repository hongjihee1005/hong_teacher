"""「수학 원리 돋보기」 44화 — 1분보다 짧은 시간, 초 (1학기 5단원 5차시, 화 코드 1-5-c)

초바늘이 작은 눈금 한 칸 = 1초 → 한 바퀴 60초 동안 긴바늘은 한 칸(1분) → 60초 = 1분
→ 시각 읽기 7시 20분 5초 → 1분 20초 = 80초
최종: ./make_final.sh 44
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, PI, RIGHT, TAU, UP, Circle, Create, FadeIn, FadeOut, Indicate, Line, ValueTracker, VGroup, Write,
                   always_redraw, linear)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage

RED = "#D64545"


def face(c, r=2.0):
    f = Circle(radius=r, fill_color=PAPER, fill_opacity=1, stroke_color=INK, stroke_width=6).move_to(c)
    ticks = VGroup()
    for k in range(60):
        a = PI / 2 - TAU * k / 60
        d = np.array([np.cos(a), np.sin(a), 0])
        ln = 0.25 if k % 5 == 0 else 0.11
        ticks.add(Line(c + d * (r - ln), c + d * r, color=INK, stroke_width=4 if k % 5 == 0 else 2))
    nums = VGroup(*[T(str(h), 30).move_to(c + (r - 0.5) * np.array([np.cos(PI / 2 - TAU * h / 12), np.sin(PI / 2 - TAU * h / 12), 0])) for h in range(1, 13)])
    return VGroup(f, ticks, nums)


def hand(c, frac, length, color, width):
    a = PI / 2 - TAU * frac
    return Line(c, c + length * np.array([np.cos(a), np.sin(a), 0]), color=color, stroke_width=width)


class Ep44(EpisodeScene):
    EP_NO = 44
    EP_TITLE = "1분보다 짧은 시간, 초"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.second_hand()
        self.read()
        self.convert()
        self.closing(f"초바늘이 작은 눈금 한 칸을 가는 시간 → {o('1초')}\n{o('60초')} = {b('1분')}",
                     next_preview="45화 · 시간의 덧셈")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M(f"달리기 기록, 물구나무서기… {b('1분')}보다 짧은 시간은\n어떻게 나타낼까요?", 50).move_to([0, 0.8, 0])
        self.say("1분보다 짧은 시간은 어떻게 나타낼까요?", "50 m 달리기 기록처럼 1분보다 짧은 시간은 어떻게 나타낼까요?")
        self.play(Write(q), run_time=1.2)
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def second_hand(self):
        self.section("초바늘")
        c = np.array([-3.0, 0.1, 0])
        f = face(c)
        s = ValueTracker(0)
        sec = always_redraw(lambda: hand(c, s.get_value() / 60, 1.75, RED, 3))
        mn = always_redraw(lambda: hand(c, (10 + s.get_value() / 60) / 60, 1.5, INK, 6))
        hr = hand(c, 2.17 / 12, 1.0, INK, 9)
        self.play(FadeIn(f), FadeIn(hr), FadeIn(mn), FadeIn(sec), run_time=0.6)
        self.say(f"가장 가는 바늘이 {o('초바늘')}", "시계에서 가장 가늘고 빠른 바늘이 초바늘이에요.")
        self.play(Indicate(sec, color=RED, scale_factor=1.1), run_time=0.8)
        self.say(f"작은 눈금 한 칸을 가는 시간: {o('1초')}", "초바늘이 작은 눈금 한 칸을 가는 동안 걸리는 시간을 1초라고 해요.")
        self.play(s.animate.set_value(1), run_time=1.0, rate_func=linear)
        self.play(s.animate.set_value(2), run_time=1.0, rate_func=linear)
        d1 = M(f"작은 눈금 한 칸 = {o('1초')}", 44).move_to([3.4, 1.4, 0])
        self.play(FadeIn(d1), run_time=0.4)
        self.say("초바늘이 한 바퀴 돌면?", "초바늘이 한 바퀴를 돌면 어떻게 될까요? 빠르게 돌려 볼게요.")
        self.play(s.animate.set_value(60), run_time=5.0, rate_func=linear)
        d2 = M(f"초바늘 한 바퀴 = {o('60초')}", 44).move_to([3.4, 0.4, 0])
        d3 = M(f"그동안 긴바늘은 한 칸 = {b('1분')}", 44).move_to([3.4, -0.5, 0])
        self.say(f"60초 동안 긴바늘은 {b('한 칸')}", "초바늘이 한 바퀴 60초를 도는 동안 긴바늘은 작은 눈금 한 칸, 1분을 갔어요.")
        self.play(FadeIn(d2), run_time=0.4)
        self.play(FadeIn(d3), Indicate(mn, color=BLUE, scale_factor=1.1), run_time=0.7)
        e = M(f"{o('60초')} = {b('1분')}", 64).move_to([3.4, -1.7, 0])
        self.play(FadeIn(e), run_time=0.5)
        self.wait(1.4)
        for m_ in (sec, mn):
            m_.clear_updaters()
        self.settle()
        clear_stage(self, 0.6)

    def read(self):
        self.section("시각 읽기")
        c = np.array([-3.0, 0.1, 0])
        f = face(c)
        hr = hand(c, (7 + 20 / 60) / 12, 1.0, INK, 9)
        mn = hand(c, 20 / 60, 1.5, INK, 6)
        sec = hand(c, 5 / 60, 1.75, RED, 3)
        self.play(FadeIn(f), FadeIn(hr), FadeIn(mn), FadeIn(sec), run_time=0.6)
        l = VGroup(M(f"짧은바늘: 7과 8 사이 → {b('7시')}", 40), M(f"긴바늘: 4 → {b('20분')}", 40), M(f"초바늘: 1 → {o('5초')}", 40))
        l.arrange(DOWN, aligned_edge=LEFT, buff=0.35).move_to([3.4, 0.8, 0])
        self.say("시각을 읽어 볼까요?", "짧은바늘은 7과 8 사이, 긴바늘은 4, 초바늘은 1을 가리켜요. 시각을 읽어 볼까요?")
        for x in l:
            self.play(FadeIn(x), run_time=0.5)
        ans = M(f"{g('7시 20분 5초')}", 60).move_to([3.4, -1.3, 0])
        self.say(f"{g('7시 20분 5초')}", "초바늘이 1을 가리키면 5초예요. 그래서 7시 20분 5초예요.")
        self.play(FadeIn(ans), Indicate(sec, color=RED), run_time=0.7)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def convert(self):
        self.section("분과 초로 나타내기")
        l1 = M(f"{b('1분')} {o('20초')} = 60초 + 20초 = {g('80초')}", 56).move_to([0, 1.2, 0])
        l2 = M(f"{g('150초')} = 60초 + 60초 + 30초 = {b('2분')} {o('30초')}", 56).move_to([0, -0.1, 0])
        self.say(f"1분 20초 = {g('80초')}", "1분 20초는 60초와 20초를 더한 80초예요.")
        self.play(FadeIn(l1), run_time=0.5)
        self.say(f"150초 = {b('2분')} {o('30초')}", "150초는 60초가 두 번과 30초, 곧 2분 30초예요.")
        self.play(FadeIn(l2), run_time=0.5)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
