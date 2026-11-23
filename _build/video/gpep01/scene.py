"""「수학 원리 돋보기」 분수 준비 1화 — 같은 수씩 묶어 세기

사탕 8개를 하나씩 세기 → 2개씩 묶어 2, 4, 6, 8 / 사탕 15개를 5개씩 5, 10, 15 / 연습: 3개씩 12개
최종: GRADE=p ./make_final.sh 1
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, UP, FadeIn, FadeOut, Indicate, LaggedStart, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, M, T, b, g, o
from division import clear_stage
from prepkit import PINK, RED, PrepScene, count_under, items, regroup


class GpEp01(PrepScene):
    EP_NO = 1
    EP_TITLE = "같은 수씩 묶어 세기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.one_by_one()
        self.by_two()
        self.by_five()
        self.practice()
        self.closing(f"같은 수씩 묶어 세면 {g('빠르고 정확해요')}\n2씩: 2, 4, 6, 8 / 5씩: 5, 10, 15",
                     next_preview="분수 준비 2화 · 곱셈은 '몇씩 몇 묶음'")
        self.wait(0.5)

    def one_by_one(self):
        self.section("하나씩 세기")
        its = items(8)
        self.say("사탕이 몇 개일까요?", "사탕이 있어요. 모두 몇 개일까요?")
        self.play(LaggedStart(*[FadeIn(m, scale=0.5) for m in its], lag_ratio=0.1, run_time=1.0))
        nums = VGroup()
        self.say("하나씩 세어 볼까요?", "먼저 하나씩 세어 볼까요? 1, 2, 3, 4, 5, 6, 7, 8.")
        for i, m in enumerate(its):
            t = T(str(i + 1), 34, INK).next_to(m, DOWN, buff=0.2)
            nums.add(t)
            self.play(FadeIn(t), Indicate(m, scale_factor=1.3), run_time=0.35)
        self.say(f"모두 {g('8개')}", "모두 8개예요. 하나씩 세면 시간이 오래 걸려요.")
        self.wait(1.0)
        self.settle()
        self.its = its
        self.play(FadeOut(nums), run_time=0.4)

    def by_two(self):
        self.section("2개씩 묶어 세기")
        self.say(f"이번에는 {b('2개씩')} 묶어 볼까요?", "이번에는 2개씩 묶어 볼까요?")
        boxes = regroup(self, self.its, 2, gap=1.0)
        self.say(f"2, 4, 6, {g('8')}", "묶음마다 2씩 커져요. 2, 4, 6, 8!")
        count_under(self, boxes, 2, each=0.6)
        t = M(f"2씩 뛰어 세면 {g('네 번')} 만에 끝나요", 44).move_to([0, -1.6, 0])
        self.say("하나씩 셀 때보다 빨라요", "하나씩 8번 세던 것을, 2씩 4번만 세면 돼요. 훨씬 빨라요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def by_five(self):
        self.section("5개씩 묶어 세기")
        its = items(15, color=PINK, step=0.5, r=0.2)
        self.say("사탕 15개는 어떻게 셀까요?", "사탕이 더 많아졌어요. 이번에는 5개씩 묶어 볼까요?")
        self.play(FadeIn(its, lag_ratio=0.05), run_time=0.8)
        boxes = regroup(self, its, 5, step=0.5, gap=1.0)
        self.say(f"5, 10, {g('15')}", "5, 10, 15. 모두 15개예요.")
        count_under(self, boxes, 5, each=0.7)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def practice(self):
        self.section("연습해요")
        its = items(12, color=ORANGE)
        q = M(f"{b('3개씩')} 묶어 세면 모두 몇 개일까요?", 46).move_to([0, 2.4, 0])
        self.say("3개씩 묶어 세어 보세요", "연습해 볼까요? 3개씩 묶어 세면 모두 몇 개일까요?")
        self.play(FadeIn(its, lag_ratio=0.05), FadeIn(q), run_time=0.8)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        boxes = regroup(self, its, 3, gap=1.0)
        self.say(f"3, 6, 9, {g('12')}", "3, 6, 9, 12. 모두 12개예요.")
        count_under(self, boxes, 3, each=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
