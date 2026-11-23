"""「수학 원리 돋보기」 개념 차근차근 85화 — 사다리꼴·평행사변형·마름모

사다리꼴: 평행한 변이 한 쌍이라도 / 평행사변형: 마주 보는 두 쌍이 평행(마주 보는 변·각 같음) / 마름모: 네 변이 같음
사각형 가족: 정사각형은 직사각형·마름모·평행사변형·사다리꼴 / 연습
최종: GRADE=c ./make_final.sh 85
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


class GcEp85(ConceptScene):
    EP_NO = 85
    EP_TITLE = "사다리꼴·평행사변형·마름모"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("세 가지 사각형")
        sh = VGroup(poly([(-1.1, -0.7), (1.1, -0.7), (0.6, 0.7), (-0.5, 0.7)], BLUE),
                    poly([(-1.2, -0.7), (0.7, -0.7), (1.2, 0.7), (-0.7, 0.7)], ORANGE),
                    poly([(0, -1.0), (0.8, 0), (0, 1.0), (-0.8, 0)], GREEN)).arrange(RIGHT, buff=2.2).move_to([0, 1.3, 0])
        names = VGroup(M(f"{b('사다리꼴')}\n평행한 변이 한 쌍이라도", 32), M(f"{o('평행사변형')}\n마주 보는 두 쌍이 평행", 32), M(f"{g('마름모')}\n네 변의 길이가 같음", 32))
        for n_, s_ in zip(names, sh):
            n_.next_to(s_, DOWN, buff=0.35)
        self.say("평행한 변으로 이름 짓기", "평행한 변이 한 쌍이라도 있으면 사다리꼴, 마주 보는 두 쌍의 변이 모두 평행하면 평행사변형, 네 변의 길이가 모두 같으면 마름모예요.")
        self.play(LaggedStart(*[FadeIn(VGroup(s_, n_)) for s_, n_ in zip(sh, names)], lag_ratio=0.3), run_time=1.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.5)
        self.step("사각형 가족", [(f"{g('정사각형')} ⊂ {o('직사각형')} ⊂ 평행사변형 ⊂ 사다리꼴", 46, 1.3),
                  (f"{g('정사각형')} ⊂ 마름모 ⊂ 평행사변형", 46, 0.4),
                  ("정사각형은 네 가지 이름을 모두 가질 수 있어요", 40, -0.6)],
                  "정사각형은 모든 이름을 가져요", "정사각형은 네 각이 직각이라 직사각형, 네 변이 같으니 마름모, 마주 보는 변이 평행하니 평행사변형이자 사다리꼴이기도 해요.")
        self.ask("직사각형은 평행사변형일까요?", "평행사변형일까?", "연습해 볼까요? 직사각형은 평행사변형이라고 할 수 있을까요?",
                 f"{g('네')}, 마주 보는 두 쌍의 변이 평행해요", "네", "네, 직사각형은 마주 보는 두 쌍의 변이 평행하니 평행사변형이에요.", qsize=60, asize=48)
        self.closing(f"{b('사다리꼴')}: 평행 한 쌍 · {o('평행사변형')}: 평행 두 쌍\n{g('마름모')}: 네 변이 같음",
                     next_preview="개념 차근차근 86화 · 다각형·정다각형·대각선")
        self.wait(0.5)
