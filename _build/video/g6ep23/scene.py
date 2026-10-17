"""「수학 원리 돋보기」 6학년 23화 — 생활 속 백분율 (6-1 4단원 7차시, 화 코드 6-1-4-f)

설문 조사, 불량품, 할인 금액, 이자의 비율 등 → (비교하는 양) ÷ (기준량) × 100 에 % 붙이기
(예시 수: 20000원 가방을 15000원에 팔면 할인 금액 5000원 → 25 % / 반 25명 중 찬성 14명 → 56 % — 이 영상에서 정한 수)
(생각을 더하다: 지난달 전기 280 kWh 중 14 kWh 줄이기 → 5 %)
최종: GRADE=6 ./make_final.sh 23
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Brace, Create, FadeIn, FadeOut, Indicate, LaggedStart, Rectangle, VGroup,
                   Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, row


class G6Ep23(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 23
    EP_TITLE = "생활 속 백분율"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.sale()
        self.energy()
        self.closing(f"(백분율) = ({o('비교하는 양')}) ÷ ({b('기준량')}) × 100\n할인율·설문 결과·절약한 양을 백분율로 견주어요",
                     next_preview="6학년 24화 · 띠그래프와 원그래프")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("20000원짜리 가방을 15000원에 팔아요.\n몇 %를 할인한 것일까요?", 44).move_to([0.6, 1.6, 0])
        self.say("몇 % 할인?", "20000원짜리 가방을 15000원에 팔아요. 몇 퍼센트를 할인한 것일까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def sale(self):
        self.section("할인율")
        W = 8.0
        full = Rectangle(width=W, height=0.8, fill_color=BLUE, fill_opacity=0.3, stroke_color=INK, stroke_width=3).move_to([0, 1.8, 0])
        lf = M(b("원래 가격 20000원"), 30).next_to(full, UP, buff=0.12)
        part = Rectangle(width=W * 0.25, height=0.8, fill_color=ORANGE, fill_opacity=0.8, stroke_color=INK, stroke_width=3).align_to(full, RIGHT).set_y(1.8)
        lp = M(o("할인 5000원"), 30).next_to(part, DOWN, buff=0.12)
        self.say(f"할인 금액은 {o('5000원')}", "할인한 금액은 20000에서 15000을 뺀 5000원이에요.")
        self.play(FadeIn(full), FadeIn(lf), run_time=0.5)
        self.play(FadeIn(part), FadeIn(lp), run_time=0.5)
        e = row("5000 ÷ 20000 × 100 =", M(g("25 %"), 50), size=44).move_to([0, -0.4, 0])
        t = M(f"기준량: 원래 가격, 비교하는 양: 할인 금액", 32, SOFT).move_to([0, 0.4, 0])
        self.say(f"5000 ÷ 20000 × 100 = {g('25 %')}", "기준량은 원래 가격, 비교하는 양은 할인 금액이에요. 5000 나누기 20000에 100을 곱하면 25. 25 퍼센트 할인했어요.")
        self.play(FadeIn(t), FadeIn(e), run_time=0.7)
        s = M(f"반 25명 중 찬성 14명 → 14 ÷ 25 × 100 = {g('56 %')}", 38).move_to([0, -1.5, 0])
        self.say(f"설문 결과도 {g('백분율')}로", "설문 조사 결과도 백분율로 나타내요. 25명 중 14명이 찬성했다면 56 퍼센트가 찬성한 거예요.")
        self.play(FadeIn(s), run_time=0.6)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def energy(self):
        self.section("전기 아껴 쓰기")
        q = M("지난달 전기 사용량 280 kWh 중에서\n이번 달에 14 kWh를 줄이려고 해요.", 40).move_to([0, 1.8, 0])
        self.say("지난달의 몇 %를 줄일까요?", "유준이네는 지난달 전기 사용량 280 킬로와트시 중에서 이번 달에 14 킬로와트시를 줄이려고 해요. 지난달의 몇 퍼센트일까요?")
        self.play(FadeIn(q), run_time=0.6)
        e1 = row("14 : 280 →", frac(14, 280, 46), "=", "0.05", size=44).move_to([0, 0.2, 0])
        e2 = M(f"0.05 × 100 = 5 → {g('5 %')}", 46).move_to([0, -1.1, 0])
        self.say(f"비율 0.05 = {g('5 %')}", "기준량은 지난달 사용량이에요. 비 14 대 280의 비율은 0.05, 백분율로 5 퍼센트예요.")
        self.play(FadeIn(e1), run_time=0.6)
        self.play(FadeIn(e2), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
