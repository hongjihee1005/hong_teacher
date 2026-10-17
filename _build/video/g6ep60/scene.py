"""「수학 원리 돋보기」 6학년 60화 — 원의 넓이 구하기 (6-2 5단원 6차시, 화 코드 6-2-5-e)

원을 한없이 잘라 이어 붙이면 직사각형: 가로 = (원주) × 1/2, 세로 = 반지름
(원의 넓이) = (반지름) × (원주) × 1/2 = (반지름) × (지름) × (원주율) × 1/2 = (반지름) × (반지름) × (원주율)
(예: 반지름 5 cm → 5 × 5 × 3.14 = 78.5 cm²)
최종: GRADE=6 ./make_final.sh 60
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, PI, RIGHT, TAU, UP, AnnularSector, Brace, Circle, Create, FadeIn, FadeOut, Indicate,
                   LaggedStart, Line, Polygon, Sector, Transform, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage

R = 1.5


def wedges(n, center, r=R):
    """원을 n조각(부채꼴) — 위쪽 반은 주황, 아래쪽 반은 파랑"""
    c = np.array(center, float)
    ws = VGroup()
    for k in range(n):
        a0 = TAU * k / n
        col = ORANGE if k < n // 2 else BLUE
        s = Sector(radius=r, start_angle=a0, angle=TAU / n, fill_color=col, fill_opacity=0.8, stroke_color=INK, stroke_width=1.5)
        s.move_arc_center_to(c)
        ws.add(s)
    return ws


def zigzag(n, center, r=R):
    """n조각을 엇갈려 늘어놓은 평행사변형 모양 (위 반, 아래 반)"""
    c = np.array(center, float)
    half = n // 2
    w = PI * r / half          # 조각 하나의 밑변(호 길이 근사)
    x0 = c[0] - PI * r / 2 - w / 4
    pts = VGroup()
    for k in range(half):
        bx = x0 + k * w
        up = Polygon([bx, c[1] - r / 2, 0], [bx + w, c[1] - r / 2, 0], [bx + w / 2, c[1] + r / 2, 0],
                     fill_color=ORANGE, fill_opacity=0.8, stroke_color=INK, stroke_width=1.5)
        dn = Polygon([bx + w / 2, c[1] + r / 2, 0], [bx + w * 1.5, c[1] + r / 2, 0], [bx + w, c[1] - r / 2, 0],
                     fill_color=BLUE, fill_opacity=0.8, stroke_color=INK, stroke_width=1.5)
        pts.add(up, dn)
    return pts


class G6Ep60(EpisodeScene):
    GRADE, SEM = 6, 2
    EP_NO = 60
    EP_TITLE = "원의 넓이 구하기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.cut()
        self.formula()
        self.closing(f"원을 잘라 이어 붙이면 가로 {o('원주의 1/2')}, 세로 {b('반지름')}인 직사각형\n(원의 넓이) = (반지름) × (반지름) × ({g('원주율')})",
                     next_preview="6학년 61화 · 원의 넓이 활용")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("원의 넓이를 직사각형의 넓이로\n바꾸어 구할 수 있을까요?", 44).move_to([0.6, 1.6, 0])
        self.say("직사각형으로 바꿀 수 있을까?", "원은 곡선으로 둘러싸여 있어서 넓이를 바로 구하기 어려워요. 직사각형의 넓이로 바꾸어 구할 수 있을까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def cut(self):
        self.section("잘라서 이어 붙이기")
        for n, y_note in [(16, "16조각"), (32, "32조각")]:
            ws = wedges(n, (-4.0, 0.6, 0))
            self.say(f"원을 {o(y_note)}으로", f"원을 {n}조각으로 잘라 위아래로 엇갈려 이어 붙여 볼게요." if n == 16 else "조각을 더 잘게 32조각으로 자르면 더 반듯해져요.")
            self.play(FadeIn(ws), run_time=0.5)
            zz = zigzag(n, (2.0, 0.6, 0))
            self.play(*[Transform(ws[k], zz[2 * (k % (n // 2)) + (0 if k < n // 2 else 1)]) for k in range(n)], run_time=1.6)
            self.wait(0.5)
            if n == 16:
                self.play(FadeOut(ws), run_time=0.4)
        rect = Polygon([2.0 - PI * R / 2, 0.6 - R / 2, 0], [2.0 + PI * R / 2, 0.6 - R / 2, 0], [2.0 + PI * R / 2, 0.6 + R / 2, 0], [2.0 - PI * R / 2, 0.6 + R / 2, 0],
                       color=GREEN, stroke_width=6)
        self.say(f"한없이 자르면 {g('직사각형')}", "한없이 잘게 자르면 직사각형이 돼요.")
        self.play(Create(rect), run_time=0.7)
        bw = Brace(rect, DOWN, color=ORANGE)
        tw = M(f"{o('원주 × 1/2')}", 32).next_to(bw, DOWN, buff=0.08)
        bh = Brace(rect, RIGHT, color=BLUE)
        th = M(b("반지름"), 32).next_to(bh, RIGHT, buff=0.08)
        self.say(f"가로는 {o('원주의 반')}, 세로는 {b('반지름')}", "직사각형의 가로는 원주의 절반이에요. 주황 조각의 호가 원주의 반이거든요. 세로는 원의 반지름이에요.")
        self.play(FadeIn(bw), FadeIn(tw), FadeIn(bh), FadeIn(th), run_time=0.7)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def formula(self):
        self.section("원의 넓이 구하는 식")
        f1 = M(f"(원의 넓이) = ({o('원주')} × 1/2) × ({b('반지름')})", 40).move_to([0, 2.0, 0])
        f2 = M(f"= (지름 × {g('원주율')} × 1/2) × (반지름)", 40).move_to([0.4, 1.1, 0])
        f3 = M(f"= ({b('반지름')}) × ({b('반지름')}) × ({g('원주율')})", 44).move_to([0.4, 0.1, 0])
        self.say("직사각형의 넓이 = 가로 × 세로", "원의 넓이는 직사각형의 넓이와 같으니 원주의 절반 곱하기 반지름이에요.")
        self.play(FadeIn(f1), run_time=0.6)
        self.say("원주 = 지름 × 원주율", "원주는 지름 곱하기 원주율이고, 지름의 절반은 반지름이에요.")
        self.play(FadeIn(f2), run_time=0.6)
        self.say(f"반지름 × 반지름 × {g('원주율')}", "그래서 원의 넓이는 반지름 곱하기 반지름 곱하기 원주율이에요.")
        self.play(FadeIn(f3), run_time=0.6)
        e = M(f"반지름 5 cm: 5 × 5 × 3.14 = {g('78.5')} (cm²)", 40).move_to([0, -1.2, 0])
        self.say(f"반지름 5 cm면 {g('78.5 cm²')}", "반지름이 5 센티미터인 원의 넓이는 5 곱하기 5 곱하기 3.14, 78.5 제곱센티미터예요.")
        self.play(FadeIn(e), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
