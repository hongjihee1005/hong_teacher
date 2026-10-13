"""「수학 원리 돋보기」 51화 — 소수의 크기 비교 (1학기 6단원 10차시, 화 코드 1-6-e)

0.1의 개수로 비교(0.7 > 0.4) → 수직선 위에 놓기 → 소수점 왼쪽부터(2.3 < 3.1), 같으면 오른쪽(1.8 > 1.5)
최종: ./make_final.sh 51
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import DOWN, LEFT, RIGHT, UP, Create, Dot, FadeIn, Indicate, Line, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage


class Ep51(EpisodeScene):
    EP_NO = 51
    EP_TITLE = "소수의 크기 비교"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.count()
        self.line()
        self.rule()
        self.closing(f"{o('0.1의 개수')}가 많을수록 큰 소수\n소수점 왼쪽 → 같으면 소수점 오른쪽을 견주어요",
                     next_preview="3학년 편 끝! 다음에 또 만나요")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M(f"민호는 우유를 {o('0.7')}컵, 지아는 {b('0.4')}컵 마셨어요.\n누가 더 많이 마셨을까요?", 52).move_to([0, 0.8, 0])
        self.say("우유 0.7컵과 0.4컵", "민호는 우유를 0.7컵, 지아는 0.4컵 마셨어요. 누가 더 많이 마셨을까요?")
        self.play(Write(q), run_time=1.2)
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def count(self):
        self.section("0.1의 개수로 비교")
        l1 = M(f"{o('0.7')} = 0.1이 {o('7개')}", 60).move_to([0, 1.4, 0])
        l2 = M(f"{b('0.4')} = 0.1이 {b('4개')}", 60).move_to([0, 0.3, 0])
        r = M(f"{o('0.7')} &gt; {b('0.4')} → 민호가 더 많이", 60).move_to([0, -1.0, 0])
        self.say("0.1이 몇 개인지 세어 봐요", "0.7은 0.1이 7개, 0.4는 0.1이 4개예요.")
        self.play(FadeIn(l1), FadeIn(l2), run_time=0.6)
        self.say(f"0.1이 더 많은 {o('0.7')}이 커요", "0.1이 더 많은 0.7이 더 커요. 민호가 더 많이 마셨어요.")
        self.play(FadeIn(r), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def line(self):
        self.section("수직선에 놓아 보기")
        L, R, y = -5.6, 5.6, 0.5
        ln = Line([L, y, 0], [R, y, 0], color=INK, stroke_width=5)
        ticks = VGroup()
        for k in range(21):
            x = L + (R - L) * k / 20
            big = k % 10 == 0
            ticks.add(Line([x, y + (0.3 if big else 0.14), 0], [x, y - (0.3 if big else 0.14), 0], color=INK, stroke_width=3 if big else 2))
        labs = VGroup(*[T(str(v), 34).move_to([L + (R - L) * v / 2, y - 0.6, 0]) for v in (0, 1, 2)])
        self.say("0부터 2까지 0.1씩 나눈 수직선", "0부터 2까지를 0.1씩 나눈 수직선이에요.")
        self.play(Create(ln), FadeIn(ticks), FadeIn(labs), run_time=0.8)
        pts = [(0.4, BLUE), (0.7, ORANGE), (1.5, BLUE), (1.8, ORANGE)]
        for v, col in pts:
            x = L + (R - L) * v / 2
            d = Dot([x, y, 0], radius=0.12, color=col)
            t = T(str(v), 32, col).move_to([x, y + 0.6, 0])
            self.play(FadeIn(d, scale=2), FadeIn(t), run_time=0.4)
        self.say("오른쪽에 있을수록 큰 수", "수직선에서는 오른쪽에 있을수록 큰 수예요. 0.7이 0.4보다, 1.8이 1.5보다 오른쪽에 있어요.")
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)

    def rule(self):
        self.section("비교하는 차례")
        l1 = M(f"① 소수점 {b('왼쪽')}부터: {b('2')}.3 &lt; {b('3')}.1", 56).move_to([0, 1.3, 0])
        l2 = M(f"② 같으면 소수점 {o('오른쪽')}: 1.{o('8')} &gt; 1.{o('5')}", 56).move_to([0, 0.1, 0])
        self.say(f"먼저 소수점 {b('왼쪽')} 수를 견주어요", "먼저 소수점 왼쪽의 수를 견주어요. 2.3과 3.1은 2보다 3이 크니까 3.1이 더 커요.")
        self.play(FadeIn(l1), run_time=0.6)
        self.say(f"같으면 소수점 {o('오른쪽')} 수", "소수점 왼쪽 수가 같으면 오른쪽 수를 견주어요. 1.8과 1.5는 8이 5보다 크니까 1.8이 더 커요.")
        self.play(FadeIn(l2), run_time=0.6)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
