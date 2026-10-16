"""「수학 원리 돋보기」 4학년 44화 — 수직과 수선 (4-2 4단원 2차시, 화 코드 4-2-4-a)

한 직선이 돌다가 다른 직선과 만나는 각이 직각이 되는 순간 → 두 직선은 서로 수직, 한 직선은 다른 직선에 대한 수선
기울어져 있어도 만나는 각이 직각이면 수직 / 삼각자의 직각을 대고 수선 긋기
최종: GRADE=4 ./make_final.sh 44
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DEGREES, DOWN, LEFT, RIGHT, UP, Arc, Create, Cross, Dot, FadeIn, FadeOut, Indicate, Line,
                   ValueTracker, VGroup, Write, always_redraw)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from shapes import PURPLE, poly, right_mark

RED = "#C0392B"


def cross_lines(c, a_deg, b_deg, L=2.4, ca=INK, cb=BLUE):
    c = np.array(c, float)
    da = np.array([np.cos(np.radians(a_deg)), np.sin(np.radians(a_deg)), 0])
    db = np.array([np.cos(np.radians(b_deg)), np.sin(np.radians(b_deg)), 0])
    return VGroup(Line(c - da * L / 2, c + da * L / 2, color=ca, stroke_width=6),
                  Line(c - db * L / 2, c + db * L / 2, color=cb, stroke_width=6)), da, db


class G4Ep44(EpisodeScene):
    GRADE, SEM = 4, 2
    EP_NO = 44
    EP_TITLE = "수직과 수선"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.turn()
        self.tilted()
        self.draw()
        self.closing(f"두 직선이 만나서 이루는 각이 {o('직각')}이면 두 직선은 서로 {g('수직')}\n한 직선을 다른 직선에 대한 {b('수선')}이라고 해요",
                     next_preview="4학년 45화 · 평행과 평행선 사이의 거리")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("창틀의 두 선은 어떻게 만나고 있나요?", 48).move_to([0.6, 2.3, 0])
        frame = poly([[-1.6, -2.0, 0], [1.6, -2.0, 0], [1.6, 1.2, 0], [-1.6, 1.2, 0]], color="#8B5A2B", width=8)
        bars = VGroup(Line([0, -2.0, 0], [0, 1.2, 0], color="#8B5A2B", stroke_width=8),
                      Line([-1.6, -0.4, 0], [1.6, -0.4, 0], color="#8B5A2B", stroke_width=8))
        win = VGroup(frame, bars).move_to([0, -0.4, 0])
        self.say("창틀의 두 선이 만나는 모양", "창틀의 가로 선과 세로 선은 어떻게 만나고 있을까요? 만나서 생기는 각을 살펴봐요.")
        self.play(Write(q), Create(win), run_time=1.2)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def turn(self):
        self.section("직각으로 만나는 순간")
        O = np.array([-1.5, -0.4, 0])
        base = Line(O + LEFT * 3.6, O + RIGHT * 3.6, color=INK, stroke_width=6)
        lab_a = T("가", 40).next_to(base, RIGHT, buff=0.2)
        th = ValueTracker(30)

        def d():
            a = np.radians(th.get_value())
            return np.array([np.cos(a), np.sin(a), 0])
        mover = always_redraw(lambda: Line(O - d() * 2.2, O + d() * 2.3, color=BLUE, stroke_width=6))
        arc = always_redraw(lambda: Arc(radius=0.6, start_angle=0, angle=th.get_value() * DEGREES, arc_center=O,
                                        color=ORANGE, stroke_width=5))
        num = always_redraw(lambda: T(f"{th.get_value():.0f}°", 44, ORANGE).move_to([3.6, 1.6, 0]))
        self.say("한 직선을 돌려 볼까요?", "직선 가 위에서 파란 직선을 돌려 볼게요. 두 직선이 만나서 생기는 각을 보세요.")
        self.play(Create(base), FadeIn(lab_a), Create(mover), Create(arc), FadeIn(num), run_time=0.9)
        self.play(th.animate.set_value(65), run_time=1.4)
        self.play(th.animate.set_value(90), run_time=1.4)
        mk = right_mark(O, RIGHT, UP, 0.42)
        self.remove(arc)
        self.say(f"만나는 각이 {o('직각')}이 되었어요", "두 직선이 만나서 이루는 각이 직각, 90도가 되었어요.")
        self.play(Create(mk), Indicate(num, color=ORANGE), run_time=0.8)
        lab_b = T("나", 40, BLUE).move_to(O + UP * 2.55 + RIGHT * 0.35)
        n1 = M(f"가와 나는 서로 {g('수직')}", 50).move_to([3.4, 0.6, 0])
        n2 = M(f"나는 가에 대한 {b('수선')}", 50).move_to([3.4, -0.4, 0])
        self.say(f"이때 두 직선은 서로 {g('수직')}이에요", "이렇게 두 직선이 만나서 이루는 각이 직각일 때, 두 직선은 서로 수직이라고 해요.")
        self.play(FadeIn(lab_b), FadeIn(n1), FadeOut(num), run_time=0.6)
        self.say(f"나를 가에 대한 {b('수선')}이라고 해요", "그리고 직선 나를 직선 가에 대한 수선이라고 해요. 거꾸로 가도 나에 대한 수선이에요.")
        self.play(FadeIn(n2), run_time=0.6)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def tilted(self):
        self.section("어느 것이 수직일까요?")
        cs = [(-4.0, 0.3, 0), (0, 0.3, 0), (4.0, 0.3, 0)]
        specs = [(0, 90), (20, 110), (0, 70)]
        items = VGroup()
        info = []
        for c, (a1, a2) in zip(cs, specs):
            gl, da, db = cross_lines(c, a1, a2, 2.8)
            items.add(gl)
            info.append((np.array(c), da, db, a2 - a1))
        tags = VGroup(*[T(s, 40).move_to([c[0], -1.6, 0]) for s, c in zip("①②③", cs)])
        self.say("두 직선이 수직인 것을 찾아봐요", "세 쌍의 직선 가운데 서로 수직인 것은 어느 것일까요?")
        self.play(FadeIn(items), FadeIn(tags), run_time=0.8)
        self.pause_screen(4)
        m1 = right_mark(info[0][0], info[0][1], info[0][2], 0.36)
        self.say(f"①은 {g('직각')}으로 만나요", "①은 가로와 세로로 만나서 각이 직각이에요. 수직이에요.")
        self.play(Create(m1), run_time=0.6)
        m2 = right_mark(info[1][0], info[1][1], info[1][2], 0.36)
        self.say(f"②는 기울어져 있지만 {g('직각')}이에요", "②는 비스듬히 기울어져 있지만, 삼각자의 직각을 대어 보면 꼭 맞아요. 만나는 각이 직각이니 ②도 수직이에요.")
        self.play(Create(m2), Indicate(items[1], color=GREEN), run_time=0.8)
        c3 = info[2][0]
        a3 = Arc(radius=0.45, start_angle=0, angle=70 * DEGREES, arc_center=c3, color=RED, stroke_width=5)
        t3 = T("70°", 34, RED).move_to(c3 + np.array([0.8, 0.45, 0]))
        self.say(f"③은 {o('70°')}라서 수직이 아니에요", "③은 만나는 각이 70도라서 직각이 아니에요. 수직이 아니에요.")
        self.play(Create(a3), FadeIn(t3), run_time=0.6)
        n = M(f"놓인 방향이 아니라 {o('만나는 각')}을 봐요", 46).move_to([0, -2.5, 0])
        self.play(FadeIn(n), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def draw(self):
        self.section("삼각자로 수선 긋기")
        y = -1.2
        base = Line([-5.0, y, 0], [5.0, y, 0], color=INK, stroke_width=6)
        P = Dot([0.5, y, 0], radius=0.09, color=RED)
        pl = T("점 ㄱ", 34, RED).next_to(P, DOWN, buff=0.2)
        self.say("직선 위의 점 ㄱ을 지나는 수선", "직선 위의 점 ㄱ을 지나는 수선을 삼각자로 그어 볼게요.")
        self.play(Create(base), FadeIn(P), FadeIn(pl), run_time=0.7)
        tri = poly([[0, 0, 0], [2.2, 0, 0], [0, 3.0, 0]], color=PURPLE, fill=PURPLE, op=0.2)
        tri.shift(np.array([-4.0, y, 0]))
        rm = right_mark([-4.0, y, 0], RIGHT, UP, 0.35, color=PURPLE)
        tri_g = VGroup(tri, rm)
        self.say(f"삼각자의 한 변을 직선에 맞추고", "먼저 삼각자의 직각을 낀 한 변을 직선에 꼭 맞추어요.")
        self.play(FadeIn(tri_g), run_time=0.6)
        self.say(f"{o('직각')}의 꼭짓점을 점 ㄱ에 맞춰요", "삼각자를 직선을 따라 밀어서, 직각의 꼭짓점이 점 ㄱ에 오게 해요.")
        self.play(tri_g.animate.shift(RIGHT * 4.5), run_time=1.4)
        ln = Line([0.5, y, 0], [0.5, y + 3.0, 0], color=BLUE, stroke_width=7)
        self.say(f"직각을 낀 다른 변을 따라 {b('선을 그어요')}", "직각을 낀 다른 한 변을 따라 선을 그으면, 점 ㄱ을 지나는 수선이 돼요.")
        self.play(Create(ln), run_time=1.0)
        self.play(FadeOut(tri_g), run_time=0.5)
        mk = right_mark([0.5, y, 0], RIGHT, UP, 0.38)
        n = M(f"점 ㄱ을 지나는 {b('수선')} 완성", 46).move_to([-2.9, 1.4, 0])
        self.play(Create(mk), FadeIn(n), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
