"""「수학 원리 돋보기」 2화 — 몇십을 나누면 어떻게 될까? (2학기 2단원 나눗셈 2·4차시, 화 코드 2-2-a)

60 ÷ 3 = 20 (6 ÷ 3 = 2와 견주어 보기), 70 ÷ 5 = 14 (남은 십 모형을 일 모형으로 바꾸기)
미리보기:  ./render.sh 2 preview      최종: ./render.sh 2 final
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (
    DOWN, LEFT, RIGHT, UP,
    Circle, Create, FadeIn, FadeOut, GrowFromCenter, Indicate, LaggedStart, Line,
    RoundedRectangle, SurroundingRectangle, VGroup, Write,
)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SMALL, SOFT, EpisodeScene, M, T, b, g, o
from base10 import grid_points, ones_slots_centered, plate, plate_slots, ten_rod, unit_cube
from division import DivBoard, clear_stage, long_division


def check_mark(size=0.6, color=GREEN):
    p0, p1, p2 = (np.array(v) * size for v in ([-0.5, 0, 0], [-0.15, -0.4, 0], [0.55, 0.45, 0]))
    return VGroup(Line(p0, p1, stroke_width=14, color=color), Line(p1, p2, stroke_width=14, color=color))


def cap(color=BLUE):
    """병뚜껑"""
    return VGroup(Circle(radius=0.15, fill_color=color, fill_opacity=1, stroke_color=INK, stroke_width=2),
                  Circle(radius=0.08, stroke_color=PAPER, stroke_width=2))


class Ep02(EpisodeScene):
    EP_NO = 2
    EP_TITLE = "몇십을 나누면 어떻게 될까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.compare()
        self.second()
        long_division(self, 70, 5, who="모둠")
        self.horizontal()
        self.closing(f"몇십을 나눌 때도 {b('십 모형')}부터 나누고,\n남으면 {o('일 모형')}으로 바꾸어 다시 나눠요",
                     next_preview="3화 · 몇십몇은 어느 자리부터 나눌까?")
        self.wait(0.5)

    # ── 문제 ──
    def problem(self):
        self.section("문제")
        caps = VGroup(*[cap() for _ in range(60)])
        for c, p in zip(caps, grid_points([-3.2, -0.45, 0], 60, 10, 0.36)):
            c.move_to(p)
        lab = T("60개", SMALL, BLUE).next_to(caps, DOWN, buff=0.25)
        groups = VGroup(*[RoundedRectangle(corner_radius=0.25, width=1.25, height=1.25, fill_color=PAPER,
                                           fill_opacity=1, stroke_color=SOFT, stroke_width=4) for _ in range(3)]
                        ).arrange(RIGHT, buff=0.35).move_to([3.6, -0.3, 0])
        glabs = VGroup(*[T(f"{i}모둠", 34).move_to(gp) for i, gp in enumerate(groups, 1)])
        q = M(f"병뚜껑 {b('60개')}를 {o('3모둠')}이 똑같이 나누면\n한 모둠은 몇 개씩 가질까요?", 54)
        q.scale_to_fit_width(min(q.width, 11.4)).move_to([0.3, 2.1, 0])

        self.say(f"재활용 병뚜껑 {b('60개')}를 모았어요", "재활용 병뚜껑을 60개 모았어요.")
        self.play(LaggedStart(*[GrowFromCenter(c) for c in caps], lag_ratio=0.02, run_time=1.6), FadeIn(lab))
        self.say(f"{o('3모둠')}이 똑같이 나누려고 해요", "세 모둠이 똑같이 나누려고 해요.")
        self.play(LaggedStart(*[FadeIn(VGroup(gp, gl), shift=UP * 0.2) for gp, gl in zip(groups, glabs)],
                              lag_ratio=0.25, run_time=1.0))
        self.say("한 모둠은 몇 개씩 가질까요?", "한 모둠은 몇 개씩 가질까요?")
        self.play(Write(q), run_time=1.6)
        self.wait(1.2)
        expr = M(f"{b('60')} ÷ {o('3')} = ?", 120).move_to([0.3, 2.1, 0])
        self.say(f"식으로 쓰면 {b('60')} ÷ {o('3')}", "식으로 쓰면 60 나누기 3이에요.")
        self.play(FadeOut(q), FadeIn(expr, shift=DOWN * 0.2), run_time=0.8)
        self.wait(1.5)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    # ── 6 ÷ 3과 60 ÷ 3 견주기 ──
    def compare(self):
        self.section("6 ÷ 3과 견주기")
        s = 0.16
        sides = []
        for cx, kind in ((-3.55, "one"), (3.55, "ten")):
            plates = VGroup(*[plate("", width=1.75, height=2.1) for _ in range(3)]).arrange(RIGHT, buff=0.2)
            plates.move_to([cx, -0.5, 0])
            items = VGroup(*[(unit_cube(s) if kind == "one" else ten_rod(s)) for _ in range(6)])
            items.arrange(RIGHT, buff=s * (0.6 if kind == "one" else 0.9)).move_to([cx, 1.35, 0])
            sides.append((plates, items))
        title_l = M(f"{o('일 모형')} 6개", 46).move_to([-3.55, 2.55, 0])
        title_r = M(f"{b('십 모형')} 6개", 46).move_to([3.55, 2.55, 0])
        divider = Line([0, 2.9, 0], [0, -2.3, 0], color=SOFT, stroke_width=3)

        self.say(f"먼저 쉬운 {o('6 ÷ 3')}과 견주어 봐요", "먼저 쉬운 6 나누기 3과 견주어 볼게요.")
        self.play(FadeIn(divider), FadeIn(title_l), FadeIn(sides[0][0]), run_time=0.8)
        self.play(FadeIn(sides[0][1]), run_time=0.4)
        self.say(f"{o('일 모형 6개')}를 3묶음에 → 2개씩", "일 모형 6개를 3묶음에 나누면 2개씩이에요.")
        for r in range(2):
            self.play(*[sides[0][1][r * 3 + i].animate.move_to(
                ones_slots_centered(sides[0][0][i], 2, size=s, cols=1)[r] + LEFT * 0.35) for i in range(3)],
                run_time=0.7)
        eq_l = M(f"{o('6 ÷ 3 = 2')}", 60).next_to(sides[0][0], DOWN, buff=0.22)
        self.play(FadeIn(eq_l, shift=UP * 0.2), run_time=0.5)
        self.wait(0.6)

        self.say(f"{b('60')}은 {b('십 모형 6개')} → 똑같이 3묶음에", "60은 십 모형 6개예요. 똑같이 3묶음에 나누어요.")
        self.play(FadeIn(title_r), FadeIn(sides[1][0]), run_time=0.8)
        self.play(FadeIn(sides[1][1]), run_time=0.4)
        for r in range(2):
            self.play(*[sides[1][1][r * 3 + i].animate.move_to(plate_slots(sides[1][0][i], s)[0][r] + RIGHT * 0.25)
                        for i in range(3)], run_time=0.7)
        eq_r = M(f"{b('60 ÷ 3 = 20')}", 60).next_to(sides[1][0], DOWN, buff=0.22)
        self.play(FadeIn(eq_r, shift=UP * 0.2), run_time=0.5)
        self.say(f"한 묶음에 {b('십 모형 2개')} = {b('20')}", "한 묶음에 십 모형이 2개, 그러니까 20이에요.", wait=0.8)
        box_l = SurroundingRectangle(eq_l, color=ORANGE, buff=0.12, stroke_width=5)
        box_r = SurroundingRectangle(eq_r, color=BLUE, buff=0.12, stroke_width=5)
        self.say(f"나누는 방법은 같고, {b('십 모형')}을 나누었으니 몫도 {b('20')}",
                 "나누는 방법은 똑같아요. 십 모형을 나누었으니까 몫도 2가 아니라 20이 돼요.")
        self.play(Create(box_l), Create(box_r), run_time=0.7)
        self.play(Indicate(eq_r, color=BLUE, scale_factor=1.15), run_time=0.8)
        self.wait(1.6)
        self.settle()
        self.clear_sub()
        clear_stage(self, 0.6)

    # ── 70 ÷ 5 ──
    def second(self):
        self.section("70 ÷ 5")
        expr = M(f"빈 병 {b('70')}개를 {o('5모둠')}에 똑같이 나누면?", 60).move_to([0, 0.6, 0])
        self.say(f"이번에는 빈 병 {b('70개')}를 {o('5모둠')}에 나누어요",
                 "이번에는 빈 병 70개를 5모둠에 똑같이 나누어 볼게요.")
        self.play(Write(expr), run_time=1.2)
        self.wait(1.2)
        self.play(FadeOut(expr), run_time=0.4)
        board = DivBoard(self, 70, 5, who="모둠", item="빈 병")
        board.show_number()
        board.show_plates()
        board.deal_tens()
        board.exchange()
        board.deal_ones()
        board.show_result()
        board.clear()

    # ── 가로셈 · 확인 ──
    def horizontal(self):
        self.section("가로셈으로 정리하기")
        e1 = M(f"60 ÷ 3 = {g('20')}", 100).move_to([0, 2.0, 0])
        e2 = M(f"70 ÷ 5 = {g('14')}", 100).move_to([0, 0.55, 0])
        self.say("가로셈으로 정리해요", "가로셈으로 정리하면 60 나누기 3은 20, 70 나누기 5는 14예요.")
        self.play(Write(e1), run_time=1.0)
        self.play(Write(e2), run_time=1.0)
        self.wait(1.5)
        chk = M(f"확인  5 × 14 = {g('70')}", 76).move_to([0, -0.85, 0])
        split = M(f"5 × {b('10')} = {b('50')},   5 × {o('4')} = {o('20')},   {b('50')} + {o('20')} = 70", 46)
        split.move_to([0, -1.95, 0])
        self.say(f"{g('곱셈')}으로 확인해 봐요: 5 × 14", "곱셈으로 확인해 봐요. 5 곱하기 14는?")
        self.play(FadeIn(chk[:7], shift=UP * 0.2), run_time=0.7)
        self.play(FadeIn(split, shift=UP * 0.2), run_time=0.8)
        self.wait(1.6)
        self.play(FadeIn(chk[7:], scale=1.5), run_time=0.5)
        mark = check_mark(0.8).next_to(chk, RIGHT, buff=0.4)
        self.say(f"처음 빈 병 수 {g('70개')}와 같아요!", "처음 빈 병 수 70과 같아요. 바르게 계산했어요!")
        self.play(Create(mark), run_time=0.5)
        self.wait(1.8)
        self.settle()
        clear_stage(self, 0.7)
        self.hide_chip()
