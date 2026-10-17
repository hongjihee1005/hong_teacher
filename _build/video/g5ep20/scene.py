"""「수학 원리 돋보기」 5학년 20화 — 분모가 다른 진분수의 뺄셈 (5-1 5단원 5차시, 화 코드 5-1-5-c)

우유 5/6 L 중 1/2 L 사용: 통분 5/6 − 3/6 = 2/6 = 1/3 (분모는 그대로, 분자끼리 뺌, 약분하면 간단)
3/4 − 2/3 = 9/12 − 8/12 = 1/12 (두 분모의 곱 = 최소공배수)
최종: GRADE=5 ./make_final.sh 20
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, Cross, FadeIn, FadeOut, Indicate, LaggedStart, ReplacementTransform,
                   VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, frac_bar, row

RED = "#C0392B"


class G5Ep20(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 20
    EP_TITLE = "분모가 다른 진분수의 뺄셈"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.bars()
        self.second()
        self.closing(f"분모가 다른 분수의 뺄셈도 {o('통분')}한 뒤\n분모는 그대로, {g('분자끼리')} 빼요",
                     next_preview="5학년 21화 · 분모가 다른 대분수의 뺄셈")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("우유 5/6 L 중에서 1/2 L를 요리에 썼어요.\n남은 우유는 몇 L일까요?", 44).move_to([0.6, 1.6, 0])
        self.say("5/6 − 1/2은?", "우유 6분의 5리터 중에서 2분의 1리터를 요리에 썼어요. 남은 우유는 몇 리터일까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def bars(self):
        self.section("통분하여 덜어 내기")
        W = 7.2
        a = frac_bar(6, 5, width=W, color=ORANGE).move_to([0.6, 1.6, 0])
        la = frac(5, 6, 40).next_to(a, LEFT, buff=0.4)
        self.say("5/6만큼 있어요", "6칸 중 5칸, 6분의 5만큼 있어요.")
        self.play(FadeIn(a), FadeIn(la), run_time=0.6)
        h = frac(1, 2, 40, cn=BLUE).move_to([-4.6, 0.3, 0])
        h2 = frac(3, 6, 40, cn=BLUE).move_to([-4.6, 0.3, 0])
        n = M(f"1/2 = {b('3/6')}", 42).move_to([0.6, 0.3, 0])
        self.say(f"1/2을 6칸으로 바꾸면 {b('3/6')}", "2분의 1을 분모가 6인 분수로 바꾸면 6분의 3이에요.")
        self.play(FadeIn(n), run_time=0.5)
        xs = VGroup(*[Cross(a[i], stroke_color=RED, stroke_width=5) for i in (2, 3, 4)])
        self.say("3칸을 덜어 내면", "6분의 5에서 6분의 3, 3칸을 덜어 내요.")
        self.play(Create(xs), *[a[i].animate.set_fill(PAPER) for i in (2, 3, 4)], run_time=0.9)
        e = row(frac(5, 6, 56), "−", frac(3, 6, 56, cn=BLUE), "=", frac(2, 6, 56, cn=GREEN), "=", frac(1, 3, 56, cn=GREEN), size=54).move_to([0, -1.3, 0])
        self.say(f"5/6 − 3/6 = {g('2/6')}, 약분하면 {g('1/3')}", "분모는 그대로, 분자끼리 빼면 6분의 2. 약분하면 3분의 1리터가 남아요.")
        self.play(FadeIn(e), run_time=0.6)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def second(self):
        self.section("한 번 더")
        e = row(frac(3, 4, 62), "−", frac(2, 3, 62), "=", frac(9, 12, 62, cn=ORANGE), "−", frac(8, 12, 62, cn=BLUE), "=", frac(1, 12, 62, cn=GREEN), size=58).move_to([0, 1.2, 0])
        self.say("3/4 − 2/3은?", "4분의 3 빼기 3분의 2를 계산해 볼까요?")
        self.play(FadeIn(e[:3]), run_time=0.5)
        self.say(f"분모 {o('12')}로 통분", "4와 3의 최소공배수 12로 통분하면 12분의 9 빼기 12분의 8.")
        self.play(FadeIn(e[3:7]), run_time=0.6)
        self.say(f"분자끼리 빼면 {g('1/12')}", "분자끼리 빼면 12분의 1이에요.")
        self.play(FadeIn(e[7:]), run_time=0.5)
        n = M(f"분모가 서로 다른 수라도 {o('통분')}하면 {g('분자끼리')} 뺄 수 있어요", 38).move_to([0, -1.0, 0])
        self.play(FadeIn(n), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
