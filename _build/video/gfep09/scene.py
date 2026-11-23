"""「수학 원리 돋보기」 분수 특별편 9화 — 가분수: 1과 같거나 큰 분수

4분의 1을 모으기: 4분의 4 = 막대 하나 = 1 → 다섯째 조각은 새 막대에 → 4분의 7
분모는 그대로 4(조각 크기는 그대로) / 자주 하는 실수: 8칸 막대 중 7칸(8분의 7)으로 그림
분자가 분모와 같거나 큰 분수 = 가분수 / 2 = 4분의 8 / 연습: 가분수 고르기
최종: GRADE=f ./make_final.sh 9
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Brace, Create, FadeIn, FadeOut, Indicate, Rectangle, ReplacementTransform,
                   SurroundingRectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, frac_bar, row
from fracbasic import step_card
from items import check_mark, cross_mark

W = 4.4   # 막대 하나(1)의 길이


class GfEp09(EpisodeScene):
    GRADE, SEM = "F", 1
    LABEL = "분수 특별편 {}화"
    EP_NO = 9
    EP_TITLE = "가분수: 1과 같거나 큰 분수"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.collect()
        self.mistake()
        self.names()
        self.practice()
        self.closing(f"{o('분자')}가 {b('분모')}와 같거나 큰 분수 = {g('가분수')}\n가분수는 {g('1과 같거나 1보다 커요')}",
                     next_preview="분수 특별편 10화 · 대분수: 자연수와 진분수를 함께")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        self.b1 = frac_bar(4, 4, width=W, height=0.9).move_to([-2.4, 0.9, 0])
        f = row(frac(4, 4, 56, cn=ORANGE, cd=BLUE), "=", g("1"), size=56).next_to(self.b1, RIGHT, buff=0.6)
        self.say("4분의 1이 4개면 4분의 4, 막대 하나가 꽉 차요", "4분의 1이 4개 모이면 4분의 4. 막대 하나가 꽉 차서 1이에요.")
        self.play(FadeIn(self.b1, lag_ratio=0.3), FadeIn(f), run_time=1.0)
        q = M(f"4분의 1이 {o('하나 더')} 있으면 어디에 놓을까요?", 46).move_to([0, 2.45, 0])
        self.say("4분의 1이 하나 더 있으면?", "그런데 4분의 1 조각이 하나 더 있으면, 어디에 놓아야 할까요?")
        self.play(FadeIn(q), run_time=0.5)
        self.wait(1.0)
        self.pause_screen(5)
        self.settle()
        self.play(FadeOut(q), FadeOut(f), run_time=0.4)

    def collect(self):
        self.section("새 막대가 생겨요")
        b2 = frac_bar(4, 0, width=W, height=0.9).next_to(self.b1, DOWN, buff=0.45, aligned_edge=LEFT)
        self.say(f"막대 하나가 꽉 찼으니 {g('새 막대')}를 놓아요", "첫째 막대는 꽉 찼으니, 똑같은 새 막대를 하나 더 놓아요.")
        self.play(FadeIn(b2), run_time=0.6)
        lab = None
        for i in range(3):
            n = 5 + i
            f = frac(n, 4, 72, cn=ORANGE, cd=BLUE).move_to([4.6, 0.3, 0])
            self.say(f"4분의 1이 {n}개 → {o(f'4분의 {n}')}", f"4분의 1이 {n}개면 4분의 {n}.")
            anims = [b2[i].animate.set_fill(ORANGE, 1)]
            anims.append(FadeIn(f) if lab is None else ReplacementTransform(lab, f))
            self.play(*anims, run_time=0.6)
            lab = f
        self.frac7 = lab
        self.b2 = b2
        br = Brace(self.b1, UP, color=BLUE)
        bt = M(f"막대 하나 = {b('4칸')}", 36).next_to(br, UP, buff=0.1)
        self.say(f"분모는 그대로 {b('4')}! 조각 크기가 같으니까요", "분모는 여전히 4예요. 막대 하나를 4칸으로 나눈 조각의 크기는 그대로이니까요.")
        self.play(Create(br), FadeIn(bt), Indicate(lab.den, color=BLUE, scale_factor=1.4), run_time=0.8)
        self.wait(1.2)
        self.settle()
        self.brace = VGroup(br, bt)

    def mistake(self):
        self.section("자주 하는 실수")
        self.play(FadeOut(self.brace), run_time=0.3)
        wrong = frac(7, 8, 60, cn=SOFT, cd=SOFT).move_to([1.9, 0.3, 0])
        why = M("막대 두 개 = 8칸이니까 8분의 7?", 38, SOFT).move_to([0, -1.75, 0])
        self.say("8칸 중 7칸이니까 8분의 7일까요?", "어떤 친구는 막대 두 개를 합쳐 8칸 중 7칸이니까 8분의 7이라고 했어요.")
        self.play(FadeIn(wrong), FadeIn(why), run_time=0.6)
        self.wait(0.6)
        self.pause_screen(5, "무엇이 틀렸을까요?")
        self.settle()
        no = cross_mark(0.4).next_to(wrong, LEFT, buff=0.25)
        t = M(f"전체(1)는 {g('막대 하나')}예요 → 분모는 {b('4')}", 40).move_to([0, -1.75, 0])
        self.say(f"전체 1은 {g('막대 하나')} → 분모는 {b('4')}", "분수에서 전체 1은 막대 하나예요. 막대 하나가 4칸이니까 분모는 4, 4분의 7이 맞아요.")
        self.play(Create(no), FadeOut(why), FadeIn(t), Indicate(self.frac7, color=GREEN, scale_factor=1.2), run_time=0.8)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def names(self):
        self.section("가분수")
        d = M(f"{o('분자')}가 {b('분모')}와 {g('같거나')} {g('큰')} 분수를", 56).move_to([0, 2.0, 0])
        n = T("가분수", 110, GREEN).move_to([0, 0.8, 0])
        e = M("라고 해요", 56).next_to(n, DOWN, buff=0.3)
        self.say(f"이런 분수를 {g('가분수')}라고 해요", "분자가 분모와 같거나 분모보다 큰 분수를 가분수라고 해요.")
        self.play(FadeIn(d), run_time=0.5)
        self.play(Write(n), FadeIn(e), run_time=0.8)
        ex = row(frac(4, 4, 50, cn=ORANGE, cd=BLUE), "(= 1)", frac(5, 4, 50, cn=ORANGE, cd=BLUE), frac(7, 4, 50, cn=ORANGE, cd=BLUE),
                 frac(8, 4, 50, cn=ORANGE, cd=BLUE), "(= 2)", size=40, buff=0.45).move_to([0, -1.95, 0])
        self.say(f"4분의 4는 1, 4분의 8은 {g('2')}예요", "4분의 4, 4분의 5, 4분의 7, 4분의 8은 모두 가분수예요. 4분의 4는 1, 4분의 8은 막대 두 개, 곧 2예요.")
        self.play(FadeIn(ex, lag_ratio=0.2), run_time=1.0)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def practice(self):
        self.section("가분수 고르기")
        items = [(2, 7), (5, 5), (7, 3), (9, 8), (1, 3), (6, 10)]
        cards = VGroup()
        for n, d in items:
            f = frac(n, d, 60, cn=ORANGE, cd=BLUE)
            box = SurroundingRectangle(f, color=SOFT, buff=0.3, stroke_width=4, corner_radius=0.15)
            cards.add(VGroup(box, f))
        cards.arrange(RIGHT, buff=0.55).move_to([0, 0.6, 0])
        c = M(f"방법: {o('분자')}가 {b('분모')}와 {g('같거나 크면')} 가분수", 40).move_to([0, 2.45, 0])
        self.say("가분수를 모두 골라 보세요", "이 중에서 가분수를 모두 골라 보세요.")
        self.play(FadeIn(cards, lag_ratio=0.15), FadeIn(c), run_time=1.0)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        notes = VGroup()
        for card, (n, d) in zip(cards, items):
            ok = n >= d
            mk = (check_mark(0.45) if ok else cross_mark(0.35)).next_to(card, DOWN, buff=0.3)
            sign = "&lt;" if n < d else ("=" if n == d else "&gt;")
            lab = M(f"{n} {sign} {d}", 32, GREEN if ok else SOFT).next_to(mk, DOWN, buff=0.2)
            notes.add(mk, lab)
            if ok:
                card[0].set_stroke(GREEN, 7)
        self.say(f"가분수: {g('5분의 5, 3분의 7, 8분의 9')}",
                 "분자가 분모와 같거나 큰 5분의 5, 3분의 7, 8분의 9가 가분수예요. 나머지는 진분수예요.")
        self.play(FadeIn(notes, lag_ratio=0.1), run_time=1.0)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
