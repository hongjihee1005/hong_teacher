"""「수학 원리 돋보기」 15화 — 들이는 어떻게 비교하고 나타낼까? (2학기 5단원 들이와 무게 2·3차시, 화 코드 2-5-a)

모양이 다른 두 물병 → 같은 컵으로 세기(가 6컵, 나 8컵) → 다른 컵으로 재면 비교가 어려움 → 약속한 단위 L, mL
→ 1 L = 1000 mL, 1 L 500 mL = 1500 mL → 알맞은 단위 고르기
최종: ./make_final.sh 15
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (
    DOWN, LEFT, RIGHT, UP,
    Create, FadeIn, FadeOut, Indicate, LaggedStart, SurroundingRectangle, ValueTracker, VGroup, Write, always_redraw,
)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from measure import Beaker, bottle, cup
from items import check_mark


class Ep15(EpisodeScene):
    EP_NO = 15
    EP_TITLE = "들이는 어떻게 비교하고 나타낼까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.count_cups()
        self.different_cups()
        self.units()
        self.convert()
        self.choose()
        self.closing(f"들이는 약속한 단위 {b('L')}와 {o('mL')}로 나타내요\n{b('1 L')} = {o('1000 mL')}",
                     next_preview="16화 · 눈금 읽기와 어림")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        b1 = bottle(2.8, 1.3).move_to([-2.2, 0.1, 0])
        b2 = bottle(3.3, 0.9).move_to([2.2, 0.35, 0])
        l1 = T("가", 48).next_to(b1, DOWN, buff=0.25)
        l2 = T("나", 48).next_to(b2, DOWN, buff=0.25)
        self.say("모양이 다른 물병 두 개가 있어요", "모양이 다른 물병 두 개가 있어요. 가는 짧고 통통하고, 나는 길고 날씬해요.")
        self.play(FadeIn(b1), FadeIn(b2), FadeIn(l1), FadeIn(l2), run_time=0.8)
        q = M(f"어느 물병에 물이 {b('더 많이')} 들어갈까요?", 50).move_to([0.5, 2.75, 0])
        self.say("어느 물병에 물이 더 많이 들어갈까요?", "어느 물병에 물이 더 많이 들어갈까요? 그릇에 담을 수 있는 양을 들이라고 해요.")
        self.play(Write(q), run_time=1.0)
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def count_cups(self):
        self.section("같은 컵으로 세기")
        b1 = bottle(2.4, 1.1).move_to([-4.8, 0.3, 0])
        b2 = bottle(2.8, 0.8).move_to([-4.8 + 0.0, 0.3, 0]).shift(RIGHT * 0)
        l1 = T("가", 40).next_to(b1, LEFT, buff=0.25)
        self.say("가 물병의 물을 같은 컵에 옮겨 담아요", "가 물병에 가득 담은 물을 똑같은 컵에 옮겨 담아 세어 볼게요.")
        self.play(FadeIn(b1), FadeIn(l1), run_time=0.5)
        row1 = VGroup(*[cup() for _ in range(6)]).arrange(RIGHT, buff=0.25).move_to([0.2, 1.0, 0])
        self.play(LaggedStart(*[FadeIn(c, shift=RIGHT * 0.3) for c in row1], lag_ratio=0.25, run_time=1.8),
                  b1[1].animate.stretch(0.05, 1, about_edge=DOWN), run_time=1.8)
        n1 = M(f"가: {o('6컵')}", 48).next_to(row1, RIGHT, buff=0.5)
        self.play(FadeIn(n1), run_time=0.4)
        self.say("나 물병도 옮겨 담아요", "나 물병도 같은 컵에 옮겨 담아 세어 볼게요.")
        b2.move_to([-4.8, -1.2, 0])
        l2 = T("나", 40).next_to(b2, LEFT, buff=0.25)
        self.play(FadeOut(b1), FadeOut(l1), FadeIn(b2), FadeIn(l2), run_time=0.5)
        row2 = VGroup(*[cup() for _ in range(8)]).arrange(RIGHT, buff=0.25).move_to([0.75, -1.2, 0])
        self.play(LaggedStart(*[FadeIn(c, shift=RIGHT * 0.3) for c in row2], lag_ratio=0.25, run_time=2.2),
                  b2[1].animate.stretch(0.05, 1, about_edge=DOWN), run_time=2.2)
        n2 = M(f"나: {b('8컵')}", 48).next_to(row2, RIGHT, buff=0.5)
        self.play(FadeIn(n2), run_time=0.4)
        self.say(f"{b('8컵')}인 나 물병이 {b('2컵')} 더 많이 들어가요", "가는 6컵, 나는 8컵. 나 물병이 컵 2개만큼 더 많이 들어가요.")
        self.play(Indicate(VGroup(*row2[6:]), color=BLUE, scale_factor=1.15), run_time=0.9)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def different_cups(self):
        self.section("컵이 다르면?")
        small = VGroup(*[cup(ORANGE, 0.42) for _ in range(9)]).arrange(RIGHT, buff=0.18).move_to([-2.6, 1.2, 0])
        big = VGroup(*[cup(BLUE, 0.75) for _ in range(5)]).arrange(RIGHT, buff=0.3).move_to([-3.0, -0.6, 0])
        t1 = M(f"민호: 작은 컵으로 {o('9컵')}", 42).next_to(small, RIGHT, buff=0.4)
        t2 = M(f"지아: 큰 컵으로 {b('5컵')}", 42).next_to(big, RIGHT, buff=0.4)
        self.say("두 친구가 서로 다른 컵으로 재었어요", "이번에는 두 친구가 각자 다른 컵으로 물병을 재었어요.")
        self.play(FadeIn(small), FadeIn(t1), run_time=0.7)
        self.play(FadeIn(big), FadeIn(t2), run_time=0.7)
        self.wait(0.8)
        self.say("9컵이 더 많을까요? 알 수 없어요!", "9컵이 5컵보다 많으니 민호의 물병이 더 클까요? 컵의 크기가 다르니 알 수 없어요!")
        self.play(Indicate(small, color=ORANGE), Indicate(big, color=BLUE), run_time=1.0)
        msg = M(f"누구나 같은 크기로 쓰는 {g('약속한 단위')}가 필요해요", 46).move_to([0, -2.2, 0])
        self.say(f"그래서 {g('약속한 단위')}가 필요해요", "그래서 누구나 똑같이 쓰는 약속한 단위가 필요해요.")
        self.play(FadeIn(msg, shift=UP * 0.2), run_time=0.6)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)

    def units(self):
        self.section("들이의 단위 L, mL")
        bk = Beaker(1000, major=100, minor=None, height=4.2, width=2.0).move_to([-3.6, 0.1, 0])
        bk.set_level(0)
        lv = ValueTracker(0)
        bk.water.add_updater(lambda m: m.become(bk.water_rect(lv.get_value())))
        self.say("비커에 물을 1000 mL까지 담아요", "비커에 물을 1000밀리리터까지 담아 볼게요.")
        self.play(FadeIn(bk), run_time=0.6)
        self.play(lv.animate.set_value(1000), run_time=2.4)
        bk.water.clear_updaters()
        u1 = M(f"{b('1 L')}  읽기: 1 {b('리터')}", 56).move_to([2.6, 1.6, 0])
        u2 = M(f"{o('1 mL')}  읽기: 1 {o('밀리리터')}", 56).move_to([2.6, 0.5, 0])
        eq = M(f"{b('1 L')} = {o('1000 mL')}", 80).move_to([2.6, -1.0, 0])
        self.say(f"들이의 단위: {b('리터(L)')}와 {o('밀리리터(mL)')}", "들이의 단위에는 리터와 밀리리터가 있어요. L는 리터, mL는 밀리리터라고 읽어요.")
        self.play(FadeIn(u1), run_time=0.5)
        self.play(FadeIn(u2), run_time=0.5)
        self.say(f"{o('1000 mL')}는 {b('1 L')}와 같아요", "1000밀리리터는 1리터와 같아요.")
        self.play(Write(eq), run_time=0.9)
        bx = SurroundingRectangle(eq, color=GREEN, buff=0.2, stroke_width=6, corner_radius=0.15)
        self.play(Create(bx), run_time=0.5)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)

    def convert(self):
        self.section("단위 바꾸기")
        rows = [
            (f"{b('1 L')} {o('500 mL')}", f"= {b('1000 mL')} + {o('500 mL')} = {g('1500 mL')}",
             "1리터 500밀리리터는 1000밀리리터와 500밀리리터를 더한 1500밀리리터예요."),
            (f"{b('2 L')}", f"= {g('2000 mL')}", "2리터는 1000밀리리터가 2개, 2000밀리리터예요."),
            (f"{g('3200 mL')}", f"= {b('3000 mL')} + {o('200 mL')} = {b('3 L')} {o('200 mL')}",
             "3200밀리리터는 3000밀리리터와 200밀리리터, 곧 3리터 200밀리리터예요."),
        ]
        ys = [1.7, 0.3, -1.1]
        for (a, rest, nar), y in zip(rows, ys):
            ma = M(a, 54).move_to([-4.2, y, 0])
            mr = M(rest, 50).next_to(ma, RIGHT, buff=0.3)
            grp = VGroup(ma, mr)
            if grp.width > 12.4:
                grp.scale_to_fit_width(12.4)
            grp.move_to([0, y, 0])
            self.say(plain_md(a + " " + rest), nar)
            self.play(FadeIn(ma), run_time=0.5)
            self.play(FadeIn(mr, shift=RIGHT * 0.2), run_time=0.7)
            self.wait(0.8)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def choose(self):
        self.section("알맞은 단위는?")
        items = [("우유갑 하나", "200 mL", "200 L"), ("욕조의 물", "200 L", "200 mL"), ("물약 한 번", "5 mL", "5 L")]
        rows = VGroup()
        for i, (name, right, wrong) in enumerate(items):
            y = 1.4 - i * 1.0
            r = VGroup(T(name, 46).move_to([-3.2, y, 0]), T(right, 46).move_to([0.6, y, 0]), T(wrong, 46).move_to([3.4, y, 0]))
            rows.add(r)
        self.say("알맞은 들이를 골라 보세요", "우유갑 하나, 욕조의 물, 물약 한 번. 알맞은 들이를 골라 보세요.")
        self.play(FadeIn(rows), run_time=0.8)
        self.wait(3.0)
        marks = VGroup()
        for r in rows:
            marks.add(SurroundingRectangle(r[1], color=GREEN, buff=0.12, stroke_width=6, corner_radius=0.12))
        self.say(f"작은 들이는 {o('mL')}, 큰 들이는 {b('L')}", "우유갑은 200밀리리터, 욕조는 200리터, 물약은 5밀리리터예요. 작은 들이는 밀리리터, 큰 들이는 리터로 나타내요.")
        self.play(LaggedStart(*[Create(m) for m in marks], lag_ratio=0.3, run_time=1.2),
                  *[r[2].animate.set_opacity(0.3) for r in rows])
        self.wait(1.8)
        self.settle()
        clear_stage(self, 0.7)
        self.hide_chip()


def plain_md(s):
    return s
