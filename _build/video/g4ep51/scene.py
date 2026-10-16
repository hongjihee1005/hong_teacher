"""「수학 원리 돋보기」 4학년 51화 — 표를 꺾은선그래프로 나타내기 (4-2 5단원 4차시, 화 코드 4-2-5-b)

진우의 몸무게(kg) 3월~7월: 30, 31, 31, 32, 34
① 가로(월)·세로(몸무게) 정하기 ② 물결선(0~29 줄이기)과 눈금 한 칸(1 kg) ③ 점 찍기 ④ 선분 잇기 ⑤ 제목
최종: GRADE=4 ./make_final.sh 51
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, DashedLine, Dot, FadeIn, FadeOut, Indicate, LaggedStart, Line,
                   SurroundingRectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from chart import Chart, wave

RED = "#C0392B"
ITEMS = ["3월", "4월", "5월", "6월", "7월"]
VALS = [30, 31, 31, 32, 34]
STEPS = ["① 가로·세로 정하기", "② 물결선과 눈금 한 칸", "③ 점 찍기", "④ 선분으로 잇기", "⑤ 제목 쓰기"]


class G4Ep51(EpisodeScene):
    GRADE, SEM = 4, 2
    EP_NO = 51
    EP_TITLE = "표를 꺾은선그래프로 나타내기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.build()
        self.closing(f"가로·세로 → {o('물결선과 눈금')} → 점 → 선분 → 제목\n가장 큰 값까지 나타낼 수 있게 {g('눈금')}을 정해요",
                     next_preview="4학년 52화 · 꺾은선그래프로 앞으로를 예상하기")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("진우의 몸무게를 꺾은선그래프로 나타내 볼까요?", 44)
        q.scale_to_fit_width(min(q.width, 10.4)).move_to([0.6, 2.2, 0])
        h = VGroup(T("월", 32, SOFT), *[T(s, 32) for s in ITEMS]).arrange(RIGHT, buff=0.6)
        v = VGroup(T("몸무게(kg)", 32, SOFT), *[T(str(x), 32, ORANGE) for x in VALS])
        for i, t in enumerate(v):
            t.move_to([h[i].get_x(), -0.6, 0])
        tb = VGroup(h, v).move_to([0, 0.3, 0])
        self.say("진우의 몸무게", "진우가 3월부터 7월까지 달마다 잰 몸무게예요. 이 표를 꺾은선그래프로 나타내 볼까요?")
        self.play(Write(q), FadeIn(tb), run_time=1.2)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def build(self):
        self.section("다섯 단계")
        steps = VGroup(*[T(s, 32, SOFT) for s in STEPS]).arrange(DOWN, aligned_edge=LEFT, buff=0.38).move_to([4.3, 0.2, 0])
        ch = Chart(ITEMS, vmax=35, step=1, vmin=28, origin=[-5.0, -1.8, 0], w=6.4, h=3.6, label_size=28, ylab="(kg)")
        g_ = ch.axes_group
        self.play(FadeIn(steps), run_time=0.5)

        def on(i):
            return [steps[i].animate.set_color(INK).scale(1.06)] + ([steps[i - 1].animate.set_color(SOFT).scale(1 / 1.06)] if i else [])
        self.say(f"① 가로에는 {o('월')}, 세로에는 {o('몸무게')}", "먼저 가로와 세로에 무엇을 나타낼지 정해요. 변하는 때인 월을 가로에, 몸무게를 세로에 나타내요.")
        self.play(*on(0), FadeIn(g_[-2:]), run_time=0.7)
        w = wave(ch, 29, bg=self.bg)
        self.say(f"② 0~29는 필요 없어요 → {o('물결선')}", "몸무게가 모두 30킬로그램 넘으니 0부터 29까지는 필요 없어요. 물결선으로 줄여요.")
        self.play(*on(1), FadeIn(g_[:-2]), run_time=0.8)
        self.play(Create(w), run_time=0.6)
        br = SurroundingRectangle(VGroup(ch.ylabels[2], ch.ylabels[3]), color=ORANGE, buff=0.06)
        self.say(f"눈금 한 칸은 {o('1 kg')}, 가장 큰 34까지 들어가게", "세로 눈금 한 칸은 1킬로그램으로 정했어요. 가장 무거운 34킬로그램까지 나타낼 수 있어요.")
        self.play(Create(br), run_time=0.5)
        self.play(FadeOut(br), run_time=0.3)
        x2, y2 = ch.x(2), ch.y(31)
        gv = DashedLine([x2, ch.o[1], 0], [x2, y2, 0], color=GREEN, stroke_width=4)
        gh = DashedLine([ch.o[0], y2, 0], [x2, y2, 0], color=GREEN, stroke_width=4)
        dots = ch.dots(VALS)
        self.say(f"③ 가로 눈금과 세로 눈금이 만나는 곳에 {o('점')}", "가로 눈금과 세로 눈금이 만나는 곳에 점을 찍어요. 5월은 31킬로그램이니 5월과 31이 만나는 곳이에요.")
        self.play(*on(2), Create(gv), Create(gh), run_time=0.8)
        self.play(FadeIn(dots[2], scale=2), run_time=0.4)
        self.play(FadeOut(gv), FadeOut(gh), LaggedStart(*[FadeIn(d, scale=2) for i, d in enumerate(dots) if i != 2], lag_ratio=0.2, run_time=1.0))
        lines = ch.lines(VALS)
        self.say(f"④ 점을 차례로 {o('선분')}으로 이어요", "찍은 점들을 차례로 선분으로 이어요.")
        self.play(*on(3), LaggedStart(*[Create(l) for l in lines], lag_ratio=0.6, run_time=1.4))
        self.add(dots)
        title = T("진우의 몸무게", 36).move_to([ch.o[0] + ch.w / 2, 2.35, 0])
        self.say(f"⑤ 알맞은 {o('제목')}을 써요", "마지막으로 알맞은 제목을 써요. 진우의 몸무게.")
        self.play(*on(4), Write(title), run_time=0.8)
        n = M(f"6월~7월에\n{g('가장 많이')} 늘었어요", 40).move_to([4.3, 0.2, 0])
        self.say(f"6월~7월에 {g('2 kg')}으로 가장 많이 늘었어요", "완성한 그래프를 보면 6월에서 7월 사이에 2킬로그램으로 가장 많이 늘었어요. 선이 가장 많이 기울었지요.")
        self.play(FadeOut(steps), run_time=0.4)
        self.play(lines[3].animate.set_color(RED).set_stroke(width=10), FadeIn(n), run_time=0.7)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
