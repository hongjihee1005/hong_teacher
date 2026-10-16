"""「수학 원리 돋보기」 5학년 3화 — 곱셈을 먼저 하는 까닭 (5-1 1단원 4차시, 화 코드 5-1-1-c)

역기: 쇠막대 20 kg + 25 kg 원판 4개 + 10 kg 원판 2개 = 20 + 25 × 4 + 10 × 2 = 140 (곱셈 먼저)
앞에서부터 하면 380 → 쇠막대까지 4번 센 셈, 상황과 맞지 않음
( )가 있으면 가장 먼저: (20 + 25) × 4 = 180
최종: GRADE=5 ./make_final.sh 3
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, Cross, FadeIn, FadeOut, Indicate, LaggedStart, Rectangle,
                   RoundedRectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from mixcalc import Expr

RED = "#C0392B"
PL_R, PL_G = "#E8505B", "#5DB36A"


def barbell():
    bar = Rectangle(width=7.0, height=0.16, fill_color="#9AA0A6", fill_opacity=1, stroke_width=0)
    lab = T("20 kg", 26, SOFT).next_to(bar, DOWN, buff=0.1)
    plates = VGroup()
    for side in (-1, 1):
        xs = [2.0, 2.35, 2.7, 3.0]
        for k, (h, c) in enumerate([(1.9, PL_R), (1.9, PL_R), (1.3, PL_G)]):
            r = RoundedRectangle(width=0.3, height=h, corner_radius=0.08, fill_color=c, fill_opacity=1, stroke_color=INK, stroke_width=2)
            r.move_to([side * xs[k], 0, 0])
            plates.add(r)
    return VGroup(bar, plates, lab)


class G5Ep03(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 3
    EP_TITLE = "곱셈을 먼저 하는 까닭"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.right()
        self.wrong()
        self.paren()
        self.closing(f"덧셈, 뺄셈, 곱셈이 섞인 식은 {o('곱셈을 먼저')} 계산해요\n( )가 있으면 {g('( ) 안을 가장 먼저')}",
                     next_preview="5학년 4화 · 나눗셈이 섞인 식")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("쇠막대 20 kg에 25 kg 원판 4개, 10 kg 원판 2개를 끼웠어요.\n모두 몇 kg일까요?", 38)
        q.scale_to_fit_width(min(q.width, 11.0)).move_to([0.4, 2.0, 0])
        bb = barbell().move_to([0, -0.5, 0])
        self.say("역기의 무게는?", "역기는 쇠막대 양쪽에 원판을 끼워서 드는 운동 기구예요. 20킬로그램 쇠막대에 25킬로그램 원판 4개와 10킬로그램 원판 2개를 끼웠어요. 모두 몇 킬로그램일까요?")
        self.play(Write(q), FadeIn(bb), run_time=1.2)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def right(self):
        self.section("원판 무게를 먼저")
        e = Expr(["20", "+", "25", "×", "4", "+", "10", "×", "2"], center=[0, 2.0, 0], F=70)
        self.say("하나의 식으로 나타내면", "하나의 식으로 나타내면 20 더하기 25 곱하기 4 더하기 10 곱하기 2예요.")
        self.play(FadeIn(e.g), run_time=0.5)
        st = e.steps()
        self.say(f"원판 무게(곱셈)를 먼저: 100, 20", "먼저 원판의 무게를 구해요. 빨간 원판 4개는 25 곱하기 4, 100킬로그램. 초록 원판 2개는 10 곱하기 2, 20킬로그램.")
        self.play(*e.mark(st[0]), run_time=0.7)
        self.play(*e.mark(st[1]), run_time=0.7)
        self.say(f"그다음 앞에서부터 더해요 → {g('140')}", "그다음 쇠막대 무게와 앞에서부터 차례대로 더하면 120, 그리고 140킬로그램이에요.")
        self.play(*e.mark(st[2]), run_time=0.7)
        self.play(*e.mark(st[3]), run_time=0.7)
        a = M(f"{o('곱셈을 먼저')} 계산해요", 46).move_to([0, -2.15, 0])
        self.say(f"{o('곱셈을 먼저')} 계산해요", "이렇게 덧셈, 뺄셈, 곱셈이 섞인 식은 곱셈을 먼저 계산해요.")
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def wrong(self):
        self.section("앞에서부터 하면?")
        rows = VGroup(*[T(s, 46) for s in ["20 + 25 = 45", "45 × 4 = 180", "180 + 10 = 190", "190 × 2 = 380"]]).arrange(DOWN, aligned_edge=LEFT, buff=0.25).move_to([-3.2, 0.5, 0])
        self.say("곱셈을 먼저 하지 않고 앞에서부터 하면?", "만약 곱셈을 먼저 하지 않고 앞에서부터 차례대로 계산하면 어떻게 될까요?")
        self.play(LaggedStart(*[FadeIn(r) for r in rows], lag_ratio=0.4, run_time=1.6))
        x = Cross(rows, stroke_color=RED, stroke_width=6)
        n = M(f"쇠막대 무게까지\n{o('4번')} 센 셈이에요", 42).move_to([3.4, 0.6, 0])
        self.say(f"380 kg? 쇠막대까지 {o('4번')} 센 셈", "380킬로그램이 되어 버려요. 20 더하기 25에 4를 곱하면 쇠막대 무게까지 4번 센 셈이라 상황과 맞지 않아요.")
        self.play(Create(x), FadeIn(n), run_time=0.8)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def paren(self):
        self.section("( )가 있으면")
        e = Expr(["(", "20", "+", "25", ")", "×", "4"], center=[0, 1.6, 0], F=72)
        self.say("( )가 있으면 가장 먼저", "괄호가 있으면 곱셈보다도 괄호 안을 가장 먼저 계산해요.")
        self.play(FadeIn(e.g), run_time=0.5)
        s1, s2 = e.steps()
        self.play(*e.mark(s1), run_time=0.7)
        self.say(f"(20 + 25) × 4 = {g('180')}", "20 더하기 25는 45, 45 곱하기 4는 180이에요.")
        self.play(*e.mark(s2), run_time=0.7)
        a = M(f"20 + 25 × 4 = 120,  (20 + 25) × 4 = {g('180')}", 42).move_to([0, -1.7, 0])
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
