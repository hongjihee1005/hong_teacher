"""「수학 원리 돋보기」 26화 — 두 자리 수끼리의 곱셈은 네 조각 (2학기 1단원 곱셈 7·8차시, 화 코드 2-1-e)

12 × 16: 직사각형(가로 16 = 10 + 6, 세로 12 = 10 + 2)을 네 조각으로 → 100 + 60 + 20 + 12 = 192
→ 세로셈 두 줄(12 × 6 = 72, 12 × 10 = 120)과 연결 → 53 × 24 = 1272
최종: ./make_final.sh 26
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Brace, Create, FadeIn, FadeOut, Indicate, LaggedStart, Line, Rectangle,
                   SurroundingRectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o

from division import clear_stage

LB = "#BBD3F5"   # 연한 파랑
LO = "#F9D3A8"   # 연한 주황
LG = "#C9E7D3"
LP = "#E0D2F1"


def area_model(a, c, x0, y0, unit, size=34):
    """a(세로) × c(가로)를 (십, 일)로 나눈 네 조각. 반환 dict"""
    at, au = divmod(a, 10)
    ct, cu = divmod(c, 10)
    W1, W2 = ct * 10 * unit, cu * unit
    H1, H2 = at * 10 * unit, au * unit
    def rect(w, h, col, x, y):
        return Rectangle(width=w, height=h, fill_color=col, fill_opacity=1, stroke_color=INK, stroke_width=3).move_to([x + w / 2, y - h / 2, 0])
    pieces = [
        rect(W1, H1, LB, x0, y0),
        rect(W2, H1, LO, x0 + W1, y0),
        rect(W1, H2, LP, x0, y0 - H1),
        rect(W2, H2, LG, x0 + W1, y0 - H1),
    ]
    vals = [at * 10 * ct * 10, at * 10 * cu, au * ct * 10, au * cu]
    exprs = [f"{at * 10}×{ct * 10}", f"{at * 10}×{cu}", f"{au}×{ct * 10}", f"{au}×{cu}"]
    labs = VGroup()
    for p, v, e in zip(pieces, vals, exprs):
        t = VGroup(T(e, size - 6), T(str(v), size)).arrange(DOWN, buff=0.05)
        if t.width > p.width * 0.92 or t.height > p.height * 0.92:
            t.scale_to_fit_width(min(p.width * 0.9, t.width)).scale(min(1, p.height * 0.9 / max(t.height, 1e-3)))
        labs.add(t.move_to(p))
    top = VGroup(T(f"{ct * 10}", size, BLUE).move_to([x0 + W1 / 2, y0 + 0.3, 0]), T(f"{cu}", size, ORANGE).move_to([x0 + W1 + W2 / 2, y0 + 0.3, 0]))
    side = VGroup(T(f"{at * 10}", size, BLUE).move_to([x0 - 0.4, y0 - H1 / 2, 0]), T(f"{au}", size, ORANGE).move_to([x0 - 0.4, y0 - H1 - H2 / 2, 0]))
    return dict(pieces=VGroup(*pieces), labs=labs, top=top, side=side, vals=vals)


class Ep26(EpisodeScene):
    EP_NO = 26
    EP_TITLE = "두 자리 수끼리의 곱셈은 네 조각"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.area()
        self.vertical(12, 16)
        self.second()
        self.closing(f"(몇십몇) × (몇십몇)은 {g('네 조각')}으로 나누어 더해요\n세로셈 두 줄 = {o('일의 자리와 곱')} + {b('십의 자리와 곱')}",
                     next_preview="27화 · 어림셈은 왜 할까?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M(f"시범 경기에 한 조에 {b('12명')}씩 {o('16개 조')}가 참가해요.\n모두 몇 명일까요?", 52).move_to([0, 1.5, 0])
        self.say("한 조에 12명씩 16개 조", "태권도 시범 경기에 한 조에 12명씩 16개 조가 참가해요. 모두 몇 명일까요?")
        self.play(Write(q), run_time=1.2)
        e = M("12 × 16 = ?", 110).move_to([0, -0.5, 0])
        self.say("두 자리 수끼리의 곱셈, 몇 조각으로 나눌까요?", "12 곱하기 16. 두 자리 수끼리의 곱셈은 몇 조각으로 나누어 계산하면 좋을까요?")
        self.play(FadeIn(e), run_time=0.6)
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def area(self):
        self.section("직사각형을 네 조각으로")
        unit = 0.32
        m = area_model(12, 16, -5.2, 2.0, unit)
        whole = Rectangle(width=16 * unit, height=12 * unit, fill_color=PAPER, fill_opacity=1, stroke_color=INK, stroke_width=4)
        whole.move_to([-5.2 + 8 * unit, 2.0 - 6 * unit, 0])
        bw = Brace(whole, UP, color=SOFT); bh = Brace(whole, LEFT, color=SOFT)
        tw = T("16", 36).next_to(bw, UP, buff=0.05); th = T("12", 36).next_to(bh, LEFT, buff=0.05)
        self.say("12 × 16을 가로 16, 세로 12인 직사각형으로", "12 곱하기 16을 가로 16칸, 세로 12칸인 직사각형의 넓이로 생각해 볼게요.")
        self.play(FadeIn(whole), FadeIn(bw), FadeIn(bh), FadeIn(tw), FadeIn(th), run_time=0.8)
        self.wait(0.6)
        self.say(f"가로 16 = {b('10')} + {o('6')}, 세로 12 = {b('10')} + {o('2')}", "가로 16을 10과 6으로, 세로 12를 10과 2로 나누어요.")
        self.play(FadeOut(VGroup(bw, bh, tw, th)), FadeIn(m["pieces"]), FadeIn(m["top"]), FadeIn(m["side"]), run_time=0.9)
        self.remove(whole)
        self.say(f"그러면 {g('네 조각')}이 생겨요", "그러면 직사각형이 네 조각으로 나뉘어요.")
        self.wait(0.6)
        rows = VGroup()
        names = ["10 × 10 = 100", "10 × 6 = 60", "2 × 10 = 20", "2 × 6 = 12"]
        nars = ["큰 조각은 10 곱하기 10, 100.", "오른쪽 위는 10 곱하기 6, 60.", "왼쪽 아래는 2 곱하기 10, 20.", "작은 조각은 2 곱하기 6, 12."]
        for k in range(4):
            r = T(names[k], 40).move_to([3.7, 1.8 - k * 0.7, 0])
            rows.add(r)
            self.say(names[k], nars[k])
            self.play(Indicate(m["pieces"][k], color=INK, scale_factor=1.04), FadeIn(m["labs"][k]), FadeIn(r), run_time=0.8)
        tot = M(f"100 + 60 + 20 + 12 = {g('192')}", 44).move_to([3.7, -1.1, 0])
        self.say(f"네 조각을 더하면 {g('192')}", "네 조각을 모두 더하면 192. 시범 경기에 192명이 참가해요.")
        self.play(FadeIn(tot), run_time=0.6)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)

    def vertical(self, a, c):
        self.section("세로셈 두 줄의 뜻")
        F = 70
        xs = [-2.2 - k * 0.55 for k in range(4)]
        def num(v, y, col):
            s = str(v)
            return VGroup(*[T(ch, F, col).move_to([xs[len(s) - 1 - i], y, 0]) for i, ch in enumerate(s)])
        top = num(a, 2.35, INK)
        mul = VGroup(T("×", F).move_to([xs[3], 1.45, 0]), num(c, 1.45, INK))
        bar = Line([xs[3] - 0.35, 0.95, 0], [xs[0] + 0.35, 0.95, 0], color=INK, stroke_width=6)
        self.say("세로셈으로도 계산해요", f"이번에는 세로셈으로 {a} 곱하기 {c}를 계산해 볼게요.")
        self.play(FadeIn(top), FadeIn(mul), Create(bar), run_time=0.8)
        cu, ct = c % 10, c // 10 * 10
        r1 = num(a * cu, 0.35, ORANGE)
        s1 = M(f"{o('첫째 줄')}: {a} × {o(str(cu))} = {o(str(a * cu))}", 40).move_to([2.6, 0.35, 0])
        self.say(f"첫째 줄: {a} × {o(str(cu))} = {o(str(a * cu))}", f"첫째 줄은 일의 자리 {cu}와 곱한 값, {a} 곱하기 {cu}는 {a * cu}.")
        self.play(FadeIn(r1), FadeIn(s1), run_time=0.6)
        r2 = num(a * ct, -0.55, BLUE)
        s2 = M(f"{b('둘째 줄')}: {a} × {b(str(ct))} = {b(str(a * ct))}", 40).move_to([2.6, -0.55, 0])
        self.say(f"둘째 줄: {a} × {b(str(ct))} = {b(str(a * ct))}", f"둘째 줄은 십의 자리 {ct}과 곱한 값, {a} 곱하기 {ct}은 {a * ct}.")
        self.play(FadeIn(r2), FadeIn(s2), run_time=0.6)
        bar2 = Line([xs[3] - 0.35, -1.05, 0], [xs[0] + 0.35, -1.05, 0], color=INK, stroke_width=6)
        r3 = num(a * c, -1.65, GREEN)
        self.say(f"두 줄을 더하면 {g(str(a * c))}", f"두 줄을 더하면 {a * c}. 넓이 그림의 위아래 조각을 묶은 것과 같아요.")
        self.play(Create(bar2), FadeIn(r3), run_time=0.7)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)

    def second(self):
        self.section("53 × 24도 네 조각으로")
        q = M("53 × 24 = ?", 84).move_to([0, 2.2, 0])
        self.say("53 × 24도 네 조각으로", "기념품이 한 상자에 53개씩 24상자 있어요. 53 곱하기 24도 네 조각으로 나누어 볼까요?")
        self.play(FadeIn(q), run_time=0.6)
        rows = [f"{b('50')} × {b('20')} = 1000", f"{b('50')} × {o('4')} = 200", f"{o('3')} × {b('20')} = 60", f"{o('3')} × {o('4')} = 12"]
        ms = VGroup(*[M(r_, 44) for r_ in rows]).arrange_in_grid(rows=2, cols=2, buff=(1.2, 0.4)).move_to([0, 0.6, 0])
        self.say("50과 3, 20과 4로 나누어 곱해요", "53을 50과 3으로, 24를 20과 4로 나누어 곱하면 1000, 200, 60, 12.")
        self.play(LaggedStart(*[FadeIn(m_) for m_ in ms], lag_ratio=0.3, run_time=1.4))
        tot = M(f"1000 + 200 + 60 + 12 = {g('1272')}", 52).move_to([0, -1.0, 0])
        self.say(f"모두 더하면 {g('1272')}", "모두 더하면 1272예요. 올림이 여러 번 있어도 나누어 생각하면 차근차근 풀 수 있어요.")
        self.play(FadeIn(tot), run_time=0.6)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
