"""「수학 원리 돋보기」 4화 — 나머지는 무엇일까? (2학기 2단원 나눗셈 6·7차시, 화 코드 2-2-c)

17 ÷ 5 = 3 … 2 (건전지 5개씩 묶기) → 나머지는 나누는 수보다 작아요(7개 남으면 한 묶음 더)
→ 15 ÷ 5 = 3 (나누어떨어짐) → 53 ÷ 4 = 13 … 1 (수모형·세로셈)
최종: ./make_final.sh 4
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (
    DOWN, LEFT, RIGHT, UP,
    Circumscribe, Create, FadeIn, FadeOut, GrowFromCenter, Indicate, LaggedStart, Line,
    Rectangle, RoundedRectangle, SurroundingRectangle, VGroup, Write,
)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SMALL, SOFT, EpisodeScene, M, T, b, g, o
from division import DivBoard, clear_stage, long_division

CELL = "#D9D2C5"


def battery():
    body = RoundedRectangle(corner_radius=0.05, width=0.26, height=0.56, fill_color=CELL, fill_opacity=1,
                            stroke_color=INK, stroke_width=2.5)
    top = Rectangle(width=0.1, height=0.06, fill_color=INK, fill_opacity=1, stroke_width=0)
    top.next_to(body, UP, buff=0)
    band = Rectangle(width=0.26, height=0.14, fill_color=ORANGE, fill_opacity=0.85, stroke_width=0)
    band.move_to(body.get_top() + DOWN * 0.12)
    return VGroup(body, band, top)


def layout(n, per, groups, y=0.0, step=0.4, gap=0.75):
    """n개를 per개씩 groups묶음 + 나머지로 늘어놓을 자리"""
    pts, x = [], 0.0
    for gi in range(groups):
        for i in range(per):
            pts.append(x)
            x += step
        x += gap - step
    for i in range(n - per * groups):
        pts.append(x)
        x += step
    pts = np.array(pts)
    pts -= (pts[0] + pts[-1]) / 2
    return [np.array([p, y, 0]) for p in pts]


def group_boxes(items, per, groups, color=BLUE):
    return VGroup(*[SurroundingRectangle(VGroup(*items[gi * per:(gi + 1) * per]), color=color, buff=0.12,
                                         stroke_width=5, corner_radius=0.15) for gi in range(groups)])


class Ep04(EpisodeScene):
    EP_NO = 4
    EP_TITLE = "나머지는 무엇일까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.group17()
        self.too_big()
        self.exact()
        self.board53()
        long_division(self, 53, 4, who="모둠")
        self.write53()
        self.closing(f"똑같이 나누고 남은 수가 {o('나머지')}\n{o('나머지')}는 나누는 수보다 항상 작아요",
                     next_preview="5화 · 나눗셈이 맞는지 확인하기")
        self.wait(0.5)

    # ── 문제 ──
    def problem(self):
        self.section("문제")
        bats = VGroup(*[battery() for _ in range(17)])
        for bt, p in zip(bats, layout(17, 17, 0, y=-0.2, step=0.55)):
            bt.move_to(p)
        lab = T("17개", SMALL, INK).next_to(bats, DOWN, buff=0.3)
        q = M(f"다 쓴 건전지 {b('17개')}를 {o('5개씩')} 상자에 담으면\n몇 상자가 되고, 몇 개가 남을까요?", 52)
        q.scale_to_fit_width(min(q.width, 11.4)).move_to([0, 2.1, 0])
        self.say(f"다 쓴 건전지 {b('17개')}를 모았어요", "다 쓴 건전지를 17개 모았어요.")
        self.play(LaggedStart(*[GrowFromCenter(x) for x in bats], lag_ratio=0.06, run_time=1.4), FadeIn(lab))
        self.say(f"한 상자에 {o('5개씩')} 담아요", "한 상자에 5개씩 담아서 수거함에 내려고 해요.")
        self.play(Write(q), run_time=1.6)
        self.wait(1.0)
        self.say("몇 상자가 되고, 몇 개가 남을까요?", "몇 상자가 되고, 몇 개가 남을까요?")
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        self.bats, self.lab = bats, lab
        self.play(FadeOut(q), run_time=0.4)

    # ── 5개씩 묶기 ──
    def group17(self):
        self.section("5개씩 묶어 보기")
        bats = self.bats
        self.say(f"{o('5개씩')} 묶어 봐요", "5개씩 묶어 볼게요.")
        self.play(FadeOut(self.lab), run_time=0.3)
        target = layout(17, 5, 3, y=1.0)
        self.play(*[bt.animate.move_to(p) for bt, p in zip(bats, target)], run_time=1.2)
        boxes = group_boxes(bats, 5, 3)
        nums = VGroup(*[T(f"{i + 1}", 44, BLUE).next_to(bx, UP, buff=0.15) for i, bx in enumerate(boxes)])
        for bx, nm in zip(boxes, nums):
            self.play(Create(bx), FadeIn(nm, scale=1.3), run_time=0.6)
        self.say(f"{b('3묶음')}이 되고 {o('2개')}가 남아요", "5개씩 3묶음이 되고, 2개가 남아요.")
        left = VGroup(*bats[15:])
        ring = SurroundingRectangle(left, color=ORANGE, buff=0.12, stroke_width=6, corner_radius=0.15)
        self.play(Create(ring), Indicate(left, color=ORANGE), run_time=0.9)
        self.wait(1.0)

        eq = M(f"17 ÷ 5 = {b('3')} … {o('2')}", 110).move_to([0, -0.7, 0])
        self.say(f"식으로 {b('17 ÷ 5 = 3')} … {o('2')}", "이것을 식으로 17 나누기 5는 3, 나머지 2라고 써요.")
        self.play(Write(eq), run_time=1.2)
        self.wait(0.8)
        lq = T("몫", 46, BLUE).next_to(eq[5], DOWN, buff=0.25)
        lr = T("나머지", 46, ORANGE).next_to(eq[-1], DOWN, buff=0.25)
        self.say(f"{b('3')}은 {b('몫')}, {o('2')}는 {o('나머지')}", "3은 몫, 남은 2를 나머지라고 해요.")
        self.play(FadeIn(lq, shift=UP * 0.2), Indicate(eq[5], color=BLUE), run_time=0.7)
        self.play(FadeIn(lr, shift=UP * 0.2), Indicate(eq[-1], color=ORANGE), run_time=0.7)
        self.wait(1.2)
        read = M(f"읽기: 17 나누기 5는 {b('3')}이고, 나머지는 {o('2')}입니다", 40)
        self.say("이렇게 읽어요", "17 나누기 5는 3이고, 나머지는 2입니다. 이렇게 읽어요.")
        self.play(FadeOut(VGroup(lq, lr)), eq.animate.shift(UP * 0.25), run_time=0.5)
        read.next_to(eq, DOWN, buff=0.3)
        self.play(FadeIn(read), run_time=0.6)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)

    # ── 나머지는 나누는 수보다 작아요 ──
    def too_big(self):
        self.section("나머지는 얼마까지?")
        bats = VGroup(*[battery() for _ in range(17)])
        for bt, p in zip(bats, layout(17, 5, 2, y=0.6)):
            bt.move_to(p)
        boxes = group_boxes(bats, 5, 2)
        self.say(f"만약 {b('2묶음')}만 만들고 멈추면?", "만약 두 묶음만 만들고 멈추면 어떻게 될까요?")
        self.play(FadeIn(bats), FadeIn(boxes), run_time=0.8)
        left = VGroup(*bats[10:])
        ring = SurroundingRectangle(left, color=ORANGE, buff=0.12, stroke_width=6, corner_radius=0.15)
        wrong = M(f"17 ÷ 5 = 2 … {o('7')} ?", 90).move_to([0, -1.2, 0])
        self.play(Create(ring), Write(wrong), run_time=1.0)
        self.say(f"남은 {o('7개')}로 {b('5개')} 한 묶음을 더 만들 수 있어요!",
                 "남은 7개로 5개짜리 한 묶음을 더 만들 수 있어요. 아직 다 나눈 것이 아니에요.")
        self.play(Indicate(left, color=ORANGE), run_time=0.9)
        cross = Line(wrong.get_left() + LEFT * 0.1, wrong.get_right() + RIGHT * 0.1, color=ORANGE, stroke_width=8)
        self.play(Create(cross), run_time=0.5)
        self.wait(0.6)
        target = layout(17, 5, 3, y=0.6)
        self.play(FadeOut(ring), *[bt.animate.move_to(p) for bt, p in zip(bats, target)],
                  *[bx.animate.move_to(sum(target[gi * 5:gi * 5 + 5]) / 5 + UP * (bx.get_center()[1] - 0.6))
                    for gi, bx in enumerate(boxes)], run_time=1.0)
        nb = SurroundingRectangle(VGroup(*bats[10:15]), color=BLUE, buff=0.12, stroke_width=5, corner_radius=0.15)
        self.play(Create(nb), run_time=0.5)
        right = M(f"17 ÷ 5 = {b('3')} … {o('2')}", 90).move_to([0, -1.2, 0])
        self.play(FadeOut(VGroup(wrong, cross)), FadeIn(right, shift=UP * 0.2), run_time=0.7)
        self.say(f"{o('나머지')}는 나누는 수 {b('5')}보다 작아야 해요",
                 "그래서 나머지는 나누는 수 5보다 항상 작아요.")
        rule = M(f"{o('나머지')} &lt; 나누는 수", 64)
        rule_bg = SurroundingRectangle(rule, color=GREEN, buff=0.2, stroke_width=6, corner_radius=0.2).set_fill(PAPER, 1)
        VGroup(rule_bg, rule).move_to([0, 2.15, 0])
        self.play(FadeIn(rule_bg), Write(rule), run_time=0.9)
        self.wait(1.0)
        self.say(f"5로 나누면 {o('나머지')}는 0, 1, 2, 3, 4 중 하나",
                 "5로 나누면 나머지가 될 수 있는 수는 0, 1, 2, 3, 4 중 하나예요. 가장 큰 나머지는 4예요.", wait=1.0)
        self.settle()
        clear_stage(self, 0.6)

    # ── 나누어떨어져요 ──
    def exact(self):
        self.section("나누어떨어져요")
        bats = VGroup(*[battery() for _ in range(15)])
        for bt, p in zip(bats, layout(15, 15, 0, y=0.6, step=0.5)):
            bt.move_to(p)
        self.say(f"건전지가 {b('15개')}라면?", "건전지가 15개라면 어떨까요?")
        self.play(FadeIn(bats), run_time=0.7)
        target = layout(15, 5, 3, y=0.6)
        self.play(*[bt.animate.move_to(p) for bt, p in zip(bats, target)], run_time=1.0)
        boxes = group_boxes(bats, 5, 3)
        self.play(LaggedStart(*[Create(bx) for bx in boxes], lag_ratio=0.3, run_time=1.0))
        eq = M(f"15 ÷ 5 = {b('3')} … {o('0')}", 90).move_to([0, -1.0, 0])
        self.say(f"3상자, 남은 것은 {o('0개')}", "5개씩 3상자, 남은 것이 없어요. 나머지가 0이에요.")
        self.play(Write(eq), run_time=1.0)
        self.wait(0.8)
        word = M(f"나머지가 {o('0')}이면 {g('나누어떨어진다')}고 해요", 54).move_to([0, -2.15, 0])
        self.say(f"나머지가 {o('0')}이면 {g('나누어떨어진다')}고 해요",
                 "이렇게 나머지가 0일 때 나누어떨어진다고 해요. 그래서 15 나누기 5는 3이라고만 써요.")
        self.play(FadeIn(word, shift=UP * 0.2), run_time=0.7)
        short = M(f"15 ÷ 5 = {g('3')}", 90).move_to(eq)
        self.play(FadeOut(eq), FadeIn(short), run_time=0.7)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)

    # ── 53 ÷ 4 수모형 ──
    def board53(self):
        self.section("53 ÷ 4")
        expr = M(f"종이컵 {b('53')}개를 {o('4모둠')}에 똑같이 나누면?", 60).move_to([0, 0.6, 0])
        self.say(f"이번에는 종이컵 {b('53개')}를 {o('4모둠')}에 나누어요",
                 "이번에는 내림도 있고 나머지도 있는 나눗셈이에요. 종이컵 53개를 4모둠에 똑같이 나누어 볼게요.")
        self.play(Write(expr), run_time=1.2)
        self.wait(1.2)
        self.play(FadeOut(expr), run_time=0.4)
        board = DivBoard(self, 53, 4, who="모둠", item="종이컵")
        board.show_number()
        board.show_plates()
        board.deal_tens()
        board.exchange()
        board.deal_ones()
        left = VGroup(*board.all_ones[board.q2 * board.d:])
        ring = SurroundingRectangle(left, color=ORANGE, buff=0.15, stroke_width=6, corner_radius=0.12)
        tag = T("나머지 1", 46, ORANGE).next_to(ring, DOWN, buff=0.25)
        self.say(f"끝까지 나누고 남은 {o('1개')}가 {o('나머지')}", "끝까지 나누고 남은 1개가 나머지예요. 1은 4보다 작아서 더 나눌 수 없어요.")
        self.play(Create(ring), FadeIn(tag), run_time=0.7)
        self.wait(1.0)
        board.show_result()
        board.clear()

    def write53(self):
        self.section("몫과 나머지 쓰기")
        eq = M(f"53 ÷ 4 = {b('13')} … {o('1')}", 110).move_to([0, 1.2, 0])
        self.say(f"{g('53 ÷ 4 = 13')} … {o('1')}", "53 나누기 4는 13이고, 나머지는 1이에요.")
        self.play(Write(eq), run_time=1.2)
        chk = M(f"나머지 {o('1')} &lt; 나누는 수 {b('4')}", 60).move_to([0, -0.5, 0])
        mark = check_mark().next_to(chk, RIGHT, buff=0.4)
        self.say(f"{o('나머지')}가 나누는 수보다 작은지 꼭 확인해요", "나머지가 나누는 수보다 작은지 꼭 확인해요. 1은 4보다 작으니 바르게 계산했어요.")
        self.play(FadeIn(chk, shift=UP * 0.2), run_time=0.7)
        self.play(Create(mark), run_time=0.5)
        self.wait(1.8)
        self.settle()
        clear_stage(self, 0.7)
        self.hide_chip()


def check_mark(size=0.6, color=GREEN):
    p0, p1, p2 = (np.array(v) * size for v in ([-0.5, 0, 0], [-0.15, -0.4, 0], [0.55, 0.45, 0]))
    return VGroup(Line(p0, p1, stroke_width=14, color=color), Line(p1, p2, stroke_width=14, color=color))
