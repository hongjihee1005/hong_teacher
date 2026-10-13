"""「수학 원리 돋보기」 43화 — 1000 m는 1 km (1학기 5단원 3·4차시, 화 코드 1-5-b)

100 m 막대 10개 → 1000 m = 1 km → 1 km 500 m = 1500 m → 수직선(3 km와 4 km 사이 10칸) → 어림(엄지 1 cm, 한 뼘 12 cm, 약 500 m)
최종: ./make_final.sh 43
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Arrow, Brace, Create, Dot, FadeIn, FadeOut, Indicate, LaggedStart, Line, Rectangle,
                   SurroundingRectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage


class Ep43(EpisodeScene):
    EP_NO = 43
    EP_TITLE = "1000 m는 1 km"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.bars()
        self.convert()
        self.numline()
        self.estimate()
        self.closing(f"{b('1000 m')} = {o('1 km')} (1 킬로미터)\n잘 아는 길이를 기준으로 '약'을 붙여 어림해요",
                     next_preview="44화 · 1분보다 짧은 시간, 초")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M(f"드론 비행 대회 트랙은 {b('1000 m')}예요.\n이렇게 긴 길이를 더 간단히 나타낼 수 있을까요?", 50).move_to([0, 0.8, 0])
        self.say("드론 트랙은 1000 m", "드론 비행 대회 트랙의 길이는 1000 m예요. 이렇게 긴 길이를 더 간단히 나타낼 수 있을까요?")
        self.play(Write(q), run_time=1.3)
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def bars(self):
        self.section("100 m 막대 10개")
        bars = VGroup(*[Rectangle(width=1.15, height=0.5, fill_color=BLUE if k % 2 == 0 else "#7FA8E8", fill_opacity=1, stroke_color=INK, stroke_width=2)
                        for k in range(10)]).arrange(RIGHT, buff=0).move_to([0, 0.9, 0])
        labs = VGroup(*[T(str((k + 1) * 100), 24).next_to(bars[k], DOWN, buff=0.15).align_to(bars[k], RIGHT) for k in range(10)])
        self.say("100 m 막대를 하나씩 이어 붙여요", "100 m 막대를 하나씩 이어 붙여 볼게요.")
        self.play(LaggedStart(*[FadeIn(bk, shift=RIGHT * 0.2) for bk in bars], lag_ratio=0.15, run_time=2.0), LaggedStart(*[FadeIn(l) for l in labs], lag_ratio=0.15, run_time=2.0))
        br = Brace(bars, UP, color=ORANGE)
        bl = M(f"{b('1000 m')} = {o('1 km')}", 60).next_to(br, UP, buff=0.15)
        self.say(f"1000 m를 {o('1 km')}라고 해요", "100 m가 10개 모이면 1000 m. 1000 m를 1 km라 쓰고 1 킬로미터라고 읽어요.")
        self.play(FadeIn(br), FadeIn(bl), run_time=0.7)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def convert(self):
        self.section("km와 m로 나타내기")
        l1 = M(f"{o('1 km')}보다 {b('500 m')} 더 긴 길이 → {o('1 km')} {b('500 m')}", 50).move_to([0, 1.6, 0])
        l2 = M(f"{o('1 km')} {b('500 m')} = 1000 m + 500 m = {g('1500 m')}", 54).move_to([0, 0.4, 0])
        l3 = M(f"케이블카 {g('2340 m')} = {o('2 km')} {b('340 m')}", 54).move_to([0, -0.8, 0])
        self.say(f"1 km보다 500 m 더 → {o('1 km')} {b('500 m')}", "1 km보다 500 m 더 긴 길이를 1 km 500 m라고 해요.")
        self.play(FadeIn(l1), run_time=0.5)
        self.say(f"= {g('1500 m')}", "1 km는 1000 m이니까 1 km 500 m는 1500 m와 같아요.")
        self.play(FadeIn(l2), run_time=0.5)
        self.say(f"2340 m = {o('2 km')} {b('340 m')}", "거꾸로 길이가 2340 m인 케이블카는 2000 m와 340 m, 곧 2 km 340 m예요.")
        self.play(FadeIn(l3), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def numline(self):
        self.section("수직선에서 읽기")
        L, R, y = -5.0, 5.0, 0.6
        line = Line([L, y, 0], [R, y, 0], color=INK, stroke_width=5)
        ticks = VGroup()
        for k in range(11):
            x = L + (R - L) * k / 10
            ticks.add(Line([x, y + (0.3 if k in (0, 10) else 0.15), 0], [x, y - (0.3 if k in (0, 10) else 0.15), 0], color=INK, stroke_width=3))
        a = T("3 km", 36).move_to([L, y - 0.65, 0]); c = T("4 km", 36).move_to([R, y - 0.65, 0])
        self.say("3 km와 4 km 사이가 10칸이에요", "3 km와 4 km 사이를 작은 눈금 10칸으로 나누었어요. 한 칸은 1000 m를 10으로 나눈 100 m예요.")
        self.play(Create(line), FadeIn(ticks), FadeIn(a), FadeIn(c), run_time=0.8)
        p = L + (R - L) * 0.7
        arr = Arrow([p, y + 1.4, 0], [p, y + 0.2, 0], color=ORANGE, buff=0, stroke_width=6)
        self.play(Create(arr), run_time=0.5)
        r = M(f"3 km에서 {o('7칸')} → {g('3 km 700 m')} = {g('3700 m')}", 50).move_to([0, -1.2, 0])
        self.say(f"7칸 → {g('3 km 700 m')}", "화살표는 3 km에서 7칸 간 곳이니 3 km 700 m, 곧 3700 m예요.")
        self.play(FadeIn(r), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def estimate(self):
        self.section("어림하기")
        rows = [
            (f"엄지손가락 너비 ≈ {o('약 1 cm')}", "엄지손가락 너비는 약 1 cm예요."),
            (f"한 뼘 ≈ {o('약 12 cm')}", "한 뼘은 약 12 cm쯤 돼요. 사람마다 조금씩 달라요."),
            (f"학교에서 도서관까지 ≈ {o('약 500 m')} → 그 두 배쯤이면 {g('약 1 km')}", "학교에서 도서관까지 약 500 m라면, 그 두 배쯤 되는 거리는 약 1 km예요."),
        ]
        self.say("잘 아는 길이를 기준으로 어림해요", "길이를 어림할 때는 잘 아는 길이를 기준으로 삼아요.")
        for k, (mk, nar) in enumerate(rows):
            m = M(mk, 46)
            m.scale_to_fit_width(min(m.width, 12.0)).move_to([0, 1.6 - k * 1.1, 0])
            self.say(mk, nar)
            self.play(FadeIn(m), run_time=0.5)
            self.wait(0.6)
        t = M("어림한 길이는 '약'을 붙여 말해요", 44).move_to([0, -1.9, 0])
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
