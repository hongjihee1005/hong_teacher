"""「수학 원리 돋보기」 5학년 14화 — 약분과 기약분수 (5-1 4단원 4차시, 화 코드 5-1-4-b)

8/16을 간단하게: 공약수 2로 4/8, 4로 2/4, 8로 1/2 → 분모와 분자를 1이 아닌 공약수로 나누기 = 약분
1/2처럼 분모와 분자의 공약수가 1뿐인 분수 = 기약분수 / 최대공약수(8)로 나누면 한 번에 기약분수
최종: GRADE=5 ./make_final.sh 14
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, CurvedArrow, FadeIn, FadeOut, Indicate, LaggedStart, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, frac_bar


class G5Ep14(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 14
    EP_TITLE = "약분과 기약분수"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.reduce()
        self.gcd()
        self.closing(f"분모와 분자를 공약수로 나누는 것이 {o('약분')}\n공약수가 1뿐인 분수가 {g('기약분수')}, 최대공약수로 나누면 한 번에!",
                     next_preview="5학년 15화 · 통분")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("바비큐를 8/16만큼 먹었어요.\n더 간단한 분수로 나타낼 수 있을까요?", 44).move_to([0.6, 1.6, 0])
        bar = frac_bar(16, 8, width=8.0, height=0.6, color=ORANGE).move_to([0, -0.6, 0])
        self.say("8/16을 간단하게", "바비큐를 16분의 8만큼 먹었어요. 이 분수를 더 간단하게 나타낼 수 있을까요?")
        self.play(Write(q), FadeIn(bar), run_time=1.2)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def reduce(self):
        self.section("공약수로 나누기")
        specs = [(8, 16), (4, 8), (2, 4), (1, 2)]
        cols = [INK, BLUE, BLUE, GREEN]
        fs = VGroup(*[frac(n, d, 64, cn=c, cd=c) for (n, d), c in zip(specs, cols)])
        bars = VGroup(*[frac_bar(d, n, width=2.4, height=0.42, color=ORANGE) for n, d in specs])
        xs = [-4.8, -1.6, 1.6, 4.8]
        for f, bb, x in zip(fs, bars, xs):
            f.move_to([x, 0.35, 0])
            bb.move_to([x, -0.8, 0])
        self.say("8과 16의 공약수로 나누어 봐요", "8과 16의 공약수 2, 4, 8로 분모와 분자를 나누어 볼게요.")
        self.play(FadeIn(fs[0]), FadeIn(bars[0]), run_time=0.5)
        lbl = ["÷ 2", "÷ 4", "÷ 8"]
        for k in range(1, 4):
            a = CurvedArrow(fs[0].get_top() + UP * 0.15, fs[k].get_top() + UP * 0.15, angle=-0.32 - 0.1 * k, color=ORANGE)
            t = T(lbl[k - 1], 30, ORANGE).move_to(a.point_from_proportion(0.5 + 0.12 * k) + UP * 0.22)
            self.play(Create(a), FadeIn(t), FadeIn(fs[k]), FadeIn(bars[k]), run_time=0.7)
        self.say(f"모두 {o('크기가 같은')} 간단한 분수", "4분의 2, 8분의 4, 2분의 1. 모두 16분의 8과 크기가 같은 분수예요. 막대의 칠한 부분이 똑같아요.")
        self.play(Indicate(bars, color=ORANGE, scale_factor=1.03), run_time=0.8)
        t1 = M(f"분모와 분자를 1이 아닌 공약수로 나누기 = {o('약분')}", 38).move_to([0, -1.6, 0])
        self.say(f"이렇게 나누는 것을 {o('약분')}이라고 해요", "분모와 분자를 1이 아닌 공약수로 나누어 간단한 분수로 나타내는 것을 약분한다고 해요.")
        self.play(FadeIn(t1), run_time=0.5)
        t2 = M(f"1/2처럼 공약수가 1뿐인 분수 = {g('기약분수')}", 38).move_to([0, -2.22, 0])
        self.say(f"더 나눌 수 없는 1/2은 {g('기약분수')}", "2분의 1처럼 분모와 분자의 공약수가 1뿐이라 더 약분할 수 없는 분수를 기약분수라고 해요.")
        self.play(FadeIn(t2), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def gcd(self):
        self.section("한 번에 기약분수로")
        f1 = frac(18, 24, 80).move_to([-3.4, 0.2, 0])
        f2 = frac(3, 4, 80, cn=GREEN, cd=GREEN).move_to([3.0, 0.2, 0])
        self.say("18/24을 한 번에 기약분수로", "24분의 18을 한 번에 기약분수로 나타내 볼까요?")
        self.play(FadeIn(f1), run_time=0.5)
        n = M(f"18과 24의 최대공약수 {o('6')}", 42).move_to([3.3, 2.5, 0])
        self.say(f"최대공약수 {o('6')}으로 나누면", "18과 24의 최대공약수는 6이에요. 분모와 분자를 최대공약수 6으로 나누면,")
        self.play(FadeIn(n), run_time=0.5)
        a1 = CurvedArrow(f1.num.get_top() + UP * 0.1, f2.num.get_top() + UP * 0.1, angle=-0.35, color=ORANGE)
        a2 = CurvedArrow(f1.den.get_bottom() + DOWN * 0.1, f2.den.get_bottom() + DOWN * 0.1, angle=0.35, color=ORANGE)
        l1 = T("÷ 6", 36, ORANGE).next_to(a1, UP, buff=0.05)
        l2 = T("÷ 6", 36, ORANGE).next_to(a2, DOWN, buff=0.05)
        self.play(Create(a1), Create(a2), FadeIn(l1), FadeIn(l2), FadeIn(f2), run_time=0.9)
        t = M(f"한 번에 {g('3/4')}", 44).move_to([0, -2.25, 0])
        self.say(f"한 번에 기약분수 {g('3/4')}", "한 번에 기약분수 4분의 3이 돼요. 최대공약수로 나누면 여러 번 나누지 않아도 돼요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
