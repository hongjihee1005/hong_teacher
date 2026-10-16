"""「수학 원리 돋보기」 4학년 29화 — 분모는 왜 더하지 않을까? (4-2 1단원 분수의 덧셈과 뺄셈 2차시, 화 코드 4-2-1-a)

3/7 + 5/7: 1/7이 3개 + 5개 = 8개 → 8/7 = 1 1/7 (분모는 조각의 크기라 그대로)
흔한 실수 3/7 + 5/7 = 8/14 가 왜 틀렸는지 / 2/5 + 1/5 = 3/5
최종: GRADE=4 ./make_final.sh 29
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, Cross, FadeIn, FadeOut, Indicate, LaggedStart, SurroundingRectangle,
                   Transform, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, frac_bar, mixed, row

RED = "#C0392B"


class G4Ep29(EpisodeScene):
    GRADE, SEM = 4, 2
    EP_NO = 29
    EP_TITLE = "분모는 왜 더하지 않을까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.bars()
        self.mistake()
        self.second()
        self.closing(f"분모가 같은 분수의 덧셈은 {o('분모는 그대로')},\n{g('분자끼리')} 더해요",
                     next_preview="4학년 30화 · 대분수의 덧셈")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M(f"우주 호텔 요리사가 밀가루를 {o('3/7')}컵, 설탕을 {b('5/7')}컵 넣었어요.\n모두 몇 컵일까요?", 46)
        q.scale_to_fit_width(min(q.width, 11.0)).move_to([0, 1.5, 0])
        self.say("3/7컵과 5/7컵을 더하면?", "우주 호텔 요리사가 밀가루를 7분의 3컵, 설탕을 7분의 5컵 넣었어요. 모두 몇 컵일까요?")
        self.play(Write(q), run_time=1.3)
        e = row(frac(3, 7, 70, cn=ORANGE), "+", frac(5, 7, 70, cn=BLUE), "= ?", size=70).move_to([0, -0.7, 0])
        self.play(FadeIn(e), run_time=0.6)
        self.wait(1.0)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def bars(self):
        self.section("1/7이 몇 개일까?")
        b1 = frac_bar(7, 3, width=6.3, height=0.7, color=ORANGE).move_to([0.8, 1.8, 0])
        b2 = frac_bar(7, 5, width=6.3, height=0.7, color=BLUE).move_to([0.8, 0.7, 0])
        l1 = frac(3, 7, 40, cn=ORANGE).next_to(b1, LEFT, buff=0.4)
        l2 = frac(5, 7, 40, cn=BLUE).next_to(b2, LEFT, buff=0.4)
        self.say(f"{o('3/7')}은 1/7이 {o('3개')}, {b('5/7')}은 {b('5개')}", "7분의 3은 7분의 1이 3개, 7분의 5는 7분의 1이 5개예요.")
        self.play(FadeIn(b1), FadeIn(l1), FadeIn(b2), FadeIn(l2), run_time=0.8)
        tot = VGroup(*[c.copy() for c in b1[:3]], *[c.copy() for c in b2[:5]])
        row1 = frac_bar(7, 0, width=6.3, height=0.7).move_to([0.8, -0.8, 0])
        row2 = frac_bar(7, 0, width=6.3, height=0.7).move_to([0.8, -1.6, 0])
        self.say(f"모으면 1/7이 {g('8개')}", "조각을 모두 모으면 7분의 1이 3개와 5개, 8개예요.")
        self.play(FadeIn(row1), run_time=0.4)
        targets = list(row1) + [row2[0]]
        self.play(FadeIn(row2[0]), run_time=0.2)
        self.play(*[c.animate.move_to(t) for c, t in zip(tot, targets)], run_time=1.4)
        res = row(frac(8, 7, 52, cn=GREEN), "=", mixed(1, 1, 7, 52, cw=GREEN, cn=GREEN), size=52).move_to([-4.6, -1.2, 0])
        self.say(f"8/7 = {g('1과 1/7')}", "7분의 1이 8개이면 7분의 8. 7조각이 모여 1이 되고 1조각이 남으니 1과 7분의 1이에요.")
        self.play(FadeIn(res), Indicate(row1, color=GREEN, scale_factor=1.03), run_time=0.9)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def mistake(self):
        self.section("분모도 더하면?")
        w = row(frac(3, 7, 64), "+", frac(5, 7, 64), "=", frac(8, 14, 64, cn=RED, cd=RED), size=64).move_to([0, 1.3, 0])
        self.say("분모끼리도 더하면 될까요?", "분자끼리, 분모끼리 모두 더해서 14분의 8이라고 하면 어떨까요?")
        self.play(FadeIn(w), run_time=0.6)
        x = Cross(w[-1], stroke_color=RED, stroke_width=8)
        self.play(Create(x), run_time=0.5)
        e1 = M(f"분모 7은 '{o('1을 7조각으로 나눈 크기')}'예요", 44).move_to([0, -0.1, 0])
        e2 = M(f"조각의 크기는 그대로, {g('조각 수만 늘어나요')}", 44).move_to([0, -1.0, 0])
        self.say(f"분모는 {o('조각의 크기')}", "분모 7은 1을 7조각으로 나눈 크기를 뜻해요. 조각을 더 모아도 조각의 크기는 그대로예요. 그래서 분모는 더하지 않고, 조각 수인 분자만 더해요.")
        self.play(FadeIn(e1), run_time=0.5)
        self.play(FadeIn(e2), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def second(self):
        self.section("해 보기")
        e = row(frac(2, 5, 70), "+", frac(1, 5, 70), "= ?", size=70).move_to([0, 1.2, 0])
        self.say("2/5 + 1/5는?", "5분의 2 더하기 5분의 1은 얼마일까요?")
        self.play(FadeIn(e), run_time=0.5)
        self.pause_screen(5)
        a = row(frac(2, 5, 70), "+", frac(1, 5, 70), "=", frac(3, 5, 70, cn=GREEN), size=70).move_to([0, 1.2, 0])
        n = M(f"분모 5는 그대로, 분자 2 + 1 = {g('3')}", 44).move_to([0, -0.4, 0])
        self.say(f"분모는 그대로, 분자끼리 → {g('3/5')}", "분모 5는 그대로 쓰고 분자끼리 더하면 2 더하기 1은 3, 5분의 3이에요.")
        self.play(Transform(e, a), FadeIn(n), run_time=0.7)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
