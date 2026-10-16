"""「수학 원리 돋보기」 4학년 54화 — 정다각형 (4-2 6단원 4차시, 화 코드 4-2-6-b)

변의 길이가 모두 같고 각의 크기가 모두 같은 다각형 = 정다각형
마름모(변만 같음)·직사각형(각만 같음)은 정다각형이 아님, 정사각형은 정다각형
정삼각형·정오각형·정육각형·정팔각형
최종: GRADE=4 ./make_final.sh 54
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, Cross, FadeIn, FadeOut, Indicate, LaggedStart, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from shapes import PURPLE, arc_at, poly, regular, right_mark, tick

RED = "#C0392B"
NAMES = {3: "정삼각형", 4: "정사각형", 5: "정오각형", 6: "정육각형", 8: "정팔각형"}


def marks(P, color=ORANGE, n=1, arcs=True, acol=BLUE):
    k = len(P)
    g_ = VGroup(*[tick(P[i], P[(i + 1) % k], n, color=color) for i in range(k)])
    a = VGroup(*[arc_at(P, i, 0.32, acol) for i in range(k)]) if arcs else VGroup()
    return g_, a


class G4Ep54(EpisodeScene):
    GRADE, SEM = 4, 2
    EP_NO = 54
    EP_TITLE = "정다각형"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.compare()
        self.family()
        self.closing(f"{o('변의 길이')}가 모두 같고 {b('각의 크기')}도 모두 같은 다각형이 {g('정다각형')}\n둘 중 하나만 같으면 정다각형이 아니에요",
                     next_preview="4학년 55화 · 대각선")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("마름모는 네 변이 같은데, 왜 정사각형이 아닐까요?", 44)
        q.scale_to_fit_width(min(q.width, 10.4)).move_to([0.6, 2.2, 0])
        a = np.radians(60)
        R = [np.array(p) for p in ([0, 0, 0], [2, 0, 0], [2 + 2 * np.cos(a), 2 * np.sin(a), 0], [2 * np.cos(a), 2 * np.sin(a), 0])]
        m = (R[0] + R[2]) / 2
        R = [p - m + np.array([0, -0.5, 0]) for p in R]
        rh = poly(R, fill=PURPLE)
        tk, _ = marks(R, arcs=False)
        self.say("네 변이 같은 마름모", "마름모는 네 변의 길이가 모두 같아요. 그런데 왜 정사각형이라고 하지 않을까요?")
        self.play(Write(q), Create(rh), Create(tk), run_time=1.2)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def compare(self):
        self.section("변과 각을 모두 보기")
        a = np.radians(60)
        s = 2.0
        R = [np.array(p) for p in ([0, 0, 0], [s, 0, 0], [s + s * np.cos(a), s * np.sin(a), 0], [s * np.cos(a), s * np.sin(a), 0])]
        m = (R[0] + R[2]) / 2
        R = [p - m + np.array([-4.4, 0.4, 0]) for p in R]
        Rc = [np.array([-1.5, -0.8, 0]), np.array([1.5, -0.8, 0]), np.array([1.5, 0.8, 0]), np.array([-1.5, 0.8, 0])]
        Rc = [p + np.array([0, 0.4, 0]) for p in Rc]
        S = [np.array([-1.0, -1.0, 0]), np.array([1.0, -1.0, 0]), np.array([1.0, 1.0, 0]), np.array([-1.0, 1.0, 0])]
        S = [p + np.array([4.4, 0.4, 0]) for p in S]
        rh, rc, sq = poly(R, fill=PURPLE), poly(Rc, fill=BLUE), poly(S, fill=GREEN)
        nm = VGroup(T("마름모", 34).move_to([-4.4, -1.15, 0]), T("직사각형", 34).move_to([0, -1.15, 0]), T("정사각형", 34).move_to([4.4, -1.15, 0]))
        self.say("세 사각형을 견주어 봐요", "마름모, 직사각형, 정사각형을 견주어 볼게요.")
        self.play(FadeIn(rh), FadeIn(rc), FadeIn(sq), FadeIn(nm), run_time=0.8)
        tr, _ = marks(R, arcs=False)
        ar = VGroup(arc_at(R, 0, 0.4, BLUE), arc_at(R, 2, 0.4, BLUE), arc_at(R, 1, 0.35, RED, 2), arc_at(R, 3, 0.35, RED, 2))
        c1 = M(f"변 {g('같음')} · 각 {o('다름')}", 32).move_to([-4.4, -1.85, 0])
        self.say(f"마름모: 변은 같지만 {o('각이 달라요')}", "마름모는 네 변의 길이는 같지만, 네 각의 크기가 모두 같지는 않아요.")
        self.play(Create(tr), Create(ar), FadeIn(c1), run_time=0.8)
        rm = VGroup(*[right_mark(Rc[i], Rc[(i + 1) % 4] - Rc[i], Rc[i - 1] - Rc[i], 0.28) for i in range(4)])
        tc = VGroup(tick(Rc[0], Rc[1], 1, color=ORANGE), tick(Rc[2], Rc[3], 1, color=ORANGE),
                    tick(Rc[1], Rc[2], 2, color=PURPLE), tick(Rc[3], Rc[0], 2, color=PURPLE))
        c2 = M(f"각 {g('같음')} · 변 {o('다름')}", 32).move_to([0, -1.85, 0])
        self.say(f"직사각형: 각은 같지만 {o('변이 달라요')}", "직사각형은 네 각이 모두 직각으로 같지만, 네 변의 길이가 모두 같지는 않아요.")
        self.play(Create(rm), Create(tc), FadeIn(c2), run_time=0.8)
        ts, _ = marks(S, arcs=False)
        rs = VGroup(*[right_mark(S[i], S[(i + 1) % 4] - S[i], S[i - 1] - S[i], 0.24) for i in range(4)])
        c3 = M(f"변 {g('같음')} · 각 {g('같음')}", 32).move_to([4.4, -1.85, 0])
        self.say(f"정사각형: 변도 각도 {g('모두 같아요')}", "정사각형은 네 변의 길이도 모두 같고, 네 각의 크기도 모두 같아요.")
        self.play(Create(ts), Create(rs), FadeIn(c3), run_time=0.8)
        t = M(f"변의 길이와 각의 크기가 모두 같은 다각형 = {g('정다각형')}", 40)
        t.scale_to_fit_width(min(t.width, 11.0)).move_to([0, 2.45, 0])
        self.say(f"둘 다 같아야 {g('정다각형')}", "이렇게 변의 길이가 모두 같고 각의 크기도 모두 같은 다각형을 정다각형이라고 해요. 마름모와 직사각형은 하나만 같아서 정다각형이 아니에요.")
        self.play(FadeIn(t), Indicate(sq, color=GREEN), run_time=0.8)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def family(self):
        self.section("여러 가지 정다각형")
        xs = [-5.3, -2.65, 0, 2.65, 5.3]
        cols = [ORANGE, GREEN, BLUE, PURPLE, ORANGE]
        items = VGroup()
        for n, x, c in zip((3, 4, 5, 6, 8), xs, cols):
            P = regular(n, 0.98, [x, 0.5, 0], 90 if n != 4 and n != 8 else 45 if n == 4 else 22.5)
            sh = poly(P, fill=c)
            tk, ar = marks(P, color=ORANGE, acol=BLUE)
            lab = T(NAMES[n], 30).move_to([x, -1.0, 0])
            items.add(VGroup(sh, tk, ar, lab))
        self.say("변의 수에 따라 이름이 붙어요", "정다각형도 변의 수에 따라 정삼각형, 정사각형, 정오각형, 정육각형, 정팔각형이라고 해요.")
        self.play(LaggedStart(*[FadeIn(it) for it in items], lag_ratio=0.25, run_time=2.0))
        n2 = M(f"변이 몇 개든 {o('변')}과 {b('각')}이 모두 같아요", 40).move_to([0, -1.95, 0])
        self.say(f"모두 {o('변')}과 {b('각')}이 같아요", "어느 것이든 모든 변의 길이가 같고, 모든 각의 크기가 같아요.")
        self.play(FadeIn(n2), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
