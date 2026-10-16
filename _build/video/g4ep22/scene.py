"""「수학 원리 돋보기」 4학년 22화 — 막대그래프는 무엇이 편리할까? (4-1 5단원 막대그래프 2·3차시, 화 코드 4-1-5-a)

조사한 수량을 막대 모양으로 나타낸 그래프 = 막대그래프 / 막대의 길이가 수량
가로·세로가 무엇인지, 눈금 한 칸의 크기 확인 → 많고 적음·차이를 한눈에 / 가로 막대그래프
최종: GRADE=4 ./make_final.sh 22
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Brace, Create, FadeIn, FadeOut, GrowFromEdge, Indicate, LaggedStart,
                   SurroundingRectangle, VGroup, Write, Rectangle)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, g, o
from division import clear_stage
from chart import Chart

ITEMS = ["분리배출", "물 아끼기", "전기 끄기", "나무 심기"]
VALS = [8, 5, 7, 3]


class G4Ep22(EpisodeScene):
    GRADE, SEM = 4, 1
    EP_NO = 22
    EP_TITLE = "막대그래프는 무엇이 편리할까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.make_bars()
        self.read()
        self.horizontal()
        self.closing(f"조사한 수량을 {o('막대')} 모양으로 나타낸 그래프가 {g('막대그래프')}\n막대가 길수록 수량이 많아요",
                     next_preview="4학년 23화 · 표를 막대그래프로 나타내기")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("반 친구들이 실천하는 환경 보호 활동", 46).move_to([0.6, 2.25, 0])
        tbl = VGroup()
        for i, (a, v) in enumerate(zip(["활동"] + ITEMS + ["합계"], ["학생 수(명)"] + VALS + [sum(VALS)])):
            col = VGroup(T(a, 30, INK if i else SOFT), T(str(v), 34, INK if i else SOFT)).arrange(DOWN, buff=0.35)
            tbl.add(col)
        tbl.arrange(RIGHT, buff=0.55).move_to([0, 0.2, 0])
        tbl.scale_to_fit_width(min(tbl.width, 12.2))
        self.say("표로 정리한 자료예요", "이서네 반 친구들이 실천하는 환경 보호 활동을 조사해 표로 정리했어요.")
        self.play(Write(q), FadeIn(tbl), run_time=1.2)
        self.say("한눈에 비교하려면?", "어떤 활동이 가장 많은지 한눈에 비교하려면 어떻게 나타내면 좋을까요?")
        self.wait(1.0)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def make_bars(self):
        self.section("막대로 나타내기")
        ch = Chart(ITEMS, vmax=10, step=1, origin=[-4.6, -1.75, 0], w=9.2, h=3.5, ylab="(명)")
        self.say("수량을 막대의 길이로", "학생 수를 막대의 길이로 나타내 볼까요?")
        self.play(FadeIn(ch.axes_group), run_time=0.8)
        bars = ch.bars(VALS)
        self.play(LaggedStart(*[GrowFromEdge(b, DOWN) for b in bars], lag_ratio=0.25, run_time=2.0))
        self.say(f"이런 그래프가 {g('막대그래프')}", "조사한 자료의 수량을 막대 모양으로 나타낸 그래프를 막대그래프라고 해요.")
        t = M(g("막대그래프"), 50).move_to([0.6, 2.35, 0])
        self.play(FadeIn(t), run_time=0.5)
        self.say(f"가장 많은 것이 {o('한눈에')}", "막대가 가장 긴 분리배출이 가장 많고, 가장 짧은 나무 심기가 가장 적다는 것을 한눈에 알 수 있어요.")
        self.play(Indicate(bars[0], color=ORANGE, scale_factor=1.06), run_time=0.8)
        self.play(Indicate(bars[3], color=ORANGE, scale_factor=1.06), run_time=0.8)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def read(self):
        self.section("눈금 읽기")
        ch = Chart(ITEMS, vmax=10, step=1, origin=[-4.6, -1.75, 0], w=9.2, h=3.5, ylab="(명)")
        bars = ch.bars(VALS)
        self.play(FadeIn(ch.axes_group), FadeIn(bars), run_time=0.6)
        self.say(f"세로 눈금 한 칸 = {o('1명')}", "먼저 가로와 세로가 무엇을 나타내는지, 세로 눈금 한 칸이 몇 명인지 확인해요. 여기서는 한 칸이 1명이에요.")
        tick = SurroundingRectangle(VGroup(ch.axes_group[0], ch.axes_group[2]), color=ORANGE, buff=0.03, stroke_width=4)
        self.play(Create(tick), run_time=0.6)
        self.say(f"물 아끼기 막대 → {g('5명')}", "물 아끼기 막대 끝은 5칸, 그러니까 5명이에요.")
        self.play(Indicate(bars[1], color=GREEN, scale_factor=1.06), run_time=0.8)
        d = M(f"분리배출 8명 − 나무 심기 3명 = {g('5명')} 차이", 40).move_to([0.6, 2.4, 0])
        d.scale_to_fit_width(min(d.width, 10.4))
        self.say(f"막대 길이의 차 = {g('수량의 차')}", "분리배출은 8명, 나무 심기는 3명이니 5명 차이가 나요. 막대 길이의 차이로도 알 수 있어요.")
        self.play(FadeIn(d), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def horizontal(self):
        self.section("가로 막대그래프")
        self.say("막대를 가로로 나타낼 수도 있어요", "막대그래프는 막대를 가로로 눕혀서 나타낼 수도 있어요.")
        rows = VGroup()
        u = 0.75
        for i, (a, v) in enumerate(zip(ITEMS, VALS)):
            lab = T(a, 32).move_to([-4.4, 1.3 - i * 0.95, 0])
            bar = Rectangle(width=v * u, height=0.55, fill_color=BLUE, fill_opacity=0.85, stroke_color=INK, stroke_width=2)
            bar.move_to([-3.1 + v * u / 2, 1.3 - i * 0.95, 0])
            rows.add(VGroup(lab, bar))
        self.play(LaggedStart(*[FadeIn(r[0]) for r in rows], lag_ratio=0.2), run_time=0.8)
        self.play(LaggedStart(*[GrowFromEdge(r[1], LEFT) for r in rows], lag_ratio=0.25, run_time=1.6))
        self.say(f"세로든 가로든 {g('막대의 길이')}가 수량", "세로든 가로든, 막대의 길이가 수량을 나타내요.")
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
