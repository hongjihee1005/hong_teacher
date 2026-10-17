"""「수학 원리 돋보기」 6학년 2화 — 몫이 1보다 큰 (자연수) ÷ (자연수) (6-1 1단원 3차시, 화 코드 6-1-1-b)

물 4 L를 화분 3개에 똑같이 나누어 주기
방법 1: 1 L씩 나누어 주고 남은 1 L를 3등분 → 4 ÷ 3 = 1 + 1/3 = 1 1/3
방법 2: 4 L를 각각 3등분 → 1/3이 4개 → 4 ÷ 3 = 4/3
최종: GRADE=6 ./make_final.sh 2
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, Rectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, mixed, row

COLS = [ORANGE, BLUE, GREEN]


def liter(n=3, w=1.0, h=2.2, center=(0, 0, 0)):
    """1 L 통: 아래에서 위로 n칸"""
    cells = VGroup(*[Rectangle(width=w, height=h / n, fill_color=PAPER, fill_opacity=1, stroke_color=INK, stroke_width=3)
                     for _ in range(n)]).arrange(UP, buff=0).move_to(center)
    return cells


class G6Ep02(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 2
    EP_TITLE = "몫이 1보다 큰 (자연수) ÷ (자연수)"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.way1()
        self.way2()
        self.closing(f"몫이 1보다 커도 {o('나누어지는 수')}를 분자, {b('나누는 수')}를 분모로\n4 ÷ 3 = 4/3 = 1과 1/3",
                     next_preview="6학년 3화 · (분수) ÷ (자연수)")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("물 4 L를 화분 3개에 똑같이 나누어 주려고 해요.\n화분 한 개에 몇 L를 줄까요?", 42).move_to([0.6, 1.6, 0])
        self.say("4 ÷ 3은?", "물 4 L를 화분 3개에 똑같이 나누어 주려고 해요. 화분 한 개에 몇 L를 줄까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def bottles(self, n):
        xs = [-5.0, -3.6, -2.2, -0.8]
        bs = VGroup(*[liter(n, 1.0, 2.2, [x, 0.9, 0]) for x in xs])
        labs = VGroup(*[T("1 L", 24, SOFT).next_to(bt, DOWN, buff=0.12) for bt in bs])
        return bs, labs

    def way1(self):
        self.section("방법 1 · 1 L씩 먼저")
        bs, labs = self.bottles(1)
        self.say("1 L씩 나누어 주고", "물 4 L가 있어요. 먼저 화분 3개에 1 L씩 나누어 줘요.")
        self.play(FadeIn(bs), FadeIn(labs), run_time=0.6)
        self.play(*[bs[i][0].animate.set_fill(COLS[i], opacity=0.8) for i in range(3)], run_time=0.7)
        last = liter(3, 1.0, 2.2, bs[3].get_center())
        self.say(f"남은 1 L를 {o('3으로')} 똑같이", "남은 1 L는 3으로 똑같이 나누어 3분의 1 L씩 줘요.")
        self.play(FadeOut(bs[3]), FadeIn(last), run_time=0.5)
        self.play(*[last[i].animate.set_fill(COLS[i], opacity=0.8) for i in range(3)], run_time=0.7)
        e = row("4 ÷ 3", "=", "1", "+", frac(1, 3, 50), "=", mixed(1, 1, 3, 50, cw=GREEN, cn=GREEN, cd=GREEN), size=50).move_to([3.4, 0.9, 0])
        self.say(f"4 ÷ 3 = {g('1과 1/3')}", "화분 한 개에 1 L와 3분의 1 L, 1과 3분의 1 L를 줘요.")
        self.play(FadeIn(e), run_time=0.6)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def way2(self):
        self.section("방법 2 · 모두 3으로 나누기")
        bs, labs = self.bottles(3)
        self.say("4 L를 각각 3으로", "이번에는 1 L 4통을 모두 3으로 똑같이 나누어요.")
        self.play(FadeIn(bs), FadeIn(labs), run_time=0.6)
        self.play(LaggedStart(*[bt[i].animate.set_fill(COLS[i], opacity=0.8) for bt in bs for i in range(3)], lag_ratio=0.05, run_time=1.2))
        mine = VGroup(*[bt[0] for bt in bs])
        self.say(f"주황 화분은 {o('1/3 L가 4개')}", "주황 화분은 통마다 3분의 1 L씩, 3분의 1 L를 4개 받아요.")
        self.play(*[Indicate(m, color=ORANGE, scale_factor=1.2) for m in mine], run_time=0.8)
        e1 = row("4 ÷ 3", "=", frac(4, 3, 54, cn=ORANGE), size=50).move_to([3.4, 1.5, 0])
        self.say(f"4 ÷ 3 = {o('4/3')}", "그래서 4 나누기 3은 3분의 4예요.")
        self.play(FadeIn(e1), run_time=0.6)
        e2 = row("=", mixed(1, 1, 3, 54, cw=GREEN, cn=GREEN, cd=GREEN), size=50).next_to(e1, DOWN, buff=0.4).align_to(e1[1], LEFT)
        self.say(f"두 방법의 몫은 {g('같아요')}", "3분의 4는 1과 3분의 1과 같아요. 두 방법의 몫은 같아요. 몫이 1보다 커도 나누어지는 수를 분자, 나누는 수를 분모로 나타내요.")
        self.play(FadeIn(e2), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
