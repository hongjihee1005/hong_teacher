"""「수학 원리 돋보기」 28화 — 일 모형이 10개가 되면 어떻게 할까? (1학기 1단원 덧셈과 뺄셈 2·3차시, 화 코드 1-1-a)

123 + 235: 같은 모형끼리 모으기 → 세로셈(같은 자리끼리) → 319 + 274: 일 모형 13개 중 10개 → 십 모형 1개(받아올림)
→ 세로셈 위의 작은 1 → 어림(약 300 + 약 300 = 약 600)
최종: ./make_final.sh 28
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, ReplacementTransform,
                   SurroundingRectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from base10 import hundred_flat, ten_rod, unit_cube
from multiply import HUND, cm
from addsub import add_vertical

S_ = 0.11


def blocks(n, s=S_):
    h, t, u = n // 100, n // 10 % 10, n % 10
    H = VGroup(*[hundred_flat(s) for _ in range(h)]).arrange(RIGHT, buff=0.08)
    Tn = VGroup(*[ten_rod(s) for _ in range(t)]).arrange(RIGHT, buff=0.05)
    U = VGroup(*[unit_cube(s) for _ in range(u)]).arrange_in_grid(cols=2, buff=0.03) if u else VGroup()
    return H, Tn, U


def num3(n, size):
    s = str(n)
    return M("".join(cm(ch, len(s) - 1 - i) for i, ch in enumerate(s)), size)


class Ep28(EpisodeScene):
    EP_NO = 28
    EP_TITLE = "일 모형이 10개가 되면 어떻게 할까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.gather()
        self.section("세로셈으로 123 + 235")
        add_vertical(self, 123, 235)
        self.settle(); self.clear_sub(); clear_stage(self, 0.6)
        self.carry_blocks()
        self.section("세로셈으로 319 + 274")
        add_vertical(self, 319, 274)
        self.settle(); self.clear_sub(); clear_stage(self, 0.6)
        self.estimate()
        self.closing(f"같은 자리 수끼리 더하고, 합이 10이 되면\n{g('바로 윗자리로 1을 받아올려요')}",
                     next_preview="29화 · 받아올림이 여러 번 있으면?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M(f"쓰레기 줍기 행사에 작년 {cm('1', 2)}{cm('2', 1)}{cm('3', 0)}명, 올해 {cm('2', 2)}{cm('3', 1)}{cm('5', 0)}명이\n참여했어요. 모두 몇 명일까요?", 50)
        q.scale_to_fit_width(min(q.width, 11.6)).move_to([0, 1.5, 0])
        self.say("작년 123명, 올해 235명", "바닷가 쓰레기 줍기 행사에 작년에 123명, 올해에 235명이 참여했어요. 모두 몇 명일까요?")
        self.play(Write(q), run_time=1.3)
        e = M("123 + 235 = ?", 110).move_to([0, -0.5, 0])
        self.say("세 자리 수의 덧셈은 어떻게 할까요?", "세 자리 수의 덧셈은 어떻게 계산할까요?")
        self.play(FadeIn(e), run_time=0.6)
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def gather(self):
        self.section("같은 모형끼리 모으기")
        rows = []
        for k, n in enumerate((123, 235)):
            H, Tn, U = blocks(n)
            grp = VGroup(H, Tn, U).arrange(RIGHT, buff=0.35, aligned_edge=DOWN).move_to([-2.4, 1.4 - k * 1.9, 0])
            lab = num3(n, 52).next_to(grp, LEFT, buff=0.5)
            rows.append((H, Tn, U, lab))
        self.say("123과 235를 수모형으로 놓아요", "123과 235를 수모형으로 놓아 볼게요.")
        for H, Tn, U, lab in rows:
            self.play(FadeIn(VGroup(H, Tn, U)), FadeIn(lab), run_time=0.7)
        lines = [
            (f"{cm('백 모형', 2)}: 1 + 2 = {cm('3', 2)}", "백 모형끼리 모으면 1개와 2개, 3개.", 0),
            (f"{cm('십 모형', 1)}: 2 + 3 = {cm('5', 1)}", "십 모형끼리 모으면 2개와 3개, 5개.", 1),
            (f"{cm('일 모형', 0)}: 3 + 5 = {cm('8', 0)}", "일 모형끼리 모으면 3개와 5개, 8개.", 2),
        ]
        for k, (mk, nar, idx) in enumerate(lines):
            m = M(mk, 44).move_to([3.6, 1.5 - k * 0.9, 0])
            self.say(mk, nar)
            self.play(*[Indicate(r[idx], color=[HUND, BLUE, ORANGE][idx], scale_factor=1.12) for r in rows], FadeIn(m), run_time=0.9)
        tot = M(f"모두 {g('358')}명", 56).move_to([3.6, -1.4, 0])
        self.say(f"같은 모형끼리 모으면 {g('358')}", "같은 모형끼리 모으면 백 3개, 십 5개, 일 8개, 358명이에요.")
        self.play(FadeIn(tot), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def carry_blocks(self):
        self.section("일 모형이 10개가 되면?")
        q = M(f"플라스틱병 {cm('3', 2)}{cm('1', 1)}{cm('9', 0)}개 + {cm('2', 2)}{cm('7', 1)}{cm('4', 0)}개", 50).move_to([0, 2.4, 0])
        self.say("오전 319개, 오후 274개", "이번에는 플라스틱병을 오전에 319개, 오후에 274개 주웠어요.")
        self.play(FadeIn(q), run_time=0.6)
        ones = VGroup(*[unit_cube(0.22) for _ in range(13)]).arrange(RIGHT, buff=0.08).move_to([-1.2, 0.9, 0])
        ones[:9].set_color(ORANGE)
        lab = M(f"일 모형: 9 + 4 = {o('13개')}", 46).move_to([-1.2, 0.0, 0])
        self.say(f"일 모형을 모으면 9 + 4 = {o('13개')}", "일 모형을 모으면 9개와 4개, 13개예요.")
        self.play(LaggedStart(*[FadeIn(c, scale=0.5) for c in ones], lag_ratio=0.06, run_time=1.2), FadeIn(lab))
        self.wait(0.6)
        ring = SurroundingRectangle(VGroup(*ones[:10]), color=BLUE, buff=0.1, stroke_width=6)
        self.say(f"일 모형 {o('10개')}를 묶으면…", "일 모형 10개를 묶어 볼까요?")
        self.play(Create(ring), run_time=0.6)
        rod = ten_rod(0.22).move_to([4.8, 0.3, 0])
        stack = VGroup(*ones[:10])
        self.play(stack.animate.arrange(DOWN, buff=0).move_to(rod), FadeOut(ring), run_time=1.0)
        self.play(ReplacementTransform(stack, rod), run_time=0.7)
        m = M(f"일 모형 {o('10개')} = 십 모형 {b('1개')}", 50).move_to([0, -1.0, 0])
        self.say(f"일 모형 10개는 십 모형 {b('1개')}로 바뀌어요", "일 모형 10개는 십 모형 1개로 바꿀 수 있어요. 남은 일 모형은 3개예요.")
        self.play(FadeIn(m), run_time=0.6)
        m2 = M(f"그래서 십의 자리로 {b('1')}을 {g('받아올림')}해요", 50).move_to([0, -1.9, 0])
        self.say(f"십의 자리로 {b('1')}을 {g('받아올림')}", "그래서 일의 자리에는 3을 쓰고, 십의 자리로 1을 받아올림해요.")
        self.play(FadeIn(m2), Indicate(rod, color=BLUE), run_time=0.8)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def estimate(self):
        self.section("어림해 보기")
        a = M(f"319 → {b('약 300')},   274 → {b('약 300')}", 54).move_to([0, 1.3, 0])
        c = M(f"약 300 + 약 300 = {g('약 600')}", 60).move_to([0, 0.0, 0])
        d = M(f"실제 값 593과 가까워요", 48).move_to([0, -1.2, 0])
        self.say("더 가까운 몇백으로 어림해요", "계산하기 전에 더 가까운 몇백으로 어림해 볼까요? 319는 약 300, 274도 약 300이에요.")
        self.play(FadeIn(a), run_time=0.6)
        self.say(f"약 300 + 약 300 = {g('약 600')}", "약 300 더하기 약 300은 약 600. 실제 값 593과 아주 가까워요.")
        self.play(FadeIn(c), run_time=0.6)
        self.play(FadeIn(d), run_time=0.5)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
