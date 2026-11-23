"""「수학 원리 돋보기」 개념 차근차근 123화 — 꺾은선그래프

시간에 따라 변하는 양(하루 기온 9시 8°, 10시 11°, 11시 14°, 12시 16°, 1시 17°) → 점 찍고 선으로 / 선의 기울기로 변화 / 물결선(필요 없는 부분 줄임) / 막대그래프와 비교 / 연습
최종: GRADE=c ./make_final.sh 123
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
from conceptkit import poly, bar_chart
from manim import Rectangle, Square, Circle, Dot, DashedLine, PI, Sector, VMobject, GrowFromEdge
from fraction import frac_bar


class GcEp123(ConceptScene):
    EP_NO = 123
    EP_TITLE = "꺾은선그래프"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("시간에 따라 변하는 양")
        data = [("9시", 8), ("10시", 11), ("11시", 14), ("12시", 16), ("1시", 17)]
        x0, y0, u, dx = -5.0, -1.4, 0.18, 1.6
        ax = VGroup(Line([x0, y0, 0], [x0 + dx * 5.5, y0, 0], color=INK, stroke_width=4), Line([x0, y0, 0], [x0, y0 + 20 * u, 0], color=INK, stroke_width=4))
        grid = VGroup(*[VGroup(Line([x0, y0 + v * u, 0], [x0 + dx * 5.5, y0 + v * u, 0], color="#DDD3C4", stroke_width=2), T(str(v), 24, SOFT).move_to([x0 - 0.35, y0 + v * u, 0])) for v in range(0, 21, 5)])
        names = VGroup(*[M(n, 30).move_to([x0 + dx * (i + 1), y0 - 0.35, 0]) for i, (n, _) in enumerate(data)])
        self.say("하루 동안의 기온", "하루 동안 기온이 어떻게 바뀌었는지 나타내 볼까요? 시각마다 기온에 점을 찍어요.")
        self.play(FadeIn(ax), FadeIn(grid), FadeIn(names), run_time=0.6)
        pts = [np.array([x0 + dx * (i + 1), y0 + v * u, 0]) for i, (_, v) in enumerate(data)]
        dots_ = VGroup(*[Dot(p, radius=0.09, color=ORANGE) for p in pts])
        self.play(LaggedStart(*[FadeIn(d) for d in dots_], lag_ratio=0.2), run_time=1.0)
        ln = VMobject(color=ORANGE, stroke_width=6)
        ln.set_points_as_corners(pts)
        self.say("점을 선으로 이어요", "점들을 선으로 이으면 꺾은선그래프예요. 선이 가파르게 올라가면 많이 변한 것, 완만하면 조금 변한 것이에요.")
        self.play(Create(ln), run_time=1.0)
        t = M(f"9시~11시: {o('많이')} 올랐어요\n12시~1시: {b('조금')} 올랐어요", 36).move_to([4.6, 1.6, 0])
        self.play(FadeIn(t), run_time=0.4)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.5)
        self.step("꺾은선그래프의 좋은 점", [("시간에 따라 변하는 모습을 한눈에 볼 수 있어요", 42, 1.4),
                  (f"필요 없는 부분은 {o('물결선')}으로 줄여 변화를 크게 보여요", 40, 0.4),
                  ("키, 기온, 식물의 자람처럼 변화를 나타낼 때 알맞아요", 40, -0.6)],
                  "변화를 보기 좋아요", "꺾은선그래프는 시간에 따라 변하는 모습을 보기 좋아요. 필요 없는 아래 부분은 물결선으로 줄여서 변화를 크게 보여 줄 수 있어요.")
        self.ask("반 학생 수와 내 키의 변화, 꺾은선그래프에 알맞은 것은?", "어느 쪽이 알맞을까?", "연습해 볼까요? 반별 학생 수와 해마다 바뀐 내 키 중 꺾은선그래프로 나타내기 알맞은 것은?",
                 f"{g('해마다 바뀐 내 키')} (시간에 따른 변화)", "내 키", "시간에 따라 변하는 내 키가 꺾은선그래프에 알맞아요. 반별 학생 수는 막대그래프가 알맞아요.", qsize=46, asize=48)
        self.closing(f"꺾은선그래프: 시간에 따른 {o('변화')}를 한눈에\n선이 가파를수록 많이 변했어요",
                     next_preview="개념 차근차근 124화 · 평균")
        self.wait(0.5)
