"""「수학 원리 돋보기」 개념 차근차근 119화 — 분류하기

기준을 정해 나누기 / '예쁜 것'처럼 사람마다 다른 기준은 안 됨 → 색, 모양처럼 누가 해도 같은 기준 / 한 가지 물건을 여러 기준으로 / 세어 보기 / 연습
최종: GRADE=c ./make_final.sh 119
"""
import numpy as np
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, Line, SurroundingRectangle, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, M, T, b, g, o
from division import clear_stage
from conceptkit import ConceptScene, dot, dots, ten_frame, RED
from items import check_mark, cross_mark
from storykit import book, scroll, show_sources
from conceptkit import poly
from manim import Rectangle, Square, Circle, Polygon, Dot, DashedLine, PI, Sector, Triangle
from fraction import frac_bar


class GcEp119(ConceptScene):
    EP_NO = 119
    EP_TITLE = "분류하기"
    OUT_DIR = HERE

    def item(self, kind, col):
        if kind == "c":
            return Circle(radius=0.32, fill_color=col, fill_opacity=0.9, stroke_color=INK, stroke_width=3)
        if kind == "s":
            return Square(0.6, fill_color=col, fill_opacity=0.9, stroke_color=INK, stroke_width=3)
        return Triangle(fill_color=col, fill_opacity=0.9, stroke_color=INK, stroke_width=3).scale(0.4)

    def construct(self):
        self.opening()
        spec = [("c", ORANGE), ("s", BLUE), ("t", ORANGE), ("c", BLUE), ("s", ORANGE), ("t", BLUE), ("c", ORANGE), ("s", BLUE)]
        self.section("기준 정하기")
        its = VGroup(*[self.item(k, c) for k, c in spec]).arrange(RIGHT, buff=0.5).move_to([0, 1.8, 0])
        self.say("여러 가지 조각을 나누어요", "여러 가지 조각이 있어요. 어떻게 나누면 좋을까요? 예쁜 것과 안 예쁜 것으로 나누면 사람마다 생각이 달라서 안 돼요.")
        self.play(FadeIn(its, lag_ratio=0.1), run_time=0.8)
        t = M(f"누가 나누어도 {g('같은 결과')}가 나오는 기준: 색깔, 모양", 42).move_to([0, 0.8, 0])
        self.play(FadeIn(t), run_time=0.4)
        orange = [i for i, (k, c) in enumerate(spec) if c == ORANGE]
        blue = [i for i, (k, c) in enumerate(spec) if c == BLUE]
        self.say("색깔로 나누면", "색깔을 기준으로 나누면 주황 4개, 파랑 4개예요.")
        self.play(*[its[i].animate.move_to([-3.6 + j * 0.8, -0.4, 0]) for j, i in enumerate(orange)],
                  *[its[i].animate.move_to([1.0 + j * 0.8, -0.4, 0]) for j, i in enumerate(blue)], run_time=1.0)
        la = M(f"{o('주황')} 4개", 38).move_to([-2.4, -1.3, 0])
        lb = M(f"{b('파랑')} 4개", 38).move_to([2.2, -1.3, 0])
        self.play(FadeIn(la), FadeIn(lb), run_time=0.4)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)
        self.ask("같은 조각을 모양으로 나누면 몇 무리?", "모양으로 나누면?", "연습해 볼까요? 같은 조각들을 모양을 기준으로 나누면 몇 무리가 될까요?",
                 f"○ · □ · △ → {g('3무리')} (○ 3, □ 3, △ 2)", f"{g('3무리')}", "동그라미 3개, 네모 3개, 세모 2개, 세 무리가 돼요. 같은 물건도 기준에 따라 다르게 나뉘어요.", qsize=56)
        self.closing(f"분류는 {g('누가 해도 같은')} 기준으로\n같은 물건도 기준에 따라 다르게 나뉘어요",
                     next_preview="개념 차근차근 120화 · 표와 ○ 그래프")
        self.wait(0.5)
