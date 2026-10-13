"""「수학 원리 돋보기」 8화 — 지름과 원의 성질 (2학기 3단원 원 3·4차시, 화 코드 2-3-b)

원 위의 두 점을 이은 선분을 위아래로 옮기기 → 중심을 지날 때 가장 긺 = 지름
→ 지름은 원을 똑같이 둘로 나눔(접기) → 지름은 셀 수 없이 많고 모두 같음 → 지름 = 반지름 × 2
최종: ./make_final.sh 8
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (
    DOWN, LEFT, PI, RIGHT, TAU, UP,
    Brace, Circle, Create, DashedLine, Dot, FadeIn, FadeOut, Indicate, LaggedStart, Line, Sector,
    SurroundingRectangle, ValueTracker, VGroup, Write, always_redraw,
)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, PLATE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage

UNIT = 0.5   # 1 cm를 화면에서 0.5로


class Ep08(EpisodeScene):
    EP_NO = 8
    EP_TITLE = "지름과 원의 성질"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.sweep()
        self.halves()
        self.many()
        self.double()
        self.practice()
        self.closing(f"원의 중심을 지나는 선분이 {g('지름')}, 가장 긴 선분이에요\n{g('지름')} = {b('반지름')} × 2",
                     next_preview="9화 · 컴퍼스로 원 그리기")
        self.wait(0.5)

    # ── 문제 ──
    def problem(self):
        self.section("문제")
        c = np.array([0, -0.6, 0])
        r = 1.8
        circ = Circle(radius=r, color=INK, stroke_width=6).move_to(c)
        ctr = Dot(c, radius=0.09, color=ORANGE)
        chords = VGroup(*[Line(c + r * np.array([np.cos(a1), np.sin(a1), 0]), c + r * np.array([np.cos(a2), np.sin(a2), 0]),
                               color=SOFT, stroke_width=5) for a1, a2 in ((2.6, 0.3), (3.6, 5.6), (1.2, 4.6), (2.0, 3.2))])
        self.say("원 위의 두 점을 이은 선분이 여러 개 있어요", "원 위의 두 점을 이은 선분을 여러 개 그어 보았어요.")
        self.play(Create(circ), FadeIn(ctr), run_time=0.9)
        self.play(LaggedStart(*[Create(ch) for ch in chords], lag_ratio=0.25, run_time=1.6))
        q = M(f"이 선분들 중에서 {g('특별한 선분')}은 무엇일까요?", 52).move_to([0, 2.35, 0])
        self.say(f"이 중에서 {g('특별한 선분')}은 무엇일까요?", "이 중에서 특별한 선분은 무엇일까요? 길이를 비교해 보면 어떨까요?")
        self.play(FadeIn(q, shift=DOWN * 0.2), run_time=0.7)
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    # ── 선분 옮기기 (핵심 장면) ──
    def sweep(self):
        self.section("선분을 옮겨 보기")
        c = np.array([-2.4, -0.2, 0])
        r = 2.2
        y = ValueTracker(1.9)
        circ = Circle(radius=r, color=INK, stroke_width=6).move_to(c)
        ctr = Dot(c, radius=0.09, color=ORANGE)

        def ends():
            yy = y.get_value()
            hw = np.sqrt(max(r * r - yy * yy, 0))
            return c + np.array([-hw, yy, 0]), c + np.array([hw, yy, 0])

        def is_d():
            return abs(y.get_value()) < 0.02

        chord = always_redraw(lambda: Line(*ends(), color=GREEN if is_d() else BLUE, stroke_width=9))
        pts = always_redraw(lambda: VGroup(*[Dot(p, radius=0.08, color=INK) for p in ends()]))
        # 오른쪽 길이 막대
        base = np.array([1.6, -1.3, 0])
        bar = always_redraw(lambda: Line(base, base + RIGHT * 2 * np.sqrt(max(r * r - y.get_value() ** 2, 0)),
                                         color=GREEN if is_d() else BLUE, stroke_width=16))
        bar_lab = T("선분의 길이", 36, SOFT).move_to(base + RIGHT * 2.2 + DOWN * 0.55)
        best = DashedLine(base + RIGHT * 2 * r + UP * 0.45, base + RIGHT * 2 * r + DOWN * 0.3, color=SOFT, stroke_width=3)
        self.say("가로로 그은 선분을 위아래로 옮겨 봐요", "원 위의 두 점을 이은 선분을 위아래로 옮겨 보면서 길이를 살펴볼까요?")
        self.play(Create(circ), FadeIn(ctr), run_time=0.8)
        self.play(Create(chord), FadeIn(pts), FadeIn(bar), FadeIn(bar_lab), run_time=0.8)
        self.say("아래로 내려오면 점점 길어져요", "선분이 원의 가운데로 내려올수록 점점 길어져요.")
        self.play(y.animate.set_value(0.6), run_time=2.0)
        self.play(y.animate.set_value(0.0), run_time=1.2)
        self.play(Create(best), run_time=0.4)
        self.say(f"{o('원의 중심')}을 지날 때 {g('가장 길어요')}!", "원의 중심을 지날 때 가장 길어요!")
        self.play(Indicate(ctr, color=ORANGE, scale_factor=2.2), run_time=0.9)
        self.wait(0.6)
        self.say("더 내려가면 다시 짧아져요", "더 내려가면 다시 짧아져요.")
        self.play(y.animate.set_value(-1.7), run_time=1.8)
        self.play(y.animate.set_value(0.0), run_time=1.6)
        self.wait(0.4)
        dname = M(f"원의 중심을 지나는 선분 → {g('원의 지름')}", 44)
        dname.scale_to_fit_width(min(dname.width, 6.4)).move_to([3.4, 1.4, 0])
        self.say(f"원의 중심을 지나는 선분을 {g('지름')}이라고 해요",
                 "원 위의 두 점을 이은 선분이 원의 중심을 지날 때, 이 선분을 원의 지름이라고 해요.")
        self.play(FadeIn(dname, shift=LEFT * 0.2), run_time=0.7)
        dsub = M(f"지름은 원 위의 두 점을 이은 선분 중 {g('가장 길어요')}", 36)
        dsub.scale_to_fit_width(min(dsub.width, 6.4)).move_to([3.4, 0.6, 0])
        self.play(FadeIn(dsub), run_time=0.5)
        self.wait(1.6)
        self.settle()
        for m in (chord, pts, bar):
            m.clear_updaters()
        clear_stage(self, 0.6)

    # ── 지름은 원을 둘로 똑같이 ──
    def halves(self):
        self.section("반으로 접어 보기")
        c = np.array([0, -0.1, 0])
        r = 2.0
        top = Sector(radius=r, start_angle=0, angle=PI, fill_color=PLATE, fill_opacity=1, stroke_color=INK, stroke_width=5).move_arc_center_to(c)
        bot = Sector(radius=r, start_angle=PI, angle=PI, fill_color=PLATE, fill_opacity=1, stroke_color=INK, stroke_width=5).move_arc_center_to(c)
        self.say("원 모양 종이를 똑같이 둘로 접어 볼까요?", "원 모양 종이를 똑같이 둘로 나누어지게 접어 볼까요?")
        self.play(FadeIn(top), FadeIn(bot), run_time=0.7)
        self.play(bot.animate.stretch(-1, 1, about_point=c), run_time=1.4)
        self.wait(0.4)
        self.play(bot.animate.stretch(-1, 1, about_point=c), run_time=1.0)
        fold = Line(c + LEFT * r, c + RIGHT * r, color=GREEN, stroke_width=9)
        ctr = Dot(c, radius=0.09, color=ORANGE)
        self.say(f"접힌 선은 {o('원의 중심')}을 지나는 {g('지름')}", "접힌 선을 그어 보면 원의 중심을 지나요. 바로 지름이에요.")
        self.play(Create(fold), FadeIn(ctr), run_time=0.8)
        msg = M(f"{g('지름')}은 원을 똑같이 둘로 나누어요", 50).move_to([0, 2.45, 0])
        self.play(FadeIn(msg, shift=DOWN * 0.2), run_time=0.6)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)

    # ── 지름은 셀 수 없이 많고 모두 같아요 ──
    def many(self):
        self.section("지름은 몇 개일까?")
        c = np.array([-2.6, -0.1, 0])
        r = 2.0
        circ = Circle(radius=r, color=INK, stroke_width=6).move_to(c)
        ctr = Dot(c, radius=0.09, color=ORANGE)
        self.play(Create(circ), FadeIn(ctr), run_time=0.8)
        ds = VGroup(*[Line(c + r * np.array([np.cos(a), np.sin(a), 0]), c - r * np.array([np.cos(a), np.sin(a), 0]),
                           color=GREEN, stroke_width=5) for a in np.linspace(0, PI, 9, endpoint=False)])
        self.say(f"{g('지름')}을 여러 개 그어 봐요", "원의 중심을 지나게 지름을 여러 개 그어 볼까요?")
        self.play(LaggedStart(*[Create(d) for d in ds], lag_ratio=0.2, run_time=2.2))
        t1 = M(f"한 원에서 {g('지름')}은 {b('셀 수 없이 많고')}", 42)
        t2 = M(f"길이는 {g('모두 같아요')}", 42)
        VGroup(t1, t2).arrange(DOWN, buff=0.35, aligned_edge=LEFT).move_to([3.2, 0.6, 0])
        self.say(f"지름은 {b('셀 수 없이 많고')}, 길이는 {g('모두 같아요')}",
                 "한 원에서 지름은 셀 수 없이 많이 그을 수 있고, 길이는 모두 같아요. 원의 중심은 하나뿐이에요.")
        self.play(FadeIn(t1, shift=LEFT * 0.2), run_time=0.6)
        self.play(FadeIn(t2, shift=LEFT * 0.2), run_time=0.6)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)

    # ── 지름 = 반지름 × 2 ──
    def double(self):
        self.section("지름과 반지름")
        c = np.array([-2.4, 0.2, 0])
        r = 4 * UNIT * 1.0
        circ = Circle(radius=r, color=INK, stroke_width=6).move_to(c)
        ctr = Dot(c, radius=0.09, color=ORANGE)
        r1 = Line(c + LEFT * r, c, color=BLUE, stroke_width=9)
        r2 = Line(c, c + RIGHT * r, color=BLUE, stroke_width=9)
        self.play(Create(circ), FadeIn(ctr), run_time=0.8)
        self.say(f"{g('지름')}을 원의 중심에서 둘로 나누면?", "지름을 원의 중심에서 둘로 나누어 보면 어떻게 될까요?")
        self.play(Create(r1), Create(r2), run_time=1.0)
        b1 = Brace(r1, UP, color=BLUE)
        b2 = Brace(r2, UP, color=BLUE)
        l1 = T("반지름", 34, BLUE).next_to(b1, UP, buff=0.1)
        l2 = T("반지름", 34, BLUE).next_to(b2, UP, buff=0.1)
        self.say(f"{b('반지름')} 2개가 이어져 있어요", "중심에서 양쪽으로 반지름이 하나씩, 반지름 2개가 이어져 있어요.")
        self.play(FadeIn(b1), FadeIn(l1), FadeIn(b2), FadeIn(l2), run_time=0.8)
        bd = Brace(VGroup(r1, r2), DOWN, color=GREEN)
        ld = T("지름", 38, GREEN).next_to(bd, DOWN, buff=0.1)
        self.play(FadeIn(bd), FadeIn(ld), run_time=0.6)
        rule = M(f"{g('지름')} = {b('반지름')} × 2", 64)
        bg = SurroundingRectangle(rule, color=GREEN, buff=0.25, stroke_width=6, corner_radius=0.2).set_fill(PAPER, 1)
        VGroup(bg, rule).scale_to_fit_width(5.4).move_to([3.5, 1.2, 0])
        self.say(f"{g('지름')} = {b('반지름')} × 2", "그래서 지름은 반지름의 2배예요.")
        self.play(FadeIn(bg), Write(rule), run_time=1.0)
        rule2 = M(f"{b('반지름')} = {g('지름')} ÷ 2", 52).move_to([3.4, -0.2, 0])
        self.say(f"거꾸로 {b('반지름')}은 {g('지름')}의 반", "거꾸로 반지름은 지름을 반으로 나눈 길이예요.")
        self.play(FadeIn(rule2, shift=UP * 0.2), run_time=0.6)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)

    # ── 연습 ──
    def practice(self):
        self.section("문제로 확인하기")
        qs = [
            (f"반지름이 {b('5 cm')}인 원의 지름은?", f"5 × 2 = {g('10 cm')}", "반지름이 5센티미터인 원의 지름은? 5 곱하기 2, 10센티미터예요."),
            (f"지름이 {g('8 cm')}인 원의 반지름은?", f"8 ÷ 2 = {b('4 cm')}", "지름이 8센티미터인 원의 반지름은? 8 나누기 2, 4센티미터예요."),
        ]
        ys = [1.5, -0.9]
        for (qq, aa, nar), yy in zip(qs, ys):
            qm = M(qq, 56).move_to([0, yy + 0.4, 0])
            am = M(aa, 56).move_to([0, yy - 0.5, 0])
            self.say(qq, nar.split("?")[0] + "?")
            self.play(FadeIn(qm, shift=UP * 0.2), run_time=0.6)
            self.wait(2.0)
            self.say(aa, nar.split("?")[1].strip())
            self.play(FadeIn(am, scale=1.2), run_time=0.6)
            self.wait(1.0)
        self.settle()
        clear_stage(self, 0.5)
        # 도전: 큰 원 안 작은 원 두 개
        cb = np.array([-2.6, -0.2, 0])
        big = Circle(radius=2.0, color=INK, stroke_width=6).move_to(cb)
        s1 = Circle(radius=1.0, color=BLUE, stroke_width=5).move_to(cb + UP * 1.0)
        s2 = Circle(radius=1.0, color=BLUE, stroke_width=5).move_to(cb + DOWN * 1.0)
        q = M(f"작은 원의 반지름이 {b('2 cm')}일 때\n큰 원의 지름은?", 50)
        q.scale_to_fit_width(min(q.width, 5.8)).move_to([3.4, 1.3, 0])
        self.say(f"도전! 작은 원의 반지름이 {b('2 cm')}일 때 큰 원의 지름은?",
                 "도전 문제! 큰 원 안에 반지름이 2센티미터인 작은 원 2개가 꼭 맞게 들어 있어요. 큰 원의 지름은 몇 센티미터일까요?")
        self.play(Create(big), Create(s1), Create(s2), FadeIn(q), run_time=1.2)
        self.wait(2.5)
        rs = VGroup(*[Line(cb + UP * (2.0 - k * 1.0), cb + UP * (1.0 - k * 1.0), color=BLUE, stroke_width=8) for k in range(4)])
        self.play(LaggedStart(*[Create(x) for x in rs], lag_ratio=0.3, run_time=1.4))
        a = M(f"{b('2 cm')} × 4 = {g('8 cm')}", 56).move_to([3.4, -0.6, 0])
        self.say(f"작은 원의 반지름 4개 → {g('8 cm')}", "큰 원의 지름에는 작은 원의 반지름이 4개 들어가요. 2 곱하기 4, 8센티미터예요.")
        self.play(FadeIn(a, scale=1.2), run_time=0.7)
        self.wait(2.0)
        self.settle()
        clear_stage(self, 0.7)
        self.hide_chip()
