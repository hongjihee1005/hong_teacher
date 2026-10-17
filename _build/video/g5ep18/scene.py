"""「수학 원리 돋보기」 5학년 18화 — 분모가 다른 진분수의 덧셈 (5-1 5단원 2·3차시, 화 코드 5-1-5-a)

1/2 + 1/3: 조각 크기가 달라 바로 못 더함 → 통분 3/6 + 2/6 = 5/6 (분모는 그대로, 분자끼리)
합이 1보다 큰 경우: 3/4 + 5/8 = 6/8 + 5/8 = 11/8 = 1 3/8
최종: GRADE=5 ./make_final.sh 18
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, ReplacementTransform,
                   VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, frac_bar, mixed, row

RED = "#C0392B"


def colored_bar(d, parts, width, height=0.65):
    """parts: [(칸 수, 색), …] 차례로 칠함"""
    bar = frac_bar(d, 0, width=width, height=height)
    i = 0
    for k, c in parts:
        for _ in range(k):
            bar[i].set_fill(c, 1)
            i += 1
    return bar


class G5Ep18(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 18
    EP_TITLE = "분모가 다른 진분수의 덧셈"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.why()
        self.calc()
        self.over1()
        self.closing(f"분모가 다른 분수는 {o('통분')}한 뒤\n분모는 그대로, {g('분자끼리')} 더해요",
                     next_preview="5학년 19화 · 분모가 다른 대분수의 덧셈")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("철사를 1/2 m, 짝은 1/3 m 썼어요.\n두 사람이 쓴 철사는 모두 몇 m일까요?", 44).move_to([0.6, 1.6, 0])
        self.say("1/2 + 1/3은?", "미술 시간에 철사를 나는 2분의 1미터, 짝은 3분의 1미터 썼어요. 두 사람이 쓴 철사는 모두 몇 미터일까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def why(self):
        self.section("조각 크기가 달라요")
        W = 7.2
        a = frac_bar(2, 1, width=W, color=ORANGE).move_to([0.6, 1.5, 0])
        b_ = frac_bar(3, 1, width=W, color=BLUE).move_to([0.6, 0.3, 0])
        la = frac(1, 2, 40).next_to(a, LEFT, buff=0.4)
        lb = frac(1, 3, 40).next_to(b_, LEFT, buff=0.4)
        self.say("조각의 크기가 달라요", "2분의 1 조각과 3분의 1 조각은 크기가 달라요. 1 더하기 1을 해서 2분의 2나 5분의 2라고 할 수 없어요.")
        self.play(FadeIn(a), FadeIn(b_), FadeIn(la), FadeIn(lb), run_time=0.7)
        a2 = frac_bar(6, 3, width=W, color=ORANGE).move_to(a)
        b2 = frac_bar(6, 2, width=W, color=BLUE).move_to(b_)
        la2 = frac(3, 6, 40, cn=ORANGE).move_to(la)
        lb2 = frac(2, 6, 40, cn=BLUE).move_to(lb)
        self.say(f"둘 다 {o('6칸')}으로 나누면 같은 크기", "두 막대를 모두 6칸으로 잘게 나누면 조각의 크기가 같아져요. 2분의 1은 6분의 3, 3분의 1은 6분의 2예요.")
        self.play(ReplacementTransform(a, a2), ReplacementTransform(b_, b2), ReplacementTransform(la, la2), ReplacementTransform(lb, lb2), run_time=1.1)
        s = colored_bar(6, [(3, ORANGE), (2, BLUE)], W).move_to([0.6, -1.2, 0])
        ls = frac(5, 6, 40, cn=GREEN).next_to(s, LEFT, buff=0.4)
        self.say(f"같은 조각끼리 모으면 {g('5/6')}", "이제 같은 크기의 조각끼리 모으면 6분의 1이 5개, 6분의 5예요.")
        self.play(FadeIn(s), FadeIn(ls), run_time=0.8)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def calc(self):
        self.section("통분하여 더하기")
        e = row(frac(1, 2, 66), "+", frac(1, 3, 66), "=", frac(3, 6, 66, cn=ORANGE), "+", frac(2, 6, 66, cn=BLUE), "=", frac(5, 6, 66, cn=GREEN), size=60).move_to([0, 1.0, 0])
        self.say("식으로 나타내면", "식으로 나타내 볼게요.")
        self.play(FadeIn(e[:3]), run_time=0.5)
        self.say(f"① {o('통분')}해요: 3/6 + 2/6", "먼저 두 분모의 최소공배수 6으로 통분해요. 6분의 3 더하기 6분의 2.")
        self.play(FadeIn(e[3:7]), run_time=0.6)
        self.say(f"② 분모는 그대로, {g('분자끼리')}: 5/6", "분모는 그대로 쓰고 분자끼리 더하면 6분의 5예요.")
        self.play(FadeIn(e[7:]), run_time=0.6)
        t = M(f"두 사람이 쓴 철사는 {g('5/6 m')}", 46).move_to([0, -1.2, 0])
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def over1(self):
        self.section("합이 1보다 크면")
        e = row(frac(3, 4, 60), "+", frac(5, 8, 60), "=", frac(6, 8, 60, cn=ORANGE), "+", frac(5, 8, 60, cn=BLUE), "=", frac(11, 8, 60, cn=GREEN), size=56).move_to([0, 1.7, 0])
        self.say("3/4 + 5/8은?", "4분의 3 더하기 8분의 5는 어떻게 할까요? 최소공배수 8로 통분하면 8분의 6 더하기 8분의 5, 8분의 11이에요.")
        self.play(FadeIn(e), run_time=1.0)
        W = 4.6
        b1 = colored_bar(8, [(8, ORANGE)], W, 0.55)
        b2 = colored_bar(8, [(3, BLUE)], W, 0.55)
        bars = VGroup(b1, b2).arrange(RIGHT, buff=0.25).move_to([0.2, 0.0, 0])
        self.say(f"8칸이 다 차고 {o('3칸')}이 남아요", "8분의 11은 8칸짜리 막대 하나를 꽉 채우고 3칸이 더 있어요.")
        self.play(FadeIn(bars), run_time=0.7)
        r = row(frac(11, 8, 60, cn=GREEN), "=", mixed(1, 3, 8, 60, cw=GREEN, cn=GREEN, cd=GREEN), size=56).move_to([0, -1.6, 0])
        self.say(f"가분수 11/8은 대분수 {g('1과 3/8')}", "합이 가분수이면 대분수로 나타낼 수 있어요. 8분의 11은 1과 8분의 3이에요.")
        self.play(FadeIn(r), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
