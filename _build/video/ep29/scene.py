"""「수학 원리 돋보기」 29화 — 받아올림이 여러 번 있으면? (1학기 1단원 4차시, 화 코드 1-1-b)

275 + 148: 일 → 십 → 백 차례로 받아올림 → 423 / 491 + 509 = 1000: 받아올림 세 번, 천 모형이 생김
최종: ./make_final.sh 29
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, ReplacementTransform, SurroundingRectangle, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, EpisodeScene, M, T, b, g, o
from division import clear_stage
from base10 import hundred_flat
from multiply import HUND, cm
from addsub import add_vertical


class Ep29(EpisodeScene):
    EP_NO = 29
    EP_TITLE = "받아올림이 여러 번 있으면?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.section("세로셈으로 275 + 148")
        add_vertical(self, 275, 148)
        self.settle(); self.clear_sub(); clear_stage(self, 0.6)
        self.section("받아올림 세 번! 491 + 509")
        add_vertical(self, 491, 509)
        self.settle(); self.clear_sub(); clear_stage(self, 0.6)
        self.thousand()
        self.closing(f"{o('일')} → {b('십')} → {cm('백', 2)} 차례로 더하며\n10이 될 때마다 {g('윗자리로 1을 받아올려요')}",
                     next_preview="30화 · 같은 자리끼리 뺄 수 없으면?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M(f"병뚜껑을 민서네는 {cm('2', 2)}{cm('7', 1)}{cm('5', 0)}개, 유찬이네는 {cm('1', 2)}{cm('4', 1)}{cm('8', 0)}개 모았어요.\n모두 몇 개일까요?", 48)
        q.scale_to_fit_width(min(q.width, 11.6)).move_to([0, 1.5, 0])
        self.say("병뚜껑 275개와 148개", "새 활용을 하려고 민서네 가족은 병뚜껑 275개, 유찬이네 가족은 148개를 모았어요. 모두 몇 개일까요?")
        self.play(Write(q), run_time=1.3)
        e = M("275 + 148 = ?", 110).move_to([0, -0.5, 0])
        self.say("받아올림이 여러 번 있으면 어떤 순서로?", "일의 자리도, 십의 자리도 합이 10을 넘어요. 받아올림이 여러 번 있으면 어떤 순서로 계산할까요?")
        self.play(FadeIn(e), run_time=0.6)
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def thousand(self):
        self.section("천 모형이 생겨요")
        flats = VGroup(*[hundred_flat(0.07) for _ in range(10)]).arrange(RIGHT, buff=0.08).move_to([0, 1.3, 0])
        self.say(f"백 모형 {cm('10개', 2)}가 모이면?", "백의 자리에서도 10이 되었어요. 백 모형 10개가 모이면 어떻게 될까요?")
        self.play(FadeIn(flats), run_time=0.7)
        big = VGroup(*[hundred_flat(0.12).move_to([-1.2 + k * 0.09, 0.3 + k * 0.09, 0]) for k in range(10)])
        self.play(ReplacementTransform(flats, big), run_time=1.2)
        lab = T("천 모형 1개 = 1000", 52, INK).next_to(big, RIGHT, buff=0.6)
        self.play(FadeIn(lab), run_time=0.5)
        m = M(f"백 모형 {cm('10개', 2)} = 천 모형 1개 → 합은 {g('네 자리 수')}", 46).move_to([0, -1.5, 0])
        self.say(f"합이 {g('네 자리 수')} 1000이 돼요", "백 모형 10개는 천 모형 1개. 그래서 합이 네 자리 수 1000이 돼요.")
        self.play(FadeIn(m), run_time=0.6)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
