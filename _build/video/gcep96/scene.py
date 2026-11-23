"""「수학 원리 돋보기」 개념 차근차근 96화 — 원뿔과 구

원뿔: 밑면이 원 1개, 옆면 굽은 면, 원뿔의 꼭짓점, 모선(꼭짓점과 밑면 둘레의 한 점을 이은 선분), 높이 / 구: 공 모양, 중심·반지름 / 연습
최종: GRADE=c ./make_final.sh 96
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
from manim import Rectangle, Square, Circle, Polygon, Dot, PI
from cuboid import Cuboid
from round3d import cylinder, cone, sphere
from cubes import stack, heights_cells


class GcEp96(ConceptScene):
    EP_NO = 96
    EP_TITLE = "원뿔과 구"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("원뿔")
        cn = cone(1.1, 2.4, center=(-4.6, 0.2, 0))
        self.say("고깔 모양", "고깔처럼 밑면이 원 하나이고 옆면이 굽은 면인 입체도형을 원뿔이라고 해요.")
        self.play(FadeIn(cn), run_time=0.7)
        t = M(f"뾰족한 점: {o('원뿔의 꼭짓점')}\n꼭짓점과 밑면 둘레를 이은 선분: {b('모선')}\n꼭짓점에서 밑면에 수직인 선분: {g('높이')}", 34).move_to([1.8, 0.6, 0])
        self.say("꼭짓점, 모선, 높이", "뾰족한 점을 원뿔의 꼭짓점, 꼭짓점과 밑면의 둘레를 이은 선분을 모선이라고 해요. 모선은 셀 수 없이 많고 길이가 모두 같아요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)
        self.section("구")
        sp = sphere(1.2, center=(-4.6, 0.4, 0))
        self.say("공 모양", "공처럼 둥근 입체도형을 구라고 해요.")
        self.play(FadeIn(sp), run_time=0.6)
        t = M(f"가장 안쪽의 점: {o('구의 중심')}\n중심에서 겉면까지: {b('구의 반지름')} (모두 같아요)\n어느 쪽에서 봐도 {g('원')} 모양", 34).move_to([1.8, 0.6, 0])
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)
        self.ask("위에서 본 모양: 원기둥·원뿔·구", "위에서 보면?", "연습해 볼까요? 원기둥, 원뿔, 구를 위에서 보면 어떤 모양일까요?",
                 f"셋 다 {g('원')} (원뿔은 가운데에 꼭짓점이 보여요)", "모두 원", "셋 다 위에서 보면 원 모양이에요. 앞에서 보면 원기둥은 직사각형, 원뿔은 삼각형, 구는 원이에요.", qsize=56, asize=46)
        self.closing(f"{o('원뿔')}: 밑면 원 1개, 꼭짓점·모선\n{b('구')}: 공 모양, 중심에서 겉면까지 반지름이 모두 같아요",
                     next_preview="개념 차근차근 97화 · 쌓기나무: 위·앞·옆에서 본 모양")
        self.wait(0.5)
