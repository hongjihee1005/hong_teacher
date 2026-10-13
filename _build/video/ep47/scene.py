"""「수학 원리 돋보기」 47화 — '똑같이' 나누어야 분수예요 (1학기 6단원 분수와 소수 2·3·4차시, 화 코드 1-6-a)

똑같이 나눈 것과 아닌 것(겹쳐 보기) → 1/2 → 분모·분자 → 5분의 2와 남은 5분의 3
최종: ./make_final.sh 47
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, PI, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, Line, Polygon, Rectangle, Rotate,
                   SurroundingRectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, frac_bar, pie, row
from items import check_mark, cross_mark


class Ep47(EpisodeScene):
    EP_NO = 47
    EP_TITLE = "'똑같이' 나누어야 분수예요"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.overlap()
        self.half()
        self.parts()
        self.closing(f"전체를 {g('똑같이')} 나눈 것 중의 몇을 {o('분수')}로 나타내요\n아래는 {b('분모')}, 위는 {o('분자')}",
                     next_preview="48화 · 단위분수가 모이면?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        a = Rectangle(width=2.4, height=1.6, fill_color=PAPER, fill_opacity=1, stroke_color=INK, stroke_width=5).move_to([-3.0, 0.2, 0])
        la = Line(a.get_top(), a.get_bottom(), color=INK, stroke_width=5)
        c = Rectangle(width=2.4, height=1.6, fill_color=PAPER, fill_opacity=1, stroke_color=INK, stroke_width=5).move_to([3.0, 0.2, 0])
        lc = Line(c.get_top() + LEFT * 0.5, c.get_bottom() + LEFT * 0.5, color=INK, stroke_width=5)
        n = VGroup(T("가", 40).next_to(a, DOWN, buff=0.3), T("나", 40).next_to(c, DOWN, buff=0.3))
        self.say("두 사람이 부침개를 둘로 나누었어요", "두 사람이 부침개를 둘로 나누었어요.")
        self.play(FadeIn(a), FadeIn(c), Create(la), Create(lc), FadeIn(n), run_time=0.9)
        q = M(f"어느 것이 {g('똑같이')} 나눈 것일까요?", 52).move_to([0, 2.4, 0])
        self.say("어느 것이 똑같이 나눈 것일까요?", "어느 것이 똑같이 나눈 것일까요?")
        self.play(FadeIn(q), run_time=0.5)
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def overlap(self):
        self.section("겹쳐 보기")
        L = Rectangle(width=1.2, height=1.6, fill_color=BLUE, fill_opacity=0.5, stroke_color=INK, stroke_width=4).move_to([-3.6, 0.6, 0])
        R = Rectangle(width=1.2, height=1.6, fill_color=ORANGE, fill_opacity=0.5, stroke_color=INK, stroke_width=4).next_to(L, RIGHT, buff=0)
        self.say("가를 반으로 접어 겹쳐 보면", "가의 두 조각을 겹쳐 보면 어떨까요?")
        self.play(FadeIn(L), FadeIn(R), run_time=0.5)
        self.play(R.animate.move_to(L), run_time=1.0)
        ok = check_mark(0.6).next_to(L, UP, buff=0.3)
        self.say(f"꼭 맞게 겹쳐져요 → {g('똑같이 나눈 것')}", "꼭 맞게 겹쳐져요. 모양과 크기가 같으니 똑같이 나눈 것이에요.")
        self.play(Create(ok), run_time=0.4)
        L2 = Rectangle(width=0.7, height=1.6, fill_color=BLUE, fill_opacity=0.5, stroke_color=INK, stroke_width=4).move_to([2.2, 0.6, 0])
        R2 = Rectangle(width=1.7, height=1.6, fill_color=ORANGE, fill_opacity=0.5, stroke_color=INK, stroke_width=4).next_to(L2, RIGHT, buff=0)
        self.say("나는 어떨까요?", "나의 두 조각도 겹쳐 볼까요?")
        self.play(FadeIn(L2), FadeIn(R2), run_time=0.5)
        self.play(R2.animate.move_to(L2.get_center() + RIGHT * 0.5), run_time=1.0)
        no = cross_mark(0.5).next_to(VGroup(L2, R2), UP, buff=0.3)
        self.say("크기가 달라요 → 똑같이 나눈 것이 아니에요", "크기가 달라서 꼭 맞지 않아요. 똑같이 나눈 것이 아니에요.")
        self.play(Create(no), run_time=0.4)
        t = M(f"{g('똑같이')} 나누기 = 조각의 모양과 크기가 모두 같게", 44).move_to([0, -1.6, 0])
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def half(self):
        self.section("분수")
        p = pie(2, 1, 1.4).move_to([-3.4, 0.3, 0])
        self.say("전체를 똑같이 2로 나눈 것 중의 1", "전체를 똑같이 2로 나눈 것 중의 1을 생각해 볼까요?")
        self.play(FadeIn(p), run_time=0.6)
        f = frac(1, 2, 120, cn=ORANGE, cd=BLUE).move_to([1.0, 0.4, 0])
        self.say(f"{o('2분의 1')}이라고 써요", "이것을 이렇게 쓰고 2분의 1이라고 읽어요. 이런 수를 분수라고 해요.")
        self.play(Write(f), run_time=0.9)
        ld = M(f"{b('분모')}: 똑같이 나눈 수", 42).next_to(f.den, RIGHT, buff=0.6)
        ln = M(f"{o('분자')}: 그중의 수", 42).next_to(f.num, RIGHT, buff=0.6)
        self.say(f"아래는 {b('분모')}, 위는 {o('분자')}", "선 아래의 수를 분모, 선 위의 수를 분자라고 해요.")
        self.play(FadeIn(ld), FadeIn(ln), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def parts(self):
        self.section("색칠한 부분과 남은 부분")
        bar = frac_bar(5, 2, width=7.0, height=0.9).move_to([0, 1.2, 0])
        self.say("5칸 중 2칸을 색칠했어요", "막대를 똑같이 5칸으로 나누어 2칸을 색칠했어요.")
        self.play(FadeIn(bar), run_time=0.6)
        a = row("색칠한 부분:", frac(2, 5, 56, cn=ORANGE), size=46).move_to([-3.0, -0.6, 0])
        c = row("색칠하지 않은 부분:", frac(3, 5, 56), size=46).move_to([3.0, -0.6, 0])
        self.say(f"색칠한 부분 {o('5분의 2')}, 남은 부분 5분의 3", "색칠한 부분은 5분의 2, 색칠하지 않은 부분은 5분의 3이에요.")
        self.play(FadeIn(a), run_time=0.5)
        self.play(FadeIn(c), run_time=0.5)
        t = M("두 부분을 합하면 전체가 돼요", 44).move_to([0, -2.0, 0])
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
