"""「수학 원리 돋보기」 4학년 3화 — 십만, 백만, 천만 (4-1 1단원 큰 수 4차시, 화 코드 4-1-1-c)

10000이 10개 → 100000(10만, 십만), 100개 → 1000000(100만, 백만), 1000개 → 10000000(1000만, 천만)
10000이 8629개 → 86290000 = 8629만(팔천육백이십구만): 만의 자리 왼쪽 네 칸은 '천 백 십 일'에 '만'을 붙인 이름
최종: GRADE=4 ./make_final.sh 3
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Brace, Create, FadeIn, FadeOut, Indicate, LaggedStart,
                   ReplacementTransform, SurroundingRectangle, Transform, VGroup, Write)

from series_style import GREEN, INK, SOFT, EpisodeScene, M, T, g, o
from division import clear_stage
from bignum import TENK, PlaceChart, bill, pcol, place_markup, read_num, span

N8 = ["천만", "백만", "십만", "만", "천", "백", "십", "일"]


class G4Ep03(EpisodeScene):
    GRADE, SEM = 4, 1
    EP_NO = 3
    EP_TITLE = "십만, 백만, 천만"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.ten_tenk()
        self.slide()
        self.group()
        self.closing(f"10000이 10개, 100개, 1000개인 수는 {g('십만, 백만, 천만')}\n만 단위 네 자리는 {span('천 백 십 일', TENK)}에 {g('만')}을 붙여 읽어요",
                     next_preview="4학년 4화 · 억과 조, 네 자리씩 끊어 읽기")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M(f"나눔 콘서트에 {span('10000원', TENK)}씩 기부한 사람이\n{o('10명')}이면 모두 얼마일까요?", 54)
        q.scale_to_fit_width(min(q.width, 11.0)).move_to([0, 1.7, 0])
        self.say("10000원씩 10명이 기부하면?", "나눔 콘서트에 10000원씩 기부한 사람이 10명이면, 모두 얼마일까요?")
        self.play(Write(q), run_time=1.3)
        bills = VGroup(*[bill(10000, 1.35, 0.62) for _ in range(10)]).arrange_in_grid(rows=2, buff=(0.22, 0.25)).move_to([0, -0.9, 0])
        self.play(LaggedStart(*[FadeIn(x, shift=UP * 0.2) for x in bills], lag_ratio=0.08, run_time=1.2))
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def ten_tenk(self):
        self.section("10000이 10개")
        bills = VGroup(*[bill(10000) for _ in range(10)]).arrange_in_grid(rows=2, buff=(0.28, 0.32)).move_to([0, 0.6, 0])
        self.say("10000씩 세어 볼까요?", "10000씩 세어 볼까요? 만, 이만, 삼만, … 구만, 그리고 십만.")
        cnt = None
        for i, x in enumerate(bills):
            v = (i + 1) * 10000
            new = M(span(f"{v // 10000}만", TENK if v < 100000 else GREEN), 60).move_to([0, 2.45, 0])
            self.play(FadeIn(x, shift=DOWN * 0.2), (FadeIn(new) if cnt is None else Transform(cnt, new)),
                      run_time=0.4 if i < 9 else 0.7)
            if cnt is None:
                cnt = new
        eq = M(f"10000이 {o('10개')}  →  {g('100000')}  =  {g('10만')}  (십만)", 54).move_to([0, -1.6, 0])
        self.say(f"10000이 10개 → {g('100000')}, 10만, 십만", "10000이 10개인 수는 100000. 10만이라고 쓰고 십만이라고 읽어요.")
        self.play(FadeIn(eq, shift=UP * 0.2), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def slide(self):
        self.section("10배씩 커지면")
        ch = PlaceChart(N8, cell_w=1.15, head_size=30, digit_size=60).move_to([0, 1.5, 0])
        self.say("자릿값 표로 살펴봐요", "만의 자리 왼쪽에 십만, 백만, 천만의 자리가 있어요.")
        self.play(FadeIn(ch), run_time=0.7)
        self.play(Indicate(VGroup(*ch.heads[:3]), color=TENK, scale_factor=1.08), run_time=0.8)
        rows = [("10만", "십만", "100000"), ("100만", "백만", "1000000"), ("1000만", "천만", "10000000")]
        cnt = ["10", "100", "1000"]
        nar = ["10000이 10개이면 100000, 10만, 십만이에요.",
               "10000이 100개이면 1000000, 100만, 백만이에요. 1이 왼쪽으로 한 칸 옮겨 가요.",
               "10000이 1000개이면 10000000, 1000만, 천만이에요."]
        digs = None
        lab = None
        for k, (mix, rd, num) in enumerate(rows):
            new = VGroup(*[ch.digit(8 - len(num) + i, d) for i, d in enumerate(num)])
            nl = M(f"10000이 {o(cnt[k] + '개')}  →  {place_markup(num)}  =  {g(mix)}  ({g(rd)})", 50).move_to([0, -0.9, 0])
            nl.scale_to_fit_width(min(nl.width, 12.6))
            self.say(f"10000이 {o(cnt[k] + '개')} → {g(mix)}, {g(rd)}", nar[k])
            if digs is None:
                self.play(LaggedStart(*[FadeIn(d, shift=DOWN * 0.2) for d in new], lag_ratio=0.1, run_time=0.9),
                          FadeIn(nl), run_time=0.9)
            else:
                self.play(ReplacementTransform(digs[0], new[0]), *[ReplacementTransform(a, b) for a, b in zip(digs[1:], new[2:])],
                          FadeIn(new[1], shift=DOWN * 0.2), Transform(lab, nl), run_time=1.0)
            digs = new
            if lab is None:
                lab = nl
            self.wait(1.0)
        tip = M(f"한 자리 왼쪽으로 갈 때마다 {o('10배')}", 50).move_to([0, -2.0, 0])
        self.play(FadeIn(tip, shift=UP * 0.2), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def group(self):
        self.section("8629만")
        ch = PlaceChart(N8, cell_w=1.15, head_size=30, digit_size=60).move_to([0, 1.3, 0])
        self.say("10000이 8629개인 수는?", "그럼 10000이 8629개인 수는 어떻게 쓰고 읽을까요?")
        self.play(FadeIn(ch), run_time=0.6)
        ch.fill(self, "86290000", run_time=1.6)
        left = VGroup(*[VGroup(ch.heads[i], ch.boxes[i]) for i in range(4)])
        right = VGroup(*[VGroup(ch.heads[i], ch.boxes[i]) for i in range(4, 8)])
        bl = Brace(left, DOWN, color=TENK)
        br = Brace(right, DOWN, color=SOFT)
        tl = M(f"{span('8629', TENK)}  +  {span('만', TENK)}", 48).next_to(bl, DOWN, buff=0.15)
        tr = M("0000", 48, SOFT).next_to(br, DOWN, buff=0.15)
        self.say(f"네 자리씩 끊으면 {span('8629', TENK)} | 0000", "뒤에서부터 네 자리씩 끊어 보면, 앞의 네 자리가 8629예요.")
        self.play(Create(bl), Create(br), FadeIn(tl), FadeIn(tr), run_time=0.9)
        self.say(f"{span('천만 백만 십만 만', TENK)} = 천 백 십 일 + {span('만', TENK)}",
                 "천만, 백만, 십만, 만의 자리는 천, 백, 십, 일에 만을 붙인 이름이에요.")
        self.play(Indicate(VGroup(*[ch.heads[i] for i in range(4)]), color=TENK, scale_factor=1.1), run_time=0.9)
        self.wait(0.6)
        w = M(f"쓰기  {g('86290000')}  또는  {g('8629만')}      읽기  {g(read_num(86290000))}", 46).move_to([0, -2.15, 0])
        w.scale_to_fit_width(min(w.width, 12.6))
        self.say(f"{g('8629만')}, {g('팔천육백이십구만')}", "그래서 86290000은 8629만이라고 쓰고, 팔천육백이십구만이라고 읽어요.")
        self.play(FadeIn(w, shift=UP * 0.2), run_time=0.6)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
