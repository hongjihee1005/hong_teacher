"""「수학 원리 돋보기」 분수 준비 4화 — 곱셈구구가 생각나지 않을 때

6 × 3 → 6씩 3묶음을 그려 뛰어 세기 6, 12, 18 / 4 × 7 → 순서를 바꾸어 7 × 4 = 7, 14, 21, 28
아는 답에서 한 묶음 더하기: 5 × 4 = 20 → 5 × 5 = 25
최종: GRADE=p ./make_final.sh 4
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, RIGHT, UP, FadeIn, FadeOut, Indicate, LaggedStart, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, M, T, b, g, o
from division import clear_stage
from fracbasic import step_card
from prepkit import PINK, RED, PrepScene, count_under, items, regroup


class GpEp04(PrepScene):
    EP_NO = 4
    EP_TITLE = "곱셈구구가 생각나지 않을 때"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.draw()
        self.swap()
        self.add_one()
        self.closing(f"생각나지 않으면 ① {b('묶음을 그려')} 뛰어 세기\n② 순서를 바꾸기  ③ 아는 답에 {o('한 묶음 더하기')}",
                     next_preview="분수 준비 5화 · 나눗셈 ① 똑같이 나누어 주기")
        self.wait(0.5)

    def draw(self):
        self.section("방법 1 · 묶음을 그려 세기")
        q = M(f"{b('6')} × {o('3')} = ?", 70).move_to([0, 2.3, 0])
        self.say("6 × 3이 생각나지 않으면?", "6 곱하기 3이 바로 생각나지 않을 때는 어떻게 할까요?")
        self.play(Write(q), run_time=0.7)
        its = items(18, color=RED, step=0.42, r=0.17, y=0.6)
        self.say(f"{b('6')}개씩 {o('3')}묶음을 그려요", "6개씩 3묶음을 그려요. 공책에 동그라미를 그려도 좋아요.")
        self.play(FadeIn(its, lag_ratio=0.03), run_time=0.8)
        boxes = regroup(self, its, 6, y=0.6, step=0.42, gap=0.9)
        self.say(f"6, 12, {g('18')}", "그리고 6씩 뛰어 세요. 6, 12, 18.")
        count_under(self, boxes, 6, each=0.7)
        a = M(f"{b('6')} × {o('3')} = {g('18')}", 64).move_to([0, -1.6, 0])
        self.play(Write(a), run_time=0.6)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def swap(self):
        self.section("방법 2 · 순서 바꾸기")
        q = M(f"{b('4')} × {o('7')} = ?", 70).move_to([0, 2.1, 0])
        self.say("4 × 7은 4씩 일곱 번…", "4 곱하기 7은 4씩 일곱 번 세야 해서 길어요.")
        self.play(Write(q), run_time=0.6)
        t = M(f"순서를 바꾸면 {b('7')} × {o('4')}: 7씩 네 번만!", 48).move_to([0, 0.9, 0])
        self.say("순서를 바꾸면 7씩 네 번", "앞 화에서 배운 것처럼 순서를 바꾸어도 답은 같아요. 7 곱하기 4로 바꾸면 7씩 네 번만 세면 돼요.")
        self.play(FadeIn(t), run_time=0.5)
        nums = VGroup(*[T(str(7 * (i + 1)), 64, BLUE) for i in range(4)]).arrange(RIGHT, buff=1.0).move_to([0, -0.5, 0])
        self.say(f"7, 14, 21, {g('28')}", "7, 14, 21, 28.")
        self.play(LaggedStart(*[FadeIn(n_, scale=1.4) for n_ in nums], lag_ratio=0.6, run_time=2.0))
        a = M(f"{b('4')} × {o('7')} = {g('28')}", 64).move_to([0, -1.9, 0])
        self.play(Write(a), run_time=0.6)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def add_one(self):
        self.section("방법 3 · 아는 답에 한 묶음 더하기")
        q = M(f"{b('5')} × {o('5')} = ?", 70).move_to([0, 2.1, 0])
        self.say("5 × 5가 헷갈리면?", "5 곱하기 5가 헷갈린다면, 혹시 5 곱하기 4는 알고 있나요?")
        self.play(Write(q), run_time=0.6)
        k = M(f"{b('5')} × {o('4')} = 20  (알고 있어요)", 50).move_to([0, 0.8, 0])
        self.play(FadeIn(k), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        s = M(f"5씩 {o('한 묶음 더')} → 20 + 5 = {g('25')}", 56).move_to([0, -0.5, 0])
        self.say(f"20에 5를 더하면 {g('25')}", "5 곱하기 5는 5 곱하기 4보다 5씩 한 묶음 더 많아요. 20 더하기 5는 25.")
        self.play(FadeIn(s), run_time=0.6)
        a = M(f"{b('5')} × {o('5')} = {g('25')}", 64).move_to([0, -1.8, 0])
        self.play(Write(a), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
