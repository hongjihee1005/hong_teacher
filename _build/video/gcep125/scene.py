"""「수학 원리 돋보기」 개념 차근차근 125화 — 일이 일어날 가능성

말로: 불가능하다 ~ 반반이다 ~ 확실하다 / 수로: 0, 1/2, 1 / 동전 그림면이 나올 가능성 1/2, 주사위 7이 나올 가능성 0
이야기: 1654년 파스칼과 페르마가 '놀이를 중간에 멈추면 상을 어떻게 공평하게 나눌까'를 편지로 의논 → 확률 계산의 출발점으로 여겨짐 / 연습 / 출처
최종: GRADE=c ./make_final.sh 125
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


class GcEp125(ConceptScene):
    EP_NO = 125
    EP_TITLE = "일이 일어날 가능성"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("말과 수로 나타내기")
        line = Line([-5.5, 0.6, 0], [5.5, 0.6, 0], color=INK, stroke_width=5)
        marks = VGroup()
        for x, w_, n in [(-5.5, "불가능하다", "0"), (-2.75, "~아닐 것 같다", ""), (0, "반반이다", "1/2"), (2.75, "~일 것 같다", ""), (5.5, "확실하다", "1")]:
            marks.add(VGroup(Line([x, 0.4, 0], [x, 0.8, 0], color=INK, stroke_width=4), M(w_, 30).move_to([x, 1.2, 0]), T(n, 40, ORANGE).move_to([x, 0.0, 0])))
        self.say("가능성을 말과 수로", "어떤 일이 일어날 가능성은 불가능하다부터 확실하다까지 말로 나타낼 수 있고, 0부터 1까지의 수로도 나타낼 수 있어요.")
        self.play(Create(line), FadeIn(marks, lag_ratio=0.2), run_time=1.2)
        ex = M(f"동전을 던져 그림면 → {g('1/2')} · 주사위에서 7 → {o('0')} · 내일 해가 뜸 → {b('1')}", 36).move_to([0, -1.3, 0])
        self.say("예를 들어", "동전을 던져 그림면이 나올 가능성은 반반이라 2분의 1, 주사위에서 7이 나올 가능성은 불가능해서 0, 내일 아침 해가 뜰 가능성은 확실해서 1이에요.")
        self.play(FadeIn(ex), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.5)
        self.step("이야기: 가능성을 수로", [(f"{o('1654년')} 프랑스의 {b('파스칼')}과 {b('페르마')}", 46, 1.4),
                  ("\"놀이를 중간에 멈추면 상을 어떻게 공평하게 나눌까?\"", 40, 0.5),
                  ("편지로 함께 푼 이 문제가 가능성을 수로 따지는 수학의 출발점이 되었다고 해요", 34, -0.4)],
                  "파스칼과 페르마의 편지", "1654년 프랑스의 수학자 파스칼과 페르마는 놀이를 중간에 멈추면 상을 어떻게 공평하게 나눌지를 편지로 의논했어요. 이것이 가능성을 수로 따지는 수학, 확률의 출발점으로 여겨져요.", hold=1.6)
        self.ask("빨간 구슬 2개, 파란 구슬 2개 주머니에서 빨간 구슬을 꺼낼 가능성은?", "수로 나타내면?", "연습해 볼까요? 빨간 구슬 2개, 파란 구슬 2개가 든 주머니에서 하나를 꺼낼 때 빨간 구슬일 가능성을 수로 나타내 보세요.",
                 f"반반이에요 → {g('1/2')}", f"{g('1/2')}", "빨강과 파랑이 같은 수라서 반반, 2분의 1이에요.", qsize=40)
        show_sources(self, ["· 파스칼과 페르마의 편지(1654): APS News 'Pascal's letters to Fermat', 요크 대학교 통계사 자료"])
        self.closing(f"가능성: {o('불가능')} 0 · 반반 1/2 · {b('확실')} 1\n1654년 파스칼과 페르마의 편지에서 시작되었다고 해요",
                     next_preview="개념 차근차근 126화 · 띠그래프와 원그래프")
        self.wait(0.5)
