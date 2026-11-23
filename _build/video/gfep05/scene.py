"""「수학 원리 돋보기」 분수 특별편 5화 — 분수만큼 색칠하기

4분의 3만큼 색칠: ① 분모 4 → 전체를 똑같이 4칸으로 나누기 ② 분자 3 → 3칸 칠하기 ③ 다시 읽어 확인
자주 하는 실수: 분자(3)만큼 나누기 → 연습 5분의 2(막대), 8분의 5(원)
최종: GRADE=f ./make_final.sh 5
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Circle, Create, FadeIn, FadeOut, Indicate, LaggedStart, Line,
                   Rectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, frac_bar, pie
from fracbasic import step_card
from items import check_mark, cross_mark


class GfEp05(EpisodeScene):
    GRADE, SEM = "F", 1
    LABEL = "분수 특별편 {}화"
    EP_NO = 5
    EP_TITLE = "분수만큼 색칠하기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.mistake()
        self.practice()
        self.closing(f"① {b('분모')}만큼 똑같이 나누고  ② {o('분자')}만큼 색칠해요\n③ 다시 읽어 확인!",
                     next_preview="분수 특별편 6화 · 여러 개 중의 부분도 분수로")
        self.wait(0.5)

    def color_frac(self, n, d, shape="bar", pos=(-2.6, 0.2, 0), quick=False, card_y=2.45):
        """빈 도형 → 1단계 나누기 → 2단계 색칠 → 3단계 확인. 반환: 화면의 것들"""
        f = frac(n, d, 90, cn=ORANGE, cd=BLUE).move_to([4.4, 0.2, 0])
        if shape == "bar":
            cells = frac_bar(d, 0, width=5.6, height=1.1).move_to(pos)
            outline = Rectangle(width=5.6, height=1.1, stroke_color=INK, stroke_width=5).move_to(pos)
        else:
            cells = pie(d, 0, 1.5).move_to(pos)
            outline = Circle(radius=1.5, stroke_color=INK, stroke_width=5).move_to(pos)
        self.play(FadeIn(outline), Write(f), run_time=0.6)
        c1 = step_card(1, f"분모 {b(str(d))} → 전체를 {g('똑같이')} {d}칸으로 나누어요").move_to([0, card_y, 0])
        self.say(f"1단계: 분모 {b(str(d))}만큼 똑같이 나누기", f"1단계. 분모가 {d}이니까 전체를 똑같이 {d}칸으로 나누어요.")
        self.play(FadeIn(c1), Indicate(f.den, color=BLUE, scale_factor=1.4), run_time=0.7)
        self.play(FadeIn(cells), FadeOut(outline), run_time=0.9)
        c2 = step_card(2, f"분자 {o(str(n))} → {n}칸을 색칠해요").move_to([0, card_y, 0])
        self.say(f"2단계: 분자 {o(str(n))}만큼 색칠하기", f"2단계. 분자가 {n}이니까 {n}칸을 색칠해요.")
        self.play(FadeOut(c1), FadeIn(c2), Indicate(f.num, color=ORANGE, scale_factor=1.4), run_time=0.7)
        marks = VGroup()
        for i in range(n):
            m = T(str(i + 1), 34, INK).move_to(cells[i])
            marks.add(m)
            self.play(cells[i].animate.set_fill(ORANGE, 1), FadeIn(m, scale=1.4), run_time=0.25 if quick else 0.4)
        c3 = step_card(3, f"다시 읽어 확인: {d}칸 중 {n}칸 → {b(str(d) + '분의')} {o(str(n))}").move_to([0, card_y, 0])
        self.say(f"3단계: {d}칸 중 {n}칸 = {b(str(d) + '분의')} {o(str(n))}", f"3단계. 다시 읽어 확인해요. {d}칸 중 {n}칸, {d}분의 {n}이 맞아요.")
        self.play(FadeOut(c2), FadeIn(c3), FadeOut(marks), run_time=0.5)
        ok = check_mark(0.5).next_to(f, UP, buff=0.3)
        self.play(Create(ok), run_time=0.4)
        return VGroup(f, cells, c3, ok)

    def problem(self):
        self.section("문제")
        self.say("4분의 3만큼 색칠해 볼까요?", "이번에는 거꾸로 해 볼까요? 막대에 4분의 3만큼 색칠해 보세요.")
        self.wait(0.4)
        self.pause_screen(5, "어떻게 색칠할까요?")
        self.settle()
        self.section("3단계로 색칠하기")
        self.color_frac(3, 4)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def mistake(self):
        self.section("자주 하는 실수")
        wrong = frac_bar(3, 3, width=5.6, height=1.1).move_to([-2.6, 0.8, 0])
        f = frac(3, 4, 80, cn=ORANGE, cd=BLUE).move_to([4.4, 0.8, 0])
        self.say("어떤 친구는 이렇게 칠했어요", "4분의 3을 이렇게 칠한 친구가 있어요. 막대를 3칸으로 나누어 3칸을 모두 칠했어요.")
        self.play(FadeIn(wrong), FadeIn(f), run_time=0.6)
        no = cross_mark(0.45).next_to(wrong, LEFT, buff=0.3)
        self.say(f"나누는 수는 {b('분모')}! 분자로 나누면 안 돼요", "나누는 수는 분자가 아니라 분모예요. 3칸으로 나누면 안 돼요.")
        self.play(Create(no), run_time=0.4)
        right = frac_bar(4, 3, width=5.6, height=1.1).move_to([-2.6, -1.0, 0])
        ok = check_mark(0.5).next_to(right, LEFT, buff=0.3)
        lab = M(f"{b('4칸')}으로 나누고 {o('3칸')} 칠하기", 38).next_to(right, RIGHT, buff=0.4)
        self.say(f"{b('4칸')}으로 나누고 {o('3칸')}을 칠해요", "분모 4만큼 4칸으로 나누고, 분자 3만큼 3칸을 칠해야 4분의 3이에요.")
        self.play(FadeIn(right), Create(ok), FadeIn(lab), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def practice(self):
        self.section("연습해요")
        self.say("연습 1: 5분의 2만큼 색칠해 보세요", "연습 1. 막대에 5분의 2만큼 색칠해 보세요.")
        self.pause_screen(5)
        self.settle()
        self.color_frac(2, 5, quick=True)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.5)
        self.say("연습 2: 8분의 5만큼 색칠해 보세요", "연습 2. 이번에는 원에 8분의 5만큼 색칠해 보세요.")
        self.pause_screen(5)
        self.settle()
        self.color_frac(5, 8, shape="pie", quick=True)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
