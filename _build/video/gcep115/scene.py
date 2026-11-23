"""「수학 원리 돋보기」 개념 차근차근 115화 — 원주와 원주율, 아르키메데스

원의 둘레 = 원주 / 원주 ÷ 지름은 원의 크기와 상관없이 약 3.14 → 원주율 / 원주 = 지름 × 3.14
이야기: 아르키메데스(기원전 3세기)가 원 안팎에 정96각형을 그려 3 10/71 < 원주율 < 3 1/7 / 연습 / 출처
최종: GRADE=c ./make_final.sh 115
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
from conceptkit import poly, regular
from manim import Rectangle, Square, Circle, Polygon, Dot, DashedLine, PI, Sector, AnnularSector


class GcEp115(ConceptScene):
    EP_NO = 115
    EP_TITLE = "원주와 원주율, 아르키메데스"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("원주율")
        c = Circle(radius=1.0, stroke_color=INK, stroke_width=5).move_to([-4.4, 0.6, 0])
        d = Line(c.get_left(), c.get_right(), color=BLUE, stroke_width=5)
        self.say("원의 둘레를 펼치면", "원의 둘레를 원주라고 해요. 원주를 펴서 지름과 비교하면 얼마나 길까요?")
        self.play(Create(c), Create(d), run_time=0.7)
        line = Line([-3.2, -0.8, 0], [-3.2 + 2 * PI, -0.8, 0], color=ORANGE, stroke_width=7)
        ds = VGroup(*[Line([-3.2 + 2 * k, -1.15, 0], [-1.2 + 2 * k, -1.15, 0], color=BLUE, stroke_width=7) for k in range(3)])
        self.play(Create(line), run_time=0.8)
        self.play(Create(ds, lag_ratio=0.3), run_time=0.8)
        t = M(f"원주는 지름의 약 {g('3.14배')} → {o('원주율')}", 46).move_to([1.6, 1.5, 0])
        self.say(f"약 {g('3.14배')}, 원주율", "원주는 지름의 3배보다 조금 더 길어요. 원의 크기와 상관없이 원주를 지름으로 나눈 값은 늘 약 3.14예요. 이 값을 원주율이라고 해요.")
        self.play(FadeIn(t), run_time=0.4)
        t2 = M(f"(원주) = (지름) × 3.14", 44).move_to([1.6, 0.6, 0])
        self.play(FadeIn(t2), run_time=0.4)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)
        self.section("이야기: 아르키메데스")
        c = Circle(radius=1.6, stroke_color=INK, stroke_width=4).move_to([-3.6, 0.4, 0])
        inn = regular(12, 1.6, BLUE, 0.15).move_to(c.get_center())
        out = regular(12, 1.6 / np.cos(PI / 12), ORANGE, 0.0).move_to(c.get_center())
        t1 = M(f"약 2200년 전 그리스의 {b('아르키메데스')}는\n원 안과 밖에 변이 {o('96개')}인 다각형을 그렸어요", 36).move_to([2.2, 1.3, 0])
        t2 = M(f"원주는 안쪽 다각형보다 길고 바깥쪽보다 짧아요\n→ 원주율은 {g('3과 10/71')}보다 크고 {g('3과 1/7')}보다 작다", 34).move_to([2.2, -0.3, 0])
        self.say("원 안팎에 다각형을 그려서", "약 2200년 전 그리스의 아르키메데스는 원의 안과 밖에 변이 96개인 다각형을 그렸어요. 원주가 안쪽 다각형보다 길고 바깥쪽보다 짧다는 점을 이용해, 원주율이 3.14쯤이라는 것을 밝혔어요.")
        self.play(Create(c), FadeIn(inn), Create(out), FadeIn(t1), run_time=0.9)
        self.play(FadeIn(t2), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.5)
        self.ask("지름이 10 cm인 원의 원주는?", "원주는?", "연습해 볼까요? 지름이 10센티미터인 원의 원주는 몇 센티미터일까요? 원주율은 3.14로 계산해요.",
                 f"10 × 3.14 = {g('31.4 cm')}", f"{g('31.4 cm')}", "10 곱하기 3.14, 31.4센티미터예요.", qsize=60)
        show_sources(self, ["· 아르키메데스 『원의 측정』 명제 3(정96각형, 3 10/71 &lt; π &lt; 3 1/7): 마이애미 대학교 번역 자료, 유타 대학교 수학사"])
        self.closing(f"원주 ÷ 지름 = 약 3.14: {o('원주율')}\n원주 = 지름 × 3.14 (아르키메데스는 정96각형으로 구했어요)",
                     next_preview="개념 차근차근 116화 · 원의 넓이")
        self.wait(0.5)
