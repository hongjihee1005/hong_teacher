"""「수학 원리 돋보기」 분수 특별편 10화 — 대분수: 자연수와 진분수를 함께

꽉 찬 막대 1개 + 4분의 3 → '1과 4분의 3' 쓰기·읽기 / 자연수와 진분수로 이루어진 분수 = 대분수
자주 하는 실수: 분수 부분이 진분수가 아님(1과 4분의 5 → 2와 4분의 1) / 연습: 원 2개 + 3분의 1 → 2와 3분의 1
최종: GRADE=f ./make_final.sh 10
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Brace, Create, FadeIn, FadeOut, Indicate, SurroundingRectangle,
                   VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, frac_bar, pie, row
from fracbasic import mixed_wide as mixed, step_card
from items import check_mark, cross_mark

W = 4.4


class GfEp10(EpisodeScene):
    GRADE, SEM = "F", 1
    LABEL = "분수 특별편 {}화"
    EP_NO = 10
    EP_TITLE = "대분수: 자연수와 진분수를 함께"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.split()
        self.mistake()
        self.practice()
        self.closing(f"{g('자연수')}와 {o('진분수')}로 이루어진 분수 = {g('대분수')}\n1과 4분의 3: 꽉 찬 것 {g('1')}개 + 남은 {o('4분의 3')}",
                     next_preview="분수 특별편 11화 · 가분수와 대분수 바꾸기")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        self.b1 = frac_bar(4, 4, width=W, height=0.9).move_to([-3.5, 1.0, 0])
        self.b2 = frac_bar(4, 3, width=W, height=0.9).next_to(self.b1, DOWN, buff=0.45, aligned_edge=LEFT)
        f = frac(7, 4, 72, cn=ORANGE, cd=BLUE).move_to([3.6, 0.4, 0])
        self.say("앞에서 본 4분의 7이에요", "앞에서 본 4분의 7이에요. 막대 하나가 꽉 차고, 둘째 막대에 3칸이 있어요.")
        self.play(FadeIn(self.b1), FadeIn(self.b2), Write(f), run_time=0.8)
        q = M("이 양을 다르게 나타낼 수 있을까요?", 46).move_to([0, 2.45, 0])
        self.say("다르게 나타낼 수 있을까요?", "이 양을 다른 방법으로도 나타낼 수 있을까요?")
        self.play(FadeIn(q), run_time=0.5)
        self.wait(1.0)
        self.pause_screen(5)
        self.settle()
        self.play(FadeOut(q), FadeOut(f), run_time=0.4)

    def split(self):
        self.section("두 부분으로 보기")
        box1 = SurroundingRectangle(self.b1, color=GREEN, buff=0.1, stroke_width=7)
        l1 = M(f"꽉 찬 막대 {g('1개')} → {g('1')}", 40).next_to(self.b1, RIGHT, buff=0.5)
        c1 = step_card(1, f"꽉 찬 것은 몇 개? → {g('자연수')}").move_to([0, 2.45, 0])
        self.say(f"1단계: 꽉 찬 막대는 {g('1개')}", "1단계. 꽉 찬 막대가 몇 개인지 세어요. 1개, 곧 자연수 1이에요.")
        self.play(FadeIn(c1), Create(box1), FadeIn(l1), run_time=0.7)
        l2 = row("남은 부분 →", frac(3, 4, 50, cn=ORANGE, cd=BLUE), size=40).next_to(self.b2, RIGHT, buff=0.5)
        c2 = step_card(2, f"남은 부분은? → {o('진분수')}").move_to([0, 2.45, 0])
        self.say(f"2단계: 남은 부분은 {o('4분의 3')}", "2단계. 남은 부분을 분수로 나타내요. 4칸 중 3칸, 4분의 3이에요.")
        self.play(FadeOut(c1), FadeIn(c2), FadeIn(l2), run_time=0.6)
        m = mixed(1, 3, 4, 90, cw=GREEN, cn=ORANGE, cd=BLUE).move_to([5.3, 0.35, 0])
        c3 = step_card(3, f"함께 쓰고 '{g('1')}과 {o('4분의 3')}'이라고 읽어요").move_to([0, 2.45, 0])
        self.say(f"3단계: {g('1')}과 {o('4분의 3')}", "3단계. 자연수 1을 크게 앞에 쓰고, 4분의 3을 옆에 붙여 써요. 1과 4분의 3이라고 읽어요.")
        self.play(FadeOut(c2), FadeIn(c3), Write(m), run_time=0.9)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)
        d = M(f"{g('자연수')}와 {o('진분수')}로 이루어진 분수를", 56).move_to([0, 2.0, 0])
        n = T("대분수", 110, GREEN).move_to([0, 0.8, 0])
        e = M("라고 해요", 56).next_to(n, DOWN, buff=0.3)
        self.say(f"이런 분수를 {g('대분수')}라고 해요", "1과 4분의 3처럼 자연수와 진분수로 이루어진 분수를 대분수라고 해요.")
        self.play(FadeIn(d), Write(n), FadeIn(e), run_time=0.9)
        eq = row(frac(7, 4, 50, cn=ORANGE, cd=BLUE), "=", mixed(1, 3, 4, 50, cw=GREEN, cn=ORANGE, cd=BLUE), size=50).move_to([0, -1.95, 0])
        self.say("4분의 7과 1과 4분의 3은 같은 양", "4분의 7과 1과 4분의 3은 같은 양을 다르게 나타낸 것이에요.")
        self.play(FadeIn(eq), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def mistake(self):
        self.section("자주 하는 실수")
        w = mixed(1, 5, 4, 80, cw=SOFT, cn=SOFT, cd=SOFT).move_to([-4.8, 0.9, 0])
        self.say("1과 4분의 5라고 써도 될까요?", "1과 4분의 5라고 쓴 친구가 있어요. 이것도 대분수일까요?")
        self.play(FadeIn(w), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        no = cross_mark(0.4).next_to(w, UP, buff=0.3)
        t1 = M(f"4분의 5는 {o('진분수가 아니에요')}(1보다 커요)", 40).move_to([0, -0.55, 0])
        self.say(f"분수 부분은 꼭 {o('진분수')}여야 해요", "대분수의 분수 부분은 꼭 1보다 작은 진분수여야 해요. 4분의 5는 1보다 크니까 안 돼요.")
        self.play(Create(no), FadeIn(t1), run_time=0.6)
        bars = VGroup(frac_bar(4, 4, width=2.0, height=0.7), frac_bar(4, 4, width=2.0, height=0.7),
                      frac_bar(4, 1, width=2.0, height=0.7)).arrange(RIGHT, buff=0.2).move_to([1.8, 0.9, 0])
        r = mixed(2, 1, 4, 70, cw=GREEN, cn=ORANGE, cd=BLUE).move_to([3.0, -1.75, 0])
        ok = check_mark(0.45).next_to(r, LEFT, buff=0.35)
        self.say(f"4분의 4를 1로 올려 {g('2')}와 {o('4분의 1')}", "4분의 5 안의 4분의 4를 1로 올려 보내면, 꽉 찬 막대가 2개, 남은 것은 4분의 1. 2와 4분의 1이 맞아요.")
        self.play(FadeIn(bars), run_time=0.6)
        self.play(FadeIn(r), Create(ok), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def practice(self):
        self.section("연습해요")
        ps = VGroup(pie(3, 3, 0.95), pie(3, 3, 0.95), pie(3, 1, 0.95)).arrange(RIGHT, buff=0.5).move_to([-2.6, 0.5, 0])
        self.say("색칠한 부분을 대분수로 나타내 보세요", "연습해 볼까요? 색칠한 부분을 대분수로 나타내 보세요.")
        self.play(FadeIn(ps, lag_ratio=0.3), run_time=0.8)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        b1 = SurroundingRectangle(VGroup(ps[0], ps[1]), color=GREEN, buff=0.12, stroke_width=7)
        self.say(f"꽉 찬 원 {g('2개')}, 남은 것 {o('3분의 1')}", "꽉 찬 원이 2개, 남은 것은 3조각 중 1조각, 3분의 1이에요.")
        self.play(Create(b1), run_time=0.5)
        m = mixed(2, 1, 3, 90, cw=GREEN, cn=ORANGE, cd=BLUE).move_to([4.0, 0.5, 0])
        self.say(f"답: {g('2')}와 {o('3분의 1')}", "그래서 2와 3분의 1이에요.")
        self.play(Write(m), run_time=0.7)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
