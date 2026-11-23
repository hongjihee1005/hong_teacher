"""「수학 원리 돋보기」 분수 준비 6화 — 나눗셈 ② 몇 개씩 묶기

사탕 12개를 한 봉지에 3개씩 → 4봉지 → 12 ÷ 3 = 4 / 같은 식, 두 가지 뜻(몇 명에게 / 몇 개씩) 견주기
연습: 15개를 5개씩 → 3묶음
최종: GRADE=p ./make_final.sh 6
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, RIGHT, UP, FadeIn, FadeOut, Indicate, LaggedStart, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, M, T, b, g, o
from division import clear_stage
from prepkit import PINK, RED, PrepScene, items, regroup


class GpEp06(PrepScene):
    EP_NO = 6
    EP_TITLE = "나눗셈 ② 몇 개씩 묶기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.bags()
        self.compare()
        self.practice()
        self.closing(f"12개를 3개씩 묶으면 {g('4묶음')}: {b('12')} ÷ {o('3')} = {g('4')}\n나눗셈은 '몇 명에게'도, '몇 개씩'도 구할 수 있어요",
                     next_preview="분수 준비 7화 · 곱셈으로 나눗셈 답 찾기")
        self.wait(0.5)

    def bags(self):
        self.section("몇 개씩 묶기")
        its = items(12)
        q = M(f"한 봉지에 {b('3개')}씩 담으면 {o('몇 봉지')}가 될까요?", 46).move_to([0, 2.4, 0])
        self.say("3개씩 담으면 몇 봉지?", "사탕 12개를 한 봉지에 3개씩 담으려고 해요. 몇 봉지가 될까요?")
        self.play(FadeIn(its, lag_ratio=0.05), FadeIn(q), run_time=0.8)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        self.say("3개씩 묶어 볼까요?", "3개씩 묶어 볼까요?")
        boxes = regroup(self, its, 3, gap=1.0)
        nums = VGroup(*[T(f"{i + 1}봉지", 34, ORANGE).next_to(bx, DOWN, buff=0.2) for i, bx in enumerate(boxes)])
        self.say(f"{g('4봉지')}가 되었어요", "1봉지, 2봉지, 3봉지, 4봉지. 4봉지가 되었어요.")
        self.play(LaggedStart(*[FadeIn(n_) for n_ in nums], lag_ratio=0.6, run_time=1.8))
        eq = M(f"{b('12')} ÷ {o('3')} = {g('4')}", 72).move_to([0, -1.6, 0])
        self.say(f"이것도 {b('12')} ÷ {o('3')} = {g('4')}", "이것도 나눗셈으로 12 나누기 3은 4라고 써요.")
        self.play(Write(eq), run_time=0.7)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def compare(self):
        self.section("같은 식, 두 가지 뜻")
        eq = M(f"{b('12')} ÷ {o('3')} = {g('4')}", 72).move_to([0, 2.1, 0])
        a = M(f"① {o('3명')}에게 똑같이 나누면\n   한 명에게 {g('4개')}", 42).move_to([-3.4, 0.2, 0])
        c = M(f"② {o('3개')}씩 묶으면\n   {g('4묶음')}", 42).move_to([3.4, 0.2, 0])
        self.say("같은 식, 두 가지 뜻", "같은 12 나누기 3도 두 가지 뜻이 있어요.")
        self.play(Write(eq), run_time=0.6)
        self.say(f"① {o('3명에게')} 나누어 주기", "하나는 3명에게 똑같이 나누어 주면 한 명에게 몇 개인지 구하는 것.")
        self.play(FadeIn(a), run_time=0.5)
        self.say(f"② {o('3개씩')} 묶기", "또 하나는 3개씩 묶으면 몇 묶음인지 구하는 것. 둘 다 답은 4예요.")
        self.play(FadeIn(c), run_time=0.5)
        t = M(f"둘 다 {g('똑같이')} 나누는 거예요", 46).move_to([0, -1.8, 0])
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def practice(self):
        self.section("연습해요")
        its = items(15, color=PINK, step=0.5, r=0.2)
        q = M(f"{b('15개')}를 {o('5개')}씩 묶으면 몇 묶음일까요?", 46).move_to([0, 2.4, 0])
        self.say("15개를 5개씩 묶으면?", "연습해 볼까요? 15개를 5개씩 묶으면 몇 묶음일까요?")
        self.play(FadeIn(its, lag_ratio=0.05), FadeIn(q), run_time=0.8)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        regroup(self, its, 5, step=0.5, gap=1.0)
        eq = M(f"{g('3묶음')}: {b('15')} ÷ {o('5')} = {g('3')}", 64).move_to([0, -1.5, 0])
        self.say(f"{b('15')} ÷ {o('5')} = {g('3')}", "3묶음이에요. 15 나누기 5는 3.")
        self.play(Write(eq), run_time=0.7)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
