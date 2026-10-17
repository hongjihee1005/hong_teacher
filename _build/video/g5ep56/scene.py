"""「수학 원리 돋보기」 5학년 56화 — 직육면체의 전개도 (5-2 5단원 6차시, 화 코드 5-2-5-e)

가로 3 cm, 세로 2 cm, 높이 1 cm인 직육면체의 전개도: 직사각형 6개, 마주 보는 면은 모양과 크기가 같음(3쌍)
접었을 때 맞닿는(겹치는) 모서리의 길이가 같아야 함
최종: GRADE=5 ./make_final.sh 56
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, DashedLine, FadeIn, FadeOut, Indicate, LaggedStart, Line, Rectangle,
                   VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from cuboid import Cuboid

RED = "#C0392B"
U = 0.62


class G5Ep56(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 56
    EP_TITLE = "직육면체의 전개도"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.unfold()
        self.edges()
        self.closing(f"직육면체의 전개도는 {o('직사각형 6개')}, 마주 보는 면은 {b('모양과 크기가 같아요')}\n접었을 때 맞닿는 모서리의 {g('길이가 같아야')} 해요",
                     next_preview="5학년 57화 · 평균은 무엇일까?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("가로 3 cm, 세로 2 cm, 높이 1 cm인\n직육면체의 전개도는 어떤 모양일까요?", 44).move_to([0.6, 1.9, 0])
        cb = Cuboid(3 * U * 1.4, 1 * U * 1.4, 2 * U * 1.4, [0, -0.8, 0])
        self.say("직육면체의 전개도", "가로 3센티미터, 세로 2센티미터, 높이 1센티미터인 직육면체를 펼치면 어떤 모양이 될까요?")
        self.play(Write(q), FadeIn(VGroup(cb.face("front", BLUE, 0.4), cb.face("top", ORANGE, 0.4), cb.face("right", GREEN, 0.4), cb.edges())), run_time=1.2)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def rects(self, origin):
        """세로로 위·앞·아래·뒤(3×2, 3×1, 3×2, 3×1), 앞의 양옆에 옆면(2×1)"""
        x0, y0 = origin
        spec = [  # (x, y, w, h, color) 왼쪽 위 기준, 아래로 y 감소
            (0, 0, 3, 2, ORANGE), (0, -2, 3, 1, BLUE), (0, -3, 3, 2, ORANGE), (0, -5, 3, 1, BLUE),
            (-2, -2, 2, 1, GREEN), (3, -2, 2, 1, GREEN)]
        g_ = VGroup()
        for x, y, w, h, c in spec:
            r = Rectangle(width=w * U, height=h * U, fill_color=c, fill_opacity=0.45, stroke_color=INK, stroke_width=4)
            r.move_to([x0 + (x + w / 2) * U, y0 + (y - h / 2) * U, 0])
            g_.add(r)
        return g_

    def unfold(self):
        self.section("펼쳐 보기")
        cb = Cuboid(3 * U, 1 * U, 2 * U, [-4.6, 0.6, 0])
        self.play(FadeIn(VGroup(cb.face("front", BLUE, 0.45), cb.face("top", ORANGE, 0.45), cb.face("right", GREEN, 0.45), cb.edges())), run_time=0.5)
        R = self.rects((-0.9, 2.5))
        self.say("모서리를 잘라 펼치면", "모서리를 잘라 펼치면 직사각형 6개로 이루어진 전개도가 돼요.")
        self.play(LaggedStart(*[FadeIn(r, shift=RIGHT * 0.3) for r in R], lag_ratio=0.2, run_time=1.6))
        t = M(f"같은 색은 {b('마주 보는 면')}\n모양과 크기가 {g('같아요')}", 36).move_to([4.6, 0.8, 0])
        self.say(f"마주 보는 면은 모양과 크기가 {g('같아요')}", "같은 색끼리 접었을 때 마주 보는 면이에요. 마주 보는 두 면은 모양과 크기가 같아서 3쌍이 있어요.")
        self.play(FadeIn(t), Indicate(VGroup(R[0], R[2]), color=ORANGE, scale_factor=1.04), run_time=0.8)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def edges(self):
        self.section("맞닿는 모서리")
        R = self.rects((-2.6, 2.5))
        self.add(R)
        # 옆면(왼쪽) 위 변 2칸과 윗면 왼쪽 변 2칸이 접으면 맞닿음
        L = R[4]
        top = R[0]
        e1 = Line(L.get_corner(UP + LEFT), L.get_corner(UP + RIGHT), color=RED, stroke_width=10)
        e2 = Line(top.get_corner(DOWN + LEFT), top.get_corner(UP + LEFT), color=RED, stroke_width=10)
        l1 = T("2 cm", 28, RED).next_to(e1, DOWN, buff=0.08)
        l2 = T("2 cm", 28, RED).next_to(e2, LEFT, buff=0.1)
        self.say("접으면 맞닿는 두 모서리", "전개도를 접으면 옆면의 위쪽 모서리와 윗면의 왼쪽 모서리가 서로 맞닿아요.")
        self.play(Create(e1), Create(e2), FadeIn(l1), FadeIn(l2), run_time=0.9)
        t = M(f"맞닿는 모서리는\n{g('길이가 같아야')} 해요", 38).move_to([4.2, 1.0, 0])
        self.say(f"맞닿는 모서리는 {g('길이가 같아야')} 해요", "맞닿는 모서리는 길이가 같아야 해요. 둘 다 2센티미터라서 꼭 맞게 접혀요.")
        self.play(FadeIn(t), run_time=0.5)
        n = M(f"전개도를 그린 뒤\n{o('겹치는 모서리의 길이')}를 확인해요", 32).move_to([4.2, -0.6, 0])
        self.play(FadeIn(n), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
