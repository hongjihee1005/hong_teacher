"""「수학 원리 돋보기」 개념 차근차근 40화 — 자연수의 혼합 계산과 괄호

순서 규칙: ① ( ) 안 ② × ÷ (앞에서부터) ③ + − (앞에서부터) / 예 20 + 25 × 4 = 120, (20 + 25) × 4 = 180
42 − 17 + 8 = 33 vs 42 − (17 + 8) = 17 / 이야기: 괄호는 16세기 이탈리아 수학책(타르탈리아 1556)에 보이고 1600년대에 묶음 기호로 자리 잡음
연습: 36 ÷ 4 + 5 × 2 / 출처
최종: GRADE=c ./make_final.sh 40
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
from fraction import frac, frac_bar, row
from prepkit import grid_items


class GcEp40(ConceptScene):
    EP_NO = 40
    EP_TITLE = "자연수의 혼합 계산과 괄호"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.why()
        self.rule()
        self.story()
        self.practice()
        show_sources(self, [
            "· 괄호를 수식에 쓴 이른 기록: MacTutor 수학사 'Earliest Uses of Grouping Symbols'(F. Cajori 인용)",
        ])
        self.closing(f"계산 순서: {o('( ) 안')} → {b('× ÷')} → {g('+ −')}, 같은 단계는 앞에서부터\n( )가 있으면 순서와 답이 바뀌어요",
                     next_preview="개념 차근차근 41화 · 약수")
        self.wait(0.5)

    def why(self):
        self.section("순서가 왜 중요할까?")
        e = M("20 + 25 × 4", 80).move_to([0, 1.8, 0])
        self.say("20 + 25 × 4는 얼마일까요?", "20 더하기 25 곱하기 4. 앞에서부터 하면 180, 곱셈부터 하면 120. 사람마다 답이 다르면 안 되겠지요?")
        self.play(Write(e), run_time=0.5)
        a1 = M(f"곱셈 먼저: 20 + {b('100')} = {g('120')}  (약속)", 48).move_to([0, 0.5, 0])
        self.say(f"곱셈 먼저: {g('120')}", "그래서 수학에서는 곱셈과 나눗셈을 덧셈과 뺄셈보다 먼저 하기로 약속했어요. 답은 120.")
        self.play(FadeIn(a1), run_time=0.5)
        a2 = M(f"({o('20 + 25')}) × 4 = 45 × 4 = {g('180')}", 48).move_to([0, -0.6, 0])
        self.say(f"괄호가 있으면 {o('괄호 먼저')}", "덧셈을 먼저 하고 싶으면 괄호로 묶어요. 괄호 안을 가장 먼저 계산해서 180.")
        self.play(FadeIn(a2), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def rule(self):
        self.section("계산 순서 약속")
        steps = VGroup(M(f"① {o('( ) 안')}을 가장 먼저", 50), M(f"② {b('× , ÷')} (앞에서부터)", 50), M(f"③ {g('+ , −')} (앞에서부터)", 50)).arrange(DOWN, buff=0.4, aligned_edge=LEFT).move_to([-3.4, 0.9, 0])
        self.say("계산 순서 세 단계", "계산 순서를 정리해요. 괄호 안을 가장 먼저, 다음은 곱셈과 나눗셈, 마지막에 덧셈과 뺄셈. 같은 단계끼리는 앞에서부터 차례로 해요.")
        self.play(FadeIn(steps, lag_ratio=0.3), run_time=1.0)
        e1 = M(f"42 − 17 + 8 = {g('33')}", 44).move_to([3.6, 1.2, 0])
        e2 = M(f"42 − (17 + 8) = {g('17')}", 44).move_to([3.6, 0.3, 0])
        self.say("괄호 하나로 답이 바뀌어요", "42 빼기 17 더하기 8은 앞에서부터 33. 괄호로 17 더하기 8을 묶으면 17. 괄호 하나로 답이 바뀌어요.")
        self.play(FadeIn(e1), FadeIn(e2), run_time=0.6)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def story(self):
        self.section("이야기: 괄호의 처음")
        p = T("( )", 160, ORANGE).move_to([-4.0, 0.6, 0])
        t = M("괄호는 약 450년 전 이탈리아 수학책에 보이기 시작해\n1600년대에 '먼저 계산할 부분을 묶는 표시'로\n자리 잡았어요", 38).move_to([1.6, 0.6, 0])
        self.say("괄호는 약 450년 전부터", "괄호는 약 450년 전 이탈리아의 수학책에 보이기 시작해서, 1600년대에 먼저 계산할 부분을 묶는 표시로 자리 잡았어요.")
        self.play(FadeIn(p), FadeIn(t), run_time=0.7)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        q = M("36 ÷ 4 + 5 × 2", 84).move_to([0, 1.2, 0])
        self.say("순서대로 계산해 보세요", "연습해 볼까요? 36 나누기 4 더하기 5 곱하기 2를 계산해 보세요.")
        self.play(Write(q), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a = M(f"{b('9')} + {b('10')} = {g('19')}  (÷, × 먼저)", 56).move_to([0, -0.4, 0])
        self.say(f"{g('19')}", "나눗셈과 곱셈을 먼저 해서 9와 10, 더하면 19예요.")
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
