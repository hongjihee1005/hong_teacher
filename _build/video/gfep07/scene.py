"""「수학 원리 돋보기」 분수 특별편 7화 — 몇 개가 모이면 1이 될까?

5분의 1 조각을 하나씩 모으기: 5분의 1, 5분의 2, … 5분의 5 = 막대 하나 = 1
3분의 3, 8분의 8도 1 → 분자와 분모가 같으면 1 / 자주 하는 실수: 5분의 5를 5로 생각
연습: 6분의 1이 몇 개면 1? → 6개(6분의 6)
최종: GRADE=f ./make_final.sh 7
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, ReplacementTransform, Rectangle,
                   SurroundingRectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, frac_bar, pie, row
from items import check_mark, cross_mark


class GfEp07(EpisodeScene):
    GRADE, SEM = "F", 1
    LABEL = "분수 특별편 {}화"
    EP_NO = 7
    EP_TITLE = "몇 개가 모이면 1이 될까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.collect()
        self.more()
        self.practice()
        self.closing(f"{o('분자')}와 {b('분모')}가 같으면 전체 하나, 곧 {g('1')}이에요\n5분의 5 = 3분의 3 = 8분의 8 = {g('1')}",
                     next_preview="분수 특별편 8화 · 진분수: 1보다 작은 분수")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        piece = Rectangle(width=1.2, height=1.0, fill_color=ORANGE, fill_opacity=1, stroke_color=INK, stroke_width=4).move_to([-2.5, 0.5, 0])
        f = frac(1, 5, 80, cn=ORANGE, cd=BLUE).move_to([0.2, 0.5, 0])
        self.say("막대를 똑같이 5칸으로 나눈 한 칸은 5분의 1", "막대를 똑같이 5칸으로 나눈 한 칸은 5분의 1이에요.")
        self.play(FadeIn(piece), Write(f), run_time=0.7)
        q = M(f"5분의 1이 {o('몇 개')} 모이면 막대 하나, 곧 {g('1')}이 될까요?", 46).move_to([0, 2.3, 0])
        self.say("몇 개가 모이면 1이 될까요?", "5분의 1이 몇 개 모이면 막대 하나, 곧 1이 될까요?")
        self.play(FadeIn(q), run_time=0.5)
        self.wait(1.0)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.5)

    def collect(self):
        self.section("하나씩 모으기")
        outline = Rectangle(width=7.0, height=1.0, stroke_color=SOFT, stroke_width=4).move_to([0, 1.0, 0])
        cells = frac_bar(5, 5, width=7.0, height=1.0).move_to([0, 1.0, 0])
        self.play(FadeIn(outline), run_time=0.3)
        lab = None
        for i in range(5):
            f = row(frac(i + 1, 5, 64, cn=ORANGE, cd=BLUE), size=40).move_to([0, -0.9, 0])
            cnt = M(f"5분의 1이 {o(str(i + 1) + '개')}", 40).move_to([0, -2.2, 0])
            nar = f"5분의 1이 {i + 1}개면 5분의 {i + 1}." if i < 4 else "5분의 1이 5개면 5분의 5. 막대가 꽉 찼어요!"
            self.say(f"5분의 1이 {i + 1}개 → {o(f'5분의 {i + 1}')}", nar)
            anims = [FadeIn(cells[i], shift=DOWN * 0.4)]
            if lab is None:
                anims += [FadeIn(f), FadeIn(cnt)]
            else:
                anims += [ReplacementTransform(lab[0], f), ReplacementTransform(lab[1], cnt)]
            self.play(*anims, run_time=0.6)
            lab = (f, cnt)
        box = SurroundingRectangle(cells, color=GREEN, buff=0.12, stroke_width=7)
        one = M(f"= {g('1')}", 80).next_to(lab[0], RIGHT, buff=0.4)
        self.say(f"5분의 5 = 막대 하나 = {g('1')}", "5분의 5는 막대 하나가 꽉 찬 것. 그래서 5분의 5는 1과 같아요.")
        self.play(Create(box), FadeIn(one), run_time=0.7)
        self.wait(1.2)
        self.settle()
        self.section("자주 하는 실수")
        wrong = M("5분의 5 = 5 ?", 50, SOFT).move_to([0, -2.2, 0])
        self.say("5분의 5는 5일까요?", "5개가 모였으니까 5분의 5는 5일까요?")
        self.play(ReplacementTransform(lab[1], wrong), run_time=0.5)
        no = cross_mark(0.4).next_to(wrong, LEFT, buff=0.3)
        self.play(Create(no), run_time=0.4)
        t = M(f"작은 조각 5개가 모여 {g('막대 하나')}가 된 것 → {g('1')}", 42).move_to([0, -2.2, 0])
        self.say(f"조각 5개가 모여 {g('막대 하나')} → 1", "아니에요. 작은 조각 5개가 모여서 막대 하나가 된 것이니까 1이에요.")
        self.play(FadeOut(wrong), FadeOut(no), FadeIn(t), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def more(self):
        self.section("다른 분수도 그럴까?")
        p3 = pie(3, 3, 1.1).move_to([-3.6, 0.6, 0])
        p8 = pie(8, 8, 1.1).move_to([0, 0.6, 0])
        b6 = frac_bar(6, 6, width=3.0, height=0.8).move_to([3.8, 0.6, 0])
        f3 = row(frac(3, 3, 56, cn=ORANGE, cd=BLUE), "=", g("1"), size=56).next_to(p3, DOWN, buff=0.4)
        f8 = row(frac(8, 8, 56, cn=ORANGE, cd=BLUE), "=", g("1"), size=56).next_to(p8, DOWN, buff=0.4)
        f6 = row(frac(6, 6, 56, cn=ORANGE, cd=BLUE), "=", g("1"), size=56).next_to(b6, DOWN, buff=0.7)
        self.say("3분의 3, 8분의 8, 6분의 6도 모두 꽉 차요", "3분의 3, 8분의 8, 6분의 6도 모두 전체가 꽉 차요. 모두 1이에요.")
        self.play(FadeIn(p3), FadeIn(p8), FadeIn(b6), run_time=0.6)
        self.play(FadeIn(f3), FadeIn(f8), FadeIn(f6), run_time=0.6)
        t = M(f"{o('분자')}와 {b('분모')}가 같으면 {g('1')}", 52).move_to([0, -2.2, 0])
        self.say(f"{o('분자')}와 {b('분모')}가 같으면 {g('1')}", "분자와 분모가 같은 분수는 모두 1이에요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def practice(self):
        self.section("연습해요")
        q = row(frac(1, 6, 64, cn=ORANGE, cd=BLUE), "이 몇 개 모이면 1이 될까요?", size=48).move_to([0, 1.8, 0])
        self.say("6분의 1이 몇 개 모이면 1?", "연습해 볼까요? 6분의 1이 몇 개 모이면 1이 될까요?")
        self.play(FadeIn(q), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        bar = frac_bar(6, 6, width=6.0, height=0.9).move_to([0, 0.0, 0])
        self.play(FadeIn(bar, lag_ratio=0.3), run_time=1.0)
        a = row(o("6개"), "→", frac(6, 6, 60, cn=ORANGE, cd=BLUE), "=", g("1"), size=56).move_to([0, -1.6, 0])
        self.say(f"답: {o('6개')} — 6분의 6 = 1", "6개예요. 6분의 1이 6개 모이면 6분의 6, 곧 1이 돼요. 분모만큼 모이면 1이에요.")
        self.play(FadeIn(a), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
