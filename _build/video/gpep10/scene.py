"""「수학 원리 돋보기」 분수 준비 10화 — 조각이 많을수록 한 조각은 작아져요

피자 한 판을 2명·3명·4명이 → 내 조각 2분의 1 > 3분의 1 > 4분의 1 / 막대로 견주기
자주 하는 실수: '4가 2보다 크니까 4분의 1이 더 크다?' / 연습: 5분의 1과 8분의 1
최종: GRADE=p ./make_final.sh 10
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, M, T, b, g, o
from division import clear_stage
from fraction import frac, frac_bar, pie, row
from items import check_mark, cross_mark
from prepkit import PrepScene


class GpEp10(PrepScene):
    EP_NO = 10
    EP_TITLE = "조각이 많을수록 한 조각은 작아져요"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.pizzas()
        self.bars()
        self.mistake()
        self.practice()
        self.closing(f"나누는 조각이 {o('많을수록')} 한 조각은 {g('작아져요')}\n{b('2분의 1')} > {b('3분의 1')} > {b('4분의 1')}",
                     next_preview="분수 준비 11화 · 12개의 3분의 1은 몇 개?")
        self.wait(0.5)

    def pizzas(self):
        self.section("피자 나누어 먹기")
        xs = [-4.2, 0, 4.2]
        ps = VGroup(*[pie(d, 1, 1.3).move_to([x, 0.6, 0]) for d, x in zip([2, 3, 4], xs)])
        who = VGroup(*[T(f"{d}명이 나누면", 36).next_to(p, UP, buff=0.3) for d, p in zip([2, 3, 4], ps)])
        self.say("똑같은 피자를 2명, 3명, 4명이 나누어요", "똑같은 피자 한 판을 2명, 3명, 4명이 똑같이 나누어 먹어요. 색칠한 것이 내 조각이에요.")
        self.play(FadeIn(ps, lag_ratio=0.3), FadeIn(who, lag_ratio=0.3), run_time=1.0)
        q = M("내 조각이 가장 큰 것은?", 46).move_to([0, -1.6, 0])
        self.say("내 조각이 가장 큰 것은?", "어느 때 내 조각이 가장 클까요?")
        self.play(FadeIn(q), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        fs = VGroup(*[frac(1, d, 52, cn=ORANGE, cd=BLUE).next_to(p, DOWN, buff=0.3) for d, p in zip([2, 3, 4], ps)])
        self.play(FadeOut(q), FadeIn(fs), run_time=0.5)
        self.say(f"{g('2명')}이 나눌 때 가장 커요", "2명이 나눌 때 내 조각이 가장 커요. 나누는 사람이 많을수록 내 조각은 작아져요.")
        self.play(Indicate(ps[0][0], color=GREEN, scale_factor=1.1), run_time=0.8)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def bars(self):
        self.section("막대로 견주기")
        bars = VGroup(*[frac_bar(d, 1, width=7.0, height=0.7) for d in (2, 3, 4)]).arrange(DOWN, buff=0.6, aligned_edge=LEFT).move_to([-0.6, 0.55, 0])
        fs = VGroup(*[frac(1, d, 44, cn=ORANGE, cd=BLUE).next_to(bar, RIGHT, buff=0.4) for d, bar in zip((2, 3, 4), bars)])
        self.say("같은 길이의 막대를 2칸, 3칸, 4칸으로", "같은 길이의 막대를 똑같이 2칸, 3칸, 4칸으로 나누고 한 칸씩 색칠했어요.")
        self.play(FadeIn(bars, lag_ratio=0.3), FadeIn(fs, lag_ratio=0.3), run_time=1.0)
        t = row(frac(1, 2, 48, cn=ORANGE, cd=BLUE), "&gt;", frac(1, 3, 48, cn=ORANGE, cd=BLUE), "&gt;", frac(1, 4, 48, cn=ORANGE, cd=BLUE), size=52).move_to([0, -1.75, 0])
        self.say(f"{b('2분의 1')} > {b('3분의 1')} > {b('4분의 1')}", "색칠한 칸의 길이를 보면 2분의 1이 가장 길고, 4분의 1이 가장 짧아요.")
        self.play(FadeIn(t), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def mistake(self):
        self.section("자주 하는 실수")
        w = M(f"4가 2보다 크니까 {frac_txt(4)}이 더 클까요?", 46).move_to([0, 1.6, 0])
        self.say("4가 2보다 크니까 4분의 1이 더 클까요?", "4가 2보다 크니까 4분의 1이 2분의 1보다 클까요?")
        self.play(FadeIn(w), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        no = cross_mark(0.45).next_to(w, LEFT, buff=0.3)
        b2 = frac_bar(2, 1, width=6.0, height=0.7).move_to([-0.4, 0.4, 0])
        b4 = frac_bar(4, 1, width=6.0, height=0.7).next_to(b2, DOWN, buff=0.6, aligned_edge=LEFT)
        l2 = frac(1, 2, 40, cn=ORANGE, cd=BLUE).next_to(b2, RIGHT, buff=0.35)
        l4 = frac(1, 4, 40, cn=ORANGE, cd=BLUE).next_to(b4, RIGHT, buff=0.35)
        t = M(f"아래 수가 커지면 = 더 {o('잘게')} 나눈 것 → 한 조각은 {g('작아요')}", 40).move_to([0, -2.1, 0])
        self.say(f"아래 수가 크면 {o('더 잘게')} 나눈 것", "아니에요. 아래 수가 크다는 것은 더 잘게 나누었다는 뜻이에요. 그래서 한 조각은 더 작아요.")
        self.play(Create(no), FadeIn(b2), FadeIn(b4), FadeIn(l2), FadeIn(l4), run_time=0.7)
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def practice(self):
        self.section("연습해요")
        q = row(frac(1, 5, 70, cn=ORANGE, cd=BLUE), "와", frac(1, 8, 70, cn=ORANGE, cd=BLUE), "중 더 큰 것은?", size=48).move_to([0, 1.6, 0])
        self.say("5분의 1과 8분의 1 중 더 큰 것은?", "연습해 볼까요? 5분의 1과 8분의 1 중 더 큰 것은 무엇일까요?")
        self.play(FadeIn(q), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        b5 = frac_bar(5, 1, width=6.0, height=0.7).move_to([-0.4, 0.3, 0])
        b8 = frac_bar(8, 1, width=6.0, height=0.7).next_to(b5, DOWN, buff=0.6, aligned_edge=LEFT)
        a = row("답:", frac(1, 5, 56, cn=ORANGE, cd=BLUE), "(5조각으로 나눈 한 조각이 더 커요)", size=40).move_to([0, -1.9, 0])
        self.say(f"답: {b('5분의 1')}", "5조각으로 나눈 한 조각이 8조각으로 나눈 한 조각보다 커요. 답은 5분의 1이에요.")
        self.play(FadeIn(b5), FadeIn(b8), run_time=0.6)
        self.play(FadeIn(a), Indicate(b5[0], color=GREEN, scale_factor=1.1), run_time=0.8)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()


def frac_txt(d):
    return f"{b(f'{d}분의')} {o('1')}"
