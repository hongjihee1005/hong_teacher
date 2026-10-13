"""「수학 원리 돋보기」 32화 — 선분, 반직선, 직선은 무엇이 다를까? (1학기 2단원 평면도형 2·3차시, 화 코드 1-2-a)

곧은 선과 굽은 선 → 두 점을 곧게 이은 선분 → 한쪽으로 끝없이(반직선) → 양쪽으로 끝없이(직선)
→ 반직선 ㄱㄴ ≠ 반직선 ㄴㄱ(시작하는 점을 먼저) → 분류하기
최종: ./make_final.sh 32
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, ArcBetweenPoints, Create, FadeIn, FadeOut, Indicate, LaggedStart, Line,
                   SurroundingRectangle, ValueTracker, VGroup, Write, always_redraw)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from geom import line_both, pt, ray


class Ep32(EpisodeScene):
    EP_NO = 32
    EP_TITLE = "선분, 반직선, 직선은 무엇이 다를까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.segment()
        self.extend()
        self.direction()
        self.sort()
        self.closing(f"{b('선분')}: 두 점을 곧게 이은 선,  {o('반직선')}: 한쪽으로 끝없이\n{g('직선')}: 양쪽으로 끝없이 — 모두 곧은 선이에요",
                     next_preview="33화 · 각과 직각은 무엇일까?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        lines = VGroup(
            Line([-5.5, 1.2, 0], [-3.5, 1.2, 0], color=INK, stroke_width=7),
            ArcBetweenPoints(np.array([-2.5, 0.8, 0]), np.array([-0.5, 0.8, 0]), angle=-1.6, color=INK, stroke_width=7),
            Line([0.5, 0.2, 0], [2.3, 1.6, 0], color=INK, stroke_width=7),
            ArcBetweenPoints(np.array([3.2, 1.4, 0]), np.array([5.2, 0.2, 0]), angle=2.2, color=INK, stroke_width=7),
        )
        labs = VGroup(*[T(n, 36).next_to(l, DOWN, buff=0.3) for n, l in zip("가나다라", lines)])
        self.say("소방관 체험 장소에서 따라 그린 선이에요", "소방관 체험 장소에서 건물 모서리, 소방차 바퀴, 사다리, 호스를 따라 선을 그렸어요.")
        self.play(LaggedStart(*[Create(l) for l in lines], lag_ratio=0.3, run_time=1.6), FadeIn(labs))
        q = M("이 선들을 어떻게 나눌 수 있을까요?", 54).move_to([0, -1.3, 0])
        self.say("이 선들을 어떻게 나눌 수 있을까요?", "이 선들을 어떻게 나눌 수 있을까요?")
        self.play(FadeIn(q), run_time=0.6)
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        self.play(FadeOut(q), run_time=0.3)
        self.say(f"{b('곧은 선')}과 {o('굽은 선')}", "가와 다는 곧은 선, 나와 라는 굽은 선이에요.")
        self.play(lines[0].animate.set_color(BLUE), lines[2].animate.set_color(BLUE),
                  lines[1].animate.set_color(ORANGE), lines[3].animate.set_color(ORANGE), run_time=0.8)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def segment(self):
        self.section("선분")
        A, B = np.array([-3.0, 0.5, 0]), np.array([3.0, 0.5, 0])
        pa, pb = pt(A, "ㄱ"), pt(B, "ㄴ")
        self.say("점 ㄱ과 점 ㄴ을 곧게 이어요", "점 ㄱ과 점 ㄴ을 곧게 이어 볼까요?")
        self.play(FadeIn(pa), FadeIn(pb), run_time=0.5)
        seg = Line(A, B, color=BLUE, stroke_width=8)
        self.play(Create(seg), run_time=1.0)
        d = M(f"두 점을 곧게 이은 선 → {b('선분')}", 52).move_to([0, -0.9, 0])
        r = M(f"읽기: {b('선분 ㄱㄴ')} 또는 {b('선분 ㄴㄱ')}", 46).move_to([0, -1.9, 0])
        self.say(f"두 점을 곧게 이은 선을 {b('선분')}이라고 해요", "두 점을 곧게 이은 선을 선분이라고 해요.")
        self.play(FadeIn(d), run_time=0.6)
        self.say(f"{b('선분 ㄱㄴ')} 또는 {b('선분 ㄴㄱ')}", "선분 ㄱㄴ 또는 선분 ㄴㄱ이라고 읽어요. 선분은 끝이 두 점에서 멈춰요.")
        self.play(FadeIn(r), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def extend(self):
        self.section("끝없이 늘이면?")
        A, B = np.array([-1.5, 0.8, 0]), np.array([1.5, 0.8, 0])
        pa, pb = pt(A, "ㄱ"), pt(B, "ㄴ")
        seg = Line(A, B, color=BLUE, stroke_width=8)
        self.play(FadeIn(pa), FadeIn(pb), Create(seg), run_time=0.6)
        right = ValueTracker(1.5)
        left = ValueTracker(-1.5)
        col = {'c': BLUE}
        lin = always_redraw(lambda: Line([left.get_value(), 0.8, 0], [right.get_value(), 0.8, 0], color=col['c'], stroke_width=8))
        self.remove(seg); self.add(lin)
        self.bring_to_front(pa, pb)
        self.say("선분 ㄱㄴ을 ㄴ 쪽으로 끝없이 늘이면?", "선분 ㄱㄴ의 끝을 점 ㄴ 쪽으로 끝없이 늘이면 어떻게 될까요?")
        self.play(right.animate.set_value(7.5), run_time=1.6)
        d1 = M(f"한 점에서 시작해 한쪽으로 끝없이 → {o('반직선')} ㄱㄴ", 44).move_to([0, -0.4, 0])
        self.say(f"한쪽으로 끝없이 늘인 선: {o('반직선')}", "한 점에서 시작하여 한쪽으로 끝없이 뻗은 곧은 선을 반직선이라고 해요. 반직선 ㄱㄴ이에요.")
        col['c'] = ORANGE
        self.play(FadeIn(d1), run_time=0.6)
        self.wait(1.0)
        self.say("반대쪽도 끝없이 늘이면?", "이번에는 반대쪽, 점 ㄱ 쪽도 끝없이 늘여 볼까요?")
        col['c'] = GREEN
        self.play(left.animate.set_value(-7.5), run_time=1.6)
        d2 = M(f"양쪽으로 끝없이 → {g('직선')} ㄱㄴ (직선 ㄴㄱ)", 44).move_to([0, -1.4, 0])
        self.say(f"양쪽으로 끝없이 늘인 선: {g('직선')}", "양쪽으로 끝없이 뻗은 곧은 선을 직선이라고 해요. 직선 ㄱㄴ 또는 직선 ㄴㄱ이라고 읽어요.")
        self.play(FadeIn(d2), run_time=0.6)
        self.wait(1.4)
        lin.clear_updaters()
        self.settle()
        clear_stage(self, 0.6)

    def direction(self):
        self.section("반직선은 시작하는 점부터")
        A1, B1 = np.array([-3.0, 1.4, 0]), np.array([-1.0, 1.4, 0])
        A2, B2 = np.array([1.0, 1.4, 0]), np.array([3.0, 1.4, 0])
        r1 = Line(A1, A1 + RIGHT * 8.0, color=ORANGE, stroke_width=7)
        r2 = Line(B2, B2 + LEFT * 6.0, color=ORANGE, stroke_width=7)
        top = VGroup(r1, pt(A1, "ㄱ"), pt(B1, "ㄴ"))
        bot = VGroup(r2, pt(A2, "ㄱ"), pt(B2, "ㄴ")).shift(DOWN * 2.0 + LEFT * 2.0)
        t1 = M(f"{o('반직선 ㄱㄴ')}: ㄱ에서 시작", 40).move_to([4.2, 0.6, 0])
        t2 = M(f"{o('반직선 ㄴㄱ')}: ㄴ에서 시작", 40).move_to([4.2, -1.4, 0])
        self.say("반직선 ㄱㄴ과 반직선 ㄴㄱ은 같을까요?", "반직선 ㄱㄴ과 반직선 ㄴㄱ은 같을까요?")
        self.play(FadeIn(top), FadeIn(t1), run_time=0.8)
        self.play(FadeIn(bot), FadeIn(t2), run_time=0.8)
        self.say(f"시작하는 점과 뻗는 방향이 달라요", "시작하는 점과 뻗어 나가는 방향이 달라요. 그래서 반직선은 시작하는 점을 먼저 읽어요.")
        self.play(Indicate(top[1], color=ORANGE, scale_factor=1.6), Indicate(bot[2], color=ORANGE, scale_factor=1.6), run_time=1.0)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def sort(self):
        self.section("세 가지 선 비교")
        rows = [
            (Line([-5.6, 1.5, 0], [-2.6, 1.5, 0], color=BLUE, stroke_width=7), f"{b('선분')}", "두 점에서 끝나요"),
            (Line([-5.6, 0.2, 0], [-0.8, 0.2, 0], color=ORANGE, stroke_width=7), f"{o('반직선')}", "한쪽으로 끝없이"),
            (Line([-6.8, -1.1, 0], [-0.8, -1.1, 0], color=GREEN, stroke_width=7), f"{g('직선')}", "양쪽으로 끝없이"),
        ]
        from manim import Dot
        dots = VGroup(Dot([-5.6, 1.5, 0], radius=0.09, color=INK), Dot([-2.6, 1.5, 0], radius=0.09, color=INK),
                      Dot([-5.6, 0.2, 0], radius=0.09, color=INK), Dot([-3.6, 0.2, 0], radius=0.09, color=INK),
                      Dot([-4.6, -1.1, 0], radius=0.09, color=INK), Dot([-2.6, -1.1, 0], radius=0.09, color=INK))
        self.say("세 가지 선을 나란히 견주어 봐요", "선분, 반직선, 직선을 나란히 견주어 볼까요?")
        for k, (ln, nm, ds) in enumerate(rows):
            m = M(f"{nm}: {ds}", 46).move_to([3.0, ln.get_center()[1], 0])
            self.play(Create(ln), FadeIn(dots[2 * k:2 * k + 2]), FadeIn(m), run_time=0.8)
            self.wait(0.4)
        same = M(f"셋 다 {g('곧은 선')}이에요", 50).move_to([0, -2.3, 0])
        self.say(f"셋 다 {g('곧은 선')}", "다른 점은 끝이 있는지 없는지예요. 같은 점은 셋 다 곧은 선이라는 거예요.")
        self.play(FadeIn(same), run_time=0.6)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
