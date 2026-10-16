"""「수학 원리 돋보기」 4학년 50화 — 꺾은선그래프는 무엇을 보여 줄까? (4-2 5단원 2·3차시, 화 코드 4-2-5-a)

교실 기온(°C) 9시~2시: 12, 14, 17, 19, 20, 18
막대 끝에 점 → 막대가 사라지고 선분으로 이음 = 꺾은선그래프 / 선이 많이 기울수록 변화가 큼(10시~11시 3 °C)
11시 30분은 약 18 °C(중간 어림) / 물결선으로 필요 없는 부분을 줄이면 변화가 뚜렷
최종: GRADE=4 ./make_final.sh 50
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, DashedLine, Dot, FadeIn, FadeOut, GrowFromEdge, Indicate,
                   LaggedStart, Line, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from chart import Chart, wave

RED = "#C0392B"
ITEMS = ["9시", "10시", "11시", "12시", "1시", "2시"]
VALS = [12, 14, 17, 19, 20, 18]


class G4Ep50(EpisodeScene):
    GRADE, SEM = 4, 2
    EP_NO = 50
    EP_TITLE = "꺾은선그래프는 무엇을 보여 줄까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.make()
        self.read()
        self.zoom()
        self.closing(f"꺾은선그래프는 시간에 따라 {o('변하는 모양')}을 한눈에 보여 줘요\n선이 많이 기울수록 {g('변화가 커요')}",
                     next_preview="4학년 51화 · 표를 꺾은선그래프로 나타내기")
        self.wait(0.5)

    def table(self, c):
        rows = VGroup()
        h = VGroup(T("시각", 30, SOFT), *[T(s, 30) for s in ITEMS]).arrange(RIGHT, buff=0.45)
        v = VGroup(T("기온(°C)", 30, SOFT), *[T(str(x), 30, ORANGE) for x in VALS])
        for i, t in enumerate(v):
            t.move_to([h[i].get_x(), 0, 0])
        v.shift(DOWN * 0.6)
        rows.add(h, v)
        return rows.move_to(c)

    def problem(self):
        self.section("문제")
        q = M("교실 기온은 어떻게 변했을까요?", 48).move_to([0.6, 2.2, 0])
        tb = self.table([0, 0.3, 0])
        self.say("교실 기온을 한 시간마다 쟀어요", "교실 기온을 아침 9시부터 오후 2시까지 한 시간마다 재어 표로 나타냈어요. 기온이 어떻게 변했는지 한눈에 보려면 어떻게 나타내면 좋을까요?")
        self.play(Write(q), FadeIn(tb), run_time=1.2)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def chart(self, **kw):
        a = dict(vmax=22, step=2, origin=[-5.6, -1.85, 0], w=7.4, h=3.7, ylab="(°C)")
        a.update(kw)
        return Chart(ITEMS, **a)

    def make(self):
        self.section("막대에서 꺾은선으로")
        ch = self.chart()
        bars = ch.bars(VALS)
        self.say("먼저 막대그래프로 그려 봐요", "먼저 막대그래프로 나타내 볼게요.")
        self.play(FadeIn(ch.axes_group), run_time=0.5)
        self.play(LaggedStart(*[GrowFromEdge(x, DOWN) for x in bars], lag_ratio=0.15, run_time=1.3))
        dots = ch.dots(VALS)
        self.say(f"막대 끝에 {o('점')}을 찍고", "막대의 끝 가운데에 점을 찍어요.")
        self.play(LaggedStart(*[FadeIn(d, scale=2) for d in dots], lag_ratio=0.12, run_time=1.0))
        lines = ch.lines(VALS)
        self.say(f"막대를 지우고 점을 {o('선분')}으로 이어요", "막대를 지우고, 점들을 차례로 선분으로 이어요.")
        self.play(FadeOut(bars), run_time=0.7)
        self.play(LaggedStart(*[Create(l) for l in lines], lag_ratio=0.6, run_time=1.6))
        self.add(dots)
        t = M(f"{g('꺾은선그래프')}", 50).move_to([4.4, 0.6, 0])
        self.say(f"이것이 {g('꺾은선그래프')}", "이렇게 점을 선분으로 이은 그래프를 꺾은선그래프라고 해요. 시간에 따라 변하는 모양을 한눈에 볼 수 있어요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def read(self):
        self.section("기울기로 변화 읽기")
        ch = self.chart()
        dots, lines = ch.dots(VALS), ch.lines(VALS)
        self.play(FadeIn(ch.axes_group), FadeIn(lines), FadeIn(dots), run_time=0.6)
        self.say(f"선이 {o('가장 많이 기운')} 곳은?", "기온이 가장 많이 오른 때는 언제일까요? 선분이 가장 많이 기운 곳을 찾아요.")
        self.play(lines[1].animate.set_color(RED).set_stroke(width=10), run_time=0.6)
        n1 = M(f"10시~11시\n14 → 17, {o('3 °C')} 올랐어요", 34).move_to([4.5, 1.3, 0])
        self.play(FadeIn(n1), run_time=0.5)
        self.say(f"선이 내려가면 {b('기온이 내려간')} 거예요", "1시에서 2시 사이는 선이 내려가요. 기온이 내려갔어요.")
        self.play(lines[4].animate.set_color(BLUE).set_stroke(width=10), run_time=0.6)
        x = (ch.x(2) + ch.x(3)) / 2
        y = (ch.y(17) + ch.y(19)) / 2
        v = DashedLine([x, ch.o[1], 0], [x, y, 0], color=GREEN, stroke_width=4)
        hz = DashedLine([x, y, 0], [ch.o[0], y, 0], color=GREEN, stroke_width=4)
        p = Dot([x, y, 0], radius=0.11, color=GREEN)
        n2 = M(f"11시 30분은\n약 {g('18 °C')}", 38).move_to([4.5, -0.6, 0])
        self.say(f"재지 않은 11시 30분도 어림할 수 있어요 → {g('약 18 °C')}", "재지 않은 11시 30분의 기온도 선분 가운데를 읽어 어림할 수 있어요. 약 18도예요.")
        self.play(Create(v), FadeIn(p), Create(hz), FadeIn(n2), run_time=1.0)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def zoom(self):
        self.section("물결선")
        a = Chart(ITEMS, vmax=22, step=2, origin=[-5.6, -1.5, 0], w=5.0, h=3.5, label_size=22, ylab="(°C)")
        bb = Chart(ITEMS, vmax=21, step=1, vmin=8, origin=[1.4, -1.5, 0], w=5.0, h=3.5, label_size=22, tick_every=2, ylab="(°C)")
        self.say("0부터 그리면 아래쪽이 비어요", "왼쪽은 눈금이 0부터예요. 기온이 모두 10도보다 높아서 아래쪽이 비어 있고 변화가 작게 보여요.")
        self.play(FadeIn(a.axes_group), FadeIn(a.lines(VALS)), FadeIn(a.dots(VALS)), run_time=0.8)
        w = wave(bb, 10, bg=self.bg)
        self.say(f"{o('물결선')}으로 필요 없는 부분을 줄여요", "오른쪽은 필요 없는 0과 10 사이를 물결선으로 줄이고, 눈금 한 칸을 1도로 크게 했어요.")
        self.play(FadeIn(bb.axes_group), Create(w), run_time=0.8)
        self.play(LaggedStart(*[Create(l) for l in bb.lines(VALS)], lag_ratio=0.5, run_time=1.4), FadeIn(bb.dots(VALS)))
        n = M(f"변화가 {g('뚜렷하게')} 보여요", 36).move_to([4.0, -2.3, 0])
        self.say(f"변화가 {g('뚜렷하게')} 보여요", "같은 자료인데도 물결선을 쓴 그래프에서 기온의 변화가 더 뚜렷하게 보여요.")
        self.play(FadeIn(n), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
