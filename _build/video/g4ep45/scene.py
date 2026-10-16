"""「수학 원리 돋보기」 4학년 45화 — 평행과 평행선 사이의 거리 (4-2 4단원 3·4차시, 화 코드 4-2-4-b)

한 직선에 수직인 두 직선 → 아무리 늘여도 만나지 않음 = 평행, 평행선
평행선 사이의 선분 중 수직인 선분이 가장 짧고(2 cm < 2.5 cm < 약 3.6 cm) 어디서 재어도 같음 = 평행선 사이의 거리
최종: GRADE=4 ./make_final.sh 45
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, Dot, FadeIn, FadeOut, Indicate, LaggedStart, Line, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from shapes import PURPLE, par_mark, right_mark

RED = "#C0392B"


class G4Ep45(EpisodeScene):
    GRADE, SEM = 4, 2
    EP_NO = 45
    EP_TITLE = "평행과 평행선 사이의 거리"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.parallel()
        self.distance()
        self.closing(f"아무리 늘여도 만나지 않는 두 직선은 {o('평행')}\n평행선 사이의 {b('수직인 선분')}의 길이가 {g('평행선 사이의 거리')}",
                     next_preview="4학년 46화 · 사다리꼴")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("기찻길의 두 레일은 언젠가 만날까요?", 48).move_to([0.6, 2.3, 0])
        rails = VGroup(Line([-4.5, 0.2, 0], [4.5, 0.2, 0], color=SOFT, stroke_width=8),
                       Line([-4.5, -1.4, 0], [4.5, -1.4, 0], color=SOFT, stroke_width=8))
        ties = VGroup(*[Line([x, 0.45, 0], [x, -1.65, 0], color="#8B5A2B", stroke_width=10) for x in np.arange(-4.0, 4.1, 0.8)])
        self.say("두 레일은 만날까요?", "기찻길의 두 레일은 아무리 길게 이어져도 만날까요?")
        self.play(Write(q), FadeIn(ties), Create(rails), run_time=1.2)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def parallel(self):
        self.section("평행")
        y0 = -1.4
        base = Line([-5.0, y0, 0], [5.0, y0, 0], color=INK, stroke_width=6)
        la = T("가", 40).next_to(base, RIGHT, buff=0.15)
        self.say("직선 가에 수직인 직선을 두 개 그어요", "직선 가에 수직인 직선을 두 개 그어 볼게요.")
        self.play(Create(base), FadeIn(la), run_time=0.6)
        x1, x2 = -1.6, 1.2
        n1 = Line([x1, y0, 0], [x1, y0 + 3.3, 0], color=BLUE, stroke_width=6)
        n2 = Line([x2, y0, 0], [x2, y0 + 3.3, 0], color=BLUE, stroke_width=6)
        r1, r2 = right_mark([x1, y0, 0], RIGHT, UP, 0.32), right_mark([x2, y0, 0], RIGHT, UP, 0.32)
        ln = T("나", 38, BLUE).next_to(n1, UP, buff=0.12)
        ld = T("다", 38, BLUE).next_to(n2, UP, buff=0.12)
        self.play(Create(n1), Create(r1), Create(n2), Create(r2), FadeIn(ln), FadeIn(ld), run_time=1.0)
        self.say(f"나와 다를 길게 늘이면?", "직선 나와 직선 다를 위아래로 길게 늘이면 어떻게 될까요?")
        self.play(n1.animate.put_start_and_end_on([x1, y0 - 0.8, 0], [x1, 2.5, 0]),
                  n2.animate.put_start_and_end_on([x2, y0 - 0.8, 0], [x2, 2.5, 0]),
                  ln.animate.move_to([x1 - 0.35, 2.4, 0]), ld.animate.move_to([x2 + 0.35, 2.4, 0]), run_time=1.2)
        gap = VGroup(*[Line([x1, y, 0], [x2, y, 0], color=ORANGE, stroke_width=3).set_opacity(0.7) for y in (1.6, 0.2, -2.0)])
        self.say(f"간격이 그대로라서 {o('만나지 않아요')}", "어디를 보아도 두 직선 사이의 간격이 그대로예요. 아무리 늘여도 만나지 않아요.")
        self.play(LaggedStart(*[Create(x) for x in gap], lag_ratio=0.3, run_time=1.0))
        pm = VGroup(par_mark([x1, 0.3, 0], [x1, 0.9, 0]), par_mark([x2, 0.3, 0], [x2, 0.9, 0]))
        t1 = M(f"나와 다는 {g('평행')}", 50).move_to([3.7, 1.2, 0])
        t2 = M(f"{g('평행선')}: 평행한 두 직선", 40).move_to([3.7, 0.2, 0])
        self.say(f"만나지 않는 두 직선은 서로 {g('평행')}", "한 직선에 수직인 두 직선처럼 서로 만나지 않는 두 직선을 평행하다고 해요. 평행한 두 직선을 평행선이라고 해요.")
        self.play(FadeOut(gap), Create(pm), FadeIn(t1), FadeIn(t2), run_time=0.8)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def distance(self):
        self.section("평행선 사이의 거리")
        yt, yb = 1.0, -1.0
        top = Line([-5.2, yt, 0], [5.2, yt, 0], color=INK, stroke_width=6)
        bot = Line([-5.2, yb, 0], [5.2, yb, 0], color=INK, stroke_width=6)
        P = np.array([-4.2, yt, 0])
        dot = Dot(P, radius=0.09, color=RED)
        self.say("한 점에서 아래 직선까지 선분을 그어요", "평행선의 위쪽 직선의 한 점에서 아래쪽 직선까지 여러 선분을 그어 볼게요.")
        self.play(Create(top), Create(bot), FadeIn(dot), run_time=0.7)
        segs = [(3.0, "약 3.6 cm", SOFT), (1.5, "2.5 cm", ORANGE), (0.0, "2 cm", GREEN)]
        lines, labs = VGroup(), VGroup()
        for dx, s, c in segs:
            q = np.array([P[0] + dx, yb, 0])
            l = Line(P, q, color=c, stroke_width=6)
            lab = T(s, 30, c).move_to([P[0] - 0.6, 0, 0] if not dx else [P[0] + dx + (0.3 if dx > 2 else 0), yb - 0.4, 0])
            lines.add(l)
            labs.add(lab)
        self.play(Create(lines[0]), FadeIn(labs[0]), run_time=0.6)
        self.play(Create(lines[1]), FadeIn(labs[1]), run_time=0.6)
        rm = right_mark([P[0], yb, 0], LEFT, UP, 0.3)
        self.play(Create(lines[2]), FadeIn(labs[2]), Create(rm), run_time=0.6)
        self.say(f"{g('수직인 선분')}이 가장 짧아요", "여러 선분 가운데 두 직선에 수직인 선분의 길이가 가장 짧아요.")
        self.play(Indicate(VGroup(lines[2], labs[2]), color=GREEN), run_time=0.8)
        more = VGroup()
        for x in (0.6, 2.2, 3.8):
            more.add(Line([x, yt, 0], [x, yb, 0], color=GREEN, stroke_width=6),
                     right_mark([x, yb, 0], LEFT, UP, 0.3), T("2 cm", 30, GREEN).move_to([x + 0.6, 0, 0]))
        self.say(f"다른 곳에서 재어도 {g('2 cm')}", "다른 곳에서 수직인 선분을 그어 재어도 길이가 모두 2센티미터로 같아요.")
        self.play(LaggedStart(*[FadeIn(m) for m in more], lag_ratio=0.15, run_time=1.4))
        t = M(f"이 길이를 {g('평행선 사이의 거리')}라고 해요", 46).move_to([0, 2.3, 0])
        self.say(f"{g('평행선 사이의 거리')}", "평행선 사이에 수직인 선분의 길이를 평행선 사이의 거리라고 해요. 그래서 기찻길의 두 레일은 언제나 거리가 같고, 만나지 않아요.")
        self.play(FadeIn(t), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
