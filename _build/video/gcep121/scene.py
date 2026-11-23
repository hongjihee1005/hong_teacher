"""「수학 원리 돋보기」 개념 차근차근 121화 — 그림그래프

마을별 사과 수확 상자 수: 큰 그림 = 10상자, 작은 그림 = 1상자 → 32 = 큰 3, 작은 2 / 읽기·그리기 / 연습
최종: GRADE=c ./make_final.sh 121
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


def apple(big):
    r = 0.32 if big else 0.18
    return Circle(radius=r, fill_color="#E2574C", fill_opacity=1, stroke_color=INK, stroke_width=2)


class GcEp121(ConceptScene):
    EP_NO = 121
    EP_TITLE = "그림그래프"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("큰 그림과 작은 그림")
        key = VGroup(apple(True), M("= 10상자", 34), apple(False), M("= 1상자", 34)).arrange(RIGHT, buff=0.25).move_to([3.6, 2.3, 0])
        data = [("가 마을", 32), ("나 마을", 25), ("다 마을", 41)]
        rows = VGroup()
        for i, (nm, v) in enumerate(data):
            y = 1.2 - i * 1.0
            lab = M(nm, 38).move_to([-4.8, y, 0])
            pics = VGroup(*[apple(True) for _ in range(v // 10)] + [apple(False) for _ in range(v % 10)]).arrange(RIGHT, buff=0.15).move_to([-3.8, y, 0], aligned_edge=LEFT)
            rows.add(VGroup(lab, pics))
        self.say("큰 그림 10, 작은 그림 1", "마을별 사과 수확량을 그림으로 나타냈어요. 큰 그림은 10상자, 작은 그림은 1상자예요.")
        self.play(FadeIn(key), run_time=0.4)
        self.play(LaggedStart(*[FadeIn(r) for r in rows], lag_ratio=0.3), run_time=1.2)
        t = M(f"가 마을: 큰 그림 3, 작은 그림 2 → {g('32상자')}", 40).move_to([0, -1.6, 0])
        self.say(f"가 마을 {g('32상자')}", "가 마을은 큰 그림 3개, 작은 그림 2개라서 32상자예요. 그림의 크기로 많고 적음을 한눈에 알 수 있어요.")
        self.play(FadeIn(t), run_time=0.4)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)
        self.ask("다 마을은 몇 상자? 47상자는 어떻게 그릴까요?", "그림그래프", "연습해 볼까요? 다 마을은 몇 상자일까요? 그리고 47상자는 그림으로 어떻게 그릴까요?",
                 f"다 마을 {g('41상자')} · 47 → 큰 그림 {o('4')}, 작은 그림 {o('7')}", "41, 큰 4 작은 7", "다 마을은 큰 그림 4, 작은 그림 1로 41상자. 47상자는 큰 그림 4개, 작은 그림 7개로 그려요.", qsize=48, asize=46)
        self.closing(f"그림그래프: {o('큰 그림')}과 {b('작은 그림')}으로 수를 나타내요\n그림의 크기와 개수로 한눈에",
                     next_preview="개념 차근차근 122화 · 막대그래프와 플레이페어")
        self.wait(0.5)
