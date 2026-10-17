"""「수학 원리 돋보기」 5학년 45화 — 점대칭도형 (5-2 3단원 7차시, 화 코드 5-2-3-e)

어떤 점을 중심으로 180° 돌렸을 때 처음 도형과 완전히 겹치는 도형 = 점대칭도형, 그 점 = 대칭의 중심
평행사변형·S자 모양은 점대칭도형, 정삼각형은 점대칭도형이 아님(180° 돌리면 거꾸로)
최종: GRADE=5 ./make_final.sh 45
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, PI, RIGHT, UP, Create, Cross, Dot, FadeIn, FadeOut, Indicate, Rotate, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from shapes import PURPLE, poly, regular

RED = "#C0392B"
SSHAPE = [(-1.5, -1.2), (0.5, -1.2), (0.5, -0.4), (-0.7, -0.4), (-0.7, 0.4), (1.5, 0.4), (1.5, 1.2), (-0.5, 1.2), (-0.5, 0.4 + 0.0)]


class G5Ep45(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 45
    EP_TITLE = "점대칭도형"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.turn()
        self.check()
        self.closing(f"한 점을 중심으로 {o('180°')} 돌렸을 때 처음과 완전히 겹치면 {g('점대칭도형')}\n그 점이 {b('대칭의 중심')}",
                     next_preview="5학년 46화 · 점대칭도형의 성질")
        self.wait(0.5)

    def zshape(self, c, color=ORANGE):
        c = np.array(c, float)
        pts = [(-1.6, -1.0), (0.6, -1.0), (0.6, -0.2), (-0.6, -0.2), (-0.6, 0.2), (1.6, 0.2), (1.6, 1.0), (-0.6, 1.0), (-0.6, 0.6), (0.6, 0.6), (0.6, 0.2 + 0.0)]
        pts = [(-1.6, -1.0), (0.4, -1.0), (0.4, 0.2), (1.6, 0.2), (1.6, 1.0), (-0.4, 1.0), (-0.4, -0.2), (-1.6, -0.2)]
        return poly([c + np.array([x, y, 0]) for x, y in pts], fill=color)

    def problem(self):
        self.section("문제")
        q = M("반 바퀴 돌려도 처음과 똑같아 보이는\n모양에는 어떤 특징이 있을까요?", 44).move_to([0.6, 1.8, 0])
        z = self.zshape([0, -0.6, 0])
        self.say("반 바퀴 돌려도 같은 모양", "반 바퀴 돌려도 처음과 똑같아 보이는 모양에는 어떤 특징이 있을까요?")
        self.play(Write(q), FadeIn(z), run_time=1.2)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def turn(self):
        self.section("180° 돌려 보기")
        c = np.array([-2.6, 0.1, 0])
        z = self.zshape(c)
        ghost = z.copy().set_fill(BLUE, 0.35).set_stroke(BLUE, 5)
        d = Dot(c, radius=0.11, color=RED)
        self.say("가운데 점을 중심으로 돌려요", "가운데 점을 중심으로 이 도형을 반 바퀴, 180도 돌려 볼게요.")
        self.play(FadeIn(z), FadeIn(d), run_time=0.5)
        self.add(ghost, d)
        self.play(Rotate(ghost, PI, about_point=c), run_time=2.0)
        self.say(f"처음 도형과 {g('완전히 겹쳐요')}", "180도 돌린 도형이 처음 도형과 완전히 겹쳐요.")
        self.play(Indicate(ghost, color=GREEN, scale_factor=1.04), run_time=0.8)
        t1 = M(f"180° 돌려 완전히 겹치는 도형\n= {g('점대칭도형')}", 40).move_to([3.3, 0.8, 0])
        t2 = M(f"그 점 = {b('대칭의 중심')}", 40).move_to([3.3, -0.6, 0])
        self.say(f"이런 도형이 {g('점대칭도형')}", "이렇게 한 점을 중심으로 180도 돌렸을 때 처음 도형과 완전히 겹치는 도형을 점대칭도형이라고 하고, 그 점을 대칭의 중심이라고 해요.")
        self.play(FadeIn(t1), run_time=0.5)
        self.play(FadeIn(t2), Indicate(d, color=RED, scale_factor=2), run_time=0.7)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def check(self):
        self.section("점대칭도형일까요?")
        cp = np.array([-3.2, 0.5, 0])
        par = poly([cp + np.array(p) for p in ([-1.4, -0.7, 0], [0.6, -0.7, 0], [1.4, 0.7, 0], [-0.6, 0.7, 0])], fill=BLUE)
        ct = np.array([3.2, 0.5, 0])
        TP = regular(3, 1.1, ct)
        tri = poly(TP, fill=ORANGE)
        ctt = np.mean(TP, axis=0)
        d1, d2 = Dot(cp, radius=0.09, color=RED), Dot(ctt, radius=0.09, color=RED)
        self.play(FadeIn(par), FadeIn(tri), FadeIn(d1), FadeIn(d2), run_time=0.5)
        g1 = par.copy().set_fill(GREEN, 0.3).set_stroke(GREEN, 5)
        g2 = tri.copy().set_fill(RED, 0.2).set_stroke(RED, 5)
        self.add(g1, g2)
        self.say("평행사변형과 정삼각형을 180° 돌리면", "평행사변형과 정삼각형을 각각 가운데 점을 중심으로 180도 돌려 볼게요.")
        self.play(Rotate(g1, PI, about_point=cp), Rotate(g2, PI, about_point=ctt), run_time=2.0)
        l1 = M(f"완전히 겹쳐요\n→ {g('점대칭도형')}", 34).move_to([-3.2, -1.25, 0])
        l2 = M(f"거꾸로 돼요\n→ {RED_T('점대칭도형이 아니에요')}", 34).move_to([3.2, -1.25, 0])
        self.say(f"평행사변형은 {g('점대칭도형')}", "평행사변형은 처음과 완전히 겹쳐요. 점대칭도형이에요.")
        self.play(FadeIn(l1), run_time=0.5)
        self.say(f"정삼각형은 {RED_T('아니에요')}", "정삼각형은 돌리면 꼭짓점이 아래로 가서 겹치지 않아요. 점대칭도형이 아니에요. 정삼각형은 선대칭도형이지만 점대칭도형은 아니에요.")
        self.play(FadeIn(l2), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()


def RED_T(s):
    return f'<span foreground="{RED}">{s}</span>'
