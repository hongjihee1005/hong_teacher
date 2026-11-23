"""「수학 원리 돋보기」 개념 차근차근 41화 — 약수

12개를 똑같이 나누어 묶을 수 있는 방법: 1, 2, 3, 4, 6, 12 → 12의 약수(나누어떨어지게 하는 수)
직사각형 배열로 찾기(1×12, 2×6, 3×4), 짝 지어 찾기 / 1은 모든 수의 약수, 자기 자신도 약수 / 연습: 18의 약수
최종: GRADE=c ./make_final.sh 41
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, Line, SurroundingRectangle, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, M, T, b, g, o
from division import clear_stage
from conceptkit import ConceptScene, dot, dots, ten_frame, RED
from items import check_mark, cross_mark
from storykit import book, scroll, show_sources
from fraction import frac, frac_bar, row
from prepkit import grid_items


class GcEp41(ConceptScene):
    EP_NO = 41
    EP_TITLE = "약수"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.meaning()
        self.rect()
        self.practice()
        self.closing(f"어떤 수를 {g('나누어떨어지게')} 하는 수가 그 수의 약수\n12의 약수: 1, 2, 3, 4, 6, 12 (짝: 1·12, 2·6, 3·4)",
                     next_preview="개념 차근차근 42화 · 배수")
        self.wait(0.5)

    def meaning(self):
        self.section("약수란?")
        e = VGroup(*[M(f"12 ÷ {d} = {12 // d}" if 12 % d == 0 else f"12 ÷ {d} = {12 // d} … {12 % d}", 40, INK if 12 % d == 0 else SOFT) for d in range(1, 13)]).arrange_in_grid(rows=4, buff=(0.8, 0.25), flow_order="dr").move_to([0, 0.7, 0])
        self.say("12를 1부터 12까지로 나누어 볼까요?", "12를 1부터 12까지 차례로 나누어 볼까요? 나누어떨어지는 것은 진하게, 나머지가 있는 것은 흐리게 썼어요.")
        self.play(FadeIn(e, lag_ratio=0.05), run_time=1.4)
        t = M(f"나누어떨어지게 하는 수 {g('1, 2, 3, 4, 6, 12')} → 12의 {o('약수')}", 46).move_to([0, -1.8, 0])
        self.say(f"12의 {o('약수')}", "12를 나누어떨어지게 하는 수 1, 2, 3, 4, 6, 12를 12의 약수라고 해요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def rect(self):
        self.section("직사각형으로 찾기")
        gs = VGroup(grid_items(1, 12, BLUE, step=0.42, r=0.15), grid_items(2, 6, ORANGE, step=0.42, r=0.15), grid_items(3, 4, GREEN, step=0.42, r=0.15)).arrange(RIGHT, buff=0.9).move_to([0, 1.0, 0])
        labs = VGroup(*[M(x, 40).next_to(g_, DOWN, buff=0.35) for x, g_ in zip(["1 × 12", "2 × 6", "3 × 4"], gs)])
        self.say("12개로 만들 수 있는 직사각형", "구슬 12개로 직사각형을 만들어 볼까요? 1줄에 12개, 2줄에 6개, 3줄에 4개.")
        self.play(LaggedStart(*[FadeIn(VGroup(g_, l)) for g_, l in zip(gs, labs)], lag_ratio=0.4), run_time=1.6)
        t = M(f"곱해서 12가 되는 짝: {b('1·12')}, {o('2·6')}, {g('3·4')} → 약수 6개", 44).move_to([0, -1.3, 0])
        self.say("곱해서 12가 되는 짝", "곱해서 12가 되는 짝을 찾으면 약수를 빠짐없이 찾을 수 있어요. 1과 12, 2와 6, 3과 4.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        q = M("18의 약수를 모두 구해 보세요", 56).move_to([0, 1.2, 0])
        self.say("18의 약수는?", "연습해 볼까요? 18의 약수를 모두 구해 보세요. 곱해서 18이 되는 짝을 찾아요.")
        self.play(FadeIn(q), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a = M(f"1·18, 2·9, 3·6 → {g('1, 2, 3, 6, 9, 18')}", 56).move_to([0, -0.4, 0])
        self.say(f"{g('1, 2, 3, 6, 9, 18')}", "1과 18, 2와 9, 3과 6. 18의 약수는 1, 2, 3, 6, 9, 18이에요.")
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
