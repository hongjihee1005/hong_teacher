"""「수학 원리 돋보기」 나눗셈 차근차근 11화 — 나머지를 어떻게 할까? 생활 문제

① 학생 26명, 보트 한 대에 4명 → 26 ÷ 4 = 6 … 2 → 남은 2명도 타야 하니 7대
② 사탕 26개를 4개씩 봉지에 → 6 … 2 → 다 찬 봉지는 6봉지(2개 남음)
연습: 30쪽 책을 하루 4쪽씩 → 7 … 2 → 8일
최종: GRADE=d ./make_final.sh 11
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, Ellipse, FadeIn, FadeOut, Indicate, LaggedStart, Polygon,
                   RoundedRectangle, SurroundingRectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, M, T, b, g, o
from division import clear_stage
from divkit import DivScene
from fracbasic import step_card
from items import group_boxes, layout
from prepkit import PINK, RED, items

PUR = "#B05FD0"


def pur(s):
    return f'<span foreground="{PUR}">{s}</span>'


def boat(w=1.25):
    hull = Polygon([-w / 2, 0, 0], [w / 2, 0, 0], [w / 2 - 0.2, -0.32, 0], [-w / 2 + 0.2, -0.32, 0],
                   fill_color="#8C6A4A", fill_opacity=1, stroke_color=INK, stroke_width=3)
    return hull


class GdEp11(DivScene):
    EP_NO = 11
    EP_TITLE = "나머지를 어떻게 할까? 생활 문제"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.boats()
        self.bags()
        self.practice()
        self.closing(f"나머지도 {o('모두 필요')}하면 → 몫에 {g('1을 더해요')}(보트 7대)\n{b('다 찬 것만')} 세면 → 몫 그대로(6봉지)",
                     next_preview="나눗셈 차근차근 12화 · 몇십을 나누면?")
        self.wait(0.5)

    def boats(self):
        self.section("① 보트는 몇 대?")
        q = M("학생 26명이 한 대에 4명씩 타는 보트를 타요.\n보트는 적어도 몇 대가 필요할까요?", 42).move_to([0, 1.95, 0])
        self.say("26명, 한 대에 4명씩, 보트는 몇 대?", "학생 26명이 한 대에 4명씩 타는 보트를 타려고 해요. 보트는 적어도 몇 대가 필요할까요?")
        self.play(FadeIn(q), run_time=0.6)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        e = M(f"26 ÷ 4 = {g('6')} … {pur('2')}", 60).move_to([0, 0.8, 0])
        self.say(f"26 ÷ 4 = 6 … 2", "26 나누기 4는 몫이 6, 나머지가 2예요.")
        self.play(Write(e), run_time=0.6)
        bs = VGroup(*[boat() for _ in range(7)]).arrange(RIGHT, buff=0.3).move_to([0, -0.6, 0])
        ppl = VGroup()
        for k, bt in enumerate(bs):
            n = 4 if k < 6 else 2
            heads = VGroup(*[items(1, color=ORANGE if k < 6 else PUR, r=0.1)[0] for _ in range(n)]).arrange(RIGHT, buff=0.04).next_to(bt, UP, buff=0.02)
            ppl.add(heads)
        self.play(FadeIn(VGroup(*bs[:6])), FadeIn(VGroup(*ppl[:6])), run_time=0.7)
        self.say(f"6대에 24명, 남은 {pur('2명')}도 타야 해요", "보트 6대에 24명이 타요. 그런데 남은 2명도 타야 하지요.")
        self.play(FadeIn(ppl[6]), run_time=0.5)
        self.play(FadeIn(bs[6]), run_time=0.5)
        a = M(f"6 + 1 = {g('7대')}", 56).move_to([0, -1.9, 0])
        self.say(f"보트 {g('7대')}", "그래서 보트 한 대가 더 있어야 해요. 6 더하기 1, 7대가 필요해요.")
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def bags(self):
        self.section("② 봉지는 몇 개?")
        q = M("사탕 26개를 한 봉지에 4개씩 담아요.\n사탕이 가득 찬 봉지는 몇 개일까요?", 42).move_to([0, 1.95, 0])
        self.say("26개를 4개씩, 가득 찬 봉지는?", "이번에는 사탕 26개를 한 봉지에 4개씩 담아요. 사탕이 가득 찬 봉지는 몇 개일까요?")
        self.play(FadeIn(q), run_time=0.6)
        its = items(26, color=PINK, y=0.3, step=0.34, r=0.13)
        pts = layout(26, 4, 6, y=0.3, step=0.34, gap=0.55)
        for m, p in zip(its, pts):
            m.move_to(p)
        bx = group_boxes(list(its), 4, 6)
        self.play(FadeIn(its), run_time=0.5)
        self.play(FadeIn(bx), run_time=0.6)
        e = M(f"26 ÷ 4 = {g('6')} … {pur('2')}", 56).move_to([0, -0.9, 0])
        self.say("26 ÷ 4 = 6 … 2", "26 나누기 4는 몫이 6, 나머지가 2예요.")
        self.play(Write(e), run_time=0.5)
        a = M(f"남은 {pur('2개')}로는 봉지를 채울 수 없어요 → {g('6봉지')}", 46).move_to([0, -1.9, 0])
        self.say(f"가득 찬 봉지는 {g('6봉지')}", "남은 2개로는 봉지를 가득 채울 수 없어요. 그래서 가득 찬 봉지는 몫 그대로 6봉지예요.")
        self.play(FadeIn(a), Indicate(VGroup(*its[24:]), color=PUR), run_time=0.7)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def practice(self):
        self.section("연습해요")
        q = M("30쪽짜리 책을 하루에 4쪽씩 읽어요.\n모두 읽으려면 며칠이 걸릴까요?", 44).move_to([0, 1.6, 0])
        self.say("30쪽, 하루 4쪽씩, 며칠?", "연습해 볼까요? 30쪽짜리 책을 하루에 4쪽씩 읽으면, 모두 읽는 데 며칠이 걸릴까요?")
        self.play(FadeIn(q), run_time=0.6)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        e = M(f"30 ÷ 4 = {g('7')} … {pur('2')}", 60).move_to([0, 0.0, 0])
        a = M(f"남은 {pur('2쪽')}도 읽어야 하니 7 + 1 = {g('8일')}", 48).move_to([0, -1.3, 0])
        self.say(f"7 … 2 → 남은 2쪽도 읽어야 하니 {g('8일')}", "30 나누기 4는 몫이 7, 나머지가 2예요. 남은 2쪽도 읽어야 하니 하루 더, 8일이 걸려요.")
        self.play(Write(e), run_time=0.5)
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
