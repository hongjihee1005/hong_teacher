"""「수학 원리 돋보기」 7화 — 원의 중심과 반지름 (2학기 3단원 원 2차시, 화 코드 2-3-a)

손으로 그린 원 vs 정확한 원 → 끈과 단추 돌리기(중심은 그대로, 끈 길이는 그대로) → 누름 못과 띠 종이
→ 약속: 원의 중심·반지름 → 반지름 찾기 → 한 원에서 반지름은 모두 같아요
최종: ./make_final.sh 7
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (
    DOWN, LEFT, PI, RIGHT, TAU, UP,
    Circle, Create, Dot, FadeIn, FadeOut, Indicate, LaggedStart, Line, ParametricFunction, Rectangle,
    RoundedRectangle, SurroundingRectangle, TracedPath, ValueTracker, VGroup, Write, always_redraw, linear,
)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from items import check_mark, cross_mark


def pin(c):
    return VGroup(Dot(c, radius=0.11, color=ORANGE), Circle(radius=0.17, color=INK, stroke_width=3).move_to(c))


class Ep07(EpisodeScene):
    EP_NO = 7
    EP_TITLE = "원의 중심과 반지름"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.string_spin()
        self.band()
        self.promise()
        self.find()
        self.closing(f"원을 그릴 때 움직이지 않는 점이 {o('원의 중심')}\n중심과 원 위의 한 점을 이은 선분이 {b('반지름')}",
                     next_preview="8화 · 지름과 원의 성질")
        self.wait(0.5)

    # ── 문제 ──
    def problem(self):
        self.section("문제")
        c1 = np.array([-3.3, -0.55, 0])
        wob = ParametricFunction(lambda t: c1 + np.array([(1.4 + 0.15 * np.sin(3 * t) + 0.1 * np.cos(5 * t + 1)) * np.cos(t),
                                                          (1.4 + 0.15 * np.sin(3 * t) + 0.1 * np.cos(5 * t + 1)) * np.sin(t) * 0.92, 0]),
                                 t_range=[0, TAU * 0.97], color=INK, stroke_width=6)
        good = Circle(radius=1.4, color=INK, stroke_width=6).move_to([3.3, -0.55, 0])
        l1 = T("손으로 그린 원", 40, SOFT).next_to(wob, DOWN, buff=0.35)
        l2 = T("정확한 원", 40, SOFT).next_to(good, DOWN, buff=0.35)
        self.say("손으로 그린 원은 울퉁불퉁해요", "운동장에 큰 원을 그리려고 해요. 손으로 그리면 원이 울퉁불퉁해져요.")
        self.play(Create(wob), FadeIn(l1), run_time=1.6)
        self.say("이렇게 정확한 원을 그리려면?", "이렇게 정확하고 동그란 원을 그리려면 어떻게 해야 할까요?")
        self.play(Create(good), FadeIn(l2), run_time=1.4)
        self.wait(0.6)
        q = M(f"원을 정확하게 그리려면\n{o('무엇이 움직이지 않아야')} 할까요?", 48).move_to([0, 2.35, 0])
        self.say("무엇이 움직이지 않아야 할까요?", "원을 정확하게 그리려면 무엇이 움직이지 않아야 할까요?")
        self.play(FadeIn(q, shift=DOWN * 0.2), run_time=0.8)
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    # ── 끈과 단추 (핵심 장면) ──
    def string_spin(self):
        self.section("끈을 잡고 돌려 보기")
        c = np.array([-1.5, 0.15, 0])
        r = 2.1
        ang = ValueTracker(0.0)

        def pos():
            a = ang.get_value()
            return c + r * np.array([np.cos(a), np.sin(a), 0])

        trace = TracedPath(pos, stroke_color=INK, stroke_width=6)
        string = always_redraw(lambda: Line(c, pos(), color=BLUE, stroke_width=7))
        button = always_redraw(lambda: VGroup(Circle(radius=0.2, fill_color=ORANGE, fill_opacity=1, stroke_color=INK,
                                                     stroke_width=3).move_to(pos()),
                                              Dot(pos() + LEFT * 0.06, radius=0.03, color=INK),
                                              Dot(pos() + RIGHT * 0.06, radius=0.03, color=INK)))
        hold = pin(c)
        self.say(f"끈 한쪽 끝을 손으로 {o('꼭 잡고')}", "끈 한쪽 끝에 단추를 묶고, 다른 쪽 끝을 손가락으로 꼭 잡아요.")
        self.add(trace)
        self.play(Create(string), FadeIn(button), FadeIn(hold), run_time=0.9)
        hand = T("꼭 잡은 곳", 36, ORANGE).next_to(hold, DOWN, buff=0.2)
        self.play(FadeIn(hand), run_time=0.4)
        self.wait(0.6)
        self.say("단추를 한 바퀴 돌려요", "끈이 팽팽하게 단추를 한 바퀴 돌려 볼까요?")
        self.play(ang.animate.set_value(TAU), run_time=5.0, rate_func=linear)
        self.wait(0.6)
        note = VGroup(M(f"① 잡은 곳은 {o('움직이지 않아요')}", 44), M(f"② 끈의 길이는 {b('변하지 않아요')}", 44))
        note.arrange(DOWN, aligned_edge=LEFT, buff=0.35).move_to([4.2, 0.6, 0])
        self.say(f"동그란 원이 그려졌어요!", "동그란 원이 그려졌어요! 원을 그리는 동안 무엇이 그대로였나요?")
        self.wait(0.4)
        self.say(f"잡은 곳은 {o('그대로')}, 끈의 길이도 {b('그대로')}",
                 "손으로 잡은 곳은 움직이지 않았고, 끈의 길이도 변하지 않았어요.")
        self.play(FadeIn(note[0], shift=LEFT * 0.2), Indicate(hold, color=ORANGE, scale_factor=1.5), run_time=0.9)
        self.play(FadeIn(note[1], shift=LEFT * 0.2), run_time=0.6)
        for a in (PI * 0.7, PI * 1.35, PI * 2 + PI * 0.15):
            self.play(ang.animate.set_value(a), run_time=0.8)
            self.play(Indicate(string, color=BLUE, scale_factor=1.05), run_time=0.5)
        self.wait(1.4)
        self.settle()
        trace.clear_updaters()
        string.clear_updaters()
        button.clear_updaters()
        clear_stage(self, 0.6)

    # ── 누름 못과 띠 종이 ──
    def band(self):
        self.section("누름 못과 띠 종이")
        c = np.array([-2.0, 0.0, 0])
        unit = 0.62
        ang = ValueTracker(PI / 6)
        hole = ValueTracker(2)

        def tip():
            a = ang.get_value()
            return c + hole.get_value() * unit * np.array([np.cos(a), np.sin(a), 0])

        def band_m():
            a = ang.get_value()
            body = RoundedRectangle(corner_radius=0.12, width=5.6 * unit + 0.5, height=0.42, fill_color=PAPER, fill_opacity=1,
                                    stroke_color=SOFT, stroke_width=3)
            holes = VGroup(*[Circle(radius=0.07, color=INK, stroke_width=2.5).move_to([k * unit, 0, 0]) for k in range(1, 6)])
            nums = VGroup(*[T(str(k), 22, SOFT).move_to([k * unit, -0.4, 0]) for k in range(1, 6)])
            grp = VGroup(body, holes, nums)
            body.move_to([2.8 * unit, 0, 0])
            grp.rotate(a, about_point=np.array([0, 0, 0])).shift(c)
            return grp

        bnd = always_redraw(band_m)
        pencil = always_redraw(lambda: Dot(tip(), radius=0.1, color=BLUE))
        pp = pin(c)
        self.say("띠 종이 한쪽을 누름 못으로 고정해요", "띠 종이의 한쪽 끝에 누름 못을 꽂아 고정해요. 누름 못은 끝이 뾰족하니 조심해요.")
        self.play(FadeIn(bnd), FadeIn(pp), run_time=0.8)
        self.say(f"{b('2번')} 구멍에 연필을 꽂고 돌리면", "2번 구멍에 연필을 꽂고 띠 종이를 한 바퀴 돌려 볼까요?")
        self.add(pencil)
        tr1 = TracedPath(tip, stroke_color=INK, stroke_width=5)
        self.add(tr1)
        self.play(ang.animate.set_value(PI / 6 + TAU), run_time=3.5, rate_func=linear)
        tr1.clear_updaters()
        self.say(f"이번에는 {b('4번')} 구멍에 꽂으면?", "이번에는 4번 구멍에 연필을 꽂아 돌리면 어떤 원이 될까요?")
        self.play(hole.animate.set_value(4), run_time=0.6)
        tr2 = TracedPath(tip, stroke_color=INK, stroke_width=5)
        self.add(tr2)
        self.play(ang.animate.set_value(PI / 6 + 2 * TAU), run_time=4.0, rate_func=linear)
        tr2.clear_updaters()
        self.play(ang.animate.set_value(PI / 6 + 2 * TAU + PI * 0.25), run_time=0.6)
        msg = VGroup(M(f"누름 못과 연필 사이가 {b('멀수록')}", 44), M(f"원이 {g('커져요')}", 44)).arrange(DOWN, buff=0.3)
        msg.move_to([4.3, 0.4, 0])
        self.say(f"못과 연필 사이가 {b('멀수록')} 원이 {g('커져요')}", "누름 못과 연필 구멍 사이가 멀수록 원이 커져요.")
        self.play(FadeIn(msg, shift=LEFT * 0.2), run_time=0.7)
        self.wait(1.6)
        self.settle()
        bnd.clear_updaters()
        pencil.clear_updaters()
        clear_stage(self, 0.6)

    # ── 약속: 원의 중심, 반지름 ──
    def promise(self):
        self.section("약속: 원의 중심과 반지름")
        c = np.array([-2.6, 0.0, 0])
        r = 2.0
        circ = Circle(radius=r, color=INK, stroke_width=6).move_to(c)
        ctr = Dot(c, radius=0.1, color=ORANGE)
        lab_c = T("ㅇ", 40, INK).next_to(ctr, DOWN + LEFT, buff=0.08)
        self.play(Create(circ), run_time=1.0)
        d1 = M(f"누름 못을 꽂았던 점 → {o('원의 중심')}", 40)
        d1.scale_to_fit_width(min(d1.width, 6.2)).move_to([3.45, 1.7, 0])
        self.say(f"누름 못을 꽂았던 점을 {o('원의 중심')}이라고 해요", "원을 그릴 때 누름 못을 꽂았던 점을 원의 중심이라고 해요.")
        self.play(FadeIn(ctr, scale=2), FadeIn(lab_c), FadeIn(d1, shift=LEFT * 0.2), run_time=0.9)
        self.wait(0.8)
        p = c + r * np.array([np.cos(PI / 5), np.sin(PI / 5), 0])
        rad = Line(c, p, color=BLUE, stroke_width=8)
        dp = Dot(p, radius=0.08, color=BLUE)
        d2 = M(f"원의 중심과 원 위의 한 점을 이은 선분\n→ {b('원의 반지름')}", 40)
        d2.scale_to_fit_width(min(d2.width, 6.2)).move_to([3.45, 0.15, 0])
        self.say(f"중심과 원 위의 한 점을 이은 선분은 {b('반지름')}", "원의 중심과 원 위의 한 점을 이은 선분을 원의 반지름이라고 해요.")
        self.play(Create(rad), FadeIn(dp), FadeIn(d2, shift=LEFT * 0.2), run_time=1.0)
        self.wait(1.0)
        # 반지름 여러 개
        self.say(f"{b('반지름')}은 몇 개나 그을 수 있을까요?", "반지름은 몇 개나 그을 수 있을까요? 원 위의 점은 어디든 괜찮아요.")
        more = VGroup(*[Line(c, c + r * np.array([np.cos(a), np.sin(a), 0]), color=BLUE, stroke_width=5)
                        for a in np.linspace(PI / 5 + TAU / 12, PI / 5 + TAU - TAU / 12, 11)])
        self.play(LaggedStart(*[Create(m) for m in more], lag_ratio=0.12, run_time=2.0))
        d3 = M(f"한 원에서 반지름은 {b('셀 수 없이 많고')}\n길이는 {g('모두 같아요')}", 40)
        d3.scale_to_fit_width(min(d3.width, 6.2)).move_to([3.45, -1.55, 0])
        self.say(f"반지름은 {b('셀 수 없이 많고')}, 길이는 {g('모두 같아요')}",
                 "한 원에서 반지름은 셀 수 없이 많이 그을 수 있고, 그 길이는 모두 같아요. 끈의 길이가 변하지 않았던 것처럼요.")
        self.play(FadeIn(d3, shift=LEFT * 0.2), run_time=0.7)
        self.play(*[m.animate.set_stroke(width=8) for m in more], run_time=0.5)
        self.play(*[m.animate.set_stroke(width=5) for m in more], run_time=0.5)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)

    # ── 반지름 찾기 ──
    def find(self):
        self.section("반지름을 찾아라")
        c = np.array([-3.0, -0.1, 0])
        r = 2.0

        def P(deg):
            a = np.deg2rad(deg)
            return c + r * np.array([np.cos(a), np.sin(a), 0])

        circ = Circle(radius=r, color=INK, stroke_width=6).move_to(c)
        ctr = Dot(c, radius=0.09, color=ORANGE)
        lab_c = T("ㅇ", 34, INK).next_to(ctr, DOWN, buff=0.1)
        pts = {"ㄱ": 150, "ㄴ": 200, "ㄷ": 265, "ㄹ": 330, "ㅂ": 70}
        dots = VGroup(*[Dot(P(d), radius=0.07, color=INK) for d in pts.values()])
        labs = VGroup(*[T(k, 34).move_to(c + (r + 0.35) * np.array([np.cos(np.deg2rad(d)), np.sin(np.deg2rad(d)), 0]))
                        for k, d in pts.items()])
        segs = [("ㄴ", "ㅇ"), ("ㅂ", "ㅇ"), ("ㄱ", "ㅂ"), ("ㄷ", "ㄹ")]

        def at(k):
            return c if k == "ㅇ" else P(pts[k])

        lines = VGroup(*[Line(at(a), at(z), color=SOFT, stroke_width=6) for a, z in segs])
        names = [f"선분 {a}{z}" for a, z in segs]
        opts = VGroup(*[T(nm, 44) for nm in names]).arrange(DOWN, aligned_edge=LEFT, buff=0.45).move_to([2.6, 0.0, 0])
        self.say("반지름을 모두 찾아보세요", "그림에서 원의 반지름을 모두 찾아보세요.")
        self.play(Create(circ), FadeIn(ctr), FadeIn(lab_c), FadeIn(dots), FadeIn(labs), run_time=1.0)
        self.play(LaggedStart(*[Create(l) for l in lines], lag_ratio=0.2, run_time=1.4), FadeIn(opts), run_time=1.4)
        self.wait(2.5)
        self.say(f"원의 중심 {o('ㅇ')}과 이어졌는지 보세요", "힌트! 원의 중심 ㅇ과 원 위의 점을 이었는지 살펴보세요.")
        self.play(Indicate(ctr, color=ORANGE, scale_factor=2.0), run_time=0.9)
        self.wait(1.2)
        marks = VGroup()
        for i, (a, z) in enumerate(segs):
            ok = "ㅇ" in (a, z)
            self.play(lines[i].animate.set_color(BLUE if ok else SOFT).set_stroke(width=9 if ok else 6), run_time=0.4)
            mk = (check_mark(0.5) if ok else cross_mark(0.4)).next_to(opts[i], RIGHT, buff=0.35)
            marks.add(mk)
            self.play(Create(mk), run_time=0.4)
        self.say(f"{b('선분 ㄴㅇ')}과 {b('선분 ㅂㅇ')}이 반지름!",
                 "선분 ㄴㅇ과 선분 ㅂㅇ이 반지름이에요. 선분 ㄱㅂ과 선분 ㄷㄹ은 원의 중심과 이어져 있지 않으니 반지름이 아니에요.")
        self.play(opts[0].animate.set_color(BLUE), opts[1].animate.set_color(BLUE), run_time=0.5)
        self.wait(2.0)
        self.settle()
        clear_stage(self, 0.7)
        self.hide_chip()
