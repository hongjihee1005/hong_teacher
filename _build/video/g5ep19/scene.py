"""「수학 원리 돋보기」 5학년 19화 — 분모가 다른 대분수의 덧셈 (5-1 5단원 4차시, 화 코드 5-1-5-b)

1 3/4 + 2 1/8: 방법 ① 자연수끼리 1 + 2 = 3, 분수끼리 6/8 + 1/8 = 7/8 → 3 7/8
방법 ② 가분수로 14/8 + 17/8 = 31/8 = 3 7/8
분수끼리 더해 1을 넘으면 자연수로 올림: 2 2/3 + 1 1/2 = 3 + 7/6 = 4 1/6
최종: GRADE=5 ./make_final.sh 19
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, mixed, row


class G5Ep19(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 19
    EP_TITLE = "분모가 다른 대분수의 덧셈"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.way1()
        self.way2()
        self.carry()
        self.closing(f"대분수의 덧셈은 통분한 뒤 {o('자연수끼리, 분수끼리')}\n또는 {b('가분수')}로 바꾸어 더해요",
                     next_preview="5학년 20화 · 분모가 다른 진분수의 뺄셈")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("밀가루 1 3/4 컵과 설탕 2 1/8 컵을 섞었어요.\n모두 몇 컵일까요?", 44).move_to([0.6, 1.6, 0])
        self.say("1과 3/4 더하기 2와 1/8", "밀가루 1과 4분의 3컵과 설탕 2와 8분의 1컵을 섞었어요. 모두 몇 컵일까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def way1(self):
        self.section("방법 ① 자연수끼리, 분수끼리")
        e0 = row(mixed(1, 3, 4, 58), "+", mixed(2, 1, 8, 58), "=", mixed(1, 6, 8, 58, cn=ORANGE, cd=ORANGE), "+", mixed(2, 1, 8, 58), size=54).move_to([0, 1.8, 0])
        self.say(f"먼저 {o('통분')}: 1과 6/8 + 2와 1/8", "먼저 분수 부분을 통분하면 1과 8분의 6 더하기 2와 8분의 1이에요.")
        self.play(FadeIn(e0), run_time=0.8)
        l1 = M(f"자연수끼리  1 + 2 = {b('3')}", 44).move_to([-3.0, 0.3, 0])
        l2 = row("분수끼리", frac(6, 8, 50), "+", frac(1, 8, 50), "=", frac(7, 8, 50, cn=ORANGE, cd=ORANGE), size=44).move_to([3.0, 0.3, 0])
        self.say(f"자연수끼리 {b('3')}, 분수끼리 {o('7/8')}", "자연수끼리 더하면 3, 분수끼리 더하면 8분의 7이에요.")
        self.play(FadeIn(l1), FadeIn(l2), run_time=0.7)
        r = row("=", mixed(3, 7, 8, 64, cw=GREEN, cn=GREEN, cd=GREEN), size=56).move_to([0, -1.4, 0])
        self.say(f"합치면 {g('3과 7/8')}", "합치면 3과 8분의 7컵이에요.")
        self.play(FadeIn(r), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def way2(self):
        self.section("방법 ② 가분수로")
        e = row(mixed(1, 3, 4, 56), "+", mixed(2, 1, 8, 56), "=", frac(14, 8, 56, cn=BLUE), "+", frac(17, 8, 56, cn=BLUE), "=", frac(31, 8, 56, cn=GREEN), "=", mixed(3, 7, 8, 56, cw=GREEN, cn=GREEN, cd=GREEN), size=52)
        e.scale_to_fit_width(min(e.width, 12.0)).move_to([0, 1.0, 0])
        self.say("대분수를 가분수로 바꾸어", "대분수를 가분수로 바꾸어 계산할 수도 있어요. 1과 4분의 3은 8분의 14, 2와 8분의 1은 8분의 17.")
        self.play(FadeIn(e[:7]), run_time=0.8)
        self.say(f"14/8 + 17/8 = 31/8 = {g('3과 7/8')}", "더하면 8분의 31, 대분수로 바꾸면 3과 8분의 7. 같은 답이에요.")
        self.play(FadeIn(e[7:]), run_time=0.7)
        n = M(f"두 방법의 답이 {g('같아요')}", 44).move_to([0, -1.2, 0])
        self.play(FadeIn(n), run_time=0.4)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def carry(self):
        self.section("분수끼리 더해 1을 넘으면")
        e = row(mixed(2, 2, 3, 56), "+", mixed(1, 1, 2, 56), "=", mixed(2, 4, 6, 56), "+", mixed(1, 3, 6, 56), size=52).move_to([0, 1.9, 0])
        self.say("2와 2/3 + 1과 1/2", "2와 3분의 2 더하기 1과 2분의 1은 통분하면 2와 6분의 4 더하기 1과 6분의 3이에요.")
        self.play(FadeIn(e), run_time=0.8)
        l = row("=", T("3", 64, BLUE), "+", frac(7, 6, 56, cn=ORANGE, cd=ORANGE), "=", T("3", 64, BLUE), "+", mixed(1, 1, 6, 56, cw=ORANGE, cn=ORANGE, cd=ORANGE), size=52).move_to([0, 0.3, 0])
        self.say(f"분수끼리 7/6, {o('1을 넘어요')}", "자연수끼리 3, 분수끼리 6분의 7. 6분의 7은 1과 6분의 1이라 1을 넘어요.")
        self.play(FadeIn(l), run_time=0.8)
        r = row("=", mixed(4, 1, 6, 64, cw=GREEN, cn=GREEN, cd=GREEN), size=56).move_to([0, -1.3, 0])
        self.say(f"1을 자연수로 올려 {g('4와 1/6')}", "넘는 1을 자연수 부분으로 올리면 4와 6분의 1이에요.")
        self.play(FadeIn(r), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
