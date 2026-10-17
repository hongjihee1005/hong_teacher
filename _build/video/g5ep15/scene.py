"""「수학 원리 돋보기」 5학년 15화 — 통분 (5-1 4단원 5차시, 화 코드 5-1-4-c)

3/4과 5/6: 분모를 같게 = 통분, 같게 한 분모 = 공통분모
① 두 분모의 곱 24: 18/24, 20/24 ② 최소공배수 12: 9/12, 10/12 (수가 작아 간단)
막대: 3/4 막대를 3배, 5/6 막대를 2배로 잘게 → 같은 크기의 칸 12개
최종: GRADE=5 ./make_final.sh 15
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, ReplacementTransform,
                   VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, frac_bar, row


class G5Ep15(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 15
    EP_TITLE = "통분"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.bars()
        self.two_ways()
        self.closing(f"분모를 같게 하는 것이 {o('통분')}, 같게 한 분모가 {g('공통분모')}\n두 분모의 {b('곱')}이나 {b('최소공배수')}를 공통분모로 해요",
                     next_preview="5학년 16화 · 분모가 다른 분수의 크기 비교")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("토마토를 준서는 3/4, 하은이는 5/6만큼 썼어요.\n누가 더 많이 썼을까요?", 42).move_to([0.6, 1.6, 0])
        self.say("3/4과 5/6, 분모가 달라요", "토마토를 준서는 4분의 3, 하은이는 6분의 5만큼 썼어요. 분모가 달라서 바로 견주기 어려워요. 누가 더 많이 썼을까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def bars(self):
        self.section("같은 크기의 칸으로")
        W = 8.4
        a = frac_bar(4, 3, width=W, height=0.7, color=ORANGE).move_to([0.8, 1.4, 0])
        b_ = frac_bar(6, 5, width=W, height=0.7, color=BLUE).move_to([0.8, 0.0, 0])
        la = frac(3, 4, 40).next_to(a, LEFT, buff=0.4)
        lb = frac(5, 6, 40).next_to(b_, LEFT, buff=0.4)
        self.say("칸의 크기가 달라요", "두 막대는 칸의 크기가 달라서 칸 수로 바로 견줄 수 없어요.")
        self.play(FadeIn(a), FadeIn(b_), FadeIn(la), FadeIn(lb), run_time=0.7)
        a2 = frac_bar(12, 9, width=W, height=0.7, color=ORANGE).move_to(a)
        b2 = frac_bar(12, 10, width=W, height=0.7, color=BLUE).move_to(b_)
        la2 = frac(9, 12, 40, cn=ORANGE).move_to(la)
        lb2 = frac(10, 12, 40, cn=BLUE).move_to(lb)
        self.say(f"둘 다 {o('12칸')}으로 잘게 나누면", "4칸 막대는 한 칸을 3개로, 6칸 막대는 한 칸을 2개로 나누면 두 막대 모두 같은 크기의 12칸이 돼요.")
        self.play(ReplacementTransform(a, a2), ReplacementTransform(b_, b2), ReplacementTransform(la, la2), ReplacementTransform(lb, lb2), run_time=1.2)
        t = M(f"분모를 같게 하는 것 = {o('통분')},  같게 한 분모 = {g('공통분모')}", 38).move_to([0, -1.4, 0])
        self.say(f"분모를 같게 하는 것을 {o('통분')}", "이렇게 분모가 다른 분수의 분모를 같게 하는 것을 통분한다고 하고, 같게 한 분모를 공통분모라고 해요.")
        self.play(FadeIn(t), run_time=0.5)
        r = M(f"9/12 &lt; 10/12  →  {g('하은이')}가 더 많이 썼어요", 40).move_to([0, -2.15, 0])
        self.say(f"9/12 &lt; 10/12, {g('하은이')}가 더 많이", "통분하니 12분의 9와 12분의 10. 하은이가 더 많이 썼어요.")
        self.play(FadeIn(r), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def two_ways(self):
        self.section("공통분모를 정하는 두 방법")
        h1 = M(f"① 두 분모의 {b('곱')} 4 × 6 = 24", 34).move_to([-3.4, 1.9, 0])
        e1 = row(frac(3, 4, 46), "=", frac(18, 24, 46), ",", frac(5, 6, 46), "=", frac(20, 24, 46), size=44).move_to([-3.4, 0.5, 0])
        h2 = M(f"② 두 분모의 {o('최소공배수')} 12", 34).move_to([3.4, 1.9, 0])
        e2 = row(frac(3, 4, 46), "=", frac(9, 12, 46), ",", frac(5, 6, 46), "=", frac(10, 12, 46), size=44).move_to([3.4, 0.5, 0])
        self.say(f"① 두 분모의 {b('곱')}을 공통분모로", "첫째, 두 분모의 곱 24를 공통분모로 할 수 있어요. 공통분모를 구하기 쉬워요.")
        self.play(FadeIn(h1), FadeIn(e1), run_time=0.7)
        self.say(f"② {o('최소공배수')}를 공통분모로", "둘째, 두 분모의 최소공배수 12를 공통분모로 할 수 있어요.")
        self.play(FadeIn(h2), FadeIn(e2), run_time=0.7)
        n = M(f"최소공배수로 하면 {g('수가 작아서')} 계산이 간단해요", 40).move_to([0, -1.2, 0])
        self.say(f"최소공배수로 하면 {g('수가 작아요')}", "최소공배수로 통분하면 분모와 분자의 수가 작아서 계산이 간단해요.")
        self.play(FadeIn(n), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
