"""「수학 원리 돋보기」 34화 — 직각삼각형은 어떤 삼각형일까? (1학기 2단원 6차시, 화 코드 1-2-c)

안전시설의 삼각형 4개 → 삼각자로 직각 찾기 → 한 각이 직각인 삼각형 = 직각삼각형
→ 돌려 놓아도 직각삼각형 → 직각은 하나뿐(두 개면 삼각형이 닫히지 않음)
최종: ./make_final.sh 34
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, PI, Create, FadeIn, FadeOut, Indicate, LaggedStart, Line, Polygon, Rotate,
                   SurroundingRectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from geom import right_mark
from items import check_mark, cross_mark

FILL = "#DCE8F8"


def tri(pts, color=INK):
    return Polygon(*[np.array(p, float) for p in pts], color=color, fill_color=FILL, fill_opacity=1, stroke_width=5)


class Ep34(EpisodeScene):
    EP_NO = 34
    EP_TITLE = "직각삼각형은 어떤 삼각형일까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.classify()
        self.rotate()
        self.only_one()
        self.closing(f"한 각이 직각인 삼각형 → {o('직각삼각형')}\n기울어져 있어도 직각이 있으면 직각삼각형이에요",
                     next_preview="35화 · 직사각형과 정사각형은 어떤 관계일까?")
        self.wait(0.5)

    def shapes(self):
        data = [
            ([[0, 0, 0], [2.0, 0, 0], [0, 1.6, 0]], 0),
            ([[0, 0, 0], [2.2, 0, 0], [0.9, 1.7, 0]], None),
            ([[0, 0, 0], [1.6, 0, 0], [1.6, 1.8, 0]], 1),
            ([[0, 0, 0], [2.4, 0, 0], [2.0, 1.2, 0]], None),
        ]
        xs = [-4.8, -1.7, 1.5, 4.5]
        out = []
        for (p, r), x in zip(data, xs):
            t = tri(p)
            shift = np.array([x, 0.2, 0]) - t.get_center()
            t.shift(shift)
            pts = [np.array(q, float) + shift for q in p]
            out.append((t, pts, r))
        return out

    def problem(self):
        self.section("문제")
        sh = self.shapes()
        labs = VGroup(*[T(n, 36).next_to(t, DOWN, buff=0.3) for n, (t, _, _) in zip("가나다라", sh)])
        self.say("지진 안전시설에서 찾은 삼각형이에요", "지진의 피해를 줄여 주는 안전시설에서 찾은 삼각형이에요.")
        self.play(LaggedStart(*[FadeIn(t) for t, _, _ in sh], lag_ratio=0.2, run_time=1.2), FadeIn(labs))
        q = M("이 삼각형들을 어떻게 나눌 수 있을까요?", 50).move_to([0, 2.4, 0])
        self.say("어떻게 나눌 수 있을까요?", "이 삼각형들을 어떻게 나눌 수 있을까요?")
        self.play(FadeIn(q), run_time=0.6)
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def classify(self):
        self.section("직각을 찾아라")
        sh = self.shapes()
        labs = VGroup(*[T(n, 36).next_to(t, DOWN, buff=0.3) for n, (t, _, _) in zip("가나다라", sh)])
        self.play(FadeIn(VGroup(*[t for t, _, _ in sh])), FadeIn(labs), run_time=0.6)
        self.say("삼각자를 대어 직각을 찾아요", "삼각자의 직각 부분을 대어 직각이 있는지 찾아볼까요?")
        marks = VGroup()
        for t, pts, r in sh:
            if r is not None:
                v = pts[r]
                o1, o2 = [pts[k] for k in range(3) if k != r]
                m = right_mark(v, o1, o2, 0.3)
                self.play(Create(m), Indicate(t, color=ORANGE, scale_factor=1.05), run_time=0.7)
                marks.add(m)
            else:
                self.play(Indicate(t, color=SOFT, scale_factor=1.03), run_time=0.5)
        self.say(f"가와 다에는 {o('직각')}이 있어요", "가와 다에는 직각이 하나씩 있고, 나와 라에는 직각이 없어요.")
        self.wait(0.6)
        d = M(f"한 각이 직각인 삼각형 → {o('직각삼각형')}", 52).move_to([0, 2.35, 0])
        self.say(f"한 각이 직각인 삼각형: {o('직각삼각형')}", "한 각이 직각인 삼각형을 직각삼각형이라고 해요.")
        self.play(FadeIn(d), sh[0][0].animate.set_fill(ORANGE, 0.35), sh[2][0].animate.set_fill(ORANGE, 0.35), run_time=0.8)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def rotate(self):
        self.section("돌려 놓아도")
        p = [np.array(q, float) for q in ([-1.0, -0.6, 0], [1.4, -0.6, 0], [-1.0, 1.4, 0])]
        t = tri(p)
        m = right_mark(p[0], p[1], p[2], 0.3)
        grp = VGroup(t, m).move_to([-2.5, 0.3, 0])
        self.say("직각삼각형을 돌려 볼까요?", "직각삼각형을 빙글 돌려 볼까요?")
        self.play(FadeIn(grp), run_time=0.5)
        self.play(Rotate(grp, angle=PI * 0.6, about_point=grp.get_center()), run_time=1.6)
        q = M(f"기울어져 있어도\n{o('직각삼각형')}일까요?", 48).move_to([3.0, 0.6, 0])
        self.play(FadeIn(q), run_time=0.5)
        self.wait(1.2)
        a = M(f"네! 직각이 그대로 있으니 {o('직각삼각형')}", 42).move_to([3.0, -1.0, 0])
        self.say(f"직각이 그대로 있으니 {o('직각삼각형')}", "네, 돌려도 직각은 그대로예요. 그래서 기울어져 놓여 있어도 직각삼각형이에요.")
        self.play(Indicate(m, color=ORANGE, scale_factor=2), FadeIn(a), run_time=0.9)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def only_one(self):
        self.section("직각이 두 개라면?")
        A, B = np.array([-2.5, -1.0, 0]), np.array([0.5, -1.0, 0])
        base = Line(A, B, color=INK, stroke_width=6)
        l1 = Line(A, A + UP * 2.6, color=INK, stroke_width=6)
        l2 = Line(B, B + UP * 2.6, color=INK, stroke_width=6)
        m1 = right_mark(A, B, A + UP, 0.3)
        m2 = right_mark(B, A, B + UP, 0.3)
        self.say("직각이 두 개인 삼각형도 있을까요?", "직각이 두 개인 삼각형도 만들 수 있을까요?")
        self.play(Create(base), run_time=0.5)
        self.play(Create(l1), Create(m1), run_time=0.6)
        self.play(Create(l2), Create(m2), run_time=0.6)
        t = M(f"두 변이 나란히 올라가서\n{g('만나지 않아요')}", 44).move_to([3.4, 0.4, 0])
        self.say(f"두 변이 {g('만나지 않아요')}", "양쪽이 모두 직각이면 두 변이 나란히 올라가서 만나지 않아요. 삼각형이 될 수 없어요.")
        self.play(FadeIn(t), run_time=0.6)
        t2 = M(f"그래서 직각삼각형의 직각은 {o('하나')}예요", 44).move_to([0, -2.2, 0])
        self.play(FadeIn(t2), run_time=0.5)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
