"""「수학 원리 돋보기」 1화 — 42 ÷ 3은 어떻게 계산할까? (내림이 있는 몇십몇 ÷ 몇)

미리보기:  cd _build/video && ./render.sh 1 preview
최종:      cd _build/video && ./render.sh 1 final
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (
    DOWN, LEFT, PI, RIGHT, UP, UR,
    AnimationGroup, ArcBetweenPoints, Group, Rectangle, Circle, Circumscribe, CurvedArrow, FadeIn,
    FadeOut, GrowFromCenter, Indicate, LaggedStart, Line, Create, RoundedRectangle,
    SurroundingRectangle, Transform, VGroup, Write, ReplacementTransform,
)

from series_style import (
    BG, BIG, BLUE, GREEN, INK, MID, ORANGE, PAPER, PLATE, SMALL, SOFT,
    EpisodeScene, M, T, b, g, o,
)
from base10 import (
    UNIT, break_ten, grid_points, ones_slots_centered, plate, plate_slots,
    ten_rod, unit_cube,
)


def check_mark(size=0.6, color=GREEN):
    p0 = np.array([-0.5, 0.0, 0]) * size
    p1 = np.array([-0.15, -0.4, 0]) * size
    p2 = np.array([0.55, 0.45, 0]) * size
    return VGroup(Line(p0, p1, stroke_width=14, color=color),
                  Line(p1, p2, stroke_width=14, color=color))


def kid(color):
    head = Circle(radius=0.36, fill_color=PAPER, fill_opacity=1, stroke_color=INK, stroke_width=5)
    body = RoundedRectangle(corner_radius=0.3, width=1.05, height=1.0,
                            fill_color=color, fill_opacity=1, stroke_color=INK, stroke_width=5)
    body.next_to(head, DOWN, buff=0.06)
    return VGroup(body, head)


class Ep01(EpisodeScene):
    EP_NO = 1
    EP_TITLE = "42 ÷ 3은 어떻게 계산할까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.blocks()
        self.long_division()
        self.horizontal()
        self.closing(
            f"{b('십의 자리')}부터 나누고, 남은 수는\n{o('일의 자리')}로 내려서 다시 나눠요",
            next_preview="",
        )
        self.wait(0.5)

    # ── ② 문제 제시 ─────────────────────────────────────────────
    def problem(self):
        self.section("문제")
        q = M(f"구슬 {g('42개')}를 {b('3명')}이 똑같이 나누어 가지면\n한 명이 몇 개씩 가질까요?", 56)
        q.scale_to_fit_width(min(q.width, 11.4)).move_to([0.3, 2.1, 0])
        marbles = VGroup(*[
            Circle(radius=0.17, fill_color=GREEN, fill_opacity=1, stroke_color="#1E6E3F", stroke_width=3)
            for _ in range(42)
        ])
        for m, p in zip(marbles, grid_points([-3.4, -0.5, 0], 42, 7, 0.46)):
            m.move_to(p)
        lab42 = T("42개", SMALL, GREEN).next_to(marbles, DOWN, buff=0.25)
        kids = VGroup(kid(BLUE), kid(ORANGE), kid(SOFT)).arrange(RIGHT, buff=0.75).move_to([3.3, -0.35, 0])
        lab3 = T("3명", SMALL, BLUE).next_to(kids, DOWN, buff=0.3)

        self.say(f"구슬 {g('42개')}가 있어요",
                 "여기 구슬 42개가 있어요.")
        self.play(LaggedStart(*[GrowFromCenter(m) for m in marbles], lag_ratio=0.04, run_time=1.8),
                  FadeIn(lab42))
        self.wait(0.8)
        self.say(f"{b('3명')}이 똑같이 나누어 가지려고 해요",
                 "세 명이 이 구슬을 똑같이 나누어 가지려고 해요.")
        self.play(LaggedStart(*[FadeIn(k, shift=UP * 0.3) for k in kids], lag_ratio=0.3, run_time=1.2),
                  FadeIn(lab3))
        self.wait(1.0)
        self.say("한 명이 몇 개씩 가질까요?",
                 "한 명이 몇 개씩 가질까요?")
        self.play(Write(q), run_time=2.0)
        self.wait(1.8)

        expr = M(f"{g('42')} ÷ {b('3')} = ?", BIG).move_to([0.6, 2.15, 0])
        self.say(f"식으로 쓰면 {g('42')} ÷ {b('3')}",
                 "식으로 쓰면 42 나누기 3이에요.")
        self.play(FadeOut(q), FadeIn(expr, shift=DOWN * 0.2), run_time=0.9)
        self.wait(2.5)
        self.pause_screen(5)
        self.say("수모형으로 알아볼까요?",
                 "그럼 수모형으로 함께 알아볼까요?", wait=1.6)
        self.settle()
        self.play(FadeOut(VGroup(marbles, lab42, kids, lab3, expr)), run_time=0.7)

    # ── ③ 수모형으로 계산하기 ─────────────────────────────────────
    def blocks(self):
        self.section("수모형으로 나누기")
        corner = M(f"{g('42')} ÷ {b('3')}", 50).move_to([0.3, 3.55, 0])
        num42 = M(f"{b('4')}{o('2')}", 100).move_to([-5.4, 2.15, 0])

        rods = VGroup(*[ten_rod() for _ in range(4)]).arrange(RIGHT, buff=0.2).move_to([-5.85, 0.2, 0])
        ones = VGroup(unit_cube(), unit_cube()).arrange(UP, buff=0.12)
        ones.next_to(rods, RIGHT, buff=0.4).align_to(rods, DOWN)
        lab40 = T("40", 56, BLUE).next_to(rods, DOWN, buff=0.3)
        lab2 = T("2", 56, ORANGE).next_to(ones, DOWN, buff=0.3).align_to(lab40, DOWN)

        self.play(FadeIn(corner), FadeIn(num42, scale=0.8), run_time=0.7)
        self.say(f"구슬 42개를 수모형으로 나타내요",
                 "구슬 42개를 수모형으로 나타내 볼게요.", wait=0.8)

        self.say(f"십의 자리 {b('4')} → {b('십 모형 4개')} (40)",
                 "십의 자리 4는 십 모형 4개, 40이에요.")
        a1 = Line(num42[0].get_bottom() + DOWN * 0.08, rods.get_top() + UP * 0.08,
                  color=BLUE, stroke_width=6)
        self.play(Indicate(num42[0], color=BLUE, scale_factor=1.3), Create(a1), run_time=0.8)
        self.play(LaggedStart(*[FadeIn(r, shift=DOWN * 0.3) for r in rods], lag_ratio=0.25, run_time=1.4))
        self.play(FadeIn(lab40), run_time=0.4)
        self.wait(1.6)

        self.say(f"일의 자리 {o('2')} → {o('일 모형 2개')} (2)",
                 "일의 자리 숫자 2는 일 모형 2개예요.")
        a2 = Line(num42[1].get_bottom() + DOWN * 0.08, ones.get_top() + UP * 0.08,
                  color=ORANGE, stroke_width=6)
        self.play(Indicate(num42[1], color=ORANGE, scale_factor=1.3), Create(a2), run_time=0.8)
        self.play(LaggedStart(*[FadeIn(u, shift=DOWN * 0.3) for u in ones], lag_ratio=0.3, run_time=0.8))
        self.play(FadeIn(lab2), run_time=0.4)
        self.wait(1.6)

        plates = VGroup(*[plate(f"{i}번 친구", height=3.1) for i in (1, 2, 3)]).arrange(RIGHT, buff=0.32)
        plates.move_to([1.85, 0.6, 0])
        self.say("3명에게 나누어 줄 접시 3개를 놓아요",
                 "세 명에게 똑같이 나누어 줄 거예요. 접시 3개를 놓아요.")
        self.play(FadeOut(VGroup(a1, a2, lab40, lab2)),
                  LaggedStart(*[FadeIn(p, shift=UP * 0.2) for p in plates], lag_ratio=0.25, run_time=1.2))
        self.bring_to_front(rods, ones)   # 접시가 수모형을 가리지 않게
        self.wait(1.2)

        # 십 모형 나누기 (파랑)
        self.say(f"{b('십 모형')}부터 한 명에게 {b('1개씩')} 나누어 줘요",
                 "먼저 십 모형부터 나누어요. 한 명에게 1개씩 나누어 줘요.")
        for i in range(3):
            slot = plate_slots(plates[i])[0][0]
            self.play(rods[i].animate.move_to(slot), run_time=0.85)
            self.wait(0.25)
        self.wait(0.8)
        self.say(f"{b('십 모형')}이 {b('1개')} 남았어요",
                 "그런데 십 모형이 1개 남았어요.")
        self.play(Circumscribe(rods[3], color=BLUE, buff=0.12, stroke_width=6, run_time=1.2))
        self.wait(1.2)
        self.say(f"{b('십 모형 1개')}는 3명에게 똑같이 나눌 수 없어요",
                 "남은 십 모형 1개는 3명에게 똑같이 나눌 수 없어요. 어떻게 할까요?",
                 wait=2.8)

        # ★ 핵심 장면: 십 모형 1개 → 일 모형 10개
        rod = rods[3]
        self.say(f"{b('십 모형 1개')}를 {o('일 모형 10개')}로 바꿔요!",
                 "십 모형 1개를 일 모형 10개로 바꾸면 돼요!")
        cover = Rectangle(width=15, height=6.1, fill_color=BG, fill_opacity=0.9, stroke_width=0).move_to([0, 0.75, 0])
        self.play(FadeIn(cover), run_time=0.6)
        self.bring_to_front(rod)
        self.play(rod.animate.scale(1.6).rotate(-PI / 2).move_to([0, 0.5, 0]), run_time=1.2)
        glow = SurroundingRectangle(rod, color=ORANGE, buff=0.18, stroke_width=10, corner_radius=0.15)
        self.play(Create(glow), run_time=0.5)
        self.play(Indicate(rod, color=ORANGE, scale_factor=1.08), run_time=0.8)
        self.play(FadeOut(glow), run_time=0.3)
        row = [np.array([x, 0.5, 0]) for x in np.linspace(-4.95, 4.95, 10)]
        anim, cubes = break_ten(rod, row, run_time=2.4, lag=0.15)
        self.play(anim)
        nums = VGroup(*[T(str(k + 1), 44, ORANGE).next_to(c, UP, buff=0.22) for k, c in enumerate(cubes)])
        self.play(LaggedStart(*[FadeIn(n, scale=1.6) for n in nums], lag_ratio=0.18, run_time=2.0))
        eq = M(f"{b('십 모형 1개')} = {o('일 모형 10개')}", 76).move_to([0, -1.25, 0])
        eq_box = SurroundingRectangle(eq, color=ORANGE, buff=0.3, stroke_width=6, corner_radius=0.2)
        eq_box.set_fill(PAPER, 1)
        self.play(FadeIn(eq_box), Write(eq), run_time=1.2)
        self.wait(2.6)

        # 남은 일 모형과 합쳐 12개
        pool_pts = grid_points([-5.4, 0.3, 0], 12, 3, UNIT * 1.45)
        self.say(f"{o('일 모형')}은 모두 10개 + 2개 = {o('12개')}",
                 "원래 있던 일 모형 2개와 합하면, 일 모형은 모두 12개예요.")
        self.play(FadeOut(VGroup(nums, eq, eq_box)), run_time=0.5)
        all_ones = VGroup(*cubes, *ones)
        self.play(FadeOut(cover), run_time=0.5)
        self.play(*[c.animate.scale_to_fit_width(UNIT).move_to(p) for c, p in zip(all_ones, pool_pts)],
                  run_time=1.6)
        lab12 = T("12개", 56, ORANGE).next_to(VGroup(*all_ones), DOWN, buff=0.35)
        self.play(FadeIn(lab12, scale=1.3), run_time=0.5)
        self.wait(2.0)

        # 일 모형 나누기 (주황)
        self.say(f"{o('일 모형 12개')}도 한 명에게 {o('1개씩')} 나누어 줘요",
                 "일 모형 12개도 한 명에게 1개씩 나누어 줘요.")
        slots = [ones_slots_centered(p, 4) for p in plates]
        k = 0
        for r in range(4):
            group = []
            for i in range(3):
                group.append(all_ones[k].animate.move_to(slots[i][r]))
                k += 1
            self.play(*group, run_time=0.9)
            self.wait(0.35)
        self.play(FadeOut(lab12), run_time=0.3)
        self.say(f"한 명에게 {o('4개')}씩, 남은 것이 없어요",
                 "한 명에게 일 모형이 4개씩 돌아가고, 남은 것이 없어요.", wait=2.4)

        # 결과: 한 묶음 = 14
        labs = VGroup(*[M(f"{b('1')}{o('4')}", 72).next_to(p[0], DOWN, buff=0.2) for p in plates])
        self.say(f"한 묶음 = {b('십 모형 1개')} + {o('일 모형 4개')} = 14",
                 "한 접시에 십 모형 1개와 일 모형 4개, 14예요.")
        self.play(LaggedStart(*[FadeIn(l, shift=UP * 0.2) for l in labs], lag_ratio=0.3, run_time=1.2))
        self.wait(2.6)
        boxes = VGroup(*[SurroundingRectangle(VGroup(p[0], l), color=GREEN, buff=0.1, stroke_width=6, corner_radius=0.3)
                         for p, l in zip(plates, labs)])
        self.say(f"한 명이 구슬 {g('14개')}씩 가져요",
                 "그래서 한 명이 구슬을 14개씩 가져요.")
        self.play(Create(boxes), run_time=0.9)
        self.wait(2.4)
        self.settle()
        self.play(FadeOut(Group(*self.mobjects_without_ui())), run_time=0.8)

    def mobjects_without_ui(self):
        keep = {id(self._chip), id(self._sub), id(self._mark)}
        if self._sub is not None:
            keep |= {id(m) for m in self._sub}
        return [m for m in self.mobjects if id(m) not in keep]

    # ── ④ 세로셈 ─────────────────────────────────────────────
    def long_division(self):
        self.section("세로셈으로 나타내기")
        F = 72
        xt, xo = -3.5, -2.85            # 십의 자리, 일의 자리 열
        yq, ybar, yd = 2.5, 1.98, 1.5   # 몫 · 막대 · 나누어지는 수
        y2, yl1, y3, y4, yl2, y5 = 0.62, 0.18, -0.26, -1.12, -1.56, -2.0

        def dig(s, x, y, color=INK):
            return T(s, F, color).move_to([x, y, 0])

        divisor = dig("3", xt - 1.15, yd)
        d4 = dig("4", xt, yd)
        d2 = dig("2", xo, yd)
        left = np.array([xt - 0.5, ybar, 0])
        bar = Line(left, [xo + 0.45, ybar, 0], color=INK, stroke_width=7)
        brk = ArcBetweenPoints(left, left + np.array([-0.08, -0.92, 0]), angle=-PI / 2.4,
                               color=INK, stroke_width=7)
        frame = VGroup(divisor, brk, bar, d4, d2)

        # 오른쪽: 작은 수모형 장면 (위 장면과 같은 색)
        s = 0.13
        mplates = VGroup(*[plate("", width=1.35, height=1.75) for _ in range(3)]).arrange(RIGHT, buff=0.18)
        mplates.move_to([3.75, 1.25, 0])
        mrods = VGroup(*[ten_rod(s) for _ in range(4)]).arrange(RIGHT, buff=0.12)
        mones = VGroup(unit_cube(s), unit_cube(s)).arrange(UP, buff=0.06)
        pool = VGroup(mrods, mones).arrange(RIGHT, buff=0.3, aligned_edge=DOWN).move_to([3.75, -0.45, 0])
        mini_title = T("수모형으로 보면", 38, SOFT).move_to([3.75, 2.45, 0])
        panel_bg = RoundedRectangle(corner_radius=0.3, width=5.6, height=5.0,
                                    fill_color=PAPER, fill_opacity=0.7, stroke_color=SOFT, stroke_width=2)
        panel_bg.move_to([3.75, 0.3, 0])
        caption = T("", 38)

        def set_caption(markup):
            nonlocal caption
            new = M(markup, 38)
            new.scale_to_fit_width(min(new.width, 5.2)).move_to([3.75, -1.7, 0])
            self.play(FadeOut(caption), FadeIn(new), run_time=0.4)
            caption = new

        self.say("세로셈으로 나타내 볼까요?", "이번에는 세로셈으로 나타내 볼까요?")
        self.play(FadeIn(panel_bg), FadeIn(mini_title), FadeIn(mplates), FadeIn(pool), run_time=0.8)
        self.play(Write(frame), run_time=1.4)
        self.wait(0.6)
        self.say("나누는 수 3은 왼쪽, 나누어지는 수 42는 안쪽에 써요",
                 "나누는 수 3은 왼쪽에, 나누어지는 수 42는 안쪽에 써요.")
        self.play(Indicate(divisor, color=INK), run_time=0.8)
        self.play(Indicate(VGroup(d4, d2), color=INK), run_time=0.8)
        self.wait(1.4)

        # (1) 십의 자리: 4 ÷ 3 → 1 (파랑)
        self.say(f"{b('십의 자리')}부터: {b('4 ÷ 3')}",
                 "십의 자리부터 나누어요. 4 나누기 3.")
        hl = SurroundingRectangle(d4, color=BLUE, buff=0.12, stroke_width=6)
        self.play(d4.animate.set_color(BLUE), Create(hl), Indicate(mrods, color=BLUE), run_time=0.9)
        set_caption(f"{b('십 모형 4개')}를 3명에게")
        self.wait(1.4)
        q1 = dig("1", xt, yq, BLUE)
        self.say(f"한 명에게 {b('십 모형 1개')}씩 → 몫의 십의 자리에 {b('1')}",
                 "한 명에게 십 모형 1개씩. 몫의 십의 자리에 1을 써요.")
        mslots = [plate_slots(p, s)[0][0] for p in mplates]
        self.play(*[mrods[i].animate.move_to(mslots[i]) for i in range(3)], run_time=1.0)
        self.play(FadeIn(q1, shift=DOWN * 0.3, scale=1.4), run_time=0.6)
        set_caption(f"한 명에게 {b('1개씩')}")
        self.wait(1.8)
        r3 = dig("3", xt, y2, BLUE)
        self.say(f"나누어 준 {b('십 모형 3개')}(30)를 {b('3')}으로 써요",
                 "나누어 준 십 모형 3개, 30을 4 아래에 3으로 써요.")
        self.play(FadeIn(r3, shift=DOWN * 0.3), Indicate(VGroup(*mrods[:3]), color=BLUE), run_time=0.9)
        set_caption(f"나누어 준 {b('십 모형 3개')}")
        self.wait(1.8)
        l1 = Line([xt - 0.4, yl1, 0], [xo + 0.4, yl1, 0], color=INK, stroke_width=6)
        r1 = dig("1", xt, y3, BLUE)
        self.say(f"{b('4 − 3 = 1')}: 남은 {b('십 모형 1개')}",
                 "4 빼기 3은 1. 십 모형이 1개 남았어요.")
        self.play(Create(l1), run_time=0.5)
        self.play(FadeIn(r1, shift=DOWN * 0.3), Circumscribe(mrods[3], color=BLUE, buff=0.06), run_time=1.0)
        set_caption(f"남은 {b('십 모형 1개')}")
        self.play(FadeOut(hl), run_time=0.3)
        self.wait(1.4)

        # (2) 바꾸고 내리기: 12 (주황)
        self.say(f"남은 {b('십 모형 1개')} → {o('일 모형 10개')}",
                 "남은 십 모형 1개는 일 모형 10개로 바꿔요.")
        pts = grid_points([3.75, -0.45, 0], 12, 6, s * 1.5)
        anim, mcubes = break_ten(mrods[3], pts[:10], run_time=1.4, lag=0.1)
        self.play(anim, r1.animate.set_color(ORANGE), run_time=1.4)
        set_caption(f"{b('십 모형 1개')} = {o('일 모형 10개')}")
        self.wait(1.4)
        self.say(f"일의 자리 {o('2')}를 내려 써서 {o('12')}",
                 "일의 자리 2를 내려 쓰면 12가 돼요.")
        d2c = d2.copy()
        arrow = CurvedArrow(d2.get_bottom() + DOWN * 0.05 + RIGHT * 0.3,
                            np.array([xo + 0.3, y3 + 0.3, 0]), angle=-PI / 3, color=ORANGE, stroke_width=6)
        self.play(d2.animate.set_color(ORANGE), run_time=0.4)
        self.play(Create(arrow),
                  d2c.animate.set_color(ORANGE).move_to([xo, y3, 0]), run_time=1.1)
        self.play(*[mones[i].animate.move_to(pts[10 + i]) for i in range(2)], run_time=0.8)
        m12 = VGroup(*mcubes, *mones)
        set_caption(f"{o('일 모형')}은 모두 {o('12개')}")
        hl2 = SurroundingRectangle(VGroup(r1, d2c), color=ORANGE, buff=0.12, stroke_width=6)
        self.play(Create(hl2), run_time=0.5)
        self.wait(1.6)

        # (3) 일의 자리: 12 ÷ 3 → 4 (주황)
        q4 = dig("4", xo, yq, ORANGE)
        self.say(f"{o('12 ÷ 3 = 4')} → 몫의 일의 자리에 {o('4')}",
                 "12 나누기 3은 4. 몫의 일의 자리에 4를 써요.")
        oslots = [ones_slots_centered(p, 4, size=s) for p in mplates]
        k = 0
        moves = []
        for r in range(4):
            for i in range(3):
                moves.append(m12[k].animate.move_to(oslots[i][r]))
                k += 1
        self.play(LaggedStart(*moves, lag_ratio=0.08, run_time=1.8))
        self.play(FadeIn(q4, shift=DOWN * 0.3, scale=1.4), run_time=0.6)
        set_caption(f"한 명에게 {o('4개씩')}")
        self.wait(1.8)
        r12 = VGroup(dig("1", xt, y4, ORANGE), dig("2", xo, y4, ORANGE))
        l2 = Line([xt - 0.4, yl2, 0], [xo + 0.4, yl2, 0], color=INK, stroke_width=6)
        r0 = dig("0", xo, y5, ORANGE)
        self.say(f"나누어 준 {o('12')}를 쓰고 빼면 {o('0')}",
                 "나누어 준 12를 쓰고 빼면 0, 남은 것이 없어요.")
        self.play(FadeOut(hl2), FadeIn(r12, shift=DOWN * 0.3), run_time=0.7)
        self.play(Create(l2), run_time=0.4)
        self.play(FadeIn(r0, shift=DOWN * 0.3), run_time=0.5)
        set_caption(f"남은 것: {o('0')}")
        self.wait(1.8)

        qbox = SurroundingRectangle(VGroup(q1, q4), color=GREEN, buff=0.15, stroke_width=7)
        self.say(f"몫은 {b('1')}{o('4')}: 한 명이 {g('14개')}씩!",
                 "그래서 몫은 14. 한 명이 14개씩 가져요.")
        self.play(Create(qbox), Indicate(VGroup(q1, q4), color=GREEN), run_time=1.0)
        set_caption(f"한 묶음 = {b('10')} + {o('4')} = {g('14')}")
        self.wait(2.4)
        self.settle()
        self.clear_sub()
        self.play(FadeOut(Group(*self.mobjects_without_ui())), run_time=0.8)

    # ── ⑤ 가로셈 · 확인 ─────────────────────────────────────────
    def horizontal(self):
        self.section("가로셈으로 정리하기")
        eq = M(f"42 ÷ 3 = {g('14')}", 130).move_to([0, 1.55, 0])
        self.say("가로셈으로 쓰면 42 ÷ 3 = 14",
                 "가로셈으로 정리하면 42 나누기 3은 14예요.")
        self.play(Write(eq), run_time=1.4)
        self.wait(2.2)

        self.say(f"{g('곱셈')}으로 확인해 봐요: 3 × 14",
                 "곱셈으로 확인해 봐요. 3 곱하기 14는?")
        chk = M(f"확인  3 × 14 = {g('42')}", 92).move_to([0, -0.35, 0])
        split = M(f"3 × {b('10')} = {b('30')},   3 × {o('4')} = {o('12')},   {b('30')} + {o('12')} = 42", 50)
        split.move_to([0, -1.65, 0])
        self.play(FadeIn(chk[:7], shift=UP * 0.2), run_time=0.8)
        self.wait(1.0)
        self.play(FadeIn(split, shift=UP * 0.2), run_time=0.9)
        self.wait(2.4)
        self.play(FadeIn(chk[7:], scale=1.5), run_time=0.6)
        mark = check_mark(0.9).next_to(chk, RIGHT, buff=0.45)
        self.say(f"처음 구슬 수 {g('42개')}와 같아요!",
                 "처음 구슬 수 42와 같아요. 바르게 계산했어요!")
        self.play(Create(mark), run_time=0.6)
        self.wait(2.6)
        self.settle()
        self.play(FadeOut(VGroup(eq, chk, split, mark)), run_time=0.7)
        self.hide_chip()
