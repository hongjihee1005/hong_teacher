"""「수학 원리 돋보기」 5학년 62화 — 여러 번 던지면 어떻게 될까? (5-2 6단원 8차시, 화 코드 5-2-6-f)

동전의 그림면이 나올 가능성 1/2 / 10번 던지면 7번처럼 반반과 크게 다를 수 있음
던진 횟수가 많아질수록 그림면 비율이 1/2에 가까워짐 (예: 10번 0.7, 100번 0.54, 1000번 0.507 — 보기로 든 수)
최종: GRADE=5 ./make_final.sh 62
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Circle, Create, DashedLine, Dot, FadeIn, FadeOut, Indicate, LaggedStart,
                   Line, Rectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage

RED = "#C0392B"
DATA = [(10, 7), (50, 29), (100, 54), (500, 256), (1000, 507)]


class G5Ep62(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 62
    EP_TITLE = "여러 번 던지면 어떻게 될까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.few()
        self.many()
        self.closing(f"동전의 그림면이 나올 가능성은 {b('1/2')}\n던진 횟수가 많아질수록 결과가 {g('반반에 가까워져요')}",
                     next_preview="5학년 편 끝! 6학년에서 또 만나요")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("동전을 10번 던졌더니 그림면이 7번 나왔어요.\n그림면이 나올 가능성은 1/2이 아닐까요?", 42).move_to([0.6, 1.6, 0])
        self.say("10번에 7번?", "동전을 10번 던졌더니 그림면이 7번 나왔어요. 그러면 그림면이 나올 가능성은 2분의 1이 아닌 걸까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def few(self):
        self.section("적게 던지면")
        seq = "그그숫그그숫그그숫그"
        coins = VGroup()
        for k, ch in enumerate(seq):
            c = Circle(radius=0.32, fill_color=ORANGE if ch == "그" else BLUE, fill_opacity=0.85, stroke_color=INK, stroke_width=3)
            t = T(ch, 26, "#FFFFFF")
            coins.add(VGroup(c, t).move_to([-4.5 + k * 1.0, 1.2, 0]))
        self.say("10번 던진 결과", "10번 던진 결과예요. 그림면이 7번, 숫자 면이 3번 나왔어요.")
        self.play(LaggedStart(*[FadeIn(c, scale=1.4) for c in coins], lag_ratio=0.12, run_time=1.6))
        t = M(f"적게 던지면 반반과 {o('크게 다를 수 있어요')}", 44).move_to([0, -0.3, 0])
        self.say(f"적게 던지면 {o('다를 수 있어요')}", "가능성은 2분의 1이지만, 적게 던지면 이렇게 반반과 크게 다른 결과가 나올 수 있어요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def many(self):
        self.section("많이 던지면")
        ox, oy, W, H = -5.2, -1.5, 7.4, 3.4
        ax = VGroup(Line([ox, oy, 0], [ox + W, oy, 0], color=INK, stroke_width=4), Line([ox, oy, 0], [ox, oy + H, 0], color=INK, stroke_width=4))
        def yv(r):
            return oy + (r - 0.3) / 0.5 * H
        half = DashedLine([ox, yv(0.5), 0], [ox + W, yv(0.5), 0], color=GREEN, stroke_width=4)
        hl = T("1/2", 30, GREEN).next_to([ox, yv(0.5), 0], LEFT, buff=0.15)
        ylab = VGroup(T("0.3", 22, SOFT).next_to([ox, yv(0.3), 0], LEFT, buff=0.12), T("0.8", 22, SOFT).next_to([ox, yv(0.8), 0], LEFT, buff=0.12))
        self.say("던진 횟수를 늘리면", "던진 횟수를 늘려 가며 그림면이 나온 비율을 그래프로 나타내 볼게요.")
        self.play(Create(ax), Create(half), FadeIn(hl), FadeIn(ylab), run_time=0.8)
        pts = []
        dots = VGroup()
        labs = VGroup()
        for k, (n, h) in enumerate(DATA):
            x = ox + (k + 0.6) * W / 5.2
            r = h / n
            p = np.array([x, yv(r), 0])
            pts.append(p)
            dots.add(Dot(p, radius=0.1, color=ORANGE))
            labs.add(T(f"{n}번", 24).move_to([x, oy - 0.3, 0]))
        lines = VGroup(*[Line(pts[k], pts[k + 1], color=ORANGE, stroke_width=5) for k in range(len(pts) - 1)])
        self.play(FadeIn(labs), run_time=0.4)
        self.play(LaggedStart(*[FadeIn(d, scale=2) for d in dots], lag_ratio=0.3, run_time=1.4), LaggedStart(*[Create(l) for l in lines], lag_ratio=0.3, run_time=1.4))
        t = M(f"횟수가 많아질수록\n{g('1/2에 가까워져요')}", 34).move_to([4.5, 1.2, 0])
        self.say(f"많이 던질수록 {g('1/2에 가까워져요')}", "던진 횟수가 많아질수록 그림면이 나온 비율이 2분의 1에 점점 가까워져요. 그래서 가능성을 2분의 1이라고 해요.")
        self.play(FadeIn(t), run_time=0.5)
        n = T("(그래프의 수는 보기로 든 결과예요)", 22, SOFT).move_to([4.5, 0.1, 0])
        self.play(FadeIn(n), run_time=0.3)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
