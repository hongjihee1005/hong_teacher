"""「수학 원리 돋보기」 6학년 53화 — 비례식의 성질 (6-2 4단원 5차시, 화 코드 6-2-4-d)

비례식에서 외항의 곱과 내항의 곱은 같음: 1 : 4 = 1×6 : 4×6 → 외항의 곱 1×4×6, 내항의 곱 4×1×6
이 성질로 비례식의 □ 구하기 (예: 3 : 5 = □ : 20 → 3 × 20 = 5 × □ → □ = 12)
최종: GRADE=6 ./make_final.sh 53
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, ArcBetweenPoints, Create, FadeIn, FadeOut, Indicate, LaggedStart, VGroup,
                   Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage


def prop(items, size=90, y=0.6, x=0.0):
    g_ = VGroup(*[T(str(s), size) for s in (items[0], ":", items[1], "=", items[2], ":", items[3])])
    g_.arrange(RIGHT, buff=0.32).move_to([x, y, 0])
    return g_


class G6Ep53(EpisodeScene):
    GRADE, SEM = 6, 2
    EP_NO = 53
    EP_TITLE = "비례식의 성질"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.check()
        self.why()
        self.solve()
        self.closing(f"비례식에서 {o('외항의 곱')}과 {b('내항의 곱')}은 같아요\n이 성질로 비례식의 {g('□')}를 구할 수 있어요",
                     next_preview="6학년 54화 · 비례식 활용")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("비례식 6 : 20 = 12 : 40에서\n외항끼리, 내항끼리 곱하면 어떻게 될까요?", 42).move_to([0.6, 1.6, 0])
        self.say("외항끼리, 내항끼리 곱하면?", "비례식 6 대 20은 12 대 40에서 외항끼리 곱하고, 내항끼리 곱하면 어떻게 될까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def check(self):
        self.section("곱해 보기")
        p = prop((6, 20, 12, 40), 96, 1.2)
        self.play(FadeIn(p), run_time=0.5)
        self.play(p[0].animate.set_color(ORANGE), p[6].animate.set_color(ORANGE), p[2].animate.set_color(BLUE), p[4].animate.set_color(BLUE), run_time=0.4)
        e1 = M(f"외항의 곱: {o('6 × 40 = 240')}", 44).move_to([0, -0.4, 0])
        e2 = M(f"내항의 곱: {b('20 × 12 = 240')}", 44).move_to([0, -1.3, 0])
        self.say(f"외항의 곱 {o('240')}, 내항의 곱 {b('240')}", "외항의 곱은 6 곱하기 40, 240. 내항의 곱은 20 곱하기 12, 240이에요. 둘이 같아요.")
        self.play(FadeIn(e1), run_time=0.5)
        self.play(FadeIn(e2), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def why(self):
        self.section("왜 같을까?")
        p = M(f"1 : 4 = 1 × {g('6')} : 4 × {g('6')}", 54).move_to([0, 1.6, 0])
        self.say("비의 성질로 만든 비례식", "1 대 4의 전항과 후항에 6을 곱해 비례식 1 대 4는 1 곱하기 6 대 4 곱하기 6을 만들었어요.")
        self.play(FadeIn(p), run_time=0.6)
        e1 = M(f"외항의 곱: {o('1 × 4 × 6')}", 44).move_to([0, 0.2, 0])
        e2 = M(f"내항의 곱: {b('4 × 1 × 6')}", 44).move_to([0, -0.7, 0])
        self.say("곱하는 수가 똑같아요", "외항의 곱은 1 곱하기 4 곱하기 6, 내항의 곱은 4 곱하기 1 곱하기 6이에요. 곱하는 수가 똑같으니 언제나 같아요.")
        self.play(FadeIn(e1), FadeIn(e2), run_time=0.7)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def solve(self):
        self.section("□ 구하기")
        p = prop((3, 5, "□", 20), 90, 1.4)
        self.play(FadeIn(p), run_time=0.5)
        self.play(p[0].animate.set_color(ORANGE), p[6].animate.set_color(ORANGE), p[2].animate.set_color(BLUE), p[4].animate.set_color(BLUE), run_time=0.4)
        e1 = M(f"{o('3 × 20')} = {b('5 × □')}", 46).move_to([0, 0.0, 0])
        self.say("외항의 곱 = 내항의 곱", "3 대 5는 □ 대 20에서 외항의 곱과 내항의 곱이 같으니 3 곱하기 20은 5 곱하기 □예요.")
        self.play(FadeIn(e1), run_time=0.6)
        e2 = M(f"60 = 5 × □  →  □ = 60 ÷ 5 = {g('12')}", 46).move_to([0, -1.1, 0])
        self.say(f"□ = {g('12')}", "5 곱하기 □가 60이니 □는 60 나누기 5, 12예요.")
        self.play(FadeIn(e2), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
