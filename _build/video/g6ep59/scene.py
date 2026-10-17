"""「수학 원리 돋보기」 6학년 59화 — 원의 넓이 어림 (6-2 5단원 5차시, 화 코드 6-2-5-d)

원의 넓이는 원 안에 꼭 맞는 정사각형의 넓이보다 넓고, 원 밖에 꼭 맞는 정사각형의 넓이보다 좁음
반지름 5 m인 원: 안쪽 정사각형(대각선 10 m) 10 × 10 ÷ 2 = 50 m², 바깥 정사각형 10 × 10 = 100 m² → 50 m²보다 넓고 100 m²보다 좁음
모눈: 원 안에 완전히 들어간 칸(60칸)보다 넓고, 원이 걸친 칸까지 센 칸(88칸)보다 좁음 (반지름 5칸 모눈 — 실제로 세어 확인)
최종: GRADE=6 ./make_final.sh 59
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, PI, RIGHT, UP, Circle, Create, FadeIn, FadeOut, Indicate, LaggedStart, Line, Polygon,
                   Square, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage

N = 5   # 반지름 칸 수


def cells_inside(n):
    full, touch = [], []
    for i in range(-n, n):
        for j in range(-n, n):
            xs, ys = (i, i + 1), (j, j + 1)
            far = max(np.hypot(x, y) for x in xs for y in ys)
            near_x = min(max(0, i), i + 1) if not (i <= 0 <= i + 1) else 0
            near_y = min(max(0, j), j + 1) if not (j <= 0 <= j + 1) else 0
            near = np.hypot(near_x, near_y)
            if far <= n:
                full.append((i, j))
            elif near < n:
                touch.append((i, j))
    return full, touch


class G6Ep59(EpisodeScene):
    GRADE, SEM = 6, 2
    EP_NO = 59
    EP_TITLE = "원의 넓이 어림"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.squares()
        self.grid()
        self.closing(f"원의 넓이는 {b('안쪽 정사각형')}보다 넓고 {g('바깥 정사각형')}보다 좁아요\n반지름 5 m인 원: {o('50 m²')}보다 넓고 {o('100 m²')}보다 좁아요",
                     next_preview="6학년 60화 · 원의 넓이 구하기")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("반지름이 5 m인 원 모양 꽃밭의 넓이는\n어느 정도일까요?", 44).move_to([0.6, 1.6, 0])
        self.say("원의 넓이는 어느 정도?", "반지름이 5 미터인 원 모양 꽃밭이 있어요. 꽃밭의 넓이는 어느 정도일까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def squares(self):
        self.section("두 정사각형 사이")
        R = 1.9
        C = np.array([-3.2, 0.1, 0])
        circ = Circle(radius=R, color=ORANGE, stroke_width=6, fill_color=ORANGE, fill_opacity=0.2).move_to(C)
        rl = Line(C, C + RIGHT * R, color=INK, stroke_width=4)
        rt = M("5 m", 26).next_to(rl, UP, buff=0.05)
        self.play(FadeIn(circ), Create(rl), FadeIn(rt), run_time=0.6)
        inner = Polygon(C + UP * R, C + LEFT * R, C + DOWN * R, C + RIGHT * R, color=BLUE, stroke_width=5, fill_color=BLUE, fill_opacity=0.15)
        t1 = M(f"안쪽 정사각형: 10 × 10 ÷ 2 = {b('50 m²')}", 34).move_to([3.0, 1.4, 0])
        self.say(f"안쪽 정사각형 {b('50 m²')}", "원 안에 꼭 맞는 정사각형은 두 대각선이 10 미터인 마름모 모양이라 넓이는 10 곱하기 10 나누기 2, 50 제곱미터예요.")
        self.play(Create(inner), FadeIn(t1), run_time=0.8)
        outer = Square(side_length=2 * R, color=GREEN, stroke_width=5).move_to(C)
        t2 = M(f"바깥 정사각형: 10 × 10 = {g('100 m²')}", 34).move_to([3.0, 0.4, 0])
        self.say(f"바깥 정사각형 {g('100 m²')}", "원 밖에 꼭 맞는 정사각형은 한 변이 지름 10 미터라서 넓이는 100 제곱미터예요.")
        self.play(Create(outer), FadeIn(t2), run_time=0.8)
        t3 = M(f"{b('50 m²')} &lt; 원의 넓이 &lt; {g('100 m²')}", 38).move_to([3.0, -0.9, 0])
        self.say("50보다 넓고 100보다 좁아요", "원의 넓이는 안쪽 정사각형보다 넓고 바깥 정사각형보다 좁으니 50 제곱미터보다 넓고 100 제곱미터보다 좁아요.")
        self.play(FadeIn(t3), run_time=0.6)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def grid(self):
        self.section("모눈으로 어림하기")
        s = 0.38
        C = np.array([-3.0, 0.0, 0])
        full, touch = cells_inside(N)
        allc = VGroup(*[Square(side_length=s, stroke_color="#BDB3A0", stroke_width=1, fill_color=PAPER, fill_opacity=1).move_to(C + np.array([(i + 0.5) * s, (j + 0.5) * s, 0]))
                        for i in range(-N, N) for j in range(-N, N)])
        circ = Circle(radius=N * s, color=ORANGE, stroke_width=5).move_to(C)
        self.play(FadeIn(allc), Create(circ), run_time=0.7)
        fc = VGroup(*[Square(side_length=s, stroke_width=1, stroke_color=INK, fill_color=BLUE, fill_opacity=0.55).move_to(C + np.array([(i + 0.5) * s, (j + 0.5) * s, 0])) for i, j in full])
        t1 = M(f"원 안에 꽉 찬 칸: {b(f'{len(full)}칸')}", 34).move_to([3.2, 1.2, 0])
        self.say(f"꽉 찬 칸 {b(f'{len(full)}칸')}", f"한 칸을 1 제곱미터로 보고 세어 봐요. 원 안에 완전히 들어간 칸은 {len(full)}칸이에요.")
        self.play(FadeIn(fc), FadeIn(t1), run_time=0.8)
        self.bring_to_front(circ)
        tc = VGroup(*[Square(side_length=s, stroke_width=1, stroke_color=INK, fill_color=GREEN, fill_opacity=0.45).move_to(C + np.array([(i + 0.5) * s, (j + 0.5) * s, 0])) for i, j in touch])
        tot = len(full) + len(touch)
        t2 = M(f"원이 걸친 칸까지: {g(f'{tot}칸')}", 34).move_to([3.2, 0.3, 0])
        self.say(f"걸친 칸까지 {g(f'{tot}칸')}", f"원이 조금이라도 걸친 칸까지 모두 세면 {tot}칸이에요.")
        self.play(FadeIn(tc), FadeIn(t2), run_time=0.8)
        self.bring_to_front(circ)
        t3 = M(f"{b(f'{len(full)} m²')} &lt; 원의 넓이 &lt; {g(f'{tot} m²')}", 38).move_to([3.2, -0.9, 0])
        self.say("범위를 더 좁혔어요", f"그래서 원의 넓이는 {len(full)} 제곱미터보다 넓고 {tot} 제곱미터보다 좁다고 더 좁게 어림할 수 있어요.")
        self.play(FadeIn(t3), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
