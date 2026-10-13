"""「수학 원리 돋보기」 33화 — 각과 직각은 무엇일까? (1학기 2단원 4·5차시, 화 코드 1-2-b)

손전등 빛 → 한 점에서 시작하는 두 반직선 = 각(꼭짓점, 변, 각 ㄱㄴㄷ) → 각이 아닌 것
→ 종이를 반듯하게 두 번 접어 직각 → ⌞ 표시 → 삼각자로 직각 찾기
최종: ./make_final.sh 33
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, PI, ArcBetweenPoints, Circle, Create, FadeIn, FadeOut, Indicate, LaggedStart,
                   Line, Polygon, Rotate, Sector, SurroundingRectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, PLATE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from geom import pt, ray, right_mark
from items import check_mark, cross_mark


class Ep33(EpisodeScene):
    EP_NO = 33
    EP_TITLE = "각과 직각은 무엇일까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.angle()
        self.not_angle()
        self.fold()
        self.find()
        self.closing(f"한 점에서 시작하는 두 반직선 → {b('각')}\n종이를 반듯하게 두 번 접어 생기는 각 → {o('직각')} ⌞",
                     next_preview="34화 · 직각삼각형은 어떤 삼각형일까?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        N = np.array([-3.5, -0.6, 0])
        torch = Polygon(N + [-0.6, -0.25, 0], N + [-0.6, 0.25, 0], N + [0, 0.12, 0], N + [0, -0.12, 0],
                        color=INK, fill_color=SOFT, fill_opacity=1, stroke_width=3)
        beam = Polygon(N, N + np.array([6.5, 2.6, 0]), N + np.array([6.5, -0.4, 0]), color=ORANGE, fill_color=ORANGE,
                       fill_opacity=0.25, stroke_width=0)
        self.say("손전등 빛이 뻗어 나가요", "화재 대피 체험 장소에서 손전등을 켰어요. 빛이 뻗어 나가요.")
        self.play(FadeIn(torch), FadeIn(beam), run_time=0.9)
        q = M("손전등 빛이 뻗어 나가는 모양은 어떤 도형일까요?", 48).move_to([0, 2.4, 0])
        self.say("빛이 뻗어 나가는 모양은 어떤 도형일까요?", "빛이 뻗어 나가는 모양은 어떤 도형일까요?")
        self.play(FadeIn(q), run_time=0.6)
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def angle(self):
        self.section("각")
        N = np.array([-5.6, -1.4, 0])
        A = N + np.array([3.2, 2.0, 0])
        C = N + np.array([3.6, 0.0, 0])
        r1, r2 = ray(N, A, 5.6), ray(N, C, 5.6)
        pn = pt(N, "ㄴ", DOWN + LEFT)
        pa, pc = pt(A, "ㄱ", UP), pt(C, "ㄷ", DOWN)
        self.say("점 ㄴ에서 반직선 두 개를 그어요", "손전등이 있는 점 ㄴ에서 빛을 따라 반직선 ㄴㄱ과 반직선 ㄴㄷ을 그어요.")
        self.play(FadeIn(pn), run_time=0.4)
        self.play(Create(r1), FadeIn(pa), run_time=0.8)
        self.play(Create(r2), FadeIn(pc), run_time=0.8)
        d = M(f"한 점에서 시작하는\n두 반직선 → {b('각')}", 46).move_to([3.8, 1.4, 0])
        self.say(f"한 점에서 시작하는 두 반직선으로 된 도형: {b('각')}", "한 점에서 시작하는 두 반직선으로 이루어진 도형을 각이라고 해요.")
        self.play(FadeIn(d), run_time=0.6)
        self.wait(0.6)
        v = T("꼭짓점", 34, ORANGE).next_to(N, LEFT + UP, buff=0.3)
        self.say(f"점 ㄴ은 {o('꼭짓점')}, 두 반직선은 {b('변')}", "점 ㄴ을 각의 꼭짓점, 반직선 ㄴㄱ과 반직선 ㄴㄷ을 각의 변이라고 해요.")
        self.play(Indicate(pn, color=ORANGE, scale_factor=1.8), FadeIn(v), run_time=0.8)
        e1 = T("변", 34, BLUE).move_to(N + (A - N) * 0.5 + np.array([-0.3, 0.35, 0]))
        e2 = T("변", 34, BLUE).move_to(N + (C - N) * 0.55 + np.array([0, -0.35, 0]))
        self.play(FadeIn(e1), FadeIn(e2), run_time=0.5)
        rd = M(f"읽기: {b('각 ㄱㄴㄷ')} 또는 {b('각 ㄷㄴㄱ')}\n(꼭짓점을 가운데에)", 38).move_to([3.8, -0.4, 0])
        self.say(f"{b('각 ㄱㄴㄷ')}, 꼭짓점을 가운데에", "각 ㄱㄴㄷ 또는 각 ㄷㄴㄱ이라고 읽어요. 꼭짓점 ㄴ을 가운데에 읽어요.")
        self.play(FadeIn(rd), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def not_angle(self):
        self.section("각일까요, 아닐까요?")
        items = []
        c = [-4.2, -1.4, 1.4, 4.2]
        def place(g, x):
            return g.move_to([x, 0.6, 0])
        a1 = VGroup(Line([0, 0, 0], [1.2, 1.0, 0], color=INK, stroke_width=6), Line([0, 0, 0], [1.4, 0, 0], color=INK, stroke_width=6))
        a2 = VGroup(Line([0, 0, 0], [1.2, 1.0, 0], color=INK, stroke_width=6), Line([0.25, -0.15, 0], [1.5, -0.15, 0], color=INK, stroke_width=6))
        a3 = VGroup(ArcBetweenPoints(np.array([0, 0, 0]), np.array([1.2, 1.0, 0]), angle=0.9, color=INK, stroke_width=6), Line([0, 0, 0], [1.4, 0, 0], color=INK, stroke_width=6))
        a4 = VGroup(Line([0, 0, 0], [0, 1.2, 0], color=INK, stroke_width=6), Line([0, 0, 0], [1.3, 0, 0], color=INK, stroke_width=6))
        figs = [place(a, x) for a, x in zip((a1, a2, a3, a4), c)]
        labs = VGroup(*[T(n, 36).next_to(f, DOWN, buff=0.35) for n, f in zip("가나다라", figs)])
        self.say("각을 모두 찾아보세요", "이 중에서 각을 모두 찾아보세요.")
        self.play(LaggedStart(*[Create(f) for f in figs], lag_ratio=0.2, run_time=1.4), FadeIn(labs))
        self.wait(2.0)
        marks = [check_mark(0.5), cross_mark(0.45), cross_mark(0.45), check_mark(0.5)]
        why = [None, "두 선이 만나지 않아요", "굽은 선이 있어요", None]
        self.say(f"가와 라는 {g('각')}, 나와 다는 각이 아니에요", "가와 라는 각이에요. 나는 두 선이 만나지 않고, 다는 굽은 선이 있어서 각이 아니에요.")
        anims = []
        for f, m_, w in zip(figs, marks, why):
            m_.next_to(f, UP, buff=0.2)
            anims.append(Create(m_))
        self.play(*anims, run_time=0.8)
        ws = VGroup(*[M(w, 30).next_to(labs[i], DOWN, buff=0.2) for i, w in enumerate(why) if w])
        self.play(FadeIn(ws), run_time=0.5)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)

    def fold(self):
        self.section("종이를 두 번 접으면")
        c = np.array([-3.0, 0.3, 0])
        disk = Circle(radius=1.6, fill_color=PLATE, fill_opacity=1, stroke_color=INK, stroke_width=4).move_to(c)
        self.say("둥근 종이를 반듯하게 두 번 접어 볼까요?", "모양이 둥근 종이를 반듯하게 두 번 접어 볼까요?")
        self.play(FadeIn(disk), run_time=0.5)
        half = Sector(radius=1.6, start_angle=0, angle=PI, fill_color=PLATE, fill_opacity=1, stroke_color=INK, stroke_width=4).move_arc_center_to(c)
        self.play(disk.animate.become(half), run_time=1.0)
        quarter = Sector(radius=1.6, start_angle=0, angle=PI / 2, fill_color=PLATE, fill_opacity=1, stroke_color=INK, stroke_width=4).move_arc_center_to(c)
        self.play(disk.animate.become(quarter), run_time=1.0)
        mk = right_mark(c, c + RIGHT, c + UP, 0.4)
        self.play(Create(mk), run_time=0.5)
        d = M(f"이렇게 생긴 각 → {o('직각')}", 52).move_to([3.0, 1.0, 0])
        self.say(f"두 번 접어 생긴 각을 {o('직각')}이라고 해요", "종이를 반듯하게 두 번 접었을 때 생기는 각을 직각이라고 해요.")
        self.play(FadeIn(d), run_time=0.6)
        d2 = M(f"직각은 꼭짓점에 {o('⌞')} 표시를 해요", 42).move_to([3.0, -0.1, 0])
        self.say(f"꼭짓점에 {o('⌞')} 표시", "직각을 나타낼 때에는 꼭짓점에 이런 표시를 해요.")
        self.play(FadeIn(d2), Indicate(mk, color=ORANGE, scale_factor=1.5), run_time=0.8)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def find(self):
        self.section("삼각자로 직각 찾기")
        shapes = [
            (VGroup(Line([0, 0, 0], [0, 1.4, 0]), Line([0, 0, 0], [1.6, 0, 0])), True),
            (VGroup(Line([0, 0, 0], [0.7, 1.3, 0]), Line([0, 0, 0], [1.6, 0, 0])), False),
            (VGroup(Line([0, 0, 0], [-0.5, 1.3, 0]), Line([0, 0, 0], [1.4, 0, 0])), False),
            (VGroup(Line([0, 0, 0], [-1.0, 1.0, 0]), Line([0, 0, 0], [1.0, 1.0, 0])), True),
        ]
        xs = [-4.6, -1.6, 1.5, 4.4]
        figs = VGroup()
        for (s_, ok), x in zip(shapes, xs):
            s_.set_stroke(INK, 6).move_to([x, 0.5, 0])
            figs.add(s_)
        flabs = VGroup(*[T(n, 34).next_to(f, DOWN, buff=0.35) for n, f in zip("가나다라", figs)])
        self.add(flabs)
        self.say("직각을 모두 찾아보세요", "이 각들 중에서 직각을 모두 찾아보세요. 기울어져 있어도 직각일 수 있어요.")
        self.play(LaggedStart(*[Create(f) for f in figs], lag_ratio=0.2, run_time=1.2))
        self.wait(2.0)
        tri = Polygon([0, 0, 0], [1.0, 0, 0], [0, 0.8, 0], color=BLUE, fill_color=BLUE, fill_opacity=0.25, stroke_width=3)
        self.say("삼각자의 직각 부분을 대어 봐요", "삼각자의 직각 부분을 꼭짓점에 대어 꼭 맞으면 직각이에요.")
        for k, ((s_, ok), x) in enumerate(zip(shapes, xs)):
            v = s_[0].get_start()
            t = tri.copy()
            if k == 3:
                t.rotate(PI / 4, about_point=[0, 0, 0])
            t.shift(v)
            self.play(FadeIn(t), run_time=0.4)
            if ok:
                a, b2 = s_[0].get_end(), s_[1].get_end()
                self.play(Create(right_mark(v, a, b2, 0.3)), run_time=0.4)
            self.play(FadeOut(t), run_time=0.3)
        self.say(f"가와 라가 {o('직각')}", "가와 라가 직각이에요. 라처럼 돌려 놓여 있어도 직각이에요.")
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
