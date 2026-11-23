"""「수학 원리 돋보기」 분수 특별편 8화 — 진분수: 1보다 작은 분수

4분의 1, 4분의 2, 4분의 3 → 막대 하나(1)를 다 못 채움 → 분자 < 분모 = 진분수
수직선: 진분수는 0과 1 사이 / 가려내는 2단계(분자와 분모 견주기) / 연습: 진분수 고르기
최종: GRADE=f ./make_final.sh 8
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, Dot, FadeIn, FadeOut, Indicate, Line, Rectangle,
                   SurroundingRectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, frac_bar, row
from fracbasic import step_card
from items import check_mark, cross_mark


class GfEp08(EpisodeScene):
    GRADE, SEM = "F", 1
    LABEL = "분수 특별편 {}화"
    EP_NO = 8
    EP_TITLE = "진분수: 1보다 작은 분수"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.compare()
        self.line()
        self.practice()
        self.closing(f"{o('분자')}가 {b('분모')}보다 작은 분수 = {g('진분수')}\n진분수는 {g('1보다 작아요')}",
                     next_preview="분수 특별편 9화 · 가분수: 1과 같거나 큰 분수")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        self.bars = VGroup()
        self.labs = VGroup()
        for i, k in enumerate([1, 2, 3]):
            bar = frac_bar(4, k, width=5.2, height=0.75).move_to([-1.6, 1.4 - i * 1.25, 0])
            f = frac(k, 4, 46, cn=ORANGE, cd=BLUE).next_to(bar, RIGHT, buff=0.6)
            self.bars.add(bar)
            self.labs.add(f)
        self.say("4분의 1, 4분의 2, 4분의 3이에요", "막대에 4분의 1, 4분의 2, 4분의 3만큼 색칠했어요.")
        self.play(FadeIn(self.bars, lag_ratio=0.3), FadeIn(self.labs, lag_ratio=0.3), run_time=1.0)
        q = M("세 분수의 같은 점은 무엇일까요?", 46).move_to([0, 2.55, 0])
        self.say("세 분수의 같은 점은?", "세 분수의 같은 점은 무엇일까요? 막대와 분수를 잘 살펴보세요.")
        self.play(FadeIn(q), run_time=0.5)
        self.wait(1.0)
        self.pause_screen(5)
        self.settle()
        self.play(FadeOut(q), run_time=0.3)

    def compare(self):
        self.section("같은 점 찾기")
        self.say("① 막대 하나를 다 채우지 못했어요", "첫째, 세 막대 모두 끝까지 다 채우지 못했어요. 막대 하나, 곧 1보다 작아요.")
        self.play(*[Indicate(bar[-1], color=SOFT, scale_factor=1.1) for bar in self.bars], run_time=0.8)
        t1 = M(f"모두 {g('1보다 작아요')}", 42).move_to([0, -2.2, 0])
        self.play(FadeIn(t1), run_time=0.4)
        self.wait(0.8)
        self.say(f"② {o('분자')}가 {b('분모')}보다 작아요", "둘째, 분자 1, 2, 3이 모두 분모 4보다 작아요.")
        self.play(*[Indicate(f.num, color=ORANGE, scale_factor=1.4) for f in self.labs], run_time=0.8)
        self.play(*[Indicate(f.den, color=BLUE, scale_factor=1.4) for f in self.labs], run_time=0.8)
        self.settle()
        clear_stage(self, 0.5)
        d = M(f"{o('분자')}가 {b('분모')}보다 {g('작은')} 분수를", 56).move_to([0, 1.2, 0])
        n = T("진분수", 110, GREEN).move_to([0, -0.2, 0])
        e = M("라고 해요", 56).next_to(n, DOWN, buff=0.3)
        self.say(f"이런 분수를 {g('진분수')}라고 해요", "분자가 분모보다 작은 분수를 진분수라고 해요.")
        self.play(FadeIn(d), run_time=0.5)
        self.play(Write(n), FadeIn(e), run_time=0.8)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def line(self):
        self.section("수직선에서 보면")
        L, R, y = -4.5, 4.5, 0.4
        ln = Line([L - 0.4, y, 0], [R + 1.6, y, 0], color=INK, stroke_width=5)
        ticks = VGroup(*[Line([L + (R - L) * i / 4, y - 0.2, 0], [L + (R - L) * i / 4, y + 0.2, 0], color=INK, stroke_width=5) for i in range(5)])
        z = T("0", 44).next_to(ticks[0], DOWN, buff=0.25)
        one = T("1", 44, GREEN).next_to(ticks[4], DOWN, buff=0.25)
        self.say("0과 1 사이를 똑같이 4칸으로 나누었어요", "수직선에서 0과 1 사이를 똑같이 4칸으로 나누었어요.")
        self.play(Create(ln), Create(ticks), FadeIn(z), FadeIn(one), run_time=0.8)
        fs = VGroup()
        for i in (1, 2, 3):
            x = L + (R - L) * i / 4
            dot = Dot([x, y, 0], radius=0.12, color=ORANGE)
            f = frac(i, 4, 40, cn=ORANGE, cd=BLUE).next_to(dot, UP, buff=0.35)
            fs.add(dot, f)
        self.say(f"진분수는 모두 {g('0과 1 사이')}에 있어요", "4분의 1, 4분의 2, 4분의 3은 모두 0과 1 사이에 있어요. 진분수는 1보다 작아요.")
        self.play(FadeIn(fs, lag_ratio=0.3), run_time=1.0)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def practice(self):
        self.section("진분수 고르기")
        items = [(2, 7), (5, 5), (6, 9), (9, 8), (1, 3), (4, 4)]
        cards = VGroup()
        for n, d in items:
            f = frac(n, d, 60, cn=ORANGE, cd=BLUE)
            box = SurroundingRectangle(f, color=SOFT, buff=0.3, stroke_width=4, corner_radius=0.15)
            cards.add(VGroup(box, f))
        cards.arrange(RIGHT, buff=0.55).move_to([0, 0.6, 0])
        c = step_card(1, f"{o('분자')}와 {b('분모')}를 견주어요 → 분자가 더 작으면 {g('진분수')}", size=36).move_to([0, 2.45, 0])
        self.say("진분수를 모두 골라 보세요", "이 중에서 진분수를 모두 골라 보세요. 분자와 분모를 견주어 보면 돼요.")
        self.play(FadeIn(cards, lag_ratio=0.15), FadeIn(c), run_time=1.0)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        notes = VGroup()
        for card, (n, d) in zip(cards, items):
            ok = n < d
            mk = (check_mark(0.45) if ok else cross_mark(0.35)).next_to(card, DOWN, buff=0.3)
            sign = "&lt;" if n < d else ("=" if n == d else "&gt;")
            lab = M(f"{n} {sign} {d}", 32, GREEN if ok else SOFT).next_to(mk, DOWN, buff=0.2)
            notes.add(mk, lab)
            if ok:
                card[0].set_stroke(GREEN, 7)
        self.say(f"진분수: {g('7분의 2, 9분의 6, 3분의 1')}",
                 "분자가 분모보다 작은 7분의 2, 9분의 6, 3분의 1이 진분수예요.")
        self.play(FadeIn(notes, lag_ratio=0.1), run_time=1.0)
        t = M(f"5분의 5·4분의 4·8분의 9는 진분수가 아니에요 → 다음 화에서!", 38).move_to([0, -2.2, 0])
        self.say("분자가 분모와 같거나 크면 진분수가 아니에요", "5분의 5, 4분의 4처럼 분자와 분모가 같거나, 8분의 9처럼 분자가 더 크면 진분수가 아니에요. 다음 화에서 알아봐요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
