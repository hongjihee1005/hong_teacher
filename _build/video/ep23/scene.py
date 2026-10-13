"""「수학 원리 돋보기」 23화 — 올림이 여러 번 있으면? (2학기 1단원 곱셈 4차시, 화 코드 2-1-b)

247 × 4: 일 7×4=28 (2 올림) → 십 4×4+2=18 (1 올림) → 백 2×4+1=9 → 988
자리별 덧셈으로 확인(800 + 160 + 28) → 365 × 3 = 1095(천의 자리까지)
최종: ./make_final.sh 23
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, UP, FadeIn, Write, VGroup, Create, SurroundingRectangle

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, EpisodeScene, M, T, b, g, o
from division import clear_stage
from multiply import cm, mul_vertical


class Ep23(EpisodeScene):
    EP_NO = 23
    EP_TITLE = "올림이 여러 번 있으면?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.section("세로셈으로 247 × 4")
        mul_vertical(self, 247, 4)
        self.settle(); self.clear_sub(); clear_stage(self, 0.6)
        self.check()
        self.section("천의 자리까지! 365 × 3")
        mul_vertical(self, 365, 3)
        self.settle(); self.clear_sub(); clear_stage(self, 0.6)
        self.rule()
        self.closing(f"{o('일')} → {b('십')} → {cm('백', 2)} 차례로 곱하고\n올린 수는 {g('윗자리 곱에 더해요')}",
                     next_preview="24화 · 몇십을 곱하면 0이 하나 붙는 까닭")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M(f"식당에 음식이 {cm('2', 2)}{cm('4', 1)}{cm('7', 0)}인분씩 {b('4상자')} 있어요.\n모두 몇 인분일까요?", 52)
        q.scale_to_fit_width(min(q.width, 11.6)).move_to([0, 1.5, 0])
        self.say("247인분씩 4상자", "축제 식당에 음식이 247인분씩 4상자 준비되어 있어요. 모두 몇 인분일까요?")
        self.play(Write(q), run_time=1.3)
        e = M("247 × 4 = ?", 110).move_to([0, -0.5, 0])
        self.say("올림이 여러 번 생기면 어떤 순서로?", "247 곱하기 4는 자리마다 올림이 생겨요. 어떤 순서로 계산해야 할까요?")
        self.play(FadeIn(e), run_time=0.6)
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def check(self):
        self.section("자리별로 확인하기")
        rows = [
            f"{cm('백', 2)}: {cm('200', 2)} × 4 = {cm('800', 2)}",
            f"{cm('십', 1)}: {cm('40', 1)} × 4 = {cm('160', 1)}",
            f"{cm('일', 0)}: {cm('7', 0)} × 4 = {cm('28', 0)}",
        ]
        ms = VGroup(*[M(r_, 52) for r_ in rows]).arrange(DOWN, buff=0.4, aligned_edge=LEFT).move_to([0, 1.2, 0])
        self.say("자리별로 곱해 더해도 같을까요?", "자리별로 따로 곱해서 더해 보면 같은 답이 나올까요?")
        for m_ in ms:
            self.play(FadeIn(m_, shift=DOWN * 0.2), run_time=0.5)
            self.wait(0.4)
        tot = M(f"800 + 160 + 28 = {g('988')}", 64).move_to([0, -1.1, 0])
        self.say(f"800 + 160 + 28 = {g('988')}, 같아요!", "800 더하기 160 더하기 28은 988. 세로셈과 같아요! 올림은 이렇게 넘친 수를 윗자리로 보내는 거예요.")
        self.play(FadeIn(tot, scale=1.2), run_time=0.7)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)

    def rule(self):
        self.section("정리")
        t = M(f"① {o('일의 자리')}부터 곱해요\n② 10이 넘으면 윗자리로 {g('올려')} 작게 적어요\n③ 윗자리 곱에 올린 수를 {g('더해요')}", 48)
        bg = SurroundingRectangle(t, color=GREEN, buff=0.35, stroke_width=6, corner_radius=0.2).set_fill(PAPER, 1)
        VGroup(bg, t).move_to([0, 0.4, 0])
        self.say("올림이 여러 번이어도 순서는 같아요", "올림이 여러 번 있어도 순서는 같아요. 일의 자리부터 곱하고, 넘치면 올리고, 올린 수를 더해요.")
        self.play(FadeIn(bg), Write(t), run_time=1.4)
        self.wait(1.8)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
