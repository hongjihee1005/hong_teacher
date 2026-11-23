"""「수학 원리 돋보기」 개념 차근차근 88화 — 합동

포개었을 때 완전히 겹치는 두 도형 → 합동 / 대응점·대응변·대응각, 대응변 길이·대응각 크기가 같음 / 크기가 다르면 합동 아님 / 연습
최종: GRADE=c ./make_final.sh 88
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
from manim import Rectangle, Square, Circle, Triangle, Polygon, Angle, Arc, Dot, DashedLine, Rotate, PI


class GcEp88(ConceptScene):
    EP_NO = 88
    EP_TITLE = "합동"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("포개어 보면")
        t1 = poly([(-1.2, -0.8), (1.0, -0.8), (-0.4, 1.0)], BLUE).move_to([-3.2, 0.5, 0])
        t2 = t1.copy().set_fill(ORANGE, 0.45).rotate(PI).move_to([3.2, 0.5, 0])
        self.say("두 삼각형을 포개어 보면", "두 삼각형을 포개어 볼까요?")
        self.play(FadeIn(t1), FadeIn(t2), run_time=0.5)
        c = t2.copy()
        self.play(c.animate.rotate(PI).move_to(t1.get_center()), run_time=1.2)
        t = M(f"완전히 겹쳐요 → {g('합동')}", 52).move_to([0, -1.5, 0])
        self.say(f"완전히 겹치면 {g('합동')}", "모양과 크기가 같아 완전히 겹쳐요. 이런 두 도형을 서로 합동이라고 해요.")
        self.play(FadeIn(t), run_time=0.4)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.5)
        self.step("대응점·대응변·대응각", [("겹치는 점: 대응점 · 겹치는 변: 대응변 · 겹치는 각: 대응각", 40, 1.2),
                  (f"합동이면 대응변의 {b('길이')}가 같고, 대응각의 {o('크기')}가 같아요", 44, 0.2),
                  ("모양이 같아도 크기가 다르면 합동이 아니에요", 38, -0.8)],
                  "겹치는 짝", "포갰을 때 겹치는 점, 변, 각을 대응점, 대응변, 대응각이라고 해요. 합동인 도형은 대응변의 길이와 대응각의 크기가 같아요.")
        self.ask("합동인 두 삼각형에서 한 변이 5 cm이면 대응변은?", "대응변의 길이는?", "연습해 볼까요? 합동인 두 삼각형에서 한 변이 5센티미터이면 그 대응변의 길이는?",
                 f"{g('5 cm')} (대응변의 길이는 같아요)", f"{g('5 cm')}", "합동이면 대응변의 길이가 같으니 5센티미터예요.", qsize=46)
        self.closing(f"포개었을 때 완전히 겹치면 {g('합동')}\n대응변의 길이, 대응각의 크기가 같아요",
                     next_preview="개념 차근차근 89화 · 선대칭도형")
        self.wait(0.5)
