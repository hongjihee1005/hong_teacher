"""「수학 원리 돋보기」 4학년 37화 — 두 가지 기준으로 이름 붙이기 (4-2 2단원 6차시, 화 코드 4-2-2-d)

변의 길이(이등변·정삼각형 / 세 변의 길이가 모두 다른 삼각형) × 각의 크기(예각·직각·둔각) 표
한 삼각형에 이름 두 개: 예) 이등변삼각형이면서 직각삼각형 / 정삼각형은 언제나 예각삼각형
최종: GRADE=4 ./make_final.sh 37
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, Line, Rectangle, VGroup,
                   Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from shapes import poly, regular, tick

ACUTE, OBTUSE = "#1F8A70", "#C0392B"
COLS = ["예각삼각형", "직각삼각형", "둔각삼각형"]
ROWS = ["이등변삼각형", "세 변의 길이가\n모두 다른 삼각형"]


def tri_for(r, c, center, s=0.55):
    cx = np.array(center, float)
    if r == 0:
        shapes = {0: [(-1, -0.8), (1, -0.8), (0, 1.0)], 1: [(-0.9, -0.8), (0.9, -0.8), (-0.9, 1.0)], 2: [(-1.4, -0.4), (1.4, -0.4), (0, 0.3)]}
    else:
        shapes = {0: [(-1, -0.8), (1.2, -0.8), (0.6, 0.9)], 1: [(-0.9, -0.8), (1.3, -0.8), (-0.9, 0.7)], 2: [(-1.4, -0.5), (1.3, -0.5), (-0.7, 0.4)]}
    P = [cx + np.array([x * s, y * s, 0]) for x, y in shapes[c]]
    return poly(P, fill=[ACUTE, ORANGE, OBTUSE][c], op=0.35, width=4), P


class G4Ep37(EpisodeScene):
    GRADE, SEM = 4, 2
    EP_NO = 37
    EP_TITLE = "두 가지 기준으로 이름 붙이기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.table()
        self.closing(f"삼각형은 {o('변의 길이')}와 {g('각의 크기')}, 두 기준으로\n이름을 두 가지 붙일 수 있어요",
                     next_preview="4학년 38화 · 0.1보다 작은 수, 0.01")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        P = [np.array([-1.3, -1.6, 0]), np.array([1.3, -1.6, 0]), np.array([-1.3, 1.0, 0])]
        t = poly(P, fill=ORANGE)
        mk = VGroup(tick(P[0], P[1]), tick(P[2], P[0]))
        q = M("이 삼각형의 이름은 무엇일까요?", 46).move_to([0.6, 2.3, 0])
        self.say("이 삼각형의 이름은?", "두 변의 길이가 같고, 한 각이 직각인 삼각형이에요. 이름을 무엇이라고 할까요?")
        self.play(Write(q), Create(t), Create(mk), run_time=1.2)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def table(self):
        self.section("두 기준 표")
        x0, y0, cw, rh, hw = -3.6, 1.7, 2.9, 1.75, 2.6
        grid = VGroup()
        heads = VGroup()
        for j, c in enumerate(COLS):
            r = Rectangle(width=cw, height=0.7, fill_color="#F3EEE4", fill_opacity=1, stroke_color=SOFT, stroke_width=2)
            r.move_to([x0 + cw * (j + 0.5), y0 + 0.35, 0])
            heads.add(VGroup(r, T(c, 30, [ACUTE, ORANGE, OBTUSE][j]).move_to(r)))
        for i, rname in enumerate(ROWS):
            r = Rectangle(width=hw, height=rh, fill_color="#F3EEE4", fill_opacity=1, stroke_color=SOFT, stroke_width=2)
            r.move_to([x0 - hw / 2, y0 - rh * (i + 0.5), 0])
            tt = T(rname, 28, INK)
            tt.scale_to_fit_width(min(tt.width, hw - 0.25)).move_to(r)
            heads.add(VGroup(r, tt))
            for j in range(3):
                cell = Rectangle(width=cw, height=rh, fill_color=PAPER, fill_opacity=1, stroke_color=SOFT, stroke_width=2)
                cell.move_to([x0 + cw * (j + 0.5), y0 - rh * (i + 0.5), 0])
                grid.add(cell)
        allg = VGroup(heads, grid)
        allg.move_to([0.4, -0.15, 0])
        self.say("변의 길이와 각의 크기로 표를 만들어요", "가로에는 각의 크기에 따른 이름, 세로에는 변의 길이에 따른 이름을 놓고 표를 만들어요.")
        self.play(FadeIn(allg), run_time=0.8)
        order = [(0, 1), (0, 0), (0, 2), (1, 0), (1, 1), (1, 2)]
        nars = {(0, 1): "처음 문제의 삼각형은 이등변삼각형이면서 직각삼각형이에요.",
                (0, 0): "이등변삼각형이면서 예각삼각형도 있고,",
                (0, 2): "이등변삼각형이면서 둔각삼각형도 있어요.",
                (1, 0): "세 변의 길이가 모두 다른 삼각형도 예각삼각형,",
                (1, 1): "직각삼각형,",
                (1, 2): "둔각삼각형이 모두 될 수 있어요."}
        for (i, j) in order:
            cell = grid[i * 3 + j]
            t, P = tri_for(i, j, cell.get_center())
            mk = VGroup()
            if i == 0:
                if j == 0:
                    mk = VGroup(tick(P[1], P[2], size=0.14), tick(P[2], P[0], size=0.14))
                elif j == 1:
                    mk = VGroup(tick(P[0], P[1], size=0.14), tick(P[2], P[0], size=0.14))
                else:
                    mk = VGroup(tick(P[1], P[2], size=0.14), tick(P[2], P[0], size=0.14))
            name = f"{ROWS[i].splitlines()[0] if i == 0 else '세 변이 다른'} + {COLS[j]}"
            self.say(name, nars[(i, j)])
            self.play(Create(t), FadeIn(mk), Indicate(t, color=ORANGE, scale_factor=1.15), run_time=0.8)
        self.say(f"한 삼각형에 이름이 {o('두 가지')}", "이렇게 한 삼각형에 변의 길이로 하나, 각의 크기로 하나, 이름을 두 가지 붙일 수 있어요. 정삼각형은 세 각이 60도라 언제나 예각삼각형이에요.")
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
