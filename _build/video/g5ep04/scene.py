"""「수학 원리 돋보기」 5학년 4화 — 나눗셈이 섞인 식 (5-1 1단원 5차시, 화 코드 5-1-1-d)

지우개 4개에 2400원 → 1개를 사고 1000원을 냄: 1000 − 2400 ÷ 4 = 400 (나눗셈 먼저)
남학생 40명, 여학생 32명을 8모둠으로: (40 + 32) ÷ 8 = 9, 40 + 32 ÷ 8 = 44와 비교
최종: GRADE=5 ./make_final.sh 4
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


class G5Ep04(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 4
    EP_TITLE = "나눗셈이 섞인 식"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.first()
        self.paren()
        self.closing(f"덧셈, 뺄셈, 나눗셈이 섞인 식은 {o('나눗셈을 먼저')} 계산해요\n( )가 있으면 {g('( ) 안을 가장 먼저')}",
                     next_preview="5학년 5화 · 네 가지가 모두 섞인 식")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("4개에 2400원인 지우개를 1개 사고 1000원을 냈어요.\n거스름돈은 얼마일까요?", 40)
        q.scale_to_fit_width(min(q.width, 11.0)).move_to([0.5, 1.5, 0])
        e = T("1000 − 2400 ÷ 4", 64).move_to([0, -0.6, 0])
        self.say("1000 − 2400 ÷ 4는?", "4개에 2400원인 지우개를 1개 사고 1000원을 냈어요. 거스름돈은 얼마일까요?")
        self.play(Write(q), run_time=1.0)
        self.play(FadeIn(e), run_time=0.5)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def first(self):
        self.section("나눗셈을 먼저")
        e = Expr(["1000", "−", "2400", "÷", "4"], center=[0, 1.6, 0], F=76)
        self.play(FadeIn(e.g), run_time=0.5)
        s1, s2 = e.steps()
        self.say(f"① 지우개 1개 값 2400 ÷ 4 = {o('600')}", "먼저 지우개 1개의 값을 알아야 해요. 2400 나누기 4는 600원이에요.")
        self.play(*e.mark(s1), run_time=0.8)
        self.say(f"② 1000 − 600 = {b('400')}", "1000원에서 600원을 빼면 거스름돈은 400원이에요.")
        self.play(*e.mark(s2), run_time=0.8)
        w = M(f"앞에서부터 하면 (1000 − 2400)은 뺄 수도 없어요", 38, SOFT).move_to([0, -1.2, 0])
        a = M(f"{o('나눗셈을 먼저')} 계산해요", 46).move_to([0, -2.1, 0])
        self.say(f"{o('나눗셈을 먼저')} 계산해요", "앞에서부터 계산하면 1000에서 2400을 빼야 해서 계산할 수도 없어요. 덧셈, 뺄셈, 나눗셈이 섞인 식은 나눗셈을 먼저 계산해요.")
        self.play(FadeIn(w), run_time=0.5)
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def paren(self):
        self.section("( )가 있는 식")
        q = M("남학생 40명과 여학생 32명이 똑같이 8모둠으로 나누면\n한 모둠은 몇 명일까요?", 36)
        q.scale_to_fit_width(min(q.width, 10.6)).move_to([0.6, 2.0, 0])
        self.say("모두 몇 명인지 먼저 구해요", "남학생 40명과 여학생 32명이 똑같이 8모둠으로 나누면, 한 모둠은 몇 명일까요? 먼저 모두 몇 명인지 구해야 해요.")
        self.play(FadeIn(q), run_time=0.6)
        e = Expr(["(", "40", "+", "32", ")", "÷", "8"], center=[-2.9, 0.5, 0], F=72)
        self.play(FadeIn(e.g), run_time=0.5)
        s1, s2 = e.steps()
        self.say(f"① 40 + 32 = {o('72')}", "괄호 안을 먼저 계산해요. 40 더하기 32는 72명이에요.")
        self.play(*e.mark(s1), run_time=0.7)
        self.say(f"② 72 ÷ 8 = {b('9')}", "72명을 8모둠으로 나누면 한 모둠은 9명이에요.")
        self.play(*e.mark(s2), run_time=0.7)
        cmp_ = M(f"40 + 32 ÷ 8 = 44 는\n{o('여학생만')} 나눈 셈이에요", 36).move_to([3.5, 0.3, 0])
        self.say(f"( )가 없으면 {o('44')}, 상황과 달라요", "괄호가 없으면 32 나누기 8을 먼저 해서 44가 돼요. 여학생만 나눈 셈이라 상황과 맞지 않아요. 그래서 괄호가 꼭 필요해요.")
        self.play(FadeIn(cmp_), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
