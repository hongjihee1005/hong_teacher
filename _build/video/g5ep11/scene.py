"""「수학 원리 돋보기」 5학년 11화 — 더하거나 빼는 대응 관계 (5-1 3단원 3차시, 화 코드 5-1-3-b)

길을 따라 이어진 태양광 그늘막: 그늘막 1개에 기둥 2개, 2개에 3개, … → 기둥의 수 = 그늘막의 수 + 1
그늘막의 수 = 기둥의 수 − 1 / 몇 배 관계뿐 아니라 더하거나 빼는 관계도 대응 관계
최종: GRADE=5 ./make_final.sh 11
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, Line, Polygon, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from corresp import CTable

SHADE = "#4A7FC1"


def shades(n, x0, y, w=1.3):
    g_ = VGroup()
    posts = VGroup(*[Line([x0 + k * w, y, 0], [x0 + k * w, y + 1.0, 0], color="#555555", stroke_width=6) for k in range(n + 1)])
    roofs = VGroup(*[Polygon([x0 + k * w, y + 1.0, 0], [x0 + (k + 1) * w, y + 1.0, 0], [x0 + (k + 0.5) * w, y + 1.35, 0],
                             fill_color=SHADE, fill_opacity=0.85, stroke_color=INK, stroke_width=2) for k in range(n)])
    return roofs, posts


class G5Ep11(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 11
    EP_TITLE = "더하거나 빼는 대응 관계"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.build()
        self.rule()
        self.closing(f"기둥의 수는 그늘막의 수보다 {o('1 더 많아요')}\n더하거나 빼는 관계도 {g('대응 관계')}예요",
                     next_preview="5학년 12화 · 대응 관계를 기호로 식 세우기")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("길을 따라 그늘막을 이어 세워요.\n그늘막과 기둥의 수는 어떤 관계일까요?", 44).move_to([0.6, 1.8, 0])
        r, p = shades(3, -2.0, -1.4)
        self.say("그늘막과 기둥", "길을 따라 태양광 그늘막을 이어 세워요. 그늘막의 수와 기둥의 수는 어떤 관계일까요?")
        self.play(Write(q), FadeIn(r), FadeIn(p), run_time=1.2)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def build(self):
        self.section("하나씩 이어 세우기")
        tb = CTable(["그늘막의 수(개)", "기둥의 수(개)"], [1, 2, 3, 4, 5], [2, 3, 4, 5, 6], center=[0, -1.0, 0])
        self.play(FadeIn(tb.frame), run_time=0.5)
        x0, y = -3.3, 0.5
        r, p = shades(5, x0, y)
        self.say("그늘막을 하나씩 이어요", "그늘막을 하나씩 이어 세우며 기둥을 세어 볼게요.")
        self.play(FadeIn(p[0]), run_time=0.3)
        for k in range(5):
            self.play(FadeIn(r[k]), FadeIn(p[k + 1]), FadeIn(tb.top[k]), FadeIn(tb.bot[k]), run_time=0.55)
        self.say(f"처음 기둥 하나가 {o('더 있어요')}", "그늘막을 하나 이을 때마다 기둥도 하나씩 늘어요. 그런데 맨 처음 기둥 하나가 더 있어서, 기둥이 늘 1개 더 많아요.")
        self.play(Indicate(p[0], color=ORANGE, scale_factor=1.6), run_time=0.9)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def rule(self):
        self.section("관계를 말로, 식으로")
        tb = CTable(["그늘막의 수(개)", "기둥의 수(개)"], [1, 2, 3, 4, 5], [2, 3, 4, 5, 6], center=[-0.8, 1.2, 0])
        self.add(tb.frame, tb.top, tb.bot)
        dn = tb.arrows("+ 1", color=ORANGE)
        e1 = M(f"(기둥의 수) = (그늘막의 수) {o('+ 1')}", 42).move_to([0, -0.4, 0])
        e2 = M(f"(그늘막의 수) = (기둥의 수) {b('− 1')}", 42).move_to([0, -1.2, 0])
        self.say(f"기둥의 수 = 그늘막의 수 {o('+ 1')}", "기둥의 수는 그늘막의 수보다 1 더 많아요. 기둥의 수는 그늘막의 수 더하기 1.")
        self.play(FadeIn(dn), FadeIn(e1), run_time=0.6)
        self.say(f"그늘막의 수 = 기둥의 수 {b('− 1')}", "거꾸로 그늘막의 수는 기둥의 수보다 1 더 적어요.")
        self.play(FadeIn(e2), run_time=0.5)
        t = M(f"{o('몇 배')} 관계뿐 아니라 {b('더하거나 빼는')} 관계도 {g('대응 관계')}", 38).move_to([0, -2.0, 0])
        self.say(f"더하거나 빼는 관계도 {g('대응 관계')}", "식탁과 다리처럼 몇 배인 관계뿐 아니라, 이렇게 더하거나 빼는 관계도 대응 관계예요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
