"""「수학 원리 돋보기」 분수 특별편 1화 — 분수는 '똑같이' 나누는 데서 시작해요

조각 수가 같아도(4조각) 크기가 다르면 분수로 나타낼 수 없음 → 겹쳐 보기 → 똑같이 나눈 것 고르기 4문제
최종: GRADE=f ./make_final.sh 1
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, Line, Polygon, Rectangle,
                   VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, pie, row
from items import check_mark, cross_mark

YEL = "#F2C14E"


def cake(widths, h=1.5, colors=None, pos=(0, 0, 0)):
    """가로로 이어 붙인 조각들(너비 목록)"""
    cols = colors or [YEL] * len(widths)
    parts = VGroup()
    x = 0.0
    for w, c in zip(widths, cols):
        parts.add(Rectangle(width=w, height=h, fill_color=c, fill_opacity=1, stroke_color=INK, stroke_width=5)
                  .move_to([x + w / 2, 0, 0]))
        x += w
    parts.move_to(pos)
    return parts


class GfEp01(EpisodeScene):
    GRADE, SEM = "F", 1
    LABEL = "분수 특별편 {}화"
    EP_NO = 1
    EP_TITLE = "분수는 '똑같이' 나누는 데서 시작해요"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.overlap()
        self.quiz()
        self.closing(f"분수는 전체를 {g('똑같이')} 나눈 것에서 시작해요\n조각의 {o('수')}뿐 아니라 {o('크기')}도 같은지 확인!",
                     next_preview="분수 특별편 2화 · 부분을 분수로 나타내는 3단계")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        a = cake([0.9, 0.9, 0.9, 0.9], pos=(-3.2, 0.4, 0))
        c = cake([0.45, 1.35, 0.7, 1.1], pos=(3.2, 0.4, 0))
        la = T("가", 40).next_to(a, DOWN, buff=0.35)
        lc = T("나", 40).next_to(c, DOWN, buff=0.35)
        self.say("두 친구가 케이크를 4조각으로 잘랐어요", "두 친구가 똑같은 케이크를 각각 4조각으로 잘랐어요.")
        self.play(FadeIn(a), FadeIn(c), FadeIn(la), FadeIn(lc), run_time=0.8)
        q = row("한 조각을", frac(1, 4, 50, cn=ORANGE, cd=BLUE), "이라고 할 수 있는 것은?", size=46).move_to([0, 2.5, 0])
        self.say("한 조각을 4분의 1이라고 할 수 있는 것은?", "둘 다 4조각이에요. 그런데 한 조각을 4분의 1이라고 할 수 있는 케이크는 어느 것일까요?")
        self.play(FadeIn(q), run_time=0.5)
        self.wait(1.0)
        self.pause_screen(5)
        self.settle()
        self.cakes = (a, c, la, lc)
        self.play(FadeOut(q), run_time=0.4)

    def overlap(self):
        self.section("겹쳐 보기")
        a, c, la, lc = self.cakes
        self.say("조각을 하나씩 떼어 겹쳐 볼까요?", "조각을 떼어 내어 서로 겹쳐 볼까요?")
        tgt_a = a[0].get_center() + DOWN * 2.2
        self.play(*[p.animate.move_to(tgt_a).set_fill(opacity=0.55) for p in a], FadeOut(la), run_time=1.2)
        ok = check_mark(0.55).next_to(a[0], RIGHT, buff=0.4)
        self.say(f"가: 네 조각이 {g('꼭 맞게')} 겹쳐요", "가는 네 조각이 꼭 맞게 겹쳐요. 모양과 크기가 모두 같아요.")
        self.play(Create(ok), run_time=0.4)
        tgt_c = c[0].get_left() + DOWN * 2.2
        moves = [p.animate.move_to(tgt_c + RIGHT * p.width / 2).set_fill(opacity=0.55) for p in c]
        self.play(*moves, FadeOut(lc), run_time=1.2)
        no = cross_mark(0.45).next_to(c[1], RIGHT, buff=0.4)
        self.say("나: 큰 조각, 작은 조각이 섞여 있어요", "나는 큰 조각과 작은 조각이 섞여 있어서 꼭 맞지 않아요.")
        self.play(Create(no), run_time=0.4)
        t1 = M(f"가의 한 조각 = 전체의 {o('4분의 1')}", 44).move_to([0, 2.3, 0])
        t2 = M("나의 조각은 4분의 1이라고 할 수 없어요", 44).move_to([0, 1.5, 0])
        self.say(f"똑같이 나눈 {g('가')}의 조각만 4분의 1이에요",
                 "그래서 똑같이 나눈 가의 한 조각만 4분의 1이에요. 나의 조각은 4분의 1이라고 할 수 없어요.")
        self.play(FadeIn(t1), run_time=0.5)
        self.play(FadeIn(t2), run_time=0.5)
        self.wait(1.2)
        key = M(f"조각의 {o('수')}만 세지 말고, {o('크기')}가 같은지도 봐요!", 46).move_to([0, -2.1, 0])
        self.say("수만 세지 말고 크기도 보기!", "분수를 쓰기 전에는 조각의 수만 세지 말고, 조각의 크기가 모두 같은지 꼭 확인해요.")
        self.play(FadeOut(VGroup(*a, *c, ok, no)), FadeIn(key), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def quiz(self):
        self.section("똑같이 나눈 것 고르기")
        s = 1.7
        # ① 원 3조각(같음)
        f1 = pie(3, 0, 0.95).move_to([-4.8, 0.6, 0])
        # ② 정사각형 3줄(다름)
        f2 = cake([0.35, 0.95, 0.4], h=s, colors=["#FFFFFF"] * 3, pos=(-1.6, 0.6, 0))
        # ③ 정사각형 대각선 4개(같음)
        c3 = np.array([1.6, 0.6, 0])
        h = s / 2
        corners = [c3 + np.array(v) for v in ([-h, h, 0], [h, h, 0], [h, -h, 0], [-h, -h, 0])]
        f3 = VGroup(*[Polygon(corners[i], corners[(i + 1) % 4], c3, fill_color=PAPER, fill_opacity=1,
                              stroke_color=INK, stroke_width=5) for i in range(4)])
        # ④ 원을 가운데가 아닌 곳에서 둘로(다름)
        c4 = np.array([4.8, 0.6, 0])
        f4c = pie(1, 0, 0.95).move_to(c4)
        f4l = Line(c4 + np.array([0.45, 0.84, 0]), c4 + np.array([0.45, -0.84, 0]), color=INK, stroke_width=5)
        f4 = VGroup(f4c, f4l)
        figs = [f1, f2, f3, f4]
        nums = VGroup(*[T(n, 40).next_to(fg, UP, buff=0.3) for n, fg in zip("①②③④", figs)])
        self.say("똑같이 나눈 것을 모두 찾아보세요", "이번에는 여러분 차례예요. 똑같이 나눈 것을 모두 찾아보세요.")
        self.play(*[FadeIn(fg) for fg in figs], FadeIn(nums), run_time=0.8)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        marks = []
        reasons = [("세 조각\n크기가 같아요", True), ("가운데가\n넓어요", False),
                   ("네 삼각형이\n꼭 맞아요", True), ("한쪽이\n훨씬 커요", False)]
        narr = ["1번은 세 조각의 크기가 같아요. 똑같이 나누었어요.",
                "2번은 가운데 조각이 더 넓어요. 똑같이 나눈 것이 아니에요.",
                "3번은 네 삼각형을 돌려 겹치면 꼭 맞아요. 똑같이 나누었어요.",
                "4번은 한쪽이 훨씬 커요. 똑같이 나눈 것이 아니에요."]
        for i, ((txt, ok), fg, nn) in enumerate(zip(reasons, figs, narr)):
            mk = (check_mark(0.5) if ok else cross_mark(0.42)).next_to(fg, DOWN, buff=0.35)
            lab = M(g(txt) if ok else txt, 28).next_to(mk, DOWN, buff=0.2)
            self.say(f"{'①②③④'[i]} {g('똑같이 나눔') if ok else '똑같이 나누지 않음'} — {txt.replace(chr(10), ' ')}", nn)
            self.play(Create(mk), FadeIn(lab), Indicate(fg, color=GREEN if ok else SOFT, scale_factor=1.06), run_time=0.7)
            marks += [mk, lab]
        self.say(f"똑같이 나눈 것은 {g('①과 ③')}", "똑같이 나눈 것은 1번과 3번이에요.")
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
