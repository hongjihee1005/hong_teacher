"""「수학 원리 돋보기」 분수 준비 8화 — 하나를 똑같이 나누기

사탕 여러 개가 아니라 '종이 한 장'도 똑같이 나눌 수 있어요 → 반으로 접기(2조각, 겹치면 꼭 맞음) → 또 반으로(4조각)
피자 한 판을 3명이 → 3조각(크기가 같게) / 연습: 4명이 나누면 몇 조각?
최종: GRADE=p ./make_final.sh 8
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, DashedLine, FadeIn, FadeOut, Indicate, Line, Rectangle, VGroup,
                   Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, M, T, b, g, o
from division import clear_stage
from fraction import pie
from items import check_mark
from fracbasic import spot
from prepkit import PrepScene

YEL = "#F2C14E"


def rect(w, h, c, color=YEL):
    return Rectangle(width=w, height=h, fill_color=color, fill_opacity=1, stroke_color=INK, stroke_width=5).move_to(c)


class GpEp08(PrepScene):
    EP_NO = 8
    EP_TITLE = "하나를 똑같이 나누기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.paper()
        self.pizza()
        self.practice()
        self.closing(f"{g('하나')}도 똑같이 나눌 수 있어요\n조각의 {o('크기')}가 모두 같아야 해요",
                     next_preview="분수 준비 9화 · 조각에 이름 붙이기")
        self.wait(0.5)

    def paper(self):
        self.section("종이 한 장 나누기")
        W, H = 4.0, 2.6
        whole = rect(W, H, [-2.6, 0.4, 0])
        self.say("종이가 한 장 있어요", "지금까지는 사탕 여러 개를 나누었어요. 이번에는 종이 한 장을 나누어 볼까요?")
        self.play(FadeIn(whole), run_time=0.5)
        fold = DashedLine(whole.get_top(), whole.get_bottom(), color=BLUE, stroke_width=6)
        self.say(f"반으로 {b('접어요')}", "종이를 반으로 접어요. 가운데 접는 선이 생겨요.")
        self.play(Create(fold), run_time=0.7)
        L = rect(W / 2, H, whole.get_center() + LEFT * W / 4)
        R = rect(W / 2, H, whole.get_center() + RIGHT * W / 4, color="#F7D98A")
        self.remove(whole)
        self.add(L, R)
        self.play(FadeOut(fold), L.animate.shift(LEFT * 0.3), R.animate.shift(RIGHT * 0.3), run_time=0.7)
        self.say("자른 두 조각을 겹쳐 보면?", "접는 선을 따라 자른 두 조각을 겹쳐 볼까요?")
        self.play(R.animate.move_to(L.get_center()).set_fill(opacity=0.6), run_time=0.9)
        ok = check_mark(0.5).next_to(L, UP, buff=0.3)
        self.say(f"꼭 맞아요 → {g('똑같이 2조각')}", "꼭 맞게 겹쳐져요. 종이 한 장을 똑같이 2조각으로 나누었어요.")
        self.play(Create(ok), run_time=0.4)
        self.wait(0.8)
        self.settle()
        self.play(FadeOut(VGroup(L, R, ok)), run_time=0.4)
        whole = rect(W, H, [-2.6, 0.4, 0])
        f1 = DashedLine(whole.get_top(), whole.get_bottom(), color=BLUE, stroke_width=6)
        f2 = DashedLine(whole.get_left(), whole.get_right(), color=BLUE, stroke_width=6)
        self.say(f"한 번 더 반으로 접으면 {o('4조각')}", "이번에는 반으로 접고, 한 번 더 반으로 접어 볼까요? 펼치면 똑같은 4조각이 생겨요.")
        self.play(FadeIn(whole), run_time=0.4)
        self.play(Create(f1), run_time=0.5)
        self.play(Create(f2), run_time=0.5)
        cnt = VGroup(*[T(str(i + 1), 44, INK).move_to(whole.get_center() + v) for i, v in
                       enumerate([LEFT * 1 + UP * 0.65, RIGHT * 1 + UP * 0.65, LEFT * 1 + DOWN * 0.65, RIGHT * 1 + DOWN * 0.65])])
        self.play(FadeIn(cnt, lag_ratio=0.4), run_time=1.0)
        t = M(f"접을수록 조각 수가 늘어나요\n2조각 → {o('4조각')}", 44).move_to([3.4, 0.4, 0])
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def pizza(self):
        self.section("피자 한 판 나누기")
        p = pie(3, 0, 1.6, color=ORANGE).move_to([-3.0, 0.3, 0])
        self.say("피자 한 판을 3명이 똑같이", "피자 한 판을 3명이 똑같이 나누어 먹으려면, 몇 조각으로 잘라야 할까요?")
        from manim import Circle
        c = Circle(radius=1.6, fill_color=YEL, fill_opacity=1, stroke_color=INK, stroke_width=5).move_to(p)
        self.play(FadeIn(c), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        for s in p:
            s.set_fill(YEL, 1)
        self.say(f"크기가 같은 {o('3조각')}", "크기가 같은 3조각으로 잘라요. 한 사람이 한 조각씩 먹어요.")
        self.play(FadeIn(p), run_time=0.8)
        names = VGroup(*[T(n_, 40, INK).move_to(spot(p[i])) for i, n_ in enumerate(["가", "나", "다"])])
        self.play(FadeIn(names), run_time=0.5)
        t = M(f"사람 수만큼\n{g('똑같은 크기')}로 잘라요", 46).move_to([3.0, 0.3, 0])
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def practice(self):
        self.section("연습해요")
        from manim import Circle
        c = Circle(radius=1.6, fill_color=YEL, fill_opacity=1, stroke_color=INK, stroke_width=5).move_to([-3.0, 0.3, 0])
        q = M("피자 한 판을 4명이 똑같이 나누려면?", 46).move_to([0, 2.4, 0])
        self.say("4명이 나누려면 몇 조각?", "연습해 볼까요? 피자 한 판을 4명이 똑같이 나누려면 몇 조각으로 잘라야 할까요?")
        self.play(FadeIn(c), FadeIn(q), run_time=0.6)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        p = pie(4, 0, 1.6).move_to(c)
        for s in p:
            s.set_fill(YEL, 1)
        a = M(f"크기가 같은 {o('4조각')}", 52).move_to([2.8, 0.3, 0])
        self.say(f"크기가 같은 {o('4조각')}", "크기가 같은 4조각으로 잘라요.")
        self.play(FadeIn(p), FadeIn(a), run_time=0.7)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
