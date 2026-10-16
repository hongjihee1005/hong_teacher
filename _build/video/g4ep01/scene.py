"""「수학 원리 돋보기」 4학년 1화 — 1000이 10개면 얼마일까? (4-1 1단원 큰 수 2차시, 화 코드 4-1-1-a)

1000원 지폐 10장 → 10000(1만), 만·일만 / 자릿값 표 / 9000·9900·9990·9999보다 1000·100·10·1 큰 수
9999 + 1에서 받아올림이 일 → 십 → 백 → 천 → 만으로 이어짐
최종: GRADE=4 ./make_final.sh 1
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, Line, FadeIn, FadeOut, Indicate, LaggedStart, ReplacementTransform,
                   SurroundingRectangle, Transform, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, g, o
from division import clear_stage
from bignum import TENK, PlaceChart, bill, pcol, place_markup, span


class G4Ep01(EpisodeScene):
    GRADE, SEM = 4, 1
    EP_NO = 1
    EP_TITLE = "1000이 10개면 얼마일까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.count_bills()
        self.write_read()
        self.closer()
        self.carry()
        self.closing(f"1000이 10개인 수를 {g('10000')} 또는 {g('1만')}이라 쓰고\n{g('만')} 또는 {g('일만')}이라고 읽어요",
                     next_preview="4학년 2화 · 다섯 자리 수와 자릿값")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M(f"예준이가 나눔 장터에서 {span('1000원', BLUE)}짜리 지폐를\n{o('10장')} 모았어요. 모두 얼마일까요?", 54)
        q.scale_to_fit_width(min(q.width, 11.4)).move_to([0, 1.6, 0])
        self.say("1000원짜리 지폐 10장", "예준이가 나눔 장터에서 1000원짜리 지폐를 10장 모았어요. 모두 얼마일까요?")
        self.play(Write(q), run_time=1.4)
        bills = VGroup(*[bill(1000, 1.25, 0.6) for _ in range(10)]).arrange_in_grid(rows=2, buff=(0.25, 0.25)).move_to([0, -0.9, 0])
        self.play(LaggedStart(*[FadeIn(x, shift=UP * 0.2) for x in bills], lag_ratio=0.08, run_time=1.2))
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def count_bills(self):
        self.section("1000씩 세어 보기")
        bills = VGroup(*[bill(1000) for _ in range(10)]).arrange_in_grid(rows=2, buff=(0.3, 0.35)).move_to([0, 0.35, 0])
        self.say("1000씩 세어 볼까요?", "지폐를 한 장씩 놓으며 1000씩 세어 볼까요?")
        cnt = None
        for i, x in enumerate(bills):
            v = (i + 1) * 1000
            new = M(f"{span(str(v), BLUE if v < 10000 else GREEN)}원", 64).move_to([0, 2.3, 0])
            anims = [FadeIn(x, shift=DOWN * 0.2)]
            anims.append(FadeIn(new) if cnt is None else Transform(cnt, new))
            self.play(*anims, run_time=0.45 if i < 9 else 0.7)
            if cnt is None:
                cnt = new
        self.wait(0.4)
        self.say(f"9000 다음은 {g('10000')}", "천, 이천, 삼천, … 구천, 그리고 만. 9000 다음은 10000이에요.")
        self.play(Indicate(cnt, color=GREEN, scale_factor=1.15), run_time=0.8)
        self.wait(0.6)
        big = bill(10000, 3.2, 1.5).move_to([0, 0.35, 0])
        self.say(f"1000원 {o('10장')}은 10000원 {g('1장')}과 같아요",
                 "1000원짜리 10장은 10000원짜리 지폐 1장과 같아요.")
        self.play(bills.animate.arrange(RIGHT, buff=-1.45).move_to([0, 0.35, 0]), run_time=1.0)
        self.play(ReplacementTransform(bills, big), run_time=0.9)
        eq = M(f"1000이 {o('10개')}인 수 = {g('10000')}", 64).move_to([0, -1.6, 0])
        self.play(FadeIn(eq, shift=UP * 0.2), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def write_read(self):
        self.section("쓰고 읽기")
        ch = PlaceChart(["만", "천", "백", "십", "일"], cell_w=1.1).move_to([-3.7, 0.6, 0])
        self.say("자릿값 표에 나타내요", "자릿값 표에 나타내 볼까요? 천의 자리 왼쪽에 새 자리, 만의 자리가 생겨요.")
        self.play(FadeIn(ch), run_time=0.6)
        self.play(Indicate(ch.heads[0], color=TENK, scale_factor=1.2), run_time=0.8)
        ch.fill(self, "10000")
        w1 = M(f"쓰기  {g('10000')}  또는  {g('1만')}", 54)
        w2 = M(f"읽기  {g('만')}  또는  {g('일만')}", 54)
        wg = VGroup(w1, w2).arrange(DOWN, aligned_edge=LEFT, buff=0.6)
        wg.scale_to_fit_width(min(wg.width, 6.0))
        wg.move_to([0, 0.6, 0]).align_to([-0.2, 0, 0], LEFT)
        self.say(f"쓰기: {g('10000')} 또는 {g('1만')}", "10000 또는 1만이라고 써요.")
        self.play(FadeIn(w1, shift=LEFT * 0.2), run_time=0.6)
        self.say(f"읽기: {g('만')} 또는 {g('일만')}", "읽을 때는 만 또는 일만이라고 읽어요.")
        self.play(FadeIn(w2, shift=LEFT * 0.2), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def closer(self):
        self.section("10000에 가까운 수")
        rows = [("9000", "1000"), ("9900", "100"), ("9990", "10"), ("9999", "1")]
        lines, marks = VGroup(), []
        for a, d in rows:
            marks.append(f"{place_markup(a)}보다 {o(d)} 큰 수 → {g('10000')}")
            lines.add(M(f"{place_markup(a)}  보다  {o(d)}  큰 수  →  {g('10000')}", 54))
        lines.arrange(DOWN, aligned_edge=LEFT, buff=0.42).move_to([0, 0.55, 0])
        nar = ["9000보다 1000 큰 수는 10000이에요.", "9900보다 100 큰 수도 10000.",
               "9990보다 10 큰 수도 10000.", "9999보다 1 큰 수도 10000이에요."]
        self.say("10000은 어떤 수보다 얼마 큰 수일까요?", "10000은 어떤 수보다 얼마만큼 더 큰 수일까요?")
        for ln, mk, n in zip(lines, marks, nar):
            self.say(mk, n)
            self.play(FadeIn(ln, shift=RIGHT * 0.2), run_time=0.6)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def carry(self):
        self.section("9999 + 1")
        xs = [-4.6, -3.4, -2.2, -1.0, 0.2]        # 만 천 백 십 일
        heads = VGroup(*[T(n, 38, pcol(4 - i)) for i, n in enumerate(["만", "천", "백", "십", "일"])])
        for h, x in zip(heads, xs):
            h.move_to([x, 2.5, 0])
        top = [T("9", 96, pcol(3 - i)).move_to([xs[i + 1], 1.2, 0]) for i in range(4)]
        plus = T("+", 96).move_to([xs[0] - 0.4, 0.0, 0])
        one = T("1", 96, ORANGE).move_to([xs[4], 0.0, 0])
        bar = Line([xs[0] - 0.8, -0.65, 0], [xs[4] + 0.6, -0.65, 0], stroke_width=6, color=INK)
        self.say(f"9999에 1을 더하면?", "9999에 1을 더하면 어떻게 될까요? 세로셈으로 살펴봐요.")
        self.play(FadeIn(heads), *[FadeIn(t) for t in top], FadeIn(plus), FadeIn(one), Create(bar), run_time=0.9)
        res = []
        carry_from = one
        names = ["일", "십", "백", "천"]
        for step in range(4):
            i = 4 - step                         # 지금 자리(xs 번호)
            z = T("0", 96, pcol(step)).move_to([xs[i], -1.45, 0])
            c = T("1", 44, pcol(step + 1)).move_to([xs[i - 1], 2.0 - 0.0, 0]).shift(DOWN * 0.15 + RIGHT * 0.3)
            if step == 0:
                self.say(f"{o('9 + 1 = 10')} → 0을 쓰고 1을 받아올려요",
                         "일의 자리 9 더하기 1은 10. 0을 쓰고, 십의 자리로 1을 받아올려요.")
            elif step == 1:
                self.say(f"십의 자리도 9 + 1 = 10 → 또 받아올림",
                         "십의 자리도 9 더하기 받아올린 1은 10. 또 0을 쓰고 받아올려요.")
            elif step == 2:
                self.say("백의 자리도 마찬가지예요", "백의 자리도 마찬가지예요.")
            else:
                self.say(f"천의 자리까지 10 → {span('만의 자리', TENK)}로 1",
                         "천의 자리까지 10이 되어, 새로운 자리 만의 자리로 1을 받아올려요.")
            self.play(Indicate(top[i - 1], color=pcol(step), scale_factor=1.15), run_time=0.5)
            self.play(FadeIn(z, shift=DOWN * 0.2), FadeIn(c, shift=LEFT * 0.4), run_time=0.7)
            res.append(z)
            res.append(c)
        lead = T("1", 96, TENK).move_to([xs[0], -1.45, 0])
        self.play(FadeIn(lead, shift=DOWN * 0.3), run_time=0.7)
        ans = M(f"9999 + 1 = {g('10000')}", 56)
        ans.scale_to_fit_width(min(ans.width, 5.0)).move_to([4.15, -1.45, 0])
        self.say(f"0이 네 개, 다섯 자리 수 {g('10000')}", "그래서 9999 더하기 1은 10000. 0이 네 개인 다섯 자리 수가 돼요.")
        self.play(FadeIn(ans, shift=LEFT * 0.2), run_time=0.6)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()

