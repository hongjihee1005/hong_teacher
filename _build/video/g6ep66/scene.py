"""「수학 원리 돋보기」 6학년 66화 — 구란? (6-2 6단원 6차시 + 7~8차시 생각을 더하다, 화 코드 6-2-6-d)

탁구공·배구공·농구공 같은 입체도형 = 구
구의 중심(가장 안쪽의 점), 구의 반지름(중심과 겉면의 한 점을 이은 선분, 길이가 모두 같음), 구의 지름(중심을 지나는, 겉면의 두 점을 이은 선분)
반원 모양의 종이를 돌리면 구 / 구는 어느 방향에서 보아도 원 (원기둥 앞: 직사각형·위: 원, 원뿔 앞: 삼각형·위: 원)
최종: GRADE=6 ./make_final.sh 66 — 6학년 마지막 화
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, PI, RIGHT, UP, Circle, Create, DashedLine, Dot, FadeIn, FadeOut, Indicate, LaggedStart,
                   Line, Polygon, Rectangle, Sector, ValueTracker, VGroup, Write, always_redraw, linear)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from round3d import cone, cylinder, sphere
from tablekit import table

GRN = "#6FBF8E"


class G6Ep66(EpisodeScene):
    GRADE, SEM = 6, 2
    EP_NO = 66
    EP_TITLE = "구란?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.parts()
        self.spin()
        self.views()
        self.closing(f"공 모양의 입체도형이 {g('구')} — 구의 {o('중심')}은 1개, {b('반지름')}은 길이가 모두 같아요\n구는 어느 방향에서 보아도 {g('원')}",
                     next_preview="6학년 편 끝! 함께해 주어서 고마워요")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("탁구공, 배구공, 농구공 같은 모양에는\n어떤 특징이 있을까요?", 44).move_to([0.6, 2.0, 0])
        self.say("공 모양의 특징은?", "탁구공, 배구공, 농구공 같은 모양에는 어떤 특징이 있을까요?")
        self.play(Write(q), run_time=1.0)
        balls = VGroup(sphere(0.45, (-3.0, -0.6, 0), fill="#F5F0E6"), sphere(0.85, (0, -0.6, 0), fill="#7C9CC9"), sphere(1.1, (3.3, -0.6, 0), fill="#E08A3C"))
        self.play(LaggedStart(*[FadeIn(x) for x in balls], lag_ratio=0.25, run_time=0.9))
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def parts(self):
        self.section("구의 중심 · 반지름 · 지름")
        R = 1.9
        C = np.array([-3.0, 0.0, 0])
        sp = sphere(R, C, fill=GRN)
        self.play(FadeIn(sp), run_time=0.5)
        cd = Dot(C, radius=0.12, color=ORANGE)
        t1 = M(f"가장 안쪽의 점 = {o('구의 중심')}", 32).move_to([3.0, 1.8, 0])
        self.say(f"가장 안쪽의 점 = {o('구의 중심')}", "구에서 가장 안쪽에 있는 점을 구의 중심이라고 해요. 구의 중심은 1개예요.")
        self.play(FadeIn(cd, scale=2), FadeIn(t1), run_time=0.6)
        angs = [0.4, 1.3, 2.4, 3.6, 5.0]
        radii = VGroup(*[Line(C, C + R * np.array([np.cos(a), np.sin(a), 0]), color=BLUE, stroke_width=4) for a in angs])
        t2 = M(f"중심과 겉면을 이은 선분 = {b('반지름')}", 32).move_to([3.0, 0.8, 0])
        t2b = M("길이가 모두 같아요", 28, SOFT).move_to([3.0, 0.2, 0])
        self.say(f"반지름은 {b('길이가 모두 같아요')}", "구의 중심과 구의 겉면의 한 점을 이은 선분을 구의 반지름이라고 해요. 반지름은 셀 수 없이 많고 길이가 모두 같아요.")
        self.play(LaggedStart(*[Create(r) for r in radii], lag_ratio=0.15, run_time=0.9), FadeIn(t2), FadeIn(t2b))
        dia = Line(C + R * np.array([np.cos(2.0), np.sin(2.0), 0]), C - R * np.array([np.cos(2.0), np.sin(2.0), 0]), color=GREEN, stroke_width=7)
        t3 = M(f"중심을 지나는 선분 = {g('지름')}", 32).move_to([3.0, -0.8, 0])
        t3b = M("지름 = 반지름 × 2", 28, SOFT).move_to([3.0, -1.4, 0])
        self.say(f"중심을 지나면 {g('지름')}", "구의 겉면의 두 점을 이은 선분이 구의 중심을 지날 때 이 선분을 구의 지름이라고 해요. 지름은 반지름의 2배예요.")
        self.play(Create(dia), FadeIn(t3), FadeIn(t3b), run_time=0.7)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def spin(self):
        self.section("반원을 돌리면")
        C = np.array([-2.4, 0.0, 0])
        R = 1.5
        axis = DashedLine(C + np.array([0, -R - 0.5, 0]), C + np.array([0, R + 0.5, 0]), color=SOFT, stroke_width=4)
        self.play(Create(axis), run_time=0.4)
        t = ValueTracker(0)

        def half():
            k = np.cos(t.get_value())
            s = Sector(radius=R, start_angle=-PI / 2, angle=PI, fill_color=GRN, fill_opacity=0.85, stroke_color=INK, stroke_width=4)
            s.move_arc_center_to(C)
            f = k if abs(k) > 0.02 else (0.02 if k >= 0 else -0.02)
            return s.stretch(f, 0, about_point=C)

        hs = always_redraw(half)
        self.add(hs)
        ghost = sphere(R, C, fill=GRN)
        self.say("지름을 기준으로 한 바퀴", "반원 모양의 종이를 지름을 기준으로 한 바퀴 돌려 볼게요.")
        self.play(t.animate.set_value(2 * np.pi), FadeIn(ghost, run_time=4.0), run_time=4.0, rate_func=linear)
        res = M(f"반원을 돌리면 {g('구')}", 40).move_to([3.2, 0.3, 0])
        self.say(f"{g('구')}가 만들어져요", "돌린 자리가 모여 구가 돼요. 반원의 중심이 구의 중심, 반원의 반지름이 구의 반지름이 돼요.")
        self.play(FadeIn(res), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def views(self):
        self.section("여러 방향에서 보면")
        xs = [-4.2, 0, 4.2]
        sols = VGroup(cylinder(0.7, 1.4, (xs[0], 1.75, 0)), cone(0.75, 1.5, (xs[1], 1.75, 0)), sphere(0.8, (xs[2], 1.75, 0), fill=GRN))
        names = VGroup(*[M(n, 30).move_to([x, 0.2, 0]) for n, x in zip(["원기둥", "원뿔", "구"], xs)])
        self.play(FadeIn(sols), FadeIn(names), run_time=0.6)
        fr = VGroup(Rectangle(width=1.4, height=1.0, fill_color="#F2C14E", fill_opacity=0.7, stroke_color=INK, stroke_width=3).move_to([xs[0] - 0.9, -0.8, 0]),
                    Polygon([xs[1] - 1.6, -1.3, 0], [xs[1] - 0.2, -1.3, 0], [xs[1] - 0.9, -0.3, 0], fill_color="#7C9CC9", fill_opacity=0.7, stroke_color=INK, stroke_width=3),
                    Circle(radius=0.5, fill_color=GRN, fill_opacity=0.7, stroke_color=INK, stroke_width=3).move_to([xs[2] - 0.9, -0.8, 0]))
        tp = VGroup(*[Circle(radius=0.5, fill_color=c, fill_opacity=0.7, stroke_color=INK, stroke_width=3).move_to([x + 0.9, -0.8, 0]) for x, c in zip(xs, ["#F2C14E", "#7C9CC9", GRN])])
        lf = VGroup(*[T("앞", 24, SOFT).move_to([x - 0.9, -1.75, 0]) for x in xs])
        lt = VGroup(*[T("위", 24, SOFT).move_to([x + 0.9, -1.75, 0]) for x in xs])
        self.say("앞에서 보면", "생각을 더해 볼게요. 앞에서 보면 원기둥은 직사각형, 원뿔은 삼각형, 구는 원이에요.")
        self.play(FadeIn(fr), FadeIn(lf), run_time=0.7)
        self.say(f"위에서 보면 모두 {g('원')}", "위에서 보면 세 입체도형 모두 원이에요. 특히 구는 어느 방향에서 보아도 원이에요.")
        self.play(FadeIn(tp), FadeIn(lt), run_time=0.7)
        self.play(Indicate(VGroup(fr[2], tp[2]), color=GREEN, scale_factor=1.15), run_time=0.8)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
