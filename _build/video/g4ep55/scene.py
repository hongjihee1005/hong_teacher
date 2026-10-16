"""「수학 원리 돋보기」 4학년 55화 — 대각선 (4-2 6단원 5차시, 화 코드 4-2-6-c)

서로 이웃하지 않는 두 꼭짓점을 이은 선분 = 대각선
삼각형 0개(모든 꼭짓점이 이웃), 사각형 2개, 오각형 5개, 육각형 9개
직사각형: 두 대각선의 길이가 같음 / 정사각형: 길이가 같고 수직으로 만남
최종: GRADE=4 ./make_final.sh 55
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, Cross, Dot, FadeIn, FadeOut, Indicate, LaggedStart, Line, VGroup,
                   Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from shapes import PURPLE, poly, regular, right_mark, tick

RED = "#C0392B"


class G4Ep55(EpisodeScene):
    GRADE, SEM = 4, 2
    EP_NO = 55
    EP_TITLE = "대각선"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.define()
        self.count()
        self.special()
        self.closing(f"이웃하지 않는 두 꼭짓점을 이은 선분이 {g('대각선')}\n삼각형 {o('0개')}, 사각형 {o('2개')}, 오각형 {o('5개')}, 육각형 {o('9개')}",
                     next_preview="4학년 56화 · 모양 조각으로 만들고 채우기")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("삼각형에는 왜 대각선이 없을까요?", 48).move_to([0.6, 2.2, 0])
        t = poly(regular(3, 1.4, [-2.5, -0.5, 0]), fill=ORANGE)
        P = regular(5, 1.4, [2.5, -0.5, 0])
        p = poly(P, fill=BLUE)
        self.say("삼각형과 오각형", "오각형에는 대각선이 있는데, 삼각형에는 대각선이 없어요. 왜 그럴까요?")
        self.play(Write(q), Create(t), Create(p), run_time=1.2)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def define(self):
        self.section("대각선이란?")
        P = regular(5, 1.7, [-2.6, -0.2, 0])
        p = poly(P, fill=BLUE, op=0.15)
        A = Dot(P[0], radius=0.12, color=RED)
        self.say("꼭짓점 하나에서 출발해요", "오각형의 꼭짓점 하나에서 출발해 볼게요.")
        self.play(FadeIn(p), FadeIn(A, scale=2), run_time=0.7)
        nb = VGroup(Line(P[0], P[1], color=SOFT, stroke_width=10), Line(P[0], P[4], color=SOFT, stroke_width=10))
        self.say(f"바로 옆 꼭짓점과 이으면 {o('변')}이에요", "바로 이웃한 꼭짓점과 이은 선분은 변이에요.")
        self.play(Create(nb), run_time=0.6)
        d = VGroup(Line(P[0], P[2], color=GREEN, stroke_width=6), Line(P[0], P[3], color=GREEN, stroke_width=6))
        t = M(f"서로 {o('이웃하지 않는')} 두 꼭짓점을\n이은 선분 = {g('대각선')}", 44).move_to([3.4, 0.3, 0])
        self.say(f"이웃하지 않는 꼭짓점과 이으면 {g('대각선')}", "이웃하지 않는 꼭짓점과 이은 선분을 대각선이라고 해요.")
        self.play(Create(d), FadeIn(t), run_time=0.9)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def count(self):
        self.section("대각선은 몇 개?")
        xs = [-5.0, -1.75, 1.6, 5.0]
        cols = [ORANGE, GREEN, BLUE, PURPLE]
        res = []
        for n, x, c in zip((3, 4, 5, 6), xs, cols):
            st = 90 if n != 4 else 45
            P = regular(n, 1.25, [x, 0.6, 0], st)
            res.append((n, P, poly(P, fill=c, op=0.15)))
        self.play(*[FadeIn(r[2]) for r in res], run_time=0.6)
        nums = {3: 0, 4: 2, 5: 5, 6: 9}
        for n, P, sh in res:
            x = np.mean(P, axis=0)[0]
            diags = VGroup(*[Line(P[i], P[j], color=RED, stroke_width=4) for i in range(n) for j in range(i + 2, n) if not (i == 0 and j == n - 1)])
            lab = M(f"{o(str(nums[n]) + '개')}", 40).move_to([x, -1.2, 0])
            if n == 3:
                self.say(f"삼각형은 모든 꼭짓점이 {o('이웃해')} 있어요 → 0개", "삼각형은 세 꼭짓점이 모두 서로 이웃해 있어요. 그래서 대각선이 하나도 없어요.")
                self.play(FadeIn(lab), Indicate(sh, color=ORANGE), run_time=0.7)
            else:
                nm = {4: "사각형", 5: "오각형", 6: "육각형"}[n]
                self.say(f"{nm}의 대각선은 {o(str(nums[n]) + '개')}", f"{nm}에서 이웃하지 않는 꼭짓점끼리 모두 이어 보면 대각선은 {nums[n]}개예요.")
                self.play(LaggedStart(*[Create(dl) for dl in diags], lag_ratio=0.25, run_time=0.4 + 0.2 * len(diags)), FadeIn(lab))
        n2 = M(f"꼭짓점이 많을수록 대각선도 {g('많아져요')}", 42).move_to([0, -2.15, 0])
        self.say(f"꼭짓점이 많을수록 {g('많아져요')}", "꼭짓점이 많을수록 대각선의 수도 많아져요.")
        self.play(FadeIn(n2), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def special(self):
        self.section("사각형의 대각선")
        R = [np.array(p) for p in ([-5.4, -0.7, 0], [-1.6, -0.7, 0], [-1.6, 1.5, 0], [-5.4, 1.5, 0])]
        S = [np.array(p) for p in ([2.0, -0.8, 0], [4.3, -0.8, 0], [4.3, 1.5, 0], [2.0, 1.5, 0])]
        r, s = poly(R, fill=BLUE, op=0.15), poly(S, fill=GREEN, op=0.15)
        self.say("직사각형과 정사각형의 대각선", "직사각형과 정사각형에 대각선을 그어 볼게요.")
        self.play(FadeIn(r), FadeIn(s), run_time=0.6)
        dr = VGroup(Line(R[0], R[2], color=ORANGE, stroke_width=6), Line(R[1], R[3], color=ORANGE, stroke_width=6))
        cr = np.mean(R, axis=0)
        tr = VGroup(*[tick(R[k], cr, 1, color=PURPLE) for k in range(4)])
        l1 = M(f"두 대각선의\n{o('길이가 같아요')}", 36).move_to([-3.5, -1.6, 0])
        self.say(f"직사각형: 두 대각선의 {o('길이가 같아요')}", "직사각형의 두 대각선은 길이가 같고, 서로를 똑같이 둘로 나누어요.")
        self.play(Create(dr), Create(tr), FadeIn(l1), run_time=0.9)
        ds = VGroup(Line(S[0], S[2], color=ORANGE, stroke_width=6), Line(S[1], S[3], color=ORANGE, stroke_width=6))
        cs = np.mean(S, axis=0)
        rm = right_mark(cs, S[2] - cs, S[3] - cs, 0.28, color=RED)
        l2 = M(f"길이가 같고\n{g('수직으로 만나요')}", 36).move_to([3.15, -1.6, 0])
        self.say(f"정사각형: 길이가 같고 {g('수직')}으로 만나요", "정사각형의 두 대각선은 길이가 같을 뿐 아니라, 서로 수직으로 만나요.")
        self.play(Create(ds), Create(rm), FadeIn(l2), run_time=0.9)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
