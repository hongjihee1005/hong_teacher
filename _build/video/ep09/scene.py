"""「수학 원리 돋보기」 9화 — 컴퍼스로 원 그리기 (2학기 3단원 원 5·6차시, 화 코드 2-3-c)

크기가 같은 원 여러 개 → 컴퍼스 세 단계(중심 정하기 → 반지름만큼 벌리기 → 침 꽂고 돌리기)
→ 지름 6 cm이면 3 cm 벌리기 → 같은 크기 원 옮겨 그리기 → 규칙 있는 원 모양(과녁, 옆으로 옮기기)
최종: ./make_final.sh 9
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (
    DOWN, LEFT, PI, RIGHT, TAU, UP,
    Circle, Create, DashedVMobject, Dot, FadeIn, FadeOut, Indicate, LaggedStart, Line, Polygon,
    Rectangle, RoundedRectangle, SurroundingRectangle, TracedPath, ValueTracker, VGroup, Write,
    always_redraw, linear,
)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from items import check_mark, cross_mark

CM = 0.75   # 1 cm = 화면 0.75


def compass(center, tip, lift=1.6):
    """옆에서 본 컴퍼스: 침(주황)은 center, 연필(파랑)은 tip"""
    mid = (center + tip) / 2
    hinge = mid + UP * lift
    leg1 = Line(hinge, center, color=INK, stroke_width=7)
    leg2 = Line(hinge, tip + UP * 0.25, color=INK, stroke_width=7)
    needle = Line(center + UP * 0.22, center, color=ORANGE, stroke_width=5)
    d = tip - (tip + UP * 0.25)
    pencil = Polygon(tip + UP * 0.45 + LEFT * 0.08, tip + UP * 0.45 + RIGHT * 0.08, tip, color=BLUE,
                     fill_color=BLUE, fill_opacity=1, stroke_width=2)
    head = Circle(radius=0.12, color=INK, fill_color=PAPER, fill_opacity=1, stroke_width=4).move_to(hinge)
    handle = Line(hinge, hinge + UP * 0.35, color=INK, stroke_width=8)
    return VGroup(leg1, leg2, needle, pencil, handle, head)


def ruler(origin, n=7):
    body = Rectangle(width=n * CM + 0.3, height=0.55, fill_color="#F3E3B5", fill_opacity=1, stroke_color=SOFT, stroke_width=3)
    body.move_to(origin + RIGHT * (n * CM / 2) + DOWN * 0.27)
    ticks = VGroup()
    for k in range(n * 10 + 1):
        x = origin[0] + k * CM / 10
        h = 0.22 if k % 10 == 0 else (0.14 if k % 5 == 0 else 0.08)
        ticks.add(Line([x, origin[1], 0], [x, origin[1] - h, 0], color=INK, stroke_width=2 if k % 10 else 3))
    nums = VGroup(*[T(str(k), 22).move_to([origin[0] + k * CM, origin[1] - 0.4, 0]) for k in range(n + 1)])
    return VGroup(body, ticks, nums)


class Ep09(EpisodeScene):
    EP_NO = 9
    EP_TITLE = "컴퍼스로 원 그리기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.steps()
        self.diameter6()
        self.copy_circle()
        self.patterns()
        self.closing(f"① {o('원의 중심')} 정하기 → ② {b('반지름')}만큼 벌리기\n→ ③ 침을 꽂고 한 번에 돌리기",
                     next_preview="10화 · 12의 3분의 2는 몇 개일까?")
        self.wait(0.5)

    # ── 문제 ──
    def problem(self):
        self.section("문제")
        circles = VGroup(*[Circle(radius=0.75, color=INK, stroke_width=5) for _ in range(5)]).arrange(RIGHT, buff=0.35)
        circles.move_to([0, -0.4, 0])
        q = M(f"크기가 {b('같은')} 원을 여러 개\n{g('빠르고 정확하게')} 그리려면 어떻게 할까요?", 52).move_to([0, 2.0, 0])
        self.say("크기가 같은 원 5개가 필요해요", "꾸미기 활동에 크기가 똑같은 원 5개가 필요해요.")
        self.play(LaggedStart(*[Create(c) for c in circles], lag_ratio=0.2, run_time=1.6))
        self.say("빠르고 정확하게 그리려면?", "크기가 같은 원을 여러 개, 빠르고 정확하게 그리려면 어떻게 해야 할까요?")
        self.play(Write(q), run_time=1.4)
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    # ── 컴퍼스로 원 그리기 세 단계 (핵심 장면) ──
    def steps(self):
        self.section("컴퍼스로 원 그리기")
        safe = M(f"안전 약속: 침 끝이 친구를 향하지 않게,\n다 쓰면 다리를 오므려요", 42)
        bg = RoundedRectangle(corner_radius=0.25, width=safe.width + 0.7, height=safe.height + 0.5, fill_color=PAPER,
                              fill_opacity=1, stroke_color=ORANGE, stroke_width=5)
        VGroup(bg, safe).move_to([0, 0.4, 0])
        self.say(f"{o('컴퍼스')}를 써요! 먼저 안전 약속", "컴퍼스를 쓰면 돼요. 컴퍼스의 침은 뾰족하니 먼저 안전 약속을 지켜요.")
        self.play(FadeIn(bg), Write(safe), run_time=1.2)
        self.wait(2.0)
        self.play(FadeOut(VGroup(bg, safe)), run_time=0.4)

        steps = VGroup(M(f"① {o('원의 중심')}이 될 점 정하기", 40),
                       M(f"② {b('반지름')}만큼 컴퍼스 벌리기", 40),
                       M(f"③ 침을 꽂고 한 번에 돌리기", 40)).arrange(DOWN, aligned_edge=LEFT, buff=0.4)
        steps.move_to([3.7, 1.3, 0])
        # ① 점 정하기
        c = np.array([-2.6, -0.4, 0])
        dot = Dot(c, radius=0.09, color=ORANGE)
        lab = T("ㅇ", 34).next_to(dot, DOWN + LEFT, buff=0.06)
        self.say(f"① {o('원의 중심')}이 될 점을 정해요", "첫째, 원의 중심이 될 점 ㅇ을 정해요.")
        self.play(FadeIn(steps[0], shift=LEFT * 0.2), FadeIn(dot, scale=2), FadeIn(lab), run_time=0.8)
        self.wait(0.8)
        # ② 자에 대고 벌리기
        org = np.array([-6.2, 2.3, 0])
        rl = ruler(org, 7)
        r_val = ValueTracker(0.5)
        cmp_r = always_redraw(lambda: compass(org + DOWN * 0.02, org + DOWN * 0.02 + RIGHT * r_val.get_value() * CM, lift=1.0))
        self.say(f"② 자에 대고 {b('2 cm')}만큼 벌려요", "둘째, 반지름이 2센티미터인 원을 그리려면 자에 대고 컴퍼스를 2센티미터만큼 벌려요.")
        self.play(FadeIn(steps[1], shift=LEFT * 0.2), FadeIn(rl), FadeIn(cmp_r), run_time=0.8)
        self.play(r_val.animate.set_value(2.0), run_time=1.4)
        two = T("2 cm", 34, BLUE).move_to(org + RIGHT * CM + DOWN * 0.95)
        self.play(FadeIn(two), Indicate(rl[2][2], color=BLUE, scale_factor=1.6), run_time=0.7)
        self.wait(0.6)
        cmp_r.clear_updaters()
        self.play(FadeOut(VGroup(rl, two)), cmp_r.animate.shift(c - org), run_time=0.9)
        self.remove(cmp_r)
        # ③ 침 꽂고 돌리기
        ang = ValueTracker(0.0)

        def tip():
            a = ang.get_value()
            return c + 2 * CM * np.array([np.cos(a), np.sin(a) * 0.999, 0])

        cmp = always_redraw(lambda: compass(c, tip(), lift=1.0))
        trace = TracedPath(tip, stroke_color=INK, stroke_width=6)
        self.add(cmp, trace)
        self.say(f"③ 침을 {o('ㅇ')}에 꽂고 한 번에 돌려요", "셋째, 침을 점 ㅇ에 꽂고, 벌린 정도를 그대로 둔 채 한 번에 돌려요.")
        self.play(FadeIn(steps[2], shift=LEFT * 0.2), run_time=0.5)
        self.play(ang.animate.set_value(TAU), run_time=3.2, rate_func=linear)
        trace.clear_updaters()
        cmp.clear_updaters()
        self.play(FadeOut(cmp), run_time=0.4)
        rad = Line(c, c + RIGHT * 2 * CM, color=BLUE, stroke_width=7)
        rl2 = T("2 cm", 32, BLUE).next_to(rad, UP, buff=0.08)
        self.say(f"반지름이 {b('2 cm')}인 원 완성!", "반지름이 2센티미터인 원을 그렸어요!")
        self.play(Create(rad), FadeIn(rl2), run_time=0.7)
        tips = M(f"침 쪽에 힘을 주고, {b('벌린 정도는 그대로')}", 38).move_to([3.7, -1.2, 0])
        self.play(FadeIn(tips), run_time=0.5)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)

    # ── 지름이 6 cm인 원 ──
    def diameter6(self):
        self.section("지름이 주어지면?")
        D = 0.3
        q = M(f"{g('지름')}이 6 cm인 원을 그리려면 컴퍼스를 몇 cm 벌릴까요?", 46)
        q.scale_to_fit_width(min(q.width, 11.5)).move_to([0, 2.4, 0])
        self.say(f"{g('지름')}이 6 cm인 원을 그리려면?", "이번에는 지름이 6센티미터인 원을 그려 볼까요? 컴퍼스를 몇 센티미터 벌려야 할까요?")
        self.play(FadeIn(q), run_time=0.7)
        self.wait(1.5)
        cl = np.array([-3.4, 0.0, 0])
        big = Circle(radius=6 * D, color=SOFT, stroke_width=5).move_to(cl)
        bl = Line(cl, cl + RIGHT * 6 * D, color=SOFT, stroke_width=6)
        bt = T("6 cm 벌림", 32, SOFT).next_to(big, DOWN, buff=0.15)
        x1 = cross_mark(0.5).next_to(big, UP + RIGHT, buff=-0.2)
        self.say("6 cm 벌리면 반지름이 6 cm가 돼요", "6센티미터 벌리면 반지름이 6센티미터, 지름은 12센티미터인 원이 돼요.")
        self.play(Create(big), Create(bl), FadeIn(bt), run_time=1.0)
        self.play(Create(x1), run_time=0.4)
        cr = np.array([3.3, 0.0, 0])
        sm = Circle(radius=3 * D, color=INK, stroke_width=6).move_to(cr)
        dl = Line(cr + LEFT * 3 * D, cr + RIGHT * 3 * D, color=GREEN, stroke_width=7)
        rl = Line(cr, cr + RIGHT * 3 * D, color=BLUE, stroke_width=9)
        st = M(f"6 ÷ 2 = {b('3 cm')} 벌림", 38).next_to(sm, DOWN, buff=0.2)
        self.say(f"{g('지름')} 6 cm의 반, {b('3 cm')}만큼 벌려요", "지름이 6센티미터이면 반지름은 그 반인 3센티미터. 컴퍼스를 3센티미터 벌려요.")
        self.play(Create(sm), Create(dl), run_time=1.0)
        self.play(Create(rl), FadeIn(st), run_time=0.7)
        ok = check_mark(0.6).next_to(sm, UP + RIGHT, buff=-0.1)
        self.play(Create(ok), run_time=0.4)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)

    # ── 같은 크기 원 옮겨 그리기 ──
    def copy_circle(self):
        self.section("같은 크기 원 그리기")
        c1 = np.array([-3.3, -0.3, 0])
        c2 = np.array([2.6, -0.3, 0])
        r = 2.0 * CM
        given = Circle(radius=r, color=INK, stroke_width=6).move_to(c1)
        g1 = Dot(c1, radius=0.08, color=ORANGE)
        d2 = Dot(c2, radius=0.08, color=ORANGE)
        l2 = T("ㅇ", 32).next_to(d2, DOWN + LEFT, buff=0.06)
        self.say("왼쪽 원과 크기가 같은 원을 점 ㅇ에 그려요", "왼쪽 원과 크기가 같은 원을 점 ㅇ을 중심으로 그려 볼까요?")
        self.play(Create(given), FadeIn(g1), FadeIn(d2), FadeIn(l2), run_time=1.0)
        cm1 = compass(c1, c1 + RIGHT * r, lift=1.0)
        self.say(f"침은 {o('원의 중심')}에, 연필은 {b('원 위')}에 맞춰요",
                 "컴퍼스의 침을 원의 중심에 꽂고, 연필 끝이 원에 닿게 벌려요. 이것이 반지름이에요.")
        self.play(FadeIn(cm1), run_time=0.6)
        self.wait(0.8)
        self.say(f"벌린 그대로 옮겨서 돌려요", "벌린 정도를 그대로 두고 점 ㅇ으로 옮겨서 돌려요.")
        self.play(cm1.animate.shift(c2 - c1), run_time=1.1)
        self.remove(cm1)
        ang = ValueTracker(0.0)

        def tip():
            a = ang.get_value()
            return c2 + r * np.array([np.cos(a), np.sin(a), 0])

        cm2 = always_redraw(lambda: compass(c2, tip(), lift=1.0))
        tr = TracedPath(tip, stroke_color=INK, stroke_width=6)
        self.add(cm2, tr)
        self.play(ang.animate.set_value(TAU), run_time=2.8, rate_func=linear)
        tr.clear_updaters()
        cm2.clear_updaters()
        self.play(FadeOut(cm2), run_time=0.4)
        msg = M(f"크기가 같은 원 완성! {g('반지름이 같으면')} 크기가 같아요", 42).move_to([0, 2.3, 0])
        self.play(FadeIn(msg), run_time=0.5)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)

    # ── 규칙 있는 원 모양 ──
    def patterns(self):
        self.section("규칙을 찾아 그리기")
        # 모눈
        cell = 0.32
        grid = VGroup()
        x0, x1, y0, y1 = -6.6, 6.6, -2.3, 2.3
        for i in range(int((x1 - x0) / cell) + 1):
            grid.add(Line([x0 + i * cell, y0, 0], [x0 + i * cell, y1, 0], color="#E6DDCC", stroke_width=1.5))
        for j in range(int((y1 - y0) / cell) + 1):
            grid.add(Line([x0, y0 + j * cell, 0], [x1, y0 + j * cell, 0], color="#E6DDCC", stroke_width=1.5))
        self.play(FadeIn(grid), run_time=0.5)
        # 과녁
        ct = np.array([-4.2, 0.7, 0])
        rings = VGroup(*[Circle(radius=k * cell, color=INK, stroke_width=5).move_to(ct) for k in (2, 3, 4)])
        cd = Dot(ct, radius=0.07, color=ORANGE)
        self.say("과녁 모양에는 어떤 규칙이 있을까요?", "과녁 모양을 보세요. 어떤 규칙이 있을까요?")
        self.play(LaggedStart(*[Create(rg) for rg in rings], lag_ratio=0.3, run_time=1.4), FadeIn(cd))
        self.wait(1.0)
        t1 = M(f"{o('원의 중심')}은 같고\n{b('반지름')}만 1칸씩 커져요", 34).next_to(rings, DOWN, buff=0.25)
        self.say(f"{o('원의 중심')}은 같고 {b('반지름')}만 1칸씩 커져요", "원의 중심은 모두 같고, 반지름만 2칸, 3칸, 4칸으로 1칸씩 커져요.")
        self.play(FadeIn(t1), run_time=0.6)
        self.wait(1.0)
        # 옆으로 옮기기
        r = 2 * cell
        cs = [np.array([-1.6 + k * 3 * cell * 1.0, 0.6, 0]) for k in range(4)]
        row = VGroup(*[Circle(radius=r, color=INK, stroke_width=5).move_to(p) for p in cs[:3]])
        dots = VGroup(*[Dot(p, radius=0.06, color=ORANGE) for p in cs[:3]])
        self.say("이번에는 원이 옆으로 이어져요", "이번에는 원이 옆으로 이어져요. 다음 원은 어디에 그릴까요?")
        self.play(LaggedStart(*[Create(c) for c in row], lag_ratio=0.3, run_time=1.4), FadeIn(dots))
        self.wait(1.5)
        arrows = VGroup(*[Line(cs[k] + DOWN * 0.95, cs[k + 1] + DOWN * 0.95, color=ORANGE, stroke_width=5) for k in range(3)])
        t2 = M(f"{o('원의 중심')}이 3칸씩 오른쪽으로,\n{b('반지름')}은 2칸 그대로", 34).move_to([1.6, -1.15, 0])
        self.say(f"{o('원의 중심')}이 3칸씩 옮겨 가고 {b('반지름')}은 그대로",
                 "원의 중심이 오른쪽으로 3칸씩 옮겨 가고, 반지름은 2칸 그대로예요.")
        self.play(LaggedStart(*[Create(a) for a in arrows[:2]], lag_ratio=0.4, run_time=0.9), FadeIn(t2))
        self.wait(0.8)
        nxt = DashedVMobject(Circle(radius=r, color=GREEN, stroke_width=6).move_to(cs[3]), num_dashes=24)
        nd = Dot(cs[3], radius=0.07, color=GREEN)
        self.say(f"그래서 다음 원은 {g('여기')}!", "그래서 다음 원은 여기에 그리면 돼요!")
        self.play(Create(arrows[2]), FadeIn(nd, scale=2), run_time=0.6)
        self.play(Create(nxt), run_time=1.0)
        msg = M(f"먼저 {o('침을 꽂을 곳')}, 다음 {b('벌릴 길이')}를 찾아요", 42).move_to([0, 2.55, 0])
        bg = SurroundingRectangle(msg, color=GREEN, buff=0.15, stroke_width=5, corner_radius=0.15).set_fill(PAPER, 1)
        self.say(f"먼저 {o('중심')}, 다음 {b('반지름')}을 찾아요",
                 "원으로 된 모양을 똑같이 그리려면 먼저 침을 꽂을 원의 중심을, 다음으로 벌릴 길이인 반지름을 찾아요.")
        self.play(FadeIn(bg), FadeIn(msg), run_time=0.7)
        self.wait(2.0)
        self.settle()
        clear_stage(self, 0.7)
        self.hide_chip()
