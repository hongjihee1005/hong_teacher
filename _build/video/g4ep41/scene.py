"""「수학 원리 돋보기」 4학년 41화 — 10배 하면 소수점은? (4-2 3단원 7차시, 화 코드 4-2-3-d)

1의 1/10 = 0.1, 1/100 = 0.01, 1/1000 = 0.001 / 0.001의 10배 = 0.01, 100배 = 0.1, 1000배 = 1
10배: 소수점 기준으로 수가 왼쪽으로 한 자리, 1/10: 오른쪽으로 한 자리 (0.35 → 3.5 → 35)
최종: GRADE=4 ./make_final.sh 41
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Arrow, Create, Dot, FadeIn, FadeOut, Indicate, Line, Rectangle, Transform,
                   VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from decimal4 import GREEN2

HEAD = ["십", "일", "소수 첫째", "소수 둘째", "소수 셋째"]
COLS = [BLUE, INK, ORANGE, BLUE, GREEN2]
CW = 1.9


class Table:
    def __init__(self, center):
        c = np.array(center, float)
        self.x = [c[0] + (i - 2) * CW for i in range(5)]
        self.y_head, self.y_row = c[1] + 0.95, c[1]
        g = VGroup()
        for i, h in enumerate(HEAD):
            r = Rectangle(width=CW, height=0.65, fill_color="#F3EEE4", fill_opacity=1, stroke_color=SOFT, stroke_width=2).move_to([self.x[i], self.y_head, 0])
            g.add(r, T(h, 26, SOFT).move_to(r))
            g.add(Rectangle(width=CW, height=1.05, fill_color=PAPER, fill_opacity=1, stroke_color=SOFT, stroke_width=2).move_to([self.x[i], self.y_row, 0]))
        self.dot_x = (self.x[1] + self.x[2]) / 2
        g.add(Dot([self.dot_x, self.y_row - 0.32, 0], radius=0.1, color=INK))
        self.g = g

    def digits(self, s):
        """s 예: '0.35' → 자리 칸에 숫자"""
        a, b_ = s.split(".") if "." in s else (s, "")
        out = VGroup()
        for k, ch in enumerate(reversed(a)):
            i = 1 - k
            out.add(T(ch, 64, COLS[i]).move_to([self.x[i], self.y_row, 0]))
        for k, ch in enumerate(b_):
            i = 2 + k
            out.add(T(ch, 64, COLS[i]).move_to([self.x[i], self.y_row, 0]))
        return out


class G4Ep41(EpisodeScene):
    GRADE, SEM = 4, 2
    EP_NO = 41
    EP_TITLE = "10배 하면 소수점은?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.relation()
        self.shift()
        self.closing(f"10배 하면 수가 소수점을 기준으로 {o('왼쪽')}으로 한 자리,\n1/10을 하면 {b('오른쪽')}으로 한 자리 옮겨 가요",
                     next_preview="4학년 42화 · 소수의 덧셈은 왜 소수점을 맞출까?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("0.35를 10배 하면 얼마일까요?", 54).move_to([0.6, 1.4, 0])
        self.say("0.35를 10배 하면?", "구슬 한 개의 무게가 0.35그램이에요. 10개의 무게, 0.35의 10배는 얼마일까요?")
        self.play(Write(q), run_time=0.9)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def relation(self):
        self.section("1, 0.1, 0.01, 0.001")
        vals = ["1", "0.1", "0.01", "0.001"]
        ms = VGroup(*[T(v, 70, c) for v, c in zip(vals, [INK, ORANGE, BLUE, GREEN2])]).arrange(RIGHT, buff=1.5).move_to([0, 0.4, 0])
        self.say("1을 10으로 나눌 때마다", "1을 10으로 나눈 하나는 0.1, 0.1을 10으로 나눈 하나는 0.01, 그다음은 0.001이에요.")
        self.play(FadeIn(ms), run_time=0.7)
        downs = VGroup(*[Arrow(ms[i].get_bottom() + DOWN * 0.1, ms[i + 1].get_bottom() + DOWN * 0.1, path_arc=0.9, color=BLUE, buff=0.05) for i in range(3)])
        dl = VGroup(*[T("× 1/10", 26, BLUE).next_to(d, DOWN, buff=0.02) for d in downs])
        ups = VGroup(*[Arrow(ms[i + 1].get_top() + UP * 0.1, ms[i].get_top() + UP * 0.1, path_arc=0.9, color=ORANGE, buff=0.05) for i in range(3)])
        ul = VGroup(*[T("× 10", 26, ORANGE).next_to(u, UP, buff=0.02) for u in ups])
        self.play(Create(downs), FadeIn(dl), run_time=0.9)
        self.say(f"거꾸로 0.001을 {o('10배')} 하면 0.01", "거꾸로 0.001을 10배 하면 0.01, 100배 하면 0.1, 1000배 하면 1이에요.")
        self.play(Create(ups), FadeIn(ul), run_time=0.9)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def shift(self):
        self.section("자리가 옮겨 가요")
        tb = Table([0, 0.6, 0])
        self.say("자리 칸에 0.35를 넣어요", "자리 칸에 0.35를 넣어 볼게요.")
        self.play(FadeIn(tb.g), run_time=0.6)
        d = tb.digits("0.35")
        self.play(FadeIn(d), run_time=0.5)
        steps = [("3.5", f"10배 → {o('3.5')}", "10배 하면 숫자들이 소수점을 기준으로 왼쪽으로 한 자리씩 옮겨 가요. 3.5가 돼요."),
                 ("35", f"또 10배 → {o('35')}", "한 번 더 10배 하면 또 왼쪽으로 한 자리, 35가 돼요. 0.35의 100배는 35예요.")]
        for s, mk, nar in steps:
            self.say(mk, nar)
            nd = tb.digits(s)
            self.play(Transform(d, nd), run_time=1.0)
            self.wait(0.6)
        self.say(f"1/10을 하면 {b('오른쪽')}으로", "반대로 1/10을 하면 오른쪽으로 한 자리씩 옮겨 가요. 35의 1/10은 3.5예요.")
        self.play(Transform(d, tb.digits("3.5")), run_time=1.0)
        ans = M(f"0.35 × 10 = {g('3.5')}", 60).move_to([0, -1.6, 0])
        self.say(f"구슬 10개는 {g('3.5 g')}", "그래서 처음 문제의 답, 구슬 10개의 무게는 3.5그램이에요.")
        self.play(FadeIn(ans), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
