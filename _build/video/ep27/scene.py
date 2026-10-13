"""「수학 원리 돋보기」 27화 — 어림셈은 왜 할까? (2학기 1단원 곱셈 9차시, 화 코드 2-1-f)

열쇠고리 520원 × 4: 520을 약 500으로 → 약 2000원 → 정확히 2080원(수직선에서 비교)
→ 25개씩 18상자: 18을 약 20으로 → 약 500개 → 정확히 450개 → 어림으로 답이 맞는지 판단
최종: ./make_final.sh 27
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, Dot, FadeIn, FadeOut, Indicate, Line, SurroundingRectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from items import check_mark, cross_mark


def numline(lo, hi, step, y=0.0, L=-5.6, R=5.6, size=30):
    line = Line([L, y, 0], [R, y, 0], color=INK, stroke_width=5)
    ticks, labs = VGroup(), VGroup()
    v = lo
    while v <= hi + 1e-9:
        x = L + (R - L) * (v - lo) / (hi - lo)
        ticks.add(Line([x, y + 0.15, 0], [x, y - 0.15, 0], color=INK, stroke_width=3))
        labs.add(T(str(v), size).move_to([x, y - 0.5, 0]))
        v += step
    g_ = VGroup(line, ticks, labs)
    g_.at = lambda val: np.array([L + (R - L) * (val - lo) / (hi - lo), y, 0])
    return g_


class Ep27(EpisodeScene):
    EP_NO = 27
    EP_TITLE = "어림셈은 왜 할까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.key()
        self.boxes()
        self.judge()
        self.closing(f"어림셈은 가까운 {b('몇십')}·{b('몇백')}으로 바꾸어 {g('대략의 값')}을 구해요\n계산이 맞는지 판단할 때도 좋아요",
                     next_preview="28화 · 일 모형이 10개가 되면 어떻게 할까?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M(f"열쇠고리 한 개가 {b('520원')}이에요.\n{o('4개')}를 사려면 {g('얼마쯤')} 필요할까요?", 54).move_to([0, 1.3, 0])
        self.say("열쇠고리 520원짜리 4개", "축제 기념품 가게에서 열쇠고리 한 개가 520원이에요. 4개를 사려면 얼마쯤 필요할까요?")
        self.play(Write(q), run_time=1.2)
        t = M("정확한 값을 몰라도 빨리 알 수 있을까요?", 44).move_to([0, -0.6, 0])
        self.say("정확히 계산하기 전에 빨리 알 수 있을까요?", "정확히 계산하기 전에, 대략 얼마인지 빨리 알 수 있는 방법이 있을까요?")
        self.play(FadeIn(t), run_time=0.6)
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def key(self):
        self.section("곱해지는 수 어림하기")
        nl = numline(400, 700, 100, y=1.3)
        self.say(f"520은 몇백에 가까울까요?", "520은 500과 600 중 어디에 더 가까울까요?")
        self.play(FadeIn(nl), run_time=0.6)
        p = Dot(nl.at(520), radius=0.12, color=ORANGE)
        pl = T("520", 34, ORANGE).next_to(p, UP, buff=0.2)
        self.play(FadeIn(p, scale=2), FadeIn(pl), run_time=0.5)
        self.say(f"520은 {b('약 500')}", "520은 500에 더 가까워요. 그래서 약 500으로 어림해요.")
        self.play(Indicate(nl[2][1], color=BLUE, scale_factor=1.5), run_time=0.8)
        e1 = M(f"520 × 4 → {b('약 500')} × 4 = {g('약 2000원')}", 54).move_to([0, -0.6, 0])
        self.say(f"약 500 × 4 = {g('약 2000원')}", "약 500원씩 4개면 약 2000원이에요. 이렇게 대략의 값을 구하는 것을 어림셈이라고 해요.")
        self.play(FadeIn(e1), run_time=0.6)
        self.wait(0.8)
        e2 = M(f"정확히: 520 × 4 = {g('2080원')}", 54).move_to([0, -1.6, 0])
        self.say(f"정확히 계산하면 {g('2080원')}", "정확히 계산하면 520 곱하기 4는 2080원. 어림한 2000원과 아주 가까워요.")
        self.play(FadeIn(e2), run_time=0.6)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)

    def boxes(self):
        self.section("곱하는 수 어림하기")
        q = M(f"기념품 {b('25개')}씩 {o('18상자')}는 몇 개쯤일까요?", 50).move_to([0, 2.3, 0])
        self.say("25개씩 18상자", "이번에는 기념품이 25개씩 18상자 있어요. 몇 개쯤일까요?")
        self.play(FadeIn(q), run_time=0.6)
        nl = numline(10, 30, 5, y=1.0)
        p = Dot(nl.at(18), radius=0.12, color=ORANGE)
        pl = T("18", 34, ORANGE).next_to(p, UP, buff=0.2)
        self.say(f"18은 {o('약 20')}", "이번에는 곱하는 수 18을 어림해요. 18은 20에 더 가까우니까 약 20.")
        self.play(FadeIn(nl), FadeIn(p, scale=2), FadeIn(pl), run_time=0.8)
        e1 = M(f"25 × 18 → 25 × {o('약 20')} = {g('약 500개')}", 52).move_to([0, -0.6, 0])
        self.say(f"25 × 약 20 = {g('약 500개')}", "25 곱하기 약 20은 약 500개예요.")
        self.play(FadeIn(e1), run_time=0.6)
        e2 = M(f"정확히: 25 × 18 = {g('450개')}", 52).move_to([0, -1.6, 0])
        self.say(f"정확히는 {g('450개')}, 약 500개보다 조금 적어요", "정확히 계산하면 450개. 18을 20으로 조금 크게 어림했으니 실제 값은 어림값보다 조금 적어요.")
        self.play(FadeIn(e2), run_time=0.6)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)

    def judge(self):
        self.section("어림으로 판단하기")
        q = M(f"민호: 38 × 21 = {o('7980')}", 66).move_to([0, 1.8, 0])
        self.say("민호의 계산이 맞을까요?", "민호가 38 곱하기 21을 7980이라고 했어요. 맞을까요?")
        self.play(FadeIn(q), run_time=0.6)
        self.wait(1.5)
        e = M(f"어림: {b('약 40')} × {b('약 20')} = {g('약 800')}", 56).move_to([0, 0.5, 0])
        self.say(f"어림하면 약 40 × 약 20 = {g('약 800')}", "어림해 보면 약 40 곱하기 약 20, 약 800이에요.")
        self.play(FadeIn(e), run_time=0.6)
        x = cross_mark(0.7).next_to(q, RIGHT, buff=0.4)
        r = M(f"7980은 너무 커요! 정확히는 {g('798')}", 54).move_to([0, -0.8, 0])
        self.say(f"7980은 약 800보다 너무 커요", "7980은 약 800보다 10배 가까이 커요. 계산이 틀렸다는 것을 바로 알 수 있어요. 정확한 답은 798이에요.")
        self.play(Create(x), FadeIn(r), run_time=0.8)
        self.wait(1.8)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
