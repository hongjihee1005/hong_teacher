"""「수학 원리 돋보기」 4학년 28화 — 등호(=)는 '같다'는 약속 (4-1 6단원 8차시, 화 코드 4-1-6-d)

저울이 수평 → 양쪽의 양이 같음 → 4 + 8 = 5 + 7 (등호는 '답을 쓰라'가 아니라 '양쪽이 같다')
한쪽이 1 커지고 다른 쪽이 1 작아지면 합은 그대로 → 계산하지 않고 판단 / 6 − 3 = 10 − 7, 4 × 6 = 8 × 3
최종: GRADE=4 ./make_final.sh 28
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, RoundedRectangle,
                   Transform, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from measure import balance


def tag(v, color):
    r = RoundedRectangle(corner_radius=0.1, width=0.85, height=0.62, fill_color=PAPER, fill_opacity=1,
                         stroke_color=color, stroke_width=4)
    return VGroup(r, T(str(v), 34, color).move_to(r))


class G4Ep28(EpisodeScene):
    GRADE, SEM = 4, 1
    EP_NO = 28
    EP_TITLE = "등호(=)는 '같다'는 약속"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.scale_eq()
        self.shift_rule()
        self.others()
        self.closing(f"등호(=)는 양쪽의 크기가 {g('같다')}는 뜻\n한쪽이 커진 만큼 다른 쪽이 작아지면 {o('합은 그대로')}",
                     next_preview="4학년 29화 · 분모는 왜 더하지 않을까?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("4 + 8 = □ + 7   □ 안에 알맞은 수는?", 54).move_to([0, 1.2, 0])
        self.say("□ 안에 알맞은 수는?", "4 더하기 8은 네모 더하기 7과 같아요. 네모 안에 알맞은 수는 무엇일까요?")
        self.play(Write(q), run_time=1.2)
        w = M(f"12라고 쓰면 될까요?", 46, SOFT).move_to([0, -0.2, 0])
        self.play(FadeIn(w), run_time=0.5)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def scale_eq(self):
        self.section("저울로 생각하기")
        c = np.array([0, 0.9, 0])
        bal = balance(c, tilt=0.0, arm=2.8)
        left = VGroup(tag(4, ORANGE), tag(8, ORANGE)).arrange(RIGHT, buff=0.1)
        right = VGroup(tag(5, BLUE), tag(7, BLUE)).arrange(RIGHT, buff=0.1)
        left.move_to(bal.lp + UP * 0.35)
        right.move_to(bal.rp + UP * 0.35)
        self.say("저울 양쪽에 올려 봐요", "저울 왼쪽에 4와 8, 오른쪽에 5와 7을 올려 볼까요?")
        self.play(FadeIn(bal), run_time=0.6)
        self.play(FadeIn(left, shift=DOWN * 0.3), FadeIn(right, shift=DOWN * 0.3), run_time=0.8)
        self.say(f"저울이 {g('수평')} → 양쪽이 같아요", "저울이 수평을 이루었어요. 왼쪽 12와 오른쪽 12, 양쪽의 양이 같아요.")
        e = VGroup(M(o("4 + 8"), 76), M(g("="), 90), M(b("5 + 7"), 76)).arrange(RIGHT, buff=0.5).move_to([0, -2.0, 0])
        self.play(FadeIn(e), run_time=0.6)
        self.say(f"등호(=)는 {g('양쪽이 같다')}는 뜻", "등호는 '답을 쓰라'는 뜻이 아니라, 양쪽의 크기가 같다는 뜻이에요. 그래서 네모에는 12가 아니라 5가 들어가요.")
        self.play(Indicate(e[1], color=GREEN, scale_factor=1.6), run_time=0.9)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def shift_rule(self):
        self.section("계산하지 않고 알기")
        l1 = M(f"4 + 8 = {o('5')} + {b('7')}", 60).move_to([0, 1.6, 0])
        l2 = M(f"4 → {o('5')}  ({o('1 커짐')}),   8 → {b('7')}  ({b('1 작아짐')})", 46).move_to([0, 0.4, 0])
        l3 = M(f"커진 만큼 작아지면 {g('합은 그대로')}", 52).move_to([0, -0.8, 0])
        self.say("4와 5, 8과 7을 견주어 봐요", "계산하지 않고도 알 수 있어요. 4는 5로 1 커졌고, 8은 7로 1 작아졌어요.")
        self.play(FadeIn(l1), run_time=0.5)
        self.play(FadeIn(l2), run_time=0.6)
        self.say(f"커진 만큼 작아지면 {g('합은 그대로')}", "한쪽이 커진 만큼 다른 쪽이 작아지면 합은 그대로예요. 그래서 등호로 이을 수 있어요.")
        self.play(FadeIn(l3), run_time=0.6)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def others(self):
        self.section("뺄셈식과 곱셈식")
        a = M(f"6 − 3 {g('=')} 10 − 7", 56).move_to([-3.4, 1.2, 0])
        an = M(f"둘 다 {o('4씩')} 커짐 → 차는 그대로", 32).next_to(a, DOWN, buff=0.3)
        bq = M(f"4 × 6 {g('=')} 8 × 3", 56).move_to([3.4, 1.2, 0])
        bn = M(f"한쪽 {o('2배')}, 다른 쪽 {b('반')} → 곱은 그대로", 32).next_to(bq, DOWN, buff=0.3)
        self.say("뺄셈식도 등호로", "뺄셈식에서는 빼지는 수와 빼는 수가 똑같이 4씩 커지면 차가 같아요. 6 빼기 3은 10 빼기 7과 같아요.")
        self.play(FadeIn(a), FadeIn(an), run_time=0.7)
        self.say("곱셈식도 등호로", "곱셈식에서는 한쪽이 2배가 되고 다른 쪽이 반이 되면 곱이 같아요. 4 곱하기 6은 8 곱하기 3과 같아요.")
        self.play(FadeIn(bq), FadeIn(bn), run_time=0.7)
        chk = M(f"6 − 3 = 3 = 10 − 7,   4 × 6 = 24 = 8 × 3", 40).move_to([0, -1.2, 0])
        self.play(FadeIn(chk), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
