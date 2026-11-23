"""「수학 원리 돋보기」 개념 차근차근 90화 — 점대칭도형

한 점을 중심으로 180° 돌리면 처음과 완전히 겹치는 도형, 그 점이 대칭의 중심 / 예: 평행사변형, S자, 숫자 8 / 대응점을 이은 선분은 중심에서 둘로 똑같이 나뉨
연습: 정삼각형은 점대칭?
최종: GRADE=c ./make_final.sh 90
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


class GcEp90(ConceptScene):
    EP_NO = 90
    EP_TITLE = "점대칭도형"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("180° 돌리면 겹치는 도형")
        p = poly([(-1.6, -0.8), (0.8, -0.8), (1.6, 0.8), (-0.8, 0.8)], ORANGE, 0.5).move_to([-2.4, 0.5, 0])
        cen = Dot(p.get_center(), color=INK, radius=0.09)
        self.say("평행사변형을 180° 돌리면", "평행사변형의 가운데 점을 중심으로 180도 돌려 볼까요?")
        self.play(FadeIn(p), FadeIn(cen), run_time=0.5)
        c = p.copy().set_fill(BLUE, 0.3)
        self.play(Rotate(c, PI, about_point=p.get_center()), run_time=1.4)
        t = M(f"처음과 완전히 겹쳐요 → {g('점대칭도형')}\n돌린 점: {o('대칭의 중심')}", 40).move_to([2.8, 0.6, 0])
        self.say(f"{g('점대칭도형')}", "처음 모양과 완전히 겹쳐요. 이런 도형을 점대칭도형, 돌린 중심이 되는 점을 대칭의 중심이라고 해요.")
        self.play(FadeIn(t), run_time=0.4)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.5)
        self.step("점대칭도형 찾기", [(f"S · Z · N · 8 · 평행사변형 → {g('점대칭')}", 52, 1.2),
                  ("대응점을 이은 선분은 대칭의 중심에서 둘로 똑같이 나뉘어요", 40, 0.1)],
                  "글자와 숫자에서도", "알파벳 S, Z, N과 숫자 8도 180도 돌리면 겹치는 점대칭이에요. 대응점을 이은 선분은 대칭의 중심에서 똑같이 둘로 나뉘어요.")
        self.ask("정삼각형은 점대칭도형일까요?", "점대칭일까?", "연습해 볼까요? 정삼각형은 점대칭도형일까요?",
                 f"{o('아니에요')} (180° 돌리면 뒤집힌 모양이 돼요)", "아니에요", "정삼각형은 180도 돌리면 꼭짓점이 아래로 가서 겹치지 않아요. 점대칭도형이 아니에요.", qsize=60, asize=48)
        self.closing(f"한 점을 중심으로 {o('180°')} 돌려 겹치면 {g('점대칭도형')}\n(평행사변형, S, 8 …)",
                     next_preview="개념 차근차근 91화 · 직육면체와 정육면체")
        self.wait(0.5)
