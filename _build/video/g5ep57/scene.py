"""「수학 원리 돋보기」 5학년 57화 — 평균은 무엇일까? (5-2 6단원 2차시, 화 코드 5-2-6-a)

모둠별 모은 빈 병 5, 8, 6, 9, 7개 → 많은 곳에서 적은 곳으로 옮겨 모두 같게 → 7개씩
자룟값을 고르게 하여 그 자료를 대표하는 값 = 평균
최종: GRADE=5 ./make_final.sh 57
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, DashedLine, FadeIn, FadeOut, Indicate, LaggedStart, Square, VGroup,
                   Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage

VALS = [5, 8, 6, 9, 7]
NAMES = ["가", "나", "다", "라", "마"]
S = 0.36


def stack(n, x, y0, color=BLUE):
    return VGroup(*[Square(side_length=S, fill_color=color, fill_opacity=0.85, stroke_color=INK, stroke_width=2).move_to([x, y0 + (k + 0.5) * S, 0]) for k in range(n)])


class G5Ep57(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 57
    EP_TITLE = "평균은 무엇일까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.level()
        self.closing(f"자룟값을 {o('고르게')} 하여 그 자료를 대표하는 값이 {g('평균')}\n많은 곳에서 적은 곳으로 옮겨 모두 같게 해요",
                     next_preview="5학년 58화 · 평균 구하기")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("모둠마다 모은 빈 병의 수가 달라요.\n한 모둠에 몇 개쯤 모았다고 말할 수 있을까요?", 42).move_to([0.6, 1.6, 0])
        self.say("모둠을 대표하는 값은?", "모둠마다 모은 빈 병의 수가 5, 8, 6, 9, 7개로 달라요. 한 모둠이 몇 개쯤 모았다고 말할 수 있을까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def level(self):
        self.section("고르게 해 보기")
        xs = [-4.0 + k * 2.0 for k in range(5)]
        y0 = -1.6
        stacks = [stack(v, x, y0) for v, x in zip(VALS, xs)]
        labs = VGroup(*[T(f"{n} ({v})", 30).move_to([x, y0 - 0.35, 0]) for n, v, x in zip(NAMES, VALS, xs)])
        self.say("모둠별 빈 병 수를 쌓아 봐요", "모둠별로 모은 빈 병을 쌓아서 나타냈어요.")
        self.play(*[FadeIn(s) for s in stacks], FadeIn(labs), run_time=0.8)
        line = DashedLine([-5.0, y0 + 7 * S, 0], [5.2, y0 + 7 * S, 0], color=GREEN, stroke_width=4)
        self.say(f"많은 곳에서 {o('적은 곳으로')} 옮겨요", "많이 모은 모둠에서 적게 모은 모둠으로 병을 옮겨서 모두 같게 만들어 볼게요.")
        self.play(Create(line), run_time=0.5)
        moves = [(3, 0, 2), (1, 2, 1)]  # 라→가 2개, 나→다 1개
        for src, dst, k in moves:
            for _ in range(k):
                blk = stacks[src][-1]
                stacks[src].remove(blk)
                tgt = [xs[dst], y0 + (len(stacks[dst]) + 0.5) * S, 0]
                self.play(blk.animate.move_to(tgt).set_fill(ORANGE, 0.9), run_time=0.6)
                stacks[dst].add(blk)
        t = M(f"모두 {g('7개')}씩으로 같아졌어요", 44).move_to([0, 2.0, 0])
        self.say(f"모두 {g('7개')}씩", "라 모둠에서 가 모둠으로 2개, 나 모둠에서 다 모둠으로 1개를 옮기니 모두 7개씩으로 같아졌어요.")
        self.play(FadeIn(t), run_time=0.5)
        t2 = M(f"7 = 이 자료를 대표하는 값, {g('평균')}", 42).move_to([0, 1.2, 0])
        self.say(f"이 값이 {g('평균')}", "이렇게 자룟값을 고르게 하여 그 자료를 대표하는 값으로 정할 수 있어요. 이 값을 평균이라고 해요. 한 모둠이 평균 7개를 모았어요.")
        self.play(FadeIn(t2), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
