"""「수학 원리 돋보기」 개념 차근차근 124화 — 평균

고르게 하기: 4, 6, 8, 2개 → 옮겨서 모두 5개 / 평균 = (자료의 합) ÷ (자료의 수) = 20 ÷ 4 = 5 / 평균으로 비교(모둠 인원이 다를 때) / 연습
처음 만든 사람은 알려지지 않아 말하지 않음
최종: GRADE=c ./make_final.sh 124
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


class GcEp124(ConceptScene):
    EP_NO = 124
    EP_TITLE = "평균"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("고르게 하기")
        vals = [4, 6, 8, 2]
        cols = VGroup()
        for i, v in enumerate(vals):
            cols.add(VGroup(*[Square(0.45, fill_color=BLUE, fill_opacity=0.7, stroke_color=INK, stroke_width=2).move_to([-3.0 + i * 1.6, -1.2 + k * 0.45, 0]) for k in range(v)]))
        self.say("네 친구의 책 수", "네 친구가 읽은 책이 4권, 6권, 8권, 2권이에요. 모두 똑같이 고르게 하면 한 사람에 몇 권일까요?")
        self.play(FadeIn(cols, lag_ratio=0.1), run_time=0.8)
        self.play(cols[2][7].animate.move_to([3.4, -1.2 + 2 * 0.45, 0]), cols[2][6].animate.move_to([3.4, -1.2 + 3 * 0.45, 0]),
                  cols[2][5].animate.move_to([3.4, -1.2 + 4 * 0.45, 0]), cols[1][5].animate.move_to([-3.0, -1.2 + 4 * 0.45, 0]), run_time=1.2)
        line = DashedLine([-3.8, -1.2 + 4.5 * 0.45, 0], [4.2, -1.2 + 4.5 * 0.45, 0], color=ORANGE)
        t = M(f"모두 {g('5권')}으로 고르게 → 평균 5권", 44).move_to([0, 1.9, 0])
        self.say(f"모두 {g('5권')}", "많은 쪽에서 적은 쪽으로 옮겨 고르게 하면 모두 5권이 돼요. 이 값을 평균이라고 해요.")
        self.play(Create(line), FadeIn(t), run_time=0.6)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)
        self.step("평균 구하기", [(f"(평균) = ({o('자료의 합')}) ÷ ({b('자료의 수')})", 52, 1.3),
                  (f"(4 + 6 + 8 + 2) ÷ 4 = 20 ÷ 4 = {g('5')}", 52, 0.3),
                  ("인원이 다른 두 모둠도 평균으로 비교할 수 있어요", 40, -0.7)],
                  "합 ÷ 개수", "평균은 자료를 모두 더해 자료의 수로 나누어 구해요. 20 나누기 4는 5. 인원이 다른 두 모둠도 평균으로 공평하게 비교할 수 있어요.")
        self.ask("90점, 80점, 70점, 100점의 평균은?", "평균은?", "연습해 볼까요? 네 번의 시험 점수 90, 80, 70, 100점의 평균은?",
                 f"340 ÷ 4 = {g('85점')}", f"{g('85점')}", "모두 더하면 340, 4로 나누면 85점이에요.", qsize=56)
        self.closing(f"자료를 고르게 한 값: {g('평균')}\n평균 = {o('자료의 합')} ÷ {b('자료의 수')}",
                     next_preview="개념 차근차근 125화 · 일이 일어날 가능성")
        self.wait(0.5)
