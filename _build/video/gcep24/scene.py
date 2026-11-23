"""「수학 원리 돋보기」 개념 차근차근 24화 — 7·9단, 1단과 0의 곱

7단: 7 × 6 = 7 × 5 + 7 (5단을 이용) / 9단: 10단에서 하나씩 빼기(9 × 4 = 40 − 4), 십의 자리 + 일의 자리 = 9
1 × □ = □ / 0 × □ = 0, □ × 0 = 0 (빈 접시 5개) / 연습: 9 × 7, 0 × 8, 7 × 8
최종: GRADE=c ./make_final.sh 24
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, Line, SurroundingRectangle, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, M, T, b, g, o
from division import clear_stage
from conceptkit import ConceptScene, dot, dots, ten_frame, RED
from items import check_mark, cross_mark
from storykit import book, scroll, show_sources
from conceptkit import table_rows
from prepkit import dish


class GcEp24(ConceptScene):
    EP_NO = 24
    EP_TITLE = "7·9단, 1단과 0의 곱"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.seven()
        self.nine()
        self.one_zero()
        self.practice()
        self.closing(f"7단은 {b('5단 + 2단')}, 9단은 {o('10단에서 하나씩 빼기')}\n1 × □ = □,  0 × □ = {g('0')}",
                     next_preview="개념 차근차근 25화 · 곱셈표의 비밀과 '구구' 이야기")
        self.wait(0.5)

    def seven(self):
        self.section("7단")
        e1 = M(f"7 × 6 = ?", 70).move_to([0, 1.6, 0])
        e2 = M(f"7 × 5 = 35 → 35 + {o('7')} = {g('42')}", 56).move_to([0, 0.4, 0])
        self.say("아는 단을 이용해요", "7 곱하기 6이 어려우면, 7 곱하기 5는 35에 7을 하나 더 더해 42.")
        self.play(FadeIn(e1), run_time=0.4)
        self.play(FadeIn(e2), run_time=0.5)
        e3 = M(f"또는 7 × 6 = 6 × 7 = {g('42')} (바꾸어 곱해도 같아요)", 42).move_to([0, -0.8, 0])
        self.say("바꾸어 곱해도 같아요", "곱하는 두 수를 바꾸어도 곱은 같아요. 6단에서 6 곱하기 7을 떠올려도 42.")
        self.play(FadeIn(e3), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.5)

    def nine(self):
        self.section("9단의 규칙")
        rows = table_rows(9, 9, 36, ORANGE).move_to([-2.8, 0.3, 0])
        self.say("9단을 볼까요?", "9단을 볼까요? 9, 18, 27, 36. 곱의 십의 자리는 하나씩 커지고, 일의 자리는 하나씩 작아져요.")
        self.play(FadeIn(rows, lag_ratio=0.05), run_time=0.9)
        t1 = M(f"9 × 4 = 10 × 4 − 4\n= 40 − 4 = {g('36')}", 46).move_to([2.8, 1.0, 0])
        t2 = M(f"십의 자리 + 일의 자리 = {o('9')}\n(3 + 6 = 9)", 40).move_to([2.8, -0.6, 0])
        self.say("10단에서 하나씩 빼요", "9 곱하기 4는 10 곱하기 4에서 4를 뺀 40 빼기 4, 36. 그리고 곱의 두 숫자를 더하면 언제나 9예요.")
        self.play(FadeIn(t1), run_time=0.5)
        self.play(FadeIn(t2), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def one_zero(self):
        self.section("1의 곱과 0의 곱")
        ds = VGroup(*[dish("", w=1.6, h=0.6) for _ in range(5)]).arrange(RIGHT, buff=0.3).move_to([0, 1.2, 0])
        self.say("빈 접시 5개, 사탕은 모두 몇 개?", "접시 5개에 사탕이 하나도 없어요. 사탕은 모두 몇 개일까요?")
        self.play(FadeIn(ds, lag_ratio=0.1), run_time=0.7)
        e1 = M(f"0 × 5 = {g('0')}    5 × 0 = {g('0')}", 60).move_to([0, -0.1, 0])
        self.say(f"0을 몇 번 더해도 {g('0')}", "0을 몇 번 더해도 0이에요. 0 곱하기 5는 0, 5 곱하기 0도 0.")
        self.play(FadeIn(e1), run_time=0.5)
        e2 = M(f"1 × 5 = 5    5 × 1 = 5  (1을 곱하면 그대로)", 48).move_to([0, -1.2, 0])
        self.say("1을 곱하면 그대로", "1을 곱하면 그 수 그대로예요. 1 곱하기 5는 5.")
        self.play(FadeIn(e2), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        qs = VGroup(M("① 9 × 7", 64), M("② 0 × 8", 64), M("③ 7 × 8", 64)).arrange(RIGHT, buff=1.4).move_to([0, 1.2, 0])
        self.say("세 문제를 풀어요", "연습해 볼까요? 세 문제를 풀어 보세요.")
        self.play(FadeIn(qs), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a = M(f"① 70 − 7 = {g('63')}   ② {g('0')}   ③ 35 + 21 = {g('56')}", 50).move_to([0, -0.4, 0])
        self.say(f"{g('63')}, {g('0')}, {g('56')}", "9 곱하기 7은 70 빼기 7로 63, 0 곱하기 8은 0, 7 곱하기 8은 7 곱하기 5와 7 곱하기 3을 더해 56이에요.")
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
