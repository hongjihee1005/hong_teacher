"""「수학 원리 돋보기」 개념 차근차근 86화 — 다각형·정다각형·대각선

선분으로만 둘러싸인 도형: 다각형(변의 수로 이름) / 정다각형: 변의 길이·각의 크기가 모두 같음(마름모는 각이 달라 아님)
대각선: 이웃하지 않는 두 꼭짓점을 이은 선분 — 사각형 2개, 오각형 5개, 육각형 9개 / 연습
최종: GRADE=c ./make_final.sh 86
"""
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
from conceptkit import poly, regular, right_mark
from manim import Rectangle, Square, Circle, Triangle, Polygon, Angle, Arc, Dot, Ellipse, RoundedRectangle, ORIGIN, PI


class GcEp86(ConceptScene):
    EP_NO = 86
    EP_TITLE = "다각형·정다각형·대각선"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.step("다각형과 정다각형", [(f"선분으로만 둘러싸인 도형: {b('다각형')} (오각형, 육각형, 칠각형 …)", 42, 1.4),
                  (f"변의 길이와 각의 크기가 모두 같으면: {o('정다각형')}", 44, 0.4),
                  ("마름모는 변은 같지만 각이 달라서 정다각형이 아니에요", 38, -0.6)],
                  "다각형과 정다각형", "선분으로만 둘러싸인 도형을 다각형이라고 해요. 그중 변의 길이와 각의 크기가 모두 같은 도형이 정다각형이에요. 마름모는 각이 달라 정다각형이 아니에요.")
        self.section("대각선")
        ps = VGroup(regular(4, 1.0, BLUE, start=45), regular(5, 1.0, ORANGE), regular(6, 1.0, GREEN)).arrange(RIGHT, buff=1.4).move_to([0, 0.9, 0])
        self.say("이웃하지 않는 두 꼭짓점을 이으면", "이웃하지 않는 두 꼭짓점을 이은 선분을 대각선이라고 해요. 사각형, 오각형, 육각형에 대각선을 모두 그어 볼까요?")
        self.play(FadeIn(ps), run_time=0.6)
        counts = []
        for p_ in ps:
            vs = p_.get_vertices()
            n = len(vs)
            ds = VGroup(*[Line(vs[i], vs[j], color=INK, stroke_width=3) for i in range(n) for j in range(i + 2, n) if not (i == 0 and j == n - 1)])
            counts.append(len(ds))
            self.play(Create(ds, lag_ratio=0.1), run_time=0.8)
        labs = VGroup(*[M(f"{c}개", 40, GREEN).next_to(p_, DOWN, buff=0.3) for c, p_ in zip(counts, ps)])
        self.say("2개, 5개, 9개", "사각형은 2개, 오각형은 5개, 육각형은 9개. 꼭짓점이 많을수록 대각선도 많아져요. 삼각형에는 대각선이 없어요.")
        self.play(FadeIn(labs), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.5)
        self.ask("삼각형에는 왜 대각선이 없을까요?", "삼각형의 대각선은?", "연습해 볼까요? 삼각형에는 왜 대각선이 없을까요?",
                 f"세 꼭짓점이 모두 서로 {g('이웃해')} 있어서", "모두 이웃해요", "삼각형은 세 꼭짓점이 모두 서로 이웃해 있어서 이웃하지 않는 두 꼭짓점이 없어요.", qsize=56, asize=50)
        self.closing(f"{b('다각형')}: 선분으로 둘러싸인 도형 · {o('정다각형')}: 변과 각이 모두 같음\n{g('대각선')}: 이웃하지 않는 두 꼭짓점을 이은 선분",
                     next_preview="개념 차근차근 87화 · 밀기·뒤집기·돌리기")
        self.wait(0.5)
