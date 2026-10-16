"""「수학 원리 돋보기」 5학년 1화 — 덧셈과 뺄셈이 섞인 식은 어떤 순서로? (5-1 1단원 2차시, 화 코드 5-1-1-a)

버스에 42명, 17명이 내리고 8명이 탐: 42 − 17 + 8 = 33 (앞에서부터 차례대로)
뒤를 먼저 하면 42 − 25 = 17로 달라짐 → 순서가 중요
사탕 42개에서 17개와 8개를 함께 나눠 줌: 42 − (17 + 8) = 17 (( ) 안을 먼저)
최종: GRADE=5 ./make_final.sh 1
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, Cross, FadeIn, FadeOut, Indicate, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from mixcalc import Expr

RED = "#C0392B"


class G5Ep01(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 1
    EP_TITLE = "덧셈과 뺄셈이 섞인 식은 어떤 순서로?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.inorder()
        self.wrong()
        self.paren()
        self.closing(f"덧셈과 뺄셈이 섞인 식은 {o('앞에서부터 차례대로')}\n( )가 있으면 {g('( ) 안을 먼저')} 계산해요",
                     next_preview="5학년 2화 · 곱셈과 나눗셈이 섞인 식")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("버스에 42명이 타고 있었어요.\n17명이 내리고 8명이 탔어요. 지금은 몇 명일까요?", 42).move_to([0.6, 1.5, 0])
        e = T("42 − 17 + 8", 64).move_to([0, -0.6, 0])
        self.say("42 − 17 + 8은?", "버스에 42명이 타고 있었어요. 정류장에서 17명이 내리고 8명이 탔어요. 지금 버스에는 몇 명이 있을까요?")
        self.play(Write(q), run_time=1.0)
        self.play(FadeIn(e), run_time=0.5)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def inorder(self):
        self.section("앞에서부터 차례대로")
        e = Expr(["42", "−", "17", "+", "8"], center=[0, 1.6, 0], F=80)
        self.say("일어난 차례대로 계산해요", "먼저 17명이 내렸고, 그다음에 8명이 탔어요. 일어난 차례대로 계산해요.")
        self.play(FadeIn(e.g), run_time=0.5)
        s1, s2 = e.steps()
        self.say(f"① 42 − 17 = {o('25')}", "먼저 42에서 17을 빼면 25예요.")
        self.play(*e.mark(s1), run_time=0.8)
        self.say(f"② 25 + 8 = {b('33')}", "그다음 25에 8을 더하면 33이에요.")
        self.play(*e.mark(s2), run_time=0.8)
        a = M(f"42 − 17 + 8 = {g('33')}", 56).move_to([0, -1.9, 0])
        self.say(f"지금 버스에는 {g('33명')}", "그래서 지금 버스에는 33명이 있어요. 덧셈과 뺄셈이 섞인 식은 앞에서부터 차례대로 계산해요.")
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def wrong(self):
        self.section("순서를 바꾸면?")
        l1 = M("42 − 17 + 8", 60).move_to([-3.3, 1.6, 0])
        r1 = M(f"42 − {RED_T('25')}", 60).move_to([-3.3, 0.5, 0])
        r2 = M(f"= {RED_T('17')}", 60).move_to([-3.3, -0.6, 0])
        self.say("뒤의 덧셈을 먼저 하면?", "만약 뒤의 17 더하기 8을 먼저 계산하면 어떻게 될까요?")
        self.play(FadeIn(l1), run_time=0.5)
        self.play(FadeIn(r1), run_time=0.5)
        self.play(FadeIn(r2), run_time=0.5)
        x = Cross(VGroup(r1, r2), stroke_color=RED, stroke_width=6)
        n = M(f"내린 사람 수에\n{o('탄 사람 수')}까지 더해 뺀 셈", 40).move_to([3.0, 0.8, 0])
        self.say(f"17이 되어 {o('답이 달라요')}", "42 빼기 25, 17이 되어 답이 달라져요. 내린 사람과 탄 사람을 모두 뺀 셈이라 상황과 맞지 않아요.")
        self.play(Create(x), FadeIn(n), run_time=0.8)
        n2 = M(f"계산하는 {g('순서')}가 중요해요", 46).move_to([0, -2.0, 0])
        self.play(FadeIn(n2), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def paren(self):
        self.section("( )가 있는 식")
        q = M("사탕 42개 중에서 동생에게 17개, 친구에게 8개를\n한꺼번에 주었어요. 남은 사탕은?", 38).move_to([0.6, 1.95, 0])
        self.say("나누어 준 사탕을 먼저 모아요", "사탕 42개 중에서 동생에게 17개, 친구에게 8개를 한꺼번에 주었어요. 이번에는 준 사탕을 먼저 모아야 해요.")
        self.play(FadeIn(q), run_time=0.6)
        e = Expr(["42", "−", "(", "17", "+", "8", ")"], center=[0, 0.55, 0], F=76)
        self.play(FadeIn(e.g), run_time=0.5)
        s1, s2 = e.steps()
        self.say(f"① ( ) 안 17 + 8 = {o('25')}", "먼저 계산할 부분을 괄호로 묶어요. 괄호 안을 먼저 계산하면 17 더하기 8은 25예요.")
        self.play(*e.mark(s1), run_time=0.8)
        self.say(f"② 42 − 25 = {b('17')}", "42에서 25를 빼면 17이에요. 남은 사탕은 17개예요.")
        self.play(*e.mark(s2), run_time=0.8)
        a = M(f"42 − 17 + 8 = 33,  42 − (17 + 8) = {g('17')}", 42).move_to([0, -2.22, 0])
        self.say(f"( )가 있으면 {g('( ) 안을 먼저')}", "같은 수와 기호라도 괄호가 있으면 괄호 안을 먼저 계산해서 답이 달라져요.")
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()


def RED_T(s):
    return f'<span foreground="{RED}">{s}</span>'
