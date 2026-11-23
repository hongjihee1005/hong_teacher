"""「수학 원리 돋보기」 분수 준비 2화 — 곱셈은 '몇씩 몇 묶음'

구슬 3개씩 4묶음 → 3+3+3+3 = 12 → 3 × 4 = 12, '3 곱하기 4' / 2씩 5묶음 = 2 × 5 / 연습 4씩 3묶음
최종: GRADE=p ./make_final.sh 2
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, UP, FadeIn, FadeOut, Indicate, LaggedStart, ReplacementTransform, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, M, T, b, g, o
from division import clear_stage
from prepkit import PINK, RED, PrepScene, count_under, items, regroup


class GpEp02(PrepScene):
    EP_NO = 2
    EP_TITLE = "곱셈은 '몇씩 몇 묶음'"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.groups()
        self.more()
        self.practice()
        self.closing(f"{b('3')}씩 {o('4')}묶음 = 3 + 3 + 3 + 3 = {b('3')} × {o('4')} = {g('12')}\n곱셈은 같은 수를 여러 번 더한 것",
                     next_preview="분수 준비 3화 · 줄 맞춰 놓으면 곱셈이 보여요")
        self.wait(0.5)

    def groups(self):
        self.section("몇씩 몇 묶음")
        its = items(12)
        self.say("구슬이 3개씩 묶여 있어요", "구슬이 3개씩 묶여 있어요.")
        self.add(its)
        boxes = regroup(self, its, 3, gap=1.0, run_time=0.01)
        t1 = M(f"한 묶음에 {b('3개')}씩", 44).move_to([-3.0, 2.3, 0])
        t2 = M(f"묶음이 {o('4개')}", 44).move_to([3.0, 2.3, 0])
        self.say(f"{b('3')}씩 {o('4')}묶음", "한 묶음에 3개씩, 묶음이 4개. 이것을 3씩 4묶음이라고 해요.")
        self.play(FadeIn(t1), *[Indicate(m, scale_factor=1.2) for m in its[:3]], run_time=0.7)
        nums = VGroup(*[T(str(i + 1), 36, ORANGE).next_to(bx, UP, buff=0.15) for i, bx in enumerate(boxes)])
        self.play(FadeIn(t2), FadeIn(nums, lag_ratio=0.3), run_time=0.9)
        add = M(f"{b('3')} + {b('3')} + {b('3')} + {b('3')} = {g('12')}", 60).move_to([0, -0.9, 0])
        self.say("더하면 3 + 3 + 3 + 3 = 12", "모두 몇 개일까요? 3을 네 번 더하면 12예요.")
        self.play(Write(add), run_time=1.0)
        self.wait(0.8)
        mul = M(f"{b('3')} × {o('4')} = {g('12')}", 80).move_to([0, -0.9, 0])
        self.say(f"짧게 쓰면 {b('3')} × {o('4')} = {g('12')}", "같은 수를 여러 번 더할 때는 짧게 이렇게 써요. 3 곱하기 4는 12.")
        self.play(ReplacementTransform(add, mul), run_time=1.0)
        r = M(f"읽기: '{b('3')} 곱하기 {o('4')}는 {g('12')}'", 42).move_to([0, -2.1, 0])
        self.play(FadeIn(r), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def more(self):
        self.section("다른 묶음도")
        its = items(10, color=PINK)
        self.add(its)
        boxes = regroup(self, its, 2, gap=1.0, run_time=0.01)
        self.say(f"{b('2')}씩 {o('5')}묶음은?", "이번에는 2씩 5묶음이에요. 곱셈식으로 나타내 볼까요?")
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        count_under(self, boxes, 2, each=0.5)
        mul = M(f"{b('2')} × {o('5')} = {g('10')}", 76).move_to([0, -1.4, 0])
        self.say(f"{b('2')} × {o('5')} = {g('10')}", "2씩 뛰어 세면 2, 4, 6, 8, 10. 2 곱하기 5는 10이에요.")
        self.play(Write(mul), run_time=0.8)
        tip = M(f"앞 수 = {b('한 묶음에 몇 개')},  뒤 수 = {o('몇 묶음')}", 40).move_to([0, -2.3, 0])
        self.play(FadeIn(tip), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def practice(self):
        self.section("연습해요")
        its = items(12, color=ORANGE)
        self.add(its)
        boxes = regroup(self, its, 4, gap=1.1, run_time=0.01)
        q = M("곱셈식으로 나타내고, 모두 몇 개인지 구해 보세요", 42).move_to([0, 2.4, 0])
        self.say("몇씩 몇 묶음일까요?", "연습해 볼까요? 몇씩 몇 묶음인지 보고 곱셈식으로 나타내 보세요.")
        self.play(FadeIn(q), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        count_under(self, boxes, 4, each=0.6)
        mul = M(f"{b('4')}씩 {o('3')}묶음 → {b('4')} × {o('3')} = {g('12')}", 60).move_to([0, -1.5, 0])
        self.say(f"{b('4')} × {o('3')} = {g('12')}", "4씩 3묶음이니까 4 곱하기 3, 4, 8, 12. 모두 12개예요.")
        self.play(Write(mul), run_time=0.8)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
