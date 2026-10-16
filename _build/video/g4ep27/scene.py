"""「수학 원리 돋보기」 4학년 27화 — 계산식의 배열에서 규칙 찾기 (4-1 6단원 6·7차시, 화 코드 4-1-6-c)

덧셈식: 더해지는 수가 커진 만큼 더하는 수가 작아지면 합이 일정 / 뺄셈식: 같이 커지면 차가 일정
곱셈식: 11 × 11 = 121, 111 × 111 = 12321 … 다음 식 추측 → 계산기로 확인
최종: GRADE=4 ./make_final.sh 27
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, SurroundingRectangle,
                   VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage


def sp(v, c):
    return f'<span foreground="{c}">{v}</span>'


class G4Ep27(EpisodeScene):
    GRADE, SEM = 4, 1
    EP_NO = 27
    EP_TITLE = "계산식의 배열에서 규칙 찾기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.addsub()
        self.mul()
        self.closing(f"{o('변하는 수')}와 {b('변하지 않는 수')}를 살펴 규칙을 찾고\n다음 계산 결과를 {g('추측')}한 뒤 확인해요",
                     next_preview="4학년 28화 · 등호(=)는 '같다'는 약속")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("무지개 섬의 계산식에는 어떤 규칙이 있을까요?", 44).move_to([0.6, 2.3, 0])
        rows = VGroup(*[M(t, 50) for t in ["100 + 500 = 600", "200 + 400 = 600", "300 + 300 = 600", "400 + 200 = 600"]])
        rows.arrange(DOWN, buff=0.3).move_to([0, -0.2, 0])
        self.say("계산식에 숨은 규칙", "무지개 섬에 이런 덧셈식이 차례로 적혀 있어요. 어떤 규칙이 있을까요?")
        self.play(Write(q), LaggedStart(*[FadeIn(r) for r in rows], lag_ratio=0.3), run_time=1.6)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def addsub(self):
        self.section("덧셈식과 뺄셈식")
        L = VGroup(*[M(f"{sp(a, ORANGE)} + {sp(b_, BLUE)} = {sp(600, GREEN)}", 46)
                     for a, b_ in [(100, 500), (200, 400), (300, 300), (400, 200)]]).arrange(DOWN, buff=0.3).move_to([-3.3, 0.4, 0])
        self.play(FadeIn(L), run_time=0.6)
        self.say(f"더해지는 수 {o('100씩 커지고')}, 더하는 수 {b('100씩 작아져요')}",
                 "더해지는 수는 100씩 커지고, 더하는 수는 100씩 작아져요. 그래서 합은 600으로 변하지 않아요.")
        self.play(LaggedStart(*[Indicate(r, scale_factor=1.05) for r in L], lag_ratio=0.2, run_time=1.2))
        n1 = M(f"다음: 500 + 100 = {g('600')}", 42).move_to([-3.3, -1.7, 0])
        self.play(FadeIn(n1), run_time=0.5)
        R = VGroup(*[M(f"{sp(a, ORANGE)} − {sp(b_, BLUE)} = {sp(300, GREEN)}", 46)
                     for a, b_ in [(700, 400), (800, 500), (900, 600), (1000, 700)]]).arrange(DOWN, buff=0.3).move_to([3.3, 0.4, 0])
        self.say(f"빼지는 수와 빼는 수가 {o('함께')} 100씩 커지면", "뺄셈식에서는 빼지는 수와 빼는 수가 함께 100씩 커지면 차가 300으로 변하지 않아요.")
        self.play(FadeIn(R), run_time=0.6)
        n2 = M(f"다음: 1100 − 800 = {g('300')}", 42).move_to([3.3, -1.7, 0])
        self.play(FadeIn(n2), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def mul(self):
        self.section("곱셈식의 규칙")
        data = [("11 × 11", "121"), ("111 × 111", "12321"), ("1111 × 1111", "1234321")]
        rows = VGroup(*[M(f"{a} = {g(c)}", 52) for a, c in data]).arrange(DOWN, buff=0.35, aligned_edge=LEFT).move_to([-0.4, 0.9, 0])
        self.say("1이 늘어나는 곱셈식", "이번에는 1로만 된 수끼리 곱한 식이에요. 곱에 어떤 규칙이 보이나요?")
        self.play(LaggedStart(*[FadeIn(r) for r in rows], lag_ratio=0.35, run_time=1.4))
        self.say(f"곱은 1부터 커졌다가 {o('다시 1로')}", "곱은 1부터 차례로 커졌다가 다시 1까지 작아지는 수예요. 가운데 수는 1의 개수와 같아요.")
        self.play(Indicate(rows[2], color=ORANGE, scale_factor=1.05), run_time=0.8)
        nx = M(f"추측: 11111 × 11111 = {o('123454321')}", 46).move_to([0, -1.2, 0])
        self.say("다음 식을 추측해 봐요", "그러면 11111 곱하기 11111은 얼마일까요? 규칙대로라면 123454321이에요.")
        self.play(FadeIn(nx), run_time=0.6)
        ok = M(f"계산기로 확인 → {g('맞아요!')}", 44).move_to([0, -2.0, 0])
        self.say(f"계산기로 확인하면 {g('맞아요')}", "계산기로 확인해 보면 정말 123454321이에요. 규칙을 찾으면 계산하지 않고도 결과를 추측할 수 있어요.")
        self.play(FadeIn(ok), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
