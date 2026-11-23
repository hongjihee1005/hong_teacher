"""「수학 원리 돋보기」 분수 특별편 4화 — 칸 크기가 다르면 어떻게 할까?

정사각형: 왼쪽 큰 칸 1 + 오른쪽 작은 칸 2, 작은 칸 하나 색칠 → '3분의 1'? (아님: 칸 크기가 다름)
→ 큰 칸에 선을 하나 더 그어 똑같이 4칸 → 4분의 1
연습: 직사각형 큰 칸(색칠) 1 + 작은 칸 2 → 큰 칸 = 작은 칸 2개 → 4분의 2
최종: GRADE=f ./make_final.sh 4
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, DashedLine, FadeIn, FadeOut, Indicate, Line, Rectangle,
                   VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac
from fracbasic import three_steps
from items import check_mark, cross_mark


def box(w, h, c, fill=False):
    return Rectangle(width=w, height=h, fill_color=ORANGE if fill else PAPER, fill_opacity=1,
                     stroke_color=INK, stroke_width=5).move_to(c)


class GfEp04(EpisodeScene):
    GRADE, SEM = "F", 1
    LABEL = "분수 특별편 {}화"
    EP_NO = 4
    EP_TITLE = "칸 크기가 다르면 어떻게 할까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.fix()
        self.practice()
        self.closing(f"칸 크기가 다르면 {g('선을 더 그어')} 똑같이 나누어요\n그다음 3단계: 전체 칸 → {b('분모')}, 색칠한 칸 → {o('분자')}",
                     next_preview="분수 특별편 5화 · 분수만큼 색칠하기")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        C = np.array([-3.0, 0.1, 0])
        s = 1.5
        self.big = box(s, 2 * s, C + np.array([-s / 2, 0, 0]))
        self.tr = box(s, s, C + np.array([s / 2, s / 2, 0]), fill=True)
        self.br = box(s, s, C + np.array([s / 2, -s / 2, 0]))
        self.C, self.s = C, s
        self.say("정사각형을 세 칸으로 나누고 한 칸을 칠했어요", "정사각형을 세 칸으로 나누고, 그중 한 칸을 색칠했어요.")
        self.play(FadeIn(VGroup(self.big, self.tr, self.br)), run_time=0.6)
        q = M(f"색칠한 부분은 {o('3분의 1')}일까요?", 50).move_to([3.2, 1.2, 0])
        self.say("색칠한 부분은 3분의 1일까요?", "세 칸 중의 한 칸이니까 3분의 1일까요?")
        self.play(FadeIn(q), run_time=0.5)
        self.wait(1.0)
        self.pause_screen(5)
        self.settle()
        self.play(FadeOut(q), run_time=0.3)

    def fix(self):
        self.section("칸 크기 확인")
        small = self.tr.copy().set_fill(opacity=0.5)
        self.say("먼저 칸의 크기를 견주어 봐요", "먼저 세 칸의 크기가 같은지 견주어 봐요. 작은 칸을 큰 칸에 겹쳐 볼게요.")
        self.play(small.animate.move_to(self.big.get_top() + DOWN * self.s / 2), run_time=1.0)
        no = cross_mark(0.45).move_to([1.6, 1.6, 0])
        t = M("큰 칸은 작은 칸의 2배\n→ 똑같이 나눈 것이 아니에요", 38).move_to([3.4, 0.6, 0])
        self.say("큰 칸이 작은 칸보다 2배 커요", "큰 칸은 작은 칸 2개만 해요. 칸 크기가 달라서 3분의 1이라고 할 수 없어요.")
        self.play(Create(no), FadeIn(t), run_time=0.6)
        self.wait(1.0)
        self.settle()
        self.play(FadeOut(small), FadeOut(no), FadeOut(t), run_time=0.4)
        C, s = self.C, self.s
        ln = DashedLine(C + np.array([-s, 0, 0]), C, color=GREEN, stroke_width=7, dash_length=0.12)
        self.say(f"큰 칸에 {g('선을 하나 더')} 그어요", "그럼 어떻게 할까요? 큰 칸에 선을 하나 더 그어서 작은 칸과 같은 크기로 나누어요.")
        self.play(Create(ln), run_time=0.8)
        cells = VGroup(box(s, s, C + np.array([-s / 2, s / 2, 0])), box(s, s, C + np.array([s / 2, s / 2, 0]), True),
                       box(s, s, C + np.array([-s / 2, -s / 2, 0])), box(s, s, C + np.array([s / 2, -s / 2, 0])))
        self.remove(self.big, self.tr, self.br)
        self.add(cells, ln)
        ok = check_mark(0.5).move_to([1.6, 1.6, 0])
        t2 = M(f"이제 네 칸이 {g('모두 같은 크기')}", 40).move_to([3.4, 0.9, 0])
        self.say(f"이제 {g('똑같이 4칸')}이 되었어요", "이제 네 칸의 크기가 모두 같아요. 똑같이 4칸으로 나누어졌어요.")
        self.play(Create(ok), FadeIn(t2), run_time=0.5)
        self.wait(1.0)
        self.settle()
        self.play(FadeOut(ok), FadeOut(t2), run_time=0.4)
        self.section("3단계로 나타내기")
        three_steps(self, cells, [1], pos=(3.6, 0.1, 0), quick=True)
        self.say(f"답: {b('4분의')} {o('1')}  (3분의 1이 아니에요)", "답은 4분의 1이에요. 3분의 1이 아니에요.")
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def practice(self):
        self.section("연습해요")
        C = np.array([-2.9, 0.4, 0])
        u, h = 1.25, 1.6
        big = box(2 * u, h, C + np.array([-u, 0, 0]), True)
        r1 = box(u, h, C + np.array([u / 2, 0, 0]))
        r2 = box(u, h, C + np.array([1.5 * u, 0, 0]))
        self.say("색칠한 부분을 분수로 나타내 보세요", "연습해 볼까요? 색칠한 부분을 분수로 나타내 보세요. 칸 크기부터 확인해요.")
        self.play(FadeIn(VGroup(big, r1, r2)), run_time=0.6)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        ln = DashedLine(C + np.array([-u, h / 2, 0]), C + np.array([-u, -h / 2, 0]), color=GREEN, stroke_width=7, dash_length=0.12)
        self.say(f"색칠한 큰 칸 = 작은 칸 {g('2개')}", "색칠한 큰 칸은 작은 칸 2개만 해요. 선을 그어 똑같이 나누어요.")
        self.play(Create(ln), run_time=0.8)
        cells = VGroup(box(u, h, C + np.array([-1.5 * u, 0, 0]), True), box(u, h, C + np.array([-0.5 * u, 0, 0]), True),
                       box(u, h, C + np.array([0.5 * u, 0, 0])), box(u, h, C + np.array([1.5 * u, 0, 0])))
        self.remove(big, r1, r2)
        self.add(cells, ln)
        three_steps(self, cells, [0, 1], pos=(3.6, 0.3, 0), quick=True)
        self.say(f"답: {b('4분의')} {o('2')}", "답은 4분의 2예요. 3분의 1이라고 하지 않도록 조심해요.")
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
