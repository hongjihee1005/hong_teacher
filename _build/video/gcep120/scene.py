"""「수학 원리 돋보기」 개념 차근차근 120화 — 표와 ○ 그래프

좋아하는 과일 조사 → 표(사과 5, 바나나 3, 포도 4, 합계 12) → ○ 그래프(아래부터 하나씩) / 표: 합계 알기 쉬움, 그래프: 많고 적음 한눈에 / 연습
최종: GRADE=c ./make_final.sh 120
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


class GcEp120(ConceptScene):
    EP_NO = 120
    EP_TITLE = "표와 ○ 그래프"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        data = [("사과", 5, "#E2574C"), ("바나나", 3, "#E8B634"), ("포도", 4, "#7B5CC2")]
        self.section("표로 나타내기")
        rows = VGroup(M("과일   사과   바나나   포도   합계", 42), M(f"학생 수   5      3       4     {g('12')}", 42)).arrange(DOWN, buff=0.35, aligned_edge=LEFT).move_to([0, 1.2, 0])
        self.say("좋아하는 과일 조사", "우리 반 친구들이 좋아하는 과일을 조사해 표로 나타냈어요. 사과 5명, 바나나 3명, 포도 4명, 모두 12명.")
        self.play(FadeIn(rows, lag_ratio=0.3), run_time=0.8)
        t = M(f"표: 수와 {g('합계')}를 알기 쉬워요", 40).move_to([0, -0.4, 0])
        self.play(FadeIn(t), run_time=0.4)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.5)
        self.section("○ 그래프")
        cols = VGroup()
        for i, (nm, v, c) in enumerate(data):
            x = -2.4 + i * 2.4
            circ = VGroup(*[Circle(radius=0.25, stroke_color=c, stroke_width=6).move_to([x, -1.0 + k * 0.6, 0]) for k in range(v)])
            lab = M(nm, 36).move_to([x, -1.7, 0])
            cols.add(VGroup(circ, lab))
        self.say("아래부터 ○를 하나씩", "○ 그래프는 아래에서부터 한 칸에 하나씩 ○를 그려요. 어느 과일을 가장 많이 좋아하는지 한눈에 보여요.")
        for c_ in cols:
            self.play(FadeIn(c_[1]), LaggedStart(*[Create(x) for x in c_[0]], lag_ratio=0.15), run_time=0.8)
        t = M(f"가장 많은 과일: {g('사과')}", 40).move_to([4.6, 1.5, 0])
        self.play(FadeIn(t), run_time=0.4)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)
        self.ask("가장 적게 좋아하는 과일은? 사과는 바나나보다 몇 명 더?", "그래프 읽기", "연습해 볼까요? 가장 적게 좋아하는 과일은 무엇이고, 사과는 바나나보다 몇 명 더 많을까요?",
                 f"{g('바나나')} · 5 − 3 = {g('2명')}", "바나나, 2명", "가장 적은 것은 바나나, 사과는 바나나보다 2명 더 많아요.", qsize=44)
        self.closing(f"{b('표')}: 수와 합계를 알기 쉬워요\n{o('그래프')}: 많고 적음이 한눈에 보여요",
                     next_preview="개념 차근차근 121화 · 그림그래프")
        self.wait(0.5)
