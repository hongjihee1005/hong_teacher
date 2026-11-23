"""「수학 원리 돋보기」 개념 차근차근 126화 — 띠그래프와 원그래프

전체를 100 %로 놓고 부분의 비율을 나타냄 / 좋아하는 계절: 봄 30 %, 여름 25 %, 가을 35 %, 겨울 10 % / 띠그래프(긴 띠), 원그래프(원을 나눔), 합계 100 %
이야기: 원그래프는 1801년 플레이페어 『Statistical Breviary』 / 연습 / 출처
최종: GRADE=c ./make_final.sh 126
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


class GcEp126(ConceptScene):
    EP_NO = 126
    EP_TITLE = "띠그래프와 원그래프"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        data = [("봄", 30, GREEN), ("여름", 25, ORANGE), ("가을", 35, "#C0582A"), ("겨울", 10, BLUE)]
        self.section("띠그래프")
        W = 10.0
        x = -5.0
        band = VGroup()
        for nm, p, c in data:
            r = Rectangle(width=W * p / 100, height=1.0, fill_color=c, fill_opacity=0.8, stroke_color=INK, stroke_width=3).move_to([x + W * p / 200, 1.2, 0])
            band.add(VGroup(r, M(f"{nm}\n{p} %", 30).move_to(r)))
            x += W * p / 100
        self.say("전체를 긴 띠로", "좋아하는 계절을 조사했어요. 전체를 100퍼센트인 긴 띠로 놓고, 계절마다 비율만큼 나누면 띠그래프예요.")
        self.play(LaggedStart(*[FadeIn(b_) for b_ in band], lag_ratio=0.3), run_time=1.2)
        t = M(f"30 + 25 + 35 + 10 = {g('100 %')}", 44).move_to([0, -0.2, 0])
        self.play(FadeIn(t), run_time=0.4)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.5)
        self.section("원그래프")
        pie = VGroup()
        start = PI / 2
        for nm, p, c in data:
            a = 2 * PI * p / 100
            s = Sector(radius=1.8, start_angle=start, angle=-a, fill_color=c, fill_opacity=0.8, stroke_color=INK, stroke_width=3).move_arc_center_to([-2.6, 0.3, 0])
            mid = start - a / 2
            lab = M(f"{nm} {p} %", 28).move_to(np.array([-2.6, 0.3, 0]) + 1.1 * np.array([np.cos(mid), np.sin(mid), 0]))
            pie.add(VGroup(s, lab))
            start -= a
        self.say("원을 비율만큼 나누면", "원 전체를 100퍼센트로 놓고 비율만큼 나누면 원그래프예요. 전체에서 각 부분이 얼마나 차지하는지 한눈에 보여요.")
        self.play(LaggedStart(*[FadeIn(p_) for p_ in pie], lag_ratio=0.3), run_time=1.2)
        t = M(f"가장 많은 계절: {g('가을')} (35 %)\n가을은 겨울의 3.5배", 38).move_to([3.0, 0.8, 0])
        t2 = M("원그래프는 1801년 영국 플레이페어의\n책에 처음 실렸다고 알려져 있어요", 32, SOFT).move_to([3.0, -0.8, 0])
        self.play(FadeIn(t), run_time=0.4)
        self.say("원그래프의 처음", "원그래프는 1801년 영국의 플레이페어가 쓴 책에 처음 실렸다고 알려져 있어요.")
        self.play(FadeIn(t2), run_time=0.4)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)
        self.ask("반 학생 20명 중 5명이 겨울을 좋아하면 몇 %?", "몇 %일까요?", "연습해 볼까요? 반 학생 20명 중 5명이 겨울을 좋아하면 원그래프에 몇 퍼센트로 나타낼까요?",
                 f"5 ÷ 20 = 0.25 → {g('25 %')}", f"{g('25 %')}", "5 나누기 20은 0.25, 100을 곱하면 25퍼센트예요.", qsize=48)
        show_sources(self, ["· 플레이페어의 원그래프(1801, 『Statistical Breviary』): M. Friendly, 'A Brief History of Data Visualization'"])
        self.closing(f"전체를 100 %로 놓고 비율을 나타내요\n{o('띠그래프')}: 긴 띠 · {b('원그래프')}: 원을 나눔",
                     next_preview="개념 차근차근 127화 · 그래프 고르고 읽기")
        self.wait(0.5)
