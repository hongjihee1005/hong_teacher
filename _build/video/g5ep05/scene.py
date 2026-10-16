"""「수학 원리 돋보기」 5학년 5화 — 네 가지가 모두 섞인 식 (5-1 1단원 6차시, 화 코드 5-1-1-e)

50 − 36 ÷ 4 × 3 + 6 = 29 (곱셈·나눗셈 앞에서부터 → 덧셈·뺄셈 앞에서부터)
50 − 36 ÷ (4 × 3) + 6 = 53 (( ) 안을 가장 먼저)
순서: ① ( ) 안 ② ×, ÷ 앞에서부터 ③ +, − 앞에서부터
최종: GRADE=5 ./make_final.sh 5
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, RoundedRectangle, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from mixcalc import Expr


class G5Ep05(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 5
    EP_TITLE = "네 가지가 모두 섞인 식"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.rule()
        self.mixed()
        self.paren()
        self.closing(f"{g('( ) 안')} → {o('곱셈·나눗셈')} → {b('덧셈·뺄셈')}\n같은 단계끼리는 앞에서부터 차례대로",
                     next_preview="5학년 6화 · 약수란 무엇일까?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("덧셈, 뺄셈, 곱셈, 나눗셈이 모두 섞인 식은\n어떤 순서로 계산할까요?", 44).move_to([0.6, 1.6, 0])
        e = T("50 − 36 ÷ 4 × 3 + 6", 62).move_to([0, -0.5, 0])
        self.say("네 가지가 모두 섞이면?", "덧셈, 뺄셈, 곱셈, 나눗셈이 모두 섞인 식은 어떤 순서로 계산할까요?")
        self.play(Write(q), FadeIn(e), run_time=1.2)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def rule(self):
        self.section("계산 순서")
        items = [(g("① ( ) 안"), "가장 먼저"), (o("② 곱셈과 나눗셈"), "앞에서부터 차례대로"), (b("③ 덧셈과 뺄셈"), "앞에서부터 차례대로")]
        rows = VGroup()
        for i, (a, c) in enumerate(items):
            box = RoundedRectangle(width=10.8, height=1.0, corner_radius=0.2, stroke_color=SOFT, stroke_width=3, fill_color="#FFFFFF", fill_opacity=0.7)
            txt = VGroup(M(a, 44), T(c, 34, SOFT)).arrange(RIGHT, buff=0.6)
            rows.add(VGroup(box, txt.move_to(box)))
        rows.arrange(DOWN, buff=0.3).move_to([0, 0.4, 0])
        self.say("세 단계로 정리해요", "계산 순서는 세 단계로 정리할 수 있어요.")
        caps = [f"① {g('( ) 안')}을 가장 먼저", f"② {o('곱셈과 나눗셈')}을 앞에서부터", f"③ {b('덧셈과 뺄셈')}을 앞에서부터"]
        for r, cap, nar in zip(rows, caps, ["첫째, 괄호가 있으면 괄호 안을 가장 먼저 계산해요.", "둘째, 곱셈과 나눗셈을 앞에서부터 차례대로 계산해요.", "셋째, 덧셈과 뺄셈을 앞에서부터 차례대로 계산해요."]):
            self.say(cap, nar)
            self.play(FadeIn(r, shift=RIGHT * 0.3), run_time=0.6)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def mixed(self):
        self.section("차례대로 계산하기")
        e = Expr(["50", "−", "36", "÷", "4", "×", "3", "+", "6"], center=[0, 1.9, 0], F=72)
        self.play(FadeIn(e.g), run_time=0.5)
        st = e.steps()
        nar = [(f"① 36 ÷ 4 = {o('9')}", "곱셈과 나눗셈을 앞에서부터 먼저 해요. 36 나누기 4는 9."),
               (f"② 9 × 3 = {o('27')}", "9 곱하기 3은 27."),
               (f"③ 50 − 27 = {b('23')}", "이제 덧셈과 뺄셈을 앞에서부터 해요. 50 빼기 27은 23."),
               (f"④ 23 + 6 = {g('29')}", "23 더하기 6은 29예요.")]
        for s, (m, n) in zip(st, nar):
            self.say(m, n)
            self.play(*e.mark(s), run_time=0.7)
        a = M(f"50 − 36 ÷ 4 × 3 + 6 = {g('29')}", 40).move_to([0, -2.32, 0])
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def paren(self):
        self.section("( )가 있으면")
        e = Expr(["50", "−", "36", "÷", "(", "4", "×", "3", ")", "+", "6"], center=[0, 1.9, 0], F=70)
        self.play(FadeIn(e.g), run_time=0.5)
        st = e.steps()
        nar = [(f"① ( ) 안 4 × 3 = {g('12')}", "괄호가 있으면 괄호 안을 가장 먼저 계산해요. 4 곱하기 3은 12."),
               (f"② 36 ÷ 12 = {o('3')}", "그다음 나눗셈, 36 나누기 12는 3."),
               (f"③ 50 − 3 = {b('47')}", "50 빼기 3은 47."),
               (f"④ 47 + 6 = {g('53')}", "47 더하기 6은 53이에요.")]
        for s, (m, n) in zip(st, nar):
            self.say(m, n)
            self.play(*e.mark(s), run_time=0.7)
        a = M(f"괄호 하나로 29가 {g('53')}이 되었어요", 38).move_to([0, -2.32, 0])
        self.say(f"괄호 하나로 답이 {g('53')}", "같은 수와 기호인데 괄호 하나로 답이 29에서 53으로 달라졌어요. 계산 순서를 꼭 지켜요.")
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
