"""「수학 원리 돋보기」 4학년 30화 — 대분수의 덧셈 (4-2 1단원 3차시, 화 코드 4-2-1-b)

1 3/5 + 2 4/5: 자연수끼리 1 + 2 = 3, 분수끼리 3/5 + 4/5 = 7/5 = 1 2/5 → 4 2/5
방법 2: 가분수로 8/5 + 14/5 = 22/5 = 4 2/5
최종: GRADE=4 ./make_final.sh 30
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, SurroundingRectangle,
                   Transform, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, frac_bar, mixed, row


def whole_bars(n, d, k, width=2.6, h=0.55, color=ORANGE):
    """자연수 n개(가득 찬 막대) + k/d 막대"""
    bars = VGroup(*[frac_bar(d, d, width, h, color) for _ in range(n)])
    if k:
        bars.add(frac_bar(d, k, width, h, color))
    return bars.arrange(RIGHT, buff=0.15)


class G4Ep30(EpisodeScene):
    GRADE, SEM = 4, 2
    EP_NO = 30
    EP_TITLE = "대분수의 덧셈"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.split()
        self.improper()
        self.closing(f"대분수의 덧셈은 {b('자연수끼리')}, {o('분수끼리')} 더하거나\n{g('가분수')}로 바꾸어 더해요",
                     next_preview="4학년 31화 · 진분수와 대분수의 뺄셈")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("우주 호텔에서 주스를 어제와 오늘 마셨어요. 모두 몇 L일까요?", 42)
        q.scale_to_fit_width(min(q.width, 10.4)).move_to([0.6, 2.25, 0])
        e = row(mixed(1, 3, 5, 70, cn=ORANGE, cd=ORANGE), "+", mixed(2, 4, 5, 70, cn=BLUE, cd=BLUE), "= ?", size=70).move_to([0, 0.2, 0])
        self.say("1과 3/5 + 2와 4/5", "어제는 1과 5분의 3리터, 오늘은 2와 5분의 4리터 마셨어요. 모두 몇 리터일까요?")
        self.play(Write(q), FadeIn(e), run_time=1.2)
        self.wait(1.0)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def split(self):
        self.section("자연수끼리, 분수끼리")
        a = whole_bars(1, 5, 3, color=ORANGE).move_to([-1.0, 1.9, 0])
        b_ = whole_bars(2, 5, 4, color=BLUE).move_to([0.4, 1.0, 0])
        la = mixed(1, 3, 5, 38).next_to(a, LEFT, buff=0.4)
        lb = mixed(2, 4, 5, 38).next_to(b_, LEFT, buff=0.4)
        self.play(FadeIn(a), FadeIn(la), FadeIn(b_), FadeIn(lb), run_time=0.7)
        l1 = row(b("자연수끼리"), ":", "1 + 2 = 3", size=44).move_to([-2.6, -0.3, 0])
        self.say(f"{b('자연수끼리')}: 1 + 2 = 3", "먼저 자연수끼리 더하면 1 더하기 2는 3이에요.")
        self.play(Indicate(VGroup(a[0], b_[0], b_[1]), color=BLUE, scale_factor=1.04), FadeIn(l1), run_time=0.8)
        l2 = row(o("분수끼리"), ":", frac(3, 5, 40), "+", frac(4, 5, 40), "=", frac(7, 5, 40, cn=ORANGE), "=", mixed(1, 2, 5, 40, cn=ORANGE, cd=ORANGE), size=44).move_to([1.6, -1.2, 0])
        self.say(f"{o('분수끼리')}: 7/5 = 1과 2/5", "분수끼리 더하면 5분의 3 더하기 5분의 4는 5분의 7. 5분의 5가 1이니까 1과 5분의 2예요.")
        self.play(Indicate(VGroup(a[-1], b_[-1]), color=ORANGE, scale_factor=1.04), FadeIn(l2), run_time=0.9)
        res = row("3 +", mixed(1, 2, 5, 48), "=", mixed(4, 2, 5, 56, cw=GREEN, cn=GREEN, cd=GREEN), size=48).move_to([0.6, -2.1, 0])
        self.say(f"1을 자연수에 더해 → {g('4와 2/5')}", "분수 부분에서 생긴 1을 자연수 3에 더하면 4. 모두 4와 5분의 2리터예요.")
        self.play(FadeIn(res), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def improper(self):
        self.section("가분수로 바꾸어 더하기")
        l1 = VGroup(row(mixed(1, 3, 5, 56), "=", frac(8, 5, 56, cn=ORANGE), size=56), row(mixed(2, 4, 5, 56), "=", frac(14, 5, 56, cn=BLUE), size=56)).arrange(RIGHT, buff=1.4).move_to([0, 1.4, 0])
        self.say("대분수를 가분수로 바꿔요", "이번에는 대분수를 가분수로 바꾸어 계산해 볼까요? 1과 5분의 3은 5분의 8, 2와 5분의 4는 5분의 14예요.")
        self.play(FadeIn(l1), run_time=0.7)
        l2 = row(frac(8, 5, 60), "+", frac(14, 5, 60), "=", frac(22, 5, 60, cn=GREEN), "=", mixed(4, 2, 5, 60, cw=GREEN, cn=GREEN, cd=GREEN), size=60).move_to([0, -0.3, 0])
        self.say(f"8/5 + 14/5 = 22/5 = {g('4와 2/5')}", "분자끼리 더하면 5분의 22. 대분수로 바꾸면 4와 5분의 2, 같은 답이에요.")
        self.play(FadeIn(l2), run_time=0.7)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
