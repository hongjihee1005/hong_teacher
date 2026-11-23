"""「수학 원리 돋보기」 분수 특별편 6화 — 여러 개 중의 부분도 분수로

사과 12개를 3개씩 묶으면 4묶음 → 9개는 3묶음 → 9는 12의 4분의 3
① 몇 묶음으로 똑같이? → 분모 ② 그중 몇 묶음? → 분자 ③ '9는 12의 4분의 3'
자주 하는 실수: 분자에 개수(9)를 씀 → 분자는 묶음 수
묶는 방법이 달라지면: 2개씩 6묶음 → 4는 12의 6분의 2 / 연습: 사탕 8개를 2개씩, 6개는 8의 4분의 3
최종: GRADE=f ./make_final.sh 6
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, marble, row
from fracbasic import frac_slots, slot_num, step_card
from items import check_mark, cross_mark, group_boxes, layout

RED = "#E0533D"


class GfEp06(EpisodeScene):
    GRADE, SEM = "F", 1
    LABEL = "분수 특별편 {}화"
    EP_NO = 6
    EP_TITLE = "여러 개 중의 부분도 분수로"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.steps()
        self.mistake()
        self.other_way()
        self.practice()
        self.closing(f"여러 개도 {g('똑같이 묶으면')} 분수로 나타낼 수 있어요\n전체 묶음 수 → {b('분모')}, 그중 묶음 수 → {o('분자')}",
                     next_preview="분수 특별편 7화 · 몇 개가 모이면 1이 될까?")
        self.wait(0.5)

    def items(self, n, color=RED, y=0.9, step=0.62, r=0.24):
        its = VGroup(*[marble(color, r) for _ in range(n)])
        for m, p in zip(its, layout(n, n, 1, y=y, step=step)):
            m.move_to(p)
        return its

    def regroup(self, its, per, y=0.9, step=0.62, gap=1.0, color=BLUE):
        n = len(its)
        pts = layout(n, per, n // per, y=y, step=step, gap=gap)
        self.play(*[m.animate.move_to(p) for m, p in zip(its, pts)], run_time=0.8)
        boxes = group_boxes(list(its), per, n // per, color=color)
        self.play(LaggedStart(*[Create(bx) for bx in boxes], lag_ratio=0.3, run_time=0.9))
        return boxes

    def problem(self):
        self.section("문제")
        self.apples = self.items(12)
        self.say("사과가 12개 있어요", "사과가 12개 있어요.")
        self.play(LaggedStart(*[FadeIn(a, scale=0.5) for a in self.apples], lag_ratio=0.08, run_time=1.2))
        q = row("사과", o("9개"), "는 12개의", o("얼마"), "일까요?", size=48).move_to([0, 2.4, 0])
        self.say("9개는 12개의 얼마일까요?", "그중 9개는 12개의 얼마일까요? 분수로 나타낼 수 있을까요?")
        self.play(FadeIn(q), *[self.apples[i].animate.scale(1.15) for i in range(9)], run_time=0.6)
        self.wait(1.0)
        self.pause_screen(5)
        self.settle()
        self.play(FadeOut(q), *[self.apples[i].animate.scale(1 / 1.15) for i in range(9)], run_time=0.4)

    def steps(self):
        self.section("3단계로 나타내기")
        c1 = step_card(1, f"{g('똑같이')} 묶어요: 3개씩 묶으면 몇 묶음?").move_to([0, 2.4, 0])
        self.say("1단계: 3개씩 똑같이 묶어요", "1단계. 사과를 3개씩 똑같이 묶어요.")
        self.play(FadeIn(c1), run_time=0.4)
        self.boxes = self.regroup(self.apples, 3)
        nums = VGroup(*[T(str(i + 1), 34, BLUE).next_to(bx, DOWN, buff=0.15) for i, bx in enumerate(self.boxes)])
        self.play(LaggedStart(*[FadeIn(n_) for n_ in nums], lag_ratio=0.5, run_time=1.0))
        slots = frac_slots(0.85, (0, -1.6, 0))
        den = slot_num(slots.bot, 4, BLUE, 70)
        self.say(f"전체 {b('4묶음')} → 분모 {b('4')}", "전체가 4묶음이에요. 그래서 분모는 4예요.")
        self.play(FadeIn(slots), run_time=0.3)
        self.play(FadeIn(den), run_time=0.4)
        c2 = step_card(2, "9개는 몇 묶음인가요?").move_to([0, 2.4, 0])
        self.say("2단계: 9개는 몇 묶음?", "2단계. 9개는 몇 묶음일까요?")
        self.play(FadeOut(c1), FadeIn(c2), run_time=0.4)
        self.play(*[self.boxes[i].animate.set_stroke(ORANGE, 9) for i in range(3)],
                  *[nums[i].animate.set_color(ORANGE) for i in range(3)], run_time=0.6)
        num = slot_num(slots.top, 3, ORANGE, 70)
        self.say(f"9개 = {o('3묶음')} → 분자 {o('3')}", "9개는 3묶음이에요. 그래서 분자는 3이에요.")
        self.play(FadeIn(num), run_time=0.4)
        c3 = step_card(3, f"9는 12의 {b('4분의')} {o('3')}").move_to([0, 2.4, 0])
        self.say(f"3단계: 9는 12의 {b('4분의')} {o('3')}", "3단계. 9는 12의 4분의 3이라고 말해요.")
        self.play(FadeOut(c2), FadeIn(c3), FadeOut(slots.top), FadeOut(slots.bot), run_time=0.5)
        self.play(Indicate(VGroup(num, den, slots.line), color=GREEN, scale_factor=1.15), run_time=0.6)
        self.wait(1.2)
        self.settle()
        self.keep = VGroup(num, den, slots.line, nums)
        self.play(FadeOut(c3), run_time=0.3)

    def mistake(self):
        self.section("자주 하는 실수")
        w = frac(9, 4, 70, cn=SOFT, cd=SOFT).move_to([4.4, -1.6, 0])
        self.say("분자에 9를 쓰면 될까요?", "어떤 친구는 9개니까 분자에 9를 써서 4분의 9라고 했어요.")
        self.play(FadeIn(w), run_time=0.5)
        no = cross_mark(0.4).next_to(w, LEFT, buff=0.3)
        t = M(f"분자는 {o('개수')}가 아니라 {o('묶음 수')}", 44).move_to([0, 2.4, 0])
        self.say(f"분자에는 {o('묶음 수')}를 써요", "분모가 묶음 수이니까 분자도 묶음 수를 써야 해요. 9개는 3묶음, 분자는 3이에요.")
        self.play(Create(no), FadeIn(t), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def other_way(self):
        self.section("다르게 묶으면?")
        its = self.items(12)
        self.play(FadeIn(its), run_time=0.4)
        self.say("이번에는 2개씩 묶어 볼까요?", "같은 사과 12개를 이번에는 2개씩 묶어 볼까요?")
        boxes = self.regroup(its, 2, gap=0.95)
        self.play(*[boxes[i].animate.set_stroke(ORANGE, 9) for i in range(2)], run_time=0.5)
        a = row("전체", b("6묶음"), ", 4개는", o("2묶음"), "→ 4는 12의", frac(2, 6, 52, cn=ORANGE, cd=BLUE), size=44).move_to([0, -1.2, 0])
        self.say(f"4는 12의 {b('6분의')} {o('2')}", "2개씩 묶으면 6묶음이고, 4개는 2묶음이에요. 그래서 4는 12의 6분의 2예요.")
        self.play(FadeIn(a), run_time=0.6)
        t = M(f"묶는 방법에 따라 {b('분모')}가 달라져요", 42).move_to([0, -2.3, 0])
        self.say("몇 개씩 묶는지 꼭 확인해요", "몇 개씩 묶는지에 따라 분모가 달라지니, 묶음을 꼭 확인해요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def practice(self):
        self.section("연습해요")
        its = self.items(8, color="#B05FD0")
        q = row("사탕 8개를 2개씩 묶으면,", o("6개"), "는 8의 얼마일까요?", size=44).move_to([0, 2.4, 0])
        self.say("연습: 6개는 8의 얼마?", "연습해 볼까요? 사탕 8개를 2개씩 묶으면, 6개는 8의 얼마일까요?")
        self.play(FadeIn(its), FadeIn(q), run_time=0.6)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        boxes = self.regroup(its, 2, gap=1.0)
        self.play(*[boxes[i].animate.set_stroke(ORANGE, 9) for i in range(3)], run_time=0.5)
        a = row("전체", b("4묶음"), ", 6개는", o("3묶음"), "→ 6은 8의", frac(3, 4, 52, cn=ORANGE, cd=BLUE), size=44).move_to([0, -1.3, 0])
        self.say(f"답: 6은 8의 {b('4분의')} {o('3')}", "전체는 4묶음, 6개는 3묶음이에요. 그래서 6은 8의 4분의 3이에요.")
        self.play(FadeIn(a), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
