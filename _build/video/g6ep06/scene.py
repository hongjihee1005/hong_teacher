"""「수학 원리 돋보기」 6학년 6화 — 각기둥이란? (6-1 2단원 2~3차시, 화 코드 6-1-2-a)

두 면이 평행하고 합동인 다각형이며, 나머지 면이 모두 사각형인 입체도형 = 각기둥
평행하고 합동인 두 면 = 밑면(두 밑면은 옆면과 수직), 두 밑면과 만나는 면 = 옆면(모두 직사각형)
밑면은 '아래에 있는 면'이 아니라 평행하고 합동인 두 면
최종: GRADE=6 ./make_final.sh 6
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, Polygon, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from shapes import right_mark
from solid import Solid, prism, pyramid, regular


def tent(center, L=3.0):
    """옆으로 누운 삼각기둥: 밑면이 앞·뒤 삼각형"""
    tri = [(0, 0), (2.6, 0), (1.3, 1.8)]   # (x, y)
    verts = [(x, y, 0) for x, y in tri] + [(x, y, L) for x, y in tri]
    faces = [[0, 1, 2], [3, 4, 5], [0, 1, 4, 3], [1, 2, 5, 4], [2, 0, 3, 5]]
    return Solid(verts, faces, center)


class G6Ep06(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 6
    EP_TITLE = "각기둥이란?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.bases()
        self.sides()
        self.lying()
        self.closing(f"두 면이 {o('평행하고 합동인 다각형')}이고 나머지 면이 모두 사각형이면 {g('각기둥')}\n평행하고 합동인 두 면이 {o('밑면')}, 밑면과 만나는 면이 {b('옆면')}",
                     next_preview="6학년 7화 · 각기둥의 이름과 구성 요소")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("이 입체도형들은 어떤 점이 같을까요?", 46).move_to([0.6, 2.2, 0])
        self.say("어떤 점이 같을까요?", "이 입체도형들을 살펴보세요. 어떤 점이 같을까요?")
        self.play(Write(q), run_time=0.8)
        sol = VGroup(*[prism(regular(n, 0.9), 1.7, center=(x, -0.2, 0)).edges(width=4) for n, x in [(3, -4.5), (4, -1.5), (5, 1.5), (6, 4.5)]])
        self.play(LaggedStart(*[FadeIn(s) for s in sol], lag_ratio=0.2, run_time=1.0))
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def bases(self):
        self.section("밑면")
        s = prism(regular(5, 1.7), 3.0, center=(-2.8, 0.2, 0))
        ed = s.edges()
        self.say("오각기둥을 살펴봐요", "오각형 두 개가 위아래에 있는 입체도형을 살펴볼게요.")
        self.play(Create(ed), run_time=1.0)
        top, bot = s.face(1, ORANGE, 0.6), s.face(0, ORANGE, 0.6)
        self.say(f"두 면이 {o('평행')}해요", "위와 아래의 오각형은 서로 평행해요. 아무리 늘여도 만나지 않아요.")
        self.play(FadeIn(top), FadeIn(bot), run_time=0.6)
        cp = bot.copy().set_fill(ORANGE, 0.9)
        self.say(f"모양과 크기가 같아요: {o('합동')}", "아래 오각형을 위로 올리면 위 오각형과 꼭 겹쳐요. 두 면은 합동이에요.")
        self.play(cp.animate.move_to(top.get_center()), run_time=1.2)
        self.play(FadeOut(cp), run_time=0.3)
        lab = M(f"평행하고 합동인 두 면 = {o('밑면')}", 40).move_to([3.4, 1.0, 0])
        self.say(f"이 두 면이 {o('밑면')}", "평행하고 합동인 두 면을 밑면이라고 해요.")
        self.play(FadeIn(lab), run_time=0.5)
        i = 1
        O = s.p[i]
        rm = right_mark(O, s.p[s.n + i] - O, s.p[0] - O, 0.28, GREEN, 4)
        rl = M(f"밑면과 옆면은 {g('수직')}", 34).move_to([3.4, -0.2, 0])
        self.say(f"밑면은 옆면과 {g('수직')}으로 만나요", "두 밑면은 나머지 면들과 모두 수직으로 만나요.")
        self.play(Create(rm), FadeIn(rl), run_time=0.6)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def sides(self):
        self.section("옆면")
        s = prism(regular(5, 1.7), 3.0, center=(-2.8, 0.2, 0))
        ed = s.edges()
        self.play(FadeIn(ed), FadeIn(s.face(0, ORANGE, 0.35)), FadeIn(s.face(1, ORANGE, 0.35)), run_time=0.5)
        vis_sides = [k for k in range(2, len(s.faces)) if s.vis[k]]
        fs = VGroup(*[s.face(k, BLUE, 0.45) for k in vis_sides])
        self.say(f"두 밑면과 만나는 면 = {b('옆면')}", "두 밑면과 만나는 면을 옆면이라고 해요.")
        self.play(LaggedStart(*[FadeIn(f) for f in fs], lag_ratio=0.25, run_time=1.0))
        k = vis_sides[0]
        f = s.faces[k]
        pts = [s.p[i] for i in f]
        big = Polygon(*pts, fill_color=BLUE, fill_opacity=0.6, stroke_color=INK, stroke_width=4)
        flat_w = np.linalg.norm(np.array(s.v3[f[1]]) - np.array(s.v3[f[0]]))
        rect = Polygon([2.4, -0.6, 0], [2.4 + flat_w, -0.6, 0], [2.4 + flat_w, 2.0, 0], [2.4, 2.0, 0], fill_color=BLUE, fill_opacity=0.6, stroke_color=INK, stroke_width=4)
        self.say(f"옆면은 모두 {b('직사각형')}", "옆면 하나를 떼어 바로 세워 보면 직사각형이에요. 각기둥의 옆면은 모두 직사각형이에요.")
        self.play(big.animate.become(rect), run_time=1.2)
        rms = VGroup(*[right_mark(c, d1, d2, 0.25, GREEN, 4) for c, d1, d2 in [
            (rect.get_vertices()[0], RIGHT, UP), (rect.get_vertices()[1], LEFT, UP), (rect.get_vertices()[2], LEFT, DOWN), (rect.get_vertices()[3], RIGHT, DOWN)]])
        self.play(Create(rms), run_time=0.6)
        d = M(f"이런 입체도형 = {g('각기둥')}", 40).move_to([3.6, -1.6, 0])
        self.say(f"이런 입체도형이 {g('각기둥')}", "두 면이 평행하고 합동인 다각형이고 나머지 면이 모두 사각형인 입체도형을 각기둥이라고 해요.")
        self.play(FadeIn(d), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def lying(self):
        self.section("밑면은 아래 면?")
        t = tent((-2.4, 0.2, 0))
        ed = t.edges()
        self.say("누워 있는 각기둥", "이번에는 옆으로 누워 있는 각기둥이에요. 어느 면이 밑면일까요?")
        self.play(Create(ed), run_time=0.9)
        floor = t.face(2, SOFT, 0.35)
        x = M(f"바닥에 닿은 면은 {o('사각형')}", 34).move_to([3.4, 1.4, 0])
        self.play(FadeIn(floor), FadeIn(x), run_time=0.5)
        fa, fb = t.face(0, ORANGE, 0.65), t.face(1, ORANGE, 0.65)
        y = M(f"평행하고 합동인 {o('삼각형 두 개')}가 밑면", 34).move_to([3.4, 0.4, 0])
        self.say(f"밑면은 {o('평행하고 합동인 두 면')}", "밑면은 아래에 있는 면이 아니에요. 평행하고 합동인 두 삼각형이 밑면이에요. 놓인 모양이 달라도 밑면은 바뀌지 않아요.")
        self.play(FadeIn(fa), FadeIn(fb), FadeIn(y), run_time=0.7)
        self.play(Indicate(fa, color=ORANGE), Indicate(fb, color=ORANGE), run_time=0.8)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
