"""「수학 원리 돋보기」 4학년 18화 — 어림셈은 언제 쓸까? (4-1 3단원 8차시, 화 코드 4-1-3-f)

곱셈: 가까운 몇백·몇십으로 (198 × 31 → 200 × 30 = 6000) / 나눗셈: 나누기 쉬운 수로 (395 ÷ 21 → 400 ÷ 20 = 20)
어림셈의 답은 여러 가지일 수 있음 / 정확한 값이 필요 없을 때·계산 확인할 때
최종: GRADE=4 ./make_final.sh 18
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Arrow, Create, FadeIn, FadeOut, Indicate, LaggedStart, SurroundingRectangle,
                   VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage


class G4Ep18(EpisodeScene):
    GRADE, SEM = 4, 1
    EP_NO = 18
    EP_TITLE = "어림셈은 언제 쓸까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.mul()
        self.div()
        self.check()
        self.closing(f"어림셈은 {o('계산하기 쉬운 수')}로 바꾸어 얼마쯤인지 알아보는 것\n답이 알맞은지 {g('확인할 때')}도 써요",
                     next_preview="4학년 19화 · 밀면 무엇이 바뀔까?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M(f"한 송이에 {b('198원')}인 꽃을 {o('31송이')} 사려면\n6000원으로 충분할까요?", 52)
        q.scale_to_fit_width(min(q.width, 11.0)).move_to([0, 1.4, 0])
        self.say("6000원으로 충분할까요?", "가정의 달 축제에서 한 송이에 198원인 꽃을 31송이 사려고 해요. 6000원이면 충분할까요?")
        self.play(Write(q), run_time=1.3)
        e = M("정확히 계산해야 할까요?", 56, SOFT).move_to([0, -0.7, 0])
        self.play(FadeIn(e), run_time=0.5)
        self.wait(1.0)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def mul(self):
        self.section("곱셈 어림")
        l1 = M(f"198 → {o('약 200')}     31 → {o('약 30')}", 56).move_to([0, 1.7, 0])
        l2 = M(f"200 × 30 = {g('6000')}", 70).move_to([0, 0.5, 0])
        self.say(f"가까운 {o('몇백')}, {o('몇십')}으로 바꿔요", "198은 200에 가깝고, 31은 30에 가까워요. 계산하기 쉬운 수로 바꾸어요.")
        self.play(FadeIn(l1), run_time=0.6)
        self.say(f"200 × 30 = {g('6000')}쯤", "200 곱하기 30은 6000. 꽃값은 6000원쯤이에요.")
        self.play(FadeIn(l2), run_time=0.6)
        l3 = M(f"실제: 198 × 31 = {b('6138')}  → 6000원보다 조금 많아요", 44).move_to([0, -0.8, 0])
        l3.scale_to_fit_width(min(l3.width, 12.0))
        self.say("31송이는 30보다 많으니 조금 모자라요", "그런데 31송이는 30송이보다 많아요. 실제로 계산하면 6138원이라 6000원으로는 조금 모자라요.")
        self.play(FadeIn(l3), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def div(self):
        self.section("나눗셈 어림")
        q = M("사탕 395개를 21명이 나누면 한 명에 약 몇 개?", 46)
        q.scale_to_fit_width(min(q.width, 10.4)).move_to([0.6, 2.2, 0])
        self.say("395 ÷ 21은 약 얼마?", "사탕 395개를 21명이 똑같이 나누면 한 명에 약 몇 개씩 받을까요?")
        self.play(FadeIn(q), run_time=0.6)
        a = M(f"395 → {o('약 400')}     21 → {o('약 20')}", 54).move_to([0, 0.9, 0])
        b_ = M(f"400 ÷ 20 = {g('20')}  → 약 20개씩", 60).move_to([0, -0.3, 0])
        self.say(f"나누기 쉬운 수로 바꿔요", "나누어지는 수와 나누는 수를 나누기 쉬운 수로 바꾸어요. 395는 약 400, 21은 약 20.")
        self.play(FadeIn(a), run_time=0.6)
        self.say(f"400 ÷ 20 = {g('20')}", "400 나누기 20은 20. 한 명에 약 20개씩 받아요.")
        self.play(FadeIn(b_), run_time=0.6)
        c = M(f"390 ÷ 20, 400 ÷ 25 … 어림셈의 답은 {o('여러 가지')}일 수 있어요", 42).move_to([0, -1.5, 0])
        c.scale_to_fit_width(min(c.width, 12.2))
        self.say(f"어림셈의 답은 {o('여러 가지')}", "어떤 수로 바꾸느냐에 따라 어림셈의 답은 여러 가지일 수 있어요.")
        self.play(FadeIn(c), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def check(self):
        self.section("계산 확인하기")
        q = M(f"친구의 답: 412 × 29 = {o('1948')}", 60).move_to([0, 1.6, 0])
        self.say("이 계산은 맞을까요?", "친구가 412 곱하기 29를 1948이라고 계산했어요. 맞을까요?")
        self.play(FadeIn(q), run_time=0.6)
        a = M(f"어림: 400 × 30 = {g('12000')}", 60).move_to([0, 0.3, 0])
        self.say(f"어림하면 {g('12000')}쯤", "어림하면 400 곱하기 30, 12000쯤이어야 해요.")
        self.play(FadeIn(a), run_time=0.6)
        c = M(f"1948은 너무 작아요 → 다시 계산 → {b('11948')}", 50).move_to([0, -1.0, 0])
        c.scale_to_fit_width(min(c.width, 12.0))
        self.say("1948은 너무 작아요!", "1948은 12000과 너무 달라요. 다시 계산하면 11948. 어림셈으로 실수를 찾을 수 있어요.")
        self.play(FadeIn(c), run_time=0.6)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
