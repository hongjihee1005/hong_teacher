"""「수학 원리 돋보기」 4학년 21화 — 돌리면 무엇이 바뀔까? (4-1 4단원 5·6차시, 화 코드 4-1-4-c)

시계 방향 90°·180°·270°: 위쪽 부분이 오른쪽 → 아래쪽 → 왼쪽, 360°는 처음과 같음
시계 반대 방향 90°: 위쪽이 왼쪽 / 시계 방향 90° = 시계 반대 방향 270° / 방향과 각도를 함께 말함
최종: GRADE=4 ./make_final.sh 21
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DEGREES, DOWN, LEFT, RIGHT, UP, Arc, Create, CurvedArrow, Dot, FadeIn, FadeOut, Indicate, Rotate,
                   VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, g, o
from division import clear_stage
from move import grid, shape_on


def clock_arrow(c, cw=True, r=1.9):
    if cw:
        return CurvedArrow(c + np.array([-0.3, r, 0]), c + np.array([r, 0.3, 0]), angle=-1.2, color=ORANGE, stroke_width=6)
    return CurvedArrow(c + np.array([0.3, r, 0]), c + np.array([-r, 0.3, 0]), angle=1.2, color=ORANGE, stroke_width=6)


class G4Ep21(EpisodeScene):
    GRADE, SEM = 4, 1
    EP_NO = 21
    EP_TITLE = "돌리면 무엇이 바뀔까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.cw()
        self.ccw()
        self.same()
        self.closing(f"도형을 돌리면 {o('방향')}만 바뀌고 {g('모양은 그대로')}\n돌리는 {o('방향')}과 {o('각도')}를 함께 말해요",
                     next_preview="4학년 22화 · 막대그래프는 무엇이 편리할까?")
        self.wait(0.5)

    def shape(self, c):
        gd = grid(6, 6, 0.55, c)
        sh = shape_on(gd, 1.5, 1.5)
        sh.move_to(c)
        return gd, sh

    def problem(self):
        self.section("문제")
        q = M("도형을 시계 방향으로 90°만큼 돌리면?", 48)
        q.scale_to_fit_width(min(q.width, 10.4)).move_to([0.6, 2.25, 0])
        gd, sh = self.shape([0, -0.6, 0])
        self.say("돌리면 어떻게 될까요?", "도형을 시계 방향으로 90도만큼 돌리면 어떤 모양이 될까요?")
        self.play(Write(q), FadeIn(gd), FadeIn(sh), run_time=1.2)
        self.wait(1.0)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def cw(self):
        self.section("시계 방향으로 돌리기")
        cs = [np.array([-4.6, -0.3, 0]), np.array([-1.55, -0.3, 0]), np.array([1.5, -0.3, 0]), np.array([4.55, -0.3, 0])]
        labs = ["처음", "90°", "180°", "270°"]
        where = ["", "오른쪽", "아래쪽", "왼쪽"]
        self.say("시계 방향으로 90°씩 돌려 봐요", "주황 점이 있는 위쪽 부분을 잘 보면서, 시계 방향으로 90도씩 돌려 볼까요?")
        base = shape_on(grid(6, 6, 0.4, cs[0]), 1.5, 1.5).move_to(cs[0])
        self.play(FadeIn(base), FadeIn(T("처음", 36, SOFT).move_to(cs[0] + DOWN * 1.6)), run_time=0.6)
        prev = base
        for k in range(1, 4):
            nxt = prev.copy()
            self.play(nxt.animate.move_to(cs[k]), run_time=0.6)
            self.play(Rotate(nxt, -90 * DEGREES, about_point=cs[k]), run_time=0.9)
            self.play(FadeIn(T(labs[k], 36, ORANGE).move_to(cs[k] + DOWN * 1.6)), run_time=0.3)
            self.say(f"시계 방향 {labs[k]} → 위쪽이 {o(where[k])}으로", f"시계 방향으로 {labs[k]}만큼 돌리면 위쪽 부분이 {where[k]}으로 가요.")
            prev = nxt
        self.say(f"360° 돌리면 {g('처음과 같아요')}", "한 바퀴, 360도만큼 돌리면 처음 모양과 같아져요.")
        self.play(Rotate(prev, -90 * DEGREES, about_point=cs[3]), run_time=0.9)
        self.play(Indicate(prev, color=GREEN, scale_factor=1.1), Indicate(base, color=GREEN, scale_factor=1.1), run_time=0.8)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def ccw(self):
        self.section("시계 반대 방향")
        c = np.array([-2.6, -0.4, 0])
        gd, sh = self.shape(c)
        arr = clock_arrow(c, cw=False, r=1.9)
        self.say("시계 반대 방향으로 90°", "이번에는 시계 반대 방향으로 90도만큼 돌려 볼까요?")
        self.play(FadeIn(gd), FadeIn(sh), Create(arr), run_time=0.8)
        self.play(Rotate(sh, 90 * DEGREES, about_point=c), run_time=1.2)
        t = M(f"위쪽 부분이 {o('왼쪽')}으로", 52).move_to([3.4, 0.2, 0])
        self.say(f"위쪽 부분이 {o('왼쪽')}으로 가요", "위쪽 부분이 왼쪽으로 갔어요. 시계 방향과 반대예요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def same(self):
        self.section("같은 모양이 되는 두 방법")
        ca, cb = np.array([-3.4, -0.2, 0]), np.array([3.4, -0.2, 0])
        ga, a = self.shape(ca)
        gb, b_ = self.shape(cb)
        ta = M(f"시계 방향 {o('90°')}", 44).move_to(ca + UP * 2.3)
        tb = M(f"시계 반대 방향 {o('270°')}", 44).move_to(cb + UP * 2.3)
        self.say("두 가지로 돌려 볼까요?", "왼쪽은 시계 방향으로 90도, 오른쪽은 시계 반대 방향으로 270도 돌려 볼게요.")
        self.play(FadeIn(ga), FadeIn(a), FadeIn(gb), FadeIn(b_), FadeIn(ta), FadeIn(tb), run_time=0.8)
        self.play(Rotate(a, -90 * DEGREES, about_point=ca), Rotate(b_, 270 * DEGREES, about_point=cb), run_time=2.0)
        self.say(f"두 모양이 {g('같아요')}", "두 모양이 똑같아요. 시계 방향 90도와 시계 반대 방향 270도는 같은 모양이 돼요.")
        self.play(Indicate(a, color=GREEN, scale_factor=1.08), Indicate(b_, color=GREEN, scale_factor=1.08), run_time=0.9)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
