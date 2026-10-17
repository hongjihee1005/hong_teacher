"""「수학 원리 돋보기」 5학년 13화 — 크기가 같은 분수 만들기 (5-1 4단원 2·3차시, 화 코드 5-1-4-a)

1/2 = 2/4 = 3/6 = 4/8: 같은 막대를 더 잘게 나누면 칠한 부분은 그대로, 분모·분자가 같은 수만큼 커짐
분모와 분자에 0이 아닌 같은 수를 곱하거나 나누어도 크기가 같음: 12/18 = 6/9 = 4/6 = 2/3
최종: GRADE=5 ./make_final.sh 13
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, CurvedArrow, FadeIn, FadeOut, Indicate, LaggedStart, ReplacementTransform,
                   VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, frac_bar, row


class G5Ep13(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 13
    EP_TITLE = "크기가 같은 분수 만들기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.split()
        self.rule()
        self.divide()
        self.closing(f"분모와 분자에 {o('0이 아닌 같은 수')}를 곱하거나 나누면\n{g('크기가 같은 분수')}가 돼요",
                     next_preview="5학년 14화 · 약분과 기약분수")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("치즈를 준서는 1/2, 하은이는 2/4만큼 담았어요.\n누가 더 많이 담았을까요?", 42).move_to([0.6, 1.6, 0])
        self.say("1/2과 2/4, 어느 쪽이 많을까요?", "같은 크기의 치즈를 준서는 2분의 1, 하은이는 4분의 2만큼 담았어요. 누가 더 많이 담았을까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def split(self):
        self.section("더 잘게 나누어 보기")
        specs = [(2, 1), (4, 2), (6, 3), (8, 4)]
        bars, labs = VGroup(), VGroup()
        for k, (d, n) in enumerate(specs):
            bar = frac_bar(d, n, width=7.0, height=0.55, color=ORANGE).move_to([0.6, 2.35 - k * 1.0, 0])
            lab = frac(n, d, 34).next_to(bar, LEFT, buff=0.5)
            bars.add(bar)
            labs.add(lab)
        self.say("1/2 막대를 더 잘게 나누어요", "2분의 1만큼 칠한 막대를 더 잘게 나누어 볼게요.")
        self.play(FadeIn(bars[0]), FadeIn(labs[0]), run_time=0.6)
        for k in range(1, 4):
            self.play(FadeIn(bars[k]), FadeIn(labs[k]), run_time=0.6)
        self.say(f"칠한 부분은 {o('그대로')}예요", "칸을 2배, 3배, 4배로 나누어도 칠한 부분의 크기는 그대로예요.")
        self.play(Indicate(VGroup(*[b_[: len(b_) // 2] for b_ in bars]), color=ORANGE, scale_factor=1.02), run_time=0.9)
        t = row(frac(1, 2, 40), "=", frac(2, 4, 40), "=", frac(3, 6, 40), "=", frac(4, 8, 40), size=44).move_to([0.4, -1.75, 0])
        self.say(f"1/2 = 2/4 = 3/6 = 4/8, {g('크기가 같아요')}", "그래서 2분의 1, 4분의 2, 6분의 3, 8분의 4는 모두 크기가 같은 분수예요. 두 사람은 같은 양을 담았어요.")
        self.play(FadeIn(t), run_time=0.6)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def rule(self):
        self.section("분모와 분자에 같은 수를 곱해요")
        f1, f2, f3 = frac(1, 2, 80), frac(2, 4, 80), frac(3, 6, 80)
        grp = VGroup(f1, f2, f3).arrange(RIGHT, buff=2.4).move_to([0, 0.2, 0])
        self.play(FadeIn(grp), run_time=0.5)
        a_top = CurvedArrow(f1.num.get_top() + UP * 0.1, f2.num.get_top() + UP * 0.1, angle=-1.2, color=ORANGE)
        a_bot = CurvedArrow(f1.den.get_bottom() + DOWN * 0.1, f2.den.get_bottom() + DOWN * 0.1, angle=1.2, color=ORANGE)
        l1 = T("× 2", 38, ORANGE).next_to(a_top, UP, buff=0.05)
        l2 = T("× 2", 38, ORANGE).next_to(a_bot, DOWN, buff=0.05)
        self.say(f"분모와 분자에 {o('2를 곱하면')} 2/4", "1/2의 분모와 분자에 똑같이 2를 곱하면 4분의 2가 돼요.")
        self.play(Create(a_top), Create(a_bot), FadeIn(l1), FadeIn(l2), run_time=0.8)
        b_top = CurvedArrow(f1.num.get_top() + UP * 0.1, f3.num.get_top() + UP * 0.1, angle=-0.55, color=BLUE)
        b_bot = CurvedArrow(f1.den.get_bottom() + DOWN * 0.1, f3.den.get_bottom() + DOWN * 0.1, angle=0.55, color=BLUE)
        m1 = T("× 3", 38, BLUE).next_to(b_top, UP, buff=0.05).shift(RIGHT * 1.2)
        m2 = T("× 3", 38, BLUE).next_to(b_bot, DOWN, buff=0.05).shift(RIGHT * 1.2)
        self.say(f"{b('3을 곱하면')} 3/6", "3을 곱하면 6분의 3. 칸을 3배로 잘게 나눈 것과 같아요.")
        self.play(Create(b_top), Create(b_bot), FadeIn(m1), FadeIn(m2), run_time=0.8)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def divide(self):
        self.section("나누어도 같아요")
        fs = [frac(12, 18, 70), frac(6, 9, 70), frac(4, 6, 70), frac(2, 3, 70)]
        grp = VGroup(*sum([[f, T("=", 60)] for f in fs], [])[:-1]).arrange(RIGHT, buff=0.45).move_to([0, 0.6, 0])
        self.say("분모와 분자를 같은 수로 나누어도", "거꾸로 분모와 분자를 0이 아닌 같은 수로 나누어도 크기가 같은 분수가 돼요.")
        self.play(FadeIn(grp[0]), run_time=0.5)
        ops = ["÷ 2", "÷ 3", "÷ 2"]
        notes = VGroup()
        for k in range(3):
            n = T(ops[k], 32, ORANGE).next_to(grp[2 * k + 1], UP, buff=0.55)
            notes.add(n)
            self.play(FadeIn(grp[2 * k + 1]), FadeIn(grp[2 * k + 2]), FadeIn(n), run_time=0.6)
        t = M(f"12/18 = 6/9 = 4/6 = {g('2/3')}", 44).move_to([0, -1.6, 0])
        self.say(f"12/18은 {g('2/3')}과 크기가 같아요", "18분의 12를 2로, 3으로, 다시 2로 나누면 3분의 2. 모두 크기가 같은 분수예요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
