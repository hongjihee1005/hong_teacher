"""「수학 원리 돋보기」 5학년 51화 — 곱의 소수점은 어디에? (5-2 4단원 8차시, 화 코드 5-2-4-e)

0.15 × 10 = 1.5, × 100 = 15, × 1000 = 150 (0의 개수만큼 소수점이 오른쪽으로)
150 × 0.1 = 15, × 0.01 = 1.5, × 0.001 = 0.15 (소수점 아래 자리 수만큼 왼쪽으로)
57 × 39 = 2223 → 5.7 × 3.9 = 22.23, 0.57 × 3.9 = 2.223, 0.57 × 0.39 = 0.2223 (자리 수를 더한 만큼)
최종: GRADE=5 ./make_final.sh 51
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage


class G5Ep51(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 51
    EP_TITLE = "곱의 소수점은 어디에?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.times10()
        self.times01()
        self.both()
        self.closing(f"10, 100, 1000을 곱하면 소수점이 {o('오른쪽')}, 0.1, 0.01, 0.001이면 {b('왼쪽')}\n소수끼리의 곱은 소수점 아래 자리 수를 {g('더한 만큼')}",
                     next_preview="5학년 52화 · 직육면체와 정육면체")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("57 × 39 = 2223을 이용해\n0.57 × 0.39를 바로 구할 수 있을까요?", 46).move_to([0.6, 1.7, 0])
        self.say("2223을 이용해 0.57 × 0.39는?", "57 곱하기 39는 2223이에요. 이것을 이용해서 0.57 곱하기 0.39를 바로 구할 수 있을까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def times10(self):
        self.section("10, 100, 1000을 곱하면")
        rows = VGroup(M(f"0.15 × 10 = {o('1.5')}", 52), M(f"0.15 × 100 = {o('15')}", 52), M(f"0.15 × 1000 = {o('150')}", 52)).arrange(DOWN, aligned_edge=LEFT, buff=0.4).move_to([-1.5, 0.6, 0])
        self.say(f"0의 개수만큼 소수점이 {o('오른쪽')}으로", "0.15에 10, 100, 1000을 곱하면 1.5, 15, 150이에요. 곱하는 수의 0의 개수만큼 소수점이 오른쪽으로 옮겨져요.")
        self.play(LaggedStart(*[FadeIn(r) for r in rows], lag_ratio=0.4, run_time=1.6))
        n = M(f"0이 1개 → 1칸,  2개 → 2칸,  3개 → 3칸 {o('→')}", 38).move_to([0, -1.6, 0])
        self.play(FadeIn(n), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def times01(self):
        self.section("0.1, 0.01, 0.001을 곱하면")
        rows = VGroup(M(f"150 × 0.1 = {b('15')}", 52), M(f"150 × 0.01 = {b('1.5')}", 52), M(f"150 × 0.001 = {b('0.15')}", 52)).arrange(DOWN, aligned_edge=LEFT, buff=0.4).move_to([-1.5, 0.6, 0])
        self.say(f"소수점 아래 자리 수만큼 {b('왼쪽')}으로", "150에 0.1, 0.01, 0.001을 곱하면 15, 1.5, 0.15예요. 곱하는 수의 소수점 아래 자리 수만큼 소수점이 왼쪽으로 옮겨져요.")
        self.play(LaggedStart(*[FadeIn(r) for r in rows], lag_ratio=0.4, run_time=1.6))
        n = M(f"한 자리 → 1칸,  두 자리 → 2칸,  세 자리 → 3칸 {b('←')}", 38).move_to([0, -1.6, 0])
        self.play(FadeIn(n), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def both(self):
        self.section("소수끼리 곱하면")
        rows = VGroup(
            M(f"57 × 39 = 2223", 48),
            M(f"5.7 × 3.9 = {g('22.23')}   (1 + 1 = 2자리)", 44),
            M(f"0.57 × 3.9 = {g('2.223')}   (2 + 1 = 3자리)", 44),
            M(f"0.57 × 0.39 = {g('0.2223')}   (2 + 2 = 4자리)", 44),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.35).move_to([0, 0.3, 0])
        self.say("57 × 39 = 2223에서", "57 곱하기 39는 2223이에요.")
        self.play(FadeIn(rows[0]), run_time=0.5)
        self.say(f"소수점 아래 자리 수를 {g('더한 만큼')}", "소수끼리 곱하면 두 수의 소수점 아래 자리 수를 더한 만큼 곱의 소수점 아래 자리 수가 정해져요. 5.7 곱하기 3.9는 두 자리, 22.23.")
        self.play(FadeIn(rows[1]), run_time=0.5)
        self.say(f"0.57 × 0.39 = {g('0.2223')}", "0.57 곱하기 3.9는 세 자리, 2.223. 0.57 곱하기 0.39는 네 자리, 0.2223이에요.")
        self.play(FadeIn(rows[2]), run_time=0.5)
        self.play(FadeIn(rows[3]), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
