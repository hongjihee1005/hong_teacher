"""「수학 원리 돋보기」 5학년 52화 — 직육면체와 정육면체 (5-2 5단원 2차시, 화 코드 5-2-5-a)

직사각형 6개로 둘러싸인 도형 = 직육면체, 정사각형 6개 = 정육면체
면(선분으로 둘러싸인 부분) 6, 모서리(면과 면이 만나는 선분) 12, 꼭짓점(모서리끼리 만나는 점) 8
정육면체는 직육면체라고 할 수 있음
최종: GRADE=5 ./make_final.sh 52
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, Dot, FadeIn, FadeOut, Indicate, LaggedStart, Line, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from cuboid import Cuboid, EDGES

RED = "#C0392B"


class G5Ep52(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 52
    EP_TITLE = "직육면체와 정육면체"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.define()
        self.parts()
        self.closing(f"직사각형 6개로 둘러싸이면 {o('직육면체')}, 정사각형 6개면 {b('정육면체')}\n면 {g('6')}, 모서리 {g('12')}, 꼭짓점 {g('8')}",
                     next_preview="5학년 53화 · 겨냥도")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("택배 상자는 어떤 모양으로 둘러싸여 있을까요?", 46).move_to([0.6, 2.2, 0])
        cb = Cuboid(3.0, 1.8, 2.4, [0, -0.6, 0])
        box = VGroup(cb.face("front", "#C98B4B", 0.8), cb.face("top", "#E0AE74", 0.8), cb.face("right", "#A8743E", 0.8), cb.edges(show_hidden=False))
        self.say("택배 상자 모양", "택배 상자나 사물함은 어떤 모양의 면으로 둘러싸여 있을까요?")
        self.play(Write(q), FadeIn(box), run_time=1.2)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def define(self):
        self.section("직육면체와 정육면체")
        a = Cuboid(2.8, 1.6, 2.0, [-3.2, 0.5, 0])
        b_ = Cuboid(2.0, 2.0, 2.0, [3.0, 0.5, 0])
        A = VGroup(a.face("front", ORANGE, 0.35), a.face("top", ORANGE, 0.2), a.face("right", ORANGE, 0.28), a.edges())
        B = VGroup(b_.face("front", BLUE, 0.35), b_.face("top", BLUE, 0.2), b_.face("right", BLUE, 0.28), b_.edges())
        la = M(f"직사각형 6개 → {o('직육면체')}", 40).move_to([-3.2, -1.6, 0])
        lb = M(f"정사각형 6개 → {b('정육면체')}", 40).move_to([3.0, -1.6, 0])
        self.say(f"직사각형 6개로 둘러싸이면 {o('직육면체')}", "직사각형 6개로 둘러싸인 도형을 직육면체라고 해요.")
        self.play(FadeIn(A), FadeIn(la), run_time=0.7)
        self.say(f"정사각형 6개로 둘러싸이면 {b('정육면체')}", "정사각형 6개로 둘러싸인 도형은 정육면체라고 해요. 정사각형도 직사각형이니 정육면체는 직육면체라고도 할 수 있어요.")
        self.play(FadeIn(B), FadeIn(lb), run_time=0.7)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def parts(self):
        self.section("면, 모서리, 꼭짓점")
        cb = Cuboid(3.0, 1.9, 2.2, [-4.0, 0.4, 0])
        edges = cb.edges()
        self.play(Create(edges), run_time=0.8)
        f = cb.face("front", ORANGE, 0.5)
        t1 = M(f"선분으로 둘러싸인 부분 = {o('면')} → {o('6개')}", 32).move_to([2.7, 1.6, 0])
        self.say(f"{o('면')}은 6개", "선분으로 둘러싸인 부분을 면이라고 해요. 직육면체의 면은 6개예요.")
        self.play(FadeIn(f), FadeIn(t1), run_time=0.6)
        hl = VGroup(*[Line(cb.v[i], cb.v[j], color=BLUE, stroke_width=9) for i, j in EDGES])
        t2 = M(f"면과 면이 만나는 선분 = {b('모서리')} → {b('12개')}", 32).move_to([2.7, 0.6, 0])
        self.say(f"{b('모서리')}는 12개", "면과 면이 만나는 선분을 모서리라고 해요. 앞 4개, 뒤 4개, 옆으로 4개, 모두 12개예요.")
        self.play(LaggedStart(*[Create(x) for x in hl], lag_ratio=0.15, run_time=2.0), FadeIn(t2))
        self.play(FadeOut(hl), run_time=0.3)
        dots = VGroup(*[Dot(p, radius=0.11, color=RED) for p in cb.v])
        t3 = M(f"모서리끼리 만나는 점 = {g('꼭짓점')} → {g('8개')}", 32).move_to([2.7, -0.4, 0])
        self.say(f"{g('꼭짓점')}은 8개", "모서리와 모서리가 만나는 점을 꼭짓점이라고 해요. 꼭짓점은 8개예요.")
        self.play(LaggedStart(*[FadeIn(d, scale=2) for d in dots], lag_ratio=0.15, run_time=1.2), FadeIn(t3))
        n = M(f"정육면체도 면 6, 모서리 12, 꼭짓점 8로 {g('같아요')}", 36).move_to([0, -2.1, 0])
        self.play(FadeIn(n), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
