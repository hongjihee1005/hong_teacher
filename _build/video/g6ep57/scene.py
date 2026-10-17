"""「수학 원리 돋보기」 6학년 57화 — 원주율 (6-2 5단원 3차시, 화 코드 6-2-5-b)

원의 지름에 대한 원주의 비율 = 원주율, (원주율) = (원주) ÷ (지름)
원주율은 원의 크기와 상관없이 일정, 3.1415926535897932…처럼 끝없이 계속 → 반올림하여 3.14로 씀
(굴리는 장면: 지름 1인 원을 한 바퀴 굴리면 지름의 3배와 조금 더)
최종: GRADE=6 ./make_final.sh 57
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, PI, RIGHT, TAU, UP, Circle, Create, Dot, FadeIn, FadeOut, Indicate, LaggedStart, Line,
                   Rotate, ValueTracker, VGroup, Write, always_redraw, linear)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from tablekit import table

D = 1.6   # 화면 위 지름


class G6Ep57(EpisodeScene):
    GRADE, SEM = 6, 2
    EP_NO = 57
    EP_TITLE = "원주율"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.roll()
        self.constant()
        self.closing(f"(원주율) = ({o('원주')}) ÷ ({b('지름')}) — 원의 크기와 상관없이 일정해요\n3.1415926…처럼 끝없이 이어져서 {g('3.14')}로 써요",
                     next_preview="6학년 58화 · 원주와 지름 구하기")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("원을 한 바퀴 굴리면 지름의 몇 배만큼 갈까요?", 44).move_to([0.6, 1.6, 0])
        self.say("한 바퀴 굴리면?", "원을 바닥에 대고 한 바퀴 굴리면 지름의 몇 배만큼 갈까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def roll(self):
        self.section("한 바퀴 굴리기")
        x0, y0 = -5.6, -0.6
        r = D / 2
        ground = Line([x0 - 0.3, y0, 0], [x0 + PI * D + 0.6, y0, 0], color=INK, stroke_width=4)
        ticks = VGroup(*[Line([x0 + k * D, y0 - 0.15, 0], [x0 + k * D, y0 + 0.15, 0], color=BLUE, stroke_width=4) for k in range(4)])
        tl = VGroup(*[M(b(f"지름 {k}개") if k else "0", 24).move_to([x0 + k * D, y0 - 0.45, 0]) for k in range(4)])
        self.play(Create(ground), FadeIn(ticks), FadeIn(tl), run_time=0.6)
        t = ValueTracker(0)

        def wheel():
            a = t.get_value()
            cx = x0 + a * r
            c = Circle(radius=r, color=ORANGE, stroke_width=6).move_to([cx, y0 + r, 0])
            sp = Line([cx, y0 + r, 0], [cx - r * np.sin(a), y0 + r - r * np.cos(a), 0], color=ORANGE, stroke_width=4)
            dt = Dot([cx - r * np.sin(a), y0 + r - r * np.cos(a), 0], radius=0.09, color=GREEN)
            return VGroup(c, sp, dt)

        w = always_redraw(wheel)
        trace = always_redraw(lambda: Line([x0, y0, 0], [x0 + t.get_value() * r, y0, 0], color=GREEN, stroke_width=8))
        self.add(trace, w)
        self.say("초록 점이 다시 바닥에 닿을 때까지", "초록 점이 바닥에 닿은 곳에서 출발해 원을 한 바퀴 굴려 볼게요.")
        self.play(t.animate.set_value(TAU), run_time=4.0, rate_func=linear)
        end = Line([x0 + PI * D, y0 - 0.25, 0], [x0 + PI * D, y0 + 0.25, 0], color=GREEN, stroke_width=5)
        lab = M(f"원주 = 지름의 {g('3배')}와 조금 더", 38).move_to([0, 2.0, 0])
        self.say(f"지름의 {g('3배')}와 조금 더", "한 바퀴 굴러간 거리, 곧 원주는 지름 3개를 지나 조금 더 갔어요.")
        self.play(Create(end), FadeIn(lab), run_time=0.6)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def constant(self):
        self.section("원주율")
        frame, cells = table([["원", "원주(cm)", "지름(cm)", "원주 ÷ 지름"],
                              ["가", "12.56", "4", "3.14"], ["나", "25.12", "8", "3.14"], ["다", "37.68", "12", "3.14"]],
                             (0, 1.0), cw=2.4, hw=1.2, h=0.62, size=30)
        self.say("크기가 다른 원들", "크기가 다른 원의 원주를 지름으로 나누어 보면 모두 약 3.14예요. 원의 크기와 상관없이 일정해요.")
        self.play(FadeIn(frame), *[FadeIn(c) for r in cells for c in r[:3]], FadeIn(cells[0][3]), run_time=0.7)
        self.play(LaggedStart(*[FadeIn(cells[k][3]) for k in range(1, 4)], lag_ratio=0.3, run_time=0.9))
        d = M(f"(원주율) = ({o('원주')}) ÷ ({b('지름')})", 42).move_to([0, -0.8, 0])
        self.say(f"지름에 대한 원주의 비율 = {g('원주율')}", "원의 지름에 대한 원주의 비율을 원주율이라고 해요. 원주율은 원주를 지름으로 나눈 값이에요.")
        self.play(FadeIn(d), run_time=0.6)
        pi = M(f"3.1415926535897932… → 약 {g('3.14')}", 40).move_to([0, -1.8, 0])
        self.say(f"끝없이 이어져서 {g('3.14')}로 써요", "원주율은 3.1415926…처럼 끝없이 이어져요. 그래서 반올림하여 소수 둘째 자리까지 나타낸 3.14를 써요.")
        self.play(FadeIn(pi), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
